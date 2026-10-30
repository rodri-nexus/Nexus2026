// Arma los Reels animados de reel.html en public/ig/reels/<nombre>.mp4 (+ portada <nombre>.jpg).
// Uso: node scripts/instagram/generar-reels.js [que-hace precio packs]   (necesita Playwright y ffmpeg)
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const FPS = 30;
const reels = process.argv.slice(2).length ? process.argv.slice(2) : ["que-hace", "precio", "packs"];
// Momento del reel que se usa de portada (se ve en el perfil)
const PORTADA = { "que-hace": 1.6, precio: 2.0, packs: 2.2 };
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
    const total = Math.round(dur * FPS);
    for (let f = 0; f < total; f++) {
      await p.evaluate((t) => window.render(t), f / FPS);
      await p.screenshot({ path: path.join(tmp, String(f).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 92 });
    }
    await p.evaluate((t) => window.render(t), PORTADA[reel] || 1.5);
    await p.screenshot({ path: path.join(salida, `${reel}.jpg`), type: "jpeg", quality: 90 });
    await p.close();
    // Pista de audio muda: algunos lectores de Instagram rechazan videos sin audio
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(tmp, "%05d.jpg"),
      "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-shortest", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-profile:v", "high",
      "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", path.join(salida, `${reel}.mp4`),
    ]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(reel, dur + " s", (fs.statSync(path.join(salida, `${reel}.mp4`)).size / 1e6).toFixed(1) + " MB");
  }
  await b.close();
})();
