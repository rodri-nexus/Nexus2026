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
        background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "transparent",
            border: "none",
            color: "#6366f1",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: "1.5rem",
            padding: "0.25rem 0",
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
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Crear nuevo widget
          </h1>
          <p
            style={{
              margin: "0 0 1.5rem 0",
              fontSize: "0.95rem",
              color: "#6b7280",
            }}
          >
            ¿Qué tipo de widget querés crear?
          </p>
        </motion.div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {/* Opción A */}
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
              borderRadius: "12px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(99, 102, 241, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Package size={22} color="#059669" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "0.25rem",
                }}
              >
                Widget para un producto específico
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  lineHeight: 1.4,
                }}
              >
                Asocia widgets a un producto en particular
              </div>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>

          {/* Opción B */}
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
              borderRadius: "12px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(99, 102, 241, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Store size={22} color="#2563eb" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "0.25rem",
                }}
              >
                Widget para todos los productos
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  lineHeight: 1.4,
                }}
              >
                Asocia widgets a todos los productos y en el inicio de la tienda
              </div>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
            }
