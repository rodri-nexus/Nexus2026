'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Eye,
  ExternalLink,
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

export interface SliderCategoriaItem {
  nombre: string;
  subtitulo: string;
  imagenUrl: string;
  link: string;
  destacado: boolean;
}

interface SliderCategoriasConfig {
  titulo: string;
  mostrarTitulo: boolean;
  alturaTarjeta: number;
  anchoTarjeta: number;
  colorTexto: string;
  colorFondo: string;
  colorBordeDestacado: string;
  items: SliderCategoriaItem[];
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: SliderCategoriasConfig = {
  titulo: 'EXPLORÁ NUESTRAS COLECCIONES',
  mostrarTitulo: true,
  alturaTarjeta: 160,
  anchoTarjeta: 120,
  colorTexto: '#ffffff',
  colorFondo: '#ffffff',
  colorBordeDestacado: '#10B981',
  items: [
    {
      nombre: '🔥 LIQUIDACIÓN',
      subtitulo: 'Hasta 40% OFF',
      imagenUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
      link: '/ofertas',
      destacado: true,
    },
    {
      nombre: 'Hombre',
      subtitulo: 'Nueva Colección',
      imagenUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=400&q=80',
      link: '/hombre',
      destacado: false,
    },
    {
      nombre: 'Mujer',
      subtitulo: 'Tendencias',
      imagenUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80',
      link: '/mujer',
      destacado: false,
    },
    {
      nombre: 'Accesorios',
      subtitulo: 'Ver catálogo',
      imagenUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      link: '/accesorios',
      destacado: false,
    },
  ],
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
function SliderCategoriasPreview({ config }: { config: SliderCategoriasConfig }) {
  return (
    <div
      style={{
        background: config.colorFondo,
        border: '1.5px solid #e5e7eb',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {config.mostrarTitulo && config.titulo && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '0.03em',
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          {config.titulo}
        </div>
      )}

      {/* Contenedor Scrollable Horizontal estilo Tarjetas */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 6,
          paddingTop: 2,
          WebkitOverflowScrolling: 'touch',
          justifyContent: config.items.length <= 3 ? 'center' : 'flex-start',
        }}
      >
        {config.items.map((item, idx) => {
          const isHighlight = item.destacado;

          return (
            <div
              key={idx}
              style={{
                width: config.anchoTarjeta,
                height: config.alturaTarjeta,
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                border: isHighlight ? `2.5px solid ${config.colorBordeDestacado}` : '1px solid #e5e7eb',
                boxShadow: isHighlight ? `0 0 10px rgba(16, 185, 129, 0.3)` : '0 2px 6px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                background: '#1f2937',
              }}
            >
              {/* Imagen de fondo */}
              {item.imagenUrl ? (
                <img
                  src={item.imagenUrl}
                  alt={item.nombre}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              ) : null}

              {/* Degradé oscuro sobre la imagen para legibilidad total */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
                }}
              />

              {/* Badge destacado si aplica */}
              {isHighlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: config.colorBordeDestacado,
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 999,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  HOT
                </div>
              )}

              {/* Textos inferiores */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: config.colorTexto,
                    lineHeight: 1.2,
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  }}
                >
                  {item.nombre || `Categoría ${idx + 1}`}
                </span>
                {item.subtitulo && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: config.colorTexto,
                      opacity: 0.85,
                      lineHeight: 1.1,
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    {item.subtitulo}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function SliderCategoriasEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<SliderCategoriasConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<SliderCategoriasConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof SliderCategoriasConfig>(
    key: K,
    val: SliderCategoriasConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const updateItem = (index: number, field: keyof SliderCategoriaItem, value: any) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setConfig((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    if (config.items.length >= 8) return;
    setConfig((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          nombre: `Categoría ${prev.items.length + 1}`,
          subtitulo: 'Ver más',
          imagenUrl: '',
          link: '#',
          destacado: false,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (config.items.length <= 1) return;
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#000000' }}>
          Mostrar título de la sección
        </span>
        <input
          type="checkbox"
          checked={config.mostrarTitulo}
          onChange={(e) => updateCfg('mostrarTitulo', e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#10B981', cursor: 'pointer' }}
        />
      </div>

      {config.mostrarTitulo && (
        <FieldInput
          label="Título de la sección"
          value={config.titulo}
          placeholder="EXPLORÁ NUESTRAS COLECCIONES"
          onChange={(v) => updateCfg('titulo', v)}
        />
      )}

      {/* GUÍA RÁPIDA DE FOTOS */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: 14,
          padding: '16px',
          margin: '16px 0 22px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
            ¿Cómo obtener las URLs de las fotos?
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#15803d', lineHeight: 1.55 }}>
          <b>Desde el celular:</b> Mantené presionado el dedo sobre cualquier imagen de tu tienda y tocá <b>"Copiar dirección de la imagen"</b>.<br />
          <b>Desde la PC:</b> Clic derecho en la foto ➔ <b>"Copiar dirección de imagen"</b>.
        </div>
      </div>

      {/* GESTIÓN DE TARJETAS */}
      <div style={{ marginTop: 10 }}>
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
          <span>Tarjetas de Colecciones ({config.items.length}/8)</span>
          {config.items.length < 8 && (
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
              Agregar tarjeta
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
                  Tarjeta #{idx + 1}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: item.destacado ? '#059669' : '#6b7280', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.destacado}
                      onChange={(e) => updateItem(idx, 'destacado', e.target.checked)}
                    />
                    Destacada (Borde + Badge HOT)
                  </label>

                  {config.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 2 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    Título principal:
                  </label>
                  <input
                    type="text"
                    value={item.nombre}
                    onChange={(e) => updateItem(idx, 'nombre', e.target.value)}
                    placeholder="Ej: Hombre"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 13,
                      fontWeight: 700,
                      background: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    Subtítulo (opcional):
                  </label>
                  <input
                    type="text"
                    value={item.subtitulo}
                    onChange={(e) => updateItem(idx, 'subtitulo', e.target.value)}
                    placeholder="Ej: Nueva Colección"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 13,
                      background: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    Link de destino:
                  </label>
                  <input
                    type="text"
                    value={item.link}
                    onChange={(e) => updateItem(idx, 'link', e.target.value)}
                    placeholder="Ej: /hombre"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 12,
                      background: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    URL de la foto:
                  </label>
                  <input
                    type="text"
                    value={item.imagenUrl}
                    onChange={(e) => updateItem(idx, 'imagenUrl', e.target.value)}
                    placeholder="https://.../foto.jpg"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 12,
                      background: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
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
        description="Personalizá los colores de fondo, textos y bordes destacados."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Fondo de la sección"
            value={config.colorFondo}
            onChange={(v) => updateCfg('colorFondo', v)}
          />
          <ColorPicker
            label="Color del texto sobre la foto"
            value={config.colorTexto}
            onChange={(v) => updateCfg('colorTexto', v)}
          />
          <ColorPicker
            label="Color del borde y badge destacado"
            value={config.colorBordeDestacado}
            onChange={(v) => updateCfg('colorBordeDestacado', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="📐"
        title="Dimensiones de las Tarjetas"
        description="Ajustá la altura y anchura para que se adapte perfecto al diseño de tu tienda."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Slider
            label="Altura de tarjeta (px)"
            value={config.alturaTarjeta}
            min={120}
            max={240}
            onChange={(v) => updateCfg('alturaTarjeta', v)}
          />
          <Slider
            label="Ancho de tarjeta (px)"
            value={config.anchoTarjeta}
            min={90}
            max={180}
            onChange={(v) => updateCfg('anchoTarjeta', v)}
          />
        </div>
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
          {targetType === 'all' ? 'Todos los productos / Inicio' : '🛍️ Producto específico'}
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
            <span>Vista previa interactiva (Scroll horizontal)</span>
          </div>
          <SliderCategoriasPreview config={config} />
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
