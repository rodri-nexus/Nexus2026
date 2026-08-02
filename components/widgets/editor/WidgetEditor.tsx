"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Eye, EyeOff, Sparkles, Package, Check, AlertCircle, Loader2,
  Type, Hash, Zap, ChevronLeft, ShoppingBag, Settings, Play, Image,
  Ruler, MousePointer, Mail, Shield, MessageCircle, Clock, Timer,
  TrendingUp, Link2, BarChart3, ShoppingCart, ArrowLeft, Monitor,
  Layout, MapPin, Palette,
} from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { WidgetDefinition, WidgetInstance, TiendanubeProduct } from "@/types/widgets";
import CountdownWidget from "@/components/widgets/previews/CountdownWidget";

const CATEGORY_LABELS: Record<string, string> = {
  conversion: "Conversión", multimedia: "Multimedia", urgency: "Urgencia",
  trust: "Confianza", popup: "Popups", description: "Descripción",
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  general: <Settings size={16} />, location: <MapPin size={16} />, styles: <Palette size={16} />,
};

const SECTION_LABELS: Record<string, string> = {
  general: "General", location: "Ubicación", styles: "Estilos",
};

const WIDGET_ICONS: Record<string, React.ReactNode> = {
  "productos-relacionados": <Link2 size={20} />, "bundle-productos": <Package size={20} />,
  "upsell-producto": <TrendingUp size={20} />, "contador-stock": <Clock size={20} />,
  "contador-regresivo": <Timer size={20} />, "barra-progreso": <BarChart3 size={20} />,
  "badges-confianza": <Shield size={20} />, "testimonios": <MessageCircle size={20} />,
  "popup-oferta": <Mail size={20} />, "popup-salida": <MousePointer size={20} />,
  "video-producto": <Play size={20} />, "galeria-360": <Image size={20} />,
  "descripcion-expandible": <Type size={20} />, "tabla-talles": <Ruler size={20} />,
  "sticky-add-cart": <ShoppingCart size={20} />,
};

// Schema del contador regresivo (igual que antes)
const DEFAULT_SCHEMAS: Record<string, Record<string, any>> = {
  "contador-regresivo": {
    title: { type: "text", label: "Título", default: "Oferta🔥", placeholder: "Ej: Oferta Flash...", section: "general" },
    subtitle: { type: "text", label: "Subtítulo (opcional)", default: "", placeholder: "Ingresá un subtítulo...", section: "general" },
    end_datetime: { type: "datetime-local", label: "Fecha y hora final", default: "", section: "general" },
    auto_restart: { type: "boolean", label: "Reiniciar automáticamente cuando termine", default: false, section: "general" },
    show_days: { type: "boolean", label: "Mostrar días", default: true, section: "general" },
    show_in_product_page: { type: "boolean", label: "Mostrar en ficha de producto", default: true, section: "location" },
    widget_position: { type: "select", label: "Ubicación del widget", default: "before_add_to_cart", options: [{ value: "before_add_to_cart", label: "Antes del botón 'Agregar al carrito'" }, { value: "before_product_title", label: "Antes del título del producto" }, { value: "after_product_title", label: "Después del título del producto" }], section: "location" },
    sticky_bar: { type: "boolean", label: "Mostrar como barra fija en la parte superior", default: false, section: "location" },
    show_in_cart: { type: "boolean", label: "Mostrar en el carrito", default: false, section: "location" },
    clock_style: { type: "select", label: "Estilo del reloj", default: "classic", options: [{ value: "classic", label: "Clásico" }, { value: "retro_flip", label: "Retro flip" }], section: "styles" },
    content_alignment: { type: "select", label: "Alineación del contenido", default: "center", options: [{ value: "left", label: "Izquierda" }, { value: "center", label: "Siempre centrado" }, { value: "right", label: "Derecha" }], section: "styles" },
    show_clock_labels: { type: "boolean", label: "Mostrar etiquetas del reloj", default: true, section: "styles" },
    background_type: { type: "select", label: "Tipo de fondo", default: "solid", options: [{ value: "solid", label: "Color sólido" }, { value: "gradient", label: "Degradé" }], section: "styles" },
    background_color: { type: "text", label: "Color de fondo (hex)", default: "#1e1e1e", placeholder: "#1e1e1e", section: "styles" },
    subtitle_bg_color: { type: "text", label: "Fondo del subtítulo (hex)", default: "#fdc624", placeholder: "#fdc624", section: "styles" },
    clock_bg_color: { type: "text", label: "Color de fondo del reloj (hex)", default: "#ef4444", placeholder: "#ef4444", section: "styles" },
    title_font_color: { type: "text", label: "Color de fuente del título (hex)", default: "#ffffff", placeholder: "#ffffff", section: "styles" },
    subtitle_font_color: { type: "text", label: "Color de fuente del subtítulo (hex)", default: "#000000", placeholder: "#000000", section: "styles" },
    number_font_color: { type: "text", label: "Color de números (hex)", default: "#ffffff", placeholder: "#ffffff", section: "styles" },
    title_font_size: { type: "number", label: "Tamaño de fuente del título (px)", default: 16, min: 10, max: 40, section: "styles" },
    subtitle_font_size: { type: "number", label: "Tamaño de fuente del subtítulo (px)", default: 11, min: 8, max: 24, section: "styles" },
    clock_font_size: { type: "number", label: "Tamaño de fuente del reloj (px)", default: 16, min: 10, max: 40, section: "styles" },
    clock_border_radius: { type: "number", label: "Borde del reloj (px)", default: 5, min: 0, max: 25, section: "styles" },
    widget_border_radius: { type: "number", label: "Borde del widget (px)", default: 5, min: 0, max: 25, section: "styles" },
    widget_padding: { type: "number", label: "Margen interno del widget (px)", default: 15, min: 0, max: 40, section: "styles" },
    clock_padding: { type: "number", label: "Margen interno del reloj (px)", default: 7, min: 0, max: 30, section: "styles" },
  },
};

const FIELD_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={14} />, number: <Hash size={14} />, boolean: <Zap size={14} />,
  "datetime-local": <Clock size={14} />, select: <Layout size={14} />,
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
  definition, product, storeId, existingWidget, targetType, targetProductId,
}: WidgetEditorProps) {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(existingWidget?.id ?? null);
  const [previewKey, setPreviewKey] = useState(0);

  function getEffectiveSchema(): Record<string, any> {
    const schema = definition.config_schema || {};
    if (Object.keys(schema).length === 0 && DEFAULT_SCHEMAS[definition.slug]) {
      return DEFAULT_SCHEMAS[definition.slug];
    }
    return schema as Record<string, any>;
  }

  useEffect(() => {
    const schema = getEffectiveSchema();
    const defaults: Record<string, any> = {};
    Object.entries(schema).forEach(([key, field]: [string, any]) => {
      defaults[key] = existingWidget?.config?.[key] ?? field.default ?? "";
    });
    setConfig(defaults);
    setIsActive(existingWidget?.is_active ?? true);
    setWidgetId(existingWidget?.id ?? null);
  }, [definition, existingWidget]);

  function handleConfigChange(key: string, value: any) {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setPreviewKey((k) => k + 1);
  }

  async function handleSave() {
    if (!storeId) { setError("No hay tienda conectada"); return; }
    setSaving(true); setError(null); setSaved(false);
    try {
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: widgetId, store_id: storeId, widget_slug: definition.slug,
          widget_type: definition.category, target_type: targetType,
          target_product_id: targetProductId, config, is_active: isActive,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error al guardar");
      setSaved(true);
      if (result.data?.id) setWidgetId(result.data.id);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message || "Error al guardar el widget");
    } finally {
      setSaving(false);
    }
  }

  function renderField(key: string, field: any) {
    const label = field.label || key;
    const value = config[key];

    if (field.type === "boolean") {
      return (
        <div key={key} style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <div onClick={() => handleConfigChange(key, !value)} style={{
              width: "44px", height: "24px", borderRadius: "12px",
              background: value ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#374151",
              position: "relative", cursor: "pointer", flexShrink: 0,
            }}>
              <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
            </div>
            <div>
              <span style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500, display: "block" }}>{label}</span>
              {field.description && <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{field.description}</span>}
            </div>
          </label>
        </div>
      );
    }

    if (field.type === "number") {
      return (
        <div key={key} style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {FIELD_ICONS[field.type] || <Hash size={14} />}{label}
          </label>
          <input type="number" min={field.min} max={field.max} value={value}
            onChange={(e) => handleConfigChange(key, parseInt(e.target.value) || 0)}
            style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f1f5f9", fontSize: "0.95rem", outline: "none" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }} />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={key} style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {FIELD_ICONS[field.type] || <Layout size={14} />}{label}
          </label>
          <select value={value} onChange={(e) => handleConfigChange(key, e.target.value)}
            style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f1f5f9", fontSize: "0.95rem", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", paddingRight: "2.5rem" }}>
            {(field.options || []).map((opt: any) => (
              <option key={opt.value || opt} value={opt.value || opt} style={{ background: "#1e293b", color: "#f1f5f9" }}>{opt.label || opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "datetime-local") {
      return (
        <div key={key} style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {FIELD_ICONS[field.type] || <Clock size={14} />}{label}
          </label>
          <input type="datetime-local" value={value} onChange={(e) => handleConfigChange(key, e.target.value)}
            style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f1f5f9", fontSize: "0.95rem", outline: "none", colorScheme: "dark" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }} />
        </div>
      );
    }

    return (
      <div key={key} style={{ marginBottom: "1.25rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {FIELD_ICONS[field.type] || <Type size={14} />}{label}
        </label>
        <input type="text" value={value} onChange={(e) => handleConfigChange(key, e.target.value)} placeholder={field.placeholder || ""}
          style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f1f5f9", fontSize: "0.95rem", outline: "none" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }} />
      </div>
    );
  }

  function renderFieldsBySection(schema: Record<string, any>) {
    const sections: Record<string, [string, any][]> = {};
    Object.entries(schema).forEach(([key, field]) => {
      const section = field.section || "general";
      if (!sections[section]) sections[section] = [];
      sections[section].push([key, field]);
    });
    const sectionOrder = ["general", "location", "styles"];
    const orderedSections = sectionOrder.filter((s) => sections[s]).concat(Object.keys(sections).filter((s) => !sectionOrder.includes(s)));
    return orderedSections.map((section) => (
      <div key={section} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ color: "#6366f1" }}>{SECTION_ICONS[section] || <Settings size={16} />}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.08em" }}>{SECTION_LABELS[section] || section}</span>
        </div>
        {sections[section].map(([key, field]) => renderField(key as string, field))}
      </div>
    ));
  }

  function renderPreview() {
    if (definition.slug === "contador-regresivo") {
      return <CountdownWidget config={config} />;
    }
    // Placeholder genérico para los otros 14 widgets
    const accentColor = config.accent_color || "#6366f1";
    return (
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "16px", background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`, marginBottom: "1rem" }}>
          {WIDGET_ICONS[definition.slug] || <Sparkles size={28} color={accentColor} />}
        </div>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>{definition.name}</h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>{definition.description}</p>
      </div>
    );
  }

  const schema = getEffectiveSchema();
  const hasFields = Object.keys(schema).length > 0;
  const hasSections = Object.values(schema).some((f: any) => f.section);
  const accentColor = config.accent_color || "#6366f1";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.85rem", textDecoration: "none", marginBottom: "1rem" }}>
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`, display: "flex", alignItems: "center", justifyContent: "center", color: accentColor }}>
            {WIDGET_ICONS[definition.slug] || <Sparkles size={22} />}
          </div>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", margin: "0 0 0.25rem" }}>{definition.name}</h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>{definition.description}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
          <span style={{ padding: "0.25rem 0.6rem", background: "rgba(99,102,241,0.1)", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{CATEGORY_LABELS[definition.category] || definition.category}</span>
          <span style={{ padding: "0.25rem 0.6rem", background: targetType === "product" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, color: targetType === "product" ? "#34d399" : "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em" }}>{targetType === "product" ? "Producto específico" : "Todos los productos"}</span>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(20px)", borderRadius: "20px", padding: "2rem", border: "1px solid rgba(255,255,255,0.06)", height: "fit-content" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Settings size={18} color="#6366f1" />
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>Configuración</h2>
          </div>

          {product && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem", background: "rgba(99,102,241,0.08)", borderRadius: "14px", marginBottom: "1.5rem", border: "1px solid rgba(99,102,241,0.15)" }}>
              {product.images?.[0]?.src ? (
                <NextImage src={product.images[0].src} alt={product.name} width={44} height={44} style={{ borderRadius: "10px", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={20} color="#6366f1" /></div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Producto seleccionado · ID: {product.id}</div>
              </div>
            </div>
          )}

          {hasFields ? (hasSections ? renderFieldsBySection(schema) : Object.entries(schema).map(([key, field]) => renderField(key, field))) : (
            <div style={{ padding: "2rem", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <div style={{ marginBottom: "0.75rem" }}><Sparkles size={32} color="#475569" /></div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Este widget no requiere configuración adicional.</p>
            </div>
          )}

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <span style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500, display: "block" }}>Estado del widget</span>
                <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{isActive ? "Visible en tu tienda" : "Oculto en tu tienda"}</span>
              </div>
              <motion.div whileTap={{ scale: 0.95 }} onClick={() => setIsActive(!isActive)} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.85rem", borderRadius: "999px", background: isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: isActive ? "#22c55e" : "#ef4444", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", border: `1.5px solid ${isActive ? "rgba(34,197,68,0.3)" : "rgba(239,68,68,0.3)"}` }}>
                {isActive ? <Eye size={14} /> : <EyeOff size={14} />}{isActive ? "Activo" : "Inactivo"}
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", marginBottom: "1rem", color: "#fca5a5", fontSize: "0.85rem" }}>
                  <AlertCircle size={16} />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving || !storeId} style={{ width: "100%", padding: "0.9rem", borderRadius: "12px", border: "none", background: saved ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#ffffff", fontSize: "0.95rem", fontWeight: 700, cursor: saving || !storeId ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: saved ? "0 4px 12px rgba(34,197,94,0.35)" : "0 4px 12px rgba(99,102,241,0.35)", opacity: !storeId ? 0.5 : 1, transition: "all 0.3s" }}>
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}><Loader2 size={18} /></span>Guardando...
                  </motion.span>
                ) : saved ? (
                  <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Check size={18} />Guardado con éxito!
                  </motion.span>
                ) : (
                  <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Save size={18} />{widgetId ? "Actualizar widget" : "Guardar widget"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {widgetId && (
              <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#475569" }}>ID: {widgetId.slice(0, 8)}... · Último guardado: {new Date().toLocaleTimeString("es-AR")}</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Monitor size={18} color="#8b5cf6" />
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>Vista previa</h2>
            <span style={{ marginLeft: "auto", padding: "0.2rem 0.5rem", background: "rgba(139,92,246,0.1)", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600, color: "#a78bfa" }}>Live</span>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(20px)", borderRadius: "20px", padding: "2rem", border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden", minHeight: "320px" }}>
            <motion.div animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "50%", left: "50%", width: "250px", height: "250px", background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`, transform: "translate(-50%, -50%)", pointerEvents: "none", filter: "blur(40px)" }} />
            {renderPreview()}
          </div>
          <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Sparkles size={14} color="#64748b" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8" }}>Cómo se ve en tu tienda?</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>Esta es una simulación visual. El widget real se renderizará directamente en las páginas de producto de tu tienda Tiendanube con los estilos y datos reales.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
  }
