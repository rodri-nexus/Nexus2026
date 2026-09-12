// components/widgets/editors/BadgeCuponEditor.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Ticket, Copy, Check, Palette, Type, Eye, Save, Loader2 } from 'lucide-react';
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

interface BadgeCuponConfig {
  titulo: string;
  subtexto: string;
  codigo: string;
  badge: string;
  textoBoton: string;
  textoCopiado: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  botonBgColor: string;
  botonTextColor: string;
  bordesRedondeados: number;
  paddingInterno: number;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   DEFAULTS Y MAPAS DE TEMPORADAS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: BadgeCuponConfig = {
  titulo: '🔥 ¡CUPÓN EXCLUSIVO!',
  subtexto: 'Tocá para copiar el código y aplicalo en el checkout',
  codigo: 'NEVUX10',
  badge: '10% OFF',
  textoBoton: 'Copiar',
  textoCopiado: '¡Copiado! 🎉',
  bgColor: '#ffffff',
  borderColor: '#10B981',
  textColor: '#000000',
  badgeBgColor: '#ecfdf5',
  badgeTextColor: '#059669',
  botonBgColor: '#10B981',
  botonTextColor: '#ffffff',
  bordesRedondeados: 14,
  paddingInterno: 16,
  campaignTheme: 'none',
};

const THEMES: Record<string, { themeColor: string; accentColor: string; textColor: string; badgeBgColor: string; badgeTextColor: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', textColor: '#ffffff', badgeBgColor: '#F59E0B', badgeTextColor: '#000000' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', textColor: '#ffffff', badgeBgColor: '#EF4444', badgeTextColor: '#ffffff' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', textColor: '#ffffff', badgeBgColor: '#3B82F6', badgeTextColor: '#ffffff' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', textColor: '#ffffff', badgeBgColor: '#EF4444', badgeTextColor: '#ffffff' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', textColor: '#ffffff', badgeBgColor: '#F43F5E', badgeTextColor: '#ffffff' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', textColor: '#ffffff', badgeBgColor: '#10B981', badgeTextColor: '#ffffff' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', textColor: '#ffffff', badgeBgColor: '#FBBF24', badgeTextColor: '#000000' },
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
   PREVIEW EN VIVO (Adaptativo a campañas)
═══════════════════════════════════════════ */
function BadgeCuponPreview({
  config,
  copied,
  onCopyClick,
}: {
  config: BadgeCuponConfig;
  copied: boolean;
  onCopyClick: () => void;
}) {
  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const bgColor = activeTheme ? activeTheme.themeColor : config.bgColor;
  const borderColor = activeTheme ? activeTheme.accentColor : config.borderColor;
  const textColor = activeTheme ? activeTheme.textColor : config.textColor;
  const badgeBgColor = activeTheme ? activeTheme.badgeBgColor : config.badgeBgColor;
  const badgeTextColor = activeTheme ? activeTheme.badgeTextColor : config.badgeTextColor;
  
  const botonBgColor = activeTheme ? activeTheme.accentColor : config.botonBgColor;
  const botonTextColor = activeTheme 
    ? (currentCampaign === 'black-friday' || currentCampaign === 'liquidacion' ? '#000000' : '#ffffff')
    : config.botonTextColor;

  return (
    <div
      style={{
        background: bgColor,
        border: `1.5px dashed ${borderColor}`,
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ticket size={18} color={borderColor} />
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.95rem',
              color: textColor,
              letterSpacing: '-0.01em',
            }}
          >
            {config.titulo}
          </span>
        </div>

        {config.badge && (
          <span
            style={{
              background: badgeBgColor,
              color: badgeTextColor,
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {config.badge}
          </span>
        )}
      </div>

      <p
        style={{
          margin: '0 0 0.85rem 0',
          fontSize: '0.82rem',
          color: textColor,
          opacity: 0.75,
          lineHeight: 1.4,
        }}
      >
        {config.subtexto}
      </p>

      {/* Fila del Código + Botón Copiar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          background: activeTheme ? '#1e293b' : '#f9fafb',
          border: activeTheme ? '1px solid #334155' : '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '0.45rem 0.65rem 0.45rem 0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <span style={{ fontSize: '0.75rem', color: activeTheme ? '#94a3b8' : '#6b7280', fontWeight: 600 }}>
            Código:
          </span>
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: activeTheme ? '#ffffff' : '#000000',
              letterSpacing: '0.05em',
            }}
          >
            {config.codigo}
          </span>
        </div>

        <button
          type="button"
          onClick={onCopyClick}
          style={{
            background: copied ? '#059669' : botonBgColor,
            color: botonTextColor,
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          {copied ? (
            <>
              <Check size={14} strokeWidth={3} />
              {config.textoCopiado}
            </>
          ) : (
            <>
              <Copy size={14} />
              {config.textoBoton}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function BadgeCuponEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<BadgeCuponConfig>(() => {
    if (existingWidget?.config) {
      return { ...DEFAULT_CONFIG, ...(existingWidget.config as Partial<BadgeCuponConfig>) };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [copiedPreview, setCopiedPreview] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof BadgeCuponConfig>(
    key: K,
    val: BadgeCuponConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleTestCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(config.codigo);
      }
    } catch (e) {
      console.log('Copy fallback', e);
    }
    setCopiedPreview(true);
    setTimeout(() => {
      setCopiedPreview(false);
    }, 2000);
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
        label="Título del cupón"
        value={config.titulo}
        placeholder="🔥 ¡CUPÓN EXCLUSIVO!"
        onChange={(v) => updateCfg('titulo', v)}
      />

      <FieldInput
        label="Subtexto descriptivo"
        value={config.subtexto}
        placeholder="Tocá para copiar el código y aplicalo en el checkout"
        onChange={(v) => updateCfg('subtexto', v)}
      />

      <FieldInput
        label="Código del cupón (el mismo que creaste en Tiendanube)"
        value={config.codigo}
        placeholder="NEVUX10"
        onChange={(v) => updateCfg('codigo', v.toUpperCase())}
      />

      <FieldInput
        label="Texto del badge destacado (ej: 10% OFF / PROMO)"
        value={config.badge}
        placeholder="10% OFF"
        onChange={(v) => updateCfg('badge', v)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FieldInput
          label="Texto del botón"
          value={config.textoBoton}
          placeholder="Copiar"
          onChange={(v) => updateCfg('textoBoton', v)}
        />
        <FieldInput
          label="Texto al copiar"
          value={config.textoCopiado}
          placeholder="¡Copiado! 🎉"
          onChange={(v) => updateCfg('textoCopiado', v)}
        />
      </div>
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores"
        description="Personalizá la paleta de colores completa de tu tarjeta de cupón."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Fondo de la tarjeta"
            value={config.bgColor}
            onChange={(v) => updateCfg('bgColor', v)}
          />
          <ColorPicker
            label="Borde discontinuo"
            value={config.borderColor}
            onChange={(v) => updateCfg('borderColor', v)}
          />
          <ColorPicker
            label="Texto principal"
            value={config.textColor}
            onChange={(v) => updateCfg('textColor', v)}
          />
          <ColorPicker
            label="Fondo del botón"
            value={config.botonBgColor}
            onChange={(v) => updateCfg('botonBgColor', v)}
          />
          <ColorPicker
            label="Texto del botón"
            value={config.botonTextColor}
            onChange={(v) => updateCfg('botonTextColor', v)}
          />
          <ColorPicker
            label="Fondo del badge destacado"
            value={config.badgeBgColor}
            onChange={(v) => updateCfg('badgeBgColor', v)}
          />
          <ColorPicker
            label="Texto del badge destacado"
            value={config.badgeTextColor}
            onChange={(v) => updateCfg('badgeTextColor', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Diseño"
        description="Adaptá la estructura espacial y bordes de la tarjeta."
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
          max={24}
          onChange={(v) => updateCfg('paddingInterno', v)}
        />
      </SectionCard>
    </div>
  );

  /* ─── TAB FECHAS ESPECIALES ─── */
  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Colores oscuros con acentos dorados.', themeColor: '#111827', accentColor: '#F59E0B' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Diseño deportivo con rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético nocturno y azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino tradicional con acento rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con acento verde esmeralda alegre.', themeColor: '#312E81', accentColor: '#10B981' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí de urgencia extrema con amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
  ];

  const tabFechasEspeciales = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 6 }}>Seleccionar Temporada / Evento</div>
        <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 12, lineHeight: 1.5 }}>
          Elegí una campaña activa. Al seleccionarla, se aplicará un diseño optimizado con colores temáticos de alto impacto para este widget.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CAMPAIGN_PRESETS.map((preset) => {
          const isSelected = (config.campaignTheme || 'none') === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => updateCfg('campaignTheme', preset.id)}
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
              {preset.id !== 'none' && (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
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
            <span>Vista previa interactiva</span>
          </div>
          <BadgeCuponPreview
            config={config}
            copied={copiedPreview}
            onCopyClick={handleTestCopy}
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
              { id: 'fechas', label: '🔥 Fechas Especiales', icon: '🔥' },
            ]}
          >
            {[tabGeneral, tabEstilos, tabFechasEspeciales]}
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
