"use client";

import React, { useState } from "react";

export default function BannersPage() {
  const [lang, setLang] = useState<"es" | "pt">("pt"); // Por defecto en Portugués para Brasil

  const isPt = lang === "pt";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b0f19",
        color: "#ffffff",
        padding: "24px 16px 120px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        boxSizing: "border-box",
      }}
    >
      {/* Panel de Control de Idioma */}
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
          gap: "12px",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#10B981",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          📷 Banners Promocionales Oficiales Nevux
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#9ca3af",
            margin: 0,
            lineHeight: "1.4",
            fontWeight: 500,
          }}
        >
          {isPt 
            ? "Tire print de cada banner em modo paisagem para atualizar a vitrine na Nuvemshop."
            : "Sacale captura a cada tarjeta en modo horizontal desde tu celular para la tienda de Tiendanube."}
        </p>

        {/* Botones de Idioma */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            background: "#1f2937",
            padding: "4px",
            borderRadius: "12px",
            marginTop: "6px",
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
              color: !isPt ? "#ffffff" : "#9ca3af",
              transition: "all 0.2s ease",
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
              color: isPt ? "#ffffff" : "#9ca3af",
              transition: "all 0.2s ease",
            }}
          >
            🇧🇷 Português
          </button>
        </div>
      </div>

      {/* ==========================================
          BANNER 1: NEVUXBOT IA + EXPERIENCIA DE COMPRA MOBILE
         ========================================== */}
      <div style={bannerContainerStyle}>
        <div style={{ flex: "1 1 240px", zIndex: 2 }}>
          <div style={badgeStyle}>🤖 AUTOMATIZACIÓN & HOME APP</div>
          <h2 style={bannerTitleStyle}>
            {isPt ? "NevuxBot IA & Conversão Visual" : "NevuxBot IA & Conversión Visual"}
          </h2>
          <p style={bannerDescStyle}>
            {isPt
              ? "O primeiro CRM de Carrinhos com IA integrado a um design de aplicativo móvel para a sua Home."
              : "El primer CRM de Carritos con IA integrado a un diseño de aplicación móvil para tu pantalla de Inicio."}
          </p>

          <div style={widgetTagCloudStyle}>
            <span style={widgetTagStyle}>🤖 NevuxBot AI CRM</span>
            <span style={widgetTagStyle}>⭕ Stories na Home (#24)</span>
            <span style={widgetTagStyle}>🎬 Slider de Vídeo (#15)</span>
            <span style={widgetTagStyle}>🗂️ Slider Categorias (#25)</span>
            <span style={widgetTagStyle}>🎡 Roleta de Descontos (#27)</span>
          </div>
        </div>

        {/* Mockup Móvil NevuxBot CRM */}
        <div style={{ flex: "1 1 280px", position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", maxWidth: "290px", backgroundColor: "#f9fafb", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.3)", overflow: "hidden", display: "flex", position: "relative" }}>
            
            {/* Mini Sidebar */}
            <div style={{ width: "40px", backgroundColor: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: "10px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#111827" }} />
              <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#ecfdf5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #a7f3d0", fontSize: "10px" }}>🤖</div>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#f3f4f6" }} />
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#f3f4f6" }} />
            </div>

            {/* Dashboard CRM */}
            <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "32px", color: "#111827" }}>
              <div style={{ fontSize: "11px", fontWeight: "900" }}>NevuxBot AI CRM</div>
              
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ flex: 1, background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "4px 6px" }}>
                  <div style={{ fontSize: "5.5px", color: "#64748b", fontWeight: "bold" }}>CARRINHOS</div>
                  <div style={{ fontSize: "11px", fontWeight: "900" }}>42</div>
                </div>
                <div style={{ flex: 1, background: "#ecfdf5", border: "1px solid #10B981", borderRadius: "6px", padding: "4px 6px" }}>
                  <div style={{ fontSize: "5.5px", color: "#059669", fontWeight: "bold" }}>RECUPERADO</div>
                  <div style={{ fontSize: "11px", fontWeight: "900", color: "#10B981" }}>{isPt ? "R$ 4.250" : "$425.000"}</div>
                </div>
              </div>

              {/* Stories simulados dentro de la app */}
              <div style={{ display: "flex", gap: "4px", margin: "4px 0" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1.5px solid #10B981", padding: "1px" }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#e5e7eb" }} /></div>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1.5px solid #10B981", padding: "1px" }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#e5e7eb" }} /></div>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1.5px solid #10B981", padding: "1px" }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#e5e7eb" }} /></div>
              </div>

              {/* Botón enviar WhatsApp */}
              <div style={{ background: "#22c55e", color: "#fff", padding: "5px", borderRadius: "6px", fontSize: "8px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                💬 {isPt ? "Enviar via WhatsApp" : "Enviar por WhatsApp"}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==========================================
          BANNER 2: EXPLOSIÓN DE TICKET PROMEDIO (AOV)
         ========================================== */}
      <div style={bannerContainerStyle}>
        <div style={{ flex: "1 1 240px", zIndex: 2 }}>
          <div style={badgeStyle}>💰 AUMENTÁ EL TICKET PROMEDIO</div>
          <h2 style={bannerTitleStyle}>
            {isPt ? "Combos, Descontos & Progresso" : "Combos, Descuentos & Progreso"}
          </h2>
          <p style={bannerDescStyle}>
            {isPt
              ? "Motive seus clientes a comprarem mais produtos com kits dinâmicos, barras inteligentes e upselling."
              : "Motivá a tus clientes a comprar más productos con packs dinámicos, barras inteligentes y upselling."}
          </p>

          <div style={widgetTagCloudStyle}>
            <span style={widgetTagStyle}>📦 Bundle Promociones (#7)</span>
            <span style={widgetTagStyle}>🔢 Bundle Cantidad (#8)</span>
            <span style={widgetTagStyle}>🛍️ Packs Complementarios (#23)</span>
            <span style={widgetTagStyle}>🔘 Extras con Switch (#16)</span>
            <span style={widgetTagStyle}>📊 Barra de Progreso (#6)</span>
          </div>
        </div>

        {/* Mockup Visual de Bundles & Progreso */}
        <div style={{ flex: "1 1 280px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
          
          {/* Barra de progreso de envío gratis */}
          <div style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "12px", padding: "10px", color: "#ffffff" }}>
            <div style={{ fontSize: "10px", fontWeight: 800, marginBottom: "4px" }}>
              {isPt ? "🚚 Faltam R$ 45 para Frete Grátis!" : "🚚 ¡Te faltan $4.500 para Envío Gratis!"}
            </div>
            <div style={{ width: "100%", height: "6px", background: "#374151", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: "75%", height: "100%", background: "#10B981" }} />
            </div>
          </div>

          {/* Bundle Compre Junto Mockup */}
          <div style={{ background: "#ffffff", color: "#111827", borderRadius: "14px", padding: "12px", border: "1px solid #cbd5e1" }}>
            <div style={{ background: "#ecfdf5", border: "1.5px solid #10B981", borderRadius: "8px", padding: "6px", position: "relative" }}>
              <span style={{ position: "absolute", top: "-6px", right: "6px", background: "#10B981", color: "#fff", fontSize: "6px", fontWeight: 900, padding: "1px 4px", borderRadius: "4px" }}>
                {isPt ? "MAIS VENDIDO" : "MÁS RECOMENDADO"}
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 800 }}>⭐ {isPt ? "Leve 2 com 15% OFF" : "Llevá 2 con 15% OFF"}</div>
                  <div style={{ fontSize: "8px", color: "#059669", fontWeight: 700 }}>{isPt ? "Economize R$ 30" : "Ahorrás $3.000"}</div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 900, color: "#111827" }}>
                  {isPt ? "R$ 170" : "$17.000"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          BANNER 3: CONFIANZA TOTAL, SOCIAL PROOF & ANTIDEVOLUCIONES
         ========================================== */}
      <div style={bannerContainerStyle}>
        <div style={{ flex: "1 1 240px", zIndex: 2 }}>
          <div style={badgeStyle}>🛡️ CONFIANZA & CERO DEVOLUCIONES</div>
          <h2 style={bannerTitleStyle}>
            {isPt ? "Tamanhos & Social Proof" : "Talles & Social Proof"}
          </h2>
          <p style={bannerDescStyle}>
            {isPt
              ? "Evite trocas e aumente a conversão com fotos de clientes reais e tabela de medidas com seletor automático de tamanhos."
              : "Evitá devoluciones y aumentá la conversión con fotos de clientes reales y tabla de medidas con selector automático de variantes."}
          </p>

          <div style={widgetTagCloudStyle}>
            <span style={widgetTagStyle}>📏 Tabla de Talles Inteligente (#22)</span>
            <span style={widgetTagStyle}>📸 Reseñas con Fotos UGC (#26)</span>
            <span style={widgetTagStyle}>⭐ Reseñas Clientes (#14)</span>
            <span style={widgetTagStyle}>💬 Caja de Opiniones (#9)</span>
            <span style={widgetTagStyle}>⚖️ Comparador de Marca (#20)</span>
            <span style={widgetTagStyle}>💳 Medios de Pago Visuales (#21)</span>
          </div>
        </div>

        {/* Mockups de Confianza */}
        <div style={{ flex: "1 1 280px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
          
          {/* Talles Selector Inteligente Mockup */}
          <div style={{ background: "#ffffff", color: "#111827", borderRadius: "12px", padding: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "9px", fontWeight: "900", color: "#10B981" }}>📏 GUIA DE TAMANHOS</span>
              <span style={{ background: "#f1f5f9", fontSize: "7px", padding: "2px 4px", borderRadius: "4px" }}>Métrico cm</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "6px 8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "10px", fontWeight: "800" }}>Talle / Tamanho M</span>
              <span style={{ background: "#10B981", color: "#ffffff", fontSize: "8px", fontWeight: "900", padding: "3px 6px", borderRadius: "4px" }}>
                ✓ {isPt ? "Selecionar" : "Elegir"}
              </span>
            </div>
          </div>

          {/* Reseñas con Foto UGC Mockup */}
          <div style={{ background: "#ffffff", color: "#111827", borderRadius: "12px", padding: "10px", border: "1px solid #e2e8f0", display: "flex", gap: "8px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              👚
            </div>
            <div>
              <div style={{ color: "#fbbf24", fontSize: "9px" }}>★★★★★</div>
              <div style={{ fontSize: "8px", color: "#64748b" }}>{isPt ? "Foto real enviada por Carla M." : "Foto real enviada por Carla M."}</div>
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          BANNER 4: URGENCIA, GATILLOS MENTALES & BENEFICIOS
         ========================================== */}
      <div style={bannerContainerStyle}>
        <div style={{ flex: "1 1 240px", zIndex: 2 }}>
          <div style={badgeStyle}>⚡ URGENCIA & CONVERSIÓN RÁPIDA</div>
          <h2 style={bannerTitleStyle}>
            {isPt ? "Gatilhos Mentais de Compra" : "Gatillos Mentales de Compra"}
          </h2>
          <p style={bannerDescStyle}>
            {isPt
              ? "Crie sensação de urgência com contadores em tempo real, cupons destacados e avisos automáticos de estoque."
              : "Creá sensación de urgencia con contadores en tiempo real, cupones destacados y avisos automáticos de stock."}
          </p>

          <div style={widgetTagCloudStyle}>
            <span style={widgetTagStyle}>⏳ Cuenta Regresiva (#1)</span>
            <span style={widgetTagStyle}>👀 Contador de Visitas (#17)</span>
            <span style={widgetTagStyle}>🚨 Mensaje de Alerta (#12)</span>
            <span style={widgetTagStyle}>🎟️ Badge Cupón Troquelado (#19)</span>
            <span style={widgetTagStyle}>📢 Banner Deslizante (#5)</span>
            <span style={widgetTagStyle}>🛡️ Sellos de Garantía (#13)</span>
          </div>
        </div>

        {/* Mockups de Gatillos de Urgencia */}
        <div style={{ flex: "1 1 280px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
          
          {/* Cronómetro regresivo */}
          <div style={{ background: "#0f172a", color: "#ffffff", borderRadius: "14px", padding: "10px 14px", border: "1px solid #1e293b", textAlign: "center" }}>
            <div style={{ fontSize: "9px", fontWeight: "900", color: "#fbbf24", marginBottom: "4px" }}>
              ⏰ {isPt ? "OFERTA TERMINA EM" : "LA OFERTA TERMINA EN"}
            </div>
            <div style={{ display: "flex", gap: "4px", justifyContent: "center", fontSize: "12px", fontWeight: "900", fontFamily: "monospace" }}>
              <span style={{ background: "#1e293b", padding: "3px 6px", borderRadius: "4px" }}>02</span>:
              <span style={{ background: "#1e293b", padding: "3px 6px", borderRadius: "4px" }}>14</span>:
              <span style={{ background: "#1e293b", padding: "3px 6px", borderRadius: "4px" }}>45</span>
            </div>
          </div>

          {/* Cupón troquelado interactivo */}
          <div style={{ background: "#dc2626", color: "#ffffff", padding: "8px 12px", borderRadius: "10px", border: "1.5px dashed #fca5a5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "10px", fontWeight: "900" }}>{isPt ? "Cupom Especial 🌟" : "Cupón Especial 🌟"}</div>
              <div style={{ fontSize: "7px", color: "#fecaca" }}>20% OFF EXTRA</div>
            </div>
            <div style={{ background: "#ffffff", color: "#111827", padding: "3px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", fontFamily: "monospace" }}>
              EXTRA20
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════
   ESTILOS CORPORATIVOS PREMIUM NEVUX
═══════════════════════════════════════════ */
const bannerContainerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "650px",
  minHeight: "360px",
  background: "linear-gradient(135deg, #111827 0%, #030712 100%)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
  border: "1.5px solid #1f2937",
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
  background: "rgba(16, 185, 129, 0.15)",
  color: "#10B981",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  fontSize: "9px",
  fontWeight: "900",
  padding: "4px 10px",
  borderRadius: "999px",
  marginBottom: "12px",
  letterSpacing: "0.5px",
};

const bannerTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "900",
  color: "#ffffff",
  margin: "0 0 8px 0",
  lineHeight: "1.15",
  letterSpacing: "-0.03em",
};

const bannerDescStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0 0 16px 0",
  lineHeight: "1.45",
  fontWeight: "500",
};

const widgetTagCloudStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginTop: "12px",
};

const widgetTagStyle: React.CSSProperties = {
  fontSize: "8.5px",
  fontWeight: "800",
  background: "#1f2937",
  border: "1px solid #374151",
  color: "#d1d5db",
  padding: "3px 6px",
  borderRadius: "6px",
  whiteSpace: "nowrap",
};
