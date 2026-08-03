"use client";

import { motion } from "framer-motion";
import { WidgetDefinition } from "@/types/widgets";
import WidgetPreview from "./WidgetPreview";

interface WidgetCardProps {
  widget: WidgetDefinition;
  onClick: () => void;
  index: number;
}

const POPULAR_SLUGS = ["contador-regresivo", "bundle-productos", "barra-progreso"];

export default function WidgetCard({ widget, onClick, index }: WidgetCardProps) {
  const isPopular = POPULAR_SLUGS.includes(widget.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        border: "1.5px solid #f3f4f6",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#c7d2fe";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.1)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#f3f4f6";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Preview */}
      <div style={{ padding: "1rem 1rem 0.5rem 1rem" }}>
        <WidgetPreview slug={widget.slug} />
      </div>

      {/* Contenido */}
      <div
        style={{
          padding: "0.75rem 1.25rem 1.25rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.35rem",
            }}
          >
            {widget.name}
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.5em",
            }}
          >
            {widget.description}
          </div>
        </div>

        {/* Botones */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "auto",
          }}
        >
          <button
            onClick={onClick}
            style={{
              flex: 1,
              padding: "0.7rem 1rem",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "opacity 0.15s, transform 0.15s",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.92";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Crear
          </button>

          {isPopular && (
            <div
              style={{
                background: "#d1fae5",
                color: "#065f46",
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Popular
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
        }
