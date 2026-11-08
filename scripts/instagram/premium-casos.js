// Miércoles 4/11 de @nevux.app: las dos tiendas Premium tal como están hoy (capturas reales del 02/11).
// Valmont: solo secciones sin productos (su catálogo tiene réplicas de marcas: no se muestran).
const HASHTAGS = "#tiendanube #emprendedoresargentinos #tiendaonline #ecommerceargentina #ventasonline #emprender";
module.exports = {
  carpeta: "07-premium",
  placas: [
    { tipo: "dos", eyebrow: "Plan Premium · Casos reales", titulo: 'Dos tiendas. <span class="verde">Dos estilos.</span>', sub: "Tecnología y relojería. Así quedaron con Nevux. Deslizá →",
      fotos: [["hd-portada", "HOGAR DIGITAL"], ["vm-portada", "VALMONT & CO."]] },
    { tipo: "split", eyebrow: "Hogar Digital · Tecnología", titulo: 'Una portada de <span class="verde">marca grande</span>', foto: "hd-portada",
      lista: ["Cabecera flotante que se vuelve de vidrio al bajar", "Cinta con envíos, garantía y WhatsApp", "Fotos reales de sus productos", "Beneficios con íconos que se dibujan solos"] },
    { tipo: "split", eyebrow: "Hogar Digital · Tecnología", titulo: 'Categorías que <span class="verde">se mueven</span>', foto: "hd-outfit",
      lista: ["“Encontrá lo tuyo”: la categoría cambia mientras bajás", "Comunidad con cuadros de sus propios videos", "Todo con los productos y precios de su tienda"] },
    { tipo: "dos", eyebrow: "Hogar Digital · Tecnología", titulo: 'Confianza con <span class="verde">datos reales</span>', sub: "Sus números de verdad y su local con mapa y horario.",
      fotos: [["hd-numeros", "NÚMEROS QUE SUBEN"], ["hd-local", "LOCAL CON MAPA"]] },
    { tipo: "split", eyebrow: "Hogar Digital · La ficha", titulo: 'Una ficha que <span class="verde">saca las dudas</span>', foto: "hd-precio",
      lista: ["Precio de lista, % OFF y precio final, claros", "Cuándo sale el pedido, con la hora de corte real", "Cambios, atención y garantía a la vista", "Botón de compra que siempre se ve"] },
    { tipo: "dos", eyebrow: "Valmont & Co. · Relojería", titulo: 'Otro rubro, <span class="verde">otro estilo</span>', sub: "Logo que gira en 3D, hora oficial en vivo y “Por qué Valmont” en etiquetas colgadas.",
      fotos: [["vm-portada", "PORTADA"], ["vm-porque", "POR QUÉ VALMONT"]] },
    { tipo: "cta", eyebrow: "Análisis gratis", titulo: '¿Cómo quedaría <span class="verde">la tuya</span>?',
      texto: 'Comentá <span class="palabra">FICHA</span> y te mando qué cambiaría en tu tienda. Sin apps y sin cambiar de plantilla.' },
  ],
  caption: `Dos tiendas. Dos rubros. Dos estilos Premium. 🚀

Deslizá y mirá cómo quedaron Hogar Digital (@hogardigitaltiendaonline, tecnología y hogar) y Valmont & Co. (relojería) con el plan Premium de Nevux.

🏠 Hogar Digital
✨ Portada de marca grande, con cabecera flotante y cinta de anuncios
🔄 Categorías que cambian mientras bajás y comunidad con sus propios videos
📊 Confianza con datos reales: sus números y su local con mapa y horario
🛒 Una ficha que saca las dudas: precio claro, cuándo sale el pedido y garantía a la vista

⌚ Valmont & Co.
✨ Logo que gira en 3D y hora oficial en vivo
🏷️ "Por qué Valmont" en etiquetas colgadas, con el estilo de una relojería

Lo mismo para las dos: todo hecho a medida sobre su Tiendanube, con sus productos y sus datos reales. Sin apps y sin cambiar de plantilla. 💡

👉 ¿Cómo quedaría la tuya? Comentá FICHA y te mando un análisis gratis.

${HASHTAGS}`,
};
