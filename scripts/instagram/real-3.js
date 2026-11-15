// Semana del 16 al 22/11 de @nevux.app: la tienda de Hogar Digital en vivo (capturas sin cargar nada en el navegador).
// Para que el despacho muestre lo que ve un cliente el día del post, el reloj del navegador se fija en ese día a las 15 h.
// Uso: node scripts/instagram/generar.js real-3
const HASHTAGS = "#tiendanube #emprendedoresargentinos #tiendaonline #ecommerceargentina #ventasonline #emprender";
const V = "capturas/hd-vivo/";
const f = (etiqueta, titulo, img) => ({ tipo: "foto", clase: "despues", etiqueta, titulo, img: V + img });

module.exports = [
  {
    carpeta: "12-producto-nuevo",
    nombre: "Cargó un producto nuevo y la ficha salió completa",
    placas: [
      f("CASO REAL · EN VIVO", 'Marcelo cargó un producto nuevo. <span class="verde">La ficha salió completa.</span>', "combo/1.jpg"),
      {
        tipo: "punto", num: "LO QUE HIZO MARCELO",
        titulo: 'Cargó su combo en Tiendanube, <span class="verde">como siempre</span>',
        texto: "Fotos, precio, precio promocional y descripción. Nada más.<br><br>Nosotros <b>no tuvimos que tocar nada</b>.",
      },
      f("1 · EL PRECIO", "Precio con transferencia, ahorro y cuotas, solos", "combo/2.jpg"),
      f("2 · CUÁNDO SALE", "Hora de corte, envío y su local", "combo/3.jpg"),
      f("3 · LAS DUDAS", "Preguntas frecuentes y botón de compra fijo", "combo/5.jpg"),
      {
        tipo: "punto", num: "POR QUÉ IMPORTA",
        titulo: 'Cada producto nuevo <span class="verde">vende desde el día uno</span>',
        texto: "Nevux toma los datos de cada producto de tu Tiendanube (precio, promo, transferencia, cuotas) y arma la ficha solo.<br><br>Cargás un producto y <b>ya sale completo</b>.",
      },
      {
        tipo: "cta", ultima: true, eyebrow: "Sin apps · Sin cambiar de plantilla",
        titulo: '¿Querés que <span class="verde">tus fichas</span> salgan así?',
        texto: 'Comentá <span class="palabra">FICHA</span> y te muestro cómo quedaría la tuya.',
      },
    ],
    caption: `Marcelo, de Hogar Digital (@hogardigitaltiendaonline), cargó un producto nuevo: un Combo Navideño 🎄

Lo cargó en Tiendanube como siempre: fotos, precio, precio promocional y descripción. Nada más.

Y la ficha salió completa, sola:
💲 El precio con transferencia, cuánto ahorra y las cuotas.
🛒 Su promo por cantidad.
📦 La hora de corte con cuenta regresiva, el envío y su local.
❓ Las preguntas frecuentes y el botón de compra que siempre se ve.

Nosotros no tuvimos que tocar nada. Nevux toma los datos de cada producto de tu Tiendanube y arma la ficha. Así, cada producto nuevo vende desde el día uno.

✅ Sin apps
✅ Sin cambiar de plantilla

👉 ¿Querés que tus fichas salgan así? Comentá FICHA y te muestro cómo quedaría la tuya.

${HASHTAGS}`,
  },
  {
    carpeta: "13-combos",
    nombre: "Combos: cómo armarlos para vender más",
    placas: [
      { tipo: "portada", eyebrow: "Guardalo para después", titulo: 'Combos: cómo armarlos <span class="verde">para vender más</span>', sub: "Con un ejemplo real: el Combo Navideño de Hogar Digital." },
      f("EJEMPLO REAL · EN VIVO", "El combo que armó Marcelo para Navidad", "combo/1.jpg"),
      {
        tipo: "punto", num: "1 · UNA OCASIÓN CLARA",
        titulo: 'Un combo para <span class="verde">un momento</span>',
        texto: "“Armá tu Navidad” vende más que “5 productos juntos”.<br><br>La persona compra <b>una solución</b>, no una lista.",
      },
      {
        tipo: "punto", num: "2 · QUE SE COMPLETEN",
        titulo: 'Productos que <span class="verde">se necesitan juntos</span>',
        texto: "Árbol, estrella, adornos y luces: si compra uno, necesita los otros.<br><br>El combo <b>resuelve todo de una</b>.",
      },
      f("3 · EL AHORRO A LA VISTA", "Precio, % OFF y precio con transferencia", "combo/2.jpg"),
      {
        tipo: "punto", num: "4 · CON FECHA",
        titulo: 'Con fecha, <span class="verde">se decide antes</span>',
        texto: "Navidad, Día de la Madre, vuelta a clases: cada combo de temporada tiene su momento.<br><br>Publicalo con tiempo y <b>avisá hasta cuándo llega</b>.",
      },
      {
        tipo: "punto", num: "5 · CON LO QUE TENÉS",
        titulo: 'Armalo con <span class="verde">tu stock</span>',
        texto: "Un combo es una buena forma de mover lo que ya tenés, <b>sin comprar más mercadería</b>.",
      },
      {
        tipo: "cta", ultima: true, eyebrow: "Análisis gratis",
        titulo: '¿Qué combo podrías <span class="verde">armar vos</span>?',
        texto: 'Comentá <span class="palabra">COMBO</span> y te ayudo a pensarlo con los productos de tu tienda.',
      },
    ],
    caption: `🎁 Combos: cómo armarlos para vender más (guardalo para después)

Con un ejemplo real: el Combo Navideño que armó Marcelo en Hogar Digital (@hogardigitaltiendaonline) 👇

1️⃣ Una ocasión clara: "Armá tu Navidad" vende más que "5 productos juntos". La persona compra una solución, no una lista.
2️⃣ Que se completen: árbol, estrella, adornos y luces. Si compra uno, necesita los otros.
3️⃣ El ahorro a la vista: precio del combo, % OFF y precio con transferencia, en la ficha.
4️⃣ Con fecha: cada combo de temporada tiene su momento. Publicalo con tiempo y avisá hasta cuándo llega.
5️⃣ Con lo que tenés: un combo mueve tu stock sin comprar más mercadería.

👉 ¿Qué combo podrías armar vos? Comentá COMBO y te ayudo a pensarlo con los productos de tu tienda.

${HASHTAGS}`,
  },
];
