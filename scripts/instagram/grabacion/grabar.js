// Graba cuadros reales de una tienda en vivo (celular 390x693, x2,77 = 1080x1920), segmento por segmento.
// Lo llama compra.py con un plan JSON: [{ accion, cuadros, ... }]. Cada cuadro es una captura real de la página.
// Uso: node grabar.js plan.json carpeta-salida
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");
const [planArchivo, salida] = process.argv.slice(2);
const plan = JSON.parse(fs.readFileSync(planArchivo, "utf8"));

const TOQUE = `(([x, y]) => { const d = document.createElement('div'); d.className = 'nx-toque';
  d.style.cssText = 'position:fixed;left:' + (x - 28) + 'px;top:' + (y - 28) + 'px;width:56px;height:56px;border-radius:50%;background:rgba(52,211,153,.45);border:3px solid #34d399;z-index:2147483647;pointer-events:none;transform:scale(.6);transition:transform .35s,opacity .6s';
  document.body.appendChild(d); requestAnimationFrame(() => d.style.transform = 'scale(1.15)'); setTimeout(() => d.style.opacity = '0', 500); setTimeout(() => d.remove(), 1200); })`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 693 }, deviceScaleFactor: 1080 / 390 });
  const p = await ctx.newPage();
  fs.mkdirSync(salida, { recursive: true });
  let n = 0;
  const foto = async () => { await p.screenshot({ path: path.join(salida, `${String(n++).padStart(5, "0")}.png`) }); };
  const limpiar = async () => {
    const l = p.getByText("Entendido", { exact: true }).first();
    if (await l.isVisible().catch(() => false)) await l.click().catch(() => {});
  };
  const yDe = (texto) => p.evaluate((t) => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let x;
    while ((x = w.nextNode())) { const e = x.parentElement; if (x.textContent.toUpperCase().includes(t.toUpperCase()) && e.offsetParent && e.getBoundingClientRect().height) return e.getBoundingClientRect().top + scrollY; }
    return null;
  }, texto);
  const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, x)));
  // Desliza la página (o el panel del carrito) desde donde está hasta "destino" durante "k" cuadros
  const deslizar = async (destino, k, panel) => {
    const desde = await p.evaluate((sel) => sel ? document.querySelector(sel).scrollTop : scrollY, panel || null);
    for (let i = 1; i <= k; i++) {
      const y = desde + (destino - desde) * ease(i / k);
      await p.evaluate(([v, sel]) => sel ? (document.querySelector(sel).scrollTop = v) : window.scrollTo(0, v), [y, panel || null]);
      await foto();
    }
  };
  // En las pausas se repite una sola captura: si no, la cuenta regresiva y los avisos correrían acelerados
  const quieto = async (k) => {
    if (k <= 0) return;
    await foto(); const base = path.join(salida, `${String(n - 1).padStart(5, "0")}.png`);
    for (let i = 1; i < k; i++) fs.copyFileSync(base, path.join(salida, `${String(n++).padStart(5, "0")}.png`));
  };

  for (const s of plan) {
    const k = s.cuadros;
    if (s.accion === "abrir") {
      await p.goto(s.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await p.waitForTimeout(6000); await limpiar();
      // precarga de imágenes diferidas bajando y volviendo
      for (let y = 0; y < 6000; y += 500) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1500);
      await quieto(k);
    } else if (s.accion === "bajar") {
      const y = await yDe(s.texto);
      const mov = Math.round(k * 0.55);
      await deslizar(Math.max(0, y - (s.margen || 90)), mov); await quieto(k - mov);
    } else if (s.accion === "tocar") {
      // baja hasta el producto, lo toca y abre su ficha
      const y = await yDe(s.texto);
      const mov = Math.round(k * 0.3);
      await deslizar(Math.max(0, y - 300), mov);
      const r = await p.evaluate((t) => {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let x;
        while ((x = w.nextNode())) { const e = x.parentElement; if (x.textContent.toUpperCase().includes(t.toUpperCase()) && e.offsetParent) { const a = e.closest("a") || e; const q = a.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; } }
        return [195, 350];
      }, s.texto);
      await p.evaluate(eval(TOQUE), [r[0], r[1] - 120]);
      await quieto(Math.round(k * 0.12));
      await p.goto(s.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await p.waitForTimeout(5000); await limpiar();
      for (let y = 0; y < 4000; y += 500) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);
      await quieto(k - mov - Math.round(k * 0.12));
    } else if (s.accion === "carrito") {
      // baja al botón, lo toca, agrega y abre el carrito
      const btn = p.locator("text=Agregar al carrito >> visible=true").first();
      const y = await btn.evaluate((e) => e.getBoundingClientRect().top + scrollY);
      const mov = Math.round(k * 0.25);
      await deslizar(Math.max(0, y - 330), mov);
      const q = await btn.boundingBox();
      await p.evaluate(eval(TOQUE), [q.x + q.width / 2, q.y + q.height / 2]);
      await quieto(6);
      await btn.click(); await p.waitForTimeout(2500);
      await p.locator("text=Ver carrito >> visible=true").first().click({ timeout: 8000 });
      await p.waitForTimeout(2500);
      await quieto(k - mov - 6);
    } else if (s.accion === "panel") {
      // baja dentro del panel del carrito con la ruedita, hasta que "texto" quede arriba
      await p.mouse.move(195, 420);
      const top = () => p.evaluate((t) => {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let x, mejor = null;
        while ((x = w.nextNode())) { const e = x.parentElement; if (x.textContent.trim().toUpperCase().startsWith(t.toUpperCase()) && e.getBoundingClientRect().height && getComputedStyle(e).visibility !== "hidden") { const r = e.getBoundingClientRect(); if (r.width && (!mejor || r.top > mejor)) mejor = r.top; } }
        return mejor;
      }, s.texto);
      const mov = Math.round(k * 0.5);
      for (let i = 0; i < mov; i++) {
        const t = await top(); const falta = t == null ? 0 : t - (s.margen || 90);
        const paso = falta / Math.max(1, mov - i);
        if (Math.abs(falta) > 2) { await p.mouse.wheel(0, paso); await p.waitForTimeout(60); }
        await foto();
      }
      await quieto(k - mov);
    }
    console.log(s.accion, k, "cuadros");
  }
  await b.close();
})();
