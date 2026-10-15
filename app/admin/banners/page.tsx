'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Gift, Rocket, Flame, Ruler, AlertTriangle, ShieldAlert } from 'lucide-react';

function NevuxLogo({ size = 32 }: { size?: number }) {
  const iconSize = Math.round(size * 0.52);
  const fontSize = Math.round(size * 0.55);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.9)',
          flexShrink: 0
        }}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M3 3H7.5V21H3V3Z" fill="#FFFFFF" />
          <path d="M16.5 3H21V21H16.5V3Z" fill="#FFFFFF" />
          <path d="M7.5 3L21 21H16.5L3 3H7.5Z" fill="url(#nevuxGrad)" />
          <defs>
            <linearGradient id="nevuxGrad" x1="3" y1="3" x2="21" y2="21">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E4E4E7" />
              <stop offset="75%" stopColor="#52525B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span
        style={{
          fontSize: fontSize,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.08em',
          lineHeight: 1
        }}
      >
        NEVUX
      </span>
    </div>
  );
}

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState('miercoles');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020a07',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        paddingBottom: 96
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid rgba(16,185,129,0.2)',
          backgroundColor: '#04140e',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '12px 16px'
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/admin"
              style={{
                padding: 8,
                color: '#94a3b8',
                display: 'flex',
                borderRadius: 8,
                backgroundColor: 'rgba(6,30,20,0.5)',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </Link>
            <NevuxLogo size={28} />
          </div>
          <span
            style={{
              fontSize: 11,
              backgroundColor: 'rgba(16,185,129,0.15)',
              color: '#34d399',
              border: '1px solid rgba(16,185,129,0.3)',
              padding: '4px 10px',
              borderRadius: 9999,
              fontWeight: 600
            }}
          >
            Tiendanube App #37382
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ maxWidth: 1280, margin: '20px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {[
            { id: 'lunes', label: '📊 Stories Lunes (Packs)' },
            { id: 'martes', label: '🧠 Martes' },
            { id: 'miercoles', label: '📏 Miércoles (Tabla de Talles & Reel)' },
            { id: 'jueves', label: '⏱️ Stories Jueves' },
            { id: 'jueves-portada', label: '🎬 Portada Reel Jueves' },
            { id: 'viernes', label: '🚀 Stories Viernes' },
            { id: 'viernes-portada', label: '🎬 Portada Reel Viernes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#10B981' : '#061e14',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                boxShadow: activeTab === tab.id ? '0 4px 14px rgba(16,185,129,0.3)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: '20px auto 0', padding: '0 16px' }}>

        {/* ========== MIÉRCOLES (TABLA DE TALLES & REEL PORTADA) ========== */}
        {activeTab === 'miercoles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                backgroundColor: 'rgba(6,30,20,0.8)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 16
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ruler style={{ width: 20, height: 20, color: '#10B981' }} />
                Miércoles: Portada de Reel & Stories (Tabla de Talles)
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Sacá captura directa a la Portada del Reel para usarla en Instagram.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>

              {/* PORTADA REEL MIÉRCOLES (9:16 CAPTURA PERFECTA) */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '3px solid #10B981',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  boxShadow: '0 12px 36px rgba(16,185,129,0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glow decorativo de fondo */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239,68,68,0.15)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-20%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16,185,129,0.2)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
                  <NevuxLogo size={28} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 900,
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: 6,
                      letterSpacing: '0.05em'
                    }}
                  >
                    🚨 COSTO OCULTO
                  </span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 2 }}>
                  <h1
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: '#ffffff',
                      lineHeight: 1.15,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    LO MÁS CARO DE TU TIENDA ES <span style={{ color: '#ef4444', textDecoration: 'underline' }}>UNA DEVOLUCIÓN</span> 💸
                  </h1>

                  <div
                    style={{
                      backgroundColor: 'rgba(15,23,42,0.9)',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: 16,
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle style={{ width: 14, height: 14, color: '#ef4444' }} /> COMPRAR A CIEGAS CUESTA CARO:
                    </div>
                    {[
                      '💸 Envío de ida pagado en vano',
                      '📦 Envío de vuelta a tu cargo',
                      '⏳ Tiempo perdido en reclamos',
                      '😡 Cliente frustrado que no vuelve'
                    ].map((txt, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#f8fafc',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          padding: '6px 10px',
                          borderRadius: 8
                        }}
                      >
                        {txt}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      backgroundColor: '#10B981',
                      color: '#020a07',
                      borderRadius: 14,
                      padding: '12px 14px',
                      textAlign: 'center',
                      fontWeight: 900,
                      fontSize: 12,
                      boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <Ruler style={{ width: 16, height: 16, color: '#020a07' }} />
                    SOLUCIÓN: TABLA DE TALLES
                  </div>
                </div>

                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 700 }}>
                    App Oficial Tiendanube #37382 • nevux.ar
                  </p>
                </div>
              </div>

              {/* STORY MIÉRCOLES — Explicación del problema */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NevuxLogo size={28} />
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    ¿Sabías que el <span style={{ color: '#ef4444' }}>70% de las devoluciones</span> en indumentaria son por talle?
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Si tu cliente no sabe si pedir M o L, prefiere no comprar o pide con duda. La Tabla de Talles elimina el miedo y cierra la venta.
                  </p>

                  <div
                    style={{
                      backgroundColor: '#061e14',
                      border: '1px solid rgba(16,185,129,0.3)',
                      padding: 16,
                      borderRadius: 16,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      📏 WIDGET TABLA DE TALLES
                    </div>
                    <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>
                      Mirá el video que subimos al feed para ver cómo colocarla en tu tienda en 15 segundos.
                    </p>
                    <div
                      style={{
                        backgroundColor: '#10B981',
                        color: '#020a07',
                        fontWeight: 900,
                        fontSize: 12,
                        padding: 10,
                        borderRadius: 10,
                        marginTop: 4
                      }}
                    >
                      ▶ VER REEL EN EL FEED
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Tocá para ir directo al Reel 👇</p>
                </div>
              </div>

              {/* STORY MIÉRCOLES — CTA Instalación */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NevuxLogo size={28} />
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Evitá devoluciones con <span style={{ color: '#34d399' }}>Nevux</span>
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Instalá el Widget de Tabla de Talles en tu Tiendanube en 15 segundos y ahorrá miles de pesos en logística.
                  </p>

                  <div
                    style={{
                      backgroundColor: '#10B981',
                      borderRadius: 16,
                      padding: 16,
                      textAlign: 'center',
                      boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 900, color: '#020a07', margin: 0 }}>
                      🔗 PROBAR NEVUX 7 DÍAS GRATIS
                    </p>
                    <span style={{ fontSize: 9, color: '#020a07', fontWeight: 700, opacity: 0.8 }}>nevux.ar</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>App Oficial Tiendanube #37382 • Sin tarjeta</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========== STORIES LUNES (SIN HORARIOS) ========== */}
        {activeTab === 'lunes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                backgroundColor: 'rgba(6,30,20,0.8)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 16
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Lunes: Pack Complementarios
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Sacá captura de cada una y publicá en los horarios del plan.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>

              {/* STORY 1 — Encuesta */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NevuxLogo size={28} />
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    ¿Cuánto es el <span style={{ color: '#10B981' }}>Ticket Promedio</span> en tu Tiendanube?
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    De cada 100 personas que te compran, ¿cuánto dinero deja en promedio cada cliente?
                  </p>

                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}
                  >
                    {[
                      { t: 'A) $5.000 - $10.000', e: '💸' },
                      { t: 'B) $10.000 - $25.000', e: '📦' },
                      { t: 'C) Más de $25.000', e: '🚀' },
                      { t: 'D) No lo tengo medido', e: '🤯' }
                    ].map((opt, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: 10,
                          padding: '10px 12px',
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: '#1e293b',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt.t}</span>
                        <span style={{ color: '#64748b' }}>{opt.e}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 12 }}>
                  <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>Poné el sticker de encuesta interactivo arriba 👆</p>
                </div>
              </div>

              {/* STORY 2 — Empuje al Reel */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NevuxLogo size={28} />
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    El error #1 que <span style={{ color: '#f87171' }}>estanca las ventas</span> de tu tienda
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Dejar que el cliente compre 1 solo producto cuando por un extra mínimo se llevaría el combo completo.
                  </p>

                  <div
                    style={{
                      backgroundColor: '#061e14',
                      border: '1px solid rgba(16,185,129,0.3)',
                      padding: 16,
                      borderRadius: 16,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Gift style={{ width: 16, height: 16 }} /> PACK COMPLEMENTARIOS
                    </div>
                    <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>
                      Mirá el nuevo Reel que subimos al feed para ver cómo funciona en vivo.
                    </p>
                    <div
                      style={{
                        backgroundColor: '#10B981',
                        color: '#020a07',
                        fontWeight: 900,
                        fontSize: 12,
                        padding: 10,
                        borderRadius: 10,
                        marginTop: 4
                      }}
                    >
                      ▶ VER REEL EN EL FEED
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Tocá para ir directo a ver el Reel 👇</p>
                </div>
              </div>

              {/* STORY 3 — CTA */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NevuxLogo size={28} />
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Instalá Pack Complementarios en <span style={{ color: '#34d399' }}>15 segundos</span>
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Sincronizado con tu Tiendanube, sin tocar código y adaptado automáticamente a los colores de tu marca.
                  </p>

                  <div
                    style={{
                      backgroundColor: '#10B981',
                      borderRadius: 16,
                      padding: 16,
                      textAlign: 'center',
                      boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 900, color: '#020a07', margin: 0 }}>
                      🔗 PROBAR NEVUX 7 DÍAS GRATIS
                    </p>
                    <span style={{ fontSize: 9, color: '#020a07', fontWeight: 700, opacity: 0.8 }}>nevux.ar</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>App Oficial Tiendanube #37382 • Sin tarjeta</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Placeholder otros días */}
        {activeTab !== 'lunes' && activeTab !== 'miercoles' && (
          <div
            style={{
              backgroundColor: '#061e14',
              border: '1px solid rgba(16,185,129,0.3)',
              padding: 20,
              borderRadius: 16,
              textAlign: 'center'
            }}
          >
            <h3 style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, margin: 0 }}>Plantillas guardadas</h3>
            <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>
              Seleccioná &quot;📏 Miércoles (Tabla de Talles & Reel)&quot; o &quot;📊 Stories Lunes (Packs)&quot; para ver las portadas y stories.
            </p>
          </div>
        )}

      </main>
    </div>
  );
          }
