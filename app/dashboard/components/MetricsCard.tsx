"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

type Period = "hoy" | "ayer" | "7dias" | "30dias";
type SortMetric = "impresiones" | "clicks" | "agregados" | "facturacion";
type SortOrder = "desc" | "asc";
type ChartMetric = "impressions" | "clicks" | "cartAdds" | "revenue";

interface MetricSummary {
  impressions: number;
  clicks: number;
  cartAdds: number;
  revenue: number;
}

interface TimelineItem {
  date: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [sortMetric, setSortMetric] = useState<SortMetric>("impresiones");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("impressions");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Estado para colapsar/desplegar "Rendimiento por widget" (oculto por defecto)
  const [showWidgetPerformance, setShowWidgetPerformance] = useState<boolean>(false);

  const [summary, setSummary] = useState<MetricSummary>({
    impressions: 0,
    clicks: 0,
    cartAdds: 0,
    revenue: 0,
  });

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [widgetList, setWidgetList] = useState<WidgetPerformanceItem[]>([]);

  // Fetch de métricas blindado con AbortController contra condiciones de carrera
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function fetchMetricsData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/metrics?period=${period}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSummary({
              impressions: Number(data.summary?.impressions) || 0,
              clicks: Number(data.summary?.clicks) || 0,
              cartAdds: Number(data.summary?.cartAdds) || 0,
              revenue: Number(data.summary?.revenue) || 0,
            });
            setTimeline(Array.isArray(data.timeline) ? data.timeline : []);
            setWidgetList(Array.isArray(data.widgets) ? data.widgets : []);
          }
        } else {
          if (isMounted) {
            setSummary({ impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 });
            setTimeline([]);
            setWidgetList([]);
          }
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError" && isMounted) {
          setSummary({ impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 });
          setTimeline([]);
          setWidgetList([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMetricsData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [period]);

  // Formateadores seguros
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return (num || 0).toLocaleString("es-AR");
  };

  const formatCurrency = (val: number) => {
    if (!val || val === 0) return "$ 0";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  // Cálculo memoizado para el gráfico
  const maxChartValue = useMemo(() => {
    if (!timeline.length) return 1;
    const values = timeline.map((t) => Number(t[chartMetric]) || 0);
    return Math.max(...values, 1);
  }, [timeline, chartMetric]);

  // Lista de widgets ordenados de forma memoizada
  const sortedWidgets = useMemo(() => {
    return [...widgetList].sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortMetric) {
        case "impresiones":
          valA = a.impressions || 0;
          valB = b.impressions || 0;
          break;
        case "clicks":
          valA = a.clicks || 0;
          valB = b.clicks || 0;
          break;
        case "agregados":
          valA = a.cartAdds || 0;
          valB = b.cartAdds || 0;
          break;
        case "facturacion":
          valA = a.revenue || 0;
          valB = b.revenue || 0;
          break;
      }

      return sortOrder === "desc" ? valB - valA : valA - valB;
    });
  }, [widgetList, sortMetric, sortOrder]);

  const metrics = useMemo(() => [
    {
      key: "impressions" as ChartMetric,
      label: "Impresiones",
      value: formatNumber(summary.impressions),
      sublabel: "Vistas de widgets",
      icon: Eye,
    },
    {
      key: "clicks" as ChartMetric,
      label: "Clicks",
      value: formatNumber(summary.clicks),
      sublabel: "Interacciones",
      icon: MousePointerClick,
    },
    {
      key: "cartAdds" as ChartMetric,
      label: "Agregados al carrito",
      value: formatNumber(summary.cartAdds),
      sublabel: "Desde widgets",
      icon: ShoppingCart,
    },
    {
      key: "revenue" as ChartMetric,
      label: "Facturación estimada",
      value: formatCurrency(summary.revenue),
      sublabel: "Desde widgets",
      icon: DollarSign,
    },
  ], [summary]);

  const periods: { key: Period; label: string }[] = [
    { key: "hoy", label: "Hoy" },
    { key: "ayer", label: "Ayer" },
    { key: "7dias", label: "7 días" },
    { key: "30dias", label: "30 días" },
  ];

  return (
    <motion.section
      data-tutorial="metrics-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
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
        {period === "hoy" && "Actividad de hoy"}
        {period === "ayer" && "Actividad de ayer"}
        {period === "7dias" && "Últimos 7 días"}
        {period === "30dias" && "Últimos 30 días"}
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
              type="button"
              onClick={() => setPeriod(p.key)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: isActive ? "1px solid #10B981" : "1px solid #e5e7eb",
                background: isActive ? "#10B981" : "#ffffff",
                color: isActive ? "#ffffff" : "#000000",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
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
          const isSelectedForChart = chartMetric === metric.key;

          return (
            <motion.div
              key={metric.label}
              onClick={() => setChartMetric(metric.key)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              style={{
                background: isSelectedForChart ? "#ecfdf5" : "#ffffff",
                border: isSelectedForChart ? "1.5px solid #10B981" : "1px solid #f3f4f6",
                borderRadius: "12px",
                padding: "1.15rem",
                position: "relative",
                cursor: "pointer",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
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
                  color: isSelectedForChart ? "#059669" : "#000000",
                  opacity: isSelectedForChart ? 1 : 0.5,
                  fontWeight: isSelectedForChart ? 700 : 500,
                }}
              >
                {isSelectedForChart ? "● Viendo en gráfico" : metric.sublabel}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Evolución del período (Gráfico Diario) */}
      <div
        style={{
          borderTop: "1px solid #f3f4f6",
          paddingTop: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 800,
                color: "#000000",
              }}
            >
              Evolución diaria
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.85rem",
                color: "#000000",
                opacity: 0.6,
              }}
            >
              Mostrando{" "}
              <strong>
                {chartMetric === "impressions" && "Impresiones"}
                {chartMetric === "clicks" && "Clicks"}
                {chartMetric === "cartAdds" && "Agregados al carrito"}
                {chartMetric === "revenue" && "Facturación"}
              </strong>{" "}
              por día
            </p>
          </div>

          {/* Selector de métrica para el gráfico */}
          <div
            style={{
              display: "inline-flex",
              background: "#f3f4f6",
              padding: "3px",
              borderRadius: "8px",
              gap: "2px",
            }}
          >
            {(
              [
                { key: "impressions", label: "Vistas" },
                { key: "clicks", label: "Clicks" },
                { key: "cartAdds", label: "Carritos" },
                { key: "revenue", label: "$" },
              ] as { key: ChartMetric; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setChartMetric(tab.key)}
                style={{
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  background: chartMetric === tab.key ? "#ffffff" : "transparent",
                  color: chartMetric === tab.key ? "#10B981" : "#000000",
                  boxShadow:
                    chartMetric === tab.key
                      ? "0 1px 2px rgba(0,0,0,0.06)"
                      : "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenedor del Gráfico de Barras */}
        {timeline.length > 0 ? (
          <div
            style={{
              background: "#fafafa",
              border: "1px solid #f3f4f6",
              borderRadius: "12px",
              padding: "1.25rem 1rem 0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: timeline.length > 15 ? "4px" : "8px",
                height: "160px",
                width: "100%",
                paddingBottom: "1.5rem",
                position: "relative",
              }}
            >
              {timeline.map((item, idx) => {
                const val = Number(item[chartMetric]) || 0;
                const heightPercent = maxChartValue > 0 ? Math.max((val / maxChartValue) * 100, 4) : 4;
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={item.date || idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setHoveredIndex(idx)}
                    style={{
                      flex: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    {/* Tooltip flotante */}
                    {isHovered && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: `calc(${heightPercent}% + 10px)`,
                          background: "#000000",
                          color: "#ffffff",
                          padding: "0.3rem 0.55rem",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          zIndex: 10,
                          pointerEvents: "none",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        <div>{formatDateLabel(item.date)}</div>
                        <div style={{ color: "#10B981", fontSize: "0.78rem" }}>
                          {chartMetric === "revenue" ? formatCurrency(val) : formatNumber(val)}
                        </div>
                      </div>
                    )}

                    {/* Barra */}
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "28px",
                        height: `${heightPercent}%`,
                        background: isHovered
                          ? "#059669"
                          : val > 0
                          ? "#10B981"
                          : "#e5e7eb",
                        borderRadius: "4px 4px 0 0",
                        transition: "all 0.2s ease",
                      }}
                    />

                    {/* Label Fecha */}
                    {(timeline.length <= 10 || idx % Math.ceil(timeline.length / 8) === 0) && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-1.25rem",
                          fontSize: "0.68rem",
                          color: "#000000",
                          opacity: 0.5,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDateLabel(item.date)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
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
              Todavía no hay métricas para este período.
            </p>
          </div>
        )}
      </div>

      {/* Rendimiento por widget (COLAPSABLE / OCULTO POR DEFECTO) */}
      <div
        style={{
          borderTop: "1px solid #f3f4f6",
          paddingTop: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div>
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
                margin: "0.2rem 0 0",
                fontSize: "0.8rem",
                color: "#000000",
                opacity: 0.6,
              }}
            >
              {widgetList.length > 0
                ? `${widgetList.length} widget${widgetList.length === 1 ? "" : "s"} registrado${widgetList.length === 1 ? "" : "s"}`
                : "Ordená y analizá cada widget"}
            </p>
          </div>

          {/* BOTÓN VER / OCULTAR */}
          <button
            type="button"
            onClick={() => setShowWidgetPerformance(!showWidgetPerformance)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              border: showWidgetPerformance ? "1px solid #e5e7eb" : "1px solid #a7f3d0",
              background: showWidgetPerformance ? "#f3f4f6" : "#ecfdf5",
              color: showWidgetPerformance ? "#000000" : "#059669",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            <span>{showWidgetPerformance ? "Ocultar" : "Ver"}</span>
            {showWidgetPerformance ? (
              <ChevronUp size={15} color="#000000" />
            ) : (
              <ChevronDown size={15} color="#059669" />
            )}
          </button>
        </div>

        {/* CONTENIDO DESPLEGABLE */}
        <AnimatePresence>
          {showWidgetPerformance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden", marginTop: "1rem" }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
    }
