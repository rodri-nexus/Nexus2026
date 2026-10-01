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
}

interface ResenasDestacadasEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

interface ReviewItem {
  id: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  verified: boolean;
  photo?: string;
}

interface Cfg {
  averageRating: number;
  totalReviews: number;
  showVerifiedBadge: boolean;
  layout: 'list' | 'carousel' | 'compact' | 'sidebar';
  location: 'title_after' | 'price_after' | 'product_before' | 'product_after';
  bgColor: string;
  textColor: string;
  cardBgColor: string;
  accentColor: string;
  campaignTheme: string;
  reviews: ReviewItem[];
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEFAULT_REVIEWS: ReviewItem[] = [
  { id: '1', name: 'Luna R.', initials: 'LR', rating: 5, text: 'Muy buena calidad. El material es excelente y se nota que está bien hecho.', verified: true },
  { id: '2', name: 'Mica P.', initials: 'MP', rating: 5, text: 'Llegó rapidísimo, mejor de lo esperado. Todo perfecto.', verified: true },
  { id: '3', name: 'Nora S.', initials: 'NS', rating: 5, text: 'Se ve tal cual en las fotos, muy lindo y práctico.', verified: true },
];

const DEF: Cfg = {
  averageRating: 4.8,
  totalReviews: 36,
  showVerifiedBadge: true,
  layout: 'list',
  location: 'product_after',
  bgColor: '#ffffff',
  textColor: '#111827',
  cardBgColor: '#f9fafb',
  accentColor: '#10B981',
  campaignTheme: 'none',
  reviews: DEFAULT_REVIEWS,
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
   ICONOS AUXILIARES
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

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES DE FORMULARIO (Regla #9)
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

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };
  return {
    averageRating: typeof raw.averageRating === 'number' ? raw.averageRating : DEF.averageRating,
    totalReviews: typeof raw.totalReviews === 'number' ? raw.totalReviews : DEF.totalReviews,
    showVerifiedBadge: typeof raw.showVerifiedBadge === 'boolean' ? raw.showVerifiedBadge : DEF.showVerifiedBadge,
    layout: (raw.layout as Cfg['layout']) || DEF.layout,
    location: (raw.location as Cfg['location']) || DEF.location,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    cardBgColor: (raw.cardBgColor as string) || DEF.cardBgColor,
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    campaignTheme: (raw.campaignTheme as string) || 'none',
    reviews: Array.isArray(raw.reviews) && raw.reviews.length > 0 ? (raw.reviews as ReviewItem[]) : DEFAULT_REVIEWS,
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function ResenasDestacadasEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: ResenasDestacadasEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (key: 'bgColor' | 'textColor' | 'cardBgColor' | 'accentColor', val: string) => {
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
      if (field === 'name' && typeof value === 'string') {
        const parts = value.trim().split(' ');
        if (parts.length >= 2) {
          updated[index].initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length === 1 && parts[0].length > 0) {
          updated[index].initials = parts[0].slice(0, 2).toUpperCase();
        }
      }
      return { ...prev, reviews: updated };
    });
  };

  const addReview = () => {
    if (cfg.reviews.length >= 8) return;
    const newId = String(Date.now());
    const newReview: ReviewItem = {
      id: newId,
      name: 'Cliente Feliz',
      initials: 'CF',
      rating: 5,
      text: 'Excelente producto, 100% recomendado.',
      verified: true,
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
    const CAMPAIGN_DATA: Record<string, { bg: string; tx: string; card: string; accent: string }> = {
      'black-friday': { bg: '#111827', tx: '#ffffff', card: '#1f2937', accent: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', card: '#1e293b', accent: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', card: '#111827', accent: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', card: '#047857', accent: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', card: '#9d174d', accent: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', card: '#3730a3', accent: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', card: '#991b1b', accent: '#FBBF24' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        textColor: DEF.textColor,
        cardBgColor: DEF.cardBgColor,
        accentColor: DEF.accentColor,
      }));
    } else if (CAMPAIGN_DATA[slug]) {
      const p = CAMPAIGN_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
        cardBgColor: p.card,
        accentColor: p.accent,
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

            <div
              style={{
                background: cfg.bgColor,
                borderRadius: 16,
                padding: 18,
                color: cfg.textColor,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {/* ENCABEZADO DE PREVIEW */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: cfg.layout === 'compact' ? 'none' : '1px solid rgba(0,0,0,0.08)', paddingBottom: cfg.layout === 'compact' ? 0 : 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>⭐⭐⭐⭐⭐</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: cfg.textColor }}>
                    {cfg.averageRating}
                  </span>
                  <span style={{ fontSize: 13, color: cfg.textColor, opacity: 0.6 }}>
                    ({cfg.totalReviews} reseñas)
                  </span>
                </div>

                {cfg.showVerifiedBadge && (
                  <span style={{
                    background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0',
                    borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 800,
                  }}>
                    ✓ Verificadas
                  </span>
                )}
              </div>

              {/* MUESTRA DE CARDS SEGÚN LAYOUT */}
              {cfg.layout !== 'compact' && (
                <div style={{
                  display: 'flex',
                  flexDirection: cfg.layout === 'carousel' ? 'row' : 'column',
                  gap: 10,
                  overflowX: cfg.layout === 'carousel' ? 'auto' : 'visible',
                  paddingBottom: cfg.layout === 'carousel' ? 6 : 0,
                }}>
                  {cfg.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        background: cfg.cardBgColor,
                        borderRadius: 12,
                        padding: 12,
                        border: '1px solid rgba(0,0,0,0.06)',
                        minWidth: cfg.layout === 'carousel' ? '220px' : 'auto',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: cfg.accentColor, color: '#ffffff',
                            fontSize: 10, fontWeight: 900, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                            {rev.initials || 'U'}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: cfg.textColor }}>
                            {rev.name}
                          </span>
                        </div>
                        <span style={{ fontSize: 11 }}>{'⭐'.repeat(rev.rating)}</span>
                      </div>

                      {rev.photo && (
                        <div style={{ marginTop: 4, marginBottom: 2 }}>
                          <img
                            src={rev.photo}
                            alt="Foto de reseña"
                            style={{
                              width: '100%',
                              maxHeight: 140,
                              objectFit: 'cover',
                              borderRadius: 8,
                              display: 'block',
                            }}
                          />
                        </div>
                      )}

                      <p style={{ fontSize: 12, color: cfg.textColor, opacity: 0.85, margin: 0, lineHeight: 1.4 }}>
                        {rev.text}
                      </p>

                      {rev.verified && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          ✓ Compra verificada
                        </span>
                      )}
                    </div>
                  ))}
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
              Aumentá la confianza de compra inmediatamente mostrando opiniones reales con fotos de tus clientes en la ficha de producto.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', '⭐ Calificaciones & Reseñas'],
                ['style', 'Diseño & Ubicación'],
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

          {/* TAB CALIFICACIONES & RESEÑAS */}
          {tab === 'gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* RESUMEN GLOBAL */}
              <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#000000', marginBottom: 12 }}>
                  📊 PUNTUACIÓN GLOBAL
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                  <div>
                    <FieldLabel>Rating promedio (1.0 a 5.0)</FieldLabel>
                    <TextInput
                      type="number"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={String(cfg.averageRating)}
                      onChange={(v) => set('averageRating', parseFloat(v) || 5.0)}
                      placeholder="4.8"
                    />
                  </div>
                  <div>
                    <FieldLabel>Cantidad total de reseñas</FieldLabel>
                    <TextInput
                      type="number"
                      min="1"
                      value={String(cfg.totalReviews)}
                      onChange={(v) => set('totalReviews', parseInt(v, 10) || 1)}
                      placeholder="36"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <ToggleField
                    checked={cfg.showVerifiedBadge}
                    onChange={(v) => set('showVerifiedBadge', v)}
                    label='Mostrar sello de "✓ Compras Verificadas"'
                  />
                </div>
              </div>

              {/* LISTA DE RESEÑAS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <FieldLabel>Opiniones destacadas ({cfg.reviews.length}/8)</FieldLabel>
                  {cfg.reviews.length < 8 && (
                    <button
                      type="button"
                      onClick={addReview}
                      style={{
                        background: '#ecfdf5', color: '#10B981', border: '1px solid #10B981',
                        borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                      }}
                    >
                      + Agregar Reseña
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {cfg.reviews.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      style={{
                        background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14,
                        display: 'flex', flexDirection: 'column', gap: 10,
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
                        <TextInput
                          value={rev.name}
                          onChange={(v) => updateReview(idx, 'name', v)}
                          placeholder="Nombre del cliente"
                        />
                        <select
                          value={rev.rating}
                          onChange={(e) => updateReview(idx, 'rating', parseInt(e.target.value, 10))}
                          style={{
                            padding: '12px 10px', fontSize: 14, fontWeight: 700,
                            border: '1.5px solid #e5e7eb', borderRadius: 10,
                            background: '#ffffff', color: '#000000', outline: 'none',
                          }}
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                          <option value={3}>⭐⭐⭐ (3/5)</option>
                        </select>
                      </div>

                      <TextInput
                        value={rev.text}
                        onChange={(v) => updateReview(idx, 'text', v)}
                        placeholder="Comentario de la reseña..."
                      />

                      {/* CARGA DE FOTO */}
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
                              alt="Preview"
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
                                JPG, PNG o WebP. Máx 10MB (se comprime automático).
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

          {/* TAB DISEÑO & UBICACIÓN */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* SELECTOR DE LAYOUT */}
              <div>
                <FieldLabel>Formato de presentación</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'list', label: '📄 Lista Vertical', desc: 'Tarjetas una debajo de otra.' },
                    { id: 'carousel', label: '🎠 Carrusel Deslizable', desc: 'Fila deslizable lateralmente.' },
                    { id: 'sidebar', label: '📦 Caja "Lo que dicen"', desc: 'Tarjeta agrupada con borde.' },
                    { id: 'compact', label: '⚡ Solo Estrellas (Compacto)', desc: 'Ideal para poner pegado al precio.' },
                  ].map((lay) => {
                    const active = cfg.layout === lay.id;
                    return (
                      <button
                        key={lay.id}
                        type="button"
                        onClick={() => set('layout', lay.id as any)}
                        style={{
                          padding: '12px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{lay.label}</div>
                        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>{lay.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLORES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Fondo Principal</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Texto</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                </div>
                <div>
                  <FieldLabel>Fondo de Tarjetas</FieldLabel>
                  <ColorPickerField value={cfg.cardBgColor} onChange={(v) => setCustomColor('cardBgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Acento / Avatar</FieldLabel>
                  <ColorPickerField value={cfg.accentColor} onChange={(v) => setCustomColor('accentColor', v)} />
                </div>
              </div>

              {/* UBICACIÓN */}
              <div>
                <FieldLabel>¿Dónde mostrarlo en la Ficha de Producto?</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'title_after', label: '⬆️ Abajo del Título del Producto' },
                    { id: 'price_after', label: '⬇️ Abajo del Precio' },
                    { id: 'product_before', label: '⬆️ Arriba del Botón de Compra' },
                    { id: 'product_after', label: '⬇️ Abajo del Botón de Compra' },
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
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center', lineHeight: 1.3,
                        }}
                      >
                        {loc.label}
                      </button>
                    );
                  })}
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
                  Elegí una campaña activa para vestir las reseñas con colores festivos de alto impacto.
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

        {/* CENTRO DE AYUDA OFICIAL */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
         }
