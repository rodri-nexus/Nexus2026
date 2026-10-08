'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
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

interface BundleCantidadEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

interface StoreProduct {
  id: number;
  name: string;
  image: string | null;
  price?: string | number | null;
}

interface UnitConfig {
  qty: number;
  subtitle: string;
  discountPercent: number;
  badgeEnvioGratis: boolean;
  badgeMasVendido: boolean;
  badgePersonalizado: boolean;
  badgePersonalizadoText: string;
  hidden: boolean;
  defaultSelected: boolean;
  hideComplementary1: boolean;
  hideComplementary2: boolean;
  giftEnabled: boolean;
}

interface ComplementaryProduct {
  productId: number | null;
  productName: string;
  productImage: string | null;
  productPrice?: number;
  checkedByDefault: boolean;
}

export interface BundleCantidadConfig {
  title: string;
  maxUnits: number;
  labelStyle: string;
  priceMode: 'total' | 'unit';
  buttonText: string;
  replaceCartButton: boolean;
  createTnPromotion: boolean;
  redirectToCheckout: boolean;
  showSavingsBadge: boolean;
  savingsBadgeText: string;
  savingsBadgeBg: string;
  savingsBadgeTextColor: string;
  units: UnitConfig[];
  complementary: ComplementaryProduct[];
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  selectedBorderColor: string;
  buttonBg: string;
  buttonTextColor: string;
  borderRadius: number;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   DEFAULTS Y PRESETS
═══════════════════════════════════════════ */
const defaultUnit = (qty: number, subtitle: string, discount: number): UnitConfig => ({
  qty,
  subtitle,
  discountPercent: discount,
  badgeEnvioGratis: false,
  badgeMasVendido: qty === 2,
  badgePersonalizado: false,
  badgePersonalizadoText: 'RECOMENDADO',
  hidden: false,
  defaultSelected: qty === 1,
  hideComplementary1: false,
  hideComplementary2: false,
  giftEnabled: false,
});

const defaultConfig: BundleCantidadConfig = {
  title: '',
  maxUnits: 3,
  labelStyle: 'lleva',
  priceMode: 'total',
  buttonText: 'Agregar al carrito',
  replaceCartButton: true,
  createTnPromotion: true,
  redirectToCheckout: false,
  showSavingsBadge: true,
  savingsBadgeText: 'AHORRÁS $X',
  savingsBadgeBg: '#059669',
  savingsBadgeTextColor: '#ffffff',
  units: [
    defaultUnit(1, '', 0),
    defaultUnit(2, 'Ahorrá 10%', 10),
    defaultUnit(3, 'Ahorrá más', 15),
  ],
  complementary: [
    { productId: null, productName: '', productImage: null, productPrice: 0, checkedByDefault: false },
    { productId: null, productName: '', productImage: null, productPrice: 0, checkedByDefault: false },
  ],
  bgColor: '#ffffff',
  textColor: '#111827',
  borderColor: '#e5e7eb',
  accentColor: '#10B981',
  selectedBorderColor: '#111827',
  buttonBg: '#111827',
  buttonTextColor: '#ffffff',
  borderRadius: 12,
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Negro + dorado de alto contraste.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul neón cibernético.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino + rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa pasión.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día Madre / Padre', emoji: '🎁', desc: 'Índigo + esmeralda.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí + amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, Partial<BundleCantidadConfig>> = {
  'black-friday': { bgColor: '#111827', textColor: '#ffffff', borderColor: '#374151', accentColor: '#F59E0B', selectedBorderColor: '#F59E0B', buttonBg: '#F59E0B', buttonTextColor: '#111827', savingsBadgeBg: '#F59E0B', savingsBadgeTextColor: '#111827' },
  'hot-sale': { bgColor: '#0F172A', textColor: '#ffffff', borderColor: '#1e293b', accentColor: '#EF4444', selectedBorderColor: '#EF4444', buttonBg: '#EF4444', buttonTextColor: '#ffffff', savingsBadgeBg: '#EF4444', savingsBadgeTextColor: '#ffffff' },
  'cyber-monday': { bgColor: '#090D16', textColor: '#ffffff', borderColor: '#1e3a5f', accentColor: '#3B82F6', selectedBorderColor: '#3B82F6', buttonBg: '#3B82F6', buttonTextColor: '#ffffff', savingsBadgeBg: '#3B82F6', savingsBadgeTextColor: '#ffffff' },
  'navidad': { bgColor: '#064E3B', textColor: '#ffffff', borderColor: '#047857', accentColor: '#EF4444', selectedBorderColor: '#EF4444', buttonBg: '#EF4444', buttonTextColor: '#ffffff', savingsBadgeBg: '#EF4444', savingsBadgeTextColor: '#ffffff' },
  'san-valentin': { bgColor: '#831843', textColor: '#ffffff', borderColor: '#9d174d', accentColor: '#F43F5E', selectedBorderColor: '#F43F5E', buttonBg: '#F43F5E', buttonTextColor: '#ffffff', savingsBadgeBg: '#F43F5E', savingsBadgeTextColor: '#ffffff' },
  'dia-padre-madre': { bgColor: '#312E81', textColor: '#ffffff', borderColor: '#4338ca', accentColor: '#10B981', selectedBorderColor: '#10B981', buttonBg: '#10B981', buttonTextColor: '#ffffff', savingsBadgeBg: '#10B981', savingsBadgeTextColor: '#ffffff' },
  'liquidacion': { bgColor: '#7F1D1D', textColor: '#ffffff', borderColor: '#991b1b', accentColor: '#FBBF24', selectedBorderColor: '#FBBF24', buttonBg: '#FBBF24', buttonTextColor: '#7F1D1D', savingsBadgeBg: '#FBBF24', savingsBadgeTextColor: '#7F1D1D' },
};

/* ═══════════════════════════════════════════
   SUBCOMPONENTES UI (Regla #9 al inicio)
═══════════════════════════════════════════ */
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

function NumberInput({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
      }}
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

function CheckboxRow({ checked, onChange, label, helper }: { checked: boolean; onChange: (v: boolean) => void; label: string; helper?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: '#10B981', marginTop: 2, flexShrink: 0 }}
      />
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{label}</div>
        {helper && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 1.4 }}>{helper}</div>}
      </div>
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

/* ═══════════════════════════════════════════
   SELECTOR DE PRODUCTOS
═══════════════════════════════════════════ */
function ProductPicker({
  storeId,
  selectedId,
  selectedName,
  selectedImage,
  selectedPrice,
  onSelect,
  onClear,
}: {
  storeId: string | number;
  selectedId: number | null;
  selectedName: string;
  selectedImage: string | null;
  selectedPrice?: number;
  onSelect: (p: StoreProduct) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open || !storeId) return;
    setLoading(true);
    fetch(`/api/products?store_id=${storeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, storeId]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  if (selectedId) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        border: '1.5px solid #10B981', borderRadius: 10, background: '#ecfdf5',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8, background: '#fff', border: '1px solid #e5e7eb',
          overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selectedImage ? (
            <img src={selectedImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 16 }}>📦</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedName || `Producto #${selectedId}`}
          </div>
          {selectedPrice ? (
            <div style={{ fontSize: 12, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
              ${Math.round(selectedPrice).toLocaleString('es-AR')}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClear}
          style={{
            border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: 8,
            padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '12px 14px', fontSize: 14, fontWeight: 600,
          border: '1.5px dashed #d1d5db', borderRadius: 10, background: '#f9fafb',
          color: '#6b7280', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        🔍 Seleccionar un producto...
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 12,
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)', maxHeight: 320, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: 10, borderBottom: '1px solid #f3f4f6' }}>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filtrar por nombre..."
              autoFocus
              style={{
                width: '100%', padding: '10px 12px', fontSize: 14, border: '1.5px solid #e5e7eb',
                borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 250 }}>
            {loading ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>Cargando productos...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>No se encontraron productos</div>
            ) : (
              filtered.map((p) => {
                const pPrice = parseFloat(String(p.price || 0).replace(/[^\d.]/g, '')) || 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelect(p);
                      setOpen(false);
                      setQ('');
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '10px 12px', border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #f9fafb',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 6, background: '#f3f4f6',
                      overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {p.image ? (
                        <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 14 }}>📦</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      {pPrice > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>${Math.round(pPrice).toLocaleString('es-AR')}</div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              padding: 10, border: 'none', borderTop: '1px solid #f3f4f6',
              background: '#f9fafb', fontSize: 13, fontWeight: 700, color: '#6b7280', cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN VIVO
═══════════════════════════════════════════ */
function BundleCantidadPreview({ config }: { config: BundleCantidadConfig }) {
  const visibleUnits = config.units.filter((u) => !u.hidden).slice(0, config.maxUnits);
  const selected = visibleUnits.find((u) => u.defaultSelected) || visibleUnits[0];

  return (
    <div style={{
      background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN PRODUCTO
      </div>

      <div style={{
        background: config.bgColor, borderRadius: config.borderRadius,
        border: `1.5px solid ${config.borderColor}`, padding: 14, color: config.textColor,
      }}>
        {config.title && (
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: config.textColor }}>{config.title}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleUnits.map((u) => {
            const isSel = selected && selected.qty === u.qty;
            const label = config.labelStyle === 'lleva' ? `Lleva ${u.qty}` : config.labelStyle === 'pack' ? `Pack x${u.qty}` : `${u.qty} unidad${u.qty > 1 ? 'es' : ''}`;
            return (
              <div
                key={u.qty}
                style={{
                  border: isSel ? `2px solid ${config.selectedBorderColor}` : `1.5px solid ${config.borderColor}`,
                  borderRadius: 10, padding: '12px 14px', background: isSel ? 'rgba(16,185,129,0.04)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: isSel ? `6px solid ${config.accentColor}` : '2px solid #d1d5db',
                    background: '#fff', flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: config.textColor }}>{label}</div>
                    {u.subtitle && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{u.subtitle}</div>}
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {u.badgeEnvioGratis && (
                        <span style={{ fontSize: 9, fontWeight: 800, background: '#10B981', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>ENVÍO GRATIS</span>
                      )}
                      {u.badgeMasVendido && (
                        <span style={{ fontSize: 9, fontWeight: 800, background: '#EF4444', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>MÁS VENDIDO</span>
                      )}
                      {u.badgePersonalizado && u.badgePersonalizadoText && (
                        <span style={{ fontSize: 9, fontWeight: 800, background: '#F59E0B', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>{u.badgePersonalizadoText}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {u.discountPercent > 0 && config.showSavingsBadge && (
                    <div style={{
                      fontSize: 9, fontWeight: 800, background: config.savingsBadgeBg,
                      color: config.savingsBadgeTextColor, padding: '2px 6px', borderRadius: 4, marginBottom: 4, display: 'inline-block',
                    }}>
                      {config.savingsBadgeText.replace('$X', `${u.discountPercent}%`)}
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 900, color: config.accentColor }}>
                    {u.discountPercent > 0 ? `−${u.discountPercent}%` : 'Precio base'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complementarios preview */}
        {config.complementary.some((c) => c.productId) && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${config.borderColor}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>También te puede interesar</div>
            {config.complementary.filter((c) => c.productId).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, border: '1.5px solid #d1d5db',
                    background: c.checkedByDefault ? config.accentColor : '#fff',
                  }} />
                  {c.productImage && (
                    <img src={c.productImage} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }} />
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{c.productName}</span>
                </div>
                {c.productPrice ? (
                  <span style={{ fontSize: 12, fontWeight: 800, color: config.accentColor }}>
                    +${Math.round(c.productPrice).toLocaleString('es-AR')}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          disabled
          style={{
            width: '100%', marginTop: 14, padding: '14px', border: 'none',
            borderRadius: 999, background: config.buttonBg, color: config.buttonTextColor,
            fontSize: 15, fontWeight: 800, cursor: 'default',
          }}
        >
          {config.buttonText || 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BundleCantidadEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: BundleCantidadEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BundleCantidadConfig>(() => {
    const base = { ...defaultConfig, ...(existingWidget?.config || {}) };
    if (!base.units || !Array.isArray(base.units) || base.units.length === 0) {
      base.units = defaultConfig.units;
    }
    if (!base.complementary || !Array.isArray(base.complementary)) {
      base.complementary = defaultConfig.complementary;
    }
    return base as BundleCantidadConfig;
  });

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update(key: keyof BundleCantidadConfig, value: any) {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      if (['bgColor', 'textColor', 'borderColor', 'accentColor', 'selectedBorderColor', 'buttonBg', 'buttonTextColor', 'savingsBadgeBg', 'savingsBadgeTextColor'].includes(key as string)) {
        next.campaignTheme = 'none';
      }
      return next;
    });
  }

  function updateUnit(index: number, patch: Partial<UnitConfig>) {
    setConfig((prev) => {
      const units = prev.units.map((u, i) => (i === index ? { ...u, ...patch } : u));
      if (patch.defaultSelected === true) {
        units.forEach((u, i) => {
          if (i !== index) u.defaultSelected = false;
        });
      }
      return { ...prev, units };
    });
  }

  function updateComp(index: number, patch: Partial<ComplementaryProduct>) {
    setConfig((prev) => {
      const complementary = prev.complementary.map((c, i) => (i === index ? { ...c, ...patch } : c));
      return { ...prev, complementary };
    });
  }

  function handleSelectComp(index: number, p: StoreProduct) {
    let price = 0;
    if (p.price) {
      price = parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 0;
    }
    updateComp(index, {
      productId: p.id,
      productName: p.name,
      productImage: p.image,
      productPrice: price,
    });
  }

  function handleClearComp(index: number) {
    updateComp(index, {
      productId: null,
      productName: '',
      productImage: null,
      productPrice: 0,
    });
  }

  function handleCheckAllByDefault(v: boolean) {
    setConfig((prev) => ({
      ...prev,
      complementary: prev.complementary.map((c) => ({
        ...c,
        checkedByDefault: v && !!c.productId,
      })),
    }));
  }

  function applyPreset(slug: string) {
    if (slug === 'none') {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: 'none',
        bgColor: defaultConfig.bgColor,
        textColor: defaultConfig.textColor,
        borderColor: defaultConfig.borderColor,
        accentColor: defaultConfig.accentColor,
        selectedBorderColor: defaultConfig.selectedBorderColor,
        buttonBg: defaultConfig.buttonBg,
        buttonTextColor: defaultConfig.buttonTextColor,
        savingsBadgeBg: defaultConfig.savingsBadgeBg,
        savingsBadgeTextColor: defaultConfig.savingsBadgeTextColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        ...PRESETS_DATA[slug],
      }));
    }
  }

  function handleMaxUnits(n: number) {
    setConfig((prev) => {
      let units = [...prev.units];
      while (units.length < n) {
        const q = units.length + 1;
        units.push(defaultUnit(q, q === 2 ? 'Ahorrá 10%' : q === 3 ? 'Ahorrá más' : '', q === 1 ? 0 : q === 2 ? 10 : 15));
      }
      units = units.slice(0, Math.max(n, 1));
      units = units.map((u, i) => ({ ...u, qty: i + 1 }));
      return { ...prev, maxUnits: n, units };
    });
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

  /* ═══ TABS CONTENT ═══ */
  const tabGeneral = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel>Título del widget (opcional)</FieldLabel>
        <TextInput value={config.title} onChange={(v) => update('title', v)} placeholder="Ej: Ofertas especiales por cantidad" maxLength={60} />
        <FieldHelper>Dejá vacío para no mostrar título.</FieldHelper>
      </div>

      <div>
        <FieldLabel>Cantidad de unidades / packs</FieldLabel>
        <SelectField
          value={String(config.maxUnits)}
          onChange={(v) => handleMaxUnits(Number(v))}
          options={[
            { value: '2', label: 'Hasta 2 unidades' },
            { value: '3', label: 'Hasta 3 unidades' },
            { value: '4', label: 'Hasta 4 unidades' },
            { value: '5', label: 'Hasta 5 unidades' },
          ]}
        />
      </div>

      <div>
        <FieldLabel>Etiqueta de cada pack</FieldLabel>
        <SelectField
          value={config.labelStyle}
          onChange={(v) => update('labelStyle', v)}
          options={[
            { value: 'lleva', label: 'Lleva #  (ej: Lleva 2)' },
            { value: 'pack', label: 'Pack x#  (ej: Pack x2)' },
            { value: 'unidades', label: '# unidades' },
          ]}
        />
      </div>

      <div>
        <FieldLabel>Mostrar precio</FieldLabel>
        <SelectField
          value={config.priceMode}
          onChange={(v) => update('priceMode', v)}
          options={[
            { value: 'total', label: 'Precio total (por cantidad)' },
            { value: 'unit', label: 'Precio individual por unidad' },
          ]}
        />
      </div>

      <div>
        <FieldLabel>Texto del botón</FieldLabel>
        <TextInput value={config.buttonText} onChange={(v) => update('buttonText', v)} placeholder="Agregar al carrito" />
        <FieldHelper>Dejá vacío para usar &quot;Agregar al carrito&quot;.</FieldHelper>
      </div>

      <CheckboxRow
        checked={config.createTnPromotion}
        onChange={(v) => update('createTnPromotion', v)}
        label="Crear promoción automáticamente en Tiendanube"
        helper="Si lo desactivás, Nevux solo muestra el widget visual. Deberás crear el descuento manualmente en Tiendanube para que el precio final coincida en el checkout."
      />

      <CheckboxRow
        checked={config.redirectToCheckout}
        onChange={(v) => update('redirectToCheckout', v)}
        label="Redirigir a /comprar luego de añadir al carrito"
        helper="Por defecto se intenta abrir el carrito lateral (mini-cart). Si tu tema no lo tiene, activá esta opción."
      />
    </div>
  );

  const tabUnidades = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {config.units.slice(0, config.maxUnits).map((unit, idx) => (
        <div
          key={idx}
          style={{
            background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 14,
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
              Unidad {unit.qty} {unit.defaultSelected && <span style={{ fontSize: 11, color: '#10B981', marginLeft: 6 }}>• DEFAULT</span>}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={unit.hidden}
                onChange={(e) => updateUnit(idx, { hidden: e.target.checked })}
                style={{ accentColor: '#10B981' }}
              />
              Ocultar esta unidad
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <FieldLabel>Subtítulo</FieldLabel>
              <TextInput
                value={unit.subtitle}
                onChange={(v) => updateUnit(idx, { subtitle: v })}
                placeholder="Ej: Ahorrá 10%"
              />
            </div>

            <div>
              <FieldLabel>¿Tiene descuento? (%)</FieldLabel>
              <NumberInput
                value={unit.discountPercent}
                onChange={(v) => updateUnit(idx, { discountPercent: v })}
                min={0}
                max={90}
              />
            </div>

            <div>
              <FieldLabel>Badges</FieldLabel>
              <CheckboxRow checked={unit.badgeEnvioGratis} onChange={(v) => updateUnit(idx, { badgeEnvioGratis: v })} label="Envío gratis" />
              <CheckboxRow checked={unit.badgeMasVendido} onChange={(v) => updateUnit(idx, { badgeMasVendido: v })} label="Más vendido" />
              <CheckboxRow checked={unit.badgePersonalizado} onChange={(v) => updateUnit(idx, { badgePersonalizado: v })} label="Personalizado" />
              {unit.badgePersonalizado && (
                <TextInput
                  value={unit.badgePersonalizadoText}
                  onChange={(v) => updateUnit(idx, { badgePersonalizadoText: v })}
                  placeholder="RECOMENDADO"
                />
              )}
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
              <FieldLabel>Configuración extra</FieldLabel>
              <CheckboxRow
                checked={unit.defaultSelected}
                onChange={(v) => updateUnit(idx, { defaultSelected: v })}
                label="Marcar por defecto"
              />
              <CheckboxRow
                checked={unit.hideComplementary1}
                onChange={(v) => updateUnit(idx, { hideComplementary1: v })}
                label="Ocultar producto complementario 1 en esta unidad"
              />
              <CheckboxRow
                checked={unit.hideComplementary2}
                onChange={(v) => updateUnit(idx, { hideComplementary2: v })}
                label="Ocultar producto complementario 2 en esta unidad"
              />
              <CheckboxRow
                checked={unit.giftEnabled}
                onChange={(v) => updateUnit(idx, { giftEnabled: v })}
                label="Agregar producto de regalo en esta unidad"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const tabComplementarios = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel>Productos complementarios</FieldLabel>
        <FieldHelper>Se mostrarán debajo de cada tarjeta con un checkbox (máximo 2). Al tocar &quot;Seleccionar un producto&quot; verás todo tu catálogo con fotos y precio.</FieldHelper>
      </div>

      {[0, 1].map((i) => (
        <div key={i} style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, color: '#111827' }}>Producto {i + 1}</div>
          <ProductPicker
            storeId={storeId}
            selectedId={config.complementary[i]?.productId || null}
            selectedName={config.complementary[i]?.productName || ''}
            selectedImage={config.complementary[i]?.productImage || null}
            selectedPrice={config.complementary[i]?.productPrice || 0}
            onSelect={(p) => handleSelectComp(i, p)}
            onClear={() => handleClearComp(i)}
          />
        </div>
      ))}

      <CheckboxRow
        checked={config.complementary.some((c) => c.checkedByDefault)}
        onChange={handleCheckAllByDefault}
        label="Marcar como chequeado por defecto"
      />

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <CheckboxRow
          checked={config.showSavingsBadge}
          onChange={(v) => update('showSavingsBadge', v)}
          label="Mostrar badge de ahorro"
          helper="Se mostrará debajo del subtítulo cuando haya ahorro por unidad."
        />
        {config.showSavingsBadge && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <div>
              <FieldLabel>Texto del badge</FieldLabel>
              <TextInput
                value={config.savingsBadgeText}
                onChange={(v) => update('savingsBadgeText', v)}
                placeholder="AHORRÁS $X"
              />
              <FieldHelper>Usá $X para mostrar el valor del ahorro / descuento.</FieldHelper>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel>Fondo del badge</FieldLabel>
                <ColorPickerField value={config.savingsBadgeBg} onChange={(v) => update('savingsBadgeBg', v)} />
              </div>
              <div>
                <FieldLabel>Color del texto</FieldLabel>
                <ColorPickerField value={config.savingsBadgeTextColor} onChange={(v) => update('savingsBadgeTextColor', v)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: '#f0fdf4', borderLeft: '4px solid #10B981', borderRadius: 12, padding: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#065f46', marginBottom: 8 }}>📍 Ubicación del Bundle</div>
        <FieldHelper>
          Elegí cómo se integra el widget con el botón nativo de compra de Tiendanube.
        </FieldHelper>
      </div>

      <CheckboxRow
        checked={config.replaceCartButton}
        onChange={(v) => update('replaceCartButton', v)}
        label="Reemplazar el botón de agregar al carrito de Tiendanube"
        helper="El bundle toma el lugar del botón original. Ideal para forzar la elección de pack. Si lo desactivás, el bundle se inserta debajo del botón nativo (el formulario original permanece visible)."
      />

      {!config.replaceCartButton && (
        <div style={{
          background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 14px',
          fontSize: 13, color: '#9a3412', lineHeight: 1.5,
        }}>
          ℹ️ El formulario original de Tiendanube permanecerá visible y funcional. El bundle se mostrará como bloque adicional.
        </div>
      )}
    </div>
  );

  const tabEstilos = (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
        </div>
        <div>
          <FieldLabel>Color de texto</FieldLabel>
          <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
        </div>
        <div>
          <FieldLabel>Color de borde</FieldLabel>
          <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
        </div>
        <div>
          <FieldLabel>Color de acento / precio</FieldLabel>
          <ColorPickerField value={config.accentColor} onChange={(v) => update('accentColor', v)} />
        </div>
        <div>
          <FieldLabel>Borde del pack seleccionado</FieldLabel>
          <ColorPickerField value={config.selectedBorderColor} onChange={(v) => update('selectedBorderColor', v)} />
        </div>
        <div>
          <FieldLabel>Fondo del botón</FieldLabel>
          <ColorPickerField value={config.buttonBg} onChange={(v) => update('buttonBg', v)} />
        </div>
        <div>
          <FieldLabel>Texto del botón</FieldLabel>
          <ColorPickerField value={config.buttonTextColor} onChange={(v) => update('buttonTextColor', v)} />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Radio de bordes: {config.borderRadius}px</FieldLabel>
        <input
          type="range"
          min={0}
          max={24}
          value={config.borderRadius}
          onChange={(e) => update('borderRadius', Number(e.target.value))}
          style={{ width: '100%', accentColor: '#10B981' }}
        />
      </div>
    </div>
  );

  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto al bundle.</FieldHelper>
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
                  {isSelected && (
                    <span style={{ background: '#ecfdf5', color: '#10B981', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 999, border: '1px solid #10B981' }}>
                      ACTIVO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{preset.desc}</div>
              </div>
              {preset.id !== 'none' && preset.themeColor && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: preset.themeColor, border: '1px solid #d1d5db' }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: preset.accentColor, border: '1px solid #d1d5db' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'unidades', label: 'Unidades' },
    { id: 'complementarios', label: 'Extras' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>
      {/* HEADER */}
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
        {/* Scope chip */}
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
            marginBottom: 20, fontSize: 14, fontWeight 700,
          }}>
            <span>🏷️ Widget para Categoría</span>
          </div>
        ) : (
          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 14, fontWeight 700, color: '#000',
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
            <BundleCantidadPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              El Bundle de Cantidad muestra packs con descuento escalonado y hasta 2 productos complementarios. Puede reemplazar el botón nativo de Tiendanube y usa NubeSDK + fallback /comprar/ para agregar al carrito.
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, overflowX: 'auto' }}>
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flexShrink: 0, padding: '12px 14px', background: 'none', border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000', opacity: act ? 1 : 0.6,
                    fontSize: 13, fontWeight: act ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'unidades' && tabUnidades}
            {activeTab === 'complementarios' && tabComplementarios}
            {activeTab === 'ubicacion' && tabUbicacion}
            {activeTab === 'estilos' && tabEstilos}
            {activeTab === 'fechas' && tabFechas}
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

        {error && (
          <div style={{
            position: 'fixed', bottom: 20, left: 16, right: 16, maxWidth: 600, margin: '0 auto',
            background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, border: '1px solid #fecaca', zIndex: 40,
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
                }
