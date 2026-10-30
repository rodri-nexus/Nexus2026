// Historias de la semana 1 (30/10 al 6/11), 3 por día:
// MMDD-1 a las 9:47 (pregunta o juego), MMDD-2 a las 13:17 (concepto o tip) y MMDD-3 a las 20:17 (aviso de lo publicado a las 19:30).
// Instagram no deja agregar encuestas ni stickers desde afuera de la app: las historias piden la respuesta por mensaje.

const nuevo = (archivo, eyebrow, titulo, texto) => ({
  archivo, tipo: "cta", eyebrow, titulo, texto, boton: "Miralo en el perfil", pie: "@nevux.app",
});

module.exports = {
  historias: [
    // Vie 30/10 · post: 5 errores
    nuevo("1030-3", "Nuevo post", '5 errores de la ficha que te <span class="verde">cuestan ventas</span>', "¿Cuántos tiene tu tienda? Entrá al perfil y fijate. 👀"),

    // Sáb 31/10 · reel: qué hace Nevux
    {
      archivo: "1031-1", tipo: "portada", eyebrow: "Pregunta rápida",
      titulo: '¿Tu tienda tiene visitas pero <span class="verde">vende poco</span>?',
      sub: "Contestame por mensaje con un SÍ o un NO. Leo todas.", responde: "Respondé SÍ o NO 💬",
    },
    {
      archivo: "1031-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA",
      titulo: 'Tu cliente decide <span class="verde">en segundos</span>',
      texto: "Primero siente (“lo quiero” o “no me convence”) y <b>después</b> busca razones para justificarlo.<br><br>Si tu ficha no gana en esos primeros segundos, la lógica nunca llega a rescatarte.",
      pie: "Sistema 1 y Sistema 2",
    },
    nuevo("1031-3", "Nuevo reel", 'Así cambia una ficha <span class="verde">con Nevux</span>', "Mismo producto, mismo precio. Mirá el antes y el después en 15 segundos."),

    // Dom 1/11 · post: la cuenta
    {
      archivo: "1101-1", tipo: "mito", eyebrow: "Mito o realidad", titulo: "Lo que todos te dicen",
      mito: "Para vender más necesito más seguidores y más anuncios.",
      realidad: "Si la ficha no convence, cada visita nueva se va igual que las anteriores. Primero la ficha, después el tráfico.",
    },
    {
      archivo: "1101-2", tipo: "numero", eyebrow: "Hacé la cuenta", grande: "+15", verde: true,
      chico: "ventas por mes, con las mismas visitas",
      texto: "3.000 visitas · ticket de $35.000 · si de cada 200 visitas compra 1 más: <b>+$525.000 por mes</b>.",
      pie: "Es una cuenta, no una promesa",
    },
    nuevo("1101-3", "Nuevo post", 'La cuenta que <span class="verde">nadie hace</span>', "Antes de subir el presupuesto de anuncios, hacé esta cuenta. 📊"),

    // Lun 2/11 · reel: tu mejor precio está escondido
    {
      archivo: "1102-1", tipo: "ab", eyebrow: "Juguemos", titulo: '¿Cuál <span class="verde">vende más</span>?',
      opciones: [
        { t: "Remera Oversize", p: "$45.000", chiq: "10% OFF con transferencia" },
        { t: "Remera Oversize", p: "$45.000", ahorro: "$40.500 por transferencia · Ahorrás $4.500" },
      ],
      responde: "Respondé A o B 💬",
    },
    {
      archivo: "1102-2", tipo: "punto", num: "TIP DEL DÍA", titulo: 'Decí <span class="verde">cuándo llega</span>',
      mal: "“Envíos a todo el país.”", bien: "“Pedí hoy y te llega entre el martes y el jueves.”",
      texto: "Una fecha concreta saca la duda que frena la compra.",
    },
    nuevo("1102-3", "Nuevo reel · La respuesta", 'Tu mejor precio está <span class="verde">escondido</span>', "¿Votaste A o B? En el reel está la respuesta y por qué."),

    // Mar 3/11 · post: qué hace Nevux
    {
      archivo: "1103-1", tipo: "punto", num: "RESPUESTA DE AYER", titulo: 'Vende más la <span class="verde">B</span>',
      texto: "Mismo precio, mismo descuento. Pero en la B el ahorro se ve: <b>“Ahorrás $4.500”</b>.<br><br>Para el cerebro, perder duele más que ganar. Mostrar lo que se ahorra pesa más que un porcentaje.",
      pie: "Aversión a la pérdida",
    },
    {
      archivo: "1103-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA", titulo: 'El primer número <span class="verde">manda</span>',
      texto: "El primer precio que ve tu cliente se vuelve la referencia de todo lo demás. Se llama <b>anclaje</b>.<br><br>Por eso en un pack conviene mostrar primero el precio de 1 unidad, y después cuánto ahorra llevando 2.",
      pie: "Anclaje",
    },
    nuevo("1103-3", "Nuevo post", '¿Qué hace Nevux en <span class="verde">tu tienda</span>?', "Te lo explico fácil, pieza por pieza. 🧩"),

    // Mié 4/11 · post: antes y después
    {
      archivo: "1104-1", tipo: "portada", eyebrow: "Contame",
      titulo: '¿Qué es lo que <span class="verde">más te frena</span> con tu tienda?',
      sub: "Pocas visitas, visitas que no compran, ventas de a uno, poco tiempo… Contame por mensaje y te respondo con una idea concreta.",
      responde: "Escribime 💬",
    },
    {
      archivo: "1104-2", tipo: "portada", eyebrow: "Hoy 19:30",
      titulo: 'El antes y después de una <span class="verde">ficha real</span>',
      sub: "Misma tienda, mismo producto, mismo precio. Activá las notificaciones para no perdértelo. 🔔",
    },
    nuevo("1104-3", "Nuevo post", 'Mismo producto. <span class="verde">Otra ficha.</span>', "Deslizá y mirá qué cambió (y por qué funciona)."),

    // Jue 5/11 · reel: packs
    {
      archivo: "1105-1", tipo: "mito", eyebrow: "Mito o realidad", titulo: "Urgencia que vende",
      mito: "Poné un contador de “quedan 2” en todos los productos, que vende más.",
      realidad: "La escasez funciona solo si es real. Si la inventás, el cliente se da cuenta y no vuelve.",
      texto: "Influir con la verdad es venta. Con mentiras, es manipulación.",
    },
    {
      archivo: "1105-2", tipo: "punto", num: "PSICOLOGÍA DE VENTA", titulo: 'Hacemos lo que <span class="verde">otros hacen</span>',
      texto: "Reseñas, “el más elegido”, fotos de clientes: ver que otros ya compraron baja el miedo a equivocarse. Se llama <b>prueba social</b>.<br><br>Funciona solo si es verdad. Una reseña inventada se nota.",
      pie: "Prueba social",
    },
    nuevo("1105-3", "Nuevo reel", 'La misma visita puede valer <span class="verde">el doble</span>', "Caso real de Hogar Digital: cómo un pack sube el ticket un 70%."),

    // Vie 6/11 · post: cómo trabajamos
    {
      archivo: "1106-1", tipo: "cta", eyebrow: "Análisis gratis",
      titulo: '¿Querés que mire <span class="verde">tu ficha</span>?',
      texto: "Mandame por mensaje el link de tu tienda y te digo 3 cosas concretas que cambiaría. Gratis y sin compromiso.",
      responde: "Mandame el link 💬",
    },
    {
      archivo: "1106-2", tipo: "portada", eyebrow: "Hoy 19:30",
      titulo: '¿Cómo es trabajar <span class="verde">con Nevux</span>?',
      sub: "Los 3 pasos, y las 2 dudas que más nos hacen. Spoiler: vos no tocás nada.",
    },
    nuevo("1106-3", "Nuevo post", 'Cómo trabajamos, <span class="verde">paso a paso</span>', "Del análisis gratis a tu ficha funcionando, en 3 pasos."),
  ],
};
