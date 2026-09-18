// app/admin/marketing/reels/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Loader2,
  ChevronRight,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Layers,
  Zap,
} from "lucide-react";

/* ═══════════════════════════════════════════
   1. TIPOS Y ESTRUCTURAS DE DATOS (Regla #9)
═══════════════════════════════════════════ */
interface Caption {
  es: string;
  pt: string;
}

interface FloatingBadge {
  textEs: string;
  textPt: string;
  icon: string;
}

interface ReelScene {
  id: number;
  duration: number; // en ms
  type: "hook" | "phone_step" | "outro";
  title: string;
  caption: Caption;
  focusX: number; // 0 a 1 centro horizontal
  focusY: number; // 0 a 1 centro vertical
  zoomMax: number;
  tiltAngle: number; // grados de inclinación 3D
  floatingBadge?: FloatingBadge;
  hasScanLaser?: boolean;
}

const REEL_SCENES: ReelScene[] = [
  {
    id: 1,
    duration: 3800,
    type: "hook",
    title: "1. Hook Cinematográfico",
    caption: {
      es: "🚨 El 97% de tus visitas entra y se va sin comprar nada...",
      pt: "🚨 97% das suas visitas entra e sai sem comprar nada...",
    },
    focusX: 0.5,
    focusY: 0.5,
    zoomMax: 1.0,
    tiltAngle: 0,
  },
  {
    id: 2,
    duration: 4200,
    type: "phone_step",
    title: "2. Dashboard Nevux",
    caption: {
      es: "1️⃣ Abrí el catálogo de widgets inteligentes en tu panel",
      pt: "1️⃣ Abra o catálogo de widgets inteligentes no seu painel",
    },
    focusX: 0.5,
    focusY: 0.38,
    zoomMax: 1.6,
    tiltAngle: -2.5,
    floatingBadge: {
      textEs: "⚡ 26 Widgets Activos",
      textPt: "⚡ 26 Widgets Ativos",
      icon: "⚡",
    },
  },
  {
    id: 3,
    duration: 4500,
    type: "phone_step",
    title: "3. Activación en 1 Clic",
    caption: {
      es: "2️⃣ Elegí Cuenta Regresiva o Bundles por Cantidad",
      pt: "2️⃣ Escolha Contagem Regressiva ou Bundles por Volume",
    },
    focusX: 0.5,
    focusY: 0.76,
    zoomMax: 1.85,
    tiltAngle: 2,
    floatingBadge: {
      textEs: "+35% Ticket Promedio 📈",
      textPt: "+35% Ticket Médio 📈",
      icon: "📈",
    },
  },
  {
    id: 4,
    duration: 4500,
    type: "phone_step",
    title: "4. Modo Fechas Especiales",
    caption: {
      es: "3️⃣ Sincronizá con Hot Sale o Black Friday en 1 toque",
      pt: "3️⃣ Sincronize com Black Friday ou Liquidação em 1 toque",
    },
    focusX: 0.5,
    focusY: 0.58,
    zoomMax: 1.65,
    tiltAngle: -1.5,
    floatingBadge: {
      textEs: "🔥 7 Presets Incluidos",
      textPt: "🔥 7 Presets Incluídos",
      icon: "🔥",
    },
  },
  {
    id: 5,
    duration: 5000,
    type: "phone_step",
    title: "5. En tu Tiendanube",
    caption: {
      es: "🚀 ¡Listo! Mirá cómo explotan tus ventas y tu conversión",
      pt: "🚀 Pronto! Veja suas vendas e sua conversão dispararem",
    },
    focusX: 0.5,
    focusY: 0.52,
    zoomMax: 1.4,
    tiltAngle: 1.5,
    hasScanLaser: true,
    floatingBadge: {
      textEs: "🛡️ Compra Concretada 💰",
      textPt: "🛡️ Compra Confirmada 💰",
      icon: "💰",
    },
  },
  {
    id: 6,
    duration: 4500,
    type: "outro",
    title: "6. Cierre CTA Magnético",
    caption: {
      es: "💥 Probá Nevux GRATIS por 7 días · Link en la biografía",
      pt: "💥 Teste a Nevux GRÁTIS por 7 dias · Link na biografia",
    },
    focusX: 0.5,
    focusY: 0.5,
    zoomMax: 1.0,
    tiltAngle: 0,
  },
];

/* ═══════════════════════════════════════════
   2. HELPERS DE CANVAS (Regla #9)
═══════════════════════════════════════════ */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

function drawCoverImage(
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

/* ═══════════════════════════════════════════
   3. COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MarketingReelsPage() {
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [zoomPreview, setZoomPreview] = useState(75);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [images, setImages] = useState<string[]>(["", "", "", "", "", ""]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPt = lang === "pt";
  const currentScene = REEL_SCENES[currentIdx];

  // Control de reproducción en vivo
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const stepTime = 40;
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + stepTime;
        if (next >= currentScene.duration) {
          setCurrentIdx((i) => (i + 1) % REEL_SCENES.length);
          return 0;
        }
        return next;
      });
    }, stepTime);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, currentScene]);

  const handlePrev = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setCurrentIdx((prev) => (prev === 0 ? REEL_SCENES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setCurrentIdx((prev) => (prev === REEL_SCENES.length - 1 ? 0 : prev + 1));
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

  /* ═══════════════════════════════════════════
     MOTOR DE RENDERIZADO 3D EN CANVAS (HD 720x1280)
  ═══════════════════════════════════════════ */
  const generateVideoFile = async () => {
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

    // Canvas auxiliar para sombras y blur
    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;
    const octx = offCanvas.getContext("2d");
    if (!octx) {
      setIsRecording(false);
      return;
    }

    // Carga de imágenes (Regla #14 Genéricos explícitos)
    const loadedImages: HTMLImageElement[] = await Promise.all(
      images.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve) => {
            if (!src) {
              resolve(new Image());
              return;
            }
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
      alert("Tu navegador no soporta grabación directa de video.");
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
      a.download = `nevux_reel_3d_pro_${lang.toUpperCase()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsRecording(false);
      setRecordingProgress(100);
      setIsPlaying(true);
    };
    recorder.start(100);

    const totalDuration = REEL_SCENES.reduce((a, s) => a + s.duration, 0);
    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const elapsedTotal = now - startTime;
      setRecordingProgress(
        Math.round(Math.min(elapsedTotal / totalDuration, 1) * 100)
      );

      let acc = 0;
      let idx = 0;
      let sceneTime = 0;
      for (let i = 0; i < REEL_SCENES.length; i++) {
        if (elapsedTotal < acc + REEL_SCENES[i].duration) {
          idx = i;
          sceneTime = elapsedTotal - acc;
          break;
        }
        acc += REEL_SCENES[i].duration;
        if (i === REEL_SCENES.length - 1) {
          idx = i;
          sceneTime = REEL_SCENES[i].duration;
        }
      }

      const scene = REEL_SCENES[idx];
      const img = loadedImages[idx];
      const progress = Math.min(sceneTime / scene.duration, 1);
      const easeT = easeInOutCubic(progress);

      // ─── 1. FONDO ESTUDIO OSCURO PROFUNDO ───
      ctx.fillStyle = "#060913";
      ctx.fillRect(0, 0, width, height);

      // Rejilla tecnológica animada
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      const gridOffset = (sceneTime * 0.02) % 40;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridOffset; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Halo verde esmeralda central
      const haloGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.45,
        400
      );
      haloGrad.addColorStop(0, "rgba(16, 185, 129, 0.18)");
      haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.45, 400, 0, Math.PI * 2);
      ctx.fill();

      // ─── 2. RENDERIZADO SEGÚN TIPO DE ESCENA ───

      if (scene.type === "hook") {
        // 🚨 ACTO 1: GANCHO CINEMATOGRÁFICO
        const leftW = width / 2;

        // Mitad Izquierda: Frustración / Rojo
        const redGrad = ctx.createLinearGradient(0, 0, leftW, height);
        redGrad.addColorStop(0, "rgba(239, 68, 68, 0.15)");
        redGrad.addColorStop(1, "rgba(9, 13, 22, 0.95)");
        ctx.fillStyle = redGrad;
        ctx.fillRect(0, 0, leftW, height);

        // Mitad Derecha: Éxito / Verde Esmeralda
        const greenGrad = ctx.createLinearGradient(leftW, 0, width, height);
        greenGrad.addColorStop(0, "rgba(16, 185, 129, 0.2)");
        greenGrad.addColorStop(1, "rgba(9, 13, 22, 0.95)");
        ctx.fillStyle = greenGrad;
        ctx.fillRect(leftW, 0, leftW, height);

        // Divisor central brillante
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(leftW, 120);
        ctx.lineTo(leftW, height - 240);
        ctx.stroke();

        // Iconos y métricas de impacto
        ctx.font = "900 64px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("👀", leftW / 2, height / 2 - 80);
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("10.000 VISITAS", leftW / 2, height / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 24px sans-serif";
        ctx.fillText("$0 VENTAS 😢", leftW / 2, height / 2 + 40);

        ctx.fillStyle = "#10B981";
        ctx.font = "900 64px sans-serif";
        ctx.fillText("💰", leftW + leftW / 2, height / 2 - 80);
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("VENTAS x3", leftW + leftW / 2, height / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 24px sans-serif";
        ctx.fillText("CON NEVUX 🔥", leftW + leftW / 2, height / 2 + 40);

        // Sticker superior gigante
        const stickW = width - 60;
        const stickH = 130;
        const stickX = 30;
        const stickY = 160;

        ctx.fillStyle = "#10B981";
        drawRoundedRect(ctx, stickX, stickY, stickW, stickH, 24);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.font = "950 24px sans-serif";
        ctx.fillText(
          isPt ? "¿SUA LOJA TEM VISITAS MAS NÃO VENDE?" : "¿TENÉS VISITAS PERO NO VENTAS?",
          width / 2,
          stickY + 50
        );
        ctx.font = "900 20px sans-serif";
        ctx.fillText(
          isPt ? "O segredo está no Checkout 👀" : "El secreto está en el Checkout 👀",
          width / 2,
          stickY + 92
        );
      } else if (scene.type === "phone_step") {
        // 📱 ACTO 2: SMARTPHONE 3D FLOTANTE
        const phoneW = 380;
        const phoneH = 760;
        const phoneX = (width - phoneW) / 2;
        const phoneY = 120;

        // Dinámica de cámara y zoom
        const liveZoom = 1 + (scene.zoomMax - 1) * easeT;
        const tilt = scene.tiltAngle * Math.sin(progress * Math.PI);

        ctx.save();
        ctx.translate(width / 2, phoneY + phoneH / 2);
        ctx.rotate((tilt * Math.PI) / 180);
        ctx.translate(-width / 2, -(phoneY + phoneH / 2));

        // Sombra de estudio 3D
        ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
        ctx.shadowBlur = 45;
        ctx.shadowOffsetY = 25;

        // Chasis del teléfono (Titanio oscuro)
        ctx.fillStyle = "#1a1f2c";
        drawRoundedRect(ctx, phoneX - 10, phoneY - 10, phoneW + 20, phoneH + 20, 52);
        ctx.fill();

        // Borde exterior metálico
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowColor = "transparent";

        // Pantalla interior
        ctx.save();
        drawRoundedRect(ctx, phoneX, phoneY, phoneW, phoneH, 44);
        ctx.clip();

        // Fondo de pantalla del celular
        ctx.fillStyle = "#090d16";
        ctx.fillRect(phoneX, phoneY, phoneW, phoneH);

        // Renderizado de captura con zoom al foco
        if (img.width && img.height) {
          drawCoverImage(
            ctx,
            img,
            phoneX,
            phoneY,
            phoneW,
            phoneH,
            scene.focusX,
            scene.focusY,
            liveZoom
          );
        } else {
          // Placeholder demostrativo si no subió foto
          ctx.fillStyle = "#111827";
          ctx.fillRect(phoneX, phoneY, phoneW, phoneH);
          ctx.fillStyle = "#10B981";
          ctx.font = "bold 20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(scene.title, phoneX + phoneW / 2, phoneY + phoneH / 2);
          ctx.fillStyle = "#9ca3af";
          ctx.font = "14px sans-serif";
          ctx.fillText("Cargá la captura en el panel", phoneX + phoneW / 2, phoneY + phoneH / 2 + 30);
        }

        // Láser de Escaneo de Alta Conversión
        if (scene.hasScanLaser) {
          const laserY = phoneY + phoneH * progress;
          const laserGrad = ctx.createLinearGradient(phoneX, laserY, phoneX + phoneW, laserY);
          laserGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
          laserGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.95)");
          laserGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
          ctx.fillStyle = laserGrad;
          ctx.fillRect(phoneX, laserY - 3, phoneW, 6);
        }

        // Dynamic Island
        ctx.fillStyle = "#000000";
        drawRoundedRect(ctx, phoneX + phoneW / 2 - 55, phoneY + 12, 110, 24, 12);
        ctx.fill();

        ctx.restore(); // fin clip pantalla

        // Píldora Holográfica Flotante
        if (scene.floatingBadge && progress > 0.25) {
          const badgeA = Math.min(1, (progress - 0.25) / 0.2);
          const badgeText = isPt ? scene.floatingBadge.textPt : scene.floatingBadge.textEs;

          const bw = 240;
          const bh = 54;
          const bx = phoneX + (phoneW - bw) / 2;
          const by = phoneY + phoneH * 0.65;

          ctx.fillStyle = `rgba(0, 0, 0, ${0.9 * badgeA})`;
          ctx.strokeStyle = `rgba(16, 185, 129, ${badgeA})`;
          ctx.lineWidth = 2.5;
          drawRoundedRect(ctx, bx, by, bw, bh, 27);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = `rgba(16, 185, 129, ${badgeA})`;
          ctx.font = "950 16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(badgeText, bx + bw / 2, by + 34);
        }

        ctx.restore(); // fin rotación 3D
      } else {
        // 🏁 ACTO 3: CIERRE CTA MAGNÉTICO
        const cardW = width - 60;
        const cardH = 460;
        const cardX = 30;
        const cardY = (height - cardH) / 2 - 40;

        ctx.fillStyle = "#10B981";
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Isotipo Nevux 3D
        const logoSize = 70;
        const logoX = (width - logoSize) / 2;
        const logoY = cardY + 45;

        ctx.fillStyle = "#000000";
        drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 20);
        ctx.fill();

        ctx.fillStyle = "#10B981";
        ctx.font = "950 40px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N", logoX + logoSize / 2, logoY + logoSize / 2 + 2);

        // Título del CTA
        ctx.fillStyle = "#000000";
        ctx.font = "950 32px sans-serif";
        ctx.textBaseline = "top";
        wrapText(
          ctx,
          isPt ? "Teste o Nevux GRÁTIS por 7 dias 🚀" : "Probá Nevux GRATIS por 7 días 🚀",
          width / 2,
          cardY + 145,
          cardW - 40,
          40
        );

        ctx.font = "bold 20px sans-serif";
        ctx.fillText(
          isPt ? "Instalação em 1 clique na Nuvemshop" : "Instalación en 1 clic para Tiendanube",
          width / 2,
          cardY + 285
        );

        // Botón visual "Link en Bio"
        const btnW = cardW - 80;
        const btnH = 64;
        const btnX = cardX + 40;
        const btnY = cardY + 345;

        ctx.fillStyle = "#000000";
        drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 32);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "950 20px sans-serif";
        ctx.fillText(
          isPt ? "👉 LINK NA BIOGRAFIA 👈" : "👉 LINK EN LA BIOGRAFÍA 👈",
          width / 2,
          btnY + 24
        );
      }

      // ─── 3. BARRAS DE PROGRESO TIPO STORIES (ARRIBA) ───
      const barY = 40;
      const barH = 5;
      const gap = 8;
      const totalW = width - 48;
      const barW = (totalW - (REEL_SCENES.length - 1) * gap) / REEL_SCENES.length;

      for (let b = 0; b < REEL_SCENES.length; b++) {
        const bx = 24 + b * (barW + gap);
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        drawRoundedRect(ctx, bx, barY, barW, barH, 3);
        ctx.fill();

        let fillP = 0;
        if (b < idx) fillP = 1;
        if (b === idx) fillP = progress;

        if (fillP > 0) {
          ctx.fillStyle = "#10B981";
          drawRoundedRect(ctx, bx, barY, barW * fillP, barH, 3);
          ctx.fill();
        }
      }

      // ─── 4. SUBTÍTULO PROFESIONAL ESTILO CAPCUT (ABAJO) ───
      const subBoxY = height - 190;
      const subBoxW = width - 48;
      const subBoxH = 130;
      const subBoxX = 24;

      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, subBoxX, subBoxY, subBoxW, subBoxH, 20);
      ctx.fill();
      ctx.stroke();

      // Badge Nevux App
      ctx.fillStyle = "#10B981";
      drawRoundedRect(ctx, subBoxX + 16, subBoxY - 15, 120, 28, 8);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "900 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("NEVUX MOTION", subBoxX + 76, subBoxY - 1);

      // Texto del subtítulo
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 22px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      const capText = isPt ? scene.caption.pt : scene.caption.es;
      wrapText(ctx, capText, subBoxX + 18, subBoxY + 26, subBoxW - 36, 28);

      // Siguiente cuadro
      if (elapsedTotal < totalDuration) {
        requestAnimationFrame(renderFrame);
      } else {
        recorder.stop();
      }
    };

    requestAnimationFrame(renderFrame);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#060913",
        color: "#ffffff",
        padding: "24px 16px 100px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* HEADER CONTROLES */}
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
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 950,
              color: "#000",
              fontSize: "20px",
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 900 }}>Nevux 3D Motion Studio</div>
            <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700 }}>
              iPhone 16 Pro 3D · Motion Graphics · Exportador HD
            </div>
          </div>
        </div>

        {/* SELECTOR IDIOMA Y ZOOM */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "6px 14px",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            type="button"
            onClick={() => setLang("es")}
            style={{
              background: !isPt ? "#10B981" : "transparent",
              color: !isPt ? "#000" : "#9ca3af",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            🇦🇷 Español
          </button>
          <button
            type="button"
            onClick={() => setLang("pt")}
            style={{
              background: isPt ? "#10B981" : "transparent",
              color: isPt ? "#000" : "#9ca3af",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            🇧🇷 Português
          </button>
        </div>
      </div>

      {/* ÁREA DE TRABAJO */}
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
        {/* PREVIEW EN VIVO DEL REEL */}
        <div
          style={{
            transform: `scale(${zoomPreview / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              width: "360px",
              height: "640px",
              background: "#060913",
              borderRadius: "44px",
              border: "10px solid #1f2937",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 30px rgba(16, 185, 129, 0.2)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Dynamic Island Notch */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "110px",
                height: "22px",
                background: "#000",
                borderRadius: "12px",
                zIndex: 90,
              }}
            />

            {/* Contenido Visual en Vivo */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                {currentScene.type === "hook" ? "🚨" : currentScene.type === "outro" ? "🚀" : "📱"}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#10B981", marginBottom: "6px" }}>
                {currentScene.title}
              </div>
              <div style={{ fontSize: "12px", color: "#d1fae5", lineHeight: 1.4 }}>
                {isPt ? currentScene.caption.pt : currentScene.caption.es}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DE CONTROL Y CARGA DE CAPTURAS */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Botones de Acción */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#10B981",
                fontWeight: 800,
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              <Zap size={18} />
              Exportador 3D Motion Pro (720x1280 @ 30fps)
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "12px",
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
                  borderRadius: "12px",
                  fontWeight: 900,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pausar" : "Reproducir"}
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "12px",
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
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* BOTÓN DESCARGAR VIDEO PRO */}
            <button
              type="button"
              onClick={generateVideoFile}
              disabled={isRecording}
              style={{
                width: "100%",
                background: isRecording
                  ? "#1f2937"
                  : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: isRecording ? "#9ca3af" : "#000000",
                border: "none",
                borderRadius: "16px",
                padding: "18px",
                fontWeight: 950,
                fontSize: "15px",
                cursor: isRecording ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)",
              }}
            >
              {isRecording ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  <span>Renderizando Video 3D HD… {recordingProgress}%</span>
                </>
              ) : (
                <>
                  <Download size={22} />
                  <span>🎬 Descargar Video 3D Listo (MP4/WebM)</span>
                </>
              )}
            </button>
          </div>

          {/* LISTA DE CAPTURAS */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#10B981",
                marginBottom: "12px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Escenas del Reel (Opcional: Cargar tus capturas)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {REEL_SCENES.map((sc, idx) => {
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
                      background: isAct ? "rgba(16, 185, 129, 0.12)" : "rgba(0, 0, 0, 0.3)",
                      border: isAct ? "1.5px solid #10B981" : "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "14px",
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: isAct ? "#10B981" : "rgba(255, 255, 255, 0.1)",
                        color: isAct ? "#000" : "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {sc.id}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: isAct ? "#10B981" : "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span>{sc.title}</span>
                        {hasImg && <CheckCircle2 size={13} color="#10B981" />}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#9ca3af",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isPt ? sc.caption.pt : sc.caption.es}
                      </div>
                    </div>

                    {sc.type === "phone_step" && (
                      <label
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: hasImg ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.08)",
                          color: hasImg ? "#10B981" : "#ffffff",
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "6px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border: hasImg ? "1px solid #10B981" : "1px solid rgba(255, 255, 255, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          flexShrink: 0,
                        }}
                      >
                        <Upload size={12} />
                        <span>{hasImg ? "Cambiar" : "Cargar"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(idx, e)}
                        />
                      </label>
                    )}
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
