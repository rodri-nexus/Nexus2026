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
  Eye,
  Send,
  MessageCircle,
  User,
  ShoppingBag,
  Zap,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
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
   CONSTANTES Y AVATARES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const AVATAR_OPTIONS = ["👩‍💼", "👨‍💼", "🤖", "🛍️", "⚡", "💎"];

const PERSONALITY_OPTIONS: { id: PersonalityType; title: string; desc: string }[] = [
  {
    id: "friendly",
    title: "Amigable y Cálido",
    desc: "Tono cercano con emojis, ideal para moda, deco y regalos.",
  },
  {
    id: "expert",
    title: "Asesor Técnico Experto",
    desc: "Tono profesional y preciso, ideal para tecnología, belleza y salud.",
  },
  {
    id: "dynamic",
    title: "Vendedor Dinámico & Promos",
    desc: "Enfocado en ofertas, cupones y sentido de urgencia para compras rápidas.",
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
   SUB-COMPONENTE: SIMULADOR DE CHAT EN VIVO
═══════════════════════════════════════════ */
function VirtualSalesmanChatSimulator({
  config,
}: {
  config: VirtualSalesmanConfig;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Reiniciar chat cuando cambia el mensaje de bienvenida o avatar
  useEffect(() => {
    setMessages([
      {
        id: "msg-welcome",
        sender: "bot",
        text: config.welcome_message,
        timestamp: "Ahora",
      },
    ]);
  }, [config.welcome_message]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: "Ahora",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulación de respuesta inteligente
    setTimeout(() => {
      let botReply = "¡Excelente elección! Tenemos opciones destacadas en stock con envío inmediato. ¿Te gustaría que te recomiende los modelos más vendidos?";
      const lower = text.toLowerCase();

      if (lower.includes("precio") || lower.includes("cuanto") || lower.includes("cuánto")) {
        botReply = "Los precios varían según el modelo, ¡y actualmente contás con promos especiales y cuotas sin interés en toda la tienda! 🎁";
      } else if (lower.includes("envio") || lower.includes("envío") || lower.includes("donde")) {
        botReply = "Hacemos envíos rápidos a todo el país. Si superás el monto mínimo tenés envío 100% gratis a tu domicilio 🚚.";
      } else if (lower.includes("humano") || lower.includes("whatsapp") || lower.includes("asesor")) {
        botReply = "¡Claro que sí! Podés continuar esta charla directamente por WhatsApp con nuestro equipo humano para una atención personalizada.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: botReply,
          timestamp: "Ahora",
          showWhatsappBtn: config.enable_whatsapp_escalation && !!config.whatsapp_number,
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

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
      }}
    >
      {/* Header del Chat */}
      <div
        style={{
          background: config.theme_color,
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
          {config.agent_avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {config.agent_name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            En línea en tu tienda
          </div>
        </div>
      </div>

      {/* Cuerpo del Chat */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          background: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: m.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: "0.75rem 1rem",
                borderRadius: m.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.sender === "user" ? config.theme_color : "#ffffff",
                color: m.sender === "user" ? "#ffffff" : "#111827",
                fontSize: "0.84rem",
                lineHeight: 1.45,
                border: m.sender === "user" ? "none" : "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              }}
            >
              {m.text}
            </div>

            {/* Botón de Derivación a WhatsApp dentro del mensaje */}
            {m.showWhatsappBtn && (
              <a
                href={`https://wa.me/${config.whatsapp_number.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  marginTop: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "#25D366",
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)",
                }}
              >
                <MessageCircle size={14} />
                Continuar por WhatsApp
              </a>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#6b7280", fontStyle: "italic" }}>
              {config.agent_name} está escribiendo...
            </span>
          </div>
        )}
      </div>

      {/* Botones de Preguntas Rápidas */}
      <div style={{ padding: "0.5rem 0.75rem", background: "#ffffff", borderTop: "1px solid #f3f4f6", display: "flex", gap: "6px", overflowX: "auto" }}>
        {["¿Tienen cuotas?", "¿Hacen envíos?", "Ver más vendidos"].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            style={{
              whiteSpace: "nowrap",
              padding: "0.35rem 0.65rem",
              borderRadius: "999px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input de Envío */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          padding: "0.75rem 1rem",
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Escribí un mensaje de prueba..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            flex: 1,
            padding: "0.65rem 0.85rem",
            borderRadius: "10px",
            border: "1.5px solid #e5e7eb",
            fontSize: "0.85rem",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          type="submit"
          style={{
            background: config.theme_color,
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Send size={16} />
        </button>
      </form>
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
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

            const res = await fetch(`/api/ai/virtual-salesman?store_id=${storeData.store_id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.settings) {
                setConfig({
                  is_active: data.settings.is_active ?? true,
                  agent_name: data.settings.agent_name || DEFAULT_CONFIG.agent_name,
                  welcome_message: data.settings.welcome_message || DEFAULT_CONFIG.welcome_message,
                  agent_avatar: data.settings.agent_avatar || DEFAULT_CONFIG.agent_avatar,
                  personality: data.settings.personality || DEFAULT_CONFIG.personality,
                  whatsapp_number: data.settings.whatsapp_number || "",
                  enable_whatsapp_escalation: data.settings.enable_whatsapp_escalation ?? true,
                  theme_color: data.settings.theme_color || DEFAULT_CONFIG.theme_color,
                });
              }
            }
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

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.store_id,
          ...config,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setFeedback({
        type: "success",
        message: "¡Vendedor Virtual IA guardado y configurado con éxito!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardHeader email={userEmail} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
          boxSizing: "border-box",
        }}
      >
        {/* BREADCRUMB */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#6b7280",
              textDecoration: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              transition: "all 0.15s ease",
            }}
          >
            <ArrowLeft size={15} />
            Volver al Dashboard
          </Link>
        </div>

        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#059669",
              fontWeight: 800,
              marginBottom: "0.6rem",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Bot size={13} color="#10B981" />
            Asistente de Ventas Conversacional
          </div>

          <h1
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.85rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#000000",
            }}
          >
            Vendedor Virtual IA & Cierre WhatsApp
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Atendé las dudas de tus compradores 24/7 en la tienda, recomendá productos del catálogo y escalá automáticamente a WhatsApp para cerrar ventas.
          </p>
        </motion.div>

        {/* FEEDBACK TOAST */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "0.9rem 1.25rem",
                borderRadius: "12px",
                background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: feedback.type === "success" ? "#065f46" : "#991b1b",
                border: `1px solid ${feedback.type === "success" ? "#a7f3d0" : "#fecaca"}`,
                fontSize: "0.88rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
              }}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} color="#059669" />
              ) : (
                <AlertCircle size={18} color="#dc2626" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 1rem",
              gap: "0.85rem",
            }}
          >
            <Loader2 size={32} color="#10B981" className="animate-spin" />
            <span style={{ fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>
              Cargando Vendedor Virtual IA...
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* COLUMNA IZQUIERDA: CONFIGURADOR */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* SWITCH ACTIVO */}
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
                    Vendedor Virtual Activo
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                    Muestra el chat de asistencia flotante en toda la tienda
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  style={{
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    background: config.is_active ? "#10B981" : "#e5e7eb",
                    position: "relative",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: config.is_active ? "25px" : "3px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      transition: "all 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>

              {/* IDENTIDAD Y AVATAR */}
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
                    value={config.agent_name}
                    onChange={(e) => setConfig((prev) => ({ ...prev, agent_name: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    Avatar del Asesor
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, agent_avatar: av }))}
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "10px",
                          border: config.agent_avatar === av ? "2px solid #10B981" : "1px solid #e5e7eb",
                          background: config.agent_avatar === av ? "#ecfdf5" : "#ffffff",
                          fontSize: "1.3rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Mensaje de Bienvenida
                  </label>
                  <textarea
                    rows={3}
                    value={config.welcome_message}
                    onChange={(e) => setConfig((prev) => ({ ...prev, welcome_message: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      resize: "none",
                    }}
                  />
                </div>
              </div>

              {/* PERSONALIDAD DEL ASESOR */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", marginBottom: "0.3rem" }}>
                  Tono y Personalidad de Ventas
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.65rem" }}>
                  {PERSONALITY_OPTIONS.map((opt) => {
                    const isSelected = config.personality === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, personality: opt.id }))}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "12px",
                          border: isSelected ? "2px solid #10B981" : "1px solid #e5e7eb",
                          background: isSelected ? "#ecfdf5" : "#ffffff",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: isSelected ? "#059669" : "#111827" }}>
                          {opt.title}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#6b7280", marginTop: "2px" }}>
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DERIVACIÓN A WHATSAPP */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MessageCircle size={18} color="#25D366" />
                  <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>
                    Cierre de Ventas por WhatsApp
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Número de WhatsApp Oficial (con código de país)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: +5493434163999"
                    value={config.whatsapp_number}
                    onChange={(e) => setConfig((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* BOTÓN GUARDAR */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "#10B981",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                }}
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar y Activar Vendedor Virtual
                  </>
                )}
              </button>
            </div>

            {/* COLUMNA DERECHA: SIMULADOR DE CHAT */}
            <div style={{ position: "sticky", top: "2rem" }}>
              <VirtualSalesmanChatSimulator config={config} />
            </div>
          </div>
        )}

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: "3rem" }}>
          <CentroAyuda />
        </div>
      </main>
    </div>
  );
}
