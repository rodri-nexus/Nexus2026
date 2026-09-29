"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Loader2, ArrowLeft, Save, Sparkles, Clock, Palette, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import Link from "next/link";

interface CuentaRegresivaEditorProps {
  widgetDefinition: any;
  existingWidget: any;
  targetType: "all" | "product";
  productId: number | null;
  storeId: number;
}

const PRESET_THEMES = [
  { id: "none", name: "Estilo Libre", themeColor: "#000000", accentColor: "#10B981", badge: "" },
  { id: "black-friday", name: "🔥 Black Friday", themeColor: "#111827", accentColor: "#F59E0B", badge: "🔥 BLACK FRIDAY" },
  { id: "hot-sale", name: "⚡ Hot Sale", themeColor: "#0F172A", accentColor: "#EF4444", badge: "⚡ HOT SALE" },
  { id: "cyber-monday", name: "🚀 Cyber Monday", themeColor: "#090D16", accentColor: "#3B82F6", badge: "🚀 CYBER MONDAY" },
  { id: "navidad", name: "🎄 Navidad", themeColor: "#064E3B", accentColor: "#EF4444", badge: "🎄 NAVIDAD" },
  { id: "san-valentin", name: "💘 San Valentín", themeColor: "#831843", accentColor: "#F43F5E", badge: "💘 SAN VALENTÍN" },
];

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

  const rawCfg = existingWidget?.config || {};

  const [title, setTitle] = useState(rawCfg.title || "🔥 ¡La oferta termina pronto!");
  const [subtitle, setSubtitle] = useState(rawCfg.subtitle || "¡Últimos minutos!");
  const [mode, setMode] = useState<"duration" | "fixed">(rawCfg.mode || "duration");
  const [durationMinutes, setDurationMinutes] = useState<number>(rawCfg.durationMinutes || 15);
  const [endDate, setEndDate] = useState<string>(rawCfg.endDate || "");
  const [autoRestart, setAutoRestart] = useState<boolean>(rawCfg.autoRestart ?? true);
  
  // 🎨 Estilos Premium del Reloj
  const [clockStyle, setClockStyle] = useState<"clasico" | "retro" | "circulo" | "minimalista">(rawCfg.style || "clasico");
  
  const [showAsTopBar, setShowAsTopBar] = useState<boolean>(rawCfg.showAsTopBar ?? false);
  const [showOnProduct, setShowOnProduct] = useState<boolean>(rawCfg.showOnProduct ?? true);
  
  const [campaignTheme, setCampaignTheme] = useState<string>(rawCfg.campaignTheme || "none");
  const [colorWidgetBg, setColorWidgetBg] = useState(rawCfg.colorWidgetBg || "#000000");
  const [colorClockBg, setColorClockBg] = useState(rawCfg.colorClockBg || "#10B981");

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);

  const handleSave = async () => {
    setSaving(true);
    setNotification(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("Sesión expirada. Por favor volvé a iniciar sesión.");

      const configPayload = {
        title,
        subtitle,
        mode,
        durationMinutes,
        endDate,
        autoRestart,
        style: clockStyle,
        showDays: false,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        showAsTopBar,
        showOnProduct,
        campaignTheme,
        colorWidgetBg,
        colorClockBg,
        colorTitle: "#ffffff",
        colorNumbers: "#ffffff",
        productPosition: "before-button",
        alignment: "center",
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

      setNotification({ type: "success", message: "¡Widget guardado con éxito! Redirigiendo..." });
      
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Error al guardar el widget." });
    } finally {
      setSaving(false);
    }
  };

  const selectedPreset = PRESET_THEMES.find((t) => t.id === campaignTheme);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "1.5rem 1rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Banner de Notificación */}
        {notification && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.85rem 1.25rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              backgroundColor: notification.type === "success" ? "#ecfdf5" : "#fef2f2",
              border: notification.type === "success" ? "1px solid #a7f3d0" : "1px solid #feccae",
              color: notification.type === "success" ? "#065f46" : "#991b1b",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            {notification.type === "success" ? (
              <CheckCircle2 style={{ width: "20px", height: "20px", color: "#10B981" }} />
            ) : (
              <AlertCircle style={{ width: "20px", height: "20px", color: "#ef4444" }} />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header Superior */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#4b5563", textDecoration: "none" }}>
            <ArrowLeft style={{ width: "18px", height: "18px" }} /> Volver al Dashboard
          </Link>
          <button onClick={handleSave} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#10B981", color: "#ffffff", fontWeight: 800, fontSize: "0.9rem", padding: "0.6rem 1.25rem", borderRadius: "10px", border: "none", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)" }}>
            {saving ? <Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} /> : <Save style={{ width: "18px", height: "18px" }} />}
            Guardar Cambios
          </button>
        </div>

        {/* Título y Estado */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827", margin: 0 }}>⏱️ Cuenta Regresiva Premium</h1>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>Generá urgencia con diseño de alta conversión.</p>
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 800, color: isActive ? "#059669" : "#6b7280" }}>{isActive ? "Widget Activo" : "Widget Inactivo"}</span>
            </label>
          </div>
        </div>

        {/* 👁️ SIMULADOR EN TIEMPO REAL (VISTA PREVIA EN VIVO) */}
        <div style={{ backgroundColor: "#ffffff", border: "2px solid #10B981", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#059669", display: "inline-flex", alignItems: "center", gap: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Eye style={{ width: "16px", height: "16px" }} /> Vista Previa en Vivo (Simulador)
            </span>
            <span style={{ fontSize: "0.75rem", backgroundColor: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
              Actualiza al instante
            </span>
          </div>

          {/* Renderizado de la Caja del Reloj */}
          <div
            style={{
              backgroundColor: colorWidgetBg,
              borderRadius: "14px",
              padding: "1.25rem",
              textAlign: "center",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            {/* Badge de Fecha Especial */}
            {selectedPreset && selectedPreset.badge && (
              <div style={{ marginBottom: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", backgroundColor: colorClockBg, color: "#ffffff", fontSize: "11px", fontWeight: 900, padding: "3px 10px", borderRadius: "999px", letterSpacing: "0.04em" }}>
                  {selectedPreset.badge}
                </span>
              </div>
            )}

            {/* Título */}
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", marginBottom: "8px", lineHeight: 1.2 }}>
              {title || "🔥 ¡La oferta termina pronto!"}
            </div>

            {/* Subtítulo */}
            {subtitle && (
              <div style={{ marginBottom: "10px" }}>
                <span style={{ display: "inline-block", backgroundColor: colorClockBg + "33", color: colorClockBg, fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "6px" }}>
                  {subtitle}
                </span>
              </div>
            )}

            {/* Reloj según Estilo Elegido */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
              {["00", "14", "59"].map((digit, idx) => (
                <React.Fragment key={idx}>
                  
                  {/* ESTILO 1: CIRCULO */}
                  {clockStyle === "circulo" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: colorClockBg, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 900, boxShadow: "0 0 12px " + colorClockBg + "66" }}>
                        {digit}
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#ffffff", opacity: 0.8 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>
                    </div>
                  )}

                  {/* ESTILO 2: MINIMALISTA */}
                  {clockStyle === "minimalista" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <div style={{ color: colorClockBg, fontSize: "1.5rem", fontWeight: 900, lineHeight: 1 }}>
                        {digit}
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#ffffff", opacity: 0.8 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>
                    </div>
                  )}

                  {/* ESTILO 3: RETRO FLIP */}
                  {clockStyle === "retro" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {digit.split("").map((d, dIdx) => (
                          <span key={dIdx} style={{ backgroundColor: colorClockBg, color: "#ffffff", padding: "6px 8px", borderRadius: "6px", fontSize: "1rem", fontWeight: 900, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.3)" }}>
                            {d}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#ffffff", opacity: 0.8 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>
                    </div>
                  )}

                  {/* ESTILO 4: CLASICO */}
                  {clockStyle === "clasico" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ minWidth: "40px", minHeight: "40px", borderRadius: "8px", backgroundColor: colorClockBg, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 8px", fontSize: "1rem", fontWeight: 800, lineHeight: 1 }}>
                        {digit}
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#ffffff", opacity: 0.8 }}>{idx === 0 ? "HRS" : idx === 1 ? "MIN" : "SEG"}</span>
                    </div>
                  )}

                  {/* Dos puntos separadores */}
                  {idx < 2 && (
                    <span style={{ fontSize: clockStyle === "minimalista" ? "1.2rem" : "1rem", fontWeight: 900, color: clockStyle === "minimalista" ? colorClockBg : "#ffffff", paddingBottom: "14px" }}>:</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario de Opciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* DISEÑO PREMIUM DEL RELOJ */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Palette style={{ width: "18px", height: "18px", color: "#10B981" }} /> Elegir Diseño del Reloj
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { id: "clasico", label: "Cuadrado Clásico", desc: "El tradicional seguro" },
                { id: "retro", label: "Retro Flip", desc: "Estilo tablero aeropuerto" },
                { id: "circulo", label: "Círculos Neón", desc: "Moderno con resplandor" },
                { id: "minimalista", label: "Minimalista", desc: "Elegante sin fondo" }
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => setClockStyle(style.id as any)}
                  style={{
                    border: clockStyle === style.id ? "2px solid #10B981" : "1px solid #e5e7eb",
                    backgroundColor: clockStyle === style.id ? "#ecfdf5" : "#f9fafb",
                    padding: "1rem",
                    borderRadius: "12px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: clockStyle === style.id ? "#059669" : "#374151" }}>{style.label}</span>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{style.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Textos */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>Textos del Contador</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>Título Principal</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>Subtítulo</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
              </div>
            </div>
          </div>

          {/* Duración */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>Duración (Urgencia)</h2>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button type="button" onClick={() => setMode("duration")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: mode === "duration" ? "2px solid #10B981" : "1px solid #d1d5db", backgroundColor: mode === "duration" ? "#ecfdf5" : "#ffffff", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}>⏱️ Por Minutos (Sesión)</button>
              <button type="button" onClick={() => setMode("fixed")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: mode === "fixed" ? "2px solid #10B981" : "1px solid #d1d5db", backgroundColor: mode === "fixed" ? "#ecfdf5" : "#ffffff", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}>📅 Fecha Fija</button>
            </div>
            {mode === "duration" ? (
              <input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 15)} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            ) : (
              <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            )}
          </div>

          {/* Fechas Especiales Presets */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "0.75rem" }}>Tema de Fecha Especial</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.5rem" }}>
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCampaignTheme(theme.id);
                    if (theme.id !== "none") {
                      setColorWidgetBg(theme.themeColor);
                      setColorClockBg(theme.accentColor);
                    }
                  }}
                  style={{
                    padding: "0.6rem", borderRadius: "8px", border: campaignTheme === theme.id ? "2px solid #10B981" : "1px solid #e5e7eb", backgroundColor: campaignTheme === theme.id ? "#ecfdf5" : "#ffffff", fontSize: "0.8rem", fontWeight: 700, color: "#111827", cursor: "pointer", textAlign: "left",
                  }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ubicaciones */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "0.75rem" }}>Ubicación Universal</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
                <input type="checkbox" checked={showAsTopBar} onChange={(e) => setShowAsTopBar(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "#10B981" }} />
                Mostrar como Barra Superior Fija (TopBar en toda la tienda)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
                <input type="checkbox" checked={showOnProduct} onChange={(e) => setShowOnProduct(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "#10B981" }} />
                Mostrar en Ficha de Producto (Arriba del botón Comprar)
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
   }
