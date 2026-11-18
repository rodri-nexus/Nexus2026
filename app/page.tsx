import type { Metadata } from "next";
import Inicio from "@/app/components/inicio/Inicio";

export const metadata: Metadata = {
  title: "Nevux | Rediseño de Tiendanube y sitios web a medida",
  description: "Rediseño tiendas de Tiendanube para que vendan más y creo sitios web a medida para marcas, emprendedores y comercios. Sin costo de creación y con mantenimiento incluido.",
  alternates: { canonical: "https://nevux.ar" },
};

export default function Page() {
  return <Inicio />;
}
