'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Timer,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

/* ============================================================
   LOGO NEVUX
   ============================================================ */
function NevuxLogo({ size = 32 }: { size?: number }) {
  const iconSize = Math.round(size * 0.52);
  const fontSize = Math.round(size * 0.55);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.9)',
          flexShrink: 0
        }}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M3 3H7.5V21H3V3Z" fill="#FFFFFF" />
          <path d="M16.5 3H21V21H16.5V3Z" fill="#FFFFFF" />
          <path d="M7.5 3L21 21H16.5L3 3H7.5Z" fill="url(#nevuxGrad)" />
          <defs>
            <linearGradient id="nevuxGrad" x1="3" y1="3" x2="21" y2="21">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E4E4E7" />
              <stop offset="75%" stopColor="#52525B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span
        style={{
          fontSize: fontSize,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.08em',
          lineHeight: 1
        }}
      >
        NEVUX
      </span>
    </div>
  );
}

/* ============================================================
   SLIDE WRAPPER (mismo look que Stories)
   ============================================================ */
function SlideWrapper({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: '#34d399',
          marginBottom: 8,
          letterSpacing: '0.05em'
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: '100%',
          aspectRatio: '4/5',
          backgroundColor: '#020a07',
          border: '2px solid rgba(16,185,129,0.3)',
          borderRadius: 24,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   COPY BLOCK
   ============================================================ */
interface CopyBlockProps {
  id: string;
  title: string;
  text: string;
  copied: boolean;
  onCopy: (id: string, text: string) => void;
}

function CopyBlock({ id, title, text, copied, onCopy }: CopyBlockProps) {
  return (
    <div
      style={{
        backgroundColor: '#061e14',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          📝 {title}
        </h3>
        <button
          onClick={() => onCopy(id, text)}
          style={{
            backgroundColor: copied ? '#10B981' : 'rgba(16,185,129,0.15)',
            color: copied ? '#020a07' : '#34d399',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s'
          }}
        >
          {copied ? (
            <>
              <Check style={{ width: 14, height: 14 }} /> COPIADO
            </>
          ) : (
            <>
              <Copy style={{ width: 14, height: 14 }} /> COPIAR
            </>
          )}
        </button>
      </div>
      <div
        style={{
          backgroundColor: '#020a07',
          border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: 12,
          padding: 14,
          fontSize: 12,
          color: '#cbd5e1',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          fontFamily: 'ui-monospace, monospace',
          maxHeight: 400,
          overflowY: 'auto'
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* ============================================================
   PÁGINA PRINCIPAL
   ============================================================ */
export default function BannersPage() {
  const [copiedId, setCopiedId] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const copyLunes = [
    'Tu tienda Tiendanube tiene visitas. Los Ads funcionan. La gente agrega productos al carrito.',
    'Pero no compran. Se van. Y vos mirás las métricas sin entender qué pasa.',
    '',
    'El 70% de los carritos se abandonan. Eso significa que de cada $100.000 que invertís en tráfico, $70.000 se evaporan porque tu tienda no genera URGENCIA. No hay reloj. No hay escasez. No hay motivo para comprar AHORA.',
    '',
    'Con el Temporizador de Cuenta Regresiva de Nevux, cada visitante ve que la oferta tiene fecha de vencimiento. Se activa en 2 minutos, sin tocar una línea de código, directo desde tu panel de Tiendanube.',
    '',
    'Las tiendas que lo activaron reportan hasta un +23% de conversión en la primera semana.',
    '',
    '💰 ARS $35.000/mes. Con que recuperes 2 carritos al mes, ya estás en ganancia neta.',
    '',
    '👇 Comentá URGENTE y te mando el link para que lo pruebes hoy mismo en tu tienda.',
    '',
    '#Tiendanube #EcommerceArgentina #VentasOnline #CarritosAbandonados #ConversionRate #Nevux #TiendaOnline #MarketingDigital #CRO #PymesArgentina #VentasPorInternet #EcommerceTips'
  ].join('\n');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020a07',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        paddingBottom: 96
      }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: '1px solid rgba(16,185,129,0.2)',
          backgroundColor: '#04140e',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '12px 16px'
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/admin"
              style={{
                padding: 8,
                color: '#94a3b8',
                display: 'flex',
                borderRadius: 8,
                backgroundColor: 'rgba(6,30,20,0.5)',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </Link>
            <NevuxLogo size={28} />
          </div>
          <span
            style={{
              fontSize: 11,
              backgroundColor: 'rgba(16,185,129,0.15)',
              color: '#34d399',
              border: '1px solid rgba(16,185,129,0.3)',
              padding: '4px 10px',
              borderRadius: 9999,
              fontWeight: 600
            }}
          >
            Planificación Semanal
          </span>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1280,
          margin: '20px auto 0',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28
        }}
      >
        {/* FICHA DEL DÍA */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,30,20,0.9) 100%)',
            border: '1px solid rgba(16,185,129,0.35)',
            borderRadius: 16,
            padding: 20
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: '#fff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <Timer style={{ width: 22, height: 22, color: '#34d399' }} />
            Lunes — Urgencia y Carritos Abandonados
          </h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 14px 0' }}>
            Atacamos el dolor #1: carritos que se abandonan por falta de urgencia.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: '⏰ Horario', value: '11:30 hs' },
              { label: '📐 Formato', value: 'Carrusel (6 slides)' },
              { label: '🧩 Widget', value: 'Temporizador Cuenta Regresiva' }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#020a07',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 10,
                  padding: '8px 14px',
                  minWidth: 140
                }}
              >
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#34d399',
                    fontWeight: 800,
                    marginTop: 2
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARRUSEL */}
        <div
          style={{
            backgroundColor: '#061e14',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#34d399',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingBottom: 8,
              borderBottom: '1px solid rgba(16,185,129,0.15)'
            }}
          >
            <ImageIcon style={{ width: 16, height: 16 }} /> CARRUSEL — 6 slides
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              alignItems: 'center'
            }}
          >
            {/* SLIDE 1 - HOOK */}
            <SlideWrapper label="Slide 1 — HOOK">
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#f87171',
                    letterSpacing: '0.1em'
                  }}
                >
                  🚨 ALERTA PARA DUEÑOS DE TIENDA
                </div>
                <h3
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.1,
                    margin: 0
                  }}
                >
                  Tu tienda pierde ventas{' '}
                  <span style={{ color: '#10B981' }}>MIENTRAS dormís.</span>
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: '#cbd5e1',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  Y no es culpa de tus Ads. Te muestro el error exacto 👉
                </p>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  backgroundColor: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 10,
                  padding: 8
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: '#34d399',
                    fontWeight: 700,
                    margin: 0
                  }}
                >
                  DESLIZÁ →
                </p>
              </div>
            </SlideWrapper>

            {/* SLIDE 2 - PROBLEMA */}
            <SlideWrapper label="Slide 2 — PROBLEMA">
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#facc15',
                    letterSpacing: '0.1em'
                  }}
                >
                  📊 EL DATO QUE NADIE TE DICE
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  El{' '}
                  <span style={{ color: '#10B981', fontSize: 42 }}>70%</span>{' '}
                  de los carritos en Tiendanube se abandonan.
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: '#cbd5e1',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  De cada 10 que agregan al carrito,{' '}
                  <strong style={{ color: '#f87171' }}>
                    7 se van sin pagar.
                  </strong>
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 5,
                    flexWrap: 'wrap'
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={'g-' + i}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: '#10B981',
                        boxShadow: '0 0 8px rgba(16,185,129,0.5)'
                      }}
                    />
                  ))}
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={'gr-' + i}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: 'rgba(248,113,113,0.2)',
                        border: '1px dashed #f87171'
                      }}
                    />
                  ))}
                </div>
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#64748b',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                🟢 Compran · 🔴 Abandonan
              </p>
            </SlideWrapper>

            {/* SLIDE 3 - IMPLICACIÓN */}
            <SlideWrapper label="Slide 3 — IMPLICACIÓN">
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#f87171',
                    letterSpacing: '0.1em'
                  }}
                >
                  💸 HACÉ LA CUENTA
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  Si gastás{' '}
                  <span style={{ color: '#facc15' }}>$100.000/mes</span> en Ads y
                  tu conversión es del 1%...
                </h3>
                <div
                  style={{
                    backgroundColor: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.4)',
                    borderRadius: 14,
                    padding: 18,
                    textAlign: 'center'
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: '#f87171',
                      fontWeight: 700,
                      margin: 0
                    }}
                  >
                    ESTÁS TIRANDO
                  </p>
                  <p
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: '#f87171',
                      margin: '4px 0',
                      lineHeight: 1
                    }}
                  >
                    $70.000 🔥
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#cbd5e1',
                      margin: 0
                    }}
                  >
                    en carritos que nunca cerraron.
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#64748b',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                Todos los meses. Sin que te des cuenta.
              </p>
            </SlideWrapper>

            {/* SLIDE 4 - SOLUCIÓN */}
            <SlideWrapper label="Slide 4 — SOLUCIÓN NEVUX">
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#34d399',
                    letterSpacing: '0.1em'
                  }}
                >
                  ✅ LA SOLUCIÓN
                </div>
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  Urgencia real en{' '}
                  <span style={{ color: '#10B981' }}>2 minutos.</span>
                </h3>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: 16,
                    padding: 20,
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(16,185,129,0.3)'
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: '#FFFFFF',
                      fontWeight: 800,
                      margin: 0,
                      letterSpacing: '0.1em',
                      opacity: 0.9
                    }}
                  >
                    ⏱️ OFERTA EXPIRA EN
                  </p>
                  <p
                    style={{
                      fontSize: 44,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      margin: '6px 0 0 0',
                      lineHeight: 1,
                      fontFamily: 'ui-monospace, monospace'
                    }}
                  >
                    14:32:08
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#cbd5e1',
                    textAlign: 'center',
                    margin: 0
                  }}
                >
                  Sin código. Sin diseñador. 2 clics en tu Tiendanube.
                </p>
              </div>
            </SlideWrapper>

            {/* SLIDE 5 - RESULTADO */}
            <SlideWrapper label="Slide 5 — RESULTADO">
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  position: 'relative',
                  zIndex: 1,
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#34d399',
                    letterSpacing: '0.1em'
                  }}
                >
                  📈 RESULTADO COMPROBADO
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: '#cbd5e1',
                    margin: 0,
                    lineHeight: 1.4
                  }}
                >
                  Tiendas que activaron este widget vieron hasta un
                </p>
                <div
                  style={{
                    position: 'relative',
                    padding: '20px 30px'
                  }}
                >
                  <p
                    style={{
                      fontSize: 72,
                      fontWeight: 900,
                      color: '#10B981',
                      margin: 0,
                      lineHeight: 1,
                      textShadow: '0 0 30px rgba(16,185,129,0.5)'
                    }}
                  >
                    +23%
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 16,
                    color: '#fff',
                    fontWeight: 800,
                    margin: 0
                  }}
                >
                  de conversión en 7 días
                </p>
                <div
                  style={{
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 10,
                    padding: '8px 16px',
                    marginTop: 8
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: '#34d399',
                      fontWeight: 700,
                      margin: 0
                    }}
                  >
                    Sin cambiar producto. Sin más Ads.
                  </p>
                </div>
              </div>
            </SlideWrapper>

            {/* SLIDE 6 - CTA FINAL */}
            <SlideWrapper label="Slide 6 — CTA FINAL">
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#10B981',
                    letterSpacing: '0.1em'
                  }}
                >
                  🚀 TU TURNO
                </div>
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.1,
                    margin: 0
                  }}
                >
                  Dejá de perder{' '}
                  <span style={{ color: '#10B981' }}>carritos hoy.</span>
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: '#cbd5e1',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  Activá el Temporizador de Nevux en tu Tiendanube en 2 minutos.
                </p>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: 14,
                    padding: 16,
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(16,185,129,0.4)'
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      margin: 0
                    }}
                  >
                    💬 Comentá &quot;URGENTE&quot;
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#FFFFFF',
                      fontWeight: 700,
                      margin: '4px 0 0 0',
                      opacity: 0.9
                    }}
                  >
                    y te mando el acceso directo
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#64748b',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                ARS $35.000/mes · Sin permanencia · +41 widgets
              </p>
            </SlideWrapper>
          </div>
        </div>

        {/* STORIES */}
        <div
          style={{
            backgroundColor: '#061e14',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#34d399',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingBottom: 8,
              borderBottom: '1px solid rgba(16,185,129,0.15)'
            }}
          >
            <Eye style={{ width: 16, height: 16 }} /> STORIES — 4 historias del día
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              justifyContent: 'center'
            }}
          >
            {/* STORY 1 */}
            <div
              style={{
                width: '100%',
                maxWidth: 320,
                aspectRatio: '9/16',
                backgroundColor: '#020a07',
                border: '2px solid rgba(16,185,129,0.3)',
                borderRadius: 24,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  ¿Cuántos carritos abandonados tuviste{' '}
                  <span style={{ color: '#10B981' }}>ayer</span>?
                </h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: '#f0fdf4',
                      border: '2px solid #10B981',
                      borderRadius: 12,
                      padding: 14,
                      textAlign: 'center',
                      fontWeight: 900,
                      color: '#1e293b',
                      fontSize: 12
                    }}
                  >
                    Menos de 5 😌
                  </div>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: '#fef2f2',
                      border: '2px solid #f87171',
                      borderRadius: 12,
                      padding: 14,
                      textAlign: 'center',
                      fontWeight: 900,
                      color: '#1e293b',
                      fontSize: 12
                    }}
                  >
                    Más de 10 😰
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#94a3b8',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                Sticker de encuesta arriba 👆
              </p>
            </div>

            {/* STORY 2 */}
            <div
              style={{
                width: '100%',
                maxWidth: 320,
                aspectRatio: '9/16',
                backgroundColor: '#020a07',
                border: '2px solid rgba(16,185,129,0.3)',
                borderRadius: 24,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  Alguien agrega un producto y{' '}
                  <span style={{ color: '#f87171' }}>NO tiene motivo</span> para
                  comprar YA.
                </h3>
                <div
                  style={{
                    backgroundColor: '#111827',
                    borderRadius: 12,
                    padding: 14,
                    textAlign: 'center'
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: '#f87171',
                      fontWeight: 800,
                      margin: 0
                    }}
                  >
                    🛒 Carrito abandonado hace 2 min
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      margin: '6px 0 0 0'
                    }}
                  >
                    Sin urgencia = sin compra
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#94a3b8',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                Captura de carrito real 👆
              </p>
            </div>

            {/* STORY 3 */}
            <div
              style={{
                width: '100%',
                maxWidth: 320,
                aspectRatio: '9/16',
                backgroundColor: '#020a07',
                border: '2px solid rgba(16,185,129,0.3)',
                borderRadius: 24,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  Así se ve tu tienda con el{' '}
                  <span style={{ color: '#10B981' }}>Temporizador Nevux</span> 👇
                </h3>
                <div
                  style={{
                    backgroundColor: '#10B981',
                    borderRadius: 12,
                    padding: 14,
                    textAlign: 'center'
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: '#FFFFFF',
                      fontWeight: 800,
                      margin: 0
                    }}
                  >
                    🔥 ¡OFERTA EXPIRA EN!
                  </p>
                  <p
                    style={{
                      fontSize: 22,
                      color: '#FFFFFF',
                      fontWeight: 900,
                      margin: '4px 0 0 0'
                    }}
                  >
                    14:32:08
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#34d399',
                    fontWeight: 700,
                    textAlign: 'center',
                    margin: 0
                  }}
                >
                  2 clics. Cero código.
                </p>
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#94a3b8',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                Mockup de tienda Tiendanube 👆
              </p>
            </div>

            {/* STORY 4 */}
            <div
              style={{
                width: '100%',
                maxWidth: 320,
                aspectRatio: '9/16',
                backgroundColor: '#020a07',
                border: '2px solid rgba(16,185,129,0.3)',
                borderRadius: 24,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <NevuxLogo size={24} />
              <div
                style={{
                  margin: 'auto 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0,
                    textAlign: 'center'
                  }}
                >
                  ¿Querés dejar de perder ventas{' '}
                  <span style={{ color: '#10B981' }}>mientras dormís</span>?
                </h3>
                <div
                  style={{
                    backgroundColor: '#10B981',
                    borderRadius: 14,
                    padding: 16,
                    textAlign: 'center'
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      margin: 0
                    }}
                  >
                    🔗 ACTIVAR NEVUX PRO →
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: '#cbd5e1',
                    textAlign: 'center',
                    margin: 0
                  }}
                >
                  ARS $35.000/mes. Se paga solo con 2 ventas.
                </p>
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#94a3b8',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                Sticker de enlace a WhatsApp 👆
              </p>
            </div>
          </div>
        </div>

        {/* COPY */}
        <CopyBlock
          id="lunes"
          title="Descripción Carrusel Lunes (Urgencia / Carritos)"
          text={copyLunes}
          copied={copiedId === 'lunes'}
          onCopy={handleCopy}
        />
      </main>
    </div>
  );
          }
