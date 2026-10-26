// app/admin/banners/page.tsx

"use client";

import React, { useState } from 'react';
import { Printer, Instagram } from 'lucide-react';

// --- COMPONENTE VOLANTE COMPACTO PARA CAPTURA ---

const StreetFlyer = () => {
  // Código QR oficial enviado por Rodrigo
  const userQRCode = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qr-volante-m3aP16iS0lC4X2j5X6U8n9sXp.png";

  return (
    <div id="printable-flyer" style={{ 
      width: '100%', 
      maxWidth: '310px', // TAMAÑO REDUCIDO PARA CAPTURA PERFECTA
      background: 'white', 
      color: 'black', 
      padding: '14px 12px', 
      borderRadius: '16px',
      border: '2px solid black',
      boxSizing: 'border-box', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '0 auto',
      boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
    }}>
      {/* Header Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '8px', borderBottom: '2px solid black', marginBottom: '10px' }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          background: 'black', 
          color: 'white', 
          borderRadius: '3px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 900, 
          fontSize: '13px',
          fontStyle: 'italic'
        }}>
          N
        </div>
        <span style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '-0.5px' }}>
          NEVUX
        </span>
      </div>

      {/* Main Headline */}
      <h1 style={{ 
        fontSize: '16px', 
        fontWeight: 900, 
        textAlign: 'center', 
        lineHeight: 1.15, 
        marginBottom: '6px',
        letterSpacing: '-0.3px',
        textTransform: 'uppercase'
      }}>
        AUMENTÁ TUS VENTAS SIN GASTAR MAS EN ADS.
      </h1>

      {/* Subtitle */}
      <p style={{ 
        fontSize: '9px', 
        fontWeight: 600, 
        textAlign: 'center', 
        marginBottom: '10px',
        color: '#111',
        lineHeight: 1.25
      }}>
        Optimizá la conversión de tu Tiendanube en 2 minutos con widgets interactivos.
      </p>

      {/* WIDGET 1: BARRA DE ENVÍO GRATIS */}
      <div style={{ 
        border: '1.5px solid black', 
        borderRadius: '8px', 
        padding: '6px 8px', 
        marginBottom: '6px',
        background: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px', fontWeight: 800, marginBottom: '4px' }}>
          <span>🚚 BARRA DE ENVÍO GRATIS</span>
          <span>$12.500 / $15.000</span>
        </div>
        
        <div style={{ 
          width: '100%', 
          height: '10px', 
          border: '1.5px solid black', 
          borderRadius: '6px', 
          overflow: 'hidden',
          padding: '1px',
          background: 'white',
          marginBottom: '4px'
        }}>
          <div style={{ width: '82%', height: '100%', background: 'black', borderRadius: '4px' }} />
        </div>

        <div style={{ fontSize: '8px', fontWeight: 800, textAlign: 'center' }}>
          ¡Te faltan $2.500 para ENVÍO GRATIS! 🛒
        </div>
      </div>

      {/* WIDGET 2: RASPÁ Y GANÁ */}
      <div style={{ 
        border: '1.5px solid black', 
        borderRadius: '8px', 
        padding: '6px 8px', 
        marginBottom: '6px',
        background: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px', fontWeight: 800, marginBottom: '4px' }}>
          <span>🎁 RASPÁ Y GANA (LEADS)</span>
          <span style={{ border: '1px solid black', padding: '0px 4px', borderRadius: '3px', fontSize: '7px' }}>PREMIO</span>
        </div>

        <div style={{ 
          border: '1px dashed black', 
          borderRadius: '6px', 
          padding: '4px 8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '9px', fontWeight: 900 }}>🎉 ¡GANASTE 15% OFF!</span>
          <span style={{ background: 'black', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '7px', fontWeight: 900 }}>
            RECLAMAR
          </span>
        </div>
      </div>

      {/* WIDGET 3 & 4: NOTIFICACIÓN EN VIVO & STOCK REAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
        
        <div style={{ border: '1.5px solid black', borderRadius: '8px', padding: '5px 6px' }}>
          <div style={{ fontSize: '7.5px', fontWeight: 900, marginBottom: '1px' }}>💬 NOTIFICACIÓN VIVO</div>
          <div style={{ fontSize: '7.5px', fontWeight: 600, lineHeight: 1.1 }}>
            Juan M. compró hace 3 min 🛍️
          </div>
        </div>

        <div style={{ border: '1.5px solid black', borderRadius: '8px', padding: '5px 6px' }}>
          <div style={{ fontSize: '7.5px', fontWeight: 900, marginBottom: '1px' }}>🔥 STOCK REAL</div>
          <div style={{ fontSize: '7.5px', fontWeight: 600, lineHeight: 1.1 }}>
            🔥 ¡Últimas 3 unidades!
          </div>
        </div>

      </div>

      {/* CONTENEDOR PRINCIPAL DEL QR */}
      <div style={{ 
        border: '1.5px solid black', 
        borderRadius: '12px', 
        padding: '8px', 
        textAlign: 'center',
        marginBottom: '8px',
        background: 'white'
      }}>
        <div style={{ fontSize: '9.5px', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.2px' }}>
          📲 ESCANEÁ Y PROBÁ 7 DÍAS GRATIS
        </div>

        <div style={{ 
          width: '95px', 
          height: '95px', 
          margin: '0 auto 6px auto', 
          border: '1.5px solid black', 
          borderRadius: '8px',
          padding: '4px',
          background: 'white'
        }}>
          <img 
            src={userQRCode} 
            alt="Código QR Nevux" 
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} 
          />
        </div>

        <div style={{ 
          background: 'black', 
          color: 'white', 
          padding: '6px', 
          borderRadius: '6px', 
          fontWeight: 900, 
          fontSize: '9.5px',
          letterSpacing: '0.3px',
          marginBottom: '4px'
        }}>
          INSTALACIÓN EN 1 CLIC
        </div>

        <div style={{ fontSize: '7.5px', fontWeight: 700, opacity: 0.9 }}>
          Sin tarjeta de crédito · App Oficial Tiendanube
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid black', paddingTop: '6px', textAlign: 'center' }}>
        
        <div style={{ fontSize: '11px', fontWeight: 900, marginBottom: '2px', letterSpacing: '-0.3px' }}>
          nevux.ar
        </div>

        {/* Slogan Agrandado */}
        <div style={{ fontSize: '9.5px', fontWeight: 900, lineHeight: 1.2 }}>
          50 Widgets + 6 funciones para impulsar tu Tiendanube
        </div>

      </div>
    </div>
  );
};

// --- ESTRUCTURA DE LA PÁGINA ---

export default function AdminBanners() {
  const [activeTab, setActiveTab] = useState('volante');

  return (
    <div style={{ minHeight: '100vh', background: '#020a07', color: 'white', padding: '16px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: '#10B981', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>N</div>
            <span style={{ fontWeight: 900, fontSize: '18px', color: 'white' }}>NEVUX ADMIN</span>
          </div>
          <button 
            onClick={() => window.print()}
            style={{ 
              background: '#10B981', 
              color: 'white', 
              border: 'none', 
              padding: '8px 14px', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px'
            }}
          >
            <Printer size={14} /> Imprimir A5
          </button>
        </header>

        {/* Tabs Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '20px', 
          overflowX: 'auto', 
          paddingBottom: '6px'
        }}>
          {['volante', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                background: activeTab === tab ? '#10B981' : '#0B1512',
                color: activeTab === tab ? 'white' : '#9CA3AF',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '12px'
              }}
            >
              {tab === 'volante' ? '📄 VOLANTE (CAPTURA)' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'volante' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <StreetFlyer />
          </div>
        )}

        {activeTab !== 'volante' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF', background: '#0B1512', borderRadius: '12px' }}>
            <Instagram size={36} color="#10B981" style={{ marginBottom: '8px' }} />
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Contenido de {activeTab.toUpperCase()}</h3>
          </div>
        )}

      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; background: white !important; }
          #printable-flyer, #printable-flyer * { visibility: visible; }
          #printable-flyer { 
            position: fixed; 
            left: 50%; 
            top: 50%; 
            transform: translate(-50%, -50%) scale(1.6); 
            border: 2px solid black !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
  }
