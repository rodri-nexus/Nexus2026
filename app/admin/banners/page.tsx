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
  TrendingDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';

// ============================================================
// LOGO OFICIAL NEVUX (réplica exacta de tu isotipo blanco)
// ============================================================
const NevuxIsotype = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nPillarRight" x1="70" y1="15" x2="70" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="nDiag" x1="20" y1="20" x2="85" y2="95" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="55%" stopColor="#F3F4F6" />
        <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Left pillar */}
    <rect x="22" y="18" width="15" height="64" rx="2" fill="#FFFFFF" />
    {/* Right pillar (fades down) */}
    <rect x="68" y="18" width="15" height="42" rx="2" fill="url(#nPillarRight)" />
    {/* Diagonal bar */}
    <path
      d="M29 22 L78 88"
      stroke="url(#nDiag)"
      strokeWidth="15"
      strokeLinecap="round"
    />
  </svg>
);

const BrandHeader = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      backgroundColor: '#0a0a0a',
      border: '1.5px solid #2a2a2a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <NevuxIsotype size={22} />
    </div>
    <span style={{
      color: '#FFFFFF',
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: '0.08em',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      NEVUX
    </span>
  </div>
);

// ============================================================
// SLIDE CARD — formato vertical limpio para captura
// ============================================================
const SlideCard = ({
  children,
  slideNum,
  totalSlides
}: {
  children: React.ReactNode;
  slideNum: number;
  totalSlides: number;
}) => (
  <div style={{
    width: '100%',
    maxWidth: 420,
    margin: '0 auto',
    aspectRatio: '4 / 5',
    backgroundColor: '#050d0a',
    backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 55%)',
    borderRadius: 28,
    border: '1px solid rgba(16,185,129,0.25)',
    padding: '28px 24px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0,0,0,0.55)'
  }}>
    {/* Header brand */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
      <BrandHeader />
      <span style={{
        fontSize: 11,
        color: '#4B5563',
        fontWeight: 700,
        letterSpacing: '0.05em'
      }}>
        {slideNum}/{totalSlides}
      </span>
    </div>

    {/* Content */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </div>
);

const SlideCTA = ({ text }: { text: string }) => (
  <div style={{
    marginTop: 'auto',
    width: '100%',
    padding: '14px 0',
    borderRadius: 14,
    border: '1.5px solid rgba(16,185,129,0.35)',
    backgroundColor: 'rgba(16,185,129,0.06)',
    textAlign: 'center'
  }}>
    <span style={{
      color: '#10B981',
      fontSize: 14,
      fontWeight: 800,
      letterSpacing: '0.06em'
    }}>
      {text}
    </span>
  </div>
);

// ============================================================
// CARRUSEL LUNES — 5 SLIDES APILADOS VERTICALMENTE
// ============================================================
const LunesCarouselSlides = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '0 8px' }}>

    {/* ===== SLIDE 1 — HOOK ===== */}
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          backgroundColor: '#EF4444',
          color: '#FFF',
          padding: '5px 14px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '0.04em'
        }}>
          SLIDE 1 · HOOK
        </span>
      </div>
      <SlideCard slideNum={1} totalSlides={5}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 16 }}>🚨</span>
          <span style={{
            color: '#EF4444',
            fontWeight: 900,
            fontSize: 12,
            letterSpacing: '0.08em'
          }}>
            ALERTA PARA DUEÑOS DE TIENDA
          </span>
        </div>

        <h2 style={{
          color: '#FFFFFF',
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1.15,
          margin: '0 0 16px 0',
          letterSpacing: '-0.02em'
        }}>
          Tu tienda pierde<br />
          ventas <span style={{ color: '#10B981' }}>MIENTRAS<br />dormís.</span>
        </h2>

        <p style={{
          color: '#D1D5DB',
          fontSize: 15,
          lineHeight: 1.5,
          margin: '0 0 24px 0',
          fontWeight: 400
        }}>
          Y no es culpa de tus Ads. Te muestro el error exacto 👉
        </p>

        <SlideCTA text="DESLIZÁ →" />
      </SlideCard>
    </div>

    {/* ===== SLIDE 2 — PROBLEMA ===== */}
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          backgroundColor: '#F59E0B',
          color: '#000',
          padding: '5px 14px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '0.04em'
        }}>
          SLIDE 2 · PROBLEMA
        </span>
      </div>
      <SlideCard slideNum={2} totalSlides={5}>
        <h2 style={{
          color: '#FFFFFF',
          fontSize: 26,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '0 0 20px 0'
        }}>
          El problema no es tu tráfico.
        </h2>
        <p style={{
          color: '#9CA3AF',
          fontSize: 14,
          margin: '0 0 20px 0',
          lineHeight: 1.4
        }}>
          Es lo que pasa cuando el cliente llega a tu tienda.
        </p>

        {/* Mock métricas */}
        <div style={{
          backgroundColor: '#0B1512',
          border: '1px solid #1F2937',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1F2937',
            paddingBottom: 10,
            marginBottom: 12
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 800 }}>Métricas de hoy</span>
            <span style={{
              backgroundColor: 'rgba(239,68,68,0.15)',
              color: '#EF4444',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <TrendingDown size={12} /> 0.8% conv.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#9CA3AF' }}>Visitas Meta Ads</span>
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>1.450</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#9CA3AF' }}>Agregados al carrito</span>
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>84</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#EF4444', fontWeight: 700 }}>Carritos abandonados</span>
              <span style={{ color: '#EF4444', fontWeight: 900 }}>72 🚨</span>
            </div>
          </div>
        </div>

        <p style={{
          color: '#D1D5DB',
          fontSize: 13,
          lineHeight: 1.45,
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          Tener <strong style={{ color: '#EF4444' }}>10 apps instaladas</strong> enlentece tu tienda y aleja compradores.
        </p>

        <SlideCTA text="LA SOLUCIÓN →" />
      </SlideCard>
    </div>

    {/* ===== SLIDE 3 — IMPLICACIÓN ===== */}
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          backgroundColor: '#EF4444',
          color: '#FFF',
          padding: '5px 14px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '0.04em'
        }}>
          SLIDE 3 · IMPLICACIÓN
        </span>
      </div>
      <SlideCard slideNum={3} totalSlides={5}>
        <h2 style={{
          color: '#FFFFFF',
          fontSize: 26,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '0 0 12px 0'
        }}>
          Cada día sin optimizar, quemás plata en Ads.
        </h2>

        <div style={{
          backgroundColor: '#0B1512',
          border: '1px solid rgba(239,68,68,0.35)',
          borderRadius: 16,
          padding: 20,
          margin: '16px 0',
          textAlign: 'center'
        }}>
          <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 8px 0' }}>
            Si gastás en Meta y convertís al 0.8%
          </p>
          <p style={{
            color: '#EF4444',
            fontSize: 28,
            fontWeight: 900,
            margin: '0 0 4px 0',
            lineHeight: 1.1
          }}>
            Estás tirando el 99%
          </p>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>
            de tu inversión a la basura
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            'Carritos abandonados sin recuperar',
            'Cero urgencia ni prueba social',
            'Tienda lenta por multi-apps',
            'Nadie responde dudas a la noche'
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#0B1512',
              borderRadius: 10,
              padding: '10px 14px',
              border: '1px solid #1F2937'
            }}>
              <span style={{ color: '#EF4444', fontSize: 14, fontWeight: 900 }}>✗</span>
              <span style={{ color: '#D1D5DB', fontSize: 13 }}>{item}</span>
            </div>
          ))}
        </div>

        <SlideCTA text="CÓMO SE ARREGLA →" />
      </SlideCard>
    </div>

    {/* ===== SLIDE 4 — SOLUCIÓN ===== */}
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          backgroundColor: '#10B981',
          color: '#000',
          padding: '5px 14px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '0.04em'
        }}>
          SLIDE 4 · SOLUCIÓN
        </span>
      </div>
      <SlideCard slideNum={4} totalSlides={5}>
        <h2 style={{
          color: '#FFFFFF',
          fontSize: 26,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '0 0 8px 0'
        }}>
          Nevux lo resuelve<br />
          en <span style={{ color: '#10B981' }}>2 minutos.</span>
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: 13, margin: '0 0 16px 0' }}>
          50 Widgets + 6 funciones de IA · 1 sola app
        </p>

        {/* Panel mock */}
        <div style={{
          backgroundColor: '#020a07',
          border: '1.5px solid rgba(16,185,129,0.4)',
          borderRadius: 16,
          padding: 14,
          marginBottom: 16,
          boxShadow: '0 8px 24px rgba(16,185,129,0.1)'
        }}>
          <div style={{
            color: '#10B981',
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: '0.1em',
            marginBottom: 12
          }}>
            PANEL NEVUX · WIDGETS ACTIVOS
          </div>

          {[
            { name: 'Barra de Envío Gratis', desc: 'Sube el ticket promedio' },
            { name: 'Contador de Urgencia', desc: 'Cierra ventas ahora' },
            { name: 'Chatbot IA 24/7', desc: 'Responde de noche solo' },
            { name: 'Reseñas con Estrellas', desc: 'Genera confianza ya' }
          ].map((w, i) => (
            <div key={i} style={{
              backgroundColor: '#0B1512',
              border: '1px solid #1F2937',
              borderRadius: 10,
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: i < 3 ? 8 : 0
            }}>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 800 }}>{w.name}</div>
                <div style={{ color: '#6B7280', fontSize: 10 }}>{w.desc}</div>
              </div>
              {/* Toggle on */}
              <div style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#10B981',
                position: 'relative',
                flexShrink: 0
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#FFF',
                  position: 'absolute',
                  right: 2,
                  top: 2
                }} />
              </div>
            </div>
          ))}
        </div>

        <SlideCTA text="EMPEZAR GRATIS →" />
      </SlideCard>
    </div>

    {/* ===== SLIDE 5 — CTA ===== */}
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          backgroundColor: '#10B981',
          color: '#000',
          padding: '5px 14px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '0.04em'
        }}>
          SLIDE 5 · CTA FINAL
        </span>
      </div>
      <SlideCard slideNum={5} totalSlides={5}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'rgba(16,185,129,0.12)',
            border: '2px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <CheckCircle2 size={32} color="#10B981" />
          </div>

          <h2 style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 0 12px 0'
          }}>
            Empezá a recuperar<br />ventas hoy mismo.
          </h2>

          <p style={{
            color: '#9CA3AF',
            fontSize: 14,
            lineHeight: 1.45,
            margin: '0 0 24px 0'
          }}>
            Instalación en 1 clic. Sin código.<br />Sin tarjeta de crédito.
          </p>

          <div style={{
            width: '100%',
            backgroundColor: '#10B981',
            color: '#000000',
            padding: '16px 0',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: '0.02em',
            marginBottom: 10
          }}>
            PROBAR 7 DÍAS GRATIS
          </div>

          <p style={{ color: '#6B7280', fontSize: 12, margin: '0 0 20px 0' }}>
            Link en nuestro perfil
          </p>
        </div>

        <div style={{
          borderTop: '1px solid #1F2937',
          paddingTop: 14,
          textAlign: 'center'
        }}>
          <span style={{ color: '#10B981', fontSize: 12, fontWeight: 800 }}>
            50 Widgets + 6 funciones para impulsar tu Tiendanube
          </span>
        </div>
      </SlideCard>
    </div>
  </div>
);

// ============================================================
// COPY LUNES
// ============================================================
const LUNES_CAPTION = `🔴 Tu Tiendanube tiene un problema que no se ve en las métricas de Meta.

Recibís visitas todos los días. Los Ads funcionan. La gente llega a tu tienda. Pero el carrito queda abandonado, el checkout no se completa y la conversión no pasa del 1%.

¿Sabés cuánto te cuesta eso? Si invertís en tráfico y tu tienda no convierte, estás pagando dos veces: la publicidad Y la venta perdida. Y lo peor: cada app extra que instalás para "solucionarlo" hace tu tienda más lenta y aleja más clientes.

Nevux reemplaza todo eso con 50 Widgets de alta conversión + 6 funciones de IA en una sola app liviana. Envío gratis, urgencia, reseñas, chatbot, búsqueda por voz... todo en 2 minutos.

✅ 7 días gratis sin tarjeta
✅ Instalación en 1 clic desde la App Store de Tiendanube
✅ Sin tocar código

👉 Comentá "WIDGET" y te mando el link directo por DM.

#Tiendanube #Ecommerce #VentasOnline #Nevux #Widgets #ConversionRate #TiendaOnline #Emprendedores #MarketingDigital #Nuvemshop`;

// ============================================================
// PAGE PRINCIPAL
// ============================================================
export default function MarketingAssetsPage() {
  const [activeTab, setActiveTab] = useState<'meta' | 'appstore' | 'instagram'>('instagram');
  const [viewMode, setViewMode] = useState<'plan' | 'visual'>('visual');
  const [copied, setCopied] = useState(false);
  const [openDay, setOpenDay] = useState<string>('LUNES');

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(LUNES_CAPTION);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silent
    }
  };

  return (
    <div style={{
      backgroundColor: '#020a07',
      color: '#F3F4F6',
      minHeight: '100vh',
      padding: '20px 12px 60px 12px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      {/* ===== HEADER ADMIN ===== */}
      <div style={{ maxWidth: 480, margin: '0 auto 20px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <NevuxIsotype size={24} />
          <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 16, letterSpacing: '0.06em' }}>NEVUX</span>
          <span style={{
            backgroundColor: 'rgba(16,185,129,0.15)',
            color: '#10B981',
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: 10,
            fontWeight: 700,
            border: '1px solid rgba(16,185,129,0.3)'
          }}>
            ASSETS V2
          </span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>
          Generador de Carruseles
        </h1>
        <p style={{ color: '#6B7280', fontSize: 12, margin: 0 }}>
          Slides apilados verticales · Listos para captura
        </p>
      </div>

      {/* ===== TABS ===== */}
      <div style={{
        maxWidth: 480,
        margin: '0 auto 16px auto',
        display: 'flex',
        backgroundColor: '#0B1512',
        padding: 4,
        borderRadius: 12,
        border: '1px solid #1F2937'
      }}>
        {([
          { id: 'meta' as const, label: 'Meta Ads', icon: <Video size={14} /> },
          { id: 'appstore' as const, label: 'App Store', icon: <Layout size={14} /> },
          { id: 'instagram' as const, label: 'Instagram', icon: <Instagram size={14} /> }
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 8px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#10B981' : 'transparent',
              color: activeTab === tab.id ? '#000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ===== TAB INSTAGRAM ===== */}
      {activeTab === 'instagram' && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* Sub-tabs plan / visual */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
            backgroundColor: '#0B1512',
            padding: 4,
            borderRadius: 12,
            border: '1px solid #1F2937'
          }}>
            <button
              onClick={() => setViewMode('plan')}
              style={{
                flex: 1,
                padding: '12px 8px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: viewMode === 'plan' ? '#1F2937' : 'transparent',
                color: viewMode === 'plan' ? '#FFF' : '#6B7280',
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              📋 Guiones
            </button>
            <button
              onClick={() => setViewMode('visual')}
              style={{
                flex: 1,
                padding: '12px 8px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: viewMode === 'visual' ? '#10B981' : 'transparent',
                color: viewMode === 'visual' ? '#000' : '#6B7280',
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Camera size={14} /> Carruseles Visuales
            </button>
          </div>

          {/* ===== MODO VISUAL ===== */}
          {viewMode === 'visual' && (
            <div>
              {/* Day selector */}
              <div style={{
                display: 'flex',
                gap: 6,
                marginBottom: 20,
                overflowX: 'auto',
                paddingBottom: 4
              }}>
                {['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'].map(day => {
                  const isCarousel = ['LUNES', 'MIÉRCOLES', 'DOMINGO'].includes(day);
                  const isActive = openDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setOpenDay(day)}
                      style={{
                        flexShrink: 0,
                        padding: '8px 12px',
                        borderRadius: 20,
                        border: isActive ? 'none' : '1px solid #1F2937',
                        backgroundColor: isActive ? '#10B981' : '#0B1512',
                        color: isActive ? '#000' : isCarousel ? '#D1D5DB' : '#4B5563',
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: isCarousel ? 'pointer' : 'default',
                        opacity: isCarousel ? 1 : 0.5
                      }}
                    >
                      {day.slice(0, 3)}
                      {isCarousel ? ' 📸' : ' 🎬'}
                    </button>
                  );
                })}
              </div>

              {/* LUNES VISUAL */}
              {openDay === 'LUNES' && (
                <div>
                  {/* Instrucciones */}
                  <div style={{
                    backgroundColor: '#0B1512',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 24,
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#10B981', fontSize: 13, fontWeight: 800, margin: '0 0 4px 0' }}>
                      📸 Carrusel Lunes · 5 slides
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                      Scrolleá hacia abajo. Cada slide está completo y listo para captura de pantalla.
                    </p>
                  </div>

                  {/* SLIDES APILADOS */}
                  <LunesCarouselSlides />

                  {/* COPY DEBAJO */}
                  <div style={{
                    marginTop: 40,
                    backgroundColor: '#0B1512',
                    border: '1px solid #1F2937',
                    borderRadius: 16,
                    padding: 20
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 14
                    }}>
                      <h4 style={{
                        color: '#10B981',
                        fontSize: 13,
                        fontWeight: 900,
                        margin: 0,
                        letterSpacing: '0.04em'
                      }}>
                        📝 COPY / DESCRIPCIÓN · LUNES
                      </h4>
                      <button
                        onClick={copyCaption}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: copied ? '#10B981' : '#1F2937',
                          color: copied ? '#000' : '#D1D5DB',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <pre style={{
                      margin: 0,
                      fontSize: 12,
                      color: '#D1D5DB',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'system-ui, sans-serif'
                    }}>
                      {LUNES_CAPTION}
                    </pre>
                  </div>
                </div>
              )}

              {/* Otros días - placeholder */}
              {openDay !== 'LUNES' && (
                <div style={{
                  backgroundColor: '#0B1512',
                  border: '1px solid #1F2937',
                  borderRadius: 16,
                  padding: 40,
                  textAlign: 'center'
                }}>
                  <Camera size={32} color="#4B5563" style={{ marginBottom: 12 }} />
                  <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>
                    {['MIÉRCOLES', 'DOMINGO'].includes(openDay)
                      ? `Carrusel de ${openDay} — lo armamos a continuación`
                      : `${openDay} es Reel — te paso el guión en modo Guiones`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== MODO PLAN / GUIONES ===== */}
          {viewMode === 'plan' && (
            <div style={{
              backgroundColor: '#0B1512',
              border: '1px solid #1F2937',
              borderRadius: 16,
              padding: 24,
              textAlign: 'center'
            }}>
              <Instagram size={36} color="#10B981" style={{ marginBottom: 12 }} />
              <h3 style={{ color: '#FFF', fontSize: 16, fontWeight: 800, margin: '0 0 8px 0' }}>
                Plan semanal activo
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: 13, margin: '0 0 16px 0', lineHeight: 1.4 }}>
                Andá a <strong style={{ color: '#10B981' }}>Carruseles Visuales</strong> para ver y capturar los slides del Lunes.
              </p>
              <button
                onClick={() => setViewMode('visual')}
                style={{
                  backgroundColor: '#10B981',
                  color: '#000',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 20px',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Ver Carruseles Visuales →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== TABS META / APPSTORE placeholder ===== */}
      {(activeTab === 'meta' || activeTab === 'appstore') && (
        <div style={{
          maxWidth: 480,
          margin: '40px auto 0 auto',
          backgroundColor: '#0B1512',
          border: '1px solid #1F2937',
          borderRadius: 16,
          padding: 40,
          textAlign: 'center'
        }}>
          <p style={{ color: '#10B981', fontWeight: 800, fontSize: 15, margin: '0 0 8px 0' }}>
            Sección {activeTab.toUpperCase()} OK
          </p>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            Volvé a Instagram para el generador de carruseles.
          </p>
        </div>
      )}
    </div>
  );
          }
