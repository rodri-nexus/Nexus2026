'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  TrendingUp,
  Eye,
  Image as ImageIcon,
  Clock,
  ChevronRight,
  Zap,
  ShoppingCart,
  Truck,
  PlusCircle,
  BarChart3,
  MessageCircle,
  AlertCircle,
  Percent,
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

/* ─── Wrapper Slide Carrusel (4:5) con Logo SOLO arriba a la izquierda ─── */
function SlideWrapper({
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
          aspectRatio: '4/5',
          maxWidth: 420,
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

/* ════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL — MIÉRCOLES: TICKET PROMEDIO (CARRUSEL 7 SLIDES)
   ════════════════════════════════════════════════════════════ */
export default function BannersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ── Copy Miércoles ── */
  const copyMiercoles = [
    '🛒 ¿Tus clientes entran a tu tienda, compran 1 solo producto y se van?',
    '',
    'Estás dejando dinero sobre la mesa en cada pedido.',
    '',
    'El costo de envío frena las compras grandes y adquirir un cliente nuevo es cada vez más caro.',
    '',
    'La clave para escalar la facturación de tu Tiendanube no es conseguir más visitas... es aumentar el TICKET PROMEDIO de las visitas que ya tenés.',
    '',
    'Con Nevux lo lográs con 2 funciones clave combinadas:',
    '',
    '1️⃣ Barra Progresiva de Envío Gratis: Le muestra al cliente exactamente cuánto le falta para no pagar envío (ej. "¡Estás a solo $8.500 del Envío Gratis!").',
    '',
    '2️⃣ Order Bump en Carrito: Le ofrece un producto complementario relevante con 1 solo clic antes de finalizar la compra.',
    '',
    '🔥 Resultado: +35% de ticket promedio sin gastar $1 extra en publicidad.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá TICKET y te muestro cómo activarlo en tu tienda en menos de 2 minutos. 👇',
    '',
    '#Tiendanube #TicketPromedio #EnvioGratis #OrderBump #EcommerceArgentina #VentasOnline #Nevux #CRO #MarketingDigital #PymesArgentina #TiendaOnline #EcommerceTips #ConversionRate',
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
          📅 Miércoles — Multiplicá tu Ticket Promedio
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
            <TrendingUp size={22} style={{ color: '#10B981' }} />
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
              { icon: Clock, label: 'Horario', value: '11:30 hs' },
              { icon: ImageIcon, label: 'Formato', value: 'Carrusel · 7 slides' },
              {
                icon: TrendingUp,
                label: 'Funciones',
                value: 'Barra Envío Gratis + Order Bump',
              },
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
            CARRUSEL — 7 SLIDES
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
          <ImageIcon size={20} style={{ color: '#10B981' }} />
          CARRUSEL — 7 Slides
        </h2>

        {/* ── SLIDE 1: HOOK ── */}
        <SlideWrapper label="Slide 1 · Hook">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 12,
                padding: '8px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
              }}
            >
              <ShoppingCart size={14} style={{ color: '#f87171' }} />
              <span
                style={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}
              >
                PROBLEMA COMÚN EN ECOMMERCE
              </span>
            </div>
            <h3
              style={{
                fontSize: 28,
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                margin: 0,
              }}
            >
              ¿Tus clientes compran{' '}
              <span style={{ color: '#f87171' }}>1 solo producto</span> y se
              van?
            </h3>
            <p
              style={{
                fontSize: 16,
                color: '#9ca3af',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Te enseño a lograr que se lleven 2 o 3 productos sin gastar más
              en publicidad.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#4b5563',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Deslizá <ChevronRight size={14} />
          </div>
        </SlideWrapper>

        {/* ── SLIDE 2: SITUACIÓN ── */}
        <SlideWrapper label="Slide 2 · Situación">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#facc15',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              LA REALIDAD DE TU TIENDA
            </span>
            <h3
              style={{
                fontSize: 23,
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#fff',
                margin: 0,
              }}
            >
              Conseguir un cliente nuevo es{' '}
              <span style={{ color: '#facc15' }}>cada vez más caro</span>
            </h3>
            {/* Visual ticket estancado */}
            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 14,
                padding: 18,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, color: '#9ca3af' }}>
                  Pedido promedio actual:
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#f87171',
                  }}
                >
                  1 item por orden
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '30%',
                    height: '100%',
                    background: '#f87171',
                  }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: 14,
                color: '#9ca3af',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Si el ticket promedio no sube, el margen de ganancia se lo traga
              el costo de envío y la publicidad.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#4b5563',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Deslizá <ChevronRight size={14} />
          </div>
        </SlideWrapper>

        {/* ── SLIDE 3: ESTRATEGIA ── */}
        <SlideWrapper label="Slide 3 · Estrategia CRO">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} style={{ color: '#10B981' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#10B981',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                ESTRATEGIA INTELIGENTE
              </span>
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#fff',
                margin: 0,
              }}
            >
              La solución: Incentivar el{' '}
              <span style={{ color: '#10B981' }}>impulso de compra</span> en el
              carrito
            </h3>
            <div
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 14,
                padding: 16,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: '#d1d5db',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                No necesitas más tráfico. Necesitas que las personas que{' '}
                <strong style={{ color: '#fff' }}>ya están listas para comprar</strong>{' '}
                agreguen un producto más antes de pagar.
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#4b5563',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Deslizá <ChevronRight size={14} />
          </div>
        </SlideWrapper>

        {/* ── SLIDE 4: FUNCIÓN 1 — BARRA DE ENVÍO GRATIS ── */}
        <SlideWrapper label="Slide 4 · Función 1: Barra Envío Gratis">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#10B981',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              FUNCIÓN #1
            </span>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#fff',
                margin: 0,
              }}
            >
              Barra Progresiva de <span style={{ color: '#10B981' }}>Envío Gratis</span> 🚚
            </h3>

            {/* Simulación Barra Progresiva */}
            <div
              style={{
                background: '#061e14',
                borderRadius: 14,
                padding: 16,
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#34d399',
                  margin: '0 0 10px',
                  textAlign: 'center',
                }}
              >
                ¡Estás a solo 1 producto del Envío GRATIS! 🎁
              </p>
              <div
                style={{
                  height: 10,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '75%',
                    height: '100%',
                    background:
                      'linear-gradient(90deg, #10B981 0%, #34d399 100%)',
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: '#9ca3af',
                  margin: '8px 0 0',
                  textAlign: 'right',
                }}
              >
                75% completado
              </p>
            </div>

            <p
              style={{
                fontSize: 13,
                color: '#9ca3af',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              El comprador agrega un segundo producto para no tener que pagar
              el costo del envío.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#4b5563',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Deslizá <ChevronRight size={14} />
          </div>
        </SlideWrapper>

        {/* ── SLIDE 5: FUNCIÓN 2 — ORDER BUMP ── */}
        <SlideWrapper label="Slide 5 · Función 2: Order Bump">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#10B981',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              FUNCIÓN #2
            </span>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#fff',
                margin: 0,
              }}
            >
              Order Bump con <span style={{ color: '#10B981' }}>1 solo Clic</span> ⚡
            </h3>

            {/* Simulación Order Bump */}
            <div
              style={{
                background: 'rgba(16,185,129,0.08)',
                borderRadius: 14,
                padding: 16,
                border: '1.5px dashed rgba(16,185,129,0.4)',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 42,
                    height: 48,
                    background: '#1f2937',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  🧦
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    ¿Sumar medias térmicas en promo?
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#10B981',
                      fontWeight: 700,
                      margin: '2px 0 0',
                    }}
                  >
                    Oferta exclusiva en el carrito
                  </p>
                </div>
                <div
                  style={{
                    background: '#10B981',
                    borderRadius: 8,
                    padding: '6px 12px',
                    color: '#000',
                    fontSize: 11,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <PlusCircle size={12} /> Agregar
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: 13,
                color: '#9ca3af',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Ofrece productos adicionales o accesorios directamente en el
              carrito antes de pagar.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#4b5563',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Deslizá <ChevronRight size={14} />
          </div>
        </SlideWrapper>

        {/* ── SLIDE 6: RESULTADOS ── */}
        <SlideWrapper label="Slide 6 · Resultado">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={18} style={{ color: '#10B981' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#10B981',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                RESULTADO MEDIBLE
              </span>
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
              Aumentá tu ticket promedio un{' '}
              <span style={{ color: '#10B981' }}>+35%</span>
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <div
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  borderRadius: 12,
                  padding: 14,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#10B981',
                    margin: 0,
                  }}
                >
                  +2.3
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    margin: '4px 0 0',
                    lineHeight: 1.3,
                  }}
                >
                  Productos promedio por orden
                </p>
              </div>
              <div
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  borderRadius: 12,
                  padding: 14,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#10B981',
                    margin: 0,
                  }}
                >
                  0$
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    margin: '4px 0 0',
                    lineHeight: 1.3,
                  }}
                >
                  Gasto extra en publicidad
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#4b5563',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Deslizá <ChevronRight size={14} />
          </div>
        </SlideWrapper>

        {/* ── SLIDE 7: CTA ── */}
        <SlideWrapper label="Slide 7 · CTA Final">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 18,
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: 24,
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#fff',
                margin: 0,
              }}
            >
              Hacé que cada pedido{' '}
              <span style={{ color: '#10B981' }}>valga más</span>
            </h3>

            {/* Banner de Oferta de Valor */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,30,20,0.9) 100%)',
                border: '1px solid rgba(16,185,129,0.35)',
                borderRadius: 14,
                padding: '16px 20px',
                width: '100%',
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: '#fff',
                  fontWeight: 800,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                50 Widgets + 6 funciones para impulsar tu Tiendanube
              </p>
            </div>

            <div
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '2px solid rgba(16,185,129,0.4)',
                borderRadius: 12,
                padding: '14px 20px',
                width: '100%',
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  color: '#10B981',
                  margin: 0,
                  fontWeight: 900,
                }}
              >
                Comentá TICKET 👇
              </p>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>
                y te muestro cómo activarlo en 2 minutos
              </p>
            </div>
          </div>
        </SlideWrapper>

        {/* ══════════════════════════════════════════
            STORIES DEL DÍA — 5 STORIES
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
          STORIES DEL DÍA — 5 Stories
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
                ¿Cuántos productos promedian tus pedidos?
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
                    1 producto solo 🛒
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
                    2 o más productos 🔥
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
              STORY 1/5
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
              <AlertCircle size={24} style={{ color: '#f87171' }} />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Vender 1 solo producto por orden destruye tus márgenes 📉
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Entre el envío y la publicidad, casi no te queda ganancia.
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
              STORY 2/5
            </span>
          </div>

          {/* Story 3: Demo Barra Envío Gratis */}
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
              <Truck size={24} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Barra de Envío Gratis Progresiva
              </p>
              <div
                style={{
                  background: '#061e14',
                  borderRadius: 10,
                  padding: 10,
                  width: '100%',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: '#34d399',
                    fontWeight: 700,
                    margin: '0 0 6px',
                    textAlign: 'center',
                  }}
                >
                  ¡Falta poco para tu Envío Gratis!
                </p>
                <div
                  style={{
                    height: 6,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '80%',
                      height: '100%',
                      background: '#10B981',
                    }}
                  />
                </div>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                Motiva al cliente a sumar 1 item más.
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
              STORY 3/5
            </span>
          </div>

          {/* Story 4: Demo Order Bump */}
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
              <Percent size={24} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Order Bump en Carrito
              </p>
              <div
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  borderRadius: 10,
                  padding: 10,
                  width: '100%',
                  border: '1px dashed rgba(16,185,129,0.3)',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: '#fff',
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  ¿Sumar accesorios en promo?
                </p>
                <span
                  style={{
                    fontSize: 9,
                    color: '#10B981',
                    fontWeight: 800,
                    display: 'inline-block',
                    marginTop: 4,
                  }}
                >
                  + Agregar en 1 Clic
                </span>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                Ventas adicionales sin fricción.
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
              STORY 4/5
            </span>
          </div>

          {/* Story 5: CTA */}
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
              <TrendingUp size={26} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Aumentá tu <span style={{ color: '#10B981' }}>ticket promedio</span> hoy
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
              STORY 5/5
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
          id="copy-miercoles"
          title="Copy Miércoles — Ticket Promedio (Carrusel)"
          text={copyMiercoles}
          copied={copiedId === 'copy-miercoles'}
          onCopy={() => handleCopy('copy-miercoles', copyMiercoles)}
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
