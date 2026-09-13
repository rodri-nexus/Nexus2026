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

interface ContadorVisitasConfig {
  textoAntes: string;
  minVisitas: number;
  maxVisitas: number;
  colorPunto: string;
  colorFondo: string;
  colorTexto: string;
  colorBorde: string;
  tamanoTexto: string;
  bordesRedondeados: number;
  paddingInterno: number;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   PRESETS DE FECHAS ESPECIALES LOCALES (Regla #9)
═══════════════════════════════════════════ */
const CONTADOR_CAMPAIGN_THEMES: Record<
  string,
  {
    name: string;
    themeColor: string;
    accentColor: string;
    colorFondo: string;
    colorTexto: string;
    colorBorde: string;
    colorPunto: string;
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
    colorBorde: '#e5e7eb',
    colorPunto: '#dc2626',
    tag: 'DEFAULT',
    description: 'Mantiene los colores configurados en la pestaña Estilos.',
  },
  'black-friday': {
    name: '🔥 Black Friday',
    themeColor: '#111827',
    accentColor: '#F59E0B',
    colorFondo: '#111827',
    colorTexto: '#FFFFFF',
    colorBorde: '#F59E0B',
    colorPunto: '#F59E0B',
    tag: 'BLACK FRIDAY',
    description: 'Píldora negro azabache con borde y punto pulsante dorado neón.',
  },
  'hot-sale': {
    name: '⚡ Hot Sale',
    themeColor: '#0F172A',
    accentColor: '#EF4444',
    colorFondo: '#0F172A',
    colorTexto: '#FFFFFF',
    colorBorde: '#EF4444',
    colorPunto: '#EF4444',
    tag: 'HOT SALE',
    description: 'Azul noche con acentos de urgencia en rojo fuego.',
  },
  'cyber-monday': {
    name: '🚀 Cyber Monday',
    themeColor: '#090D16',
    accentColor: '#3B82F6',
    colorFondo: '#090D16',
    colorTexto: '#FFFFFF',
    colorBorde: '#3B82F6',
    colorPunto: '#60A5FA',
    tag: 'CYBER MONDAY',
    description: 'Estilo tech futurista con acentos azul neón.',
  },
  navidad: {
    name: '🎄 Navidad & Reyes',
    themeColor: '#064E3B',
    accentColor: '#EF4444',
    colorFondo: '#064E3B',
    colorTexto: '#FFFFFF',
    colorBorde: '#10B981',
    colorPunto: '#EF4444',
    tag: 'NAVIDAD',
    description: 'Verde pino navideño con punto indicador rojo.',
  },
  'san-valentin': {
    name: '💘 San Valentín',
    themeColor: '#831843',
    accentColor: '#F43F5E',
    colorFondo: '#831843',
    colorTexto: '#FFFFFF',
    colorBorde: '#FB7185',
    colorPunto: '#F43F5E',
    tag: 'SAN VALENTÍN',
    description: 'Tono vino y rosa apasionado para fechas románticas.',
  },
  'dia-madre-padre': {
    name: '🎁 Día de la Madre / Padre',
    themeColor: '#312E81',
    accentColor: '#10B981',
    colorFondo: '#312E81',
    colorTexto: '#FFFFFF',
    colorBorde: '#6366F1',
    colorPunto: '#10B981',
    tag: 'SPECIAL DAY',
    description: 'Índigo premium con punto pulsante esmeralda.',
  },
  'sale-liquidacion': {
    name: '🏷️ Liquidación / Sale',
    themeColor: '#7F1D1D',
    accentColor: '#FBBF24',
    colorFondo: '#7F1D1D',
    colorTexto: '#FFFFFF',
    colorBorde: '#FBBF24',
    colorPunto: '#FBBF24',
    tag: 'LIQUIDACIÓN',
    description: 'Rojo liquidación con bordes y detalles en amarillo vibrante.',
  },
};

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: ContadorVisitasConfig = {
  textoAntes: 'personas viendo esto ahora',
  minVisitas: 60,
  maxVisitas: 140,
  colorPunto: '#dc2626',
  colorFondo: '#ffffff',
  colorTexto: '#000000',
  colorBorde: '#e5e7eb',
  tamanoTexto: '14px',
  bordesRedondeados: 999,
  paddingInterno: 12,
  campaignTheme: 'none',
};

const TAMANO_OPTIONS = [
  { value: '12px', label: '12px' },
  { value: '13px', label: '13px' },
  { value: '14px', label: '14px' },
  { value: '15px', label: '15px' },
  { value: '16px', label: '16px' },
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
function ContadorVisitasPreview({ config }: { config: ContadorVisitasConfig }) {
  const themeKey = config.campaignTheme || 'none';
  const theme = CONTADOR_CAMPAIGN_THEMES[themeKey] || CONTADOR_CAMPAIGN_THEMES.none;
  const isCustomTheme = themeKey !== 'none';

  const colorFondo = isCustomTheme ? theme.colorFondo : config.colorFondo;
  const colorTexto = isCustomTheme ? theme.colorTexto : config.colorTexto;
  const colorBorde = isCustomTheme ? theme.colorBorde : config.colorBorde;
  const colorPunto = isCustomTheme ? theme.colorPunto : config.colorPunto;

  const numeroEjemplo = Math.floor(
    (config.minVisitas + config.maxVisitas) / 2
  ) || 100;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        background: colorFondo,
        border: `1.5px solid ${colorBorde}`,
        borderRadius: config.bordesRedondeados,
        padding: `8px ${config.paddingInterno + 8}px`,
        boxShadow: isCustomTheme ? `0 4px 16px ${colorBorde}33` : '0 2px 10px rgba(0, 0, 0, 0.04)',
        margin: '0 auto',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Punto pulsante */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: colorPunto,
          boxShadow: `0 0 0 3px ${colorPunto}33`,
          flexShrink: 0,
        }}
      />

      {/* Texto formateado */}
      <div
        style={{
          fontSize: config.tamanoTexto,
          color: colorTexto,
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}
      >
        <span style={{ fontWeight: 900, marginRight: 4 }}>
          {numeroEjemplo}
        </span>
        {config.textoAntes || 'personas viendo esto ahora'}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function ContadorVisitasEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<ContadorVisitasConfig>(() => {
    if (existingWidget?.config) {
      return { ...DEFAULT_CONFIG, ...(existingWidget.config as Partial<ContadorVisitasConfig>) };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof ContadorVisitasConfig>(
    key: K,
    val: ContadorVisitasConfig[K]
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
        label="Texto que acompaña al número"
        value={config.textoAntes}
        placeholder="personas viendo esto ahora"
        onChange={(v) => updateCfg('textoAntes', v)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Rango Mínimo
          </label>
          <input
            type="number"
            value={config.minVisitas}
            onChange={(e) => updateCfg('minVisitas', Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Rango Máximo
          </label>
          <input
            type="number"
            value={config.maxVisitas}
            onChange={(e) => updateCfg('maxVisitas', Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: -8, marginBottom: 16 }}>
        El widget generará automáticamente un número aleatorio entre estos dos valores.
      </div>
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores"
        description="Personalizá los colores de la píldora, texto e indicador."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Color de fondo"
            value={config.colorFondo}
            onChange={(v) => updateCfg('colorFondo', v)}
          />
          <ColorPicker
            label="Color del texto y número"
            value={config.colorTexto}
            onChange={(v) => updateCfg('colorTexto', v)}
          />
          <ColorPicker
            label="Color del borde"
            value={config.colorBorde}
            onChange={(v) => updateCfg('colorBorde', v)}
          />
          <ColorPicker
            label="Color del punto indicador"
            value={config.colorPunto}
            onChange={(v) => updateCfg('colorPunto', v)}
          />
        </div>
      </SectionCard>

      <SectionCard icon="🇹" title="Tipografía" description="Tamaño de letra.">
        <FieldSelect
          label="Tamaño de letra"
          value={config.tamanoTexto}
          options={TAMANO_OPTIONS}
          onChange={(v) => updateCfg('tamanoTexto', v)}
        />
      </SectionCard>

      <SectionCard icon="🎛" title="Diseño" description="Bordes y relleno de la píldora.">
        <Slider
          label="Bordes redondeados"
          value={config.bordesRedondeados}
          min={0}
          max={999}
          onChange={(v) => updateCfg('bordesRedondeados', v)}
        />
        <Slider
          label="Padding lateral"
          value={config.paddingInterno}
          min={6}
          max={30}
          onChange={(v) => updateCfg('paddingInterno', v)}
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
              ? `Evento activo: ${CONTADOR_CAMPAIGN_THEMES[config.campaignTheme]?.name || 'Personalizado'}`
              : 'Diseño Normal activo'}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {config.campaignTheme && config.campaignTheme !== 'none'
              ? 'El contador de urgencia adaptará automáticamente sus bordes, fondos e indicador luminoso a la estética del evento comercial.'
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
        {Object.entries(CONTADOR_CAMPAIGN_THEMES).map(([key, theme]) => {
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
                      background: theme.colorBorde,
                      border: '1px solid #d1d5db',
                    }}
                    title="Color de borde y acento"
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
            padding: '24px 20px',
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          <ContadorVisitasPreview config={config} />
        </div>

        {/* EDITOR TABS */}
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
