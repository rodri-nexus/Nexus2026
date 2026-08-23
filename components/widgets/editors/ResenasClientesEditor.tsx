'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ResenasClientesPreview from './ResenasClientesPreview';
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
  titulo: '',
  textoBoton: 'Escribir reseña',
  subtitulo: '',
  mensajeAgradecimiento:
    '¡Gracias! Tu reseña fue enviada y será publicada luego de ser revisada.',
  ofrecerCupon: false,
  codigoCupon: '',
  aprobarAutomaticamente: true,
  notificarPendientes: false,
  mostrarTodasLasResenas: false,
  activarPreguntaTalle: false,
  ocultarBotonEscribir: false,
  ocultarSiNoHayResenas: false,
  mostrarFecha: false,

  // Ubicaciones
  mostrarPuntuacionBajoTitulo: true,

  // Estilos
  disenoWidget: 'cuadricula',
  reviewsPorPagina: 8,
  bordeBotones: 25,
  mostrarOpinionPrimero: false,

  // Colores
  colorBotones: '#10B981',
  colorFondo: 'transparent',
  colorTitulo: '#000000',
  colorSubtitulo: '#000000',
  fondoSubtitulo: 'transparent',
  colorFondoResena: '#fafafa',
  colorNombre: '#000000',
  colorEstrellas: '#f5b300',
  colorTextoResena: '#333333',
  colorFecha: '#999999',

  // Tipografías
  tamanoTitulo: 22,
  tamanoSubtitulo: 16,
  tamanoEstrellas: 16,
  tamanoNombre: 16,
  estiloNombre: 'resaltado',
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

function IconLink({ size = 18, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M10 13a5 5 0 007 0l4-4a5 5 0 00-7-7l-1 1" />
      <path d="M14 11a5 5 0 00-7 0l-4 4a5 5 0 007 7l1-1" />
    </svg>
  );
}

function IconCopy({ size = 16, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function IconUpload({ size = 18, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.4 }}>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        fontSize: 15,
        color: '#000000',
        background: readOnly ? '#F9FAFB' : '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => !readOnly && (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
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
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: 1.5,
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

function CheckboxCard({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
        <div
          onClick={(e) => {
            e.preventDefault();
            onChange(!checked);
          }}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: checked ? '#10B981' : '#FFFFFF',
            border: checked ? '1px solid #10B981' : '1.5px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s ease',
            marginTop: 1,
          }}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.4 }}>
            {label}
          </div>
          {description && (
            <div style={{ fontSize: 14, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {description}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

function CheckboxSimple({
  checked,
  onChange,
  label,
  icon,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  icon?: React.ReactNode;
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
        style={{ width: 18, height: 18, accentColor: '#10B981', cursor: 'pointer' }}
      />
      {icon}
      <span style={{ fontSize: 15, color: '#000000', lineHeight: 1.4, fontWeight: 500 }}>{label}</span>
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
  const isTransparent = value === 'transparent' || value === '';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 48,
          height: 40,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          background: isTransparent
            ? 'repeating-conic-gradient(#e5e7eb 0 25%, #ffffff 0 50%) 50% / 12px 12px'
            : value,
          flexShrink: 0,
        }}
      >
        <input
          type="color"
          value={isTransparent ? '#ffffff' : value}
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
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={isTransparent ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Transparente"
          style={{
            width: '100%',
            padding: '10px 30px 10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 13,
            color: '#000000',
            background: '#FFFFFF',
            outline: 'none',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        />
        {!isTransparent && (
          <button
            type="button"
            onClick={() => onChange('transparent')}
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#000000',
              opacity: 0.5,
              fontSize: 16,
              padding: 4,
              lineHeight: 1,
            }}
            title="Poner transparente"
          >
            ×
          </button>
        )}
      </div>
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
            transition: 'left 0.25s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>{label}</span>}
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
              marginTop: 6,
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

export default function ResenasClientesEditor({
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
  const [tab, setTab] = React.useState<'general' | 'ubicaciones' | 'resenas' | 'estilos'>('general');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copiado, setCopiado] = React.useState(false);
  const [csvUploading, setCsvUploading] = React.useState(false);
  const [csvResult, setCsvResult] = React.useState<{
    importadas: number;
    salteadas: number;
    errores: { fila: number; motivo: string }[];
  } | null>(null);
  const csvInputRef = React.useRef<HTMLInputElement>(null);

  const updateConfig = (k: string, v: any) => setConfig((c: any) => ({ ...c, [k]: v }));

  const linkCalificar = React.useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://mitienda.com';
    if (targetType === 'product' && productId) {
      return `${base}/productos/${productId}?calificar`;
    }
    return `${base}?calificar`;
  }, [targetType, productId]);

  const copiarLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(linkCalificar);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleCsvUpload = async (file: File) => {
    if (!existingWidget?.id) {
      setError('Primero tenés que crear el widget antes de importar reseñas.');
      return;
    }
    setCsvUploading(true);
    setCsvResult(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('widget_id', existingWidget.id);
      if (productId) formData.append('product_id', String(productId));

      const res = await fetch('/api/reviews/import-csv', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error importando CSV');
      setCsvResult({
        importadas: data.importadas ?? 0,
        salteadas: data.salteadas ?? 0,
        errores: data.errores ?? [],
      });
    } catch (e: any) {
      setError(e.message || 'Error importando CSV');
    } finally {
      setCsvUploading(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
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
            <IconStore />
            Todos los productos
          </div>
        ) : (
          <>
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 12,
                padding: 14,
                marginBottom: 14,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ marginTop: 2 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981">
                  <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8Z" />
                </svg>
              </div>
              <div style={{ fontSize: 14, color: '#000000', lineHeight: 1.5 }}>
                Te sugerimos crear este widget para toda la tienda en lugar de solo para este
                producto.{' '}
                <span style={{ color: '#059669', fontWeight: 700, cursor: 'pointer' }}>
                  Crear para toda la tienda →
                </span>
              </div>
            </div>
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
          </>
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
          <div
            style={{
              marginBottom: 16,
              background: '#FFFFFF',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <ResenasClientesPreview config={config} />
          </div>

          {/* Aclaración de ubicación */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
              padding: '10px 4px',
              marginBottom: 8,
            }}
          >
            <IconInfo size={16} color="#10B981" />
            <span style={{ fontSize: 13, color: '#000000', opacity: 0.6, lineHeight: 1.5 }}>
              Las reseñas aparecerán debajo de la sección del producto.
            </span>
          </div>

          {/* TABS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0,
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 20,
            }}
          >
            {(['general', 'ubicaciones', 'resenas', 'estilos'] as const).map((t) => {
              const label =
                t === 'general'
                  ? 'General'
                  : t === 'ubicaciones'
                  ? 'Ubicaciones'
                  : t === 'resenas'
                  ? 'Reseñas'
                  : 'Estilos';
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: active ? '2px solid #10B981' : '2px solid transparent',
                    padding: '14px 6px',
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: '#000000',
                    opacity: active ? 1 : 0.6,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ============ TAB: GENERAL ============ */}
          {tab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Título del widget</FieldLabel>
                <TextInput
                  value={config.titulo}
                  onChange={(v) => updateConfig('titulo', v)}
                  placeholder="Ej: Lo que dicen nuestros clientes"
                />
                <FieldHint>Aparecerá como encabezado antes del widget en la tienda.</FieldHint>
              </div>

              <div>
                <FieldLabel>Texto del botón</FieldLabel>
                <TextInput
                  value={config.textoBoton}
                  onChange={(v) => updateConfig('textoBoton', v)}
                  placeholder="Escribir reseña"
                />
              </div>

              <div>
                <FieldLabel>
                  Subtítulo <span style={{ fontWeight: 400, color: '#000000', opacity: 0.6 }}>(opcional)</span>
                </FieldLabel>
                <TextInput
                  value={config.subtitulo}
                  onChange={(v) => updateConfig('subtitulo', v)}
                  placeholder="Ej: Más de 500 clientes felices"
                />
              </div>

              <div>
                <FieldLabel>Mensaje de agradecimiento</FieldLabel>
                <TextArea
                  value={config.mensajeAgradecimiento}
                  onChange={(v) => updateConfig('mensajeAgradecimiento', v)}
                  placeholder="¡Gracias! Tu reseña fue enviada..."
                  rows={3}
                />
                <FieldHint>Mensaje que ve el cliente luego de enviar.</FieldHint>
              </div>

              <CheckboxCard
                checked={config.ofrecerCupon}
                onChange={(v) => updateConfig('ofrecerCupon', v)}
                label="Ofrecer cupón de descuento al dejar una reseña"
                description="Al enviar la reseña, el cliente verá un código de descuento para usar en su próxima compra. El cupón debe crearse previamente en tu tienda."
              />

              {config.ofrecerCupon && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <FieldLabel>Código del cupón</FieldLabel>
                  <TextInput
                    value={config.codigoCupon}
                    onChange={(v) => updateConfig('codigoCupon', v)}
                    placeholder="Ej: GRACIAS10"
                  />
                </div>
              )}

              <CheckboxCard
                checked={config.aprobarAutomaticamente}
                onChange={(v) => updateConfig('aprobarAutomaticamente', v)}
                label="Aprobar reseñas automáticamente"
                description="Las reseñas enviadas serán visibles de inmediato sin aprobación manual."
              />

              <CheckboxCard
                checked={config.notificarPendientes}
                onChange={(v) => updateConfig('notificarPendientes', v)}
                label="Notificarme cuando haya reseñas pendientes"
                description="Te enviaremos un email cuando haya 3 o más reseñas esperando aprobación."
              />

              <CheckboxCard
                checked={config.mostrarTodasLasResenas}
                onChange={(v) => updateConfig('mostrarTodasLasResenas', v)}
                label="Mostrar todas las reseñas de la tienda"
                description="Al activar esta opción, el widget mostrará las reseñas de todos los productos de la tienda, no solo las del producto actual."
              />

              <CheckboxCard
                checked={config.activarPreguntaTalle}
                onChange={(v) => updateConfig('activarPreguntaTalle', v)}
                label={'Activar pregunta de talle "¿Te quedó como esperabas?"'}
                description="Ideal para tiendas de indumentaria. Agrega un paso extra al formulario donde el comprador puede indicar si el talle le quedó Chico, Algo chico, Como esperaba, Algo grande o Grande. El resumen se muestra junto a la puntuación del widget."
              />

              {/* Link para dejar reseña */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <IconLink />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#000000' }}>
                    Link para dejar reseña
                  </div>
                </div>
                <div style={{ fontSize: 14, color: '#000000', lineHeight: 1.5, marginBottom: 14 }}>
                  Compartí el link con{' '}
                  <code
                    style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    ?calificar
                  </code>{' '}
                  al final de la URL con tus clientes. Cuando lo abran, el formulario de reseña
                  se abrirá automáticamente.
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#F9FAFB',
                    border: '1px solid #e5e7eb',
                    padding: '10px 14px',
                    borderRadius: 10,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 18 }}>🛍</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#000000' }}>
                    NEVUX Widget
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <TextInput value={linkCalificar} readOnly />
                  </div>
                  <button
                    type="button"
                    onClick={copiarLink}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#FFFFFF',
                      border: '1px solid #10B981',
                      color: '#10B981',
                      borderRadius: 999,
                      padding: '10px 18px',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    <IconCopy />
                    {copiado ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <CheckboxCard
                checked={config.ocultarBotonEscribir}
                onChange={(v) => updateConfig('ocultarBotonEscribir', v)}
                label={'Ocultar botón "Escribir reseña"'}
                description={
                  <>
                    El botón no se mostrará públicamente. Solo podrán dejar una reseña quienes
                    ingresen a través de un link de solicitud (
                    <code
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        padding: '1px 5px',
                        borderRadius: 4,
                        fontSize: 12,
                      }}
                    >
                      ?calificar
                    </code>
                    ) o hayan realizado una compra.
                  </>
                }
              />

              <CheckboxCard
                checked={config.ocultarSiNoHayResenas}
                onChange={(v) => updateConfig('ocultarSiNoHayResenas', v)}
                label="Ocultar widget si no hay reseñas"
                description={
                  <>
                    Si no hay reseñas visibles, el widget no se mostrará en el producto (tampoco
                    el botón para escribir). Para conseguir las primeras reseñas, compartí enlaces
                    del producto con{' '}
                    <code
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        padding: '1px 5px',
                        borderRadius: 4,
                        fontSize: 12,
                      }}
                    >
                      ?calificar
                    </code>{' '}
                    para que se abra el formulario directamente.
                  </>
                }
              />

              <CheckboxCard
                checked={config.mostrarFecha}
                onChange={(v) => updateConfig('mostrarFecha', v)}
                label="Mostrar fecha de la reseña"
                description="Muestra la fecha dentro de cada reseña con formato relativo."
              />
            </div>
          )}

          {/* ============ TAB: UBICACIONES ============ */}
          {tab === 'ubicaciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <CheckboxCard
                checked={config.mostrarPuntuacionBajoTitulo}
                onChange={(v) => updateConfig('mostrarPuntuacionBajoTitulo', v)}
                label="Mostrar puntuación debajo del título del producto"
                description="Muestra estrellas y puntuación justo debajo del nombre del producto si hay al menos una reseña."
              />
            </div>
          )}

          {/* ============ TAB: RESEÑAS ============ */}
          {tab === 'resenas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Estado vacío */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '40px 20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1.5"
                    style={{ display: 'inline-block', opacity: 0.3 }}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
                  Aún no hay reseñas
                </div>
                <div style={{ fontSize: 14, color: '#000000', opacity: 0.6, lineHeight: 1.5, maxWidth: 400, margin: '0 auto' }}>
                  Una vez que crees el widget y lo actives en tu tienda, los clientes podrán dejar
                  sus reseñas. Volverás aquí para gestionarlas.
                </div>
              </div>

              {/* Botón importar CSV */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCsvUpload(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => csvInputRef.current?.click()}
                  disabled={csvUploading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#FFFFFF',
                    border: '1.5px solid #e5e7eb',
                    color: '#000000',
                    borderRadius: 999,
                    padding: '12px 24px',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: csvUploading ? 'wait' : 'pointer',
                    opacity: csvUploading ? 0.7 : 1,
                  }}
                >
                  <IconUpload />
                  {csvUploading ? 'Importando…' : 'Importar reseñas desde CSV'}
                </button>
                <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 12, lineHeight: 1.5 }}>
                  Importá reseñas existentes en masa desde un archivo CSV.
                </div>
                <div style={{ fontSize: 12, color: '#000000', opacity: 0.5, marginTop: 6 }}>
                  Formato:{' '}
                  <code
                    style={{
                      background: '#F3F4F6',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    nombre,estrellas,texto,fecha,verificada,foto_url
                  </code>
                </div>
              </div>

              {/* Resultado de importación */}
              {csvResult && (
                <div
                  style={{
                    background: csvResult.errores.length > 0 ? '#FEF3C7' : '#D1FAE5',
                    border: `1px solid ${
                      csvResult.errores.length > 0 ? '#FCD34D' : '#6EE7B7'
                    }`,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: csvResult.errores.length > 0 ? '#92400E' : '#065F46',
                      marginBottom: 6,
                    }}
                  >
                    Importación completada
                  </div>
                  <div style={{ fontSize: 14, color: '#000000', lineHeight: 1.6 }}>
                    ✅ Importadas: <strong>{csvResult.importadas}</strong>
                    {csvResult.salteadas > 0 && (
                      <>
                        <br />
                        ⚠️ Salteadas: <strong>{csvResult.salteadas}</strong>
                      </>
                    )}
                  </div>
                  {csvResult.errores.length > 0 && (
                    <details style={{ marginTop: 10 }}>
                      <summary
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#92400E',
                          cursor: 'pointer',
                        }}
                      >
                        Ver detalle de errores
                      </summary>
                      <ul
                        style={{
                          fontSize: 13,
                          color: '#000000',
                          marginTop: 8,
                          paddingLeft: 20,
                        }}
                      >
                        {csvResult.errores.slice(0, 20).map((err, i) => (
                          <li key={i}>
                            Fila {err.fila}: {err.motivo}
                          </li>
                        ))}
                        {csvResult.errores.length > 20 && (
                          <li style={{ fontStyle: 'italic', color: '#000000', opacity: 0.6 }}>
                            …y {csvResult.errores.length - 20} más
                          </li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============ TAB: ESTILOS ============ */}
          {tab === 'estilos' && (
            <div>
              <SectionCard
                icon={
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="14" y2="12" />
                    <line x1="4" y1="18" x2="18" y2="18" />
                  </svg>
                }
                title="Comportamiento y diseño"
                description="Cantidad de reseñas por página y borde de los botones."
              >
                <div>
                  <FieldLabel>Diseño del widget</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => updateConfig('disenoWidget', 'cuadricula')}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 10,
                        border:
                          config.disenoWidget === 'cuadricula'
                            ? '1.5px solid #10B981'
                            : '1px solid #e5e7eb',
                        background:
                          config.disenoWidget === 'cuadricula' ? '#ecfdf5' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: config.disenoWidget === 'cuadricula' ? '#10B981' : '#000000',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                      Cuadrícula
                    </button>
                    <button
                      type="button"
                      onClick={() => updateConfig('disenoWidget', 'lista')}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 10,
                        border:
                          config.disenoWidget === 'lista'
                            ? '1.5px solid #10B981'
                            : '1px solid #e5e7eb',
                        background: config.disenoWidget === 'lista' ? '#ecfdf5' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: config.disenoWidget === 'lista' ? '#10B981' : '#000000',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      Lista
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <FieldLabel>Reviews por página</FieldLabel>
                    <SelectField
                      value={config.reviewsPorPagina}
                      onChange={(v) => updateConfig('reviewsPorPagina', Number(v))}
                      options={[4, 6, 8, 12, 16, 24].map((n) => ({
                        value: n,
                        label: String(n),
                      }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Borde de los botones</FieldLabel>
                    <SelectField
                      value={config.bordeBotones}
                      onChange={(v) => updateConfig('bordeBotones', Number(v))}
                      options={[
                        { value: 25, label: 'Píldora (25px)' },
                        { value: 12, label: 'Redondeado (12px)' },
                        { value: 0, label: 'Cuadrado (0px)' },
                      ]}
                    />
                  </div>
                </div>

                <CheckboxCard
                  checked={config.mostrarOpinionPrimero}
                  onChange={(v) => updateConfig('mostrarOpinionPrimero', v)}
                  label="Mostrar la opinión primero"
                  description="El texto de la reseña se muestra primero, y el nombre y la fecha del cliente quedan debajo (opcional)."
                />
              </SectionCard>

              <SectionCard
                icon={
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  >
                    <circle cx="13.5" cy="6.5" r="1.5" />
                    <circle cx="17.5" cy="10.5" r="1.5" />
                    <circle cx="8.5" cy="7.5" r="1.5" />
                    <circle cx="6.5" cy="12.5" r="1.5" />
                    <path d="M12 2a10 10 0 100 20 1 1 0 001-1v-.5a2 2 0 012-2h1.5a2.5 2.5 0 002.5-2.5A9 9 0 0012 2z" />
                  </svg>
                }
                title="Colores principales"
                description="Personalizá los colores de botones, fondo, título, subtítulo y reseñas."
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <FieldLabel>Color de los botones</FieldLabel>
                    <ColorPickerField
                      value={config.colorBotones}
                      onChange={(v) => updateConfig('colorBotones', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color de fondo</FieldLabel>
                    <ColorPickerField
                      value={config.colorFondo}
                      onChange={(v) => updateConfig('colorFondo', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color del título y puntaje</FieldLabel>
                    <ColorPickerField
                      value={config.colorTitulo}
                      onChange={(v) => updateConfig('colorTitulo', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color del subtítulo</FieldLabel>
                    <ColorPickerField
                      value={config.colorSubtitulo}
                      onChange={(v) => updateConfig('colorSubtitulo', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Fondo del subtítulo</FieldLabel>
                    <ColorPickerField
                      value={config.fondoSubtitulo}
                      onChange={(v) => updateConfig('fondoSubtitulo', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color de fondo de la reseña</FieldLabel>
                    <ColorPickerField
                      value={config.colorFondoResena}
                      onChange={(v) => updateConfig('colorFondoResena', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color del nombre</FieldLabel>
                    <ColorPickerField
                      value={config.colorNombre}
                      onChange={(v) => updateConfig('colorNombre', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color de estrellas</FieldLabel>
                    <ColorPickerField
                      value={config.colorEstrellas}
                      onChange={(v) => updateConfig('colorEstrellas', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color del texto de la reseña</FieldLabel>
                    <ColorPickerField
                      value={config.colorTextoResena}
                      onChange={(v) => updateConfig('colorTextoResena', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Color de la fecha</FieldLabel>
                    <ColorPickerField
                      value={config.colorFecha}
                      onChange={(v) => updateConfig('colorFecha', v)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  >
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                }
                title="Tipografías"
                description="Ajustá el tamaño de fuente del título y del subtítulo."
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <FieldLabel>Tamaño de fuente del título</FieldLabel>
                    <SelectField
                      value={config.tamanoTitulo}
                      onChange={(v) => updateConfig('tamanoTitulo', Number(v))}
                      options={[16, 18, 20, 22, 24, 28, 32].map((n) => ({
                        value: n,
                        label: `${n}px`,
                      }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Tamaño de fuente del subtítulo</FieldLabel>
                    <SelectField
                      value={config.tamanoSubtitulo}
                      onChange={(v) => updateConfig('tamanoSubtitulo', Number(v))}
                      options={[12, 14, 16, 18, 20].map((n) => ({
                        value: n,
                        label: `${n}px`,
                      }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Tamaño de fuente de las estrellas</FieldLabel>
                    <SelectField
                      value={config.tamanoEstrellas}
                      onChange={(v) => updateConfig('tamanoEstrellas', Number(v))}
                      options={[12, 14, 16, 18, 20, 24].map((n) => ({
                        value: n,
                        label: `${n}px`,
                      }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Tamaño de fuente del nombre</FieldLabel>
                    <SelectField
                      value={config.tamanoNombre}
                      onChange={(v) => updateConfig('tamanoNombre', Number(v))}
                      options={[12, 14, 16, 18, 20].map((n) => ({
                        value: n,
                        label: `${n}px`,
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Estilo del nombre de la reseña</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => updateConfig('estiloNombre', 'normal')}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 10,
                        border:
                          config.estiloNombre === 'normal'
                            ? '1.5px solid #10B981'
                            : '1px solid #e5e7eb',
                        background: config.estiloNombre === 'normal' ? '#ecfdf5' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontSize: 14,
                        color: config.estiloNombre === 'normal' ? '#10B981' : '#000000',
                      }}
                    >
                      <span style={{ fontWeight: 400, fontSize: 16 }}>A</span> Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => updateConfig('estiloNombre', 'resaltado')}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 10,
                        border:
                          config.estiloNombre === 'resaltado'
                            ? '1.5px solid #10B981'
                            : '1px solid #e5e7eb',
                        background: config.estiloNombre === 'resaltado' ? '#ecfdf5' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontSize: 14,
                        color: config.estiloNombre === 'resaltado' ? '#10B981' : '#000000',
                      }}
                    >
                      <span style={{ fontWeight: 800, fontSize: 16 }}>A</span> Resaltado
                    </button>
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
