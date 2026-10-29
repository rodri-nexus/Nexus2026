import { CLIENTES } from "@/lib/clientes";
import { estadoCobro } from "@/lib/cobros";

// Línea de instalación de cada tienda: https://nevux.ar/c/<cliente>.js
// Se arma en el momento según el estado de cobro del cliente. Si está al día carga el motor con su
// configuración; si no, devuelve un script vacío y Nevux no aparece en la tienda.
export const dynamic = "force-dynamic";

const cabeceras = {
  "Content-Type": "application/javascript; charset=utf-8",
  // 5 minutos en el navegador y en Vercel: no se consulta Mercado Pago en cada visita
  "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(_req: Request, { params }: { params: { archivo: string } }) {
  const id = params.archivo.replace(/\.js$/, "");
  const cliente = CLIENTES[id];
  if (!cliente) {
    return new Response("/* Nevux: tienda no encontrada */\n", { status: 404, headers: cabeceras });
  }

  const estado = await estadoCobro(cliente);
  if (!estado.prendida) {
    return new Response(`/* Nevux · ${cliente.nombre}: apagado (${estado.motivo}) */\n`, { headers: cabeceras });
  }

  const js = `/* Nevux · ${cliente.nombre} */
(function () {
  var dominios = ${JSON.stringify(cliente.dominios)};
  var host = location.hostname.replace(/^www\\./, '');
  var permitido = dominios.some(function (d) { return host === d || host.slice(-(d.length + 1)) === '.' + d; });
  if (!permitido) return;
  window.NEVUX_CFG = ${JSON.stringify(cliente.config)};
  var s = document.createElement('script');
  s.src = 'https://nevux.ar/nevux.js';
  s.async = true;
  document.head.appendChild(s);
})();
`;
  return new Response(js, { headers: cabeceras });
}
