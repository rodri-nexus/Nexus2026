'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Gift,
  Rocket,
  Flame,
  Scale,
  Ruler,
  Copy,
  Check,
  Film,
  Clock,
  Music,
  Mic,
  Lightbulb,
  Monitor,
  Volume2,
  Scissors,
  Camera,
  Sparkles
} from 'lucide-react';

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
            { id: 'lunes', label: '📊 Lunes (Packs)' },
            { id: 'martes', label: '🧠 Martes (Comparador)' },
            { id: 'miercoles', label: '📏 Miércoles (Talles)' },
            { id: 'jueves', label: '⏱️ Stories Jueves' },
            { id: 'jueves-portada', label: '🎠 Carrusel Jueves' },
            { id: 'viernes', label: '🛡️ Stories Viernes' },
            { id: 'viernes-portada', label: '🎬 Portada Reel Viernes' },
            { id: 'ideas-reels', label: '💡 Ideas Reels (CapCut)' }
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
                Lunes: Pack Complementarios (Stories + Portada)
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Stories para publicar y la portada oficial 9:16 para el feed de tu Reel de hoy.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
              {/* STORY 1 */}
              <div style={{ width: '100%', maxWidth: 360, aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <NevuxLogo size={28} />
                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    ¿Cuánto es el <span style={{ color: '#10B981' }}>Ticket Promedio</span> en tu Tiendanube?
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    De cada 100 personas que te compran, ¿cuánto dinero deja en promedio cada cliente?
                  </p>
                  <div style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['A) $5.000 - $10.000 💸', 'B) $10.000 - $25.000 📦', 'C) Más de $25.000 🚀', 'D) No lo tengo medido 🤯'].map((opt, i) => (
                      <div key={i} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 'bold', color: '#1e293b' }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 12 }}>
                  <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>Poné el sticker de encuesta interactivo arriba 👆</p>
                </div>
              </div>

              {/* STORY 2 */}
              <div style={{ width: '100%', maxWidth: 360, aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <NevuxLogo size={28} />
                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    El error #1 que <span style={{ color: '#f87171' }}>estanca las ventas</span> de tu tienda
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    Dejar que el cliente compre 1 solo producto cuando por un extra mínimo se llevaría el combo completo.
                  </p>
                  <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16,185,129,0.3)', padding: 16, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Gift style={{ width: 16, height: 16 }} /> PACK COMPLEMENTARIOS
                    </div>
                    <div style={{ backgroundColor: '#10B981', color: '#020a07', fontWeight: 900, fontSize: 12, padding: 10, borderRadius: 10, marginTop: 10 }}>
                      ▶ VER REEL EN EL FEED
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Tocá para ir directo a ver el Reel 👇</p>
                </div>
              </div>

              {/* PORTADA REEL LUNES 9:16 */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.4)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(16,185,129,0.1) 0%, transparent 70%)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={28} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', letterSpacing: '0.05em' }}>PORTADA LUNES</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', margin: '0 auto', backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '6px 12px', fontSize: 11, fontWeight: 900, color: '#34d399', width: 'fit-content' }}>
                    📦 TICKET PROMEDIO
                  </div>

                  <h3 style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    SUBÍ EL TICKET PROMEDIO <span style={{ color: '#fbbf24' }}>SIN GASTAR</span> EN PAUTA
                  </h3>

                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.4, margin: '4px 0 0 0' }}>
                    El error #1 que frena las ganancias de tu Tiendanube y cómo solucionarlo en 15 segundos.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, backgroundColor: '#061e14', padding: 14, borderRadius: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#34d399', fontSize: 14 }}>📦</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Pack Complementarios</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#34d399', fontSize: 14 }}>📈</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Combos Automáticos</span>
                  </div>
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
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 360, aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <NevuxLogo size={28} />
                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    ¿Alguna vez compraste algo online y te llegó <span style={{ color: '#facc15' }}>distinto</span> a la foto?
                  </h3>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '2px solid #f87171', borderRadius: 12, padding: 14, textAlign: 'center', fontWeight: 900, color: '#1e293b' }}>😩 SÍ</div>
                    <div style={{ flex: 1, backgroundColor: '#f0fdf4', border: '2px solid #10B981', borderRadius: 12, padding: 14, textAlign: 'center', fontWeight: 900, color: '#1e293b' }}>😌 NO</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}><p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Sticker de encuesta arriba 👆</p></div>
              </div>
            </div>
            <CopyBlock id="martes-carrusel" title="Descripción Carrusel Martes" text={copyMartesCarrusel} copied={copiedId === 'martes-carrusel'} onCopy={handleCopy} />
          </div>
        )}

        {/* ========== MIÉRCOLES ========== */}
        {activeTab === 'miercoles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ruler style={{ width: 20, height: 20, color: '#34d399' }} />
                Miércoles: Tabla de Talles + Beneficios (Stories + Portada)
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0 0' }}>
                Historias visuales listas y la portada 9:16 exclusiva para frenar las devoluciones en tu Tiendanube.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
              {/* STORY 1 */}
              <div style={{ width: '100%', maxWidth: 360, aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <NevuxLogo size={28} />
                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#f87171' }}>⚠️ DOLOR REAL</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    ¿Cuántas <span style={{ color: '#f87171' }}>devoluciones</span> tenés al mes por talles mal elegidos?
                  </h3>
                  <div style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['A) 0 - 2 devoluciones 😌', 'B) 3 - 10 devoluciones 😬', 'C) Más de 10 😱', 'D) Perdí la cuenta 🤯'].map((opt, i) => (
                      <div key={i} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 'bold', color: '#1e293b' }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}><p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Sticker de encuesta arriba 👆</p></div>
              </div>

              {/* PORTADA REEL MIÉRCOLES 9:16 */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(239,68,68,0.4)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(239,68,68,0.1) 0%, transparent 70%)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={28} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.05em' }}>PORTADA MIÉRCOLES</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', margin: '0 auto', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '6px 12px', fontSize: 11, fontWeight: 900, color: '#f87171', width: 'fit-content' }}>
                    📏 EVITÁ DEVOLUCIONES
                  </div>

                  <h3 style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    LA DEVOLUCIÓN <span style={{ color: '#fbbf24' }}>MÁS CARA</span> DE TU TIENDA
                  </h3>

                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.4, margin: '4px 0 0 0' }}>
                    No dejes que los problemas de talles destruyan tus ganancias mensuales.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, backgroundColor: '#061e14', padding: 14, borderRadius: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#34d399', fontSize: 14 }}>📏</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Tabla de Talles</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#34d399', fontSize: 14 }}>⭐</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Widget de Beneficios</span>
                  </div>
                </div>
              </div>
            </div>

            <CopyBlock id="miercoles-reel" title="Descripción Reel Miércoles (Tabla de Talles)" text={copyMiercolesReel} copied={copiedId === 'miercoles-reel'} onCopy={handleCopy} />
          </div>
        )}

        {/* ========== JUEVES ========== */}
        {activeTab === 'jueves' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock style={{ width: 20, height: 20, color: '#34d399' }} />
                Stories Jueves: Urgencia y Ventas Rápidas
              </h2>
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
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
              {/* STORY 1 */}
              <div style={{ width: '100%', maxWidth: 360, aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <NevuxLogo size={28} />
                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#f87171' }}>🚨 ALERTA FIN DE SEMANA</div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: 0 }}>
                    El <span style={{ color: '#f87171' }}>68%</span> de las ventas se definen el finde
                  </h3>
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    El tráfico explota. ¿Tu tienda está lista para convencer y vender sola?
                  </p>
                  <div style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #10b981', borderRadius: 8, padding: 8, textAlign: 'center', color: '#1e293b', fontWeight: 900, fontSize: 12 }}>✅ SÍ, LISTA</div>
                    <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #f87171', borderRadius: 8, padding: 8, textAlign: 'center', color: '#1e293b', fontWeight: 900, fontSize: 12 }}>❌ ME FALTA</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}><p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Encuesta interactiva arriba 👆</p></div>
              </div>

              {/* STORY 2 */}
              <div style={{ width: '100%', maxWidth: 360, aspectRatio: '9/16', backgroundColor: '#020a07', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <NevuxLogo size={28} />
                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#34d399' }}>💡 SOLUCIÓN RÁPIDA</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                    2 widgets = <span style={{ color: '#34d399' }}>Cero dudas</span> al pagar
                  </h3>
                  <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#34d399' }}>🛡️ Mensaje de Garantía</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#facc15' }}>💵 Badge de Efectivo / Transferencia</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: '#10B981', borderRadius: 12, padding: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 900, color: '#020a07', margin: 0 }}>🔗 ACTIVAR EN MI TIENDA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== PORTADA REEL VIERNES ========== */}
        {activeTab === 'viernes-portada' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ backgroundColor: 'rgba(6,30,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Film style={{ width: 20, height: 20, color: '#34d399' }} />
                Reel Viernes: Dejá tu Tienda Vendiendo Sola
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {[
                { icon: <Clock style={{ width: 18, height: 18 }} />, label: 'Duración', value: '22 segundos' },
                { icon: <Film style={{ width: 18, height: 18 }} />, label: 'Formato', value: '9:16 · 1080x1920' },
                { icon: <Music style={{ width: 18, height: 18 }} />, label: 'Música', value: 'Deep House 118 BPM' },
                { icon: <Mic style={{ width: 18, height: 18 }} />, label: 'Audio', value: 'Voz off -6dB / Música -20dB' }
              ].map((item, i) => (
                <div key={i} style={{ backgroundColor: '#061e14', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399' }}>
                    {item.icon}
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 4, display: 'block' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* PORTADA REEL VIERNES EXTRANET PREVIEW */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '9/16',
                  backgroundColor: '#020a07',
                  border: '2px solid rgba(16,185,129,0.4)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(16,185,129,0.1) 0%, transparent 70%)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <NevuxLogo size={28} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', letterSpacing: '0.05em' }}>PORTADA VIERNES</span>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', margin: '0 auto', backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '6px 12px', fontSize: 11, fontWeight: 900, color: '#34d399', width: 'fit-content' }}>
                    🚀 TRUCO DE FINDE
                  </div>

                  <h3 style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    DEJÁ TU TIENDA <span style={{ color: '#fbbf24' }}>VENDIENDO SOLA</span> ESTE FINDE
                  </h3>

                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.4, margin: '4px 0 0 0' }}>
                    Activá estos 2 widgets de confianza en 2 minutos y cerrá ventas en piloto automático.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, backgroundColor: '#061e14', padding: 14, borderRadius: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#34d399', fontSize: 14 }}>🛡️</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Garantía Visible</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#34d399', fontSize: 14 }}>💵</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Descuento Efectivo/Transfe</span>
                  </div>
                </div>
              </div>
            </div>

            <CopyBlock
              id="viernes-reel"
              title="Descripción Reel Viernes (Garantía + Efectivo)"
              text={copyViernesReel}
              copied={copiedId === 'viernes-reel'}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* ================================================================ */}
        {/* ========== 💡 IDEAS REELS — GUÍA DE PRODUCCIÓN ========== */}
        {/* ================================================================ */}
        {activeTab === 'ideas-reels' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                Guía de Producción Profesional (CapCut / Grabación)
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '8px 0 0 0', lineHeight: 1.6 }}>
                Acá tenés todo el detalle técnico para grabar y editar el Reel de Viernes con nivel top.
              </p>
            </div>

            {/* QUÉ GRABAR */}
            <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera style={{ width: 16, height: 16, color: '#34d399' }} />
                1. QUÉ GRABAR (Solo 3 tomas con tu celular)
              </h3>
              {[
                {
                  toma: 'TOMA 1 (0-7s) — Frente a cámara',
                  desc: 'Vos con el celular en la mano mostrando la tienda demo abierta. Mirá a cámara con energía. Decí el gancho y el problema.',
                  tip: 'Buena luz de frente, fondo ordenado, plano pecho para arriba.'
                },
                {
                  toma: 'TOMA 2 (7-15s) — Grabación de pantalla',
                  desc: 'Grabá la pantalla de tu tienda demo (nevuxapp.mitiendanube.com). Hacé scroll hasta ver el Mensaje de Garantía y el Badge de Efectivo funcionando.',
                  tip: 'Hacé un toque en cada widget para que se note que es 100% interactivo y real.'
                },
                {
                  toma: 'TOMA 3 (15-22s) — Cierre y CTA',
                  desc: 'Volvés a cámara. Sonreí y señalá abajo indicando el link de nevux.ar.',
                  tip: 'Girá 10 grados el cuerpo para que el corte entre toma 2 y 3 sea súper dinámico.'
                }
              ].map((c, i) => (
                <div key={i} style={{ backgroundColor: '#020a07', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#10B981' }}>{c.toma}</span>
                  <p style={{ fontSize: 12, color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.5 }}>{c.desc}</p>
                  <span style={{ fontSize: 10, color: '#facc15', marginTop: 4, display: 'block' }}>💡 {c.tip}</span>
                </div>
              ))}
            </div>

            {/* TEXTOS Y SFX */}
            <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(250,204,21,0.3)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#facc15', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Volume2 style={{ width: 16, height: 16 }} />
                2. EFECTOS DE SONIDO Y TEXTOS (CapCut)
              </h3>
              {[
                { sfx: 'Whoosh Deep', seg: 'Seg 0.0', text: 'TIENDA ONLINE EN AUTOMÁTICO', col: '#facc15' },
                { sfx: 'Pop / Click', seg: 'Seg 4.0', text: '❌ CARassistantRITOS ABANDONADOS', col: '#f87171' },
                { sfx: 'Glitch + Flash', seg: 'Seg 7.0', text: '🛡️ WIDGETS DE CONFIANZA', col: '#34d399' },
                { sfx: 'Ding Success', seg: 'Seg 12.0', text: '💵 BADGE DE EFECTIVO', col: '#10B981' },
                { sfx: 'Camera Shutter', seg: 'Seg 16.0', text: '🚀 PROBÁ 7 DÍAS GRATIS', col: '#facc15' }
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: '#020a07', borderLeft: `4px solid ${s.col}`, borderRadius: 8, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{s.seg} — </span>
                    <strong style={{ fontSize: 12, color: '#fff' }}>SFX: &quot;{s.sfx}&quot;</strong>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: s.col }}>{s.text}</span>
                </div>
              ))}
            </div>

            {/* MÚSICA */}
            <div style={{ backgroundColor: '#061e14', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Music style={{ width: 16, height: 16, color: '#34d399' }} />
                3. AJUSTE DE VOLUMEN (Regla de Oro)
              </h3>
              <p style={{ fontSize: 12, color: '#cbd5e1', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                • <strong style={{ color: '#34d399' }}>Voz principal:</strong> -6 dB (clara y protagonista)<br />
                • <strong style={{ color: '#facc15' }}>Música Tech House:</strong> -20 dB (suave de fondo, nunca tapa la voz)<br />
                • <strong style={{ color: '#fff' }}>Efectos de sonido (SFX):</strong> -10 dB a -12 dB
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
