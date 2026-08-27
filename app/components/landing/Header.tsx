"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, UserPlus, HelpCircle, FileText, Shield } from "lucide-react";
import NevuxLogo from "./NevuxLogo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto
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
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(229, 231, 235, 0.8)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
          padding: "0.85rem 1.25rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <NevuxLogo size="medium" />
          </Link>

          {/* Botones derecha */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Link
              href="/login"
              style={{
                padding: "0.65rem 1.5rem",
                background: "#10B981",
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                transition: "all 0.2s",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              Probar
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "12px",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#000000",
                transition: "all 0.2s",
              }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Menú lateral (drawer) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.55)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 200,
              }}
            />

            {/* Panel lateral */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(340px, 85vw)",
                background: "#ffffff",
                zIndex: 201,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.15)",
              }}
            >
              {/* Header del menú */}
              <div
                style={{
                  padding: "1.25rem",
                  borderBottom: "1px solid #f3f4f6",
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
                    background: "#ecfdf5",
                    border: "none",
                    borderRadius: "10px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#10B981",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido del menú */}
              <div
                style={{
                  flex: 1,
                  padding: "1.5rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  overflowY: "auto",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#000000",
                    opacity: 0.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: "0 0 0.5rem 0.75rem",
                  }}
                >
                  Cuenta
                </p>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={menuItemStyle}
                >
                  <LogIn size={18} color="#10B981" />
                  <span>Iniciar sesión</span>
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={menuItemStyle}
                >
                  <UserPlus size={18} color="#10B981" />
                  <span>Crear cuenta</span>
                </Link>

                <div
                  style={{
                    height: "1px",
                    background: "#f3f4f6",
                    margin: "1rem 0",
                  }}
                />

                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#000000",
                    opacity: 0.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: "0 0 0.5rem 0.75rem",
                  }}
                >
                  Ayuda
                </p>

                <a
                  href="https://wa.me/5493434163999"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  style={menuItemStyle}
                >
                  <HelpCircle size={18} color="#10B981" />
                  <span>Soporte</span>
                </a>

                <Link
                  href="/terminos"
                  onClick={() => setMenuOpen(false)}
                  style={menuItemStyle}
                >
                  <FileText size={18} color="#10B981" />
                  <span>Términos y Condiciones</span>
                </Link>

                <Link
                  href="/privacidad"
                  onClick={() => setMenuOpen(false)}
                  style={menuItemStyle}
                >
                  <Shield size={18} color="#10B981" />
                  <span>Política de Privacidad</span>
                </Link>
              </div>

              {/* CTA en el footer del menú */}
              <div
                style={{
                  padding: "1.25rem",
                  borderTop: "1px solid #f3f4f6",
                  background: "#ffffff",
                }}
              >
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.9rem",
                    background: "#10B981",
                    color: "#ffffff",
                    textAlign: "center",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  Probar gratis →
                </Link>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#000000",
                    opacity: 0.6,
                    textAlign: "center",
                    margin: "0.75rem 0 0 0",
                  }}
                >
                  7 días de prueba, sin tarjeta
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Estilo compartido para los items del menú
const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0.85rem 0.75rem",
  borderRadius: "10px",
  textDecoration: "none",
  color: "#000000",
  fontSize: "0.95rem",
  fontWeight: 600,
  transition: "background 0.15s",
};
