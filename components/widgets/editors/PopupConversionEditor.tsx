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
  target_category_id?: string | number | null;
}

interface PopupConversionEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

interface Cfg {
  mode: 'ruleta' | 'cajas' | 'email';
  title: string;
  subtitle: string;
  buttonText: string;
  couponCode: string;
  discountValue: number;
  requireEmail: boolean;
  delaySeconds: number;
  frequency: 'once_per_visitor' | 'once_per_session' | 'always';
  timerMinutes: number;
  enableMobile: boolean;
  bgColor: string;
  textColor: string;
  accentColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: Cfg = {
  mode: 'ruleta',
  title: 'Antes de que te vayas',
  subtitle: 'Te regalamos un descuento exclusivo para que uses ahora mismo.',
  buttonText: 'Quiero mi descuento',
  couponCode: 'NEVUX10',
  discountValue: 10,
  requireEmail: true,
  delaySeconds: 4,
  frequency: 'once_per_visitor',
  timerMinutes: 10,
  enableMobile: true,
  bgColor: '#ffffff',
  textColor: '#111827',
  accentColor: '#10B981',
  buttonBgColor: '#10B981',
  buttonTextColor: '#ffffff',
  campaignTheme: 'none',
};

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
    mode: (raw.mode as Cfg['mode']) || DEF.mode,
    title: (raw.title as string) || DEF.title,
    subtitle: (raw.subtitle as string) || DEF.subtitle,
    buttonText: (raw.buttonText as string) || DEF.buttonText,
    couponCode: (raw.couponCode as string) || DEF.couponCode,
    discountValue: typeof raw.discountValue === 'number' ? raw.discountValue : DEF.discountValue,
    requireEmail: typeof raw.requireEmail === 'boolean' ? raw.requireEmail : DEF.requireEmail,
    delaySeconds: typeof raw.delaySeconds === 'number' ? raw.delaySeconds : DEF.delaySeconds,
    frequency: (raw.frequency as Cfg['frequency']) || DEF.frequency,
    timerMinutes: typeof raw.timerMinutes === 'number' ? raw.timerMinutes : DEF.timerMinutes,
    enableMobile: typeof raw.enableMobile === 'boolean' ? raw.enableMobile : DEF.enableMobile,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    buttonBgColor: (raw.buttonBgColor as string) || DEF.buttonBgColor,
    buttonTextColor: (raw.buttonTextColor as string) || DEF.buttonTextColor,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function PopupConversionEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: PopupConversionEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'mode' | 'text' | 'style' | 'dates'>('mode');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

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
    key: 'bgColor' | 'textColor' | 'accentColor' | 'buttonBgColor' | 'buttonTextColor',
    val: string
  ) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const applyCampaignPreset = (slug: string) => {
    const CAMPAIGN_DATA: Record<string, { bg: string; tx: string; accent: string; btn: string }> = {
      'black-friday': { bg: '#111827', tx: '#ffffff', accent: '#F59E0B', btn: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', accent: '#EF4444', btn: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', accent: '#3B82F6', btn: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', accent: '#EF4444', btn: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', accent: '#F43F5E', btn: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', accent: '#10B981', btn: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', accent: '#FBBF24', btn: '#FBBF24' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        textColor: DEF.textColor,
        accentColor: DEF.accentColor,
        buttonBgColor: DEF.buttonBgColor,
      }));
    } else if (CAMPAIGN_DATA[slug]) {
      const p = CAMPAIGN_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
        accentColor: p.accent,
        buttonBgColor: p.btn,
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
        }}>

          {/* PREVIEW EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VISTA PREVIA EN VIVO
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div
                style={{
                  background: cfg.bgColor,
                  borderRadius: 16,
                  padding: 22,
                  color: cfg.textColor,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  maxWidth: 360,
                  width: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                }}
              >
                {/* Botón cerrar X */}
                <div style={{ position: 'absolute', top: 12, right: 14, opacity: 0.5, fontSize: 14, cursor: 'pointer', fontWeight: 700 }}>
                  ✕
                </div>

                <div style={{ fontSize: 18, fontWeight: 800, color: cfg.textColor, marginBottom: 6 }}>
                  {cfg.title}
                </div>
                <div style={{ fontSize: 13, color: cfg.textColor, opacity: 0.75, marginBottom: 16, lineHeight: 1.4 }}>
                  {cfg.subtitle}
                </div>

                {/* MECÁNICA SEGÚN MODO */}
                {cfg.mode === 'ruleta' && (
                  <div style={{ margin: '14px auto', width: 140, height: 140, borderRadius: '50%', border: `4px solid ${cfg.accentColor}`, background: 'conic-gradient(#10B981 0deg 60deg, #F59E0B 60deg 120deg, #EF4444 120deg 180deg, #3B82F6 180deg 240deg, #8B5CF6 240deg 300deg, #EC4899 300deg 360deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 8px rgba(255,255,255,0.8)', position: 'relative' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ffffff', border: `3px solid ${cfg.accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>
                      🎁
                    </div>
                  </div>
                )}

                {cfg.mode === 'cajas' && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '16px 0' }}>
                    {['🎁', '🎁', '🎁'].map((emoji, idx) => (
                      <div key={idx} style={{ background: cfg.accentColor, color: '#ffffff', width: 54, height: 54, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                        {emoji}
                      </div>
                    ))}
                  </div>
                )}

                {/* CAMPO EMAIL SI ESTÁ ACTIVADO */}
                {cfg.requireEmail && (
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="email"
                      readOnly
                      placeholder="Tu correo electrónico"
                      style={{
                        width: '100%', padding: '12px 14px', fontSize: 13,
                        border: '1.5px solid #e5e7eb', borderRadius: 10,
                        background: '#ffffff', color: '#6b7280', outline: 'none',
                        boxSizing: 'border-box', textAlign: 'center',
                      }}
                    />
                  </div>
                )}

                {/* BOTÓN PRINCIPAL */}
                <button
                  type="button"
                  style={{
                    width: '100%', background: cfg.buttonBgColor, color: cfg.buttonTextColor,
                    border: 'none', borderRadius: 10, padding: '12px', fontSize: 14,
                    fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {cfg.buttonText}
                </button>

                <div style={{ fontSize: 11, color: cfg.textColor, opacity: 0.5, marginTop: 10 }}>
                  Continuar sin descuento
                </div>
              </div>
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
              🔒 <strong>Regla de oro:</strong> Este popup se muestra <strong>máximo 1 vez por visitante</strong> (guardado en su navegador). Nunca cansa ni satura a tus clientes recurrentes.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['mode', '🎰 Modo & Juego'],
                ['text', '✍️ Textos & Cupón'],
                ['style', '🎨 Estilo & Frecuencia'],
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

          {/* TAB 1: MODO & JUEGO */}
          {tab === 'mode' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Formato interactivo</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'ruleta', label: '🎡 Ruleta', desc: 'Gira y gana' },
                    { id: 'cajas', label: '🎁 Cajas', desc: 'Abrí una caja' },
                    { id: 'email', label: '✉️ Directo', desc: 'Simple formulario' },
                  ].map((m) => {
                    const active = cfg.mode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => set('mode', m.id as any)}
                        style={{
                          padding: '12px 8px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{m.label}</div>
                        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>{m.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <ToggleField
                checked={cfg.requireEmail}
                onChange={(v) => set('requireEmail', v)}
                label="Pedir email obligatoriamente antes de mostrar el premio"
              />
            </div>
          )}

          {/* TAB 2: TEXTOS & CUPÓN */}
          {tab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Título del Popup</FieldLabel>
                <TextInput
                  value={cfg.title}
                  onChange={(v) => set('title', v)}
                  placeholder="Antes de que te vayas"
                />
              </div>

              <div>
                <FieldLabel>Subtítulo o descripción</FieldLabel>
                <TextInput
                  value={cfg.subtitle}
                  onChange={(v) => set('subtitle', v)}
                  placeholder="Te regalamos un descuento para que uses ahora mismo."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <FieldLabel>Código del Cupón</FieldLabel>
                  <TextInput
                    value={cfg.couponCode}
                    onChange={(v) => set('couponCode', v.toUpperCase())}
                    placeholder="NEVUX10"
                  />
                  <FieldHelper>Crealo con este mismo código en Tiendanube → Descuentos.</FieldHelper>
                </div>
                <div>
                  <FieldLabel>% Descuento a mostrar</FieldLabel>
                  <TextInput
                    type="number"
                    min="1"
                    max="100"
                    value={String(cfg.discountValue)}
                    onChange={(v) => set('discountValue', parseInt(v, 10) || 10)}
                    placeholder="10"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <FieldLabel>Tiempo del Timer (minutos)</FieldLabel>
                  <TextInput
                    type="number"
                    min="1"
                    max="120"
                    value={String(cfg.timerMinutes)}
                    onChange={(v) => set('timerMinutes', parseInt(v, 10) || 10)}
                    placeholder="10"
                  />
                </div>
                <div>
                  <FieldLabel>Segundos hasta aparecer</FieldLabel>
                  <TextInput
                    type="number"
                    min="1"
                    max="60"
                    value={String(cfg.delaySeconds)}
                    onChange={(v) => set('delaySeconds', parseInt(v, 10) || 4)}
                    placeholder="4"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Texto del Botón</FieldLabel>
                <TextInput
                  value={cfg.buttonText}
                  onChange={(v) => set('buttonText', v)}
                  placeholder="Quiero mi descuento"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ESTILO & FRECUENCIA */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Frecuencia de exhibición</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'once_per_visitor', label: '👤 1 vez por visitante (Recomendado)', desc: 'Máximo 1 vez por cliente para no saturar.' },
                    { id: 'once_per_session', label: '🔄 1 vez por sesión de navegación', desc: 'Vuelve a mostrarse si cierra y abre la solapa.' },
                    { id: 'always', label: '⚡ Siempre (Solo para pruebas)', desc: 'Se muestra en cada recarga de página.' },
                  ].map((f) => {
                    const active = cfg.frequency === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => set('frequency', f.id as any)}
                        style={{
                          padding: '12px 14px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{f.label}</div>
                        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>{f.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <ToggleField
                checked={cfg.enableMobile}
                onChange={(v) => set('enableMobile', v)}
                label="Activar también en celulares y tablets"
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Fondo del Popup</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Texto</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Acento / Ruleta</FieldLabel>
                  <ColorPickerField value={cfg.accentColor} onChange={(v) => setCustomColor('accentColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color del Botón</FieldLabel>
                  <ColorPickerField value={cfg.buttonBgColor} onChange={(v) => setCustomColor('buttonBgColor', v)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FECHAS ESPECIALES */}
          {tab === 'dates' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
                <FieldHelper>
                  Elegí una campaña para vestir tu popup de conversión con colores festivos.
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
