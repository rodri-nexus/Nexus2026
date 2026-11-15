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
];
