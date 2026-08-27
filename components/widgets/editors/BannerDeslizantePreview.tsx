'use client';

import { useEffect, useRef } from 'react';

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

  const tipoFondo = config.tipoFondo ?? 'solido';
  const colorFondo = config.colorFondo ?? '#05070B';
  const colorFondoInicio = config.colorFondoInicio ?? '#05070B';
  const colorFondoFin = config.colorFondoFin ?? '#10B981';
  const colorTexto = config.colorTexto ?? '#ffffff';
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
    // Forzar reflow para reiniciar la animación cuando cambian valores
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
