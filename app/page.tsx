"use client";

import { useEffect, useRef, useState } from "react";

const NEVUX_STYLES = `
:root {
  --bg: #0a0a0a;
  --bg2: #121212;
  --ink: #f4f6fb;
  --mut: #a3a3a3;
  --acc: #10B981;
  --acc2: #34D399;
  --card: #18181b;
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  color-scheme: dark;
}
*,*:before,*:after { box-sizing: inherit; }
html { scroll-behavior: smooth; height: 100%; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; overflow-x: hidden; }
em { font-style: normal; background: linear-gradient(90deg, var(--acc), var(--acc2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
h1, h2, h3 { line-height: 1.1; margin: 0 0 .4em; letter-spacing: -.02em; }
h2 { font-size: clamp(28px, 6vw, 48px); }
p { margin: 0 0 1em; color: var(--mut); }
section { padding: 72px 20px; max-width: 1000px; margin: 0 auto; }
.blob { position: fixed; width: 60vmax; height: 60vmax; border-radius: 50%; filter: blur(90px); opacity: .15; pointer-events: none; z-index: 0; animation: float 18s ease-in-out infinite alternate; }
.b1 { background: #10B981; top: -20vmax; left: -15vmax; }
.b2 { background: #047857; bottom: -25vmax; right: -20vmax; animation-delay: -8s; }
@keyframes float { to { transform: translate(8vmax, 6vmax) scale(1.15); } }
main { position: relative; z-index: 1; }
.rv { opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); }
.rv.in { opacity: 1; transform: none; }
.eyebrow { display: inline-block; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--acc2); margin-bottom: 12px; }
.hero { text-align: center; padding-top: 56px; padding-bottom: 20px; }
.btn { display: inline-block; background: linear-gradient(135deg, var(--acc), #059669); color: #fff; border: 0; border-radius: 14px; padding: 14px 22px; font: 600 16px inherit; cursor: pointer; text-decoration: none; transition: transform .2s, box-shadow .2s; box-shadow: 0 8px 28px #10b98144; text-align: center; }
.btn:hover { transform: translateY(-2px) scale(1.02); }
.btn.ghost { background: transparent; border: 1px solid #ffffff33; box-shadow: none; }
/* tour */
.tour { height: 420vh; position: relative; max-width: none; padding: 0; }
.stick { position: sticky; top: 0; height: 100vh; height: 100svh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 16px; }
.cap { text-align: center; max-width: 520px; min-height: 128px; position: relative; width: 100%; }
.cap div { position: absolute; inset: 0; opacity: 0; transform: translateY(16px); transition: .5s; pointer-events: none; }
.cap div.on { opacity: 1; transform: none; pointer-events: auto; }
.cap h3 { font-size: clamp(24px, 5vw, 34px); }
.cap p { margin: 0; }
.dots { display: flex; gap: 8px; }
.dots i { width: 8px; height: 8px; border-radius: 9px; background: #ffffff33; transition: .4s; }
.dots i.on { width: 26px; background: var(--acc2); }
.phone { width: min(260px, 62vw, 34vh); aspect-ratio: 9/18; border: 8px solid #18181b; border-radius: 34px; background: #fff; overflow: hidden; position: relative; box-shadow: 0 30px 80px #000a, 0 0 0 2px #ffffff22; transform: rotate(var(--r, 0deg)); transition: transform .3s; }
.phone:before { content: ""; position: absolute; top: 6px; left: 50%; width: 70px; height: 16px; margin-left: -35px; background: #18181b; border-radius: 12px; z-index: 3; }
.inner { will-change: transform; color: #18181b; font-size: 12px; padding: 30px 12px 80px; background: #fff; }
.inner p { color: #52525b; margin: 0 0 8px; font-size: 11px; }
.pimg { height: 150px; border-radius: 12px; background: radial-gradient(circle at 30% 25%, #34d399, #059669 60%, #0a0a0a); display: grid; place-items: center; font-size: 64px; margin-bottom: 10px; }
.price { font-size: 22px; font-weight: 800; }
.price small { font-size: 11px; color: #059669; display: block; font-weight: 600; }
.pack { border: 2px solid #e4e4e7; border-radius: 10px; padding: 8px 10px; margin: 6px 0; display: flex; justify-content: space-between; cursor: pointer; transition: .25s; font-size: 11px; }
.pack.sel { border-color: var(--acc); background: #f0fdf4; transform: scale(1.02); }
.pack b { display: block; }
.tag { background: var(--acc); color: #fff; font-size: 9px; border-radius: 6px; padding: 1px 5px; margin-left: 4px; }
.cmp { width: 100%; border-collapse: collapse; font-size: 11px; margin: 8px 0; }
.cmp td, .cmp th { border-bottom: 1px solid #e4e4e7; padding: 5px; text-align: center; }
.cmp td:first-child { text-align: left; }
.ok { color: #10b981; font-weight: 700; }
.no { color: #ef4444; font-weight: 700; }
.vid { height: 90px; border-radius: 10px; background: linear-gradient(135deg, #18181b, #064e3b); display: grid; place-items: center; color: #fff; font-size: 26px; margin: 8px 0; }
.atc { position: absolute; left: 0; right: 0; bottom: 0; background: #fff; border-top: 1px solid #e4e4e7; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; z-index: 2; color: #18181b; font-size: 11px; }
.atc span { background: #18181b; color: #fff; border-radius: 8px; padding: 7px 12px; font-weight: 700; font-size: 11px; }
.toast { position: absolute; left: 8px; right: 8px; bottom: 56px; background: #18181b; color: #fff; border-radius: 10px; padding: 7px 9px; font-size: 10px; z-index: 2; display: flex; gap: 6px; align-items: center; transform: translateY(140%); opacity: 0; transition: .5s; }
.toast.show { transform: none; opacity: 1; }
.skip { position: absolute; right: 16px; bottom: 16px; color: var(--mut); font-size: 13px; text-decoration: none; border: 1px solid #ffffff22; border-radius: 20px; padding: 6px 12px; }
/* signup */
.cta { background: linear-gradient(160deg, var(--bg2), var(--card)); border: 1px solid #ffffff1a; border-radius: 24px; padding: 32px 22px; margin: 0 20px; }
.seg { display: inline-flex; background: #0006; border-radius: 12px; padding: 4px; margin: 6px 0 14px; }
.seg button { border: 0; background: none; color: var(--mut); padding: 8px 16px; border-radius: 9px; font: 600 14px inherit; cursor: pointer; transition: .25s; }
.seg button.on { background: var(--acc); color: #fff; }
label { display: block; font-weight: 600; margin-top: 12px; font-size: 14px; }
label small { display: block; color: var(--mut); font-weight: 400; }
input { width: 100%; background: #0008; border: 1px solid #ffffff22; color: #fff; border-radius: 12px; padding: 13px; font: 16px inherit; margin-top: 6px; transition: border .2s, box-shadow .2s; }
input:focus { outline: 0; border-color: var(--acc); box-shadow: 0 0 0 4px #10b98133; }
.cta .btn { width: 100%; margin-top: 18px; }
/* steps */
.grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
.card { background: var(--card); border: 1px solid #ffffff14; border-radius: 18px; padding: 20px; transition: transform .3s, border-color .3s; }
.card:hover { transform: translateY(-6px); border-color: var(--acc); }
.card b { display: block; font-size: 18px; margin-bottom: 4px; }
.card p { margin: 0; }
.n { color: var(--acc2); font-size: 12px; letter-spacing: .14em; }
.aida .l { font: 800 44px/1 system-ui; background: linear-gradient(135deg, var(--acc), var(--acc2)); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 8px; }
.tpl .thumb { height: 120px; border-radius: 12px; margin-bottom: 12px; display: grid; place-items: center; color: #fff; font: 600 13px inherit; transition: transform .3s; }
.card:hover .thumb { transform: scale(1.04) rotate(-1deg); }
.badge { font-size: 11px; background: #34d39922; color: var(--acc2); border-radius: 20px; padding: 2px 9px; margin-left: 6px; }
footer { text-align: center; padding: 40px 20px 60px; color: var(--mut); font-size: 13px; }
@media (prefers-reduced-motion: reduce) { *, *:before, *:after { animation: none !important; transition: none !important; } .rv { opacity: 1; transform: none; } }
`;

export default function Page() {
  const tourRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const capsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLElement | null)[]>([]);
  const toastRef = useRef<HTMLDivElement>(null);
  const packsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeTab, setActiveTab] = useState("Tiendanube");

  // Intersection Observer for scroll reveals (.rv elements)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".rv").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll-driven tour logic
  useEffect(() => {
    let cur = -1;
    let tt: NodeJS.Timeout;

    const update = () => {
      const tour = tourRef.current;
      const inner = innerRef.current;
      const phone = phoneRef.current;
      const toast = toastRef.current;

      if (!tour || !inner || !phone) return;

      const r = tour.getBoundingClientRect();
      const total = tour.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const screenH = phone.clientHeight - 16;
      const max = Math.max(0, inner.scrollHeight - screenH);

      inner.style.transform = `translateY(${-p * max}px)`;
      phone.style.setProperty("--r", `${(p - 0.5) * -6}deg`);

      const i = Math.min(3, Math.floor(p * 4));
      if (i !== cur) {
        cur = i;
        capsRef.current.forEach((c, k) => {
          if (c) c.classList.toggle("on", k === i);
        });
        dotsRef.current.forEach((d, k) => {
          if (d) d.classList.toggle("on", k === i);
        });

        if (i === 1) selectPack(2);
        if (i === 0) selectPack(1);

        if (i === 3) {
          clearTimeout(tt);
          if (toast) toast.classList.add("show");
          tt = setTimeout(() => {
            if (toast) toast.classList.remove("show");
          }, 3200);
        } else if (toast) {
          toast.classList.remove("show");
        }
      }
    };

    const selectPack = (n: number) => {
      packsRef.current.forEach((k, j) => {
        if (k) k.classList.toggle("sel", j === n);
      });
    };

    const onScroll = () => requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      clearTimeout(tt);
    };
  }, []);

  const selectPackManual = (index: number) => {
    packsRef.current.forEach((k, j) => {
      if (k) k.classList.toggle("sel", j === index);
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NEVUX_STYLES }} />
      
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      
      <main>
        <section className="hero rv">
          <span className="eyebrow">Mirala por dentro</span>
          <h1 style={{ fontSize: "clamp(34px,8vw,64px)" }}>
            Una landing <em>Nevux</em>, de punta a punta.
          </h1>
          <p style={{ fontSize: "18px" }}>Deslizá y recorrela como la ve tu cliente.</p>
        </section>

        <section className="tour" id="tour" ref={tourRef}>
          <div className="stick">
            <div className="phone" id="phone" ref={phoneRef}>
              <div className="inner" id="inner" ref={innerRef}>
                <b style={{ letterSpacing: ".2em", fontSize: "11px" }}>CUMBRE</b>
                <div className="pimg" style={{ marginTop: "8px" }}>🧉</div>
                <div style={{ color: "#f5a623", fontSize: "11px" }}>
                  ★★★★★ <span style={{ color: "#52525b" }}>4,9 · 128 opiniones</span>
                </div>
                <b style={{ fontSize: "15px" }}>Termo Cumbre 750 ml</b>
                <div className="price">
                  $38.900
                  <small>3 cuotas sin interés de $12.966 · $36.955 con transferencia</small>
                </div>
                <h4 style={{ margin: "12px 0 4px", fontSize: "14px" }}>
                  ¿El mate se te enfría a la hora?
                </h4>
                <p>Cumbre lo mantiene caliente todo el día, sin que tengas que volver a calentar el agua.</p>
                <p>
                  <b>1</b> Caliente 24 h, frío 36 h<br />
                  <b>2</b> Acero inoxidable 18/8<br />
                  <b>3</b> Pico cebador antigoteo
                </p>
                <b style={{ fontSize: "12px" }}>Elegí tu pack</b>
                
                <div ref={(el) => { if(el) packsRef.current[0] = el; }} className="pack" onClick={() => selectPackManual(0)}>
                  <div><b>Llevá 1</b>Precio de lista</div>
                  <div>$38.900</div>
                </div>
                <div ref={(el) => { if(el) packsRef.current[1] = el; }} className="pack sel" onClick={() => selectPackManual(1)}>
                  <div><b>Llevá 2 · 15% OFF <span className="tag">MÁS ELEGIDO</span></b>Ahorrás $11.670</div>
                  <div>$66.130</div>
                </div>
                <div ref={(el) => { if(el) packsRef.current[2] = el; }} className="pack" onClick={() => selectPackManual(2)}>
                  <div><b>Llevá 3 · 20% OFF</b>Ahorrás $23.340</div>
                  <div>$93.360</div>
                </div>

                <b style={{ fontSize: "12px", display: "block", marginTop: "12px" }}>Miralo en uso</b>
                <div className="vid">▶</div>
                <p>6 horas después, sigue a 80°</p>
                <b style={{ fontSize: "12px" }}>Cumbre vs. genérico</b>
                <table className="cmp">
                  <tbody>
                    <tr><th></th><th>Cumbre</th><th>Genérico</th></tr>
                    <tr><td>Caliente 24 h</td><td className="ok">✓</td><td className="no">✕</td></tr>
                    <tr><td>Acero 18/8</td><td className="ok">✓</td><td className="no">✕</td></tr>
                    <tr><td>Antigoteo</td><td className="ok">✓</td><td className="no">✕</td></tr>
                    <tr><td>Garantía 1 año</td><td className="ok">✓</td><td className="no">✕</td></tr>
                  </tbody>
                </table>
                <p>Preguntas frecuentes · Envíos · Cambios</p>
              </div>
              
              <div className="toast" id="toast" ref={toastRef}>
                🧉 <span><b>Alguien de Córdoba</b> compró 2 termos hace 3 minutos</span>
              </div>
              <div className="atc">
                <div><b>$38.900</b><br />3 cuotas sin interés</div>
                <span>Agregar al carrito</span>
              </div>
            </div>
            
            <div className="cap" id="cap">
              <div ref={(el) => { if(el) capsRef.current[0] = el; }} className="on">
                <span className="n">01 · CONVERSIÓN</span>
                <h3>Más ventas con las <em>mismas visitas</em>.</h3>
                <p>Una página que explica, convence y vende sola.</p>
              </div>
              <div ref={(el) => { if(el) capsRef.current[1] = el; }}>
                <span className="n">02 · TICKET</span>
                <h3>Que la gente <em>lleve más</em>.</h3>
                <p>Llevá 1, llevá 2: el descuento crece con la cantidad.</p>
              </div>
              <div ref={(el) => { if(el) capsRef.current[2] = el; }}>
                <span className="n">03 · VIDEO</span>
                <h3>Que se entienda <em>en segundos</em>.</h3>
                <p>Tu video, justo donde la gente decide.</p>
              </div>
              <div ref={(el) => { if(el) capsRef.current[3] = el; }}>
                <span className="n">04 · CONFIANZA</span>
                <h3>Que te <em>elijan a vos</em>.</h3>
                <p>Tu marca contra la genérica, punto por punto.</p>
              </div>
            </div>
            
            <div className="dots" id="dots">
              <i ref={(el) => { if(el) dotsRef.current[0] = el; }} className="on"></i>
              <i ref={(el) => { if(el) dotsRef.current[1] = el; }}></i>
              <i ref={(el) => { if(el) dotsRef.current[2] = el; }}></i>
              <i ref={(el) => { if(el) dotsRef.current[3] = el; }}></i>
            </div>
            <a className="skip" href="https://mpago.la/1LqFYin">Saltar ↓</a>
          </div>
        </section>

        <section id="signup" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="cta rv">
            <h2>Tu producto, con <em>esta landing</em>.</h2>
            <p>Instalala en minutos y aumentá tus conversiones.</p>
            <h3 style={{ fontSize: "22px", marginTop: "20px" }}>Pack Landing Page Pro</h3>
            <p style={{ margin: 0 }}>Todo incluido por $39.900 ARS/mes.</p>
            <label>¿Tu tienda es de…?</label>
            <div className="seg" id="seg">
              <button 
                className={activeTab === "Tiendanube" ? "on" : ""} 
                onClick={() => setActiveTab("Tiendanube")}
              >
                Tiendanube
              </button>
              <button 
                className={activeTab === "Shopify" ? "on" : ""} 
                onClick={() => setActiveTab("Shopify")}
              >
                Shopify
              </button>
            </div>
            <label>
              Link de tu tienda
              <small id="hint">El de tu {activeTab}.</small>
              <input type="url" placeholder="https://mitienda.com" />
            </label>
            <label>
              Tu email
              <small>A donde enviaremos los archivos y accesos.</small>
              <input type="email" placeholder="tu@email.com" />
            </label>
            <p style={{ fontSize: "12px", marginTop: "12px" }}>
              Al suscribirte serás redirigido a Mercado Pago para confirmar tu pago seguro. Inmediatamente después recibirás acceso automático.
            </p>
            <a href="https://mpago.la/1LqFYin" className="btn block" style={{ width: "100%", marginTop: "18px" }}>
              Obtener Pack Pro - $39.900/mes
            </a>
            <p style={{ textAlign: "center", margin: "14px 0 0" }}>
              ¿Tenés dudas? <a href="https://wa.me/5493435042812" style={{ color: "#fff", fontWeight: "bold" }}>Contactar por WhatsApp</a>
            </p>
          </div>
        </section>

        <section className="rv">
          <h2>Cómo se pone en tu tienda</h2>
          <p>Tres pasos. En Tiendanube y en Shopify.</p>
          <div className="grid">
            <div className="card"><span className="n">PASO 1</span><b>Elegís una plantilla</b><p>La que va con tu producto.</p></div>
            <div className="card"><span className="n">PASO 2</span><b>Cambiás textos y fotos</b><p>Tocando arriba del diseño.</p></div>
            <div className="card"><span className="n">PASO 3</span><b>Conectás tu tienda</b><p>Un renglón, una sola vez.</p></div>
          </div>
        </section>

        <section className="rv aida">
          <h2>Por qué vende</h2>
          <p>Una ficha que explica vende más que una lista de características.</p>
          <div className="grid">
            <div className="card"><div className="l">A</div><b>Atracción</b><p>Habla de lo que le pasa a tu cliente.</p></div>
            <div className="card"><div className="l">I</div><b>Interés</b><p>Convierte características en beneficios.</p></div>
            <div className="card"><div className="l">D</div><b>Deseo</b><p>Muestra el producto en uso.</p></div>
            <div className="card"><div className="l">A</div><b>Acción</b><p>Saca la última duda y lleva al carrito.</p></div>
          </div>
          <p style={{ marginTop: "20px", color: "var(--ink)", fontWeight: 600 }}>
            Tu competencia lista características. Vos, resultados.
          </p>
        </section>

        <section className="rv tpl">
          <h2>Las plantillas</h2>
          <p>Mirá cómo queda antes de decidir. <span className="badge">3 disponibles</span></p>
          <div className="grid">
            <div className="card">
              <div className="thumb" style={{ background: "linear-gradient(135deg,#10B981,#34D399)" }}>0:22</div>
              <b>Clásica</b>
              <p>La más completa. Sirve para todo.</p>
              <a href="https://mpago.la/1LqFYin" className="btn ghost" style={{ padding: "9px 14px", marginTop: "12px", display: "inline-block" }}>Obtener diseño</a>
            </div>
            <div className="card">
              <div className="thumb" style={{ background: "linear-gradient(135deg,#f5a623,#d9455b)" }}>0:18</div>
              <b>Antes y después</b>
              <p>Para productos donde se ve el cambio.</p>
              <a href="https://mpago.la/1LqFYin" className="btn ghost" style={{ padding: "9px 14px", marginTop: "12px", display: "inline-block" }}>Obtener diseño</a>
            </div>
            <div className="card">
              <div className="thumb" style={{ background: "linear-gradient(135deg,#0a0a0a,#18181b)" }}>0:20</div>
              <b>Oscura premium <span className="badge">Nueva</span></b>
              <p>Para indumentaria y marcas premium.</p>
              <a href="https://mpago.la/1LqFYin" className="btn ghost" style={{ padding: "9px 14px", marginTop: "12px", display: "inline-block" }}>Obtener diseño</a>
            </div>
          </div>
        </section>
      </main>
      <footer>Nevux · Términos y Condiciones · Política de Privacidad · © 2026</footer>
    </>
  );
        }
