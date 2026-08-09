'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BundleCantidadPreview from './BundleCantidadPreview';

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

interface UnidadConfig {
  subtitulo: string;
  descuento: number;
  badgeEnvioGratis: boolean;
  badgeMasVendido: boolean;
  badgePersonalizado: boolean;
  ocultar: boolean;
  porDefecto: boolean;
  ocultarComp1: boolean;
  ocultarComp2: boolean;
  agregarRegalo: boolean;
}

const DEFAULT_UNIDAD: UnidadConfig = {
  subtitulo: '',
  descuento: 0,
  badgeEnvioGratis: false,
  badgeMasVendido: false,
  badgePersonalizado: false,
  ocultar: false,
  porDefecto: false,
  ocultarComp1: false,
  ocultarComp2: false,
  agregarRegalo: false,
};

const DEFAULT_CONFIG = {
  titulo: '',
  cantidadUnidades: 2,
  etiqueta: 'Lleva #',
  mostrarPrecio: 'total' as 'total' | 'individual',
  textoBoton: '',
  unidades: [
    { ...DEFAULT_UNIDAD, porDefecto: true },
    { ...DEFAULT_UNIDAD, descuento: 40 },
    { ...DEFAULT_UNIDAD },
    { ...DEFAULT_UNIDAD },
    { ...DEFAULT_UNIDAD },
  ] as UnidadConfig[],
  producto1: null as { id: number | null; nombre: string } | null,
  producto2: null as { id: number | null; nombre: string } | null,
  compDefault: false,
  reemplazarBoton: false,
  colorBoton: '#000000',
  botonDegradado: false,
  colorBoton2: '#3B82F6',
  colorPrecio: '#000000',
  colorSubtitulos: '#059669',
  fondoSubtitulo: '',
  colorTextoRegalo: '#000000',
  colorPrecioRegalo: '#16a34a',
  fondoRegalo: '#f5fff7',
  colorBadgeEnvio: '#10B981',
  colorBadgePersonalizado: '#F59E0B',
  colorBadgeMasVendido: '#EF4444',
  colorUnidadSeleccionada: '#170c0e',
  bordeBoton: 25,
  bordeUnidad: 8,
  fuenteEtiqueta: 16,
  fuentePrecio: 18,
  fuenteSubtitulo: 14,
  efectoBoton: 'sin-efecto' as 'sin-efecto' | 'zoom',
  pulsante: false,
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

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.4 }}>{children}</div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
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

function CheckboxCard({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        gap: 12,
        padding: 14,
        border: `1px solid ${checked ? '#2563EB' : '#E5E7EB'}`,
        borderRadius: 10,
        cursor: 'pointer',
        background: checked ? '#EFF6FF' : '#FFFFFF',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 3, width: 16, height: 16, accentColor: '#2563EB', cursor: 'pointer' }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.4 }}>
            {description}
          </div>
        )}
      </div>
    </label>
  );
}

function CheckboxSimple({
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
        gap: 10,
        cursor: 'pointer',
        padding: '6px 0',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: '#2563EB', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 15, color: '#111827', lineHeight: 1.4 }}>{label}</span>
    </label>
  );
}

function RadioCard({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 10px',
        border: `1px solid ${checked ? '#2563EB' : '#E5E7EB'}`,
        borderRadius: 10,
        cursor: 'pointer',
        background: checked ? '#EFF6FF' : '#FFFFFF',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#2563EB' : '#9CA3AF'}`,
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }} />}
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: checked ? '#2563EB' : '#111827',
          lineHeight: 1.3,
        }}
        onClick={onChange}
      >
        {label}
      </span>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </label>
  );
}

function ColorPickerField({
  value,
  onChange,
  allowTransparent = false,
  transparentLabel = 'Transparente',
}: {
  value: string;
  onChange: (v: string) => void;
  allowTransparent?: boolean;
  transparentLabel?: string;
}) {
  const isEmpty = allowTransparent && (!value || value === '' || value === 'transparent');
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
          background: isEmpty
            ? 'repeating-conic-gradient(#F3F4F6 0% 25%, #FFFFFF 0% 50%) 50% / 12px 12px'
            : value,
        }}
      >
        <input
          type="color"
          value={isEmpty ? '#FFFFFF' : value}
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
        value={isEmpty ? '' : value}
        placeholder={allowTransparent ? transparentLabel : ''}
        onChange={(e) => onChange(e.target.value)}
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
      {allowTransparent && !isEmpty && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            color: '#6B7280',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

function ToggleField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
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
      <span style={{ fontSize: 15, color: '#111827' }}>{label}</span>
    </label>
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
          {marks.map((m) => (
            <span key={m}>{m}px</span>
          ))}
        </div>
      )}
    </div>
  );
}

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
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 12, marginBottom: 6, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div
            style={{ fontSize: 16, fontWeight: 700, color: '#111827', textAlign: 'center' }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#6B7280',
              marginTop: 6,
              lineHeight: 1.5,
              textAlign: 'left',
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

export default function BundleCantidadEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = React.useMemo(() => {
    const cfg = { ...DEFAULT_CONFIG, ...(existingWidget?.config || {}) };
    // asegurar array de 5 unidades
    const unidades: UnidadConfig[] = [];
    for (let i = 0; i < 5; i++) {
      unidades.push({ ...DEFAULT_UNIDAD, ...(cfg.unidades?.[i] || {}) });
    }
    cfg.unidades = unidades;
    return cfg;
  }, [existingWidget]);

  const [config, setConfig] = React.useState(initialConfig);
  const [isActive, setIsActive] = React.useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = React.useState<'general' | 'ubicacion' | 'estilo'>('general');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateConfig = (k: string, v: any) => setConfig((c: any) => ({ ...c, [k]: v }));

  const updateUnidad = (idx: number, k: keyof UnidadConfig, v: any) => {
    setConfig((c: any) => {
      const arr = [...c.unidades];
      arr[idx] = { ...arr[idx], [k]: v };
      // porDefecto: solo una a la vez
      if (k === 'porDefecto' && v === true) {
        arr.forEach((u, i) => {
          if (i !== idx) u.porDefecto = false;
        });
      }
      return { ...c, unidades: arr };
    });
  };

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

  const cantidadReal = Math.max(2, Math.min(5, Number(config.cantidadUnidades) || 2));

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
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
            }}
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
          {widgetDefinition.name}
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
          <div style={{ marginBottom: 20 }}>
            <BundleCantidadPreview config={config} />
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
            {(['general', 'ubicacion', 'estilo'] as const).map((t) => {
              const label = t === 'general' ? 'General' : t === 'ubicacion' ? 'Ubicación' : 'Estilo';
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
                <FieldLabel>Título</FieldLabel>
                <TextInput
                  value={config.titulo}
                  onChange={(v) => updateConfig('titulo', v)}
                  placeholder="Ej: Ofertas especiales por cantidad"
                />
                <FieldHelper>Dejá vacío para no mostrar título</FieldHelper>
              </div>

              <div>
                <FieldLabel>Cantidad de unidades</FieldLabel>
                <SelectField
                  value={config.cantidadUnidades}
                  onChange={(v) => updateConfig('cantidadUnidades', Number(v))}
                  options={[
                    { value: 2, label: 'Hasta 2 unidades' },
                    { value: 3, label: 'Hasta 3 unidades' },
                    { value: 4, label: 'Hasta 4 unidades' },
                    { value: 5, label: 'Hasta 5 unidades' },
                  ]}
                />
              </div>

              <div>
                <FieldLabel>Etiqueta</FieldLabel>
                <SelectField
                  value={config.etiqueta}
                  onChange={(v) => updateConfig('etiqueta', v)}
                  options={[
                    { value: 'Lleva #', label: 'Lleva #' },
                    { value: 'Llevate #', label: 'Llevate #' },
                    { value: 'Compra #', label: 'Compra #' },
                    { value: '# unidades', label: '# unidades' },
                  ]}
                />
              </div>

              <div>
                <FieldLabel>Mostrar precio</FieldLabel>
                <SelectField
                  value={config.mostrarPrecio}
                  onChange={(v) => updateConfig('mostrarPrecio', v)}
                  options={[
                    { value: 'total', label: 'Precio total (por cantidad)' },
                    { value: 'individual', label: 'Precio individual por unidad' },
                  ]}
                />
                <FieldHelper>Elegí si mostrar el precio total o el precio individual por unidad</FieldHelper>
              </div>

              <div>
                <FieldLabel>Texto del botón</FieldLabel>
                <TextInput
                  value={config.textoBoton}
                  onChange={(v) => updateConfig('textoBoton', v)}
                  placeholder="Agregar al carrito"
                />
                <FieldHelper>Dejá vacío para usar "Agregar al carrito"</FieldHelper>
              </div>

              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginTop: 4 }}>
                Configuración por unidad
              </div>

              {Array.from({ length: cantidadReal }).map((_, i) => {
                const u = config.unidades[i];
                return (
                  <div
                    key={i}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 12,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                      Unidad {i + 1}
                    </div>

                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
                        Subtítulo
                      </div>
                      <TextInput
                        value={u.subtitulo}
                        onChange={(v) => updateUnidad(i, 'subtitulo', v)}
                        placeholder="Ej: Ahorrá 10%"
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
                        ¿Tiene descuento? (%)
                      </div>
                      <TextInput
                        type="number"
                        value={u.descuento}
                        onChange={(v) => updateUnidad(i, 'descuento', Number(v) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                        Badges
                      </div>
                      <CheckboxSimple
                        checked={u.badgeEnvioGratis}
                        onChange={(v) => updateUnidad(i, 'badgeEnvioGratis', v)}
                        label="Envío gratis"
                      />
                      <CheckboxSimple
                        checked={u.badgeMasVendido}
                        onChange={(v) => updateUnidad(i, 'badgeMasVendido', v)}
                        label="Más vendido"
                      />
                      <CheckboxSimple
                        checked={u.badgePersonalizado}
                        onChange={(v) => updateUnidad(i, 'badgePersonalizado', v)}
                        label="Personalizado"
                      />
                    </div>

                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                        Configuración extra
                      </div>
                      <CheckboxSimple
                        checked={u.ocultar}
                        onChange={(v) => updateUnidad(i, 'ocultar', v)}
                        label="Ocultar esta unidad"
                      />
                      <CheckboxSimple
                        checked={u.porDefecto}
                        onChange={(v) => updateUnidad(i, 'porDefecto', v)}
                        label="Marcar por defecto"
                      />
                      <CheckboxSimple
                        checked={u.ocultarComp1}
                        onChange={(v) => updateUnidad(i, 'ocultarComp1', v)}
                        label="Ocultar producto complementario 1 en esta unidad"
                      />
                      <CheckboxSimple
                        checked={u.ocultarComp2}
                        onChange={(v) => updateUnidad(i, 'ocultarComp2', v)}
                        label="Ocultar producto complementario 2 en esta unidad"
                      />
                      <CheckboxSimple
                        checked={u.agregarRegalo}
                        onChange={(v) => updateUnidad(i, 'agregarRegalo', v)}
                        label="Agregar producto de regalo en esta unidad"
                      />
                    </div>
                  </div>
                );
              })}

              <div>
                <FieldLabel>Productos complementarios</FieldLabel>
                <FieldHelper>Se mostrarán debajo de cada tarjeta con un checkbox (máximo 2)</FieldHelper>
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                  Producto 1
                </div>
                <TextInput
                  value={config.producto1?.nombre || ''}
                  onChange={(v) =>
                    updateConfig('producto1', v ? { id: null, nombre: v } : null)
                  }
                  placeholder="Buscar un producto…"
                />
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                  Producto 2
                </div>
                <TextInput
                  value={config.producto2?.nombre || ''}
                  onChange={(v) =>
                    updateConfig('producto2', v ? { id: null, nombre: v } : null)
                  }
                  placeholder="Buscar un producto…"
                />
              </div>

              <CheckboxSimple
                checked={config.compDefault}
                onChange={(v) => updateConfig('compDefault', v)}
                label="Marcar como checkeado por defecto"
              />
            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <CheckboxCard
                checked={config.reemplazarBoton}
                onChange={(v) => updateConfig('reemplazarBoton', v)}
                label="Reemplazar por el botón de agregar al carrito de Tiendanube"
                description="Cuando está activo, el widget reemplaza el formulario original de Tiendanube. Al desactivarlo, el formulario original permanece visible y funcional."
              />
            </div>
          )}

          {/* TAB ESTILO */}
          {tab === 'estilo' && (
            <div>
              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <circle cx="13.5" cy="6.5" r="1.5" />
                    <circle cx="17.5" cy="10.5" r="1.5" />
                    <circle cx="8.5" cy="7.5" r="1.5" />
                    <circle cx="6.5" cy="12.5" r="1.5" />
                    <path d="M12 2a10 10 0 100 20 1 1 0 001-1v-.5a2 2 0 012-2h1.5a2.5 2.5 0 002.5-2.5A9 9 0 0012 2z" />
                  </svg>
                }
                title="Colores principales"
                description="Definí la paleta del bloque principal y del botón de compra."
              >
                <div>
                  <FieldLabel>Color del botón "Agregar"</FieldLabel>
                  <ColorPickerField
                    value={config.colorBoton}
                    onChange={(v) => updateConfig('colorBoton', v)}
                  />
                  <div style={{ marginTop: 10 }}>
                    <ToggleField
                      checked={config.botonDegradado}
                      onChange={(v) => updateConfig('botonDegradado', v)}
                      label="Fondo en degradé"
                    />
                    {config.botonDegradado && (
                      <div style={{ marginTop: 10 }}>
                        <ColorPickerField
                          value={config.colorBoton2}
                          onChange={(v) => updateConfig('colorBoton2', v)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <FieldLabel>Color del precio</FieldLabel>
                  <ColorPickerField
                    value={config.colorPrecio}
                    onChange={(v) => updateConfig('colorPrecio', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color de subtítulos</FieldLabel>
                  <ColorPickerField
                    value={config.colorSubtitulos}
                    onChange={(v) => updateConfig('colorSubtitulos', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Fondo del subtítulo</FieldLabel>
                  <ColorPickerField
                    value={config.fondoSubtitulo}
                    onChange={(v) => updateConfig('fondoSubtitulo', v)}
                    allowTransparent
                    transparentLabel="Transparente"
                  />
                </div>
                <div>
                  <FieldLabel>Color texto regalo</FieldLabel>
                  <ColorPickerField
                    value={config.colorTextoRegalo}
                    onChange={(v) => updateConfig('colorTextoRegalo', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color precio regalo</FieldLabel>
                  <ColorPickerField
                    value={config.colorPrecioRegalo}
                    onChange={(v) => updateConfig('colorPrecioRegalo', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Fondo del regalo</FieldLabel>
                  <ColorPickerField
                    value={config.fondoRegalo}
                    onChange={(v) => updateConfig('fondoRegalo', v)}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                }
                title="Badges y etiquetas"
                description="Personalizá los colores de destacados y estado seleccionado."
              >
                <div>
                  <FieldLabel>Color badge envío gratis</FieldLabel>
                  <ColorPickerField
                    value={config.colorBadgeEnvio}
                    onChange={(v) => updateConfig('colorBadgeEnvio', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color badge personalizado</FieldLabel>
                  <ColorPickerField
                    value={config.colorBadgePersonalizado}
                    onChange={(v) => updateConfig('colorBadgePersonalizado', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color badge más vendido</FieldLabel>
                  <ColorPickerField
                    value={config.colorBadgeMasVendido}
                    onChange={(v) => updateConfig('colorBadgeMasVendido', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color unidad seleccionada</FieldLabel>
                  <ColorPickerField
                    value={config.colorUnidadSeleccionada}
                    onChange={(v) => updateConfig('colorUnidadSeleccionada', v)}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                }
                title="Estructura y bordes"
                description="Ajustá el redondeado del botón y de cada unidad."
              >
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <FieldLabel>Borde del botón "Agregar"</FieldLabel>
                    <RangeSlider
                      value={config.bordeBoton}
                      onChange={(v) => updateConfig('bordeBoton', v)}
                      min={0}
                      max={25}
                      marks={[0, 25, config.bordeBoton]}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <FieldLabel>Borde de la unidad</FieldLabel>
                    <RangeSlider
                      value={config.bordeUnidad}
                      onChange={(v) => updateConfig('bordeUnidad', v)}
                      min={0}
                      max={25}
                      marks={[0, config.bordeUnidad, 25]}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                }
                title="Tipografía"
                description="Definí el tamaño de texto para etiqueta, precio y subtítulo."
              >
                <div>
                  <FieldLabel>Etiqueta</FieldLabel>
                  <SelectField
                    value={config.fuenteEtiqueta}
                    onChange={(v) => updateConfig('fuenteEtiqueta', Number(v))}
                    options={[12, 14, 16, 18, 20, 24].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
                <div>
                  <FieldLabel>Precio</FieldLabel>
                  <SelectField
                    value={config.fuentePrecio}
                    onChange={(v) => updateConfig('fuentePrecio', Number(v))}
                    options={[12, 14, 16, 18, 20, 24].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
                <div>
                  <FieldLabel>Subtítulo</FieldLabel>
                  <SelectField
                    value={config.fuenteSubtitulo}
                    onChange={(v) => updateConfig('fuenteSubtitulo', Number(v))}
                    options={[12, 14, 16, 18, 20, 24].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                  </svg>
                }
                title="Efectos y animaciones"
                description="Elegí cómo se comporta visualmente el botón al interactuar."
              >
                <div>
                  <FieldLabel>Efecto del botón</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <RadioCard
                      checked={config.efectoBoton === 'sin-efecto'}
                      onChange={() => updateConfig('efectoBoton', 'sin-efecto')}
                      label="Sin efecto"
                    />
                    <RadioCard
                      checked={config.efectoBoton === 'zoom'}
                      onChange={() => updateConfig('efectoBoton', 'zoom')}
                      label="Zoom al cursor"
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      padding: 14,
                      border: '1px solid #E5E7EB',
                      borderRadius: 10,
                      background: '#FFFFFF',
                    }}
                  >
                    <ToggleField
                      checked={config.pulsante}
                      onChange={(v) => updateConfig('pulsante', v)}
                      label="Pulsante"
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
              borderTop: '1px solid #E5E7EB',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ToggleField
                checked={isActive}
                onChange={setIsActive}
                label="Widget activo"
              />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 14 }}>
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
