// components/widgets/editors/InformacionDespachoPreview.tsx
'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface PreviewProps {
  config: {
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
    posicion: 'encima-form' | 'antes-descripcion';
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
    campaignTheme?: string;
  };
}

/* ═══════════════════════════════════════════
   CAMPANAS PRESETS
═══════════════════════════════════════════ */
const THEMES: Record<string, { themeColor: string; accentColor: string; textColor: string; badgeBg: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', textColor: '#ffffff', badgeBg: '#F59E0B' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', textColor: '#ffffff', badgeBg: '#EF4444' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', textColor: '#ffffff', badgeBg: '#3B82F6' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', textColor: '#ffffff', badgeBg: '#EF4444' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', textColor: '#ffffff', badgeBg: '#F43F5E' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', textColor: '#ffffff', badgeBg: '#10B981' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', textColor: '#ffffff', badgeBg: '#FBBF24' },
};

/* ═══════════════════════════════════════════
   ICONOS
═══════════════════════════════════════════ */
function IconoCirculo({ size = 14, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
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

function renderIcono(tipo: string, size: number, colorCirculo: string) {
  switch (tipo) {
    case 'circulo':
      return <IconoCirculo size={size} color={colorCirculo} />;
    case 'corazon':
      return <IconoCorazon size={size + 2} />;
    case 'alerta':
      return <IconoAlerta size={size + 2} />;
    case 'emoji':
      return <span style={{ fontSize: size + 4, lineHeight: 1 }}>📦</span>;
    case 'nada':
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════
   PREVIEW
═══════════════════════════════════════════ */
export default function InformacionDespachoPreview({ config }: PreviewProps) {
  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const fontWeight = config.estiloTexto === 'negrita' ? 800 : 600;
  const fontSize = config.tamanoFuente || 14;

  const colorFondo = activeTheme ? activeTheme.themeColor : config.colorFondo || '#10B981';
  const colorTexto = activeTheme ? activeTheme.textColor : config.colorTexto || '#ffffff';

  const background = config.fondoDegradado
    ? `linear-gradient(135deg, ${colorFondo} 0%, ${colorFondo}dd 100%)`
    : colorFondo;

  const border = (config.activarBorde || activeTheme)
    ? `1.5px solid ${activeTheme ? activeTheme.accentColor : (config.colorTexto || '#000000') + '22'}`
    : '1px solid rgba(0,0,0,0.06)';

  const badgeBg = activeTheme
    ? activeTheme.badgeBg
    : config.colorBadge && config.colorBadge.trim() !== ''
    ? config.colorBadge
    : 'rgba(0,0,0,0.18)';

  const colorTextoBadge = activeTheme
    ? (currentCampaign === 'black-friday' || currentCampaign === 'liquidacion' ? '#000000' : '#ffffff')
    : config.colorTextoBadge || '#ffffff';

  const efectoIcono =
    config.efecto === 'aureola'
      ? 'nvx-despacho-aureola 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      : config.efecto === 'zoom'
      ? 'nvx-despacho-zoom 2.5s ease-in-out infinite'
      : 'none';

  const aplicarASoloIcono = config.aplicarEfectoA === 'solo-icono';
  const animacionCard = !aplicarASoloIcono ? efectoIcono : 'none';
  const animacionIcono = aplicarASoloIcono ? efectoIcono : 'none';

  const iconoSize = fontSize + 2;
  const colorCirculo = activeTheme ? activeTheme.accentColor : '#10B981';
  const iconoNode = renderIcono(config.icono, iconoSize, colorCirculo);

  return (
    <>
      <style>{`
        @keyframes nvx-despacho-aureola {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        @keyframes nvx-despacho-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: background,
          color: colorTexto,
          borderRadius: config.bordesRedondeados || 14,
          padding: `${(config.paddingInterno || 10) + 4}px ${(config.paddingInterno || 10) + 8}px`,
          border: border,
          animation: animacionCard,
          boxSizing: 'border-box',
          width: '100%',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
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
              gap: 4,
              minWidth: 0,
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: fontSize,
                fontWeight: fontWeight,
                lineHeight: 1.25,
                color: colorTexto,
                letterSpacing: '-0.01em',
              }}
            >
              Comprando ahora tu pedido se despacha
            </span>

            <span
              style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                background: badgeBg,
                color: colorTextoBadge,
                fontSize: Math.max(10, fontSize - 4),
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: 6,
                letterSpacing: '0.04em',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
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
            color: colorTextoBadge,
            padding: '8px 12px',
            borderRadius: 10,
            flexShrink: 0,
            minWidth: 80,
            lineHeight: 1.15,
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          <span
            style={{
              fontSize: Math.max(9, fontSize - 5),
              opacity: 0.9,
              fontWeight: 600,
            }}
          >
            Te quedan
          </span>
          <span
            style={{
              fontSize: Math.max(13, fontSize),
              fontWeight: 900,
            }}
          >
            2h 30m
          </span>
        </div>
      </div>
    </>
  );
     }
