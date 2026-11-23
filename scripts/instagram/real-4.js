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
];
