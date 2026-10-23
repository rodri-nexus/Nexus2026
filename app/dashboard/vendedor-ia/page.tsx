"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Send,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Smartphone,
  Check,
  Code2,
  Bot,
  DollarSign,
  Package,
} from "lucide-react";

interface CopilotMetrics {
  salesToday: number;
  ordersToday: number;
  salesWeek: number;
  salesWeekProjected: number;
  abandonedCartsCount: number;
  abandonedCartsValue: number;
  criticalStockProducts: string[];
  conversionRateEst: string;
}

interface ChatMessage {
  id: string;
  sender: "merchant" | "copilot";
  text: string;
  timestamp: string;
  metricsData?: CopilotMetrics;
}

export default function VendedorIAPage() {
  const [activeTab, setActiveTab] = useState<"copilot" | "settings" | "mcp">("copilot");
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<CopilotMetrics | null>(null);

  // Settings state
  const [whatsappPhone, setWhatsappPhone] = useState<string>("+5491100000000");
  const [dailyReportEnabled, setDailyReportEnabled] = useState<boolean>(true);
  const [stockAlertsEnabled, setStockAlertsEnabled] = useState<boolean>(true);
  const [autoCartRecovery, setAutoCartRecovery] = useState<boolean>(true);
  const [savedSettings, setSavedSettings] = useState<boolean>(false);

  // Chat simulator state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "copilot",
      text: "¡Hola! Soy tu Nevux Copilot IA 🚀. Estoy monitoreando tu tienda en tiempo real. Hoy llevás analizado tu balance comercial, stock y carritos. ¿En qué querés que trabajemos hoy?",
      timestamp: "Hace un momento",
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch real metrics on mount
  useEffect(() => {
    fetchLiveMetrics();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const fetchLiveMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "metrics" }),
      });
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Error fetching Copilot metrics:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "merchant",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsSending(true);

    try {
      const res = await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      const copilotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: data.reply || "Disculpa, no pude procesar tu consulta en este momento.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metricsData: data.metrics,
      };

      setMessages((prev) => [...prev, copilotMsg]);
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "copilot",
          text: "Hubo un error de conexión con la IA. Verificá tu red e intentá nuevamente.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const formatARS = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
              }}
            >
              <Brain size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                Nevux Copilot IA
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                Tu Gerente Comercial 24/7 para Tiendanube y WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div style={{ display: "flex", gap: 8, background: "#f1f5f9", padding: 4, borderRadius: 10 }}>
          <button
            onClick={() => setActiveTab("copilot")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: activeTab === "copilot" ? "#fff" : "transparent",
              color: activeTab === "copilot" ? "#0f172a" : "#64748b",
              boxShadow: activeTab === "copilot" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            💬 Copilot Dashboard
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: activeTab === "settings" ? "#fff" : "transparent",
              color: activeTab === "settings" ? "#0f172a" : "#64748b",
              boxShadow: activeTab === "settings" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            📱 WhatsApp & Alertas
          </button>
          <button
            onClick={() => setActiveTab("mcp")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: activeTab === "mcp" ? "#fff" : "transparent",
              color: activeTab === "mcp" ? "#0f172a" : "#64748b",
              boxShadow: activeTab === "mcp" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            ⚡ MCP Protocol
          </button>
        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Card 1: Ventas Hoy */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 18,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
              Ventas Hoy
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
            {loadingMetrics ? "..." : formatARS(metrics?.salesToday || 0)}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>
            {metrics?.ordersToday || 0} órdenes concretadas hoy
          </p>
        </div>

        {/* Card 2: Carritos Recuperables */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 18,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
              Carritos Recuperables
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff7ed", color: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingCart size={18} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#d97706" }}>
            {loadingMetrics ? "..." : formatARS(metrics?.abandonedCartsValue || 0)}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>
            {metrics?.abandonedCartsCount || 0} clientes potenciales pendientes
          </p>
        </div>

        {/* Card 3: Proyección Semanal */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 18,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
              Proyección Semanal
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#2563eb" }}>
            {loadingMetrics ? "..." : formatARS(metrics?.salesWeekProjected || 0)}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>
            Basado en la tasa actual de los últimos 7 días
          </p>
        </div>

        {/* Card 4: Alertas de Stock */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 18,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
              Stock Crítico
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: (metrics?.criticalStockProducts.length || 0) > 0 ? "#dc2626" : "#059669" }}>
            {loadingMetrics ? "..." : `${metrics?.criticalStockProducts.length || 0} Prod.`}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>
            {(metrics?.criticalStockProducts.length || 0) > 0 ? "Requieren reposición urgente" : "Catálogo en óptimo estado"}
          </p>
        </div>
      </div>

      {/* MAIN TAB CONTENT */}
      {activeTab === "copilot" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          {/* CHAT INTERFACE */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              height: 600,
            }}
          >
            {/* CHAT HEADER */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#10b981",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    <Bot size={20} />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#22c55e",
                      border: "2px solid #fff",
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    Asistente Copilot en Vivo
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                    Conectado con Tiendanube Store ID #8293155
                  </p>
                </div>
              </div>

              <button
                onClick={fetchLiveMetrics}
                disabled={loadingMetrics}
                style={{
                  background: "transparent",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <RefreshCw size={14} className={loadingMetrics ? "animate-spin" : ""} />
                Actualizar Datos
              </button>
            </div>

            {/* CHAT MESSAGES BOX */}
            <div
              style={{
                flex: 1,
                padding: 20,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "#fafafa",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.sender === "merchant" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "12px 16px",
                      borderRadius: 14,
                      fontSize: 14,
                      lineHeight: 1.5,
                      background: msg.sender === "merchant" ? "#059669" : "#ffffff",
                      color: msg.sender === "merchant" ? "#ffffff" : "#0f172a",
                      border: msg.sender === "merchant" ? "none" : "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, padding: "0 4px" }}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isSending && (
                <div style={{ display: "flex", gap: 6, padding: "8px 12px", background: "#fff", borderRadius: 12, width: "fit-content", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Copilot analizando métricas de Tiendanube...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* CHAT INPUT FORM */}
            <div style={{ padding: 16, borderTop: "1px solid #e2e8f0", background: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{ display: "flex", gap: 10 }}
              >
                <input
                  type="text"
                  placeholder="Ej: ¿Cómo vienen las ventas hoy y qué podemos hacer?"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  disabled={isSending}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={isSending || !inputQuery.trim()}
                  style={{
                    background: "#059669",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "0 20px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    opacity: isSending || !inputQuery.trim() ? 0.6 : 1,
                  }}
                >
                  <Send size={16} />
                  Consultar
                </button>
              </form>
            </div>
          </div>

          {/* QUICK PROMPTS & ACTIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={16} color="#059669" /> Acciones Rápidas
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                Hacé clic en cualquiera para ejecutar una consulta sobre tu tienda:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={() => handleSendMessage("¿Cómo vienen mis ventas hoy y cuál es la proyección semanal?")}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  📈 Ventas de hoy & proyección
                </button>

                <button
                  onClick={() => handleSendMessage("¿Qué carritos abandonados tengo y cómo podemos recuperarlos?")}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  🛒 Ver carritos abandonados
                </button>

                <button
                  onClick={() => handleSendMessage("¿Qué productos están en stock crítico y debo reponer pronto?")}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  ⚠️ Revisar stock crítico
                </button>

                <button
                  onClick={() => handleSendMessage("Dame 3 estrategias comerciales para aumentar mis ventas esta semana")}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  💡 Sugerir acciones de venta
                </button>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div
              style={{
                background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
                borderRadius: 16,
                padding: 20,
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Sparkles size={18} color="#34d399" />
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Estado de Copilot
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9, margin: 0 }}>
                El motor IA está enlazado directamente a tu API Key de Tiendanube. Todas las respuestas se basan en tus transacciones reales.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div style={{ maxWidth: 650, background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            Configuración de WhatsApp Copilot
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
            Recibí los reportes en tu teléfono celular y automatizá el seguimiento comercial de tu tienda.
          </p>

          <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Número de WhatsApp para Notificaciones
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+54 9 11 1234 5678"
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                />
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "block" }}>
                Formato internacional con código de país.
              </span>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
              <label style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 12, cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Reporte Diario a las 20:00 hs</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>Recibí un resumen diario de ventas, carritos y recomendaciones en tu WhatsApp.</div>
                </div>
                <input
                  type="checkbox"
                  checked={dailyReportEnabled}
                  onChange={(e) => setDailyReportEnabled(e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: "#059669" }}
                />
              </label>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
              <label style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 12, cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Alertas Instantáneas de Stock Crítico</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>Notificar al instante cuando un producto tenga 5 o menos unidades en inventario.</div>
                </div>
                <input
                  type="checkbox"
                  checked={stockAlertsEnabled}
                  onChange={(e) => setStockAlertsEnabled(e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: "#059669" }}
                />
              </label>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
              <label style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 12, cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Recuperación Automática de Carritos</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>Permitir a Copilot preparar los mensajes de recuperación para enviar con 1 clic.</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoCartRecovery}
                  onChange={(e) => setAutoCartRecovery(e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: "#059669" }}
                />
              </label>
            </div>

            <div style={{ paddingTop: 16 }}>
              <button
                type="submit"
                style={{
                  background: "#059669",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {savedSettings ? <Check size={18} /> : null}
                {savedSettings ? "Configuración Guardada" : "Guardar Preferencias"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MCP INTEGRATION TAB */}
      {activeTab === "mcp" && (
        <div style={{ maxWidth: 800, background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Code2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Integración MCP (Model Context Protocol)
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                Conectá tu tienda Nevux directamente con Cursor, Claude Desktop, ChatGPT o Gemini CLI
              </p>
            </div>
          </div>

          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>
            Nevux implementa el estándar abierto <strong>MCP (Model Context Protocol)</strong>. Esto te permite consultar tu stock, balances y carritos directamente desde cualquier entorno de IA compatible, sin salir de tu editor de código o chat favorito.
          </p>

          <div style={{ background: "#0f172a", borderRadius: 12, padding: 16, color: "#f8fafc", fontFamily: "monospace", fontSize: 13, marginBottom: 20, overflowX: "auto" }}>
            <div style={{ color: "#94a3b8", marginBottom: 8 }}>// Ejemplo de configuración en Claude Desktop / Cursor:</div>
            <pre style={{ margin: 0 }}>{`{
  "mcpServers": {
    "nevux-copilot": {
      "command": "npx",
      "args": ["-y", "@nevux/mcp-server"],
      "env": {
        "NEVUX_STORE_ID": "8293155",
        "NEVUX_API_KEY": "nvx_live_sec_..."
      }
    }
  }
}`}</pre>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
                Herramientas MCP Expuestas
              </h4>
              <ul style={{ fontSize: 13, color: "#475569", paddingLeft: 18, margin: 0 }}>
                <li><code>get_realtime_metrics</code></li>
                <li><code>get_abandoned_carts</code></li>
                <li><code>get_critical_inventory</code></li>
                <li><code>trigger_cart_recovery</code></li>
              </ul>
            </div>

            <div style={{ padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
                Estado del Servidor MCP
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#059669" }}>
                  Endpoint Activo: https://nevux.ar/api/mcp
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
