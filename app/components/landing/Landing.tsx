"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  ArrowDown,
  Check,
  X,
  ShieldCheck,
  ChevronDown,
  Eye,
  ShoppingCart,
  Ban,
  Megaphone,
  Calculator,
  HeartHandshake,
  Timer,
  Layers,
  Sparkles,
  Wrench,
  Zap,
  Feather,
  Store,
  ShoppingBag,
  Shirt,
  Plus,
  Quote,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import Vitrina from "@/app/disenos/Vitrina";
import { DISENOS } from "@/lib/disenos";
import Notebook from "@/app/disenos/Notebook";
import { PLANES } from "@/lib/planes";

// Landing de Nevux. Cada sección sigue el orden del curso de ventas:
// gancho → dolor → implicación (calculadora) → solución → evaluación → oferta → objeciones → cierre.
// Regla: todo dato es real o es una cuenta que hace el visitante con sus números.

const PRECIO = 39900;
const SUSCRIPCION_URL = "/suscribirme";
const WHATSAPP_URL =
  "https://wa.me/5493434163999?text=" + encodeURIComponent("Hola! Quiero el análisis gratis de mi tienda de Tiendanube: ");

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

const ars = (n: number) => "$" + Math.round(n).toLocaleString("es-AR");
const num = (n: number) => Math.round(n).toLocaleString("es-AR");

function WhatsAppCta({ origen, label = "Quiero mi análisis gratis", className = "" }: { origen: string; label?: string; className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(origen)}
      className={`group inline-flex items-center justify-center gap-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold px-4 min-[360px]:px-7 py-4 rounded-2xl text-[15px] sm:text-base whitespace-nowrap transition-all shadow-[0_12px_40px_-10px_rgba(52,211,153,0.7)] hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      <MessageCircle className="w-5 h-5 shrink-0 max-[359px]:hidden" />
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 max-[359px]:hidden" />
    </a>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-bold text-emerald-300 uppercase tracking-[0.18em]">{children}</span>;
}

function Grad({ children }: { children: React.ReactNode }) {
  return <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">{children}</span>;
}

/* ---------- Contenido ---------- */

const PAINS = [
  { icon: Eye, title: "Entran, miran y se van.", text: "La ficha no les da un motivo para comprar ahora. Se van “a pensarlo” y no vuelven." },
  { icon: ShoppingCart, title: "Compran de a una unidad.", text: "Nadie les propone llevar dos o sumar el complemento. El ticket promedio no se mueve." },
  { icon: Ban, title: "No terminan de confiar.", text: "No ven cuándo les llega, cuánto ahorran por transferencia ni que otros ya compraron." },
  { icon: Megaphone, title: "Los anuncios no rinden.", text: "El anuncio trae la visita. Lo que pasa después del clic depende de tu ficha." },
];

const SPIN = [
  "¿Cuántas personas entraron a tu tienda este mes?",
  "¿Cuántas de ellas compraron?",
  "¿Qué vio el resto antes de irse?",
];

// Las 22 piezas, agrupadas por lo que le pasa a la persona que está decidiendo
const GROUPS = [
  {
    icon: HeartHandshake,
    title: "Que confíen",
    why: "Nadie compra si tiene dudas. Respondemos las dudas antes de que aparezcan.",
    pieces: ["Entrega estimada", "Envío gratis con progreso", "Insignias con cuotas reales", "Reseñas de tus clientes", "Preguntas frecuentes", "Ayuda por WhatsApp", "Avisos de ventas"],
  },
  {
    icon: Timer,
    title: "Que se decidan hoy",
    why: "Un motivo real para no dejarlo para mañana, y el botón siempre a mano.",
    pieces: ["Cuenta regresiva de despacho", "Barra de stock", "Botón de compra fijo", "Mejor precio por transferencia"],
  },
  {
    icon: Layers,
    title: "Que lleven más",
    why: "La misma visita, un ticket más alto. Sin salir de la ficha.",
    pieces: ["Packs Llevá 2 y Llevá 3", "Precio por transferencia en cada pack", "Combiná con"],
  },
  {
    icon: Sparkles,
    title: "Que se enamoren de tu marca",
    why: "Contenido que muestra el producto en uso y elimina el miedo al talle.",
    pieces: ["Calculadora de talle", "Galería de colores", "Antes / después", "Videos verticales", "Pasos de uso", "Comparativa", "Cinta de beneficios", "Tus colores y tu tipografía"],
  },
];

const PIECE_COUNT = GROUPS.reduce((n, g) => n + g.pieces.length, 0);

const COMPARE = [
  { row: "Quién lo configura", nevux: "Nosotros, con tus datos", apps: "Vos, una por una", tema: "Un diseñador o vos" },
  { row: "Qué instalás", nevux: "Una sola línea", apps: "Una app por función", tema: "La tienda entera de nuevo" },
  { row: "Tocás tu plantilla", nevux: false, apps: false, tema: true },
  { row: "Probado en tu ficha antes de activarlo", nevux: true, apps: false, tema: false },
  { row: "Cambios de precios y promos", nevux: "Los hacemos nosotros", apps: "Los hacés vos", tema: "Los hacés vos" },
];

const STEPS = [
  { icon: MessageCircle, t: "Análisis gratis", d: "Nos mandás el link de tu tienda por WhatsApp y te decimos qué está frenando la compra en tus fichas. Sin costo y sin compromiso." },
  { icon: Wrench, t: "Lo armamos con tus datos", d: "Configuramos Nevux con tus precios, tus envíos y tu marca, y lo probamos sobre un producto tuyo." },
  { icon: Zap, t: "Pegás una línea y listo", d: "En el editor de diseño de tu Tiendanube, con nuestra guía. Desde ahí, cualquier cambio lo hacemos nosotros." },
];

const FACTS = [
  { icon: Store, t: "Probado en tiendas reales", d: "Con las plantillas Brasilia, Recife y Morelia de Tiendanube." },
  { icon: Check, t: "Solo datos reales", d: "Precios, cuotas y transferencia se leen de tu tienda. Si no ofrecés algo, no se muestra." },
  { icon: Feather, t: "Liviano", d: "Un solo archivo de unos 20 KB que carga cuando tu página ya está lista." },
  { icon: MessageCircle, t: "Atención de persona a persona", d: "Hablás siempre con quien configura tu tienda, por WhatsApp." },
];

// Testimonios reales con permiso del cliente. Mientras esté vacío, la sección no aparece.
const TESTIMONIOS: { nombre: string; tienda: string; texto: string; foto?: string; link?: string }[] = [
  {
    nombre: "Marcelo",
    tienda: "Hogar Digital",
    texto: "Nevux es muy importante para la gestión de mi tienda: incorporó widgets, analizó la tienda, me corrigió errores e intercambiamos ideas. Muy recomendable.",
    foto: "/landing/hogar-digital.jpg",
    link: "https://hogardigital.com.ar",
  },
];

const INCLUYE = [
  "Análisis de tu tienda antes de empezar",
  "Ficha Pro clara u oscura, con tus colores y efectos",
  `Las ${PIECE_COUNT} piezas, configuradas con tus datos`,
  "Secciones de confianza para la home de tu tienda",
  "Ajustes cada vez que cambies precios o promos",
  "Soporte por WhatsApp de persona a persona",
  "Sin permanencia: cancelás cuando quieras",
];

// Caso real: la tienda de Hogar Digital con el Premium, en partes (capturas sobre su tienda real)
const CASO_HD = [
  { foto: "/casos/hogar-digital/portada.jpg", titulo: "Portada de marca grande", texto: "Sus productos, a pantalla completa" },
  { foto: "/casos/hogar-digital/beneficios.jpg", titulo: "Beneficios y categorías", texto: "Íconos que se dibujan y tira que corre" },
  { foto: "/casos/hogar-digital/destacados.jpg", titulo: "Destacados", texto: "Con el % OFF y el precio real" },
  { foto: "/casos/hogar-digital/categorias.jpg", titulo: "Encontrá lo tuyo", texto: "Categorías que rotan solas" },
  { foto: "/casos/hogar-digital/audio.jpg", titulo: "Carruseles por categoría", texto: "Audio, preguntas y más" },
  { foto: "/casos/hogar-digital/banner.jpg", titulo: "Banner con zoom", texto: "Para empujar la categoría que más vende" },
];

// Preguntas frecuentes armadas como objeciones: precio, tiempo, confianza y necesidad
const FAQS = [
  {
    q: "“Es caro para mi tienda.”",
    a: "Tiene sentido mirarlo así. Pensalo en ventas: con un ticket promedio de $35.000, Nevux se paga con 2 ventas al mes (hacé la cuenta con tus números en la calculadora). Y si en 7 días no te convence, te devolvemos el 100%.",
  },
  {
    q: "“No tengo tiempo para instalar nada.”",
    a: "Por eso lo hacemos nosotros. Vos pegás una sola línea en el editor de diseño de Tiendanube, con nuestra guía por WhatsApp. Desde ahí, los cambios de precios, envíos o promociones corren por nuestra cuenta.",
  },
  {
    q: "“¿Y si en mi tienda no funciona?”",
    a: "Es la duda más común. Por eso lo probamos sobre una ficha real de tu tienda antes de activarlo, y tenés 7 días de garantía: si no te convence cómo quedaron tus fichas, te devolvemos todo.",
  },
  {
    q: "“Mi tienda ya vende bien.”",
    a: "Buenísimo: tenés tráfico y un producto que funciona, que es lo más difícil. Nevux trabaja sobre eso: que más visitas terminen en compra y que cada compra lleve más, con packs y Combiná con.",
  },
  {
    q: "¿Tengo que cambiar de plantilla o saber programar?",
    a: "No. Nevux se suma a la plantilla que ya tenés. Te damos una sola línea, ya configurada para tu tienda, y la pegás en el editor de diseño.",
  },
  {
    q: "¿Hace más lenta mi tienda?",
    a: "No. Es un solo archivo liviano (unos 20 KB comprimido) que se carga cuando la página ya está lista, sin apps pesadas.",
  },
  {
    q: "¿Los precios y descuentos son reales?",
    a: "Sí. El precio por transferencia y las cuotas sin interés se leen de tu tienda. Los descuentos de los packs se cargan también como promoción en tu Tiendanube, para que el carrito cobre exactamente lo que se muestra.",
  },
  {
    q: "¿Cómo se paga? ¿Puedo cancelar?",
    a: "Es una suscripción mensual de $39.900 por Mercado Pago. Cancelás cuando quieras, sin permanencia mínima, y tenés 7 días de garantía.",
  },
];

/* ---------- Piezas visuales ---------- */

// Campo numérico con separador de miles
function NumberField({ label, prefix, value, onChange, hint }: { label: string; prefix?: string; value: number; onChange: (n: number) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-neutral-300">{label}</span>
      <div className="mt-1.5 flex items-center bg-[#07080a] border border-white/10 focus-within:border-emerald-400/60 rounded-xl px-4 transition-colors">
        {prefix && <span className="text-neutral-500 font-bold mr-1">{prefix}</span>}
        <input
          type="text"
          inputMode="numeric"
          value={value ? num(value) : ""}
          onChange={(e) => onChange(Math.min(Number(e.target.value.replace(/\D/g, "")) || 0, 999999999))}
          className="w-full bg-transparent py-3 text-lg font-bold tabular-nums outline-none"
        />
      </div>
      {hint && <span className="block text-[11px] text-neutral-500 mt-1.5">{hint}</span>}
    </label>
  );
}

const MEJORAS = [0.25, 0.5, 1];
const pct = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 2 });

function Calculadora({ ticket, setTicket }: { ticket: number; setTicket: (n: number) => void }) {
  const [visitas, setVisitas] = useState(3000);
  const [conv, setConv] = useState(1);
  const [mejora, setMejora] = useState(0.5);

  const ventasHoy = (visitas * conv) / 100;
  const ventasExtra = (visitas * mejora) / 100;
  const extra = ventasExtra * ticket;
  const seaPagaCon = ticket > 0 ? Math.ceil(PRECIO / ticket) : 0;

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-4">
      <div className="bg-[#101114] border border-white/[0.07] rounded-3xl p-5 sm:p-7 space-y-5">
        <NumberField label="Visitas por mes" value={visitas} onChange={setVisitas} hint="Lo ves en Tiendanube → Estadísticas." />
        <NumberField label="Ticket promedio" prefix="$" value={ticket} onChange={setTicket} />
        <div>
          <span className="text-xs font-bold text-neutral-300">De cada 100 visitas, ¿cuántas compran hoy?</span>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              min={0.2}
              max={5}
              step={0.1}
              value={conv}
              onChange={(e) => setConv(Number(e.target.value))}
              className="flex-1 accent-emerald-400"
              aria-label="Conversión actual"
            />
            <span className="w-16 text-right text-lg font-bold tabular-nums">{pct(conv)}%</span>
          </div>
          <span className="block text-[11px] text-neutral-500 mt-1.5">Si no lo sabés, dejá 1%: es un valor habitual en tiendas online.</span>
        </div>
        <div>
          <span className="text-xs font-bold text-neutral-300">Si mejorara…</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {MEJORAS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMejora(m)}
                className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  mejora === m ? "bg-emerald-400 border-emerald-400 text-black" : "bg-white/[0.03] border-white/10 text-neutral-300 hover:border-white/25"
                }`}
              >
                +{pct(m)} punto{m === 1 ? "" : "s"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-b from-emerald-500/[0.12] to-emerald-500/[0.03] border border-emerald-400/30 rounded-3xl p-5 sm:p-7 flex flex-col">
        <div className="text-sm text-neutral-400">
          Hoy: <b className="text-white tabular-nums">{num(ventasHoy)} ventas</b> por mes · <span className="tabular-nums">{ars(ventasHoy * ticket)}</span>
        </div>
        <div className="mt-6 text-sm text-neutral-300">
          Si de cada 100 visitas compraran {pct(mejora)} más, serían <b className="text-white tabular-nums">{num(ventasExtra)} ventas más</b> por mes:
        </div>
        <div className="mt-2 text-[2.6rem] sm:text-6xl font-black tracking-tight tabular-nums text-emerald-300 leading-none break-all">
          +{ars(extra)}
        </div>
        <div className="text-sm text-neutral-400 mt-2">por mes, con las mismas visitas.</div>
        <div className="mt-6 pt-5 border-t border-white/10 flex items-start gap-3">
          <Calculator className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
          <p className="text-sm text-neutral-300">
            Nevux cuesta {ars(PRECIO)} por mes. Con tu ticket, <b className="text-white">se paga con {seaPagaCon} venta{seaPagaCon === 1 ? "" : "s"}</b>.
          </p>
        </div>
        <p className="mt-auto pt-6 text-[11px] text-neutral-500 leading-relaxed">
          Es una cuenta con tus números, no una promesa: el resultado depende de tu producto, tu precio y tu tráfico.
        </p>
      </div>
    </div>
  );
}

function Cell({ v, strong }: { v: string | boolean; strong?: boolean }) {
  if (typeof v === "boolean")
    return v ? (
      <Check className={`w-5 h-5 sm:mx-auto shrink-0 ${strong ? "text-emerald-300" : "text-neutral-400"}`} />
    ) : (
      <X className="w-5 h-5 sm:mx-auto shrink-0 text-neutral-600" />
    );
  return <span className={`text-right sm:text-center ${strong ? "text-white font-bold" : "text-neutral-400"}`}>{v}</span>;
}

/* ---------- Página ---------- */

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showBar, setShowBar] = useState(false);
  const [ticket, setTicket] = useState(35000);

  // La barra fija aparece recién cuando el botón del hero ya quedó atrás
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const seaPagaCon = ticket > 0 ? Math.ceil(PRECIO / ticket) : 0;

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-emerald-400 selection:text-black pb-24 sm:pb-0 overflow-x-hidden">
      <style>{`
        @keyframes nvx-hero-scroll { 0%, 6% { transform: translateY(0); } 94%, 100% { transform: translateY(calc(-100% + 560px)); } }
        .nvx-hero-scroll { animation: nvx-hero-scroll 26s ease-in-out infinite alternate; }
        .nvx-grid-bg { background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%); }
        @media (prefers-reduced-motion: reduce) { .nvx-hero-scroll { animation: none; } }
      `}</style>

      {/* Franja superior: reciprocidad */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsApp("franja")}
        className="block bg-emerald-400 text-black text-center text-xs sm:text-sm font-bold py-2 px-4 hover:bg-emerald-300 transition-colors"
      >
        Análisis gratis de tu tienda por WhatsApp · Te decimos qué frena tus ventas →
      </a>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07080a]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <a href="#" aria-label="Nevux">
            <NevuxLogo size="medium" textColor="#ffffff" />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-400">
            <a href="#cuenta" className="hover:text-white transition-colors">Hacé la cuenta</a>
            <a href="#solucion" className="hover:text-white transition-colors">Qué hace</a>
            <a href="#precio" className="hover:text-white transition-colors">Precio</a>
            <a href="#preguntas" className="hover:text-white transition-colors">Preguntas</a>
          </nav>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("header")}
            className="inline-flex items-center gap-2 border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Escribinos
          </a>
        </div>
      </header>

      {/* 1. HERO: gancho de los primeros 3 segundos */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 nvx-grid-bg pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8 md:pt-20 md:pb-10">
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-semibold mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Para tiendas en Tiendanube
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[2.7rem] leading-[1.02] sm:text-6xl lg:text-[3.6rem] xl:text-[4.1rem] font-extrabold tracking-[-0.035em] mb-6"
            >
              No te faltan visitas.
              <br />
              <Grad>Te faltan ventas.</Grad>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-9 leading-relaxed"
            >
              Transformamos las fichas de producto de tu Tiendanube para que <b className="text-white font-semibold">más visitas terminen en compra</b>:
              precio claro, packs, entrega estimada y un botón de compra siempre a mano. Sin cambiar de plantilla y sin apps.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <WhatsAppCta origen="hero" className="w-full sm:w-auto" />
                <a href="#solucion" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-300 hover:text-white transition-colors">
                  Ver el caso real <ArrowDown className="w-4 h-4" />
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-neutral-400">
                {["Lo probamos en tu ficha antes de activarlo", "Garantía de 7 días", "Cancelás cuando quieras"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 1b. DISEÑOS (justo después de la portada, para enganchar): así puede quedar tu tienda (vitrina 3D con las demos, ver docs/disenos.md) */}
      <section id="disenos" className="relative pt-6 pb-20 md:pt-10 md:pb-28 overflow-hidden scroll-mt-20 bg-[radial-gradient(110%_70%_at_50%_0%,rgba(16,185,129,0.12)_0%,transparent_60%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow>Diseños</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
              Así puede quedar <Grad>tu tienda.</Grad>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Elegí el diseño de tu ficha y de tu home. Tocá un celular para verlo al frente: cada uno es una tienda de demostración funcionando.
            </p>
          </motion.div>
          <Vitrina disenos={DISENOS.map(({ id, nombre, plan, demo }) => ({ id, nombre, plan, demo }))} />
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/disenos" className="inline-flex items-center gap-2 rounded-2xl bg-white text-black font-bold px-6 py-3.5 hover:bg-neutral-200 transition-colors">
              Ver los diseños y los planes <ArrowRight className="w-4 h-4" />
            </a>
            <WhatsAppCta origen="disenos" label="Quiero uno para mi tienda" />
          </div>
        </div>
      </section>

      {/* 1c. PREMIUM (después de los diseños): la home estilo Destino funcionando en una notebook (docs/referencias/destino.md) */}
      <section id="premium" className="relative py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5 overflow-hidden scroll-mt-20">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-400/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.35fr] gap-12 items-center">
          <motion.div {...fadeUp} className="text-center lg:text-left">
            <span className="inline-block bg-amber-300 text-black text-[11px] font-extrabold uppercase tracking-[.18em] px-3 py-1 rounded-full">Plan Premium</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-5 mb-5">
              Tu tienda como <span className="text-amber-300">las marcas grandes.</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
              La home que usan las marcas de ropa que más venden en Tiendanube, armada con tus productos. Sin apps y sin cambiar de plantilla.
            </p>
            <ul className="space-y-3 text-sm text-neutral-300 max-w-md mx-auto lg:mx-0 text-left">
              {[
                "Portada en video con tus productos flotando",
                "Categorías que rotan con video y tira de categorías que corre",
                "Comunidad, números que suben y reseñas",
                "Locales con mapa y carrito con barra de envío gratis",
                "Todo con efectos: lo que hace que el cliente diga “wow”",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-md bg-amber-300/15 border border-amber-300/30 grid place-items-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="/demo/disenos/home-destino.html" target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-300 hover:bg-amber-200 text-black font-extrabold px-6 py-3.5 transition-colors">
                Ver la demo en grande <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#precio" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 hover:border-white/30 text-white font-bold px-6 py-3.5 transition-colors">
                {ars(PLANES.premium.precio)}/mes
              </a>
            </div>
          </motion.div>
          <motion.div {...fadeUp}>
            <Notebook src="/demo/disenos/home-destino.html" titulo="Home Premium estilo Destino" />
            <p className="text-center text-xs text-neutral-500 mt-4">Demo con una marca de ejemplo. En tu tienda van tus productos, tus fotos y tus datos reales.</p>
          </motion.div>
        </div>
      </section>

      {/* 2. DOLOR: reconocimiento del problema */}
      <section className="py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>El problema</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
              Pagás para que entren.
              <br />
              <span className="text-neutral-500">Y se van sin comprar.</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">Casi nunca es el producto. Es lo que la persona ve en el momento en que decide.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PAINS.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group bg-[#101114] border border-white/[0.07] rounded-2xl p-6 hover:border-emerald-400/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0 group-hover:bg-emerald-400/10 group-hover:border-emerald-400/30 transition-colors">
                    <p.icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{p.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-sm font-bold text-neutral-300 mb-4">Hacete estas tres preguntas:</p>
            <ol className="space-y-2">
              {SPIN.map((q, i) => (
                <li key={q} className="text-lg sm:text-xl font-semibold text-white">
                  <span className="text-emerald-300 tabular-nums mr-2">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* 3. IMPLICACIÓN: la cuenta con sus números */}
      <section id="cuenta" className="py-20 md:py-28 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow>Hacé la cuenta</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
              Cuánto te deja <Grad>una ficha que convence</Grad>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">Poné tus números. Un pequeño cambio en cuántas visitas compran mueve mucho la facturación.</p>
          </motion.div>
          <motion.div {...fadeUp}>
            <Calculadora ticket={ticket} setTicket={setTicket} />
          </motion.div>
        </div>
      </section>

      {/* 4. SOLUCIÓN: caso real · Hogar Digital con el Premium, en partes (capturas de su tienda real, public/casos/hogar-digital/) */}
      <section id="solucion" className="relative py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5 scroll-mt-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow>Caso real · Hogar Digital</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-5">
              Así queda su tienda
              <br />
              <Grad>con el Premium.</Grad>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Su tienda de Tiendanube, sus productos y sus precios. Misma plantilla, sin apps. Mirá cómo queda, parte por parte.
            </p>
          </motion.div>
          <div className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-4 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:items-start lg:overflow-visible lg:mx-0 lg:px-0">
            {CASO_HD.map((c, i) => (
              <motion.figure
                key={c.foto}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
                className="snap-center shrink-0 w-[72%] sm:w-[46%] lg:w-auto"
              >
                <div className="rounded-[28px] bg-[#16181d] p-2 ring-1 ring-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]">
                  <div className="rounded-[22px] overflow-hidden bg-white">
                    <img src={c.foto} alt={c.titulo} loading="lazy" className="block w-full h-auto" />
                  </div>
                </div>
                <figcaption className="mt-3 text-center">
                  <b className="block text-sm font-bold text-white">{c.titulo}</b>
                  <span className="block text-xs text-neutral-400 mt-0.5">{c.texto}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <p className="text-center text-xs text-neutral-500 mt-6">Vista previa armada sobre la tienda real de Hogar Digital, con sus productos y sus datos.</p>
        </div>
      </section>

      {/* 5. MECANISMO: las piezas agrupadas por lo que resuelven */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Cómo lo hace</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
              {PIECE_COUNT} piezas. <Grad>Cada una con un trabajo.</Grad>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">Usan los datos reales de tu tienda. Si no ofrecés algo, esa pieza no aparece. Nunca inventamos números.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {GROUPS.map((g, i) => (
              <motion.div
                key={g.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.07] rounded-3xl p-6 sm:p-7"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/25 grid place-items-center shrink-0">
                    <g.icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-bold">{g.title}</h3>
                  <span className="ml-auto text-xs font-bold text-neutral-500 tabular-nums">{g.pieces.length}</span>
                </div>
                <p className="text-sm text-neutral-400 mb-5">{g.why}</p>
                <div className="flex flex-wrap gap-2">
                  {g.pieces.map((p) => (
                    <span key={p} className="text-xs font-semibold text-neutral-200 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1.5">
                      {p}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EVALUACIÓN DE ALTERNATIVAS */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow>Las alternativas</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">Comparalo sin vueltas</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Hay otras formas de mejorar tus fichas. Esta es la diferencia.</p>
          </motion.div>
          {/* En el celular, una tarjeta por fila para que se vean las tres opciones */}
          <div className="sm:hidden space-y-3">
            {COMPARE.map((r) => (
              <motion.div key={r.row} {...fadeUp} className="bg-[#101114] border border-white/[0.07] rounded-2xl p-5">
                <div className="text-sm font-bold mb-3">{r.row}</div>
                <div className="flex items-center justify-between gap-3 bg-emerald-400/[0.08] border border-emerald-400/30 rounded-xl px-3 py-2.5 mb-2 text-sm">
                  <span className="font-extrabold text-emerald-300">Nevux</span>
                  <Cell v={r.nevux} strong />
                </div>
                {[
                  ["Apps sueltas", r.apps],
                  ["Rediseñar la tienda", r.tema],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm">
                    <span className="text-neutral-500">{k as string}</span>
                    <Cell v={v as string | boolean} />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="hidden sm:block">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-neutral-500 p-4 w-[30%]"></th>
                  <th className="p-4 bg-emerald-400/[0.08] border-x border-t border-emerald-400/30 rounded-t-2xl">
                    <span className="inline-flex items-center gap-2 font-extrabold text-white">
                      <NevuxLogo size="small" showText={false} /> Nevux
                    </span>
                  </th>
                  <th className="p-4 font-bold text-neutral-300">Apps sueltas</th>
                  <th className="p-4 font-bold text-neutral-300">Rediseñar la tienda</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r, i) => (
                  <tr key={r.row}>
                    <td className="p-4 border-t border-white/5 text-neutral-300 font-semibold">{r.row}</td>
                    <td
                      className={`p-4 text-center bg-emerald-400/[0.08] border-x border-emerald-400/30 border-t border-t-white/5 ${
                        i === COMPARE.length - 1 ? "border-b rounded-b-2xl" : ""
                      }`}
                    >
                      <Cell v={r.nevux} strong />
                    </td>
                    <td className="p-4 text-center border-t border-white/5">
                      <Cell v={r.apps} />
                    </td>
                    <td className="p-4 text-center border-t border-white/5">
                      <Cell v={r.tema} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* 8. CÓMO TRABAJAMOS */}
      <section className="py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">Vos no tocás nada</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Tres pasos. Sin programar y sin cambiar tu plantilla.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <motion.div key={s.t} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="bg-[#101114] border border-white/[0.07] rounded-2xl p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/25 grid place-items-center">
                    <s.icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <span className="text-3xl font-black text-white/10 tabular-nums">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{s.t}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PRUEBA SOCIAL Y CONFIANZA */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow>Por qué confiar</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">Hecho para tiendas de verdad</h2>
          </motion.div>
          {TESTIMONIOS.length > 0 && (
            <div className={`gap-4 mb-4 ${TESTIMONIOS.length === 1 ? "max-w-3xl mx-auto" : "grid md:grid-cols-2"}`}>
              {TESTIMONIOS.map((t) => (
                <motion.figure
                  key={t.nombre}
                  {...fadeUp}
                  className="relative bg-gradient-to-b from-emerald-400/[0.08] to-transparent border border-emerald-400/25 rounded-3xl p-7 sm:p-10"
                >
                  <Quote className="w-9 h-9 text-emerald-300/70 mb-5" />
                  <blockquote className="text-lg sm:text-2xl font-semibold text-white leading-snug mb-7">“{t.texto}”</blockquote>
                  <figcaption className="flex items-center gap-4">
                    {t.foto && <img src={t.foto} alt={t.tienda} className="w-14 h-14 rounded-full object-cover border border-white/15" />}
                    <div className="text-sm">
                      <b className="text-base">{t.nombre}</b>
                      <div className="text-neutral-400">
                        Dueño de{" "}
                        {t.link ? (
                          <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                            {t.tienda}
                          </a>
                        ) : (
                          t.tienda
                        )}{" "}
                        · cliente de Nevux
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FACTS.map((f, i) => (
              <motion.div key={f.t} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="bg-[#101114] border border-white/[0.07] rounded-2xl p-6">
                <f.icon className="w-5 h-5 text-emerald-300 mb-4" />
                <h3 className="font-bold mb-1">{f.t}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. OFERTA: garantía y cierre de alternativa */}
      <section id="precio" className="relative py-20 md:py-28 border-t border-white/5 overflow-hidden scroll-mt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <Eyebrow>Precio</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">Dos planes. Todo incluido.</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5 items-stretch max-w-[860px] mx-auto">
          <motion.div
            {...fadeUp}
            className="relative min-w-0 w-full max-w-[420px] mx-auto bg-[#0f1013] border border-emerald-400/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_-20px_rgba(16,185,129,0.35)]"
          >
            <div className="text-center">
              <span className="inline-block bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
                Precio de lanzamiento
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-1">Pack Landing Page Pro</h3>
              <p className="text-neutral-500 text-sm mb-6">Para tiendas en Tiendanube</p>
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-[clamp(2.2rem,10vw,3rem)] leading-none font-black tracking-tight tabular-nums">{ars(PRECIO)}</span>
                <span className="text-neutral-400 text-sm font-semibold mb-1.5">/mes</span>
              </div>
              <p className="text-[13px] text-emerald-300 font-semibold mb-6">
                Con un ticket de {ars(ticket)}, se paga con {seaPagaCon} venta{seaPagaCon === 1 ? "" : "s"} al mes.
              </p>
            </div>
            <ul className="space-y-2.5 text-left text-[13.5px] text-neutral-300 mb-7">
              {INCLUYE.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
            <WhatsAppCta origen="precio" label="Empezar con el análisis gratis" className="w-full !whitespace-normal !px-4 text-center" />
            <a
              href={SUSCRIPCION_URL}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-colors"
            >
              Ya lo decidí: suscribirme <ArrowRight className="w-4 h-4" />
            </a>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
              <p className="text-sm text-neutral-400 leading-relaxed">
                <b className="text-white">Garantía de 7 días.</b> Si en los primeros 7 días no te convence cómo quedaron tus fichas, te devolvemos el 100% de lo
                que pagaste. Sin preguntas raras.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="relative min-w-0 w-full max-w-[420px] mx-auto bg-gradient-to-b from-amber-200 to-amber-400 text-black rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_-20px_rgba(251,191,36,0.45)]"
          >
            <div className="text-center">
              <span className="inline-block bg-black text-amber-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5">Premium</span>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-1">{PLANES.premium.nombre}</h3>
              <p className="text-black/60 text-sm mb-6">Tu tienda como las marcas grandes</p>
              <div className="flex items-end justify-center gap-2 mb-6">
                <span className="text-[clamp(2.2rem,10vw,3rem)] leading-none font-black tracking-tight tabular-nums">{ars(PLANES.premium.precio)}</span>
                <span className="text-black/60 text-sm font-semibold mb-1.5">/mes</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-left text-[13.5px] mb-7">
              {PLANES.premium.incluye.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
            <a href="/suscribirme?plan=premium" className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-extrabold px-6 py-4 rounded-2xl transition-colors">
              Quiero el Premium <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/demo/disenos/home-destino.html" target="_blank" rel="noopener" className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-black/20 hover:border-black/40 font-bold px-6 py-3.5 rounded-2xl text-sm transition-colors">
              Ver la demo <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          </div>
        </div>
      </section>

      {/* 11. OBJECIONES */}
      <section id="preguntas" className="py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">Lo que te puede estar frenando</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="bg-[#101114] border border-white/[0.07] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
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

      {/* 12. CIERRE: ¿y si…? + consecuencia */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 nvx-grid-bg rotate-180 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
        <motion.div {...fadeUp} className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-6xl font-extrabold tracking-tight mb-6">
            ¿Y si el mes que viene vendieras más <Grad>con las mismas visitas?</Grad>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-lg mb-10 max-w-xl mx-auto">
            Cada día que tu ficha sigue igual, las visitas que pagaste se van sin comprar. Mandanos el link de tu tienda y te decimos qué cambiar. Gratis.
          </p>
          <WhatsAppCta origen="cierre" className="w-full sm:w-auto" />
          <p className="text-xs text-neutral-500 mt-4">Te responde una persona, no un bot.</p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/5 text-neutral-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NevuxLogo size="small" textColor="#ffffff" />
          <div className="text-center">
            <div>© 2026 Nevux · Fichas de producto que venden, para Tiendanube</div>
            <div className="mt-2 flex items-center justify-center gap-3">
              <a href="/arrepentimiento" className="underline hover:text-white">Botón de arrepentimiento</a>
              <span>·</span>
              <a href="/arrepentimiento?tipo=baja" className="underline hover:text-white">Botón de baja</a>
            </div>
          </div>
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

      {/* BARRA FIJA MOBILE */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#07080a]/95 backdrop-blur-lg border-t border-white/10 transition-transform duration-300 ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("barra-mobile")}
          className="flex items-center justify-center gap-2 bg-emerald-400 text-black font-extrabold text-sm py-3.5 rounded-xl shadow-[0_8px_30px_-6px_rgba(52,211,153,0.6)]"
        >
          <MessageCircle className="w-4 h-4" />
          Quiero mi análisis gratis
        </a>
      </div>
    </div>
  );
}
