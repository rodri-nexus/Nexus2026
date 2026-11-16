// Historias de @nevux.app, semana del 16 al 22/11 (9:47 pregunta · 13:17 concepto · 20:17 aviso del post de las 19:30).
const nuevo = (archivo, eyebrow, titulo, texto) => ({
  archivo, tipo: "cta", eyebrow, titulo, texto, boton: "Miralo en el perfil", pie: "@nevux.app",
});

module.exports = {
  historias: [
    // Lun 16/11 · post: producto nuevo, ficha completa
    {
      archivo: "1116-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: 'Cuando cargás un producto nuevo, <span class="verde">¿la ficha queda completa</span>?',
      sub: "Respondé con la encuesta. Hoy te muestro un caso real.", responde: "SÍ · NO 📦",
    },
    {
      archivo: "1116-2", tipo: "punto", num: "CÓMO FUNCIONA",
      titulo: 'Se configura una vez, <span class="verde">funciona siempre</span>',
      texto: "Nevux lee los datos de cada producto de tu Tiendanube: precio, promo, transferencia y cuotas.<br><br>Por eso <b>cada producto nuevo</b> sale con la ficha completa.",
      pie: "Sin tocar nada",
    },
    nuevo("1116-3", "Nuevo post", 'Cargó un producto nuevo. <span class="verde">La ficha salió completa.</span>', "Caso real: Hogar Digital, en vivo. 🎄"),

    // Mar 17/11 · reel: la cuenta regresiva del despacho, en vivo
    {
      archivo: "1117-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tu tienda dice <span class="verde">cuándo sale</span> el pedido?',
      sub: "Respondé con la encuesta. Hoy te muestro una que lo cuenta en tiempo real.", responde: "SÍ · NO ⏰",
    },
    {
      archivo: "1117-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Urgencia <span class="verde">real</span>, no inventada',
      texto: "“Últimas horas” en todos lados ya no convence a nadie.<br><br>“Sale hoy si comprás antes de las 18 h” sí: <b>es verdad y le sirve a quien compra</b>.",
      pie: "Urgencia honesta",
    },
    nuevo("1117-3", "Nuevo reel", 'La cuenta regresiva <span class="verde">del despacho</span>', "En vivo, en la tienda de Hogar Digital. ⏰"),

    // Mié 18/11 · post: combos
    {
      archivo: "1118-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tenés algún <span class="verde">combo</span> en tu tienda?',
      sub: "Respondé con la encuesta. Hoy te cuento cómo armar uno que venda.", responde: "SÍ · NO 🎁",
    },
    {
      archivo: "1118-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Una decisión <span class="verde">en vez de cinco</span>',
      texto: "Elegir cinco productos cansa.<br><br>Un combo resuelve todo con una sola decisión: <b>comprar o no</b>.",
      pie: "Fatiga de decisión",
    },
    nuevo("1118-3", "Nuevo post", 'Combos: cómo armarlos <span class="verde">para vender más</span>', "Con un ejemplo real. 🎁"),

    // Jue 19/11 · reel: la tienda de Hogar Digital en computadora
    {
      archivo: "1119-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Revisaste cómo se ve tu tienda <span class="verde">en la computadora</span>?',
      sub: "Respondé con la encuesta. Hoy te muestro una que vende igual en las dos.", responde: "SÍ · NUNCA 💻",
    },
    {
      archivo: "1119-2", tipo: "punto", num: "DATO PARA TU TIENDA",
      titulo: 'Miran en el celular, <span class="verde">compran donde sea</span>',
      texto: "Mucha gente descubre en el celular y termina la compra en la computadora, o al revés.<br><br>Si tu tienda se ve bien en una sola, <b>perdés la otra</b>.",
      pie: "Celular y computadora",
    },
    nuevo("1119-3", "Nuevo reel", 'Hogar Digital, <span class="verde">en computadora</span>', "Grabado en su tienda, en vivo. 💻"),

    // Vie 20/11 · post: antes del Black Friday
    {
      archivo: "1120-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Vas a hacer promo para el <span class="verde">Black Friday</span>?',
      sub: "Respondé con la encuesta. Hoy te dejo qué revisar antes del 27.", responde: "SÍ · NO 🖤",
    },
    {
      archivo: "1120-2", tipo: "punto", num: "TIP PARA ESTA SEMANA",
      titulo: 'Mirá tu ficha <span class="verde">como cliente</span>',
      texto: "Abrila desde el celular y preguntate: ¿entiendo el precio, cuándo llega y cómo pago <b>en 5 segundos</b>?<br><br>Si dudás vos, duda el que compra.",
      pie: "Black Friday · 27/11",
    },
    nuevo("1120-3", "Nuevo post", '5 cosas para revisar <span class="verde">antes del Black Friday</span>', "Con ejemplos reales. 🖤"),

    // Sáb 21/11 · reel: las preguntas frecuentes de la ficha, en vivo
    {
      archivo: "1121-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Cuántas veces por día te preguntan <span class="verde">lo mismo</span>?',
      sub: "Respondé con la encuesta. Hoy te muestro cómo sacarlo de la ficha.", responde: "POCAS · MUCHAS 💬",
    },
    {
      archivo: "1121-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Esperar una respuesta <span class="verde">enfría</span> la compra',
      texto: "Quien pregunta por WhatsApp a la noche y recibe la respuesta a la mañana, muchas veces ya compró en otro lado.<br><br>La respuesta en la ficha <b>llega al instante</b>.",
      pie: "Respuesta inmediata",
    },
    nuevo("1121-3", "Nuevo reel", 'Las dudas, <span class="verde">respondidas en la ficha</span>', "En vivo, en la tienda de Hogar Digital. 💬"),
  ],
};
