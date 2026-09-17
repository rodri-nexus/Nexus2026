// app/components/landing/Hero.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bot,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Clock,
  MessageCircle,
  BarChart3,
  Award,
} from "lucide-react";

/* ═══════════════════════════════════════════
   ESTILOS Y CONSTANTES (Regla #9)
═══════════════════════════════════════════ */
const badgePillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 16px",
  background: "rgba(16, 185, 129, 0.1)",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  borderRadius: "999px",
  fontSize: "0.8rem",
  color: "#10B981",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: "1.75rem",
};

const ctaPrimaryStyle: React.CSSProperties = {
  width: "min(360px, 100%)",
  padding: "1.15rem 2rem",
  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  color: "#ffffff",
  borderRadius: "999px",
  fontSize: "1.05rem",
  fontWeight: 800,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  boxShadow: "0 10px 35px -5px rgba(16, 185, 129, 0.5)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  cursor: "pointer",
};

const ctaSecondaryStyle: React.CSSProperties = {
  width: "min(280px, 100%)",
  padding: "1.15rem 1.75rem",
  background: "rgba(255, 255, 255, 0.04)",
  color: "#e5e7eb",
  borderRadius: "999px",
  fontSize: "0.95rem",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const comparisonCardStyle: React.CSSProperties = {
  background: "rgba(18, 20, 26, 0.85)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "24px",
  padding: "1.75rem",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
};

const featurePillarStyle: React.CSSProperties = {
  background: "rgba(15, 17, 23, 0.6)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "20px",
  padding: "1.75rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  textAlign: "left",
  transition: "all 0.2s ease",
};

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function Hero() {
  const [activeTab, setActiveTab] = useState<"con" | "sin">("con");

  return (
    <section
      style={{
        position: "relative",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16, 185, 129, 0.15), #07090e 70%)",
        padding: "8.5rem 1.25rem 5rem 1.25rem",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Rejilla de fondo sutil */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* Badge Oficial */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={badgePillStyle}
        >
          <Award size={14} color="#10B981" />
          <span>APP OFICIAL TIENDANUBE LATAM • ID #37382</span>
        </motion.div>

        {/* Título de Alto Impacto */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{
            fontSize: "clamp(2.3rem, 6.2vw, 4.5rem)",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            margin: "0 0 1.5rem 0",
            maxWidth: "980px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          El 97% de tus visitas se van sin comprar.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Convertilas en ventas con Nevux.
          </span>
        </motion.h1>

        {/* Subtítulo Persuasivo */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{
            fontSize: "clamp(1.05rem, 2.3vw, 1.28rem)",
            color: "#9ca3af",
            lineHeight: 1.55,
            maxWidth: "840px",
            margin: "0 auto 2.5rem auto",
            fontWeight: 400,
          }}
        >
          La suite definitiva de optimización para Tiendanube. Activá en <strong style={{ color: "#ffffff" }}>1 solo clic</strong>{" "}
          <strong style={{ color: "#10B981" }}>26 widgets de conversión probados</strong> y{" "}
          <strong style={{ color: "#ffffff" }}>6 motores de Inteligencia Artificial</strong> que eliminan dudas,
          multiplican el ticket promedio y recuperan carritos por WhatsApp en piloto automático.
        </motion.p>

        {/* Bloque de CTAs Principales */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "3.5rem",
          }}
        >
          <a href="/registro" style={ctaPrimaryStyle}>
            <span>Probar Nevux 7 Días Gratis</span>
            <ArrowRight size={18} />
          </a>

          <a href="#widgets" style={ctaSecondaryStyle}>
            <span>Explorar los 26 Widgets</span>
            <Zap size={16} color="#10B981" />
          </a>
        </motion.div>

        {/* Micro-beneficios con tildes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            fontSize: "0.85rem",
            color: "#9ca3af",
            marginBottom: "4.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>Sin tocar una sola línea de código</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>Instalación instantánea en 2 minutos</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>Sin tarjeta requerida para comenzar</span>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
           SHOWCASE COMPARATIVO: ANTES vs CON NEVUX
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.4 }}
          style={{
            maxWidth: "960px",
            margin: "0 auto 5rem auto",
          }}
        >
          <div style={comparisonCardStyle}>
            {/* Header del Simulador */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "1.25rem",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#10B981",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  IMPACTO REAL EN NÚMEROS
                </span>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    margin: "4px 0 0 0",
                  }}
                >
                  ¿Qué pasa cuando activás Nevux en tu tienda?
                </h3>
              </div>

              {/* Selector de Pestañas */}
              <div
                style={{
                  display: "inline-flex",
                  background: "rgba(0, 0, 0, 0.5)",
                  padding: "4px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <button
                  onClick={() => setActiveTab("sin")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: activeTab === "sin" ? "#ef4444" : "transparent",
                    color: activeTab === "sin" ? "#ffffff" : "#9ca3af",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Tienda Estándar
                </button>
                <button
                  onClick={() => setActiveTab("con")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: activeTab === "con" ? "#10B981" : "transparent",
                    color: activeTab === "con" ? "#ffffff" : "#9ca3af",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Con Nevux Activo ⚡
                </button>
              </div>
            </div>

            {/* Grilla de Métricas Comparativas */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                textAlign: "left",
              }}
            >
              {/* Métrica 1 */}
              <div
                style={{
                  background: activeTab === "con" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.05)",
                  border: `1px solid ${activeTab === "con" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600 }}>
                  Tasa de Conversión
                </span>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: activeTab === "con" ? "#10B981" : "#ef4444",
                    margin: "6px 0",
                  }}
                >
                  {activeTab === "con" ? "3.92%" : "1.15%"}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  {activeTab === "con" ? "🚀 +240% de visitantes compran" : "⚠️ Pérdida masiva de tráfico"}
                </span>
              </div>

              {/* Métrica 2 */}
              <div
                style={{
                  background: activeTab === "con" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.05)",
                  border: `1px solid ${activeTab === "con" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600 }}>
                  Ticket Promedio (AOV)
                </span>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: activeTab === "con" ? "#10B981" : "#ef4444",
                    margin: "6px 0",
                  }}
                >
                  {activeTab === "con" ? "$48.600" : "$31.200"}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  {activeTab === "con" ? "📦 Bundles y Cross-Selling IA" : "❌ Compras unitarias sin extras"}
                </span>
              </div>

              {/* Métrica 3 */}
              <div
                style={{
                  background: activeTab === "con" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.05)",
                  border: `1px solid ${activeTab === "con" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600 }}>
                  Carritos Recuperados
                </span>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: activeTab === "con" ? "#10B981" : "#ef4444",
                    margin: "6px 0",
                  }}
                >
                  {activeTab === "con" ? "+38.4%" : "0%"}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  {activeTab === "con" ? "🤖 NevuxBot WhatsApp CRM" : "❌ Dinero abandonado"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
           LOS 3 PILARES MAESTROS DE LA SUITE NEVUX
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Pilar 1 */}
          <div style={featurePillarStyle}>
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10B981",
                  marginBottom: "1.25rem",
                }}
              >
                <TrendingUp size={24} />
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.5rem 0" }}>
                Maximizador de Ticket Promedio
              </h4>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
                Bundles por cantidad y promocionales, calculadoras de ahorro y cupones dinámicos que motivan a tus compradores a llevarse más productos por pedido.
              </p>
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#10B981",
              }}
            >
              +35% de facturación por pedido 📈
            </div>
          </div>

          {/* Pilar 2 */}
          <div style={featurePillarStyle}>
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10B981",
                  marginBottom: "1.25rem",
                }}
              >
                <Bot size={24} />
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.5rem 0" }}>
                Ecosistema de Inteligencia Artificial
              </h4>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
                Vendedor Virtual 24/7 entrenado con tus productos, Búsqueda por Voz natural, Multi-Idioma instantáneo y NevuxBot CRM para WhatsApp.
              </p>
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#10B981",
              }}
            >
              Atención y cierre automático 🤖
            </div>
          </div>

          {/* Pilar 3 */}
          <div style={featurePillarStyle}>
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10B981",
                  marginBottom: "1.25rem",
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.5rem 0" }}>
                Urgencia, Confianza & Talles
              </h4>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
                Tablas de talles interactivas, información de compra unificada (envío + cuotas + transferencia), reseñas con foto y contadores de stock en vivo.
              </p>
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#10B981",
              }}
            >
              Cero dudas en el checkout 🛡️
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
        }
