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
  {
    carpeta: "09-carrito-hogar-digital",
    nombre: "El carrito también vende",
    placas: [
      f("CASO REAL · EN VIVO", 'El carrito de Hogar Digital <span class="verde">también vende</span>', "carrito-1.jpg"),
      {
        tipo: "punto", num: "POR QUÉ IMPORTA",
        titulo: 'El carrito es <span class="verde">la última duda</span>',
        texto: "Ahí la persona se pregunta: ¿cuándo me llega?, ¿cuánto sale el envío?, ¿y si algo sale mal?<br><br>Si el carrito no responde, <b>cierra la pestaña “para pensarlo”</b>.",
      },
      f("1 · CUÁNDO SALE Y EL ENVÍO", "Hora de corte y envío gratis, confirmados", "carrito-1.jpg"),
      f("2 · COMPRÁ TRANQUILO", "Garantía, cambios y atención, pasando solas", "carrito-2.jpg"),
      f("3 · CÓMO PAGAR", "El total y el ahorro con transferencia, antes de pagar", "carrito-4.jpg"),
      {
        tipo: "cta", ultima: true, eyebrow: "Sin apps · Sin cambiar de plantilla",
        titulo: '¿Tu carrito <span class="verde">responde todo esto</span>?',
        texto: 'Comentá <span class="palabra">FICHA</span> y te digo qué cambiaría en tu tienda.',
      },
    ],
    caption: `El carrito también vende 🛒 Así es hoy el de Hogar Digital (@hogardigitaltiendaonline), en vivo en su Tiendanube 👇

El carrito es la última duda antes de pagar. Ahí la persona se pregunta: ¿cuándo me llega?, ¿cuánto sale el envío?, ¿y si algo sale mal?

En el de Hogar Digital, cada respuesta está a la vista:

⏰ Cuándo sale el pedido, con la hora de corte y cuenta regresiva.
🚚 La barra de envío gratis: cuánto le falta o, si ya llegó, que lo tiene confirmado.
🤝 Garantía, cambios y atención por WhatsApp, pasando solas.
💳 El total y cómo pagar, con el ahorro por transferencia antes de pagar.

Todo con los datos reales de su tienda.
✅ Sin apps
✅ Sin cambiar de plantilla

👉 ¿Tu carrito responde todo esto? Comentá FICHA y te digo qué cambiaría en tu tienda.

${HASHTAGS}`,
  },
  {
    carpeta: "10-tres-cosas-ficha",
    nombre: "3 cosas que tu ficha tiene que mostrar",
    placas: [
      { tipo: "portada", eyebrow: "Guardalo para después", titulo: '3 cosas que tu ficha <span class="verde">tiene que mostrar</span>', sub: "Con un ejemplo real: la ficha del smartwatch de Hogar Digital, en vivo." },
      f("1 · CUÁNTO PAGA DE VERDAD", "El precio final y el ahorro, sin hacer cuentas", "sw-2.jpg"),
      f("2 · CUÁNDO LE LLEGA", "La hora de corte y cuánto falta para el envío gratis", "sw-3.jpg"),
      f("3 · QUÉ PASA SI SALE MAL", "Cambios, garantía y a quién escribirle", "sw-4.jpg"),
      {
        tipo: "punto", num: "LA REGLA",
        titulo: 'Si tiene que preguntarlo, <span class="verde">ya dudó</span>',
        texto: "Cuánto pago, cuándo llega y qué pasa si sale mal: <b>las 3 dudas de toda compra online</b>.<br><br>La ficha que las responde antes de que aparezcan es la que vende.",
      },
      {
        tipo: "cta", ultima: true, eyebrow: "Análisis gratis",
        titulo: '¿Cuántas de las 3 <span class="verde">tiene la tuya</span>?',
        texto: 'Comentá <span class="palabra">FICHA</span> y te digo cuáles le faltan.',
      },
    ],
    caption: `📌 3 cosas que tu ficha de producto tiene que mostrar (guardalo para después)

Las 3 dudas de toda compra online, con un ejemplo real: la ficha del smartwatch de Hogar Digital (@hogardigitaltiendaonline), en vivo 👇

1️⃣ Cuánto paga de verdad
No alcanza con el precio: el precio final con transferencia y cuánto ahorra, sin que tenga que hacer cuentas.

2️⃣ Cuándo le llega
"Envíos a todo el país" no responde nada. La hora de corte ("sale hoy si comprás antes de las 18 h") y cuánto le falta para el envío gratis, sí.

3️⃣ Qué pasa si sale mal
Cambios, garantía y a quién escribirle, a la vista. Así comprar no da miedo.

Si tiene que preguntarlo, ya dudó. Y el que duda se va a "pensarlo".

👉 ¿Cuántas de las 3 tiene la tuya? Comentá FICHA y te digo cuáles le faltan.

${HASHTAGS}`,
  },
];
