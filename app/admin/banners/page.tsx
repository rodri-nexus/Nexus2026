"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  ShoppingCart,
  HelpCircle,
  ZapOff,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "partners" | "stories" | "covers";
type StoryDestacada = "problema" | "solucion" | "testimonios";

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("stories");
  const [lang, setLang] = useState<"es" | "pt">("pt");
  const [activeDestacada, setActiveDestacada] = useState<StoryDestacada>("problema");

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
      {/* ═══════════════════════════════════════════
          PANEL DE CONTROL SUPERIOR
      ═══════════════════════════════════════════ */}
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

        {/* TABS DE NAVEGACIÓN */}
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

      {/* ═══════════════════════════════════════════
          TAB 1: BANNERS PARTNERS
      ═══════════════════════════════════════════ */}
      {activeTab === "partners" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
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
              <div style={badgeStyle}>🤖 NEVUXBOT AI</div>
              <h2 style={bannerTitleStyle}>{isPt ? "O primeiro CRM de Carrinhos com IA" : "El primer CRM de Carritos con IA"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Detecte vendas perdidas, crie mensagens persuasivas com Gemini AI e recupere via WhatsApp ou E-mail." : "Detectá ventas perdidas, creá copys persuasivos con Gemini AI y recuperá por WhatsApp o Email."}</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB 2: HISTORIAS DESTACADAS DE INSTAGRAM (9:16)
      ═══════════════════════════════════════════ */}
      {activeTab === "stories" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          
          {/* Sub-selector de Destacadas */}
          <div style={{ display: "flex", gap: "8px", background: "#0b2920", padding: "6px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.3)", width: "100%", overflowX: "auto" }}>
            <button
              onClick={() => setActiveDestacada("problema")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                background: activeDestacada === "problema" ? "#10B981" : "transparent",
                color: activeDestacada === "problema" ? "#ffffff" : "#a7f3d0",
                whiteSpace: "nowrap",
              }}
            >
              🚨 1. El Problema (7)
            </button>
            <button
              onClick={() => setActiveDestacada("solucion")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                background: activeDestacada === "solucion" ? "#10B981" : "transparent",
                color: activeDestacada === "solucion" ? "#ffffff" : "#a7f3d0",
                whiteSpace: "nowrap",
              }}
            >
              ⚡ 2. La Solución (8)
            </button>
            <button
              onClick={() => setActiveDestacada("testimonios")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                background: activeDestacada === "testimonios" ? "#10B981" : "transparent",
                color: activeDestacada === "testimonios" ? "#ffffff" : "#a7f3d0",
                whiteSpace: "nowrap",
              }}
            >
              💬 3. Testimonios (6)
            </button>
          </div>

          {/* ═══════════════════════════════════════════
              DESTACADA 1: 🚨 EL PROBLEMA (FONDO VERDE ESMERALDA)
          ═══════════════════════════════════════════ */}
          {activeDestacada === "problema" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%", alignItems: "center" }}>
              <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                👇 Sacale captura de pantalla en vertical a cada tarjeta para armar tu destacada
              </div>

              {/* HISTORIA 1: PORTADA IMPACTO */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>🛑</div>
                  <div style={{ display: "inline-block", background: "rgba(239, 68, 68, 0.2)", border: "1.5px solid #ef4444", color: "#ffffff", fontSize: "10px", fontWeight: 900, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.05em" }}>
                    REALIDAD DEL E-COMMERCE
                  </div>
                  <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, margin: "0 0 16px 0", letterSpacing: "-0.03em" }}>
                    ¿Por qué tu tienda vende <span style={{ color: "#fca5a5", textDecoration: "underline" }}>menos</span> de lo que podría?
                  </h2>
                  <p style={{ fontSize: "14px", color: "#d1fae5", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    Si tenés visitas pero no se reflejan en tu facturación, hay 3 fugas silenciosas que te están costando miles de pesos.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Deslizá para ver las fugas ➔</div>
              </div>

              {/* HISTORIA 2: CARRO ABANDONADO */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", fontWeight: 900, color: "#fca5a5", fontFamily: "monospace", marginBottom: "6px", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                    7 de cada 10
                  </div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "18px" }}>
                    FUGA #1 — CARRITOS ABANDONADOS
                  </div>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1.5px solid rgba(16, 185, 129, 0.4)", borderRadius: "16px", padding: "16px", textAlign: "left", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <ShoppingCart size={20} color="#fca5a5" />
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#fff" }}>El cliente llena el carrito...</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.45 }}>
                      Pero en el último segundo le surge una duda, se distrae con otra app o pospone la compra y <strong style={{ color: "#ffffff" }}>nunca más vuelve</strong>.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    Perdés ventas de gente que <span style={{ color: "#a7f3d0", textDecoration: "underline" }}>ya quería comprarte</span>.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente fuga ➔</div>
              </div>

              {/* HISTORIA 3: TICKET PROMEDIO BAJO */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>📉</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    FUGA #2 — TICKET PROMEDIO ESTANCADO
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Tus clientes compran de a 1 solo producto
                  </h3>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1.5px solid rgba(16, 185, 129, 0.4)", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", color: "#fca5a5", margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
                      ❌ Sin ofertas por volumen (2x1, 3x2)<br />
                      ❌ Sin productos complementarios sugeridos<br />
                      ❌ Sin motivación para alcanzar el Envío Gratis
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#d1fae5", margin: 0, fontWeight: 600 }}>
                    Estás dejando el <strong style={{ color: "#ffffff" }}>40% de facturación extra</strong> sobre la mesa en cada pedido.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente fuga ➔</div>
              </div>

              {/* HISTORIA 4: DUDAS DE TALLE Y CONFIANZA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>📏</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
                    FUGA #3 — LA DUDA QUE MATA LA COMPRA
                  </div>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px", border: "1.5px solid rgba(16, 185, 129, 0.4)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                      "¿Me quedará bien el talle M o será chico?"
                    </div>
                    <p style={{ fontSize: "11px", color: "#d1fae5", margin: 0, lineHeight: 1.4 }}>
                      Si el cliente tiene que mandar un WhatsApp para preguntar las medidas, en el 80% de los casos <strong style={{ color: "#fca5a5" }}>cierra la pestaña y compra en otro lado</strong>.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    La indecisión es el enemigo #1 de tus ventas online.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Deslizá ➔</div>
              </div>

              {/* HISTORIA 5: LA TRAMPA DE LA PUBLICIDAD */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>💸</div>
                  <h3 style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    El error más común: "Tengo que meter más plata en pauta"
                  </h3>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1.5px solid rgba(16, 185, 129, 0.4)", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Meter tráfico a una tienda que no convierte es como <strong style={{ color: "#fca5a5" }}>echarle agua a un balde pinchado</strong>. El costo por clic sube y tu margen desaparece.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#a7f3d0", fontWeight: 800, margin: 0 }}>
                    La clave no es traer más visitas. Es exprimir al máximo las que ya tenés.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Deslizá ➔</div>
              </div>

              {/* HISTORIA 6: APPS LENTAS */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>🐌</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Instalar 6 apps distintas destruye tu velocidad móvil
                  </h3>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1.5px solid rgba(16, 185, 129, 0.4)", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Cada app externa agrega códigos pesados que traban el celular del comprador. Si tu tienda tarda más de 3 segundos en cargar, <strong style={{ color: "#fca5a5" }}>perdés el 53% de las compras</strong>.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0, fontWeight: 700 }}>
                    Terminás pagando 4 suscripciones caras por apps lentas.
                  </p>
                </div>
                <div style={storyBottomSwipe}>La solución ➔</div>
              </div>

              {/* HISTORIA 7: CIERRE Y PUENTE */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>💡</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    El problema no es tu producto.
                  </h2>
                  <p style={{ fontSize: "15px", color: "#a7f3d0", fontWeight: 800, margin: "0 0 16px 0" }}>
                    Es la falta de herramientas que cierren la venta en el momento.
                  </p>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "2px solid #10B981", borderRadius: "16px", padding: "14px", marginBottom: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
                    <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>
                      Por eso creamos <span style={{ color: "#34d399", fontWeight: 900 }}>Nevux</span>: una única app con 27 herramientas que resuelven todas las fugas de tu tienda en 1 clic.
                    </p>
                  </div>
                </div>
                <div style={{ ...storyBottomSwipe, color: "#34d399", fontWeight: 900 }}>
                  Mirá la siguiente destacada: "⚡ La Solución" ➔
                </div>
              </div>

            </div>
          )}

          {/* PLACEHOLDER PARA DESTACADA 2 Y 3 */}
          {activeDestacada !== "problema" && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#10B981", margin: "0 0 8px 0" }}>
                {activeDestacada === "solucion" ? "⚡ 2. La Solución Nevux" : "💬 3. Testimonios WhatsApp"}
              </h3>
              <p style={{ fontSize: "13px", color: "#a7f3d0" }}>
                Se habilitará a continuación.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB 3: PORTADAS DESTACADAS
      ═══════════════════════════════════════════ */}
      {activeTab === "covers" && (
        <div style={{ maxWidth: "650px", width: "100%", textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎨</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#10B981", margin: "0 0 8px 0" }}>Portadas Circulares de Destacadas</h2>
          <p style={{ fontSize: "14px", color: "#a7f3d0" }}>Se agregarán a continuación.</p>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════
   ESTILOS PREMIUM VERDE ESMERALDA (9:16)
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
