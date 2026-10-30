// Historias de la semana 1 (30/10 al 6/11). Archivo = MMDD-1 (se publica a las 12:17) y MMDD-2 (a las 19:47, después del post del día).
// Instagram no deja agregar encuestas ni stickers desde afuera de la app: las historias piden la respuesta por mensaje.

module.exports = {
  historias: [
    // Vie 30/10, después del carrusel de las 19:30
    {
      archivo: "1030-2",
      tipo: "cta",
      eyebrow: "Nuevo post",
      titulo: '5 errores de la ficha que te <span class="verde">cuestan ventas</span>',
      texto: "¿Cuántos tiene tu tienda? Entrá al perfil y fijate.",
      boton: "Ver el post en el perfil",
      pie: "@nevux.app",
    },

    // Sáb 31/10
    {
      archivo: "1031-1",
      tipo: "portada",
      eyebrow: "Pregunta rápida",
      titulo: '¿Tu tienda tiene visitas pero <span class="verde">vende poco</span>?',
      sub: "Contestame por mensaje con un SÍ o un NO. Leo todas.",
      responde: "Respondé SÍ o NO 💬",
    },
    {
      archivo: "1031-2",
      tipo: "punto",
      num: "PSICOLOGÍA DE VENTA",
      titulo: 'Tu cliente decide <span class="verde">en segundos</span>',
      texto: "Primero siente (“lo quiero” o “no me convence”) y <b>después</b> busca razones para justificarlo.<br><br>Si tu ficha no gana en esos primeros segundos, la lógica nunca llega a rescatarte.",
      pie: "Sistema 1 y Sistema 2",
    },

    // Dom 1/11
    {
      archivo: "1101-1",
      tipo: "mito",
      eyebrow: "Mito o realidad",
      titulo: "Lo que todos te dicen",
      mito: "Para vender más necesito más seguidores y más anuncios.",
      realidad: "Si la ficha no convence, cada visita nueva se va igual que las anteriores. Primero la ficha, después el tráfico.",
    },
    {
      archivo: "1101-2",
      tipo: "numero",
      eyebrow: "Hacé la cuenta",
      grande: "+15",
      verde: true,
      chico: "ventas por mes, con las mismas visitas",
      texto: "3.000 visitas · ticket de $35.000 · si de cada 200 visitas compra 1 más: <b>+$525.000 por mes</b>.<br><br><b>Calculadora con tus números en nevux.ar</b>",
      pie: "Es una cuenta, no una promesa",
    },

    // Lun 2/11
    {
      archivo: "1102-1",
      tipo: "ab",
      eyebrow: "Juguemos",
      titulo: '¿Cuál <span class="verde">vende más</span>?',
      opciones: [
        { t: "Remera Oversize", p: "$45.000", chiq: "10% OFF con transferencia" },
        { t: "Remera Oversize", p: "$45.000", ahorro: "$40.500 por transferencia · Ahorrás $4.500" },
      ],
      responde: "Respondé A o B 💬",
    },
    {
      archivo: "1102-2",
      tipo: "punto",
      num: "TIP DEL DÍA",
      titulo: 'Decí <span class="verde">cuándo llega</span>',
      mal: "“Envíos a todo el país.”",
      bien: "“Pedí hoy y te llega entre el martes y el jueves.”",
      texto: "Una fecha concreta saca la duda que frena la compra.",
    },

    // Mar 3/11
    {
      archivo: "1103-1",
      tipo: "punto",
      num: "RESPUESTA",
      titulo: 'Vende más la <span class="verde">B</span>',
      texto: "Mismo precio, mismo descuento. Pero en la B el ahorro se ve: <b>“Ahorrás $4.500”</b>.<br><br>Para el cerebro, perder duele más que ganar. Mostrar lo que se ahorra pesa más que mostrar un porcentaje.",
      pie: "Aversión a la pérdida",
    },
    {
      archivo: "1103-2",
      tipo: "punto",
      num: "PSICOLOGÍA DE VENTA",
      titulo: 'El primer número <span class="verde">manda</span>',
      texto: "El primer precio que ve tu cliente se vuelve la referencia de todo lo demás. Se llama <b>anclaje</b>.<br><br>Por eso en un pack conviene mostrar primero el precio de 1 unidad, y después cuánto ahorra llevando 2.",
      pie: "Anclaje",
    },

    // Mié 4/11
    {
      archivo: "1104-1",
      tipo: "portada",
      eyebrow: "Hoy 19:30",
      titulo: 'El antes y después de una <span class="verde">ficha real</span>',
      sub: "Misma tienda, mismo producto, mismo precio. Activá las notificaciones para no perdértelo.",
    },
    {
      archivo: "1104-2",
      tipo: "cta",
      eyebrow: "Nuevo post",
      titulo: 'Mismo producto. <span class="verde">Otra ficha.</span>',
      texto: "Deslizá el post y mirá qué cambió.",
      boton: "Ver el post en el perfil",
      pie: "@nevux.app",
    },

    // Jue 5/11
    {
      archivo: "1105-1",
      tipo: "mito",
      eyebrow: "Mito o realidad",
      titulo: "Urgencia que vende",
      mito: "Poné un contador de “quedan 2” en todos los productos, que vende más.",
      realidad: "La escasez funciona solo si es real. Si la inventás, el cliente se da cuenta y no vuelve.",
      texto: "Influir con la verdad es venta. Con mentiras, es manipulación.",
    },
    {
      archivo: "1105-2",
      tipo: "cta",
      eyebrow: "Análisis gratis",
      titulo: '¿Querés que mire <span class="verde">tu ficha</span>?',
      texto: "Mandame por mensaje el link de tu tienda y te digo 3 cosas concretas que cambiaría. Gratis y sin compromiso.",
      responde: "Mandame el link 💬",
    },

    // Vie 6/11
    {
      archivo: "1106-1",
      tipo: "portada",
      eyebrow: "Hoy 19:30",
      titulo: '¿Cuánto te deja <span class="verde">cada visita</span>?',
      sub: "La cuenta que casi nadie hace antes de subir el presupuesto de anuncios.",
    },
    {
      archivo: "1106-2",
      tipo: "cta",
      eyebrow: "Nuevo post",
      titulo: 'Hacé <span class="verde">la cuenta</span>',
      texto: "Y después probala con tus números en la calculadora de nevux.ar.",
      boton: "Ver el post en el perfil",
      pie: "@nevux.app",
    },
  ],
};
