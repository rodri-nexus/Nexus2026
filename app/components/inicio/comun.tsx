"use client";

// Piezas compartidas por el inicio (nevux.ar) y la página de sitios web (nevux.ar/sitios-web).
// La página de Tiendanube (nevux.ar/tiendanube) sigue usando su propia cabecera y su pie.

import { ArrowRight, MessageCircle } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import { LazyVideo } from "@/app/components/landing/fx";
import { trackWhatsApp } from "@/app/components/landing/cta";

const WA = "5493434163999";
export const waLink = (texto: string) => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;
export const WA_GENERAL = waLink("Hola Rodrigo! Vi nevux.ar y quiero consultar por: ");
export const WA_WEB = waLink("Hola Rodrigo! Quiero una página web para mi marca: ");
export const WA_TIENDA = waLink("Hola! Quiero el análisis gratis de mi tienda de Tiendanube: ");

export const PRECIO_WEB = 47900; // "desde": el plan Básico de sitios web

// Planes de sitios web (se cobran por WhatsApp/transferencia, no tienen link de Mercado Pago)
export const PLANES_WEB = {
  basico: {
    nombre: "Sitio web Básico",
    precio: 47900,
    bajada: "Tu página profesional en una sola pantalla larga: todo lo que tu cliente necesita ver para escribirte.",
    incluye: [
      "Diseño a medida con tu logo y tus colores",
      "Tus servicios o productos con fotos y precios",
      "Galería de trabajos y opiniones de clientes",
      "Ubicación con mapa y horarios",
      "Botón directo a tu WhatsApp",
      "Link propio para tu bio de Instagram",
      "Vista prolija al compartir por WhatsApp",
      "Mantenimiento: hasta 2 cambios por mes",
    ],
  },
  premium: {
    nombre: "Sitio web Premium",
    precio: 55000,
    bajada: "La experiencia completa: video, tu equipo uno por uno y pedidos o turnos que te llegan armados a tu WhatsApp.",
    incluye: [
      "Portada con video de tu marca",
      "Ficha de cada persona del equipo, con sus videos y horarios",
      "Pedidos o turnos que te llegan armados a tu WhatsApp",
      "Secciones de novedades, promos y sorteos",
      "Efectos y animaciones premium",
      "Preparada para Google y ayuda con tu perfil de Google Maps",
      "Cambios cuando quieras, sin límite",
      "Velocidad, actualizaciones y copia de seguridad",
    ],
  },
} as const;
export const PRECIO_BASICO = 47900;

export function BotonWA({ href, origen, children, className = "", variante = "verde" }: { href: string; origen: string; children: React.ReactNode; className?: string; variante?: "verde" | "violeta" | "linea" }) {
  const estilos = {
    verde: "bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_12px_40px_-10px_rgba(52,211,153,0.7)]",
    violeta: "bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_12px_40px_-10px_rgba(52,211,153,0.7)]",
    linea: "border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] text-white",
  }[variante];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(origen)}
      className={`nvx-press group inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-[15px] font-extrabold whitespace-nowrap ${variante !== "linea" ? "nvx-shine" : ""} ${estilos} ${className}`}
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export function Cabecera({ activa }: { activa?: "inicio" | "web" }) {
  const links: [string, string, string][] = [
    ["/tiendanube", "Tiendanube", ""],
    ["/sitios-web", "Sitios web", "web"],
    ["/#casos", "Casos", ""],
    ["/#como", "Cómo trabajo", ""],
  ];
  return (
    <header className="nvx-headerline sticky top-0 z-50 bg-[#07080a]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="/" aria-label="Nevux, ir al inicio">
          <NevuxLogo size="medium" textColor="#ffffff" />
        </a>
        <nav className="hidden items-center gap-7 text-sm text-neutral-400 md:flex">
          {links.map(([h, t, k]) => (
            <a key={h} href={h} className={`transition-colors hover:text-white ${activa === k && k ? "text-white" : ""}`}>
              {t}
            </a>
          ))}
        </nav>
        <a
          href={WA_GENERAL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("header-inicio")}
          className="nvx-press inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-3.5 py-2 text-[13px] font-extrabold text-black hover:bg-emerald-300 sm:text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          Hablemos
        </a>
      </div>
    </header>
  );
}

// Celular con un video real que baja solo
export function Celular({ src, poster, titulo, className = "" }: { src: string; poster: string; titulo: string; className?: string }) {
  return (
    <div className={`relative mx-auto w-full max-w-[280px] rounded-[2.4rem] bg-[#0c0d10] p-[8px] ring-1 ring-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,.95)] ${className}`}>
      <div className="relative overflow-hidden rounded-[2rem] bg-black" style={{ aspectRatio: "390 / 844" }}>
        <LazyVideo src={src} poster={poster} label={titulo} className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute left-1/2 top-[8px] h-[18px] w-[32%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

export function PieGeneral() {
  return (
    <footer className="border-t border-white/5 text-sm text-neutral-500">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div>
          <NevuxLogo size="small" textColor="#ffffff" />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed">
            Diseño que vende: rediseño de tiendas Tiendanube y páginas web a medida para marcas, emprendedores y comercios.
          </p>
          <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp("footer-inicio")} className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-400 hover:text-emerald-300">
            <MessageCircle className="h-4 w-4" /> Escribime por WhatsApp
          </a>
        </div>
        <nav aria-label="Servicios">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">Servicios</div>
          <ul className="space-y-2">
            <li><a href="/tiendanube" className="hover:text-white">Rediseño de Tiendanube</a></li>
            <li><a href="/sitios-web" className="hover:text-white">Sitios web</a></li>
            <li><a href="/disenos" className="hover:text-white">Todos los diseños</a></li>
          </ul>
        </nav>
        <nav aria-label="Legales">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">Tu suscripción</div>
          <ul className="space-y-2">
            <li><a href="/arrepentimiento" className="hover:text-white">Botón de arrepentimiento</a></li>
            <li><a href="/arrepentimiento?tipo=baja" className="hover:text-white">Botón de baja</a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs sm:px-6 sm:text-left">© 2026 Nevux · Diseño que vende</div>
      </div>
    </footer>
  );
}

export function Titulo({ eyebrow, children, bajada, color = "text-emerald-300" }: { eyebrow: string; children: React.ReactNode; bajada?: React.ReactNode; color?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <span className={`text-xs font-bold uppercase tracking-[0.18em] ${color}`}>{eyebrow}</span>
      <h2 className="mt-4 text-[2rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-5xl">{children}</h2>
      {bajada && <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-400 sm:text-lg">{bajada}</p>}
    </div>
  );
}
