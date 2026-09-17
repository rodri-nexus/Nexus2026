// app/components/landing/FeatureWidgets.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  TrendingUp,
  Layers,
  Package,
  MessageSquare,
  Truck,
  AlertTriangle,
  ShieldCheck,
  Star,
  Video,
  Eye,
  CreditCard,
  Tag,
  Columns,
  Wallet,
  Ruler,
  LayoutGrid,
  Sliders,
  Camera,
  Gift,
  Megaphone,
  Clock,
  Calculator,
  Flame,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════
   ESTILOS Y CONSTANTES AL INICIO (Regla #9)
═══════════════════════════════════════════ */
type CategoryId = "todos" | "urgencia" | "aov" | "confianza" | "info" | "engagement";

interface WidgetItem {
  id: string;
  name: string;
  category: CategoryId;
  badge: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  hasSpecialDates?: boolean;
}

const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: "todos", label: "Todos (26)", icon: "⚡" },
  { id: "urgencia", label: "Urgencia & Escasez", icon: "🔥" },
  { id: "aov", label: "Aumentar Ticket (AOV)", icon: "📦" },
  { id: "confianza", label: "Confianza & Social Proof", icon: "🛡️" },
  { id: "info", label: "Información & Checkout", icon: "ℹ️" },
  { id: "engagement", label: "Engagement & Visual", icon: "✨" },
];

const WIDGETS_LIST: WidgetItem[] = [
  // 1. Urgencia & Escasez
  {
    id: "cuenta-regresiva",
    name: "Cuenta Regresiva",
    category: "urgencia",
    badge: "Urgencia",
    description: "Temporizador de ofertas límite con reinicio dinámico y llamada a la acción irresistible.",
    icon: Timer,
    tag: "Producto / Global",
    hasSpecialDates: true,
  },
  {
    id: "contador-visitas",
    name: "Contador de Visitas",
    category: "urgencia",
    badge: "Social Proof",
    description: "Muestra cuántas personas están mirando el producto en tiempo real para generar FOMO.",
    icon: Eye,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "contador-vendidos",
    name: "Contador de Vendidos",
    category: "urgencia",
    badge: "Alta Demanda",
    description: "Exhibe la cantidad de unidades despachadas en las últimas horas para acelerar la compra.",
    icon: Flame,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "edicion-limitada",
    name: "Sticker Edición Limitada",
    category: "urgencia",
    badge: "Exclusividad",
    description: "Sello flotante con micro-animaciones para destacar stock exclusivo o lanzamientos.",
    icon: Sparkles,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "mensaje-alerta",
    name: "Mensaje de Alerta",
    category: "urgencia",
    badge: "Aviso Clave",
    description: "Banner estratégico de último momento para notificar pocas unidades o envíos prioritarios.",
    icon: AlertTriangle,
    tag: "Producto / Global",
    hasSpecialDates: true,
  },

  // 2. Aumentar Ticket (AOV)
  {
    id: "bundle-promociones",
    name: "Bundle Promociones",
    category: "aov",
    badge: "+35% Ticket",
    description: "Combina productos complementarios con descuento directo para duplicar el carrito.",
    icon: Layers,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "bundle-cantidad",
    name: "Bundle por Cantidad",
    category: "aov",
    badge: "Volumen",
    description: "Escala de descuentos por llevar 2, 3 o más unidades del mismo producto (Llevá 3 pagá 2).",
    icon: Package,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "calculadora-ahorro",
    name: "Calculadora de Ahorro",
    category: "aov",
    badge: "Conversión",
    description: "Calcula en vivo cuánto dinero ahorra el cliente comprando hoy o pagando en efectivo.",
    icon: Calculator,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "barra-progreso",
    name: "Barra de Envío Gratis",
    category: "aov",
    badge: "Envío Gratis",
    description: "Barra interactiva que muestra cuánto le falta al cliente para desbloquear el envío gratuito.",
    icon: TrendingUp,
    tag: "Global / Header",
    hasSpecialDates: true,
  },
  {
    id: "badge-cupon",
    name: "Badge de Cupón de Descuento",
    category: "aov",
    badge: "Copiar en 1 Clic",
    description: "Caja de cupón interactiva que permite copiar el código con un solo toque.",
    icon: Tag,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },

  // 3. Confianza & Social Proof
  {
    id: "resenas-foto",
    name: "Reseñas con Foto (UGC)",
    category: "confianza",
    badge: "Máxima Confianza",
    description: "Muro de valoraciones de compradores reales con fotos de producto para eliminar dudas.",
    icon: Camera,
    tag: "Página de Producto",
  },
  {
    id: "caja-opiniones",
    name: "Caja de Opiniones",
    category: "confianza",
    badge: "Social Proof",
    description: "Resumen de estrellas y valoraciones verificadas listo para incrustar en el checkout.",
    icon: MessageSquare,
    tag: "Página de Producto",
  },
  {
    id: "resenas-clientes",
    name: "Reseñas de Clientes",
    category: "confianza",
    badge: "Testimonios",
    description: "Carrusel de opiniones de satisfacción con puntuación y fecha verificada.",
    icon: Star,
    tag: "Página de Producto",
  },
  {
    id: "mensaje-garantia",
    name: "Mensaje de Garantía",
    category: "confianza",
    badge: "Seguridad",
    description: "Sello de compra protegida, devolución sin costo y garantía de satisfacción oficial.",
    icon: ShieldCheck,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "comparador-marca",
    name: "Comparador vs Competencia",
    category: "confianza",
    badge: "Autoridad",
    description: "Tabla visual que compara tu producto contra las alternativas genéricas del mercado.",
    icon: Columns,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },

  // 4. Información Estratégica & Checkout
  {
    id: "info-compra",
    name: "Info de Compra Unificada (3 en 1)",
    category: "info",
    badge: "Estrella ⚡",
    description: "Consolida en una sola tarjeta elegante: Cuotas sin interés, Envío gratis y Descuento por transferencia.",
    icon: Wallet,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "tabla-talles",
    name: "Tabla de Talles Interactiva",
    category: "info",
    badge: "Anti-Devoluciones",
    description: "Guía de medidas y equivalencias inteligente para indumentaria y calzado.",
    icon: Ruler,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "info-despacho",
    name: "Información de Despacho",
    category: "info",
    badge: "Claridad",
    description: "Indica la fecha y hora estimada en la que se despacha el paquete si compra hoy.",
    icon: Truck,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "info-envio",
    name: "Información de Envío",
    category: "info",
    badge: "Logística",
    description: "Detalle de empresas de correo disponibles, tiempos de entrega y cobertura nacional.",
    icon: ShoppingBag,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "medios-pago",
    name: "Medios de Pago Aceptados",
    category: "info",
    badge: "Pasarelas",
    description: "Logos oficiales de tarjetas, bancos, billeteras virtuales y transferencias aceptadas.",
    icon: CreditCard,
    tag: "Página de Producto",
    hasSpecialDates: true,
  },
  {
    id: "horario-atencion",
    name: "Horario de Atención",
    category: "info",
    badge: "Soporte",
    description: "Informa los días y horarios del equipo de soporte humano para generar cercanía.",
    icon: Clock,
    tag: "Global / Footer",
    hasSpecialDates: true,
  },

  // 5. Engagement & Navegación
  {
    id: "menu-circulos",
    name: "Menú de Historias / Círculos",
    category: "engagement",
    badge: "Tipo Instagram",
    description: "Navegación visual interactiva en la cabecera estilo Stories de Instagram.",
    icon: LayoutGrid,
    tag: "Página de Inicio (Home)",
    hasSpecialDates: true,
  },
  {
    id: "slider-categorias",
    name: "Slider de Categorías",
    category: "engagement",
    badge: "Navegación",
    description: "Carrusel deslizante con fotos de colecciones para guiar al comprador en mobile.",
    icon: Sliders,
    tag: "Página de Inicio (Home)",
    hasSpecialDates: true,
  },
  {
    id: "slider-video",
    name: "Slider de Video",
    category: "engagement",
    badge: "Video UGC",
    description: "Carrusel de videos verticales en bucle mostrando el producto en uso real.",
    icon: Video,
    tag: "Página de Producto",
  },
  {
    id: "ruleta-descuentos",
    name: "Ruleta de Premios & Descuentos",
    category: "engagement",
    badge: "Gamificación",
    description: "Juego interactivo para captar correos y entregar cupones antes de que salgan de la tienda.",
    icon: Gift,
    tag: "Global Flotante",
    hasSpecialDates: true,
  },
  {
    id: "marquee-novedades",
    name: "Marquee Cinta Deslizante",
    category: "engagement",
    badge: "Cinta Infinita",
    description: "Texto infinito en movimiento continuo para anunciar promociones, cuotas y novedades.",
    icon: Megaphone,
    tag: "Global / Top Bar",
    hasSpecialDates: true,
  },
];

const containerStyle: React.CSSProperties = {
  position: "relative",
  background: "#07090e",
  padding: "6rem 1.25rem 7rem 1.25rem",
  overflow: "hidden",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#ffffff",
};

const filterButtonStyle = (active: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 18px",
  borderRadius: "999px",
  fontSize: "0.88rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
  background: active ? "#10B981" : "rgba(255, 255, 255, 0.04)",
  color: active ? "#000000" : "#9ca3af",
  border: active ? "1px solid #10B981" : "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: active ? "0 4px 20px rgba(16, 185, 129, 0.35)" : "none",
  whiteSpace: "nowrap",
});

const widgetCardStyle: React.CSSProperties = {
  background: "rgba(18, 20, 26, 0.75)",
  border: "1px solid rgba(255, 255, 255, 0.07)",
  borderRadius: "20px",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  boxSizing: "border-box",
  minWidth: 0,
};

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function FeatureWidgets() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("todos");

  const filteredWidgets =
    selectedCategory === "todos"
      ? WIDGETS_LIST
      : WIDGETS_LIST.filter((w) => w.category === selectedCategory);

  return (
    <section id="widgets" style={containerStyle}>
      {/* Resplandor ambiental */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(900px, 100vw)",
          height: "500px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Cabecera de la Sección */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "999px",
              fontSize: "0.78rem",
              color: "#10B981",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={14} />
            <span>CATÁLOGO COMPLETO DE CONVERSIÓN</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              margin: "0 0 1rem 0",
            }}
          >
            26 Widgets Diseñados para{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Destruir Dudas y Multiplicar Ventas
            </span>
          </h2>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "#9ca3af",
              maxWidth: "760px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Cada widget resuelve un problema psicológico real del comprador online: falta de urgencia, desconfianza, dudas con el talle o compras de bajo valor.
          </p>
        </div>

        {/* Filtros por Categoría */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.6rem",
            overflowX: "auto",
            paddingBottom: "1.5rem",
            marginBottom: "2.5rem",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={filterButtonStyle(selectedCategory === cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Grilla Autoadaptable de Widgets (Reglas #17 y #18) */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <AnimatePresence>
            {filteredWidgets.map((widget) => {
              const IconComp = widget.icon;
              return (
                <motion.div
                  key={widget.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  style={widgetCardStyle}
                >
                  <div>
                    {/* Header de la Tarjeta */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: "rgba(16, 185, 129, 0.12)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#10B981",
                          flexShrink: 0,
                        }}
                      >
                        <IconComp size={22} />
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "flex-end" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            background: "rgba(16, 185, 129, 0.15)",
                            color: "#10B981",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          {widget.badge}
                        </span>

                        {widget.hasSpecialDates && (
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "999px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              background: "rgba(245, 158, 11, 0.12)",
                              color: "#f59e0b",
                              border: "1px solid rgba(245, 158, 11, 0.3)",
                            }}
                            title="Compatible con modo Black Friday, Hot Sale, Navidad, etc."
                          >
                            ⚡ 7 Presets
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Título y Descripción */}
                    <h3
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: "#ffffff",
                        margin: "0 0 0.5rem 0",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {widget.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "#9ca3af",
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {widget.description}
                    </p>
                  </div>

                  {/* Footer de Tarjeta */}
                  <div
                    style={{
                      marginTop: "1.25rem",
                      paddingTop: "0.85rem",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.78rem",
                      color: "#6b7280",
                    }}
                  >
                    <span>Ubicación: <strong style={{ color: "#d1d5db" }}>{widget.tag}</strong></span>
                    <span style={{ color: "#10B981", fontWeight: 700 }}>Activo en 1 clic</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Banner Inferior: Modo Fechas Especiales 3.0 */}
        <div
          style={{
            marginTop: "3.5rem",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(9, 13, 22, 0.8) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "24px",
            padding: "2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#10B981",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              <span>🔥 MODO FECHAS ESPECIALES 3.0 INCLUIDO</span>
            </div>
            <h4
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "#ffffff",
                margin: "0 0 0.5rem 0",
              }}
            >
              Transformá el diseño de tus widgets para Black Friday o Hot Sale en 1 Clic
            </h4>
            <p style={{ fontSize: "0.9rem", color: "#9ca3af", margin: 0, lineHeight: 1.45 }}>
              7 Presets cromáticos profesionales prediseñados: Black Friday, Hot Sale, Cyber Monday, Navidad & Reyes, San Valentín, Día de la Madre/Padre y Liquidación Total.
            </p>
          </div>

          <a
            href="/registro"
            style={{
              padding: "0.95rem 1.75rem",
              background: "#10B981",
              color: "#000000",
              borderRadius: "999px",
              fontSize: "0.95rem",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
              flexShrink: 0,
            }}
          >
            <span>Probar Gratis</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
    }
