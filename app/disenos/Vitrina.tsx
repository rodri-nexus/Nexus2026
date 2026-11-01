"use client";

import { useEffect, useRef, useState } from "react";

// Vitrina 3D de celulares (docs/efectos.md, E22): el diseño elegido va al centro y los otros dos, girados, a los costados.
// Cada celular es la demo real (public/demo/disenos/) y baja sola; al llegar al final vuelve arriba.

export type Diseno = { id: string; nombre: string; plan: string; demo: string };

const ANCHO = 390;
const ALTO = 844;

function Celular({ d, pos, onClick, base }: { d: Diseno; pos: "centro" | "izq" | "der"; onClick: () => void; base: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    let raf = 0;
    let pausa = 0;
    let ultimo = 0;
    const paso = (t: number) => {
      raf = requestAnimationFrame(paso);
      const win = ref.current?.contentWindow;
      const doc = ref.current?.contentDocument;
      if (!win || !doc || !doc.body) return;
      const dt = ultimo ? Math.min(64, t - ultimo) : 16;
      ultimo = t;
      if (t < pausa) return;
      const max = doc.documentElement.scrollHeight - ALTO;
      if (max <= 0) return;
      if (win.scrollY >= max - 2) {
        pausa = t + 1400;
        setTimeout(() => win.scrollTo(0, 0), 1200);
        return;
      }
      win.scrollTo(0, win.scrollY + dt * (pos === "centro" ? 0.07 : 0.05));
    };
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!quieto) raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  const centro = pos === "centro";
  const escala = centro ? base : base * 0.76;
  const giro = pos === "izq" ? "rotateY(32deg)" : pos === "der" ? "rotateY(-32deg)" : "rotateY(0deg)";
  const lado = Math.round(ANCHO * base * 0.82);
  const mover = pos === "izq" ? `-${lado}px` : pos === "der" ? `${lado}px` : "0px";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={centro ? d.nombre : `Ver ${d.nombre}`}
      className="absolute left-1/2 top-0 transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
      style={{
        width: ANCHO * escala + 20,
        height: ALTO * escala + 20,
        transform: `translateX(calc(-50% + ${mover})) ${giro} translateZ(${centro ? 0 : -120}px)`,
        zIndex: centro ? 3 : 1,
        opacity: centro ? 1 : 0.55,
        filter: centro ? "none" : "brightness(.6)",
        cursor: centro ? "default" : "pointer",
      }}
    >
      <div className="w-full h-full rounded-[36px] bg-[#0b0d12] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/10">
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-white">
          <iframe
            ref={ref}
            src={d.demo}
            title={d.nombre}
            loading="lazy"
            className="absolute left-0 top-0 border-0 origin-top-left pointer-events-none"
            style={{ width: ANCHO, height: ALTO, transform: `scale(${escala})` }}
          />
        </div>
      </div>
    </button>
  );
}

export default function Vitrina({ disenos }: { disenos: Diseno[] }) {
  const [i, setI] = useState(0);
  // Tamaño del celular del centro según el ancho de la pantalla (en el celular, más chico para que se vean los costados)
  const [base, setBase] = useState(0.66);
  useEffect(() => {
    const medir = () => setBase(Math.min(0.66, (window.innerWidth * 0.58) / ANCHO));
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);
  const n = disenos.length;
  const izq = (i - 1 + n) % n;
  const der = (i + 1) % n;
  const d = disenos[i];
  return (
    <div>
      <div className="relative mx-auto max-w-[760px] [perspective:1400px]" style={{ height: ALTO * base + 30 }}>
        {disenos.map((x, j) => {
          const pos = j === i ? "centro" : j === izq ? "izq" : j === der ? "der" : null;
          if (!pos) return null;
          return <Celular key={x.id} d={x} pos={pos} base={base} onClick={() => setI(j)} />;
        })}
      </div>
      <div className="mt-4 text-center">
        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.18em] text-sky-200">Plan {d.plan}</span>
        <h3 className="mt-2 text-xl font-extrabold">{d.nombre}</h3>
        <div className="mt-3 flex justify-center gap-2">
          {disenos.map((x, j) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setI(j)}
              aria-label={x.nombre}
              className={`h-2 rounded-full transition-all ${j === i ? "w-8 bg-white" : "w-2 bg-white/30"}`}
            />
          ))}
        </div>
        <a href={d.demo} target="_blank" rel="noopener" className="mt-4 inline-block text-sm font-semibold text-sky-300 underline underline-offset-4">
          Abrir la demo en grande →
        </a>
      </div>
    </div>
  );
}
