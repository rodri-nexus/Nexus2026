"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  Loader2,
  ArrowLeft,
  Save,
  Palette,
  CheckCircle2,
  AlertCircle,
  Eye,
  Clock,
  Type,
  Layout,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface CuentaRegresivaEditorProps {
  widgetDefinition: any;
  existingWidget: any;
  targetType: "all" | "product";
  productId: number | null;
  storeId: number;
}

/* ═══════════════════════════════════════════
   FECHAS ESPECIALES 3.0 — 7 PRESETS OFICIALES
═══════════════════════════════════════════ */
const PRESET_THEMES = [
  { id: "none", name: "Estilo Libre", themeColor: "#000000", accentColor: "#10B981", badge: "" },
  { id: "black-friday", name: "🔥 Black Friday", themeColor: "#111827", accentColor: "#F59E0B", badge: "🔥 BLACK FRIDAY" },
  { id: "hot-sale", name: "⚡ Hot Sale", themeColor: "#0F172A", accentColor: "#EF4444", badge: "⚡ HOT SALE" },
  { id: "cyber-monday", name: "🚀 Cyber Monday", themeColor: "#090D16", accentColor: "#3B82F6", badge: "🚀 CYBER MONDAY" },
  { id: "navidad", name: "🎄 Navidad & Reyes", themeColor: "#064E3B", accentColor: "#EF4444", badge: "🎄 NAVIDAD & REYES" },
  { id: "san-valentin", name: "💘 San Valentín", themeColor: "#831843", accentColor: "#F43F5E", badge: "💘 SAN VALENTÍN" },
  { id: "dia-madre-padre", name: "🎁 Día Madre/Padre", themeColor: "#312E81", accentColor: "#10B981", badge: "🎁 REGALO ESPECIAL" },
  { id: "liquidacion", name: "🏷️ Liquidación / Sale", themeColor: "#7F1D1D", accentColor: "#FBBF24", badge: "🏷️ SALE FINAL" },
];

const CLOCK_STYLES = [
  { id: "clasico", label: "Cuadrado Clásico", desc: "El más usado y seguro" },
  { id: "retro", label: "Retro Flip", desc: "Estilo tablero aeropuerto" },
  { id: "circulo", label: "Círculos Neón", desc: "Moderno con glow" },
  { id: "minimalista", label: "Minimalista", desc: "Sin fondo, elegante" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "0.65rem 0.75rem",
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        fontSize: "0.9rem",
        outline: "none",
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#111827",
        ...(props.style || {}),
      }}
    />
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.25rem" }}>
      <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function CuentaRegresivaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: CuentaRegresivaEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const raw = existingWidget?.config || {};

  // Textos
  const [title, setTitle] = useState(raw.title || "🔥 ¡La oferta termina pronto!");
  const [subtitle, setSubtitle] = useState(raw.subtitle || "¡Últimos minutos!");

  // Tiempo
  const [mode, setMode] = useState<"duration" | "fixed">(raw.mode === "fixed" ? "fixed" : "duration");
  const [durationMinutes, setDurationMinutes] = useState<number>(Number(raw.durationMinutes) || 15);
  const [endDate, setEndDate] = useState<string>(raw.endDate || "");
  const [autoRestart, setAutoRestart] = useState<boolean>(raw.autoRestart === true);

  // Unidades
  const [showDays, setShowDays] = useState<boolean>(raw.showDays === true);
  const [showHours, setShowHours] = useState<boolean>(raw.showHours !== false);
  const [showMinutes, setShowMinutes] = useState<boolean>(raw.showMinutes !== false);
  const [showSeconds, setShowSeconds] = useState<boolean>(raw.showSeconds !== false);
  const [showLabels, setShowLabels] = useState<boolean>(raw.showLabels !== false);

  // Diseño reloj
  const [clockStyle, setClockStyle] = useState<"clasico" | "retro" | "circulo" | "minimalista">(
    raw.style === "retro" || raw.style === "circulo" || raw.style === "minimalista" ? raw.style : "clasico"
  );
  const [alignment, setAlignment] = useState<"center" | "left">(raw.alignment === "left" ? "left" : "center");

  // Colores y tipografía
  const [bgType, setBgType] = useState<"solid" | "gradient">(raw.bgType === "gradient" ? "gradient" : "solid");
  const [colorWidgetBg, setColorWidgetBg] = useState(raw.colorWidgetBg || "#000000");
  const [colorWidgetBg2, setColorWidgetBg2] = useState(raw.colorWidgetBg2 || "#10B981");
  const [gradientDirection, setGradientDirection] = useState(raw.gradientDirection || "to bottom right");
  const [colorClockBg, setColorClockBg] = useState(raw.colorClockBg || "#10B981");
  const [colorTitle, setColorTitle] = useState(raw.colorTitle || "#ffffff");
  const [colorSubtitle, setColorSubtitle] = useState(raw.colorSubtitle || "#ffffff");
  const [colorSubtitleBg, setColorSubtitleBg] = useState(raw.colorSubtitleBg || "#10B981");
  const [colorNumbers, setColorNumbers] = useState(raw.colorNumbers || "#ffffff");
  const [fontSizeTitle, setFontSizeTitle] = useState(raw.fontSizeTitle || "16px");
  const [fontSizeSubtitle, setFontSizeSubtitle] = useState(raw.fontSizeSubtitle || "11px");
  const [fontSizeClock, setFontSizeClock] = useState(raw.fontSizeClock || "16px");
  const [borderRadiusClock, setBorderRadiusClock] = useState<number>(Number(raw.borderRadiusClock) || 8);
  const [borderRadiusWidget, setBorderRadiusWidget] = useState<number>(Number(raw.borderRadiusWidget) || 12);
  const [paddingWidget, setPaddingWidget] = useState<number>(Number(raw.paddingWidget) || 15);
  const [paddingClock, setPaddingClock] = useState<number>(Number(raw.paddingClock) || 8);

  // Urgencia
  const [urgencyEnabled, setUrgencyEnabled] = useState<boolean>(raw.urgencyEnabled === true);
  const [colorClockBgMedium, setColorClockBgMedium] = useState(raw.colorClockBgMedium || "#f97316");
  const [colorClockBgCritical, setColorClockBgCritical] = useState(raw.colorClockBgCritical || "#dc2626");

  // Ubicación
  const [showAsTopBar, setShowAsTopBar] = useState<boolean>(raw.showAsTopBar === true);
  const [showOnProduct, setShowOnProduct] = useState<boolean>(raw.showOnProduct !== false);
  const [showOnCart, setShowOnCart] = useState<boolean>(raw.showOnCart === true);
  const [productPosition, setProductPosition] = useState(raw.productPosition || "before-button");

  // Tema campaña
  const [campaignTheme, setCampaignTheme] = useState<string>(raw.campaignTheme || "none");

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);

  const selectedPreset = PRESET_THEMES.find((t) => t.id === campaignTheme) || PRESET_THEMES[0];

  const applyTheme = (themeId: string) => {
    setCampaignTheme(themeId);
    const theme = PRESET_THEMES.find((t) => t.id === themeId);
    if (theme && themeId !== "none") {
      setColorWidgetBg(theme.themeColor);
      setColorClockBg(theme.accentColor);
      setColorSubtitleBg(theme.accentColor);
      setColorTitle("#ffffff");
      setColorSubtitle(theme.accentColor);
      setBgType("solid");
      if (themeId === "black-friday" || themeId === "liquidacion") {
        setColorNumbers("#111827");
      } else {
        setColorNumbers("#ffffff");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setNotification(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("Sesión expirada. Volvé a iniciar sesión.");

      const configPayload = {
        title,
        subtitle,
        mode,
        durationMinutes,
        endDate,
        autoRestart,
        style: clockStyle,
        showDays,
        showHours,
        showMinutes,
        showSeconds,
        showLabels,
        alignment,
        bgType,
        colorWidgetBg,
        colorWidgetBg2,
        gradientDirection,
        colorClockBg,
        colorTitle,
        colorSubtitle,
        colorSubtitleBg,
        colorNumbers,
        fontSizeTitle,
        fontSizeSubtitle,
        fontSizeClock,
        borderRadiusClock,
        borderRadiusWidget,
        paddingWidget,
        paddingClock,
        urgencyEnabled,
        colorClockBgMedium,
        colorClockBgCritical,
        showAsTopBar,
        showOnProduct,
        showOnCart,
        productPosition,
        campaignTheme,
      };

      const payload = {
        store_id: storeId,
        user_id: userData.user.id,
        widget_slug: "cuenta-regresiva",
        widget_type: "cuenta-regresiva",
        target_type: targetType,
        target_product_id: productId,
        config: configPayload,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };

      if (existingWidget?.id) {
        const { error } = await supabase.from("widgets").update(payload).eq("id", existingWidget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("widgets").insert(payload);
        if (error) throw error;
      }

      setNotification({ type: "success", message: "¡Cuenta Regresiva guardada! Redirigiendo..." });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 900);
    } catch (err: any) {
      setNotification({ type: "error", message: err?.message || "Error al guardar." });
    } finally {
      setSaving(false);
    }
  };

  const previewBg =
    bgType === "gradient"
      ? `linear-gradient(${gradientDirection}, ${colorWidgetBg} 0%, ${colorWidgetBg2} 100%)`
      : colorWidgetBg;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "1.25rem 1rem 3rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {notification && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.85rem 1.1rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              backgroundColor: notification.type === "success" ? "#ecfdf5" : "#fef2f2",
              border: notification.type === "success" ? "1px solid #a7f3d0" : "1px solid #fecaca",
              color: notification.type === "success" ? "#065f46" : "#991b1b",
              fontWeight: 700,
              fontSize: "0.88rem",
            }}
          >
            {notification.type === "success" ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#ef4444" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.875rem", fontWeight: 700, color: "#4b5563", textDecoration: "none" }}>
            <ArrowLeft size={17} /> Volver al Dashboard
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#10B981",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.9rem",
              padding: "0.65rem 1.2rem",
              borderRadius: "10px",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(16,185,129,0.28)",
            }}
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            Guardar Cambios
          </button>
        </div>

        {/* Brand + estado */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.15rem 1.25rem", marginBottom: "1.15rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.03em" }}>N</span>
              </div>
              <div>
                <h1 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111827", margin: 0 }}>Cuenta Regresiva Premium</h1>
                <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: 0 }}>Urgencia + estilo total. Editá y mirá el resultado en vivo.</p>
              </div>
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#10B981" }} />
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: isActive ? "#059669" : "#6b7280" }}>
                {isActive ? "Widget Activo" : "Widget Inactivo"}
              </span>
            </label>
          </div>
        </div>

        {/* VISTA PREVIA EN VIVO */}
        <div style={{ background: "#ffffff", border: "2px solid #10B981", borderRadius: "16px", padding: "1.15rem", marginBottom: "1.25rem", boxShadow: "0 6px 24px rgba(16,185,129,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#059669", display: "inline-flex", alignItems: "center", gap: "0.4rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <Eye size={15} /> Vista previa en vivo
            </span>
            <span style={{ fontSize: "0.72rem", background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>
              Se actualiza al editar
            </span>
          </div>

          <div
            style={{
              background: previewBg,
              borderRadius: borderRadiusWidget,
              padding: paddingWidget,
              textAlign: alignment,
              transition: "all 0.25s ease",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            }}
          >
            {selectedPreset.badge ? (
              <div style={{ marginBottom: 8, textAlign: alignment }}>
                <span style={{ display: "inline-flex", alignItems: "center", background: colorClockBg, color: colorNumbers, fontSize: 11, fontWeight: 900, padding: "3px 10px", borderRadius: 999 }}>
                  {selectedPreset.badge}
                </span>
              </div>
            ) : null}

            <div style={{ fontSize: fontSizeTitle, fontWeight: 800, color: colorTitle, marginBottom: 8, lineHeight: 1.25, textAlign: alignment }}>
              {title || "🔥 ¡La oferta termina pronto!"}
            </div>

            {subtitle ? (
              <div style={{ marginBottom: 10, textAlign: alignment }}>
                <span style={{ display: "inline-block", background: colorSubtitleBg, color: colorSubtitle, fontSize: fontSizeSubtitle, fontWeight: 800, padding: "4px 10px", borderRadius: 6 }}>
                  {subtitle}
                </span>
              </div>
            ) : null}

            <div style={{ display: "flex", alignItems: "center", justifyContent: alignment === "center" ? "center" : "flex-start", gap: 8, flexWrap: "wrap" }}>
              {["00", "14", "59"].map((digit, idx) => (
                <React.Fragment key={idx}>
                  {clockStyle === "circulo" && (
                    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: colorClockBg, color: colorNumbers, display: "flex", alignItems: "center", justifyContent: "center", fontSize: fontSizeClock, fontWeight: 900, boxShadow: `0 0 12px ${colorClockBg}66` }}>
                        {digit}
                      </div>
                      {showLabels && <span style={{ fontSize: 9, fontWeight: 700, color: colorTitle, opacity: 0.85 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>}
                    </div>
                  )}
                  {clockStyle === "minimalista" && (
                    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <div style={{ color: colorClockBg, fontSize: "1.45rem", fontWeight: 900, lineHeight: 1 }}>{digit}</div>
                      {showLabels && <span style={{ fontSize: 9, fontWeight: 700, color: colorTitle, opacity: 0.85 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>}
                    </div>
                  )}
                  {clockStyle === "retro" && (
                    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ display: "flex", gap: 2 }}>
                        {digit.split("").map((d, dIdx) => (
                          <span key={dIdx} style={{ background: colorClockBg, color: colorNumbers, padding: `${paddingClock}px ${paddingClock + 2}px`, borderRadius: borderRadiusClock, fontSize: fontSizeClock, fontWeight: 900, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.28)" }}>
                            {d}
                          </span>
                        ))}
                      </div>
                      {showLabels && <span style={{ fontSize: 9, fontWeight: 700, color: colorTitle, opacity: 0.85 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>}
                    </div>
                  )}
                  {clockStyle === "clasico" && (
                    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ minWidth: 42, minHeight: 42, borderRadius: borderRadiusClock, background: colorClockBg, color: colorNumbers, display: "flex", alignItems: "center", justifyContent: "center", padding: `${paddingClock}px ${paddingClock + 2}px`, fontSize: fontSizeClock, fontWeight: 800 }}>
                        {digit}
                      </div>
                      {showLabels && <span style={{ fontSize: 9, fontWeight: 700, color: colorTitle, opacity: 0.85 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>}
                    </div>
                  )}
                  {idx < 2 && (
                    <span style={{ fontSize: clockStyle === "minimalista" ? "1.2rem" : "1rem", fontWeight: 900, color: clockStyle === "minimalista" ? colorClockBg : colorTitle, paddingBottom: showLabels ? 12 : 0 }}>
                      :
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

          {/* Diseño reloj */}
          <SectionCard title="Diseño del Reloj" icon={<Palette size={17} color="#10B981" />}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              {CLOCK_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setClockStyle(s.id as any)}
                  style={{
                    textAlign: "left",
                    border: clockStyle === s.id ? "2px solid #10B981" : "1.5px solid #e5e7eb",
                    background: clockStyle === s.id ? "#ecfdf5" : "#f9fafb",
                    borderRadius: 12,
                    padding: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: clockStyle === s.id ? "#059669" : "#374151" }}>{s.label}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: 2 }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Textos */}
          <SectionCard title="Textos del Contador" icon={<Type size={17} color="#10B981" />}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <FieldLabel>Título principal</FieldLabel>
                <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="🔥 ¡La oferta termina pronto!" />
              </div>
              <div>
                <FieldLabel>Subtítulo / badge</FieldLabel>
                <TextInput value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="¡Últimos minutos!" />
              </div>
              <div>
                <FieldLabel>Alineación del contenido</FieldLabel>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" onClick={() => setAlignment("center")} style={{ flex: 1, padding: "0.6rem", borderRadius: 10, border: alignment === "center" ? "2px solid #10B981" : "1.5px solid #e5e7eb", background: alignment === "center" ? "#ecfdf5" : "#fff", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}>
                    Centro (recomendado)
                  </button>
                  <button type="button" onClick={() => setAlignment("left")} style={{ flex: 1, padding: "0.6rem", borderRadius: 10, border: alignment === "left" ? "2px solid #10B981" : "1.5px solid #e5e7eb", background: alignment === "left" ? "#ecfdf5" : "#fff", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}>
                    Izquierda
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Tiempo */}
          <SectionCard title="Duración y Urgencia" icon={<Clock size={17} color="#10B981" />}>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.9rem" }}>
              <button type="button" onClick={() => setMode("duration")} style={{ flex: 1, padding: "0.65rem", borderRadius: 10, border: mode === "duration" ? "2px solid #10B981" : "1.5px solid #e5e7eb", background: mode === "duration" ? "#ecfdf5" : "#fff", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}>
                ⏱️ Por minutos (sesión)
              </button>
              <button type="button" onClick={() => setMode("fixed")} style={{ flex: 1, padding: "0.65rem", borderRadius: 10, border: mode === "fixed" ? "2px solid #10B981" : "1.5px solid #e5e7eb", background: mode === "fixed" ? "#ecfdf5" : "#fff", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}>
                📅 Fecha fija
              </button>
            </div>
            {mode === "duration" ? (
              <div>
                <FieldLabel>Minutos por visitante</FieldLabel>
                <TextInput type="number" min={1} value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 15)} />
              </div>
            ) : (
              <div>
                <FieldLabel>Fecha y hora de cierre</FieldLabel>
                <TextInput type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
              <input type="checkbox" checked={autoRestart} onChange={(e) => setAutoRestart(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#10B981" }} />
              Reiniciar automáticamente al terminar
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
              <input type="checkbox" checked={urgencyEnabled} onChange={(e) => setUrgencyEnabled(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#10B981" }} />
              Colores de urgencia (medio / crítico)
            </label>
            {urgencyEnabled && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <div>
                  <FieldLabel>Color medio</FieldLabel>
                  <input type="color" value={colorClockBgMedium} onChange={(e) => setColorClockBgMedium(e.target.value)} style={{ width: "100%", height: 40, border: "none", background: "transparent" }} />
                </div>
                <div>
                  <FieldLabel>Color crítico</FieldLabel>
                  <input type="color" value={colorClockBgCritical} onChange={(e) => setColorClockBgCritical(e.target.value)} style={{ width: "100%", height: 40, border: "none", background: "transparent" }} />
                </div>
              </div>
            )}
          </SectionCard>

          {/* Unidades visibles */}
          <SectionCard title="Qué mostrar en el reloj" icon={<Layout size={17} color="#10B981" />}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              {[
                { k: "days", label: "Días", v: showDays, set: setShowDays },
                { k: "hours", label: "Horas", v: showHours, set: setShowHours },
                { k: "mins", label: "Minutos", v: showMinutes, set: setShowMinutes },
                { k: "secs", label: "Segundos", v: showSeconds, set: setShowSeconds },
                { k: "labels", label: "Etiquetas (HRS/MIN/SEG)", v: showLabels, set: setShowLabels },
              ].map((item) => (
                <label key={item.k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.84rem", fontWeight: 700, color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "0.65rem 0.75rem" }}>
                  <input type="checkbox" checked={item.v} onChange={(e) => item.set(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#10B981" }} />
                  {item.label}
                </label>
              ))}
            </div>
          </SectionCard>

          {/* Fechas especiales 3.0 */}
          <SectionCard title="Fechas Especiales 3.0" icon={<Sparkles size={17} color="#10B981" />}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.5rem" }}>
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => applyTheme(theme.id)}
                  style={{
                    padding: "0.7rem",
                    borderRadius: 10,
                    border: campaignTheme === theme.id ? "2px solid #10B981" : "1.5px solid #e5e7eb",
                    background: campaignTheme === theme.id ? "#ecfdf5" : "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: "#111827",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Estilos / colores */}
          <SectionCard title="Colores y Tipografía" icon={<Palette size={17} color="#10B981" />}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.9rem" }}>
              <button type="button" onClick={() => setBgType("solid")} style={{ flex: 1, padding: "0.55rem", borderRadius: 10, border: bgType === "solid" ? "2px solid #10B981" : "1.5px solid #e5e7eb", background: bgType === "solid" ? "#ecfdf5" : "#fff", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}>
                Fondo sólido
              </button>
              <button type="button" onClick={() => setBgType("gradient")} style={{ flex: 1, padding: "0.55rem", borderRadius: 10, border: bgType === "gradient" ? "2px solid #10B981" : "1.5px solid #e5e7eb", background: bgType === "gradient" ? "#ecfdf5" : "#fff", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}>
                Degradé
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <FieldLabel>Fondo widget</FieldLabel>
                <input type="color" value={colorWidgetBg} onChange={(e) => setColorWidgetBg(e.target.value)} style={{ width: "100%", height: 42, border: "none", background: "transparent" }} />
              </div>
              {bgType === "gradient" && (
                <div>
                  <FieldLabel>Fondo 2 (degradé)</FieldLabel>
                  <input type="color" value={colorWidgetBg2} onChange={(e) => setColorWidgetBg2(e.target.value)} style={{ width: "100%", height: 42, border: "none", background: "transparent" }} />
                </div>
              )}
              <div>
                <FieldLabel>Color del reloj</FieldLabel>
                <input type="color" value={colorClockBg} onChange={(e) => setColorClockBg(e.target.value)} style={{ width: "100%", height: 42, border: "none", background: "transparent" }} />
              </div>
              <div>
                <FieldLabel>Color números</FieldLabel>
                <input type="color" value={colorNumbers} onChange={(e) => setColorNumbers(e.target.value)} style={{ width: "100%", height: 42, border: "none", background: "transparent" }} />
              </div>
              <div>
                <FieldLabel>Color título</FieldLabel>
                <input type="color" value={colorTitle} onChange={(e) => setColorTitle(e.target.value)} style={{ width: "100%", height: 42, border: "none", background: "transparent" }} />
              </div>
              <div>
                <FieldLabel>Color subtítulo</FieldLabel>
                <input type="color" value={colorSubtitle} onChange={(e) => setColorSubtitle(e.target.value)} style={{ width: "100%", height: 42, border: "none", background: "transparent" }} />
              </div>
              <div>
                <FieldLabel>Fondo subtítulo</FieldLabel>
                <input type="color" value={colorSubtitleBg} onChange={(e) => setColorSubtitleBg(e.target.value)} style={{ width: "100%", height: 42, border: "none", background: "transparent" }} />
              </div>
            </div>

            {bgType === "gradient" && (
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Dirección del degradé</FieldLabel>
                <select value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)} style={{ width: "100%", padding: "0.65rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontWeight: 700 }}>
                  <option value="to bottom right">Diagonal ↘</option>
                  <option value="to right">Horizontal →</option>
                  <option value="to bottom">Vertical ↓</option>
                  <option value="to top right">Diagonal ↗</option>
                </select>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
              <div>
                <FieldLabel>Tamaño título</FieldLabel>
                <TextInput value={fontSizeTitle} onChange={(e) => setFontSizeTitle(e.target.value)} placeholder="16px" />
              </div>
              <div>
                <FieldLabel>Tamaño subtítulo</FieldLabel>
                <TextInput value={fontSizeSubtitle} onChange={(e) => setFontSizeSubtitle(e.target.value)} placeholder="11px" />
              </div>
              <div>
                <FieldLabel>Tamaño reloj</FieldLabel>
                <TextInput value={fontSizeClock} onChange={(e) => setFontSizeClock(e.target.value)} placeholder="16px" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
              <div>
                <FieldLabel>Radio widget</FieldLabel>
                <TextInput type="number" value={borderRadiusWidget} onChange={(e) => setBorderRadiusWidget(parseInt(e.target.value, 10) || 0)} />
              </div>
              <div>
                <FieldLabel>Radio reloj</FieldLabel>
                <TextInput type="number" value={borderRadiusClock} onChange={(e) => setBorderRadiusClock(parseInt(e.target.value, 10) || 0)} />
              </div>
              <div>
                <FieldLabel>Padding widget</FieldLabel>
                <TextInput type="number" value={paddingWidget} onChange={(e) => setPaddingWidget(parseInt(e.target.value, 10) || 0)} />
              </div>
              <div>
                <FieldLabel>Padding reloj</FieldLabel>
                <TextInput type="number" value={paddingClock} onChange={(e) => setPaddingClock(parseInt(e.target.value, 10) || 0)} />
              </div>
            </div>
          </SectionCard>

          {/* Ubicación */}
          <SectionCard title="Ubicación en la tienda" icon={<Layout size={17} color="#10B981" />}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
                <input type="checkbox" checked={showAsTopBar} onChange={(e) => setShowAsTopBar(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#10B981" }} />
                Barra superior fija (TopBar en toda la tienda)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
                <input type="checkbox" checked={showOnProduct} onChange={(e) => setShowOnProduct(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#10B981" }} />
                Mostrar en ficha de producto
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
                <input type="checkbox" checked={showOnCart} onChange={(e) => setShowOnCart(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#10B981" }} />
                Mostrar en carrito
              </label>
              {showOnProduct && (
                <div>
                  <FieldLabel>Posición en producto</FieldLabel>
                  <select value={productPosition} onChange={(e) => setProductPosition(e.target.value)} style={{ width: "100%", padding: "0.65rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontWeight: 700 }}>
                    <option value="before-button">Arriba del botón Agregar al carrito</option>
                    <option value="before-title">Arriba del título del producto</option>
                  </select>
                </div>
              )}
              <div style={{ marginTop: 6, padding: "0.75rem 0.85rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: "0.78rem", color: "#166534", lineHeight: 1.45, display: "flex", gap: 8 }}>
                <HelpCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  <strong>Tip Nevux:</strong> en Home el contador se ubica arriba del banner principal. En producto, arriba del botón de compra (o del título si la plantilla no tiene botón estándar).
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
