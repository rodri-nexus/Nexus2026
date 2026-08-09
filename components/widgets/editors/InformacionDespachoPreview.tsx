'use client';

import React from 'react';

interface PreviewProps {
  config: {
    // General
    horaCorte: string;
    diasDespacho: {
      lun: boolean;
      mar: boolean;
      mie: boolean;
      jue: boolean;
      vie: boolean;
      sab: boolean;
      dom: boolean;
    };
    ocultarSiPasoCorte: boolean;
    agregarBadge: boolean;
    // Ubicación
    posicion: 'encima-form' | 'antes-descripcion';
    // Estilos
    icono: 'circulo' | 'corazon' | 'alerta' | 'emoji' | 'nada';
    efecto: 'aureola' | 'zoom' | 'sin-efecto';
    aplicarEfectoA: 'solo-icono' | 'mensaje-completo';
    tamanoFuente: number;
    estiloTexto: 'normal' | 'negrita';
    colorFondo: string;
    fondoDegradado: boolean;
    colorTexto: string;
    colorBadge: string;
    colorTextoBadge: string;
    bordesRedondeados: number;
    paddingInterno: number;
    activarBorde: boolean;
  };
}

/* ============ ICONOS ============ */

function IconoCirculo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#10B981">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function IconoCorazon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#EF4444">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconoAlerta({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B">
      <path d="M12 2L1 21h22L12 2zm0 5l7.53 13H4.47L12 7zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z" />
    </svg>
  );
}

function renderIcono(tipo: string, size: number) {
  switch (tipo) {
    case 'circulo':
      return <IconoCirculo size={size} />;
    case 'corazon':
      return <IconoCorazon size={size + 2} />;
    case 'alerta':
      return <IconoAlerta size={size + 2} />;
    case 'emoji':
      return <span style={{ fontSize: size + 4, lineHeight: 1 }}>✏️</span>;
    case 'nada':
    default:
      return null;
  }
}

/* ============ PREVIEW ============ */

export default function InformacionDespachoPreview({ config }: PreviewProps) {
  const fontWeight = config.estiloTexto === 'negrita' ? 700 : 400;
  const fontSize = config.tamanoFuente || 15;

  const background = config.fondoDegradado
    ? `linear-gradient(135deg, ${config.colorFondo} 0%, ${config.colorFondo}dd 100%)`
    : config.colorFondo;

  const border = config.activarBorde ? `1px solid ${config.colorTexto}33` : 'none';

  // Color del badge (soporta rgba o hex)
  const badgeBg =
    config.colorBadge && config.colorBadge.trim() !== ''
      ? config.colorBadge
      : 'rgba(0,0,0,0.18)';

  // Efectos
  const efectoIcono =
    config.efecto === 'aureola'
      ? 'nevux-despacho-aureola 2s ease-in-out infinite'
      : config.efecto === 'zoom'
      ? 'nevux-despacho-zoom 2s ease-in-out infinite'
      : 'none';

  const aplicarASoloIcono = config.aplicarEfectoA === 'solo-icono';
  const animacionCard = !aplicarASoloIcono ? efectoIcono : 'none';
  const animacionIcono = aplicarASoloIcono ? efectoIcono : 'none';

  const iconoSize = fontSize + 2;
  const iconoNode = renderIcono(config.icono, iconoSize);

  return (
    <>
      {/* Keyframes locales para el preview */}
      <style>{`
        @keyframes nevux-despacho-aureola {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
        }
        @keyframes nevux-despacho-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: background,
          color: config.colorTexto,
          borderRadius: config.bordesRedondeados,
          padding: `${config.paddingInterno + 4}px ${config.paddingInterno + 8}px`,
          border: border,
          animation: animacionCard,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* IZQUIERDA: ícono + texto + badge HOY */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flex: 1,
            minWidth: 0,
          }}
        >
          {iconoNode && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
                animation: animacionIcono,
              }}
            >
              {iconoNode}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minWidth: 0,
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: fontSize,
                fontWeight: fontWeight,
                lineHeight: 1.25,
                color: config.colorTexto,
              }}
            >
              Comprando ahora tu pedido se despacha
            </span>

            <span
              style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                background: badgeBg,
                color: config.colorTextoBadge,
                fontSize: Math.max(11, fontSize - 3),
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 6,
                letterSpacing: '0.04em',
              }}
            >
              HOY
            </span>
          </div>
        </div>

        {/* DERECHA: badge "Te quedan 2h 30m" */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: badgeBg,
            color: config.colorTextoBadge,
            padding: '8px 12px',
            borderRadius: 8,
            flexShrink: 0,
            minWidth: 78,
            lineHeight: 1.15,
          }}
        >
          <span
            style={{
              fontSize: Math.max(10, fontSize - 5),
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            Te quedan
          </span>
          <span
            style={{
              fontSize: Math.max(14, fontSize),
              fontWeight: 800,
            }}
          >
            2h 30m
          </span>
        </div>
      </div>
    </>
  );
  }
