// Semana 3 de @hogardigitaltiendaonline (lunes 16 al viernes 20 de noviembre de 2026). Se arma día por día (pedido de Rodrigo).
// Precios: los reales de la tienda (productos.json, revisado el 15/11). Promos reales en cada ficha: 10% con transferencia,
// 15% llevando 2 / 25% llevando 3 ("no acumulable con algunas promociones") y envío gratis superando $50.000 (se ve en la ficha).
// No usar "cuotas sin interés": el checkout cobra interés desde 2 cuotas.
const P = require("./productos.json");
const H = "#hogardigital #tecnologia #regalos #hogar #deco #emprendedoresargentinos #compraonline #envios #argentina";

const prod = (k, n, texto) => ({ tipo: "producto", n, nombre: P[k].nombre.replace(/\s*\(.*\)$/, ""), precio: P[k].precio, lista: P[k].lista, img: P[k].img, texto });
const nuevo = (archivo, eb, titulo, sub) => ({ archivo, tipo: "portada", eb, titulo, sub, boton: "Miralo en el perfil" });
const plata = (n) => "$" + Math.round(n).toLocaleString("es-AR");

const carruseles = [];

const historias = [
  // Lun 16/11 · Reel: auriculares Air Max con pantalla
  { archivo: "1116-1", tipo: "opciones", eb: "Elegí uno", titulo: '¿Cómo escuchás <span class="az">tu música</span>?', opciones: [
    { letra: "A", nombre: "Auriculares", img: P.auriculares.img }, { letra: "B", nombre: "Parlante", img: P["parlante-rgb"].img }], resp: "Respondé A o B en la encuesta 👇" },
  { archivo: "1116-2", tipo: "dato", eb: "Envío gratis", grande: "$50.000", az: true, titulo: "y el envío es gratis", sub: "Superando ese monto, <b>el envío a todo el país no lo pagás</b>. Lo ves en cada producto." },
  nuevo("1116-3", "Nuevo reel", 'Auriculares <span class="az">con pantalla</span>', "Air Max. Miralo en el perfil 👀"),
];

module.exports = { carruseles, historias };
