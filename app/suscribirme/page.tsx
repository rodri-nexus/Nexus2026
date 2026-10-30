import type { Metadata } from "next";
import { Check, ShieldCheck, MessageCircle, CreditCard, Wrench, Rocket } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import { CLIENTES } from "@/lib/clientes";
import BotonPago from "./BotonPago";

// Página de suscripción: lo que se le manda al cliente en lugar del link pelado de Mercado Pago.
// Con ?c=<cliente> se personaliza con el nombre de su tienda (ver lib/clientes.ts).

const MP_SUSCRIPCION = "https://mpago.la/1LqFYin";
const WHATSAPP = "5493434163999";

// Título, descripción e imagen que muestran WhatsApp e Instagram al compartir el link (personalizados con ?c=)
export function generateMetadata({ searchParams }: { searchParams: { c?: string } }): Metadata {
  const c = searchParams.c && CLIENTES[searchParams.c] ? searchParams.c : undefined;
  const tienda = c ? CLIENTES[c].nombre.replace(/\s*\(.*\)\s*$/, "") : undefined;
  const titulo = tienda ? `Activá Nevux en ${tienda}` : "Activá Nevux en tu tienda";
  const descripcion = "Pack Landing Page Pro · $39.900 por mes con cobro automático por Mercado Pago. Cancelás cuando quieras. Garantía de 7 días.";
  const url = `/suscribirme${c ? `?c=${c}` : ""}`;
  const imagen = `/og?v=suscripcion${c ? `&c=${c}` : ""}`;
  return {
    title: `${titulo} · Nevux`,
    description: descripcion,
    robots: { index: false },
    openGraph: {
      title: titulo,
      description: descripcion,
      url,
      siteName: "Nevux",
      locale: "es_AR",
      type: "website",
      images: [{ url: imagen, secureUrl: `https://nevux.ar${imagen}`, type: "image/png", width: 1200, height: 630, alt: titulo }],
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: [imagen] },
  };
}

const INCLUYE = [
  "Packs Llevá 2 y Llevá 3 con descuento",
  "Cuenta regresiva de despacho y entrega estimada",
  "Botón de compra fijo y avisos de venta en vivo",
  "Combiná con, comparativa y preguntas frecuentes",
  "Home de tu tienda con secciones de confianza",
  "Configuración con tus colores, tus productos y tus datos",
  "Cambios y ajustes por WhatsApp sin costo extra",
];

const PASOS = [
  { icon: CreditCard, t: "Te suscribís", d: "Pagás con tarjeta en Mercado Pago. Se cobra solo cada mes, el mismo día." },
  { icon: Wrench, t: "Lo configuramos", d: "Te escribimos por WhatsApp y dejamos Nevux armado con los datos de tu tienda." },
  { icon: Rocket, t: "Tu tienda vende más", d: "Pegás una línea en tu Tiendanube (te guiamos) y queda funcionando." },
];

export default function SuscribirmePage({ searchParams }: { searchParams: { c?: string } }) {
  const cliente = searchParams.c ? CLIENTES[searchParams.c] : undefined;
  const tienda = cliente?.nombre.replace(/\s*\(.*\)\s*$/, "");
  const whatsapp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola! Tengo una consulta sobre la suscripción a Nevux${tienda ? ` para ${tienda}` : ""}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#07080a] text-white font-sans">
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" aria-label="Inicio">
            <NevuxLogo size="medium" textColor="#ffffff" />
          </a>
          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pago seguro
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs font-bold text-emerald-300 uppercase tracking-[0.18em] mb-3">Suscripción mensual</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          {tienda ? (
            <>
              Activá Nevux en <span className="text-emerald-300">{tienda}</span>
            </>
          ) : (
            "Activá Nevux en tu tienda"
          )}
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
          Tus fichas de producto y tu home, transformadas para vender más. Sin cambiar de plantilla y sin apps.
        </p>

        <div className="bg-[#0f1013] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_-20px_rgba(16,185,129,0.35)]">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h2 className="text-lg font-extrabold">Pack Landing Page Pro</h2>
            <span className="text-neutral-600 line-through text-sm font-bold">$49.900</span>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-black tracking-tight">$39.900</span>
            <span className="text-neutral-400 text-sm font-semibold mb-2">ARS / mes</span>
          </div>
          <p className="text-xs text-neutral-500 mb-6">Precio final. Se cobra automáticamente cada mes. Cancelás cuando quieras.</p>

          <ul className="space-y-2.5 text-sm text-neutral-300 mb-8">
            {INCLUYE.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>

          <BotonPago url={MP_SUSCRIPCION} tienda={tienda} />
          <p className="text-[11px] text-neutral-500 text-center mt-3">
            Vas a ir a Mercado Pago para cargar tu tarjeta de forma segura. Nevux nunca ve los datos de tu tarjeta.
          </p>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              <b className="text-white">Garantía de 7 días.</b> Si en los primeros 7 días no te convence cómo quedó tu tienda, te devolvemos
              el 100% de lo que pagaste.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-extrabold mt-12 mb-5">Qué pasa después de suscribirte</h2>
        <div className="space-y-3">
          {PASOS.map((p, i) => (
            <div key={p.t} className="flex gap-4 bg-[#101114] border border-white/[0.07] rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 grid place-items-center shrink-0">
                <p.icon className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-[11px] font-black text-neutral-600">PASO {i + 1}</span>
                <h3 className="font-bold">{p.t}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{p.d}</p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-full inline-flex items-center justify-center gap-2 border border-white/15 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" /> ¿Dudas? Escribinos por WhatsApp
        </a>

        <footer className="mt-12 pt-6 border-t border-white/5 text-center text-xs text-neutral-500 space-y-2">
          <p>Pago procesado por Mercado Pago · © 2026 Nevux</p>
          <p className="flex items-center justify-center gap-3">
            <a href="/arrepentimiento" className="underline hover:text-white">Botón de arrepentimiento</a>
            <span>·</span>
            <a href="/arrepentimiento?tipo=baja" className="underline hover:text-white">Botón de baja</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
