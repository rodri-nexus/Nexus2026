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

export interface CfgFavoritos {
  iconType: 'heart' | 'star' | 'bookmark';
  modalTitle: string;
  showInGrids: boolean;
  badgePositionImage: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  floatingPosition: 'bottom-right';
  accentColor: string;
  bgColor: string;
  hasShadow: boolean;
  borderRadius: '50%' | '8px' | '0px';
  floatingButtonSize: '55px' | '45px' | '35px';
  floatingIconSize: '24px' | '20px' | '16px';
  showAddToCart: boolean;
  campaignTheme: string;
}

interface FavoritosEditorProps {
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
const DEF: CfgFavoritos = {
  iconType: 'heart',
  modalTitle: 'Mis favoritos',
  showInGrids: true,
  badgePositionImage: 'top-right',
  floatingPosition: 'bottom-right',
  accentColor: '#e11d48',
  bgColor: '#ffffff',
  hasShadow: true,
  borderRadius: '50%',
  floatingButtonSize: '55px',
  floatingIconSize: '24px',
  showAddToCart: true,
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

function FavIcon({
  type,
  color,
  size = 22,
  filled = false,
}: {
  type: CfgFavoritos['iconType'];
  color: string;
  size?: number;
  filled?: boolean;
}) {
  if (type === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  if (type === 'bookmark') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function parseCfg(raw: Record<string, unknown> | undefined): CfgFavoritos {
  if (!raw) return { ...DEF };
  return {
    iconType: (raw.iconType as CfgFavoritos['iconType']) || DEF.iconType,
    modalTitle: raw.modalTitle !== undefined ? String(raw.modalTitle) : DEF.modalTitle,
    showInGrids: typeof raw.showInGrids === 'boolean' ? raw.showInGrids : DEF.showInGrids,
    badgePositionImage: (raw.badgePositionImage as CfgFavoritos['badgePositionImage']) || DEF.badgePositionImage,
    floatingPosition: 'bottom-right',
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    hasShadow: typeof raw.hasShadow === 'boolean' ? raw.hasShadow : DEF.hasShadow,
    borderRadius: (raw.borderRadius as CfgFavoritos['borderRadius']) || DEF.borderRadius,
    floatingButtonSize: (raw.floatingButtonSize as CfgFavoritos['floatingButtonSize']) || DEF.floatingButtonSize,
    floatingIconSize: (raw.floatingIconSize as CfgFavoritos['floatingIconSize']) || DEF.floatingIconSize,
    showAddToCart: typeof raw.showAddToCart === 'boolean' ? raw.showAddToCart : DEF.showAddToCart,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function FavoritosEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
  initialConfig,
  onSave,
  isSaving,
}: FavoritosEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<CfgFavoritos>(() => parseCfg(ew?.config || initialConfig));
  const [isActive, setIsActive] = useState(ew?.is_active !== false);
  const [tab, setTab] = useState<'gen' | 'ubicacion' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg, isActive]);

  const set = <K extends keyof CfgFavoritos>(k: K, v: CfgFavoritos[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (key: 'accentColor' | 'bgColor', val: string) => {
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
        accentColor: DEF.accentColor,
        bgColor: DEF.bgColor,
      }));
      return;
    }
    const p = THEME_FX[slug];
    if (p) {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        accentColor: p.accent,
        bgColor: p.bg,
      }));
    }
  };

  const save = async () => {
    const finalCfg = { ...cfg, floatingPosition: 'bottom-right' as const };

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

  const getPreviewStyles = () => {
    const theme = cfg.campaignTheme && cfg.campaignTheme !== 'none' ? THEME_FX[cfg.campaignTheme] : null;
    let accent = cfg.accentColor;
    let bg = cfg.bgColor;
    if (theme) {
      accent = theme.accent;
      bg = theme.bg === '#111827' || theme.bg === '#0F172A' || theme.bg === '#090D16' || theme.bg === '#064E3B'
        ? '#ffffff'
        : theme.bg;
    }
    return { accent, bg };
  };

  const ps = getPreviewStyles();

  const badgePosStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', zIndex: 2 };
    switch (cfg.badgePositionImage) {
      case 'top-left':
        return { ...base, top: 10, left: 10 };
      case 'bottom-right':
        return { ...base, bottom: 10, right: 10 };
      case 'bottom-left':
        return { ...base, bottom: 10, left: 10 };
      default:
        return { ...base, top: 10, right: 10 };
    }
  };

  const fabSize = parseInt(cfg.floatingButtonSize, 10) || 55;
  const iconSize = parseInt(cfg.floatingIconSize, 10) || 24;

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
                position: 'relative',
                minHeight: 320,
              }}
            >
              {/* Imagen producto + badge */}
              <div
                style={{
                  background: '#e5e7eb',
                  borderRadius: 12,
                  height: 220,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600 }}>Imagen del producto</div>
                </div>

                {/* Badge sobre imagen (configurable) */}
                <button
                  type="button"
                  style={{
                    ...badgePosStyle(),
                    width: 36,
                    height: 36,
                    borderRadius: cfg.borderRadius,
                    background: ps.bg,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: cfg.hasShadow ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    cursor: 'default',
                  }}
                >
                  <FavIcon type={cfg.iconType} color={ps.accent} size={18} />
                </button>
              </div>

              {/* FAB flotante FIJO abajo-derecha */}
              <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 3 }}>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    style={{
                      width: fabSize,
                      height: fabSize,
                      borderRadius: cfg.borderRadius,
                      background: ps.bg,
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: cfg.hasShadow ? '0 8px 24px rgba(0,0,0,0.18)' : '0 1px 3px rgba(0,0,0,0.08)',
                      cursor: 'default',
                    }}
                  >
                    <FavIcon type={cfg.iconType} color={ps.accent} size={iconSize} />
                  </button>
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      minWidth: 20,
                      height: 20,
                      borderRadius: 999,
                      background: ps.accent,
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px',
                      border: '2px solid #fff',
                    }}
                  >
                    3
                  </span>
                </div>
              </div>

              {/* Mini panel preview */}
              <div
                style={{
                  marginTop: 14,
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '12px 14px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
                    {cfg.modalTitle || 'Mis favoritos'} (3)
                  </div>
                  <FavIcon type={cfg.iconType} color={ps.accent} size={16} filled />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: '#e5e7eb' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Producto ejemplo</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>$12.500</div>
                  </div>
                  {cfg.showAddToCart && (
                    <button
                      type="button"
                      style={{
                        background: ps.accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'default',
                      }}
                    >
                      + Carrito
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 10 }}>
                  🔒 Botón flotante fijo: abajo a la derecha
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12, lineHeight: 1.5 }}>
              El botón de favoritos aparece sobre la imagen del producto (podés elegir la esquina). El botón flotante grande queda <strong>siempre fijo en la esquina inferior derecha</strong> para mantener la mejor experiencia de usuario.
            </p>
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
                ['ubicacion', 'Ubicación'],
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
                <FieldLabel>Ícono del botón</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {(
                    [
                      { id: 'heart', label: 'Corazón' },
                      { id: 'star', label: 'Estrella' },
                      { id: 'bookmark', label: 'Marcador' },
                    ] as const
                  ).map((opt) => {
                    const selected = cfg.iconType === opt.id;
                    return (
                      <label
                        key={opt.id}
                        onClick={() => set('iconType', opt.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: selected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: selected ? '#ECFDF5' : '#ffffff',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#111827',
                        }}
                      >
                        <input
                          type="radio"
                          name="iconType"
                          checked={selected}
                          onChange={() => set('iconType', opt.id)}
                          style={{ accentColor: '#10B981' }}
                        />
                        <FavIcon type={opt.id} color={selected ? '#10B981' : '#6b7280'} size={16} />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel>Título del modal</FieldLabel>
                <TextInput
                  value={cfg.modalTitle}
                  onChange={(v) => set('modalTitle', v)}
                  placeholder="Mis favoritos"
                />
                <FieldHelper>Título que aparece en el panel con los productos guardados.</FieldHelper>
              </div>

              <div
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={cfg.showInGrids}
                    onChange={(e) => set('showInGrids', e.target.checked)}
                    style={{ marginTop: 3, width: 18, height: 18, accentColor: '#10B981' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
                      Mostrar botón de favoritos en productos de home y categorías
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 1.45 }}>
                      Inyecta el botón sobre la imagen de cada producto en las grillas de la tienda (home, categorías, productos relacionados).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <FieldLabel>Posición del botón sobre la imagen del producto</FieldLabel>
                <FieldHelper>Esquina donde aparece el corazón pequeño sobre la imagen de cada producto (tanto en ficha como en grillas de home y categorías).</FieldHelper>

                {/* Selector visual 2x2 estilo Wigy */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      border: '1.5px solid #e5e7eb',
                      background: '#f9fafb',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridTemplateRows: '1fr 1fr',
                      gap: 6,
                      padding: 10,
                    }}
                  >
                    {(
                      [
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right',
                      ] as const
                    ).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => set('badgePositionImage', pos)}
                        style={{
                          border: 'none',
                          borderRadius: '50%',
                          background: cfg.badgePositionImage === pos ? '#10B981' : '#d1d5db',
                          cursor: 'pointer',
                          width: '100%',
                          height: '100%',
                        }}
                        aria-label={pos}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                    {cfg.badgePositionImage === 'top-right' && 'Arriba a la derecha'}
                    {cfg.badgePositionImage === 'top-left' && 'Arriba a la izquierda'}
                    {cfg.badgePositionImage === 'bottom-right' && 'Abajo a la derecha'}
                    {cfg.badgePositionImage === 'bottom-left' && 'Abajo a la izquierda'}
                  </div>
                </div>
              </div>

              {/* Nota sobre el FAB fijo */}
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 20, flexShrink: 0 }}>🔒</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
                    Botón flotante fijo (abajo a la derecha)
                  </div>
                  <div style={{ fontSize: 13, color: '#065F46', opacity: 0.85, lineHeight: 1.5 }}>
                    El botón flotante grande con el contador de favoritos siempre aparece en la esquina inferior derecha de la tienda. Esta posición está optimizada para la mejor experiencia móvil y no se puede modificar.
                  </div>
                </div>
              </div>
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
                  🎨 Colores
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
                  Acento del ícono, badge y fondo del botón.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <FieldLabel>Color del ícono / acento</FieldLabel>
                    <ColorPickerField value={cfg.accentColor} onChange={(v) => setCustomColor('accentColor', v)} />
                    <FieldHelper>Corazón/estrella, badge y botones del modal.</FieldHelper>
                  </div>
                  <div>
                    <FieldLabel>Color de fondo del botón</FieldLabel>
                    <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                    <FieldHelper>Fondo del botón de producto y flotante.</FieldHelper>
                  </div>
                </div>
              </div>

              {/* Forma y tamaño */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  ▦ Forma y tamaño
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
                  Sombra, borde y dimensiones del botón flotante.
                </div>

                <div style={{ marginBottom: 16 }}>
                  <FieldLabel>Sombra del botón</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { v: true, label: 'Con sombra' },
                      { v: false, label: 'Sin sombra' },
                    ].map((opt) => {
                      const selected = cfg.hasShadow === opt.v;
                      return (
                        <button
                          key={String(opt.v)}
                          type="button"
                          onClick={() => set('hasShadow', opt.v)}
                          style={{
                            padding: '12px',
                            borderRadius: 10,
                            border: selected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                            background: selected ? '#ECFDF5' : '#ffffff',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            justifyContent: 'center',
                          }}
                        >
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              background: selected ? '#10B981' : '#d1d5db',
                            }}
                          />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <FieldLabel>Borde del botón</FieldLabel>
                  <select
                    value={cfg.borderRadius}
                    onChange={(e) => set('borderRadius', e.target.value as CfgFavoritos['borderRadius'])}
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
                    <option value="50%">Circular (50%)</option>
                    <option value="8px">Redondeado (8px)</option>
                    <option value="0px">Cuadrado (0px)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <FieldLabel>Tamaño del botón flotante</FieldLabel>
                    <select
                      value={cfg.floatingButtonSize}
                      onChange={(e) =>
                        set('floatingButtonSize', e.target.value as CfgFavoritos['floatingButtonSize'])
                      }
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
                      <option value="55px">Grande (55px)</option>
                      <option value="45px">Mediano (45px)</option>
                      <option value="35px">Pequeño (35px)</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Tamaño del ícono flotante</FieldLabel>
                    <select
                      value={cfg.floatingIconSize}
                      onChange={(e) =>
                        set('floatingIconSize', e.target.value as CfgFavoritos['floatingIconSize'])
                      }
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
                      <option value="24px">Grande (24px)</option>
                      <option value="20px">Mediano (20px)</option>
                      <option value="16px">Pequeño (16px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Carrito */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  🛒 Carrito
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
                  Opciones de agregar al carrito desde el panel.
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
                      Mostrar botones de agregar al carrito
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 1.45 }}>
                      Muestra el botón &quot;+&quot; y &quot;Agregar todos&quot; en el panel de favoritos para agregar productos al carrito directamente.
                    </div>
                  </div>
                  <ToggleSwitch checked={cfg.showAddToCart} onChange={(v) => set('showAddToCart', v)} />
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
                  Elegí una campaña: el color de acento y el fondo del botón se adaptan automáticamente al evento.
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
