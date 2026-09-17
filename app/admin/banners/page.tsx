// app/admin/banners/page.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Video,
  Flame,
  Palette,
  BarChart3,
  Bot,
  Sparkles,
  Download,
  Smartphone,
  Check,
  Gift,
  Trophy,
  Gem,
  Award,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "appstore5" | "partners" | "stories" | "covers" | "carousels" | "marketing_assets";

/* ═══════════════════════════════════════════
   ESTILOS Y CONSTANTES MAESTRAS (Regla #9 al inicio)
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
}

const MARKETING_ASSETS: MarketingAsset[] = [
  // 1. HOOKS (Ganchos de 3 Segundos)
  {
    id: "hook_dolor",
    category: "hook",
    badgeEs: "🚨 DOLOR VS PLACER",
    badgePt: "🚨 DOR VS PRAZER",
    titleEs: "Los que venden en Tiendanube ya usan esto 👀 y te ganan",
    titlePt: "Quem vende na Nuvemshop já usa isso 👀 e te vence",
    descEs: "10k visitas con $0 ventas vs Ventas x3 con Nevux 🔥",
    descPt: "10k visitas com $0 vendas vs Vendas x3 com Nevux 🔥",
    emoji: "👀",
    theme: "dark",
  },
  {
    id: "hook_15s",
    category: "hook",
    badgeEs: "⚡ VELOCIDAD EXTREMA",
    badgePt: "⚡ VELOCIDADE EXTREMA",
    titleEs: "ACTIVÁ EN 15 SEGUNDOS ⏳ Y VENDÉ EL TRIPLE HOY MISMO",
    titlePt: "ATIVE EM 15 SEGUNDOS ⏳ E VENDA O TRIPLO HOJE",
    descEs: "🚀 Directo en tu Tiendanube sin tocar una sola línea de código",
    descPt: "🚀 Direto na sua Nuvemshop sem tocar uma linha de código",
    emoji: "⏳",
    theme: "green",
  },
  {
    id: "hook_preocupado",
    category: "hook",
    badgeEs: "🤔 DIAGNÓSTICO",
    badgePt: "🤔 DIAGNÓSTICO",
    titleEs: "Tu tienda tiene visitas pero NO ventas... Hagamos esto 🛠️",
    titlePt: "Sua loja tem visitas mas NÃO vende... Faça isso 🛠️",
    descEs: "Dejá de tirar dinero en anuncios. Optimizá tu checkout hoy.",
    descPt: "Deixe de queimar dinheiro com anúncios. Otimize seu checkout hoje.",
    emoji: "🛠️",
    theme: "danger",
  },
  {
    id: "hook_secreto",
    category: "hook",
    badgeEs: "🤫 SECRETO REVELADO",
    badgePt: "🤫 SEGREDO REVELADO",
    titleEs: "El secreto de las marcas que facturan millones... 🤫",
    titlePt: "O segredo das marcas que faturam milhões... 🤫",
    descEs: "No es gastar más en publicidad, es optimizar tus visitas.",
    descPt: "Não é gastar mais em anúncios, é otimizar suas visitas.",
    emoji: "🤫",
    theme: "purple",
  },

  // 2. MID-ROLLS (Retención y Educación)
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
  },
  {
    id: "mid_nocode",
    category: "mid",
    badgeEs: "✨ DISEÑO IMPECABLE",
    badgePt: "✨ DESIGN IMPECÁVEL",
    titleEs: "Sincronizado con tus colores de marca en 1 segundo",
    titlePt: "Sincronizado com suas cores de marca em 1 segundo",
    descEs: "Se ve 100% nativo, elegante y ultra profesional.",
    descPt: "Parece 100% nativo, elegante e ultra profissional.",
    emoji: "✨",
    theme: "purple",
  },

  // 3. CTAS (Cierres que Convierten)
  {
    id: "cta_outro",
    category: "cta",
    badgeEs: "🚀 CIERRE OFICIAL",
    badgePt: "🚀 FECHAMENTO OFICIAL",
    titleEs: "Probá Nevux GRATIS por 7 días 🚀",
    titlePt: "Teste o Nevux GRÁTIS por 7 dias 🚀",
    descEs: "👉 Link en la Biografía para activar hoy mismo 👈",
    descPt: "👉 Link na Biografia para ativar hoje mesmo 👈",
    emoji: "🚀",
    theme: "green",
  },
  {
    id: "cta_store",
    category: "cta",
    badgeEs: "🛍️ INSTALACIÓN DIRECTA",
    badgePt: "🛍️ INSTALAÇÃO DIRETA",
    titleEs: "Instalá Nevux desde la tienda de aplicaciones",
    titlePt: "Instale a Nevux direto da loja de aplicativos",
    descEs: "Busca 'Nevux' en el App Store de Tiendanube y vende más.",
    descPt: "Busque por 'Nevux' na App Store da Nuvemshop e venda mais.",
    emoji: "🛍️",
    theme: "dark",
  },
  {
    id: "cta_notcard",
    category: "cta",
    badgeEs: "🛡️ GARANTÍA DE ÉXITO",
    badgePt: "🛡️ GARANTIA DE SUCESSO",
    titleEs: "7 Días de Prueba Ilimitados Sin Tarjeta 🛡️",
    titlePt: "7 Dias de Teste Ilimitados Sem Cartão 🛡️",
    descEs: "Entrás, activás los widgets y medís tus resultados en vivo.",
    descPt: "Entre, ative os widgets e meça seus resultados em tempo real.",
    emoji: "🛡️",
    theme: "purple",
  },
];

interface CarouselSlide {
  badge: string;
  title: string;
  desc: string;
}

const DEFAULT_CAROUSEL: CarouselSlide[] = [
  {
    badge: "PSICOLOGÍA DE VENTAS",
    title: "El sesgo de urgencia que estás ignorando en tu tienda",
    desc: "Tus clientes entran, miran y se van 'para comprar después'. Al no sentir presión, esa venta se pierde para siempre.",
  },
  {
    badge: "LA SOLUCIÓN",
    title: "Widget de Cuenta Regresiva Inteligente Nevux",
    desc: "Colocá un temporizador visual premium directamente en la página de producto sincronizado con ofertas reales.",
  },
  {
    badge: "EL RESULTADO",
    title: "Urgencia real que acelera la decisión de compra",
    desc: "El cliente ve que la oferta termina. El miedo a perderse la oportunidad (FOMO) reduce el tiempo de decisión a minutos.",
  },
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  let radius = r;
  if (w < 2 * radius) radius = w / 2;
  if (h < 2 * radius) radius = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line, x, cy);
      line = words[n] + " ";
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, cy);
  return cy;
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL (BannersPage)
═══════════════════════════════════════════ */
export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("marketing_assets");
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const isPt = lang === "pt";

  const tabs = [
    { id: "marketing_assets", label: "Hooks y Cierres Reels", icon: "🎬" },
    { id: "carousels", label: "Carruseles Instagram", icon: "Carousel" },
  ];

  /* ─── EXPORTADOR DE IMÁGENES CANVAS HD 1080x1920 (Regla #14 Genéricos) ─── */
  const downloadMarketingAsset = async (assetId: string) => {
    const asset = MARKETING_ASSETS.find((a) => a.id === assetId);
    if (!asset) return;

    setIsDownloading(true);

    try {
      const width = 1080;
      const height = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const S = width / 340; // Factor de escala

        // 1. Configuración de Fondos según el tema
        if (asset.theme === "danger") {
          ctx.fillStyle = "#0c0307";
          ctx.fillRect(0, 0, width, height);
          const grad = ctx.createRadialGradient(width / 2, height / 2, 20 * S, width / 2, height / 2, 220 * S);
          grad.addColorStop(0, "rgba(239, 68, 68, 0.15)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 220 * S, 0, Math.PI * 2);
          ctx.fill();
        } else if (asset.theme === "purple") {
          ctx.fillStyle = "#090514";
          ctx.fillRect(0, 0, width, height);
          const grad = ctx.createRadialGradient(width / 2, height / 2, 20 * S, width / 2, height / 2, 220 * S);
          grad.addColorStop(0, "rgba(139, 92, 246, 0.15)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 220 * S, 0, Math.PI * 2);
          ctx.fill();
        } else if (asset.theme === "green") {
          ctx.fillStyle = "#020f0a";
          ctx.fillRect(0, 0, width, height);
          const grad = ctx.createRadialGradient(width / 2, height / 2, 20 * S, width / 2, height / 2, 220 * S);
          grad.addColorStop(0, "rgba(16, 185, 129, 0.2)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 220 * S, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dark
          ctx.fillStyle = "#060913";
          ctx.fillRect(0, 0, width, height);
          const grad = ctx.createRadialGradient(width / 2, height / 2, 20 * S, width / 2, height / 2, 220 * S);
          grad.addColorStop(0, "rgba(16, 185, 129, 0.1)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 220 * S, 0, Math.PI * 2);
          ctx.fill();
        }

        // Dibujar rejilla decorativa
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40 * S) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40 * S) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Lógica de diseño según tipo
        if (asset.id === "hook_dolor") {
          // Split screen Visitas vs Ventas
          const leftW = width / 2;
          ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
          ctx.fillRect(0, 0, leftW, height);

          ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
          ctx.lineWidth = 2 * S;
          ctx.beginPath();
          ctx.moveTo(leftW, 100 * S);
          ctx.lineTo(leftW, height - 100 * S);
          ctx.stroke();

          // Textos internos ilustrativos
          ctx.fillStyle = "#ef4444";
          ctx.font = `900 ${48 * S}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("👀", leftW / 2, height / 2 - 40 * S);
          ctx.font = `bold ${13 * S}px sans-serif`;
          ctx.fillText("10.000 VISITAS", leftW / 2, height / 2 + 15 * S);
          ctx.fillStyle = "#ffffff";
          ctx.fillText("$0 VENTAS 😢", leftW / 2, height / 2 + 45 * S);

          ctx.fillStyle = "#10B981";
          ctx.font = `900 ${48 * S}px sans-serif`;
          ctx.fillText("💰", leftW + leftW / 2, height / 2 - 40 * S);
          ctx.font = `bold ${13 * S}px sans-serif`;
          ctx.fillText("VENTAS x3", leftW + leftW / 2, height / 2 + 15 * S);
          ctx.fillStyle = "#ffffff";
          ctx.fillText("CON NEVUX 🔥", leftW + leftW / 2, height / 2 + 45 * S);
        } else {
          // Emoji gigante al centro para el resto de templates
          ctx.fillStyle = "#ffffff";
          ctx.font = `900 ${76 * S}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(asset.emoji, width / 2, height / 2 - 100 * S);
        }

        // 2. Caja contenedora flotante (Sticker)
        const boxW = width - 48 * S;
        const boxH = 320 * S;
        const boxX = (width - boxW) / 2;
        const boxY = height - boxH - 120 * S;

        ctx.fillStyle = asset.theme === "green" ? "#10B981" : "rgba(10, 12, 16, 0.95)";
        ctx.strokeStyle = asset.theme === "green" ? "#ffffff" : "#10B981";
        ctx.lineWidth = 3 * S;
        drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 24 * S);
        ctx.fill();
        ctx.stroke();

        // 3. Badge interno
        const badgeText = isPt ? asset.badgePt : asset.badgeEs;
        ctx.font = `900 ${10 * S}px sans-serif`;
        ctx.textAlign = "center";
        const textW = ctx.measureText(badgeText).width;
        const bW = textW + 24 * S;
        const bH = 24 * S;
        const bX = (width - bW) / 2;
        const bY = boxY + 28 * S;

        ctx.fillStyle = asset.theme === "green" ? "rgba(0,0,0,0.15)" : "rgba(16, 185, 129, 0.15)";
        drawRoundedRect(ctx, bX, bY, bW, bH, 12 * S);
        ctx.fill();

        ctx.fillStyle = asset.theme === "green" ? "#000000" : "#10B981";
        ctx.textBaseline = "middle";
        ctx.fillText(badgeText, width / 2, bY + bH / 2);

        // 4. Título Principal
        const titleText = isPt ? asset.titlePt : asset.titleEs;
        ctx.font = `900 ${18 * S}px sans-serif`;
        ctx.fillStyle = asset.theme === "green" ? "#000000" : "#ffffff";
        ctx.textBaseline = "top";
        const titleStartY = boxY + 70 * S;
        wrapText(ctx, titleText, width / 2, titleStartY, boxW - 40 * S, 26 * S);

        // 5. Descripción sutil
        const descText = isPt ? asset.descPt : asset.descEs;
        ctx.font = `600 ${11.5 * S}px sans-serif`;
        ctx.fillStyle = asset.theme === "green" ? "rgba(0,0,0,0.7)" : "#9ca3af";
        const descStartY = boxY + 195 * S;
        wrapText(ctx, descText, width / 2, descStartY, boxW - 40 * S, 18 * S);

        // Sello inferior "nevux.ar"
        ctx.font = `900 ${11 * S}px sans-serif`;
        ctx.fillStyle = asset.theme === "green" ? "#000000" : "#10B981";
        ctx.fillText("nevux.ar", width / 2, boxY + boxH - 30 * S);
      }

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `nevux-${asset.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar asset vertical:", err);
    } finally {
      setIsDownloading(false);
    }
  };

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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Smartphone size={20} />
          Panel de Contenido Visual Nevux
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#a7f3d0",
            margin: 0,
            lineHeight: "1.4",
          }}
        >
          Generá recursos de marketing profesionales en HD con un solo toque para tus campañas en redes sociales.
        </p>

        {/* SELECTOR DE IDIOMA */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "#061a14",
            padding: "4px",
            borderRadius: "10px",
            marginBottom: "4px",
          }}
        >
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
              color: !isPt ? "#000000" : "#a7f3d0",
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
              color: isPt ? "#000000" : "#a7f3d0",
            }}
          >
            🇧🇷 Português
          </button>
        </div>

        {/* TABS DE SECCIONES */}
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
                onClick={() => setActiveTab(tab.id as TabId)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
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

      {/* 🎬 TAB 1: HOOKS Y CIERRES REELS (10 ASSETS GIGANTES CATEGORIZADOS) */}
      {activeTab === "marketing_assets" && (
        <div
          style={{
            width: "100%",
            maxWidth: "960px",
            display: "flex",
            flexDirection: "column",
            gap: "36px",
            boxSizing: "border-box",
          }}
        >
          {/* CATEGORÍA 1: GANCHOS (HOOKS) */}
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 900,
                color: "#10B981",
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "left",
              }}
            >
              🪝 Ganchos de Entrada (Primeros 3 Segundos del Reel)
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {MARKETING_ASSETS.filter((a) => a.category === "hook").map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    backgroundColor: "#0b2920",
                    border: "1.5px solid rgba(16, 185, 129, 0.25)",
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
                    <span style={{ fontSize: "28px", marginBottom: "8px", display: "block" }}>{asset.emoji}</span>
                    <span style={{ fontSize: "9px", fontWeight: 800, color: "#10B981" }}>
                      {isPt ? asset.badgePt : asset.badgeEs}
                    </span>
                    <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff", margin: "4px 0" }}>
                      {isPt ? asset.titlePt : asset.titleEs}
                    </h4>
                    <p style={{ fontSize: "10px", color: "#a7f3d0", margin: 0 }}>
                      {isPt ? asset.descPt : asset.descEs}
                    </p>
                  </div>
                  <button
                    disabled={isDownloading}
                    onClick={() => downloadMarketingAsset(asset.id)}
                    style={{
                      background: "#10B981",
                      border: "none",
                      color: "#000000",
                      padding: "8px",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "11px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Download size={13} />
                    <span>Descargar HD</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORÍA 2: MID-ROLLS */}
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 900,
                color: "#10B981",
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "left",
              }}
            >
              ⏸️ Mid-Rolls (Retención del Espectador a la Mitad del Reel)
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {MARKETING_ASSETS.filter((a) => a.category === "mid").map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    backgroundColor: "#0b2920",
                    border: "1.5px solid rgba(16, 185, 129, 0.25)",
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
                    <span style={{ fontSize: "28px", marginBottom: "8px", display: "block" }}>{asset.emoji}</span>
                    <span style={{ fontSize: "9px", fontWeight: 800, color: "#10B981" }}>
                      {isPt ? asset.badgePt : asset.badgeEs}
                    </span>
                    <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff", margin: "4px 0" }}>
                      {isPt ? asset.titlePt : asset.titleEs}
                    </h4>
                    <p style={{ fontSize: "10px", color: "#a7f3d0", margin: 0 }}>
                      {isPt ? asset.descPt : asset.descEs}
                    </p>
                  </div>
                  <button
                    disabled={isDownloading}
                    onClick={() => downloadMarketingAsset(asset.id)}
                    style={{
                      background: "#10B981",
                      border: "none",
                      color: "#000000",
                      padding: "8px",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "11px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Download size={13} />
                    <span>Descargar HD</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORÍA 3: CTAS (CIERRES) */}
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 900,
                color: "#10B981",
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "left",
              }}
            >
              🎯 Llamados a la Acción (Cierre Exitoso con Derivación de Tráfico)
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {MARKETING_ASSETS.filter((a) => a.category === "cta").map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    backgroundColor: "#0b2920",
                    border: "1.5px solid rgba(16, 185, 129, 0.25)",
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
                    <span style={{ fontSize: "28px", marginBottom: "8px", display: "block" }}>{asset.emoji}</span>
                    <span style={{ fontSize: "9px", fontWeight: 800, color: "#10B981" }}>
                      {isPt ? asset.badgePt : asset.badgeEs}
                    </span>
                    <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff", margin: "4px 0" }}>
                      {isPt ? asset.titlePt : asset.titleEs}
                    </h4>
                    <p style={{ fontSize: "10px", color: "#a7f3d0", margin: 0 }}>
                      {isPt ? asset.descPt : asset.descEs}
                    </p>
                  </div>
                  <button
                    disabled={isDownloading}
                    onClick={() => downloadMarketingAsset(asset.id)}
                    style={{
                      background: "#10B981",
                      border: "none",
                      color: "#000000",
                      padding: "8px",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "11px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Download size={13} />
                    <span>Descargar HD</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CARRUSELES INSTAGRAM */}
      {activeTab === "carousels" && (
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            backgroundColor: "#0b2920",
            border: "1.5px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "20px",
            padding: "24px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <Award size={34} color="#10B981" style={{ marginBottom: "12px" }} />
          <h2 style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", margin: "0 0 8px 0" }}>
            Generador de Carruseles Multi-Slide
          </h2>
          <p style={{ fontSize: "13px", color: "#a7f3d0", margin: "0 0 20px 0" }}>
            Cargá plantillas dinámicas paso a paso para carruseles de Instagram.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              textAlign: "left",
            }}
          >
            {DEFAULT_CAROUSEL.map((slide, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ fontSize: "9px", fontWeight: 800, color: "#10B981" }}>
                    SLIDE {index + 1} · {slide.badge}
                  </span>
                  <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff", margin: "4px 0" }}>
                    {slide.title}
                  </h4>
                  <p style={{ fontSize: "10px", color: "#a7f3d0", margin: 0 }}>
                    {slide.desc}
                  </p>
                </div>
                <button
                  disabled={isDownloading}
                  onClick={() => downloadSlideAsImage(index)}
                  style={{
                    background: "#10B981",
                    border: "none",
                    color: "#000000",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "11px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Download size={12} />
                  <span>Guardar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
    }
