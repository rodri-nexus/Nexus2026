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

interface BannerSuperiorEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface BannerSuperiorConfig {
  text: string;
  buttonText: string;
  buttonUrl: string;
  openInNewTab: boolean;
  showCloseButton: boolean;
  position: 'top' | 'bottom';
  bgColor: string;
  bgGradient: boolean;
  buttonColor: string;
  btnGradient: boolean;
  textColor: string;
  buttonTextColor: string;
  textFontSize: number;
  buttonFontSize: number;
  buttonFontWeight: 'normal' | 'bold';
  buttonBorderRadius: number;
  padding: number;
  campaignTheme?: string;
}

const defaultConfig: BannerSuperiorConfig = {
  text: '¡Bienvenido a nuestra tienda! Aprovechá las mejores ofertas.',
  buttonText: 'Ver ofertas',
  buttonUrl: '/ofertas',
  openInNewTab: false,
  showCloseButton: true,
  position: 'top',
  bgColor: '#1e1e1e',
  bgGradient: false,
  buttonColor: '#ffffff',
  btnGradient: false,
  textColor: '#ffffff',
  buttonTextColor: '#000000',
  textFontSize: 14,
  buttonFontSize: 13,
  buttonFontWeight: 'bold',
  buttonBorderRadius: 5,
  padding: 10,
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + botón dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul + botón rojo.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético + botón azul.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Fondo verde pino + texto blanco.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Fondo borgoña + botón rosa.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Fondo índigo + botón verde.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Fondo rojo sale + botón amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, Partial<BannerSuperiorConfig>> = {
  'black-friday': { bgColor: '#111827', buttonColor: '#F59E0B', textColor: '#ffffff', buttonTextColor: '#000000' },
  'hot-sale': { bgColor: '#0F172A', buttonColor: '#EF4444', textColor: '#ffffff', buttonTextColor: '#ffffff' },
  'cyber-monday': { bgColor: '#090D16', buttonColor: '#3B82F6', textColor: '#ffffff', buttonTextColor: '#ffffff' },
  'navidad': { bgColor: '#064E3B', buttonColor: '#EF4444', textColor: '#ffffff', buttonTextColor: '#ffffff' },
  'san-valentin': { bgColor: '#831843', buttonColor: '#F43F5E', textColor: '#ffffff', buttonTextColor: '#ffffff' },
  'dia-padre-madre': { bgColor: '#312E81', buttonColor: '#10B981', textColor: '#ffffff', buttonTextColor: '#ffffff' },
  'liquidacion': { bgColor: '#7F1D1D', buttonColor: '#FBBF24', textColor: '#ffffff', buttonTextColor: '#000000' },
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

function BannerSuperiorPreview({ config }: { config: BannerSuperiorConfig }) {
  const bgStyle = config.bgGradient
    ? `linear-gradient(135deg, ${config.bgColor}, #000000)`
    : config.bgColor;

  const btnBgStyle = config.btnGradient
    ? `linear-gradient(135deg, ${config.buttonColor}, #e5e7eb)`
    : config.buttonColor;

  return (
    <div style={{
      background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA DEL BANNER
      </div>

      <div style={{
        background: bgStyle,
        color: config.textColor,
        borderRadius: 8,
        padding: config.padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        position: 'relative',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: config.textFontSize,
          color: config.textColor,
          fontWeight: 600,
          lineHeight: 1.3,
          flex: 1,
        }}>
          {config.text || 'Escribí aquí el mensaje del banner...'}
        </div>

        {config.buttonText ? (
          <div style={{
            background: btnBgStyle,
            color: config.buttonTextColor,
            fontSize: config.buttonFontSize,
            fontWeight: config.buttonFontWeight === 'bold' ? 800 : 500,
            borderRadius: config.buttonBorderRadius,
            padding: '6px 14px',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}>
            {config.buttonText}
          </div>
        ) : null}

        {config.showCloseButton ? (
          <div style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 14,
            fontWeight: 800,
            color: config.textColor,
            opacity: 0.7,
            cursor: 'pointer',
          }}>
            ✕
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function BannerSuperiorEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: BannerSuperiorEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BannerSuperiorConfig>(() => ({
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

  function update(key: keyof BannerSuperiorConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['bgColor', 'buttonColor', 'textColor', 'buttonTextColor'].indexOf(String(key)) !== -1) {
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
        buttonColor: defaultConfig.buttonColor,
        textColor: defaultConfig.textColor,
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

  const tabGeneral = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel required>Texto del banner:</FieldLabel>
        <TextAreaInput
          value={config.text}
          onChange={(v) => update('text', v)}
          placeholder="¡Bienvenido a nuestra tienda! Aprovechá las mejores ofertas."
          rows={3}
        />
        <FieldHelper>Mensaje principal que aparecerá dentro de la barra.</FieldHelper>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <FieldLabel>Botón (opcional):</FieldLabel>
        <TextInput
          value={config.buttonText}
          onChange={(v) => update('buttonText', v)}
          placeholder="Ej: Ver ofertas"
          maxLength={40}
        />
        <FieldHelper>Si se deja vacío, no se mostrará ningún botón.</FieldHelper>
      </div>

      <div>
        <FieldLabel>URL del botón (opcional):</FieldLabel>
        <TextInput
          value={config.buttonUrl}
          onChange={(v) => update('buttonUrl', v)}
          placeholder="https://tutienda.com/ofertas"
        />
      </div>

      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <CheckboxRow
          checked={config.openInNewTab}
          onChange={(v) => update('openInNewTab', v)}
          label="Abrir enlace en una nueva pestaña"
        />

        <CheckboxRow
          checked={config.showCloseButton}
          onChange={(v) => update('showCloseButton', v)}
          label='Mostrar botón "X" para cerrar'
          helper="El visitante podrá cerrar el banner haciendo clic en la X."
        />
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Posición del banner</div>

      <div
        onClick={() => update('position', 'top')}
        style={{
          background: config.position === 'top' ? '#ecfdf5' : '#fff',
          border: config.position === 'top' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
          borderRadius: 12, padding: 16, cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="radio" checked={config.position === 'top'} onChange={() => {}} className="accent-emerald-500" />
          <span>Parte superior de la pantalla</span>
        </div>
        <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.4, paddingLeft: 24 }}>
          El banner queda fijo en la parte superior de la pantalla, siempre visible mientras el visitante navega.
        </div>
      </div>

      <div
        onClick={() => update('position', 'bottom')}
        style={{
          background: config.position === 'bottom' ? '#ecfdf5' : '#fff',
          border: config.position === 'bottom' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
          borderRadius: 12, padding: 16, cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="radio" checked={config.position === 'bottom'} onChange={() => {}} className="accent-emerald-500" />
          <span>Parte inferior de la pantalla</span>
        </div>
        <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.4, paddingLeft: 24 }}>
          El banner queda fijo en la parte inferior de la pantalla, siempre visible mientras el visitante navega.
        </div>
      </div>
    </div>
  );

  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🎨 Colores del Banner y Botón</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
            <div style={{ marginTop: 8 }}>
              <CheckboxRow
                checked={config.bgGradient}
                onChange={(v) => update('bgGradient', v)}
                label="Fondo en degradé"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Color del botón</FieldLabel>
            <ColorPickerField value={config.buttonColor} onChange={(v) => update('buttonColor', v)} />
            <div style={{ marginTop: 8 }}>
              <CheckboxRow
                checked={config.btnGradient}
                onChange={(v) => update('btnGradient', v)}
                label="Color en degradé"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Color del texto</FieldLabel>
            <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
          </div>

          <div>
            <FieldLabel>Color del texto del botón</FieldLabel>
            <ColorPickerField value={config.buttonTextColor} onChange={(v) => update('buttonTextColor', v)} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🔤 Tipografías</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <FieldLabel>Tamaño del texto</FieldLabel>
            <SelectField
              value={String(config.textFontSize)}
              onChange={(v) => update('textFontSize', Number(v))}
              options={[
                { value: '12', label: '12 px' },
                { value: '13', label: '13 px' },
                { value: '14', label: '14 px' },
                { value: '15', label: '15 px' },
                { value: '16', label: '16 px' },
              ]}
            />
          </div>

          <div>
            <FieldLabel>Tamaño del texto del botón</FieldLabel>
            <SelectField
              value={String(config.buttonFontSize)}
              onChange={(v) => update('buttonFontSize', Number(v))}
              options={[
                { value: '11', label: '11 px' },
                { value: '12', label: '12 px' },
                { value: '13', label: '13 px' },
                { value: '14', label: '14 px' },
              ]}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <FieldLabel>Estilo del texto del botón</FieldLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => update('buttonFontWeight', 'normal')}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                border: config.buttonFontWeight === 'normal' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.buttonFontWeight === 'normal' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              A Normal
            </button>
            <button
              type="button"
              onClick={() => update('buttonFontWeight', 'bold')}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.buttonFontWeight === 'bold' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.buttonFontWeight === 'bold' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              A Resaltado
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>⚙️ Márgenes y Bordes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Borde redondeado del botón: {config.buttonBorderRadius}px</FieldLabel>
            <input
              type="range" min={0} max={25} value={config.buttonBorderRadius}
              onChange={(e) => update('buttonBorderRadius', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Espaciado interior (padding): {config.padding}px</FieldLabel>
            <input
              type="range" min={4} max={30} value={config.padding}
              onChange={(e) => update('padding', Number(e.target.value))}
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
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto al banner.</FieldHelper>
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
            <BannerSuperiorPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Muestra un banner fijo en la parte superior o inferior de la pantalla con texto enriquecido y botón opcional de llamado a la acción.
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
