"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, ArrowRight, Star, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        background: "#ffffff",
        padding: "8.5rem 1.25rem 4rem 1.25rem",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Luces decorativas de fondo premium */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(600px, 100vw)",
          height: "400px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* Badge de App Aprobada Oficial */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "999px",
            fontSize: "0.8rem",
            color: "#059669",
            fontWeight: 800,
            marginBottom: "1.5rem",
            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.05)",
          }}
        >
          <ShieldCheck size={14} />
          <span>APP OFICIAL APROBADA EN TIENDANUBE (ID: 37382)</span>
        </motion.div>

        {/* Título Principal de Alto Impacto */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(2.1rem, 6.5vw, 4rem)",
            fontWeight: 900,
            color: "#111827",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: "0 0 1.25rem 0",
          }}
        >
          Multiplica el{" "}
          <span
            style={{
              color: "#10B981",
              position: "relative",
              display: "inline-block",
            }}
          >
            ticket promedio
          </span>{" "}
          y las ventas de tu tienda
        </motion.h1>

        {/* Subtítulo de Conversión */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
            color: "#4b5563",
            lineHeight: 1.5,
            maxWidth: "740px",
            margin: "0 auto 2.5rem auto",
            fontWeight: 500,
          }}
        >
          Instala en un clic **los 27 widgets premium de conversión** más potentes de LATAM.
          Sin programar, sin diseñadores y con carga ultra-rápida garantizada.
        </motion.p>

        {/* CTAs de Conversión */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "3.5rem",
          }}
        >
          <a
            href="/registro"
            style={{
              width: "min(340px, 90vw)",
              padding: "1.1rem 2rem",
              background: "#10B981",
              color: "#ffffff",
              borderRadius: "999px",
              fontSize: "1.1rem",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <span>Probar Nevux Gratis</span>
            <ArrowRight size={18} />
          </a>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              fontSize: "0.85rem",
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              ⭐ 7 días de prueba gratis
            </span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              ⚡ Configuración en 2 minutos
            </span>
          </div>
        </motion.div>

        {/* Grid de Beneficios Core en 1 sola fila/carrusel limpio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "1.5rem",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div
              style={{
                background: "#ecfdf5",
                padding: "0.5rem",
                borderRadius: "10px",
                color: "#10B981",
                display: "flex",
              }}
            >
              <Zap size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827", marginBottom: "0.15rem" }}>
                Velocidad Imbatible
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                1 único script unificado de 12kb. No frena tu checkout.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div
              style={{
                background: "#ecfdf5",
                padding: "0.5rem",
                borderRadius: "10px",
                color: "#10B981",
                display: "flex",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827", marginBottom: "0.15rem" }}>
                27 Soluciones Premium
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                Desde ruleta interactiva hasta bundles inteligentes.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div
              style={{
                background: "#ecfdf5",
                padding: "0.5rem",
                borderRadius: "10px",
                color: "#10B981",
                display: "flex",
              }}
            >
              <Star size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827", marginBottom: "0.15rem" }}>
                Plan Todo Incluido
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                Un solo precio mensual fijo. Sin comisiones por ventas.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
            }
