// app/admin/banners/page.tsx

"use client";

import React, { useState } from 'react';
import { 
  Instagram, 
  Smartphone, 
  Layout, 
  Clock, 
  Copy, 
  Printer,
  Package,
  ShoppingCart,
  Zap
} from 'lucide-react';

// --- COMPONENTES DE MARCA ---

const NevuxLogo = ({ color = "black" }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ 
      width: '28px', 
      height: '28px', 
      background: color, 
      borderRadius: '6px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <span style={{ color: color === 'black' ? 'white' : 'black', fontWeight: 900, fontSize: '18px', fontStyle: 'italic' }}>N</span>
    </div>
    <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px', color: color }}>
      NEVUX.AR
    </span>
  </div>
);

// --- COMPONENTE VOLANTE B&N PROFESIONAL ---

const StreetFlyer = () => {
  // TU CÓDIGO QR OFICIAL
  const userQRCode = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qr-volante-m3aP16iS0lC4X2j5X6U8n9sXp.png";

  return (
    <div id="printable-flyer" style={{ 
      width: '148mm', 
      height: '210mm', 
      background: 'white', 
      color: 'black', 
      padding: '12mm', 
      boxSizing: 'border-box', 
      border: '1px solid #000',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Logo */}
      <div style={{ marginBottom: '15mm' }}>
        <NevuxLogo color="black" />
      </div>

      {/* Main Hook - REEMPLAZADO DESPACHÁS PAQUETES */}
      <h1 style={{ 
        fontSize: '38px', 
        fontWeight: 900, 
        lineHeight: 1.05, 
        marginBottom: '8mm', 
        letterSpacing: '-1.5px',
        textTransform: 'uppercase'
      }}>
        💸 ¿TU TIENDA RECIBE VISITAS PERO NO VENDE?
      </h1>

      <p style={{ 
        fontSize: '18px', 
        fontWeight: 600, 
        marginBottom: '12mm', 
        borderLeft: '5px solid black', 
        paddingLeft: '15px',
        lineHeight: 1.3
      }}>
        Tener tráfico no sirve si tus clientes se van sin comprar. Instalá en 1 minuto las herramientas que usan las marcas líderes para convertir visitas en ventas.
      </p>

      {/* Visual Widget Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px', 
        flex: 1,
        marginBottom: '15mm' 
      }}>
        {/* Widget 1 */}
        <div style={{ border: '3px solid black', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ border: '2px solid black', padding: '6px', marginBottom: '8px' }}>
            <div style={{ height: '8px', background: 'black', width: '70%', marginBottom: '4px' }} />
            <div style={{ height: '4px', background: '#ddd', width: '100%' }} />
            <div style={{ fontSize: '9px', fontWeight: 800, textAlign: 'center', marginTop: '4px' }}>¡ENVÍO GRATIS!</div>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 900, marginBottom: '2px' }}>BARRA DE ENVÍO GRATIS</p>
            <p style={{ fontSize: '11px', lineHeight: 1.1 }}>Aumenta el ticket promedio un 30% automáticamente.</p>
          </div>
        </div>

        {/* Widget 2 */}
        <div style={{ border: '3px solid black', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ border: '2px dashed black', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800 }}>🎁 RASPÁ Y GANÁ</span>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 900, marginBottom: '2px' }}>CAPTURA DE LEADS</p>
            <p style={{ fontSize: '11px', lineHeight: 1.1 }}>Convertí curiosos en clientes por WhatsApp y Mail.</p>
          </div>
        </div>

        {/* Widget 3 */}
        <div style={{ border: '3px solid black', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ borderRadius: '20px', border: '2px solid black', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', width: 'fit-content' }}>
            <div style={{ width: '8px', height: '8px', background: 'black', borderRadius: '50%' }} />
            <div style={{ fontSize: '8px', fontWeight: 800 }}>Alguien compró hace 2 min</div>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 900, marginBottom: '2px' }}>PRUEBA SOCIAL</p>
            <p style={{ fontSize: '11px', lineHeight: 1.1 }}>Notificaciones de ventas reales en vivo.</p>
          </div>
        </div>

        {/* Widget 4 */}
        <div style={{ border: '3px solid black', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'black', color: 'white' }}>
          <div style={{ fontSize: '28px', fontWeight: 900 }}>+50</div>
          <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Widgets de Conversión</p>
        </div>
      </div>

      {/* Bottom Section - QR & Link */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'space-between',
        borderTop: '5px solid black',
        paddingTop: '10mm'
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '5px', lineHeight: 1 }}>ESCANEÁ PARA <br/>PROBAR GRATIS</h2>
          <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Exclusivo para Tiendanube.</p>
          <p style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-1px' }}>nevux.ar</p>
        </div>
        
        {/* QR CODE - EL QUE ME PASASTE */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          border: '4px solid black', 
          padding: '4px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={userQRCode} 
            alt="QR Nevux" 
            style={{ width: '100%', height: '100%', display: 'block' }} 
          />
        </div>
      </div>

      {/* Footer Legal/Info */}
      <div style={{ marginTop: '10mm', fontSize: '10px', textAlign: 'center', opacity: 0.8, fontWeight: 600 }}>
        Nevux es el aliado #1 en conversión para Tiendanube. Sin códigos ni programación.
      </div>
    </div>
  );
};

export default function AdminBanners() {
  const [activeTab, setActiveTab] = useState('volante');

  return (
    <div style={{ minHeight: '100vh', background: '#020a07', color: 'white', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
          {['volante', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: activeTab === tab ? '#10B981' : '#111827',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {tab === 'volante' ? '🖨️ VOLANTE B&N' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'volante' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#0B1512', padding: '20px', borderRadius: '12px', border: '1px solid #10B981', width: '100%', maxWidth: '600px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} /> INSTRUCCIONES PARA IMPRENTA
              </h3>
              <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                Este diseño está optimizado para <strong>Fotocopias B&N de $100</strong>. 
                El alto contraste asegura que el QR funcione incluso en papel obra económico.
              </p>
              <button 
                onClick={() => window.print()}
                style={{ marginTop: '15px', background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              >
                Imprimir A5
              </button>
            </div>
            
            <StreetFlyer />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px', color: '#4b5563' }}>
            Contenido de redes sociales cargando...
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
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
        }
