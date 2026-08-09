'use client';

import React from 'react';

interface BundlePromocionesPreviewProps {
  config: {
    titulo?: string;
    textoBoton?: string;
    promociones?: string[];
    configPromos?: Record<string, any>;
    colorBoton?: string;
    fondoDegrade?: boolean;
    colorPrecio?: string;
    colorSubtitulos?: string;
    fondoSubtitulo?: string;
    colorTextoRegalo?: string;
    colorPrecioRegalo?: string;
    fondoRegalo?: string;
    colorBadgeEnvio?: string;
    colorBadgePersonalizado?: string;
    colorBadgeMasVendido?: string;
    colorUnidadSeleccionada?: string;
    bordeBoton?: number;
    bordeUnidad?: number;
    tamanoEtiqueta?: string;
    tamanoPrecio?: string;
    tamanoSubtitulo?: string;
    efectoBoton?: 'sin-efecto' | 'zoom';
    pulsante?: boolean;
  };
}

export default function BundlePromocionesPreview({ config }: BundlePromocionesPreviewProps) {
  const colorBoton = config.colorBoton || '#000000';
  const fondoDegrade = config.fondoDegrade || false;
  const colorPrecio = config.colorPrecio || '#000000';
  const colorUnidadSeleccionada = config.colorUnidadSeleccionada || '#000000';
  const bordeBoton = config.bordeBoton ?? 25;
  const bordeUnidad = config.bordeUnidad ?? 8;
  const tamanoEtiqueta = config.tamanoEtiqueta || '16px';
  const tamanoPrecio = config.tamanoPrecio || '18px';
  const pulsante = config.pulsante ?? true;

  const bgBoton = fondoDegrade
    ? `linear-gradient(90deg, ${colorBoton}, ${colorBoton}dd)`
    : colorBoton;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '16px 0',
      }}
    >
      {config.titulo && (
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
          {config.titulo}
        </div>
      )}

      <div
        style={{
          border: `2px solid ${colorUnidadSeleccionada}`,
          borderRadius: bordeUnidad,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: `2px solid ${colorUnidadSeleccionada}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: colorUnidadSeleccionada,
              }}
            />
          </div>
          <div
            style={{
              fontSize: tamanoEtiqueta,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Lleva 2 paga 1
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 13,
              color: '#9ca3af',
              textDecoration: 'line-through',
              lineHeight: 1.2,
            }}
          >
            $60000.00
          </div>
          <div
            style={{
              fontSize: tamanoPrecio,
              fontWeight: 700,
              color: colorPrecio,
              lineHeight: 1.2,
            }}
          >
            $30000.00
          </div>
        </div>
      </div>

      <button
        type="button"
        style={{
          width: '100%',
          background: bgBoton,
          color: '#ffffff',
          border: 'none',
          borderRadius: bordeBoton,
          padding: '16px 20px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          animation: pulsante ? 'nevuxBundlePulse 1.6s ease-in-out infinite' : 'none',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (config.efectoBoton === 'zoom') {
            e.currentTarget.style.transform = 'scale(1.03)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {config.textoBoton || 'Agregar al carrito'}
      </button>

      <style>{`
        @keyframes nevuxBundlePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.25); }
          50% { box-shadow: 0 0 0 8px rgba(0,0,0,0); }
        }
      `}</style>
    </div>
  );
  }
