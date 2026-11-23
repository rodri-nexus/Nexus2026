// Destacada "Clientes" de @nevux.app (pedido de Rodrigo, 23/11): una historia por cliente, con una captura real.
// Valmont (Miguel) queda afuera hasta que su catálogo tenga relojes originales (hoy tiene Rolex, Patek y Omega a $49.900).
// Uso: node scripts/instagram/generar.js destacada-clientes
module.exports = {
  historias: [
    {
      archivo: "d-clientes2-1", tipo: "portada", eyebrow: "Clientes de Nevux",
      titulo: 'Tiendas y webs <span class="verde">reales</span>',
      sub: "Tecnología, perfumes y un gimnasio. Cada uno con su estilo y sus datos reales. Tocá para ver →",
    },
    { archivo: "d-clientes2-2", tipo: "foto", clase: "despues", etiqueta: "MARCELO · HOGAR DIGITAL", titulo: "Tiendanube Premium", img: "capturas/hd-vivo/home-1.jpg", pie: "Tecnología y hogar" },
    { archivo: "d-clientes2-3", tipo: "foto", clase: "despues", etiqueta: "LORENZO · PERFUMEZ", titulo: "Tiendanube Premium", img: "capturas/perfumez/home-1.jpg", pie: "Perfumes árabes" },
    { archivo: "d-clientes2-4", tipo: "foto", clase: "despues", etiqueta: "LEILA · POWER GYM", titulo: "Sitio web", img: "capturas/clientes/power-gym.jpg", pie: "Gimnasio en Diamante" },
  ],
};
