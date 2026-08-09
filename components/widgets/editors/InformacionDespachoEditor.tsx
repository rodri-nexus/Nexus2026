'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import InformacionDespachoPreview from './InformacionDespachoPreview';

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

const DEFAULT_CONFIG = {
  // General
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
  // Ubicación
  posicion: 'encima-form' as 'encima-form' | 'antes-descripcion',
  // Estilos
  icono: 'circulo' as 'circulo' | 'corazon' | 'alerta' | 'emoji' | 'nada',
  efecto: 'zoom' as 'aureola' | 'zoom' | 'sin-efecto',
  aplicarEfectoA: 'solo-icono' as 'solo-icono' | 'mensaje-completo',
  tamanoFuente: 15,
  estiloTexto: 'negrita' as 'normal' | 'negrita',
  colorFondo: '#10b981',
  fondoDegradado: false,
  colorTexto: '#ffffff',
  colorBadge: 'rgba(0,0,0,0.18)',
  colorTextoBadge: '#ffffff',
  bordesRedondeados: 12,
  paddingInterno: 10,
  activarBorde: false,
};

/* ================= HELPERS UI ================= */

function NevuxLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4 C 20 4, 8 20, 8 28 A 12 12 0 0 0 32 28 C 32 20, 20 4, 20 4 Z"
          fill="#2563EB"
        />
      </svg>
      <span style={{ fontWeight: 800, fontSize: 22, color: '#111827', letterSpacing: -0.5 }}>
        Nevux
      </span>
    </div>
  );
}

function IconStore({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M4 9v11a1 1 0 001 1h14a1 1 0 001-1V9" />
      <path d="M9 21V13h6v8" />
    </svg>
  );
}

function IconInfo({ size = 14, color = '#2563EB' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconExternal({ size = 14, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
      {children}
    </div>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8, lineHeight: 1.5 }}>
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
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        fontSize: 15,
        color: '#111827',
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
      }}
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
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        fontSize: 15,
        color: '#111827',
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
        appearance: 'none',
        backgroundImage:
          'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'><path fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' d=\'M1 1l5 5 5-5\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: 40,
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
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? '#2563EB' : '#D1D5DB',
          position: 'relative',
          transition: 'background 0.15s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#FFFFFF',
            position: 'absolute',
            top: 2,
            left: checked ? 20 : 2,
            transition: 'left 0.15s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: 15, color: '#111827' }}>{label}</span>}
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
  // Para el input color HTML necesita hex. Si es rgba, mostramos color aproximado
  const colorForPicker = value && value.startsWith('#') ? value : '#000000';

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 56,
          height: 44,
          borderRadius: 10,
          border: '1px solid #E5E7EB',
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
          border: '1px solid #E5E7EB',
          borderRadius: 10,
          fontSize: 15,
          color: '#111827',
          background: '#FFFFFF',
          outline: 'none',
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
        style={{ width: '100%', accentColor: '#2563EB' }}
      />
      {marks && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#6B7280',
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

/* ================= CHECKBOX CARD (para "Ocultar" y "Agregar badge") ================= */

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
        border: '1px solid #E5E7EB',
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
          accentColor: '#2563EB',
          cursor: 'pointer',
          marginTop: 2,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </label>
  );
}

/* ================= CHECKBOX CHIP (para días de la semana) ================= */

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
        border: '1px solid #E5E7EB',
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
          accentColor: '#2563EB',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{label}</span>
    </label>
  );
}

/* ================= RADIO CARD (para Ubicación) ================= */

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
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#2563EB' : '#D1D5DB'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {checked && (
          <div
            style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>
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
  // Mismo look que RadioCard pero más compacto para el tab Estilos
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: 14,
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#2563EB' : '#D1D5DB'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {checked && (
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#2563EB' }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
  );
}

/* ================= ICONO OPTION (grid de íconos en Estilos) ================= */

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
        background: selected ? '#EFF6FF' : '#FFFFFF',
        border: `1px solid ${selected ? '#2563EB' : '#E5E7EB'}`,
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
          color: selected ? '#2563EB' : '#111827',
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* ================= TOGGLE BUTTON (para "Aplicar efecto a" y "Estilo del texto") ================= */

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
        background: selected ? '#EFF6FF' : '#FFFFFF',
        border: `1px solid ${selected ? '#2563EB' : '#E5E7EB'}`,
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        color: selected ? '#2563EB' : '#111827',
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

/* ================= EDITOR ================= */

export default function InformacionDespachoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = React.useMemo(() => {
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

  const [config, setConfig] = React.useState<any>(initialConfig);
  const [isActive, setIsActive] = React.useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = React.useState<'general' | 'ubicacion' | 'estilos'>('general');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al guardar el widget');
      }
      router.push('/widgets');
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
      setSaving(false);
    }
  };

  const scopeLabel = targetType === 'all' ? 'General' : 'Producto';

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#374151',
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
              background: '#2563EB',
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
              border: '1px solid #E5E7EB',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              color: '#111827',
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
            color: '#111827',
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
            background: '#F3F4F6',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            padding: 16,
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
              color: '#6B7280',
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            <IconInfo size={16} color="#6B7280" />
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
              borderBottom: '1px solid #E5E7EB',
              marginBottom: 20,
            }}
          >
            {(['general', 'ubicacion', 'estilos'] as const).map((t) => {
              const label = t === 'general' ? 'General' : t === 'ubicacion' ? 'Ubicación' : 'Estilos';
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    background: active ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderBottom: active ? '2px solid #111827' : '2px solid transparent',
                    padding: '14px 10px',
                    fontSize: 15,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#111827' : '#6B7280',
                    cursor: 'pointer',
                  }}
                >
                  {label}
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
                  <strong style={{ color: '#111827' }}>hoy</strong>.
                </HelpText>
              </div>

              <div>
                <FieldLabel>Días de despacho</FieldLabel>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
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
                    gridTemplateColumns: 'repeat(3, 1fr)',
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
                    visual={<span style={{ fontSize: 20 }}>✏️</span>}
                    label="Emoji"
                  />
                  <IconoOption
                    selected={config.icono === 'nada'}
                    onClick={() => updateConfig('icono', 'nada')}
                    visual={<span style={{ fontSize: 18, color: '#9CA3AF' }}>—</span>}
                    label="Nada"
                  />
                </div>
              </div>

              {/* EFECTO */}
              <div>
                <FieldLabel>Efecto</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 160 }}>
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
                <div style={{ flex: 1, minWidth: 160 }}>
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

              <div style={{ height: 1, background: '#E5E7EB' }} />

              {/* COLORES */}
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
                  <span style={{ color: '#6B7280', fontWeight: 400 }}>(HOY / contador)</span>
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

              {/* BORDES + PADDING */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <FieldLabel>Bordes redondeados</FieldLabel>
                  <RangeSlider
                    value={config.bordesRedondeados}
                    onChange={(v) => updateConfig('bordesRedondeados', v)}
                    min={0}
                    max={50}
                    marks={[0, 12, 50]}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
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
                    accentColor: '#2563EB',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                  Activar borde
                </span>
              </label>
            </div>
          )}

          {/* FOOTER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid #E5E7EB',
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
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 999,
                padding: '12px 24px',
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Guardando…' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div
          style={{
            marginTop: 40,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <NevuxLogo />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#6B7280',
              fontSize: 14,
            }}
          >
            Centro de ayuda <IconExternal />
          </div>
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
