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
    caption: `Tu tienda tiene visitas, pero no vende lo que debería. Casi nunca es el producto: es lo que la persona ve en la ficha en el momento en que decide.

Los 5 errores que más vemos en fichas de Tiendanube:

1. El precio por transferencia está escondido
2. No dice cuándo llega el pedido
3. Solo se vende de a una unidad
4. El botón de compra se pierde en el celular
5. La confianza (cuotas, cambios, compra protegida) no está a la vista

Y un bonus: no inventes nada. Urgencia real, o ninguna.

👉 Comentá FICHA y te mando por mensaje qué cambiaría en la tuya. Gratis.

Guardalo para revisar tu tienda con calma.

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
    caption: `Mismo producto. Mismo precio. Misma plantilla de Tiendanube. Otra ficha.

Deslizá para ver el antes y el después de una tienda de tecnología con la que trabajamos.

Qué cambió:
✅ El ahorro por transferencia, grande y al lado del precio
✅ Packs Llevá 2 y Llevá 3 que cambian la cantidad del carrito
✅ Cuotas, envío y compra protegida a la vista
✅ Botón de compra fijo mientras la persona baja por la ficha

Sin apps, sin cambiar de plantilla: una línea de código.

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
    caption: `La cuenta que casi nadie hace antes de subir el presupuesto de anuncios 👇

3.000 visitas por mes. De cada 100, compra 1 → 30 ventas.
Ticket promedio de $35.000 → $1.050.000 por mes.

Si de cada 200 visitas comprara 1 persona más → +15 ventas.
Son +$525.000 por mes, con las mismas visitas.

Más tráfico no arregla una ficha que no convence. Primero la ficha, después los anuncios.

👉 Hacé la cuenta con tus números en nevux.ar (link en el perfil).

Es una cuenta, no una promesa: el resultado depende de tu producto, tu precio y tu tráfico.

${HASHTAGS}`,
  },
];
