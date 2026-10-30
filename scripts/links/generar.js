// Genera las miniaturas de nevux.ar/links en public/links/<nombre>.jpg a partir de miniaturas.html.
// Uso: node scripts/links/generar.js   (necesita Playwright con Chromium)
const path = require("path");
const { chromium } = require("playwright");

const MINIS = ["whatsapp", "antes-despues", "calculadora", "precio", "web"];

(async () => {
  const b = await chromium.launch();
  for (const mini of MINIS) {
    const p = await b.newPage({ viewport: { width: 480, height: 480 } });
    await p.addInitScript((m) => (window.MINI = m), mini);
    await p.goto("file://" + path.join(__dirname, "miniaturas.html"), { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(__dirname, "..", "..", "public", "links", `${mini}.jpg`), type: "jpeg", quality: 88 });
    await p.close();
  }
  await b.close();
})();
