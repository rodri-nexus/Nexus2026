'use client';

import React, { useState } from 'react';
import {
  Video, CheckCircle2, Copy, Check, Gift, Award, Crown, Clock,
  Link2, Play, Mic, FileText, Shield, Star, Users, Zap, Moon, Smartphone,
  TrendingUp, BarChart3, Calendar, Sparkles, QrCode, PackageCheck, ArrowRight
} from 'lucide-react';

// ============================================================
// LOGO OFICIAL NEVUX V2
// ============================================================
const NevuxIsotype = ({ size = 22, isBlack = false }: { size?: number; isBlack?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="18" width="15" height="64" rx="2" fill={isBlack ? "#000000" : "#FFFFFF"} />
    <rect x="68" y="18" width="15" height="42" rx="2" fill={isBlack ? "#000000" : "#D1D5DB"} />
    <path d="M29 22 L78 88" stroke={isBlack ? "#000000" : "#FFFFFF"} strokeWidth="15" strokeLinecap="round" />
  </svg>
);

const BrandHeader = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
    <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#0a0a0a', border: '1.5px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
      <NevuxIsotype size={18} />
    </div>
    <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', fontFamily: 'system-ui, sans-serif' }}>
      NEVUX
    </span>
  </div>
);

// ============================================================
// COMPONENTES UI
// ============================================================
const ScheduleBanner = ({ day, schedules }: { day: string, schedules: { time: string, action: string, type: 'post' | 'story' }[] }) => (
  <div style={{ backgroundColor: '#0B1512', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 16, padding: 16, marginBottom: 24, width: '100%', boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: '1px solid #1F2937', paddingBottom: 10 }}>
      <Clock size={16} color="#10B981" />
      <span style={{ color: '#10B981', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em' }}>HORARIOS · {day}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {schedules.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#020a07', padding: '8px 12px', borderRadius: 8, border: '1px solid #1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ backgroundColor: '#111827', color: '#FFF', padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>{s.time}</span>
            <span style={{ color: '#D1D5DB', fontSize: 12, fontWeight: 600 }}>{s.action}</span>
          </div>
          <span style={{ color: s.type === 'post' ? '#10B981' : '#9CA3AF', fontSize: 10, fontWeight: 800 }}>
            {s.type === 'post' ? (s.action.includes('Reel') ? '🎬 REEL' : '📸 CARRUSEL') : '📱 STORY'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SlideCard = ({ children, slideNum, totalSlides }: { children: React.ReactNode; slideNum: number; totalSlides: number }) => (
  <div style={{ width: '100%', maxWidth: 340, margin: '0 auto', aspectRatio: '4 / 5', backgroundColor: '#050d0a', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 60%)', borderRadius: 24, border: '1px solid rgba(16,185,129,0.3)', paddingTop: 20, paddingRight: 16, paddingBottom: 16, paddingLeft: 16, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0 }}>
      <BrandHeader />
      {totalSlides > 1 && (
        <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, letterSpacing: '0.05em' }}>{slideNum}/{totalSlides}</span>
      )}
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, width: '100%', boxSizing: 'border-box' }}>
      {children}
    </div>
  </div>
);

const StoryCard = ({ children, slideNum, totalSlides }: { children: React.ReactNode; slideNum: number; totalSlides: number }) => (
  <div style={{ width: '100%', maxWidth: 280, margin: '0 auto', aspectRatio: '9 / 16', backgroundColor: '#050d0a', backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.15) 0%, transparent 60%)', borderRadius: 28, border: '1px solid rgba(16,185,129,0.3)', paddingTop: 16, paddingRight: 16, paddingBottom: 24, paddingLeft: 16, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexShrink: 0 }}>
      {Array.from({ length: totalSlides }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 2, backgroundColor: i < slideNum ? '#FFF' : 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
      <BrandHeader />
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, width: '100%', boxSizing: 'border-box' }}>
      {children}
    </div>
  </div>
);

const SlideCTA = ({ text }: { text: string }) => (
  <div style={{ marginTop: 'auto', width: '100%', boxSizing: 'border-box', flexShrink: 0, paddingTop: 12, paddingBottom: 12, paddingLeft: 8, paddingRight: 8, borderRadius: 12, border: '1.5px solid rgba(16,185,129,0.4)', backgroundColor: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
    <span style={{ color: '#10B981', fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{text}</span>
  </div>
);

const SolidCTA = ({ text }: { text: string }) => (
  <div style={{ width: '100%', boxSizing: 'border-box', flexShrink: 0, backgroundColor: '#10B981', color: '#000000', paddingTop: 12, paddingBottom: 12, paddingLeft: 8, paddingRight: 8, borderRadius: 10, fontSize: 13, fontWeight: 900, letterSpacing: '0.02em', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {text}
  </div>
);

const ScriptScene = ({ time, title, visual, text, voice, isCTA = false }: { time: string, title: string, visual: string, text: string, voice: string, isCTA?: boolean }) => (
  <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 12, padding: 16, marginBottom: 16, width: '100%', boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <span style={{ backgroundColor: isCTA ? '#10B981' : '#F87171', color: '#000', fontWeight: 900, fontSize: 11, padding: '4px 10px', borderRadius: 12 }}>{time}</span>
      <span style={{ color: '#FFF', fontWeight: 900, fontSize: 14 }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Video size={14} color="#10B981" />
          <span style={{ color: '#10B981', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>VISUAL</span>
        </div>
        <p style={{ color: '#D1D5DB', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{visual}</p>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <FileText size={14} color="#FBBF24" />
          <span style={{ color: '#FBBF24', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>TEXTO EN PANTALLA</span>
        </div>
        <p style={{ color: '#D1D5DB', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{text}</p>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Mic size={14} color="#60A5FA" />
          <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>VOZ EN OFF</span>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{voice}</p>
      </div>
    </div>
  </div>
);

const PollSticker = ({ op1, op2 }: { op1: string, op2: string }) => (
  <div style={{ backgroundColor: '#FFF', borderRadius: 12, padding: '4px', display: 'flex', flexDirection: 'column', gap: 4, width: '100%', boxSizing: 'border-box', marginTop: 'auto', marginBottom: 20 }}>
    <div style={{ padding: '12px', textAlign: 'center', color: '#000', fontWeight: 800, fontSize: 13, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8 }}>{op1}</div>
    <div style={{ padding: '12px', textAlign: 'center', color: '#000', fontWeight: 800, fontSize: 13, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8 }}>{op2}</div>
  </div>
);

const LinkSticker = ({ text }: { text: string }) => (
  <div style={{ backgroundColor: '#FFF', borderRadius: 20, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: 'fit-content', margin: 'auto auto 20px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
    <Link2 size={16} color="#3B82F6" />
    <span style={{ color: '#3B82F6', fontWeight: 800, fontSize: 13 }}>{text}</span>
  </div>
);

// ============================================================
// COMPONENTE: VOLANTE CALLE B&N (IMPRIMIBLE)
// ============================================================
const VolanteCalleBN = () => (
  <div style={{ width: '100%', maxWidth: 340, margin: '0 auto', backgroundColor: '#FFFFFF', border: '3px solid #000000', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, color: '#000000', fontFamily: 'system-ui, sans-serif', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', boxSizing: 'border-box' }}>
    
    {/* Header Volante */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <NevuxIsotype size={20} isBlack={true} />
        <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.05em' }}>NEVUX</span>
      </div>
      <span style={{ border: '1.5px solid #000000', padding: '2px 8px', borderRadius: 4, fontWeight: 800, fontSize: 9, textTransform: 'uppercase' }}>
        E-COMMERCE
      </span>
    </div>

    {/* Header Hook */}
    <div style={{ textAlign: 'center', backgroundColor: '#000000', color: '#FFFFFF', padding: '8px 10px', borderRadius: 8 }}>
      <span style={{ fontWeight: 900, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        📦 ¿DESPACHÁS PAQUETES HOY?
      </span>
    </div>

    {/* Título Principal */}
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.15, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
        ¿Tenés una Tiendanube y querés vender más?
      </h2>
      <p style={{ fontSize: 11, fontWeight: 700, margin: 0, lineHeight: 1.35 }}>
        No gastes más en publicidad. Optimizá tu tienda en 2 minutos con la app de widgets #1.
      </p>
    </div>

    {/* Checklist de Funciones (Blanco y Negro legible) */}
    <div style={{ border: '2px solid #000000', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontWeight: 900, fontSize: 11, margin: '0 0 4px 0', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid #000000', paddingBottom: 4 }}>
        ⚡ 50 WIDGETS + 6 FUNCIONES
      </p>
      {[
        '🎮 Raspá y Gana (Captá WhatsApps)',
        '⏱️ Cuenta Regresiva de Ofertas',
        '🚚 Barra de Envío Gratis Dinámica',
        '⭐ Reseñas y Notificaciones en Vivo',
        '💬 Botón WhatsApp Flotante Directo'
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 900, fontSize: 12 }}>✓</span>
          <span style={{ fontWeight: 700, fontSize: 11 }}>{item}</span>
        </div>
      ))}
    </div>

    {/* Caja QR Principal */}
    <div style={{ border: '2.5px solid #000000', borderRadius: 12, padding: 14, textAlign: 'center', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase' }}>
        📲 ESCANEÁ CON TU CELULAR
      </span>

      {/* Placeholder o QR Nítido */}
      <div style={{ backgroundColor: '#FFFFFF', border: '2px solid #000000', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <QrCode size={90} color="#000000" />
      </div>

      <div style={{ backgroundColor: '#000000', color: '#FFFFFF', width: '100%', padding: '6px 0', borderRadius: 6, fontWeight: 900, fontSize: 11 }}>
        PROBÁ 7 DÍAS GRATIS
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: '#374151' }}>
        Sin tarjeta de crédito · Instalación en 1 clic
      </span>
    </div>

    {/* Footer Volante */}
    <div style={{ textAlign: 'center', borderTop: '1px solid #000000', paddingTop: 8 }}>
      <p style={{ fontWeight: 900, fontSize: 12, margin: 0 }}>
        nevux.app
      </p>
      <p style={{ fontSize: 9, fontWeight: 700, margin: '2px 0 0 0' }}>
        50 Widgets + 6 funciones para impulsar tu Tiendanube
      </p>
    </div>

  </div>
);

// ============================================================
// DÍAS ANTERIORES (LUNES A DOMINGO)
// ============================================================
const LunesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="LUNES" schedules={[
      { time: '10:00', action: 'Story 1 (Encuesta Interacción)', type: 'story' },
      { time: '11:30', action: 'Carrusel Urgencia (5 slides)', type: 'post' }
    ]} />
    <SlideCard slideNum={1} totalSlides={5}>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>Lunes: Urgencia</h2>
      <SlideCTA text="VER MÁS" />
    </SlideCard>
  </div>
);

const MartesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="MARTES" schedules={[
      { time: '18:00', action: 'Reel: Raspá y Gana', type: 'post' }
    ]} />
    <SlideCard slideNum={1} totalSlides={1}>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>Martes: Raspá y Gana</h2>
    </SlideCard>
  </div>
);

const MiercolesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="MIÉRCOLES" schedules={[
      { time: '11:30', action: 'Carrusel Recompensas VIP', type: 'post' }
    ]} />
    <SlideCard slideNum={1} totalSlides={5}>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>Miércoles: Recompensas</h2>
    </SlideCard>
  </div>
);

const JuevesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="JUEVES" schedules={[
      { time: '18:30', action: 'Reel: Prueba Social', type: 'post' }
    ]} />
    <SlideCard slideNum={1} totalSlides={1}>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>Jueves: Confianza</h2>
    </SlideCard>
  </div>
);

const ViernesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="VIERNES" schedules={[
      { time: '17:30', action: 'Carrusel Piloto Automático', type: 'post' }
    ]} />
    <SlideCard slideNum={1} totalSlides={5}>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>Viernes: Piloto Automático</h2>
    </SlideCard>
  </div>
);

const SabadoContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="SÁBADO" schedules={[
      { time: '18:00', action: 'Reel: Caso de Éxito', type: 'post' }
    ]} />
    <SlideCard slideNum={1} totalSlides={1}>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>Sábado: Caso de Éxito</h2>
    </SlideCard>
  </div>
);

const DomingoContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="DOMINGO" schedules={[
      { time: '17:00', action: 'Carrusel: Checklist de Domingo', type: 'post' }
    ]} />
    <SlideCard slideNum={1} totalSlides={5}>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>Domingo: Planificación</h2>
    </SlideCard>
  </div>
);

// ============================================================
// COPIES
// ============================================================
const COPIES = {
  LUNES: `🔴 Tu Tiendanube tiene un problema que no se ve en las métricas de Meta...\n\nNevux reemplaza todo eso con 50 Widgets de alta conversión. 7 días gratis.\n👉 Comentá "WIDGET"`,
  MARTES: `¿Sabías que el 97% de las personas que entran a tu Tiendanube se van sin comprar nada?\n\n💡 La solución: Gamificación con el Widget "Raspá y Gana" de Nevux.\n👉 Comentá "LEADS"`,
  MIÉRCOLES: `🎁 ¿Tu app de widgets te recompensa por quedarte? La nuestra sí...\n👉 Comentá "FIDELIDAD"`,
  JUEVES: `Llenó el carrito... eligió el talle... llegó al checkout... y se fue. 🛒💨\n👉 Comentá "CONFIANZA"`,
  VIERNES: `Este fin de semana tu Tiendanube puede vender en piloto automático.\n👉 Comentá "PILOTO"`,
  SÁBADO: `Duplicó ventas sin gastar más en Ads.\n👉 Comentá "TRANSFORMACIÓN"`,
  DOMINGO: `No empieces otra semana improvisando.\n👉 Comentá "SEMANA"`,
  'VOLANTE (B&N)': `📄 VOLANTE FOTOCOPIABLE B&N ($100 ARS)\n\nInstrucciones para imprimir:\n1. Hacé captura de pantalla al recuadro blanco del volante.\n2. Podés imprimir 2 o 4 volantes por hoja A4 en la fotocopiadora de tu barrio.\n3. Pegalos en Correo Argentino, Andreani, OCA o locales de bolsas/cajas de embalaje.`
};

// ============================================================
// PAGE PRINCIPAL
// ============================================================
export default function MarketingAssetsPage() {
  const [openDay, setOpenDay] = useState<string>('VOLANTE (B&N)');
  const [copied, setCopied] = useState(false);

  const copyCaption = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const days = ['VOLANTE (B&N)', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

  return (
    <div style={{ backgroundColor: '#020a07', minHeight: '100vh', padding: '16px 10px 40px 10px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 360, margin: '0 auto 16px auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <NevuxIsotype size={22} />
          <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>NEVUX V2</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', margin: '0 0 2px 0' }}>Marketing & Volantes</h1>
        <p style={{ color: '#10B981', fontSize: 11, margin: 0, fontWeight: 700 }}>Plan Semanal + Volante Callejero</p>
      </div>

      <div style={{ maxWidth: 360, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {days.map(day => {
            const isActive = openDay === day;
            return (
              <button
                key={day}
                onClick={() => setOpenDay(day)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: 16,
                  border: isActive ? 'none' : '1px solid #1F2937',
                  backgroundColor: isActive ? '#10B981' : '#0B1512',
                  color: isActive ? '#000' : '#D1D5DB',
                  fontWeight: 800,
                  fontSize: 10,
                  cursor: 'pointer'
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {openDay === 'VOLANTE (B&N)' && <VolanteCalleBN />}
        {openDay === 'LUNES' && <LunesContent />}
        {openDay === 'MARTES' && <MartesContent />}
        {openDay === 'MIÉRCOLES' && <MiercolesContent />}
        {openDay === 'JUEVES' && <JuevesContent />}
        {openDay === 'VIERNES' && <ViernesContent />}
        {openDay === 'SÁBADO' && <SabadoContent />}
        {openDay === 'DOMINGO' && <DomingoContent />}

        <div style={{ marginTop: 24, backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ color: '#10B981', fontSize: 11, fontWeight: 900, margin: 0 }}>📝 NOTAS / COPY ({openDay})</h4>
            <button
              onClick={() => copyCaption(COPIES[openDay as keyof typeof COPIES])}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                backgroundColor: copied ? '#10B981' : '#1F2937',
                color: copied ? '#000' : '#D1D5DB',
                border: 'none',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 10,
                fontWeight: 800
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <pre style={{ margin: 0, fontSize: 11, color: '#D1D5DB', lineHeight: 1.5, whiteSpace: 'pre-wrap', fontFamily: 'system-ui, sans-serif' }}>
            {COPIES[openDay as keyof typeof COPIES]}
          </pre>
        </div>
      </div>
    </div>
  );
        }
