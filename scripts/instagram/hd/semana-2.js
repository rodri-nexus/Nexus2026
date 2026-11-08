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
  {
    carpeta: "08-conoce-hogar-digital",
    nombre: "Conocé Hogar Digital",
    placas: [
      { tipo: "portada", eb: "Desde los años 80", titulo: 'Conocé <span class="az">Hogar Digital</span>', sub: "Detrás de la tienda online hay un local de verdad en Campana, atendiendo desde los años 80.", desliza: "Deslizá →" },
      { tipo: "foto", img: "../../clientes/hogar-digital/comunidad/marcelo-consejos.jpg", eb: "Quién te atiende", titulo: 'Marcelo, <span class="az">al frente</span>', sub: "Lo ves en nuestros videos explicando cada producto. Si tenés una duda, te responde él." },
      { tipo: "foto", img: "../../clientes/hogar-digital/comunidad/marcelo-parlantes.jpg", eb: "El local", titulo: 'Belgrano 276, <span class="az">Campana</span>', sub: "Lunes a sábado de 8 a 21 h. Vení a ver los productos en persona." },
      { tipo: "foto", img: "../../clientes/hogar-digital/comunidad/empaquetando.jpg", eb: "Tu pedido", titulo: 'Lo armamos <span class="az">acá</span>', sub: "Despachamos de lunes a viernes a todo el país." },
      { tipo: "lista", eb: "En números", titulo: "Lo que nos respalda", items: [
        { icono: "35", t: "Más de 35 años de trayectoria", d: "Empezamos en la década del 80." },
        { icono: "300", t: "Más de 300 ventas en 2026" },
        { icono: "800", t: "Más de 800 calificaciones", d: "En Mercado Libre." },
      ] },
      { tipo: "portada", eb: "Te esperamos", titulo: 'En el local o <span class="az">online</span>', sub: "Comprá en hogardigital.com.ar con envío a todo el país, o vení a Belgrano 276. Te respondemos por WhatsApp.", boton: "Link en el perfil" },
    ],
    caption: `🏠 Conocé Hogar Digital

Detrás de la tienda online hay un local de verdad en Campana, atendiendo desde los años 80.

👨 Marcelo, al frente: lo ves en nuestros videos explicando cada producto, y si tenés una duda, te responde él.
📍 Local: Belgrano 276, Campana (Buenos Aires). Lunes a sábado de 8 a 21 h.
📦 Armamos cada pedido acá y despachamos de lunes a viernes a todo el país.

✅ Más de 35 años de trayectoria
✅ Más de 300 ventas en 2026
✅ Más de 800 calificaciones en Mercado Libre

¿Sos de Campana o alrededores? Pasá a conocernos 🙌
🛒 O comprá online en hogardigital.com.ar (link en el perfil)

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

  // Mié 11/11 · Reel: bienestar en casa (masajeador y kit de gimnasio)
  { archivo: "1111-1", tipo: "opciones", eb: "Elegí una", titulo: '¿Qué te hace falta <span class="az">esta semana</span>?', opciones: [
    { letra: "A", nombre: "Relajarme", img: "p/masajeador-3.jpg" }, { letra: "B", nombre: "Moverme", img: P.kit.img }], resp: "Respondé A o B en la encuesta 👇" },
  { ...prod("kit", "PARA ENTRENAR EN CASA", "Bandas, agarres y todo para moverte sin ir al gimnasio."), archivo: "1111-2" },
  nuevo("1111-3", "Nuevo reel", 'Cuidarte <span class="az">sin salir de casa</span>', "Masajeador y kit de gimnasio. Miralo en el perfil 👀"),

  // Jue 12/11 · Carrusel: Conocé Hogar Digital
  { archivo: "1112-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Sabías que tenemos <span class="az">local en Campana</span>?', sub: "Contestame con la encuesta 👇 Hoy te lo mostramos.", resp: "Sí · No 📍" },
  { archivo: "1112-2", tipo: "dato", eb: "Desde los años 80", grande: "+35", az: true, titulo: "años de trayectoria", sub: "Y <b>más de 800 calificaciones</b> en Mercado Libre." },
  nuevo("1112-3", "Nuevo post", 'Conocé <span class="az">Hogar Digital</span>', "El local, quién te atiende y cómo armamos tu pedido."),
];

module.exports = { carruseles, historias };
