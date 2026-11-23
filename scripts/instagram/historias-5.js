// Historias de @nevux.app, semana del 23 al 29/11 (9:47 pregunta · 13:17 concepto · 20:17 aviso del post de las 19:30).
const nuevo = (archivo, eyebrow, titulo, texto) => ({
  archivo, tipo: "cta", eyebrow, titulo, texto, boton: "Miralo en el perfil", pie: "@nevux.app",
});

module.exports = {
  historias: [
    // Lun 23/11 · post: cliente nuevo, Perfumez
    {
      archivo: "1123-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Qué vendés <span class="verde">en tu tienda</span>?',
      sub: "Contame con la encuesta. Hoy te muestro un rubro nuevo con Nevux.", responde: "ROPA · OTRA COSA 🛍️",
    },
    {
      archivo: "1123-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Un perfume <span class="verde">no se puede oler</span> online',
      texto: "Por eso la ficha tiene que contar cómo huele: salida, corazón y fondo.<br><br>Cuando no se puede probar, <b>hay que describirlo bien</b>.",
      pie: "Vender lo que no se toca",
    },
    nuevo("1123-3", "Nuevo post", 'Cliente nuevo: <span class="verde">Perfumez</span>', "Perfumes árabes, en negro y dorado. 🖤"),

    // Mar 24/11 · reel: la home de Perfumez
    {
      archivo: "1124-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Comprarías un perfume <span class="verde">sin olerlo</span>?',
      sub: "Respondé con la encuesta. Hoy te muestro cómo lo resuelve una tienda.", responde: "SÍ · NI LOCO 🖤",
    },
    {
      archivo: "1124-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Las palabras <span class="verde">también huelen</span>',
      texto: "“Canela, cardamomo y vainilla” se imagina. “Fragancia intensa” no dice nada.<br><br>Cuanto más concreta la descripción, <b>menos duda quien compra</b>.",
      pie: "Descripción sensorial",
    },
    nuevo("1124-3", "Nuevo reel", 'La tienda de <span class="verde">Perfumez</span>', "Así va a quedar, sección por sección. 🖤"),
  ],
};
