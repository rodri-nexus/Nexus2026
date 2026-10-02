// app/admin/banners/page.tsx
"use client";

import React, { useState } from "react";
import { Smartphone, Zap, CheckCircle2, XCircle } from "lucide-react";

type TabId = "carousels" | "marketing_assets" | "before_after";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface MarketingAsset {
  id: string;
  category: "hook" | "mid" | "cta";
  badgeEs: string;
  badgePt: string;
  titleEs: string;
  titlePt: string;
  descEs: string;
  descPt: string;
  emoji: string;
  theme: "dark" | "green" | "danger" | "purple";
  metricEs?: string;
  metricPt?: string;
}

interface CarouselSlide {
  type: "cover" | "problem" | "comparison" | "solution" | "cta";
  badgeEs: string;
  badgePt: string;
  titleEs: string;
  titlePt: string;
  descEs: string;
  descPt: string;
  metric?: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES DE CONTENIDO
═══════════════════════════════════════════ */
const MARKETING_ASSETS: MarketingAsset[] = [
  {
    id: "hook_dolor",
    category: "hook",
    badgeEs: "🚨 DOLOR VS PLACER",
    badgePt: "🚨 DOR VS PRAZER",
    titleEs: "Los que venden en Tiendanube ya usan esto 👀 y te ganan",
    titlePt: "Quem vende na Nuvemshop já usa isso 👀 e te vence",
    descEs: "10k visitas con $0 ventas vs Ventas x3 con Nevux",
    descPt: "10k visitas com $0 vendas vs Vendas x3 com Nevux",
    emoji: "👀",
    theme: "dark",
    metricEs: "10.000 VISITAS · $0 VENTAS",
    metricPt: "10.000 VISITAS · $0 VENDAS",
  },
  {
    id: "hook_15s",
    category: "hook",
    badgeEs: "⚡ VELOCIDAD EXTREMA",
    badgePt: "⚡ VELOCIDADE EXTREMA",
    titleEs: "ACTIVÁ EN 15 SEGUNDOS Y VENDÉ EL TRIPLE HOY",
    titlePt: "ATIVE EM 15 SEGUNDOS E VENDA O TRIPLO HOJE",
    descEs: "Directo en tu Tiendanube sin tocar una línea de código",
    descPt: "Direto na sua Nuvemshop sem tocar uma linha de código",
    emoji: "⏳",
    theme: "green",
    metricEs: "15 SEGUNDOS · 1 CLIC",
    metricPt: "15 SEGUNDOS · 1 CLIQUE",
  },
  {
    id: "hook_preocupado",
    category: "hook",
    badgeEs: "🤔 DIAGNÓSTICO",
    badgePt: "🤔 DIAGNÓSTICO",
    titleEs: "Tu tienda tiene visitas pero NO ventas... Hagamos esto",
    titlePt: "Sua loja tem visitas mas NÃO vende... Faça isso",
    descEs: "Dejá de quemar plata en anuncios. Optimizá el checkout hoy.",
    descPt: "Pare de queimar dinheiro com anúncios. Otimize o checkout hoje.",
    emoji: "🛠️",
    theme: "danger",
    metricEs: "97% SE VAN SIN COMPRAR",
    metricPt: "97% SAEM SEM COMPRAR",
  },
  {
    id: "hook_secreto",
    category: "hook",
    badgeEs: "🤫 SECRETO REVELADO",
    badgePt: "🤫 SEGREDO REVELADO",
    titleEs: "El secreto de las marcas que facturan millones",
    titlePt: "O segredo das marcas que faturam milhões",
    descEs: "No es gastar más en ads. Es convertir las visitas que ya tenés.",
    descPt: "Não é gastar mais em ads. É converter as visitas que você já tem.",
    emoji: "🤫",
    theme: "purple",
    metricEs: "CONVERSIÓN ×3",
    metricPt: "CONVERSÃO ×3",
  },
  {
    id: "mid_97percent",
    category: "mid",
    badgeEs: "📉 ESTADÍSTICA CRÍTICA",
    badgePt: "📉 ESTATÍSTICA CRÍTICA",
    titleEs: "El 97% de tus visitas entra y se va sin comprar nada",
    titlePt: "97% das suas visitas entra e sai sem comprar nada",
    descEs: "Nevux recupera ese tráfico perdido en piloto automático.",
    descPt: "A Nevux recupera esse tráfego perdido no piloto automático.",
    emoji: "📉",
    theme: "dark",
    metricEs: "97% ABANDONO",
    metricPt: "97% ABANDONO",
  },
  {
    id: "mid_formula",
    category: "mid",
    badgeEs: "🤖 FÓRMULA GANADORA",
    badgePt: "🤖 FÓRMULA GANHADORA",
    titleEs: "Bundles + Urgencia + Vendedor IA = Ventas 24/7",
    titlePt: "Bundles + Urgência + Vendedor IA = Vendas 24/7",
    descEs: "El ecosistema definitivo de conversión para tu tienda online.",
    descPt: "O ecossistema definitivo de conversão para sua loja online.",
    emoji: "🤖",
    theme: "green",
    metricEs: "+35% TICKET PROMEDIO",
    metricPt: "+35% TICKET MÉDIO",
  },
  {
    id: "mid_nocode",
    category: "mid",
    badgeEs: "✨ DISEÑO IMPECABLE",
    badgePt: "✨ DESIGN IMPECÁVEL",
    titleEs: "Sincronizado con tu marca en 1 segundo",
    titlePt: "Sincronizado com sua marca em 1 segundo",
    descEs: "Se ve 100% nativo, elegante y ultra profesional en tu tienda.",
    descPt: "Parece 100% nativo, elegante e ultra profissional na sua loja.",
    emoji: "✨",
    theme: "purple",
    metricEs: "0 LÍNEAS DE CÓDIGO",
    metricPt: "0 LINHAS DE CÓDIGO",
  },
  {
    id: "cta_outro",
    category: "cta",
    badgeEs: "🚀 CIERRE OFICIAL",
    badgePt: "🚀 FECHAMENTO OFICIAL",
    titleEs: "Probá Nevux GRATIS por 7 días",
    titlePt: "Teste o Nevux GRÁTIS por 7 dias",
    descEs: "Link en la biografía · Activá hoy mismo",
    descPt: "Link na biografia · Ative hoje mesmo",
    emoji: "🚀",
    theme: "green",
    metricEs: "👉 LINK EN LA BIO 👈",
    metricPt: "👉 LINK NA BIO 👈",
  },
  {
    id: "cta_store",
    category: "cta",
    badgeEs: "🛍️ APP STORE OFICIAL",
    badgePt: "🛍️ APP STORE OFICIAL",
    titleEs: "Instalá Nevux desde Tiendanube App Store",
    titlePt: "Instale a Nevux na App Store da Nuvemshop",
    descEs: "Buscá 'Nevux' · 7 días gratis · Sin tarjeta",
    descPt: "Busque 'Nevux' · 7 dias grátis · Sem cartão",
    emoji: "🛍️",
    theme: "dark",
    metricEs: "APP OFICIAL · ID #37382",
    metricPt: "APP OFICIAL · ID #37382",
  },
  {
    id: "cta_notcard",
    category: "cta",
    badgeEs: "🛡️ SIN TARJETA",
    badgePt: "🛡️ SEM CARTÃO",
    titleEs: "7 Días de Prueba Ilimitados · Sin Tarjeta",
    titlePt: "7 Dias de Teste Ilimitados · Sem Cartão",
    descEs: "Activás, medís resultados y decidís. Cero riesgo.",
    descPt: "Ative, meça resultados e decida. Zero risco.",
    emoji: "🛡️",
    theme: "purple",
    metricEs: "SIN COMPROMISO",
    metricPt: "SEM COMPROMISSO",
  },
];

const PREMIUM_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    type: "cover",
    badgeEs: "🚨 ANÁLISIS DE CONVERSIÓN B2B",
    badgePt: "🚨 ANÁLISE DE CONVERSÃO B2B",
    titleEs: "Por qué tu tienda recibe visitas pero NADIE te compra 📉",
    titlePt: "Por que sua loja recebe visitas mas NINGUÉM compra 📉",
    descEs: "El error estructural que le hace perder cientos de dólares a los comerciantes de Tiendanube.",
    descPt: "O erro estrutural que faz os lojistas da Nuvemshop perderem centenas de dólares.",
    metric: "DESLIZÁ PARA VER EL MOTIVO ➔",
  },
  {
    type: "problem",
    badgeEs: "🧠 PSICOLOGÍA DEL CONSUMIDOR",
    badgePt: "🧠 PSICOLOGIA DO CONSUMIDOR",
    titleEs: "El mito del 'balde pinchado' y el tráfico desaprovechado",
    titlePt: "O mito do 'balde furado' e o tráfego desperdiçado",
    descEs: "Gastar más en publicidad no soluciona el problema. El 97% de tus visitas se van porque no detectan urgencia ni confianza inmediata.",
    descPt: "Gastar mais em anúncios não resolve. 97% das suas visitas saem porque não detectam urgência nem confiança imediata.",
    metric: "97% DE ABANDONO TOTAL ❌",
  },
  {
    type: "comparison",
    badgeEs: "⚖️ COMPARATIVA DE ECOSISTEMAS",
    badgePt: "⚖️ COMPARATIVO DE ECOSSISTEMAS",
    titleEs: "Tienda Tradicional vs. Tienda de Alta Conversión",
    titlePt: "Loja Tradicional vs. Loja de Alta Conversão",
    descEs: "SIN NEVUX: Carritos abandonados, dudas y $0 ventas.\nCON NEVUX: Urgencia de stock, Notificaciones en vivo y Vendedor IA 24/7.",
    descPt: "SEM NEVUX: Carrinhos abandonados, dúvidas e $0 vendas.\nCOM NEVUX: Urgência de estoque, Notificações ao vivo e Vendedor IA 24/7.",
    metric: "CONVERSIÓN MULTIPLICADA ×3 📈",
  },
  {
    type: "solution",
    badgeEs: "⚡ INTELIGENCIA AUTOMATIZADA",
    badgePt: "⚡ INTELIGÊNCIA AUTOMATIZADA",
    titleEs: "Dejá que la tecnología venda por vos en piloto automático",
    titlePt: "Deixe a tecnologia vender por você no piloto automático",
    descEs: "Nevux se integra en tu Tiendanube en 15 segundos sin tocar una sola línea de código. Todo automatizado.",
    descPt: "Nevux se integra na sua Nuvemshop em 15 segundos sem tocar em código. Tudo automatizado.",
    metric: "100% AUTOMÁTICO Y SIN CÓDIGO 🤖",
  },
  {
    type: "cta",
    badgeEs: "🚀 PRUEBA GRATIS POR 7 DÍAS",
    badgePt: "🚀 TESTE GRÁTIS POR 7 DIAS",
    titleEs: "Transformá tus visitas en ventas reales hoy mismo",
    titlePt: "Transforme suas visitas em vendas reais hoje mesmo",
    descEs: "Instalación instantánea desde la App Store oficial (#37382). Sin tarjeta de crédito requerida.",
    descPt: "Instalação instantânea na App Store oficial (#37382). Sem cartão de crédito necessário.",
    metric: "👉 INSTALÁ GRATIS EN NEVUX.AR 👈",
  },
];

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("carousels");
  const [lang, setLang] = useState<"es" | "pt">("es");
  const isPt = lang === "pt";

  const tabs = [
    { id: "carousels" as TabId, label: "Carrusel Pro (5 Placas Limpias)", icon: "🎠" },
    { id: "marketing_assets" as TabId, label: "Hooks y Cierres Pro", icon: "🎬" },
    { id: "before_after" as TabId, label: "Antes vs Después", icon: "⚡" },
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
      {/* HEADER PRINCIPAL */}
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#0b2920",
          padding: "16px",
          borderRadius: "18px",
          border: "1.5px solid rgba(16, 185, 129, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <h1 style={{ fontSize: "17px", fontWeight: 800, color: "#10B981", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <Smartphone size={18} />
          Panel de Contenido Visual Pro
        </h1>

        <div style={{ display: "flex", gap: "6px", background: "#061a14", padding: "4px", borderRadius: "10px" }}>
          <button
            onClick={() => setLang("es")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              backgroundColor: !isPt ? "#10B981" : "transparent",
              color: !isPt ? "#000" : "#a7f3d0",
            }}
          >
            🇦🇷 Español
          </button>
          <button
            onClick={() => setLang("pt")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              backgroundColor: isPt ? "#10B981" : "transparent",
              color: isPt ? "#000" : "#a7f3d0",
            }}
          >
            🇧🇷 Português
          </button>
        </div>

        <div style={{ display: "flex", gap: "6px", background: "#061a14", padding: "4px", borderRadius: "12px", width: "100%" }}>
          {tabs.map((tab) => (
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
                backgroundColor: activeTab === tab.id ? "#10B981" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#6ee7b7",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: CARRUSEL PRO EN CASCADA (PLACAS 100% LIMPIAS PARA CAPTURA) */}
      {activeTab === "carousels" && (
        <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {PREMIUM_CAROUSEL_SLIDES.map((slide, index) => {
            const badgeText = isPt ? slide.badgePt : slide.badgeEs;
            const badgeColor = slide.type === "problem" ? "#ef4444" : slide.type === "comparison" ? "#3b82f6" : "#10B981";

            return (
              <div
                key={index}
                style={{
                  width: "100%",
                  aspectRatio: "4 / 5",
                  background: slide.type === "problem"
                    ? "#0c0407"
                    : slide.type === "comparison"
                    ? "#070b14"
                    : slide.type === "solution"
                    ? "#03120c"
                    : slide.type === "cta"
                    ? "#021a12"
                    : "#060913",
                  border: "2px solid rgba(16, 185, 129, 0.4)",
                  borderRadius: "24px",
                  padding: "24px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* HEADER CON LOGO OFICIAL LIMPIO */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    paddingBottom: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src="/icon.svg"
                      alt="Nevux Logo"
                      style={{ width: "32px", height: "32px", display: "block" }}
                    />
                    <span style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.02em" }}>
                      NEVUX
                    </span>
                  </div>

                  <span style={{ fontSize: "13px", fontWeight: 800, fontFamily: "monospace", color: "#10B981" }}>
                    0{index + 1} / 05
                  </span>
                </div>

                {/* BADGE CATEGORÍA */}
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 900,
                      color: badgeColor,
                      background: slide.type === "problem" ? "rgba(239,68,68,0.15)" : slide.type === "comparison" ? "rgba(59,130,246,0.15)" : "rgba(16,185,129,0.15)",
                      border: `1px solid ${badgeColor}`,
                    }}
                  >
                    {badgeText}
                  </span>
                </div>

                {/* TÍTULO PRINCIPAL DE LA PLACA */}
                <h2
                  style={{
                    margin: "0",
                    fontSize: "21px",
                    fontWeight: 900,
                    color: "#ffffff",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {isPt ? slide.titlePt : slide.titleEs}
                </h2>

                {/* MÉTRICA DESTACADA PILL */}
                {slide.metric && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "14px",
                      background: slide.type === "cta" ? "#10B981" : "rgba(16, 185, 129, 0.12)",
                      border: "1.5px solid #10B981",
                      textAlign: "center",
                      color: slide.type === "cta" ? "#000000" : "#10B981",
                      fontSize: "13px",
                      fontWeight: 900,
                    }}
                  >
                    {slide.metric}
                  </div>
                )}

                {/* CAJA DE DESCRIPCIÓN */}
                <div
                  style={{
                    background: "rgba(10, 12, 16, 0.88)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "16px",
                    padding: "16px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#d1fae5",
                      lineHeight: 1.55,
                      whiteSpace: "pre-line",
                      fontWeight: 600,
                    }}
                  >
                    {isPt ? slide.descPt : slide.descEs}
                  </p>
                </div>

                {/* FOOTER OFICIAL DE MARCA DE LA PLACA */}
                <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 800, color: "#10B981" }}>
                  {slide.type === "cta" ? "NEVUX.AR · APP OFICIAL" : isPt ? "DESLIZE PARA VER ➔" : "DESLIZÁ PARA CONTINUAR ➔"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: HOOKS Y CIERRES */}
      {activeTab === "marketing_assets" && (
        <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {(["hook", "mid", "cta"] as const).map((cat) => (
            <div key={cat}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  color: "#10B981",
                  marginBottom: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "left",
                }}
              >
                {cat === "hook" && "🪝 Ganchos Pro (0–3s del Reel)"}
                {cat === "mid" && "⏸️ Mid-Rolls Pro (Retención)"}
                {cat === "cta" && "🎯 Cierres CTA Pro (Conversión)"}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "14px",
                }}
              >
                {MARKETING_ASSETS.filter((a) => a.category === cat).map((asset) => (
                  <div
                    key={asset.id}
                    style={{
                      backgroundColor: "#0b2920",
                      border: "1.5px solid rgba(16,185,129,0.25)",
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "12px",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>{asset.emoji}</span>
                      <span style={{ fontSize: "9px", fontWeight: 800, color: "#10B981" }}>
                        {isPt ? asset.badgePt : asset.badgeEs}
                      </span>
                      <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#fff", margin: "6px 0 4px" }}>
                        {isPt ? asset.titlePt : asset.titleEs}
                      </h4>
                      <p style={{ fontSize: "11px", color: "#a7f3d0", margin: 0, lineHeight: 1.4 }}>
                        {isPt ? asset.descPt : asset.descEs}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ANTES VS DESPUÉS */}
      {activeTab === "before_after" && (
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div
            style={{
              backgroundColor: "#0b2920",
              border: "1.5px solid rgba(16,185,129,0.3)",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <Zap size={32} color="#10B981" style={{ marginBottom: "10px" }} />
            <h2 style={{ fontSize: "17px", fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
              {isPt ? "Comparativo Antes vs Depois" : "Comparativo Antes vs Después"}
            </h2>

            <div
              style={{
                background: "#05080f",
                border: "1.5px solid rgba(16,185,129,0.3)",
                borderRadius: "16px",
                padding: "16px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {/* SIN NEVUX */}
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1.5px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 900,
                      color: "#ef4444",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <XCircle size={14} />
                    {isPt ? "SEM NEVUX" : "SIN NEVUX"}
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "14px",
                      fontSize: "10px",
                      color: "#fca5a5",
                      lineHeight: 1.6,
                    }}
                  >
                    <li>97% abandono de carrito</li>
                    <li>Sin urgencia ni escasez</li>
                    <li>Visitas entran y se van $0</li>
                    <li>Sin prueba social flotante</li>
                  </ul>
                </div>

                {/* CON NEVUX */}
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1.5px solid #10B981",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 900,
                      color: "#10B981",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {isPt ? "COM NEVUX" : "CON NEVUX"}
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "14px",
                      fontSize: "10px",
                      color: "#a7f3d0",
                      lineHeight: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    <li>Conversión ×3 + Métrica ROI</li>
                    <li>Timers de urgencia y stock</li>
                    <li>Vendedor IA cerrando 24/7</li>
                    <li>Notificaciones en vivo</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
