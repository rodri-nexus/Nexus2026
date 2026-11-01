// Semana 1 de @hogardigitaltiendaonline (lunes 2 al viernes 6 de noviembre de 2026).
// Carruseles (martes y jueves) e historias (3 por día). Los Reels con narración los arma reels.py.
// Precios: los reales de la tienda (productos.json, leído de hogardigital.com.ar el 01/11). Nada inventado.
const P = require("./productos.json");
const H = "#hogardigital #tecnologia #regalos #hogar #deco #emprendedoresargentinos #compraonline #envios #argentina";

const prod = (k, n, texto) => ({ tipo: "producto", n, nombre: P[k].nombre.replace(/\s*\(.*\)$/, ""), precio: P[k].precio, lista: P[k].lista, img: P[k].img, texto });
const nuevo = (archivo, eb, titulo, sub) => ({ archivo, tipo: "portada", eb, titulo, sub, boton: "Miralo en el perfil" });

const carruseles = [
  {
    carpeta: "02-regalos",
    nombre: "5 regalos de menos de $50.000",
    placas: [
      { tipo: "portada", eb: "Guardalo para después", titulo: '5 regalos de <span class="az">menos de $50.000</span>', sub: "Para cumpleaños, el amigo invisible o para darte un gusto. <b>Con envío a todo el país.</b>", desliza: "Deslizá →" },
      prod("smartwatch", "REGALO 1 · PARA EL QUE ENTRENA", "Notificaciones, pasos y deporte, en la muñeca."),
      prod("espejo", "REGALO 2 · PARA LA QUE SE MAQUILLA", "Luz LED pareja para maquillarse en cualquier lugar."),
      prod("auriculares", "REGALO 3 · PARA EL QUE VIVE CON MÚSICA", "Inalámbricos, con estuche con pantalla."),
      prod("planchita", "REGALO 4 · PARA EL PELO PERFECTO", "Alisadora para el día a día."),
      prod("cargador", "REGALO 5 · EL QUE TODOS NECESITAN", "Carga rápida con 2 USB y USB-C."),
      { tipo: "portada", eb: "¿Cuál regalarías?", titulo: 'Pedilo hoy, <span class="az">llega a tu casa</span>', sub: "Despachamos de lunes a viernes. Llevando 2 tenés <b>15% OFF</b> y llevando 3, <b>25% OFF</b>.", boton: "Link en el perfil" },
    ],
    caption: `🎁 5 regalos de menos de $50.000 (guardalo para cuando lo necesites)

1️⃣ Smartwatch KD99 Ultra · $27.900
2️⃣ Espejo circular con luz LED · $32.900
3️⃣ Auriculares Air Max con pantalla · $45.900
4️⃣ Planchita alisadora de pelo · $40.900
5️⃣ Cargador rápido 6.4A con 2 USB + USB-C · $25.900

📦 Envíos a todo el país · Despachamos de lunes a viernes
💳 Visa, Mastercard, débito y Mercado Pago
🔁 Llevando 2 tenés 15% OFF y llevando 3, 25% OFF

¿Cuál le regalarías a quién? Etiquetalo en los comentarios 👇
🛒 Comprá en hogardigital.com.ar (link en el perfil)

${H}`,
  },
  {
    carpeta: "04-como-comprar",
    nombre: "Comprar en Hogar Digital",
    placas: [
      { tipo: "portada", eb: "Comprá tranquilo", titulo: 'Así es comprar en <span class="az">Hogar Digital</span>', sub: "Todo lo que necesitás saber antes de hacer tu pedido.", desliza: "Deslizá →" },
      { tipo: "lista", eb: "Envíos", titulo: "Llega a tu casa", items: [
        { icono: "1", t: "Envíos a todo el país", d: "Despachamos de lunes a viernes." },
        { icono: "2", t: "Llega en 5 a 6 días hábiles", d: "La fecha estimada la ves en cada producto." },
      ] },
      { tipo: "lista", eb: "Pagos", titulo: "Pagá como quieras", items: [
        { icono: "1", t: "Visa, Mastercard y débito" },
        { icono: "2", t: "Mercado Pago" },
        { icono: "3", t: "Hasta 12 cuotas", d: "Las cuotas disponibles las ves en cada producto." },
      ] },
      { tipo: "dato", eb: "Llevá más, pagá menos", grande: "25%", az: true, titulo: "OFF llevando 3", sub: "Y <b>15% OFF</b> llevando 2. Se aplica solo en el carrito." },
      { tipo: "lista", eb: "Garantía", titulo: "Comprá sin miedo", items: [
        { icono: "30", t: "30 días de garantía", d: "Por falla de fabricación, producto dañado o error en el envío." },
        { icono: "10", t: "10 días para arrepentirte", d: "Desde que lo recibís." },
      ] },
      { tipo: "portada", eb: "Desde los años 80", titulo: '¿Dudas? <span class="az">Escribinos</span>', sub: "Te respondemos por WhatsApp y te ayudamos a elegir.", boton: "Link en el perfil" },
    ],
    caption: `🏠 Así es comprar en Hogar Digital

📦 Envíos a todo el país. Despachamos de lunes a viernes y llega en 5 a 6 días hábiles.
💳 Visa, Mastercard, débito y Mercado Pago, en hasta 12 cuotas.
🔁 Llevando 2 tenés 15% OFF y llevando 3, 25% OFF.
✅ 30 días de garantía y 10 días para arrepentirte desde que lo recibís.
💬 ¿Dudas? Escribinos por WhatsApp y te ayudamos a elegir.

Estamos desde los años 80, acompañando a cada cliente 🤝

🛒 hogardigital.com.ar (link en el perfil)

${H}`,
  },
];

const historias = [
  // Lun 2/11 · Reel: humidificador OVNI
  { archivo: "1102-1", tipo: "opciones", eb: "Elegí uno", titulo: '¿Cuál va en <span class="az">tu cuarto</span>?', opciones: [
    { letra: "A", nombre: "OVNI", img: P.ovni.img }, { letra: "B", nombre: "Volcán", img: P.volcan.img }], resp: "Respondé A o B por mensaje 💬" },
  { archivo: "1102-2", tipo: "dato", eb: "¿Sabías que…?", grande: "40-60%", az: true, titulo: "de humedad", sub: "Es lo recomendado en casa para respirar mejor y dormir cómodo. <b>Un humidificador te ayuda a mantenerla.</b>" },
  nuevo("1102-3", "Nuevo reel", 'Así se ve tu cuarto <span class="az">de noche</span>', "Niebla y luz LED. Miralo en el perfil 👀"),

  // Mar 3/11 · Carrusel: 5 regalos
  { archivo: "1103-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Ya pensaste <span class="az">el próximo regalo</span>?', sub: "Contestame SÍ o NO. Hoy subimos una lista para ayudarte 🎁", resp: "Respondé SÍ o NO 💬" },
  { ...prod("smartwatch", "EL MÁS ELEGIDO"), archivo: "1103-2" },
  nuevo("1103-3", "Nuevo post", '5 regalos de <span class="az">menos de $50.000</span>', "Guardalo para cuando lo necesites."),

  // Mié 4/11 · Reel: rincón relax
  { archivo: "1104-1", tipo: "portada", eb: "Contanos", titulo: '¿Dónde <span class="az">te relajás</span> en tu casa?', sub: "En el cuarto, en el living, en la oficina… Contestame por mensaje.", resp: "Escribinos 💬" },
  { ...prod("llama", "EFECTO FUEGO · CONTROL REMOTO"), archivo: "1104-2" },
  nuevo("1104-3", "Nuevo reel", 'Armá tu <span class="az">rincón relax</span>', "3 humidificadores para elegir. Miralo en el perfil."),

  // Jue 5/11 · Carrusel: cómo comprar
  { archivo: "1105-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Qué te frena para <span class="az">comprar online</span>?', sub: "A) El envío · B) El pago · C) Que no me guste. Contestame por mensaje.", resp: "Respondé A, B o C 💬" },
  { archivo: "1105-2", tipo: "dato", eb: "Garantía", grande: "30", az: true, titulo: "días de garantía", sub: "Por falla de fabricación, producto dañado o error en el envío. <b>Nosotros nos hacemos cargo.</b>" },
  nuevo("1105-3", "Nuevo post", 'Así es comprar en <span class="az">Hogar Digital</span>', "Envíos, pagos, garantía y cambios."),

  // Vie 6/11 · Reel: parlantes para el finde
  { archivo: "1106-1", tipo: "opciones", eb: "Plan del finde", titulo: '¿Juntada o <span class="az">relax</span>?', opciones: [
    { letra: "A", nombre: "Juntada", img: P["parlante-12"].img }, { letra: "B", nombre: "Relax", img: P.g.img }], resp: "Respondé A o B por mensaje 💬" },
  { ...prod("parlante-rgb", "PARA EL FINDE · CON LUCES"), archivo: "1106-2" },
  nuevo("1106-3", "Nuevo reel", 'Música para <span class="az">el finde</span>', "3 parlantes para cada plan. Miralo en el perfil."),
];

module.exports = { carruseles, historias };
