// Diseños del catálogo (nevux.ar/disenos y la sección "Así puede quedar tu tienda" de la landing). Ver docs/disenos.md.
// Cada demo es public/demo/disenos/<id>.html (scripts/demo/disenos.py).

export type DisenoCatalogo = { id: string; nombre: string; plan: string; demo: string; texto: string; efectos: string[] };

export const DISENOS: DisenoCatalogo[] = [
  {
    id: "ficha-clara",
    nombre: "Ficha Pro · Clara",
    plan: "Básico",
    demo: "/demo/disenos/ficha-clara.html",
    texto: "Fondo blanco con el color de tu marca. Ideal para hogar, cosmética, accesorios y regalería.",
    efectos: ["Precios en escalera con la cinta de descuento", "Cuenta regresiva de la promo", "Packs que se marcan al elegirlos", "Comparativa que se llena sola", "Botón con brillo y “Agregado ✓”"],
  },
  {
    id: "ficha-oscura",
    nombre: "Ficha Pro · Oscura",
    plan: "Básico",
    demo: "/demo/disenos/ficha-oscura.html",
    texto: "Negro con el color de tu marca y títulos gigantes. Ideal para indumentaria, tecnología y marcas con actitud.",
    efectos: ["El problema y la solución en tarjetas", "Pestañas que cambian la foto", "Secciones que entran con rebote al bajar", "Barra de compra que aparece desde abajo", "“Llevalo hoy” con qué recibís"],
  },
  {
    id: "home",
    nombre: "Home Premium con clips",
    plan: "Premium",
    demo: "/demo/disenos/home.html",
    texto: "La portada se mueve sola con tus fotos o videos y las categorías van rotando. La tienda se ve de marca grande.",
    efectos: ["Portada con clips que cambian solos", "Beneficios en tarjeta tipo historias", "Categorías que rotan con su foto", "Productos con la foto que se da vuelta", "Todo lo de la Ficha Pro"],
  },
];
