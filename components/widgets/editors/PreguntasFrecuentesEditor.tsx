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

interface PreguntasFrecuentesEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

export interface PreguntasFrecuentesConfig {
  title: string;
  showFirstOpen: boolean;
  position: 'before_desc' | 'after_desc';
  items: FaqItem[];
  bgColor: string;
  cardBgColor: string;
  titleColor: string;
  textColor: string;
  borderColor: string;
  titleFontSize: number;
  questionFontSize: number;
  answerFontSize: number;
  questionFontWeight: 'bold' | 'normal';
  borderRadius: number;
  enableBorder: boolean;
  questionSpacing: 'with_space' | 'no_space';
  toggleIconType: 'arrow' | 'plus';
  campaignTheme?: string;
}

const defaultItems: FaqItem[] = [
  { id: '1', question: '¿Cuánto demora el envío?', answer: 'Los envíos se despachan dentro de las 24 a 48 hs hábiles luego de confirmado el pago.', icon: '🚚' },
  { id: '2', question: '¿Por dónde envían mi pedido?', answer: 'Trabajamos con Andreani, Correo Argentino y servicio de mensajería express.', icon: '📦' },
  { id: '3', question: '¿De qué material es el producto?', answer: 'Utilizamos materiales de alta calidad probados y garantizados para máxima durabilidad.', icon: '🛡️' },
  { id: '4', question: '¿Qué pasa si no me gusta?', answer: 'Tenés hasta 30 días para solicitar el cambio o devolución de tu compra.', icon: '🔄' },
];

const defaultConfig: PreguntasFrecuentesConfig = {
  title: 'Preguntas frecuentes',
  showFirstOpen: true,
  position: 'before_desc',
  items: defaultItems,
  bgColor: '#ffffff',
  cardBgColor: '#f7f7f7',
  titleColor: '#000000',
  textColor: '#333333',
  borderColor: '#e5e7eb',
  titleFontSize: 18,
  questionFontSize: 15,
  answerFontSize: 14,
  questionFontWeight: 'bold',
  borderRadius: 8,
  enableBorder: false,
  questionSpacing: 'with_space',
  toggleIconType: 'arrow',
  campaignTheme: 'none',
};

const PRESET_ICONS = [
  { id: '❓', label: 'Duda' },
  { id: '💬', label: 'Chat' },
  { id: '📦', label: 'Envío' },
  { id: '🚚', label: 'Camión' },
  { id: '💳', label: 'Pago' },
  { id: '🛡️', label: 'Garantía' },
  { id: '🔄', label: 'Devolución' },
  { id: '⭐', label: 'Calidad' },
  { id: 'ℹ️', label: 'Info' },
  { id: '📞', label: 'Contacto' },
];

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro + texto dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Fondo azul oscuro + título rojo.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético + borde azul.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino + detalles blancos.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa de confianza.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Índigo premium + borde verde.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo sale + texto amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, Partial<PreguntasFrecuentesConfig>> = {
  'black-friday': { bgColor: '#111827', cardBgColor: '#1f2937', titleColor: '#F59E0B', textColor: '#ffffff', borderColor: '#374151' },
  'hot-sale': { bgColor: '#0F172A', cardBgColor: '#1e293b', titleColor: '#EF4444', textColor: '#ffffff', borderColor: '#334155' },
  'cyber-monday': { bgColor: '#090D16', cardBgColor: '#1e293b', titleColor: '#3B82F6', textColor: '#ffffff', borderColor: '#1e293b' },
  'navidad': { bgColor: '#064E3B', cardBgColor: '#047857', titleColor: '#ffffff', textColor: '#ecfdf5', borderColor: '#065f46' },
  'san-valentin': { bgColor: '#fdf2f8', cardBgColor: '#fce7f3', titleColor: '#831843', textColor: '#9d174d', borderColor: '#fbcfe8' },
  'dia-padre-madre': { bgColor: '#312E81', cardBgColor: '#3730A3', titleColor: '#10B981', textColor: '#ffffff', borderColor: '#4338ca' },
  'liquidacion': { bgColor: '#7F1D1D', cardBgColor: '#991B1B', titleColor: '#FBBF24', textColor: '#ffffff', borderColor: '#b91c1c' },
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

function PreguntasFrecuentesPreview({ config }: { config: PreguntasFrecuentesConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(config.showFirstOpen ? 0 : null);

  return (
    <div style={{
      background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>VISTA PREVIA EN TU TIENDA</span>
        <span style={{ color: '#10B981', fontWeight: 800 }}>✨ Interactiva</span>
      </div>

      <div style={{
        background: config.bgColor,
        border: `1.5px solid ${config.borderColor}`,
        borderRadius: config.borderRadius,
        padding: 16,
      }}>
        {config.title ? (
          <div style={{
            fontSize: config.titleFontSize,
            fontWeight: 800,
            color: config.titleColor,
            marginBottom: 14,
            lineHeight: 1.3,
          }}>
            {config.title}
          </div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: config.questionSpacing === 'with_space' ? 8 : 0 }}>
          {config.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const isFirst = idx === 0;
            const isLast = idx === config.items.length - 1;

            return (
              <div
                key={item.id || idx}
                style={{
                  background: config.cardBgColor,
                  color: config.textColor,
                  borderRadius: config.questionSpacing === 'with_space'
                    ? `${config.borderRadius}px`
                    : isFirst
                    ? `${config.borderRadius}px ${config.borderRadius}px 0 0`
                    : isLast
                    ? `0 0 ${config.borderRadius}px ${config.borderRadius}px`
                    : 0,
                  border: config.enableBorder ? `1.5px solid ${config.borderColor}` : 'none',
                  borderBottom: config.questionSpacing === 'no_space' && !isLast
                    ? `1px solid ${config.borderColor}`
                    : config.enableBorder
                    ? `1.5px solid ${config.borderColor}`
                    : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    background: 'none',
                    border: 'none',
                    color: config.textColor,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.icon ? <span style={{ fontSize: 16 }}>{item.icon}</span> : null}
                    <span style={{
                      fontSize: config.questionFontSize,
                      fontWeight: config.questionFontWeight === 'bold' ? 700 : 400,
                    }}>
                      {item.question || 'Pregunta sin texto'}
                    </span>
                  </div>

                  <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 700 }}>
                    {config.toggleIconType === 'arrow'
                      ? (isOpen ? '▲' : '▼')
                      : (isOpen ? '−' : '+')}
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 14px 12px',
                    fontSize: config.answerFontSize,
                    color: config.textColor,
                    opacity: 0.9,
                    lineHeight: 1.5,
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    paddingTop: 8,
                  }}>
                    {item.answer || 'Respuesta sin texto.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PreguntasFrecuentesEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: PreguntasFrecuentesEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<PreguntasFrecuentesConfig>(() => ({
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

  function update(key: keyof PreguntasFrecuentesConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['bgColor', 'cardBgColor', 'titleColor', 'textColor', 'borderColor'].indexOf(String(key)) !== -1) {
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
        cardBgColor: defaultConfig.cardBgColor,
        titleColor: defaultConfig.titleColor,
        textColor: defaultConfig.textColor,
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

  const handleAddItem = () => {
    const newItem: FaqItem = {
      id: Date.now().toString(),
      question: 'Nueva pregunta frecuente',
      answer: 'Escribí aquí la respuesta clara para esta pregunta.',
      icon: '❓',
    };
    setConfig((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleUpdateItem = (index: number, field: keyof FaqItem, value: string) => {
    setConfig((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  const handleRemoveItem = (index: number) => {
    if (config.items.length <= 1) return;
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === config.items.length - 1)) return;
    setConfig((prev) => {
      const nextItems = [...prev.items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = nextItems[index];
      nextItems[index] = nextItems[targetIndex];
      nextItems[targetIndex] = temp;
      return { ...prev, items: nextItems };
    });
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
        <FieldLabel>Título de la sección (opcional):</FieldLabel>
        <TextInput value={config.title} onChange={(v) => update('title', v)} placeholder="Preguntas frecuentes" maxLength={80} />
        <FieldHelper>Dejá vacío si no querés mostrar un título principal.</FieldHelper>
      </div>

      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <ToggleField
          checked={config.showFirstOpen}
          onChange={(v) => update('showFirstOpen', v)}
          label="Mostrar la primera pregunta abierta por defecto"
        />
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <FieldLabel>Preguntas y Respuestas ({config.items.length}):</FieldLabel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {config.items.map((item, index) => (
            <div
              key={item.id || index}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>Pregunta #{index + 1}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(index, 'up')}
                    disabled={index === 0}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                  >
                    ⬆️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(index, 'down')}
                    disabled={index === config.items.length - 1}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: index === config.items.length - 1 ? 'not-allowed' : 'pointer', opacity: index === config.items.length - 1 ? 0.3 : 1 }}
                  >
                    ⬇️
                  </button>
                  {config.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div>
                <FieldLabel>Pregunta:</FieldLabel>
                <TextInput
                  value={item.question}
                  onChange={(v) => handleUpdateItem(index, 'question', v)}
                  placeholder="Ej: ¿Cuánto demora el envío?"
                />
              </div>

              <div>
                <FieldLabel>Ícono decorativo:</FieldLabel>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PRESET_ICONS.map((p) => {
                    const sel = item.icon === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleUpdateItem(index, 'icon', p.id)}
                        style={{
                          padding: '6px 10px', borderRadius: 8,
                          border: sel ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: sel ? '#ecfdf5' : '#fff', cursor: 'pointer', fontSize: 16,
                        }}
                      >
                        {p.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel>Respuesta:</FieldLabel>
                <TextAreaInput
                  value={item.answer}
                  onChange={(v) => handleUpdateItem(index, 'answer', v)}
                  placeholder="Escribí aquí la respuesta clara..."
                  rows={3}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            style={{
              padding: '12px',
              borderRadius: 10,
              border: '2px dashed #10B981',
              background: '#ecfdf5',
              color: '#10B981',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            ➕ Agregar otra pregunta
          </button>
        </div>
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        onClick={() => update('position', 'before_desc')}
        style={{
          background: config.position === 'before_desc' ? '#ecfdf5' : '#fff',
          border: config.position === 'before_desc' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
          borderRadius: 12, padding: 16, cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
          📍 Antes de la descripción
        </div>
        <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.4 }}>
          El widget se muestra debajo del botón "Agregar al carrito", integrado en la columna de compra.
        </div>
      </div>

      <div
        onClick={() => update('position', 'after_desc')}
        style={{
          background: config.position === 'after_desc' ? '#ecfdf5' : '#fff',
          border: config.position === 'after_desc' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
          borderRadius: 12, padding: 16, cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
          📄 Después de la descripción
        </div>
        <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.4 }}>
          El widget se muestra al pie de toda la ficha del producto a ancho completo.
        </div>
      </div>
    </div>
  );

  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🎨 Colores Principales</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div>
            <FieldLabel>Fondo contenedor</FieldLabel>
            <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
          </div>
          <div>
            <FieldLabel>Fondo de tarjetas</FieldLabel>
            <ColorPickerField value={config.cardBgColor} onChange={(v) => update('cardBgColor', v)} />
          </div>
          <div>
            <FieldLabel>Color de título</FieldLabel>
            <ColorPickerField value={config.titleColor} onChange={(v) => update('titleColor', v)} />
          </div>
          <div>
            <FieldLabel>Color de texto</FieldLabel>
            <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
          </div>
          <div>
            <FieldLabel>Color de borde</FieldLabel>
            <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>🔤 Tipografías y Peso</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <FieldLabel>Título</FieldLabel>
            <SelectField
              value={String(config.titleFontSize)}
              onChange={(v) => update('titleFontSize', Number(v))}
              options={[
                { value: '16', label: '16px' },
                { value: '18', label: '18px' },
                { value: '20', label: '20px' },
                { value: '22', label: '22px' },
              ]}
            />
          </div>
          <div>
            <FieldLabel>Pregunta</FieldLabel>
            <SelectField
              value={String(config.questionFontSize)}
              onChange={(v) => update('questionFontSize', Number(v))}
              options={[
                { value: '13', label: '13px' },
                { value: '14', label: '14px' },
                { value: '15', label: '15px' },
                { value: '16', label: '16px' },
              ]}
            />
          </div>
          <div>
            <FieldLabel>Respuesta</FieldLabel>
            <SelectField
              value={String(config.answerFontSize)}
              onChange={(v) => update('answerFontSize', Number(v))}
              options={[
                { value: '12', label: '12px' },
                { value: '13', label: '13px' },
                { value: '14', label: '14px' },
                { value: '15', label: '15px' },
              ]}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <FieldLabel>Estilo de fuente en preguntas</FieldLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => update('questionFontWeight', 'bold')}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.questionFontWeight === 'bold' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.questionFontWeight === 'bold' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              A Resaltado (Negrita)
            </button>
            <button
              type="button"
              onClick={() => update('questionFontWeight', 'normal')}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                border: config.questionFontWeight === 'normal' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.questionFontWeight === 'normal' ? '#ecfdf5' : '#fff', color: '#111827',
              }}
            >
              A Normal
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>⚙️ Diseño de Acordeón</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Bordes redondeados: {config.borderRadius}px</FieldLabel>
            <input
              type="range" min={0} max={25} value={config.borderRadius}
              onChange={(e) => update('borderRadius', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <ToggleField
              checked={config.enableBorder}
              onChange={(v) => update('enableBorder', v)}
              label="Activar borde perimetral en cada pregunta"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <FieldLabel>Separación entre preguntas</FieldLabel>
              <SelectField
                value={config.questionSpacing}
                onChange={(v) => update('questionSpacing', v)}
                options={[
                  { value: 'with_space', label: 'Con espacio' },
                  { value: 'no_space', label: 'Sin espacio (unidas)' },
                ]}
              />
            </div>
            <div>
              <FieldLabel>Ícono de despliegue</FieldLabel>
              <SelectField
                value={config.toggleIconType}
                onChange={(v) => update('toggleIconType', v)}
                options={[
                  { value: 'arrow', label: 'Flecha (▲/▼)' },
                  { value: 'plus', label: 'Más/Menos (+/−)' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto a las Preguntas Frecuentes.</FieldHelper>
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
            <PreguntasFrecuentesPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Muestra una sección de preguntas frecuentes personalizadas (acordeón expandible) en la ficha del producto para despejar dudas y aumentar la conversión.
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
