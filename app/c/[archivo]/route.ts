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

  // Anti-flash v2: pre-oculta el contenido de Tiendanube hasta que Nevux esté listo.
  // Estrategia: ocultar body → cargar nevux.js → observar cuando el DOM cambie → mostrar.
  const js = `/* Nevux · ${cliente.nombre} */
(function () {
  var dominios = ${JSON.stringify(cliente.dominios)};
  var host = location.hostname.replace(/^www\\./, '');
  var permitido = dominios.some(function (d) { return host === d || host.slice(-(d.length + 1)) === '.' + d; });
  if (!permitido) return;
  
  /* Anti-flash: oculta el contenido original hasta que Nevux transforme el DOM */
  var style = document.createElement('style');
  style.id = 'nvx-preload';
  style.textContent = 'body{opacity:0 !important;transition:opacity 0.15s ease-out;}body.nvx-ready{opacity:1 !important;}';
  (document.head || document.documentElement).appendChild(style);
  
  /* Marca como listo cuando Nevux haya transformado el DOM */
  var marcarListo = function() {
    document.body.classList.add('nvx-ready');
    setTimeout(function() {
      var preloadStyle = document.getElementById('nvx-preload');
      if (preloadStyle) preloadStyle.remove();
    }, 200);
  };
  
  /* Timeout de seguridad: si Nevux no transforma en 2.5s, mostrar la tienda original */
  var timeout = setTimeout(marcarListo, 2500);
  
  /* Observer: detecta cuando Nevux agregue elementos al DOM */
  var observerIniciado = false;
  var iniciarObserver = function() {
    if (observerIniciado || !window.MutationObserver) return;
    observerIniciado = true;
    
    var obs = new MutationObserver(function(mutations) {
      /* Si se agregaron nodos con clase nvx-, Nevux está activo */
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType === 1 && (node.className || '').indexOf('nvx-') >= 0) {
            clearTimeout(timeout);
            marcarListo();
            obs.disconnect();
            return;
          }
        }
      }
    });
    
    obs.observe(document.documentElement, { childList: true, subtree: true });
  };
  
  /* Inicia el observer cuando el DOM esté listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarObserver);
  } else {
    iniciarObserver();
  }
  
  window.NEVUX_CFG = ${JSON.stringify(cliente.config)};
  
  var s = document.createElement('script');
  s.src = 'https://nevux.ar/nevux.js';
  s.async = true;
  (document.head || document.documentElement).appendChild(s);
})();
`;
  return new Response(js, { headers: cabeceras });
}
