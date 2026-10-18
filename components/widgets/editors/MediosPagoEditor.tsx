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

interface CustomLogoItem {
  id: string;
  name: string;
  url: string;
}

export interface CfgMediosPago {
  title: string;
  showInstallmentMessage: boolean;
  installmentText: string;
  showSecureBadge: boolean;
  secureBadgeText: string;
  activeMethods: string[];
  customLogos: CustomLogoItem[];
  position: 'before-description' | 'before-add-to-cart';
  alignment: 'left' | 'center' | 'right';
  bgColor: string;
  textColor: string;
  accentColor: string;
  modoColorIconos: 'original' | 'grayscale';
  cardSize: 'sm' | 'md' | 'lg';
  campaignTheme: string;
}

interface MediosPagoEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId?: number | null;
  storeId: string | number;
  initialConfig?: any;
  widgetId?: string | number;
  categoryId?: string;
  onSave?: (config: any) => void;
  isSaving?: boolean;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO Y MÉTODOS ESTÁNDAR
═══════════════════════════════════════════ */
const DEFAULT_METHODS = [
  { id: 'visa', name: 'Visa' },
  { id: 'mastercard', name: 'Mastercard' },
  { id: 'amex', name: 'American Express' },
  { id: 'cabal', name: 'Cabal' },
  { id: 'naranjax', name: 'Naranja X' },
  { id: 'mercadopago', name: 'Mercado Pago' },
  { id: 'modo', name: 'MODO' },
  { id: 'uala', name: 'Ualá' },
  { id: 'gocuotas', name: 'Go Cuotas' },
  { id: 'pagonube', name: 'Pago Nube' },
  { id: 'pagofacil', name: 'Pago Fácil' },
  { id: 'rapipago', name: 'Rapipago' },
  { id: 'transferencia', name: 'Transferencia' },
];

const DEF: CfgMediosPago = {
  title: 'MEDIOS DE PAGO Y CUOTAS',
  showInstallmentMessage: true,
  installmentText: 'Hasta 3 cuotas sin interés',
  showSecureBadge: true,
  secureBadgeText: 'Pago 100% seguro',
  activeMethods: [
    'visa',
    'mastercard',
    'amex',
    'naranjax',
    'mercadopago',
    'modo',
    'uala',
    'transferencia',
  ],
  customLogos: [],
  position: 'before-description',
  alignment: 'center',
  bgColor: '#ffffff',
  textColor: '#111827',
  accentColor: '#10B981',
  modoColorIconos: 'original',
  cardSize: 'md',
  campaignTheme: 'none',
};

const THEME_FX: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  'black-friday': { bg: '#111827', text: '#ffffff', accent: '#F59E0B', border: '1px solid #374151' },
  'hot-sale': { bg: '#0F172A', text: '#ffffff', accent: '#EF4444', border: '1px solid #1E293B' },
  'cyber-monday': { bg: '#090D16', text: '#ffffff', accent: '#3B82F6', border: '1px solid #1E3A8A' },
  'navidad': { bg: '#064E3B', text: '#ffffff', accent: '#EF4444', border: '1px solid #047857' },
  'san-valentin': { bg: '#FFF1F2', text: '#831843', accent: '#F43F5E', border: '1px solid #FECDD3' },
  'dia-padre-madre': { bg: '#EEF2FF', text: '#312E81', accent: '#6366F1', border: '1px solid #C7D2FE' },
  'liquidacion': { bg: '#FEF2F2', text: '#7F1D1D', accent: '#F59E0B', border: '1px solid #FECACA' },
};

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES Y LOGOS SVG INLINE
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const PaymentLogoSVG = ({ id, mode = 'original' }: { id: string; mode?: 'original' | 'grayscale' }) => {
  const isGray = mode === 'grayscale';
  const filterStyle = isGray ? { filter: 'grayscale(100%) opacity(0.85)' } : {};

  const logoMap: Record<string, React.ReactNode> = {
    visa: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#1A1F71" />
        <path d="M14.5 16.5L16.6 6.8H19.5L17.4 16.5H14.5ZM24.4 7C23.8 6.8 22.9 6.5 21.8 6.5C18.9 6.5 16.9 8 16.9 10.1C16.9 11.7 18.3 12.6 19.4 13.1C20.5 13.6 20.9 14 20.9 14.5C20.9 15.3 19.9 15.6 19 15.6C17.7 15.6 16.9 15.3 16.2 14.9L15.7 17.2C16.5 17.6 17.8 17.9 19.2 17.9C22.3 17.9 24.3 16.4 24.3 14.1C24.3 12.1 22.4 11.3 21.2 10.7C20.4 10.3 20 10 20 9.5C20 9 20.6 8.6 21.6 8.6C22.6 8.6 23.4 8.8 24 9.1L24.4 7ZM30.4 16.5H33L30.7 6.8H28.3C27.7 6.8 27.2 7.1 27 7.6L23 16.5H26L26.6 14.8H30L30.4 16.5ZM27.4 12.6L28.8 8.8L29.6 12.6H27.4ZM13.2 6.8L10.4 13.4L10.1 11.9C9.6 10.2 8.1 8.3 6.3 7.4L8.8 16.5H11.8L16.2 6.8H13.2Z" fill="#F7B600" />
      </svg>
    ),
    mastercard: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#111827" />
        <circle cx="15" cy="12" r="7" fill="#EB001B" />
        <circle cx="23" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    ),
    amex: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#006FCF" />
        <text x="5" y="16" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">AMEX</text>
      </svg>
    ),
    cabal: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#003865" />
        <circle cx="13" cy="12" r="5" fill="#E30613" />
        <circle cx="21" cy="12" r="5" fill="#009639" />
        <circle cx="25" cy="12" r="3" fill="#0072CE" />
      </svg>
    ),
    naranjax: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#FF6B00" />
        <text x="6" y="16" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">NX</text>
      </svg>
    ),
    mercadopago: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#009EE3" />
        <path d="M11 12C11 9.8 12.8 8 15 8C17.2 8 19 9.8 19 12M19 12C19 14.2 20.8 16 23 16C25.2 16 27 14.2 27 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    modo: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#432483" />
        <text x="4" y="16" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">modo</text>
      </svg>
    ),
    uala: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#FF3B5C" />
        <text x="8" y="16" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">ualá</text>
      </svg>
    ),
    gocuotas: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#00D084" />
        <text x="6" y="16" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">GO!</text>
      </svg>
    ),
    pagonube: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#2B6CB0" />
        <path d="M12 15C10.5 15 9.5 14 9.5 12.5C9.5 11 10.8 9.8 12.2 10C13 8.8 14.5 8 16 8C18.2 8 20 9.8 20 12C21 12 22 13 22 14.2C22 15.5 21 16 19.5 16H12Z" fill="#FFFFFF" />
      </svg>
    ),
    pagofacil: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#FFE800" />
        <text x="4" y="16" fill="#003865" fontSize="10" fontWeight="900" fontFamily="sans-serif">PAGO</text>
      </svg>
    ),
    rapipago: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#FFCC00" />
        <text x="5" y="16" fill="#002D62" fontSize="10" fontWeight="900" fontFamily="sans-serif">Rapi</text>
      </svg>
    ),
    transferencia: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={filterStyle}>
        <rect width="38" height="24" rx="4" fill="#10B981" />
        <path d="M9 17V16H29V17H9ZM10 14V10H12V14H10ZM15 14V10H17V14H15ZM20 14V10H22V14H20ZM25 14V10H27V14H25ZM19 7L29 9V8L19 6L9 8V9L19 7Z" fill="#FFFFFF" />
      </svg>
    ),
  };

  return logoMap[id] || (
    <div style={{
      width: 38, height: 24, borderRadius: 4, background: '#374151',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 9, fontWeight: 700
    }}>
      {id.slice(0, 3).toUpperCase()}
    </div>
  );
};

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
      {children}
    </p>
  );
}

function TextInput({
  value, onChange, placeholder, type = 'text',
}: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 14,
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
          width: 38, height: 38, borderRadius: 8,
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
          padding: '9px 10px', fontSize: 13,
          border: '1.5px solid #e5e7eb', borderRadius: 8,
          background: '#ffffff', color: '#000000', outline: 'none',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleSwitch({
  checked, onChange, activeColor = '#10B981'
}: {
  checked: boolean; onChange: (v: boolean) => void; activeColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 48, height: 26, borderRadius: 999,
        background: checked ? activeColor : '#e5e7eb',
        border: 'none', cursor: 'pointer', padding: 3,
        display: 'flex', alignItems: 'center',
        transition: 'background-color 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20, height: 20, borderRadius: '50%',
          background: '#ffffff',
          transform: checked ? 'translateX(22px)' : 'translateX(0px)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function parseCfg(raw: Record<string, unknown> | undefined): CfgMediosPago {
  if (!raw) return { ...DEF };
  return {
    title: raw.title !== undefined ? String(raw.title) : DEF.title,
    showInstallmentMessage: typeof raw.showInstallmentMessage === 'boolean' ? raw.showInstallmentMessage : DEF.showInstallmentMessage,
    installmentText: raw.installmentText !== undefined ? String(raw.installmentText) : DEF.installmentText,
    showSecureBadge: typeof raw.showSecureBadge === 'boolean' ? raw.showSecureBadge : DEF.showSecureBadge,
    secureBadgeText: raw.secureBadgeText !== undefined ? String(raw.secureBadgeText) : DEF.secureBadgeText,
    activeMethods: Array.isArray(raw.activeMethods) ? (raw.activeMethods as string[]) : DEF.activeMethods,
    customLogos: Array.isArray(raw.customLogos) ? (raw.customLogos as CustomLogoItem[]) : DEF.customLogos,
    position: (raw.position as CfgMediosPago['position']) || DEF.position,
    alignment: (raw.alignment as CfgMediosPago['alignment']) || DEF.alignment,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    modoColorIconos: (raw.modoColorIconos as CfgMediosPago['modoColorIconos']) || DEF.modoColorIconos,
    cardSize: (raw.cardSize as CfgMediosPago['cardSize']) || DEF.cardSize,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function MediosPagoEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
  initialConfig,
  onSave,
  isSaving,
}: MediosPagoEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<CfgMediosPago>(() => parseCfg(ew?.config || initialConfig));
  const [tab, setTab] = useState<'gen' | 'ubicacion' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof CfgMediosPago>(k: K, v: CfgMediosPago[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (key: keyof CfgMediosPago, val: string) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const toggleMethod = (methodId: string) => {
    setCfg((prev) => {
      const exists = prev.activeMethods.includes(methodId);
      return {
        ...prev,
        activeMethods: exists
          ? prev.activeMethods.filter((m) => m !== methodId)
          : [...prev.activeMethods, methodId],
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxW = 120;
        const maxH = 80;
        let width = img.width;
        let height = img.height;

        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }
        if (height > maxH) {
          width = Math.round((width * maxH) / height);
          height = maxH;
        }

        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        const base64 = canvas.toDataURL('image/png', 0.85);
        const newLogo: CustomLogoItem = {
          id: 'custom-' + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: base64,
        };

        setCfg((prev) => ({
          ...prev,
          customLogos: [...prev.customLogos, newLogo],
        }));
        setUploadingLogo(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeCustomLogo = (id: string) => {
    setCfg((prev) => ({
      ...prev,
      customLogos: prev.customLogos.filter((l) => l.id !== id),
    }));
  };

  const applyPreset = (slug: string) => {
    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: 'none',
        bgColor: DEF.bgColor,
        textColor: DEF.textColor,
        accentColor: DEF.accentColor,
      }));
      return;
    }
    const p = THEME_FX[slug];
    if (p) {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.text,
        accentColor: p.accent,
      }));
    }
  };

  const save = async () => {
    if (onSave) {
      onSave(cfg);
      return;
    }

    setSaving(true);
    setOk(false);
    setErr('');

    try {
      const body = {
        id: ew?.id ?? null,
        store_id: storeId,
        widget_slug: wd.slug,
        config: cfg,
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

  const getPreviewStyles = () => {
    const theme = cfg.campaignTheme && cfg.campaignTheme !== 'none' ? THEME_FX[cfg.campaignTheme] : null;
    let bg = cfg.bgColor;
    let text = cfg.textColor;
    let accent = cfg.accentColor;
    let border = '1px solid #e5e7eb';

    if (theme) {
      bg = theme.bg;
      text = theme.text;
      accent = theme.accent;
      border = theme.border;
    }

    return { bg, text, accent, border };
  };

  const ps = getPreviewStyles();

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Diseño.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo oscuro elegante con acento dorado.' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Nocturno con acentos rojo fuego.' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul cibernético con detalles resplandecientes.' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con rojo navideño.' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Fondo suave rosa con texto y detalles pasión.' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Fondo índigo claro con texto profundo.' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Tonos cálidos con acentos ámbar.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

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

        <h1 style={{
          fontSize: 26, fontWeight: 800, color: '#000000',
          margin: '0 0 20px', lineHeight: 1.2,
        }}>
          {ew ? 'Editar widget: ' : 'Nuevo widget: '}
          {wd.name} ({scopeLabel})
        </h1>

        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>

          {/* PREVIEW GRANDE EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              VISTA PREVIA EN VIVO (Muestra {cfg.activeMethods.length + cfg.customLogos.length} medios configurados)
            </div>

            <div
              style={{
                background: ps.bg,
                border: ps.border,
                borderRadius: 16,
                padding: '20px',
                color: ps.text,
                transition: 'all 0.3s ease',
                textAlign: cfg.alignment,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: cfg.alignment === 'center' ? 'center' : cfg.alignment === 'right' ? 'flex-end' : 'flex-start', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                {cfg.title && (
                  <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {cfg.title}
                  </span>
                )}
                {cfg.showSecureBadge && (
                  <span style={{
                    background: ps.accent, color: '#ffffff',
                    fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999,
                    display: 'inline-flex', alignItems: 'center', gap: 4
                  }}>
                    🔒 {cfg.secureBadgeText}
                  </span>
                )}
              </div>

              {cfg.showInstallmentMessage && (
                <div style={{
                  background: 'rgba(16,185,129,0.1)', color: ps.accent,
                  border: `1px solid ${ps.accent}`, borderRadius: 8,
                  padding: '8px 12px', fontSize: 12, fontWeight: 800,
                  marginBottom: 14, display: 'inline-block'
                }}>
                  💳 {cfg.installmentText}
                </div>
              )}

              {/* LOGOS RECTÁNGULOS DE PAGO */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8,
                justifyContent: cfg.alignment === 'center' ? 'center' : cfg.alignment === 'right' ? 'flex-end' : 'flex-start',
                marginTop: 6
              }}>
                {cfg.activeMethods.map((mId) => (
                  <div key={mId} style={{
                    borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <PaymentLogoSVG id={mId} mode={cfg.modoColorIconos} />
                  </div>
                ))}
                {cfg.customLogos.map((logo) => (
                  <div key={logo.id} style={{
                    width: 38, height: 24, borderRadius: 6, overflow: 'hidden',
                    border: '1px solid #e5e7eb', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <img src={logo.url} alt={logo.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: cfg.modoColorIconos === 'grayscale' ? 'grayscale(100%)' : 'none' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', 'General'],
                ['ubicacion', 'Ubicación'],
                ['style', 'Diseño'],
                ['dates', '🔥 Eventos'],
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Título del widget</FieldLabel>
                  <TextInput
                    value={cfg.title}
                    onChange={(v) => set('title', v)}
                    placeholder="MEDIOS DE PAGO Y CUOTAS"
                  />
                  <FieldHelper>Texto que encabeza la sección de pagos.</FieldHelper>
                </div>
                <div>
                  <FieldLabel>Mensaje de Cuotas</FieldLabel>
                  <TextInput
                    value={cfg.installmentText}
                    onChange={(v) => set('installmentText', v)}
                    placeholder="Hasta 3 cuotas sin interés"
                  />
                  <FieldHelper>Destaca una promoción importante de tu tienda.</FieldHelper>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>🔒 Sello de Pago Seguro</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Muestra una distinción de confianza para reducir abandonos de carrito.</div>
                  </div>
                  <ToggleSwitch checked={cfg.showSecureBadge} onChange={(v) => set('showSecureBadge', v)} />
                </div>
                {cfg.showSecureBadge && (
                  <TextInput
                    value={cfg.secureBadgeText}
                    onChange={(v) => set('secureBadgeText', v)}
                    placeholder="Pago 100% seguro"
                  />
                )}
              </div>

              {/* SELECCIÓN DE MEDIOS DE PAGO */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <FieldLabel>Medios de Pago Disponibles</FieldLabel>
                <FieldHelper>Seleccioná las tarjetas y servicios de pago que aceptás en tu negocio.</FieldHelper>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 12, marginTop: 14
                }}>
                  {DEFAULT_METHODS.map((m) => {
                    const isChecked = cfg.activeMethods.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleMethod(m.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', borderRadius: 10,
                          border: isChecked ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: isChecked ? '#ECFDF5' : '#ffffff',
                          cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                      >
                        <PaymentLogoSVG id={m.id} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', flex: 1 }}>
                          {m.name}
                        </span>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: isChecked ? '#10B981' : 'transparent',
                          border: isChecked ? 'none' : '2px solid #d1d5db',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ffffff', fontSize: 11, fontWeight: 900
                        }}>
                          {isChecked && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LOGOS PERSONALIZADOS */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <FieldLabel>Subir Logos Propios / Adicionales</FieldLabel>
                <FieldHelper>Agregá otros medios regionales o sellos propios (formato PNG/SVG recomendado).</FieldHelper>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <label style={{
                    background: '#10B981', color: '#ffffff', padding: '9px 16px',
                    borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 6
                  }}>
                    {uploadingLogo ? 'Cargando...' : '+ Subir Logo'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploadingLogo} style={{ display: 'none' }} />
                  </label>

                  {cfg.customLogos.map((l) => (
                    <div key={l.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 10px', background: '#ffffff', border: '1px solid #e5e7eb',
                      borderRadius: 8
                    }}>
                      <img src={l.url} alt={l.name} style={{ width: 28, height: 20, objectFit: 'contain' }} />
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{l.name}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomLogo(l.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 14, fontWeight: 800, cursor: 'pointer', padding: 2 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <FieldLabel>Posición en la ficha de producto</FieldLabel>
                <FieldHelper>Elegí en qué sector exacto de la página del producto aparecerá el bloque.</FieldHelper>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                  {[
                    { id: 'before-description', label: 'Antes de la descripción', desc: 'Ubicado arriba de la solapa de descripción del producto.' },
                    { id: 'before-add-to-cart', label: 'Antes del botón Agregar al Carrito', desc: 'Justo arriba del botón de compra para acelerar la conversión.' },
                  ].map((pos) => (
                    <label
                      key={pos.id}
                      onClick={() => set('position', pos.id as any)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 10,
                        border: cfg.position === pos.id ? '2px solid #10B981' : '1px solid #e5e7eb',
                        background: cfg.position === pos.id ? '#ECFDF5' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="position"
                        value={pos.id}
                        checked={cfg.position === pos.id}
                        onChange={() => {}}
                        style={{ accentColor: '#10B981', width: 18, height: 18 }}
                      />
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', display: 'block' }}>{pos.label}</span>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>{pos.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Alineación del contenido</FieldLabel>
                  <select
                    value={cfg.alignment}
                    onChange={(e) => set('alignment', e.target.value as any)}
                    style={{
                      width: '100%', padding: '12px 14px', fontSize: 14,
                      border: '1.5px solid #e5e7eb', borderRadius: 10,
                      background: '#ffffff', color: '#000000', outline: 'none'
                    }}
                  >
                    <option value="center">Centrado</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Modo de Color de Iconos</FieldLabel>
                  <select
                    value={cfg.modoColorIconos}
                    onChange={(e) => set('modoColorIconos', e.target.value as any)}
                    style={{
                      width: '100%', padding: '12px 14px', fontSize: 14,
                      border: '1.5px solid #e5e7eb', borderRadius: 10,
                      background: '#ffffff', color: '#000000', outline: 'none'
                    }}
                  >
                    <option value="original">Colores Originales</option>
                    <option value="grayscale">Escala de Grises / Monocromo</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <FieldLabel>Paleta de Colores Personalizada</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 12 }}>
                  <div>
                    <FieldLabel>Fondo del Bloque</FieldLabel>
                    <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Texto Principal</FieldLabel>
                    <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color de Acento / Sello</FieldLabel>
                    <ColorPickerField value={cfg.accentColor} onChange={(v) => setCustomColor('accentColor', v)} />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB FECHAS ESPECIALES */}
          {tab === 'dates' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
                <FieldHelper>
                  Elegí una campaña: los colores del bloque, texto e insignias se adaptarán automáticamente al evento.
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

          {/* MENSAJES DE ESTADO */}
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

          {/* BOTÓN AL FINAL DEL BLOQUE */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={save}
              disabled={saving || isSaving}
              style={{
                padding: '14px 40px', borderRadius: 999,
                border: 'none',
                background: (saving || isSaving) ? '#9ca3af' : '#10B981',
                color: '#fff', fontSize: 15, fontWeight: 800,
                cursor: (saving || isSaving) ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              {(saving || isSaving) ? 'Guardando...' : ew ? 'Actualizar Widget' : 'Crear Widget'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </div>

    </div>
  );
  }
