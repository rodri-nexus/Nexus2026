'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Eye,
  Star,
  CheckCircle2,
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

export interface ReviewFotoItem {
  nombre: string;
  texto: string;
  estrellas: number;
  imagenUrl: string;
  datosExtra: string; // ej: "Comprador verificado", "Hace 2 días"
  verificada: boolean;
}

interface ResenasFotoConfig {
  titulo: string;
  mostrarTitulo: boolean;
  colorEstrellas: string;
  colorTexto: string;
  colorFondo: string;
  colorTarjeta: string;
  items: ReviewFotoItem[];
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: ResenasFotoConfig = {
  titulo: 'LO QUE DICEN NUESTROS COMPRADORES',
  mostrarTitulo: true,
  colorEstrellas: '#fbbf24', // Dorado
  colorTexto: '#111827',
  colorFondo: '#ffffff',
  colorTarjeta: '#f9fafb',
  items: [
    {
      nombre: 'Sofía R.',
      texto: '¡Espectacular la campera! La calidad es de primera y el talle M me quedó justo como quería. Llegó súper rápido.',
      estrellas: 5,
      imagenUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      datosExtra: 'Buenos Aires',
      verificada: true,
    },
    {
      nombre: 'Lucas M.',
      texto: 'Las remeras oversize son un 10 de 10. Algodón pesado muy premium, ya las lavé y no achicaron nada. Recomiendo.',
      estrellas: 5,
      imagenUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      datosExtra: 'Córdoba',
      verificada: true,
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
function ResenasFotoPreview({ config }: { config: ResenasFotoConfig }) {
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

      {/* Grid o scroll horizontal para reviews */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 6,
          paddingTop: 2,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {config.items.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: 190,
              background: config.colorTarjeta,
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 10,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            {/* Foto de reseña */}
            <div
              style={{
                width: '100%',
                height: 110,
                borderRadius: 8,
                background: '#f3f4f6',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {item.imagenUrl ? (
                <img
                  src={item.imagenUrl}
                  alt={item.nombre}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  📸
                </div>
              )}
            </div>

            {/* Header del testimonio (Estrellas + Verificado) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 1 }}>
                {Array.from({ length: 5 }).map((_, sIdx) => (
                  <Star
                    key={sIdx}
                    size={11}
                    fill={sIdx < item.estrellas ? config.colorEstrellas : 'transparent'}
                    color={sIdx < item.estrellas ? config.colorEstrellas : '#d1d5db'}
                  />
                ))}
              </div>
              {item.verificada && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#10b981', fontSize: 9, fontWeight: 700 }}>
                  <CheckCircle2 size={10} fill="#10b981" color="#ffffff" />
                  <span>Verificado</span>
                </div>
              )}
            </div>

            {/* Texto de opinión */}
            <p
              style={{
                fontSize: 10.5,
                color: config.colorTexto,
                margin: 0,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              "{item.texto}"
            </p>

            {/* Footer con datos del cliente */}
            <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: 6, marginTop: 'auto' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#111827' }}>
                {item.nombre}
              </div>
              {item.datosExtra && (
                <div style={{ fontSize: 9, color: '#6b7280', marginTop: 1 }}>
                  {item.datosExtra}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function ResenasFotoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<ResenasFotoConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<ResenasFotoConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof ResenasFotoConfig>(
    key: K,
    val: ResenasFotoConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const updateItem = (index: number, field: keyof ReviewFotoItem, value: any) => {
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
          nombre: `Cliente`,
          texto: 'Excelente compra, muy conforme con todo.',
          estrellas: 5,
          imagenUrl: '',
          datosExtra: 'Comprador verificado',
          verificada: true,
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
          placeholder="LO QUE DICEN NUESTROS COMPRADORES"
          onChange={(v) => updateCfg('titulo', v)}
        />
      )}

      {/* TUTORIAL DE IMÁGENES */}
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
          <span style={{ fontSize: 18 }}>📸</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
            ¿Cómo subir fotos reales de tus clientes?
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#15803d', lineHeight: 1.55 }}>
          Podés subir fotos que tus clientes te manden por WhatsApp o Instagram. <br />
          <b>¿Cómo obtener la URL?:</b> Podés subirlas primero a tu hosting, subirlas como imágenes de un producto oculto en tu Tiendanube, o usar un servidor gratuito de imágenes como <code>postimages.org</code> o <code>imgur.com</code> para copiar el "Enlace directo" de la imagen (que termine en <code>.jpg</code> o <code>.png</code>).
        </div>
      </div>

      {/* GESTIÓN DE RESEÑAS */}
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
          <span>Opiniones ({config.items.length}/8)</span>
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
              Agregar opinión
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
                  Reseña #{idx + 1}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: item.verificada ? '#059669' : '#6b7280', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.verificada}
                      onChange={(e) => updateItem(idx, 'verificada', e.target.checked)}
                    />
                    Comprador Verificado (Badge Verde)
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

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 10, marginBottom: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    Nombre del cliente:
                  </label>
                  <input
                    type="text"
                    value={item.nombre}
                    onChange={(e) => updateItem(idx, 'nombre', e.target.value)}
                    placeholder="Ej: María P."
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
                    Ubicación / Fecha:
                  </label>
                  <input
                    type="text"
                    value={item.datosExtra}
                    onChange={(e) => updateItem(idx, 'datosExtra', e.target.value)}
                    placeholder="Ej: Mendoza"
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

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    Estrellas:
                  </label>
                  <select
                    value={item.estrellas}
                    onChange={(e) => updateItem(idx, 'estrellas', Number(e.target.value))}
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
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    Opinión del cliente:
                  </label>
                  <textarea
                    value={item.texto}
                    onChange={(e) => updateItem(idx, 'texto', e.target.value)}
                    placeholder="Escribí aquí lo que opina el cliente de tu producto..."
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 12.5,
                      background: '#ffffff',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                  URL directa de la foto del producto/cliente:
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
                    boxSizing: 'border-box',
                    background: '#ffffff',
                  }}
                />
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
        description="Personalizá los colores de fondo, tarjetas, textos y estrellas."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Fondo de la sección"
            value={config.colorFondo}
            onChange={(v) => updateCfg('colorFondo', v)}
          />
          <ColorPicker
            label="Fondo de cada tarjeta"
            value={config.colorTarjeta}
            onChange={(v) => updateCfg('colorTarjeta', v)}
          />
          <ColorPicker
            label="Color del texto"
            value={config.colorTexto}
            onChange={(v) => updateCfg('colorTexto', v)}
          />
          <ColorPicker
            label="Color de las estrellas"
            value={config.colorEstrellas}
            onChange={(v) => updateCfg('colorEstrellas', v)}
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
            <span>Vista previa interactiva (Muro de opiniones)</span>
          </div>
          <ResenasFotoPreview config={config} />
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
