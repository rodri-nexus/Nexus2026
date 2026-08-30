"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ListFilter,
  TrendingUp,
  Play,
  Clock,
  Shield,
  Mail,
  Type,
  Search,
  Sparkles,
} from "lucide-react";
import { WidgetDefinition, WidgetCategory } from "@/types/widgets";
import WidgetCard from "./WidgetCard";

const CATEGORIES: {
  key: WidgetCategory | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "all", label: "Todos", icon: <ListFilter size={15} /> },
  { key: "conversion", label: "Conversión", icon: <TrendingUp size={15} /> },
  { key: "multimedia", label: "Multimedia", icon: <Play size={15} /> },
  { key: "urgency", label: "Urgencia", icon: <Clock size={15} /> },
  { key: "trust", label: "Confianza", icon: <Shield size={15} /> },
  { key: "popup", label: "Popups", icon: <Mail size={15} /> },
  { key: "description", label: "Descripción", icon: <Type size={15} /> },
];

interface WidgetCatalogProps {
  widgets: WidgetDefinition[];
  onSelectWidget: (widget: WidgetDefinition) => void;
  title: string;
  chip?: React.ReactNode;
}

export default function WidgetCatalog({
  widgets,
  onSelectWidget,
  title,
  chip,
}: WidgetCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<WidgetCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return widgets.filter((w) => {
      const matchCategory =
        activeCategory === "all" || w.category === activeCategory;
      const matchSearch =
        search.trim() === "" ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [widgets, activeCategory, search]);

  return (
    <div>
      {/* Chip + Título */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {chip && <div style={{ marginBottom: "1rem" }}>{chip}</div>}
        <h1
          style={{
            margin: "0 0 1.5rem 0",
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#000000",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>
      </motion.div>

      {/* Filtros con scroll horizontal táctil */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.9rem",
                borderRadius: "999px",
                border: isActive ? "1.5px solid #10B981" : "1.5px solid #e5e7eb",
                background: isActive ? "#10B981" : "#ffffff",
                color: isActive ? "#ffffff" : "#000000",
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                boxShadow: isActive
                  ? "0 2px 8px rgba(16, 185, 129, 0.25)"
                  : "none",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#10B981";
                  e.currentTarget.style.background = "#f0fdf4";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#ffffff";
                }
              }}
            >
              {cat.icon}
              {cat.label}
            </button>
          );
        })}
      </motion.div>

      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        style={{ marginBottom: "1.5rem" }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            color="#10B981"
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            placeholder="Buscar widget por nombre o función..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.6rem",
              border: "1.5px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "0.9rem",
              color: "#000000",
              outline: "none",
              fontFamily: "inherit",
              background: "#ffffff",
              transition: "border-color 0.15s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#10B981";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          />
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {filtered.map((widget, i) => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            onClick={() => onSelectWidget(widget)}
            index={i}
          />
        ))}
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3.5rem 1rem",
            background: "#fafafa",
            borderRadius: "16px",
            border: "1px dashed #e5e7eb",
          }}
        >
          <Sparkles size={32} color="#10B981" style={{ margin: "0 auto 0.75rem auto" }} />
          <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "1rem", fontWeight: 700 }}>
            No se encontraron widgets
          </h4>
          <p
            style={{
              margin: "0 0 1rem 0",
              color: "#000000",
              opacity: 0.6,
              fontSize: "0.85rem",
            }}
          >
            Probá buscando con otras palabras o cambiando de categoría.
          </p>
          {(search || activeCategory !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#10B981",
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Ver todos los widgets
            </button>
          )}
        </div>
      )}
    </div>
  );
  }
