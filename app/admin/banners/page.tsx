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
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
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
    <div className="min-h-screen bg-[#020A07] text-slate-100 p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-black">
      {/* HEADER DE NAVEGACIÓN */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              Nevux Brand & Marketing Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Panel de Contenido & Miniaturas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Templates visuales 9:16 y copys de alta conversión listos para publicar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 rounded-lg hover:border-emerald-500/50 transition-all"
          >
            ← Volver a la Tienda
          </Link>
          <a
            href="https://nevuxapp.mitiendanube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
          >
            Ver Sandbox Tiendanube ↗
          </a>
        </div>
      </div>

      {/* TABS DE SELECCIÓN DE CONTENIDO */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-800">
          <button
            onClick={() => setActiveTab('lunes')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'lunes'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Lunes (Stories & Reel)
          </button>
          <button
            onClick={() => setActiveTab('martes')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'martes'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Martes (Stories & Comparativa)
          </button>
          <button
            onClick={() => setActiveTab('miercoles')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'miercoles'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Miércoles (Stories & Reel)
          </button>
          <button
            onClick={() => setActiveTab('jueves')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'jueves'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Jueves (Stories Tip)
          </button>
          <button
            onClick={() => setActiveTab('jueves-portada')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'jueves-portada'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Jueves (Carrusel Urgencia)
          </button>
          <button
            onClick={() => setActiveTab('viernes')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'viernes'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Viernes (Stories Garantía)
          </button>
          <button
            onClick={() => setActiveTab('viernes-portada')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'viernes-portada'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Viernes (Miniatura Reel)
          </button>
          <button
            onClick={() => setActiveTab('ideas-reels')}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'ideas-reels'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                : 'bg-amber-500/10 text-amber-300 hover:text-amber-200 border border-amber-500/30'
            }`}
          >
            💡 Ideas Reels (CapCut Playbook)
          </button>
        </div>
      </div>

      {/* CONTENIDO DE CADA TAB */}
      <div className="max-w-7xl mx-auto">
        {/* ========================================================
            TAB: LUNES
        ======================================================== */}
        {activeTab === 'lunes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Placa 9:16 Miniatura Video */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-emerald-400 mb-2 uppercase font-bold tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </div>
              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
                }}
                className="relative rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle Grid Accent */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
                    📈 CRECIMIENTO • TICKET PROMEDIO
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[10px] font-bold text-slate-300">Nevux</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  <div className="inline-block px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-lg text-xs font-black uppercase tracking-wider">
                    ⚠️ Error Costoso en Tiendanube
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-white tracking-tight">
                    SUBÍ EL <span className="text-emerald-400 underline decoration-emerald-500 decoration-wavy">TICKET PROMEDIO</span> SIN GASTAR EN PAUTA
                  </h2>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
                    Cómo sumar productos complementarios en 1 clic y facturar hasta un 38% más por cada cliente.
                  </p>
                </div>

                {/* Bottom Card Mockup */}
                <div className="relative z-10 bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 border-b border-slate-800">
                    <span>Cross-selling Activo</span>
                    <span className="text-emerald-400 font-mono font-extrabold">+38% Ganancia</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Instalación: 60 seg</span>
                    <span className="text-yellow-400 font-bold">7 Días Gratis</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Resolución nativa de render: 1080x1920 (9:16). Capturalo o usalo como referencia gráfica.
              </p>
            </div>

            {/* Copy y Recursos de Publicación */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy Completo para Reel / TikTok</h3>
                    <p className="text-xs text-slate-400">Optimizado con fórmula PAS (Problema - Agitación - Solución).</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(copyLunesReel, 'copy-lunes')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
                  >
                    {copiedId === 'copy-lunes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyLunesReel}
                  rows={14}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none focus:border-emerald-500 resize-none selection:bg-emerald-500 selection:text-black"
                />
              </div>

              {/* Guía de Grabación Rápida */}
              <div className="bg-slate-900/40 border border-emerald-900/40 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-mono uppercase font-bold text-emerald-400 tracking-wider">
                  🎬 Guión de Grabación (15-20 segundos)
                </h4>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>
                    <strong className="text-white">00:00 - 00:03 (Hook):</strong> Grabá la pantalla de tu tienda mostrando el carrito simple. Decí: <em>&quot;Si seguís vendiendo así en Tiendanube, estás regalando el 20% de tu facturación&quot;</em>.
                  </li>
                  <li>
                    <strong className="text-white">00:03 - 00:08 (Solución):</strong> Mostrá cómo al agregar un producto al carrito, Nevux abre la oferta de cross-selling en 1 clic.
                  </li>
                  <li>
                    <strong className="text-white">00:08 - 00:15 (CTA):</strong> Mostrá el panel de Nevux con los números en verde. Decí: <em>&quot;Lo instalás en 1 minuto y tenés 7 días gratis. Link en bio&quot;</em>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: MARTES
        ======================================================== */}
        {activeTab === 'martes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Placa Comparativa 1:1 */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-emerald-400 mb-2 uppercase font-bold tracking-wider">
                Placa Comparativa 1:1 (Post / Carrusel)
              </div>
              <div
                style={{ width: '340px', height: '340px', backgroundColor: '#020A07' }}
                className="relative rounded-3xl p-5 border-2 border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">
                    ¿CÓMO CONVIERTE TU TIENDA?
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    Nevux 2025
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-auto">
                  <div className="bg-rose-950/30 border border-rose-900/40 rounded-xl p-3 text-center space-y-1">
                    <span className="text-rose-400 text-[10px] font-black uppercase">❌ Sin Nevux</span>
                    <p className="text-xs font-bold text-white leading-tight">1 Producto por compra</p>
                    <p className="text-[10px] text-slate-400">Ticket estancado en $35.000</p>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-center space-y-1">
                    <span className="text-emerald-400 text-[10px] font-black uppercase">✅ Con Nevux</span>
                    <p className="text-xs font-bold text-white leading-tight">Cross-selling en 1 clic</p>
                    <p className="text-[10px] text-emerald-300 font-bold font-mono">Ticket sube a $48.500</p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-2.5 text-center border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-200">
                    Instalación en 60 segundos • 7 Días de prueba gratis
                  </p>
                </div>
              </div>
            </div>

            {/* Copy Martes */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Carrusel Comparativo</h3>
                    <p className="text-xs text-slate-400">Ideal para generar debate y guardados en Instagram.</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(copyMartesCarrusel, 'copy-martes')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
                  >
                    {copiedId === 'copy-martes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyMartesCarrusel}
                  rows={10}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: MIÉRCOLES
        ======================================================== */}
        {activeTab === 'miercoles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Placa 9:16 Miniatura Video */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-emerald-400 mb-2 uppercase font-bold tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </div>
              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 25%, rgba(244, 63, 94, 0.18) 0%, transparent 70%)',
                }}
                className="relative rounded-3xl p-6 border-2 border-rose-500/40 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
                    ⚠️ CONTROL DE COSTOS • CX
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[10px] font-bold text-slate-300">Nevux IA</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-black uppercase tracking-wider">
                    🚨 Fuga Silenciosa de Ventas
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-white tracking-tight">
                    LA DEVOLUCIÓN <span className="text-rose-400 underline decoration-rose-500 decoration-wavy">MÁS CARA</span> DE TU TIENDA
                  </h2>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
                    El 67% de los carritos se caen por dudas de talle, stock o envío a deshoras.
                  </p>
                </div>

                {/* Bottom Card Mockup */}
                <div className="relative z-10 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 border-b border-slate-800">
                    <span>Asistente IA 24/7</span>
                    <span className="text-emerald-400 font-mono font-extrabold">0 Carritos Caídos</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Responde en 2 segundos</span>
                    <span className="text-emerald-300 font-bold">Instalación Fácil</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Resolución nativa: 1080x1920 (9:16).
              </p>
            </div>

            {/* Copy Miércoles */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Reel de Soporte & IA</h3>
                    <p className="text-xs text-slate-400">Enfocado en resolver la pérdida de ventas fuera de horario laboral.</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(copyMiercolesReel, 'copy-miercoles')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
                  >
                    {copiedId === 'copy-miercoles' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyMiercolesReel}
                  rows={12}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: JUEVES (STORIES)
        ======================================================== */}
        {activeTab === 'jueves' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-emerald-400 mb-2 uppercase font-bold tracking-wider">
                Story Interactiva (9:16)
              </div>
              <div
                style={{
                  width: '300px',
                  height: '533px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
                }}
                className="relative rounded-3xl p-6 border-2 border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden text-center"
              >
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-black uppercase">
                    💡 TIP ECOMMERCE
                  </span>
                  <h3 className="text-xl font-black text-white leading-tight">
                    ¿Cuánta plata dejás en la mesa sin una barra de Envío Gratis?
                  </h3>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <p className="text-xs text-slate-300 font-semibold">
                    El 80% de los clientes prefiere agregar un producto más antes que pagar el costo de envío.
                  </p>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-emerald-400 h-full rounded-full w-4/5 animate-pulse"></div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">
                    ¡Faltan $4.500 para tu ENVÍO GRATIS!
                  </span>
                </div>

                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2.5">
                  <span className="text-xs font-bold text-emerald-300">
                    Activalo con Nevux en 1 clic 📲
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-2">Estrategia de Stickers para Instagram Stories</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Usá el sticker interactivo de <strong>&quot;Encuesta&quot;</strong> o <strong>&quot;Cuestionario&quot;</strong> para aumentar la interacción de tu cuenta.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <p className="font-bold text-white">Pregunta recomendada:</p>
                  <p className="italic text-emerald-300">&quot;¿Tenés activada la barra de envío gratis en tu Tiendanube?&quot;</p>
                  <p className="pt-2 text-slate-400">Opción A: Sí, ya la uso 🚀</p>
                  <p className="text-slate-400">Opción B: No, ¿cómo se pone? 👀</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: JUEVES PORTADA
        ======================================================== */}
        {activeTab === 'jueves-portada' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-emerald-400 mb-2 uppercase font-bold tracking-wider">
                Portada Carrusel Urgencia (1:1)
              </div>
              <div
                style={{ width: '340px', height: '340px', backgroundColor: '#020A07' }}
                className="relative rounded-3xl p-6 border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
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

                <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-emerald-400">
                    Deslizá para ver el paso a paso 👉
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Carrusel de Urgencia</h3>
                    <p className="text-xs text-slate-400">Educativo, directo y enfocado en la conversión rápida.</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(copyJuevesCarrusel, 'copy-jueves')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
                  >
                    {copiedId === 'copy-jueves' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyJuevesCarrusel}
                  rows={10}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: VIERNES
        ======================================================== */}
        {activeTab === 'viernes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-emerald-400 mb-2 uppercase font-bold tracking-wider">
                Story Garantía & Cierre (9:16)
              </div>
              <div
                style={{
                  width: '300px',
                  height: '533px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                }}
                className="relative rounded-3xl p-6 border-2 border-emerald-500/50 shadow-2xl flex flex-col justify-between overflow-hidden text-center"
              >
                <div className="space-y-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
                    🛡️ RIESGO CERO
                  </span>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    7 DÍAS GRATIS PARA TU TIENDA
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sin tarjeta obligatoria. Si no aumentás tu ticket promedio, lo desactivás en un clic.
                  </p>
                </div>

                <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-mono text-emerald-400 font-bold">App Oficial Tiendanube</p>
                  <p className="text-[11px] text-slate-400">Instalación instantánea con ID #37382</p>
                </div>

                <div className="bg-emerald-400 text-black font-black text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/30">
                  Tocá acá para Probar Gratis 📲
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-2">Estrategia de Cierre de Semana</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Los viernes a la tarde los dueños de tiendas revisan sus métricas y preparan las promociones del fin de semana. Es el momento perfecto para ofrecerles una herramienta que optimice sus ventas en piloto automático.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: VIERNES PORTADA (MINIATURA 9:16)
        ======================================================== */}
        {activeTab === 'viernes-portada' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Placa 9:16 Miniatura Video */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-emerald-400 mb-2 uppercase font-bold tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </div>
              <div
                style={{
                  width: '320px',
                  height: '568px',
                  backgroundColor: '#020A07',
                  backgroundImage:
                    'radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                }}
                className="relative rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
                    🚀 AUTO-PILOT • TIENDANUBE
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[10px] font-bold text-slate-300">Nevux</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  <div className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 rounded-lg text-xs font-black uppercase tracking-wider">
                    ⚡ Fin de Semana en Piloto Automático
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-white tracking-tight">
                    DEJÁ TU TIENDA <span className="text-emerald-400 underline decoration-emerald-500 decoration-wavy">VENDIENDO SOLA</span> ESTE FINDE
                  </h2>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
                    Activá ofertas automáticas de cross-selling y mirá cómo sube tu ticket promedio el lunes.
                  </p>
                </div>

                {/* Bottom Card Mockup */}
                <div className="relative z-10 bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 border-b border-slate-800">
                    <span>Cross-selling Activo</span>
                    <span className="text-emerald-400 font-mono font-extrabold">+25% Ventas</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Sin programar nada</span>
                    <span className="text-yellow-400 font-bold">7 Días Gratis</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Resolución nativa: 1080x1920 (9:16).
              </p>
            </div>

            {/* Copy Viernes */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Copy para Reel de Fin de Semana</h3>
                    <p className="text-xs text-slate-400">Enfocado en la automatización y el descanso del dueño de negocio.</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(copyViernesReel, 'copy-viernes')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
                  >
                    {copiedId === 'copy-viernes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyViernesReel}
                  rows={14}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: IDEAS REELS (CAPCUT PLAYBOOK)
        ======================================================== */}
        {activeTab === 'ideas-reels' && (
          <div className="space-y-8">
            {/* Header del Playbook */}
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 rounded-3xl p-6 md:p-8">
              <div className="inline-block px-3 py-1 bg-amber-400 text-black font-black text-xs uppercase rounded-lg mb-3">
                ⚡ Flujo de Trabajo Rápido para No Editores
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Cómo Grabar y Editar Reels de Nevux en 15 Minutos (Sin Bloqueo Creativo)
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                No necesitás ser cineasta ni contratar editores caros. Los reels de software SaaS que más convierten son grabaciones de pantalla directas con voz en off clara y texto dinámico en CapCut.
              </p>
            </div>

            {/* Paso a Paso Detallado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PASO 1 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black flex items-center justify-center text-lg">
                  01
                </div>
                <h3 className="text-base font-black text-white">Grabá la Pantalla del Sandbox</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Entrá a <code className="text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded">nevuxapp.mitiendanube.com</code> desde tu celular o computadora y grabá 3 tomas simples:
                </p>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li><strong>Toma 1 (3s):</strong> Agregando un producto al carrito.</li>
                  <li><strong>Toma 2 (4s):</strong> El pop-up de Nevux ofreciendo el complemento en 1 clic.</li>
                  <li><strong>Toma 3 (3s):</strong> El total del carrito actualizándose con el ticket más alto.</li>
                </ul>
              </div>

              {/* PASO 2 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black flex items-center justify-center text-lg">
                  02
                </div>
                <h3 className="text-base font-black text-white">Voz en Off & Subtítulos en CapCut</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Abrí la app gratuita de <strong>CapCut</strong> (en el teléfono o en la compu) e importá tus grabaciones:
                </p>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Grabá tu voz leyendo el guión sugerido (mantené un tono enérgico y seguro).</li>
                  <li>Tocá en <strong>&quot;Subtítulos Automáticos&quot;</strong>.</li>
                  <li>Elegí la plantilla de texto en mayúsculas color verde/amarillo con contorno negro para máxima legibilidad.</li>
                </ul>
              </div>

              {/* PASO 3 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black flex items-center justify-center text-lg">
                  03
                </div>
                <h3 className="text-base font-black text-white">Portada 9:16 & Publicación</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Para que tu feed se vea profesional y no como una captura desordenada:
                </p>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Usá las miniaturas 9:16 diseñadas en las pestañas de este panel como primer frame o portada de Instagram.</li>
                  <li>Pegá el copy correspondiente con los hashtags.</li>
                  <li>Fijá el comentario con el link directo a la Tienda de Apps de Tiendanube.</li>
                </ul>
              </div>
            </div>

            {/* Checklist de Parámetros de Audio y Video */}
            <div className="bg-slate-950 border border-emerald-900/40 rounded-2xl p-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Parámetros Recomendados para CapCut / TikTok
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Volumen Voz</span>
                  <span className="text-white font-mono font-bold text-sm">-6 dB (Limpia)</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Música de Fondo</span>
                  <span className="text-white font-mono font-bold text-sm">-22 dB (Sutil)</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Fuente Subtítulos</span>
                  <span className="text-white font-bold text-sm">Montserrat Black / Bold</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Exportación</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">1080p @ 60 FPS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                    }
