// components/widgets/editors/EdicionLimitadaEditor.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
export interface EdicionLimitadaConfig {
  textoPrincipal: string;
  subtexto: string;
  forma: 'circular' | 'badge-rect' | 'cinta-diagonal' | 'sello-borde';
  posicion: 'esquina-superior-derecha' | 'esquina-superior-izquierda' | 'inline-precio';
  rotacion: number;
  efecto: 'sin-efecto' | 'brillo-pulsante' | 'zoom-suave';
  tamano: 'chico' | 'mediano' | 'grande';
  colorFondo: string;
  colorTexto: string;
  colorBorde: string;
  mostrarBorde: boolean;
  mostrarEnProducto: boolean;
  mostrarEnGrilla: boolean;
  campaignTheme?: string;
}

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

interface EdicionLimitadaEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES Y PRESETS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const defaultConfig: EdicionLimitadaConfig = {
  textoPrincipal: 'EDICIÓN LIMITADA',
  subtexto: 'Solo 50 piezas',
  forma: 'circular',
  posicion: 'esquina-superior-derecha',
  rotacion: -8,
  efecto: 'brillo-pulsante',
  tamano: 'mediano',
  colorFondo: '#111827',
  colorTexto: '#F59E0B',
  colorBorde: '#F59E0B',
  mostrarBorde: true,
  mostrarEnProducto: true,
  mostrarEnGrilla: true,
  campaignTheme: 'none',
};

const CAMPAIGN_COLORS: Record<string, { bg: string; text: string; border: string; label?: string }> = {
  'black-friday': { bg: '#111827', text: '#F59E0B', border: '#F59E0B' },
  'hot-sale': { bg: '#0F172A', text: '#EF4444', border: '#EF4444' },
  'cyber-monday': { bg: '#090D16', text: '#3B82F6', border: '#3B82F6' },
  'navidad': { bg: '#064E3B', text: '#EF4444', border: '#EF4444' },
  'san-valentin': { bg: '#831843', text: '#F43F5E', border: '#F43F5E' },
  'dia-padre-madre': { bg: '#312E81', text: '#10B981', border: '#10B981' },
  'liquidacion': { bg: '#7F1D1D', text: '#FBBF24', border: '#FBBF24' },
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro mate con dorado metalizado.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Diseño deportivo con rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo nocturno y acento azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino tradicional con acento rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con acento esmeralda alegre.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí de urgencia extrema.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

/* ═══════════════════════════════════════════
   ICONOS SVG (Regla #9 al inicio)
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
   PREVIEW INTEGRADO (antes EdicionLimitadaPreview.tsx)
═══════════════════════════════════════════ */
function EdicionLimitadaPreview({ config }: { config: EdicionLimitadaConfig }) {
  const theme = config.campaignTheme && config.campaignTheme !== 'none'
    ? CAMPAIGN_COLORS[config.campaignTheme]
    : null;

  const bg = theme ? theme.bg : config.colorFondo;
  const color = theme ? theme.text : config.colorTexto;
  const borderColor = theme ? theme.border : config.colorBorde;

  const scaleMultiplier = config.tamano === 'chico' ? 0.85 : config.tamano === 'grande' ? 1.15 : 1;

  const renderSticker = () => {
    const rotationStyle = {
      transform: `rotate(${config.rotacion}deg) scale(${scaleMultiplier})`,
      transformOrigin: 'center center',
      transition: 'all 0.2s ease',
    };

    if (config.forma === 'circular') {
      return (
        <div
          style={{
            ...rotationStyle,
            width: 82,
            height: 82,
            borderRadius: '50%',
            background: bg,
            color: color,
            border: config.mostrarBorde ? `2px dashed ${borderColor}` : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 6,
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 13, lineHeight: 1 }}>✨</span>
          <span style={{ fontSize: 9.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
            {config.textoPrincipal || 'EDICIÓN LIMITADA'}
          </span>
          {config.subtexto && (
            <span style={{ fontSize: 7.5, opacity: 0.9, marginTop: 2, fontWeight: 700, lineHeight: 1 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      );
    }

    if (config.forma === 'cinta-diagonal') {
      return (
        <div
          style={{
            ...rotationStyle,
            background: bg,
            color: color,
            borderTop: config.mostrarBorde ? `1.5px solid ${borderColor}` : 'none',
            borderBottom: config.mostrarBorde ? `1.5px solid ${borderColor}` : 'none',
            padding: '4px 18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            ✦ {config.textoPrincipal || 'EDICIÓN LIMITADA'} ✦
          </span>
          {config.subtexto && (
            <span style={{ fontSize: 7.5, opacity: 0.9, fontWeight: 700 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      );
    }

    if (config.forma === 'sello-borde') {
      return (
        <div
          style={{
            ...rotationStyle,
            background: bg,
            color: color,
            border: `2px solid ${borderColor}`,
            borderRadius: 6,
            padding: '6px 12px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            outline: config.mostrarBorde ? `1.5px dashed ${borderColor}` : 'none',
            outlineOffset: 3,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10 }}>🏷️</span>
            <span style={{ fontSize: 10.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              {config.textoPrincipal || 'EDICIÓN LIMITADA'}
            </span>
          </div>
          {config.subtexto && (
            <span style={{ fontSize: 8, opacity: 0.9, marginTop: 3, fontWeight: 700 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          ...rotationStyle,
          background: bg,
          color: color,
          border: config.mostrarBorde ? `1.5px solid ${borderColor}` : 'none',
          borderRadius: 999,
          padding: '6px 14px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 11 }}>🔥</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 10.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
            {config.textoPrincipal || 'EDICIÓN LIMITADA'}
          </span>
          {config.subtexto && (
            <span style={{ fontSize: 8, opacity: 0.9, fontWeight: 700, lineHeight: 1 }}>
              {config.subtexto}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #e5e7eb',
        borderRadius: 14,
        padding: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN PRODUCTO
      </div>

      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 14,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 110,
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          👟
          {config.posicion !== 'inline-precio' && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                ...(config.posicion === 'esquina-superior-izquierda' ? { left: 8 } : { right: 8 }),
                zIndex: 2,
              }}
            >
              {renderSticker()}
            </div>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>
            Zapatillas Air Edition Pro
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#10B981', marginTop: 2 }}>
            $ 89.990
          </div>

          {config.posicion === 'inline-precio' && (
            <div style={{ marginTop: 10, display: 'inline-flex' }}>
              {renderSticker()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTES DE FORMULARIO (Regla #9 al inicio)
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

function CheckboxCard({
  checked, onChange, label, helper, children,
}: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; helper?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#ffffff', border: checked ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12, transition: 'border-color 0.2s',
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 22, height: 22, borderRadius: 5,
            background: checked ? '#10B981' : '#ffffff',
            border: checked ? '2px solid #10B981' : '2px solid #d1d5db',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
            marginTop: 1,
          }}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}

function RadioCard({
  checked, onChange, label, helper,
}: {
  checked: boolean; onChange: () => void; label: string; helper?: string;
}) {
  return (
    <div style={{
      background: '#ffffff', border: checked ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12, transition: 'border-color 0.2s',
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={onChange}
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: checked ? '7px solid #10B981' : '2px solid #d1d5db',
            background: '#ffffff', flexShrink: 0, transition: 'all 0.2s',
            marginTop: 1,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
    </div>
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
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
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
          {ticks.map((t) => <span key={t}>{t}°</span>)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function EdicionLimitadaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EdicionLimitadaEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<EdicionLimitadaConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilos' | 'fechas'>('general');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  const update = <K extends keyof EdicionLimitadaConfig>(key: K, value: EdicionLimitadaConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
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
      <div style={{ marginBottom: 20 }}>
        <FieldLabel required>Texto principal del sticker</FieldLabel>
        <TextInput
          value={config.textoPrincipal}
          onChange={(v) => update('textoPrincipal', v)}
          placeholder="Ej: EDICIÓN LIMITADA, EXCLUSIVO, ÚLTIMOS PARES"
          maxLength={30}
        />
        <FieldHelper>Frase destacada en mayúsculas para generar impacto visual.</FieldHelper>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Subtexto (opcional)</FieldLabel>
        <TextInput
          value={config.subtexto}
          onChange={(v) => update('subtexto', v)}
          placeholder="Ej: Solo 50 piezas, Colección Cápsula"
          maxLength={35}
        />
        <FieldHelper>Información secundaria de escasez o exclusividad.</FieldHelper>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Forma del sticker</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.forma === 'circular'}
            onChange={() => update('forma', 'circular')}
            label="Sello circular"
            helper="Efecto moneda o sello troquelado con ícono de destello."
          />
          <RadioCard
            checked={config.forma === 'badge-rect'}
            onChange={() => update('forma', 'badge-rect')}
            label="Píldora moderna"
            helper="Pastilla redondeada horizontal muy versátil."
          />
          <RadioCard
            checked={config.forma === 'cinta-diagonal'}
            onChange={() => update('forma', 'cinta-diagonal')}
            label="Cinta horizontal destacada"
            helper="Franja con estilo ribbon que cruza la esquina."
          />
          <RadioCard
            checked={config.forma === 'sello-borde'}
            onChange={() => update('forma', 'sello-borde')}
            label="Sello vintage con doble borde"
            helper="Marco clásico tipo etiqueta de coleccionista."
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div>
          <FieldLabel>Tamaño</FieldLabel>
          <SelectField
            value={config.tamano}
            onChange={(v) => update('tamano', v as any)}
            options={[
              { value: 'chico', label: 'Chico' },
              { value: 'mediano', label: 'Mediano' },
              { value: 'grande', label: 'Grande' },
            ]}
          />
        </div>
        <div>
          <FieldLabel>Efecto visual</FieldLabel>
          <SelectField
            value={config.efecto}
            onChange={(v) => update('efecto', v as any)}
            options={[
              { value: 'brillo-pulsante', label: 'Brillo pulsante ✨' },
              { value: 'zoom-suave', label: 'Zoom sutil 🔍' },
              { value: 'sin-efecto', label: 'Estático' },
            ]}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <FieldLabel>Inclinación / Rotación ({config.rotacion}°)</FieldLabel>
        </div>
        <RangeSlider
          value={config.rotacion}
          min={-20}
          max={20}
          onChange={(v) => update('rotacion', v)}
          ticks={[-20, -10, 0, 10, 20]}
        />
        <FieldHelper>Una leve inclinación (-8° a -12°) le da aspecto de sticker pegado a mano.</FieldHelper>
      </div>
    </div>
  );

  /* ═══ TAB UBICACIÓN ═══ */
  const tabUbicacion = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Posición en la ficha de producto</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.posicion === 'esquina-superior-derecha'}
            onChange={() => update('posicion', 'esquina-superior-derecha')}
            label="Esquina superior derecha de la imagen"
            helper="Flota sobre la esquina derecha de la foto principal."
          />
          <RadioCard
            checked={config.posicion === 'esquina-superior-izquierda'}
            onChange={() => update('posicion', 'esquina-superior-izquierda')}
            label="Esquina superior izquierda de la imagen"
            helper="Flota sobre la esquina izquierda de la foto principal."
          />
          <RadioCard
            checked={config.posicion === 'inline-precio'}
            onChange={() => update('posicion', 'inline-precio')}
            label="Debajo del precio"
            helper="Se muestra como un badge destacado junto a los datos del producto."
          />
        </div>
      </div>

      <CheckboxCard
        checked={config.mostrarEnProducto}
        onChange={(v) => update('mostrarEnProducto', v)}
        label="Mostrar en ficha de producto"
        helper="El sticker se mostrará en la página del producto seleccionado."
      />

      <CheckboxCard
        checked={config.mostrarEnGrilla}
        onChange={(v) => update('mostrarEnGrilla', v)}
        label="Mostrar en grilla de productos (Home / Categorías)"
        helper="Aparece sobre la tarjeta del producto en los listados generales."
      />
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 20 }}>
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.colorFondo} onChange={(v) => update('colorFondo', v)} />
        </div>
        <div>
          <FieldLabel>Color de texto</FieldLabel>
          <ColorPickerField value={config.colorTexto} onChange={(v) => update('colorTexto', v)} />
        </div>
        <div>
          <FieldLabel>Color de borde / detalle</FieldLabel>
          <ColorPickerField value={config.colorBorde} onChange={(v) => update('colorBorde', v)} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <ToggleField
          checked={config.mostrarBorde}
          onChange={(v) => update('mostrarBorde', v)}
          label="Mostrar borde / pespunte decorativo"
        />
      </div>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const tabFechasEspeciales = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>
          Elegí una campaña activa. El sticker se adaptará automáticamente a la estética oficial de la fecha.
        </FieldHelper>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {CAMPAIGN_PRESETS.map((preset) => {
          const isSelected = (config.campaignTheme || 'none') === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => update('campaignTheme', preset.id)}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                transition: 'all 0.2s ease',
                minWidth: 0,
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{preset.emoji}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, lineHeight: 1.4, flex: 1 }}>
                {preset.desc}
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
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas Especiales' },
  ];

  /* ═══ RENDER PRINCIPAL ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* HEADER OFICIAL */}
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

      {/* MAIN CONTAINER */}
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

        {/* Contenedor del Editor */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          {/* Live Preview */}
          <div style={{ marginBottom: 20 }}>
            <EdicionLimitadaPreview config={config} />
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
              El sticker destaca visualmente sobre la imagen o el precio del producto sin alterar tu stock ni el carrito.
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

          {/* Contenido del Tab */}
          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'ubicacion' && tabUbicacion}
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

        {/* CENTRO DE AYUDA OFICIAL */}
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
