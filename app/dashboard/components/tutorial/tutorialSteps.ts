// tutorialSteps.ts
// Configuración de los 8 pasos del tutorial de onboarding de Nevux.
// Editar textos acá para no tocar los componentes.

export type TutorialStepId =
  | "welcome"
  | "productos"
  | "metricas"
  | "sync"
  | "recientes"
  | "crear"
  | "producto-especifico"
  | "toda-tienda"
  | "listo";

export interface TutorialStep {
  id: TutorialStepId;
  // Selector CSS del elemento a destacar (spotlight). null = sin spotlight (modal centrado)
  target: string | null;
  title: string;
  description: string;
  // Texto del botón principal
  primaryLabel: string;
  // Si el paso abre el modal fake de "Crear widget"
  opensCreateModal?: boolean;
  // Si el paso destaca un elemento DENTRO del modal fake
  insideModal?: boolean;
  // Contador visible (ej: "1/8"). El paso welcome NO cuenta
  counter?: string;
  // Alineación de la card flotante respecto al target
  placement?: "top" | "bottom" | "auto" | "center";
  // Enlace secundario (ej: "Ver todos los widgets disponibles con demo →")
  secondaryLink?: {
    label: string;
    href: string;
  };
}

export const tutorialSteps: TutorialStep[] = [
  // ─────────────────────────────────────────────
  // WELCOME (sin numeración, modal centrado)
  // ─────────────────────────────────────────────
  {
    id: "welcome",
    target: null,
    title: "¡Bienvenido a Nevux!",
    description:
      "Vamos a hacer un recorrido rápido por tu nuevo panel de control para que puedas empezar a crear widgets y potenciar tu tienda en minutos.",
    primaryLabel: "Empezar tutorial",
    placement: "center",
  },

  // ─────────────────────────────────────────────
  // 1/8 — Productos sincronizados (StatsCards)
  // ─────────────────────────────────────────────
  {
    id: "productos",
    target: '[data-tutorial="stats-productos"]',
    title: "Tus productos sincronizados",
    description:
      "Acá vas a ver cuántos productos tiene tu tienda. Se sincronizan automáticamente junto con las categorías cada vez que agregás o modificás algo en Tiendanube.",
    primaryLabel: "Siguiente",
    counter: "1/8",
    placement: "bottom",
  },

  // ─────────────────────────────────────────────
  // 2/8 — Métricas de widgets (MetricsCard)
  // ─────────────────────────────────────────────
  {
    id: "metricas",
    target: '[data-tutorial="metrics-card"]',
    title: "Métricas de tus widgets",
    description:
      "En este recuadro vas a ver impresiones, clicks, agregados al carrito y facturación estimada generada por tus widgets. También podés cambiar el período y ordenar los widgets para entender cuáles rinden mejor.",
    primaryLabel: "Siguiente",
    counter: "2/8",
    placement: "bottom",
  },

  // ─────────────────────────────────────────────
  // 3/8 — Sincronización manual (AccionesRapidas)
  // ─────────────────────────────────────────────
  {
    id: "sync",
    target: '[data-tutorial="sync-button"]',
    title: "Sincronización manual",
    description:
      "Si tus productos no se actualizaron todavía, podés sincronizarlos manualmente presionando este botón.",
    primaryLabel: "Siguiente",
    counter: "3/8",
    placement: "top",
  },

  // ─────────────────────────────────────────────
  // 4/8 — Panel de widgets (RecientesCard)
  // ─────────────────────────────────────────────
  {
    id: "recientes",
    target: '[data-tutorial="recientes-card"]',
    title: "Tu panel de widgets",
    description:
      "Desde acá vas a ver y gestionar tus widgets activos. Cuando tengas varios, aparecerán listados aquí.",
    primaryLabel: "Siguiente",
    counter: "4/8",
    placement: "bottom",
  },

  // ─────────────────────────────────────────────
  // 5/8 — Crear tu primer widget (botón + de Recientes)
  // Al presionar "Abrir" se abre el modal fake
  // ─────────────────────────────────────────────
  {
    id: "crear",
    target: '[data-tutorial="crear-widget-btn"]',
    title: "Crear tu primer widget",
    description:
      "Desde acá vas a poder agregar tu primer widget. A continuación te explicamos las opciones.",
    primaryLabel: "Abrir →",
    counter: "5/8",
    placement: "top",
    opensCreateModal: true,
  },

  // ─────────────────────────────────────────────
  // 6/8 — Widget para un producto (dentro del modal)
  // ─────────────────────────────────────────────
  {
    id: "producto-especifico",
    target: '[data-tutorial="widget-producto-especifico"]',
    title: "Widget para un producto",
    description:
      "Asociás el widget a un producto específico. El widget solo aparece en la página de ese producto.",
    primaryLabel: "Siguiente",
    counter: "6/8",
    placement: "bottom",
    insideModal: true,
  },

  // ─────────────────────────────────────────────
  // 7/8 — Widget para toda la tienda (dentro del modal)
  // ─────────────────────────────────────────────
  {
    id: "toda-tienda",
    target: '[data-tutorial="widget-toda-tienda"]',
    title: "Widget para toda la tienda",
    description:
      "El widget aparece de forma global en todos los productos de tu tienda.",
    primaryLabel: "Siguiente",
    counter: "7/8",
    placement: "top",
    insideModal: true,
  },

  // ─────────────────────────────────────────────
  // 8/8 — ¡Listo para empezar! (modal centrado, cierra tutorial)
  // ─────────────────────────────────────────────
  {
    id: "listo",
    target: null,
    title: "¡Listo para empezar!",
    description:
      "Elegí la opción que mejor se adapte a lo que querés hacer y creá tu primer widget.",
    primaryLabel: "Crear mi primer widget",
    counter: "8/8",
    placement: "center",
    insideModal: true,
    secondaryLink: {
      label: "Ver todos los widgets disponibles con demo →",
      href: "/widgets",
    },
  },
];

// Helper: obtener índice de un paso por id
export function getStepIndex(id: TutorialStepId): number {
  return tutorialSteps.findIndex((s) => s.id === id);
}

// Helper: obtener paso por índice de forma segura
export function getStep(index: number): TutorialStep | null {
  if (index < 0 || index >= tutorialSteps.length) return null;
  return tutorialSteps[index];
}

// Total de pasos
export const TOTAL_STEPS = tutorialSteps.length;
