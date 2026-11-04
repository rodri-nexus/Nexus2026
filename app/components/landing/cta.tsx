"use client";

// Botones y piezas de texto que comparten todas las secciones de la landing.
// Links de WhatsApp y de pago: no cambiarlos (WhatsApp +54 9 343 416 3999; Premium → /suscribirme?plan=premium).

import { ArrowRight, MessageCircle } from "lucide-react";

export const WHATSAPP_URL =
  "https://wa.me/5493434163999?text=" + encodeURIComponent("Hola! Quiero el análisis gratis de mi tienda de Tiendanube: ");
export const PREMIUM_URL = "/suscribirme?plan=premium";
export const SUSCRIPCION_URL = "/suscribirme";

type TrackWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

// Registra el clic a WhatsApp como lead en Meta Pixel y GA4, con el origen del botón
export function trackWhatsApp(origen: string) {
  const w = window as TrackWindow;
  w.fbq?.("track", "Contact", { content_name: origen });
  w.gtag?.("event", "generate_lead", { method: "whatsapp", origen });
}

export const ars = (n: number) => "$" + Math.round(n).toLocaleString("es-AR");
export const num = (n: number) => Math.round(n).toLocaleString("es-AR");

export function WhatsAppCta({ origen, label = "Quiero mi análisis gratis", className = "" }: { origen: string; label?: string; className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(origen)}
      className={`nvx-shine nvx-press group inline-flex items-center justify-center gap-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold px-4 min-[360px]:px-7 py-4 rounded-2xl text-[15px] sm:text-base whitespace-nowrap shadow-[0_12px_40px_-10px_rgba(52,211,153,0.7)] hover:shadow-[0_18px_50px_-10px_rgba(52,211,153,0.85)] ${className}`}
    >
      <MessageCircle className="w-5 h-5 shrink-0 max-[359px]:hidden" />
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 max-[359px]:hidden" />
    </a>
  );
}

export function PremiumCta({ label = "Quiero el Premium", className = "" }: { label?: string; className?: string }) {
  return (
    <a
      href={PREMIUM_URL}
      className={`nvx-press group inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-300/[0.06] hover:bg-amber-300/[0.12] hover:border-amber-300/70 text-amber-200 font-bold px-6 py-4 text-[15px] shadow-[inset_0_1px_0_0_rgba(253,230,138,0.14)] ${className}`}
    >
      {label} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export function Eyebrow({ children, className = "text-emerald-300" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-xs font-bold uppercase tracking-[0.18em] ${className}`}>{children}</span>;
}

export function Grad({ children }: { children: React.ReactNode }) {
  return <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">{children}</span>;
}

// Respuesta corta a una duda, justo donde aparece (en vez de mandarla a las preguntas frecuentes)
export function Duda({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 sm:px-5 sm:py-4 text-left">
      <div className="text-[13px] sm:text-sm font-bold text-white">{q}</div>
      <p className="mt-1 text-[13px] sm:text-sm text-neutral-400 leading-relaxed">{children}</p>
    </div>
  );
}
