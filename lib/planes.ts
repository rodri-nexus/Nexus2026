// Planes de suscripción de Nevux. Cada uno tiene su plan en Mercado Pago (Planes de suscripción).
// La página nevux.ar/suscribirme usa el plan del cliente (?c=<cliente>, campo `plan` en lib/clientes.ts) o ?plan=<id>.

export type Plan = {
  nombre: string;
  precio: number;
  link: string;
  bajada: string;
  incluye: string[];
};

export const PLANES: Record<"basico" | "premium", Plan> = {
  basico: {
    nombre: "Pack Landing Page Pro",
    precio: 39900,
    link: "https://mpago.la/2u5gT97",
    bajada: "Tu ficha de producto rediseñada como las de las marcas grandes, con efectos, y tu home con secciones de confianza. Sin cambiar de plantilla y sin apps.",
    incluye: [
      "Ficha Pro clara u oscura, con tus colores",
      "Precios en escalera: transferencia y cuotas reales de tu tienda",
      "Packs Llevá 2 y Llevá 3 con descuento",
      "Problema y solución, comparativa y preguntas frecuentes",
      "Efectos: secciones que entran al bajar, botón con brillo y “Agregado ✓”",
      "Home de tu tienda con secciones de confianza",
      "Cambios y ajustes por WhatsApp sin costo extra",
    ],
  },
  premium: {
    nombre: "Nevux Premium",
    precio: 69900,
    link: "https://mpago.la/2mkcebx",
    bajada: "Tu tienda entera a medida, con efectos que se mueven solos: portada con clips, categorías que rotan, cabecera y fichas premium. Sin apps.",
    incluye: [
      "Todo lo del plan Básico",
      "Home Premium: portada con clips de tus fotos o videos",
      "Beneficios tipo historias y categorías que rotan solas",
      "Productos con la foto que se da vuelta",
      "Cabecera con tu logo animado y pie de página a medida",
      "Herramientas de tu rubro, como el medidor de tamaño",
      "Cambios y ajustes por WhatsApp sin costo extra",
    ],
  },
};

export function precioTexto(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

// Plan que corresponde: el del cliente, el pedido con ?plan= o el básico
export function planDe(plan?: string, clientePlan?: string): Plan {
  const id = (clientePlan || plan) as keyof typeof PLANES;
  return PLANES[id] || PLANES.basico;
}
