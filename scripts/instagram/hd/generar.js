// Genera los carruseles y las historias de Hogar Digital en public/ig/hd/ (se publican desde https://nevux.ar/ig/hd/...).
// Uso: node scripts/instagram/hd/generar.js semana-1   (necesita Playwright con Chromium)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const semana = process.argv[2] || "semana-1";
const { carruseles, historias } = require(`./${semana}.js`);
const salida = path.join(__dirname, "..", "..", "..", "public", "ig", "hd");
const plantilla = "file://" + path.join(__dirname, "plantilla.html");

async function sacar(b, pieza, archivo, alto) {
  const p = await b.newPage({ viewport: { width: 1080, height: alto } });
  await p.addInitScript((x) => (window.PIEZA = x), pieza);
  await p.goto(plantilla, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.screenshot({ path: archivo, type: "jpeg", quality: 90 });
  await p.close();
}

(async () => {
  const b = await chromium.launch();
  for (const c of carruseles) {
    const dir = path.join(salida, c.carpeta);
    fs.mkdirSync(dir, { recursive: true });
    for (const [i, placa] of c.placas.entries()) {
      await sacar(b, { ...placa, formato: "post", pag: `${i + 1}/${c.placas.length}` }, path.join(dir, `${i + 1}.jpg`), 1350);
    }
    fs.writeFileSync(path.join(dir, "caption.txt"), c.caption + "\n");
    console.log(c.carpeta, c.placas.length, "placas");
  }
  const dh = path.join(salida, "historias");
  fs.mkdirSync(dh, { recursive: true });
  for (const h of historias) await sacar(b, { ...h, formato: "historia" }, path.join(dh, `${h.archivo}.jpg`), 1920);
  console.log(historias.length, "historias");
  await b.close();
})();
