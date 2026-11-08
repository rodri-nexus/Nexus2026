// Carrusel con capturas reales de las tiendas Premium (scripts/instagram/casos/*.jpg) dentro de celulares.
// Uso: node scripts/instagram/generar-casos.js  → public/ig/07-premium/1..N.jpg (JPG 97 % 4:4:4) + caption.txt
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");
const post = require("./premium-casos.js");

(async () => {
  const dir = path.join(__dirname, "..", "..", "public", "ig", post.carpeta);
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  for (const [i, placa] of post.placas.entries()) {
    const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
    await p.addInitScript((x) => (window.PLACA = x), { ...placa, pag: `${i + 1}/${post.placas.length}` });
    await p.goto("file://" + path.join(__dirname, "casos.html"), { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => Promise.all([...document.images].map((im) => im.complete ? 0 : new Promise((r) => (im.onload = im.onerror = r)))));
    const png = path.join(dir, `${i + 1}.png`);
    await p.screenshot({ path: png, type: "png" });
    await p.close();
    execFileSync("python3", ["-c", "import sys;from PIL import Image;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],quality=97,subsampling=0,optimize=True)", png, png.replace(/png$/, "jpg")]);
    fs.rmSync(png);
  }
  fs.writeFileSync(path.join(dir, "caption.txt"), post.caption + "\n");
  console.log(post.carpeta, post.placas.length, "placas");
  await b.close();
})();
