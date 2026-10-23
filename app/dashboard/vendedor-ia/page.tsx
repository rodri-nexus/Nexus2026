"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Settings,
  Zap,
  CheckCircle2,
  Layers,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

export default function VendedorIAPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "settings" | "mcp">("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu Copilot de Nevux. Estoy conectado a tu Tiendanube en tiempo real. ¿Querés saber cómo vienen las ventas de hoy, revisar el stock o recuperar carritos?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [settings, setSettings] = useState({
    whatsapp_phone: "",
    daily_report_enabled: true,
    stock_alerts_enabled: true,
    auto_cart_recovery: false,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) setEmail(data.user.email);
      } catch {}
      fetchMetrics();
      fetchSettings();
    };
    init();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/ai/virtual-salesman");
      const data = await res.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/ai/copilot-settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await fetch("/api/ai/copilot-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      alert("Configuración guardada con éxito");
    } catch {
      alert("Error al guardar");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Perdón, tuve un problema al conectar con tu tienda. ¿Probamos de nuevo?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
      <DashboardHeader email={email} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER SECCIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "1.75rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.95rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#059669",
              fontWeight: 700,
              marginBottom: "0.75rem",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
            }}
          >
            <Sparkles size={13} color="#10B981" />
            Asistente Comercial IA
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Nevux Copilot IA
              </h1>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem", opacity: 0.6 }}>
                Tu asistente comercial inteligente conectado a Tiendanube.
              </p>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                background: "#ffffff",
                padding: "0.3rem",
                borderRadius: "12px",
                border: "1.5px solid #e5e7eb",
                flexWrap: "wrap",
              }}
            >
              {(
                [
                  { id: "chat" as const, label: "Chat Live", icon: MessageSquare },
                  { id: "settings" as const, label: "WhatsApp & Reportes", icon: Settings },
                  { id: "mcp" as const, label: "Conexión MCP", icon: Layers },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "0.5rem 0.9rem",
                      borderRadius: "9px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      background: active ? "#10B981" : "transparent",
                      color: active ? "#ffffff" : "#6b7280",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontFamily: "inherit",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* GRID PRINCIPAL */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: "1.5rem",
            alignItems: "start",
          }}
          className="copilot-grid"
        >
          <style>{`
            @media (max-width: 900px) {
              .copilot-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* COLUMNA IZQUIERDA */}
          <div style={{ minWidth: 0 }}>
            <AnimatePresence mode="wait">
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "1.5px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    height: "560px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "0.9rem 1.15rem",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <div
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: "#10B981",
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
                      Copilot Online
                    </span>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      padding: "1.15rem",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                          maxWidth: "88%",
                        }}
                      >
                        <div
                          style={{
                            padding: "0.75rem 1rem",
                            borderRadius: "14px",
                            fontSize: "0.88rem",
                            lineHeight: 1.5,
                            background: msg.role === "user" ? "#10B981" : "#f9fafb",
                            color: msg.role === "user" ? "#ffffff" : "#1f2937",
                            border: msg.role === "user" ? "none" : "1.5px solid #e5e7eb",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div style={{ color: "#9ca3af", fontSize: "0.8rem", fontStyle: "italic" }}>
                        El Copilot está analizando tu tienda...
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      borderTop: "1px solid #f3f4f6",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Preguntale al Copilot (ej: ¿Cómo vienen las ventas?)"
                      style={{
                        flex: 1,
                        padding: "0.7rem 1rem",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        outline: "none",
                        fontSize: "0.88rem",
                        fontFamily: "inherit",
                        background: "#ffffff",
                        color: "#000000",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      style={{
                        background: "#10B981",
                        color: "#ffffff",
                        border: "none",
                        padding: "0.7rem 1.15rem",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                      }}
                    >
                      <Send size={15} />
                      Enviar
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "1.5px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    padding: "1.5rem",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 1.25rem 0",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#000000",
                    }}
                  >
                    <Settings size={18} color="#10B981" />
                    Configuración de Notificaciones
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#000000",
                          marginBottom: "0.4rem",
                        }}
                      >
                        WhatsApp (con código de país, ej: 54911...)
                      </label>
                      <input
                        type="text"
                        value={settings.whatsapp_phone}
                        onChange={(e) =>
                          setSettings({ ...settings, whatsapp_phone: e.target.value })
                        }
                        placeholder="5491122334455"
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          border: "1.5px solid #e5e7eb",
                          outline: "none",
                          fontSize: "0.9rem",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                          background: "#ffffff",
                          color: "#000000",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.9rem 1rem",
                        background: "#f9fafb",
                        borderRadius: "12px",
                        border: "1px solid #f3f4f6",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#000000" }}>
                          Reporte Diario Automático
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.15rem" }}>
                          Resumen de ventas por WhatsApp a las 20:00hs.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.daily_report_enabled}
                        onChange={(e) =>
                          setSettings({ ...settings, daily_report_enabled: e.target.checked })
                        }
                        style={{ width: "18px", height: "18px", accentColor: "#10B981" }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.9rem 1rem",
                        background: "#f9fafb",
                        borderRadius: "12px",
                        border: "1px solid #f3f4f6",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#000000" }}>
                          Alertas de Stock Crítico
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.15rem" }}>
                          Aviso automático cuando un producto se agota.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.stock_alerts_enabled}
                        onChange={(e) =>
                          setSettings({ ...settings, stock_alerts_enabled: e.target.checked })
                        }
                        style={{ width: "18px", height: "18px", accentColor: "#10B981" }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={saveSettings}
                      style={{
                        background: "#10B981",
                        color: "#ffffff",
                        border: "none",
                        padding: "0.85rem",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        fontFamily: "inherit",
                        boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Guardar Configuración
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "mcp" && (
                <motion.div
                  key="mcp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "1.5px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    padding: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      marginBottom: "1.15rem",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Layers size={22} color="#10B981" />
                    </div>
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "1.1rem",
                          fontWeight: 800,
                          color: "#000000",
                        }}
                      >
                        Model Context Protocol (MCP)
                      </h2>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#059669",
                          fontWeight: 700,
                        }}
                      >
                        ESTADO: ACTIVO & SEGURO
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      margin: "0 0 1.25rem 0",
                      color: "#4b5563",
                      fontSize: "0.9rem",
                      lineHeight: 1.55,
                    }}
                  >
                    Nevux utiliza el protocolo <strong>MCP</strong> para que modelos de IA
                    (Claude, GPT-4o) lean el contexto de tu tienda de forma segura y
                    estandarizada, sin exponer credenciales.
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.85rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "1rem",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: "12px",
                        background: "#ffffff",
                      }}
                    >
                      <Zap size={16} color="#10B981" style={{ marginBottom: "0.4rem" }} />
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>
                        Datos en vivo
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.4 }}>
                        Lectura directa de órdenes, stock y carritos.
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "1rem",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: "12px",
                        background: "#ffffff",
                      }}
                    >
                      <CheckCircle2 size={16} color="#10B981" style={{ marginBottom: "0.4rem" }} />
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>
                        Privacidad
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.4 }}>
                        Tus tokens nunca se comparten con la IA.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COLUMNA DERECHA: MÉTRICAS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Ventas Hoy */}
            <div
              style={{
                background: "#ffffff",
                padding: "1.15rem",
                borderRadius: "14px",
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.65rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp size={18} color="#10B981" />
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#059669",
                    fontWeight: 700,
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                  }}
                >
                  Live
                </span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>
                Ventas de Hoy
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "#000000",
                  margin: "0.15rem 0",
                  letterSpacing: "-0.02em",
                }}
              >
                ARS ${metrics?.totalSales?.toLocaleString() || "0"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                Sincronizado con Tiendanube
              </div>
            </div>

            {/* Carritos */}
            <div
              style={{
                background: "#ffffff",
                padding: "1.15rem",
                borderRadius: "14px",
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.65rem",
                }}
              >
                <ShoppingCart size={18} color="#3b82f6" />
              </div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>
                Carritos Recuperables
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "#000000",
                  margin: "0.15rem 0",
                  letterSpacing: "-0.02em",
                }}
              >
                {metrics?.abandonedCartsCount || 0}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("chat");
                  setInput("¿Cuánta plata tengo en carritos abandonados?");
                }}
                style={{
                  fontSize: "0.78rem",
                  color: "#3b82f6",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: "inherit",
                }}
              >
                Recuperar ahora →
              </button>
            </div>

            {/* Stock Crítico */}
            <div
              style={{
                background: "#ffffff",
                padding: "1.15rem",
                borderRadius: "14px",
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#fff1f2",
                  border: "1px solid #fecdd3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.65rem",
                }}
              >
                <AlertTriangle size={18} color="#f43f5e" />
              </div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>
                Stock Crítico
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "#f43f5e",
                  margin: "0.15rem 0",
                  letterSpacing: "-0.02em",
                }}
              >
                {metrics?.criticalStockProducts?.length || 0}{" "}
                <span style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
                  productos
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                {(metrics?.criticalStockProducts?.length || 0) > 0
                  ? "Requiere reposición rápida"
                  : "Inventario saludable"}
              </div>
            </div>

            {/* Proyección */}
            <div
              style={{
                background: "#000000",
                padding: "1.15rem",
                borderRadius: "14px",
                color: "#ffffff",
                border: "1.5px solid #10B981",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  marginBottom: "0.85rem",
                }}
              >
                <Bot size={16} color="#10B981" />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#10B981",
                  }}
                >
                  Proyección IA
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", marginBottom: "0.2rem" }}>
                Cierre de semana estimado
              </div>
              <div
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                ARS $
                {(metrics?.totalSales * 7.2 || 0).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
              <div
                style={{
                  height: "4px",
                  width: "100%",
                  background: "#374151",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginBottom: "0.5rem",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ height: "100%", background: "#10B981" }}
                />
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Tendencia en vivo</span>
                <span style={{ color: "#10B981", fontWeight: 700 }}>+12% vs ayer</span>
              </div>
            </div>

            <CentroAyuda />
          </div>
        </div>
      </main>
    </div>
  );
                  }
