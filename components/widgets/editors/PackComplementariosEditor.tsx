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

interface PackComplementariosEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface SelectedProductItem {
  id: number | string;
  variantId?: number | string;
  title: string;
  image: string;
  price: number;
  url: string;
}

export interface CfgPackComplementarios {
  title: string;
  subtitle: string;
  selectedProducts: SelectedProductItem[];
  isMainOptional: boolean;
  enableQuantityDiscount: boolean;
  redirectToCart: boolean;
  replaceNativeButton: boolean;
  badgeColor: string;
  promoPriceColor: string;
  itemBgColor: string;
  buttonBg: string;
  buttonText: string;
  textColor: string;
  borderColor: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: CfgPackComplementarios = {
  title: 'Armá tu pack',
  subtitle: 'Seleccioná los complementos',
  selectedProducts: [],
  isMainOptional: false,
  enableQuantityDiscount: false,
  redirectToCart: false,
  replaceNativeButton: false,
  badgeColor: '#10B981',
  promoPriceColor: '#16a34a',
  itemBgColor: '#f7f7f7',
  buttonBg: '#111827',
  buttonText: '#ffffff',
  textColor: '#111827',
  borderColor: '#e5e7eb',
  campaignTheme: 'none',
};

type ThemeFxItem = {
  bg: string;
  buttonBg: string;
  buttonText: string;
  text: string;
  border: string;
};

const THEME_FX: Record<string, ThemeFxItem> = {
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

function parseCfg(raw: Record<string, unknown> | undefined): CfgPackComplementarios {
  if (!raw) return { ...DEF };
  return {
    title: raw.title !== undefined ? String(raw.title) : DEF.title,
    subtitle: raw.subtitle !== undefined ? String(raw.subtitle) : DEF.subtitle,
    selectedProducts: Array.isArray(raw.selectedProducts) ? (raw.selectedProducts as SelectedProductItem[]) : DEF.selectedProducts,
    isMainOptional: typeof raw.isMainOptional === 'boolean' ? raw.isMainOptional : DEF.isMainOptional,
    enableQuantityDiscount: typeof raw.enableQuantityDiscount === 'boolean' ? raw.enableQuantityDiscount : DEF.enableQuantityDiscount,
    redirectToCart: typeof raw.redirectToCart === 'boolean' ? raw.redirectToCart : DEF.redirectToCart,
    replaceNativeButton: typeof raw.replaceNativeButton === 'boolean' ? raw.replaceNativeButton : DEF.replaceNativeButton,
    badgeColor: (raw.badgeColor as string) || DEF.badgeColor,
    promoPriceColor: (raw.promoPriceColor as string) || DEF.promoPriceColor,
    itemBgColor: (raw.itemBgColor as string) || DEF.itemBgColor,
    buttonBg: (raw.buttonBg as string) || DEF.buttonBg,
    buttonText: (raw.buttonText as string) || DEF.buttonText,
    textColor: (raw.textColor as string) || DEF.textColor,
    borderColor: (raw.borderColor as string) || DEF.borderColor,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function PackComplementariosEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: PackComplementariosEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<CfgPackComplementarios>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'ubicacion' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  // Modal de productos reales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof CfgPackComplementarios>(k: K, v: CfgPackComplementarios[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (key: keyof CfgPackComplementarios, val: string) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const openProductSelectorModal = async () => {
    setIsModalOpen(true);
    if (storeProducts.length === 0) {
      setLoadingProducts(true);
      try {
        const res = await fetch(`/api/products?store_id=${storeId}`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.products || []);
          setStoreProducts(items);
        }
      } catch (e) {
        console.error("Error cargando productos", e);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const toggleSelectProduct = (p: any) => {
    const pId = p.id;
    const exists = cfg.selectedProducts.some((item) => String(item.id) === String(pId));

    if (exists) {
      setCfg((prev) => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter((item) => String(item.id) !== String(pId)),
      }));
    } else {
      var variantId = p.variants && p.variants[0] ? p.variants[0].id : p.id;
      var title = typeof p.name === 'object' ? (p.name.es || p.name.pt || p.name.en || 'Producto') : (p.name || 'Producto');
      var price = p.variants && p.variants[0] ? parseFloat(p.variants[0].price) : (parseFloat(p.price) || 0);
      var image = p.images && p.images[0] ? p.images[0].src : '';
      var url = p.url || '#';

      var newItem: SelectedProductItem = {
        id: pId,
        variantId: variantId,
        title: title,
        price: price,
        image: image,
        url: url,
      };

      setCfg((prev) => ({
        ...prev,
        selectedProducts: [...prev.selectedProducts, newItem],
      }));
    }
  };

  const removeSelectedProduct = (pId: string | number) => {
    setCfg((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((item) => String(item.id) !== String(pId)),
    }));
  };

  const applyPreset = (slug: string) => {
    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: 'none',
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
        widget_type: wd.slug,
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

  const formatMoney = (val: number) => '$' + Math.round(val).toLocaleString('es-AR');

  const mainProductPrice = 10549;
  const complementTotal = cfg.selectedProducts.reduce((acc, it) => acc + (it.price || 0), 0);
  const grandTotal = mainProductPrice + complementTotal;

  const filteredModalProducts = storeProducts.filter((p) => {
    const t = typeof p.name === 'object' ? (p.name.es || p.name.pt || '') : (p.name || '');
    return t.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Diseño.' },
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
        ) : isCategory ? (
          <div style={{
            background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D',
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

          {/* PREVIEW GRANDE EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              VISTA PREVIA EN VIVO
            </div>

            <div style={{
              background: '#ffffff',
              border: `1px solid ${cfg.borderColor}`,
              borderRadius: 16,
              padding: 16,
              color: cfg.textColor,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{cfg.title}</div>
                  {cfg.subtitle && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{cfg.subtitle}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: cfg.promoPriceColor }}>
                    {formatMoney(grandTotal)}
                  </div>
                </div>
              </div>

              {/* PRODUCTO PRINCIPAL SIMULADO */}
              <div style={{
                background: cfg.itemBgColor, borderRadius: 10, padding: 10,
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
              }}>
                <input type="checkbox" checked readOnly disabled={!cfg.isMainOptional} style={{ width: 16, height: 16 }} />
                <div style={{
                  width: 42, height: 42, borderRadius: 6, background: '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#6b7280'
                }}>Foto</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>ADAPTADOR INTERNACIONAL UNIVERSAL</div>
                  <div style={{ fontSize: 12, color: cfg.promoPriceColor, fontWeight: 800 }}>{formatMoney(mainProductPrice)}</div>
                </div>
                <span style={{
                  background: cfg.badgeColor, color: '#ffffff',
                  fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4
                }}>INCLUIDO</span>
              </div>

              {/* COMPLEMENTARIOS REALES O DUMMY */}
              {cfg.selectedProducts.length === 0 ? (
                <div style={{
                  background: cfg.itemBgColor, borderRadius: 10, padding: 10,
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, opacity: 0.8
                }}>
                  <input type="checkbox" checked readOnly style={{ width: 16, height: 16 }} />
                  <div style={{
                    width: 42, height: 42, borderRadius: 6, background: '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#6b7280'
                  }}>Demo</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Cable Reforzado USB-C</div>
                    <div style={{ fontSize: 12, color: cfg.promoPriceColor, fontWeight: 800 }}>$3.500</div>
                  </div>
                </div>
              ) : (
                cfg.selectedProducts.map((p) => (
                  <div key={p.id} style={{
                    background: cfg.itemBgColor, borderRadius: 10, padding: 10,
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8
                  }}>
                    <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                    {p.image ? (
                      <img src={p.image} alt={p.title} style={{ width: 42, height: 42, borderRadius: 6, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 42, height: 42, borderRadius: 6, background: '#e5e7eb' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: cfg.promoPriceColor, fontWeight: 800 }}>{formatMoney(p.price)}</div>
                    </div>
                  </div>
                ))
              )}

              {/* BOTÓN "AGREGAR AL CARRITO" */}
              <button style={{
                width: '100%', background: cfg.buttonBg, color: cfg.buttonText,
                border: 'none', borderRadius: 999, padding: '12px',
                fontWeight: 800, fontSize: 14, cursor: 'pointer', marginTop: 8
              }}>
                Agregar al carrito ({cfg.selectedProducts.length + 1})
              </button>
            </div>

            <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
              ℹ️ El formulario original de Tiendanube permanecerá visible y funcional.
            </div>
          </div>

          {/* TABS */}
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
              <div>
                <FieldLabel>Título</FieldLabel>
                <TextInput
                  value={cfg.title}
                  onChange={(v) => set('title', v)}
                  placeholder="Armá tu pack"
                />
              </div>

              <div>
                <FieldLabel>Subtítulo (opcional)</FieldLabel>
                <TextInput
                  value={cfg.subtitle}
                  onChange={(v) => set('subtitle', v)}
                  placeholder="Seleccioná los complementos"
                />
              </div>

              {/* PRODUCTOS COMPLEMENTARIOS */}
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <FieldLabel>Productos complementarios</FieldLabel>
                  <button
                    type="button"
                    onClick={openProductSelectorModal}
                    style={{
                      background: '#10B981', color: '#ffffff', border: 'none',
                      padding: '8px 14px', borderRadius: 8, fontSize: 13,
                      fontWeight: 800, cursor: 'pointer'
                    }}
                  >
                    + Seleccionar productos
                  </button>
                </div>

                {cfg.selectedProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#9ca3af', fontSize: 13 }}>
                    Aún no agregaste productos complementarios. Tocá el botón de arriba.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cfg.selectedProducts.map((p) => (
                      <div key={p.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#ffffff'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.image ? (
                            <img src={p.image} alt={p.title} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: 32, height: 32, borderRadius: 6, background: '#e5e7eb' }} />
                          )}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{p.title}</div>
                            <div style={{ fontSize: 12, color: '#10B981', fontWeight: 800 }}>{formatMoney(p.price)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSelectedProduct(p.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* OPCCIONALES Y DESCUENTOS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                  <ToggleSwitch checked={cfg.isMainOptional} onChange={(v) => set('isMainOptional', v)} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>El producto principal es opcional</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Cuando está activo, el cliente puede deseleccionar el producto de la página del pack. Por defecto siempre está incluido.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                  <ToggleSwitch checked={cfg.enableQuantityDiscount} onChange={(v) => set('enableQuantityDiscount', v)} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Activar descuento por cantidad para todos los productos</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Muestra el precio con descuento según la cantidad de productos seleccionados en el pack.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                  <ToggleSwitch checked={cfg.redirectToCart} onChange={(v) => set('redirectToCart', v)} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Redirigir a /comprar luego de añadir al carrito</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Por defecto intenta abrir el carrito lateral. Si tu tema no lo soporta, activá esta opción para ir directo a la compra.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB UBICACIÓN */}
          {tab === 'ubicacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <ToggleSwitch checked={cfg.replaceNativeButton} onChange={(v) => set('replaceNativeButton', v)} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>Reemplazar por el botón de agregar al carrito de Tiendanube</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                    Cuando está activo, el widget reemplaza el formulario original de Tiendanube. Al desactivarlo, el formulario original permanece visible y funcional.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Color badge "Incluido"</FieldLabel>
                  <ColorPickerField value={cfg.badgeColor} onChange={(v) => setCustomColor('badgeColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color del precio promoción</FieldLabel>
                  <ColorPickerField value={cfg.promoPriceColor} onChange={(v) => setCustomColor('promoPriceColor', v)} />
                </div>
                <div>
                  <FieldLabel>Fondo de los items</FieldLabel>
                  <ColorPickerField value={cfg.itemBgColor} onChange={(v) => setCustomColor('itemBgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Fondo botón "Agregar"</FieldLabel>
                  <ColorPickerField value={cfg.buttonBg} onChange={(v) => setCustomColor('buttonBg', v)} />
                </div>
                <div>
                  <FieldLabel>Texto botón "Agregar"</FieldLabel>
                  <ColorPickerField value={cfg.buttonText} onChange={(v) => setCustomColor('buttonText', v)} />
                </div>
                <div>
                  <FieldLabel>Color del borde</FieldLabel>
                  <ColorPickerField value={cfg.borderColor} onChange={(v) => setCustomColor('borderColor', v)} />
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

      {/* MODAL BUSCADOR DE PRODUCTOS DE LA TIENDA */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 520,
            maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0 }}>
                Elegí productos complementarios
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, fontWeight: 800, color: '#9ca3af', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre..."
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 13, border: '1.5px solid #e5e7eb',
                  borderRadius: 8, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loadingProducts ? (
                <div style={{ textAlign: 'center', padding: 30, color: '#6b7280', fontSize: 13 }}>
                  Cargando tus productos...
                </div>
              ) : filteredModalProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: '#6b7280', fontSize: 13 }}>
                  No se encontraron productos.
                </div>
              ) : (
                filteredModalProducts.map((p) => {
                  const isSelected = cfg.selectedProducts.some((item) => String(item.id) === String(p.id));
                  const title = typeof p.name === 'object' ? (p.name.es || p.name.pt || 'Producto') : (p.name || 'Producto');
                  const image = p.images && p.images[0] ? p.images[0].src : '';
                  const price = p.variants && p.variants[0] ? parseFloat(p.variants[0].price) : (parseFloat(p.price) || 0);

                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelectProduct(p)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', border: isSelected ? '2px solid #10B981' : '1px solid #e5e7eb',
                        borderRadius: 10, background: isSelected ? '#ecfdf5' : '#ffffff', cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {image ? (
                          <img src={image} alt={title} style={{ width: 40, height: 48, borderRadius: 6, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 40, height: 48, borderRadius: 6, background: '#e5e7eb' }} />
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{title}</div>
                          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 800 }}>{formatMoney(price)}</div>
                        </div>
                      </div>

                      <div style={{
                        background: isSelected ? '#10B981' : '#f3f4f6',
                        color: isSelected ? '#ffffff' : '#374151',
                        padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800
                      }}>
                        {isSelected ? '✓ Seleccionado' : '+ Agregar'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ padding: 16, borderTop: '1px solid #e5e7eb', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#10B981', color: '#ffffff', border: 'none',
                  padding: '10px 24px', borderRadius: 999, fontSize: 14,
                  fontWeight: 800, cursor: 'pointer'
                }}
              >
                Listo ({cfg.selectedProducts.length} seleccionados)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
