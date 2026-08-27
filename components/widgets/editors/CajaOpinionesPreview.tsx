'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface Opinion {
  nombre: string;
  estrellas: number;
  texto: string;
  foto: string;
  compraVerificada: boolean;
}

interface PreviewProps {
  config: {
    opiniones: Opinion[];
    colorFondo: string;
    colorTexto: string;
    colorEstrellas: string;
    mostrarBorde: boolean;
    colorBorde: string;
    fuenteNombre: number;
    fuenteOpinion: number;
    bordeRedondeado: number;
    padding: number;
    tamanoAvatar: number;
  };
}

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function getInitial(nombre: string): string {
  const n = (nombre || '').trim();
  if (!n) return '?';
  return n.charAt(0).toUpperCase();
}

function getAvatarBg(nombre: string): string {
  const palette = [
    '#ecfdf5', // verde esmeralda suave
    '#f0fdf4', // verde claro
    '#eff6ff', // azul suave
    '#fef3c7', // ámbar suave
    '#f3f4f6', // gris suave
  ];
  const n = (nombre || '').trim();
  if (!n) return '#f3f4f6';
  let sum = 0;
  for (let i = 0; i < n.length; i++) sum += n.charCodeAt(i);
  return palette[sum % palette.length];
}

function getAvatarTextColor(nombre: string): string {
  const palette = [
    '#059669', // verde oscuro
    '#166534', // verde bosque
    '#1d4ed8', // azul
    '#b45309', // ámbar
    '#374151', // gris
  ];
  const n = (nombre || '').trim();
  if (!n) return '#374151';
  let sum = 0;
  for (let i = 0; i < n.length; i++) sum += n.charCodeAt(i);
  return palette[sum % palette.length];
}

function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#10B981"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 2l2.09 2.26L17 4l.74 2.91L20 8l-1.26 2.5L20 13l-2.26 1.09L17 17l-2.91-.74L12 18l-2.5-1.26L7 17l-.74-2.91L4 13l1.26-2.5L4 8l2.26-1.09L7 4l2.91.74L12 2z" />
      <path
        d="M9 12l2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   AVATAR
═══════════════════════════════════════════ */
function Avatar({
  nombre,
  foto,
  size,
}: {
  nombre: string;
  foto: string;
  size: number;
}) {
  if (foto) {
    return (
      <img
        src={foto}
        alt={nombre || 'Avatar'}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          display: 'block',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      />
    );
  }

  const bg = getAvatarBg(nombre);
  const color = getAvatarTextColor(nombre);
  const initial = getInitial(nombre);
  const fontSize = Math.round(size * 0.42);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize,
        fontWeight: 800,
        flexShrink: 0,
        userSelect: 'none',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {initial}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STARS
═══════════════════════════════════════════ */
function Stars({
  count,
  color,
  size = 16,
}: {
  count: number;
  color: string;
  size?: number;
}) {
  const stars = [];
  const starColor = color || '#F59E0B'; // dorado/ámbar por defecto

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= count ? starColor : '#E5E7EB',
          fontSize: size,
          lineHeight: 1,
        }}
      >
        ★
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {stars}
    </span>
  );
}

/* ═══════════════════════════════════════════
   OPINIONS CARD
═══════════════════════════════════════════ */
function OpinionCard({
  opinion,
  config,
}: {
  opinion: Opinion;
  config: PreviewProps['config'];
}) {
  const nombre = opinion.nombre?.trim() || 'Cliente';
  const texto = opinion.texto?.trim() || '';
  const starSize = Math.max(14, Math.round(config.fuenteNombre * 0.95));

  return (
    <div
      style={{
        background: config.colorFondo || '#FFFFFF',
        color: config.colorTexto || '#000000',
        borderRadius: config.bordeRedondeado || 14,
        padding: config.padding || 16,
        border: config.mostrarBorde ? `1px solid ${config.colorBorde}` : '1px solid rgba(0,0,0,0.06)',
        boxSizing: 'border-box',
        width: '100%',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        transition: 'transform 0.2s ease',
      }}
    >
      {/* FILA SUPERIOR: avatar + nombre + estrellas */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: texto ? 10 : 0,
        }}
      >
        <Avatar nombre={nombre} foto={opinion.foto} size={config.tamanoAvatar || 40} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: config.fuenteNombre || 14,
              fontWeight: 800,
              color: config.colorTexto || '#000000',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}
          >
            {nombre}
          </span>

          <Stars
            count={opinion.estrellas}
            color={config.colorEstrellas}
            size={starSize}
          />

          {opinion.compraVerificada && <VerifiedBadge size={16} />}
        </div>
      </div>

      {/* TEXTO DE LA OPINIÓN */}
      {texto && (
        <div
          style={{
            fontSize: config.fuenteOpinion || 13,
            color: config.colorTexto || '#000000',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontWeight: 500,
            opacity: 0.9,
          }}
        >
          "{texto}"
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW
═══════════════════════════════════════════ */
export default function CajaOpinionesPreview({ config }: PreviewProps) {
  const opiniones = Array.isArray(config.opiniones) ? config.opiniones : [];

  if (opiniones.length === 0) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px dashed #E5E7EB',
          borderRadius: 14,
          padding: 24,
          textAlign: 'center',
          color: '#6B7280',
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Agregá al menos una opinión para ver la vista previa.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
      }}
    >
      {opiniones.map((op, i) => (
        <OpinionCard key={i} opinion={op} config={config} />
      ))}
    </div>
  );
    }
