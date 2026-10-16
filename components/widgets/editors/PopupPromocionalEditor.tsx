"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface PopupPromocionalEditorProps {
  widgetDefinition?: any;
  existingWidget?: any;
  storeId?: string | number;
  initialConfig?: any;
  widgetId?: string;
  targetType?: "product" | "all" | "category" | string;
  targetProductId?: string | number | null;
  productId?: string | number | null;
  categoryId?: string | number | null;
  onSave?: (config: any) => Promise<void>;
  isSaving?: boolean;
}

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "black-friday": { bg: "#0F172A", text: "#ffffff", border: "#334155", accent: "#F59E0B" },
  "hot-sale": { bg: "#ffffff", text: "#0F172A", border: "#EF4444", accent: "#EF4444" },
  "cyber-monday": { bg: "#090D16", text: "#ffffff", border: "#1E293B", accent: "#3B82F6" },
  "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857", accent: "#EF4444" },
  "san-valentin": { bg: "#FFF1F2", text: "#831843", border: "#FDA4AF", accent: "#F43F5E" },
  "dia-padre-madre": { bg: "#F0FDF4", text: "#166534", border: "#86EFAC", accent: "#10B981" },
  "liquidacion": { bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", accent: "#DC2626" },
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
      img.onerror = function (err) {
        reject(err);
      };
    };
    reader.onerror = function (err) {
      reject(err);
    };
  });
};

export default function PopupPromocionalEditor({
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
}: PopupPromocionalEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  const cfg = initialConfig || existingWidget?.config || {};

  // TEXTOS
  const [title, setTitle] = useState(cfg.title || "¡Oferta especial!");
  const [subtitle, setSubtitle] = useState(cfg.subtitle || "Aprovechá esta promoción exclusiva");
  const [bodyText, setBodyText] = useState(cfg.body_text || "Descuentos imperdibles en toda la tienda por tiempo limitado.");
  const [legalText, setLegalText] = useState(cfg.legal_text || "Válido por tiempo limitado. No acumulable.");
  const [headerImg, setHeaderImg] = useState(cfg.header_image || cfg.headerImg || "");
  const [btnText, setBtnText] = useState(cfg.btn_text || cfg.btnText || "¡Quiero aprovechar!");
  const [btnActionType, setBtnActionType] = useState(cfg.btn_action_type || "close");
  const [btnLink, setBtnLink] = useState(cfg.btn_link || "");

  // CONFIGURACIÓN (Timer, Trigger & Email)
  const [showCountdown, setShowCountdown] = useState(cfg.show_countdown !== false);
  const [countdownDate, setCountdownDate] = useState(
    cfg.countdown_date || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
  );
  const [collectEmail, setCollectEmail] = useState(cfg.collect_email !== false);
  const [trigger, setTrigger] = useState(cfg.trigger || "enter"); // enter, delay-5, delay-10, scroll-50, exit-intent
  const [frequency, setFrequency] = useState(cfg.frequency || "once-visit"); // once-visit, once-day, always
  const [showFloatingBtn, setShowFloatingBtn] = useState(cfg.show_reopen_btn !== false && cfg.showFloatingBtn !== false);

  // ESTILOS
  const [bgColor, setBgColor] = useState(cfg.bg_color || cfg.bgColor || "#ffffff");
  const [titleColor, setTitleColor] = useState(cfg.title_color || cfg.titleColor || "#111827");
  const [textColor, setTextColor] = useState(cfg.text_color || cfg.textColor || "#374151");
  const [btnBg, setBtnBg] = useState(cfg.btn_bg_color || cfg.btnBg || "#10B981");
  const [btnTextCol, setBtnTextCol] = useState(cfg.btn_text_color || cfg.btnTextCol || "#ffffff");

  const [titleSize, setTitleSize] = useState(typeof cfg.title_size === "number" ? cfg.title_size : typeof cfg.titleSize === "number" ? cfg.titleSize : 22);
  const [subtitleSize, setSubtitleSize] = useState(typeof cfg.subtitle_size === "number" ? cfg.subtitle_size : typeof cfg.subtitleSize === "number" ? cfg.subtitleSize : 14);

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
      var base64 = await compressImage(file, 600, 0.85);
      setHeaderImg(base64);
    } catch (error) {
      alert("Error al procesar la imagen. Intentá con otra.");
    }
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== "none" && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTitleColor(th.text);
      setTextColor(th.text);
      setBtnBg(th.accent);
      setBtnTextCol(th.bg === "#ffffff" ? "#ffffff" : th.bg);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme("none");
  };

  const handleSave = async function () {
    var configData = {
      title,
      subtitle,
      body_text: bodyText,
      legal_text: legalText,
      header_image: headerImg,
      btn_text: btnText,
      btn_action_type: btnActionType,
      btn_link: btnLink,
      show_countdown: showCountdown,
      countdown_date: countdownDate,
      collect_email: collectEmail,
      trigger,
      frequency,
      show_reopen_btn: showFloatingBtn,
      bg_color: bgColor,
      title_color: titleColor,
      text_color: textColor,
      btn_bg_color: btnBg,
      btn_text_color: btnTextCol,
      title_size: titleSize,
      subtitle_size: subtitleSize,
      campaignTheme,
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
          widget_slug: "popup-promocional",
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
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#111827", display: "flex", alignItems: "center", justifyCenter: "center", color: "#ffffff", fontSize: "13px", fontWeight: 800, textAlign: "center", lineHeight: "36px" }}>
          RL
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", backgroundColor: isCategory ? "#FEF3C7" : isForAll ? "#D1FAE5" : "#E0E7FF", color: isCategory ? "#D97706" : isForAll ? "#059669" : "#3730A3", border: "1px solid " + (isCategory ? "#FCD34D" : isForAll ? "#6EE7B7" : "#A5B4FC") }}>
          {isCategory ? "🏷️" : isForAll ? "🏪" : "📦"} {scopeLabel}
        </span>
      </div>

      <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>
        Nuevo widget: Pop-up Promocional ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
      </h1>

      <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #10B981", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#065F46", display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "18px" }}>🎁</span>
        <div><strong>Conversión en tiempo real:</strong> Mostrá un popup personalizable con reloj en vivo, captura de email y promociones atractivas.</div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: "#F3F4F6", border: "2px dashed #E5E7EB", borderRadius: "16px", padding: "30px 20px", marginBottom: "24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "380px", backgroundColor: bgColor, borderRadius: "16px", padding: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", textAlign: "center", position: "relative", border: "1px solid rgba(0,0,0,0.08)" }}>
          
          <div style={{ position: "absolute", top: "12px", right: "12px", color: textColor, opacity: 0.6, cursor: "pointer", fontSize: "16px", fontWeight: 800, lineHeight: 1 }}>✕</div>

          {headerImg && (
            <img src={headerImg} alt="Header" style={{ width: "100%", maxHeight: "140px", objectFit: "cover", marginBottom: "16px", borderRadius: "8px" }} />
          )}

          <div style={{ fontSize: titleSize + "px", fontWeight: 900, color: titleColor, marginBottom: "8px", lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: subtitleSize + "px", color: textColor, marginBottom: "12px", opacity: 0.9 }}>{subtitle}</div>

          {bodyText && (
            <div style={{ fontSize: "12px", color: textColor, marginBottom: "16px", opacity: 0.8, lineHeight: 1.4 }}>{bodyText}</div>
          )}

          {/* TIMER REGRESIVO MOCKUP */}
          {showCountdown && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "6px 8px", borderRadius: "6px", minWidth: "40px" }}>
                <span style={{ fontSize: "14px", fontWeight: 900, display: "block", color: btnBg }}>02</span>
                <span style={{ fontSize: "8px", textTransform: "uppercase", opacity: 0.6, fontWeight: 700, color: textColor }}>Días</span>
              </div>
              <div style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "6px 8px", borderRadius: "6px", minWidth: "40px" }}>
                <span style={{ fontSize: "14px", fontWeight 900, display: "block", color: btnBg }}>14</span>
                <span style={{ fontSize: "8px", textTransform: "uppercase", opacity: 0.6, fontWeight: 700, color: textColor }}>Hs</span>
              </div>
              <div style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "6px 8px", borderRadius: "6px", minWidth: "40px" }}>
                <span style={{ fontSize: "14px", fontWeight: 900, display: "block", color: btnBg }}>35</span>
                <span style={{ fontSize: "8px", textTransform: "uppercase", opacity: 0.6, fontWeight: 700, color: textColor }}>Min</span>
              </div>
              <div style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "6px 8px", borderRadius: "6px", minWidth: "40px" }}>
                <span style={{ fontSize: "14px", fontWeight: 900, display: "block", color: btnBg }}>50</span>
                <span style={{ fontSize: "8px", textTransform: "uppercase", opacity: 0.6, fontWeight: 700, color: textColor }}>Seg</span>
              </div>
            </div>
          )}

          {/* INPUT EMAIL MOCKUP */}
          {collectEmail && (
            <input type="email" placeholder="Tu email aquí..." disabled style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "12px", marginBottom: "12px", boxSizing: "border-box", backgroundColor: "#ffffff" }} />
          )}

          <button style={{ width: "100%", padding: "12px", backgroundColor: btnBg, color: btnTextCol, borderRadius: "10px", fontWeight: 800, fontSize: "14px", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {btnText}
          </button>

          {legalText && (
            <div style={{ fontSize: "10px", color: textColor, opacity: 0.6, marginTop: "12px" }}>{legalText}</div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "✍️ Textos" },
          { id: "reglas", label: "⚙️ Reglas & Email" },
          { id: "estilos", label: "🎨 Estilos" },
          { id: "fechas", label: "🔥 Campañas" },
        ].map(function (tab) {
          var active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () { setActiveTab(tab.id); }}
              style={{ padding: "10px 14px", fontSize: "13px", fontWeight: 700, border: "none", background: "none", cursor: "pointer", whiteSpace: "nowrap", borderBottom: active ? "3px solid #10B981" : "3px solid transparent", color: active ? "#10B981" : "#6B7280" }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB GENERAL (TEXTOS) */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Título principal</label>
              <input type="text" value={title} onChange={function (e) { setTitle(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Subtítulo</label>
              <input type="text" value={subtitle} onChange={function (e) { setSubtitle(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Texto del cuerpo (Opcional)</label>
              <textarea value={bodyText} onChange={function (e) { setBodyText(e.target.value); }} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight 700, color: "#374151", display: "block", marginBottom: "6px" }}>Texto del botón CTA</label>
              <input type="text" value={btnText} onChange={function (e) { setBtnText(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Acción del botón</label>
                <select value={btnActionType} onChange={function (e) { setBtnActionType(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}>
                  <option value="close">Cerrar Pop-up</option>
                  <option value="link">Abrir Link Externo</option>
                </select>
              </div>

              {btnActionType === "link" && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>URL de Destino</label>
                  <input type="url" value={btnLink} onChange={function (e) { setBtnLink(e.target.value); }} placeholder="https://..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Texto legal / Aclaración (Opcional)</label>
              <input type="text" value={legalText} onChange={function (e) { setLegalText(e.target.value); }} placeholder="Ej: Válido solo por tiempo limitado..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Imagen de encabezado (Opcional)</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {headerImg ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src={headerImg} alt="Header" style={{ height: "40px", objectFit: "contain", border: "1px solid #D1D5DB", borderRadius: "6px" }} />
                    <button type="button" onClick={function () { setHeaderImg(""); }} style={{ fontSize: "12px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Quitar</button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "12px", flex: 1 }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB REGLAS & EMAIL */}
      {activeTab === "reglas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Recolección de Emails</div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
              <input type="checkbox" checked={collectEmail} onChange={function (e) { setCollectEmail(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
              Pedir email en el pop-up
            </label>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "8px", marginLeft: "28px" }}>Capturá contactos directamente para tus campañas de remarketing.</div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Cuenta Regresiva (Timer)</div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "12px" }}>
              <input type="checkbox" checked={showCountdown} onChange={function (e) { setShowCountdown(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
              Mostrar contador regresivo
            </label>

            {showCountdown && (
              <div style={{ marginLeft: "28px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Fecha y hora de finalización</label>
                <input type="datetime-local" value={countdownDate} onChange={function (e) { setCountdownDate(e.target.value); }} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }} />
              </div>
            )}
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Comportamiento del Pop-up</div>
            
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>¿Cuándo aparece? (Trigger)</label>
              <select value={trigger} onChange={function (e) { setTrigger(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}>
                <option value="enter">Al entrar a la página (Inmediato)</option>
                <option value="delay-5">Después de 5 segundos</option>
                <option value="delay-10">Después de 10 segundos</option>
                <option value="scroll-50">Al bajar por la mitad de la página (Scroll 50%)</option>
                <option value="exit-intent">Al intentar salir de la tienda (Exit-Intent)</option>
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>¿Cuántas veces se muestra?</label>
              <select value={frequency} onChange={function (e) { setFrequency(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}>
                <option value="once-visit">1 vez por visita (Recomendado)</option>
                <option value="once-day">1 vez por día por usuario</option>
                <option value="always">Mostrar siempre cada vez que navega</option>
              </select>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#374151", marginTop: "16px" }}>
              <input type="checkbox" checked={showFloatingBtn} onChange={function (e) { setShowFloatingBtn(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
              Mostrar botón flotante de reapertura
            </label>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", marginLeft: "28px" }}>Permite al usuario reabrir la oferta si cerró el pop-up.</div>
          </div>

        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "14px" }}>Colores</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                { label: "Fondo del pop-up", value: bgColor, setter: setBgColor },
                { label: "Color del título", value: titleColor, setter: setTitleColor },
                { label: "Textos secundarios", value: textColor, setter: setTextColor },
                { label: "Fondo del botón", value: btnBg, setter: setBtnBg },
                { label: "Texto del botón", value: btnTextCol, setter: setBtnTextCol },
              ].map(function (item) {
                return (
                  <div key={item.label}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>{item.label}</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input type="color" value={item.value.startsWith("#") ? item.value : "#ffffff"} onChange={function (e) { handleColorChange(item.setter, e.target.value); }} style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }} />
                      <input type="text" value={item.value} onChange={function (e) { handleColorChange(item.setter, e.target.value); }} style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "14px" }}>Tamaños de letra</div>
            {[
              { label: "Tamaño del título", value: titleSize, setter: setTitleSize, min: 18, max: 32 },
              { label: "Tamaño del subtítulo", value: subtitleSize, setter: setSubtitleSize, min: 12, max: 18 },
            ].map(function (item) {
              return (
                <div key={item.label} style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>{item.label}: {item.value}px</label>
                  <input type="range" min={item.min} max={item.max} step={1} value={item.value} onChange={function (e) { item.setter(parseInt(e.target.value, 10)); }} style={{ width: "100%", accentColor: "#10B981" }} />
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
            🔥 Elegí un preset de campaña para adaptar automáticamente la paleta de colores del pop-up.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button type="button" onClick={function () { applyPresetTheme("none"); }} style={{ padding: "12px 14px", borderRadius: "10px", border: campaignTheme === "none" ? "2px solid #10B981" : "1px solid #E5E7EB", backgroundColor: campaignTheme === "none" ? "#ECFDF5" : "#ffffff", fontWeight: 700, fontSize: "13px", cursor: "pointer", textAlign: "left" }}>
              ✨ Sin campaña (colores libres)
            </button>
            {Object.keys(CAMPAIGN_THEMES).map(function (key) {
              var th = CAMPAIGN_THEMES[key];
              var active = campaignTheme === key;
              return (
                <button key={key} type="button" onClick={function () { applyPresetTheme(key); }} style={{ padding: "12px 14px", borderRadius: "10px", border: active ? "2px solid #10B981" : "1px solid #E5E7EB", backgroundColor: th.bg, color: th.text, fontWeight: 800, fontSize: "13px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{PRESET_LABELS[key] || key}</span>
                  <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: th.accent, border: "2px solid rgba(255,255,255,0.5)" }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GUARDAR */}
      <div style={{ marginTop: "28px", borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>
          <input type="checkbox" checked={isActive} onChange={function (e) { setIsActive(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
          Widget activo
        </label>

        <button type="button" onClick={handleSave} disabled={saving} style={{ width: "100%", backgroundColor: "#10B981", color: "#ffffff", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: 800, border: "none", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(16,185,129,0.3)", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Guardando..." : "💾 Guardar Pop-up Promocional"}
        </button>
        <p style={{ fontSize: "12px", color: "#6B7280", textAlign: "center", marginTop: "10px" }}>Al guardar vas a volver a <strong>Mis Widgets</strong></p>
      </div>

      <div style={{ marginTop: "28px" }}><CentroAyuda /></div>
    </div>
  );
  }
