// Historias de @nevux.app, semana del 9 al 15/11 (3 por día: 9:47 pregunta · 13:17 concepto · 20:17 aviso del post de las 19:30).
// Se suman día por día (pedido de Rodrigo).
const nuevo = (archivo, eyebrow, titulo, texto) => ({
  archivo, tipo: "cta", eyebrow, titulo, texto, boton: "Miralo en el perfil", pie: "@nevux.app",
});

module.exports = {
  historias: [
    // Lun 9/11 · post: la ficha de Hogar Digital, en vivo
    {
      archivo: "1109-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tu ficha dice <span class="verde">cuándo llega</span> el pedido?',
      sub: "Respondé con la encuesta. Hoy te muestro una que sí lo dice.", responde: "SÍ · NO 📦",
    },
    {
      archivo: "1109-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Cada duda es <span class="verde">una salida</span>',
      texto: "¿Cuándo llega? ¿Tiene garantía? ¿Puedo pagar en cuotas?<br><br>Cada pregunta que la ficha no responde es un motivo para cerrar la pestaña y <b>“pensarlo”</b>.",
      pie: "Fricción",
    },
    nuevo("1109-3", "Nuevo post", 'La ficha de <span class="verde">Hogar Digital</span>, parte por parte', "Caso real, en vivo en su tienda. 📲"),

    // Mar 10/11 · reel: una compra real en Hogar Digital
    {
      archivo: "1110-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Cuántos pasos hay entre <span class="verde">entrar y comprar</span> en tu tienda?',
      sub: "Respondé con la encuesta. Hoy te muestro una compra real, paso a paso.", responde: "POCOS · MUCHOS 🛒",
    },
    {
      archivo: "1110-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'La duda aparece <span class="verde">en cada paso</span>',
      texto: "En la home: ¿es confiable? En la ficha: ¿cuánto pago y cuándo llega? En el carrito: ¿cuánto sale el envío?<br><br>Si cada paso responde su duda, <b>la compra sigue sola</b>.",
      pie: "El recorrido de compra",
    },
    nuevo("1110-3", "Nuevo reel", 'Una compra real en <span class="verde">Hogar Digital</span>', "Grabada en su tienda, de punta a punta. 🎥"),

    // Mié 11/11 · post: el carrito también vende
    {
      archivo: "1111-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tu carrito dice <span class="verde">cuánto falta</span> para el envío gratis?',
      sub: "Respondé con la encuesta. Hoy te muestro uno que sí.", responde: "SÍ · NO 🚚",
    },
    {
      archivo: "1111-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Una meta cerca <span class="verde">empuja</span>',
      texto: "“Te faltan $22.100 para el envío gratis” no es un dato: es una meta.<br><br>Cuando la meta se ve cerca, muchos <b>suman otro producto</b> en vez de pagar el envío.",
      pie: "Efecto meta",
    },
    nuevo("1111-3", "Nuevo post", 'El carrito <span class="verde">también vende</span>', "El de Hogar Digital, en vivo. 🛒"),

    // Jue 12/11 · reel: "en movimiento", sus Reels dentro de su tienda
    {
      archivo: "1112-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tus videos de Instagram <span class="verde">están en tu tienda</span>?',
      sub: "Respondé con la encuesta. Hoy te muestro dónde los puso Hogar Digital.", responde: "SÍ · NO 🎥",
    },
    {
      archivo: "1112-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Verlo andando <span class="verde">convence</span>',
      texto: "Una foto muestra el producto. Un video lo muestra <b>funcionando</b>, en manos de alguien.<br><br>Así quien compra se imagina usándolo antes de pagar.",
      pie: "Prueba visual",
    },
    nuevo("1112-3", "Nuevo reel", 'Sus Reels, <span class="verde">dentro de su tienda</span>', "La sección “en movimiento” de Hogar Digital. 🎥"),

    // Vie 13/11 · post: 3 cosas que tu ficha tiene que mostrar
    {
      archivo: "1113-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Cuál es la duda que <span class="verde">más te preguntan</span> por WhatsApp?',
      sub: "Respondé con la encuesta. Hoy te digo cómo sacarla de la ficha.", responde: "ENVÍO · PRECIO 💬",
    },
    {
      archivo: "1113-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Cada mensaje es <span class="verde">una venta en pausa</span>',
      texto: "Si te preguntan “¿cuánto tarda?” o “¿tiene garantía?”, la ficha no lo dijo.<br><br>Y por cada uno que pregunta, <b>hay otros que se fueron sin preguntar</b>.",
      pie: "Fricción",
    },
    nuevo("1113-3", "Nuevo post", '3 cosas que tu ficha <span class="verde">tiene que mostrar</span>', "Con un ejemplo real, en vivo. 📌"),
  ],
};
