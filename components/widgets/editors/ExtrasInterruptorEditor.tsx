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
  subtitulo: string;
  precioTexto: string;
  variantId: string;
  textoActivo: string;
  textoInactivo: string;
  switchInicialOn: boolean;
  colorFondo: string;
  colorTitulo: string;
  colorSubtitulo: string;
  colorPrecio: string;
  colorBorde: string;
  colorSwitchOn: string;
  colorSwitchOff: string;
  tamanoTitulo: string;
  tamanoSubtitulo: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: ExtrasInterruptorConfig = {
  titulo: '⚡ Garantía extendida 12 meses',
  subtitulo: 'Protección total contra fallas y accidentes',
  precioTexto: '+$3.500',
  variantId: '',
  textoActivo: 'Agregado al carrito',
  textoInactivo: 'Agregar al carrito',
  switchInicialOn: false,
  colorFondo: '#ffffff',
  colorTitulo: '#000000',
  colorSubtitulo: '#6b7280',
  colorPrecio: '#10B981',
  colorBorde: '#10B981',
  colorSwitchOn: '#10B981',
  colorSwitchOff: '#e5e7eb',
  tamanoTitulo: '15px',
  tamanoSubtitulo: '13px',
  bordesRedondeados: 12,
  paddingInterno: 14,
};

const TAMANO_OPTIONS = [
  { value: '12px', label: '12px' },
  { value: '13px', label: '13px' },
  { value: '14px', label: '14px' },
  { value: '15px', label: '15px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
];

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
        border: `1.5px solid ${config.colorBorde}`,
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: '0 2px 10px rgba(16, 185, 129, 0.08)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: config.tamanoTitulo,
            fontWeight: 800,
            color: config.colorTitulo,
            lineHeight: 1.25,
            marginBottom: 4,
          }}
        >
          {config.titulo || 'Título del extra'}
        </div>
        {config.subtitulo ? (
          <div
            style={{
              fontSize: config.tamanoSubtitulo,
              color: config.colorSubtitulo,
              lineHeight: 1.35,
              marginBottom: 6,
            }}
          >
            {config.subtitulo}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: config.colorPrecio,
          }}
        >
          {config.precioTexto || '+$0'}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            fontWeight: 600,
            color: forceOn ? config.colorSwitchOn : '#9ca3af',
          }}
        >
          {forceOn ? config.textoActivo : config.textoInactivo}
        </div>
      </div>

      {/* Switch */}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle extra"
        style={{
          width: 52,
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
            left: forceOn ? 24 : 3,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
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
  const [previewOn, setPreviewOn] = useState<boolean>(
    existingWidget?.config
      ? Boolean((existingWidget.config as Partial<ExtrasInterruptorConfig>).switchInicialOn)
      : DEFAULT_CONFIG.switchInicialOn
  );
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
        label="Título del extra"
        value={config.titulo}
        placeholder="⚡ Garantía extendida 12 meses"
        onChange={(v) => updateCfg('titulo', v)}
      />
      <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: -10, marginBottom: 16 }}>
        El texto principal que ve el cliente al lado del interruptor
      </div>

      <FieldInput
        label="Subtítulo (opcional)"
        value={config.subtitulo}
        placeholder="Protección total contra fallas y accidentes"
        onChange={(v) => updateCfg('subtitulo', v)}
      />
      <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: -10, marginBottom: 16 }}>
        Descripción corta debajo del título
      </div>

      <FieldInput
        label="Precio a mostrar"
        value={config.precioTexto}
        placeholder="+$3.500"
        onChange={(v) => updateCfg('precioTexto', v)}
      />
      <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: -10, marginBottom: 16 }}>
        Texto del precio (ej: +$3.500 o + R$ 19,90)
      </div>

      <FieldInput
        label="ID de variante Tiendanube (para el carrito)"
        value={config.variantId}
        placeholder="Ej: 123456789"
        onChange={(v) => updateCfg('variantId', v)}
      />
      <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: -10, marginBottom: 16 }}>
        Es el variant_id del producto extra. Cuando activemos el script, al prender el switch se
        sumará al carrito.
      </div>

      <FieldInput
        label="Texto cuando está OFF"
        value={config.textoInactivo}
        placeholder="Agregar al carrito"
        onChange={(v) => updateCfg('textoInactivo', v)}
      />

      <FieldInput
        label="Texto cuando está ON"
        value={config.textoActivo}
        placeholder="Agregado al carrito"
        onChange={(v) => updateCfg('textoActivo', v)}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 14px',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: '#fafafa',
          marginTop: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#000000' }}>
            Switch iniciado en ON
          </div>
          <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 2 }}>
            Si está activo, el extra aparece prendido por defecto
          </div>
        </div>
        <button
          type="button"
          onClick={() => updateCfg('switchInicialOn', !config.switchInicialOn)}
          style={{
            width: 48,
            height: 26,
            borderRadius: 13,
            border: 'none',
            cursor: 'pointer',
            background: config.switchInicialOn ? '#10B981' : '#e5e7eb',
            position: 'relative',
            flexShrink: 0,
            transition: 'background 0.2s ease',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: config.switchInicialOn ? 24 : 3,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              transition: 'left 0.2s ease',
            }}
          />
        </button>
      </div>
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores"
        description="Personalizá fondo, textos, precio y colores del interruptor."
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
            label="Color del subtítulo"
            value={config.colorSubtitulo}
            onChange={(v) => updateCfg('colorSubtitulo', v)}
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
            label="Switch ON"
            value={config.colorSwitchOn}
            onChange={(v) => updateCfg('colorSwitchOn', v)}
          />
          <ColorPicker
            label="Switch OFF"
            value={config.colorSwitchOff}
            onChange={(v) => updateCfg('colorSwitchOff', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🇹"
        title="Tipografías"
        description="Tamaños de título y subtítulo."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
          }}
        >
          <FieldSelect
            label="Tamaño del título"
            value={config.tamanoTitulo}
            options={TAMANO_OPTIONS}
            onChange={(v) => updateCfg('tamanoTitulo', v)}
          />
          <FieldSelect
            label="Tamaño del subtítulo"
            value={config.tamanoSubtitulo}
            options={TAMANO_OPTIONS}
            onChange={(v) => updateCfg('tamanoSubtitulo', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Diseño"
        description="Bordes y padding del bloque del interruptor."
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
        {/* Chip scope */}
        {targetType === 'all' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#10B981',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Todos los productos
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 18 }}>🛍️</span>
            Producto específico
          </div>
        )}

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
          {widgetDefinition.name} ({targetType === 'all' ? 'General' : 'Producto'})
        </h1>

        {/* PREVIEW */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            padding: 20,
            marginBottom: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <ExtrasInterruptorPreview
            config={config}
            forceOn={previewOn}
            onToggle={() => setPreviewOn((v) => !v)}
          />
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid #f1f3f5',
              fontSize: 12,
              color: '#000000',
              opacity: 0.6,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <span style={{ color: '#10B981', flexShrink: 0 }}>ⓘ</span>
            <span>
              El interruptor aparece debajo del botón &quot;Comprar&quot;. El cliente lo activa y el
              extra se suma al carrito sin salir de la página.
            </span>
          </div>
        </div>

        {/* TABS */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            padding: 20,
            marginTop: 16,
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

          {/* FOOTER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #f1f3f5',
              gap: 12,
              flexWrap: 'wrap',
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
                  outline: 'none',
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
              {saving
                ? 'Guardando...'
                : existingWidget
                ? 'Guardar cambios'
                : 'Crear widget'}
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
