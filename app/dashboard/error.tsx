// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10B981",
            }}
          >
            <AlertCircle size={22} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#000000", margin: 0 }}>
            Inconveniente en el panel
          </h2>
        </div>

        <p style={{ fontSize: "0.9rem", color: "#4b5563", margin: "0 0 1.5rem 0", lineHeight: 1.5 }}>
          Nevux capturó un fallo al intentar renderizar un componente. Por favor, copiá el reporte técnico de abajo para solucionarlo ahora mismo:
        </p>

        <div
          style={{
            background: "#f3f4f6",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1.5rem",
            overflowX: "auto",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#dc2626", marginBottom: "0.5rem" }}>
            Mensaje: {error.message || "Error desconocido"}
          </div>
          <pre
            style={{
              margin: 0,
              fontSize: "0.72rem",
              color: "#374151",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              maxHeight: "180px",
              overflowY: "auto",
            }}
          >
            {error.stack || "No hay detalles adicionales."}
          </pre>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => reset()}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "#10B981",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
            }}
          >
            <RefreshCw size={16} />
            Reintentar cargar
          </button>

          <a
            href="/login"
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "transparent",
              color: "#4b5563",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxSizing: "border-box",
            }}
          >
            <ArrowLeft size={16} />
            Cerrar sesión / Volver
          </a>
        </div>
      </div>
    </div>
  );
          }
