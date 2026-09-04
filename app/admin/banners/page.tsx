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
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "partners" | "stories" | "covers";
type StoryDestacada = "problema" | "solucion" | "testimonios" | "nevuxbot" | "analytics";

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("stories");
  const [lang, setLang] = useState<"es" | "pt">("pt");
  const [activeDestacada, setActiveDestacada] = useState<StoryDestacada>("nevuxbot"); // Por defecto cargamos NevuxBot para capturar rápido

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

      {/* 🖼️ TAB 1: BANNERS PARTNERS (INTACTO) */}
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
              <h2 style={bannerTitleStyle}>{isPt ? "O primeiro CRM de Carrinhos com IA" : "El primer CRM de Carritos con IA"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Detecte vendas perdidas, crie mensagens persuasivas com Gemini AI e recupere via WhatsApp ou E-mail." : "Detectá ventas perdidas, creá copys persuasivos con Gemini AI y recuperá por WhatsApp o Email."}</p>
            </div>
          </div>
        </div>
      )}

      {/* 📱 TAB 2: HISTORIAS INSTAGRAM (9:16) */}
      {activeTab === "stories" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Sub-selector de Destacadas */}
          <div style={{ display: "flex", gap: "6px", background: "#0b2920", padding: "6px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.3)", width: "100%", overflowX: "auto" }}>
            <button onClick={() => setActiveDestacada("problema")} style={subTabStyle(activeDestacada === "problema")}>🚨 1. Dolor (7)</button>
            <button onClick={() => setActiveDestacada("solucion")} style={subTabStyle(activeDestacada === "solucion")}>⚡ 2. Solución (8)</button>
            <button onClick={() => setActiveDestacada("testimonios")} style={subTabStyle(activeDestacada === "testimonios")}>💬 3. Chats (6)</button>
            <button onClick={() => setActiveDestacada("nevuxbot")} style={subTabStyle(activeDestacada === "nevuxbot")}>🤖 4. NevuxBot (6)</button>
            <button onClick={() => setActiveDestacada("analytics")} style={subTabStyle(activeDestacada === "analytics")}>📊 5. Analytics (6)</button>
          </div>

          {/* RENDERING PROBLEMA */}
          {activeDestacada === "problema" && (
            <div style={storyContainerStyle}>
              {/* Portada */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>🛑</div>
                  <div style={storyBadgeStyle}>REALIDAD DEL E-COMMERCE</div>
                  <h2 style={storyTitleStyle}>¿Por qué tu tienda vende <span style={{ color: "#fca5a5", textDecoration: "underline" }}>menos</span>?</h2>
                  <p style={storyDescStyle}>Si tenés visitas pero no se reflejan en tu facturación, hay 3 fugas silenciosas que te están costando miles de pesos.</p>
                </div>
                <div style={storyBottomSwipe}>Deslizá para ver las fugas ➔</div>
              </div>
            </div>
          )}

          {/* RENDERING SOLUCION */}
          {activeDestacada === "solucion" && (
            <div style={storyContainerStyle}>
              {/* Portada */}
              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>⚡</div>
                  <div style={storyBadgeLightStyle}>LA SOLUCIÓN DEFINITIVA</div>
                  <h2 style={storyTitleLightStyle}>Una sola app.<br />27 widgets de conversión.</h2>
                  <p style={storyDescLightStyle}>Nevux reemplaza todas las aplicaciones lentas de tu Tiendanube por una suite única, liviana y automatizada.</p>
                </div>
                <div style={storyBottomSwipeLight}>Mirá cómo funciona ➔</div>
              </div>
            </div>
          )}

          {/* RENDERING TESTIMONIOS WHATSAPP */}
          {activeDestacada === "testimonios" && (
            <div style={storyContainerStyle}>
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Mariana 💚 Cliente" status="en línea" emoji="🧥" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Hola Rodri! Todo bien? Che te quería preguntar sobre el script, una consulta rápida..." isLeft={true} />
                  <BlurBubble text="Sisi decime tranqui Mari" isLeft={false} />
                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Rodri boludo GRACIAS 🙌 desde q instalé nevux subí el ticket promedio 35% en 3 semanas. La app es una locura, se instala re fácil y la tabla de talles es un 10.
                    </div>
                    <div style={whatsappTimeStyle}>15:47</div>
                  </div>
                  <div style={myHighlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Nooo Mari 🙌 me pone re contento q te esté funcionando! Esa es la idea, que se pague sola al toque. ¡A seguir rompiéndola! 💚
                    </div>
                    <div style={{ ...whatsappTimeStyle, color: "#4b5563", display: "flex", gap: "2px", justifyContent: "flex-end" }}>
                      15:49 <CheckCheck size={12} color="#34b7f1" />
                    </div>
                  </div>
                  <BlurBubble text="Olvidate! Ya se la recomendé a una amiga que tiene un showroom. Mañana te escribe seguro!" isLeft={true} />
                </div>
                <WhatsAppFooter />
              </div>
            </div>
          )}

          {/* 🤖 RENDERING DESTACADA 4: NEVUXBOT IA CRM (6 HISTORIAS) */}
          {activeDestacada === "nevuxbot" && (
            <div style={storyContainerStyle}>
              
              {/* Story 1: Portada */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🤖</div>
                  <div style={storyBadgeStyle}>IA CRM REVOLUCIONARIO</div>
                  <h2 style={storyTitleStyle}>NevuxBot IA:<br />El Vendedor 24/7</h2>
                  <p style={storyDescStyle}>El primer CRM inteligente integrado que detecta carritos abandonados, escribe mensajes persuasivos y recupera ventas.</p>
                </div>
                <div style={storyBottomSwipe}>¿Cómo lo hace? Deslizá ➔</div>
              </div>

              {/* Story 2: El Dolor */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>💸</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>EL DOLOR SILENCIOSO</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 14px 0" }}>
                    Tu tienda pierde el 70% de los carritos
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Cada cliente que se va sin pagar es plata que regalás. Recordarles la compra de forma manual es tedioso y toma horas de tu día.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    NevuxBot IA lo hace automático por vos.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* Story 3: La IA Gemini */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🧠</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>COPYS CON INTELIGENCIA ARTIFICIAL</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 14px 0" }}>
                    Gemini IA redacta el mensaje ideal
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Nuestra IA analiza qué productos dejó en el carrito y crea un texto de recuperación ultra persuasivo con un tono cálido y amigable.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#10B981", fontWeight: 800, margin: 0 }}>
                    No más plantillas frías y robóticas.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* Story 4: Disparo 1 Clic */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚡</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>RECUPERACIÓN RÁPIDA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Un solo clic para enviar por WhatsApp
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Hacés clic en "Recuperar" en tu CRM y el mensaje generado por IA se abre listo para disparar en su WhatsApp personal. Súper fluido.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    Sin integraciones complejas ni costos extras.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* Story 5: Métricas en Vivo */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>📊</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>CONTROL Y FACTURACIÓN</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Mirá cuántos carritos recuperás en tiempo real
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      El Dashboard de NevuxBot te muestra la lista de carritos pendientes, recuperados y el total de facturación rescatada.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Prueba gratis ➔</div>
              </div>

              {/* Story 6: CTA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Dejá de perder ventas hoy mismo
                  </h2>
                  <p style={{ fontSize: "15px", color: "#10B981", fontWeight: 800, margin: "0 0 16px 0" }}>
                    Probá Nevux gratis por 7 días
                  </p>
                  <div style={{ ...bubbleDarkStyle, border: "1.5px solid #10B981", boxShadow: "0 4px 14px rgba(16,185,129,0.2)" }}>
                    <p style={{ fontSize: "12px", color: "#ffffff", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>
                      Instalás en 1 clic y empezás a usar NevuxBot IA con toda la suite de 27 widgets. No requiere tarjeta.
                    </p>
                  </div>
                </div>
                <div style={{ ...storyBottomSwipe, color: "#34d399", fontWeight: 900 }}>
                  Comenzá gratis en: nexus2026-gx7e.vercel.app
                </div>
              </div>

            </div>
          )}

          {/* 📊 RENDERING DESTACADA 5: METRICAS EN VIVO / ROI TRACKER (6 HISTORIAS) */}
          {activeDestacada === "analytics" && (
            <div style={storyContainerStyle}>
              
              {/* Story 1: Portada */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>📊</div>
                  <div style={storyBadgeStyle}>NEVUX LIVE ANALYTICS</div>
                  <h2 style={storyTitleStyle}>ROI Tracker:<br />Facturación en Vivo</h2>
                  <p style={storyDescStyle}>La única aplicación de conversión que te muestra al segundo exactamente cuánta plata extra te está generando.</p>
                </div>
                <div style={storyBottomSwipe}>¿Cómo funciona? Deslizá ➔</div>
              </div>

              {/* Story 2: El Dolor de otras apps */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>❓</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>INVERSIÓN CIEGA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 14px 0" }}>
                    ¿Tu app de ventas se paga sola?
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Otras aplicaciones te cobran una suscripción mensual, pero nunca te muestran el retorno real de tu inversión. Gastás a ciegas.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    Nevux te lo demuestra con números reales.
                  </p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* Story 3: La Card de ROI */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🤑</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>TRANSPARENCIA TOTAL</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Card de ROI Tracker arriba de tu Dashboard
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Entrás al panel de Nevux y ves al instante: <b>"Facturación extra generada: $425.000 ARS vs Inversión: $30.000 (ROI: 14.1x)"</b>.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* Story 4: Desglose por widget */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>📈</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>MÉTRICAS ESPECÍFICAS</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Desglose widget por widget en vivo
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Medí con precisión matemática: ventas por bundles, emails capturados de ruleta, clics en la tabla de talles. Todo registrado de forma segura.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* Story 5: Sin comisiones */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>💰</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>0% COMISIONES</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Toda la facturación extra es 100% tuya
                  </h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
                      Nevux no muerde ni un solo porcentaje de tus ventas. Lo que te genera la aplicación entra directo a tu bolsillo sin letra chica.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Prueba gratis ➔</div>
              </div>

              {/* Story 6: CTA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Mirá cómo crece el ROI de tu Tiendanube
                  </h2>
                  <p style={{ fontSize: "15px", color: "#10B981", fontWeight: 800, margin: "0 0 16px 0" }}>
                    Comenzá tu prueba gratis hoy
                  </p>
                  <div style={{ ...bubbleDarkStyle, border: "1.5px solid #10B981", boxShadow: "0 4px 14px rgba(16,185,129,0.2)" }}>
                    <p style={{ fontSize: "12px", color: "#ffffff", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>
                      Instalá la app en 1 clic y empezá a trackear tus ventas extras al segundo. Acceso total a los 27 widgets y NevuxBot IA.
                    </p>
                  </div>
                </div>
                <div style={{ ...storyBottomSwipe, color: "#34d399", fontWeight: 900 }}>
                  Lanzá tu prueba en: nexus2026-gx7e.vercel.app
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* 🎨 TAB 3: PORTADAS DESTACADAS CIRCULARES (AHORA CON 5 PORTADAS) */}
      {activeTab === "covers" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
          <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
            👇 Sacale captura de pantalla en vertical para las tapas de tus historias destacadas en Instagram.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "20px", width: "100%", justifyContent: "center" }}>
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
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTES VISUALES WHATSAPP (SIMULADOR REAL)
═══════════════════════════════════════════ */
function WhatsAppHeader({ name, status, emoji }: { name: string; status: string; emoji: string }) {
  return (
    <div style={{
      width: "100%",
      background: "#075e54",
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      boxSizing: "border-box",
      zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ChevronLeft size={20} color="#ffffff" style={{ cursor: "pointer" }} />
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#eceff1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
          {emoji}
        </div>
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
    <div style={{
      width: "100%",
      background: "#f0f0f0",
      padding: "8px 12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderTop: "1px solid #e0e0e0",
      boxSizing: "border-box",
      zIndex: 10,
    }}>
      <div style={{
        flex: 1,
        background: "#ffffff",
        borderRadius: "20px",
        padding: "8px 14px",
        fontSize: "12px",
        color: "#999999",
        textAlign: "left",
        border: "1px solid #e0e0e0"
      }}>
        Escribí un mensaje...
      </div>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#075e54", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "16px" }}>
        🎤
      </div>
    </div>
  );
}

function BlurBubble({ text, isLeft }: { text: string; isLeft: boolean }) {
  return (
    <div style={{
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
    }}>
      {text}
      <div style={{ fontSize: "8px", color: "#999999", textAlign: "right", marginTop: "2px" }}>12:34</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ESTILOS DE ACCESO DIRECTO BOTONES TABS
═══════════════════════════════════════════ */
const subTabStyle = (isActive: boolean): React.CSSProperties => ({
  flex: "1 0 auto",
  padding: "8px 14px",
  borderRadius: "10px",
  fontSize: "11.5px",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
  background: isActive ? "#10B981" : "transparent",
  color: isActive ? "#ffffff" : "#6ee7b7",
  transition: "all 0.15s ease",
  whiteSpace: "nowrap",
});

/* ═══════════════════════════════════════════
   ESTILOS PREMIUM DE HISTORIAS INSTAGRAM (9:16)
═══════════════════════════════════════════ */
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
  height: "110px",
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

const bannerDescStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#d1fae5",
  margin: 0,
  lineHeight: "1.45",
  fontWeight: "500",
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
