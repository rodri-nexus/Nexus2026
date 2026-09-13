'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
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

export interface ComparadorItem {
  caracteristica: string;
  nosotros: boolean;
  competencia: boolean;
}

interface ComparadorMarcaConfig {
  titulo: string;
  subtexto: string;
  nombreTuMarca: string;
  nombreCompetencia: string;
  items: ComparadorItem[];
  bgColor: string;
  borderColor: string;
  textColor: string;
  destacadoBgColor: string;
  destacadoTextColor: string;
  checkColor: string;
  crossColor: string;
  bordesRedondeados: number;
  paddingInterno: number;
  ubicacion: 'product' | 'home' | 'ambas';
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   PRESETS DE FECHAS ESPECIALES LOCALES (Regla #9)
═══════════════════════════════════════════ */
const COMPARADOR_CAMPAIGN_THEMES: Record<
  string,
  {
    name: string;
    themeColor: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    destacadoBgColor: string;
    destacadoTextColor: string;
    checkColor: string;
    crossColor: string;
    tag: string;
    description: string;
  }
> = {
  none: {
    name: 'Diseño Normal / Sin Evento',
    themeColor: '#10B981',
    accentColor: '#10B981',
    bgColor: '#ffffff',
    borderColor: '#e5e7eb',
    textColor: '#000000',
    destacadoBgColor: '#ecfdf4',
    destacadoTextColor: '#059669',
    checkColor: '#10B981',
    crossColor: '#9ca3af',
    tag: 'DEFAULT',
    description: 'Mantiene los colores configurados en la pestaña Estilos.',
  },
  'black-friday': {
    name: '🔥 Black Friday',
    themeColor: '#111827',
    accentColor: '#F59E0B',
    bgColor: '#111827',
    borderColor: '#F59E0B',
    textColor: '#FFFFFF',
    destacadoBgColor: '#F59E0B1a',
    destacadoTextColor: '#F59E0B',
    checkColor: '#F59E0B',
    crossColor: '#374151',
    tag: 'BLACK FRIDAY',
    description: 'Fondo negro con bordes y acentos destacados dorados.',
  },
  'hot-sale': {
    name: '⚡ Hot Sale',
    themeColor: '#0F172A',
    accentColor: '#EF4444',
    bgColor: '#0F172A',
    borderColor: '#EF4444',
    textColor: '#FFFFFF',
    destacadoBgColor: '#EF44441a',
    destacadoTextColor: '#EF4444',
    checkColor: '#EF4444',
    crossColor: '#334155',
    tag: 'HOT SALE',
    description: 'Azul noche profundo con indicadores y bordes en rojo fuego.',
  },
  'cyber-monday': {
    name: '🚀 Cyber Monday',
    themeColor: '#090D16',
    accentColor: '#3B82F6',
    bgColor: '#090D16',
    borderColor: '#3B82F6',
    textColor: '#FFFFFF',
    destacadoBgColor: '#3B82F61a',
    destacadoTextColor: '#60A5FA',
    checkColor: '#3B82F6',
    crossColor: '#1E293B',
    tag: 'CYBER MONDAY',
    description: 'Estética cyber futurista con resaltados en azul neón.',
  },
  navidad: {
    name: '🎄 Navidad & Reyes',
    themeColor: '#064E3B',
    accentColor: '#EF4444',
    bgColor: '#064E3B',
    borderColor: '#10B981',
    textColor: '#FFFFFF',
    destacadoBgColor: '#EF44441a',
    destacadoTextColor: '#FCD34D',
    checkColor: '#EF4444',
    crossColor: '#047857',
    tag: 'NAVIDAD',
    description: 'Verde pino de fondo con tildes y marcos rojo navideño.',
  },
  'san-valentin': {
    name: '💘 San Valentín',
    themeColor: '#831843',
    accentColor: '#F43F5E',
    bgColor: '#831843',
    borderColor: '#FB7185',
    textColor: '#FFFFFF',
    destacadoBgColor: '#F43F5E1a',
    destacadoTextColor: '#FECDD3',
    checkColor: '#F43F5E',
    crossColor: '#9D174D',
    tag: 'SAN VALENTÍN',
    description: 'Tono vino y rosa apasionado para fechas románticas.',
  },
  'dia-madre-padre': {
    name: '🎁 Día de la Madre / Padre',
    themeColor: '#312E81',
    accentColor: '#10B981',
    bgColor: '#312E81',
    borderColor: '#6366F1',
    textColor: '#FFFFFF',
    destacadoBgColor: '#10B9811a',
    destacadoTextColor: '#A7F3D0',
    checkColor: '#10B981',
    crossColor: '#3730A3',
    tag: 'SPECIAL DAY',
    description: 'Fondo índigo premium con destacados de marca en esmeralda.',
  },
  'sale-liquidacion': {
    name: '🏷️ Liquidación / Sale',
    themeColor: '#7F1D1D',
    accentColor: '#FBBF24',
    bgColor: '#7F1D1D',
    borderColor: '#FBBF24',
    textColor: '#FFFFFF',
    destacadoBgColor: '#FBBF241a',
    destacadoTextColor: '#FBBF24',
    checkColor: '#FBBF24',
    crossColor: '#991B1B',
    tag: 'LIQUIDACIÓN',
    description: 'Rojo líquido audaz con aros destacados y tildes amarillos.',
  },
};

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: ComparadorMarcaConfig = {
  titulo: '¿POR QUÉ ELEGIRNOS?',
  subtexto: 'Nuestros beneficios frente a otras tiendas',
  nombreTuMarca: 'NOSOTROS',
  nombreCompetencia: 'OTRAS TIENDAS',
  items: [
    { caracteristica: 'Envío rápido y asegurado', nosotros: true, competencia: false },
    { caracteristica: 'Atención 1 a 1 por WhatsApp', nosotros: true, competencia: false },
    { caracteristica: 'Garantía oficial de cambio', nosotros: true, competencia: false },
    { caracteristica: 'Cuotas sin interés reales', nosotros: true, competencia: false },
  ],
  bgColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#000000',
  destacadoBgColor: '#ecfdf5',
  destacadoTextColor: '#059669',
  checkColor: '#10B981',
  crossColor: '#9ca3af',
  bordesRedondeados: 16,
  paddingInterno: 18,
  ubicacion: 'product',
  campaignTheme: 'none',
};

/* ═══════════════════════════════════════════
   SECTION CARD (Subcomponente auxiliar)
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
function ComparadorMarcaPreview({ config }: { config: ComparadorMarcaConfig }) {
  const themeKey = config.campaignTheme || 'none';
  const theme = COMPARADOR_CAMPAIGN_THEMES[themeKey] || COMPARADOR_CAMPAIGN_THEMES.none;
  const isCustomTheme = themeKey !== 'none';

  // Sobrecarga temática de colores
  const bgColor = isCustomTheme ? theme.bgColor : config.bgColor;
  const borderColor = isCustomTheme ? theme.borderColor : config.borderColor;
  const textColor = isCustomTheme ? theme.textColor : config.textColor;
  const subtextColor = isCustomTheme ? `${theme.textColor}cc` : config.textColor;
  const destacadoBgColor = isCustomTheme ? theme.destacadoBgColor : config.destacadoBgColor;
  const destacadoTextColor = isCustomTheme ? theme.destacadoTextColor : config.destacadoTextColor;
  const checkColor = isCustomTheme ? theme.checkColor : config.checkColor;
  const crossColor = isCustomTheme ? theme.crossColor : config.crossColor;

  return (
    <div
      style={{
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        boxShadow: isCustomTheme ? `0 4px 20px ${borderColor}22` : '0 4px 14px rgba(0,0,0,0.03)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 16,
            color: textColor,
            letterSpacing: '-0.02em',
            marginBottom: 3,
          }}
        >
          {config.titulo}
        </div>
        {config.subtexto && (
          <div style={{ fontSize: 12, color: subtextColor, opacity: isCustomTheme ? 1 : 0.65 }}>
            {config.subtexto}
          </div>
        )}
      </div>

      {/* Tabla comparativa */}
      <div
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Cabecera de la tabla */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            background: isCustomTheme ? '#ffffff06' : '#f9fafb',
            borderBottom: `1px solid ${borderColor}`,
            padding: '10px 12px',
            alignItems: 'center',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          <div style={{ color: isCustomTheme ? '#ffffffa3' : '#6b7280' }}>BENEFICIO</div>
          <div
            style={{
              textAlign: 'center',
              color: destacadoTextColor,
              background: destacadoBgColor,
              padding: '4px 6px',
              borderRadius: 6,
              fontWeight: 900,
            }}
          >
            {config.nombreTuMarca}
          </div>
          <div style={{ textAlign: 'center', color: isCustomTheme ? '#ffffffa3' : '#6b7280' }}>
            {config.nombreCompetencia}
          </div>
        </div>

        {/* Filas */}
        {config.items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              padding: '10px 12px',
              alignItems: 'center',
              borderBottom:
                idx < config.items.length - 1
                  ? `1px solid ${borderColor}`
                  : 'none',
              background: idx % 2 === 0 ? 'transparent' : (isCustomTheme ? '#ffffff03' : '#fafafa'),
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 600, color: textColor, paddingRight: 8 }}>
              {item.caracteristica || `Beneficio #${idx + 1}`}
            </div>

            {/* Tu Marca */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: destacadoBgColor,
                margin: '-10px 0',
                padding: '10px 0',
              }}
            >
              {item.nosotros ? (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: checkColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={14} color="#ffffff" strokeWidth={3} />
                </div>
              ) : (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: crossColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 900, lineHeight: 1 }}>✕</span>
                </div>
              )}
            </div>

            {/* Competencia */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {item.competencia ? (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: checkColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={13} color="#ffffff" strokeWidth={3} />
                </div>
              ) : (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: isCustomTheme ? '#ffffff0a' : '#f3f4f6',
                    border: isCustomTheme ? '1px solid #ffffff1a' : '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: crossColor, fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✕</span>
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
export default function ComparadorMarcaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'general' | 'estilos' | 'fechas'>('general');
  const [config, setConfig] = useState<ComparadorMarcaConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<ComparadorMarcaConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof ComparadorMarcaConfig>(
    key: K,
    val: ComparadorMarcaConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const updateItem = (index: number, field: keyof ComparadorItem, value: any) => {
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
        { caracteristica: 'Nuevo beneficio exclusivo', nosotros: true, competencia: false },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (config.items.length <= 1) return;
    const newItems = config.items.filter((_, i) => i !== index);
    setConfig((prev) => ({ ...prev, items: newItems }));
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
      {/* SELECTOR PREMIUM DE UBICACIÓN */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: 4,
            letterSpacing: '-0.01em',
          }}
        >
          📍 UBICACIÓN EN LA TIENDA
        </label>
        <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 12, lineHeight: 1.3 }}>
          Elegí en qué sección querés que se muestre automáticamente esta tabla comparativa.
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { id: 'product', label: 'Solo Producto', desc: 'Abajo del botón', icon: '🛍️' },
            { id: 'home', label: 'Solo Inicio', desc: 'En la Home', icon: '🏠' },
            { id: 'ambas', label: 'Ambas Páginas', desc: 'Producto e Inicio', icon: '✨' },
          ].map((item) => {
            const isSelected = (config.ubicacion || 'product') === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateCfg('ubicacion', item.id as any)}
                style={{
                  background: isSelected ? '#ecfdf5' : '#ffffff',
                  border: isSelected ? '2px solid #10B981' : '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '12px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: isSelected ? '0 4px 12px rgba(16,185,129,0.08)' : 'none',
                }}
              >
                <span style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: isSelected ? '#047857' : '#1e293b' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 9, color: isSelected ? '#059669' : '#64748b', fontWeight: 500 }}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <FieldInput
        label="Título del bloque"
        value={config.titulo}
        placeholder="¿POR QUÉ ELEGIRNOS?"
        onChange={(v) => updateCfg('titulo', v)}
      />

      <FieldInput
        label="Subtexto descriptivo"
        value={config.subtexto}
        placeholder="Nuestros beneficios frente a otras tiendas"
        onChange={(v) => updateCfg('subtexto', v)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FieldInput
          label="Nombre de tu marca (Columna destacada)"
          value={config.nombreTuMarca}
          placeholder="NOSOTROS"
          onChange={(v) => updateCfg('nombreTuMarca', v)}
        />
        <FieldInput
          label="Nombre de la competencia"
          value={config.nombreCompetencia}
          placeholder="OTRAS TIENDAS"
          onChange={(v) => updateCfg('nombreCompetencia', v)}
        />
      </div>

      {/* GESTOR DE FILAS / BENEFICIOS */}
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#000000',
            marginBottom: 10,
            display: 'flex',
            justifyContent: ' some-between',
            alignItems: 'center',
          }}
        >
          <span>Beneficios a comparar ({config.items.length}/8)</span>
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
              Agregar fila
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {config.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <input
                type="text"
                value={item.caracteristica}
                onChange={(e) => updateItem(idx, 'caracteristica', e.target.value)}
                placeholder="Beneficio o característica..."
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                  outline: 'none',
                  background: '#ffffff',
                }}
              />

              {/* Toggle Tu Marca */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.nosotros ? '#059669' : '#6b7280',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={item.nosotros}
                  onChange={(e) => updateItem(idx, 'nosotros', e.target.checked)}
                />
                Vos
              </label>

              {/* Toggle Competencia */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6b7280',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={item.competencia}
                  onChange={(e) => updateItem(idx, 'competencia', e.target.checked)}
                />
                Otros
              </label>

              {/* Borrar */}
              {config.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Eliminar fila"
                >
                  <Trash2 size={16} />
                </button>
              )}
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
        description="Personalizá los colores de la tabla, columna destacada y tildes."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Color de fondo de la tarjeta"
            value={config.bgColor}
            onChange={(v) => updateCfg('bgColor', v)}
          />
          <ColorPicker
            label="Color de los bordes"
            value={config.borderColor}
            onChange={(v) => updateCfg('borderColor', v)}
          />
          <ColorPicker
            label="Color del texto principal"
            value={config.textColor}
            onChange={(v) => updateCfg('textColor', v)}
          />
          <ColorPicker
            label="Fondo de tu columna destacada"
            value={config.destacadoBgColor}
            onChange={(v) => updateCfg('destacadoBgColor', v)}
          />
          <ColorPicker
            label="Texto de tu columna destacada"
            value={config.destacadoTextColor}
            onChange={(v) => updateCfg('destacadoTextColor', v)}
          />
          <ColorPicker
            label="Color del tilde positivo"
            value={config.checkColor}
            onChange={(v) => updateCfg('checkColor', v)}
          />
          <ColorPicker
            label="Color de la cruz negativa"
            value={config.crossColor}
            onChange={(v) => updateCfg('crossColor', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Diseño"
        description="Adaptá la estructura espacial y bordes de la tabla."
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
              ? `Evento activo: ${COMPARADOR_CAMPAIGN_THEMES[config.campaignTheme]?.name || 'Personalizado'}`
              : 'Diseño Normal activo'}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {config.campaignTheme && config.campaignTheme !== 'none'
              ? 'La tabla de comparación adaptará automáticamente toda su paleta visual al evento comercial seleccionado.'
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
        {Object.entries(COMPARADOR_CAMPAIGN_THEMES).map(([key, theme]) => {
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
                      background: theme.bgColor,
                      border: '1px solid #d1d5db',
                    }}
                    title="Fondo de la tabla"
                  />
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: theme.borderColor,
                      border: '1px solid #d1d5db',
                    }}
                    title="Color de los bordes"
                  />
                  <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>
                    Paleta de la fecha
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
            <span>Vista previa en vivo</span>
          </div>
          <ComparadorMarcaPreview config={config} />
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
