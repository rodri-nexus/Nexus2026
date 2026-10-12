'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BannerAdminPage() {
  const [activeTab, setActiveTab] = useState('lunes');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const copyLunesReel = `El error que te está costando un 20% más por pedido en Tiendanube 👇\n\nLa mayoría de las tiendas intentan facturar más metiendo más plata en Meta Ads.\nPero cuando el cliente ya tiene la tarjeta en la mano para pagar... nadie le ofrece nada más.\n\nMirá la diferencia:\n❌ Sin Nevux: El cliente compra 1 producto, paga el envío y se va. Ticket: $35.000.\n✅ Con Nevux: Antes de cerrar, la tienda le ofrece un complemento clave con 15% OFF en 1 solo clic. Ticket: $48.500.\n\nMismo costo publicitario. +38% de ganancia neta en la misma compra.`;

  const copyMiercolesReel = `La devolución más cara de tu tienda no es la que te pide el cliente... es la venta que nunca ocurrió por falta de soporte instantáneo 💬\n\nUn cliente tiene una duda sobre su talle o el método de envío a medianoche.\nSi no le respondés en el momento: cierra la pestaña y le compra a tu competencia.\n\nCon el Asistente IA de Nevux integrado a tu catálogo de Tiendanube.`;

  return (
    <div className="min-h-screen bg-[#020A07] text-white p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 border-b border-emerald-900/40 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">Nevux Marketing Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Panel de Contenido</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="px-4 py-2 text-xs font-bold bg-slate-900 border border-slate-800 rounded-xl">← Volver</Link>
          <a href="https://nevuxapp.mitiendanube.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs font-bold text-black bg-emerald-400 rounded-xl">Sandbox Tiendanube ↗</a>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-6xl mx-auto mb-8 flex gap-2 overflow-x-auto pb-2">
        {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'ideas-reels'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === tab ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* VISTA LUNES (EJEMPLO) */}
      {activeTab === 'lunes' && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <div className="w-[320px] h-[568px] bg-black border-2 border-emerald-500/40 rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-emerald-500/10">
              <div className="relative z-10 flex justify-between">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black px-2 py-1 rounded-full uppercase">📈 Ticket Promedio</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Nevux</span>
              </div>
              <div className="relative z-10 text-center space-y-4">
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-black px-2 py-1 rounded inline-block uppercase">⚠️ Error en Tiendanube</span>
                <h2 className="text-2xl font-black text-white leading-tight uppercase">Subí el <span className="text-emerald-400">Ticket Promedio</span> sin gastar en pauta</h2>
                <p className="text-xs text-slate-400 px-4 italic">Facturá hasta 38% más por cliente instalando Nevux en 1 clic.</p>
              </div>
              <div className="relative z-10 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-xs font-bold border-b border-slate-800 pb-2 mb-2">
                  <span>Cross-selling Activo</span>
                  <span className="text-emerald-400">+38% Ganancia</span>
                </div>
                <div className="flex justify-between text-[10px] italic text-slate-500">
                  <span>ID App: #37382</span>
                  <span className="text-emerald-500 font-bold uppercase">7 Días Gratis</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white uppercase text-sm tracking-widest">Copy para Reel</h3>
                <button onClick={() => copyToClipboard(copyLunesReel, 'l')} className="bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-lg uppercase transition-transform active:scale-95">
                  {copiedId === 'l' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <textarea readOnly value={copyLunesReel} className="w-full bg-black border border-slate-800 rounded-xl p-4 text-xs text-slate-400 h-64 resize-none font-mono focus:outline-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ideas-reels' && (
        <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-[32px]">
          <h2 className="text-xl font-black text-white mb-4 uppercase italic tracking-tighter">Guía de Grabación Rápida 🎬</h2>
          <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-black rounded-2xl border border-slate-800"><p className="text-emerald-400 font-bold mb-2 uppercase">1. Pantalla</p>Grabá el sandbox nevuxapp.mitiendanube.com</div>
            <div className="p-4 bg-black rounded-2xl border border-slate-800"><p className="text-emerald-400 font-bold mb-2 uppercase">2. CapCut</p>Voz a -6dB, música a -22dB. Subtítulos Montserrat Black.</div>
            <div className="p-4 bg-black rounded-2xl border border-slate-800"><p className="text-emerald-400 font-bold mb-2 uppercase">3. Portada</p>Usá las placas de este panel como miniatura.</div>
          </div>
        </div>
      )}
    </div>
  );
                }
