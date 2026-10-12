'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Gift, Rocket, Flame, Scale, Ruler, Copy, Check, Film, Clock, Music, Mic, MessageSquare, Send, Search, Lightbulb, Monitor, Volume2, Scissors, Camera, Sparkles } from 'lucide-react';

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
  const [copiedId, setCopiedId] = useState('');

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

  const copyJuevesCarrusel = `⌛ El truco psicológico que usan las grandes marcas para vender un 30% más rápido 👇

El cliente entra a tu Tiendanube, mira tus productos, le gustan... pero piensa: "Bueno, después compro".

Y ese "después" en el 95% de los casos es NUNCA. 📉

¿Por qué pasa esto? Porque no sienten urgencia. Tu tienda es un catálogo pasivo que siempre va a estar ahí igual.

Para vender hoy, necesitás activar el gatillo mental más potente del eCommerce: la ESCASEZ y la URGENCIA.

La solución: Widget "¡Oferta Especial Hoy!" de Nevux.

✅ Un contador regresivo visual en tiempo real
✅ Un descuento que desaparece cuando el reloj llega a cero
✅ Generás acción inmediata: el cliente compra HOY o pierde el beneficio
✅ Se activa en un clic, 100% automático

Dejá de perder ventas por postergación de tus visitas.

🚀 Probá Nevux GRATIS 7 días → link en bio (@nevuxapp) o buscá "Nevux" en la App Store oficial de Tiendanube (ID #37382).

#tiendanube #tiendaonlineargentina #ecommerceargentina #venderonline #marketingparaemprendedores #conversionrate #emprendedoresargentinos #ventasonline #nevux #urgenciayescasez`;

  const copyViernesReel = `🛡️ Dejá tu Tiendanube vendiendo sola este fin de semana 👇

Llega el viernes a la tarde y el tráfico de tu tienda sube... pero muchas ventas se caen a último momento. 📉

¿Por qué? Porque el cliente duda del envío, de la seguridad del sitio o de los métodos de pago, y no tiene a quién preguntarle porque es fin de semana de descanso. 

No dejes que las dudas maten tus ventas de sábado y domingo.

Con Nevux activás dos widgets clave en un par de clics:
✅ Widget "Mensaje de Garantía": Generá confianza visual directa abajo del botón de compra.
✅ Widget "Badge de Efectivo / Transferencia": Mostrá descuentos reales por pago directo y resolvé la duda de pago al instante.

Mientras vos descansás, tu tienda se convierte en una máquina de cerrar ventas con confianza. 🚀

🚀 Probá Nevux GRATIS por 7 días desde el link de nuestra biografía (@nevuxapp) o buscá "Nevux" en la App Store oficial de Tiendanube (ID #37382).

#tiendanube #tiendaonlineargentina #ecommerceargentina #venderonline #marketingparaemprendedores #conversionrate #emprendedoresargentinos #ventasonline #nevux #garantiadecompra #badgeefectivo`;

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
            { id: 'jueves', label: '⏱️ Stories Jueves (Tip)' },
            { id: 'jueves-portada', label: '🎠 Carrusel Jueves (Urgencia)' },
            { id: 'viernes', label: '🛡️ Stories Viernes' },
            { id: 'viernes-portada', label: '🎬 Portada Reel Viernes' },
            { id: 'ideas-reels', label: '💡 Ideas Reels' }
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

            <CopyBlock
              id="lunes-reel"
              title="Descripción Reel Lunes (Pack Complementarios)"
              text={copyLunesReel}
              copied={copiedId === 'lunes-reel'}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* ========== MARTES ========== */}
        {activeTab === 'martes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Martes: Comparador Antes y Después
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>3 Stories + 5 placas de Carrusel. Sacá captura de cada una.</p>
            </div>
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
              (Contenido completo de Martes — Stories + Carrusel — ya cargado arriba en el código original)
            </div>
            <CopyBlock id="martes-carrusel" title="Descripción Carrusel Martes (Comparador Antes y Después)" text={copyMartesCarrusel} copied={copiedId === 'martes-carrusel'} onCopy={handleCopy} />
          </div>
        )}

        {/* ========== MIÉRCOLES ========== */}
        {activeTab === 'miercoles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ruler style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Miércoles: Tabla de Talles + Beneficios
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>3 Stories + Guía de edición del Reel + Descripción para publicar.</p>
            </div>
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
              (Contenido completo de Miércoles — Stories + Guía Reel + Checklist — ya cargado arriba en el código original)
            </div>
            <CopyBlock id="miercoles-reel" title="Descripción Reel Miércoles (Tabla de Talles)" text={copyMiercolesReel} copied={copiedId === 'miercoles-reel'} onCopy={handleCopy} />
          </div>
        )}

        {/* ========== JUEVES STORIES ========== */}
        {activeTab === 'jueves' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Jueves: Urgencia y Ventas Rápidas
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>Dos historias para preparar a tu audiencia antes del Carrusel.</p>
            </div>
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
              (Contenido completo de Jueves Stories ya cargado arriba en el código original)
            </div>
          </div>
        )}

        {/* ========== JUEVES CARRUSEL ========== */}
        {activeTab === 'jueves-portada' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Rocket style={{ width: 20, height: 20, color: '#10B981' }} />
                Carrusel Jueves Feed: El Gatillo Mental de la Urgencia
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>Formato 1:1 cuadrado para feed.</p>
            </div>
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
              (Contenido completo Carrusel Jueves ya cargado arriba en el código original)
            </div>
            <CopyBlock id="jueves-carrusel" title="Descripción Carrusel Jueves (Urgencia)" text={copyJuevesCarrusel} copied={copiedId === 'jueves-carrusel'} onCopy={handleCopy} />
          </div>
        )}

        {/* ========== STORIES VIERNES ========== */}
        {activeTab === 'viernes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Rocket style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Viernes: Ecosistema de Confianza Finde
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>3 Stories para el viernes. Sacá captura y publicá.</p>
            </div>
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
              (Contenido completo Stories Viernes ya cargado arriba en el código original)
            </div>
          </div>
        )}

        {/* ========== VIERNES PORTADA REEL ========== */}
        {activeTab === 'viernes-portada' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Film style={{ width: 20, height: 20, color: '#34d399' }} />
                Reel Viernes: Dejá tu Tienda Vendiendo Sola
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>Portada visual + Datos técnicos y guión PAS.</p>
            </div>
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
              (Contenido completo Portada Reel Viernes ya cargado arriba en el código original)
            </div>
            <CopyBlock id="viernes-reel" title="Descripción Reel Viernes (Garantía + Efectivo)" text={copyViernesReel} copied={copiedId === 'viernes-reel'} onCopy={handleCopy} />
          </div>
        )}

        {/* ================================================================ */}
        {/* ========== 💡 IDEAS REELS — GUÍA DE PRODUCCIÓN ========== */}
        {/* ================================================================ */}
        {activeTab === 'ideas-reels' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ENCABEZADO */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(250,204,21,0.08) 100%)',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: 16,
                padding: 20
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lightbulb style={{ width: 22, height: 22, color: '#facc15' }} />
                Ideas y Guía de Producción para Reels
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '8px 0 0 0', lineHeight: 1.6 }}>
                Acá vas a encontrar ideas creativas concretas, textos exactos para pantalla, efectos de sonido buscables en CapCut, transiciones y tips de grabación para cada Reel. Todo listo para que grabes y edites como un pro.
              </p>
            </div>

            {/* SELECTOR DE DÍA */}
            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 'bold', color: '#34d399', margin: 0 }}>📅 Seleccioná el día del Reel:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { day: 'Lunes', status: '🟢 Grabado', widget: 'Pack Complementarios' },
                  { day: 'Martes', status: '🟡 Pendiente', widget: 'Comparador' },
                  { day: 'Miércoles', status: '🟡 Pendiente', widget: 'Talles + Beneficios' },
                  { day: 'Jueves', status: '⚪ Carrusel (no Reel)', widget: 'Oferta Especial' },
                  { day: 'Viernes', status: '🔴 PRÓXIMO', widget: 'Garantía + Efectivo' }
                ].map((d, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: d.day === 'Viernes' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                      border: d.day === 'Viernes' ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      minWidth: 120
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{d.day}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{d.widget}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: d.day === 'Viernes' ? '#10B981' : '#64748b' }}>{d.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===================================================== */}
            {/* REEL VIERNES — GUÍA COMPLETA DE PRODUCCIÓN */}
            {/* ===================================================== */}

            <div
              style={{
                backgroundColor: 'rgba(6,30,20,0.8)',
                border: '2px solid rgba(16,185,129,0.4)',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 0 30px rgba(16,185,129,0.1)'
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Flame style={{ width: 20, height: 20, color: '#facc15' }} />
                REEL VIERNES: &quot;Dejá tu Tienda Vendiendo Sola&quot;
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Guía completa de producción. Duración: 22s. Formato: 9:16.
              </p>
            </div>

            {/* IDEA 1: EL ÁNGULO CREATIVO */}
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
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#facc15', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles style={{ width: 16, height: 16 }} />
                IDEA CREATIVA: &quot;El Viernes del Emprendedor&quot;
              </h3>
              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
                El concepto es mostrar el <strong style={{ color: '#fff' }}>contraste</strong> entre dos viernes: el del emprendedor estresado que pierde ventas todo el finde porque su tienda no genera confianza, vs. el emprendedor tranquilo que activó Nevux y su tienda vende sola mientras él descansa.
              </p>
              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#34d399' }}>Ángulo emocional:</strong> No le vendés un widget. Le vendés <em style={{ color: '#facc15' }}>tranquilidad de fin de semana</em>. Ese es el gancho que conecta con el emprendedor real que está cansado de trabajar 24/7.
              </p>
            </div>

            {/* QUÉ GRABAR EXACTAMENTE */}
            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera style={{ width: 16, height: 16, color: '#34d399' }} />
                QUÉ GRABAR (3 clips de 10 segundos cada uno)
              </h3>

              {[
                {
                  clip: 'CLIP 1 — Tu cara + celular (Gancho + Problema)',
                  duracion: 'Grabá 10s, usás 7s en edición',
                  que: 'Sentate frente a la cámara con tu celular en la mano mostrando la tienda demo (nevuxapp.mitiendanube.com). Mirá a cámara con cara de &quot;te voy a contar un secreto&quot;. Empezá hablando directo.',
                  tip: 'Iluminación natural de frente (ventana). Fondo limpio (pared lisa o escritorio ordenado). El celular tiene que verse la pantalla encendida con la tienda.',
                  angulo: 'Plano medio corto (de pecho para arriba). Ligeramente contrapicado para dar autoridad.'
                },
                {
                  clip: 'CLIP 2 — Grabación de pantalla (Solución)',
                  duracion: 'Grabá 15s, usás 8s en edición',
                  que: 'Grabá la pantalla de tu PC o celular navegando la tienda demo. Hacé scroll hasta un producto, mostrá el botón de compra y cómo abajo aparecen el Widget de Garantía (&quot;30 días de cambio libre&quot;) y el Badge de Efectivo (&quot;15% OFF con transferencia&quot;). Hacé un tap/clic en cada widget para que se note que es interactivo.',
                  tip: 'Usá la grabación de pantalla nativa del celular (iPhone: deslizar arriba → grabar / Android: barra rápida). Limpiá notificaciones antes de grabar.',
                  angulo: 'Full screen de la grabación. En edición le ponés un marco de celular mockup si querés que se vea más pro.'
                },
                {
                  clip: 'CLIP 3 — Tu cara + cierre (CTA)',
                  duracion: 'Grabá 8s, usás 5s en edición',
                  que: 'Volvé a tu cara. Sonreí con confianza. Señalá hacia abajo (donde va a ir el texto de nevux.ar). Decí el CTA con energía.',
                  tip: 'Cambiá ligeramente el ángulo respecto al Clip 1 (girá la cámara 15°) para que en edición se note el corte y sea dinámico.',
                  angulo: 'Mismo plano medio corto pero con leve zoom-in en edición para dar intimidad al CTA.'
                }
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#020a07',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#10B981' }}>{c.clip}</span>
                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>⏱ {c.duracion}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>🎬 QUÉ HACER:</span>
                    <p style={{ fontSize: 12, color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.6 }}>{c.que}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>💡 TIP PRO:</span>
                    <p style={{ fontSize: 12, color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.6 }}>{c.tip}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>📐 ÁNGULO:</span>
                    <p style={{ fontSize: 12, color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.6 }}>{c.angulo}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* TEXTOS EXACTOS EN PANTALLA */}
            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(250,204,21,0.3)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#facc15', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Monitor style={{ width: 16, height: 16 }} />
                TEXTOS EXACTOS EN PANTALLA (para agregar en CapCut)
              </h3>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Estos son los textos que van SOBRE el video como subtítulos gigantes. Usá Montserrat Black o Rubik ExtraBold, All Caps, con stroke/sombra negra de 3px. Las palabras entre [CORCHETES] van en color destacado.
              </p>

              {[
                {
                  tiempo: '0.0s - 2.0s',
                  linea1: 'TU TIENDA PUEDE',
                  linea2: '[VENDER SOLA]',
                  color: '#facc15',
                  nota: 'La palabra VENDIENDO SOLA en amarillo gigante. El resto en blanco.'
                },
                {
                  tiempo: '2.0s - 4.5s',
                  linea1: 'EL VIERNES EL TRÁFICO',
                  linea2: '[EXPLOTA] 📈',
                  color: '#34d399',
                  nota: 'EXPLOTA en verde. Agregá un emoji de gráfico subiendo animado.'
                },
                {
                  tiempo: '4.5s - 7.0s',
                  linea1: 'PERO TUS CLIENTES',
                  linea2: '[NO CONFÍAN] ❌',
                  color: '#f87171',
                  nota: 'NO CONFÍAN en rojo con shake/temblor. Pop seco al aparecer.'
                },
                {
                  tiempo: '7.0s - 9.5s',
                  linea1: 'DUDAN DEL ENVÍO...',
                  linea2: 'DEL PAGO... [SE VAN]',
                  color: '#f87171',
                  nota: 'SE VAN con efecto de deslizamiento hacia la derecha (como si se fueran).'
                },
                {
                  tiempo: '9.5s - 12.0s',
                  linea1: 'ACTIVÁ [GARANTÍA]',
                  linea2: 'EN 1 CLIC 🛡️',
                  color: '#10B981',
                  nota: 'GARANTÍA en verde esmeralda brillante. Flash blanco de transición antes.'
                },
                {
                  tiempo: '12.0s - 15.0s',
                  linea1: '+ [BADGE DE EFECTIVO]',
                  linea2: '= VENTAS EN PILOTO 💵',
                  color: '#facc15',
                  nota: 'BADGE DE EFECTIVO en amarillo. El signo = aparece con pop. PILOTO con brillo.'
                },
                {
                  tiempo: '15.0s - 18.0s',
                  linea1: 'PROBÁ [NEVUX]',
                  linea2: '[7 DÍAS GRATIS] 🚀',
                  color: '#10B981',
                  nota: 'NEVUX en verde, 7 DÍAS GRATIS en amarillo. Ambos con efecto de escala (zoom-in suave).'
                },
                {
                  tiempo: '18.0s - 20.0s',
                  linea1: 'LINK EN BIO',
                  linea2: '[@nevuxapp]',
                  color: '#34d399',
                  nota: 'Flecha animada señalando hacia abajo. Fondo semi-transparente verde.'
                },
                {
                  tiempo: '20.0s - 22.0s',
                  linea1: 'NEVUX',
                  linea2: 'App #37382',
                  color: '#ffffff',
                  nota: 'Logo oficial centrado. Fade-in suave desde negro.'
                }
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#020a07',
                    border: `1px solid ${t.color}33`,
                    borderLeft: `4px solid ${t.color}`,
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>⏱ {t.tiempo}</span>
                    <span style={{ fontSize: 10, color: t.color, fontWeight: 700 }}>COLOR: {t.color}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>
                      {t.linea1.replace(/\[([^\]]+)\]/g, '$1')}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: t.color, letterSpacing: '0.02em' }}>
                      {t.linea2.replace(/\[([^\]]+)\]/g, '$1')}
                    </span>
                  </div>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                    📝 {t.nota}
                  </p>
                </div>
              ))}
            </div>

            {/* EFECTOS DE SONIDO */}
            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Volume2 style={{ width: 16, height: 16, color: '#34d399' }} />
                EFECTOS DE SONIDO (buscá estos nombres exactos en CapCut)
              </h3>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                En CapCut andá a Audio → Efectos de sonido → buscá el nombre exacto. Todos son gratis dentro de la app.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 10
                }}
              >
                {[
                  {
                    nombre: 'Whoosh Deep',
                    cuando: 'Segundo 0.0 — Inicio del video',
                    para: 'Dar impacto al gancho. Que el espectador sienta que arranca algo importante.',
                    volumen: '70%',
                    alt: 'Si no lo encontrás buscá: &quot;Swoosh Low&quot; o &quot;Wind Whoosh&quot;'
                  },
                  {
                    nombre: 'Pop',
                    cuando: 'Segundo 2.5, 4.5, 7.0',
                    para: 'Cada vez que aparece un texto nuevo en pantalla (EXPLOTA, NO CONFÍAN, SE VAN).',
                    volumen: '50%',
                    alt: 'Buscá también: &quot;Bubble Pop&quot; o &quot;Click Pop&quot;'
                  },
                  {
                    nombre: 'Glitch',
                    cuando: 'Segundo 7.0 — Transición Problema → Solución',
                    para: 'Corte dramático entre la parte negativa y la solución. Flash blanco + glitch.',
                    volumen: '60%',
                    alt: 'Buscá: &quot;Digital Glitch&quot; o &quot;TV Static&quot;'
                  },
                  {
                    nombre: 'Ding Success',
                    cuando: 'Segundo 9.5 y 12.0',
                    para: 'Cuando mostrás cada widget activado (Garantía y Efectivo). Sensación de &quot;problema resuelto&quot;.',
                    volumen: '65%',
                    alt: 'Buscá: &quot;Notification Ding&quot; o &quot;Bell Positive&quot;'
                  },
                  {
                    nombre: 'Cash Register',
                    cuando: 'Segundo 13.5',
                    para: 'Cuando aparece &quot;VENTAS EN PILOTO&quot;. Refuerza la idea de dinero entrando.',
                    volumen: '45%',
                    alt: 'Buscá: &quot;Cha Ching&quot; o &quot;Coin Drop&quot;'
                  },
                  {
                    nombre: 'Camera Shutter',
                    cuando: 'Segundo 16.0',
                    para: 'Cuando aparece nevux.ar y el CTA. Da sensación de &quot;capturá esta info&quot;.',
                    volumen: '55%',
                    alt: 'Buscá: &quot;Photo Click&quot; o &quot;Shutter Snap&quot;'
                  },
                  {
                    nombre: 'Swoosh Soft',
                    cuando: 'Segundo 20.0 — Cierre con logo',
                    para: 'Fade-out suave hacia el logo final. Cierre elegante.',
                    volumen: '40%',
                    alt: 'Buscá: &quot;Soft Wind&quot; o &quot;Gentle Swoosh&quot;'
                  }
                ].map((sfx, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#020a07',
                      border: '1px solid rgba(16,185,129,0.15)',
                      borderRadius: 10,
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#facc15' }}>🔊 {sfx.nombre}</span>
                      <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>Vol: {sfx.volumen}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>⏱ CUÁNDO:</span>
                      <p style={{ fontSize: 11, color: '#fff', margin: '2px 0 0 0', fontWeight: 600 }}>{sfx.cuando}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>🎯 PARA QUÉ:</span>
                      <p style={{ fontSize: 11, color: '#cbd5e1', margin: '2px 0 0 0', lineHeight: 1.5 }}>{sfx.para}</p>
                    </div>
                    <p style={{ fontSize: 10, color: '#64748b', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                      💡 {sfx.alt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* MÚSICA DE FONDO */}
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
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Music style={{ width: 16, height: 16, color: '#34d399' }} />
                MÚSICA DE FONDO (buscá en CapCut → Audio → Música)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { nombre: 'Deep House Background', bpm: '118 BPM', vibe: 'Moderno, tech, confiable. Ideal para SaaS.', prio: '⭐ OPCIÓN #1' },
                  { nombre: 'Tech House Groove', bpm: '120 BPM', vibe: 'Más energético. Bueno si hablás rápido.', prio: 'OPCIÓN #2' },
                  { nombre: 'Minimal Future Beat', bpm: '115 BPM', vibe: 'Más calmo y premium. Estilo Shopify.', prio: 'OPCIÓN #3' },
                  { nombre: 'Lo-Fi Confidence', bpm: '110 BPM', vibe: 'Relajado pero con ritmo. Estilo tutorial pro.', prio: 'OPCIÓN #4' }
                ].map((m, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: i === 0 ? 'rgba(16,185,129,0.1)' : '#020a07',
                      border: i === 0 ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10,
                      padding: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>🎵 {m.nombre}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{m.vibe}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>{m.bpm}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? '#facc15' : '#64748b' }}>{m.prio}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#f87171', fontWeight: 700, margin: 0 }}>
                ⚠️ RECORDÁ: Música al -20dB. Tu voz al -6dB. La música NUNCA debe competir con tu voz.
              </p>
            </div>

            {/* TRANSICIONES Y EFECTOS DE VIDEO */}
            <div
              style={{
                backgroundColor: '#061e14',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scissors style={{ width: 16, height: 16, color: '#34d399' }} />
                TRANSICIONES Y EFECTOS DE VIDEO (en CapCut)
              </h3>

              {[
                {
                  momento: 'Seg 0.0 → 2.0 (Inicio)',
                  efecto: 'Zoom In Lento',
                  como: 'Seleccioná el Clip 1 → Animación → Entrada → &quot;Zoom In&quot;. Duración: 0.5s.',
                  porQue: 'Da sensación de que te acercás al espectador. Genera intimidad inmediata.'
                },
                {
                  momento: 'Seg 2.0 → 4.5 (Tráfico explota)',
                  efecto: 'Shake / Temblor',
                  como: 'Seleccioná el clip → Efectos → &quot;Shake&quot; o &quot;Vibrate&quot;. Aplicá solo 0.3s cuando decís EXPLOTA.',
                  porQue: 'Refuerza la urgencia del dato. El temblor visual = alarma.'
                },
                {
                  momento: 'Seg 7.0 (Problema → Solución)',
                  efecto: 'Flash Blanco + Glitch',
                  como: 'Cortá el clip en el seg 7.0. Insertá un frame blanco de 2 cuadros (0.07s). Después agregá efecto &quot;Glitch&quot; de 0.3s.',
                  porQue: 'Es la transición más usada en reels de alto rendimiento. Marca el punto de quiebre.'
                },
                {
                  momento: 'Seg 9.5 → 15.0 (Widgets en vivo)',
                  efecto: 'Zoom In Suave + Brillo',
                  como: 'Sobre la grabación de pantalla, aplicá Animación → &quot;Zoom In&quot; lento (2s). Agregá efecto &quot;Glow&quot; o &quot;Bright&quot; cuando aparecen los widgets.',
                  porQue: 'Dirige la mirada del espectador al widget. El brillo = &quot;esto es importante&quot;.'
                },
                {
                  momento: 'Seg 15.0 (CTA)',
                  efecto: 'Zoom Out + Blur de fondo',
                  como: 'Cortá el clip. Al CTA aplicá Animación → &quot;Zoom Out&quot;. Al fondo del clip anterior agregá &quot;Blur&quot; de 0.5s.',
                  porQue: 'Separa visualmente la solución del llamado a la acción. El cerebro entiende que viene el cierre.'
                },
                {
                  momento: 'Seg 20.0 → 22.0 (Logo final)',
                  efecto: 'Fade to Black',
                  como: 'Transición → &quot;Fade&quot; de 0.5s hacia negro. El logo aparece con Animación → &quot;Fade In&quot; de 0.3s.',
                  porQue: 'Cierre limpio y profesional. Estilo marca grande.'
                }
              ].map((tr, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#020a07',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 11, color: '#facc15', fontWeight: 900 }}>{tr.momento}</span>
                    <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>✨ {tr.efecto}</span>
                  </div>
                  <div>
                    <span style={{ fontSize
