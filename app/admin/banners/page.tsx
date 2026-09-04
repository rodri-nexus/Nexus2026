"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  Bot,
  TrendingUp,
  Clock,
  Sparkles,
  BarChart3,
  Smartphone,
  Check,
  Palette,
  Eye,
  Settings,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "partners" | "stories" | "covers";
type StoryDestacada = "problema" | "solucion" | "testimonios" | "nevuxbot" | "analytics" | "blackfriday" | "estilomarca";

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("stories");
  const [lang, setLang] = useState<"es" | "pt">("pt");
  const [activeDestacada, setActiveDestacada] = useState<StoryDestacada>("estilomarca"); // Por defecto en la nueva destaca para capturar rápido

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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
        <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#10B981", margin: 0 }}>
          📷 Generador de Contenido Visual Nevux
        </h1>
        <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0, lineHeight: "1.4" }}>
          Seleccioná qué tipo de contenido querés generar y sacale captura desde tu celular.
        </p>

        <div style={{ display: "flex", gap: "6px", background: "#061a14", padding: "4px", borderRadius: "12px", width: "100%", overflowX: "auto" }}>
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

      {/* TAB 1: BANNERS PARTNERS (INTACTO) */}
      {activeTab === "partners" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ display: "flex", gap: "8px", background: "#0b2920", padding: "4px", borderRadius: "12px" }}>
            <button onClick={() => setLang("es")} style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: !isPt ? "#10B981" : "transparent", color: !isPt ? "#ffffff" : "#a7f3d0" }}>
              🇦🇷 Español
            </button>
            <button onClick={() => setLang("pt")} style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: isPt ? "#10B981" : "transparent", color: isPt ? "#ffffff" : "#a7f3d0" }}>
              🇧🇷 Português
            </button>
          </div>
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 200px", zIndex: 2 }}>
              <div style={badgeStyle}>🤖 NEVUXBOT</div>
              <h2 style={bannerTitleStyle}>{isPt ? "O primeiro CRM com IA" : "El primer CRM con IA"}</h2>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAS INSTAGRAM */}
      {activeTab === "stories" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "flex", gap: "6px", background: "#0b2920", padding: "6px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.3)", width: "100%", overflowX: "auto" }}>
            <button onClick={() => setActiveDestacada("problema")} style={subTabStyle(activeDestacada === "problema")}>🚨 1. Dolor</button>
            <button onClick={() => setActiveDestacada("solucion")} style={subTabStyle(activeDestacada === "solucion")}>⚡ 2. Solución</button>
            <button onClick={() => setActiveDestacada("testimonios")} style={subTabStyle(activeDestacada === "testimonios")}>💬 3. Chats</button>
            <button onClick={() => setActiveDestacada("nevuxbot")} style={subTabStyle(activeDestacada === "nevuxbot")}>🤖 4. NevuxBot</button>
            <button onClick={() => setActiveDestacada("analytics")} style={subTabStyle(activeDestacada === "analytics")}>📊 5. Analytics</button>
            <button onClick={() => setActiveDestacada("blackfriday")} style={subTabStyle(activeDestacada === "blackfriday")}>🔥 6. Fechas</button>
            <button onClick={() => setActiveDestacada("estilomarca")} style={subTabStyle(activeDestacada === "estilomarca")}>🎨 7. Marca</button>
          </div>

          {/* Placeholders de las destacadas ya terminadas */}
          {activeDestacada !== "estilomarca" && activeDestacada !== "problema" && activeDestacada !== "solucion" && activeDestacada !== "testimonios" && activeDestacada !== "nevuxbot" && activeDestacada !== "analytics" && activeDestacada !== "blackfriday" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "38px", marginBottom: "10px" }}>🛠️</div>
              <h3 style={{ fontSize: "18px", color: "#10B981", margin: "0 0 6px 0", fontWeight: 800 }}>Nevux Destacadas</h3>
              <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>Ya capturadas con éxito en los commits anteriores.</p>
            </div>
          )}

          {/* RENDERING PROBLEMA */}
          {activeDestacada === "problema" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
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
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
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
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
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
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
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
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔥</div>
                  <h2 style={storyTitleStyle}>Black Friday activado con <span style={{ color: "#fbbf24" }}>1 clic</span></h2>
                </div>
              </div>
            </div>
          )}

          {/* 🎨 DESTACADA 7: ESTILO MARCA AUTOMÁTICO (6 HISTORIAS) */}
          {activeDestacada === "estilomarca" && (
            <div style={storyContainerStyle}>
              <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                👇 Sacale captura de pantalla vertical a cada tarjeta para armar tu destacada
              </div>

              {/* H1: PORTADA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎨</div>
                  <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.2)", border: "1.5px solid #10B981", color: "#ffffff", fontSize: "10px", fontWeight: 900, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.05em" }}>
                    IDENTIDAD CORPORATIVA
                  </div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, margin: "0 0 16px 0", letterSpacing: "-0.03em" }}>
                    Tus estilos, tus colores. <span style={{ color: "#10B981" }}>Auto-detectables</span>.
                  </h2>
                  <p style={{ fontSize: "14px", color: "#d1fae5", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    Fase 4: El único editor que lee el diseño de tu Tiendanube y aplica tu identidad a todos los widgets en 1 segundo.
                  </p>
                </div>
                <div style={storyBottomSwipe}>¿Cómo funciona? Deslizá ➔</div>
              </div>

              {/* H2: EL DOLOR MANUAL */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎨❌</div>
                  <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    EL DOLOR DE CONFIGURAR
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Nadie quiere perder tiempo copiando códigos HEX
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#fca5a5", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                      En otras aplicaciones tenés que abrir widget por widget, pegar el color de tu marca (#F100B9, etc.) y configurar bordes y textos de manera infinita. Es agotador.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    El desorden visual espanta a tus clientes móviles.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H3: AUTO-DETECCION INTELIGENTE */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>👁️</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    TECNOLOGÍA DE LECTURA NEVUX
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Nevux lee tu logo y aplica tu marca
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Al sincronizar tu Tiendanube, nuestro motor inteligente detecta tus colores corporativos, tipografías y el redondeado de tus botones nativos de forma automática.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#34d399", fontWeight: 900, margin: 0 }}>
                    Identidad perfecta sin esfuerzo 🎨
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H4: 1 CLIC APLICAR */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>✨</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    SIMPLICIDAD RADICAL
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Botón "Aplicar Estilo Marca" en cada editor
                  </h3>
                  <div style={{ background: "rgba(0, 0, 0, 0.5)", border: "2px solid #10B981", borderRadius: "16px", padding: "14px", marginBottom: "14px", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 900, color: "#10B981", marginBottom: "4px" }}>
                      🎨 Aplicar mi identidad de marca
                    </div>
                    <div style={{ fontSize: "10px", color: "#a7f3d0", fontWeight: 700 }}>
                      Sincroniza todos los widgets en 1 clic
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    Tu ruleta, tabla de talles, bundles y banners se unifican al instante.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H5: PROFESIONALISMO MOBILE */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>📈</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>CONFIANZA DE COMPRA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Consistencia visual = 4x más ventas
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Cuando los widgets parecen integrados de forma nativa por tu propia marca, el usuario del celular siente seguridad y compra de inmediato sin desconfiar de popups externos.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Prueba gratis ➔</div>
              </div>

              {/* H6: CTA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    La única suite unificada estéticamente
                  </h2>
                  <p style={{ fontSize: "14px", color: "#10B981", fontWeight: 800, margin: "0 0 16px 0" }}>
                    Próximamente en Nevux 🎨
                  </p>
                  <div style={{ ...bubbleDarkStyle, border: "2px solid #10B981", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)" }}>
                    <p style={{ fontSize: "12px", color: "#ffffff", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>
                      Sumate hoy a Nevux, disfrutá de la suite de 27 widgets y asegurá tu acceso gratis de por vida a esta y todas las actualizaciones.
                    </p>
                  </div>
                </div>
                <div style={{ ...storyBottomSwipe, color: "#34d399", fontWeight: 900 }}>
                  Empezá gratis en: nexus2026-gx7e.vercel.app
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* 🎨 TAB 3: PORTADAS DESTACADAS CIRCULARES (AHORA CON 7 PORTADAS) */}
      {activeTab === "covers" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
          <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
            👇 Sacale captura de pantalla en vertical para las tapas de tus historias destacadas en Instagram.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "20px", width: "100%", justifyContent: "center" }}>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}><span style={{ fontSize: "44px" }}>🚨</span></div>
              <span style={coverLabelStyle}>1. El Problema</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}><span style={{ fontSize: "44px" }}>⚡</span></div>
              <span style={coverLabelStyle}>2. La Solución</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}><span style={{ fontSize: "44px" }}>💬</span></div>
              <span style={coverLabelStyle}>3. Testimonios</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}><span style={{ fontSize: "44px" }}>🤖</span></div>
              <span style={coverLabelStyle}>4. NevuxBot IA</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}><span style={{ fontSize: "44px" }}>📊</span></div>
              <span style={coverLabelStyle}>5. Analytics ROI</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}><span style={{ fontSize: "44px" }}>🔥</span></div>
              <span style={coverLabelStyle}>6. Modo Fechas</span>
            </div>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}><span style={{ fontSize: "44px" }}>🎨</span></div>
              <span style={coverLabelStyle}>7. Estilo Marca</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════
   ESTILOS PREMIUM DE HISTORIAS INSTAGRAM (9:16)
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   ESTILOS ESPECÍFICOS DEL SIMULADOR DE CHATS (9:16)
═══════════════════════════════════════════ */
const whatsappFrameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  height: "580px",
  background: "#efe7e3 url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png') repeat",
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

/* ═══════════════════════════════════════════
   ESTILOS DE PORTADAS CIRCULARES (TAPAS)
═══════════════════════════════════════════ */
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
  fontSize: "11.5px",
  fontWeight: 800,
  color: "#ffffff",
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
