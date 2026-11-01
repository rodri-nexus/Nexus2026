"use client";

import { useEffect, useRef, useState } from "react";

// Notebook con una demo real adentro (vista de computadora) que baja sola, como en los videos de referencia.
// Se usa para mostrar la home Premium estilo Destino en la landing y en nevux.ar/disenos.

const ANCHO = 1440;
const ALTO = 900;

export default function Notebook({ src, titulo }: { src: string; titulo: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const marco = useRef<HTMLIFrameElement>(null);
  const [escala, setEscala] = useState(0.4);

  useEffect(() => {
    const medir = () => caja.current && setEscala(caja.current.offsetWidth / ANCHO);
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, ultimo = 0, pausa = 0;
    const paso = (t: number) => {
      raf = requestAnimationFrame(paso);
      const win = marco.current?.contentWindow, doc = marco.current?.contentDocument;
      if (!win || !doc || !doc.body) return;
      const dt = ultimo ? Math.min(64, t - ultimo) : 16;
      ultimo = t;
      if (t < pausa) return;
      const max = doc.documentElement.scrollHeight - ALTO;
      if (max <= 0) return;
      if (win.scrollY >= max - 2) { pausa = t + 1600; setTimeout(() => win.scrollTo(0, 0), 1400); return; }
      win.scrollTo(0, win.scrollY + dt * 0.12);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="rounded-t-[18px] bg-[#1b1d22] p-[10px] pb-0 ring-1 ring-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]">
        <div className="mb-[8px] flex items-center gap-1.5 px-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate rounded-md bg-white/10 px-3 py-0.5 text-[10px] text-white/60">tutienda.com.ar</span>
        </div>
        <div ref={caja} className="relative w-full overflow-hidden rounded-t-[6px] bg-white" style={{ height: ALTO * escala }}>
          <iframe
            ref={marco}
            src={src}
            title={titulo}
            loading="lazy"
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
            style={{ width: ANCHO, height: ALTO, transform: `scale(${escala})` }}
          />
        </div>
      </div>
      <div className="relative mx-[-4%] h-[14px] rounded-b-[14px] bg-gradient-to-b from-[#2a2d33] to-[#15171b]">
        <div className="absolute left-1/2 top-0 h-[6px] w-[18%] -translate-x-1/2 rounded-b-md bg-[#0d0e11]" />
      </div>
    </div>
  );
}
