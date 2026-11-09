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
  ],
};
