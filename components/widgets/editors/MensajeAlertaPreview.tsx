'use client';

import React from 'react';

interface MensajeAlertaPreviewProps {
  config: {
    mensaje: string;
    icono: 'circulo' | 'corazon' | 'alerta' | 'emoji' | 'imagen' | 'nada';
    emojiCustom: string;
    imagenUrl: string;
    color: 'verde' | 'rojo' | 'amarillo' | 'personalizado';
    colorPersonalizadoFondo: string;
    colorPersonalizadoTexto: string;
    tamanoTexto: number;
    estiloTexto: 'normal' | 'resaltado';
    efecto: 'aureola' | 'zoom' | 'ninguno';
    aplicarEfectoA: 'icono' | 'completo';
    bordesRedondeados: number;
    paddingInterno: number;
    mostrarBorde: boolean;
  };
}

function getColores(
  color: string,
  personalizadoFondo: string,
  personalizadoTexto: string
): { fondo: string; texto: string; borde: string; circulo: string } {
  switch (color) {
    case 'verde':
      return {
        fondo: '#22c55e',
        texto: '#ffffff',
        borde: '#15803d',
        circulo: '#15803d',
      };
    case 'rojo':
      return {
        fondo: '#ef4444',
        texto: '#ffffff',
        borde: '#b91c1c',
        circulo: '#b91c1c',
      };
    case 'amarillo':
      return {
        fondo: '#f59e0b',
        texto: '#ffffff',
        borde: '#b45309',
        circulo: '#ffffff',
      };
    case 'personalizado':
      return {
        fondo: personalizadoFondo,
        texto: personalizadoTexto,
        borde: personalizadoFondo,
        circulo: personalizadoTexto,
      };
    default:
      return {
        fondo: '#f59e0b',
        texto: '#ffffff',
        borde: '#b45309',
        circulo: '#ffffff',
      };
  }
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return (
    '#' +
    (0x1000000 + R * 0x10000 + G * 0x100 + B)
      .toString(16)
      .slice(1)
      .padStart(6, '0')
  );
}

export default function MensajeAlertaPreview({ config }: MensajeAlertaPreviewProps) {
  const colores = getColores(
    config.color,
    config.colorPersonalizadoFondo,
    config.colorPersonalizadoTexto
  );

  const bordeColor =
    config.color === 'personalizado'
      ? darkenColor(config.colorPersonalizadoFondo, 15)
      : colores.borde;

  const renderIcono = () => {
    const size = config.tamanoTexto + 2;

    switch (config.icono) {
      case 'circulo':
        return (
          <span
            style={{
              display: 'inline-block',
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: '50%',
              background: colores.circulo,
              flexShrink: 0,
            }}
          />
        );
      case 'corazon':
        return <span style={{ fontSize: size }}>❤️</span>;
      case 'alerta':
        return <span style={{ fontSize: size }}>⚠️</span>;
      case 'emoji':
        return (
          <span style={{ fontSize: size }}>{config.emojiCustom || '🔥'}</span>
        );
      case 'imagen':
        return config.imagenUrl ? (
          <img
            src={config.imagenUrl}
            alt=""
            style={{
              width: size,
              height: size,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
        ) : (
          <span style={{ fontSize: size }}>🖼️</span>
        );
      case 'nada':
      default:
        return null;
    }
  };

  const iconoNode = renderIcono();

  const animacionIcono =
    config.efecto === 'zoom' && config.aplicarEfectoA === 'icono'
      ? 'nevuxMaZoom 1.6s ease-in-out infinite'
      : 'none';

  const animacionCompleta =
    config.efecto === 'zoom' && config.aplicarEfectoA === 'completo'
      ? 'nevuxMaZoom 1.6s ease-in-out infinite'
      : 'none';

  const mostrarAureolaIcono =
    config.efecto === 'aureola' && config.aplicarEfectoA === 'icono';
  const mostrarAureolaCompleto =
    config.efecto === 'aureola' && config.aplicarEfectoA === 'completo';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        background: '#fff',
        borderRadius: 12,
        minHeight: 100,
      }}
    >
      <style>{`
        @keyframes nevuxMaZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes nevuxMaAureola {
          0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.35); }
          70% { box-shadow: 0 0 0 12px rgba(0,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
        }
      `}</style>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: colores.fondo,
          color: colores.texto,
          padding: `${config.paddingInterno}px ${config.paddingInterno + 8}px`,
          borderRadius: config.bordesRedondeados,
          border: config.mostrarBorde ? `1px solid ${bordeColor}` : 'none',
          fontSize: config.tamanoTexto,
          fontWeight: config.estiloTexto === 'resaltado' ? 700 : 500,
          lineHeight: 1.3,
          animation: animacionCompleta,
          boxShadow: mostrarAureolaCompleto
            ? '0 0 0 0 rgba(0,0,0,0.35)'
            : 'none',
          ...(mostrarAureolaCompleto && {
            animation: 'nevuxMaAureola 1.8s ease-out infinite',
          }),
        }}
      >
        {iconoNode && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: animacionIcono,
              borderRadius: '50%',
              ...(mostrarAureolaIcono && {
                animation: 'nevuxMaAureola 1.8s ease-out infinite',
              }),
            }}
          >
            {iconoNode}
          </span>
        )}
        <span>{config.mensaje || '¡Apurate, quedan pocos en stock!'}</span>
      </div>
    </div>
  );
  }
