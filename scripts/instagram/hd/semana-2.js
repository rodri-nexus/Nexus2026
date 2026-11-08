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

const carruseles = [];

const historias = [
  // Lun 9/11 · Reel: smartwatch KD99 Ultra
  { archivo: "1109-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Cuántas veces por día <span class="az">sacás el celular</span>?', sub: "Para ver un mensaje, una llamada o la hora… Contestame con la encuesta 👇", resp: "Menos de 20 · Más de 50 📲" },
  { archivo: "1109-2", tipo: "dato", eb: "Pagando con transferencia", grande: "10%", az: true, titulo: "OFF en toda la tienda", sub: `Por ejemplo, el Smartwatch KD99 Ultra queda en <b>${plata(P.smartwatch.precio * 0.9)}</b>. No acumulable con algunas promociones.` },
  nuevo("1109-3", "Nuevo reel", 'Todo en <span class="az">la muñeca</span>', "Smartwatch KD99 Ultra. Miralo en el perfil 👀"),
];

module.exports = { carruseles, historias };
