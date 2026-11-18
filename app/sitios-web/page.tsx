import type { Metadata } from "next";
import SitiosWeb from "@/app/components/inicio/SitiosWeb";

export const metadata: Metadata = {
  title: "Nevux | Sitios web a medida para tu marca",
  description: "Tu página propia para la bio de Instagram: servicios, equipo, videos y pedidos o turnos directo a tu WhatsApp. desde $47.900 por mes, sin costo de creación y con mantenimiento incluido.",
  alternates: { canonical: "https://nevux.ar/sitios-web" },
};

export default function Page() {
  return <SitiosWeb />;
}
