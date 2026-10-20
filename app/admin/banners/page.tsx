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
  Grid,
  Bot,
  ShieldCheck,
  Rocket,
  BarChart3,
  ShoppingCart,
  Bell,
  Star,
  Calendar,
  Mic,
  Gift,
  Settings,
  Play,
  Flame,
} from 'lucide-react';

/* ─── Logo Oficial NEVUX ─── */
function NevuxLogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <rect x="20" y="20" width="13" height="54" fill="#FFFFFF" />
      <rect x="67" y="20" width="13" height="35" fill="url(#nvxRightGrad)" />
      <polygon points="20,20 33,20 96,96 80,96" fill="url(#nvxDiagGrad)" />
    </svg>
  );
}

function NevuxLogo({ size = 24 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <NevuxLogoMark size={size} />
      <span
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          fontSize: size * 0.62,
          letterSpacing: '0.08em',
          color: '#fff',
        }}
      >
        NEVUX
      </span>
    </div>
  );
}

/* ─── Banner App Store COMPACTO (fácil de capturar) ─── */
function AppStoreBannerWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: '#10B981',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <ImageIcon size={12} /> {label}
      </div>
      {/* maxWidth 520 → entra bien en pantalla y captura horizontal */}
      <div
        style={{
          aspectRatio: '16/10',
          width: '100%',
          maxWidth: 520,
          background: '#020a07',
          border: '1px solid rgba(16,185,129,0.35)',
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 28px rgba(0,0,0,0.55)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Grid sutil */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            pointerEvents: 'none',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '70%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        {/* Logo SOLO arriba izquierda */}
        <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 10 }}>
          <NevuxLogo size={16} />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            padding: '14px 16px 14px 16px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function BannerLayout({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        width: '100%',
        height: '100%',
        paddingTop: 22,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, pr: 8 }}>
        {left}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {right}
      </div>
    </div>
  );
}

/* ─── Slide IG 4:5 ─── */
function SlideWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#10B981',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          aspectRatio: '4/5',
          maxWidth: 320,
          background: '#020a07',
          border: '1.5px solid rgba(16,185,129,0.3)',
          borderRadius: 18,
          padding: 18,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
          <NevuxLogo size={16} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 22 }}>{children}</div>
      </div>
    </div>
  );
}

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
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: 14,
        padding: 18,
        marginBottom: 18,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#10B981',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
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
            padding: '5px 12px',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: '#d1d5db',
          fontSize: 12,
          lineHeight: 1.65,
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
        }}
      >
        {text}
      </pre>
    </div>
  );
}

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<'appstore' | 'instagram'>('appstore');
  const [lang, setLang] = useState<'es' | 'pt'>('es');
  const [selectedDay, setSelectedDay] = useState<'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'>('viernes');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const appStoreCopyES = [
    '⚡ Impulsá tus ventas en Tiendanube con el Ecosistema Nevux',
    '',
    'Nevux es la suite de optimización de conversión (CRO) e Inteligencia Artificial definitiva para Tiendanube.',
    '',
    '🛠️ Suite de 50 Widgets de Conversión',
    '🧠 6 Funciones Inteligentes con IA',
    '📅 Listo para Fechas Especiales (Hot Sale, Black Friday, Cyber)',
    '',
    '🚀 50 Widgets + 6 funciones para impulsar tu Tiendanube',
    '',
    '✅ Instalación en 2 minutos sin código',
    '✅ 100% personalizable a tu marca',
  ].join('\n');

  const appStoreCopyPT = [
    '⚡ Alavanque suas vendas na Nuvemshop com o Ecossistema Nevux',
    '',
    'Nevux é a suíte de otimização de conversão (CRO) e Inteligência Artificial definitiva para Nuvemshop.',
    '',
    '🛠️ Suíte de 50 Widgets de Conversão',
    '🧠 6 Funções Inteligentes com IA',
    '📅 Pronto para Datas Especiais (Black Friday, Natal, Dia das Mães)',
    '',
    '🚀 50 Widgets + 6 funções para alavancar sua Nuvemshop',
    '',
    '✅ Instalação em 2 minutos sem código',
    '✅ 100% personalizável à sua marca',
  ].join('\n');

  const copyLunes = [
    '⏱️ ¿Sabías que el 65% de los carritos abandonados ocurren por posponer la compra?',
    '',
    'La solución es generar URGENCIA Y ESCASEZ REAL.',
    '',
    'Con Nevux activás contadores regresivos y alertas de stock en menos de 2 minutos.',
    '',
    '50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá URGENCIA y te enviamos el link. 👇',
  ].join('\n');

  const copyMartes = [
    '🎙️ El 70% de tus clientes navega desde el celular... ¿por qué obligarlos a escribir?',
    '',
    'Buscador por Voz Inteligente para Tiendanube.',
    '',
    '50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá VOZ para probarlo. 👇',
  ].join('\n');

  const copyMiercoles = [
    '🚚 Subí tu ticket promedio sin gastar más en ads.',
    '',
    'Barra de Envío Gratis + Order Bumps en el carrito.',
    '',
    '50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá TICKET para activarlo. 👇',
  ].join('\n');

  const copyJueves = [
    '🎮 Convertí visitantes indecisos con Gamificación.',
    '',
    'Raspá y Gana: interactúan, dejan el mail y compran.',
    '',
    '50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá GANAR y te mostramos cómo. 👇',
  ].join('\n');

  const copyViernes = [
    '⚡ ¿Tu Tiendanube se ve igual a miles de tiendas?',
    '',
    'Con Nevux transformás tu tienda en una máquina de ventas:',
    '',
    '🔥 6 Funciones IA + 🛠️ 50 Widgets de Conversión',
    '',
    'Se instala en menos de 2 minutos sin código.',
    '',
    '50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá NEVUX y te muestro cómo. 👇',
  ].join('\n');

  return (
    <div style={{ minHeight: '100vh', background: '#020a07', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header
        style={{
          background: '#04140e',
          borderBottom: '1px solid rgba(16,185,129,0.2)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Link href="/admin" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
          <ArrowLeft size={14} /> Volver
        </Link>
        <div style={{ flex: 1 }} />
        <NevuxLogo size={18} />
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 64px' }}>
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            background: 'rgba(6,30,20,0.85)',
            padding: 5,
            borderRadius: 12,
            border: '1px solid rgba(16,185,129,0.2)',
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => setActiveTab('appstore')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'appstore' ? '#10B981' : 'transparent',
              color: activeTab === 'appstore' ? '#000' : '#9ca3af',
              fontWeight: 800,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Grid size={14} /> App Store (5)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'instagram' ? '#10B981' : 'transparent',
              color: activeTab === 'instagram' ? '#000' : '#9ca3af',
              fontWeight: 800,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Calendar size={14} /> Instagram S1
          </button>
        </div>

        {/* ════════ APP STORE ════════ */}
        {activeTab === 'appstore' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>🎨 Banners App Store</h1>
                <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>Compactos 16:10 · listos para captura</p>
              </div>
              <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.45)', padding: 3, borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)' }}>
                <button onClick={() => setLang('es')} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: lang === 'es' ? '#10B981' : 'transparent', color: lang === 'es' ? '#000' : '#d1d5db', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>
                  🇦🇷 ES
                </button>
                <button onClick={() => setLang('pt')} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: lang === 'pt' ? '#10B981' : 'transparent', color: lang === 'pt' ? '#000' : '#d1d5db', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>
                  🇧🇷 PT
                </button>
              </div>
            </div>

            {/* BANNER 1 — All-in-One */}
            <AppStoreBannerWrapper label="1 · Propuesta de valor">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 14, padding: '3px 8px', width: 'fit-content' }}>
                      <Sparkles size={10} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10B981' }}>CRO + IA</span>
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>El motor completo para <span style={{ color: '#10B981' }}>Tiendanube</span></>
                      ) : (
                        <>O motor completo para <span style={{ color: '#10B981' }}>Nuvemshop</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.35 }}>
                      {lang === 'es' ? 'Optimizá conversión sin tocar código.' : 'Otimize conversão sem tocar em código.'}
                    </p>
                    <div style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.45)', borderRadius: 8, padding: '8px 10px', marginTop: 2 }}>
                      <p style={{ fontSize: 10, fontWeight: 900, color: '#10B981', margin: 0, lineHeight: 1.3 }}>
                        {lang === 'es'
                          ? '50 Widgets + 6 funciones para impulsar tu Tiendanube'
                          : '50 Widgets + 6 funções para alavancar sua Nuvemshop'}
                      </p>
                    </div>
                  </>
                }
                right={
                  <div style={{ position: 'relative', width: '100%', height: 140 }}>
                    <div style={{ position: 'absolute', top: 4, right: 0, width: 150, background: '#061e14', border: '1px solid #10B981', borderRadius: 10, padding: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.5)', transform: 'rotate(3deg)', zIndex: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <div style={{ background: '#10B981', padding: 5, borderRadius: 6 }}><Grid size={12} color="#000" /></div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>50 Widgets</div>
                          <div style={{ fontSize: 8, color: '#9ca3af' }}>1-clic</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {['Urgencia', 'Social', 'Game'].map((t) => (
                          <span key={t} style={{ fontSize: 7, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 5px', borderRadius: 8, color: '#10B981' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: 72, right: 28, width: 140, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.5)', transform: 'rotate(-2deg)', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ background: 'linear-gradient(135deg,#10B981,#059669)', padding: 5, borderRadius: 6 }}><Bot size={12} color="#000" /></div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>6 {lang === 'es' ? 'IA' : 'IA'}</div>
                          <div style={{ fontSize: 8, color: '#9ca3af' }}>Voz · CRM · Chat</div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* BANNER 2 — Prueba social / urgencia */}
            <AppStoreBannerWrapper label="2 · Prueba social & urgencia">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Bell size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? 'Gatillos mentales' : 'Gatilhos mentais'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>Generá <span style={{ color: '#10B981' }}>confianza</span> al instante</>
                      ) : (
                        <>Gere <span style={{ color: '#10B981' }}>confiança</span> na hora</>
                      )}
                    </h2>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, lineHeight: 1.35 }}>
                      {lang === 'es'
                        ? 'Ventas en vivo, stock crítico y reseñas.'
                        : 'Vendas ao vivo, estoque crítico e reviews.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ position: 'relative', width: '100%', height: 140 }}>
                    <div style={{ position: 'absolute', top: 8, right: 0, width: 168, background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '8px 10px', display: 'flex', gap: 8, boxShadow: '0 8px 16px rgba(0,0,0,0.5)', zIndex: 2 }}>
                      <div style={{ width: 28, height: 28, background: '#061e14', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bell size={12} color="#10B981" />
                      </div>
                      <div>
                        <p style={{ fontSize: 8, color: '#9ca3af', margin: 0 }}>{lang === 'es' ? 'Córdoba · hace 2 min' : 'SP · há 2 min'}</p>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#fff', margin: 0 }}>Zapatillas Urbanas</p>
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: 70, right: 18, width: 150, background: '#061e14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, boxShadow: '0 8px 16px rgba(0,0,0,0.5)', zIndex: 1 }}>
                      <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={9} fill="#facc15" color="#facc15" />
                        ))}
                      </div>
                      <p style={{ fontSize: 9, fontWeight: 700, color: '#fff', margin: 0 }}>&quot;Excelente calidad&quot;</p>
                      <p style={{ fontSize: 8, color: '#9ca3af', margin: '2px 0 0' }}>{lang === 'es' ? 'Llegó rápido · 5★' : 'Chegou rápido · 5★'}</p>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* BANNER 3 — IA + Voz */}
            <AppStoreBannerWrapper label="3 · IA & Buscador por voz">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Bot size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? 'Inteligencia' : 'Inteligência'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>Vendedor IA 24/7 + <span style={{ color: '#10B981' }}>Voz</span></>
                      ) : (
                        <>Vendedor IA 24/7 + <span style={{ color: '#10B981' }}>Voz</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, lineHeight: 1.35 }}>
                      {lang === 'es' ? 'Chat, voz y traductor en vivo.' : 'Chat, voz e tradutor ao vivo.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <div style={{ width: '92%', background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 6px 14px rgba(0,0,0,0.45)' }}>
                      <span style={{ fontSize: 9, color: '#9ca3af' }}>
                        {lang === 'es' ? 'Escuchando "campera"...' : 'Ouvindo "jaqueta"...'}
                      </span>
                      <div style={{ width: 22, height: 22, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mic size={11} color="#000" />
                      </div>
                    </div>
                    <div style={{ width: '85%', background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: 8 }}>
                      <p style={{ fontSize: 8, color: '#10B981', margin: '0 0 4px', fontWeight: 700 }}>IA · 24/7</p>
                      <p style={{ fontSize: 9, color: '#e5e7eb', margin: 0, lineHeight: 1.3 }}>
                        {lang === 'es' ? '¿Talle 42 en negro? Sí, hay stock.' : 'Tamanho 42 preto? Sim, tem estoque.'}
                      </p>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* BANNER 4 — Ticket + Fechas especiales */}
            <AppStoreBannerWrapper label="4 · Ticket promedio & fechas especiales">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <TrendingUp size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? 'Crecimiento' : 'Crescimento'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>Ticket + <span style={{ color: '#10B981' }}>Hot Sale / BF</span></>
                      ) : (
                        <>Ticket + <span style={{ color: '#10B981' }}>Black Friday</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, lineHeight: 1.35 }}>
                      {lang === 'es'
                        ? 'Envío gratis, order bump y campañas.'
                        : 'Frete grátis, order bump e campanhas.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'flex-end' }}>
                    <div style={{ width: '95%', background: 'linear-gradient(90deg,#ef4444,#b91c1c)', borderRadius: 8, padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#fff', margin: 0 }}>BLACK FRIDAY 🔥</p>
                        <p style={{ fontSize: 7, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{lang === 'es' ? 'Ofertas por tiempo limitado' : 'Ofertas por tempo limitado'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <span style={{ background: '#000', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 3 }}>08</span>
                        <span style={{ color: '#fff', fontSize: 9 }}>:</span>
                        <span style={{ background: '#000', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 3 }}>45</span>
                      </div>
                    </div>
                    <div style={{ width: '88%', background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: 8 }}>
                      <p style={{ fontSize: 8, fontWeight: 700, color: '#fff', margin: '0 0 5px', textAlign: 'center' }}>
                        🎉 {lang === 'es' ? '¡Casi envío gratis!' : 'Quase frete grátis!'}
                      </p>
                      <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '78%', height: '100%', background: '#10B981', borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* BANNER 5 — ROI + sin código */}
            <AppStoreBannerWrapper label="5 · ROI & configuración">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <ShieldCheck size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? 'Sin código' : 'Sem código'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>ROI real · <span style={{ color: '#10B981' }}>2 minutos</span></>
                      ) : (
                        <>ROI real · <span style={{ color: '#10B981' }}>2 minutos</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, lineHeight: 1.35 }}>
                      {lang === 'es'
                        ? 'Métricas en vivo y colores de tu marca.'
                        : 'Métricas ao vivo e cores da sua marca.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ width: '92%', background: '#020a07', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 18px rgba(0,0,0,0.55)' }}>
                    <div style={{ padding: '6px 10px', background: '#061e14', borderBottom: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <NevuxLogo size={11} />
                      <span style={{ fontSize: 8, color: '#6b7280' }}>/ settings</span>
                    </div>
                    <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 9, color: '#d1d5db' }}>{lang === 'es' ? 'Color principal' : 'Cor principal'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#111827', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ width: 10, height: 10, background: '#10B981', borderRadius: '50%' }} />
                          <span style={{ fontSize: 8, color: '#fff', fontFamily: 'monospace' }}>#10B981</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 9, color: '#d1d5db' }}>ROI live</span>
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#10B981' }}>+28%</span>
                      </div>
                      <div style={{ background: '#10B981', color: '#000', fontSize: 9, fontWeight: 800, textAlign: 'center', padding: '6px', borderRadius: 6 }}>
                        {lang === 'es' ? 'Activar en 1 clic' : 'Ativar em 1 clique'}
                      </div>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            <CopyBlock
              id="copy-appstore"
              title={lang === 'es' ? 'Copy Portal Partners AR' : 'Copy Portal Partners BR'}
              text={lang === 'es' ? appStoreCopyES : appStoreCopyPT}
              copied={copiedId === 'copy-appstore'}
              onCopy={() => handleCopy('copy-appstore', lang === 'es' ? appStoreCopyES : appStoreCopyPT)}
            />
          </div>
        )}

        {/* ════════ INSTAGRAM SEMANA 1 ════════ */}
        {activeTab === 'instagram' && (
          <div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 18 }}>
              {[
                { id: 'lunes', label: 'Lun' },
                { id: 'martes', label: 'Mar' },
                { id: 'miercoles', label: 'Mié' },
                { id: 'jueves', label: 'Jue' },
                { id: 'viernes', label: 'Vie' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id as typeof selectedDay)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(16,185,129,0.3)',
                    background: selectedDay === d.id ? '#10B981' : 'rgba(6,30,20,0.6)',
                    color: selectedDay === d.id ? '#000' : '#d1d5db',
                    fontWeight: 800,
                    fontSize: 11,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,30,20,0.9) 100%)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 14,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} style={{ color: '#10B981' }} />
                Ficha · {selectedDay.toUpperCase()}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                  <span style={{ fontSize: 9, color: '#6b7280', fontWeight: 700 }}>HORARIO</span>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#fff', margin: '2px 0 0' }}>
                    {selectedDay === 'martes' || selectedDay === 'jueves' ? '19:30 · Reel' : '11:30 · Carrusel'}
                  </p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                  <span style={{ fontSize: 9, color: '#6b7280', fontWeight: 700 }}>OFERTA</span>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#10B981', margin: '2px 0 0' }}>50 Widgets + 6 funciones</p>
                </div>
              </div>
            </div>

            {selectedDay === 'lunes' && (
              <>
                <SlideWrapper label="Lunes · Hook">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                      ¿Ven tus productos pero <span style={{ color: '#f87171' }}>no compran</span>? ⏱️
                    </h3>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Activá urgencia real en 2 minutos.</p>
                  </div>
                </SlideWrapper>
                <CopyBlock id="ig-lunes" title="Copy Lunes" text={copyLunes} copied={copiedId === 'ig-lunes'} onCopy={() => handleCopy('ig-lunes', copyLunes)} />
              </>
            )}

            {selectedDay === 'martes' && (
              <>
                <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#10B981', margin: '0 0 8px' }}>🎬 Reel · Buscador por Voz</h3>
                  <p style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.55, margin: 0 }}>
                    1. Celular en Tiendanube<br />
                    2. Mic Nevux → &quot;Zapatillas negras 42&quot;<br />
                    3. Resultado al instante<br />
                    4. CTA: 50 Widgets + 6 funciones...
                  </p>
                </div>
                <CopyBlock id="ig-martes" title="Copy Martes" text={copyMartes} copied={copiedId === 'ig-martes'} onCopy={() => handleCopy('ig-martes', copyMartes)} />
              </>
            )}

            {selectedDay === 'miercoles' && (
              <>
                <SlideWrapper label="Miércoles · Hook">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                      Subí el <span style={{ color: '#10B981' }}>ticket promedio</span> sin más ads 🚚
                    </h3>
                  </div>
                </SlideWrapper>
                <CopyBlock id="ig-mier" title="Copy Miércoles" text={copyMiercoles} copied={copiedId === 'ig-mier'} onCopy={() => handleCopy('ig-mier', copyMiercoles)} />
              </>
            )}

            {selectedDay === 'jueves' && (
              <>
                <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#10B981', margin: '0 0 8px' }}>🎬 Reel · Raspá y Gana</h3>
                  <p style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.55, margin: 0 }}>
                    1. Raspar tarjeta flotante<br />
                    2. Ganar cupón + capturar mail<br />
                    3. CTA: 50 Widgets + 6 funciones...
                  </p>
                </div>
                <CopyBlock id="ig-jue" title="Copy Jueves" text={copyJueves} copied={copiedId === 'ig-jue'} onCopy={() => handleCopy('ig-jue', copyJueves)} />
              </>
            )}

            {selectedDay === 'viernes' && (
              <>
                <SlideWrapper label="Viernes · Hook">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                      Así se ve una <span style={{ color: '#10B981' }}>Tiendanube</span> optimizada 🚀
                    </h3>
                  </div>
                </SlideWrapper>
                <SlideWrapper label="Viernes · CTA">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 10, padding: 12, width: '100%' }}>
                      <p style={{ fontSize: 11, color: '#fff', fontWeight: 800, margin: 0 }}>
                        50 Widgets + 6 funciones para impulsar tu Tiendanube
                      </p>
                    </div>
                    <p style={{ fontSize: 16, color: '#10B981', margin: 0, fontWeight: 900 }}>Comentá NEVUX 👇</p>
                  </div>
                </SlideWrapper>
                <CopyBlock id="ig-vie" title="Copy Viernes" text={copyViernes} copied={copiedId === 'ig-vie'} onCopy={() => handleCopy('ig-vie', copyViernes)} />
              </>
            )}
          </div>
        )}

        <div style={{ marginTop: 36, paddingTop: 16, borderTop: '1px solid rgba(16,185,129,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>Nevux · Banners compactos listos para captura</span>
          <NevuxLogo size={14} />
        </div>
      </main>
    </div>
  );
          }
