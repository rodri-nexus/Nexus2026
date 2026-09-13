'use client';

import React, { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════
   PRESETS DE FECHAS ESPECIALES LOCALES (Regla #9)
═══════════════════════════════════════════ */
const PREVIEW_CAMPAIGN_THEMES: Record<
  string,
  {
    name: string;
    tipoFondo: 'solido' | 'degradado';
    colorFondo: string;
    colorFondoInicio: string;
    colorFondoFin: string;
    colorTexto: string;
  }
> = {
  none: {
    name: 'Diseño Normal / Sin Evento',
    tipoFondo: 'solido',
    colorFondo: '#333333',
    colorFondoInicio: '#333333',
    colorFondoFin: '#555555',
    colorTexto: '#ffffff',
  },
  'black-friday': {
    name: '🔥 Black Friday',
    tipoFondo: 'degradado',
    colorFondo: '#111827',
    colorFondoInicio: '#111827',
    colorFondoFin: '#030712',
    colorTexto: '#F59E0B',
  },
  'hot-sale': {
    name: '⚡ Hot Sale',
    tipoFondo: 'degradado',
    colorFondo: '#0F172A',
    colorFondoInicio: '#0F172A',
    colorFondoFin: '#1E293B',
    colorTexto: '#EF4444',
  },
  'cyber-monday': {
    name: '🚀 Cyber Monday',
    tipoFondo: 'degradado',
    colorFondo: '#090D16',
    colorFondoInicio: '#090D16',
    colorFondoFin: '#1E293B',
    colorTexto: '#3B82F6',
  },
  navidad: {
    name: '🎄 Navidad & Reyes',
    tipoFondo: 'degradado',
    colorFondo: '#064E3B',
    colorFondoInicio: '#064E3B',
    colorFondoFin: '#022C22',
    colorTexto: '#FCD34D',
  },
  'san-valentin': {
    name: '💘 San Valentín',
    tipoFondo: 'degradado',
    colorFondo: '#831843',
    colorFondoInicio: '#831843',
    colorFondoFin: '#500724',
    colorTexto: '#F43F5E',
  },
  'dia-madre-padre': {
    name: '🎁 Día de la Madre / Padre',
    tipoFondo: 'degradado',
    colorFondo: '#312E81',
    colorFondoInicio: '#312E81',
    colorFondoFin: '#1E1B4B',
    colorTexto: '#10B981',
  },
  'sale-liquidacion': {
    name: '🏷️ Liquidación / Sale',
    tipoFondo: 'degradado',
    colorFondo: '#7F1D1D',
    colorFondoInicio: '#7F1D1D',
    colorFondoFin: '#450A0A',
    colorTexto: '#FBBF24',
  },
};

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface BannerDeslizantePreviewProps {
  config: {
    mensajes?: string[];
    tipoFondo?: 'solido' | 'degradado';
    colorFondo?: string;
    colorFondoInicio?: string;
    colorFondoFin?: string;
    colorTexto?: string;
    tamanoFuente?: number;
    bordeRadio?: number;
    separacionMensajes?: number;
    velocidad?: number;
    modoBarra?: boolean;
    campaignTheme?: string;
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BannerDeslizantePreview({ config }: BannerDeslizantePreviewProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const mensajes =
    config.mensajes && config.mensajes.length > 0
      ? config.mensajes.filter((m) => m && m.trim().length > 0)
      : ['🎉 ¡Envío gratis en compras mayores a $25.000!'];

  // Fechas especiales
  const themeKey = config.campaignTheme || 'none';
  const theme = PREVIEW_CAMPAIGN_THEMES[themeKey] || PREVIEW_CAMPAIGN_THEMES.none;
  const isCustomTheme = themeKey !== 'none';

  // Sobrecarga de estilos
  const tipoFondo = isCustomTheme ? theme.tipoFondo : (config.tipoFondo ?? 'solido');
  const colorFondo = isCustomTheme ? theme.colorFondo : (config.colorFondo ?? '#333333');
  const colorFondoInicio = isCustomTheme ? theme.colorFondoInicio : (config.colorFondoInicio ?? '#333333');
  const colorFondoFin = isCustomTheme ? theme.colorFondoFin : (config.colorFondoFin ?? '#555555');
  const colorTexto = isCustomTheme ? theme.colorTexto : (config.colorTexto ?? '#ffffff');

  const tamanoFuente = config.tamanoFuente ?? 15;
  const bordeRadio = config.bordeRadio ?? 12;
  const separacionMensajes = config.separacionMensajes ?? 200;
  const velocidad = config.velocidad ?? 20;
  const modoBarra = config.modoBarra ?? false;

  const fondoStyle =
    tipoFondo === 'degradado'
      ? `linear-gradient(135deg, ${colorFondoInicio} 0%, ${colorFondoFin} 100%)`
      : colorFondo;

  // Duplicamos los mensajes para lograr scroll infinito continuo
  const mensajesRender = [...mensajes, ...mensajes, ...mensajes];

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.animation = 'none';
    // Forzar reflow para reiniciar la animación
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    trackRef.current.offsetHeight;
    trackRef.current.style.animation = `nevux-banner-scroll ${velocidad}s linear infinite`;
  }, [velocidad, mensajes.join('|'), separacionMensajes, tamanoFuente]);

  return (
    <div
      style={{
        width: '100%',
        padding: modoBarra ? '0' : '10px 0',
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @keyframes nevux-banner-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }

        .nevux-banner-preview-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
        }

        .nevux-banner-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div
        className="nevux-banner-preview-mask"
        style={{
          width: '100%',
          background: fondoStyle,
          color: colorTexto,
          borderRadius: modoBarra ? '0px' : `${bordeRadio}px`,
          overflow: 'hidden',
          padding: '14px 0',
          fontSize: `${tamanoFuente}px`,
          fontWeight: 600,
          lineHeight: 1.2,
          position: 'relative',
          boxShadow: modoBarra
            ? 'none'
            : '0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          border: modoBarra ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          ref={trackRef}
          className="nevux-banner-track"
          style={{
            display: 'inline-flex',
            whiteSpace: 'nowrap',
            willChange: 'transform',
            alignItems: 'center',
          }}
        >
          {mensajesRender.map((msg, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                paddingRight: `${separacionMensajes}px`,
                fontSize: `${tamanoFuente}px`,
                color: colorTexto,
                letterSpacing: '-0.01em',
              }}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
                                                       }
