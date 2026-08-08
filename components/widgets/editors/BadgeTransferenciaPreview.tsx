'use client';

import React from 'react';

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
    colorFondoBadge = '#ff0000',
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
    ? `linear-gradient(90deg, ${colorFondo}, ${darken(colorFondo, 25)})`
    : colorFondo;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background,
    color: colorTexto,
    fontSize,
    padding: `${paddingInterno}px ${paddingInterno + 6}px`,
    borderRadius: `${bordesRedondeados}px`,
    border: mostrarBorde ? '1px solid rgba(0,0,0,0.15)' : 'none',
    fontWeight: 500,
    position: 'relative',
    lineHeight: 1.3,
    textAlign: 'center',
    maxWidth: '90%',
    animation: efecto === 'zoom' ? 'nevuxTransferZoom 2s ease-in-out infinite' : undefined,
  };

  const haloStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: `${bordesRedondeados}px`,
    boxShadow: `0 0 0 0 ${colorFondo}`,
    animation: 'nevuxTransferHalo 2s ease-out infinite',
    pointerEvents: 'none',
  };

  const badgeBase: React.CSSProperties = {
    background: colorFondoBadge,
    color: colorTextoBadge,
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 7px',
    borderRadius: 999,
    lineHeight: 1,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    animation: efectoRebote ? 'nevuxTransferBounce 1.2s ease-in-out infinite' : undefined,
  };

  const badgeFloating: React.CSSProperties = {
    ...badgeBase,
    position: 'absolute',
    top: -8,
    right: -8,
  };

  const badgeInline: React.CSSProperties = {
    ...badgeBase,
    marginLeft: 4,
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        minHeight: 80,
      }}
    >
      <style>{`
        @keyframes nevuxTransferHalo {
          0% { box-shadow: 0 0 0 0 ${colorFondo}80; }
          70% { box-shadow: 0 0 0 12px ${colorFondo}00; }
          100% { box-shadow: 0 0 0 0 ${colorFondo}00; }
        }
        @keyframes nevuxTransferZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes nevuxTransferBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
      `}</style>

      <div style={containerStyle}>
        {efecto === 'aureola' && <span style={haloStyle} />}

        {mostrarIcono && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colorTexto}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}
          >
            <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M6 12h.01" />
            <path d="M18 12h.01" />
          </svg>
        )}

        <span style={{ position: 'relative', zIndex: 1 }}>{textoFinal}</span>

        {textoBadge && posicionBadge === 'final-texto' && (
          <span style={badgeInline}>{textoBadge}</span>
        )}

        {textoBadge && posicionBadge === 'esquina-superior-derecha' && (
          <span style={badgeFloating}>{textoBadge}</span>
        )}
      </div>
    </div>
  );
                         }
