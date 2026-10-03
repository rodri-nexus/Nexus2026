// app/admin/banners/page.tsx
"use client";

import React, { useState } from "react";
import { Smartphone, Zap, CheckCircle2, XCircle, Award, Download, Gift, Sparkles, Play } from "lucide-react";

type TabId = "reel_cover" | "fb_cover" | "carousels" | "marketing_assets" | "before_after";

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
   HELPERS & DIBUJO CANVAS (Regla #9 al inicio)
═══════════════════════════════════════════ */
function loadLogoImage(): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = "/icon.svg";
  });
}

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
): number {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[n] + " ";
      cy += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, cy);
  return cy;
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
  const [activeTab, setActiveTab] = useState<TabId>("reel_cover");
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [isDownloading, setIsDownloading] = useState(false);
  const isPt = lang === "pt";

  const tabs = [
    { id: "reel_cover" as TabId, label: "Portada Reel Martes", icon: "🎬" },
    { id: "fb_cover" as TabId, label: "Portada Facebook Pro", icon: "🖼️" },
    { id: "carousels" as TabId, label: "Carrusel Pro (5 Placas)", icon: "🎠" },
    { id: "before_after" as TabId, label: "Antes vs Después", icon: "⚡" },
  ];

  /* ─── DESCARGAR PORTADA DE REEL HD 1080x1920 ─── */
  const downloadReelCoverCanvas = async () => {
    setIsDownloading(true);
    try {
      const width = 1080;
      const height = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const S = width / 340;

      let logoImg: HTMLImageElement | null = null;
      try {
        logoImg = await loadLogoImage();
      } catch (e) {
        console.warn("Logo fallback:", e);
      }

      // Fondo oscuro
      ctx.fillStyle = "#061a14";
      ctx.fillRect(0, 0, width, height);

      // Glow radial
      const g = ctx.createRadialGradient(width / 2, height / 2, 40 * S, width / 2, height / 2, 380 * S);
      g.addColorStop(0, "rgba(16,185,129,0.3)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 380 * S, 0, Math.PI * 2);
      ctx.fill();

      // Rejilla sutil
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 48 * S) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Header logo
      const logoSize = 48 * S;
      const logoX = (width - (logoSize + 120 * S)) / 2;
      const logoY = 120 * S;

      if (logoImg) {
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      } else {
        ctx.fillStyle = "#10B981";
        drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 14 * S);
        ctx.fill();
      }

      ctx.fillStyle = "#fff";
      ctx.font = `950 ${22 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("NEVUX", logoX + logoSize + 14 * S, logoY + logoSize / 2);

      // Badge central
      const bText = isPt ? "🧠 PSICOLOGIA DE VENDAS" : "🧠 PSICOLOGÍA DE VENTAS";
      ctx.font = `900 ${11 * S}px sans-serif`;
      const btw = ctx.measureText(bText).width + 32 * S;
      const bY = 240 * S;
      ctx.fillStyle = "rgba(16,185,129,0.18)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2 * S;
      drawRoundedRect(ctx, (width - btw) / 2, bY, btw, 32 * S, 16 * S);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#10B981";
      ctx.textAlign = "center";
      ctx.fillText(bText, width / 2, bY + 16 * S);

      // Título principal gigante
      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${26 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      wrapText(
        ctx,
        isPt
          ? "O TRUQUE PSICOLÓGICO QUE MULTIPLICA VENDAS NA NUVEMSHOP 📈"
          : "EL TRUCO PSICOLÓGICO QUE MULTIPLICA VENTAS EN TIENDANUBE 📈",
        width / 2,
        300 * S,
        width - 96 * S,
        36 * S
      );

      // Card Mockup de Prueba Social (Centro del video)
      const mockW = width - 120 * S;
      const mockH = 140 * S;
      const mockX = 60 * S;
      const mockY = 500 * S;

      ctx.fillStyle = "rgba(11, 41, 32, 0.95)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2.5 * S;
      drawRoundedRect(ctx, mockX, mockY, mockW, mockH, 22 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("🛒 Camila R. de Buenos Aires", mockX + 24 * S, mockY + 36 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${11 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "Acabou de comprar o Produto Destaque" : "Acaba de comprar el Producto Destacado",
        mockX + 24 * S,
        mockY + 68 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `800 ${10 * S}px sans-serif`;
      ctx.fillText("⚡ há 2 minutos · Prova Social ao Vivo", mockX + 24 * S, mockY + 98 * S);

      // Subtítulo
      ctx.fillStyle = "#a7f3d0";
      ctx.font = `700 ${14 * S}px sans-serif`;
      ctx.textAlign = "center";
      wrapText(
        ctx,
        isPt
          ? "Ative notificações ao vivo e comprove o efeito manada"
          : "Activá notificaciones en vivo y comprobá el efecto manada",
        width / 2,
        height - 240 * S,
        width - 96 * S,
        22 * S
      );

      // Footer
      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.fillText("NEVUX.AR · 7 DÍAS GRATIS EN TIENDANUBE", width / 2, height - 100 * S);

      const a = document.createElement("a");
      a.download = `nevux-portada-reel-martes.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── DESCARGAR OTROS ASSETS ─── */
  const downloadFbCoverAsset = async () => {
    setIsDownloading(true);
    try {
      const width = 1640;
      const height = 856;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const S = width / 500;
      let logoImg: HTMLImageElement | null = null;
      try {
        logoImg = await loadLogoImage();
      } catch (e) {
        console.warn(e);
      }

      ctx.fillStyle = "#061a14";
      ctx.fillRect(0, 0, width, height);

      const logoSize = 44 * S;
      if (logoImg) {
        ctx.drawImage(logoImg, 40 * S, 36 * S, logoSize, logoSize);
      }

      ctx.fillStyle = "#fff";
      ctx.font = `950 ${20 * S}px sans-serif`;
      ctx.fillText("NEVUX", 40 * S + logoSize + 12 * S, 36 * S + logoSize / 2);

      const a = document.createElement("a");
      a.download = `nevux-portada-facebook.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
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

        <div style={{ display: "flex", gap: "6px", background: "#061a14", padding: "4px", borderRadius: "12px", width: "100%", overflowX: "auto" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: "8px",
                fontSize: "10px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: activeTab === tab.id ? "#10B981" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#6ee7b7",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PORTADA REEL MARTES (FORMATO 9:16 / 1080x1920 LIMPIO PARA CAPTURA O DESCARGA) */}
      {activeTab === "reel_cover" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#061a14",
              border: "2.5px solid #10B981",
              borderRadius: "28px",
              padding: "24px 20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* LOGO SUPERIOR */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.02em" }}>
                NEVUX
              </span>
            </div>

            {/* BADGE CENTRAL */}
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 900,
                color: "#10B981",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10B981",
              }}
            >
              {isPt ? "🧠 PSICOLOGIA DE VENDAS" : "🧠 PSICOLOGÍA DE VENTAS"}
            </div>

            {/* TÍTULO IMPACTO */}
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              {isPt
                ? "O TRUQUE PSICOLÓGICO QUE MULTIPLICA VENDAS NA NUVEMSHOP 📈"
                : "EL TRUCO PSICOLÓGICO QUE MULTIPLICA VENTAS EN TIENDANUBE 📈"}
            </h2>

            {/* MOCKUP CARD PRUEBA SOCIAL EN VIVO */}
            <div
              style={{
                width: "100%",
                background: "rgba(11, 41, 32, 0.95)",
                border: "1.5px solid #10B981",
                borderRadius: "18px",
                padding: "14px",
                textAlign: "left",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 900, color: "#10B981", marginBottom: "4px" }}>
                🛒 Camila R. de Buenos Aires
              </div>
              <div style={{ fontSize: "11px", color: "#ffffff", fontWeight: 700 }}>
                {isPt ? "Acabou de comprar o Produto Destaque" : "Acaba de comprar el Producto Destacado"}
              </div>
              <div style={{ fontSize: "10px", color: "#10B981", fontWeight: 800, marginTop: "4px" }}>
                ⚡ hace 2 min · Prueba Social en Vivo
              </div>
            </div>

            {/* SUBTÍTULO */}
            <p style={{ margin: 0, fontSize: "12px", color: "#a7f3d0", fontWeight: 600, lineHeight: 1.4 }}>
              {isPt
                ? "Ative notificações ao vivo e comprove o efeito manada"
                : "Activá notificaciones en vivo y comprobá el efecto manada"}
            </p>

            {/* FOOTER MARCA */}
            <div style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>
              NEVUX.AR · 7 DÍAS GRATIS EN TIENDANUBE
            </div>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadReelCoverCanvas}
            style={{
              width: "100%",
              background: "#10B981",
              border: "none",
              color: "#000",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: 900,
              fontSize: "13px",
              cursor: isDownloading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Download size={16} />
            Descargar Portada Reel HD (1080×1920)
          </button>
        </div>
      )}

      {/* TAB 2: PORTADA FACEBOOK */}
      {activeTab === "fb_cover" && (
        <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ width: "100%", background: "#061a14", border: "2px solid #10B981", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/icon.svg" alt="Nevux" style={{ width: "32px", height: "32px" }} />
                <span style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>NEVUX</span>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#10B981" }}>ECOSISTEMA N° 1 TIENDANUBE</span>
            </div>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 900, color: "#ffffff", textAlign: "center", lineHeight: 1.3 }}>
              {isPt ? "MULTIPLIQUE AS VENDAS E O TICKET MÉDIO DA SUA NUVEMSHOP 🚀" : "MULTIPLICÁ LAS VENTAS Y EL TICKET PROMEDIO DE TU TIENDANUBE 🚀"}
            </h2>
          </div>
          <button disabled={isDownloading} onClick={downloadFbCoverAsset} style={{ width: "100%", background: "#10B981", border: "none", color: "#000", padding: "12px", borderRadius: "12px", fontWeight: 900, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Download size={16} /> Descargar Portada Facebook HD
          </button>
        </div>
      )}

      {/* TAB 3: CARRUSEL PRO */}
      {activeTab === "carousels" && (
        <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {PREMIUM_CAROUSEL_SLIDES.map((slide, index) => {
            const badgeText = isPt ? slide.badgePt : slide.badgeEs;
            const badgeColor = slide.type === "problem" ? "#ef4444" : slide.type === "comparison" ? "#3b82f6" : "#10B981";

            return (
              <div key={index} style={{ width: "100%", aspectRatio: "4 / 5", background: slide.type === "problem" ? "#0c0407" : slide.type === "comparison" ? "#070b14" : slide.type === "solution" ? "#03120c" : slide.type === "cta" ? "#021a12" : "#060913", border: "2px solid rgba(16, 185, 129, 0.4)", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src="/icon.svg" alt="Nevux Logo" style={{ width: "32px", height: "32px" }} />
                    <span style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 800, fontFamily: "monospace", color: "#10B981" }}>0{index + 1} / 05</span>
                </div>
                <div>
                  <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 900, color: badgeColor, background: slide.type === "problem" ? "rgba(239,68,68,0.15)" : slide.type === "comparison" ? "rgba(59,130,246,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${badgeColor}` }}>
                    {badgeText}
                  </span>
                </div>
                <h2 style={{ margin: "0", fontSize: "21px", fontWeight: 900, color: "#ffffff", lineHeight: 1.3 }}>
                  {isPt ? slide.titlePt : slide.titleEs}
                </h2>
                {slide.metric && (
                  <div style={{ padding: "12px 16px", borderRadius: "14px", background: slide.type === "cta" ? "#10B981" : "rgba(16, 185, 129, 0.12)", border: "1.5px solid #10B981", textAlign: "center", color: slide.type === "cta" ? "#000000" : "#10B981", fontSize: "13px", fontWeight: 900 }}>
                    {slide.metric}
                  </div>
                )}
                <div style={{ background: "rgba(10, 12, 16, 0.88)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "16px", padding: "16px" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#d1fae5", lineHeight: 1.55, whiteSpace: "pre-line", fontWeight: 600 }}>
                    {isPt ? slide.descPt : slide.descEs}
                  </p>
                </div>
                <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 800, color: "#10B981" }}>
                  {slide.type === "cta" ? "NEVUX.AR · APP OFICIAL" : isPt ? "DESLIZE PARA VER ➔" : "DESLIZÁ PARA CONTINUAR ➔"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: HOOKS Y CIERRES */}
      {activeTab === "marketing_assets" && (
        <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {(["hook", "mid", "cta"] as const).map((cat) => (
            <div key={cat}>
              <h3 style={{ fontSize: "14px", fontWeight: 900, color: "#10B981", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>
                {cat === "hook" && "🪝 Ganchos Pro (0–3s del Reel)"}
                {cat === "mid" && "⏸️ Mid-Rolls Pro (Retención)"}
                {cat === "cta" && "🎯 Cierres CTA Pro (Conversión)"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                {MARKETING_ASSETS.filter((a) => a.category === cat).map((asset) => (
                  <div key={asset.id} style={{ backgroundColor: "#0b2920", border: "1.5px solid rgba(16,185,129,0.25)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px", textAlign: "left" }}>
                    <div>
                      <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>{asset.emoji}</span>
                      <span style={{ fontSize: "9px", fontWeight: 800, color: "#10B981" }}>{isPt ? asset.badgePt : asset.badgeEs}</span>
                      <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#fff", margin: "6px 0 4px" }}>{isPt ? asset.titlePt : asset.titleEs}</h4>
                      <p style={{ fontSize: "11px", color: "#a7f3d0", margin: 0, lineHeight: 1.4 }}>{isPt ? asset.descPt : asset.descEs}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: ANTES VS DESPUÉS */}
      {activeTab === "before_after" && (
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div style={{ backgroundColor: "#0b2920", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: "20px", padding: "20px", textAlign: "center" }}>
            <Zap size={32} color="#10B981" style={{ marginBottom: "10px" }} />
            <h2 style={{ fontSize: "17px", fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
              {isPt ? "Comparativo Antes vs Depois" : "Comparativo Antes vs Después"}
            </h2>

            <div style={{ background: "#05080f", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "16px", textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 900, color: "#ef4444", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <XCircle size={14} /> {isPt ? "SEM NEVUX" : "SIN NEVUX"}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10px", color: "#fca5a5", lineHeight: 1.6 }}>
                    <li>97% abandono de carrito</li>
                    <li>Sin urgencia ni escasez</li>
                    <li>Visitas entran y se van $0</li>
                  </ul>
                </div>

                <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1.5px solid #10B981", borderRadius: "12px", padding: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 900, color: "#10B981", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} /> {isPt ? "COM NEVUX" : "CON NEVUX"}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10px", color: "#a7f3d0", lineHeight: 1.6, fontWeight: 700 }}>
                    <li>Conversión ×3 + Métrica ROI</li>
                    <li>Timers de urgencia y stock</li>
                    <li>Vendedor IA cerrando 24/7</li>
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
