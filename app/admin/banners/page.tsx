// app/admin/banners/page.tsx

"use client";

import React, { useState } from 'react';
import { 
  Printer, 
  Copy, 
  CheckCircle2, 
  Smartphone, 
  Instagram, 
  Layout, 
  Clock 
} from 'lucide-react';

// --- COMPONENTE VOLANTE B&N (COPIA FIEL DEL DISEÑO SOLICITADO) ---

const StreetFlyer = () => {
  // Código QR oficial enviado por Rodrigo
  const userQRCode = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qr-volante-m3aP16iS0lC4X2j5X6U8n9sXp.png";

  return (
    <div id="printable-flyer" style={{ 
      width: '100%', 
      maxWidth: '400px', 
      background: 'white', 
      color: 'black', 
      padding: '20px 18px', 
      borderRadius: '20px',
      border: '2px solid black',
      boxSizing: 'border-box', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '0 auto',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
    }}>
      {/* Header Logo con línea divisoria */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '2px solid black', marginBottom: '16px' }}>
        <div style={{ 
          width: '26px', 
          height: '26px', 
          background: 'black', 
          color: 'white', 
          borderRadius: '4px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 900, 
          fontSize: '18px',
          fontStyle: 'italic'
        }}>
          N
        </div>
        <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px' }}>
          NEVUX
        </span>
      </div>

      {/* Main Headline */}
      <h1 style={{ 
        fontSize: '23px', 
        fontWeight: 900, 
        textAlign: 'center', 
        lineHeight: 1.15, 
        marginBottom: '8px',
        letterSpacing: '-0.5px',
        textTransform: 'uppercase'
      }}>
        AUMENTÁ TUS VENTAS SIN GASTAR MAS EN ADS.
      </h1>

      {/* Subtitle */}
      <p style={{ 
        fontSize: '12px', 
        fontWeight: 600, 
        textAlign: 'center', 
        marginBottom: '16px',
        color: '#111',
        lineHeight: 1.3
      }}>
        Optimizá la conversión de tu Tiendanube en 2 minutos con widgets interactivos.
      </p>

      {/* --- WIDGET 1: BARRA DE ENVÍO GRATIS --- */}
      <div style={{ 
        border: '2px solid black', 
        borderRadius: '12px', 
        padding: '10px 12px', 
        marginBottom: '10px',
        background: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 800, marginBottom: '6px' }}>
          <span>🚚 BARRA DE ENVÍO GRATIS</span>
          <span>$12.500 / $15.000</span>
        </div>
        
        {/* Progress Bar Container */}
        <div style={{ 
          width: '100%', 
          height: '14px', 
          border: '2px solid black', 
          borderRadius: '10px', 
          overflow: 'hidden',
          padding: '1px',
          background: 'white',
          marginBottom: '6px'
        }}>
          <div style={{ width: '82%', height: '100%', background: 'black', borderRadius: '8px' }} />
        </div>

        <div style={{ fontSize: '11px', fontWeight: 800, textAlign: 'center' }}>
          ¡Te faltan $2.500 para ENVÍO GRATIS! 🛒
        </div>
      </div>

      {/* --- WIDGET 2: RASPÁ Y GANÁ (LEADS) --- */}
      <div style={{ 
        border: '2px solid black', 
        borderRadius: '12px', 
        padding: '10px 12px', 
        marginBottom: '10px',
        background: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 800, marginBottom: '8px' }}>
          <span>🎁 RASPÁ Y GANA (LEADS)</span>
          <span style={{ border: '1px solid black', padding: '1px 6px', borderRadius: '4px', fontSize: '9px' }}>PREMIO</span>
        </div>

        <div style={{ 
          border: '1.5px dashed black', 
          borderRadius: '8px', 
          padding: '8px 12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 900 }}>🎉 ¡GANASTE 15% OFF!</span>
          <span style={{ background: 'black', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 900 }}>
            RECLAMAR
          </span>
        </div>
      </div>

      {/* --- WIDGET 3 & 4: NOTIFICACIÓN EN VIVO & STOCK REAL (2 COLUMNAS) --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        
        <div style={{ border: '2px solid black', borderRadius: '12px', padding: '8px 10px' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, marginBottom: '2px' }}>💬 NOTIFICACIÓN VIVO</div>
          <div style={{ fontSize: '10px', fontWeight: 600, lineHeight: 1.2 }}>
            Juan M. compró hace 3 min 🛍️
          </div>
        </div>

        <div style={{ border: '2px solid black', borderRadius: '12px', padding: '8px 10px' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, marginBottom: '2px' }}>🔥 STOCK REAL</div>
          <div style={{ fontSize: '10px', fontWeight: 600, lineHeight: 1.2 }}>
            🔥 ¡Últimas 3 unidades!
          </div>
        </div>

      </div>

      {/* --- CONTENEDOR PRINCIPAL DEL QR --- */}
      <div style={{ 
        border: '2px solid black', 
        borderRadius: '16px', 
        padding: '14px', 
        textAlign: 'center',
        marginBottom: '14px',
        background: 'white'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.3px' }}>
          📲 ESCANEÁ Y PROBÁ 7 DÍAS GRATIS
        </div>

        {/* Imagen del QR Oficial */}
        <div style={{ 
          width: '140px', 
          height: '140px', 
          margin: '0 auto 12px auto', 
          border: '2px solid black', 
          borderRadius: '12px',
          padding: '6px',
          background: 'white'
        }}>
          <img 
            src={userQRCode} 
            alt="Código QR Nevux" 
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} 
          />
        </div>

        {/* Botón CTA */}
        <div style={{ 
          background: 'black', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '8px', 
          fontWeight: 900, 
          fontSize: '13px',
          letterSpacing: '0.5px',
          marginBottom: '6px'
        }}>
          INSTALACIÓN EN 1 CLIC
        </div>

        <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.9 }}>
          Sin tarjeta de crédito · App Oficial Tiendanube
        </div>
      </div>

      {/* Línea Divisoria Inferior */}
      <div style={{ borderTop: '1.5px solid black', paddingTop: '10px', textAlign: 'center' }}>
        
        {/* Dominio Actualizado */}
        <div style={{ fontSize: '15px', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.3px' }}>
          nevux.ar
        </div>

        {/* Slogan AGRANDADO como pediste */}
        <div style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1.2, textTransform: 'none' }}>
          50 Widgets + 6 funciones para impulsar tu Tiendanube
        </div>

      </div>
    </div>
  );
};

// --- ESTRUCTURA PRINCIPAL DE LA PÁGINA ADMIN ---

export default function InstagramPlanner() {
  const [activeTab, setActiveTab] = useState('volante');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Texto copiado al portapapeles");
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020a07', color: 'white', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>N</div>
            <span style={{ fontWeight: 900, fontSize: '20px', color: 'white' }}>NEVUX ADMIN</span>
          </div>
          <span style={{ background: '#0B1512', border: '1px solid #10B981', color: '#10B981', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
            Generador de Volantes & Contenido Redes
          </span>
        </header>

        {/* Tabs Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px', 
          overflowX: 'auto', 
          paddingBottom: '8px',
          borderBottom: '1px solid #111827'
        }}>
          {['volante', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: activeTab === tab ? '#10B981' : '#0B1512',
                color: activeTab === tab ? 'white' : '#9CA3AF',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '13px'
              }}
            >
              {tab === 'volante' ? '📄 VOLANTE B&N (OFICIAL)' : tab}
            </button>
          ))}
        </div>

        {/* Pestaña Volante */}
        {activeTab === 'volante' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            
            <div style={{ background: '#0B1512', border: '1px solid #10B981', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
              <h3 style={{ color: '#10B981', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} /> IMPRESIÓN DIRECTA DE VOLANTE A5
              </h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.4, marginBottom: '14px' }}>
                Este diseño exacto está listo para fotocopias en blanco y negro económica ($100 ARS). Tamaño ideal: A5.
              </p>
              <button 
                onClick={() => window.print()}
                style={{ 
                  background: '#10B981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Printer size={16} /> Imprimir Volante Ahora
              </button>
            </div>

            {/* Vista Previa del Volante */}
            <StreetFlyer />
          </div>
        )}

        {/* Pestañas de Días de la semana */}
        {activeTab !== 'volante' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF', background: '#0B1512', borderRadius: '12px' }}>
            <Instagram size={48} color="#10B981" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Plan de Contenidos para {activeTab.toUpperCase()}</h3>
            <p style={{ fontSize: '14px' }}>Los carruseles, reels y publicaciones de este día están configurados.</p>
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
            transform: translate(-50%, -50%); 
            border: 2px solid black !important;
            box-shadow: none !important;
            width: 148mm !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
                     }
