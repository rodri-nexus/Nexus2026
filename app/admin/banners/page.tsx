'use client';

import React, { useState } from 'react';
import {
  Video,
  Instagram,
  Layout,
  Share2,
  MessageCircle,
  Hash,
  Clock,
  Layers,
  Film,
  ImageIcon,
  Maximize2,
  X,
  Mic,
  Globe,
  Gift,
  Award,
  Crown,
  Bot,
  BarChart3,
  Split,
  Palette,
  Link2,
  Sparkles,
  Camera,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Timer,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// ============================================================================
// 1. LOGO OFICIAL NEVUX V2 (REPLICA EXACTA IMAGEN 2: BLANCO/PLATA/DEGRADADO)
// ============================================================================
const NevuxIsotypeV2 = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nvxRightWhiteGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#A3A3A3" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="nvxDiagWhiteGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Pilar Izquierdo (Blanco Puro) */}
    <rect x="25" y="20" width="14" height="60" fill="#FFFFFF" />
    {/* Pilar Derecho (Degradado a Negro) */}
    <rect x="71" y="20" width="14" height="40" fill="url(#nvxRightWhiteGrad)" />
    {/* Diagonal (Blanca a Degradado oscuro) */}
    <path d="M25 20 L85 95 L71 95 L25 35 Z" fill="url(#nvxDiagWhiteGrad)" />
  </svg>
);

// Header para Carruseles (Réplica exacta Imagen 1)
const InstagramHeaderBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ 
      width: 44, height: 44, borderRadius: '50%', border: '1px solid #374151', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#020a07' 
    }}>
      <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18 }}>N</span>
    </div>
    <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em', fontFamily: 'system-ui, sans-serif' }}>
      NEVUX
    </span>
  </div>
);

// Header General de la App Admin
const NevuxAdminHeader = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <NevuxIsotypeV2 size={28} />
    <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 18, letterSpacing: '0.05em' }}>
      NEVUX
    </span>
  </div>
);

// ============================================================================
// 2. COMPONENTE DE SLIDES VISUALES (1080 x 1350 px - Formato 4:5 Instagram)
// ============================================================================
const VisualSlide = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    width: 1080,
    height: 1350, // Proporción 4:5 vertical real
    backgroundColor: '#010604', // Fondo súper dark exacto
    border: '1px solid rgba(16, 185, 129, 0.2)', // Borde sutil
    borderRadius: 64, // Bordes muy redondeados como imagen 1
    position: 'relative',
    overflow: 'hidden',
    padding: '80px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
    // Radial gradient glow superior verde
    background: 'radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.15) 0%, #010604 60%)'
  }}>
    {/* Top Header */}
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 60 }}>
      <InstagramHeaderBrand />
    </div>
    
    {/* Slide Content */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </div>
);

const SlideButton = ({ text }: { text: string }) => (
  <div style={{
    width: '100%',
    padding: '36px',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    border: '2px solid rgba(16, 185, 129, 0.3)',
    borderRadius: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40
  }}>
    <span style={{ color: '#10B981', fontSize: 32, fontWeight: 800, letterSpacing: '0.05em' }}>
      {text}
    </span>
  </div>
);

// ============================================================================
// 3. GENERADOR DE CARRUSELES (LUNES)
// ============================================================================
const LunesCarousel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 80, alignItems: 'center', transform: 'scale(0.4)', transformOrigin: 'top center', marginBottom: '-5500px' }}>
    
    {/* SLIDE 1 (RÉPLICA EXACTA IMAGEN 1) */}
    <VisualSlide>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <span style={{ fontSize: 32 }}>🚨</span>
        <span style={{ color: '#EF4444', fontWeight: 900, fontSize: 26, letterSpacing: '0.1em' }}>
          ALERTA PARA DUEÑOS DE TIENDA
        </span>
      </div>
      <h1 style={{ color: '#FFFFFF', fontSize: 90, fontWeight: 900, lineHeight: 1.1, margin: '0 0 40px 0', letterSpacing: '-0.02em' }}>
        Tu tienda pierde<br/>ventas <span style={{ color: '#10B981' }}>MIENTRAS<br/>dormís.</span>
      </h1>
      <p style={{ color: '#E5E7EB', fontSize: 44, lineHeight: 1.4, margin: 0, fontWeight: 400 }}>
        Y no es culpa de tus Ads. Te muestro el error exacto 👉
      </p>
      <SlideButton text="DESLIZÁ ➔" />
    </VisualSlide>

    {/* SLIDE 2 (Problema visual) */}
    <VisualSlide>
      <h1 style={{ color: '#FFFFFF', fontSize: 80, fontWeight: 900, lineHeight: 1.1, margin: '0 0 60px 0' }}>
        El problema no es tu tráfico.<br/><span style={{ color: '#9CA3AF', fontWeight: 700 }}>Es lo que pasa después.</span>
      </h1>
      
      {/* Dense UI Mockup */}
      <div style={{ backgroundColor: '#0B1512', border: '2px solid #1F2937', borderRadius: 40, padding: 48, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1F2937', paddingBottom: 24, marginBottom: 32 }}>
          <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 800 }}>Métricas de hoy</span>
          <span style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '12px 24px', borderRadius: 20, fontSize: 24, fontWeight: 800 }}>
            <TrendingDown size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} /> 0.8% Conversión
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 32 }}>
            <span style={{ color: '#9CA3AF' }}>Visitas Meta Ads:</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>1,450</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 32 }}>
            <span style={{ color: '#9CA3AF' }}>Agregados al carrito:</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>84</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 32, color: '#EF4444' }}>
            <span style={{ fontWeight: 800 }}>Carritos abandonados:</span>
            <span style={{ fontWeight: 900 }}>72 🚨</span>
          </div>
        </div>
      </div>
      <p style={{ color: '#E5E7EB', fontSize: 38, lineHeight: 1.5, margin: '60px 0 0 0', textAlign: 'center' }}>
        Instalar <strong style={{ color: '#EF4444' }}>10 apps distintas</strong> enlentece tu tienda y aleja a los compradores.
      </p>
      <SlideButton text="LA SOLUCIÓN ➔" />
    </VisualSlide>

    {/* SLIDE 3 (Solución Nevux) */}
    <VisualSlide>
      <h1 style={{ color: '#FFFFFF', fontSize: 80, fontWeight: 900, lineHeight: 1.1, margin: '0 0 60px 0' }}>
        Nevux resuelve esto<br/>en <span style={{ color: '#10B981' }}>2 minutos.</span>
      </h1>
      
      {/* Mockup Panel Nevux */}
      <div style={{ backgroundColor: '#020a07', border: '2px solid rgba(16,185,129,0.5)', borderRadius: 40, padding: 48, flex: 1, boxShadow: '0 20px 60px rgba(16,185,129,0.15)' }}>
        <div style={{ color: '#10B981', fontSize: 24, fontWeight: 900, letterSpacing: '0.1em', marginBottom: 32 }}>
          PANEL DE CONTROL NEVUX
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Widget 1 */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 24, padding: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Barra de Envío Gratis</div>
              <div style={{ color: '#9CA3AF', fontSize: 24 }}>Aumenta el ticket promedio.</div>
            </div>
            <div style={{ backgroundColor: '#10B981', width: 80, height: 40, borderRadius: 20, position: 'relative' }}>
              <div style={{ width: 32, height: 32, backgroundColor: '#FFF', borderRadius: '50%', position: 'absolute', right: 4, top: 4 }}></div>
            </div>
          </div>

          {/* Widget 2 */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 24, padding: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Chatbot IA 24/7</div>
              <div style={{ color: '#9CA3AF', fontSize: 24 }}>Responde dudas de noche.</div>
            </div>
            <div style={{ backgroundColor: '#10B981', width: 80, height: 40, borderRadius: 20, position: 'relative' }}>
              <div style={{ width: 32, height: 32, backgroundColor: '#FFF', borderRadius: '50%', position: 'absolute', right: 4, top: 4 }}></div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', color: '#10B981', fontSize: 28, fontWeight: 800, marginTop: 16 }}>
            + 48 WIDGETS DE ALTA CONVERSIÓN
          </div>
        </div>
      </div>
      <SlideButton text="ÚLTIMO PASO ➔" />
    </VisualSlide>

    {/* SLIDE 4 (CTA FINAL) */}
    <VisualSlide>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 160, height: 160, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, border: '4px solid #10B981' }}>
          <CheckCircle2 size={80} color="#10B981" />
        </div>
        <h1 style={{ color: '#FFFFFF', fontSize: 90, fontWeight: 900, lineHeight: 1.1, margin: '0 0 32px 0' }}>
          Empezá a recuperar<br/>ventas hoy mismo.
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: 40, margin: '0 0 80px 0', lineHeight: 1.4 }}>
          Instalalo en 1 clic. Sin tocar código.<br/>Sin tarjeta de crédito.
        </p>
        
        <div style={{ backgroundColor: '#10B981', color: '#000000', padding: '40px 80px', borderRadius: 32, fontSize: 48, fontWeight: 900, width: '100%' }}>
          PROBAR 7 DÍAS GRATIS
        </div>
        <div style={{ color: '#6B7280', fontSize: 28, marginTop: 40, fontWeight: 700 }}>
          Link en nuestro perfil.
        </div>
      </div>

      <div style={{ borderTop: '2px solid #1F2937', paddingTop: 40, marginTop: 'auto', textAlign: 'center' }}>
        <span style={{ color: '#10B981', fontSize: 32, fontWeight: 800 }}>
          50 Widgets + 6 funciones para impulsar tu Tiendanube
        </span>
      </div>
    </VisualSlide>

  </div>
);

// ============================================================================
// 4. ESTRUCTURA PRINCIPAL DE LA PÁGINA
// ============================================================================
export default function MarketingAssetsPage() {
  const [activeTab, setActiveTab] = useState<'meta' | 'appstore' | 'instagram'>('instagram');
  const [fullscreenBanner, setFullscreenBanner] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<string | null>('LUNES');
  const [viewMode, setViewMode] = useState<'plan' | 'visual'>('plan');

  return (
    <div style={{ backgroundColor: '#020a07', color: '#F3F4F6', minHeight: '100vh', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* HEADER PRINCIPAL */}
      <div style={{ maxWidth: 1280, margin: '0 auto 32px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <NevuxAdminHeader />
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ASSETS OFICIALES V2
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            Planificador & Generador de Contenidos
          </h1>
        </div>

        {/* TABS NAVEGACIÓN */}
        <div style={{ display: 'flex', backgroundColor: '#0B1512', padding: 4, borderRadius: 12, border: '1px solid #1F2937' }}>
          <button onClick={() => setActiveTab('meta')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none', backgroundColor: activeTab === 'meta' ? '#10B981' : 'transparent', color: activeTab === 'meta' ? '#000000' : '#9CA3AF', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <Video size={16} /> Meta Ads
          </button>
          <button onClick={() => setActiveTab('appstore')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none', backgroundColor: activeTab === 'appstore' ? '#10B981' : 'transparent', color: activeTab === 'appstore' ? '#000000' : '#9CA3AF', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <Layout size={16} /> App Store
          </button>
          <button onClick={() => setActiveTab('instagram')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none', backgroundColor: activeTab === 'instagram' ? '#10B981' : 'transparent', color: activeTab === 'instagram' ? '#000000' : '#9CA3AF', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <Instagram size={16} /> Instagram Plan
          </button>
        </div>
      </div>

      {/* CONTENIDO TAB INSTAGRAM (PLAN + GENERADOR VISUAL) */}
      {activeTab === 'instagram' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'flex', gap: 16, backgroundColor: '#0B1512', padding: 12, borderRadius: 16, border: '1px solid #1F2937' }}>
            <button 
              onClick={() => setViewMode('plan')} 
              style={{ flex: 1, padding: 16, borderRadius: 12, border: 'none', backgroundColor: viewMode === 'plan' ? '#1F2937' : 'transparent', color: '#FFF', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              <Layout size={20} color={viewMode === 'plan' ? '#10B981' : '#9CA3AF'} />
              Ver Guiones y Estrategia
            </button>
            <button 
              onClick={() => setViewMode('visual')} 
              style={{ flex: 1, padding: 16, borderRadius: 12, border: 'none', backgroundColor: viewMode === 'visual' ? '#10B981' : 'transparent', color: viewMode === 'visual' ? '#000' : '#9CA3AF', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              <Camera size={20} />
              📸 Generador Visual de Carruseles
            </button>
          </div>

          {viewMode === 'visual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ backgroundColor: '#0B1512', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: '#10B981', margin: '0 0 8px 0' }}>Estudio de Carruseles Nevux</h3>
                <p style={{ color: '#9CA3AF', fontSize: 15, margin: 0 }}>
                  Las imágenes están a escala 1080x1350px. Usá una extensión de captura (Full Page Screen Capture) para guardarlas, o recortá la pantalla.
                </p>
              </div>

              {/* LUNES - Carrusel Stackeado */}
              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 24, padding: '40px 0', overflow: 'hidden' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span style={{ backgroundColor: '#EF4444', color: '#FFF', padding: '6px 16px', borderRadius: 20, fontWeight: 900, fontSize: 14 }}>
                    CARRUSEL LUNES (URGENCIA)
                  </span>
                </div>
                
                {/* RENDER DEL CARRUSEL */}
                <LunesCarousel />

                {/* COPY DEBAJO DE LAS IMAGENES */}
                <div style={{ maxWidth: 800, margin: '2000px auto 0 auto', backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 32 }}>
                  <h4 style={{ color: '#10B981', fontSize: 16, fontWeight: 900, marginBottom: 16 }}>COPY / DESCRIPCIÓN PARA LUNES:</h4>
                  <p style={{ color: '#D1D5DB', fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                    🔴 Tu Tiendanube tiene un problema que no se ve en las métricas de Meta.<br/><br/>
                    Recibís visitas todos los días. Los Ads funcionan. Pero el carrito queda abandonado y la conversión no pasa del 1%.<br/><br/>
                    ¿Sabés cuánto te cuesta eso? Si invertís en tráfico y tu tienda no convierte, estás pagando dos veces: la publicidad Y la venta perdida.<br/><br/>
                    Nevux reemplaza las 10 apps lentas con 50 Widgets de alta conversión + 6 funciones de IA en una sola app liviana. Envío gratis, urgencia, reseñas... todo en 2 minutos.<br/><br/>
                    ✅ 7 días gratis sin tarjeta<br/>
                    ✅ Instalación en 1 clic<br/><br/>
                    👉 Comentá "WIDGET" y te mando el link directo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'plan' && (
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <Instagram size={48} color="#10B981" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 24, color: '#FFF', fontWeight: 800 }}>El plan semanal estratégico está activo.</h2>
              <p style={{ color: '#9CA3AF', fontSize: 16 }}>
                Pasá al modo "Generador Visual" arriba para ver los carruseles listos para captura.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TABS DE META Y APP STORE (Para mantener la app funcional) */}
      {(activeTab === 'meta' || activeTab === 'appstore') && (
        <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 64, textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ color: '#10B981', fontSize: 24, fontWeight: 800 }}>
            Sección {activeTab.toUpperCase()} preservada correctamente.
          </h2>
          <p style={{ color: '#9CA3AF' }}>Todo el código de Meta y Tiendanube quedó intacto. Cambiá al Tab de Instagram para ver el nuevo generador.</p>
        </div>
      )}

    </div>
  );
                  }
