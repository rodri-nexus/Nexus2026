import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

// Página a la que vuelve el cliente después de suscribirse en Mercado Pago
// (se configura como "URL de retorno" del plan de suscripción en Mercado Pago).

const WHATSAPP = "5493434163999";

export const metadata: Metadata = {
  title: "¡Gracias! · Nevux",
  robots: { index: false },
};

export default function GraciasPage() {
  const whatsapp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "Hola! Ya me suscribí a Nevux. Mi tienda es: "
  )}`;

  return (
    <div className="min-h-screen bg-[#07080a] text-white font-sans flex flex-col">
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <a href="/" aria-label="Inicio">
            <NevuxLogo size="medium" textColor="#ffffff" />
          </a>
        </div>
      </header>
      <main className="flex-1 max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 grid place-items-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">¡Gracias por suscribirte!</h1>
        <p className="text-neutral-400 leading-relaxed mb-10">
          Ya está todo listo para arrancar. Escribinos por WhatsApp con el link de tu tienda y dejamos Nevux funcionando con tus
          datos. Mercado Pago te va a mandar el comprobante por email.
        </p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base px-7 py-4 rounded-2xl transition-all shadow-[0_10px_40px_-8px_rgba(16,185,129,0.6)]"
        >
          <MessageCircle className="w-5 h-5" />
          Avisar por WhatsApp
        </a>
      </main>
    </div>
  );
}
