// Semana 3 de @hogardigitaltiendaonline (lunes 16 al viernes 20 de noviembre de 2026). Se arma día por día (pedido de Rodrigo).
// Precios: los reales de la tienda (productos.json, revisado el 15/11). Promos reales en cada ficha: 10% con transferencia,
// 15% llevando 2 / 25% llevando 3 ("no acumulable con algunas promociones") y envío gratis superando $50.000 (se ve en la ficha).
// No usar "cuotas sin interés": el checkout cobra interés desde 2 cuotas.
const P = require("./productos.json");
const H = "#hogardigital #tecnologia #regalos #hogar #deco #emprendedoresargentinos #compraonline #envios #argentina";

const prod = (k, n, texto) => ({ tipo: "producto", n, nombre: P[k].nombre.replace(/\s*\(.*\)$/, ""), precio: P[k].precio, lista: P[k].lista, img: P[k].img, texto });
const nuevo = (archivo, eb, titulo, sub) => ({ archivo, tipo: "portada", eb, titulo, sub, boton: "Miralo en el perfil" });
const plata = (n) => "$" + Math.round(n).toLocaleString("es-AR");

const item = (n, nombre, img, texto) => ({ tipo: "producto", n, nombre, img, texto });
const carruseles = [
  {
    carpeta: "09-combo-navideno",
    nombre: "Combo Navideño",
    placas: [
      { ...prod("combo", "NUEVO · COMBO NAVIDEÑO", "Todo para armar tu Navidad, en un solo pedido. Deslizá y mirá qué trae 👉") },
      item("1 · EL ÁRBOL", "Árbol blanco de 90 cm", "p/combo-arbol.jpg", "Para decorar cualquier espacio de tu casa."),
      item("2 · LA PUNTA", "Estrella para el árbol", "p/combo-estrella-2.jpg", "Para que tu árbol se destaque."),
      item("3 · LOS ADORNOS", "12 adornos para colgar", "p/combo-adornos.jpg", "El toque festivo para el árbol."),
      item("4 · LAS LUCES", "Luces LED con control remoto", "p/combo-luces.jpg", "Con distintos efectos para ambientar tus reuniones."),
      item("5 · PARA LA MESA", "Arbolito de mesa", "p/combo-arbolito.jpg", "El detalle especial para tu mesa navideña."),
      { tipo: "portada", eb: "Combo Navideño", titulo: `Todo por <span class="az">${plata(P.combo.precio)}</span>`, sub: `Pagando con transferencia, <b>${plata(P.combo.precio * 0.9)}</b>. Envíos a todo el país.`, boton: "Link en el perfil" },
    ],
    caption: `🎄 Llegó el Combo Navideño de Hogar Digital

Todo lo que necesitás para armar tu Navidad, en un solo pedido:

🌲 Árbol de Navidad blanco de 90 cm
⭐ Punta de árbol con estrella
✨ 12 adornos para colgar
💡 Luces LED con control remoto, con distintos efectos
🎁 Arbolito de mesa, para el detalle especial

💲 ${plata(P.combo.precio)} (antes ${plata(P.combo.lista)})
💸 Pagando con transferencia: ${plata(P.combo.precio * 0.9)}
📦 Envíos a todo el país

¿Ya armaste el árbol o todavía? Contanos en los comentarios 👇
🛒 hogardigital.com.ar (link en el perfil)

${H}`,
  },
];

const historias = [
  // Lun 16/11 · Reel: auriculares Air Max con pantalla
  { archivo: "1116-1", tipo: "opciones", eb: "Elegí uno", titulo: '¿Cómo escuchás <span class="az">tu música</span>?', opciones: [
    { letra: "A", nombre: "Auriculares", img: P.auriculares.img }, { letra: "B", nombre: "Parlante", img: P["parlante-rgb"].img }], resp: "Respondé A o B en la encuesta 👇" },
  { archivo: "1116-2", tipo: "dato", eb: "Envío gratis", grande: "$50.000", az: true, titulo: "y el envío es gratis", sub: "Superando ese monto, <b>el envío a todo el país no lo pagás</b>. Lo ves en cada producto." },
  nuevo("1116-3", "Nuevo reel", 'Auriculares <span class="az">con pantalla</span>', "Air Max. Miralo en el perfil 👀"),

  // Mar 17/11 · Carrusel: Combo Navideño
  { archivo: "1117-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Ya armaste <span class="az">el árbol</span>?', sub: "Contestame con la encuesta 👇 Hoy subimos algo para vos.", resp: "Sí · Todavía no 🎄" },
  { ...prod("combo", "NUEVO EN LA TIENDA", "Árbol, estrella, adornos, luces y arbolito de mesa."), archivo: "1117-2" },
  nuevo("1117-3", "Nuevo post", 'Llegó el <span class="az">Combo Navideño</span>', "Mirá todo lo que trae en el perfil 🎄"),

  // Mié 18/11 · Reel: Combo Navideño (el trípode con aro de luz ya no aparece en la tienda)
  { archivo: "1118-1", tipo: "opciones", eb: "Elegí uno", titulo: '¿Árbol grande o <span class="az">arbolito de mesa</span>?', opciones: [
    { letra: "A", nombre: "Árbol", img: "p/combo-arbol.jpg" }, { letra: "B", nombre: "Arbolito", img: "p/combo-arbolito.jpg" }], resp: "Respondé A o B en la encuesta 👇 (el combo trae los dos)" },
  { archivo: "1118-2", tipo: "dato", eb: "Combo Navideño", grande: "5", az: true, titulo: "cosas en un solo combo", sub: `Árbol, estrella, adornos, luces y arbolito de mesa. <b>${plata(P.combo.precio)}</b>, o ${plata(P.combo.precio * 0.9)} con transferencia.` },
  nuevo("1118-3", "Nuevo reel", 'Tu Navidad, <span class="az">en un combo</span>', "Miralo en el perfil 🎄"),
];

module.exports = { carruseles, historias };
