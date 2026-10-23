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
  Phone,
  ShieldCheck,
  HelpCircle,
  Check,
  RefreshCw,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES
═══════════════════════════════════════════ */
type PersonalityType = "ceo_argentino" | "expert" | "dynamic";

interface VirtualSalesmanConfig {
  is_active: boolean;
  agent_name: string;
  welcome_message: string;
  agent_avatar: string;
  personality: PersonalityType;
  whatsapp_number: string;
  transfer_keyword: string;
  transfer_message: string;
  business_rules: string;
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
   CONSTANTES Y OPCIONES
═══════════════════════════════════════════ */
const AVATAR_OPTIONS = ["👨‍💼", "👩‍💼", "🤖", "🛍️", "⚡", "💎", "⭐"];

const PERSONALITY_OPTIONS: { id: PersonalityType; title: string; desc: string }[] = [
  {
    id: "ceo_argentino",
    title: "CEO Argentino (Humano & Cercano)",
    desc: "Tono súper humano, auténtico y profesional. Responde con calidez argentina, sin respuestas robóticas ni modismos de bot.",
  },
  {
    id: "expert",
    title: "Asesor Técnico Experto",
    desc: "Tono profesional y preciso, enfocado en especificaciones técnicas, talles, materiales y detalles de producto.",
  },
  {
    id: "dynamic",
    title: "Vendedor Dinámico & Promos",
    desc: "Destaca facilidades de pago, cuotas sin interés, descuentos en efectivo/transferencia y cierres rápidos.",
  },
];

const COLOR_PRESETS = ["#10B981", "#25D366", "#3B82F6", "#8B5CF6", "#F59E0B", "#111827"];

const DEFAULT_CONFIG: VirtualSalesmanConfig = {
  is_active: true,
  agent_name: "Sofía (Asesora Virtual)",
  welcome_message: "¡Qué tal! 👋 ¿Buscás algo en especial hoy? Contame qué tenés en mente y te ayudo a encontrar el producto ideal.",
  agent_avatar: "👩‍💼",
  personality: "ceo_argentino",
  whatsapp_number: "",
  transfer_keyword: "COMPAÑERO",
  transfer_message: "Te comunico directo con uno de nuestros compañeros en el local para que te atiendan personalmente y coordinen tu pedido.",
  business_rules: "Aceptamos transferencia bancaria con 10% de descuento. Envíos a todo el país por Correo Argentino. Despachamos dentro de las 24hs hábiles.",
  theme_color: "#10B981",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: SIMULADOR INTERACTIVO DE CHAT EN VIVO
═══════════════════════════════════════════ */
function VirtualSalesmanChatSimulator({
  config,
}: {
  config: VirtualSalesmanConfig;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "bot",
      text: config.welcome_message,
      timestamp: "Ahora",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Reiniciar chat cuando cambia el mensaje de bienvenida
  useEffect(() => {
    setMessages([
      {
        id: "init-1",
        sender: "bot",
        text: config.welcome_message || "¡Hola! ¿En qué te ayudo?",
        timestamp: "Ahora",
      },
    ]);
  }, [config.welcome_message]);

  const handleSendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulación de respuesta inteligente de la IA
    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      const isTransfer =
        lower.includes(config.transfer_keyword.toLowerCase()) ||
        lower.includes("compañero") ||
        lower.includes("humano") ||
        lower.includes("asesor") ||
        lower.includes("descuento") ||
        lower.includes("negociar");

      let botReplyText = "";
      let showWhatsapp = false;

      if (isTransfer) {
        botReplyText = config.transfer_message || "Te comunico directo con uno de nuestros compañeros en el local.";
        showWhatsapp = true;
      } else if (lower.includes("coca") || lower.includes("bebida")) {
        botReplyText = "¡De una! Tenemos stock en depósito. La unidad te sale $2.500. ¿Querés que te sume hielo o algún snack para acompañar?";
      } else if (lower.includes("envio") || lower.includes("envío") || lower.includes("entrega")) {
        botReplyText = "Hacemos envíos a todo el país por Correo Argentino y Moto en el día. Si superás los $35.000 el envío te queda GRATIS. ¿De dónde sos así te calculo la demora?";
      } else if (lower.includes("pago") || lower.includes("transferencia") || lower.includes("cuotas")) {
        botReplyText = "Aceptamos todas las tarjetas de crédito con cuotas sin interés y tenés un 10% OFF pagando por transferencia bancaria directa. ¿Qué medio preferís?";
      } else {
        botReplyText = `¡Joyas! Entendido perfecto. Te cuento que tenemos stock disponible en el local. ¿Querés que te reserve este producto o preferís hablar con uno de nuestros compañeros para coordinar el pago? (Escribí '${config.transfer_keyword}' para que te atiendan personalmente).`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        showWhatsappBtn: showWhatsapp,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const cleanFormattedPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, "");
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
        height: "560px",
        position: "relative",
      }}
    >
      {/* Header del Chat */}
      <div
        style={{
          background: config.theme_color || "#10B981",
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
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          >
            {config.agent_avatar || "👩‍💼"}
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>
              {config.agent_name || "Asesor Virtual"}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                  border: "1.5px solid #ffffff",
                  display: "inline-block",
                }}
              />
              En línea | Asistente IA 24/7
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
                text: config.welcome_message,
                timestamp: "Ahora",
              },
            ])
          }
          title="Reiniciar chat"
          style={{
            background: "rgba(255,255,255,0.2)",
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
                  maxWidth: "82%",
                  padding: "0.85rem 1rem",
                  borderRadius: isBot ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                  background: isBot ? "#ffffff" : config.theme_color || "#10B981",
                  color: isBot ? "#111827" : "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  fontSize: "0.86rem",
                  lineHeight: 1.5,
                  border: isBot ? "1px solid #e5e7eb" : "none",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}

                {/* Botón WhatsApp de Derivación a un Compañero */}
                {m.showWhatsappBtn && (
                  <a
                    href={`https://wa.me/${cleanFormattedPhone(
                      config.whatsapp_number || "5493435042812"
                    )}?text=${encodeURIComponent(
                      "Hola! Estaba hablando con su Asistente Virtual en la tienda y quisiera hablar con un compañero para coordinar mi compra."
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: "0.75rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.65rem 0.95rem",
                      borderRadius: "10px",
                      background: "#25D366",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                    }}
                  >
                    <MessageCircle size={16} />
                    Hablar con un compañero en WhatsApp
                  </a>
                )}
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
            {config.agent_name || "Asesor"} está escribiendo...
          </div>
        )}
      </div>

      {/* Footer / Input de Prueba */}
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
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Escribí un mensaje de prueba..."
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
          onClick={handleSendMessage}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: config.theme_color || "#10B981",
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
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function VendedorIaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [config, setConfig] = useState<VirtualSalesmanConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Cargar usuario y configuración guardada de la tienda
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

            // Cargar configuración previa de store_virtual_salesman_settings
            const { data: savedConfig } = await supabase
              .from("store_virtual_salesman_settings")
              .select("*")
              .eq("store_id", storeData.store_id)
              .maybeSingle();

            if (savedConfig && isMounted) {
              setConfig((prev) => ({
                ...prev,
                is_active: savedConfig.is_active ?? prev.is_active,
                agent_name: savedConfig.agent_name || prev.agent_name,
                welcome_message: savedConfig.welcome_message || prev.welcome_message,
                agent_avatar: savedConfig.agent_avatar || prev.agent_avatar,
                personality: savedConfig.personality || prev.personality,
                whatsapp_number: savedConfig.whatsapp_number || prev.whatsapp_number,
                transfer_keyword: savedConfig.transfer_keyword || prev.transfer_keyword,
                transfer_message: savedConfig.transfer_message || prev.transfer_message,
                business_rules: savedConfig.business_rules || prev.business_rules,
                theme_color: savedConfig.theme_color || prev.theme_color,
              }));
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
      const supabase = createClient();
      const payload = {
        store_id: store.store_id,
        is_active: config.is_active,
        agent_name: config.agent_name,
        welcome_message: config.welcome_message,
        agent_avatar: config.agent_avatar,
        personality: config.personality,
        whatsapp_number: config.whatsapp_number,
        transfer_keyword: config.transfer_keyword,
        transfer_message: config.transfer_message,
        business_rules: config.business_rules,
        theme_color: config.theme_color,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("store_virtual_salesman_settings")
        .upsert(payload, { onConflict: "store_id" });

      if (error) {
        console.error("Error guardando en Supabase:", error);
        setToastMessage({
          type: "error",
          text: "Ocurrió un problema al guardar. Intentalo de nuevo.",
        });
      } else {
        setToastMessage({
          type: "success",
          text: "¡Ajustes del Vendedor Virtual IA guardados correctamente!",
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
          maxWidth: "1150px",
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

        {/* ENCABEZADO CON BADGE PRO */}
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
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Sparkles size={13} color="#10B981" />
            Función Pro IA Activa 🤖
          </div>

          <h1
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.9rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            Vendedor Virtual IA & Cierre WhatsApp 🚀
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            Agente inteligente 24/7 para tu tienda online. Responde dudas, recomienda productos, verifica stock y deriva la venta a WhatsApp con tu equipo de compañeros.
          </p>
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

        {/* ESTRUCTURA PRINCIPAL (2 COLUMNAS) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* COLUMNA IZQUIERDA: CONFIGURADOR COMPLETO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* CARD 1: ESTADO Y WHATSAPP DEL NEGOCIO */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
                    Estado del Vendedor Virtual
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    Activa la burbuja de atención inteligente en tu tienda
                  </div>
                </div>

                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "50px",
                    height: "26px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={config.is_active}
                    onChange={(e) =>
                      setConfig({ ...config, is_active: e.target.checked })
                    }
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: config.is_active ? "#10B981" : "#d1d5db",
                      borderRadius: "34px",
                      transition: "0.3s",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      content: '""',
                      height: "20px",
                      width: "20px",
                      left: config.is_active ? "26px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transition: "0.3s",
                    }}
                  />
                </label>
              </div>

              {/* INPUT NUMERO WHATSAPP */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                    color: "#374151",
                  }}
                >
                  📱 WhatsApp Business de la Tienda
                </label>
                <input
                  type="text"
                  value={config.whatsapp_number}
                  onChange={(e) =>
                    setConfig({ ...config, whatsapp_number: e.target.value })
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
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  Número al que se derivarán los clientes cuando soliciten hablar con un compañero.
                </span>
              </div>
            </div>

            {/* CARD 2: IDENTIDAD DEL ASESOR & BIENVENIDA */}
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
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
                Identidad & Mensaje Inicial
              </div>

              {/* NOMBRE ASESOR */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                    color: "#374151",
                  }}
                >
                  Nombre del Asesor Virtual
                </label>
                <input
                  type="text"
                  value={config.agent_name}
                  onChange={(e) =>
                    setConfig({ ...config, agent_name: e.target.value })
                  }
                  placeholder="Ej: Sofía (Asesora Virtual)"
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

              {/* SELECCIÓN DE AVATAR */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                    color: "#374151",
                  }}
                >
                  Avatar / Ícono
                </label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setConfig({ ...config, agent_avatar: emoji })}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        border:
                          config.agent_avatar === emoji
                            ? "2px solid #10B981"
                            : "1.5px solid #e5e7eb",
                        background:
                          config.agent_avatar === emoji ? "#ecfdf5" : "#ffffff",
                        fontSize: "1.3rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* MENSAJE DE BIENVENIDA */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                    color: "#374151",
                  }}
                >
                  Mensaje de Bienvenida Inicial
                </label>
                <textarea
                  rows={3}
                  value={config.welcome_message}
                  onChange={(e) =>
                    setConfig({ ...config, welcome_message: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.95rem",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.88rem",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            {/* CARD 3: PERSONALIDAD Y TONO DE RESPUESTA */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>
                Estilo & Tono de Respuesta IA
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {PERSONALITY_OPTIONS.map((p) => {
                  const isSelected = config.personality === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setConfig({ ...config, personality: p.id })}
                      style={{
                        padding: "0.95rem 1.1rem",
                        borderRadius: "14px",
                        border: isSelected
                          ? "2px solid #10B981"
                          : "1.5px solid #e5e7eb",
                        background: isSelected ? "#ecfdf5" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: isSelected ? "#065f46" : "#111827",
                          marginBottom: "2px",
                        }}
                      >
                        {p.title}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                        {p.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 4: DERIVACIÓN Y PALABRA CLAVE DE COMPAÑERO */}
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
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
                🤝 Derivación a un Compañero del Equipo
              </div>

              {/* PALABRA CLAVE */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                    color: "#374151",
                  }}
                >
                  Palabra Clave para Derivar
                </label>
                <input
                  type="text"
                  value={config.transfer_keyword}
                  onChange={(e) =>
                    setConfig({ ...config, transfer_keyword: e.target.value.toUpperCase() })
                  }
                  placeholder="Ej: COMPAÑERO"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.95rem",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "4px", display: "block" }}>
                  Si el cliente escribe esta palabra o solicita atención personal, la IA le dará el enlace directo a tu WhatsApp.
                </span>
              </div>

              {/* MENSAJE DE DERIVACIÓN */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                    color: "#374151",
                  }}
                >
                  Mensaje Profesional de Derivación
                </label>
                <textarea
                  rows={3}
                  value={config.transfer_message}
                  onChange={(e) =>
                    setConfig({ ...config, transfer_message: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.95rem",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.88rem",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            {/* CARD 5: REGLAS ESPECÍFICAS DE LA TIENDA */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "0.4rem" }}>
                📜 Reglas de la Tienda (Instrucciones para la IA)
              </div>
              <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: "0 0 1rem 0" }}>
                Escribí reglas estrictas que la IA deba respetar siempre (métodos de pago, políticas de envío, ofertas vigentes).
              </p>

              <textarea
                rows={4}
                value={config.business_rules}
                onChange={(e) =>
                  setConfig({ ...config, business_rules: e.target.value })
                }
                placeholder="Ej: Aceptamos transferencia con 10% desc. Despachamos en 24hs. No hacemos cambios sin etiqueta."
                style={{
                  width: "100%",
                  padding: "0.75rem 0.95rem",
                  borderRadius: "12px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.88rem",
                  boxSizing: "border-box",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* CARD 6: COLOR DEL CHAT */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "0.8rem" }}>
                🎨 Color Principal de la Burbuja
              </div>

              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                {COLOR_PRESETS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setConfig({ ...config, theme_color: col })}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: col,
                      border:
                        config.theme_color === col
                          ? "3px solid #111827"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* BOTÓN GUARDAR GRANDE */}
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
                transition: "all 0.15s ease",
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando ajustes...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Vendedor Virtual IA
                </>
              )}
            </button>
          </div>

          {/* COLUMNA DERECHA: SIMULADOR DE CHAT INTERACTIVO STICKY */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <div style={{ marginBottom: "0.6rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#374151" }}>
                📱 Vista Previa & Prueba en Vivo
              </span>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Probá escribirle a tu IA
              </span>
            </div>

            <VirtualSalesmanChatSimulator config={config} />
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
