'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Gift,
  Eye,
  Clock,
  Film,
  Play,
  Zap,
  MessageCircle,
  AlertTriangle,
  Mail,
  Smartphone,
  Users,
  Sparkles,
  BarChart2,
} from 'lucide-react';

/* ─── Logo Oficial NEVUX (Isologotipo con N real) ─── */
function NevuxLogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nvxRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#505050" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="nvxDiagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E0E0E0" />
          <stop offset="85%" stopColor="#606060" />
          <stop offset="100%" stopColor="#101010" />
        </linearGradient>
      </defs>
      {/* Columna izquierda blanca sólida */}
      <rect x="20" y="20" width="13" height="54" fill="#FFFFFF" />
      {/* Columna derecha degradada */}
      <rect x="67" y="20" width="13" height="35" fill="url(#nvxRightGrad)" />
      {/* Diagonal extendida */}
      <polygon points="20,20 33,20 96,96 80,96" fill="url(#nvxDiagGrad)" />
    </svg>
  );
}

function NevuxLogo({ size = 24 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <NevuxLogoMark size={size} />
      <span
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          fontSize: size * 0.65,
          letterSpacing: '0.08em',
          color: '#fff',
        }}
      >
        NEVUX
      </span>
    </div>
  );
}

/* ─── Wrapper Portada Reel (9:16) con Logo SOLO arriba a la izquierda ─── */
function ReelCover({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#10B981',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {label}
      </div>
      <div
        style={{
          aspectRatio: '9/16',
          maxWidth: 360,
          background: '#020a07',
          border: '2px solid rgba(16,185,129,0.3)',
          borderRadius: 24,
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo Nevux ÚNICAMENTE en la parte superior izquierda */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <NevuxLogo size={20} />
        </div>

        {/* Glow decorativo */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            background:
              'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 28,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Bloque de copy con botón copiar ─── */
function CopyBlock({
  id,
  title,
  text,
  copied,
  onCopy,
}: {
  id: string;
  title: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      style={{
        background: '#061e14',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#10B981',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {title}
        </span>
        <button
          onClick={onCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: copied ? '#059669' : 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 8,
            padding: '6px 14px',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: '#d1d5db',
          fontSize: 13,
          lineHeight: 1.7,
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
        }}
      >
        {text}
      </pre>
    </div>
  );
}

/* ─── Card de escena para Reel ─── */
function SceneCard({
  time,
  title,
  color,
  visual,
  texto,
  voz,
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
        background: '#061e14',
        border: '1px solid rgba(16,185,129,0.15)',
        borderLeft: '4px solid ' + color,
        borderRadius: 12,
        padding: 18,
        marginBottom: 14,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            background: color,
            color: '#000',
            fontSize: 11,
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 6,
          }}
        >
          {time}
        </span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>📹</span>
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#34d399',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Visual
            </span>
            <p
              style={{
                color: '#d1d5db',
                fontSize: 12,
                margin: '2px 0 0',
                lineHeight: 1.5,
              }}
            >
              {visual}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>📝</span>
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#facc15',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Texto en pantalla
            </span>
            <p
              style={{
                color: '#d1d5db',
                fontSize: 12,
                margin: '2px 0 0',
                lineHeight: 1.5,
              }}
            >
              {texto}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>🎙️</span>
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#60a5fa',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Voz en off
            </span>
            <p
              style={{
                color: '#d1d5db',
                fontSize: 12,
                margin: '2px 0 0',
                lineHeight: 1.5,
              }}
            >
              {voz}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL — JUEVES: CAPTACIÓN DE LEADS (REEL 28s)
   ════════════════════════════════════════════════════════════ */
export default function BannersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ── Copy Jueves ── */
  const copyJueves = [
    '🎁 El 97% de las visitas que entran a tu Tiendanube se van sin comprar nada.',
    '',
    '¿Y sabés qué es lo peor?',
    'Que no tenés ni su Email ni su WhatsApp para volver a contactarlos.',
    '',
    'Estás tirando plata en publicidad para traer visitas que se pierden para siempre.',
    '',
    'Con el widget "Raspá y Gana" de Nevux cambiás las reglas del juego:',
    '',
    '🎮 Convertís la captación en un juego interactivo irresistible.',
    '📱 El visitante raspa la tarjeta desde su celular para descubrir su premio.',
    '📲 Desbloquea su descuento o regalo dejando su WhatsApp o Email.',
    '🔥 Tu lista de contactos calientes crece automáticamente todos los días.',
    '',
    'Dejá de perder visitas. Empezá a capturar clientes.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá LEADS y te muestro cómo activarlo en tu tienda en menos de 2 minutos. 👇',
    '',
    '#Tiendanube #CaptacionDeLeads #RaspaYGana #EcommerceArgentina #VentasOnline #Nevux #Remarketing #EmailMarketing #CRO #MarketingDigital #PymesArgentina #TiendaOnline #ConversionRate',
  ].join('\n');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020a07',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ─── Header Principal ─── */}
      <header
        style={{
          background: '#04140e',
          borderBottom: '1px solid rgba(16,185,129,0.15)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Link
          href="/admin"
          style={{
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <div style={{ flex: 1 }} />
        <NevuxLogo size={22} />
      </header>

      <main
        style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 80px' }}
      >
        {/* ─── Título ─── */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            marginBottom: 6,
            background: 'linear-gradient(135deg, #fff 30%, #10B981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          📅 Jueves — Captación de Leads con Raspá y Gana
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
          Contenido semanal · Nevux para Tiendanube · Semana 1
        </p>

        {/* ══════════════════════════════════════════
            FICHA DEL DÍA
        ══════════════════════════════════════════ */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,30,20,0.9) 100%)',
            border: '1px solid rgba(16,185,129,0.35)',
            borderRadius: 20,
            padding: 28,
            marginBottom: 40,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Gift size={22} style={{ color: '#10B981' }} />
            Ficha del Día
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}
          >
            {[
              { icon: Clock, label: 'Horario', value: '19:30 hs' },
              { icon: Film, label: 'Formato', value: 'Reel · 28 segundos' },
              { icon: Gift, label: 'Widget', value: 'Raspá y Gana (Gamificación)' },
            ].map((item, i) => (
              <div
                key={'ficha-' + i}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  border: '1px solid rgba(16,185,129,0.12)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <item.icon size={14} style={{ color: '#10B981' }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            REEL — PORTADA + FICHA TÉCNICA
        ══════════════════════════════════════════ */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Film size={20} style={{ color: '#10B981' }} />
          REEL — Portada + Guión
        </h2>

        {/* ── PORTADA DEL REEL ── */}
        <ReelCover label="Portada del Reel">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              textAlign: 'center',
            }}
          >
            {/* Icono regalo o tarjeta raspable */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -20,
                  borderRadius: '50%',
                  border: '2px solid rgba(16,185,129,0.12)',
                }}
              />
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 35px rgba(16,185,129,0.35)',
                }}
              >
                <Sparkles size={34} style={{ color: '#fff' }} />
              </div>
            </div>

            <h3
              style={{
                fontSize: 26,
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                margin: 0,
              }}
            >
              El <span style={{ color: '#f87171' }}>97%</span> de tus visitas{' '}
              <span style={{ color: '#f87171' }}>se van</span> sin dejar su mail
            </h3>

            <p
              style={{
                fontSize: 13,
                color: '#9ca3af',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Transformá visitas en clientes con Raspá y Gana 🎮
            </p>

            {/* Badge de tiempo */}
            <div
              style={{
                background: 'rgba(0,0,0,0.5)',
                borderRadius: 8,
                padding: '6px 14px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Play size={12} style={{ color: '#10B981' }} />
              <span
                style={{ fontSize: 12, fontWeight: 700, color: '#d1d5db' }}
              >
                0:28
              </span>
            </div>
          </div>
        </ReelCover>

        {/* ── FICHA TÉCNICA DEL REEL ── */}
        <div
          style={{
            background: '#061e14',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#10B981',
              marginBottom: 16,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            🎬 Ficha Técnica del Reel
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            {[
              { label: 'Duración', value: '28 segundos' },
              { label: 'Formato', value: '9:16 vertical' },
              { label: 'Música', value: 'Beat dinámico / Gamificación' },
              { label: 'Tono', value: 'Entretenido, enfocado en crecimiento' },
              { label: 'Hook visual', value: 'Dedo raspando tarjeta virtual' },
              { label: 'CTA final', value: 'Comentá LEADS' },
            ].map((item, i) => (
              <div
                key={'tech-' + i}
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#6b7280',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    margin: '4px 0 0',
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── GUIÓN ESCENA POR ESCENA ── */}
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Zap size={16} style={{ color: '#facc15' }} />
          Guión Escena por Escena
        </h3>

        <SceneCard
          time="0–4s"
          title="HOOK — Tráfico desperdiciado"
          color="#f87171"
          visual="Celular mostrando una Tiendanube. El usuario navega unos segundos y desliza hacia arriba para cerrar la pestaña sin comprar nada."
          texto="El 97% de tus visitas se van sin comprar nada 🚪"
          voz="De cada cien personas que entran a tu Tiendanube, noventa y siete se van con las manos vacías y sin dejarte su contacto."
        />

        <SceneCard
          time="4–9s"
          title="PROBLEMA — Placa perdida"
          color="#facc15"
          visual="Se muestra la interfaz de Meta Ads gastando dinero en publicidad y un contador de visitas que no se convierte en contactos."
          texto="Anuncios caros + Visitas anónimas = Dinero tirado 📉"
          voz="Pagas por traerlos, pero si no compran al instante, los perdiste para siempre porque no tenés ni su mail ni su WhatsApp."
        />

        <SceneCard
          time="9–17s"
          title="SOLUCIÓN — Widget Raspá y Gana"
          color="#10B981"
          visual="Aparece la tarjeta interactiva de 'Raspá y Gana' de Nevux. Un dedo raspa la superficie gris y revela '¡GANASTE 15% OFF!'. Inmediatamente pide ingresar WhatsApp o Mail para enviarle el cupón."
          texto="🎮 Widget Raspá y Gana — Captación Gamificada"
          voz="Con el widget Raspá y Gana de Nevux, transformás la captación en un juego irresistible. El cliente raspa en pantalla, se entusiasma y te deja su WhatsApp feliz para reclamar su premio."
        />

        <SceneCard
          time="17–23s"
          title="BENEFICIO — Base de datos caliente"
          color="#60a5fa"
          visual="Un panel de contactos de Nevux sumando leads en tiempo real con iconos de WhatsApp y Mail ingresando continuamente."
          texto="Base de contactos creciendo en piloto automático 🚀"
          voz="Ahora tenés una lista de clientes calientes a los que podés escribirles por WhatsApp o email marketing cuando quieras."
        />

        <SceneCard
          time="23–28s"
          title="CTA FINAL"
          color="#10B981"
          visual="Fondo oscuro con el logo de Nevux arriba a la izquierda, la frase '50 Widgets + 6 funciones para impulsar tu Tiendanube' en una placa esmeralda destacada."
          texto="50 Widgets + 6 funciones · Comentá LEADS 👇"
          voz="Accedé a 50 Widgets y 6 funciones para impulsar tu Tiendanube. Comentá LEADS y te muestro cómo activarlo en dos minutos."
        />

        {/* ══════════════════════════════════════════
            STORIES DEL DÍA — 4 STORIES
        ══════════════════════════════════════════ */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 24,
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Eye size={20} style={{ color: '#10B981' }} />
          STORIES DEL DÍA — 4 Stories
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {/* Story 1: Encuesta */}
          <div
            style={{
              aspectRatio: '9/16',
              background: '#020a07',
              border: '2px solid rgba(16,185,129,0.3)',
              borderRadius: 20,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div
              style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}
            >
              <NevuxLogo size={16} />
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 12,
                paddingTop: 24,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#facc15',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                📊 ENCUESTA
              </span>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                ¿Pedís el <span style={{ color: '#10B981' }}>WhatsApp</span> a
                las visitas que entran a tu tienda?
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '1.5px solid rgba(248,113,113,0.3)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#f87171',
                    }}
                  >
                    No, se me van 😢
                  </span>
                </div>
                <div
                  style={{
                    background: 'rgba(16,185,129,0.12)',
                    border: '1.5px solid rgba(16,185,129,0.35)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#10B981',
                    }}
                  >
                    Sí, capto contactos 📲
                  </span>
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: 9,
                color: '#4b5563',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              STORY 1/4
            </span>
          </div>

          {/* Story 2: Dolor */}
          <div
            style={{
              aspectRatio: '9/16',
              background: '#020a07',
              border: '2px solid rgba(248,113,113,0.25)',
              borderRadius: 20,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div
              style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}
            >
              <NevuxLogo size={16} />
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 12,
                paddingTop: 24,
              }}
            >
              <AlertTriangle size={24} style={{ color: '#f87171' }} />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Traer visitas cuesta plata. Dejarlas ir anónimas es un error.
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Si no compraste su contacto, tu anuncio salió carísimo.
              </p>
            </div>
            <span
              style={{
                fontSize: 9,
                color: '#4b5563',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              STORY 2/4
            </span>
          </div>

          {/* Story 3: Demo Raspá y Gana */}
          <div
            style={{
              aspectRatio: '9/16',
              background: '#020a07',
              border: '2px solid rgba(16,185,129,0.3)',
              borderRadius: 20,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div
              style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}
            >
              <NevuxLogo size={16} />
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
                paddingTop: 24,
              }}
            >
              <Gift size={26} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Raspá y Gana 🎮
              </p>
              <div
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  borderRadius: 10,
                  padding: 10,
                  width: '100%',
                  border: '1px dashed rgba(16,185,129,0.3)',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: '#34d399',
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  ¡Ganaste 15% OFF! 🎁
                </p>
                <span
                  style={{
                    fontSize: 9,
                    color: '#9ca3af',
                    display: 'block',
                    marginTop: 4,
                  }}
                >
                  Ingresá tu WhatsApp para recibir la clave
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: 9,
                color: '#4b5563',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              STORY 3/4
            </span>
          </div>

          {/* Story 4: CTA */}
          <div
            style={{
              aspectRatio: '9/16',
              background: '#020a07',
              border: '2px solid rgba(16,185,129,0.35)',
              borderRadius: 20,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div
              style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}
            >
              <NevuxLogo size={16} />
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 14,
                textAlign: 'center',
                paddingTop: 24,
              }}
            >
              <Users size={26} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Captá clientes antes de que se vayan
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                50 Widgets + 6 funciones para impulsar tu Tiendanube
              </p>
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #10B981, #059669)',
                  borderRadius: 10,
                  padding: '10px 18px',
                  width: '100%',
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: '#fff',
                    margin: 0,
                    fontWeight: 800,
                  }}
                >
                  🔗 Link en bio
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: 9,
                color: '#4b5563',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              STORY 4/4
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            COPY / DESCRIPCIÓN FINAL
        ══════════════════════════════════════════ */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <MessageCircle size={20} style={{ color: '#10B981' }} />
          COPY / DESCRIPCIÓN
        </h2>

        <CopyBlock
          id="copy-jueves"
          title="Copy Jueves — Captación de Leads (Reel)"
          text={copyJueves}
          copied={copiedId === 'copy-jueves'}
          onCopy={() => handleCopy('copy-jueves', copyJueves)}
        />

        {/* ─── Footer Página ─── */}
        <div
          style={{
            marginTop: 48,
            padding: '20px 0',
            borderTop: '1px solid rgba(16,185,129,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#4b5563' }}>
            Nevux · Planificación Semanal · Semana 1
          </span>
          <NevuxLogo size={18} />
        </div>
      </main>
    </div>
  );
          }
