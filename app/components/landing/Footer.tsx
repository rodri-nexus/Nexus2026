"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Heart } from "lucide-react";
import NevuxLogo from "./NevuxLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        padding: "3.5rem 1.25rem 1.5rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Sección superior */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Columna 1: Marca */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <NevuxLogo size="medium" />
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#000000",
                opacity: 0.6,
                lineHeight: 1.6,
                margin: "0 0 1.25rem 0",
                maxWidth: "280px",
              }}
            >
              Aumentá tu ticket promedio con widgets interactivos, bundles y
              ofertas especiales para tu Tiendanube.
            </p>

            {/* Badge Tiendanube */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.75rem",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "999px",
                fontSize: "0.75rem",
                color: "#000000",
                opacity: 0.6,
                fontWeight: 600,
              }}
            >
              <span>Hecho para</span>
              <svg
                width="75"
                height="14"
                viewBox="0 0 120 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="4" fill="#2CA9E1" />
                <circle cx="16" cy="10" r="5" fill="#0084C7" opacity="0.85" />
                <text
                  x="28"
                  y="14"
                  fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                  fontSize="12"
                  fontWeight="700"
                  fill="#0084C7"
                >
                  tiendanube
                </text>
              </svg>
            </div>
          </motion.div>

          {/* Columna 2: Producto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 style={columnTitleStyle}>Producto</h4>
            <ul style={listStyle}>
              <li>
                <Link href="/registro" style={linkStyle}>
                  Probar gratis
                </Link>
              </li>
              <li>
                <Link href="/login" style={linkStyle}>
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/registro" style={linkStyle}>
                  Crear cuenta
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Columna 3: Ayuda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 style={columnTitleStyle}>Ayuda</h4>
            <ul style={listStyle}>
              <li>
                <a
                  href="https://wa.me/5493434163999"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Soporte
                </a>
              </li>
              <li>
                <a
                  href="mailto:soportenevux@gmail.com"
                  style={linkStyle}
                >
                  Contacto
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Columna 4: Legal + WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 style={columnTitleStyle}>Legal</h4>
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
            </ul>

            {/* CTA WhatsApp (verde oficial) */}
            <a
              href="https://wa.me/5493434163999"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1.25rem",
                padding: "0.65rem 1rem",
                background: "#10B981",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s",
              }}
            >
              <MessageCircle size={16} />
              Chateanos por WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Copyright */}
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
              fontSize: "0.85rem",
              color: "#000000",
              opacity: 0.6,
              margin: 0,
              fontWeight: 500,
            }}
          >
            © {currentYear} Nevux. Todos los derechos reservados.
          </p>

          <p
            style={{
              fontSize: "0.8rem",
              color: "#000000",
              opacity: 0.5,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontWeight: 600,
            }}
          >
            Hecho con{" "}
            <Heart
              size={13}
              fill="#10B981"
              color="#10B981"
              strokeWidth={0}
            />{" "}
            en Argentina 🇦🇷
          </p>
        </div>
      </div>
    </footer>
  );
}

// Estilos compartidos
const columnTitleStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 800,
  color: "#000000",
  margin: "0 0 1rem 0",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.65rem",
};

const linkStyle: React.CSSProperties = {
  color: "#000000",
  opacity: 0.7,
  textDecoration: "none",
  fontSize: "0.9rem",
  fontWeight: 500,
  transition: "color 0.15s",
};
