'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Layers,
  Eye,
  Image as ImageIcon,
  Clock,
  ChevronRight,
  Zap,
  Sparkles,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  Grid,
  Bot,
  ShieldCheck,
  Rocket,
  BarChart3,
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
   PÁGINA PRINCIPAL — VIERNES: TRANSFORMACIÓN TOTAL / ECOSISTEMA
   ════════════════════════════════════════════════════════════ */
export default function BannersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ── Copy Viernes ── */
  const copyViernes = [
    '⚡ ¿Tu Tiendanube se ve igual a las miles de tiendas que hay en internet?',
    '',
    'El problema no es tu producto ni tus precios. El problema es la FALTA DE OPTIMIZACIÓN de tu tienda.',
    '',
    'Si no generás urgencia, si no mostrás prueba social en vivo y si no ayudás al cliente a encontrar lo que busca en segundos... estás regalando tus ventas.',
    '',
    'Con Nevux transformás tu tienda en una verdadera máquina de ventas:',
    '',
    '🔥 6 Funciones Inteligentes:',
    '• Métricas en Vivo & ROI',
    '• Notificaciones de Compras en Tiempo Real',
    '• Traductor Automático con IA (ES, PT, EN)',
    '• Buscador por Voz para celulares',
    '• Asistente de Ventas IA 24/7',
    '• Asistente de Soporte & CRM para WhatsApp',
    '',
    '🛠️ Suite de 50 Widgets de Conversión:',
    'Contadores regresivos, barras de envío gratis, botones de WhatsApp, cajas de opiniones, comparadores, promociones y gamificación.',
    '',
    'Se instala en menos de 2 minutos sin tocar una sola línea de código.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá NEVUX y te mostro cómo transformar tu tienda hoy mismo. 👇',
    '',
    '#Tiendanube #ConversionOptimization #EcommerceArgentina #VentasOnline #Nevux #CRO #MarketingDigital #PymesArgentina #TiendaOnline #EcommerceTips #ConversionRate',
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
          📅 Viernes — Ecosistema Completo Nevux
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
          Contenido semanal · Nevux para Tiendanube · Cierre de Semana
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
            <Layers size={22} style={{ color: '#10B981' }} />
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
                icon: Layers,
                label: 'Protagonista',
                value: '50 Widgets + 6 Funciones',
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
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 12,
                padding: '8px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
              }}
            >
              <Rocket size={14} style={{ color: '#10B981' }} />
              <span
                style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}
              >
                TRANSFORMACIÓN TOTAL
              </span>
            </div>
            <h3
              style={{
                fontSize: 27,
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                margin: 0,
              }}
            >
              Así se ve una <span style={{ color: '#10B981' }}>Tiendanube</span>{' '}
              optimizada para vender 🚀
            </h3>
            <p
              style={{
                fontSize: 15,
                color: '#9ca3af',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Dejá de usar la plantilla genérica que usan todas las tiendas.
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

        {/* ── SLIDE 2: EL PROBLEMA ── */}
        <SlideWrapper label="Slide 2 · El Problema">
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
                color: '#f87171',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              POR QUÉ NO CONVIERTES
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
              Una tienda básica transmite{' '}
              <span style={{ color: '#f87171' }}>fricción y dudas</span>
            </h3>

            <div
              style={{
                background: 'rgba(248,113,113,0.06)',
                borderRadius: 12,
                padding: 14,
                border: '1px solid rgba(248,113,113,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {[
                'Sin prueba social ni notificaciones',
                'Sin contadores de urgencia o stock',
                'Buscador antiguo difícil de usar',
                'Sin asistente 24/7 para responder dudas',
              ].map((item, i) => (
                <div
                  key={'prob-' + i}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span style={{ color: '#f87171', fontSize: 12 }}>❌</span>
                  <span style={{ fontSize: 12, color: '#d1d5db' }}>{item}</span>
                </div>
              ))}
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

        {/* ── SLIDE 3: LAS 6 FUNCIONES ── */}
        <SlideWrapper label="Slide 3 · Las 6 Funciones IA">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={18} style={{ color: '#10B981' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#10B981',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                INTELIGENCIA APLICADA
              </span>
            </div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                margin: 0,
              }}
            >
              6 Funciones <span style={{ color: '#10B981' }}>Inteligentes</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                '📊 Métricas en Vivo & ROI real',
                '🔔 Notificaciones de Compras PRO',
                '🌐 Traductor IA (ES, PT, EN)',
                '🎙️ Buscador por Voz Inteligente',
                '🤖 Vendedor Virtual IA 24/7',
                '📲 CRM & Asistente WhatsApp',
              ].map((f, i) => (
                <div
                  key={'func-' + i}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    border: '1px solid rgba(16,185,129,0.15)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#e5e7eb',
                  }}
                >
                  {f}
                </div>
              ))}
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

        {/* ── SLIDE 4: LOS 50 WIDGETS ── */}
        <SlideWrapper label="Slide 4 · Suite de 50 Widgets">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Grid size={18} style={{ color: '#10B981' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#10B981',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                SUITE COMPLETA
              </span>
            </div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                margin: 0,
              }}
            >
              50 Widgets de <span style={{ color: '#10B981' }}>Conversión</span>
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              {[
                '⏱️ Cuenta Regresiva',
                '🚚 Barra Envío Gratis',
                '🎮 Raspá y Gana',
                '💬 Botón WhatsApp',
                '⭐ Carrusel Reseñas',
                '🏷️ Cuotas Sin Interés',
                '📦 Urgencia Stock',
                '🎥 Video Flotante',
              ].map((w, i) => (
                <div
                  key={'widg-' + i}
                  style={{
                    background: 'rgba(16,185,129,0.06)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    border: '1px solid rgba(16,185,129,0.2)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#34d399',
                  }}
                >
                  {w}
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: 11,
                color: '#9ca3af',
                margin: 0,
                textAlign: 'center',
              }}
            >
              +42 widgets más listos para activar en 1 clic
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

        {/* ── SLIDE 5: INSTALACIÓN SIN CÓDIGO ── */}
        <SlideWrapper label="Slide 5 · Sin Código">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} style={{ color: '#facc15' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#facc15',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                FÁCIL Y RÁPIDO
              </span>
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                margin: 0,
              }}
            >
              Instalación en <span style={{ color: '#facc15' }}>2 minutos</span>
            </h3>

            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 14,
                padding: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {[
                { step: '1', text: 'Conectás tu Tiendanube en 1 clic' },
                { step: '2', text: 'Elegís los widgets que querés activar' },
                { step: '3', text: 'Personalizás colores y listo 🎉' },
              ].map((s, i) => (
                <div
                  key={'step-' + i}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#10B981',
                      color: '#000',
                      fontWeight: 900,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {s.step}
                  </div>
                  <span
                    style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}
                  >
                    {s.text}
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: 12,
                color: '#9ca3af',
                lineHeight: 1.4,
                margin: 0,
                textAlign: 'center',
              }}
            >
              No necesitás programadores ni saber de código.
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

        {/* ── SLIDE 6: RESULTADO FINAL ── */}
        <SlideWrapper label="Slide 6 · Resultados">
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
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
                EL IMPACTO REAL
              </span>
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                margin: 0,
              }}
            >
              Métricas que cambian desde el <span style={{ color: '#10B981' }}>Día 1</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { metric: '+28%', label: 'Conversión de Visita a Compra' },
                { metric: '-40%', label: 'Abandono de Carrito' },
                { metric: '+35%', label: 'Aumento en Ticket Promedio' },
              ].map((m, i) => (
                <div
                  key={'met-' + i}
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#d1d5db', fontWeight: 600 }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#10B981' }}>
                    {m.metric}
                  </span>
                </div>
              ))}
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
              Impulsá tu <span style={{ color: '#10B981' }}>Tiendanube</span> hoy
            </h3>

            {/* Banner Oferta de Valor Oficial */}
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
                Comentá NEVUX 👇
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
                ¿Tu tienda tiene herramientas para{' '}
                <span style={{ color: '#10B981' }}>convertir más</span>?
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
                    Solo la plantilla básica 😬
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
                    Tengo Nevux instalado 🚀
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

          {/* Story 2: Comparativa */}
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
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Tienda Común vs. Tienda con Nevux ⚡
              </p>
              <div
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  borderRadius: 8,
                  padding: 8,
                  border: '1px solid rgba(248,113,113,0.2)',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: '#f87171',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  ❌ Sin notificaciones ni urgencia
                </p>
              </div>
              <div
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  borderRadius: 8,
                  padding: 8,
                  border: '1px solid rgba(16,185,129,0.25)',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: '#10B981',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  ✅ 50 Widgets + 6 Funciones IA
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
              STORY 2/5
            </span>
          </div>

          {/* Story 3: Destacado 6 Funciones */}
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
                gap: 10,
                paddingTop: 24,
              }}
            >
              <Bot size={24} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                6 Funciones Inteligentes
              </p>
              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: 8,
                  padding: 8,
                  width: '100%',
                  border: '1px solid rgba(16,185,129,0.2)',
                  fontSize: 9,
                  color: '#d1d5db',
                  lineHeight: 1.5,
                }}
              >
                • Asistente IA 24/7
                <br />
                • Buscador por Voz
                <br />
                • Traductor en Vivo
                <br />• CRM WhatsApp
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
              STORY 3/5
            </span>
          </div>

          {/* Story 4: Destacado 50 Widgets */}
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
              <Grid size={24} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                50 Widgets en 1 sola app
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: '#9ca3af',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                Sin pagar apps por separado. Todo integrado en tu panel.
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
              <Rocket size={26} style={{ color: '#10B981' }} />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Transformá tu <span style={{ color: '#10B981' }}>Tiendanube</span>
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
          id="copy-viernes"
          title="Copy Viernes — Ecosistema Completo (Carrusel)"
          text={copyViernes}
          copied={copiedId === 'copy-viernes'}
          onCopy={() => handleCopy('copy-viernes', copyViernes)}
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
            Nevux · Planificación Semanal · Semana 1 Completa 🎉
          </span>
          <NevuxLogo size={18} />
        </div>
      </main>
    </div>
  );
                     }
