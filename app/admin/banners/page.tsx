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
  Video,
  Gift,
  Maximize2,
  X,
  Zap,
  Award,
  Crown,
  Target,
  Play,
  Rocket,
  Clock,
  MessageSquare,
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

/* ─── Wrapper Copy Bloque Interactivo ─── */
function CopyBlock({ id, title, text, copied, onCopy }: { id: string; title: string; text: string; copied: boolean; onCopy: () => void }) {
  return (
    <div style={{ background: '#061e14', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: 16, marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
        <button onClick={onCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, background: copied ? '#059669' : 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 10px', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#d1d5db', fontSize: 12, lineHeight: 1.6, fontFamily: 'system-ui, sans-serif', margin: 0 }}>{text}</pre>
    </div>
  );
}

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<'metaads' | 'appstore' | 'instagram'>('metaads');
  const [lang, setLang] = useState<'es' | 'pt'>('es');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ─── Meta Ads Copy Principal ─── */
  const metaAdCopyPrimaryES = [
    '🔥 ¿Tu Tiendanube se ve exactamente igual a las miles que hay en internet?',
    '',
    'El problema no es tu producto ni tus precios. El problema es la FALTA DE OPTIMIZACIÓN de tu tienda.',
    '',
    'Presentamos NEVUX: El Ecosistema de Conversión (CRO) e Inteligencia Artificial más completo para Tiendanube.',
    '',
    '🛠️ SUITE DE 50 WIDGETS DE CONVERSIÓN:',
    '• Contadores de urgencia y stock crítico',
    '• Notificaciones de compras en tiempo real (Prueba Social)',
    '• Barras dinámicas de Envío Gratis',
    '• Gamificación: Raspá y Gana para capturar emails',
    '• Order Bumps y Venta Cruzada en carrito',
    '• Cajas de opiniones verificadas con foto',
    '',
    '🧠 6 FUNCIONES INTELIGENTES CON IA:',
    '1. Asistente de Ventas IA 24/7 (Responde y vende por vos)',
    '2. Buscador por Voz optimizado para celulares',
    '3. Traductor Automático en Vivo (ES, PT, EN)',
    '4. Asistente de Soporte & CRM para WhatsApp',
    '5. Notificaciones de Ventas PRO con ubicación',
    '6. Métricas de ROI e Impacto en Facturación en Vivo',
    '',
    '🎁 PROGRAMA EXCLUSIVO CLUB FUNDADORES (Solo primeros 20 clientes):',
    'Recompensamos a los clientes fieles que crecen con nosotros:',
    '🥉 A los 3 meses: Auditoría CRO Personalizada + Soporte Prioritario VIP.',
    '🥈 A los 6 meses: Acceso exclusivo a nuevos modelos IA en Beta + Tarifa Congelada.',
    '🥇 Al cumplir 1 año: Badge Oficial "Tienda Fundadora" + Suite de Funciones Pro gratis de por vida.',
    '',
    '🚀 50 Widgets + 6 funciones para impulsar tu Tiendanube',
    '',
    'Instalación en 2 minutos sin tocar código.',
    '',
    '👉 Hacé clic en "Instalar Ahora" y asegurá 1 de los 20 cupos de Fundadores.',
  ].join('\n');

  const metaAdScriptVideo = [
    '🎬 GUIÓN DE VIDEO REEL / META ADS (60 SEGUNDOS)',
    '--------------------------------------------------',
    '⏱️ 0:00 - 0:05 | HOOK VISUAL Y AUDITIVO',
    '(Aparece celular mostrando plantilla típica genérica de Tiendanube)',
    'Locución: "¿Sabías que el 70% de las visitas se van de tu Tiendanube sin comprar porque la tienda transmite frialdad?"',
    '',
    '⏱️ 0:05 - 0:20 | EL PROBLEMA Y LA REVELACIÓN',
    '(Efecto de transición con brillo verde. Aparece la tienda con Nevux activado)',
    'Locución: "El problema no son tus productos. Es la falta de herramientas para convertir. Te presento NEVUX: la plataforma que transforma tu Tiendanube en una máquina de ventas."',
    '',
    '⏱️ 0:20 - 0:35 | ECOSISTEMA COMPLETO (50 WIDGETS + 6 FUNCIONES IA)',
    '(Ráfaga rápida de pantalla mostrando el Buscador por Voz, el Asistente IA respondiendo, la Barra de Envío Gratis y el Raspá y Gana)',
    'Locución: "Accedés a 50 Widgets de conversión y 6 funciones de Inteligencia Artificial. Buscador por Voz para celulares, Vendedor Virtual 24/7, CRM de WhatsApp y métricas de ROI en tiempo real."',
    '',
    '⏱️ 0:35 - 0:50 | PROGRAMA EXCLUSIVO 20 CLIENTES FUNDADORES',
    '(Aparece placa dorada/esmeralda con medallas)',
    'Locución: "Y atención: Para los primeros 20 clientes que se sumen hoy, activamos el Programa Fundadores. Recompensamos tu fidelidad: a los 3 meses tenés auditoría CRO personalizada; a los 6 meses congelamos tu tarifa para siempre; y al cumplir 1 año desbloqueás beneficios PRO de por vida."',
    '',
    '⏱️ 0:50 - 1:00 | CTA FINAL CON OFERTA OFICIAL',
    '(Pantalla final con Logo Nevux arriba a la izquierda y el banner de oferta)',
    'Locución: "50 Widgets + 6 funciones para impulsar tu Tiendanube. Hacé clic acá abajo e instalalo en 2 minutos sin saber de código."',
  ].join('\n');

  return (
    <div style={{ minHeight: '100vh', background: '#020a07', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ background: '#04140e', borderBottom: '1px solid rgba(16,185,129,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/admin" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
          <ArrowLeft size={14} /> Volver
        </Link>
        <div style={{ flex: 1 }} />
        <NevuxLogo size={16} />
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '20px 12px 60px' }}>
        
        {/* NAVEGACIÓN PRINCIPAL */}
        <div style={{ display: 'flex', gap: 6, background: 'rgba(6,30,20,0.85)', padding: 4, borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab('metaads')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'metaads' ? '#10B981' : 'transparent',
              color: activeTab === 'metaads' ? '#000' : '#9ca3af',
              fontWeight: 800,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Flame size={13} /> 🔥 Meta Ads Campaign (Máxima Conversión)
          </button>
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
            <Grid size={13} /> App Store
          </button>
        </div>

        {/* ====================================================================
            PESTAÑA 1: META ADS MASTER CAMPAIGN (LO NUEVO Y MÁS POTENTE)
            ==================================================================== */}
        {activeTab === 'metaads' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, padding: '4px 10px', marginBottom: 8 }}>
                <Target size={12} color="#10B981" />
                <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981' }}>ANUNCIO DE CAPTACIÓN MASIVA</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>
                🚀 Anuncio Maestro Meta Ads (FB & IG)
              </h1>
              <p style={{ color: '#9ca3af', fontSize: 12, margin: 0 }}>
                Estrategia de conversión con Ecosistema Nevux + Programa Recompensas 20 Fundadores.
              </p>
            </div>

            {/* TARJETA PROGRAMA FUNDADORES (LAS RECOMPENSAS) */}
            <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,30,20,0.95) 100%)', border: '1.5px solid #10B981', borderRadius: 14, padding: 16, marginBottom: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Crown size={20} color="#facc15" />
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>PROGRAMA EXCLUSIVO 20 CLIENTES FUNDADORES</span>
                </div>
                <span style={{ fontSize: 9, background: '#facc15', color: '#000', fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                  SOLO 20 CUPOS
                </span>
              </div>
              
              <p style={{ fontSize: 11, color: '#d1d5db', lineHeight: 1.4, margin: '0 0 14px' }}>
                No solo vendemos herramientas, recompensamos la fidelidad de los comerciantes que crecen con Nevux desde el inicio:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(250,204,21,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Award size={16} color="#facc15" />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#facc15', margin: 0 }}>🥉 A los 3 Meses:</p>
                    <p style={{ fontSize: 10, color: '#e5e7eb', margin: 0 }}>Auditoría CRO Personalizada + Soporte Prioritario VIP 24/7.</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Award size={16} color="#10B981" />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#10B981', margin: 0 }}>🥈 A los 6 Meses:</p>
                    <p style={{ fontSize: 10, color: '#e5e7eb', margin: 0 }}>Acceso exclusivo a nuevos modelos IA en Beta + Bloqueo de Tarifa de por Vida.</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Crown size={16} color="#c084fc" />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#c084fc', margin: 0 }}>🥇 Al cumplir 1 Año:</p>
                    <p style={{ fontSize: 10, color: '#e5e7eb', margin: 0 }}>Badge Oficial &quot;Tienda Fundadora&quot; + Suite de Funciones Pro Gratis de por vida.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PREVISUALIZACIÓN VISUAL DEL ANUNCIO (STORY/REEL 9:16) */}
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Play size={16} color="#10B981" /> Visual del Anuncio (Formato Reel / Story 9:16)
            </h2>

            <div style={{ aspectRatio: '9/16', maxWidth: 320, margin: '0 auto 24px', background: '#020a07', border: '2px solid #10B981', borderRadius: 20, padding: 18, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
              {/* Logo ÚNICAMENTE arriba a la izquierda */}
              <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                <NevuxLogo size={16} />
              </div>

              {/* Tag Fundadores arriba derecha */}
              <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: '#facc15', color: '#000', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                1/20 FUNDADORES
              </div>

              {/* Contenido Central */}
              <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#10B981', letterSpacing: '0.1em' }}>ECOSISTEMA COMPLETO</span>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                  Transformá tu <span style={{ color: '#10B981' }}>Tiendanube</span> en una máquina de ventas 🚀
                </h3>

                <div style={{ background: 'rgba(6,30,20,0.9)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: 10 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: '#10B981', margin: '0 0 4px' }}>🛠️ 50 WIDGETS + 🧠 6 FUNCIONES IA</p>
                  <p style={{ fontSize: 8, color: '#d1d5db', margin: 0 }}>• Buscador por Voz · Vendedor IA 24/7 · WhatsApp CRM · Envíos Gratis · Raspá y Gana</p>
                </div>

                <div style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)', borderRadius: 10, padding: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 8, fontWeight: 800, color: '#facc15', margin: 0 }}>🎁 RECOMPENSAS A LOS 3, 6 Y 12 MESES</p>
                  <p style={{ fontSize: 7, color: '#e5e7eb', margin: '2px 0 0' }}>Beneficios exclusivos de por vida para los primeros 20</p>
                </div>
              </div>

              {/* Botón CTA Inferior */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ background: '#10B981', color: '#000', borderRadius: 10, padding: '10px', textAlign: 'center', fontWeight: 900, fontSize: 11 }}>
                  INSTALAR EN 2 MINUTOS ⚡
                </div>
                <p style={{ fontSize: 8, color: '#6b7280', margin: 0, textAlign: 'center' }}>
                  50 Widgets + 6 funciones para impulsar tu Tiendanube
                </p>
              </div>
            </div>

            {/* BLOQUES DE COPY Y GUIÓN */}
            <CopyBlock
              id="meta-script"
              title="🎬 Guión de Video Reel / Locución (60 Segundos)"
              text={metaAdScriptVideo}
              copied={copiedId === 'meta-script'}
              onCopy={() => handleCopy('meta-script', metaAdScriptVideo)}
            />

            <CopyBlock
              id="meta-primary"
              title="📝 Copy Texto Principal para Meta Ads (Facebook e Instagram)"
              text={metaAdCopyPrimaryES}
              copied={copiedId === 'meta-primary'}
              onCopy={() => handleCopy('meta-primary', metaAdCopyPrimaryES)}
            />
          </div>
        )}

        {/* ====================================================================
            PESTAÑA 2: APP STORE BANNERS (1920 X 1080 PX)
            ==================================================================== */}
        {activeTab === 'appstore' && (
          <div>
            <p style={{ color: '#9ca3af', fontSize: 12 }}>
              Los 5 Banners de la App Store de Tiendanube y Nuvemshop están guardados en resolución de 1920 x 1080 px en la pestaña correspondiente.
            </p>
          </div>
        )}

        <div style={{ marginTop: 24, paddingTop: 12, borderTop: '1px solid rgba(16,185,129,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#6b7280' }}>Nevux · Meta Ads Blueprint & Loyalty Program</span>
          <NevuxLogo size={12} />
        </div>
      </main>
    </div>
  );
  }
