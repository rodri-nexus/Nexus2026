"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "partners" | "stories" | "covers";
type StoryDestacada =
  | "problema"
  | "solucion"
  | "testimonios"
  | "nevuxbot"
  | "analytics"
  | "blackfriday"
  | "estilomarca"
  | "crossselling";

/* ═══════════════════════════════════════════
   ESTILOS Y HELPERS
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

const myHighlightBubbleStyle: React.CSSProperties = {
  alignSelf: "flex-end",
  background: "#e1ffc7",
  color: "#303030",
  padding: "10px 14px",
  borderRadius: "14px 0px 14px 14px",
  maxWidth: "85%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.08)",
  textAlign: "left",
  position: "relative",
};

const whatsappTimeStyle: React.CSSProperties = {
  fontSize: "8px",
  color: "#666666",
  textAlign: "right",
  marginTop: "4px",
  fontWeight: 600,
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
  const [activeTab, setActiveTab] = useState<TabId>("stories");
  const [lang, setLang] = useState<"es" | "pt">("pt");
  const [activeDestacada, setActiveDestacada] =
    useState<StoryDestacada>("crossselling"); // Por defecto en la nueva

  const isPt = lang === "pt";

  const tabs: { id: TabId; label: string; icon: string }[] = [
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
          maxWidth: "650px",
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
          Seleccioná qué tipo de contenido querés generar y sacale captura desde
          tu celular.
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

      {/* TAB 1: BANNERS PARTNERS */}
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

      {/* TAB 2: HISTORIAS INSTAGRAM */}
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
            <button
              onClick={() => setActiveDestacada("problema")}
              style={subTabStyle(activeDestacada === "problema")}
            >
              🚨 1. Dolor
            </button>
            <button
              onClick={() => setActiveDestacada("solucion")}
              style={subTabStyle(activeDestacada === "solucion")}
            >
              ⚡ 2. Solución
            </button>
            <button
              onClick={() => setActiveDestacada("testimonios")}
              style={subTabStyle(activeDestacada === "testimonios")}
            >
              💬 3. Chats
            </button>
            <button
              onClick={() => setActiveDestacada("nevuxbot")}
              style={subTabStyle(activeDestacada === "nevuxbot")}
            >
              🤖 4. NevuxBot
            </button>
            <button
              onClick={() => setActiveDestacada("analytics")}
              style={subTabStyle(activeDestacada === "analytics")}
            >
              📊 5. Analytics
            </button>
            <button
              onClick={() => setActiveDestacada("blackfriday")}
              style={subTabStyle(activeDestacada === "blackfriday")}
            >
              🔥 6. Fechas
            </button>
            <button
              onClick={() => setActiveDestacada("estilomarca")}
              style={subTabStyle(activeDestacada === "estilomarca")}
            >
              🎨 7. Marca
            </button>
            <button
              onClick={() => setActiveDestacada("crossselling")}
              style={subTabStyle(activeDestacada === "crossselling")}
            >
              🧠 8. Cross-Sell
            </button>
          </div>

          {/* RENDERING PROBLEMA */}
          {activeDestacada === "problema" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>
                    🛑
                  </div>
                  <div style={storyBadgeStyle}>REALIDAD DEL E-COMMERCE</div>
                  <h2 style={storyTitleStyle}>
                    ¿Por qué tu tienda vende{" "}
                    <span
                      style={{
                        color: "#fca5a5",
                        textDecoration: "underline",
                      }}
                    >
                      menos
                    </span>
                    ?
                  </h2>
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
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>
                    ⚡
                  </div>
                  <div style={storyBadgeLightStyle}>LA SOLUCIÓN DEFINITIVA</div>
                  <h2 style={storyTitleLightStyle}>
                    Una sola app.
                    <br />
                    27 widgets de conversión.
                  </h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING TESTIMONIOS WHATSAPP */}
          {activeDestacada === "testimonios" && (
            <div style={storyContainerStyle}>
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader
                  name="Mariana 💚 Cliente"
                  status="en línea"
                  emoji="🧥"
                />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Hola Rodri! Todo bien?" isLeft={true} />
                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Rodri boludo GRACIAS 🙌 desde q instalé nevux subí el
                      ticket promedio 35% en 3 semanas. La app es una locura, se
                      instala re fácil y la tabla de talles es un 10.
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
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>
                    🤖
                  </div>
                  <h2 style={storyTitleStyle}>
                    NevuxBot IA:
                    <br />
                    El Vendedor 24/7
                  </h2>
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
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>
                    📊
                  </div>
                  <h2 style={storyTitleStyle}>
                    ROI Tracker:
                    <br />
                    Facturación en Vivo
                  </h2>
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
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                    🔥
                  </div>
                  <h2 style={storyTitleStyle}>
                    Black Friday activado con{" "}
                    <span style={{ color: "#fbbf24" }}>1 clic</span>
                  </h2>
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
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>
                    🎨
                  </div>
                  <h2 style={storyTitleStyle}>
                    Tus estilos, tus colores.{" "}
                    <span style={{ color: "#10B981" }}>Auto-detectables</span>.
                  </h2>
                </div>
              </div>
            </div>
          )}

          {/* 🧠 DESTACADA 8: CROSS-SELLING PREDICTIVO CON IA (6 HISTORIAS) */}
          {activeDestacada === "crossselling" && (
            <div style={storyContainerStyle}>
              <div
                style={{
                  textAlign: "center",
                  color: "#a7f3d0",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                👇 Sacale captura de pantalla vertical a cada tarjeta para armar
                tu destacada
              </div>

              {/* H1: PORTADA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>
                    🧠
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1.5px solid #10B981",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 900,
                      padding: "5px 12px",
                      borderRadius: "999px",
                      marginBottom: "16px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    INTELIGENCIA ARTIFICIAL DE VENTA
                  </div>
                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.15,
                      margin: "0 0 16px 0",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Recomendaciones IA:{" "}
                    <span style={{ color: "#10B981" }}>Venta Cruzada</span>.
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#d1fae5",
                      lineHeight: 1.5,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    Fase 5: Un algoritmo que analiza el comportamiento del cliente y le muestra exactamente lo que quiere comprar.
                  </p>
                </div>
                <div style={storyBottomSwipe}>¿Cómo funciona? Deslizá ➔</div>
              </div>

              {/* H2: EL PROBLEMA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                    🤷‍♂️
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#fbbf24",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}
                  >
                    EL PROBLEMA TRADICIONAL
                  </div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.2,
                      margin: "0 0 14px 0",
                    }}
                  >
                    Los "relacionados" manuales no convierten
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#fca5a5",
                        margin: 0,
                        lineHeight: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      En Tiendanube tenés que cargar manualmente qué producto se relaciona con cuál. Si tenés 100 productos, es una tarea titánica y casi nadie le presta atención.
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#ffffff",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    Resultado: El cliente compra solo 1 cosa y se va.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H3: LA IA PREDICTIVA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                    ⚡
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#a7f3d0",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}
                  >
                    APRENDIZAJE AUTOMÁTICO
                  </div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.25,
                      margin: "0 0 12px 0",
                    }}
                  >
                    La IA aprende de cada visitante
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#d1fae5",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Nevux analiza qué miró, qué agregó al carrito y qué compraron otros usuarios similares, mostrando una sugerencia irresistible personalizada en tiempo real.
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#34d399",
                      fontWeight: 900,
                      margin: 0,
                    }}
                  >
                    Venta cruzada 100% automatizada 🛍️
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H4: IMPACTO EN FACTURACION */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                    📈
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#a7f3d0",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}
                  >
                    MÉTRICAS COMPROBADAS
                  </div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.25,
                      margin: "0 0 12px 0",
                    }}
                  >
                    +25% en Ticket Promedio garantizado
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#d1fae5",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Cuando la sugerencia es precisa (ej: llevás un jean y te sugiere el cinturón exacto de tu talle), 1 de cada 4 compradores suma el producto sin dudarlo.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H5: INTEGRACION NATIVA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                    📱
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#a7f3d0",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}
                  >
                    DISEÑO NO INVASIVO
                  </div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.25,
                      margin: "0 0 12px 0",
                    }}
                  >
                    Aparece justo en el momento correcto
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#d1fae5",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Debajo del botón de compra o dentro del carrito flotante antes de pagar. El cliente suma el producto con 1 toque sin recargar la página.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Prueba gratis ➔</div>
              </div>

              {/* H6: CTA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                    🚀
                  </div>
                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.2,
                      margin: "0 0 14px 0",
                    }}
                  >
                    El poder de la IA en tu Tiendanube
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#10B981",
                      fontWeight: 800,
                      margin: "0 0 16px 0",
                    }}
                  >
                    Próximamente en Nevux 🧠
                  </p>
                  <div
                    style={{
                      ...bubbleDarkStyle,
                      border: "2px solid #10B981",
                      boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#ffffff",
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      Sumate hoy a Nevux, disfrutá de la suite de 27 widgets y
                      asegurá tu acceso gratis de por vida a esta y todas las
                      actualizaciones.
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    ...storyBottomSwipe,
                    color: "#34d399",
                    fontWeight: 900,
                  }}
                >
                  Empezá gratis en: nexus2026-gx7e.vercel.app
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PORTADAS DESTACADAS CIRCULARES (AHORA CON 8 PORTADAS) */}
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
          <div
            style={{
              textAlign: "center",
              color: "#a7f3d0",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            👇 Sacale captura de pantalla en vertical para las tapas de tus
            historias destacadas en Instagram.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              gap: "20px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>🚨</span>
              </div>
              <span style={coverLabelStyle}>1. El Problema</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>⚡</span>
              </div>
              <span style={coverLabelStyle}>2. La Solución</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>💬</span>
              </div>
              <span style={coverLabelStyle}>3. Testimonios</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>🤖</span>
              </div>
              <span style={coverLabelStyle}>4. NevuxBot IA</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>📊</span>
              </div>
              <span style={coverLabelStyle}>5. Analytics ROI</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>🔥</span>
              </div>
              <span style={coverLabelStyle}>6. Modo Fechas</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>🎨</span>
              </div>
              <span style={coverLabelStyle}>7. Estilo Marca</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "44px" }}>🧠</span>
              </div>
              <span style={coverLabelStyle}>8. Cross-Selling</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
