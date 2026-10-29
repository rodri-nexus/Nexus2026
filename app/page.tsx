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
  Layers,
  Lock,
  Store,
  ChevronDown,
  HelpCircle,
  Smartphone,
  Check,
  Flame,
  Clock,
  Eye,
  Percent,
  Users,
  Award
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function LandingPage() {
  const [storeUrl, setStoreUrl] = useState("");
  const [platform, setPlatform] = useState<"tiendanube" | "shopify">("tiendanube");
  const [activeTab, setActiveTab] = useState<"sticky" | "bundles" | "urgency" | "social">("sticky");
  const [simMode, setSimMode] = useState<"antes" | "despues">("despues");
  const [selectedTemplate, setSelectedTemplate] = useState<"clasica" | "oscura" | "split">("clasica");
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-20 sm:pb-0">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <NevuxLogo size="medium" />

          <div className="flex items-center gap-4">
            <a
              href={MP_CHECKOUT_URL}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Ingresar
            </a>
            <a
              href={MP_CHECKOUT_URL}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Obtener Pack Pro
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION CON ACTIVACIÓN DE TIENDA */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Código Maestro CSS+JS v1.0 para Tiendanube</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Transformá tu Tienda en una{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Landing Page de Alta Conversión
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Multiplicá tus ventas en Tiendanube instalando el Pack Landing Pro en 60 segundos. Sin tocar código complejo y sin pagar aplicaciones pesadas.
          </motion.p>

          {/* FORMULARIO DE INGRESO DE TIENDA Y PLATAFORMA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-xl mb-12"
          >
            {/* Selector de plataforma */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPlatform("tiendanube")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  platform === "tiendanube"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Store className="w-4 h-4" />
                Tiendanube ⚡
              </button>
              <button
                type="button"
                onClick={() => setPlatform("shopify")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed"
                title="Próximamente disponible"
              >
                <ShoppingBag className="w-4 h-4" />
                Shopify (Próximamente)
              </button>
            </div>

            <form onSubmit={handleStartActivation} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Escribí tu dominio (ej: mitienda.com.ar)"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Activar Mi Tienda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instalación en 60s
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sin comisiones extras
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pago seguro
              </span>
            </div>
          </motion.div>

          {/* Ratings & Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-400 text-sm">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center font-bold text-xs text-emerald-400">GA</div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center font-bold text-xs text-blue-400">WS</div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center font-bold text-xs text-purple-400">NK</div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center font-bold text-xs text-pink-400">TN</div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="font-bold text-white ml-1">4.9/5</span>
              <span>(+120 tiendas de Tiendanube en Argentina)</span>
            </div>
          </div>
        </div>
      </section>

      {/* BARRA DE MÉTRICAS Y RESULTADOS */}
      <section className="py-10 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">+34%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tasa de Conversión</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-1">2.1x</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ticket Promedio</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-purple-400 mb-1">&lt; 15 KB</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ultra Carga Rápida</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-pink-400 mb-1">60 seg</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tiempo Instalación</div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORADOR DE FUNCIONALIDADES INTERACTIVO (4 PESTAÑAS TIPO PRAXIS) */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Miralo por dentro
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Explorá cada uno de los módulos psicológicos que activan el deseo de compra instantáneo en tus clientes.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Pestañas a la izquierda */}
            <div className="lg:col-span-6 space-y-4">
              <button
                onClick={() => setActiveTab("sticky")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "sticky"
                    ? "bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">01 · CONVERSIÓN</span>
                  <h3 className="text-lg font-bold text-white">Botón de Compra Fijo Mobile</h3>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Acompaña todo el scroll del usuario en el celular. Permite comprar en 1 clic sin tener que volver arriba a buscar el botón.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("bundles")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "bundles"
                    ? "bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">02 · TICKET PROMEDIO</span>
                  <h3 className="text-lg font-bold text-white">Selector de Oferta Pack (Llevá 2 ó 3)</h3>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Incentivá compras múltiples ofreciendo un 15% o 20% OFF llevando 2 o más unidades directo en la ficha de producto.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("urgency")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "urgency"
                    ? "bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">03 · URGENCIA & STOCK</span>
                  <h3 className="text-lg font-bold text-white">Barra Dinámica de Stock Limitado</h3>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Genera la sensación de escasez mostrando el porcentaje vendido e impulsando la decisión de compra rápida.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("social")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === "social"
                    ? "bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-md">04 · PRUEBA SOCIAL</span>
                  <h3 className="text-lg font-bold text-white">Notificaciones de Ventas en Vivo</h3>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Aparece periódicamente en la esquina de la pantalla avisando sobre ventas recientes de compradores en Argentina.
                </p>
              </button>
            </div>

            {/* Pantalla de celular interactiva a la derecha */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative rounded-[40px] border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden w-full max-w-sm min-h-[560px] p-4 pt-8">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-30" />

                <AnimatePresence mode="wait">
                  {activeTab === "sticky" && (
                    <motion.div
                      key="tab-sticky"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="h-44 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center">
                        <span className="text-xs text-slate-500">Scroll del usuario...</span>
                      </div>
                      <div className="h-20 bg-slate-900/50 rounded-xl" />
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                        <span className="text-xs font-bold text-emerald-400">⚡ El botón de compra no desaparece nunca</span>
                      </div>
                      {/* Simulación Sticky Bar */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white text-slate-900 p-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-200">
                        <div>
                          <div className="text-xs font-bold truncate max-w-[130px]">Remera Oversize Nevux</div>
                          <div className="text-sm font-black text-emerald-600">$29.900</div>
                        </div>
                        <button className="bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md">
                          COMPRAR
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "bundles" && (
                    <motion.div
                      key="tab-bundles"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3 pt-4"
                    >
                      <div className="text-xs font-bold text-slate-400">Seleccionar Oferta Especial:</div>

                      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex justify-between items-center opacity-70">
                        <div>
                          <div className="text-xs font-bold text-white">Llevá 1 unidad</div>
                          <div className="text-[10px] text-slate-400">Precio regular</div>
                        </div>
                        <span className="text-xs font-bold text-white">$29.900</span>
                      </div>

                      <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 flex justify-between items-center relative">
                        <span className="absolute -top-2.5 right-3 bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                          MÁS VENDIDO (15% OFF)
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">Llevá 2 unidades</div>
                          <div className="text-[10px] text-emerald-400">Ahorrás $8.970</div>
                        </div>
                        <span className="text-xs font-black text-emerald-400">$50.830</span>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-white">Llevá 3 unidades (25% OFF)</div>
                          <div className="text-[10px] text-slate-400">Envío gratis incluido</div>
                        </div>
                        <span className="text-xs font-bold text-white">$67.275</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "urgency" && (
                    <motion.div
                      key="tab-urgency"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 pt-6"
                    >
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                          <span className="flex items-center gap-1"><Flame className="w-4 h-4 fill-amber-400" /> Quedan pocas unidades</span>
                          <span>88% Vendido</span>
                        </div>
                        <div className="w-full h-2 bg-amber-950 rounded-full overflow-hidden">
                          <div className="w-[88%] h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full animate-pulse" />
                        </div>
                        <div className="text-[10px] text-slate-400 text-center pt-1">
                          ⚡ 14 personas están mirando este producto ahora mismo
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "social" && (
                    <motion.div
                      key="tab-social"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 pt-12"
                    >
                      <div className="bg-white text-slate-900 p-3.5 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
                          ✓
                        </div>
                        <div>
                          <div className="text-xs text-slate-800">
                            <strong>Sofía de Córdoba</strong> compró recién
                          </div>
                          <div className="text-[10px] text-slate-400">hace 3 minutos</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASOS DE ÉXITO / TESTIMONIOS */}
      <section className="py-20 bg-slate-950/80 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Marcas que aumentaron sus ventas
            </h2>
            <p className="text-slate-400 text-base">
              E-commerce en Tiendanube que transformaron sus fichas de producto con Nevux Pro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic mb-6">
                  "Increíble el cambio. Solo pegamos el código y las ventas en celular se dispararon un 40% la primera semana gracias al botón fijo abajo."
                </p>
              </div>
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Gonzalo A.</div>
                  <div className="text-xs text-slate-500">Wess Indumentaria</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">+42% Ventas</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic mb-6">
                  "El selector de Llevá 2 y Llevá 3 nos duplicó el ticket promedio. La gente aprovecha el descuento adicional directamente."
                </p>
              </div>
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Martina S.</div>
                  <div className="text-xs text-slate-500">Kala Cosmética</div>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">2.3x Ticket</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic mb-6">
                  "Cero complicación técnica. En 2 minutos teníamos todo funcionando sin pagar mensualidades exorbitantes de agencias."
                </p>
              </div>
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Lucas R.</div>
                  <div className="text-xs text-slate-500">Nativo Tech Store</div>
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md">60s Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO SE ACTIVA (3 PASOS) */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Activación en 3 sencillos pasos
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Sin programadores, sin instalar aplicaciones pesadas y sin demoras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl relative">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xl rounded-xl flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Comprás tu Licencia</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Completás el pago seguro en Mercado Pago y recibís tu código personal al instante.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl relative">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black text-xl rounded-xl flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pegás el Código</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Entrás a Configuración &gt; Edición avanzada de CSS en tu Tiendanube y pegás el script.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl relative">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-black text-xl rounded-xl flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multiplicás Ventas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tu tienda empieza a mostrar botones pegajosos, ofertas de packs y disparadores de urgencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (FAQ) */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">Preguntas Frecuentes</h2>
            <p className="text-slate-400 text-sm">Todo lo que necesitás saber antes de activar Nevux Pro.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Necesito conocimientos de programación?",
                a: "No, en absoluto. Solo tenés que copiar el código único que te entregamos y pegarlo en el apartado 'Edición avanzada de CSS' dentro de tu panel de Tiendanube."
              },
              {
                q: "¿Afecta la velocidad de carga de mi tienda?",
                a: "No. El script pesa menos de 15KB y corre de manera asíncrona, por lo que tu Tiendanube mantendrá su máxima velocidad de carga intacta."
              },
              {
                q: "¿Puedo pedir cambios o personalizar los colores?",
                a: "Sí, el script incluye variables CSS donde podés modificar los colores principales de las barras y botones para adaptarlos al 100% a la identidad de tu marca."
              },
              {
                q: "¿Cómo es la facturación y el cobro?",
                a: "El cobro de $39.900 ARS se realiza de forma recurrente mensual a través de Mercado Pago. Podés cancelar en cualquier momento sin penalizaciones."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-white flex justify-between items-center gap-4 text-sm sm:text-base hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-slate-400 text-sm border-t border-slate-800/40 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKOUT SECTION / PRICING CARD */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-emerald-500/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              Oferta Lanzamiento 2026
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Pack Landing Page Pro
            </h2>

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-slate-500 line-through text-xl font-bold">$49.900</span>
              <span className="text-4xl sm:text-6xl font-black text-white">$39.900</span>
              <span className="text-slate-400 font-semibold text-sm">ARS / mes</span>
            </div>

            <ul className="max-w-md mx-auto space-y-3 text-left mb-8 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Script Maestro CSS+JS para Tiendanube</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Sticky Bar Celular (Botón de Compra Fijo)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Barra de Urgencia y Stock Limitado</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Notificaciones de Ventas en Vivo Simuladas</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Insignias de Pago Seguro y Envíos</span>
              </li>
            </ul>

            <a
              href={MP_CHECKOUT_URL}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span>ACTIVAR AHORA CON MERCADO PAGO</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="text-xs text-slate-500 mt-4">
              Cobro automático seguro por Mercado Pago. Cancelás en 1 clic cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-800/60 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NevuxLogo size="small" />

          <div>
            © 2026 Nevux. Todos los derechos reservados.
          </div>

          <a
            href="https://wa.me/5493435042812?text=Hola!%20Tengo%20una%20duda%20sobre%20el%20Pack%20Landing%20Pro%20de%20Nevux"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            Soporte por WhatsApp
          </a>
        </div>
      </footer>

      {/* BARRA STICKY MOBILE CTA (PARA LA PROPIA LANDING) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800 z-50 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Pack Landing Pro</div>
          <div className="text-sm font-black text-emerald-400">$39.900 <span className="text-[10px] text-slate-400 font-normal">/mes</span></div>
        </div>
        <a
          href={MP_CHECKOUT_URL}
          className="bg-emerald-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
        >
          <span>Activar Ahora</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
            }
