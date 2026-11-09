// Semana del 9 al 15/11 de @nevux.app: la tienda de Hogar Digital EN VIVO (Nevux prendido desde el pago del Premium).
// Capturas de hogardigital.com.ar en celular (390 px, x3), sin cargar nada en el navegador: tal cual la ve un cliente.
// Uso: node scripts/instagram/generar.js real-2
const HASHTAGS = "#tiendanube #emprendedoresargentinos #tiendaonline #ecommerceargentina #ventasonline #emprender";
const V = "capturas/hd-vivo/";
const f = (etiqueta, titulo, img) => ({ tipo: "foto", clase: "despues", etiqueta, titulo, img: V + img });

module.exports = [
  {
    carpeta: "08-ficha-hogar-digital",
    nombre: "La ficha de Hogar Digital, parte por parte",
    placas: [
      f("CASO REAL · EN VIVO", 'La ficha de <span class="verde">Hogar Digital</span>, parte por parte', "ficha-1.jpg"),
      f("1 · EL PRECIO", "Cuánto paga, cuánto ahorra y en cuántas cuotas", "ficha-2.jpg"),
      f("2 · LLEVÁ MÁS", "Su promo por cantidad, a la vista", "ficha-3.jpg"),
      f("3 · CUÁNDO LLEGA", "Hora de corte, envío y su local", "ficha-4.jpg"),
      f("4 · CONFIANZA", "Cambios, atención y garantía, con WhatsApp", "ficha-5.jpg"),
      f("5 · LAS DUDAS", "Las preguntas, respondidas antes de escribir", "ficha-6.jpg"),
      {
        tipo: "cta",
        ultima: true,
        eyebrow: "Sin apps · Sin cambiar de plantilla",
        titulo: '¿Tu ficha responde <span class="verde">todo esto</span>?',
        texto: 'Si no, la duda se lleva la venta.<br><br>Comentá <span class="palabra">FICHA</span> y te digo qué le falta a la tuya.',
      },
    ],
    caption: `Así es hoy la ficha de producto de Hogar Digital (@hogardigitaltiendaonline), en vivo en su Tiendanube 👇

Cada parte responde una pregunta que se hace quien está por comprar:

💲 ¿Cuánto pago? → Precio de lista, % OFF, el precio con transferencia y cuánto ahorra, y las cuotas.
🛒 ¿Me conviene llevar más? → Su promo por cantidad, a la vista.
📦 ¿Cuándo me llega? → La hora de corte con cuenta regresiva, el envío y su local en Campana.
🤝 ¿Y si algo sale mal? → Cambios, atención por WhatsApp y 30 días de garantía.
❓ ¿Y si me queda una duda? → Las preguntas frecuentes, respondidas antes de que tenga que escribir.

Todo con los datos reales de su tienda: si algo no lo ofrece, no se muestra.

✅ Sin apps
✅ Sin cambiar de plantilla
✅ Se instala con una línea de código

👉 Comentá FICHA y te digo qué le falta a la tuya.

${HASHTAGS}`,
  },
];
