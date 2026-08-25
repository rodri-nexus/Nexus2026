"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  Send,
  RefreshCw,
  Check,
  ArrowLeft,
  User,
  MessageSquare,
  Power,
  ShieldCheck,
  Heart,
  Smile,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";

interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface NevuxBotClientProps {
  email: string;
  store: StoreData | null;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function NevuxBotClient({ email, store }: NevuxBotClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Configuración del Bot
  const [isActive, setIsActive] = useState(false);
  const [botName, setBotName] = useState("Sofía");
  const [personality, setPersonality] = useState<"experta" | "calida" | "divertida">("experta");

  // Chat de prueba
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "¡Hola! 👋 Soy Sofía, la asesora de la tienda. ¿Buscás algún producto en especial o tenés dudas con tu compra?",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll en el chat de prueba
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingMsg]);

  // Cargar configuración de la tienda
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/nevuxbot/config");
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            setIsActive(data.config.is_active ?? false);
            setBotName(data.config.bot_name || "Sofía");
            setPersonality(data.config.personality || "experta");
          }
        }
      } catch (err) {
        console.error("Error cargando config de NevuxBot:", err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadConfig();
  }, []);

  // Guardar Cambios
  async function handleSaveConfig() {
    if (saving) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/nevuxbot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: isActive,
          bot_name: botName,
          personality,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error al guardar config:", err);
    } finally {
      setSaving(false);
    }
  }

  // Enviar mensaje en el chat de prueba
  async function handleSendTestMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMsg.trim() || sendingMsg) return;

    const userText = inputMsg.trim();
    setInputMsg("");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setSendingMsg(true);

    try {
      const res = await fetch("/api/nevuxbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store?.store_id,
          message: userText,
          conversationHistory: messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botReplyMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.reply || "¡Hola! ¿Cómo estás?",
        };
        setMessages((prev) => [...prev, botReplyMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "Ocurrió un error temporal al comunicarme. Verificá que la API key esté activa.",
          },
        ]);
      }
    } catch (err) {
      console.error("Error en chat de prueba:", err);
    } finally {
      setSendingMsg(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardHeader email={email} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        {/* Volver al dashboard */}
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.85rem",
            color: "#000000",
            opacity: 0.6,
            textDecoration: "none",
            marginBottom: "1rem",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} />
          Volver al dashboard
        </Link>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.35rem 0.85rem",
                  background: "#ecfdf5",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  color: "#059669",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                <Sparkles size={13} />
                Inteligencia Artificial Vendedora
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                NevuxBot AI
              </h1>
              <p
                style={{
                  margin: "0.4rem 0 0",
                  fontSize: "0.95rem",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                Tu asesora de ventas humana en la tienda. Conoce tus productos de memoria y responde las 24 horas.
              </p>
            </div>

            {/* Switch Estado On/Off */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: isActive ? "#10B981" : "#9ca3af",
                  boxShadow: isActive ? "0 0 8px #10B981" : "none",
                }}
              />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000000" }}>
                {isActive ? "Bot Activado" : "Bot Desactivado"}
              </span>
              <button
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: "48px",
                  height: "26px",
                  borderRadius: "999px",
                  background: isActive ? "#10B981" : "#e5e7eb",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                  outline: "none",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    position: "absolute",
                    top: "3px",
                    left: isActive ? "25px" : "3px",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Layout en 2 Columnas (Ajustes + Simulador de Chat) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* COLUMNA 1: CONFIGURACIÓN DEL BOT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "#000" }}>
                Personalidad y Nombre
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#000", opacity: 0.5, margin: "0.25rem 0 0" }}>
                Elegí cómo querés que se presente tu asesora ante los compradores.
              </p>
            </div>

            {/* Campo: Nombre del Asesor */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#000000",
                  marginBottom: "0.5rem",
                }}
              >
                Nombre del asesor / asesora:
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.4,
                  }}
                />
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="Ej: Sofía, Lucas, Ana..."
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#000000",
                  }}
                />
              </div>
            </div>

            {/* Selector de Tono / Personalidad */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#000000",
                  marginBottom: "0.75rem",
                }}
              >
                Tono de conversación:
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Opción 1: Experta */}
                <div
                  onClick={() => setPersonality("experta")}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "14px",
                    border: `2px solid ${personality === "experta" ? "#10B981" : "#e5e7eb"}`,
                    background: personality === "experta" ? "#ecfdf5" : "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Briefcase size={20} color={personality === "experta" ? "#059669" : "#6b7280"} />
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000" }}>
                      Experta y Profesional
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#000", opacity: 0.5 }}>
                      Respuestas elegantes, claras, resolutivas y respetuosas.
                    </div>
                  </div>
                </div>

                {/* Opción 2: Cálida */}
                <div
                  onClick={() => setPersonality("calida")}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "14px",
                    border: `2px solid ${personality === "calida" ? "#10B981" : "#e5e7eb"}`,
                    background: personality === "calida" ? "#ecfdf5" : "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Heart size={20} color={personality === "calida" ? "#059669" : "#6b7280"} />
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000" }}>
                      Cálida y Cercana
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#000", opacity: 0.5 }}>
                      Trato súper dulce, amigable, empático y lleno de buena onda.
                    </div>
                  </div>
                </div>

                {/* Opción 3: Divertida */}
                <div
                  onClick={() => setPersonality("divertida")}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "14px",
                    border: `2px solid ${personality === "divertida" ? "#10B981" : "#e5e7eb"}`,
                    background: personality === "divertida" ? "#ecfdf5" : "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Smile size={20} color={personality === "divertida" ? "#059669" : "#6b7280"} />
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000" }}>
                      Divertida y Fresca
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#000", opacity: 0.5 }}>
                      Lenguaje relajado, entusiasta y con un toque jovial.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Guardar */}
            <button
              onClick={handleSaveConfig}
              disabled={saving || loadingConfig}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "14px",
                border: "none",
                background: "#10B981",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: saving || loadingConfig ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
              }}
            >
              {saving ? (
                <>
                  <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Guardando cambios...
                </>
              ) : savedSuccess ? (
                <>
                  <Check size={16} />
                  ¡Configuración guardada!
                </>
              ) : (
                "Guardar configuración"
              )}
            </button>
          </motion.div>

          {/* COLUMNA 2: SIMULADOR DE CHAT EN VIVO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              height: "520px",
            }}
          >
            {/* Header del Chat */}
            <div
              style={{
                background: "#000000",
                color: "#ffffff",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: "bold" }}>
                  {botName} (Asesora NevuxBot)
                </div>
                <div style={{ fontSize: "0.75rem", color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                  En línea • Conoce tu tienda
                </div>
              </div>
            </div>

            {/* Cuerpo de Mensajes */}
            <div
              style={{
                flex: 1,
                padding: "1.25rem",
                overflowY: "auto",
                background: "#f9fafb",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: m.sender === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                      background: m.sender === "user" ? "#000000" : "#ffffff",
                      color: m.sender === "user" ? "#ffffff" : "#000000",
                      border: m.sender === "user" ? "none" : "1px solid #e5e7eb",
                      fontSize: "0.88rem",
                      lineHeight: "1.4",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {sendingMsg && (
                <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                  <div
                    style={{
                      padding: "0.6rem 1rem",
                      borderRadius: "18px 18px 18px 2px",
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.82rem",
                      color: "#059669",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />
                    {botName} está escribiendo...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input del Chat de Prueba */}
            <form
              onSubmit={handleSendTestMessage}
              style={{
                padding: "0.85rem",
                background: "#ffffff",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <input
                type="text"
                placeholder={`Hacerle una pregunta a ${botName}...`}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "0.88rem",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#000000",
                }}
              />
              <button
                type="submit"
                disabled={!inputMsg.trim() || sendingMsg}
                style={{
                  background: "#10B981",
                  border: "none",
                  borderRadius: "12px",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: !inputMsg.trim() || sendingMsg ? "not-allowed" : "pointer",
                  opacity: !inputMsg.trim() || sendingMsg ? 0.5 : 1,
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Centro de Ayuda */}
        <div style={{ marginTop: "2.5rem" }}>
          <CentroAyuda />
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
