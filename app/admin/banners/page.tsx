'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Layers,
  ImageIcon,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Grid,
  Bot,
  ShieldCheck,
  ShoppingCart,
  Bell,
  Star,
  Calendar,
  Mic,
  Settings,
  Flame,
  CheckCircle2,
  Clock,
  Video,
  ChevronDown,
  Gift,
  HelpCircle,
} from 'lucide-react';

/* ─── Logo Oficial NEVUX ─── */
function NevuxLogoMark({ size = 20 }: { size?: number }) {
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

function NevuxLogo({ size = 20 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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

/* ─── Contenedor Banner App Store (Compacto, denso, perfecto para capturas) ─── */
function AppStoreBannerWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
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
      {/* Tamaño optimizado 540px máximo para captura horizontal sin scroll */}
      <div
        style={{
          aspectRatio: '16/10',
          width: '100%',
          maxWidth: 540,
          background: 'linear-gradient(145deg, #020a07 0%, #051810 100%)',
          border: '1.5px solid rgba(16,185,129,0.35)',
          borderRadius: 18,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 16px 36px rgba(0,0,0,0.65)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Pattern de Fondo estilo Tech Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 22px',
            pointerEvents: 'none',
          }}
        />

        {/* Glow Esmeralda */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo Nevux ÚNICAMENTE superior izquierda */}
        <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 20 }}>
          <NevuxLogo size={16} />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            padding: '14px 16px',
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
        gridTemplateColumns: '1fr 1.05fr',
        gap: 12,
        width: '100%',
        height: '100%',
        paddingTop: 22,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, paddingRight: 4 }}>
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
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ aspectRatio: '4/5', maxWidth: 320, background: '#020a07', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}><NevuxLogo size={15} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 20 }}>{children}</div>
      </div>
    </div>
  );
}

function CopyBlock({ id, title, text, copied, onCopy }: { id: string; title: string; text: string; copied: boolean; onCopy: () => void }) {
  return (
    <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
        <button onClick={onCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, background: copied ? '#059669' : 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 10px', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#d1d5db', fontSize: 11, lineHeight: 1.6, fontFamily: 'system-ui, sans-serif', margin: 0 }}>{text}</pre>
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

  const copyLunes = '50 Widgets + 6 funciones para impulsar tu Tiendanube. Comentá URGENCIA y te enviamos el link. 👇';
  const copyMartes = 'Buscador por Voz Inteligente para Tiendanube. 50 Widgets + 6 funciones. Comentá VOZ. 👇';
  const copyMiercoles = 'Barra de Envío Gratis + Order Bumps en el carrito. 50 Widgets + 6 funciones. Comentá TICKET. 👇';
  const copyJueves = 'Raspá y Gana: interactúan, dejan el mail y compran. 50 Widgets + 6 funciones. Comentá GANAR. 👇';
  const copyViernes = 'Así se ve una Tiendanube optimizada para vender. 50 Widgets + 6 funciones. Comentá NEVUX. 👇';

  return (
    <div style={{ minHeight: '100vh', background: '#020a07', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ background: '#04140e', borderBottom: '1px solid rgba(16,185,129,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/admin" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
          <ArrowLeft size={14} /> Volver
        </Link>
        <div style={{ flex: 1 }} />
        <NevuxLogo size={16} />
      </header>

      <main style={{ maxWidth: 580, margin: '0 auto', padding: '20px 12px 60px' }}>
        {/* Tabs Pestañas */}
        <div style={{ display: 'flex', gap: 6, background: 'rgba(6,30,20,0.85)', padding: 4, borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab('appstore')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'appstore' ? '#10B981' : 'transparent',
              color: activeTab === 'appstore' ? '#000' : '#9ca3af',
              fontWeight: 800,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Grid size={13} /> App Store (5 Images)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'instagram' ? '#10B981' : 'transparent',
              color: activeTab === 'instagram' ? '#000' : '#9ca3af',
              fontWeight: 800,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Calendar size={13} /> Instagram S1
          </button>
        </div>

        {/* ====================================================================
            APP STORE BANNERS — 100% PROFESIONAL, DENSO Y COMPACTO
            ==================================================================== */}
        {activeTab === 'appstore' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 2px', color: '#fff' }}>🚀 Banners App Store</h1>
                <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>Formato 16:10 · Listo para captura horizontal</p>
              </div>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.45)', padding: 3, borderRadius: 6, border: '1px solid rgba(16,185,129,0.3)' }}>
                <button onClick={() => setLang('es')} style={{ padding: '5px 8px', borderRadius: 4, border: 'none', background: lang === 'es' ? '#10B981' : 'transparent', color: lang === 'es' ? '#000' : '#d1d5db', fontWeight: 800, fontSize: 10, cursor: 'pointer' }}>🇦🇷 ES</button>
                <button onClick={() => setLang('pt')} style={{ padding: '5px 8px', borderRadius: 4, border: 'none', background: lang === 'pt' ? '#10B981' : 'transparent', color: lang === 'pt' ? '#000' : '#d1d5db', fontWeight: 800, fontSize: 10, cursor: 'pointer' }}>🇧🇷 PT</button>
              </div>
            </div>

            {/* ── BANNER 1: Ecosistema Completo (50 Widgets + 6 Funciones IA) ── */}
            <AppStoreBannerWrapper label="1 · Propuesta de Valor All-in-One">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 12, padding: '2px 7px', width: 'fit-content' }}>
                      <Sparkles size={9} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 8, fontWeight: 800, color: '#10B981' }}>CRO + IA SUITE</span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>El motor completo para <span style={{ color: '#10B981' }}>Tiendanube</span></>
                      ) : (
                        <>O motor completo para <span style={{ color: '#10B981' }}>Nuvemshop</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 9, color: '#9ca3af', margin: 0, lineHeight: 1.3 }}>
                      {lang === 'es' ? 'Aumentá tus ventas sin tocar una sola línea de código.' : 'Aumente suas vendas sem tocar em uma linha de código.'}
                    </p>
                    <div style={{ background: '#0a2318', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 6, padding: '6px 8px', marginTop: 2 }}>
                      <p style={{ fontSize: 9, fontWeight: 900, color: '#10B981', margin: 0, lineHeight: 1.2 }}>
                        {lang === 'es' ? '50 Widgets + 6 funciones para impulsar tu Tiendanube' : '50 Widgets + 6 funções para alavancar sua Nuvemshop'}
                      </p>
                    </div>
                  </>
                }
                right={
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Floating Mockup 1: Contador Regresivo Widget */}
                    <div style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Flame size={11} color="#f87171" />
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>{lang === 'es' ? 'Oferta por tiempo limitado' : 'Oferta por tempo limitado'}</span>
                      </div>
                      <span style={{ fontSize: 8, fontWeight: 900, color: '#10B981', background: 'rgba(16,185,129,0.15)', padding: '1px 5px', borderRadius: 4 }}>04:12:30</span>
                    </div>

                    {/* Floating Mockup 2: Asistente IA Widget */}
                    <div style={{ background: '#061e14', border: '1px solid #10B981', borderRadius: 8, padding: '6px 8px', display: 'flex', gap: 6, alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                      <div style={{ width: 18, height: 18, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={11} color="#000" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 8, fontWeight: 800, color: '#fff', margin: 0 }}>{lang === 'es' ? 'Asistente IA 24/7' : 'Assistente IA 24/7'}</p>
                        <p style={{ fontSize: 7, color: '#9ca3af', margin: 0 }}>{lang === 'es' ? '¿Dudas con el envío? Te ayudo.' : 'Dúvidas com o frete? Te ajudo.'}</p>
                      </div>
                    </div>

                    {/* Floating Badges */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ flex: 1, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
                        <p style={{ fontSize: 8, fontWeight: 900, color: '#10B981', margin: 0 }}>🛠️ 50 Widgets</p>
                      </div>
                      <div style={{ flex: 1, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
                        <p style={{ fontSize: 8, fontWeight: 900, color: '#fff', margin: 0 }}>🧠 6 Funciones IA</p>
                      </div>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 2: Impulsá tu Ticket Promedio (Packs, Order Bump, Envío Gratis) ── */}
            <AppStoreBannerWrapper label="2 · Impulsá tu Ticket Promedio (Packs & Upsells)">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TrendingUp size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 8, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? 'Mayor Facturación' : 'Maior Faturamento'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>Impulsá tu <span style={{ color: '#10B981' }}>ticket promedio</span></>
                      ) : (
                        <>Aumente seu <span style={{ color: '#10B981' }}>ticket médio</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 9, color: '#9ca3af', margin: 0, lineHeight: 1.3 }}>
                      {lang === 'es' ? 'Aumentá tus ventas con Packs de Productos, Barras de Envío Gratis y Order Bumps.' : 'Aumente suas vendas com Packs de Produtos, Frete Grátis e Order Bumps.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ width: '100%', background: '#0e1713', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {/* Barra Envío Gratis */}
                    <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 7, fontWeight: 800, color: '#fff' }}>🚚 {lang === 'es' ? '¡Envío Gratis Alcanzado!' : 'Frete Grátis Liberado!'}</span>
                        <span style={{ fontSize: 7, fontWeight: 900, color: '#10B981' }}>100%</span>
                      </div>
                      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', background: '#10B981' }} />
                      </div>
                    </div>

                    {/* Pack Selector Widget */}
                    <div style={{ background: '#111827', border: '1px solid #10B981', borderRadius: 6, padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 8, fontWeight: 800, color: '#fff' }}>Llevá 2 Unidades</span>
                        <span style={{ fontSize: 7, color: '#10B981', marginLeft: 4, fontWeight: 700 }}> (Ahorrá 15%)</span>
                      </div>
                      <span style={{ fontSize: 7, background: '#10B981', color: '#000', fontWeight: 900, padding: '1px 4px', borderRadius: 3 }}>MÁS VENDIDO</span>
                    </div>

                    {/* Order Bump Widget */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(16,185,129,0.4)', borderRadius: 6, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle2 size={10} color="#10B981" />
                      <span style={{ fontSize: 7, color: '#d1d5db', fontWeight: 700 }}>{lang === 'es' ? 'Agregar garantía extendida' : 'Adicionar garantia estendida'}</span>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 3: Destacá tus Ofertas & Fechas Especiales ── */}
            <AppStoreBannerWrapper label="3 · Fechas Especiales & Ofertas (Hot Sale / Cyber)">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 8, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? 'Campañas Masivas' : 'Campanhas Massivas'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>Destacá tus <span style={{ color: '#10B981' }}>ofertas</span></>
                      ) : (
                        <>Destaque suas <span style={{ color: '#10B981' }}>ofertas</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 9, color: '#9ca3af', margin: 0, lineHeight: 1.3 }}>
                      {lang === 'es' ? 'Prepará tu tienda para Hot Sale, Cyber Monday y Black Friday con herramientas visuales.' : 'Prepare sua loja para Black Friday e datas especiais com ferramentas visuais.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {/* Hot Sale / Black Friday Banner */}
                    <div style={{ background: 'linear-gradient(90deg, #ef4444, #b91c1c)', borderRadius: 6, padding: '5px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}>
                      <div>
                        <p style={{ fontSize: 8, fontWeight: 900, color: '#fff', margin: 0 }}>HOT SALE 🔥</p>
                        <p style={{ fontSize: 6, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{lang === 'es' ? 'Descuentos exclusivos en la app' : 'Descontos exclusivos no app'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <span style={{ background: '#000', color: '#fff', fontSize: 7, fontWeight: 800, padding: '1px 3px', borderRadius: 2 }}>12</span>
                        <span style={{ color: '#fff', fontSize: 7 }}>:</span>
                        <span style={{ background: '#000', color: '#fff', fontSize: 7, fontWeight: 800, padding: '1px 3px', borderRadius: 2 }}>45</span>
                      </div>
                    </div>

                    {/* Slider de Videos Widget */}
                    <div style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Video size={10} color="#10B981" />
                      <span style={{ fontSize: 7, color: '#fff', fontWeight: 700 }}>Slider de Videos de Producto (9:16)</span>
                    </div>

                    {/* Buscador por Voz Widget */}
                    <div style={{ background: '#061e14', border: '1px solid #10B981', borderRadius: 12, padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 7, color: '#9ca3af' }}>{lang === 'es' ? 'Probar "Buscador por Voz"...' : 'Testar "Busca por Voz"...'}</span>
                      <Mic size={10} color="#10B981" />
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 4: Generá Confianza & Prueba Social ── */}
            <AppStoreBannerWrapper label="4 · Generá Confianza & Prueba Social">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 8, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? 'Prueba Social' : 'Prova Social'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>Generá <span style={{ color: '#10B981' }}>confianza</span></>
                      ) : (
                        <>Gere <span style={{ color: '#10B981' }}>confiança</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 9, color: '#9ca3af', margin: 0, lineHeight: 1.3 }}>
                      {lang === 'es' ? 'Que tus clientes se sientan seguros a la hora de comprar con notificaciones y reseñas.' : 'Faça seus clientes se sentirem seguros na hora de comprar com avaliações.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {/* Rating Header */}
                    <div style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="#facc15" color="#facc15" />)}
                        </div>
                        <p style={{ fontSize: 7, color: '#9ca3af', margin: '2px 0 0' }}>4.9 / 5.0 (120+ {lang === 'es' ? 'opiniones' : 'avalições'})</p>
                      </div>
                      <span style={{ fontSize: 7, background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 5px', borderRadius: 4, fontWeight: 800 }}>
                        {lang === 'es' ? 'VERIFICADO' : 'VERIFICADO'}
                      </span>
                    </div>

                    {/* Reseña Card Widget */}
                    <div style={{ background: '#061e14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '5px 8px' }}>
                      <p style={{ fontSize: 7, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>Laura G. ⭐⭐⭐⭐⭐</p>
                      <p style={{ fontSize: 7, color: '#d1d5db', margin: 0, lineHeight: 1.2 }}>
                        {lang === 'es' ? '"Excelente calidad, llegó antes de lo esperado."' : '"Excelente qualidade, chegou antes do esperado."'}
                      </p>
                    </div>

                    {/* Notificación de Compra en Vivo */}
                    <div style={{ background: '#111827', border: '1px solid #10B981', borderRadius: 6, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Bell size={9} color="#10B981" />
                      <span style={{ fontSize: 7, color: '#fff', fontWeight: 700 }}>{lang === 'es' ? 'Lucas de Córdoba compró recién' : 'Lucas de SP comprou agora'}</span>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 5: Tus Estilos, Tus Colores (Customización & ROI) ── */}
            <AppStoreBannerWrapper label="5 · Customización Cero Código & ROI">
              <BannerLayout
                left={
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Settings size={12} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 8, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                        {lang === 'es' ? '100% Personalizable' : '100% Personalizável'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      {lang === 'es' ? (
                        <>Tus estilos, <span style={{ color: '#10B981' }}>tus colores</span></>
                      ) : (
                        <>Seus estilos, <span style={{ color: '#10B981' }}>suas cores</span></>
                      )}
                    </h2>
                    <p style={{ fontSize: 9, color: '#9ca3af', margin: 0, lineHeight: 1.3 }}>
                      {lang === 'es' ? 'Customizá los widgets con los estilos y colores de tu marca sin saber de código.' : 'Customize os widgets com as cores e estilos da sua marca sem saber código.'}
                    </p>
                  </>
                }
                right={
                  <div style={{ width: '100%', background: '#0a1a12', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {/* Selector de Colores UI Mockup */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', padding: '4px 6px', borderRadius: 4 }}>
                      <span style={{ fontSize: 7, color: '#d1d5db', fontWeight: 600 }}>{lang === 'es' ? 'Color de Botón' : 'Cor do Botão'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%' }} />
                        <span style={{ fontSize: 7, color: '#fff', fontFamily: 'monospace' }}>#10B981</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', padding: '4px 6px', borderRadius: 4 }}>
                      <span style={{ fontSize: 7, color: '#d1d5db', fontWeight: 600 }}>{lang === 'es' ? 'Badge Más Vendido' : 'Badge Mais Vendido'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 8, height: 8, background: '#f87171', borderRadius: '50%' }} />
                        <span style={{ fontSize: 7, color: '#fff', fontFamily: 'monospace' }}>#F87171</span>
                      </div>
                    </div>

                    {/* Métrica de ROI Live */}
                    <div style={{ background: '#061e14', border: '1px solid #10B981', borderRadius: 4, padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 7, color: '#fff', fontWeight: 800 }}>ROI {lang === 'es' ? 'en Tiempo Real' : 'Tempo Real'}</span>
                      <span style={{ fontSize: 8, color: '#10B981', fontWeight: 900 }}>+32.8%</span>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* COPY PARNERS */}
            <CopyBlock
              id="copy-appstore"
              title={lang === 'es' ? 'Copy Portal Partners AR' : 'Copy Portal Partners BR'}
              text={lang === 'es' ? appStoreCopyES : appStoreCopyPT}
              copied={copiedId === 'copy-appstore'}
              onCopy={() => handleCopy('copy-appstore', lang === 'es' ? appStoreCopyES : appStoreCopyPT)}
            />
          </div>
        )}

        {/* ====================================================================
            INSTAGRAM SEMANA 1
            ==================================================================== */}
        {activeTab === 'instagram' && (
          <div>
            <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 6, marginBottom: 14 }}>
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
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: '1px solid rgba(16,185,129,0.3)',
                    background: selectedDay === d.id ? '#10B981' : 'rgba(6,30,20,0.6)',
                    color: selectedDay === d.id ? '#000' : '#d1d5db',
                    fontWeight: 800,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <SlideWrapper label={`${selectedDay.toUpperCase()} · Slide`}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>
                  50 Widgets + 6 funciones para impulsar tu Tiendanube 🚀
                </h3>
              </div>
            </SlideWrapper>

            <CopyBlock
              id="ig-copy"
              title={`Copy ${selectedDay.toUpperCase()}`}
              text={
                selectedDay === 'lunes' ? copyLunes :
                selectedDay === 'martes' ? copyMartes :
                selectedDay === 'miercoles' ? copyMiercoles :
                selectedDay === 'jueves' ? copyJueves : copyViernes
              }
              copied={copiedId === 'ig-copy'}
              onCopy={() => handleCopy('ig-copy', selectedDay)}
            />
          </div>
        )}

        <div style={{ marginTop: 24, paddingTop: 12, borderTop: '1px solid rgba(16,185,129,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#6b7280' }}>Nevux · Assets Oficiales 16:10</span>
          <NevuxLogo size={12} />
        </div>
      </main>
    </div>
  );
            }
