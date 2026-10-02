// app/admin/banners/page.tsx
"use client";

import React, { useState } from "react";
import { Smartphone, Download, Award, Zap, CheckCircle2, XCircle } from "lucide-react";

type TabId = "marketing_assets" | "carousels" | "before_after";

/* ═══════════════════════════════════════════
   CONSTANTES (Regla #9 al inicio)
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
   CARRUSEL B2B DE 5 PLACAS (ESTRATEGIA COMPLETA)
═══════════════════════════════════════════ */
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
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("carousels");
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [isDownloading, setIsDownloading] = useState(false);
  const isPt = lang === "pt";

  const tabs = [
    { id: "carousels" as TabId, label: "Carrusel Pro 5 Placas", icon: "🎠" },
    { id: "marketing_assets" as TabId, label: "Hooks y Cierres Pro", icon: "🎬" },
    { id: "before_after" as TabId, label: "Antes vs Después (Marketing)", icon: "⚡" },
  ];

  /* ─── GENERAR CANVAS ANTES VS DESPUÉS 1080x1350 ─── */
  const downloadBeforeAfterAsset = async () => {
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

      ctx.fillStyle = "#05080f";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40 * S) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const logoSize = 32 * S;
      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, 36 * S, 32 * S, logoSize, logoSize, 10 * S);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = `950 ${18 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("N", 36 * S + logoSize / 2, 32 * S + logoSize / 2 + 1);
      ctx.fillStyle = "#fff";
      ctx.font = `900 ${15 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("NEVUX", 36 * S + logoSize + 10 * S, 32 * S + logoSize / 2);

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText("PROPUESTA DE VALOR REAL", width - 36 * S, 32 * S + logoSize / 2);

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(36 * S, 80 * S);
      ctx.lineTo(width - 36 * S, 80 * S);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${18 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      wrapText(
        ctx,
        isPt
          ? "LO QUE ACONTECE QUANDO VOCÊ INSTALA A NEVUX 🚀"
          : "LO QUE PASA CUANDO INSTALÁS NEVUX EN TU TIENDA 🚀",
        width / 2,
        100 * S,
        width - 72 * S,
        24 * S
      );

      const boxW = (width - 92 * S) / 2;
      const boxH = 240 * S;
      const topY = 150 * S;

      // IZQUIERDA: SIN NEVUX
      const leftX = 36 * S;
      ctx.fillStyle = "rgba(239, 68, 68, 0.08)";
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 2 * S;
      drawRoundedRect(ctx, leftX, topY, boxW, boxH, 20 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(isPt ? "❌ SEM NEVUX" : "❌ TIENDA SIN NEVUX", leftX + boxW / 2, topY + 16 * S);

      const itemsSin = isPt
        ? [
            "• 97% abandono de carrinho",
            "• Sem urgência nem escassez",
            "• Dúvidas sem resposta na hora",
            "• Clientes entram e saem $0",
            "• Sem prova social em tempo real"
          ]
        : [
            "• 97% de abandono de carrito",
            "• Sin urgencia ni escasez real",
            "• Dudas sin respuesta en vivo",
            "• Visitas entran y se van con $0",
            "• Sin prueba social flotante"
          ];

      ctx.fillStyle = "#fca5a5";
      ctx.font = `600 ${9.5 * S}px sans-serif`;
      ctx.textAlign = "left";
      itemsSin.forEach((item, idx) => {
        ctx.fillText(item, leftX + 16 * S, topY + 50 * S + idx * 34 * S);
      });

      // DERECHA: CON NEVUX
      const rightX = leftX + boxW + 20 * S;
      ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2.5 * S;
      drawRoundedRect(ctx, rightX, topY, boxW, boxH, 20 * S);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(isPt ? "✅ COM NEVUX" : "✅ TIENDA CON NEVUX", rightX + boxW / 2, topY + 16 * S);

      const itemsCon = isPt
        ? [
            "• Conversão ×3 + Métrica ROI",
            "• Urgência com timers e stock",
            "• Vendedor IA atendendo 24/7",
            "• Notificações de compras vivas",
            "• Bundles 2x1 e leve + pague -"
          ]
        : [
            "• Conversión ×3 + Métrica ROI",
            "• Urgencia de stock y timers",
            "• Vendedor IA cerrando 24/7",
            "• Notificaciones de compra en vivo",
            "• Bundles 2x1 y packs de ofertas"
          ];

      ctx.fillStyle = "#a7f3d0";
      ctx.font = `700 ${9.5 * S}px sans-serif`;
      ctx.textAlign = "left";
      itemsCon.forEach((item, idx) => {
        ctx.fillText(item, rightX + 16 * S, topY + 50 * S + idx * 34 * S);
      });

      const ctaY = height - 100 * S;
      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, 36 * S, ctaY, width - 72 * S, 54 * S, 18 * S);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.font = `950 ${13 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        isPt ? "🚀 INSTALE GRÁTIS POR 7 DIAS NA NUVEMSHOP" : "🚀 INSTALÁ GRATIS POR 7 DÍAS EN TU TIENDANUBE",
        width / 2,
        ctaY + 27 * S
      );

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${10 * S}px sans-serif`;
      ctx.fillText("NEVUX.AR · APP STORE ID #37382", width / 2, height - 24 * S);

      const a = document.createElement("a");
      a.download = `nevux-antes-vs-despues.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ─── CARRUSEL HD 1080x1350 DE 5 SLIDES ─── */
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

      if (slide.type === "problem") {
        ctx.fillStyle = "#0c0407";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.4, 20 * S, width / 2, height * 0.4, 220 * S);
        g.addColorStop(0, "rgba(239,68,68,0.18)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.4, 220 * S, 0, Math.PI * 2);
        ctx.fill();
      } else if (slide.type === "comparison") {
        ctx.fillStyle = "#070b14";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.4, 20 * S, width / 2, height * 0.4, 220 * S);
        g.addColorStop(0, "rgba(59,130,246,0.2)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.4, 220 * S, 0, Math.PI * 2);
        ctx.fill();
      } else if (slide.type === "solution") {
        ctx.fillStyle = "#03120c";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.4, 20 * S, width / 2, height * 0.4, 220 * S);
        g.addColorStop(0, "rgba(16,185,129,0.22)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.4, 220 * S, 0, Math.PI * 2);
        ctx.fill();
      } else if (slide.type === "cta") {
        ctx.fillStyle = "#021a12";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.5, 30 * S, width / 2, height * 0.5, 240 * S);
        g.addColorStop(0, "rgba(16,185,129,0.3)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.5, 240 * S, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#060913";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.35, 20 * S, width / 2, height * 0.35, 220 * S);
        g.addColorStop(0, "rgba(16,185,129,0.18)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.35, 220 * S, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40 * S) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const logoSize = 32 * S;
      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, 36 * S, 32 * S, logoSize, logoSize, 10 * S);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = `950 ${18 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("N", 36 * S + logoSize / 2, 32 * S + logoSize / 2 + 1);
      ctx.fillStyle = "#fff";
      ctx.font = `900 ${15 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("NEVUX", 36 * S + logoSize + 10 * S, 32 * S + logoSize / 2);
      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${12 * S}px monospace`;
      ctx.textAlign = "right";
      ctx.fillText(`0${slideIndex + 1} / 0${PREMIUM_CAROUSEL_SLIDES.length}`, width - 36 * S, 32 * S + logoSize / 2);

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(36 * S, 80 * S);
      ctx.lineTo(width - 36 * S, 80 * S);
      ctx.stroke();

      const badgeText = isPt ? slide.badgePt : slide.badgeEs;
      ctx.font = `900 ${9.5 * S}px sans-serif`;
      const tw = ctx.measureText(badgeText).width;
      const badgeColor = slide.type === "problem" ? "#ef4444" : slide.type === "comparison" ? "#3b82f6" : "#10B981";
      ctx.fillStyle = slide.type === "problem" ? "rgba(239,68,68,0.15)" : slide.type === "comparison" ? "rgba(59,130,246,0.15)" : "rgba(16,185,129,0.15)";
      ctx.strokeStyle = badgeColor;
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, 36 * S, 110 * S, tw + 24 * S, 26 * S, 13 * S);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = badgeColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(badgeText, 36 * S + (tw + 24 * S) / 2, 110 * S + 13 * S);

      ctx.font = `900 ${22 * S}px sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      wrapText(ctx, isPt ? slide.titlePt : slide.titleEs, 36 * S, 155 * S, width - 72 * S, 30 * S);

      if (slide.metric) {
        const mY = 280 * S;
        ctx.fillStyle = slide.type === "cta" ? "#10B981" : "rgba(16,185,129,0.12)";
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 2 * S;
        drawRoundedRect(ctx, 36 * S, mY, width - 72 * S, 50 * S, 16 * S);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = slide.type === "cta" ? "#000" : "#10B981";
        ctx.font = `950 ${14 * S}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(slide.metric, width / 2, mY + 25 * S);
      }

      const boxY = height - 190 * S;
      ctx.fillStyle = "rgba(10,12,16,0.85)";
      ctx.strokeStyle = "rgba(16,185,129,0.3)";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, 36 * S, boxY, width - 72 * S, 120 * S, 20 * S);
      ctx.fill();
      ctx.stroke();
      ctx.font = `600 ${11.5 * S}px sans-serif`;
      ctx.fillStyle = "#d1fae5";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      wrapText(ctx, isPt ? slide.descPt : slide.descEs, width / 2, boxY + 22 * S, width - 108 * S, 20 * S);

      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${10 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        slide.type === "cta" ? "NEVUX.AR · APP OFICIAL" : isPt ? "DESLIZE PARA VER ➔" : "DESLIZÁ PARA CONTINUAR ➔",
        width / 2,
        height - 28 * S
      );

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

  /* ─── HOOKS / CIERRES HD 1080x1920 ─── */
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
      if (!ctx) return;

      const S = width / 340;
      const isCta = asset.category === "cta";
      const isHook = asset.category === "hook";

      if (asset.theme === "danger") {
        ctx.fillStyle = "#0a0205";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.38, 30 * S, width / 2, height * 0.38, 280 * S);
        g.addColorStop(0, "rgba(239,68,68,0.22)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.38, 280 * S, 0, Math.PI * 2);
        ctx.fill();
      } else if (asset.theme === "purple") {
        ctx.fillStyle = "#07030f";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.38, 30 * S, width / 2, height * 0.38, 280 * S);
        g.addColorStop(0, "rgba(139,92,246,0.22)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.38, 280 * S, 0, Math.PI * 2);
        ctx.fill();
      } else if (asset.theme === "green" || isCta) {
        ctx.fillStyle = "#020f0a";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.4, 40 * S, width / 2, height * 0.4, 300 * S);
        g.addColorStop(0, "rgba(16,185,129,0.28)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.4, 300 * S, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#05080f";
        ctx.fillRect(0, 0, width, height);
        const g = ctx.createRadialGradient(width / 2, height * 0.38, 30 * S, width / 2, height * 0.38, 280 * S);
        g.addColorStop(0, "rgba(16,185,129,0.16)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.38, 280 * S, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 48 * S) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 48 * S) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const logoSize = 36 * S;
      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, 40 * S, 48 * S, logoSize, logoSize, 12 * S);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = `950 ${20 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("N", 40 * S + logoSize / 2, 48 * S + logoSize / 2 + 1);
      ctx.fillStyle = "#fff";
      ctx.font = `900 ${16 * S}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("NEVUX", 40 * S + logoSize + 12 * S, 48 * S + logoSize / 2);

      const catLabel =
        asset.category === "hook"
          ? isPt
            ? "HOOK · 3s"
            : "GANCHO · 3s"
          : asset.category === "mid"
          ? "MID-ROLL"
          : isPt
          ? "CTA FINAL"
          : "CIERRE CTA";
      ctx.fillStyle = "#10B981";
      ctx.font = `900 ${11 * S}px sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText(catLabel, width - 40 * S, 48 * S + logoSize / 2);

      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1.5 * S;
      ctx.beginPath();
      ctx.moveTo(40 * S, 110 * S);
      ctx.lineTo(width - 40 * S, 110 * S);
      ctx.stroke();

      if (asset.id === "hook_dolor") {
        const mid = width / 2;
        const topY = 160 * S;
        const boxH = 420 * S;

        ctx.fillStyle = "rgba(239,68,68,0.12)";
        ctx.strokeStyle = "rgba(239,68,68,0.45)";
        ctx.lineWidth = 2 * S;
        drawRoundedRect(ctx, 40 * S, topY, mid - 52 * S, boxH, 24 * S);
        ctx.fill();
        ctx.stroke();

        ctx.font = `900 ${56 * S}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("👀", (40 * S + mid - 12 * S) / 2, topY + 100 * S);
        ctx.fillStyle = "#ef4444";
        ctx.font = `900 ${14 * S}px sans-serif`;
        ctx.fillText("10.000 VISITAS", (40 * S + mid - 12 * S) / 2, topY + 180 * S);
        ctx.fillStyle = "#fff";
        ctx.font = `950 ${18 * S}px sans-serif`;
        ctx.fillText("$0 VENTAS", (40 * S + mid - 12 * S) / 2, topY + 230 * S);
        ctx.font = `600 ${12 * S}px sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(isPt ? "SEM NEVUX" : "SIN NEVUX", (40 * S + mid - 12 * S) / 2, topY + 290 * S);

        ctx.fillStyle = "rgba(16,185,129,0.15)";
        ctx.strokeStyle = "rgba(16,185,129,0.55)";
        ctx.lineWidth = 2 * S;
        drawRoundedRect(ctx, mid + 12 * S, topY, mid - 52 * S, boxH, 24 * S);
        ctx.fill();
        ctx.stroke();

        ctx.font = `900 ${56 * S}px sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.fillText("💰", (mid + 12 * S + width - 40 * S) / 2, topY + 100 * S);
        ctx.fillStyle = "#10B981";
        ctx.font = `900 ${14 * S}px sans-serif`;
        ctx.fillText("VENTAS ×3", (mid + 12 * S + width - 40 * S) / 2, topY + 180 * S);
        ctx.fillStyle = "#fff";
        ctx.font = `950 ${18 * S}px sans-serif`;
        ctx.fillText("CON NEVUX", (mid + 12 * S + width - 40 * S) / 2, topY + 230 * S);
        ctx.font = `600 ${12 * S}px sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText("🔥 HOT SALE", (mid + 12 * S + width - 40 * S) / 2, topY + 290 * S);
      } else if (isCta) {
        const cardW = width - 80 * S;
        const cardH = 520 * S;
        const cardX = 40 * S;
        const cardY = 180 * S;

        ctx.fillStyle = "#10B981";
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 36 * S);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4 * S;
        ctx.stroke();

        const lS = 72 * S;
        const lX = (width - lS) / 2;
        const lY = cardY + 48 * S;
        ctx.fillStyle = "#000";
        drawRoundedRect(ctx, lX, lY, lS, lS, 20 * S);
        ctx.fill();
        ctx.fillStyle = "#10B981";
        ctx.font = `950 ${40 * S}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N", lX + lS / 2, lY + lS / 2 + 2);

        ctx.fillStyle = "#000";
        ctx.font = `950 ${26 * S}px sans-serif`;
        ctx.textBaseline = "top";
        wrapText(ctx, isPt ? asset.titlePt : asset.titleEs, width / 2, cardY + 150 * S, cardW - 48 * S, 36 * S);

        ctx.font = `700 ${14 * S}px sans-serif`;
        ctx.fillText(isPt ? asset.descPt : asset.descEs, width / 2, cardY + 280 * S);

        const btnW = cardW - 80 * S;
        const btnH = 72 * S;
        const btnX = cardX + 40 * S;
        const btnY = cardY + 360 * S;
        ctx.fillStyle = "#000";
        drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 36 * S);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = `950 ${16 * S}px sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillText(isPt ? asset.metricPt || "LINK NA BIO" : asset.metricEs || "LINK EN LA BIO", width / 2, btnY + btnH / 2);

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.font = `800 ${12 * S}px sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText("nevux.ar · App Oficial Tiendanube", width / 2, cardY + cardH - 48 * S);
      } else {
        ctx.font = `900 ${90 * S}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(16,185,129,0.15)";
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.32, 100 * S, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(asset.emoji, width / 2, height * 0.32);

        if (asset.metricEs) {
          const mText = isPt ? asset.metricPt || asset.metricEs : asset.metricEs;
          ctx.font = `900 ${13 * S}px sans-serif`;
          const mW = ctx.measureText(mText).width + 40 * S;
          const mH = 40 * S;
          const mX = (width - mW) / 2;
          const mY = height * 0.32 + 90 * S;
          ctx.fillStyle = "rgba(16,185,129,0.15)";
          ctx.strokeStyle = "#10B981";
          ctx.lineWidth = 2 * S;
          drawRoundedRect(ctx, mX, mY, mW, mH, 20 * S);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#10B981";
          ctx.textBaseline = "middle";
          ctx.fillText(mText, width / 2, mY + mH / 2);
        }
      }

      if (!isCta) {
        const boxW = width - 64 * S;
        const boxH = isHook ? 340 * S : 300 * S;
        const boxX = 32 * S;
        const boxY = height - boxH - 100 * S;

        ctx.fillStyle = "rgba(8, 12, 18, 0.92)";
        ctx.strokeStyle = "rgba(16,185,129,0.45)";
        ctx.lineWidth = 2.5 * S;
        drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28 * S);
        ctx.fill();
        ctx.stroke();

        const bText = isPt ? asset.badgePt : asset.badgeEs;
        ctx.font = `900 ${10 * S}px sans-serif`;
        const btw = ctx.measureText(bText).width + 28 * S;
        const bH = 28 * S;
        const bX = (width - btw) / 2;
        const bY = boxY + 28 * S;
        ctx.fillStyle = "rgba(16,185,129,0.18)";
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 1.5 * S;
        drawRoundedRect(ctx, bX, bY, btw, bH, 14 * S);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#10B981";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(bText, width / 2, bY + bH / 2);

        ctx.fillStyle = "#ffffff";
        ctx.font = `900 ${20 * S}px sans-serif`;
        ctx.textBaseline = "top";
        wrapText(ctx, isPt ? asset.titlePt : asset.titleEs, width / 2, boxY + 80 * S, boxW - 48 * S, 28 * S);

        ctx.fillStyle = "#9ca3af";
        ctx.font = `600 ${13 * S}px sans-serif`;
        wrapText(ctx, isPt ? asset.descPt : asset.descEs, width / 2, boxY + 200 * S, boxW - 48 * S, 22 * S);

        ctx.fillStyle = "#10B981";
        ctx.font = `900 ${12 * S}px sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillText("nevux.ar", width / 2, boxY + boxH - 36 * S);
      }

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `700 ${10 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        isCta
          ? isPt
            ? "APP OFICIAL TIENDANUBE · 7 DIAS GRÁTIS"
            : "APP OFICIAL TIENDANUBE · 7 DÍAS GRATIS"
          : isPt
          ? "REELS · TIKTOK · STORIES · 1080×1920"
          : "REELS · TIKTOK · STORIES · 1080×1920",
        width / 2,
        height - 48 * S
      );

      const a = document.createElement("a");
      a.download = `nevux-${asset.id}-pro.png`;
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
      <div
        style={{
          maxWidth: "750px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#0b2920",
          padding: "20px",
          borderRadius: "18px",
          border: "1.5px solid rgba(16, 185, 129, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#10B981", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <Smartphone size={20} />
          Panel de Contenido Visual Pro
        </h1>
        <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0, lineHeight: 1.4 }}>
          Assets HD nivel agencia para Reels, TikTok, Feed y Carruseles de Instagram.
        </p>

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
                padding: "10px 12px",
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

      {/* TAB 1: CARRUSEL PRO DE 5 PLACAS */}
      {activeTab === "carousels" && (
        <div style={{ width: "100%", maxWidth: "750px" }}>
          <div
            style={{
              backgroundColor: "#0b2920",
              border: "1.5px solid rgba(16,185,129,0.3)",
              borderRadius: "20px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <Award size={34} color="#10B981" style={{ marginBottom: "12px" }} />
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>
              Carrusel B2B Pro de 5 Placas HD
            </h2>
            <p style={{ fontSize: "13px", color: "#a7f3d0", margin: "0 0 24px" }}>
              Formato Instagram 4:5 (1080×1350) · Storytelling de Conversión
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "14px",
                textAlign: "left",
              }}
            >
              {PREMIUM_CAROUSEL_SLIDES.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1.5px solid rgba(16,185,129,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 900, color: "#10B981" }}>
                      SLIDE 0{index + 1} DE 05 · {isPt ? slide.badgePt : slide.badgeEs}
                    </span>
                    <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#fff", margin: "6px 0 8px", lineHeight: 1.3 }}>
                      {isPt ? slide.titlePt : slide.titleEs}
                    </h4>
                    <p style={{ fontSize: "11px", color: "#a7f3d0", margin: 0, lineHeight: 1.45, whitespace: "pre-line" }}>
                      {isPt ? slide.descPt : slide.descEs}
                    </p>
                  </div>
                  <button
                    disabled={isDownloading}
                    onClick={() => downloadSlideAsImage(index)}
                    style={{
                      background: "#10B981",
                      border: "none",
                      color: "#000",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontWeight: 800,
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Download size={14} />
                    Descargar Slide 0{index + 1} HD
                  </button>
                </div>
              ))}
            </div>
          </div>
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
                    <button
                      disabled={isDownloading}
                      onClick={() => downloadMarketingAsset(asset.id)}
                      style={{
                        background: "#10B981",
                        border: "none",
                        color: "#000",
                        padding: "10px",
                        borderRadius: "10px",
                        fontWeight: 800,
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Download size={14} />
                      Descargar HD Pro 1080×1920
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ANTES VS DESPUÉS */}
      {activeTab === "before_after" && (
        <div style={{ width: "100%", maxWidth: "750px" }}>
          <div
            style={{
              backgroundColor: "#0b2920",
              border: "1.5px solid rgba(16,185,129,0.3)",
              borderRadius: "20px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <Zap size={34} color="#10B981" style={{ marginBottom: "12px" }} />
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>
              {isPt ? "Comparativo Antes vs Depois" : "Comparativo Antes vs Después"}
            </h2>
            <p style={{ fontSize: "13px", color: "#a7f3d0", margin: "0 0 24px" }}>
              {isPt
                ? "Asset em HD (1080×1350) para mostrar a Proposta de Valor no Feed"
                : "Asset HD (1080×1350) para mostrar la Propuesta de Valor en el Feed"}
            </p>

            <div
              style={{
                background: "#05080f",
                border: "1.5px solid rgba(16,185,129,0.3)",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "20px",
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

            <button
              disabled={isDownloading}
              onClick={downloadBeforeAfterAsset}
              style={{
                width: "100%",
                background: "#10B981",
                border: "none",
                color: "#000",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: 900,
                fontSize: "14px",
                cursor: isDownloading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
              }}
            >
              <Download size={18} />
              {isPt
                ? "Baixar Imagem HD Antes vs Depois (1080×1350)"
                : "Descargar Imagen HD Antes vs Después (1080×1350)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
     }
