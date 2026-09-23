'use client';

import { useState, useEffect } from 'react';
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

interface CalculadoraAhorroEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface CalculadoraAhorroConfig {
  badgeText: string;
  prefixText: string;
  exampleAmount: string;
  suffixText: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  campaignTheme?: string;
  position?: string; // NUEVO v12
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO (v12 con default below_price)
═══════════════════════════════════════════ */
const defaultConfig: CalculadoraAhorroConfig = {
  badgeText: 'AHORRO EXCLUSIVO',
  prefixText: '🎉 ¡Ahorrás',
  exampleAmount: '$ 14.500',
  suffixText: 'comprando hoy!',
  bgColor: '#ecfdf5',
  textColor: '#065f46',
  borderColor: '#10B981',
  accentColor: '#059669',
  campaignTheme: 'none',
  position: 'below_price', // NUEVO v12
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
   COMPONENTES REUTILIZABLES (Regla #9 + CamelCase #13)
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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
    }}>
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

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CalculadoraAhorroEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: CalculadoraAhorroEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CalculadoraAhorroConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'estilos' | 'fechas'>('general');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  const update = <K extends keyof CalculadoraAhorroConfig>(key: K, value: CalculadoraAhorroConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (slug: string) => {
    const PRESETS_DATA: Record<string, { bg: string; tx: string; bd: string; ac: string }> = {
      'black-friday': { bg: '#111827', tx: '#ffffff', bd: '#F59E0B', ac: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', bd: '#EF4444', ac: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', bd: '#3B82F6', ac: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', bd: '#EF4444', ac: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', bd: '#F43F5E', ac: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', bd: '#10B981', ac: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', bd: '#FBBF24', ac: '#FBBF24' },
    };

    if (slug === 'none') {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        ...defaultConfig,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
        borderColor: p.bd,
        accentColor: p.ac,
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

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div>
      {/* NUEVA v12: SELECTOR DE UBICACIÓN DINÁMICA ESPECTACULAR */}
      <div style={{
        background: '#f0fdf4',
        borderLeft: '4px solid #10B981',
        borderRadius: 12,
        padding: 18,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📍 Ubicación del Widget</span>
            <span style={{
              background: '#10B981',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 900,
              padding: '3px 8px',
              borderRadius: 999,
              letterSpacing: '0.05em'
            }}>
              ¡NUEVO!
            </span>
          </span>
        </div>

        <p style={{ fontSize: 13, color: '#065f46', marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
          Elegí la posición exacta donde se mostrará la calculadora dentro de la página de producto de tu tienda.
        </p>

        <select
          value={config.position || 'below_price'}
          onChange={(e) => update('position', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            fontSize: 15,
            fontWeight: 600,
            border: '1.5px solid #10B981',
            borderRadius: 10,
            background: '#ffffff',
            color: '#000000',
            outline: 'none',
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
        >
          <option value="below_image">🖼️ Abajo de la foto del producto (Muy recomendado)</option>
          <option value="above_price">💵 Arriba del precio</option>
          <option value="below_price">💵 Abajo del precio</option>
          <option value="above_buy">🛒 Arriba del botón de agregar al carrito</option>
          <option value="below_buy">🛒 Abajo del botón de agregar al carrito</option>
        </select>
      </div>

      {/* Etiqueta Superior */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Etiqueta Superior</FieldLabel>
        <TextInput
          value={config.badgeText}
          onChange={(v) => update('badgeText', v)}
          placeholder="Ej: AHORRO EXCLUSIVO"
          maxLength={30}
        />
        <FieldHelper>Texto pequeño en mayúsculas arriba del mensaje de ahorro.</FieldHelper>
      </div>

      {/* Prefix & Suffix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div>
          <FieldLabel>Texto Inicial</FieldLabel>
          <TextInput
            value={config.prefixText}
            onChange={(v) => update('prefixText', v)}
            placeholder="🎉 ¡Ahorrás"
          />
        </div>
        <div>
          <FieldLabel>Texto Final</FieldLabel>
          <TextInput
            value={config.suffixText}
            onChange={(v) => update('suffixText', v)}
            placeholder="comprando hoy!"
          />
        </div>
      </div>

      {/* Monto de Ejemplo */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Monto de Ejemplo (Vista Previa)</FieldLabel>
        <TextInput
          value={config.exampleAmount}
          onChange={(v) => update('exampleAmount', v)}
          placeholder="Ej: $ 14.500"
        />
        <FieldHelper>
          💡 En la tienda real el widget buscará el precio de oferta y el precio tachado del producto y calculará el ahorro exacto automáticamente.
        </FieldHelper>
      </div>
    </div>
  );

  /* ═══ TAB ESTILOS (GRID AUTOADAPTABLE PREMIUM v12) ═══ */
  const tabEstilos = (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 20, 
        marginBottom: 20 
      }}>
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
        </div>
        <div>
          <FieldLabel>Color de texto</FieldLabel>
          <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
        </div>
        <div>
          <FieldLabel>Color del borde</FieldLabel>
          <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
        </div>
        <div>
          <FieldLabel>Color de resalte (%)</FieldLabel>
          <ColorPickerField value={config.accentColor} onChange={(v) => update('accentColor', v)} />
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
          Elegí una campaña activa. Al seleccionarla, se aplicará un diseño optimizado con colores temáticos de alto impacto para este widget.
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
          
          {/* Live Preview del Widget de Calculadora de Ahorro */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                background: config.bgColor,
                borderRadius: 12,
                border: `1.5px solid ${config.borderColor}`,
                padding: '16px 18px',
                color: config.textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {config.badgeText && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      color: config.accentColor,
                      textTransform: 'uppercase',
                    }}
                  >
                    {config.badgeText}
                  </span>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                  {config.prefixText}{' '}
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: config.accentColor,
                      textDecoration: 'underline',
                    }}
                  >
                    {config.exampleAmount}
                  </span>{' '}
                  {config.suffixText}
                </div>
              </div>

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: config.accentColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                %
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
              Este widget busca y resalta el ahorro real del cliente entre el precio de oferta y el tachado.
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
                    border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
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
