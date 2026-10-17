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

interface CajaEstadisticasEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface EstadisticaItem {
  id: string;
  icon: string;
  numero: string;
  etiqueta: string;
  texto: string;
}

export interface CajaEstadisticasConfig {
  titulo: string;
  columnas: string;
  items: EstadisticaItem[];
  ubicacion: string;
  color_titulo: string;
  color_numero: string;
  color_etiqueta: string;
  color_texto: string;
  color_fondo: string;
  color_borde: string;
  tamano_numero: string;
  tamano_texto: string;
  borde_redondeado: number;
  padding: number;
  margin_top: number;
  margin_bottom: number;
  campaignTheme?: string;
}

const STAT_ICON_OPTIONS = [
  { value: '⭐', label: '⭐ Estrella / Calificación' },
  { value: '📦', label: '📦 Envío / Entregas' },
  { value: '👥', label: '👥 Clientes / Usuarios' },
  { value: '🚀', label: '🚀 Crecimiento / Rapidez' },
  { value: '🏆', label: '🏆 Premio / Calidad' },
  { value: '🔒', label: '🔒 Seguridad / Garantía' },
  { value: '⚡', label: '⚡ Rapidez / Despacho' },
  { value: '💬', label: '💬 Reseñas / Opiniones' },
  { value: '🌍', label: '🌍 Cobertura / Alcance' },
  { value: '❤️', label: '❤️ Me gusta / Favoritos' },
  { value: '💯', label: '💯 Confianza / Éxito' },
  { value: '📅', label: '📅 Años de experiencia' },
];

const defaultConfig: CajaEstadisticasConfig = {
  titulo: 'Nuestros números nos avalan',
  columnas: '3',
  items: [
    { id: '1', icon: '👥', numero: '+15.000', etiqueta: 'Clientes felices', texto: 'Compraron este año' },
    { id: '2', icon: '⭐', numero: '4.9 / 5', etiqueta: 'Valoración media', texto: 'Más de 2.000 reseñas' },
    { id: '3', icon: '⚡', numero: '24hs', etiqueta: 'Despacho exprés', texto: 'Envíos a todo el país' },
  ],
  ubicacion: 'debajo_precio',
  color_titulo: '#111827',
  color_numero: '#10B981',
  color_etiqueta: '#111827',
  color_texto: '#6b7280',
  color_fondo: '#ffffff',
  color_borde: '#e5e7eb',
  tamano_numero: 'mediano',
  tamano_texto: 'mediano',
  borde_redondeado: 12,
  padding: 16,
  margin_top: 16,
  margin_bottom: 16,
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + números en neón dorado.' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul oscuro + acentos celestes.' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Estilo cibernético de alto impacto.' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde festivo + acentos dorados.' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Fondo rosado suave.' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí llamativo.' },
];

const PRESETS_DATA: Record<string, Partial<CajaEstadisticasConfig>> = {
  'black-friday': { color_fondo: '#111827', color_titulo: '#ffffff', color_numero: '#F59E0B', color_etiqueta: '#ffffff', color_texto: '#9ca3af', color_borde: '#F59E0B' },
  'hot-sale': { color_fondo: '#0F172A', color_titulo: '#ffffff', color_numero: '#38BDF8', color_etiqueta: '#ffffff', color_texto: '#94a3b8', color_borde: '#3B82F6' },
  'cyber-monday': { color_fondo: '#090D16', color_titulo: '#ffffff', color_numero: '#10B981', color_etiqueta: '#ffffff', color_texto: '#94a3b8', color_borde: '#10B981' },
  'navidad': { color_fondo: '#064E3B', color_titulo: '#ffffff', color_numero: '#FBBF24', color_etiqueta: '#ffffff', color_texto: '#a7f3d0', color_borde: '#EF4444' },
  'san-valentin': { color_fondo: '#fdf2f8', color_titulo: '#831843', color_numero: '#E11D48', color_etiqueta: '#831843', color_texto: '#9d174d', color_borde: '#F43F5E' },
  'liquidacion': { color_fondo: '#7F1D1D', color_titulo: '#ffffff', color_numero: '#FBBF24', color_etiqueta: '#ffffff', color_texto: '#fecaca', color_borde: '#FBBF24' },
};

/* Helper para formatear negritas con **texto** */
function renderMarkdownText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

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

function ColorPickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value && value.startsWith('#') && value.length >= 7 ? value : '#ffffff';
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

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', fontSize: 14,
          border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fff', color: '#000',
          outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box', fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN TIEMPO REAL
═══════════════════════════════════════════ */
function CajaEstadisticasPreview({ config }: { config: CajaEstadisticasConfig }) {
  const numSize = config.tamano_numero === 'pequeno' ? 18 : config.tamano_numero === 'grande' ? 28 : 22;
  const textSize = config.tamano_texto === 'pequeno' ? 11 : config.tamano_texto === 'grande' ? 15 : 13;
  const cols = Math.max(1, parseInt(String(config.columnas || '3'), 10) || 3);

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN VIVO
      </div>

      <div style={{
        background: config.color_fondo || '#ffffff',
        border: config.color_borde && config.color_borde !== 'transparent' ? `1px solid ${config.color_borde}` : 'none',
        borderRadius: config.borde_redondeado,
        padding: config.padding,
        marginTop: config.margin_top / 2,
        marginBottom: config.margin_bottom / 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        {config.titulo ? (
          <div style={{
            fontSize: textSize + 2,
            fontWeight: 800,
            color: config.color_titulo || '#111827',
            marginBottom: 14,
            textAlign: 'center',
          }}>
            {renderMarkdownText(config.titulo)}
          </div>
        ) : null}

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: 12,
          alignItems: 'start',
          width: '100%',
        }}>
          {config.items && config.items.length > 0 ? (
            config.items.map((item) => (
              <div key={item.id} style={{ textAlign: 'center', padding: '6px 4px', minWidth: 0, boxSizing: 'border-box' }}>
                {item.icon ? (
                  <div style={{ fontSize: numSize - 4, marginBottom: 4 }}>
                    {item.icon}
                  </div>
                ) : null}
                <div style={{
                  fontSize: numSize,
                  fontWeight: 800,
                  color: config.color_numero || '#10B981',
                  lineHeight: 1.1,
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                }}>
                  {item.numero || '0'}
                </div>
                {item.etiqueta ? (
                  <div style={{
                    fontSize: textSize,
                    fontWeight: 700,
                    color: config.color_etiqueta || '#111827',
                    marginTop: 4,
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}>
                    {renderMarkdownText(item.etiqueta)}
                  </div>
                ) : null}
                {item.texto ? (
                  <div style={{
                    fontSize: Math.max(10, textSize - 2),
                    color: config.color_texto || '#6b7280',
                    marginTop: 2,
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}>
                    {renderMarkdownText(item.texto)}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic', gridColumn: '1 / -1', textAlign: 'center' }}>
              Sin estadísticas agregadas aún...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL DE EDITOR
═══════════════════════════════════════════ */
export default function CajaEstadisticasEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: CajaEstadisticasEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CajaEstadisticasConfig>(() => ({
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

  function update(key: keyof CajaEstadisticasConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['color_fondo', 'color_titulo', 'color_numero', 'color_etiqueta', 'color_texto', 'color_borde'].indexOf(String(key)) !== -1) {
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
        color_fondo: defaultConfig.color_fondo,
        color_titulo: defaultConfig.color_titulo,
        color_numero: defaultConfig.color_numero,
        color_etiqueta: defaultConfig.color_etiqueta,
        color_texto: defaultConfig.color_texto,
        color_borde: defaultConfig.color_borde,
      }));
    } else if (PRESETS_DATA[slug]) {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        ...PRESETS_DATA[slug],
      }));
    }
  }

  const handleAddItem = () => {
    if (config.items.length >= 6) return;
    const newItem: EstadisticaItem = {
      id: String(Date.now()),
      icon: '⭐',
      numero: '+100',
      etiqueta: 'Nueva métrica',
      texto: 'Descripción breve',
    };
    update('items', [...config.items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof EstadisticaItem, val: string) => {
    const updated = config.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    update('items', updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = config.items.filter((item) => item.id !== id);
    update('items', updated);
  };

  const handleSave = async () => {
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
        router.push(`/widgets?${params.toString()}`);
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
        <FieldLabel>Título principal (opcional)</FieldLabel>
        <TextInput
          value={config.titulo}
          onChange={(v) => update('titulo', v)}
          placeholder="ej: Nuestros números nos avalan"
        />
        <FieldHelper>
          Aparece encabezando el bloque de estadísticas. Usa <strong>**texto**</strong> para negritas.
        </FieldHelper>
      </div>

      <div>
        <FieldLabel>Columnas de la cuadrícula</FieldLabel>
        <SelectField
          value={String(config.columnas || '3')}
          onChange={(v) => update('columnas', v)}
          options={[
            { value: '1', label: '1 Columna (Lista vertical)' },
            { value: '2', label: '2 Columnas' },
            { value: '3', label: '3 Columnas' },
            { value: '4', label: '4 Columnas' },
          ]}
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <FieldLabel>Estadísticas ({config.items.length}/6)</FieldLabel>
          {config.items.length < 6 ? (
            <button
              type="button"
              onClick={handleAddItem}
              style={{
                background: '#ecfdf5', color: '#10B981', border: '1px solid #10B981',
                borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Agregar métrica
            </button>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {config.items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                background: '#f9fafb', border: '1.5px solid #e5e7eb',
                borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Métrica #{idx + 1}</span>
                {config.items.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444',
                      borderRadius: 8, padding: '4px 8px', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                ) : null}
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4, display: 'block' }}>Ícono</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <select
                    value={item.icon}
                    onChange={(e) => handleUpdateItem(item.id, 'icon', e.target.value)}
                    style={{
                      width: '100%', padding: '9px 30px 9px 10px', fontSize: 13,
                      border: '1.5px solid #e5e7eb', borderRadius: 8,
                      background: '#fff', color: '#000', outline: 'none',
                      appearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
                    }}
                  >
                    {STAT_ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, opacity: 0.5 }}>▼</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4, display: 'block' }}>Número / Dato</label>
                  <input
                    type="text"
                    value={item.numero}
                    onChange={(e) => handleUpdateItem(item.id, 'numero', e.target.value)}
                    placeholder="ej: +15.000"
                    style={{
                      width: '100%', padding: '9px 10px', fontSize: 13,
                      border: '1.5px solid #e5e7eb', borderRadius: 8,
                      background: '#fff', color: '#000', outline: 'none',
                      boxSizing: 'border-box', fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4, display: 'block' }}>Etiqueta</label>
                  <input
                    type="text"
                    value={item.etiqueta}
                    onChange={(e) => handleUpdateItem(item.id, 'etiqueta', e.target.value)}
                    placeholder="ej: Clientes felices"
                    style={{
                      width: '100%', padding: '9px 10px', fontSize: 13,
                      border: '1.5px solid #e5e7eb', borderRadius: 8,
                      background: '#fff', color: '#000', outline: 'none',
                      boxSizing: 'border-box', fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4, display: 'block' }}>Texto secundario (opcional)</label>
                <input
                  type="text"
                  value={item.texto}
                  onChange={(e) => handleUpdateItem(item.id, 'texto', e.target.value)}
                  placeholder="ej: Compraron en los últimos 12 meses"
                  style={{
                    width: '100%', padding: '9px 10px', fontSize: 13,
                    border: '1.5px solid #e5e7eb', borderRadius: 8,
                    background: '#fff', color: '#000', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <FieldHelper>
          Usa <strong>**texto**</strong> para poner palabras o frases en negrita.
        </FieldHelper>
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        Posición del widget
      </div>

      {[
        { id: 'debajo_precio', name: 'Debajo del precio del producto', desc: 'Muestra los números clave inmediatamente después del bloque de precios.' },
        { id: 'encima_formulario', name: 'Por encima del formulario de compra', desc: 'Se posiciona arriba de los botones de compra y selección de variantes.' },
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
              name="ubicacion_estadisticas"
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
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🎨 Colores principales</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color del título principal</FieldLabel>
            <ColorPickerField value={config.color_titulo} onChange={(v) => update('color_titulo', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de los números / datos</FieldLabel>
            <ColorPickerField value={config.color_numero} onChange={(v) => update('color_numero', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de las etiquetas</FieldLabel>
            <ColorPickerField value={config.color_etiqueta} onChange={(v) => update('color_etiqueta', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color del texto secundario</FieldLabel>
            <ColorPickerField value={config.color_texto} onChange={(v) => update('color_texto', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField value={config.color_fondo} onChange={(v) => update('color_fondo', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color del borde</FieldLabel>
            <ColorPickerField value={config.color_borde} onChange={(v) => update('color_borde', v)} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🔤 Tamaños de fuente</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <FieldLabel>Tamaño del número</FieldLabel>
            <SelectField
              value={config.tamano_numero}
              onChange={(v) => update('tamano_numero', v)}
              options={[
                { value: 'pequeno', label: 'Pequeño (18px)' },
                { value: 'mediano', label: 'Mediano (22px)' },
                { value: 'grande', label: 'Grande (28px)' },
              ]}
            />
          </div>
          <div>
            <FieldLabel>Tamaño de texto</FieldLabel>
            <SelectField
              value={config.tamano_texto}
              onChange={(v) => update('tamano_texto', v)}
              options={[
                { value: 'pequeno', label: 'Pequeño (11px)' },
                { value: 'mediano', label: 'Mediano (13px)' },
                { value: 'grande', label: 'Grande (15px)' },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>⚙️ Comportamiento y diseño</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Borde del widget: {config.borde_redondeado}px</FieldLabel>
            <input type="range" min={0} max={25} value={config.borde_redondeado} onChange={(e) => update('borde_redondeado', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Margen interno (padding): {config.padding}px</FieldLabel>
            <input type="range" min={0} max={30} value={config.padding} onChange={(e) => update('padding', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Margen superior: {config.margin_top}px</FieldLabel>
            <input type="range" min={0} max={100} value={config.margin_top} onChange={(e) => update('margin_top', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Margen inferior: {config.margin_bottom}px</FieldLabel>
            <input type="range" min={0} max={100} value={config.margin_bottom} onChange={(e) => update('margin_bottom', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto al bloque de estadísticas.</FieldHelper>
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#000', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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
      {/* HEADER STICKY */}
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
        {/* SCOPE CHIP */}
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
            <CajaEstadisticasPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Las estadísticas muestran datos sociales impactantes (clientes felices, entregas exitosas, etc.) para acelerar la decisión de compra.
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
            <ToggleSwitch checked={isActive} onChange={setIsActive} />
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
