"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  Check,
  ShieldCheck,
  ChevronDown,
  MousePointerClick,
  Layers,
  Flame,
  BadgePercent,
  Truck,
  PackageCheck,
  Bell,
  BadgeCheck,
  Smartphone,
  Eye,
  ShoppingCart,
  Ban,
  Megaphone,
  Zap,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import VariantShowcase from "@/app/components/landing/VariantShowcase";

const MP_CHECKOUT_URL = "https://mpago.la/1LqFYin";
const WHATSAPP_URL =
  "https://wa.me/5493434163999?text=" +
  encodeURIComponent("Hola! Quiero que analicen mi tienda de Tiendanube: ");

type TrackWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

// Registra el clic a WhatsApp como lead en Meta Pixel y GA4
function trackWhatsApp(origen: string) {
  const w = window as TrackWindow;
  w.fbq?.("track", "Contact", { content_name: origen });
  w.gtag?.("event", "generate_lead", { method: "whatsapp", origen });
}

function WhatsAppCta({ origen, className = "" }: { origen: string; className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(origen)}
      className={`inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black px-7 py-4 rounded-2xl text-base transition-all shadow-[0_10px_40px_-8px_rgba(16,185,129,0.6)] hover:scale-[1.03] active:scale-95 ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      <span>Quiero que analices mi tienda</span>
    </a>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
};

const PAINS = [
  {
    icon: Eye,
    title: "Entran, miran y se van.",
    text: "Tenés visitas, pero la ficha no les da un motivo para comprar ahora.",
  },
  {
    icon: ShoppingCart,
    title: "Venden de a una unidad.",
    text: "Nadie les propone llevar más, así que el ticket promedio no crece.",
  },
  {
    icon: Ban,
    title: "La ficha no da confianza.",
    text: "Sin envío claro, sin precio por transferencia y sin señales de que otros compran.",
  },
  {
    icon: Megaphone,
    title: "Pagás anuncios que no convierten.",
    text: "El anuncio trae la visita. Lo que pasa después del clic depende de tu tienda.",
  },
];

const PIECES = [
  { icon: MousePointerClick, title: "Botón de compra fijo", text: "Siempre a mano mientras bajan por la ficha." },
  { icon: Layers, title: "Packs Llevá 2 y Llevá 3", text: "Suben el ticket con descuentos por cantidad." },
  { icon: BadgePercent, title: "Mejor precio por transferencia", text: "El ahorro bien grande, calculado solo." },
  { icon: Truck, title: "Entrega estimada", text: "“Llega entre el martes y el viernes”." },
  { icon: PackageCheck, title: "Envío gratis con progreso", text: "“Te faltan $12.000 para el envío gratis”." },
  { icon: Flame, title: "Urgencia", text: "Barra de stock que empuja la decisión." },
  { icon: Bell, title: "Ventas en vivo", text: "Avisos de compras recientes." },
  { icon: BadgeCheck, title: "Insignias de confianza", text: "Envío, cuotas reales y compra segura." },
  { icon: MessageCircle, title: "Ayuda por WhatsApp", text: "Con el producto ya escrito en el mensaje." },
];

const FAQS = [
  {
    q: "¿Tengo que saber programar?",
    a: "No. Te damos el código ya configurado para tu tienda y lo pegás en Configuración > Códigos externos de tu Tiendanube. Si te trabás, te ayudamos por WhatsApp.",
  },
  {
    q: "¿Tengo que cambiar de plantilla?",
    a: "No. Nevux se suma a la plantilla que ya tenés y adapta tus fichas de producto. Antes de activarlo lo probamos sobre una ficha real de tu tienda.",
  },
  {
    q: "¿Hace más lenta mi tienda?",
    a: "No. Es un solo archivo liviano (menos de 20 KB) que se carga cuando la página ya está lista, sin apps pesadas.",
  },
  {
    q: "¿Los precios y descuentos son reales?",
    a: "Sí. El precio por transferencia y las cuotas sin interés se leen de tu tienda. Los descuentos de los packs se configuran también como promoción en tu Tiendanube, para que el carrito cobre exactamente lo que se muestra.",
  },
  {
    q: "¿Cómo se paga? ¿Puedo cancelar?",
    a: "Es una suscripción mensual de $39.900 ARS por Mercado Pago. Podés cancelar cuando quieras, sin permanencia mínima, y tenés 7 días de garantía.",
  },
];

function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <div className="relative rounded-[2.6rem] border-[10px] border-[#1c1c1f] bg-[#1c1c1f] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1c1c1f] rounded-full z-20" />
        <div className="relative aspect-[780/1500] select-none overflow-hidden rounded-[1.9rem] bg-white">
          <img src="/landing/hogar-antes.jpg" alt="Ficha de producto sin Nevux" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          <img
            src="/landing/hogar-despues.jpg"
            alt="Ficha de producto con Nevux"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            draggable={false}
          />
          <span className="absolute top-8 left-3 z-10 text-[10px] font-black tracking-wider bg-black/70 text-white px-2 py-1 rounded-md">ANTES</span>
          <span className="absolute top-8 right-3 z-10 text-[10px] font-black tracking-wider bg-emerald-500 text-black px-2 py-1 rounded-md">CON NEVUX</span>
          <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none" style={{ left: `${pos}%` }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black grid place-items-center text-sm font-black shadow-xl">
              ↔
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Comparar antes y después"
            className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-ew-resize"
          />
        </div>
      </div>
    </div>
  );
}

function HeroPhone() {
  return (
    <div className="relative w-[250px] sm:w-[280px] mx-auto">
      <div className="absolute -inset-10 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative rounded-[2.6rem] border-[10px] border-[#1c1c1f] bg-[#1c1c1f] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1c1c1f] rounded-full z-20" />
        <div className="relative h-[480px] sm:h-[540px] overflow-hidden rounded-[1.9rem] bg-white">
          <img src="/landing/hogar-caso.jpg" alt="Ficha de Hogar Digital con Nevux" className="nvx-hero-scroll w-full" draggable={false} />
          <div className="absolute left-0 right-0 bottom-0 z-10 bg-white border-t border-neutral-200 px-3 py-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-neutral-900 truncate">Parlante Bluetooth V8</div>
              <div className="text-xs font-black text-emerald-600">$45.900</div>
            </div>
            <span className="shrink-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-2 rounded-lg">COMPRAR AHORA</span>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -left-10 sm:-left-16 top-24 bg-[#111214]/90 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-xl"
      >
        📦 Llevá 2 · 15% OFF
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1 }}
        className="absolute -right-8 sm:-right-14 top-52 bg-[#111214]/90 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-xl"
      >
        🔥 84% vendido
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute -left-8 sm:-left-14 bottom-28 bg-[#111214]/90 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-xl"
      >
        ✓ Sofía compró recién
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showBar, setShowBar] = useState(false);

  // La barra fija aparece recién cuando el botón del hero ya quedó atrás
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 650);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080a] text-white font-sans selection:bg-emerald-500 selection:text-black pb-24 sm:pb-0 overflow-x-hidden">
      <style>{`
        @keyframes nvx-hero-scroll { 0%, 6% { transform: translateY(0); } 94%, 100% { transform: translateY(calc(-100% + 540px)); } }
        .nvx-hero-scroll { animation: nvx-hero-scroll 26s ease-in-out infinite alternate; }
        .nvx-grid-bg { background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%); }
        @media (prefers-reduced-motion: reduce) { .nvx-hero-scroll { animation: none; } }
      `}</style>

      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07080a]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <NevuxLogo size="medium" textColor="#ffffff" />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("header")}
            className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Escribinos
          </a>
        </div>
      </header>

      {/* 2. HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 nvx-grid-bg pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-14 items-center">
          <div className="text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-semibold mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Optimización de fichas para Tiendanube
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6"
            >
              Tu tienda ya tiene visitas.{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Hagamos que compren.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed"
            >
              Convertimos tus fichas de producto en páginas que venden: precio claro, packs, urgencia, envío y un botón de compra
              siempre a mano. Sin cambiar de plantilla y sin apps.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <WhatsAppCta origen="hero" className="w-full sm:w-auto" />
              <p className="text-xs text-neutral-500 mt-4">Te respondemos por WhatsApp · Sin compromiso</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
            <HeroPhone />
          </motion.div>
        </div>
      </section>

      {/* 3. ANTES / DESPUÉS REAL */}
      <section className="relative py-20 md:py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp} className="text-center lg:text-left order-2 lg:order-1">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-[0.18em]">Caso real · Hogar Digital</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-5">
              Mismo producto.
              <br />
              <span className="text-neutral-500">Otra ficha.</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Arrastrá el celular para comparar la ficha del Parlante V8 de Hogar Digital antes y después de Nevux. Misma tienda,
              misma plantilla, mismo precio.
            </p>
            <ul className="space-y-3 text-sm text-neutral-300 max-w-md mx-auto lg:mx-0 text-left">
              {[
                "Barra de urgencia pegada al precio",
                "Packs Llevá 2 y Llevá 3 que cambian la cantidad del carrito",
                "Insignias de confianza con datos reales de la tienda",
                "Botón de compra fijo mientras bajan por la ficha",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 grid place-items-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} className="order-1 lg:order-2">
            <BeforeAfter />
            <p className="text-center text-xs text-neutral-500 mt-4">← Deslizá para comparar →</p>
          </motion.div>
        </div>
      </section>

      {/* 4. DOLORES */}
      <section className="py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">¿Te pasa esto?</h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Casi nunca es el producto. Es cómo se presenta en el momento en que la persona decide.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PAINS.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group relative bg-[#101114] border border-white/[0.07] rounded-2xl p-6 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                    <p.icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-neutral-600">0{i + 1}</span>
                    <h3 className="text-lg font-bold mb-1">{p.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PIEZAS DEL PACK */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-[0.18em]">Pack Landing Page Pro</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
              Todo lo que suma Nevux{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">a tu ficha</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Cada pieza usa los datos reales de tu tienda: si no ofrecés algo, no se muestra.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PIECES.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
                className="bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.07] rounded-2xl p-5 flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 grid place-items-center shrink-0">
                  <p.icon className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-0.5">{p.title}</h3>
                  <p className="text-neutral-400 text-sm">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VARIANTES */}
      <div className="bg-[#0b0c0f] border-y border-white/5">
        <VariantShowcase checkoutUrl={MP_CHECKOUT_URL} />
      </div>

      {/* 7. CÓMO FUNCIONA */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Cómo trabajamos</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Tres pasos. Sin programar y sin tocar tu plantilla.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "01", icon: MessageCircle, t: "Analizamos tu tienda", d: "Nos escribís por WhatsApp y revisamos tus fichas: qué frena la compra y qué conviene sumar." },
              { n: "02", icon: Smartphone, t: "Lo probamos en tu ficha", d: "Configuramos el código con tus datos reales y lo probamos sobre un producto tuyo antes de entregártelo." },
              { n: "03", icon: Zap, t: "Lo pegás y listo", d: "Lo pegás en Configuración > Códigos externos de tu Tiendanube. Tarda un minuto." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="relative bg-[#101114] border border-white/[0.07] rounded-2xl p-7"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 grid place-items-center">
                    <s.icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <span className="text-3xl font-black text-white/10">{s.n}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{s.t}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRECIO + GARANTÍA */}
      <section className="relative py-20 md:py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative max-w-xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="relative bg-[#0f1013] border border-emerald-500/40 rounded-3xl p-7 sm:p-10 text-center shadow-[0_0_80px_-20px_rgba(16,185,129,0.35)]"
          >
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              Precio de lanzamiento
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">Pack Landing Page Pro</h2>
            <p className="text-neutral-500 text-sm mb-6">Para tiendas en Tiendanube</p>
            <div className="flex items-end justify-center gap-3 mb-7">
              <span className="text-neutral-600 line-through text-lg font-bold mb-2">$49.900</span>
              <span className="text-5xl sm:text-6xl font-black tracking-tight">$39.900</span>
              <span className="text-neutral-400 text-sm font-semibold mb-2">/mes</span>
            </div>
            <ul className="space-y-3 text-left text-sm text-neutral-300 mb-8 max-w-sm mx-auto">
              {[
                "Análisis de tu tienda por WhatsApp",
                "Código configurado y probado en tu ficha",
                "Las 9 piezas de conversión",
                "Ajustes cuando cambies precios o promos",
                "Soporte por WhatsApp",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <WhatsAppCta origen="precio" className="w-full" />
            <a href={MP_CHECKOUT_URL} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white mt-5 transition-colors">
              ¿Ya lo decidiste? Pagá directo con Mercado Pago <ArrowRight className="w-4 h-4" />
            </a>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3 text-left">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <p className="text-xs text-neutral-400 leading-relaxed">
                <b className="text-white">Garantía de 7 días.</b> Si en los primeros 7 días no te convence cómo quedaron tus fichas,
                te devolvemos el 100% de lo que pagaste.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. PREGUNTAS FRECUENTES */}
      <section className="py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center mb-12">
            Preguntas frecuentes
          </motion.h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="bg-[#101114] border border-white/[0.07] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-bold flex justify-between items-center gap-4 text-sm sm:text-base hover:bg-white/[0.03] transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CIERRE */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 nvx-grid-bg rotate-180 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
        <motion.div {...fadeUp} className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-6xl font-extrabold tracking-tight mb-6">
            El problema no es el anuncio.{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Es lo que pasa después del clic.
            </span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-lg mb-10 max-w-xl mx-auto">
            Escribinos con el link de tu tienda y te decimos qué está frenando tus ventas.
          </p>
          <WhatsAppCta origen="cierre" className="w-full sm:w-auto" />
        </motion.div>
      </section>

      {/* 11. FOOTER */}
      <footer className="py-10 border-t border-white/5 text-neutral-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NevuxLogo size="small" textColor="#ffffff" />
          <div>© 2026 Nevux · Optimización de fichas para Tiendanube</div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("footer")}
            className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </footer>

      {/* 12. BARRA FIJA MOBILE */}
      <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#07080a]/95 backdrop-blur-lg border-t border-white/10 transition-transform duration-300 ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("barra-mobile")}
          className="flex items-center justify-center gap-2 bg-emerald-500 text-black font-black text-sm py-3.5 rounded-xl shadow-[0_8px_30px_-6px_rgba(16,185,129,0.6)]"
        >
          <MessageCircle className="w-4 h-4" />
          Quiero que analices mi tienda
        </a>
      </div>
    </div>
  );
}
