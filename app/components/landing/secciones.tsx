"use client";

// Secciones 3 a 6 de la landing (docs/landing.md): caso real, el problema, diseños y qué hace.
// Regla: nada inventado. Hogar Digital es real (con permiso de Marcelo); la demo es una marca de ejemplo y se dice.

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Ban, Check, Eye, HeartHandshake, Layers, Megaphone, Quote, ShoppingCart, Sparkles, Timer } from "lucide-react";
import NotebookVideo from "./NotebookVideo";
import Vitrina from "@/app/disenos/Vitrina";
import { DISENOS } from "@/lib/disenos";
import { PLANES } from "@/lib/planes";
import { Reveal, Tilt } from "./fx";
import { Duda, Eyebrow, Grad, PREMIUM_URL, WhatsAppCta, ars } from "./cta";

/* ---------- 3. Caso real: Hogar Digital ---------- */

const MARCELO = {
  texto: "Nevux es muy importante para la gestión de mi tienda: incorporó widgets, analizó la tienda, me corrigió errores e intercambiamos ideas. Muy recomendable.",
  foto: "/landing/hogar-digital.jpg",
};

// Capturas de la home Premium armada sobre su tienda real (public/casos/hogar-digital/)
const CASO_HD = [
  { foto: "/casos/hogar-digital/portada.jpg", titulo: "Portada de marca grande", texto: "Sus productos, a pantalla completa" },
  { foto: "/casos/hogar-digital/beneficios.jpg", titulo: "Beneficios y categorías", texto: "Íconos que se dibujan y tira que corre" },
  { foto: "/casos/hogar-digital/destacados.jpg", titulo: "Destacados", texto: "Con el % OFF y el precio real" },
  { foto: "/casos/hogar-digital/categorias.jpg", titulo: "Encontrá lo tuyo", texto: "Categorías que rotan solas" },
  { foto: "/casos/hogar-digital/audio.jpg", titulo: "Carruseles por categoría", texto: "Audio, preguntas y más" },
  { foto: "/casos/hogar-digital/banner.jpg", titulo: "Banner con zoom", texto: "Para empujar la categoría que más vende" },
];

function Celu({ foto, titulo }: { foto: string; titulo: string }) {
  return (
    <div className="rounded-[28px] bg-[#16181d] p-2 ring-1 ring-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]">
      <div className="rounded-[22px] overflow-hidden bg-white">
        <img src={foto} alt={titulo} loading="lazy" className="block w-full h-auto" />
      </div>
    </div>
  );
}

// En el celular: carrusel deslizable con puntos que marcan cuál estás viendo. En computadora: grilla con inclinación.
function CapturasHD() {
  const pista = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState(0);
  useEffect(() => {
    const el = pista.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActiva(Number((e.target as HTMLElement).dataset.i))),
      { root: el, threshold: 0.6 }
    );
    el.querySelectorAll("[data-i]").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  const ir = (i: number) => {
    const c = pista.current?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    c?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };
  return (
    <div className="mt-16 md:mt-20">
      <Reveal className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl font-extrabold">Parte por parte, en el celular</h3>
        <p className="text-sm text-neutral-400 mt-2">Así la ven sus clientes desde el teléfono.</p>
      </Reveal>
      {/* Celular */}
      <div ref={pista} className="lg:hidden flex items-start gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-[14%] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CASO_HD.map((c, i) => (
          <figure key={c.foto} data-i={i} className={`snap-center shrink-0 w-[72%] sm:w-[44%] transition-all duration-500 ${activa === i ? "opacity-100 scale-100" : "opacity-50 scale-[.94]"}`}>
            <Celu foto={c.foto} titulo={c.titulo} />
            <figcaption className="mt-3 text-center">
              <b className="block text-sm font-bold">{c.titulo}</b>
              <span className="block text-xs text-neutral-400 mt-0.5">{c.texto}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="lg:hidden mt-4 flex justify-center gap-2" role="tablist" aria-label="Capturas de Hogar Digital">
        {CASO_HD.map((c, i) => (
          <button key={c.foto} type="button" onClick={() => ir(i)} aria-label={c.titulo} aria-selected={activa === i} className={`h-2 rounded-full transition-all duration-300 ${activa === i ? "w-7 bg-emerald-300" : "w-2 bg-white/25"}`} />
        ))}
      </div>
      {/* Computadora */}
      <div className="hidden lg:grid grid-cols-3 gap-8 items-start">
        {CASO_HD.map((c, i) => (
          <Reveal key={c.foto} delay={(i % 3) * 0.08} as="figure">
            <Tilt max={7} scroll={0} className="rounded-[28px]">
              <Celu foto={c.foto} titulo={c.titulo} />
            </Tilt>
            <figcaption className="mt-4 text-center">
              <b className="block text-sm font-bold">{c.titulo}</b>
              <span className="block text-xs text-neutral-400 mt-0.5">{c.texto}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function CasoReal() {
  return (
    <section id="premium" className="relative py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5 overflow-hidden scroll-mt-20 nvx-grain">
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-sky-400/[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-amber-400/[0.07] blur-[150px] rounded-full pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <Eyebrow>Caso real · Hogar Digital</Eyebrow>
          <h2 className="text-[2rem] leading-[1.05] sm:text-5xl font-extrabold tracking-tight mt-4 mb-5">
            Así queda una tienda real <span className="text-amber-300">con el Premium.</span>
          </h2>
          <p className="text-neutral-400 text-[15px] sm:text-base leading-relaxed">
            Hogar Digital vende tecnología y hogar en Tiendanube. Armamos su home y su ficha con sus productos, sus precios y su marca, en la misma plantilla y sin apps.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-12 items-center">
          <Reveal>
            <Tilt max={6} scroll={14} glare={false}>
              <NotebookVideo src="/casos/premium/hogar-digital.mp4" poster="/casos/premium/hogar-digital.jpg" url="hogardigital.com.ar" titulo="Tienda Hogar Digital con el plan Premium: home y ficha de producto" />
            </Tilt>
            <p className="mt-6 text-center text-xs text-neutral-500">Recorrido real: la home, toca un parlante y entra a la ficha.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <figure className="relative rounded-3xl border border-emerald-400/25 bg-gradient-to-b from-emerald-400/[0.08] to-transparent p-6 sm:p-8">
              <Quote className="w-8 h-8 text-emerald-300/70 mb-4" />
              <blockquote className="text-lg sm:text-xl font-semibold leading-snug">“{MARCELO.texto}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <img src={MARCELO.foto} alt="Marcelo, dueño de Hogar Digital" loading="lazy" className="w-12 h-12 rounded-full object-cover border border-white/15" />
                <div className="text-sm">
                  <b className="block">Marcelo</b>
                  <span className="text-neutral-400">Dueño de Hogar Digital · cliente de Nevux</span>
                </div>
              </figcaption>
            </figure>
            <ul className="mt-5 space-y-2.5 text-sm text-neutral-300">
              {["Su tienda de Tiendanube, con su plantilla de siempre", "Home y ficha con sus productos, sus precios y su marca", "Sin apps: todo con una línea de código"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-md bg-emerald-400/15 border border-emerald-400/30 grid place-items-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/[0.06] px-3 py-1.5 text-[12px] text-amber-200">
              Diseño armado sobre la tienda real de Hogar Digital · se activa el 10/11
            </p>
          </Reveal>
        </div>

        <CapturasHD />

        {/* La demo: otro rubro, otra marca */}
        <div className="mt-20 md:mt-28 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-12 items-center">
          <Reveal className="text-center lg:text-left order-2 lg:order-1">
            <Eyebrow className="text-amber-300">Tienda demo</Eyebrow>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-4">Otro rubro, otra marca, el mismo nivel.</h3>
            <p className="text-neutral-400 text-[15px] leading-relaxed max-w-md mx-auto lg:mx-0">
              Una relojería de ejemplo en negro y dorado: home completa, toca un reloj y entra a la ficha. Marca, fotos y precios de demostración.
            </p>
            <div className="mt-6 max-w-md mx-auto lg:mx-0">
              <Duda q="¿Sirve para mi tienda o mi plantilla?">
                Funciona en las plantillas de Tiendanube. En el análisis gratis lo probamos sobre tu tienda antes de activarlo.
              </Duda>
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <Tilt max={6} scroll={14} glare={false}>
              <NotebookVideo src="/casos/premium/demo.mp4" poster="/casos/premium/demo.jpg" url="tutienda.com.ar" titulo="Tienda demo con el plan Premium: home y ficha de producto" />
            </Tilt>
          </Reveal>
        </div>

        <Reveal className="mt-14 md:mt-16 text-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={PREMIUM_URL}
              className="nvx-shine nvx-press inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-300 hover:bg-amber-200 text-black font-extrabold px-7 py-4 shadow-[0_12px_40px_-12px_rgba(252,211,77,.7)]"
            >
              Quiero el Premium <ArrowRight className="w-4 h-4" />
            </a>
            <WhatsAppCta origen="caso" />
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            Premium: {ars(PLANES.premium.precio)} por mes · Garantía de 7 días · Cancelás cuando quieras
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 4. El problema ---------- */

const PAINS = [
  { icon: Eye, title: "Entran, miran y se van.", text: "La ficha no les da un motivo para comprar ahora. Se van “a pensarlo” y no vuelven." },
  { icon: ShoppingCart, title: "Compran de a una unidad.", text: "Nadie les propone llevar dos o sumar el complemento. El ticket promedio no se mueve." },
  { icon: Ban, title: "No terminan de confiar.", text: "No ven cuándo les llega, cuánto ahorran por transferencia ni que otros ya compraron." },
  { icon: Megaphone, title: "Los anuncios no rinden.", text: "El anuncio trae la visita. Lo que pasa después del clic depende de tu ficha." },
];

const SPIN = ["¿Cuántas personas entraron a tu tienda este mes?", "¿Cuántas de ellas compraron?", "¿Qué vio el resto antes de irse?"];

export function Problema() {
  return (
    <section id="problema" className="relative py-20 md:py-28 overflow-hidden scroll-mt-20">
      <div aria-hidden className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[420px] bg-rose-500/[0.05] blur-[150px] rounded-full pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <Eyebrow>El problema</Eyebrow>
          <h2 className="text-[2rem] leading-[1.05] sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
            Pagás para que entren.
            <br />
            <span className="text-neutral-500">Y se van sin comprar.</span>
          </h2>
          <p className="text-neutral-400 text-[15px] sm:text-base">Casi nunca es el producto. Es lo que la persona ve en el momento en que decide.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {PAINS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="nvx-press group h-full rounded-2xl border border-white/[0.07] bg-[#101114] p-5 sm:p-6 hover:border-emerald-400/40 active:border-emerald-400/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0 group-hover:bg-emerald-400/10 group-hover:border-emerald-400/30 transition-colors">
                    <p.icon className="w-5 h-5 text-emerald-300 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div>
                    <h3 className="text-[17px] sm:text-lg font-bold mb-1">{p.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 max-w-2xl mx-auto text-center">
          <Reveal>
            <p className="text-sm font-bold text-neutral-300 mb-5">Hacete estas tres preguntas:</p>
          </Reveal>
          <ol className="space-y-3">
            {SPIN.map((q, i) => (
              <Reveal as="li" key={q} delay={0.15 + i * 0.18} className="text-lg sm:text-2xl font-semibold text-white">
                <span className="text-emerald-300 tabular-nums mr-2">{i + 1}.</span>
                {q}
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.7}>
            <a href="#que-hace" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              Mirá qué cambiamos para que compren <ArrowDown className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. Diseños ---------- */

export function Disenos() {
  return (
    <section id="disenos" className="relative py-20 md:py-28 overflow-hidden scroll-mt-20 bg-[#0b0c0f] border-y border-white/5 bg-[radial-gradient(110%_60%_at_50%_0%,rgba(16,185,129,0.10)_0%,transparent_60%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <Eyebrow>Diseños</Eyebrow>
          <h2 className="text-[2rem] leading-[1.05] sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
            Así puede quedar <Grad>tu tienda.</Grad>
          </h2>
          <p className="text-neutral-400 text-[15px] sm:text-base">
            Cada celular es una tienda de demostración funcionando. Tocá los de los costados para pasarlos al frente.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-[12px]">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-neutral-300">
              <b className="text-white">Básico:</b> ficha Pro clara u oscura
            </span>
            <span className="rounded-full border border-amber-300/30 bg-amber-300/[0.05] px-3 py-1.5 text-amber-100">
              <b className="text-amber-200">Premium:</b> además, home de marca grande
            </span>
          </div>
        </Reveal>
        <Reveal>
          <Vitrina disenos={DISENOS.map(({ id, nombre, plan, demo }) => ({ id, nombre, plan, demo }))} />
        </Reveal>
        <div className="mt-8 max-w-md mx-auto">
          <Duda q="¿Va con mis colores?">Sí: se arma con tus colores y tu tipografía. Las demos usan una marca de ejemplo.</Duda>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <WhatsAppCta origen="disenos" label="Quiero uno para mi tienda" className="w-full sm:w-auto" />
          <a href="/disenos" className="nvx-press w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 hover:border-white/30 text-white font-bold px-6 py-4">
            Ver todos los diseños <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Qué hace: las piezas, con un ejemplo animado de cada grupo ---------- */

export const GROUPS = [
  {
    icon: HeartHandshake,
    title: "Que confíen",
    why: "Nadie compra si tiene dudas. Respondemos las dudas antes de que aparezcan.",
    pieces: ["Entrega estimada", "Envío gratis con progreso", "Insignias con cuotas reales", "Reseñas de tus clientes", "Preguntas frecuentes", "Ayuda por WhatsApp", "Avisos de ventas"],
    demo: "envio",
  },
  {
    icon: Timer,
    title: "Que se decidan hoy",
    why: "Un motivo real para no dejarlo para mañana, y el botón siempre a mano.",
    pieces: ["Cuenta regresiva de despacho", "Barra de stock", "Botón de compra fijo", "Mejor precio por transferencia"],
    demo: "boton",
  },
  {
    icon: Layers,
    title: "Que lleven más",
    why: "La misma visita, un ticket más alto. Sin salir de la ficha.",
    pieces: ["Packs Llevá 2 y Llevá 3", "Precio por transferencia en cada pack", "Combiná con"],
    demo: "packs",
  },
  {
    icon: Sparkles,
    title: "Que se enamoren de tu marca",
    why: "Contenido que muestra el producto en uso y elimina el miedo al talle.",
    pieces: ["Calculadora de talle", "Galería de colores", "Antes / después", "Videos verticales", "Pasos de uso", "Comparativa", "Cinta de beneficios", "Tus colores y tu tipografía"],
    demo: "colores",
  },
] as const;

export const PIECE_COUNT = GROUPS.reduce((n, g) => n + g.pieces.length, 0);

// Mini ejemplos (precios de ejemplo). Animados con CSS; quietos con prefers-reduced-motion.
function MiniDemo({ tipo }: { tipo: (typeof GROUPS)[number]["demo"] }) {
  const caja = "rounded-xl border border-white/10 bg-[#0a0b0d] p-3.5";
  if (tipo === "envio")
    return (
      <div className={caja}>
        <div className="text-[12px] text-neutral-300">
          Te faltan <b className="text-white">$8.000</b> para el envío gratis
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="nvx-barra h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" />
        </div>
      </div>
    );
  if (tipo === "boton")
    return (
      <div className={`${caja} flex items-center justify-between gap-3`}>
        <div className="text-[12px] leading-tight">
          <span className="block text-neutral-500">Transferencia</span>
          <b className="text-emerald-300 text-base">$27.000</b>
        </div>
        <div className="relative h-9 w-[124px] rounded-lg bg-emerald-400 text-black text-[12.5px] font-extrabold overflow-hidden">
          <span className="nvx-swap-a absolute inset-0 grid place-items-center">Agregar al carrito</span>
          <span className="nvx-swap-b absolute inset-0 grid place-items-center">
            <span className="inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Agregado
            </span>
          </span>
        </div>
      </div>
    );
  if (tipo === "packs")
    return (
      <div className={`${caja} space-y-1.5`}>
        {[
          ["Llevá 1", "$30.000"],
          ["Llevá 2 · 10% OFF", "$54.000"],
          ["Llevá 3 · 15% OFF", "$76.500"],
        ].map(([a, b], i) => (
          <div key={a} className="nvx-pack flex justify-between rounded-lg border border-white/10 px-3 py-1.5 text-[12px]" style={{ animationDelay: `${i * 1.6}s` }}>
            <span className="font-bold">{a}</span>
            <span className="text-neutral-300 tabular-nums">{b}</span>
          </div>
        ))}
      </div>
    );
  return (
    <div className={`${caja} flex items-center gap-4`}>
      <div className="nvx-color w-12 h-12 rounded-xl shrink-0" />
      <div className="flex gap-2">
        {["#111827", "#b45309", "#0f766e", "#be123c"].map((c) => (
          <span key={c} className="w-5 h-5 rounded-full ring-2 ring-white/10" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

export function QueHace() {
  return (
    <section id="que-hace" className="relative py-20 md:py-28 scroll-mt-20">
      <style>{`
        @keyframes nvx-swap-a { 0%, 45% { transform: translateY(0); } 50%, 95% { transform: translateY(-110%); } 100% { transform: translateY(0); } }
        @keyframes nvx-swap-b { 0%, 45% { transform: translateY(110%); } 50%, 95% { transform: translateY(0); } 100% { transform: translateY(110%); } }
        .nvx-swap-a { animation: nvx-swap-a 4s cubic-bezier(.7,0,.3,1) infinite; }
        .nvx-swap-b { animation: nvx-swap-b 4s cubic-bezier(.7,0,.3,1) infinite; }
        @keyframes nvx-pack { 0%, 30% { border-color: rgba(52,211,153,.8); background: rgba(52,211,153,.10); } 34%, 100% { border-color: rgba(255,255,255,.1); background: transparent; } }
        .nvx-pack { animation: nvx-pack 4.8s ease infinite; }
        @keyframes nvx-color { 0%, 20% { background: #111827; } 25%, 45% { background: #b45309; } 50%, 70% { background: #0f766e; } 75%, 95% { background: #be123c; } 100% { background: #111827; } }
        .nvx-color { animation: nvx-color 8s ease infinite; }
        @media (prefers-reduced-motion: reduce) { .nvx-swap-a, .nvx-swap-b, .nvx-pack, .nvx-color { animation: none; } .nvx-swap-b { transform: translateY(110%); } .nvx-color { background: #111827; } }
      `}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <Eyebrow>Qué hace</Eyebrow>
          <h2 className="text-[2rem] leading-[1.05] sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
            {PIECE_COUNT} piezas. <Grad>Cada una con un trabajo.</Grad>
          </h2>
          <p className="text-neutral-400 text-[15px] sm:text-base">Usan los datos reales de tu tienda. Si no ofrecés algo, esa pieza no aparece. Nunca inventamos números.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
          {GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 0.08}>
              <Tilt max={5} scroll={0} className="h-full rounded-3xl">
                <div className="h-full rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/25 grid place-items-center shrink-0">
                      <g.icon className="w-5 h-5 text-emerald-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">{g.title}</h3>
                    <span className="ml-auto text-xs font-bold text-neutral-500 tabular-nums">{g.pieces.length}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4">{g.why}</p>
                  <MiniDemo tipo={g.demo} />
                  <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                    {g.pieces.map((p) => (
                      <span key={p} className="text-[11.5px] sm:text-xs font-semibold text-neutral-200 bg-white/[0.05] border border-white/10 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-neutral-500">Precios de ejemplo. En tu tienda se usan tus precios, tus cuotas y tus promociones.</p>
      </div>
    </section>
  );
}
