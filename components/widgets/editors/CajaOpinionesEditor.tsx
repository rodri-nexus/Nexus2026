'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CajaOpinionesPreview from './CajaOpinionesPreview';
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

interface Opinion {
  nombre: string;
  estrellas: number;
  texto: string;
  foto: string;
  compraVerificada: boolean;
}

const DEFAULT_OPINION: Opinion = {
  nombre: '',
  estrellas: 5,
  texto: '',
  foto: '',
  compraVerificada: false,
};

const DEFAULT_CONFIG = {
  opiniones: [{ ...DEFAULT_OPINION }] as Opinion[],
  colorFondo: '#f7f7f7',
  colorTexto: '#333333',
  colorEstrellas: '#f5b301',
  mostrarBorde: false,
  colorBorde: '#cccccc',
  fuenteNombre: 16,
  fuenteOpinion: 15,
  bordeRedondeado: 10,
  padding: 20,
  tamanoAvatar: 44,
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

function IconInfo({ size = 14, color = '#FF0000' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function VerifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000" style={{ flexShrink: 0 }}>
      <path d="M12 2l2.09 2.26L17 4l.74 2.91L20 8l-1.26 2.5L20 13l-2.26 1.09L17 17l-2.91-.74L12 18l-2.5-1.26L7 17l-.74-2.91L4 13l1.26-2.5L4 8l2.26-1.09L7 4l2.91.74L12 2z" />
      <path
        d="M9 12l2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function FieldSubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, color: '#000000', marginBottom: 6 }}>
      {children}
    </div>
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
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        fontSize: 15,
        color: '#000000',
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
      }}
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
        style={{ width: 18, height: 18, accentColor: '#FF0000', cursor: 'pointer' }}
      />
      {icon}
      <span style={{ fontSize: 15, color: '#000000', lineHeight: 1.4 }}>{label}</span>
    </label>
  );
}

function ColorPickerField({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>
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
          disabled={disabled}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            padding: 0,
            background: 'transparent',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          flex: 1,
          padding: '12px 14px',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          fontSize: 15,
          color: '#000000',
          background: '#FFFFFF',
          outline: 'none',
        }}
      />
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
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? '#FF0000' : '#e5e7eb',
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
      {label && <span style={{ fontSize: 15, color: '#000000' }}>{label}</span>}
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
        style={{ width: '100%', accentColor: '#FF0000' }}
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
          <div style={{ fontSize: 16, fontWeight: 700, color: '#000000', textAlign: 'left' }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#000000',
              opacity: 0.6,
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

/* ================= DROPZONE FOTO ================= */

function PhotoDropzone({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.match(/image\/(jpeg|png|gif|jpg)/)) {
      setError('Formato inválido. Usá JPG, PNG o GIF.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen supera los 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') onChange(result);
    };
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div
        style={{
          border: '2px dashed #e5e7eb',
          borderRadius: 10,
          padding: 12,
          background: '#FAFAFA',
          textAlign: 'center',
        }}
      >
        <img
          src={value}
          alt="Preview"
          style={{
            maxWidth: '100%',
            maxHeight: 180,
            borderRadius: 8,
            display: 'block',
            margin: '0 auto',
          }}
        />
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            marginTop: 10,
            background: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quitar imagen
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        style={{
          border: '2px dashed #e5e7eb',
          borderRadius: 10,
          padding: '28px 16px',
          background: '#FFFFFF',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="1.5"
          style={{ margin: '0 auto 10px', display: 'block' }}
        >
          <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
          <polyline points="12 12 12 18" />
          <polyline points="9 15 12 12 15 15" />
        </svg>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
          Haz clic o arrastra una imagen aquí
        </div>
        <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6 }}>
          JPG, PNG, GIF - Máximo 2MB
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/jpg"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && (
        <div style={{ fontSize: 13, color: '#DC2626', marginTop: 6 }}>{error}</div>
      )}
    </div>
  );
}

/* ================= EDITOR ================= */

export default function CajaOpinionesEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = React.useMemo(() => {
    const cfg = { ...DEFAULT_CONFIG, ...(existingWidget?.config || {}) };
    if (!Array.isArray(cfg.opiniones) || cfg.opiniones.length === 0) {
      cfg.opiniones = [{ ...DEFAULT_OPINION }];
    } else {
      cfg.opiniones = cfg.opiniones.map((o: any) => ({
        nombre: o.nombre || '',
        estrellas: Number(o.estrellas) || 5,
        texto: o.texto || '',
        foto: o.foto || '',
        compraVerificada: o.compraVerificada === true,
      }));
    }
    return cfg;
  }, [existingWidget]);

  const [config, setConfig] = React.useState(initialConfig);
  const [isActive, setIsActive] = React.useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = React.useState<'general' | 'estilo'>('general');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateConfig = (k: string, v: any) => setConfig((c: any) => ({ ...c, [k]: v }));

  const updateOpinion = (idx: number, k: keyof Opinion, v: any) => {
    setConfig((c: any) => {
      const arr = [...c.opiniones];
      arr[idx] = { ...arr[idx], [k]: v };
      return { ...c, opiniones: arr };
    });
  };

  const addOpinion = () => {
    setConfig((c: any) => {
      if (c.opiniones.length >= 5) return c;
      return { ...c, opiniones: [...c.opiniones, { ...DEFAULT_OPINION }] };
    });
  };

  const removeOpinion = (idx: number) => {
    setConfig((c: any) => {
      if (c.opiniones.length <= 1) return c;
      const arr = c.opiniones.filter((_: any, i: number) => i !== idx);
      return { ...c, opiniones: arr };
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
              background: '#FF0000',
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
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 16,
          }}
        >
          {/* PREVIEW */}
          <div style={{ marginBottom: 20 }}>
            <CajaOpinionesPreview config={config} />
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
            {(['general', 'estilo'] as const).map((t) => {
              const label = t === 'general' ? 'General' : 'Estilo';
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
                    borderBottom: active ? '2px solid #FF0000' : '2px solid transparent',
                    padding: '14px 10px',
                    fontSize: 15,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#000000' : '#000000',
                    opacity: active ? 1 : 0.6,
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#000000' }}>
                Opiniones (mínimo 1, máximo 5)
              </div>

              {config.opiniones.map((o: Opinion, i: number) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
                      Opinión {i + 1}
                    </div>
                    {config.opiniones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOpinion(i)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#DC2626',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '4px 8px',
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div>
                    <FieldSubLabel>Nombre</FieldSubLabel>
                    <TextInput
                      value={o.nombre}
                      onChange={(v) => updateOpinion(i, 'nombre', v)}
                      placeholder="Ej: Juan P."
                    />
                  </div>

                  <div>
                    <FieldSubLabel>Estrellas</FieldSubLabel>
                    <SelectField
                      value={o.estrellas}
                      onChange={(v) => updateOpinion(i, 'estrellas', Number(v))}
                      options={[
                        { value: 1, label: '★☆☆☆☆ (1 estrella)' },
                        { value: 2, label: '★★☆☆☆ (2 estrellas)' },
                        { value: 3, label: '★★★☆☆ (3 estrellas)' },
                        { value: 4, label: '★★★★☆ (4 estrellas)' },
                        { value: 5, label: '★★★★★ (5 estrellas)' },
                      ]}
                    />
                  </div>

                  <div>
                    <FieldSubLabel>Opinión</FieldSubLabel>
                    <TextArea
                      value={o.texto}
                      onChange={(v) => updateOpinion(i, 'texto', v)}
                      placeholder="Escribe la opinión del cliente..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <FieldSubLabel>Foto (opcional)</FieldSubLabel>
                    <PhotoDropzone
                      value={o.foto}
                      onChange={(v) => updateOpinion(i, 'foto', v)}
                    />
                  </div>

                  <CheckboxSimple
                    checked={o.compraVerificada}
                    onChange={(v) => updateOpinion(i, 'compraVerificada', v)}
                    label="Compra verificada"
                    icon={<VerifiedBadge size={18} />}
                  />
                </div>
              ))}

              {config.opiniones.length < 5 && (
                <div>
                  <button
                    type="button"
                    onClick={addOpinion}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #FF0000',
                      color: '#FF0000',
                      borderRadius: 999,
                      padding: '12px 20px',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    + Agregar otra opinión
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB ESTILO */}
          {tab === 'estilo' && (
            <div>
              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
                    <circle cx="13.5" cy="6.5" r="1.5" />
                    <circle cx="17.5" cy="10.5" r="1.5" />
                    <circle cx="8.5" cy="7.5" r="1.5" />
                    <circle cx="6.5" cy="12.5" r="1.5" />
                    <path d="M12 2a10 10 0 100 20 1 1 0 001-1v-.5a2 2 0 012-2h1.5a2.5 2.5 0 002.5-2.5A9 9 0 0012 2z" />
                  </svg>
                }
                title="Colores principales"
                description="Personalizá los colores de fondo, texto, estrellas y borde de la caja."
              >
                <div>
                  <FieldLabel>Color de fondo</FieldLabel>
                  <ColorPickerField
                    value={config.colorFondo}
                    onChange={(v) => updateConfig('colorFondo', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color del texto</FieldLabel>
                  <ColorPickerField
                    value={config.colorTexto}
                    onChange={(v) => updateConfig('colorTexto', v)}
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
                  <FieldLabel>Borde</FieldLabel>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ToggleField
                      checked={config.mostrarBorde}
                      onChange={(v) => updateConfig('mostrarBorde', v)}
                    />
                    <div style={{ flex: 1 }}>
                      <ColorPickerField
                        value={config.colorBorde}
                        onChange={(v) => updateConfig('colorBorde', v)}
                        disabled={!config.mostrarBorde}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a7 7 0 0114 0v1" />
                  </svg>
                }
                title="Avatar"
                description="Ajustá el tamaño del avatar circular que aparece a la izquierda de cada opinión. Si el usuario no cargó foto, se muestra la inicial del nombre."
              >
                <div>
                  <FieldLabel>Tamaño del avatar ({config.tamanoAvatar}px)</FieldLabel>
                  <RangeSlider
                    value={config.tamanoAvatar}
                    onChange={(v) => updateConfig('tamanoAvatar', v)}
                    min={32}
                    max={64}
                    marks={[32, 44, 64]}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                }
                title="Tipografías"
                description="Ajustá el tamaño de fuente del nombre y de la opinión."
              >
                <div>
                  <FieldLabel>Tamaño de fuente del nombre</FieldLabel>
                  <SelectField
                    value={config.fuenteNombre}
                    onChange={(v) => updateConfig('fuenteNombre', Number(v))}
                    options={[12, 14, 16, 18, 20, 24].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
                <div>
                  <FieldLabel>Tamaño de fuente de opinión</FieldLabel>
                  <SelectField
                    value={config.fuenteOpinion}
                    onChange={(v) => updateConfig('fuenteOpinion', Number(v))}
                    options={[12, 13, 14, 15, 16, 18, 20].map((n) => ({
                      value: n,
                      label: `${n}px`,
                    }))}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <circle cx="8" cy="6" r="2" fill="#FF0000" />
                    <circle cx="16" cy="12" r="2" fill="#FF0000" />
                    <circle cx="10" cy="18" r="2" fill="#FF0000" />
                  </svg>
                }
                title="Diseño"
                description="Configurá el borde redondeado y el margen interno de la caja."
              >
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <FieldLabel>Borde redondeado de la caja</FieldLabel>
                    <RangeSlider
                      value={config.bordeRedondeado}
                      onChange={(v) => updateConfig('bordeRedondeado', v)}
                      min={0}
                      max={25}
                      marks={[0, 10, 25]}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <FieldLabel>Margen interno (padding)</FieldLabel>
                    <RangeSlider
                      value={config.padding}
                      onChange={(v) => updateConfig('padding', v)}
                      min={0}
                      max={40}
                      marks={[0, 20, 40]}
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
                background: '#FF0000',
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
