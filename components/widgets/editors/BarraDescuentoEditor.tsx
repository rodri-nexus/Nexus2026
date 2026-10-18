"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface BarraDescuentoEditorProps {
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

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; cupon: string; cuponText: string; contador: string; aclaracion: string }> = {
  "black-friday": { bg: "#111827", text: "#F59E0B", cupon: "#F59E0B", cuponText: "#111827", contador: "#D97706", aclaracion: "#9CA3AF" },
  "hot-sale": { bg: "#B91C1C", text: "#ffffff", cupon: "#ffffff", cuponText: "#B91C1C", contador: "#EF4444", aclaracion: "#FECACA" },
  "cyber-monday": { bg: "#1E40AF", text: "#ffffff", cupon: "#ffffff", cuponText: "#1E40AF", contador: "#3B82F6", aclaracion: "#BFDBFE" },
  "navidad": { bg: "#064E3B", text: "#ffffff", cupon: "#ffffff", cuponText: "#064E3B", contador: "#10B981", aclaracion: "#A7F3D0" },
  "san-valentin": { bg: "#831843", text: "#ffffff", cupon: "#ffffff", cuponText: "#831843", contador: "#EC4899", aclaracion: "#FBCFE8" },
  "dia-padre-madre": { bg: "#312E81", text: "#ffffff", cupon: "#ffffff", cuponText: "#312E81", contador: "#6366F1", aclaracion: "#C7D2FE" },
  "liquidacion": { bg: "#7F1D1D", text: "#ffffff", cupon: "#FBBF24", cuponText: "#7F1D1D", contador: "#EF4444", aclaracion: "#FCA5A5" },
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

export default function BarraDescuentoEditor({
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
}: BarraDescuentoEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  const cfg = initialConfig || existingWidget?.config || {};

  // GENERAL
  const [textoBarra, setTextoBarra] = useState(cfg.textoBarra || "15% OFF en toda la tienda con el código");
  const [codigoCupon, setCodigoCupon] = useState(cfg.codigoCupon || "DESCUENTO15");
  const [textoAclaracion, setTextoAclaracion] = useState(cfg.textoAclaracion || "Válido solo por hoy. No acumulable con otras promociones.");
  const [mostrarContador, setMostrarContador] = useState(cfg.mostrarContador !== false);
  const [horasContador, setHorasContador] = useState<any>(typeof cfg.horasContador === "number" ? cfg.horasContador : 2);
  const [minutosContador, setMinutosContador] = useState<any>(typeof cfg.minutosContador === "number" ? cfg.minutosContador : 30);

  // UBICACIÓN
  const [posicion, setPosicion] = useState(cfg.posicion || "top");
  const [mostrarCerrar, setMostrarCerrar] = useState(cfg.mostrarCerrar !== false);

  // ESTILOS - FONDO BARRA
  const [colorFondo, setColorFondo] = useState(cfg.colorFondo || "#1e1e1e");
  const [paddingVertical, setPaddingVertical] = useState(typeof cfg.paddingVertical === "number" ? cfg.paddingVertical : 10);

  // ESTILOS - TEXTOS
  const [colorTexto, setColorTexto] = useState(cfg.colorTexto || "#ffffff");
  const [tamanoTexto, setTamanoTexto] = useState(typeof cfg.tamanoTexto === "number" ? cfg.tamanoTexto : 14);
  const [colorAclaracion, setColorAclaracion] = useState(cfg.colorAclaracion || "#cccccc");
  const [tamanoAclaracion, setTamanoAclaracion] = useState(typeof cfg.tamanoAclaracion === "number" ? cfg.tamanoAclaracion : 11);

  // ESTILOS - CUPÓN
  const [fondoCupon, setFondoCupon] = useState(cfg.fondoCupon || "#ffffff");
  const [textoCuponColor, setTextoCuponColor] = useState(cfg.textoCuponColor || "#1e1e1e");
  const [tamanoCodigo, setTamanoCodigo] = useState(typeof cfg.tamanoCodigo === "number" ? cfg.tamanoCodigo : 14);
  const [bordeRedondeadoCupon, setBordeRedondeadoCupon] = useState(typeof cfg.bordeRedondeadoCupon === "number" ? cfg.bordeRedondeadoCupon : 6);
  const [estiloBordeCupon, setEstiloBordeCupon] = useState(cfg.estiloBordeCupon || "dashed");

  // ESTILOS - CONTADOR
  const [fondoContador, setFondoContador] = useState(cfg.fondoContador || "#ef4444");
  const [textoContadorColor, setTextoContadorColor] = useState(cfg.textoContadorColor || "#ffffff");
  const [tamanoContador, setTamanoContador] = useState(typeof cfg.tamanoContador === "number" ? cfg.tamanoContador : 14);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || "none");
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType =
    targetType || existingWidget?.target_type || (categoryId ? "category" : productId ? "product" : "all");
  const isCategory = effectiveTargetType === "category" || !!categoryId;
  const isForAll = effectiveTargetType === "all";
  const scopeLabel = isForAll ? "Todos los productos" : isCategory ? "Categoría" : "Producto específico";

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== "none" && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setColorFondo(th.bg);
      setColorTexto(th.text);
      setFondoCupon(th.cupon);
      setTextoCuponColor(th.cuponText);
      setFondoContador(th.contador);
      setColorAclaracion(th.aclaracion);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme("none");
  };

  const handleSave = async function () {
    var configData = {
      textoBarra: textoBarra,
      codigoCupon: codigoCupon,
      textoAclaracion: textoAclaracion,
      mostrarContador: mostrarContador,
      horasContador: parseInt(String(horasContador), 10) || 0,
      minutosContador: parseInt(String(minutosContador), 10) || 0,
      posicion: posicion,
      mostrarCerrar: mostrarCerrar,
      colorFondo: colorFondo,
      paddingVertical: paddingVertical,
      colorTexto: colorTexto,
      tamanoTexto: tamanoTexto,
      colorAclaracion: colorAclaracion,
      tamanoAclaracion: tamanoAclaracion,
      fondoCupon: fondoCupon,
      textoCuponColor: textoCuponColor,
      tamanoCodigo: tamanoCodigo,
      bordeRedondeadoCupon: bordeRedondeadoCupon,
      estiloBordeCupon: estiloBordeCupon,
      fondoContador: fondoContador,
      textoContadorColor: textoContadorColor,
      tamanoContador: tamanoContador,
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
          widget_slug: "barra-descuento",
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

  const borderCuponCss =
    estiloBordeCupon === "none"
      ? "none"
      : estiloBordeCupon === "dashed"
      ? "2px dashed rgba(0,0,0,0.25)"
      : "2px solid rgba(0,0,0,0.25)";

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
        Nuevo widget: Barra de descuento ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
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
        <span style={{ fontSize: "18px" }}>🎟️</span>
        <div>
          <strong>Barra fija de cupón:</strong> Mostrá un código de descuento siempre visible arriba o abajo de la pantalla. Al hacer clic sobre el código, el visitante lo copia al portapapeles automáticamente.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
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
          VISTA PREVIA DE LA BARRA ({posicion === "top" ? "Fija Superior" : "Fija Inferior"})
        </div>

        <div
          style={{
            backgroundColor: colorFondo,
            color: colorTexto,
            padding: paddingVertical + "px 16px",
            borderRadius: "10px",
            textAlign: "center",
            position: "relative",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
          }}
        >
          {mostrarCerrar ? (
            <button
              type="button"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: colorTexto,
                fontSize: "16px",
                cursor: "pointer",
                opacity: 0.7,
              }}
            >
              ✕
            </button>
          ) : null}

          <div style={{ fontSize: tamanoTexto + "px", fontWeight: 700, marginBottom: "8px", paddingRight: mostrarCerrar ? "22px" : "0" }}>
            {textoBarra}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: textoAclaracion ? "8px" : "0",
            }}
          >
            <div
              style={{
                backgroundColor: fondoCupon,
                color: textoCuponColor,
                fontSize: tamanoCodigo + "px",
                fontWeight: 800,
                padding: "6px 14px",
                borderRadius: bordeRedondeadoCupon + "px",
                border: borderCuponCss,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <span style={{ letterSpacing: "1px" }}>{codigoCupon}</span>
              <span style={{ fontSize: "14px" }}>📋</span>
            </div>

            {mostrarContador ? (
              <div
                style={{
                  backgroundColor: fondoContador,
                  color: textoContadorColor,
                  fontSize: tamanoContador + "px",
                  fontWeight: 800,
                  padding: "6px 12px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                ⏱️ {String(horasContador || 0).padStart(2, "0")}:{String(minutosContador || 0).padStart(2, "0")}:45
              </div>
            ) : null}
          </div>

          {textoAclaracion ? (
            <div style={{ fontSize: tamanoAclaracion + "px", color: colorAclaracion, opacity: 0.95 }}>
              {textoAclaracion}
            </div>
          ) : null}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "📝 General" },
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
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Contenido principal</div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Texto de la barra *
              </label>
              <input
                type="text"
                value={textoBarra}
                onChange={function (e) {
                  setTextoBarra(e.target.value);
                }}
                placeholder="Ej: 15% OFF en toda la tienda con el código"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", fontWeight: 700, boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Código del cupón *
              </label>
              <input
                type="text"
                value={codigoCupon}
                onChange={function (e) {
                  setCodigoCupon(e.target.value.toUpperCase());
                }}
                placeholder="DESCUENTO15"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "14px", fontWeight: 800, letterSpacing: "1px", boxSizing: "border-box" }}
              />
            </div>

            <div
              style={{
                backgroundColor: "#FFFBEB",
                border: "1px solid #FCD34D",
                borderRadius: "8px",
                padding: "10px 14px",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginBottom: "14px",
              }}
            >
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <div style={{ fontSize: "12px", color: "#92400E", lineHeight: 1.5 }}>
                <strong>Este cupón no se crea automáticamente.</strong> Tenés que crearlo en el panel de Tiendanube, en <strong>Descuentos → Cupones</strong>, usando exactamente el mismo código.
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "12px" }}>
              Al hacer clic sobre el código, el visitante lo copia al portapapeles.
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Texto de aclaración (opcional)
              </label>
              <input
                type="text"
                value={textoAclaracion}
                onChange={function (e) {
                  setTextoAclaracion(e.target.value);
                }}
                placeholder="Ej: Válido solo por hoy. No acumulable con otras promociones."
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>
                Se muestra en letra chica debajo del texto principal.
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                marginBottom: mostrarContador ? "14px" : "0",
              }}
            >
              <input
                type="checkbox"
                checked={mostrarContador}
                onChange={function (e) {
                  setMostrarContador(e.target.checked);
                }}
                style={{ width: "18px", height: "18px", accentColor: "#10B981", marginTop: "2px" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Mostrar contador regresivo</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                  Suma urgencia mostrando cuánto tiempo queda para aprovechar el cupón.
                </div>
              </div>
            </label>

            {mostrarContador ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", backgroundColor: "#F9FAFB", padding: "14px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Horas del contador
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={72}
                    value={horasContador}
                    onChange={function (e) {
                      var val = e.target.value;
                      if (val === "") {
                        setHorasContador("");
                      } else {
                        setHorasContador(parseInt(val, 10));
                      }
                    }}
                    style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Minutos del contador
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={minutosContador}
                    onChange={function (e) {
                      var val = e.target.value;
                      if (val === "") {
                        setMinutosContador("");
                      } else {
                        setMinutosContador(parseInt(val, 10));
                      }
                    }}
                    style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            ) : null}
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
            Posición de la barra
          </div>

          <label
            style={{
              display: "block",
              padding: "14px 16px",
              borderRadius: "12px",
              border: posicion === "top" ? "2px solid #10B981" : "1px solid #E5E7EB",
              backgroundColor: posicion === "top" ? "#ECFDF5" : "#ffffff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="radio"
                name="pos"
                checked={posicion === "top"}
                onChange={function () {
                  setPosicion("top");
                }}
                style={{ marginTop: "3px", accentColor: "#10B981" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>⬆️ Parte superior de la pantalla</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>
                  La barra queda fija arriba, siempre visible mientras el visitante navega.
                </div>
              </div>
            </div>
          </label>

          <label
            style={{
              display: "block",
              padding: "14px 16px",
              borderRadius: "12px",
              border: posicion === "bottom" ? "2px solid #10B981" : "1px solid #E5E7EB",
              backgroundColor: posicion === "bottom" ? "#ECFDF5" : "#ffffff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="radio"
                name="pos"
                checked={posicion === "bottom"}
                onChange={function () {
                  setPosicion("bottom");
                }}
                style={{ marginTop: "3px", accentColor: "#10B981" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>⬇️ Parte inferior de la pantalla</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>
                  La barra queda fija abajo, siempre visible mientras el visitante navega.
                </div>
              </div>
            </div>
          </label>

          <label
            style={{
              display: "block",
              padding: "14px 16px",
              borderRadius: "12px",
              border: mostrarCerrar ? "2px solid #10B981" : "1px solid #E5E7EB",
              backgroundColor: mostrarCerrar ? "#ECFDF5" : "#ffffff",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="checkbox"
                checked={mostrarCerrar}
                onChange={function (e) {
                  setMostrarCerrar(e.target.checked);
                }}
                style={{ marginTop: "3px", accentColor: "#10B981" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Mostrar botón "✕" para cerrar</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>
                  Si el visitante la cierra, no vuelve a verla en esa navegación.
                </div>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* FONDO DE LA BARRA */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>🎨 Fondo de la barra</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Elegí el color de fondo y el espaciado de la barra.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Color de fondo
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={colorFondo.startsWith("#") ? colorFondo : "#1e1e1e"}
                    onChange={function (e) {
                      handleColorChange(setColorFondo, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={colorFondo}
                    onChange={function (e) {
                      handleColorChange(setColorFondo, e.target.value);
                    }}
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Espaciado interior: {paddingVertical}px
              </label>
              <input
                type="range"
                min={4}
                max={30}
                step={1}
                value={paddingVertical}
                onChange={function (e) {
                  setPaddingVertical(parseInt(e.target.value, 10));
                }}
                style={{ width: "100%", accentColor: "#10B981" }}
              />
            </div>
          </div>

          {/* TEXTOS */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>📝 Textos</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Color y tamaño del texto principal y de la aclaración.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Color del texto
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={colorTexto.startsWith("#") ? colorTexto : "#ffffff"}
                    onChange={function (e) {
                      handleColorChange(setColorTexto, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={colorTexto}
                    onChange={function (e) {
                      handleColorChange(setColorTexto, e.target.value);
                    }}
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Tamaño del texto: {tamanoTexto}px
                </label>
                <input
                  type="range"
                  min={11}
                  max={22}
                  step={1}
                  value={tamanoTexto}
                  onChange={function (e) {
                    setTamanoTexto(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Color de la aclaración
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={colorAclaracion.startsWith("#") ? colorAclaracion : "#cccccc"}
                    onChange={function (e) {
                      handleColorChange(setColorAclaracion, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={colorAclaracion}
                    onChange={function (e) {
                      handleColorChange(setColorAclaracion, e.target.value);
                    }}
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Tamaño de la aclaración: {tamanoAclaracion}px
                </label>
                <input
                  type="range"
                  min={9}
                  max={16}
                  step={1}
                  value={tamanoAclaracion}
                  onChange={function (e) {
                    setTamanoAclaracion(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
            </div>
          </div>

          {/* CUPÓN */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>🎟️ Cupón</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Apariencia del recuadro con el código de descuento.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Fondo del cupón
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={fondoCupon.startsWith("#") ? fondoCupon : "#ffffff"}
                    onChange={function (e) {
                      handleColorChange(setFondoCupon, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={fondoCupon}
                    onChange={function (e) {
                      handleColorChange(setFondoCupon, e.target.value);
                    }}
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Texto del cupón
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={textoCuponColor.startsWith("#") ? textoCuponColor : "#1e1e1e"}
                    onChange={function (e) {
                      handleColorChange(setTextoCuponColor, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={textoCuponColor}
                    onChange={function (e) {
                      handleColorChange(setTextoCuponColor, e.target.value);
                    }}
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Tamaño del código: {tamanoCodigo}px
              </label>
              <input
                type="range"
                min={11}
                max={24}
                step={1}
                value={tamanoCodigo}
                onChange={function (e) {
                  setTamanoCodigo(parseInt(e.target.value, 10));
                }}
                style={{ width: "100%", accentColor: "#10B981" }}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Borde redondeado: {bordeRedondeadoCupon}px
              </label>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={bordeRedondeadoCupon}
                onChange={function (e) {
                  setBordeRedondeadoCupon(parseInt(e.target.value, 10));
                }}
                style={{ width: "100%", accentColor: "#10B981" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "8px" }}>
                Estilo del borde
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["dashed", "solid", "none"].map(function (opt) {
                  var active = estiloBordeCupon === opt;
                  var label = opt === "dashed" ? "Punteado" : opt === "solid" ? "Sólido" : "Sin borde";
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={function () {
                        setEstiloBordeCupon(opt);
                      }}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: active ? "2px solid #10B981" : "1px solid #D1D5DB",
                        backgroundColor: active ? "#ECFDF5" : "#ffffff",
                        color: active ? "#059669" : "#374151",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONTADOR */}
          {mostrarContador ? (
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>⏱️ Contador</div>
              <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Solo se aplica si activaste el contador regresivo.</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Fondo del contador
                  </label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={fondoContador.startsWith("#") ? fondoContador : "#ef4444"}
                      onChange={function (e) {
                        handleColorChange(setFondoContador, e.target.value);
                      }}
                      style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                    />
                    <input
                      type="text"
                      value={fondoContador}
                      onChange={function (e) {
                        handleColorChange(setFondoContador, e.target.value);
                      }}
                      style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Texto del contador
                  </label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={textoContadorColor.startsWith("#") ? textoContadorColor : "#ffffff"}
                      onChange={function (e) {
                        handleColorChange(setTextoContadorColor, e.target.value);
                      }}
                      style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                    />
                    <input
                      type="text"
                      value={textoContadorColor}
                      onChange={function (e) {
                        handleColorChange(setTextoContadorColor, e.target.value);
                      }}
                      style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Tamaño del contador: {tamanoContador}px
                  </label>
                  <input
                    type="range"
                    min={11}
                    max={22}
                    step={1}
                    value={tamanoContador}
                    onChange={function (e) {
                      setTamanoContador(parseInt(e.target.value, 10));
                    }}
                    style={{ width: "100%", accentColor: "#10B981" }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === "fechas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: "#92400E" }}>
            🔥 Elegí un preset de campaña. Aplica colores llamativos y combinaciones de alta conversión automáticamente.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              type="button"
              onClick={function () {
                applyPresetTheme("none");
                setColorFondo("#1e1e1e");
                setColorTexto("#ffffff");
                setFondoCupon("#ffffff");
                setTextoCuponColor("#1e1e1e");
                setFondoContador("#ef4444");
                setColorAclaracion("#cccccc");
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
                      backgroundColor: th.cupon,
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
          {saving ? "Guardando widget..." : "💾 Guardar Barra de descuento"}
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
