'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface BadgeEnvioPreviewConfig {
  modoEnvio?: 'siempre' | 'a-partir-de';
  mostrarIcono?: boolean;
  textoBadge?: string;
  efectoRebote?: boolean;
  posicionBadge?: 'esquina-superior-derecha' | 'final-texto';
  mostrarEnProducto?: boolean;
  mostrarEnGrilla?: boolean;
  colorFondo?: string;
  colorTexto?: string;
  fondoDegradado?: boolean;
  fontSize?: string;
  mostrarBorde?: boolean;
  paddingInterno?: number;
  bordesRedondeados?: number;
  efecto?: 'aureola' | 'zoom' | 'sin-efecto';
  colorFondoBadge?: string;
  colorTextoBadge?: string;
}

interface BadgeEnvioPreviewProps {
  config: BadgeEnvioPreviewConfig;
}

function darken(hex: string, amount: number = 20): string {
  try {
    const c = hex.replace('#', '');
    const num = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16);
    let r = (num >> 16) - amount;
    let g = ((num >> 8) & 0xff) - amount;
    let b = (num & 0xff) - amount;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch {
    return hex;
  }
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BadgeEnvioPreview({ config }: BadgeEnvioPreviewProps) {
  const {
    mostrarIcono = true,
    textoBadge = '',
    efectoRebote = false,
    posicionBadge = 'esquina-superior-derecha',
    colorFondo = '#ededed',
    colorTexto = '#000000',
    fondoDegradado = false,
    fontSize = '13px',
    mostrarBorde = false,
    paddingInterno = 10,
    bordesRedondeados = 25,
    efecto = 'sin-efecto',
    colorFondoBadge = '#10B981',
    colorTextoBadge = '#ffffff',
  } = config;

  const background = fondoDegradado
    ? `linear-gradient(90deg, ${colorFondo}, ${darken(colorFondo, 22)})`
    : colorFondo;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    background,
    color: colorTexto,
    fontSize,
    padding: `${paddingInterno}px ${paddingInterno + 8}px`,
    borderRadius: `${bordesRedondeados}px`,
    border: mostrarBorde ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.2)',
    fontWeight: 600,
    position: 'relative',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transition: 'all 0.2s ease',
    animation:
      efecto === 'zoom' ? 'nvxEnvioZoom 2.5s ease-in-out infinite' : undefined,
  };

  const haloStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: `${bordesRedondeados}px`,
    animation: 'nvxEnvioHalo 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    pointerEvents: 'none',
  };

  const badgeBase: React.CSSProperties = {
    background: colorFondoBadge,
    color: colorTextoBadge,
    fontSize: 10,
    fontWeight: 800,
    padding: '3px 8px',
    borderRadius: 999,
    lineHeight: 1,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    animation: efectoRebote
      ? 'nvxEnvioBounce 1.4s ease-in-out infinite'
      : undefined,
  };

  const badgeFloating: React.CSSProperties = {
    ...badgeBase,
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 3,
  };

  const badgeInline: React.CSSProperties = {
    ...badgeBase,
    marginLeft: 4,
    zIndex: 2,
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 16px',
        minHeight: 80,
      }}
    >
      <style>{`
        @keyframes nvxEnvioHalo {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        @keyframes nvxEnvioZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes nvxEnvioBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes nvxTruckDrive {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2px); }
        }
        @keyframes nvxSpeedTrail {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div style={containerStyle}>
          {efecto === 'aureola' && <span style={haloStyle} />}

          {/* LÍNEAS DE VELOCIDAD DE FONDO */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              animation: 'nvxSpeedTrail 3s linear infinite',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {mostrarIcono && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                animation: 'nvxTruckDrive 1.2s ease-in-out infinite',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colorTexto}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M10 17h4V5H2v12h3" />
                <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
                <path d="M14 17h1" />
                <circle cx="7.5" cy="17.5" r="2.5" />
                <circle cx="17.5" cy="17.5" r="2.5" />
              </svg>
            </div>
          )}

          <span style={{ position: 'relative', zIndex: 2, letterSpacing: '-0.01em' }}>
            Envío gratis
          </span>

          {textoBadge && posicionBadge === 'final-texto' && (
            <span style={badgeInline}>{textoBadge}</span>
          )}
        </div>

        {textoBadge && posicionBadge === 'esquina-superior-derecha' && (
          <span style={badgeFloating}>{textoBadge}</span>
        )}
      </div>
    </div>
  );
      }
