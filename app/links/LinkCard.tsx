"use client";

import { ChevronRight } from "lucide-react";

type TrackWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

// Botón de la página de links. El de WhatsApp se registra como lead (Contact en Meta, generate_lead en GA4).
export default function LinkCard({
  href,
  origen,
  titulo,
  texto,
  imagen,
  icono,
  destacado,
}: {
  href: string;
  origen: string;
  titulo: string;
  texto: string;
  imagen?: string;
  icono?: React.ReactNode;
  destacado?: boolean;
}) {
  const externo = href.startsWith("http");
  const track = () => {
    const w = window as TrackWindow;
    if (origen === "whatsapp") {
      w.fbq?.("track", "Contact", { content_name: "links" });
      w.gtag?.("event", "generate_lead", { method: "whatsapp", origen: "links" });
    } else {
      w.gtag?.("event", "click_links", { destino: origen });
    }
  };

  return (
    <a
      href={href}
      target={externo ? "_blank" : undefined}
      rel={externo ? "noopener noreferrer" : undefined}
      onClick={track}
      className={`group flex items-center gap-4 rounded-2xl p-3 pr-4 border transition-all hover:-translate-y-0.5 ${
        destacado
          ? "bg-emerald-400 border-emerald-300 text-black shadow-[0_14px_40px_-12px_rgba(52,211,153,0.8)]"
          : "bg-white/[0.04] border-white/10 hover:border-emerald-400/50 hover:bg-white/[0.07]"
      }`}
    >
      <div
        className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden grid place-items-center ${
          destacado ? "bg-black/10" : "bg-emerald-400/10 border border-emerald-400/25 text-emerald-300"
        }`}
      >
        {imagen ? <img src={imagen} alt="" className="w-full h-full object-cover object-top" /> : icono}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[15px] leading-tight">{titulo}</div>
        <div className={`text-xs mt-1 truncate ${destacado ? "text-black/70" : "text-neutral-400"}`}>{texto}</div>
      </div>
      <ChevronRight className={`w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5 ${destacado ? "" : "text-neutral-500"}`} />
    </a>
  );
}
