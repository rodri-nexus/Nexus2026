'use client';

import React, { useState } from 'react';
import {
  Video, Instagram, Layout, Film, Camera, CheckCircle2,
  Copy, Check, Gift, Award, Crown, Clock, BarChart2, MessageCircle, Link2, Play, Smile,
  Mic, FileText
} from 'lucide-react';

// ============================================================
// LOGO OFICIAL NEVUX
// ============================================================
const NevuxIsotype = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nPillarRight" x1="70" y1="15" x2="70" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="nDiag" x1="20" y1="20" x2="85" y2="95" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="55%" stopColor="#F3F4F6" />
        <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <rect x="22" y="18" width="15" height="64" rx="2" fill="#FFFFFF" />
    <rect x="68" y="18" width="15" height="42" rx="2" fill="url(#nPillarRight)" />
    <path d="M29 22 L78 88" stroke="url(#nDiag)" strokeWidth="15" strokeLinecap="round" />
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
// COMPONENTES UI: Horarios, Cards y CTA
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
      <span style={{ backgroundColor: isCTA ? '#10B981' : '#F87171', color: isCTA ? '#000' : '#000', fontWeight: 900, fontSize: 11, padding: '4px 10px', borderRadius: 12 }}>{time}</span>
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

// Mocks de Stickers para Stories
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

const EmojiSlider = ({ emoji }: { emoji: string }) => (
  <div style={{ backgroundColor: '#FFF', borderRadius: 24, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80%', margin: 'auto auto 20px auto' }}>
    <div style={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 4, position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 32 }}>{emoji}</div>
    </div>
  </div>
);

// ============================================================
// DÍA 1: LUNES (Carrusel + Stories)
// ============================================================
const LunesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="LUNES" schedules={[
      { time: '10:00', action: 'Story 1 (Encuesta Interacción)', type: 'story' },
      { time: '11:30', action: 'Carrusel Urgencia (5 slides)', type: 'post' },
      { time: '15:00', action: 'Story 2 (Agitación)', type: 'story' },
      { time: '18:30', action: 'Story 3 (Demo) + Story 4 (CTA)', type: 'story' }
    ]} />

    <div style={{ width: '100%', borderTop: '2px dashed #1F2937', paddingTop: 24, textAlign: 'center' }}>
      <h3 style={{ color: '#10B981', fontWeight: 900, fontSize: 16, marginBottom: 24 }}>1️⃣ POST PRINCIPAL (CARRUSEL)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SlideCard slideNum={1} totalSlides={5}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}><span style={{ fontSize: 14 }}>🚨</span><span style={{ color: '#EF4444', fontWeight: 900, fontSize: 11 }}>ALERTA PARA DUEÑOS DE TIENDA</span></div>
          <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900, lineHeight: 1.15, margin: '0 0 12px 0' }}>Tu tienda pierde<br/>ventas <span style={{ color: '#10B981' }}>MIENTRAS<br/>dormís.</span></h2>
          <p style={{ color: '#D1D5DB', fontSize: 13, margin: '0 0 16px 0' }}>Y no es culpa de tus Ads. Te muestro el error exacto 👉</p>
          <SlideCTA text="DESLIZÁ →" />
        </SlideCard>
      </div>
    </div>
  </div>
);

// ============================================================
// DÍA 2: MARTES (Reel + Stories)
// ============================================================
const MartesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="MARTES" schedules={[
      { time: '10:00', action: 'Story 1 (Problema de captación)', type: 'story' },
      { time: '12:00', action: 'Story 2 (Gamificación)', type: 'story' },
      { time: '18:00', action: 'Reel: Raspá y Gana', type: 'post' },
      { time: '19:00', action: 'Story 3 (Compartir Reel) + CTA', type: 'story' }
    ]} />

    <div style={{ width: '100%', borderTop: '2px dashed #1F2937', paddingTop: 24, textAlign: 'center' }}>
      <h3 style={{ color: '#10B981', fontWeight: 900, fontSize: 16, marginBottom: 24 }}>PORTADA DEL REEL (4:5)</h3>
      <SlideCard slideNum={1} totalSlides={1}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, alignSelf: 'center', backgroundColor: '#10B981', padding: '4px 10px', borderRadius: 12 }}>
          <Play size={12} color="#000" />
          <span style={{ color: '#000', fontWeight: 900, fontSize: 10 }}>REEL COVER</span>
        </div>
        <h2 style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 900, textAlign: 'center', lineHeight: 1.15, marginTop: 20 }}>
          EL <span style={{ color: '#10B981' }}>97%</span> DE TUS VISITAS SE VAN...
        </h2>
        <p style={{ color: '#D1D5DB', fontSize: 16, textAlign: 'center', fontWeight: 700, margin: '16px 0 0 0' }}>Y no te dejan ni el WhatsApp. 📉</p>
        <div style={{ marginTop: 'auto', textAlign: 'center', borderTop: '1px solid #1F2937', paddingTop: 16 }}>
          <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Widget Raspá y Gana</span>
        </div>
      </SlideCard>
    </div>
  </div>
);

// ============================================================
// DÍA 3: MIÉRCOLES (Carrusel + Stories)
// ============================================================
const MiercolesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="MIÉRCOLES" schedules={[
      { time: '10:00', action: 'Story 1 (Fricción apps genéricas)', type: 'story' },
      { time: '11:30', action: 'Carrusel Recompensas VIP (5 slides)', type: 'post' },
      { time: '16:00', action: 'Story 2 y 3 (Lock/Unlock Widgets)', type: 'story' },
      { time: '19:30', action: 'Story 4 (FOMO competencia)', type: 'story' }
    ]} />

    {/* CARRUSEL MIÉRCOLES */}
    <div style={{ width: '100%', borderTop: '2px dashed #1F2937', paddingTop: 24, textAlign: 'center' }}>
      <h3 style={{ color: '#10B981', fontWeight: 900, fontSize: 16, marginBottom: 24 }}>1️⃣ POST PRINCIPAL (CARRUSEL)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <SlideCard slideNum={1} totalSlides={5}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}><span style={{ fontSize: 14 }}>🛑</span><span style={{ color: '#EF4444', fontWeight: 900, fontSize: 11 }}>BASTA DE PAGAR POR NADA</span></div>
          <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900, lineHeight: 1.15, margin: '0 0 12px 0' }}>Por qué deberías<br/><span style={{ color: '#EF4444' }}>ELIMINAR</span> tu app de widgets hoy mismo.</h2>
          <p style={{ color: '#D1D5DB', fontSize: 13, margin: '0 0 16px 0' }}>Hay una verdad incómoda en Tiendanube... 👉</p>
          <SlideCTA text="DESLIZÁ →" />
        </SlideCard>

        <SlideCard slideNum={2} totalSlides={5}>
          <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 900, lineHeight: 1.2, margin: '0 0 20px 0' }}>Tu tienda se ve <span style={{ color: '#EF4444' }}>idéntica</span> a tu competencia.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🛒</span>
              <div>
                <p style={{ color: '#FFF', fontSize: 12, fontWeight: 800, margin: '0 0 2px 0' }}>Tienda Genérica A</p>
                <p style={{ color: '#9CA3AF', fontSize: 10, margin: 0 }}>Mismos pop-ups aburridos</p>
              </div>
            </div>
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🛒</span>
              <div>
                <p style={{ color: '#FFF', fontSize: 12, fontWeight: 800, margin: '0 0 2px 0' }}>Tu Tienda (Actual)</p>
                <p style={{ color: '#9CA3AF', fontSize: 10, margin: 0 }}>Pagas todos los meses por lo mismo</p>
              </div>
            </div>
          </div>
          <SlideCTA text="¿CÓMO LO CAMBIAMOS? →" />
        </SlideCard>

        <SlideCard slideNum={3} totalSlides={5}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Gift size={40} color="#10B981" style={{ marginBottom: 16 }} />
            <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px 0' }}>La única app que te premia por quedarte.</h2>
            <p style={{ color: '#D1D5DB', fontSize: 13, margin: 0 }}>Presentamos el <strong style={{ color: '#10B981' }}>Programa de Recompensas</strong> Nevux. Cuanto más tiempo la usás, más única es tu tienda.</p>
          </div>
          <SlideCTA text="MIRÁ LO QUE DESBLOQUEÁS →" />
        </SlideCard>

        <SlideCard slideNum={4} totalSlides={5}>
          <h2 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 900, lineHeight: 1.2, margin: '0 0 20px 0' }}>Tu progreso VIP:</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10B981', borderRadius: 8, padding: 12 }}>
              <p style={{ color: '#10B981', fontSize: 11, fontWeight: 900, margin: '0 0 4px 0' }}>MES 1 🔓</p>
              <p style={{ color: '#FFF', fontSize: 12, margin: 0 }}>Acceso a 50 Widgets Base</p>
            </div>
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 8, padding: 12 }}>
              <p style={{ color: '#FBBF24', fontSize: 11, fontWeight: 900, margin: '0 0 4px 0' }}>MES 3 👑</p>
              <p style={{ color: '#FFF', fontSize: 12, margin: 0 }}>Widget Premium Exclusivo (No a la venta)</p>
            </div>
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 8, padding: 12 }}>
              <p style={{ color: '#60A5FA', fontSize: 11, fontWeight: 900, margin: '0 0 4px 0' }}>MES 6 💎</p>
              <p style={{ color: '#FFF', fontSize: 12, margin: 0 }}>Nueva función VIP secreta</p>
            </div>
          </div>
          <SlideCTA text="ÚLTIMO PASO →" />
        </SlideCard>

        <SlideCard slideNum={5} totalSlides={5}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Award size={48} color="#10B981" style={{ marginBottom: 16 }} />
            <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900, lineHeight: 1.1, margin: '0 0 12px 0' }}>Desmarcáte de tu competencia HOY.</h2>
            <p style={{ color: '#D1D5DB', fontSize: 13, margin: '0 0 24px 0' }}>Instalá Nevux y empezá tu camino VIP con 7 días gratis.</p>
            <SolidCTA text="OBTENER 50 WIDGETS AHORA" />
          </div>
        </SlideCard>

      </div>
    </div>

    {/* STORIES MIÉRCOLES */}
    <div style={{ width: '100%', borderTop: '2px dashed #1F2937', paddingTop: 24, textAlign: 'center' }}>
      <h3 style={{ color: '#10B981', fontWeight: 900, fontSize: 16, marginBottom: 24 }}>2️⃣ HISTORIAS (VERTICAL 9:16)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <StoryCard slideNum={1} totalSlides={4}>
          <h2 style={{ color: '#FFF', fontSize: 24, fontWeight: 900, textAlign: 'center', marginTop: 40, lineHeight: 1.2 }}>¿Hace cuánto tiempo usás la misma app de widgets genéricos?</h2>
          <PollSticker op1="Hace meses ⏱️" op2="La instalé recién" />
        </StoryCard>

        <StoryCard slideNum={2} totalSlides={4}>
          <h2 style={{ color: '#FFF', fontSize: 24, fontWeight: 900, textAlign: 'center', marginTop: 40, lineHeight: 1.2 }}>¿Y qué te dieron a cambio por tu lealtad además de cobrarte?</h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', margin: '12px 0 0 0' }}>Nosotros sabemos la respuesta...</p>
          <EmojiSlider emoji="💸" />
        </StoryCard>

        <StoryCard slideNum={3} totalSlides={4}>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Crown size={48} color="#FBBF24" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ color: '#FFF', fontSize: 22, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.2 }}>En Nevux, tu lealtad se recompensa con exclusividad.</h2>
            <p style={{ color: '#D1D5DB', fontSize: 14, lineHeight: 1.4 }}>Mes a mes desbloqueás widgets VIP que tu competencia NO puede comprar.</p>
          </div>
        </StoryCard>

        <StoryCard slideNum={4} totalSlides={4}>
          <h2 style={{ color: '#FFF', fontSize: 22, fontWeight: 900, textAlign: 'center', marginTop: 40, lineHeight: 1.3 }}>Tu competencia ya está desbloqueando widgets únicos que vos no tenés.</h2>
          <LinkSticker text="VER RECOMPENSAS NEVUX" />
        </StoryCard>

      </div>
    </div>
  </div>
);

// COPIES COMPLETOS
const COPIES = {
  LUNES: `🔴 Tu Tiendanube tiene un problema que no se ve en las métricas de Meta...\n\nNevux reemplaza todo eso con 50 Widgets de alta conversión. 7 días gratis.\n👉 Comentá "WIDGET"`,
  MARTES: `¿Sabías que el 97% de las personas que entran a tu Tiendanube se van sin comprar nada y sin dejarte sus datos? 🚪💸\n\nInvertís en Meta Ads, Google y contenido para atraer tráfico a tu tienda online. Las visitas llegan, miran dos productos... y cierran la pestaña. Sin un mecanismo de captación inmediata, esa plata que invertiste en traerlos se pierde para siempre.\n\n💡 La solución: Gamificación con el Widget "Raspá y Gana" de Nevux.\n\nEn lugar de mostrar un pop-up aburrido que la gente cierra por inercia, Nevux transforma la captación de contactos en una experiencia interactiva irresistible:\n\n1️⃣ El cliente entra a tu Tiendanube y ve una tarjeta de "Raspá y Gana".\n2️⃣ Raspa en la pantalla con el dedo para descubrir su premio (ej: 15% OFF o Envío Gratis).\n3️⃣ Para reclamar el cupón, ingresa su WhatsApp o Email.\n\n🚀 El resultado: Pasás de tener visitas anónimas a construir una base de datos hiper-calificada en piloto automático, lista para remarketing por WhatsApp o Email Marketing.\n\n⚡ Nevux: 50 Widgets + 6 funciones para impulsar tu Tiendanube.\n💬 Comentá "LEADS" abajo y te enviamos por privado el paso a paso para activarlo en menos de 2 minutos.`,
  MIÉRCOLES: `¿Tu app actual de widgets te cobra todos los meses pero tu tienda sigue viéndose igual a la de tu competencia? 📉\n\nLa mayoría de las apps en Tiendanube son puramente transaccionales: pagás tu suscripción mes a mes y listo. No hay incentivos, no hay evolución. Mientras tanto, tu tienda se ve idéntica a las de otras 10,000 marcas que usan exactamente la misma app genérica.\n\n💡 En Nevux cambiamos las reglas del juego con nuestro Programa de Recompensas.\n\nSomos la PRIMERA app de Tiendanube que te premia por tu fidelidad. ¿Cómo funciona?\n🔓 Mes 1: Accedés al instante a los 50 Widgets Base de alta conversión.\n🎁 Mes a mes: Vas desbloqueando Widgets Premium Exclusivos que NO están a la venta en ningún lado.\n\n🚀 El resultado: Cuanto más tiempo usás Nevux, más única y personalizada se vuelve tu tienda. Tu competencia nunca podrá copiar tus estrategias de conversión porque simplemente no tendrán acceso a tus widgets VIP.\n\n⚡ Nevux: 50 Widgets + 6 funciones para impulsar tu Tiendanube.\n💬 Comentá "FIDELIDAD" abajo y te enviamos por privado cómo reclamar tu primera recompensa hoy mismo.`
};

// ============================================================
// PAGE PRINCIPAL
// ============================================================
export default function MarketingAssetsPage() {
  const [activeTab, setActiveTab] = useState<'instagram'>('instagram');
  const [openDay, setOpenDay] = useState<string>('MIÉRCOLES'); // Empieza en Miércoles por defecto
  const [copied, setCopied] = useState(false);

  const copyCaption = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div style={{ backgroundColor: '#020a07', minHeight: '100vh', padding: '16px 10px 40px 10px', boxSizing: 'border-box' }}>
      
      <div style={{ maxWidth: 360, margin: '0 auto 16px auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <NevuxIsotype size={22} />
          <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>NEVUX V2</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', margin: '0 0 2px 0' }}>Plan Semanal Full</h1>
        <p style={{ color: '#10B981', fontSize: 11, margin: 0, fontWeight: 700 }}>Horarios + Post + Stories</p>
      </div>

      <div style={{ maxWidth: 360, margin: '0 auto' }}>
        {/* Selector de días */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {['LUNES', 'MARTES', 'MIÉRCOLES'].map(day => {
            const isActive = openDay === day;
            return (
              <button
                key={day} onClick={() => setOpenDay(day)}
                style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 16, border: isActive ? 'none' : '1px solid #1F2937', backgroundColor: isActive ? '#10B981' : '#0B1512', color: isActive ? '#000' : '#D1D5DB', fontWeight: 800, fontSize: 10, cursor: 'pointer' }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DEL DÍA */}
        {openDay === 'LUNES' && <LunesContent />}
        {openDay === 'MARTES' && <MartesContent />}
        {openDay === 'MIÉRCOLES' && <MiercolesContent />}

        {/* CAJA DE COPY GLOBAL DEL DÍA */}
        <div style={{ marginTop: 24, backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ color: '#10B981', fontSize: 11, fontWeight: 900, margin: 0 }}>📝 COPY POST ({openDay})</h4>
            <button onClick={() => copyCaption(COPIES[openDay as keyof typeof COPIES])} style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: copied ? '#10B981' : '#1F2937', color: copied ? '#000' : '#D1D5DB', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 10, fontWeight: 800 }}>
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
