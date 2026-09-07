"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  Sparkles,
  Bot,
  Flame,
  Palette,
  Brain,
  Globe,
  Mic,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "partners" | "stories" | "covers" | "appstore5";
type StoryDestacada =
  | "problema"
  | "solucion"
  | "testimonios"
  | "nevuxbot"
  | "analytics"
  | "blackfriday"
  | "estilomarca"
  | "crossselling"
  | "multiidioma"
  | "voz"
  | "vendedor";

/* ═══════════════════════════════════════════
   ESTILOS Y HELPERS (DECLARADOS AL INICIO - Regla #9)
═══════════════════════════════════════════ */

const subTabStyle = (isActive: boolean): React.CSSProperties => ({
  flex: "1 0 auto",
  padding: "8px 12px",
  borderRadius: "10px",
  fontSize: "11px",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
  background: isActive ? "#10B981" : "transparent",
  color: isActive ? "#ffffff" : "#6ee7b7",
  transition: "all 0.15s ease",
  whiteSpace: "nowrap",
});

const storyContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "36px",
  width: "100%",
  alignItems: "center",
};

const storyFrameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  minHeight: "580px",
  background: "linear-gradient(145deg, #047857 0%, #064e3b 50%, #022c22 100%)",
  border: "2px solid #10B981",
  borderRadius: "28px",
  padding: "24px 20px 20px",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.35)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const storyTopHeader: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
  zIndex: 2,
};

const storyBottomSwipe: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 800,
  color: "#a7f3d0",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  paddingTop: "12px",
  borderTop: "1px solid rgba(255, 255, 255, 0.15)",
  width: "100%",
  textAlign: "center",
  zIndex: 2,
};

const storyFrameLightStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  minHeight: "580px",
  background: "linear-gradient(145deg, #ecfdf5 0%, #f9fafb 100%)",
  border: "2px solid #10B981",
  borderRadius: "28px",
  padding: "24px 20px 20px",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.15)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const storyTopHeaderLight: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(5, 150, 105, 0.15)",
  zIndex: 2,
};

const storyBottomSwipeLight: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 800,
  color: "#059669",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  paddingTop: "12px",
  borderTop: "1px solid rgba(5, 150, 105, 0.15)",
  width: "100%",
  textAlign: "center",
  zIndex: 2,
};

const bubbleDarkStyle: React.CSSProperties = {
  background: "rgba(0, 0, 0, 0.4)",
  border: "1.5px solid rgba(16, 185, 129, 0.4)",
  borderRadius: "16px",
  padding: "14px",
  textAlign: "left",
  marginBottom: "14px",
};

const storyBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(239, 68, 68, 0.2)",
  border: "1.5px solid #ef4444",
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: 900,
  padding: "5px 12px",
  borderRadius: "999px",
  marginBottom: "16px",
  letterSpacing: "0.05em",
};

const storyBadgeLightStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(16, 185, 129, 0.15)",
  border: "1.5px solid #10B981",
  color: "#065f46",
  fontSize: "10px",
  fontWeight: 900,
  padding: "5px 12px",
  borderRadius: "999px",
  marginBottom: "16px",
  letterSpacing: "0.05em",
};

const storyTitleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  color: "#ffffff",
  lineHeight: 1.15,
  margin: "0 0 16px 0",
  letterSpacing: "-0.03em",
};

const storyTitleLightStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  color: "#065f46",
  lineHeight: 1.15,
  margin: "0 0 16px 0",
  letterSpacing: "-0.03em",
};

const storyDescStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#d1fae5",
  lineHeight: 1.5,
  margin: 0,
  fontWeight: 500,
};

const storyDescLightStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: 1.5,
  margin: 0,
  fontWeight: 600,
};

const whatsappFrameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  height: "580px",
  background:
    "#efe7e3 url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png') repeat",
  border: "2px solid #10B981",
  borderRadius: "28px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.35)",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const whatsappBodyStyle: React.CSSProperties = {
  flex: 1,
  padding: "16px 10px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  overflowY: "auto",
};

const highlightBubbleStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  background: "#ffffff",
  color: "#111827",
  padding: "10px 14px",
  borderRadius: "0px 14px 14px 14px",
  maxWidth: "85%",
  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.25)",
  border: "1.5px solid #10B981",
  textAlign: "left",
  position: "relative",
};

const coverContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

const coverCircleStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
  border: "4px solid #10B981",
  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const coverLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 800,
  color: "#ffffff",
  textAlign: "center",
};

const bannerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "650px",
  minHeight: "350px",
  background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #022c22 100%)",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  boxSizing: "border-box",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(255, 255, 255, 0.2)",
  color: "#ffffff",
  fontSize: "9px",
  fontWeight: "900",
  padding: "4px 10px",
  borderRadius: "999px",
  marginBottom: "12px",
  letterSpacing: "0.5px",
};

const bannerTitleStyle: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "900",
  color: "#ffffff",
  margin: "0 0 10px 0",
  lineHeight: "1.1",
  letterSpacing: "-0.03em",
};

const bannerDescStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#d1fae5",
  margin: 0,
  lineHeight: "1.45",
  fontWeight: "500",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTES VISUALES WHATSAPP
═══════════════════════════════════════════ */
function WhatsAppHeader({
  name,
  status,
  emoji,
}: {
  name: string;
  status: string;
  emoji: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        background: "#075e54",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        boxSizing: "border-box",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ChevronLeft size={20} color="#ffffff" style={{ cursor: "pointer" }} />
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#eceff1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {emoji}
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
            {name}
          </div>
          <div style={{ fontSize: "10px", color: "#a5d6a7", fontWeight: 500 }}>
            {status}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", color: "#ffffff" }}>
        <Video size={18} />
        <Phone size={16} />
        <MoreVertical size={18} />
      </div>
    </div>
  );
}

function WhatsAppFooter() {
  return (
    <div
      style={{
        width: "100%",
        background: "#f0f0f0",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderTop: "1px solid #e0e0e0",
        boxSizing: "border-box",
        zIndex: 10,
      }}
    >
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          borderRadius: "20px",
          padding: "8px 14px",
          fontSize: "12px",
          color: "#999999",
          textAlign: "left",
          border: "1px solid #e0e0e0",
        }}
      >
        Escribí un mensaje...
      </div>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "#075e54",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: "16px",
        }}
      >
        🎤
      </div>
    </div>
  );
}

function BlurBubble({ text, isLeft }: { text: string; isLeft: boolean }) {
  return (
    <div
      style={{
        alignSelf: isLeft ? "flex-start" : "flex-end",
        background: isLeft ? "#ffffff" : "#dcf8c6",
        color: "#303030",
        padding: "6px 10px",
        borderRadius: isLeft ? "0px 10px 10px 10px" : "10px 0px 10px 10px",
        maxWidth: "75%",
        fontSize: "11px",
        lineHeight: "1.4",
        filter: "blur(5px)",
        opacity: 0.35,
        pointerEvents: "none",
        boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
        wordBreak: "break-word",
        position: "relative",
      }}
    >
      {text}
      <div
        style={{
          fontSize: "8px",
          color: "#999999",
          textAlign: "right",
          marginTop: "2px",
        }}
      >
        12:34
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("appstore5"); // Por defecto en la nueva función estrella
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [activeDestacada, setActiveDestacada] = useState<StoryDestacada>("vendedor");
  const [appstoreScale, setAppstoreScale] = useState<"fit" | "real">("fit"); // Ajustar o real 1920x1080

  const isPt = lang === "pt";

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "appstore5", label: "Banner #5 App Store", icon: "⭐" },
    { id: "partners", label: "Banners Partners", icon: "🖼️" },
    { id: "stories", label: "Historias Instagram", icon: "📱" },
    { id: "covers", label: "Portadas Destacadas", icon: "🎨" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#061a14",
        color: "#ffffff",
        padding: "24px 16px 120px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* PANEL DE CONTROL SUPERIOR */}
      <div
        style={{
          maxWidth: "750px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#0b2920",
          padding: "20px",
          borderRadius: "18px",
          border: "1.5px solid rgba(16, 185, 129, 0.3)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#10B981",
            margin: 0,
          }}
        >
          📷 Generador de Contenido Visual Nevux
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#a7f3d0",
            margin: 0,
            lineHeight: "1.4",
          }}
        >
          Seleccioná qué tipo de contenido querés generar y sacale captura desde tu celular.
        </p>

        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "#061a14",
            padding: "4px",
            borderRadius: "12px",
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? "#10B981" : "transparent",
                  color: isActive ? "#ffffff" : "#6ee7b7",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 PESTAÑA: BANNER #5 APP STORE (1920x1080) */}
      {activeTab === "appstore5" && (
        <div
          style={{
            width: "100%",
            maxWidth: appstoreScale === "real" ? "1920px" : "1000px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* CONTROL DE ESCALA Y CAPTURA */}
          <div
            style={{
              background: "#0b2920",
              padding: "10px 18px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#a7f3d0" }}>Vista:</span>
            <button
              onClick={() => setAppstoreScale("fit")}
              style={{
                background: appstoreScale === "fit" ? "#10B981" : "transparent",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              📱 Ajustar a Celular
            </button>
            <button
              onClick={() => setAppstoreScale("real")}
              style={{
                background: appstoreScale === "real" ? "#10B981" : "transparent",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              🖥️ Tamaño Real (1920x1080)
            </button>
          </div>

          {/* CONTENEDOR DEL BANNER 5 */}
          <div
            style={{
              width: appstoreScale === "real" ? "1920px" : "100%",
              height: appstoreScale === "real" ? "1080px" : "auto",
              aspectRatio: "16 / 9",
              background: "radial-gradient(circle at top left, #052e16 0%, #020617 60%, #000000 100%)",
              border: "6px solid #10B981",
              borderRadius: "24px",
              padding: "50px 60px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8), inset 0 0 100px rgba(16, 185, 129, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* RAYOS LED SUTILES DE FONDO */}
            <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "#10B981", filter: "blur(200px)", opacity: 0.12, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "40%", height: "40%", background: "#10B981", filter: "blur(180px)", opacity: 0.08, pointerEvents: "none" }} />

            {/* HEADER DEL BANNER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid rgba(16, 185, 129, 0.25)", paddingBottom: "24px", zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ background: "#10B981", color: "#ffffff", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 900, boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)" }}>N</div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.04em" }}>NEVUX</h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#10B981", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>Powering Tiendanube</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10B981", padding: "6px 16px", borderRadius: "999px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", animation: "nvxPulse 1.2s infinite" }} />
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.05em", textTransform: "uppercase" }}>App Store ID: 37382</span>
              </div>
            </div>

            {/* SECCIÓN CENTRAL: TÍTULO + GRILLA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "30px", margin: "20px 0", zIndex: 10 }}>
              {/* TÍTULO Y CONCEPTO */}
              <div style={{ textAlign: "center" }}>
                <h1 style={{ margin: "0 0 10px 0", fontSize: "44px", fontWeight: 950, color: "#ffffff", letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1.1 }}>
                  NEVUX NO ES CUALQUIER APLICACIÓN.
                </h1>
                <p style={{ fontSize: "17px", color: "#9ca3af", maxWidth: "850px", margin: "0 auto", lineHeight: 1.5, fontWeight: 500 }}>
                  Es la única suite inteligente todo-en-uno que fusiona <span style={{ color: "#10B981", fontWeight: 800 }}>27 widgets de conversión avanzada</span> con herramientas de IA para liquidar a tu competencia y disparar tu ticket promedio.
                </p>
              </div>

              {/* GRILLA DE LAS 7 FUNCIONES PRO */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", width: "100%", marginTop: "10px" }}>
                {/* TARJETA 1 */}
                <div style={{ background: "rgba(10, 10, 10, 0.65)", border: "1.5px solid rgba(16, 185, 129, 0.45)", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(16, 185, 129, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <BarChart3 size={20} color="#10B981" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 850, color: "#ffffff" }}>Live Analytics</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>Facturación extra, pedidos recuperados y ROI exacto en tiempo real.</p>
                </div>

                {/* TARJETA 2 */}
                <div style={{ background: "rgba(10, 10, 10, 0.65)", border: "1.5px solid rgba(245, 158, 11, 0.45)", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(245, 158, 11, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Flame size={20} color="#F59E0B" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 850, color: "#ffffff" }}>Fechas Especiales</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>Modos Black Friday, Hot Sale y Navidad activables en 1 clic.</p>
                </div>

                {/* TARJETA 3 */}
                <div style={{ background: "rgba(10, 10, 10, 0.65)", border: "1.5px solid rgba(139, 92, 246, 0.45)", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(139, 92, 246, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Palette size={20} color="#8B5CF6" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 850, color: "#ffffff" }}>Estilo Marca</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>Regla cromática inteligente que adapta los widgets a tu branding.</p>
                </div>

                {/* TARJETA 4 */}
                <div style={{ background: "rgba(10, 10, 10, 0.65)", border: "1.5px solid rgba(59, 130, 246, 0.45)", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(59, 130, 246, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Brain size={20} color="#3B82F6" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 850, color: "#ffffff" }}>Sugerencias IA</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>Cross-selling predictivo dinámico basado en afinidad de precios.</p>
                </div>
              </div>

              {/* FILA 2 DE LA GRILLA (CENTRADOS) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "80%", margin: "0 auto" }}>
                {/* TARJETA 5 */}
                <div style={{ background: "rgba(10, 10, 10, 0.65)", border: "1.5px solid rgba(6, 182, 212, 0.45)", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(6, 182, 212, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Globe size={20} color="#06B6D4" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 850, color: "#ffffff" }}>Multi-Idioma IA</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>Traducción contextual en tiempo real para ES / PT-BR / EN.</p>
                </div>

                {/* TARJETA 6 */}
                <div style={{ background: "rgba(10, 10, 10, 0.65)", border: "1.5px solid rgba(236, 72, 153, 0.45)", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(236, 72, 153, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Mic size={20} color="#EC4899" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 850, color: "#ffffff" }}>Búsqueda por Voz</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>Micrófono flotante con transcripción neuronal para comprar hablando.</p>
                </div>

                {/* TARJETA 7 */}
                <div style={{ background: "rgba(10, 10, 10, 0.65)", border: "1.5px solid rgba(16, 185, 129, 0.45)", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(16, 185, 129, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Bot size={20} color="#10B981" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 850, color: "#ffffff" }}>Vendedor Virtual IA</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>Agente que asesora, resuelve dudas y deriva el pedido a WhatsApp.</p>
                </div>
              </div>
            </div>

            {/* FOOTER DEL BANNER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid rgba(16, 185, 129, 0.15)", paddingTop: "20px", zIndex: 10 }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#10B981", letterSpacing: "0.03em" }}>🚀 UNETE A LA REVOLUCIÓN DEL COMMERCE</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280" }}>© 2026 Nevux App. Todos los derechos reservados.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANNERS PARTNERS */}
      {activeTab === "partners" && (
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              background: "#0b2920",
              padding: "4px",
              borderRadius: "12px",
            }}
          >
            <button
              onClick={() => setLang("es")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: !isPt ? "#10B981" : "transparent",
                color: !isPt ? "#ffffff" : "#a7f3d0",
              }}
            >
              🇦🇷 Español
            </button>
            <button
              onClick={() => setLang("pt")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: isPt ? "#10B981" : "transparent",
                color: isPt ? "#ffffff" : "#a7f3d0",
              }}
            >
              🇧🇷 Português
            </button>
          </div>
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 200px", zIndex: 2 }}>
              <div style={badgeStyle}>🤖 NEVUXBOT</div>
              <h2 style={bannerTitleStyle}>
                {isPt
                  ? "O primeiro CRM de Carrinhos com IA"
                  : "El primer CRM de Carritos con IA"}
              </h2>
              <p style={bannerDescStyle}>
                {isPt
                  ? "Detecte vendas perdidas, crie mensagens persuasivas com Gemini AI e recupere via WhatsApp ou E-mail."
                  : "Detectá ventas perdidas, creá copys persuasivos con Gemini AI y recuperá por WhatsApp o Email."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORIAS INSTAGRAM */}
      {activeTab === "stories" && (
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "#0b2920",
              padding: "6px",
              borderRadius: "14px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              width: "100%",
              overflowX: "auto",
            }}
          >
            <button onClick={() => setActiveDestacada("problema")} style={subTabStyle(activeDestacada === "problema")}>🚨 1. Dolor</button>
            <button onClick={() => setActiveDestacada("solucion")} style={subTabStyle(activeDestacada === "solucion")}>⚡ 2. Solución</button>
            <button onClick={() => setActiveDestacada("testimonios")} style={subTabStyle(activeDestacada === "testimonios")}>💬 3. Chats</button>
            <button onClick={() => setActiveDestacada("nevuxbot")} style={subTabStyle(activeDestacada === "nevuxbot")}>🤖 4. NevuxBot</button>
            <button onClick={() => setActiveDestacada("analytics")} style={subTabStyle(activeDestacada === "analytics")}>📊 5. Analytics</button>
            <button onClick={() => setActiveDestacada("blackfriday")} style={subTabStyle(activeDestacada === "blackfriday")}>🔥 6. Fechas</button>
            <button onClick={() => setActiveDestacada("estilomarca")} style={subTabStyle(activeDestacada === "estilomarca")}>🎨 7. Marca</button>
            <button onClick={() => setActiveDestacada("crossselling")} style={subTabStyle(activeDestacada === "crossselling")}>🧠 8. Cross-Sell</button>
            <button onClick={() => setActiveDestacada("multiidioma")} style={subTabStyle(activeDestacada === "multiidioma")}>🌎 9. Idiomas</button>
            <button onClick={() => setActiveDestacada("voz")} style={subTabStyle(activeDestacada === "voz")}>🎙️ 10. Voz</button>
            <button onClick={() => setActiveDestacada("vendedor")} style={subTabStyle(activeDestacada === "vendedor")}>🤝 11. Vendedor IA</button>
          </div>

          {/* RENDERING PROBLEMA */}
          {activeDestacada === "problema" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>🛑</div>
                  <div style={storyBadgeStyle}>REALIDAD DEL E-COMMERCE</div>
                  <h2 style={storyTitleStyle}>¿Por qué tu tienda vende <span style={{ color: "#fca5a5", textDecoration: "underline" }}>menos</span>?</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING SOLUCION */}
          {activeDestacada === "solucion" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>⚡</div>
                  <div style={storyBadgeLightStyle}>LA SOLUCIÓN DEFINITIVA</div>
                  <h2 style={storyTitleLightStyle}>Una sola app.<br />27 widgets de conversión.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING TESTIMONIOS WHATSAPP */}
          {activeDestacada === "testimonios" && (
            <div style={storyContainerStyle}>
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Mariana 💚 Cliente" status="en línea" emoji="🧥" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Hola Rodri! Todo bien?" isLeft={true} />
                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Rodri boludo GRACIAS 🙌 desde q instalé nevux subí el ticket promedio 35% en 3 semanas. La app es una locura, se instala re fácil y la tabla de talles es un 10.
                    </div>
                  </div>
                </div>
                <WhatsAppFooter />
              </div>
            </div>
          )}

          {/* RENDERING NEVUXBOT */}
          {activeDestacada === "nevuxbot" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🤖</div>
                  <h2 style={storyTitleStyle}>NevuxBot IA:<br />El Vendedor 24/7</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING ANALYTICS */}
          {activeDestacada === "analytics" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>📊</div>
                  <h2 style={storyTitleStyle}>ROI Tracker:<br />Facturación en Vivo</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING BLACKFRIDAY */}
          {activeDestacada === "blackfriday" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔥</div>
                  <h2 style={storyTitleStyle}>Black Friday activado con <span style={{ color: "#fbbf24" }}>1 clic</span></h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING ESTILO MARCA */}
          {activeDestacada === "estilomarca" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎨</div>
                  <h2 style={storyTitleStyle}>Tus estilos, tus colores. <span style={{ color: "#10B981" }}>Auto-detectables</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING CROSS-SELLING */}
          {activeDestacada === "crossselling" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🧠</div>
                  <h2 style={storyTitleStyle}>Recomendaciones IA: <span style={{ color: "#10B981" }}>Venta Cruzada</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING MULTI-IDIOMA */}
          {activeDestacada === "multiidioma" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🌎</div>
                  <h2 style={storyTitleStyle}>Multi-Idioma con IA: <span style={{ color: "#10B981" }}>Vende sin fronteras</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING VOZ */}
          {activeDestacada === "voz" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎙️</div>
                  <h2 style={storyTitleStyle}>Búsqueda por Voz: <span style={{ color: "#10B981" }}>Comprar hablando</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* 🤝 DESTACADA 11: VENDEDOR VIRTUAL IA */}
          {activeDestacada === "vendedor" && (
            <div style={storyContainerStyle}>
              <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                👇 Sacale captura de pantalla vertical a cada tarjeta para armar tu destacada final
              </div>

              {/* H1: PORTADA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🤝</div>
                  <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.2)", border: "1.5px solid #10B981", color: "#ffffff", fontSize: "10px", fontWeight: 900, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.05em" }}>VENDEDOR CON INTELIGENCIA ARTIFICIAL</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, margin: "0 0 16px 0", letterSpacing: "-0.03em" }}>Vendedor Virtual IA: <span style={{ color: "#10B981" }}>Ventas 24/7</span>.</h2>
                  <p style={{ fontSize: "14px", color: "#d1fae5", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>Un agente inteligente que conoce tu catálogo completo, asesora a tus clientes y cierra compras mientras dormís.</p>
                </div>
                <div style={storyBottomSwipe}>¿Cómo funciona? Deslizá ➔</div>
              </div>

              {/* H2: EL PROBLEMA NOCHE Y DEMORAS */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>⏰❌</div>
                  <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>VENTAS PERDIDAS POR DEMORA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>Responder a las 2 AM es imposible</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#fca5a5", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>El 40% de las compras online ocurren de noche o fines de semana. Si un cliente no recibe respuesta en 5 minutos, compra en otra tienda.</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>Perdés ventas todos los días por no estar online.</p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H3: ASESORAMIENTO REAL */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🧠</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>ENTRENADO CON TU TIENDA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>Sabe de precios, stock, medidas y envíos</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>Nevux sincroniza tu catálogo en tiempo real. La IA responde como tu mejor empleado de mostrador: con empatía, fotos y enlaces directos.</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#34d399", fontWeight: 900, margin: 0 }}>No es un bot rígido, es un vendedor real 🤝</p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H4: CIERRE ADENTRO DEL CHAT */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>💬</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>CONVERSIÓN DIRECTA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>Arma el pedido adentro del chat</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>El cliente indica lo que quiere y la IA genera el link de pago final listo con descuentos y cupones aplicados.</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>Fricción cero = Cierre instantáneo.</p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H5: +85% DUDAS RESUELTAS */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>📈</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>AUTONOMÍA ABSOLUTA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>85% de consultas resueltas sin tu tiempo</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>Ahorrá 4 horas diarias de contestar los mismos mensajes. Tu negocio escala mientras vos te enfocás en crecer.</p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Prueba gratis ➔</div>
              </div>

              {/* H6: CTA FINAL ROADMAP */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>La suite más potente de Tiendanube</h2>
                  <p style={{ fontSize: "14px", color: "#10B981", fontWeight: 800, margin: "0 0 16px 0" }}>Próximamente en Nevux 🤝</p>
                  <div style={{ ...bubbleDarkStyle, border: "2px solid #10B981", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)" }}>
                    <p style={{ fontSize: "12px", color: "#ffffff", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>Sumate hoy a Nevux por $30.000 ARS/mes, aprovechá tus 7 días gratis y asegurá tu lugar en todas las fases del roadmap.</p>
                  </div>
                </div>
                <div style={{ ...storyBottomSwipe, color: "#34d399", fontWeight: 900 }}>Probá Nevux en: nexus2026-gx7e.vercel.app</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PORTADAS DESTACADAS CIRCULARES */}
      {activeTab === "covers" && (
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
            👇 Sacale captura de pantalla en vertical para las tapas de tus historias destacadas en Instagram.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))",
              gap: "16px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🚨</span></div><span style={coverLabelStyle}>1. El Problema</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>⚡</span></div><span style={coverLabelStyle}>2. La Solución</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>💬</span></div><span style={coverLabelStyle}>3. Testimonios</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🤖</span></div><span style={coverLabelStyle}>4. NevuxBot IA</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>📊</span></div><span style={coverLabelStyle}>5. Analytics ROI</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🔥</span></div><span style={coverLabelStyle}>6. Modo Fechas</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🎨</span></div><span style={coverLabelStyle}>7. Estilo Marca</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🧠</span></div><span style={coverLabelStyle}>8. Cross-Selling</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🌎</span></div><span style={coverLabelStyle}>9. Multi-Idioma</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🎙️</span></div><span style={coverLabelStyle}>10. Búsqueda Voz</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🤝</span></div><span style={coverLabelStyle}>11. Vendedor IA</span></div>
          </div>
        </div>
      )}
    </div>
  );
  }
