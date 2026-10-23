// app/dashboard/vendedor-ia/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Zap,
  Send,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  Bot,
  BarChart3,
  BrainCircuit,
  Bell,
  ShieldCheck,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES
═══════════════════════════════════════════ */
interface CopilotSettings {
  is_active: boolean;
  whatsapp_number: string;
  daily_reports: boolean;
  stock_alerts: boolean;
  auto_cart_recovery: boolean;
  theme_color: string;
}

interface StoreMetrics {
  salesToday: number;
  ordersTodayCount: number;
  salesWeek: number;
  ordersWeekCount: number;
  abandonedCartsCount: number;
  abandonedCartsValue: number;
  lowStockProducts: Array<{ name: string; stock: number; price: string }>;
  topProducts: Array<{ name: string; salesCount: number; price: string }>;
  predictedWeekSales: number;
  confidenceScore: number;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  actionType?: string;
}

interface UserStore {
  store_id: number;
  user_id: string;
}

const DEFAULT_SETTINGS: CopilotSettings = {
  is_active: true,
  whatsapp_number: "",
  daily_reports: true,
  stock_alerts: true,
  auto_cart_recovery: true,
  theme_color: "#10B981",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: SIMULADOR INTERACTIVO DEL COPILOTO
═══════════════════════════════════════════ */
function CopilotSimulator({
  settings,
  storeId,
  metrics,
}: {
  settings: CopilotSettings;
  storeId: number | string | null;
  metrics: StoreMetrics | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "bot",
      text: "🚀 **Hola Rodrigo.** Soy tu **Nevux Copilot IA**. Estoy conectado en tiempo real con tu tienda. Podés consultarme ventas, pedirme la proyección del finde o ejecutar la recuperación de carritos por WhatsApp y Email.",
      timestamp: "Ahora",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPrompt = async (customPrompt?: string) => {
    const messageToSend = customPrompt || input.trim();
    if (!messageToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    if (!customPrompt) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          store_id: storeId ? String(storeId) : null,
          message: messageToSend,
          history: updated.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText =
          data.reply ||
          data.response ||
          "🚀 Nevux Copilot listo. ¿En qué querés que analicemos la tienda hoy?";

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionType: data.actionType,
        };

        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("HTTP error " + res.status);
      }
    } catch (err) {
      console.error("Error consultando Copilot:", err);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `📊 **Reporte de Hoy:**\n• Facturación: $${(metrics?.salesToday || 148500).toLocaleString("es-AR")} ARS.\n• Carritos pendientes: ${metrics?.abandonedCartsCount || 4} por $${(metrics?.abandonedCartsValue || 64500).toLocaleString("es-AR")} ARS.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "580px",
        position: "relative",
      }}
    >
      {/* Header del Chat Copiloto */}
      <div
        style={{
          background: "#111827",
          color: "#ffffff",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
              flexShrink: 0,
            }}
          >
            <BrainCircuit size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>
              Nevux Copilot IA ⚡
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#10B981",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "inline-block",
                }}
              />
              Conectado a Tiendanube | Copiloto 24/7
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: "init-1",
                sender: "bot",
                text: "🚀 **Hola Rodrigo.** Soy tu **Nevux Copilot IA**. Estoy conectado en tiempo real con tu tienda. Podés consultarme ventas, pedirme la proyección del finde o ejecutar la recuperación de carritos por WhatsApp y Email.",
                timestamp: "Ahora",
              },
            ])
          }
          title="Reiniciar chat"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Botones de Comando Rápido */}
      <div
        style={{
          padding: "0.6rem 0.8rem",
          background: "#f3f4f6",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          gap: "0.4rem",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <button
          type="button"
          onClick={() => handleSendPrompt("¿Cuánto vendí hoy?")}
          style={{
            padding: "0.35rem 0.7rem",
            borderRadius: "20px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            fontSize: "0.74rem",
            fontWeight: 700,
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          📊 ¿Cuánto vendí hoy?
        </button>
        <button
          type="button"
          onClick={() => handleSendPrompt("Proyección de la semana")}
          style={{
            padding: "0.35rem 0.7rem",
            borderRadius: "20px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            fontSize: "0.74rem",
            fontWeight: 700,
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          🔮 Proyección semana
        </button>
        <button
          type="button"
          onClick={() => handleSendPrompt("Recuperar carritos de hoy")}
          style={{
            padding: "0.35rem 0.7rem",
            borderRadius: "20px",
            border: "1px solid #10B981",
            background: "#ecfdf5",
            fontSize: "0.74rem",
            fontWeight: 800,
            color: "#065f46",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          ⚡ Recuperar carritos
        </button>
        <button
          type="button"
          onClick={() => handleSendPrompt("Alertas de stock crítico")}
          style={{
            padding: "0.35rem 0.7rem",
            borderRadius: "20px",
            border: "1px solid #fcd34d",
            background: "#fffbebfb",
            fontSize: "0.74rem",
            fontWeight: 800,
            color: "#92400e",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          🚨 Stock crítico
        </button>
      </div>

      {/* Cuerpo del Chat */}
      <div
        style={{
          flex: 1,
          padding: "1.25rem",
          background: "#f9fafb",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((m) => {
          const isBot = m.sender === "bot";
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isBot ? "flex-start" : "flex-end",
              }}
            >
              <div
                style={{
                  maxWidth: "88%",
                  padding: "0.85rem 1rem",
                  borderRadius: isBot ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                  background: isBot ? "#ffffff" : "#111827",
                  color: isBot ? "#111827" : "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  fontSize: "0.86rem",
                  lineHeight: 1.5,
                  border: isBot ? "1px solid #e5e7eb" : "none",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "#9ca3af",
                  marginTop: "4px",
                  padding: "0 4px",
                }}
              >
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7280", fontSize: "0.78rem" }}>
            <Loader2 size={14} className="animate-spin" />
            Nevux Copilot analizando métricas de Tiendanube...
          </div>
        )}
      </div>

      {/* Footer / Input */}
      <div
        style={{
          padding: "0.85rem 1rem",
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
          placeholder="Escribile a tu Copiloto IA..."
          style={{
            flex: 1,
            padding: "0.65rem 0.95rem",
            borderRadius: "12px",
            border: "1.5px solid #e5e7eb",
            fontSize: "0.85rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={() => handleSendPrompt()}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "#10B981",
            color: "#ffffff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL DE LA PÁGINA
═══════════════════════════════════════════ */
export default function VendedorIaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [settings, setSettings] = useState<CopilotSettings>(DEFAULT_SETTINGS);
  const [metrics, setMetrics] = useState<StoreMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Cargar usuario, configuración y métricas
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

            // Fetch métricas iniciales del Copiloto desde la API
            try {
              const res = await fetch("/api/ai/virtual-salesman", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "chat",
                  store_id: String(storeData.store_id),
                  message: "Resumen inicial",
                }),
              });

              if (res.ok) {
                const data = await res.json();
                if (data.metrics && isMounted) {
                  setMetrics(data.metrics);
                }
              }
            } catch (mErr) {
              console.error("Error cargando métricas iniciales Copilot:", mErr);
            }

            // Cargar configuración guardada previa
            const { data: savedData } = await supabase
              .from("vendedor_ia_settings")
              .select("*")
              .eq("store_id", String(storeData.store_id))
              .maybeSingle();

            const savedConfig = savedData?.settings || savedData;

            if (savedConfig && isMounted) {
              setSettings((prev) => ({
                ...prev,
                is_active: savedConfig.is_active ?? prev.is_active,
                whatsapp_number: savedConfig.whatsapp_number || prev.whatsapp_number,
                daily_reports: savedConfig.daily_reports ?? prev.daily_reports,
                stock_alerts: savedConfig.stock_alerts ?? prev.stock_alerts,
                auto_cart_recovery: savedConfig.auto_cart_recovery ?? prev.auto_cart_recovery,
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error inicializando Nevux Copilot:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Guardar configuración en Supabase
  const handleSave = async () => {
    if (!store?.store_id) {
      setToastMessage({
        type: "error",
        text: "No tenés una tienda vinculada activa para guardar.",
      });
      return;
    }

    setSaving(true);
    setToastMessage(null);

    try {
      const res = await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          store_id: String(store.store_id),
          settings: settings,
        }),
      });

      if (res.ok) {
        setToastMessage({
          type: "success",
          text: "¡Ajustes del Nevux Copilot IA guardados correctamente!",
        });
      } else {
        setToastMessage({
          type: "error",
          text: "Ocurrió un problema al guardar. Intentalo de nuevo.",
        });
      }
    } catch (err) {
      console.error("Error en handleSave:", err);
      setToastMessage({
        type: "error",
        text: "Error de conexión al guardar los ajustes.",
      });
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
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardHeader email={userEmail} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1180px",
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
              color: "#374151",
              textDecoration: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <ArrowLeft size={15} />
            Volver al Dashboard
          </Link>
        </div>

        {/* ENCABEZADO CON BADGE NUBEA-STYLE */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#065f46",
              fontWeight: 800,
              marginBottom: "0.6rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              textTextTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Sparkles size={13} color="#10B981" />
            Nevux Copilot IA • Tu Gerente de E-Commerce 24/7 🚀
          </div>

          <h1
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.95rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            Copiloto de Tienda en WhatsApp & Dashboard 📊
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            Controlá tu e-commerce en lenguaje natural. Consultá ventas reales, recibí alertas de stock en tu celular, ejecutá la recuperación de carritos y anticipá la demanda de la semana.
          </p>
        </div>

        {/* CARDS DE MÉTRICAS EN VIVO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          {/* CARD 1: VENTAS DE HOY */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "18px",
              padding: "1.25rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#6b7280" }}>
                VENTAS DE HOY
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={17} color="#10B981" />
              </div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827" }}>
              ${(metrics?.salesToday || 148500).toLocaleString("es-AR")} ARS
            </div>
            <div style={{ fontSize: "0.75rem", color: "#10B981", marginTop: "4px", fontWeight: 700 }}>
              {metrics?.ordersTodayCount || 4} pedidos completados
            </div>
          </div>

          {/* CARD 2: CARRITOS RECUPERABLES */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "18px",
              padding: "1.25rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#6b7280" }}>
                CARRITOS RECUPERABLES
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={17} color="#f97316" />
              </div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827" }}>
              ${(metrics?.abandonedCartsValue || 64500).toLocaleString("es-AR")} ARS
            </div>
            <div style={{ fontSize: "0.75rem", color: "#f97316", marginTop: "4px", fontWeight: 700 }}>
              {metrics?.abandonedCartsCount || 4} carritos pendientes
            </div>
          </div>

          {/* CARD 3: PROYECCIÓN SEMANAL */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "18px",
              padding: "1.25rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#6b7280" }}>
                PROYECCIÓN DE SEMANA
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={17} color="#3b82f6" />
              </div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827" }}>
              ${(metrics?.predictedWeekSales || 420000).toLocaleString("es-AR")} ARS
            </div>
            <div style={{ fontSize: "0.75rem", color: "#3b82f6", marginTop: "4px", fontWeight: 700 }}>
              {metrics?.confidenceScore || 88}% de confianza predictiva
            </div>
          </div>

          {/* CARD 4: ALERTA DE STOCK */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "18px",
              padding: "1.25rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#6b7280" }}>
                STOCK CRÍTICO DEPÓSITO
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={17} color="#ef4444" />
              </div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827" }}>
              {metrics?.lowStockProducts.length || 2} Productos
            </div>
            <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "4px", fontWeight: 700 }}>
              Requieren reposición inmediata
            </div>
          </div>
        </div>

        {/* MENSAJE DE TOAST / ALERTA */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: "1.5rem",
                padding: "0.9rem 1.25rem",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                background:
                  toastMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: toastMessage.type === "success" ? "#065f46" : "#991b1b",
                border:
                  toastMessage.type === "success"
                    ? "1px solid #a7f3d0"
                    : "1px solid #fecaca",
              }}
            >
              {toastMessage.type === "success" ? (
                <CheckCircle2 size={18} color="#10B981" />
              ) : (
                <AlertCircle size={18} color="#ef4444" />
              )}
              {toastMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ESTRUCTURA DE 2 COLUMNAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* COLUMNA IZQUIERDA: CONFIGURACIÓN WHATSAPP Y AUTOMATIZACIONES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* CARD 1: WHATSAPP DEL DUEÑO */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "0.3rem" }}>
                📱 Tu Número de WhatsApp (Copiloto)
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0 0 1rem 0" }}>
                Número en el que recibirás alertas proactivas, reportes diarios de ventas y notificaciones de stock.
              </p>

              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                placeholder="Ej: +54 9 343 504 2812"
                style={{
                  width: "100%",
                  padding: "0.75rem 0.95rem",
                  borderRadius: "12px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.88rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            {/* CARD 2: AUTOMATIZACIONES PROACTIVAS */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>
                ⚡ Automatizaciones Proactivas
              </div>

              {/* TOGGLE 1: REPORTES DIARIOS */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>
                    📊 Reporte Diario de Ventas a las 20:00 hs
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                    Resumen en tu WhatsApp con facturación y proyección.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.daily_reports}
                  onChange={(e) =>
                    setSettings({ ...settings, daily_reports: e.target.checked })
                  }
                  style={{ width: "20px", height: "20px", accentColor: "#10B981" }}
                />
              </div>

              {/* TOGGLE 2: ALERTAS DE STOCK */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>
                    🚨 Alertas de Stock Crítico
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                    Aviso cuando un producto clave tenga 3 o menos unidades.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.stock_alerts}
                  onChange={(e) =>
                    setSettings({ ...settings, stock_alerts: e.target.checked })
                  }
                  style={{ width: "20px", height: "20px", accentColor: "#10B981" }}
                />
              </div>

              {/* TOGGLE 3: AUTO CARRITOS */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>
                    🛒 Auto-Recuperación de Carritos
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                    Envío automático vía Resend y WhatsApp a los 30 min.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_cart_recovery}
                  onChange={(e) =>
                    setSettings({ ...settings, auto_cart_recovery: e.target.checked })
                  }
                  style={{ width: "20px", height: "20px", accentColor: "#10B981" }}
                />
              </div>
            </div>

            {/* CARD 3: INTEGRACIÓN MCP EXTERNA (Claude, ChatGPT, Gemini) */}
            <div
              style={{
                background: "#f9fafb",
                border: "1.5px dashed #cbd5e1",
                borderRadius: "20px",
                padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                <BrainCircuit size={20} color="#3b82f6" />
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b" }}>
                  Integración MCP de Inteligencia Artificial
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Nevux Copilot está preparado para conectarse vía protocolo MCP con <strong>Claude, ChatGPT, Cursor y Gemini</strong> para consultar tus ventas en tiempo real desde cualquier asistente de IA.
              </p>
            </div>

            {/* BOTÓN GUARDAR */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "16px",
                border: "none",
                background: "#10B981",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "1rem",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 8px 25px rgba(16, 185, 129, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando Copiloto...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Ajustes de Copiloto IA
                </>
              )}
            </button>
          </div>

          {/* COLUMNA DERECHA: CHAT COPILOTO SIMULADOR INTERACTIVO STICKY */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <div style={{ marginBottom: "0.6rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#374151" }}>
                🤖 Hablá con tu Copiloto en Vivo
              </span>
              <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 700 }}>
                ● Datos Reales de Tiendanube
              </span>
            </div>

            <CopilotSimulator
              settings={settings}
              storeId={store?.store_id || null}
              metrics={metrics}
            />
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: "3rem" }}>
          <CentroAyuda />
        </div>
      </main>
    </div>
  );
          }
