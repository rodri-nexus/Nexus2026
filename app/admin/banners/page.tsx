'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Mic,
  Eye,
  Clock,
  Film,
  Play,
  Zap,
  Volume2,
  MessageCircle,
  AlertTriangle,
  MousePointerClick,
  Palette,
  Globe,
} from 'lucide-react';

/* ─── Logo Oficial NEVUX (Isologotipo con N real según foto) ─── */
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
      {/* Columna izquierda (blanca sólida) */}
      <rect x="20" y="20" width="13" height="54" fill="#FFFFFF" />
      {/* Columna derecha (degradado a oscuro) */}
      <rect x="67" y="20" width="13" height="35" fill="url(#nvxRightGrad)" />
      {/* Diagonal extendida hacia esquina inferior derecha */}
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 28 }}>
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
   PÁGINA PRINCIPAL — MARTES: BUSCADOR POR VOZ (REEL 25s)
   ════════════════════════════════════════════════════════════ */
export default function BannersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ── Copy Martes ── */
  const copyMartes = [
    '🎙️ Tu cliente no quiere escribir. Quiere hablar.',
    '',
    'El 78% del tráfico de tu Tiendanube llega desde el celular.',
    '',
    'Y ahí está el problema que nadie te dice:',
    '',
    'Escribir "zapatillas negras talle 42" en un teclado de 5 centímetros es una tortura.',
    'El cliente se frustra. Borra. Se equivoca. Y en 8 segundos se va a MercadoLibre.',
    '',
    'Con el Buscador por Voz de Nevux:',
    '',
    '✅ Un botón de micrófono flotante en tu tienda',
    '✅ El cliente habla naturalmente desde el celu',
    '✅ La IA entiende español argentino, portugués e inglés',
    '✅ Resultados instantáneos sin tocar el teclado',
    '✅ Personalizás color, posición y texto de escucha',
    '',
    'Menos fricción = más búsquedas = más productos al carrito.',
    '',
    '🔥 Todo esto por ARS $35.000/mes con +41 widgets incluidos.',
    '',
    'Comentá VOZ y te muestro cómo activarlo en menos de 2 minutos. 👇',
    '',
    '#Tiendanube #BuscadorPorVoz #EcommerceArgentina #VentasOnline #Nevux #MobileFirst #UX #VentasPorInternet #CRO #MarketingDigital #PymesArgentina #TiendaOnline #EcommerceTips #ConversionRate',
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
          📅 Martes — Buscador por Voz
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
            <Mic size={22} style={{ color: '#10B981' }} />
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
              { icon: Film, label: 'Formato', value: 'Reel · 25 segundos' },
              { icon: Mic, label: 'Widget', value: 'Buscador por Voz' },
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
            {/* Icono micrófono grande con ondas */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -24,
                  borderRadius: '50%',
                  border: '2px solid rgba(16,185,129,0.12)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: -42,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(16,185,129,0.06)',
                }}
              />
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(16,185,129,0.35)',
                }}
              >
                <Mic size={36} style={{ color: '#fff' }} />
              </div>
            </div>

            <h3
              style={{
                fontSize: 28,
                fontWeight: 900,
                lineHeight: 1.1,
                color: '#fff',
                margin: 0,
              }}
            >
              Tu cliente{' '}
              <span style={{ color: '#f87171', textDecoration: 'line-through' }}>
                escribe
              </span>
              <br />
              <span style={{ color: '#10B981' }}>habla</span>
            </h3>

            <p
              style={{
                fontSize: 14,
                color: '#9ca3af',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Buscador por Voz para Tiendanube
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
                0:25
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
              { label: 'Duración', value: '25 segundos' },
              { label: 'Formato', value: '9:16 vertical' },
              { label: 'Música', value: 'Lo-fi tech suave, volumen bajo' },
              { label: 'Tono', value: 'Directo, urgente, demo rápida' },
              { label: 'Hook visual', value: 'Micrófono con ondas animadas' },
              { label: 'CTA final', value: 'Comentá VOZ' },
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
          title="HOOK — Dolor mobile"
          color="#f87171"
          visual="Pantalla de celular con una barra de búsqueda de Tiendanube. El usuario intenta escribir &quot;zapatillas negras talle 42&quot; y se equivoca dos veces. Se ve el cursor parpadeando y el texto borrándose."
          texto="El 78% de tus visitas llegan del celular 📱"
          voz="Tu cliente quiere buscar un producto en tu tienda desde el celular. Y escribir en un teclado de cinco centímetros es una tortura."
        />

        <SceneCard
          time="4–9s"
          title="PROBLEMA — Abandono"
          color="#facc15"
          visual="El usuario borra todo, suspira (gesto de frustración), y la pantalla cambia a la home de MercadoLibre. Transición rápida con efecto de swipe."
          texto="8 segundos y se va a MercadoLibre 💸"
          voz="Se frustra, borra, se equivoca otra vez. Y en ocho segundos se fue a tu competencia."
        />

        <SceneCard
          time="9–16s"
          title="SOLUCIÓN — Demo del micrófono"
          color="#10B981"
          visual="Aparece el botón de micrófono flotante de Nevux en la esquina inferior derecha de la tienda (color #10B981 con ondas animadas). El usuario lo toca, habla &quot;zapatillas negras talle 42&quot;, y al instante aparecen los resultados. Se muestra el texto &quot;Escuchando... Decí lo que buscás&quot; mientras escucha."
          texto="🎙️ Buscador por Voz de Nevux — Hablá y listo"
          voz="Con el Buscador por Voz de Nevux, tu cliente toca el micrófono, habla naturally, y la IA le muestra los resultados al instante. Sin teclado, sin errores."
        />

        <SceneCard
          time="16–21s"
          title="PERSONALIZACIÓN — Config rápida"
          color="#60a5fa"
          visual="Split screen rápido mostrando las opciones de configuración: posición del botón (inferior derecha, izquierda, barra flotante), selector de color (#10B981), y selector de idioma (🇦🇷 Español AR, 🇧🇷 Português, 🇺🇸 English). Todo en el panel de Nevux."
          texto="Color · Posición · Idioma 🇦🇷🇧🇷🇺🇸 — 100% personalizable"
          voz="Elegís la posición, el color, el idioma. Español argentino, portugués, inglés. Todo desde el panel de Nevux en un clic."
        />

        <SceneCard
          time="21–25s"
          title="CTA FINAL"
          color="#10B981"
          visual="Fondo oscuro con el logo de Nevux centrado arriba, el micrófono verde pulsando, y el texto del CTA apareciendo con animación de typewriter. Precio y badge de +41 widgets debajo."
          texto="ARS $35.000/mes · +41 widgets · Comentá VOZ 👇"
          voz="Activá el Buscador por Voz por treinta y cinco mil pesos al mes con más de cuarenta y un widgets incluidos. Comentá VOZ y te lo activo en dos minutos."
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
            {/* Logo Nevux arriba a la izquierda únicamente */}
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
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
                ¿Tu tienda tiene{' '}
                <span style={{ color: '#10B981' }}>buscador por voz</span>?
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
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#f87171',
                    }}
                  >
                    No, solo texto 😬
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
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#10B981',
                    }}
                  >
                    Sí, ya lo tengo 🎙️
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
            {/* Logo Nevux arriba a la izquierda únicamente */}
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
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
                Tu cliente busca{' '}
                <span style={{ color: '#facc15' }}>&quot;zapa negras&quot;</span>{' '}
                y tu buscador no entiende nada
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                0 resultados. El cliente se va. 💸
              </p>
              <div
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  borderRadius: 8,
                  padding: 10,
                  border: '1px solid rgba(248,113,113,0.15)',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: '#fca5a5',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  ⚠️ 68% de búsquedas mobile tienen errores de tipeo
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
              STORY 2/4
            </span>
          </div>

          {/* Story 3: Demo Mic */}
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
            {/* Logo Nevux arriba a la izquierda únicamente */}
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
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
                paddingTop: 24,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#10B981',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                🎙️ ASÍ FUNCIONA
              </span>
              <div style={{ position: 'relative', margin: '4px 0' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: -12,
                    borderRadius: '50%',
                    border: '2px solid rgba(16,185,129,0.15)',
                  }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #10B981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                  }}
                >
                  <Mic size={20} style={{ color: '#fff' }} />
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  border: '1px solid rgba(16,185,129,0.15)',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: '#34d399',
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  🎧 Escuchando...
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    margin: '4px 0 0',
                    fontWeight: 700,
                  }}
                >
                  &quot;Vestido floreado&quot;
                </p>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                Sin teclado. Sin errores.
                <br />
                Resultados instantáneos. ⚡
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
            {/* Logo Nevux arriba a la izquierda únicamente */}
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
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
              <Volume2 size={26} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Activá el{' '}
                <span style={{ color: '#10B981' }}>micrófono</span> en tu
                tienda hoy
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                ARS $35.000/mes
                <br />
                +41 widgets incluidos
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { icon: MousePointerClick, text: 'Posición' },
                  { icon: Palette, text: 'Color' },
                  { icon: Globe, text: 'Idioma' },
                ].map((f, i) => (
                  <div
                    key={'feat-' + i}
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      borderRadius: 6,
                      padding: '5px 8px',
                      border: '1px solid rgba(16,185,129,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <f.icon size={10} style={{ color: '#10B981' }} />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#34d399',
                      }}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
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
          id="copy-martes"
          title="Copy Martes — Buscador por Voz (Reel)"
          text={copyMartes}
          copied={copiedId === 'copy-martes'}
          onCopy={() => handleCopy('copy-martes', copyMartes)}
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
