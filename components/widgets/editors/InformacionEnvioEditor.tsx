'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import InformacionEnvioPreview from './InformacionEnvioPreview';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

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
  diasHastaEnvio: 1,
  diasParaEntrega: 2,
  horaCorte: '18:00',
  mostrarHoraLimite: false,
  mostrarRangoEntrega: false,
  mostrarFechasAprox: false,
  noDespacharSabados: false,
  tipoIconos: 'emojis' as 'emojis' | 'svg',
  // Estilos
  colorFondo: '#d9f5e4',
  colorTexto: '#1f6b4e',
  colorBadgeFondo: '#dc3545',
  colorBadgeTexto: '#ffffff',
  activarBorde: false,
  tamanoLabel: 14,
  tamanoDia: 13,
  bordesRedondeados: 10,
  paddingInterno: 15,
};

/* ================= HELPERS UI ================= */

function IconStore({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M4 9v11a1 1 0 001 1h14a1 1 0 001-1V9" />
      <path d="M9 21V13h6v8" />
    </svg>
  );
}

function IconInfo({ size = 14, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

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

// Se añaden los manejadores de focus en el TextInput para el borde verde esmeralda
function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
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
        transition: 'border-color 0.2s',
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
          transition: 'background 0.15s',
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
            transition: 'left 0.15s',
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
}: {
  value: string;
  onChange: (v: string) => void;
}) {
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
          value={value || '#FFFFFF'}
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

/* ================= CHECKBOX CARD ================= */

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

/* ================= ICON TYPE OPTION ================= */

function IconTypeOption({
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
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 12,
        padding: '16px 18px',
        background: selected ? '#ecfdf5' : '#FFFFFF',
        border: `1px solid ${selected ? '#10B981' : '#e5e7eb'}`,
        borderRadius: 10,
        cursor: 'pointer',
        flex: 1,
        minHeight: 68,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {visual}
      </div>
      <span
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: selected ? '#10B981' : '#000000',
          textAlign: 'left',
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* ================= SECTION CARD ================= */

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 12, marginBottom: 6, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#000000' }}>{title}</div>
          <div
            style={{
              fontSize: 14,
              color: '#000000',
              opacity: 0.6,
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

/* ================= EDITOR ================= */

export default function InformacionEnvioEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = React.useMemo(() => {
    return { ...DEFAULT_CONFIG, ...(existingWidget?.config || {}) };
  }, [existingWidget]);

  const [config, setConfig] = React.useState<any>(initialConfig);
  const [isActive, setIsActive] = React.useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = React.useState<'general' | 'estilos'>('general');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateConfig = (k: string, v: any) => setConfig((c: any) => ({ ...c, [k]: v }));

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
            <IconStore color="#FFFFFF" />
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
            <InformacionEnvioPreview config={config} />
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
            <span>La información de envío aparecerá después del formulario del producto.</span>
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
            {(['general', 'estilos'] as const).map((t) => {
              const label = t === 'general' ? 'General' : 'Estilos';
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: active ? '2px solid #10B981' : '2px solid transparent',
                    padding: '14px 10px',
                    fontSize: 15,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#10B981' : '#000000',
                    opacity: active ? 1 : 0.6,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
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
                <FieldLabel>Días hasta el envío</FieldLabel>
                <TextInput
                  type="number"
                  value={config.diasHastaEnvio}
                  onChange={(v) => updateConfig('diasHastaEnvio', Math.max(0, parseInt(v, 10) || 0))}
                  min={0}
                  max={30}
                />
                <HelpText>
                  Días que se sumarán a la fecha de compra (hoy) para mostrar la fecha de envío.
                </HelpText>
              </div>

              <div>
                <FieldLabel>Días para la entrega (después del envío)</FieldLabel>
                <TextInput
                  type="number"
                  value={config.diasParaEntrega}
                  onChange={(v) => updateConfig('diasParaEntrega', Math.max(0, parseInt(v, 10) || 0))}
                  min={0}
                  max={60}
                />
                <HelpText>
                  Días que se sumarán a la fecha de envío para mostrar la fecha de entrega
                </HelpText>
              </div>

              <div>
                <FieldLabel>Hora de corte para despacho hoy</FieldLabel>
                <TextInput
                  type="time"
                  value={config.horaCorte}
                  onChange={(v) => updateConfig('horaCorte', v)}
                />
                <HelpText>
                  Si la visita es después de esta hora, el despacho se mostrará para el día
                  siguiente.
                </HelpText>
              </div>

              <CheckboxCard
                checked={config.mostrarHoraLimite}
                onChange={(v) => updateConfig('mostrarHoraLimite', v)}
                title="Mostrar hora límite de compra"
                description={
                  'Muestra un pequeño badge debajo de "Hoy" indicando la hora de corte (ej: ANTES DE LAS 18:00). Se ocultará hasta el próximo día una vez superada la hora.'
                }
              />

              <CheckboxCard
                checked={config.mostrarRangoEntrega}
                onChange={(v) => updateConfig('mostrarRangoEntrega', v)}
                title="Mostrar rango de fechas para entrega"
                description={'Mostrará un rango de 2 días consecutivos para la entrega (ej: "11 y 12 feb")'}
              />

              <CheckboxCard
                checked={config.mostrarFechasAprox}
                onChange={(v) => updateConfig('mostrarFechasAprox', v)}
                title='Mostrar mensaje "Fechas aproximadas"'
                description="Muestra una pequeña nota aclarando que las fechas son aproximadas"
              />

              <CheckboxCard
                checked={config.noDespacharSabados}
                onChange={(v) => updateConfig('noDespacharSabados', v)}
                title="No despachar los sábados"
                description="Si el día de envío cae sábado, se moverá automáticamente al lunes siguiente"
              />

              <div>
                <FieldLabel>Tipo de iconos</FieldLabel>
                <div style={{ display: 'flex', gap: 10 }}>
                  <IconTypeOption
                    selected={config.tipoIconos === 'emojis'}
                    onClick={() => updateConfig('tipoIconos', 'emojis')}
                    visual={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 22 }}>📦</span>
                        <span style={{ fontSize: 22 }}>🚚</span>
                        <span style={{ fontSize: 20 }}>📍</span>
                      </div>
                    }
                    label="Emojis"
                  />
                  <IconTypeOption
                    selected={config.tipoIconos === 'svg'}
                    onClick={() => updateConfig('tipoIconos', 'svg')}
                    visual={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    }
                    label="Iconos SVG"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB ESTILOS */}
          {tab === 'estilos' && (
            <div>
              {/* COLORES PRINCIPALES */}
              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <circle cx="13.5" cy="6.5" r="1.5" />
                    <circle cx="17.5" cy="10.5" r="1.5" />
                    <circle cx="8.5" cy="7.5" r="1.5" />
                    <circle cx="6.5" cy="12.5" r="1.5" />
                    <path d="M12 2a10 10 0 100 20 1 1 0 001-1v-.5a2 2 0 012-2h1.5a2.5 2.5 0 002.5-2.5A9 9 0 0012 2z" />
                  </svg>
                }
                title="Colores principales"
                description="Personalizá los colores de fondo, texto y badge."
              >
                <div>
                  <FieldLabel>Color de fondo</FieldLabel>
                  <ColorPickerField
                    value={config.colorFondo}
                    onChange={(v) => updateConfig('colorFondo', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color de texto</FieldLabel>
                  <ColorPickerField
                    value={config.colorTexto}
                    onChange={(v) => updateConfig('colorTexto', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color de fondo del badge &quot;Antes de...&quot;</FieldLabel>
                  <ColorPickerField
                    value={config.colorBadgeFondo}
                    onChange={(v) => updateConfig('colorBadgeFondo', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color de texto del badge &quot;Antes de...&quot;</FieldLabel>
                  <ColorPickerField
                    value={config.colorBadgeTexto}
                    onChange={(v) => updateConfig('colorBadgeTexto', v)}
                  />
                </div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    marginTop: 4,
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
                    Activar borde en la caja
                  </span>
                </label>
              </SectionCard>

              {/* TIPOGRAFÍAS */}
              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                }
                title="Tipografías"
                description="Ajustá el tamaño del label y del día."
              >
                <div>
                  <FieldLabel>Tamaño del label</FieldLabel>
                  <SelectField
                    value={config.tamanoLabel}
                    onChange={(v) => updateConfig('tamanoLabel', Number(v))}
                    options={[10, 11, 12, 13, 14, 15, 16, 18, 20].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
                <div>
                  <FieldLabel>Tamaño del día</FieldLabel>
                  <SelectField
                    value={config.tamanoDia}
                    onChange={(v) => updateConfig('tamanoDia', Number(v))}
                    options={[10, 11, 12, 13, 14, 15, 16, 18].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
              </SectionCard>

              {/* COMPORTAMIENTO Y DISEÑO */}
              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <circle cx="8" cy="6" r="2" fill="#10B981" />
                    <circle cx="16" cy="12" r="2" fill="#10B981" />
                    <circle cx="10" cy="18" r="2" fill="#10B981" />
                  </svg>
                }
                title="Comportamiento y diseño"
                description="Bordes redondeados y margen interno."
              >
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <FieldLabel>Bordes redondeados</FieldLabel>
                    <RangeSlider
                      value={config.bordesRedondeados}
                      onChange={(v) => updateConfig('bordesRedondeados', v)}
                      min={0}
                      max={25}
                      marks={[0, 10, 25]}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <FieldLabel>Margen interno (padding)</FieldLabel>
                    <RangeSlider
                      value={config.paddingInterno}
                      onChange={(v) => updateConfig('paddingInterno', v)}
                      min={0}
                      max={40}
                      marks={[0, 15, 40]}
                    />
                  </div>
                </div>
              </SectionCard>
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
