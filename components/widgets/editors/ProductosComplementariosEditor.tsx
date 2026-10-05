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

interface ProductosComplementariosEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

export interface CfgComplementarios {
  title: string;
  subtitle: string;
  aiAutocomplete: boolean;
  manualUrls: string; // URLs separadas por salto de línea
  maxProducts: number;
  showDiscountBadge: boolean;
  discountText: string;
  inProductBanner: boolean;
  inCartDrawer: boolean;
  openCartOnAdd: boolean;
  position: 'before_cart' | 'before_desc' | 'after_desc';
  bgColor: string;
  buttonBg: string;
  buttonText: string;
  textColor: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: CfgComplementarios = {
  title: 'También te puede interesar',
  subtitle: '',
  aiAutocomplete: true,
  manualUrls: '',
  maxProducts: 3,
  showDiscountBadge: true,
  discountText: '-15% OFF',
  inProductBanner: true,
  inCartDrawer: false,
  openCartOnAdd: true,
  position: 'before_cart',
  bgColor: '#ffffff',
  buttonBg: '#111827',
  buttonText: '#ffffff',
  textColor: '#111827',
  campaignTheme: 'none',
};

const THEME_FX: Record<string, { bg: string; buttonBg: string; buttonText: string; text: string; border: string }> = {
  'black-friday': { bg: '#111827', buttonBg: '#F59E0B', buttonText: '#111827', text: '#ffffff', border: '1px solid #374151' },
  'hot-sale': { bg: '#0F172A', buttonBg: '#EF4444', buttonText: '#ffffff', text: '#ffffff', border: '1px solid #1E293B' },
  'cyber-monday': { bg: '#090D16', buttonBg: '#3B82F6', buttonText: '#ffffff', text: '#ffffff', border: '1px solid #1E3A8A' },
  'navidad': { bg: '#064E3B', buttonBg: '#EF4444', buttonText: '#ffffff', text: '#ffffff', border: '1px solid #047857' },
  'san-valentin': { bg: '#fff1f2', buttonBg: '#F43F5E', buttonText: '#ffffff', text: '#831843', border: '1px solid #fecdd3' },
  'dia-padre-madre': { bg: '#EEF2FF', buttonBg: '#312E81', buttonText: '#ffffff', text: '#312E81', border: '1px solid #c7d2fe' },
  'liquidacion': { bg: '#FEF2F2', buttonBg: '#FBBF24', buttonText: '#7F1D1D', text: '#7F1D1D', border: '1px solid #fecaca' },
};

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const IconSparkles = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4M3 5h4"/>
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

function parseCfg(raw: Record<string, unknown> | undefined): CfgComplementarios {
  if (!raw) return { ...DEF };
  return {
    title: raw.title !== undefined ? String(raw.title) : DEF.title,
    subtitle: raw.subtitle !== undefined ? String(raw.subtitle) : DEF.subtitle,
    aiAutocomplete: typeof raw.aiAutocomplete === 'boolean' ? raw.aiAutocomplete : DEF.aiAutocomplete,
    manualUrls: raw.manualUrls !== undefined ? String(raw.manualUrls) : DEF.manualUrls,
    maxProducts: typeof raw.maxProducts === 'number' ? raw.maxProducts : DEF.maxProducts,
    showDiscountBadge: typeof raw.showDiscountBadge === 'boolean' ? raw.showDiscountBadge : DEF.showDiscountBadge,
    discountText: raw.discountText !== undefined ? String(raw.discountText) : DEF.discountText,
    inProductBanner: typeof raw.inProductBanner === 'boolean' ? raw.inProductBanner : DEF.inProductBanner,
    inCartDrawer: typeof raw.inCartDrawer === 'boolean' ? raw.inCartDrawer : DEF.inCartDrawer,
    openCartOnAdd: typeof raw.openCartOnAdd === 'boolean' ? raw.openCartOnAdd : DEF.openCartOnAdd,
    position: (raw.position as CfgComplementarios['position']) || DEF.position,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    buttonBg: (raw.buttonBg as string) || DEF.buttonBg,
    buttonText: (raw.buttonText as string) || DEF.buttonText,
    textColor: (raw.textColor as string) || DEF.textColor,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function ProductosComplementariosEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: ProductosComplementariosEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<CfgComplementarios>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'ubicacion' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof CfgComplementarios>(k: K, v: CfgComplementarios[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (key: keyof CfgComplementarios, val: string) => {
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
        bgColor: DEF.bgColor,
        buttonBg: DEF.buttonBg,
        buttonText: DEF.buttonText,
        textColor: DEF.textColor,
      }));
      return;
    }
    const p = THEME_FX[slug];
    if (p) {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        buttonBg: p.buttonBg,
        buttonText: p.buttonText,
        textColor: p.text,
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

  const getPreviewStyles = () => {
    const theme = cfg.campaignTheme && cfg.campaignTheme !== 'none' ? THEME_FX[cfg.campaignTheme] : null;
    let bg = cfg.bgColor;
    let btnBg = cfg.buttonBg;
    let btnTx = cfg.buttonText;
    let text = cfg.textColor;
    let border = '1px solid #e5e7eb';

    if (theme) {
      bg = theme.bg;
      btnBg = theme.buttonBg;
      btnTx = theme.buttonText;
      text = theme.text;
      border = theme.border;
    }

    return { bg, btnBg, btnTx, text, border };
  };

  const ps = getPreviewStyles();

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo oscuro con botón dorado.' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Nocturno con botón rojo fuego.' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul cibernético profundo con detalles vivos.' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con rojo navideño.' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Fondo suave con botón rojo pasión.' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Fondo índigo claro con botón profundo.' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Tonos cálidos de urgencia con botón ámbar.' },
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
              VISTA PREVIA EN VIVO
            </div>

            <div
              style={{
                background: ps.bg,
                border: ps.border,
                borderRadius: 16,
                padding: '20px',
                color: ps.text,
                transition: 'all 0.3s ease',
              }}
            >
              {cfg.title && (
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: cfg.subtitle ? 4 : 16 }}>
                  {cfg.title}
                </div>
              )}
              {cfg.subtitle && (
                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
                  {cfg.subtitle}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from({ length: cfg.maxProducts }).map((_, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(156,163,175,0.2)',
                    borderRadius: 12, padding: '10px 12px'
                  }}>
                    {/* Dummy Image */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 8, background: 'rgba(156,163,175,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" opacity="0.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Producto sugerido {i + 1}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 800 }}>$15.500</span>
                        <span style={{ fontSize: 11, textDecoration: 'line-through', opacity: 0.5 }}>$20.000</span>
                      </div>
                      {cfg.showDiscountBadge && (
                        <div style={{ marginTop: 4 }}>
                          <span style={{
                            background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)',
                            fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4
                          }}>
                            {cfg.discountText}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Add Button */}
                    <div style={{
                      background: ps.btnBg, color: ps.btnTx,
                      padding: '8px 16px', borderRadius: 999,
                      fontSize: 12, fontWeight: 800, cursor: 'pointer', flexShrink: 0
                    }}>
                      Agregar
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cartel Informativo */}
          <div style={{
            background: '#fff7ed', border: '1px solid #fdba74',
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 20, flexShrink: 0 }}>⚠️</div>
            <span style={{ fontSize: 13, color: '#9a3412', lineHeight: 1.5, fontWeight: 500 }}>
              <strong>IMPORTANTE:</strong> Según las políticas de Tiendanube, no es posible aplicar descuentos con precios personalizados directamente por código. Si ofrecés un descuento visual acá, asegurate de tener una <strong>Promoción Automática</strong> configurada en tu panel de Tiendanube (ej: 2x1, o % OFF llevando X) para que el descuento se aplique realmente en el checkout.
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
                  <FieldLabel>Título (opcional)</FieldLabel>
                  <TextInput
                    value={cfg.title}
                    onChange={(v) => set('title', v)}
                    placeholder="También te puede interesar"
                  />
                  <FieldHelper>Dejá vacío para no mostrar título.</FieldHelper>
                </div>
                <div>
                  <FieldLabel>Subtítulo (opcional)</FieldLabel>
                  <TextInput
                    value={cfg.subtitle}
                    onChange={(v) => set('subtitle', v)}
                    placeholder="Llevá este combo con descuento"
                  />
                </div>
              </div>

              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <FieldLabel>Agrega productos complementarios</FieldLabel>
                
                <div style={{
                  background: cfg.aiAutocomplete ? '#eff6ff' : '#ffffff',
                  border: cfg.aiAutocomplete ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                  borderRadius: 10, padding: 16, marginTop: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'all 0.2s'
                }} onClick={() => set('aiAutocomplete', !cfg.aiAutocomplete)}>
                  <div style={{ marginTop: 2 }}>
                    <input type="checkbox" checked={cfg.aiAutocomplete} readOnly className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 6 }}>
                      Autocompletar productos
                    </div>
                    <div style={{ fontSize: 13, color: '#3b82f6', marginTop: 4, lineHeight: 1.4 }}>
                      <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconSparkles/> Nevux AI</strong> elige automáticamente los productos relacionados por vos buscando en tu tienda.
                    </div>
                  </div>
                </div>

                {!cfg.aiAutocomplete && (
                  <div style={{ marginTop: 16, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                    <FieldLabel>URLs de los Productos</FieldLabel>
                    <textarea
                      value={cfg.manualUrls}
                      onChange={(e) => set('manualUrls', e.target.value)}
                      placeholder="https://mitienda.com/productos/remera/&#10;https://mitienda.com/productos/pantalon/"
                      style={{
                        width: '100%', minHeight: 100, padding: '12px', fontSize: 13,
                        border: '1.5px solid #e5e7eb', borderRadius: 8,
                        background: '#f9fafb', color: '#000000', outline: 'none',
                        fontFamily: 'monospace', resize: 'vertical'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
                      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                    />
                    <FieldHelper>Pegá la URL completa de cada producto que quieras sugerir (una por línea).</FieldHelper>
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Cantidad de productos a mostrar</FieldLabel>
                <select
                  value={cfg.maxProducts}
                  onChange={(e) => set('maxProducts', parseInt(e.target.value))}
                  style={{
                    width: '100%', padding: '12px 14px', fontSize: 14,
                    border: '1.5px solid #e5e7eb', borderRadius: 10,
                    background: '#ffffff', color: '#000000', outline: 'none'
                  }}
                >
                  <option value={1}>1 producto</option>
                  <option value={2}>2 productos</option>
                  <option value={3}>3 productos</option>
                  <option value={4}>4 productos</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>🏷️ Etiqueta de Descuento</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Incentiva la compra cruzada con un texto llamativo.</div>
                  </div>
                  <ToggleSwitch checked={cfg.showDiscountBadge} onChange={(v) => set('showDiscountBadge', v)} />
                </div>
                {cfg.showDiscountBadge && (
                  <TextInput
                    value={cfg.discountText}
                    onChange={(v) => set('discountText', v)}
                    placeholder="-15% EXTRA"
                  />
                )}
              </div>

            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <ToggleSwitch checked={cfg.inProductBanner} onChange={(v) => set('inProductBanner', v)} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Mostrar en la ficha de producto</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>El widget sugerirá productos complementarios en la página de cada producto.</div>
                  
                  {cfg.inProductBanner && (
                    <div style={{ marginTop: 16 }}>
                      <FieldLabel>Posición en la ficha de producto</FieldLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        {[
                          { id: 'before_desc', label: 'Antes de la descripción', desc: 'Debajo del botón "Agregar al carrito".' },
                          { id: 'after_desc', label: 'Después de la descripción', desc: 'Al final de toda la información del producto.' },
                          { id: 'before_cart', label: 'Antes del botón Agregar', desc: 'Justo encima del botón de compra.' }
                        ].map(pos => (
                          <label key={pos.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                            <input type="radio" name="position" value={pos.id} checked={cfg.position === pos.id} onChange={() => set('position', pos.id as any)} className="w-4 h-4 text-[#10B981] focus:ring-[#10B981]" />
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block' }}>{pos.label}</span>
                              <span style={{ fontSize: 11, color: '#6b7280' }}>{pos.desc}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <ToggleSwitch checked={cfg.inCartDrawer} onChange={(v) => set('inCartDrawer', v)} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Mostrar en el carrito de compras</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>El widget aparecerá dentro del cajón lateral del carrito antes del checkout.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <ToggleSwitch checked={cfg.openCartOnAdd} onChange={(v) => set('openCartOnAdd', v)} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Abrir carrito luego de añadir un producto</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Si está activado, al tocar "Agregar" en un producto sugerido, se abrirá el carrito automáticamente.</div>
                </div>
              </div>

            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Fondo del Widget</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Texto principal</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                </div>
                <div>
                  <FieldLabel>Fondo botón &quot;Agregar&quot;</FieldLabel>
                  <ColorPickerField value={cfg.buttonBg} onChange={(v) => setCustomColor('buttonBg', v)} />
                </div>
                <div>
                  <FieldLabel>Texto botón &quot;Agregar&quot;</FieldLabel>
                  <ColorPickerField value={cfg.buttonText} onChange={(v) => setCustomColor('buttonText', v)} />
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
                  Elegí una campaña: los colores del bloque y del botón se adaptarán al evento.
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

        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
  }
