// Semana 2 de @hogardigitaltiendaonline (lunes 9 al viernes 13 de noviembre de 2026).
// Se arma día por día (pedido de Rodrigo): carruseles e historias acá; los Reels con narración, en reels.py.
// Precios: los reales de la tienda (productos.json, revisado en hogardigital.com.ar el 08/11). Nada inventado.
// Promos reales vistas en la tienda el 08/11: 10% OFF pagando con transferencia ("no acumulable con algunas promociones")
// y hasta 25% OFF comprando en cantidad (15% llevando 2, 25% llevando 3).
const P = require("./productos.json");
const H = "#hogardigital #tecnologia #regalos #hogar #deco #emprendedoresargentinos #compraonline #envios #argentina";

const prod = (k, n, texto) => ({ tipo: "producto", n, nombre: P[k].nombre.replace(/\s*\(.*\)$/, ""), precio: P[k].precio, lista: P[k].lista, img: P[k].img, texto });
const nuevo = (archivo, eb, titulo, sub) => ({ archivo, tipo: "portada", eb, titulo, sub, boton: "Miralo en el perfil" });
const plata = (n) => "$" + Math.round(n).toLocaleString("es-AR");

const ej = P.ovni.precio, sw = P.smartwatch.precio;
const carruseles = [
  {
    carpeta: "06-pagar-menos",
    nombre: "2 formas de pagar menos",
    placas: [
      { tipo: "portada", eb: "Guardalo para después", titulo: '2 formas de <span class="az">pagar menos</span> en Hogar Digital', sub: "Están activas en toda la tienda y las ves en cada producto antes de pagar.", desliza: "Deslizá →" },
      { tipo: "dato", eb: "Forma 1 · Transferencia", grande: "10%", az: true, titulo: "OFF pagando con transferencia", sub: "Lo elegís como medio de pago al finalizar la compra y el descuento se aplica solo." },
      { tipo: "lista", eb: "Ejemplo real", titulo: "Humidificador OVNI", items: [
        { icono: "1", t: `Precio: ${plata(ej)}` },
        { icono: "2", t: `Con transferencia: ${plata(ej * 0.9)}`, d: `Ahorrás ${plata(ej * 0.1)}.` },
      ] },
      { tipo: "dato", eb: "Forma 2 · Llevá más", grande: "25%", az: true, titulo: "OFF llevando 3", sub: "Y <b>15% OFF llevando 2</b>. Se aplica solo en el carrito." },
      { tipo: "lista", eb: "Ejemplo real", titulo: "Smartwatch KD99 Ultra", items: [
        { icono: "1", t: `1 unidad: ${plata(sw)}` },
        { icono: "2", t: `2 unidades: ${plata(sw * 2 * 0.85)}`, d: `Te queda cada uno a ${plata(sw * 0.85)}.` },
        { icono: "3", t: `3 unidades: ${plata(sw * 3 * 0.75)}`, d: `Te queda cada uno a ${plata(sw * 0.75)}.` },
      ] },
      { tipo: "portada", eb: "¿Cuál vas a usar?", titulo: 'Elegí, <span class="az">pedí y listo</span>', sub: "Envíos a todo el país. Los descuentos no son acumulables con algunas promociones.", boton: "Link en el perfil" },
    ],
    caption: `💸 2 formas de pagar menos en Hogar Digital (guardalo para tu próxima compra)

1️⃣ Pagando con transferencia: 10% OFF en toda la tienda.
Ejemplo: Humidificador OVNI ${plata(ej)} → ${plata(ej * 0.9)} con transferencia.

2️⃣ Llevando más: 15% OFF llevando 2 y 25% OFF llevando 3.
Ejemplo: Smartwatch KD99 Ultra, ${plata(sw)} uno solo, ${plata(sw * 2 * 0.85)} los 2 y ${plata(sw * 3 * 0.75)} los 3.

Los dos descuentos se ven en cada producto antes de pagar. No son acumulables con algunas promociones.

📦 Envíos a todo el país
💬 ¿Dudas? Escribinos por WhatsApp

¿Cuál vas a usar? Contanos en los comentarios 👇
🛒 hogardigital.com.ar (link en el perfil)

${H}`,
  },
];

const historias = [
  // Lun 9/11 · Reel: smartwatch KD99 Ultra
  { archivo: "1109-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Cuántas veces por día <span class="az">sacás el celular</span>?', sub: "Para ver un mensaje, una llamada o la hora… Contestame con la encuesta 👇", resp: "Menos de 20 · Más de 50 📲" },
  { archivo: "1109-2", tipo: "dato", eb: "Pagando con transferencia", grande: "10%", az: true, titulo: "OFF en toda la tienda", sub: `Por ejemplo, el Smartwatch KD99 Ultra queda en <b>${plata(P.smartwatch.precio * 0.9)}</b>. No acumulable con algunas promociones.` },
  nuevo("1109-3", "Nuevo reel", 'Todo en <span class="az">la muñeca</span>', "Smartwatch KD99 Ultra. Miralo en el perfil 👀"),

  // Mar 10/11 · Carrusel: 2 formas de pagar menos
  { archivo: "1110-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Cómo pagás cuando <span class="az">comprás online</span>?', sub: "Contestame con la encuesta 👇 Hoy subimos cómo pagar menos.", resp: "Tarjeta · Transferencia 💳" },
  { ...prod("auriculares", `CON TRANSFERENCIA: ${plata(P.auriculares.precio * 0.9)}`), archivo: "1110-2" },
  nuevo("1110-3", "Nuevo post", '2 formas de <span class="az">pagar menos</span>', "Guardalo para tu próxima compra."),
];

module.exports = { carruseles, historias };
