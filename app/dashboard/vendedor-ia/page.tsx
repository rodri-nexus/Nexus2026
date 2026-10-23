"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Send,
  Zap,
  RefreshCw,
  Sparkles,
  Smartphone,
  Check,
  Bot,
  DollarSign,
  MessageCircle,
  Settings,
  TerminalSquare,
  User,
  Loader2
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

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
  const [userEmail, setUserEmail] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"copilot" | "settings" | "mcp">("copilot");
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<CopilotMetrics | null>(null);

  // Settings state with persistence
  const [whatsappPhone, setWhatsappPhone] = useState<string>("");
  const [dailyReportEnabled, setDailyReportEnabled] = useState<boolean>(true);
  const [stockAlertsEnabled, setStockAlertsEnabled] = useState<boolean>(true);
  const [autoCartRecovery, setAutoCartRecovery] = useState<boolean>(true);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [savedSettings, setSavedSettings] = useState<boolean>(false);
  const [testingWhatsapp, setTestingWhatsapp] = useState<boolean>(false);
  const [whatsappTestSuccess, setWhatsappTestSuccess] = useState<string | null>(null);

  // Chat simulator state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "copilot",
      text: "¡Hola! Soy tu Nevux Copilot IA 🚀.\nEstoy monitoreando tu tienda en tiempo real. Hoy llevás analizado tu balance comercial, stock y carritos.\n¿En qué querés que trabajemos hoy?",
      timestamp: "Hace un momento",
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initial Fetch
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setUserEmail(data.user.email);
    });

    fetchLiveMetrics();
    fetchCopilotSettings();
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
      if (data.metrics) setMetrics(data.metrics);
    } catch (err) {
      console.error("Error fetching Copilot metrics:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchCopilotSettings = async () => {
    try {
      const res = await fetch("/api/ai/copilot-settings?store_id=8293155");
      if (res.ok) {
        const data = await res.json();
        if (data.whatsapp_phone) setWhatsappPhone(data.whatsapp_phone);
        if (data.daily_report_enabled !== undefined) setDailyReportEnabled(data.daily_report_enabled);
        if (data.stock_alerts_enabled !== undefined) setStockAlertsEnabled(data.stock_alerts_enabled);
        if (data.auto_cart_recovery !== undefined) setAutoCartRecovery(data.auto_cart_recovery);
      }
    } catch (err) {
      console.error("Error fetching Copilot settings:", err);
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
      };

      setMessages((prev) => [...prev, copilotMsg]);
      if (data.metrics) setMetrics(data.metrics);
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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSavedSettings(false);

    try {
      const res = await fetch("/api/ai/copilot-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: "8293155",
          whatsapp_phone: whatsappPhone,
          daily_report_enabled: dailyReportEnabled,
          stock_alerts_enabled: stockAlertsEnabled,
          auto_cart_recovery: autoCartRecovery,
        }),
      });

      if (res.ok) {
        setSavedSettings(true);
        setTimeout(() => setSavedSettings(false), 3000);
      }
    } catch (err) {
      console.error("Error saving Copilot settings:", err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestWhatsAppReport = async () => {
    setTestingWhatsapp(true);
    setWhatsappTestSuccess(null);
    try {
      const res = await fetch("/api/cron/daily-report?store_id=8293155", { method: "POST" });
      const data = await res.json();
      if (data.results && data.results[0]?.whatsappResult?.whatsappWebUrl) {
        const webUrl = data.results[0].whatsappResult.whatsappWebUrl;
        setWhatsappTestSuccess(webUrl);
        window.open(webUrl, "_blank");
      } else {
        const directRes = await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: whatsappPhone,
            message: `🇦🇷 *PRUEBA NEVUX COPILOT*\n\nHola! Tu integración de WhatsApp Copilot está 100% activa. Recibirás tu reporte comercial diario a las 20:00 hs.`,
          }),
        });
        const directData = await directRes.json();
        if (directData.whatsappWebUrl) {
          setWhatsappTestSuccess(directData.whatsappWebUrl);
          window.open(directData.whatsappWebUrl, "_blank");
        }
      }
    } catch (err) {
      console.error("Error testing WhatsApp send:", err);
    } finally {
      setTestingWhatsapp(false);
    }
  };

  const formatARS = (amount: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
      }}
    >
      <DashboardHeader email={userEmail} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER DE LA SECCIÓN */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2rem" }}>
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
            Ecosistema de Inteligencia Nevux
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Nevux Copilot IA
              </h1>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem", opacity: 0.6 }}>
                Tu Gerente Comercial 24/7 conectado a Tiendanube y WhatsApp.
              </p>
            </div>
          </div>
        </motion.div>

        {/* METRICS GRID ESTILO NEVUX */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { title: "Ventas Hoy", value: formatARS(metrics?.salesToday || 0), sub: `${metrics?.ordersToday || 0} órdenes concretadas`, icon: DollarSign, color: "#10B981", bg: "#ecfdf5" },
            { title: "Carritos Recuperables", value: formatARS(metrics?.abandonedCartsValue || 0), sub: `${metrics?.abandonedCartsCount || 0} potenciales pendientes`, icon: ShoppingCart, color: "#f97316", bg: "#fff7ed" },
            { title: "Proyección Semanal", value: formatARS(metrics?.salesWeekProjected || 0), sub: "Basado en últimos 7 días", icon: TrendingUp, color: "#3b82f6", bg: "#eff6ff" },
            { title: "Stock Crítico", value: `${metrics?.criticalStockProducts?.length || 0} Prod.`, sub: (metrics?.criticalStockProducts?.length || 0) > 0 ? "Requiere reposición" : "Catálogo óptimo", icon: AlertTriangle, color: (metrics?.criticalStockProducts?.length || 0) > 0 ? "#ef4444" : "#10B981", bg: (metrics?.criticalStockProducts?.length || 0) > 0 ? "#fef2f2" : "#ecfdf5" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                border: `1.5px solid ${(card.title === "Stock Crítico" && (metrics?.criticalStockProducts?.length || 0) > 0) ? "#fca5a5" : "#e5e7eb"}`,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.title}</span>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <card.icon size={16} color={card.color} />
                </div>
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#000000", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
                {loadingMetrics ? "..." : card.value}
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* TABS NAVEGACIÓN */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { id: "copilot", label: "Panel Copilot IA", icon: MessageCircle },
            { id: "settings", label: "WhatsApp & Alertas", icon: Settings },
            { id: "mcp", label: "Integración MCP", icon: TerminalSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                borderRadius: "999px",
                background: activeTab === tab.id ? "#10B981" : "#f3f4f6",
                color: activeTab === tab.id ? "#ffffff" : "#4b5563",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: activeTab === tab.id ? "0 4px 12px rgba(16, 185, 129, 0.25)" : "none",
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENIDO TAB COPILOT */}
        {activeTab === "copilot" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            
            {/* CHAT WINDOW */}
            <div style={{ flex: "1 1 60%", minWidth: "300px", background: "#ffffff", borderRadius: "16px", border: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", height: "600px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              {/* Chat Header */}
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1.5px solid #e5e7eb", background: "#f9fafb", borderTopLeftRadius: "14px", borderTopRightRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Bot size={20} color="#ffffff" />
                    <span style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#34d399", border: "2px solid #ffffff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#000000" }}>Asistente Comercial IA</div>
                    <div style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600 }}>● Conectado a Tiendanube</div>
                  </div>
                </div>
                <button onClick={fetchLiveMetrics} disabled={loadingMetrics} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <RefreshCw size={18} className={loadingMetrics ? "animate-spin" : ""} />
                </button>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", background: "#ffffff", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "merchant" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "80%", padding: "0.85rem 1.15rem", borderRadius: "14px", fontSize: "0.9rem", lineHeight: 1.5, background: msg.sender === "merchant" ? "#10B981" : "#f3f4f6", color: msg.sender === "merchant" ? "#ffffff" : "#000000", border: msg.sender === "merchant" ? "none" : "1.5px solid #e5e7eb", whiteSpace: "pre-wrap" }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.3rem", fontWeight: 600 }}>{msg.timestamp}</span>
                  </div>
                ))}
                {isSending && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f3f4f6", padding: "0.6rem 1rem", borderRadius: "14px", width: "fit-content", border: "1.5px solid #e5e7eb" }}>
                    <Loader2 size={14} className="animate-spin" color="#10B981" />
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6b7280" }}>Analizando...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: "1rem", borderTop: "1.5px solid #e5e7eb", background: "#f9fafb", borderBottomLeftRadius: "14px", borderBottomRightRadius: "14px" }}>
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="Consultale algo sobre tu tienda..."
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    disabled={isSending}
                    style={{ flex: 1, padding: "0.75rem 1rem", border: "1.5px solid #e5e7eb", borderRadius: "12px", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                    onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <button type="submit" disabled={isSending || !inputQuery.trim()} style={{ background: "#10B981", color: "#ffffff", border: "none", borderRadius: "12px", padding: "0 1.25rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", opacity: isSending || !inputQuery.trim() ? 0.6 : 1 }}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* ACCIONES RAPIDAS SIDEBAR */}
            <div style={{ flex: "1 1 30%", minWidth: "280px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1.5px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <Zap size={20} color="#f59e0b" />
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Prompts Rápidos</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { label: "Resumen de ventas", icon: TrendingUp, query: "Resumime las ventas de hoy y la proyección." },
                    { label: "Carritos abandonados", icon: ShoppingCart, query: "¿Qué carritos abandonados tengo?" },
                    { label: "Revisar stock crítico", icon: AlertTriangle, query: "Listame los productos en stock crítico." },
                    { label: "Sugerir estrategias", icon: Brain, query: "Dame 3 ideas para aumentar la conversión." }
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(btn.query)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.85rem 1rem",
                        background: "#f9fafb",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: "12px",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "inherit",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.background = "#ecfdf5"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
                    >
                      <btn.icon size={16} color="#6b7280" />
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#000000" }}>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CONTENIDO TAB SETTINGS (ESTILO GATEKEEPER) */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: "600px", background: "#ffffff", borderRadius: "20px", padding: "2rem", border: "1.5px solid #e5e7eb", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Smartphone size={24} color="#10B981" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Alertas WhatsApp</h2>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#6b7280" }}>Recibí el reporte 20:00 hs en tu celular.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#000000", marginBottom: "0.5rem" }}>Número Internacional</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    type="text"
                    required
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+5491100000000"
                    style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.5rem", border: "1.5px solid #e5e7eb", borderRadius: "12px", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { state: dailyReportEnabled, set: setDailyReportEnabled, title: "Reporte Diario 20:00 hs", desc: "Balance automático al cierre del día." },
                  { state: stockAlertsEnabled, set: setStockAlertsEnabled, title: "Alertas de Stock", desc: "Aviso si un producto queda con 5 unidades." }
                ].map((opt, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1.5px solid #e5e7eb", borderRadius: "12px", cursor: "pointer", background: "#f9fafb" }}>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#000000" }}>{opt.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.2rem" }}>{opt.desc}</div>
                    </div>
                    <input type="checkbox" checked={opt.state} onChange={(e) => opt.set(e.target.checked)} style={{ width: "20px", height: "20px", accentColor: "#10B981" }} />
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button type="submit" disabled={savingSettings} style={{ flex: 1, padding: "0.85rem", background: "#10B981", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  {savingSettings ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {savedSettings ? "¡Guardado!" : "Guardar Preferencias"}
                </button>
                <button type="button" onClick={handleTestWhatsAppReport} disabled={testingWhatsapp} style={{ flex: 1, padding: "0.85rem", background: "#000000", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  {testingWhatsapp ? <Loader2 size={18} className="animate-spin" /> : <Smartphone size={18} />}
                  Probar Envío
                </button>
              </div>

              {whatsappTestSuccess && (
                <div style={{ padding: "0.85rem", background: "#ecfdf5", color: "#059669", borderRadius: "12px", fontSize: "0.85rem", marginTop: "1rem", border: "1.5px solid #a7f3d0", textAlign: "center", fontWeight: 600 }}>
                  ✅ Enviado. <a href={whatsappTestSuccess} target="_blank" rel="noreferrer" style={{ color: "#047857", textDecoration: "underline" }}>Abrir Chat</a>
                </div>
              )}
            </form>
          </motion.div>
        )}

        {/* CONTENIDO TAB MCP */}
        {activeTab === "mcp" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: "800px", background: "#ffffff", borderRadius: "20px", padding: "2rem", border: "1.5px solid #e5e7eb", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TerminalSquare size={24} color="#3b82f6" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Integración MCP</h2>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#6b7280" }}>Model Context Protocol para Desarrolladores.</p>
              </div>
            </div>
            
            <p style={{ fontSize: "0.95rem", color: "#4b5563", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Conectá de forma segura las métricas de tu tienda directamente a <strong>Cursor IDE</strong>, <strong>Claude Desktop</strong> o <strong>ChatGPT</strong> utilizando el estándar MCP nativo de Nevux.
            </p>

            <div style={{ background: "#000000", borderRadius: "16px", padding: "1.5rem", overflowX: "auto" }}>
              <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></div>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }}></div>
              </div>
              <pre style={{ margin: 0, color: "#a5b4fc", fontSize: "0.85rem", fontFamily: "monospace" }}>
{`{
  "mcpServers": {
    "nevux-copilot": {
      "command": "npx",
      "args": ["-y", "@nevux/mcp-server"],
      "env": {
        "NEVUX_STORE_ID": "8293155",
        "NEVUX_API_KEY": "nvx_live_sec_***"
      }
    }
  }
}`}
              </pre>
            </div>
          </motion.div>
        )}

        {/* CENTRO DE AYUDA AL FINAL DE LA PANTALLA */}
        <div style={{ marginTop: "3rem" }}>
          <CentroAyuda />
        </div>
      </main>
    </div>
  );
    }
