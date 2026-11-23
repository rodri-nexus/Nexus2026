// Semana del 23 al 29/11 de @nevux.app. Clientes: Hogar Digital (en vivo) y Perfumez (cliente nuevo, Lorenzo).
// Perfumez todavía no está prendida (se prende sola cuando paga el Premium, principios de diciembre): sus capturas se sacan
// con su configuración de lib/clientes.ts cargada solo en el navegador de prueba, sobre su tienda real
// (perfumes405.mitiendanube.com). Por eso los textos dicen "así va a quedar". Valmont no se muestra: tiene réplicas cargadas.
// Uso: node scripts/instagram/generar.js real-4
const HASHTAGS = "#tiendanube #emprendedoresargentinos #tiendaonline #ecommerceargentina #ventasonline #emprender";
const Z = "capturas/perfumez/";
const f = (etiqueta, titulo, img) => ({ tipo: "foto", clase: "despues", etiqueta, titulo, img });

module.exports = [
  {
    carpeta: "16-cliente-perfumez",
    nombre: "Cliente nuevo: Perfumez",
    placas: [
      f("CLIENTE NUEVO", 'Bienvenido, <span class="verde">Perfumez</span>', Z + "home-1.jpg"),
      {
        tipo: "punto", num: "QUIÉN ES",
        titulo: 'Perfumes árabes <span class="verde">de 100 ml</span>',
        texto: "Armaf, Afnan y Lattafa, con su frasco y su caja.<br><br>Eligió el Premium en negro y dorado. <b>Así va a quedar su tienda</b>, con sus productos y sus precios reales.",
      },
      f("1 · ELEGÍ POR ESTILO", "Hombre, mujer o unisex", Z + "home-3.jpg"),
      f("2 · UN PERFUME EN TRES TIEMPOS", "Salida, corazón y fondo, sobre el frasco", Z + "tt-1.jpg"),
      f("3 · LA FICHA", "Precio, ahorro y cuándo le llega", Z + "fx-2.jpg"),
      f("4 · MIRALO DE CERCA", "Fotos del frasco original", Z + "fx-3.jpg"),
      f("5 · COMPRÁ TRANQUILO", "Marcas reales, envío protegido y atención", Z + "fx-4.jpg"),
      {
        tipo: "cta", ultima: true, eyebrow: "Otro rubro, la misma idea",
        titulo: 'Que sepa qué compra, <span class="verde">cuánto paga y cuándo llega</span>',
        texto: 'Comentá <span class="palabra">FICHA</span> y te muestro cómo quedaría la tuya.',
      },
    ],
    caption: `🖤 Cliente nuevo: Perfumez (@perfumez_2026), perfumes árabes de 100 ml.

Armaf, Afnan y Lattafa, con su frasco y su caja. Eligió el plan Premium en negro y dorado, y así va a quedar su tienda (la estamos terminando), con sus productos y precios reales 👇

1️⃣ Elegí por estilo: hombre, mujer o unisex.
2️⃣ Un perfume en tres tiempos: salida, corazón y fondo, marcados sobre el frasco.
3️⃣ La ficha: precio, cuánto ahorra, cuándo despacha y entre qué días le llega.
4️⃣ Miralo de cerca: fotos del frasco original.
5️⃣ Comprá tranquilo: marcas reales, envío protegido y atención por WhatsApp.

Otro rubro, la misma idea: que quien entra sepa qué compra, cuánto paga y cuándo le llega.

✅ Sin apps
✅ Sin cambiar de plantilla

👉 ¿Querés tu tienda así? Comentá FICHA y te muestro cómo quedaría la tuya.

${HASHTAGS} #perfumesarabes`,
  },
  {
    carpeta: "18-black-friday-margen",
    nombre: "Black Friday sin regalar margen",
    placas: [
      { tipo: "portada", eyebrow: "Black Friday · 27/11", titulo: 'Black Friday <span class="verde">sin regalar margen</span>', sub: "3 ideas para vender más sin bajar todo el catálogo. Con ejemplos reales de Hogar Digital." },
      {
        tipo: "punto", num: "1 · DESCUENTO POR TRANSFERENCIA",
        titulo: 'Un ahorro <span class="verde">que también te conviene</span>',
        texto: "Un % OFF pagando con transferencia: quien compra ahorra, y vos <b>te ahorrás la comisión del medio de pago</b>.",
      },
      f("EJEMPLO REAL · HOGAR DIGITAL", "10% con transferencia, a la vista", "capturas/hd-vivo/combo/bf-2.jpg"),
      {
        tipo: "punto", num: "2 · LLEVÁ MÁS, PAGÁ MENOS",
        titulo: 'Descuento <span class="verde">a cambio de más compra</span>',
        texto: "15% llevando 2, 25% llevando 3.<br><br>El descuento aparece <b>solo si el pedido crece</b>.",
      },
      {
        tipo: "punto", num: "3 · COMBOS DE TEMPORADA",
        titulo: 'Un precio para <span class="verde">varios productos</span>',
        texto: "Armá un combo con lo que ya tenés en stock y dale un precio especial.<br><br>Movés mercadería <b>sin bajar cada producto por separado</b>.",
      },
      f("EJEMPLO REAL · HOGAR DIGITAL", "Su Combo Navideño, armado con su stock", "capturas/hd-vivo/combo/bf-1.jpg"),
      {
        tipo: "cta", ultima: true, eyebrow: "Sin apps · Sin cambiar de plantilla",
        titulo: 'Que tu tienda <span class="verde">lo muestre así</span>',
        texto: 'Cargás la promo en Tiendanube y Nevux la muestra en cada ficha. Comentá <span class="palabra">FICHA</span> y te digo cómo quedaría en la tuya.',
      },
    ],
    caption: `🖤 Black Friday sin regalar margen: 3 ideas para vender más sin bajar todo el catálogo 👇

1️⃣ Descuento por transferencia
Quien compra ahorra, y vos te ahorrás la comisión del medio de pago.
Ejemplo real: Hogar Digital (@hogardigitaltiendaonline) muestra el 10% con transferencia en cada ficha, con cuánto ahorra.

2️⃣ Llevá más, pagá menos
15% llevando 2, 25% llevando 3. El descuento aparece solo si el pedido crece.

3️⃣ Combos de temporada
Armá un combo con lo que ya tenés en stock y dale un precio especial. Movés mercadería sin bajar cada producto por separado.
Ejemplo real: el Combo Navideño de Hogar Digital.

Ojo: cada promo tiene que estar cargada en Tiendanube, así el carrito cobra lo mismo que muestra la ficha.

👉 ¿Querés que tu tienda lo muestre así? Comentá FICHA y te digo cómo quedaría en la tuya.

${HASHTAGS} #blackfriday`,
  },
  {
    carpeta: "19-noviembre",
    nombre: "Noviembre en Nevux",
    placas: [
      { tipo: "portada", eyebrow: "Resumen del mes", titulo: 'Noviembre <span class="verde">en Nevux</span>', sub: "Lo que armamos este mes, con tiendas reales. Deslizá →" },
      f("HOGAR DIGITAL · EN VIVO", "Premium en azul, en vivo desde el 9/11", "capturas/hd-vivo/home-1.jpg"),
      {
        tipo: "punto", num: "LO QUE SUMAMOS EN HOGAR DIGITAL",
        titulo: 'De la home <span class="verde">al carrito</span>',
        lista: ["Ficha con precio por transferencia, hora de corte y garantías", "Carrito con cuenta regresiva y formas de pago", "Sus propios Reels en la home", "Todo el catálogo en la home, con filtros"],
      },
      f("PERFUMEZ · CLIENTE NUEVO", "Premium en negro y dorado", Z + "home-1.jpg"),
      {
        tipo: "punto", num: "LO QUE ARMAMOS PARA PERFUMEZ",
        titulo: 'Para vender <span class="verde">lo que no se puede oler</span>',
        lista: ["Elegí por estilo: hombre, mujer o unisex", "Cómo huele: salida, corazón y fondo", "Cuándo despacha y entre qué días llega", "Listo para regalar, en su caja"],
      },
      {
        tipo: "punto", num: "LO QUE APRENDIMOS",
        titulo: 'Cada rubro <span class="verde">cuenta algo distinto</span>',
        lista: ["Tecnología: cuándo llega y qué garantía tiene", "Perfumes: cómo huele y si viene para regalar", "En todos: precio claro y nada inventado"],
      },
      {
        tipo: "cta", ultima: true, eyebrow: "Para diciembre",
        titulo: '¿Tu tienda <span class="verde">es la próxima</span>?',
        texto: 'Si querés llegar a Navidad con tu tienda lista, comentá <span class="palabra">FICHA</span> y empezamos por el análisis gratis.',
      },
    ],
    caption: `📅 Noviembre en Nevux: lo que armamos este mes, con tiendas reales 👇

🏠 Hogar Digital (@hogardigitaltiendaonline) · en vivo desde el 9/11
Premium en azul. Le sumamos una ficha con precio por transferencia, hora de corte y garantías; un carrito con cuenta regresiva y formas de pago; sus propios Reels en la home y todo el catálogo con filtros.

🖤 Perfumez (@perfumez_2026) · cliente nuevo
Premium en negro y dorado, para vender lo que no se puede oler: elegí por estilo, cómo huele cada perfume, cuándo llega y listo para regalar. Así va a quedar su tienda (la estamos terminando).

Lo que aprendimos: cada rubro necesita contar algo distinto. Tecnología, cuándo llega y qué garantía tiene. Perfumes, cómo huele y si viene para regalar. En todos: precio claro y nada inventado.

👉 ¿Tu tienda es la próxima? Si querés llegar a Navidad con tu tienda lista, comentá FICHA y empezamos por el análisis gratis.

${HASHTAGS}`,
  },
];
