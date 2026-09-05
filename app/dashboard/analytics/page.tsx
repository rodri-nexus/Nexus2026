"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  Ticket,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface RealStatsResponse {
  hasData: boolean;
  totalEvents: number;
  totalExtraRevenue: number;
  subscriptionCost: number;
  roiMultiplier: number;
  metrics: {
    bundlesRevenue: number;
    ruletaLeads: number;
    tallesClicks: number;
    cuponesCopied: number;
  };
  widgetBreakdown?: Record<
    string,
    { views: number; clicks: number; conversions: number; revenue: number }
  >;
}

/* ═══════════════════════════════════════════
   ESTILOS AUXILIARES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const pageContainerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#ffffff",
  color: "#000000",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const mainContentStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "2rem 1.25rem 4rem",
  boxSizing: "border-box",
};

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function AnalyticsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [realStats, setRealStats] = useState<RealStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar usuario y consultar estadísticas
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics/stats");
      if (res.ok) {
        const data = await res.json();
        setRealStats(data);
      }
    } catch (err) {
      console.error("Error consultando stats:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function init() {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          setUserEmail(user.email || "");
          await fetchStats();
        }
      } catch (err) {
        console.error("Error inicializando analytics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  // Datos 100% reales sin invenciones
  const stats = useMemo(() => {
    if (realStats && realStats.hasData) {
      return {
        isRealData: true,
        totalExtraRevenue: realStats.totalExtraRevenue,
        bundlesRevenue: realStats.metrics.bundlesRevenue,
        ruletaLeads: realStats.metrics.ruletaLeads,
        tallesClicks: realStats.metrics.tallesClicks,
        cuponesCopied: realStats.metrics.cuponesCopied,
        roiMultiplier: realStats.roiMultiplier,
        totalEvents: realStats.totalEvents,
        breakdown: realStats.widgetBreakdown || {},
      };
    }

    return {
      isRealData: false,
      totalExtraRevenue: 0,
      bundlesRevenue: 0,
      ruletaLeads: 0,
      tallesClicks: 0,
      cuponesCopied: 0,
      roiMultiplier: 1.0,
      totalEvents: 0,
      breakdown: {},
    };
  }, [realStats]);

  return (
    <div style={pageContainerStyle}>
      <DashboardHeader email={userEmail} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main style={mainContentStyle}>
        {/* NAVEGACIÓN SUPERIOR / BREADCRUMB */}
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

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.45rem 0.95rem",
              borderRadius: "8px",
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#000000",
              cursor: refreshing || loading ? "not-allowed" : "pointer",
            }}
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
              color="#10B981"
            />
            {refreshing ? "Actualizando..." : "Actualizar datos"}
          </button>
        </div>

        {/* ENCABEZADO DE LA SECCIÓN */}
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
            Telemetría en Tiempo Real
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
            Nevux Live Analytics & ROI Tracker
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Medí con precisión matemática el retorno de inversión y la facturación extra generada por tus widgets en los últimos 30 días.
          </p>
        </motion.div>

        {/* ESTADO DE CARGA */}
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
              Cargando estadísticas en vivo...
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* CARD PRINCIPAL: ROI TRACKER */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "linear-gradient(135deg, #111827 0%, #064e3b 100%)",
                border: "1.5px solid #10B981",
                borderRadius: "22px",
                padding: "2rem",
                color: "#ffffff",
                boxShadow: "0 12px 36px rgba(16, 185, 129, 0.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "1.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid #10B981",
                      color: "#10B981",
                      padding: "8px",
                      borderRadius: "10px",
                    }}
                  >
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                      Retorno de Inversión (ROI)
                    </h2>
                    <span style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: 700 }}>
                      {stats.isRealData
                        ? `● Telemetría activa: ${stats.totalEvents} interacciones registradas`
                        : "● Esperando primeras interacciones en tu tienda"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid #10B981",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#10B981",
                  }}
                >
                  Últimos 30 días
                </div>
              </div>

              {/* 3 TARJETAS PRINCIPALES */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.5rem",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Facturación Extra Generada
                  </div>
                  <div
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 900,
                      color: "#10B981",
                      lineHeight: 1.1,
                      marginBottom: "6px",
                    }}
                  >
                    ${stats.totalExtraRevenue.toLocaleString("es-AR")}
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#a7f3d0", fontWeight: 600 }}>
                    Atribución por conversión de widgets
                  </span>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.5rem",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Inversión Mensual Nevux
                  </div>
                  <div
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      marginBottom: "6px",
                    }}
                  >
                    $30.000
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#9ca3af", fontWeight: 600 }}>
                    Tarifa plana sin comisiones por venta
                  </span>
                </div>

                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1.5px solid #10B981",
                    padding: "1.5rem",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#a7f3d0",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Multiplicador de Retorno
                  </div>
                  <div
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 900,
                      color: "#10B981",
                      lineHeight: 1.1,
                      marginBottom: "6px",
                    }}
                  >
                    {stats.roiMultiplier.toFixed(1)}x
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#a7f3d0", fontWeight: 700 }}>
                    Retorno directo sobre tu inversión
                  </span>
                </div>
              </div>

              {/* AVISO ESTADO VACÍO SANEADO */}
              {!stats.isRealData && (
                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1rem 1.25rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1.5px dashed rgba(16, 185, 129, 0.35)",
                    borderRadius: "14px",
                    fontSize: "0.85rem",
                    color: "#a7f3d0",
                    lineHeight: 1.5,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>
                    <b>Esperando interacciones:</b> Todavía no se registraron clics ni conversiones en tus widgets activos.
                    Apenas tus clientes comiencen a ver productos, girar la ruleta, seleccionar talles o aplicar cupones, verás los montos reflejados acá en tiempo real.
                  </span>
                </div>
              )}
            </motion.div>

            {/* DESGLOSE POR TIPO DE ACCIÓN */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.75rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1.25rem 0",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#000000",
                }}
              >
                Atribución Desglosada por Herramienta
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "1.25rem",
                    borderRadius: "14px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.35rem" }}>📦</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280" }}>
                    Bundles y Promociones
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#000000", marginTop: "4px" }}>
                    ${stats.bundlesRevenue.toLocaleString("es-AR")}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>
                    Facturación por combos agregados
                  </span>
                </div>

                <div
                  style={{
                    padding: "1.25rem",
                    borderRadius: "14px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.35rem" }}>🎡</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280" }}>
                    Ruleta de Descuentos
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#000000", marginTop: "4px" }}>
                    {stats.ruletaLeads} leads
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>
                    Emails capturados para recompras
                  </span>
                </div>

                <div
                  style={{
                    padding: "1.25rem",
                    borderRadius: "14px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.35rem" }}>📏</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280" }}>
                    Tabla de Talles Interactiva
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#000000", marginTop: "4px" }}>
                    {stats.tallesClicks} elecciones
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>
                    Talles seleccionados con guardado
                  </span>
                </div>

                <div
                  style={{
                    padding: "1.25rem",
                    borderRadius: "14px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.35rem" }}>🎟️</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280" }}>
                    Badges de Cupones
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#000000", marginTop: "4px" }}>
                    {stats.cuponesCopied} copias
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>
                    Cupones aplicados al checkout
                  </span>
                </div>
              </div>
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
