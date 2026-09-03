"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, TrendingUp, Sparkles, Shield, ShoppingCart } from "lucide-react";

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
      {/* Luz difusa ambiental */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(700px, 100vw)",
          height: "450px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* Propuesta de Valor: Badge Dinámico */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.45rem 1rem",
            background: "#ecfdf5",
            border: "1.5px solid #a7f3d0",
            borderRadius: "999px",
            fontSize: "0.8rem",
            color: "#059669",
            fontWeight: 800,
            marginBottom: "1.5rem",
            letterSpacing: "0.02em",
          }}
        >
          <Sparkles size={14} />
          <span>LA SUITE DE CONVERSIÓN & AUMENTO DE TICKET #1 EN LATAM</span>
        </motion.div>

        {/* Título Vendedor de Alto Impacto */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(2.1rem, 6.5vw, 4.2rem)",
            fontWeight: 900,
            color: "#111827",
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
            margin: "0 0 1.25rem 0",
          }}
        >
          Convertí las visitas de tu tienda en{" "}
          <span style={{ color: "#10B981" }}>compras reales</span>
        </motion.h1>

        {/* Subtítulo enfocado en la Solución */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
            color: "#4b5563",
            lineHeight: 1.5,
            maxWidth: "760px",
            margin: "0 auto 2.5rem auto",
            fontWeight: 500,
          }}
        >
          Sin programadores ni gastar más en anuncios. Instalás en 1 clic los <b>27 widgets inteligentes</b> que 
          derriban dudas, generan urgencia y motivan a sumar más productos a cada carrito.
        </motion.p>

        {/* CTA Principal */}
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
              padding: "1.15rem 2rem",
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
              gap: "1rem",
              fontSize: "0.85rem",
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            <span>⚡ Instalación instantánea</span>
            <span>•</span>
            <span>💳 7 días de prueba sin tarjeta</span>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
           TABLERO VISUAL: CÓMO SOLUCIONA NEVUX TUS VENTAS
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            textAlign: "left",
          }}
        >
          {/* Tarjeta 1: Aumento de Ticket Promedio */}
          <div
            style={{
              background: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: "20px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "10px", color: "#10B981" }}>
                  <TrendingUp size={20} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>
                  Multiplicá el Ticket Promedio
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.45, margin: 0 }}>
                Bundles por volumen, packs complementarios y barra de envío gratis para que cada cliente gaste más en cada compra.
              </p>
            </div>
            <div style={{ marginTop: "16px", fontSize: "11px", fontWeight: 800, color: "#10B981" }}>
              +35% promedio en valor por pedido ↗
            </div>
          </div>

          {/* Tarjeta 2: Cero Dudas y Antidevoluciones */}
          <div
            style={{
              background: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: "20px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "10px", color: "#10B981" }}>
                  <Shield size={20} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>
                  Confianza Total & Menos Cambios
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.45, margin: 0 }}>
                Tabla de talles con selección de variante real en 1 clic y fotos UGC subidas por tus clientes reales.
              </p>
            </div>
            <div style={{ marginTop: "16px", fontSize: "11px", fontWeight: 800, color: "#10B981" }}>
              Elimina objeciones antes del pago 🛡️
            </div>
          </div>

          {/* Tarjeta 3: Urgencia y Ventas Rápidas */}
          <div
            style={{
              background: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: "20px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "10px", color: "#10B981" }}>
                  <Zap size={20} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>
                  Urgencia & Cierre Inmediato
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.45, margin: 0 }}>
                Contadores regresivos, avisos de stock en tiempo real y ruleta popup anti-saturación para capturar la venta antes de que se vayan.
              </p>
            </div>
            <div style={{ marginTop: "16px", fontSize: "11px", fontWeight: 800, color: "#10B981" }}>
              Menos carritos abandonados 🔥
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
        }
