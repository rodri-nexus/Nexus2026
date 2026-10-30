// Semana 1 de @nevux.app: las 3 publicaciones que quedan fijadas arriba del perfil.
// Cada placa usa un tipo de plantilla.html. "texto" admite <b>; "titulo" admite <span class="verde">.

const HASHTAGS = "#tiendanube #emprendedoresargentinos #tiendaonline #ecommerceargentina #ventasonline #emprender";

module.exports = [
  {
    carpeta: "01-errores-ficha",
    nombre: "5 errores de la ficha que te cuestan ventas",
    placas: [
      {
        tipo: "portada",
        eyebrow: "Para dueños de Tiendanube",
        titulo: 'Tu tienda tiene visitas. <span class="verde">¿Por qué no vende?</span>',
        sub: "5 errores de la ficha de producto que te están costando ventas (y cómo arreglarlos).",
      },
      {
        tipo: "punto",
        num: "ERROR 1",
        titulo: "Escondés tu mejor precio",
        texto: "Si das descuento por transferencia y aparece en letra chiquita, <b>nadie lo ve</b>.",
        mal: "“10% OFF con transferencia” abajo de todo, en gris.",
        bien: "“$40.500 pagando por transferencia · Ahorrás $4.500”, grande y al lado del precio.",
      },
      {
        tipo: "punto",
        num: "ERROR 2",
        titulo: "No decís cuándo llega",
        texto: "“Envío a todo el país” no saca la duda. <b>Una fecha concreta, sí.</b>",
        mal: "“Hacemos envíos a todo el país.”",
        bien: "“Pedí hoy y te llega entre el martes y el jueves.”",
      },
      {
        tipo: "punto",
        num: "ERROR 3",
        titulo: "Vendés de a una unidad",
        texto: "Si nadie le propone llevar más, se lleva uno. <b>La misma visita puede valer el doble.</b>",
        bien: "“Llevá 2 con 15% OFF.” Y cargá la promo en Tiendanube para que el carrito cobre lo mismo que muestra la ficha.",
      },
      {
        tipo: "punto",
        num: "ERROR 4",
        titulo: "El botón de compra se pierde",
        texto: "En el celular, la persona baja a leer la descripción y <b>el botón queda arriba</b>. Cuando se decide, tiene que volver a buscarlo.",
        bien: "Un botón de compra fijo abajo de la pantalla, que la acompaña todo el recorrido.",
      },
      {
        tipo: "punto",
        num: "ERROR 5",
        titulo: "La confianza no está a la vista",
        texto: "Si para enterarse tiene que entrar a otra página, para ella no existe.",
        lista: ["Cuotas sin interés", "Cambios y devoluciones", "Compra protegida", "Ayuda por WhatsApp"],
      },
      {
        tipo: "punto",
        num: "BONUS",
        titulo: 'No inventes <span class="verde">nada</span>',
        texto: "Contadores de stock falsos, “23 personas mirando esto”, reseñas que nadie escribió. <b>La gente se da cuenta, y no vuelve.</b><br><br>Urgencia real, o ninguna.",
      },
      {
        tipo: "cta",
        ultima: true,
        eyebrow: "Análisis gratis",
        titulo: '¿Cuáles le faltan a <span class="verde">tu ficha</span>?',
        texto: 'Comentá <span class="palabra">FICHA</span> y te mando por mensaje qué cambiaría en la tuya. Gratis y sin compromiso.',
      },
    ],
    caption: `Tu tienda tiene visitas. Entonces, ¿por qué no vende? 🤔

Hay algo que casi nadie te cuenta: la persona que entra a tu ficha decide en segundos, y decide con la emoción. Primero siente ("lo quiero" o "no me convence") y recién después busca razones lógicas para justificarlo. En psicología del consumidor se lo llama Sistema 1 y Sistema 2. Si tu ficha no gana en esos primeros segundos, la lógica nunca llega a rescatarte.

Por eso no alcanza con un buen producto y una buena foto: la ficha tiene que sacar las dudas antes de que aparezcan.

1️⃣ El precio por transferencia está escondido → si no ve el ahorro, para ella no existe.
2️⃣ No decís cuándo llega → la incertidumbre también es un costo, aunque no sea plata.
3️⃣ Vendés de a uno → nadie le propuso llevar dos.
4️⃣ El botón se pierde en el celular → cuando se decide, no lo encuentra.
5️⃣ La confianza no está a la vista → cuotas, cambios y compra protegida.

💡 Tenelo en cuenta: valor percibido = beneficios − costos. Y los costos no son solo el precio: también son la duda, el miedo a equivocarse y el tiempo. Cada error de esta lista suma un costo invisible.

⚠️ El bonus, que para nosotros es una regla: no inventes nada. Stock falso, "23 personas mirando esto", reseñas truchas. Persuadir con mentiras es manipulación: el cliente se siente estafado y no vuelve.

👉 Comentá FICHA y te mando por mensaje cuáles de estos errores tiene tu tienda. Gratis y sin compromiso.
📌 Guardalo para revisar tu ficha con calma.

${HASHTAGS}`,
  },
  {
    carpeta: "02-antes-despues",
    nombre: "Mismo producto, otra ficha",
    placas: [
      {
        tipo: "doble",
        titulo: 'Mismo producto. Mismo precio. <span class="verde">Otra ficha.</span>',
        antes: "../../public/landing/caso-antes.jpg",
        despues: "../../public/landing/caso-despues.jpg",
      },
      {
        tipo: "foto",
        clase: "antes",
        etiqueta: "ANTES",
        titulo: "Precio, botón y poco más",
        img: "../../public/landing/caso-antes.jpg",
      },
      {
        tipo: "foto",
        clase: "despues",
        etiqueta: "CON NEVUX",
        titulo: "Todo lo que necesita para decidir",
        img: "../../public/landing/caso-despues.jpg",
      },
      {
        tipo: "punto",
        titulo: 'Qué <span class="verde">cambió</span>',
        texto: "Caso real de una tienda de tecnología. Misma plantilla, mismo precio.",
        lista: [
          "El ahorro por transferencia, grande",
          "Packs Llevá 2 y Llevá 3 que cambian el carrito",
          "Cuotas, envío y compra protegida a la vista",
          "Botón de compra fijo mientras baja",
        ],
      },
      {
        tipo: "cta",
        ultima: true,
        eyebrow: "Sin apps · Sin cambiar de plantilla",
        titulo: '¿Querés ver cómo quedaría <span class="verde">la tuya</span>?',
        texto: 'Escribinos <span class="palabra">ANÁLISIS</span> por mensaje y te decimos qué cambiar en tu ficha.',
      },
    ],
    caption: `Mismo producto. Mismo precio. Misma plantilla. Otra ficha. 👀

Deslizá y mirá el antes y el después de una tienda de tecnología con la que trabajamos.

En el "antes" está lo básico: foto, precio y botón. ¿Qué falta? Lo que la persona necesita sentir para animarse. Porque nadie compra un parlante: compra la tranquilidad de no equivocarse con su plata, la seguridad de que le va a llegar y el gusto de haber hecho una buena compra.

Qué cambió en el "después", y por qué funciona:

✅ El ahorro por transferencia, grande → el primer número que ve funciona como ancla: todo lo demás se compara contra eso.
✅ Packs Llevá 2 y Llevá 3 → la misma visita deja un ticket más alto, y el cliente siente que gana.
✅ Cuotas, envío y compra protegida a la vista → baja el miedo a equivocarse. Para el cerebro, perder duele más que ganar.
✅ Botón de compra fijo → cuando se decide, lo tiene a mano.

La clave es el orden en que le hablás: primero la emoción (lo quiero), después la lógica (precio, cuotas, envío) y al final lo social (otros ya compraron).

Sin apps y sin cambiar de plantilla: una línea de código en tu Tiendanube.

👉 Escribinos ANÁLISIS por mensaje y te decimos qué cambiar en la tuya.

${HASHTAGS}`,
  },
  {
    carpeta: "03-la-cuenta",
    nombre: "La cuenta que nadie hace",
    placas: [
      {
        tipo: "portada",
        eyebrow: "Antes de pagar más anuncios",
        titulo: 'Hacé esta cuenta. <span class="verde">Te va a cambiar la cabeza.</span>',
        sub: "Tu problema puede no ser el tráfico.",
      },
      {
        tipo: "numero",
        eyebrow: "Supongamos",
        grande: "3.000",
        chico: "visitas por mes en tu tienda",
        texto: "De cada 100 visitas, compra 1. Es un valor habitual en tiendas online.",
      },
      {
        tipo: "numero",
        eyebrow: "Hoy",
        grande: "30",
        chico: "ventas por mes",
        texto: "Con un ticket promedio de $35.000, son <b>$1.050.000</b> por mes.",
      },
      {
        tipo: "numero",
        eyebrow: "Si de cada 200 visitas compra 1 persona más…",
        grande: "+15",
        verde: true,
        chico: "ventas por mes",
        texto: "<b>+$525.000 por mes. Con las mismas visitas.</b> Sin gastar un peso más en anuncios.",
      },
      {
        tipo: "punto",
        titulo: 'Más visitas no arreglan <span class="verde">una ficha que no convence</span>',
        texto: "Si la ficha no responde las dudas, cada visita nueva que pagás se va igual que las anteriores.<br><br><b>Primero la ficha. Después el tráfico.</b>",
      },
      {
        tipo: "cta",
        ultima: true,
        eyebrow: "Calculadora gratis",
        titulo: 'Hacé la cuenta con <span class="verde">tus números</span>',
        texto: "Entrá a nevux.ar (link en el perfil). Es una cuenta, no una promesa: depende de tu producto, tu precio y tu tráfico.",
        boton: "nevux.ar",
      },
    ],
    caption: `¿Cuánto te deja cada visita que pagás? Hacé esta cuenta antes de subir el presupuesto de anuncios 👇

📊 3.000 visitas por mes. De cada 100, compra 1 → 30 ventas.
💵 Ticket promedio de $35.000 → $1.050.000 por mes.

Ahora, una sola pregunta: ¿y si de cada 200 visitas comprara 1 persona más?
→ 45 ventas en lugar de 30.
→ +$525.000 por mes. Con las mismas visitas y sin gastar un peso más en anuncios.

Toda venta online sigue el mismo camino: la persona ve tu contenido o tu anuncio → hace clic → llega a tu tienda → decide. Podés tener el mejor anuncio del mundo, pero si la vidriera (tu ficha) no convence, la venta se pierde ahí.

Antes de pagar más tráfico, hacete 3 preguntas:
1. ¿Cuántas personas entraron este mes?
2. ¿Cuántas compraron?
3. ¿Qué vio el resto antes de irse?

Si la tercera no tiene respuesta, ahí está la plata que estás dejando sobre la mesa. Y cada mes que pasa sin cambiarlo, esas ventas no vuelven.

👉 Hacé la cuenta con tus números en la calculadora de nevux.ar (link en el perfil).
Es una cuenta, no una promesa: el resultado depende de tu producto, tu precio y tu tráfico.

📌 Guardalo y hacé la cuenta a fin de mes.

${HASHTAGS}`,
  },
];
