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
  ],
};
