'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface PreviewProps {
  config: {
    diasHastaEnvio: number;
    diasParaEntrega: number;
    horaCorte: string;
    mostrarHoraLimite: boolean;
    mostrarRangoEntrega: boolean;
    mostrarFechasAprox: boolean;
    noDespacharSabados: boolean;
    tipoIconos: 'emojis' | 'svg';
    colorFondo: string;
    colorTexto: string;
    colorBadgeFondo: string;
    colorBadgeTexto: string;
    activarBorde: boolean;
    tamanoLabel: number;
    tamanoDia: number;
    bordesRedondeados: number;
    paddingInterno: number;
  };
}

/* ═══════════════════════════════════════════
   ICONOS SVG
═══════════════════════════════════════════ */
function IconBoxSvg({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconTruckSvg({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconCheckSvg({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   COLUMN
═══════════════════════════════════════════ */
function Column({
  icon,
  label,
  value,
  badge,
  labelSize,
  dayarSize,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: React.ReactNode;
  labelSize: number;
  dayarSize: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 6,
        flex: 1,
        minWidth: 0,
        textAlign: 'center',
        zIndex: 2,
      }}
    >
      <div
        style={{
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: labelSize,
          fontWeight: 800,
          color: color,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: dayarSize,
          color: color,
          opacity: 0.85,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {badge}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEPARATOR CON ANIMACIÓN
═══════════════════════════════════════════ */
function Separator({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 28,
        height: 2,
        background: color,
        opacity: 0.3,
        borderRadius: 2,
        flexShrink: 0,
        alignSelf: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: color,
          opacity: 0.9,
          animation: 'nvxTrailPulse 2s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW
═══════════════════════════════════════════ */
export default function InformacionEnvioPreview({ config }: PreviewProps) {
  const useEmojis = config.tipoIconos !== 'svg';

  const valueCompra = 'Hoy';
  const valueEnvio = 'Mañana';
  const valueEntrega = config.mostrarRangoEntrega ? '12 y 13 ago' : '12 ago';

  const border = config.activarBorde
    ? `1px solid ${config.colorTexto || '#000000'}22`
    : '1px solid rgba(0,0,0,0.06)';

  const horaCorteTexto = (config.horaCorte || '18:00').replace(/\s/g, '');
  const badgeCompra = config.mostrarHoraLimite ? (
    <div
      style={{
        marginTop: 4,
        display: 'inline-block',
        background: config.colorBadgeFondo || '#10B981',
        color: config.colorBadgeTexto || '#ffffff',
        fontSize: Math.max(9, (config.tamanoDia || 13) - 3),
        fontWeight: 800,
        padding: '3px 8px',
        borderRadius: 6,
        letterSpacing: '0.04em',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
      }}
    >
      ANTES DE LAS {horaCorteTexto}
    </div>
  ) : null;

  const iconoCompra = useEmojis ? (
    <span style={{ fontSize: 22, lineHeight: 1 }}>📦</span>
  ) : (
    <IconBoxSvg size={22} color={config.colorTexto || '#000000'} />
  );
  const iconoEnvio = useEmojis ? (
    <span style={{ fontSize: 22, lineHeight: 1 }}>🚚</span>
  ) : (
    <IconTruckSvg size={22} color={config.colorTexto || '#000000'} />
  );
  const iconoEntrega = useEmojis ? (
    <span style={{ fontSize: 22, lineHeight: 1 }}>📍</span>
  ) : (
    <IconCheckSvg size={22} color={config.colorTexto || '#000000'} />
  );

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes nvxTrailPulse {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>

      <div
        style={{
          background: config.colorFondo || '#ffffff',
          color: config.colorTexto || '#000000',
          borderRadius: config.bordesRedondeados || 16,
          padding: config.paddingInterno || 16,
          border: border,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 6,
          width: '100%',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
      >
        <Column
          icon={iconoCompra}
          label="Compra"
          value={valueCompra}
          badge={badgeCompra}
          labelSize={config.tamanoLabel || 14}
          dayarSize={config.tamanoDia || 13}
          color={config.colorTexto || '#000000'}
        />
        <Separator color={config.colorTexto || '#10B981'} />
        <Column
          icon={iconoEnvio}
          label="Envío"
          value={valueEnvio}
          labelSize={config.tamanoLabel || 14}
          dayarSize={config.tamanoDia || 13}
          color={config.colorTexto || '#000000'}
        />
        <Separator color={config.colorTexto || '#10B981'} />
        <Column
          icon={iconoEntrega}
          label="Entrega"
          value={valueEntrega}
          labelSize={config.tamanoLabel || 14}
          dayarSize={config.tamanoDia || 13}
          color={config.colorTexto || '#000000'}
        />
      </div>

      {config.mostrarFechasAprox && (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: '#6b7280',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          * Fechas aproximadas estimadas por el sistema
        </div>
      )}
    </div>
  );
}
