'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

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
  target_category_id?: string | number | null;
}

interface BarraAccionEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface BarraAccionConfig {
  displayMode: 'bar' | 'button';
  buttonText: string;
  showCartIcon: boolean;
  buttonTextStyle: 'normal' | 'bold';
  buttonBorderRadius: number;
  buttonEffect: 'none' | 'aureola';
  buttonGradient: boolean;
  redirectToCheckout: boolean;
  onlyMobile: boolean;
  barBg: string;
  titleColor: string;
  priceColor: string;
  buttonBg: string;
  buttonTextColor: string;
  campaignTheme?: string;
}

const defaultConfig: BarraAccionConfig = {
  displayMode: 'bar',
  buttonText: 'Agregar al carrito',
  showCartIcon: false,
  buttonTextStyle: 'bold',
  buttonBorderRadius: 25,
  buttonEffect: 'none',
  buttonGradient: false,
  redirectToCheckout: false,
  onlyMobile: false,
  barBg: '#333333',
  titleColor: '#ffffff',
  priceColor: '#10B981',
  buttonBg: '#007bff',
  buttonTextColor: '#ffffff',
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + dorado de alto impacto.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul oscuro + rojo conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Estilo cibernético azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde festivo con botón rojo.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Índigo premium con verde esmeralda.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo sale con amarillo llamativo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, Partial<BarraAccionConfig>> = {
  'black-friday': { barBg: '#111827', titleColor: '#ffffff', priceColor: '#F59E0B', buttonBg: '#F59E0B', buttonTextColor: '#111827' },
  'hot-sale': { barBg: '#0F172A', titleColor: '#ffffff', priceColor: '#EF4444', buttonBg: '#EF4444', buttonTextColor: '#ffffff' },
  'cyber-monday': { barBg: '#090D16', titleColor: '#ffffff', priceColor: '#3B82F6', buttonBg: '#3B82F6', buttonTextColor: '#ffffff' },
  'navidad': { barBg: '#064E3B', titleColor: '#ffffff', priceColor: '#EF4444', buttonBg: '#EF4444', buttonTextColor: '#ffffff' },
  'san-valentin': { barBg: '#831843', titleColor: '#ffffff', priceColor: '#F43F5E', buttonBg: '#F43F5E', buttonTextColor: '#ffffff' },
  'dia-padre-madre': { barBg: '#312E81', titleColor: '#ffffff', priceColor: '#10B981', buttonBg: '#10B981', buttonTextColor: '#ffffff' },
  'liquidacion': { barBg: '#7F1D1D', titleColor: '#ffffff', priceColor: '#FBBF24', buttonBg: '#FBBF24', buttonTextColor: '#7F1D1D' },
};

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

function TextInput({ value, onChange, placeholder, maxLength }: { value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
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
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function ToggleField({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 13,
          background: checked ? '#10B981' : '#d1d5db',
          position: 'relative', transition: 'background 0.25s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>{label}</span>
    </label>
  );
}

function CheckboxRow({ checked, onChange, label, helper }: { checked: boolean; onChange: (v: boolean) => void; label: string; helper?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: '#10B981', marginTop: 2, flexShrink: 0 }}
      />
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{label}</div>
        {helper && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 1.4 }}>{helper}</div>}
      </div>
    </label>
  );
}

function ColorPickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#000000';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div onClick={handleClick} style={{ width: 40, height: 40, borderRadius: 8, background: value, border: '1.5px solid #e5e7eb', cursor: 'pointer', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v.startsWith('#') ? v : '#' + v);
        }}
        style={{ flex: 1, minWidth: 0, padding: '10px', fontSize: 13, border: '1.5px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#000', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
      />
    </div>
  );
}

function BarraAccionPreview({ config }: { config: BarraAccionConfig }) {
  const btnBg = config.buttonGradient
    ? `linear-gradient(135deg, ${config.buttonBg}, #0056b3)`
    : config.buttonBg;

  return (
    <div style={{
      background: '#f3f4f6', border: '1.5px solid #e5e7eb', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN PANTALLA MÓVIL / DESKTOP
      </div>

      <div style={{
        background: '#ffffff', borderRadius: 12, height: 200, position: 'relative',
        border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        {/* Simulación del contenido del producto */}
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', opacity: 0.7 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: '#e5e7eb' }} />
            <div>
              <div style={{ width: 120, height: 10, background: '#d1d5db', borderRadius: 4, marginBottom: 4 }} />
              <div style={{ width: 60, height: 8, background: '#e5e7eb', borderRadius: 4 }} />
            </div>
          </div>
        </div>

        {/* Simulación Barra Sticky Inferior */}
        {config.displayMode === 'bar' ? (
          <div style={{
            background: config.barBg, padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: 14, overflow: 'hidden',
              }}>
                💼
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: config.titleColor,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120,
                }}>
                  Billetera compacta
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: config.priceColor }}>
                  $10.000,00
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              style={{
                background: btnBg, color: config.buttonTextColor,
                border: 'none', borderRadius: config.buttonBorderRadius,
                padding: '8px 16px', fontSize: 12,
                fontWeight: config.buttonTextStyle === 'bold' ? 800 : 500,
                cursor: 'default', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: config.buttonEffect === 'aureola' ? `0 0 12px ${config.buttonBg}` : 'none',
              }}
            >
              {config.showCartIcon ? <span>🛒</span> : null}
              <span>{config.buttonText || 'Agregar al carrito'}</span>
            </button>
          </div>
        ) : (
          <div style={{
            padding: 14, display: 'flex', justifyContent: 'center',
            background: 'transparent',
          }}>
            <button
              type="button"
              disabled
              style={{
                width: '100%', maxWidth: 320, background: btnBg, color: config.buttonTextColor,
                border: 'none', borderRadius: config.buttonBorderRadius,
                padding: '12px 20px', fontSize: 14,
                fontWeight: config.buttonTextStyle === 'bold' ? 800 : 500,
                cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: config.buttonEffect === 'aureola' ? `0 0 16px ${config.buttonBg}` : '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {config.showCartIcon ? <span>🛒</span> : null}
              <span>{config.buttonText || 'Agregar al carrito'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BarraAccionEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: BarraAccionEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BarraAccionConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('design');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update(key: keyof BarraAccionConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['barBg', 'titleColor', 'priceColor', 'buttonBg', 'buttonTextColor'].indexOf(String(key)) !== -1) {
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
        barBg: defaultConfig.barBg,
        titleColor: defaultConfig.titleColor,
        priceColor: defaultConfig.priceColor,
        buttonBg: defaultConfig.buttonBg,
        buttonTextColor: defaultConfig.buttonTextColor,
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
        params.set('created', widgetDefinition.slug);
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

  const tabDesign = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel>Diseño del widget:</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div
            onClick={() => update('displayMode', 'bar')}
            style={{
              border: config.displayMode === 'bar' ? '2px solid #007bff' : '1.5px solid #e5e7eb',
              background: config.displayMode === 'bar' ? '#f0f7ff' : '#fff',
              borderRadius: 12, padding: 14, cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>💳 Barra completa</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Barra inferior con imagen, título y precio.</div>
          </div>
          <div
            onClick={() => update('displayMode', 'button')}
            style={{
              border: config.displayMode === 'button' ? '2px solid #007bff' : '1.5px solid #e5e7eb',
              background: config.displayMode === 'button' ? '#f0f7ff' : '#fff',
              borderRadius: 12, padding: 14, cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>🔘 Botón flotante</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Solo el botón, centrado sin barra.</div>
          </div>
        </div>
      </div>

      <CheckboxRow
        checked={config.redirectToCheckout}
        onChange={(v) => update('redirectToCheckout', v)}
        label="Redirigir a /comprar luego de añadir al carrito"
        helper="Por defecto se intenta abrir el carrito lateral (mini-cart) de tu tienda. Si tu tema no tiene carrito rápido, activá esta opción para ir directo a la compra."
      />

      <CheckboxRow
        checked={config.onlyMobile}
        onChange={(v) => update('onlyMobile', v)}
        label="Mostrar únicamente en dispositivos móviles"
        helper="Oculta la barra sticky en pantallas de escritorio."
      />

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <FieldLabel>Texto del botón:</FieldLabel>
        <TextInput value={config.buttonText} onChange={(v) => update('buttonText', v)} placeholder="Agregar al carrito" />
      </div>

      <CheckboxRow
        checked={config.showCartIcon}
        onChange={(v) => update('showCartIcon', v)}
        label="Mostrar icono de carrito"
      />

      <div>
        <FieldLabel>Estilo del texto del botón:</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            type="button"
            onClick={() => update('buttonTextStyle', 'normal')}
            style={{
              padding: '10px', border: config.buttonTextStyle === 'normal' ? '2px solid #007bff' : '1.5px solid #e5e7eb',
              borderRadius: 8, background: '#fff', fontSize: 14, fontWeight: 400, cursor: 'pointer',
            }}
          >
            A Normal
          </button>
          <button
            type="button"
            onClick={() => update('buttonTextStyle', 'bold')}
            style={{
              padding: '10px', border: config.buttonTextStyle === 'bold' ? '2px solid #007bff' : '1.5px solid #e5e7eb',
              borderRadius: 8, background: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            }}
          >
            A Resaltado
          </button>
        </div>
      </div>

      <div>
        <FieldLabel>Borde del botón: {config.buttonBorderRadius}px</FieldLabel>
        <input
          type="range"
          min={0}
          max={25}
          value={config.buttonBorderRadius}
          onChange={(e) => update('buttonBorderRadius', Number(e.target.value))}
          style={{ width: '100%', accentColor: '#007bff' }}
        />
      </div>

      <div>
        <FieldLabel>Efecto del botón:</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            type="button"
            onClick={() => update('buttonEffect', 'none')}
            style={{
              padding: '10px', border: config.buttonEffect === 'none' ? '2px solid #007bff' : '1.5px solid #e5e7eb',
              borderRadius: 8, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Nada
          </button>
          <button
            type="button"
            onClick={() => update('buttonEffect', 'aureola')}
            style={{
              padding: '10px', border: config.buttonEffect === 'aureola' ? '2px solid #007bff' : '1.5px solid #e5e7eb',
              borderRadius: 8, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            ✨ Aureola
          </button>
        </div>
      </div>
    </div>
  );

  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {config.displayMode === 'bar' ? (
        <>
          <div>
            <FieldLabel>Color de la barra:</FieldLabel>
            <ColorPickerField value={config.barBg} onChange={(v) => update('barBg', v)} />
          </div>
          <div>
            <FieldLabel>Color del título:</FieldLabel>
            <ColorPickerField value={config.titleColor} onChange={(v) => update('titleColor', v)} />
          </div>
          <div>
            <FieldLabel>Color del precio:</FieldLabel>
            <ColorPickerField value={config.priceColor} onChange={(v) => update('priceColor', v)} />
          </div>
        </>
      ) : null}

      <div>
        <FieldLabel>Color del botón:</FieldLabel>
        <ColorPickerField value={config.buttonBg} onChange={(v) => update('buttonBg', v)} />
      </div>

      <div>
        <FieldLabel>Color del texto del botón:</FieldLabel>
        <ColorPickerField value={config.buttonTextColor} onChange={(v) => update('buttonTextColor', v)} />
      </div>

      <CheckboxRow
        checked={config.buttonGradient}
        onChange={(v) => update('buttonGradient', v)}
        label="Fondo en degradé"
        helper="Aplica una transición sutil de color al botón."
      />
    </div>
  );

  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto a la barra.</FieldHelper>
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
              {preset.id !== 'none' && preset.themeColor ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: preset.themeColor, border: '1px solid #d1d5db' }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: preset.accentColor, border: '1px solid #d1d5db' }} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );

  const tabs = [
    { id: 'design', label: 'Estilo' },
    { id: 'estilos', label: 'Colores' },
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
            <span>NEVUX Widget de Producto</span>
          </div>
        )}

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#000', margin: '0 0 20px', lineHeight: 1.2 }}>
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ marginBottom: 20 }}>
            <BarraAccionPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              La Barra de Acción permanece fija al hacer scroll en las fichas de producto para que el comprador siempre tenga a mano el botón "Agregar al carrito" sin perderse.
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
            {activeTab === 'design' ? tabDesign : null}
            {activeTab === 'estilos' ? tabEstilos : null}
            {activeTab === 'fechas' ? tabFechas : null}
          </div>

          <div style={{
            marginTop: 32, paddingTop: 20, borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            <ToggleField checked={isActive} onChange={setIsActive} label="Widget activo" />
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
