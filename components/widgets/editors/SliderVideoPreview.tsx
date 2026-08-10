'use client';

import React from 'react';

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

// ═══════════════════════════════════════════════════════════
// Parser markdown ligero (bold, italic, underline)
// ═══════════════════════════════════════════════════════════
function parseMarkdownLigero(texto: string): string {
  if (!texto) return '';
  let html = texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // *italic*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // __underline__
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');
  // saltos de línea
  html = html.replace(/\n/g, '<br />');

  return html;
}

// ═══════════════════════════════════════════════════════════
// Formato de precio
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// Ícono Play
// ═══════════════════════════════════════════════════════════
function IconPlay({ size = 48, color = '#9ca3af' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M10 8L16 12L10 16V8Z" fill={color} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// Ícono Flecha
// ═══════════════════════════════════════════════════════════
function IconArrow({
  direction,
  color,
}: {
  direction: 'left' | 'right';
  color: string;
}) {
  return (
    <svg
      width="20"
      height="20"
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
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// Ícono Carrito
// ═══════════════════════════════════════════════════════════
function IconCart({ color = '#ffffff' }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.07 15.93 4.52 17 5.4 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// Card de producto asociado (bajo el video)
// ═══════════════════════════════════════════════════════════
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
    colorBotonFondo = '#000000',
    colorBotonTexto = '#ffffff',
    radioBordeBoton = 8,
  } = config;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px',
        background: '#ffffff',
        borderRadius: 10,
        border: '1px solid #eeeeee',
        marginTop: 10,
      }}
    >
      {producto.image ? (
        <img
          src={producto.image}
          alt={producto.name}
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            background: '#f3f4f6',
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#111827',
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
              fontSize: 13,
              color: '#6b7280',
              marginTop: 2,
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
            background: colorBotonFondo,
            color: colorBotonTexto,
            border: 'none',
            padding: '8px 12px',
            borderRadius: radioBordeBoton,
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <IconCart color={colorBotonTexto} />
          Agregar
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Card de video (formato Slider)
// ═══════════════════════════════════════════════════════════
function VideoCardSlider({
  video,
  config,
}: {
  video: VideoItem;
  config: any;
}) {
  const {
    radioBordeVideos = 20,
    productosBajoVideo = false,
  } = config;

  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 160,
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
          background: '#111827',
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
                'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
            }}
          />
        )}

        {/* Overlay Play */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconPlay size={22} color="#111827" />
          </div>
        </div>
      </div>

      {productosBajoVideo && video.productoData && (
        <ProductoCard producto={video.productoData} config={config} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Card de video (formato Círculos)
// ═══════════════════════════════════════════════════════════
function VideoCardCirculo({
  video,
  colorControles,
}: {
  video: VideoItem;
  colorControles: string;
}) {
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
          background: `linear-gradient(135deg, ${colorControles} 0%, ${colorControles}80 100%)`,
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#111827',
            border: '3px solid #ffffff',
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
                  'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
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
              background: 'rgba(0,0,0,0.15)',
            }}
          >
            <IconPlay size={20} color="#ffffff" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════
export default function SliderVideoPreview({ config }: SliderVideoPreviewProps) {
  const {
    titulo = '',
    subtitulo = '',
    videos = [],
    posicion = 'despues',
    formato = 'slider',
    colorControles = '#000000',
    colorTitulo = '#333333',
    colorFondo = '#fafafa',
    tamanoTitulo = '20px',
    tamanoSubtitulo = '16px',
    alineacion = 'centrado',
  } = config || {};

  const videosArr: VideoItem[] = Array.isArray(videos) ? videos : [];
  const hayVideos = videosArr.length > 0;

  // Alineación
  const textAlign =
    alineacion === 'izquierda'
      ? 'left'
      : alineacion === 'derecha'
      ? 'right'
      : 'center';

  // Fondo solo si "después de la descripción"
  const fondoAplicado = posicion === 'despues' ? colorFondo : 'transparent';

  // ─── Estado vacío ───
  if (!hayVideos) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px dashed #d1d5db',
          borderRadius: 12,
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
        <IconPlay size={56} color="#9ca3af" />
        <div
          style={{
            fontSize: 15,
            color: '#6b7280',
          }}
        >
          Sube videos para ver la vista previa
        </div>
      </div>
    );
  }

  // ─── Con videos ───
  return (
    <div
      style={{
        background: fondoAplicado,
        padding: posicion === 'despues' ? '20px 16px' : '12px 0',
        borderRadius: posicion === 'despues' ? 12 : 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Título */}
      {titulo && (
        <div
          style={{
            fontSize: tamanoTitulo,
            fontWeight: 700,
            color: colorTitulo,
            textAlign,
            marginBottom: subtitulo ? 4 : 14,
            lineHeight: 1.2,
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
          }}
          dangerouslySetInnerHTML={{ __html: parseMarkdownLigero(subtitulo) }}
        />
      )}

      {/* Formato Slider */}
      {formato === 'slider' && (
        <div
          style={{
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
            }}
          >
            {videosArr.map((video, i) => (
              <VideoCardSlider key={i} video={video} config={config} />
            ))}
          </div>

          {/* Flechas decorativas (si hay más de 1 video) */}
          {videosArr.length > 1 && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: -6,
                  top: '40%',
                  transform: 'translateY(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <IconArrow direction="left" color={colorControles} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: -6,
                  top: '40%',
                  transform: 'translateY(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <IconArrow direction="right" color={colorControles} />
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
            gap: 14,
            overflowX: 'auto',
            paddingBottom: 4,
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
