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
  target_product_id?: number | null;
  target_category_id?: string | null;
}

export interface CfgSuscripcionStock {
  title: string;
  buttonText: string;
  emailPlaceholder: string;
  successMessage: string;
  emailSubject: string;
  emailBody: string;
  notificationMode: 'all' | 'fifo';
  buttonColor: string;
  buttonTextColor: string;
  inputBorderColor: string;
  titleTextColor: string;
  titleFontSize: '12px' | '14px' | '16px' | '18px';
  titleFontWeight: 'normal' | 'bold';
  buttonFontSize: '12px' | '14px' | '16px' | '18px';
  buttonFontWeight: 'normal' | 'bold';
  buttonBorderRadius: number;
  inputBorderRadius: number;
  campaignTheme: string;
}

interface SuscripcionStockEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: string;
  productId?: number | null;
  categoryId?: string | null;
  storeId: string | number;
  initialConfig?: any;
  widgetId?: string | number | null;
  onSave?: (config: any) => void;
  isSaving?: boolean;
}

/* ═══════════════════════════════════════════
   DEFAULTS + THEME_FX
═══════════════════════════════════════════ */
const DEF: CfgSuscripcionStock = {
  title: '¿Querés saber cuándo vuelve?',
  buttonText: 'Avisame cuando haya stock',
  emailPlaceholder: 'Tu email',
  successMessage: '¡Te avisamos cuando vuelva!',
  emailSubject: '¡El producto que querías está disponible!',
  emailBody: 'El producto {nombre} que querías volvió a tener stock. ¡Aprovechá antes de que se agote!',
  notificationMode: 'all',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  inputBorderColor: '#cccccc',
  titleTextColor: '#333333',
  titleFontSize: '14px',
  titleFontWeight: 'bold',
  buttonFontSize: '14px',
  buttonFontWeight: 'bold',
  buttonBorderRadius: 4,
  inputBorderRadius: 4,
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
   HELPERS UI
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <line x1="2" y1="7" x2="22" y2="7" />
    <path d="M22 7v3a2 2 0 0 1-4 0V7" />
    <path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9" />
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5" />
  </svg>
);

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
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '12px 14px',
        fontSize: 14,
        border: '1.5px solid #e5e7eb',
        borderRadius: 10,
        background: '#ffffff',
        color: '#000000',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '12px 14px',
        fontSize: 14,
        border: '1.5px solid #e5e7eb',
        borderRadius: 10,
        background: '#ffffff',
        color: '#000000',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
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
      <div
        onClick={handleClick}
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: value,
          border: '1.5px solid #e5e7eb',
          cursor: 'pointer',
          flexShrink: 0,
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
          flex: 1,
          minWidth: 0,
          padding: '9px 10px',
          fontSize: 13,
          border: '1.5px solid #e5e7eb',
          borderRadius: 8,
          background: '#ffffff',
          color: '#000000',
          outline: 'none',
          fontFamily: 'monospace',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  activeColor = '#10B981',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  activeColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 26,
        borderRadius: 999,
        background: checked ? activeColor : '#e5e7eb',
        border: 'none',
        cursor: 'pointer',
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#ffffff',
          transform: checked ? 'translateX(22px)' : 'translateX(0px)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function parseCfg(raw: Record<string, unknown> | undefined): CfgSuscripcionStock {
  if (!raw) return { ...DEF };
  return {
    title: raw.title !== undefined ? String(raw.title) : DEF.title,
    buttonText: raw.buttonText !== undefined ? String(raw.buttonText) : DEF.buttonText,
    emailPlaceholder: raw.emailPlaceholder !== undefined ? String(raw.emailPlaceholder) : DEF.emailPlaceholder,
    successMessage: raw.successMessage !== undefined ? String(raw.successMessage) : DEF.successMessage,
    emailSubject: raw.emailSubject !== undefined ? String(raw.emailSubject) : DEF.emailSubject,
    emailBody: raw.emailBody !== undefined ? String(raw.emailBody) : DEF.emailBody,
    notificationMode: (raw.notificationMode as CfgSuscripcionStock['notificationMode']) || DEF.notificationMode,
    buttonColor: (raw.buttonColor as string) || DEF.buttonColor,
    buttonTextColor: (raw.buttonTextColor as string) || DEF.buttonTextColor,
    inputBorderColor: (raw.inputBorderColor as string) || DEF.inputBorderColor,
    titleTextColor: (raw.titleTextColor as string) || DEF.titleTextColor,
    titleFontSize: (raw.titleFontSize as CfgSuscripcionStock['titleFontSize']) || DEF.titleFontSize,
    titleFontWeight: (raw.titleFontWeight as CfgSuscripcionStock['titleFontWeight']) || DEF.titleFontWeight,
    buttonFontSize: (raw.buttonFontSize as CfgSuscripcionStock['buttonFontSize']) || DEF.buttonFontSize,
    buttonFontWeight: (raw.buttonFontWeight as CfgSuscripcionStock['buttonFontWeight']) || DEF.buttonFontWeight,
    buttonBorderRadius: typeof raw.buttonBorderRadius === 'number' ? raw.buttonBorderRadius : DEF.buttonBorderRadius,
    inputBorderRadius: typeof raw.inputBorderRadius === 'number' ? raw.inputBorderRadius : DEF.inputBorderRadius,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function SuscripcionStockEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
  initialConfig,
  onSave,
  isSaving,
}: SuscripcionStockEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<CfgSuscripcionStock>(() => parseCfg(ew?.config || initialConfig));
  const [isActive, setIsActive] = useState(ew?.is_active !== false);
  const [tab, setTab] = useState<'gen' | 'emails' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [previewEmail, setPreviewEmail] = useState('');
  const [previewSuccess, setPreviewSuccess] = useState(false);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg, isActive]);

  const set = <K extends keyof CfgSuscripcionStock>(k: K, v: CfgSuscripcionStock[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (
    key: 'buttonColor' | 'buttonTextColor' | 'inputBorderColor' | 'titleTextColor',
    val: string
  ) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const applyPreset = (slug: string) => {
    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: 'none',
        buttonColor: DEF.buttonColor,
        buttonTextColor: DEF.buttonTextColor,
        inputBorderColor: DEF.inputBorderColor,
        titleTextColor: DEF.titleTextColor,
      }));
      return;
    }
    const p = THEME_FX[slug];
    if (p) {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        buttonColor: p.accent,
        buttonTextColor: p.text,
        inputBorderColor: p.accent,
        titleTextColor: p.accent,
      }));
    }
  };

  const save = async () => {
    const finalCfg = { ...cfg };

    if (onSave) {
      onSave(finalCfg);
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
        config: finalCfg,
        target_type: targetType,
        target_product_id: productId ?? null,
        target_category_id: categoryId ?? null,
        is_active: isActive,
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

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewEmail.trim()) return;
    setPreviewSuccess(true);
    setTimeout(() => {
      setPreviewSuccess(false);
      setPreviewEmail('');
    }, 3000);
  };

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Acento dorado sobre fondo oscuro.' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Rojo fuego para urgencia.' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul cibernético.' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Rojo navideño con aire festivo.' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa pasión para fechas románticas.' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Índigo suave y elegante.' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Ámbar cálido de oferta.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* HEADER STICKY */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            RL
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>
        {isForAll ? (
          <div
            style={{
              background: '#10B981',
              color: '#ffffff',
              borderRadius: 999,
              padding: '8px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <IconStore />
            <span>Widget general para toda la tienda</span>
          </div>
        ) : (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: '8px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span>
            <span>NEVUX Widget</span>
          </div>
        )}

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            margin: '0 0 20px',
            lineHeight: 1.2,
          }}
        >
          {ew ? 'Editar widget: ' : 'Nuevo widget: '}
          {wd.name} ({scopeLabel})
        </h1>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* ─── PREVIEW EN VIVO ─── */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 10,
              }}
            >
              Vista previa en vivo
            </div>

            <div
              style={{
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                padding: 16,
              }}
            >
              {/* Producto mock */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: 14,
                }}
              >
                <span>🎧</span> Auriculares Air 31 AAA
              </div>

              {/* Botón Sin stock deshabilitado */}
              <button
                type="button"
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#D1D5DB',
                  color: '#6B7280',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'not-allowed',
                  marginBottom: 14,
                }}
              >
                Sin stock
              </button>

              {/* Formulario widget */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {previewSuccess ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '16px 8px',
                      color: '#059669',
                      fontWeight: 700,
                      fontSize: cfg.titleFontSize,
                    }}
                  >
                    {cfg.successMessage || '¡Te avisamos cuando vuelva!'}
                  </div>
                ) : (
                  <form onSubmit={handlePreviewSubmit}>
                    {cfg.title.trim() !== '' && (
                      <div
                        style={{
                          fontSize: cfg.titleFontSize,
                          fontWeight: cfg.titleFontWeight === 'bold' ? 700 : 400,
                          color: cfg.titleTextColor,
                          textAlign: 'center',
                          marginBottom: 12,
                        }}
                      >
                        {cfg.title}
                      </div>
                    )}

                    <input
                      type="email"
                      value={previewEmail}
                      onChange={(e) => setPreviewEmail(e.target.value)}
                      placeholder={cfg.emailPlaceholder || 'Tu email'}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1.5px solid ${cfg.inputBorderColor}`,
                        borderRadius: cfg.inputBorderRadius,
                        fontSize: 14,
                        marginBottom: 10,
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: cfg.buttonColor,
                        color: cfg.buttonTextColor,
                        border: 'none',
                        borderRadius: cfg.buttonBorderRadius,
                        fontSize: cfg.buttonFontSize,
                        fontWeight: cfg.buttonFontWeight === 'bold' ? 700 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {cfg.buttonText || 'Avisame cuando haya stock'}
                    </button>
                  </form>
                )}
              </div>

              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12, lineHeight: 1.5, textAlign: 'center' }}>
                ⓘ El formulario aparecerá debajo del botón &quot;Sin stock&quot; cuando un producto no tenga stock disponible.
              </p>
            </div>
          </div>

          {/* TABS */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 24,
              overflowX: 'auto',
            }}
          >
            {(
              [
                ['gen', 'General'],
                ['emails', 'Emails'],
                ['style', 'Estilos'],
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
                    flex: 1,
                    padding: '14px 12px',
                    background: 'none',
                    border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000000',
                    opacity: act ? 1 : 0.6,
                    fontSize: 14,
                    fontWeight: act ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
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
              <div>
                <FieldLabel>Título (opcional)</FieldLabel>
                <TextInput
                  value={cfg.title}
                  onChange={(v) => set('title', v)}
                  placeholder="¿Querés saber cuándo vuelve?"
                />
                <FieldHelper>Se muestra sobre el formulario. Dejá vacío para ocultarlo.</FieldHelper>
              </div>

              <div>
                <FieldLabel>Texto del botón</FieldLabel>
                <TextInput
                  value={cfg.buttonText}
                  onChange={(v) => set('buttonText', v)}
                  placeholder="Avisame cuando haya stock"
                />
              </div>

              <div>
                <FieldLabel>Placeholder del email</FieldLabel>
                <TextInput
                  value={cfg.emailPlaceholder}
                  onChange={(v) => set('emailPlaceholder', v)}
                  placeholder="Tu email"
                />
              </div>

              <div>
                <FieldLabel>Mensaje de éxito</FieldLabel>
                <TextInput
                  value={cfg.successMessage}
                  onChange={(v) => set('successMessage', v)}
                  placeholder="¡Te avisamos cuando vuelva!"
                />
                <FieldHelper>Texto que se muestra al cliente luego de registrarse.</FieldHelper>
              </div>

              <div
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  Email de aviso al cliente
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14, lineHeight: 1.45 }}>
                  Configurá el email que recibirá el cliente cuando el producto vuelva a tener stock. Podés usar las variables{' '}
                  <span style={{ color: '#EC4899', fontWeight: 700 }}>{'{nombre}'}</span> y{' '}
                  <span style={{ color: '#EC4899', fontWeight: 700 }}>{'{url}'}</span>.
                </div>

                <div style={{ marginBottom: 14 }}>
                  <FieldLabel>Asunto del email</FieldLabel>
                  <TextInput
                    value={cfg.emailSubject}
                    onChange={(v) => set('emailSubject', v)}
                    placeholder="¡El producto que querías está disponible!"
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <FieldLabel>Cuerpo del email</FieldLabel>
                  <TextArea
                    value={cfg.emailBody}
                    onChange={(v) => set('emailBody', v)}
                    placeholder="El producto {nombre} que querías volvió a tener stock..."
                    rows={3}
                  />
                  <FieldHelper>
                    Variables disponibles: {'{nombre}'} (nombre del producto) y {'{url}'} (enlace al producto).
                  </FieldHelper>
                </div>

                <div>
                  <FieldLabel>Modo de notificación</FieldLabel>
                  <select
                    value={cfg.notificationMode}
                    onChange={(e) => set('notificationMode', e.target.value as 'all' | 'fifo')}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: 14,
                      border: '1.5px solid #e5e7eb',
                      borderRadius: 10,
                      background: '#ffffff',
                      color: '#000000',
                      outline: 'none',
                    }}
                  >
                    <option value="all">Avisar a todos</option>
                    <option value="fifo">Avisar según stock disponible (FIFO)</option>
                  </select>
                  <FieldHelper>
                    Con &quot;según stock disponible&quot;, si hay más suscriptores que unidades repuestas, solo se notifica a los primeros en registrarse (FIFO). El resto queda pendiente para la próxima reposición.
                  </FieldHelper>
                </div>
              </div>
            </div>
          )}

          {/* TAB EMAILS */}
          {tab === 'emails' && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#fafafa',
                borderRadius: 12,
                border: '1px dashed #d1d5db',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8, color: '#9ca3af' }}>✉️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Emails recolectados
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', maxWidth: 320, margin: '0 auto 16px', lineHeight: 1.5 }}>
                Los emails recolectados aparecerán aquí una vez que el widget esté creado y activado.
              </div>
              <button
                type="button"
                onClick={() => alert('No hay suscriptores aún.')}
                style={{
                  padding: '10px 16px',
                  background: '#374151',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Descargar CSV
              </button>
            </div>
          )}

          {/* TAB ESTILOS */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Colores */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  🎨 Colores principales
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
                  Personalizá los colores del botón, input y título.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <FieldLabel>Color del botón</FieldLabel>
                    <ColorPickerField value={cfg.buttonColor} onChange={(v) => setCustomColor('buttonColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color del texto del botón</FieldLabel>
                    <ColorPickerField value={cfg.buttonTextColor} onChange={(v) => setCustomColor('buttonTextColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color del borde del input</FieldLabel>
                    <ColorPickerField value={cfg.inputBorderColor} onChange={(v) => setCustomColor('inputBorderColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color del texto del título</FieldLabel>
                    <ColorPickerField value={cfg.titleTextColor} onChange={(v) => setCustomColor('titleTextColor', v)} />
                  </div>
                </div>
              </div>

              {/* Tipografías */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  T Tipografías
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
                  Tamaño y estilo del texto del título y del botón.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FieldLabel>Tamaño de texto</FieldLabel>
                    <select
                      value={cfg.titleFontSize}
                      onChange={(e) => set('titleFontSize', e.target.value as CfgSuscripcionStock['titleFontSize'])}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 10,
                        background: '#ffffff',
                        color: '#000000',
                        outline: 'none',
                      }}
                    >
                      <option value="12px">12 px</option>
                      <option value="14px">14 px</option>
                      <option value="16px">16 px</option>
                      <option value="18px">18 px</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Estilo del texto</FieldLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {([
                        { v: 'normal', label: 'Normal' },
                        { v: 'bold', label: 'Resaltado' },
                      ] as const).map((opt) => {
                        const selected = cfg.titleFontWeight === opt.v;
                        return (
                          <button
                            key={opt.v}
                            type="button"
                            onClick={() => set('titleFontWeight', opt.v)}
                            style={{
                              padding: '12px',
                              borderRadius: 10,
                              border: selected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                              background: selected ? '#ECFDF5' : '#ffffff',
                              cursor: 'pointer',
                              fontSize: 13,
                              fontWeight: opt.v === 'bold' ? 700 : 500,
                              color: '#111827',
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <FieldLabel>Tamaño de fuente del botón</FieldLabel>
                    <select
                      value={cfg.buttonFontSize}
                      onChange={(e) => set('buttonFontSize', e.target.value as CfgSuscripcionStock['buttonFontSize'])}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 10,
                        background: '#ffffff',
                        color: '#000000',
                        outline: 'none',
                      }}
                    >
                      <option value="12px">12 px</option>
                      <option value="14px">14 px</option>
                      <option value="16px">16 px</option>
                      <option value="18px">18 px</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Estilo del texto del botón</FieldLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {([
                        { v: 'normal', label: 'Normal' },
                        { v: 'bold', label: 'Resaltado' },
                      ] as const).map((opt) => {
                        const selected = cfg.buttonFontWeight === opt.v;
                        return (
                          <button
                            key={opt.v}
                            type="button"
                            onClick={() => set('buttonFontWeight', opt.v)}
                            style={{
                              padding: '12px',
                              borderRadius: 10,
                              border: selected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                              background: selected ? '#ECFDF5' : '#ffffff',
                              cursor: 'pointer',
                              fontSize: 13,
                              fontWeight: opt.v === 'bold' ? 700 : 500,
                              color: '#111827',
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bordes */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  ▦ Comportamiento y diseño
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
                  Bordes redondeados del botón y del input.
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <FieldLabel>Bordes redondeados del botón</FieldLabel>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{cfg.buttonBorderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={cfg.buttonBorderRadius}
                    onChange={(e) => set('buttonBorderRadius', parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#10B981' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <FieldLabel>Bordes redondeados del input</FieldLabel>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{cfg.inputBorderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={cfg.inputBorderRadius}
                    onChange={(e) => set('inputBorderRadius', parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#10B981' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB EVENTOS */}
          {tab === 'dates' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
                <FieldHelper>
                  Elegí una campaña: los colores del botón, borde e título se adaptan automáticamente al evento.
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
                        padding: 16,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                    >
                      <div style={{ fontSize: 24, flexShrink: 0 }}>{preset.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: '#000000',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          {preset.label}
                          {isSelected && (
                            <span
                              style={{
                                background: '#ecfdf5',
                                color: '#10B981',
                                fontSize: 11,
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 999,
                                border: '1px solid #10B981',
                              }}
                            >
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

          {/* Widget activo + mensajes */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ToggleSwitch checked={isActive} onChange={setIsActive} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Widget activo</span>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            {ok && (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #10B981',
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#059669',
                }}
              >
                ✅ Widget guardado correctamente
              </div>
            )}
            {err && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#dc2626',
                }}
              >
                ❌ {err}
              </div>
            )}
          </div>

          {/* BOTÓN GUARDAR FULL WIDTH VERDE */}
          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={save}
              disabled={saving || isSaving}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                background: saving || isSaving ? '#9ca3af' : '#10B981',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 800,
                cursor: saving || isSaving ? 'wait' : 'pointer',
                boxShadow: saving || isSaving ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              {saving || isSaving ? 'Guardando...' : ew ? 'Actualizar Widget' : 'Crear Widget'}
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
