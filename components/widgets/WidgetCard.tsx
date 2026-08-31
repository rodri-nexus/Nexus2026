"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { WidgetDefinition } from "@/types/widgets";
import WidgetPreview from "./WidgetPreview";

interface WidgetCardProps {
  widget: WidgetDefinition;
  onClick: () => void;
  index: number;
}

const POPULAR_SLUGS = [
  "contador-regresivo",
  "bundle-productos",
  "barra-progreso",
  "urgencia-stock",
];

const NEW_SLUGS = [
  "info-compra",
  "extras-interruptor",
  "switch-extras",
  "contador-visitas",
  "visitor-counter",
];

export default function WidgetCard({ widget, onClick, index }: WidgetCardProps) {
  const isPopular = POPULAR_SLUGS.includes(widget.slug);
  const isNew = NEW_SLUGS.includes(widget.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.2s ease",
        boxSizing: "border-box",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#10B981";
        e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(16, 185, 129, 0.15)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Preview interactivo / gráfico */}
      <div
        style={{
          padding: "1rem 1rem 0.5rem 1rem",
          background: "#fafafa",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <WidgetPreview slug={widget.slug} />
      </div>

      {/* Contenido descriptivo */}
      <div
        style={{
          padding: "1rem 1.15rem 1.15rem 1.15rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              marginBottom: "0.35rem",
            }}
          >
            <div
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#000000",
                lineHeight: 1.2,
              }}
            >
              {widget.name}
            </div>

            {/* Badges de estado */}
            {isNew && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#059669",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "999px",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                <Sparkles size={11} color="#10B981" />
                NUEVO
              </span>
            )}

            {isPopular && !isNew && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#059669",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "999px",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                <TrendingUp size={11} color="#059669" />
                POPULAR
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: "0.82rem",
              color: "#6b7280",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.3em",
            }}
          >
            {widget.description}
          </div>
        </div>

        {/* Botón CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "0.35rem",
          }}
        >
          <button
            onClick={onClick}
            style={{
              width: "100%",
              padding: "0.65rem 1rem",
              background: "#10B981",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#059669";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#10B981";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Configurar widget →
          </button>
        </div>
      </div>
    </motion.div>
  );
                  }
