'use client';

import React, { useState } from 'react';
import {
  Video,
  Instagram,
  Layout,
  Film,
  Camera,
  CheckCircle2,
  Copy,
  Check,
  Gift,
  Award,
  Crown
} from 'lucide-react';

// ============================================================
// LOGO OFICIAL NEVUX (isotipo blanco)
// ============================================================
const NevuxIsotype = ({ size = 22 }: { size?: number }) => (
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
    <rect x="22" y="18" width="15" height="64" rx="2" fill="#FFFFFF" />
    <rect x="68" y="18" width="15" height="42" rx="2" fill="url(#nPillarRight)" />
    <path d="M29 22 L78 88" stroke="url(#nDiag)" strokeWidth="15" strokeLinecap="round" />
  </svg>
);

const BrandHeader = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: '#0a0a0a',
        border: '1.5px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      <NevuxIsotype size={18} />
    </div>
    <span
      style={{
        color: '#FFFFFF',
        fontWeight: 800,
        fontSize: 14,
        letterSpacing: '0.08em',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      NEVUX
    </span>
  </div>
);

// ============================================================
// SLIDE CARD — 340px centrado · padding interno seguro
// REGLA: overflow hidden SOLO en el card; el CTA nunca se clippea
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
  <div
    style={{
      width: '100%',
      maxWidth: 340,
      margin: '0 auto',
      aspectRatio: '4 / 5',
      backgroundColor: '#050d0a',
      backgroundImage:
        'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 60%)',
      borderRadius: 24,
      border: '1px solid rgba(16,185,129,0.3)',
      // Padding simétrico para que el botón no toque los bordes redondeados
      paddingTop: 20,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
      boxSizing: 'border-box'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexShrink: 0
      }}
    >
      <BrandHeader />
      <span
        style={{
          fontSize: 10,
          color: '#6B7280',
          fontWeight: 700,
          letterSpacing: '0.05em'
        }}
      >
        {slideNum}/{totalSlides}
      </span>
    </div>

    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  </div>
);

// ============================================================
// CTA DEL SLIDE — SIEMPRE completo, centrado, sin corte
// REGLA ANTI-CORTE (obligatoria en todos los carruseles):
// 1) boxSizing: border-box
// 2) width 100% del contenedor interno (ya con padding del card)
// 3) flexShrink: 0
// 4) texto centrado con flex
// ============================================================
const SlideCTA = ({ text }: { text: string }) => (
  <div
    style={{
      marginTop: 'auto',
      width: '100%',
      boxSizing: 'border-box',
      flexShrink: 0,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 12,
      border: '1.5px solid rgba(16,185,129,0.4)',
      backgroundColor: 'rgba(16,185,129,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}
  >
    <span
      style={{
        color: '#10B981',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.06em',
        lineHeight: 1.2,
        whiteSpace: 'nowrap'
      }}
    >
      {text}
    </span>
  </div>
);

// Botón sólido (CTA final) — misma regla anti-corte
const SolidCTA = ({ text }: { text: string }) => (
  <div
    style={{
      width: '100%',
      boxSizing: 'border-box',
      flexShrink: 0,
      backgroundColor: '#10B981',
      color: '#000000',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: '0.02em',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {text}
  </div>
);

// ============================================================
// CARRUSEL LUNES (URGENCIA) — 5 slides
// ============================================================
const LunesCarouselSlides = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      alignItems: 'center',
      width: '100%'
    }}
  >
    {/* SLIDE 1 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#EF4444',
          color: '#FFF',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 1 · HOOK
      </span>
      <SlideCard slideNum={1} totalSlides={5}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>🚨</span>
          <span style={{ color: '#EF4444', fontWeight: 900, fontSize: 11, letterSpacing: '0.06em' }}>
            ALERTA PARA DUEÑOS DE TIENDA
          </span>
        </div>

        <h2
          style={{
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em'
          }}
        >
          Tu tienda pierde
          <br />
          ventas <span style={{ color: '#10B981' }}>MIENTRAS
          <br />
          dormís.</span>
        </h2>

        <p style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.4, margin: '0 0 16px 0' }}>
          Y no es culpa de tus Ads. Te muestro el error exacto 👉
        </p>

        <SlideCTA text="DESLIZÁ →" />
      </SlideCard>
    </div>

    {/* SLIDE 2 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#F59E0B',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 2 · PROBLEMA
      </span>
      <SlideCard slideNum={2} totalSlides={5}>
        <h2 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px 0' }}>
          El problema no es tu tráfico.
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 14px 0', lineHeight: 1.3 }}>
          Es lo que pasa cuando el cliente llega.
        </p>

        <div
          style={{
            backgroundColor: '#0B1512',
            border: '1px solid #1F2937',
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #1F2937',
              paddingBottom: 6,
              marginBottom: 8
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 800 }}>Métricas de hoy</span>
            <span
              style={{
                backgroundColor: 'rgba(239,68,68,0.15)',
                color: '#EF4444',
                padding: '2px 6px',
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 800
              }}
            >
              0.8% conv.
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>Visitas Ads</span>
              <span style={{ color: '#FFF', fontWeight: 800 }}>1.450</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>En carrito</span>
              <span style={{ color: '#FFF', fontWeight: 800 }}>84</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
              <span style={{ fontWeight: 700 }}>Abandonos</span>
              <span style={{ fontWeight: 900 }}>72 🚨</span>
            </div>
          </div>
        </div>

        <p style={{ color: '#D1D5DB', fontSize: 11, lineHeight: 1.35, margin: '0 0 10px 0', textAlign: 'center' }}>
          Tener <strong style={{ color: '#EF4444' }}>10 apps instaladas</strong> enlentece tu tienda y aleja
          compradores.
        </p>

        <SlideCTA text="LA SOLUCIÓN →" />
      </SlideCard>
    </div>

    {/* SLIDE 3 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#EF4444',
          color: '#FFF',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 3 · IMPLICACIÓN
      </span>
      <SlideCard slideNum={3} totalSlides={5}>
        <h2 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 900, lineHeight: 1.2, margin: '0 0 10px 0' }}>
          Cada día sin optimizar, quemás plata en Ads.
        </h2>

        <div
          style={{
            backgroundColor: '#0B1512',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 12,
            padding: 14,
            marginTop: 10,
            marginBottom: 10,
            textAlign: 'center',
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <p style={{ color: '#9CA3AF', fontSize: 10, margin: '0 0 4px 0' }}>Si convertís al 0.8%</p>
          <p style={{ color: '#EF4444', fontSize: 22, fontWeight: 900, margin: '0 0 2px 0', lineHeight: 1.1 }}>
            Tirás el 99%
          </p>
          <p style={{ color: '#9CA3AF', fontSize: 11, margin: 0 }}>de tu presupuesto de Ads</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, width: '100%' }}>
          {[
            'Carritos abandonados sin recuperar',
            'Sin urgencia ni prueba social',
            'Tienda lenta por multi-apps',
            'Nadie responde de noche'
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#0B1512',
                borderRadius: 8,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 10,
                paddingRight: 10,
                border: '1px solid #1F2937',
                boxSizing: 'border-box',
                width: '100%'
              }}
            >
              <span style={{ color: '#EF4444', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>✗</span>
              <span style={{ color: '#D1D5DB', fontSize: 11 }}>{item}</span>
            </div>
          ))}
        </div>

        <SlideCTA text="CÓMO SE ARREGLA →" />
      </SlideCard>
    </div>

    {/* SLIDE 4 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#10B981',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 4 · SOLUCIÓN
      </span>
      <SlideCard slideNum={4} totalSlides={5}>
        <h2 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 900, lineHeight: 1.2, margin: '0 0 6px 0' }}>
          Nevux lo resuelve
          <br />
          en <span style={{ color: '#10B981' }}>2 minutos.</span>
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: 11, margin: '0 0 12px 0' }}>
          50 Widgets + 6 funciones de IA · 1 sola app
        </p>

        <div
          style={{
            backgroundColor: '#020a07',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: 12,
            padding: 10,
            marginBottom: 12,
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <div
            style={{
              color: '#10B981',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '0.08em',
              marginBottom: 8
            }}
          >
            WIDGETS ACTIVOS
          </div>
          {[
            { name: 'Barra Envío Gratis', desc: 'Subí ticket promedio' },
            { name: 'Contador Urgencia', desc: 'Cerrá ventas ya' },
            { name: 'Chatbot IA 24/7', desc: 'Responde de noche' },
            { name: 'Reseñas con Fotos', desc: 'Generá confianza' }
          ].map((w, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0B1512',
                border: '1px solid #1F2937',
                borderRadius: 8,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 8,
                paddingRight: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: i < 3 ? 6 : 0,
                boxSizing: 'border-box',
                width: '100%'
              }}
            >
              <div style={{ minWidth: 0, paddingRight: 8 }}>
                <div style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 800 }}>{w.name}</div>
                <div style={{ color: '#6B7280', fontSize: 8 }}>{w.desc}</div>
              </div>
              <div
                style={{
                  width: 28,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#10B981',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#FFF',
                    position: 'absolute',
                    right: 2,
                    top: 2
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <SlideCTA text="EMPEZAR GRATIS →" />
      </SlideCard>
    </div>

    {/* SLIDE 5 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#10B981',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 5 · CTA FINAL
      </span>
      <SlideCard slideNum={5} totalSlides={5}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%'
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'rgba(16,185,129,0.12)',
              border: '2px solid #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={24} color="#10B981" />
          </div>

          <h2
            style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 8px 0'
            }}
          >
            Empezá a recuperar
            <br />
            ventas hoy mismo.
          </h2>

          <p style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 1.4, margin: '0 0 16px 0' }}>
            Instalación en 1 clic. Sin código.
            <br />
            Sin tarjeta de crédito.
          </p>

          <SolidCTA text="PROBAR 7 DÍAS GRATIS" />

          <p style={{ color: '#6B7280', fontSize: 10, margin: '8px 0 14px 0' }}>Link en nuestro perfil</p>
        </div>

        <div
          style={{
            borderTop: '1px solid #1F2937',
            paddingTop: 10,
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            flexShrink: 0
          }}
        >
          <span style={{ color: '#10B981', fontSize: 10, fontWeight: 800 }}>
            50 Widgets + 6 funciones para impulsar tu Tiendanube
          </span>
        </div>
      </SlideCard>
    </div>
  </div>
);

// ============================================================
// CARRUSEL MIÉRCOLES (FIDELIZACIÓN) — 5 slides
// ============================================================
const MiercolesCarouselSlides = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      alignItems: 'center',
      width: '100%'
    }}
  >
    {/* SLIDE 1 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#10B981',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 1 · HOOK
      </span>
      <SlideCard slideNum={1} totalSlides={5}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Gift size={16} color="#10B981" />
          <span style={{ color: '#10B981', fontWeight: 900, fontSize: 11, letterSpacing: '0.06em' }}>
            FIDELIZACIÓN NEVUX
          </span>
        </div>

        <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px 0' }}>
          Otras apps te cobran.
          <br />
          <span style={{ color: '#10B981' }}>Nevux te premia.</span>
        </h2>

        <p style={{ color: '#D1D5DB', fontSize: 12, lineHeight: 1.4, margin: '0 0 16px 0' }}>
          Cuantos más meses usás la app, más beneficios exclusivos desbloqueás para tu tienda.
        </p>

        <SlideCTA text="VER RECOMPENSAS →" />
      </SlideCard>
    </div>

    {/* SLIDE 2 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#10B981',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 2 · MES 3
      </span>
      <SlideCard slideNum={2} totalSlides={5}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Gift size={20} color="#10B981" />
          <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>Mes 3 · Recompensa</span>
        </div>

        <div
          style={{
            backgroundColor: '#0B1512',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <p style={{ color: '#E5E7EB', fontSize: 12, lineHeight: 1.4, margin: '0 0 10px 0' }}>
            Desbloqueás <strong>widgets premium exclusivos</strong> + 1 widget personalizado único diseñado para
            tu nicho.
          </p>
          <div
            style={{
              backgroundColor: '#020a07',
              padding: 8,
              borderRadius: 8,
              border: '1px solid #1F2937',
              color: '#10B981',
              fontSize: 10,
              fontWeight: 800,
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            ✨ Solo tu tienda va a tener este widget
          </div>
        </div>

        <SlideCTA text="SIGUIENTE NIVEL →" />
      </SlideCard>
    </div>

    {/* SLIDE 3 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#F59E0B',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 3 · MES 6
      </span>
      <SlideCard slideNum={3} totalSlides={5}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Award size={20} color="#F59E0B" />
          <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>Mes 6 · Nivel Elite</span>
        </div>

        <div
          style={{
            backgroundColor: '#0B1512',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <p style={{ color: '#E5E7EB', fontSize: 12, lineHeight: 1.4, margin: '0 0 10px 0' }}>
            Más widgets hechos a medida + <strong>descuentos exclusivos</strong> en tu suscripción mensual de
            Nevux.
          </p>
          <div
            style={{
              backgroundColor: '#020a07',
              padding: 8,
              borderRadius: 8,
              border: '1px solid #1F2937',
              color: '#F59E0B',
              fontSize: 10,
              fontWeight: 800,
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            🏆 Status Elite activado
          </div>
        </div>

        <SlideCTA text="NIVEL MÁXIMO →" />
      </SlideCard>
    </div>

    {/* SLIDE 4 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#8B5CF6',
          color: '#FFF',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 4 · MES 12+
      </span>
      <SlideCard slideNum={4} totalSlides={5}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Crown size={20} color="#8B5CF6" />
          <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>Mes 12+ · Nivel VIP</span>
        </div>

        <div
          style={{
            backgroundColor: '#0B1512',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <p style={{ color: '#E5E7EB', fontSize: 12, lineHeight: 1.4, margin: '0 0 10px 0' }}>
            Beneficios VIP, soporte prioritario por WhatsApp y <strong>acceso anticipado a IA de Recomendaciones
            y Analytics ROI</strong>.
          </p>
          <div
            style={{
              backgroundColor: '#020a07',
              padding: 8,
              borderRadius: 8,
              border: '1px solid #1F2937',
              color: '#8B5CF6',
              fontSize: 10,
              fontWeight: 800,
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            👑 Partner Oficial Nevux
          </div>
        </div>

        <SlideCTA text="EMPEZAR HOY →" />
      </SlideCard>
    </div>

    {/* SLIDE 5 */}
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: '#10B981',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        SLIDE 5 · CTA FINAL
      </span>
      <SlideCard slideNum={5} totalSlides={5}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%'
          }}
        >
          <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 900, lineHeight: 1.2, margin: '0 0 10px 0' }}>
            El Mes 3 llega más rápido de lo que pensás.
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 16px 0' }}>
            Activá Nevux hoy en tu Tiendanube y empezá a sumar meses.
          </p>
          <SolidCTA text="ACTIVAR 7 DÍAS GRATIS" />
        </div>
        <div
          style={{
            borderTop: '1px solid #1F2937',
            paddingTop: 10,
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            flexShrink: 0
          }}
        >
          <span style={{ color: '#10B981', fontSize: 10, fontWeight: 800 }}>
            50 Widgets + 6 funciones para impulsar tu Tiendanube
          </span>
        </div>
      </SlideCard>
    </div>
  </div>
);

// ============================================================
// COPIES
// ============================================================
const COPIES = {
  LUNES: `🔴 Tu Tiendanube tiene un problema que no se ve en las métricas de Meta.

Recibís visitas todos los días. Los Ads funcionan. La gente llega a tu tienda. Pero el carrito queda abandonado, el checkout no se completa y la conversión no pasa del 1%.

¿Sabés cuánto te cuesta eso? Si invertís en tráfico y tu tienda no convierte, estás pagando dos veces: la publicidad Y la venta perdida. Y lo peor: cada app extra que instalás para "solucionarlo" hace tu tienda más lenta y aleja más clientes.

Nevux reemplaza todo eso con 50 Widgets de alta conversión + 6 funciones de IA en una sola app liviana. Envío gratis, urgencia, reseñas, chatbot, búsqueda por voz... todo en 2 minutos.

✅ 7 días gratis sin tarjeta
✅ Instalación en 1 clic desde la App Store de Tiendanube
✅ Sin tocar código

👉 Comentá "WIDGET" y te mando el link directo por DM.

#Tiendanube #Ecommerce #VentasOnline #Nevux #Widgets #ConversionRate #TiendaOnline #Emprendedores #MarketingDigital #Nuvemshop`,

  MIÉRCOLES: `🎁 ¿Tu app de widgets te recompensa por quedarte? La nuestra sí.

La mayoría de apps para Tiendanube te cobran todos los meses lo mismo y nunca te dan nada extra. Sos un número más en su base de datos.

En Nevux creamos las Recompensas por Fidelidad: un sistema real donde cuanto más tiempo usás la plataforma, más beneficios exclusivos desbloqueás:

🎁 Mes 3: Widgets premium + 1 widget personalizado único para tu tienda.
🏆 Mes 6: Widgets hechos a medida + descuentos en tu suscripción.
👑 Mes 12+: VIP total, widgets 100% custom y acceso anticipado a IA y Analytics.

Y todo empieza con 7 días gratis. Sin tarjeta.

👉 Comentá "FIDELIDAD" y te cuento cómo funciona.

#Tiendanube #Nevux #Ecommerce #Fidelizacion #Widgets #TiendaOnline #Emprendedores #MarketingDigital #Nuvemshop`
};

// ============================================================
// PAGE
// ============================================================
export default function MarketingAssetsPage() {
  const [activeTab, setActiveTab] = useState<'meta' | 'appstore' | 'instagram'>('instagram');
  const [viewMode, setViewMode] = useState<'plan' | 'visual'>('visual');
  const [copied, setCopied] = useState(false);
  const [openDay, setOpenDay] = useState<string>('LUNES');

  const copyCaption = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#020a07',
        color: '#F3F4F6',
        minHeight: '100vh',
        paddingTop: 16,
        paddingRight: 10,
        paddingBottom: 40,
        paddingLeft: 10,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* HEADER */}
      <div style={{ maxWidth: 360, margin: '0 auto 16px auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <NevuxIsotype size={22} />
          <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15, letterSpacing: '0.06em' }}>NEVUX</span>
          <span
            style={{
              backgroundColor: 'rgba(16,185,129,0.15)',
              color: '#10B981',
              padding: '2px 6px',
              borderRadius: 10,
              fontSize: 9,
              fontWeight: 700,
              border: '1px solid rgba(16,185,129,0.3)'
            }}
          >
            V2
          </span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', margin: '0 0 2px 0' }}>
          Generador de Carruseles
        </h1>
        <p style={{ color: '#6B7280', fontSize: 11, margin: 0 }}>340px centrados · CTA completo sin cortes</p>
      </div>

      {/* TABS */}
      <div
        style={{
          maxWidth: 360,
          margin: '0 auto 14px auto',
          display: 'flex',
          backgroundColor: '#0B1512',
          padding: 3,
          borderRadius: 10,
          border: '1px solid #1F2937'
        }}
      >
        {(
          [
            { id: 'meta' as const, label: 'Meta Ads', icon: <Video size={12} /> },
            { id: 'appstore' as const, label: 'App Store', icon: <Layout size={12} /> },
            { id: 'instagram' as const, label: 'Instagram', icon: <Instagram size={12} /> }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 4,
              paddingRight: 4,
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#10B981' : 'transparent',
              color: activeTab === tab.id ? '#000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 11,
              cursor: 'pointer'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'instagram' && (
        <div style={{ maxWidth: 360, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 16,
              backgroundColor: '#0B1512',
              padding: 3,
              borderRadius: 10,
              border: '1px solid #1F2937'
            }}
          >
            <button
              onClick={() => setViewMode('plan')}
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 4,
                paddingRight: 4,
                borderRadius: 8,
                border: 'none',
                backgroundColor: viewMode === 'plan' ? '#1F2937' : 'transparent',
                color: viewMode === 'plan' ? '#FFF' : '#6B7280',
                fontWeight: 800,
                fontSize: 11,
                cursor: 'pointer'
              }}
            >
              📋 Guiones
            </button>
            <button
              onClick={() => setViewMode('visual')}
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 4,
                paddingRight: 4,
                borderRadius: 8,
                border: 'none',
                backgroundColor: viewMode === 'visual' ? '#10B981' : 'transparent',
                color: viewMode === 'visual' ? '#000' : '#6B7280',
                fontWeight: 800,
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4
              }}
            >
              <Camera size={12} /> Carruseles Visuales
            </button>
          </div>

          {viewMode === 'visual' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  marginBottom: 16,
                  overflowX: 'auto',
                  paddingBottom: 4
                }}
              >
                {['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'].map((day) => {
                  const isCarousel = ['LUNES', 'MIÉRCOLES'].includes(day);
                  const isActive = openDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setOpenDay(day)}
                      style={{
                        flexShrink: 0,
                        paddingTop: 6,
                        paddingBottom: 6,
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderRadius: 16,
                        border: isActive ? 'none' : '1px solid #1F2937',
                        backgroundColor: isActive ? '#10B981' : '#0B1512',
                        color: isActive ? '#000' : isCarousel ? '#D1D5DB' : '#4B5563',
                        fontWeight: 800,
                        fontSize: 10,
                        cursor: 'pointer'
                      }}
                    >
                      {day.slice(0, 3)}
                      {isCarousel ? ' 📸' : ' 🎬'}
                    </button>
                  );
                })}
              </div>

              {openDay === 'LUNES' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#0B1512',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 16,
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ color: '#10B981', fontSize: 11, fontWeight: 800, margin: '0 0 2px 0' }}>
                      📸 Carrusel Lunes (Urgencia) · 5 slides
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: 10, margin: 0 }}>CTA completo · sin cortes a la derecha</p>
                  </div>

                  <LunesCarouselSlides />

                  <div
                    style={{
                      marginTop: 24,
                      backgroundColor: '#0B1512',
                      border: '1px solid #1F2937',
                      borderRadius: 12,
                      padding: 14
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10
                      }}
                    >
                      <h4 style={{ color: '#10B981', fontSize: 11, fontWeight: 900, margin: 0 }}>📝 COPY LUNES</h4>
                      <button
                        onClick={() => copyCaption(COPIES.LUNES)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          backgroundColor: copied ? '#10B981' : '#1F2937',
                          color: copied ? '#000' : '#D1D5DB',
                          border: 'none',
                          borderRadius: 6,
                          paddingTop: 4,
                          paddingBottom: 4,
                          paddingLeft: 8,
                          paddingRight: 8,
                          fontSize: 10,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: '#D1D5DB',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      {COPIES.LUNES}
                    </pre>
                  </div>
                </div>
              )}

              {openDay === 'MIÉRCOLES' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#0B1512',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 16,
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ color: '#10B981', fontSize: 11, fontWeight: 800, margin: '0 0 2px 0' }}>
                      📸 Carrusel Miércoles (Fidelización) · 5 slides
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: 10, margin: 0 }}>CTA completo · sin cortes a la derecha</p>
                  </div>

                  <MiercolesCarouselSlides />

                  <div
                    style={{
                      marginTop: 24,
                      backgroundColor: '#0B1512',
                      border: '1px solid #1F2937',
                      borderRadius: 12,
                      padding: 14
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10
                      }}
                    >
                      <h4 style={{ color: '#10B981', fontSize: 11, fontWeight: 900, margin: 0 }}>📝 COPY MIÉRCOLES</h4>
                      <button
                        onClick={() => copyCaption(COPIES.MIÉRCOLES)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          backgroundColor: copied ? '#10B981' : '#1F2937',
                          color: copied ? '#000' : '#D1D5DB',
                          border: 'none',
                          borderRadius: 6,
                          paddingTop: 4,
                          paddingBottom: 4,
                          paddingLeft: 8,
                          paddingRight: 8,
                          fontSize: 10,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: '#D1D5DB',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      {COPIES.MIÉRCOLES}
                    </pre>
                  </div>
                </div>
              )}

              {!['LUNES', 'MIÉRCOLES'].includes(openDay) && (
                <div
                  style={{
                    backgroundColor: '#0B1512',
                    border: '1px solid #1F2937',
                    borderRadius: 12,
                    padding: 28,
                    textAlign: 'center'
                  }}
                >
                  <Film size={28} color="#4B5563" style={{ marginBottom: 8 }} />
                  <p style={{ color: '#FFF', fontSize: 13, fontWeight: 800, margin: '0 0 4px 0' }}>
                    {openDay} es día de REEL 🎬
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: 11, margin: 0 }}>
                    Mirá el guión en la pestaña &quot;Guiones&quot;.
                  </p>
                </div>
              )}
            </div>
          )}

          {viewMode === 'plan' && (
            <div
              style={{
                backgroundColor: '#0B1512',
                border: '1px solid #1F2937',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center'
              }}
            >
              <Instagram size={28} color="#10B981" style={{ marginBottom: 8 }} />
              <h3 style={{ color: '#FFF', fontSize: 14, fontWeight: 800, margin: '0 0 6px 0' }}>
                Plan Semanal Activo
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: 11, margin: '0 0 12px 0', lineHeight: 1.4 }}>
                Cambiá a <strong style={{ color: '#10B981' }}>Carruseles Visuales</strong> para capturar Lunes y
                Miércoles.
              </p>
              <button
                onClick={() => setViewMode('visual')}
                style={{
                  backgroundColor: '#10B981',
                  color: '#000',
                  border: 'none',
                  borderRadius: 8,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 16,
                  paddingRight: 16,
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Ver Carruseles Visuales →
              </button>
            </div>
          )}
        </div>
      )}

      {(activeTab === 'meta' || activeTab === 'appstore') && (
        <div
          style={{
            maxWidth: 360,
            margin: '20px auto 0 auto',
            backgroundColor: '#0B1512',
            border: '1px solid #1F2937',
            borderRadius: 12,
            padding: 28,
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#10B981', fontWeight: 800, fontSize: 13, margin: '0 0 4px 0' }}>
            Sección {activeTab.toUpperCase()} OK
          </p>
          <p style={{ color: '#6B7280', fontSize: 11, margin: 0 }}>
            Volvé a Instagram para los carruseles visuales.
          </p>
        </div>
      )}
    </div>
  );
      }
