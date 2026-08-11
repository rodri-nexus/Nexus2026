// components/widgets/editors/CountdownEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CountdownPreview from './CountdownPreview';

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

interface CountdownEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface CountdownConfig {
  title: string;
  subtitle: string;
  endDate: string;
  autoRestart: boolean;
  showDays: boolean;
  showOnProduct: boolean;
  productPosition: 'before-button' | 'before-title';
  showAsTopBar: boolean;
  showOnCart: boolean;
  style: 'clasico' | 'retro';
  alignment: 'left' | 'center';
  showLabels: boolean;
  bgType: 'solid' | 'gradient';
  colorWidgetBg: string;
  colorSubtitleBg: string;
  colorClockBg: string;
  colorTitle: string;
  colorSubtitle: string;
  colorNumbers: string;
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  fontSizeClock: string;
  borderRadiusClock: number;
  borderRadiusWidget: number;
  paddingWidget: number;
  paddingClock: number;
  mode: 'fixed';
  flashMinutes: number;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  scale: number;
  auraEnabled: boolean;
  colorAuraCalm: string;
  colorAuraMedium: string;
  colorAuraUrgent: string;
  effectsIntensity: number;
  showShimmer: boolean;
  showProgressRing: boolean;
  showParticles: boolean;
  showBounce: boolean;
  showGlowBreath: boolean;
  showVibration: boolean;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
function getDefaultEndDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(23, 59, 0, 0);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const defaultConfig: CountdownConfig = {
  title: 'Oferta 🔥',
  subtitle: '',
  endDate: getDefaultEndDate(),
  autoRestart: false,
  showDays: true,
  showOnProduct: true,
  productPosition: 'before-button',
  showAsTopBar: false,
  showOnCart: false,
  style: 'clasico',
  alignment: 'left',
  showLabels: true,
  bgType: 'solid',
  colorWidgetBg: '#1e1e1e',
  colorSubtitleBg: '#fdc624',
  colorClockBg: '#ef4444',
  colorTitle: '#ffffff',
  colorSubtitle: '#000000',
  colorNumbers: '#ffffff',
  fontSizeTitle: '16px',
  fontSizeSubtitle: '11px',
  fontSizeClock: '16px',
  borderRadiusClock: 5,
  borderRadiusWidget: 12,
  paddingWidget: 15,
  paddingClock: 7,
  mode: 'fixed',
  flashMinutes: 15,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  scale: 1,
  auraEnabled: false,
  colorAuraCalm: '#8b5cf6',
  colorAuraMedium: '#f97316',
  colorAuraUrgent: '#ef4444',
  effectsIntensity: 0,
  showShimmer: false,
  showProgressRing: false,
  showParticles: false,
  showBounce: false,
  showGlowBreath: false,
  showVibration: false,
};

/* ═══════════════════════════════════════════
   ICONOS (SVG inline)
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IconPalette = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z"/>
  </svg>
);

const IconType = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);

const IconSpacing = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>
  </svg>
);

const IconRotate = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconClockSmall = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconAlignLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
  </svg>
);

const IconAlignCenter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>
  </svg>
);

/* ═══════════════════════════════════════════
   LOGO NEVUX
═══════════════════════════════════════════ */
const NevuxLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="14" rx="10" ry="6" fill="#3b82f6"/>
      <path d="M10 14v10c0 3.3 4.5 6 10 6s10-2.7 10-6V14" fill="#3b82f6"/>
      <ellipse cx="20" cy="24" rx="10" ry="6" fill="#60a5fa"/>
    </svg>
    <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>Nevux</span>
  </div>
);

/* ═══════════════════════════════════════════
   COMPONENTES REUTILIZABLES
═══════════════════════════════════════════ */
function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

function TextInput({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#1a1a2e', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function DateTimeInput({
  value, onChange,
}: {
  value: string; onChange: (v: string) => void;
}) {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#1a1a2e', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
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
      background: '#ffffff', border: '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12,
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 22, height: 22, borderRadius: 5,
            background: checked ? '#3b82f6' : '#ffffff',
            border: checked ? '2px solid #3b82f6' : '2px solid #d1d5db',
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
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
      {children && checked && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}

function RadioOption({
  checked, onChange, label,
}: {
  checked: boolean; onChange: () => void; label: string;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10,
      cursor: 'pointer', padding: '4px 0',
    }}>
      <div
        onClick={onChange}
        style={{
          width: 20, height: 20, borderRadius: '50%',
          border: checked ? '6px solid #3b82f6' : '2px solid #d1d5db',
          background: '#ffffff', flexShrink: 0, transition: 'all 0.2s',
        }}
      />
      <span style={{ fontSize: 15, color: '#1a1a2e', fontWeight: 500 }}>
        {label}
      </span>
    </label>
  );
}

function ColorPickerField({
  value, onChange, showClear = true,
}: {
  value: string; onChange: (v: string) => void; showClear?: boolean;
}) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#000000';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        onClick={handleClick}
        style={{
          width: 60, height: 44, borderRadius: 10,
          background: value, border: '1.5px solid #e5e7eb',
          cursor: 'pointer', flexShrink: 0,
        }}
      />
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v.startsWith('#') ? v : '#' + v);
          }}
          style={{
            width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
            border: '1.5px solid #e5e7eb', borderRadius: 10,
            background: '#ffffff', color: '#1a1a2e', outline: 'none',
            fontFamily: 'monospace', boxSizing: 'border-box',
          }}
        />
        {showClear && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', color: '#9ca3af',
              fontSize: 20, padding: 4, lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
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
          background: '#ffffff', color: '#1a1a2e', outline: 'none',
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
        stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function RangeSlider({
  label, value, min, max, onChange, ticks,
}: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void;
  ticks?: number[];
}) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>
        {label}
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%', accentColor: '#3b82f6', cursor: 'pointer',
        }}
      />
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          {ticks.map((t) => <span key={t}>{t}px</span>)}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  icon, title, helper, children,
}: {
  icon: React.ReactNode; title: string; helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 20, marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: helper ? 4 : 20 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{title}</div>
          {helper && (
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>
              {helper}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: helper ? 20 : 0 }}>{children}</div>
    </div>
  );
}

function ChoiceButtons({
  options, value, onChange,
}: {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 10 }}>
      {options.map((opt) => {
        const act = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: '12px 14px', borderRadius: 10,
              border: act ? '2px solid #3b82f6' : '1.5px solid #e5e7eb',
              background: act ? '#eff6ff' : '#ffffff',
              color: act ? '#3b82f6' : '#374151',
              fontSize: 14, fontWeight: 600,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: 8, transition: 'all 0.2s',
              fontFamily: 'inherit', lineHeight: 1.3,
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: CountdownEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CountdownConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilos'>('general');
  const [isDesktop, setIsDesktop] = useState(false);

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const update = <K extends keyof CountdownConfig>(key: K, value: CountdownConfig[K]) => {
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
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel required>Título</FieldLabel>
        <TextInput
          value={config.title}
          onChange={(v) => update('title', v)}
          placeholder="Oferta 🔥"
        />
        <FieldHelper>Texto principal del contador</FieldHelper>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Subtítulo (opcional)</FieldLabel>
        <TextInput
          value={config.subtitle}
          onChange={(v) => update('subtitle', v)}
          placeholder="Ingresa un subtítulo..."
        />
        <FieldHelper>Descripción o promoción</FieldHelper>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel required>Fecha y hora final</FieldLabel>
        <DateTimeInput
          value={config.endDate}
          onChange={(v) => update('endDate', v)}
        />
        <FieldHelper>
          Selecciona cuándo termina la cuenta regresiva. Llegado a la fecha se ocultará automáticamente a menos que tenga configurado el reinicio automático.
        </FieldHelper>
      </div>

      <CheckboxCard
        checked={config.autoRestart}
        onChange={(v) => update('autoRestart', v)}
        label="Reiniciar automáticamente cuando termine"
        helper="El contador se reiniciará con la duración configurada cada vez que llegue a 00:00:00"
      />

      <CheckboxCard
        checked={config.showDays}
        onChange={(v) => update('showDays', v)}
        label="Mostrar días"
        helper="Si se desactiva, los días se acumulan en las horas (ej: 1 día 2 horas → 26 HRS). Si está activado pero quedan menos de 24 horas, la sección de días se oculta automáticamente."
      />
    </div>
  );

  /* ═══ TAB UBICACIÓN ═══ */
  const tabUbicacion = (
    <div>
      <CheckboxCard
        checked={config.showOnProduct}
        onChange={(v) => update('showOnProduct', v)}
        label="Mostrar en ficha de producto"
        helper="El widget aparecerá dentro de la ficha de producto."
      >
        <div style={{ paddingLeft: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
            Ubicación del widget
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <RadioOption
              checked={config.productPosition === 'before-button'}
              onChange={() => update('productPosition', 'before-button')}
              label='Antes del botón "Agregar al carrito"'
            />
            <RadioOption
              checked={config.productPosition === 'before-title'}
              onChange={() => update('productPosition', 'before-title')}
              label="Antes del título del producto"
            />
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 12, lineHeight: 1.5 }}>
            Selecciona dónde quieres que aparezca la cuenta regresiva en la ficha del producto
          </div>
        </div>
      </CheckboxCard>

      <CheckboxCard
        checked={config.showAsTopBar}
        onChange={(v) => update('showAsTopBar', v)}
        label="Mostrar como barra fija en la parte superior de la pantalla"
        helper="Se mostrará el widget en una barra fija en la parte superior de la pantalla."
      />

      <CheckboxCard
        checked={config.showOnCart}
        onChange={(v) => update('showOnCart', v)}
        label="Mostrar en el carrito"
        helper="Se mostrará el widget al comienzo del carrito cuando el cliente lo abra."
      />
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div>
      <SectionCard
        icon={<IconClock />}
        title="Estilo del reloj"
        helper="Customizá la apariencia del contador."
      >
        <FieldLabel>Estilo del reloj</FieldLabel>
        <ChoiceButtons
          value={config.style}
          onChange={(v) => update('style', v as any)}
          options={[
            { value: 'clasico', label: 'Clásico', icon: <IconClockSmall /> },
            { value: 'retro', label: 'Retro flip', icon: <IconRotate /> },
          ]}
        />

        <div style={{ marginTop: 20 }}>
          <FieldLabel>Alineación del contenido</FieldLabel>
          <ChoiceButtons
            value={config.alignment}
            onChange={(v) => update('alignment', v as any)}
            options={[
              { value: 'left', label: 'Izquierda / derecha', icon: <IconAlignLeft /> },
              { value: 'center', label: 'Siempre centrado', icon: <IconAlignCenter /> },
            ]}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <CheckboxCard
            checked={config.showLabels}
            onChange={(v) => update('showLabels', v)}
            label="Mostrar etiquetas del reloj"
            helper="Muestra los textos DÍAS, HRS, MIN y SEG debajo de cada número."
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={<IconLayers />}
        title="Fondo del widget"
        helper="Elegí el fondo principal del widget."
      >
        <FieldLabel>Tipo de fondo</FieldLabel>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <RadioOption
            checked={config.bgType === 'solid'}
            onChange={() => update('bgType', 'solid')}
            label="Color sólido"
          />
          <RadioOption
            checked={config.bgType === 'gradient'}
            onChange={() => update('bgType', 'gradient')}
            label="Degradé"
          />
        </div>

        <FieldLabel>Color de fondo</FieldLabel>
        <ColorPickerField
          value={config.colorWidgetBg}
          onChange={(v) => update('colorWidgetBg', v)}
          showClear={false}
        />
      </SectionCard>

      <SectionCard
        icon={<IconPalette />}
        title="Colores"
        helper="Definí los colores de textos y fondos."
      >
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Fondo del subtítulo</FieldLabel>
          <ColorPickerField
            value={config.colorSubtitleBg}
            onChange={(v) => update('colorSubtitleBg', v)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Color de fondo del reloj</FieldLabel>
          <ColorPickerField
            value={config.colorClockBg}
            onChange={(v) => update('colorClockBg', v)}
            showClear={false}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Color de fuente del título</FieldLabel>
          <ColorPickerField
            value={config.colorTitle}
            onChange={(v) => update('colorTitle', v)}
            showClear={false}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Color de fuente del subtítulo</FieldLabel>
          <ColorPickerField
            value={config.colorSubtitle}
            onChange={(v) => update('colorSubtitle', v)}
            showClear={false}
          />
        </div>

        <div>
          <FieldLabel>Color de números</FieldLabel>
          <ColorPickerField
            value={config.colorNumbers}
            onChange={(v) => update('colorNumbers', v)}
            showClear={false}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={<IconType />}
        title="Tipografía"
        helper="Ajustá los tamaños de letra."
      >
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Tamaño de fuente del título</FieldLabel>
          <SelectField
            value={config.fontSizeTitle}
            onChange={(v) => update('fontSizeTitle', v)}
            options={[
              { value: '12px', label: '12px' },
              { value: '14px', label: '14px' },
              { value: '16px', label: '16px' },
              { value: '18px', label: '18px' },
              { value: '20px', label: '20px' },
              { value: '24px', label: '24px' },
            ]}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Tamaño de fuente del subtítulo</FieldLabel>
          <SelectField
            value={config.fontSizeSubtitle}
            onChange={(v) => update('fontSizeSubtitle', v)}
            options={[
              { value: '9px', label: '9px' },
              { value: '11px', label: '11px' },
              { value: '13px', label: '13px' },
              { value: '15px', label: '15px' },
            ]}
          />
        </div>

        <div>
          <FieldLabel>Tamaño de fuente del reloj</FieldLabel>
          <SelectField
            value={config.fontSizeClock}
            onChange={(v) => update('fontSizeClock', v)}
            options={[
              { value: '14px', label: '14px' },
              { value: '16px', label: '16px' },
              { value: '20px', label: '20px' },
              { value: '24px', label: '24px' },
              { value: '32px', label: '32px' },
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={<IconSpacing />}
        title="Espacios y bordes"
        helper="Controlá bordes redondeados y márgenes internos."
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <RangeSlider
            label="Borde del reloj:"
            value={config.borderRadiusClock}
            min={0} max={25}
            onChange={(v) => update('borderRadiusClock', v)}
            ticks={[0, 5, 25]}
          />
          <RangeSlider
            label="Borde del widget:"
            value={config.borderRadiusWidget}
            min={0} max={25}
            onChange={(v) => update('borderRadiusWidget', v)}
            ticks={[0, 5, 25]}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <RangeSlider
            label="Margen interno:"
            value={config.paddingWidget}
            min={0} max={40}
            onChange={(v) => update('paddingWidget', v)}
            ticks={[0, 15, 40]}
          />
          <RangeSlider
            label="Margen interno del reloj:"
            value={config.paddingClock}
            min={0} max={30}
            onChange={(v) => update('paddingClock', v)}
            ticks={[0, 7, 30]}
          />
        </div>
      </SectionCard>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estilos', label: 'Estilos' },
  ];

  const infoBoxText = config.productPosition === 'before-title'
    ? 'La cuenta regresiva aparecerá antes del título del producto.'
    : 'La cuenta regresiva aparecerá antes del botón "Agregar al carrito".';

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', paddingBottom: 100 }}>

      {/* ── HEADER ── */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e7eb',
        padding: '16px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <NevuxLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            type="button"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={{ width: 1, height: 28, background: '#e5e7eb' }} />
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#e5e7eb', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#6b7280',
          }}>
            RL
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Chip scope: SOLO se muestra si es para toda la tienda */}
        {isForAll && (
          <div style={{
            background: '#eff6ff', border: '1px solid #dbeafe',
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 20,
          }}>
            <IconStore />
            <span style={{ fontSize: 15, color: '#1e40af', fontWeight: 500 }}>
              Widget general para toda la tienda
            </span>
          </div>
        )}

        {/* Título */}
        <h1 style={{
          fontSize: 30, fontWeight: 700, color: '#374151',
          margin: '0 0 24px', lineHeight: 1.2, letterSpacing: '-0.01em',
        }}>
          <span style={{ color: '#9ca3af', fontWeight: 400 }}>
            {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          </span>
          <span style={{ color: '#1a1a2e' }}>
            {widgetDefinition.name} ({scopeLabel})
          </span>
        </h1>

        {/* Contenedor principal */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
        }}>
          {/* Preview */}
          <div style={{ marginBottom: 20 }}>
            <CountdownPreview config={config as any} />
          </div>

          {/* Info box */}
          <div style={{
            background: '#eff6ff', border: '1px solid #dbeafe',
            borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#1e40af', lineHeight: 1.5 }}>
              {infoBoxText}
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
                    border: 'none', borderBottom: act ? '3px solid #1a1a2e' : '3px solid transparent',
                    color: act ? '#1a1a2e' : '#9ca3af',
                    fontSize: 15, fontWeight: act ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    marginBottom: -1, transition: 'all 0.2s',
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
            {activeTab === 'ubicacion' && tabUbicacion}
            {activeTab === 'estilos' && tabEstilos}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 32, paddingTop: 20,
            borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 44, height: 26, borderRadius: 13,
                  background: isActive ? '#3b82f6' : '#d1d5db',
                  position: 'relative', transition: 'background 0.25s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 3, left: isActive ? 21 : 3,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#fff', transition: 'left 0.25s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1a2e' }}>
                Widget activo
              </span>
              <div style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                <IconInfo />
              </div>
            </label>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: 999,
                border: 'none',
                background: savedOK ? '#10b981' : '#3b82f6',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* Centro de ayuda */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 32, textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <NevuxLogo />
          </div>
          <div style={{ fontSize: 15, color: '#6b7280' }}>Centro de ayuda</div>
        </div>

        {/* Error */}
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
