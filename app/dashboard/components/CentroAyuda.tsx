"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function CentroAyuda() {
  const whatsappUrl =
    "https://wa.me/5493434163999?text=Hola%20Nevux!%20%F0%9F%91%8B%20Estoy%20creando%20un%20widget%20en%20mi%20tienda%20y%20tengo%20una%20duda.%20%C2%BFMe%20ayudan%20paso%20a%20paso%3F";

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "20px",
        padding: "clamp(1.25rem, 4vw, 2rem)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Luz decorativa sutil */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header con Logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "0.6rem" }}>
          <NevuxLogo size="medium" />
        </div>

        <h2
          style={{
            margin: "0 0 0.35rem 0",
            fontSize: "1.15rem",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.01em",
          }}
        >
          Centro de Ayuda & Asistencia
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#6b7280",
            maxWidth: "380px",
            lineHeight: 1.4,
          }}
        >
          ¿Tenés dudas o querés que tu widget quede perfecto? Estamos acá para ayudarte.
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          PASO A PASO: CÓMO ACTIVAR TU WIDGET
      ═══════════════════════════════════════════ */}
      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "1rem 1.15rem",
          marginBottom: "1.25rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 800,
            color: "#111827",
            marginBottom: "0.65rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Sparkles size={14} color="#10B981" />
          <span>¿Cómo configurar tu widget en 3 pasos?</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: "#4b5563" }}>
            <span style={{ fontWeight: 800, color: "#10B981" }}>1.</span>
            <span>Ajustá los textos, títulos y colores a juego con el diseño de tu marca.</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: "#4b5563" }}>
            <span style={{ fontWeight: 800, color: "#10B981" }}>2.</span>
            <span>Verificá que el interruptor <b>"Widget activo"</b> esté en verde.</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: "#4b5563" }}>
            <span style={{ fontWeight: 800, color: "#10B981" }}>3.</span>
            <span>Tocá <b>"Guardar cambios"</b> y miralo funcionando al instante en tu tienda.</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TARJETA DE SOPORTE POR WHATSAPP (CÁLIDA Y DIRECTA)
      ═══════════════════════════════════════════ */}
      <div
        style={{
          background: "#ecfdf5",
          border: "1.5px solid #a7f3d0",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.25rem",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "#065f46",
            marginBottom: "0.35rem",
          }}
        >
          💚 ¡No estás solo! Te ayudamos paso a paso
        </div>

        <p
          style={{
            fontSize: "0.82rem",
            color: "#047857",
            lineHeight: 1.45,
            margin: "0 0 1rem 0",
          }}
        >
          Si no sabés cómo crear tu widget, tenés dudas con las opciones o querés que te demos una mano para dejarlo impecable, escribinos directo por WhatsApp.
        </p>

        {/* Botón WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "#10B981",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
            transition: "all 0.2s ease",
            cursor: "pointer",
            width: "100%",
            maxWidth: "320px",
            boxSizing: "border-box",
          }}
        >
          <MessageCircle size={18} />
          <span>Escribinos al WhatsApp Oficial</span>
        </a>
      </div>

      {/* ═══════════════════════════════════════════
          ENLACES COMPLEMENTARIOS DE AYUDA
      ═══════════════════════════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Link
          href="/ayuda/guia"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            padding: "0.6rem 0.75rem",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#374151",
            textDecoration: "none",
          }}
        >
          <BookOpen size={14} color="#10B981" />
          <span>Guía de inicio</span>
        </Link>

        <Link
          href="/ayuda/faq"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            padding: "0.6rem 0.75rem",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#374151",
            textDecoration: "none",
          }}
        >
          <HelpCircle size={14} color="#10B981" />
          <span>Preguntas frecuentes</span>
        </Link>

        <a
          href="mailto:soportenevux@gmail.com"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            padding: "0.6rem 0.75rem",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#374151",
            textDecoration: "none",
          }}
        >
          <Mail size={14} color="#10B981" />
          <span>Email de soporte</span>
        </a>
      </div>
    </motion.section>
  );
            }
