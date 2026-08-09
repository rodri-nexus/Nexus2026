'use client';

import React from 'react';

interface PreviewProps {
  config: {
    // General
    diasHastaEnvio: number;
    diasParaEntrega: number;
    horaCorte: string;
    mostrarHoraLimite: boolean;
    mostrarRangoEntrega: boolean;
    mostrarFechasAprox: boolean;
    noDespacharSabados: boolean;
    tipoIconos: 'emojis' | 'svg';
    // Estilos
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

/* ============ ICONOS SVG ============ */

function IconBoxSvg({ size = 20, color = '#1f6b4e' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconTruckSvg({ size = 20, color = '#1f6b4e' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
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

function IconCheckSvg({ size = 20, color = '#1f6b4e' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ============ COLUMN ============ */

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
      }}
    >
      <div
        style={{
          height: 26,
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
          fontWeight: 700,
          color: color,
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: dayarSize,
          color: color,
          opacity: 0.85,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {badge}
    </div>
  );
}

/* ============ SEPARATOR ============ */

function Separator({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 22,
        height: 2,
        background: color,
        opacity: 0.6,
        borderRadius: 2,
        flexShrink: 0,
        alignSelf: 'center',
      }}
    />
  );
}

/* ============ PREVIEW ============ */

export default function InformacionEnvioPreview({ config }: PreviewProps) {
  const useEmojis = config.tipoIconos !== 'svg';

  // Valores DUMMY fijos (siempre igual mientras editás)
  const valueCompra = 'Hoy';
  const valueEnvio = 'Mañana';
  const valueEntrega = config.mostrarRangoEntrega ? '12 y 13 ago' : '12 ago';

  const border = config.activarBorde ? `1px solid ${config.colorTexto}33` : 'none';

  // Badge dummy "ANTES DE LAS 18:00"
  const horaCorteTexto = (config.horaCorte || '18:00').replace(/\s/g, '');
  const badgeCompra = config.mostrarHoraLimite ? (
    <div
      style={{
        marginTop: 4,
        display: 'inline-block',
        background: config.colorBadgeFondo,
        color: config.colorBadgeTexto,
        fontSize: Math.max(9, config.tamanoDia - 3),
        fontWeight: 700,
        padding: '2px 6px',
        borderRadius: 4,
        letterSpacing: '0.03em',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      ANTES DE LAS {horaCorteTexto}
    </div>
  ) : null;

  // Íconos
  const iconoCompra = useEmojis ? (
    <span style={{ fontSize: 24, lineHeight: 1 }}>📦</span>
  ) : (
    <IconBoxSvg size={24} color={config.colorTexto} />
  );
  const iconoEnvio = useEmojis ? (
    <span style={{ fontSize: 24, lineHeight: 1 }}>🚚</span>
  ) : (
    <IconTruckSvg size={24} color={config.colorTexto} />
  );
  const iconoEntrega = useEmojis ? (
    <span style={{ fontSize: 24, lineHeight: 1 }}>📍</span>
  ) : (
    <IconCheckSvg size={24} color={config.colorTexto} />
  );

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          background: config.colorFondo,
          color: config.colorTexto,
          borderRadius: config.bordesRedondeados,
          padding: config.paddingInterno,
          border: border,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 6,
          width: '100%',
        }}
      >
        <Column
          icon={iconoCompra}
          label="Compra"
          value={valueCompra}
          badge={badgeCompra}
          labelSize={config.tamanoLabel}
          dayarSize={config.tamanoDia}
          color={config.colorTexto}
        />
        <Separator color={config.colorTexto} />
        <Column
          icon={iconoEnvio}
          label="Envío"
          value={valueEnvio}
          labelSize={config.tamanoLabel}
          dayarSize={config.tamanoDia}
          color={config.colorTexto}
        />
        <Separator color={config.colorTexto} />
        <Column
          icon={iconoEntrega}
          label="Entrega"
          value={valueEntrega}
          labelSize={config.tamanoLabel}
          dayarSize={config.tamanoDia}
          color={config.colorTexto}
        />
      </div>

      {/* Nota "Fechas aproximadas" */}
      {config.mostrarFechasAprox && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: '#6b7280',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          * Fechas aproximadas
        </div>
      )}
    </div>
  );
  }
