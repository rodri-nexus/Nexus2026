// Destacada "Precio" de @nevux.app, rehecha el 23/11 (pedido de Rodrigo) con los dos servicios y los precios de hoy:
// Tiendanube (lib/planes.ts): Básico $49.900 y Premium $69.900 por mes.
// Sitios web (PLANES_WEB en app/components/inicio/comun.tsx): Básico $38.900 y Premium $47.900 por mes, sin costo de creación.
// Si cambian los precios, cambiarlos acá y volver a correr: node scripts/instagram/generar.js destacada-precio
module.exports = {
  historias: [
    {
      archivo: "d-precio2-1", tipo: "portada", eyebrow: "Precios de Nevux",
      titulo: 'Dos servicios, <span class="verde">un precio por mes</span>',
      sub: "Tu Tiendanube o tu sitio web. Sin permanencia: cancelás cuando quieras. Tocá para ver →",
    },
    {
      archivo: "d-precio2-2", tipo: "punto", num: "TIENDANUBE · BÁSICO",
      titulo: '$49.900 <span class="verde">por mes</span>',
      lista: ["Ficha Pro con tus colores", "Transferencia y cuotas reales de tu tienda", "Packs Llevá 2 y Llevá 3", "Home con secciones de confianza", "Cambios por WhatsApp sin costo extra"],
      pie: "Pago con Mercado Pago",
    },
    {
      archivo: "d-precio2-3", tipo: "punto", num: "TIENDANUBE · PREMIUM",
      titulo: '$69.900 <span class="verde">por mes</span>',
      lista: ["Todo lo del plan Básico", "Home de marca grande, con video", "Categorías que rotan y comunidad", "Números, reseñas y locales con mapa", "Carrito con barra de envío gratis"],
      pie: "Pago con Mercado Pago",
    },
    {
      archivo: "d-precio2-4", tipo: "punto", num: "SITIO WEB · BÁSICO",
      titulo: '$38.900 <span class="verde">por mes</span>',
      lista: ["Diseño a medida con tu logo y tus colores", "Servicios o productos con fotos y precios", "Ubicación, horarios y botón a WhatsApp", "Link propio para tu bio", "Hasta 2 cambios por mes"],
      pie: "Sin costo de creación",
    },
    {
      archivo: "d-precio2-5", tipo: "punto", num: "SITIO WEB · PREMIUM",
      titulo: '$47.900 <span class="verde">por mes</span>',
      lista: ["Portada con video de tu marca", "Tu equipo, uno por uno", "Pedidos o turnos armados a tu WhatsApp", "Preparada para Google y Maps", "Cambios sin límite"],
      pie: "Sin costo de creación",
    },
    {
      archivo: "d-precio2-6", tipo: "punto", num: "SIN RIESGO",
      titulo: 'Primero lo ves, <span class="verde">después decidís</span>',
      texto: "<b>Tiendanube:</b> lo probamos sobre una ficha tuya y tenés 7 días de garantía.<br><br><b>Sitio web:</b> sin costo de creación y primero ves la muestra.<br><br>En los dos, cancelás cuando quieras.",
      pie: "nevux.ar",
    },
  ],
};
