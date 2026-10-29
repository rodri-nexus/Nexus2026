"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Star,
  MessageCircle,
  TrendingUp,
  Store,
  ChevronDown,
  Flame,
  Clock,
  Eye,
  Percent,
  Check,
  RefreshCw,
  X,
  HelpCircle,
  Layers,
  BarChart3
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function LandingPage() {
  const [storeUrl, setStoreUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"sticky" | "bundles" | "urgency" | "social">("sticky");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const MP_CHECKOUT_URL = "https://mpago.la/1LqFYin";

  const handleStartActivation = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = MP_CHECKOUT_URL;
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500 selection:text-black pb-20 sm:pb-0">
      
      {/* 1. HEADER STICKY */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <NevuxLogo size="medium" />

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5493435042812?text=Hola!%20Tengo%20una%20consulta%20sobre%20Nevux%20Pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              Soporte
            </a>
            <a
              href={MP_CHECKOUT_URL}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              Obtener Pack Pro
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-[#1f1f1f]">
        {/* Resplandor Esmeralda central */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          {/* Badge Lanzamiento */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-[#222222] text-emerald-400 text-xs sm:text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Código Maestro CSS+JS v1.0 para Tiendanube</span>
          </motion.div>

          {/* Título Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6"
          >
            Transformá tu Tiendanube en una{" "}
            <span className="text-emerald-400 underline decoration-emerald-500/40 decoration-4 underline-offset-8">
              Landing Page
            </span>{" "}
            de Alta Conversión
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Multiplicá tus ventas en celular pegando 1 solo código en tu tienda. Sin pagar agencias costosas y sin instalar aplicaciones pesadas.
          </motion.p>

          {/* Formulario de Activación Directa */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto bg-[#111111] border border-[#222222] p-4 sm:p-6 rounded-2xl shadow-2xl mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> Exclusivo para Tiendanube Argentina
              </span>
            </div>

            <form onSubmit={handleStartActivation} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Escribí el link de tu tienda (ej: mitienda.com.ar)"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Activar Mi Tienda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-[11px] sm:text-xs text-neutral-400 border-t border-[#1f1f1f] pt-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instalación 60s
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sin comisiones
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mercado Pago
              </span>
            </div>
          </motion.div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-neutral-400 text-xs sm:text-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0a0a0a] flex items-center justify-center font-bold text-[10px] text-emerald-400">GA</div>
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0a0a0a] flex items-center justify-center font-bold text-[10px] text-emerald-400">WS</div>
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0a0a0a] flex items-center justify-center font-bold text-[10px] text-emerald-400">NK</div>
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0a0a0a] flex items-center justify-center font-bold text-[10px] text-emerald-400">TN</div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              ))}
              <span className="font-bold text-white ml-1">4.9/5</span>
              <span>(+120 tiendas instaladas en Argentina)</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. BARRA DE MÉTRICAS */}
      <section className="py-8 bg-[#111111] border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 mb-0.5">+34%</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Tasa de Conversión</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-4xl font-black text-white mb-0.5">2.1x</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Ticket Promedio</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 mb-0.5">&lt; 15 KB</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Carga Ultra Rápida</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-4xl font-black text-white mb-0.5">60 seg</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Instalación Única</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN EXPLORADOR DE FUNCIONALIDADES (ESTILO PRAXIS) */}
      <section className="py-20 relative border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Mirala por dentro
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-4">
              Una landing de Nevux, de punta a punta.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Hacé clic en los módulos para ver cómo se transforma la experiencia de tu cliente en el celular.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Pestañas de la izquierda */}
            <div className="lg:col-span-6 space-y-4">
              
              <button
                onClick={() => setActiveTab("sticky")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "sticky"
                    ? "bg-[#111111] border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500"
                    : "bg-[#0a0a0a] border-[#222222] hover:border-[#333333]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    01 · CONVERSIÓN
                  </span>
                  {activeTab === "sticky" && <span className="text-xs text-emerald-400 font-bold">Activo</span>}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Botón de Compra Pegajoso (Sticky Bar)</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Permanece fijo en la parte inferior del celular durante todo el scroll. El cliente puede agregar al carrito en cualquier momento sin volver arriba.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("bundles")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "bundles"
                    ? "bg-[#111111] border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500"
                    : "bg-[#0a0a0a] border-[#222222] hover:border-[#333333]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    02 · TICKET PROMEDIO
                  </span>
                  {activeTab === "bundles" && <span className="text-xs text-emerald-400 font-bold">Activo</span>}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Selector de Ofertas Pack (Llevá 2 ó 3)</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Incentivá compras múltiples ofreciendo un 15% o 25% OFF llevando más de 1 unidad. Sube directo tu ticket promedio de venta.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("urgency")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "urgency"
                    ? "bg-[#111111] border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500"
                    : "bg-[#0a0a0a] border-[#222222] hover:border-[#333333]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    03 · URGENCIA Y STOCK
                  </span>
                  {activeTab === "urgency" && <span className="text-xs text-emerald-400 font-bold">Activo</span>}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Barra Dinámica de Stock Limitado</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Muestra el porcentaje vendido ("🔥 Quedan pocas unidades · 84% vendido") para gatillar la decisión de compra inmediata.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("social")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "social"
                    ? "bg-[#111111] border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500"
                    : "bg-[#0a0a0a] border-[#222222] hover:border-[#333333]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    04 · PRUEBA SOCIAL
                  </span>
                  {activeTab === "social" && <span className="text-xs text-emerald-400 font-bold">Activo</span>}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Notificaciones de Ventas en Vivo</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Muestra alertas flotantes con ventas simuladas en tiempo real ("Sofía de Córdoba compró recién") para generar máxima confianza.
                </p>
              </button>

            </div>

            {/* Mockup de Celular Animado */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative rounded-[40px] border-[8px] border-[#222222] bg-white text-black shadow-2xl overflow-hidden w-full max-w-sm min-h-[580px] p-4 pt-8 flex flex-col justify-between">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#222222] rounded-b-xl z-30" />

                {/* Header del producto simulado */}
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-center text-xs text-gray-400 font-bold mb-1">
                    <span>MI TIENDA PRO</span>
                    <ShoppingBag className="w-4 h-4 text-black" />
                  </div>
                  <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-emerald-600" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold">Foto de tu producto</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 font-semibold">Categoría Premium</div>
                    <div className="text-base font-extrabold text-gray-900">Producto Estrella Nevux</div>
                    <div className="text-sm font-black text-emerald-600">$38.900 ARS</div>
                  </div>
                </div>

                {/* Vista previa según pestaña activa */}
                <div className="flex-1 py-3 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === "sticky" && (
                      <motion.div
                        key="demo-sticky"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3 text-center"
                      >
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
                          👇 Al hacer scroll, la barra inferior fija le permite comprar en 1 clic desde cualquier parte de la página.
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "bundles" && (
                      <motion.div
                        key="demo-bundles"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                      >
                        <div className="text-[11px] font-bold text-gray-700">Elegí tu pack:</div>
                        <div className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 flex justify-between items-center text-xs">
                          <span className="font-medium text-gray-600">1 unidad</span>
                          <span className="font-bold text-gray-900">$38.900</span>
                        </div>
                        <div className="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/60 flex justify-between items-center text-xs relative">
                          <span className="absolute -top-2 right-2 bg-emerald-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full uppercase">
                            MÁS ELEGIDO
                          </span>
                          <div>
                            <div className="font-bold text-emerald-900">Llevá 2 · 15% OFF</div>
                            <div className="text-[9px] text-emerald-600">Ahorrás $11.670</div>
                          </div>
                          <span className="font-extrabold text-emerald-700">$66.130</span>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "urgency" && (
                      <motion.div
                        key="demo-urgency"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex justify-between font-bold text-amber-900 text-[11px]">
                          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> ¡Pocas unidades!</span>
                          <span>84% vendido</span>
                        </div>
                        <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                          <div className="w-[84%] h-full bg-amber-500 rounded-full" />
                        </div>
                        <div className="text-[10px] text-amber-700 text-center font-medium">
                          ⚡ 12 personas están viendo esto ahora
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "social" && (
                      <motion.div
                        key="demo-social"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-800 flex items-center gap-3 text-xs"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </div>
                        <div>
                          <div className="font-bold text-white text-[11px]">Martina de Córdoba</div>
                          <div className="text-[10px] text-gray-400">Compró recién hace 2 minutos</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sticky Bar Simulator (fijo abajo del celular) */}
                <div className="bg-black text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-gray-800 mt-2">
                  <div>
                    <div className="text-[10px] text-gray-400 font-semibold truncate max-w-[110px]">Producto Estrella</div>
                    <div className="text-xs font-black text-emerald-400">$38.900</div>
                  </div>
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-3.5 py-2 rounded-xl">
                    Agregar al carrito
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECCIÓN POR QUÉ VENDE (ESTRATEGIA AIDA) */}
      <section className="py-20 bg-[#111111] border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Por qué vende
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Una ficha optimizada psicológicamente convierte visitas frías en compradores decididos.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            
            <div className="bg-[#0a0a0a] border border-[#222222] p-6 rounded-2xl">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-xl flex items-center justify-center mb-4 text-sm">
                A
              </div>
              <h3 className="text-base font-bold text-white mb-2">Atracción</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                El botón pegajoso móvil retiene la atención inmediata sin perder al cliente en el scroll largo.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] p-6 rounded-2xl">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-xl flex items-center justify-center mb-4 text-sm">
                I
              </div>
              <h3 className="text-base font-bold text-white mb-2">Interés</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Barras de stock y contadores despiertan curiosidad y muestran alta demanda del producto.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] p-6 rounded-2xl">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-xl flex items-center justify-center mb-4 text-sm">
                D
              </div>
              <h3 className="text-base font-bold text-white mb-2">Deseo</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Packs acumulativos (Llevá 2 ó 3) hacen percibir un ahorro inmediato irresistible.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] p-6 rounded-2xl">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-xl flex items-center justify-center mb-4 text-sm">
                A
              </div>
              <h3 className="text-base font-bold text-white mb-2">Acción</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Notificaciones en vivo eliminan el miedo de compra y aceleran el paso al checkout.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TABLA COMPARATIVA: NEVUX VS OTROS */}
      <section className="py-20 border-b border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">¿Por qué elegir Nevux Pro?</h2>
            <p className="text-neutral-400 text-sm">Comparado con otras alternativas del mercado en Argentina.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#222222] text-neutral-400">
                  <th className="py-4 px-4 font-semibold">Característica</th>
                  <th className="py-4 px-4 font-bold text-emerald-400 bg-emerald-500/5 rounded-t-xl">Nevux Pro</th>
                  <th className="py-4 px-4 font-semibold">Agencia Web</th>
                  <th className="py-4 px-4 font-semibold">Apps Pesadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f] text-neutral-300">
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Inversión mensual</td>
                  <td className="py-4 px-4 font-black text-emerald-400 bg-emerald-500/5">$39.900 ARS</td>
                  <td className="py-4 px-4 text-neutral-500">$200.000+ ARS</td>
                  <td className="py-4 px-4 text-neutral-500">$60.000+ ARS</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Tiempo de instalación</td>
                  <td className="py-4 px-4 font-extrabold text-emerald-400 bg-emerald-500/5">60 segundos</td>
                  <td className="py-4 px-4 text-neutral-500">15 a 30 días</td>
                  <td className="py-4 px-4 text-neutral-500">Horas configurando</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Impacto en velocidad</td>
                  <td className="py-4 px-4 font-extrabold text-emerald-400 bg-emerald-500/5">Cero (&lt;15KB)</td>
                  <td className="py-4 px-4 text-neutral-500">Variable</td>
                  <td className="py-4 px-4 text-neutral-500">Lenta la tienda</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Comisiones por venta</td>
                  <td className="py-4 px-4 font-extrabold text-emerald-400 bg-emerald-500/5">0% Sin comisiones</td>
                  <td className="py-4 px-4 text-neutral-500">0%</td>
                  <td className="py-4 px-4 text-neutral-500">2% a 5% extra</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. PASOS DE ACTIVACIÓN */}
      <section className="py-20 bg-[#111111] border-b border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Cómo se pone en tu tienda
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Tres pasos simples. Sin tocar código complejo y 100% automático.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0a0a0a] border border-[#222222] p-8 rounded-2xl relative">
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md mb-4 inline-block">
                PASO 1
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Comprás tu Licencia</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Completás la suscripción en Mercado Pago y recibís el acceso inmediato a tu Código Maestro CSS+JS.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] p-8 rounded-2xl relative">
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md mb-4 inline-block">
                PASO 2
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Pegás el Código</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Vas a Configuración &gt; Edición avanzada de CSS en tu Tiendanube y pegás el script con 1 solo clic.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] p-8 rounded-2xl relative">
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md mb-4 inline-block">
                PASO 3
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Multiplicás Ventas</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Tu tienda activa al instante los botones pegajosos, ofertas pack y contadores de urgencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIOS */}
      <section className="py-20 border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Marcas que ya venden más</h2>
            <p className="text-neutral-400 text-sm">Casos reales en Tiendanube Argentina.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-emerald-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400" />
                  ))}
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm italic mb-6">
                  "El botón fijo en mobile cambió todo. La mayoría de nuestro tráfico viene de Instagram y la gente ahora compra directamente sin perderse."
                </p>
              </div>
              <div className="border-t border-[#222222] pt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Wess Indumentaria</div>
                  <div className="text-[10px] text-neutral-500">Buenos Aires</div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  +42% Ventas
                </span>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-emerald-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400" />
                  ))}
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm italic mb-6">
                  "El selector de Llevá 2 y Llevá 3 nos hizo subir el ticket promedio el primer fin de semana. Súper fácil de instalar."
                </p>
              </div>
              <div className="border-t border-[#222222] pt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Kala Cosmética</div>
                  <div className="text-[10px] text-neutral-500">Córdoba</div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  2.1x Ticket
                </span>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-emerald-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400" />
                  ))}
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm italic mb-6">
                  "No queríamos pagar $200.000 a una agencia ni cargar la tienda con apps lentas. Esto resolvió todo en 1 minuto."
                </p>
              </div>
              <div className="border-t border-[#222222] pt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Nativo Tech Store</div>
                  <div className="text-[10px] text-neutral-500">Rosario</div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  60s Setup
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. GARANTÍA DE SATISFACCIÓN */}
      <section className="py-12 bg-[#111111] border-b border-[#1f1f1f]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">Garantía de Devolución de 7 Días</h3>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Probá el Pack Landing Pro en tu Tiendanube durante 7 días. Si no estás 100% satisfecho con la transformación visual de tus fichas, te devolvemos el 100% de tu dinero inmediatamente.
          </p>
        </div>
      </section>

      {/* 10. PREGUNTAS FRECUENTES (FAQ) */}
      <section className="py-20 border-b border-[#1f1f1f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-2">Preguntas Frecuentes</h2>
            <p className="text-neutral-400 text-sm">Respuestas claras antes de activar tu pack.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "¿Necesito conocimientos de programación?",
                a: "Para nada. Te entregamos un archivo con el código listo. Solo tenés que copiarlo y pegarlo en 'Configuración > Edición avanzada de CSS' de tu Tiendanube. Tardás 60 segundos."
              },
              {
                q: "¿Afecta la velocidad de carga de mi tienda?",
                a: "No. El código pesa menos de 15KB y se ejecuta de manera ultrarrápida en el celular de tus clientes, manteniendo tu tienda veloz."
              },
              {
                q: "¿Puedo personalizar los colores y textos?",
                a: "Sí. El código trae variables muy sencillas donde podés cambiar los colores del botón y los porcentajes de descuento de los packs."
              },
              {
                q: "¿Cómo funciona el cobro?",
                a: "Es una suscripción mensual recurrente de $39.900 ARS procesada a través de Mercado Pago. Podés cancelar en cualquier momento sin compromisos."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-white flex justify-between items-center text-xs sm:text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-neutral-400 text-xs sm:text-sm border-t border-[#1f1f1f] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BLOQUE DE PRECIO / PRICING CARD */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-[#111111] border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-emerald-500/10">
            
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              Oferta Lanzamiento 2026
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">
              Pack Landing Page Pro
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mb-6">
              Para Tiendanube Argentina
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-neutral-500 line-through text-lg font-bold">$49.900</span>
              <span className="text-4xl sm:text-6xl font-black text-white">$39.900</span>
              <span className="text-neutral-400 font-semibold text-xs sm:text-sm">ARS / mes</span>
            </div>

            <ul className="max-w-md mx-auto space-y-3 text-left mb-8 text-xs sm:text-sm text-neutral-300">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Código Maestro CSS+JS listo para pegar</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Botón de Compra Pegajoso Mobile (Sticky Bar)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Selector de Ofertas Pack (Llevá 2 ó 3)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Barra Dinámica de Urgencia y Stock</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Notificaciones de Ventas en Vivo Alertas</span>
              </li>
            </ul>

            <a
              href={MP_CHECKOUT_URL}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <span>ACTIVAR AHORA EN MERCADO PAGO</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="text-[11px] text-neutral-500 mt-4">
              Pago 100% seguro con Mercado Pago. Cancelás cuando quieras con 1 clic.
            </p>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="py-10 border-t border-[#1f1f1f] bg-[#0a0a0a] text-neutral-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NevuxLogo size="small" />

          <div>
            © 2026 Nevux. Todos los derechos reservados.
          </div>

          <a
            href="https://wa.me/5493435042812?text=Hola!%20Tengo%20una%20consulta%20sobre%20Nevux%20Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            Soporte WhatsApp
          </a>
        </div>
      </footer>

      {/* 13. BARRA STICKY MOBILE FINAL */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-[#1f1f1f] z-50 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Pack Landing Pro</div>
          <div className="text-sm font-black text-emerald-400">$39.900 <span className="text-[10px] text-neutral-400 font-normal">/mes</span></div>
        </div>
        <a
          href={MP_CHECKOUT_URL}
          className="bg-emerald-500 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
        >
          <span>Activar Ahora</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
    }
