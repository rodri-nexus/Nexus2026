// app/dashboard/vendedor-ia/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Lock,
  X,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

export default function VendedorIaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user.email || "");
        }
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    }
    init();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
      }}
    >
      <DashboardHeader email={userEmail} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* CONTENIDO PRINCIPAL APAGADO Y DESHABILITADO */}
      <main
        onClick={() => setShowModal(true)}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
          boxSizing: "border-box",
          filter: "grayscale(0.85)",
          opacity: 0.5,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* BREADCRUMB */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#6b7280",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
            }}
          >
            <ArrowLeft size={15} />
            Volver al Dashboard
          </div>
        </div>

        {/* ENCABEZADO CON BADGE DE MANTENIMIENTO */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#d97706",
              fontWeight: 800,
              marginBottom: "0.6rem",
              background: "rgba(217, 119, 6, 0.12)",
              border: "1px solid rgba(217, 119, 6, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Lock size={13} color="#d97706" />
            Función en Calibración y Mantenimiento
          </div>

          <h1
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.85rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#374151",
            }}
          >
            Vendedor Virtual IA & Cierre WhatsApp 🔒
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#9ca3af",
              lineHeight: 1.5,
            }}
          >
            Asistente conversacional en etapa de optimización y pruebas de precisión humana.
          </p>
        </div>

        {/* ESTRUCTURA FANTASMA / DESHABILITADA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* PANEL CONFIGURACIÓN BLOQUEADO */}
          <div
            style={{
              background: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#6b7280" }}>
                Ajustes del Asesor (Bloqueado)
              </span>
              <Lock size={16} color="#9ca3af" />
            </div>
            <div
              style={{
                height: "180px",
                background: "#f3f4f6",
                borderRadius: "12px",
                border: "1px dashed #d1d5db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Mantenimiento programado de motor de IA
            </div>
          </div>

          {/* SIMULADOR BLOQUEADO */}
          <div
            style={{
              height: "450px",
              background: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: "22px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              color: "#9ca3af",
            }}
          >
            <Wrench size={36} color="#9ca3af" />
            <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>
              Simulador temporalmente fuera de servicio
            </span>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: "3rem" }}>
          <CentroAyuda />
        </div>
      </main>

      {/* MODAL FLOTANTE PROFESIONAL CENTRADO CON FONDO BORROSO */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.25rem",
              boxSizing: "border-box",
              background: "rgba(11, 17, 32, 0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "460px",
                background: "#ffffff",
                borderRadius: "24px",
                padding: "2.25rem 1.75rem 2rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
                boxSizing: "border-box",
                textAlign: "center",
                border: "1px solid rgba(229, 231, 235, 0.8)",
              }}
            >
              {/* BOTÓN CERRAR "X" */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(false);
                }}
                style={{
                  position: "absolute",
                  top: "1.1rem",
                  right: "1.1rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#4b5563",
                  transition: "background 0.15s ease",
                }}
              >
                <X size={18} />
              </button>

              {/* ICONO DE MANTENIMIENTO / CANDADO CON GLOW */}
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                  border: "1px solid #fed7aa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  boxShadow: "0 10px 25px -3px rgba(249, 115, 22, 0.15)",
                }}
              >
                <Lock size={32} color="#f97316" />
              </div>

              {/* TÍTULO */}
              <h2
                style={{
                  margin: "0 0 0.6rem 0",
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                }}
              >
                Función en Calibración Final
              </h2>

              {/* MENTANSAJE PROFESIONAL */}
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  fontSize: "0.88rem",
                  color: "#4b5563",
                  lineHeight: 1.6,
                }}
              >
                Estamos optimizando nuestro algoritmo de Inteligencia Artificial para garantizar conversaciones 100% precisas, humanas y sin margen de error al interactuar con el catálogo de tu tienda.
                <br /><br />
                Esta herramienta estará disponible muy pronto con el estándar de excelencia de <strong>Nevux</strong>.
              </p>

              {/* BOTONES DE ACCIÓN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: "14px",
                    border: "none",
                    background: "#111827",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(17, 24, 39, 0.2)",
                  }}
                >
                  Entendido, cerrar
                </button>

                <Link
                  href="/dashboard"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    background: "#f9fafb",
                    color: "#4b5563",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    boxSizing: "border-box",
                  }}
                >
                  Volver al Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
            }
