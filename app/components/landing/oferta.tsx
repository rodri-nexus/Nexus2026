"use client";

// Secciones 7 a 13 de la landing (docs/landing.md): la cuenta, cómo funciona, comparativa, planes,
// quién lo hace, preguntas frecuentes, cierre y pie de página.
// Regla: nada inventado. Precios y lo que incluye cada plan salen de lib/planes.ts. No se prometen plazos ni resultados.

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Check, ChevronDown, CreditCard, Feather, MessageCircle, Minus, ShieldCheck, Store, Wrench, X, Zap } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import { PLANES } from "@/lib/planes";
import { CountUp, EASE, Glow, Reveal, Tilt } from "./fx";
import { Duda, Eyebrow, Grad, PREMIUM_URL, SUSCRIPCION_URL, WHATSAPP_URL, WhatsAppCta, ars, num, trackWhatsApp } from "./cta";
import { PIECE_COUNT } from "./secciones";

type PlanId = "basico" | "premium";
const NOMBRE: Record<PlanId, string> = { basico: "Básico", premium: "Premium" };
const ventasPara = (precio: number, ticket: number) => (ticket > 0 ? Math.ceil(precio / ticket) : 0);
const masArs = (n: number) => "+" + ars(n);

function Titulo({ eyebrow, children, bajada, className = "mb-12" }: { eyebrow: string; children: React.ReactNode; bajada?: React.ReactNode; className?: string }) {
  return (
    <Reveal className={`text-center max-w-2xl mx-auto ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-[2rem] leading-[1.05] sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">{children}</h2>
      {bajada && <p className="text-neutral-400 text-[15px] sm:text-base leading-relaxed">{bajada}</p>}
    </Reveal>
  );
}

// Selector de dos opciones con la pastilla que se desliza
function Selector({ valor, onChange, id }: { valor: PlanId; onChange: (p: PlanId) => void; id: string }) {
  return (
    <div role="radiogroup" aria-label="Plan" className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {(["basico", "premium"] as const).map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={valor === p}
          onClick={() => onChange(p)}
          className={`relative whitespace-nowrap px-3 sm:px-4 py-2 text-[13px] sm:text-sm font-bold rounded-lg transition-colors ${valor === p ? "text-black" : "text-neutral-400 hover:text-white"}`}
        >
          {valor === p && (
            <motion.span layoutId={`pastilla-${id}`} transition={{ duration: 0.4, ease: EASE }} className={`absolute inset-0 rounded-lg ${p === "premium" ? "bg-amber-300" : "bg-emerald-400"}`} />
          )}
          <span className="relative">
            {NOMBRE[p]} · {ars(PLANES[p].precio)}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---------- 7. La cuenta ---------- */

function Campo({ label, prefix, value, onChange, hint }: { label: string; prefix?: string; value: number; onChange: (n: number) => void; hint?: string }) {
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

export function LaCuenta({ ticket, setTicket }: { ticket: number; setTicket: (n: number) => void }) {
  const [visitas, setVisitas] = useState(3000);
  const [conv, setConv] = useState(1);
  const [mejora, setMejora] = useState(0.5);
  const [plan, setPlan] = useState<PlanId>("basico");

  const ventasHoy = (visitas * conv) / 100;
  const ventasExtra = (visitas * mejora) / 100;
  const extra = ventasExtra * ticket;
  const precio = PLANES[plan].precio;
  const seaPaga = ventasPara(precio, ticket);
  const premium = plan === "premium";

  return (
    <section id="cuenta" className="relative py-20 md:py-28 scroll-mt-20 overflow-hidden">
      <Glow className="top-1/3 left-1/2 -translate-x-1/2 w-[1100px] h-[700px]" color="rgba(16,185,129,0.08)" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Titulo eyebrow="Hacé la cuenta" bajada="Poné tus números. Un cambio chico en cuántas visitas compran mueve mucho la facturación.">
          Cuánto te deja <Grad>una tienda que convence</Grad>
        </Titulo>
        <Reveal>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-4">
            <div className="bg-[#101114] border border-white/[0.07] rounded-3xl p-5 sm:p-7 space-y-5">
              <Campo label="Visitas por mes" value={visitas} onChange={setVisitas} hint="Lo ves en Tiendanube → Estadísticas." />
              <Campo label="Ticket promedio" prefix="$" value={ticket} onChange={setTicket} />
              <div>
                <span className="text-xs font-bold text-neutral-300">De cada 100 visitas, ¿cuántas compran hoy?</span>
                <div className="mt-2 flex items-center gap-4">
                  <input type="range" min={0.2} max={5} step={0.1} value={conv} onChange={(e) => setConv(Number(e.target.value))} className="flex-1 accent-emerald-400" aria-label="Conversión actual" />
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
                      className={`nvx-press py-2.5 rounded-xl text-sm font-bold border transition-colors ${
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
              <CountUp value={extra} format={masArs} className="mt-2 block text-[2.6rem] sm:text-6xl font-black tracking-tight tabular-nums text-emerald-300 leading-none break-all" />
              <div className="text-sm text-neutral-400 mt-2">por mes, con las mismas visitas.</div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 mb-3">
                  <Calculator className="w-4 h-4 text-emerald-300" /> ¿Con cuántas ventas se paga?
                </div>
                <Selector valor={plan} onChange={setPlan} id="cuenta" />
                <p className="mt-3 text-sm text-neutral-300">
                  El {NOMBRE[plan]} cuesta {ars(precio)} por mes. Con tu ticket,{" "}
                  <b className={premium ? "text-amber-200" : "text-white"}>
                    se paga con {seaPaga} venta{seaPaga === 1 ? "" : "s"}
                  </b>
                  .
                </p>
              </div>
              <p className="mt-auto pt-6 text-[11px] text-neutral-500 leading-relaxed">
                Es una cuenta con tus números, no una promesa: el resultado depende de tu producto, tu precio y tu tráfico.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 8. Cómo funciona e instalación ---------- */

const PASOS = [
  { icon: MessageCircle, t: "Análisis gratis", d: "Nos mandás el link de tu tienda por WhatsApp y te decimos qué está frenando la compra. Sin costo y sin compromiso." },
  { icon: Wrench, t: "Lo armamos con tus datos", d: "Configuramos Nevux con tus precios, tus envíos y tu marca, y lo probamos sobre un producto tuyo antes de activarlo." },
  { icon: Zap, t: "Pegás una línea y listo", d: "En el editor de diseño de tu Tiendanube, con nuestra guía. Desde ahí, cualquier cambio lo hacemos nosotros." },
];

const DUDAS_INSTALACION = [
  { q: "¿Dónde se pega la línea?", a: "En el editor de diseño de tu Tiendanube. Te la mandamos ya configurada y te guiamos por WhatsApp." },
  { q: "¿Cuánto tarda?", a: "Lo coordinamos en el análisis, según lo que necesite tu tienda." },
  { q: "¿Rompe algo? ¿Cómo lo saco?", a: "No toca tu plantilla ni tus productos. Si borrás la línea, tu tienda vuelve a estar como antes." },
  { q: "¿Necesitan mi contraseña?", a: "No. La línea la pegás vos desde tu panel, con nuestra guía." },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Titulo eyebrow="Cómo funciona" bajada="Tres pasos. Sin programar, sin apps y sin cambiar tu plantilla." className="mb-14">
          Vos no tocás nada
        </Titulo>
        <div className="relative">
          {/* Línea que une los pasos y se dibuja al llegar */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
            className="hidden md:block absolute top-[46px] left-[16%] right-[16%] h-px origin-left bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-emerald-400/0"
          />
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
            className="md:hidden absolute top-8 bottom-8 left-[42px] w-px origin-top bg-gradient-to-b from-emerald-400/60 via-emerald-400/40 to-emerald-400/0"
          />
          <ol className="relative grid md:grid-cols-3 gap-4">
            {PASOS.map((s, i) => (
              <Reveal as="li" key={s.t} delay={0.1 + i * 0.15}>
                <div className="h-full bg-[#101114] border border-white/[0.07] rounded-2xl p-5 sm:p-7 flex md:block gap-4">
                  <div className="flex md:items-center md:justify-between md:mb-6 shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-[#0b0c0f] border border-emerald-400/30 grid place-items-center shadow-[0_0_0_6px_#101114]">
                      <s.icon className="w-5 h-5 text-emerald-300" />
                    </div>
                    <span className="hidden md:block text-3xl font-black text-white/10 tabular-nums">0{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1.5">
                      <span className="md:hidden text-emerald-300 tabular-nums mr-1.5">{i + 1}.</span>
                      {s.t}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          {DUDAS_INSTALACION.map((d, i) => (
            <Reveal key={d.q} delay={(i % 2) * 0.06}>
              <Duda q={d.q}>{d.a}</Duda>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <WhatsAppCta origen="como-funciona" label="Empezar con el análisis gratis" className="w-full sm:w-auto" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 9. Comparativa con las alternativas ---------- */

const COMPARE = [
  { row: "Quién lo configura", nevux: "Nosotros, con tus datos", apps: "Vos, una por una", tema: "Un diseñador o vos" },
  { row: "Qué instalás", nevux: "Una sola línea", apps: "Una app por función", tema: "La tienda entera de nuevo" },
  { row: "Tocás tu plantilla", nevux: false, apps: false, tema: true },
  { row: "Probado en tu ficha antes de activarlo", nevux: true, apps: false, tema: false },
  { row: "Cambios de precios y promos", nevux: "Los hacemos nosotros", apps: "Los hacés vos", tema: "Los hacés vos" },
];

function Celda({ v, strong }: { v: string | boolean; strong?: boolean }) {
  if (typeof v === "boolean")
    return v ? (
      <Check aria-label="Sí" className={`w-5 h-5 sm:mx-auto shrink-0 ${strong ? "text-emerald-300" : "text-neutral-400"}`} />
    ) : (
      <X aria-label="No" className="w-5 h-5 sm:mx-auto shrink-0 text-neutral-600" />
    );
  return <span className={`text-right sm:text-center ${strong ? "text-white font-bold" : "text-neutral-400"}`}>{v}</span>;
}

export function Comparativa() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Titulo eyebrow="Las alternativas" bajada="Hay otras formas de mejorar tu tienda. Esta es la diferencia.">
          Comparalo sin vueltas
        </Titulo>
        {/* Celular: una tarjeta por fila, con Nevux arriba y las otras dos debajo */}
        <div className="sm:hidden space-y-3">
          {COMPARE.map((r, i) => (
            <Reveal key={r.row} delay={i * 0.04}>
              <div className="bg-[#101114] border border-white/[0.07] rounded-2xl p-4">
                <div className="text-sm font-bold mb-3">{r.row}</div>
                <div className="flex items-center justify-between gap-3 bg-emerald-400/[0.08] border border-emerald-400/30 rounded-xl px-3 py-2.5 mb-1.5 text-sm">
                  <span className="font-extrabold text-emerald-300">Nevux</span>
                  <Celda v={r.nevux} strong />
                </div>
                {[
                  ["Apps sueltas", r.apps],
                  ["Rediseñar la tienda", r.tema],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm">
                    <span className="text-neutral-500">{k as string}</span>
                    <Celda v={v as string | boolean} />
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="hidden sm:block">
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
                <tr key={r.row} className="group">
                  <td className="p-4 border-t border-white/5 text-neutral-300 font-semibold group-hover:text-white transition-colors">{r.row}</td>
                  <td className={`p-4 text-center bg-emerald-400/[0.08] border-x border-emerald-400/30 border-t border-t-white/5 ${i === COMPARE.length - 1 ? "border-b rounded-b-2xl" : ""}`}>
                    <Celda v={r.nevux} strong />
                  </td>
                  <td className="p-4 text-center border-t border-white/5">
                    <Celda v={r.apps} />
                  </td>
                  <td className="p-4 text-center border-t border-white/5">
                    <Celda v={r.tema} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 10. Planes ---------- */

// Básico contra Premium. Cada fila sale de lo que incluye cada plan en lib/planes.ts.
const TABLA: { t: string; b: boolean | string; p: boolean | string }[] = [
  { t: "Análisis de tu tienda antes de empezar", b: true, p: true },
  { t: "Ficha Pro clara u oscura, con tus colores", b: true, p: true },
  { t: "Precios en escalera: transferencia y cuotas reales", b: true, p: true },
  { t: "Packs Llevá 2 y Llevá 3 con descuento", b: true, p: true },
  { t: `Las ${PIECE_COUNT} piezas, configuradas con tus datos`, b: true, p: true },
  { t: "Home de tu tienda", b: "Secciones de confianza", p: "De marca grande, con video" },
  { t: "Categorías que rotan, tira de categorías y comunidad", b: false, p: true },
  { t: "Números que suben, reseñas y locales con mapa", b: false, p: true },
  { t: "Carrito con barra de envío gratis", b: false, p: true },
  { t: "Cabecera con tu logo animado y pie a medida", b: false, p: true },
  { t: "Cambios y ajustes por WhatsApp sin costo extra", b: true, p: true },
];

function Marca({ v, oro }: { v: boolean | string; oro?: boolean }) {
  if (typeof v === "string") return <span className={`text-[12px] font-semibold ${oro ? "text-amber-200" : "text-neutral-300"}`}>{v}</span>;
  return v ? <Check aria-label="Incluido" className={`w-4 h-4 mx-auto ${oro ? "text-amber-300" : "text-emerald-300"}`} /> : <Minus aria-label="No incluido" className="w-4 h-4 mx-auto text-neutral-600" />;
}

function TablaPlanes() {
  const [abierta, setAbierta] = useState(false);
  return (
    <div className="mt-10 max-w-[860px] mx-auto rounded-3xl border border-white/[0.08] bg-[#0d0e11] overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        className="md:pointer-events-none w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-sm sm:text-base"
      >
        Básico contra Premium, punto por punto
        <ChevronDown className={`md:hidden w-5 h-5 text-emerald-400 transition-transform duration-300 ${abierta ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:grid-rows-[1fr] ${abierta ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <table className="w-full text-[13px] sm:text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider">
                <th className="text-left font-semibold text-neutral-500 px-5 py-2"></th>
                <th className="w-[22%] sm:w-[20%] py-2 text-emerald-300">Básico</th>
                <th className="w-[22%] sm:w-[20%] py-2 text-amber-300">Premium</th>
              </tr>
            </thead>
            <tbody>
              {TABLA.map((r) => (
                <tr key={r.t} className="border-t border-white/5">
                  <td className="px-5 py-3 text-neutral-300">{r.t}</td>
                  <td className="py-3 text-center px-1">
                    <Marca v={r.b} />
                  </td>
                  <td className="py-3 text-center px-1 bg-amber-300/[0.04]">
                    <Marca v={r.p} oro />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Planes({ ticket }: { ticket: number }) {
  const b = PLANES.basico;
  const p = PLANES.premium;
  const vb = ventasPara(b.precio, ticket);
  const vp = ventasPara(p.precio, ticket);
  return (
    <section id="precio" className="relative py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5 overflow-hidden scroll-mt-20">
      <Glow className="top-1/3 left-1/4 -translate-x-1/2 w-[900px] h-[700px]" color="rgba(16,185,129,0.10)" />
      <Glow className="top-1/3 left-3/4 -translate-x-1/2 w-[900px] h-[700px]" color="rgba(251,191,36,0.09)" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <Titulo eyebrow="Planes" bajada="Mensual, sin permanencia y con 7 días de garantía." className="mb-10">
          Dos planes. <Grad>Todo incluido.</Grad>
        </Titulo>

        <div className="grid md:grid-cols-2 gap-5 items-stretch max-w-[860px] mx-auto">
          <Reveal className="min-w-0">
            <Tilt max={4} scroll={0} className="h-full rounded-3xl">
              <div className="h-full flex flex-col bg-[#0f1013] border border-emerald-400/40 rounded-3xl p-5 sm:p-7">
                <div className="text-center">
                  <span className="inline-block bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5">Básico</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-1">{b.nombre}</h3>
                  <p className="text-neutral-500 text-sm mb-6">Tu ficha de producto, de marca grande</p>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <span className="text-[clamp(2.2rem,10vw,3rem)] leading-none font-black tracking-tight tabular-nums">{ars(b.precio)}</span>
                    <span className="text-neutral-400 text-sm font-semibold mb-1.5">/mes</span>
                  </div>
                  <p className="text-[13px] text-emerald-300 font-semibold mb-6">
                    Con un ticket de {ars(ticket)}, se paga con {vb} venta{vb === 1 ? "" : "s"} al mes.
                  </p>
                </div>
                <ul className="space-y-2.5 text-left text-[13.5px] text-neutral-300 mb-7">
                  {b.incluye.map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <WhatsAppCta origen="precio" label="Empezar con el análisis gratis" className="w-full !whitespace-normal !px-4 text-center" />
                  <a href={SUSCRIPCION_URL} className="nvx-press mt-3 w-full inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-white font-bold px-6 py-3.5 rounded-2xl text-sm">
                    Ya lo decidí: suscribirme <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Tilt>
          </Reveal>

          <Reveal className="min-w-0" delay={0.08}>
            <Tilt max={4} scroll={0} className="h-full rounded-3xl">
              <div className="relative h-full flex flex-col bg-gradient-to-b from-amber-200 to-amber-400 text-black rounded-3xl p-5 sm:p-7 shadow-[0_30px_80px_-30px_rgba(251,191,36,0.55)]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black text-amber-300 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 ring-1 ring-amber-300/50">
                  El más completo
                </span>
                <div className="text-center">
                  <span className="inline-block bg-black text-amber-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5">Premium</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-1">{p.nombre}</h3>
                  <p className="text-black/60 text-sm mb-6">Tu tienda entera, como las marcas grandes</p>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <span className="text-[clamp(2.2rem,10vw,3rem)] leading-none font-black tracking-tight tabular-nums">{ars(p.precio)}</span>
                    <span className="text-black/60 text-sm font-semibold mb-1.5">/mes</span>
                  </div>
                  <p className="text-[13px] text-black/75 font-semibold mb-6">
                    Con un ticket de {ars(ticket)}, se paga con {vp} venta{vp === 1 ? "" : "s"} al mes.
                  </p>
                </div>
                <ul className="space-y-2.5 text-left text-[13.5px] mb-7">
                  {p.incluye.map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <a href={PREMIUM_URL} className="nvx-press nvx-shine w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-extrabold px-6 py-4 rounded-2xl">
                    Quiero el Premium <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href="#premium" className="nvx-press mt-3 w-full inline-flex items-center justify-center gap-2 border border-black/20 hover:border-black/40 font-bold px-6 py-3.5 rounded-2xl text-sm">
                    Verlo funcionando <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Tilt>
          </Reveal>
        </div>

        <Reveal className="mt-8 max-w-[860px] mx-auto grid sm:grid-cols-2 gap-3">
          <Duda q="¿Cuál me conviene?">
            <b className="text-emerald-300">Básico</b> si querés que tu ficha venda más y mantener tu home con secciones de confianza.{" "}
            <b className="text-amber-200">Premium</b> si además querés una home de marca grande, con video, categorías que rotan y carrito con envío gratis.
          </Duda>
          <Duda q="¿Cómo se paga y cómo cancelo?">
            Débito mensual por Mercado Pago, con tarjeta o con tu cuenta. Cancelás cuando quieras desde Mercado Pago o con el{" "}
            <a href="/arrepentimiento?tipo=baja" className="underline hover:text-white">
              botón de baja
            </a>
            , sin permanencia.
          </Duda>
        </Reveal>

        <TablaPlanes />

        {/* Garantía, en grande */}
        <Reveal className="mt-10 max-w-[860px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7 rounded-3xl border border-emerald-400/25 bg-gradient-to-r from-emerald-400/[0.10] to-transparent p-6 sm:p-8 text-center sm:text-left">
            <div className="relative shrink-0 w-24 h-24 rounded-full grid place-items-center border-2 border-dashed border-emerald-300/50">
              <div className="w-[76px] h-[76px] rounded-full bg-emerald-400 text-black grid place-items-center">
                <div className="leading-none">
                  <ShieldCheck className="w-6 h-6 mx-auto" />
                  <div className="mt-1 text-[22px] font-black tabular-nums text-center">7</div>
                  <div className="text-[9px] font-extrabold uppercase tracking-wider text-center">días</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold">Garantía de 7 días</h3>
              <p className="mt-2 text-sm sm:text-[15px] text-neutral-300 leading-relaxed">
                Si en los primeros 7 días no te convence cómo quedó tu tienda, nos escribís por WhatsApp y te devolvemos el 100% de lo que pagaste.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 11. Quién lo hace ---------- */

// Sin foto por ahora (pedido de Rodrigo): cuando la mande, ponerla en public/landing/rodrigo.jpg y cambiar FOTO_RODRIGO.
const FOTO_RODRIGO: string | null = null;

const HECHOS = [
  { icon: Store, t: "Probado en tiendas reales", d: "Funcionando en las plantillas Brasilia, Recife y Morelia de Tiendanube." },
  { icon: Check, t: "Solo datos reales", d: "Precios, cuotas y transferencia se leen de tu tienda. Si no ofrecés algo, no se muestra." },
  { icon: Feather, t: "No frena tu tienda", d: "Es un solo archivo que se carga en paralelo, sin apps." },
  { icon: CreditCard, t: "Sin permanencia", d: "Pagás mes a mes por Mercado Pago y cancelás cuando quieras." },
];

export function QuienLoHace() {
  return (
    <section id="quien" className="relative py-20 md:py-28 overflow-hidden scroll-mt-20">
      <Glow className="top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]" color="rgba(45,212,191,0.07)" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-[420px] rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 sm:p-9 text-center">
              {FOTO_RODRIGO ? (
                <img src={FOTO_RODRIGO} alt="Rodrigo, creador de Nevux" loading="lazy" className="mx-auto w-28 h-28 rounded-full object-cover border border-white/15" />
              ) : (
                <div aria-hidden className="mx-auto w-28 h-28 rounded-full grid place-items-center bg-gradient-to-br from-emerald-300 to-teal-500 text-black text-5xl font-black shadow-[0_20px_50px_-20px_rgba(52,211,153,.8)]">
                  R
                </div>
              )}
              <div className="mt-5 text-xl font-extrabold">Rodrigo</div>
              <div className="text-sm text-neutral-400">Creador de Nevux</div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/[0.08] px-3 py-1.5 text-[12px] text-emerald-200">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60 motion-reduce:hidden" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
                Te responde una persona, no un bot
              </div>
            </div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <Reveal className="text-center lg:text-left">
              <Eyebrow>Quién lo hace</Eyebrow>
              <h2 className="text-[2rem] leading-[1.05] sm:text-5xl font-extrabold tracking-tight mt-4 mb-5">
                Hablás siempre <Grad>con quien arma tu tienda.</Grad>
              </h2>
              <p className="text-neutral-400 text-[15px] sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Soy Rodrigo, creador de Nevux. Hago el análisis de tu tienda y te atiendo por WhatsApp: el que te responde es el mismo que configura tu ficha y tu home.
              </p>
            </Reveal>
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {HECHOS.map((f, i) => (
                <Reveal key={f.t} delay={0.05 + (i % 2) * 0.06}>
                  <div className="h-full rounded-2xl border border-white/[0.07] bg-[#101114] p-5">
                    <f.icon className="w-5 h-5 text-emerald-300 mb-3" />
                    <h3 className="font-bold mb-1">{f.t}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{f.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 12. Preguntas frecuentes ---------- */

const PRECIO_B = ars(PLANES.basico.precio);
const PRECIO_P = ars(PLANES.premium.precio);

const GRUPOS_FAQ: { t: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    t: "Instalación",
    items: [
      { q: "¿Tengo que cambiar de plantilla o saber programar?", a: "No. Nevux se suma a la plantilla que ya tenés. Te damos una sola línea, ya configurada para tu tienda, y la pegás en el editor de diseño." },
      { q: "¿Funciona con mi plantilla?", a: "Funciona en las plantillas de Tiendanube. En el análisis gratis lo probamos sobre tu tienda antes de activarlo." },
      { q: "“No tengo tiempo para instalar nada.”", a: "Por eso lo hacemos nosotros. Vos pegás una sola línea con nuestra guía por WhatsApp. Desde ahí, los cambios de precios, envíos o promociones corren por nuestra cuenta." },
      { q: "¿Cuánto tarda en estar funcionando?", a: "Lo coordinamos en el análisis, según lo que necesite tu tienda." },
      { q: "¿Hace más lenta mi tienda?", a: "La línea se carga en paralelo (async), así que no frena la carga de tu página. Es un solo archivo, sin apps." },
      { q: "¿Rompe algo? ¿Cómo lo saco?", a: "No toca tu plantilla ni tus productos. Si borrás la línea, tu tienda vuelve a estar como antes." },
      { q: "¿Necesitan mi contraseña?", a: "No. La línea la pegás vos desde tu panel, con nuestra guía." },
    ],
  },
  {
    t: "Planes y pago",
    items: [
      {
        q: "“Es caro para mi tienda.”",
        a: `Tiene sentido mirarlo así. Pensalo en ventas: con un ticket promedio de $35.000, el Básico (${PRECIO_B}) se paga con ${ventasPara(PLANES.basico.precio, 35000)} ventas al mes y el Premium (${PRECIO_P}), con ${ventasPara(PLANES.premium.precio, 35000)}. Hacé la cuenta con tus números en la calculadora.`,
      },
      { q: "¿Cuál me conviene, Básico o Premium?", a: "El Básico, si querés que tu ficha de producto venda más y mantener tu home con secciones de confianza. El Premium, si además querés una home de marca grande, con video, categorías que rotan y carrito con envío gratis. En el análisis te decimos cuál te sirve más." },
      { q: "¿Cómo se paga?", a: "Es una suscripción mensual por Mercado Pago, con tarjeta o con tu cuenta. Se debita sola cada mes." },
      {
        q: "¿Puedo cancelar?",
        a: (
          <>
            Sí, cuando quieras y sin permanencia mínima: desde Mercado Pago o con el{" "}
            <a href="/arrepentimiento?tipo=baja" className="underline hover:text-white">
              botón de baja
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    t: "Resultados",
    items: [
      { q: "¿Cuánto más voy a vender?", a: "No te prometemos un número: depende de tu producto, tu precio y tu tráfico. Lo que sí podés hacer es la cuenta con tus números en la calculadora de arriba." },
      { q: "“Mi tienda ya vende bien.”", a: "Buenísimo: tenés tráfico y un producto que funciona, que es lo más difícil. Nevux trabaja sobre eso: que más visitas terminen en compra y que cada compra lleve más, con packs y Combiná con." },
      { q: "¿Los precios y descuentos son reales?", a: "Sí. El precio por transferencia y las cuotas sin interés se leen de tu tienda. Los descuentos de los packs se cargan también como promoción en tu Tiendanube, para que el carrito cobre exactamente lo que se muestra." },
    ],
  },
  {
    t: "Garantía",
    items: [
      { q: "“¿Y si en mi tienda no funciona?”", a: "Es la duda más común. Por eso lo probamos sobre una ficha real de tu tienda antes de activarlo, y tenés 7 días de garantía." },
      { q: "¿Cómo pido la devolución?", a: "Nos escribís por WhatsApp dentro de los primeros 7 días y te devolvemos el 100% de lo que pagaste." },
    ],
  },
];

export function Preguntas() {
  const [grupo, setGrupo] = useState(0);
  const [abierta, setAbierta] = useState<string | null>(GRUPOS_FAQ[0].items[0].q);
  const g = GRUPOS_FAQ[grupo];
  return (
    <section id="preguntas" className="relative py-20 md:py-28 bg-[#0b0c0f] border-y border-white/5 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Titulo eyebrow="Preguntas frecuentes" className="mb-8">
          Lo que te puede estar frenando
        </Titulo>
        <Reveal>
          <div role="tablist" aria-label="Temas" className="-mx-4 px-4 mb-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center">
            {GRUPOS_FAQ.map((x, i) => (
              <button
                key={x.t}
                type="button"
                role="tab"
                aria-selected={grupo === i}
                onClick={() => {
                  setGrupo(i);
                  setAbierta(x.items[0].q);
                }}
                className={`nvx-press relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors border ${grupo === i ? "text-black border-transparent" : "text-neutral-300 hover:text-white border-white/10"}`}
              >
                {grupo === i && <motion.span layoutId="faq-tab" transition={{ duration: 0.4, ease: EASE }} className="absolute inset-0 rounded-full bg-emerald-400" />}
                <span className="relative">{x.t}</span>
              </button>
            ))}
          </div>
          <div className="space-y-3" role="tabpanel">
            {g.items.map((f) => {
              const open = abierta === f.q;
              return (
                <div key={f.q} className={`bg-[#101114] border rounded-2xl overflow-hidden transition-colors ${open ? "border-emerald-400/30" : "border-white/[0.07]"}`}>
                  <button
                    type="button"
                    onClick={() => setAbierta(open ? null : f.q)}
                    aria-expanded={open}
                    className="w-full p-5 text-left font-bold flex justify-between items-center gap-4 text-sm sm:text-base hover:bg-white/[0.03] transition-colors"
                  >
                    <span>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">{f.a}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center text-sm text-neutral-400">
            ¿Te quedó otra duda?{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp("preguntas")} className="font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4">
              Preguntanos por WhatsApp
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 13. Cierre y pie de página ---------- */

export function Cierre() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden nvx-grain">
      <div className="absolute inset-0 nvx-grid-bg rotate-180 pointer-events-none" />
      <Glow className="-bottom-40 left-1/2 -translate-x-1/2 w-[1100px] h-[700px]" color="rgba(16,185,129,0.16)" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <NevuxLogo size="medium" showText={false} />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 text-[2.1rem] leading-[1.02] sm:text-6xl font-extrabold tracking-[-0.04em] mb-6">
            ¿Y si el mes que viene vendieras más <Grad>con las mismas visitas?</Grad>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-neutral-400 text-[15px] sm:text-lg mb-9 max-w-xl mx-auto">
            Cada día que tu tienda sigue igual, las visitas que pagaste se van sin comprar. Mandanos el link y te decimos qué cambiar. Gratis.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <WhatsAppCta origen="cierre" className="w-full sm:w-auto" />
            <a
              href={PREMIUM_URL}
              className="nvx-press w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-300/[0.06] hover:bg-amber-300/[0.12] hover:border-amber-300/70 text-amber-200 font-bold px-6 py-4 text-[15px]"
            >
              Quiero el Premium <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-300">
            {["Garantía de 7 días", "Probado en tu tienda antes", "Cancelás cuando quieras"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 sm:px-3 py-1 sm:py-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-neutral-500 mt-5">Te responde Rodrigo, creador de Nevux. Una persona, no un bot.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Pie() {
  const links = [
    ["#premium", "Casos"],
    ["#disenos", "Diseños"],
    ["#cuenta", "Hacé la cuenta"],
    ["#precio", "Planes"],
    ["#preguntas", "Preguntas"],
  ];
  return (
    <footer className="border-t border-white/5 text-neutral-500 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <NevuxLogo size="small" textColor="#ffffff" />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed">Diseño que vende para Tiendanube: ficha de producto y home con tus datos reales, sin apps y sin cambiar de plantilla.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("footer")}
            className="mt-5 inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300"
          >
            <MessageCircle className="w-4 h-4" />
            Escribinos por WhatsApp
          </a>
        </div>
        <nav aria-label="Secciones">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400 mb-3">La página</div>
          <ul className="space-y-2">
            {links.map(([h, t]) => (
              <li key={h}>
                <a href={h} className="hover:text-white transition-colors">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legales">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400 mb-3">Tu suscripción</div>
          <ul className="space-y-2">
            <li>
              <a href="/disenos" className="hover:text-white transition-colors">
                Todos los diseños
              </a>
            </li>
            <li>
              <a href="/arrepentimiento" className="hover:text-white transition-colors">
                Botón de arrepentimiento
              </a>
            </li>
            <li>
              <a href="/arrepentimiento?tipo=baja" className="hover:text-white transition-colors">
                Botón de baja
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-xs text-center sm:text-left">© 2026 Nevux · Diseño que vende, para Tiendanube</div>
      </div>
    </footer>
  );
}
