'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BannerAdminPage() {
  const [activeTab, setActiveTab] = useState<string>('lunes');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // --- COPIES CON FÓRMULA PAS ---
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
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto 24px auto',
          borderBottom: '1px solid #1E293B',
          paddingBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
            <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Nevux Brand Hub
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', margin: '0' }}>Panel de Contenido &amp; Miniaturas</h1>
          <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Templates visuales 9:16 y copys de alta conversión listos para publicar.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/"
            style={{
              padding: '8px 16px',
              backgroundColor: '#0F172A',
              color: '#CBD5E1',
              border: '1px solid #1E293B',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            ← Volver a la Tienda
          </Link>
          <a
            href="https://nevuxapp.mitiendanube.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              backgroundColor: '#10B981',
              color: '#000000',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Ver Sandbox ↗
          </a>
        </div>
      </div>

      {/* TABS DE SELECCIÓN */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px auto' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {[
            { id: 'lunes', label: 'Lunes (Stories & Reel)' },
            { id: 'martes', label: 'Martes (Stories & Comparativa)' },
            { id: 'miercoles', label: 'Miércoles (Stories & Reel)' },
            { id: 'jueves', label: 'Jueves (Stories Tip)' },
            { id: 'jueves-portada', label: 'Jueves (Carrusel Urgencia)' },
            { id: 'viernes', label: 'Viernes (Stories Garantía)' },
            { id: 'viernes-portada', label: 'Viernes (Miniatura Reel)' },
            { id: 'ideas-reels', label: '💡 Ideas Reels (CapCut Playbook)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                backgroundColor: activeTab === tab.id ? (tab.id === 'ideas-reels' ? '#FACC15' : '#10B981') : '#0F172A',
                color: activeTab === tab.id ? '#000000' : '#94A3B8',
                border: activeTab === tab.id ? '1px solid #34D399' : '1px solid #1E293B',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* LUNES */}
        {activeTab === 'lunes' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                Miniatura 9:16 (Reel / TikTok)
              </span>
              <div
                style={{
                  width: '300px',
                  height: '533px',
                  backgroundColor: '#020A07',
                  border: '2px solid rgba(16, 185, 129, 0.5)',
                  borderRadius: '24px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '4px 8px', fontSize: '9px', fontWeight: 'bold' }}>
                    📈 CRECIMIENTO • TICKET PROMEDIO
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 'bold' }}>Nevux</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#FB7185', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '6px', padding: '3px 8px', fontSize: '9px', fontWeight: 'bold', display: 'inline-block', marginBottom: '10px' }}>
                    ⚠️ Error Costoso en Tiendanube
                  </span>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF', lineHeight: '1.2', margin: '0 0 8px 0' }}>
                    SUBÍ EL <span style={{ color: '#34D399' }}>TICKET PROMEDIO</span> SIN GASTAR EN PAUTA
                  </h2>
                  <p style={{ fontSize: '11px', color: '#CBD5E1', margin: '0', lineHeight: '1.4' }}>
                    Cómo sumar productos complementarios en 1 clic y facturar hasta un 38% más por cliente.
                  </p>
                </div>

                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #1E293B', paddingBottom: '6px', marginBottom: '6px' }}>
                    <span>Cross-selling Activo</span>
                    <span style={{ color: '#34D399' }}>+38% Ganancia</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
                    <span>Instalación: 60 seg</span>
                    <span style={{ color: '#FACC15', fontWeight: 'bold' }}>7 Días Gratis</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>Copy para Reel</h3>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyLunesReel, 'copy-lunes')}
                    style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {copiedId === 'copy-lunes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea readOnly value={copyLunesReel} rows={12} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '10px', padding: '12px', color: '#CBD5E1', fontSize: '11px', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* MARTES */}
        {activeTab === 'martes' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                Placa Comparativa 1:1
              </span>
              <div style={{ width: '300px', height: '300px', backgroundColor: '#020A07', border: '2px solid #1E293B', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>¿CÓMO CONVIERTE TU TIENDA?</span>
                  <span style={{ color: '#34D399', fontSize: '10px', fontWeight: 'bold' }}>Nevux</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ backgroundColor: 'rgba(136, 19, 55, 0.3)', border: '1px solid rgba(159, 18, 57, 0.4)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <span style={{ color: '#FB7185', fontSize: '9px', fontWeight: 'bold', display: 'block' }}>❌ Sin Nevux</span>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', margin: '4px 0' }}>1 Producto por compra</p>
                    <p style={{ fontSize: '9px', color: '#94A3B8', margin: '0' }}>Ticket: $35.000</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(6, 78, 59, 0.4)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <span style={{ color: '#34D399', fontSize: '9px', fontWeight: 'bold', display: 'block' }}>✅ Con Nevux</span>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', margin: '4px 0' }}>Cross-selling en 1 clic</p>
                    <p style={{ fontSize: '9px', color: '#6EE7B7', fontWeight: 'bold', margin: '0' }}>Ticket: $48.500</p>
                  </div>
                </div>
                <div style={{ backgroundColor: '#0F172A', borderRadius: '10px', padding: '8px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  Instalación en 60 seg • 7 Días Gratis
                </div>
              </div>
            </div>

            <div style={{ flex: '2 1 400px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>Copy para Carrusel</h3>
                  <button type="button" onClick={() => copyToClipboard(copyMartesCarrusel, 'copy-martes')} style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {copiedId === 'copy-martes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea readOnly value={copyMartesCarrusel} rows={10} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '10px', padding: '12px', color: '#CBD5E1', fontSize: '11px', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* MIÉRCOLES */}
        {activeTab === 'miercoles' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                Miniatura 9:16 (Reel / TikTok)
              </span>
              <div style={{ width: '300px', height: '533px', backgroundColor: '#020A07', border: '2px solid rgba(244, 63, 94, 0.4)', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#FDA4AF', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '12px', padding: '4px 8px', fontSize: '9px', fontWeight: 'bold' }}>
                    ⚠️ CONTROL DE COSTOS • CX
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 'bold' }}>Nevux IA</span>
                </div>

                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FDE047', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '6px', padding: '3px 8px', fontSize: '9px', fontWeight: 'bold', display: 'inline-block', marginBottom: '10px' }}>
                    🚨 Fuga Silenciosa de Ventas
                  </span>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF', lineHeight: '1.2', margin: '0 0 8px 0' }}>
                    LA DEVOLUCIÓN <span style={{ color: '#FB7185' }}>MÁS CARA</span> DE TU TIENDA
                  </h2>
                  <p style={{ fontSize: '11px', color: '#CBD5E1', margin: '0', lineHeight: '1.4' }}>
                    El 67% de los carritos se caen por dudas de talle o stock a deshoras.
                  </p>
                </div>

                <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #1E293B', paddingBottom: '6px', marginBottom: '6px' }}>
                    <span>Asistente IA 24/7</span>
                    <span style={{ color: '#34D399' }}>0 Carritos Caídos</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
                    <span>Responde en 2 seg</span>
                    <span style={{ color: '#6EE7B7', fontWeight: 'bold' }}>Instalación Fácil</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '2 1 400px' }}>
              <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>Copy para Reel</h3>
                  <button type="button" onClick={() => copyToClipboard(copyMiercolesReel, 'copy-miercoles')} style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {copiedId === 'copy-miercoles' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea readOnly value={copyMiercolesReel} rows={12} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '10px', padding: '12px', color: '#CBD5E1', fontSize: '11px', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* JUEVES & OTROS TABS */}
        {activeTab === 'jueves' && (
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Tip de Stories para Jueves</h3>
            <p style={{ fontSize: '12px', color: '#CBD5E1' }}>Usá la encuesta interactiva en Instagram: &quot;¿Tenés activada la barra de envío gratis en tu Tiendanube?&quot;</p>
          </div>
        )}

        {activeTab === 'jueves-portada' && (
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>Copy para Carrusel de Urgencia</h3>
              <button type="button" onClick={() => copyToClipboard(copyJuevesCarrusel, 'copy-jueves')} style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                {copiedId === 'copy-jueves' ? '✓ ¡Copiado!' : 'Copiar Texto'}
              </button>
            </div>
            <textarea readOnly value={copyJuevesCarrusel} rows={10} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '10px', padding: '12px', color: '#CBD5E1', fontSize: '11px', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }} />
          </div>
        )}

        {activeTab === 'viernes' && (
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Garantía de Viernes</h3>
            <p style={{ fontSize: '12px', color: '#CBD5E1' }}>7 Días de prueba sin tarjeta. ID de App en Tiendanube: #37382.</p>
          </div>
        )}

        {activeTab === 'viernes-portada' && (
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>Copy para Reel de Viernes</h3>
              <button type="button" onClick={() => copyToClipboard(copyViernesReel, 'copy-viernes')} style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                {copiedId === 'copy-viernes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
              </button>
            </div>
            <textarea readOnly value={copyViernesReel} rows={12} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1E293B', borderRadius: '10px', padding: '12px', color: '#CBD5E1', fontSize: '11px', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }} />
          </div>
        )}

        {/* IDEAS REELS */}
        {activeTab === 'ideas-reels' && (
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#FACC15' }}>
              Playbook de Grabación para Reels (CapCut)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '12px', color: '#CBD5E1' }}>
              <div style={{ backgroundColor: '#020617', padding: '16px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <strong style={{ color: '#34D399', display: 'block', marginBottom: '6px' }}>1. Grabá Pantalla</strong>
                Entrá a nevuxapp.mitiendanube.com y grabá cómo agregás un producto y salta la oferta.
              </div>
              <div style={{ backgroundColor: '#020617', padding: '16px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <strong style={{ color: '#34D399', display: 'block', marginBottom: '6px' }}>2. CapCut Audio</strong>
                Voz en off a -6dB. Música a -22dB. Subtítulos Montserrat Black en amarillo/verde.
              </div>
              <div style={{ backgroundColor: '#020617', padding: '16px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <strong style={{ color: '#34D399', display: 'block', marginBottom: '6px' }}>3. Publicación</strong>
                Usá las miniaturas 9:16 de este panel como portada del video.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
          }
