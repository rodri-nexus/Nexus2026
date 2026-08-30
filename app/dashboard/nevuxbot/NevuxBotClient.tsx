// app/dashboard/nevuxbot/NevuxBotClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Sparkles,
  MessageCircle,
  RefreshCw,
  Check,
  ArrowLeft,
  Bot,
  Copy,
  ExternalLink,
  Settings,
  Mail,
  User,
  Loader2,
  TrendingUp,
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

type CartStatus = "pending" | "contacted" | "recovered";

interface AbandonedCheckout {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: string[];
  total: number;
  currency: string;
  checkoutUrl: string;
  createdAt: string;
  status?: CartStatus;
}

export default function NevuxBotClient({ email, store }: NevuxBotClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  // Configuración del Bot
  const [botName, setBotName] = useState("Sofía");
  const [personality, setPersonality] = useState<"persuasivo" | "calida" | "urgente">("persuasivo");
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Lista de checkouts y CRM statuses locales
  const [checkouts, setCheckouts] = useState<AbandonedCheckout[]>([]);
  const [cartStatuses, setCartStatuses] = useState<Record<string, CartStatus>>({});
  const [activeTab, setActiveTab] = useState<"todos" | CartStatus>("todos");

  // Estado para la modal / generador de copy
  const [selectedCheckout, setSelectedCheckout] = useState<AbandonedCheckout | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estado de envío de email
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const formatCurrency = (val: number, currencyCode?: string) => {
    const code = currencyCode || "ARS";
    let locale = "es-AR";
    if (code === "BRL") locale = "pt-BR";
    else if (code === "MXN") locale = "es-MX";
    else if (code === "COP") locale = "es-CO";
    else if (code === "CLP") locale = "es-CL";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "CLP" ? 0 : 0,
    }).format(val);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  // Cargar configuración e información de carritos
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Cargar Configuración
      const confRes = await fetch("/api/nevuxbot/config");
      if (confRes.ok) {
        const confData = await confRes.json();
        if (confData.config) {
          setBotName(confData.config.bot_name || "Sofía");
          setPersonality(confData.config.personality || "persuasivo");
        }
      }

      // 2. Cargar Carritos Abandonados desde Tiendanube
      const checkRes = await fetch("/api/nevuxbot/chat");
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        const loadedCheckouts: AbandonedCheckout[] = checkData.checkouts || [];
        setCheckouts(loadedCheckouts);

        // Inicializar statuses si no están en local state
        setCartStatuses((prev) => {
          const next = { ...prev };
          loadedCheckouts.forEach((c) => {
            if (!next[c.id]) {
              next[c.id] = c.status || "pending";
            }
          });
          return next;
        });
      }
    } catch (err) {
      console.error("Error cargando datos de carritos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cambiar estado CRM de un carrito
  const updateCartStatus = async (cartId: string, newStatus: CartStatus) => {
    setCartStatuses((prev) => ({ ...prev, [cartId]: newStatus }));

    try {
      await fetch("/api/nevuxbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          cartId,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error("Error actualizando status CRM:", err);
    }
  };

  // Guardar configuración de Tono/Bot Name
  async function handleSaveConfig() {
    setSavingConfig(true);
    setConfigSaved(false);
    try {
      const res = await fetch("/api/nevuxbot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: true,
          bot_name: botName,
          personality,
        }),
      });
      if (res.ok) {
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 2500);
      }
    } catch (err) {
      console.error("Error guardando config:", err);
    } finally {
      setSavingConfig(false);
    }
  }

  // Generar Copy con Gemini API para un carrito específico
  async function handleGenerateCopy(c: AbandonedCheckout) {
    setSelectedCheckout(c);
    setGeneratingCopy(true);
    setGeneratedMessage("");
    setCopied(false);
    setEmailSentSuccess(false);
    setEmailError(null);

    try {
      const totalFormatted = formatCurrency(c.total, c.currency);
      const res = await fetch("/api/nevuxbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_copy",
          customerName: c.customerName,
          products: c.products,
          totalFormatted,
          checkoutUrl: c.checkoutUrl,
          tone: personality,
          botName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedMessage(data.message || "");
      }
    } catch (err) {
      console.error("Error generando mensaje de recupero:", err);
    } finally {
      setGeneratingCopy(false);
    }
  }

  // Enviar Email con Resend
  async function handleSendEmail() {
    if (!selectedCheckout || sendingEmail) return;

    if (!selectedCheckout.customerEmail) {
      setEmailError("Este comprador no ingresó su dirección de email.");
      return;
    }

    setSendingEmail(true);
    setEmailError(null);
    setEmailSentSuccess(false);

    try {
      const totalFormatted = formatCurrency(selectedCheckout.total, selectedCheckout.currency);
      const res = await fetch("/api/nevuxbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_email",
          customerName: selectedCheckout.customerName,
          customerEmail: selectedCheckout.customerEmail,
          products: selectedCheckout.products,
          totalFormatted,
          checkoutUrl: selectedCheckout.checkoutUrl,
          customMessage: generatedMessage,
          botName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEmailSentSuccess(true);
        updateCartStatus(selectedCheckout.id, "contacted");
      } else {
        setEmailError(data.error || "No se pudo enviar el correo de recupero.");
      }
    } catch (err) {
      console.error("Error enviando email de recupero:", err);
      setEmailError("Error de conexión al enviar el correo.");
    } finally {
      setSendingEmail(false);
    }
  }

  // Abrir WhatsApp con mensaje pre-cargado
  const handleOpenWhatsApp = () => {
    if (!selectedCheckout || !generatedMessage) return;

    updateCartStatus(selectedCheckout.id, "contacted");

    const phone = selectedCheckout.customerPhone.replace(/[^0-9]/g, "");
    if (!phone) {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      window.open("https://web.whatsapp.com/", "_blank");
      return;
    }

    const encodedText = encodeURIComponent(generatedMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Cálculos dinámicos CRM con soporte multidivisa dinámico por item
  const totalAbandoned = checkouts.length;
  const recoverableAmount = checkouts.reduce((acc, c) => acc + c.total, 0);

  const recoveredCheckouts = checkouts.filter(
    (c) => cartStatuses[c.id] === "recovered"
  );
  const recoveredCount = recoveredCheckouts.length;
  const recoveredAmount = recoveredCheckouts.reduce((acc, c) => acc + c.total, 0);

  const pendingCount = checkouts.filter(
    (c) => (cartStatuses[c.id] || "pending") === "pending"
  ).length;
  const contactedCount = checkouts.filter(
    (c) => cartStatuses[c.id] === "contacted"
  ).length;

  const filteredCheckouts = checkouts.filter((c) => {
    const st = cartStatuses[c.id] || "pending";
    if (activeTab === "todos") return true;
    return st === activeTab;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
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
          padding: "1.5rem 1.25rem 4rem",
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
          style={{ marginBottom: "1.75rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
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
                  border: "1px solid #a7f3d0",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  color: "#059669",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                <Sparkles size={13} color="#10B981" />
                Motor CRM de Recuperación
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
                Gestioná y recuperá carritos abandonados de Tiendanube con seguimiento inteligente.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={loadData}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.15rem",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#000000",
                  cursor: "pointer",
                }}
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                Actualizar
              </button>

              <button
                onClick={() => setShowConfig(!showConfig)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.15rem",
                  borderRadius: "12px",
                  border: "1.5px solid #10B981",
                  background: "#10B981",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#059669";
                  e.currentTarget.style.borderColor = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#10B981";
                  e.currentTarget.style.borderColor = "#10B981";
                }}
              >
                <Settings size={15} />
                Ajustes IA
              </button>
            </div>
          </div>
        </motion.div>

        {/* PANEL DESPLEGABLE DE CONFIGURACIÓN DE IA */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "#ffffff",
                border: "1.5px solid #10B981",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "1.75rem",
                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.08)",
              }}
            >
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 800, color: "#000" }}>
                ⚙️ Configuración del Asistente de Recupero
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#000",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Nombre del Asesor/a:
                  </label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Ej: Sofía, Lucas..."
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxSizing: "border-box",
                      color: "#000",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#000",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Tono de Conversación:
                  </label>
                  <select
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      background: "#ffffff",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxSizing: "border-box",
                      color: "#000",
                    }}
                  >
                    <option value="persuasivo">Persuasivo y Profesional</option>
                    <option value="calida">Cálido y Cercano</option>
                    <option value="urgente">Urgencia / Stock Limitado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  style={{
                    padding: "0.65rem 1.5rem",
                    borderRadius: "999px",
                    border: "none",
                    background: "#10B981",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#10B981")}
                >
                  {savingConfig ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : configSaved ? (
                    <Check size={14} />
                  ) : null}
                  {configSaved ? "¡Guardado!" : "Guardar Cambios"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GRID DE MÉTRICAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem",
              }}
            >
              <ShoppingBag size={18} color="#ffffff" />
            </div>
            <div style={{ fontSize: "0.8rem", color: "#000", opacity: 0.6, fontWeight: 600 }}>
              Carritos Abandonados
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#000", marginTop: "0.2rem" }}>
              {totalAbandoned}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600, marginTop: "0.25rem" }}>
              En tu tienda
            </div>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem",
              }}
            >
              <DollarSign size={18} color="#ffffff" />
            </div>
            <div style={{ fontSize: "0.8rem", color: "#000", opacity: 0.6, fontWeight: 600 }}>
              Dinero en Riesgo
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#000", marginTop: "0.2rem" }}>
              {formatCurrency(recoverableAmount, checkouts[0]?.currency)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600, marginTop: "0.25rem" }}>
              Por recuperar
            </div>
          </div>

          {/* Card 3 */}
          <div
            style={{
              background: "#ecfdf5",
              border: "1.5px solid #10B981",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.08)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem",
              }}
            >
              <TrendingUp size={18} color="#ffffff" />
            </div>
            <div style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 700 }}>
              Ventas Recuperadas
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#000", marginTop: "0.2rem" }}>
              {formatCurrency(recoveredAmount, checkouts[0]?.currency)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700, marginTop: "0.25rem" }}>
              {recoveredCount} {recoveredCount === 1 ? "pedido" : "pedidos"} ✅
            </div>
          </div>

          {/* Card 4 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem",
              }}
            >
              <Bot size={18} color="#ffffff" />
            </div>
            <div style={{ fontSize: "0.8rem", color: "#000", opacity: 0.6, fontWeight: 600 }}>
              Asesor Activo
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#000", marginTop: "0.2rem" }}>
              {botName}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600, marginTop: "0.25rem" }}>
              Tono: {personality}
            </div>
          </div>
        </div>

        {/* SECCIÓN LISTADO CRM CON FILTROS */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#000" }}>
                Gestión de Carritos CRM
              </h2>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#000", opacity: 0.6 }}>
                Filtrá y marcá los carritos recuperados para medir tu ganancia real.
              </p>
            </div>

            {/* Pestañas de filtrado */}
            <div
              style={{
                display: "inline-flex",
                background: "#f3f4f6",
                padding: "3px",
                borderRadius: "10px",
                gap: "2px",
                flexWrap: "wrap",
              }}
            >
              {(
                [
                  { key: "todos", label: `Todos (${totalAbandoned})` },
                  { key: "pending", label: `Pendientes (${pendingCount})` },
                  { key: "contacted", label: `Contactados (${contactedCount})` },
                  { key: "recovered", label: `Recuperados (${recoveredCount})` },
                ] as { key: "todos" | CartStatus; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "0.45rem 0.85rem",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    borderRadius: "8px",
                    border: "none",
                    background: activeTab === tab.key ? "#ffffff" : "transparent",
                    color: activeTab === tab.key ? "#10B981" : "#000000",
                    boxShadow:
                      activeTab === tab.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "3rem 1rem", textAlign: "center", color: "#10B981" }}>
              <RefreshCw size={32} className="animate-spin" style={{ margin: "0 auto 1rem", color: "#10B981" }} />
              <div style={{ fontWeight: 700, color: "#000" }}>Obteniendo carritos de Tiendanube...</div>
            </div>
          ) : filteredCheckouts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {filteredCheckouts.map((c) => {
                const currentStatus = cartStatuses[c.id] || "pending";

                return (
                  <div
                    key={c.id}
                    style={{
                      background: currentStatus === "recovered" ? "#ecfdf5" : "#f9fafb",
                      border:
                        currentStatus === "recovered"
                          ? "1.5px solid #10B981"
                          : "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "1.15rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1rem",
                              fontWeight: 800,
                              color: "#000",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <User size={16} color="#10B981" />
                            {c.customerName}
                          </div>

                          {/* Badge CRM Status */}
                          {currentStatus === "pending" && (
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "999px",
                                background: "#fef3c7",
                                color: "#b45309",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                              }}
                            >
                              🟡 Pendiente
                            </span>
                          )}

                          {currentStatus === "contacted" && (
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "999px",
                                background: "#e0f2fe",
                                color: "#0369a1",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                              }}
                            >
                              🔵 Contactado
                            </span>
                          )}

                          {currentStatus === "recovered" && (
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "999px",
                                background: "#10B981",
                                color: "#ffffff",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                              }}
                            >
                              🟢 Venta Recuperada ✅
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#000",
                            opacity: 0.6,
                            marginTop: "0.2rem",
                            display: "flex",
                            gap: "0.8rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {c.customerEmail && <span>✉️ {c.customerEmail}</span>}
                          {c.customerPhone && <span>📱 {c.customerPhone}</span>}
                          <span>🕒 {formatDate(c.createdAt)}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#10B981" }}>
                          {formatCurrency(c.total, c.currency)}
                        </div>
                      </div>
                    </div>

                    {/* Productos */}
                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #f3f4f6",
                        borderRadius: "10px",
                        padding: "0.65rem 0.85rem",
                        fontSize: "0.82rem",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ color: "#10B981", fontWeight: 800 }}>Productos:</span>{" "}
                      {c.products.length > 0 ? c.products.join(" • ") : "Carrito sin especificar"}
                    </div>

                    {/* Acciones */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.6rem",
                      }}
                    >
                      {/* Selector directo de estado CRM */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.5 }}>
                          Estado:
                        </span>
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            updateCartStatus(c.id, e.target.value as CartStatus)
                          }
                          style={{
                            padding: "0.35rem 0.65rem",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: "#000",
                            cursor: "pointer",
                          }}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="contacted">Contactado</option>
                          <option value="recovered">Venta Recuperada ✅</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {c.checkoutUrl && (
                          <a
                            href={c.checkoutUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "0.55rem 0.85rem",
                              borderRadius: "10px",
                              border: "1px solid #e5e7eb",
                              background: "#ffffff",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              color: "#000",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <ExternalLink size={13} />
                            Ver Checkout
                          </a>
                        )}

                        <button
                          onClick={() => handleGenerateCopy(c)}
                          style={{
                            padding: "0.55rem 1.1rem",
                            borderRadius: "10px",
                            border: "none",
                            background: "#10B981",
                            color: "#ffffff",
                            fontSize: "0.82rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#10B981")}
                        >
                          <Sparkles size={14} />
                          Recuperar con IA
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: "3rem 1rem",
                textAlign: "center",
                background: "#fafafa",
                border: "1px dashed #e5e7eb",
                borderRadius: "12px",
              }}
            >
              <ShoppingBag size={36} color="#000" style={{ opacity: 0.2, margin: "0 auto 0.75rem" }} />
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#000" }}>
                No hay carritos en la categoría "{activeTab}"
              </div>
              <p style={{ fontSize: "0.85rem", color: "#000", opacity: 0.5, margin: "0.25rem 0 0" }}>
                Cambiá de pestaña para ver el resto de los carritos.
              </p>
            </div>
          )}
        </div>

        {/* MODAL GENERADOR DE COPY CON IA */}
        <AnimatePresence>
          {selectedCheckout && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "1rem",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "1.75rem",
                  maxWidth: "540px",
                  width: "100%",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Sparkles size={16} color="#ffffff" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#000" }}>
                        Mensaje de Recupero IA
                      </h3>
                      <div style={{ fontSize: "0.78rem", color: "#000", opacity: 0.5 }}>
                        Para {selectedCheckout.customerName}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCheckout(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "1.25rem",
                      cursor: "pointer",
                      color: "#000",
                      opacity: 0.5,
                    }}
                  >
                    ✕
                  </button>
                </div>

                {generatingCopy ? (
                  <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
                    <RefreshCw size={32} color="#10B981" className="animate-spin" style={{ margin: "0 auto 1rem" }} />
                    <div style={{ fontWeight: 700, color: "#000" }}>Gemini IA está redactando el mensaje...</div>
                    <div style={{ fontSize: "0.8rem", color: "#000", opacity: 0.5, marginTop: "0.25rem" }}>
                      Personalizando según productos y precio
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={generatedMessage}
                      onChange={(e) => setGeneratedMessage(e.target.value)}
                      rows={6}
                      style={{
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "12px",
                        border: "1px solid #a7f3d0",
                        background: "#ecfdf5",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#000",
                        lineHeight: 1.5,
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        marginBottom: "1rem",
                        outline: "none",
                      }}
                    />

                    {/* Feedback de error o éxito de Email */}
                    {emailSentSuccess && (
                      <div
                        style={{
                          padding: "0.65rem 0.85rem",
                          borderRadius: "10px",
                          background: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          color: "#059669",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          marginBottom: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Check size={16} />
                        ¡Email enviado! Carrito marcado como Contactado.
                      </div>
                    )}

                    {emailError && (
                      <div
                        style={{
                          padding: "0.65rem 0.85rem",
                          borderRadius: "10px",
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          color: "#dc2626",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          marginBottom: "1rem",
                        }}
                      >
                        {emailError}
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                      <button
                        onClick={handleCopyMessage}
                        style={{
                          flex: "1 1 110px",
                          padding: "0.7rem",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          background: "#ffffff",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#000",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                        }}
                      >
                        {copied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
                        {copied ? "¡Copiado!" : "Copiar"}
                      </button>

                      <button
                        onClick={handleSendEmail}
                        disabled={sendingEmail || !selectedCheckout.customerEmail}
                        style={{
                          flex: "1 1 130px",
                          padding: "0.7rem",
                          borderRadius: "12px",
                          border: "1.5px solid #10B981",
                          background: "#ffffff",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          color: "#10B981",
                          cursor: sendingEmail || !selectedCheckout.customerEmail ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                          opacity: sendingEmail || !selectedCheckout.customerEmail ? 0.6 : 1,
                          transition: "background 0.2s, color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (!sendingEmail && selectedCheckout?.customerEmail) {
                            e.currentTarget.style.background = "#10B981";
                            e.currentTarget.style.color = "#ffffff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!sendingEmail && selectedCheckout?.customerEmail) {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.color = "#10B981";
                          }
                        }}
                      >
                        {sendingEmail ? (
                          <Loader2 size={15} className="animate-spin" color="#10B981" />
                        ) : (
                          <Mail size={15} />
                        )}
                        Enviar por Email
                      </button>

                      <button
                        onClick={handleOpenWhatsApp}
                        style={{
                          flex: "1 1 150px",
                          padding: "0.7rem",
                          borderRadius: "12px",
                          border: "none",
                          background: "#22c55e",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          color: "#ffffff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                          boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#1ebd52")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#22c55e")}
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Centro de Ayuda */}
        <CentroAyuda />
      </main>
    </div>
  );
    }
