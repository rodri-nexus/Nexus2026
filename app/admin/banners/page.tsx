'use client';

import React, { useState } from 'react';
import { 
  ImageIcon, Smartphone, Palette, Check, Copy, ChevronLeft, 
  Video, Phone, MoreVertical, Pin, Play, Mic, Paperclip, Camera, Smile, 
  Sparkles, TrendingUp, AlertTriangle, Zap, Gift, Star, Users, MessageSquare, ArrowRight
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
    bgGradient: "linear-gradient(135deg, #059669 0%, #064e3b 100%)"
  },
  {
    id: 2,
    titleEs: "+27 Widgets de Conversión en 1 Click",
    titlePt: "+27 Widgets de Conversão em 1 Clique",
    descEs: "Barra de progreso, ruleta de descuentos, bundles, tabla de talles interactiva y mucho más.",
    descPt: "Barra de progresso, roleta de descontos, bundles, tabela de tamanhos e muito mais.",
    badge: "Catálogo Completo",
    bgGradient: "linear-gradient(135deg, #0d9488 0%, #115e59 100%)"
  },
  {
    id: 3,
    titleEs: "NevuxBot IA: Recuperá Carritos por WhatsApp",
    titlePt: "NevuxBot IA: Recupere Carrinhos pelo WhatsApp",
    descEs: "Inteligencia artificial que contacta a tus clientes por WhatsApp y recupera ventas automáticamente.",
    descPt: "Inteligência artificial que contacta seus clientes pelo WhatsApp e recupera vendas automaticamente.",
    badge: "Automatización IA",
    bgGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)"
  },
  {
    id: 4,
    titleEs: "ROI Analytics en Vivo: Medí tus Ganancias",
    titlePt: "ROI Analytics ao Vivo: Meça seus Lucros",
    descEs: "Panel en tiempo real que muestra la facturación extra exacta generada por los widgets.",
    descPt: "Painel em tempo real que mostra o faturamento extra exato gerado pelos widgets.",
    badge: "Telemetría Real",
    bgGradient: "linear-gradient(135deg, #16a34a 0%, #14532d 100%)"
  },
  {
    id: 5,
    titleEs: "App Oficial Aprobada para LATAM",
    titlePt: "App Oficial Aprovado para LATAM",
    descEs: "Instalación en 30 segundos sin tocar código. Compatible con todos los layouts de Tiendanube.",
    descPt: "Instalação em 30 segundos sem tocar em código. Compatível com todos os temas da Nuvemshop.",
    badge: "100% Seguro",
    bgGradient: "linear-gradient(135deg, #0f766e 0%, #0f172a 100%)"
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
  { id: 1, title: "El Problema", icon: AlertTriangle, bgGradient: "linear-gradient(135deg, #ef4444, #9f1239)" },
  { id: 2, title: "La Solución", icon: Zap, bgGradient: "linear-gradient(135deg, #10b981, #0f766e)" },
  { id: 3, title: "Testimonios", icon: MessageSquare, bgGradient: "linear-gradient(135deg, #34d399, #059669)" },
  { id: 4, title: "NevuxBot IA", icon: Sparkles, bgGradient: "linear-gradient(135deg, #14b8a6, #0e7490)" },
  { id: 5, title: "Analytics ROI", icon: TrendingUp, bgGradient: "linear-gradient(135deg, #22c55e, #047857)" },
  { id: 6, title: "Modo Fechas", icon: Gift, bgGradient: "linear-gradient(135deg, #059669, #064e3b)" },
  { id: 7, title: "Estilo Marca", icon: Palette, bgGradient: "linear-gradient(135deg, #2dd4bf, #047857)" },
  { id: 8, title: "Cross-Sell IA", icon: ShoppingBag, bgGradient: "linear-gradient(135deg, #16a34a, #115e59)" },
  { id: 9, title: "Multi-Idioma", icon: Star, bgGradient: "linear-gradient(135deg, #10b981, #0f766e)" },
  { id: 10, title: "Búsqueda Voz", icon: Mic, bgGradient: "linear-gradient(135deg, #0d9488, #164e63)" },
  { id: 11, title: "Vendedor IA", icon: Users, bgGradient: "linear-gradient(135deg, #047857, #0f172a)" }
];

export default function BannersAdminPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'historias' | 'portadas'>('historias');
  const [lang, setLang] = useState<'ES' | 'PT'>('ES');
  const [activeHighlight, setActiveHighlight] = useState<number>(3);
  const [currentTestimonioIndex, setCurrentTestimonioIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentTestimonio = testimoniosData[currentTestimonioIndex];

  return (
    <div style={{ backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* HEADER PRINCIPAL */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 24px auto', paddingBottom: '16px', borderBottom: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', display: 'flex', itemsCenter: 'center', gap: '8px', margin: 0 }}>
            <Sparkles style={{ color: '#34d399', width: '24px', height: '24px' }} /> Panel Visual Nevux
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Generador de contenido oficial para Tiendanube LATAM & Instagram
          </p>
        </div>

        {/* NAVEGACIÓN PRINCIPAL DE PESTAÑAS */}
        <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '4px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <button
            onClick={() => setActiveTab('banners')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'banners' ? '#059669' : 'transparent',
              color: activeTab === 'banners' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <ImageIcon style={{ width: '16px', height: '16px' }} /> 🖼️ Banners Partners
          </button>
          <button
            onClick={() => setActiveTab('historias')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'historias' ? '#059669' : 'transparent',
              color: activeTab === 'historias' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <Smartphone style={{ width: '16px', height: '16px' }} /> 📱 Historias Instagram
          </button>
          <button
            onClick={() => setActiveTab('portadas')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'portadas' ? '#059669' : 'transparent',
              color: activeTab === 'portadas' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <Palette style={{ width: '16px', height: '16px' }} /> 🎨 Portadas
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* ========================================== */}
        {/* TAB 1: BANNERS PARTNERS (ES / PT) */}
        {/* ========================================== */}
        {activeTab === 'banners' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>Idioma de Banners:</span>
              <div style={{ display: 'flex', gap: '6px', backgroundColor: '#020617', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <button
                  onClick={() => setLang('ES')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: lang === 'ES' ? '#10b981' : 'transparent',
                    color: lang === 'ES' ? '#020617' : '#94a3b8'
                  }}
                >
                  🇦🇷 / 🇲🇽 Español
                </button>
                <button
                  onClick={() => setLang('PT')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: lang === 'PT' ? '#10b981' : 'transparent',
                    color: lang === 'PT' ? '#020617' : '#94a3b8'
                  }}
                >
                  🇧🇷 Português BR
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {bannersPartnersData.map((banner) => {
                const title = lang === 'ES' ? banner.titleEs : banner.titlePt;
                const desc = lang === 'ES' ? banner.descEs : banner.descPt;
                return (
                  <div key={banner.id} style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '24px', background: banner.bgGradient, minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <span style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#6ee7b7', fontSize: '10px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px', width: 'max-content', border: '1px solid rgba(16,185,129,0.3)' }}>
                        {banner.badge}
                      </span>
                      <div style={{ marginTop: '16px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0', lineHeight: 1.2 }}>{title}</h3>
                        <p style={{ fontSize: '12px', color: '#e2e8f0', opacity: 0.9, margin: 0, lineHeight: 1.4 }}>{desc}</p>
                      </div>
                    </div>
                    <div style={{ padding: '12px 16px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '11px' }}>Banner #{banner.id} (1200x630px)</span>
                      <button
                        onClick={() => handleCopyText(`${title} - ${desc}`, banner.id)}
                        style={{ backgroundColor: '#1e293b', color: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}
                      >
                        {copiedId === banner.id ? <Check style={{ width: '14px', height: '14px', color: '#34d399' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* SELECTOR DE HISTORIA DESTACADA */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => setActiveHighlight(1)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeHighlight === 1 ? '#059669' : '#0f172a',
                  color: activeHighlight === 1 ? '#ffffff' : '#94a3b8'
                }}
              >
                🚨 1. El Problema (7)
              </button>
              <button
                onClick={() => setActiveHighlight(2)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeHighlight === 2 ? '#059669' : '#0f172a',
                  color: activeHighlight === 2 ? '#ffffff' : '#94a3b8'
                }}
              >
                ⚡ 2. La Solución (8)
              </button>
              <button
                onClick={() => setActiveHighlight(3)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeHighlight === 3 ? '#059669' : '#0f172a',
                  color: activeHighlight === 3 ? '#ffffff' : '#94a3b8'
                }}
              >
                💬 3. Testimonios ({testimoniosData.length})
              </button>
            </div>

            {/* DESTACADA 3: TESTIMONIOS CON SIMULADOR WHATSAPP DARK MODE */}
            {activeHighlight === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* SELECTOR RÁPIDO DE CLIENTE */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '16px', maxWidth: '450px' }}>
                  {testimoniosData.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setCurrentTestimonioIndex(idx)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: currentTestimonioIndex === idx ? '#10b981' : '#0f172a',
                        color: currentTestimonioIndex === idx ? '#020617' : '#94a3b8'
                      }}
                    >
                      {t.avatar} {t.name.split('•')[0]}
                    </button>
                  ))}
                </div>

                {/* HISTORIA 9:16 MARCO CELULAR */}
                <div style={{
                  width: '100%',
                  maxWidth: '360px',
                  aspectRatio: '9/16',
                  backgroundColor: '#020617',
                  borderRadius: '36px',
                  border: '4px solid #1e293b',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '12px'
                }}>
                  
                  {/* TOP INSTAGRAM BARS & HEADER */}
                  <div style={{ zIndex: 20, position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* BARRAS DE PROGRESO */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {testimoniosData.map((_, idx) => (
                        <div
                          key={idx}
                          style={{
                            height: '4px',
                            flex: 1,
                            borderRadius: '2px',
                            backgroundColor: idx <= currentTestimonioIndex ? '#ffffff' : 'rgba(255,255,255,0.3)'
                          }}
                        />
                      ))}
                    </div>

                    {/* HEADER INSTAGRAM USER */}
                    <div style={{ display: 'flex', itemsCenter: 'center', justifyContent: 'space-between', color: '#ffffff', padding: '0 4px' }}>
                      <div style={{ display: 'flex', itemsCenter: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', itemsCenter: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#020617', fontSize: '12px' }}>
                          N
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>nevux.app <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'normal' }}>2 h</span></p>
                          <p style={{ fontSize: '10px', color: '#34d399', fontWeight: 600, margin: '2px 0 0 0', lineHeight: 1 }}>Destacada 3 • Testimonios Reales</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '12px' }}>
                        {currentTestimonioIndex + 1}/{testimoniosData.length}
                      </span>
                    </div>
                  </div>

                  {/* CHAT SIMULADOR WHATSAPP DARK MODE (TAL CUAL LA IMAGEN RELEVADA) */}
                  <div style={{ flex: 1, margin: '8px 0', backgroundColor: '#0b141a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2a3942', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* WHATSAPP DARK HEADER */}
                    <div style={{ backgroundColor: '#202c33', color: '#e9edef', padding: '8px 12px', display: 'flex', itemsCenter: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a3942' }}>
                      <div style={{ display: 'flex', itemsCenter: 'center', gap: '8px' }}>
                        <ChevronLeft style={{ width: '18px', height: '18px', color: '#8696a0' }} />
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', itemsCenter: 'center', justifyContent: 'center', fontSize: '14px' }}>
                          {currentTestimonio.avatar}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '12px', color: '#e9edef', margin: 0, lineHeight: 1.2 }}>{currentTestimonio.name}</h4>
                          <p style={{ fontSize: '9px', color: '#8696a0', margin: '2px 0 0 0', lineHeight: 1 }}>{currentTestimonio.status}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', itemsCenter: 'center', gap: '12px', color: '#aebac1' }}>
                        <Video style={{ width: '14px', height: '14px' }} />
                        <Phone style={{ width: '14px', height: '14px' }} />
                        <MoreVertical style={{ width: '14px', height: '14px' }} />
                      </div>
                    </div>

                    {/* PINNED LINK BANNER (TAL CUAL LA CAPTURA MOSTRADA) */}
                    <div style={{ backgroundColor: '#182229', padding: '4px 12px', borderBottom: '1px solid #222d34', display: 'flex', itemsCenter: 'center', gap: '6px', fontSize: '10px' }}>
                      <Pin style={{ width: '12px', height: '12px', color: '#00a884' }} />
                      <span style={{ fontFamily: 'monospace', color: '#00a884', textDecoration: 'underline' }}>https://nexus2026-gx7e.vercel.app</span>
                    </div>

                    {/* CHAT BODY CON CONTEXTO BORROSO Y HIGHLIGHTS */}
                    <div style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#0b141a',
                      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)',
                      backgroundSize: '14px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      
                      {/* BURBUJA CONTEXTO ARRIBA (BORROSA) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-start', filter: 'blur(3px)', opacity: 0.35 }}>
                        <div style={{ maxWidth: '85%', backgroundColor: '#202c33', color: '#e9edef', borderRadius: '8px', padding: '8px', fontSize: '10px' }}>
                          <p style={{ margin: 0 }}>{currentTestimonio.beforeText}</p>
                        </div>
                      </div>

                      {/* AUDIO FALSO DE CONTEXTO (BORROSO) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-start', filter: 'blur(3px)', opacity: 0.35 }}>
                        <div style={{ backgroundColor: '#202c33', color: '#e9edef', borderRadius: '8px', padding: '8px', display: 'flex', itemsCenter: 'center', gap: '8px', fontSize: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#00a884', display: 'flex', itemsCenter: 'center', justifyContent: 'center', color: '#ffffff' }}>
                            <Play style={{ width: '10px', height: '10px', fill: 'currentColor' }} />
                          </div>
                          <div style={{ height: '4px', backgroundColor: '#8696a0', width: '80px', borderRadius: '2px' }}></div>
                          <span style={{ fontSize: '9px', color: '#8696a0' }}>0:18</span>
                        </div>
                      </div>

                      {/* MENSAJE DESTACADO DEL CLIENTE (BRIGHT GREEN GLOW) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-start', position: 'relative', zIndex: 10 }}>
                        <div style={{
                          maxWidth: '92%',
                          backgroundColor: '#202c33',
                          color: '#e9edef',
                          borderRadius: '12px',
                          borderTopLeftRadius: '0px',
                          padding: '12px',
                          fontSize: '11px',
                          border: '2px solid #10B981',
                          boxShadow: '0 0 20px rgba(16,185,129,0.35)'
                        }}>
                          <p style={{ margin: 0, lineHeight: 1.4, fontWeight: 500 }}>{currentTestimonio.clientMsg}</p>
                          <span style={{ display: 'block', fontSize: '9px', color: '#8696a0', textAlign: 'right', marginTop: '4px', fontFamily: 'monospace' }}>{currentTestimonio.clientTime}</span>
                        </div>
                      </div>

                      {/* RESPUESTA DESTACADA DEL CREADOR (WHATSAPP DARK GREEN + GLOW) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
                        <div style={{
                          maxWidth: '92%',
                          backgroundColor: '#005c4b',
                          color: '#ffffff',
                          borderRadius: '12px',
                          borderTopRightRadius: '0px',
                          padding: '12px',
                          fontSize: '11px',
                          border: '2px solid #10B981',
                          boxShadow: '0 0 22px rgba(16,185,129,0.45)'
                        }}>
                          <p style={{ margin: 0, lineHeight: 1.4, fontWeight: 500 }}>{currentTestimonio.creatorMsg}</p>
                          <div style={{ display: 'flex', itemsCenter: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                            <span style={{ fontSize: '9px', color: 'rgba(233,237,239,0.8)', fontFamily: 'monospace' }}>{currentTestimonio.creatorTime}</span>
                            <span style={{ fontSize: '10px', color: '#53bdeb', fontWeight: 'bold' }}>✓✓</span>
                          </div>
                        </div>
                      </div>

                      {/* BURBUJA CONTEXTO ABAJO (BORROSA) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', filter: 'blur(3px)', opacity: 0.35 }}>
                        <div style={{ maxWidth: '85%', backgroundColor: '#005c4b', color: '#e9edef', borderRadius: '8px', padding: '8px', fontSize: '10px' }}>
                          <p style={{ margin: 0 }}>{currentTestimonio.afterText}</p>
                        </div>
                      </div>

                    </div>

                    {/* WHATSAPP DARK FOOTER */}
                    <div style={{ backgroundColor: '#202c33', padding: '6px', display: 'flex', itemsCenter: 'center', gap: '6px', borderTop: '1px solid #2a3942' }}>
                      <div style={{ flex: 1, backgroundColor: '#2a3942', borderRadius: '20px', padding: '4px 10px', display: 'flex', itemsCenter: 'center', gap: '8px', color: '#8696a0', fontSize: '10px' }}>
                        <Smile style={{ width: '14px', height: '14px' }} />
                        <span style={{ flex: 1, color: '#8696a0' }}>Mensaje</span>
                        <Paperclip style={{ width: '14px', height: '14px' }} />
                        <Camera style={{ width: '14px', height: '14px' }} />
                      </div>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#00a884', display: 'flex', itemsCenter: 'center', justifyContent: 'center', color: '#ffffff' }}>
                        <Mic style={{ width: '14px', height: '14px' }} />
                      </div>
                    </div>

                  </div>

                  {/* INSTAGRAM BADGE STICKER DE IMPACTO */}
                  <div style={{ zIndex: 20, margin: '4px 0', background: 'linear-gradient(90deg, #10b981, #14b8a6)', color: '#020617', padding: '6px 12px', borderRadius: '12px', fontWeight: 900, textAlign: 'center', fontSize: '11px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                    <span>{currentTestimonio.metricBadge}</span>
                  </div>

                  {/* BOTTOM ACTION CTA */}
                  <div style={{ zIndex: 20, textAlign: 'center', padding: '4px', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', itemsCenter: 'center', justifyContent: 'center', gap: '4px' }}>
                      🔥 Caso Real Tiendanube • Deslizá arriba <ArrowRight style={{ width: '12px', height: '12px', color: '#34d399' }} />
                    </p>
                  </div>

                </div>

                {/* CONTROLES NAVEGACIÓN HISTORIAS */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button
                    onClick={() => setCurrentTestimonioIndex((prev) => (prev > 0 ? prev - 1 : testimoniosData.length - 1))}
                    style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, border: '1px solid #1e293b', cursor: 'pointer', display: 'flex', itemsCenter: 'center', gap: '4px' }}
                  >
                    <ChevronLeft style={{ width: '16px', height: '16px' }} /> Anterior
                  </button>
                  <button
                    onClick={() => setCurrentTestimonioIndex((prev) => (prev < testimoniosData.length - 1 ? prev + 1 : 0))}
                    style={{ backgroundColor: '#059669', color: '#ffffff', padding: '8px 20px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', itemsCenter: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
                  >
                    Siguiente <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            )}

            {/* DESTACADAS 1 Y 2 */}
            {activeHighlight === 1 && (
              <div style={{ backgroundColor: '#0f172a', padding: '32px', borderRadius: '16px', border: '1px solid #1e293b', textAlign: 'center' }}>
                <AlertTriangle style={{ width: '48px', height: '48px', color: '#f87171', margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Destacada 1: El Problema (7 Historias)</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Enfocada en resolver el bajo ticket promedio, la desconfianza del comprador y el abandono de carritos.
                </p>
              </div>
            )}

            {activeHighlight === 2 && (
              <div style={{ backgroundColor: '#0f172a', padding: '32px', borderRadius: '16px', border: '1px solid #1e293b', textAlign: 'center' }}>
                <Zap style={{ width: '48px', height: '48px', color: '#34d399', margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Destacada 2: La Solución (8 Historias)</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
            {portadasData.map((portada) => {
              const IconComponent = portada.icon;
              return (
                <div key={portada.id} style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', itemsCenter: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: portada.bgGradient, display: 'flex', itemsCenter: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', border: '2px solid #020617' }}>
                    <IconComponent style={{ width: '30px', height: '30px' }} />
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{portada.title}</p>
                  <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Portada #{portada.id}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
