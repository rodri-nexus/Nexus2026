// app/dashboard/components/RecientesCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutGrid, Plus, ArrowRight } from "lucide-react";

interface Widget {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

interface RecientesCardProps {
  widgets?: Widget[];
  storeId?: number;
}

export default function RecientesCard({ widgets = [] }: RecientesCardProps) {
  const hasWidgets = widgets.length > 0;

  return (
    <motion.section
      data-tutorial="recientes-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.15rem",
            fontWeight: 800,
            color: "#000000",
            letterSpacing: "-0.01em",
          }}
        >
          Widgets recientes
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Link
            href="/widgets"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: "1.5px solid #e5e7eb",
              background: "#ffffff",
              color: "#000000",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              transition: "all 0.15s",
            }}
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/widgets"
            data-tutorial="crear-widget-btn"
            aria-label="Crear widget"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#10B981",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <Plus size={20} />
          </Link>
        </div>
      </div>

      {/* Lista o estado vacío */}
      {hasWidgets ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {widgets.slice(0, 5).map((widget) => (
            <Link
              key={widget.id}
              href={`/widgets/${widget.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem",
                borderRadius: "10px",
                border: "1px solid #f3f4f6",
                textDecoration: "none",
                background: "#f9fafb",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LayoutGrid size={18} color="#10B981" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#000000",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {widget.name}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#000000",
                    opacity: 0.5,
                    marginTop: "0.1rem",
                  }}
                >
                  {widget.type}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 1rem",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px dashed #e5e7eb",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <LayoutGrid size={26} color="#10B981" strokeWidth={1.75} />
          </div>

          <p
            style={{
              margin: "0 0 1.25rem",
              fontSize: "0.95rem",
              color: "#000000",
              opacity: 0.6,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            No hay widgets creados todavía
          </p>

          <Link
            href="/widgets"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1.5rem",
              borderRadius: "999px",
              background: "#10B981",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <Plus size={16} />
            <span>Crear widget</span>
          </Link>
        </div>
      )}
    </motion.section>
  );
          }
