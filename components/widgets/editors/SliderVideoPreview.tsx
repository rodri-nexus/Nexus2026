'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface VideoItem {
  url?: string;
  path?: string;
  nombre?: string;
  tamanoBytes?: number;
  productoId?: number | null;
  productoData?: {
    id: number;
    name: string;
    price: number;
    image?: string;
  } | null;
}

interface SliderVideoPreviewProps {
  config: any;
}

/* ═══════════════════════════════════════════
   HELPERS & PARSER
═══════════════════════════════════════════ */
function parseMarkdownLigero(texto: string): string {
  if (!texto) return '';
  let html = texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');
  html = html.replace(/\n/g, '<br />');

  return html;
}

function formatPrecio(precio: number): string {
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio);
  } catch {
    return `$${precio}`;
  }
}

/* ═══════════════════════════════════════════
   ÍCONOS SVG
═══════════════════════════════════════════ */
function IconPlay({ size = 48, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <path d="M10 8L16 12L10 16V8Z" fill={color} />
    </svg>
  );
}

function IconArrow({
  direction,
  color,
}: {
  direction: 'left' | 'right';
  color: string;
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: direction === 'left' ? 'rotate(180deg)' : 'none',
      }}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCart({ color = '#ffffff' }: { color?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.07 15.93 4.52 17 5.4 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   CARD DE PRODUCTO VINCULADO
═══════════════════════════════════════════ */
function ProductoCard({
  producto,
  config,
}: {
  producto: NonNullable<VideoItem['productoData']>;
  config: any;
}) {
  const {
    mostrarPrecio = true,
    mostrarBotonCarrito = true,
    colorBotonFondo = '#10B981',
    colorBotonTexto = '#ffffff',
    radioBordeBoton = 10,
  } = config;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.08)',
        marginTop: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
      }}
    >
      {producto.image ? (
        <img
          src={producto.image}
          alt={producto.name}
          style={{
            width: 42,
            height: 42,
            borderRadius: 8,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 8,
            background: '#f3f4f6',
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: '#000000',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {producto.name}
        </div>
        {mostrarPrecio && (
          <div
            style={{
              fontSize: 12,
              color: '#059669',
              fontWeight: 800,
              marginTop: 1,
            }}
          >
            {formatPrecio(producto.price)}
          </div>
        )}
      </div>

      {mostrarBotonCarrito && (
        <button
          type="button"
          style={{
            background: colorBotonFondo || '#10B981',
            color: colorBotonTexto,
            border: 'none',
            padding: '7px 11px',
            borderRadius: radioBordeBoton,
            fontSize: 11,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
          }}
        >
          <IconCart color={colorBotonTexto} />
          Agregar
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CARD DE VIDEO (SLIDER CINEMÁTICO)
═══════════════════════════════════════════ */
function VideoCardSlider({
  video,
  config,
}: {
  video: VideoItem;
  config: any;
}) {
  const {
    radioBordeVideos = 18,
    productosBajoVideo = false,
  } = config;

  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 165,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9 / 16',
          borderRadius: radioBordeVideos,
          overflow: 'hidden',
          background: '#05070B',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {video.url ? (
          <video
            src={video.url}
            preload="metadata"
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(135deg, #05070B 0%, #10B981 100%)',
            }}
          />
        )}

        {/* Overlay Play Glassmorphism */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}
          >
            <IconPlay size={22} color="#ffffff" />
          </div>
        </div>
      </div>

      {productosBajoVideo && video.productoData && (
        <ProductoCard producto={video.productoData} config={config} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CARD DE VIDEO (CÍRCULOS STORIES)
═══════════════════════════════════════════ */
function VideoCardCirculo({
  video,
  colorControles,
}: {
  video: VideoItem;
  colorControles: string;
}) {
  const activeColor = colorControles || '#10B981';

  return (
    <div
      style={{
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        style={{
          padding: 3,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${activeColor} 0%, #059669 100%)`,
          boxShadow: `0 4px 12px ${activeColor}44`,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#05070B',
            border: '2.5px solid #ffffff',
            position: 'relative',
          }}
        >
          {video.url ? (
            <video
              src={video.url}
              preload="metadata"
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(135deg, #05070B 0%, #10B981 100%)',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.25)',
            }}
          >
            <IconPlay size={20} color="#ffffff" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function SliderVideoPreview({ config }: SliderVideoPreviewProps) {
  const {
    titulo = '',
    subtitulo = '',
    videos = [],
    posicion = 'despues',
    formato = 'slider',
    colorControles = '#10B981',
    colorTitulo = '#000000',
    colorFondo = '#ffffff',
    tamanoTitulo = '20px',
    tamanoSubtitulo = '15px',
    alineacion = 'centrado',
  } = config || {};

  const videosArr: VideoItem[] = Array.isArray(videos) ? videos : [];
  const hayVideos = videosArr.length > 0;

  const textAlign =
    alineacion === 'izquierda'
      ? 'left'
      : alineacion === 'derecha'
      ? 'right'
      : 'center';

  const fondoAplicado = posicion === 'despues' ? colorFondo : 'transparent';

  if (!hayVideos) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px dashed #e5e7eb',
          borderRadius: 16,
          padding: '48px 20px',
          textAlign: 'center',
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconPlay size={32} color="#10B981" />
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#000000',
          }}
        >
          Subí videos para ver la vista previa en vivo
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: fondoAplicado,
        padding: posicion === 'despues' ? '20px 16px' : '12px 0',
        borderRadius: posicion === 'despues' ? 16 : 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Título */}
      {titulo && (
        <div
          style={{
            fontSize: tamanoTitulo,
            fontWeight: 800,
            color: colorTitulo,
            textAlign,
            marginBottom: subtitulo ? 4 : 14,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          {titulo}
        </div>
      )}

      {/* Subtítulo */}
      {subtitulo && (
        <div
          style={{
            fontSize: tamanoSubtitulo,
            color: colorTitulo,
            opacity: 0.75,
            textAlign,
            marginBottom: 16,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
          dangerouslySetInnerHTML={{ __html: parseMarkdownLigero(subtitulo) }}
        />
      )}

      {/* Formato Slider */}
      {formato === 'slider' && (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              paddingBottom: 8,
              scrollbarWidth: 'none',
            }}
          >
            {videosArr.map((video, i) => (
              <VideoCardSlider key={i} video={video} config={config} />
            ))}
          </div>

          {/* Flechas decorativas de navegación */}
          {videosArr.length > 1 && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  border: '1px solid rgba(0,0,0,0.06)',
                  zIndex: 10,
                }}
              >
                <IconArrow direction="left" color={colorControles || '#10B981'} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  border: '1px solid rgba(0,0,0,0.06)',
                  zIndex: 10,
                }}
              >
                <IconArrow direction="right" color={colorControles || '#10B981'} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Formato Círculos */}
      {formato === 'circulos' && (
        <div
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 6,
            justifyContent: videosArr.length <= 3 ? 'center' : 'flex-start',
            scrollbarWidth: 'none',
          }}
        >
          {videosArr.map((video, i) => (
            <VideoCardCirculo
              key={i}
              video={video}
              colorControles={colorControles}
            />
          ))}
        </div>
      )}
    </div>
  );
      }
