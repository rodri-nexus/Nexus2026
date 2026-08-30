"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Store, ArrowLeft, Loader2 } from "lucide-react";

function WidgetsNuevoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  // Si viene del modal con parámetros, redirigimos automáticamente a la ruta correspondiente
  useEffect(() => {
    if (type && productId) {
      router.replace(`/widgets/nuevo/producto?type=${encodeURIComponent(type)}&productId=${encodeURIComponent(productId)}`);
    } else if (type) {
      router.replace(`/widgets/nuevo/todos?type=${encodeURIComponent(type)}`);
    }
  }, [type, productId, router]);

  if (type) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          color: "#000000",
        }}
      >
        <Loader2 size={32} color="#10B981" className="animate-spin" />
        <span style={{ fontSize: "0.9rem", opacity: 0.6, fontWeight: 600 }}>
          Cargando configurador de widget...
        </span>
      </div>
    );
  }

  return (
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

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
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
            borderRadius: "16px",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#10B981";
            e.currentTarget.style.background = "#ecfdf5";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.12)";
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
              background: "#ecfdf5",
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
              Asociá widgets y ofertas a un producto en particular
            </div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            borderRadius: "16px",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#10B981";
            e.currentTarget.style.background = "#ecfdf5";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.12)";
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
              background: "#ecfdf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Store size={22} color="#10B981" />
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
              Asociá widgets globales en todo tu catálogo e inicio
            </div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

export default function WidgetsNuevoPage() {
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
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "40vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader2 size={28} color="#10B981" className="animate-spin" />
          </div>
        }
      >
        <WidgetsNuevoContent />
      </Suspense>
    </div>
  );
      }
