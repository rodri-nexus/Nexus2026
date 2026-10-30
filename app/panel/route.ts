import { CLIENTES } from "@/lib/clientes";
import { estadoCobro, estadoConexion } from "@/lib/cobros";

// Panel privado: estado de cada cliente (prendida o apagada y por qué).
// Se entra con https://nevux.ar/panel?clave=<PANEL_CLAVE>
export const dynamic = "force-dynamic";

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const fecha = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

export async function GET(req: Request) {
  const clave = new URL(req.url).searchParams.get("clave");
  if (!process.env.PANEL_CLAVE || clave !== process.env.PANEL_CLAVE) {
    return new Response("No autorizado", { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const conexion = await estadoConexion();
  const filas = await Promise.all(
    Object.entries(CLIENTES).map(async ([id, c]) => {
      const e = await estadoCobro(c);
      return `<tr>
        <td><b>${esc(c.nombre)}</b><small>${esc(c.dominios.join(", "))} · c/${esc(id)}.js</small></td>
        <td><span class="${e.prendida ? "on" : "off"}">${e.prendida ? "Prendida" : "Apagada"}</span></td>
        <td>${esc(c.cobro.tipo === "mercadopago" ? "Mercado Pago" : "Manual")}</td>
        <td>${esc(e.motivo)}${e.suscripcion ? `<small>Último cobro: ${fecha(e.suscripcion.ultimoCobro)} · Próximo: ${fecha(e.suscripcion.proximoCobro)}</small>` : ""}</td>
      </tr>`;
    })
  );

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Panel Nevux</title><meta name="robots" content="noindex">
<style>
  body{margin:0;background:#07080a;color:#f4f4f5;font:15px/1.45 system-ui,-apple-system,sans-serif;padding:20px 14px}
  h1{font-size:22px;margin:0 0 4px}p{color:#a1a1aa;margin:0 0 18px;font-size:13px}
  table{width:100%;border-collapse:collapse}td{border-top:1px solid #27272a;padding:12px 8px;vertical-align:top}
  small{display:block;color:#a1a1aa;font-size:12px;margin-top:3px}
  .on,.off{display:inline-block;padding:3px 9px;border-radius:99px;font-size:12px;font-weight:800}
  .on{background:#10b98122;color:#34d399}.off{background:#ef444422;color:#f87171}
  .mp{display:block;border-radius:12px;padding:10px 12px;margin:0 0 18px;font-size:13px}
  @media(max-width:560px){tr{display:block;border-top:1px solid #27272a;padding:8px 0}td{display:block;border:0;padding:4px 0}}
</style></head><body>
<h1>Clientes de Nevux</h1>
<p>Estado en este momento. Las tiendas tardan hasta 5 minutos en reflejar un cambio.</p>
<div class="mp ${conexion.ok ? "on" : "off"}">${esc(conexion.texto)}</div>
<table>${filas.join("")}</table>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
