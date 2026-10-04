'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS
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
}

interface CuentaRegresivaEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

interface Cfg {
  timerType: 'minutes' | 'date' | 'daily';
  durationMinutes: number;
  durationValue: number;
  durationUnit: 'minutes' | 'hours' | 'days';
  durationHours: number;
  durationExtraMinutes: number;
  exactDate: string;
  title: string;
  blockSize: 'compact' | 'normal' | 'large';
  location: 'product_before' | 'product_after' | 'top_bar';
  template: 'classic' | 'cards' | 'minimal' | 'neon' | 'pill' | 'gradient' | 'blocks' | 'outline' | 'flip' | 'pastel' | 'glass';
  gradStart: string;
  gradEnd: string;
  textColor: string;
  coupon: string;
  ctaText: string;
  ctaUrl: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO (Nuevo Estándar Verde Nevux)
═══════════════════════════════════════════ */
const DEF: Cfg = {
  timerType: 'minutes',
  durationMinutes: 15,
  durationValue: 15,
  durationUnit: 'minutes',
  durationHours: 1,
  durationExtraMinutes: 0,
  exactDate: '',
  title: '¡Oferta por tiempo limitado!',
  blockSize: 'normal',
  location: 'product_before',
  template: 'classic',
  gradStart: '#111827', // Fondo Principal (Oscuro)
  gradEnd: '#10B981', // Cajas / Acento (Verde Nevux)
  textColor: '#ffffff',
  coupon: '',
  ctaText: '',
  ctaUrl: '',
  campaignTheme: 'none',
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

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

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
  value, onChange, placeholder, maxLength, type = 'text', min,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; type?: string; min?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
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

function prev_safe(v: number | undefined, def: number): number {
  if (typeof v !== 'number' || isNaN(v)) return def;
  return v;
}

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };

  const rawDuration = typeof raw.durationMinutes === 'number' ? raw.durationMinutes : DEF.durationMinutes;
  let durationUnit: Cfg['durationUnit'] = (raw.durationUnit as any) || 'minutes';
  let durationValue = typeof raw.durationValue === 'number' ? raw.durationValue : rawDuration;
  let durationHours = typeof raw.durationHours === 'number' ? raw.durationHours : 1;
  let durationExtraMinutes = typeof raw.durationExtraMinutes === 'number' ? raw.durationExtraMinutes : 0;

  if (!raw.durationUnit) {
    if (rawDuration % 1440 === 0) {
      durationUnit = 'days';
      durationValue = rawDuration / 1440;
    } else if (rawDuration >= 60) {
      durationUnit = 'hours';
      durationHours = Math.floor(rawDuration / 60);
      durationExtraMinutes = rawDuration % 60;
    } else {
      durationUnit = 'minutes';
      durationValue = rawDuration;
    }
  }

  return {
    timerType: (raw.timerType as 'minutes' | 'date' | 'daily') || DEF.timerType,
    durationMinutes: rawDuration,
    durationValue,
    durationUnit,
    durationHours,
    durationExtraMinutes,
    exactDate: (raw.exactDate as string) || DEF.exactDate,
    title: (raw.title as string) || DEF.title,
    blockSize: (raw.blockSize as 'compact' | 'normal' | 'large') || DEF.blockSize,
    location: (raw.location as 'product_before' | 'product_after' | 'top_bar') || DEF.location,
    template: (raw.template as Cfg['template']) || DEF.template,
    gradStart: (raw.gradStart as string) || DEF.gradStart,
    gradEnd: (raw.gradEnd as string) || DEF.gradEnd,
    textColor: (raw.textColor as string) || DEF.textColor,
    coupon: (raw.coupon as string) || DEF.coupon,
    ctaText: (raw.ctaText as string) || DEF.ctaText,
    ctaUrl: (raw.ctaUrl as string) || DEF.ctaUrl,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

export default function CuentaRegresivaEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: CuentaRegresivaEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'style' | 'extra' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  const [demoSeconds, setDemoSeconds] = useState(15 * 60);

  useEffect(() => {
    let secs = 15 * 60;
    if (cfg.timerType === 'minutes') {
      if (cfg.durationUnit === 'days') {
        secs = (cfg.durationValue || 1) * 86400;
      } else if (cfg.durationUnit === 'hours') {
        secs = ((cfg.durationHours || 0) * 60 + (cfg.durationExtraMinutes || 0)) * 60;
      } else {
        secs = (cfg.durationValue || 15) * 60;
      }
    } else if (cfg.timerType === 'daily') {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      secs = Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
    } else if (cfg.timerType === 'date' && cfg.exactDate) {
      const target = new Date(cfg.exactDate).getTime();
      secs = Math.max(0, Math.floor((target - Date.now()) / 1000));
    }
    setDemoSeconds(secs);
  }, [cfg.durationValue, cfg.durationUnit, cfg.durationHours, cfg.durationExtraMinutes, cfg.timerType, cfg.exactDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoSeconds((prev) => (prev > 1 ? prev - 1 : 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const handleMinutesChange = (val: string) => {
    if (val === '') {
      setCfg((prev) => ({
        ...prev,
        durationValue: 0,
        durationUnit: 'minutes',
        durationMinutes: 0,
      }));
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    setCfg((prev) => ({
      ...prev,
      durationValue: num,
      durationUnit: 'minutes',
      durationMinutes: num,
    }));
  };

  const handleClockChange = (val: string) => {
    if (!val || !val.includes(':')) return;
    const parts = val.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const totalMins = h * 60 + m;
    setCfg((prev) => ({
      ...prev,
      durationUnit: 'hours',
      durationHours: h,
      durationExtraMinutes: m,
      durationMinutes: totalMins,
    }));
  };

  const handleDaysChange = (val: string) => {
    if (val === '') {
      setCfg((prev) => ({
        ...prev,
        durationValue: 0,
        durationUnit: 'days',
        durationMinutes: 0,
      }));
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    setCfg((prev) => ({
      ...prev,
      durationValue: num,
      durationUnit: 'days',
      durationMinutes: num * 1440,
    }));
  };

  const handleDurationUnitChange = (unit: 'minutes' | 'hours' | 'days') => {
    if (unit === 'minutes') {
      const v = cfg.durationValue || 15;
      setCfg((prev) => ({
        ...prev,
        durationUnit: 'minutes',
        durationValue: v,
        durationMinutes: v,
      }));
    } else if (unit === 'hours') {
      const h = prev_safe(cfg.durationHours, 1);
      const m = prev_safe(cfg.durationExtraMinutes, 0);
      const totalMins = h * 60 + m;
      setCfg((prev) => ({
        ...prev,
        durationUnit: 'hours',
        durationHours: h,
        durationExtraMinutes: m,
        durationMinutes: totalMins < 1 ? 60 : totalMins,
      }));
    } else {
      const d = prev_safe(cfg.durationValue, 1);
      setCfg((prev) => ({
        ...prev,
        durationUnit: 'days',
        durationValue: d,
        durationMinutes: d * 1440,
      }));
    }
  };

  const setCustomColor = (key: 'gradStart' | 'gradEnd' | 'textColor', val: string) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const applyPreset = (slug: string) => {
    const PRESETS_DATA: Record<string, { start: string; end: string; tx: string }> = {
      'black-friday': { start: '#111827', end: '#F59E0B', tx: '#ffffff' },
      'hot-sale': { start: '#0F172A', end: '#EF4444', tx: '#ffffff' },
      'cyber-monday': { start: '#090D16', end: '#3B82F6', tx: '#ffffff' },
      'navidad': { start: '#064E3B', end: '#EF4444', tx: '#ffffff' },
      'san-valentin': { start: '#831843', end: '#F43F5E', tx: '#ffffff' },
      'dia-padre-madre': { start: '#312E81', end: '#10B981', tx: '#ffffff' },
      'liquidacion': { start: '#7F1D1D', end: '#FBBF24', tx: '#ffffff' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        gradStart: DEF.gradStart,
        gradEnd: DEF.gradEnd,
        textColor: DEF.textColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        gradStart: p.start,
        gradEnd: p.end,
        textColor: p.tx,
      }));
    }
  };

  const save = async () => {
    setSaving(true);
    setOk(false);
    setErr('');

    let safeCfg = { ...cfg };
    if (safeCfg.durationUnit === 'minutes') {
      if (!safeCfg.durationValue || safeCfg.durationValue < 1) {
        safeCfg.durationValue = 15;
        safeCfg.durationMinutes = 15;
      } else {
        safeCfg.durationMinutes = safeCfg.durationValue;
      }
    } else if (safeCfg.durationUnit === 'hours') {
      const h = safeCfg.durationHours || 0;
      const m = safeCfg.durationExtraMinutes || 0;
      const calcMins = h * 60 + m;
      safeCfg.durationMinutes = calcMins < 1 ? 60 : calcMins;
    } else if (safeCfg.durationUnit === 'days') {
      if (!safeCfg.durationValue || safeCfg.durationValue < 1) {
        safeCfg.durationValue = 1;
        safeCfg.durationMinutes = 1440;
      } else {
        safeCfg.durationMinutes = safeCfg.durationValue * 1440;
      }
    }

    try {
      const body = {
        id: ew?.id ?? null,
        store_id: storeId,
        widget_slug: wd.slug,
        config: safeCfg,
        target_type: targetType,
        target_product_id: productId,
        is_active: true,
      };
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setOk(true);
      router.push('/widgets');
    } catch {
      setErr('No se pudo guardar. Reintentá.');
    } finally {
      setSaving(false);
    }
  };

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo oscuro con resaltado dorado.' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Degradado nocturno a rojo fuego.' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul cibernético profundo.' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con rojo navideño.' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión.' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con verde esmeralda.' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí con amarillo urgencia.' },
  ];

  const TEMPLATES_LIST: { id: Cfg['template']; label: string }[] = [
    { id: 'classic', label: 'Clásico' },
    { id: 'cards', label: 'Tarjetas' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'neon', label: 'Neón' },
    { id: 'pill', label: 'Píldora' },
    { id: 'gradient', label: 'Degradado' },
    { id: 'blocks', label: 'Bloques' },
    { id: 'outline', label: 'Contorno' },
    { id: 'flip', label: 'Flip' },
    { id: 'pastel', label: 'Pastel' },
    { id: 'glass', label: 'Cristal' },
  ];

  const dD = Math.floor(demoSeconds / (3600 * 24));
  const dH = Math.floor((demoSeconds % (3600 * 24)) / 3600);
  const dM = Math.floor((demoSeconds % 3600) / 60);
  const dS = demoSeconds % 60;

  const showDays = dD > 0 || cfg.durationUnit === 'days' || (cfg.timerType === 'date' && dD > 0);
  const showHours = showDays || dH > 0 || cfg.durationUnit === 'hours' || cfg.timerType === 'date' || cfg.timerType === 'daily';

  const previewDigits: { num: string; label: string }[] = [];
  if (showDays) previewDigits.push({ num: String(dD).padStart(2, '0'), label: 'Días' });
  if (showHours) previewDigits.push({ num: String(dH).padStart(2, '0'), label: 'Horas' });
  previewDigits.push({ num: String(dM).padStart(2, '0'), label: 'Min' });
  previewDigits.push({ num: String(dS).padStart(2, '0'), label: 'Seg' });

  const clockValue = String(cfg.durationHours || 0).padStart(2, '0') + ':' + String(cfg.durationExtraMinutes || 0).padStart(2, '0');
  const todayISO = new Date().toISOString().split('T')[0];

  const getSummaryText = () => {
    if (cfg.durationUnit === 'minutes') {
      const val = cfg.durationValue || 0;
      return `${val} minuto${val === 1 ? '' : 's'}`;
    }
    if (cfg.durationUnit === 'hours') {
      const h = cfg.durationHours || 0;
      const m = cfg.durationExtraMinutes || 0;
      let txt = '';
      if (h > 0) txt += `${h} hora${h === 1 ? '' : 's'}`;
      if (m > 0) txt += (h > 0 ? ' y ' : '') + `${m} minuto${m === 1 ? '' : 's'}`;
      if (!txt) txt = '0 minutos';
      return txt;
    }
    if (cfg.durationUnit === 'days') {
      const val = cfg.durationValue || 0;
      return `${val} día${val === 1 ? '' : 's'}`;
    }
    return '';
  };

  /* LOGICA DE ESTILOS DE PREVIEW */
  const containerStyle: React.CSSProperties = {
    background: cfg.template === 'gradient' ? `linear-gradient(135deg, ${cfg.gradStart}, ${cfg.gradEnd})` 
              : cfg.template === 'glass' ? `linear-gradient(135deg, ${cfg.gradStart}E6, ${cfg.gradEnd}E6)`
              : cfg.template === 'outline' ? 'transparent'
              : cfg.gradStart,
    border: cfg.template === 'outline' ? `2px dashed ${cfg.gradEnd}` : 'none',
    borderLeft: cfg.template === 'blocks' ? `8px solid ${cfg.gradEnd}` : 'none',
    borderTop: cfg.template === 'minimal' ? `1px solid ${cfg.gradEnd}` : 'none',
    borderBottom: cfg.template === 'minimal' ? `1px solid ${cfg.gradEnd}` : 'none',
    borderRadius: cfg.template === 'pill' ? 999 : cfg.template === 'blocks' || cfg.template === 'minimal' ? 0 : 16,
    boxShadow: cfg.template === 'neon' ? `0 0 15px ${cfg.gradStart}40` : '0 8px 24px rgba(0,0,0,0.08)',
    backdropFilter: cfg.template === 'glass' ? 'blur(10px)' : 'none',
    padding: cfg.blockSize === 'compact' ? '12px 16px' : cfg.blockSize === 'large' ? '24px 28px' : '18px 22px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', boxSizing: 'border-box'
  };

  const getDigitBoxStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: cfg.blockSize === 'compact' ? '4px 8px' : cfg.blockSize === 'large' ? '8px 14px' : '6px 11px',
      borderRadius: cfg.template === 'pill' ? 999 : cfg.template === 'minimal' || cfg.template === 'outline' || cfg.template === 'blocks' ? 0 : 8,
      position: 'relative', overflow: 'hidden'
    };

    if (['classic', 'cards', 'pill', 'blocks', 'pastel', 'flip'].includes(cfg.template)) {
      base.background = cfg.gradEnd;
      if (cfg.template === 'cards') base.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    } else if (cfg.template === 'gradient') {
      base.background = 'rgba(0,0,0,0.2)';
    } else if (cfg.template === 'glass') {
      base.background = 'rgba(255,255,255,0.1)';
      base.border = '1px solid rgba(255,255,255,0.2)';
    } else if (cfg.template === 'outline' || cfg.template === 'neon') {
      base.background = 'transparent';
      base.border = `2px solid ${cfg.gradEnd}`;
      if (cfg.template === 'neon') base.boxShadow = `0 0 10px ${cfg.gradEnd}80`;
    } else if (cfg.template === 'minimal') {
      base.background = 'transparent';
    }

    return base;
  };

  const getDigitTextStyle = (): React.CSSProperties => {
    return {
      fontSize: cfg.blockSize === 'compact' ? 16 : cfg.blockSize === 'large' ? 24 : 20,
      fontWeight: 900, fontFamily: 'monospace',
      color: cfg.template === 'neon' ? cfg.gradEnd : cfg.textColor,
      textShadow: cfg.template === 'neon' ? `0 0 8px ${cfg.gradEnd}` : 'none',
      position: 'relative', zIndex: 2
    };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* HEADER STICKY */}
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
          {ew ? 'Editar widget: ' : 'Nuevo widget: '}
          {wd.name} ({scopeLabel})
        </h1>

        {/* Contenedor principal */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>

          {/* PREVIEW GRANDE EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VISTA PREVIA EN VIVO
            </div>

            <div style={containerStyle}>
              {cfg.title && (
                <div style={{ fontSize: cfg.blockSize === 'compact' ? 14 : cfg.blockSize === 'large' ? 19 : 16, fontWeight: 800, textAlign: 'center', color: cfg.textColor }}>
                  {cfg.title}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: cfg.blockSize === 'compact' ? 6 : 10 }}>
                {previewDigits.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span style={{ fontSize: 18, fontWeight: 900, opacity: 0.8, color: cfg.template === 'neon' ? cfg.gradEnd : cfg.textColor }}>:</span>}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={getDigitBoxStyle()}>
                        {cfg.template === 'flip' && (
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.3)', zIndex: 1 }} />
                        )}
                        <span style={getDigitTextStyle()}>{item.num}</span>
                      </div>
                      <span style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.8, marginTop: 4, fontWeight: 700, color: cfg.template === 'neon' ? cfg.gradEnd : cfg.textColor }}>
                        {item.label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {cfg.coupon && (
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px dashed rgba(255,255,255,0.6)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  color: cfg.textColor,
                }}>
                  🎟️ CUPÓN: {cfg.coupon} (Copiar)
                </div>
              )}

              {cfg.ctaText && (
                <div style={{
                  background: '#ffffff',
                  color: '#111827',
                  borderRadius: 999,
                  padding: '6px 16px',
                  fontSize: 12,
                  fontWeight: 800,
                  marginTop: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  {cfg.ctaText} →
                </div>
              )}
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
              Creá un sentido de urgencia real. Podés configurarlo por minutos, horas exactas con reloj o hasta una fecha límite con calendario.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', 'General'],
                ['style', 'Diseño y Colores'],
                ['extra', 'Cupón & CTA'],
                ['dates', '🔥 Fechas Especiales'],
              ] as const
            ).map(([k, l]) => {
              const act = tab === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  style={{
                    flex: 1, padding: '14px 12px', background: 'none',
                    border: 'none', borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000000',
                    opacity: act ? 1 : 0.6,
                    fontSize: 14, fontWeight: act ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    whiteSpace: 'nowrap', transition: 'all 0.2s',
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>

          {/* TAB GENERAL */}
          {tab === 'gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* TIPO DE CUENTA REGRESIVA */}
              <div>
                <FieldLabel>Tipo de cuenta regresiva</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'minutes', label: '⏱️ Tiempo Fijo' },
                    { id: 'date', label: '📅 Fecha Exacta' },
                    { id: 'daily', label: '🔄 Diario' },
                  ].map((t) => {
                    const active = cfg.timerType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => set('timerType', t.id as any)}
                        style={{
                          padding: '12px 10px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          textAlign: 'center',
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CONFIGURACIÓN DE DURACIÓN */}
              {cfg.timerType === 'minutes' && (
                <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 16 }}>

                  <div>
                    <FieldLabel>¿Cómo querés configurar la duración?</FieldLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
                      {[
                        { id: 'minutes', label: 'Minutos', emoji: '⏱️' },
                        { id: 'hours', label: 'Horas + Min', emoji: '🕐' },
                        { id: 'days', label: 'Días', emoji: '📆' },
                      ].map((u) => {
                        const active = cfg.durationUnit === u.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => handleDurationUnitChange(u.id as any)}
                            style={{
                              padding: '12px 8px', borderRadius: 10,
                              border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                              background: active ? '#ecfdf5' : '#ffffff',
                              color: active ? '#059669' : '#000000',
                              fontSize: 13, fontWeight: 700, cursor: 'pointer',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            }}
                          >
                            <span style={{ fontSize: 20 }}>{u.emoji}</span>
                            <span>{u.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* MINUTOS */}
                  {cfg.durationUnit === 'minutes' && (
                    <div>
                      <FieldLabel>Cantidad de minutos por visita</FieldLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', border: '2px solid #10B981', borderRadius: 12, padding: 14 }}>
                        <IconClock />
                        <input
                          type="number"
                          value={cfg.durationValue === 0 ? '' : cfg.durationValue}
                          onChange={(e) => handleMinutesChange(e.target.value)}
                          onBlur={() => {
                            if (!cfg.durationValue || cfg.durationValue < 1) {
                              handleMinutesChange('15');
                            }
                          }}
                          placeholder="15"
                          style={{
                            flex: 1, border: 'none', outline: 'none',
                            fontSize: 24, fontWeight: 800, color: '#000000',
                            background: 'transparent', fontFamily: 'inherit', width: '100%',
                          }}
                        />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>MIN</span>
                      </div>
                      <FieldHelper>Ejemplo: 15 minutos. Cada visitante verá la cuenta iniciar desde ese momento.</FieldHelper>
                    </div>
                  )}

                  {/* HORAS + MINUTOS */}
                  {cfg.durationUnit === 'hours' && (
                    <div>
                      <FieldLabel>Hora y minutos exactos (reloj)</FieldLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', border: '2px solid #10B981', borderRadius: 12, padding: 14 }}>
                        <IconClock />
                        <input
                          type="time"
                          value={clockValue}
                          onChange={(e) => handleClockChange(e.target.value)}
                          style={{
                            flex: 1, border: 'none', outline: 'none',
                            fontSize: 24, fontWeight: 800, color: '#000000',
                            background: 'transparent', fontFamily: 'inherit', width: '100%',
                          }}
                        />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>HH:MM</span>
                      </div>
                      <FieldHelper>Ejemplo: 02:30 = 2 horas y 30 minutos por visita.</FieldHelper>
                    </div>
                  )}

                  {/* DÍAS */}
                  {cfg.durationUnit === 'days' && (
                    <div>
                      <FieldLabel>Cantidad de días por visita</FieldLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', border: '2px solid #10B981', borderRadius: 12, padding: 14 }}>
                        <IconCalendar />
                        <input
                          type="number"
                          value={cfg.durationValue === 0 ? '' : cfg.durationValue}
                          onChange={(e) => handleDaysChange(e.target.value)}
                          onBlur={() => {
                            if (!cfg.durationValue || cfg.durationValue < 1) {
                              handleDaysChange('1');
                            }
                          }}
                          placeholder="1"
                          style={{
                            flex: 1, border: 'none', outline: 'none',
                            fontSize: 24, fontWeight: 800, color: '#000000',
                            background: 'transparent', fontFamily: 'inherit', width: '100%',
                          }}
                        />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>DÍAS</span>
                      </div>
                      <FieldHelper>Si querés una fecha exacta con calendario, usá el tipo &quot;📅 Fecha Exacta&quot; arriba.</FieldHelper>
                    </div>
                  )}

                  {/* RESUMEN */}
                  <div style={{
                    background: '#ecfdf5', borderRadius: 10, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #a7f3d0',
                  }}>
                    <span style={{ fontSize: 18 }}>✅</span>
                    <span style={{ fontSize: 13, color: '#065f46', fontWeight: 600 }}>
                      Configurado: <strong>{getSummaryText()}</strong> por cada visita
                    </span>
                  </div>
                </div>
              )}

              {/* FECHA EXACTA */}
              {cfg.timerType === 'date' && (
                <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                  <FieldLabel>Fecha y hora límite de la oferta</FieldLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', border: '2px solid #10B981', borderRadius: 12, padding: 14, marginTop: 4 }}>
                    <IconCalendar />
                    <input
                      type="datetime-local"
                      min={todayISO + 'T00:00'}
                      value={cfg.exactDate}
                      onChange={(e) => set('exactDate', e.target.value)}
                      style={{
                        flex: 1, border: 'none', outline: 'none',
                        fontSize: 16, fontWeight: 700, color: '#000000',
                        background: 'transparent', fontFamily: 'inherit', width: '100%',
                      }}
                    />
                  </div>
                  <FieldHelper>Elegí la fecha y hora exacta donde termina la promoción.</FieldHelper>
                </div>
              )}

              {/* DIARIO */}
              {cfg.timerType === 'daily' && (
                <div style={{
                  background: '#ecfdf5', borderRadius: 12, padding: 16,
                  border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 28 }}>🔄</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#065f46' }}>Modo Diario Activado</div>
                    <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>
                      El temporizador se reinicia automáticamente cada día a las 23:59.
                    </div>
                  </div>
                </div>
              )}

              {/* TÍTULO */}
              <div>
                <FieldLabel>Título del temporizador</FieldLabel>
                <TextInput
                  value={cfg.title}
                  onChange={(v) => set('title', v)}
                  placeholder="¡Oferta por tiempo limitado!"
                />
              </div>

              {/* UBICACIÓN */}
              <div>
                <FieldLabel>¿Dónde mostrarlo?</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'product_before', label: '⬆️ Arriba del botón Agregar al Carrito' },
                    { id: 'product_after', label: '⬇️ Abajo del botón Agregar al Carrito' },
                    { id: 'top_bar', label: '🔝 Barra Superior (Top Bar)' },
                  ].map((loc) => {
                    const active = cfg.location === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => set('location', loc.id as any)}
                        style={{
                          padding: '12px 10px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center', lineHeight: 1.3,
                        }}
                      >
                        {loc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAMAÑO DEL BLOQUE */}
              <div>
                <FieldLabel>Tamaño del bloque</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'compact', label: 'Compacto' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'large', label: 'Grande' },
                  ].map((sz) => {
                    const active = cfg.blockSize === sz.id;
                    return (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => set('blockSize', sz.id as any)}
                        style={{
                          padding: '10px', borderRadius: 8,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {sz.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <FieldLabel>Plantilla de diseño</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
                  {TEMPLATES_LIST.map((tpl) => {
                    const active = cfg.template === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => set('template', tpl.id)}
                        style={{
                          padding: '10px 6px', borderRadius: 8,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {tpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Fondo / Principal</FieldLabel>
                  <ColorPickerField value={cfg.gradStart} onChange={(v) => setCustomColor('gradStart', v)} />
                  <FieldHelper>Color base del contenedor.</FieldHelper>
                </div>
                <div>
                  <FieldLabel>Cajas / Acento (Secundario)</FieldLabel>
                  <ColorPickerField value={cfg.gradEnd} onChange={(v) => setCustomColor('gradEnd', v)} />
                  <FieldHelper>Color de cajas, bordes o neón.</FieldHelper>
                </div>
                <div>
                  <FieldLabel>Texto / Números</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                  <FieldHelper>Color de letras y títulos.</FieldHelper>
                </div>
              </div>
            </div>
          )}

          {/* TAB CUPÓN Y CTA */}
          {tab === 'extra' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Cupón de Descuento (Opcional)</FieldLabel>
                <TextInput
                  value={cfg.coupon}
                  onChange={(v) => set('coupon', v.toUpperCase())}
                  placeholder="Ej: OFERTA20"
                />
                <FieldHelper>Si ingresás un código, se mostrará un botón para que el cliente lo copie al tocarlo.</FieldHelper>
              </div>

              <div>
                <FieldLabel>Texto del Botón CTA (Opcional)</FieldLabel>
                <TextInput
                  value={cfg.ctaText}
                  onChange={(v) => set('ctaText', v)}
                  placeholder="Ej: Ver oferta especial"
                />
              </div>

              <div>
                <FieldLabel>URL del Botón CTA</FieldLabel>
                <TextInput
                  value={cfg.ctaUrl}
                  onChange={(v) => set('ctaUrl', v)}
                  placeholder="https://mitienda.com/ofertas"
                />
              </div>
            </div>
          )}

          {/* TAB FECHAS ESPECIALES */}
          {tab === 'dates' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
                <FieldHelper>
                  Elegí una campaña activa para vestir la cuenta regresiva con colores de conversión probados.
                </FieldHelper>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CAMPAIGN_PRESETS.map((preset) => {
                  const isSelected = cfg.campaignTheme === preset.id;
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ALERTAS */}
          <div style={{ marginTop: 20 }}>
            {ok && (
              <div style={{
                background: '#ecfdf5', border: '1px solid #10B981',
                borderRadius: 10, padding: '10px 16px',
                fontSize: 13, fontWeight: 700, color: '#059669',
              }}>
                ✅ Widget guardado correctamente
              </div>
            )}
            {err && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: 10, padding: '10px 16px',
                fontSize: 13, fontWeight: 700, color: '#dc2626',
              }}>
                ❌ {err}
              </div>
            )}
          </div>

          {/* BOTÓN GUARDAR */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                padding: '14px 40px', borderRadius: 999,
                border: 'none',
                background: saving ? '#9ca3af' : '#10B981',
                color: '#fff', fontSize: 15, fontWeight: 800,
                cursor: saving ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              {saving ? 'Guardando...' : ew ? 'Actualizar Widget' : 'Crear Widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA OFICIAL */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
     }
