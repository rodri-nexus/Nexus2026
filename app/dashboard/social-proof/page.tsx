// app/dashboard/social-proof/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Eye,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface SocialProofConfig {
  is_active: boolean;
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  display_duration: number;
  delay_between: number;
  enable_recent_sales: boolean;
  enable_live_visitors: boolean;
  enable_low_stock: boolean;
  theme_style: "light" | "dark" | "glass";
}

interface SocialProofEvent {
  id: string;
  type: "sale" | "visitor" | "stock";
  title: string;
  subtitle: string;
  timeAgo?: string;
  icon?: string;
  productName?: string;
  productImage?: string;
  location?: string;
  count?: number;
}

interface UserStore {
  store_id: number;
  user_id: string;
}

interface FeedbackState {
  type: "success" | "error";
  message: string;
}

/* ═══════════════════════════════════════════
   DEFAULTS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: SocialProofConfig = {
  is_active: true,
  position: "bottom-left",
  display_duration: 5,
  delay_between: 8,
  enable_recent_sales: true,
  enable_live_visitors: true,
  enable_low_stock: true,
  theme_style: "light",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: SIMULADOR FLOTANTE DE SOCIAL PROOF
═══════════════════════════════════════════ */
function SocialProofSimulatorPreview({
  config,
  sampleEvent,
}: {
  config: SocialProofConfig;
  sampleEvent: SocialProofEvent | null;
}) {
  const isDark = config.theme_style === "dark";
  const isGlass = config.theme_style === "glass";

  const event = sampleEvent || {
    id: "sample",
    type: "sale" as const,
    title: "María L. de Buenos Aires",
    subtitle: "Compró Zapatillas Running Pro",
    timeAgo: "hace 3 minutos",
    icon: "🛒",
    productName: "Zapatillas Running Pro",
    productImage: "",
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #10B981",
        borderRadius: "20px",
        padding: "1.5rem",
        boxShadow: "0 8px 30px rgba(16, 185, 129, 0.08)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Eye size={14} color="#10B981" />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "#059669",
              textTransform: "uppercase",
            }}
          >
            Simulador Flotante en Vivo
          </span>
        </div>

        <span
          style={{
            background: "#ecfdf5",
            color: "#059669",
            border: "1px solid #a7f3d0",
            fontSize: "0.72rem",
            fontWeight: 800,
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
          }}
        >
          {config.position.replace("-", " ").toUpperCase()}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "220px",
          background: "#f3f4f6",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", opacity: 0.3, pointerEvents: "none" }}>
          <div style={{ fontSize: "2rem" }}>🛍️</div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>Ficha del Producto</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={event.id + config.theme_style}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: config.position.includes("bottom") ? "12px" : "auto",
              top: config.position.includes("top") ? "12px" : "auto",
              left: config.position.includes("left") ? "12px" : "auto",
              right: config.position.includes("right") ? "12px" : "auto",
              maxWidth: "280px",
              width: "calc(100% - 24px)",
              padding: "10px 12px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              background: isDark
                ? "#111827"
                : isGlass
                ? "rgba(255, 255, 255, 0.85)"
                : "#ffffff",
              backdropFilter: isGlass ? "blur(12px)" : "none",
              WebkitBackdropFilter: isGlass ? "blur(12px)" : "none",
              color: isDark ? "#ffffff" : "#111827",
              border: isDark
                ? "1px solid #374151"
                : isGlass
                ? "1px solid rgba(255, 255, 255, 0.5)"
                : "1px solid #e5e7eb",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                overflow: "hidden",
                background: isDark ? "#1f2937" : "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid #e5e7eb",
              }}
            >
              {event.productImage ? (
                <img
                  src={event.productImage}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "20px" }}>{event.icon || "🛒"}</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {event.title}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: isDark ? "#9ca3af" : "#6b7280",
                  lineHeight: 1.2,
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {event.subtitle}
              </div>
              {event.timeAgo && (
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "#10B981",
                    fontWeight: 700,
                    marginTop: "2px",
                  }}
                >
                  ⚡ {event.timeAgo}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        style={{
          marginTop: "1rem",
          fontSize: "0.78rem",
          color: "#6b7280",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        💡 Las notificaciones flotarán suavemente en las esquinas de tu tienda generando un ambiente de alta demanda y compras en vivo.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function SocialProofPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [config, setConfig] = useState<SocialProofConfig>(DEFAULT_CONFIG);
  const [events, setEvents] = useState<SocialProofEvent[]>([]);
  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const loadData = async (storeId: number) => {
    try {
      const res = await fetch(`/api/social-proof?store_id=${storeId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setConfig({
            is_active: data.settings.is_active ?? false,
            position: data.settings.position || "bottom-left",
            display_duration: Number(data.settings.display_duration) || 5,
            delay_between: Number(data.settings.delay_between) || 8,
            enable_recent_sales: data.settings.enable_recent_sales ?? true,
            enable_live_visitors: data.settings.enable_live_visitors ?? true,
            enable_low_stock: data.settings.enable_low_stock ?? true,
            theme_style: data.settings.theme_style || "light",
          });
        }
        if (Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
        }
      }
    } catch (err) {
      console.error("Error cargando Social Proof:", err);
    }
  };

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
            await loadData(storeData.store_id);
          }
        }
      } catch (err) {
        console.error("Error inicializando Social Proof:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentEventIdx((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events]);

  const handleSaveConfig = async () => {
    if (!store) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/social-proof", {
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
        message: "¡Configuración de Social Proof IA guardada con éxito!",
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
            <Flame size={13} color="#10B981" />
            Social Proof Pro IA
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
            Notificaciones de Compras & Actividad en Vivo
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Aumentá la confianza y dispará el FOMO (*miedo a perderse la oferta*) mostrando pequeñas popups de compras recientes, personas viendo productos y stock crítico en tu tienda.
          </p>
        </motion.div>

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
              Cargando módulo de Social Proof...
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>
                      Notificaciones Social Proof Activas
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                      Muestra la actividad de compra flotante en tu tienda
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
                      flexShrink: 0,
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
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>
                    Tipos de Notificaciones a Mostrar
                  </div>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ShoppingCart size={16} color="#10B981" />
                      <span>Compras Recientes en Vivo</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.enable_recent_sales}
                      onChange={(e) => setConfig((prev) => ({ ...prev, enable_recent_sales: e.target.checked }))}
                      style={{ accentColor: "#10B981", width: "18px", height: "18px" }}
                    />
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Users size={16} color="#3B82F6" />
                      <span>Visitantes Viendo el Producto</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.enable_live_visitors}
                      onChange={(e) => setConfig((prev) => ({ ...prev, enable_live_visitors: e.target.checked }))}
                      style={{ accentColor: "#10B981", width: "18px", height: "18px" }}
                    />
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Zap size={16} color="#EF4444" />
                      <span>Alerta de Stock Crítico</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.enable_low_stock}
                      onChange={(e) => setConfig((prev) => ({ ...prev, enable_low_stock: e.target.checked }))}
                      style={{ accentColor: "#10B981", width: "18px", height: "18px" }}
                    />
                  </label>
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
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, marginBottom: "0.5rem", color: "#111827" }}>
                      Posición en la Tienda
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                      {[
                        { id: "bottom-left", label: "↙ Abajo Izq" },
                        { id: "bottom-right", label: "↘ Abajo Der" },
                        { id: "top-left", label: "↖ Arriba Izq" },
                        { id: "top-right", label: "↗ Arriba Der" },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, position: pos.id as any }))}
                          style={{
                            padding: "0.6rem",
                            borderRadius: "10px",
                            border: config.position === pos.id ? "2px solid #10B981" : "1px solid #e5e7eb",
                            background: config.position === pos.id ? "#ecfdf5" : "#ffffff",
                            color: config.position === pos.id ? "#059669" : "#374151",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            cursor: "pointer",
                          }}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, marginBottom: "0.5rem", color: "#111827" }}>
                      Estilo de Diseño
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                      {[
                        { id: "light", label: "☀️ Claro" },
                        { id: "dark", label: "🌙 Oscuro" },
                        { id: "glass", label: "✨ Glass" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, theme_style: st.id as any }))}
                          style={{
                            padding: "0.6rem 0.3rem",
                            borderRadius: "10px",
                            border: config.theme_style === st.id ? "2px solid #10B981" : "1px solid #e5e7eb",
                            background: config.theme_style === st.id ? "#ecfdf5" : "#ffffff",
                            color: config.theme_style === st.id ? "#059669" : "#374151",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            cursor: "pointer",
                          }}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveConfig}
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
                      Guardando ajustes...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Guardar Social Proof IA
                    </>
                  )}
                </button>
              </div>

              <div style={{ position: "sticky", top: "2rem" }}>
                <SocialProofSimulatorPreview
                  config={config}
                  sampleEvent={events.length > 0 ? events[currentEventIdx] : null}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "3rem" }}>
          <CentroAyuda />
        </div>
      </main>
    </div>
  );
  }
