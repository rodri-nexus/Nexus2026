'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface MarqueeNovedadesEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface MarqueeNovedadesConfig {
  messages: string[];
  speed: string;
  direction: string;
  bgColor: string;
  textColor: string;
  fontSize: string;
  campaignTheme?: string;
  position?: string; // ← Agregado v11 para ubicación dinámica
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const defaultConfig: MarqueeNovedadesConfig = {
  messages: ['✨ Nuevo ingreso', '🔥 Más vendido', '📦 Envío gratis hoy'],
  speed: 'normal',
  direction: 'left',
  bgColor: '#111827',
  textColor: '#ffffff',
  fontSize: '14',
  campaignTheme: 'none',
  position: 'above_form', // Default: arriba de la caja de compra
};

const DUR: Record<string, string> = {
  lento: '20s',
  normal: '12s',
  rapido: '6s',
};

/* ═══════════════════════════════════════════
   ICONOS
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

/* ═══════════════════════════════════════════
   COMPONENTES REUTILIZABLES
═══════════════════════════════════════════ */
function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

function TextInput({
  value, onChange, placeholder, maxLength,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function ColorPickerField({
  value, onChange,
}: {
  value: string; onChange: (v: string) => void;
}) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#000000';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div
        onClick={handleClick}
        style={{
          width: 40, height: 40, borderRadius: 8,
          background: value, border: '1.5px solid #e5e7eb',
          cursor: 'pointer', flexShrink: 0,
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v.startsWith('#') ? v : '#' + v);
        }}
        style={{
          flex: 1, minWidth: 0,
          padding: '10px 10px', fontSize: 13,
          border: '1.5px solid #e5e7eb', borderRadius: 8,
          background: '#ffffff', color: '#000000', outline: 'none',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleField({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 13,
          background: checked ? '#10B981' : '#d1d5db',
          position: 'relative', transition: 'background 0.25s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: '#fff', transition: 'left 0.25s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>
        {label}
      </span>
    </label>
  );
}

function SelectField({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
          border: '1.5px solid #e5e7eb', borderRadius: 10,
          background: '#ffffff', color: '#000000', outline: 'none',
          appearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function RangeSlider({
  value, min, max, onChange, ticks,
}: {
  value: number; min: number; max: number;
  onChange: (v: number) => void;
  ticks?: number[];
}) {
  return (
    <div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
      />
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 4 }}>
          {ticks.map((t) => <span key={t}>{t}px</span>)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MarqueeNovedadesEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: MarqueeNovedadesEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<MarqueeNovedadesConfig>(() => {
    const base = {
      ...defaultConfig,
      ...(existingWidget?.config || {}),
    };
    if (existingWidget?.config?.messages && Array.isArray(existingWidget.config.messages) && existingWidget.config.messages.length > 0) {
      base.messages = existingWidget.config.messages;
    }
    return base as MarqueeNovedadesConfig;
  });

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'estilos' | 'fechas'>('general');
  const [newMsg, setNewMsg] = useState('');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  const update = <K extends keyof MarqueeNovedadesConfig>(key: K, value: MarqueeNovedadesConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const addMsg = () => {
    const t = newMsg.trim();
    if (!t) return;
    update('messages', [...config.messages, t]);
    setNewMsg('');
  };

  const rmMsg = (i: number) => {
    update('messages', config.messages.filter((_, idx) => idx !== i));
  };

  const updateMsg = (i: number, val: string) => {
    const arr = [...config.messages];
    arr[i] = val;
    update('messages', arr);
  };

  const applyPreset = (slug: string) => {
    const PRESETS_DATA: Record<string, { bg: string; tx: string }> = {
      'black-friday': { bg: '#111827', tx: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#FBBF24' },
    };

    if (slug === 'none') {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: defaultConfig.bgColor,
        textColor: defaultConfig.textColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
      }));
    }
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
          id: existingWidget?.id ?? null,
          widget_slug: widgetDefinition.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);

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
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  const animName = config.direction === 'right' ? 'nvxMqR' : 'nvxMqL';
  const dur = DUR[config.speed] || '12s';

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div>
      {/* Mensajes del marquee */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel required>Mensajes del Marquee</FieldLabel>
        <FieldHelper>Agregá todos los mensajes que se mostrarán rotando en la cinta.</FieldHelper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {config.messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <TextInput
                  value={m}
                  onChange={(v) => updateMsg(i, v)}
                  placeholder={`Mensaje ${i + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() => rmMsg(i)}
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  border: '1.5px solid #fecaca',
                  background: '#fef2f2', color: '#dc2626',
                  cursor: 'pointer', fontSize: 16,
                  flexShrink: 0, fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <TextInput
              value={newMsg}
              onChange={setNewMsg}
              placeholder="Escribí un mensaje nuevo..."
            />
          </div>
          <button
            type="button"
            onClick={addMsg}
            style={{
              padding: '0 20px', borderRadius: 10, border: 'none',
              background: '#10B981', color: '#fff',
              fontSize: 14, fontWeight: 700,
              cursor: 'pointer', flexShrink: 0,
              fontFamily: 'inherit',
            }}
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Selector de Posición (Dinámico para Producto) */}
      {!isForAll && (
        <div style={{ marginBottom: 24 }}>
          <FieldLabel>Ubicación en la tienda</FieldLabel>
          <FieldHelper>Elegí dónde querés que se muestre el marquee dentro de la página del producto.</FieldHelper>
          <div style={{ marginTop: 12 }}>
            <SelectField
              value={config.position || 'above_form'}
              onChange={(v) => update('position', v)}
              options={[
                { value: 'above_form', label: 'Arriba del bloque de compra (Por defecto)' },
                { value: 'below_image', label: '🖼️ Abajo de la foto del producto' },
                { value: 'above_price', label: '💵 Arriba del precio' },
                { value: 'below_price', label: '💵 Abajo del precio' },
                { value: 'above_buy', label: '🛒 Arriba del botón de comprar' },
                { value: 'below_buy', label: '🛒 Abajo del botón de comprar' },
              ]}
            />
          </div>
        </div>
      )}

      {/* Velocidad y Dirección */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <FieldLabel>Velocidad</FieldLabel>
          <SelectField
            value={config.speed}
            onChange={(v) => update('speed', v)}
            options={[
              { value: 'lento', label: '🐢 Lento' },
              { value: 'normal', label: '🚶 Normal' },
              { value: 'rapido', label: '🏃 Rápido' },
            ]}
          />
        </div>
        <div>
          <FieldLabel>Dirección</FieldLabel>
          <SelectField
            value={config.direction}
            onChange={(v) => update('direction', v)}
            options={[
              { value: 'left', label: '← Izquierda' },
              { value: 'right', label: 'Derecha →' },
            ]}
          />
        </div>
      </div>
    </div>
  );

  /* ═══ TAB ESTILOS (Grid adaptativo sin desbordes) ═══ */
  const tabEstilos = (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 20, 
        marginBottom: 24 
      }}>
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
        </div>
        <div>
          <FieldLabel>Color de texto</FieldLabel>
          <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Tamaño de fuente: {config.fontSize}px</FieldLabel>
        <div style={{ marginTop: 8 }}>
          <RangeSlider
            value={Number(config.fontSize)}
            min={10}
            max={28}
            onChange={(v) => update('fontSize', String(v))}
            ticks={[10, 18, 28]}
          />
        </div>
      </div>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
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

  const tabFechasEspeciales = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>
          Elegí una campaña activa. Al seleccionarla, se aplicará un diseño optimizado con colores temáticos de alto impacto.
        </FieldHelper>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CAMPAIGN_PRESETS.map((preset) => {
          const isSelected = (config.campaignTheme || 'none') === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: 24, flexShrink: 0 }}>{preset.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', display: 'flex', alignItems: 'center', gap: 8 }}>
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
                <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 4, lineHeight: 1.4 }}>
                  {preset.desc}
                </div>
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

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas Especiales' },
  ];

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>
      <style>{`
        @keyframes nvxMqL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes nvxMqR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
      `}</style>

      {/* HEADER CON LOGO OFICIAL */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#000000', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#ffffff',
          }}>
            RL
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Scope chip */}
        {isForAll ? (
          <div style={{
            background: '#10B981', color: '#ffffff',
            borderRadius: 999, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <IconStore />
            <span>Todos los productos</span>
          </div>
        ) : (
          <div style={{
            background: '#ffffff', border: '1px solid #e5e7eb',
            borderRadius: 10, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#000000',
          }}>
            <span style={{ fontSize: 18 }}>🛍</span>
            <span>NEVUX Widget</span>
          </div>
        )}

        {/* Título */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: '#000000',
          margin: '0 0 20px', lineHeight: 1.2,
        }}>
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        {/* Contenedor principal */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          
          {/* Live Preview del Marquee */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                overflow: 'hidden',
                background: config.bgColor,
                borderRadius: 10,
                padding: '14px 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  whiteSpace: 'nowrap',
                  animation: `${animName} ${dur} linear infinite`,
                  width: 'max-content',
                }}
              >
                {[...config.messages, ...config.messages].map((m, i) => (
                  <span
                    key={i}
                    style={{
                      color: config.textColor,
                      fontSize: `${config.fontSize}px`,
                      fontWeight: 700,
                      padding: '0 28px',
                      letterSpacing: '0.02em',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info box */}
          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0',
            borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000000', lineHeight: 1.5 }}>
              El marquee se muestra como una cinta animada arriba o en la ubicación elegida de la tienda con tus mensajes destacados.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24,
          }}>
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1, padding: '14px 12px', background: 'none',
                    border: 'none', borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000000',
                    opacity: act ? 1 : 0.6,
                    fontSize: 15, fontWeight: act ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Contenido del tab */}
          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'estilos' && tabEstilos}
            {activeTab === 'fechas' && tabFechasEspeciales}
          </div>

          {/* Footer del Editor */}
          <div style={{
            marginTop: 32, paddingTop: 20,
            borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            flexWrap: 'wrap',
          }}>
            <ToggleField
              checked={isActive}
              onChange={setIsActive}
              label="Widget activo"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: 999,
                border: 'none',
                background: savedOK ? '#10b981' : '#10B981',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA OFICIAL UNIFICADO */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>

        {/* Error Toast */}
        {error && (
          <div style={{
            position: 'fixed', bottom: 20, left: 16, right: 16,
            maxWidth: 600, margin: '0 auto',
            background: '#fee2e2', color: '#991b1b',
            padding: '12px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 600,
            border: '1px solid #fecaca', zIndex: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
                     }
