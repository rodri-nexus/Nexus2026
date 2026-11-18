"use client";

// Inicio de nevux.ar: presenta los dos servicios (rediseño de Tiendanube y sitios web), cada uno con su página,
// sus precios y su estructura. Casos reales: Hogar Digital, Power Gym y el estilo de Valmont (en la tienda demo).
// Regla: nada inventado (ni números de ventas, ni reseñas): solo trabajos y datos reales.

import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Check, Store, Globe, Sparkles, Wrench, Search, MessageCircle, X } from "lucide-react";
import NotebookVideo from "@/app/components/landing/NotebookVideo";
import { Glow, Reveal, Tilt } from "@/app/components/landing/fx";
import { PLANES, precioTexto } from "@/lib/planes";
import { trackWhatsApp } from "@/app/components/landing/cta";
import { BotonWA, Cabecera, Celular, PieGeneral, Titulo, WA_TIENDA, WA_WEB, PRECIO_WEB } from "./comun";

const HERO = { oculto: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const ITEM = { oculto: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } };

const SERVICIOS = [
  {
    id: "tiendanube",
    icono: Store,
    color: "emerald",
    eyebrow: "Para tiendas online",
    titulo: "Rediseño de Tiendanube",
    texto: "Tu tienda como la de las marcas grandes, sobre la que ya tenés: sin apps, sin cambiar de plantilla y sin tocar tus productos.",
    precio: `Desde ${precioTexto(PLANES.basico.precio)}`,
    nota: `Básico ${precioTexto(PLANES.basico.precio)} · Premium ${precioTexto(PLANES.premium.precio)} por mes`,
    puntos: ["Ficha de producto que vende", "Inicio con video y tus productos", "Carrito con barra de envío gratis", "Efectos y animaciones premium"],
    href: "/tiendanube",
    boton: "Ver los planes de Tiendanube",
  },
  {
    id: "web",
    icono: Globe,
    color: "violet",
    eyebrow: "Para marcas, emprendedores y comercios",
    titulo: "Sitios web a medida",
    texto: "Tu página propia para la bio de Instagram: tus servicios, tu equipo, tus videos y pedidos o turnos directo a tu WhatsApp.",
    precio: precioTexto(PRECIO_WEB),
    nota: "Por mes, con mantenimiento incluido",
    puntos: ["Diseño a medida de tu marca", "Pedidos y turnos por WhatsApp", "Ficha de cada persona del equipo", "Preparada para Google"],
    href: "/sitios-web",
    boton: "Ver cómo es un sitio web",
  },
] as const;

const PASOS = [
  { n: "01", t: "Me contás tu idea", d: "Por WhatsApp: qué vendés, cómo trabajás y qué querés lograr." },
  { n: "02", t: "Te armo una muestra", d: "Con tu marca, tus fotos y tus videos. Sin compromiso y sin pagar nada." },
  { n: "03", t: "La ajustamos juntos", d: "Cambiamos lo que quieras hasta que quede como la imaginabas." },
  { n: "04", t: "La publicamos", d: "Y desde ahí me encargo de todo, todos los meses." },
];

const DUDAS = [
  { q: "¿Por qué no cobrás la creación?", r: "Porque prefiero acompañarte mes a mes. Pagás un monto mensual según el plan, y la página o la tienda siempre está actualizada, rápida y funcionando." },
  { q: "¿Tengo que saber algo de páginas web?", r: "No. Vos me pasás la información y yo me encargo del diseño, la publicación y el mantenimiento." },
  { q: "¿Puedo cancelar cuando quiera?", r: "Sí. No hay permanencia: lo das de baja cuando quieras, sin multa." },
  { q: "¿Qué pasa si quiero cambiar algo?", r: "Me escribís por WhatsApp y lo cambio: precios, productos, fotos, horarios o promos. Está incluido." },
  { q: "¿Trabajás con gente de cualquier lugar?", r: "Sí. Trabajo con marcas y tiendas de distintas provincias: todo se hace online." },
];

function TarjetaServicio({ s, i }: { s: (typeof SERVICIOS)[number]; i: number }) {
  const v = s.color === "violet";
  const I = s.icono;
  return (
    <Reveal delay={i * 0.1} className="h-full">
      <Tilt max={5} scroll={0} glare className="h-full">
        <a
          href={s.href}
          className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border p-6 sm:p-8 transition-colors ${v ? "border-emerald-400/25 bg-gradient-to-b from-emerald-500/[0.12] to-white/[0.02] hover:border-emerald-300/50" : "border-emerald-400/25 bg-gradient-to-b from-emerald-500/[0.12] to-white/[0.02] hover:border-emerald-300/50"}`}
        >
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${v ? "bg-emerald-400 text-black" : "bg-emerald-400 text-black"}`}>
            <I className="h-6 w-6" />
          </div>
          <span className={`mt-6 text-xs font-bold uppercase tracking-[0.16em] ${v ? "text-emerald-300" : "text-emerald-300"}`}>{s.eyebrow}</span>
          <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{s.titulo}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{s.texto}</p>
          <ul className="mt-6 space-y-2.5">
            {s.puntos.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[15px] text-neutral-200">
                <Check className={`h-4 w-4 shrink-0 ${v ? "text-emerald-300" : "text-emerald-300"}`} /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-[-0.03em]">{s.precio}</span>
              <span className="text-sm text-neutral-400">/mes</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{s.nota}</p>
            <span className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-extrabold text-black transition-transform group-hover:translate-y-[-1px] ${v ? "bg-emerald-400" : "bg-emerald-400"}`}>
              {s.boton} <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </a>
      </Tilt>
    </Reveal>
  );
}

export default function Inicio() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-[#07080a] text-white selection:bg-emerald-400 selection:text-black">
        <Cabecera activa="inicio" />

        {/* 1. Portada */}
        <section className="nvx-grain relative overflow-hidden">
          <div className="nvx-grid-bg pointer-events-none absolute inset-0" />
          <Glow className="-top-72 left-[30%] h-[900px] w-[1100px] -translate-x-1/2" color="rgba(16,185,129,0.16)" />
          <Glow className="-top-60 left-[75%] h-[900px] w-[1000px] -translate-x-1/2" color="rgba(16,185,129,0.15)" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-24">
            <motion.div variants={HERO} initial="oculto" animate="visible" className="mx-auto max-w-4xl text-center">
              <motion.span variants={ITEM} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-neutral-200">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" /> Tiendas Tiendanube y sitios web a medida
              </motion.span>
              <motion.h1 variants={ITEM} className="mb-6 text-[2.7rem] font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[5rem]">
                Tu marca,
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-[nvx-grad_6s_ease-in-out_infinite] motion-reduce:animate-none">
                  a otro nivel.
                </span>
              </motion.h1>
              <motion.p variants={ITEM} className="mx-auto mb-8 max-w-2xl text-[15px] leading-relaxed text-neutral-400 sm:text-lg">
                Rediseño tiendas de <b className="font-semibold text-white">Tiendanube</b> para que vendan más y creo <b className="font-semibold text-white">sitios web a medida</b> para marcas, emprendedores y comercios. Sin costo de creación: un monto mensual y me encargo de todo.
              </motion.p>
              <motion.div variants={ITEM} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={WA_TIENDA} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp("hero-inicio-analisis")} className="nvx-press nvx-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-[15px] font-extrabold text-black shadow-[0_12px_40px_-10px_rgba(52,211,153,0.7)] hover:bg-emerald-300 sm:w-auto">
                  <Store className="h-5 w-5" /> Analizá mi tienda
                </a>
                <a href="/sitios-web" className="nvx-press inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/40 bg-emerald-400/[0.08] px-6 py-4 text-[15px] font-extrabold text-emerald-200 hover:bg-emerald-400/[0.15] sm:w-auto">
                  <Globe className="h-5 w-5" /> Quiero un sitio web
                </a>
              </motion.div>
              <motion.ul variants={ITEM} className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-neutral-300">
                {["Muestra gratis antes de pagar", "Sin costo de creación", "Mantenimiento incluido", "Cancelás cuando quieras"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> {t}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* 2. Los dos servicios */}
        <section id="servicios" className="scroll-mt-20 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Titulo eyebrow="Elegí lo que necesitás">Dos servicios, <span className="text-neutral-500">un mismo objetivo:</span> que vendas más.</Titulo>
            <div className="grid gap-5 md:grid-cols-2">
              {SERVICIOS.map((s, i) => <TarjetaServicio key={s.id} s={s} i={i} />)}
            </div>
          </div>
        </section>

        {/* 3. Casos reales */}
        <section id="casos" className="scroll-mt-20 border-y border-white/5 bg-white/[0.015] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Titulo eyebrow="Trabajos reales" bajada="Tiendas y páginas funcionando hoy, con sus datos reales.">Así quedan <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">mis trabajos.</span></Titulo>
            <div className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
              <Reveal>
                <NotebookVideo src="/casos/premium/hogar-digital.mp4" poster="/casos/premium/hogar-digital.jpg" url="hogardigital.com.ar" titulo="Tienda Hogar Digital con el plan Premium" />
                <div className="mt-5 text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Tiendanube · Plan Premium</span>
                  <p className="mt-1 text-lg font-bold">Hogar Digital</p>
                  <p className="text-sm text-neutral-400">Inicio con video, ficha de producto y carrito renovados.</p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <Celular src="/casos/power-gym/landing.mp4" poster="/casos/power-gym/landing.jpg" titulo="Sitio web de Power Gym" />
                <div className="mt-5 text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Sitio web a medida</span>
                  <p className="mt-1 text-lg font-bold">Power Gym · Diamante</p>
                  <p className="text-sm text-neutral-400">Ficha de cada profe, videos, horarios y reservas por WhatsApp.</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="mt-14">
              <div className="grid items-center gap-8 rounded-[28px] border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.07] to-transparent p-6 sm:p-8 md:grid-cols-[1fr_1.2fr]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Tiendanube · Estilo a medida</span>
                  <p className="mt-2 text-2xl font-extrabold tracking-[-0.02em]">Valmont & Co. · Relojería</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">Un estilo negro y dorado creado para Valmont, con portada animada, vitrina y ficha de lujo. Acá lo ves en la tienda de demostración, con relojes de ejemplo.</p>
                </div>
                <NotebookVideo src="/casos/premium/demo.mp4" poster="/casos/premium/demo.jpg" url="tienda-demo" titulo="Estilo creado para Valmont, en la tienda demo" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. Por qué no cobro la creación */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Titulo eyebrow="Por qué trabajo así">No te cobro la creación. <span className="text-neutral-500">Y no desaparezco.</span></Titulo>
            <div className="grid gap-5 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.02] p-6 sm:p-7">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Lo común</span>
                  <ul className="mt-4 space-y-3 text-[15px] text-neutral-400">
                    {[
                      "Te cobran entre $500.000 y $800.000 por hacer la página.",
                      "Te la entregan y no se ocupan más.",
                      "Sin mantenimiento, se pone lenta y queda desactualizada.",
                      "Si nadie se ocupa del alojamiento y el dominio, deja de verse.",
                      "Para que la arreglen: otro pago, más el mantenimiento por mes.",
                    ].map((t) => (
                      <li key={t} className="flex gap-3"><X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />{t}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="h-full rounded-[24px] border border-emerald-400/30 bg-gradient-to-b from-emerald-500/[0.1] to-transparent p-6 sm:p-7">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Con Nevux</span>
                  <ul className="mt-4 space-y-3 text-[15px] text-neutral-200">
                    {[
                      "No pagás la creación: un monto mensual según tu plan.",
                      "Antes de pagar, ves una muestra con tu marca.",
                      "Cambios de precios, productos y promos cuando quieras.",
                      "Siempre rápida, online, actualizada y con copia de seguridad.",
                      "Sin permanencia: la das de baja cuando quieras.",
                    ].map((t) => (
                      <li key={t} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{t}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { i: Wrench, t: "Mantenimiento mensual", d: "Velocidad, actualizaciones y cambios incluidos." },
                  { i: Search, t: "Preparada para Google", d: "Títulos, descripciones y fotos optimizadas." },
                  { i: MessageCircle, t: "Hablás conmigo", d: "Por WhatsApp, sin bots ni tickets." },
                ].map(({ i: I, t, d }) => (
                  <div key={t} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <I className="h-5 w-5 shrink-0 text-emerald-300" />
                    <div><p className="font-bold">{t}</p><p className="mt-1 text-sm text-neutral-400">{d}</p></div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 5. Cómo trabajo */}
        <section id="como" className="scroll-mt-20 border-y border-white/5 bg-white/[0.015] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Titulo eyebrow="Cómo trabajo">De la idea a tu página, <span className="text-neutral-500">en 4 pasos.</span></Titulo>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PASOS.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.08}>
                  <div className="h-full rounded-[24px] border border-white/10 bg-[#0d0f12] p-6">
                    <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-4xl font-extrabold text-transparent">{p.n}</span>
                    <p className="mt-4 text-lg font-bold">{p.t}</p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Preguntas */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Titulo eyebrow="Preguntas">Antes de arrancar</Titulo>
            <div className="space-y-3">
              {DUDAS.map((d) => (
                <details key={d.q} className="group rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 open:bg-white/[0.04]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    {d.q}
                    <span className="text-xl text-emerald-300 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{d.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Cierre */}
        <section className="nvx-grain relative overflow-hidden py-20 md:py-28">
          <Glow className="-bottom-40 left-1/2 h-[700px] w-[1100px] -translate-x-1/2" color="rgba(16,185,129,0.14)" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="mb-5 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                ¿Arrancamos con <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">tu marca?</span>
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-[15px] text-neutral-400 sm:text-lg">Contame qué tenés y qué querés lograr. Te armo una muestra sin compromiso.</p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BotonWA href={WA_TIENDA} origen="cierre-inicio-tienda" className="w-full sm:w-auto">Analizá mi tienda</BotonWA>
                <BotonWA href={WA_WEB} origen="cierre-inicio-web" variante="linea" className="w-full sm:w-auto">Quiero un sitio web</BotonWA>
              </div>
              <p className="mt-5 text-xs text-neutral-500">Te responde Rodrigo, creador de Nevux. Una persona, no un bot.</p>
            </Reveal>
          </div>
        </section>

        <PieGeneral />
      </div>
    </MotionConfig>
  );
}
