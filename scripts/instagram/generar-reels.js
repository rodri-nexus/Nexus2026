// Arma los Reels animados de reel.html en public/ig/reels/<nombre>.mp4 (+ portada <nombre>.jpg).
// Uso: node scripts/instagram/generar-reels.js [que-hace precio packs]   (necesita Playwright y ffmpeg)
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const FPS = 30;
// ESCALA > 1 hace la animación más lenta (la usa narrar.py para que entre la voz)
const ESCALA = Number(process.env.ESCALA || 1);
// Cuadros de portada al principio del video (la miniatura de Instagram es el primer cuadro). narrar.py corre la voz lo mismo.
const PRE = Number(process.env.PRE_PORTADA ?? 2);
const reels = process.argv.slice(2).length ? process.argv.slice(2) : ["que-hace", "precio", "packs"];
// Momento del reel que se usa de portada (se ve en el perfil)
const PORTADA = { "que-hace": 1.6, precio: 2.0, envio: 2.0, packs: 2.2 };
const salida = path.join(__dirname, "..", "..", "public", "ig", "reels");

(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const b = await chromium.launch();
  for (const reel of reels) {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    await p.addInitScript((r) => (window.REEL = r), reel);
    await p.goto("file://" + path.join(__dirname, "reel.html"), { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const dur = await p.evaluate(() => window.DURACION);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "reel-"));
    const total = Math.round(dur * ESCALA * FPS);
    for (let f = 0; f < total; f++) {
      await p.evaluate((t) => window.render(t), f / FPS / ESCALA);
      await p.screenshot({ path: path.join(tmp, String(f + PRE).padStart(5, "0") + ".png"), type: "png" });
    }
    // Portada integrada: el primer cuadro del video es la portada, así Business Suite la toma sola como miniatura
    await p.evaluate((t) => window.render(t), PORTADA[reel] || 1.5);
    await p.screenshot({ path: path.join(tmp, "portada.png"), type: "png" });
    for (let f = 0; f < PRE; f++) fs.copyFileSync(path.join(tmp, "portada.png"), path.join(tmp, String(f).padStart(5, "0") + ".png"));
    execFileSync("python3", ["-c", "import sys;from PIL import Image;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],quality=97,subsampling=0)", path.join(tmp, "portada.png"), path.join(salida, `${reel}.jpg`)]);
    await p.close();
    // Pista de audio muda: algunos lectores de Instagram rechazan videos sin audio
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(tmp, "%05d.png"),
      "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-shortest", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-tune", "animation", "-pix_fmt", "yuv420p", "-profile:v", "high",
      "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", path.join(salida, `${reel}.mp4`),
    ]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(reel, dur + " s", (fs.statSync(path.join(salida, `${reel}.mp4`)).size / 1e6).toFixed(1) + " MB");
  }
  await b.close();
})();
