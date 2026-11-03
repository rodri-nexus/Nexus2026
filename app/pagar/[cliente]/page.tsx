import type { Metadata } from "next";
import SuscribirmePage, { generateMetadata as metaSuscribirme } from "../../suscribirme/page";

// Link corto para mandarle al cliente: nevux.ar/pagar/<id> (misma página que /suscribirme?c=<id>)
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { cliente: string } }): Metadata {
  return metaSuscribirme({ searchParams: { c: params.cliente } });
}

export default function PagarPage({ params }: { params: { cliente: string } }) {
  return <SuscribirmePage searchParams={{ c: params.cliente }} />;
}
