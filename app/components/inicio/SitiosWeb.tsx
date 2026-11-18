"use client";

// nevux.ar/sitios-web: páginas web a medida (landing pages) para marcas, emprendedores y comercios.
// Precio: $55.000 por mes, sin costo de creación, con mantenimiento. Caso real: Power Gym (Diamante).
// Regla: nada inventado. El mensaje de WhatsApp de ejemplo es el que arma la página de Power Gym.

import { MotionConfig, motion } from "framer-motion";
import {
  ArrowRight, Check, Dumbbell, Scissors, Sparkles, IceCream, ShoppingBag, Briefcase, Video, Users, Images,
  MessageCircle, Star, MapPin, Megaphone, Search, Wrench, ShieldCheck, X,
} from "lucide-react";
import { Glow, Reveal } from "@/app/components/landing/fx";
import { precioTexto } from "@/lib/planes";
import { BotonWA, Cabecera, Celular, PieGeneral, Titulo, WA_WEB, PRECIO_WEB } from "./comun";

const HERO = { oculto: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const ITEM = { oculto: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } };

const RUBROS = [
  { i: Dumbbell, t: "Gimnasios y estudios", d: "Profes, clases, horarios y planes." },
  { i: Scissors, t: "Barberías y peluquerías", d: "Cada barbero con sus cortes y turnos." },
  { i: Sparkles, t: "Estética y uñas", d: "Servicios, trabajos y reservas." },
  { i: IceCream, t: "Gastronomía", d: "Menú, gustos y pedidos por WhatsApp." },
  { i: ShoppingBag, t: "Marcas que venden por Instagram", d: "Catálogo con precios y pedido armado." },
  { i: Briefcase, t: "Profesionales y servicios", d: "Quién sos, qué hacés y cómo contactarte." },
];

const INCLUYE = [
  { i: Video, t: "Portada con video", d: "Lo primero que ven es tu marca en movimiento." },
  { i: Users, t: "Tu equipo, uno por uno", d: "Cada persona con su foto, lo que hace, sus horarios y sus videos." },
  { i: Images, t: "Galería de trabajos", d: "Tus fotos y videos de Instagram, ordenados y en alta calidad." },
  { i: MessageCircle, t: "Pedidos y turnos por WhatsApp", d: "El cliente elige y te llega el mensaje armado." },
  { i: Star, t: "Opiniones de clientes", d: "Los mensajes reales que te mandan, a la vista." },
  { i: MapPin, t: "Ubicación y horarios", d: "Mapa, cómo llegar y cuándo estás abierto." },
  { i: Megaphone, t: "Novedades y promos", d: "Clases nuevas, sorteos o descuentos, destacados." },
  { i: Search, t: "Preparada para Google", d: "Para que te encuentren cuando te buscan." },
];

const PRECIO_INCLUYE = [
  "Diseño a medida con tu logo y tus colores",
  "Todas las secciones que necesite tu marca",
  "Pedidos o turnos directo a tu WhatsApp",
  "Link propio para tu bio de Instagram",
  "Vista prolija al compartir por WhatsApp",
  "Cambios de precios, fotos y horarios cuando quieras",
  "Velocidad, actualizaciones y copia de seguridad",
  "Atención directa conmigo por WhatsApp",
];

const DUDAS = [
  { q: "¿Cuánto tarda en estar lista?", r: "Primero te armo una muestra con tu material. Cuando la aprobás y la ajustamos, la publicamos. Depende de qué tan rápido tengamos tus fotos, videos y datos." },
  { q: "¿Qué tengo que pasarte?", r: "Tu logo, fotos y videos (o los tomo de tu Instagram), tus servicios o productos con precios, horarios, ubicación y tu WhatsApp." },
  { q: "¿Puedo tener mi propio dominio?", r: "Sí. Arranca con un link gratuito y, si querés, se conecta un dominio propio (por ejemplo, tumarca.com.ar). El dominio se paga aparte, una vez por año." },
  { q: "¿Los clientes pueden pagar en la página?", r: "La página arma el pedido o el turno y te lo manda a tu WhatsApp, donde coordinás el pago. Si necesitás una tienda con pago online, te conviene Tiendanube." },
  { q: "¿Puedo darla de baja?", r: "Sí, cuando quieras y sin permanencia." },
];

function MensajeWhatsApp() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-[28px] border border-white/10 bg-[#0b141a] p-4 shadow-[0_30px_70px_-30px_rgba(0,0,0,.9)]">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-black">T</div>
        <div>
          <p className="text-sm font-bold">Tu WhatsApp</p>
          <p className="text-[11px] text-emerald-300">en línea</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="ml-auto mt-4 max-w-[88%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-4 py-3 text-[14px] leading-relaxed"
      >
        ¡Hola Leila! Mi nombre es Ana. Quiero reservar mi lugar en Core y glúteos poderosos (martes y jueves, 8:00 hs) con Luchy (Luciana Reynoso). ¿Me pasás info para arrancar? 💪
        <span className="mt-1 block text-right text-[10px] text-white/60">✓✓</span>
      </motion.div>
      <p className="mt-4 text-center text-[11px] text-neutral-500">Mensaje real que arma la página de Power Gym</p>
    </div>
  );
}

export default function SitiosWeb() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-[#07080a] text-white selection:bg-violet-400 selection:text-black">
        <Cabecera activa="web" />

        {/* 1. Portada */}
        <section className="nvx-grain relative overflow-hidden">
          <div className="nvx-grid-bg pointer-events-none absolute inset-0" />
          <Glow className="-top-72 left-1/2 h-[960px] w-[1300px] -translate-x-1/2" color="rgba(139,92,246,0.18)" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.2fr_1fr] md:pb-24 md:pt-20">
            <motion.div variants={HERO} initial="oculto" animate="visible" className="text-center md:text-left">
              <motion.span variants={ITEM} className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-400/[0.08] px-3.5 py-1.5 text-xs font-semibold text-violet-200">
                Sitios web a medida
              </motion.span>
              <motion.h1 variants={ITEM} className="mb-6 text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
                Tu página propia,{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-violet-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-[nvx-grad_6s_ease-in-out_infinite] motion-reduce:animate-none">
                  lista para tu Instagram.
                </span>
              </motion.h1>
              <motion.p variants={ITEM} className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-neutral-400 sm:text-lg md:mx-0">
                Un sitio web con tu marca, tus servicios, tu equipo y tus videos. El cliente toca el link de tu bio, elige lo que quiere y te llega el pedido o el turno armado a tu WhatsApp.
              </motion.p>
              <motion.div variants={ITEM} className="flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                <BotonWA href={WA_WEB} origen="hero-web" variante="violeta" className="w-full sm:w-auto">Quiero mi sitio web</BotonWA>
                <a href="#precio" className="nvx-press inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-[15px] font-bold hover:bg-white/[0.05] sm:w-auto">
                  Ver precio <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
              <motion.ul variants={ITEM} className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-neutral-300 md:justify-start">
                {["Sin costo de creación", "Muestra gratis", "Mantenimiento incluido"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                    <Check className="h-3.5 w-3.5 text-violet-300" /> {t}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative">
              <Glow className="left-1/2 top-1/2 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2" color="rgba(167,139,250,0.22)" />
              <Celular src="/casos/power-gym/landing.mp4" poster="/casos/power-gym/landing.jpg" titulo="Sitio web de Power Gym bajando solo" className="nvx-float" />
              <p className="relative mt-5 text-center text-[11px] text-neutral-500">Sitio real: Power Gym, Diamante (Entre Ríos)</p>
            </motion.div>
          </div>
        </section>

        {/* 2. Para quién */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Titulo eyebrow="Para quién es" color="text-violet-300">Para cualquier marca <span className="text-neutral-500">que quiera verse profesional.</span></Titulo>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RUBROS.map(({ i: I, t, d }, k) => (
                <Reveal key={t} delay={k * 0.05}>
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-400/15 text-violet-300"><I className="h-5 w-5" /></div>
                    <div><p className="font-bold">{t}</p><p className="mt-1 text-sm text-neutral-400">{d}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Qué tiene tu página */}
        <section className="border-y border-white/5 bg-white/[0.015] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Titulo eyebrow="Qué tiene tu página" color="text-violet-300" bajada="Se arma con las secciones que necesita tu marca. Estas son las más usadas:">Todo lo que tu cliente <span className="text-neutral-500">necesita ver.</span></Titulo>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {INCLUYE.map(({ i: I, t, d }, k) => (
                <Reveal key={t} delay={(k % 4) * 0.06}>
                  <div className="h-full rounded-[22px] border border-white/10 bg-[#0d0f12] p-5 transition-colors hover:border-violet-300/40">
                    <I className="h-6 w-6 text-violet-300" />
                    <p className="mt-4 font-bold">{t}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Pedido por WhatsApp */}
        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">El botón que te ahorra tiempo</span>
              <h2 className="mt-4 text-[2rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-5xl">Te llega el pedido <span className="text-neutral-500">ya armado.</span></h2>
              <p className="mt-5 text-[15px] leading-relaxed text-neutral-400 sm:text-lg">Basta de ir y venir con mensajes preguntando precios, horarios o con quién. En tu página, el cliente:</p>
              <ol className="mt-6 space-y-3">
                {["Elige el servicio, el producto o la persona", "Pone su nombre y lo que necesita", "Toca el botón y te escribe a tu WhatsApp con todo el detalle"].map((t, k) => (
                  <li key={t} className="flex items-start gap-3 text-[15px]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-400 text-sm font-extrabold text-black">{k + 1}</span>
                    <span className="pt-0.5 text-neutral-200">{t}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.1}><MensajeWhatsApp /></Reveal>
          </div>
        </section>

        {/* 5. Caso real */}
        <section className="border-y border-white/5 bg-gradient-to-b from-violet-500/[0.06] to-transparent py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr]">
            <Reveal className="order-2 md:order-1">
              <Celular src="/casos/power-gym/landing.mp4" poster="/casos/power-gym/landing.jpg" titulo="Sitio web de Power Gym" />
            </Reveal>
            <Reveal delay={0.1} className="order-1 md:order-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Caso real</span>
              <h2 className="mt-4 text-[2rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-5xl">Power Gym</h2>
              <p className="mt-2 text-neutral-400">Gimnasio en Diamante, Entre Ríos</p>
              <ul className="mt-6 space-y-3 text-[15px] text-neutral-200">
                {[
                  "Portada con video de sus clases",
                  "Las 8 profes, cada una con su ficha, sus videos y sus horarios",
                  "Grilla de horarios para elegir el día",
                  "Planes y precios del mes, siempre actualizados",
                  "Reservas y consultas que llegan armadas a su WhatsApp",
                  "Ubicación con mapa y preguntas frecuentes",
                ].map((t) => (
                  <li key={t} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />{t}</li>
                ))}
              </ul>
              <a href="https://powergym-diamante.vercel.app" target="_blank" rel="noopener noreferrer" className="nvx-press mt-8 inline-flex items-center gap-2 rounded-2xl border border-violet-300/40 bg-violet-400/[0.08] px-6 py-3.5 font-bold text-violet-200 hover:bg-violet-400/[0.15]">
                Ver la página <ArrowRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </section>

        {/* 6. Precio */}
        <section id="precio" className="scroll-mt-20 py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Titulo eyebrow="Precio" color="text-violet-300">Un solo precio, <span className="text-neutral-500">todo incluido.</span></Titulo>
            <div className="grid items-stretch gap-5 md:grid-cols-[1.15fr_1fr]">
              <Reveal>
                <div className="relative h-full overflow-hidden rounded-[28px] border border-violet-300/40 bg-gradient-to-b from-violet-500/[0.16] to-[#0d0f12] p-7 sm:p-9">
                  <span className="inline-flex rounded-full bg-violet-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-black">Sitio web a medida</span>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl">{precioTexto(PRECIO_WEB)}</span>
                    <span className="text-neutral-400">/mes</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-violet-200">Sin costo de creación · Sin permanencia</p>
                  <ul className="mt-7 space-y-3">
                    {PRECIO_INCLUYE.map((t) => (
                      <li key={t} className="flex gap-3 text-[15px] text-neutral-200"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />{t}</li>
                    ))}
                  </ul>
                  <BotonWA href={WA_WEB} origen="precio-web" variante="violeta" className="mt-8 w-full">Quiero mi muestra gratis</BotonWA>
                  <p className="mt-3 text-center text-xs text-neutral-500">Primero ves la muestra con tu marca. Pagás recién si te gusta.</p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-7 sm:p-9">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Lo común en el mercado</span>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                      <span className="text-neutral-400">Creación de la página</span>
                      <span className="text-right font-bold text-neutral-200">$500.000 a $800.000</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                      <span className="text-neutral-400">Mantenimiento</span>
                      <span className="text-right font-bold text-neutral-200">Aparte, cada mes</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3 text-[15px] text-neutral-400">
                    {["Te la entregan y no se ocupan más", "Sin mantenimiento, se pone lenta y queda vieja", "Cada cambio, un pago nuevo"].map((t) => (
                      <li key={t} className="flex gap-3"><X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />{t}</li>
                    ))}
                  </ul>
                  <div className="mt-auto grid grid-cols-3 gap-2 pt-8 text-center text-[11px] text-neutral-300">
                    {[{ i: Wrench, t: "Mantenimiento" }, { i: ShieldCheck, t: "Copia de seguridad" }, { i: Search, t: "Google" }].map(({ i: I, t }) => (
                      <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.02] px-2 py-3"><I className="mx-auto mb-1.5 h-4 w-4 text-violet-300" />{t}<br /><span className="text-violet-300">incluido</span></div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
            <p className="mt-6 text-center text-sm text-neutral-500">
              ¿Vendés con Tiendanube? <a href="/tiendanube" className="font-bold text-emerald-300 hover:text-emerald-200">Mirá el rediseño de tiendas →</a>
            </p>
          </div>
        </section>

        {/* 7. Preguntas */}
        <section className="border-t border-white/5 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Titulo eyebrow="Preguntas" color="text-violet-300">Lo que más me preguntan</Titulo>
            <div className="space-y-3">
              {DUDAS.map((d) => (
                <details key={d.q} className="group rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 open:bg-white/[0.04]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    {d.q}
                    <span className="text-xl text-violet-300 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{d.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Cierre */}
        <section className="nvx-grain relative overflow-hidden py-20 md:py-28">
          <Glow className="-bottom-40 left-1/2 h-[700px] w-[1100px] -translate-x-1/2" color="rgba(139,92,246,0.18)" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="mb-5 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Tu marca merece <span className="bg-gradient-to-r from-violet-300 to-fuchsia-200 bg-clip-text text-transparent">su propia página.</span>
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-[15px] text-neutral-400 sm:text-lg">Pasame tu Instagram y te armo una muestra sin compromiso.</p>
              <BotonWA href={WA_WEB} origen="cierre-web" variante="violeta" className="w-full sm:w-auto">Quiero mi sitio web</BotonWA>
              <p className="mt-5 text-xs text-neutral-500">Te responde Rodrigo, creador de Nevux.</p>
            </Reveal>
          </div>
        </section>

        <PieGeneral />
      </div>
    </MotionConfig>
  );
}
