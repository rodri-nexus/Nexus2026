"use client";

import React, { useState } from "react";

type TabId = "partners" | "stories" | "covers";

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("partners");
  const [lang, setLang] = useState<"es" | "pt">("pt");

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
        backgroundColor: "#0b0f19",
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
          backgroundColor: "#111827",
          padding: "20px",
          borderRadius: "18px",
          border: "1.5px solid #1f2937",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#10B981", margin: 0 }}>
          📷 Generador de Contenido Visual Nevux
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, lineHeight: "1.4" }}>
          Seleccioná qué tipo de contenido querés generar y sacale captura desde tu celular.
        </p>

        {/* TABS DE NAVEGACIÓN */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "#1f2937",
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
                  color: isActive ? "#ffffff" : "#9ca3af",
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
          TAB 1: BANNERS TIENDANUBE PARTNERS (CÓDIGO ORIGINAL INTACTO)
      ═══════════════════════════════════════════ */}
      {activeTab === "partners" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>

          {/* Selector de idioma */}
          <div style={{ display: "flex", gap: "8px", background: "#1f2937", padding: "4px", borderRadius: "12px" }}>
            <button onClick={() => setLang("es")} style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: !isPt ? "#10B981" : "transparent", color: !isPt ? "#ffffff" : "#9ca3af" }}>
              🇦🇷 Español
            </button>
            <button onClick={() => setLang("pt")} style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: isPt ? "#10B981" : "transparent", color: isPt ? "#ffffff" : "#9ca3af" }}>
              🇧🇷 Português
            </button>
          </div>

          {/* BANNER NEVUXBOT AI CRM */}
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 200px", zIndex: 2 }}>
              <div style={badgeStyle}>🤖 NEVUXBOT AI</div>
              <h2 style={bannerTitleStyle}>{isPt ? "O primeiro CRM de Carrinhos com IA" : "El primer CRM de Carritos con IA"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Detecte vendas perdidas, crie mensagens persuasivas com Gemini AI e recupere via WhatsApp ou E-mail." : "Detectá ventas perdidas, creá copys persuasivos con Gemini AI y recuperá por WhatsApp o Email."}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "16px" }}>
                <div style={checkStyle}><span style={checkMark}>✓</span> {isPt ? "Dashboard completo" : "Panel CRM completo"}</div>
                <div style={checkStyle}><span style={checkMark}>✓</span> {isPt ? "Copys com Inteligência Artificial" : "Copys con Inteligencia Artificial"}</div>
                <div style={checkStyle}><span style={checkMark}>✓</span> {isPt ? "Envio 1-Clique" : "Disparo en 1-Clic"}</div>
              </div>
            </div>
            <div style={{ flex: "1 1 300px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", maxWidth: "320px", backgroundColor: "#f9fafb", borderRadius: "14px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.3)", overflow: "hidden", display: "flex", position: "relative" }}>
                <div style={{ width: "45px", backgroundColor: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: "10px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#000" }} />
                  <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#f3f4f6", marginTop: "10px" }} />
                  <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#f3f4f6" }} />
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#ecfdf5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #a7f3d0" }}>🤖</div>
                </div>
                <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "36px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "900", color: "#000" }}>NevuxBot AI</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ flex: 1, background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "6px 8px" }}>
                      <div style={{ fontSize: "6.5px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>{isPt ? "Carrinhos Abandonados" : "Carritos Abandonados"}</div>
                      <div style={{ fontSize: "13px", fontWeight: "900", color: "#000" }}>14</div>
                    </div>
                    <div style={{ flex: 1, background: "#ecfdf5", border: "1.5px solid #10B981", borderRadius: "8px", padding: "6px 8px" }}>
                      <div style={{ fontSize: "6.5px", color: "#059669", fontWeight: "bold", textTransform: "uppercase" }}>{isPt ? "Vendas Recuperadas" : "Ventas Recuperadas"}</div>
                      <div style={{ fontSize: "13px", fontWeight: "900", color: "#10B981" }}>{isPt ? "R$ 4.250" : "$425.000"}</div>
                    </div>
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: "900", color: "#000" }}>👤 Martin P.</div>
                        <div style={{ fontSize: "7px", color: "#64748b" }}>{isPt ? "Camiseta • Calça" : "Remera • Pantalón"}</div>
                      </div>
                      <div style={{ background: "#fef3c7", color: "#b45309", fontSize: "7px", fontWeight: "800", padding: "2px 5px", borderRadius: "5px" }}>🟡 {isPt ? "Pendente" : "Pendiente"}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e5e7eb", paddingTop: "5px" }}>
                      <div style={{ fontSize: "10.5px", fontWeight: "900", color: "#10B981" }}>{isPt ? "R$ 450,00" : "$45.000"}</div>
                      <div style={{ background: "#10B981", color: "#fff", fontSize: "7.5px", fontWeight: "800", padding: "3px 7px", borderRadius: "5px", display: "flex", alignItems: "center", gap: "3px" }}>✨ {isPt ? "Recuperar com IA" : "Recuperar con IA"}</div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: "6px", right: "8px", background: "#22c55e", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "8.5px", fontWeight: "900", display: "flex", alignItems: "center", gap: "4px", border: "1px solid #16a34a", zIndex: 10 }}>
                    💬 {isPt ? "Enviar via WhatsApp" : "Enviar por WhatsApp"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BANNER TICKET PROMEDIO */}
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 220px", zIndex: 2 }}>
              <h2 style={bannerTitleStyle}>{isPt ? "Aumente o seu ticket médio" : "Impulsá tu ticket promedio"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Aumente seu faturamento elevando o valor de cada venda com ofertas irresistíveis." : "Aumentá tu facturación elevando el valor de cada venta con ofertas irresistibles."}</p>
            </div>
            <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "230px", backgroundColor: "#ffffff", borderRadius: "16px", padding: "14px", boxShadow: "0 20px 30px rgba(0,0,0,0.3)", border: "1px solid #e2e8f0", transform: "rotate(-3deg)", color: "#0f172a", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold" }}>⚪ {isPt ? "Kit x1" : "Pack x1"}</span>
                  <span style={{ fontSize: "11px", fontWeight: "bold" }}>{isPt ? "R$ 100" : "$10.000"}</span>
                </div>
                <div style={{ background: "#ecfdf5", border: "2px solid #10B981", padding: "8px", borderRadius: "10px", position: "relative" }}>
                  <div style={{ position: "absolute", top: "-8px", right: "6px", display: "flex", gap: "3px" }}>
                    <span style={{ background: "#10B981", color: "#fff", fontSize: "7px", fontWeight: "900", padding: "1px 4px", borderRadius: "6px" }}>{isPt ? "FRETE GRÁTIS" : "ENVÍO GRATIS"}</span>
                    <span style={{ background: "#ef4444", color: "#fff", fontSize: "7px", fontWeight: "900", padding: "1px 4px", borderRadius: "6px" }}>{isPt ? "MAIS VENDIDO" : "MÁS VENDIDO"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800" }}>🟢 {isPt ? "Kit x2" : "Pack x2"}</div>
                      <div style={{ fontSize: "9px", fontWeight: "bold", color: "#059669" }}>{isPt ? "Economize 15%" : "Ahorrá 15%"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "9px", color: "#94a3b8", textDecoration: "line-through", marginRight: "3px" }}>{isPt ? "R$ 200" : "$20.000"}</span>
                      <span style={{ fontSize: "12px", fontWeight: "900", color: "#0f172a" }}>{isPt ? "R$ 178" : "$17.850"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ background: "#10B981", color: "#ffffff", textAlign: "center", padding: "8px", borderRadius: "10px", fontSize: "11px", fontWeight: "800" }}>
                  {isPt ? "Adicionar ao carrinho" : "Agregar al carrito"}
                </div>
              </div>
            </div>
          </div>

          {/* BANNER OFERTAS */}
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 220px", zIndex: 2 }}>
              <h2 style={bannerTitleStyle}>{isPt ? "Destaque suas ofertas" : "Destacá tus ofertas"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Destaque promoções, cupons e banners de urgência para disparar suas conversões." : "Resaltá promociones, cupones y banners de urgencia para disparar tus conversiones."}</p>
            </div>
            <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", left: "0px", top: "10px", width: "220px", backgroundColor: "#0f172a", color: "#ffffff", borderRadius: "14px", padding: "12px", boxShadow: "0 15px 25px rgba(0,0,0,0.35)", border: "1px solid #334155", transform: "rotate(-5deg)", zIndex: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "9px", fontWeight: "900", color: "#fbbf24" }}>🔥 {isPt ? "OFERTA RELÂMPAGO" : "OFERTA RELÁMPAGO"}</span>
                  <span style={{ background: "#dc2626", fontSize: "7px", fontWeight: "bold", padding: "1px 5px", borderRadius: "8px" }}>{isPt ? "ATÉ R$ 250 OFF" : "$25.000 OFF"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", alignItems: "center" }}>
                  <div style={{ background: "#1e293b", padding: "6px 8px", borderRadius: "8px", textAlign: "center", border: "1px solid #475569" }}>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#34d399" }}>06</div>
                    <div style={{ fontSize: "7px", color: "#94a3b8" }}>{isPt ? "HORAS" : "HRS"}</div>
                  </div>
                  <span style={{ fontWeight: "bold", color: "#64748b" }}>:</span>
                  <div style={{ background: "#1e293b", padding: "6px 8px", borderRadius: "8px", textAlign: "center", border: "1px solid #475569" }}>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#34d399" }}>21</div>
                    <div style={{ fontSize: "7px", color: "#94a3b8" }}>MINS</div>
                  </div>
                  <span style={{ fontWeight: "bold", color: "#64748b" }}>:</span>
                  <div style={{ background: "#1e293b", padding: "6px 8px", borderRadius: "8px", textAlign: "center", border: "1px solid #475569" }}>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#34d399" }}>28</div>
                    <div style={{ fontSize: "7px", color: "#94a3b8" }}>SEGS</div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", left: "10px", bottom: "10px", width: "220px", backgroundColor: "#dc2626", color: "#ffffff", borderRadius: "12px", padding: "10px 14px", boxShadow: "0 15px 20px rgba(0,0,0,0.2)", border: "2px dashed #fca5a5", transform: "rotate(2deg)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "900" }}>20% OFF extra 🎄</div>
                  <div style={{ fontSize: "8px", color: "#fecaca" }}>{isPt ? "Em todo o site" : "En todo el sitio"}</div>
                </div>
                <div style={{ background: "#ffffff", color: "#0f172a", padding: "4px 8px", borderRadius: "8px", fontFamily: "monospace", fontWeight: "900", fontSize: "10px" }}>EXTRA20</div>
              </div>
            </div>
          </div>

          {/* BANNER CONFIANZA */}
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 220px", zIndex: 2 }}>
              <h2 style={bannerTitleStyle}>{isPt ? "Gere confiança" : "Generá confianza"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Transmita total segurança aos seus clientes com depoimentos reais e selos de garantia." : "Transmití seguridad total a tus clientes con testimonios reales y sellos de garantía."}</p>
            </div>
            <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", left: "0px", top: "10px", width: "230px", backgroundColor: "#ffffff", color: "#0f172a", borderRadius: "16px", padding: "12px", boxShadow: "0 20px 25px rgba(0,0,0,0.2)", border: "1px solid #e2e8f0", transform: "rotate(-3deg)", zIndex: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "18px", fontWeight: "900" }}>4,8</span>
                    <div>
                      <div style={{ color: "#fbbf24", fontSize: "10px" }}>★★★★★</div>
                      <div style={{ fontSize: "7px", color: "#94a3b8", fontWeight: "bold" }}>{isPt ? "24 avaliações" : "24 reseñas"}</div>
                    </div>
                  </div>
                  <div style={{ background: "#000", color: "#fff", fontSize: "8px", fontWeight: "bold", padding: "4px 8px", borderRadius: "6px" }}>{isPt ? "Avaliações" : "Opiniones"}</div>
                </div>
                <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold" }}>Mariana P.</span>
                    <span style={{ color: "#fbbf24", fontSize: "8px" }}>★★★★★</span>
                  </div>
                  <p style={{ fontSize: "8px", color: "#475569", margin: 0, lineHeight: "1.3" }}>{isPt ? '"Excelente atendimento e qualidade do produto."' : '"Excelente atención y calidad del producto."'}</p>
                </div>
              </div>
              <div style={{ position: "absolute", right: "0px", bottom: "15px", width: "170px", backgroundColor: "#ffffff", color: "#0f172a", borderRadius: "14px", padding: "10px", boxShadow: "0 15px 20px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", transform: "rotate(4deg)", zIndex: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#059669", fontWeight: "800", fontSize: "10px", marginBottom: "4px" }}>🛡️ {isPt ? "Garantia de 60 dias" : "Garantía de 60 días"}</div>
                <p style={{ fontSize: "8px", color: "#64748b", margin: 0, lineHeight: "1.2" }}>{isPt ? "Devolvemos 100% do seu dinheiro." : "Te devolvemos el 100% de tu dinero."}</p>
              </div>
            </div>
          </div>

          {/* BANNER ESTILOS */}
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 220px", zIndex: 2 }}>
              <h2 style={bannerTitleStyle}>{isPt ? "Seus estilos, suas cores" : "Tus estilos, tus colores"}</h2>
              <p style={bannerDescStyle}>{isPt ? "Personalize cada widget com a tipografia, cores e identidade da sua marca." : "Customizá cada widget con la tipografía, colores e identidad de tu marca."}</p>
            </div>
            <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "220px", backgroundColor: "#ffffff", color: "#0f172a", borderRadius: "16px", padding: "14px", boxShadow: "0 20px 25px rgba(0,0,0,0.2)", border: "1px solid #e2e8f0", transform: "rotate(2deg)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", fontSize: "10px", fontWeight: "bold" }}>
                  <div style={{ paddingBottom: "6px", paddingRight: "8px", color: "#94a3b8" }}>{isPt ? "Geral" : "General"}</div>
                  <div style={{ paddingBottom: "6px", paddingLeft: "8px", borderBottom: "2px solid #10B981", color: "#059669" }}>Estilo</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "9px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#475569" }}>{isPt ? "Botão 'Adicionar':" : "Botón 'Agregar':"}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "3px 6px", borderRadius: "5px", border: "1px solid #cbd5e1" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#10B981" }} />
                      <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#10B981</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#475569" }}>{isPt ? "Cor do preço:" : "Color de precio:"}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "3px 6px", borderRadius: "5px", border: "1px solid #cbd5e1" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#000000" }} />
                      <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#000000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB 2: HISTORIAS INSTAGRAM (SE CONSTRUYE EN COMMIT 2 Y 3)
      ═══════════════════════════════════════════ */}
      {activeTab === "stories" && (
        <div style={{ maxWidth: "650px", width: "100%", textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📱</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#10B981", margin: "0 0 8px 0" }}>Historias Destacadas de Instagram</h2>
          <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.5 }}>
            Próximamente: Las 3 destacadas fundamentales (Problema, Solución, Testimonios) con estilo WhatsApp argentino real.
          </p>
          <div style={{ marginTop: "20px", padding: "12px", background: "#1f2937", borderRadius: "12px", border: "1px solid #374151", fontSize: "12px", color: "#6b7280" }}>
            🔧 En construcción — Commit 2 y 3
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB 3: PORTADAS DESTACADAS (SE CONSTRUYE EN COMMIT 3)
      ═══════════════════════════════════════════ */}
      {activeTab === "covers" && (
        <div style={{ maxWidth: "650px", width: "100%", textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎨</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#10B981", margin: "0 0 8px 0" }}>Portadas Circulares de Destacadas</h2>
          <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.5 }}>
            Próximamente: Los íconos circulares para las tapas de cada historia destacada.
          </p>
          <div style={{ marginTop: "20px", padding: "12px", background: "#1f2937", borderRadius: "12px", border: "1px solid #374151", fontSize: "12px", color: "#6b7280" }}>
            🔧 En construcción — Commit 3
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ESTILOS REUTILIZABLES (BANNERS PARTNERS)
═══════════════════════════════════════════ */
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

const checkStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const checkMark: React.CSSProperties = {
  color: "#34d399",
  fontWeight: "bold",
};
