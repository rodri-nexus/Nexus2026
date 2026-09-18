"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Cpu,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Eye,
  Sparkles,
  Package,
  Zap,
  TrendingUp,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface BundleAiConfig {
  is_active: boolean;
  discount_percentage: number;
  title: string;
  subtitle: string;
  button_text: string;
  auto_pilot: boolean;
}

interface SmartPairing {
  mainProductId: number;
  mainProductName: string;
  mainProductPrice: number;
  mainProductImage: string;
  recommendedProductId: number;
  recommendedProductName: string;
  recommendedProductPrice: number;
  recommendedProductImage: string;
  comboOriginalPrice: number;
  comboDiscountPrice: number;
  savingsAmount: number;
  matchScore: number;
  matchReason: string;
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
const DEFAULT_CONFIG: BundleAiConfig = {
  is_active: true,
  discount_percentage: 15,
  title: "COMBO PERFECTO",
  subtitle: "COMBO IA",
  button_text: "LO QUIERO",
  auto_pilot: true,
};

/* ═══════════════════════════════════════════
   HELPERS (Regla #9 al inicio)
═══════════════════════════════════════════ */
function formatPrice(value: number): string {
  return value.toLocaleString("es-AR");
}

function calcComboPrices(priceA: number, priceB: number, discountPct: number) {
  const original = priceA + priceB;
  const combo = Math.round(original * ((100 - discountPct) / 100));
  const savings = original - combo;
  return { original, combo, savings };
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: PREVIEW BUNDLE PROMOCIONES IA
═══════════════════════════════════════════ */
function BundleAiPreview({
  config,
  samplePairing,
}: {
  config: BundleAiConfig;
  samplePairing: SmartPairing | null;
}) {
  const nameA = samplePairing?.mainProductName || "Producto Principal";
  const priceA = samplePairing?.mainProductPrice || 30000;
  const imgA = samplePairing?.mainProductImage || "";

  const nameB = samplePairing?.recommendedProductName || "Producto Sugerido IA";
  const priceB = samplePairing?.recommendedProductPrice || 20000;
  const imgB = samplePairing?.recommendedProductImage || "";

  const { original, combo, savings } = calcComboPrices(priceA, priceB, config.discount_percentage);

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
            Vista Previa Bundle IA
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
          RECOMENDACIÓN IA
        </span>
      </div>

      {/* Card Bundle Promociones simulada */}
      <div
        style={{
          background: "#f9fafb",
          border: "2px solid #10B981",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 4px 14px rgba(16, 185, 129, 0.12)",
        }}
      >
        {/* Título del bundle */}
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#10B981",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: 900,
              padding: "3px 10px",
              borderRadius: "999px",
              letterSpacing: "0.04em",
              marginBottom: "6px",
            }}
          >
            {config.subtitle || "COMBO IA"}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 900,
              color: "#111827",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}
          >
            {config.title || "COMBO PERFECTO"}
          </div>
        </div>

        {/* Productos */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          {/* Producto A */}
          <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "10px",
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "6px",
              }}
            >
              {imgA ? (
                <img
                  src={imgA}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "26px" }}>📦</span>
              )}
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#374151",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {nameA}
            </div>
          </div>

          {/* Símbolo + */}
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: "#10B981",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            +
          </div>

          {/* Producto B */}
          <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "10px",
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "6px",
              }}
            >
              {imgB ? (
                <img
                  src={imgB}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "26px" }}>🎁</span>
              )}
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#374151",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {nameB}
            </div>
          </div>
        </div>

        {/* Precio combo */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
            marginBottom: "10px",
            border: "1px dashed #d1fae5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "11px",
                textDecoration: "line-through",
                color: "#9ca3af",
                fontWeight: 600,
              }}
            >
              ${formatPrice(original)}
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#10B981",
                letterSpacing: "-0.02em",
              }}
            >
              ${formatPrice(combo)}
            </span>
            <span
              style={{
                background: "#dc2626",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: 900,
                padding: "2px 6px",
                borderRadius: "4px",
                letterSpacing: "0.04em",
              }}
            >
              -{config.discount_percentage}%
            </span>
          </div>
          <div style={{ fontSize: "10px", color: "#059669", fontWeight: 700, marginTop: "4px" }}>
            💚 Ahorrás ${formatPrice(savings)}
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#10B981",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: "13px",
            letterSpacing: "0.04em",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
          }}
        >
          {config.button_text || "LO QUIERO"}
        </button>
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
        💡 Así se verán los combos IA cuando los crees como widget <strong>Bundle Promociones</strong> en la ficha de cada producto.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function SugerenciasIaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [config, setConfig] = useState<BundleAiConfig>(DEFAULT_CONFIG);
  const [pairings, setPairings] = useState<SmartPairing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshingCat, setRefreshingCat] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const loadData = async (storeId: number) => {
    try {
      const res = await fetch(`/api/ai/cross-sell?store_id=${storeId}&include_pairings=true`);
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setConfig({
            is_active: data.settings.is_active ?? true,
            discount_percentage: Number(data.settings.discount_percentage) || 15,
            title: data.settings.title || DEFAULT_CONFIG.title,
            subtitle: data.settings.subtitle || DEFAULT_CONFIG.subtitle,
            button_text: data.settings.button_text || DEFAULT_CONFIG.button_text,
            auto_pilot: data.settings.auto_pilot ?? true,
          });
        }
        if (data.pairings) {
          setPairings(data.pairings);
        }
      }
    } catch (err) {
      console.error("Error cargando Bundles IA:", err);
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
        console.error("Error inicializando:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefreshPairings = async () => {
    if (!store) return;
    setRefreshingCat(true);
    await loadData(store.store_id);
    setRefreshingCat(false);
  };

  const handleSaveConfig = async () => {
    if (!store) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai/cross-sell", {
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
        message: "¡Motor de Bundles IA guardado con éxito!",
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
            <Sparkles size={13} color="#10B981" />
            Motor Predictivo IA
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
            Generador IA de Bundles Inteligentes
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            La IA analiza todo tu catálogo, detecta combinaciones ganadoras y las prepara listas para que las crees como widget <strong>Bundle Promociones</strong>. Aumentá tu ticket promedio con combos perfectos y descuentos calculados automáticamente.
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
              Analizando catálogo y generando combos predictivos...
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
              {/* COLUMNA IZQUIERDA: CONFIGURADOR */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* SWITCH AUTO-PILOTO */}
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
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>
                      Motor de Bundles IA Activo
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                      La IA empareja todo el catálogo automáticamente
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

                {/* SELECTOR DE % DESCUENTO */}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Descuento sugerido del Combo
                  </div>
                  <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "#6b7280" }}>
                    Incentivo aplicado al precio total del bundle:
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                    {[10, 15, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, discount_percentage: pct }))}
                        style={{
                          padding: "0.65rem 0.5rem",
                          borderRadius: "10px",
                          border: config.discount_percentage === pct ? "2px solid #10B981" : "1px solid #e5e7eb",
                          background: config.discount_percentage === pct ? "#ecfdf5" : "#ffffff",
                          color: config.discount_percentage === pct ? "#059669" : "#374151",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                        }}
                      >
                        {pct}% OFF
                      </button>
                    ))}
                  </div>
                </div>

                {/* CAMPOS DE TEXTO */}
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        marginBottom: "0.3rem",
                        color: "#111827",
                      }}
                    >
                      Título persuasivo del Bundle
                    </label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Ej: COMBO PERFECTO"
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        marginBottom: "0.3rem",
                        color: "#111827",
                      }}
                    >
                      Etiqueta del Badge (ej: COMBO IA / PROMO)
                    </label>
                    <input
                      type="text"
                      value={config.subtitle}
                      onChange={(e) => setConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Ej: COMBO IA"
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        marginBottom: "0.3rem",
                        color: "#111827",
                      }}
                    >
                      Texto del botón CTA
                    </label>
                    <input
                      type="text"
                      value={config.button_text}
                      onChange={(e) => setConfig((prev) => ({ ...prev, button_text: e.target.value }))}
                      placeholder="Ej: LO QUIERO"
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
                      Guardando motor...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Guardar Configuración IA
                    </>
                  )}
                </button>
              </div>

              {/* COLUMNA DERECHA: PREVIEW EN VIVO */}
              <div style={{ position: "sticky", top: "2rem" }}>
                <BundleAiPreview
                  config={config}
                  samplePairing={pairings.length > 0 ? pairings[0] : null}
                />
              </div>
            </div>

            {/* SECCIÓN DE COMBOS GENERADOS EN VIVO */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.75rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <Package size={18} color="#10B981" />
                    Combos IA Listos para Crear ({pairings.length})
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b7280" }}>
                    La IA analizó tu catálogo y detectó estas parejas perfectas. Creá cada combo como widget Bundle Promociones en 1 clic.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshPairings}
                  disabled={refreshingCat}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "8px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#374151",
                    cursor: refreshingCat ? "not-allowed" : "pointer",
                    flexShrink: 0,
                  }}
                >
                  <RefreshCw size={13} className={refreshingCat ? "animate-spin" : ""} />
                  {refreshingCat ? "Re-analizando..." : "Re-analizar catálogo"}
                </button>
              </div>

              {pairings.length === 0 ? (
                <div
                  style={{
                    padding: "2.5rem 1rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "0.88rem",
                  }}
                >
                  No se encontraron productos suficientes para emparejar. Agregá al menos 2 productos en tu tienda.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {pairings.map((p, idx) => {
                    const { original, combo, savings } = calcComboPrices(
                      p.mainProductPrice,
                      p.recommendedProductPrice,
                      config.discount_percentage
                    );

                    return (
                      <div
                        key={idx}
                        style={{
                          background: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRadius: "14px",
                          padding: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {/* Header afinidad */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "0.4rem",
                          }}
                        >
                          <span
                            style={{
                              background: "#ecfdf5",
                              color: "#059669",
                              border: "1px solid #a7f3d0",
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              padding: "2px 7px",
                              borderRadius: "999px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <TrendingUp size={10} />
                            Afinidad: {p.matchScore}%
                          </span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "#6b7280",
                              fontWeight: 600,
                              textAlign: "right",
                              minWidth: 0,
                            }}
                          >
                            {p.matchReason}
                          </span>
                        </div>

                        {/* Productos */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {/* Producto A */}
                          <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                            <div
                              style={{
                                width: "100%",
                                aspectRatio: "1 / 1",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                marginBottom: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {p.mainProductImage ? (
                                <img
                                  src={p.mainProductImage}
                                  alt=""
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <span style={{ fontSize: "20px" }}>📦</span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: "#111827",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.mainProductName}
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: "1.2rem",
                              color: "#10B981",
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            +
                          </span>

                          {/* Producto B */}
                          <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                            <div
                              style={{
                                width: "100%",
                                aspectRatio: "1 / 1",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                marginBottom: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {p.recommendedProductImage ? (
                                <img
                                  src={p.recommendedProductImage}
                                  alt=""
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <span style={{ fontSize: "20px" }}>🎁</span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: "#111827",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.recommendedProductName}
                            </div>
                          </div>
                        </div>

                        {/* Precio combo */}
                        <div
                          style={{
                            borderTop: "1px dashed #e5e7eb",
                            paddingTop: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                            flexWrap: "wrap",
                            gap: "0.3rem",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                              style={{
                                textDecoration: "line-through",
                                color: "#9ca3af",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                              }}
                            >
                              ${formatPrice(original)}
                            </span>
                            <strong style={{ color: "#10B981", fontSize: "0.95rem" }}>
                              ${formatPrice(combo)}
                            </strong>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span
                              style={{
                                background: "#dc2626",
                                color: "#ffffff",
                                fontSize: "0.68rem",
                                fontWeight: 900,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                display: "inline-block",
                              }}
                            >
                              -{config.discount_percentage}%
                            </span>
                            <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700, marginTop: "2px" }}>
                              Ahorro ${formatPrice(savings)}
                            </div>
                          </div>
                        </div>

                        {/* CTA Crear Bundle */}
                        <Link
                          href="/widgets/nuevo/producto"
                          style={{
                            width: "100%",
                            padding: "0.65rem",
                            borderRadius: "10px",
                            background: "#10B981",
                            color: "#ffffff",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            textAlign: "center",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.35rem",
                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                          }}
                        >
                          <Zap size={13} />
                          Crear Bundle con este combo
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
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
