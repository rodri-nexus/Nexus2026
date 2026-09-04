'use client';

import React, { useState } from 'react';
import { 
  Image as ImageIcon, Smartphone, Palette, Check, Copy, ArrowLeft, ChevronLeft, 
  Video, Phone, MoreVertical, Pin, Play, Mic, Paperclip, Camera, Smile, 
  Send, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ShoppingBag, 
  Zap, Award, Gift, RefreshCw, Star, Users, MessageSquare, ThumbsUp, ArrowRight
} from 'lucide-react';

// ==========================================
// DATA: BANNERS PARTNERS (TAB 1)
// ==========================================
const bannersPartnersData = [
  {
    id: 1,
    titleEs: "Multiplicá tus Ventas y Ticket Promedio",
    titlePt: "Multiplique suas Vendas e Ticket Médio",
    descEs: "Widgets estratégicos de conversión para tu tienda online. Creado para vender más en Tiendanube.",
    descPt: "Widgets estratégicos de conversão para sua loja online. Criado para vender mais na Nuvemshop.",
    badge: "Aumentá tu ROI",
    color: "from-emerald-600 to-teal-800"
  },
  {
    id: 2,
    titleEs: "+27 Widgets de Conversión en 1 Click",
    titlePt: "+27 Widgets de Conversão em 1 Clique",
    descEs: "Barra de progreso, ruleta de descuentos, bundles, tabla de talles interactiva y mucho más.",
    descPt: "Barra de progresso, roleta de descontos, bundles, tabela de tamanhos e muito mais.",
    badge: "Catálogo Completo",
    color: "from-teal-600 to-emerald-900"
  },
  {
    id: 3,
    titleEs: "NevuxBot IA: Recuperá Carritos por WhatsApp",
    titlePt: "NevuxBot IA: Recupere Carrinhos pelo WhatsApp",
    descEs: "Inteligencia artificial que contacta a tus clientes por WhatsApp y recupera ventas automáticamente.",
    descPt: "Inteligência artificial que contacta seus clientes pelo WhatsApp e recupera vendas automaticamente.",
    badge: "Automatización IA",
    color: "from-emerald-500 to-green-700"
  },
  {
    id: 4,
    titleEs: "ROI Analytics en Vivo: Medí tus Ganancias",
    titlePt: "ROI Analytics ao Vivo: Meça seus Lucros",
    descEs: "Panel en tiempo real que muestra la facturación extra exacta generada por los widgets.",
    descPt: "Painel em tempo real que mostra o faturamento extra exato gerado pelos widgets.",
    badge: "Telemetría Real",
    color: "from-green-600 to-emerald-800"
  },
  {
    id: 5,
    titleEs: "App Oficial Aprobada para LATAM",
    titlePt: "App Oficial Aprovado para LATAM",
    descEs: "Instalación en 30 segundos sin tocar código. Compatible con todos los layouts de Tiendanube.",
    descPt: "Instalação em 30 segundos sem tocar em código. Compatível com todos os temas da Nuvemshop.",
    badge: "100% Seguro",
    color: "from-emerald-700 to-slate-900"
  }
];

// ==========================================
// DATA: TESTIMONIOS WHATSAPP DARK MODE (TAB 2 - DESTACADA 3)
// ==========================================
const testimoniosData = [
  {
    id: 1,
    name: "Mariana • Indumentaria",
    location: "Buenos Aires",
    avatar: "👩‍💼",
    status: "en línea",
    metricBadge: "+$450.000 EXTRA en 5 días 🚀",
    storeName: "Marii_Store",
    beforeText: "Hola Rodri! Consulta, el widget de la tabla de talles va en todas las variantes?",
    clientMsg: "Che Rodri no sabés!! Pusimos el de la Tabla de Talles y el Bundle de Promociones la semana pasada... MÁS DE 450 LUCAS EXTRA EN 5 DÍAS 😱🔥 La gente compra directo 2 o 3 prendas de una. Posta mil gracias boludo, nos cambió la tienda completamente 🙌💚",
    clientTime: "15:42",
    creatorMsg: "¡¡Vaaaaamaaaa Mariana!! 🥳 No sabés lo contento que me pone leer esto che. El bundle de indumentaria es clave total para subir el ticket. ¡A reventarla en ventas este mes! 🚀🚀",
    creatorTime: "15:44",
    afterText: "Te hago otra consulta sobre los packs...",
  },
  {
    id: 2,
    name: "Fede • Sneakers Córdoba",
    location: "Córdoba",
    avatar: "👟",
    status: "hace 5 min",
    metricBadge: "+35% Ventas en Checkout 👟🔥",
    storeName: "Cordoba_Kicks",
    beforeText: "Rodri ahí lo activamos en la tienda de zapatillas",
    clientMsg: "Hermanooo te juro que no lo puedo creer jajaja. Con la ruleta de descuentos y las cuotas fijas en el checkout se nos dispararon las ventas un 35% en Córdoba 👟🔥 Pensé que era humo pero la prueba gratis ya se pagó sola 20 veces. ¡Un caño Nevux! 👏",
    clientTime: "18:12",
    creatorMsg: "¡Qué grande Fede! 💪🔥 Las zapatillas vuelan cuando le das confianza al cliente con cuotas y el incentivo de la ruleta. ¡Gracias por confiar culiau, a seguir escalando!",
    creatorTime: "18:15",
    afterText: "Che me preguntaron de otra marca...",
  },
  {
    id: 3,
    name: "Cami • Cosmética Natural",
    location: "Rosario",
    avatar: "🧴",
    status: "en línea",
    metricBadge: "Ticket Promedio $18k ➔ $34k ✨",
    storeName: "Cami_Glow",
    beforeText: "Holaa Rodri buenas tardes!!",
    clientMsg: "Hola Rodri!! Te escribo para agradecerte posta. La barra de progreso de envío gratis + el pack de sérums en la ficha de producto nos subió el ticket promedio de $18k a $34k en dos semanas 🧴✨ Mis clientas aman la experiencia visual. Sos un genio!!",
    clientTime: "11:20",
    creatorMsg: "¡Hermoso Cami! 🥰 Casi duplicaron el ticket promedio, una locura total. Esos packs para cosmética son una bomba. ¡Cualquier duda que tengas me avisás al toque! 💚",
    creatorTime: "11:23",
    afterText: "Siii mil gracias genio!",
  },
  {
    id: 4,
    name: "Nico • Home & Deco",
    location: "Mendoza",
    avatar: "🏡",
    status: "en línea",
    metricBadge: "$1.2M en 1 Fin de Semana 📦",
    storeName: "Mendoza_Deco",
    beforeText: "Viejo te hago una consulta rápida...",
    clientMsg: "Viejo no te miento, estaba por cerrar la tienda porque no llegaba a cubrir pauta... instalé Nevux, puse la cuenta regresiva + envío en 24hs y en un solo fin de semana vendí $1.2M 📦🏡 Me salvaste el negocio en serio chabón. Eternamente agradecido 🥹",
    clientTime: "20:05",
    creatorMsg: "Nooo Nico, me emociona un montón leer esto boludo... 🥹❤️ Para esto creé Nevux, para darle herramientas reales a los emprendedores. ¡No aflojes que recién empieza!",
    creatorTime: "20:08",
    afterText: "Posta gracias de corazón hermano",
  },
  {
    id: 5,
    name: "Sofi • Sportwear",
    location: "Mar del Plata",
    avatar: "🏃‍♀️",
    status: "hace 12 min",
    metricBadge: "Stock Agotado en 3 Días 🏃‍♀️💨",
    storeName: "Sofi_Fit",
    beforeText: "Buenas Rodri! Te hablo de parte de Sofi",
    clientMsg: "Rodri genio!! Te cuento que el contador de visitas en vivo y las reseñas con foto le dieron una confianza tremenda a la web. Vendimos todo el stock de calzas en 3 días 🏃‍♀️💨 Ya le recomendé Nevux a 3 marcas amigas jaja!",
    clientTime: "14:30",
    creatorMsg: "¡Jajaja sos la mejor Sofi! 🙌 Gracias por la recomendación boca en boca, es lo más valioso. ¡A reponer stock urgente que la tienda no para! ⚡",
    creatorTime: "14:33",
    afterText: "Jajaja si ya estamos fabricando más!",
  },
  {
    id: 6,
    name: "Martín • Suplementos Fitness",
    location: "BsAs",
    avatar: "💪",
    status: "en línea",
    metricBadge: "+$890.000 Generados (ROI x20) 📊",
    storeName: "Nutri_Fit_Arg",
    beforeText: "Hola Rodrigo, recién revisé el Analytics",
    clientMsg: "Che Rodrigo te hago una devolución sincera: es la PRIMERA app de Tiendanube que realmente cumple lo que promete sin vueltas. El ROI Tracker me marca +$890.000 generados gracias a los widgets. Vale cada peso del plan 💯🔥",
    clientTime: "17:50",
    creatorMsg: "¡Muchas gracias Martín! 🤝 Nos matamos trabajando para que cada peso invertido vuelva multiplicado x10. ¡Abrazo enorme bro!",
    creatorTime: "17:53",
    afterText: "Abrazo enorme crack!",
  }
];

// ==========================================
// DATA: PORTADAS DESTACADAS INSTAGRAM (TAB 3)
// ==========================================
const portadasData = [
  { id: 1, title: "El Problema", icon: AlertTriangle, color: "from-red-500 to-rose-700" },
  { id: 2, title: "La Solución", icon: Zap, color: "from-emerald-500 to-teal-700" },
  { id: 3, title: "Testimonios", icon: MessageSquare, color: "from-emerald-400 to-green-600" },
  { id: 4, title: "NevuxBot IA", icon: Sparkles, color: "from-teal-500 to-cyan-700" },
  { id: 5, title: "Analytics ROI", icon: TrendingUp, color: "from-green-500 to-emerald-700" },
  { id: 6, title: "Modo Fechas", icon: Gift, color: "from-emerald-600 to-emerald-900" },
  { id: 7, title: "Estilo Marca", icon: Palette, color: "from-teal-400 to-emerald-600" },
  { id: 8, title: "Cross-Sell IA", icon: ShoppingBag, color: "from-green-600 to-teal-800" },
  { id: 9, title: "Multi-Idioma", icon: Star, color: "from-emerald-500 to-teal-600" },
  { id: 10, title: "Búsqueda Voz", icon: Mic, color: "from-teal-600 to-cyan-800" },
  { id: 11, title: "Vendedor IA", icon: Users, color: "from-emerald-700 to-slate-900" }
];

export default function BannersAdminPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'historias' | 'portadas'>('historias');
  const [lang, setLang] = useState<'ES' | 'PT'>('ES');
  const [activeHighlight, setActiveHighlight] = useState<number>(3); // Default: Testimonios (3)
  const [currentTestimonioIndex, setCurrentTestimonioIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentTestimonio = testimoniosData[currentTestimonioIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 font-sans">
      {/* HEADER PRINCIPAL */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" /> Panel Visual Nevux
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generador de contenido oficial para Tiendanube LATAM & Instagram
          </p>
        </div>

        {/* NAVEGACIÓN PRINCIPAL DE PESTAÑAS */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'banners' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 🖼️ Banners Partners
          </button>
          <button
            onClick={() => setActiveTab('historias')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'historias' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" /> 📱 Historias Instagram
          </button>
          <button
            onClick={() => setActiveTab('portadas')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'portadas' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" /> 🎨 Portadas
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ========================================== */}
        {/* TAB 1: BANNERS PARTNERS (ES / PT) */}
        {/* ========================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Idioma de Banners:</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setLang('ES')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    lang === 'ES' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇦🇷 / 🇲🇽 Español
                </button>
                <button
                  onClick={() => setLang('PT')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    lang === 'PT' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇧🇷 Português BR
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bannersPartnersData.map((banner) => {
                const title = lang === 'ES' ? banner.titleEs : banner.titlePt;
                const desc = lang === 'ES' ? banner.descEs : banner.descPt;
                return (
                  <div key={banner.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
                    <div className={`p-6 bg-gradient-to-br ${banner.color} min-h-[180px] flex flex-col justify-between relative`}>
                      <span className="bg-black/40 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full w-max border border-emerald-500/30">
                        {banner.badge}
                      </span>
                      <div>
                        <h3 className="text-lg font-black text-white leading-tight mb-2">{title}</h3>
                        <p className="text-xs text-slate-200 opacity-90 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">Banner #{banner.id} (1200x630px)</span>
                      <button
                        onClick={() => handleCopyText(`${title} - ${desc}`, banner.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs"
                      >
                        {copiedId === banner.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === banner.id ? '¡Copiado!' : 'Copiar Texto'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: HISTORIAS INSTAGRAM (FORMATO 9:16) */}
        {/* ========================================== */}
        {activeTab === 'historias' && (
          <div className="space-y-6">
            {/* SELECTOR DE HISTORIA DESTACADA */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveHighlight(1)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeHighlight === 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                🚨 1. El Problema (7)
              </button>
              <button
                onClick={() => setActiveHighlight(2)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeHighlight === 2 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                ⚡ 2. La Solución (8)
              </button>
              <button
                onClick={() => setActiveHighlight(3)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeHighlight === 3 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                💬 3. Testimonios ({testimoniosData.length})
              </button>
            </div>

            {/* DESTACADA 3: TESTIMONIOS CON SIMULADOR WHATSAPP DARK MODE */}
            {activeHighlight === 3 && (
              <div className="flex flex-col items-center">
                {/* SELECTOR RÁPIDO DE CLIENTE */}
                <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-md">
                  {testimoniosData.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setCurrentTestimonioIndex(idx)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        currentTestimonioIndex === idx
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {t.avatar} {t.name.split('•')[0]}
                    </button>
                  ))}
                </div>

                {/* HISTORIA 9:16 MARCO CELULAR */}
                <div className="w-full max-w-[360px] aspect-[9/16] bg-slate-950 rounded-[36px] border-4 border-slate-800 shadow-2xl overflow-hidden relative flex flex-col justify-between p-3 my-2">
                  
                  {/* TOP INSTAGRAM BARS & HEADER */}
                  <div className="z-20 relative space-y-2">
                    {/* BARRAS DE PROGRESO */}
                    <div className="flex gap-1">
                      {testimoniosData.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            idx <= currentTestimonioIndex ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>

                    {/* HEADER INSTAGRAM USER */}
                    <div className="flex items-center justify-between text-white px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs border border-emerald-300">
                          N
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none">nevux.app <span className="text-[10px] opacity-70 font-normal">2 h</span></p>
                          <p className="text-[10px] text-emerald-400 font-semibold leading-none mt-0.5">Destacada 3 • Testimonios Reales</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-300 font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                        {currentTestimonioIndex + 1}/{testimoniosData.length}
                      </span>
                    </div>
                  </div>

                  {/* CHAT SIMULADOR WHATSAPP DARK MODE TAL CUAL LA IMAGEN REAL */}
                  <div className="flex-1 my-2 bg-[#0b141a] rounded-2xl overflow-hidden border border-[#2a3942] flex flex-col shadow-inner relative">
                    
                    {/* WHATSAPP DARK HEADER */}
                    <div className="bg-[#202c33] text-white px-3 py-2 flex items-center justify-between border-b border-[#2a3942] shrink-0">
                      <div className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4 text-[#8696a0]" />
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm overflow-hidden border border-emerald-400/30">
                          {currentTestimonio.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-[#e9edef] leading-tight">{currentTestimonio.name}</h4>
                          <p className="text-[9px] text-[#8696a0] leading-none mt-0.5">{currentTestimonio.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[#aebac1]">
                        <Video className="w-3.5 h-3.5" />
                        <Phone className="w-3.5 h-3.5" />
                        <MoreVertical className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* PINNED LINK BANNER (TAL CUAL CAPTURA RELEVADA) */}
                    <div className="bg-[#182229] px-3 py-1 border-b border-[#222d34] flex items-center gap-1.5 text-[10px] text-[#8696a0] shrink-0">
                      <Pin className="w-3 h-3 text-[#00a884] shrink-0" />
                      <span className="truncate font-mono text-[10px] text-[#00a884] underline">https://nexus2026-gx7e.vercel.app</span>
                    </div>

                    {/* CHAT BODY CON DOODLE BACKGROUND Y MENSAJES */}
                    <div 
                      className="flex-1 p-2.5 overflow-y-auto space-y-2 flex flex-col justify-center relative"
                      style={{
                        backgroundColor: '#0b141a',
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0)`,
                        backgroundSize: '14px 14px',
                      }}
                    >
                      {/* BURBUJA CONTEXTO ARRIBA (BORROSA) */}
                      <div className="flex justify-start my-0.5 select-none pointer-events-none filter blur-[3px] opacity-35">
                        <div className="max-w-[85%] bg-[#202c33] text-[#e9edef] rounded-lg p-2 text-[10px]">
                          <p>{currentTestimonio.beforeText}</p>
                        </div>
                      </div>

                      {/* AUDIO FALSO DE CONTEXTO (BORROSO) */}
                      <div className="flex justify-start my-0.5 select-none pointer-events-none filter blur-[3px] opacity-35">
                        <div className="bg-[#202c33] text-[#e9edef] rounded-lg p-2 flex items-center gap-2 text-[10px]">
                          <div className="w-5 h-5 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </div>
                          <div className="h-1 bg-[#8696a0] w-20 rounded-full"></div>
                          <span className="text-[9px] text-[#8696a0]">0:18</span>
                        </div>
                      </div>

                      {/* MENSAJE DESTACADO DEL CLIENTE (BRIGHT GREEN GLOW) */}
                      <div className="flex justify-start my-1 relative z-10 animate-fade-in">
                        <div className="max-w-[92%] bg-[#202c33] text-[#e9edef] rounded-xl rounded-tl-none p-3 text-xs border-2 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.35)] relative">
                          <p className="leading-relaxed font-medium">{currentTestimonio.clientMsg}</p>
                          <span className="block text-[9px] text-[#8696a0] text-right mt-1 font-mono">{currentTestimonio.clientTime}</span>
                        </div>
                      </div>

                      {/* RESPUESTA DESTACADA DEL CREADOR (WHATSAPP DARK GREEN + GLOW) */}
                      <div className="flex justify-end my-1 relative z-10 animate-fade-in">
                        <div className="max-w-[92%] bg-[#005c4b] text-white rounded-xl rounded-tr-none p-3 text-xs border-2 border-[#10B981] shadow-[0_0_25px_rgba(16,185,129,0.45)] relative">
                          <p className="leading-relaxed font-medium">{currentTestimonio.creatorMsg}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[9px] text-[#e9edef]/80 font-mono">{currentTestimonio.creatorTime}</span>
                            <span className="text-[10px] text-[#53bdeb] font-bold">✓✓</span>
                          </div>
                        </div>
                      </div>

                      {/* BURBUJA CONTEXTO ABAJO (BORROSA) */}
                      <div className="flex justify-end my-0.5 select-none pointer-events-none filter blur-[3px] opacity-35">
                        <div className="max-w-[85%] bg-[#005c4b] text-[#e9edef] rounded-lg p-2 text-[10px]">
                          <p>{currentTestimonio.afterText}</p>
                        </div>
                      </div>
                    </div>

                    {/* WHATSAPP DARK FOOTER */}
                    <div className="bg-[#202c33] p-1.5 flex items-center gap-1.5 border-t border-[#2a3942] shrink-0">
                      <div className="flex-1 bg-[#2a3942] rounded-full px-2.5 py-1 flex items-center gap-2 text-[#8696a0] text-[10px]">
                        <Smile className="w-3.5 h-3.5" />
                        <span className="flex-1 text-[#8696a0]">Mensaje</span>
                        <Paperclip className="w-3.5 h-3.5" />
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0">
                        <Mic className="w-3.5 h-3.5" />
                      </div>
                    </div>

                  </div>

                  {/* INSTAGRAM BADGE STICKER DE IMPACTO */}
                  <div className="z-20 my-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-3 py-1.5 rounded-xl font-black text-center text-xs shadow-lg flex items-center justify-center gap-1.5 border border-emerald-300">
                    <span>{currentTestimonio.metricBadge}</span>
                  </div>

                  {/* BOTTOM ACTION CTA */}
                  <div className="z-20 text-center py-1 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1">
                      🔥 Caso Real Tiendanube • Deslizá arriba <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </p>
                  </div>

                </div>

                {/* CONTROLES NAVEGACIÓN HISTORIAS */}
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => setCurrentTestimonioIndex((prev) => (prev > 0 ? prev - 1 : testimoniosData.length - 1))}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  <button
                    onClick={() => setCurrentTestimonioIndex((prev) => (prev < testimoniosData.length - 1 ? prev + 1 : 0))}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1"
                  >
                    Siguiente <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* DESTACADA 1 Y 2 PLACEHOLDERS Y DESCRIPCIÓN */}
            {activeHighlight === 1 && (
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Destacada 1: El Problema (7 Historias)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enfocada en resolver el bajo ticket promedio, la desconfianza del comprador y el abandono de carritos.
                </p>
              </div>
            )}

            {activeHighlight === 2 && (
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                <Zap className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Destacada 2: La Solución (8 Historias)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Demostración interactiva de los 27 widgets estratégicos activables en 1 click para Tiendanube.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: PORTADAS DESTACADAS INSTAGRAM */}
        {/* ========================================== */}
        {activeTab === 'portadas' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {portadasData.map((portada) => {
              const IconComponent = portada.icon;
              return (
                <div key={portada.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${portada.color} flex items-center justify-center text-white shadow-xl mb-3 border-2 border-slate-950 ring-2 ring-emerald-500/30`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-bold text-white">{portada.title}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5">Portada #{portada.id}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
    }
