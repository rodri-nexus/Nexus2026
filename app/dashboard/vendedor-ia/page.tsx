// app/dashboard/vendedor-ia/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  MessageCircle,
  User,
  ShoppingBag,
  Zap,
  Lock,
  X,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES
═══════════════════════════════════════════ */
type PersonalityType = "friendly" | "expert" | "dynamic";

interface VirtualSalesmanConfig {
  is_active: boolean;
  agent_name: string;
  welcome_message: string;
  agent_avatar: string;
  personality: PersonalityType;
  whatsapp_number: string;
  enable_whatsapp_escalation: boolean;
  theme_color: string;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  showWhatsappBtn?: boolean;
}

interface UserStore {
  store_id: number;
  user_id: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES Y AVATARES
═══════════════════════════════════════════ */
const AVATAR_OPTIONS = ["👩‍💼", "👨‍💼", "🤖", "🛍️", "⚡", "💎"];

const PERSONALITY_OPTIONS: { id: PersonalityType; title: string; desc: string }[] = [
  {
    id: "friendly",
    title: "Amigable y Cálido (Humano)",
    desc: "Tono empático, cercano y fluido, ideal para orientar y resolver dudas.",
  },
  {
    id: "expert",
    title: "Asesor Técnico Experto",
    desc: "Tono profesional y preciso, enfocado en especificaciones de producto.",
  },
  {
    id: "dynamic",
    title: "Vendedor Dinámico & Promos",
    desc: "Destaca facilidades de pago, cuotas sin interés y envíos gratis.",
  },
];

const DEFAULT_CONFIG: VirtualSalesmanConfig = {
  is_active: true,
  agent_name: "Sofía (Asesora Virtual)",
  welcome_message: "¡Hola! 👋 ¿Buscás algo en especial hoy? Contame y te ayudo a encontrar el producto ideal.",
  agent_avatar: "👩‍💼",
  personality: "friendly",
  whatsapp_number: "",
  enable_whatsapp_escalation: true,
  theme_color: "#10B981",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: SIMULADOR DE CHAT EN VIVO CON IA (DESHABILITADO)
═══════════════════════════════════════════ */
function VirtualSalesmanChatSimulator({
  config,
  storeId,
}: {
  config: VirtualSalesmanConfig;
  storeId: number | string | null;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "540px",
        position: "relative",
      }}
    >
      {/* Header del Chat */}
      <div
        style={{
          background: "#6b7280",
          color: "#ffffff",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            flexShrink: 0,
          }}
        >
          🔒
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 800,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {config.agent_name}
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#f59e0b",
                display: "inline-block",
              }}
            />
            En Calibración y Mantenimiento
          </div>
        </div>
      </div>

      {/* Cuerpo del Chat Bloqueado */}
      <div
        style={{
          flex: 1,
          padding: "1.5rem",
          background: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lock size={26} color="#f97316" />
        </div>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#374151" }}>
            Simulador Fuera de Servicio
          </div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "4px" }}>
            Hacé clic en cualquier lugar para ver el estado de mantenimiento.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function VendedorIaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [config, setConfig] = useState<VirtualSalesmanConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  // Cargar usuario y configuración previa
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          setUserEmail(user.email || "");

          const { data: storeData } = await supabase
            .from("stores")
            .select("store_id, user_id")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .maybeSingle();

          if (storeData && isMounted) {
            setStore(storeData);
          }
        }
      } catch (err) {
        console.error("Error inicializando Vendedor Virtual IA:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
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

      {/* CONTENIDO PRINCIPAL APAGADO Y DESHABILITADO CON ACCIÓN DE CLIC */}
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
              background: "#f9fafb",
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
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            Asistente conversacional en etapa de optimización y pruebas de precisión humana.
          </p>
        </div>

        {/* ESTRUCTURA FANTASMA APAGADA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* COLUMNA IZQUIERDA: CONFIGURADOR DESHABILITADO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>
                  Vendedor Virtual Desactivado
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                  Mantenimiento programado de motor de IA
                </div>
              </div>
              <Lock size={20} color="#9ca3af" />
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Nombre del Asesor
                </label>
                <input
                  type="text"
                  disabled
                  value={config.agent_name}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    background: "#f3f4f6",
                  }}
                />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: SIMULADOR DE CHAT BLOQUEADO */}
          <div style={{ position: "sticky", top: "2rem", pointerEvents: "none" }}>
            <VirtualSalesmanChatSimulator config={config} storeId={store?.store_id || null} />
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

              {/* MENSAJE PROFESIONAL */}
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
