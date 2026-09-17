// app/components/landing/CTAFinal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  Rocket,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Zap,
  Globe,
  HelpCircle,
  ChevronDown,
  Lock,
  Headphones,
  Award,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface FAQItem {
  question: string;
  answer: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES Y ESTILOS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const FAQ_LIST: FAQItem[] = [
  {
    question: "¿Afecta la velocidad de carga de mi Tiendanube?",
    answer:
      "No. El motor de Nevux está optimizado con CDN global y carga de forma asíncrona en milisegundos. Tu tienda mantendrá la misma velocidad y puntaje en Google PageSpeed.",
  },
  {
    question: "¿Necesito conocimientos técnicos o programar código?",
    answer:
      "Cero. La instalación se realiza en un solo clic desde el App Store oficial de Tiendanube. Los widgets y asistentes de IA se activan mediante interruptores visuales intuitivos.",
  },
  {
    question: "¿Cómo funciona la prueba gratis de 7 días?",
    answer:
      "Tenés acceso total e ilimitado a los 26 widgets y a toda la suite de Inteligencia Artificial durante 7 días corridos. No te pedimos tarjeta de crédito para comenzar.",
  },
  {
    question: "¿Cobran comisión por las ventas que genere Nevux?",
    answer:
      "Ninguna comisión. Todo el dinero extra que ganes con bundles, ventas por WhatsApp o aumento de ticket promedio es 100% tuyo.",
  },
];

const containerStyle: React.CSSProperties = {
  position: "relative",
  background: "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(16, 185, 129, 0.15), #07090e 80%)",
  padding: "6rem 1.25rem 7rem 1.25rem",
  overflow: "hidden",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#ffffff",
};

const masterCardStyle: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  background: "rgba(18, 20, 26, 0.85)",
  borderRadius: "32px",
  padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 3rem)",
  position: "relative",
  overflow: "hidden",
  border: "1px solid rgba(16, 185, 129, 0.35)",
  boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxSizing: "border-box",
};

const pricingBoxStyle: React.CSSProperties = {
  background: "rgba(10, 12, 16, 0.9)",
  border: "1.5px solid rgba(16, 185, 129, 0.4)",
  borderRadius: "24px",
  padding: "2.25rem 1.75rem",
  maxWidth: "680px",
  margin: "0 auto 3rem auto",
  textAlign: "center",
  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
};

const featureItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  fontSize: "0.88rem",
  color: "#d1d5db",
  fontWeight: 600,
  textAlign: "left",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTES (Regla #9 al inicio)
═══════════════════════════════════════════ */
function FeatureBullet({ text }: { text: string }) {
  return (
    <div style={featureItemStyle}>
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#10B981",
        }}
      >
        <Check size={13} strokeWidth={3} />
      </div>
      <span>{text}</span>
    </div>
  );
}

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "rgba(18, 20, 26, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          background: "transparent",
          border: "none",
          color: "#ffffff",
          fontSize: "0.98rem",
          fontWeight: 700,
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span>{item.question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "#10B981", flexShrink: 0 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              style={{
                padding: "0 1.25rem 1.25rem 1.25rem",
                fontSize: "0.9rem",
                color: "#9ca3af",
                lineHeight: 1.55,
                borderTop: "1px solid rgba(255, 255, 255, 0.04)",
                paddingTop: "0.75rem",
              }}
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CTAFinal() {
  return (
    <section id="precios" style={containerStyle}>
      {/* ═══════════════════════════════════════════
         SECCIÓN 1: DERRIBO DE OBJECIONES (FAQ)
      ═══════════════════════════════════════════ */}
      <div style={{ maxWidth: "800px", margin: "0 auto 5rem auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#10B981",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.75rem",
            }}
          >
            <HelpCircle size={13} />
            <span>RESPUESTAS CLARAS</span>
          </div>
          <h3
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Preguntas Frecuentes
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {FAQ_LIST.map((faq, index) => (
            <FAQAccordionItem key={index} item={faq} />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
         SECCIÓN 2: TARJETA MAESTRA DE PRECIOS & CIERRE
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={masterCardStyle}
      >
        {/* Orbes de resplandor ambiental */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          {/* Badge Oficial */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "999px",
              fontSize: "0.78rem",
              color: "#10B981",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "1.25rem",
            }}
          >
            <Award size={14} />
            <span>PLAN ÚNICO PROFESIONAL • ACCESO TOTAL</span>
          </div>

          {/* Título de Alto Impacto */}
          <h2
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 1rem 0",
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
            }}
          >
            Comenzá a multiplicar las ventas de tu tienda{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              hoy mismo
            </span>
          </h2>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "#9ca3af",
              lineHeight: 1.55,
              margin: "0 auto 2.5rem auto",
              maxWidth: "700px",
            }}
          >
            Activá los <strong style={{ color: "#ffffff" }}>26 widgets de conversión</strong> y la <strong style={{ color: "#10B981" }}>suite de Inteligencia Artificial</strong> en menos de 2 minutos. Sin contratos forzosos, sin comisiones sobre tus pedidos.
          </p>

          {/* TARJETA DE PRECIOS TRANSPARENTE */}
          <div style={pricingBoxStyle}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#10B981",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              <TrendingUp size={13} />
              <span>SE PAGA SOLA CON 1 O 2 VENTAS EXTRA AL MES</span>
            </div>

            {/* Precio Principal ARS */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: "0.4rem",
                marginBottom: "0.35rem",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 3.8rem)",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                }}
              >
                $35.000 ARS
              </span>
              <span style={{ fontSize: "1.1rem", color: "#9ca3af", fontWeight: 700 }}>
                / mes
              </span>
            </div>

            {/* Monedas Internacionales */}
            <div
              style={{
                fontSize: "0.82rem",
                color: "#9ca3af",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              🌐 Internacional: <strong>USD $30</strong> • Brasil: <strong>R$160</strong> • México: <strong>MXN $600</strong> • Chile: <strong>CLP $28k</strong> • Colombia: <strong>COP $120k</strong>
            </div>

            <div
              style={{
                height: "1px",
                background: "rgba(255, 255, 255, 0.08)",
                margin: "1.5rem 0",
              }}
            />

            {/* Grilla de Todo lo Incluido */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.85rem",
                marginBottom: "2rem",
              }}
            >
              <FeatureBullet text="26 Widgets de conversión activos" />
              <FeatureBullet text="NevuxBot CRM (WhatsApp 1 Clic)" />
              <FeatureBullet text="Vendedor Virtual 24/7 con IA" />
              <FeatureBullet text="Búsqueda por Voz en celulares" />
              <FeatureBullet text="Modo Fechas Especiales 3.0" />
              <FeatureBullet text="Multi-Idioma Automático (PT/EN)" />
              <FeatureBullet text="ROI Analytics en tiempo real" />
              <FeatureBullet text="Soporte prioritario por WhatsApp" />
            </div>

            {/* Botón CTA Gigante */}
            <a
              href="/registro"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                maxWidth: "420px",
                padding: "1.2rem 2rem",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "1.1rem",
                fontWeight: 900,
                textDecoration: "none",
                boxShadow: "0 10px 35px rgba(16, 185, 129, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxSizing: "border-box",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span>Probar Nevux 7 Días Gratis</span>
              <ArrowRight size={20} />
            </a>

            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.8rem",
                color: "#9ca3af",
                fontWeight: 600,
              }}
            >
              ⚡ Activación instantánea • Sin ingresar tarjeta de crédito
            </div>
          </div>

          {/* Sellos de Confianza y Seguridad */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              fontSize: "0.85rem",
              color: "#9ca3af",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>Garantía de Satisfacción</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Lock size={16} color="#10B981" />
              <span>Cancelá en cualquier momento en 1 clic</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Headphones size={16} color="#10B981" />
              <span>Asistencia humana por WhatsApp</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
           }
