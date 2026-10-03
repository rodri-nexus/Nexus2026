// app/admin/banners/page.tsx
"use client";

import React, { useState } from "react";
import { Smartphone, Zap, CheckCircle2, XCircle, Award, Download, Gift, Sparkles, Play, ArrowDown, HelpCircle, Link as LinkIcon, ShieldCheck, AlertCircle, TrendingUp } from "lucide-react";

type TabId = 
  | "reel_cover" 
  | "fb_cover" 
  | "carousels" 
  | "marketing_assets" 
  | "before_after"
  | "story_lunes_encuesta"
  | "story_lunes_dolor"
  | "story_lunes_feed"
  | "story_martes_psicologia"
  | "story_martes_encuesta"
  | "story_martes_perdida"
  | "story_martes_reel"
  | "miercoles_carrusel"
  | "miercoles_stories";

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
  const [activeTab, setActiveTab] = useState<TabId>("story_lunes_encuesta");
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [isDownloading, setIsDownloading] = useState(false);
  const isPt = lang === "pt";

  // Agrupación de pestañas legibles en celulares
  const categoryFeedTabs = [
    { id: "reel_cover" as TabId, label: "Portada Reel", icon: "🎬" },
    { id: "fb_cover" as TabId, label: "Portada FB Pro", icon: "🖼️" },
    { id: "carousels" as TabId, label: "Carrusel Pro (5 Placas)", icon: "Carousel" },
    { id: "before_after" as TabId, label: "Antes vs Después", icon: "⚡" },
  ];

  const categoryMondayTabs = [
    { id: "story_lunes_encuesta" as TabId, label: "H1: Encuesta Diag (Nueva)", icon: "📊" },
    { id: "story_lunes_dolor" as TabId, label: "H2: Dolor (97%)", icon: "📉" },
    { id: "story_lunes_feed" as TabId, label: "H3: Empuje Feed", icon: "👉" },
  ];

  const categoryTuesdayTabs = [
    { id: "story_martes_psicologia" as TabId, label: "H1: Psicología (Poll)", icon: "🧠" },
    { id: "story_martes_encuesta" as TabId, label: "H2: Encuesta", icon: "🗳️" },
    { id: "story_martes_perdida" as TabId, label: "H3: Pérdida (1 a 3)", icon: "⚠️" },
    { id: "story_martes_reel" as TabId, label: "H4: Empuje Reel (Link)", icon: "🔗" },
  ];

  const categoryWednesdayTabs = [
    { id: "miercoles_carrusel" as TabId, label: "Carrusel Miércoles (01-03)", icon: "🎠" },
    { id: "miercoles_stories" as TabId, label: "Stories Miércoles", icon: "📱" },
  ];

  const categoryTextTabs = [
    { id: "marketing_assets" as TabId, label: "Ganchos & Cierres (Textos)", icon: "✍️" },
  ];

  /* ─── CANVAS: COMÚN DE FONDO PREMIUM ─── */
  const preparePremiumBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, S: number) => {
    ctx.fillStyle = "#020a07";
    ctx.fillRect(0, 0, width, height);

    const g = ctx.createRadialGradient(width / 2, height / 2, 50 * S, width / 2, height / 2, 360 * S);
    g.addColorStop(0, "rgba(16,185,129,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 360 * S, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(16,185,129,0.03)";
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
  };

  /* ─── CANVAS: INTEGRAR LOGO CABECERA ─── */
  const drawHeaderLogo = (ctx: CanvasRenderingContext2D, width: number, logoImg: HTMLImageElement | null, S: number) => {
    const logoSize = 44 * S;
    const logoX = (width - (logoSize + 110 * S)) / 2;
    const logoY = 100 * S;

    if (logoImg) {
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    } else {
      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 12 * S);
      ctx.fill();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = `950 ${20 * S}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("NEVUX", logoX + logoSize + 12 * S, logoY + logoSize / 2);
  };

  /* ─── CANVAS: PORTADA DE REEL HD ─── */
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn("Logo fallback:", e); }

      preparePremiumBackground(ctx, width, height, S);
      drawHeaderLogo(ctx, width, logoImg, S);

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

      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${25 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      wrapText(
        ctx,
        isPt
          ? "O TRUQUE PSICOLÓGICO QUE MULTIPLICA VENDAS NA NUVEMSHOP 📈"
          : "EL TRUCO PSICOLÓGICO QUE MULTIPLICA VENTAS EN TIENDANUBE 📈",
        width / 2,
        310 * S,
        width - 96 * S,
        36 * S
      );

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

  /* ─── CANVAS: HISTORIA LUNES - ENCUESTA DIAGNÓSTICO (NUEVA) ─── */
  const downloadLunesEncuestaCanvas = async () => {
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn(e); }

      preparePremiumBackground(ctx, width, height, S);
      drawHeaderLogo(ctx, width, logoImg, S);

      // Badge superior
      const bText = isPt ? "📊 ENQUETE DE DIAGNÓSTICO" : "📊 ENCUESTA DE DIAGNÓSTICO";
      ctx.font = `900 ${11 * S}px sans-serif`;
      const btw = ctx.measureText(bText).width + 30 * S;
      const bY = 220 * S;
      ctx.fillStyle = "rgba(16,185,129,0.18)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, (width - btw) / 2, bY, btw, 32 * S, 16 * S);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#10B981";
      ctx.textAlign = "center";
      ctx.fillText(bText, width / 2, bY + 16 * S);

      // Titulo superior
      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${24 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "Pergunta rápida para lojistas da Nuvemshop 👇"
          : "Pregunta rápida para dueños de tiendas en Tiendanube 👇",
        width / 2,
        280 * S,
        width - 70 * S,
        34 * S
      );

      // Caja Sticker interactiva
      const boxW = width - 100 * S;
      const boxH = 340 * S;
      const boxX = 50 * S;
      const boxY = height / 2 - 130 * S;

      ctx.fillStyle = "rgba(16,185,129,0.04)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2 * S;
      ctx.setLineDash([8 * S, 6 * S]);
      drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 22 * S);
      ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "📥 COLOQUE SEU STICKER DE ENQUETE AQUI" : "📥 COLOCÁ TU STICKER DE ENCUESTA ACÁ",
        width / 2,
        boxY + 35 * S
      );

      ctx.fillStyle = "#ffffff";
      ctx.font = `800 ${14 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt 
          ? "De cada 100 pessoas que entram na sua loja online, quantas compram?" 
          : "De cada 100 personas que entran a tu tienda online, ¿cuántas te compran?",
        width / 2,
        boxY + 80 * S,
        boxW - 40 * S,
        20 * S
      );

      // Opción A simulada
      ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1 * S;
      drawRoundedRect(ctx, boxX + 20 * S, boxY + 165 * S, boxW - 40 * S, 55 * S, 12 * S);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${12 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText(
        isPt ? "1 a 3 pessoas (1-3%)" : "1 a 3 personas (1-3%)",
        boxX + 40 * S,
        boxY + 192 * S
      );

      // Opción B simulada
      ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
      drawRoundedRect(ctx, boxX + 20 * S, boxY + 235 * S, boxW - 40 * S, 55 * S, 12 * S);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        isPt ? "Mais de 10 pessoas" : "Más de 10 personas",
        boxX + 40 * S,
        boxY + 262 * S
      );

      // Texto de agitación al pie
      ctx.fillStyle = "#94a3b8";
      ctx.font = `600 ${13 * S}px sans-serif`;
      ctx.textAlign = "center";
      wrapText(
        ctx,
        isPt
          ? "A média de conversão no varejo online é de 1%. Se você está nessa faixa, saiba o que fazer a seguir."
          : "La conversión promedio en e-commerce ronda el 1%. Si estás en ese promedio, mirá el siguiente story.",
        width / 2,
        height - 350 * S,
        width - 100 * S,
        22 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "VEJA O DIAGNÓSTICO REVELADOR ➔" : "VE EL DIAGNÓSTICO REVELADOR ➔",
        width / 2,
        height - 180 * S
      );

      const a = document.createElement("a");
      a.download = `nevux-story-lunes-encuesta.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── CANVAS: HISTORIA LUNES - DOLOR 97% ─── */
  const downloadLunesDolorCanvas = async () => {
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn(e); }

      ctx.fillStyle = "#040508";
      ctx.fillRect(0, 0, width, height);

      const g = ctx.createRadialGradient(width / 2, height / 2, 20 * S, width / 2, height / 2, 340 * S);
      g.addColorStop(0, "rgba(239, 68, 68, 0.28)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 340 * S, 0, Math.PI * 2);
      ctx.fill();

      drawHeaderLogo(ctx, width, logoImg, S);

      const bText = isPt ? "🚨 ATENÇÃO LOJISTA" : "🚨 ATENCIÓN COMERCIANTE";
      ctx.font = `900 ${11 * S}px sans-serif`;
      const btw = ctx.measureText(bText).width + 30 * S;
      const bY = 220 * S;
      ctx.fillStyle = "rgba(239,68,68,0.18)";
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, (width - btw) / 2, bY, btw, 32 * S, 16 * S);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#EF4444";
      ctx.textAlign = "center";
      ctx.fillText(bText, width / 2, bY + 16 * S);

      ctx.fillStyle = "#EF4444";
      ctx.font = `950 ${110 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("97%", width / 2, height / 2 - 10 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${23 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt ? "DE SEUS VISITANTES VAO EMBORA SEM COMPRAR" : "DE TUS VISITAS SE VAN SIN COMPRAR",
        width / 2,
        height / 2 + 100 * S,
        width - 80 * S,
        30 * S
      );

      ctx.fillStyle = "#94a3b8";
      ctx.font = `600 ${13 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "Isso significa que você está gastando dinheiro em publicidade para enviar tráfego a um balde furado. Corrija isso hoje."
          : "Estás gastando dinero en anuncios para mandar tráfico directo a un balde pinchado. Tu checkout está vacío.",
        width / 2,
        height / 2 + 190 * S,
        width - 100 * S,
        20 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${13 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "LEIA O PRÓXIMO STORY" : "DESLIZÁ PARA CONOCER EL SECRETO",
        width / 2,
        height - 180 * S
      );

      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 3 * S;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 12 * S, height - 140 * S);
      ctx.lineTo(width / 2, height - 120 * S);
      ctx.lineTo(width / 2 + 12 * S, height - 140 * S);
      ctx.stroke();

      const a = document.createElement("a");
      a.download = `nevux-story-lunes-dolor.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── CANVAS: HISTORIA LUNES - EMPUJE A FEED ─── */
  const downloadLunesFeedCanvas = async () => {
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn(e); }

      preparePremiumBackground(ctx, width, height, S);
      drawHeaderLogo(ctx, width, logoImg, S);

      const bText = isPt ? "🔥 NOVO POST REVELADOR" : "🔥 NUEVO POST REVELADOR";
      ctx.font = `900 ${11 * S}px sans-serif`;
      const btw = ctx.measureText(bText).width + 30 * S;
      const bY = 220 * S;
      ctx.fillStyle = "rgba(16,185,129,0.18)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, (width - btw) / 2, bY, btw, 32 * S, 16 * S);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#10B981";
      ctx.textAlign = "center";
      ctx.fillText(bText, width / 2, bY + 16 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${24 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "COMO ACABAR COM A FUGA DE CLIENTES NA NUVEMSHOP"
          : "CÓMO FRENAR LA FUGA DE CLIENTES EN TIENDANUBE",
        width / 2,
        290 * S,
        width - 80 * S,
        34 * S
      );

      const feedW = width - 120 * S;
      const feedH = feedW * 1.25;
      const feedX = 60 * S;
      const feedY = 430 * S;

      ctx.fillStyle = "#0c0407";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 3 * S;
      drawRoundedRect(ctx, feedX, feedY, feedW, feedH, 24 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.font = `950 ${45 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("97%", width / 2, feedY + 160 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${16 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt ? "O mito do balde furado" : "El mito del balde pinchado",
        width / 2,
        feedY + 230 * S,
        feedW - 60 * S,
        24 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.fillText("DESLIZÁ EN EL FEED PARA VER", width / 2, feedY + feedH - 50 * S);

      ctx.fillStyle = "#10B981";
      ctx.font = `950 ${40 * S}px sans-serif`;
      ctx.fillText("👇", width / 2, feedY + feedH + 110 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "TOQUE NO POST PARA LER COMPLETO" : "TOCÁ EL POST PARA LEER COMPLETO",
        width / 2,
        height - 120 * S
      );

      const a = document.createElement("a");
      a.download = `nevux-story-lunes-empuje.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── CANVAS: HISTORIA MARTES - ENCUESTA CONFIANZA ─── */
  const downloadMartesEncuestaCanvas = async () => {
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn(e); }

      preparePremiumBackground(ctx, width, height, S);
      drawHeaderLogo(ctx, width, logoImg, S);

      const bText = isPt ? "🗳️ ENQUETE DE MERCADO" : "🗳️ ENCUESTA DE MERCADO";
      ctx.font = `900 ${11 * S}px sans-serif`;
      const btw = ctx.measureText(bText).width + 30 * S;
      const bY = 220 * S;
      ctx.fillStyle = "rgba(16,185,129,0.18)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, (width - btw) / 2, bY, btw, 32 * S, 16 * S);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#10B981";
      ctx.textAlign = "center";
      ctx.fillText(bText, width / 2, bY + 16 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${24 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "O QUE TE DÁ MAIS SEGURANÇA AO ENTRAR EM UMA LOJA ONLINE?"
          : "¿QUÉ TE DA MÁS CONFIANZA AL ENTRAR A UNA TIENDA ONLINE?",
        width / 2,
        290 * S,
        width - 60 * S,
        32 * S
      );

      const boxW = width - 120 * S;
      const boxH = 220 * S;
      const boxX = 60 * S;
      const boxY = height / 2 - 50 * S;

      ctx.fillStyle = "rgba(16,185,129,0.06)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2 * S;
      ctx.setLineDash([8 * S, 6 * S]);
      drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 20 * S);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${13 * S}px sans-serif`;
      ctx.fillText("📥 COLOCÁ TU STICKER DE ENCUESTA ACÁ", width / 2, boxY + 70 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `600 ${10 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "Opção A: Ver avaliações de outros clientes ⭐\nOpção B: Notificações de compras ao vivo 🔔"
          : "Opción A: Ver reseñas de clientes reales ⭐\nOpción B: Notificaciones de compras al instante 🔔",
        width / 2,
        boxY + 110 * S,
        boxW - 40 * S,
        18 * S
      );

      ctx.fillStyle = "#a7f3d0";
      ctx.font = `700 ${14 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "Mais de 80% escolhem ambas. Isso se chama Prova Social e vende no piloto automático."
          : "Más del 85% de las compras online dependen de estos factores. Eso es Prueba Social.",
        width / 2,
        height - 380 * S,
        width - 100 * S,
        22 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "RESPOSTA NO PRÓXIMO STORY ➔" : "LA SOLUCIÓN EN EL PRÓXIMO STORY ➔",
        width / 2,
        height - 200 * S
      );

      const a = document.createElement("a");
      a.download = `nevux-story-martes-encuesta.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── CANVAS: HISTORIA MARTES - PÉRDIDA 1 A 3 ─── */
  const downloadMartesPerdidaCanvas = async () => {
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn(e); }

      ctx.fillStyle = "#020a07";
      ctx.fillRect(0, 0, width, height);

      const g = ctx.createRadialGradient(width / 2, height / 2, 40 * S, width / 2, height / 2, 350 * S);
      g.addColorStop(0, "rgba(239, 68, 68, 0.15)");
      g.addColorStop(0.5, "rgba(16, 185, 129, 0.1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 350 * S, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(16,185,129,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40 * S) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      drawHeaderLogo(ctx, width, logoImg, S);

      const bText = isPt ? "⚠️ RETROALIMENTAÇÃO CRÍTICA" : "⚠️ DIAGNÓSTICO EN VIVO";
      ctx.font = `900 ${11 * S}px sans-serif`;
      const btw = ctx.measureText(bText).width + 30 * S;
      const bY = 220 * S;
      ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, (width - btw) / 2, bY, btw, 32 * S, 16 * S);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#EF4444";
      ctx.textAlign = "center";
      ctx.fillText(bText, width / 2, bY + 16 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${24 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt 
          ? "Se você respondeu de 1 a 3 pessoas..." 
          : "Si respondiste de 1 a 3 personas...",
        width / 2,
        300 * S,
        width - 70 * S,
        34 * S
      );

      ctx.fillStyle = "#EF4444";
      ctx.font = `950 ${92 * S}px sans-serif`;
      ctx.fillText("97%", width / 2, height / 2 - 80 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${15 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "está perdendo 97% das suas vendas potenciais por falta de URGÊNCIA e PROVA SOCIAL."
          : "estás perdiendo el 97% de tus ventas potenciales por falta de URGENCIAS y PRUEBA SOCIAL.",
        width / 2,
        height / 2 + 10 * S,
        width - 80 * S,
        24 * S
      );

      const cardW = width - 100 * S;
      const cardH = 200 * S;
      const cardX = 50 * S;
      const cardY = height / 2 + 160 * S;

      ctx.fillStyle = "rgba(11, 41, 32, 0.95)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2.5 * S;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 22 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${15 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "NÃO TE FALTA TRÁFEGO..." : "NO TE FALTA TRÁFICO...",
        width / 2,
        cardY + 65 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `950 ${26 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "TE FALTA CONVERSÃO!" : "TE FALTA CONVERSIÓN!",
        width / 2,
        cardY + 125 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "DESLIZE PARA VER A SOLUÇÃO ➔" : "DESLIZÁ PARA VER LA SOLUCIÓN HOY ➔",
        width / 2,
        height - 180 * S
      );

      const a = document.createElement("a");
      a.download = `nevux-story-perdida-1-3.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── CANVAS: HISTORIA MARTES - EMPUJE REEL / LINK CTA ─── */
  const downloadMartesReelCanvas = async () => {
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn(e); }

      preparePremiumBackground(ctx, width, height, S);
      drawHeaderLogo(ctx, width, logoImg, S);

      const bText = "🔔 PRUEBA SOCIAL EN VIVO";
      ctx.font = `900 ${11 * S}px sans-serif`;
      const btw = ctx.measureText(bText).width + 30 * S;
      const bY = 220 * S;
      ctx.fillStyle = "rgba(16,185,129,0.18)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, (width - btw) / 2, bY, btw, 32 * S, 16 * S);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#10B981";
      ctx.textAlign = "center";
      ctx.fillText(bText, width / 2, bY + 16 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `950 ${24 * S}px sans-serif`;
      wrapText(
        ctx,
        isPt
          ? "COMO USAR O EFEITO MANADA PARA VENDER ATÉ 3X MAIS"
          : "CÓMO USAR EL EFECTO MANADA PARA VENDER HASTA 3 VECES MÁS",
        width / 2,
        290 * S,
        width - 60 * S,
        34 * S
      );

      const widgetW = width - 120 * S;
      const widgetH = 130 * S;
      const widgetX = 60 * S;
      const widgetY = 420 * S;

      ctx.fillStyle = "rgba(11,41,32,0.98)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2.5 * S;
      drawRoundedRect(ctx, widgetX, widgetY, widgetW, widgetH, 18 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("🛒 Mateo de Córdoba", widgetX + 24 * S, widgetY + 34 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${11 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "Acabou de comprar de forma segura" : "Acaba de comprar de forma segura",
        widgetX + 24 * S,
        widgetY + 64 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `800 ${10 * S}px sans-serif`;
      ctx.fillText("⚡ Compras verificadas · Nevux Analytics", widgetX + 24 * S, widgetY + 92 * S);

      ctx.fillStyle = "#a7f3d0";
      ctx.font = `700 ${14 * S}px sans-serif`;
      ctx.textAlign = "center";
      wrapText(
        ctx,
        isPt
          ? "Ative a prova social do Nevux e mostre a movimentação real da sua loja. Clientes compram onde vêm outros comprando."
          : "Instalá Nevux en 15 segundos y mostrá la actividad real de tu tienda. Los clientes compran donde ven que otros están comprando.",
        width / 2,
        height / 2 + 100 * S,
        width - 90 * S,
        22 * S
      );

      const linkBoxW = width - 200 * S;
      const linkBoxH = 64 * S;
      const linkBoxX = 100 * S;
      const linkBoxY = height - 360 * S;

      ctx.fillStyle = "rgba(16,185,129,0.1)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2 * S;
      ctx.setLineDash([6 * S, 4 * S]);
      drawRoundedRect(ctx, linkBoxX, linkBoxY, linkBoxW, linkBoxH, 14 * S);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.fillText("🔗 COLOCÁ TU LINK STICKER ACÁ", width / 2, linkBoxY + 36 * S);

      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${13 * S}px sans-serif`;
      ctx.fillText("NEVUX.AR", width / 2, height - 260 * S);

      ctx.fillStyle = "#94a3b8";
      ctx.font = `700 ${11 * S}px sans-serif`;
      ctx.fillText(
        isPt ? "7 DIAS GRÁTIS · INSTALAÇÃO EM 1 CLIQUE" : "7 DÍAS GRATIS · INSTALACIÓN EN 1 CLIC",
        width / 2,
        height - 220 * S
      );

      const a = document.createElement("a");
      a.download = `nevux-story-martes-reel-empuje.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── CANVAS: PORTADA FACEBOOK ─── */
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
      try { logoImg = await loadLogoImage(); } catch (e) { console.warn(e); }

      ctx.fillStyle = "#020a07";
      ctx.fillRect(0, 0, width, height);

      const g = ctx.createRadialGradient(width / 2, height / 2, 80 * S, width / 2, height / 2, 450 * S);
      g.addColorStop(0, "rgba(16,185,129,0.25)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 450 * S, 0, Math.PI * 2);
      ctx.fill();

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
        backgroundColor: "#020a07",
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

        {/* CONTENEDOR DE SELECTORES DE TABS CATEGORIZADOS PARA CELULAR */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", marginTop: "8px" }}>
          
          {/* Categoría: PORTADAS Y FEEDS */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 900, color: "#10B981", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>🎬 Portadas & Feed</div>
            <div style={{ display: "flex", gap: "4px", width: "100%", overflowX: "auto", paddingBottom: "4px" }}>
              {categoryFeedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    backgroundColor: activeTab === tab.id ? "#10B981" : "#061a14",
                    color: activeTab === tab.id ? "#000" : "#6ee7b7",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría: HISTORIAS LUNES */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 900, color: "#10B981", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>🟢 Lunes: Dolor & Agitación</div>
            <div style={{ display: "flex", gap: "4px", width: "100%", overflowX: "auto", paddingBottom: "4px" }}>
              {categoryMondayTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    backgroundColor: activeTab === tab.id ? "#10B981" : "#061a14",
                    color: activeTab === tab.id ? "#000" : "#6ee7b7",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría: HISTORIAS MARTES */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 900, color: "#10B981", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>🟢 Martes: Prueba Social</div>
            <div style={{ display: "flex", gap: "4px", width: "100%", overflowX: "auto", paddingBottom: "4px" }}>
              {categoryTuesdayTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    backgroundColor: activeTab === tab.id ? "#10B981" : "#061a14",
                    color: activeTab === tab.id ? "#000" : "#6ee7b7",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría: MIÉRCOLES ESTRATÉGICO */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 900, color: "#10B981", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>🟢 Miércoles: Antes vs Después</div>
            <div style={{ display: "flex", gap: "4px", width: "100%", overflowX: "auto", paddingBottom: "4px" }}>
              {categoryWednesdayTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    backgroundColor: activeTab === tab.id ? "#10B981" : "#061a14",
                    color: activeTab === tab.id ? "#000" : "#6ee7b7",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría: TEXTOS DE MARQUETING */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 900, color: "#10B981", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>📝 Copys, Ganchos y Cierres</div>
            <div style={{ display: "flex", gap: "4px", width: "100%", overflowX: "auto" }}>
              {categoryTextTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: activeTab === tab.id ? "#10B981" : "#061a14",
                    color: activeTab === tab.id ? "#000" : "#6ee7b7",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* RENDER TAB: PORTADA REEL MARTES */}
      {activeTab === "reel_cover" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#020a07",
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.02em" }}>
                NEVUX
              </span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: 900, color: "#10B981", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981" }}>
              {isPt ? "🧠 PSICOLOGIA DE VENDAS" : "🧠 PSICOLOGÍA DE VENTAS"}
            </div>

            <h2 style={{ margin: 0, fontSize: "21px", fontWeight: 900, color: "#ffffff", lineHeight: 1.3 }}>
              {isPt
                ? "O TRUQUE PSICOLÓGICO QUE MULTIPLICA VENDAS NA NUVEMSHOP 📈"
                : "EL TRUCO PSICOLÓGICO QUE MULTIPLICA VENTAS EN TIENDANUBE 📈"}
            </h2>

            <div style={{ width: "100%", background: "rgba(11, 41, 32, 0.95)", border: "1.5px solid #10B981", borderRadius: "18px", padding: "14px", textAlign: "left" }}>
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

            <p style={{ margin: 0, fontSize: "12px", color: "#a7f3d0", fontWeight: 600 }}>
              {isPt
                ? "Ative notificações ao vivo e comprove o efeito manada"
                : "Activá notificaciones en vivo y comprobá el efecto manada"}
            </p>

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

      {/* RENDER TAB: PORTADA FACEBOOK */}
      {activeTab === "fb_cover" && (
        <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ width: "100%", background: "#020a07", border: "2px solid #10B981", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
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

      {/* RENDER TAB: CARRUSEL PRO */}
      {activeTab === "carousels" && (
        <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {PREMIUM_CAROUSEL_SLIDES.map((slide, index) => {
            const badgeText = isPt ? slide.badgePt : slide.badgeEs;
            const badgeColor = slide.type === "problem" ? "#ef4444" : slide.type === "comparison" ? "#3b82f6" : "#10B981";

            return (
              <div key={index} style={{ width: "100%", aspectRatio: "4 / 5", background: slide.type === "problem" ? "#0c0407" : slide.type === "comparison" ? "#070b14" : slide.type === "solution" ? "#03120c" : slide.type === "cta" ? "#021a12" : "#020a07", border: "2px solid rgba(16, 185, 129, 0.4)", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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

      {/* RENDER TAB: LUNES HISTORIA 1 (ENCUESTA DIAGNÓSTICO) — NUEVA */}
      {activeTab === "story_lunes_encuesta" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#020a07",
              backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(2,6,4,0.98) 100%)",
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#10B981", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981" }}>
              {isPt ? "📊 DIAGNÓSTICO DE VENDAS" : "📊 DIAGNÓSTICO DE VENTAS"}
            </div>

            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 950, color: "#ffffff", lineHeight: 1.35 }}>
              {isPt 
                ? "Pergunta rápida para lojistas da Nuvemshop 👇" 
                : "Pregunta rápida para dueños de tiendas en Tiendanube 👇"}
            </h3>

            {/* Guía punteada sticker encuesta */}
            <div style={{
              width: "100%",
              borderRadius: "18px",
              border: "2px dashed #10B981",
              backgroundColor: "rgba(16,185,129,0.04)",
              padding: "16px 12px",
              boxSizing: "border-box",
              textAlign: "center"
            }}>
              <span style={{ fontSize: "9px", color: "#10B981", fontWeight: 900, display: "block", marginBottom: "8px" }}>
                STICKER DE ENCUESTA AQUÍ
              </span>
              <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: 800, color: "#ffffff", lineHeight: 1.4 }}>
                {isPt 
                  ? "De cada 100 pessoas que entram na sua loja online, quantas compram?" 
                  : "De cada 100 personas que entran a tu tienda online, ¿cuántas te compran?"}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px", fontSize: "11px", fontWeight: 700, color: "#fff", textAlign: "left" }}>
                  1 a 3 personas (1-3%)
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px", fontSize: "11px", fontWeight: 700, color: "#fff", textAlign: "left" }}>
                  Más de 10 personas
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.4, padding: "0 10px" }}>
              {isPt
                ? "A média de conversão no varejo online é de 1%. Se você está nessa faixa, saiba o que fazer a seguir."
                : "La conversión promedio en e-commerce ronda el 1%. Si estás en ese promedio, mirá el siguiente story."}
            </p>

            <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>
              VE EL DIAGNÓSTICO REVELADOR ➔
            </span>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadLunesEncuestaCanvas}
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
            Descargar Historia: Encuesta Diag (1080×1920)
          </button>
        </div>
      )}

      {/* RENDER TAB: LUNES HISTORIA 2 (DOLOR 97%) */}
      {activeTab === "story_lunes_dolor" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#040508",
              border: "2.5px solid #EF4444",
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: 900, color: "#EF4444", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #EF4444" }}>
              {isPt ? "🚨 ATENÇÃO LOJISTA" : "🚨 ATENCIÓN COMERCIANTE"}
            </div>

            <div>
              <div style={{ fontSize: "96px", fontWeight: 950, color: "#EF4444", lineHeight: 1 }}>97%</div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", marginTop: "10px", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                {isPt ? "Das visitas saem sem comprar" : "De tus visitas se van sin comprar"}
              </div>
            </div>

            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, padding: "0 10px" }}>
              {isPt 
                ? "Isso significa que você está jogando dinheiro no lixo mandando visitas para um balde furado."
                : "Estás gastando plata en anuncios para enviar tráfico a un balde pinchado. Corregí esto hoy."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 900 }}>
                {isPt ? "VEJA O PRÓXIMO STORY" : "DESLIZÁ PARA EL SECRETO"}
              </span>
              <ArrowDown size={18} color="#10B981" style={{ animation: "bounce 1s infinite" }} />
            </div>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadLunesDolorCanvas}
            style={{
              width: "100%",
              background: "#EF4444",
              border: "none",
              color: "#fff",
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
            Descargar Historia Lunes: Dolor (1080×1920)
          </button>
        </div>
      )}

      {/* RENDER TAB: LUNES HISTORIA 3 (EMPUJE AL FEED) */}
      {activeTab === "story_lunes_feed" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#020a07",
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#10B981", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981" }}>
              {isPt ? "🔥 NOVO POST" : "🔥 NUEVO POST"}
            </div>

            <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 950, color: "#ffffff", lineHeight: 1.3 }}>
              {isPt ? "COMO ACABAR COM A FUGA DE CLIENTES NA SUA LOJA" : "CÓMO FRENAR LA FUGA DE CLIENTES EN TU TIENDA"}
            </h3>

            <div style={{
              width: "100%",
              aspectRatio: "4 / 5",
              background: "#0c0407",
              borderRadius: "20px",
              border: "2px dashed #10B981",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "16px",
              boxSizing: "border-box"
            }}>
              <span style={{ fontSize: "36px", color: "#EF4444", fontWeight: 950 }}>97%</span>
              <span style={{ fontSize: "12px", color: "#ffffff", fontWeight: 800 }}>El mito del balde pinchado</span>
              <div style={{ marginTop: "12px", padding: "6px 12px", background: "#10B981", color: "#000", borderRadius: "8px", fontSize: "10px", fontWeight: 900 }}>
                {isPt ? "TOQUE AQUI PARA LER" : "TOCÁ ACÁ PARA LER"}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span style={{ fontSize: "32px" }}>👇</span>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#a7f3d0" }}>
                {isPt ? "TOCÁ NO STICKER ACIMA" : "TOCÁ EL POST EN TU HISTORIA"}
              </span>
            </div>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadLunesFeedCanvas}
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
            Descargar Historia Lunes: Empuje (1080×1920)
          </button>
        </div>
      )}

      {/* RENDER TAB: MARTES HISTORIA 1 (PSICOLOGÍA) */}
      {activeTab === "story_martes_psicologia" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#0c0e14",
              backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(2,6,4,0.98) 100%)",
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
            <div style={{ position: "absolute", top: "70px", right: "20px", opacity: 0.1 }}>
              <ShieldCheck size={100} color="#10B981" />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ fontSize: "12px", fontWeight: 900, color: "#10B981", textTransform: "uppercase" }}>
              {isPt ? "Pergunta para quem compra online 👇" : "Pregunta para los que compran online 👇"}
            </div>

            <div style={{
              width: "100%",
              borderRadius: "18px",
              border: "2px dashed #10B981",
              backgroundColor: "rgba(16,185,129,0.04)",
              padding: "16px 12px",
              boxSizing: "border-box",
              textAlign: "center"
            }}>
              <span style={{ fontSize: "9px", color: "#10B981", fontWeight: 900, display: "block", marginBottom: "8px" }}>
                STICKER DE ENCUESTA AQUÍ
              </span>
              <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: 800, color: "#ffffff", lineHeight: 1.4 }}>
                {isPt 
                  ? "Quando você entra em uma nova loja online, o que te dá mais confiança?" 
                  : "Cuando entrás a una tienda online nueva, ¿qué te da más confianza?"}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px", fontSize: "11px", fontWeight: 700, color: "#fff", textAlign: "left" }}>
                  Ver compras en tiempo real 🛒
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px", fontSize: "11px", fontWeight: 700, color: "#fff", textAlign: "left" }}>
                  Ver solo las fotos del producto 📸
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.4, padding: "0 10px" }}>
              {isPt
                ? "A ciência do e-commerce comprova: ver movimento de outros clientes ativos gera segurança imediata."
                : "La psicología del consumidor lo dice claro: ver compras de otros genera calma, deseo y seguridad inmediata."}
            </p>

            <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>
              RESPUESTA REVELADORA A SEGUIR ➔
            </span>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadMartesPsicologiaCanvas}
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
            Descargar Historia: Psicología (1080×1920)
          </button>
        </div>
      )}

      {/* RENDER TAB: MARTES HISTORIA 2 (ENCUESTA CONFIANZA) */}
      {activeTab === "story_martes_encuesta" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#020a07",
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#10B981", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981" }}>
              {isPt ? "🗳️ ENQUETE" : "🗳️ ENCUESTA"}
            </div>

            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 950, color: "#ffffff", lineHeight: 1.3 }}>
              {isPt 
                ? "O QUE TE DÁ MAIS SEGURANÇA AO ENTRAR EM UMA LOJA ONLINE?"
                : "¿QUÉ TE DA MÁS CONFIANZA AL ENTRAR A UNA TIENDA ONLINE?"}
            </h3>

            <div style={{
              width: "100%",
              height: "130px",
              borderRadius: "16px",
              border: "2.5px dashed #10B981",
              backgroundColor: "rgba(16,185,129,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              boxSizing: "border-box"
            }}>
              <HelpCircle size={24} color="#10B981" />
              <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 900, marginTop: "6px" }}>
                STICKER DE ENCUESTA AQUÍ
              </span>
              <span style={{ fontSize: "9px", color: "#86efac", marginTop: "4px", textAlign: "center" }}>
                A) Reseñas Reales / B) Compras en Vivo
              </span>
            </div>

            <p style={{ margin: 0, fontSize: "12px", color: "#a7f3d0", fontWeight: 600, padding: "0 10px" }}>
              {isPt
                ? "Mais do 80% das pessoas escolhem as duas. Isso é prova social real."
                : "Más del 85% de los clientes necesitan comprobar esto antes de ingresar la tarjeta."}
            </p>

            <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>
              RESPUESTA EN EL SIGUIENTE STORY ➔
            </span>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadMartesEncuestaCanvas}
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
            Descargar Historia Martes: Encuesta (1080×1920)
          </button>
        </div>
      )}

      {/* RENDER TAB: MARTES HISTORIA 3 (PÉRDIDA 1 A 3) */}
      {activeTab === "story_martes_perdida" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#020a07",
              border: "2.5px solid #EF4444",
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#EF4444", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #EF4444" }}>
              {isPt ? "⚠️ RETROALIMENTAÇÃO CRÍTICA" : "⚠️ DIAGNÓSTICO EN VIVO"}
            </div>

            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 950, color: "#ffffff", lineHeight: 1.3 }}>
              {isPt ? "Se você respondeu de 1 a 3 pessoas..." : "Si respondiste de 1 a 3 personas..."}
            </h3>

            <div>
              <div style={{ fontSize: "74px", fontWeight: 950, color: "#EF4444", lineHeight: 1 }}>97%</div>
              <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#ffffff", fontWeight: 700, lineHeight: 1.4 }}>
                {isPt 
                  ? "está perdendo 97% das suas vendas potenciais por falta de URGÊNCIA e PROVA SOCIAL."
                  : "estás perdiendo el 97% de tus ventas potenciales por falta de URGENCIAS y PRUEBA SOCIAL."}
              </p>
            </div>

            <div style={{
              width: "100%",
              backgroundColor: "rgba(11, 41, 32, 0.95)",
              border: "1.5px solid #10B981",
              borderRadius: "18px",
              padding: "16px 12px",
              boxSizing: "border-box"
            }}>
              <span style={{ fontSize: "12px", fontWeight: 900, color: "#ffffff", display: "block", textTransform: "uppercase" }}>
                {isPt ? "Não te falta tráfego..." : "No te falta tráfico..."}
              </span>
              <span style={{ fontSize: "20px", fontWeight: 950, color: "#10B981", display: "block", marginTop: "4px" }}>
                {isPt ? "TE FALTA CONVERSÃO!" : "TE FALTA CONVERSIÓN!"}
              </span>
            </div>

            <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>
              {isPt ? "DESLIZE PARA VER A SOLUÇÃO ➔" : "DESLIZÁ PARA VER LA SOLUCIÓN ➔"}
            </span>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadMartesPerdidaCanvas}
            style={{
              width: "100%",
              background: "#EF4444",
              border: "none",
              color: "#fff",
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
            Descargar Historia: Pérdida (1080×1920)
          </button>
        </div>
      )}

      {/* RENDER TAB: MARTES HISTORIA 4 (EMPUJE AL REEL CON LINK) */}
      {activeTab === "story_martes_reel" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              background: "#020a07",
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#10B981", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981" }}>
              🔥 PRUEBA SOCIAL ACTIVA
            </div>

            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 950, color: "#ffffff", lineHeight: 1.3 }}>
              {isPt 
                ? "COMO USAR O EFEITO MANADA PARA CONVERTER ATÉ 3X MAIS"
                : "CÓMO USAR EL EFECTO MANADA PARA VENDER HASTA 3 VECES MÁS"}
            </h3>

            <div style={{
              width: "100%",
              background: "rgba(11, 41, 32, 0.95)",
              border: "1.5px solid #10B981",
              borderRadius: "14px",
              padding: "10px",
              textAlign: "left"
            }}>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>🛒 Mateo de Córdoba</span>
              <div style={{ fontSize: "10px", color: "#fff", fontWeight: 700, margin: "2px 0" }}>Acaba de comprar de forma segura</div>
              <span style={{ fontSize: "9px", color: "#10B981" }}>⚡ hace un instante</span>
            </div>

            <p style={{ margin: 0, fontSize: "12px", color: "#a7f3d0", lineHeight: 1.4 }}>
              {isPt 
                ? "Ative as notificações em tempo real. Clientes compram quando veem movimentação."
                : "Los clientes compran donde ven que otros están comprando. Activá la prueba social hoy."}
            </p>

            <div style={{
              width: "80%",
              height: "44px",
              borderRadius: "12px",
              border: "2px dashed #10B981",
              backgroundColor: "rgba(16,185,129,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}>
              <LinkIcon size={14} color="#10B981" />
              <span style={{ fontSize: "10px", color: "#10B981", fontWeight: 900 }}>
                STICKER DE LINK ACÁ
              </span>
            </div>

            <div style={{ fontSize: "11px", fontWeight: 900, color: "#ffffff" }}>
              NEVUX.AR · 7 DÍAS GRATIS
            </div>
          </div>

          <button
            disabled={isDownloading}
            onClick={downloadMartesReelCanvas}
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
            Descargar Historia Martes: Empuje Reel (1080×1920)
          </button>
        </div>
      )}

      {/* RENDER TAB: MIÉRCOLES - CARRUSEL 3 PLACAS COMPLETO */}
      {activeTab === "miercoles_carrusel" && (
        <div style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "40px" }}>
          
          {/* PLACA 01 */}
          <div style={{ width: "100%", aspectRatio: "4 / 5", background: "#020a07", border: "3px solid #10B981", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", boxShadow: "0 15px 35px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(16,185,129,0.15)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/icon.svg" alt="Nevux" style={{ width: "28px", height: "28px" }} />
                <span style={{ fontSize: "14px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 800, fontFamily: "monospace", color: "#10B981" }}>01 / 03</span>
            </div>

            <div>
              <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#10B981", background: "rgba(16,185,129,0.15)", border: "1px solid #10B981", marginBottom: "16px" }}>
                ⚡ TRANSFORMACIÓN DE TIENDA
              </span>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 950, color: "#ffffff", lineHeight: 1.35 }}>
                {isPt 
                  ? "Mesmo tráfego. Mesmos produtos. O triplo de vendas." 
                  : "Mismo tráfico. Mismos productos. El triple de ventas."} 📈
              </h2>
            </div>

            <div style={{ background: "rgba(11, 41, 32, 0.4)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: "18px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8" }}>TIENDA TRADICIONAL ❌</span>
                <span style={{ fontSize: "13px", fontWeight: 900, color: "#ef4444" }}>$80.000 (Conv. 0.8%)</span>
              </div>
              <div style={{ height: "1px", background: "rgba(16,185,129,0.15)" }}></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>CON NEVUX ✅</span>
                <span style={{ fontSize: "15px", fontWeight: 950, color: "#10B981" }}>$280.000 (Conv. 2.8%)</span>
              </div>
            </div>

            <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 800, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {isPt ? "DESLIZE PARA VER O SEGREDO ➔" : "DESLIZÁ PARA VER EL SECRETO ➔"}
            </div>
          </div>

          {/* PLACA 02 */}
          <div style={{ width: "100%", aspectRatio: "4 / 5", background: "#020a07", border: "3px solid #10B981", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", boxShadow: "0 15px 35px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(16,185,129,0.15)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/icon.svg" alt="Nevux" style={{ width: "28px", height: "28px" }} />
                <span style={{ fontSize: "14px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 800, fontFamily: "monospace", color: "#10B981" }}>02 / 03</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1.5px solid rgba(239, 68, 68, 0.3)", borderRadius: "14px", padding: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 900, color: "#ef4444", textTransform: "uppercase", marginBottom: "6px", display: "flex", gap: "4px" }}>
                  ❌ SIN NEVUX (Checkout Frío)
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: "#fca5a5", fontWeight: 600, lineHeight: 1.4 }}>
                  97% de carritos abandonados. Clientes con dudas se van por falta de escasez y prueba social. Ticket de venta bajo.
                </p>
              </div>

              <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1.5px solid #10B981", borderRadius: "14px", padding: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 900, color: "#10B981", textTransform: "uppercase", marginBottom: "6px", display: "flex", gap: "4px" }}>
                  ✅ CON NEVUX (Checkout Activo)
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: "#a7f3d0", fontWeight: 700, lineHeight: 1.4 }}>
                  Notificaciones de compra en vivo + bundles sugeridos para subir el ticket + timers de urgencia. Conversión multiplicada ×3.
                </p>
              </div>
            </div>

            <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 800, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {isPt ? "DESLIZE PARA O RESULTADO ➔" : "DESLIZÁ PARA EL CIERRE ➔"}
            </div>
          </div>

          {/* PLACA 03 */}
          <div style={{ width: "100%", aspectRatio: "4 / 5", background: "#020a07", border: "3px solid #10B981", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", boxShadow: "0 15px 35px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(16,185,129,0.15)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/icon.svg" alt="Nevux" style={{ width: "28px", height: "28px" }} />
                <span style={{ fontSize: "14px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 800, fontFamily: "monospace", color: "#10B981" }}>03 / 03</span>
            </div>

            <div style={{ textAlign: "center" }}>
              <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#10B981", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", marginBottom: "16px" }}>
                🚀 PRUEBA SIN COMPROMISO
              </span>
              <h2 style={{ margin: "0 0 12px", fontSize: "20px", fontWeight: 950, color: "#ffffff", lineHeight: 1.3 }}>
                {isPt ? "Sua Nuvemshop pode vender assim hoje." : "Tu Tiendanube puede vender así hoy."}
              </h2>
              <p style={{ margin: "0 auto", fontSize: "12px", color: "#94a3b8", fontWeight: 600, maxWidth: "280px" }}>
                Instalación instantánea en 15 segundos. Sin tocar código. Activás, medís y decidís.
              </p>
            </div>

            <div style={{ background: "#10B981", border: "1.5px solid #10B981", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#000", display: "block" }}>👉 INICIÁ TU PRUEBA GRATIS POR 7 DÍAS</span>
              <span style={{ fontSize: "16px", fontWeight: 950, color: "#000", display: "block", marginTop: "4px" }}>NEVUX.AR</span>
            </div>

            <div style={{ textAlign: "center", fontSize: "10px", fontWeight: 800, color: "#94a3b8" }}>
              APP OFICIAL TIENDANUBE · ID #37382
            </div>
          </div>

        </div>
      )}

      {/* RENDER TAB: MIÉRCOLES - STORIES */}
      {activeTab === "miercoles_stories" && (
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "40px" }}>
          
          {/* STORY 01 */}
          <div style={{ width: "100%", aspectRatio: "9 / 16", background: "#0c0e14", border: "3px solid #EF4444", borderRadius: "28px", padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", textAlign: "center", boxSizing: "border-box", position: "relative", overflow: "hidden", boxShadow: "0 15px 35px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#EF4444", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #EF4444" }}>
              📈 MENTALIDAD DE VENTAS
            </div>

            <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 950, color: "#ffffff", lineHeight: 1.35 }}>
              {isPt 
                ? "Quanto dinheiro você está jogando no lixo enviando tráfego para uma loja fria?" 
                : "¿Cuánta plata estás gastando en publicidad para que la gente entre y se vaya sin comprar?"}
            </h3>

            <div style={{
              width: "100%",
              borderRadius: "16px",
              backgroundColor: "rgba(239,68,68,0.06)",
              border: "1.5px dashed #EF4444",
              padding: "16px 12px",
              boxSizing: "border-box"
            }}>
              <span style={{ fontSize: "36px", display: "block" }}>💸</span>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#ef4444", display: "block", marginTop: "4px", textTransform: "uppercase" }}>TU PUBLICIDAD (META ADS)</span>
              <span style={{ fontSize: "10px", color: "#fca5a5", display: "block", marginTop: "2px" }}>Filtrándose por falta de conversión en checkout.</span>
            </div>

            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.45 }}>
              {isPt
                ? "O segredo do crescimento não é trazer mais visitas... é convencer as visitas que você já tem a comprar de você."
                : "El secreto del crecimiento no es traer más visitas... es convencer a las visitas que ya tenés para que compren."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 900 }}>
                {isPt ? "VEJA O PRÓXIMO STORY ➔" : "DESLIZÁ PARA EL SECRETO ➔"}
              </span>
              <ArrowDown size={14} color="#10B981" />
            </div>
          </div>

          {/* STORY 02 */}
          <div style={{ width: "100%", aspectRatio: "9 / 16", background: "#020a07", border: "3px solid #10B981", borderRadius: "28px", padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", textAlign: "center", boxSizing: "border-box", position: "relative", overflow: "hidden", boxShadow: "0 15px 35px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icon.svg" alt="Nevux" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>NEVUX</span>
            </div>

            <div style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "10px", fontWeight: 900, color: "#10B981", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981" }}>
              💡 EL CAMBIO ESTRATÉGICO
            </div>

            <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 950, color: "#ffffff", lineHeight: 1.35 }}>
              {isPt 
                ? "A regra de ouro do e-commerce: Não precisa de mais visitas, precisa de um TICKET MÉDIO maior." 
                : "La regla de oro del e-commerce: No necesitás más visitas, necesitás subir tu TICKET PROMEDIO."}
            </h3>

            <div style={{
              width: "100%",
              borderRadius: "16px",
              backgroundColor: "rgba(16,185,129,0.06)",
              border: "1.5px solid #10B981",
              padding: "16px 12px",
              boxSizing: "border-box",
              textAlign: "left"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>🔥 BUNDLE RECOMENDADO</span>
                <span style={{ fontSize: "10px", fontWeight: 900, background: "#10B981", color: "#000", padding: "2px 6px", borderRadius: "4px" }}>AHORRÁ 20%</span>
              </div>
              <span style={{ fontSize: "12px", color: "#ffffff", fontWeight: 700, display: "block" }}>Llevá 3 unidades de tu producto</span>
              <span style={{ fontSize: "11px", color: "#a7f3d0", display: "block", marginTop: "2px" }}>Subí el ticket en piloto automático.</span>
            </div>

            <p style={{ margin: 0, fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
              {isPt
                ? "Nossa inteligência ajuda o cliente a comprar mais de você sem esforço extra de suporte."
                : "Aumentá el valor de cada compra ofreciendo bundles dinámicos en tu Tiendanube."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span style={{ fontSize: "32px" }}>👇</span>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#ffffff" }}>
                {isPt ? "TOQUE NO POST PARA LER A ESTRATÉGIA" : "TOCÁ EL POST PARA LEER LA ESTRATEGIA"}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* RENDER TAB: HOOKS Y CIERRES */}
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

      {/* RENDER TAB: ANTES VS DESPUÉS */}
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
