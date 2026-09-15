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
  ShoppingBag,
  RefreshCw,
  Eye,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface CrossSellConfig {
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

/* ═══════════════════════════════════════════
   DEFAULTS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: CrossSellConfig = {
  is_active: true,
  discount_percentage: 15,
  title: "SACO GRIS",
  subtitle: "PROMO",
  button_text: "VER MÁS",
  auto_pilot: true,
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: SIMULADOR DE EXTRAS CON INTERRUPTOR IA
═══════════════════════════════════════════ */
function ExtrasIaSimulatorPreview({
  config,
  samplePairing,
}: {
  config: CrossSellConfig;
  samplePairing: SmartPairing | null;
}) {
  const [toggleOn, setToggleOn] = useState(true);

  // Tomar el producto recomendado de la IA
  const recName = samplePairing?.recommendedProductName || "Saco Gris Premium";
  const recPrice = samplePairing?.recommendedProductPrice || 45000;
  const recImg = samplePairing?.recommendedProductImage || "";

  // Calcular precio con descuento dinámico configurado
  const discountedPrice = Math.round(recPrice * ((100 - config.discount_percentage) / 100));

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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Eye size={14} color="#10B981" />
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#059669", textTransform: "uppercase" }}>
            Vista Previa de Extras con Interruptor
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
          RECOMENDACIÓN DE LA IA
        </span>
      </div>

      {/* Tarjeta Extras con Interruptor Adaptado */}
      <div
        style={{
          background: "#fffdf5",
          border: "1.5px solid #fcd34d",
          borderRadius: "16px",
          padding: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
        }}
      >
        {/* Columna Izquierda: Imagen + Ver Más */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "8px",
              overflow: "hidden",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {recImg ? (
              <img
                src={recImg}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "20px" }}>👔</span>
            )}
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#000000",
              textDecoration: "underline",
              letterSpacing: "0.03em",
            }}
          >
            {config.button_text || "VER MÁS"}
          </span>
        </div>

        {/* Columna Central: Título + Precio + Badge PROMO */}
        <div style={{ flex: 1, minWidth: 0, paddingLeft: "4px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "#1f2937",
              lineHeight: 1.2,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {recName}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              ${discountedPrice.toLocaleString("es-AR")}
            </span>
            <span
              style={{
                fontSize: "11px",
                textDecoration: "line-through",
                color: "#9ca3af",
                fontWeight: 600,
              }}
            >
              ${recPrice.toLocaleString("es-AR")}
            </span>

            <span
              style={{
                background: "#dc2626",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: 900,
                padding: "2px 6px",
                borderRadius: "4px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {config.subtitle} {config.discount_percentage}% OFF
            </span>
          </div>
        </div>

        {/* Columna Derecha: Interruptor Switch */}
        <button
          type="button"
          onClick={() => setToggleOn(!toggleOn)}
          aria-label="Toggle extra"
          style={{
            width: "54px",
            height: "30px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: toggleOn ? "#10B981" : "#e5e7eb",
            position: "relative",
            flexShrink: 0,
            transition: "background 0.2s ease",
            padding: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: toggleOn ? 27 : 3,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              transition: "left 0.2s ease",
            }}
          />
        </button>
      </div>

      <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#6b7280", textAlign: "center", lineHeight: 1.4 }}>
        💡 Al prender el interruptor, la sugerencia de la IA se agregará de inmediato al carrito de compras del cliente.
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
  const [config, setConfig] = useState<CrossSellConfig>(DEFAULT_CONFIG);
  const [pairings, setPairings] = useState<SmartPairing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshingCat, setRefreshingCat] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
      console.error("Error cargando Cross-Sell IA:", err);
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
        message: "¡Configuración de Recomendaciones IA guardada con éxito!",
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
            <Cpu size={13} color="#10B981" />
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
            Recomendaciones IA (Extras Automáticos)
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Emparejá automáticamente cada producto con su accesorio o complemento ideal. Aumentá tu ticket promedio sugiriendo extras con descuento directamente en la ficha del producto.
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
              Generando sugerencias predictivas de extras...
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
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>
                      Auto-Piloto IA Activo
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                      La IA empareja todo el catálogo sin configuración manual
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
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", marginBottom: "0.3rem" }}>
                    Descuento del Extra sugerido
                  </div>
                  <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "#6b7280" }}>
                    Incentivo que se aplica automáticamente al prender el interruptor:
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
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                      Etiqueta del Badge (ej: PROMO / IA SUGIERE)
                    </label>
                    <input
                      type="text"
                      value={config.subtitle}
                      onChange={(e) => setConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
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
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                      Texto del enlace &quot;Ver más&quot;
                    </label>
                    <input
                      type="text"
                      value={config.button_text}
                      onChange={(e) => setConfig((prev) => ({ ...prev, button_text: e.target.value }))}
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

              {/* COLUMNA DERECHA: SIMULADOR EN VIVO */}
              <div style={{ position: "sticky", top: "2rem" }}>
                <ExtrasIaSimulatorPreview
                  config={config}
                  samplePairing={pairings.length > 0 ? pairings[0] : null}
                />
              </div>
            </div>

            {/* SECCIÓN DE EMPAREJAMIENTOS GENERADOS EN VIVO */}
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
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem", fontWeight: 800 }}>
                    Sugerencias Predictivas de Extras en Vivo ({pairings.length})
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b7280" }}>
                    La IA analizó tu catálogo y determinó estas parejas óptimas para ofrecer como Extras con Interruptor:
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
                    gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {pairings.map((p, idx) => {
                    const dynamicDiscountPrice = Math.round(p.recommendedProductPrice * ((100 - config.discount_percentage) / 100));

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
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span
                            style={{
                              background: "#ecfdf5",
                              color: "#059669",
                              border: "1px solid #a7f3d0",
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              padding: "2px 7px",
                              borderRadius: "999px",
                            }}
                          >
                            Afinidad: {p.matchScore}%
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 600 }}>
                            {p.matchReason}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.7rem", color: "#6b7280", display: "block" }}>En Producto Principal:</span>
                            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {p.mainProductName}
                            </div>
                          </div>

                          <span style={{ fontSize: "0.85rem", color: "#10B981", fontWeight: 900 }}>👉</span>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.7rem", color: "#059669", display: "block", fontWeight: 700 }}>Se sugiere Extra:</span>
                            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {p.recommendedProductName}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            borderTop: "1px dashed #e5e7eb",
                            paddingTop: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                          }}
                        >
                          <span style={{ color: "#6b7280" }}>Precio sugerido con {config.discount_percentage}% OFF:</span>
                          <strong style={{ color: "#10B981", fontSize: "0.85rem" }}>${dynamicDiscountPrice.toLocaleString("es-AR")}</strong>
                        </div>
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
