'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminReelsPage() {
  // Estado de controles del Reel
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'videofloat' | 'stock' | 'reviews' | 'freeShipping'>('whatsapp');
  const [hookText, setHookText] = useState('El widget de Tiendanube que aumentó las ventas un +300% 🔥');
  const [likeCount, setLikeCount] = useState(14280);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(384);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isRecordingMode, setIsRecordingMode] = useState(false);

  // Estados interactivos para widgets simulados
  const [stockLeft, setStockLeft] = useState(3);
  const [shippingProgress, setShippingProgress] = useState(70);
  const [chatStep, setChatStep] = useState(0);

  // Lógica de simulación de venta
  const triggerSaleAlert = () => {
    const randomAmount = (Math.floor(Math.random() * 45) + 15) * 1000;
    setNotificationMsg(`🎉 ¡Nueva venta registrada! +$${randomAmount.toLocaleString('es-AR')} ARS`);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4500);
  };

  // Simulación de interacción en el widget de WhatsApp
  useEffect(() => {
    if (activeTab === 'whatsapp') {
      const timer = setInterval(() => {
        setChatStep((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header superior (solo visible si no está en modo grabación) */}
      {!isRecordingMode && (
        <header style={{ borderBottom: '1px solid #27272a', backgroundColor: '#18181b', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              ← Volver al Dashboard
            </Link>
            <span style={{ color: '#3f3f46' }}>|</span>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎥 Studio Reels Instagram Hiperrealistas
            </span>
          </div>
          <button
            onClick={() => setIsRecordingMode(true)}
            style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            🔴 Modo Grabación Fullscreen
          </button>
        </header>
      )}

      {/* Botón flotante para salir del modo grabación */}
      {isRecordingMode && (
        <button
          onClick={() => setIsRecordingMode(false)}
          style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)', color: '#ffffff', border: '1px solid #3f3f46', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
        >
          ✖ Salir del Modo Grabación
        </button>
      )}

      {/* Contenido Principal */}
      <div style={{ display: 'flex', flexDirection: isRecordingMode ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: isRecordingMode ? '0' : '24px', gap: '32px' }}>
        
        {/* PANEL DE CONTROL (Solo visible en modo edición) */}
        {!isRecordingMode && (
          <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>Controles del Reel</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Personalizá la simulación para grabar tu Reel.</p>
            </div>

            {/* Frase / Hook */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#a1a1aa', marginBottom: '6px' }}>TEXTO HOOK DEL REEL</label>
              <textarea
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                rows={3}
                style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '13px', outline: 'none', resize: 'none' }}
              />
            </div>

            {/* Selector de Widget a Mostrar */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>WIDGET EN PANTALLA</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => setActiveTab('whatsapp')}
                  style={{ backgroundColor: activeTab === 'whatsapp' ? '#10B981' : '#27272a', color: activeTab === 'whatsapp' ? '#000000' : '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                >
                  💬 Botón WhatsApp
                </button>
                <button
                  onClick={() => setActiveTab('videofloat')}
                  style={{ backgroundColor: activeTab === 'videofloat' ? '#10B981' : '#27272a', color: activeTab === 'videofloat' ? '#000000' : '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                >
                  🎬 Video Flotante
                </button>
                <button
                  onClick={() => setActiveTab('stock')}
                  style={{ backgroundColor: activeTab === 'stock' ? '#10B981' : '#27272a', color: activeTab === 'stock' ? '#000000' : '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                >
                  ⚡ Urgencia Stock
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  style={{ backgroundColor: activeTab === 'reviews' ? '#10B981' : '#27272a', color: activeTab === 'reviews' ? '#000000' : '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                >
                  ⭐ Reseñas Clientes
                </button>
                <button
                  onClick={() => setActiveTab('freeShipping')}
                  style={{ backgroundColor: activeTab === 'freeShipping' ? '#10B981' : '#27272a', color: activeTab === 'freeShipping' ? '#000000' : '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', gridColumn: 'span 2' }}
                >
                  🚚 Barra Envío Gratis
                </button>
              </div>
            </div>

            {/* Simular Acciones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={triggerSaleAlert}
                style={{ width: '100%', backgroundColor: '#22c55e', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                💸 Simular Venta en Vivo
              </button>
              {activeTab === 'stock' && (
                <button
                  onClick={() => setStockLeft((prev) => (prev > 1 ? prev - 1 : 10))}
                  style={{ width: '100%', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
                >
                  🔥 Bajar Stock (-1)
                </button>
              )}
            </div>

            <div style={{ backgroundColor: '#09090b', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#71717a', lineHeight: '1.4' }}>
              💡 <b>Tip de Grabación:</b> Tocá "Modo Grabación Fullscreen" arriba a la derecha para ocultar este panel y grabar solo la pantalla del iPhone con tu software de grabación de pantalla.
            </div>
          </div>
        )}

        {/* CONTENEDOR MÓVIL IPHONE 15 PRO 9:16 */}
        <div style={{
          width: '375px',
          height: '780px',
          backgroundColor: '#000000',
          borderRadius: '48px',
          border: '12px solid #27272a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          userSelect: 'none'
        }}>

          {/* Dynamic Island iPhone */}
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '110px', height: '28px', backgroundColor: '#000000', borderRadius: '20px', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#047857', opacity: 0.8 }}></div>
          </div>

          {/* Bar de Estado Top */}
          <div style={{ padding: '14px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 90, fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
            <span>9:41</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span>5G</span>
              <div style={{ width: '20px', height: '10px', border: '1px solid #ffffff', borderRadius: '3px', padding: '1px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', borderRadius: '1px' }}></div>
              </div>
            </div>
          </div>

          {/* NOTIFICACIÓN FLOTANTE DE VENTA TIENDANUBE */}
          {showNotification && (
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '14px',
              right: '14px',
              backgroundColor: 'rgba(24, 24, 27, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #10B981',
              borderRadius: '16px',
              padding: '12px 16px',
              zIndex: 100,
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
              animation: 'bounce 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                🛍️
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tiendanube • Nevux Live</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{notificationMsg}</div>
              </div>
            </div>
          )}

          {/* CONTENIDO DEL REEL (FONDO Y DEMOSTRACIÓN DE TIENDA REAL) */}
          <div style={{ position: 'relative', flex: 1, backgroundColor: '#121214', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            
            {/* Fondo simulado de Tienda Online */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

            {/* HEADER SIMULADO DE LA TIENDA */}
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '1px' }}>MI TIENDA ONLINE</div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>🔍 🛒</div>
            </div>

            {/* DEMOSTRACIÓN DEL WIDGET SELECCIONADO */}
            <div style={{ zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* WIDGET 1: BOTÓN DE WHATSAPP */}
              {activeTab === 'whatsapp' && (
                <div style={{ width: '100%', backgroundColor: '#ffffff', color: '#111827', borderRadius: '16px', padding: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>
                      💬
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>Asesoría por WhatsApp</div>
                      <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>● En línea ahora</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '8px 12px', borderRadius: '12px 12px 12px 0', fontSize: '12px', maxWidth: '85%' }}>
                      ¡Hola! 👋 ¿Tenés dudas con el talle o envío de tu pedido?
                    </div>
                    {chatStep >= 1 && (
                      <div style={{ backgroundColor: '#DCF8C6', padding: '8px 12px', borderRadius: '12px 12px 0 12px', fontSize: '12px', alignSelf: 'flex-end', maxWidth: '85%' }}>
                        ¡Hola! Sí, ¿tienen stock para despacho hoy?
                      </div>
                    )}
                    {chatStep >= 2 && (
                      <div style={{ backgroundColor: '#f3f4f6', padding: '8px 12px', borderRadius: '12px 12px 12px 0', fontSize: '12px', maxWidth: '85%' }}>
                        ¡Sí! Comprando en los próximos 20 min sale hoy mismo 🚀
                      </div>
                    )}
                  </div>

                  <div style={{ backgroundColor: '#25D366', color: '#ffffff', padding: '12px', borderRadius: '10px', textAlign: 'center', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)' }}>
                    <span>Abrir Chat Directo</span> →
                  </div>
                </div>
              )}

              {/* WIDGET 2: VIDEO FLOTANTE */}
              {activeTab === 'videofloat' && (
                <div style={{ width: '220px', height: '320px', backgroundColor: '#18181b', borderRadius: '20px', border: '2px solid #10B981', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.4)' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: '#27272a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>
                      ▶️
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff', marginBottom: '4px' }}>Demostración en Vivo</div>
                    <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Mirá cómo funciona el producto antes de comprar.</div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', backgroundColor: '#10B981', color: '#000000', padding: '10px', borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '12px' }}>
                    🛒 COMPRAR AHORA
                  </div>
                </div>
              )}

              {/* WIDGET 3: URGENCIA DE STOCK */}
              {activeTab === 'stock' && (
                <div style={{ width: '100%', backgroundColor: '#18181b', border: '1px solid #ef4444', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    ⚡ ¡ALTO IMPACTO EN VENTAS!
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    ¡Solo quedan <span style={{ color: '#ef4444' }}>{stockLeft} unidades</span>!
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#27272a', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: `${(stockLeft / 10) * 100}%`, height: '100%', backgroundColor: '#ef4444', transition: 'width 0.5s ease' }}></div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#a1a1aa' }}>🔥 18 personas tienen este producto en su carrito.</div>
                </div>
              )}

              {/* WIDGET 4: RESEÑAS DE CLIENTES */}
              {activeTab === 'reviews' && (
                <div style={{ width: '100%', backgroundColor: '#ffffff', color: '#111827', borderRadius: '16px', padding: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '16px', marginBottom: '6px' }}>
                    ★★★★★ <span style={{ color: '#111827', fontSize: '12px', fontWeight: 700, marginLeft: '6px' }}>5.0 / 5.0</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, fontStyle: 'italic', marginBottom: '10px', lineHeight: '1.4' }}>
                    "¡Increíble la rapidez del envío! Llegó al día siguiente y la calidad superó mis expectativas. 100% recomendado."
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10B981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                      MC
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700 }}>María Camargo</div>
                      <div style={{ fontSize: '9px', color: '#059669', fontWeight: 600 }}>✔ Comprador verificado</div>
                    </div>
                  </div>
                </div>
              )}

              {/* WIDGET 5: BARRA ENVÍO GRATIS */}
              {activeTab === 'freeShipping' && (
                <div style={{ width: '100%', backgroundColor: '#047857', color: '#ffffff', borderRadius: '16px', padding: '16px', boxShadow: '0 15px 30px rgba(4, 120, 87, 0.4)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                    🎉 ¡Felicidades! Tenés <span style={{ textDecoration: 'underline' }}>ENVÍO GRATIS</span> alcanzado
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}></div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* OVERLAY DE INTERFAZ NATIVA DE REELS INSTAGRAM */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)', zIndex: 80, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              
              {/* Información de la cuenta & Hook */}
              <div style={{ flex: 1, paddingRight: '12px' }}>
                
                {/* Perfil @nevuxapp */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', border: '1.5px solid #ffffff' }}>
                    N
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>nevuxapp</span>
                  <span style={{ color: '#3b82f6', fontSize: '12px' }}>✔</span>
                  <button style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.6)', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, marginLeft: '4px' }}>
                    Seguir
                  </button>
                </div>

                {/* Texto Hook editable */}
                <div style={{ fontSize: '12px', color: '#ffffff', lineHeight: '1.4', fontWeight: 500, marginBottom: '8px' }}>
                  {hookText}
                </div>

                {/* Audio Original */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#e4e4e7' }}>
                  <span>🎵</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                    Nevux Original Audio • Tendencia Ecommerce
                  </span>
                </div>

              </div>

              {/* Botones laterales derechos (Like, Comentarios, Compartir, Audio) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                
                {/* Like Button */}
                <button onClick={handleLike} style={{ background: 'none', border: 'none', color: isLiked ? '#ef4444' : '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '24px' }}>{isLiked ? '❤️' : '🤍'}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff' }}>{likeCount.toLocaleString()}</span>
                </button>

                {/* Comentarios */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#ffffff' }}>
                  <span style={{ fontSize: '22px' }}>💬</span>
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{commentCount}</span>
                </div>

                {/* Compartir / Avión */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#ffffff' }}>
                  <span style={{ fontSize: '22px' }}>✈️</span>
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>Enviar</span>
                </div>

                {/* Opciones 3 puntos */}
                <div style={{ fontSize: '18px', color: '#ffffff' }}>⋮</div>

                {/* Audio Vinilo Giratorio */}
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #ffffff', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                  💿
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
    }
