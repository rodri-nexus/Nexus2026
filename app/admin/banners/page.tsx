'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Gift, Rocket, Flame, Scale } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('lunes');

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
            { id: 'martes', label: '🧠 Martes (Comparador)' },
            { id: 'miercoles', label: '🎠 Miércoles' },
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

        {/* ========== STORIES LUNES ========== */}
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

        {/* ========== MARTES — COMPARADOR ANTES Y DESPUÉS ========== */}
        {activeTab === 'martes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Encabezado Stories */}
            <div
              style={{
                backgroundColor: 'rgba(6,30,20,0.8)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 16
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Martes: Comparador Antes y Después
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                3 Stories + 5 placas de Carrusel. Sacá captura de cada una.
              </p>
            </div>

            {/* ——— 3 STORIES ——— */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>

              {/* STORY 1 — Pregunta SI/NO */}
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
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#34d399', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Scale style={{ width: 14, height: 14 }} /> COMPARADOR ANTES Y DESPUÉS
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    ¿Alguna vez <span style={{ color: '#f87171' }}>compraste algo</span> online y te llegó <span style={{ color: '#facc15' }}>distinto</span> a la foto?
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Tus clientes tienen la misma duda. Y si no la resolvés, se van. 😬
                  </p>

                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 16,
                      display: 'flex',
                      gap: 12,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: '#fef2f2',
                        border: '2px solid #f87171',
                        borderRadius: 12,
                        padding: '16px 12px',
                        textAlign: 'center',
                        fontWeight: 900,
                        fontSize: 16,
                        color: '#1e293b'
                      }}
                    >
                      😩 SÍ
                    </div>
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #10B981',
                        borderRadius: 12,
                        padding: '16px 12px',
                        textAlign: 'center',
                        fontWeight: 900,
                        fontSize: 16,
                        color: '#1e293b'
                      }}
                    >
                      😌 NO
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 12 }}>
                  <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>Poné el sticker de encuesta SI / NO arriba 👆</p>
                </div>
              </div>

              {/* STORY 2 — Empuje al Carrusel */}
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
                    ¿Ya viste el <span style={{ color: '#10B981' }}>carrusel</span> de hoy?
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Te muestro cómo eliminar las dudas de tus clientes con una sola herramienta visual ⚖️
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
                      <Scale style={{ width: 16, height: 16 }} /> COMPARADOR ANTES Y DESPUÉS
                    </div>
                    <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>
                      5 placas con el problema, la causa y la solución para tu tienda.
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
                      👇 DESLIZÁ EN EL FEED
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Tocá para ir directo al carrusel 👇</p>
                </div>
              </div>

              {/* STORY 3 — CTA Link */}
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
                    Activá el <span style={{ color: '#facc15' }}>Comparador</span> en tu tienda
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Que tus clientes vean el antes y después real de tu producto. Sin dudas, sin devoluciones.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Sin tarjeta de crédito', 'Se instala en 2 minutos', 'App oficial Tiendanube #37382'].map((txt, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                        <span>✅</span> {txt}
                      </div>
                    ))}
                  </div>

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
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Poné el Link Sticker a nevux.ar 🔗</p>
                </div>
              </div>

            </div>

            {/* ——— DIVISOR ——— */}
            <div
              style={{
                backgroundColor: 'rgba(6,30,20,0.8)',
                border: '1px solid rgba(250,204,21,0.3)',
                borderRadius: 16,
                padding: 16,
                marginTop: 8
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                🎠 Carrusel Feed: 5 Placas PAS
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Formato 1:1 cuadrado para feed. Sacá captura de cada placa y subilas como carrusel.
              </p>
            </div>

            {/* ——— 5 PLACAS DEL CARRUSEL ——— */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>

              {/* PLACA 1 — GANCHO */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '1/1',
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={24} />
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>1/5</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 40 }}>😱</div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: 0 }}>
                    El <span style={{ color: '#f87171' }}>73%</span> de tus clientes abandona por <span style={{ color: '#facc15' }}>esta duda</span>
                  </h3>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, fontWeight: 600 }}>
                    Deslizá para descubrirlo →
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>@nevuxapp</p>
                </div>
              </div>

              {/* PLACA 2 — PROBLEMA */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '1/1',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(239,68,68,0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={24} />
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>2/5</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#f87171', letterSpacing: '0.1em' }}>
                    ❌ EL PROBLEMA
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Tus clientes <span style={{ color: '#f87171' }}>no pueden ver</span> la diferencia real de tu producto
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Una sola foto estática no alcanza. Necesitan comparar, ver el resultado, sentir confianza antes de pagar.
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>@nevuxapp</p>
                </div>
              </div>

              {/* PLACA 3 — AGITACIÓN */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '1/1',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(251,191,36,0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={24} />
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>3/5</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fbbf24', letterSpacing: '0.1em' }}>
                    ⚠️ ¿QUÉ PASA DESPUÉS?
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Se van a <span style={{ color: '#fbbf24' }}>buscar reviews</span> a Google...
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Y ahí descubren a tu competencia. Cada duda sin resolver es una venta que perdés. 💸
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                    {[
                      'Más carritos abandonados',
                      'Más devoluciones',
                      'Menos confianza = Menos ventas'
                    ].map((txt, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 8,
                          padding: '8px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#f87171'
                        }}
                      >
                        ❌ {txt}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>@nevuxapp</p>
                </div>
              </div>

              {/* PLACA 4 — SOLUCIÓN */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '1/1',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.4)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={24} />
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>4/5</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#34d399', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Scale style={{ width: 14, height: 14 }} /> LA SOLUCIÓN
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    <span style={{ color: '#10B981' }}>Comparador</span> Antes y Después de Nevux
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Tu cliente desliza y ve el resultado real. Confianza instantánea. Cero dudas.
                  </p>

                  {/* Mini widget preview */}
                  <div
                    style={{
                      backgroundColor: '#061e14',
                      borderRadius: 14,
                      padding: 14,
                      border: '1px solid rgba(16,185,129,0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ color: '#f87171', fontWeight: 700, fontSize: 11 }}>ANTES</span>
                      <div style={{ width: 2, height: 24, backgroundColor: '#facc15', borderRadius: 2 }} />
                      <span style={{ color: '#34d399', fontWeight: 700, fontSize: 11 }}>DESPUÉS</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <div style={{ flex: 1, height: 48, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        🖼️
                      </div>
                      <div style={{ flex: 1, height: 48, borderRadius: 8, backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        ✨
                      </div>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 6, fontSize: 10, color: '#34d399', fontWeight: 600, margin: '6px 0 0 0' }}>
                      ← Deslizá para comparar →
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>@nevuxapp</p>
                </div>
              </div>

              {/* PLACA 5 — CTA */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '1/1',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.4)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  boxShadow: '0 0 30px rgba(16,185,129,0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={24} />
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>5/5</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 36 }}>🚀</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Probá <span style={{ color: '#facc15' }}>7 días GRATIS</span>
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Instalá Nevux desde la App Store de Tiendanube o entrá directo:
                  </p>

                  <div
                    style={{
                      backgroundColor: '#10B981',
                      borderRadius: 16,
                      padding: 14,
                      textAlign: 'center',
                      boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 900, color: '#020a07', margin: 0 }}>
                      🔗 nevux.ar
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                    {['Sin tarjeta de crédito', 'Se instala en 2 minutos', 'App oficial Tiendanube #37382'].map((txt, i) => (
                      <div key={i} style={{ fontSize: 10, color: '#34d399', fontWeight: 600 }}>
                        ✅ {txt}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>@nevuxapp</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========== PLACEHOLDER OTROS DÍAS ========== */}
        {activeTab !== 'lunes' && activeTab !== 'martes' && (
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
              Seleccioná &quot;📊 Stories Lunes&quot; o &quot;🧠 Martes&quot; para ver las plantillas cargadas.
            </p>
          </div>
        )}

      </main>
    </div>
  );
              }
