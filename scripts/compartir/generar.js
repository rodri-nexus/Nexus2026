// Genera public/compartir.jpg (vista previa al compartir nevux.ar) y los íconos PNG a partir de tarjeta.html y public/icon.svg.
// Uso: node scripts/compartir/generar.js  (necesita Playwright con Chromium)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const raiz = path.join(__dirname, "..", "..");

(async () => {
  const b = await chromium.launch();

  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.join(__dirname, "tarjeta.html"), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(raiz, "public", "compartir.jpg"), type: "jpeg", quality: 88 });

  // Íconos: fondo negro redondeado para iOS (apple-touch-icon) y Android (192 y 512)
  const svg = fs.readFileSync(path.join(raiz, "public", "icon.svg"), "utf8").replace(/width="100%" height="100%"/, "");
  for (const [nombre, lado] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
    const q = await b.newPage({ viewport: { width: lado, height: lado } });
    await q.setContent(`<body style="margin:0;background:#000"><div style="width:${lado}px;height:${lado}px">${svg.replace("<svg ", '<svg width="100%" height="100%" ')}</div></body>`);
    await q.screenshot({ path: path.join(raiz, "public", nombre) });
  }

  await b.close();
})();
