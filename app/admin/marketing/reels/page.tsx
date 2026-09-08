"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Smartphone, 
  Sparkles, CheckCircle2, ChevronRight, Store, ArrowLeft,
  MousePointer, Percent, Flame, Calendar, Clock, ShoppingCart
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

/* ═══════════════════════════════════════════
   1. TYPES & INTERFACES (Regla #9)
   ═══════════════════════════════════════════ */
interface Caption {
  es: string;
  pt: string;
}

interface Scene {
  id: number;
  duration: number; // en milisegundos
  title: string;
  captions: Caption;
  cursor: {
    x: string; // % en horizontal
    y: string; // % en vertical
    click: boolean;
  };
}

/* ═══════════════════════════════════════════
   2. CONSTANTES DE ESCENAS & CAPTIONS (TikTok Style)
   ═══════════════════════════════════════════ */
const SCENES: Scene[] = [
  {
    id: 1,
    duration: 3800,
    title: "Dashboard Nevux",
    captions: {
      es: "🔥 ¿Querés duplicar las ventas de tu Tiendanube? Mirá esto...",
      pt: "🔥 Quer duplicar as vendas da sua Nuvemshop? Olha só..."
    },
    cursor: { x: "82%", y: "24%", click: true }
  },
  {
    id: 2,
    duration: 3800,
    title: "Modal de Creación",
    captions: {
      es: "1️⃣ Tocá en Crear Widget y elegí aplicarlo a Todos tus Productos",
      pt: "1️⃣ Toque em Criar Widget e escolha Todos os Produtos"
    },
    cursor: { x: "50%", y: "65%", click: true }
  },
  {
    id: 3,
    duration: 3500,
    title: "Selección de Widget",
    captions: {
      es: "2️⃣ Elegí la Cuenta Regresiva para activar máxima urgencia ⏰",
      pt: "2️⃣ Escolha o Contador Regressivo para ativar urgência máxima ⏰"
    },
    cursor: { x: "32%", y: "30%", click: true }
  },
  {
    id: 4,
    duration: 5000,
    title: "Editor de Widget",
    captions: {
      es: "3️⃣ Personalizá el estilo, activá el Modo Urgencia y guardá cambios 🎨",
      pt: "3️⃣ Customize o estilo, ative o Modo Urgência e salve 🎨"
    },
    cursor: { x: "85%", y: "93%", click: true }
  },
  {
    id: 5,
    duration: 6000,
    title: "Render en Tienda Real",
    captions: {
      es: "🚀 ¡Listo! El widget ya está vendiendo por vos en vivo. ¡Aumentá tu ticket ya!",
      pt: "🚀 Pronto! O widget já está vendendo ao vivo por você. Fature mais hoje!"
    },
    cursor: { x: "50%", y: "85%", click: false }
  }
];

/* ═══════════════════════════════════════════
   3. SUB-COMPONENTES AUXILIARES DE RENDERIZADO (Regla #9)
   ═══════════════════════════════════════════ */

// Simulación de Ticking para la Cuenta Regresiva Real
const MockTimer = () => {
  const [seconds, setSeconds] = useState(59);
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
    <div className="flex gap-1 items-center font-mono">
      <div className="bg-[#10B981] text-white px-2 py-1 rounded text-sm font-bold shadow-sm">00d</div>
      <span className="text-white text-xs font-bold">:</span>
      <div className="bg-[#10B981] text-white px-2 py-1 rounded text-sm font-bold shadow-sm">12h</div>
      <span className="text-white text-xs font-bold">:</span>
      <div className="bg-[#10B981] text-white px-2 py-1 rounded text-sm font-bold shadow-sm">{pad(minutes)}m</div>
      <span className="text-white text-xs font-bold">:</span>
      <div className="bg-[#10B981] text-white px-2 py-1 rounded text-sm font-bold shadow-sm animate-pulse">{pad(seconds)}s</div>
    </div>
  );
};

// Cursor Virtual con click y pulsación animada
const SimulatedPointer = ({ x, y, active }: { x: string; y: string; active: boolean }) => (
  <motion.div
    animate={{ x, y }}
    transition={{ type: "spring", stiffness: 70, damping: 15 }}
    className="absolute pointer-events-none z-50 transform -translate-x-2 -translate-y-2"
    style={{ left: 0, top: 0 }}
  >
    <MousePointer className="text-black fill-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" size={24} />
    {active && (
      <span className="absolute top-0 left-0 w-8 h-8 bg-[#10B981]/40 rounded-full -translate-x-1/3 -translate-y-1/3 animate-ping" />
    )}
  </motion.div>
);

/* ═══════════════════════════════════════════
   4. COMPONENTE PRINCIPAL (ReelsPage)
   ═══════════════════════════════════════════ */
export default function ReelsPage() {
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(90); // Control de zoom para captura móvil
  const [soundActive, setSoundActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentScene = SCENES[currentSceneIdx];

  // Reproducción de Escenas secuenciales
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalStep = 100;
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = prev + intervalStep;
        if (nextTime >= currentScene.duration) {
          // Saltar a la siguiente escena
          setCurrentSceneIdx((prevIdx) => (prevIdx + 1) % SCENES.length);
          return 0;
        }
        return nextTime;
      });
    }, intervalStep);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSceneIdx, currentScene]);

  const handleNext = () => {
    setCurrentTime(0);
    setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
  };

  const handlePrev = () => {
    setCurrentTime(0);
    setCurrentSceneIdx((prev) => (prev === 0 ? SCENES.length - 1 : prev - 1));
  };

  const handleReset = () => {
    setCurrentTime(0);
    setCurrentSceneIdx(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center p-4 lg:p-8 select-none">
      
      {/* HEADER CONTROL CENTRAL */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <NevuxLogo size="medium" />
          <span className="bg-gradient-to-r from-[#10B981] to-emerald-400 text-black text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Reel Studio v2
          </span>
        </div>

        {/* CONTROLES GLOBALES */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-900/95 p-2 rounded-xl border border-gray-800">
          {/* Idioma */}
          <div className="flex gap-1 border-r border-gray-800 pr-3">
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                lang === "es" ? "bg-[#10B981] text-black" : "hover:bg-gray-800 text-gray-400"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLang("pt")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                lang === "pt" ? "bg-[#10B981] text-black" : "hover:bg-gray-800 text-gray-400"
              }`}
            >
              PT-BR
            </button>
          </div>

          {/* Zoom Control */}
          <div className="flex items-center gap-2 border-r border-gray-800 pr-3">
            <span className="text-xs text-gray-400">Zoom:</span>
            <input
              type="range"
              min="50"
              max="100"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-20 accent-[#10B981]"
            />
            <span className="text-xs font-mono">{zoom}%</span>
          </div>

          {/* Audio Simulator */}
          <button
            onClick={() => setSoundActive(!soundActive)}
            className={`p-1.5 rounded-lg transition-colors ${
              soundActive ? "text-[#10B981] bg-[#10B981]/10" : "text-gray-500 hover:bg-gray-800"
            }`}
          >
            {soundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* DISEÑO EN DOS COLUMNAS (REEL PREVIEW & TIMELINE CONTROLS) */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: INSTAGRAM REEL PREVIEW FRAME (9:16) */}
        <div className="lg:col-span-5 flex justify-center">
          <div 
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className="relative w-[360px] h-[640px] bg-black rounded-[40px] border-8 border-gray-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-300"
          >
            
            {/* BARRA SUPERIOR DE LA PANTALLA MÓVIL */}
            <div className="absolute top-0 inset-x-0 h-7 bg-black/40 backdrop-blur-md z-40 flex justify-between items-center px-6">
              <span className="text-[10px] font-bold">9:41</span>
              <div className="w-20 h-4 bg-black rounded-full" /> {/* Notch */}
              <div className="flex gap-1 items-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full scale-75" />
                <div className="w-3.5 h-2.5 bg-white rounded-sm scale-75" />
              </div>
            </div>

            {/* CURSOR VIRTUAL ANIMADO */}
            <SimulatedPointer 
              x={currentScene.cursor.x} 
              y={currentScene.cursor.y} 
              active={currentTime > 1000 && currentTime < 2200 && currentScene.cursor.click} 
            />

            {/* CAPTIONS FLOTANTES ESTILO TIKTOK (Ubicación visual central-baja) */}
            <div className="absolute bottom-16 inset-x-4 z-40 pointer-events-none flex flex-col gap-2">
              <div className="bg-[#10B981] text-black text-xs font-black px-3 py-1 rounded-md self-start uppercase tracking-wider shadow-lg">
                Nevux App
              </div>
              <div className="bg-black/85 border border-emerald-500/30 text-white font-extrabold text-sm p-3.5 rounded-2xl shadow-2xl backdrop-blur-sm leading-snug">
                {lang === "es" ? currentScene.captions.es : currentScene.captions.pt}
              </div>
            </div>

            {/* BARRA DE PROGRESO DE LA ESCENA ACTUAL (SUPERIOR) */}
            <div className="absolute top-8 inset-x-4 z-40 flex gap-1">
              {SCENES.map((sc, idx) => {
                let progress = 0;
                if (idx < currentSceneIdx) progress = 100;
                if (idx === currentSceneIdx) progress = (currentTime / sc.duration) * 100;
                return (
                  <div key={sc.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#10B981]" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                );
              })}
            </div>

            {/* ONDAS DE SONIDO ESTILO MÚSICA TIKTOK CORRIENDO */}
            {soundActive && (
              <div className="absolute top-12 right-4 z-40 flex items-end gap-0.5 h-4">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-0.5 bg-[#10B981] rounded-full animate-bounce" 
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "0.6s"
                    }} 
                  />
                ))}
              </div>
            )}

            {/* CONTENIDOS DINÁMICOS DE LAS ESCENAS (FLUJO REAL) */}
            <div className="w-full h-full pt-8 pb-4 px-4 bg-[#0d1117] flex flex-col relative">

              {/* ESCENA 1: EL DASHBOARD DE NEVUX COMPLETO */}
              {currentSceneIdx === 0 && (
                <div className="flex-1 flex flex-col pt-4">
                  {/* Navbar Nevux */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-[#10B981] font-black text-sm">NEVUX</span>
                    <span className="text-[10px] bg-emerald-500/10 text-[#10B981] px-2 py-0.5 rounded-full font-bold">Store Active</span>
                  </div>

                  {/* Panel de Bienvenida */}
                  <div className="mt-4 p-3 bg-gray-900 border border-gray-800 rounded-xl">
                    <span className="text-[10px] text-gray-400 block">Hola Rodrigo,</span>
                    <span className="text-xs font-bold text-white">¡Tu tienda está despegando! 🚀</span>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-gray-900 p-2.5 rounded-xl border border-gray-800">
                      <span className="text-[9px] text-gray-400 block">Widgets Activos</span>
                      <span className="text-sm font-bold text-[#10B981]">0 widgets</span>
                    </div>
                    <div className="bg-gray-900 p-2.5 rounded-xl border border-[#10B981]/20">
                      <span className="text-[9px] text-gray-400 block">Facturado Extra</span>
                      <span className="text-sm font-extrabold text-white">$0.00</span>
                    </div>
                  </div>

                  {/* Estado vacío con CTA Brillante */}
                  <div className="mt-4 flex-1 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-2">
                      <Store className="text-[#10B981]" size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-white mb-1">No tenés widgets activos</span>
                    <p className="text-[9px] text-gray-400 mb-4 max-w-[180px]">Activá tu primer optimizador y mirá las conversiones subir.</p>
                    
                    {/* BOTÓN REAL "+ CREAR WIDGET" */}
                    <div className={`w-full max-w-[200px] bg-[#10B981] text-black text-xs font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-1 shadow-lg transition-all ${currentTime > 1500 ? 'scale-95 bg-emerald-400 shadow-none' : ''}`}>
                      <Sparkles size={12} />
                      Crear widget
                    </div>
                  </div>
                </div>
              )}

              {/* ESCENA 2: MODAL "CREAR NUEVO WIDGET" DESPLEGADO */}
              {currentSceneIdx === 1 && (
                <div className="flex-1 flex flex-col justify-end pt-4 bg-black/60 -mx-4 px-4 pb-4">
                  
                  {/* Contenido Simulado de Fondo del Dashboard */}
                  <div className="absolute inset-x-4 top-12 opacity-20 pointer-events-none">
                    <div className="h-10 bg-gray-800 rounded-md mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-12 bg-gray-800 rounded-md" />
                      <div className="h-12 bg-gray-800 rounded-md" />
                    </div>
                  </div>

                  {/* EL MODAL REAL DE NEVUX */}
                  <div className="bg-white rounded-3xl p-4 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-black">Crear nuevo widget</span>
                      <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-black text-[9px]">✕</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-3">¿Qué tipo de widget querés crear?</p>

                    <div className="flex flex-col gap-2">
                      {/* Opción A */}
                      <div className="p-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 opacity-50">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Percent className="text-emerald-500" size={14} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-[10px] font-bold text-black">Widget para un producto</div>
                        </div>
                      </div>

                      {/* Opción B: Todos los productos (Seleccionado por Pointer) */}
                      <div className={`p-2.5 rounded-xl flex items-center gap-2 border-2 transition-all ${
                        currentTime > 1500 ? "bg-emerald-50 border-[#10B981]" : "bg-white border-gray-200"
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          currentTime > 1500 ? "bg-[#10B981] text-white" : "bg-black text-white"
                        }`}>
                          <Store size={14} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-[10px] font-bold text-black">Widget para todos los productos</div>
                          <div className="text-[8px] text-gray-500">Aparece en toda tu tienda</div>
                        </div>
                        <ChevronRight className="text-gray-400" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ESCENA 3: SELECCIÓN DE "CUENTA REGRESIVA" */}
              {currentSceneIdx === 2 && (
                <div className="flex-1 flex flex-col pt-4">
                  <div className="flex items-center gap-1.5 py-2 border-b border-gray-800 text-gray-400">
                    <ArrowLeft size={12} />
                    <span className="text-[10px] font-bold uppercase">Volver al dashboard</span>
                  </div>

                  <h3 className="text-xs font-extrabold mt-3 text-white">Elegí tu Widget de Conversión:</h3>
                  
                  {/* Grid de Widgets de Nevux */}
                  <div className="grid grid-cols-2 gap-2 mt-3 overflow-y-auto max-h-[360px] pr-1">
                    
                    {/* Widget 1: Cuenta Regresiva (En Foco) */}
                    <div className={`p-2.5 rounded-xl border transition-all text-left flex flex-col gap-1.5 ${
                      currentTime > 1200 ? "border-[#10B981] bg-[#10B981]/10" : "border-gray-800 bg-gray-900"
                    }`}>
                      <div className="w-7 h-7 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                        <Clock className="text-[#10B981]" size={14} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white">Cuenta Regresiva</div>
                        <span className="text-[8px] text-[#10B981] block">Urgencia Máxima 🔥</span>
                      </div>
                    </div>

                    {/* Otros widgets desvanecidos */}
                    <div className="p-2.5 rounded-xl border border-gray-800 bg-gray-900 opacity-40 text-left">
                      <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center mb-1.5">
                        <Percent size={14} />
                      </div>
                      <div className="text-[10px] font-bold">Badge Cuotas</div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-gray-800 bg-gray-900 opacity-40 text-left">
                      <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center mb-1.5">
                        <Store size={14} />
                      </div>
                      <div className="text-[10px] font-bold">Banner Deslizante</div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-gray-800 bg-gray-900 opacity-40 text-left">
                      <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center mb-1.5">
                        <Sparkles size={14} />
                      </div>
                      <div className="text-[10px] font-bold">Vendedor IA</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ESCENA 4: EL EDITOR REAL CON SECCIONES GENERAL, UBICACIÓN Y ESTILOS */}
              {currentSceneIdx === 3 && (
                <div className="flex-1 flex flex-col pt-4 text-left overflow-hidden">
                  <div className="flex items-center justify-between py-1 border-b border-gray-800">
                    <span className="text-[10px] font-bold text-gray-400">Editor: Cuenta Regresiva</span>
                    <span className="text-[9px] bg-emerald-500/20 text-[#10B981] px-1.5 py-0.5 rounded font-bold">Activo</span>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-800 mt-2 text-center">
                    <span className="flex-1 text-[9px] font-bold text-[#10B981] border-b-2 border-[#10B981] pb-1">Ubicación</span>
                    <span className="flex-1 text-[9px] text-gray-500 pb-1">Estilos</span>
                    <span className="flex-1 text-[9px] text-gray-500 pb-1">General</span>
                  </div>

                  {/* Campos de Input Simulados */}
                  <div className="mt-3 space-y-2.5 flex-1">
                    <div>
                      <span className="text-[8px] font-bold text-gray-400 block mb-1">Título de Urgencia:</span>
                      <input 
                        type="text" 
                        readOnly 
                        value="¡Oferta de Lanzamiento termina en! 🔥" 
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[10px] text-white" 
                      />
                    </div>

                    {/* Ubicaciones */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-gray-400 block">Posición en Ficha de Producto:</span>
                      <label className="flex items-center gap-1.5 p-1.5 rounded bg-gray-900 border border-gray-800">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] flex items-center justify-center scale-90" />
                        <span className="text-[9px] text-white">Antes del Botón de Compra</span>
                      </label>
                      <label className="flex items-center gap-1.5 p-1.5 rounded opacity-40">
                        <div className="w-2.5 h-2.5 rounded-full border border-gray-600" />
                        <span className="text-[9px]">Antes del Título</span>
                      </label>
                    </div>

                    {/* Switch Modo Urgencia */}
                    <div className="flex items-center justify-between p-2 bg-[#10B981]/10 rounded-lg border border-[#10B981]/30">
                      <div>
                        <span className="text-[9px] font-bold text-white block">Activar Modo Urgencia ⚡</span>
                        <span className="text-[7px] text-gray-400">Color cambia dinámicamente</span>
                      </div>
                      <div className="w-7 h-4 bg-[#10B981] rounded-full p-0.5 flex justify-end">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* BOTÓN GUARDAR CAMBIOS */}
                  <div className={`mt-auto w-full text-center text-xs font-black py-2 rounded-xl transition-all ${
                    currentTime > 3000 ? "bg-[#059669] text-white" : "bg-[#10B981] text-black"
                  }`}>
                    {currentTime > 3000 ? "✓ Guardado Exitosamente" : "Guardar cambios"}
                  </div>
                </div>
              )}

              {/* ESCENA 5: RENDER EN TIENDA DE COMERCIANTE REAL */}
              {currentSceneIdx === 4 && (
                <div className="flex-1 flex flex-col pt-4 text-left">
                  {/* Header Tienda */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-xs font-bold tracking-wider">CHROME CLONE STORE</span>
                    <span className="text-[10px] text-gray-400">🛒 (2)</span>
                  </div>

                  {/* Imagen y Detalle de Producto */}
                  <div className="mt-3 flex gap-3 items-start">
                    <div className="w-20 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-800 flex items-center justify-center text-gray-600 relative overflow-hidden">
                      <ShoppingCart size={24} />
                      <div className="absolute top-1 left-1 bg-red-500 text-[6px] font-bold text-white px-1.5 py-0.5 rounded-full uppercase">
                        -40% OFF
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <span className="text-[8px] text-gray-400 block">REMERAS PREMIUM</span>
                      <h4 className="text-xs font-bold text-white leading-tight">Remera Oversized Hoodie Premium</h4>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-[#10B981]">$14.999</span>
                        <span className="text-[9px] text-gray-500 line-through">$24.999</span>
                      </div>
                      <span className="text-[8px] text-gray-400 block mt-1">💳 3 Cuotas sin interés de $4.999</span>
                    </div>
                  </div>

                  {/* EL WIDGET DE NEVUX RENDERIZADO EN VIVO (Ubicación: Antes del Botón) */}
                  <div className="mt-4 p-3 bg-black border border-[#10B981]/40 rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.15)] flex flex-col gap-1.5 items-center text-center relative overflow-hidden animate-pulse">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent" />
                    <span className="text-[10px] font-black text-white tracking-wide uppercase flex items-center gap-1 animate-bounce">
                      ⚡ ¡Oferta por tiempo limitado! termina en:
                    </span>
                    
                    {/* Reloj dinámico ticking */}
                    <MockTimer />
                  </div>

                  {/* Botón Comprar Real */}
                  <div className="mt-3 w-full bg-[#10B981] hover:bg-emerald-400 text-black text-center py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5">
                    <ShoppingCart size={13} />
                    Agregar al carrito
                  </div>

                  <span className="text-[7px] text-center text-gray-500 mt-2 block">🔒 Compra 100% segura provista por Tiendanube</span>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PANALES DE CONTROL DE LA REPRODUCCIÓN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CONTROLADOR DE REPRODUCCIÓN */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-[#10B981]">
              <Smartphone size={20} />
              Controles del Simulador
            </h2>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handlePrev}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                title="Escena Anterior"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 px-6 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all ${
                  isPlaying ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-[#10B981] text-black hover:bg-emerald-400"
                }`}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? "Pausar Simulación" : "Reproducir Automático"}
              </button>

              <button
                onClick={handleNext}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                title="Siguiente Escena"
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={handleReset}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                title="Reiniciar Reel"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* BARRA DE TIEMPO / LÍNEA DE TIEMPO SENSORIAL */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Escena Activa: {currentSceneIdx + 1} / {SCENES.length}</span>
                <span>{(currentTime / 1000).toFixed(1)}s / {(currentScene.duration / 1000).toFixed(1)}s</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400" 
                  style={{ width: `${(currentTime / currentScene.duration) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* LISTA DE PASOS DE ESCENAS (TIMELINE SENSORIAL CLICKABLE) */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider">
              Flujo del Reel / Guión Técnico
            </h3>

            <div className="space-y-3">
              {SCENES.map((sc, idx) => {
                const isActive = idx === currentSceneIdx;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setCurrentTime(0);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isActive 
                        ? "bg-[#10B981]/10 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                        : "bg-gray-950/40 border-transparent hover:border-gray-800"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? "bg-[#10B981] text-black" : "bg-gray-800 text-gray-400"
                    }`}>
                      {sc.id}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-xs font-bold ${isActive ? "text-white" : "text-gray-300"}`}>
                          {sc.title}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {(sc.duration / 1000).toFixed(1)}s
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-normal">
                        {lang === "es" ? sc.captions.es : sc.captions.pt}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* INSTRUCCIONES PARA CAPTURAR DESDE EL CELULAR */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex gap-4 items-start">
            <div className="p-2.5 bg-[#10B981]/10 rounded-xl text-[#10B981] shrink-0">
              <Sparkles size={24} />
            </div>
            <div className="text-left space-y-1">
              <h4 className="text-sm font-extrabold text-[#10B981]">💡 ¿Cómo capturar este Reel para tus Redes?</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                1. Seleccioná el idioma deseado (**ES** o **PT**).<br />
                2. Ajustá el **Zoom** en los controles superiores para que encaje perfecto en la pantalla de tu celular.<br />
                3. Activá el grabador de pantalla nativo de tu teléfono.<br />
                4. Dale play en la simulación y grabá la pantalla limpia. ¡Listo para subir a Instagram Reels o TikTok! 🚀
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
      }
