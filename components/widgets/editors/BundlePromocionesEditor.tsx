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

interface BundlePromocionesEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

interface BundleOption {
  id: string;
  title: string;
  badge: string;
  oldPrice: string;
  newPrice: string;
  enabled: boolean;
}

interface Cfg {
  title: string;
  subtitle: string;
  location: 'title_after' | 'price_after' | 'product_before' | 'product_after';
  bundles: BundleOption[];
  bgColor: string;
  textColor: string;
  cardBgColor: string;
  accentColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonText: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEFAULT_BUNDLES: BundleOption[] = [
  { id: '1', title: 'Lleva 2 paga 1', badge: '-50% OFF', oldPrice: '', newPrice: '', enabled: true },
  { id: '2', title: 'Lleva 3 paga 2', badge: '-33% OFF', oldPrice: '', newPrice: '', enabled: true },
  { id: '3', title: 'Lleva 4 paga 2', badge: '-50% OFF', oldPrice: '', newPrice: '', enabled: false },
  { id: '4', title: 'Lleva 4 paga 3', badge: '-25% OFF', oldPrice: '', newPrice: '', enabled: false },
];

const DEF: Cfg = {
  title: 'Elegí tu pack en promo',
  subtitle: 'Llevate más unidades con descuento exclusivo',
  location: 'product_after',
  bundles: DEFAULT_BUNDLES,
  bgColor: '#ffffff',
  textColor: '#111827',
  cardBgColor: '#f9fafb',
  accentColor: '#10B981',
  buttonBgColor: '#10B981',
  buttonTextColor: '#ffffff',
  buttonText: 'Sumalo al carrito',
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
   COMPONENTES AUXILIARES (Regla #9)
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
  value, onChange, placeholder, maxLength, type = 'text',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
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
  if (!raw) return { ...DEF, bundles: [...DEFAULT_BUNDLES] };
  return {
    title: (raw.title as string) || DEF.title,
    subtitle: (raw.subtitle as string) || DEF.subtitle,
    location: (raw.location as Cfg['location']) || DEF.location,
    bundles: Array.isArray(raw.bundles) && raw.bundles.length > 0 ? (raw.bundles as BundleOption[]) : DEFAULT_BUNDLES,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    cardBgColor: (raw.cardBgColor as string) || DEF.cardBgColor,
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    buttonBgColor: (raw.buttonBgColor as string) || DEF.buttonBgColor,
    buttonTextColor: (raw.buttonTextColor as string) || DEF.buttonTextColor,
    buttonText: (raw.buttonText as string) || DEF.buttonText,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BundlePromocionesEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: BundlePromocionesEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [selectedBundleId, setSelectedBundleId] = useState<string>('1');

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
    key: 'bgColor' | 'textColor' | 'cardBgColor' | 'accentColor' | 'buttonBgColor',
    val: string
  ) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const toggleBundle = (index: number) => {
    setCfg((prev) => {
      const updated = [...prev.bundles];
      updated[index] = { ...updated[index], enabled: !updated[index].enabled };
      return { ...prev, bundles: updated };
    });
  };

  const updateBundle = (index: number, field: keyof BundleOption, value: string) => {
    setCfg((prev) => {
      const updated = [...prev.bundles];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, bundles: updated };
    });
  };

  const applyCampaignPreset = (slug: string) => {
    const CAMPAIGN_DATA: Record<string, { bg: string; tx: string; card: string; accent: string; btn: string }> = {
      'black-friday': { bg: '#111827', tx: '#ffffff', card: '#1f2937', accent: '#F59E0B', btn: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', card: '#1e293b', accent: '#EF4444', btn: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', card: '#111827', accent: '#3B82F6', btn: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', card: '#047857', accent: '#EF4444', btn: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', card: '#9d174d', accent: '#F43F5E', btn: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', card: '#3730a3', accent: '#10B981', btn: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', card: '#991b1b', accent: '#FBBF24', btn: '#FBBF24' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        textColor: DEF.textColor,
        cardBgColor: DEF.cardBgColor,
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
        cardBgColor: p.card,
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

  const activeBundles = cfg.bundles.filter((b) => b.enabled);

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

          {/* PREVIEW EN VIVO */}
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
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: cfg.textColor }}>
                  {cfg.title}
                </div>
                {cfg.subtitle ? (
                  <div style={{ fontSize: 12, color: cfg.textColor, opacity: 0.7, marginTop: 2 }}>
                    {cfg.subtitle}
                  </div>
                ) : null}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeBundles.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#ef4444', fontStyle: 'italic', padding: 10 }}>
                    ⚠️ Activá al menos 1 promo en la pestaña &quot;Promos & Bundles&quot;.
                  </div>
                ) : (
                  activeBundles.map((b) => {
                    const isSelected = selectedBundleId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBundleId(b.id)}
                        style={{
                          background: isSelected ? '#ffffff' : cfg.cardBgColor,
                          border: isSelected ? `2px solid ${cfg.accentColor}` : '1.5px solid rgba(0,0,0,0.08)',
                          borderRadius: 12,
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            border: `2px solid ${isSelected ? cfg.accentColor : '#d1d5db'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {isSelected ? (
                              <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.accentColor }} />
                            ) : null}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: cfg.textColor, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {b.title}
                            {b.badge ? (
                              <span style={{
                                background: '#fef2f2', color: '#ef4444',
                                borderRadius: 6, padding: '2px 6px', fontSize: 10, fontWeight: 800,
                              }}>
                                {b.badge}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {b.oldPrice ? (
                            <div style={{ fontSize: 11, textDecoration: 'line-through', opacity: 0.5, color: cfg.textColor }}>
                              {b.oldPrice}
                            </div>
                          ) : (
                            <div style={{ fontSize: 10, opacity: 0.5, color: cfg.textColor }}>
                              Auto en tienda
                            </div>
                          )}
                          <div style={{ fontSize: 14, fontWeight: 900, color: cfg.accentColor }}>
                            {b.newPrice || 'Se calcula solo'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  background: cfg.buttonBgColor,
                  color: cfg.buttonTextColor,
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {cfg.buttonText}
              </button>
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
              Mostrá packs 2x1, 3x2 y más. En la tienda los precios se calculan solos con el precio del producto. El botón agrega la cantidad del pack al carrito. El descuento real se configura en Tiendanube → Descuentos.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', '📦 Promos & Bundles'],
                ['style', '🎨 Diseño & Estilo'],
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

          {/* TAB PROMOS */}
          {tab === 'gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Título del bloque</FieldLabel>
                <TextInput
                  value={cfg.title}
                  onChange={(v) => set('title', v)}
                  placeholder="Elegí tu pack en promo"
                />
              </div>

              <div>
                <FieldLabel>Subtítulo opcional</FieldLabel>
                <TextInput
                  value={cfg.subtitle}
                  onChange={(v) => set('subtitle', v)}
                  placeholder="Llevate más unidades con descuento exclusivo"
                />
              </div>

              <div>
                <FieldLabel>Promociones disponibles</FieldLabel>
                <FieldHelper>
                  Activá las ofertas. En la tienda, precio tachado, precio promo y % OFF se calculan solos con el precio del producto (no hace falta cargar montos a mano).
                </FieldHelper>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  {cfg.bundles.map((b, idx) => (
                    <div
                      key={b.id || idx}
                      style={{
                        background: '#f9fafb',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 12,
                        padding: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <ToggleField
                        checked={b.enabled}
                        onChange={() => toggleBundle(idx)}
                        label={b.title}
                      />

                      {b.enabled ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                          <div>
                            <FieldLabel>Texto de la promo (ej: Lleva 2 paga 1)</FieldLabel>
                            <TextInput
                              value={b.title}
                              onChange={(v) => updateBundle(idx, 'title', v)}
                              placeholder="Lleva 2 paga 1"
                            />
                          </div>
                          <div>
                            <FieldLabel>Etiqueta opcional (si dejás vacío, se calcula el % en tienda)</FieldLabel>
                            <TextInput
                              value={b.badge}
                              onChange={(v) => updateBundle(idx, 'badge', v)}
                              placeholder="-50% OFF"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB DISEÑO */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Texto del Botón Principal</FieldLabel>
                <TextInput
                  value={cfg.buttonText}
                  onChange={(v) => set('buttonText', v)}
                  placeholder="Sumalo al carrito"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Fondo del Bloque</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Texto</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                </div>
                <div>
                  <FieldLabel>Fondo de las Tarjetas</FieldLabel>
                  <ColorPickerField value={cfg.cardBgColor} onChange={(v) => setCustomColor('cardBgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Acento / Selección</FieldLabel>
                  <ColorPickerField value={cfg.accentColor} onChange={(v) => setCustomColor('accentColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color del Botón</FieldLabel>
                  <ColorPickerField value={cfg.buttonBgColor} onChange={(v) => setCustomColor('buttonBgColor', v)} />
                </div>
              </div>

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
                        onClick={() => set('location', loc.id as Cfg['location'])}
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
                  Elegí una campaña para adaptar colores. Si editás un color a mano, se desactiva el preset.
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
                          {isSelected ? (
                            <span style={{
                              background: '#ecfdf5', color: '#10B981', fontSize: 11, fontWeight: 800,
                              padding: '2px 8px', borderRadius: 999, border: '1px solid #10B981',
                            }}>
                              ACTIVO
                            </span>
                          ) : null}
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
            {ok ? (
              <div style={{
                background: '#ecfdf5', border: '1px solid #10B981',
                borderRadius: 10, padding: '10px 16px',
                fontSize: 13, fontWeight: 700, color: '#059669',
              }}>
                ✅ Widget guardado correctamente
              </div>
            ) : null}
            {err ? (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: 10, padding: '10px 16px',
                fontSize: 13, fontWeight: 700, color: '#dc2626',
              }}>
                ❌ {err}
              </div>
            ) : null}
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
