'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BannerAdminPage() {
  const [activeTab, setActiveTab] = useState<
    | 'lunes'
    | 'martes'
    | 'miercoles'
    | 'jueves'
    | 'jueves-portada'
    | 'viernes'
    | 'viernes-portada'
    | 'ideas-reels'
  >('lunes');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // --- TEXTOS EXACTOS DE COPYWRITING (PAS FORMULA) ---
  const copyLunesReel = `El error que te está costando un 20% más por pedido en Tiendanube 👇

La mayoría de las tiendas intentan facturar más metiendo más plata en Meta Ads.
Pero cuando el cliente ya tiene la tarjeta en la mano para pagar... nadie le ofrece nada más.

Mirá la diferencia:
❌ Sin Nevux: El cliente compra 1 producto, paga el envío y se va. Ticket: $35.000.
✅ Con Nevux: Antes de cerrar, la tienda le ofrece un complemento clave con 15% OFF en 1 solo clic. Ticket: $48.500.

Mismo costo publicitario. +38% de ganancia neta en la misma compra.

Lo mejor: se instala en 60 segundos desde la Tienda de Aplicaciones de Tiendanube.

🚀 Probá Nevux 7 días GRATIS en tu tienda con el link de nuestra bio o buscá "Nevux" en Tiendanube.

#tiendanube #ecommerceargentina #aumentarticketpromedio #crossselling #ventasonline #emprendedoresargentina`;

  const copyMartesCarrusel = `¿Tu tienda parece del 2018 o una máquina de conversión del 2025? 📊

Deslizá para ver la diferencia real entre una tienda que pierde ventas en el checkout y una que multiplica su ticket promedio en automático.

👉 Diapositiva 2: El carrito abandonado vs. El carrito inteligente
👉 Diapositiva 3: Promociones invisibles vs. Ofertas de 1 solo clic
👉 Diapositiva 4: Instalación manual con código vs. Activación en 60 segundos con Nevux

Instalá Nevux hoy en Tiendanube y activá 7 días de prueba gratis. Link en bio 🔗`;

  const copyMiercolesReel = `La devolución más cara de tu tienda no es la que te pide el cliente... es la venta que nunca ocurrió por falta de soporte instantáneo 💬

Un cliente tiene una duda sobre su talle o el método de envío a las 23:30 hs.
Si no le respondés en el momento: cierra la pestaña y le compra a tu competencia.

Con el Asistente IA de Nevux integrado a tu catálogo de Tiendanube:
⚡ Respuestas instantáneas 24/7 sobre stock real y medidas
⚡ Recomienda productos complementarios
⚡ Cierra la venta mientras dormís

Instalalo hoy con 7 días gratis. Link en bio 📲`;

  const copyJuevesCarrusel = `⚠️ ALERTA: Si estás esperando al Hot Sale o Cyber Monday para optimizar tu checkout, ya vas tarde.

Los 3 ajustes que tenés que activar HOY en tu Tiendanube:
1️⃣ Cross-selling en el carrito (complementos automáticos)
2️⃣ Barra de progreso para Envío Gratis
3️⃣ Ofertas post-compra de 1 solo clic

Con Nevux activás los 3 en menos de 2 minutos sin tocar una sola línea de código.

👉 Probá los 7 días gratis desde el enlace en nuestro perfil.`;

  const copyViernesReel = `Dejá tu tienda vendiendo sola y multiplicando el ticket promedio este fin de semana 🚀

Viernes a la tarde: configurás tu oferta de Cross-selling en el panel de Nevux.
Sábado y Domingo: cada cliente que entra a tu Tiendanube ve complementos irresistibles en 1 clic.
Lunes a la mañana: abrís tus métricas y ves un +25% de facturación con el mismo tráfico.

Sin saber programar.
100% integrado a Tiendanube.
7 días de prueba sin cargo.

Instalá Nevux en tu tienda hoy mismo desde el link de la bio 📲`;

  return (
    <div
      style={{
        backgroundColor: '#020A07',
        color: '#FFFFFF',
        minHeight: '100vh',
        padding: '24px 16px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER PRINCIPAL */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto 32px auto',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          paddingBottom: '24px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'inline-block',
              }}
            ></span>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                letterSpacing: '1.5px',
                color: '#34D399',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              Nevux Brand &amp; Marketing Hub
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            Panel de Contenido &amp; Miniaturas
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Templates visuales 9:16 y copys de alta conversión listos para publicar.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            style={{
              padding: '10px 18px',
              backgroundColor: '#0F172A',
              color: '#CBD5E1',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            ← Volver a la Tienda
          </Link>
          <a
            href="https://nevuxapp.mitiendanube.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 18px',
              backgroundColor: '#10B981',
              color: '#000000',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            }}
          >
            Ver Sandbox Tiendanube ↗
          </a>
        </div>
      </div>

      {/* TABS DE SELECCIÓN DE DÍAS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 32px auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('lunes')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'lunes' ? '#10B981' : '#0F172A',
              color: activeTab === 'lunes' ? '#000000' : '#94A3B8',
              border: activeTab === 'lunes' ? '1px solid #34D399' : '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Lunes (Stories &amp; Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('martes')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'martes' ? '#10B981' : '#0F172A',
              color: activeTab === 'martes' ? '#000000' : '#94A3B8',
              border: activeTab === 'martes' ? '1px solid #34D399' : '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Martes (Stories &amp; Comparativa)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('miercoles')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'miercoles' ? '#10B981' : '#0F172A',
              color: activeTab === 'miercoles' ? '#000000' : '#94A3B8',
              border: activeTab === 'miercoles' ? '1px solid #34D399' : '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Miércoles (Stories &amp; Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jueves')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'jueves' ? '#10B981' : '#0F172A',
              color: activeTab === 'jueves' ? '#000000' : '#94A3B8',
              border: activeTab === 'jueves' ? '1px solid #34D399' : '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Jueves (Stories Tip)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jueves-portada')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'jueves-portada' ? '#10B981' : '#0F172A',
              color: activeTab === 'jueves-portada' ? '#000000' : '#94A3B8',
              border: activeTab === 'jueves-portada' ? '1px solid #34D399' : '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Jueves (Carrusel Urgencia)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('viernes')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'viernes' ? '#10B981' : '#0F172A',
              color: activeTab === 'viernes' ? '#000000' : '#94A3B8',
              border: activeTab === 'viernes' ? '1px solid #34D399' : '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Viernes (Stories Garantía)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('viernes-portada')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'viernes-portada' ? '#10B981' : '#0F172A',
              color: activeTab === 'viernes-portada' ? '#000000' : '#94A3B8',
              border: activeTab === 'viernes-portada' ? '1px solid #34D399' : '1px solid #1E293B',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Viernes (Miniatura Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ideas-reels')}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === 'ideas-reels' ? '#FACC15' : 'rgba(245, 158, 11, 0.15)',
              color: activeTab === 'ideas-reels' ? '#000000' : '#FDE047',
              border: activeTab === 'ideas-reels' ? '1px solid #FDE047' : '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            💡 Ideas Reels (CapCut Playbook)
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL EN DOS COLUMNAS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* ==================== LUNES ==================== */}
        {activeTab === 'lunes' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '32px',
              alignItems: 'flex-start',
            }}
          >
            {/* MINIATURA 9:16 */}
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#34D399',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}
              >
                Miniatura 9:16 (Reel / TikTok)
              </span>

              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '28px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#6EE7B7',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '20px',
                      fontSize: '9px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    📈 CRECIMIENTO • TICKET PROMEDIO
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 8px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: '12px',
                      border: '1px solid #1E293B',
                    }}
                  >
                    <span
                      style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}
                    ></span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#CBD5E1' }}>Nevux</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: 'rgba(244, 63, 94, 0.2)',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      color: '#FB7185',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                    }}
                  >
                    ⚠️ Error Costoso en Tiendanube
                  </div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: '900',
                      lineHeight: '1.25',
                      color: '#FFFFFF',
                      margin: '0 0 12px 0',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    SUBÍ EL{' '}
                    <span
                      style={{
                        color: '#34D399',
                        textDecoration: 'underline',
                        textDecorationColor: '#10B981',
                      }}
                    >
                      TICKET PROMEDIO
                    </span>{' '}
                    SIN GASTAR EN PAUTA
                  </h2>
                  <p style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.5', margin: '0', padding: '0 8px' }}>
                    Cómo sumar productos complementarios en 1 clic y facturar hasta un 38% más por cada cliente.
                  </p>
                </div>

                {/* Bottom Card Mockup */}
                <div
                  style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.95)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#E2E8F0',
                      borderBottom: '1px solid #1E293B',
                      paddingBottom: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span>Cross-selling Activo</span>
                    <span style={{ color: '#34D399', fontFamily: 'monospace', fontWeight: '900' }}>
                      +38% Ganancia
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span style={{ color: '#94A3B8' }}>Instalación: 60 seg</span>
                    <span style={{ color: '#FACC15', fontWeight: 'bold' }}>7 Días Gratis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COPYRIGHTING */}
            <div style={{ flex: '2 1 480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #1E293B',
                  borderRadius: '20px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 4px 0' }}>
                      Copy Completo para Reel / TikTok
                    </h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0' }}>
                      Fórmula PAS (Problema - Agitación - Solución).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyLunesReel, 'copy-lunes')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10B981',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId === 'copy-lunes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>

                <textarea
                  readOnly
                  value={copyLunesReel}
                  rows={13}
                  style={{
                    width: '100%',
                    backgroundColor: '#020617',
                    border: '1px solid #1E293B',
                    borderRadius: '14px',
                    padding: '16px',
                    color: '#CBD5E1',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    lineHeight: '1.6',
                    resize: 'none',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(6, 78, 59, 0.6)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <h4
                  style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#34D399',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: '0 0 8px 0',
                  }}
                >
                  🎬 Guión de Grabación Recomendado (15 seg)
                </h4>
                <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.6', margin: '0' }}>
                  <strong>00:00 - 00:03:</strong> Grabá la pantalla del carrito simple y decí: <em>&quot;Si seguís vendiendo así, estás regalando un 20% por pedido&quot;</em>.<br />
                  <strong>00:03 - 00:08:</strong> Mostrá cómo Nevux despliega la oferta en 1 clic.<br />
                  <strong>00:08 - 00:15:</strong> Mostrá el panel con métricas positivas y llamá a probar los 7 días gratis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MARTES ==================== */}
        {activeTab === 'martes' && (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>
                Placa Comparativa 1:1 (Post / Carrusel)
              </span>
              <div
                style={{
                  width: '320px',
                  height: '320px',
                  backgroundColor: '#020A07',
                  border: '2px solid #1E293B',
                  borderRadius: '24px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase' }}>¿CÓMO CONVIERTE TU TIENDA?</span>
                  <span style={{ backgroundColor: '#022C22', color: '#34D399', border: '1px solid #064E3B', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>Nevux 2025</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: 'auto 0' }}>
                  <div style={{ backgroundColor: 'rgba(136, 19, 55, 0.3)', border: '1px solid rgba(159, 18, 57, 0.4)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <span style={{ color: '#FB7185', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>❌ Sin Nevux</span>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#FFFFFF', margin: '0 0 4px 0' }}>1 Producto por compra</p>
                    <p style={{ fontSize: '10px', color: '#94A3B8', margin: '0' }}>Ticket: $35.000</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(6, 78, 59, 0.4)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <span style={{ color: '#34D399', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>✅ Con Nevux</span>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#FFFFFF', margin: '0 0 4px 0' }}>Cross-selling en 1 clic</p>
                    <p style={{ fontSize: '10px', color: '#6EE7B7', fontWeight: 'bold', fontFamily: 'monospace', margin: '0' }}>Ticket: $48.500</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#E2E8F0', margin: '0' }}>Instalación en 60 seg • 7 Días Gratis</p>
                </div>
              </div>
            </div>

            <div style={{ flex: '2 1 480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 4px 0' }}>Copy para Carrusel Comparativo</h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0' }}>Ideal para generar debate e interacciones.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyMartesCarrusel, 'copy-martes')}
                    style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {copiedId === 'copy-martes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyMartesCarrusel}
                  rows={10}
                  style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '14px', padding: '16px', color: '#CBD5E1', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6', resize: 'none', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== MIÉRCOLES ==================== */}
        {activeTab === 'miercoles' && (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>
                Miniatura 9:16 (Reel / TikTok)
              </span>

              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage: 'radial-gradient(circle at 50% 25%, rgba(244, 63, 94, 0.2) 0%, transparent 70%)',
                  border: '2px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: '28px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ padding: '4px 10px', backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#FDA4AF', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '20px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>
                    ⚠️ CONTROL DE COSTOS • CX
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 8px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '12px', border: '1px solid #1E293B' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#CBD5E1' }}>Nevux IA</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <div style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#FDE047', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>
                    🚨 Fuga Silenciosa de Ventas
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '900', lineHeight: '1.25', color: '#FFFFFF', margin: '0 0 12px 0' }}>
                    LA DEVOLUCIÓN <span style={{ color: '#FB7185', textDecoration: 'underline', textDecorationColor: '#F43F5E' }}>MÁS CARA</span> DE TU TIENDA
                  </h2>
                  <p style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.5', margin: '0', padding: '0 8px' }}>
                    El 67% de los carritos se caen por dudas de talle, stock o envío a deshoras.
                  </p>
                </div>

                <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid #1E293B', borderRadius: '16px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 'bold', color: '#E2E8F0', borderBottom: '1px solid #1E293B', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span>Asistente IA 24/7</span>
                    <span style={{ color: '#34D399', fontFamily: 'monospace', fontWeight: '900' }}>0 Carritos Caídos</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span style={{ color: '#94A3B8' }}>Responde en 2 segundos</span>
                    <span style={{ color: '#6EE7B7', fontWeight: 'bold' }}>Instalación Fácil</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '2 1 480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 4px 0' }}>Copy para Reel de Soporte &amp; IA</h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0' }}>Enfocado en resolver la pérdida de ventas fuera de horario.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyMiercolesReel, 'copy-miercoles')}
                    style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {copiedId === 'copy-miercoles' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyMiercolesReel}
                  rows={12}
                  style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '14px', padding: '16px', color: '#CBD5E1', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6', resize: 'none', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== JUEVES ==================== */}
        {activeTab === 'jueves' && (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Story Interactiva (9:16)</span>
              <div style={{ width: '300px', height: '533px', backgroundColor: '#020A07', border: '2px solid #1E293B', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FDE047', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '20px', padding: '4px 12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>💡 TIP ECOMMERCE</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', margin: '0' }}>¿Cuánta plata dejás en la mesa sin una barra de Envío Gratis?</h3>
                </div>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: '600', margin: '0' }}>El 80% de los clientes prefiere agregar un producto más antes que pagar el envío.</p>
                  <div style={{ backgroundColor: '#1E293B', height: '10px', borderRadius: '10px', overflow: 'hidden', padding: '2px' }}>
                    <div style={{ backgroundColor: '#10B981', height: '100%', borderRadius: '10px', width: '80%' }}></div>
                  </div>
                  <span style={{ color: '#34D399', fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace' }}>¡Faltan $4.500 para tu ENVÍO GRATIS!</span>
                </div>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '10px' }}>
                  <span style={{ color: '#6EE7B7', fontSize: '12px', fontWeight: 'bold' }}>Activalo con Nevux en 1 clic 📲</span>
                </div>
              </div>
            </div>
            <div style={{ flex: '2 1 480px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 8px 0' }}>Estrategia de Stickers para Instagram Stories</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0' }}>Usá el sticker de <strong>Encuesta</strong> en Instagram Stories para elevar la interacción.</p>
                <div style={{ backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '12px', margin: '0 0 8px 0' }}>Pregunta recomendada:</p>
                  <p style={{ color: '#6EE7B7', fontSize: '12px', fontStyle: 'italic', margin: '0 0 8px 0' }}>&quot;¿Tenés activada la barra de envío gratis en tu Tiendanube?&quot;</p>
                  <p style={{ color: '#94A3B8', fontSize: '12px', margin: '0 0 4px 0' }}>Opción A: Sí, ya la uso 🚀</p>
                  <p style={{ color: '#94A3B8', fontSize: '12px', margin: '0' }}>Opción B: No, ¿cómo se activa? 👀</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== JUEVES PORTADA ==================== */}
        {activeTab === 'jueves-portada' && (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Portada Carrusel Urgencia (1:1)</span>
              <div style={{ width: '320px', height: '320px', backgroundColor: '#020A07', border: '2px solid rgba(245, 158, 11, 0.4)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FDE047', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '20px', padding: '4px 10px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>⚡ CHECKLIST ECOMMERCE</span>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94A3B8' }}>Nevux App</span>
                </div>
                <div style={{ margin: 'auto 0' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 8px 0', lineHeight: '1.2' }}>3 AJUSTES QUE DUPLICAN TUS VENTAS</h3>
                  <p style={{ fontSize: '12px', color: '#CBD5E1', margin: '0' }}>Antes del próximo pico de tráfico, activá estos 3 módulos en tu tienda.</p>
                </div>
                <div style={{ backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 'bold' }}>Deslizá para ver el paso a paso 👉</span>
                </div>
              </div>
            </div>
            <div style={{ flex: '2 1 480px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 4px 0' }}>Copy para Carrusel de Urgencia</h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0' }}>Educativo, directo y enfocado en conversión rápida.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyJuevesCarrusel, 'copy-jueves')}
                    style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {copiedId === 'copy-jueves' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyJuevesCarrusel}
                  rows={10}
                  style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '14px', padding: '16px', color: '#CBD5E1', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6', resize: 'none', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIERNES ==================== */}
        {activeTab === 'viernes' && (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Story Garantía &amp; Cierre (9:16)</span>
              <div style={{ width: '300px', height: '533px', backgroundColor: '#020A07', border: '2px solid rgba(16, 185, 129, 0.5)', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '20px', padding: '4px 12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>🛡️ RIESGO CERO</span>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', margin: '0' }}>7 DÍAS GRATIS PARA TU TIENDA</h3>
                  <p style={{ fontSize: '12px', color: '#CBD5E1', margin: '0' }}>Sin tarjeta obligatoria. Si no aumentás tu ticket promedio, lo desactivás en un clic.</p>
                </div>
                <div style={{ backgroundColor: '#020617', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px' }}>
                  <p style={{ color: '#34D399', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold', margin: '0 0 4px 0' }}>App Oficial Tiendanube</p>
                  <p style={{ color: '#94A3B8', fontSize: '11px', margin: '0' }}>Instalación instantánea con ID #37382</p>
                </div>
                <div style={{ backgroundColor: '#10B981', color: '#000000', fontWeight: '900', fontSize: '12px', padding: '12px', borderRadius: '12px' }}>
                  Tocá acá para Probar Gratis 📲
                </div>
              </div>
            </div>
            <div style={{ flex: '2 1 480px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 8px 0' }}>Estrategia de Cierre de Semana</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.6', margin: '0' }}>
                  Los viernes a la tarde los dueños de tiendas revisan sus métricas y preparan ofertas. Es el momento perfecto para ofrecer automatización sin riesgo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIERNES PORTADA ==================== */}
        {activeTab === 'viernes-portada' && (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Miniatura 9:16 (Reel / TikTok)</span>
              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '28px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ padding: '4px 10px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '20px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>
                    🚀 AUTO-PILOT • TIENDANUBE
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 8px', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '12px', border: '1px solid #1E293B' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#CBD5E1' }}>Nevux</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <div style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#FDE047', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>
                    ⚡ Fin de Semana en Piloto Automático
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '900', lineHeight: '1.25', color: '#FFFFFF', margin: '0 0 12px 0' }}>
                    DEJÁ TU TIENDA <span style={{ color: '#34D399', textDecoration: 'underline', textDecorationColor: '#10B981' }}>VENDIENDO SOLA</span> ESTE FINDE
                  </h2>
                  <p style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.5', margin: '0', padding: '0 8px' }}>
                    Activá ofertas automáticas de cross-selling y mirá cómo sube tu ticket promedio el lunes.
                  </p>
                </div>

                <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 'bold', color: '#E2E8F0', borderBottom: '1px solid #1E293B', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span>Cross-selling Activo</span>
                    <span style={{ color: '#34D399', fontFamily: 'monospace', fontWeight: '900' }}>+25% Ventas</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span style={{ color: '#94A3B8' }}>Sin programar nada</span>
                    <span style={{ color: '#FACC15', fontWeight: 'bold' }}>7 Días Gratis</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '2 1 480px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 4px 0' }}>Copy para Reel de Fin de Semana</h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0' }}>Enfocado en automatizar y hacer crecer las ventas sin esfuerzo.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyViernesReel, 'copy-viernes')}
                    style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {copiedId === 'copy-viernes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyViernesReel}
                  rows={14}
                  style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '14px', padding: '16px', color: '#CBD5E1', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6', resize: 'none', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== IDEAS REELS ==================== */}
        {activeTab === 'ideas-reels' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '24px', padding: '28px' }}>
              <div style={{ backgroundColor: '#FACC15', color: '#000000', display: 'inline-block', padding: '4px 12px', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', borderRadius: '8px', marginBottom: '12px' }}>
                ⚡ Flujo de Trabajo Rápido para No Editores
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 8px 0' }}>
                Cómo Grabar y Editar Reels de Nevux en 15 Minutos (Sin Bloqueo Creativo)
              </h2>
              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', margin: '0', maxWidth: '800px' }}>
                Los reels de software SaaS que más convierten son grabaciones de pantalla directas con voz en off clara y texto dinámico en CapCut.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', borderRadius: '12px', fontWeight: '900', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>01</div>
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF', margin: '0' }}>Grabá la Pantalla del Sandbox</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.6', margin: '0' }}>
                  Entrá a <code style={{ backgroundColor: '#020617', color: '#6EE7B7', padding: '2px 6px', borderRadius: '4px' }}>nevuxapp.mitiendanube.com</code> y grabá el proceso agregando un producto al carrito y activando la oferta.
                </p>
              </div>

              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', borderRadius: '12px', fontWeight: '900', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>02</div>
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF', margin: '0' }}>Voz en Off &amp; Subtítulos en CapCut</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.6', margin: '0' }}>
                  Importá el video en CapCut, grabá la voz leyendo el copy y poné <strong>Subtítulos Automáticos</strong> en mayúsculas verdes/amarillas con borde negro.
                </p>
              </div>

              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', borderRadius: '12px', fontWeight: '900', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>03</div>
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF', margin: '0' }}>Portada 9:16 &amp; Publicación</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.6', margin: '0' }}>
                  Usá las miniaturas 9:16 de este panel como portada para mantener un feed ordenado y profesional.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#020617', border: '1px solid rgba(6, 78, 59, 0.4)', borderRadius: '20px', padding: '20px' }}>
              <h3 style={{ fontSize: '12px', fontFamily: 'monospace', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
                🔊 Configuración Recomendada de Audio en CapCut
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Volumen Voz</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'monospace' }}>-6 dB</span>
                </div>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Música Fondo</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'monospace' }}>-22 dB</span>
                </div>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Fuente Subtítulos</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFFFFF' }}>Montserrat Black</span>
                </div>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Exportación</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34D399', fontFamily: 'monospace' }}>1080p @ 60 FPS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
              }
