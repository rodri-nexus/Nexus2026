'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminReelsPage() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product'>('home');
  const [isRecordingMode, setIsRecordingMode] = useState(false);

  // Cronómetro del Guión (actualiza cada 100ms)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (currentTime >= 18) setCurrentTime(0);
    setIsPlaying(!isPlaying);
  };

  const resetTimeline = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentView('home');
  };

  // Textos del Guión CapCut
  let currentText = '';
  if (currentTime >= 0 && currentTime < 4) {
    currentText = 'TIENDA ONLINE EN AUTOMÁTICO';
  } else if (currentTime >= 4 && currentTime < 7) {
    currentText = '❌ CARRITOS ABANDONADOS';
  } else if (currentTime >= 7 && currentTime < 12) {
    currentText = '🛡️ WIDGETS DE CONFIANZA';
  } else if (currentTime >= 12 && currentTime < 16) {
    currentText = '💵 BADGE DE EFECTIVO';
  } else if (currentTime >= 16 && currentTime < 20) {
    currentText = '🚀 PROBÁ 7 DÍAS GRATIS';
  }

  // Animación suave al clickear widgets
  const pulseWidget = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.transform = 'scale(0.97)';
      setTimeout(() => (el.style.transform = 'scale(1)'), 150);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* HEADER DE HERRAMIENTA */}
      {!isRecordingMode && (
        <header style={{ borderBottom: '1px solid #27272a', backgroundColor: '#18181b', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              ← Volver
            </Link>
            <span style={{ color: '#3f3f46' }}>|</span>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#10B981' }}>
              🎬 Studio Grabación Ultra-Realista
            </span>
          </div>
          <button
            onClick={() => setIsRecordingMode(true)}
            style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            🔴 Pantalla Completa
          </button>
        </header>
      )}

      {/* BOTÓN SALIR MODO GRABACIÓN */}
      {isRecordingMode && (
        <button
          onClick={() => setIsRecordingMode(false)}
          style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)', color: '#ffffff', border: '1px solid #3f3f46', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
        >
          ✖ Salir Fullscreen
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: isRecordingMode ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: isRecordingMode ? '0' : '24px', gap: '32px' }}>
        
        {/* PANEL DE CONTROL */}
        {!isRecordingMode && (
          <div style={{ width: '100%', maxWidth: '350px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>Cronómetro del Guión</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Sincronizado con tus efectos de sonido.</p>
            </div>

            <div style={{ fontSize: '48px', fontWeight: 900, color: '#10B981', textAlign: 'center', fontFamily: 'monospace' }}>
              {currentTime.toFixed(1)}s
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={togglePlay}
                style={{ flex: 1, backgroundColor: isPlaying ? '#ef4444' : '#10B981', color: isPlaying ? '#ffffff' : '#000000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
              >
                {isPlaying ? '⏸ Pausar' : '▶️ Play Guión'}
              </button>
              <button
                onClick={resetTimeline}
                style={{ backgroundColor: '#27272a', color: '#ffffff', border: 'none', padding: '12px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                🔄
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>Línea de tiempo CapCut</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 0 && currentTime < 4 ? '#10B981' : '#71717a', fontWeight: currentTime >= 0 && currentTime < 4 ? 700 : 400 }}><span>0.0s - Tienda Automática</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 4 && currentTime < 7 ? '#10B981' : '#71717a', fontWeight: currentTime >= 4 && currentTime < 7 ? 700 : 400 }}><span>4.0s - Carritos Abandonados</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 7 && currentTime < 12 ? '#10B981' : '#71717a', fontWeight: currentTime >= 7 && currentTime < 12 ? 700 : 400 }}><span>7.0s - Widgets de Confianza</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 12 && currentTime < 16 ? '#10B981' : '#71717a', fontWeight: currentTime >= 12 && currentTime < 16 ? 700 : 400 }}><span>12.0s - Badge Efectivo</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 16 ? '#10B981' : '#71717a', fontWeight: currentTime >= 16 ? 700 : 400 }}><span>16.0s - Cierre / CTA</span></div>
            </div>
          </div>
        )}

        {/* CONTENEDOR CELULAR (ZONA GRABACIÓN) */}
        <div style={{
          width: '375px',
          height: '812px',
          backgroundColor: '#EBE5DF', // Fondo beige exacto de la captura
          borderRadius: isRecordingMode ? '0' : '40px',
          border: isRecordingMode ? 'none' : '12px solid #27272a',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isRecordingMode ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>

          {/* TELEPROMPTER CAPCUT (Oculto en partes sin texto) */}
          {currentText && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '90%', zIndex: 9999, textAlign: 'center', pointerEvents: 'none'
            }}>
              <h2 style={{
                fontSize: '34px', fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: '1.1',
                textTransform: 'uppercase', fontFamily: 'Impact, sans-serif',
                textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 10px 25px rgba(0,0,0,0.8)'
              }}>
                {currentText}
              </h2>
            </div>
          )}

          {/* HEADER GEMINISONLINE EXACTO */}
          <div style={{ backgroundColor: '#131A2A', width: '100%', position: 'sticky', top: 0, zIndex: 100 }}>
            {/* Top bar */}
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ color: '#D4AF37', fontSize: '20px', fontWeight: 300 }}>☰</span>
                <span style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.5px', color: '#ffffff' }}>
                  Geminis<span style={{ color: '#D4AF37' }}>online</span>
                </span>
              </div>
              <div style={{ position: 'relative', color: '#D4AF37', fontSize: '22px' }}>
                🛒
                <div style={{ position: 'absolute', top: '-4px', right: '-8px', backgroundColor: '#D4AF37', color: '#000000', fontSize: '10px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</div>
              </div>
            </div>
            {/* Search bar */}
            <div style={{ padding: '0 20px 16px 20px' }}>
              <div style={{ backgroundColor: '#1E293B', borderRadius: '4px', border: '1px solid #334155', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '14px' }}>
                <span>Buscar</span>
                <span style={{ color: '#D4AF37' }}>🔍</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#EAE3DC', color: '#111827', scrollBehavior: 'smooth', paddingBottom: '60px' }}>
            
            {/* ===================== HOME VIEW ===================== */}
            {currentView === 'home' && (
              <div>
                {/* Banner Realista (Hogar/Organización) */}
                <div style={{ width: '100%', height: '240px', backgroundImage: 'url("https://images.unsplash.com/photo-1583847268964-b28ce8fde15b?q=80&w=800&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                  <div style={{ position: 'relative', padding: '24px', color: '#ffffff', width: '100%' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#D4AF37', letterSpacing: '2px', marginBottom: '8px' }}>NUEVOS INGRESOS</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, lineHeight: '1.2' }}>Organización<br/>Inteligente</div>
                  </div>
                </div>
                
                <div style={{ padding: '24px 20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: '#111827' }}>Los más vendidos</h3>
                  
                  {/* Grilla Productos Reales */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    
                    {/* Producto 1 - El que se clickea */}
                    <div onClick={() => setCurrentView('product')} style={{ cursor: 'pointer' }}>
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                         <img src="https://images.unsplash.com/photo-1584727638096-042c45049ebe?q=80&w=400&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Organizador" />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', lineHeight: '1.3', marginBottom: '4px' }}>Organizador Multi-Espacio Premium</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>$ 84.200,00</div>
                    </div>

                    {/* Producto 2 */}
                    <div>
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                         <img src="https://images.unsplash.com/photo-1595514535415-889815852ea9?q=80&w=400&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Caja" />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', lineHeight: '1.3', marginBottom: '4px' }}>Caja de Almacenamiento Minimalista</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>$ 45.500,00</div>
                    </div>

                    {/* Producto 3 */}
                    <div>
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                         <img src="https://images.unsplash.com/photo-1616422285623-138923d87595?q=80&w=400&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Estante" />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', lineHeight: '1.3', marginBottom: '4px' }}>Estante Organizador Flotante</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>$ 62.000,00</div>
                    </div>

                    {/* Producto 4 */}
                    <div>
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                         <img src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=400&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Set" />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', lineHeight: '1.3', marginBottom: '4px' }}>Set de Contenedores Herméticos</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>$ 38.900,00</div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ===================== PRODUCT VIEW (IDÉNTICO A LA CAPTURA) ===================== */}
            {currentView === 'product' && (
              <div style={{ backgroundColor: '#EAE3DC' }}>
                
                {/* Imagen (ocupa el inicio, nosotros scrolleamos abajo para mostrar widgets) */}
                <div 
                  onClick={() => setCurrentView('home')} // Oculto para salir rápido al inicio
                  style={{ width: '100%', height: '300px', backgroundColor: '#fff', backgroundImage: 'url("https://images.unsplash.com/photo-1584727638096-042c45049ebe?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer' }}
                ></div>

                {/* INFO EXACTA DE LA CAPTURA */}
                <div style={{ padding: '24px 20px' }}>
                  
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    $84.200,00 <span style={{ fontSize: '14px', color: '#D4AF37', fontWeight: 700 }}>10% OFF</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'line-through', marginTop: '4px' }}>
                    $94.000,00
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px' }}>
                    Precio sin impuestos $69.586,78
                  </div>

                  <div style={{ fontSize: '14px', color: '#C29B57', fontWeight: 600, marginTop: '20px' }}>
                    3 cuotas sin interés de $28.066,67
                  </div>
                  <div style={{ fontSize: '14px', color: '#4B5563', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontWeight: 500 }}>
                    <span style={{ fontSize: '16px' }}>💳</span> Ver más detalles
                  </div>

                  <div style={{ fontSize: '14px', color: '#C29B57', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', fontWeight: 600 }}>
                    <span style={{ fontSize: '18px' }}>🚚</span> Envío gratis
                  </div>

                  {/* WIDGET 1: BADGE DE EFECTIVO (Calco de captura) */}
                  <div 
                    id="widget-efectivo" 
                    onClick={() => pulseWidget('widget-efectivo')}
                    style={{ position: 'relative', marginTop: '24px', marginBottom: '24px', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                  >
                    <div style={{ backgroundColor: '#111827', color: '#ffffff', borderRadius: '50px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', width: 'fit-content' }}>
                      <span style={{ fontSize: '18px' }}>💵</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>10% de descuento pagando en efectivo</span>
                    </div>
                    {/* El tag azul de OFERTA flotante */}
                    <div style={{ position: 'absolute', top: '-10px', right: '15px', backgroundColor: '#3B82F6', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                      OFERTA
                    </div>
                  </div>

                  {/* CANTIDAD Y BOTÓN AGREGAR */}
                  <div style={{ display: 'flex', gap: '0', height: '52px', marginTop: '16px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ flex: '0 0 110px', backgroundColor: '#F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', fontSize: '18px', color: '#374151', border: '1px solid #E5E7EB', borderRight: 'none' }}>
                      <span style={{ cursor: 'pointer' }}>−</span>
                      <span style={{ fontSize: '16px', fontWeight: 600 }}>1</span>
                      <span style={{ cursor: 'pointer' }}>+</span>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#D4AF37', color: '#111827', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
                      Agregar al carrito
                    </div>
                  </div>

                  {/* WIDGET 2: MENSAJE GARANTÍA (Calco de captura) */}
                  <div 
                    id="widget-garantia"
                    onClick={() => pulseWidget('widget-garantia')}
                    style={{ backgroundColor: '#0B132B', border: '1px solid #1E3A8A', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', marginTop: '24px', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                  >
                    <div style={{ fontSize: '28px', marginTop: '-4px' }}>🛡️</div>
                    <div>
                      <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>
                        Garantía de 60 días
                      </div>
                      <div style={{ color: '#F9FAFB', fontSize: '14px', lineHeight: '1.5', fontWeight: 400 }}>
                        Confiamos en los resultados del producto. Si no te gusta podés devolverlo y te reintegramos el total de tu compra.
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN DESCRIPCIÓN */}
                  <div style={{ marginTop: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '16px', letterSpacing: '0.5px' }}>
                      Descripción
                    </h2>
                    <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.6' }}>
                      🔖 ¿Cansado de tener tus cosas desordenadas o de no encontrar lo que necesitás cuando más lo buscás? Este organizador está pensado para brindarte el equilibrio perfecto entre estética y funcionalidad...
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* BOTÓN WHATSAPP FLOTANTE EXACTO DE LA CAPTURA */}
          <div style={{ position: 'absolute', bottom: '24px', right: '20px', width: '56px', height: '56px', backgroundColor: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 999 }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </div>

        </div>

      </div>
    </div>
  );
        }
