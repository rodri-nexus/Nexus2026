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
} from "lucide-react";
import { WidgetDefinition, WidgetCategory, CATEGORY_LABELS } from "@/types/widgets";
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
            color: "#111827",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h1>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          marginBottom: "1.25rem",
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
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: isActive ? "none" : "1.5px solid #e5e7eb",
                background: isActive
                  ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                  : "#ffffff",
                color: isActive ? "#ffffff" : "#374151",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                boxShadow: isActive
                  ? "0 2px 8px rgba(99, 102, 241, 0.25)"
                  : "none",
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
            color="#9ca3af"
            style={{
              position: "absolute",
              left: "0.9rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            placeholder="Busca un widget..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              border: "1.5px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "0.9rem",
              color: "#374151",
              outline: "none",
              fontFamily: "inherit",
              background: "#ffffff",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
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

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 0",
            color: "#9ca3af",
            fontSize: "0.9rem",
          }}
        >
          No se encontraron widgets para esta categoría.
        </div>
      )}
    </div>
  );
}
