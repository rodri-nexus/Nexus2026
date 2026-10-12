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
      style={{ backgroundColor: '#020A07', color: '#F8FAFC', minHeight: '100vh' }}
      className="p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-black"
    >
      {/* HEADER DE NAVEGACIÓN */}
      <div
        style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}
        className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ backgroundColor: '#10B981' }}
              className="w-2.5 h-2.5 rounded-full animate-pulse"
            ></span>
            <span
              style={{ color: '#34D399' }}
              className="text-xs font-mono tracking-widest uppercase font-bold"
            >
              Nevux Brand &amp; Marketing Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Panel de Contenido &amp; Miniaturas
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Templates visuales 9:16 y copys de alta conversión listos para publicar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            style={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#E2E8F0' }}
            className="px-4 py-2 text-xs font-semibold border rounded-xl hover:border-emerald-500 transition-all"
          >
            ← Volver a la Tienda
          </Link>
          <a
            href="https://nevuxapp.mitiendanube.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#10B981', color: '#000000' }}
            className="px-4 py-2 text-xs font-bold rounded-xl shadow-lg hover:bg-emerald-400 transition-all"
          >
            Ver Sandbox Tiendanube ↗
          </a>
        </div>
      </div>

      {/* TABS DE SELECCIÓN DE CONTENIDO */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveTab('lunes')}
            style={{
              backgroundColor: activeTab === 'lunes' ? '#10B981' : '#0F172A',
              color: activeTab === 'lunes' ? '#000000' : '#94A3B8',
              borderColor: activeTab === 'lunes' ? '#34D399' : '#1E293B',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            Lunes (Stories &amp; Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('martes')}
            style={{
              backgroundColor: activeTab === 'martes' ? '#10B981' : '#0F172A',
              color: activeTab === 'martes' ? '#000000' : '#94A3B8',
              borderColor: activeTab === 'martes' ? '#34D399' : '#1E293B',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            Martes (Stories &amp; Comparativa)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('miercoles')}
            style={{
              backgroundColor: activeTab === 'miercoles' ? '#10B981' : '#0F172A',
              color: activeTab === 'miercoles' ? '#000000' : '#94A3B8',
              borderColor: activeTab === 'miercoles' ? '#34D399' : '#1E293B',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            Miércoles (Stories &amp; Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jueves')}
            style={{
              backgroundColor: activeTab === 'jueves' ? '#10B981' : '#0F172A',
              color: activeTab === 'jueves' ? '#000000' : '#94A3B8',
              borderColor: activeTab === 'jueves' ? '#34D399' : '#1E293B',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            Jueves (Stories Tip)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jueves-portada')}
            style={{
              backgroundColor: activeTab === 'jueves-portada' ? '#10B981' : '#0F172A',
              color: activeTab === 'jueves-portada' ? '#000000' : '#94A3B8',
              borderColor: activeTab === 'jueves-portada' ? '#34D399' : '#1E293B',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            Jueves (Carrusel Urgencia)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('viernes')}
            style={{
              backgroundColor: activeTab === 'viernes' ? '#10B981' : '#0F172A',
              color: activeTab === 'viernes' ? '#000000' : '#94A3B8',
              borderColor: activeTab === 'viernes' ? '#34D399' : '#1E293B',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            Viernes (Stories Garantía)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('viernes-portada')}
            style={{
              backgroundColor: activeTab === 'viernes-portada' ? '#10B981' : '#0F172A',
              color: activeTab === 'viernes-portada' ? '#000000' : '#94A3B8',
              borderColor: activeTab === 'viernes-portada' ? '#34D399' : '#1E293B',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            Viernes (Miniatura Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ideas-reels')}
            style={{
              backgroundColor: activeTab === 'ideas-reels' ? '#FACC15' : 'rgba(245, 158, 11, 0.15)',
              color: activeTab === 'ideas-reels' ? '#000000' : '#FDE047',
              borderColor: activeTab === 'ideas-reels' ? '#FDE047' : 'rgba(245, 158, 11, 0.4)',
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
          >
            💡 Ideas Reels (CapCut Playbook)
          </button>
        </div>
      </div>

      {/* CONTENIDO DE CADA TAB */}
      <div className="max-w-7xl mx-auto">
        {/* ==================== TAB: LUNES ==================== */}
        {activeTab === 'lunes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Placa 9:16 Miniatura Video */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                style={{ color: '#34D399' }}
                className="text-xs font-mono mb-2 uppercase font-bold tracking-wider"
              >
                Miniatura 9:16 (Reel / TikTok)
              </div>
              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                }}
                className="relative rounded-3xl p-6 border-2 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#6EE7B7',
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                    }}
                    className="px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider"
                  >
                    📈 CRECIMIENTO • TICKET PROMEDIO
                  </span>
                  <div
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: '#1E293B' }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                  >
                    <span style={{ backgroundColor: '#10B981' }} className="w-2 h-2 rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-300">Nevux</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  <div
                    style={{
                      backgroundColor: 'rgba(244, 63, 94, 0.2)',
                      borderColor: 'rgba(244, 63, 94, 0.4)',
                      color: '#FB7185',
                    }}
                    className="inline-block px-3 py-1 border rounded-lg text-xs font-black uppercase tracking-wider"
                  >
                    ⚠️ Error Costoso en Tiendanube
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-white tracking-tight">
                    SUBÍ EL{' '}
                    <span
                      style={{ color: '#34D399', textDecorationColor: '#10B981' }}
                      className="underline decoration-wavy"
                    >
                      TICKET PROMEDIO
                    </span>{' '}
                    SIN GASTAR EN PAUTA
                  </h2>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
                    Cómo sumar productos complementarios en 1 clic y facturar hasta un 38% más por cada cliente.
                  </p>
                </div>

                {/* Bottom Card Mockup */}
                <div
                  style={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  className="relative z-10 border rounded-2xl p-3 shadow-xl backdrop-blur-md"
                >
                  <div
                    style={{ borderColor: '#1E293B' }}
                    className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 border-b"
                  >
                    <span>Cross-selling Activo</span>
                    <span style={{ color: '#34D399' }} className="font-mono font-extrabold">
                      +38% Ganancia
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Instalación: 60 seg</span>
                    <span style={{ color: '#FACC15' }} className="font-bold">
                      7 Días Gratis
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy y Recursos */}
            <div className="lg:col-span-7 space-y-6">
              <div
                style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}
                className="border rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy Completo para Reel / TikTok</h3>
                    <p className="text-xs text-slate-400">Fórmula PAS (Problema - Agitación - Solución).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyLunesReel, 'copy-lunes')}
                    style={{ backgroundColor: '#10B981', color: '#000000' }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all"
                  >
                    {copiedId === 'copy-lunes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyLunesReel}
                  rows={13}
                  style={{ backgroundColor: '#020617', borderColor: '#1E293B', color: '#CBD5E1' }}
                  className="w-full border rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(6, 78, 59, 0.6)' }}
                className="border rounded-2xl p-5 space-y-2"
              >
                <h4 style={{ color: '#34D399' }} className="text-xs font-mono uppercase font-bold tracking-wider">
                  🎬 Guión de Grabación (15-20 segundos)
                </h4>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>
                    <strong className="text-white">00:00 - 00:03 (Hook):</strong> Grabá el carrito simple en Tiendanube y decí: <em>&quot;Si seguís vendiendo así, estás regalando un 20% por pedido&quot;</em>.
                  </li>
                  <li>
                    <strong className="text-white">00:03 - 00:08 (Solución):</strong> Mostrá el pop-up de Nevux activando el cross-selling en 1 clic.
                  </li>
                  <li>
                    <strong className="text-white">00:08 - 00:15 (CTA):</strong> Mostrá el total aumentado y llamá a probar los 7 días gratis.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: MARTES ==================== */}
        {activeTab === 'martes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div style={{ color: '#34D399' }} className="text-xs font-mono mb-2 uppercase font-bold tracking-wider">
                Placa Comparativa 1:1 (Post / Carrusel)
              </div>
              <div
                style={{ width: '340px', height: '340px', backgroundColor: '#020A07', borderColor: '#1E293B' }}
                className="relative rounded-3xl p-5 border-2 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                <div style={{ borderColor: '#1E293B' }} className="flex items-center justify-between border-b pb-3">
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">
                    ¿CÓMO CONVIERTE TU TIENDA?
                  </span>
                  <span
                    style={{ backgroundColor: '#022C22', color: '#34D399', borderColor: '#064E3B' }}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                  >
                    Nevux 2025
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-auto">
                  <div
                    style={{ backgroundColor: 'rgba(136, 19, 55, 0.3)', borderColor: 'rgba(159, 18, 57, 0.4)' }}
                    className="border rounded-xl p-3 text-center space-y-1"
                  >
                    <span style={{ color: '#FB7185' }} className="text-[10px] font-black uppercase">❌ Sin Nevux</span>
                    <p className="text-xs font-bold text-white leading-tight">1 Producto por compra</p>
                    <p className="text-[10px] text-slate-400">Ticket estancado en $35.000</p>
                  </div>
                  <div
                    style={{ backgroundColor: 'rgba(6, 78, 59, 0.4)', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                    className="border rounded-xl p-3 text-center space-y-1"
                  >
                    <span style={{ color: '#34D399' }} className="text-[10px] font-black uppercase">✅ Con Nevux</span>
                    <p className="text-xs font-bold text-white leading-tight">Cross-selling en 1 clic</p>
                    <p style={{ color: '#6EE7B7' }} className="text-[10px] font-bold font-mono">Ticket sube a $48.500</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="rounded-xl p-2.5 text-center border">
                  <p className="text-[11px] font-bold text-slate-200">
                    Instalación en 60 segundos • 7 Días de prueba gratis
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Carrusel Comparativo</h3>
                    <p className="text-xs text-slate-400">Ideal para generar debate y guardados en Instagram.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyMartesCarrusel, 'copy-martes')}
                    style={{ backgroundColor: '#10B981', color: '#000000' }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all"
                  >
                    {copiedId === 'copy-martes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyMartesCarrusel}
                  rows={10}
                  style={{ backgroundColor: '#020617', borderColor: '#1E293B', color: '#CBD5E1' }}
                  className="w-full border rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: MIÉRCOLES ==================== */}
        {activeTab === 'miercoles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div style={{ color: '#34D399' }} className="text-xs font-mono mb-2 uppercase font-bold tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </div>
              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 25%, rgba(244, 63, 94, 0.18) 0%, transparent 70%)',
                  borderColor: 'rgba(244, 63, 94, 0.4)',
                }}
                className="relative rounded-3xl p-6 border-2 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    style={{
                      backgroundColor: 'rgba(244, 63, 94, 0.2)',
                      color: '#FDA4AF',
                      borderColor: 'rgba(244, 63, 94, 0.4)',
                    }}
                    className="px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider"
                  >
                    ⚠️ CONTROL DE COSTOS • CX
                  </span>
                  <div
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: '#1E293B' }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                  >
                    <span style={{ backgroundColor: '#10B981' }} className="w-2 h-2 rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-300">Nevux IA</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  <div
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      borderColor: 'rgba(245, 158, 11, 0.4)',
                      color: '#FDE047',
                    }}
                    className="inline-block px-3 py-1 border rounded-lg text-xs font-black uppercase tracking-wider"
                  >
                    🚨 Fuga Silenciosa de Ventas
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-white tracking-tight">
                    LA DEVOLUCIÓN{' '}
                    <span
                      style={{ color: '#FB7185', textDecorationColor: '#F43F5E' }}
                      className="underline decoration-wavy"
                    >
                      MÁS CARA
                    </span>{' '}
                    DE TU TIENDA
                  </h2>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
                    El 67% de los carritos se caen por dudas de talle, stock o envío a deshoras.
                  </p>
                </div>

                {/* Bottom Card Mockup */}
                <div
                  style={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', borderColor: '#1E293B' }}
                  className="relative z-10 border rounded-2xl p-3 shadow-xl backdrop-blur-md"
                >
                  <div
                    style={{ borderColor: '#1E293B' }}
                    className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 border-b"
                  >
                    <span>Asistente IA 24/7</span>
                    <span style={{ color: '#34D399' }} className="font-mono font-extrabold">
                      0 Carritos Caídos
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Responde en 2 segundos</span>
                    <span style={{ color: '#6EE7B7' }} className="font-bold">
                      Instalación Fácil
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Reel de Soporte &amp; IA</h3>
                    <p className="text-xs text-slate-400">Enfocado en resolver la pérdida de ventas fuera de horario laboral.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyMiercolesReel, 'copy-miercoles')}
                    style={{ backgroundColor: '#10B981', color: '#000000' }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all"
                  >
                    {copiedId === 'copy-miercoles' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyMiercolesReel}
                  rows={12}
                  style={{ backgroundColor: '#020617', borderColor: '#1E293B', color: '#CBD5E1' }}
                  className="w-full border rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: JUEVES ==================== */}
        {activeTab === 'jueves' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div style={{ color: '#34D399' }} className="text-xs font-mono mb-2 uppercase font-bold tracking-wider">
                Story Interactiva (9:16)
              </div>
              <div
                style={{
                  width: '300px',
                  height: '533px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
                  borderColor: '#1E293B',
                }}
                className="relative rounded-3xl p-6 border-2 shadow-2xl flex flex-col justify-between text-center overflow-hidden"
              >
                <div className="space-y-2">
                  <span
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      color: '#FDE047',
                      borderColor: 'rgba(245, 158, 11, 0.4)',
                    }}
                    className="px-3 py-1 border rounded-full text-[10px] font-black uppercase"
                  >
                    💡 TIP ECOMMERCE
                  </span>
                  <h3 className="text-xl font-black text-white leading-tight">
                    ¿Cuánta plata dejás en la mesa sin una barra de Envío Gratis?
                  </h3>
                </div>

                <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-4 space-y-3">
                  <p className="text-xs text-slate-300 font-semibold">
                    El 80% de los clientes prefiere agregar un producto más antes que pagar el costo de envío.
                  </p>
                  <div style={{ backgroundColor: '#1E293B' }} className="w-full h-3 rounded-full overflow-hidden p-0.5">
                    <div style={{ backgroundColor: '#10B981' }} className="h-full rounded-full w-4/5 animate-pulse"></div>
                  </div>
                  <span style={{ color: '#34D399' }} className="text-[10px] font-bold font-mono">
                    ¡Faltan $4.500 para tu ENVÍO GRATIS!
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                  }}
                  className="border rounded-xl p-2.5"
                >
                  <span style={{ color: '#6EE7B7' }} className="text-xs font-bold">
                    Activalo con Nevux en 1 clic 📲
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-2">Estrategia de Stickers para Instagram Stories</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Usá el sticker interactivo de <strong>&quot;Encuesta&quot;</strong> para aumentar la interacción.
                </p>
                <div style={{ backgroundColor: '#020617', borderColor: '#1E293B' }} className="p-4 rounded-xl border space-y-2 text-xs text-slate-300">
                  <p className="font-bold text-white">Pregunta recomendada:</p>
                  <p style={{ color: '#6EE7B7' }} className="italic">&quot;¿Tenés activada la barra de envío gratis en tu Tiendanube?&quot;</p>
                  <p className="pt-2 text-slate-400">Opción A: Sí, ya la uso 🚀</p>
                  <p className="text-slate-400">Opción B: No, ¿cómo se pone? 👀</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: JUEVES PORTADA ==================== */}
        {activeTab === 'jueves-portada' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div style={{ color: '#34D399' }} className="text-xs font-mono mb-2 uppercase font-bold tracking-wider">
                Portada Carrusel Urgencia (1:1)
              </div>
              <div
                style={{
                  width: '340px',
                  height: '340px',
                  backgroundColor: '#020A07',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                }}
                className="relative rounded-3xl p-6 border-2 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      color: '#FDE047',
                      borderColor: 'rgba(245, 158, 11, 0.4)',
                    }}
                    className="px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider"
                  >
                    ⚡ CHECKLIST ECOMMERCE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Nevux App</span>
                </div>

                <div className="my-auto space-y-2">
                  <h3 className="text-2xl font-black text-white leading-tight">
                    3 AJUSTES QUE DUPLICAN TUS VENTAS
                  </h3>
                  <p className="text-xs text-slate-300">
                    Antes del próximo pico de tráfico, asegurate de tener estos 3 módulos activados en tu tienda.
                  </p>
                </div>

                <div style={{ backgroundColor: '#020617', borderColor: '#1E293B' }} className="rounded-xl p-2.5 border text-center">
                  <span style={{ color: '#34D399' }} className="text-xs font-bold">
                    Deslizá para ver el paso a paso 👉
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Carrusel de Urgencia</h3>
                    <p className="text-xs text-slate-400">Educativo, directo y enfocado en la conversión rápida.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyJuevesCarrusel, 'copy-jueves')}
                    style={{ backgroundColor: '#10B981', color: '#000000' }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all"
                  >
                    {copiedId === 'copy-jueves' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyJuevesCarrusel}
                  rows={10}
                  style={{ backgroundColor: '#020617', borderColor: '#1E293B', color: '#CBD5E1' }}
                  className="w-full border rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: VIERNES ==================== */}
        {activeTab === 'viernes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div style={{ color: '#34D399' }} className="text-xs font-mono mb-2 uppercase font-bold tracking-wider">
                Story Garantía &amp; Cierre (9:16)
              </div>
              <div
                style={{
                  width: '300px',
                  height: '533px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                }}
                className="relative rounded-3xl p-6 border-2 shadow-2xl flex flex-col justify-between text-center overflow-hidden"
              >
                <div className="space-y-3">
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#6EE7B7',
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                    }}
                    className="px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider"
                  >
                    🛡️ RIESGO CERO
                  </span>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    7 DÍAS GRATIS PARA TU TIENDA
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sin tarjeta obligatoria. Si no aumentás tu ticket promedio, lo desactivás en un clic.
                  </p>
                </div>

                <div style={{ backgroundColor: '#020617', borderColor: 'rgba(16, 185, 129, 0.3)' }} className="border rounded-2xl p-4 space-y-2">
                  <p style={{ color: '#34D399' }} className="text-xs font-mono font-bold">App Oficial Tiendanube</p>
                  <p className="text-[11px] text-slate-400">Instalación instantánea con ID #37382</p>
                </div>

                <div style={{ backgroundColor: '#10B981', color: '#000000' }} className="font-black text-xs py-3 rounded-xl shadow-lg">
                  Tocá acá para Probar Gratis 📲
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-2">Estrategia de Cierre de Semana</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Los viernes a la tarde los dueños de tiendas revisan sus métricas y preparan promociones. Es el momento perfecto para ofrecer automatización sin riesgo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: VIERNES PORTADA ==================== */}
        {activeTab === 'viernes-portada' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div style={{ color: '#34D399' }} className="text-xs font-mono mb-2 uppercase font-bold tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </div>
              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                }}
                className="relative rounded-3xl p-6 border-2 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#6EE7B7',
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                    }}
                    className="px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider"
                  >
                    🚀 AUTO-PILOT • TIENDANUBE
                  </span>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderColor: '#1E293B' }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border">
                    <span style={{ backgroundColor: '#10B981' }} className="w-2 h-2 rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-300">Nevux</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  <div
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      borderColor: 'rgba(245, 158, 11, 0.4)',
                      color: '#FDE047',
                    }}
                    className="inline-block px-3 py-1 border rounded-lg text-xs font-black uppercase tracking-wider"
                  >
                    ⚡ Fin de Semana en Piloto Automático
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-white tracking-tight">
                    DEJÁ TU TIENDA{' '}
                    <span
                      style={{ color: '#34D399', textDecorationColor: '#10B981' }}
                      className="underline decoration-wavy"
                    >
                      VENDIENDO SOLA
                    </span>{' '}
                    ESTE FINDE
                  </h2>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
                    Activá ofertas automáticas de cross-selling y mirá cómo sube tu ticket promedio el lunes.
                  </p>
                </div>

                {/* Bottom Card Mockup */}
                <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', borderColor: 'rgba(16, 185, 129, 0.3)' }} className="relative z-10 border rounded-2xl p-3 shadow-xl backdrop-blur-md">
                  <div style={{ borderColor: '#1E293B' }} className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 border-b">
                    <span>Cross-selling Activo</span>
                    <span style={{ color: '#34D399' }} className="font-mono font-extrabold">+25% Ventas</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Sin programar nada</span>
                    <span style={{ color: '#FACC15' }} className="font-bold">7 Días Gratis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Reel de Fin de Semana</h3>
                    <p className="text-xs text-slate-400">Enfocado en la automatización y el descanso del dueño de negocio.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyViernesReel, 'copy-viernes')}
                    style={{ backgroundColor: '#10B981', color: '#000000' }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all"
                  >
                    {copiedId === 'copy-viernes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyViernesReel}
                  rows={14}
                  style={{ backgroundColor: '#020617', borderColor: '#1E293B', color: '#CBD5E1' }}
                  className="w-full border rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: IDEAS REELS ==================== */}
        {activeTab === 'ideas-reels' && (
          <div className="space-y-8">
            <div
              style={{
                background: 'linear-gradient(to right, rgba(6, 78, 59, 0.6), #0F172A, rgba(6, 78, 59, 0.6))',
                borderColor: 'rgba(16, 185, 129, 0.4)',
              }}
              className="border rounded-3xl p-6 md:p-8"
            >
              <div style={{ backgroundColor: '#FACC15', color: '#000000' }} className="inline-block px-3 py-1 font-black text-xs uppercase rounded-lg mb-3">
                ⚡ Flujo de Trabajo Rápido para No Editores
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Cómo Grabar y Editar Reels de Nevux en 15 Minutos (Sin Bloqueo Creativo)
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                Los reels de software SaaS que más convierten son grabaciones de pantalla directas con voz en off clara y texto dinámico en CapCut.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6 space-y-4">
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34D399' }} className="w-10 h-10 rounded-xl border font-mono font-black flex items-center justify-center text-lg">
                  01
                </div>
                <h3 className="text-base font-black text-white">Grabá la Pantalla del Sandbox</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Entrá a <code style={{ backgroundColor: '#020617', color: '#6EE7B7' }} className="px-1.5 py-0.5 rounded">nevuxapp.mitiendanube.com</code> y grabá el proceso agregando un producto al carrito y activando la oferta.
                </p>
              </div>

              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6 space-y-4">
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34D399' }} className="w-10 h-10 rounded-xl border font-mono font-black flex items-center justify-center text-lg">
                  02
                </div>
                <h3 className="text-base font-black text-white">Voz en Off &amp; Subtítulos en CapCut</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Importá el video en CapCut, grabá la voz leyendo el copy y poné <strong>Subtítulos Automáticos</strong> en mayúsculas verdes/amarillas con borde negro.
                </p>
              </div>

              <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="border rounded-2xl p-6 space-y-4">
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34D399' }} className="w-10 h-10 rounded-xl border font-mono font-black flex items-center justify-center text-lg">
                  03
                </div>
                <h3 className="text-base font-black text-white">Portada 9:16 &amp; Publicación</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Usá las miniaturas 9:16 de este panel como portada para mantener un feed ordenado y profesional.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#020617', borderColor: 'rgba(6, 78, 59, 0.4)' }} className="border rounded-2xl p-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ backgroundColor: '#10B981' }} className="w-2 h-2 rounded-full"></span>
                Parámetros Recomendados para CapCut
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="p-3 rounded-xl border">
                  <span className="text-slate-400 block mb-1">Volumen Voz</span>
                  <span className="text-white font-mono font-bold text-sm">-6 dB</span>
                </div>
                <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="p-3 rounded-xl border">
                  <span className="text-slate-400 block mb-1">Música Fondo</span>
                  <span className="text-white font-mono font-bold text-sm">-22 dB</span>
                </div>
                <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="p-3 rounded-xl border">
                  <span className="text-slate-400 block mb-1">Fuente</span>
                  <span className="text-white font-bold text-sm">Montserrat Black</span>
                </div>
                <div style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} className="p-3 rounded-xl border">
                  <span className="text-slate-400 block mb-1">Exportación</span>
                  <span style={{ color: '#34D399' }} className="font-mono font-bold text-sm">1080p @ 60 FPS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
              }
