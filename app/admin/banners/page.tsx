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
  CheckCircle,
  Grid,
  Bot,
  ShieldCheck,
  Rocket,
  BarChart3,
  Globe,
  Mic,
  Gift,
  ShoppingCart,
  Bell,
  Star,
  Play,
  Flame,
  Calendar,
  Sliders,
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

/* ─── Wrapper Canvas Banner App Store (Ratio 16:10) ─── */
function AppStoreBannerWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#10B981',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <ImageIcon size={14} /> {label}
      </div>
      <div
        style={{
          aspectRatio: '16/10',
          width: '100%',
          maxWidth: 720,
          background: '#020a07',
          border: '2px solid rgba(16,185,129,0.35)',
          borderRadius: 20,
          padding: 28,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo Nevux ÚNICAMENTE en la parte superior izquierda */}
        <div style={{ position: 'absolute', top: 22, left: 22, zIndex: 10 }}>
          <NevuxLogo size={22} />
        </div>

        {/* Dynamic Glow decorativo */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 260,
            height: 260,
            background:
              'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 32,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Wrapper Slide Carrusel Instagram (4:5) ─── */
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
        }}
      >
        {/* Logo Nevux ÚNICAMENTE en la parte superior izquierda */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <NevuxLogo size={20} />
        </div>

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

/* ─── Bloque de copy interactivo ─── */
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
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
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
   PÁGINA PRINCIPAL - BANNERS APP STORE + PLAN SEMANAL IG
   ════════════════════════════════════════════════════════════ */
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

  /* ─── Copys para App Store Partners ─── */
  const appStoreCopyES = [
    '⚡ Impulsá tus ventas en Tiendanube con el Ecosistema Nevux',
    '',
    'Nevux es la suite de optimización de conversión (CRO) e Inteligencia Artificial definitiva diseñada para Tiendanube.',
    '',
    '🔥 ¿Qué incluye Nevux?',
    '',
    '🛠️ Suite de 50 Widgets de Conversión:',
    '• Contadores regresivos de urgencia',
    '• Notificaciones de compras en tiempo real (Prueba Social)',
    '• Barras dinámicas de Envío Gratis',
    '• Gamificación: Raspá y Gana / Ruleta de premios',
    '• Order Bumps y Venta Cruzada',
    '• Botones de WhatsApp flotantes y cajas de reseñas',
    '',
    '🧠 6 Funciones Inteligentes con IA:',
    '1. Asistente de Ventas IA 24/7 (Responde dudas y cierra ventas)',
    '2. Buscador por Voz optimizado para celulares',
    '3. Traductor Automático en Vivo (Español, Portugués, Inglés)',
    '4. Asistente de Soporte & CRM para WhatsApp',
    '5. Notificaciones de Ventas PRO',
    '6. Métricas de ROI e Impacto en Facturación en Vivo',
    '',
    '🚀 Oferta Principal:',
    '50 Widgets + 6 funciones para impulsar tu Tiendanube',
    '',
    '✅ Instalación en 2 minutos sin saber de código.',
    '✅ No afecta la velocidad de carga de tu tienda.',
    '✅ 100% Personalizable a los colores de tu marca.',
  ].join('\n');

  const appStoreCopyPT = [
    '⚡ Alavanque suas vendas na Nuvemshop com o Ecossistema Nevux',
    '',
    'Nevux é a suíte definitiva de otimização de conversão (CRO) e Inteligência Artificial projetada para a Nuvemshop.',
    '',
    '🔥 O que o Nevux inclui?',
    '',
    '🛠️ Suíte de 50 Widgets de Conversão:',
    '• Contadores regressivos de urgência',
    '• Notificações de compras em tempo real (Prova Social)',
    '• Barras dinâmicas de Frete Grátis',
    '• Gamificação: Raspadinha & Roleta de prêmios',
    '• Order Bumps e Venda Cruzada',
    '• Botões de WhatsApp flutuantes e caixas de avaliações',
    '',
    '🧠 6 Funções Inteligentes com IA:',
    '1. Assistente de Vendas IA 24/7 (Responde dúvidas e fecha vendas)',
    '2. Busca por Voz otimizada para dispositivos móveis',
    '3. Tradutor Automático em Tempo Real (Espanhol, Português, Inglês)',
    '4. Assistente de Suporte & CRM para WhatsApp',
    '5. Notificações de Vendas PRO',
    '6. Métricas de ROI e Impacto no Faturamento em Tempo Real',
    '',
    '🚀 Oferta Principal:',
    '50 Widgets + 6 funções para alavancar sua Nuvemshop',
    '',
    '✅ Instalação em 2 minutos sem necessidade de código.',
    '✅ Não afeta a velocidade de carregamento da sua loja.',
    '✅ 100% Personalizável com as cores da sua marca.',
  ].join('\n');

  /* ── Copys Instagram Semanal ── */
  const copyLunes = [
    '⏱️ ¿Sabías que el 65% de los carritos abandonados ocurren por posponer la compra?',
    '',
    'Cuando un cliente entra a tu tienda y piensa "lo compro más tarde", la venta está prácticamente perdida.',
    '',
    'La solución no es bajar precios. La solución es generar URGENCIA Y ESCASEZ REAL.',
    '',
    'Con Nevux podés activar contadores regresivos y alertas de stock crítico en menos de 2 minutos.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá URGENCIA y te enviamos el link de instalación. 👇',
  ].join('\n');

  const copyMartes = [
    '🎙️ El 70% de tus clientes navega tu Tiendanube desde el celular... ¿por qué obligarlos a escribir?',
    '',
    'Te presentamos el primer Buscador por Voz Inteligente para Tiendanube.',
    '',
    'Tus clientes solo tocan el micrófono, dicen lo que buscan y Nevux encuentra el producto al instante.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá VOZ para probarlo gratis en tu tienda. 👇',
  ].join('\n');

  const copyMiercoles = [
    '🚚 ¿Querés subir tu ticket promedio sin gastar más en publicidad?',
    '',
    'La clave está en la Barra de Envío Gratis Dinámica y los Order Bumps en el carrito.',
    '',
    'Le mostrás al cliente exactamente cuánto le falta para el envío gratis y le ofrecés un producto complementario antes del pago.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá TICKET para activarlo hoy. 👇',
  ].join('\n');

  const copyJueves = [
    '🎮 Convertí visitantes indecisos en clientes con Gamificación.',
    '',
    'Con el widget Raspá y Gana de Nevux, los clientes interactúan, obtienen un cupón exclusivo y compran en el acto.',
    '',
    'Gamificación + Captura de Leads + Conversión Inmediata.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá GANAR y te mostramos cómo configurarlo. 👇',
  ].join('\n');

  const copyViernes = [
    '⚡ ¿Tu Tiendanube se ve igual a las miles de tiendas que hay en internet?',
    '',
    'El problema no es tu producto ni tus precios. El problema es la FALTA DE OPTIMIZACIÓN de tu tienda.',
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
    'Contadores regresivos, barras de envío gratis, botones de WhatsApp, cajas de opiniones, promociones y gamificación.',
    '',
    'Se instala en menos de 2 minutos sin tocar código.',
    '',
    'Accedé a 50 Widgets + 6 funciones para impulsar tu Tiendanube.',
    '',
    'Comentá NEVUX y te mostramos cómo transformar tu tienda hoy mismo. 👇',
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
          borderBottom: '1px solid rgba(16,185,129,0.2)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 50,
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
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <div style={{ flex: 1 }} />
        <NevuxLogo size={22} />
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>
        
        {/* PESTAÑAS DE NAVEGACIÓN PRINCIPAL */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            background: 'rgba(6,30,20,0.8)',
            padding: 6,
            borderRadius: 14,
            border: '1px solid rgba(16,185,129,0.2)',
            marginBottom: 32,
          }}
        >
          <button
            onClick={() => setActiveTab('appstore')}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === 'appstore' ? '#10B981' : 'transparent',
              color: activeTab === 'appstore' ? '#000' : '#9ca3af',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <Grid size={18} /> App Store Banners (5 Assets)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === 'instagram' ? '#10B981' : 'transparent',
              color: activeTab === 'instagram' ? '#000' : '#9ca3af',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <Calendar size={18} /> Plan Instagram (Semana 1)
          </button>
        </div>

        {/* ====================================================================
            VISTA 1: APP STORE BANNERS (TIENDANUBE AR / NUVEMSHOP BR)
            ==================================================================== */}
        {activeTab === 'appstore' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    margin: '0 0 6px',
                    background: 'linear-gradient(135deg, #fff 30%, #10B981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🚀 Banners Oficiales App Store
                </h1>
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                  Assets visuales optimizados para conversión (16:10 landscape)
                </p>
              </div>

              {/* Switch de Idioma */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  background: 'rgba(0,0,0,0.5)',
                  padding: 4,
                  borderRadius: 10,
                  border: '1px solid rgba(16,185,129,0.3)',
                }}
              >
                <button
                  onClick={() => setLang('es')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: lang === 'es' ? '#10B981' : 'transparent',
                    color: lang === 'es' ? '#000' : '#d1d5db',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  🇦🇷 Tiendanube (ES)
                </button>
                <button
                  onClick={() => setLang('pt')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: lang === 'pt' ? '#10B981' : 'transparent',
                    color: lang === 'pt' ? '#000' : '#d1d5db',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  🇧🇷 Nuvemshop (PT)
                </button>
              </div>
            </div>

            {/* Banner 1: Propuesta de Valor Integrada */}
            <AppStoreBannerWrapper label={lang === 'es' ? 'Banner 1 · Propuesta de Valor All-in-One' : 'Banner 1 · Proposta de Valor All-in-One'}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '6px 14px', width: 'fit-content' }}>
                  <Sparkles size={14} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', letterSpacing: '0.05em' }}>
                    ECOSISTEMA CRO + IA
                  </span>
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                  {lang === 'es' ? (
                    <>El Motor Completo de Conversión para <span style={{ color: '#10B981' }}>Tiendanube</span></>
                  ) : (
                    <>O Motor Completo de Conversão para <span style={{ color: '#10B981' }}>Nuvemshop</span></>
                  )}
                </h2>
                <div style={{ background: 'rgba(6,30,20,0.9)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 12, padding: '14px 18px' }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#fff', margin: 0 }}>
                    {lang === 'es'
                      ? '50 Widgets + 6 funciones para impulsar tu Tiendanube'
                      : '50 Widgets + 6 funções para alavancar sua Nuvemshop'}
                  </p>
                </div>
              </div>
            </AppStoreBannerWrapper>

            {/* Banner 2: Prueba Social y Urgencia */}
            <AppStoreBannerWrapper label={lang === 'es' ? 'Banner 2 · Prueba Social & Urgencia' : 'Banner 2 · Prova Social & Urgência'}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bell size={18} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                    {lang === 'es' ? 'Gatillos Mentales Validados' : 'Gatilhos Mentais Validados'}
                  </span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>
                  {lang === 'es' ? 'Generá Confianza e Inmediatez en Vivo' : 'Gere Confiança e Imediatismo ao Vivo'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p style={{ fontSize: 11, color: '#10B981', fontWeight: 800, margin: '0 0 2px' }}>🔔 {lang === 'es' ? 'Notificaciones' : 'Notificações'}</p>
                    <p style={{ fontSize: 12, color: '#d1d5db', margin: 0 }}>{lang === 'es' ? 'Alerta de compras en tiempo real' : 'Alerta de compras em tempo real'}</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p style={{ fontSize: 11, color: '#f87171', fontWeight: 800, margin: '0 0 2px' }}>⏱️ {lang === 'es' ? 'Urgencia' : 'Urgência'}</p>
                    <p style={{ fontSize: 12, color: '#d1d5db', margin: 0 }}>{lang === 'es' ? 'Relojes regresivos & Stock crítico' : 'Contadores regressivos & Estoque crítico'}</p>
                  </div>
                </div>
              </div>
            </AppStoreBannerWrapper>

            {/* Banner 3: IA & Buscador por Voz */}
            <AppStoreBannerWrapper label={lang === 'es' ? 'Banner 3 · Asistente IA & Buscador por Voz' : 'Banner 3 · Assistente IA & Busca por Voz'}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bot size={18} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                    {lang === 'es' ? 'Inteligencia Avanzada' : 'Inteligência Avançada'}
                  </span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>
                  {lang === 'es' ? 'Vendedor Virtual 24/7 y Búsqueda por Voz' : 'Vendedor Virtual 24/7 e Busca por Voz'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    lang === 'es' ? '🤖 Chatbot IA que responde dudas de productos al instante' : '🤖 Chatbot IA que responde dúvidas sobre produtos instantaneamente',
                    lang === 'es' ? '🎙️ Buscador por Voz optimizado para celulares' : '🎙️ Busca por Voz otimizada para celulares',
                    lang === 'es' ? '🌐 Traducción automática en vivo (ES, PT, EN)' : '🌐 Tradução automática em tempo real (ES, PT, EN)',
                  ].map((feat, idx) => (
                    <div key={'b3-' + idx} style={{ fontSize: 12, color: '#e5e7eb', background: 'rgba(16,185,129,0.08)', padding: '8px 12px', borderRadius: 8 }}>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </AppStoreBannerWrapper>

            {/* Banner 4: Ticket Promedio y Leads */}
            <AppStoreBannerWrapper label={lang === 'es' ? 'Banner 4 · Elevá el Ticket Promedio' : 'Banner 4 · Aumente o Ticket Médio'}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp size={18} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                    {lang === 'es' ? 'Mayor Facturación por Cliente' : 'Maior Faturamento por Cliente'}
                  </span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>
                  {lang === 'es' ? 'Envío Gratis + Order Bump + Gamificación' : 'Frete Grátis + Order Bump + Gamificação'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
                    <ShoppingCart size={16} style={{ color: '#10B981', marginBottom: 4 }} />
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#fff', margin: 0 }}>Barra Envío Gratis</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
                    <Zap size={16} style={{ color: '#10B981', marginBottom: 4 }} />
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#fff', margin: 0 }}>Order Bump Checkout</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
                    <Gift size={16} style={{ color: '#10B981', marginBottom: 4 }} />
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#fff', margin: 0 }}>Raspá y Gana</p>
                  </div>
                </div>
              </div>
            </AppStoreBannerWrapper>

            {/* Banner 5: ROI e Instalación 1-Clic */}
            <AppStoreBannerWrapper label={lang === 'es' ? 'Banner 5 · ROI Transparente & Sin Código' : 'Banner 5 · ROI Transparente & Sem Código'}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={18} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                    {lang === 'es' ? 'Instalación Inmediata' : 'Instalação Imediata'}
                  </span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>
                  {lang === 'es' ? 'Sin Código · Activación en 2 Minutos' : 'Sem Código · Ativação em 2 Minutos'}
                </h2>
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BarChart3 size={22} style={{ color: '#10B981' }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: 0 }}>{lang === 'es' ? 'Panel de Métricas de ROI' : 'Painel de Métricas de ROI'}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{lang === 'es' ? 'Medí las ventas generadas en tiempo real' : 'Meça as vendas geradas em tempo real'}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#10B981', background: 'rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: 6 }}>
                    100% AUTOMÁTICO
                  </span>
                </div>
              </div>
            </AppStoreBannerWrapper>

            {/* COPY PARA PUBLICACIÓN EN EL PORTAL DE PARTNERS */}
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '40px 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageCircle size={20} style={{ color: '#10B981' }} />
              Copy Oficial para Portal de Partners ({lang.toUpperCase()})
            </h2>

            <CopyBlock
              id="copy-appstore"
              title={lang === 'es' ? 'Descripción Oficial para Tiendanube Partners AR' : 'Descrição Oficial para Nuvemshop Partners BR'}
              text={lang === 'es' ? appStoreCopyES : appStoreCopyPT}
              copied={copiedId === 'copy-appstore'}
              onCopy={() => handleCopy('copy-appstore', lang === 'es' ? appStoreCopyES : appStoreCopyPT)}
            />
          </div>
        )}

        {/* ====================================================================
            VISTA 2: PLAN SEMANAL DE INSTAGRAM (LUNES A VIERNES)
            ==================================================================== */}
        {activeTab === 'instagram' && (
          <div>
            {/* Switcher de Días */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 10,
                marginBottom: 28,
              }}
            >
              {[
                { id: 'lunes', label: 'Lunes (Carrusel)' },
                { id: 'martes', label: 'Martes (Reel)' },
                { id: 'miercoles', label: 'Miércoles (Carrusel)' },
                { id: 'jueves', label: 'Jueves (Reel)' },
                { id: 'viernes', label: 'Viernes (Carrusel)' },
              ].map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id as any)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: '1px solid rgba(16,185,129,0.3)',
                    background: selectedDay === day.id ? '#10B981' : 'rgba(6,30,20,0.6)',
                    color: selectedDay === day.id ? '#000' : '#d1d5db',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>

            {/* Ficha Resumen del Día Seleccionado */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,30,20,0.9) 100%)',
                border: '1px solid rgba(16,185,129,0.35)',
                borderRadius: 20,
                padding: 24,
                marginBottom: 36,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Layers size={20} style={{ color: '#10B981' }} />
                Ficha Técnica · {selectedDay.toUpperCase()}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Horario</span>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: '4px 0 0' }}>
                    {selectedDay === 'martes' || selectedDay === 'jueves' ? '19:30 hs (Reel)' : '11:30 hs (Carrusel)'}
                  </p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Oferta Principal</span>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#10B981', margin: '4px 0 0' }}>
                    50 Widgets + 6 funciones
                  </p>
                </div>
              </div>
            </div>

            {/* VISTA DEL DÍA SELECCIONADO */}
            {selectedDay === 'viernes' && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
                  🖼️ CARRUSEL VIERNES (7 Slides)
                </h2>
                <SlideWrapper label="Slide 1 · Hook">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>
                      Así se ve una <span style={{ color: '#10B981' }}>Tiendanube</span> optimizada para vender 🚀
                    </h3>
                  </div>
                </SlideWrapper>
                <SlideWrapper label="Slide 7 · CTA Final">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, textAlign: 'center' }}>
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 12, padding: 16, width: '100%' }}>
                      <p style={{ fontSize: 13, color: '#fff', fontWeight: 800, margin: 0 }}>
                        50 Widgets + 6 funciones para impulsar tu Tiendanube
                      </p>
                    </div>
                    <p style={{ fontSize: 18, color: '#10B981', margin: 0, fontWeight: 900 }}>
                      Comentá NEVUX 👇
                    </p>
                  </div>
                </SlideWrapper>
                <CopyBlock
                  id="copy-ig-viernes"
                  title="Copy Viernes — Ecosistema Completo"
                  text={copyViernes}
                  copied={copiedId === 'copy-ig-viernes'}
                  onCopy={() => handleCopy('copy-ig-viernes', copyViernes)}
                />
              </>
            )}

            {selectedDay === 'lunes' && (
              <>
                <SlideWrapper label="Slide 1 · Hook Lunes">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>
                      ¿Tus clientes ven tus productos pero <span style={{ color: '#f87171' }}>no compran</span>? ⏱️
                    </h3>
                  </div>
                </SlideWrapper>
                <CopyBlock
                  id="copy-ig-lunes"
                  title="Copy Lunes — Urgencia & Cuentas Regresivas"
                  text={copyLunes}
                  copied={copiedId === 'copy-ig-lunes'}
                  onCopy={() => handleCopy('copy-ig-lunes', copyLunes)}
                />
              </>
            )}

            {selectedDay === 'martes' && (
              <>
                <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#10B981', margin: '0 0 10px' }}>🎬 Guión de Reel (Buscador por Voz)</h3>
                  <p style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.6, margin: 0 }}>
                    1. Mostrar pantalla de Tiendanube en celular.<br/>
                    2. Tocar icono de micrófono Nevux y decir: "Zapatillas negras talle 42".<br/>
                    3. Mostrar la velocidad de resultado instantáneo.<br/>
                    4. CTA: "50 Widgets + 6 funciones para impulsar tu Tiendanube".
                  </p>
                </div>
                <CopyBlock
                  id="copy-ig-martes"
                  title="Copy Martes — Buscador por Voz"
                  text={copyMartes}
                  copied={copiedId === 'copy-ig-martes'}
                  onCopy={() => handleCopy('copy-ig-martes', copyMartes)}
                />
              </>
            )}

            {selectedDay === 'miercoles' && (
              <>
                <SlideWrapper label="Slide 1 · Hook Miércoles">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>
                      Cómo subir tu <span style={{ color: '#10B981' }}>Ticket Promedio</span> sin gastar más en anuncios 🚚
                    </h3>
                  </div>
                </SlideWrapper>
                <CopyBlock
                  id="copy-ig-miercoles"
                  title="Copy Miércoles — Envío Gratis & Order Bumps"
                  text={copyMiercoles}
                  copied={copiedId === 'copy-ig-miercoles'}
                  onCopy={() => handleCopy('copy-ig-miercoles', copyMiercoles)}
                />
              </>
            )}

            {selectedDay === 'jueves' && (
              <>
                <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#10B981', margin: '0 0 10px' }}>🎬 Guión de Reel (Raspá y Gana)</h3>
                  <p style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.6, margin: 0 }}>
                    1. Demostración en vivo rascando la tarjeta flotante Nevux en el celular.<br/>
                    2. Ganar cupón e ingresar email en el acto.<br/>
                    3. CTA: "50 Widgets + 6 funciones para impulsar tu Tiendanube".
                  </p>
                </div>
                <CopyBlock
                  id="copy-ig-jueves"
                  title="Copy Jueves — Gamificación Raspá y Gana"
                  text={copyJueves}
                  copied={copiedId === 'copy-ig-jueves'}
                  onCopy={() => handleCopy('copy-ig-jueves', copyJueves)}
                />
              </>
            )}
          </div>
        )}

        {/* Footer del Admin */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid rgba(16,185,129,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Nevux Admin Panel · Assets Oficiales para Tiendanube / Nuvemshop
          </span>
          <NevuxLogo size={18} />
        </div>
      </main>
    </div>
  );
        }
