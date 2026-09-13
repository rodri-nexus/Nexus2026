"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Loader2,
  ChevronRight,
  MousePointer,
  Download,
  Upload,
  CheckCircle2,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TIPOS (Regla #9)
═══════════════════════════════════════════ */
interface Caption {
  es: string;
  pt: string;
}

interface StepReal {
  id: number;
  duration: number;
  holdRatio: number; // 0-1: tiempo mostrando full antes del zoom
  title: string;
  caption: Caption;
  focusX: number; // 0-1 centro del zoom
  focusY: number;
  zoomMax: number; // ej 1.8
  cursorClick: boolean;
  isCta?: boolean;
}

/* ═══════════════════════════════════════════
   SECUENCIA PROFESIONAL
═══════════════════════════════════════════ */
const REAL_STEPS: StepReal[] = [
  {
    id: 1,
    duration: 4500,
    holdRatio: 0.38,
    title: "1. Dashboard",
    caption: {
      es: "🔥 ¿Querés más ventas en Tiendanube? Empezá así...",
      pt: "🔥 Quer mais vendas na Nuvemshop? Comece assim...",
    },
    focusX: 0.5,
    focusY: 0.4,
    zoomMax: 2.1,
    cursorClick: true,
  },
  {
    id: 2,
    duration: 4500,
    holdRatio: 0.38,
    title: "2. Alcance del widget",
    caption: {
      es: "1️⃣ Elegí: Widget para todos los productos",
      pt: "1️⃣ Escolha: Widget para todos os produtos",
    },
    focusX: 0.5,
    focusY: 0.78,
    zoomMax: 1.85,
    cursorClick: true,
  },
  {
    id: 3,
    duration: 4500,
    holdRatio: 0.38,
    title: "3. Cuenta Regresiva",
    caption: {
      es: "2️⃣ Tocá Configurar widget en Cuenta regresiva ⏰",
      pt: "2️⃣ Toque Configurar widget no Contador ⏰",
    },
    focusX: 0.5,
    focusY: 0.82,
    zoomMax: 1.9,
    cursorClick: true,
  },
  {
    id: 4,
    duration: 5000,
    holdRatio: 0.35,
    title: "4. Editor + Hot Sale",
    caption: {
      es: "3️⃣ Personalizá y activá Fechas Especiales 🔥 Hot Sale",
      pt: "3️⃣ Personalize e ative Datas Especiais 🔥 Hot Sale",
    },
    focusX: 0.5,
    focusY: 0.55,
    zoomMax: 1.55,
    cursorClick: true,
  },
  {
    id: 5,
    duration: 4000,
    holdRatio: 0.55,
    title: "5. En tu Home",
    caption: {
      es: "🚀 ¡Listo! La oferta ya vive en el inicio de tu tienda",
      pt: "🚀 Pronto! A oferta já está na home da sua loja",
    },
    focusX: 0.5,
    focusY: 0.18,
    zoomMax: 1.45,
    cursorClick: false,
  },
  {
    id: 6,
    duration: 5500,
    holdRatio: 0.45,
    title: "6. En el producto + CTA",
    caption: {
      es: "💥 Urgencia arriba del carrito. Probá Nevux · Link en bio · 7 días gratis",
      pt: "💥 Urgência acima do carrinho. Teste Nevux · Link na bio · 7 dias grátis",
    },
    focusX: 0.5,
    focusY: 0.72,
    zoomMax: 1.5,
    cursorClick: false,
    isCta: true,
  },
];

/* ═══════════════════════════════════════════
   HELPERS CANVAS
═══════════════════════════════════════════ */
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

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  focusX: number,
  focusY: number,
  zoom: number
) {
  if (!img.width || !img.height) return;
  const scale = Math.max(dw / img.width, dh / img.height) * zoom;
  const sw = dw / scale;
  const sh = dh / scale;
  let sx = img.width * focusX - sw / 2;
  let sy = img.height * focusY - sh / 2;
  sx = Math.max(0, Math.min(img.width - sw, sx));
  sy = Math.max(0, Math.min(img.height - sh, sy));
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
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
   CURSOR OVERLAY UI
═══════════════════════════════════════════ */
function PointerOverlay({
  x,
  y,
  active,
}: {
  x: number;
  y: number;
  active: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        pointerEvents: "none",
        zIndex: 100,
        transform: "translate(-8px, -8px)",
        transition:
          "left 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      <div style={{ position: "relative" }}>
        <MousePointer
          size={28}
          color="#000000"
          fill="#ffffff"
          style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))" }}
        />
        {active && (
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "34px",
              height: "34px",
              background: "rgba(16, 185, 129, 0.45)",
              borderRadius: "50%",
              transform: "translate(-30%, -30%)",
              animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
export default function MarketingReelsPage() {
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [zoom, setZoom] = useState(85);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [images, setImages] = useState<string[]>(["", "", "", "", "", ""]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentStep = REAL_STEPS[currentIdx];

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const stepTime = 50;
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + stepTime;
        if (next >= currentStep.duration) {
          setCurrentIdx((i) => (i + 1) % REAL_STEPS.length);
          return 0;
        }
        return next;
      });
    }, stepTime);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, currentStep]);

  const t = elapsedTime / currentStep.duration;
  const hold = currentStep.holdRatio;
  const zoomT = t <= hold ? 0 : easeInOutCubic((t - hold) / (1 - hold));
  const liveZoom = 1 + (currentStep.zoomMax - 1) * zoomT;
  const blurStrength = zoomT * 8;
  const dimAlpha = zoomT * 0.55;
  const showClick =
    zoomT > 0.35 && zoomT < 0.85 && currentStep.cursorClick;

  // Funciones de control manual agregadas correctamente
  const handlePrev = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setCurrentIdx((prev) => (prev === 0 ? REAL_STEPS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setCurrentIdx((prev) => (prev === REAL_STEPS.length - 1 ? 0 : prev + 1));
  };

  const handleImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImages((prev) => {
        const next = [...prev];
        next[index] = dataUrl;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  /* ─── EXPORT VIDEO PROFESIONAL ─── */
  const generateVideoFile = async () => {
    if (images.some((x) => !x)) {
      alert("Cargá las 6 capturas reales antes de exportar el video.");
      return;
    }

    setIsRecording(true);
    setIsPlaying(false);
    setRecordingProgress(0);

    const width = 720;
    const height = 1280;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsRecording(false);
      return;
    }

    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const octx = off.getContext("2d");
    if (!octx) {
      setIsRecording(false);
      return;
    }

    const loadedImages: HTMLImageElement[] = await Promise.all(
      images.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(new Image());
            img.src = src;
          })
      )
    );

    let mimeType = "";
    const candidates = [
      "video/mp4;codecs=avc1",
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    for (const tpe of candidates) {
      if (
        typeof MediaRecorder !== "undefined" &&
        MediaRecorder.isTypeSupported(tpe)
      ) {
        mimeType = tpe;
        break;
      }
    }
    if (!mimeType) {
      alert("Tu navegador no soporta grabación de video.");
      setIsRecording(false);
      return;
    }

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8_000_000,
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nevux_cuenta_regresiva_${lang.toUpperCase()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsRecording(false);
      setRecordingProgress(100);
      setIsPlaying(true);
    };
    recorder.start(100);

    const totalDuration = REAL_STEPS.reduce((a, s) => a + s.duration, 0);
    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const elapsedTotal = now - startTime;
      setRecordingProgress(
        Math.round(Math.min(elapsedTotal / totalDuration, 1) * 100)
      );

      let acc = 0;
      let idx = 0;
      let stepTime = 0;
      for (let i = 0; i < REAL_STEPS.length; i++) {
        if (elapsedTotal < acc + REAL_STEPS[i].duration) {
          idx = i;
          stepTime = elapsedTotal - acc;
          break;
        }
        acc += REAL_STEPS[i].duration;
        if (i === REAL_STEPS.length - 1) {
          idx = i;
          stepTime = REAL_STEPS[i].duration;
        }
      }

      const step = REAL_STEPS[idx];
      const img = loadedImages[idx];
      const tt = Math.min(stepTime / step.duration, 1);
      const holdR = step.holdRatio;
      const zT = tt <= holdR ? 0 : easeInOutCubic((tt - holdR) / (1 - holdR));
      const z = 1 + (step.zoomMax - 1) * zT;
      const dim = zT * 0.6;

      // Fondo
      ctx.fillStyle = "#0b0f19";
      ctx.fillRect(0, 0, width, height);

      // Capa base
      octx.clearRect(0, 0, width, height);
      octx.fillStyle = "#0b0f19";
      octx.fillRect(0, 0, width, height);
      coverDraw(octx, img, 0, 0, width, height, 0.5, 0.5, 1.02);
      if (zT > 0.05) {
        octx.filter = `blur(${Math.min(12, zT * 14)}px)`;
        octx.drawImage(off, 0, 0);
        octx.filter = "none";
      }
      ctx.drawImage(off, 0, 0);
      ctx.fillStyle = `rgba(0,0,0,${0.25 + dim * 0.35})`;
      ctx.fillRect(0, 0, width, height);

      // Capa nítida con zoom al foco
      coverDraw(ctx, img, 0, 0, width, height, step.focusX, step.focusY, z);

      // Viñeta
      if (zT > 0.08) {
        const g = ctx.createRadialGradient(
          step.focusX * width,
          step.focusY * height,
          width * 0.12,
          step.focusX * width,
          step.focusY * height,
          width * 0.72
        );
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(0.45, "rgba(0,0,0,0)");
        g.addColorStop(1, `rgba(0,0,0,${0.35 + dim * 0.5})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Barras stories
      const barY = 36;
      const barH = 5;
      const gap = 6;
      const tw = width - 36;
      const bw = (tw - (REAL_STEPS.length - 1) * gap) / REAL_STEPS.length;
      for (let b = 0; b < REAL_STEPS.length; b++) {
        const bx = 18 + b * (bw + gap);
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        drawRoundedRect(ctx, bx, barY, bw, barH, 3);
        ctx.fill();
        let fp = 0;
        if (b < idx) fp = 1;
        if (b === idx) fp = tt;
        if (fp > 0) {
          ctx.fillStyle = "#10B981";
          drawRoundedRect(ctx, bx, barY, bw * fp, barH, 3);
          ctx.fill();
        }
      }

      // Cursor
      const cx = step.focusX * width;
      const cy = step.focusY * height;
      if (zT > 0.15 || step.cursorClick) {
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (zT > 0.4 && zT < 0.85 && step.cursorClick) {
          ctx.strokeStyle = "rgba(16,185,129,0.85)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx, cy, 26 + zT * 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Subtítulos
      const cap = lang === "es" ? step.caption.es : step.caption.pt;
      const boxY = height - 210;
      const m = 28;
      const boxW = width - m * 2;

      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, m, boxY - 34, 118, 26, 8);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("NEVUX APP", m + 59, boxY - 16);

      ctx.fillStyle = "rgba(0,0,0,0.92)";
      ctx.strokeStyle = "rgba(16,185,129,0.45)";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, m, boxY, boxW, 150, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.textAlign = "left";
      wrapText(ctx, cap, m + 16, boxY + 40, boxW - 32, 28);

      // CTA final en escena 6
      if (step.isCta && tt > 0.42) {
        const ctaA = Math.min(1, (tt - 0.42) / 0.2);
        ctx.fillStyle = `rgba(0,0,0,${0.55 * ctaA})`;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = `rgba(16,185,129,${ctaA})`;
        drawRoundedRect(ctx, 48, height / 2 - 110, width - 96, 220, 24);
        ctx.fill();
        ctx.fillStyle = `rgba(0,0,0,${ctaA})`;
        ctx.font = "bold 28px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          lang === "es" ? "Probá Nevux gratis" : "Teste o Nevux grátis",
          width / 2,
          height / 2 - 40
        );
        ctx.font = "bold 20px system-ui, sans-serif";
        ctx.fillText(
          lang === "es" ? "7 días de prueba" : "7 dias grátis",
          width / 2,
          height / 2 + 5
        );
        ctx.font = "600 18px system-ui, sans-serif";
        ctx.fillText(
          lang === "es" ? "Link en la biografía" : "Link na biografia",
          width / 2,
          height / 2 + 45
        );
        ctx.font = "700 16px system-ui, sans-serif";
        ctx.fillText("nevux.ar", width / 2, height / 2 + 78);
      }

      if (elapsedTotal < totalDuration) {
        requestAnimationFrame(renderFrame);
      } else {
        recorder.stop();
      }
    };

    requestAnimationFrame(renderFrame);
  };

  const progressPercent = Math.min(
    (elapsedTime / currentStep.duration) * 100,
    100
  );

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
              color: "#000",
              fontSize: "18px",
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800 }}>Nevux Video Studio</div>
            <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700 }}>
              ZOOM PRO + CTA · CUENTA REGRESIVA
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            background: "#111827",
            padding: "6px 12px",
            borderRadius: "12px",
            border: "1px solid #374151",
          }}
        >
          <button
            type="button"
            onClick={() => setLang("es")}
            style={{
              background: lang === "es" ? "#10B981" : "transparent",
              color: lang === "es" ? "#000" : "#9ca3af",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => setLang("pt")}
            style={{
              background: lang === "pt" ? "#10B981" : "transparent",
              color: lang === "pt" ? "#000" : "#9ca3af",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            PT-BR
          </button>
          <div style={{ width: "1px", height: "20px", background: "#374151" }} />
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>Zoom UI</span>
          <input
            type="range"
            min={50}
            max={100}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ width: "80px", accentColor: "#10B981" }}
          />
        </div>
      </div>

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
        {/* PREVIEW MÓVIL */}
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              width: "360px",
              height: "640px",
              background: "#000",
              borderRadius: "44px",
              border: "10px solid #1f2937",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.9)",
              overflow: "hidden",
              position: "relative",
            }}
          >
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

            <PointerOverlay
              x={currentStep.focusX}
              y={currentStep.focusY}
              active={showClick}
            />

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
                  <div
                    key={sc.id}
                    style={{
                      flex: 1,
                      height: "3px",
                      background: "rgba(255,255,255,0.25)",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${p}%`,
                        height: "100%",
                        background: "#10B981",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "28px",
                left: "14px",
                right: "14px",
                zIndex: 85,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#10B981",
                  color: "#000",
                  fontSize: "11px",
                  fontWeight: 900,
                  padding: "4px 10px",
                  borderRadius: "8px",
                }}
              >
                Nevux App
              </div>
              <div
                style={{
                  background: "rgba(0,0,0,0.92)",
                  border: "1.5px solid rgba(16,185,129,0.4)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 800,
                  padding: "12px 14px",
                  borderRadius: "16px",
                  lineHeight: 1.4,
                }}
              >
                {lang === "es" ? currentStep.caption.es : currentStep.caption.pt}
              </div>
            </div>

            <div
              style={{
                flex: 1,
                height: "100%",
                position: "relative",
                overflow: "hidden",
                background: "#0b0f19",
              }}
            >
              {images[currentIdx] ? (
                <>
                  <img
                    src={images[currentIdx]}
                    alt={currentStep.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: `blur(${blurStrength}px) brightness(${1 - dimAlpha * 0.3})`,
                      transform: "scale(1.06)",
                    }}
                  />
                  <img
                    src={images[currentIdx]}
                    alt=""
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: `${100 * liveZoom}%`,
                      height: `${100 * liveZoom}%`,
                      objectFit: "cover",
                      objectPosition: `${currentStep.focusX * 100}% ${currentStep.focusY * 100}%`,
                      transform: "translate(-50%, -50%)",
                      transition: isPlaying ? "none" : "all 0.3s ease",
                      boxShadow: zoomT > 0.2 ? "0 0 0 9999px rgba(0,0,0,0.35)" : "none",
                    }}
                  />
                </>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    padding: 24,
                    textAlign: "center",
                    gap: 8,
                  }}
                >
                  <Upload size={28} color="#10B981" />
                  <div style={{ color: "#fff", fontWeight: 800 }}>{currentStep.title}</div>
                  <div style={{ fontSize: 12 }}>Cargá la captura de este paso →</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTROLES */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid #1f2937",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#10B981",
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              <Video size={18} />
              Exportador Pro (Zoom + Blur + CTA)
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  background: "#1f2937",
                  border: "none",
                  color: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={18} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  flex: 1,
                  background: isPlaying ? "#f59e0b" : "#10B981",
                  color: "#000",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pausar" : "Play"}
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  background: "#1f2937",
                  border: "none",
                  color: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setElapsedTime(0);
                  setCurrentIdx(0);
                  setIsPlaying(true);
                }}
                style={{
                  background: "#1f2937",
                  border: "none",
                  color: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={generateVideoFile}
              disabled={isRecording}
              style={{
                width: "100%",
                background: isRecording
                  ? "#1f2937"
                  : "linear-gradient(135deg,#10B981,#059669)",
                color: isRecording ? "#fff" : "#000",
                border: "none",
                borderRadius: 14,
                padding: 16,
                fontWeight: 900,
                fontSize: 14,
                cursor: isRecording ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {isRecording ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Renderizando HD… {recordingProgress}%
                </>
              ) : (
                <>
                  <Download size={20} />
                  🎬 Descargar Video Pro (MP4/WebM)
                </>
              )}
            </button>
            <p
              style={{
                marginTop: 10,
                fontSize: 10,
                color: "#64748b",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Hold → zoom al botón → blur del resto → cierre con CTA 7 días gratis.
              Cargá las 6 fotos reales antes de exportar.
            </p>
          </div>

          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid #1f2937",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#9ca3af",
                marginBottom: 12,
                letterSpacing: "0.04em",
              }}
            >
              6 CAPTURAS REALES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {REAL_STEPS.map((sc, idx) => {
                const isAct = idx === currentIdx;
                const hasImg = !!images[idx];
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setElapsedTime(0);
                    }}
                    style={{
                      background: isAct ? "rgba(16,185,129,0.12)" : "rgba(0,0,0,0.3)",
                      border: isAct ? "1.5px solid #10B981" : "1px solid #1f2937",
                      borderRadius: 12,
                      padding: "10px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: isAct ? "#10B981" : "#1f2937",
                        color: isAct ? "#000" : "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {sc.id}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: isAct ? "#10B981" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {sc.title}
                        {hasImg && <CheckCircle2 size={13} color="#10B981" />}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#9ca3af",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lang === "es" ? sc.caption.es : sc.caption.pt}
                      </div>
                    </div>
                    <label
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: hasImg ? "rgba(16,185,129,0.15)" : "#1f2937",
                        color: hasImg ? "#10B981" : "#fff",
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: hasImg ? "1px solid #10B981" : "1px solid #374151",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <Upload size={12} />
                      {hasImg ? "Cambiar" : "Cargar"}
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
