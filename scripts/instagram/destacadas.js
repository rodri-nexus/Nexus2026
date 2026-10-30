// Historias que van dentro de las destacadas del perfil (se publican una vez y quedan en el archivo de historias).
// Destacadas: Qué es (d-que-es-*), Antes/Después (d-ad-*), Precio (d-precio-*), Preguntas (d-faq-*), Clientes (d-clientes-*).

const faq = (archivo, pregunta, respuesta, pie) => ({
  archivo, tipo: "punto", num: "PREGUNTA FRECUENTE", titulo: pregunta, texto: respuesta, pie,
});

module.exports = {
  historias: [
    {
      archivo: "d-que-es-1", tipo: "portada", eyebrow: "Hola 👋 somos Nevux",
      titulo: 'Hacemos que tu Tiendanube <span class="verde">venda más</span>',
      sub: "Con las mismas visitas que ya tenés. Sin apps y sin cambiar de plantilla.",
      pie: "Tocá para seguir",
    },
    {
      archivo: "d-que-es-2", tipo: "punto", num: "QUÉ HACEMOS",
      titulo: 'Transformamos tus <span class="verde">fichas de producto</span>',
      texto: "Les sumamos lo que la persona necesita para decidirse:",
      lista: ["Que confíen: envío, cuotas, reseñas", "Que se decidan hoy: mejor precio y botón fijo", "Que lleven más: packs y “Combiná con”", "Que se enamoren: talles, videos, antes y después"],
    },
    {
      archivo: "d-que-es-3", tipo: "punto", num: "CÓMO TRABAJAMOS",
      titulo: 'Vos <span class="verde">no tocás nada</span>',
      lista: ["1. Análisis gratis de tu tienda", "2. Lo armamos con tus datos y lo probamos en tu ficha", "3. Pegás una línea en Tiendanube y listo"],
      texto: "Después, cualquier cambio lo hacemos nosotros.",
    },
    {
      archivo: "d-que-es-4", tipo: "cta", eyebrow: "Empezá acá",
      titulo: '¿Querés tu <span class="verde">análisis gratis</span>?',
      texto: "Mandame por mensaje el link de tu tienda y te digo qué está frenando tus ventas.",
      responde: "Escribime 💬",
    },

    { archivo: "d-ad-1", tipo: "foto", clase: "antes", etiqueta: "ANTES", titulo: "Una ficha común", img: "../../public/landing/caso-antes.jpg" },
    { archivo: "d-ad-2", tipo: "foto", clase: "despues", etiqueta: "CON NEVUX", titulo: "Misma tienda, mismo precio", img: "../../public/landing/caso-despues.jpg" },

    {
      archivo: "d-precio-1", tipo: "numero", eyebrow: "Un precio, todo incluido",
      grande: "$39.900", tam: "mediano", chico: "por mes · pago con Mercado Pago",
      texto: "Con un ticket de $35.000, <b>se paga con 2 ventas al mes</b>.",
    },
    {
      archivo: "d-precio-2", tipo: "punto", num: "QUÉ INCLUYE",
      titulo: 'Todo, <span class="verde">sin extras</span>',
      lista: ["Análisis de tu tienda", "Las 22 piezas, con tus datos", "Secciones de confianza en la home", "Ajustes cuando cambies precios o promos", "Soporte por WhatsApp"],
    },
    {
      archivo: "d-precio-3", tipo: "punto", num: "SIN RIESGO",
      titulo: '7 días de <span class="verde">garantía</span>',
      texto: "Si en los primeros 7 días no te convence cómo quedaron tus fichas, <b>te devolvemos el 100%</b>.<br><br>Sin permanencia: cancelás cuando quieras.",
    },

    {
      archivo: "d-clientes-1", tipo: "testimonio", eyebrow: "Lo que dicen nuestros clientes",
      texto: "Nevux es muy importante para la gestión de mi tienda: incorporó widgets, analizó la tienda, me corrigió errores e intercambiamos ideas. <span class=\"verde\">Muy recomendable.</span>",
      nombre: "Marcelo", cargo: "Dueño de Hogar Digital · @hogardigitaltiendaonline", foto: "../../public/landing/hogar-digital.jpg",
    },
    { archivo: "d-clientes-2", tipo: "foto", clase: "despues", etiqueta: "HOGAR DIGITAL CON NEVUX", titulo: "Su ficha, hoy", img: "../../public/landing/caso-despues.jpg" },
    {
      archivo: "d-clientes-3", tipo: "cta", eyebrow: "¿Querés ser el próximo?",
      titulo: 'Tu tienda puede ser <span class="verde">el próximo caso</span>',
      texto: "Mandame por mensaje el link de tu tienda y empezamos con un análisis gratis.",
      responde: "Escribime 💬",
    },

    faq("d-faq-1", "¿Tengo que saber programar?", "No. Te damos una sola línea ya configurada y la pegás en el editor de diseño de Tiendanube, con nuestra guía. <b>Tarda un minuto.</b>"),
    faq("d-faq-2", "¿Tengo que cambiar de plantilla?", "No. Nevux se suma a la plantilla que ya tenés. <b>Lo probamos sobre una ficha real de tu tienda antes de activarlo.</b>"),
    faq("d-faq-3", "¿Hace más lenta mi tienda?", "No. Es un solo archivo liviano (unos 20 KB) que carga cuando tu página ya está lista. <b>Sin apps pesadas.</b>"),
    faq("d-faq-4", "¿Los precios son reales?", "Sí. El precio por transferencia y las cuotas se leen de tu tienda. <b>Si no ofrecés algo, no se muestra.</b> Nunca inventamos números ni reseñas."),
  ],
};
