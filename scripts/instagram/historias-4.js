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
  ],
};
