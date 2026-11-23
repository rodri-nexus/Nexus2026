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

    // Mié 25/11 · post: dos rubros, dos estilos
    {
      archivo: "1125-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tu tienda tiene <span class="verde">un estilo propio</span>?',
      sub: "Respondé con la encuesta. Hoy te muestro dos tiendas, dos estilos.", responde: "SÍ · NO SÉ 🎨",
    },
    {
      archivo: "1125-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'El estilo <span class="verde">también vende</span>',
      texto: "Antes de leer un precio, quien entra ya decidió si tu tienda le parece confiable.<br><br>Colores, fotos y tipografía <b>dicen quién sos</b> en un segundo.",
      pie: "Primera impresión",
    },
    nuevo("1125-3", "Nuevo post", 'Dos rubros, <span class="verde">dos estilos</span>', "Hogar Digital y Perfumez. 🎨"),

    // Jue 26/11 · reel: la ficha de un perfume de Perfumez
    {
      archivo: "1126-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tu ficha cuenta <span class="verde">cómo es tu producto</span> o solo lo muestra?',
      sub: "Respondé con la encuesta. Hoy te muestro una ficha que lo cuenta todo.", responde: "LO CUENTA · LO MUESTRA",
    },
    {
      archivo: "1126-2", tipo: "punto", num: "TIP PARA TU FICHA",
      titulo: 'Contá lo que <span class="verde">no se ve en la foto</span>',
      texto: "Cómo huele, cómo se siente, cuánto dura, cómo llega.<br><br>Lo que la foto no muestra <b>es lo que más dudas genera</b>.",
      pie: "Ficha completa",
    },
    nuevo("1126-3", "Nuevo reel", 'La ficha de <span class="verde">un perfume</span>', "Perfumez, de punta a punta. 🖤"),
  ],
};
