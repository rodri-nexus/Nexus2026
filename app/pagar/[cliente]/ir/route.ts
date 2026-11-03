import { CLIENTES } from "@/lib/clientes";
import { linkPlanPropio } from "@/lib/planesMp";
import { planDe } from "@/lib/planes";

// Botón "Suscribirme": busca o crea el plan propio del cliente en Mercado Pago y redirige al checkout.
// Si Mercado Pago falla, manda a WhatsApp para pasarle el link a mano.
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { cliente: string } }) {
  const c = CLIENTES[params.cliente];
  if (!c) return Response.redirect("https://nevux.ar/suscribirme", 302);
  try {
    const link = c.cobro.tipo === "mercadopago" && c.cobro.planPropio ? await linkPlanPropio(params.cliente, c) : planDe(undefined, c.plan).link;
    return Response.redirect(link, 302);
  } catch {
    const t = encodeURIComponent(`Hola! Quiero suscribirme a Nevux para ${c.nombre.replace(/\s*\(.*\)\s*$/, "")} y no me abrió el link de pago.`);
    return Response.redirect(`https://wa.me/5493434163999?text=${t}`, 302);
  }
}
