"use client";

import React, { useState } from "react";

export interface CajaEstadisticasEditorProps {
  widgetDefinition?: any;
  existingWidget?: any;
  targetType?: string;
  productId?: number | null | string;
  categoryId?: string | null;
  storeId?: any;
  onSave?: () => void;
}

interface StatItem {
  id: string;
  icon: string;
  number: string;
  label: string;
  text: string;
}

const DEFAULT_ITEMS: StatItem[] = [
  { id: "1", icon: "package", number: "+1.500", label: "Pedidos enviados", text: "Envíos a todo el país" },
  { id: "2", icon: "star", number: "4.9", label: "Puntaje promedio", text: "Basado en +500 opiniones" },
  { id: "3", icon: "truck", number: "24h", label: "Despacho", text: "Despacho ultrarrápido" },
];

const CAMPAIGN_PRESETS = [
  { id: "none", name: "Sin campaña" },
  { id: "black-friday", name: "Black Friday 🖤" },
  { id: "hot-sale", name: "Hot Sale 🔥" },
  { id: "cyber-monday", name: "Cyber Monday ⚡" },
  { id: "navidad", name: "Navidad 🎄" },
  { id: "san-valentin", name: "San Valentín ❤️" },
  { id: "dia-padre-madre", name: "Día del Padre / Madre 🎁" },
  { id: "liquidacion", name: "Liquidación 🏷️" },
];

const AVAILABLE_ICONS = [
  { id: "package", label: "Caja / Pedido", icon: "📦" },
  { id: "star", label: "Estrella", icon: "⭐" },
  { id: "truck", label: "Camión / Envío", icon: "🚚" },
  { id: "shield", label: "Garantía", icon: "🛡️" },
  { id: "check", label: "Verificado", icon: "✓" },
  { id: "clock", label: "Reloj / Tiempo", icon: "⏰" },
  { id: "award", label: "Medalla / Premio", icon: "🏆" },
  { id: "heart", label: "Corazón", icon: "❤️" },
  { id: "users", label: "Clientes", icon: "👥" },
  { id: "thumbs-up", label: "Me gusta", icon: "👍" },
  { id: "zap", label: "Rayo / Rápido", icon: "⚡" },
  { id: "lock", label: "Seguridad", icon: "🔒" },
];

function FieldLabel({ children, help }: { children: React.ReactNode; help?: string }) {
  return (
    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
      {children}
      {help && <span style={{ display: "block", fontSize: "11px", fontWeight: 400, color: "#6b7280", marginTop: "2px" }}>{help}</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "9px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "13px",
        color: "#111827",
        background: "#ffffff",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
        <input
          type="color"
          value={value === "transparent" ? "#ffffff" : value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "32px", height: "32px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", padding: "1px", background: "#ffffff", flexShrink: 0 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            padding: "7px 8px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "11px",
            fontFamily: "monospace",
            color: "#111827",
            background: "#ffffff",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", flex: 1, paddingRight: "10px" }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "999px",
          background: checked ? "#10b981" : "#d1d5db",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#ffffff",
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </label>
  );
}

function SliderInput({ label, value, min, max, unit = "px", onChange }: { label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#10b981" }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
      />
    </div>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: any; options: { value: any; label: string }[]; onChange: (v: any) => void }) {
  return (
    <div style={{ minWidth: 0 }}>
      {label && <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>{label}</div>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 10px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "13px",
          color: "#111827",
          background: "#ffffff",
          outline: "none",
          boxSizing: "border-box",
          textOverflow: "ellipsis",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function CajaEstadisticasEditor({
  existingWidget,
  targetType,
  productId,
  categoryId,
  storeId,
  onSave,
}: CajaEstadisticasEditorProps) {
  const parseCfg = () => {
    let cfg = existingWidget?.config;
    if (typeof cfg === "string") {
      try { cfg = JSON.parse(cfg); } catch (e) { cfg = {}; }
    }
    cfg = cfg || {};
    return {
      title: cfg.title !== undefined ? cfg.title : "Nuestros números",
      subtitle: cfg.subtitle !== undefined ? cfg.subtitle : "Lo que nos respalda",
      items: Array.isArray(cfg.items) && cfg.items.length > 0 ? cfg.items : DEFAULT_ITEMS,
      location: cfg.location || "product_before",
      // Layout
      layout: cfg.layout || "columns",
      colsDesktop: cfg.colsDesktop !== undefined ? Number(cfg.colsDesktop) : 3,
      colsMobile: cfg.colsMobile !== undefined ? Number(cfg.colsMobile) : 2,
      align: cfg.align || "center",
      // Colors
      titleColor: cfg.titleColor || "#191919",
      subtitleColor: cfg.subtitleColor || "#666666",
      iconColor: cfg.iconColor || "#191919",
      numberColor: cfg.numberColor || "#191919",
      labelColor: cfg.labelColor || "#191919",
      textColor: cfg.textColor || "#666666",
      sectionBgColor: cfg.sectionBgColor || "transparent",
      containerBgColor: cfg.containerBgColor || "#f7f7f7",
      cardBgColor: cfg.cardBgColor || "transparent",
      borderColor: cfg.borderColor || "transparent",
      // Font sizes
      iconSize: cfg.iconSize !== undefined ? Number(cfg.iconSize) : 32,
      numberSize: cfg.numberSize !== undefined ? Number(cfg.numberSize) : 24,
      labelSize: cfg.labelSize !== undefined ? Number(cfg.labelSize) : 15,
      textSize: cfg.textSize !== undefined ? Number(cfg.textSize) : 13,
      titleSize: cfg.titleSize !== undefined ? Number(cfg.titleSize) : 22,
      subtitleSize: cfg.subtitleSize !== undefined ? Number(cfg.subtitleSize) : 15,
      // Font styles
      numberWeight: cfg.numberWeight || "bold",
      labelWeight: cfg.labelWeight || "bold",
      // Spacing & borders
      containerPadding: cfg.containerPadding !== undefined ? Number(cfg.containerPadding) : 20,
      cardPadding: cfg.cardPadding !== undefined ? Number(cfg.cardPadding) : 10,
      containerRadius: cfg.containerRadius !== undefined ? Number(cfg.containerRadius) : 10,
      showSeparator: cfg.showSeparator !== undefined ? Boolean(cfg.showSeparator) : false,
      // Campaign
      campaignTheme: cfg.campaignTheme || "none",
    };
  };

  const [activeTab, setActiveTab] = useState<"gen" | "location" | "style" | "dates">("gen");
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);

  const [cfg, setCfg] = useState(parseCfg());

  const updateCfg = (key: string, val: any) => {
    setCfg((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleAddItem = () => {
    if (cfg.items.length >= 6) return;
    const newItem: StatItem = {
      id: String(Date.now()),
      icon: "check",
      number: "100%",
      label: "Garantizado",
      text: "Calidad asegurada",
    };
    updateCfg("items", [...cfg.items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof StatItem, val: string) => {
    const updated = cfg.items.map((item: StatItem) => (item.id === id ? { ...item, [field]: val } : item));
    updateCfg("items", updated);
  };

  const handleRemoveItem = (id: string) => {
    if (cfg.items.length <= 1) return;
    const updated = cfg.items.filter((item: StatItem) => item.id !== id);
    updateCfg("items", updated);
  };

  const applyCampaignPreset = (presetId: string) => {
    updateCfg("campaignTheme", presetId);
    if (presetId === "black-friday") {
      setCfg((prev: any) => ({
        ...prev,
        campaignTheme: presetId,
        sectionBgColor: "#000000",
        containerBgColor: "#111827",
        cardBgColor: "#1f2937",
        titleColor: "#ffffff",
        subtitleColor: "#9ca3af",
        iconColor: "#ef4444",
        numberColor: "#ffffff",
        labelColor: "#ef4444",
        textColor: "#d1d5db",
        borderColor: "#374151",
      }));
    } else if (presetId === "hot-sale") {
      setCfg((prev: any) => ({
        ...prev,
        campaignTheme: presetId,
        sectionBgColor: "transparent",
        containerBgColor: "#fff5f0",
        cardBgColor: "#ffffff",
        titleColor: "#ff4800",
        subtitleColor: "#666666",
        iconColor: "#ff4800",
        numberColor: "#ff4800",
        labelColor: "#111827",
        textColor: "#666666",
        borderColor: "#ffd2c7",
      }));
    } else if (presetId === "cyber-monday") {
      setCfg((prev: any) => ({
        ...prev,
        campaignTheme: presetId,
        sectionBgColor: "transparent",
        containerBgColor: "#f0f5ff",
        cardBgColor: "#ffffff",
        titleColor: "#0055ff",
        subtitleColor: "#666666",
        iconColor: "#0055ff",
        numberColor: "#0055ff",
        labelColor: "#111827",
        textColor: "#666666",
        borderColor: "#bfdbfe",
      }));
    } else if (presetId === "navidad") {
      setCfg((prev: any) => ({
        ...prev,
        campaignTheme: presetId,
        sectionBgColor: "transparent",
        containerBgColor: "#f0fdf4",
        cardBgColor: "#ffffff",
        titleColor: "#15803d",
        subtitleColor: "#666666",
        iconColor: "#dc2626",
        numberColor: "#dc2626",
        labelColor: "#15803d",
        textColor: "#666666",
        borderColor: "#bbf7d0",
      }));
    } else if (presetId === "san-valentin") {
      setCfg((prev: any) => ({
        ...prev,
        campaignTheme: presetId,
        sectionBgColor: "transparent",
        containerBgColor: "#fff0f3",
        cardBgColor: "#ffffff",
        titleColor: "#e11d48",
        subtitleColor: "#666666",
        iconColor: "#e11d48",
        numberColor: "#e11d48",
        labelColor: "#881337",
        textColor: "#666666",
        borderColor: "#fecdd3",
      }));
    } else if (presetId === "dia-padre-madre") {
      setCfg((prev: any) => ({
        ...prev,
        campaignTheme: presetId,
        sectionBgColor: "transparent",
        containerBgColor: "#f8fafc",
        cardBgColor: "#ffffff",
        titleColor: "#0f172a",
        subtitleColor: "#475569",
        iconColor: "#0284c7",
        numberColor: "#0284c7",
        labelColor: "#0f172a",
        textColor: "#666666",
        borderColor: "#e2e8f0",
      }));
    } else if (presetId === "liquidacion") {
      setCfg((prev: any) => ({
        ...prev,
        campaignTheme: presetId,
        sectionBgColor: "transparent",
        containerBgColor: "#fefce8",
        cardBgColor: "#ffffff",
        titleColor: "#854d0e",
        subtitleColor: "#713f12",
        iconColor: "#ca8a04",
        numberColor: "#000000",
        labelColor: "#000000",
        textColor: "#666666",
        borderColor: "#fef08a",
      }));
    } else {
      updateCfg("campaignTheme", "none");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingWidget?.id,
          widget_slug: "caja-estadisticas",
          store_id: storeId,
          target_type: targetType || "all",
          target_product_id: productId,
          target_category_id: categoryId,
          config: cfg,
          is_active: isActive,
        }),
      });
      if (res.ok && onSave) {
        onSave();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Navegación por Pestañas */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid #e5e7eb", overflowX: "auto", paddingBottom: "2px" }}>
        {[
          { id: "gen", label: "General" },
          { id: "location", label: "Ubicación" },
          { id: "style", label: "Estilos" },
          { id: "dates", label: "Fechas Especiales 🎈" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "#10b981" : "#6b7280",
              borderBottom: activeTab === tab.id ? "2px solid #10b981" : "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. PESTAÑA GENERAL */}
      {activeTab === "gen" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <FieldLabel help="Título superior opcional para encabezar el bloque.">Título (opcional)</FieldLabel>
            <TextInput value={cfg.title} onChange={(v) => updateCfg("title", v)} placeholder="ej: Nuestros números" />
          </div>

          <div>
            <FieldLabel help="Subtítulo corto explicativo debajo del título.">Subtítulo (opcional)</FieldLabel>
            <TextInput value={cfg.subtitle} onChange={(v) => updateCfg("subtitle", v)} placeholder="ej: Lo que nos respalda" />
          </div>

          <div>
            <FieldLabel help="Muestra de 1 a 6 estadísticas con ícono, número, etiqueta y texto.">Estadísticas</FieldLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "6px" }}>
              {cfg.items.map((item: StatItem, idx: number) => (
                <div
                  key={item.id}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Estadística #{idx + 1}</span>
                    {cfg.items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fca5a5",
                          color: "#ef4444",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>

                  {/* Fila 1: Ícono + Número */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                    <SelectInput
                      label="Ícono"
                      value={item.icon}
                      options={AVAILABLE_ICONS.map((i) => ({ value: i.id, label: `${i.icon} ${i.label}` }))}
                      onChange={(v) => handleUpdateItem(item.id, "icon", v)}
                    />
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>Número</div>
                      <TextInput value={item.number} onChange={(v) => handleUpdateItem(item.id, "number", v)} placeholder="ej: +1.500" />
                    </div>
                  </div>

                  {/* Fila 2: Etiqueta */}
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>Etiqueta</div>
                    <TextInput value={item.label} onChange={(v) => handleUpdateItem(item.id, "label", v)} placeholder="ej: Pedidos enviados" />
                  </div>

                  {/* Fila 3: Texto opcional */}
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>Texto descriptivo (opcional)</div>
                    <TextInput value={item.text} onChange={(v) => handleUpdateItem(item.id, "text", v)} placeholder="ej: Envíos a todo el país" />
                  </div>
                </div>
              ))}

              {cfg.items.length < 6 && (
                <button
                  onClick={handleAddItem}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px dashed #10b981",
                    background: "#ecfdf5",
                    color: "#059669",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  + Agregar estadística
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. PESTAÑA UBICACIÓN */}
      {activeTab === "location" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FieldLabel help="Elige la posición del widget dentro de la ficha de producto.">Posición del widget</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { id: "product_before", title: "Antes de la descripción", desc: "Debajo del botón de compra u opciones de envío." },
              { id: "product_after", title: "Después de la descripción", desc: "A ancho completo debajo de la sección principal." },
            ].map((loc) => (
              <label
                key={loc.id}
                onClick={() => updateCfg("location", loc.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: cfg.location === loc.id ? "2px solid #10b981" : "1px solid #e5e7eb",
                  background: cfg.location === loc.id ? "#ecfdf5" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                <input type="radio" name="location" checked={cfg.location === loc.id} onChange={() => {}} style={{ marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{loc.title}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{loc.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />

          <Toggle checked={isActive} onChange={setIsActive} label="Widget activo en la tienda" />
        </div>
      )}

      {/* 3. PESTAÑA ESTILOS */}
      {activeTab === "style" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Distribución */}
          <div style={{ background: "#f9fafb", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>📊 Distribución</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <SelectInput
                label="Diseño"
                value={cfg.layout}
                options={[
                  { value: "columns", label: "Columnas" },
                  { value: "list", label: "Lista" },
                ]}
                onChange={(v) => updateCfg("layout", v)}
              />
              <SelectInput
                label="Alineación"
                value={cfg.align}
                options={[
                  { value: "center", label: "Centrada" },
                  { value: "left", label: "Izquierda" },
                  { value: "right", label: "Derecha" },
                ]}
                onChange={(v) => updateCfg("align", v)}
              />
            </div>

            {cfg.layout === "columns" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                <SelectInput
                  label="Columnas Escritorio"
                  value={cfg.colsDesktop}
                  options={[
                    { value: 1, label: "1 columna" },
                    { value: 2, label: "2 columnas" },
                    { value: 3, label: "3 columnas" },
                    { value: 4, label: "4 columnas" },
                    { value: 6, label: "6 columnas" },
                  ]}
                  onChange={(v) => updateCfg("colsDesktop", Number(v))}
                />
                <SelectInput
                  label="Columnas Móvil"
                  value={cfg.colsMobile}
                  options={[
                    { value: 1, label: "1 columna" },
                    { value: 2, label: "2 columnas" },
                    { value: 3, label: "3 columnas" },
                  ]}
                  onChange={(v) => updateCfg("colsMobile", Number(v))}
                />
              </div>
            )}
          </div>

          {/* Colores */}
          <div style={{ background: "#f9fafb", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>🎨 Colores</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <ColorPicker label="Título" value={cfg.titleColor} onChange={(v) => updateCfg("titleColor", v)} />
              <ColorPicker label="Subtítulo" value={cfg.subtitleColor} onChange={(v) => updateCfg("subtitleColor", v)} />
              <ColorPicker label="Ícono" value={cfg.iconColor} onChange={(v) => updateCfg("iconColor", v)} />
              <ColorPicker label="Número" value={cfg.numberColor} onChange={(v) => updateCfg("numberColor", v)} />
              <ColorPicker label="Etiqueta" value={cfg.labelColor} onChange={(v) => updateCfg("labelColor", v)} />
              <ColorPicker label="Texto" value={cfg.textColor} onChange={(v) => updateCfg("textColor", v)} />
              <ColorPicker label="Fondo Sección" value={cfg.sectionBgColor} onChange={(v) => updateCfg("sectionBgColor", v)} />
              <ColorPicker label="Fondo Contenedor" value={cfg.containerBgColor} onChange={(v) => updateCfg("containerBgColor", v)} />
              <ColorPicker label="Fondo Tarjeta" value={cfg.cardBgColor} onChange={(v) => updateCfg("cardBgColor", v)} />
              <ColorPicker label="Borde Contenedor" value={cfg.borderColor} onChange={(v) => updateCfg("borderColor", v)} />
            </div>
          </div>

          {/* Tipografías */}
          <div style={{ background: "#f9fafb", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>✏️ Tipografías y Tamaños</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <SliderInput label="Tamaño Ícono" value={cfg.iconSize} min={16} max={64} onChange={(v) => updateCfg("iconSize", v)} />
              <SliderInput label="Tamaño Número" value={cfg.numberSize} min={14} max={48} onChange={(v) => updateCfg("numberSize", v)} />
              <SliderInput label="Tamaño Etiqueta" value={cfg.labelSize} min={10} max={24} onChange={(v) => updateCfg("labelSize", v)} />
              <SliderInput label="Tamaño Texto" value={cfg.textSize} min={10} max={20} onChange={(v) => updateCfg("textSize", v)} />
              <SliderInput label="Tamaño Título" value={cfg.titleSize} min={14} max={36} onChange={(v) => updateCfg("titleSize", v)} />
              <SliderInput label="Tamaño Subtítulo" value={cfg.subtitleSize} min={10} max={24} onChange={(v) => updateCfg("subtitleSize", v)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
              <SelectInput
                label="Estilo del Número"
                value={cfg.numberWeight}
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "bold", label: "Resaltado (Negrita)" },
                ]}
                onChange={(v) => updateCfg("numberWeight", v)}
              />
              <SelectInput
                label="Estilo de la Etiqueta"
                value={cfg.labelWeight}
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "bold", label: "Resaltado (Negrita)" },
                ]}
                onChange={(v) => updateCfg("labelWeight", v)}
              />
            </div>
          </div>

          {/* Espaciado y Bordes */}
          <div style={{ background: "#f9fafb", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>📐 Espaciados y Bordes</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <SliderInput label="Padding Contenedor" value={cfg.containerPadding} min={0} max={60} onChange={(v) => updateCfg("containerPadding", v)} />
              <SliderInput label="Padding Tarjeta" value={cfg.cardPadding} min={0} max={40} onChange={(v) => updateCfg("cardPadding", v)} />
            </div>
            <div style={{ marginTop: "12px" }}>
              <SliderInput label="Redondeo Contenedor" value={cfg.containerRadius} min={0} max={40} onChange={(v) => updateCfg("containerRadius", v)} />
            </div>
            <div style={{ marginTop: "14px" }}>
              <Toggle checked={cfg.showSeparator} onChange={(v) => updateCfg("showSeparator", v)} label="Mostrar línea separadora entre estadísticas" />
            </div>
          </div>
        </div>
      )}

      {/* 4. PESTAÑA FECHAS ESPECIALES */}
      {activeTab === "dates" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FieldLabel help="Aplica combinaciones de colores temáticas predefinidas para eventos comerciales.">
            Campaña activa
          </FieldLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {CAMPAIGN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyCampaignPreset(preset.id)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: cfg.campaignTheme === preset.id ? "2px solid #10b981" : "1px solid #e5e7eb",
                  background: cfg.campaignTheme === preset.id ? "#ecfdf5" : "#ffffff",
                  color: "#111827",
                  fontSize: "13px",
                  fontWeight: cfg.campaignTheme === preset.id ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BOTÓN GUARDAR */}
      <div style={{ paddingTop: "10px" }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background: "#10b981",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
            textAlign: "center",
          }}
        >
          {loading ? "Guardando..." : "Guardar widget"}
        </button>
      </div>
    </div>
  );
  }
