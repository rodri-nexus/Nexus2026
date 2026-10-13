'use client';

import React, { useState, useRef } from 'react';
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

interface CajaContactoEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface CajaContactoConfig {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
  image?: string;
  location: 'product_after' | 'description_after' | 'cart';
  bgColor: string;
  textColor: string;
  buttonBg: string;
  buttonTextColor: string;
  borderColor: string;
  sectionBg: string;
  showBorder: boolean;
  titleFontSize: number;
  textFontSize: number;
  borderRadius: number;
  padding: number;
  buttonBorderRadius: number;
  campaignTheme?: string;
}

const defaultConfig: CajaContactoConfig = {
  title: '¿Tenés alguna pregunta?',
  text: 'Podés escribirle a nuestros especialistas por cualquier consulta.',
  buttonText: 'Contactanos',
  buttonLink: '#',
  image: '',
  location: 'product_after',
  bgColor: '#ffffff',
  textColor: '#111111',
  buttonBg: '#191919',
  buttonTextColor: '#ffffff',
  borderColor: '#e5e5e5',
  sectionBg: 'transparent',
  showBorder: true,
  titleFontSize: 18,
  textFontSize: 14,
  borderRadius: 12,
  padding: 20,
  buttonBorderRadius: 25,
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

const PRESETS_DATA: Record<string, Partial<CajaContactoConfig>> = {
  'black-friday': { bgColor: '#111827', textColor: '#ffffff', buttonBg: '#F59E0B', buttonTextColor: '#111827', borderColor: '#F59E0B' },
  'hot-sale': { bgColor: '#0F172A', textColor: '#ffffff', buttonBg: '#EF4444', buttonTextColor: '#ffffff', borderColor: '#EF4444' },
  'cyber-monday': { bgColor: '#090D16', textColor: '#ffffff', buttonBg: '#3B82F6', buttonTextColor: '#ffffff', borderColor: '#3B82F6' },
  'navidad': { bgColor: '#064E3B', textColor: '#ffffff', buttonBg: '#F59E0B', buttonTextColor: '#064E3B', borderColor: '#10B981' },
  'san-valentin': { bgColor: '#831843', textColor: '#ffffff', buttonBg: '#F43F5E', buttonTextColor: '#ffffff', borderColor: '#F43F5E' },
  'dia-padre-madre': { bgColor: '#312E81', textColor: '#ffffff', buttonBg: '#10B981', buttonTextColor: '#ffffff', borderColor: '#10B981' },
  'liquidacion': { bgColor: '#7F1D1D', textColor: '#ffffff', buttonBg: '#FBBF24', buttonTextColor: '#7F1D1D', borderColor: '#FBBF24' },
};

async function compressImageToBase64(file: File, maxSize: number = 400, quality: number = 0.8): Promise<string> {
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

function CajaContactoPreview({ config }: { config: CajaContactoConfig }) {
  return (
    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN TU TIENDA
      </div>

      <div style={{
        background: config.sectionBg || 'transparent',
        padding: config.sectionBg && config.sectionBg !== 'transparent' ? 16 : 0,
        borderRadius: config.borderRadius + 4,
      }}>
        <div style={{
          background: config.bgColor,
          color: config.textColor,
          border: config.showBorder ? `1px solid ${config.borderColor}` : 'none',
          borderRadius: config.borderRadius,
          padding: config.padding,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          boxSizing: 'border-box',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {config.image ? (
              <img
                src={config.image}
                alt="Contacto"
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: '#e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>
                👨‍💼
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: config.titleFontSize, fontWeight: 800, color: config.textColor, lineHeight: 1.25, marginBottom: 6 }}>
                {config.title || '¿Tenés alguna pregunta?'}
              </div>

              {config.text && (
                <div style={{ fontSize: config.textFontSize, color: config.textColor, opacity: 0.85, lineHeight: 1.45, marginBottom: 14 }}>
                  {config.text}
                </div>
              )}

              <button
                type="button"
                style={{
                  background: config.buttonBg,
                  color: config.buttonTextColor,
                  borderRadius: config.buttonBorderRadius,
                  border: 'none',
                  padding: '10px 22px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-block',
                }}
              >
                {config.buttonText || 'Contactanos'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CajaContactoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: CajaContactoEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CajaContactoConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update<K extends keyof CajaContactoConfig>(key: K, value: CajaContactoConfig[K]) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['bgColor', 'textColor', 'buttonBg', 'buttonTextColor', 'borderColor'].indexOf(String(key)) !== -1) {
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
        buttonBg: defaultConfig.buttonBg,
        buttonTextColor: defaultConfig.buttonTextColor,
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

  async function handleImageSelect(file: File | null) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    setUploadingImage(true);
    setError(null);
    try {
      const base64 = await compressImageToBase64(file, 400, 0.8);
      update('image', base64);
    } catch {
      setError('Error al procesar la imagen.');
    } finally {
      setUploadingImage(false);
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
        <FieldLabel required>Título</FieldLabel>
        <TextInput
          value={config.title}
          onChange={(v) => update('title', v)}
          placeholder="Ej: ¿Tenés alguna pregunta?"
          maxLength={80}
        />
      </div>

      <div>
        <FieldLabel>Texto (opcional)</FieldLabel>
        <TextAreaInput
          value={config.text}
          onChange={(v) => update('text', v)}
          placeholder="Ej: Podés escribirle a nuestros especialistas por cualquier consulta."
          rows={3}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <FieldLabel required>Texto del botón</FieldLabel>
          <TextInput
            value={config.buttonText}
            onChange={(v) => update('buttonText', v)}
            placeholder="Ej: Contactanos"
            maxLength={40}
          />
        </div>

        <div>
          <FieldLabel required>Link del botón</FieldLabel>
          <TextInput
            value={config.buttonLink}
            onChange={(v) => update('buttonLink', v)}
            placeholder="Ej: https://wa.me/54911..."
          />
          <FieldHelper>Podés usar WhatsApp, un email (mailto:), o link a página de contacto.</FieldHelper>
        </div>
      </div>

      <div>
        <FieldLabel>Imagen (opcional)</FieldLabel>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
            handleImageSelect(f);
            e.target.value = '';
          }}
        />

        {config.image ? (
          <div style={{
            border: '2.5px dashed #10B981', borderRadius: 12, padding: 20,
            textAlign: 'center', background: '#f0fdf4', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <img
              src={config.image}
              alt="Imagen seleccionada"
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
              Imagen subida correctamente
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '8px 16px', borderRadius: 999, border: '1.5px solid #f87171',
                  background: '#fff', color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Cambiar imagen
              </button>
              <button
                type="button"
                onClick={() => update('image', '')}
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
            onClick={() => fileInputRef.current?.click()}
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
              {uploadingImage ? 'Procesando...' : 'Haz clic o arrastra una imagen aquí'}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>JPG, PNG, GIF - Máximo 2MB - Tamaño recomendado: 80x80px</div>
          </div>
        )}
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FieldLabel>Posición del widget en tu tienda</FieldLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { id: 'product_after', label: '⬇️ Antes de la descripción', helper: 'El widget aparece debajo del botón "Agregar al carrito", dentro de la columna del producto.' },
          { id: 'description_after', label: '📄 Después de la descripción', helper: 'El widget se muestra después de toda la sección del producto, a ancho completo.' },
          { id: 'cart', label: '🛒 En el carrito de compras', helper: 'Aparece dentro de la página del carrito para resolver dudas finales.' },
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
        <FieldHelper>Personalizá los colores de la caja, el botón y el fondo de la sección.</FieldHelper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          <div>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
          </div>

          <div>
            <FieldLabel>Color de texto</FieldLabel>
            <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
          </div>

          <div>
            <FieldLabel>Color de botón</FieldLabel>
            <ColorPickerField value={config.buttonBg} onChange={(v) => update('buttonBg', v)} />
          </div>

          <div>
            <FieldLabel>Color de texto del botón</FieldLabel>
            <ColorPickerField value={config.buttonTextColor} onChange={(v) => update('buttonTextColor', v)} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <FieldLabel>Color del borde</FieldLabel>
              <ToggleField checked={config.showBorder} onChange={(v) => update('showBorder', v)} label="" />
            </div>
            {config.showBorder && (
              <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
            )}
          </div>

          <div>
            <FieldLabel>Fondo de la sección</FieldLabel>
            <ColorPickerField value={config.sectionBg} onChange={(v) => update('sectionBg', v)} />
            <FieldHelper>Usá "transparent" o el mismo fondo que tu tienda.</FieldHelper>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>🔤 Tipografías</div>
        <FieldHelper>Ajustá el tamaño de fuente del título y el texto.</FieldHelper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          <div>
            <FieldLabel>Tamaño de fuente del título</FieldLabel>
            <SelectField
              value={String(config.titleFontSize)}
              onChange={(v) => update('titleFontSize', Number(v))}
              options={[
                { value: '16', label: '16px' },
                { value: '18', label: '18px (Recomendado)' },
                { value: '20', label: '20px' },
                { value: '22', label: '22px' },
              ]}
            />
          </div>

          <div>
            <FieldLabel>Tamaño de fuente del texto</FieldLabel>
            <SelectField
              value={String(config.textFontSize)}
              onChange={(v) => update('textFontSize', Number(v))}
              options={[
                { value: '13', label: '13px' },
                { value: '14', label: '14px (Recomendado)' },
                { value: '15', label: '15px' },
                { value: '16', label: '16px' },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>⚙️ Comportamiento y diseño</div>
        <FieldHelper>Bordes, padding y redondeado del contenido.</FieldHelper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          <div>
            <FieldLabel>Borde de la caja: {config.borderRadius}px</FieldLabel>
            <input
              type="range" min={0} max={25} value={config.borderRadius}
              onChange={(e) => update('borderRadius', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Padding interno: {config.padding}px</FieldLabel>
            <input
              type="range" min={0} max={40} value={config.padding}
              onChange={(e) => update('padding', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <FieldLabel>Borde del botón: {config.buttonBorderRadius}px</FieldLabel>
            <input
              type="range" min={0} max={30} value={config.buttonBorderRadius}
              onChange={(e) => update('buttonBorderRadius', Number(e.target.value))}
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
        <FieldHelper>Al elegir una campaña se aplican colores temáticos a la caja de contacto.</FieldHelper>
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
            <CajaContactoPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              La caja de contacto aparecerá debajo del botón &quot;Agregar al carrito&quot;, dentro de la columna del producto.
            </span>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, overflowX: 'auto' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'ubicacion', label: 'Ubicación' },
              { id: 'estilo', label: 'Estilos' },
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
