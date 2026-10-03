'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Eye, 
  Clock, 
  HelpCircle, 
  Smartphone,
  Award,
  DollarSign,
  AlertTriangle,
  Flame,
  Check
} from 'lucide-react';

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<
    'lunes' | 'martes' | 'miercoles' | 'miercoles-stories' | 'jueves' | 'jueves-portada'
  >('jueves-portada');

  return (
    <div className="min-h-screen bg-[#020a07] text-slate-100 pb-24 font-sans">
      {/* Header */}
      <header className="border-b border-emerald-500/10 bg-[#04140e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-950/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Ecosistema de Contenido Semanal
              </h1>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
            Tiendanube App #37382
          </span>
        </div>
      </header>

      {/* Tabs Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('lunes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'lunes'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#061e14] text-slate-400 hover:text-white border border-emerald-900/30'
            }`}
          >
            📊 Lunes (Encuesta)
          </button>
          <button
            onClick={() => setActiveTab('martes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'martes'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#061e14] text-slate-400 hover:text-white border border-emerald-900/30'
            }`}
          >
            🧠 Martes (Psicología)
          </button>
          <button
            onClick={() => setActiveTab('miercoles')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'miercoles'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#061e14] text-slate-400 hover:text-white border border-emerald-900/30'
            }`}
          >
            🎠 Miércoles (Carrusel Feed)
          </button>
          <button
            onClick={() => setActiveTab('miercoles-stories')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'miercoles-stories'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#061e14] text-slate-400 hover:text-white border border-emerald-900/30'
            }`}
          >
            📱 Stories Miércoles
          </button>
          <button
            onClick={() => setActiveTab('jueves')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'jueves'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#061e14] text-slate-400 hover:text-white border border-emerald-900/30'
            }`}
          >
            ⏱️ Stories Jueves (Tip + Audit)
          </button>
          <button
            onClick={() => setActiveTab('jueves-portada')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'jueves-portada'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#061e14] text-slate-400 hover:text-white border border-emerald-900/30'
            }`}
          >
            🎬 Portada Reel Jueves
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* TAB: PORTADA REEL JUEVES */}
        {activeTab === 'jueves-portada' && (
          <div className="space-y-6">
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Portada Oficial de Reel (Jueves) — 9:16 con Cuadrícula Segura 1:1
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Optimizada con alto contraste visual. El contenido clave está en el centro para que en el feed cuadrado (1:1) de tu perfil no se corte ninguna palabra.
              </p>
            </div>

            <div className="flex justify-center">
              {/* Portada Container 9:16 */}
              <div className="relative w-full max-w-[390px] aspect-[9/16] bg-[#020a07] border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6">
                
                {/* Background Glow Elements */}
                <div className="absolute top-1/4 -left-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-12 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* TOP HEADER (Visible en Reel completo) */}
                <div className="relative z-10 flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 bg-[#061e14] border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-wider text-emerald-300">TIENDANUBE OPTIMIZER</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">NEVUX.AR</span>
                </div>

                {/* CENTER: SAFE ZONE 1:1 (Visible perfecto en el perfil) */}
                <div className="relative z-10 my-auto py-4 bg-gradient-to-b from-white/[0.02] to-white/[0.04] border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                  
                  {/* Danger Tag */}
                  <div className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 px-3 py-1 rounded-lg text-red-400 text-xs font-black uppercase tracking-wider mb-3">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    CHECKOUT EN RIESGO
                  </div>

                  {/* Main Titles */}
                  <h3 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
                    3 ERRORES
                  </h3>
                  <h4 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 leading-none tracking-tight mt-1 mb-2">
                    INVISIBLES
                  </h4>
                  <p className="text-sm font-semibold text-slate-300 mb-4">
                    que te hacen perder ventas en tu tienda
                  </p>

                  {/* The 3 Errors Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 bg-[#03120c] border border-red-500/30 px-3 py-2 rounded-xl">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs">✕</span>
                      <span className="text-xs font-bold text-slate-200">1. Cero Urgencia en Checkout</span>
                    </div>

                    <div className="flex items-center gap-2.5 bg-[#03120c] border border-red-500/30 px-3 py-2 rounded-xl">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs">✕</span>
                      <span className="text-xs font-bold text-slate-200">2. Tienda "Silenciosa" (Sin prueba)</span>
                    </div>

                    <div className="flex items-center gap-2.5 bg-[#03120c] border border-red-500/30 px-3 py-2 rounded-xl">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs">✕</span>
                      <span className="text-xs font-bold text-slate-200">3. Venta de productos sueltos</span>
                    </div>
                  </div>

                </div>

                {/* BOTTOM FOOTER (Visible en Reel completo) */}
                <div className="relative z-10 pb-2 text-center">
                  <div className="inline-flex items-center gap-2 bg-emerald-500 text-[#020a07] font-black text-xs px-4 py-2 rounded-full shadow-lg shadow-emerald-500/25">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    MIRÁ EL VIDEO Y SOLUCIONALO
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    Compatible con Tiendanube • Sin tocar código
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB: JUEVES STORIES (Tip + Audit) */}
        {activeTab === 'jueves' && (
          <div className="space-y-6">
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Plan Jueves: Story 1 (Tip Visual) + Story 2 (Cajita Interactiva)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Story 1 educa con un temporizador dinámico. Story 2 abre DMs de auditoría gratuita para generar clientes directos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* STORY 1: TIP CONVERSIÓN */}
              <div className="relative w-full aspect-[9/16] bg-[#020a07] border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                    💡 TIP DE CONVERSIÓN
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">STORY 1/2</span>
                </div>

                <div className="space-y-4 my-auto">
                  <h3 className="text-2xl font-black text-white leading-tight">
                    ¿Por qué tus visitas <span className="text-red-400">no compran</span> en el momento?
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    El 97% de los usuarios dice <span className="text-white font-semibold">"después compro"</span>... y no vuelve nunca más.
                  </p>

                  {/* Widget Preview */}
                  <div className="bg-[#061e14] border border-emerald-500/30 p-4 rounded-2xl shadow-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> OFERTA POR TIEMPO LIMITADO
                      </span>
                    </div>
                    <div className="flex justify-center items-center gap-2 py-2">
                      <div className="bg-[#020a07] px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-center">
                        <span className="text-base font-black text-white font-mono">04</span>
                        <span className="block text-[8px] text-slate-400 font-bold">HORAS</span>
                      </div>
                      <span className="text-emerald-400 font-bold">:</span>
                      <div className="bg-[#020a07] px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-center">
                        <span className="text-base font-black text-white font-mono">58</span>
                        <span className="block text-[8px] text-slate-400 font-bold">MIN</span>
                      </div>
                      <span className="text-emerald-400 font-bold">:</span>
                      <div className="bg-[#020a07] px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-center">
                        <span className="text-base font-black text-emerald-400 font-mono">12</span>
                        <span className="block text-[8px] text-slate-400 font-bold">SEG</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-400">
                      Instalá este temporizador en tu Tiendanube en 15 segundos con Nevux.
                    </p>
                  </div>
                </div>

                <div className="text-center bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <p className="text-[11px] font-medium text-slate-300">
                    Siguiente historia: Auditoría sin cargo 👇
                  </p>
                </div>
              </div>

              {/* STORY 2: CAJITA AUDITORÍA */}
              <div className="relative w-full aspect-[9/16] bg-[#020a07] border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                    🔍 AUDITORÍA EXPRESS
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">STORY 2/2</span>
                </div>

                <div className="space-y-4 my-auto">
                  <h3 className="text-2xl font-black text-white leading-tight">
                    ¿Querés saber dónde estás <span className="text-emerald-400">perdiendo ventas</span>?
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Reviso el checkout de tu Tiendanube hoy y te paso 3 recomendaciones prácticas para optimizarlo este finde.
                  </p>

                  {/* Question Sticker Placeholder */}
                  <div className="bg-white rounded-2xl p-4 text-center text-slate-900 shadow-2xl space-y-3">
                    <p className="text-xs font-bold text-slate-800">
                      Escribime el link de tu Tiendanube 👇
                    </p>
                    <div className="bg-slate-100 border border-slate-300 rounded-xl py-3 px-3 text-xs text-slate-400 text-left font-medium">
                      Escribe algo...
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-medium">
                    100% Gratis • Cupos limitados por privado
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LUNES */}
        {activeTab === 'lunes' && (
          <div className="space-y-4">
            <div className="bg-[#061e14] border border-emerald-500/20 p-4 rounded-2xl">
              <h3 className="text-white font-bold text-sm">Contenido de Lunes Cargado</h3>
              <p className="text-xs text-slate-400 mt-1">Stories de encuesta de pérdida de visitas y agitación de dolor.</p>
            </div>
          </div>
        )}

        {/* TAB: MARTES */}
        {activeTab === 'martes' && (
          <div className="space-y-4">
            <div className="bg-[#061e14] border border-emerald-500/20 p-4 rounded-2xl">
              <h3 className="text-white font-bold text-sm">Contenido de Martes Cargado</h3>
              <p className="text-xs text-slate-400 mt-1">Psicología de compra, prueba social y video en vivo.</p>
            </div>
          </div>
        )}

        {/* TAB: MIERCOLES */}
        {activeTab === 'miercoles' && (
          <div className="space-y-4">
            <div className="bg-[#061e14] border border-emerald-500/20 p-4 rounded-2xl">
              <h3 className="text-white font-bold text-sm">Carrusel de Feed Miércoles Cargado</h3>
              <p className="text-xs text-slate-400 mt-1">Placas 1, 2 y 3 para swipe horizontal en el feed.</p>
            </div>
          </div>
        )}

        {/* TAB: MIERCOLES STORIES */}
        {activeTab === 'miercoles-stories' && (
          <div className="space-y-4">
            <div className="bg-[#061e14] border border-emerald-500/20 p-4 rounded-2xl">
              <h3 className="text-white font-bold text-sm">Stories de Miércoles Cargadas</h3>
              <p className="text-xs text-slate-400 mt-1">Story de dolor en Meta Ads y Story de Ticket Promedio.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
        }
