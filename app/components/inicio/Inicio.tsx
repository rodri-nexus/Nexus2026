"use client";

// Inicio de nevux.ar: presenta los dos servicios (rediseño de Tiendanube y sitios web), cada uno con su página,
// sus precios y su estructura. Casos reales: páginas web (Power Gym) y rediseños de tiendas (Hogar Digital, Perfumez).
// Regla: nada inventado (ni números de ventas, ni reseñas): solo trabajos y datos reales.

import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Check, Store, Globe, Sparkles, Wrench, Search, MessageCircle, X, Crown, RotateCw } from "lucide-react";
import { Glow, Reveal, Tilt } from "@/app/components/landing/fx";
import { PLANES, precioTexto } from "@/lib/planes";
import { trackWhatsApp } from "@/app/components/landing/cta";
import { BotonWA, Cabecera, Celular, PieGeneral, Titulo, WA_GENERAL, WA_TIENDA, WA_WEB, PLANES_WEB, waLink } from "./comun";
import PlanesFlip from "./PlanesFlip";

const HERO = { oculto: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const ITEM = { oculto: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } };



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


// Casos reales. Para sumar uno nuevo: grabar el recorrido en celular (public/casos/<id>/recorrido.mp4 y .jpg) y agregarlo acá.
type Caso = { id: string; etiqueta: string; nombre: string; texto: string; url?: string; video: string; poster: string };
const CASOS_WEB: Caso[] = [
  { id: "power-gym", etiqueta: "Sitio web · Plan Premium", nombre: "Power Gym · Diamante", texto: "Ficha de cada profe, videos, horarios, planes y reservas por WhatsApp.", url: "https://powergym-diamante.vercel.app", video: "/casos/power-gym/recorrido.mp4", poster: "/casos/power-gym/recorrido.jpg" },
];
const CASOS_TIENDAS: Caso[] = [
  { id: "hogar-digital", etiqueta: "Tiendanube · Plan Premium", nombre: "Hogar Digital", texto: "Inicio con video, catálogo completo con filtros, ficha de producto y carrito.", url: "https://hogardigital.com.ar", video: "/casos/hogar-digital/recorrido.mp4", poster: "/casos/hogar-digital/recorrido.jpg" },
  { id: "perfumez", etiqueta: "Tiendanube · Plan Premium", nombre: "Perfumez · Perfumes árabes", texto: "Estilo negro y dorado con logo en 3D, ficha con notas olfativas y carrito con sugeridos.", video: "/casos/perfumez/recorrido.mp4", poster: "/casos/perfumez/recorrido.jpg" },
];

function CasoCel({ caso, delay }: { caso: Caso; delay: number }) {
  return (
    <Reveal delay={delay}>
      <Celular src={caso.video} poster={caso.poster} titulo={`Recorrido de ${caso.nombre}`} />
      <div className="mt-5 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">{caso.etiqueta}</span>
        <p className="mt-1 text-lg font-bold">{caso.nombre}</p>
        <p className="mx-auto max-w-[300px] text-sm text-neutral-400">{caso.texto}</p>
        {caso.url && <a href={caso.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-emerald-300 hover:text-emerald-200">Visitar →</a>}
      </div>
    </Reveal>
  );
}

function Proximo({ texto, detalle, origen }: { texto: string; detalle: string; origen: string }) {
  return (
    <Reveal delay={0.16}>
      <div className="mx-auto flex h-full min-h-[420px] w-full max-w-[280px] flex-col items-center justify-center rounded-[2.4rem] border border-dashed border-emerald-300/30 bg-emerald-300/[0.03] p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/15 text-2xl text-emerald-300">+</span>
        <p className="mt-5 text-lg font-extrabold">{texto}</p>
        <p className="mt-2 text-sm text-neutral-400">{detalle}</p>
        <div className="mt-6"><BotonWA href={WA_GENERAL} origen={origen}>Quiero la mía</BotonWA></div>
      </div>
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
            <div className="grid items-start gap-5 md:grid-cols-2">
              <Reveal>
                <PlanesFlip
                  etiqueta="Rediseño de Tiendanube"
                  icono={<Store className="h-6 w-6" />}
                  basico={PLANES.basico}
                  premium={PLANES.premium}
                  hrefBasico="/suscribirme?plan=basico"
                  hrefPremium="/suscribirme?plan=premium"
                  nota="Sin apps · Sin cambiar de plantilla · Cancelás cuando quieras"
                  link={{ href: "/tiendanube", texto: "Ver todo sobre el rediseño de tiendas" }}
                />
              </Reveal>
              <Reveal delay={0.1}>
                <PlanesFlip
                  etiqueta="Sitios web a medida"
                  icono={<Globe className="h-6 w-6" />}
                  basico={PLANES_WEB.basico}
                  premium={PLANES_WEB.premium}
                  hrefBasico={waLink(`Hola Rodrigo! Quiero el ${PLANES_WEB.basico.nombre} para mi marca: `)}
                  hrefPremium={waLink(`Hola Rodrigo! Quiero el ${PLANES_WEB.premium.nombre} para mi marca: `)}
                  whatsapp
                  nota="Sin costo de creación · Mantenimiento incluido · Sin permanencia"
                  link={{ href: "/sitios-web", texto: "Ver todo sobre los sitios web" }}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. Casos reales: páginas web y rediseños de tiendas, cada uno recorrido completo en celular */}
        <section id="casos" className="scroll-mt-20 border-y border-white/5 bg-white/[0.015] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Titulo eyebrow="Trabajos reales" bajada="Recorridos completos, en celular, de páginas y tiendas funcionando hoy.">Así quedan <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">mis trabajos.</span></Titulo>

            {/* Páginas web */}
            <div id="casos-web" className="scroll-mt-24">
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Sitios web a medida</span>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">Páginas web</h3>
                </div>
                <a href="/sitios-web" className="shrink-0 text-sm font-bold text-emerald-300 hover:text-emerald-200">Ver el servicio →</a>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {CASOS_WEB.map((c, i) => <CasoCel key={c.id} caso={c} delay={i * 0.08} />)}
                <Proximo texto="Tu página puede ser la próxima" detalle="Con tu marca, tus fotos y tus videos. Te armo una muestra sin cargo." origen="casos-web-proximo" />
              </div>
            </div>

            {/* Rediseños de tiendas */}
            <div id="casos-tiendas" className="mt-20 scroll-mt-24">
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Tiendanube</span>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">Rediseños de tiendas</h3>
                </div>
                <a href="/tiendanube" className="shrink-0 text-sm font-bold text-emerald-300 hover:text-emerald-200">Ver el servicio →</a>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {CASOS_TIENDAS.map((c, i) => <CasoCel key={c.id} caso={c} delay={i * 0.08} />)}
                <Proximo texto="Tu tienda puede ser la próxima" detalle="Pasame el link de tu Tiendanube y te muestro cómo quedaría." origen="casos-tiendas-proximo" />
              </div>
            </div>
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
