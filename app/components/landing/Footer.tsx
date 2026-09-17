// app/components/landing/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Heart, ShieldCheck, Sparkles, Award } from "lucide-react";
import NevuxLogo from "./NevuxLogo";

/* ═══════════════════════════════════════════
   ESTILOS Y CONSTANTES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const containerStyle: React.CSSProperties = {
  background: "#05070a",
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "4.5rem 1.25rem 2rem 1.25rem",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#ffffff",
  position: "relative",
  overflow: "hidden",
};

const columnTitleStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 800,
  color: "#ffffff",
  margin: "0 0 1.25rem 0",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const linkStyle: React.CSSProperties = {
  color: "#9ca3af",
  textDecoration: "none",
  fontSize: "0.88rem",
  fontWeight: 500,
  transition: "color 0.2s ease",
  display: "inline-block",
};

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={containerStyle}>
      <div style={{ maxWidth: "1150px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Sección superior en grilla autoadaptable */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Columna 1: Marca y Propuesta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <NevuxLogo size="medium" />
            </div>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#9ca3af",
                lineHeight: 1.6,
                margin: "0 0 1.5rem 0",
                maxWidth: "300px",
              }}
            >
              La suite integral de optimización para Tiendanube. 26 widgets de conversión probados y asistentes de Inteligencia Artificial para multiplicar tu ticket promedio.
            </p>

            {/* Badge Oficial Tiendanube */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "999px",
                fontSize: "0.75rem",
                color: "#d1d5db",
                fontWeight: 600,
              }}
            >
              <Award size={14} color="#10B981" />
              <span>App Oficial Tiendanube • ID #37382</span>
            </div>
          </motion.div>

          {/* Columna 2: Ecosistema de Conversión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 style={columnTitleStyle}>Ecosistema</h4>
            <ul style={listStyle}>
              <li>
                <a href="#widgets" style={linkStyle}>
                  26 Widgets de Conversión
                </a>
              </li>
              <li>
                <a href="#ia" style={linkStyle}>
                  NevuxBot CRM WhatsApp
                </a>
              </li>
              <li>
                <a href="#ia" style={linkStyle}>
                  Vendedor Virtual con IA
                </a>
              </li>
              <li>
                <a href="#ia" style={linkStyle}>
                  Búsqueda por Voz Inteligente
                </a>
              </li>
              <li>
                <a href="#estilo" style={linkStyle}>
                  Modo Fechas Especiales 3.0
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Columna 3: Plataforma */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 style={columnTitleStyle}>Plataforma</h4>
            <ul style={listStyle}>
              <li>
                <Link href="/registro" style={linkStyle}>
                  Prueba Gratis (7 Días)
                </Link>
              </li>
              <li>
                <Link href="/login" style={linkStyle}>
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <a href="#precios" style={linkStyle}>
                  Precios ($35.000 ARS)
                </a>
              </li>
              <li>
                <Link href="/registro" style={linkStyle}>
                  Crear Cuenta Nueva
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Columna 4: Soporte & Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 style={columnTitleStyle}>Soporte & Legal</h4>
            <ul style={listStyle}>
              <li>
                <Link href="/terminos" style={linkStyle}>
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" style={linkStyle}>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <a href="mailto:soportenevux@gmail.com" style={linkStyle}>
                  soportenevux@gmail.com
                </a>
              </li>
            </ul>

            {/* CTA WhatsApp Oficial */}
            <a
              href="https://wa.me/5493434163999"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "1.25rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#10B981",
                borderRadius: "14px",
                fontSize: "0.85rem",
                fontWeight: 800,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <MessageCircle size={16} />
              <span>Soporte por WhatsApp</span>
            </a>
          </motion.div>
        </div>

        {/* Divisor sutil */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
            marginBottom: "2rem",
          }}
        />

        {/* Copyright y Créditos */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: "#6b7280",
              margin: 0,
              fontWeight: 500,
            }}
          >
            © {currentYear} Nevux. Todos los derechos reservados.
          </p>

          <p
            style={{
              fontSize: "0.82rem",
              color: "#6b7280",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontWeight: 600,
            }}
          >
            Impulsando el comercio electrónico con{" "}
            <Heart size={13} fill="#10B981" color="#10B981" strokeWidth={0} /> en Argentina 🇦🇷 y LATAM
          </p>
        </div>
      </div>
    </footer>
  );
  }
