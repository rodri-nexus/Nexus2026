// Contenido con la tienda real de un cliente (pedido de Rodrigo, 02/11): nada de simulaciones.
// Capturas de hogardigital.com.ar en celular (390 px, x3) con su configuración Premium de lib/clientes.ts,
// sin la Semana Cyber (termina el 4/11) y sin los avisos de compra con nombres de ejemplo. Están en capturas/hd/.
// Uso: node scripts/instagram/generar.js real-1
const HASHTAGS = "#tiendanube #emprendedoresargentinos #tiendaonline #ecommerceargentina #ventasonline #emprender";
const C = "capturas/hd/";

module.exports = [
  {
    carpeta: "07-hogar-digital-real",
    nombre: "Así quedó la tienda de Hogar Digital",
    placas: [
      { tipo: "foto", clase: "despues", etiqueta: "CASO REAL", titulo: "Así quedó la tienda de <span class=\"verde\">Hogar Digital</span>", img: C + "home-1.jpg" },
      { tipo: "foto", clase: "despues", etiqueta: "1 · BENEFICIOS", titulo: "Envío, garantía y WhatsApp, lo primero que se ve", img: C + "home-2.jpg" },
      { tipo: "foto", clase: "despues", etiqueta: "2 · DESTACADOS", titulo: "Precio y descuento a la vista, sin entrar", img: C + "home-3.jpg" },
      { tipo: "foto", clase: "despues", etiqueta: "3 · COMUNIDAD", titulo: "Sus propios videos, con la cara de Marcelo", img: C + "home-4.jpg" },
      { tipo: "foto", clase: "despues", etiqueta: "4 · NÚMEROS", titulo: "Su trayectoria en números reales", img: C + "home-6.jpg" },
      { tipo: "foto", clase: "despues", etiqueta: "5 · EL LOCAL", titulo: "Dirección, horario y cómo llegar", img: C + "home-7.jpg" },
      { tipo: "foto", clase: "despues", etiqueta: "6 · LA FICHA", titulo: "Precio claro y su promo por cantidad", img: C + "ficha-2.jpg" },
      { tipo: "foto", clase: "despues", etiqueta: "7 · LAS DUDAS", titulo: "Las preguntas, respondidas antes de comprar", img: C + "ficha-3.jpg" },
      {
        tipo: "cta",
        ultima: true,
        eyebrow: "Sin apps · Sin cambiar de plantilla",
        titulo: '¿Querés tu tienda <span class="verde">así</span>?',
        texto: 'Misma Tiendanube, mismos productos, con sus datos reales.<br><br>Comentá <span class="palabra">FICHA</span> y te mostramos cómo quedaría la tuya.',
      },
    ],
    caption: `Así quedó la tienda de Hogar Digital (@hogardigitaltiendaonline) con Nevux Premium 👇

Es su Tiendanube de siempre: misma plataforma, mismos productos, mismos precios. Lo que cambia es lo que ve quien entra:

🚚 Envío a todo el país, 30 días de garantía y atención por WhatsApp, apenas abre la tienda.
🏷️ Destacados con el precio y el descuento a la vista.
🎥 Comunidad con sus propios videos.
📊 Su trayectoria en números: más de 35 años, más de 300 ventas en 2026 y más de 800 calificaciones en Mercado Libre.
📍 Su local en Campana, con horario y "Cómo llegar".
🛒 Una ficha con el precio claro, su promo por cantidad y las preguntas respondidas antes de que tengan que escribir.

Todo con sus datos reales: si algo no lo ofrece, no se muestra.

✅ Sin apps
✅ Sin cambiar de plantilla
✅ Se instala con una línea de código

👉 Comentá FICHA y te mostramos cómo quedaría la tuya.

${HASHTAGS}`,
  },
];
