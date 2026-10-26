'use client';

import React, { useState } from 'react';
import {
  Video, CheckCircle2, Copy, Check, Gift, Award, Crown, Clock,
  Link2, Play, Mic, FileText, Shield, Star, Users, Zap, Moon, Smartphone,
  TrendingUp, BarChart3, ArrowRight
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

const EmojiSlider = ({ emoji }: { emoji: string }) => (
  <div style={{ backgroundColor: '#FFF', borderRadius: 24, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80%', margin: 'auto auto 20px auto' }}>
    <div style={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 4, position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 32 }}>{emoji}</div>
    </div>
  </div>
);

const QuestionBox = ({ question }: { question: string }) => (
  <div style={{ backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', width: '100%', margin: 'auto auto 20px auto' }}>
    <div style={{ padding: '16px', textAlign: 'center', fontWeight: 800, color: '#000', fontSize: 14 }}>{question}</div>
    <div style={{ backgroundColor: '#F3F4F6', padding: '12px 16px', color: '#9CA3AF', fontSize: 13 }}>Escribe tu respuesta...</div>
  </div>
);

// ============================================================
// DÍAS ANTERIORES (resumen visual)
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

// ============================================================
// DÍA 6: SÁBADO (Reel Transformación + Stories)
// ============================================================
const SabadoContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
    <ScheduleBanner day="SÁBADO" schedules={[
      { time: '11:00', action: 'Story 1 (Mito presupuesto Ads)', type: 'story' },
      { time: '14:00', action: 'Story 2 (Antes vs Después)', type: 'story' },
      { time: '18:00', action: 'Reel: Duplicó ventas con 0$ extra en Ads', type: 'post' },
      { time: '19:30', action: 'Story 3 (Repost Reel) + Story 4 (Q&A)', type: 'story' }
    ]} />

    {/* GUIÓN DEL REEL */}
    <div style={{ width: '100%', borderTop: '2px dashed #1F2937', paddingTop: 24 }}>
      <h3 style={{ color: '#10B981', fontWeight: 900, fontSize: 16, marginBottom: 24, textAlign: 'center' }}>1️⃣ GUIÓN DEL REEL</h3>

      <ScriptScene
        time="0-4s"
        title="HOOK — Mito del Presupuesto"
        visual="Alguien mirando el panel de Meta Ads con frustración, aumentando el presupuesto diario de publicidad. Pantalla dividida con el gráfico de ventas que se mantiene plano."
        text="Aumentó la pauta un 50%... y vendió lo mismo 💸"
        voice="Pensaba que para duplicar las ventas de su Tiendanube la única opción era poner el doble de plata en anuncios."
      />
      <ScriptScene
        time="4-9s"
        title="PROBLEMA — La fuga en la tienda"
        visual="Un balde lleno de agua con agujeros por los que se escapa el agua (metáfora visual). Luego captura de pantalla de la tienda recibiendo 1.000 visitas pero con tasa de conversión de 0.8%."
        text="Traer más visitas a una tienda que no convierte = Quemar dinero 🔥"
        voice="El problema no era Meta Ads. Era que su tienda no retenía ni convertía a las visitas que ya estaban entrando."
      />
      <ScriptScene
        time="9-17s"
        title="SOLUCIÓN — La transformación Nevux"
        visual="En lugar de subir presupuesto en Ads, abre Tiendanube, instala Nevux en 1 clic y activa 4 widgets: Barra de envío gratis + Contador de stock + Reseñas + Raspá y Gana."
        text="🚀 Instaló Nevux · Optimizó la conversión interna en 2 minutos"
        voice="En lugar de regalarle más plata a Meta, instaló Nevux y optimizó el camino de compra adentro de su tienda en menos de dos minutos."
        isCTA={true}
      />
      <ScriptScene
        time="17-23s"
        title="BENEFICIO — Doble de ventas con el mismo tráfico"
        visual="Gráfico comparativo real de ventas: Tasa de conversión pasando de 0.8% a 2.4%. Notificaciones de pedidos confirmados sonando seguidas."
        text="Mismo tráfico + Mejor conversión = Duplicó facturación 📈"
        voice="Con el mismo tráfico exacto, su tasa de conversión se triplicó. Duplicó su facturación sin poner un solo peso extra en publicidad."
      />
      <ScriptScene
        time="23-28s"
        title="CTA FINAL"
        visual="Fondo oscuro con logo Nevux arriba a la izquierda, placa esmeralda con slogan y CTA claro."
        text="50 Widgets + 6 funciones · Comentá TRANSFORMACIÓN 👇"
        voice="Accedé a 50 Widgets y 6 funciones para impulsar tu Tiendanube. Comentá TRANSFORMACIÓN y te muestro cómo aplicarlo en tu marca hoy."
        isCTA={true}
      />
    </div>

    {/* PORTADA REEL 4:5 */}
    <div style={{ width: '100%', borderTop: '2px dashed #1F2937', paddingTop: 24, textAlign: 'center' }}>
      <h3 style={{ color: '#10B981', fontWeight: 900, fontSize: 16, marginBottom: 24 }}>2️⃣ PORTADA DEL REEL (4:5)</h3>
      <SlideCard slideNum={1} totalSlides={1}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, alignSelf: 'center', backgroundColor: '#10B981', padding: '4px 10px', borderRadius: 12 }}>
          <Play size={12} color="#000" />
          <span style={{ color: '#000', fontWeight: 900, fontSize: 10 }}>REEL COVER</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <TrendingUp size={44} color="#10B981" style={{ marginBottom: 16 }} />
          <h2 style={{ color: '#FFFFFF', fontSize: 25, fontWeight: 900, lineHeight: 1.15, margin: '0 0 12px 0' }}>
            DUPLICÓ VENTAS<br/><span style={{ color: '#10B981' }}>SIN GASTAR MÁS</span><br/>EN ADS.
          </h2>
          <p style={{ color: '#D1D5DB', fontSize: 14, fontWeight: 700, margin: 0 }}>
            El cambio estratégico de 2 minutos 🚀
          </p>
        </div>
        <div style={{ textAlign: 'center', borderTop: '1px solid #1F2937', paddingTop: 16 }}>
          <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Caso de Éxito · Nevux</span>
        </div>
      </SlideCard>
    </div>

    {/* STORIES SÁBADO */}
    <div style={{ width: '100%', borderTop: '2px dashed #1F2937', paddingTop: 24, textAlign: 'center' }}>
      <h3 style={{ color: '#10B981', fontWeight: 900, fontSize: 16, marginBottom: 24 }}>3️⃣ HISTORIAS (VERTICAL 9:16)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <StoryCard slideNum={1} totalSlides={4}>
          <h2 style={{ color: '#FFF', fontSize: 24, fontWeight 900, textAlign: 'center', marginTop: 36, lineHeight: 1.2 }}>
            ¿Aumentaste tu presupuesto de publicidad este mes?
          </h2>
          <PollSticker op1="Sí, tuve que subirlo 💸" op2="No, mantengo lo mismo ⚖️" />
        </StoryCard>

        <StoryCard slideNum={2} totalSlides={4}>
          <h2 style={{ color: '#FFF', fontSize: 22, fontWeight: 900, textAlign: 'center', marginTop: 36, lineHeight: 1.25 }}>
            Tu cara cuando el costo por clic sube pero las ventas siguen iguales 📈➡️📉
          </h2>
          <EmojiSlider emoji="🤦‍♂️" />
        </StoryCard>

        <StoryCard slideNum={3} totalSlides={4}>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <BarChart3 size={40} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ color: '#FFF', fontSize: 20, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.3 }}>
              Mira cómo esta marca pasó de 0.8% a 2.4% de conversión en 24hs 👇
            </h2>
          </div>
          <LinkSticker text="VER CASO EN EL REEL" />
        </StoryCard>

        <StoryCard slideNum={4} totalSlides={4}>
          <h2 style={{ color: '#FFF', fontSize: 22, fontWeight: 900, textAlign: 'center', marginTop: 30, marginBottom: 16, lineHeight: 1.25 }}>
            ¿Querés auditoría rápida de conversión para tu tienda?
          </h2>
          <QuestionBox question="Dejame tu link de Tiendanube 👇" />
        </StoryCard>

      </div>
    </div>
  </div>
);

// ============================================================
// COPIES
// ============================================================
const COPIES = {
  LUNES: `🔴 Tu Tiendanube tiene un problema que no se ve en las métricas de Meta...\n\nNevux reemplaza todo eso con 50 Widgets de alta conversión. 7 días gratis.\n👉 Comentá "WIDGET"`,
  MARTES: `¿Sabías que el 97% de las personas que entran a tu Tiendanube se van sin comprar nada y sin dejarte sus datos? 🚪💸\n\nInvertís en Meta Ads, Google y contenido para atraer tráfico a tu tienda online. Las visitas llegan, miran dos productos... y cierran la pestaña. Sin un mecanismo de captación inmediata, esa plata que invertiste en traerlos se pierde para siempre.\n\n💡 La solución: Gamificación con el Widget "Raspá y Gana" de Nevux.\n\nEn lugar de mostrar un pop-up aburrido que la gente cierra por inercia, Nevux transforms la captación de contactos en una experiencia interactiva irresistible:\n\n1️⃣ El cliente entra a tu Tiendanube y ve una tarjeta de "Raspá y Gana".\n2️⃣ Raspa en la pantalla con el dedo para descubrir su premio (ej: 15% OFF o Envío Gratis).\n3️⃣ Para reclamar el cupón, ingresa su WhatsApp o Email.\n\n🚀 El resultado: Pasás de tener visitas anónimas a construir una base de datos hiper-calificada en piloto automático, lista para remarketing por WhatsApp o Email Marketing.\n\n⚡ Nevux: 50 Widgets + 6 funciones para impulsar tu Tiendanube.\n💬 Comentá "LEADS" abajo y te enviamos por privado el paso a paso para activarlo en menos de 2 minutos.`,
  MIÉRCOLES: `¿Tu app actual de widgets te cobra todos los meses pero tu tienda sigue viéndose igual a la de tu competencia? 📉\n\nLa mayoría de las apps en Tiendanube son puramente transaccionales: pagás tu suscripción mes a mes y listo. No hay incentivos, no hay evolución. Mientras tanto, tu tienda se ve idéntica a las de otras 10,000 marcas que usan exactamente la misma app genérica.\n\n💡 En Nevux cambiamos las reglas del juego con nuestro Programa de Recompensas.\n\nSomos la PRIMERA app de Tiendanube que te premia por tu fidelidad. ¿Cómo funciona?\n🔓 Mes 1: Accedés al instante a los 50 Widgets Base de alta conversión.\n🎁 Mes a mes: Vas desbloqueando Widgets Premium Exclusivos que NO están a la venta en ningún lado.\n\n🚀 El resultado: Cuanto más tiempo usás Nevux, más única y personalizada se vuelve tu tienda. Tu competencia nunca podrá copiar tus estrategias de conversión porque simplemente no tendrán acceso a tus widgets VIP.\n\n⚡ Nevux: 50 Widgets + 6 funciones para impulsar tu Tiendanube.\n💬 Comentá "FIDELIDAD" abajo y te enviamos por privado cómo reclamar tu primera recompensa hoy mismo.`,
  JUEVES: `Llenó el carrito... eligió el talle... llegó al checkout... y se fue. 🛒💨\n\n¿Te suena familiar? No siempre es el precio. En la mayoría de los casos es una sola cosa: tu tienda no genera suficiente confianza en el momento exacto de decidir.\n\nSin reseñas visibles, sin actividad en vivo, sin sellos de compra segura y sin señales de stock real, el cerebro del comprador frena. Y cuando frena en el checkout, perdés la venta que ya tenías casi cerrada.\n\n💡 La solución: Widgets de Prueba Social de Nevux.\n\nActivás en minutos:\n⭐ Reseñas y valoraciones en puntos clave del funnel\n👀 Contadores de "personas viendo esto ahora"\n🛡️ Sellos de seguridad y garantía\n📦 Stock real y barras de envío gratis\n\n🚀 El resultado: el cliente deja de dudar y termina la compra. Menos abandono de carrito. Más pedidos confirmados. Más tranquilidad para tu marca.\n\n⚡ Nevux: 50 Widgets + 6 funciones para impulsar tu Tiendanube.\n💬 Comentá "CONFIANZA" abajo y te mostramos cómo activar la prueba social en tu tienda en menos de 2 minutos.`,
  VIERNES: `Este fin de semana tu Tiendanube puede hacer dos cosas:\n\n1️⃣ Vender en piloto automático mientras vos descansás.\n2️⃣ Quedarse en silencio total hasta el lunes.\n\nLa diferencia no es magia. Son 5 widgets estratégicos trabajando 24/7.\n\n🌙 El kit Piloto Automático de Nevux:\n\n⏱️ Countdown de oferta — deadline real que cierra indecisos\n🔥 Stock restante — escasez limpia y creíble\n🚚 Barra de envío gratis — sube el ticket promedio sin esfuerzo\n💬 WhatsApp flotante — te escriben aunque no estés online\n🎮 Raspá y Gana — captura leads todo el sábado y domingo\n\nSin estas piezas, el finde se te escapa: cero urgencia, carritos abandonados sin recuperación y un domingo mirando métricas en rojo.\n\nCon Nevux las activás en minutos y tu tienda sigue vendiendo mientras vos estás en otra.\n\n⚡ Nevux: 50 Widgets + 6 funciones para impulsar tu Tiendanube.\n💬 Comentá "PILOTO" abajo y te pasamos el checklist exacto para dejar el finde en automático (7 días gratis).`,
  SÁBADO: `Aumentar el presupuesto en anuncios no siempre es la solución para vender más. 💸📉\n\nMuchos dueños de Tiendanube caen en la trampa: ven que las ventas se estancan y lo primero que hacen es poner más dinero en Meta Ads o Google. Traen 2.000 visitas en lugar de 1.000... pero si la tienda no convierte, lo único que logran es quemar el presupuesto el doble de rápido.\n\n💡 La verdadera palanca de crecimiento está DENTRO de tu tienda: la Tasa de Conversión.\n\nMirá lo que pasa cuando pasás de un 0.8% a un 2.4% de conversión:\n\n❌ ANTES (Sin Nevux):\n• 1.000 visitas = 8 ventas.\n• Para hacer 24 ventas tenías que pagar 3.000 visitas en Ads.\n\n✅ DESPUÉS (Con Nevux activado):\n• 1.000 visitas = 24 ventas.\n• Mismo gasto en anuncios, el TRIPLE de facturación.\n\n🚀 ¿Cómo se logra? Activando widgets clave que resuelven la fricción en el momento exacto: Barra de envío gratis, contador de stock, prueba social en vivo y captación gamificada.\n\n⚡ Nevux: 50 Widgets + 6 funciones para impulsar tu Tiendanube.\n💬 Comentá "TRANSFORMACIÓN" abajo y te enviamos un video privado mostrando cómo optimizar tu tasa de conversión en menos de 10 minutos (7 días gratis).`
};

// ============================================================
// PAGE PRINCIPAL
// ============================================================
export default function MarketingAssetsPage() {
  const [openDay, setOpenDay] = useState<string>('SÁBADO');
  const [copied, setCopied] = useState(false);

  const copyCaption = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const days = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

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

        {openDay === 'LUNES' && <LunesContent />}
        {openDay === 'MARTES' && <MartesContent />}
        {openDay === 'MIÉRCOLES' && <MiercolesContent />}
        {openDay === 'JUEVES' && <JuevesContent />}
        {openDay === 'VIERNES' && <ViernesContent />}
        {openDay === 'SÁBADO' && <SabadoContent />}

        <div style={{ marginTop: 24, backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ color: '#10B981', fontSize: 11, fontWeight: 900, margin: 0 }}>📝 COPY POST ({openDay})</h4>
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
