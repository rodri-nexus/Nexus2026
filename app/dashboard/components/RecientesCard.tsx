"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import CrearWidgetModal from "@/components/widgets/CrearWidgetModal";
import SeleccionarProductoModal from "@/components/widgets/SeleccionarProductoModal";

interface RecientesCardProps {
  widgets?: Widget[];
  storeId?: number;
}

interface Widget {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

export default function RecientesCard({ widgets = [], storeId }: RecientesCardProps) {
  const hasWidgets = widgets.length > 0;
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

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
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "-0.01em",
          }}
        >
          Recientes
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
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.borderColor = "#FF0000";
              e.currentTarget.style.color = "#FF0000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#000000";
            }}
          >
            Ver
          </Link>

          <button
            onClick={() => setCreateModalOpen(true)}
            data-tutorial="crear-widget-btn"
            aria-label="Crear widget"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#FF0000",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 12px rgba(255, 0, 0, 0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 0, 0, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 0, 0, 0.35)";
            }}
          >
            <Plus size={20} />
          </button>
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
            <div
              key={widget.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem",
                borderRadius: "10px",
                border: "1px solid #f3f4f6",
                transition: "background 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(255, 0, 0, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LayoutGrid size={16} color="#FF0000" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
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
            </div>
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
              background: "rgba(255, 0, 0, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <LayoutGrid size={26} color="#FF0000" strokeWidth={1.75} />
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

          <button
            onClick={() => setCreateModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1.5rem",
              borderRadius: "999px",
              background: "#FF0000",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 600,
              border: "none",
              boxShadow: "0 4px 12px rgba(255, 0, 0, 0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 0, 0, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 0, 0, 0.35)";
            }}
          >
            <Plus size={16} />
            <span>Crear</span>
          </button>
        </div>
      )}

      {/* Modales */}
      <CrearWidgetModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSelectProducto={() => {
          setCreateModalOpen(false);
          setProductModalOpen(true);
        }}
        onSelectTodos={() => {
          setCreateModalOpen(false);
          window.location.href = "/widgets/nuevo/todos";
        }}
      />

      {storeId && (
        <SeleccionarProductoModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          storeId={storeId}
        />
      )}
    </motion.section>
  );
            }
