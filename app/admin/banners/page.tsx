'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Flame,
  Zap,
  Rocket,
  ShoppingBag,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

// Componente del Logo Oficial de Nevux (Círculo + N metálica + Nombre NEVUX)
function NevuxOfficialLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Círculo Negro con N Metálica */}
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          borderRadius: '50%', 
          backgroundColor: '#000000', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.9)',
          flexShrink: 0
        }}
      >
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
          {/* Tallo Izquierdo */}
          <path d="M3 3H7.5V21H3V3Z" fill="#FFFFFF" />
          {/* Tallo Derecho */}
          <path d="M16.5 3H21V21H16.5V3Z" fill="#FFFFFF" />
          {/* Barra Diagonal con Gradiente Metálico */}
          <path d="M7.5 3L21 21H16.5L3 3H7.5Z" fill="url(#nevux_diag_grad)" />
          <defs>
            <linearGradient id="nevux_diag_grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E4E4E7" />
              <stop offset="75%" stopColor="#52525B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Nombre de Marca NEVUX */}
      <span 
        style={{ 
          fontSize: `${size * 0.55}px`, 
          fontWeight: 900, 
          color: '#FFFFFF', 
          letterSpacing: '0.08em', 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1
        }}
      >
        NEVUX
      </span>
    </div>
  );
}

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState('viernes-portada');

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#020a07', 
        color: '#f8fafc', 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingBottom: '96px' 
      }}
    >
      {/* Header del Panel Admin */}
      <header 
        style={{ 
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)', 
          backgroundColor: '#04140e', 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          padding: '12px 16px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/admin"
              style={{ padding: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: 'rgba(6, 30, 20, 0.5)', textDecoration: 'none' }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </Link>
            <NevuxOfficialLogo size={28} />
          </div>
          <span style={{ fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
            Tiendanube App #37382
          </span>
        </div>
      </header>

      {/* Selector de Pestañas Nav */}
      <div style={{ maxWidth: '1280px', margin: '20px auto 0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          
          <button
            onClick={() => setActiveTab('lunes')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'lunes' ? '#10B981' : '#061e14',
              color: activeTab === 'lunes' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'lunes' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            📊 Lunes
          </button>

          <button
            onClick={() => setActiveTab('martes')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'martes' ? '#10B981' : '#061e14',
              color: activeTab === 'martes' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'martes' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            🧠 Martes
          </button>

          <button
            onClick={() => setActiveTab('miercoles')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'miercoles' ? '#10B981' : '#061e14',
              color: activeTab === 'miercoles' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'miercoles' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            🎠 Miércoles
          </button>

          <button
            onClick={() => setActiveTab('jueves')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'jueves' ? '#10B981' : '#061e14',
              color: activeTab === 'jueves' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'jueves' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            ⏱️ Stories Jueves
          </button>

          <button
            onClick={() => setActiveTab('jueves-portada')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'jueves-portada' ? '#10B981' : '#061e14',
              color: activeTab === 'jueves-portada' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'jueves-portada' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            🎬 Portada Reel Jueves
          </button>

          <button
            onClick={() => setActiveTab('viernes')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'viernes' ? '#10B981' : '#061e14',
              color: activeTab === 'viernes' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'viernes' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            🚀 Stories Viernes
          </button>

          <button
            onClick={() => setActiveTab('viernes-portada')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'viernes-portada' ? '#10B981' : '#061e14',
              color: activeTab === 'viernes-portada' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'viernes-portada' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            🎬 Portada Reel Viernes
          </button>

        </div>
      </div>

      <main style={{ maxWidth: '1280px', margin: '20px auto 0 auto', padding: '0 16px' }}>

        {/* TAB: PORTADA REEL VIERNES */}
        {activeTab === 'viernes-portada' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: 'rgba(6, 30, 20, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Rocket style={{ width: '20px', height: '20px', color: '#34d399' }} />
                Portada Oficial Reel Viernes (Ventas Fin de Semana)
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
                Diseño de cierre de semana con el logo oficial de Nevux. Centrado en la zona segura 1:1 de Instagram.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div 
                style={{ 
                  width: '100%', 
                  maxWidth: '380px', 
                  aspectRatio: '9/16', 
                  backgroundColor: '#020a07', 
                  border: '2px solid rgba(16, 185, 129, 0.4)', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  padding: '24px',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}
              >
                {/* Header con LOGO OFICIAL NEVUX */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
                  <NevuxOfficialLogo size={36} />
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    APP #37382
                  </span>
                </div>

                {/* ZONA SEGURA 1:1 */}
                <div 
                  style={{ 
                    zIndex: 10, 
                    margin: 'auto 0', 
                    padding: '20px', 
                    backgroundColor: 'rgba(6, 30, 20, 0.7)', 
                    border: '1px solid rgba(16, 185, 129, 0.3)', 
                    borderRadius: '20px',
                    boxSizing: 'border-box',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '8px', color: '#34d399', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
                      <Rocket style={{ width: '13px', height: '13px' }} />
                      EDICIÓN FIN DE SEMANA
                    </div>
                  </div>

                  <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#ffffff', lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>
                    PREPARÁ TU
                  </h3>
                  <h4 style={{ fontSize: '30px', fontWeight: 900, color: '#10B981', lineHeight: 1, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
                    TIENDANUBE
                  </h4>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', margin: '0 0 16px 0' }}>
                    Para vender en automático este sábado y domingo
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 12px', borderRadius: '10px' }}>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9' }}>Activá Urgencia y Temporizador</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 12px', borderRadius: '10px' }}>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9' }}>Notificaciones de Compras en Vivo</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 12px', borderRadius: '10px' }}>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9' }}>Packs/Combos Automáticos</span>
                    </div>
                  </div>
                </div>

                {/* Footer del Reel */}
                <div style={{ textAlign: 'center', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#10B981', color: '#020a07', fontWeight: 900, fontSize: '12px', padding: '10px 18px', borderRadius: '9999px', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
                    <Flame style={{ width: '15px', height: '15px', fill: '#020a07' }} />
                    PROBÁ NEVUX 7 DÍAS GRATIS
                  </div>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px', margin: '8px 0 0 0', fontWeight: 600 }}>
                    Sincronizá en 15 segundos en <span style={{ color: '#10B981', fontWeight: 800 }}>nevux.ar</span>
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB: STORIES VIERNES */}
        {activeTab === 'viernes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: 'rgba(6, 30, 20, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '20px', height: '20px', color: '#34d399' }} />
                Stories Viernes (Cierre y Conversión Directa)
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
              
              {/* STORY 1 (ALERTA FINDE) */}
              <div style={{ width: '100%', maxWidth: '360px', aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <NevuxOfficialLogo size={28} />
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fbbf24', backgroundColor: 'rgba(120, 53, 15, 0.4)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    🔥 PICO DE TRÁFICO
                  </span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, margin: 0 }}>
                    El 70% de tus ventas ocurre el <span style={{ color: '#34d399' }}>Fin de Semana</span>
                  </h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    La gente entra desde el celular en su tiempo libre. Si tu checkout no genera <span style={{ color: '#ffffff', fontWeight: 600 }}>urgencia y confianza</span>, las visitas se van a la competencia.
                  </p>

                  <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#34d399', margin: 0 }}>
                      ⚡ Dejá tu Tiendanube vendiendo sola este sábado y domingo.
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>Siguiente historia: Probalo gratis 👇</p>
                </div>
              </div>

              {/* STORY 2 (OFERTA / PROBAR GRATIS) */}
              <div style={{ width: '100%', maxWidth: '360px', aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <NevuxOfficialLogo size={28} />
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#34d399', backgroundColor: 'rgba(6, 30, 20, 0.8)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    🚀 INSTALACIÓN EXPRÉS
                  </span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight 900, color: '#ffffff', lineHeight: 1.2, margin: 0 }}>
                    Activá Nevux en <span style={{ color: '#34d399' }}>15 segundos</span> sin programar
                  </h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    100% automático, sincronizado con tu Tiendanube y adaptado a los colores de tu marca.
                  </p>

                  {/* Mock Sticker Link Instagram */}
                  <div style={{ backgroundColor: '#10B981', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' }}>
                    <p style={{ fontSize: '13px', fontWeight: 900, color: '#020a07', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      🔗 PROBAR NEVUX 7 DÍAS GRATIS
                    </p>
                    <span style={{ fontSize: '9px', color: '#020a07', fontWeight: 700, opacity: 0.8 }}>nevux.ar</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Sin tarjeta de crédito • App oficial Tiendanube #37382</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TABS ANTERIORES */}
        {(activeTab === 'lunes' || activeTab === 'martes' || activeTab === 'miercoles' || activeTab === 'jueves' || activeTab === 'jueves-portada') && (
          <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
            <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>Plantillas guardadas y listas</h3>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px' }}>Seleccioná "🚀 Stories Viernes" o "🎬 Portada Reel Viernes" para ver los diseños de hoy.</p>
          </div>
        )}

      </main>
    </div>
  );
        }
