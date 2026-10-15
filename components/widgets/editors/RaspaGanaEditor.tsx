"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface Coupon {
  id: string;
  title: string;
  code: string;
  prob: number;
}

interface RaspaGanaEditorProps {
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

export default function RaspaGanaEditor({
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
}: RaspaGanaEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  const cfg = initialConfig || existingWidget?.config || {};

  const defaultCoupons: Coupon[] = [
    { id: "c1", title: "🎉 20% OFF", code: "GANADOR20", prob: 80 },
    { id: "c2", title: "🏆 Envío Gratis", code: "ENVIOFREE", prob: 20 },
  ];

  // TEXTOS
  const [title, setTitle] = useState(cfg.title || "Raspá y ganá");
  const [subtitle, setSubtitle] = useState(cfg.subtitle || "Rascá abajo para ver tu premio");
  const [scratchText, setScratchText] = useState(cfg.scratchText || "RASPÁ Y GANÁ");
  const [btnText, setBtnText] = useState(cfg.btnText || "Reclamar premio");
  const [legalText, setLegalText] = useState(cfg.legalText || "Válido por tiempo limitado. No acumulable.");
  const [headerImg, setHeaderImg] = useState(cfg.headerImg || "");

  // CONFIGURACIÓN (Trigger & Email)
  const [trigger, setTrigger] = useState(cfg.trigger || "enter"); // enter, delay-5, scroll-50, exit-intent
  const [frequency, setFrequency] = useState(cfg.frequency || "once-visit"); // once-visit, once-day, always
  const [collectEmail, setCollectEmail] = useState(cfg.collectEmail !== false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(cfg.showFloatingBtn !== false);

  // CUPONES
  const [coupons, setCoupons] = useState<Coupon[]>(Array.isArray(cfg.coupons) ? cfg.coupons : defaultCoupons);

  // ESTILOS (Por defecto colores Nevux Premium)
  const [bgColor, setBgColor] = useState(cfg.bgColor || "#111827");
  const [titleColor, setTitleColor] = useState(cfg.titleColor || "#10B981");
  const [textColor, setTextColor] = useState(cfg.textColor || "#F3F4F6");
  const [btnBg, setBtnBg] = useState(cfg.btnBg || "#10B981");
  const [btnTextCol, setBtnTextCol] = useState(cfg.btnTextCol || "#ffffff");
  const [scratchBg, setScratchBg] = useState(cfg.scratchBg || "#F59E0B"); // Dorado por defecto

  const [titleSize, setTitleSize] = useState(typeof cfg.titleSize === "number" ? cfg.titleSize : 26);
  const [subtitleSize, setSubtitleSize] = useState(typeof cfg.subtitleSize === "number" ? cfg.subtitleSize : 15);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || "none");
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? "category" : productId ? "product" : "all");
  const isCategory = effectiveTargetType === "category" || !!categoryId;
  const isForAll = effectiveTargetType === "all";
  const scopeLabel = isForAll ? "Todos los productos" : isCategory ? "Categoría" : "Producto específico";

  const totalProb = coupons.reduce(function (sum, c) { return sum + c.prob; }, 0);

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

  const addCoupon = function () {
    if (coupons.length >= 5) {
      alert("Máximo 5 cupones permitidos.");
      return;
    }
    setCoupons(function (prev) {
      return [...prev, { id: "c-" + Math.random().toString(36).substring(2, 7), title: "Nuevo premio", code: "CODIGO", prob: 0 }];
    });
  };

  const updateCoupon = function (id: string, field: string, value: string | number) {
    setCoupons(function (prev) {
      return prev.map(function (c) {
        if (c.id === id) return { ...c, [field]: value };
        return c;
      });
    });
  };

  const removeCoupon = function (id: string) {
    if (coupons.length <= 1) {
      alert("Debe quedar al menos un cupón.");
      return;
    }
    setCoupons(function (prev) {
      return prev.filter(function (c) { return c.id !== id; });
    });
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== "none" && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTitleColor(th.text);
      setTextColor(th.text);
      setBtnBg(th.accent);
      setBtnTextCol(th.bg);
      setScratchBg("#F59E0B"); // Mantiene el dorado de raspadita
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme("none");
  };

  const handleSave = async function () {
    if (totalProb !== 100) {
      alert("Las probabilidades de los cupones deben sumar exactamente 100%. Actualmente suman: " + totalProb + "%");
      return;
    }

    var configData = {
      title,
      subtitle,
      scratchText,
      btnText,
      legalText,
      headerImg,
      trigger,
      frequency,
      collectEmail,
      showFloatingBtn,
      coupons,
      bgColor,
      titleColor,
      textColor,
      btnBg,
      btnTextCol,
      scratchBg,
      titleSize,
      subtitleSize,
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
          widget_slug: "raspa-gana",
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
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#111827", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "13px", fontWeight: 800 }}>
          RL
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", backgroundColor: isCategory ? "#FEF3C7" : isForAll ? "#D1FAE5" : "#E0E7FF", color: isCategory ? "#D97706" : isForAll ? "#059669" : "#3730A3", border: "1px solid " + (isCategory ? "#FCD34D" : isForAll ? "#6EE7B7" : "#A5B4FC") }}>
          {isCategory ? "🏷️" : isForAll ? "🏪" : "📦"} {scopeLabel}
        </span>
      </div>

      <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>
        Nuevo widget: Raspá y Ganá ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
      </h1>

      <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #10B981", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#065F46", display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "18px" }}>🎟️</span>
        <div><strong>Gamificación para ventas:</strong> Un popup interactivo donde los clientes "raspan" para ganar un descuento y vos te llevás sus correos.</div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: "#F3F4F6", border: "2px dashed #E5E7EB", borderRadius: "16px", padding: "30px 20px", marginBottom: "24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "380px", backgroundColor: bgColor, borderRadius: "16px", padding: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", textAlign: "center", position: "relative" }}>
          
          <div style={{ position: "absolute", top: "12px", right: "12px", color: textColor, opacity: 0.5, cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</div>

          {headerImg && (
            <img src={headerImg} alt="Header" style={{ width: "100%", maxHeight: "120px", objectFit: "contain", marginBottom: "16px", borderRadius: "8px" }} />
          )}

          <div style={{ fontSize: titleSize + "px", fontWeight: 900, color: titleColor, marginBottom: "8px", lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: subtitleSize + "px", color: textColor, marginBottom: "24px", opacity: 0.9 }}>{subtitle}</div>

          {/* TARJETA RASPADITA MOCKUP */}
          <div style={{ backgroundColor: scratchBg, borderRadius: "12px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)" }}>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", fontWeight: 800, textShadow: "1px 1px 2px rgba(0,0,0,0.2)", letterSpacing: "1px" }}>
              {scratchText}
            </span>
          </div>

          <button style={{ width: "100%", padding: "14px", backgroundColor: btnBg, color: btnTextCol, borderRadius: "10px", fontWeight: 800, fontSize: "15px", border: "none", opacity: 0.5, cursor: "not-allowed" }}>
            {btnText}
          </button>

          {legalText && (
            <div style={{ fontSize: "10px", color: textColor, opacity: 0.6, marginTop: "16px" }}>{legalText}</div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "✍️ Textos" },
          { id: "cupones", label: "🎟️ Cupones" },
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

      {/* TAB GENERAL */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Título del popup</label>
              <input type="text" value={title} onChange={function (e) { setTitle(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Subtítulo</label>
              <input type="text" value={subtitle} onChange={function (e) { setSubtitle(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Texto de la raspadita (Opcional)</label>
              <input type="text" value={scratchText} onChange={function (e) { setScratchText(e.target.value); }} placeholder="Ej: RASPA Y GANA" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Texto del botón al ganar</label>
              <input type="text" value={btnText} onChange={function (e) { setBtnText(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Texto legal / Aclaración (Opcional)</label>
              <input type="text" value={legalText} onChange={function (e) { setLegalText(e.target.value); }} placeholder="Ej: Válido solo hoy..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }} />
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

      {/* TAB CUPONES */}
      {activeTab === "cupones" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: totalProb === 100 ? "#ECFDF5" : "#FEF2F2", border: "1px solid " + (totalProb === 100 ? "#10B981" : "#EF4444"), borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: totalProb === 100 ? "#065F46" : "#991B1B" }}>
            <strong>Probabilidad Total: {totalProb}%</strong> {totalProb === 100 ? "¡Excelente! Listo para guardar." : "Debe sumar exactamente 100% para poder guardar el widget."}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {coupons.map(function (c, idx) {
              return (
                <div key={c.id} style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800 }}>Premio #{idx + 1}</div>
                    <button type="button" onClick={function () { removeCoupon(c.id); }} style={{ background: "none", border: "none", color: "#EF4444", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Eliminar</button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", display: "block", marginBottom: "4px" }}>Título del premio</label>
                      <input type="text" value={c.title} onChange={function (e) { updateCoupon(c.id, "title", e.target.value); }} placeholder="Ej: 20% OFF" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", display: "block", marginBottom: "4px" }}>Código de cupón</label>
                      <input type="text" value={c.code} onChange={function (e) { updateCoupon(c.id, "code", e.target.value.toUpperCase()); }} placeholder="Ej: SALE20" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", display: "block", marginBottom: "4px" }}>Probabilidad (%)</label>
                    <input type="number" min="0" max="100" value={c.prob === 0 && c.prob.toString() === "0" ? "" : c.prob} onChange={function (e) { updateCoupon(c.id, "prob", parseInt(e.target.value) || 0); }} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "12px", boxSizing: "border-box" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={addCoupon} disabled={coupons.length >= 5} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px dashed #10B981", backgroundColor: coupons.length >= 5 ? "#F3F4F6" : "#ECFDF5", color: coupons.length >= 5 ? "#9CA3AF" : "#059669", fontSize: "13px", fontWeight: 800, cursor: coupons.length >= 5 ? "not-allowed" : "pointer" }}>
            + Agregar Cupón (Máximo 5)
          </button>
        </div>
      )}

      {/* TAB REGLAS & EMAIL */}
      {activeTab === "reglas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Recolección de Emails</div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
              <input type="checkbox" checked={collectEmail} onChange={function (e) { setCollectEmail(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
              Pedir el email antes de permitir raspar (Recomendado)
            </label>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "8px", marginLeft: "28px" }}>Los emails ingresados te llegarán al correo del dueño de la tienda para tus campañas de marketing.</div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Comportamiento del Popup</div>
            
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>¿Cuándo aparece?</label>
              <select value={trigger} onChange={function (e) { setTrigger(e.target.value); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}>
                <option value="enter">Al entrar a la página</option>
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
                <option value="always">Mostrar siempre cada vez que entra</option>
              </select>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#374151", marginTop: "16px" }}>
              <input type="checkbox" checked={showFloatingBtn} onChange={function (e) { setShowFloatingBtn(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
              Mostrar botón flotante de regalo cerrado
            </label>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", marginLeft: "28px" }}>Permite al cliente reabrir la raspadita desde un botón flotante lateral si cerró el popup.</div>
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
                { label: "Fondo del popup", value: bgColor, setter: setBgColor },
                { label: "Color del título", value: titleColor, setter: setTitleColor },
                { label: "Textos secundarios", value: textColor, setter: setTextColor },
                { label: "Fondo de la Raspadita", value: scratchBg, setter: setScratchBg },
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
              { label: "Tamaño del título", value: titleSize, setter: setTitleSize, min: 18, max: 36 },
              { label: "Tamaño del subtítulo", value: subtitleSize, setter: setSubtitleSize, min: 12, max: 20 },
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
            🔥 Elegí un preset de campaña para adaptar todo el popup. La raspadita siempre mantiene su icónico color dorado.
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

        <button type="button" onClick={handleSave} disabled={saving || totalProb !== 100} style={{ width: "100%", backgroundColor: totalProb === 100 ? "#10B981" : "#9CA3AF", color: "#ffffff", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: 800, border: "none", cursor: saving || totalProb !== 100 ? "not-allowed" : "pointer", boxShadow: totalProb === 100 ? "0 4px 12px rgba(16,185,129,0.3)" : "none", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Guardando..." : "💾 Guardar Raspá y Ganá"}
        </button>
        <p style={{ fontSize: "12px", color: "#6B7280", textAlign: "center", marginTop: "10px" }}>Al guardar vas a volver a <strong>Mis Widgets</strong></p>
      </div>

      <div style={{ marginTop: "28px" }}><CentroAyuda /></div>
    </div>
  );
  }
