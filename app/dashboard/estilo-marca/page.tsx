"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Palette,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Save,
  Sliders,
  Check,
  Eye,
  Ticket,
  Flame,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface BrandConfig {
  primary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  border_radius: "recto" | "suave" | "redondo";
  preset_name: string;
}

interface BrandPreset {
  id: string;
  name: string;
  emoji: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
  borderRadius: "recto" | "suave" | "redondo";
}

interface UserStore {
  store_id: number;
  user_id: string;
}

/* ═══════════════════════════════════════════
   PRESETS DE IDENTIDAD VISUAL (Regla #9 al inicio)
═══════════════════════════════════════════ */
const BRAND_PRESETS: BrandPreset[] = [
  {
    id: "esmeralda",
    name: "Nevux Esmeralda",
    emoji: "💎",
    primary: "#10B981",
    accent: "#059669",
    background: "#ffffff",
    text: "#111827",
    borderRadius: "suave",
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    emoji: "🖤",
    primary: "#ffffff",
    accent: "#a1a1aa",
    background: "#09090b",
    text: "#ffffff",
    borderRadius: "suave",
  },
  {
    id: "gold-luxury",
    name: "Gold Luxury",
    emoji: "👑",
    primary: "#d97706",
    accent: "#b45309",
    background: "#1c1917",
    text: "#ffffff",
    borderRadius: "suave",
  },
  {
    id: "tech-blue",
    name: "Tech Blue",
    emoji: "⚡",
    primary: "#2563eb",
    accent: "#1d4ed8",
    background: "#ffffff",
    text: "#0f172a",
    borderRadius: "suave",
  },
  {
    id: "rosa-chic",
    name: "Rosa Pastel",
    emoji: "🌸",
    primary: "#ec4899",
    accent: "#db2777",
    background: "#ffffff",
    text: "#1f2937",
    borderRadius: "redondo",
  },
  {
    id: "vino-elegance",
    name: "Vino & Elegancia",
    emoji: "🍷",
    primary: "#991b1b",
    accent: "#7f1d1d",
    background: "#fef2f2",
    text: "#1c1917",
    borderRadius: "recto",
  },
  {
    id: "naranja-energia",
    name: "Naranja Energía",
    emoji: "🔥",
    primary: "#ea580c",
    accent: "#c2410c",
    background: "#ffffff",
    text: "#18181b",
    borderRadius: "suave",
  },
  {
    id: "violeta-moderno",
    name: "Violeta Pro",
    emoji: "💜",
    primary: "#8b5cf6",
    accent: "#7c3aed",
    background: "#ffffff",
    text: "#0f172a",
    borderRadius: "redondo",
  },
];

const DEFAULT_BRAND: BrandConfig = {
  primary_color: "#10B981",
  accent_color: "#059669",
  background_color: "#ffffff",
  text_color: "#111827",
  border_radius: "suave",
  preset_name: "Nevux Esmeralda",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: INPUT DE COLOR
═══════════════════════════════════════════ */
function ColorField({
  label,
  value,
  description,
  onChange,
}: {
  label: string;
  value: string;
  description: string;
  onChange: (val: string) => void;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "14px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#000000" }}>{label}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{description}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "1.5px solid #e5e7eb",
              cursor: "pointer",
              padding: 2,
              background: "#ffffff",
            }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "82px",
              padding: "0.4rem 0.5rem",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#000000",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: PREVIEW MULTICOMPONENTE
═══════════════════════════════════════════ */
function BrandSimulatorPreview({ brand }: { brand: BrandConfig }) {
  const radiusPx =
    brand.border_radius === "recto"
      ? "0px"
      : brand.border_radius === "redondo"
      ? "20px"
      : "12px";

  return (
    <div
      style={{
        background: "#f9fafb",
        border: "1.5px solid #e5e7eb",
        borderRadius: "20px",
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#059669",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "1rem",
        }}
      >
        <Eye size={14} />
        Simulador Visual en Vivo
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Banner Deslizante Simulado */}
        <div
          style={{
            background: brand.primary_color,
            color: brand.background_color === "#ffffff" ? "#ffffff" : brand.text_color,
            padding: "0.65rem 1rem",
            borderRadius: radiusPx,
            fontSize: "0.82rem",
            fontWeight: 800,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Sparkles size={14} />
          <span>¡ENVÍO GRATIS EN COMPRAS SUPERIORES A $50.000!</span>
        </div>

        {/* Badge Cupón Simulado */}
        <div
          style={{
            background: brand.background_color,
            border: `1.5px dashed ${brand.primary_color}`,
            borderRadius: radiusPx,
            padding: "1rem",
            color: brand.text_color,
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Ticket size={16} color={brand.primary_color} />
              <span style={{ fontWeight: 800, fontSize: "0.88rem" }}>CUPÓN EXCLUSIVO</span>
            </div>
            <span
              style={{
                background: brand.primary_color,
                color: "#ffffff",
                fontSize: "0.7rem",
                fontWeight: 800,
                padding: "0.2rem 0.55rem",
                borderRadius: "999px",
              }}
            >
              15% OFF
            </span>
          </div>

          <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.78rem", opacity: 0.75 }}>
            Copiá el código para aplicarlo al finalizar tu compra
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0,0,0,0.03)",
              padding: "0.4rem 0.6rem 0.4rem 0.8rem",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "0.9rem" }}>
              BIENVENIDA15
            </span>
            <button
              type="button"
              style={{
                background: brand.primary_color,
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Copiar
            </button>
          </div>
        </div>

        {/* Botón de Acción Principal Simulado */}
        <div
          style={{
            background: brand.primary_color,
            color: "#ffffff",
            padding: "0.85rem",
            borderRadius: radiusPx,
            textAlign: "center",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: `0 4px 14px ${brand.primary_color}40`,
          }}
        >
          Agregar al Carrito →
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function EstiloMarcaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);

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

            // Consultar marca existente
            const res = await fetch(`/api/brand?store_id=${storeData.store_id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.brand) {
                setBrand({
                  primary_color: data.brand.primary_color || DEFAULT_BRAND.primary_color,
                  accent_color: data.brand.accent_color || DEFAULT_BRAND.accent_color,
                  background_color: data.brand.background_color || DEFAULT_BRAND.background_color,
                  text_color: data.brand.text_color || DEFAULT_BRAND.text_color,
                  border_radius: data.brand.border_radius || DEFAULT_BRAND.border_radius,
                  preset_name: data.brand.preset_name || DEFAULT_BRAND.preset_name,
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error inicializando estilo de marca:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApplyPreset = (preset: BrandPreset) => {
    setBrand({
      primary_color: preset.primary,
      accent_color: preset.accent,
      background_color: preset.background,
      text_color: preset.text,
      border_radius: preset.borderRadius,
      preset_name: preset.name,
    });
  };

  const handleSaveOnly = async () => {
    if (!store) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.store_id,
          ...brand,
          sync_all_widgets: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setFeedback({
        type: "success",
        message: "¡Identidad de marca guardada con éxito!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncAll = async () => {
    if (!store) return;
    setSyncing(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.store_id,
          ...brand,
          sync_all_widgets: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al sincronizar");

      setFeedback({
        type: "success",
        message: data.message || "¡Estilo sincronizado en todos tus widgets!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSyncing(false);
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
        {/* NAVEGACIÓN SUPERIOR */}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#000000";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6b7280";
              e.currentTarget.style.borderColor = "#e5e7eb";
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
            <Palette size={13} color="#10B981" />
            Identidad Visual de Marca
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
            Editor Visual "Estilo Marca"
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Definí los colores oficiales de tu tienda y sincronizalos automáticamente en todos tus widgets activos con 1 solo clic.
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
              Cargando editor de marca...
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
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* PRESETS DE ARMONÍA */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "18px",
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    color: "#000000",
                    marginBottom: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Sparkles size={16} color="#10B981" />
                  <span>Paletas Recomendadas de Marca</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "0.65rem",
                  }}
                >
                  {BRAND_PRESETS.map((preset) => {
                    const isSelected = brand.preset_name === preset.name;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        style={{
                          background: isSelected ? "#ecfdf5" : "#ffffff",
                          border: isSelected ? "2px solid #10B981" : "1px solid #e5e7eb",
                          borderRadius: "10px",
                          padding: "0.6rem 0.5rem",
                          cursor: "pointer",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.35rem",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          <span
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: preset.primary,
                            }}
                          />
                          <span
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: preset.accent,
                            }}
                          />
                          <span
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: preset.background,
                              border: "1px solid #d1d5db",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#000000" }}>
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PICKERS MANUALES DE COLOR */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <ColorField
                  label="Color Primario"
                  description="Botones principales, acentos destacados y bordes activos"
                  value={brand.primary_color}
                  onChange={(val) =>
                    setBrand((prev) => ({ ...prev, primary_color: val, preset_name: "Personalizado" }))
                  }
                />

                <ColorField
                  label="Color de Acento"
                  description="Subtítulos, contrastes secundarios y porciones alternas"
                  value={brand.accent_color}
                  onChange={(val) =>
                    setBrand((prev) => ({ ...prev, accent_color: val, preset_name: "Personalizado" }))
                  }
                />

                <ColorField
                  label="Fondo de Widgets"
                  description="Fondo de tarjetas, modales y cajas de opiniones"
                  value={brand.background_color}
                  onChange={(val) =>
                    setBrand((prev) => ({ ...prev, background_color: val, preset_name: "Personalizado" }))
                  }
                />

                <ColorField
                  label="Color de Texto"
                  description="Títulos principales y textos de lectura"
                  value={brand.text_color}
                  onChange={(val) =>
                    setBrand((prev) => ({ ...prev, text_color: val, preset_name: "Personalizado" }))
                  }
                />
              </div>

              {/* SELECTOR DE BORDES */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "1rem",
                }}
              >
                <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#000000", marginBottom: "0.5rem" }}>
                  Estilo de Bordes y Esquinas
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                  {[
                    { id: "recto" as const, label: "Recto (0px)" },
                    { id: "suave" as const, label: "Suave (12px)" },
                    { id: "redondo" as const, label: "Redondo (20px)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBrand((prev) => ({ ...prev, border_radius: opt.id }))}
                      style={{
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: brand.border_radius === opt.id ? "2px solid #10B981" : "1px solid #e5e7eb",
                        background: brand.border_radius === opt.id ? "#ecfdf5" : "#ffffff",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: brand.border_radius === opt.id ? "#059669" : "#374151",
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleSyncAll}
                  disabled={syncing || saving}
                  style={{
                    width: "100%",
                    padding: "0.95rem",
                    borderRadius: "12px",
                    border: "none",
                    background: "#10B981",
                    color: "#ffffff",
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    cursor: syncing || saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {syncing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sincronizando en toda tu tienda...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Sincronizar Estilo en Todos mis Widgets (1 Clic)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveOnly}
                  disabled={syncing || saving}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: syncing || saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Save size={16} />
                  Guardar como Paleta Oficial
                </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: SIMULADOR VISUAL */}
            <div style={{ position: "sticky", top: "2rem" }}>
              <BrandSimulatorPreview brand={brand} />
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
