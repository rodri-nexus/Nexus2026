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
  floatingPosition: 'bottom-right' | 'bottom-left' | 'mid-right' | 'mid-left' | 'top-right' | 'top-left';
  accentColor: string;
  bgColor: string;
  hasShadow: boolean;
  borderRadius: number;
  floatingButtonSize: number;
  floatingIconSize: number;
  showAddToCart: boolean;
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
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: CfgFavoritos = {
  iconType: 'heart',
  modalTitle: 'Mis Favoritos',
  showInGrids: true,
  badgePositionImage: 'top-right',
  floatingPosition: 'bottom-right',
  accentColor: '#10B981',
  bgColor: '#ffffff',
  hasShadow: true,
  borderRadius: 12,
  floatingButtonSize: 50,
  floatingIconSize: 22,
  showAddToCart: true,
};

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES E ICONOS SVG
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const IconHeart = ({ filled = false, size = 20, color = 'currentColor' }: { filled?: boolean; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconStar = ({ filled = false, size = 20, color = 'currentColor' }: { filled?: boolean; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconBookmark = ({ filled = false, size = 20, color = 'currentColor' }: { filled?: boolean; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const FavIcon = ({ type, filled = false, size = 20, color = 'currentColor' }: { type: string; filled?: boolean; size?: number; color?: string }) => {
  if (type === 'star') return <IconStar filled={filled} size={size} color={color} />;
  if (type === 'bookmark') return <IconBookmark filled={filled} size={size} color={color} />;
  return <IconHeart filled={filled} size={size} color={color} />;
};

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

function parseCfg(raw: Record<string, unknown> | undefined): CfgFavoritos {
  if (!raw) return { ...DEF };
  return {
    iconType: (raw.iconType as CfgFavoritos['iconType']) || DEF.iconType,
    modalTitle: raw.modalTitle !== undefined ? String(raw.modalTitle) : DEF.modalTitle,
    showInGrids: typeof raw.showInGrids === 'boolean' ? raw.showInGrids : DEF.showInGrids,
    badgePositionImage: (raw.badgePositionImage as CfgFavoritos['badgePositionImage']) || DEF.badgePositionImage,
    floatingPosition: (raw.floatingPosition as CfgFavoritos['floatingPosition']) || DEF.floatingPosition,
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    hasShadow: typeof raw.hasShadow === 'boolean' ? raw.hasShadow : DEF.hasShadow,
    borderRadius: typeof raw.borderRadius === 'number' ? raw.borderRadius : DEF.borderRadius,
    floatingButtonSize: typeof raw.floatingButtonSize === 'number' ? raw.floatingButtonSize : DEF.floatingButtonSize,
    floatingIconSize: typeof raw.floatingIconSize === 'number' ? raw.floatingIconSize : DEF.floatingIconSize,
    showAddToCart: typeof raw.showAddToCart === 'boolean' ? raw.showAddToCart : DEF.showAddToCart,
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
  const [tab, setTab] = useState<'gen' | 'ubicacion' | 'style'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof CfgFavoritos>(k: K, v: CfgFavoritos[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (onSave) {
      onSave(cfg);
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
        config: cfg,
        target_type: targetType,
        target_product_id: productId ?? null,
        target_category_id: categoryId ?? null,
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

  // Posicionamiento de la insignia sobre la imagen preview
  const getBadgePositionStyle = () => {
    switch (cfg.badgePositionImage) {
      case 'top-left': return { top: 12, left: 12 };
      case 'bottom-left': return { bottom: 12, left: 12 };
      case 'bottom-right': return { bottom: 12, right: 12 };
      default: return { top: 12, right: 12 };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

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

          {/* PREVIEW EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              VISTA PREVIA EN VIVO (Simulación en tienda)
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
              background: '#f3f4f6', padding: 16, borderRadius: 16, border: '1px solid #e5e7eb'
            }}>
              {/* Card 1: Botón en la foto del producto */}
              <div style={{
                background: '#ffffff', borderRadius: 12, padding: 12,
                position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  height: 140, background: '#e2e8f0', borderRadius: 8,
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Imagen Producto</span>
                  
                  {/* Botón Favorito sobre Imagen */}
                  <div style={{
                    position: 'absolute', ...getBadgePositionStyle(),
                    width: 34, height: 34, borderRadius: '50%',
                    background: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <FavIcon type={cfg.iconType} filled={true} size={18} color={cfg.accentColor} />
                  </div>
                </div>
                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#111827' }}>Zapatillas Urbanas</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: cfg.accentColor, marginTop: 2 }}>$ 45.990</div>
              </div>

              {/* Card 2: Modal Flotante de Favoritos */}
              <div style={{
                background: cfg.bgColor,
                borderRadius: cfg.borderRadius,
                padding: 14,
                boxShadow: cfg.hasShadow ? '0 10px 25px rgba(0,0,0,0.15)' : 'none',
                border: '1px solid #e5e7eb',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FavIcon type={cfg.iconType} filled={true} size={16} color={cfg.accentColor} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>{cfg.modalTitle}</span>
                    </div>
                    <span style={{
                      background: cfg.accentColor, color: '#ffffff',
                      fontSize: 10, fontWeight: 900, borderRadius: 999,
                      padding: '2px 7px'
                    }}>
                      1
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f9fafb', padding: 8, borderRadius: 8 }}>
                    <div style={{ width: 36, height: 36, background: '#cbd5e1', borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Zapatillas Urbanas</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: cfg.accentColor }}>$ 45.990</div>
                    </div>
                  </div>
                </div>

                {cfg.showAddToCart && (
                  <button type="button" style={{
                    marginTop: 12, width: '100%', padding: '8px',
                    background: cfg.accentColor, color: '#ffffff',
                    border: 'none', borderRadius: Math.max(6, cfg.borderRadius - 4),
                    fontSize: 11, fontWeight: 800, cursor: 'pointer'
                  }}>
                    Agregar al carrito 🛒
                  </button>
                )}
              </div>
            </div>
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

              <div>
                <FieldLabel>Tipo de Ícono</FieldLabel>
                <FieldHelper>Elegí la forma del ícono con el que tus clientes marcarán sus productos favoritos.</FieldHelper>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
                  {[
                    { id: 'heart', label: 'Corazón' },
                    { id: 'star', label: 'Estrella' },
                    { id: 'bookmark', label: 'Marcador' },
                  ].map((ico) => {
                    const isSelected = cfg.iconType === ico.id;
                    return (
                      <div
                        key={ico.id}
                        onClick={() => set('iconType', ico.id as any)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                          padding: '16px 12px', borderRadius: 12,
                          border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: isSelected ? '#ECFDF5' : '#ffffff',
                          cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                      >
                        <FavIcon type={ico.id} filled={isSelected} size={26} color={isSelected ? '#10B981' : '#4b5563'} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{ico.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <FieldLabel>Título de la Lista de Favoritos</FieldLabel>
                <TextInput
                  value={cfg.modalTitle}
                  onChange={(v) => set('modalTitle', v)}
                  placeholder="Mis Favoritos"
                />
                <FieldHelper>Encabezado del panel donde los clientes ven sus productos guardados.</FieldHelper>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Mostrar en grilla de productos</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Muestra el ícono de favoritos en los listados del catálogo de la tienda.</div>
                  </div>
                  <ToggleSwitch checked={cfg.showInGrids} onChange={(v) => set('showInGrids', v)} />
                </div>
              </div>

            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              <div>
                <FieldLabel>Posición en las imágenes de productos</FieldLabel>
                <FieldHelper>Elegí la esquina de las imágenes donde aparecerá el botón para agregar a favoritos.</FieldHelper>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                  {[
                    { id: 'top-right', label: 'Superior Derecha ↗' },
                    { id: 'top-left', label: 'Superior Izquierda ↖' },
                    { id: 'bottom-right', label: 'Inferior Derecha ↘' },
                    { id: 'bottom-left', label: 'Inferior Izquierda ↙' },
                  ].map((pos) => (
                    <div
                      key={pos.id}
                      onClick={() => set('badgePositionImage', pos.id as any)}
                      style={{
                        padding: '14px', borderRadius: 10,
                        border: cfg.badgePositionImage === pos.id ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                        background: cfg.badgePositionImage === pos.id ? '#ECFDF5' : '#ffffff',
                        cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#111827',
                        textAlign: 'center'
                      }}
                    >
                      {pos.label}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <FieldLabel>Posición del Botón Flotante Global</FieldLabel>
                <FieldHelper>Lugar fijado en la pantalla donde el cliente puede hacer clic para ver su lista de guardados.</FieldHelper>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
                  {[
                    { id: 'bottom-right', label: 'Abajo Derecha' },
                    { id: 'bottom-left', label: 'Abajo Izquierda' },
                    { id: 'mid-right', label: 'Medio Derecha' },
                    { id: 'mid-left', label: 'Medio Izquierda' },
                    { id: 'top-right', label: 'Arriba Derecha' },
                    { id: 'top-left', label: 'Arriba Izquierda' },
                  ].map((pos) => (
                    <div
                      key={pos.id}
                      onClick={() => set('floatingPosition', pos.id as any)}
                      style={{
                        padding: '12px 8px', borderRadius: 10,
                        border: cfg.floatingPosition === pos.id ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                        background: cfg.floatingPosition === pos.id ? '#ECFDF5' : '#ffffff',
                        cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#111827',
                        textAlign: 'center'
                      }}
                    >
                      {pos.label}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Color Principial / Acento</FieldLabel>
                  <ColorPickerField value={cfg.accentColor} onChange={(v) => set('accentColor', v)} />
                  <FieldHelper>Color del icono activo y botones principales.</FieldHelper>
                </div>
                <div>
                  <FieldLabel>Fondo del Panel</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => set('bgColor', v)} />
                  <FieldHelper>Color de fondo del panel de favoritos.</FieldHelper>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <FieldLabel>Redondeo de Bordes (px)</FieldLabel>
                    <input
                      type="range"
                      min="0"
                      max="28"
                      value={cfg.borderRadius}
                      onChange={(e) => set('borderRadius', Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#10B981' }}
                    />
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginTop: 4 }}>
                      {cfg.borderRadius}px
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Tamaño del Botón Flotante (px)</FieldLabel>
                    <input
                      type="range"
                      min="36"
                      max="64"
                      value={cfg.floatingButtonSize}
                      onChange={(e) => set('floatingButtonSize', Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#10B981' }}
                    />
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginTop: 4 }}>
                      {cfg.floatingButtonSize}px
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Sombra en Panel Flotante</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Añade una sombra suave para destacar la ventana.</div>
                  </div>
                  <ToggleSwitch checked={cfg.hasShadow} onChange={(v) => set('hasShadow', v)} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Botón "Agregar al carrito" en la lista</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Permite al cliente comprar directamente desde su lista de favoritos.</div>
                  </div>
                  <ToggleSwitch checked={cfg.showAddToCart} onChange={(v) => set('showAddToCart', v)} />
                </div>
              </div>

            </div>
          )}

          {/* MENSAJES DE ESTADO */}
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

          {/* BOTÓN AL FINAL DEL BLOQUE */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={save}
              disabled={saving || isSaving}
              style={{
                padding: '14px 40px', borderRadius: 999,
                border: 'none',
                background: (saving || isSaving) ? '#9ca3af' : '#10B981',
                color: '#fff', fontSize: 15, fontWeight: 800,
                cursor: (saving || isSaving) ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              {(saving || isSaving) ? 'Guardando...' : ew ? 'Actualizar Widget' : 'Crear Widget'}
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
