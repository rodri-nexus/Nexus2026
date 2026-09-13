"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Smartphone,
  Sparkles,
  ChevronRight,
  MousePointer,
  Video,
  Loader2,
  CheckCircle2,
  Download,
} from "lucide-react";

/* ═══════════════════════════════════════════
   1. TYPES & INTERFACES (Regla #9)
   ═══════════════════════════════════════════ */
interface Caption {
  es: string;
  pt: string;
}

interface StepReal {
  id: number;
  duration: number; // ms
  title: string;
  caption: Caption;
  imageUrl: string;
  cursor: {
    x: number; // 0 to 1
    y: number; // 0 to 1
    click: boolean;
  };
}

/* ═══════════════════════════════════════════
   2. SECUENCIA PASO A PASO CON TUS FOTOS REALES
   ═══════════════════════════════════════════ */
const REAL_STEPS: StepReal[] = [
  {
    id: 1,
    duration: 3500,
    title: "1. Dashboard Principal",
    caption: {
      es: "🔥 ¿Querés duplicar las ventas de tu Tiendanube? Mirá esto...",
      pt: "🔥 Quer duplicar as vendas da sua Nuvemshop? Olha só...",
    },
    imageUrl: "https://images.lucidpress.com/placeholder/nevux-step1.jpg", // Fallback / Slot foto 1
    cursor: { x: 0.5, y: 0.42, click: true },
  },
  {
    id: 2,
    duration: 3500,
    title: "2. Seleccionar Alcance",
    caption: {
      es: "1️⃣ Tocá en Crear Widget y elegí 'Para todos los productos'",
      pt: "1️⃣ Toque em Criar Widget e escolha 'Para todos os produtos'",
    },
    imageUrl: "https://images.lucidpress.com/placeholder/nevux-step2.jpg", // Fallback / Slot foto 2
    cursor: { x: 0.5, y: 0.82, click: true },
  },
  {
    id: 3,
    duration: 3500,
    title: "3. Elegir Widget",
    caption: {
      es: "2️⃣ Elegí 'Cuenta Regresiva' para activar máxima urgencia ⏰",
      pt: "2️⃣ Escolha 'Contador Regressivo' para ativar urgência máxima ⏰",
    },
    imageUrl: "https://images.lucidpress.com/placeholder/nevux-step3.jpg", // Fallback / Slot foto 3
    cursor: { x: 0.5, y: 0.88, click: true },
  },
  {
    id: 4,
    duration: 4500,
    title: "4. Editor & Fechas Especiales",
    caption: {
      es: "3️⃣ Personalizá tu oferta y activá el modo 'Hot Sale' 🔥",
      pt: "3️⃣ Customize sua oferta e ative o modo 'Hot Sale' 🔥",
    },
    imageUrl: "https://images.lucidpress.com/placeholder/nevux-step4.jpg", // Fallback / Slot foto 4
    cursor: { x: 0.78, y: 0.62, click: true },
  },
  {
    id: 5,
    duration: 4000,
    title: "5. Resultado en la Home",
    caption: {
      es: "🚀 ¡Listo! El contador resalta al instante en el inicio de tu tienda",
      pt: "🚀 Pronto! O contador se destaca ao vivo na home da sua loja",
    },
    imageUrl: "https://images.lucidpress.com/placeholder/nevux-step5.jpg", // Fallback / Slot foto 5
    cursor: { x: 0.5, y: 0.15, click: false },
  },
  {
    id: 6,
    duration: 5000,
    title: "6. Resultado en Ficha de Producto",
    caption: {
      es: "💥 Y aparece arriba del botón de compra multiplicando tu conversión",
      pt: "💥 E aparece acima do botão de compra multiplicando suas vendas",
    },
    imageUrl: "https://images.lucidpress.com/placeholder/nevux-step6.jpg", // Fallback / Slot foto 6
    cursor: { x: 0.5, y: 0.75, click: false },
  },
];

/* ═══════════════════════════════════════════
   3. SUB-COMPONENTES AUXILIARES (Regla #9)
   ═══════════════════════════════════════════ */

// Cursor Virtual Animado
const PointerOverlay = ({ x, y, active }: { x: number; y: number; active: boolean }) => (
  <div
    style={{
      position: "absolute",
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      pointerEvents: "none",
      zIndex: 100,
      transform: "translate(-8px, -8px)",
      transition: "left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
    }}
  >
    <div style={{ position: "relative" }}>
      <MousePointer size={28} color="#000000" fill="#ffffff" style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))" }} />
      {active && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "32px",
            height: "32px",
            background: "rgba(16, 185, 129, 0.5)",
            borderRadius: "50%",
            transform: "translate(-30%, -30%)",
            animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   4. COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════ */
export default function MarketingReelsPage() {
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [zoom, setZoom] = useState(85);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Almacenador de imágenes reales locales/subidas por el usuario
  const [images, setImages] = useState<string[]>([
    "/reels/step1.jpg",
    "/reels/step2.jpg",
    "/reels/step3.jpg",
    "/reels/step4.jpg",
    "/reels/step5.jpg",
    "/reels/step6.jpg",
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep = REAL_STEPS[currentIdx];

  // Control de reproducción automática del reproductor
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepTime = 100;
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const nextTime = prev + stepTime;
        if (nextTime >= currentStep.duration) {
          setCurrentIdx((prevIdx) => (prevIdx + 1) % REAL_STEPS.length);
          return 0;
        }
        return nextTime;
      });
    }, stepTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, currentStep]);

  const handleNext = () => {
    setElapsedTime(0);
    setCurrentIdx((prev) => (prev + 1) % REAL_STEPS.length);
  };

  const handlePrev = () => {
    setElapsedTime(0);
    setCurrentIdx((prev) => (prev === 0 ? REAL_STEPS.length - 1 : prev - 1));
  };

  const handleReset = () => {
    setElapsedTime(0);
    setCurrentIdx(0);
    setIsPlaying(true);
  };

  // Permite al usuario cargar o reemplazar cualquier imagen directamente si lo desea
  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages((prev) => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
    }
  };

  // ═══════════════════════════════════════════
  // MOTOR EXPORTADOR DE VIDEO REAL (Canvas 30fps + MediaRecorder)
  // ═══════════════════════════════════════════
  const generateVideoFile = async () => {
    setIsRecording(true);
    setIsPlaying(false);
    setRecordingProgress(0);

    const width = 720;
    const height = 1280; // Proporción 9:16 HD
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      alert("No se pudo iniciar el canvas.");
      setIsRecording(false);
      return;
    }

    // Cargar todas las imágenes a elementos HTMLImageElement
    const loadedImages: HTMLImageElement[] = await Promise.all(
      images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = () => {
            // Fallback en canvas si no carga
            const fallback = new Image();
            resolve(fallback);
          };
        });
      })
    );

    // Stream de captura a 30 FPS
    const stream = canvas.captureStream(30);
    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/mp4";
    }

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nevux_tutorial_cuenta_regresiva_${lang.toUpperCase()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsRecording(false);
      setRecordingProgress(100);
      setIsPlaying(true);
    };

    recorder.start();

    // Renderizar escena por escena en tiempo real
    const totalDuration = REAL_STEPS.reduce((acc, s) => acc + s.duration, 0);
    let startTime = performance.now();

    const renderLoop = (now: number) => {
      const elapsedTotal = now - startTime;
      const progress = Math.min(elapsedTotal / totalDuration, 1);
      setRecordingProgress(Math.round(progress * 100));

      // Buscar qué paso corresponde
      let accumulatedTime = 0;
      let activeStepIdx = 0;
      let stepTime = 0;

      for (let i = 0; i < REAL_STEPS.length; i++) {
        if (elapsedTotal < accumulatedTime + REAL_STEPS[i].duration) {
          activeStepIdx = i;
          stepTime = elapsedTotal - accumulatedTime;
          break;
        }
        accumulatedTime += REAL_STEPS[i].duration;
      }

      const activeStep = REAL_STEPS[activeStepIdx];
      const img = loadedImages[activeStepIdx];

      // 1. Limpiar Fondo
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, width, height);

      // 2. Dibujar Imagen Real con Ken Burns Pan/Zoom suave
      if (img && img.width > 0) {
        const zoomFactor = 1 + (stepTime / activeStep.duration) * 0.05; // 5% zoom
        const dw = width * zoomFactor;
        const dh = height * zoomFactor;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = "#161b22";
        ctx.fillRect(40, 100, width - 80, height - 300);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(activeStep.title, width / 2, height / 2);
      }

      // 3. Dibujar Barras de Progreso Superiores (Estilo Instagram Stories)
      const barY = 40;
      const barHeight = 6;
      const totalBars = REAL_STEPS.length;
      const barGap = 8;
      const totalWidth = width - 40;
      const singleBarWidth = (totalWidth - (totalBars - 1) * barGap) / totalBars;

      for (let b = 0; b < totalBars; b++) {
        const bx = 20 + b * (singleBarWidth + barGap);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.roundRect(bx, barY, singleBarWidth, barHeight, 3);
        ctx.fill();

        let fillPct = 0;
        if (b < activeStepIdx) fillPct = 1;
        if (b === activeStepIdx) fillPct = stepTime / activeStep.duration;

        if (fillPct > 0) {
          ctx.fillStyle = "#10B981";
          ctx.beginPath();
          ctx.roundRect(bx, barY, singleBarWidth * fillPct, barHeight, 3);
          ctx.fill();
        }
      }

      // 4. Dibujar Cursor de Clic Virtual
      const cx = activeStep.cursor.x * width;
      const cy = activeStep.cursor.y * height;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ripple de clic
      if (stepTime > 800 && stepTime < 1800 && activeStep.cursor.click) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.8)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Dibujar Subtítulo Estilo TikTok (Abajo)
      const capText = lang === "es" ? activeStep.caption.es : activeStep.caption.pt;
      const boxY = height - 220;
      const boxMargin = 30;
      const boxWidth = width - boxMargin * 2;

      // Card Badge Nevux
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.roundRect(boxMargin, boxY - 36, 120, 28, 8);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("NEVUX APP", boxMargin + 60, boxY - 17);

      // Card Fondo
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(boxMargin, boxY, boxWidth, 140, 20);
      ctx.fill();
      ctx.stroke();

      // Texto
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "left";

      // Wrap simple
      const words = capText.split(" ");
      let line = "";
      let lineY = boxY + 45;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > boxWidth - 30 && n > 0) {
          ctx.fillText(line, boxMargin + 16, lineY);
          line = words[n] + " ";
          lineY += 32;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, boxMargin + 16, lineY);

      if (elapsedTotal < totalDuration) {
        requestAnimationFrame(renderLoop);
      } else {
        recorder.stop();
      }
    };

    requestAnimationFrame(renderLoop);
  };

  const progressPercent = Math.min((elapsedTime / currentStep.duration) * 100, 100);

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
      {/* ═══ HEADER DE CONTROL ═══ */}
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
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff" }}>Nevux Video Studio</div>
            <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "700" }}>PASO A PASO REAL 🎬</div>
          </div>
        </div>

        {/* SELECTOR DE IDIOMA Y ZOOM */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", background: "#111827", padding: "6px 12px", borderRadius: "12px", border: "1px solid #374151" }}>
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
        {/* COLUMNA 1: SMARTPHONE MOCKUP 9:16 CON CAPTURA REAL */}
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
            <PointerOverlay
              x={currentStep.cursor.x}
              y={currentStep.cursor.y}
              active={elapsedTime > 1000 && elapsedTime < 2200 && currentStep.cursor.click}
            />

            {/* BARRA DE PROGRESO DE HISTORIAS */}
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
              {REAL_STEPS.map((sc, idx) => {
                let p = 0;
                if (idx < currentIdx) p = 100;
                if (idx === currentIdx) p = progressPercent;
                return (
                  <div key={sc.id} style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.25)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${p}%`, height: "100%", background: "#10B981" }} />
                  </div>
                );
              })}
            </div>

            {/* SUBTÍTULOS ESTILO TIKTOK EN ZONA INFERIOR */}
            <div
              style={{
                position: "absolute",
                bottom: "28px",
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
                  background: "rgba(0, 0, 0, 0.9)",
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
                {lang === "es" ? currentStep.caption.es : currentStep.caption.pt}
              </div>
            </div>

            {/* CAPTURA REAL MOSTRADA EN PANTALLA */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000000" }}>
              <img
                src={images[currentIdx]}
                alt={currentStep.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                onError={(e) => {
                  // Fallback limpio si la URL externa no está disponible
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* COLUMNA 2: REPRODUCTOR, EXPORTADOR Y CARGADOR DE FOTOS */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* CONTROLADOR PRINCIPAL Y BOTÓN DE DESCARGA EN VIDEO */}
          <div style={{ background: "#111827", padding: "20px", borderRadius: "20px", border: "1px solid #1f2937", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10B981", fontSize: "14px", fontWeight: "800", marginBottom: "16px" }}>
              <Video size={18} />
              Exportador de Video Nivel Estudio
            </div>

            {/* Botones del reproductor */}
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
                {isPlaying ? "Pausar Vista Previa" : "Reproducir Continuo"}
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

            {/* BOTÓN OFICIAL: GENERAR Y DESCARGAR VIDEO (.MP4 / .WEBM) */}
            <button
              onClick={generateVideoFile}
              disabled={isRecording}
              style={{
                width: "100%",
                background: isRecording ? "#1f2937" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: isRecording ? "#ffffff" : "#000000",
                border: "none",
                borderRadius: "14px",
                padding: "16px",
                fontWeight: "900",
                fontSize: "14px",
                cursor: isRecording ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: isRecording ? "none" : "0 8px 24px rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {isRecording ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Procesando video HD... ({recordingProgress}%)</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>🎬 Descargar Video Paso a Paso (MP4 / WebM HD)</span>
                </>
              )}
            </button>
            <span style={{ display: "block", fontSize: "10px", color: "#64748b", textAlign: "center", marginTop: "8px", lineHeight: "1.3" }}>
              ⚡ Compila la secuencia completa de tus capturas reales en un video de alta definición a 30 FPS listo para guardar en la galería de tu teléfono.
            </span>
          </div>

          {/* GESTIÓN DE LAS CAPTURAS REALES SUBIDAS */}
          <div style={{ background: "#111827", padding: "20px", borderRadius: "20px", border: "1px solid #1f2937" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#9ca3af", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.05em" }}>
              Capturas Reales de tu App (Paso a Paso)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {REAL_STEPS.map((sc, idx) => {
                const isAct = idx === currentIdx;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setElapsedTime(0);
                    }}
                    style={{
                      background: isAct ? "rgba(16, 185, 129, 0.12)" : "rgba(0,0,0,0.3)",
                      border: isAct ? "1.5px solid #10B981" : "1px solid #1f2937",
                      borderRadius: "12px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
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
                      <div style={{ fontSize: "12px", fontWeight: "800", color: isAct ? "#10B981" : "#ffffff" }}>
                        {sc.title}
                      </div>
                      <div style={{ fontSize: "10px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                        {lang === "es" ? sc.caption.es : sc.caption.pt}
                      </div>
                    </div>

                    {/* Botón Reemplazar Foto si quisieras actualizarla */}
                    <label
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: "#1f2937",
                        color: "#10B981",
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        border: "1px solid #374151",
                      }}
                    >
                      Cargar foto
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(idx, e)}
                      />
                    </label>
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
