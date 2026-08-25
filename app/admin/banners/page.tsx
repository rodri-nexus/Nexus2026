"use client";

import React from "react";

export default function BannersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center gap-12 font-sans">
      {/* Indicaciones para el usuario */}
      <div className="max-w-3xl w-full text-center space-y-2 bg-slate-900 p-6 rounded-2xl border border-emerald-500/30 shadow-xl">
        <h1 className="text-2xl font-bold text-emerald-400">
          📷 Banners Promocionales Oficiales de Nevux
        </h1>
        <p className="text-sm text-slate-300">
          Girá tu teléfono en **modo horizontal (landscape)** o usá el zoom para abarcar el recuadro completo y sacale captura de pantalla a cada banner para subirlos a la App Store de Tiendanube.
        </p>
      </div>

      {/* ==========================================
          BANNER 1: IMPULSÁ TU TICKET PROMEDIO
         ========================================== */}
      <div className="relative w-[960px] h-[540px] bg-gradient-to-br from-[#10B981] via-[#059669] to-[#044e3a] rounded-3xl p-12 overflow-hidden shadow-2xl border border-white/10 flex items-center justify-between shrink-0">
        {/* Adorno visual de fondo */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Columna Izquierda: Textos */}
        <div className="w-[42%] z-10 space-y-4">
          <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Impulsá tu ticket promedio
          </h2>
          <p className="text-xl text-emerald-100 font-medium leading-relaxed">
            Aumentá tu facturación elevando el valor de cada venta con ofertas irresistibles.
          </p>
        </div>

        {/* Columna Derecha: Widgets 3D Stack */}
        <div className="w-[54%] h-full relative z-10 flex items-center justify-center">
          {/* Tarjeta Fondo: Armá tu Pack */}
          <div className="absolute -right-2 top-8 w-[280px] bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 transform rotate-6 scale-90 opacity-90 text-slate-900 space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Armá tu pack
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="accent-[#10B981]" />
                  <span className="font-semibold text-slate-700">Tarjetero</span>
                </div>
                <span className="font-bold text-[#059669]">$14.000</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="accent-[#10B981]" />
                  <span className="font-semibold text-slate-700">Bolso</span>
                </div>
                <span className="font-bold text-[#059669]">$21.500</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="accent-[#10B981]" />
                  <span className="font-semibold text-slate-700">Llavero</span>
                </div>
                <span className="font-bold text-[#059669]">$4.500</span>
              </div>
            </div>
            <button className="w-full py-2 bg-[#000000] text-white text-xs font-bold rounded-xl shadow">
              Agregar selección
            </button>
          </div>

          {/* Tarjeta Principal Frontal: Descuentos por Cantidad */}
          <div className="absolute left-0 top-6 w-[360px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 transform -rotate-2 text-slate-900 space-y-3">
            {/* Opción 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                <span className="font-bold text-sm">Pack x1</span>
              </div>
              <span className="font-bold text-slate-900">$10.000</span>
            </div>

            {/* Opción 2 (Seleccionada) */}
            <div className="p-3.5 rounded-xl border-2 border-[#10B981] bg-emerald-50/40 space-y-2 relative shadow-sm">
              <div className="absolute -top-3 right-3 flex gap-1">
                <span className="bg-[#10B981] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  ENVÍO GRATIS
                </span>
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  MÁS VENDIDO
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-4 border-[#10B981] bg-white" />
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Pack x2</div>
                    <div className="text-xs font-bold text-[#059669]">Ahorrá 15%</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through mr-1">$20.000</span>
                  <span className="font-extrabold text-base text-slate-900">$17.850</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white border rounded-lg p-1 text-[11px] text-slate-600 flex justify-between items-center font-medium">
                  <span>Verde</span> ▾
                </div>
                <div className="bg-white border rounded-lg p-1 text-[11px] text-slate-600 flex justify-between items-center font-medium">
                  <span>Negro</span> ▾
                </div>
              </div>
            </div>

            {/* Opción 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                <div>
                  <span className="font-bold text-sm">Pack x3</span>
                  <span className="text-xs font-bold text-[#059669] ml-2">Ahorrá 20%</span>
                </div>
              </div>
              <span className="font-bold text-slate-900">$24.000</span>
            </div>

            {/* Botón CTA */}
            <button className="w-full py-3 bg-[#10B981] text-white text-sm font-extrabold rounded-xl shadow-lg hover:bg-[#059669] transition">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          BANNER 2: DESTACÁ TUS OFERTAS
         ========================================== */}
      <div className="relative w-[960px] h-[540px] bg-gradient-to-br from-[#10B981] via-[#059669] to-[#044e3a] rounded-3xl p-12 overflow-hidden shadow-2xl border border-white/10 flex items-center justify-between shrink-0">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Columna Izquierda: Textos */}
        <div className="w-[42%] z-10 space-y-4">
          <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Destacá tus ofertas
          </h2>
          <p className="text-xl text-emerald-100 font-medium leading-relaxed">
            Resaltá promociones, cupones y banners de urgencia para disparar tus conversiones.
          </p>
        </div>

        {/* Columna Derecha: Widgets Stack */}
        <div className="w-[54%] h-full relative z-10 flex items-center justify-center">
          {/* Banner Oferta Relámpago Contador */}
          <div className="absolute left-2 top-6 w-[340px] bg-slate-900 rounded-2xl p-4 text-white shadow-2xl border border-slate-700 transform -rotate-6 z-20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                🔥 Oferta Relámpago
              </span>
              <span className="text-[10px] bg-red-600 font-bold px-2 py-0.5 rounded-full">
                HASTA $25.000 OFF
              </span>
            </div>
            <div className="flex justify-center gap-3 pt-1">
              <div className="bg-slate-800 p-2 rounded-lg text-center min-w-[50px] border border-slate-700">
                <div className="text-lg font-black text-emerald-400">06</div>
                <div className="text-[9px] text-slate-400 uppercase">Horas</div>
              </div>
              <div className="text-lg font-bold self-center text-slate-500">:</div>
              <div className="bg-slate-800 p-2 rounded-lg text-center min-w-[50px] border border-slate-700">
                <div className="text-lg font-black text-emerald-400">21</div>
                <div className="text-[9px] text-slate-400 uppercase">Mins</div>
              </div>
              <div className="text-lg font-bold self-center text-slate-500">:</div>
              <div className="bg-slate-800 p-2 rounded-lg text-center min-w-[50px] border border-slate-700">
                <div className="text-lg font-black text-emerald-400">28</div>
                <div className="text-[9px] text-slate-400 uppercase">Segs</div>
              </div>
            </div>
          </div>

          {/* Stickers Promocionales */}
          <div className="absolute right-4 top-10 space-y-2 z-30 transform rotate-3 scale-95">
            <div className="bg-[#10B981] text-white px-4 py-2 rounded-full font-extrabold text-xs shadow-xl flex items-center gap-1.5 border border-emerald-300">
              ✨ ¡Oferta sorpresa!
            </div>
            <div className="bg-red-600 text-white px-4 py-2 rounded-full font-extrabold text-xs shadow-xl flex items-center gap-1.5 border border-red-400">
              🔥 ¡Últimas en stock!
            </div>
            <div className="bg-amber-500 text-slate-900 px-4 py-2 rounded-full font-extrabold text-xs shadow-xl flex items-center gap-1.5 border border-amber-300">
              ⏳ ¡Apurate, quedan pocas!
            </div>
          </div>

          {/* Banner Cupón Descuento */}
          <div className="absolute left-6 bottom-8 w-[350px] bg-red-600 rounded-2xl p-4 text-white shadow-2xl border-2 border-dashed border-red-300 transform -rotate-2 z-10 flex items-center justify-between">
            <div>
              <div className="text-base font-black">20% OFF extra 🎄</div>
              <div className="text-[11px] text-red-100">Aplicá el cupón en el checkout</div>
            </div>
            <div className="bg-white text-slate-900 rounded-xl px-3 py-1.5 font-mono font-black text-sm flex items-center gap-2 shadow">
              EXTRA20
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="absolute right-0 bottom-4 w-[280px] bg-white rounded-2xl p-4 text-slate-900 shadow-xl border border-slate-100 transform rotate-4 space-y-2">
            <div className="text-xs font-extrabold text-slate-800">Preguntas frecuentes</div>
            <div className="text-[11px] bg-slate-50 p-2 rounded-lg font-medium flex justify-between border">
              <span>¿Cuánto demora el envío?</span> <span>▾</span>
            </div>
            <div className="text-[11px] bg-slate-50 p-2 rounded-lg font-medium flex justify-between border">
              <span>¿De qué material es?</span> <span>▾</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          BANNER 3: GENERÁ CONFIANZA
         ========================================== */}
      <div className="relative w-[960px] h-[540px] bg-gradient-to-br from-[#10B981] via-[#059669] to-[#044e3a] rounded-3xl p-12 overflow-hidden shadow-2xl border border-white/10 flex items-center justify-between shrink-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Columna Izquierda: Textos */}
        <div className="w-[42%] z-10 space-y-4">
          <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Generá confianza
          </h2>
          <p className="text-xl text-emerald-100 font-medium leading-relaxed">
            Transmití seguridad total a tus clientes con testimonios reales y sellos de garantía.
          </p>
        </div>

        {/* Columna Derecha: Widgets Stack */}
        <div className="w-[54%] h-full relative z-10 flex items-center justify-center">
          {/* Reseñas Principales */}
          <div className="absolute left-0 top-6 w-[360px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 transform -rotate-3 text-slate-900 space-y-4 z-20">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">4,8</span>
                <div>
                  <div className="text-amber-400 text-sm">★★★★★</div>
                  <div className="text-[10px] text-slate-400 font-bold">24 reseñas</div>
                </div>
              </div>
              <button className="bg-[#000000] text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow">
                Escribir reseña
              </button>
            </div>

            {/* Testimonio 1 */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800">Mariana P.</span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                "Excelente experiencia de compra. El producto llegó súper rápido y la calidad es increíble. ¡100% recomendado!"
              </p>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800">Lucas G.</span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                "Atención impecable. Tenía dudas sobre las medidas y me respondieron al instante."
              </p>
            </div>
          </div>

          {/* Tarjeta de Garantía */}
          <div className="absolute right-2 top-10 w-[250px] bg-white rounded-2xl p-4 shadow-xl border border-slate-100 transform rotate-6 z-10 text-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-[#059669]">
              <span className="text-xl">🛡️</span>
              <span className="font-extrabold text-xs">Garantía de 60 días</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">
              Confiamos 100% en la calidad de nuestros productos. Si no estás satisfecho te devolvemos el dinero.
            </p>
          </div>

          {/* Tarjeta de Contacto / Soporte */}
          <div className="absolute right-6 bottom-8 w-[260px] bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 transform -rotate-2 z-30 text-slate-900 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center font-bold text-sm">
                💬
              </div>
              <div>
                <div className="text-xs font-bold">¿Tenés alguna duda?</div>
                <div className="text-[10px] text-slate-500">Escribinos por WhatsApp</div>
              </div>
            </div>
            <button className="w-full py-2 bg-[#22c55e] text-white rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-1.5">
              Contactar asesor
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          BANNER 4: TUS ESTILOS, TUS COLORES
         ========================================== */}
      <div className="relative w-[960px] h-[540px] bg-gradient-to-br from-[#10B981] via-[#059669] to-[#044e3a] rounded-3xl p-12 overflow-hidden shadow-2xl border border-white/10 flex items-center justify-between shrink-0">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Columna Izquierda: Textos */}
        <div className="w-[42%] z-10 space-y-4">
          <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Tus estilos, tus colores
          </h2>
          <p className="text-xl text-emerald-100 font-medium leading-relaxed">
            Customizá cada widget con la tipografía, colores e identidad de tu marca.
          </p>
        </div>

        {/* Columna Derecha: UI Editor Mock */}
        <div className="w-[54%] h-full relative z-10 flex items-center justify-center">
          {/* Card Trasera: Buscador de productos */}
          <div className="absolute left-2 top-8 w-[320px] bg-white rounded-2xl p-4 shadow-xl border border-slate-100 transform -rotate-6 z-10 text-slate-900 space-y-3">
            <div className="text-xs font-bold text-slate-700">Productos seleccionados</div>
            <div className="bg-slate-100 p-2 rounded-xl text-xs text-slate-400">
              Buscar un producto...
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border">
                <div className="w-7 h-7 bg-slate-200 rounded-md" />
                <div className="font-semibold text-slate-800">Bolso Premium</div>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border">
                <div className="w-7 h-7 bg-slate-200 rounded-md" />
                <div className="font-semibold text-slate-800">Funda Computadora</div>
              </div>
            </div>
          </div>

          {/* Card Principal Frontal: Color Picker Editor */}
          <div className="absolute right-0 top-6 w-[340px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 transform rotate-2 z-20 text-slate-900 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-bold">
              <div className="pb-2 px-3 text-slate-400">General</div>
              <div className="pb-2 px-3 border-b-2 border-[#10B981] text-[#059669]">Estilo</div>
            </div>

            {/* Listado de Selectores de Color */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Color del botón "Agregar":</span>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border">
                  <div className="w-4 h-4 rounded bg-[#10B981]" />
                  <span className="font-mono text-[11px] font-bold text-slate-600">#10B981</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Color del precio:</span>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border">
                  <div className="w-4 h-4 rounded bg-[#000000]" />
                  <span className="font-mono text-[11px] font-bold text-slate-600">#000000</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Color de subtítulos:</span>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border">
                  <div className="w-4 h-4 rounded bg-[#059669]" />
                  <span className="font-mono text-[11px] font-bold text-slate-600">#059669</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Color badge envío gratis:</span>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border">
                  <div className="w-4 h-4 rounded bg-[#10B981]" />
                  <span className="font-mono text-[11px] font-bold text-slate-600">#10B981</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Color badge recomendado:</span>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border">
                  <div className="w-4 h-4 rounded bg-[#F59E0B]" />
                  <span className="font-mono text-[11px] font-bold text-slate-600">#F59E0B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
      }
