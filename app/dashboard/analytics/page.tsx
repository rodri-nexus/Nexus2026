// app/dashboard/analytics/page.tsx
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
  ShoppingBag,
  Clock,
  CheckCircle2,
  Tag,
  User,
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
interface OrderItem {
  id: string;
  order_id: string;
  total: number;
  created_at: string;
  status: string;
  customer_name: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  attributed_widget: string | null;
}

interface RealStatsResponse {
  hasData: boolean;
  totalStoreRevenue: number;
  totalOrdersCount: number;
  averageTicket: number;
  totalEvents: number;
  totalExtraRevenue: number;
  subscriptionCost: number;
  roiMultiplier: number;
  ordersList: OrderItem[];
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
   HELPERS DE FORMATO (Regla #9 al inicio)
═══════════════════════════════════════════ */
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatMoney(amount: number) {
  return "$" + Math.round(amount).toLocaleString("es-AR");
}

function formatWidgetName(slug: string | null) {
  if (!slug) return "Venta Directa / Orgánica";
  return (
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  );
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
  const [userEmail, setUserEmail] = useState("");
  const [realStats, setRealStats] = useState<RealStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Consultar estadísticas completas
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

  const stats = useMemo(() => {
    if (realStats) {
      return {
        hasData: realStats.hasData,
        totalStoreRevenue: realStats.totalStoreRevenue || 0,
        totalOrdersCount: realStats.totalOrdersCount || 0,
        averageTicket: realStats.averageTicket || 0,
        totalExtraRevenue: realStats.totalExtraRevenue || 0,
        roiMultiplier: realStats.roiMultiplier || 1.0,
        totalEvents: realStats.totalEvents || 0,
        ordersList: realStats.ordersList || [],
        bundlesRevenue: realStats.metrics?.bundlesRevenue || 0,
        ruletaLeads: realStats.metrics?.ruletaLeads || 0,
        tallesClicks: realStats.metrics?.tallesClicks || 0,
        cuponesCopied: realStats.metrics?.cuponesCopied || 0,
      };
    }

    return {
      hasData: false,
      totalStoreRevenue: 0,
      totalOrdersCount: 0,
      averageTicket: 0,
      totalExtraRevenue: 0,
      roiMultiplier: 1.0,
      totalEvents: 0,
      ordersList: [],
      bundlesRevenue: 0,
      ruletaLeads: 0,
      tallesClicks: 0,
      cuponesCopied: 0,
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
            {refreshing ? "Actualizando..." : "Sincronizar ahora"}
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
            Métricas Oficiales Tiendanube
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
            Monitoreá en vivo las ventas de tu tienda, la facturación total y el retorno generado por tus widgets en los últimos 30 días.
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
              Conectando con tu Tiendanube en tiempo real...
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* HERO CARDS: METRICAS EN VIVO */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "linear-gradient(135deg, #111827 0%, #064e3b 100%)",
                border: "1.5px solid #10B981",
                borderRadius: "22px",
                padding: "1.75rem",
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
                  marginBottom: "1.5rem",
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
                    <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                      Resumen General de la Tienda
                    </h2>
                    <span style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: 700 }}>
                      ● Sincronizado en vivo con Tiendanube API
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

              {/* 4 CARDS DE KPI */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                {/* Facturación Total */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.25rem",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Facturación Registrada
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#10B981",
                      lineHeight: 1.1,
                      marginBottom: "4px",
                    }}
                  >
                    {formatMoney(stats.totalStoreRevenue)}
                  </div>
                  <span style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
                    Ventas totales de tu tienda
                  </span>
                </div>

                {/* Cantidad de Órdenes */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.25rem",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Órdenes Concretadas
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      marginBottom: "4px",
                    }}
                  >
                    {stats.totalOrdersCount}
                  </div>
                  <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>
                    Ventas pagadas recibidas
                  </span>
                </div>

                {/* Ticket Promedio */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.25rem",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Ticket Promedio
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      marginBottom: "4px",
                    }}
                  >
                    {formatMoney(stats.averageTicket)}
                  </div>
                  <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>
                    Monto promedio por compra
                  </span>
                </div>

                {/* Multiplicador ROI */}
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1.5px solid #10B981",
                    padding: "1.25rem",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#a7f3d0",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Multiplicador ROI Nevux
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#10B981",
                      lineHeight: 1.1,
                      marginBottom: "4px",
                    }}
                  >
                    {stats.roiMultiplier.toFixed(1)}x
                  </div>
                  <span style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 700 }}>
                    Retorno vs costo mensual Nevux
                  </span>
                </div>
              </div>
            </motion.div>

            {/* SECCIÓN 2: FEED DE VENTAS EN VIVO */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                padding: "1.75rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "#000000",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ShoppingBag size={18} color="#10B981" />
                    Feed de Ventas Recientes
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b7280" }}>
                    Historial en tiempo real de cada orden que ingresa a tu tienda.
                  </p>
                </div>

                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "#f3f4f6",
                    color: "#374151",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "999px",
                  }}
                >
                  {stats.ordersList.length} ventas registradas
                </span>
              </div>

              {stats.ordersList.length === 0 ? (
                <div
                  style={{
                    padding: "2.5rem 1rem",
                    textAlign: "center",
                    background: "#f9fafb",
                    border: "1.5px dashed #e5e7eb",
                    borderRadius: "14px",
                  }}
                >
                  <AlertCircle
                    size={28}
                    color="#9ca3af"
                    style={{ margin: "0 auto 0.5rem" }}
                  />
                  <h4
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    Aguardando sincronización de ventas
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.82rem",
                      color: "#6b7280",
                      maxWidth: "420px",
                      marginLeft: "auto",
                      marginRight: "auto",
                      lineHeight: 1.45,
                    }}
                  >
                    Apenas ingresen nuevas compras en tu Tiendanube, vas a ver acá los detalles del cliente, fecha, hora, productos comprados y el widget que impulsó la conversión.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {stats.ordersList.map((ord) => (
                    <div
                      key={ord.order_id || ord.id}
                      style={{
                        padding: "1rem 1.15rem",
                        borderRadius: "14px",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      {/* Cabecera de la orden */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              color: "#111827",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <User size={13} color="#6b7280" />
                            {ord.customer_name}
                          </span>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#9ca3af",
                              fontWeight: 600,
                            }}
                          >
                            (Orden #{ord.order_id})
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#6b7280",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontWeight: 600,
                            }}
                          >
                            <Clock size={12} color="#6b7280" />
                            {formatDate(ord.created_at)}
                          </span>

                          <span
                            style={{
                              fontSize: "1rem",
                              fontWeight: 900,
                              color: "#10B981",
                            }}
                          >
                            {formatMoney(ord.total)}
                          </span>
                        </div>
                      </div>

                      {/* Lista de productos de la orden */}
                      {ord.products && ord.products.length > 0 && (
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "0.6rem 0.85rem",
                            borderRadius: "10px",
                            border: "1px solid #f3f4f6",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                          }}
                        >
                          {ord.products.map((p, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "0.78rem",
                                color: "#374151",
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>
                                {p.quantity}x {p.name}
                              </span>
                              {p.price > 0 && (
                                <span style={{ color: "#6b7280", fontWeight: 500 }}>
                                  {formatMoney(p.price)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Atribución de Widget */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "0.72rem",
                          color: "#059669",
                          fontWeight: 700,
                          paddingTop: "0.2rem",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            background: ord.attributed_widget
                              ? "rgba(16, 185, 129, 0.1)"
                              : "#f3f4f6",
                            color: ord.attributed_widget ? "#059669" : "#6b7280",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "6px",
                          }}
                        >
                          <Tag size={12} />
                          {ord.attributed_widget
                            ? `Impulsado por: ${formatWidgetName(ord.attributed_widget)}`
                            : "Venta Directa / Orgánica"}
                        </span>

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            color: "#10B981",
                          }}
                        >
                          <CheckCircle2 size={12} /> Pago confirmado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECCIÓN 3: ATRIBUCIÓN DESGLOSADA DE HERRAMIENTAS */}
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
                    {formatMoney(stats.bundlesRevenue)}
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
