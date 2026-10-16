"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface AlertaInventarioEditorProps {
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

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string }> = {
  "black-friday": { bg: "#FFFBEB", text: "#D97706", border: "#F59E0B" },
  "hot-sale": { bg: "#FEF2F2", text: "#DC2626", border: "#EF4444" },
  "cyber-monday": { bg: "#EFF6FF", text: "#2563EB", border: "#3B82F6" },
  "navidad": { bg: "#ECFDF5", text: "#059669", border: "#10B981" },
  "san-valentin": { bg: "#FDF2F8", text: "#DB2777", border: "#EC4899" },
  "dia-padre-madre": { bg: "#F5F3FF", text: "#7C3AED", border: "#8B5CF6" },
  "liquidacion": { bg: "#FFF7ED", text: "#EA580C", border: "#F97316" },
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

const compressImage = function (file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      var img = new Image();
      img.src = typeof event.target?.result === "string" ? event.target.result : "";
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var width = img.width;
        var height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = function (err) { reject(err); };
    };
    reader.onerror = function (err) { reject(err); };
  });
};

const renderFormattedText = function (rawText: string, sampleQty: number = 3) {
  var txt = (rawText || "").replace(/{cantidad}/g, String(sampleQty));
  var parts = txt.split(/(\*\*.*?\*\*)/g);
  return parts.map(function (part, i) {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function AlertaInventarioEditor({
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
}: AlertaInventarioEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  const cfg = initialConfig || existingWidget?.config || {};

  const [mainText, setMainText] = useState(cfg.mainText || "Apurate, quedan {cantidad} disponibles");
  const [enableLastUnitMsg, setEnableLastUnitMsg] = useState(cfg.enableLastUnitMsg !== false);
  const [lastUnitText, setLastUnitText] = useState(cfg.lastUnitText || "¡No te la pierdas, es el último!");

  const [iconType, setIconType] = useState(cfg.iconType || "emoji"); // circulo, corazon, alerta, emoji, imagen, nada
  const [customEmoji, setCustomEmoji] = useState(cfg.customEmoji || "🔥");
  const [customImage, setCustomImage] = useState(cfg.customImage || "");

  const [stockThreshold, setStockThreshold] = useState(typeof cfg.stockThreshold === "number" ? cfg.stockThreshold : 5);

  const [position, setPosition] = useState(cfg.position || "above-cart"); // above-cart, before-desc

  const [bgColor, setBgColor] = useState(cfg.bgColor || "transparent");
  const [textColor, setTextColor] = useState(cfg.textColor || "#ef4444");

  const [fontSize, setFontSize] = useState(typeof cfg.fontSize === "number" ? cfg.fontSize : 15);
  const [textWeight, setTextWeight] = useState(cfg.textWeight || "bold"); // "normal" | "bold"

  const [animationEffect, setAnimationEffect] = useState(cfg.animationEffect || "zoom"); // aureola, zoom, none
  const [animationTarget, setAnimationTarget] = useState(cfg.animationTarget || "icon"); // icon, full

  const [borderRadius, setBorderRadius] = useState(typeof cfg.borderRadius === "number" ? cfg.borderRadius : 8);
  const [padding, setPadding] = useState(typeof cfg.padding === "number" ? cfg.padding : 8);
  const [marginTop, setMarginTop] = useState(typeof cfg.marginTop === "number" ? cfg.marginTop : 8);
  const [marginBottom, setMarginBottom] = useState(typeof cfg.marginBottom === "number" ? cfg.marginBottom : 12);

  const [showBorder, setShowBorder] = useState(!!cfg.showBorder);
  const [borderColor, setBorderColor] = useState(cfg.borderColor || "#fca5a5");

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || "none");
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? "category" : productId ? "product" : "all");
  const isCategory = effectiveTargetType === "category" || !!categoryId;
  const isForAll = effectiveTargetType === "all";
  const scopeLabel = isForAll ? "Todos los productos" : isCategory ? "Categoría" : "Producto específico";

  const handleImageUpload = async function (e: React.ChangeEvent<HTMLInputElement>) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      var base64 = await compressImage(file, 200, 0.85);
      setCustomImage(base64);
    } catch (err) {
      alert("Error al procesar la imagen.");
    }
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== "none" && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTextColor(th.text);
      setBorderColor(th.border);
      setShowBorder(true);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, val: string) {
    setter(val);
    setCampaignTheme("none");
  };

  const handleSave = async function () {
    if (!mainText.trim()) {
      alert("Ingresá un mensaje principal.");
      return;
    }

    var configData = {
      mainText: mainText,
      enableLastUnitMsg: enableLastUnitMsg,
      lastUnitText: lastUnitText,
      iconType: iconType,
      customEmoji: customEmoji,
      customImage: customImage,
      stockThreshold: stockThreshold,
      position: position,
      bgColor: bgColor,
      textColor: textColor,
      fontSize: fontSize,
      textWeight: textWeight,
      animationEffect: animationEffect,
      animationTarget: animationTarget,
      borderRadius: borderRadius,
      padding: padding,
      marginTop: marginTop,
      marginBottom: marginBottom,
      showBorder: showBorder,
      borderColor: borderColor,
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
          widget_slug: "alerta-inventario",
          config: configData,
          is_active: isActive,
          target_type: finalTargetType,
          target_product_id: finalProductId ? String(finalProductId) : null,
          target_category_id: finalCategoryId ? String(finalCategoryId) : null,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar el widget");
      window.location.href = "/widgets";
    } catch (err: any) {
      alert("Error al guardar: " + (err.message || "Error desconocido"));
      setIsSavingInternal(false);
    }
  };

  const saving = isSaving || isSavingInternal;

  var renderIcon = function () {
    if (iconType === "circulo") return "🟡";
    if (iconType === "corazon") return "❤️";
    if (iconType === "alerta") return "⚠️";
    if (iconType === "emoji") return customEmoji || "🔥";
    if (iconType === "imagen" && customImage) {
      return <img src={customImage} alt="" style={{ width: "20px", height: "20px", objectFit: "contain", verticalAlign: "middle" }} />;
    }
    return null;
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* HEADER STICKY */}
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

      {/* CHIP DE SEGMENTACIÓN */}
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
        Nuevo widget: Alerta de Inventario ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
      </h1>

      {/* INFO BOX */}
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
        <span style={{ fontSize: "18px" }}>🔥</span>
        <div>
          <strong>Alerta de inventario:</strong> El mensaje se mostrará automáticamente cuando queden pocas unidades del producto y se ocultará cuando haya stock suficiente o sea infinito.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div
        style={{
          backgroundColor: "#F9FAFB",
          border: "2px dashed #E5E7EB",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "120px",
        }}
      >
        <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "12px", fontWeight: 600 }}>
          Vista previa del mensaje de urgencia
        </div>

        <div
          style={{
            backgroundColor: bgColor === "transparent" ? "transparent" : bgColor,
            color: textColor,
            fontSize: fontSize + "px",
            fontWeight: textWeight === "bold" ? 700 : 400,
            borderRadius: borderRadius + "px",
            padding: padding + "px",
            marginTop: marginTop + "px",
            marginBottom: marginBottom + "px",
            border: showBorder ? "1px solid " + borderColor : "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
          }}
        >
          {renderIcon() && (
            <span
              style={{
                display: "inline-block",
                transform: animationEffect === "zoom" && animationTarget === "icon" ? "scale(1.1)" : "none",
              }}
            >
              {renderIcon()}
            </span>
          )}
          <span>{renderFormattedText(mainText, 3)}</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "⚙️ General" },
          { id: "ubicacion", label: "📍 Ubicación" },
          { id: "estilos", label: "🎨 Estilos" },
          { id: "fechas", label: "🔥 Campañas" },
        ].map(function (tab) {
          var active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () { setActiveTab(tab.id); }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* MENSAJE PRINCIPAL */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <label style={{ fontSize: "14px", fontWeight: 800, color: "#111827", display: "block", marginBottom: "8px" }}>
              Mensaje principal
            </label>
            <input
              type="text"
              value={mainText}
              onChange={function (e) { setMainText(e.target.value); }}
              placeholder="Ej: Apurate, quedan {cantidad} disponibles"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "14px", boxSizing: "border-box" }}
            />
            <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "6px", lineHeight: 1.4 }}>
              Usá <strong>{"{cantidad}"}</strong> para mostrar el número de unidades disponibles y <strong>**texto**</strong> para aplicar negrita.
            </p>
          </div>

          {/* MENSAJE ÚLTIMA UNIDAD */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "10px" }}>
              <input
                type="checkbox"
                checked={enableLastUnitMsg}
                onChange={function (e) { setEnableLastUnitMsg(e.target.checked); }}
                style={{ width: "18px", height: "18px", accentColor: "#10B981" }}
              />
              Mensaje para última unidad
            </label>

            {enableLastUnitMsg && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  value={lastUnitText}
                  onChange={function (e) { setLastUnitText(e.target.value); }}
                  placeholder="Ej: ¡No te la pierdas, es el último!"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "14px", boxSizing: "border-box" }}
                />
                <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "6px", lineHeight: 1.4 }}>
                  Se muestra en lugar del mensaje principal cuando queda exactamente 1 unidad. También podés usar <strong>**texto**</strong> para negrita.
                </p>
              </div>
            )}
          </div>

          {/* ÍCONO */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <label style={{ fontSize: "14px", fontWeight: 800, color: "#111827", display: "block", marginBottom: "12px" }}>
              Ícono
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
              {[
                { id: "circulo", label: "Círculo", icon: "🟡" },
                { id: "corazon", label: "Corazón", icon: "❤️" },
                { id: "alerta", label: "Alerta", icon: "⚠️" },
                { id: "emoji", label: "Emoji", icon: "🔥" },
                { id: "imagen", label: "Imagen", icon: "🖼️" },
                { id: "nada", label: "Nada", icon: "➖" },
              ].map(function (item) {
                var selected = iconType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={function () { setIconType(item.id); }}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: selected ? "2px solid #10B981" : "1px solid #E5E7EB",
                      backgroundColor: selected ? "#ECFDF5" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: selected ? "#059669" : "#374151" }}>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {iconType === "emoji" && (
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Tu emoji
                </label>
                <input
                  type="text"
                  value={customEmoji}
                  onChange={function (e) { setCustomEmoji(e.target.value); }}
                  placeholder="🔥"
                  style={{ width: "80px", padding: "10px", textAlign: "center", fontSize: "18px", borderRadius: "8px", border: "1px solid #D1D5DB" }}
                />
              </div>
            )}

            {iconType === "imagen" && (
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Subir imagen de ícono
                </label>
                {customImage && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <img src={customImage} alt="" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                    <button type="button" onClick={function () { setCustomImage(""); }} style={{ color: "#EF4444", fontSize: "12px", border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}>
                      Quitar
                    </button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "12px" }} />
              </div>
            )}
          </div>

          {/* UMBRAL DE STOCK */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <label style={{ fontSize: "14px", fontWeight: 800, color: "#111827", display: "block", marginBottom: "6px" }}>
              Umbral de stock: {stockThreshold} unidades
            </label>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={stockThreshold}
              onChange={function (e) { setStockThreshold(parseInt(e.target.value, 10)); }}
              style={{ width: "100%", accentColor: "#10B981" }}
            />
            <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "8px", lineHeight: 1.4 }}>
              El mensaje se mostrará cuando queden <strong>menos de {stockThreshold} unidades</strong> disponibles. Si el stock es ilimitado el widget no se muestra.
            </p>
          </div>
        </div>
      )}

      {/* TAB UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Posición del widget</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { id: "above-cart", title: "Por encima del formulario de compra", desc: "El mensaje aparece justo antes del botón 'Agregar al carrito'." },
                { id: "before-desc", title: "Antes de la descripción", desc: "El mensaje aparece justo debajo del formulario de compra, antes de la descripción del producto." },
              ].map(function (opt) {
                var selected = position === opt.id;
                return (
                  <label
                    key={opt.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      padding: "14px",
                      borderRadius: "10px",
                      border: selected ? "2px solid #10B981" : "1px solid #E5E7EB",
                      backgroundColor: selected ? "#ECFDF5" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="position"
                      checked={selected}
                      onChange={function () { setPosition(opt.id); }}
                      style={{ marginTop: "2px", accentColor: "#10B981", width: "16px", height: "16px" }}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#111827", marginBottom: "2px" }}>{opt.title}</div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* COLORES */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Colores</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Color de fondo
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={bgColor === "transparent" ? "#ffffff" : bgColor}
                    onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                    placeholder="transparent"
                    style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Color de texto
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={textColor.startsWith("#") ? textColor : "#ef4444"}
                    onChange={function (e) { handleColorChange(setTextColor, e.target.value); }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={function (e) { handleColorChange(setTextColor, e.target.value); }}
                    style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TIPOGRAFÍA */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Tipografía</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Tamaño de texto: {fontSize}px
                </label>
                <input
                  type="range"
                  min={11}
                  max={24}
                  step={1}
                  value={fontSize}
                  onChange={function (e) { setFontSize(parseInt(e.target.value, 10)); }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Estilo del texto
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={function () { setTextWeight("normal"); }}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      border: textWeight === "normal" ? "2px solid #10B981" : "1px solid #D1D5DB",
                      backgroundColor: textWeight === "normal" ? "#ECFDF5" : "#ffffff",
                      fontSize: "13px",
                      fontWeight: 400,
                      cursor: "pointer",
                    }}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={function () { setTextWeight("bold"); }}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      border: textWeight === "bold" ? "2px solid #10B981" : "1px solid #D1D5DB",
                      backgroundColor: textWeight === "bold" ? "#ECFDF5" : "#ffffff",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Resaltado
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ANIMACIÓN */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Animación</div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "8px" }}>
                Efecto
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {[
                  { id: "aureola", label: "Aureola pulsante" },
                  { id: "zoom", label: "Zoom" },
                  { id: "none", label: "Sin efecto" },
                ].map(function (opt) {
                  var sel = animationEffect === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={function () { setAnimationEffect(opt.id); }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: sel ? "2px solid #10B981" : "1px solid #D1D5DB",
                        backgroundColor: sel ? "#ECFDF5" : "#ffffff",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "8px" }}>
                Aplicar efecto a
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { id: "icon", label: "Sólo ícono" },
                  { id: "full", label: "Mensaje completo" },
                ].map(function (opt) {
                  var sel = animationTarget === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={function () { setAnimationTarget(opt.id); }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: sel ? "2px solid #10B981" : "1px solid #D1D5DB",
                        backgroundColor: sel ? "#ECFDF5" : "#ffffff",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONTENEDOR */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Contenedor y espaciado</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Bordes redondeados: {borderRadius}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={borderRadius}
                  onChange={function (e) { setBorderRadius(parseInt(e.target.value, 10)); }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Padding interno: {padding}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={padding}
                  onChange={function (e) { setPadding(parseInt(e.target.value, 10)); }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Margen superior: {marginTop}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={marginTop}
                  onChange={function (e) { setMarginTop(parseInt(e.target.value, 10)); }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Margen inferior: {marginBottom}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={marginBottom}
                  onChange={function (e) { setMarginBottom(parseInt(e.target.value, 10)); }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #E5E7EB" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                <input
                  type="checkbox"
                  checked={showBorder}
                  onChange={function (e) { setShowBorder(e.target.checked); }}
                  style={{ width: "16px", height: "16px", accentColor: "#10B981" }}
                />
                Mostrar borde (1px)
              </label>

              {showBorder && (
                <div style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={borderColor}
                    onChange={function (e) { setBorderColor(e.target.value); }}
                    style={{ width: "36px", height: "34px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={function (e) { setBorderColor(e.target.value); }}
                    style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === "fechas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: "#92400E" }}>
            🔥 Elegí un preset de campaña para adaptar automáticamente los colores de fondo, texto y borde.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              type="button"
              onClick={function () { applyPresetTheme("none"); }}
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
                  onClick={function () { applyPresetTheme(key); }}
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
                  <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: th.border }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GUARDAR */}
      <div style={{ marginTop: "28px", borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          <input
            type="checkbox"
            checked={isActive}
            onChange={function (e) { setIsActive(e.target.checked); }}
            style={{ width: "18px", height: "18px", accentColor: "#10B981" }}
          />
          Widget activo
        </label>

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
          {saving ? "Guardando..." : "💾 Guardar Alerta de Inventario"}
        </button>
      </div>

      <div style={{ marginTop: "28px" }}>
        <CentroAyuda />
      </div>
    </div>
  );
  }
