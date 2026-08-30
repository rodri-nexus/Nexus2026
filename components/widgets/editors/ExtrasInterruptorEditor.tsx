'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ColorPicker,
  Slider,
  FieldInput,
  FieldSelect,
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

interface ExtrasInterruptorConfig {
  titulo: string;
  precioTexto: string;
  badgeTexto: string;
  mostrarBadge: boolean;
  colorBadge: string;
  colorTextoBadge: string;
  textoVerMas: string;
  mostrarVerMas: boolean;
  linkVerMas: string;
  imagenUrl: string;
  variantId: string;
  colorFondo: string;
  colorTitulo: string;
  colorPrecio: string;
  colorBorde: string;
  colorSwitchOn: string;
  colorSwitchOff: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: ExtrasInterruptorConfig = {
  titulo: 'SACO GRIS',
  precioTexto: '$59.999',
  badgeTexto: 'PROMO',
  mostrarBadge: true,
  colorBadge: '#dc2626',
  colorTextoBadge: '#ffffff',
  textoVerMas: 'VER MÁS',
  mostrarVerMas: true,
  linkVerMas: '#',
  imagenUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=150&q=80',
  variantId: '',
  colorFondo: '#fffdf5',
  colorTitulo: '#1f2937',
  colorPrecio: '#111827',
  colorBorde: '#fcd34d',
  colorSwitchOn: '#10B981',
  colorSwitchOff: '#e5e7eb',
  bordesRedondeados: 16,
  paddingInterno: 14,
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
   PREVIEW EN VIVO (Misma estructura de tu imagen)
═══════════════════════════════════════════ */
function ExtrasInterruptorPreview({
  config,
  forceOn,
  onToggle,
}: {
  config: ExtrasInterruptorConfig;
  forceOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        background: config.colorFondo,
        border: `2px solid ${config.colorBorde}`,
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Columna Izquierda: Imagen + Ver Más */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 8,
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {config.imagenUrl ? (
            <img
              src={config.imagenUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: 20 }}>👔</span>
          )}
        </div>
        {config.mostrarVerMas && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: '#000000',
              textDecoration: 'underline',
              letterSpacing: '0.03em',
            }}
          >
            {config.textoVerMas || 'VER MÁS'}
          </span>
        )}
      </div>

      {/* Columna Central: Título + Precio + Badge PROMO */}
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: config.colorTitulo,
            lineHeight: 1.2,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {config.titulo || 'PRODUCTO EXTRA'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: config.colorPrecio,
              letterSpacing: '-0.02em',
            }}
          >
            {config.precioTexto || '$0'}
          </span>

          {config.mostrarBadge && config.badgeTexto && (
            <span
              style={{
                background: config.colorBadge,
                color: config.colorTextoBadge,
                fontSize: 10,
                fontWeight: 900,
                padding: '2px 7px',
                borderRadius: 4,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              {config.badgeTexto}
            </span>
          )}
        </div>
      </div>

      {/* Columna Derecha: Interruptor Switch */}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle extra"
        style={{
          width: 54,
          height: 30,
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          background: forceOn ? config.colorSwitchOn : config.colorSwitchOff,
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.2s ease',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: forceOn ? 27 : 3,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'left 0.2s ease',
          }}
        />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function ExtrasInterruptorEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<ExtrasInterruptorConfig>(() => {
    if (existingWidget?.config) {
      return { ...DEFAULT_CONFIG, ...(existingWidget.config as Partial<ExtrasInterruptorConfig>) };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [previewOn, setPreviewOn] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof ExtrasInterruptorConfig>(
    key: K,
    val: ExtrasInterruptorConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
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
        label="Nombre / Título del producto extra"
        value={config.titulo}
        placeholder="SACO GRIS"
        onChange={(v) => updateCfg('titulo', v)}
      />

      <FieldInput
        label="Precio"
        value={config.precioTexto}
        placeholder="$59.999"
        onChange={(v) => updateCfg('precioTexto', v)}
      />

      <FieldInput
        label="Texto de etiqueta (ej: PROMO / 15% OFF)"
        value={config.badgeTexto}
        placeholder="PROMO"
        onChange={(v) => updateCfg('badgeTexto', v)}
      />

      <FieldInput
        label="URL de la imagen del producto"
        value={config.imagenUrl}
        placeholder="https://..."
        onChange={(v) => updateCfg('imagenUrl', v)}
      />

      <FieldInput
        label="Texto de enlace 'Ver más'"
        value={config.textoVerMas}
        placeholder="VER MÁS"
        onChange={(v) => updateCfg('textoVerMas', v)}
      />

      <FieldInput
        label="ID de variante Tiendanube (opcional para el carrito)"
        value={config.variantId}
        placeholder="Ej: 123456789"
        onChange={(v) => updateCfg('variantId', v)}
      />
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores"
        description="Personalizá los colores del fondo, texto, badge y switch."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Color de fondo"
            value={config.colorFondo}
            onChange={(v) => updateCfg('colorFondo', v)}
          />
          <ColorPicker
            label="Color del título"
            value={config.colorTitulo}
            onChange={(v) => updateCfg('colorTitulo', v)}
          />
          <ColorPicker
            label="Color del precio"
            value={config.colorPrecio}
            onChange={(v) => updateCfg('colorPrecio', v)}
          />
          <ColorPicker
            label="Color del borde"
            value={config.colorBorde}
            onChange={(v) => updateCfg('colorBorde', v)}
          />
          <ColorPicker
            label="Fondo del badge PROMO"
            value={config.colorBadge}
            onChange={(v) => updateCfg('colorBadge', v)}
          />
          <ColorPicker
            label="Texto del badge PROMO"
            value={config.colorTextoBadge}
            onChange={(v) => updateCfg('colorTextoBadge', v)}
          />
          <ColorPicker
            label="Switch encendido (ON)"
            value={config.colorSwitchOn}
            onChange={(v) => updateCfg('colorSwitchOn', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Diseño"
        description="Ajustá bordes y márgenes de la tarjeta."
      >
        <Slider
          label="Bordes redondeados"
          value={config.bordesRedondeados}
          min={0}
          max={24}
          onChange={(v) => updateCfg('bordesRedondeados', v)}
        />
        <Slider
          label="Padding interno"
          value={config.paddingInterno}
          min={8}
          max={24}
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

        {/* PREVIEW IDÉNTICO A LA IMAGEN DE REFERENCIA */}
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
          <ExtrasInterruptorPreview
            config={config}
            forceOn={previewOn}
            onToggle={() => setPreviewOn((v) => !v)}
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
