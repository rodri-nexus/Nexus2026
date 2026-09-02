'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PackagePlus,
  Plus,
  Trash2,
  Check,
  Eye,
  Save,
  Loader2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import {
  ColorPicker,
  Slider,
  FieldInput,
} from './EditorFields';
import EditorTabs from './EditorTabs';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS
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
  config: Record<string, unknown>;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface Props {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

export interface PackItem {
  titulo: string;
  precio: number;
  imagenUrl: string;
  variantId: string;
  incluidoPorDefecto: boolean;
}

interface PackComplementariosConfig {
  titulo: string;
  subtexto: string;
  descuentoPorcentaje: number;
  textoBoton: string;
  items: PackItem[];
  bgColor: string;
  borderColor: string;
  textColor: string;
  botonBgColor: string;
  botonTextColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: PackComplementariosConfig = {
  titulo: '🔥 COMBINÁ Y AHORRÁ EN TU PACK',
  subtexto: 'Llevate estos productos juntos con un descuento especial',
  descuentoPorcentaje: 15,
  textoBoton: 'Agregar pack al carrito',
  items: [
    {
      titulo: 'Remera Oversize Basic',
      precio: 24999,
      imagenUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
      variantId: '',
      incluidoPorDefecto: true,
    },
    {
      titulo: 'Gorra Trucker Vintage',
      precio: 14999,
      imagenUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=200&q=80',
      variantId: '',
      incluidoPorDefecto: true,
    },
  ],
  bgColor: '#ffffff',
  borderColor: '#10B981',
  textColor: '#000000',
  botonBgColor: '#10B981',
  botonTextColor: '#ffffff',
  badgeBgColor: '#ecfdf5',
  badgeTextColor: '#059669',
  bordesRedondeados: 16,
  paddingInterno: 18,
};

/* ═══════════════════════════════════════════
   SECTION CARD
═══════════════════════════════════════════ */
function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, lineHeight: 1.4 }}>
            {description}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN VIVO
═══════════════════════════════════════════ */
function PackComplementariosPreview({
  config,
  selectedIndices,
  onToggleItem,
}: {
  config: PackComplementariosConfig;
  selectedIndices: number[];
  onToggleItem: (idx: number) => void;
}) {
  // Calcular total sin descuento de items seleccionados
  const totalOriginal = config.items.reduce((acc, item, idx) => {
    return selectedIndices.includes(idx) ? acc + (Number(item.precio) || 0) : acc;
  }, 0);

  const tieneDescuento = config.descuentoPorcentaje > 0 && selectedIndices.length > 1;
  const factorDescuento = tieneDescuento ? (100 - config.descuentoPorcentaje) / 100 : 1;
  const totalFinal = Math.round(totalOriginal * factorDescuento);

  return (
    <div
      style={{
        background: config.bgColor,
        border: `2px solid ${config.borderColor}`,
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 900, fontSize: 15, color: config.textColor, letterSpacing: '-0.01em' }}>
            {config.titulo}
          </div>
          {tieneDescuento && (
            <span
              style={{
                background: config.badgeBgColor,
                color: config.badgeTextColor,
                fontSize: 10,
                fontWeight: 900,
                padding: '3px 8px',
                borderRadius: 999,
                letterSpacing: '0.02em',
              }}
            >
              AHORRÁS {config.descuentoPorcentaje}%
            </span>
          )}
        </div>
        {config.subtexto && (
          <div style={{ fontSize: 12, color: config.textColor, opacity: 0.65, marginTop: 2 }}>
            {config.subtexto}
          </div>
        )}
      </div>

      {/* Lista de productos con checkbox */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {config.items.map((item, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => onToggleItem(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 8,
                borderRadius: 10,
                background: isSelected ? '#f9fafb' : '#ffffff',
                border: isSelected ? '1px solid #e5e7eb' : '1px dashed #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                userSelect: 'none',
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  border: isSelected ? `2px solid ${config.borderColor}` : '2px solid #d1d5db',
                  background: isSelected ? config.borderColor : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                {isSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
              </div>

              {/* Imagen */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#f3f4f6',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.imagenUrl ? (
                  <img src={item.imagenUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 18 }}>🛍️</span>
                )}
              </div>

              {/* Título y Precio */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isSelected ? config.textColor : '#9ca3af',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.titulo || `Producto #${idx + 1}`}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: isSelected ? '#10B981' : '#9ca3af',
                  }}
                >
                  ${(Number(item.precio) || 0).toLocaleString('es-AR')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen Total y Botón de Compra */}
      <div
        style={{
          borderTop: '1px solid #f3f4f6',
          paddingTop: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
            Total por {selectedIndices.length} {selectedIndices.length === 1 ? 'producto' : 'productos'}:
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#000000' }}>
              ${totalFinal.toLocaleString('es-AR')}
            </span>
            {tieneDescuento && (
              <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 600 }}>
                ${totalOriginal.toLocaleString('es-AR')}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={selectedIndices.length === 0}
          style={{
            background: selectedIndices.length === 0 ? '#e5e7eb' : config.botonBgColor,
            color: selectedIndices.length === 0 ? '#9ca3af' : config.botonTextColor,
            border: 'none',
            borderRadius: 10,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 800,
            cursor: selectedIndices.length === 0 ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: selectedIndices.length === 0 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)',
            transition: 'all 0.15s ease',
          }}
        >
          <ShoppingBag size={15} />
          {config.textoBoton}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function PackComplementariosEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<PackComplementariosConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<PackComplementariosConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [selectedPreview, setSelectedPreview] = useState<number[]>([0, 1]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof PackComplementariosConfig>(
    key: K,
    val: PackComplementariosConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const updateItem = (index: number, field: keyof PackItem, value: any) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setConfig((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    if (config.items.length >= 4) return;
    setConfig((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          titulo: 'Accesorio Extra',
          precio: 9999,
          imagenUrl: '',
          variantId: '',
          incluidoPorDefecto: true,
        },
      ],
    }));
    setSelectedPreview((prev) => [...prev, config.items.length]);
  };

  const removeItem = (index: number) => {
    if (config.items.length <= 1) return;
    const newItems = config.items.filter((_, i) => i !== index);
    setConfig((prev) => ({ ...prev, items: newItems }));
    setSelectedPreview((prev) => prev.filter((i) => i !== index));
  };

  const togglePreviewItem = (index: number) => {
    setSelectedPreview((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: widgetDefinition.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string })?.error || 'Error al guardar el widget'
        );
      }

      if ((data as { action?: string }).action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) {
          params.set('product', String(productId));
        }
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error inesperado al guardar';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ─── TAB GENERAL ─── */
  const tabGeneral = (
    <div>
      <FieldInput
        label="Título del bloque de pack"
        value={config.titulo}
        placeholder="🔥 COMBINÁ Y AHORRÁ EN TU PACK"
        onChange={(v) => updateCfg('titulo', v)}
      />

      <FieldInput
        label="Subtexto descriptivo"
        value={config.subtexto}
        placeholder="Llevate estos productos juntos con un descuento especial"
        onChange={(v) => updateCfg('subtexto', v)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#000000', marginBottom: 6 }}>
            % Descuento del combo (opcional)
          </label>
          <input
            type="number"
            min={0}
            max={90}
            value={config.descuentoPorcentaje}
            onChange={(e) => updateCfg('descuentoPorcentaje', Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1.5px solid #e5e7eb',
              fontSize: 14,
              fontWeight: 700,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <FieldInput
          label="Texto del botón de compra"
          value={config.textoBoton}
          placeholder="Agregar pack al carrito"
          onChange={(v) => updateCfg('textoBoton', v)}
        />
      </div>

      {/* GESTIÓN DE PRODUCTOS DEL PACK */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#000000',
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Productos complementarios del pack ({config.items.length}/4)</span>
          {config.items.length < 4 && (
            <button
              type="button"
              onClick={addItem}
              style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Plus size={14} />
              Agregar producto
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {config.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#000000' }}>
                  Producto #{idx + 1}
                </span>
                {config.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 8 }}>
                <input
                  type="text"
                  value={item.titulo}
                  onChange={(e) => updateItem(idx, 'titulo', e.target.value)}
                  placeholder="Nombre del producto..."
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                    background: '#ffffff',
                  }}
                />
                <input
                  type="number"
                  value={item.precio}
                  onChange={(e) => updateItem(idx, 'precio', Number(e.target.value))}
                  placeholder="Precio ($)"
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                    fontWeight: 700,
                    background: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input
                  type="text"
                  value={item.imagenUrl}
                  onChange={(e) => updateItem(idx, 'imagenUrl', e.target.value)}
                  placeholder="URL de imagen (https://...)"
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    background: '#ffffff',
                  }}
                />
                <input
                  type="text"
                  value={item.variantId}
                  onChange={(e) => updateItem(idx, 'variantId', e.target.value)}
                  placeholder="ID de Variante Tiendanube"
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    background: '#ffffff',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* MINI TUTORIAL ID DE VARIANTE */}
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 12,
            padding: '12px 14px',
            marginTop: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>
              ¿Cómo obtener el ID de Variante de cada producto en Tiendanube?
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: '#15803d', lineHeight: 1.5 }}>
            Entrá a tu panel de Tiendanube → <b>Productos</b> → abrí el producto y copiá el número al final de la URL en tu navegador (ej: <code>.../admin/products/<b>12345678</b></code>). Al colocarlo, cuando el cliente toque "Agregar pack al carrito" se sumarán todos los productos tildados en un solo toque.
          </p>
        </div>
      </div>
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores"
        description="Personalizá los colores de fondo, bordes, botón y badges de descuento."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Fondo de la tarjeta"
            value={config.bgColor}
            onChange={(v) => updateCfg('bgColor', v)}
          />
          <ColorPicker
            label="Borde principal y acentos"
            value={config.borderColor}
            onChange={(v) => updateCfg('borderColor', v)}
          />
          <ColorPicker
            label="Texto principal"
            value={config.textColor}
            onChange={(v) => updateCfg('textColor', v)}
          />
          <ColorPicker
            label="Fondo del botón de compra"
            value={config.botonBgColor}
            onChange={(v) => updateCfg('botonBgColor', v)}
          />
          <ColorPicker
            label="Texto del botón de compra"
            value={config.botonTextColor}
            onChange={(v) => updateCfg('botonTextColor', v)}
          />
          <ColorPicker
            label="Fondo del badge de ahorro"
            value={config.badgeBgColor}
            onChange={(v) => updateCfg('badgeBgColor', v)}
          />
          <ColorPicker
            label="Texto del badge de ahorro"
            value={config.badgeTextColor}
            onChange={(v) => updateCfg('badgeTextColor', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Diseño"
        description="Adaptá la estructura espacial y bordes redondeados."
      >
        <Slider
          label="Bordes redondeados"
          value={config.bordesRedondeados}
          min={0}
          max={24}
          onChange={(v) => updateCfg('bordesRedondeados', v)}
        />
        <Slider
          label="Margen/Padding interno"
          value={config.paddingInterno}
          min={8}
          max={28}
          onChange={(v) => updateCfg('paddingInterno', v)}
        />
      </SectionCard>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo size="medium" />
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          NX
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
        {/* Chip de alcance */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: targetType === 'all' ? '#10B981' : '#ffffff',
            color: targetType === 'all' ? '#ffffff' : '#000000',
            border: targetType === 'all' ? 'none' : '1px solid #e5e7eb',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {targetType === 'all' ? 'Todos los productos' : '🛍️ Producto específico'}
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name}
        </h1>

        {/* PREVIEW */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#10B981',
              marginBottom: 12,
            }}
          >
            <Eye size={14} />
            <span>Vista previa interactiva (Probá tildar/destildar)</span>
          </div>
          <PackComplementariosPreview
            config={config}
            selectedIndices={selectedPreview}
            onToggleItem={togglePreviewItem}
          />
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <EditorTabs
            tabs={[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'estilos', label: 'Estilos', icon: '🎨' },
            ]}
          >
            {[tabGeneral, tabEstilos]}
          </EditorTabs>

          {/* GUARDAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #f1f3f5',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? '#10B981' : '#e5e7eb',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background 0.25s ease',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: isActive ? 24 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#ffffff',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                Widget activo
              </span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                background: saving ? '#e5e7eb' : '#10B981',
                color: saving ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.background = '#10B981';
              }}
            >
              {saving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
  }
