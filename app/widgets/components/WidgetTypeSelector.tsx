"use client";

import { motion } from "framer-motion";
import {
  Video,
  AlertTriangle,
  ShieldCheck,
  Star,
  Megaphone,
  Truck,
  CreditCard,
  Banknote,
  Timer,
  MessageSquare,
  PackageCheck,
  Clock,
  Layers,
  Gift,
  X,
} from "lucide-react";

export type WidgetType = {
  id: string;
  name: string;
  description: string;
  icon: typeof Video;
  color: string;
  gradient: string;
  category: "conversion" | "confianza" | "urgencia" | "bundles";
};

export const WIDGET_TYPES: WidgetType[] = [
  {
    id: "slider-video",
    name: "Slider de Video",
    description: "Video que aparece en la página del producto",
    icon: Video,
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    category: "conversion",
  },
  {
    id: "mensaje-alerta",
    name: "Mensaje de alerta",
    description: "Texto de urgencia o escasez",
    icon: AlertTriangle,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    category: "urgencia",
  },
  {
    id: "mensaje-garantia",
    name: "Mensaje de garantía",
    description: "Íconos + texto de garantía y devolución",
    icon: ShieldCheck,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    category: "confianza",
  },
  {
    id: "resenas-clientes",
    name: "Reseñas de clientes",
    description: "Estrellas + comentarios reales",
    icon: Star,
    color: "#eab308",
    gradient: "linear-gradient(135deg, #eab308, #f59e0b)",
    category: "confianza",
  },
  {
    id: "banner-deslizante",
    name: "Banner deslizante",
    description: "Texto animado que se mueve horizontal",
    icon: Megaphone,
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    category: "conversion",
  },
  {
    id: "badge-envio",
    name: "Badge de envío",
    description: "Envío gratis a partir de un monto",
    icon: Truck,
    color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
    category: "confianza",
  },
  {
    id: "badge-cuotas",
    name: "Badge de cuotas",
    description: "X cuotas sin interés",
    icon: CreditCard,
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    category: "conversion",
  },
  {
    id: "badge-transferencia",
    name: "Badge de transferencia",
    description: "% de descuento pagando por transferencia",
    icon: Banknote,
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    category: "conversion",
  },
  {
    id: "cuenta-regresiva",
    name: "Cuenta regresiva",
    description: "Timer de oferta por tiempo limitado",
    icon: Timer,
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #f97316)",
    category: "urgencia",
  },
  {
    id: "caja-opiniones",
    name: "Caja de opiniones",
    description: "Opiniones destacadas de clientes",
    icon: MessageSquare,
    color: "#0891b2",
    gradient: "linear-gradient(135deg, #0891b2, #06b6d4)",
    category: "confianza",
  },
  {
    id: "info-envio",
    name: "Información de envío",
    description: "Tabla con plazos de envío por zona",
    icon: PackageCheck,
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    category: "confianza",
  },
  {
    id: "info-despacho",
    name: "Información de despacho",
    description: "Días y horarios de despacho",
    icon: Clock,
    color: "#0d9488",
    gradient: "linear-gradient(135deg, #0d9488, #14b8a6)",
    category: "confianza",
  },
  {
    id: "bundle-cantidad",
    name: "Bundle de cantidad",
    description: "Llevá 3 pagá 2 estilo tabla",
    icon: Layers,
    color: "#db2777",
    gradient: "linear-gradient(135deg, #db2777, #ec4899)",
    category: "bundles",
  },
  {
    id: "bundle-combo",
    name: "Bundle 2x1 / 3x2",
    description: "Combos de productos con descuento",
    icon: Gift,
    color: "#e11d48",
    gradient: "linear-gradient(135deg, #e11d48, #f43f5e)",
    category: "bundles",
  },
];

const CATEGORY_LABELS: Record<WidgetType["category"], string> = {
  conversion: "Conversión",
  confianza: "Confianza",
  urgencia: "Urgencia",
  bundles: "Bundles",
};

interface WidgetTypeSelectorProps {
  onSelect: (type: WidgetType) => void;
  onClose: () => void;
}

export default function WidgetTypeSelector({
  onSelect,
  onClose,
}: WidgetTypeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "960px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem", paddingRight: "2.5rem" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            Elegí un tipo de widget
          </h2>
          <p
            style={{
              margin: "0.4rem 0 0",
              fontSize: "0.9rem",
              color: "#6b7280",
            }}
          >
            Seleccioná el widget que querés crear. Podés personalizarlo después.
          </p>
        </div>

        {/* Grilla de widgets */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.85rem",
          }}
        >
          {WIDGET_TYPES.map((widget) => {
            const Icon = widget.icon;
            return (
              <button
                key={widget.id}
                onClick={() => onSelect(widget)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                  padding: "1.1rem",
                  borderRadius: "14px",
                  border: "1.5px solid #e5e7eb",
                  background: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = widget.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 20px -6px ${widget.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "11px",
                    background: widget.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.85rem",
                    boxShadow: `0 4px 12px ${widget.color}40`,
                  }}
                >
                  <Icon size={20} color="#ffffff" strokeWidth={2} />
                </div>

                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: widget.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.35rem",
                  }}
                >
                  {CATEGORY_LABELS[widget.category]}
                </span>

                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "0.3rem",
                    lineHeight: 1.3,
                  }}
                >
                  {widget.name}
                </span>

                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#6b7280",
                    lineHeight: 1.4,
                  }}
                >
                  {widget.description}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
    }
