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
    bajada: "Tus fichas de producto y tu home, transformadas para vender más. Sin cambiar de plantilla y sin apps.",
    incluye: [
      "Packs Llevá 2 y Llevá 3 con descuento",
      "Cuenta regresiva de despacho y entrega estimada",
      "Botón de compra fijo y avisos de venta en vivo",
      "Combiná con, comparativa y preguntas frecuentes",
      "Home de tu tienda con secciones de confianza",
      "Configuración con tus colores, tus productos y tus datos",
      "Cambios y ajustes por WhatsApp sin costo extra",
    ],
  },
  premium: {
    nombre: "Nevux Premium",
    precio: 69900,
    link: "https://mpago.la/2mkcebx",
    bajada: "Tu tienda rediseñada a medida: cabecera, home y fichas de producto con estilo premium. Sin apps.",
    incluye: [
      "Cabecera con el logo de tu marca animado y tus colores",
      "Home a medida: portada, vitrinas, categorías y secciones de confianza",
      "Ficha de producto premium: precio destacado, envío con fechas y productos similares",
      "Herramientas de tu rubro, como el medidor de tamaño",
      "Pie de página y detalles de diseño en toda la tienda",
      "Configuración con tus colores, tus productos y tus datos",
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
