// app/admin/banners/page.tsx
"use client";

import React, { useState } from "react";
import { Smartphone, Zap, CheckCircle2, XCircle, Award, Download, Gift, Sparkles } from "lucide-react";

type TabId = "carousels" | "fb_cover" | "marketing_assets" | "before_after";

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
  const [activeTab, setActiveTab] = useState<TabId>("fb_cover");
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [isDownloading, setIsDownloading] = useState(false);
  const isPt = lang === "pt";

  const tabs = [
    { id: "fb_cover" as TabId, label: "Portada Facebook Pro", icon: "🖼️" },
    { id: "carousels" as TabId, label: "Carrusel Pro (5 Placas)", icon: "🎠" },
    { id: "marketing_assets" as TabId, label: "Hooks y Cierres Pro", icon: "🎬" },
    { id: "before_after" as TabId, label: "Antes vs Después", icon: "⚡" },
  ];

  /* ─── DESCARGAR PORTADA FACEBOOK HD 1640x856 ─── */
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
        console.warn("Logo fallback:", e);
      }

      // Fondo oscuro
      ctx.fillStyle = "#061a14";
      ctx.fillRect(0, 0, width, height);

      // Gradient glow
      const g = ctx.createRadialGradient(width / 2, height / 2, 40 * S, width / 2, height / 2, 350 * S);
      g.addColorStop(0, "rgba(16,185,129,0.25)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 350 * S, 0, Math.PI * 2);
      ctx.fill();

      // Rejilla
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40 * S) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Header logo
      const logoSize = 44 * S;
      const logoX = 40 * S;
      const logoY = 36 * S;

      if (logoImg) {
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      } else {
        ctx.fillStyle = "#10B981";
        drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 12 * S);
        ctx.fill();
      }

      ctx.fillStyle = "#fff";
      ctx.font = `950 ${20 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("NEVUX", logoX + logoSize + 12 * S, logoY + logoSize / 2);

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText(
        isPt ? "ECOSSISTEMA OFICIAL N° 1 DE VENDAS DANIUVEMSHOP" : "ECOSISTEMA N° 1 DE VENTAS PARA TIENDANUBE",
        width - 40 * S,
        logoY + logoSize / 2
      );

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(40 * S, 96 * S);
      ctx.lineTo(width - 40 * S, 96 * S);
      ctx.stroke();

      // Título Principal
      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${22 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      wrapText(
        ctx,
        isPt
          ? "MULTIPIQUE AS VENDAS E O TICKET MÉDIO DA SUA LOJA 🚀"
          : "MULTIPLICÁ LAS VENTAS Y EL TICKET PROMEDIO DE TU TIENDANUBE 🚀",
        width / 2,
        115 * S,
        width - 80 * S,
        30 * S
      );

      // Columna 1: WIDGETS
      const colW = (width - 100 * S) / 3;
      const colH = 200 * S;
      const colY = 175 * S;

      ctx.fillStyle = "rgba(11, 41, 32, 0.85)";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
      ctx.lineWidth = 2 * S;
      drawRoundedRect(ctx, 36 * S, colY, colW, colH, 18 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("⚡ 26+ WIDGETS PRO", 36 * S + colW / 2, colY + 14 * S);

      const itemsW = [
        "• Temporizadores Hot Sale",
        "• Urgencia de Stock Crítico",
        "• Bundles 2x1 y 3x2",
        "• Info de Despacho 24hs",
        "• Reseñas Destacadas",
        "• Popups con Ruleta"
      ];
      ctx.fillStyle = "#a7f3d0";
      ctx.font = `600 ${8.5 * S}px sans-serif`;
      ctx.textAlign = "left";
      itemsW.forEach((item, idx) => {
        ctx.fillText(item, 36 * S + 14 * S, colY + 42 * S + idx * 24 * S);
      });

      // Columna 2: FUNCIONES IA
      ctx.fillStyle = "rgba(11, 41, 32, 0.85)";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
      ctx.lineWidth = 2 * S;
      drawRoundedRect(ctx, 36 * S + colW + 14 * S, colY, colW, colH, 18 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("🤖 SUITE INTELIGENCIA ARTIFICIAL", 36 * S + colW + 14 * S + colW / 2, colY + 14 * S);

      const itemsIa = [
        "• Vendedor Virtual IA 24/7",
        "• NevuxBot CRM + WhatsApp",
        "• Notificaciones en Vivo",
        "• Buscador por Voz IA",
        "• Traducción Multilingüe",
        "• Métricas ROI en Tiempo Real"
      ];
      ctx.fillStyle = "#a7f3d0";
      ctx.font = `600 ${8.5 * S}px sans-serif`;
      ctx.textAlign = "left";
      itemsIa.forEach((item, idx) => {
        ctx.fillText(item, 36 * S + colW + 14 * S + 14 * S, colY + 42 * S + idx * 24 * S);
      });

      // Columna 3: RECOMPENSA Y RECONOCIMIENTO A MIEMBROS FIELES
      ctx.fillStyle = "rgba(16, 185, 129, 0.14)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2.5 * S;
      drawRoundedRect(ctx, 36 * S + (colW + 14 * S) * 2, colY, colW, colH, 18 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("🎁 RECOMPENSAS Y FIDELIDAD", 36 * S + (colW + 14 * S) * 2 + colW / 2, colY + 14 * S);

      const itemsRec = [
        "• Premiamos tu fidelidad",
        "• Meses de regalo acumulables",
        "• Soporte VIP Prioritario",
        "• Actualizaciones Pro gratis",
        "• Comunidad de Alta Conversión",
        "• 0% comisión por ventas"
      ];
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${8.5 * S}px sans-serif`;
      ctx.textAlign = "left";
      itemsRec.forEach((item, idx) => {
        ctx.fillText(item, 36 * S + (colW + 14 * S) * 2 + 14 * S, colY + 42 * S + idx * 24 * S);
      });

      // CTA FOOTER
      const ctaY = height - 76 * S;
      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, 36 * S, ctaY, width - 72 * S, 48 * S, 16 * S);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.font = `950 ${13 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        isPt ? "🚀 INSTALE NEVUX NA NUVEMSHOP · 7 DIAS GRÁTIS SEM CARTÃO · NEVUX.AR" : "🚀 INSTALÁ NEVUX EN TU TIENDANUBE · 7 DÍAS GRATIS SIN TARJETA · NEVUX.AR",
        width / 2,
        ctaY + 24 * S
      );

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

  /* ─── DESCARGAR SLIDES Y ASSETS RESTANTES ─── */
  const downloadSlideAsImage = async (slideIndex: number) => {
    const slide = PREMIUM_CAROUSEL_SLIDES[slideIndex];
    if (!slide) return;
    setIsDownloading(true);
    try {
      const width = 1080;
      const height = 1350;
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

      ctx.fillStyle = "#060913";
      ctx.fillRect(0, 0, width, height);

      const logoSize = 32 * S;
      if (logoImg) {
        ctx.drawImage(logoImg, 36 * S, 32 * S, logoSize, logoSize);
      }

      ctx.fillStyle = "#fff";
      ctx.font = `900 ${16 * S}px sans-serif`;
      ctx.fillText("NEVUX", 36 * S + logoSize + 10 * S, 32 * S + logoSize / 2);

      const a = document.createElement("a");
      a.download = `nevux-carrusel-slide-${slideIndex + 1}.png`;
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

      {/* TAB 0: PORTADA FACEBOOK PRO (1640x856 LIMPIA EN PANTALLA) */}
      {activeTab === "fb_cover" && (
        <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              background: "#061a14",
              border: "2px solid #10B981",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* BRANDING HEADER */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/icon.svg" alt="Nevux" style={{ width: "32px", height: "32px" }} />
                <span style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>NEVUX</span>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#10B981", textTransform: "uppercase" }}>
                ECOSISTEMA N° 1 TIENDANUBE
              </span>
            </div>

            {/* TÍTULO PRINCIPAL */}
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 900, color: "#ffffff", textAlign: "center", lineHeight: 1.3 }}>
              {isPt
                ? "MULTIPLIQUE AS VENDAS E O TICKET MÉDIO DA SUA NUVEMSHOP 🚀"
                : "MULTIPLICÁ LAS VENTAS Y EL TICKET PROMEDIO DE TU TIENDANUBE 🚀"}
            </h2>

            {/* BLOQUES DE SERVICIOS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {/* 1. WIDGETS */}
              <div style={{ background: "rgba(11, 41, 32, 0.85)", border: "1px solid rgba(16, 185, 129, 0.35)", borderRadius: "12px", padding: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 900, color: "#10B981", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Zap size={14} />
                  26+ WIDGETS DE CONVERSIÓN
                </div>
                <div style={{ fontSize: "10px", color: "#a7f3d0", lineHeight: 1.5, fontWeight: 600 }}>
                  • Temporizadores Hot Sale · Urgencia de Stock Crítico<br />
                  • Bundles 2x1 y 3x2 · Info de Despacho 24hs<br />
                  • Reseñas Destacadas · Popups con Ruleta
                </div>
              </div>

              {/* 2. IA Y PRO */}
              <div style={{ background: "rgba(11, 41, 32, 0.85)", border: "1px solid rgba(16, 185, 129, 0.35)", borderRadius: "12px", padding: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 900, color: "#10B981", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} />
                  SUITE INTELIGENCIA ARTIFICIAL
                </div>
                <div style={{ fontSize: "10px", color: "#a7f3d0", lineHeight: 1.5, fontWeight: 600 }}>
                  • Vendedor Virtual IA 24/7 · NevuxBot CRM + WhatsApp<br />
                  • Notificaciones de Compras en Vivo (Social Proof)<br />
                  • Buscador por Voz IA · Traducción Multilingüe
                </div>
              </div>

              {/* 3. RECOMPENSAS Y FIDELIDAD */}
              <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1.5px solid #10B981", borderRadius: "12px", padding: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 900, color: "#10B981", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Gift size={14} />
                  🎁 RECOMPENSAS & FIDELIDAD
                </div>
                <div style={{ fontSize: "10px", color: "#ffffff", lineHeight: 1.5, fontWeight: 700 }}>
                  Recompensamos la fidelidad de los comercios con meses de regalo acumulables, Soporte VIP prioritario y actualizaciones Pro exclusivas gratis.
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div style={{ background: "#10B981", borderRadius: "10px", padding: "10px", textAlign: "center", color: "#000000", fontSize: "11px", fontWeight: 900 }}>
              APP STORE TIENDANUBE ID #37382 · 7 DÍAS GRATIS · NEVUX.AR
            </div>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadFbCoverAsset}
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
            Descargar Portada Facebook HD (1640×856)
          </button>
        </div>
      )}

      {/* TAB 1: CARRUSEL PRO EN CASCADA */}
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src="/icon.svg" alt="Nevux Logo" style={{ width: "32px", height: "32px", display: "block" }} />
                    <span style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.02em" }}>NEVUX</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 800, fontFamily: "monospace", color: "#10B981" }}>0{index + 1} / 05</span>
                </div>

                <div>
                  <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 900, color: badgeColor, background: slide.type === "problem" ? "rgba(239,68,68,0.15)" : slide.type === "comparison" ? "rgba(59,130,246,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${badgeColor}` }}>
                    {badgeText}
                  </span>
                </div>

                <h2 style={{ margin: "0", fontSize: "21px", fontWeight: 900, color: "#ffffff", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
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

      {/* TAB 2: HOOKS Y CIERRES */}
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

      {/* TAB 3: ANTES VS DESPUÉS */}
      {activeTab === "before_after" && (
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div style={{ backgroundColor: "#0b2920", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: "20px", padding: "20px", textAlign: "center" }}>
            <Zap size={32} color="#10B981" style={{ marginBottom: "10px" }} />
            <h2 style={{ fontSize: "17px", fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
              {isPt ? "Comparativo Antes vs Depois" : "Comparativo Antes vs Después"}
            </h2>

            <div style={{ background: "#05080f", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "16px", textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* SIN NEVUX */}
                <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 900, color: "#ef4444", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <XCircle size={14} />
                    {isPt ? "SEM NEVUX" : "SIN NEVUX"}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10px", color: "#fca5a5", lineHeight: 1.6 }}>
                    <li>97% abandono de carrito</li>
                    <li>Sin urgencia ni escasez</li>
                    <li>Visitas entran y se van $0</li>
                    <li>Sin prueba social flotante</li>
                  </ul>
                </div>

                {/* CON NEVUX */}
                <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1.5px solid #10B981", borderRadius: "12px", padding: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 900, color: "#10B981", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} />
                    {isPt ? "COM NEVUX" : "CON NEVUX"}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10px", color: "#a7f3d0", lineHeight: 1.6, fontWeight: 700 }}>
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
