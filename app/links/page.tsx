import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import LinkCard from "./LinkCard";

// Página de links para la bio de Instagram (@nevux.app): nevux.ar/links

const WHATSAPP = `https://wa.me/5493434163999?text=${encodeURIComponent("Hola! Vengo de Instagram y quiero el análisis gratis de mi tienda: ")}`;

export const metadata: Metadata = {
  title: "Nevux · Links",
  description: "Análisis gratis de tu tienda, el antes y después, la calculadora y el precio de Nevux.",
};

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-[#07080a] text-white relative overflow-hidden">
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[700px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <main className="relative max-w-md mx-auto px-4 pt-12 pb-16">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full p-1 bg-gradient-to-b from-emerald-300 to-emerald-600 shadow-[0_0_60px_-10px_rgba(52,211,153,0.7)]">
              <div className="rounded-full bg-black p-1 flex">
                <NevuxLogo size="large" showText={false} />
              </div>
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Nevux</h1>
          <p className="text-sm text-neutral-400 mt-1">Fichas de producto que venden, para Tiendanube</p>
          <p className="text-[15px] text-neutral-200 mt-4 leading-relaxed">
            Tu tienda ya tiene visitas.
            <br />
            <b className="text-emerald-300">Hacemos que compren.</b>
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <LinkCard
            href={WHATSAPP}
            origen="whatsapp"
            destacado
            imagen="/links/whatsapp.jpg"
            titulo="Análisis gratis de tu tienda"
            texto="Por WhatsApp · Sin compromiso"
          />
          <LinkCard
            href="/#solucion"
            origen="antes-despues"
            imagen="/links/antes-despues.jpg"
            titulo="Mirá el antes y después"
            texto="Caso real: Hogar Digital"
          />
          <LinkCard
            href="/disenos"
            origen="disenos"
            imagen="/links/disenos.jpg"
            titulo="Así puede quedar tu tienda"
            texto="Diseños con efectos para Tiendanube"
          />
          <LinkCard
            href="/#premium"
            origen="premium"
            imagen="/links/premium.jpg"
            titulo="Plan Premium"
            texto="Tu tienda como las marcas grandes"
          />
          <LinkCard
            href="/#cuenta"
            origen="calculadora"
            imagen="/links/calculadora.jpg"
            titulo="Hacé la cuenta"
            texto="Calculadora con tus números"
          />
          <LinkCard
            href="/#precio"
            origen="precio"
            imagen="/links/precio.jpg"
            titulo="Precio y garantía"
            texto="Básico $39.900 · Premium $69.900"
          />
          <LinkCard
            href="/"
            origen="web"
            imagen="/links/web.jpg"
            titulo="Conocé Nevux"
            texto="nevux.ar"
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-xs text-neutral-500">
          <a href="https://instagram.com/nevux.app" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <Instagram className="w-4 h-4" /> @nevux.app
          </a>
          <span>Sin apps · Sin cambiar de plantilla</span>
        </div>
      </main>
    </div>
  );
}
