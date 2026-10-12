'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES
═══════════════════════════════════════════ */
interface WidgetDef {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExWidget {
  id: string | number;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
  target_category_id?: string | number | null;
}

interface ProbadorVirtualEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface ProbadorVirtualConfig {
  texto_boton: string;
  titulo_modal: string;
  mostrar_icono_percha: boolean;
  imagen_producto: string;
  usar_imagen_producto: boolean;
  habilitar_camara: boolean;
  habilitar_subir_imagen: boolean;
  habilitar_rotar: boolean;
  habilitar_descargar: boolean;
  habilitar_resetear: boolean;
  mostrar_instrucciones: boolean;
  texto_instrucciones: string;
  ubicacion: string;
  tipo_fondo: string;
  color_fondo: string;
  color_fondo_2: string;
  color_texto_boton: string;
  color_fondo_modal: string;
  color_texto_modal: string;
  color_acento: string;
  tamano_texto_boton: number;
  borde_boton: number;
  padding_boton: number;
  margin_top: number;
  margin_bottom: number;
  campaignTheme?: string;
}

const defaultConfig: ProbadorVirtualConfig = {
  texto_boton: 'Probador virtual',
  titulo_modal: 'Probador Virtual',
  mostrar_icono_percha: true,
  imagen_producto: '',
  usar_imagen_producto: true,
  habilitar_camara: true,
  habilitar_subir_imagen: true,
  habilitar_rotar: true,
  habilitar_descargar: true,
  habilitar_resetear: true,
  mostrar_instrucciones: true,
  texto_instrucciones: 'Usá los controles para mover, agrandar o rotar la imagen hasta encontrar tu ajuste ideal.',
  ubicacion: 'debajo_precio',
  tipo_fondo: 'solido',
  color_fondo: '#111827',
  color_fondo_2: '#374151',
  color_texto_boton: '#ffffff',
  color_fondo_modal: '#ffffff',
  color_texto_modal: '#111827',
  color_acento: '#10B981',
  tamano_texto_boton: 14,
  borde_boton: 25,
  padding_boton: 12,
  margin_top: 10,
  margin_bottom: 15,
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + texto blanco e iconos dorados.' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul oscuro + borde neón.' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Estilo cibernético de alto impacto.' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde festivo + acentos rojos.' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Fondo rosado suave.' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Índigo premium.' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí llamativo.' },
];

const PRESETS_DATA: Record<string, Partial<ProbadorVirtualConfig>> = {
  'black-friday': {
    color_fondo: '#111827', color_fondo_2: '#1f2937', color_texto_boton: '#ffffff',
    color_fondo_modal: '#111827', color_texto_modal: '#ffffff', color_acento: '#F59E0B', tipo_fondo: 'degrade',
  },
  'hot-sale': {
    color_fondo: '#0F172A', color_fondo_2: '#1E3A8A', color_texto_boton: '#ffffff',
    color_fondo_modal: '#0F172A', color_texto_modal: '#ffffff', color_acento: '#3B82F6', tipo_fondo: 'degrade',
  },
  'cyber-monday': {
    color_fondo: '#090D16', color_fondo_2: '#0F172A', color_texto_boton: '#ffffff',
    color_fondo_modal: '#090D16', color_texto_modal: '#ffffff', color_acento: '#10B981', tipo_fondo: 'degrade',
  },
  'navidad': {
    color_fondo: '#064E3B', color_fondo_2: '#065F46', color_texto_boton: '#ffffff',
    color_fondo_modal: '#064E3B', color_texto_modal: '#ffffff', color_acento: '#EF4444', tipo_fondo: 'degrade',
  },
  'san-valentin': {
    color_fondo: '#F43F5E', color_fondo_2: '#EC4899', color_texto_boton: '#ffffff',
    color_fondo_modal: '#fdf2f8', color_texto_modal: '#831843', color_acento: '#F43F5E', tipo_fondo: 'degrade',
  },
  'dia-padre-madre': {
    color_fondo: '#312E81', color_fondo_2: '#4338CA', color_texto_boton: '#ffffff',
    color_fondo_modal: '#312E81', color_texto_modal: '#ffffff', color_acento: '#10B981', tipo_fondo: 'degrade',
  },
  'liquidacion': {
    color_fondo: '#7F1D1D', color_fondo_2: '#B91C1C', color_texto_boton: '#ffffff',
    color_fondo_modal: '#7F1D1D', color_texto_modal: '#ffffff', color_acento: '#FBBF24', tipo_fondo: 'degrade',
  },
};

/* ═══════════════════════════════════════════
   SUBCOMPONENTES AUXILIARES
═══════════════════════════════════════════ */
function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
      <line x1="2" y1="7" x2="22" y2="7"/>
      <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
      <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
      {children}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, maxLength }: { value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 14,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function TextAreaInput({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 14,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 48, height: 26, borderRadius: 999,
        background: checked ? '#10B981' : '#e5e7eb',
        border: 'none', cursor: 'pointer', padding: 3,
        display: 'flex', alignItems: 'center',
        transition: 'background-color 0.2s', flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20, height: 20, borderRadius: '50%',
          background: '#ffffff',
          transform: checked ? 'translateX(22px)' : 'translateX(0px)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '12px 14px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{label}</div>
        {description ? (
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 1.3 }}>{description}</div>
        ) : null}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

function ColorPickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#ffffff';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div onClick={handleClick} style={{ width: 38, height: 38, borderRadius: 8, background: value, border: '1.5px solid #e5e7eb', cursor: 'pointer', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v.startsWith('#') ? v : '#' + v);
        }}
        style={{ flex: 1, minWidth: 0, padding: '9px 10px', fontSize: 13, border: '1.5px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#000', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
      />
    </div>
  );
}

/* Subida de imagen desde galería con aviso de coincidencia de producto */
function ImagePickerField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg('La imagen supera los 3MB. Elegí una más liviana.');
      return;
    }

    const okTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/jpg'];
    if (okTypes.indexOf(file.type) === -1) {
      setErrorMsg('Formato no soportado. Usá PNG, WEBP o JPG.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const isPng = file.type === 'image/png' || file.type === 'image/webp';
          const compressedBase64 = isPng
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedBase64);
        }
        setLoading(false);
      };
      img.onerror = () => {
        setErrorMsg('No se pudo leer la imagen.');
        setLoading(false);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.onerror = () => {
      setErrorMsg('Error al leer el archivo.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <FieldLabel required={required}>{label}</FieldLabel>

      {/* Cartel de aviso importante para el comerciante */}
      <div style={{
        background: '#fffbe3', border: '1.5px solid #fde047',
        borderRadius: 12, padding: '12px 14px', marginBottom: 14,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>⚠️</span>
        <div style={{ fontSize: 13, color: '#713f12', lineHeight: 1.45 }}>
          <strong>Importante para la tienda:</strong> Subí la foto limpia y transparente del producto exacto que estás configurando (ej: si vendés un gorro, subí la foto limpia del gorro; si vendés anteojos, la foto limpia del anteojo). Esto garantiza que la Inteligencia Artificial del probador lo ubique e integre perfectamente sobre la persona.
        </div>
      </div>

      {value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 10, overflow: 'hidden',
            border: '1.5px solid #e5e7eb', flexShrink: 0,
            background: 'repeating-conic-gradient(#f3f4f6 0% 25%, #ffffff 0% 50%) 50% / 12px 12px',
          }}>
            <img src={value} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 6 }}>✓ Imagen cargada correctamente</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#ffffff', border: '1.5px solid #10B981', color: '#10B981',
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: 'pointer',
              }}>
                🔄 Cambiar foto
                <input type="file" accept="image/png,image/webp,image/jpeg" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <button
                type="button"
                onClick={() => onChange('')}
                style={{
                  background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444',
                  padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🗑️ Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '28px 16px', borderRadius: 12,
          border: '2px dashed #d1d5db', background: '#f9fafb',
          cursor: loading ? 'wait' : 'pointer', textAlign: 'center',
        }}>
          <span style={{ fontSize: 28, opacity: 0.45 }}>☁️⬆️</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#374151', lineHeight: 1.35 }}>
            {loading ? 'Procesando imagen...' : 'Arrastra una imagen o haz clic para subir'}
          </span>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            PNG o WEBP con fondo transparente (máx. 3MB)
          </span>
          <input
            type="file"
            accept="image/png,image/webp,image/jpeg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={loading}
          />
        </label>
      )}

      {errorMsg ? (
        <div style={{ marginTop: 8, fontSize: 12, color: '#b91c1c', fontWeight: 600 }}>⚠️ {errorMsg}</div>
      ) : null}

      <div style={{
        marginTop: 12, background: '#f0f9ff', border: '1px solid #bae6fd',
        borderRadius: 12, padding: '12px 14px',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0c4a6e', marginBottom: 8 }}>
          💡 Recomendaciones para mejor experiencia:
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#075985', lineHeight: 1.55 }}>
          <li>Usá <strong>PNG o WEBP con fondo transparente</strong></li>
          <li>El producto debe estar en <strong>primer plano y centrado</strong></li>
          <li>Ideal para: gorras, anteojos, sombreros, correctores de postura, accesorios</li>
          <li>Evitá imágenes con fondos sólidos o modelos puestos</li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN TIEMPO REAL
═══════════════════════════════════════════ */
function ProbadorVirtualPreview({ config }: { config: ProbadorVirtualConfig }) {
  const buttonBackground = config.tipo_fondo === 'degrade'
    ? 'linear-gradient(135deg, ' + config.color_fondo + ', ' + config.color_fondo_2 + ')'
    : config.color_fondo;

  const btnLabel = (config.mostrar_icono_percha ? '🧥 ' : '') + (config.texto_boton || 'Probador virtual');

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN VIVO
      </div>

      <div style={{
        background: '#f9fafb', borderRadius: 12, padding: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        <button
          type="button"
          style={{
            background: buttonBackground,
            color: config.color_texto_boton,
            border: 'none',
            borderRadius: config.borde_boton,
            padding: config.padding_boton + 'px ' + (config.padding_boton + 10) + 'px',
            fontSize: config.tamano_texto_boton,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {btnLabel}
        </button>

        {config.imagen_producto ? (
          <div style={{
            width: 64, height: 64, borderRadius: 10, overflow: 'hidden',
            border: '1.5px solid #e5e7eb',
            background: 'repeating-conic-gradient(#f3f4f6 0% 25%, #ffffff 0% 50%) 50% / 10px 10px',
          }}>
            <img src={config.imagen_producto} alt="Producto" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        ) : null}

        <div style={{
          background: config.color_fondo_modal, borderRadius: 10, padding: 10,
          width: '100%', maxWidth: 240, border: '1px solid #e5e7eb',
          display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 800, color: config.color_texto_modal,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          }}>
            <span>{config.titulo_modal || 'Probador Virtual'}</span>
            <span style={{ fontSize: 10, opacity: 0.5 }}>✕</span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {config.habilitar_camara ? (
              <div style={{
                background: config.color_acento, color: '#fff', borderRadius: 999,
                padding: '3px 8px', fontSize: 8, fontWeight: 800,
              }}>
                📷 Cámara
              </div>
            ) : null}
            {config.habilitar_subir_imagen ? (
              <div style={{
                background: '#111827', color: '#fff', borderRadius: 999,
                padding: '3px 8px', fontSize: 8, fontWeight: 800,
              }}>
                🖼️ Imagen
              </div>
            ) : null}
          </div>

          <div style={{ fontSize: 7.5, color: config.color_texto_modal, opacity: 0.6, textAlign: 'center' }}>
            Controles: ↑↓←→ · +− {config.habilitar_rotar ? '· ↻↺' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function ProbadorVirtualEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: ProbadorVirtualEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<ProbadorVirtualConfig>(() => ({
    ...defaultConfig,
    ...(ew?.config || {}),
  }));

  const [isActive, setIsActive] = useState(ew?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const isEditing = !!ew;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update(key: keyof ProbadorVirtualConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      const colorKeys = ['color_fondo', 'color_fondo_2', 'color_texto_boton', 'color_fondo_modal', 'color_texto_modal', 'color_acento', 'tipo_fondo'];
      if (colorKeys.indexOf(String(key)) !== -1) {
        next.campaignTheme = 'none';
      }
      return next;
    });
  }

  function applyPreset(slug: string) {
    if (slug === 'none') {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: 'none',
        tipo_fondo: defaultConfig.tipo_fondo,
        color_fondo: defaultConfig.color_fondo,
        color_fondo_2: defaultConfig.color_fondo_2,
        color_texto_boton: defaultConfig.color_texto_boton,
        color_fondo_modal: defaultConfig.color_fondo_modal,
        color_texto_modal: defaultConfig.color_texto_modal,
        color_acento: defaultConfig.color_acento,
      }));
    } else if (PRESETS_DATA[slug]) {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        ...PRESETS_DATA[slug],
      }));
    }
  }

  const handleSave = async () => {
    if (!config.imagen_producto && !config.usar_imagen_producto) {
      setError('Subí una imagen del producto o activá "Usar imagen del producto automáticamente".');
      return;
    }

    setSaving(true);
    setError(null);
    setSavedOK(false);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ew?.id ?? null,
          widget_slug: wd.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: targetType === 'product' ? productId : null,
          target_category_id: targetType === 'category' ? (categoryId ? String(categoryId) : null) : null,
          config: {
            ...config,
            ...(targetType === 'category' && categoryId ? { category_id: String(categoryId) } : {}),
          },
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', wd.slug);
        if (targetType === 'product' && productId) params.set('product', String(productId));
        if (targetType === 'category' && categoryId) params.set('category', String(categoryId));
        router.push('/widgets?' + params.toString());
      } else {
        router.push('/widgets');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  const tabGeneral = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel required>Texto del botón</FieldLabel>
        <TextInput
          value={config.texto_boton}
          onChange={(v) => update('texto_boton', v)}
          placeholder="ej: Probador virtual"
          maxLength={40}
        />
      </div>

      <ToggleRow
        label="Mostrar ícono de percha en el botón"
        description="Agrega 🧥 al inicio del texto del botón."
        checked={config.mostrar_icono_percha}
        onChange={(v) => update('mostrar_icono_percha', v)}
      />

      <div>
        <FieldLabel>Título del modal</FieldLabel>
        <TextInput
          value={config.titulo_modal}
          onChange={(v) => update('titulo_modal', v)}
          placeholder="ej: Probador Virtual"
          maxLength={50}
        />
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
          🖼️ Imagen que se prueba
        </div>

        <ImagePickerField
          label="Imagen del producto"
          value={config.imagen_producto}
          onChange={(v) => update('imagen_producto', v)}
          required
        />

        <div style={{ marginTop: 14 }}>
          <ToggleRow
            label="Usar imagen del producto de Tiendanube como respaldo"
            description="Si no hay imagen subida, toma la foto principal del producto automáticamente."
            checked={config.usar_imagen_producto}
            onChange={(v) => update('usar_imagen_producto', v)}
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
          🎛️ Modos y controles
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ToggleRow
            label="📷 Activar modo Cámara"
            description="Permite al cliente usar la webcam en vivo."
            checked={config.habilitar_camara}
            onChange={(v) => update('habilitar_camara', v)}
          />
          <ToggleRow
            label="🖼️ Activar modo Subir imagen"
            description="Permite al cliente subir una foto desde su galería."
            checked={config.habilitar_subir_imagen}
            onChange={(v) => update('habilitar_subir_imagen', v)}
          />
          <ToggleRow
            label="↻ Permitir rotar la imagen"
            checked={config.habilitar_rotar}
            onChange={(v) => update('habilitar_rotar', v)}
          />
          <ToggleRow
            label="📥 Botón Descargar foto"
            checked={config.habilitar_descargar}
            onChange={(v) => update('habilitar_descargar', v)}
          />
          <ToggleRow
            label="🔄 Botón Resetear posición"
            checked={config.habilitar_resetear}
            onChange={(v) => update('habilitar_resetear', v)}
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
          💬 Instrucciones para el cliente
        </div>
        <ToggleRow
          label="Mostrar instrucciones en el modal"
          checked={config.mostrar_instrucciones}
          onChange={(v) => update('mostrar_instrucciones', v)}
        />
        {config.mostrar_instrucciones ? (
          <div style={{ marginTop: 12 }}>
            <FieldLabel>Texto de instrucciones</FieldLabel>
            <TextAreaInput
              value={config.texto_instrucciones}
              onChange={(v) => update('texto_instrucciones', v)}
              placeholder="Explicá al cliente cómo usar el probador..."
              rows={3}
            />
          </div>
        ) : null}
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        Posición del botón
      </div>

      {[
        { id: 'debajo_precio', name: 'Debajo del precio', desc: 'El botón aparece inmediatamente debajo del bloque de precio.' },
        { id: 'encima_formulario', name: 'Por encima del formulario de compra', desc: 'Se inserta justo por encima del botón de agregar al carrito.' },
        { id: 'flotante_abajo', name: 'Flotante abajo a la derecha', desc: 'Botón fijo flotante que acompaña el scroll del usuario.' },
      ].map((loc) => {
        const isSelected = config.ubicacion === loc.id;
        return (
          <div
            key={loc.id}
            onClick={() => update('ubicacion', loc.id)}
            style={{
              background: '#ffffff',
              border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              borderRadius: 12, padding: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}
          >
            <input
              type="radio"
              name="ubicacion_probador"
              checked={isSelected}
              onChange={() => update('ubicacion', loc.id)}
              style={{ marginTop: 3, accentColor: '#10B981' }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{loc.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{loc.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🎨 Colores del botón</div>

        <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', marginBottom: 12 }}>
          <FieldLabel>Tipo de fondo</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => update('tipo_fondo', 'solido')}
              style={{
                padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.tipo_fondo === 'solido' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.tipo_fondo === 'solido' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              Sólido
            </button>
            <button
              type="button"
              onClick={() => update('tipo_fondo', 'degrade')}
              style={{
                padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.tipo_fondo === 'degrade' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.tipo_fondo === 'degrade' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              Degradé
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de fondo {config.tipo_fondo === 'degrade' ? '(inicio)' : ''}</FieldLabel>
            <ColorPickerField value={config.color_fondo} onChange={(v) => update('color_fondo', v)} />
          </div>

          {config.tipo_fondo === 'degrade' ? (
            <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
              <FieldLabel>Color de fondo (fin del degradé)</FieldLabel>
              <ColorPickerField value={config.color_fondo_2} onChange={(v) => update('color_fondo_2', v)} />
            </div>
          ) : null}

          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color del texto del botón</FieldLabel>
            <ColorPickerField value={config.color_texto_boton} onChange={(v) => update('color_texto_boton', v)} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🪟 Colores del modal</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Fondo del modal</FieldLabel>
            <ColorPickerField value={config.color_fondo_modal} onChange={(v) => update('color_fondo_modal', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Texto del modal</FieldLabel>
            <ColorPickerField value={config.color_texto_modal} onChange={(v) => update('color_texto_modal', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de acento</FieldLabel>
            <ColorPickerField value={config.color_acento} onChange={(v) => update('color_acento', v)} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>⚙️ Comportamiento y diseño</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Tamaño texto del botón: {config.tamano_texto_boton}px</FieldLabel>
            <input type="range" min={12} max={20} value={config.tamano_texto_boton} onChange={(e) => update('tamano_texto_boton', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Borde del botón: {config.borde_boton}px</FieldLabel>
            <input type="range" min={0} max={40} value={config.borde_boton} onChange={(e) => update('borde_boton', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Padding interno del botón: {config.padding_boton}px</FieldLabel>
            <input type="range" min={6} max={24} value={config.padding_boton} onChange={(e) => update('padding_boton', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Margen superior: {config.margin_top}px</FieldLabel>
            <input type="range" min={0} max={60} value={config.margin_top} onChange={(e) => update('margin_top', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Margen inferior: {config.margin_bottom}px</FieldLabel>
            <input type="range" min={0} max={60} value={config.margin_bottom} onChange={(e) => update('margin_bottom', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto al botón y al modal.</FieldHelper>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CAMPAIGN_PRESETS.map((preset) => {
          const isSelected = (config.campaignTheme || 'none') === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              style={{
                background: '#fff',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                borderRadius: 12, padding: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{ fontSize: 24 }}>{preset.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {preset.label}
                  {isSelected ? (
                    <span style={{ background: '#ecfdf5', color: '#10B981', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 999, border: '1px solid #10B981' }}>
                      ACTIVO
                    </span>
                  ) : null}
                </div>
                <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{preset.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>
      <div style={{
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <NevuxLogo size="medium" />
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
        }}>
          RL
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>
        {isForAll ? (
          <div style={{
            background: '#10B981', color: '#fff', borderRadius: 999, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <IconStore />
            <span>Todos los productos</span>
          </div>
        ) : isCategory ? (
          <div style={{
            background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D',
            borderRadius: 999, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <span>🏷️ Widget para Categoría</span>
          </div>
        ) : (
          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#000',
          }}>
            <span style={{ fontSize: 18 }}>🛍️</span>
            <span>NEVUX Widget</span>
          </div>
        )}

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#000', margin: '0 0 20px', lineHeight: 1.2 }}>
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {wd.name} ({scopeLabel})
        </h1>

        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ marginBottom: 20 }}>
            <ProbadorVirtualPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Subí una imagen PNG/WEBP con fondo transparente del producto. El cliente se lo prueba con su cámara o una foto propia antes de comprar.
            </span>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, overflowX: 'auto' }}>
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flexShrink: 0, padding: '12px 18px', background: 'none', border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000', opacity: act ? 1 : 0.6,
                    fontSize: 14, fontWeight: act ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === 'general' ? tabGeneral : null}
            {activeTab === 'ubicacion' ? tabUbicacion : null}
            {activeTab === 'estilos' ? tabEstilos : null}
            {activeTab === 'fechas' ? tabFechas : null}
          </div>

          <div style={{
            marginTop: 32, paddingTop: 20, borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ToggleSwitch checked={isActive} onChange={setIsActive} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Widget activo</span>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: 999, border: 'none',
                background: '#10B981', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>

        {error ? (
          <div style={{
            position: 'fixed', bottom: 20, left: 16, right: 16, maxWidth: 600, margin: '0 auto',
            background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, border: '1px solid #fecaca', zIndex: 40,
          }}>
            ⚠️ {error}
          </div>
        ) : null}
      </div>
    </div>
  );
       }
