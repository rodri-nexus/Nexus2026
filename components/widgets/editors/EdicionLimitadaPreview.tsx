'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
export interface EdicionLimitadaConfig {
  textoPrincipal: string;
  subtexto: string;
  forma: 'circular' | 'badge-rect' | 'cinta-diagonal' | 'sello-borde';
  posicion: 'esquina-superior-derecha' | 'esquina-superior-izquierda' | 'inline-precio';
  rotacion: number;
  efecto: 'sin-efecto' | 'brillo-pulsante' | 'zoom-suave';
  tamano: 'chico' | 'mediano' | 'grande';
  colorFondo: string;
  colorTexto: string;
  colorBorde: string;
  mostrarBorde: boolean;
  mostrarEnProducto: boolean;
  mostrarEnGrilla: boolean;
  campaignTheme?: string;
}

interface Props {
  config: EdicionLimitadaConfig;
}

/* ═══════════════════════════════════════════
   PRESETS DE CAMPAÑA
═══════════════════════════════════════════ */
const CAMPAIGN_COLORS: Record<string, { bg: string; text: string; border: string; label?: string }> = {
  'black-friday': { bg: '#111827', text: '#F59E0B', border: '#F59E0B' },
  'hot-sale': { bg: '#0F172A', text: '#EF4444', border: '#EF4444' },
  'cyber-monday': { bg: '#090D16', text: '#3B82F6', border: '#3B82F6' },
  'navidad': { bg: '#064E3B', text: '#EF4444', border: '#EF4444' },
  'san-valentin': { bg: '#831843', text: '#F43F5E', border: '#F43F5E' },
  'dia-padre-madre': { bg: '#312E81', text: '#10B981', border: '#10B981' },
  'liquidacion': { bg: '#7F1D1D', text: '#FBBF24', border: '#FBBF24' },
};

/* ═══════════════════════════════════════════
   COMPONENTE PREVIEW LIVE
═══════════════════════════════════════════ */
export default function EdicionLimitadaPreview({ config }: Props) {
  const theme = config.campaignTheme && config.campaignTheme !== 'none'
    ? CAMPAIGN_COLORS[config.campaignTheme]
    : null;

  const bg = theme ? theme.bg : config.colorFondo;
  const color = theme ? theme.text : config.colorTexto;
  const borderColor = theme ? theme.border : config.colorBorde;

  // Escala según tamaño
  const scaleMultiplier = config.tamano === 'chico' ? 0.85 : config.tamano === 'grande' ? 1.15 : 1;

  // Render según forma
  const renderSticker = () => {
    const rotationStyle = {
      transform: `rotate(${config.rotacion}deg) scale(${scaleMultiplier})`,
      transformOrigin: 'center center',
      transition: 'all 0.2s ease',
    };

    if (config.forma === 'circular') {
      return (
        <div
          style={{
            ...rotationStyle,
            width: 82,
            height: 82,
            borderRadius: '50%',
            background: bg,
            color: color,
            border: config.mostrarBorde ? `2px dashed ${borderColor}` : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 6,
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 13, lineHeight: 1 }}>✨</span>
          <span style={{ fontSize: 9.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
            {config.textoPrincipal || 'EDICIÓN LIMITADA'}
          </span>
          {config.subtexto && (
            <span style={{ fontSize: 7.5, opacity: 0.9, marginTop: 2, fontWeight: 700, lineHeight: 1 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      );
    }

    if (config.forma === 'cinta-diagonal') {
      return (
        <div
          style={{
            ...rotationStyle,
            background: bg,
            color: color,
            borderTop: config.mostrarBorde ? `1.5px solid ${borderColor}` : 'none',
            borderBottom: config.mostrarBorde ? `1.5px solid ${borderColor}` : 'none',
            padding: '4px 18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            ✦ {config.textoPrincipal || 'EDICIÓN LIMITADA'} ✦
          </span>
          {config.subtexto && (
            <span style={{ fontSize: 7.5, opacity: 0.9, fontWeight: 700 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      );
    }

    if (config.forma === 'sello-borde') {
      return (
        <div
          style={{
            ...rotationStyle,
            background: bg,
            color: color,
            border: `2px solid ${borderColor}`,
            borderRadius: 6,
            padding: '6px 12px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            outline: config.mostrarBorde ? `1.5px dashed ${borderColor}` : 'none',
            outlineOffset: 3,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10 }}>🏷️</span>
            <span style={{ fontSize: 10.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              {config.textoPrincipal || 'EDICIÓN LIMITADA'}
            </span>
          </div>
          {config.subtexto && (
            <span style={{ fontSize: 8, opacity: 0.9, marginTop: 3, fontWeight: 700 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      );
    }

    // Default: badge-rect
    return (
      <div
        style={{
          ...rotationStyle,
          background: bg,
          color: color,
          border: config.mostrarBorde ? `1.5px solid ${borderColor}` : 'none',
          borderRadius: 999,
          padding: '6px 14px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 11 }}>🔥</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 10.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
            {config.textoPrincipal || 'EDICIÓN LIMITADA'}
          </span>
          {config.subtexto && (
            <span style={{ fontSize: 8, opacity: 0.9, fontWeight: 700, lineHeight: 1 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #e5e7eb',
        borderRadius: 14,
        padding: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN PRODUCTO
      </div>

      {/* Mockup de ficha de producto */}
      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 14,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Simulación imagen de producto */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 110,
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          👟
          {/* Sticker en esquina sobre imagen */}
          {config.posicion !== 'inline-precio' && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                ...(config.posicion === 'esquina-superior-izquierda' ? { left: 8 } : { right: 8 }),
                zIndex: 2,
              }}
            >
              {renderSticker()}
            </div>
          )}
        </div>

        {/* Info producto */}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>
            Zapatillas Air Edition Pro
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#10B981', marginTop: 2 }}>
            $ 89.990
          </div>

          {/* Sticker inline */}
          {config.posicion === 'inline-precio' && (
            <div style={{ marginTop: 10, display: 'inline-flex' }}>
              {renderSticker()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
