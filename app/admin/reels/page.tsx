'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminReelsPage() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product'>('home');
  const [isRecordingMode, setIsRecordingMode] = useState(false);

  // Lógica del Cronómetro del Guión (actualiza cada 100ms)
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

  // Determinador de Textos en Pantalla según el Guión de CapCut
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
              🎬 Studio Grabación (Sincronizado con CapCut)
            </span>
          </div>
          <button
            onClick={() => setIsRecordingMode(true)}
            style={{ backgroundColor: '#10B981', color: '#000000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            🔴 Pantalla Completa (Ocultar controles)
          </button>
        </header>
      )}

      {/* BOTÓN SALIR MODO GRABACIÓN */}
      {isRecordingMode && (
        <button
          onClick={() => setIsRecordingMode(false)}
          style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)', color: '#ffffff', border: '1px solid #3f3f46', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}
        >
          ✖ Salir Fullscreen
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: isRecordingMode ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: isRecordingMode ? '0' : '24px', gap: '32px' }}>
        
        {/* PANEL DE CONTROL DEL GUIÓN */}
        {!isRecordingMode && (
          <div style={{ width: '100%', maxWidth: '350px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>Cronómetro del Guión</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Seguí los textos para sincronizar tu grabación.</p>
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
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>Línea de tiempo</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 0 && currentTime < 4 ? '#10B981' : '#71717a', fontWeight: currentTime >= 0 && currentTime < 4 ? 700 : 400 }}>
                <span>0.0s - Toma 1 (Tienda)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 4 && currentTime < 7 ? '#10B981' : '#71717a', fontWeight: currentTime >= 4 && currentTime < 7 ? 700 : 400 }}>
                <span>4.0s - Carritos Abandonados</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 7 && currentTime < 12 ? '#10B981' : '#71717a', fontWeight: currentTime >= 7 && currentTime < 12 ? 700 : 400 }}>
                <span>7.0s - Widgets de Confianza</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 12 && currentTime < 16 ? '#10B981' : '#71717a', fontWeight: currentTime >= 12 && currentTime < 16 ? 700 : 400 }}>
                <span>12.0s - Badge Efectivo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTime >= 16 ? '#10B981' : '#71717a', fontWeight: currentTime >= 16 ? 700 : 400 }}>
                <span>16.0s - Cierre / CTA</span>
              </div>
            </div>
          </div>
        )}

        {/* CELULAR / ZONA DE GRABACIÓN */}
        <div style={{
          width: '375px',
          height: '812px', // Proporción exacta iPhone 11/12/13/14/15
          backgroundColor: '#ffffff', // Fondo blanco de tienda real
          borderRadius: isRecordingMode ? '0' : '40px',
          border: isRecordingMode ? 'none' : '12px solid #27272a',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isRecordingMode ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}>

          {/* TELEPROMPTER / TEXTOS CAPCUT SUPERPUESTOS (Solo si hay texto) */}
          {currentText && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              zIndex: 9999,
              textAlign: 'center',
              pointerEvents: 'none' // Para que puedas seguir scrolleando la tienda debajo
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                lineHeight: '1.2',
                textTransform: 'uppercase',
                fontFamily: 'Impact, sans-serif',
                textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 5px 15px rgba(0,0,0,0.5)'
              }}>
                {currentText}
              </h2>
            </div>
          )}

          {/* SIMULACIÓN DE LA TIENDA ONLINE REAL */}
          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f9fafb', color: '#111827', scrollBehavior: 'smooth' }}>
            
            {/* Header Tienda */}
            <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>☰</span>
                <span style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px' }}>STORE.</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '20px' }}>
                <span>🔍</span>
                <span style={{ position: 'relative' }}>
                  🛒
                  <div style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: '#000000', color: '#ffffff', fontSize: '10px', fontWeight: 700, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                </span>
              </div>
            </div>

            {/* VISTA 1: HOME DE LA TIENDA */}
            {currentView === 'home' && (
              <div>
                {/* Banner */}
                <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #111827 0%, #374151 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', letterSpacing: '2px', marginBottom: '8px' }}>NUEVA COLECCIÓN</div>
                  <div style={{ fontSize: '32px', fontWeight: 900 }}>WINTER 24</div>
                </div>
                
                <div style={{ padding: '24px 20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Destacados</h3>
                  
                  {/* Grilla Productos */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    
                    {/* Producto 1 (Clickeable) */}
                    <div onClick={() => setCurrentView('product')} style={{ cursor: 'pointer' }}>
                      <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                         <div style={{ width: '60%', height: '60%', backgroundColor: '#d1d5db', borderRadius: '8px' }}></div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', lineHeight: '1.2', marginBottom: '4px' }}>Zapatillas Urbanas Clásicas</div>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>$ 85.000</div>
                    </div>

                    {/* Producto 2 */}
                    <div>
                      <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                         <div style={{ width: '60%', height: '80%', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', lineHeight: '1.2', marginBottom: '4px' }}>Mochila de Cuero Premium</div>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>$ 120.000</div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* VISTA 2: PÁGINA DE PRODUCTO CON WIDGETS NEVUX */}
            {currentView === 'product' && (
              <div>
                {/* Botón Volver (Falso pan de miga) */}
                <div 
                  onClick={() => setCurrentView('home')} 
                  style={{ padding: '12px 20px', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  ← Inicio / Zapatillas
                </div>

                {/* Imagen del Producto */}
                <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '50%', height: '50%', backgroundColor: '#d1d5db', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}></div>
                </div>

                <div style={{ padding: '20px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', lineHeight: '1.1' }}>Zapatillas Urbanas Clásicas</h1>
                  
                  {/* Precio Original */}
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#111827', marginBottom: '12px' }}>$ 85.000</div>

                  {/* WIDGET NEVUX 1: BADGE DE EFECTIVO */}
                  <div 
                    onClick={() => {
                      // Pequeña animación visual al tocar
                      const el = document.getElementById('badge-efectivo');
                      if(el) { el.style.transform = 'scale(0.95)'; setTimeout(()=> el.style.transform = 'scale(1)', 150); }
                    }}
                    id="badge-efectivo"
                    style={{ backgroundColor: '#ecfdf5', border: '1px solid #10B981', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', transition: 'transform 0.15s ease', cursor: 'pointer' }}
                  >
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      💵
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#065f46' }}>$ 72.250 <span style={{ fontSize: '12px', fontWeight: 600 }}>(15% OFF)</span></div>
                      <div style={{ fontSize: '12px', color: '#047857', fontWeight: 500 }}>Abonando con Transferencia o Efectivo</div>
                    </div>
                  </div>

                  {/* Variantes Falsas */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Talle</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ border: '1px solid #000', padding: '8px 16px', borderRadius: '4px', fontWeight: 700, fontSize: '14px' }}>39</div>
                      <div style={{ border: '1px solid #e5e7eb', color: '#9ca3af', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '14px' }}>40</div>
                      <div style={{ border: '1px solid #e5e7eb', color: '#9ca3af', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '14px' }}>41</div>
                    </div>
                  </div>

                  {/* Botón Comprar */}
                  <button style={{ width: '100%', backgroundColor: '#000000', color: '#ffffff', padding: '16px', borderRadius: '8px', fontWeight: 800, fontSize: '16px', border: 'none', marginBottom: '16px' }}>
                    AGREGAR AL CARRITO
                  </button>

                  {/* WIDGET NEVUX 2: MENSAJE DE GARANTÍA */}
                  <div 
                    onClick={() => {
                      const el = document.getElementById('msg-garantia');
                      if(el) { el.style.transform = 'scale(0.95)'; setTimeout(()=> el.style.transform = 'scale(1)', 150); }
                    }}
                    id="msg-garantia"
                    style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', transition: 'transform 0.15s ease', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '24px' }}>🛡️</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Compra 100% Protegida</div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>Devolución gratis por 30 días. Si no te gusta el producto, te devolvemos el dinero sin vueltas.</div>
                    </div>
                  </div>

                  {/* Falsa descripción extra para poder scrollear un poco */}
                  <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>Descripción del producto</h3>
                    <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                      Diseñadas para la comodidad del día a día. Capellada de eco-cuero premium y suela antideslizante ultraliviana. Ideales para combinar con cualquier outfit urbano.
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
                         }
