"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Package,
  Check,
  AlertCircle,
  Loader2,
  Type,
  Hash,
  Zap,
  ChevronLeft,
  ShoppingBag,
  Settings,
  Play,
  ImageIcon,
  Ruler,
  MousePointer,
  Mail,
  Shield,
  MessageCircle,
  Clock,
  Timer,
  TrendingUp,
  Link2,
  BarChart3,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WidgetDefinition, WidgetInstance, TiendanubeProduct, CATEGORY_LABELS } from "@/types/widgets";

// ─── SCHEMAS POR DEFECTO PARA WIDGETS SIN CONFIG_SCHEMA ───
const DEFAULT_SCHEMAS: Record<string, Record<string, any>> = {
  "productos-relacionados": {
    title: {
      type: "text",
      label: "Título del widget",
      default: "Productos relacionados",
      placeholder: "Ej: Completa tu look, También te puede interesar...",
    },
    max_products: {
      type: "number",
      label: "Cantidad de productos a mostrar",
      default: 4,
      min: 1,
      max: 8,
    },
    show_prices: {
      type: "boolean",
      label: "Mostrar precios",
      default: true,
    },
    show_discount_badge: {
      type: "boolean",
      label: "Mostrar badge de descuento",
      default: false,
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#6366f1",
      placeholder: "#6366f1",
    },
  },
  "bundle-productos": {
    title: {
      type: "text",
      label: "Título del bundle",
      default: "Ahorrá comprando el combo",
      placeholder: "Ej: Llevá los 3 y ahorrá 20%",
    },
    discount_percentage: {
      type: "number",
      label: "Porcentaje de descuento",
      default: 15,
      min: 1,
      max: 99,
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#10b981",
      placeholder: "#10b981",
    },
  },
  "upsell-producto": {
    title: {
      type: "text",
      label: "Título",
      default: "¿Te interesa algo mejor?",
      placeholder: "Ej: ¿Querés el upgrade?",
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#f59e0b",
      placeholder: "#f59e0b",
    },
  },
  "contador-stock": {
    threshold: {
      type: "number",
      label: "Umbral de stock bajo",
      default: 5,
      min: 1,
      max: 50,
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#ef4444",
      placeholder: "#ef4444",
    },
  },
  "contador-regresivo": {
    hours: {
      type: "number",
      label: "Horas del contador",
      default: 24,
      min: 1,
      max: 168,
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#ef4444",
      placeholder: "#ef4444",
    },
  },
  "barra-progreso": {
    goal_amount: {
      type: "number",
      label: "Monto objetivo ($)",
      default: 50000,
      min: 1000,
      max: 1000000,
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#8b5cf6",
      placeholder: "#8b5cf6",
    },
  },
  "badges-confianza": {
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#10b981",
      placeholder: "#10b981",
    },
  },
  "testimonios": {
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#6366f1",
      placeholder: "#6366f1",
    },
  },
  "popup-oferta": {
    discount: {
      type: "text",
      label: "Código de descuento",
      default: "NEVUX10",
      placeholder: "Ej: NEVUX10",
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#ec4899",
      placeholder: "#ec4899",
    },
  },
  "popup-salida": {
    discount: {
      type: "text",
      label: "Código de descuento",
      default: "NOVAYAS15",
      placeholder: "Ej: NOVAYAS15",
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#f59e0b",
      placeholder: "#f59e0b",
    },
  },
  "video-producto": {
    video_url: {
      type: "text",
      label: "URL del video",
      default: "",
      placeholder: "https://youtube.com/watch?v=...",
    },
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#6366f1",
      placeholder: "#6366f1",
    },
  },
  "galeria-360": {
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#6366f1",
      placeholder: "#6366f1",
    },
  },
  "descripcion-expandible": {
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#64748b",
      placeholder: "#64748b",
    },
  },
  "tabla-talles": {
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#6366f1",
      placeholder: "#6366f1",
    },
  },
  "sticky-add-cart": {
    accent_color: {
      type: "text",
      label: "Color de acento (hex)",
      default: "#10b981",
      placeholder: "#10b981",
    },
  },
};

// ─── ICONOS POR TIPO DE CAMPO ───
const FIELD_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={14} />,
  number: <Hash size={14} />,
  boolean: <Zap size={14} />,
};

// ─── ICONO DEL WIDGET ───
const WIDGET_ICONS: Record<string, React.ReactNode> = {
  "productos-relacionados": <Link2 size={20} />,
  "bundle-productos": <Package size={20} />,
  "upsell-producto": <TrendingUp size={20} />,
  "contador-stock": <Clock size={20} />,
  "contador-regresivo": <Timer size={20} />,
  "barra-progreso": <BarChart3 size={20} />,
  "badges-confianza": <Shield size={20} />,
  "testimonios": <MessageCircle size={20} />,
  "popup-oferta": <Mail size={20} />,
  "popup-salida": <MousePointer size={20} />,
  "video-producto": <Play size={20} />,
  "galeria-360": <ImageIcon size={20} />,
  "descripcion-expandible": <Type size={20} />,
  "tabla-talles": <Ruler size={20} />,
  "sticky-add-cart": <ShoppingCart size={20} />,
};

interface WidgetEditorProps {
  definition: WidgetDefinition;
  product: TiendanubeProduct | null;
  storeId: number | undefined;
  existingWidget: WidgetInstance | null;
  targetType: "product" | "all";
  targetProductId: number | null;
}

export default function WidgetEditor({
  definition,
  product,
  storeId,
  existingWidget,
  targetType,
  targetProductId,
}: WidgetEditorProps) {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(existingWidget?.id ?? null);
  const [previewKey, setPreviewKey] = useState(0);

  const effectiveSchema = useCallback(() => {
    const schema = definition.config_schema || {};
    if (Object.keys(schema).length === 0 && DEFAULT_SCHEMAS[definition.slug]) {
      return DEFAULT_SCHEMAS[definition.slug];
    }
    return schema as Record<string, any>;
  }, [definition]);

  useEffect(() => {
    const schema = effectiveSchema();
    const defaults: Record<string, any> = {};
    Object.entries(schema).forEach(([key, field]: [string, any]) => {
      defaults[key] = existingWidget?.config?.[key] ?? field.default ?? "";
    });
    setConfig(defaults);
    setIsActive(existingWidget?.is_active ?? true);
    setWidgetId(existingWidget?.id ?? null);
  }, [definition, existingWidget, effectiveSchema]);

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setPreviewKey((k) => k + 1);
  };

  const handleSave = async () => {
    if (!storeId) {
      setError("No hay tienda conectada");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: widgetId,
          store_id: storeId,
          widget_slug: definition.slug,
          widget_type: definition.category,
          target_type: targetType,
          target_product_id: targetProductId,
          config,
          is_active: isActive,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Error al guardar");
      }

      setSaved(true);
      if (result.data?.id) {
        setWidgetId(result.data.id);
      }
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message || "Error al guardar el widget");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key: string, field: any) => {
    const label = field.label || key;
    const value = config[key];

    if (field.type === "boolean") {
      return (
        <div key={key} style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <div
              onClick={() => handleConfigChange(key, !value)}
              style={{
                width: "44px",
                height: "24px",
                borderRadius: "12px",
                background: value
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "#374151",
                position: "relative",
                transition: "background 0.3s",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <motion.div
                animate={{ x: value ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  position: "absolute",
                  top: "2px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </div>
            <div>
              <span style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500, display: "block" }}>
                {label}
              </span>
              {field.description && (
                <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{field.description}</span>
              )}
            </div>
          </label>
        </div>
      );
    }

    if (field.type === "number") {
      return (
        <div key={key} style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {FIELD_ICONS[field.type] || <Hash size={14} />}
            {label}
          </label>
          <input
            type="number"
            min={field.min}
            max={field.max}
            value={value}
            onChange={(e) =>
              handleConfigChange(key, parseInt(e.target.value) || 0)
            }
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#f1f5f9",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      );
    }

    return (
      <div key={key} style={{ marginBottom: "1.25rem" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#94a3b8",
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {FIELD_ICONS[field.type] || <Type size={14} />}
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleConfigChange(key, e.target.value)}
          placeholder={field.placeholder || ""}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "#f1f5f9",
            fontSize: "0.95rem",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
    );
  };

  const renderPreview = () => {
    const accentColor = config.accent_color || "#6366f1";

    if (definition.slug === "productos-relacionados") {
      const count = Math.min(Math.max(config.max_products || 4, 1), 8);
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <h3
            style={{
              margin: "0 0 1.5rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#f8fafc",
              textAlign: "center",
            }}
          >
            {config.title || "Productos relacionados"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: count <= 2 ? "repeat(2, 1fr)" : "repeat(2, 1fr)", gap: "0.75rem" }}>
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={`${previewKey}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                whileHover={{
                  y: -6,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "1rem",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "90px",
                    background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
                    borderRadius: "12px",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Package size={24} color={`${accentColor}66`} />
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.25rem" }}>
                  Producto {i + 1}
                </div>
                {config.show_prices !== false && (
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: accentColor }}>
                    $12.500
                  </div>
                )}
                {config.show_discount_badge && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      padding: "0.2rem 0.5rem",
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      borderRadius: "6px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    -20%
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (definition.slug === "bundle-productos") {
      return (
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
              border: `1px solid ${accentColor}33`,
              borderRadius: "20px",
              padding: "2rem 1.5rem",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                marginBottom: "1rem",
              }}
            >
              <Package size={28} color="#ffffff" />
            </div>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
              {config.title || "Ahorrá comprando el combo"}
            </h3>
            <p style={{ margin: "0 0 1.25rem", fontSize: "0.85rem", color: "#94a3b8" }}>
              Llevá los 3 productos y ahorrá un {config.discount_percentage || 15}%
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <ShoppingCart size={16} />
              Agregar combo al carrito
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "upsell-producto") {
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${accentColor}33`,
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TrendingUp size={28} color={accentColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", color: accentColor, fontWeight: 700, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Upgrade recomendado
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.25rem" }}>
                {config.title || "¿Te interesa algo mejor?"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                Versión premium con más funciones
              </div>
            </div>
            <div
              style={{
                padding: "0.5rem 1rem",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                borderRadius: "10px",
                color: "#ffffff",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Ver
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "contador-stock") {
      const stock = Math.max(config.threshold || 5, 1);
      return (
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1.25rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
            }}
          >
            <Clock size={20} color="#ef4444" />
            <span style={{ color: "#fca5a5", fontSize: "0.9rem", fontWeight: 700 }}>
              ¡Solo quedan {stock} unidades!
            </span>
          </motion.div>
        </div>
      );
    }

    if (definition.slug === "contador-regresivo") {
      const hours = config.hours || 24;
      return (
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div style={{ marginBottom: "0.75rem", fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>
            ⏰ Oferta termina en:
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {[
              { val: String(hours).padStart(2, "0"), label: "HS" },
              { val: "45", label: "MIN" },
              { val: "30", label: "SEG" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "10px",
                  padding: "0.6rem 0.9rem",
                  minWidth: "56px",
                }}
              >
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fca5a5" }}>{item.val}</div>
                <div style={{ fontSize: "0.6rem", color: "#ef4444", fontWeight: 600 }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (definition.slug === "barra-progreso") {
      const goal = config.goal_amount || 50000;
      const current = Math.round(goal * 0.65);
      const pct = Math.round((current / goal) * 100);
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>
              Envío gratis
            </span>
            <span style={{ fontSize: "0.8rem", color: accentColor, fontWeight: 700 }}>
              ${current.toLocaleString()} / ${goal.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)`,
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#64748b", textAlign: "center" }}>
            Te faltan ${(goal - current).toLocaleString()} para envío gratis
          </div>
        </div>
      );
    }

    if (definition.slug === "badges-confianza") {
      const badges = [
        { icon: <Shield size={16} />, text: "Pago seguro" },
        { icon: <ShoppingBag size={16} />, text: "Envío en 24hs" },
        { icon: <Check size={16} />, text: "Garantía 30 días" },
      ];
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            {badges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 0.85rem",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${accentColor}33`,
                  borderRadius: "10px",
                  color: accentColor,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {badge.icon}
                {badge.text}
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (definition.slug === "testimonios") {
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accentColor,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                M
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9" }}>María G.</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>★★★★★</div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.5, fontStyle: "italic" }}>
              "Excelente producto, la calidad superó mis expectativas. Llegó en perfectas condiciones."
            </p>
          </div>
        </div>
      );
    }

    if (definition.slug === "popup-oferta") {
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b, #312e81)",
              border: `1px solid ${accentColor}44`,
              borderRadius: "20px",
              padding: "2rem 1.5rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              style={{ position: "absolute", top: "1rem", right: "1rem" }}
            >
              <Sparkles size={24} color={accentColor} />
            </motion.div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                marginBottom: "1rem",
              }}
            >
              <Mail size={24} color="#ffffff" />
            </div>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
              ¡No te lo pierdas!
            </h3>
            <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#94a3b8" }}>
              Usá el código y obtené un descuento exclusivo
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "0.6rem 1.25rem",
                background: "rgba(255,255,255,0.1)",
                border: `2px dashed ${accentColor}`,
                borderRadius: "10px",
                color: accentColor,
                fontSize: "1rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
              }}
            >
              {config.discount || "NEVUX10"}
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "popup-salida") {
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #451a03, #78350f)",
              border: `1px solid ${accentColor}44`,
              borderRadius: "20px",
              padding: "2rem 1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                marginBottom: "1rem",
              }}
            >
              <MousePointer size={24} color="#ffffff" />
            </div>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
              ¿Te vas tan pronto?
            </h3>
            <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#94a3b8" }}>
              Te regalamos un descuento por quedarte
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "0.6rem 1.25rem",
                background: "rgba(255,255,255,0.1)",
                border: `2px dashed ${accentColor}`,
                borderRadius: "10px",
                color: accentColor,
                fontSize: "1rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
              }}
            >
              {config.discount || "NOVAYAS15"}
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "video-producto") {
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              overflow: "hidden",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Play size={28} color="#ffffff" fill="#ffffff" />
            </div>
            <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", right: "0.75rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", background: "rgba(0,0,0,0.5)", padding: "0.4rem 0.75rem", borderRadius: "8px", backdropFilter: "blur(8px)" }}>
                {config.video_url ? "Video cargado" : "Sin video configurado"}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "galeria-360") {
      return (
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${accentColor}33`,
              }}
            >
              <ImageIcon size={40} color={accentColor} />
            </motion.div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8" }}>
              Arrastrá para rotar 360°
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "descripcion-expandible") {
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f1f5f9" }}>Descripción del producto</span>
              <motion.div
                animate={{ rotate: [0, 180] }}
                transition={{ duration: 0.3, repeat: 1, repeatType: "reverse" }}
              >
                <ChevronLeft size={18} color="#94a3b8" style={{ transform: "rotate(-90deg)" }} />
              </motion.div>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
              Este producto está fabricado con materiales de alta calidad. Ideal para uso diario...
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "tabla-talles") {
      const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${sizes.length}, 1fr)`,
                gap: "1px",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              {sizes.map((size, i) => (
                <motion.div
                  key={size}
                  whileHover={{ background: `${accentColor}22` }}
                  style={{
                    padding: "0.75rem 0.5rem",
                    textAlign: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: i === 2 ? accentColor : "#94a3b8",
                    background: i === 2 ? `${accentColor}15` : "transparent",
                    cursor: "pointer",
                    borderBottom: i === 2 ? `2px solid ${accentColor}` : "2px solid transparent",
                  }}
                >
                  {size}
                </motion.div>
              ))}
            </div>
            <div style={{ padding: "1rem", fontSize: "0.8rem", color: "#64748b", textAlign: "center" }}>
              Medidas: Pecho 96cm · Cintura 82cm · Largo 68cm
            </div>
          </div>
        </div>
      );
    }

    if (definition.slug === "sticky-add-cart") {
      return (
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              position: "fixed",
              bottom: "0",
              left: "0",
              right: "0",
              padding: "1rem 1.25rem",
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Precio total</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f8fafc" }}>$45.000</div>
            </div>
            <div
              style={{
                padding: "0.75rem 1.5rem",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </div>
          </div>
        </div>
      );
    }

    // Fallback genérico
    return (
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
            marginBottom: "1rem",
          }}
        >
          {WIDGET_ICONS[definition.slug] || <Sparkles size={28} color={accentColor} />}
        </div>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
          {definition.name}
        </h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
          {definition.description}
        </p>
      </div>
    );
  };

  const schema = effectiveSchema();
  const hasFields = Object.keys(schema).length > 0;
  const accentColor = config.accent_color || "#6366f1";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "2rem" }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#94a3b8",
            fontSize: "0.85rem",
            textDecoration: "none",
            marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
            }}
          >
            {WIDGET_ICONS[definition.slug] || <Sparkles size={22} />}
          </div>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", margin: "0 0 0.25rem" }}>
              {definition.name}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
              {definition.description}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
          <span
            style={{
              padding: "0.25rem 0.6rem",
              background: "rgba(99,102,241,0.1)",
              borderRadius: "6px",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#818cf8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {CATEGORY_LABELS[definition.category as keyof typeof CATEGORY_LABELS] || definition.category}
          </span>
          <span
            style={{
              padding: "0.25rem 0.6rem",
              background: targetType === "product" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
              borderRadius: "6px",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: targetType === "product" ? "#34d399" : "#fbbf24",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {targetType === "product" ? "Producto específico" : "Todos los productos"}
          </span>
        </div>
      </motion.div>

      {/* Grid principal */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Panel de configuración */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.06)",
            height: "fit-content",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Settings size={18} color="#6366f1" />
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>
              Configuración
            </h2>
          </div>

          {/* Producto seleccionado */}
          {product && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem",
                background: "rgba(99,102,241,0.08)",
                borderRadius: "14px",
                marginBottom: "1.5rem",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              {product.images?.[0]?.src ? (
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  width={44}
                  height={44}
                  style={{ borderRadius: "10px", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "rgba(99,102,241,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Package size={20} color="#6366f1" />
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#f1f5f9",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Producto seleccionado · ID: {product.id}
                </div>
              </div>
            </div>
          )}

          {/* Campos del formulario */}
          {hasFields ? (
            Object.entries(schema).map(([key, field]) => renderField(key, field))
          ) : (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}
            >
              <Sparkles size={32} color="#475569" style={{ marginBottom: "0.75rem" }} />
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Este widget no requiere configuración adicional.
              </p>
            </div>
          )}

          {/* Estado y Guardar */}
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
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
              <div>
                <span style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500, display: "block" }}>
                  Estado del widget
                </span>
                <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                  {isActive ? "Visible en tu tienda" : "Oculto en tu tienda"}
                </span>
              </div>
              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsActive(!isActive)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "999px",
                  background: isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: isActive ? "#22c55e" : "#ef4444",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1.5px solid ${isActive ? "rgba(34,197,68,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                {isActive ? "Activo" : "Inactivo"}
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1rem",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                    color: "#fca5a5",
                    fontSize: "0.85rem",
                  }}
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving || !storeId}
              style={{
                width: "100%",
                padding: "0.9rem",
                borderRadius: "12px",
                border: "none",
                background: saved
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: saving || !storeId ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: saved
                  ? "0 4px 12px rgba(34,197,94,0.35)"
                  : "0 4px 12px rgba(99,102,241,0.35)",
                opacity: !storeId ? 0.5 : 1,
                transition: "all 0.3s",
              }}
            >
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                    Guardando...
                  </motion.span>
                ) : saved ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <Check size={18} />
                    ¡Guardado con éxito!
                  </motion.span>
                ) : (
                  <motion.span
                    key="save"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <Save size={18} />
                    {widgetId ? "Actualizar widget" : "Guardar widget"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {widgetId && (
              <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#475569" }}>
                  ID: {widgetId.slice(0, 8)}... · Último guardado: {new Date().toLocaleTimeString("es-AR")}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Panel de preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Monitor size={18} color="#8b5cf6" />
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>
              Vista previa
            </h2>
            <span
              style={{
                marginLeft: "auto",
                padding: "0.2rem 0.5rem",
                background: "rgba(139,92,246,0.1)",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#a78bfa",
              }}
            >
              Live
            </span>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "2rem",
              border: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
              overflow: "hidden",
              minHeight: "320px",
            }}
          >
            {/* Glow ambiental */}
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "250px",
                height: "250px",
                background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                filter: "blur(40px)",
              }}
            />

            {renderPreview()}
          </div>

          {/* Info adicional */}
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem 1.25rem",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Sparkles size={14} color="#64748b" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8" }}>
                ¿Cómo se ve en tu tienda?
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
              Esta es una simulación visual. El widget real se renderizará directamente en las páginas de producto de tu tienda Tiendanube con los estilos y datos reales.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
  }
