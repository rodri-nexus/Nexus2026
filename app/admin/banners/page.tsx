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
type StoryDestacada = "problema" | "solucion" | "testimonios";

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("stories");
  const [lang, setLang] = useState<"es" | "pt">("pt");
  const [activeDestacada, setActiveDestacada] = useState<StoryDestacada>("testimonios");

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
              <h2 style={bannerTitleStyle}>{isPt ? "O primeiro CRM de Carrinhos com IA" : "El primer CRM de Carritos con IA"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Detecte vendas perdidas, crie mensagens persuasivas com Gemini AI e recupere via WhatsApp ou E-mail." : "Detectá ventas perdidas, creá copys persuasivos con Gemini AI y recuperá por WhatsApp o Email."}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAS INSTAGRAM (9:16) */}
      {activeTab === "stories" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Sub-selector de Destacadas */}
          <div style={{ display: "flex", gap: "8px", background: "#0b2920", padding: "6px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.3)", width: "100%", overflowX: "auto" }}>
            <button onClick={() => setActiveDestacada("problema")} style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: 800, border: "none", cursor: "pointer", background: activeDestacada === "problema" ? "#10B981" : "transparent", color: activeDestacada === "problema" ? "#ffffff" : "#a7f3d0", whiteSpace: "nowrap" }}>
              🚨 1. El Problema (7)
            </button>
            <button onClick={() => setActiveDestacada("solucion")} style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: 800, border: "none", cursor: "pointer", background: activeDestacada === "solucion" ? "#10B981" : "transparent", color: activeDestacada === "solucion" ? "#ffffff" : "#a7f3d0", whiteSpace: "nowrap" }}>
              ⚡ 2. La Solución (8)
            </button>
            <button onClick={() => setActiveDestacada("testimonios")} style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: 800, border: "none", cursor: "pointer", background: activeDestacada === "testimonios" ? "#10B981" : "transparent", color: activeDestacada === "testimonios" ? "#ffffff" : "#a7f3d0", whiteSpace: "nowrap" }}>
              💬 3. Testimonios (6)
            </button>
          </div>

          {/* RENDERING PROBLEMA */}
          {activeDestacada === "problema" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%", alignItems: "center" }}>
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

          {/* RENDERING SOLUCION (FONDO MENTA LIGHT GLASS) */}
          {activeDestacada === "solucion" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%", alignItems: "center" }}>
              <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                👇 Sacale captura de pantalla en vertical a cada tarjeta para armar tu destacada
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>⚡</div>
                  <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10B981", color: "#065f46", fontSize: "10px", fontWeight: 900, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.05em" }}>
                    LA SOLUCIÓN DEFINITIVA
                  </div>
                  <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#065f46", lineHeight: 1.15, margin: "0 0 16px 0", letterSpacing: "-0.03em" }}>
                    Una sola app.<br />27 widgets de conversión.
                  </h2>
                  <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                    Nevux reemplaza todas las aplicaciones lentas de tu Tiendanube por una suite única, liviana y automatizada.
                  </p>
                </div>
                <div style={storyBottomSwipeLight}>Mirá cómo funciona ➔</div>
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>📦</div>
                  <div style={{ fontSize: "11px", color: "#059669", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "14px" }}>
                    TICKET PROMEDIO AL MÁXIMO
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#065f46", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Hacé que cada cliente gaste más antes de pagar
                  </h3>
                  <div style={{ background: "#ffffff", border: "1.5px solid #10B981", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.08)" }}>
                    <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                      ✅ <b>Bundles por volumen:</b> Descuentos progresivos por llevar 2 o 3 unidades.<br />
                      ✅ <b>Barra de Envío Gratis:</b> El empujón que necesitan para sumar productos al carrito.<br />
                      ✅ <b>Packs Sugeridos:</b> Venta cruzada en un solo toque.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipeLight}>Siguiente beneficio ➔</div>
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>📏</div>
                  <div style={{ fontSize: "11px", color: "#059669", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "14px" }}>
                    MEDIDAS Y CONFIANZA REAL
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#065f46", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    Eliminá las dudas de talles en segundos
                  </h3>
                  <div style={{ background: "#ffffff", border: "1.5px solid #10B981", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.08)" }}>
                    <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                      ✅ <b>Talles Inteligentes:</b> Selector interactivo que guarda el talle y lo selecciona directo en la tienda.<br />
                      ✅ <b>Reseñas con Foto (UGC):</b> Tus clientes subiendo fotos reales de cómo les queda la prenda.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#059669", fontWeight: 800, margin: 0 }}>
                    Menos preguntas de soporte, cero devoluciones.
                  </p>
                </div>
                <div style={storyBottomSwipeLight}>Siguiente beneficio ➔</div>
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>⚡</div>
                  <div style={{ fontSize: "11px", color: "#059669", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "14px" }}>
                    URGENCIA & CIERRE INMEDIATO
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#065f46", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                    No los dejes postergar su decisión
                  </h3>
                  <div style={{ background: "#ffffff", border: "1.5px solid #10B981", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.08)" }}>
                    <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                      ✅ <b>Cuenta Regresiva:</b> Temporizadores visuales para liquidaciones.<br />
                      ✅ <b>Alertas de Stock:</b> "Últimas 2 unidades disponibles".<br />
                      ✅ <b>Cupones interactivos:</b> Cupones troquelados listos para copiar con 1 clic.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipeLight}>Siguiente beneficio ➔</div>
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>🖱️</div>
                  <h3 style={{ fontSize: "24px", fontWeight: 900, color: "#065f46", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Instalación en 1 solo clic. Sin tocar código.
                  </h3>
                  <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                      No necesitás diseñadores ni programadores. Te registrás, elegís qué widgets activar y en menos de 2 minutos están brillando en tu Tiendanube.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#10B981", fontWeight: 900, margin: 0 }}>
                    Control total de colores, textos y estilos 🎨
                  </p>
                </div>
                <div style={storyBottomSwipeLight}>Siguiente beneficio ➔</div>
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "38px", marginBottom: "10px" }}>🚀</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#065f46", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    Un solo script ultra liviano de 12kb
                  </h3>
                  <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1.5px solid #10B981", borderRadius: "14px", padding: "14px", textAlign: "left", marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", color: "#065f46", margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
                      A diferencia de instalar 6 apps pesadas por separado que ralentizan tu servidor, Nevux corre unificado bajo un único código inteligente que no frena tu checkout.
                    </p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#374151", margin: 0, fontWeight: 600 }}>
                    Tu tienda vuela en teléfonos celulares.
                  </p>
                </div>
                <div style={storyBottomSwipeLight}>Prueba gratis ➔</div>
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔥</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#065f46", lineHeight: 1.2, margin: "0 0 14px 0" }}>
                    7 Días de Prueba Completa Gratis
                  </h2>
                  <p style={{ fontSize: "15px", color: "#10B981", fontWeight: 800, margin: "0 0 16px 0" }}>
                    Sin tarjeta de crédito, sin contratos.
                  </p>
                  <div style={{ background: "#ffffff", border: "1.5px solid #10B981", borderRadius: "16px", padding: "14px", marginBottom: "16px", boxShadow: "0 8px 24px rgba(16,185,129,0.1)" }}>
                    <p style={{ fontSize: "12px", color: "#374151", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>
                      Probá todas las herramientas hoy mismo y comproba el aumento de tu facturación antes de pagar un solo peso.
                    </p>
                  </div>
                </div>
                <div style={storyBottomSwipeLight}>Los precios ➔</div>
              </div>

              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}><NevuxLogo size="small" /></div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>💳</div>
                  <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10B981", color: "#065f46", fontSize: "10px", fontWeight: 900, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.05em" }}>
                    PLAN ÚNICO TRANSPARENTE
                  </div>
                  <h2 style={{ fontSize: "32px", fontWeight: 900, color: "#065f46", lineHeight: 1.15, margin: "0 0 8px 0" }}>
                    $30.000 ARS
                  </h2>
                  <p style={{ fontSize: "14px", color: "#374151", fontWeight: 700, margin: "0 0 16px 0" }}>
                    por mes • Acceso Ilimitado a Todo
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 16px 0", lineHeight: 1.4 }}>
                    Sin comisiones por ventas • Sin límites de visitas o impresiones • Soporte directo por WhatsApp
                  </p>
                </div>
                <div style={{ ...storyBottomSwipeLight, color: "#059669", fontWeight: 900 }}>
                  Mirá los resultados de nuestros clientes ➔
                </div>
              </div>
            </div>
          )}

          {/* RENDERING TESTIMONIOS WHATSAPP CON DESENFOQUE (6 HISTORIAS) */}
          {activeDestacada === "testimonios" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px", width: "100%", alignItems: "center" }}>
              <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                👇 Sacale captura de pantalla en vertical a cada chat para tu destacada de testimonios
              </div>

              {/* T1: MARIANA */}
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Mariana 💚 Cliente" status="en línea" emoji="🧥" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Hola Rodri! Todo bien? Che te quería preguntar sobre el script, una consulta rápida..." isLeft={true} />
                  <BlurBubble text="Sisi decime tranqui Mari" isLeft={false} />
                  
                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Rodri boludo GRACIAS 🙌 desde q instalé nevux subí el ticket promedio 35% en 3 semanas. La app es una locura, se instala re fácil y la tabla de talles es un 10.
                    </div>
                    <div style={whatsappTimeStyle}>15:47</div>
                  </div>

                  <div style={myHighlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
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

              {/* T2: FEDE */}
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Fede 👟 Córdoba" status="últ. vez hoy 11:20" emoji="👟" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Che bro, te hago una consulta del plan de pagos. ¿Cómo se debita?" isLeft={true} />
                  <BlurBubble text="Es automático todos los meses amigo, te olvidás." isLeft={false} />

                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      che amigo te paso las métricas de este mes... una locura. El ROI tracker me marca 15x de retorno. Recuperé un montón de carritos con el bot. No vuelvo a usar Wigy ni loco jajaja
                    </div>
                    <div style={whatsappTimeStyle}>11:24</div>
                  </div>

                  <div style={myHighlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Qué grande Fede!! Sabía q la ibas a romper toda amigo. Gracias por confiar y por pasarme los números, me motivan un montón! 🟢⚡
                    </div>
                    <div style={{ ...whatsappTimeStyle, color: "#4b5563", display: "flex", gap: "2px", justifyContent: "flex-end" }}>
                      11:26 <CheckCheck size={12} color="#34b7f1" />
                    </div>
                  </div>

                  <BlurBubble text="Sisi posta, el bot de IA de carritos te soluciona la vida" isLeft={true} />
                </div>
                <WhatsAppFooter />
              </div>

              {/* T3: CAMI */}
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Cami 💄 Rosario" status="en línea" emoji="💅" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Holaa! Te hago una consulta rápida, la ruleta se puede desactivar para móviles?" isLeft={true} />
                  <BlurBubble text="Hola Cami! Sí, desde el editor podés apagarla si querés." isLeft={false} />

                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Hola Rodri! Te queria contar q me esta yendo increible con nevux 💚 la ruleta me capturo mas de 200 emails en 1 semana, no lo puedo creer jaja. Ya cerramos varias ventas de ahí.
                    </div>
                    <div style={whatsappTimeStyle}>18:03</div>
                  </div>

                  <div style={myHighlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Espectacular Cami! La ruleta es una máquina de capturar leads. ¡Me alegro un montón que ya estén cerrando ventas por ahí! 🙌
                    </div>
                    <div style={{ ...whatsappTimeStyle, color: "#4b5563", display: "flex", gap: "2px", justifyContent: "flex-end" }}>
                      18:05 <CheckCheck size={12} color="#34b7f1" />
                    </div>
                  </div>

                  <BlurBubble text="Sisi! Re contenta, posta la app vuela. Gracias!" isLeft={true} />
                </div>
                <WhatsAppFooter />
              </div>

              {/* T4: NICOLAS */}
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Nico Deco 🏺" status="últ. vez hoy 09:15" emoji="🏺" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Buenas loco! Che se puede agregar un widget a una categoría entera?" isLeft={true} />
                  <BlurBubble text="Sí, elegís todos los productos o categoría y listo." isLeft={false} />

                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Hola loco, che te hago una pregunta... nah mentira era para decirte q los bundles son lo mas. En 2 días vendimos 18 packs de decoración que antes costaba un huevo venderlos juntos. Gracias posta!
                    </div>
                    <div style={whatsappTimeStyle}>09:32</div>
                  </div>

                  <div style={myHighlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Jajaja qué hdp me asustaste! Qué alegría Nico, los bundles de volumen nunca fallan, hacen que la venta del pack sea re fluida. 💪
                    </div>
                    <div style={{ ...whatsappTimeStyle, color: "#4b5563", display: "flex", gap: "2px", justifyContent: "flex-end" }}>
                      09:35 <CheckCheck size={12} color="#34b7f1" />
                    </div>
                  </div>

                  <BlurBubble text="Se re nota la diferencia, antes andaba renegando con cupones" isLeft={true} />
                </div>
                <WhatsAppFooter />
              </div>

              {/* T5: SOFI */}
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Sofi Sport 🏋️" status="en línea" emoji="🏃" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Hola Rodri! Una duda, si instalo Nevux me va a pesar mucho en el PageSpeed de Google?" isLeft={true} />
                  <BlurBubble text="Para nada Sofi, está re contra optimizado en un solo script." isLeft={false} />

                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Sinceramente Rodri estaba media cagada con el script xq las otras apps me dejaban la tienda re pesada... pero Nevux literal vuela. Es re liviana y la tabla de talles interactiva es un 10 total 📏✨
                    </div>
                    <div style={whatsappTimeStyle}>14:15</div>
                  </div>

                  <div style={myHighlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Sii Sofi, está re optimizada la app, solo pesa 12kb! Un placer tenerte en la familia de Nevux, a meterle con todo a esos talles! 💚
                    </div>
                    <div style={{ ...whatsappTimeStyle, color: "#4b5563", display: "flex", gap: "2px", justifyContent: "flex-end" }}>
                      14:18 <CheckCheck size={12} color="#34b7f1" />
                    </div>
                  </div>

                  <BlurBubble text="Se nota que hay desarrollo atrás, excelente laburo posta." isLeft={true} />
                </div>
                <WhatsAppFooter />
              </div>

              {/* T6: MARTIN */}
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Martin Suples 💪" status="últ. vez ayer" emoji="💊" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Che Rodri, una pregunta del trial de 7 días, ¿después me avisa antes de cobrar?" isLeft={true} />
                  <BlurBubble text="Sisi obvio, te llega un mail y te avisa en el dash." isLeft={false} />

                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Che posta se paga sola la app. Al principio dudaba de los 30k x mes pero con 2 ventas de packs que metí ayer gracias al widget de compra unificada ya recuperé la inversión del mes completo jaja
                    </div>
                    <div style={whatsappTimeStyle}>20:42</div>
                  </div>

                  <div style={myHighlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4", margin: 0 }}>
                      Tal cual Tincho! Esa es la idea de Nevux, que el ROI sea inmediato y se pague sola con las primeras ventas extra. ¡A seguir facturando fuerte! 🚀🔥
                    </div>
                    <div style={{ ...whatsappTimeStyle, color: "#4b5563", display: "flex", gap: "2px", justifyContent: "flex-end" }}>
                      20:45 <CheckCheck size={12} color="#34b7f1" />
                    </div>
                  </div>

                  <BlurBubble text="Olvidate, ya lo dejé configurado fijo en toda la tienda." isLeft={true} />
                </div>
                <WhatsAppFooter />
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 3: PORTADAS DESTACADAS CIRCULARES */}
      {activeTab === "covers" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
          <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px" }}>
            👇 Sacale captura de pantalla en vertical para las tapas de tus historias destacadas en Instagram.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "20px", width: "100%", justifyContent: "center" }}>
            <div style={coverContainerStyle}>
              <div style={coverCircleStyle}>
                <span style={{ fontSize: "56px" }}>🚨</span>
              </div>
              <span style={coverLabelStyle}>1. El Problema</span>
            </div>

            <div style={coverContainerStyle}>
              <div style={{ ...coverCircleStyle, border: "4px solid #10B981" }}>
                <span style={{ fontSize: "56px" }}>⚡</span>
              </div>
              <span style={coverLabelStyle}>2. La Solución</span>
            </div>

            <div style={coverContainerStyle}>
              <div style={{ ...coverCircleStyle, border: "4px solid #10B981" }}>
                <span style={{ fontSize: "56px" }}>💬</span>
              </div>
              <span style={coverLabelStyle}>3. Testimonios</span>
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
  width: "110px",
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
  fontSize: "13px",
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
