'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Eye,
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
   PRESETS DE FECHAS ESPECIALES LOCALES (Regla #9)
═══════════════════════════════════════════ */
const CIRCULOS_CAMPAIGN_THEMES: Record<
  string,
  {
    name: string;
    themeColor: string;
    accentColor: string;
    colorFondo: string;
    colorTexto: string;
    colorBordeActivo: string;
    colorBordeInactivo: string;
    tag: string;
    description: string;
  }
> = {
  none: {
    name: 'Diseño Normal / Sin Evento',
    themeColor: '#10B981',
    accentColor: '#10B981',
    colorFondo: '#ffffff',
    colorTexto: '#000000',
    colorBordeActivo: '#10B981',
    colorBordeInactivo: '#e5e7eb',
    tag: 'DEFAULT',
    description: 'Mantiene los colores configurados en la pestaña Estilos.',
  },
  'black-friday': {
    name: '🔥 Black Friday',
    themeColor: '#111827',
    accentColor: '#F59E0B',
    colorFondo: '#111827',
    colorTexto: '#FFFFFF',
    colorBordeActivo: '#F59E0B',
    colorBordeInactivo: '#374151',
    tag: 'BLACK FRIDAY',
    description: 'Fondo negro con aros dorados neón para el evento insignia.',
  },
  'hot-sale': {
    name: '⚡ Hot Sale',
    themeColor: '#0F172A',
    accentColor: '#EF4444',
    colorFondo: '#0F172A',
    colorTexto: '#FFFFFF',
    colorBordeActivo: '#EF4444',
    colorBordeInactivo: '#334155',
    tag: 'HOT SALE',
    description: 'Azul noche profundo con aros activos en rojo fuego.',
  },
  'cyber-monday': {
    name: '🚀 Cyber Monday',
    themeColor: '#090D16',
    accentColor: '#3B82F6',
    colorFondo: '#090D16',
    colorTexto: '#FFFFFF',
    colorBordeActivo: '#3B82F6',
    colorBordeInactivo: '#1E293B',
    tag: 'CYBER MONDAY',
    description: 'Estética cyber futurista con aros y acentos azul neón.',
  },
  navidad: {
    name: '🎄 Navidad & Reyes',
    themeColor: '#064E3B',
    accentColor: '#EF4444',
    colorFondo: '#064E3B',
    colorTexto: '#FFFFFF',
    colorBordeActivo: '#10B981',
    colorBordeInactivo: '#065F46',
    tag: 'NAVIDAD',
    description: 'Verde pino de fondo con aros en rojo alegre.',
  },
  'san-valentin': {
    name: '💘 San Valentín',
    themeColor: '#831843',
    accentColor: '#F43F5E',
    colorFondo: '#831843',
    colorTexto: '#FFFFFF',
    colorBordeActivo: '#F43F5E',
    colorBordeInactivo: '#9D174D',
    tag: 'SAN VALENTÍN',
    description: 'Tono vino y rosa apasionado para fechas románticas.',
  },
  'dia-madre-padre': {
    name: '🎁 Día de la Madre / Padre',
    themeColor: '#312E81',
    accentColor: '#10B981',
    colorFondo: '#312E81',
    colorTexto: '#FFFFFF',
    colorBordeActivo: '#10B981',
    colorBordeInactivo: '#3730A3',
    tag: 'SPECIAL DAY',
    description: 'Fondo índigo sofisticado con aros destacados esmeralda.',
  },
  'sale-liquidacion': {
    name: '🏷️ Liquidación / Sale',
    themeColor: '#7F1D1D',
    accentColor: '#FBBF24',
    colorFondo: '#7F1D1D',
    colorTexto: '#FFFFFF',
    colorBordeActivo: '#FBBF24',
    colorBordeInactivo: '#991B1B',
    tag: 'LIQUIDACIÓN',
    description: 'Fondo rojo liquidación con aros amarillos de alto contraste.',
  },
};

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9)
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

export interface CirculoItem {
  nombre: string;
  imagenUrl: string;
  link: string;
  destacado: boolean;
}

interface MenuCirculosConfig {
  titulo: string;
  mostrarTitulo: boolean;
  tamanoCirculo: number;
  colorBordeActivo: string;
  colorBordeInactivo: string;
  colorTexto: string;
  colorFondo: string;
  items: CirculoItem[];
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: MenuCirculosConfig = {
  titulo: 'CATEGORÍAS DESTACADAS',
  mostrarTitulo: true,
  tamanoCirculo: 66,
  colorBordeActivo: '#10B981',
  colorBordeInactivo: '#e5e7eb',
  colorTexto: '#000000',
  colorFondo: '#ffffff',
  items: [
    {
      nombre: '🔥 Ofertas',
      imagenUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=150&q=80',
      link: '/ofertas',
      destacado: true,
    },
    {
      nombre: 'Tecnología',
      imagenUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80',
      link: '/tecnologia',
      destacado: false,
    },
    {
      nombre: 'Uso Personal',
      imagenUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=150&q=80',
      link: '/uso-personal',
      destacado: false,
    },
    {
      nombre: 'Belleza',
      imagenUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&q=80',
      link: '/belleza',
      destacado: false,
    },
  ],
  campaignTheme: 'none',
};

/* ═══════════════════════════════════════════
   PREVIEW EN VIVO
═══════════════════════════════════════════ */
function MenuCirculosPreview({ config }: { config: MenuCirculosConfig }) {
  const themeKey = config.campaignTheme || 'none';
  const theme = CIRCULOS_CAMPAIGN_THEMES[themeKey] || CIRCULOS_CAMPAIGN_THEMES.none;
  const isCustomTheme = themeKey !== 'none';

  const colorFondo = isCustomTheme ? theme.colorFondo : config.colorFondo;
  const colorTexto = isCustomTheme ? theme.colorTexto : config.colorTexto;
  const colorBordeActivo = isCustomTheme ? theme.colorBordeActivo : config.colorBordeActivo;
  const colorBordeInactivo = isCustomTheme ? theme.colorBordeInactivo : config.colorBordeInactivo;

  return (
    <div
      style={{
        background: colorFondo,
        border: isCustomTheme ? `1px solid ${colorBordeActivo}55` : '1px solid #e5e7eb',
        borderRadius: 16,
        padding: 16,
        boxShadow: isCustomTheme ? `0 4px 20px ${colorBordeActivo}22` : '0 4px 14px rgba(0,0,0,0.03)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {config.mostrarTitulo && config.titulo && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: colorTexto,
            letterSpacing: '0.03em',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {config.titulo}
        </div>
      )}

      {/* Contenedor Scrollable Horizontal estilo Stories */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingBottom: 6,
          paddingTop: 4,
          WebkitOverflowScrolling: 'touch',
          justifyContent: config.items.length <= 4 ? 'center' : 'flex-start',
        }}
      >
        {config.items.map((item, idx) => {
          const borderColor = item.destacado ? colorBordeActivo : colorBordeInactivo;
          const size = config.tamanoCirculo;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                width: size + 8,
                cursor: 'pointer',
              }}
            >
              {/* Aro exterior */}
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  padding: 2.5,
                  border: `2px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  boxShadow: item.destacado ? `0 0 0 2px ${colorBordeActivo}33` : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Imagen interior */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.imagenUrl ? (
                    <img
                      src={item.imagenUrl}
                      alt={item.nombre}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement && !target.parentElement.querySelector('.nvx-preview-fallback')) {
                          const span = document.createElement('span');
                          span.className = 'nvx-preview-fallback';
                          span.style.fontSize = `${Math.round(size * 0.35)}px`;
                          span.innerText = '🛍️';
                          target.parentElement.appendChild(span);
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: size * 0.35 }}>🛍️</span>
                  )}
                </div>
              </div>

              {/* Texto debajo */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: item.destacado ? 800 : 600,
                  color: colorTexto,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {item.nombre || `Categoría ${idx + 1}`}
              </span>
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
export default function MenuCirculosEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'general' | 'estilos' | 'fechas'>('general');
  const [config, setConfig] = useState<MenuCirculosConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<MenuCirculosConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof MenuCirculosConfig>(
    key: K,
    val: MenuCirculosConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const updateItem = (index: number, field: keyof CirculoItem, value: any) => {
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
          placeholder="CATEGORÍAS DESTACADAS"
          onChange={(v) => updateCfg('titulo', v)}
        />
      )}

      {/* MINI TUTORIAL REFORZADO */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: 14,
          padding: '16px',
          margin: '16px 0 22px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>📸</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
            Guía rápida: ¿Cómo obtener la URL directa de tus fotos?
          </span>
        </div>

        <div style={{ fontSize: 12, color: '#15803d', lineHeight: 1.6 }}>
          <div style={{ marginBottom: 8 }}>
            Para que la foto se vea perfecta en tu tienda, necesitás el <b>enlace directo al archivo de imagen</b> (que termina en <code>.jpg</code>, <code>.png</code> o <code>.webp</code>):
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #bbf7d0',
              borderRadius: 10,
              padding: '10px 12px',
              marginBottom: 10,
            }}
          >
            <div style={{ fontWeight: 800, color: '#166534', marginBottom: 4 }}>
              📱 Si estás desde el Celular:
            </div>
            1. Abrí tu tienda o foto en el navegador (Chrome o Safari).<br />
            2. Mantené el <b>dedo presionado</b> sobre la imagen durante 1 segundo.<br />
            3. Elegí la opción <b>"Copiar dirección de la imagen"</b> (o "Copiar enlace de imagen").<br />
            4. Pegalo en el casillero <i>"URL de la imagen"</i> aquí abajo.
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #bbf7d0',
              borderRadius: 10,
              padding: '10px 12px',
              marginBottom: 10,
            }}
          >
            <div style={{ fontWeight: 800, color: '#166534', marginBottom: 4 }}>
              💻 Si estás desde la Computadora:
            </div>
            Hacé <b>clic derecho</b> sobre cualquier imagen de tus productos y elegí <b>"Copiar dirección de imagen"</b>.
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#b45309',
              background: '#fffbeb',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #fde68a',
            }}
          >
            <span>⚠️</span>
            <span>
              NO pegues el link de la página ni de búsquedas de Google. Debe ser el link directo a la foto.
            </span>
          </div>
        </div>
      </div>

      {/* GESTIÓN DE CÍRCULOS */}
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
          <span>Círculos / Categorías ({config.items.length}/8)</span>
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
              Agregar círculo
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
                  Círculo #{idx + 1}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: item.destacado ? '#059669' : '#6b7280', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.destacado}
                      onChange={(e) => updateItem(idx, 'destacado', e.target.checked)}
                    />
                    Aro Destacado
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
                    Nombre visible:
                  </label>
                  <input
                    type="text"
                    value={item.nombre}
                    onChange={(e) => updateItem(idx, 'nombre', e.target.value)}
                    placeholder="Ej: Tecnología"
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
                    Link de destino:
                  </label>
                  <input
                    type="text"
                    value={item.link}
                    onChange={(e) => updateItem(idx, 'link', e.target.value)}
                    placeholder="Ej: /tecnologia"
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

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                  URL directa de la imagen (.jpg / .png):
                </label>
                <input
                  type="text"
                  value={item.imagenUrl}
                  onChange={(e) => updateItem(idx, 'imagenUrl', e.target.value)}
                  placeholder="https://mitienda.com/imagen.jpg"
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
        description="Personalizá los colores de fondo, textos y aros."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Fondo de la barra"
            value={config.colorFondo}
            onChange={(v) => updateCfg('colorFondo', v)}
          />
          <ColorPicker
            label="Color del texto"
            value={config.colorTexto}
            onChange={(v) => updateCfg('colorTexto', v)}
          />
          <ColorPicker
            label="Color del aro activo / destacado"
            value={config.colorBordeActivo}
            onChange={(v) => updateCfg('colorBordeActivo', v)}
          />
          <ColorPicker
            label="Color del aro inactivo"
            value={config.colorBordeInactivo}
            onChange={(v) => updateCfg('colorBordeInactivo', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Tamaño"
        description="Ajustá el diámetro de los círculos."
      >
        <Slider
          label="Diámetro del círculo (px)"
          value={config.tamanoCirculo}
          min={50}
          max={90}
          onChange={(v) => updateCfg('tamanoCirculo', v)}
        />
      </SectionCard>
    </div>
  );

  /* ─── TAB FECHAS ESPECIALES ─── */
  const tabFechas = (
    <div>
      <div
        style={{
          background:
            config.campaignTheme && config.campaignTheme !== 'none'
              ? '#eff6ff'
              : '#f8fafc',
          border: `1px solid ${
            config.campaignTheme && config.campaignTheme !== 'none'
              ? '#bfdbfe'
              : '#e2e8f0'
          }`,
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 24 }}>
          {config.campaignTheme && config.campaignTheme !== 'none' ? '🔥' : '✨'}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
            {config.campaignTheme && config.campaignTheme !== 'none'
              ? `Evento activo: ${CIRCULOS_CAMPAIGN_THEMES[config.campaignTheme]?.name || 'Personalizado'}`
              : 'Diseño Normal activo'}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {config.campaignTheme && config.campaignTheme !== 'none'
              ? 'La barra e historias destacadas adaptarán automáticamente toda su paleta visual de aros activos/inactivos al evento comercial.'
              : 'El widget respeta los colores estándar configurados en la pestaña Estilos.'}
          </div>
        </div>
        {config.campaignTheme && config.campaignTheme !== 'none' && (
          <button
            type="button"
            onClick={() => updateCfg('campaignTheme', 'none')}
            style={{
              padding: '6px 12px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Restablecer
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {Object.entries(CIRCULOS_CAMPAIGN_THEMES).map(([key, theme]) => {
          const isSelected = (config.campaignTheme || 'none') === key;
          return (
            <div
              key={key}
              onClick={() => updateCfg('campaignTheme', key)}
              style={{
                background: isSelected ? '#ffffff' : '#fafafa',
                border: isSelected ? '2px solid #10B981' : '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.12)' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: isSelected ? '#10B981' : '#111827',
                  }}
                >
                  {theme.name}
                </span>
                {isSelected && (
                  <span
                    style={{
                      background: '#10B981',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    ACTIVO
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  margin: '0 0 10px 0',
                  lineHeight: 1.4,
                }}
              >
                {theme.description}
              </p>
              {key !== 'none' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: theme.colorFondo,
                      border: '1px solid #d1d5db',
                    }}
                    title="Color de fondo"
                  />
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: theme.colorBordeActivo,
                      border: '1px solid #d1d5db',
                    }}
                    title="Color de aro activo"
                  />
                  <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>
                    Paleta del evento
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
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
          <MenuCirculosPreview config={config} />
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
              { id: 'fechas', label: 'Fechas Especiales', icon: '🔥' },
            ]}
          >
            {[tabGeneral, tabEstilos, tabFechas]}
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
