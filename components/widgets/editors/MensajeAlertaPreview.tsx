'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   HELPERS & COLORES
═══════════════════════════════════════════ */
function getColores(
  color: string,
  personalizadoFondo: string,
  personalizadoTexto: string
): { fondo: string; texto: string; borde: string; circulo: string; shadow: string } {
  switch (color) {
    case 'verde':
      return {
        fondo: '#10B981',
        texto: '#ffffff',
        borde: '#059669',
        circulo: '#ffffff',
        shadow: 'rgba(16, 185, 129, 0.3)',
      };
    case 'rojo':
      return {
        fondo: '#EF4444',
        texto: '#ffffff',
        borde: '#DC2626',
        circulo: '#ffffff',
        shadow: 'rgba(239, 68, 68, 0.3)',
      };
    case 'amarillo':
      return {
        fondo: '#F59E0B',
        texto: '#ffffff',
        borde: '#D97706',
        circulo: '#ffffff',
        shadow: 'rgba(245, 158, 11, 0.3)',
      };
    case 'personalizado':
      return {
        fondo: personalizadoFondo || '#10B981',
        texto: personalizadoTexto || '#ffffff',
        borde: personalizadoFondo || '#059669',
        circulo: personalizadoTexto || '#ffffff',
        shadow: 'rgba(0, 0, 0, 0.15)',
      };
    default:
      return {
        fondo: '#10B981',
        texto: '#ffffff',
        borde: '#059669',
        circulo: '#ffffff',
        shadow: 'rgba(16, 185, 129, 0.3)',
      };
  }
}

function darkenColor(hex: string, percent: number): string {
  try {
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
  } catch {
    return hex;
  }
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MensajeAlertaPreview({ config }: MensajeAlertaPreviewProps) {
  const colores = getColores(
    config.color,
    config.colorPersonalizadoFondo,
    config.colorPersonalizadoTexto
  );

  const bordeColor =
    config.color === 'personalizado'
      ? darkenColor(config.colorPersonalizadoFondo || '#10B981', 15)
      : colores.borde;

  const renderIcono = () => {
    const size = (config.tamanoTexto || 14) + 2;

    switch (config.icono) {
      case 'circulo':
        return (
          <span
            style={{
              display: 'inline-block',
              width: size * 0.65,
              height: size * 0.65,
              borderRadius: '50%',
              background: colores.circulo,
              flexShrink: 0,
              boxShadow: '0 0 6px rgba(255,255,255,0.6)',
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
      ? 'nvxMaZoom 2s ease-in-out infinite'
      : 'none';

  const animacionCompleta =
    config.efecto === 'zoom' && config.aplicarEfectoA === 'completo'
      ? 'nvxMaZoom 2s ease-in-out infinite'
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
        background: '#ffffff',
        borderRadius: 14,
        minHeight: 90,
      }}
    >
      <style>{`
        @keyframes nvxMaZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes nvxMaAureola {
          0%, 100% { box-shadow: 0 0 0 0 ${colores.shadow}; }
          50% { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
        }
      `}</style>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: colores.fondo,
          color: colores.texto,
          padding: `${config.paddingInterno || 10}px ${(config.paddingInterno || 10) + 8}px`,
          borderRadius: config.bordesRedondeados || 12,
          border: config.mostrarBorde ? `1.5px solid ${bordeColor}` : 'none',
          fontSize: config.tamanoTexto || 14,
          fontWeight: config.estiloTexto === 'resaltado' ? 800 : 600,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          animation: animacionCompleta,
          boxShadow: `0 4px 14px ${colores.shadow}`,
          ...(mostrarAureolaCompleto && {
            animation: 'nvxMaAureola 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
                animation: 'nvxMaAureola 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
