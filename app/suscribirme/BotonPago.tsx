"use client";

import { Lock } from "lucide-react";

type TrackWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

// Botón al checkout de la suscripción en Mercado Pago. Registra el inicio de pago en Meta Pixel y GA4.
export default function BotonPago({ url, tienda }: { url: string; tienda?: string }) {
  return (
    <a
      href={url}
      onClick={() => {
        const w = window as TrackWindow;
        w.fbq?.("track", "InitiateCheckout", { value: 39900, currency: "ARS", content_name: tienda || "Pack Landing Page Pro" });
        w.gtag?.("event", "begin_checkout", { value: 39900, currency: "ARS", tienda });
      }}
      className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base px-7 py-4 rounded-2xl transition-all shadow-[0_10px_40px_-8px_rgba(16,185,129,0.6)] active:scale-95"
    >
      <Lock className="w-5 h-5" />
      Suscribirme con Mercado Pago
    </a>
  );
}
