"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  HelpCircle,
  FileText,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import NevuxLogo from "./NevuxLogo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: scrolled ? "12px" : "0px",
          left: 0,
          right: 0,
          zIndex: 100,
          maxWidth: "1200px",
          margin: "0 auto",
          width: scrolled ? "calc(100% - 24px)" : "100%",
          background: scrolled
            ? "rgba(10, 10, 10, 0.8)"
            : "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: scrolled
            ? "1px solid rgba(16, 185, 129, 0.25)"
            : "1px solid transparent",
          borderRadius: scrolled ? "24px" : "0px",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          padding: scrolled ? "0.65rem 1.5rem" : "1.25rem 1.5rem",
          boxShadow: scrolled
            ? "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.1)"
            : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          {/* Logo Premium */}
          <a
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <NevuxLogo size="medium" />
          </a>

          {/* Menú Desktop (Oculto en mobile) */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: "2rem",
            }}
            className="md:flex"
          >
            <a href="#problema" style={navLinkStyle}>El Dolor</a>
            <a href="#widgets" style={navLinkStyle}>Widgets Activos</a>
            <a href="#ia" style={navLinkStyle}>Ecosistema IA</a>
            <a href="#precios" style={navLinkStyle}>Precios</a>
          </nav>

          {/* Estado en vivo + CTAs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Indicador de Tiendas Activas (En vivo) */}
            <div
              style={{
                display: "none",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "999px",
              }}
              className="lg:flex"
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#10B981",
                  borderRadius: "50%",
                  boxShadow: "0 0 10px #10B981",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#10B981",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                1.842 tiendas vendiendo hoy
              </span>
            </div>

            {/* Iniciar Sesión Desktop */}
            <a
              href="/login"
              style={{
                display: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#9ca3af",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              className="md:inline-block hover:text-white"
            >
              Ingresar
            </a>

            {/* Botón CTA de Conversión Lujoso */}
            <a
              href="/registro"
              style={{
                padding: "0.65rem 1.5rem",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "0.9rem",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span>Probar Gratis</span>
              <ArrowRight size={14} />
            </a>

            {/* Botón de Menú Hamburguesa */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#ffffff",
                transition: "all 0.2s",
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Móvil de Lujo */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                zIndex: 200,
              }}
            />

            {/* Panel Lateral Oscuro */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(340px, 85vw)",
                background: "#0a0a0a",
                borderLeft: "1px solid rgba(16, 185, 129, 0.2)",
                zIndex: 201,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* Header Drawer */}
              <div
                style={{
                  padding: "1.5rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <NevuxLogo size="medium" />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar menú"
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "none",
                    borderRadius: "12px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#10B981",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contenido Drawer */}
              <div
                style={{
                  flex: 1,
                  padding: "2rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  overflowY: "auto",
                }}
              >
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#10B981",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0 0 0.5rem 0.5rem",
                  }}
                >
                  Navegación
                </p>

                <a href="#problema" onClick={() => setMenuOpen(false)} style={menuItemStyle}>
                  El Dolor
                </a>
                <a href="#widgets" onClick={() => setMenuOpen(false)} style={menuItemStyle}>
                  Widgets Activos
                </a>
                <a href="#ia" onClick={() => setMenuOpen(false)} style={menuItemStyle}>
                  Ecosistema IA
                </a>
                <a href="#precios" onClick={() => setMenuOpen(false)} style={menuItemStyle}>
                  Precios
                </a>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255, 255, 255, 0.05)",
                    margin: "1.5rem 0",
                  }}
                />

                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0 0 0.5rem 0.5rem",
                  }}
                >
                  Plataforma
                </p>

                <a href="/login" onClick={() => setMenuOpen(false)} style={menuItemStyle}>
                  <LogIn size={16} color="#10B981" />
                  <span>Iniciar Sesión</span>
                </a>

                <a href="/registro" onClick={() => setMenuOpen(false)} style={menuItemStyle}>
                  <UserPlus size={16} color="#10B981" />
                  <span>Crear Cuenta</span>
                </a>

                <a
                  href="https://wa.me/5493434163999"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  style={menuItemStyle}
                >
                  <HelpCircle size={16} color="#10B981" />
                  <span>Soporte WhatsApp</span>
                </a>
              </div>

              {/* Footer Drawer */}
              <div
                style={{
                  padding: "1.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  background: "rgba(0, 0, 0, 0.4)",
                }}
              >
                <a
                  href="/registro"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "1rem",
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    color: "#ffffff",
                    textAlign: "center",
                    borderRadius: "14px",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <span>Probar 7 Días Gratis</span>
                  <ArrowRight size={16} />
                </a>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    textAlign: "center",
                    margin: "0.75rem 0 0 0",
                    fontWeight: 500,
                  }}
                >
                  Instalación instantánea sin código.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* Estilos auxiliares limpios y consistentes */
const navLinkStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#9ca3af",
  textDecoration: "none",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "0.85rem 1rem",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#e5e7eb",
  fontSize: "0.95rem",
  fontWeight: 600,
  transition: "all 0.15s ease",
  background: "transparent",
};
