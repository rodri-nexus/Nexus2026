"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Store, ArrowLeft } from "lucide-react";

export default function WidgetsNuevoPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: "520px", margin: "0 auto", boxSizing: "border-box" }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "transparent",
            border: "none",
            color: "#000000",
            opacity: 0.7,
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: "1.5rem",
            padding: "0.25rem 0",
            transition: "color 0.15s, opacity 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#10B981";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#000000";
            e.currentTarget.style.opacity = "0.7";
          }}
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.01em",
            }}
          >
            Crear nuevo widget
          </h1>
          <p
            style={{
              margin: "0 0 1.5rem 0",
              fontSize: "0.95rem",
              color: "#000000",
              opacity: 0.6,
            }}
          >
            ¿Qué tipo de widget querés crear?
          </p>
        </motion.div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {/* Opción A: Producto específico */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            onClick={() => router.push("/widgets/nuevo/producto")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "14px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#10B981";
              e.currentTarget.style.background = "#ecfdf5";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(16, 185, 129, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Package size={22} color="#10B981" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#000000",
                  marginBottom: "0.25rem",
                }}
              >
                Widget para un producto específico
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#000000",
                  opacity: 0.6,
                  lineHeight: 1.4,
                }}
              >
                Asociá widgets a un producto en particular
              </div>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.4 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>

          {/* Opción B: Todos los productos */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => router.push("/widgets/nuevo/todos")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "14px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#10B981";
              e.currentTarget.style.background = "#ecfdf5";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(16, 185, 129, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Store size={22} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#000000",
                  marginBottom: "0.25rem",
                }}
              >
                Widget para todos los productos
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#000000",
                  opacity: 0.6,
                  lineHeight: 1.4,
                }}
              >
                Asociá widgets a todos los productos y en el inicio de la tienda
              </div>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.4 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
          }
