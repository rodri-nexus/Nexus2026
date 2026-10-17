'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Users,
  Eye,
  Play,
  Film,
  Clock,
  Music,
  Mic
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
   PORTADA REEL (mismo look que Stories/Slides)
   ============================================================ */
function ReelCover({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
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
          aspectRatio: '9/16',
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
   ESCENA DEL REEL
   ============================================================ */
function SceneCard({
  time,
  title,
  color,
  visual,
  texto,
  voz
}: {
  time: string;
  title: string;
  color: string;
  visual: string;
  texto: string;
  voz: string;
}) {
  return (
    <div
      style={{
        backgroundColor: '#020a07',
        borderLeft: '4px solid ' + color,
        borderRadius: 10,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            backgroundColor: color,
            color: color === '#FFFFFF' ? '#111827' : '#FFFFFF',
            fontSize: 10,
            fontWeight: 900,
            padding: '3px 10px',
            borderRadius: 6,
            letterSpacing: '0.05em'
          }}
        >
          {time}
        </span>
        <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>
          {title}
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>
        <strong style={{ color: '#34d399' }}>📹 Visual:</strong> {visual}
      </div>
      <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>
        <strong style={{ color: '#facc15' }}>📝 Texto en pantalla:</strong>{' '}
        {texto}
      </div>
      <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>
        <strong style={{ color: '#60a5fa' }}>🎙️ Voz en off:</strong> {voz}
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

  const copyMartes = [
    'Tu tienda Tiendanube parece un local vacío un viernes a la noche. Y eso está matando tus ventas.',
    '',
    'Cuando un visitante entra a tu tienda y no ve ninguna señal de que otras personas están comprando, su cerebro activa una alerta: ¿Será confiable? ¿Será una estafa? ¿El producto será bueno?',
    '',
    'Resultado: cierra la pestaña y se va a la competencia.',
    '',
    'Con las Notificaciones Flotantes de Nevux, cada nuevo visitante ve en tiempo real: María de Córdoba acaba de comprar Remera Oversize. Es el mismo efecto psicológico que te hace entrar a un restaurante lleno: si otros compran, es seguro.',
    '',
    '📈 Tiendas que activaron este widget duplicaron su tasa de conversión en menos de 14 días.',
    '',
    '💰 ARS $35.000/mes — Menos de lo que gastás en un día de Ads que no convierte.',
    '',
    '👇 Comentá PRUEBA y te mando el acceso para que lo actives hoy en tu tienda. Sin código. Sin diseñador. 2 minutos.',
    '',
    '#Tiendanube #PruebaSocial #EcommerceArgentina #VentasOnline #Nevux #ConversionRate #MarketingDigital #PymesArgentina #TiendaOnline #CRO #SocialProof #EcommerceTips'
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
            <Users style={{ width: 22, height: 22, color: '#34d399' }} />
            Martes — Prueba Social y Confianza
          </h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 14px 0' }}>
            Tu tienda parece vacía. El visitante desconfía y se va. Hoy lo
            solucionamos.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: '⏰ Horario', value: '19:30 hs' },
              { label: '📐 Formato', value: 'Reel (25 segundos)' },
              { label: '🧩 Widget', value: 'Notificaciones Flotantes' }
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
                <div
                  style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}
                >
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

        {/* INFO TÉCNICA DEL REEL */}
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
            <Film style={{ width: 16, height: 16 }} /> FICHA TÉCNICA DEL REEL
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 10
            }}
          >
            {[
              {
                icon: <Clock style={{ width: 16, height: 16 }} />,
                label: 'Duración',
                value: '25 segundos'
              },
              {
                icon: <Film style={{ width: 16, height: 16 }} />,
                label: 'Formato',
                value: '9:16 · 1080x1920'
              },
              {
                icon: <Music style={{ width: 16, height: 16 }} />,
                label: 'Audio',
                value: 'Suspense reveal beat'
              },
              {
                icon: <Mic style={{ width: 16, height: 16 }} />,
                label: 'Voz',
                value: 'Voz en off clara'
              }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#020a07',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 10,
                  padding: 12
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: '#34d399'
                  }}
                >
                  {item.icon}
                  <span style={{ fontSize: 10, fontWeight: 700 }}>
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    fontWeight: 700,
                    marginTop: 4,
                    display: 'block'
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* GUIÓN ESCENA POR ESCENA */}
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
            <Play style={{ width: 16, height: 16 }} /> GUIÓN REEL — Escena por
            escena
          </h3>

          <SceneCard
            time="0-3s"
            title="GANCHO"
            color="#f87171"
            visual="Vos frente a cámara con el celular en la mano. Fondo oscuro, buena luz. Energía alta."
            texto='"Tu tienda parece un local VACÍO. Y eso MATA ventas."'
            voz="Si tu tienda no muestra que otras personas están comprando, el nuevo visitante desconfía y se va."
          />

          <SceneCard
            time="3-8s"
            title="EL PROBLEMA"
            color="#facc15"
            visual="Grabación de pantalla de una tienda Tiendanube genérica, limpia pero sin señales de actividad. Zoom lento al botón de comprar."
            texto='"Sin prueba social = sin confianza."'
            voz="Imaginate entrar a un restaurante vacío un viernes a la noche. ¿Te quedás o te vas?"
          />

          <SceneCard
            time="8-16s"
            title="SOLUCIÓN NEVUX"
            color="#10B981"
            visual="La misma tienda, ahora con notificación flotante verde en la esquina inferior izquierda: María de Córdoba acaba de comprar Remera Oversize. Slide-in animado."
            texto='"Notificaciones de ventas en tiempo real."'
            voz="Con Nevux, cada visitante ve en tiempo real que otras personas están comprando. Es el efecto restaurante lleno aplicado a tu tienda online."
          />

          <SceneCard
            time="16-22s"
            title="RESULTADO"
            color="#10B981"
            visual="Split screen: Izquierda ANTES (conversión 0.8%, tienda vacía). Derecha DESPUÉS (conversión 1.9%, con notificaciones). Números gigantes verdes."
            texto='"Más del doble de conversión."'
            voz="Más del doble de conversión solo por mostrar que tu tienda está viva."
          />

          <SceneCard
            time="22-25s"
            title="CTA FINAL"
            color="#FFFFFF"
            visual="Vos de vuelta a cámara. Sonreí. Fondo verde #10B981 con texto blanco bold grande."
            texto='"Comentá PRUEBA y te muestro cómo."'
            voz="Comentá PRUEBA y te muestro cómo activarlo en 2 minutos."
          />
        </div>

        {/* PORTADA DEL REEL */}
        <div
          style={{
            backgroundColor: '#061e14',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: 'center'
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
              borderBottom: '1px solid rgba(16,185,129,0.15)',
              alignSelf: 'stretch'
            }}
          >
            <Film style={{ width: 16, height: 16 }} /> PORTADA DEL REEL
          </h3>

          <ReelCover label="Portada que se ve en el Feed de Instagram">
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
                🚨 ERROR MORTAL EN TU TIENDA
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
                ¿Tu tienda parece{' '}
                <span style={{ color: '#f87171' }}>VACÍA</span>?
              </h3>
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: 12,
                  padding: 14,
                  boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 10px #FFFFFF'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#FFFFFF',
                      fontWeight: 800,
                      margin: 0,
                      lineHeight: 1.2
                    }}
                  >
                    🛒 María de Córdoba
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: '#FFFFFF',
                      margin: '2px 0 0 0',
                      opacity: 0.9
                    }}
                  >
                    acaba de comprar
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: '#10B981',
                  fontWeight: 800,
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                La prueba social que DUPLICA ventas 🚀
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
                ▶ MIRÁ EL REEL COMPLETO
              </p>
            </div>
          </ReelCover>
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
            <Eye style={{ width: 16, height: 16 }} /> STORIES — 4 historias del
            día
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              justifyContent: 'center'
            }}
          >
            {/* STORY 1 - ENCUESTA */}
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
                  Entrás a una tienda que{' '}
                  <span style={{ color: '#f87171' }}>NO muestra ventas</span>{' '}
                  recientes...
                </h3>
                <div style={{ display: 'flex', gap: 10 }}>
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
                    Desconfío 🚪
                  </div>
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
                    Compro igual 🤷
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

            {/* STORY 2 - DOLOR */}
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
                  Es como entrar a un restaurante{' '}
                  <span style={{ color: '#facc15' }}>vacío</span> un viernes a
                  la noche.
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
                      fontSize: 24,
                      margin: 0
                    }}
                  >
                    🏚️
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#f87171',
                      fontWeight: 700,
                      margin: '6px 0 0 0'
                    }}
                  >
                    Algo no cierra. Te vas.
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#34d399',
                    fontWeight: 800,
                    textAlign: 'center',
                    margin: 0
                  }}
                >
                  En e-commerce pasa lo mismo.
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
                Foto restaurante vacío con filtro oscuro 👆
              </p>
            </div>

            {/* STORY 3 - DEMO */}
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
                  Mirá cómo se ve con las{' '}
                  <span style={{ color: '#10B981' }}>notificaciones Nevux</span>{' '}
                  👇
                </h3>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: 12,
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 10px 30px rgba(16,185,129,0.3)'
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      flexShrink: 0,
                      boxShadow: '0 0 10px #FFFFFF'
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: '#FFFFFF',
                        fontWeight: 800,
                        margin: 0,
                        lineHeight: 1.2
                      }}
                    >
                      Lucas de Rosario
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: '#FFFFFF',
                        margin: '2px 0 0 0',
                        opacity: 0.9
                      }}
                    >
                      compró Zapatillas Urban
                    </p>
                  </div>
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
                  Slide-in animado en tiempo real
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
                Sticker 🔥 de reacción 👆
              </p>
            </div>

            {/* STORY 4 - CTA */}
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
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.2,
                    margin: 0,
                    textAlign: 'center'
                  }}
                >
                  Tu tienda necesita parecer un local{' '}
                  <span style={{ color: '#10B981' }}>LLENO</span>.
                </h3>
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
                      fontSize: 14,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      margin: 0
                    }}
                  >
                    🔗 ACTIVAR PRUEBA SOCIAL →
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
                  Plan Pro: ARS $35.000/mes. +41 widgets.
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
          id="martes"
          title="Descripción Reel Martes (Prueba Social)"
          text={copyMartes}
          copied={copiedId === 'martes'}
          onCopy={handleCopy}
        />
      </main>
    </div>
  );
  }
