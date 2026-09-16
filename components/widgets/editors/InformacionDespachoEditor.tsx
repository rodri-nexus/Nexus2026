// components/widgets/editors/InformacionDespachoEditor.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface InformacionDespachoConfig {
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
  campaignTheme: string;
}

interface EditorProps {
  widgetDefinition: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string;
  };
  existingWidget: {
    id: string;
    config: any;
    is_active: boolean;
    target_type: string;
    target_product_id: number | null;
  } | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO Y PRESETS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: InformacionDespachoConfig = {
  horaCorte: '18:00',
  diasDespacho: {
    lun: true,
    mar: true,
    mie: true,
    jue: true,
    vie: true,
    sab: true,
    dom: false,
  },
  ocultarSiPasoCorte: false,
  agregarBadge: false,
  posicion: 'encima-form',
  icono: 'circulo',
  efecto: 'zoom',
  aplicarEfectoA: 'solo-icono',
  tamanoFuente: 15,
  estiloTexto: 'negrita',
  colorFondo: '#10B981',
  fondoDegradado: false,
  colorTexto: '#ffffff',
  colorBadge: 'rgba(0,0,0,0.18)',
  colorTextoBadge: '#ffffff',
  bordesRedondeados: 12,
  paddingInterno: 10,
  activarBorde: false,
  campaignTheme: 'none',
};

const THEMES: Record<string, { themeColor: string; accentColor: string; textColor: string; badgeBg: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', textColor: '#ffffff', badgeBg: '#F59E0B' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', textColor: '#ffffff', badgeBg: '#EF4444' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', textColor: '#ffffff', badgeBg: '#3B82F6' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', textColor: '#ffffff', badgeBg: '#EF4444' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', textColor: '#ffffff', badgeBg: '#F43F5E' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', textColor: '#ffffff', badgeBg: '#10B981' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', textColor: '#ffffff', badgeBg: '#FBBF24' },
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Colores oscuros con acentos dorados.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Diseño deportivo con rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético nocturno y azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino tradicional con acento rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con acento verde esmeralda alegre.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí de urgencia extrema con amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

/* ═══════════════════════════════════════════
   PREVIEW ELEMENTOS E ICONOS (Regla #9 al inicio)
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
   PREVIEW INTEGRADO (antes InformacionDespachoPreview.tsx)
═══════════════════════════════════════════ */
function InformacionDespachoPreview({ config }: { config: InformacionDespachoConfig }) {
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

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES DEL EDITOR (Regla #9)
═══════════════════════════════════════════ */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
    </div>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 8, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        fontSize: 15,
        color: '#000000',
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        fontSize: 15,
        color: '#000000',
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
        appearance: 'none',
        backgroundImage:
          'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'><path fill=\'none\' stroke=\'%23000000\' stroke-width=\'2\' d=\'M1 1l5 5 5-5\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: 40,
        fontFamily: 'inherit',
      }}
    >
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ToggleField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          background: checked ? '#10B981' : '#e5e7eb',
          position: 'relative',
          transition: 'background 0.25s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#FFFFFF',
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            transition: 'left 0.25s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>{label}</span>}
    </label>
  );
}

function ColorPickerField({
  value,
  onChange,
  supportsRgba = false,
}: {
  value: string;
  onChange: (v: string) => void;
  supportsRgba?: boolean;
}) {
  const colorForPicker = value && value.startsWith('#') ? value : '#000000';

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 56,
          height: 44,
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          background: value || '#FFFFFF',
        }}
      >
        <input
          type="color"
          value={colorForPicker}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            padding: 0,
            background: 'transparent',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={supportsRgba ? 'rgba(0,0,0,0.18) o #000000' : '#000000'}
        style={{
          flex: 1,
          padding: '12px 14px',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          fontSize: 15,
          color: '#000000',
          background: '#FFFFFF',
          outline: 'none',
          fontFamily: 'monospace',
        }}
      />
    </div>
  );
}

function RangeSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  marks,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  marks?: number[];
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
      />
      {marks && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#000000',
            opacity: 0.5,
            marginTop: 4,
          }}
        >
          {marks.map((m, i) => (
            <span key={i}>{m}px</span>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckboxCard({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: 16,
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 18,
          height: 18,
          accentColor: '#10B981',
          cursor: 'pointer',
          marginTop: 2,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </label>
  );
}

function DayChip({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        cursor: 'pointer',
        justifyContent: 'flex-start',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 18,
          height: 18,
          accentColor: '#10B981',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 500, color: '#000000' }}>{label}</span>
    </label>
  );
}

function RadioCard({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: 16,
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#10B981' : '#e5e7eb'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {checked && (
          <div
            style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
  );
}

function RadioCardEfecto({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: 14,
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#10B981' : '#e5e7eb'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {checked && (
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#10B981' }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 4, lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
  );
}

function IconoOption({
  selected,
  onClick,
  visual,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  visual: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 8px',
        background: selected ? '#ecfdf5' : '#FFFFFF',
        border: `1px solid ${selected ? '#10B981' : '#e5e7eb'}`,
        borderRadius: 10,
        cursor: 'pointer',
        minHeight: 90,
      }}
    >
      <div
        style={{
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {visual}
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: selected ? '#10B981' : '#000000',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function ToggleButton({
  selected,
  onClick,
  children,
  minHeight = 46,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  minHeight?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 10px',
        background: selected ? '#ecfdf5' : '#FFFFFF',
        border: `1px solid ${selected ? '#10B981' : '#e5e7eb'}`,
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        color: selected ? '#10B981' : '#000000',
        cursor: 'pointer',
        lineHeight: 1.3,
        minHeight: minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function InformacionDespachoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = useMemo(() => {
    const raw = existingWidget?.config || {};
    return {
      ...DEFAULT_CONFIG,
      ...raw,
      diasDespacho: {
        ...DEFAULT_CONFIG.diasDespacho,
        ...(raw.diasDespacho || {}),
      },
    };
  }, [existingWidget]);

  const [config, setConfig] = useState<any>(initialConfig);
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = useState<'general' | 'ubicacion' | 'estilos' | 'fechas'>('general');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConfig = (k: string, v: any) => setConfig((c: any) => ({ ...c, [k]: v }));
  const updateDia = (k: string, v: boolean) =>
    setConfig((c: any) => ({ ...c, diasDespacho: { ...c.diasDespacho, [k]: v } }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: widgetDefinition.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el widget');
      }

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) {
          params.set('product', String(productId));
        }
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
      setSaving(false);
    }
  };

  const scopeLabel = targetType === 'all' ? 'General' : 'Producto';

  /* ─── TAB FECHAS ESPECIALES ─── */
  const tabFechasEspeciales = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 12, lineHeight: 1.5 }}>
          Elegí una campaña activa. Al seleccionarla, se aplicará un diseño optimizado con colores temáticos de alto impacto para este widget.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {CAMPAIGN_PRESETS.map((preset) => {
          const isSelected = (config.campaignTheme || 'none') === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => updateConfig('campaignTheme', preset.id)}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                transition: 'all 0.2s ease',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{preset.emoji}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {preset.label}
                    {isSelected && (
                      <span style={{
                        background: '#ecfdf5', color: '#10B981', fontSize: 11, fontWeight: 800,
                        padding: '2px 8px', borderRadius: 999, border: '1px solid #10B981',
                      }}>
                        ACTIVO
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, lineHeight: 1.4, flex: 1 }}>
                {preset.desc}
              </div>
              {preset.id !== 'none' && (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: preset.themeColor, border: '1px solid #d1d5db' }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: preset.accentColor, border: '1px solid #d1d5db' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            RL
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
        {/* Chip scope */}
        {targetType === 'all' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#10B981',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            <IconStore />
            Todos los productos
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span>
            NEVUX Widget
          </div>
        )}

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* PREVIEW */}
          <div style={{ marginBottom: 14 }}>
            <InformacionDespachoPreview config={config} />
          </div>

          {/* Nota info debajo del preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 13,
              color: '#000000',
              opacity: 0.6,
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            <IconInfo size={16} color="#10B981" />
            <span>
              {config.posicion === 'encima-form'
                ? 'El mensaje aparecerá justo encima del formulario de compra.'
                : 'El mensaje aparecerá debajo del formulario de compra, antes de la descripción del producto.'}
            </span>
          </div>

          {/* TABS */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 20,
            }}
          >
            {[
              { id: 'general', label: 'General' },
              { id: 'ubicacion', label: 'Ubicación' },
              { id: 'estilos', label: 'Estilos' },
              { id: 'fechas', label: '🔥 Fechas Especiales' }
            ].map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id as any)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: active ? '2px solid #10B981' : '2px solid transparent',
                    padding: '14px 10px',
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#10B981' : '#000000',
                    opacity: active ? 1 : 0.6,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* TAB GENERAL */}
          {tab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Hora de corte para despacho hoy</FieldLabel>
                <TextInput
                  type="time"
                  value={config.horaCorte}
                  onChange={(v) => updateConfig('horaCorte', v)}
                />
                <HelpText>
                  Si el visitante llega antes de esta hora, el mensaje indicará que el pedido se despacha{' '}
                  <strong style={{ color: '#000000' }}>hoy</strong>.
                </HelpText>
              </div>

              <div>
                <FieldLabel>Días de despacho</FieldLabel>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                    gap: 10,
                  }}
                >
                  <DayChip
                    checked={config.diasDespacho.lun}
                    onChange={(v) => updateDia('lun', v)}
                    label="Lun"
                  />
                  <DayChip
                    checked={config.diasDespacho.mar}
                    onChange={(v) => updateDia('mar', v)}
                    label="Mar"
                  />
                  <DayChip
                    checked={config.diasDespacho.mie}
                    onChange={(v) => updateDia('mie', v)}
                    label="Mié"
                  />
                  <DayChip
                    checked={config.diasDespacho.jue}
                    onChange={(v) => updateDia('jue', v)}
                    label="Jue"
                  />
                  <DayChip
                    checked={config.diasDespacho.vie}
                    onChange={(v) => updateDia('vie', v)}
                    label="Vie"
                  />
                  <DayChip
                    checked={config.diasDespacho.sab}
                    onChange={(v) => updateDia('sab', v)}
                    label="Sáb"
                  />
                  <DayChip
                    checked={config.diasDespacho.dom}
                    onChange={(v) => updateDia('dom', v)}
                    label="Dom"
                  />
                </div>
                <HelpText>Seleccioná los días en que hacés despachos.</HelpText>
              </div>

              <CheckboxCard
                checked={config.ocultarSiPasoCorte}
                onChange={(v) => updateConfig('ocultarSiPasoCorte', v)}
                title="Ocultar el widget si ya pasó la hora de corte"
                description="Si el visitante llega después de la hora de corte, el widget no se mostrará durante el resto del día."
              />

              <CheckboxCard
                checked={config.agregarBadge}
                onChange={(v) => updateConfig('agregarBadge', v)}
                title="Agregar badge al widget"
                description={'Muestra una etiqueta superpuesta en el widget (ej: "Envío gratis", "Llega para San Valentín", etc.).'}
              />
            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FieldLabel>Posición del widget</FieldLabel>
              <RadioCard
                checked={config.posicion === 'encima-form'}
                onChange={() => updateConfig('posicion', 'encima-form')}
                title="Por encima del formulario de compra"
                description={'El mensaje aparece justo antes del botón "Agregar al carrito" / "Comprar".'}
              />
              <RadioCard
                checked={config.posicion === 'antes-descripcion'}
                onChange={() => updateConfig('posicion', 'antes-descripcion')}
                title="Antes de la descripción"
                description="El mensaje aparece justo debajo del formulario de compra, antes de la descripción del producto."
              />
            </div>
          )}

          {/* TAB ESTILOS */}
          {tab === 'estilos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* ICONO */}
              <div>
                <FieldLabel>Ícono</FieldLabel>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: 10,
                  }}
                >
                  <IconoOption
                    selected={config.icono === 'circulo'}
                    onClick={() => updateConfig('icono', 'circulo')}
                    visual={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    }
                    label="Círculo"
                  />
                  <IconoOption
                    selected={config.icono === 'corazon'}
                    onClick={() => updateConfig('icono', 'corazon')}
                    visual={<span style={{ fontSize: 20 }}>❤️</span>}
                    label="Corazón"
                  />
                  <IconoOption
                    selected={config.icono === 'alerta'}
                    onClick={() => updateConfig('icono', 'alerta')}
                    visual={<span style={{ fontSize: 20 }}>⚠️</span>}
                    label="Alerta"
                  />
                  <IconoOption
                    selected={config.icono === 'emoji'}
                    onClick={() => updateConfig('icono', 'emoji')}
                    visual={<span style={{ fontSize: 20 }}>📦</span>}
                    label="Emoji"
                  />
                  <IconoOption
                    selected={config.icono === 'nada'}
                    onClick={() => updateConfig('icono', 'nada')}
                    visual={<span style={{ fontSize: 18, color: '#000000', opacity: 0.5 }}>—</span>}
                    label="Nada"
                  />
                </div>
              </div>

              {/* EFECTO */}
              <div>
                <FieldLabel>Efecto</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  <RadioCardEfecto
                    checked={config.efecto === 'aureola'}
                    onChange={() => updateConfig('efecto', 'aureola')}
                    title="Aureola pulsante"
                    description="Un halo se expande alrededor del elemento."
                  />
                  <RadioCardEfecto
                    checked={config.efecto === 'zoom'}
                    onChange={() => updateConfig('efecto', 'zoom')}
                    title="Zoom"
                    description="El elemento se agranda y reduce suavemente."
                  />
                  <RadioCardEfecto
                    checked={config.efecto === 'sin-efecto'}
                    onChange={() => updateConfig('efecto', 'sin-efecto')}
                    title="Sin efecto"
                    description="El mensaje se muestra estático, sin animación."
                  />
                </div>
              </div>

              {/* APLICAR EFECTO A */}
              <div>
                <FieldLabel>Aplicar efecto a</FieldLabel>
                <div style={{ display: 'flex', gap: 10 }}>
                  <ToggleButton
                    selected={config.aplicarEfectoA === 'solo-icono'}
                    onClick={() => updateConfig('aplicarEfectoA', 'solo-icono')}
                  >
                    Sólo ícono
                  </ToggleButton>
                  <ToggleButton
                    selected={config.aplicarEfectoA === 'mensaje-completo'}
                    onClick={() => updateConfig('aplicarEfectoA', 'mensaje-completo')}
                  >
                    Mensaje completo
                  </ToggleButton>
                </div>
              </div>

              {/* TAMAÑO + ESTILO TEXTO */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                <div>
                  <FieldLabel>Tamaño de fuente</FieldLabel>
                  <SelectField
                    value={config.tamanoFuente}
                    onChange={(v) => updateConfig('tamanoFuente', Number(v))}
                    options={[12, 13, 14, 15, 16, 18, 20, 22].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
                <div>
                  <FieldLabel>Estilo del texto</FieldLabel>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ToggleButton
                      selected={config.estiloTexto === 'normal'}
                      onClick={() => updateConfig('estiloTexto', 'normal')}
                      minHeight={44}
                    >
                      <span style={{ fontWeight: 400 }}>A</span> Normal
                    </ToggleButton>
                    <ToggleButton
                      selected={config.estiloTexto === 'negrita'}
                      onClick={() => updateConfig('estiloTexto', 'negrita')}
                      minHeight={44}
                    >
                      <span style={{ fontWeight: 800 }}>A</span> Negrita
                    </ToggleButton>
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: '#e5e7eb' }} />

              {/* COLORES (Rule #17) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                <div>
                  <FieldLabel>Color de fondo</FieldLabel>
                  <ColorPickerField
                    value={config.colorFondo}
                    onChange={(v) => updateConfig('colorFondo', v)}
                  />
                  <div style={{ marginTop: 12 }}>
                    <ToggleField
                      checked={config.fondoDegradado}
                      onChange={(v) => updateConfig('fondoDegradado', v)}
                      label="Fondo en degradé"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Color de texto</FieldLabel>
                  <ColorPickerField
                    value={config.colorTexto}
                    onChange={(v) => updateConfig('colorTexto', v)}
                  />
                </div>

                <div>
                  <FieldLabel>
                    Color del badge{' '}
                    <span style={{ color: '#000000', opacity: 0.6, fontWeight: 400 }}>(HOY / contador)</span>
                  </FieldLabel>
                  <ColorPickerField
                    value={config.colorBadge}
                    onChange={(v) => updateConfig('colorBadge', v)}
                    supportsRgba
                  />
                  <HelpText>Soporta rgba. Dejar vacío para oscuro automático.</HelpText>
                </div>

                <div>
                  <FieldLabel>Color de texto del badge</FieldLabel>
                  <ColorPickerField
                    value={config.colorTextoBadge}
                    onChange={(v) => updateConfig('colorTextoBadge', v)}
                  />
                </div>
              </div>

              {/* BORDES + PADDING */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                <div>
                  <FieldLabel>Bordes redondeados</FieldLabel>
                  <RangeSlider
                    value={config.bordesRedondeados}
                    onChange={(v) => updateConfig('bordesRedondeados', v)}
                    min={0}
                    max={50}
                    marks={[0, 12, 50]}
                  />
                </div>
                <div>
                  <FieldLabel>Margen interno (padding)</FieldLabel>
                  <RangeSlider
                    value={config.paddingInterno}
                    onChange={(v) => updateConfig('paddingInterno', v)}
                    min={0}
                    max={30}
                    marks={[0, 10, 30]}
                  />
                </div>
              </div>

              {/* ACTIVAR BORDE */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={config.activarBorde}
                  onChange={(e) => updateConfig('activarBorde', e.target.checked)}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: '#10B981',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
                  Activar borde
                </span>
              </label>
            </div>
          )}

          {/* TAB FECHAS ESPECIALES */}
          {tab === 'fechas' && tabFechasEspeciales}

          {/* FOOTER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid #e5e7eb',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ToggleField checked={isActive} onChange={setIsActive} label="Widget activo" />
              <IconInfo />
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              style={{
                background: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 999,
                padding: '12px 24px',
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Guardando…' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>

      {/* ERROR TOAST */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            right: 20,
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: 14,
            borderRadius: 10,
            fontSize: 14,
            zIndex: 50,
            maxWidth: 500,
            margin: '0 auto',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
   }
