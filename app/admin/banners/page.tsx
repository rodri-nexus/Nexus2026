'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Eye, 
  Clock, 
  HelpCircle, 
  Smartphone,
  Award,
  DollarSign,
  AlertTriangle,
  Flame,
  Check,
  X
} from 'lucide-react';

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<
    'lunes' | 'martes' | 'miercoles' | 'miercoles-stories' | 'jueves' | 'jueves-portada'
  >('jueves-portada');

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
      {/* Header */}
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
              style={{ padding: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: 'rgba(6, 30, 20, 0.5)' }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
              <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                Ecosistema de Contenido Semanal
              </h1>
            </div>
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
            📊 Lunes (Encuesta)
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
            🧠 Martes (Psicología)
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
            🎠 Miércoles (Carrusel Feed)
          </button>

          <button
            onClick={() => setActiveTab('miercoles-stories')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'miercoles-stories' ? '#10B981' : '#061e14',
              color: activeTab === 'miercoles-stories' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'miercoles-stories' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            📱 Stories Miércoles
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
            ⏱️ Stories Jueves (Tip + Audit)
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

        </div>
      </div>

      <main style={{ maxWidth: '1280px', margin: '20px auto 0 auto', padding: '0 16px' }}>

        {/* TAB: PORTADA REEL JUEVES */}
        {activeTab === 'jueves-portada' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ backgroundColor: 'rgba(6, 30, 20, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles style={{ width: '20px', height: '20px', color: '#34d399' }} />
                Portada Oficial de Reel (Jueves) — Formato 9:16 con Zona Segura 1:1
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
                Diseño optimizado para capturas de pantalla directas desde tu celular. Todo el contenido importante está centrado en el medio para que cuando Instagram recorte la miniatura en tu perfil, el título quede perfecto.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              
              {/* Contenedor Portada 9:16 */}
              <div 
                style={{ 
                  width: '100%', 
                  maxWidth: '380px', 
                  aspectRatio: '9/16', 
                  backgroundColor: '#020a07', 
                  border: '2px solid rgba(16, 185, 129, 0.4)', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  padding: '24px',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}
              >
                {/* Header Superior del Reel */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#061e14', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', borderRadius: '9999px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#6ee7b7' }}>TIENDANUBE OPTIMIZER</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>NEVUX.AR</span>
                </div>

                {/* ZONA SEGURA CENTRADA 1:1 (Para Feed e Historial de Perfil) */}
                <div 
                  style={{ 
                    zIndex: 10, 
                    margin: 'auto 0', 
                    padding: '20px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Tag Peligro */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '4px 10px', borderRadius: '8px', color: '#f87171', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px' }}>
                    <AlertTriangle style={{ width: '14px', height: '14px' }} />
                    CHECKOUT EN RIESGO
                  </div>

                  {/* Títulos Principales */}
                  <h3 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>
                    3 ERRORES
                  </h3>
                  <h4 style={{ fontSize: '32px', fontWeight: 900, color: '#10B981', lineHeight: 1, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
                    INVISIBLES
                  </h4>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', margin: '0 0 16px 0' }}>
                    que te hacen perder ventas en tu tienda
                  </p>

                  {/* Badges con los 3 errores */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#03120c', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 12px', borderRadius: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 'bold', fontSize: '12px' }}>✕</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9' }}>1. Cero Urgencia en Checkout</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#03120c', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 12px', borderRadius: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 'bold', fontSize: '12px' }}>✕</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9' }}>2. Tienda "Silenciosa" (Sin prueba)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#03120c', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 12px', borderRadius: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 'bold', fontSize: '12px' }}>✕</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9' }}>3. Venta de productos sueltos</span>
                    </div>
                  </div>

                </div>

                {/* Footer del Reel */}
                <div style={{ textAlignment: 'center', textAlign: 'center', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#10B981', color: '#020a07', fontWeight: 900, fontSize: '12px', padding: '8px 16px', borderRadius: '9999px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}>
                    <Flame style={{ width: '14px', height: '14px' }} />
                    MIRÁ EL VIDEO Y SOLUCIONALO
                  </div>
                  <p style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', margin: '8px 0 0 0', fontWeight: 500 }}>
                    Compatible con Tiendanube • Sin tocar código
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB: JUEVES STORIES (TIP + AUDIT) */}
        {activeTab === 'jueves' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: 'rgba(6, 30, 20, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '20px', height: '20px', color: '#34d399' }} />
                Stories Jueves: Story 1 (Tip Visual) + Story 2 (Cajita Interactiva)
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
              
              {/* Story 1 */}
              <div style={{ width: '100%', maxWidth: '360px', aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#34d399', backgroundColor: 'rgba(6, 30, 20, 0.8)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    💡 TIP DE CONVERSIÓN
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>STORY 1/2</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, margin: 0 }}>
                    ¿Por qué tus visitas <span style={{ color: '#f87171' }}>no compran</span> en el momento?
                  </h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    El 97% de los usuarios dice <span style={{ color: '#ffffff', fontWeight: 600 }}>"después compro"</span>... y no vuelve nunca más.
                  </p>

                  <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '14px', height: '14px' }} /> OFERTA POR TIEMPO LIMITADO
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                      <div style={{ backgroundColor: '#020a07', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlignment: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>04</span>
                        <span style={{ display: 'block', fontSize: '8px', color: '#94a3b8', fontWeight: 'bold' }}>HORAS</span>
                      </div>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>:</span>
                      <div style={{ backgroundColor: '#020a07', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlignment: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight 900, color: '#ffffff', fontFamily: 'monospace' }}>58</span>
                        <span style={{ display: 'block', fontSize: '8px', color: '#94a3b8', fontWeight: 'bold' }}>MIN</span>
                      </div>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>:</span>
                      <div style={{ backgroundColor: '#020a07', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlignment: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight 900, color: '#34d399', fontFamily: 'monospace' }}>12</span>
                        <span style={{ display: 'block', fontSize: '8px', color: '#94a3b8', fontWeight: 'bold' }}>SEG</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '10px', textAlignment: 'center', textAlign: 'center', color: '#94a3b8', margin: 0 }}>
                      Instalá este temporizador en tu Tiendanube en 15 segundos con Nevux.
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>Siguiente historia: Auditoría sin cargo 👇</p>
                </div>
              </div>

              {/* Story 2 */}
              <div style={{ width: '100%', maxWidth: '360px', aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fbbf24', backgroundColor: 'rgba(120, 53, 15, 0.4)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    🔍 AUDITORÍA EXPRESS
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>STORY 2/2</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, margin: 0 }}>
                    ¿Querés saber dónde estás <span style={{ color: '#34d399' }}>perdiendo ventas</span>?
                  </h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Reviso el checkout de tu Tiendanube hoy y te paso 3 recomendaciones prácticas para optimizarlo este finde.
                  </p>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                      Escribime el link de tu Tiendanube 👇
                    </p>
                    <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px', fontSize: '11px', color: '#94a3b8', textAlign: 'left' }}>
                      Escribe algo...
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>100% Gratis • Cupos limitados por privado</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* OTROS DÍAS */}
        {(activeTab === 'lunes' || activeTab === 'martes' || activeTab === 'miercoles' || activeTab === 'miercoles-stories') && (
          <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
            <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>Plantillas guardadas y listas</h3>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px' }}>Seleccioná "🎬 Portada Reel Jueves" o "⏱️ Stories Jueves" para ver los diseños de hoy.</p>
          </div>
        )}

      </main>
    </div>
  );
  }
