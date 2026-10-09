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

interface MensajeGarantiaEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface MensajeGarantiaConfig {
  title: string;
  text: string;
  iconType: 'preset' | 'image';
  presetIcon: string;
  imageUrl: string;
  showOnProductPage: boolean;
  showOnCart: boolean;
  bgColor: string;
  titleColor: string;
  textColor: string;
  borderColor: string;
  titleFontSize: number;
  textFontSize: number;
  borderRadius: number;
  padding: number;
  marginTop: number;
  marginBottom: number;
  campaignTheme?: string;
}

const defaultConfig: MensajeGarantiaConfig = {
  title: 'Garantía de 60 días',
  text: 'Confiamos en los resultados del producto. Si no te gusta podés devolverlo y te reintegramos el total de tu compra.',
  iconType: 'preset',
  presetIcon: '🛡️',
  imageUrl: '',
  showOnProductPage: true,
  showOnCart: false,
  bgColor: '#fff9f3',
  titleColor: '#000000',
  textColor: '#333333',
  borderColor: '#e7dec8',
  titleFontSize: 16,
  textFontSize: 14,
  borderRadius: 12,
  padding: 16,
  marginTop: 16,
  marginBottom: 16,
  campaignTheme: 'none',
};

const PRESET_ICONS = [
  { id: '🛡️', label: 'Escudo' },
  { id: '🔒', label: 'Candado' },
  { id: '✅', label: 'Verificado' },
  { id: '🏆', label: 'Garantía' },
  { id: '⭐', label: 'Estrella' },
  { id: '🚚', label: 'Envío' },
  { id: '💳', label: 'Pago' },
];

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + borde dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul oscuro + texto rojo.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético + borde azul.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino + texto blanco.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa suave de confianza.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Índigo premium + borde verde.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo sale + borde amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, Partial<MensajeGarantiaConfig>> = {
  'black-friday': { bgColor: '#111827', titleColor: '#F59E0B', textColor: '#ffffff', borderColor: '#F59E0B' },
  'hot-sale': { bgColor: '#0F172A', titleColor: '#EF4444', textColor: '#ffffff', borderColor: '#EF4444' },
  'cyber-monday': { bgColor: '#090D16', titleColor: '#3B82F6', textColor: '#ffffff', borderColor: '#3B82F6' },
  'navidad': { bgColor: '#064E3B', titleColor: '#ffffff', textColor: '#ecfdf5', borderColor: '#10B981' },
  'san-valentin': { bgColor: '#fdf2f8', titleColor: '#831843', textColor: '#9d174d', borderColor: '#fbcfe8' },
  'dia-padre-madre': { bgColor: '#312E81', titleColor: '#10B981', textColor: '#ffffff', borderColor: '#10B981' },
  'liquidacion': { bgColor: '#7F1D1D', titleColor: '#FBBF24', textColor: '#ffffff', borderColor: '#FBBF24' },
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

function TextAreaInput({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical',
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

function MensajeGarantiaPreview({ config }: { config: MensajeGarantiaConfig }) {
  return (
    <div style={{
      background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN TU TIENDA
      </div>

      <div style={{
        background: config.bgColor,
        border: `1.5px solid ${config.borderColor}`,
        borderRadius: config.borderRadius,
        padding: config.padding,
        marginTop: config.marginTop / 2,
        marginBottom: config.marginBottom / 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: 'rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          overflow: 'hidden',
        }}>
          {config.iconType === 'image' && config.imageUrl ? (
            <img src={config.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 24 }}>{config.presetIcon || '🛡️'}</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {config.title ? (
            <div style={{
              fontSize: config.titleFontSize,
              fontWeight: 800,
              color: config.titleColor,
              marginBottom: 4,
              lineHeight: 1.3,
            }}>
              {config.title}
            </div>
          ) : null}

          {config.text ? (
            <div style={{
              fontSize: config.textFontSize,
              color: config.textColor,
              lineHeight: 1.5,
              opacity: 0.9,
            }}>
              {config.text}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MensajeGarantiaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: MensajeGarantiaEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<MensajeGarantiaConfig>(() => ({
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

  function update(key: keyof MensajeGarantiaConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['bgColor', 'titleColor', 'textColor', 'borderColor'].indexOf(String(key)) !== -1) {
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
        titleColor: defaultConfig.titleColor,
        textColor: defaultConfig.textColor,
        borderColor: defaultConfig.borderColor,
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
        <FieldLabel>Título (opcional):</FieldLabel>
        <TextInput value={config.title} onChange={(v) => update('title', v)} placeholder="Garantía de 60 días" maxLength={80} />
        <FieldHelper>Título principal del mensaje de garantía.</FieldHelper>
      </div>

      <div>
        <FieldLabel>Texto (opcional):</FieldLabel>
        <TextAreaInput value={config.text} onChange={(v) => update('text', v)} placeholder="Confiamos en los resultados del producto. Si no te gusta podés devolverlo..." rows={4} />
        <FieldHelper>Descripción detallada de la garantía o política de devolución.</FieldHelper>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <FieldLabel>Icono / Imagen decorativa:</FieldLabel>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => update('iconType', 'preset')}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: config.iconType === 'preset' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: config.iconType === 'preset' ? '#ecfdf5' : '#fff', color: '#111827',
            }}
          >
            Usar Emoji Predefinido
          </button>
          <button
            type="button"
            onClick={() => update('iconType', 'image')}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: config.iconType === 'image' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: config.iconType === 'image' ? '#ecfdf5' : '#fff', color: '#111827',
            }}
          >
            Imagen por URL
          </button>
        </div>

        {config.iconType === 'preset' ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PRESET_ICONS.map((p) => {
              const sel = config.presetIcon === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update('presetIcon', p.id)}
                  style={{
                    padding: '8px 12px', borderRadius: 8,
                    border: sel ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                    background: sel ? '#ecfdf5' : '#fff', cursor: 'pointer', fontSize: 18,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <span>{p.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{p.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <TextInput value={config.imageUrl} onChange={(v) => update('imageUrl', v)} placeholder="https://mitienda.com/imagen-garantia.png" />
            <FieldHelper>Ingresá la URL directa de la imagen (PNG o JPG).</FieldHelper>
          </div>
        )}
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <CheckboxRow
          checked={config.showOnProductPage}
          onChange={(v) => update('showOnProductPage', v)}
          label="Mostrar en la ficha de producto"
          helper="El widget aparecerá justo debajo del botón Agregar al carrito en la página del producto."
        />
      </div>

      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <CheckboxRow
          checked={config.showOnCart}
          onChange={(v) => update('showOnCart', v)}
          label="Mostrar en el carrito de compras"
          helper="El widget aparecerá también en el modal del carrito o página de carrito."
        />
      </div>
    </div>
  );

  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🎨 Colores Principales</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
          </div>
          <div>
            <FieldLabel>Color del título</FieldLabel>
            <ColorPickerField value={config.titleColor} onChange={(v) => update('titleColor', v)} />
          </div>
          <div>
            <FieldLabel>Color del texto</FieldLabel>
            <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
          </div>
          <div>
            <FieldLabel>Color del borde</FieldLabel>
            <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🔤 Tipografías</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <FieldLabel>Tamaño del título</FieldLabel>
            <SelectField
              value={String(config.titleFontSize)}
              onChange={(v) => update('titleFontSize', Number(v))}
              options={[
                { value: '14', label: '14px - Pequeño' },
                { value: '16', label: '16px - Normal' },
                { value: '18', label: '18px - Grande' },
                { value: '20', label: '20px - Extra Grande' },
              ]}
            />
          </div>
          <div>
            <FieldLabel>Tamaño del texto</FieldLabel>
            <SelectField
              value={String(config.textFontSize)}
              onChange={(v) => update('textFontSize', Number(v))}
              options={[
                { value: '12', label: '12px - Pequeño' },
                { value: '14', label: '14px - Normal' },
                { value: '16', label: '16px - Grande' },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>⚙️ Márgenes y Bordes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Bordes redondeados: {config.borderRadius}px</FieldLabel>
            <input
              type="range" min={0} max={25} value={config.borderRadius}
              onChange={(e) => update('borderRadius', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Margen interno (padding): {config.padding}px</FieldLabel>
            <input
              type="range" min={8} max={30} value={config.padding}
              onChange={(e) => update('padding', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Margen superior externo: {config.marginTop}px</FieldLabel>
            <input
              type="range" min={0} max={50} value={config.marginTop}
              onChange={(e) => update('marginTop', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Margen inferior externo: {config.marginBottom}px</FieldLabel>
            <input
              type="range" min={0} max={50} value={config.marginBottom}
              onChange={(e) => update('marginBottom', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto al mensaje de garantía.</FieldHelper>
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
            <MensajeGarantiaPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Muestra una caja destacada con tu política de devolución o garantía para eliminar las dudas del cliente antes de presionar "Agregar al carrito".
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
