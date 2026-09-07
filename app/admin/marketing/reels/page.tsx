"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Film,
  Sparkles,
  BarChart3,
  Bot,
  Mic,
  Globe,
  Palette,
  Brain,
  Flame,
  Zap,
  TrendingUp,
  CheckCircle2,
  Rocket,
  Star,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
type LangKey = "es" | "pt";
type FeatureKey =
  | "voz"
  | "vendedor-ia"
  | "analytics"
  | "fechas-especiales"
  | "estilo-marca"
  | "sugerencias-ia"
  | "multi-idioma"
  | "ruleta-descuentos"
  | "tabla-talles"
  | "bundle-promociones";

interface Scene {
  duration: number;
  bg: string;
  emoji?: string;
  title?: string;
  subtitle?: string;
  stat?: string;
  cta?: string;
}

interface FeatureConfig {
  id: FeatureKey;
  label: { es: string; pt: string };
  icon: React.ReactNode;
  color: string;
  scenes: (lang: LangKey) => Scene[];
}

/* ═══════════════════════════════════════════
   ESTILOS BASE (Regla #9 al inicio)
═══════════════════════════════════════════ */
const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 640;

const canvasFrameStyle: React.CSSProperties = {
  width: `${CANVAS_WIDTH}px`,
  height: `${CANVAS_HEIGHT}px`,
  borderRadius: "32px",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 6px #1a1a1a, 0 0 0 8px #10B981",
  background: "#000000",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const sceneContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 24px 32px",
  boxSizing: "border-box",
  textAlign: "center",
};

const progressBarContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: "16px",
  left: "16px",
  right: "16px",
  display: "flex",
  gap: "4px",
  zIndex: 10,
};

const progressSegmentStyle: React.CSSProperties = {
  flex: 1,
  height: "3px",
  background: "rgba(255,255,255,0.35)",
  borderRadius: "2px",
  overflow: "hidden",
};

const brandBadgeStyle: React.CSSProperties = {
  position: "absolute",
  top: "32px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  padding: "6px 14px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 800,
  color: "#ffffff",
  letterSpacing: "0.1em",
  border: "1px solid rgba(255,255,255,0.25)",
};

const buttonPrimaryStyle: React.CSSProperties = {
  padding: "14px 28px",
  borderRadius: "14px",
  border: "none",
  background: "#10B981",
  color: "#ffffff",
  fontWeight: 900,
  fontSize: "14px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  boxShadow: "0 8px 22px rgba(16, 185, 129, 0.35)",
  transition: "transform 0.15s ease",
};

const buttonSecondaryStyle: React.CSSProperties = {
  padding: "12px 22px",
  borderRadius: "14px",
  border: "1.5px solid rgba(16, 185, 129, 0.4)",
  background: "rgba(16, 185, 129, 0.1)",
  color: "#a7f3d0",
  fontWeight: 800,
  fontSize: "13px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const featureButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: "10px 14px",
  borderRadius: "12px",
  border: isActive ? "2px solid #10B981" : "1.5px solid rgba(16, 185, 129, 0.25)",
  background: isActive ? "rgba(16, 185, 129, 0.2)" : "#0b2920",
  color: isActive ? "#ffffff" : "#a7f3d0",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  whiteSpace: "nowrap",
  transition: "all 0.2s ease",
});

/* ═══════════════════════════════════════════
   BIBLIOTECA DE GUIONES POR FUNCIÓN
═══════════════════════════════════════════ */
const FEATURES_LIBRARY: FeatureConfig[] = [
  {
    id: "voz",
    label: { es: "🎙️ Búsqueda por Voz", pt: "🎙️ Busca por Voz" },
    icon: <Mic size={16} />,
    color: "#EC4899",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "😩",
        title: lang === "es" ? "¿Te cansaste de escribir en pantallas chicas?" : "Cansado de digitar em telas pequenas?",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #EC4899 0%, #9333EA 100%)",
        emoji: "🎙️",
        title: lang === "es" ? "Nevux te trae Búsqueda por Voz" : "Nevux traz Busca por Voz",
        subtitle: lang === "es" ? "Comprá hablando desde tu celu" : "Compre falando do celular",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
        emoji: "⚡",
        title: lang === "es" ? "¡En 1 clic queda listo!" : "Em 1 clique fica pronto!",
        subtitle: lang === "es" ? "Sin editar tu tienda" : "Sem editar sua loja",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "📈",
        stat: "+38%",
        title: lang === "es" ? "Más conversiones móviles" : "Mais conversões mobile",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🚀",
        cta: lang === "es" ? "Instalá Nevux hoy" : "Instale Nevux hoje",
      },
    ],
  },
  {
    id: "vendedor-ia",
    label: { es: "🤖 Vendedor Virtual IA", pt: "🤖 Vendedor Virtual IA" },
    icon: <Bot size={16} />,
    color: "#10B981",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "⏰",
        title: lang === "es" ? "Son las 2 AM y tu cliente pregunta..." : "São 2h da manhã e seu cliente pergunta...",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
        emoji: "🤖",
        title: lang === "es" ? "Tu Vendedor IA responde por vos" : "Seu Vendedor IA responde por você",
        subtitle: lang === "es" ? "24 horas los 7 días" : "24 horas por dia",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #3B82F6 0%, #1E40AF 100%)",
        emoji: "💬",
        title: lang === "es" ? "Cierra la venta en WhatsApp" : "Fecha a venda no WhatsApp",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "📊",
        stat: "85%",
        title: lang === "es" ? "de consultas resueltas solas" : "das consultas resolvidas sozinhas",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🎯",
        cta: lang === "es" ? "Probá 7 días gratis" : "Teste 7 dias grátis",
      },
    ],
  },
  {
    id: "analytics",
    label: { es: "📊 Live Analytics", pt: "📊 Live Analytics" },
    icon: <BarChart3 size={16} />,
    color: "#10B981",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "🤔",
        title: lang === "es" ? "¿No sabés cuánto te renta Nevux?" : "Não sabe quanto Nevux te rende?",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
        emoji: "📊",
        title: lang === "es" ? "Analytics en vivo" : "Analytics ao vivo",
        subtitle: lang === "es" ? "Facturación extra minuto a minuto" : "Faturamento extra minuto a minuto",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "💰",
        stat: "$127.500",
        title: lang === "es" ? "Extra este mes" : "Extra neste mês",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #F59E0B 0%, #D97706 100%)",
        emoji: "🏆",
        title: lang === "es" ? "ROI Tracker exacto" : "ROI Tracker exato",
        subtitle: lang === "es" ? "Cero magia, todo comprobable" : "Zero mágica, tudo comprovado",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🚀",
        cta: lang === "es" ? "Dashboard incluido" : "Dashboard incluído",
      },
    ],
  },
  {
    id: "fechas-especiales",
    label: { es: "🔥 Fechas Especiales", pt: "🔥 Datas Especiais" },
    icon: <Flame size={16} />,
    color: "#F59E0B",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "😱",
        title: lang === "es" ? "Se viene el Black Friday..." : "Vem aí a Black Friday...",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #F59E0B 0%, #B45309 100%)",
        emoji: "🔥",
        title: lang === "es" ? "Activá el modo en 1 clic" : "Ative o modo com 1 clique",
        subtitle: lang === "es" ? "Nevux transforma tu tienda" : "Nevux transforma sua loja",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #EF4444 0%, #991B1B 100%)",
        emoji: "🎁",
        title: lang === "es" ? "10 widgets se sincronizan" : "10 widgets se sincronizam",
        subtitle: lang === "es" ? "Cuenta regresiva, badges, cupones" : "Contagem regressiva, badges, cupons",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "📈",
        stat: "+180%",
        title: lang === "es" ? "Ventas vs día normal" : "Vendas vs dia normal",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🎯",
        cta: lang === "es" ? "8 presets listos" : "8 presets prontos",
      },
    ],
  },
  {
    id: "estilo-marca",
    label: { es: "🎨 Estilo Marca", pt: "🎨 Estilo Marca" },
    icon: <Palette size={16} />,
    color: "#8B5CF6",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "😐",
        title: lang === "es" ? "¿Widgets que rompen tu diseño?" : "Widgets que quebram seu design?",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)",
        emoji: "🎨",
        title: lang === "es" ? "Editor Estilo Marca" : "Editor Estilo Marca",
        subtitle: lang === "es" ? "27 widgets con TUS colores" : "27 widgets com SUAS cores",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #EC4899 0%, #9F1239 100%)",
        emoji: "✨",
        title: lang === "es" ? "Regla cromática inteligente" : "Regra cromática inteligente",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "🏆",
        stat: "100%",
        title: lang === "es" ? "Coherencia visual" : "Coerência visual",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🎯",
        cta: lang === "es" ? "Diseño Pro sin diseñador" : "Design Pro sem designer",
      },
    ],
  },
  {
    id: "sugerencias-ia",
    label: { es: "🧠 Sugerencias IA", pt: "🧠 Sugestões IA" },
    icon: <Brain size={16} />,
    color: "#3B82F6",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "🤨",
        title: lang === "es" ? "¿Ticket promedio bajo?" : "Ticket médio baixo?",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #3B82F6 0%, #1E40AF 100%)",
        emoji: "🧠",
        title: lang === "es" ? "Cross-Selling con IA" : "Cross-Selling com IA",
        subtitle: lang === "es" ? "Sugerencias dinámicas por producto" : "Sugestões dinâmicas por produto",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)",
        emoji: "🎯",
        title: lang === "es" ? "Afinidad de precios inteligente" : "Afinidade de preços inteligente",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "💰",
        stat: "+42%",
        title: lang === "es" ? "Aumento del ticket promedio" : "Aumento do ticket médio",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🚀",
        cta: lang === "es" ? "IA que vende por vos" : "IA que vende por você",
      },
    ],
  },
  {
    id: "multi-idioma",
    label: { es: "🌎 Multi-Idioma IA", pt: "🌎 Multi-Idioma IA" },
    icon: <Globe size={16} />,
    color: "#06B6D4",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "🇦🇷🇧🇷🇺🇸",
        title: lang === "es" ? "Tus clientes hablan varios idiomas" : "Seus clientes falam vários idiomas",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #06B6D4 0%, #0E7490 100%)",
        emoji: "🌎",
        title: lang === "es" ? "Traducción automática con IA" : "Tradução automática com IA",
        subtitle: "ES / PT-BR / EN",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
        emoji: "⚡",
        title: lang === "es" ? "Detecta idioma del comprador" : "Detecta idioma do comprador",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "📈",
        stat: "3X",
        title: lang === "es" ? "Alcance internacional" : "Alcance internacional",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🎯",
        cta: lang === "es" ? "Vendé sin fronteras" : "Venda sem fronteiras",
      },
    ],
  },
  {
    id: "ruleta-descuentos",
    label: { es: "🎡 Ruleta de Descuentos", pt: "🎡 Roleta de Descontos" },
    icon: <Sparkles size={16} />,
    color: "#F59E0B",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "👀",
        title: lang === "es" ? "¿Visitas que no compran?" : "Visitas que não compram?",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #F59E0B 0%, #B45309 100%)",
        emoji: "🎡",
        title: lang === "es" ? "Ruleta gamificada" : "Roleta gamificada",
        subtitle: lang === "es" ? "Enganchá al 100%" : "Engaje 100%",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
        emoji: "🎁",
        title: lang === "es" ? "Cupones automáticos por email" : "Cupons automáticos por email",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "📊",
        stat: "+65%",
        title: lang === "es" ? "Conversión con ruleta" : "Conversão com roleta",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🎯",
        cta: lang === "es" ? "Diversión que vende" : "Diversão que vende",
      },
    ],
  },
  {
    id: "tabla-talles",
    label: { es: "📏 Tabla de Talles", pt: "📏 Tabela de Tamanhos" },
    icon: <Zap size={16} />,
    color: "#8B5CF6",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "😰",
        title: lang === "es" ? "¿Devoluciones por talle equivocado?" : "Devoluções por tamanho errado?",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)",
        emoji: "📏",
        title: lang === "es" ? "Tabla Interactiva" : "Tabela Interativa",
        subtitle: lang === "es" ? "Calcula el talle exacto" : "Calcula o tamanho exato",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
        emoji: "✅",
        title: lang === "es" ? "Menos cambios y devoluciones" : "Menos trocas e devoluções",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "📉",
        stat: "-72%",
        title: lang === "es" ? "Reducción de devoluciones" : "Redução de devoluções",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🚀",
        cta: lang === "es" ? "Ahorrás plata y tiempo" : "Economize dinheiro e tempo",
      },
    ],
  },
  {
    id: "bundle-promociones",
    label: { es: "🎁 Bundle Promociones", pt: "🎁 Bundle Promoções" },
    icon: <TrendingUp size={16} />,
    color: "#EF4444",
    scenes: (lang) => [
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
        emoji: "😐",
        title: lang === "es" ? "¿Solo vendés 1 producto por compra?" : "Só vende 1 produto por compra?",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #EF4444 0%, #991B1B 100%)",
        emoji: "🎁",
        title: lang === "es" ? "Packs Bundle Nevux" : "Packs Bundle Nevux",
        subtitle: lang === "es" ? "Combos irresistibles" : "Combos irresistíveis",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #F59E0B 0%, #B45309 100%)",
        emoji: "💥",
        title: lang === "es" ? "Descuentos por cantidad" : "Descontos por quantidade",
      },
      {
        duration: 4000,
        bg: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        emoji: "🚀",
        stat: "+55%",
        title: lang === "es" ? "Aumento del ticket" : "Aumento do ticket",
      },
      {
        duration: 3000,
        bg: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
        emoji: "🎯",
        cta: lang === "es" ? "Vendé más por venta" : "Venda mais por venda",
      },
    ],
  },
];

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: REEL PLAYER (Escena animada)
═══════════════════════════════════════════ */
function ReelPlayer({
  scenes,
  isPlaying,
  currentSceneIndex,
  onFinishScene,
  brandLabel,
}: {
  scenes: Scene[];
  isPlaying: boolean;
  currentSceneIndex: number;
  onFinishScene: () => void;
  brandLabel: string;
}) {
  const currentScene = scenes[currentSceneIndex];

  useEffect(() => {
    if (!isPlaying || !currentScene) return;
    const timer = setTimeout(() => {
      onFinishScene();
    }, currentScene.duration);
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIndex]);

  if (!currentScene) return null;

  return (
    <div style={canvasFrameStyle}>
      {/* Barra de progreso segmentada estilo Instagram */}
      <div style={progressBarContainerStyle}>
        {scenes.map((s, idx) => (
          <div key={idx} style={progressSegmentStyle}>
            <motion.div
              initial={{ width: idx < currentSceneIndex ? "100%" : "0%" }}
              animate={{
                width:
                  idx < currentSceneIndex
                    ? "100%"
                    : idx === currentSceneIndex && isPlaying
                    ? "100%"
                    : idx === currentSceneIndex
                    ? "0%"
                    : "0%",
              }}
              transition={{
                duration: idx === currentSceneIndex && isPlaying ? s.duration / 1000 : 0,
                ease: "linear",
              }}
              style={{ height: "100%", background: "#ffffff", borderRadius: "2px" }}
            />
          </div>
        ))}
      </div>

      {/* Marca Nevux */}
      <div style={brandBadgeStyle}>{brandLabel}</div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSceneIndex}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ ...sceneContainerStyle, background: currentScene.bg }}
        >
          {currentScene.emoji && (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
              style={{
                fontSize: currentScene.stat ? "80px" : "120px",
                marginBottom: "20px",
                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
              }}
            >
              {currentScene.emoji}
            </motion.div>
          )}

          {currentScene.stat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                fontSize: "72px",
                fontWeight: 950,
                color: "#ffffff",
                letterSpacing: "-0.04em",
                marginBottom: "12px",
                textShadow: "0 6px 20px rgba(0,0,0,0.4)",
                lineHeight: 1,
              }}
            >
              {currentScene.stat}
            </motion.div>
          )}

          {currentScene.title && (
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              style={{
                fontSize: currentScene.stat ? "22px" : "30px",
                fontWeight: 900,
                color: "#ffffff",
                margin: "0 0 12px 0",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                textShadow: "0 4px 15px rgba(0,0,0,0.5)",
              }}
            >
              {currentScene.title}
            </motion.h1>
          )}

          {currentScene.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.95)",
                margin: 0,
                fontWeight: 600,
                lineHeight: 1.4,
                textShadow: "0 2px 8px rgba(0,0,0,0.35)",
              }}
            >
              {currentScene.subtitle}
            </motion.p>
          )}

          {currentScene.cta && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.3 }}
              style={{
                marginTop: "20px",
                padding: "16px 32px",
                background: "#ffffff",
                color: "#059669",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: 950,
                boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
              }}
            >
              {currentScene.cta} →
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Handle inferior estilo iOS */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "4px",
          background: "rgba(255,255,255,0.4)",
          borderRadius: "3px",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MarketingReelsPage() {
  const [lang, setLang] = useState<LangKey>("es");
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>("voz");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const selectedConfig = FEATURES_LIBRARY.find((f) => f.id === selectedFeature)!;
  const scenes = selectedConfig.scenes(lang);
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const handlePlay = () => {
    setCurrentSceneIndex(0);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown <= 0) return;
    if (countdown === 1) {
      const t = setTimeout(() => {
        setCountdown(0);
        setIsPlaying(true);
      }, 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleFinishScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((i) => i + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setCountdown(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#061a14",
        color: "#ffffff",
        padding: "20px 16px 80px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      {/* BREADCRUMB */}
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#a7f3d0",
            textDecoration: "none",
            padding: "8px 14px",
            borderRadius: "10px",
            background: "#0b2920",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }}
        >
          <ArrowLeft size={15} />
          Volver al Dashboard
        </Link>
      </div>

      {/* HEADER */}
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
          background: "linear-gradient(135deg, #0b2920 0%, #061a14 100%)",
          padding: "26px 20px",
          borderRadius: "22px",
          border: "1.5px solid rgba(16, 185, 129, 0.3)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            marginBottom: "14px",
            fontSize: "11px",
            fontWeight: 800,
            color: "#10B981",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <Film size={13} />
          Estudio de Marketing Nevux
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 950,
            color: "#ffffff",
            margin: "0 0 8px 0",
            letterSpacing: "-0.03em",
          }}
        >
          🎬 Generador de Reels 9:16
        </h1>
        <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0, lineHeight: 1.5 }}>
          Elegí la función, tocá <b>▶ Iniciar</b> y grabá tu pantalla. En 20 segundos tenés un Reel profesional listo para Instagram, TikTok o Shorts.
        </p>
      </div>

      {/* SELECTOR DE IDIOMA */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          background: "#0b2920",
          padding: "5px",
          borderRadius: "12px",
          border: "1px solid rgba(16, 185, 129, 0.25)",
        }}
      >
        <button
          onClick={() => setLang("es")}
          style={{
            padding: "8px 20px",
            borderRadius: "9px",
            border: "none",
            background: lang === "es" ? "#10B981" : "transparent",
            color: lang === "es" ? "#ffffff" : "#a7f3d0",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          🇦🇷 Español
        </button>
        <button
          onClick={() => setLang("pt")}
          style={{
            padding: "8px 20px",
            borderRadius: "9px",
            border: "none",
            background: lang === "pt" ? "#10B981" : "transparent",
            color: lang === "pt" ? "#ffffff" : "#a7f3d0",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          🇧🇷 Português
        </button>
      </div>

      {/* SELECTOR DE FUNCIÓN */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "#0b2920",
          padding: "14px 12px",
          borderRadius: "16px",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#a7f3d0", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          🎯 Elegí la función a promocionar
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {FEATURES_LIBRARY.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFeature(f.id);
                handleReset();
              }}
              style={featureButtonStyle(selectedFeature === f.id)}
            >
              {f.icon}
              {f.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* PLAYER PRINCIPAL */}
      <div style={{ position: "relative", padding: "10px 0" }}>
        {countdown > 0 ? (
          <div
            style={{
              ...canvasFrameStyle,
              background: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)", fontWeight: 800, marginBottom: "20px" }}>
              🎥 {lang === "es" ? "Grabá pantalla ahora" : "Grave a tela agora"}
            </div>
            <motion.div
              key={countdown}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontSize: "200px",
                fontWeight: 950,
                color: "#ffffff",
                textShadow: "0 15px 40px rgba(0,0,0,0.4)",
                lineHeight: 1,
              }}
            >
              {countdown}
            </motion.div>
          </div>
        ) : (
          <ReelPlayer
            scenes={scenes}
            isPlaying={isPlaying}
            currentSceneIndex={currentSceneIndex}
            onFinishScene={handleFinishScene}
            brandLabel={lang === "es" ? "NEVUX • TIENDANUBE" : "NEVUX • NUVEMSHOP"}
          />
        )}
      </div>

      {/* CONTROLES */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        {!isPlaying && countdown === 0 && (
          <button onClick={handlePlay} style={buttonPrimaryStyle}>
            <Play size={17} fill="#ffffff" />
            {lang === "es" ? "Iniciar Presentación" : "Iniciar Apresentação"}
          </button>
        )}
        {(isPlaying || countdown > 0) && (
          <button onClick={handleReset} style={buttonSecondaryStyle}>
            <RotateCcw size={15} />
            {lang === "es" ? "Reiniciar" : "Reiniciar"}
          </button>
        )}
      </div>

      {/* TIP DE GRABACIÓN */}
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "14px 16px",
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "14px",
          fontSize: "12px",
          color: "#a7f3d0",
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        💡 <b>Tip Pro:</b> Antes de tocar <b>▶ Iniciar</b>, activá la <b>grabación de pantalla</b> nativa de tu celular (Android: Barra rápida / iPhone: Centro de Control). Duración total: <b>~{Math.round(totalDuration / 1000)} segundos</b>. Después subilo directo a Instagram Reels, TikTok o YouTube Shorts.
      </div>
    </div>
  );
}
