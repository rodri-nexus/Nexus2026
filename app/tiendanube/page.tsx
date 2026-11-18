import type { Metadata } from "next";
import Landing from "@/app/components/landing/Landing";

export const metadata: Metadata = {
  title: "Nevux | Rediseño de tiendas Tiendanube",
  description: "Convertimos las fichas y la home de tu Tiendanube en páginas que venden. Planes Básico y Premium, sin apps y sin cambiar de plantilla. Análisis gratis por WhatsApp.",
  alternates: { canonical: "https://nevux.ar/tiendanube" },
};

export default function Page() {
  return <Landing />;
}
