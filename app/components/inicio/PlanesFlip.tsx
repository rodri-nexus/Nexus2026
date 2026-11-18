"use client";

// Tarjeta que se da vuelta entre dos planes (Básico adelante, Premium atrás). La usan el inicio (Tiendanube y sitios web)
// y la página /sitios-web. El alto se ajusta al lado que se ve (no queda espacio vacío en el plan más corto).

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Crown, MessageCircle, RotateCw } from "lucide-react";
import { precioTexto } from "@/lib/planes";

type Plan = { nombre: string; precio: number; bajada: string; incluye: readonly string[] };

export default function PlanesFlip({
  etiqueta,
  icono,
  basico,
  premium,
  hrefBasico,
  hrefPremium,
  whatsapp = false,
  nota,
  link,
}: {
  etiqueta: string;
  icono: React.ReactNode;
  basico: Plan;
  premium: Plan;
  hrefBasico: string;
  hrefPremium: string;
  whatsapp?: boolean;
  nota: string;
  link?: { href: string; texto: string };
}) {
  const [esPremium, setPremium] = useState(false);
  const caraB = useRef<HTMLDivElement>(null);
  const caraP = useRef<HTMLDivElement>(null);
  const [alto, setAlto] = useState<number | undefined>(undefined);

  // El contenedor toma el alto del lado que se está viendo
  useEffect(() => {
    const medir = () => {
      const el = esPremium ? caraP.current : caraB.current;
      if (el) setAlto(el.offsetHeight);
    };
    medir();
    const ro = "ResizeObserver" in window ? new ResizeObserver(medir) : null;
    if (ro) { caraB.current && ro.observe(caraB.current); caraP.current && ro.observe(caraP.current); }
    window.addEventListener("resize", medir);
    return () => { ro?.disconnect(); window.removeEventListener("resize", medir); };
  }, [esPremium]);

  const selector = (
    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-black/30 p-1">
      <button type="button" onClick={() => setPremium(false)} aria-pressed={!esPremium} className={`rounded-xl px-3 py-2.5 text-[13px] font-extrabold transition-colors ${!esPremium ? "bg-emerald-400 text-black" : "text-neutral-300 hover:text-white"}`}>
        Ver plan básico
      </button>
      <button type="button" onClick={() => setPremium(true)} aria-pressed={esPremium} className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-extrabold transition-colors ${esPremium ? "bg-amber-300 text-black" : "text-neutral-300 hover:text-white"}`}>
        <Crown className="h-3.5 w-3.5" /> Ver plan premium
      </button>
    </div>
  );

  const cara = (p: Plan, oro: boolean) => {
    const propios = p.incluye.filter((t) => !/todo lo del plan/i.test(t));
    const delBasico = basico.incluye.filter((t) => !/cambios y ajustes|mantenimiento/i.test(t));
    return (
      <div className={`flex flex-col rounded-[28px] border p-6 sm:p-8 ${oro ? "border-amber-300/35 bg-gradient-to-b from-amber-300/[0.12] via-[#0d0f12] to-[#0d0f12]" : "border-emerald-400/30 bg-gradient-to-b from-emerald-500/[0.12] via-[#0d0f12] to-[#0d0f12]"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl text-black ${oro ? "bg-amber-300" : "bg-emerald-400"}`}>{oro ? <Crown className="h-6 w-6" /> : icono}</div>
          {oro && <span className="rounded-full bg-amber-300 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-black">El más completo</span>}
        </div>
        <span className={`mt-6 text-xs font-bold uppercase tracking-[0.16em] ${oro ? "text-amber-300" : "text-emerald-300"}`}>{etiqueta} · {oro ? "Premium" : "Básico"}</span>
        <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{p.nombre}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{p.bajada}</p>
        <div className="mt-6">{selector}</div>
        <ul className="mt-6 space-y-2.5">
          {propios.map((t) => (
            <li key={t} className="flex gap-2.5 text-[15px] text-neutral-200"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${oro ? "text-amber-300" : "text-emerald-300"}`} /> {t}</li>
          ))}
        </ul>
        {oro && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">Y además, todo lo del Básico</p>
            <ul className="mt-3 space-y-2">
              {delBasico.map((t) => (
                <li key={t} className="flex gap-2 text-[13.5px] text-neutral-300"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/80" /> {t}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="pt-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">{precioTexto(p.precio)}</span>
            <span className="text-sm text-neutral-400">/mes</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">{nota}</p>
          <a
            href={oro ? hrefPremium : hrefBasico}
            {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`nvx-press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-extrabold text-black ${oro ? "bg-amber-300 hover:bg-amber-200" : "bg-emerald-400 hover:bg-emerald-300"}`}
          >
            {whatsapp && <MessageCircle className="h-5 w-5" />} Quiero el {oro ? "Premium" : "Básico"} <ArrowRight className="h-4 w-4" />
          </a>
          {link && (
            <a href={link.href} className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-neutral-400 hover:text-white">
              <RotateCw className="h-3.5 w-3.5" /> {link.texto}
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="[perspective:1600px]">
      <div
        className={`relative transition-[transform,height] duration-700 ease-[cubic-bezier(.16,1,.3,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${esPremium ? "[transform:rotateY(180deg)]" : ""}`}
        style={alto ? { height: alto } : undefined}
      >
        <div ref={caraB} className={`${alto ? "absolute inset-x-0 top-0" : ""} [backface-visibility:hidden]`} aria-hidden={esPremium}>{cara(basico, false)}</div>
        <div ref={caraP} className="absolute inset-x-0 top-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!esPremium}>{cara(premium, true)}</div>
      </div>
    </div>
  );
}
