"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  BarChart3,
  ChevronDown,
  Activity,
  Loader2,
} from "lucide-react";

type Period = "hoy" | "ayer" | "7dias" | "personalizado";
type SortMetric = "impresiones" | "clicks" | "agregados" | "facturacion";
type SortOrder = "desc" | "asc";

interface MetricSummary {
  impressions: number;
  clicks: number;
  cartAdds: number;
  revenue: number;
}

interface WidgetPerformanceItem {
  id: string;
  name: string;
  type: string;
  impressions: number;
  clicks: number;
  cartAdds: number;
  revenue: number;
}

export default function MetricsCard() {
  const [period, setPeriod] = useState<Period>("7dias");
  const [loading, setLoading] = useState(true);
  const [sortMetric, setSortMetric] = useState<SortMetric>("impresiones");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [summary, setSummary] = useState<MetricSummary>({
    impressions: 0,
    clicks: 0,
    cartAdds: 0,
    revenue: 0,
  });

  const [widgetList, setWidgetList] = useState<WidgetPerformanceItem[]>([]);

  // Fetch de métricas reales desde la API
  const fetchMetrics = useCallback(async (selectedPeriod: Period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/metrics?period=${selectedPeriod}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setSummary({
          impressions: data.summary?.impressions || 0,
          clicks: data.summary?.clicks || 0,
          cartAdds: data.summary?.cartAdds || 0,
          revenue: data.summary?.revenue || 0,
        });
        setWidgetList(data.widgets || []);
      } else {
        // Fallback a ceros limpios si no hay conexión
        setSummary({ impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 });
        setWidgetList([]);
      }
    } catch (error) {
      setSummary({ impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 });
      setWidgetList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(period);
  }, [period, fetchMetrics]);

  // Ordenamiento local de widgets
  const sortedWidgets = [...widgetList].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    switch (sortMetric) {
      case "impresiones":
        valA = a.impressions;
        valB = b.impressions;
        break;
      case "clicks":
        valA = a.clicks;
        valB = b.clicks;
        break;
      case "agregados":
        valA = a.cartAdds;
        valB = b.cartAdds;
        break;
      case "facturacion":
        valA = a.revenue;
        valB = b.revenue;
        break;
    }

    return sortOrder === "desc" ? valB - valA : valA - valB;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toLocaleString("es-AR");
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return "$ -";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const metrics = [
    {
      label: "Impresiones",
      value: formatNumber(summary.impressions),
      sublabel: "Vistas de widgets",
      icon: Eye,
      gradient: "#10B981",
    },
    {
      label: "Clicks",
      value: formatNumber(summary.clicks),
      sublabel: "Interacciones",
      icon: MousePointerClick,
      gradient: "#10B981",
    },
    {
      label: "Agregados al carrito",
      value: formatNumber(summary.cartAdds),
      sublabel: "Desde widgets",
      icon: ShoppingCart,
      gradient: "#10B981",
    },
    {
      label: "Facturación estimada",
      value: formatCurrency(summary.revenue),
      sublabel: "Desde widgets",
      icon: DollarSign,
      gradient: "#10B981",
    },
  ];

  const periods: { key: Period; label: string }[] = [
    { key: "hoy", label: "Hoy" },
    { key: "ayer", label: "Ayer" },
    { key: "7dias", label: "7 días" },
    { key: "personalizado", label: "Personalizado" },
  ];

  return (
    <motion.section
      data-tutorial="metrics-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        boxSizing: "border-box",
      }}
    >
      {/* Badge Estado En Vivo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.25rem 0.65rem",
            borderRadius: "999px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#059669",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 8px #10B981",
            }}
          />
          Métricas en tiempo real
        </div>
        {loading && <Loader2 size={14} color="#10B981" className="animate-spin" />}
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "1.35rem",
          fontWeight: 800,
          color: "#000000",
          letterSpacing: "-0.01em",
        }}
      >
        Métricas de widgets
      </h2>
      <p
        style={{
          margin: "0.25rem 0 1.25rem",
          fontSize: "0.9rem",
          color: "#000000",
          opacity: 0.6,
        }}
      >
        {period === "hoy" && "Hoy"}
        {period === "ayer" && "Ayer"}
        {period === "7dias" && "Últimos 7 días"}
        {period === "personalizado" && "Rango personalizado"}
      </p>

      {/* Botones de periodo */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {periods.map((p) => {
          const isActive = period === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: isActive
                  ? "1px solid transparent"
                  : "1px solid #e5e7eb",
                background: isActive ? "#10B981" : "#ffffff",
                color: isActive ? "#ffffff" : "#000000",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Grid de métricas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              style={{
                background: "#ffffff",
                border: "1px solid #f3f4f6",
                borderRadius: "12px",
                padding: "1.15rem",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: metric.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.85rem",
                  boxShadow: "0 4px 10px rgba(16, 185, 129, 0.25)",
                }}
              >
                <Icon size={18} color="#ffffff" />
              </div>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#000000",
                  opacity: 0.6,
                  fontWeight: 500,
                  marginBottom: "0.35rem",
                }}
              >
                {metric.label}
              </div>

              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#000000",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {metric.value}
              </div>

              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#000000",
                  opacity: 0.5,
                  fontWeight: 500,
                }}
              >
                {metric.sublabel}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Evolución del período */}
      <div
        style={{
          borderTop: "1px solid #f3f4f6",
          paddingTop: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 800,
            color: "#000000",
          }}
        >
          Evolución del período
        </h3>
        <p
          style={{
            margin: "0.25rem 0 1.25rem",
            fontSize: "0.85rem",
            color: "#000000",
            opacity: 0.6,
          }}
        >
          Agrupado por día
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 1rem",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px dashed #e5e7eb",
          }}
        >
          <BarChart3 size={40} color="#000000" style={{ opacity: 0.2 }} strokeWidth={1.5} />
          <p
            style={{
              margin: "0.75rem 0 0",
              fontSize: "0.9rem",
              color: "#000000",
              opacity: 0.5,
              textAlign: "center",
            }}
          >
            {summary.impressions > 0
              ? "Generando gráfico con actividad reciente..."
              : "Todavía no hay métricas para este período."}
          </p>
        </div>
      </div>

      {/* Rendimiento por widget */}
      <div
        style={{
          borderTop: "1px solid #f3f4f6",
          paddingTop: "1.5rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 800,
            color: "#000000",
          }}
        >
          Rendimiento por widget
        </h3>
        <p
          style={{
            margin: "0.25rem 0 1rem",
            fontSize: "0.85rem",
            color: "#000000",
            opacity: 0.6,
          }}
        >
          Ordená para ver cuáles funcionan mejor en el período.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 160px" }}>
            <select
              value={sortMetric}
              onChange={(e) => setSortMetric(e.target.value as SortMetric)}
              style={{
                width: "100%",
                appearance: "none",
                WebkitAppearance: "none",
                padding: "0.6rem 2.25rem 0.6rem 0.9rem",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                fontSize: "0.85rem",
                color: "#000000",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <option value="impresiones">Impresiones</option>
              <option value="clicks">Clicks</option>
              <option value="agregados">Agregados al carrito</option>
              <option value="facturacion">Facturación</option>
            </select>
            <ChevronDown
              size={16}
              color="#000000"
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                opacity: 0.6,
              }}
            />
          </div>

          <div style={{ position: "relative", flex: "1 1 160px" }}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              style={{
                width: "100%",
                appearance: "none",
                WebkitAppearance: "none",
                padding: "0.6rem 2.25rem 0.6rem 0.9rem",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                fontSize: "0.85rem",
                color: "#000000",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <option value="desc">Mayor a menor</option>
              <option value="asc">Menor a mayor</option>
            </select>
            <ChevronDown
              size={16}
              color="#000000"
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                opacity: 0.6,
              }}
            />
          </div>
        </div>

        {sortedWidgets.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {sortedWidgets.map((w) => (
              <div
                key={w.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#000000" }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#000000", opacity: 0.5 }}>
                    {w.type}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#10B981" }}>
                    {sortMetric === "impresiones" && `${formatNumber(w.impressions)} vistas`}
                    {sortMetric === "clicks" && `${formatNumber(w.clicks)} clicks`}
                    {sortMetric === "agregados" && `${formatNumber(w.cartAdds)} carritos`}
                    {sortMetric === "facturacion" && formatCurrency(w.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 1rem",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px dashed #e5e7eb",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#000000",
                opacity: 0.5,
                textAlign: "center",
              }}
            >
              Todavía no hay widgets con métricas para este período.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
    }
