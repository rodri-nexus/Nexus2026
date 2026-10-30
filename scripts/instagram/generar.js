// Genera las piezas de Instagram en public/ig/ (se publican desde https://nevux.ar/ig/...).
// Uso: node scripts/instagram/generar.js semana-1   (o historias-1; necesita Playwright con Chromium)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const semana = process.argv[2] || "semana-1";
const posts = require(`./${semana}.js`);
const salida = path.join(__dirname, "..", "..", "public", "ig");
const plantilla = "file://" + path.join(__dirname, "plantilla.html");

const DESTACADAS = [
  ["que-es", "rayo"],
  ["antes-despues", "antes"],
  ["precio", "precio"],
  ["clientes", "estrella"],
  ["preguntas", "pregunta"],
];

async function sacar(b, placa, archivo, alto) {
  const p = await b.newPage({ viewport: { width: 1080, height: alto } });
  await p.addInitScript((x) => (window.PLACA = x), placa);
  await p.goto(plantilla, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: archivo, type: "jpeg", quality: 90 });
  await p.close();
}

(async () => {
  const b = await chromium.launch();
  // Historias: un archivo por día con { historias: [{ archivo, ...placa }] }, 1080x1920
  if (posts.historias) {
    const dir = path.join(salida, "historias");
    fs.mkdirSync(dir, { recursive: true });
    for (const h of posts.historias) {
      await sacar(b, { ...h, formato: "historia" }, path.join(dir, `${h.archivo}.jpg`), 1920);
    }
    console.log(posts.historias.length, "historias");
    await b.close();
    return;
  }
  for (const post of posts) {
    const dir = path.join(salida, post.carpeta);
    fs.mkdirSync(dir, { recursive: true });
    for (const [i, placa] of post.placas.entries()) {
      await sacar(b, { ...placa, pag: `${i + 1}/${post.placas.length}` }, path.join(dir, `${i + 1}.jpg`), 1350);
    }
    fs.writeFileSync(path.join(dir, "caption.txt"), post.caption + "\n");
    console.log(post.carpeta, post.placas.length, "placas");
  }
  const dir = path.join(salida, "destacadas");
  fs.mkdirSync(dir, { recursive: true });
  for (const [nombre, icono] of DESTACADAS) {
    await sacar(b, { tipo: "destacada", formato: "destacada", icono }, path.join(dir, `${nombre}.jpg`), 1920);
  }
  await b.close();
})();
