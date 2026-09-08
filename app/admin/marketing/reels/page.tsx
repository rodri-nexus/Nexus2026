"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Sparkles,
  ChevronRight,
  Store,
  ArrowLeft,
  MousePointer,
  Percent,
  Clock,
  ShoppingCart,
} from "lucide-react";

/* ═══════════════════════════════════════════
   1. TYPES & INTERFACES (Regla #9)
   ═══════════════════════════════════════════ */
interface Caption {
  es: string;
  pt: string;
}

interface Scene {
  id: number;
  title: string;
  captions: Caption;
  voiceScript: {
    es: string;
    pt: string;
  };
  cursor: {
    x: string;
    y: string;
    click: boolean;
  };
}

/* ═══════════════════════════════════════════
   2. ESCENAS CON GUIÓN PROFESIONAL DE VOZ
   ═══════════════════════════════════════════ */
const SCENES: Scene[] = [
  {
    id: 1,
    title: "1. Dashboard Nevux",
    captions: {
      es: "🔥 ¿Querés duplicar las ventas de tu Tiendanube? Mirá esto...",
      pt: "🔥 Quer duplicar as vendas da sua Nuvemshop? Olha só...",
    },
    voiceScript: {
      es: "Aumentar las ventas de tu tienda online nunca fue tan sencillo. Te presento Nevux, la herramienta definitiva para multiplicar tus ingresos.",
      pt: "Aumentar as vendas da sua loja online nunca foi tão simples. Apresento a Nevux, a ferramenta definitiva para multiplicar os seus ganhos.",
    },
    cursor: { x: "72%", y: "46%", click: true },
  },
  {
    id: 2,
    title: "2. Modal de Creación",
    captions: {
      es: "1️⃣ Tocá en Crear Widget y elegí aplicarlo a Todos tus Productos",
      pt: "1️⃣ Toque em Criar Widget e escolha Todos os Produtos",
    },
    voiceScript: {
      es: "Paso uno. Hacé clic en crear widget, y elegí la opción para aplicarlo automáticamente a todos tus productos.",
      pt: "Passo um. Clique em criar widget e escolha a opção para aplicá-lo automaticamente a todos os seus produtos.",
    },
    cursor: { x: "50%", y: "62%", click: true },
  },
  {
    id: 3,
    title: "3. Elegir Widget",
    captions: {
      es: "2️⃣ Elegí la Cuenta Regresiva para activar máxima urgencia ⏰",
      pt: "2️⃣ Escolha o Contador Regressivo para ativar urgência máxima ⏰",
    },
    voiceScript: {
      es: "Paso dos. Seleccioná el optimizador de cuenta regresiva, diseñado con gatillos mentales para acelerar la decisión de compra.",
      pt: "Passo dois. Selecione o otimizador de contador regressivo, desenhado com gatilhos mentais para acelerar a compra.",
    },
    cursor: { x: "28%", y: "24%", click: true },
  },
  {
    id: 4,
    title: "4. Editor de Estilos y Ubicación",
    captions: {
      es: "3️⃣ Personalizá el estilo, activá el Modo Urgencia y guardá cambios 🎨",
      pt: "3️⃣ Customize o estilo, ative o Modo Urgência e salve 🎨",
    },
    voiceScript: {
      es: "Paso tres. Ubicalo estratégicamente arriba del botón de compra, activá el modo urgencia inteligente y guardá los cambios.",
      pt: "Passo três. Coloque estrategicamente acima do botão de compra, ative o modo urgência inteligente e salve as alterações.",
    },
    cursor: { x: "78%", y: "89%", click: true },
  },
  {
    id: 5,
    title: "5. Widget en Tienda Real",
    captions: {
      es: "🚀 ¡Listo! El widget ya está vendiendo por vos en vivo. ¡Aumentá tu ticket ya!",
      pt: "🚀 Pronto! O widget já está vendendo ao vivo por você. Fature mais hoje!",
    },
    voiceScript: {
      es: "Listo. Tu contador ya está activo en tu tienda, despertando un deseo de compra inmediato en cada uno de tus visitantes. ¡Duplicá tus ingresos hoy mismo con Nevux!",
      pt: "Pronto. Seu contador já está ativo e vendendo ao vivo, despertando o desejo de compra imediato em cada cliente.",
    },
    cursor: { x: "50%", y: "78%", click: false },
  },
];

/* ═══════════════════════════════════════════
   3. SUB-COMPONENTES AUXILIARES (Regla #9)
   ═══════════════════════════════════════════ */

// Reloj dinámico con Ticking en tiempo real
const MockTimer = () => {
  const [seconds, setSeconds] = useState(45);
  const [minutes, setMinutes] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          setMinutes((m) => (m === 0 ? 14 : m - 1));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center", fontFamily: "monospace" }}>
      <div style={{ background: "#10B981", color: "#ffffff", padding: "3px 6px", borderRadius: "5px", fontSize: "11px", fontWeight: "800" }}>
        00d
      </div>
      <span style={{ color: "#ffffff", fontSize: "10px", fontWeight: "bold" }}>:</span>
      <div style={{ background: "#10B981", color: "#ffffff", padding: "3px 6px", borderRadius: "5px", fontSize: "11px", fontWeight: "800" }}>
        12h
      </div>
      <span style={{ color: "#ffffff", fontSize: "10px", fontWeight: "bold" }}>:</span>
      <div style={{ background: "#10B981", color: "#ffffff", padding: "3px 6px", borderRadius: "5px", fontSize: "11px", fontWeight: "800" }}>
        {pad(minutes)}m
      </div>
      <span style={{ color: "#ffffff", fontSize: "10px", fontWeight: "bold" }}>:</span>
      <div style={{ background: "#10B981", color: "#ffffff", padding: "3px 6px", borderRadius: "5px", fontSize: "11px", fontWeight: "800" }}>
        {pad(seconds)}s
      </div>
    </div>
  );
};

// Cursor Virtual Animado
const SimulatedPointer = ({ x, y, active }: { x: string; y: string; active: boolean }) => (
  <motion.div
    animate={{ left: x, top: y }}
    transition={{ type: "spring", stiffness: 90, damping: 20 }}
    style={{
      position: "absolute",
      pointerEvents: "none",
      zIndex: 100,
      transform: "translate(-8px, -8px)",
    }}
  >
    <div style={{ position: "relative" }}>
      <MousePointer size={26} color="#000000" fill="#ffffff" style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))" }} />
      {active && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "32px",
            height: "32px",
            background: "rgba(16, 185, 129, 0.45)",
            borderRadius: "50%",
            transform: "translate(-30%, -30%)",
            animation: "ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
      )}
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   4. COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════ */
export default function MarketingReelsPage() {
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // Progreso de 0 a 100
  const [zoom, setZoom] = useState(85);
  const [soundActive, setSoundActive] = useState(true);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const estimatedDurationRef = useRef<number>(5000);
  const progressTimerRef = useRef<number>(0);

  const currentScene = SCENES[currentSceneIdx];

  // Estimación de duración de voz basada en palabras
  const getEstimatedDuration = (text: string) => {
    const words = text.split(" ").length;
    const durationMs = (words / 130) * 60 * 1000;
    return Math.max(durationMs, 4200);
  };

  // Función que maneja la locución sincronizada
  const handleSceneStart = (sceneIdx: number) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);
    progressTimerRef.current = 0;

    const script = SCENES[sceneIdx].voiceScript[lang];
    const estimatedDuration = getEstimatedDuration(script);
    estimatedDurationRef.current = estimatedDuration;

    if (!soundActive || typeof window === "undefined" || !window.speechSynthesis) {
      startFallbackTimer(estimatedDuration);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = lang === "es" ? "es-ES" : "pt-BR";

    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      (v) =>
        v.lang.startsWith(utterance.lang) &&
        (v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("premium") ||
          v.name.toLowerCase().includes("neural") ||
          v.name.toLowerCase().includes("sabina") ||
          v.name.toLowerCase().includes("helena"))
    );

    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    currentUtteranceRef.current = utterance;

    // EVENTO CLAVE: Cuando la voz termina de hablar
    utterance.onend = () => {
      setProgress(100);
      setTimeout(() => {
        if (isPlaying) {
          setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
        }
      }, 500);
    };

    utterance.onerror = () => {
      startFallbackTimer(estimatedDuration);
    };

    const stepTime = 100;
    progressIntervalRef.current = setInterval(() => {
      progressTimerRef.current += stepTime;
      const calculatedProgress = Math.min((progressTimerRef.current / estimatedDuration) * 100, 95);
      setProgress(calculatedProgress);
    }, stepTime);

    window.speechSynthesis.speak(utterance);
  };

  // Temporizador de respaldo si no hay voz activa
  const startFallbackTimer = (duration: number) => {
    const stepTime = 100;
    progressIntervalRef.current = setInterval(() => {
      progressTimerRef.current += stepTime;
      const calculatedProgress = (progressTimerRef.current / duration) * 100;
      if (calculatedProgress >= 100) {
        clearInterval(progressIntervalRef.current!);
        setProgress(100);
        setTimeout(() => {
          if (isPlaying) {
            setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
          }
        }, 500);
      } else {
        setProgress(calculatedProgress);
      }
    }, stepTime);
  };

  // Efecto central del reproductor
  useEffect(() => {
    if (isPlaying) {
      handleSceneStart(currentSceneIdx);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentSceneIdx, lang, soundActive]);

  const handleNext = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
  };

  const handlePrev = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentSceneIdx((prev) => (prev === 0 ? SCENES.length - 1 : prev - 1));
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentSceneIdx(0);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        color: "#ffffff",
        padding: "24px 16px 80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ═══ HEADER SUPERIOR DE CONTROL ═══ */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid #1f2937",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#000000",
              fontSize: "18px",
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff" }}>Nevux Studio</div>
            <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "700" }}>VIDEO & VOICE SYNC ENGINE</div>
          </div>
        </div>

        {/* CONTROLES RÁPIDOS */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", background: "#111827", padding: "6px 12px", borderRadius: "12px", border: "1px solid #374151" }}>
          {/* Idioma */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setLang("es")}
              style={{
                background: lang === "es" ? "#10B981" : "transparent",
                color: lang === "es" ? "#000000" : "#9ca3af",
                border: "none",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              ES
            </button>
            <button
              onClick={() => setLang("pt")}
              style={{
                background: lang === "pt" ? "#10B981" : "transparent",
                color: lang === "pt" ? "#000000" : "#9ca3af",
                border: "none",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              PT-BR
            </button>
          </div>

          <div style={{ width: "1px", height: "20px", background: "#374151" }} />

          {/* Zoom Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>Zoom:</span>
            <input
              type="range"
              min="50"
              max="100"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "80px", accentColor: "#10B981" }}
            />
            <span style={{ fontSize: "11px", fontFamily: "monospace", minWidth: "32px" }}>{zoom}%</span>
          </div>

          <div style={{ width: "1px", height: "20px", background: "#374151" }} />

          {/* Audio toggle */}
          <button
            onClick={() => setSoundActive(!soundActive)}
            style={{
              background: soundActive ? "rgba(16, 185, 129, 0.15)" : "transparent",
              border: "none",
              color: soundActive ? "#10B981" : "#6b7280",
              padding: "6px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* ═══ CONTENEDOR PRINCIPAL (2 COLUMNAS) ═══ */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "32px",
          alignItems: "start",
          justifyItems: "center",
        }}
      >
        {/* COLUMNA 1: SMARTPHONE FRAME 9:16 (MOCKUP DEL REEL) */}
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
          <div
            style={{
              width: "360px",
              height: "640px",
              background: "#000000",
              borderRadius: "44px",
              border: "10px solid #1f2937",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.15)",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            {/* NOTCH SUPERIOR IPHONE */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "140px",
                height: "22px",
                background: "#1f2937",
                borderBottomLeftRadius: "14px",
                borderBottomRightRadius: "14px",
                zIndex: 90,
              }}
            />

            {/* CURSOR VIRTUAL ANIMADO */}
            <SimulatedPointer
              x={currentScene.cursor.x}
              y={currentScene.cursor.y}
              active={progress > 30 && progress < 75 && currentScene.cursor.click}
            />

            {/* BARRA DE HISTORIAS / PROGRESO SUPERIOR SINCRONIZADA */}
            <div
              style={{
                position: "absolute",
                top: "28px",
                left: "14px",
                right: "14px",
                zIndex: 80,
                display: "flex",
                gap: "4px",
              }}
            >
              {SCENES.map((sc, idx) => {
                let p = 0;
                if (idx < currentSceneIdx) p = 100;
                if (idx === currentSceneIdx) p = progress;
                return (
                  <div key={sc.id} style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.25)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${p}%`, height: "100%", background: "#10B981" }} />
                  </div>
                );
              })}
            </div>

            {/* INDICADOR DE VOZ ACTIVA */}
            {soundActive && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "18px",
                  zIndex: 85,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(0,0,0,0.6)",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  border: "1px solid rgba(16,185,129,0.3)",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: "8px", fontWeight: "800", color: "#10B981" }}>VOZ ON</span>
              </div>
            )}

            {/* SUBTÍTULOS ESTILO TIKTOK / INSTAGRAM (ZONA MEDIA-BAJA) */}
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                left: "14px",
                right: "14px",
                zIndex: 85,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#10B981",
                  color: "#000000",
                  fontSize: "11px",
                  fontWeight: "900",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                Nevux App
              </div>
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.88)",
                  border: "1.5px solid rgba(16, 185, 129, 0.4)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "800",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  lineHeight: "1.4",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
                }}
              >
                {lang === "es" ? currentScene.captions.es : currentScene.captions.pt}
              </div>
            </div>

            {/* ═══ ESCENAS DEL FLUJO ═══ */}
            <div style={{ flex: 1, paddingTop: "44px", paddingBottom: "120px", paddingLeft: "14px", paddingRight: "14px", background: "#0d1117", display: "flex", flexDirection: "column" }}>
              
              {/* ESCENA 1: DASHBOARD REAL */}
              {currentSceneIdx === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Nav Dashboard */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #21262d" }}>
                    <span style={{ color: "#10B981", fontWeight: "900", fontSize: "14px" }}>NEVUX</span>
                    <span style={{ fontSize: "10px", background: "rgba(16,185,129,0.15)", color: "#10B981", padding: "2px 8px", borderRadius: "999px", fontWeight: "700" }}>Tienda Conectada</span>
                  </div>

                  {/* Saludo */}
                  <div style={{ background: "#161b22", padding: "10px 12px", borderRadius: "12px", border: "1px solid #30363d" }}>
                    <div style={{ fontSize: "10px", color: "#8b949e" }}>Hola Rodrigo,</div>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "#ffffff" }}>¡Tu tienda está lista para despegar! 🚀</div>
                  </div>

                  {/* Estadísticas */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div style={{ background: "#161b22", padding: "10px", borderRadius: "12px", border: "1px solid #30363d" }}>
                      <div style={{ fontSize: "9px", color: "#8b949e" }}>Widgets Activos</div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#10B981" }}>0 widgets</div>
                    </div>
                    <div style={{ background: "#161b22", padding: "10px", borderRadius: "12px", border: "1px solid #30363d" }}>
                      <div style={{ fontSize: "9px", color: "#8b949e" }}>Facturación Extra</div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>$0.00</div>
                    </div>
                  </div>

                  {/* Tarjeta Empty State con Botón "+ Crear widget" */}
                  <div style={{ background: "rgba(22, 27, 34, 0.6)", border: "1.5px dashed #30363d", borderRadius: "16px", padding: "18px 12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "6px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                      <Store size={18} color="#10B981" />
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#ffffff", marginBottom: "2px" }}>No tenés widgets activos</div>
                    <div style={{ fontSize: "9px", color: "#8b949e", marginBottom: "12px" }}>Activá tu primer optimizador de conversión</div>
                    
                    {/* BOTÓN + CREAR WIDGET */}
                    <div
                      style={{
                        background: progress > 50 ? "#059669" : "#10B981",
                        color: "#000000",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                        transform: progress > 50 ? "scale(0.96)" : "scale(1)",
                        transition: "all 0.15s",
                      }}
                    >
                      <Sparkles size={13} />
                      + Crear widget
                    </div>
                  </div>
                </div>
              )}

              {/* ESCENA 2: MODAL "CREAR NUEVO WIDGET" */}
              {currentSceneIdx === 1 && (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", paddingBottom: "20px" }}>
                  <div style={{ background: "#ffffff", borderRadius: "20px", padding: "16px", color: "#000000", boxShadow: "0 20px 40px rgba(0,0,0,0.8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "900", color: "#000000" }}>Crear nuevo widget</div>
                      <span style={{ fontSize: "10px", color: "#9ca3af" }}>✕</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "12px" }}>¿Qué tipo de widget querés crear?</div>

                    {/* Opciones */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {/* Opción 1 */}
                      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "8px 10px", display: "flex", alignItems: "center", gap: "8px", opacity: 0.5 }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Percent size={14} color="#000" />
                        </div>
                        <div style={{ fontSize: "10px", fontWeight: "700", color: "#000" }}>Widget para un producto específico</div>
                      </div>

                      {/* Opción 2: SELECCIONADA */}
                      <div
                        style={{
                          border: progress > 50 ? "2px solid #10B981" : "1.5px solid #e5e7eb",
                          background: progress > 50 ? "#ecfdf5" : "#ffffff",
                          borderRadius: "12px",
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: progress > 50 ? "0 0 0 3px rgba(16, 185, 129, 0.15)" : "none",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Store size={14} color="#ffffff" />
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{ fontSize: "10px", fontWeight: "800", color: "#000000" }}>Widget para todos los productos</div>
                          <div style={{ fontSize: "8px", color: "#6b7280" }}>Aparece en toda la tienda e inicio</div>
                        </div>
                        <ChevronRight size={14} color="#10B981" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ESCENA 3: LISTA DE 27 WIDGETS (SELECCIÓN CUENTA REGRESIVA) */}
              {currentSceneIdx === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#8b949e", fontSize: "10px" }}>
                    <ArrowLeft size={12} />
                    <span>Volver</span>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: "#ffffff" }}>Seleccioná el widget a activar:</div>

                  {/* Grid de Widgets */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    
                    {/* Widget Seleccionado: Cuenta Regresiva */}
                    <div
                      style={{
                        background: progress > 45 ? "rgba(16, 185, 129, 0.15)" : "#161b22",
                        border: progress > 45 ? "2px solid #10B981" : "1px solid #30363d",
                        borderRadius: "12px",
                        padding: "10px",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                        <Clock size={14} color="#10B981" />
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: "800", color: "#ffffff" }}>Cuenta Regresiva</div>
                      <div style={{ fontSize: "8px", color: "#10B981" }}>🔥 Alta Urgencia</div>
                    </div>

                    {/* Otros Widgets */}
                    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px", padding: "10px", opacity: 0.4 }}>
                      <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "#21262d", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                        <Percent size={14} color="#8b949e" />
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#ffffff" }}>Badge Cuotas</div>
                    </div>

                    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px", padding: "10px", opacity: 0.4 }}>
                      <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "#21262d", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                        <Store size={14} color="#8b949e" />
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#ffffff" }}>Banner Deslizante</div>
                    </div>

                    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px", padding: "10px", opacity: 0.4 }}>
                      <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "#21262d", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                        <Sparkles size={14} color="#8b949e" />
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#ffffff" }}>Vendedor IA</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ESCENA 4: EDITOR REAL DEL WIDGET (UBICACIÓN, ESTILOS, MODO URGENCIA) */}
              {currentSceneIdx === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "#ffffff", paddingBottom: "4px", borderBottom: "1px solid #21262d" }}>
                    Editor: Cuenta Regresiva
                  </div>

                  {/* Tabs */}
                  <div style={{ display: "flex", borderBottom: "1px solid #21262d", textAlign: "center" }}>
                    <div style={{ flex: 1, fontSize: "9px", fontWeight: "800", color: "#10B981", borderBottom: "2px solid #10B981", paddingBottom: "4px" }}>
                      Ubicación
                    </div>
                    <div style={{ flex: 1, fontSize: "9px", color: "#8b949e", paddingBottom: "4px" }}>Estilos</div>
                    <div style={{ flex: 1, fontSize: "9px", color: "#8b949e", paddingBottom: "4px" }}>General</div>
                  </div>

                  {/* Campos Reales */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "2px" }}>
                    <div>
                      <div style={{ fontSize: "8px", fontWeight: "700", color: "#8b949e", marginBottom: "2px" }}>Título del contador:</div>
                      <div style={{ background: "#161b22", border: "1px solid #30363d", padding: "5px 8px", borderRadius: "6px", fontSize: "9px", color: "#ffffff" }}>
                        ¡Oferta Flash termina en! 🔥
                      </div>
                    </div>

                    {/* Selector de Ubicación */}
                    <div>
                      <div style={{ fontSize: "8px", fontWeight: "700", color: "#8b949e", marginBottom: "3px" }}>Ubicación en Producto:</div>
                      <div style={{ background: "#161b22", border: "1px solid #10B981", padding: "6px 8px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} />
                        <span style={{ fontSize: "8px", fontWeight: "700", color: "#ffffff" }}>Antes del botón &quot;Agregar al carrito&quot;</span>
                      </div>
                    </div>

                    {/* Switch Modo Urgencia */}
                    <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", padding: "6px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "8px", fontWeight: "800", color: "#ffffff" }}>Modo Urgencia 🔥</div>
                        <div style={{ fontSize: "7px", color: "#8b949e" }}>Cambia a color rojo en los últimos minutos</div>
                      </div>
                      <div style={{ width: "24px", height: "14px", background: "#10B981", borderRadius: "999px", position: "relative" }}>
                        <div style={{ width: "10px", height: "10px", background: "#ffffff", borderRadius: "50%", position: "absolute", right: "2px", top: "2px" }} />
                      </div>
                    </div>
                  </div>

                  {/* Botón Guardar Cambios */}
                  <div
                    style={{
                      marginTop: "6px",
                      background: progress > 80 ? "#059669" : "#10B981",
                      color: progress > 80 ? "#ffffff" : "#000000",
                      padding: "8px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "900",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    {progress > 80 ? "✓ Cambios Guardados" : "Guardar cambios"}
                  </div>
                </div>
              )}

              {/* ESCENA 5: TIENDA REAL CON EL WIDGET RENDERIZADO */}
              {currentSceneIdx === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                  {/* Header Tienda */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "4px", borderBottom: "1px solid #21262d" }}>
                    <span style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.05em" }}>TIENDA STREETWEAR</span>
                    <span style={{ fontSize: "9px", color: "#8b949e" }}>🛒 (1)</span>
                  </div>

                  {/* Ficha Producto */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "2px" }}>
                    <div style={{ width: "60px", height: "70px", background: "#161b22", borderRadius: "8px", border: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShoppingCart size={20} color="#8b949e" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "7px", color: "#10B981", fontWeight: "800" }}>HOT SALE 🔥</div>
                      <div style={{ fontSize: "10px", fontWeight: "800", color: "#ffffff", lineHeight: "1.2" }}>Hoodie Oversized Nevux Black</div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "baseline", marginTop: "2px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "900", color: "#10B981" }}>$18.990</span>
                        <span style={{ fontSize: "9px", color: "#6b7280", textDecoration: "line-through" }}>$29.990</span>
                      </div>
                    </div>
                  </div>

                  {/* EL WIDGET DE NEVUX RENDERIZADO EN VIVO */}
                  <div
                    style={{
                      background: "#000000",
                      border: "1.5px solid #10B981",
                      borderRadius: "10px",
                      padding: "8px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      boxShadow: "0 0 15px rgba(16, 185, 129, 0.25)",
                    }}
                  >
                    <div style={{ fontSize: "9px", fontWeight: "800", color: "#ffffff", textTransform: "uppercase" }}>
                      ⚡ ¡OFERTA FLASH TERMINA EN:
                    </div>
                    <MockTimer />
                  </div>

                  {/* Botón Comprar de la Tienda */}
                  <div
                    style={{
                      background: "#10B981",
                      color: "#000000",
                      padding: "8px",
                      borderRadius: "10px",
                      fontSize: "10px",
                      fontWeight: "900",
                      textAlign: "center",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <ShoppingCart size={12} />
                    Agregar al carrito
                  </div>

                  <div style={{ fontSize: "7px", textAlign: "center", color: "#6b7280" }}>
                    🔒 Compra segura procesada por Tiendanube
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* COLUMNA 2: CONTROLES DE LA SIMULACIÓN Y GUION */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* CONTROLADOR PRINCIPAL */}
          <div style={{ background: "#111827", padding: "20px", borderRadius: "20px", border: "1px solid #1f2937", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10B981", fontSize: "14px", fontWeight: "800", marginBottom: "16px" }}>
              <Smartphone size={18} />
              Controles del Reproductor
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <button
                onClick={handlePrev}
                style={{ background: "#1f2937", border: "none", color: "#ffffff", padding: "12px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronRight size={18} style={{ transform: "rotate(180deg)" }} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  flex: 1,
                  background: isPlaying ? "#f59e0b" : "#10B981",
                  color: "#000000",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pausar Reel" : "Reproducir Continuo"}
              </button>

              <button
                onClick={handleNext}
                style={{ background: "#1f2937", border: "none", color: "#ffffff", padding: "12px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronRight size={18} />
              </button>

              <button
                onClick={handleReset}
                style={{ background: "#1f2937", border: "none", color: "#ffffff", padding: "12px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Barra de progreso de la escena */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af", marginBottom: "6px" }}>
              <span>Escena {currentSceneIdx + 1} de {SCENES.length}</span>
              <span>Progreso Locución: {Math.round(progress)}%</span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "#1f2937", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#10B981", transition: "width 0.1s linear" }} />
            </div>
          </div>

          {/* GUION TÉCNICO CLICKABLE */}
          <div style={{ background: "#111827", padding: "20px", borderRadius: "20px", border: "1px solid #1f2937" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#9ca3af", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.05em" }}>
              Guión Narrativo (Texto de la Voz)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SCENES.map((sc, idx) => {
                const isAct = idx === currentSceneIdx;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setProgress(0);
                    }}
                    style={{
                      background: isAct ? "rgba(16, 185, 129, 0.12)" : "rgba(0,0,0,0.3)",
                      border: isAct ? "1.5px solid #10B981" : "1px solid #1f2937",
                      borderRadius: "12px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: isAct ? "#10B981" : "#1f2937",
                        color: isAct ? "#000000" : "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "800",
                        flexShrink: 0,
                      }}
                    >
                      {sc.id}
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: isAct ? "#10B981" : "#ffffff", marginBottom: "2px" }}>
                        {sc.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "700", marginBottom: "4px" }}>
                        🗣️ Voz: &quot;{lang === "es" ? sc.voiceScript.es : sc.voiceScript.pt}&quot;
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
        }
