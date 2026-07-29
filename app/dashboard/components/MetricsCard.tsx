"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Info,
  Eye,
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  BarChart3,
  ChevronDown,
} from "lucide-react";

type Period = "hoy" | "ayer" | "7dias" | "personalizado";

interface MetricItem {
  label: string;
  value: string;
  sublabel: string;
  icon: typeof Eye;
  gradient: string;
}

export default function MetricsCard() {
  const [period, setPeriod] = useState<Period>("7dias");

  const metrics: MetricItem[] = [
    {
      label: "Impresiones",
      value: "0",
      sublabel: "Vistas de widgets",
      icon: Eye,
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
    {
      label: "Clicks",
      value: "0",
      sublabel: "Interacciones",
      icon: MousePointerClick,
      gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    },
    {
      label: "Agregados al carrito",
      value: "0",
      sublabel: "Desde widgets",
      icon: ShoppingCart,
      gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
    },
    {
      label: "Facturación estimada",
      value: "$ -",
      sublabel: "Desde widgets",
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #7c3aed, #6366f1)",
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
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
          color: "#6b7280",
          fontSize: "0.8rem",
        }}
      >
        <Info size={14} />
        <span>Métricas disponibles próximamente</span>
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.01em",
        }}
      >
        Métricas de widgets
      </h2>
      <p
        style={{
          margin: "0.25rem 0 1.25rem",
          fontSize: "0.9rem",
          color: "#6b7280",
        }}
      >
        {period === "hoy" && "Hoy"}
        {period === "ayer" && "Ayer"}
        {period === "7dias" && "Últimos 7 días"}
        {period === "personalizado" && "Rango personalizado"}
      </p>

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
                background: isActive
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "#ffffff",
                color: isActive ? "#ffffff" : "#374151",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.color = "#6366f1";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#374151";
                }
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

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
                background: "#f9fafb",
                border: "1px solid #f3f4f6",
                borderRadius: "12px",
                padding: "1.15rem",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.15s, box-shadow 0.15s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(99, 102, 241, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
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
                  boxShadow: "0 4px 10px rgba(99, 102, 241, 0.2)",
                }}
              >
                <Icon size={18} color="#ffffff" />
              </div>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#6b7280",
                  fontWeight: 500,
                  marginBottom: "0.35rem",
                }}
              >
                {metric.label}
              </div>

              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "#111827",
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
                  color: "#9ca3af",
                  fontWeight: 500,
                }}
              >
                {metric.sublabel}
              </div>
            </motion.div>
          );
        })}
      </div>

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
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Evolución del período
        </h3>
        <p
          style={{
            margin: "0.25rem 0 1.25rem",
            fontSize: "0.85rem",
            color: "#6b7280",
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
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px dashed #e5e7eb",
          }}
        >
          <BarChart3 size={40} color="#d1d5db" strokeWidth={1.5} />
          <p
            style={{
              margin: "0.75rem 0 0",
              fontSize: "0.9rem",
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            Todavía no hay métricas para este período.
          </p>
        </div>
      </div>

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
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Rendimiento por widget
        </h3>
        <p
          style={{
            margin: "0.25rem 0 1rem",
            fontSize: "0.85rem",
            color: "#6b7280",
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
              defaultValue="impresiones"
              style={{
                width: "100%",
                appearance: "none",
                WebkitAppearance: "none",
                padding: "0.6rem 2.25rem 0.6rem 0.9rem",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                fontSize: "0.85rem",
                color: "#374151",
                fontWeight: 500,
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
              color="#6b7280"
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div style={{ position: "relative", flex: "1 1 160px" }}>
            <select
              defaultValue="desc"
              style={{
                width: "100%",
                appearance: "none",
                WebkitAppearance: "none",
                padding: "0.6rem 2.25rem 0.6rem 0.9rem",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                fontSize: "0.85rem",
                color: "#374151",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <option value="desc">Mayor a menor</option>
              <option value="asc">Menor a mayor</option>
            </select>
            <ChevronDown
              size={16}
              color="#6b7280"
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem",
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px dashed #e5e7eb",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            Todavía no hay widgets con métricas para este período.
          </p>
        </div>
      </div>
    </motion.section>
  );
      }
