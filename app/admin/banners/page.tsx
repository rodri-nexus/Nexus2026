"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "partners" | "stories" | "covers";
type StoryDestacada = "problema" | "solucion" | "testimonios" | "nevuxbot" | "analytics" | "blackfriday";

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("stories");
  const [lang, setLang] = useState<"es" | "pt">("pt");
  const [activeDestacada, setActiveDestacada] = useState<StoryDestacada>("blackfriday");

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

      {/* TAB 1: BANNERS PARTNERS */}
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
          </div>

          {/* Placeholders de las destacadas ya terminadas */}
          {activeDestacada === "problema" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "38px", marginBottom: "10px" }}>🚨</div>
              <h3 style={{ fontSize: "18px", color: "#10B981", margin: "0 0 6px 0", fontWeight: 800 }}>Destacada 1: El Problema</h3>
              <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>Ya está lista y capturada. ¡Continuamos con las nuevas!</p>
            </div>
          )}

          {activeDestacada === "solucion" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "38px", marginBottom: "10px" }}>⚡</div>
              <h3 style={{ fontSize: "18px", color: "#10B981", margin: "0 0 6px 0", fontWeight: 800 }}>Destacada 2: La Solución</h3>
              <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>Ya está lista y capturada. ¡Continuamos con las nuevas!</p>
            </div>
          )}

          {activeDestacada === "testimonios" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "38px", marginBottom: "10px" }}>💬</div>
              <h3 style={{ fontSize: "18px", color: "#10B981", margin: "0 0 6px 0", fontWeight: 800 }}>Destacada 3: Testimonios WhatsApp</h3>
              <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>Ya está lista y capturada. ¡Continuamos con las nuevas!</p>
            </div>
          )}

          {activeDestacada === "nevuxbot" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "38px", marginBottom: "10px" }}>🤖</div>
              <h3 style={{ fontSize: "18px", color: "#10B981", margin: "0 0 6px 0", fontWeight: 800 }}>Destacada 4: NevuxBot IA</h3>
              <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>Ya está lista y capturada. ¡Continuamos con las nuevas!</p>
            </div>
          )}

          {activeDestacada === "analytics" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "38px", marginBottom: "10px" }}>📊</div>
              <h3 style={{ fontSize: "18px", color: "#10B981", margin: "0 0 6px 0", fontWeight: 800 }}>Destacada 5: Analytics ROI</h3>
              <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>Ya está lista y capturada. ¡Continuamos con las nuevas!</p>
            </div>
          )}

          {/* 🔥 DESTACADA 6: MODO BLACK FRIDAY / FECHAS ESPECIALES (6 HISTORIAS) */}
          {activeDestacada === "blackfriday" && (
            <div style={storyContainerStyle}>
              <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                👇 Sacale captura de pantalla vertical a cada tarjeta para armar tu destacada
              </div>

              {/* HISTORIA 1: PORTADA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔥</div>
                  <div style={{ display: "inline-block", background: "rgba(220, 38, 38, 0.25)", border: "1.5px solid #ef4444", color: "#ffffff", fontSize: "10px", fontWeight: 900, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.05em" }}>
                    KILLER FEATURE PRÓXIMA
                  </div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, margin: "0 0 16px 0", letterSpacing: "-0.03em" }}>
                    Black Friday activado con <span style={{ color: "#fbbf24" }}>1 clic</span>
                  </h2>
                  <p style={{ fontSize: "14px", color: "#d1fae5", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    Modo Fechas Especiales: Configura TODA tu tienda para Black Friday, Hot Sale, Navidad y más en solo 1 clic.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Deslizá para ver la magia ➔</div>
              </div>

              {/* HISTORIA 2: EL PROBLEMA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>😩</div>
                  <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    LA REALIDAD ACTUAL
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Configurar una campaña te lleva 3 horas
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#fca5a5", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                      ❌ Entrar widget por widget<br />
                      ❌ Cambiar colores a rojo/negro<br />
                      ❌ Actualizar textos de banners<br />
                      ❌ Configurar la cuenta regresiva<br />
                      ❌ Ajustar cupones y ruleta
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    Un dolor de cabeza en cada evento importante.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* HISTORIA 3: LA SOLUCIÓN */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>✨</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    NEVUX LO HACE POR VOS
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Un botón mágico que activa TODO
                  </h3>
                  <div style={{ background: "rgba(0, 0, 0, 0.5)", border: "2px solid #10B981", borderRadius: "16px", padding: "16px", marginBottom: "14px", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)" }}>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: "#10B981", marginBottom: "6px" }}>
                      🔥 Activar Black Friday
                    </div>
                    <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
                      Configura 5 widgets automáticamente
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    Cuenta regresiva, banner, cupones y ruleta: todo listo en 3 segundos.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* HISTORIA 4: MODOS PRECONFIGURADOS */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎨</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    MODOS PRECONFIGURADOS
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Un modo para cada fecha comercial
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                    <div style={modoPresetStyle}>🔥 <b>Black Friday</b> — Estética dark & fuego</div>
                    <div style={modoPresetStyle}>⚡ <b>Hot Sale / Cyber Monday</b> — Eléctrico azul</div>
                    <div style={modoPresetStyle}>🎄 <b>Navidad</b> — Festivo rojo & dorado</div>
                    <div style={modoPresetStyle}>💐 <b>Día de la Madre/Padre</b> — Regalo & bundles</div>
                    <div style={modoPresetStyle}>🏷️ <b>Liquidación Temporada</b> — Clearance urgente</div>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* HISTORIA 5: DESACTIVACIÓN 1 CLIC */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>↩️</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    VUELVE A LA NORMALIDAD EN 1 CLIC
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Termina la campaña, se desactiva sola
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Cuando termina la fecha del evento, tu tienda vuelve automáticamente a su diseño original. <strong style={{ color: "#ffffff" }}>Cero riesgo de olvidarte configuraciones activas</strong>.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#10B981", fontWeight: 800, margin: 0 }}>
                    Trabajás con la tranquilidad total de que todo se auto-gestiona.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* HISTORIA 6: CTA FINAL */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>🚀</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 12px 0" }}>
                    Preparate para arrasar en cada fecha comercial
                  </h2>
                  <p style={{ fontSize: "14px", color: "#fbbf24", fontWeight: 800, margin: "0 0 16px 0" }}>
                    Próximamente en Nevux 🔥
                  </p>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "2px solid #10B981", borderRadius: "16px", padding: "14px", marginBottom: "16px", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)" }}>
                    <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>
                      Sumate hoy a <span style={{ color: "#34d399", fontWeight: 900 }}>Nevux</span> y accedé sin costo extra a esta y todas las próximas killer features apenas se lancen.
                    </p>
                  </div>
                </div>
                <div style={{ ...storyBottomSwipe, color: "#34d399", fontWeight: 900 }}>
                  Comenzá tu prueba en: nexus2026-gx7e.vercel.app
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 3: PORTADAS DESTACADAS CIRCULARES (AHORA CON 6 PORTADAS) */}
      {activeTab === "covers" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
          <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
            👇 Sacale captura de pantalla en vertical para las tapas de tus historias destacadas en Instagram.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "20px", width: "100%", justifyContent: "center" }}>
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
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTES VISUALES WHATSAPP
═══════════════════════════════════════════ */
function WhatsAppHeader({ name, status, emoji }: { name: string; status: string; emoji: string }) {
  return (
    <div style={{ width: "100%", background: "#075e54", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ChevronLeft size={20} color="#ffffff" style={{ cursor: "pointer" }} />
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#eceff1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{emoji}</div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>{name}</div>
          <div style={{ fontSize: "10px", color: "#a5d6a7", fontWeight: 500 }}>{status}</div>
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
    <div style={{ width: "100%", background: "#f0f0f0", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", borderTop: "1px solid #e0e0e0", boxSizing: "border-box", zIndex: 10 }}>
      <div style={{ flex: 1, background: "#ffffff", borderRadius: "20px", padding: "8px 14px", fontSize: "12px", color: "#999999", textAlign: "left", border: "1px solid #e0e0e0" }}>
        Escribí un mensaje...
      </div>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#075e54", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "16px" }}>🎤</div>
    </div>
  );
}

function BlurBubble({ text, isLeft }: { text: string; isLeft: boolean }) {
  return (
    <div style={{ alignSelf: isLeft ? "flex-start" : "flex-end", background: isLeft ? "#ffffff" : "#dcf8c6", color: "#303030", padding: "6px 10px", borderRadius: isLeft ? "0px 10px 10px 10px" : "10px 0px 10px 10px", maxWidth: "75%", fontSize: "11px", lineHeight: "1.4", filter: "blur(5px)", opacity: 0.35, pointerEvents: "none", boxShadow: "0 1px 1px rgba(0,0,0,0.1)", wordBreak: "break-word", position: "relative" }}>
      {text}
      <div style={{ fontSize: "8px", color: "#999999", textAlign: "right", marginTop: "2px" }}>12:34</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ESTILOS
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

const bubbleDarkStyle: React.CSSProperties = {
  background: "rgba(0, 0, 0, 0.4)",
  border: "1.5px solid rgba(16, 185, 129, 0.4)",
  borderRadius: "16px",
  padding: "14px",
  textAlign: "left",
  marginBottom: "14px",
};

const modoPresetStyle: React.CSSProperties = {
  background: "rgba(0, 0, 0, 0.4)",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "11.5px",
  color: "#d1fae5",
  textAlign: "left",
  fontWeight: 500,
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
