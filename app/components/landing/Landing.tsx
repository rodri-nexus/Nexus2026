"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { MessageCircle, ArrowRight, Check, ShieldCheck } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import NotebookVideo from "./NotebookVideo";
import { Glow, Tilt } from "./fx";
import { CasoReal, Disenos, Problema, QueHace } from "./secciones";
import { Cierre, ComoFunciona, Comparativa, LaCuenta, Pie, Planes, Preguntas, QuienLoHace } from "./oferta";
import { WHATSAPP_URL, WhatsAppCta, trackWhatsApp } from "./cta";

// Landing de Nevux (orden y archivos en docs/landing.md): portada → prueba real → dolor → diseños → qué hace →
// la cuenta → cómo funciona → alternativas → planes → quién lo hace → objeciones → cierre.
// Regla: todo dato es real o es una cuenta que hace el visitante con sus números.

// Entrada de la portada: cada pieza aparece en cascada al cargar
const HERO = { oculto: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const HERO_ITEM = {
  oculto: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// Portada: notebook con la home Premium (demo) y celular con la ficha Pro (demo), en 3D.
// Se inclinan al bajar y siguen al dedo o al mouse. Las etiquetas flotantes son piezas reales del producto.
function HeroDevices() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-10 md:mt-16 w-full max-w-[960px]"
    >
      <Glow className="left-1/2 top-[5%] -translate-x-1/2 w-[120%] h-[100%]" color="rgba(52,211,153,0.20)" />
      <Tilt max={9} scroll={20} glare={false} className="relative">
        <div className="relative pr-[13%] sm:pr-[15%]" style={{ transformStyle: "preserve-3d" }}>
          <div style={{ transform: "translateZ(0px)" }}>
            <NotebookVideo src="/casos/premium/demo.mp4" poster="/casos/premium/demo.jpg" url="tutienda.com.ar" titulo="Home del plan Premium en una tienda de demostración" />
          </div>
          {/* Celular adelante, con la ficha Pro bajando sola */}
          <div
            className="absolute right-0 bottom-[-6%] w-[31%] sm:w-[26%] max-w-[230px] rounded-[1.6rem] sm:rounded-[2.2rem] bg-[#0c0d10] p-[5px] sm:p-[7px] ring-1 ring-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,.95),0_0_0_1px_rgba(255,255,255,.04)_inset]"
            style={{ transform: "translateZ(70px)" }}
          >
            <div className="relative overflow-hidden rounded-[1.3rem] sm:rounded-[1.8rem] bg-white" style={{ aspectRatio: "390 / 844" }}>
              <img src="/landing/hero-ficha.jpg" alt="Ficha Pro de demostración en un celular" width={520} height={1760} className="nvx-ficha absolute left-0 top-0 w-full h-auto will-change-transform" />
              <div className="absolute left-1/2 top-[6px] -translate-x-1/2 h-[10px] sm:h-[16px] w-[34%] rounded-full bg-black" />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
            </div>
          </div>
          {/* Etiquetas flotantes: piezas que trae la ficha */}
          <div className="nvx-float absolute left-[-2%] sm:left-[-3%] top-[-6%] sm:top-[14%]" style={{ transform: "translateZ(90px)" }}>
            <div className="rounded-2xl border border-white/15 bg-[#14161b] px-3 py-2 sm:px-4 sm:py-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,.9)]">
              <div className="text-[10px] sm:text-[11px] text-neutral-400">Elegí tu pack</div>
              <div className="text-[12px] sm:text-sm font-extrabold">Llevá 2 · <span className="text-emerald-300">15% OFF</span></div>
            </div>
          </div>
          <div className="nvx-float [animation-delay:-2s] absolute left-[3%] sm:left-[-4%] bottom-[-12%] sm:bottom-[-6%]" style={{ transform: "translateZ(110px)" }}>
            <div className="rounded-2xl border border-white/15 bg-[#14161b] px-3 py-2 sm:px-4 sm:py-3 w-[150px] sm:w-[210px] shadow-[0_20px_40px_-15px_rgba(0,0,0,.9)]">
              <div className="text-[10px] sm:text-[11px] text-neutral-300">Te faltan <b className="text-white">$8.000</b> para el envío gratis</div>
              <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="nvx-barra h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" />
              </div>
            </div>
          </div>
          <div className="nvx-float [animation-delay:-4s] hidden sm:block absolute right-[24%] top-[4%]" style={{ transform: "translateZ(100px)" }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400 text-black text-sm font-extrabold px-4 py-2 shadow-[0_16px_40px_-12px_rgba(52,211,153,.9)]">
              <Check className="w-4 h-4" /> Agregado
            </div>
          </div>
        </div>
      </Tilt>
      <p className="relative mt-16 sm:mt-16 text-center text-[11px] text-neutral-500">Tienda de demostración: marca, fotos y precios de ejemplo. En la tuya van tus productos y tus datos reales.</p>
    </motion.div>
  );
}

/* ---------- Página ---------- */

export default function Landing() {
  const [showBar, setShowBar] = useState(false);
  const [ticket, setTicket] = useState(35000);

  // La barra fija aparece recién cuando el botón del hero ya quedó atrás
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-emerald-400 selection:text-black pb-24 sm:pb-0 overflow-x-hidden">
      <style>{`
        .nvx-grid-bg { background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%); }
        @keyframes nvx-grad { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes nvx-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -8px; } }
        .nvx-float { animation: nvx-float 6s ease-in-out infinite; }
        @keyframes nvx-ficha { 0%, 30% { transform: translateY(0); } 85%, 100% { transform: translateY(-36%); } }
        .nvx-ficha { animation: nvx-ficha 14s ease-in-out infinite alternate; }
        @keyframes nvx-barra { 0%, 15% { transform: scaleX(.26); } 70%, 100% { transform: scaleX(1); } }
        .nvx-barra { width: 84%; transform-origin: left; animation: nvx-barra 5s cubic-bezier(.4,0,.2,1) infinite alternate; }
        @media (prefers-reduced-motion: reduce) { .nvx-float, .nvx-ficha, .nvx-barra { animation: none; } }
      `}</style>

      {/* HEADER: el aviso de análisis gratis vive en el botón (antes era una franja aparte) */}
      <header className="sticky top-0 z-50 bg-[#07080a]/95 md:bg-[#07080a]/75 md:backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <a href="#" aria-label="Nevux, ir arriba">
            <NevuxLogo size="medium" textColor="#ffffff" />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-400">
            <a href="#premium" className="hover:text-white transition-colors">Casos</a>
            <a href="#disenos" className="hover:text-white transition-colors">Diseños</a>
            <a href="#cuenta" className="hover:text-white transition-colors">Hacé la cuenta</a>
            <a href="#precio" className="hover:text-white transition-colors">Planes</a>
            <a href="#preguntas" className="hover:text-white transition-colors">Preguntas</a>
          </nav>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("header")}
            className="nvx-press nvx-shine inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold px-3.5 py-2 rounded-xl text-[13px] sm:text-sm shadow-[0_8px_24px_-10px_rgba(52,211,153,.8)]"
          >
            <MessageCircle className="w-4 h-4" />
            Análisis gratis
          </a>
        </div>
      </header>

      {/* 1. HERO: qué es (línea de arriba), el gancho (titular) y el "wow" (notebook y celular en 3D) */}
      <section className="relative overflow-hidden nvx-grain">
        <div className="absolute inset-0 nvx-grid-bg pointer-events-none" />
        <Glow className="-top-72 left-1/2 -translate-x-1/2 w-[1400px] h-[960px]" color="rgba(16,185,129,0.17)" />
        <Glow className="top-[45%] left-1/2 -translate-x-1/2 w-[1300px] h-[800px]" color="rgba(45,212,191,0.07)" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 md:pt-20 md:pb-24">
          <motion.div variants={HERO} initial="oculto" animate="visible" className="text-center max-w-4xl mx-auto">
            <motion.span
              variants={HERO_ITEM}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-emerald-200 text-[11.5px] sm:text-xs font-semibold whitespace-nowrap mb-5 md:mb-7"
            >
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60 motion-reduce:hidden" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>
              Diseño que vende, para Tiendanube
            </motion.span>
            <motion.h1
              variants={HERO_ITEM}
              className="text-[2.55rem] leading-[0.98] min-[400px]:text-[2.8rem] sm:text-6xl lg:text-[4.4rem] font-extrabold tracking-[-0.045em] mb-5 md:mb-6"
            >
              No te faltan visitas.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-[nvx-grad_6s_ease-in-out_infinite] motion-reduce:animate-none">
                Te faltan ventas.
              </span>
            </motion.h1>
            <motion.p variants={HERO_ITEM} className="text-[15px] sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-7 sm:mb-8 leading-relaxed">
              Rediseñamos la <b className="text-white font-semibold">ficha de producto y la home</b> de tu Tiendanube con tus precios, tus cuotas y tu marca, para que
              más visitas terminen en compra. Se instala pegando una línea: sin apps y sin cambiar de plantilla.
            </motion.p>
            <motion.div variants={HERO_ITEM} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <WhatsAppCta origen="hero" className="w-full sm:w-auto" />
              <a
                href="/suscribirme?plan=premium"
                className="nvx-press w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-300/[0.06] hover:bg-amber-300/[0.12] hover:border-amber-300/70 text-amber-200 font-bold px-6 py-4 text-[15px]"
              >
                Quiero el Premium <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
            <motion.p variants={HERO_ITEM} className="mt-3 text-xs text-neutral-500">
              El análisis es gratis y sin compromiso. Te responde Rodrigo, creador de Nevux.
            </motion.p>
            <motion.ul variants={HERO_ITEM} className="mt-5 sm:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-300">
              {[
                { i: ShieldCheck, t: "Garantía de 7 días" },
                { i: Check, t: "Probado en tu tienda antes" },
                { i: Check, t: "Cancelás cuando quieras" },
              ].map(({ i: I, t }) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 sm:px-3 py-1 sm:py-1.5">
                  <I className="w-3.5 h-3.5 text-emerald-400" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>
          <HeroDevices />
        </div>
      </section>

      {/* 3 a 6: caso real, el problema, diseños y qué hace (secciones.tsx) */}
      <CasoReal />
      <Problema />
      <Disenos />
      <QueHace />

      {/* 7 a 13: la cuenta, cómo funciona, comparativa, planes, quién lo hace, preguntas y cierre (oferta.tsx) */}
      <LaCuenta ticket={ticket} setTicket={setTicket} />
      <ComoFunciona />
      <Comparativa />
      <Planes ticket={ticket} />
      <QuienLoHace />
      <Preguntas />
      <Cierre />
      <Pie />

      {/* BARRA FIJA MOBILE: análisis gratis (principal) y Premium */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-[#07080a]/95 border-t border-white/10 will-change-transform transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("barra-mobile")}
            className="nvx-shine nvx-press flex-1 flex items-center justify-center gap-2 bg-emerald-400 text-black font-extrabold text-sm py-3.5 rounded-xl shadow-[0_8px_30px_-6px_rgba(52,211,153,0.6)]"
          >
            <MessageCircle className="w-4 h-4" />
            Quiero mi análisis gratis
          </a>
          <a href="/suscribirme?plan=premium" className="nvx-press flex items-center justify-center rounded-xl border border-amber-300/40 text-amber-200 font-bold text-sm px-4">
            Premium
          </a>
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}
