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
  ],
};
