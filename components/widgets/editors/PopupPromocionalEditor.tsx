"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  HelpCircle,
  Upload,
  Trash2,
  Eye,
  Paintbrush,
  Mail,
  Settings,
  Clock,
  Link,
  Tag,
  Check,
  Layout,
  AlertCircle
} from "lucide-react";

interface Props {
  widget: any;
  onSave: (config: any) => Promise<void>;
  saving: boolean;
}

const FECHAS_ESPECIALES = [
  {
    id: "default",
    label: "Predeterminado (Nevux)",
    bgColor: "#111827",
    bgGradient: false,
    titleColor: "#10B981",
    textColor: "#FFFFFF",
    bodyTextColor: "#9CA3AF",
    btnBg: "#10B981",
    btnTextColor: "#FFFFFF"
  },
  {
    id: "hot-sale",
    label: "🔥 Hot Sale / Cyber Monday",
    bgColor: "#0F172A",
    bgGradient: true,
    titleColor: "#EF4444",
    textColor: "#FFFFFF",
    bodyTextColor: "#94A3B8",
    btnBg: "#EF4444",
    btnTextColor: "#FFFFFF"
  },
  {
    id: "black-friday",
    label: "⚡ Black Friday",
    bgColor: "#000000",
    bgGradient: false,
    titleColor: "#F59E0B",
    textColor: "#FFFFFF",
    bodyTextColor: "#A1A1AA",
    btnBg: "#F59E0B",
    btnTextColor: "#000000"
  },
  {
    id: "navidad",
    label: "🎄 Navidad",
    bgColor: "#064E3B",
    bgGradient: true,
    titleColor: "#F87171",
    textColor: "#FFFFFF",
    bodyTextColor: "#A7F3D0",
    btnBg: "#DC2626",
    btnTextColor: "#FFFFFF"
  },
  {
    id: "dia-madre-padre",
    label: "🎁 Día de la Madre / Padre",
    bgColor: "#831843",
    bgGradient: true,
    titleColor: "#F472B6",
    textColor: "#FFFFFF",
    bodyTextColor: "#FBCFE8",
    btnBg: "#EC4899",
    btnTextColor: "#FFFFFF"
  },
  {
    id: "san-valentin",
    label: "❤️ San Valentín",
    bgColor: "#4C0519",
    bgGradient: true,
    titleColor: "#FB7185",
    textColor: "#FFFFFF",
    bodyTextColor: "#FECDD3",
    btnBg: "#E11D48",
    btnTextColor: "#FFFFFF"
  },
  {
    id: "dia-nino",
    label: "🎈 Día del Niño",
    bgColor: "#1E1B4B",
    bgGradient: true,
    titleColor: "#818CF8",
    textColor: "#FFFFFF",
    bodyTextColor: "#C7D2FE",
    btnBg: "#6366F1",
    btnTextColor: "#FFFFFF"
  }
];

const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function PopupPromocionalEditor({ widget, onSave, saving }: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "emails" | "estilos">("general");

  const initialConfig = widget?.config || {};

  const [title, setTitle] = useState(initialConfig.title ?? "¡Oferta especial!");
  const [subtitle, setSubtitle] = useState(initialConfig.subtitle ?? "Aprovechá esta promoción exclusiva");
  const [bodyText, setBodyText] = useState(initialConfig.bodyText ?? "");
  const [legalText, setLegalText] = useState(initialConfig.legalText ?? "Válido por tiempo limitado. No acumulable con otras promociones.");
  const [headerImg, setHeaderImg] = useState(initialConfig.headerImg ?? "");
  const [trigger, setTrigger] = useState(initialConfig.trigger ?? "enter");
  const [frequency, setFrequency] = useState(initialConfig.frequency ?? "once-visit");

  const [showCountdown, setShowCountdown] = useState(initialConfig.showCountdown ?? true);
  const [countdownHours, setCountdownHours] = useState(initialConfig.countdownHours ?? 24);

  const [showExternalBtn, setShowExternalBtn] = useState(initialConfig.showExternalBtn ?? true);
  const [btnText, setBtnText] = useState(initialConfig.btnText ?? "¡Quiero aprovechar!");
  const [btnUrl, setBtnUrl] = useState(initialConfig.btnUrl ?? "");

  const [showFloatingBtn, setShowFloatingBtn] = useState(initialConfig.showFloatingBtn ?? true);
  const [collectEmail, setCollectEmail] = useState(initialConfig.collectEmail ?? false);

  const [bgColor, setBgColor] = useState(initialConfig.bgColor ?? "#111827");
  const [bgGradient, setBgGradient] = useState(initialConfig.bgGradient ?? false);
  const [titleColor, setTitleColor] = useState(initialConfig.titleColor ?? "#10B981");
  const [textColor, setTextColor] = useState(initialConfig.textColor ?? "#FFFFFF");
  const [bodyTextColor, setBodyTextColor] = useState(initialConfig.bodyTextColor ?? "#9CA3AF");
  const [btnBg, setBtnBg] = useState(initialConfig.btnBg ?? "#10B981");
  const [btnTextColor, setBtnTextColor] = useState(initialConfig.btnTextColor ?? "#FFFFFF");

  const [titleSize, setTitleSize] = useState(initialConfig.titleSize ?? "28px");
  const [subtitleSize, setSubtitleSize] = useState(initialConfig.subtitleSize ?? "18px");
  const [bodySize, setBodySize] = useState(initialConfig.bodySize ?? "15px");

  const [campaignTheme, setCampaignTheme] = useState(initialConfig.campaignTheme ?? "default");
  const [targetType, setTargetType] = useState<"all" | "product" | "category">(initialConfig.target_type || "all");
  const [targetValue, setTargetValue] = useState(initialConfig.target_value || "");

  const [uploadingImg, setUploadingImg] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImg(true);
      const base64 = await compressImage(file, 800, 800, 0.85);
      setHeaderImg(base64);
    } catch (err) {
      alert("Error al procesar la imagen.");
    } finally {
      setUploadingImg(false);
    }
  };

  const applyPreset = (preset: typeof FECHAS_ESPECIALES[0]) => {
    setCampaignTheme(preset.id);
    setBgColor(preset.bgColor);
    setBgGradient(preset.bgGradient);
    setTitleColor(preset.titleColor);
    setTextColor(preset.textColor);
    setBodyTextColor(preset.bodyTextColor);
    setBtnBg(preset.btnBg);
    setBtnTextColor(preset.btnTextColor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      title,
      subtitle,
      bodyText,
      legalText,
      headerImg,
      trigger,
      frequency,
      showCountdown,
      countdownHours: Number(countdownHours) || 24,
      showExternalBtn,
      btnText,
      btnUrl,
      showFloatingBtn,
      collectEmail,
      bgColor,
      bgGradient,
      titleColor,
      textColor,
      bodyTextColor,
      btnBg,
      btnTextColor,
      titleSize,
      subtitleSize,
      bodySize,
      campaignTheme,
      target_type: targetType,
      target_value: targetValue
    };
    await onSave(config);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Pop-up Promocional
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Nevux
              </span>
            </h1>
            <p className="text-xs text-slate-400">Captá la atención de tus clientes con ofertas y cuenta regresiva</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold px-5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-6 space-y-6">
        {/* Nav Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "general"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Settings className="w-4 h-4" />
            General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("emails")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "emails"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Emails
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("estilos")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "estilos"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            Estilos
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" /> Previsualización en tiempo real
            </span>
            <span className="text-[11px] text-slate-500">Vista previa interactiva</span>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-6 flex items-center justify-center min-h-[320px]">
            <div
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center relative border border-white/10 transition-all duration-300"
              style={{
                background: bgGradient
                  ? `linear-gradient(135deg, ${bgColor} 0%, #000000 100%)`
                  : bgColor
              }}
            >
              {headerImg && (
                <div className="mb-4 overflow-hidden rounded-xl max-h-40 flex items-center justify-center">
                  <img src={headerImg} alt="Header" className="w-full object-cover" />
                </div>
              )}

              <h2
                className="font-black mb-2 tracking-tight leading-tight"
                style={{ color: titleColor, fontSize: titleSize }}
              >
                {title || "¡Oferta especial!"}
              </h2>

              <p
                className="font-medium mb-3 leading-snug"
                style={{ color: textColor, fontSize: subtitleSize }}
              >
                {subtitle || "Aprovechá esta promoción exclusiva"}
              </p>

              {bodyText && (
                <p
                  className="mb-4 whitespace-pre-line leading-relaxed"
                  style={{ color: bodyTextColor, fontSize: bodySize }}
                >
                  {bodyText}
                </p>
              )}

              {showCountdown && (
                <div className="my-4 flex justify-center gap-2">
                  <div className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[54px]">
                    <span className="block font-black text-lg text-white">06</span>
                    <span className="text-[10px] text-slate-400 uppercase">hs</span>
                  </div>
                  <div className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[54px]">
                    <span className="block font-black text-lg text-white">30</span>
                    <span className="text-[10px] text-slate-400 uppercase">min</span>
                  </div>
                  <div className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[54px]">
                    <span className="block font-black text-lg text-white">12</span>
                    <span className="text-[10px] text-slate-400 uppercase">seg</span>
                  </div>
                </div>
              )}

              {collectEmail && (
                <div className="my-3">
                  <input
                    type="email"
                    disabled
                    placeholder="Ingresá tu email..."
                    className="w-full bg-slate-950/80 border border-slate-700/60 text-slate-300 text-xs px-3.5 py-2.5 rounded-xl text-center focus:outline-none"
                  />
                </div>
              )}

              <button
                type="button"
                style={{ backgroundColor: btnBg, color: btnTextColor }}
                className="w-full font-bold py-3 rounded-xl text-xs shadow-lg transition-transform active:scale-95 my-2"
              >
                {btnText || "¡Quiero aprovechar!"}
              </button>

              <button
                type="button"
                className="text-[11px] underline opacity-60 hover:opacity-100 block mx-auto mt-2"
                style={{ color: textColor }}
              >
                Cerrar
              </button>

              {legalText && (
                <p className="text-[10px] opacity-50 mt-3" style={{ color: textColor }}>
                  {legalText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TAB 1: GENERAL */}
        {activeTab === "general" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="¡Oferta especial!"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subtítulo</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Aprovechá esta promoción exclusiva"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Texto del cuerpo (opcional)
              </label>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Se muestra debajo del subtítulo. Dejá vacío para no mostrar nada."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Texto legal / aclaración (opcional)
              </label>
              <textarea
                value={legalText}
                onChange={(e) => setLegalText(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Ej: Válido por tiempo limitado. No acumulable con otras promociones."
              />
            </div>

            {/* Imagen de encabezado */}
            <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Imagen de encabezado (opcional)
              </label>
              {headerImg ? (
                <div className="flex items-center gap-4">
                  <img src={headerImg} alt="Header" className="w-20 h-20 object-cover rounded-xl border border-slate-700" />
                  <button
                    type="button"
                    onClick={() => setHeaderImg("")}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar imagen
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 cursor-pointer bg-slate-950/60 transition-all">
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-xs font-medium text-slate-300">
                    {uploadingImg ? "Comprimiendo imagen..." : "Arrastrá o hacé clic para subir una imagen"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Aparecerá arriba del título (JPG, PNG, WEBP max 512KB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImg}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Triggers y Frecuencias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ¿Cuándo aparece el popup?
                </label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="enter">Al entrar a la página</option>
                  <option value="delay-5">Luego de 5 segundos</option>
                  <option value="delay-10">Luego de 10 segundos</option>
                  <option value="scroll-50">Al desplazar el 50% de la página</option>
                  <option value="exit-intent">Al intentar salir (Exit-Intent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ¿Cuántas veces se muestra?
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="once-visit">1 vez por visita (recomendado)</option>
                  <option value="once-day">1 vez al día</option>
                  <option value="always">Siempre</option>
                </select>
              </div>
            </div>

            {/* Opciones activables */}
            <div className="space-y-3 pt-2">
              {/* Cuenta regresiva */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCountdown}
                    onChange={(e) => setShowCountdown(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">Mostrar cuenta regresiva</span>
                    <span className="text-[11px] text-slate-400">
                      Muestra un temporizador dentro del popup para crear urgencia.
                    </span>
                  </div>
                </label>
                {showCountdown && (
                  <div className="pl-7 pt-1">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Duración de la cuenta regresiva (en horas)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={168}
                      value={countdownHours}
                      onChange={(e) => setCountdownHours(Number(e.target.value))}
                      className="w-32 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                )}
              </div>

              {/* Botón con enlace externo */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showExternalBtn}
                    onChange={(e) => setShowExternalBtn(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">Botón con enlace externo</span>
                    <span className="text-[11px] text-slate-400">
                      Muestra un botón que lleva al visitante a una URL externa al hacer clic.
                    </span>
                  </div>
                </label>

                {showExternalBtn && (
                  <div className="pl-7 space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Texto del botón
                      </label>
                      <input
                        type="text"
                        value={btnText}
                        onChange={(e) => setBtnText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        placeholder="¡Quiero aprovechar!"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        URL de destino (opcional)
                      </label>
                      <input
                        type="url"
                        value={btnUrl}
                        onChange={(e) => setBtnUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        placeholder="https://tutienda.com/oferta"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Botón flotante para reabrir */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFloatingBtn}
                    onChange={(e) => setShowFloatingBtn(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Botón flotante para abrir el popup
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Muestra un botón fijo en el costado de la pantalla para reabrir el popup en cualquier momento.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Segmentación de Páginas */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" /> Segmentación de visualización
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    ¿Dónde mostrar este widget?
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Todas las páginas (Por defecto)</option>
                    <option value="product">En productos específicos</option>
                    <option value="category">En categorías específicas</option>
                  </select>
                </div>

                {targetType !== "all" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {targetType === "product" ? "IDs o Handles del producto" : "IDs o Handles de la categoría"}
                    </label>
                    <input
                      type="text"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder={targetType === "product" ? "ej: remera-nike, 12345" : "ej: calzados, 6789"}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Separar múltiples con comas</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EMAILS */}
        {activeTab === "emails" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collectEmail}
                  onChange={(e) => setCollectEmail(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">Mostrar casilla de email</span>
                  <span className="text-[11px] text-slate-400">
                    Muestra un campo de email en el popup para que el visitante lo ingrese antes de hacer clic en el botón.
                  </span>
                </div>
              </label>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-emerald-400 block">Captura de contactos directa</span>
                <p>
                  Cuando un cliente ingresa su correo en el popup, los datos quedan registrados y se envía una notificación al email de tu tienda de Tiendanube.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ESTILOS */}
        {activeTab === "estilos" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            {/* Fechas Especiales Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Plantillas de Fechas Especiales
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {FECHAS_ESPECIALES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-medium border text-left transition-all flex items-center justify-between ${
                      campaignTheme === preset.id
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                    {campaignTheme === preset.id && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Colores principales</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Color de fondo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Color del título</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Color del subtítulo / textos</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Color texto del cuerpo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bodyTextColor}
                      onChange={(e) => setBodyTextColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={bodyTextColor}
                      onChange={(e) => setBodyTextColor(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Color del botón</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={btnBg}
                      onChange={(e) => setBtnBg(e.target.value)}
                      className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={btnBg}
                      onChange={(e) => setBtnBg(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Color de texto del botón</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={btnTextColor}
                      onChange={(e) => setBtnTextColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={btnTextColor}
                      onChange={(e) => setBtnTextColor(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bgGradient}
                    onChange={(e) => setBgGradient(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-xs font-medium text-slate-300">Fondo en degradado elegante</span>
                </label>
              </div>
            </div>

            {/* Tipografías */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tipografías</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Tamaño fuente del título</label>
                  <select
                    value={titleSize}
                    onChange={(e) => setTitleSize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                    <option value="28px">28px</option>
                    <option value="32px">32px</option>
                    <option value="36px">36px</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Tamaño fuente del subtítulo</label>
                  <select
                    value={subtitleSize}
                    onChange={(e) => setSubtitleSize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Tamaño fuente del texto</label>
                  <select
                    value={bodySize}
                    onChange={(e) => setBodySize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="15px">15px</option>
                    <option value="16px">16px</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <HelpCircle className="w-4 h-4" />
          <span>Centro de ayuda - Soporte activo 24/7</span>
        </div>
      </main>
    </div>
  );
        }
