"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, Star, Flame, Check } from "lucide-react";

interface PhoneMockupProps {
  activeStep: number;
}

export default function PhoneMockup({ activeStep }: PhoneMockupProps) {
  return (
    <div className="relative w-[300px] sm:w-[320px] h-[620px] sm:h-[650px] bg-[#f8f9fa] rounded-[3rem] border-[12px] border-[#161616] shadow-2xl overflow-hidden flex flex-col font-sans shrink-0">
      
      {/* Notch Realista */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#161616] rounded-b-2xl z-50 flex justify-center items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
        <div className="w-2 h-2 rounded-full bg-blue-900/40 border border-blue-800/50"></div>
      </div>

      {/* Interfaz Simulada de la Tienda (Blanca/Clara) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative bg-white">
        
        {/* Navbar Tienda */}
        <div className="h-16 flex items-center justify-between px-5 pt-4 bg-white sticky top-0 z-40">
          <Menu className="w-5 h-5 text-gray-800" />
          <span className="font-extrabold text-sm tracking-tight text-gray-900">NEVUX STORE</span>
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-gray-800" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">2</span>
          </div>
        </div>

        {/* Imagen Producto Simulada */}
        <div className="w-full bg-[#f1f3f5] aspect-square flex items-center justify-center relative">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-3/5 h-3/5 bg-[#e9ecef] rounded-2xl border-4 border-white shadow-sm flex items-center justify-center"
          >
            <div className="w-1/2 h-4/5 bg-[#dee2e6] rounded-lg"></div>
          </motion.div>
        </div>

        {/* Ficha de Producto */}
        <div className="px-5 pt-5 pb-10 space-y-4">
          <div>
            <div className="flex items-center gap-1 text-emerald-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-emerald-500" />
              ))}
              <span className="text-[10px] text-gray-500 font-medium ml-1">4.9 · 128 opiniones</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Buzo Oversize Premium
            </h1>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">$39.900</span>
              <span className="text-xs text-gray-500 line-through">$49.900</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mt-1">
              3 cuotas sin interés de $13.300
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ZONA DINÁMICA: Cambia según el step activo */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Nada extra en el cuerpo, solo muestra que el sticky está abajo */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <p className="text-xs text-gray-400 mt-4 font-medium italic">
                    El usuario scrollea leyendo tu ficha de producto...
                  </p>
                </motion.div>
              )}

              {/* STEP 2: Selector de Packs */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2.5"
                >
                  <p className="text-xs font-bold text-gray-900 mb-1">Elegí tu pack</p>
                  
                  <div className="p-3 rounded-xl border border-gray-200 bg-white flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-700">Llevá 1</div>
                      <div className="text-[10px] text-gray-500">Precio de lista</div>
                    </div>
                    <div className="font-bold text-gray-700 text-sm">$39.900</div>
                  </div>

                  <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center gap-3 relative shadow-sm">
                    <div className="absolute -top-2.5 right-3 bg-[#0a0a0a] text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                      Más Elegido
                    </div>
                    <div className="w-4 h-4 rounded-full border-4 border-emerald-500 bg-white"></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Llevá 2 · 15% OFF</div>
                      <div className="text-[10px] font-semibold text-emerald-600">Ahorrás $11.970</div>
                    </div>
                    <div className="font-black text-gray-900 text-sm">$67.830</div>
                  </div>

                  <div className="p-3 rounded-xl border border-gray-200 bg-white flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-700">Llevá 3 · 25% OFF</div>
                      <div className="text-[10px] text-gray-500">Ahorrás $29.925</div>
                    </div>
                    <div className="font-bold text-gray-700 text-sm">$89.775</div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Barra de Urgencia */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-red-100 shadow-sm rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex justify-between items-center text-[11px] font-bold text-red-600">
                    <span className="flex items-center gap-1.5 uppercase tracking-wide">
                      <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      Quedan pocas unidades
                    </span>
                    <span>88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-red-500 rounded-full"
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 text-center font-medium flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    14 personas mirando este producto
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Prueba Social (Venta en Vivo) */}
              {activeStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 border border-gray-100 flex items-center gap-3 absolute top-0 left-5 right-5 z-50"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900 leading-tight">
                      <span className="font-extrabold">Sofía de Córdoba</span> compró recién 2 unidades.
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">Hace 3 minutos</div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* STICKY BAR SIEMPRE VISIBLE EN EL CELULAR */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="flex gap-2">
          <button className="flex-1 bg-[#0a0a0a] text-white font-extrabold text-sm h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            Agregar al carrito
          </button>
        </div>
      </div>

    </div>
  );
      }
