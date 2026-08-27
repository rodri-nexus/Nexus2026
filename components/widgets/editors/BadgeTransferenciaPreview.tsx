'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface BadgeTransferenciaPreviewConfig {
  porcentajeDescuento?: string;
  tipoMensaje?: 'descuento' | 'precio';
  mensajeDescuento?: string;
  mensajePrecio?: string;
  mostrarIcono?: boolean;
  textoBadge?: string;
  efectoRebote?: boolean;
  posicionBadge?: 'esquina-superior-derecha' | 'final-texto';
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

interface BadgeTransferenciaPreviewProps {
  config: BadgeTransferenciaPreviewConfig;
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
export default function BadgeTransferenciaPreview({ config }: BadgeTransferenciaPreviewProps) {
  const {
    porcentajeDescuento = '',
    tipoMensaje = 'descuento',
    mensajeDescuento = '{descuento}% de descuento pagando con transferencia',
    mensajePrecio = '{precio} pagando con transferencia',
    mostrarIcono = false,
    textoBadge = '',
    efectoRebote = false,
    posicionBadge = 'esquina-superior-derecha',
    colorFondo = '#ededed',
    colorTexto = '#191919',
    fondoDegradado = false,
    fontSize = '13px',
    mostrarBorde = false,
    paddingInterno = 10,
    bordesRedondeados = 25,
    efecto = 'sin-efecto',
    colorFondoBadge = '#10B981',
    colorTextoBadge = '#ffffff',
  } = config;

  // Construir el texto del mensaje
  let textoFinal = '';
  if (tipoMensaje === 'descuento') {
    const descTxt = porcentajeDescuento && porcentajeDescuento.trim() !== ''
      ? porcentajeDescuento
      : 'X';
    textoFinal = mensajeDescuento.replace('{descuento}', descTxt);
  } else {
    textoFinal = mensajePrecio.replace('{precio}', '$X.XXX');
  }

  const background = fondoDegradado
    ? `linear-gradient(90deg, ${colorFondo}, ${darken(colorFondo, 22)})`
    : colorFondo;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    background,
    color: colorTexto,
    fontSize,
    padding: `${paddingInterno}px ${paddingInterno + 8}px`,
    borderRadius: `${bordesRedondeados}px`,
    border: mostrarBorde ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.25)',
    fontWeight: 600,
    position: 'relative',
    lineHeight: 1.3,
    textAlign: 'center',
    maxWidth: '90%',
    overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transition: 'all 0.2s ease',
    animation:
      efecto === 'zoom' ? 'nvxTransferZoom 2.5s ease-in-out infinite' : undefined,
  };

  const haloStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: `${bordesRedondeados}px`,
    animation: 'nvxTransferHalo 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
    animation: efectoRebote ? 'nvxTransferBounce 1.4s ease-in-out infinite' : undefined,
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
        @keyframes nvxTransferHalo {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        @keyframes nvxTransferZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes nvxTransferBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes nvxBorderSnake {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
        <div style={containerStyle}>
          {efecto === 'aureola' && <span style={haloStyle} />}

          {/* EFECTO BORDE LUMINOSO DIGITAL (Tech Flow) */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(16, 185, 129, 0.25) 60deg, transparent 120deg)',
              animation: 'nvxBorderSnake 6s linear infinite',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {mostrarIcono && (
            <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
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
                <rect x="2" y="6" width="20" height="12" rx="3" ry="3" />
                <circle cx="12" cy="12" r="3" />
                <path d="M6 12h.01" />
                <path d="M18 12h.01" />
              </svg>
            </div>
          )}

          <span style={{ position: 'relative', zIndex: 2, letterSpacing: '-0.01em' }}>
            {textoFinal}
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
