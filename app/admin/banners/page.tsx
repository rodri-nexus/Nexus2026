'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Star,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Bot,
  Globe,
  Mic,
  Gift,
  Crown,
  Maximize2,
  X,
  Copy,
  Check,
  Video,
  Instagram,
  Layout,
  Layers,
  Share2,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Split,
  Palette,
  Link2
} from 'lucide-react';

// Official Isotype Logo Component (ONLY allowed in top-left corner)
const NevuxIsotype = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nvxRightGrad" x1="50" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="nvxDiagGrad" x1="20" y1="80" x2="80" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#6EE7B7" />
      </linearGradient>
    </defs>
    {/* Left Pillar */}
    <rect x="20" y="20" width="16" height="60" rx="8" fill="#10B981" />
    {/* Right Pillar */}
    <rect x="64" y="20" width="16" height="60" rx="8" fill="url(#nvxRightGrad)" />
    {/* Diagonal Bar */}
    <path
      d="M28 24 L72 76"
      stroke="url(#nvxDiagGrad)"
      strokeWidth="16"
      strokeLinecap="round"
    />
  </svg>
);

const NevuxHeaderBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <NevuxIsotype size={30} />
    <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 18, letterSpacing: '0.05em', fontFamily: 'sans-serif' }}>
      NEVUX
    </span>
  </div>
);

export default function MarketingAssetsPage() {
  const [activeTab, setActiveTab] = useState<'meta' | 'appstore' | 'instagram'>('meta');
  const [fullscreenBanner, setFullscreenBanner] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: '#020a07', color: '#F3F4F6', minHeight: '100vh', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Admin */}
      <div style={{ maxWidth: 1280, margin: '0 auto 32px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <NevuxHeaderBrand />
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              RECOMPENSAS Y BANNERS OFICIALES 2025
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            Meta Ads & Banners Tiendanube / Nuvemshop
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>
            Slogan Oficial: <strong style={{ color: '#10B981' }}>"50 Widgets + 6 funciones para impulsar tu Tiendanube"</strong>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#0B1512', padding: 4, borderRadius: 12, border: '1px solid #1F2937' }}>
          <button
            onClick={() => setActiveTab('meta')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === 'meta' ? '#10B981' : 'transparent',
              color: activeTab === 'meta' ? '#000000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Video size={16} /> Meta Ads Master
          </button>
          <button
            onClick={() => setActiveTab('appstore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === 'appstore' ? '#10B981' : 'transparent',
              color: activeTab === 'appstore' ? '#000000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Layout size={16} /> Banners Tiendanube (16:9)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === 'instagram' ? '#10B981' : 'transparent',
              color: activeTab === 'instagram' ? '#000000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Instagram size={16} /> Plan Semana 1 Instagram
          </button>
        </div>
      </div>

      {/* TAB 1: META ADS MASTER CAMPAIGN */}
      {activeTab === 'meta' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Section: Video Script 60s & Story Ad Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            
            {/* Script Breakdown Column */}
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                  GUIÓN VIDEO REELS / STORIES (60s)
                </span>
                <span style={{ color: '#6B7280', fontSize: 12 }}>Sin precios • Sincronizado con App</span>
              </div>
              
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
                Meta Ad Script: "Recompensas por Fidelidad + 50 Widgets & 6 IA"
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #10B981' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 4 }}>00:00 - 00:05 | HOOK (INTERRUPCIÓN)</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Si tenés una Tiendanube y tus visitas no se convierten en compras, el problema no es tu tráfico... es tu tasa de conversión."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Screen recording rápido cambiando widgets y compras saltando en vivo.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #F59E0B' }}>
                  <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 800, marginBottom: 4 }}>00:05 - 00:15 | EL PROBLEMA</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Instalar 10 aplicaciones distintas para envíos, reseñas y contadores enlentece tu tienda y te cuesta una fortuna todos los meses."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Muestra de panel con múltiples apps abiertas al mismo tiempo.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #10B981' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 4 }}>00:15 - 00:28 | LA SOLUCIÓN NEVUX</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Nevux reúne 50 Widgets de alta conversión + 6 funciones de Inteligencia Artificial en una sola app para tu Tiendanube."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Vista rápida activando Envíos Gratis, Reseñas, Búsqueda por Voz y Chatbot IA.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #EC4899' }}>
                  <div style={{ fontSize: 11, color: '#EC4899', fontWeight: 800, marginBottom: 4 }}>00:28 - 00:48 | RECOMPENSAS POR FIDELIDAD</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Y además, cuanto más tiempo usás Nevux, más ganás:<br />• Al Mes 3: Desbloqueás widgets premium y 1 widget personalizado único.<br />• Al Mes 6: Widgets hechos a medida + descuentos exclusivos.<br />• Al Mes 12: Beneficios VIP y acceso anticipado a Recomendaciones con IA y Analytics de ROI."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Tarjetas exactas de Recompensas por Fidelidad del panel.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #10B981' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 4 }}>00:48 - 01:00 | LLAMADO A LA ACCIÓN (CTA)</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Instalá Nevux hoy en tu Tiendanube, probalo gratis por 7 días sin tarjeta de crédito y empezá a desbloquear tus recompensas. Tocá el botón de abajo."
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Preview 9:16 Mockup */}
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>PREVIEW STORY / REEL (9:16)</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>1080 x 1920 px Equivalent</span>
              </div>

              {/* Mobile Phone Mockup */}
              <div style={{
                width: 280,
                height: 520,
                backgroundColor: '#020a07',
                borderRadius: 28,
                border: '4px solid #1F2937',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
              }}>
                {/* Top Header ONLY logo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <NevuxHeaderBrand />
                  <span style={{ fontSize: 9, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '2px 8px', borderRadius: 10, fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    7 DÍAS GRATIS
                  </span>
                </div>

                {/* Center Content UI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 'auto 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
                      Cuantos más meses usás Nevux, más ganás
                    </h4>
                    <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>
                      Desbloqueá beneficios exclusivos para tu tienda
                    </p>
                  </div>

                  {/* Loyalty Benefits Card */}
                  <div style={{ backgroundColor: '#0B1512', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 12, padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Gift size={14} color="#10B981" />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981' }}>RECOMPENSAS POR FIDELIDAD</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 8.5, color: '#D1D5DB' }}>
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>Mes 3 · Recompensa:</strong> Widgets premium + 1 widget personalizado único.
                      </div>
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>Mes 6 · Elite:</strong> Widgets a medida + descuentos en tu suscripción.
                      </div>
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>Mes 12+ · VIP:</strong> Beneficios VIP + acceso anticipado a features nuevas.
                      </div>
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>⚡ 50 Widgets</span>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>🤖 6 IA</span>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>📊 ROI Analytics</span>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>🎙️ Voz IA</span>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    backgroundColor: '#10B981',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: 12,
                    padding: '10px 0',
                    borderRadius: 8,
                    textAlign: 'center'
                  }}>
                    PROBAR 7 DÍAS GRATIS
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 8, color: '#6B7280' }}>
                    Sin tarjeta de crédito • Instalación en 1 clic
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Rewards Breakdown Section */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Gift size={24} color="#10B981" />
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Cuantos más meses usás Nevux, más ganás
              </h3>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>
              Desbloqueá beneficios exclusivos que ninguna otra tienda va a tener. (Copia exacta de tu panel)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* Mes 3 */}
              <div style={{ backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Gift size={18} color="#10B981" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Mes 3 · Recompensa</span>
                </div>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.5 }}>
                  Desbloqueás widgets premium exclusivos + 1 widget personalizado único que solo vas a tener vos.
                </p>
              </div>

              {/* Mes 6 */}
              <div style={{ backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Award size={18} color="#10B981" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Mes 6 · Elite</span>
                </div>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.5 }}>
                  Más widgets personalizados hechos a medida + descuentos exclusivos en tu suscripción.
                </p>
              </div>

              {/* Mes 12+ */}
              <div style={{ backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: 12, padding: 18, boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Crown size={18} color="#10B981" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Mes 12+ · VIP</span>
                </div>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.5 }}>
                  Beneficios VIP, widgets únicos diseñados 100% para tu tienda, y acceso anticipado a features nuevas.
                </p>
              </div>
            </div>
          </div>

          {/* Lo que se viene en Nevux Section */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ backgroundColor: '#10B981', color: '#000', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 900 }}>
                PRÓXIMAMENTE
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Lo que se viene en Nevux
              </h3>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>
              Activando tu cuenta ahora, todo esto viene incluido cuando salga:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Bot size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Recomendaciones con IA</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Sugerí productos automáticamente según lo que ve el cliente.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <BarChart3 size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Analytics avanzados</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Dashboards profesionales con ROI por widget.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Split size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>A/B Testing</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Probá 2 versiones de un widget y quedate con la que más vende.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Palette size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Widgets premium únicos</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Nuevos widgets top que ninguna otra app tiene.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Link2 size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Más integraciones</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Conexión con MercadoLibre, Instagram Shopping y más.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Sparkles size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Widgets custom para vos</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Diseñamos widgets exclusivos para tu tienda.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANNERS APP STORE TIENDANUBE (16:9 / 1920x1080) */}
      {activeTab === 'appstore' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Banners Oficiales para Tiendanube App Store (1920 x 1080 px - Aspecto 16:9)
              </h3>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
                Cumplen 100% con los requerimientos técnicos de Tiendanube (3-5 imágenes, 16:9, Dark Mode SaaS).
              </p>
            </div>
          </div>

          {/* Banner 1: Búsqueda por Voz IA */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>BANNER 1: BÚSQUEDA POR VOZ IA & BÚSQUEDA INTELIGENTE</span>
              <button
                onClick={() => setFullscreenBanner(1)}
                style={{ backgroundColor: 'transparent', border: '1px solid #374151', color: '#D1D5DB', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Maximize2 size={14} /> Modo Captura (1920x1080)
              </button>
            </div>

            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: '#020a07',
              borderRadius: 12,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* TOP LEFT BRAND ONLY */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NevuxHeaderBrand />
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                  IA EXCLUSIVA PARA TIENDANUBE
                </span>
              </div>

              {/* Main Banner Content */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.1 }}>
                    Permite que tus clientes busquen hablando
                  </h2>
                  <p style={{ fontSize: 16, color: '#9CA3AF', margin: '0 0 20px 0', lineHeight: 1.4 }}>
                    Búsqueda por Voz con IA que entiende sinónimos, modismos locales e intenciones de compra en milisegundos.
                  </p>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', padding: '10px 14px', borderRadius: 8, fontSize: 12, color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Mic size={16} color="#10B981" /> Reconocimiento de Voz
                    </div>
                    <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', padding: '10px 14px', borderRadius: 8, fontSize: 12, color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Globe size={16} color="#10B981" /> ES / PT Autodetect
                    </div>
                  </div>
                </div>

                {/* Dense UI Mockup */}
                <div style={{ backgroundColor: '#0B1512', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 16, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mic size={14} /> BÚSQUEDA POR VOZ ACTIVA
                  </div>
                  <div style={{ backgroundColor: '#020a07', border: '1px solid #374151', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: '#F3F4F6', fontSize: 13, fontStyle: 'italic' }}>"Busco zapatillas negras de running..."</span>
                    <div style={{ backgroundColor: '#10B981', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mic size={14} color="#000" />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
                    <span>⚡ 3 Resultados (0.12s)</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>98% Precisión IA</span>
                  </div>
                </div>
              </div>

              {/* Bottom Slogan Mandatory */}
              <div style={{ borderTop: '1px solid #1F2937', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>
                  50 Widgets + 6 funciones para impulsar tu Tiendanube
                </span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Instalación inmediata • 7 días gratis</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INSTAGRAM PLAN WEEK 1 */}
      {activeTab === 'instagram' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
              Plan de Contenidos Instagram - Semana 1 de Lanzamiento
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: 14 }}>
              Estrategia orgánica de carruseles y reels enfocada en fidelización y conversión.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {/* Monday */}
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 800, marginBottom: 6 }}>LUNES | CARRUSEL</div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>"Por qué tener 10 apps lentifica tu Tiendanube"</h4>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
                Comparativa de velocidad entre 10 apps vs Nevux. Muestra la pérdida de conversión por segundos de carga.
              </p>
            </div>

            {/* Wednesday */}
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 800, marginBottom: 6 }}>MIÉRCOLES | CARRUSEL</div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>"Cuantos más meses usás Nevux, más ganás"</h4>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
                Explicación de las Recompensas por Fidelidad al Mes 3, Mes 6 y Mes 12+ (Widgets a medida + Descuentos).
              </p>
            </div>

            {/* Friday */}
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 800, marginBottom: 6 }}>VIERNES | REEL DEMO</div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>"Lo que se viene en Nevux: Recomendaciones IA & Analytics ROI"</h4>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
                Sneak peek de las nuevas funciones de IA y A/B Testing incluidas al activar la cuenta hoy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN CAPTURE MODAL */}
      {fullscreenBanner !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}>
          <button
            onClick={() => setFullscreenBanner(null)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              backgroundColor: '#10B981',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <X size={18} /> Cerrar Vista Fullscreen
          </button>

          <div style={{ width: 1280, height: 720, transform: 'scale(0.85)' }}>
            <div style={{
              width: 1920,
              height: 1080,
              transform: 'scale(0.666667)',
              transformOrigin: 'top left',
              backgroundColor: '#020a07',
              padding: 64,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NevuxHeaderBrand />
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '12px 28px', borderRadius: 40, fontSize: 22, fontWeight: 800 }}>
                  IA EXCLUSIVA PARA TIENDANUBE
                </span>
              </div>

              {/* Content */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: 64, fontWeight: 900, color: '#FFFFFF', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    Permite que tus clientes busquen hablando
                  </h1>
                  <p style={{ fontSize: 28, color: '#9CA3AF', margin: '0 0 40px 0' }}>
                    Búsqueda por Voz con IA que entiende sinónimos, modismos locales e intenciones de compra en milisegundos.
                  </p>
                </div>
                <div style={{ backgroundColor: '#0B1512', border: '2px solid rgba(16, 185, 129, 0.5)', borderRadius: 24, padding: 36 }}>
                  <div style={{ fontSize: 18, color: '#10B981', fontWeight: 800, marginBottom: 16 }}>🎙️ BÚSQUEDA POR VOZ EN TIEMPO REAL</div>
                  <div style={{ backgroundColor: '#020a07', border: '1px solid #374151', borderRadius: 16, padding: '20px 24px', fontSize: 22, color: '#FFF' }}>
                    "Busco zapatillas negras de running talle 42..."
                  </div>
                </div>
              </div>

              {/* Footer Slogan */}
              <div style={{ borderTop: '2px solid #1F2937', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>
                  50 Widgets + 6 funciones para impulsar tu Tiendanube
                </span>
                <span style={{ fontSize: 20, color: '#6B7280' }}>Instalación inmediata • 7 días gratis</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
                          }
