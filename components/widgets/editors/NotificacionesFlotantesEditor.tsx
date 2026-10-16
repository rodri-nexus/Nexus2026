"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface NotifItem {
  id: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  btnText: string;
  btnUrl: string;
}

interface NotificacionesFlotantesEditorProps {
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

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; accent: string; sub: string }> = {
  "black-friday": { bg: "#F59E0B", text: "#111827", border: "#D97706", accent: "#111827", sub: "#374151" },
  "hot-sale": { bg: "#EF4444", text: "#ffffff", border: "#B91C1C", accent: "#111827", sub: "#FEE2E2" },
  "cyber-monday": { bg: "#3B82F6", text: "#ffffff", border: "#1D4ED8", accent: "#111827", sub: "#DBEAFE" },
  "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857", accent: "#EF4444", sub: "#A7F3D0" },
  "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d", accent: "#F43F5E", sub: "#FBCFE8" },
  "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca", accent: "#10B981", sub: "#C7D2FE" },
  "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b", accent: "#FBBF24", sub: "#FECACA" },
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

const POSITION_OPTIONS = [
  { id: "bottom-right", label: "Esquina inferior derecha", desc: "Las notificaciones aparecen en la esquina inferior derecha de la pantalla." },
  { id: "bottom-left", label: "Esquina inferior izquierda", desc: "Las notificaciones aparecen en la esquina inferior izquierda de la pantalla." },
  { id: "top-right", label: "Esquina superior derecha", desc: "Las notificaciones aparecen en la esquina superior derecha de la pantalla." },
  { id: "top-left", label: "Esquina superior izquierda", desc: "Las notificaciones aparecen en la esquina superior izquierda de la pantalla." },
  { id: "center-left", label: "Al centro a la izquierda", desc: "Las notificaciones aparecen centradas verticalmente sobre el lado izquierdo de la pantalla." },
  { id: "center-right", label: "Al centro a la derecha", desc: "Las notificaciones aparecen centradas verticalmente sobre el lado derecho de la pantalla." },
];

const FREQUENCY_OPTIONS = [
  { id: "once-visit", label: "Una vez por visita", desc: "Se muestra una vez por sesión. Si el visitante cierra la pestaña y vuelve a entrar, las notificaciones aparecen de nuevo." },
  { id: "once-device", label: "Una única vez", desc: "Se muestra una sola vez por dispositivo. Si el visitante cierra y vuelve días después, ya no las verá." },
  { id: "always", label: "Siempre", desc: "Sin restricciones. Las notificaciones se muestran cada vez que el visitante navega por cualquier página." },
];

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
      img.onerror = function (err) {
        reject(err);
      };
    };
    reader.onerror = function (err) {
      reject(err);
    };
  });
};

export default function NotificacionesFlotantesEditor({
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
}: NotificacionesFlotantesEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  const cfg = initialConfig || existingWidget?.config || {};

  const defaultNotifs: NotifItem[] = [
    {
      id: "n1",
      title: "¡Oferta especial! 🎉",
      subtitle: "",
      text: "Comprá hoy y obtené un 20% de descuento en tu primera compra.",
      image: "",
      btnText: "Ver oferta",
      btnUrl: "",
    },
  ];

  const [notifications, setNotifications] = useState(
    Array.isArray(cfg.notifications) && cfg.notifications.length > 0 ? cfg.notifications : defaultNotifs
  );
  const [expandedId, setExpandedId] = useState(
    (Array.isArray(cfg.notifications) && cfg.notifications[0] && cfg.notifications[0].id) || "n1"
  );

  const [frequency, setFrequency] = useState(cfg.frequency || "once-visit");
  const [position, setPosition] = useState(cfg.position || "bottom-right");

  const [bgColor, setBgColor] = useState(cfg.bgColor || "#ffffff");
  const [titleColor, setTitleColor] = useState(cfg.titleColor || "#111111");
  const [subtitleColor, setSubtitleColor] = useState(cfg.subtitleColor || "#666666");
  const [textColor, setTextColor] = useState(cfg.textColor || "#444444");
  const [btnBg, setBtnBg] = useState(cfg.btnBg || "#333333");
  const [btnTextColor, setBtnTextColor] = useState(cfg.btnTextColor || "#ffffff");
  const [borderLeftColor, setBorderLeftColor] = useState(cfg.borderLeftColor || "");

  const [titleSize, setTitleSize] = useState(typeof cfg.titleSize === "number" ? cfg.titleSize : 14);
  const [subtitleSize, setSubtitleSize] = useState(typeof cfg.subtitleSize === "number" ? cfg.subtitleSize : 12);
  const [textSize, setTextSize] = useState(typeof cfg.textSize === "number" ? cfg.textSize : 13);
  const [btnSize, setBtnSize] = useState(typeof cfg.btnSize === "number" ? cfg.btnSize : 12);

  const [btnBorderRadius, setBtnBorderRadius] = useState(typeof cfg.btnBorderRadius === "number" ? cfg.btnBorderRadius : 6);
  const [delayFirst, setDelayFirst] = useState(typeof cfg.delayFirst === "number" ? cfg.delayFirst : 0);
  const [intervalSec, setIntervalSec] = useState(typeof cfg.intervalSec === "number" ? cfg.intervalSec : 5);
  const [autoClose, setAutoClose] = useState(typeof cfg.autoClose === "number" ? cfg.autoClose : 5);
  const [borderRadius, setBorderRadius] = useState(typeof cfg.borderRadius === "number" ? cfg.borderRadius : 12);
  const [padding, setPadding] = useState(typeof cfg.padding === "number" ? cfg.padding : 16);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || "none");
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);
  const [isSavingInternal, setIsSavingInternal] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? "category" : productId ? "product" : "all");
  const isCategory = effectiveTargetType === "category" || !!categoryId;
  const isForAll = effectiveTargetType === "all";
  const scopeLabel = isForAll ? "Todos los productos" : isCategory ? "Categoría" : "Producto específico";

  const currentPreview = notifications[previewIdx] || notifications[0] || defaultNotifs[0];

  const addNotification = function () {
    if (notifications.length >= 10) {
      alert("Máximo 10 notificaciones permitidas.");
      return;
    }
    var newId = "n-" + Math.random().toString(36).substring(2, 7);
    setNotifications(function (prev: NotifItem[]) {
      return prev.concat([
        {
          id: newId,
          title: "Nueva notificación",
          subtitle: "",
          text: "Texto de la notificación.",
          image: "",
          btnText: "",
          btnUrl: "",
        },
      ]);
    });
    setExpandedId(newId);
  };

  const updateNotification = function (id: string, field: string, value: string) {
    setNotifications(function (prev: NotifItem[]) {
      return prev.map(function (n: NotifItem) {
        if (n.id === id) {
          var copy: any = {};
          for (var k in n) {
            if (Object.prototype.hasOwnProperty.call(n, k)) copy[k] = (n as any)[k];
          }
          copy[field] = value;
          return copy;
        }
        return n;
      });
    });
  };

  const removeNotification = function (id: string) {
    if (notifications.length <= 1) {
      alert("Debe quedar al menos 1 notificación.");
      return;
    }
    setNotifications(function (prev: NotifItem[]) {
      return prev.filter(function (n: NotifItem) {
        return n.id !== id;
      });
    });
    if (expandedId === id) {
      setExpandedId(notifications[0] && notifications[0].id !== id ? notifications[0].id : (notifications[1] && notifications[1].id) || "");
    }
  };

  const handleNotifImage = async function (id: string, e: React.ChangeEvent<HTMLInputElement>) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      var base64 = await compressImage(file, 400, 0.85);
      updateNotification(id, "image", base64);
    } catch (err) {
      alert("Error al procesar la imagen. Intentá con otra.");
    }
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== "none" && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTitleColor(th.text);
      setSubtitleColor(th.sub);
      setTextColor(th.text);
      setBtnBg(th.accent);
      setBtnTextColor(th.bg === "#F59E0B" ? "#111827" : "#ffffff");
      setBorderLeftColor(th.border);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme("none");
  };

  const handleSave = async function () {
    var valid = notifications.filter(function (n: NotifItem) {
      return n.title && n.title.trim() && n.text && n.text.trim();
    });
    if (valid.length === 0) {
      alert("Agregá al menos 1 notificación con título y texto.");
      return;
    }

    var configData = {
      notifications: notifications,
      frequency: frequency,
      position: position,
      bgColor: bgColor,
      titleColor: titleColor,
      subtitleColor: subtitleColor,
      textColor: textColor,
      btnBg: btnBg,
      btnTextColor: btnTextColor,
      borderLeftColor: borderLeftColor,
      titleSize: titleSize,
      subtitleSize: subtitleSize,
      textSize: textSize,
      btnSize: btnSize,
      btnBorderRadius: btnBorderRadius,
      delayFirst: delayFirst,
      intervalSec: intervalSec,
      autoClose: autoClose,
      borderRadius: borderRadius,
      padding: padding,
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
          widget_slug: "notificaciones-flotantes",
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

  var previewPosStyle: any = {
    position: "absolute",
    maxWidth: "320px",
    width: "90%",
  };
  if (position === "bottom-right") {
    previewPosStyle.bottom = "16px";
    previewPosStyle.right = "16px";
  } else if (position === "bottom-left") {
    previewPosStyle.bottom = "16px";
    previewPosStyle.left = "16px";
  } else if (position === "top-right") {
    previewPosStyle.top = "16px";
    previewPosStyle.right = "16px";
  } else if (position === "top-left") {
    previewPosStyle.top = "16px";
    previewPosStyle.left = "16px";
  } else if (position === "center-left") {
    previewPosStyle.top = "50%";
    previewPosStyle.left = "16px";
    previewPosStyle.transform = "translateY(-50%)";
  } else {
    previewPosStyle.top = "50%";
    previewPosStyle.right = "16px";
    previewPosStyle.transform = "translateY(-50%)";
  }

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
        Nuevo widget: Notificaciones Flotantes ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
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
        <span style={{ fontSize: "18px" }}>🔔</span>
        <div>
          <strong>Notificaciones flotantes:</strong> Mostrá mensajes en cadena en una esquina de la pantalla (ofertas, avisos, CTAs) con el intervalo y la frecuencia que elijas.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div
        style={{
          backgroundColor: "#F3F4F6",
          border: "2px dashed #E5E7EB",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "16px",
          position: "relative",
          minHeight: "280px",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginBottom: "8px", fontWeight: 600 }}>
          Vista previa de la notificación
        </div>

        <div
          style={Object.assign({}, previewPosStyle, {
            backgroundColor: bgColor,
            borderRadius: borderRadius + "px",
            padding: padding + "px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            borderLeft: borderLeftColor ? "4px solid " + borderLeftColor : "none",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            zIndex: 2,
          })}
        >
          {currentPreview && currentPreview.image ? (
            <img
              src={currentPreview.image}
              alt=""
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          ) : null}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
              <div
                style={{
                  fontSize: titleSize + "px",
                  fontWeight: 800,
                  color: titleColor,
                  lineHeight: 1.3,
                  marginBottom: "2px",
                }}
              >
                {(currentPreview && currentPreview.title) || "Título de la notificación"}
              </div>
              <span style={{ color: textColor, opacity: 0.45, fontSize: "14px", lineHeight: 1, cursor: "default", flexShrink: 0 }}>✕</span>
            </div>

            {currentPreview && currentPreview.subtitle ? (
              <div
                style={{
                  fontSize: subtitleSize + "px",
                  color: subtitleColor,
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
              >
                {currentPreview.subtitle}
              </div>
            ) : null}

            <div
              style={{
                fontSize: textSize + "px",
                color: textColor,
                lineHeight: 1.4,
                marginBottom: currentPreview && currentPreview.btnText ? "10px" : "0",
              }}
            >
              {(currentPreview && currentPreview.text) || "Texto de ejemplo."}
            </div>

            {currentPreview && currentPreview.btnText ? (
              <button
                type="button"
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  backgroundColor: btnBg,
                  color: btnTextColor,
                  border: "none",
                  borderRadius: btnBorderRadius + "px",
                  fontSize: btnSize + "px",
                  fontWeight: 700,
                  cursor: "default",
                }}
              >
                {currentPreview.btnText}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {notifications.length > 1 ? (
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          {notifications.map(function (n: NotifItem, idx: number) {
            return (
              <button
                key={n.id}
                type="button"
                onClick={function () {
                  setPreviewIdx(idx);
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: previewIdx === idx ? "2px solid #10B981" : "1px solid #D1D5DB",
                  backgroundColor: previewIdx === idx ? "#ECFDF5" : "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: previewIdx === idx ? "#059669" : "#6B7280",
                  cursor: "pointer",
                }}
              >
                #{idx + 1}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }} />
      )}

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "🔔 Notificaciones" },
          { id: "ubicacion", label: "📍 Ubicación" },
          { id: "estilos", label: "🎨 Estilos" },
          { id: "fechas", label: "🔥 Campañas" },
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
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>
            Notificaciones (mínimo 1, máximo 10)
          </div>

          {notifications.map(function (n: NotifItem, idx: number) {
            var isOpen = expandedId === n.id;
            return (
              <div
                key={n.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    cursor: "pointer",
                    backgroundColor: isOpen ? "#F9FAFB" : "#ffffff",
                  }}
                  onClick={function () {
                    setExpandedId(isOpen ? "" : n.id);
                    setPreviewIdx(idx);
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 800, color: "#111827" }}>
                    <span style={{ color: "#9CA3AF" }}>⠿</span>
                    Notificación #{idx + 1}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={function (e) {
                        e.stopPropagation();
                        removeNotification(n.id);
                      }}
                      style={{ background: "none", border: "none", color: "#EF4444", fontSize: "14px", cursor: "pointer", padding: "4px" }}
                      title="Eliminar"
                    >
                      🗑
                    </button>
                    <span style={{ color: "#6B7280", fontSize: "12px" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen ? (
                  <div style={{ padding: "14px", borderTop: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                        Título *
                      </label>
                      <input
                        type="text"
                        value={n.title}
                        onChange={function (e) {
                          updateNotification(n.id, "title", e.target.value);
                        }}
                        placeholder="Ej: ¡Nueva colección disponible!"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                        Subtítulo (opcional)
                      </label>
                      <input
                        type="text"
                        value={n.subtitle}
                        onChange={function (e) {
                          updateNotification(n.id, "subtitle", e.target.value);
                        }}
                        placeholder="Ej: Sólo por hoy"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                        Texto *
                      </label>
                      <textarea
                        value={n.text}
                        onChange={function (e) {
                          updateNotification(n.id, "text", e.target.value);
                        }}
                        placeholder="Texto de la notificación"
                        rows={3}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                        Imagen (opcional, aparece a la izquierda)
                      </label>
                      {n.image ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <img src={n.image} alt="" style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid #D1D5DB" }} />
                          <button
                            type="button"
                            onClick={function () {
                              updateNotification(n.id, "image", "");
                            }}
                            style={{ fontSize: "12px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                          >
                            Quitar
                          </button>
                        </div>
                      ) : null}
                      <input type="file" accept="image/*" onChange={function (e) { handleNotifImage(n.id, e); }} style={{ fontSize: "12px" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                          Texto del botón (opcional)
                        </label>
                        <input
                          type="text"
                          value={n.btnText}
                          onChange={function (e) {
                            updateNotification(n.id, "btnText", e.target.value);
                          }}
                          placeholder="Ej: Ver más"
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                          URL del botón
                        </label>
                        <input
                          type="text"
                          value={n.btnUrl}
                          onChange={function (e) {
                            updateNotification(n.id, "btnUrl", e.target.value);
                          }}
                          placeholder="https://..."
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addNotification}
            disabled={notifications.length >= 10}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "2px dashed #10B981",
              backgroundColor: notifications.length >= 10 ? "#F3F4F6" : "#ECFDF5",
              color: notifications.length >= 10 ? "#9CA3AF" : "#059669",
              fontSize: "13px",
              fontWeight: 800,
              cursor: notifications.length >= 10 ? "not-allowed" : "pointer",
            }}
          >
            + Agregar notificación
          </button>

          {/* FRECUENCIA */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
              ¿Con qué frecuencia se muestran las notificaciones?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {FREQUENCY_OPTIONS.map(function (opt) {
                var selected = frequency === opt.id;
                return (
                  <label
                    key={opt.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: selected ? "2px solid #10B981" : "1px solid #E5E7EB",
                      backgroundColor: selected ? "#ECFDF5" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      checked={selected}
                      onChange={function () {
                        setFrequency(opt.id);
                      }}
                      style={{ marginTop: "3px", accentColor: "#10B981", width: "16px", height: "16px", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#111827", marginBottom: "2px" }}>{opt.label}</div>
                      <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.4 }}>{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Esquina de aparición</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {POSITION_OPTIONS.map(function (opt) {
                var selected = position === opt.id;
                return (
                  <label
                    key={opt.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      padding: "12px 14px",
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
                      onChange={function () {
                        setPosition(opt.id);
                      }}
                      style={{ marginTop: "3px", accentColor: "#10B981", width: "16px", height: "16px", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#111827", marginBottom: "2px" }}>{opt.label}</div>
                      <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.4 }}>{opt.desc}</div>
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
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>Colores principales</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Personalizá los colores de fondo, textos y botón.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                { label: "Color de fondo", value: bgColor, setter: setBgColor },
                { label: "Color del título", value: titleColor, setter: setTitleColor },
                { label: "Color del subtítulo", value: subtitleColor, setter: setSubtitleColor },
                { label: "Color del texto", value: textColor, setter: setTextColor },
                { label: "Color del botón", value: btnBg, setter: setBtnBg },
                { label: "Color del texto del botón", value: btnTextColor, setter: setBtnTextColor },
              ].map(function (item) {
                return (
                  <div key={item.label}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>{item.label}</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={item.value && item.value.startsWith("#") ? item.value : "#ffffff"}
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
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Color borde izquierdo (opcional)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={borderLeftColor && borderLeftColor.startsWith("#") ? borderLeftColor : "#3B82F6"}
                    onChange={function (e) {
                      handleColorChange(setBorderLeftColor, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={borderLeftColor}
                    onChange={function (e) {
                      handleColorChange(setBorderLeftColor, e.target.value);
                    }}
                    placeholder="Sin borde"
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                  {borderLeftColor ? (
                    <button
                      type="button"
                      onClick={function () {
                        setBorderLeftColor("");
                        setCampaignTheme("none");
                      }}
                      style={{ fontSize: "11px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>Tipografías</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Ajustá los tamaños de fuente del widget.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {[
                { label: "Tamaño fuente título", value: titleSize, setter: setTitleSize, min: 11, max: 22 },
                { label: "Tamaño fuente subtítulo", value: subtitleSize, setter: setSubtitleSize, min: 10, max: 18 },
                { label: "Tamaño fuente texto", value: textSize, setter: setTextSize, min: 11, max: 18 },
                { label: "Tamaño fuente botón", value: btnSize, setter: setBtnSize, min: 10, max: 16 },
              ].map(function (item) {
                return (
                  <div key={item.label}>
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

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>Comportamiento y diseño</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Tiempos de aparición, bordes y padding.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Bordes redondeados del botón: {btnBorderRadius}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={btnBorderRadius}
                  onChange={function (e) {
                    setBtnBorderRadius(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Delay primera notificación: {delayFirst === 0 ? "Inmediato" : delayFirst + "s"}
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={delayFirst}
                  onChange={function (e) {
                    setDelayFirst(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Intervalo de aparición: {intervalSec}s
                </label>
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={intervalSec}
                  onChange={function (e) {
                    setIntervalSec(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Auto-cierre: {autoClose === 0 ? "No cerrar" : autoClose + "s"}
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={autoClose}
                  onChange={function (e) {
                    setAutoClose(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Bordes redondeados: {borderRadius}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={borderRadius}
                  onChange={function (e) {
                    setBorderRadius(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Padding interno: {padding}px
                </label>
                <input
                  type="range"
                  min={8}
                  max={32}
                  step={1}
                  value={padding}
                  onChange={function (e) {
                    setPadding(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === "fechas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#FFFBEB",
              border: "1px solid #FCD34D",
              borderRadius: "12px",
              padding: "14px 16px",
              fontSize: "13px",
              color: "#92400E",
            }}
          >
            🔥 Elegí un preset de campaña para adaptar colores de fondo, textos, botón y borde de las notificaciones.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              type="button"
              onClick={function () {
                applyPresetTheme("none");
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
            onChange={function (e) {
              setIsActive(e.target.checked);
            }}
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
          {saving ? "Guardando..." : "💾 Guardar Notificaciones Flotantes"}
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
