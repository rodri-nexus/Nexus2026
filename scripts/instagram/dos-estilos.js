// Miércoles 25/11 de @nevux.app: dos rubros, dos estilos. Hogar Digital en vivo y Perfumez con su configuración cargada solo
// en el navegador de prueba (su tienda se prende cuando paga, principios de diciembre: por eso "así va a quedar").
// Uso: node scripts/instagram/generar-casos.js dos-estilos   (las fotos se leen como casos/<ruta>.jpg)
const HASHTAGS = "#tiendanube #emprendedoresargentinos #tiendaonline #ecommerceargentina #ventasonline #emprender";
const HD = "../capturas/hd-vivo/", PZ = "../capturas/perfumez/";
module.exports = {
  carpeta: "17-dos-estilos",
  placas: [
    { ancho: true, tipo: "dos", eyebrow: "Dos rubros · Dos estilos", titulo: 'Tecnología y perfumes. <span class="verde">Otra cara, la misma idea.</span>', sub: "Hogar Digital, en vivo. Perfumez, así va a quedar. Deslizá →",
      fotos: [[HD + "home-1", "HOGAR DIGITAL"], [PZ + "home-1", "PERFUMEZ"]] },
    { ancho: true, tipo: "split", eyebrow: "Hogar Digital · Tecnología", titulo: 'Azul, <span class="verde">claro y moderno</span>', foto: HD + "home-2",
      lista: ["Fotos de ambiente en la portada", "Cinta con envíos, garantía y WhatsApp", "Sus números reales y su local en Campana"] },
    { ancho: true, tipo: "split", eyebrow: "Perfumez · Perfumes árabes", titulo: 'Negro y dorado, <span class="verde">de lujo</span>', foto: PZ + "home-3",
      lista: ["Logo dorado que gira en la cabecera", "Elegís por estilo: hombre, mujer o unisex", "Marcas árabes reales, con su caja"] },
    { ancho: true, tipo: "dos", eyebrow: "La ficha", titulo: 'Cada ficha, <span class="verde">con lo de su rubro</span>', sub: "Hogar Digital: cuándo sale el pedido. Perfumez: cómo huele cada perfume.",
      fotos: [[HD + "combo/3", "HORA DE CORTE"], [PZ + "tt-1", "CÓMO HUELE"]] },
    { ancho: true, tipo: "dos", eyebrow: "Lo que no cambia", titulo: 'En las dos, <span class="verde">el precio claro</span>', sub: "Precio, cuánto ahorra y cuándo le llega, sin que tenga que preguntar.",
      fotos: [[HD + "combo/2", "HOGAR DIGITAL"], [PZ + "fx-2", "PERFUMEZ"]] },
    { tipo: "cta", eyebrow: "Análisis gratis", titulo: '¿Cómo quedaría <span class="verde">la tuya</span>?',
      texto: 'Cada tienda con su estilo y sus datos reales. Comentá <span class="palabra">FICHA</span> y te muestro cómo quedaría la tuya.' },
  ],
  caption: `Dos rubros. Dos estilos. La misma idea 👇

🏠 Hogar Digital (@hogardigitaltiendaonline) · tecnología y hogar
Azul, claro y moderno. Fotos de ambiente en la portada, sus números reales, su local en Campana y una ficha que dice cuándo sale el pedido. En vivo.

🖤 Perfumez (@perfumez_2026) · perfumes árabes
Negro y dorado, de lujo. Logo que gira, categorías por estilo y una ficha que cuenta cómo huele cada perfume. Así va a quedar su tienda (la estamos terminando).

Lo que no cambia: el precio claro, cuánto ahorra y cuándo le llega, sin que tenga que preguntar.

Cada tienda con su estilo y sus datos reales.
✅ Sin apps
✅ Sin cambiar de plantilla

👉 ¿Cómo quedaría la tuya? Comentá FICHA y te la muestro.

${HASHTAGS}`,
};
