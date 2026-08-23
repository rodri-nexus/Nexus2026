'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ColorPicker,
  Slider,
  FieldInput,
  FieldSelect,
} from './EditorFields';
import EditorTabs from './EditorTabs';
import MensajeGarantiaPreview from './MensajeGarantiaPreview';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface WidgetDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExistingWidget {
  id: string;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface Props {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface MensajeGarantiaConfig {
  titulo: string;
  texto: string;
  imagenBase64: string;
  colorFondo: string;
  colorTitulo: string;
  colorTexto: string;
  colorBorde: string;
  tamanoTitulo: string;
  tamanoTexto: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: MensajeGarantiaConfig = {
  titulo: '🛡️ Garantía de 60 días',
  texto:
    'Confiamos en los resultados del producto. Si no te gusta podés devolverlo y te reintegramos el total de tu compra.',
  imagenBase64: '',
  colorFondo: '#fff9f3',
  colorTitulo: '#000000',
  colorTexto: '#333333',
  colorBorde: '#e7decf',
  tamanoTitulo: '16px',
  tamanoTexto: '16px',
  bordesRedondeados: 5,
  paddingInterno: 20,
};

const TAMANO_OPTIONS = [
  { value: '12px', label: '12px' },
  { value: '13px', label: '13px' },
  { value: '14px', label: '14px' },
  { value: '15px', label: '15px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '22px', label: '22px' },
  { value: '24px', label: '24px' },
  { value: '28px', label: '28px' },
  { value: '32px', label: '32px' },
];

/* ═══════════════════════════════════════════
   COMPONENTE: SECTION CARD
═══════════════════════════════════════════ */
function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, color: '#10B981' }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, lineHeight: 1.4 }}>{description}</div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE: RICH TEXT AREA
═══════════════════════════════════════════ */
function RichTextArea({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newValue =
      value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertList = () => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    let newBlock: string;
    if (selected.trim() === '') {
      newBlock = '- ';
    } else {
      newBlock = selected
        .split('\n')
        .map((l) => (l.trim() ? `- ${l.replace(/^-\s*/, '')}` : l))
        .join('\n');
    }
    const newValue = value.substring(0, start) + newBlock + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start, start + newBlock.length);
    }, 0);
  };

  const btnStyle: React.CSSProperties = {
    width: 40,
    height: 36,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: '#000000',
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div
        style={{
          border: '1.5px solid #e5e7eb',
          borderRadius: 10,
          background: '#fafafa',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: 8,
            borderBottom: '1px solid #e5e7eb',
            background: '#ffffff',
          }}
        >
          <button
            type="button"
            title="Negrita"
            onClick={() => wrapSelection('**', '**')}
            style={{ ...btnStyle, fontWeight: 900 }}
          >
            B
          </button>
          <button
            type="button"
            title="Cursiva"
            onClick={() => wrapSelection('*', '*')}
            style={{ ...btnStyle, fontStyle: 'italic' }}
          >
            I
          </button>
          <button
            type="button"
            title="Subrayado"
            onClick={() => wrapSelection('__', '__')}
            style={{ ...btnStyle, textDecoration: 'underline' }}
          >
            U
          </button>
          <button type="button" title="Lista" onClick={insertList} style={btnStyle}>
            ☰
          </button>
        </div>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: 'none',
            fontSize: 14,
            color: '#000000',
            background: '#fafafa',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            display: 'block',
          }}
        />
      </div>
      {description && (
        <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 6 }}>{description}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE: IMAGE UPLOADER
═══════════════════════════════════════════ */
function ImageUploader({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (base64: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_BYTES = 3 * 1024 * 1024;
  const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFile = (file: File) => {
    setError(null);
    if (!VALID_TYPES.includes(file.type)) {
      setError('Formato no válido. Usá JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('La imagen supera los 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: '#000000',
          marginBottom: 8,
        }}
      >
        {label}
      </label>

      {value ? (
        <div
          style={{
            border: '1.5px solid #e5e7eb',
            borderRadius: 12,
            padding: 12,
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <img
            src={value}
            alt="preview"
            style={{
              width: 64,
              height: 64,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, fontSize: 12, color: '#000000', opacity: 0.6 }}>
            Imagen cargada correctamente
          </div>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              padding: '8px 14px',
              background: '#fee2e2',
              color: '#b91c1c',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Eliminar
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? '#10B981' : '#e5e7eb'}`,
            borderRadius: 12,
            padding: '28px 20px',
            background: dragOver ? '#ecfdf5' : '#fafafa',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8, color: '#000000', opacity: 0.4 }}>⬆️</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#000000', marginBottom: 4 }}>
            Arrastrá una imagen o hacé clic para subir
          </div>
          <div style={{ fontSize: 12, color: '#000000', opacity: 0.6 }}>JPG, PNG, WEBP (máx. 3MB)</div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        style={{ display: 'none' }}
      />

      {error && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 12px',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {description && !error && (
        <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 6 }}>{description}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MensajeGarantiaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<MensajeGarantiaConfig>(() => {
    if (existingWidget?.config) {
      return { ...DEFAULT_CONFIG, ...existingWidget.config };
    }
    return DEFAULT_CONFIG;
  });
  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof MensajeGarantiaConfig>(
    key: K,
    val: MensajeGarantiaConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
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
        throw new Error(data?.error || 'Error al guardar el widget');
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
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Error inesperado al guardar');
    } finally {
      setSaving(false);
    }
  };

  /* ─── TAB GENERAL ─── */
  const tabGeneral = (
    <div>
      <FieldInput
        label="Título (opcional)"
        value={config.titulo}
        placeholder="🛡️ Garantía de 60 días"
        onChange={(v) => updateCfg('titulo', v)}
      />
      <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: -10, marginBottom: 16 }}>
        Título principal del mensaje de garantía
      </div>

      <RichTextArea
        label="Texto (opcional)"
        description="Descripción detallada de la garantía"
        value={config.texto}
        onChange={(v) => updateCfg('texto', v)}
      />

      <ImageUploader
        label="Imagen (opcional)"
        description="Aparecerá a la izquierda del texto"
        value={config.imagenBase64}
        onChange={(v) => updateCfg('imagenBase64', v)}
      />
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores principales"
        description="Personalizá los colores de fondo, título, texto y borde."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
          }}
        >
          <ColorPicker
            label="Color de fondo"
            value={config.colorFondo}
            onChange={(v) => updateCfg('colorFondo', v)}
          />
          <ColorPicker
            label="Color del título"
            value={config.colorTitulo}
            onChange={(v) => updateCfg('colorTitulo', v)}
          />
          <ColorPicker
            label="Color del texto"
            value={config.colorTexto}
            onChange={(v) => updateCfg('colorTexto', v)}
          />
          <ColorPicker
            label="Color del borde"
            value={config.colorBorde}
            onChange={(v) => updateCfg('colorBorde', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🇹"
        title="Tipografías"
        description="Ajustá el tamaño de fuente del título y del texto."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
          }}
        >
          <FieldSelect
            label="Tamaño del título"
            value={config.tamanoTitulo}
            options={TAMANO_OPTIONS}
            onChange={(v) => updateCfg('tamanoTitulo', v)}
          />
          <FieldSelect
            label="Tamaño del texto"
            value={config.tamanoTexto}
            options={TAMANO_OPTIONS}
            onChange={(v) => updateCfg('tamanoTexto', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Comportamiento y diseño"
        description="Bordes redondeados y margen interno del widget."
      >
        <Slider
          label="Bordes redondeados"
          value={config.bordesRedondeados}
          min={0}
          max={25}
          onChange={(v) => updateCfg('bordesRedondeados', v)}
        />
        <Slider
          label="Margen interno (padding)"
          value={config.paddingInterno}
          min={0}
          max={40}
          onChange={(v) => updateCfg('paddingInterno', v)}
        />
      </SectionCard>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M3 9l1-5h16l1 5" />
              <path d="M4 9v11a1 1 0 001 1h14a1 1 0 001-1V9" />
              <path d="M9 21V13h6v8" />
            </svg>
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
          {widgetDefinition.name} ({targetType === 'all' ? 'General' : 'Producto'})
        </h1>

        {/* PREVIEW */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            padding: 20,
            marginBottom: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <MensajeGarantiaPreview config={config} />
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid #f1f3f5',
              fontSize: 12,
              color: '#000000',
              opacity: 0.6,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <span style={{ color: '#10B981', flexShrink: 0 }}>ⓘ</span>
            <span>
              El mensaje aparecerá debajo del botón &quot;Agregar al carrito&quot;.
            </span>
          </div>
        </div>

        {/* TABS Y CONFIGURACION */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            padding: 20,
            marginTop: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <EditorTabs
            tabs={[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'estilos', label: 'Estilos', icon: '🎨' },
            ]}
          >
            {[tabGeneral, tabEstilos]}
          </EditorTabs>

          {/* FOOTER: Toggle + botón guardar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #f1f3f5',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? '#10B981' : '#e5e7eb',
                  position: 'relative',
                  flexShrink: 0,
                  outline: 'none',
                  transition: 'background 0.25s ease',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: isActive ? 24 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#ffffff',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                Widget activo
              </span>
              <span
                title="Si está inactivo, el widget no se mostrará en la tienda"
                style={{ fontSize: 14, color: '#000000', opacity: 0.5, cursor: 'help' }}
              >
                ⓘ
              </span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                background: saving ? '#e5e7eb' : '#10B981',
                color: saving ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {saving
                ? 'Guardando...'
                : existingWidget
                ? 'Guardar cambios'
                : 'Crear widget'}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
  }
