'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  target_category_id?: string | number | null;
}

interface CarruselResenasEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export type ReviewIconType = 'none' | 'google' | 'mercadolibre' | 'verified';

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  photo?: string;
  icon: ReviewIconType;
}

export interface Cfg {
  // General
  title: string;
  subtitle: string;
  showHeaderStars: boolean;
  showCtaButton: boolean;
  ctaButtonText: string;
  ctaButtonLink: string;
  reviews: ReviewItem[];

  // Ubicación
  location: 'product_before' | 'product_after';

  // Colores
  bgColor: string;
  titleColor: string;
  subtitleColor: string;
  textColor: string;
  starColor: string;
  headerStarColor: string;
  cardBgColor: string;
  borderColor: string;
  ctaBgColor: string;
  ctaTextColor: string;

  // Tipografías (px)
  titleFontSize: number;
  subtitleFontSize: number;
  nameFontSize: number;
  textFontSize: number;
  starFontSize: number;
  headerStarFontSize: number;

  // Sliders & Comportamiento
  cardRadius: number;
  cardPadding: number;
  borderWidth: number;
  speed: number;
  ctaBorderRadius: number;

  // Fechas especiales
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: '1',
    name: 'Camila R.',
    rating: 5,
    text: 'La calidad del producto superó mis expectativas. Llegó en perfecto estado y súper rápido. ¡Totalmente recomendado!',
    icon: 'verified',
  },
  {
    id: '2',
    name: 'Gonzalo M.',
    rating: 5,
    text: 'Excelente atención al cliente y el embalaje impecable. Definitivamente voy a volver a comprar.',
    icon: 'google',
  },
  {
    id: '3',
    name: 'Lucía P.',
    rating: 5,
    text: 'Hermoso producto, exacto a las fotos de la publicación. La experiencia de compra fue 10/10.',
    icon: 'mercadolibre',
  },
];

const DEF: Cfg = {
  title: 'Lo que dicen nuestros clientes',
  subtitle: 'Reseñas verificadas por clientes reales.',
  showHeaderStars: true,
  showCtaButton: true,
  ctaButtonText: 'Ver más opiniones',
  ctaButtonLink: '#',
  reviews: DEFAULT_REVIEWS,

  location: 'product_after',

  bgColor: '#ffffff',
  titleColor: '#1a1a1a',
  subtitleColor: '#4b5563',
  textColor: '#4b5563',
  starColor: '#f5b301',
  headerStarColor: '#f5a623',
  cardBgColor: '#f9fafb',
  borderColor: '#e5e7eb',
  ctaBgColor: '#1a1a1a',
  ctaTextColor: '#ffffff',

  titleFontSize: 22,
  subtitleFontSize: 16,
  nameFontSize: 16,
  textFontSize: 15,
  starFontSize: 14,
  headerStarFontSize: 28,

  cardRadius: 18,
  cardPadding: 18,
  borderWidth: 1,
  speed: 50,
  ctaBorderRadius: 50,

  campaignTheme: 'none',
};

/* ═══════════════════════════════════════════
   HELPER: Compresión de imagen en navegador
═══════════════════════════════════════════ */
async function compressImageToBase64(file: File, maxSize: number = 600, quality: number = 0.75): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context no disponible'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Error cargando imagen'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error leyendo archivo'));
    reader.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════
   ICONOS AUXILIARES Y BADGES
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

const IconCamera = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconGoogle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const IconMercadoLibre = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: '#FFE600', color: '#2D3277', borderRadius: '50%',
    width: 16, height: 16, fontSize: 9, fontWeight: 900, lineHeight: 1,
  }}>
    ml
  </span>
);

const IconVerified = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES DE FORMULARIO
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
  value, onChange, placeholder, maxLength, type = 'text', min, max, step,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; type?: string; min?: string; max?: string; step?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
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
      <span style={{ fontSize: 14, color: '#000000', fontWeight: 600 }}>
        {label}
      </span>
    </label>
  );
}

function SliderInput({
  value, onChange, min, max, step = 1, unit = 'px',
}: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', boxSizing: 'border-box' }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, minWidth: 0, accentColor: '#10B981', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 13, fontWeight: 700, minWidth: 48, textAlign: 'right', color: '#000000', flexShrink: 0 }}>
        {value}{unit}
      </span>
    </div>
  );
}

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };
  return {
    title: typeof raw.title === 'string' ? raw.title : DEF.title,
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : DEF.subtitle,
    showHeaderStars: typeof raw.showHeaderStars === 'boolean' ? raw.showHeaderStars : DEF.showHeaderStars,
    showCtaButton: typeof raw.showCtaButton === 'boolean' ? raw.showCtaButton : DEF.showCtaButton,
    ctaButtonText: typeof raw.ctaButtonText === 'string' ? raw.ctaButtonText : DEF.ctaButtonText,
    ctaButtonLink: typeof raw.ctaButtonLink === 'string' ? raw.ctaButtonLink : DEF.ctaButtonLink,
    reviews: Array.isArray(raw.reviews) && raw.reviews.length > 0 ? (raw.reviews as ReviewItem[]) : DEFAULT_REVIEWS,

    location: (raw.location as Cfg['location']) || DEF.location,

    bgColor: (raw.bgColor as string) || DEF.bgColor,
    titleColor: (raw.titleColor as string) || DEF.titleColor,
    subtitleColor: (raw.subtitleColor as string) || DEF.subtitleColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    starColor: (raw.starColor as string) || DEF.starColor,
    headerStarColor: (raw.headerStarColor as string) || DEF.headerStarColor,
    cardBgColor: (raw.cardBgColor as string) || DEF.cardBgColor,
    borderColor: (raw.borderColor as string) || DEF.borderColor,
    ctaBgColor: (raw.ctaBgColor as string) || DEF.ctaBgColor,
    ctaTextColor: (raw.ctaTextColor as string) || DEF.ctaTextColor,

    titleFontSize: typeof raw.titleFontSize === 'number' ? raw.titleFontSize : DEF.titleFontSize,
    subtitleFontSize: typeof raw.subtitleFontSize === 'number' ? raw.subtitleFontSize : DEF.subtitleFontSize,
    nameFontSize: typeof raw.nameFontSize === 'number' ? raw.nameFontSize : DEF.nameFontSize,
    textFontSize: typeof raw.textFontSize === 'number' ? raw.textFontSize : DEF.textFontSize,
    starFontSize: typeof raw.starFontSize === 'number' ? raw.starFontSize : DEF.starFontSize,
    headerStarFontSize: typeof raw.headerStarFontSize === 'number' ? raw.headerStarFontSize : DEF.headerStarFontSize,

    cardRadius: typeof raw.cardRadius === 'number' ? raw.cardRadius : DEF.cardRadius,
    cardPadding: typeof raw.cardPadding === 'number' ? raw.cardPadding : DEF.cardPadding,
    borderWidth: typeof raw.borderWidth === 'number' ? raw.borderWidth : DEF.borderWidth,
    speed: typeof raw.speed === 'number' ? raw.speed : DEF.speed,
    ctaBorderRadius: typeof raw.ctaBorderRadius === 'number' ? raw.ctaBorderRadius : DEF.ctaBorderRadius,

    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CarruselResenasEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: CarruselResenasEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'location' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (
    key:
      | 'bgColor'
      | 'titleColor'
      | 'subtitleColor'
      | 'textColor'
      | 'starColor'
      | 'headerStarColor'
      | 'cardBgColor'
      | 'borderColor'
      | 'ctaBgColor'
      | 'ctaTextColor',
    val: string,
  ) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const updateReview = (index: number, field: keyof ReviewItem, value: any) => {
    setCfg((prev) => {
      const updated = [...prev.reviews];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, reviews: updated };
    });
  };

  const addReview = () => {
    if (cfg.reviews.length >= 25) return;
    const newId = String(Date.now());
    const newReview: ReviewItem = {
      id: newId,
      name: 'Cliente Feliz',
      rating: 5,
      text: 'Excelente producto, 100% recomendado.',
      icon: 'verified',
    };
    setCfg((prev) => ({ ...prev, reviews: [...prev.reviews, newReview] }));
  };

  const removeReview = (index: number) => {
    if (cfg.reviews.length <= 1) return;
    setCfg((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoSelect = async (index: number, file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErr('La imagen es demasiado grande. Máximo 10MB.');
      return;
    }
    setUploadingIdx(index);
    setErr('');
    try {
      const base64 = await compressImageToBase64(file, 600, 0.75);
      updateReview(index, 'photo', base64);
    } catch (e) {
      setErr('No se pudo procesar la imagen. Intentá con otra.');
    } finally {
      setUploadingIdx(null);
    }
  };

  const triggerFileInput = (index: number) => {
    const input = fileInputRefs.current[index];
    if (input) input.click();
  };

  const removePhoto = (index: number) => {
    updateReview(index, 'photo', '');
  };

  const applyCampaignPreset = (slug: string) => {
    const CAMPAIGN_DATA: Record<string, { bg: string; tx: string; sub: string; card: string; border: string; accent: string; ctaBg: string; ctaTx: string }> = {
      'black-friday': { bg: '#111827', tx: '#ffffff', sub: '#d1d5db', card: '#1f2937', border: '#374151', accent: '#F59E0B', ctaBg: '#F59E0B', ctaTx: '#111827' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', sub: '#cbd5e1', card: '#1e293b', border: '#334155', accent: '#EF4444', ctaBg: '#EF4444', ctaTx: '#ffffff' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', sub: '#94a3b8', card: '#111827', border: '#1e293b', accent: '#3B82F6', ctaBg: '#3B82F6', ctaTx: '#ffffff' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', sub: '#a7f3d0', card: '#047857', border: '#059669', accent: '#EF4444', ctaBg: '#EF4444', ctaTx: '#ffffff' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', sub: '#fbcfe8', card: '#9d174d', border: '#be185d', accent: '#F43F5E', ctaBg: '#F43F5E', ctaTx: '#ffffff' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', sub: '#c7d2fe', card: '#3730a3', border: '#4338ca', accent: '#10B981', ctaBg: '#10B981', ctaTx: '#ffffff' },
      'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', sub: '#fecaca', card: '#991b1b', border: '#b91c1c', accent: '#FBBF24', ctaBg: '#FBBF24', ctaTx: '#7F1D1D' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        titleColor: DEF.titleColor,
        subtitleColor: DEF.subtitleColor,
        textColor: DEF.textColor,
        starColor: DEF.starColor,
        headerStarColor: DEF.headerStarColor,
        cardBgColor: DEF.cardBgColor,
        borderColor: DEF.borderColor,
        ctaBgColor: DEF.ctaBgColor,
        ctaTextColor: DEF.ctaTextColor,
      }));
    } else if (CAMPAIGN_DATA[slug]) {
      const p = CAMPAIGN_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        titleColor: p.tx,
        subtitleColor: p.sub,
        textColor: p.sub,
        starColor: p.accent,
        headerStarColor: p.accent,
        cardBgColor: p.card,
        borderColor: p.border,
        ctaBgColor: p.ctaBg,
        ctaTextColor: p.ctaTx,
      }));
    }
  };

  const save = async () => {
    setSaving(true);
    setOk(false);
    setErr('');
    try {
      const body = {
        id: ew?.id ?? null,
        store_id: storeId,
        widget_slug: wd.slug,
        config: {
          ...cfg,
          ...(categoryId ? { category_id: String(categoryId) } : {}),
        },
        target_type: targetType,
        target_product_id: productId,
        target_category_id: categoryId ? String(categoryId) : null,
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
    { id: 'none', label: 'Diseño Limpio / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Negro mate con resaltado dorado.' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Azul nocturno con acentos rojos.' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Cian cibernético de alta tecnología.' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con detalles festivos.' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa romántico intenso.' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con verde esmeralda.' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí con amarillo sale.' },
  ];

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
        ) : isCategory ? (
          <div style={{
            background: '#FEF3C7', color: '#D97706',
            border: '1px solid #FCD34D',
            borderRadius: 999, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <span>🏷️ Widget para Categoría</span>
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
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>

          {/* PREVIEW EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VISTA PREVIA EN VIVO
            </div>

            <div style={{
              background: cfg.bgColor,
              borderRadius: 16,
              padding: 20,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxSizing: 'border-box',
              width: '100%',
              overflow: 'hidden',
            }}>
              {cfg.showHeaderStars && (
                <div style={{ fontSize: cfg.headerStarFontSize, color: cfg.headerStarColor, marginBottom: 6, lineHeight: 1 }}>
                  ★★★★★
                </div>
              )}

              {cfg.title && (
                <h3 style={{ fontSize: cfg.titleFontSize, fontWeight: 800, color: cfg.titleColor, margin: '0 0 4px 0', lineHeight: 1.3 }}>
                  {cfg.title}
                </h3>
              )}
              {cfg.subtitle && (
                <p style={{ fontSize: cfg.subtitleFontSize, color: cfg.subtitleColor, margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  {cfg.subtitle}
                </p>
              )}

              <div style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                width: '100%',
                paddingBottom: 8,
                boxSizing: 'border-box',
              }}>
                {cfg.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      background: cfg.cardBgColor,
                      border: `${cfg.borderWidth}px solid ${cfg.borderColor}`,
                      borderRadius: cfg.cardRadius,
                      padding: cfg.cardPadding,
                      minWidth: 240,
                      maxWidth: 280,
                      flexShrink: 0,
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: cfg.nameFontSize, fontWeight: 800, color: cfg.titleColor }}>
                        {rev.name}
                      </span>
                      {rev.icon === 'google' && <IconGoogle />}
                      {rev.icon === 'mercadolibre' && <IconMercadoLibre />}
                      {rev.icon === 'verified' && <IconVerified />}
                    </div>

                    <div style={{ fontSize: cfg.starFontSize, color: cfg.starColor, lineHeight: 1 }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>

                    {rev.photo && (
                      <img
                        src={rev.photo}
                        alt="Foto reseña"
                        style={{
                          width: '100%',
                          maxHeight: 120,
                          objectFit: 'cover',
                          borderRadius: Math.max(4, cfg.cardRadius - 4),
                        }}
                      />
                    )}

                    <p style={{ fontSize: cfg.textFontSize, color: cfg.textColor, margin: 0, lineHeight: 1.4 }}>
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>

              {cfg.showCtaButton && (
                <div style={{ marginTop: 18 }}>
                  <a
                    href={cfg.ctaButtonLink || '#'}
                    onClick={(e) => e.preventDefault()}
                    style={{
                      display: 'inline-block',
                      background: cfg.ctaBgColor,
                      color: cfg.ctaTextColor,
                      borderRadius: cfg.ctaBorderRadius,
                      padding: '10px 24px',
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    {cfg.ctaButtonText || 'Ver más opiniones'}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0',
            borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000000', lineHeight: 1.5 }}>
              Muestra un carrusel dinámico de opiniones de tus compradores directamente en las fichas de producto para impulsar tus conversiones.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', '📝 General & Reseñas'],
                ['location', '📍 Ubicación'],
                ['style', '🎨 Estilos'],
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>
                  📌 ENCABEZADO Y BOTÓN CTA
                </div>

                <div>
                  <FieldLabel>Título principal</FieldLabel>
                  <TextInput
                    value={cfg.title}
                    onChange={(v) => set('title', v)}
                    placeholder="Lo que dicen nuestros clientes"
                  />
                </div>

                <div>
                  <FieldLabel>Subtítulo opcional</FieldLabel>
                  <TextInput
                    value={cfg.subtitle}
                    onChange={(v) => set('subtitle', v)}
                    placeholder="Reseñas verificadas por clientes reales."
                  />
                </div>

                <ToggleField
                  checked={cfg.showHeaderStars}
                  onChange={(v) => set('showHeaderStars', v)}
                  label="Mostrar estrellas decorativas en el encabezado"
                />

                <ToggleField
                  checked={cfg.showCtaButton}
                  onChange={(v) => set('showCtaButton', v)}
                  label="Mostrar botón al final del carrusel"
                />

                {cfg.showCtaButton && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                    <div>
                      <FieldLabel>Texto del Botón</FieldLabel>
                      <TextInput
                        value={cfg.ctaButtonText}
                        onChange={(v) => set('ctaButtonText', v)}
                        placeholder="Ver más opiniones"
                      />
                    </div>
                    <div>
                      <FieldLabel>Enlace del Botón (Link)</FieldLabel>
                      <TextInput
                        value={cfg.ctaButtonLink}
                        onChange={(v) => set('ctaButtonLink', v)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <FieldLabel>Lista de Reseñas ({cfg.reviews.length}/25)</FieldLabel>
                  {cfg.reviews.length < 25 && (
                    <button
                      type="button"
                      onClick={addReview}
                      style={{
                        background: '#ecfdf5', color: '#10B981', border: '1px solid #10B981',
                        borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                      }}
                    >
                      + Agregar otra reseña
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cfg.reviews.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      style={{
                        background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14,
                        display: 'flex', flexDirection: 'column', gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>
                          Reseña #{idx + 1}
                        </span>
                        {cfg.reviews.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReview(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                        <div>
                          <FieldLabel>Nombre</FieldLabel>
                          <TextInput
                            value={rev.name}
                            onChange={(v) => updateReview(idx, 'name', v)}
                            placeholder="Nombre del cliente"
                          />
                        </div>
                        <div>
                          <FieldLabel>Puntaje</FieldLabel>
                          <select
                            value={rev.rating}
                            onChange={(e) => updateReview(idx, 'rating', parseInt(e.target.value, 10))}
                            style={{
                              width: '100%', padding: '12px 10px', fontSize: 14, fontWeight: 700,
                              border: '1.5px solid #e5e7eb', borderRadius: 10,
                              background: '#ffffff', color: '#000000', outline: 'none',
                            }}
                          >
                            <option value={5}>★★★★★ (5)</option>
                            <option value={4}>★★★★☆ (4)</option>
                            <option value={3}>★★★☆☆ (3)</option>
                            <option value={2}>★★☆☆☆ (2)</option>
                            <option value={1}>★☆☆☆☆ (1)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <FieldLabel>Texto de la reseña</FieldLabel>
                        <TextInput
                          value={rev.text}
                          onChange={(v) => updateReview(idx, 'text', v)}
                          placeholder="Escribí el testimonio del comprador..."
                        />
                      </div>

                      <div>
                        <FieldLabel>Icono / Sello de origen</FieldLabel>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {[
                            { id: 'none', label: 'Sin icono' },
                            { id: 'google', label: 'Google' },
                            { id: 'mercadolibre', label: 'Mercado Libre' },
                            { id: 'verified', label: 'Verificado' },
                          ].map((ic) => {
                            const act = rev.icon === ic.id;
                            return (
                              <button
                                key={ic.id}
                                type="button"
                                onClick={() => updateReview(idx, 'icon', ic.id as ReviewIconType)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  border: act ? '2px solid #10B981' : '1px solid #e5e7eb',
                                  background: act ? '#ecfdf5' : '#ffffff',
                                  color: act ? '#059669' : '#000000',
                                  cursor: 'pointer',
                                }}
                              >
                                {ic.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{
                        background: '#f9fafb', border: '1.5px dashed #d1d5db', borderRadius: 10,
                        padding: 12, display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <input
                          ref={(el) => { fileInputRefs.current[idx] = el; }}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                            handlePhotoSelect(idx, f);
                            e.target.value = '';
                          }}
                        />

                        {rev.photo ? (
                          <>
                            <img
                              src={rev.photo}
                              alt="Foto reseña"
                              style={{
                                width: 54, height: 54, objectFit: 'cover', borderRadius: 8,
                                flexShrink: 0, border: '1px solid #e5e7eb',
                              }}
                            />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>
                                ✓ Foto cargada
                              </span>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  type="button"
                                  onClick={() => triggerFileInput(idx)}
                                  disabled={uploadingIdx === idx}
                                  style={{
                                    background: '#ffffff', color: '#059669', border: '1px solid #10B981',
                                    borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Cambiar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removePhoto(idx)}
                                  style={{
                                    background: '#ffffff', color: '#ef4444', border: '1px solid #ef4444',
                                    borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{
                              width: 54, height: 54, borderRadius: 8, background: '#ecfdf5',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#10B981', flexShrink: 0,
                            }}>
                              <IconCamera />
                            </div>
                            <div style={{ flex: 1 }}>
                              <button
                                type="button"
                                onClick={() => triggerFileInput(idx)}
                                disabled={uploadingIdx === idx}
                                style={{
                                  background: '#10B981', color: '#ffffff', border: 'none',
                                  borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 800,
                                  cursor: uploadingIdx === idx ? 'wait' : 'pointer',
                                  display: 'inline-flex', alignItems: 'center', gap: 6,
                                }}
                              >
                                {uploadingIdx === idx ? 'Procesando...' : '📸 Subir Foto'}
                              </button>
                              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                                JPG, PNG, GIF o WebP. Máx 5MB (se comprime automático).
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Posición en la ficha del producto</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 8 }}>
                  {[
                    {
                      id: 'product_after',
                      title: '⬇️ Después de la descripción (DEFAULT)',
                      desc: 'Muestra el carrusel a todo lo ancho de la página, después de la sección del producto.',
                    },
                    {
                      id: 'product_before',
                      title: '⬆️ Antes de la descripción',
                      desc: 'Ubica el carrusel debajo del botón de compra dentro de la columna del producto.',
                    },
                  ].map((loc) => {
                    const active = cfg.location === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => set('location', loc.id as any)}
                        style={{
                          padding: '16px', borderRadius: 12,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 800 }}>{loc.title}</div>
                        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4, lineHeight: 1.4 }}>{loc.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB ESTILOS */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#000000', marginBottom: 14 }}>
                  🎨 COLORES
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                  <div>
                    <FieldLabel>Fondo General</FieldLabel>
                    <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color Título</FieldLabel>
                    <ColorPickerField value={cfg.titleColor} onChange={(v) => setCustomColor('titleColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color Subtítulo</FieldLabel>
                    <ColorPickerField value={cfg.subtitleColor} onChange={(v) => setCustomColor('subtitleColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color Texto</FieldLabel>
                    <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Estrellas Reseñas</FieldLabel>
                    <ColorPickerField value={cfg.starColor} onChange={(v) => setCustomColor('starColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Estrellas Encabezado</FieldLabel>
                    <ColorPickerField value={cfg.headerStarColor} onChange={(v) => setCustomColor('headerStarColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Fondo de Tarjeta</FieldLabel>
                    <ColorPickerField value={cfg.cardBgColor} onChange={(v) => setCustomColor('cardBgColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color de Borde</FieldLabel>
                    <ColorPickerField value={cfg.borderColor} onChange={(v) => setCustomColor('borderColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Fondo Botón CTA</FieldLabel>
                    <ColorPickerField value={cfg.ctaBgColor} onChange={(v) => setCustomColor('ctaBgColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Texto Botón CTA</FieldLabel>
                    <ColorPickerField value={cfg.ctaTextColor} onChange={(v) => setCustomColor('ctaTextColor', v)} />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#000000', marginBottom: 14 }}>
                  🔤 TAMAÑOS DE TIPOGRAFÍA (PX)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                  <div>
                    <FieldLabel>Título ({cfg.titleFontSize}px)</FieldLabel>
                    <SliderInput min={14} max={36} value={cfg.titleFontSize} onChange={(v) => set('titleFontSize', v)} />
                  </div>
                  <div>
                    <FieldLabel>Subtítulo ({cfg.subtitleFontSize}px)</FieldLabel>
                    <SliderInput min={12} max={24} value={cfg.subtitleFontSize} onChange={(v) => set('subtitleFontSize', v)} />
                  </div>
                  <div>
                    <FieldLabel>Nombre ({cfg.nameFontSize}px)</FieldLabel>
                    <SliderInput min={12} max={22} value={cfg.nameFontSize} onChange={(v) => set('nameFontSize', v)} />
                  </div>
                  <div>
                    <FieldLabel>Texto Reseña ({cfg.textFontSize}px)</FieldLabel>
                    <SliderInput min={11} max={20} value={cfg.textFontSize} onChange={(v) => set('textFontSize', v)} />
                  </div>
                  <div>
                    <FieldLabel>Estrellas Reseña ({cfg.starFontSize}px)</FieldLabel>
                    <SliderInput min={10} max={24} value={cfg.starFontSize} onChange={(v) => set('starFontSize', v)} />
                  </div>
                  <div>
                    <FieldLabel>Estrellas Encabezado ({cfg.headerStarFontSize}px)</FieldLabel>
                    <SliderInput min={16} max={48} value={cfg.headerStarFontSize} onChange={(v) => set('headerStarFontSize', v)} />
                  </div>
                </div>
              </div>

              {/* DISEÑO Y VELOCIDAD — layout corregido */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#000000', marginBottom: 14 }}>
                  ⚙️ DISEÑO Y VELOCIDAD
                </div>

                {/* Fila 1: Radio + Borde */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Radio de Tarjeta ({cfg.cardRadius}px)</FieldLabel>
                    <SliderInput min={0} max={30} value={cfg.cardRadius} onChange={(v) => set('cardRadius', v)} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <FieldLabel>Grosor de Borde ({cfg.borderWidth}px)</FieldLabel>
                    <SliderInput min={0} max={4} value={cfg.borderWidth} onChange={(v) => set('borderWidth', v)} />
                  </div>
                </div>

                {/* Fila 2 centrada: Padding Interno + Velocidad */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  marginBottom: 16,
                  maxWidth: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                  <div style={{
                    minWidth: 0,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: 14,
                    boxSizing: 'border-box',
                  }}>
                    <FieldLabel>Padding Interno ({cfg.cardPadding}px)</FieldLabel>
                    <SliderInput min={8} max={40} value={cfg.cardPadding} onChange={(v) => set('cardPadding', v)} />
                  </div>
                  <div style={{
                    minWidth: 0,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: 14,
                    boxSizing: 'border-box',
                  }}>
                    <FieldLabel>Velocidad Carrusel ({cfg.speed}s)</FieldLabel>
                    <SliderInput min={2} max={250} value={cfg.speed} onChange={(v) => set('speed', v)} unit="s" />
                  </div>
                </div>

                {/* Fila 3: Radio CTA a ancho completo */}
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 14,
                  boxSizing: 'border-box',
                  maxWidth: 420,
                  margin: '0 auto',
                  width: '100%',
                }}>
                  <FieldLabel>Radio Botón CTA ({cfg.ctaBorderRadius}px)</FieldLabel>
                  <SliderInput min={0} max={50} value={cfg.ctaBorderRadius} onChange={(v) => set('ctaBorderRadius', v)} />
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
                  Elegí una campaña activa para vestir el carrusel de reseñas con colores festivos de alto impacto. Se refleja en la tienda al guardar.
                </FieldHelper>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CAMPAIGN_PRESETS.map((preset) => {
                  const isSelected = cfg.campaignTheme === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => applyCampaignPreset(preset.id)}
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

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
   }
