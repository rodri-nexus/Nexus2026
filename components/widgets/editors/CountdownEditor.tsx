'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CountdownPreview from './CountdownPreview';
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
  mode: 'fixed' | 'duration';
  endDate: string;
  durationMinutes: number;
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
  colorWidgetBg2: string;
  gradientDirection: 'to bottom' | 'to right' | 'to bottom right';
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
  urgencyEnabled: boolean;
  colorClockBgMedium: string;
  colorClockBgCritical: string;
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
  mode: 'fixed',
  endDate: getDefaultEndDate(),
  durationMinutes: 15,
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
  colorWidgetBg: '#000000',
  colorWidgetBg2: '#10B981',
  gradientDirection: 'to bottom right',
  colorSubtitleBg: '#10B981',
  colorClockBg: '#10B981',
  colorTitle: '#ffffff',
  colorSubtitle: '#ffffff',
  colorNumbers: '#ffffff',
  fontSizeTitle: '16px',
  fontSizeSubtitle: '11px',
  fontSizeClock: '16px',
  borderRadiusClock: 5,
  borderRadiusWidget: 12,
  paddingWidget: 15,
  paddingClock: 7,
  urgencyEnabled: false,
  colorClockBgMedium: '#f97316',
  colorClockBgCritical: '#dc2626',
  flashMinutes: 15,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  scale: 1,
  auraEnabled: false,
  colorAuraCalm: '#8b5cf6',
  colorAuraMedium: '#f97316',
  colorAuraUrgent: '#10B981',
  effectsIntensity: 0,
  showShimmer: false,
  showProgressRing: false,
  showParticles: false,
  showBounce: false,
  showGlowBreath: false,
  showVibration: false,
};

/* ═══════════════════════════════════════════
   ICONOS SVG
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

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IconPalette = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z"/>
  </svg>
);

const IconType = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);

const IconSpacing = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>
  </svg>
);

const IconFire = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
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

const IconArrowDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconArrowDiagonal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 8 17 17 8 17"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
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
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function NumberInput({
  value, onChange, min, max, placeholder,
}: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const n = parseInt(e.target.value, 10);
        if (!isNaN(n)) onChange(n);
      }}
      placeholder={placeholder}
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
      background: '#ffffff', border: '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12,
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 22, height: 22, borderRadius: 5,
            background: checked ? '#10B981' : '#ffffff',
            border: checked ? '2px solid #10B981' : '2px solid #e5e7eb',
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
          border: checked ? '6px solid #10B981' : '2px solid #e5e7eb',
          background: '#ffffff', flexShrink: 0, transition: 'all 0.2s',
        }}
      />
      <span style={{ fontSize: 15, color: '#000000', fontWeight: 500 }}>
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
          background: value || '#ffffff', border: '1.5px solid #e5e7eb',
          cursor: 'pointer', flexShrink: 0,
        }}
      />
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v.startsWith('#') || v === '' ? v : '#' + v);
          }}
          style={{
            width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
            border: '1.5px solid #e5e7eb', borderRadius: 10,
            background: '#ffffff', color: '#000000', outline: 'none',
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
              border: 'none', cursor: 'pointer', color: '#000000',
              opacity: 0.5,
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
  value: string | number; onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
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
          <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#000000" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
      <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 10 }}>
        {label}
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%', accentColor: '#10B981', cursor: 'pointer',
        }}
      />
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 4 }}>
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
          <div style={{ fontSize: 16, fontWeight: 700, color: '#000000' }}>{title}</div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 4, lineHeight: 1.4 }}>
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
              border: act ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: act ? '#ecfdf5' : '#ffffff',
              color: act ? '#10B981' : '#000000',
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
  const [customDurationOpen, setCustomDurationOpen] = useState(false);

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

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

  const durationPresets = [5, 10, 15, 30, 45, 60, 90, 120];
  const isCustomDuration = !durationPresets.includes(config.durationMinutes);

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

      <div style={{ marginBottom: 20 }}>
        <FieldLabel required>Tipo de contador</FieldLabel>
        <ChoiceButtons
          value={config.mode}
          onChange={(v) => update('mode', v as any)}
          options={[
            { value: 'fixed', label: 'Fecha específica', icon: <IconCalendar /> },
            { value: 'duration', label: 'Duración corta', icon: <IconBolt /> },
          ]}
        />
        <FieldHelper>
          <strong>Fecha específica:</strong> el contador termina en la fecha y hora que elijas.<br />
          <strong>Duración corta ⚡:</strong> cada visitante ve un contador nuevo que arranca al entrar (ideal para urgencia tipo "flash sale").
        </FieldHelper>
      </div>

      {config.mode === 'fixed' ? (
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
      ) : (
        <div style={{ marginBottom: 24 }}>
          <FieldLabel required>Duración por sesión</FieldLabel>
          <SelectField
            value={isCustomDuration ? 'custom' : String(config.durationMinutes)}
            onChange={(v) => {
              if (v === 'custom') {
                setCustomDurationOpen(true);
              } else {
                setCustomDurationOpen(false);
                update('durationMinutes', parseInt(v, 10));
              }
            }}
            options={[
              { value: '5', label: '⚡ 5 minutos' },
              { value: '10', label: '⚡ 10 minutos' },
              { value: '15', label: '🔥 15 minutos (recomendado)' },
              { value: '30', label: '30 minutos' },
              { value: '45', label: '45 minutos' },
              { value: '60', label: '1 hora' },
              { value: '90', label: '1 hora 30 minutos' },
              { value: '120', label: '2 horas' },
              { value: 'custom', label: '⚙️ Personalizado...' },
            ]}
          />
          {(customDurationOpen || isCustomDuration) && (
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Minutos personalizados</FieldLabel>
              <NumberInput
                value={config.durationMinutes}
                min={1}
                max={1440}
                onChange={(v) => update('durationMinutes', v)}
                placeholder="Ej: 20"
              />
            </div>
          )}
          <FieldHelper>
            Cada visitante ve un contador nuevo que arranca en <strong>{config.durationMinutes} min</strong> al entrar a la página. Genera máxima urgencia.
          </FieldHelper>
        </div>
      )}

      {config.mode === 'fixed' && (
        <CheckboxCard
          checked={config.autoRestart}
          onChange={(v) => update('autoRestart', v)}
          label="Reiniciar automáticamente cuando termine"
          helper="El contador se reiniciará con la duración configurada cada vez que llegue a 00:00:00"
        />
      )}

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
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 12 }}>
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
          <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 12, lineHeight: 1.5 }}>
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
        icon={<IconFire />}
        title="Modo urgencia 🔥"
        helper="Cambiá los colores del reloj a medida que se acerca el final para generar más urgencia."
      >
        <CheckboxCard
          checked={config.urgencyEnabled}
          onChange={(v) => update('urgencyEnabled', v)}
          label="Activar modo urgencia"
          helper="Cuando quede menos del 66% del tiempo → color medio. Cuando quede menos del 33% → color crítico con pulso."
        >
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>🟩 Color normal (100% - 67% restante)</FieldLabel>
            <ColorPickerField
              value={config.colorClockBg}
              onChange={(v) => update('colorClockBg', v)}
              showClear={false}
            />
            <FieldHelper>Este es el color de fondo del reloj cuando queda mucho tiempo.</FieldHelper>
          </div>

          <div style={{ marginBottom: 16 }}>
            <FieldLabel>🟧 Color medio (66% - 34% restante)</FieldLabel>
            <ColorPickerField
              value={config.colorClockBgMedium}
              onChange={(v) => update('colorClockBgMedium', v)}
              showClear={false}
            />
            <FieldHelper>Color de advertencia cuando queda un tercio del tiempo.</FieldHelper>
          </div>

          <div>
            <FieldLabel>🟥 Color crítico (33% - 0% restante)</FieldLabel>
            <ColorPickerField
              value={config.colorClockBgCritical}
              onChange={(v) => update('colorClockBgCritical', v)}
              showClear={false}
            />
            <FieldHelper>Color de urgencia máxima con animación de pulso.</FieldHelper>
          </div>
        </CheckboxCard>
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

        {config.bgType === 'solid' ? (
          <>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField
              value={config.colorWidgetBg}
              onChange={(v) => update('colorWidgetBg', v)}
              showClear={false}
            />
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Color inicial</FieldLabel>
              <ColorPickerField
                value={config.colorWidgetBg}
                onChange={(v) => update('colorWidgetBg', v)}
                showClear={false}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Color final</FieldLabel>
              <ColorPickerField
                value={config.colorWidgetBg2}
                onChange={(v) => update('colorWidgetBg2', v)}
                showClear={false}
              />
            </div>

            <div>
              <FieldLabel>Dirección del degradé</FieldLabel>
              <ChoiceButtons
                value={config.gradientDirection}
                onChange={(v) => update('gradientDirection', v as any)}
                options={[
                  { value: 'to bottom', label: 'Vertical', icon: <IconArrowDown /> },
                  { value: 'to right', label: 'Horizontal', icon: <IconArrowRight /> },
                  { value: 'to bottom right', label: 'Diagonal', icon: <IconArrowDiagonal /> },
                ]}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <FieldLabel>Vista previa</FieldLabel>
              <div style={{
                width: '100%', height: 60, borderRadius: 10,
                background: `linear-gradient(${config.gradientDirection}, ${config.colorWidgetBg}, ${config.colorWidgetBg2})`,
                border: '1.5px solid #e5e7eb',
              }} />
            </div>
          </>
        )}
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

        {!config.urgencyEnabled && (
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Color de fondo del reloj</FieldLabel>
            <ColorPickerField
              value={config.colorClockBg}
              onChange={(v) => update('colorClockBg', v)}
              showClear={false}
            />
            <FieldHelper>💡 Si activás el modo urgencia, este color se maneja desde esa sección.</FieldHelper>
          </div>
        )}

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
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            RL
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>

        {/* Scope chip */}
        {isForAll ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#10B981',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            <IconStore />
            Todos los productos
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span>
            NEVUX Widget
          </div>
        )}

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* PREVIEW */}
          <div style={{ marginBottom: 14 }}>
            <CountdownPreview config={config as any} />
          </div>

          {/* NOTA INFO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 16,
              fontSize: 14,
              color: '#000000',
              lineHeight: 1.5,
            }}
          >
            <IconInfo />
            <span>{infoBoxText}</span>
          </div>

          {/* TABS */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 20,
            }}
          >
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    background: act ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    padding: '14px 10px',
                    fontSize: 15,
                    fontWeight: act ? 700 : 500,
                    color: '#000000',
                    opacity: act ? 1 : 0.6,
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'ubicacion' && tabUbicacion}
            {activeTab === 'estilos' && tabEstilos}
          </div>

          {/* FOOTER CONTROLES */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 999,
                  background: isActive ? '#10B981' : '#e5e7eb',
                  position: 'relative',
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    position: 'absolute',
                    top: 2,
                    left: isActive ? 20 : 2,
                    transition: 'left 0.15s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
                Widget activo
              </span>
              <IconInfo />
            </label>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                borderRadius: 999,
                border: 'none',
                background: savedOK ? '#059669' : '#10B981',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {saving
                ? 'Guardando...'
                : savedOK
                ? '✓ Guardado'
                : isEditing
                ? 'Guardar cambios'
                : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
}
