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
  Copy
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function LandingPage() {
  const [storeUrl, setStoreUrl] = useState("");
  const [platform, setPlatform] = useState<"tiendanube" | "shopify">("tiendanube");
  const [simMode, setSimMode] = useState<"antes" | "despues">("despues");
  const [selectedTemplate, setSelectedTemplate] = useState<"clasica" | "oscura" | "split">("clasica");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const MP_CHECKOUT_URL = "https://mpago.la/1LqFYin";

  const handleStartActivation = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirige al checkout de Mercado Pago
    window.location.href = MP_CHECKOUT_URL;
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <NevuxLogo size="md" />

          <div className="flex items-center gap-4">
            <a
              href={MP_CHECKOUT_URL}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Iniciar sesión
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
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
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
            Multiplicá tus ventas en Tiendanube instalando el Pack Landing Pro en 60 segundos. Sin tocar código complejo y sin pagar mantenimiento mensual.
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
                  placeholder="Escribí el nombre de tu tienda (ej: mi-tienda.com)"
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pago seguro con Mercado Pago
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
              <span>(+120 tiendas activas en Argentina)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SIMULADOR ANTES / DESPUÉS INTERACTIVO */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/60 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Mirá el cambio en tiempo real
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Pasá de una ficha de producto común a una página de venta que despierta el deseo de compra instantáneo.
            </p>

            {/* Selector Toggle */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 mt-6">
              <button
                onClick={() => setSimMode("despues")}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  simMode === "despues"
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Con Nevux Pro (Alta Conversión)
              </button>
              <button
                onClick={() => setSimMode("antes")}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  simMode === "antes"
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tiendanube Estándar
              </button>
            </div>
          </div>

          {/* SIMULADOR CELULAR */}
          <div className="max-w-sm mx-auto">
            <div className="relative rounded-[40px] border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden min-h-[580px]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-30" />

              <AnimatePresence mode="wait">
                {simMode === "despues" ? (
                  <motion.div
                    key="despues"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-4 pt-8 text-left space-y-4"
                  >
                    {/* Header tienda */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="h-4 w-20 bg-emerald-500/20 rounded animate-pulse" />
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    </div>

                    {/* Foto de producto */}
                    <div className="relative h-48 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                      <span className="text-xs text-slate-500 font-semibold">Imagen HQ HD</span>
                      <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                        OFERTA 25% OFF
                      </div>
                    </div>

                    {/* Urgencia / Stock */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                      <div className="flex justify-between text-[11px] font-bold text-amber-400 mb-1">
                        <span>🔥 ¡Pocas unidades disponibles!</span>
                        <span>84% vendido</span>
                      </div>
                      <div className="w-full h-1.5 bg-amber-950 rounded-full overflow-hidden">
                        <div className="w-[84%] h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full animate-pulse" />
                      </div>
                    </div>

                    {/* Titulo y Precio */}
                    <div>
                      <h3 className="text-base font-bold text-white">Zapatillas Running Pro 2.0</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-black text-emerald-400">$39.900</span>
                        <span className="text-xs text-slate-500 line-through">$49.900</span>
                      </div>
                    </div>

                    {/* Selector de Oferta Pack */}
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Llevá 2 pares (15% EXTRA)</div>
                            <div className="text-[10px] text-slate-400">Más vendido</div>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-400">$66.130</span>
                      </div>
                    </div>

                    {/* Insignias de confianza */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                      <div>🚚 Envío Gratis</div>
                      <div>💳 3 Cuotas</div>
                      <div>🔒 Garantía</div>
                    </div>

                    {/* Botón Flotante Sticky (Simulado) */}
                    <div className="pt-2">
                      <button className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
                        <span>COMPRAR AHORA EN 1 CLIC</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="antes"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-4 pt-8 text-left space-y-4 filter opacity-60 grayscale"
                  >
                    <div className="h-4 w-20 bg-slate-800 rounded" />
                    <div className="h-48 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                      <span className="text-xs text-slate-600">Foto Estándar</span>
                    </div>
                    <div>
                      <div className="h-4 w-40 bg-slate-800 rounded mb-2" />
                      <div className="h-6 w-24 bg-slate-800 rounded" />
                    </div>
                    <div className="h-10 bg-slate-800 rounded-lg" />
                    <div className="h-12 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                      Agregar al carrito
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

      {/* MÉTODO AIDA (4 TARJETAS CON COLORES) */}
      <section className="py-20 bg-slate-950/80 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Diseñado con el Método AIDA
            </h2>
            <p className="text-slate-400 text-base">
              La estructura psicológica de conversión utilizada por los e-commerce líderes a nivel mundial.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* A - Atención */}
            <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Paso 1</div>
              <h3 className="text-lg font-bold text-white mb-2">ATENCIÓN</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Capturá la atención del visitante en los primeros 3 segundos con barras fijas de urgencia y ofertas visuales.
              </p>
            </div>

            {/* I - Interés */}
            <div className="bg-slate-900 border border-blue-500/30 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Paso 2</div>
              <h3 className="text-lg font-bold text-white mb-2">INTERÉS</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Destacá las insignias de envío gratis, cuotas sin interés y prueba social para eliminar la incertidumbre.
              </p>
            </div>

            {/* D - Deseo */}
            <div className="bg-slate-900 border border-purple-500/30 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Paso 3</div>
              <h3 className="text-lg font-bold text-white mb-2">DESEO</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Incentivá la compra de más unidades proponiendo paquetes promocionales tipo "Llevá 2 con 15% OFF".
              </p>
            </div>

            {/* A - Acción */}
            <div className="bg-slate-900 border border-pink-500/30 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">Paso 4</div>
              <h3 className="text-lg font-bold text-white mb-2">ACCIÓN</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                El botón de compra fija (Sticky Bar) acompaña todo el scroll del usuario en el celular para un checkout inmediato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANTILLAS INCLUIDAS */}
      <section className="py-20 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              3 Estilos visuales listos para activar
            </h2>
            <p className="text-slate-400 text-base">
              Podés cambiar de plantilla con solo ajustar una variable en tu script.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Plantilla 1 */}
            <div
              onClick={() => setSelectedTemplate("clasica")}
              className={`cursor-pointer bg-slate-900 p-6 rounded-2xl border transition-all ${
                selectedTemplate === "clasica"
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="h-40 bg-slate-950 rounded-xl mb-4 border border-slate-800 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-400">Estilo Clásico Clean</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Plantilla Clásica</h3>
              <p className="text-slate-400 text-xs">Ideal para tiendas de indumentaria y accesorios minimalistas.</p>
            </div>

            {/* Plantilla 2 */}
            <div
              onClick={() => setSelectedTemplate("oscura")}
              className={`cursor-pointer bg-slate-900 p-6 rounded-2xl border transition-all ${
                selectedTemplate === "oscura"
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="h-40 bg-slate-950 rounded-xl mb-4 border border-slate-800 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-400">Estilo Oscuro Premium</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Oscura Premium</h3>
              <p className="text-slate-400 text-xs">Perfecto para electrónica, suplementos y productos tecnologicos.</p>
            </div>

            {/* Plantilla 3 */}
            <div
              onClick={() => setSelectedTemplate("split")}
              className={`cursor-pointer bg-slate-900 p-6 rounded-2xl border transition-all ${
                selectedTemplate === "split"
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="h-40 bg-slate-950 rounded-xl mb-4 border border-slate-800 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-400">Estilo Antes & Después</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Antes y Después</h3>
              <p className="text-slate-400 text-xs">Diseñado para belleza, cosmética y transformaciones visibles.</p>
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
          <NevuxLogo size="sm" />

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
    </div>
  );
              }
