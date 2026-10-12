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

Un cliente tiene una duda sobre su talle o el método de envío a medianoche.
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold">
              Nevux Brand &amp; Marketing Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Panel de Contenido &amp; Miniaturas
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Templates visuales 9:16 y copys de alta conversión listos para publicar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all"
          >
            &larr; Volver a la Tienda
          </Link>
          <a
            href="https://nevuxapp.mitiendanube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg transition-all"
          >
            Ver Sandbox Tiendanube &nearr;
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('lunes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'lunes'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Lunes (Stories &amp; Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('martes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'martes'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Martes (Stories &amp; Comparativa)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('miercoles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'miercoles'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Miércoles (Stories &amp; Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jueves')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'jueves'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Jueves (Stories Tip)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jueves-portada')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'jueves-portada'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Jueves (Carrusel Urgencia)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('viernes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'viernes'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Viernes (Stories Garantía)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('viernes-portada')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'viernes-portada'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Viernes (Miniatura Reel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ideas-reels')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === 'ideas-reels'
                ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:text-amber-200'
            }`}
          >
            💡 Ideas Reels (CapCut Playbook)
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === 'lunes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-mono text-emerald-400 mb-3 font-bold uppercase tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </span>
              <div className="w-full max-w-[320px] aspect-[9/16] bg-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase">
                    📈 CRECIMIENTO • TICKET PROMEDIO
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Nevux</span>
                </div>

                <div className="my-auto text-center space-y-3">
                  <span className="inline-block px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-lg text-[10px] font-black uppercase">
                    ⚠️ Error Costoso en Tiendanube
                  </span>
                  <h2 className="text-2xl font-black leading-tight text-white">
                    SUBÍ EL <span className="text-emerald-400">TICKET PROMEDIO</span> SIN GASTAR EN PAUTA
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cómo sumar productos complementarios en 1 clic y facturar hasta un 38% más por cada cliente.
                  </p>
                </div>

                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
                    <span>Cross-selling Activo</span>
                    <span className="text-emerald-400 font-mono">+38% Ganancia</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Instalación: 60 seg</span>
                    <span className="text-amber-400 font-bold">7 Días Gratis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Copy Completo para Reel / TikTok</h3>
                    <p className="text-xs text-slate-400">Fórmula PAS (Problema - Agitación - Solución).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyLunesReel, 'copy-lunes')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
                  >
                    {copiedId === 'copy-lunes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyLunesReel}
                  rows={13}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="bg-slate-900/60 border border-emerald-900/40 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold text-emerald-400">
                  🎬 Guión de Grabación Recomendado
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>00:00 - 00:03:</strong> Grabá el carrito simple en Tiendanube y decí: &quot;Si seguís vendiendo así, estás regalando un 20% por pedido&quot;.<br />
                  <strong>00:03 - 00:08:</strong> Mostrá el pop-up de Nevux activando el cross-selling en 1 clic.<br />
                  <strong>00:08 - 00:15:</strong> Mostrá el total aumentado y llamá a probar los 7 días gratis.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'martes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-mono text-emerald-400 mb-3 font-bold uppercase tracking-wider">
                Placa Comparativa 1:1 (Post / Carrusel)
              </span>
              <div className="w-full max-w-[320px] aspect-square bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-black text-white uppercase">¿CÓMO CONVIERTE TU TIENDA?</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">Nevux</span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-auto">
                  <div className="bg-rose-950/40 border border-rose-900/50 rounded-xl p-3 text-center space-y-1">
                    <span className="text-rose-400 text-[10px] font-black uppercase">❌ Sin Nevux</span>
                    <p className="text-xs font-bold text-white">1 Producto por compra</p>
                    <p className="text-[10px] text-slate-400">Ticket: $35.000</p>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3 text-center space-y-1">
                    <span className="text-emerald-400 text-[10px] font-black uppercase">✅ Con Nevux</span>
                    <p className="text-xs font-bold text-white">Cross-selling en 1 clic</p>
                    <p className="text-[10px] text-emerald-300 font-bold font-mono">Ticket: $48.500</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-2.5 text-center border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-300">Instalación en 60 seg • 7 Días Gratis</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Copy para Carrusel Comparativo</h3>
                    <p className="text-xs text-slate-400">Ideal para interacciones y guardados.</p>
                  </div>
                  <button
                    type="button"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'miercoles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-mono text-emerald-400 mb-3 font-bold uppercase tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </span>
              <div className="w-full max-w-[320px] aspect-[9/16] bg-slate-950 border-2 border-rose-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-[10px] font-black uppercase">
                    ⚠️ CONTROL DE COSTOS • CX
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Nevux IA</span>
                </div>

                <div className="my-auto text-center space-y-3">
                  <span className="inline-block px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-[10px] font-black uppercase">
                    🚨 Fuga Silenciosa de Ventas
                  </span>
                  <h2 className="text-2xl font-black leading-tight text-white">
                    LA DEVOLUCIÓN <span className="text-rose-400">MÁS CARA</span> DE TU TIENDA
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    El 67% de los carritos se caen por dudas de talle o stock a deshoras.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
                    <span>Asistente IA 24/7</span>
                    <span className="text-emerald-400 font-mono">0 Carritos Caídos</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Responde en 2 seg</span>
                    <span className="text-emerald-300 font-bold">Instalación Fácil</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Copy para Reel de Soporte &amp; IA</h3>
                    <p className="text-xs text-slate-400">Enfocado en resolver pérdida de ventas nocturnas.</p>
                  </div>
                  <button
                    type="button"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jueves' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-mono text-emerald-400 mb-3 font-bold uppercase tracking-wider">
                Story Interactiva (9:16)
              </span>
              <div className="w-full max-w-[300px] aspect-[9/16] bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-center shadow-2xl">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-black uppercase">
                    💡 TIP ECOMMERCE
                  </span>
                  <h3 className="text-lg font-black text-white">
                    ¿Cuánta plata dejás en la mesa sin una barra de Envío Gratis?
                  </h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <p className="text-xs text-slate-300 font-semibold">
                    El 80% prefiere agregar un producto más antes que pagar envío.
                  </p>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div className="bg-emerald-400 h-full rounded-full w-4/5"></div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono block">
                    ¡Faltan $4.500 para tu ENVÍO GRATIS!
                  </span>
                </div>

                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2.5">
                  <span className="text-xs font-bold text-emerald-300">Activalo con Nevux en 1 clic 📲</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-black text-white mb-2">Estrategia de Stickers para Stories</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Colocá el sticker interactivo de Encuesta en Instagram con la pregunta:
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 font-mono">
                  <p className="font-bold text-white">&quot;¿Tenés barra de envío gratis en tu Tiendanube?&quot;</p>
                  <p className="text-emerald-400">Opción A: Sí, ya la uso 🚀</p>
                  <p className="text-slate-400">Opción B: No, ¿cómo se activa? 👀</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jueves-portada' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-mono text-emerald-400 mb-3 font-bold uppercase tracking-wider">
                Portada Carrusel Urgencia (1:1)
              </span>
              <div className="w-full max-w-[320px] aspect-square bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-black uppercase">
                    ⚡ CHECKLIST ECOMMERCE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Nevux App</span>
                </div>

                <div className="my-auto space-y-2">
                  <h3 className="text-xl font-black text-white">3 AJUSTES QUE DUPLICAN TUS VENTAS</h3>
                  <p className="text-xs text-slate-300">
                    Antes del próximo pico de tráfico, activá estos 3 módulos en tu tienda.
                  </p>
                </div>

                <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-emerald-400">Deslizá para ver el paso a paso 👉</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Copy para Carrusel de Urgencia</h3>
                    <p className="text-xs text-slate-400">Educativo, directo y enfocado en la conversión rápida.</p>
                  </div>
                  <button
                    type="button"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'viernes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-mono text-emerald-400 mb-3 font-bold uppercase tracking-wider">
                Story Garantía &amp; Cierre (9:16)
              </span>
              <div className="w-full max-w-[300px] aspect-[9/16] bg-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between text-center shadow-2xl">
                <div className="space-y-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase">
                    🛡️ RIESGO CERO
                  </span>
                  <h3 className="text-xl font-black text-white">7 DÍAS GRATIS PARA TU TIENDA</h3>
                  <p className="text-xs text-slate-300">
                    Sin tarjeta obligatoria. Si no aumenta tu ticket promedio, lo desactivás en un clic.
                  </p>
                </div>

                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
                  <p className="text-xs font-mono text-emerald-400 font-bold">App Oficial Tiendanube</p>
                  <p className="text-[10px] text-slate-400">Instalación instantánea con ID #37382</p>
                </div>

                <div className="bg-emerald-400 text-black font-black text-xs py-3 rounded-xl shadow-lg">
                  Tocá acá para Probar Gratis 📲
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-black text-white mb-2">Estrategia de Cierre de Semana</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Los viernes a la tarde los dueños de tiendas revisan sus métricas y preparan ofertas para el fin de semana. Es el momento clave para ofrecer automatización sin riesgo.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'viernes-portada' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-mono text-emerald-400 mb-3 font-bold uppercase tracking-wider">
                Miniatura 9:16 (Reel / TikTok)
              </span>
              <div className="w-full max-w-[320px] aspect-[9/16] bg-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase">
                    🚀 AUTO-PILOT • TIENDANUBE
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Nevux</span>
                </div>

                <div className="my-auto text-center space-y-3">
                  <span className="inline-block px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-[10px] font-black uppercase">
                    ⚡ Fin de Semana Automático
                  </span>
                  <h2 className="text-2xl font-black leading-tight text-white">
                    DEJÁ TU TIENDA <span className="text-emerald-400">VENDIENDO SOLA</span> ESTE FINDE
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Activá ofertas de cross-selling y mirá cómo sube tu ticket promedio el lunes.
                  </p>
                </div>

                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
                    <span>Cross-selling Activo</span>
                    <span className="text-emerald-400 font-mono">+25% Ventas</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Sin programar nada</span>
                    <span className="text-amber-400 font-bold">7 Días Gratis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Copy para Reel de Fin de Semana</h3>
                    <p className="text-xs text-slate-400">Enfocado en automatizar y hacer crecer las ventas sin esfuerzo.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyViernesReel, 'copy-viernes')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
                  >
                    {copiedId === 'copy-viernes' ? '✓ ¡Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={copyViernesReel}
                  rows={13}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ideas-reels' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8">
              <span className="inline-block px-3 py-1 bg-amber-400 text-black font-black text-xs uppercase rounded-lg mb-3">
                ⚡ Flujo de Trabajo Rápido para No Editores
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Cómo Grabar y Editar Reels de Nevux en 15 Minutos
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
                Los videos de SaaS que más convierten son grabaciones simples de pantalla mostrando el software en acción con voz clara y subtítulos llamativos en CapCut.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black flex items-center justify-center text-base">
                  01
                </div>
                <h3 className="text-sm font-black text-white">Grabá la Pantalla del Sandbox</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Entrá a <code className="text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded">nevuxapp.mitiendanube.com</code> y grabá el proceso de compra agregando un producto al carrito y activando el complemento con 1 clic.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black flex items-center justify-center text-base">
                  02
                </div>
                <h3 className="text-sm font-black text-white">Voz &amp; Subtítulos en CapCut</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Importá el video en la app gratuita de CapCut, grabá la voz en off leyendo el copy y seleccioná <strong>Subtítulos Automáticos</strong> en mayúsculas amarillas o verdes con contorno negro.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black flex items-center justify-center text-base">
                  03
                </div>
                <h3 className="text-sm font-black text-white">Portada 9:16 &amp; Publicación</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Usá los templates de este panel como portada visual para mantener la estética profesional de la marca en Instagram y TikTok.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xs font-mono uppercase font-bold text-emerald-400 mb-4">
                🔊 Configuración Recomendada de Audio en CapCut
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Volumen Voz:</span>
                  <span className="text-white font-mono font-bold">-6 dB</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Música de Fondo:</span>
                  <span className="text-white font-mono font-bold">-22 dB</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Fuente Subtítulo:</span>
                  <span className="text-white font-bold">Montserrat Bold</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Exportación:</span>
                  <span className="text-emerald-400 font-mono font-bold">1080p / 60 FPS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
              }
