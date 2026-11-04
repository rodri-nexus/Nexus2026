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

  const estado = await estadoCobro(cliente, Date.now(), id);
  if (!estado.prendida) {
    return new Response(`/* Nevux · ${cliente.nombre}: apagado (${estado.motivo}) */\n`, { headers: cabeceras });
  }

  // Anti-flash: pre-oculta el contenido de Tiendanube hasta que Nevux esté listo.
  // Evita que el cliente vea la versión vieja durante milisegundos antes de la transformación.
  const js = `/* Nevux · ${cliente.nombre} */
(function () {
  var dominios = ${JSON.stringify(cliente.dominios)};
  var host = location.hostname.replace(/^www\\./, '');
  var permitido = dominios.some(function (d) { return host === d || host.slice(-(d.length + 1)) === '.' + d; });
  if (!permitido) return;
  
  /* Anti-flash: oculta el contenido original hasta que Nevux esté listo */
  var style = document.createElement('style');
  style.id = 'nvx-preload';
  style.textContent = 'body{visibility:hidden !important;}body.nvx-ready{visibility:visible !important;}';
  document.head.appendChild(style);
  
  /* Timeout de seguridad: si Nevux no carga en 3s, mostrar la tienda original */
  var timeout = setTimeout(function() {
    document.body.classList.add('nvx-ready');
    var preloadStyle = document.getElementById('nvx-preload');
    if (preloadStyle) preloadStyle.remove();
  }, 3000);
  
  window.NEVUX_CFG = ${JSON.stringify(cliente.config)};
  window.NEVUX_PRELOAD_TIMEOUT = timeout;
  
  var s = document.createElement('script');
  s.src = 'https://nevux.ar/nevux.js';
  s.async = true;
  document.head.appendChild(s);
})();
`;
  return new Response(js, { headers: cabeceras });
}
