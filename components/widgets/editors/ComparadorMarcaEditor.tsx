"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface CompareItem {
  id: string;
  feature: string;
  us: boolean;
  others: boolean;
}

interface ComparadorMarcaEditorProps {
  widgetDefinition?: any;
  existingWidget?: any;
  storeId?: string | number;
  initialConfig?: any;
  widgetId?: string;
  targetType?: "product" | "all" | "category";
  targetProductId?: string | number | null;
  productId?: string | number | null;
  categoryId?: string | number | null;
  onSave?: (config: any) => Promise<void>;
  isSaving?: boolean;
}

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "black-friday": { bg: "#F59E0B", text: "#111827", border: "#D97706", accent: "#111827" },
  "hot-sale": { bg: "#EF4444", text: "#ffffff", border: "#B91C1C", accent: "#ffffff" },
  "cyber-monday": { bg: "#3B82F6", text: "#ffffff", border: "#1D4ED8", accent: "#ffffff" },
  "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857", accent: "#EF4444" },
  "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d", accent: "#F43F5E" },
  "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca", accent: "#10B981" },
  "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b", accent: "#FBBF24" },
};

const PRESET_LABELS: Record<string, string> = {
  "black-friday": "Black Friday",
  "hot-sale": "Hot Sale",
  "cyber-monday": "Cyber Monday",
  "navidad": "Navidad & Reyes",
  "san-valentin": "San Valentín",
  "dia-padre-madre": "Día Madre/Padre",
  "liquidacion": "Liquidación",
};

export default function ComparadorMarcaEditor({
  widgetDefinition,
  existingWidget,
  storeId,
  initialConfig,
  widgetId,
  targetType = "all",
  targetProductId,
  productId,
  categoryId,
  onSave,
  isSaving = false,
}: ComparadorMarcaEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  const cfg = initialConfig || existingWidget?.config || {};

  const defaultItems: CompareItem[] = [
    {
      id: "item-1",
      feature: "Alivia el dolor o molestia común al instante",
      us: true,
      others: false,
    },
    {
      id: "item-2",
      feature: "Solución efectiva y probada de larga duración",
      us: true,
      others: false,
    },
    {
      id: "item-3",
      feature: "Atención personalizada y envío garantizado en Argentina",
      us: true,
      others: false,
    },
    {
      id: "item-4",
      feature: "Garantía de satisfacción o devolución del dinero",
      us: true,
      others: true,
    },
  ];

  const [sectionTitle, setSectionTitle] = useState(cfg.sectionTitle || "Por qué elegirnos");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    cfg.sectionSubtitle || "Descubrí brevemente por qué nuestra marca es la mejor opción para vos."
  );

  const [brandUs, setBrandUs] = useState(cfg.brandUs || "Nosotros");
  const [brandUsLogo, setBrandUsLogo] = useState(cfg.brandUsLogo || "");
  const [brandOthers, setBrandOthers] = useState(cfg.brandOthers || "Otros");

  const [items, setItems] = useState<CompareItem[]>(
    Array.isArray(cfg.items) && cfg.items.length > 0 ? cfg.items : defaultItems
  );

  const [position, setPosition] = useState(cfg.position || "after-description");

  const [sectionBg, setSectionBg] = useState(cfg.sectionBg || "#fafafa");
  const [colUsBg, setColUsBg] = useState(cfg.colUsBg || "#242424");
  const [colUsText, setColUsText] = useState(cfg.colUsText || "#ffffff");
  const [othersText, setOthersText] = useState(cfg.othersText || "#aaaaaa");
  const [featureColor, setFeatureColor] = useState(cfg.featureColor || "#191919");
  const [borderColor, setBorderColor] = useState(cfg.borderColor || "#EFEFEF");

  const [h2Size, setH2Size] = useState(typeof cfg.h2Size === "number" ? cfg.h2Size : 22);
  const [h3Size, setH3Size] = useState(typeof cfg.h3Size === "number" ? cfg.h3Size : 18);
  const [textSize, setTextSize] = useState(typeof cfg.textSize === "number" ? cfg.textSize : 15);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || "none");
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType =
    targetType || existingWidget?.target_type || (categoryId ? "category" : productId ? "product" : "all");
  const isCategory = effectiveTargetType === "category" || !!categoryId;
  const isForAll = effectiveTargetType === "all";
  const scopeLabel = isForAll ? "Todos los productos" : isCategory ? "Categoría" : "Producto específico";

  const updateItem = function (id: string, field: string, val: any) {
    setItems(function (prev) {
      return prev.map(function (item) {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      });
    });
  };

  const handleLogoUpload = function (e: React.ChangeEvent<HTMLInputElement>) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("El logo supera los 2MB. Comprimilo antes de subirlo.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (evt) {
      var res = evt.target && evt.target.result;
      if (typeof res === "string") {
        setBrandUsLogo(res);
      }
    };
    reader.readAsDataURL(file);
  };

  const addItem = function () {
    if (items.length >= 10) {
      alert("Máximo 10 características.");
      return;
    }
    var newItem: CompareItem = {
      id: "item-" + Math.random().toString(36).substring(2, 7),
      feature: "Nueva característica o beneficio",
      us: true,
      others: false,
    };
    setItems(function (prev) {
      return [...prev, newItem];
    });
  };

  const removeItem = function (id: string) {
    if (items.length <= 1) {
      alert("Tenés que mantener al menos una característica.");
      return;
    }
    setItems(function (prev) {
      return prev.filter(function (item) {
        return item.id !== id;
      });
    });
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== "none" && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setColUsBg(th.bg);
      setColUsText(th.text);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme("none");
  };

  const handleSave = async function () {
    var configData = {
      sectionTitle: sectionTitle,
      sectionSubtitle: sectionSubtitle,
      brandUs: brandUs,
      brandUsLogo: brandUsLogo,
      brandOthers: brandOthers,
      items: items,
      position: position,
      sectionBg: sectionBg,
      colUsBg: colUsBg,
      colUsText: colUsText,
      othersText: othersText,
      featureColor: featureColor,
      borderColor: borderColor,
      h2Size: h2Size,
      h3Size: h3Size,
      textSize: textSize,
      campaignTheme: campaignTheme,
      ...(categoryId ? { category_id: String(categoryId) } : {}),
    };

    var finalTargetType = effectiveTargetType;
    var finalProductId = productId || targetProductId || existingWidget?.target_product_id || null;
    var finalCategoryId = categoryId || existingWidget?.target_category_id || null;

    if (onSave) {
      await onSave({
        config: configData,
        target_type: finalTargetType,
        target_product_id: finalProductId,
        target_category_id: finalCategoryId,
        is_active: isActive,
      });
      window.location.href = "/widgets";
      return;
    }

    setIsSavingInternal(true);
    try {
      var res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingWidget?.id || undefined,
          store_id: storeId ? String(storeId) : undefined,
          widget_slug: "comparador-marca",
          config: configData,
          is_active: isActive,
          target_type: finalTargetType,
          target_product_id: finalProductId ? String(finalProductId) : null,
          target_category_id: finalCategoryId ? String(finalCategoryId) : null,
        }),
      });

      if (!res.ok) {
        var errData = await res.json().catch(function () {
          return {};
        });
        throw new Error(errData.error || "Error al guardar el widget");
      }

      window.location.href = "/widgets";
    } catch (err: any) {
      alert("Error al guardar: " + (err.message || "Error desconocido"));
      setIsSavingInternal(false);
    }
  };

  const saving = isSaving || isSavingInternal;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* HEADER STICKY NEVUX */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #E5E7EB",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <NevuxLogo size="medium" />
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#111827",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 800,
          }}
        >
          RL
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: isCategory ? "#FEF3C7" : isForAll ? "#D1FAE5" : "#E0E7FF",
            color: isCategory ? "#D97706" : isForAll ? "#059669" : "#3730A3",
            border: "1px solid " + (isCategory ? "#FCD34D" : isForAll ? "#6EE7B7" : "#A5B4FC"),
          }}
        >
          {isCategory ? "🏷️" : isForAll ? "🏪" : "📦"} {scopeLabel}
        </span>
      </div>

      <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>
        Nuevo widget: Comparador de marca ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
      </h1>

      <div
        style={{
          backgroundColor: "#ECFDF5",
          border: "1px solid #10B981",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "#065F46",
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "18px" }}>⚖️</span>
        <div>
          <strong>Tabla comparativa de marca (Nosotros vs Competencia):</strong> Resaltá tus ventajas competitivas tocando el dolor del cliente, tu solución única y los motivos principales para comprar en tu tienda.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div
        style={{
          backgroundColor: sectionBg,
          border: "2px dashed #E5E7EB",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "#6B7280",
            textTransform: "uppercase",
            marginBottom: "12px",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          VISTA PREVIA EN VIVO
        </div>

        {(sectionTitle || sectionSubtitle) && (
          <div style={{ textAlign: "center", marginBottom: "20px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
            {sectionTitle ? (
              <div style={{ fontSize: h2Size + "px", fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: "6px" }}>
                {sectionTitle}
              </div>
            ) : null}
            {sectionSubtitle ? (
              <div style={{ fontSize: textSize + "px", color: "#6B7280", lineHeight: 1.4 }}>
                {sectionSubtitle}
              </div>
            ) : null}
          </div>
        )}

        <div style={{ maxWidth: "560px", margin: "0 auto", position: "relative", padding: "10px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr", alignItems: "center", gap: "8px" }}>
            <div />
            <div
              style={{
                backgroundColor: colUsBg,
                color: colUsText,
                borderRadius: "12px 12px 0 0",
                padding: "10px 8px",
                textAlign: "center",
                fontWeight: 800,
                fontSize: h3Size + "px",
                boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {brandUsLogo ? (
                <img src={brandUsLogo} alt="Logo" style={{ maxHeight: "24px", maxWidth: "80px", objectFit: "contain" }} />
              ) : null}
              <span>{brandUs || "Nosotros"}</span>
            </div>
            <div
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: h3Size + "px",
                color: othersText,
                padding: "10px 8px",
              }}
            >
              {brandOthers || "Otros"}
            </div>
          </div>

          {items.map(function (item, idx) {
            var isLast = idx === items.length - 1;
            return (
              <div
                key={item.id || idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1fr",
                  alignItems: "center",
                  gap: "8px",
                  borderBottom: "1px solid " + borderColor,
                }}
              >
                <div style={{ fontSize: textSize + "px", fontWeight: 600, color: featureColor, padding: "10px 8px" }}>
                  {item.feature || "Característica"}
                </div>

                <div
                  style={{
                    backgroundColor: colUsBg,
                    color: colUsText,
                    padding: "10px 8px",
                    textAlign: "center",
                    borderRadius: isLast ? "0 0 12px 12px" : "0",
                    boxShadow: isLast ? "0 4px 10px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {item.us ? (
                    <span style={{ display: "inline-flex", width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: colUsBg, alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900 }}>
                      ✓
                    </span>
                  ) : (
                    <span style={{ opacity: 0.4, fontSize: "14px" }}>✕</span>
                  )}
                </div>

                <div style={{ textAlign: "center", padding: "10px 8px" }}>
                  {item.others ? (
                    <span style={{ color: "#10B981", fontSize: "16px", fontWeight: 800 }}>✓</span>
                  ) : (
                    <span style={{ color: "#D1D5DB", fontSize: "16px", fontWeight: 800 }}>✕</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "⚖️ Contenido" },
          { id: "ubicacion", label: "📍 Ubicación" },
          { id: "estilos", label: "🎨 Estilos" },
          { id: "fechas", label: "🔥 Fechas Especiales" },
        ].map(function (tab) {
          var active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () {
                setActiveTab(tab.id);
              }}
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                background: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderBottom: active ? "3px solid #10B981" : "3px solid transparent",
                color: active ? "#10B981" : "#6B7280",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB GENERAL */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Título y subtítulo de la sección</div>
            
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Título principal
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={function (e) {
                  setSectionTitle(e.target.value);
                }}
                placeholder="Ej: Por qué elegirnos"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", fontWeight: 700, boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Subtítulo descriptivo
              </label>
              <textarea
                value={sectionSubtitle}
                onChange={function (e) {
                  setSectionSubtitle(e.target.value);
                }}
                placeholder="Ej: Descubrí las ventajas de comprar en nuestra tienda..."
                rows={2}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box", resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Nombres de marcas y logo</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Nombre de tu marca *
                </label>
                <input
                  type="text"
                  value={brandUs}
                  onChange={function (e) {
                    setBrandUs(e.target.value);
                  }}
                  placeholder="Ej: Nosotros, TuMarca..."
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", fontWeight: 700, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Texto para la competencia
                </label>
                <input
                  type="text"
                  value={brandOthers}
                  onChange={function (e) {
                    setBrandOthers(e.target.value);
                  }}
                  placeholder="Ej: Otros, Competencia..."
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Logo de tu marca (opcional)
              </label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {brandUsLogo ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src={brandUsLogo} alt="Logo" style={{ height: "36px", objectFit: "contain", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "2px" }} />
                    <button
                      type="button"
                      onClick={function () {
                        setBrandUsLogo("");
                      }}
                      style={{ fontSize: "12px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                    >
                      Quitar
                    </button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: "12px", flex: 1 }} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
              Items de comparación (Máximo 10)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
              {items.map(function (item, idx) {
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "#F9FAFB",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#6B7280", minWidth: "20px" }}>#{idx + 1}</span>
                    <input
                      type="text"
                      value={item.feature}
                      onChange={function (e) {
                        updateItem(item.id, "feature", e.target.value);
                      }}
                      placeholder="Escribí la característica..."
                      style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "#111827", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={item.us}
                        onChange={function (e) {
                          updateItem(item.id, "us", e.target.checked);
                        }}
                        style={{ accentColor: "#10B981" }}
                      />
                      {brandUs}
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "#6B7280", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={item.others}
                        onChange={function (e) {
                          updateItem(item.id, "others", e.target.checked);
                        }}
                        style={{ accentColor: "#6B7280" }}
                      />
                      {brandOthers}
                    </label>

                    <button
                      type="button"
                      onClick={function () {
                        removeItem(item.id);
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #FCA5A5",
                        backgroundColor: "#FEF2F2",
                        color: "#DC2626",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addItem}
              disabled={items.length >= 10}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "2px dashed #10B981",
                backgroundColor: items.length >= 10 ? "#F3F4F6" : "#ECFDF5",
                color: items.length >= 10 ? "#9CA3AF" : "#059669",
                fontSize: "13px",
                fontWeight: 800,
                cursor: items.length >= 10 ? "not-allowed" : "pointer",
              }}
            >
              + Agregar ítem de comparación {items.length >= 10 ? "(Máximo 10)" : ""}
            </button>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827",
              marginTop: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={isActive}
              onChange={function (e) {
                setIsActive(e.target.checked);
              }}
              style={{ width: "18px", height: "18px", accentColor: "#10B981" }}
            />
            Widget activo
          </label>
        </div>
      )}

      {/* TAB UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
            Posición del widget en la ficha de producto
          </div>

          <label
            style={{
              display: "block",
              padding: "14px 16px",
              borderRadius: "12px",
              border: position === "before-description" ? "2px solid #10B981" : "1px solid #E5E7EB",
              backgroundColor: position === "before-description" ? "#ECFDF5" : "#ffffff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="radio"
                name="pos"
                checked={position === "before-description"}
                onChange={function () {
                  setPosition("before-description");
                }}
                style={{ marginTop: "3px", accentColor: "#10B981" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Antes de la descripción</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>
                  El comparador aparece debajo del formulario del producto, dentro de la columna del producto.
                </div>
              </div>
            </div>
          </label>

          <label
            style={{
              display: "block",
              padding: "14px 16px",
              borderRadius: "12px",
              border: position === "after-description" ? "2px solid #10B981" : "1px solid #E5E7EB",
              backgroundColor: position === "after-description" ? "#ECFDF5" : "#ffffff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="radio"
                name="pos"
                checked={position === "after-description"}
                onChange={function () {
                  setPosition("after-description");
                }}
                style={{ marginTop: "3px", accentColor: "#10B981" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Después de la descripción (Recomendado)</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>
                  El comparador se muestra después de toda la sección del producto, a ancho completo.
                </div>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>Colores principales</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Personalizá los colores de fondo, columnas y textos.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                { label: "Color de fondo general", value: sectionBg, setter: setSectionBg },
                { label: "Color columna mi marca", value: colUsBg, setter: setColUsBg },
                { label: "Texto e íconos mi marca", value: colUsText, setter: setColUsText },
                { label: "Color \"Otros\"", value: othersText, setter: setOthersText },
                { label: "Color de características", value: featureColor, setter: setFeatureColor },
                { label: "Color de línea de borde", value: borderColor, setter: setBorderColor },
              ].map(function (item) {
                return (
                  <div key={item.label}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                      {item.label}
                    </label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={item.value.startsWith("#") ? item.value : "#ffffff"}
                        onChange={function (e) {
                          handleColorChange(item.setter, e.target.value);
                        }}
                        style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={function (e) {
                          handleColorChange(item.setter, e.target.value);
                        }}
                        style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>Tipografías</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Ajustá los tamaños de fuente del widget.</div>

            {[
              { label: "Tamaño título principal", value: h2Size, setter: setH2Size, min: 16, max: 32 },
              { label: "Tamaño títulos de marca", value: h3Size, setter: setH3Size, min: 14, max: 24 },
              { label: "Tamaño texto de características", value: textSize, setter: setTextSize, min: 12, max: 20 },
            ].map(function (item) {
              return (
                <div key={item.label} style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                    {item.label}: {item.value}px
                  </label>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={1}
                    value={item.value}
                    onChange={function (e) {
                      item.setter(parseInt(e.target.value, 10));
                    }}
                    style={{ width: "100%", accentColor: "#10B981" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === "fechas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: "#92400E" }}>
            🔥 Elegí un preset de campaña. Aplica colores llamativos a la columna de tu marca automáticamente.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              type="button"
              onClick={function () {
                applyPresetTheme("none");
                setColUsBg("#242424");
                setColUsText("#ffffff");
              }}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: campaignTheme === "none" ? "2px solid #10B981" : "1px solid #E5E7EB",
                backgroundColor: campaignTheme === "none" ? "#ECFDF5" : "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              ✨ Sin campaña (colores libres)
            </button>

            {Object.keys(CAMPAIGN_THEMES).map(function (key) {
              var th = CAMPAIGN_THEMES[key];
              var active = campaignTheme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={function () {
                    applyPresetTheme(key);
                  }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: active ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: th.bg,
                    color: th.text,
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{PRESET_LABELS[key] || key}</span>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: th.accent,
                      border: "2px solid rgba(255,255,255,0.5)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GUARDAR */}
      <div style={{ marginTop: "28px", borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            backgroundColor: "#10B981",
            color: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 800,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Guardando widget..." : "💾 Guardar Comparador de marca"}
        </button>
        <p style={{ fontSize: "12px", color: "#6B7280", textAlign: "center", marginTop: "10px" }}>
          Al guardar vas a volver a <strong>Mis Widgets</strong>
        </p>
      </div>

      <div style={{ marginTop: "28px" }}>
        <CentroAyuda />
      </div>
    </div>
  );
  }
