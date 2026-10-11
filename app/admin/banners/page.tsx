'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Gift, Rocket, Flame, Scale, Ruler, Copy, Check, Film, Clock, Music, Mic, MessageSquare, Send, Search } from 'lucide-react';

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

interface CopyBlockProps {
  id: string;
  title: string;
  text: string;
  copied: boolean;
  onCopy: (id: string, text: string) => void;
}

function CopyBlock({ id, title, text, copied, onCopy }: CopyBlockProps) {
  return (
    <div
      style={{
        backgroundColor: '#061e14',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          📝 {title}
        </h3>
        <button
          onClick={() => onCopy(id, text)}
          style={{
            backgroundColor: copied ? '#10B981' : 'rgba(16,185,129,0.15)',
            color: copied ? '#020a07' : '#34d399',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s'
          }}
        >
          {copied ? (
            <>
              <Check style={{ width: 14, height: 14 }} /> COPIADO
            </>
          ) : (
            <>
              <Copy style={{ width: 14, height: 14 }} /> COPIAR
            </>
          )}
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#020a07',
          border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: 12,
          padding: 14,
          fontSize: 12,
          color: '#cbd5e1',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          fontFamily: 'ui-monospace, monospace',
          maxHeight: 400,
          overflowY: 'auto'
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState('lunes');
  const [copiedId, setCopiedId] = useState<string>('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // ======= COPYS =======
  const copyLunesReel = `📦 El error #1 que estanca las ventas de tu Tiendanube 👇

Si tenés una tienda y cada cliente te compra UN SOLO producto... estás regalando plata. 💸

El 90% de los emprendedores no activa Packs Complementarios. Resultado: ticket promedio bajo, ganancia estancada y publicidad que cada vez rinde menos.

Con el widget "Pack Complementarios" de Nevux:
✅ Mostrás combos armados en la ficha de producto
✅ El cliente agrega más productos con 1 solo clic
✅ Subís tu ticket promedio SIN gastar más en pauta
✅ Se instala en 15 segundos, sin tocar código

🚀 Probá Nevux GRATIS por 7 días desde el link de nuestra biografía (@nevuxapp) o buscá "Nevux" en la App Store oficial de Tiendanube (ID #37382).

#tiendanube #tiendaonlineargentina #ecommerceargentina #venderonline #marketingparaemprendedores #conversionrate #emprendedoresargentinos #ventasonline #nevux`;

  const copyMartesCarrusel = `⚖️ El 73% de tus clientes abandona por ESTA duda 👇

Tus visitas entran a tu Tiendanube, miran tu producto... y se van sin comprar.

¿Por qué? Porque no pueden ver la diferencia REAL de lo que ofrecés.

Una sola foto estática no alcanza. El cliente necesita comparar, ver el resultado, sentir confianza antes de pagar.

Y si no se la das, se van a buscar reviews a Google. Y ahí descubren a tu competencia. 💸

La solución: Widget "Comparador Antes y Después" de Nevux.

Tu cliente desliza y ve el resultado real de tu producto:
✅ Cero dudas
✅ Confianza instantánea  
✅ Menos devoluciones
✅ Más ventas cerradas

Perfecto para cosmética, indumentaria, deco, fitness y cualquier rubro donde el ANTES vs DESPUÉS vende solo.

🚀 Probá Nevux GRATIS 7 días → link en bio (@nevuxapp) o App Store oficial de Tiendanube (ID #37382).

#tiendanube #tiendaonlineargentina #ecommerceargentina #venderonline #marketingparaemprendedores #conversionrate #emprendedoresargentinos #ventasonline #nevux`;

  const copyMiercolesReel = `📏 La devolución más cara que podés tener en tu Tiendanube 👇

El cliente te compra, pagás vos el envío, llega el paquete... y te lo devuelve porque "no le entró". 😩

Perdiste:
❌ El envío de ida
❌ El envío de vuelta  
❌ La venta
❌ Y encima el cliente queda frustrado y no vuelve

El problema NO es tu producto. Es que no le diste la info clara ANTES de comprar.

Solución: Widget "Tabla de Talles" + "Beneficios" de Nevux.

✅ Tabla visual con medidas reales de tu producto
✅ Beneficios destacados que generan confianza
✅ Cliente seguro = Cliente que compra sin dudar
✅ Menos devoluciones = Más ganancia neta

Se activa en 2 minutos desde tu panel. Sin tocar código.

🚀 Probá Nevux GRATIS 7 días → link en bio (@nevuxapp) o buscá "Nevux" en la App Store oficial de Tiendanube (ID #37382).

#tiendanube #tiendaonlineargentina #ecommerceargentina #venderonline #marketingparaemprendedores #conversionrate #emprendedoresargentinos #ventasonline #nevux #tabladetalles`;

  const copyJuevesCajita = `🔍 AUDITORÍA GRATIS para tu Tiendanube

Hoy es jueves de regalo 🎁

Mandame el LINK de tu tienda en esta cajita y te digo:

✅ Qué estás perdiendo hoy
✅ Qué widgets te ayudarían a vender más
✅ Qué errores de conversión tenés sin saberlo
✅ Qué cambios podrías hacer HOY mismo

Sin compromiso. Sin tarjeta. Sin letra chica.

Pegá tu link acá abajo 👇`;

  const copyJuevesDM = `¡Hola! 👋 Soy Rodrigo, el creador de Nevux.

Vi tu tienda y me gustó mucho lo que estás haciendo 💚

Te mando este mensaje porque hoy es jueves de REGALO y te quiero dejar algo especial:

🎁 PASE GRATUITO 7 DÍAS a Nevux (sin tarjeta, sin letra chica)

Con tu pase podés activar:
✅ Pack Complementarios (subí tu ticket promedio)
✅ Comparador Antes y Después (más confianza = más ventas)
✅ Tabla de Talles (menos devoluciones)
✅ Mensaje de Garantía + Badge de Efectivo
✅ Y 8 widgets más listos para activar

👉 Activalo acá: https://nevux.ar

Si tenés cualquier duda me escribís por acá o al WhatsApp 3435042812.

Éxitos con tu tienda 🚀
Rodrigo | Nevux
App oficial Tiendanube #37382`;

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
            { id: 'miercoles', label: '📏 Miércoles (Talles)' },
            { id: 'jueves', label: '⏱️ Jueves (Engagement)' },
            { id: 'jueves-portada', label: '📱 Plantilla DM Jueves' },
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

            {/* ——— DESCRIPCIÓN REEL LUNES ——— */}
            <CopyBlock
              id="lunes-reel"
              title="Descripción Reel Lunes (Pack Complementarios)"
              text={copyLunesReel}
              copied={copiedId === 'lunes-reel'}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* ========== MARTES — COMPARADOR ANTES Y DESPUÉS ========== */}
        {activeTab === 'martes' && (
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
                <Scale style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Martes: Comparador Antes y Después
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                3 Stories + 5 placas de Carrusel. Sacá captura de cada una.
              </p>
            </div>

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

            {/* DIVISOR */}
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

            <CopyBlock
              id="martes-carrusel"
              title="Descripción Carrusel Martes (Comparador Antes y Después)"
              text={copyMartesCarrusel}
              copied={copiedId === 'martes-carrusel'}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* ========== MIÉRCOLES — TABLA DE TALLES + BENEFICIOS ========== */}
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
                <Ruler style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Miércoles: Tabla de Talles + Beneficios
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                3 Stories + Guía de edición del Reel + Descripción para publicar.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>

              {/* STORY 1 — Dolor específico */}
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
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#f87171', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ⚠️ DOLOR REAL
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    ¿Cuántas <span style={{ color: '#f87171' }}>devoluciones</span> tenés al mes por talles mal elegidos?
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Perdés el envío de ida, el de vuelta, la venta y la confianza del cliente. 😩
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
                      { t: 'A) 0 - 2 devoluciones', e: '😌' },
                      { t: 'B) 3 - 10 devoluciones', e: '😬' },
                      { t: 'C) Más de 10', e: '😱' },
                      { t: 'D) Perdí la cuenta', e: '🤯' }
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

              {/* STORY 2 — Beneficios Visual */}
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
                    ⭐ WIDGET DE BENEFICIOS
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Mostrá los <span style={{ color: '#34d399' }}>beneficios reales</span> de tu producto antes de que te lo pregunten
                  </h3>

                  <div
                    style={{
                      backgroundColor: '#061e14',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: 16,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    {[
                      { emoji: '🚚', title: 'Envío Gratis', sub: 'Compras +$30.000' },
                      { emoji: '🔄', title: 'Cambios Gratis', sub: 'Hasta 30 días' },
                      { emoji: '💳', title: '12 Cuotas', sub: 'Sin interés' },
                      { emoji: '🛡️', title: 'Compra Protegida', sub: 'Garantía oficial' }
                    ].map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(16,185,129,0.08)', padding: 10, borderRadius: 10 }}>
                        <span style={{ fontSize: 20 }}>{b.emoji}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{b.title}</span>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>{b.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Mirá el Reel completo en el feed 👇</p>
                </div>
              </div>

              {/* STORY 3 — Testimonio */}
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
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#facc15', letterSpacing: '0.1em' }}>
                    💬 TESTIMONIO REAL
                  </div>

                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 18,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16 }}>
                        M
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>@miguelbenitez.f</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>Cliente verificado</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                      &quot;La verdad me encantó tu aplicación, me ayudó mucho con mis ventas, muchas gracias ❤️👏👏👏&quot;
                    </p>
                    <div style={{ fontSize: 14 }}>⭐⭐⭐⭐⭐</div>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0, textAlign: 'center' }}>
                    Activá <span style={{ color: '#facc15' }}>Tabla de Talles</span> en 2 minutos
                  </h3>

                  <div
                    style={{
                      backgroundColor: '#10B981',
                      borderRadius: 16,
                      padding: 14,
                      textAlign: 'center',
                      boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 900, color: '#020a07', margin: 0 }}>
                      🔗 PROBAR GRATIS 7 DÍAS
                    </p>
                    <span style={{ fontSize: 9, color: '#020a07', fontWeight: 700, opacity: 0.8 }}>nevux.ar</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Poné el Link Sticker a nevux.ar 🔗</p>
                </div>
              </div>

            </div>

            {/* DIVISOR GUÍA REEL */}
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
                <Film style={{ width: 20, height: 20, color: '#facc15' }} />
                Guía de edición Reel Miércoles: &quot;La devolución más cara&quot;
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Paso a paso completo para grabar y editar el reel en CapCut.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12
              }}
            >
              {[
                { icon: <Clock style={{ width: 18, height: 18 }} />, label: 'Duración', value: '22 segundos' },
                { icon: <Film style={{ width: 18, height: 18 }} />, label: 'Formato', value: '9:16 · 1080x1920' },
                { icon: <Music style={{ width: 18, height: 18 }} />, label: 'Música', value: 'Tech House 115 BPM' },
                { icon: <Mic style={{ width: 18, height: 18 }} />, label: 'Audio', value: 'Voz off -6dB + música -20dB' }
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#061e14',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: 12,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399' }}>
                    {item.icon}
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{item.label.toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                🎬 GUIÓN COMPLETO (22 segundos)
              </h3>

              {[
                {
                  time: '0.0s - 2.0s',
                  phase: 'GANCHO',
                  color: '#f87171',
                  voz: '"¿Sabés cuál es la devolución MÁS CARA que podés tener en tu Tiendanube?"',
                  texto: 'LA DEVOLUCIÓN QUE TE DEJA EN ROJO 😱',
                  accion: 'Zoom dramático a tu cara (o producto). Woosh grave al inicio.'
                },
                {
                  time: '2.0s - 7.0s',
                  phase: 'PROBLEMA + AGITACIÓN',
                  color: '#fbbf24',
                  voz: '"El cliente te compra, pagás el envío, llega el paquete... y te lo devuelve porque NO LE ENTRÓ."',
                  texto: '❌ Envío ida\n❌ Envío vuelta\n❌ Venta perdida\n❌ Cliente frustrado',
                  accion: 'Mostrar packing + emoji frustrado + lista roja de pérdidas. Pop seco al entrar cada ❌.'
                },
                {
                  time: '7.0s - 15.0s',
                  phase: 'SOLUCIÓN EN VIVO',
                  color: '#34d399',
                  voz: '"La solución: Widget de Tabla de Talles de Nevux. Mostrás medidas reales ANTES de que compren."',
                  texto: 'TABLA DE TALLES NEVUX 📏',
                  accion: 'Flash blanco 2 frames. Mostrar grabación de pantalla del widget en vivo con zoom dramático. Ding limpio al abrirse la tabla.'
                },
                {
                  time: '15.0s - 20.0s',
                  phase: 'CTA DIRECTO',
                  color: '#10B981',
                  voz: '"Probá Nevux GRATIS 7 días. Link en la bio."',
                  texto: '🚀 nevux.ar\n7 DÍAS GRATIS',
                  accion: 'Zoom-out con blur. Camera shutter al mostrar el link. Botón amarillo pulsante.'
                },
                {
                  time: '20.0s - 22.0s',
                  phase: 'CIERRE DE MARCA',
                  color: '#facc15',
                  voz: '(sin voz, solo música)',
                  texto: 'LOGO NEVUX',
                  accion: 'Fade a negro 0.5s. Logo oficial con swoosh suave. Fin.'
                }
              ].map((block, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#020a07',
                    border: `1px solid ${block.color}33`,
                    borderLeft: `4px solid ${block.color}`,
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 11, color: block.color, fontWeight: 900, letterSpacing: '0.1em' }}>
                      {block.phase}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>
                      ⏱ {block.time}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>🎙 VOZ EN OFF:</span>
                    <p style={{ fontSize: 12, color: '#cbd5e1', margin: '4px 0 0 0', fontStyle: 'italic', lineHeight: 1.5 }}>
                      {block.voz}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>📝 TEXTO EN PANTALLA:</span>
                    <p style={{ fontSize: 12, color: '#fff', margin: '4px 0 0 0', fontWeight: 700, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {block.texto}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>🎬 ACCIÓN / EFECTO:</span>
                    <p style={{ fontSize: 12, color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      {block.accion}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0 }}>
                ✅ CHECKLIST FINAL ANTES DE PUBLICAR
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Formato 9:16 vertical (1080x1920 px)',
                  'Duración entre 20-25 segundos (NO más de 30)',
                  'Subtítulos Montserrat Black 90pt con stroke negro 3px',
                  'Palabras clave resaltadas en amarillo #FACC15 o verde #10B981',
                  'Gancho visual fuerte en los primeros 1.5 segundos',
                  'Cortes cada 2-3 segundos máximo (nada de planos largos)',
                  'Flash blanco de 2 frames entre Agitación y Solución',
                  'Zoom dramático al mostrar el widget Nevux en vivo',
                  'Logo oficial Nevux en el cierre (seg 20-22)',
                  'Audio: voz -6dB + música -20dB (NO que compita)',
                  'Exportar en H.264 MP4, 30fps, bitrate alto'
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      backgroundColor: '#020a07',
                      border: '1px solid rgba(16,185,129,0.15)',
                      borderRadius: 8,
                      padding: '10px 12px'
                    }}
                  >
                    <span style={{ color: '#34d399', fontSize: 14 }}>☐</span>
                    <span style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <CopyBlock
              id="miercoles-reel"
              title="Descripción Reel Miércoles (Tabla de Talles)"
              text={copyMiercolesReel}
              copied={copiedId === 'miercoles-reel'}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* ========== JUEVES — ENGAGEMENT + AUDITORÍA ========== */}
        {activeTab === 'jueves' && (
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
                <Search style={{ width: 20, height: 20, color: '#facc15' }} />
                Jueves: Engagement + Auditoría Gratis
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                🚫 Hoy NO va Reel al feed. Es día de engagement puro con tus seguidores.
              </p>
            </div>

            {/* AVISO HORARIOS JUEVES */}
            <div
              style={{
                backgroundColor: 'rgba(250,204,21,0.08)',
                border: '1px solid rgba(250,204,21,0.3)',
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <span style={{ fontSize: 11, color: '#facc15', fontWeight: 900, letterSpacing: '0.1em' }}>
                📅 PLAN DEL DÍA
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#cbd5e1' }}>
                <span>• <strong style={{ color: '#fff' }}>09:30</strong> → Story 1: Tip del widget &quot;Oferta Especial Hoy&quot;</span>
                <span>• <strong style={{ color: '#fff' }}>09:31</strong> → Story 2: Cajita de pregunta (Auditoría Gratis)</span>
                <span>• <strong style={{ color: '#fff' }}>18:00</strong> → Stories 3 y 4: Respuestas a tiendas recibidas</span>
                <span>• <strong style={{ color: '#fff' }}>21:00</strong> → Enviar DM personalizado con pase gratuito</span>
              </div>
            </div>

            {/* STORIES 1 Y 2 (Tip + Cajita) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>

              {/* STORY 1 — Tip Oferta Especial Hoy */}
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
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#facc15', letterSpacing: '0.1em' }}>
                    💡 TIP DEL DÍA
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Activá <span style={{ color: '#facc15' }}>&quot;Oferta Especial Hoy&quot;</span> y creá urgencia real
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Un contador que corre + un descuento visible = cliente que decide YA. ⏳
                  </p>

                  {/* Preview del widget Oferta Especial */}
                  <div
                    style={{
                      backgroundColor: '#0D3320',
                      borderRadius: 16,
                      padding: 16,
                      border: '2px solid #facc15',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      boxShadow: '0 0 24px rgba(250,204,21,0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#facc15' }}>🎉 ¡OFERTA ESPECIAL HOY!</span>
                      <span style={{ fontSize: 20 }}>⏳</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['12', '34', '58'].map((n, i) => (
                        <React.Fragment key={i}>
                          <div style={{ flex: 1, backgroundColor: '#020a07', borderRadius: 8, padding: '10px 4px', textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 900, color: '#facc15', lineHeight: 1 }}>{n}</div>
                            <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 2 }}>
                              {['HS', 'MIN', 'SEG'][i]}
                            </div>
                          </div>
                          {i < 2 && <span style={{ color: '#facc15', alignSelf: 'center', fontWeight: 900 }}>:</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 11, color: '#34d399', fontWeight: 700 }}>
                      -20% OFF solo por hoy
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>👇 Deslizá a la próxima story</p>
                </div>
              </div>

              {/* STORY 2 — Cajita de Auditoría */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(250,204,21,0.4)',
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
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#facc15', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Search style={{ width: 14, height: 14 }} /> AUDITORÍA GRATIS
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    Mandame el <span style={{ color: '#facc15' }}>link de tu tienda</span> y te digo qué mejorar
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Gratis. Sin compromiso. Sin letra chica. 🎁
                  </p>

                  {/* Cajita simulando el sticker de pregunta */}
                  <div
                    style={{
                      backgroundColor: 'rgba(250,204,21,0.1)',
                      border: '2px solid #facc15',
                      borderRadius: 16,
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#facc15', fontWeight: 900, letterSpacing: '0.05em' }}>
                      📝 PEGÁ TU LINK ACÁ:
                    </div>
                    <div
                      style={{
                        backgroundColor: '#020a07',
                        border: '1px dashed rgba(250,204,21,0.4)',
                        borderRadius: 10,
                        padding: 14,
                        fontSize: 12,
                        color: '#64748b',
                        fontFamily: 'ui-monospace, monospace'
                      }}
                    >
                      mitienda.mitiendanube.com
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#34d399', fontWeight: 600 }}>
                      <Check style={{ width: 12, height: 12 }} /> Respondo todos los links hoy
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 12 }}>
                  <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>Poné la Cajita de Preguntas de IG arriba 👆</p>
                </div>
              </div>

            </div>

            {/* DIVISOR - RESPUESTAS 18:00 */}
            <div
              style={{
                backgroundColor: 'rgba(6,30,20,0.8)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 16,
                marginTop: 8
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories 3 y 4 (18:00): Respuestas en vivo
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Molde vacío para completar + Ejemplo relleno de cómo queda.
              </p>
            </div>

            {/* STORIES 3 Y 4 (Molde + Ejemplo) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>

              {/* STORY 3 — MOLDE VACÍO */}
              <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
                    📋 MOLDE VACÍO (completar en vivo)
                  </span>
                </div>
                <div
                  style={{
                    aspectRatio: '9/16',
                    backgroundColor: '#020a07',
                    border: '2px dashed rgba(250,204,21,0.4)',
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

                  <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', color: '#facc15', letterSpacing: '0.1em' }}>
                      🔍 AUDITORÍA EN VIVO
                    </div>

                    {/* Captura de la tienda */}
                    <div
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px dashed rgba(148,163,184,0.4)',
                        borderRadius: 12,
                        padding: 20,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        minHeight: 100,
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{ fontSize: 24 }}>🖼️</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>[Captura de la tienda del seguidor]</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px dashed rgba(239,68,68,0.4)', borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, marginBottom: 2 }}>❌ PROBLEMA DETECTADO:</div>
                        <div style={{ fontSize: 11, color: '#cbd5e1', fontStyle: 'italic' }}>[Escribí acá el problema]</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px dashed rgba(16,185,129,0.4)', borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 10, color: '#34d399', fontWeight: 700, marginBottom: 2 }}>✅ WIDGET NEVUX QUE LO RESUELVE:</div>
                        <div style={{ fontSize: 11, color: '#cbd5e1', fontStyle: 'italic' }}>[Escribí el widget recomendado]</div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(148,163,184,0.1)',
                        border: '1px dashed rgba(148,163,184,0.4)',
                        borderRadius: 10,
                        padding: 10,
                        textAlign: 'center',
                        fontSize: 11,
                        color: '#94a3b8'
                      }}
                    >
                      @arroba_tienda
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Etiquetá al seguidor + Mencioná @nevuxapp</p>
                  </div>
                </div>
              </div>

              {/* STORY 4 — EJEMPLO RELLENO */}
              <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700, letterSpacing: '0.05em' }}>
                    ✨ EJEMPLO (así queda cuando lo completás)
                  </span>
                </div>
                <div
                  style={{
                    aspectRatio: '9/16',
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
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <NevuxLogo size={28} />
                  </div>

                  <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', color: '#facc15', letterSpacing: '0.1em' }}>
                      🔍 AUDITORÍA EN VIVO
                    </div>

                    {/* Mock de la tienda */}
                    <div
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>moda.deportiva.ar</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{ flex: 1, height: 44, backgroundColor: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👕</div>
                        <div style={{ flex: 1, height: 44, backgroundColor: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👟</div>
                        <div style={{ flex: 1, height: 44, backgroundColor: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎽</div>
                      </div>
                      <div style={{ fontSize: 9, color: '#1e293b', fontWeight: 700, textAlign: 'center' }}>Remera Oversize $18.500</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, marginBottom: 2 }}>❌ PROBLEMA DETECTADO:</div>
                        <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>No tiene Tabla de Talles → muchas devoluciones</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 10, color: '#34d399', fontWeight: 700, marginBottom: 2 }}>✅ WIDGET NEVUX QUE LO RESUELVE:</div>
                        <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>📏 Tabla de Talles + ⭐ Beneficios</div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(250,204,21,0.1)',
                        border: '1px solid #facc15',
                        borderRadius: 10,
                        padding: 10,
                        textAlign: 'center',
                        fontSize: 11,
                        color: '#facc15',
                        fontWeight: 700
                      }}
                    >
                      @moda.deportiva.ar
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 10, color: '#34d399', margin: 0 }}>✅ Etiquetado + Mención a @nevuxapp</p>
                  </div>
                </div>
              </div>

            </div>

            {/* DESCRIPCIÓN CAJITA */}
            <CopyBlock
              id="jueves-cajita"
              title="Texto para la Cajita de Preguntas (Story 2 - 09:31)"
              text={copyJuevesCajita}
              copied={copiedId === 'jueves-cajita'}
              onCopy={handleCopy}
            />

          </div>
        )}

        {/* ========== PLANTILLA DM JUEVES ========== */}
        {activeTab === 'jueves-portada' && (
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
                <Send style={{ width: 20, height: 20, color: '#facc15' }} />
                Plantilla DM Jueves (21:00): Pase Gratuito 1 a 1
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Mensaje privado personalizado para cada tienda que te mandó el link durante el día.
              </p>
            </div>

            {/* MOCKUP DEL DM */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: 400,
                  backgroundColor: '#000',
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '2px solid rgba(16,185,129,0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
                }}
              >
                {/* Header del chat IG */}
                <div style={{ backgroundColor: '#000', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 14 }}>
                    N
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>nevuxapp</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>Activo ahora</span>
                  </div>
                </div>

                {/* Mensaje */}
                <div style={{ padding: 16, backgroundColor: '#000', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      backgroundColor: '#262626',
                      color: '#fff',
                      borderRadius: 18,
                      padding: '12px 14px',
                      fontSize: 12,
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      maxWidth: '85%'
                    }}
                  >
                    {copyJuevesDM}
                  </div>
                  <span style={{ fontSize: 9, color: '#64748b', marginLeft: 4 }}>Enviado</span>
                </div>
              </div>
            </div>

            {/* GUÍA DE PERSONALIZACIÓN */}
            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0 }}>
                🎯 CÓMO PERSONALIZAR CADA DM
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { num: '1', title: 'Entrá a la tienda', desc: 'Abrí el link que te mandó el seguidor y mirá 2-3 cosas puntuales (fichas de producto, checkout, home).' },
                  { num: '2', title: 'Detectá el problema #1', desc: 'Buscá el error de conversión más visible: sin tabla de talles, sin beneficios, sin garantía, sin social proof.' },
                  { num: '3', title: 'Mencionalo específico', desc: 'Reemplazá "me gustó lo que estás haciendo" por algo real: "me gustó cómo tenés armadas las fichas de producto".' },
                  { num: '4', title: 'Recomendá EL widget clave', desc: 'En vez de listar los 4 widgets, destacá el que más impacto le daría A ESA tienda.' },
                  { num: '5', title: 'Cerrá con CTA directo', desc: 'Mantené el link nevux.ar y el ofrecimiento de WhatsApp para dudas.' }
                ].map((step, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#020a07',
                      border: '1px solid rgba(16,185,129,0.15)',
                      borderRadius: 10,
                      padding: 12,
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#10B981', color: '#020a07', fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {step.num}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{step.title}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPCIÓN DM */}
            <CopyBlock
              id="jueves-dm"
              title="Mensaje DM Jueves (Pase Gratuito 1 a 1)"
              text={copyJuevesDM}
              copied={copiedId === 'jueves-dm'}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* ========== PLACEHOLDER OTROS DÍAS ========== */}
        {activeTab !== 'lunes' && activeTab !== 'martes' && activeTab !== 'miercoles' && activeTab !== 'jueves' && activeTab !== 'jueves-portada' && (
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
              Seleccioná &quot;Lunes&quot;, &quot;Martes&quot;, &quot;Miércoles&quot; o &quot;Jueves&quot; para ver las plantillas cargadas.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
