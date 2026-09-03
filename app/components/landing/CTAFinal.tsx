"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Rocket, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

export default function CTAFinal() {
  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        background: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: "920px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "32px",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3rem)",
          position: "relative",
          overflow: "hidden",
          border: "2px solid #10B981",
          boxShadow: "0 20px 60px rgba(16, 185, 129, 0.12)",
          boxSizing: "border-box",
        }}
      >
        {/* Orbes decorativos de fondo Verde Esmeralda */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Sparkles flotantes decorativos */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "15%", left: "8%", color: "#10B981", opacity: 0.35, pointerEvents: "none" }}
        >
          <Sparkles size={24} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", top: "20%", right: "10%", color: "#10B981", opacity: 0.35, pointerEvents: "none" }}
        >
          <Sparkles size={20} />
        </motion.div>

        {/* Contenido principal */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          
          {/* Ícono destacado */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", delay: 0.1 }}
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 1.5rem auto",
              borderRadius: "20px",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 15px 40px rgba(16, 185, 129, 0.35)",
            }}
          >
            <Rocket size={32} color="#ffffff" strokeWidth={2.5} />
          </motion.div>

          {/* Título de Alto Impacto */}
          <h2
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.85rem)",
              fontWeight: 900,
              color: "#111827",
              margin: "0 0 1rem 0",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Llevá la conversión de tu tienda al{" "}
            <span style={{ color: "#10B981" }}>máximo nivel</span>
          </h2>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              color: "#4b5563",
              lineHeight: 1.55,
              margin: "0 auto 2rem auto",
              maxWidth: "640px",
              fontWeight: 500,
            }}
          >
            Activá de inmediato el pack completo de las 27 herramientas premium de Nevux. 
            Sin letra chica, sin comisiones ocultas y diseñado para cargarse al instante en teléfonos celulares.
          </p>

          {/* TARJETA INTERNA DE PRECIOS ULTRA CLARA (ROI FOCUS) */}
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "1.75rem 1.5rem",
              maxWidth: "540px",
              margin: "0 auto 2.5rem auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#059669",
                background: "#ecfdf5",
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 800,
                marginBottom: "0.75rem",
              }}
            >
              <TrendingUp size={12} />
              <span>SE PAGA SOLA CON SOLO 1 O 2 VENTAS EXTRA</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "2.25rem", fontWeight: 900, color: "#111827" }}>$30.000 ARS</span>
              <span style={{ fontSize: "1rem", color: "#6b7280", fontWeight: 700 }}>/ mes</span>
            </div>

            <div style={{ fontSize: "0.9rem", color: "#4b5563", fontWeight: 700, marginBottom: "1rem" }}>
              Plan Único Todo Incluido • Acceso Ilimitado a los 27 Widgets
            </div>

            <div style={{ height: "1px", background: "#e5e7eb", margin: "1rem 0" }} />

            {/* Beneficios clave */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.6rem",
                textAlign: "left",
              }}
            >
              <BulletItem text="Activación instantánea en 1 clic" />
              <BulletItem text="Sin comisiones por ventas" />
              <BulletItem text="Carga ultra-veloz de 12kb" />
              <BulletItem text="Soporte prioritario por WhatsApp" />
            </div>
          </div>

          {/* Botones de Acción de Alta Conversión */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              alignItems: "center",
              maxWidth: "380px",
              margin: "0 auto",
            }}
          >
            {/* Botón Principal (Prueba Gratis) */}
            <a
              href="/registro"
              style={{
                width: "100%",
                padding: "1.1rem 2rem",
                background: "#10B981",
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "1.1rem",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              {/* Brillo animado */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                  pointerEvents: "none",
                }}
              />
              <span style={{ position: "relative", zIndex: 2 }}>Comenzar Prueba Gratis</span>
              <ArrowRight size={20} style={{ position: "relative", zIndex: 2 }} />
            </a>

            {/* Link secundario sutil */}
            <a
              href="/registro"
              style={{
                fontSize: "0.9rem",
                color: "#4b5563",
                fontWeight: 700,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              O registrate e instalá desde el App Store de Tiendanube
            </a>
          </div>

          {/* Sellos de Confianza Final */}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.25rem",
              fontSize: "0.8rem",
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <ShieldCheck size={14} color="#10B981" />
              No requiere tarjeta
            </span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              ⭐ 7 días de prueba completa
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Subcomponente de viñeta premium
function BulletItem({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.85rem",
        color: "#374151",
        fontWeight: 700,
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#ecfdf5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#10B981",
        }}
      >
        <Check size={12} strokeWidth={3} />
      </div>
      <span>{text}</span>
    </div>
  );
                  }
