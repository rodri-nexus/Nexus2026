'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SliderVideoPreview from './SliderVideoPreview';

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

interface VideoItem {
  url: string;
  path: string;
  nombre: string;
  tamanoBytes: number;
  productoId: number | null;
  productoData: {
    id: number;
    name: string;
    price: number;
    image?: string;
  } | null;
}

interface ProductoAPI {
  id: number;
  name: string;
  price: string;
  image?: string;
}

const MAX_VIDEOS = 10;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTS = ['mp4', 'mov', 'avi', 'wmv', 'webm'];

const DEFAULT_CONFIG = {
  titulo: '',
  subtitulo: '',
  videos: [] as VideoItem[],
  posicion: 'despues',
  formato: 'slider',
  colorControles: '#000000',
  colorTitulo: '#333333',
  colorFondo: '#fafafa',
  tamanoTitulo: '20px',
  tamanoSubtitulo: '16px',
  alineacion: 'centrado',
  reproduccionAutomatica: false,
  desactivarExpandir: false,
  productosBajoVideo: false,
  radioBordeVideos: 20,
  mostrarPrecio: true,
  mostrarBotonCarrito: true,
  colorBotonFondo: '#000000',
  colorBotonTexto: '#ffffff',
  radioBordeBoton: 8,
};

// Grid responsive común
const GRID_RESPONSIVE_2COL: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 14,
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
      <span
        style={{
          fontWeight: 800,
          fontSize: 22,
          color: '#111827',
          letterSpacing: -0.5,
        }}
      >
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

function IconUploadCloud({ size = 40, color = '#111827' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      <polyline points="12 12 12 18" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  );
}

function IconLayout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
      <rect x="3" y="3" width="7" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="15" width="7" height="6" rx="1" />
    </svg>
  );
}

function IconPalette() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
      <circle cx="13.5" cy="6.5" r="1.5" />
      <circle cx="17.5" cy="10.5" r="1.5" />
      <circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" />
      <path d="M12 2a10 10 0 100 20 1 1 0 001-1v-.5a2 2 0 012-2h1.5a2.5 2.5 0 002.5-2.5A9 9 0 0012 2z" />
    </svg>
  );
}

function IconType() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
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

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.4 }}>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
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

function RadioCard({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      onClick={onChange}
      style={{
        background: '#FFFFFF',
        border: checked ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
        borderRadius: 12,
        padding: 16,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: checked ? '2px solid #2563EB' : '2px solid #D1D5DB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {checked && (
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#2563EB',
              }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {icon}
            {label}
          </div>
          {description && (
            <div style={{ fontSize: 14, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
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
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
      <div
        style={{
          position: 'relative',
          width: 44,
          height: 40,
          borderRadius: 8,
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          background: value,
          flexShrink: 0,
        }}
      >
        <input
          type="color"
          value={value}
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
          minWidth: 0,
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          fontSize: 13,
          color: '#111827',
          background: '#FFFFFF',
          outline: 'none',
          fontFamily: 'monospace',
          boxSizing: 'border-box',
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{title}</div>
          <div
            style={{
              fontSize: 14,
              color: '#6B7280',
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

/* ================= TOOLBAR MARKDOWN ================= */

function MarkdownTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyMarker = (marker: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newText = selected
      ? `${before}${marker}${selected}${marker}${after}`
      : `${before}${marker}${marker}${after}`;

    onChange(newText);

    setTimeout(() => {
      ta.focus();
      const pos = selected
        ? start + marker.length + selected.length + marker.length
        : start + marker.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const btnStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: 14,
    color: '#374151',
    borderRadius: 4,
  };

  return (
    <div
      style={{
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#FFFFFF',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '6px 8px',
          borderBottom: '1px solid #E5E7EB',
          background: '#FAFAFA',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => applyMarker('**')}
          style={{ ...btnStyle, fontWeight: 800 }}
          title="Negrita"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => applyMarker('*')}
          style={{ ...btnStyle, fontStyle: 'italic' }}
          title="Cursiva"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => applyMarker('__')}
          style={{ ...btnStyle, textDecoration: 'underline' }}
          title="Subrayado"
        >
          U
        </button>
        <div style={{ width: 1, height: 18, background: '#E5E7EB', margin: '0 4px' }} />
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>
          Usá **negrita**, *cursiva*, __subrayado__
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: 'none',
          fontSize: 15,
          color: '#111827',
          background: '#FFFFFF',
          outline: 'none',
          boxSizing: 'border-box',
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.5,
        }}
      />
    </div>
  );
}

/* ================= EDITOR ================= */

export default function SliderVideoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = React.useMemo(() => {
    const cfg = { ...DEFAULT_CONFIG, ...(existingWidget?.config || {}) };
    if (!Array.isArray(cfg.videos)) cfg.videos = [];
    return cfg;
  }, [existingWidget]);

  const [config, setConfig] = React.useState<any>(initialConfig);
  const [isActive, setIsActive] = React.useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = React.useState<'general' | 'ubicacion' | 'estilos'>('general');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{
    current: number;
    total: number;
  } | null>(null);
  const [needsSaveFirst, setNeedsSaveFirst] = React.useState(false);
  const [productoSelectorAbierto, setProductoSelectorAbierto] = React.useState<number | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateConfig = (k: string, v: any) => setConfig((c: any) => ({ ...c, [k]: v }));

  const videos: VideoItem[] = Array.isArray(config.videos) ? config.videos : [];

  /* ============ UPLOAD ============ */

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    if (!existingWidget?.id) {
      setNeedsSaveFirst(true);
      return;
    }

    const disponibles = MAX_VIDEOS - videos.length;
    if (disponibles <= 0) {
      setError(`Ya alcanzaste el máximo de ${MAX_VIDEOS} videos.`);
      return;
    }

    const filesArr = Array.from(files).slice(0, disponibles);

    // Validaciones
    for (const file of filesArr) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTS.includes(ext)) {
        setError(`Formato no permitido: ${file.name}. Usá MP4, MOV, AVI, WMV o WEBM.`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`El video "${file.name}" supera los 5MB.`);
        return;
      }
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: filesArr.length });

    const nuevos: VideoItem[] = [];
    try {
      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];
        setUploadProgress({ current: i + 1, total: filesArr.length });

        const formData = new FormData();
        formData.append('widget_id', existingWidget.id);
        formData.append('file', file);

        const res = await fetch('/api/upload-video', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || `Error subiendo ${file.name}`);
        }

        nuevos.push({
          url: data.url,
          path: data.path,
          nombre: data.nombre,
          tamanoBytes: data.tamanoBytes,
          productoId: null,
          productoData: null,
        });
      }

      setConfig((c: any) => ({
        ...c,
        videos: [...(c.videos || []), ...nuevos],
      }));
    } catch (e: any) {
      setError(e.message || 'Error subiendo videos');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeVideo = (idx: number) => {
    setConfig((c: any) => {
      const arr = [...(c.videos || [])];
      arr.splice(idx, 1);
      return { ...c, videos: arr };
    });
  };

  const moveVideo = (idx: number, dir: -1 | 1) => {
    setConfig((c: any) => {
      const arr = [...(c.videos || [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return c;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...c, videos: arr };
    });
  };

  const setProductoEnVideo = (
    idx: number,
    producto: { id: number; name: string; price: number; image?: string } | null
  ) => {
    setConfig((c: any) => {
      const arr = [...(c.videos || [])];
      if (!arr[idx]) return c;
      arr[idx] = {
        ...arr[idx],
        productoId: producto?.id ?? null,
        productoData: producto,
      };
      return { ...c, videos: arr };
    });
  };

  /* ============ SAVE ============ */

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

      // Si fue una creación nueva → banner verde de éxito
      // Si fue una actualización → redirigir sin banner
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
          <div
            style={{
              marginBottom: 16,
              background: '#FFFFFF',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <SliderVideoPreview config={config} />
          </div>

          {/* Aclaraciones */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '10px 4px',
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <IconInfo size={16} color="#6B7280" />
              <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                El widget aparecerá debajo del botón de &quot;Agregar al carrito&quot;.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <IconInfo size={16} color="#6B7280" />
              <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                Los videos en la preview no son funcionales
              </span>
            </div>
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
              const label =
                t === 'general' ? 'General' : t === 'ubicacion' ? 'Ubicación' : 'Estilos';
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

          {/* ============ TAB: GENERAL ============ */}
          {tab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Título del widget</FieldLabel>
                <TextInput
                  value={config.titulo}
                  onChange={(v) => updateConfig('titulo', v)}
                  placeholder="Ej: Mira nuestros productos en acción"
                />
                <FieldHint>Dejar vacío para no mostrar título</FieldHint>
              </div>

              <div>
                <FieldLabel>
                  Subtítulo <span style={{ fontWeight: 400, color: '#6B7280' }}>(opcional)</span>
                </FieldLabel>
                <MarkdownTextarea
                  value={config.subtitulo}
                  onChange={(v) => updateConfig('subtitulo', v)}
                  placeholder=""
                  rows={3}
                />
                <FieldHint>Texto que aparece debajo del título. Dejar vacío para no mostrar.</FieldHint>
              </div>

              {/* Tip azul */}
              <div
                style={{
                  background: '#DBF4F5',
                  border: '1px solid #A5E3E5',
                  borderRadius: 12,
                  padding: 14,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <IconInfo size={18} color="#0E7490" />
                <span style={{ fontSize: 14, color: '#0E7490', lineHeight: 1.5 }}>
                  Recordá comprimir los videos antes de subirlos para mejorar la velocidad de
                  carga y visualización.
                </span>
              </div>

              {/* Contador y videos */}
              <div>
                <FieldLabel>
                  Videos {videos.length}/{MAX_VIDEOS}{' '}
                  <span style={{ fontWeight: 400, color: '#6B7280' }}>
                    (mínimo 1, máximo {MAX_VIDEOS})
                  </span>
                </FieldLabel>

                {/* Lista de videos ya subidos */}
                {videos.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    {videos.map((v, i) => (
                      <VideoRow
                        key={i}
                        video={v}
                        index={i}
                        total={videos.length}
                        onRemove={() => removeVideo(i)}
                        onMove={(dir) => moveVideo(i, dir)}
                        productosBajoVideo={!!config.productosBajoVideo}
                        onOpenSelector={() => setProductoSelectorAbierto(i)}
                        onQuitarProducto={() => setProductoEnVideo(i, null)}
                        selectorAbierto={productoSelectorAbierto === i}
                        onCloseSelector={() => setProductoSelectorAbierto(null)}
                        onSelectProducto={(p) => {
                          setProductoEnVideo(i, p);
                          setProductoSelectorAbierto(null);
                        }}
                        storeId={storeId}
                      />
                    ))}
                  </div>
                )}

                {/* Dropzone */}
                {videos.length < MAX_VIDEOS && (
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!uploading) handleFileSelect(e.dataTransfer.files);
                    }}
                    style={{
                      border: '2px dashed #D1D5DB',
                      borderRadius: 12,
                      padding: '28px 16px',
                      background: '#FAFAFA',
                      textAlign: 'center',
                      cursor: uploading ? 'wait' : 'pointer',
                      opacity: uploading ? 0.7 : 1,
                    }}
                  >
                    <div style={{ marginBottom: 10 }}>
                      <IconUploadCloud size={44} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                      {uploading
                        ? uploadProgress
                          ? `Subiendo video ${uploadProgress.current} de ${uploadProgress.total}…`
                          : 'Subiendo…'
                        : 'Arrastra videos aquí o haz clic para seleccionar'}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: '#6B7280',
                        marginTop: 10,
                        lineHeight: 1.6,
                      }}
                    >
                      Mínimo 1, máximo {MAX_VIDEOS} videos.
                      <br />
                      Recomendado 3 o más
                      <br />
                      Tamaño máximo: 5 MB por video · Formatos: MP4, MOV, AVI, WMV, WEBM
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: '1px solid #E5E7EB',
                        fontSize: 14,
                        color: '#111827',
                        fontWeight: 700,
                      }}
                    >
                      Tips para mejores resultados:
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: '#6B7280',
                        marginTop: 6,
                        lineHeight: 1.6,
                      }}
                    >
                      Resolución recomendada: 480×854 (vertical 9:16)
                      <br />
                      Duración ideal: entre 10 y 20 segundos
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/webm"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files)}
                />

                {needsSaveFirst && (
                  <div
                    style={{
                      background: '#FEF3C7',
                      border: '1px solid #FCD34D',
                      color: '#92400E',
                      padding: 12,
                      borderRadius: 10,
                      fontSize: 13,
                      marginTop: 10,
                      lineHeight: 1.5,
                    }}
                  >
                    Para subir videos primero necesitás crear el widget. Configurá los ajustes
                    básicos y tocá &quot;Crear widget&quot;. Luego volvé a editarlo para cargar
                    los videos.
                  </div>
                )}

                <FieldHint>
                  ¿El video pesa más de 5 MB?{' '}
                  <a
                    href="https://www.veed.io/tools/video-compressor"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Te enseñamos cómo comprimirlo.
                  </a>
                </FieldHint>
              </div>
            </div>
          )}

          {/* ============ TAB: UBICACION ============ */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                Posición del widget
              </div>

              <RadioCard
                checked={config.posicion === 'antes'}
                onChange={() => updateConfig('posicion', 'antes')}
                label="Antes de la descripción"
                description={
                  <>
                    El slider aparece debajo del botón &quot;Agregar al carrito&quot;, dentro de la
                    columna del producto.
                  </>
                }
              />

              <RadioCard
                checked={config.posicion === 'despues'}
                onChange={() => updateConfig('posicion', 'despues')}
                label="Después de la descripción"
                description="Los videos se muestran a ancho completo después de toda la sección del producto, uno al lado del otro."
              />
            </div>
          )}

          {/* ============ TAB: ESTILOS ============ */}
          {tab === 'estilos' && (
            <div>
              <SectionCard
                icon={<IconLayout />}
                title="Diseño del widget"
                description="Elegí cómo se presentan los videos y su estilo de interacción."
              >
                <div>
                  <FieldLabel>Formato de visualización</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => updateConfig('formato', 'slider')}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 10,
                        border:
                          config.formato === 'slider'
                            ? '1.5px solid #2563EB'
                            : '1px solid #E5E7EB',
                        background: config.formato === 'slider' ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: config.formato === 'slider' ? '#2563EB' : '#374151',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="6" width="18" height="12" rx="2" />
                        <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" />
                      </svg>
                      Slider
                    </button>
                    <button
                      type="button"
                      onClick={() => updateConfig('formato', 'circulos')}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 10,
                        border:
                          config.formato === 'circulos'
                            ? '1.5px solid #2563EB'
                            : '1px solid #E5E7EB',
                        background: config.formato === 'circulos' ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: config.formato === 'circulos' ? '#2563EB' : '#374151',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                      Círculos
                    </button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={<IconPalette />}
                title="Colores principales"
                description="Configurá la paleta general del slider, título y fondo."
              >
                <div style={GRID_RESPONSIVE_2COL}>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Color de controles del slider</FieldLabel>
                    <ColorPickerField
                      value={config.colorControles}
                      onChange={(v) => updateConfig('colorControles', v)}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Color del título</FieldLabel>
                    <ColorPickerField
                      value={config.colorTitulo}
                      onChange={(v) => updateConfig('colorTitulo', v)}
                    />
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <FieldLabel>Color de fondo de la sección</FieldLabel>
                  <ColorPickerField
                    value={config.colorFondo}
                    onChange={(v) => updateConfig('colorFondo', v)}
                  />
                  <FieldHint>Solo con posición &quot;Después de la descripción&quot;</FieldHint>
                </div>
              </SectionCard>

              <SectionCard
                icon={<IconType />}
                title="Tipografías"
                description="Ajustá los tamaños del título y del subtítulo."
              >
                <div style={GRID_RESPONSIVE_2COL}>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Tamaño del título</FieldLabel>
                    <SelectField
                      value={config.tamanoTitulo}
                      onChange={(v) => updateConfig('tamanoTitulo', v)}
                      options={['14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px'].map(
                        (v) => ({ value: v, label: v })
                      )}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Tamaño del subtítulo</FieldLabel>
                    <SelectField
                      value={config.tamanoSubtitulo}
                      onChange={(v) => updateConfig('tamanoSubtitulo', v)}
                      options={['12px', '14px', '16px', '18px', '20px'].map((v) => ({
                        value: v,
                        label: v,
                      }))}
                    />
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <FieldLabel>Alineación del título y subtítulo</FieldLabel>
                  <SelectField
                    value={config.alineacion}
                    onChange={(v) => updateConfig('alineacion', v)}
                    options={[
                      { value: 'izquierda', label: 'Izquierda' },
                      { value: 'centrado', label: 'Centrado' },
                      { value: 'derecha', label: 'Derecha' },
                    ]}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={<IconSliders />}
                title="Comportamiento y estructura"
                description="Ajustá reproducción, productos inline y bordes de video."
              >
                <div style={GRID_RESPONSIVE_2COL}>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Reproducción automática</FieldLabel>
                    <SelectField
                      value={config.reproduccionAutomatica ? 'si' : 'no'}
                      onChange={(v) => updateConfig('reproduccionAutomatica', v === 'si')}
                      options={[
                        { value: 'no', label: 'No' },
                        { value: 'si', label: 'Sí' },
                      ]}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Desactivar expandir video</FieldLabel>
                    <SelectField
                      value={config.desactivarExpandir ? 'si' : 'no'}
                      onChange={(v) => updateConfig('desactivarExpandir', v === 'si')}
                      options={[
                        { value: 'no', label: 'No (mostrar en modal)' },
                        { value: 'si', label: 'Sí (reproducir inline)' },
                      ]}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Productos bajo el video</FieldLabel>
                    <SelectField
                      value={config.productosBajoVideo ? 'si' : 'no'}
                      onChange={(v) => updateConfig('productosBajoVideo', v === 'si')}
                      options={[
                        { value: 'no', label: 'No mostrar' },
                        { value: 'si', label: 'Mostrar' },
                      ]}
                    />
                    <FieldHint>Solo con posición &quot;Después de la descripción&quot;</FieldHint>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Radio de borde de los videos</FieldLabel>
                    <SelectField
                      value={String(config.radioBordeVideos)}
                      onChange={(v) => updateConfig('radioBordeVideos', Number(v))}
                      options={['0', '4', '8', '12', '16', '20', '24', '32'].map((v) => ({
                        value: v,
                        label: `${v}px`,
                      }))}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Precio de productos</FieldLabel>
                    <SelectField
                      value={config.mostrarPrecio ? 'si' : 'no'}
                      onChange={(v) => updateConfig('mostrarPrecio', v === 'si')}
                      options={[
                        { value: 'si', label: 'Mostrar' },
                        { value: 'no', label: 'Ocultar' },
                      ]}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Botón agregar al carrito</FieldLabel>
                    <SelectField
                      value={config.mostrarBotonCarrito ? 'si' : 'no'}
                      onChange={(v) => updateConfig('mostrarBotonCarrito', v === 'si')}
                      options={[
                        { value: 'si', label: 'Mostrar' },
                        { value: 'no', label: 'Ocultar' },
                      ]}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={<IconSend />}
                title="Botón de acción"
                description="Definí colores y redondeado del botón asociado a cada video."
              >
                <div style={GRID_RESPONSIVE_2COL}>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Color de fondo</FieldLabel>
                    <ColorPickerField
                      value={config.colorBotonFondo}
                      onChange={(v) => updateConfig('colorBotonFondo', v)}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Color del texto</FieldLabel>
                    <ColorPickerField
                      value={config.colorBotonTexto}
                      onChange={(v) => updateConfig('colorBotonTexto', v)}
                    />
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <FieldLabel>Radio de borde del botón ({config.radioBordeBoton}px)</FieldLabel>
                  <RangeSlider
                    value={config.radioBordeBoton}
                    onChange={(v) => updateConfig('radioBordeBoton', v)}
                    min={0}
                    max={25}
                    marks={[0, 8, 25]}
                  />
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
          <button
            type="button"
            onClick={() => setError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#991B1B',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: 10,
              float: 'right',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= VIDEO ROW ================= */

function VideoRow({
  video,
  index,
  total,
  onRemove,
  onMove,
  productosBajoVideo,
  onOpenSelector,
  onQuitarProducto,
  selectorAbierto,
  onCloseSelector,
  onSelectProducto,
  storeId,
}: {
  video: VideoItem;
  index: number;
  total: number;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  productosBajoVideo: boolean;
  onOpenSelector: () => void;
  onQuitarProducto: () => void;
  selectorAbierto: boolean;
  onCloseSelector: () => void;
  onSelectProducto: (p: { id: number; name: string; price: number; image?: string }) => void;
  storeId: string;
}) {
  const sizeMB = (video.tamanoBytes / (1024 * 1024)).toFixed(2);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Thumb */}
        <div
          style={{
            width: 56,
            height: 80,
            borderRadius: 8,
            overflow: 'hidden',
            background: '#111827',
            flexShrink: 0,
          }}
        >
          <video
            src={video.url}
            preload="metadata"
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#111827',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Video {index + 1}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#6B7280',
              marginTop: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {video.nombre} · {sizeMB} MB
          </div>
        </div>

        {/* Reorder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            style={{
              background: '#F3F4F6',
              border: 'none',
              borderRadius: 6,
              width: 28,
              height: 22,
              cursor: index === 0 ? 'not-allowed' : 'pointer',
              opacity: index === 0 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Subir"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="3">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            style={{
              background: '#F3F4F6',
              border: 'none',
              borderRadius: 6,
              width: 28,
              height: 22,
              cursor: index === total - 1 ? 'not-allowed' : 'pointer',
              opacity: index === total - 1 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Bajar"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="3">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={onRemove}
          style={{
            background: '#FEE2E2',
            color: '#991B1B',
            border: 'none',
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Eliminar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </div>

      {/* Producto asociado */}
      {productosBajoVideo && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px dashed #E5E7EB',
          }}
        >
          {video.productoData ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {video.productoData.image ? (
                <img
                  src={video.productoData.image}
                  alt={video.productoData.name}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: '#F3F4F6',
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111827',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {video.productoData.name}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  ${video.productoData.price}
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenSelector}
                style={{
                  background: 'transparent',
                  border: '1px solid #E5E7EB',
                  color: '#374151',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={onQuitarProducto}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 4px',
                }}
              >
                Quitar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSelector}
              style={{
                background: '#FFFFFF',
                border: '1px dashed #D1D5DB',
                color: '#2563EB',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              + Asociar producto a este video
            </button>
          )}

          {selectorAbierto && (
            <ProductoSelectorInline
              storeId={storeId}
              onClose={onCloseSelector}
              onSelect={onSelectProducto}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ================= PRODUCTO SELECTOR INLINE ================= */

function ProductoSelectorInline({
  storeId,
  onClose,
  onSelect,
}: {
  storeId: string;
  onClose: () => void;
  onSelect: (p: { id: number; name: string; price: number; image?: string }) => void;
}) {
  const [search, setSearch] = React.useState('');
  const [productos, setProductos] = React.useState<ProductoAPI[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorLoad, setErrorLoad] = React.useState<string | null>(null);

  const cargar = React.useCallback(async () => {
    setLoading(true);
    setErrorLoad(null);
    try {
      const res = await fetch(
        `/api/products?storeId=${storeId}&q=${encodeURIComponent(search)}`
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Respuesta inválida');
      setProductos(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.variants?.[0]?.price || '0',
          image: p.images?.[0]?.src,
        }))
      );
    } catch (e: any) {
      setErrorLoad(e.message || 'Error cargando productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, search]);

  React.useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        marginTop: 10,
        background: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        padding: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
          Seleccionar producto
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#6B7280',
            fontSize: 20,
            cursor: 'pointer',
            padding: 2,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              cargar();
            }
          }}
          placeholder="Buscar producto…"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '8px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 13,
            outline: 'none',
            background: '#FFFFFF',
          }}
        />
        <button
          type="button"
          onClick={cargar}
          style={{
            background: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Buscar
        </button>
      </div>

      <div
        style={{
          maxHeight: 220,
          overflowY: 'auto',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
        }}
      >
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
            Cargando productos…
          </div>
        ) : errorLoad ? (
          <div style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#DC2626' }}>
            {errorLoad}
          </div>
        ) : productos.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
            No se encontraron productos
          </div>
        ) : (
          productos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                onSelect({
                  id: p.id,
                  name: p.name,
                  price: parseFloat(p.price) || 0,
                  image: p.image,
                })
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                border: 'none',
                borderBottom: '1px solid #F3F4F6',
                background: '#FFFFFF',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: '#F3F4F6',
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111827',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>${p.price}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
      }
