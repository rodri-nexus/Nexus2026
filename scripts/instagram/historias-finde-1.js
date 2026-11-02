// Historias del fin de semana 7 y 8/11 de @nevux.app, 3 por día (9:47 pregunta, 13:17 concepto, 20:17 aviso del post de las 19:30).
const nuevo = (archivo, eyebrow, titulo, texto) => ({
  archivo, tipo: "cta", eyebrow, titulo, texto, boton: "Miralo en el perfil", pie: "@nevux.app",
});

module.exports = {
  historias: [
    // Sáb 7/11 · reel: ¿cuándo llega?
    {
      archivo: "1107-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tu ficha dice <span class="verde">cuándo llega</span> el pedido?',
      sub: "No “envío a todo el país”: una fecha. Contestame SÍ o NO.", responde: "Respondé SÍ o NO 💬",
    },
    {
      archivo: "1107-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'La duda también <span class="verde">cuesta</span>',
      texto: "Cuando algo es incierto, lo evitamos aunque nos guste.<br><br>Si no sabe cuándo lo va a tener, <b>lo deja para después</b>. Y después no vuelve.",
      pie: "Aversión a la incertidumbre",
    },
    nuevo("1107-3", "Nuevo reel", '¿Cuándo <span class="verde">llega</span>?', "Una fecha concreta vende más que “envío a todo el país”. Miralo en 15 segundos."),

    // Dom 8/11 · carrusel: checklist
    {
      archivo: "1108-1", tipo: "mito", eyebrow: "Mito o realidad", titulo: "Lo que todos piensan",
      mito: "Si el producto es bueno, se vende solo.",
      realidad: "La gente no compra el producto: compra lo que entiende en la ficha. Si no ve precio, envío y garantía claros, se va.",
    },
    {
      archivo: "1108-2", tipo: "punto", num: "TIP DEL DÍA",
      titulo: 'La prueba de los <span class="verde">5 segundos</span>',
      texto: "Pedile a alguien que abra tu ficha en el celular y te diga, en 5 segundos: <b>cuánto sale, cuándo llega y cómo paga</b>.<br><br>Si duda en alguna, ahí estás perdiendo ventas.",
      pie: "Probalo hoy",
    },
    nuevo("1108-3", "Nuevo post", 'Checklist de una ficha que <span class="verde">vende</span>', "8 puntos para revisar tu ficha hoy. Guardalo. 📌"),
  ],
};
