'use client';

import React, { useState, useEffect } from 'react';
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

interface PackComplementariosEditorProps {
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

interface ComplementaryItem {
  productId: number | null;
  productName: string;
  productImage: string | null;
  productPrice: number;
  checkedByDefault: boolean;
  subtitle: string;
}

export interface PackComplementariosConfig {
  title: string;
  mainProductTitle: string;
  isMainOptional: boolean;
  buttonText: string;
  replaceCartButton: boolean;
  redirectToCheckout: boolean;
  enableQuantityDiscount: boolean;
  discount2Items: number;
  discount3Items: number;
  discount4Items: number;
  showSavingsBadge: boolean;
  savingsBadgeText: string;
  savingsBadgeBg: string;
  savingsBadgeTextColor: string;
  complementary: ComplementaryItem[];
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

const defaultConfig: PackComplementariosConfig = {
  title: 'Armá tu Pack y Ahorrá',
  mainProductTitle: 'Este producto',
  isMainOptional: false,
  buttonText: 'Agregar pack al carrito',
  replaceCartButton: true,
  redirectToCheckout: false,
  enableQuantityDiscount: true,
  discount2Items: 10,
  discount3Items: 15,
  discount4Items: 20,
  showSavingsBadge: true,
  savingsBadgeText: 'AHORRÁS $X',
  savingsBadgeBg: '#059669',
  savingsBadgeTextColor: '#ffffff',
  complementary: [
    { productId: null, productName: '', productImage: null, productPrice: 0, checkedByDefault: true, subtitle: 'Complemento recomendado' },
    { productId: null, productName: '', productImage: null, productPrice: 0, checkedByDefault: false, subtitle: 'Llevá también' },
    { productId: null, productName: '', productImage: null, productPrice: 0, checkedByDefault: false, subtitle: 'Opcional extra' },
  ],
  bgColor: '#ffffff',
  textColor: '#111827',
  borderColor: '#e5e7eb',
  accentColor: '#10B981',
  selectedBorderColor: '#10B981',
  buttonBg: '#111827',
  buttonTextColor: '#ffffff',
  borderRadius: 14,
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

const PRESETS_DATA: Record<string, Partial<PackComplementariosConfig>> = {
  'black-friday': { bgColor: '#111827', textColor: '#ffffff', borderColor: '#374151', accentColor: '#F59E0B', selectedBorderColor: '#F59E0B', buttonBg: '#F59E0B', buttonTextColor: '#111827', savingsBadgeBg: '#F59E0B', savingsBadgeTextColor: '#111827' },
  'hot-sale': { bgColor: '#0F172A', textColor: '#ffffff', borderColor: '#1e293b', accentColor: '#EF4444', selectedBorderColor: '#EF4444', buttonBg: '#EF4444', buttonTextColor: '#ffffff', savingsBadgeBg: '#EF4444', savingsBadgeTextColor: '#ffffff' },
  'cyber-monday': { bgColor: '#090D16', textColor: '#ffffff', borderColor: '#1e3a5f', accentColor: '#3B82F6', selectedBorderColor: '#3B82F6', buttonBg: '#3B82F6', buttonTextColor: '#ffffff', savingsBadgeBg: '#3B82F6', savingsBadgeTextColor: '#ffffff' },
  'navidad': { bgColor: '#064E3B', textColor: '#ffffff', borderColor: '#047857', accentColor: '#EF4444', selectedBorderColor: '#EF4444', buttonBg: '#EF4444', buttonTextColor: '#ffffff', savingsBadgeBg: '#EF4444', savingsBadgeTextColor: '#ffffff' },
  'san-valentin': { bgColor: '#831843', textColor: '#ffffff', borderColor: '#9d174d', accentColor: '#F43F5E', selectedBorderColor: '#F43F5E', buttonBg: '#F43F5E', buttonTextColor: '#ffffff', savingsBadgeBg: '#F43F5E', savingsBadgeTextColor: '#ffffff' },
  'dia-padre-madre': { bgColor: '#312E81', textColor: '#ffffff', borderColor: '#4338ca', accentColor: '#10B981', selectedBorderColor: '#10B981', buttonBg: '#10B981', buttonTextColor: '#ffffff', savingsBadgeBg: '#10B981', savingsBadgeTextColor: '#ffffff' },
  'liquidacion': { bgColor: '#7F1D1D', textColor: '#ffffff', borderColor: '#991b1b', accentColor: '#FBBF24', selectedBorderColor: '#FBBF24', buttonBg: '#FBBF24', buttonTextColor: '#7F1D1D', savingsBadgeBg: '#FBBF24', savingsBadgeTextColor: '#7F1D1D' },
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
          {!!selectedPrice && selectedPrice > 0 ? (
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
        🔍 Seleccionar un producto complementario...
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
                      {pPrice > 0 ? (
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>${Math.round(pPrice).toLocaleString('es-AR')}</div>
                      ) : null}
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

function PackComplementariosLivePreview({ config }: { config: PackComplementariosConfig }) {
  const validComps = config.complementary.filter((c) => c.productId);
  const sampleMainPrice = 25000;

  // Calculamos subtotal de muestra
  let totalItemsCount = 1;
  let subtotal = sampleMainPrice;
  validComps.forEach((c) => {
    if (c.checkedByDefault) {
      totalItemsCount += 1;
      subtotal += (c.productPrice || 10000);
    }
  });

  let discountPercent = 0;
  if (config.enableQuantityDiscount) {
    if (totalItemsCount >= 4) discountPercent = config.discount4Items || 0;
    else if (totalItemsCount === 3) discountPercent = config.discount3Items || 0;
    else if (totalItemsCount === 2) discountPercent = config.discount2Items || 0;
  }

  const finalTotal = discountPercent > 0 ? subtotal * (1 - discountPercent / 100) : subtotal;

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
        border: `1.5px solid ${config.borderColor}`, padding: 16, color: config.textColor,
      }}>
        {config.title ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: config.textColor }}>{config.title}</div>
            {discountPercent > 0 && config.showSavingsBadge ? (
              <span style={{
                fontSize: 10, fontWeight: 800, background: config.savingsBadgeBg,
                color: config.savingsBadgeTextColor, padding: '3px 8px', borderRadius: 6,
              }}>
                {config.savingsBadgeText.replace('$X', `${discountPercent}% OFF`)}
              </span>
            ) : null}
          </div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Producto Principal */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${config.selectedBorderColor}`,
            background: 'rgba(16,185,129,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={true}
                disabled={!config.isMainOptional}
                readOnly
                style={{ width: 18, height: 18, accentColor: config.accentColor }}
              />
              <div style={{
                width: 38, height: 38, borderRadius: 8, background: '#e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                ⭐
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: config.textColor }}>
                  {config.mainProductTitle || 'Producto principal'}
                </div>
                <div style={{ fontSize: 11, opacity: 0.65 }}>Ficha actual</div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: config.accentColor }}>
              ${sampleMainPrice.toLocaleString('es-AR')}
            </div>
          </div>

          {/* Complementarios */}
          {validComps.length > 0 ? (
            validComps.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${config.borderColor}`,
                  background: c.checkedByDefault ? 'rgba(16,185,129,0.03)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={c.checkedByDefault}
                    readOnly
                    style={{ width: 18, height: 18, accentColor: config.accentColor }}
                  />
                  <div style={{
                    width: 38, height: 38, borderRadius: 8, background: '#f3f4f6',
                    overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {c.productImage ? (
                      <img src={c.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 16 }}>📦</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: config.textColor }}>{c.productName}</div>
                    {c.subtitle ? <div style={{ fontSize: 11, opacity: 0.65 }}>{c.subtitle}</div> : null}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: config.accentColor }}>
                  +${Math.round(c.productPrice || 10000).toLocaleString('es-AR')}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: '12px', border: '1.5px dashed #d1d5db', borderRadius: 10,
              textAlign: 'center', fontSize: 12, color: '#6b7280',
            }}>
              Configurá tus complementos en la pestaña &quot;Complementarios&quot;.
            </div>
          )}
        </div>

        {/* Resumen Total */}
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: `1px solid ${config.borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>
            Total ({totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}):
          </span>
          <div style={{ textAlign: 'right' }}>
            {discountPercent > 0 ? (
              <span style={{ fontSize: 11, textDecoration: 'line-through', opacity: 0.5, marginRight: 6 }}>
                ${Math.round(subtotal).toLocaleString('es-AR')}
              </span>
            ) : null}
            <span style={{ fontSize: 16, fontWeight: 900, color: config.accentColor }}>
              ${Math.round(finalTotal).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Botón de compra */}
        <button
          type="button"
          disabled
          style={{
            width: '100%', marginTop: 12, padding: '14px', border: 'none',
            borderRadius: 999, background: config.buttonBg, color: config.buttonTextColor,
            fontSize: 15, fontWeight: 800, cursor: 'default',
          }}
        >
          {config.buttonText || 'Agregar pack al carrito'} · ${Math.round(finalTotal).toLocaleString('es-AR')}
        </button>
      </div>
    </div>
  );
}

export default function PackComplementariosEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: PackComplementariosEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<PackComplementariosConfig>(() => {
    const base = { ...defaultConfig, ...(existingWidget?.config || {}) };
    if (!base.complementary || !Array.isArray(base.complementary)) {
      base.complementary = defaultConfig.complementary;
    } else {
      base.complementary = base.complementary.map((c: any) => ({
        productId: c.productId ?? null,
        productName: c.productName || '',
        productImage: c.productImage || null,
        productPrice: typeof c.productPrice === 'number' ? c.productPrice : 0,
        checkedByDefault: c.checkedByDefault !== false,
        subtitle: c.subtitle || '',
      }));
      while (base.complementary.length < 3) {
        base.complementary.push({ productId: null, productName: '', productImage: null, productPrice: 0, checkedByDefault: false, subtitle: '' });
      }
    }
    return base as PackComplementariosConfig;
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

  function update(key: keyof PackComplementariosConfig, value: any) {
    setConfig((prev) => {
      const next: any = { ...prev, [key]: value };
      if (['bgColor', 'textColor', 'borderColor', 'accentColor', 'selectedBorderColor', 'buttonBg', 'buttonTextColor', 'savingsBadgeBg', 'savingsBadgeTextColor'].indexOf(String(key)) !== -1) {
        next.campaignTheme = 'none';
      }
      return next;
    });
  }

  function updateComp(index: number, patch: any) {
    setConfig((prev) => {
      const complementary = prev.complementary.map((c, i) => (i === index ? { ...c, ...patch } : c));
      return { ...prev, complementary };
    });
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
        <FieldLabel>Título del widget</FieldLabel>
        <TextInput value={config.title} onChange={(v) => update('title', v)} placeholder="Ej: Armá tu Pack y Ahorrá" maxLength={60} />
      </div>

      <div>
        <FieldLabel>Etiqueta del producto principal</FieldLabel>
        <TextInput value={config.mainProductTitle} onChange={(v) => update('mainProductTitle', v)} placeholder="Este producto" maxLength={50} />
        <FieldHelper>Cómo se llamará la fila del producto de la ficha actual.</FieldHelper>
      </div>

      <CheckboxRow
        checked={config.isMainOptional}
        onChange={(v) => update('isMainOptional', v)}
        label="Permitir desmarcar el producto principal"
        helper="Si está desactivado, el producto principal queda fijo y chequeado obligatoriamente."
      />

      <div>
        <FieldLabel>Texto del botón</FieldLabel>
        <TextInput value={config.buttonText} onChange={(v) => update('buttonText', v)} placeholder="Agregar pack al carrito" />
      </div>

      <CheckboxRow
        checked={config.redirectToCheckout}
        onChange={(v) => update('redirectToCheckout', v)}
        label="Redirigir a /comprar luego de añadir al carrito"
        helper="Por defecto abre el carrito lateral (mini-cart). Activá esto si querés enviar al cliente directo al checkout."
      />
    </div>
  );

  const tabComplementarios = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel>Productos del Pack (hasta 3 complementos)</FieldLabel>
        <FieldHelper>Elegí los productos que componen el pack. El cliente podrá sumar/quitar cada uno con un checkbox.</FieldHelper>
      </div>

      {[0, 1, 2].map((i) => (
        <div key={i} style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, color: '#111827' }}>Complemento #{i + 1}</div>
          <ProductPicker
            storeId={storeId}
            selectedId={config.complementary[i]?.productId || null}
            selectedName={config.complementary[i]?.productName || ''}
            selectedImage={config.complementary[i]?.productImage || null}
            selectedPrice={config.complementary[i]?.productPrice || 0}
            onSelect={(p) => {
              const price = parseFloat(String(p.price || 0).replace(/[^\d.]/g, '')) || 0;
              updateComp(i, {
                productId: p.id,
                productName: p.name,
                productImage: p.image,
                productPrice: price,
              });
            }}
            onClear={() => updateComp(i, { productId: null, productName: '', productImage: null, productPrice: 0 })}
          />
          {config.complementary[i]?.productId ? (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <FieldLabel>Subtítulo / Bajada (opcional)</FieldLabel>
                <TextInput
                  value={config.complementary[i]?.subtitle || ''}
                  onChange={(v) => updateComp(i, { subtitle: v })}
                  placeholder="Ej: Recomendado con este producto"
                />
              </div>
              <CheckboxRow
                checked={config.complementary[i]?.checkedByDefault}
                onChange={(v) => updateComp(i, { checkedByDefault: v })}
                label="Marcado por defecto al cargar la página"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );

  const tabDescuentos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CheckboxRow
        checked={config.enableQuantityDiscount}
        onChange={(v) => update('enableQuantityDiscount', v)}
        label="Habilitar descuento escalonado por cantidad de ítems"
        helper="Aplica automáticamente un porcentaje OFF según la cantidad total de productos marcados en el pack."
      />

      {config.enableQuantityDiscount ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#f9fafb', padding: 16, borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
          <div>
            <FieldLabel>Descuento al llevar 2 productos (%)</FieldLabel>
            <NumberInput value={config.discount2Items} onChange={(v) => update('discount2Items', v)} min={0} max={90} />
          </div>
          <div>
            <FieldLabel>Descuento al llevar 3 productos (%)</FieldLabel>
            <NumberInput value={config.discount3Items} onChange={(v) => update('discount3Items', v)} min={0} max={90} />
          </div>
          <div>
            <FieldLabel>Descuento al llevar 4 o más productos (%)</FieldLabel>
            <NumberInput value={config.discount4Items} onChange={(v) => update('discount4Items', v)} min={0} max={90} />
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 14 }}>
            <CheckboxRow
              checked={config.showSavingsBadge}
              onChange={(v) => update('showSavingsBadge', v)}
              label="Mostrar badge de ahorro"
            />
            {config.showSavingsBadge ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                <div>
                  <FieldLabel>Texto del badge</FieldLabel>
                  <TextInput value={config.savingsBadgeText} onChange={(v) => update('savingsBadgeText', v)} placeholder="AHORRÁS $X" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <FieldLabel>Fondo badge</FieldLabel>
                    <ColorPickerField value={config.savingsBadgeBg} onChange={(v) => update('savingsBadgeBg', v)} />
                  </div>
                  <div>
                    <FieldLabel>Texto badge</FieldLabel>
                    <ColorPickerField value={config.savingsBadgeTextColor} onChange={(v) => update('savingsBadgeTextColor', v)} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: '#f0fdf4', borderLeft: '4px solid #10B981', borderRadius: 12, padding: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#065f46', marginBottom: 8 }}>📍 Ubicación en Ficha de Producto</div>
        <FieldHelper>
          Elegí cómo se integra el pack con el botón nativo de compra de Tiendanube.
        </FieldHelper>
      </div>

      <CheckboxRow
        checked={config.replaceCartButton}
        onChange={(v) => update('replaceCartButton', v)}
        label="Reemplazar el botón nativo de compra de Tiendanube"
        helper="El pack toma el lugar del botón original. Si lo desactivás, el widget se muestra como un bloque complementario."
      />
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
          <FieldLabel>Color de acento / precios</FieldLabel>
          <ColorPickerField value={config.accentColor} onChange={(v) => update('accentColor', v)} />
        </div>
        <div>
          <FieldLabel>Color borde destacado</FieldLabel>
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
        <FieldHelper>Al elegir una campaña se aplican colores temáticos de alto impacto automáticamente.</FieldHelper>
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
    { id: 'complementarios', label: 'Complementarios' },
    { id: 'descuentos', label: 'Descuentos' },
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
            <span style={{ fontSize: 18 }}>📦</span>
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
            <PackComplementariosLivePreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Pack Complementarios te permite ofrecer packs combinables con el producto actual y complementos seleccionados. El cliente puede sumar o quitar productos con un clic y el total se actualiza en vivo.
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
            {activeTab === 'general' ? tabGeneral : null}
            {activeTab === 'complementarios' ? tabComplementarios : null}
            {activeTab === 'descuentos' ? tabDescuentos : null}
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
