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
  MessageSquare,
  Gift,
  Settings,
  MousePointerClick,
  CheckCircle,
} from 'lucide-react';

/* ─── Logo Oficial NEVUX (Isologotipo con N real) ─── */
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

/* ─── Wrapper Canvas Banner App Store (Ratio 16:10) - ESTILO SaaS PREMIUM ─── */
function AppStoreBannerWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#10B981',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 12,
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
          maxWidth: 800,
          background: '#020a07',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Fondo Tech/Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />

        {/* Glow Radial */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo Nevux ÚNICAMENTE en la parte superior izquierda */}
        <div style={{ position: 'absolute', top: 24, left: 28, zIndex: 10 }}>
          <NevuxLogo size={22} />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            padding: '28px 28px 28px 28px',
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

/* ─── Layout 2 Columnas para Banners (Texto Izquierda / Mockups UI Derecha) ─── */
function BannerLayout({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 24, width: '100%', height: '100%', paddingTop: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 20 }}>
        {left}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {right}
      </div>
    </div>
  );
}

/* ─── Wrapper Slide Carrusel Instagram (4:5) ─── */
function SlideWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ aspectRatio: '4/5', maxWidth: 420, background: '#020a07', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}><NevuxLogo size={20} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 28 }}>{children}</div>
      </div>
    </div>
  );
}

function CopyBlock({ id, title, text, copied, onCopy }: { id: string; title: string; text: string; copied: boolean; onCopy: () => void }) {
  return (
    <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
        <button onClick={onCopy} style={{ display: 'flex', alignItems: 'center', gap: 6, background: copied ? '#059669' : 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#d1d5db', fontSize: 13, lineHeight: 1.7, fontFamily: 'system-ui, sans-serif', margin: 0 }}>{text}</pre>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
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

  /* ── Copys App Store ── */
  const appStoreCopyES = [
    '⚡ Impulsá tus ventas en Tiendanube con el Ecosistema Nevux',
    '',
    'Nevux es la suite de optimización de conversión (CRO) e Inteligencia Artificial definitiva diseñada para Tiendanube.',
    '',
    '🔥 ¿Qué incluye Nevux?',
    '',
    '🛠️ Suite de 50 Widgets de Conversión:',
    '• Contadores regresivos para fechas especiales (Hot Sale, Cyber Monday)',
    '• Notificaciones de compras en tiempo real (Prueba Social)',
    '• Barras dinámicas de Envío Gratis',
    '• Gamificación: Raspá y Gana / Ruleta de premios',
    '• Order Bumps y Venta Cruzada en carrito',
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
    '• Contadores regressivos para datas especiais (Black Friday, Dia das Mães)',
    '• Notificações de compras em tempo real (Prova Social)',
    '• Barras dinâmicas de Frete Grátis',
    '• Gamificação: Raspadinha & Roleta de prêmios',
    '• Order Bumps e Venda Cruzada no carrinho',
    '• Botões de WhatsApp flutuantes e caixas de avaliações',
    '',
    '🧠 6 Funções Inteligentes com IA:',
    '1. Assistente de Vendas IA 24/7 (Responde dúvidas e fecha vendas)',
    '2. Busca por Voz otimizada para celulares',
    '3. Tradutor Automático em Vivo (Espanhol, Português, Inglês)',
    '4. Assistente de Suporte & CRM para WhatsApp',
    '5. Notificações de Vendas PRO',
    '6. Métricas de ROI em Tempo Real',
    '',
    '🚀 Oferta Principal:',
    '50 Widgets + 6 funções para alavancar sua Nuvemshop',
    '',
    '✅ Instalação em 2 minutos sem código.',
    '✅ 100% Personalizável com as cores da sua marca.',
  ].join('\n');

  /* ── Copys Instagram (Resumido para espacio, se asume igual al prompt anterior) ── */
  const copyIG = "Comentá NEVUX y te pasamos el link de instalación. 👇";

  return (
    <div style={{ minHeight: '100vh', background: '#020a07', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ background: '#04140e', borderBottom: '1px solid rgba(16,185,129,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/admin" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}><ArrowLeft size={16} /> Volver</Link>
        <div style={{ flex: 1 }} />
        <NevuxLogo size={22} />
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>
        
        {/* PESTAÑAS */}
        <div style={{ display: 'flex', gap: 12, background: 'rgba(6,30,20,0.8)', padding: 6, borderRadius: 14, border: '1px solid rgba(16,185,129,0.2)', marginBottom: 32 }}>
          <button onClick={() => setActiveTab('appstore')} style={{ flex: 1, padding: '12px 18px', borderRadius: 10, border: 'none', background: activeTab === 'appstore' ? '#10B981' : 'transparent', color: activeTab === 'appstore' ? '#000' : '#9ca3af', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
            <Grid size={18} /> App Store Banners (5 UI Mockups)
          </button>
          <button onClick={() => setActiveTab('instagram')} style={{ flex: 1, padding: '12px 18px', borderRadius: 10, border: 'none', background: activeTab === 'instagram' ? '#10B981' : 'transparent', color: activeTab === 'instagram' ? '#000' : '#9ca3af', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
            <Calendar size={18} /> Plan Instagram (Semana 1)
          </button>
        </div>

        {/* ====================================================================
            VISTA 1: APP STORE BANNERS (MOCKUPS UI AVANZADOS)
            ==================================================================== */}
        {activeTab === 'appstore' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 6px', background: 'linear-gradient(135deg, #fff 30%, #10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  🎨 Banners UI App Store
                </h1>
                <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Diseño SaaS Premium · Superando a competidores</p>
              </div>
              <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 10, border: '1px solid rgba(16,185,129,0.3)' }}>
                <button onClick={() => setLang('es')} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: lang === 'es' ? '#10B981' : 'transparent', color: lang === 'es' ? '#000' : '#d1d5db', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>🇦🇷 ES (TN)</button>
                <button onClick={() => setLang('pt')} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: lang === 'pt' ? '#10B981' : 'transparent', color: lang === 'pt' ? '#000' : '#d1d5db', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>🇧🇷 PT (Nuvem)</button>
              </div>
            </div>

            {/* ── BANNER 1: Ecosistema Completo (50 Widgets + 6 Funciones) ── */}
            <AppStoreBannerWrapper label="Banner 1 · All-in-One Dashboard">
              <BannerLayout 
                left={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 20, padding: '6px 14px', width: 'fit-content' }}>
                      <Bot size={14} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981' }}>CRO + IA SUITE</span>
                    </div>
                    <h2 style={{ fontSize: 34, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1 }}>
                      {lang === 'es' ? 'Destacá y vendé más en tu tienda' : 'Destaque-se e venda mais na sua loja'}
                    </h2>
                    <p style={{ fontSize: 15, color: '#d1d5db', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                      {lang === 'es' 
                        ? 'El ecosistema más avanzado para optimizar tu conversión sin tocar código.' 
                        : 'O ecossistema mais avançado para otimizar sua conversão sem tocar em código.'}
                    </p>
                    <div style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.5)', borderRadius: 12, padding: '16px 20px', marginTop: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                      <p style={{ fontSize: 14, fontWeight: 900, color: '#10B981', margin: 0 }}>
                        {lang === 'es' ? '50 Widgets + 6 funciones para impulsar tu Tiendanube' : '50 Widgets + 6 funções para alavancar sua Nuvemshop'}
                      </p>
                    </div>
                  </div>
                }
                right={
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Mockup UI Cascading Cards */}
                    <div style={{ position: 'absolute', top: 20, right: 10, width: 260, background: '#061e14', border: '1px solid #10B981', borderRadius: 16, padding: 16, boxShadow: '-10px 15px 30px rgba(0,0,0,0.6)', transform: 'rotate(4deg)', zIndex: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ background: '#10B981', padding: 8, borderRadius: 8 }}><Grid size={18} color="#000" /></div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>50 Widgets</div>
                          <div style={{ fontSize: 10, color: '#9ca3af' }}>{lang === 'es' ? 'Activación 1-clic' : 'Ativação 1-clique'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                         <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 8px', borderRadius: 12, color: '#10B981' }}>{lang === 'es' ? 'Urgencia' : 'Urgência'}</span>
                         <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 8px', borderRadius: 12, color: '#10B981' }}>{lang === 'es' ? 'Social Proof' : 'Social Proof'}</span>
                         <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 8px', borderRadius: 12, color: '#10B981' }}>Gamification</span>
                      </div>
                    </div>

                    <div style={{ position: 'absolute', top: 90, right: 60, width: 260, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, boxShadow: '-10px 15px 30px rgba(0,0,0,0.6)', transform: 'rotate(-3deg)', zIndex: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', padding: 8, borderRadius: 8 }}><Bot size={18} color="#000" /></div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>6 {lang === 'es' ? 'Funciones IA' : 'Funções IA'}</div>
                          <div style={{ fontSize: 10, color: '#9ca3af' }}>Asistente, Voz, CRM...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 2: Ticket Promedio (Mockup Carrito + Envío Gratis) ── */}
            <AppStoreBannerWrapper label="Banner 2 · Ticket Promedio & Upsell">
              <BannerLayout 
                left={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TrendingUp size={18} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>{lang === 'es' ? 'Estrategia de Ventas' : 'Estratégia de Vendas'}</span>
                    </div>
                    <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      Elevá tu <span style={{ color: '#10B981' }}>Ticket Promedio</span>
                    </h2>
                    <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                      {lang === 'es' 
                        ? 'Aumentá la facturación por cliente comunicando cuánto falta para envíos y ofreciendo productos complementarios (Order Bump).' 
                        : 'Aumente o faturamento por cliente comunicando quanto falta para frete grátis e oferecendo produtos complementares.'}
                    </p>
                  </div>
                }
                right={
                  <div style={{ width: '100%', maxWidth: 300, background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }}>
                    {/* Header Mini Cart */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{lang === 'es' ? 'Tu Carrito' : 'Seu Carrinho'}</span>
                      <ShoppingCart size={14} color="#9ca3af" />
                    </div>
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      
                      {/* Widget Envío Gratis */}
                      <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: 12 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', margin: '0 0 8px', textAlign: 'center' }}>
                          🎉 {lang === 'es' ? '¡Estás a un paso del Envío Gratis!' : 'Você está a um passo do Frete Grátis!'}
                        </p>
                        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: '75%', height: '100%', background: '#10B981', borderRadius: 4 }} />
                        </div>
                      </div>

                      {/* Item genérico */}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ width: '60%', height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, marginBottom: 6 }} />
                          <div style={{ width: '40%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                        </div>
                      </div>

                      {/* Widget Order Bump */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 16, height: 16, border: '2px solid #10B981', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} color="#10B981" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', margin: 0 }}>
                            {lang === 'es' ? 'Agregar seguro de envío' : 'Adicionar seguro de envio'}
                          </p>
                          <p style={{ fontSize: 9, color: '#10B981', margin: 0, fontWeight: 800 }}>+ {lang === 'es' ? 'Recomendado' : 'Recomendado'}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 3: Confianza & Urgencia (Mockup Notificaciones/Reviews) ── */}
            <AppStoreBannerWrapper label="Banner 3 · Confianza & Prueba Social">
              <BannerLayout 
                left={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ShieldCheck size={18} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>{lang === 'es' ? 'Gatillos Mentales' : 'Gatilhos Mentais'}</span>
                    </div>
                    <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      Generá <span style={{ color: '#10B981' }}>confianza</span> en tiempo real
                    </h2>
                    <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                      {lang === 'es' 
                        ? 'Mostrá notificaciones de ventas recientes, cuentas regresivas y reseñas destacadas para que tus clientes se sientan seguros.' 
                        : 'Mostre notificações de vendas recentes, contadores e avaliações em destaque para que seus clientes sintam-se seguros.'}
                    </p>
                  </div>
                }
                right={
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    
                    {/* Mockup Notificación de Venta */}
                    <div style={{ position: 'absolute', top: 30, right: 10, background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 15px 30px rgba(0,0,0,0.6)', zIndex: 3, width: 280 }}>
                      <div style={{ width: 36, height: 36, background: '#061e14', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={16} color="#10B981" />
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{lang === 'es' ? 'Alguien en Córdoba compró' : 'Alguém em São Paulo comprou'}</p>
                        <p style={{ fontSize: 12, fontWeight: 800, color: '#fff', margin: 0 }}>Zapatillas Urbanas Pro</p>
                        <p style={{ fontSize: 9, color: '#10B981', margin: '2px 0 0' }}>{lang === 'es' ? 'Hace 2 minutos' : 'Há 2 minutos'}</p>
                      </div>
                    </div>

                    {/* Mockup Review */}
                    <div style={{ position: 'absolute', top: 110, right: 50, background: '#061e14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, boxShadow: '0 15px 30px rgba(0,0,0,0.6)', zIndex: 2, width: 250 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#facc15" color="#facc15" />)}
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>"Excelente calidad"</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>{lang === 'es' ? 'Llegó rapidísimo y el producto es tal cual la foto. Recomendado.' : 'Chegou muito rápido e o produto é igual à foto. Recomendo.'}</p>
                    </div>

                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 4: Fechas Especiales & IA (Mockup Buscador Voz / Banner Promo) ── */}
            <AppStoreBannerWrapper label="Banner 4 · Fechas Especiales & IA">
              <BannerLayout 
                left={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Calendar size={18} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>{lang === 'es' ? 'Campañas Exitosas' : 'Campanhas de Sucesso'}</span>
                    </div>
                    <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      Destacá tus ofertas en <span style={{ color: '#10B981' }}>Fechas Especiales</span>
                    </h2>
                    <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                      {lang === 'es' 
                        ? 'Prepará tu tienda para Hot Sale o Black Friday con banners flotantes y ayudá a tus clientes con el Buscador por Voz Inteligente.' 
                        : 'Prepare sua loja para Black Friday com banners flutuantes e ajude seus clientes com a Busca por Voz Inteligente.'}
                    </p>
                  </div>
                }
                right={
                  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 10 }}>
                    
                    {/* Mockup Banner Black Friday */}
                    <div style={{ background: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)', borderRadius: 10, padding: '12px 20px', width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase' }}>BLACK FRIDAY 🔥</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{lang === 'es' ? 'Hasta 50% OFF en toda la tienda' : 'Até 50% OFF em toda a loja'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{ background: '#000', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 6px', borderRadius: 4 }}>08</div>
                        <span style={{ color: '#fff', fontWeight: 700 }}>:</span>
                        <div style={{ background: '#000', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 6px', borderRadius: 4 }}>45</div>
                      </div>
                    </div>

                    {/* Mockup Buscador por Voz */}
                    <div style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 30, padding: '10px 16px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang === 'es' ? 'Escuchando "Campera negra"...' : 'Ouvindo "Jaqueta preta"...'}</span>
                      <div style={{ width: 28, height: 28, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
                        <Mic size={14} color="#000" />
                      </div>
                    </div>

                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* ── BANNER 5: Customización (Mockup Dashboard Settings) ── */}
            <AppStoreBannerWrapper label="Banner 5 · Customización & Dashboard">
              <BannerLayout 
                left={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Settings size={18} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>{lang === 'es' ? 'Cero Código' : 'Zero Código'}</span>
                    </div>
                    <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>
                      Tus estilos, <span style={{ color: '#10B981' }}>tus colores</span>
                    </h2>
                    <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                      {lang === 'es' 
                        ? 'Customizá cada widget para que se adapte perfectamente a la identidad visual de tu marca desde un panel intuitivo.' 
                        : 'Customize cada widget para que se adapte perfeitamente à identidade visual da sua marca a partir de um painel intuitivo.'}
                    </p>
                  </div>
                }
                right={
                  <div style={{ width: '100%', maxWidth: 320, background: '#020a07', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
                    <div style={{ padding: '12px 16px', background: '#061e14', borderBottom: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <NevuxLogo size={14} /> <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>/ Settings</span>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      
                      {/* Color Picker Mockup */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#d1d5db', fontWeight: 500 }}>{lang === 'es' ? 'Color Principal' : 'Cor Principal'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#111827', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ width: 14, height: 14, background: '#10B981', borderRadius: '50%' }} />
                          <span style={{ fontSize: 11, color: '#fff', fontFamily: 'monospace' }}>#10B981</span>
                        </div>
                      </div>

                      {/* Color Picker Mockup 2 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#d1d5db', fontWeight: 500 }}>{lang === 'es' ? 'Texto Destacado' : 'Texto Destaque'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#111827', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ width: 14, height: 14, background: '#ffffff', borderRadius: '50%' }} />
                          <span style={{ fontSize: 11, color: '#fff', fontFamily: 'monospace' }}>#FFFFFF</span>
                        </div>
                      </div>

                      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

                      {/* Toggle Mockup */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#d1d5db', fontWeight: 500 }}>{lang === 'es' ? 'Activar modo oscuro' : 'Ativar modo escuro'}</span>
                        <div style={{ width: 34, height: 20, background: '#10B981', borderRadius: 10, position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: '#fff', borderRadius: '50%' }} />
                        </div>
                      </div>

                      {/* Button Mockup */}
                      <div style={{ marginTop: 8, background: '#10B981', color: '#000', fontSize: 12, fontWeight: 800, textAlign: 'center', padding: '10px', borderRadius: 8 }}>
                        {lang === 'es' ? 'Guardar Cambios' : 'Salvar Alterações'}
                      </div>

                    </div>
                  </div>
                }
              />
            </AppStoreBannerWrapper>

            {/* COPY OFICIAL */}
            <CopyBlock
              id="copy-appstore"
              title={lang === 'es' ? 'Copy Oficial - Tiendanube AR' : 'Copy Oficial - Nuvemshop BR'}
              text={lang === 'es' ? appStoreCopyES : appStoreCopyPT}
              copied={copiedId === 'copy-appstore'}
              onCopy={() => handleCopy('copy-appstore', lang === 'es' ? appStoreCopyES : appStoreCopyPT)}
            />
          </div>
        )}

        {/* ====================================================================
            VISTA 2: PLAN SEMANAL DE INSTAGRAM (LUNES A VIERNES) - IGUAL
            ==================================================================== */}
        {activeTab === 'instagram' && (
           <div style={{ textAlign: 'center', padding: '40px 0' }}>
             <h2 style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>Planificación Semanal Activa</h2>
             <p style={{ color: '#9ca3af', fontSize: 14 }}>El contenido de Instagram (Lunes a Viernes) se mantiene idéntico a la versión aprobada previamente.</p>
           </div>
        )}
      </main>
    </div>
  );
}
