'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  id: string | null;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
  target_category_id?: string | number | null;
}

interface CajaOpinionesEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface OpinionItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  photo?: string;
  verified: boolean;
}

export interface CajaOpinionesConfig {
  opinions: OpinionItem[];
  location: 'product_after' | 'product_before' | 'price_after' | 'cart';
  autoplayEnabled: boolean;
  autoplayInterval: number;
  bgColor: string;
  textColor: string;
  starColor: string;
  showBorder: boolean;
  borderColor: string;
  nameFontSize: number;
  textFontSize: number;
  borderRadius: number;
  padding: number;
  marginTop: number;
  marginBottom: number;
  campaignTheme?: string;
}

const DEFAULT_OPINIONS: OpinionItem[] = [
  {
    id: '1',
    name: '',
    rating: 5,
    text: '',
    photo: '',
    verified: true,
  },
];

const defaultConfig: CajaOpinionesConfig = {
  opinions: DEFAULT_OPINIONS,
  location: 'product_after',
  autoplayEnabled: true,
  autoplayInterval: 5,
  bgColor: '#f7f7f7',
  textColor: '#333333',
  starColor: '#f5b301',
  showBorder: true,
  borderColor: '#cccccc',
  nameFontSize: 16,
  textFontSize: 15,
  borderRadius: 10,
  padding: 20,
  marginTop: 16,
  marginBottom: 16,
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de Estilo.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + acento dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul nocturno + texto rojo.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético + borde azul.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino + texto dorado.', themeColor: '#064E3B', accentColor: '#F59E0B' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Borgoña romántico + rosa.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Índigo premium + verde.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo sale + borde amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, Partial<CajaOpinionesConfig>> = {
  'black-friday': { bgColor: '#111827', textColor: '#ffffff', starColor: '#F59E0B', borderColor: '#F59E0B' },
  'hot-sale': { bgColor: '#0F172A', textColor: '#ffffff', starColor: '#EF4444', borderColor: '#EF4444' },
  'cyber-monday': { bgColor: '#090D16', textColor: '#ffffff', starColor: '#3B82F6', borderColor: '#3B82F6' },
  'navidad': { bgColor: '#064E3B', textColor: '#ffffff', starColor: '#F59E0B', borderColor: '#10B981' },
  'san-valentin': { bgColor: '#831843', textColor: '#ffffff', starColor: '#F43F5E', borderColor: '#F43F5E' },
  'dia-padre-madre': { bgColor: '#312E81', textColor: '#ffffff', starColor: '#10B981', borderColor: '#10B981' },
  'liquidacion': { bgColor: '#7F1D1D', textColor: '#ffffff', starColor: '#FBBF24', borderColor: '#FBBF24' },
};

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

function parseFormattedText(text: string, color: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function CajaOpinionesPreview({ config }: { config: CajaOpinionesConfig }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const opinions = config.opinions && config.opinions.length > 0 ? config.opinions : DEFAULT_OPINIONS;
  const current = opinions[currentIndex] || opinions[0];

  useEffect(() => {
    if (currentIndex >= opinions.length) {
      setCurrentIndex(0);
    }
  }, [opinions.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? opinions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === opinions.length - 1 ? 0 : prev + 1));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? config.starColor : '#d1d5db', fontSize: 14, marginRight: 2 }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const isEmpty = !current || (!current.name && !current.text);

  return (
    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN TU TIENDA
      </div>

      <div style={{
        background: config.bgColor,
        color: config.textColor,
        border: config.showBorder ? `1px solid ${config.borderColor}` : 'none',
        borderRadius: config.borderRadius,
        padding: config.padding,
        marginTop: config.marginTop / 2,
        marginBottom: config.marginBottom / 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {isEmpty ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, padding: '24px 12px', color: config.textColor, opacity: 0.6, fontSize: 15, fontWeight: 500,
          }}>
            <span>Agrega opiniones para ver el preview</span>
            <span style={{ fontSize: 14, letterSpacing: 4 }}>‹ ›</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            {current.photo ? (
              <img
                src={current.photo}
                alt={current.name}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: '#e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#374151', flexShrink: 0,
              }}>
                {current.name ? current.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: config.nameFontSize, fontWeight: 700, color: config.textColor }}>
                    {current.name || 'Cliente'}
                  </span>
                  {renderStars(current.rating || 5)}
                </div>

                {opinions.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <button
                      type="button"
                      onClick={handlePrev}
                      style={{ background: 'none', border: 'none', color: config.textColor, opacity: 0.6, fontSize: 14, cursor: 'pointer', padding: '0 4px' }}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      style={{ background: 'none', border: 'none', color: config.textColor, opacity: 0.6, fontSize: 14, cursor: 'pointer', padding: '0 4px' }}
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              <div style={{ fontSize: config.textFontSize, color: config.textColor, marginTop: 8, lineHeight: 1.5 }}>
                {parseFormattedText(current.text, config.textColor)}
              </div>

              {current.verified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 12, fontWeight: 600, color: '#10B981' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Compra verificada</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CajaOpinionesEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: CajaOpinionesEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CajaOpinionesConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update<K extends keyof CajaOpinionesConfig>(key: K, value: CajaOpinionesConfig[K]) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['bgColor', 'textColor', 'starColor', 'borderColor'].indexOf(String(key)) !== -1) {
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
        starColor: defaultConfig.starColor,
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

  function updateOpinion<K extends keyof OpinionItem>(index: number, key: K, value: OpinionItem[K]) {
    setConfig((prev) => {
      const next = [...prev.opinions];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, opinions: next };
    });
  }

  function addOpinion() {
    if (config.opinions.length >= 5) return;
    const newOp: OpinionItem = {
      id: String(Date.now()),
      name: '',
      rating: 5,
      text: '',
      photo: '',
      verified: true,
    };
    setConfig((prev) => ({ ...prev, opinions: [...prev.opinions, newOp] }));
  }

  function removeOpinion(index: number) {
    if (config.opinions.length <= 1) return;
    setConfig((prev) => ({
      ...prev,
      opinions: prev.opinions.filter((_, i) => i !== index),
    }));
  }

  async function handlePhotoSelect(index: number, file: File | null) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    setUploadingIdx(index);
    setError(null);
    try {
      const base64 = await compressImageToBase64(file, 600, 0.75);
      updateOpinion(index, 'photo', base64);
    } catch {
      setError('Error al procesar la imagen.');
    } finally {
      setUploadingIdx(null);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <FieldLabel>Opiniones (mínimo 1, máximo 5)</FieldLabel>
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{config.opinions.length} de 5</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {config.opinions.map((op, idx) => (
            <div
              key={op.id || idx}
              style={{
                background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 16,
                display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
                  Opinión {idx + 1}
                </span>
                {config.opinions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOpinion(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>

              <div>
                <FieldLabel>Nombre</FieldLabel>
                <TextInput
                  value={op.name}
                  onChange={(v) => updateOpinion(idx, 'name', v)}
                  placeholder="Ej: Juan P."
                  maxLength={50}
                />
              </div>

              <div>
                <FieldLabel>Estrellas</FieldLabel>
                <SelectField
                  value={String(op.rating)}
                  onChange={(v) => updateOpinion(idx, 'rating', Number(v))}
                  options={[
                    { value: '5', label: '★★★★★ (5 estrellas)' },
                    { value: '4', label: '★★★★☆ (4 estrellas)' },
                    { value: '3', label: '★★★☆☆ (3 estrellas)' },
                    { value: '2', label: '★★☆☆☆ (2 estrellas)' },
                    { value: '1', label: '★☆☆☆☆ (1 estrella)' },
                  ]}
                />
              </div>

              <div>
                <FieldLabel>Opinión</FieldLabel>
                <TextAreaInput
                  value={op.text}
                  onChange={(v) => updateOpinion(idx, 'text', v)}
                  placeholder="Escribe la opinión del cliente..."
                  rows={3}
                />
                <FieldHelper>Usá **texto** para mostrar texto en negrita.</FieldHelper>
              </div>

              <div>
                <FieldLabel>Foto (opcional)</FieldLabel>
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

                {op.photo ? (
                  <div style={{
                    border: '2.5px dashed #10B981', borderRadius: 12, padding: 20,
                    textAlign: 'center', background: '#f0fdf4', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', gap: 10,
                  }}>
                    <img
                      src={op.photo}
                      alt="Uploaded preview"
                      style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                      Imagen subida correctamente
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        style={{
                          padding: '8px 16px', borderRadius: 999, border: '1.5px solid #f87171',
                          background: '#fff', color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Cambiar imagen
                      </button>
                      <button
                        type="button"
                        onClick={() => updateOpinion(idx, 'photo', '')}
                        style={{
                          padding: '8px 16px', borderRadius: 999, border: '1px solid #d1d5db',
                          background: '#fff', color: '#6b7280', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    style={{
                      border: '2px dashed #d1d5db', borderRadius: 12, padding: 24,
                      textAlign: 'center', background: '#fafafa', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>
                      {uploadingIdx === idx ? 'Procesando...' : 'Haz clic o arrastra una imagen aquí'}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>JPG, PNG, GIF - Máximo 2MB</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id={`verified-${idx}`}
                  checked={op.verified}
                  onChange={(e) => updateOpinion(idx, 'verified', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#10B981', cursor: 'pointer' }}
                />
                <label htmlFor={`verified-${idx}`} style={{ fontSize: 14, fontWeight: 600, color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#10B981" stroke="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Compra verificada
                </label>
              </div>
            </div>
          ))}
        </div>

        {config.opinions.length < 5 && (
          <button
            type="button"
            onClick={addOpinion}
            style={{
              marginTop: 16, width: '100%', padding: '12px', borderRadius: 999,
              border: '1.5px solid #10B981', background: '#ecfdf5', color: '#10B981',
              fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            + Agregar otra opinión
          </button>
        )}
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
          🎠 Reproducción Automática (Autoplay)
        </div>
        <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ToggleField
            checked={config.autoplayEnabled}
            onChange={(v) => update('autoplayEnabled', v)}
            label="Pasar opiniones automáticamente"
          />

          {config.autoplayEnabled && (
            <div>
              <FieldLabel>Tiempo entre opiniones</FieldLabel>
              <SelectField
                value={String(config.autoplayInterval)}
                onChange={(v) => update('autoplayInterval', Number(v))}
                options={[
                  { value: '3', label: 'Cada 3 segundos' },
                  { value: '5', label: 'Cada 5 segundos (Recomendado)' },
                  { value: '7', label: 'Cada 7 segundos' },
                  { value: '10', label: 'Cada 10 segundos' },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FieldLabel>¿Dónde mostrar la caja de opiniones en tu tienda?</FieldLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { id: 'product_after', label: '⬇️ Abajo del botón "Agregar al carrito"', helper: 'Recomendado. Aparece justo debajo del botón principal de compra.' },
          { id: 'product_before', label: '⬆️ Arriba del botón "Agregar al carrito"', helper: 'Muestra las reseñas inmediatamente antes del botón.' },
          { id: 'price_after', label: '💲 Abajo del precio del producto', helper: 'Aparece justo debajo del precio principal.' },
          { id: 'cart', label: '🛒 En el carrito de compras', helper: 'Aparece dentro del carrito para dar confianza final.' },
        ].map((item) => {
          const isSelected = config.location === item.id;
          return (
            <div
              key={item.id}
              onClick={() => update('location', item.id as any)}
              style={{
                background: '#fff',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                borderRadius: 12, padding: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: isSelected ? '6px solid #10B981' : '2px solid #d1d5db',
                boxSizing: 'border-box', flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>{item.helper}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const tabEstilo = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>🎨 Colores principales</div>
        <FieldHelper>Personalizá los colores de fondo, texto, estrellas y borde de la caja.</FieldHelper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          <div>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
          </div>

          <div>
            <FieldLabel>Color del texto</FieldLabel>
            <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
          </div>

          <div>
            <FieldLabel>Color de estrellas</FieldLabel>
            <ColorPickerField value={config.starColor} onChange={(v) => update('starColor', v)} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <FieldLabel>Borde</FieldLabel>
              <ToggleField checked={config.showBorder} onChange={(v) => update('showBorder', v)} label="" />
            </div>
            {config.showBorder && (
              <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
            )}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>🔤 Tipografías</div>
        <FieldHelper>Ajustá el tamaño de fuente del nombre y de la opinión.</FieldHelper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          <div>
            <FieldLabel>Tamaño de fuente del nombre</FieldLabel>
            <SelectField
              value={String(config.nameFontSize)}
              onChange={(v) => update('nameFontSize', Number(v))}
              options={[
                { value: '14', label: '14px' },
                { value: '16', label: '16px (Normal)' },
                { value: '18', label: '18px (Grande)' },
              ]}
            />
          </div>

          <div>
            <FieldLabel>Tamaño de fuente de opinión</FieldLabel>
            <SelectField
              value={String(config.textFontSize)}
              onChange={(v) => update('textFontSize', Number(v))}
              options={[
                { value: '13', label: '13px' },
                { value: '14', label: '14px' },
                { value: '15', label: '15px (Normal)' },
                { value: '16', label: '16px (Grande)' },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>⚙️ Diseño</div>
        <FieldHelper>Configurá el borde redondeado y los márgenes de la caja.</FieldHelper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          <div>
            <FieldLabel>Borde redondeado de la caja: {config.borderRadius}px</FieldLabel>
            <input
              type="range" min={0} max={25} value={config.borderRadius}
              onChange={(e) => update('borderRadius', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Margen interno (padding): {config.padding}px</FieldLabel>
            <input
              type="range" min={0} max={40} value={config.padding}
              onChange={(e) => update('padding', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Margen superior externo: {config.marginTop}px</FieldLabel>
            <input
              type="range" min={0} max={100} value={config.marginTop}
              onChange={(e) => update('marginTop', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Margen inferior externo: {config.marginBottom}px</FieldLabel>
            <input
              type="range" min={0} max={100} value={config.marginBottom}
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
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto a la caja de opiniones.</FieldHelper>
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
            <CajaOpinionesPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Las opiniones aparecerán justo por debajo del botón de &quot;Agregar al carrito&quot;.
            </span>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, overflowX: 'auto' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'ubicacion', label: 'Ubicación' },
              { id: 'estilo', label: 'Estilo' },
              { id: 'fechas', label: '🔥 Fechas' },
            ].map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 20px', background: 'none', border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000', opacity: act ? 1 : 0.6,
                    fontSize: 14, fontWeight: act ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
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
            {activeTab === 'estilo' ? tabEstilo : null}
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
