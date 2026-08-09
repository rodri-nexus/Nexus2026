'use client';

import { useEffect, useRef } from 'react';

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

export default function BannerDeslizantePreview({ config }: BannerDeslizantePreviewProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const mensajes =
    config.mensajes && config.mensajes.length > 0
      ? config.mensajes.filter((m) => m && m.trim().length > 0)
      : ['🎉 ¡Envío gratis en compras nuevas a $25000!'];

  const tipoFondo = config.tipoFondo ?? 'solido';
  const colorFondo = config.colorFondo ?? '#333333';
  const colorFondoInicio = config.colorFondoInicio ?? '#333333';
  const colorFondoFin = config.colorFondoFin ?? '#555555';
  const colorTexto = config.colorTexto ?? '#ffffff';
  const tamanoFuente = config.tamanoFuente ?? 16;
  const bordeRadio = config.bordeRadio ?? 8;
  const separacionMensajes = config.separacionMensajes ?? 300;
  const velocidad = config.velocidad ?? 20;
  const modoBarra = config.modoBarra ?? false;

  const fondoStyle =
    tipoFondo === 'degradado'
      ? `linear-gradient(90deg, ${colorFondoInicio}, ${colorFondoFin})`
      : colorFondo;

  // Duplicamos los mensajes para lograr scroll infinito continuo
  const mensajesRender = [...mensajes, ...mensajes];

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
        padding: modoBarra ? '0' : '0',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes nevux-banner-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .nevux-banner-preview-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);
        }
      `}</style>

      <div
        className="nevux-banner-preview-mask"
        style={{
          width: '100%',
          background: fondoStyle,
          color: colorTexto,
          borderRadius: modoBarra ? 0 : `${bordeRadio}px`,
          overflow: 'hidden',
          padding: '14px 0',
          fontSize: `${tamanoFuente}px`,
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'inline-flex',
            whiteSpace: 'nowrap',
            willChange: 'transform',
          }}
        >
          {mensajesRender.map((msg, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                paddingRight: `${separacionMensajes}px`,
                fontSize: `${tamanoFuente}px`,
                color: colorTexto,
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
