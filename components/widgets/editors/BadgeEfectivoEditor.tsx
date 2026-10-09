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

interface BadgeEfectivoEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface BadgeEfectivoConfig {
  discountPercent: number;
  messageType: 'percent' | 'price';
  customTextPercent: string;
  customTextPrice: string;
  showCoinIcon: boolean;
  badgeText: string;
  bounceEffect: boolean;
  badgePosition: 'top-right' | 'end-text';
  showOnProductPage: boolean;
  showOnGrid: boolean;
  bgColor: string;
  textColor: string;
  gradientBg: boolean;
  fontSize: number;
  animation: 'none' | 'aureola' | 'zoom';
  badgeBgColor: string;
  badgeTextColor: string;
  padding: number;
  borderRadius: number;
  marginTop: number;
  marginBottom: number;
  showBorder: boolean;
  borderColor: string;
  campaignTheme?: string;
}

const defaultConfig: BadgeEfectivoConfig = {
  discountPercent: 10,
  messageType: 'percent',
  customTextPercent: '{descuento}% de descuento pagando en efectivo',
  customTextPrice: '${precio} pagando en efectivo',
  showCoinIcon: true,
  badgeText: 'OFERTA',
  bounceEffect: false,
  badgePosition: 'top-right',
  showOnProductPage: true,
  showOnGrid: false,
  bgColor: '#f3f4f6',
  textColor: '#111827',
  gradientBg: false,
  fontSize: 13,
  animation: 'none',
  badgeBgColor: '#ef4444',
  badgeTextColor: '#ffffff',
  padding: 10,
  borderRadius: 20,
  marginTop: 10,
  marginBottom: 10,
  showBorder: false,
  borderColor: '#e5e7eb',
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + badge dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul oscuro + badge rojo.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Estilo neón cibernético.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde festivo + badge rojo.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Índigo premium con esmeralda.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí + amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, Partial<BadgeEfectivoConfig>> = {
  'black-friday': { bgColor: '#111827', textColor: '#ffffff', badgeBgColor: '#F59E0B', badgeTextColor: '#111827' },
  'hot-sale': { bgColor: '#0F172A', textColor: '#ffffff', badgeBgColor: '#EF4444', badgeTextColor: '#ffffff' },
  'cyber-monday': { bgColor: '#090D16', textColor: '#ffffff', badgeBgColor: '#3B82F6', badgeTextColor: '#ffffff' },
  'navidad': { bgColor: '#064E3B', textColor: '#ffffff', badgeBgColor: '#EF4444', badgeTextColor: '#ffffff' },
  'san-valentin': { bgColor: '#fdf2f8', textColor: '#831843', badgeBgColor: '#F43F5E', badgeTextColor: '#ffffff' },
  'dia-padre-madre': { bgColor: '#312E81', textColor: '#ffffff', badgeBgColor: '#10B981', badgeTextColor: '#ffffff' },
  'liquidacion': { bgColor: '#7F1D1D', textColor: '#ffffff', badgeBgColor: '#FBBF24', badgeTextColor: '#7F1D1D' },
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

function NumberInput({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
      }}
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

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
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

function BadgeEfectivoPreview({ config }: { config: BadgeEfectivoConfig }) {
  const basePrice = 10000;
  const discountedPrice = basePrice * (1 - (config.discountPercent || 0) / 100);
  const formattedDiscounted = '$' + Math.round(discountedPrice).toLocaleString('es-AR');

  let rawText = config.messageType === 'percent'
    ? config.customTextPercent || '{descuento}% de descuento pagando en efectivo'
    : config.customTextPrice || '${precio} pagando en efectivo';

  rawText = rawText.replace('{descuento}', String(config.discountPercent || 10));
  rawText = rawText.replace('{precio}', formattedDiscounted);

  const containerBg = config.gradientBg
    ? `linear-gradient(135deg, ${config.bgColor}, #e5e7eb)`
    : config.bgColor;

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA DEBAJO DEL PRECIO
      </div>

      <div style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Precio habitual</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>$10.000,00</div>
      </div>

      <div style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: containerBg,
        color: config.textColor,
        fontSize: config.fontSize,
        fontWeight: 600,
        padding: config.padding,
        borderRadius: config.borderRadius,
        border: config.showBorder ? `1px solid ${config.borderColor}` : 'none',
        marginTop: config.marginTop / 2,
        marginBottom: config.marginBottom / 2,
        boxShadow: config.animation === 'aureola' ? `0 0 12px ${config.badgeBgColor}` : 'none',
      }}>
        {config.badgeText && config.badgePosition === 'top-right' ? (
          <span style={{
            position: 'absolute', top: -8, right: 10,
            background: config.badgeBgColor, color: config.badgeTextColor,
            fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4,
            textTransform: 'uppercase', letterSpacing: '0.03em',
            boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
          }}>
            {config.badgeText}
          </span>
        ) : null}

        {config.showCoinIcon ? <span style={{ fontSize: config.fontSize + 2 }}>💵</span> : null}

        <span>{rawText}</span>

        {config.badgeText && config.badgePosition === 'end-text' ? (
          <span style={{
            background: config.badgeBgColor, color: config.badgeTextColor,
            fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4,
            textTransform: 'uppercase', letterSpacing: '0.03em', marginLeft: 4,
          }}>
            {config.badgeText}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function BadgeEfectivoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: BadgeEfectivoEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BadgeEfectivoConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update(key: keyof BadgeEfectivoConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['bgColor', 'textColor', 'badgeBgColor', 'badgeTextColor', 'borderColor'].indexOf(String(key)) !== -1) {
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
        bgColor: defaultConfig.bgColor,
        textColor: defaultConfig.textColor,
        badgeBgColor: defaultConfig.badgeBgColor,
        badgeTextColor: defaultConfig.badgeTextColor,
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

  const tabGeneral = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel required>% de descuento con efectivo</FieldLabel>
        <NumberInput value={config.discountPercent} onChange={(v) => update('discountPercent', v)} min={1} max={90} />
        <FieldHelper>Porcentaje de ahorro al abonar en efectivo / transferencia.</FieldHelper>
      </div>

      <div>
        <FieldLabel>Formato del mensaje:</FieldLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            onClick={() => update('messageType', 'percent')}
            style={{
              border: config.messageType === 'percent' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: config.messageType === 'percent' ? '#ecfdf5' : '#fff',
              borderRadius: 12, padding: 14, cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>% de descuento con efectivo</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Muestra el porcentaje directo (ej: 10% OFF en efectivo).</div>
          </div>

          <div
            onClick={() => update('messageType', 'price')}
            style={{
              border: config.messageType === 'price' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: config.messageType === 'price' ? '#ecfdf5' : '#fff',
              borderRadius: 12, padding: 14, cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Precio con efectivo ($X)</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Muestra el monto final calculado en pesos (ej: $9.000 pagando en efectivo).</div>
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Texto del mensaje:</FieldLabel>
        {config.messageType === 'percent' ? (
          <div>
            <TextInput value={config.customTextPercent} onChange={(v) => update('customTextPercent', v)} placeholder="{descuento}% de descuento pagando en efectivo" />
            <FieldHelper>Usá <strong>{'{descuento}'}</strong> para insertar el porcentaje automáticamente.</FieldHelper>
          </div>
        ) : (
          <div>
            <TextInput value={config.customTextPrice} onChange={(v) => update('customTextPrice', v)} placeholder="${precio} pagando en efectivo" />
            <FieldHelper>Usá <strong>{'{precio}'}</strong> para insertar el precio ya descontado automáticamente.</FieldHelper>
          </div>
        )}
      </div>

      <CheckboxRow
        checked={config.showCoinIcon}
        onChange={(v) => update('showCoinIcon', v)}
        label="Mostrar icono de billete / moneda"
      />

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <FieldLabel>Badge destacado (opcional):</FieldLabel>
        <TextInput value={config.badgeText} onChange={(v) => update('badgeText', v)} placeholder="Ej: OFERTA" maxLength={15} />
        <FieldHelper>Etiqueta flotante llamativa. Dejá vacío para no mostrarla.</FieldHelper>
      </div>

      {config.badgeText ? (
        <div>
          <FieldLabel>Posición del badge:</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="button"
              onClick={() => update('badgePosition', 'top-right')}
              style={{
                padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.badgePosition === 'top-right' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.badgePosition === 'top-right' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              Esquina superior
            </button>
            <button
              type="button"
              onClick={() => update('badgePosition', 'end-text')}
              style={{
                padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.badgePosition === 'end-text' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.badgePosition === 'end-text' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              Al final del texto
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <CheckboxRow
          checked={config.showOnProductPage}
          onChange={(v) => update('showOnProductPage', v)}
          label="Mostrar en ficha de producto"
          helper="El badge se ubica justo debajo del precio del producto en la página individual."
        />
      </div>

      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <CheckboxRow
          checked={config.showOnGrid}
          onChange={(v) => update('showOnGrid', v)}
          label="Mostrar en grilla de productos (Home / Listados)"
          helper="Aparece debajo del precio en las tarjetas de productos de la tienda."
        />
      </div>
    </div>
  );

  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🎨 Colores del mensaje</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
          </div>
          <div>
            <FieldLabel>Color del texto</FieldLabel>
            <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <CheckboxRow checked={config.gradientBg} onChange={(v) => update('gradientBg', v)} label="Fondo en degradé" />
        </div>
      </div>

      {config.badgeText ? (
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🏷️ Colores del Badge Flotante</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <FieldLabel>Fondo del badge</FieldLabel>
              <ColorPickerField value={config.badgeBgColor} onChange={(v) => update('badgeBgColor', v)} />
            </div>
            <div>
              <FieldLabel>Texto del badge</FieldLabel>
              <ColorPickerField value={config.badgeTextColor} onChange={(v) => update('badgeTextColor', v)} />
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🔤 Tipografía y Animación</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <FieldLabel>Tamaño de texto</FieldLabel>
            <SelectField
              value={String(config.fontSize)}
              onChange={(v) => update('fontSize', Number(v))}
              options={[
                { value: '11', label: '11px - Pequeño' },
                { value: '13', label: '13px - Normal' },
                { value: '15', label: '15px - Grande' },
              ]}
            />
          </div>

          <div>
            <FieldLabel>Efecto de animación:</FieldLabel>
            <SelectField
              value={config.animation}
              onChange={(v) => update('animation', v as any)}
              options={[
                { value: 'none', label: 'Sin efecto (estático)' },
                { value: 'aureola', label: '✨ Aureola resplandeciente' },
                { value: 'zoom', label: '🔍 Zoom / Rebote suave' },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>⚙️ Contenedor y Bordes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Bordes redondeados: {config.borderRadius}px</FieldLabel>
            <input type="range" min={0} max={25} value={config.borderRadius} onChange={(e) => update('borderRadius', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Padding interno: {config.padding}px</FieldLabel>
            <input type="range" min={4} max={20} value={config.padding} onChange={(e) => update('padding', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Margen superior: {config.marginTop}px</FieldLabel>
            <input type="range" min={0} max={40} value={config.marginTop} onChange={(e) => update('marginTop', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Margen inferior: {config.marginBottom}px</FieldLabel>
            <input type="range" min={0} max={40} value={config.marginBottom} onChange={(e) => update('marginBottom', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <CheckboxRow checked={config.showBorder} onChange={(v) => update('showBorder', v)} label="Mostrar borde sutil" />
          {config.showBorder ? (
            <div>
              <FieldLabel>Color del borde</FieldLabel>
              <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto al badge.</FieldHelper>
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
            <BadgeEfectivoPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              El Badge de Efectivo muestra el descuento o precio final con pago en efectivo debajo del precio nativo del producto para impulsar la venta inmediata.
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
