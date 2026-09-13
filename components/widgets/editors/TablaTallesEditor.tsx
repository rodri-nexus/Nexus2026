'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Eye,
  Check,
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

export interface TalleFila {
  talle: string;
  col1: string;
  col2: string;
  col3: string;
}

interface TablaTallesConfig {
  textoBoton: string;
  textoBotonElegir?: string;
  tituloModal: string;
  subtextoModal: string;
  columnas: string[];
  filas: TalleFila[];
  notaAyuda: string;
  botonBgColor: string;
  botonTextColor: string;
  botonBorderColor: string;
  modalBgColor: string;
  modalTextColor: string;
  headerBgColor: string;
  headerTextColor: string;
  bordesRedondeados: number;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   PRESETS DE FECHAS ESPECIALES LOCALES (Regla #9)
═══════════════════════════════════════════ */
const TALLES_CAMPAIGN_THEMES: Record<
  string,
  {
    name: string;
    themeColor: string;
    accentColor: string;
    botonBgColor: string;
    botonTextColor: string;
    botonBorderColor: string;
    modalBgColor: string;
    modalTextColor: string;
    headerBgColor: string;
    headerTextColor: string;
    tag: string;
    description: string;
  }
> = {
  none: {
    name: 'Diseño Normal / Sin Evento',
    themeColor: '#10B981',
    accentColor: '#10B981',
    botonBgColor: '#f3f4f6',
    botonTextColor: '#000000',
    botonBorderColor: '#e5e7eb',
    modalBgColor: '#ffffff',
    modalTextColor: '#000000',
    headerBgColor: '#ecfdf5',
    headerTextColor: '#059669',
    tag: 'DEFAULT',
    description: 'Mantiene los colores configurados en la pestaña Estilos.',
  },
  'black-friday': {
    name: '🔥 Black Friday',
    themeColor: '#111827',
    accentColor: '#F59E0B',
    botonBgColor: '#111827',
    botonTextColor: '#F59E0B',
    botonBorderColor: '#F59E0B',
    modalBgColor: '#111827',
    modalTextColor: '#FFFFFF',
    headerBgColor: '#374151',
    headerTextColor: '#F59E0B',
    tag: 'BLACK FRIDAY',
    description: 'Modal oscuro con encabezados grises y botones/bordes oro neón.',
  },
  'hot-sale': {
    name: '⚡ Hot Sale',
    themeColor: '#0F172A',
    accentColor: '#EF4444',
    botonBgColor: '#0F172A',
    botonTextColor: '#EF4444',
    botonBorderColor: '#EF4444',
    modalBgColor: '#0F172A',
    modalTextColor: '#FFFFFF',
    headerBgColor: '#1E293B',
    headerTextColor: '#EF4444',
    tag: 'HOT SALE',
    description: 'Fondo azul noche profundo con acentos de urgencia en rojo fuego.',
  },
  'cyber-monday': {
    name: '🚀 Cyber Monday',
    themeColor: '#090D16',
    accentColor: '#3B82F6',
    botonBgColor: '#090D16',
    botonTextColor: '#3B82F6',
    botonBorderColor: '#3B82F6',
    modalBgColor: '#090D16',
    modalTextColor: '#FFFFFF',
    headerBgColor: '#1E293B',
    headerTextColor: '#60A5FA',
    tag: 'CYBER MONDAY',
    description: 'Estilo tech futurista con acentos azul neón.',
  },
  navidad: {
    name: '🎄 Navidad & Reyes',
    themeColor: '#064E3B',
    accentColor: '#EF4444',
    botonBgColor: '#064E3B',
    botonTextColor: '#FFFFFF',
    botonBorderColor: '#10B981',
    modalBgColor: '#064E3B',
    modalTextColor: '#FFFFFF',
    headerBgColor: '#047857',
    headerTextColor: '#FCD34D',
    tag: 'NAVIDAD',
    description: 'Verde pino navideño con acentos rojos y encabezado dorado.',
  },
  'san-valentin': {
    name: '💘 San Valentín',
    themeColor: '#831843',
    accentColor: '#F43F5E',
    botonBgColor: '#831843',
    botonTextColor: '#FFFFFF',
    botonBorderColor: '#FB7185',
    modalBgColor: '#831843',
    modalTextColor: '#FFFFFF',
    headerBgColor: '#9D174D',
    headerTextColor: '#FECDD3',
    tag: 'SAN VALENTÍN',
    description: 'Tono vino y rosa apasionado para fechas románticas.',
  },
  'dia-madre-padre': {
    name: '🎁 Día de la Madre / Padre',
    themeColor: '#312E81',
    accentColor: '#10B981',
    botonBgColor: '#312E81',
    botonTextColor: '#FFFFFF',
    botonBorderColor: '#6366F1',
    modalBgColor: '#312E81',
    modalTextColor: '#FFFFFF',
    headerBgColor: '#3730A3',
    headerTextColor: '#A7F3D0',
    tag: 'SPECIAL DAY',
    description: 'Fondo índigo sofisticado con acentos esmeralda.',
  },
  'sale-liquidacion': {
    name: '🏷️ Liquidación / Sale',
    themeColor: '#7F1D1D',
    accentColor: '#FBBF24',
    botonBgColor: '#7F1D1D',
    botonTextColor: '#FBBF24',
    botonBorderColor: '#FBBF24',
    modalBgColor: '#7F1D1D',
    modalTextColor: '#FFFFFF',
    headerBgColor: '#991B1B',
    headerTextColor: '#FBBF24',
    tag: 'LIQUIDACIÓN',
    description: 'Rojo líquido con contrastes en amarillo vibrante.',
  },
};

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: TablaTallesConfig = {
  textoBoton: '📏 Guía de talles',
  textoBotonElegir: 'Elegir talle',
  tituloModal: 'GUÍA DE TALLES Y MEDIDAS',
  subtextoModal: 'Todas las medidas están expresadas en centímetros (cm)',
  columnas: ['Talle', 'Pecho', 'Cintura', 'Cadera'],
  filas: [
    { talle: 'S', col1: '88-92', col2: '70-74', col3: '94-98' },
    { talle: 'M', col1: '93-97', col2: '75-79', col3: '99-103' },
    { talle: 'L', col1: '98-102', col2: '80-84', col3: '104-108' },
    { talle: 'XL', col1: '103-108', col2: '85-90', col3: '109-114' },
  ],
  notaAyuda: '💡 ¿Cómo medirte? Usá un centímetro de costurera sobre la ropa interior sin ajustar demasiado.',
  botonBgColor: '#f3f4f6',
  botonTextColor: '#000000',
  botonBorderColor: '#e5e7eb',
  modalBgColor: '#ffffff',
  modalTextColor: '#000000',
  headerBgColor: '#ecfdf5',
  headerTextColor: '#059669',
  bordesRedondeados: 12,
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
function TablaTallesPreview({
  config,
  isOpen,
  onToggleModal,
}: {
  config: TablaTallesConfig;
  isOpen: boolean;
  onToggleModal: () => void;
}) {
  const [talleSeleccionado, setTalleSeleccionado] = useState<string | null>(null);

  const themeKey = config.campaignTheme || 'none';
  const theme = TALLES_CAMPAIGN_THEMES[themeKey] || TALLES_CAMPAIGN_THEMES.none;
  const isCustomTheme = themeKey !== 'none';

  // Sobrecarga temática de colores
  const botonBgColor = isCustomTheme ? theme.botonBgColor : config.botonBgColor;
  const botonTextColor = isCustomTheme ? theme.botonTextColor : config.botonTextColor;
  const botonBorderColor = isCustomTheme ? theme.botonBorderColor : config.botonBorderColor;
  const modalBgColor = isCustomTheme ? theme.modalBgColor : config.modalBgColor;
  const modalTextColor = isCustomTheme ? theme.modalTextColor : config.modalTextColor;
  const headerBgColor = isCustomTheme ? theme.headerBgColor : config.headerBgColor;
  const headerTextColor = isCustomTheme ? theme.headerTextColor : config.headerTextColor;
  const saveBtnBg = isCustomTheme ? theme.accentColor : '#10B981';

  const handleSimularElegir = (talle: string) => {
    setTalleSeleccionado(talle);
    setTimeout(() => {
      setTalleSeleccionado(null);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
      {/* Botón Disparador en la Tienda */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="button"
          onClick={onToggleModal}
          style={{
            background: botonBgColor,
            color: botonTextColor,
            border: `1.5px solid ${botonBorderColor}`,
            borderRadius: config.bordesRedondeados,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <span>{config.textoBoton || '📏 Guía de talles'}</span>
          <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 2 }}>(Probar clic)</span>
        </button>
      </div>

      {/* Tabla Desplegada (Modal View) */}
      <div
        style={{
          width: '100%',
          background: modalBgColor,
          border: isCustomTheme ? `2px solid ${saveBtnBg}` : '1.5px solid #e5e7eb',
          borderRadius: 16,
          padding: 16,
          boxShadow: isCustomTheme ? `0 8px 30px ${saveBtnBg}22` : '0 8px 24px rgba(0,0,0,0.06)',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            borderBottom: isCustomTheme ? `1px solid ${saveBtnBg}33` : '1px solid #f3f4f6',
            paddingBottom: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: modalTextColor,
                letterSpacing: '-0.01em',
              }}
            >
              {config.tituloModal}
            </div>
            {config.subtextoModal && (
              <div style={{ fontSize: 11, color: modalTextColor, opacity: 0.65, marginTop: 2 }}>
                {config.subtextoModal}
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: 11,
              background: isCustomTheme ? `${saveBtnBg}1a` : '#f3f4f6',
              color: isCustomTheme ? saveBtnBg : '#6b7280',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            Vista Modal
          </span>
        </div>

        {/* Notificación de prueba de selección */}
        {talleSeleccionado && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#059669',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Check size={16} />
            <span>¡Variante "{talleSeleccionado}" seleccionada automáticamente!</span>
          </div>
        )}

        {/* Tabla */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            <thead>
              <tr style={{ background: headerBgColor, color: headerTextColor }}>
                {config.columnas.map((col, idx) => (
                  <th
                    key={idx}
                    style={{
                      padding: '8px 10px',
                      fontWeight: 800,
                      borderBottom: isCustomTheme ? `1px solid ${saveBtnBg}33` : '1px solid #e5e7eb',
                    }}
                  >
                    {col}
                  </th>
                ))}
                <th
                  style={{
                    padding: '8px 10px',
                    fontWeight: 800,
                    borderBottom: isCustomTheme ? `1px solid ${saveBtnBg}33` : '1px solid #e5e7eb',
                  }}
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {config.filas.map((fila, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? 'transparent' : (isCustomTheme ? '#ffffff06' : '#fafafa'),
                    borderBottom: '1px solid #f3f4f633',
                  }}
                >
                  <td style={{ padding: '8px 10px', fontWeight: 900, color: modalTextColor }}>
                    {fila.talle}
                  </td>
                  <td style={{ padding: '8px 10px', color: modalTextColor }}>
                    {fila.col1} cm
                  </td>
                  <td style={{ padding: '8px 10px', color: modalTextColor }}>
                    {fila.col2} cm
                  </td>
                  <td style={{ padding: '8px 10px', color: modalTextColor }}>
                    {fila.col3} cm
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSimularElegir(fila.talle)}
                      style={{
                        background: saveBtnBg,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: `0 2px 4px ${saveBtnBg}33`,
                      }}
                    >
                      {config.textoBotonElegir || 'Elegir talle'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nota de ayuda */}
        {config.notaAyuda && (
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              background: isCustomTheme ? '#ffffff06' : '#f9fafb',
              borderRadius: 8,
              border: isCustomTheme ? '1px solid #ffffff14' : '1px solid #f3f4f6',
              fontSize: 11,
              color: modalTextColor,
              opacity: 0.8,
              lineHeight: 1.4,
            }}
          >
            {config.notaAyuda}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function TablaTallesEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'general' | 'estilos' | 'fechas'>('general');
  const [config, setConfig] = useState<TablaTallesConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<TablaTallesConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof TablaTallesConfig>(
    key: K,
    val: TablaTallesConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const updateColumna = (index: number, val: string) => {
    const newCols = [...config.columnas];
    newCols[index] = val;
    setConfig((prev) => ({ ...prev, columnas: newCols }));
  };

  const updateFila = (index: number, field: keyof TalleFila, val: string) => {
    const newFilas = [...config.filas];
    newFilas[index] = { ...newFilas[index], [field]: val };
    setConfig((prev) => ({ ...prev, filas: newFilas }));
  };

  const addFila = () => {
    if (config.filas.length >= 10) return;
    setConfig((prev) => ({
      ...prev,
      filas: [
        ...prev.filas,
        { talle: 'XXL', col1: '109-114', col2: '91-96', col3: '115-120' },
      ],
    }));
  };

  const removeFila = (index: number) => {
    if (config.filas.length <= 1) return;
    setConfig((prev) => ({
      ...prev,
      filas: prev.filas.filter((_, i) => i !== index),
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FieldInput
          label="Texto del botón en la página del producto"
          value={config.textoBoton}
          placeholder="📏 Guía de talles"
          onChange={(v) => updateCfg('textoBoton', v)}
        />
        <FieldInput
          label="Texto del botón en cada fila (Acción directa)"
          value={config.textoBotonElegir || 'Elegir talle'}
          placeholder="Elegir talle"
          onChange={(v) => updateCfg('textoBotonElegir', v)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FieldInput
          label="Título del modal"
          value={config.tituloModal}
          placeholder="GUÍA DE TALLES Y MEDIDAS"
          onChange={(v) => updateCfg('tituloModal', v)}
        />
        <FieldInput
          label="Subtexto descriptivo"
          value={config.subtextoModal}
          placeholder="Medidas expresadas en centímetros (cm)"
          onChange={(v) => updateCfg('subtextoModal', v)}
        />
      </div>

      <FieldInput
        label="Nota o consejo de ayuda (¿Cómo medirte?)"
        value={config.notaAyuda}
        placeholder="💡 ¿Cómo medirte? Usá un centímetro..."
        onChange={(v) => updateCfg('notaAyuda', v)}
      />

      {/* CABECERAS DE COLUMNAS */}
      <div style={{ marginTop: 16, marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
          Nombres de las columnas de medidas
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
          {config.columnas.map((col, idx) => (
            <input
              key={idx}
              type="text"
              value={col}
              onChange={(e) => updateColumna(idx, e.target.value)}
              placeholder={`Columna ${idx + 1}`}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1.5px solid #e5e7eb',
                fontSize: 12,
                fontWeight: 700,
                outline: 'none',
                background: '#f9fafb',
              }}
            />
          ))}
        </div>
      </div>

      {/* GESTOR DE TALLES Y FILAS */}
      <div style={{ marginTop: 16 }}>
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
          <span>Filas de talles ({config.filas.length}/10)</span>
          {config.filas.length < 10 && (
            <button
              type="button"
              onClick={addFila}
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
              Agregar talle
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {config.filas.map((fila, idx) => (
            <div
              key={idx}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '8px 10px',
                display: 'grid',
                gridTemplateColumns: '70px 1fr 1fr 1fr auto',
                gap: 8,
                alignItems: 'center',
              }}
            >
              {/* Talle */}
              <input
                type="text"
                value={fila.talle}
                onChange={(e) => updateFila(idx, 'talle', e.target.value.toUpperCase())}
                placeholder="Talle"
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  fontSize: 12,
                  fontWeight: 800,
                  textAlign: 'center',
                  background: '#ffffff',
                }}
              />
              {/* Col1 */}
              <input
                type="text"
                value={fila.col1}
                onChange={(e) => updateFila(idx, 'col1', e.target.value)}
                placeholder="Pecho (cm)"
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  fontSize: 12,
                  background: '#ffffff',
                }}
              />
              {/* Col2 */}
              <input
                type="text"
                value={fila.col2}
                onChange={(e) => updateFila(idx, 'col2', e.target.value)}
                placeholder="Cintura (cm)"
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  fontSize: 12,
                  background: '#ffffff',
                }}
              />
              {/* Col3 */}
              <input
                type="text"
                value={fila.col3}
                onChange={(e) => updateFila(idx, 'col3', e.target.value)}
                placeholder="Cadera (cm)"
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  fontSize: 12,
                  background: '#ffffff',
                }}
              />

              {/* Botón Borrar */}
              {config.filas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFila(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    padding: 4,
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
        title="Colores del Botón y Modal"
        description="Personalizá los colores del botón disparador y de la tabla de medidas."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Fondo del botón disparador"
            value={config.botonBgColor}
            onChange={(v) => updateCfg('botonBgColor', v)}
          />
          <ColorPicker
            label="Texto del botón disparador"
            value={config.botonTextColor}
            onChange={(v) => updateCfg('botonTextColor', v)}
          />
          <ColorPicker
            label="Borde del botón disparador"
            value={config.botonBorderColor}
            onChange={(v) => updateCfg('botonBorderColor', v)}
          />
          <ColorPicker
            label="Fondo del encabezado de la tabla"
            value={config.headerBgColor}
            onChange={(v) => updateCfg('headerBgColor', v)}
          />
          <ColorPicker
            label="Texto del encabezado de la tabla"
            value={config.headerTextColor}
            onChange={(v) => updateCfg('headerTextColor', v)}
          />
          <ColorPicker
            label="Fondo del modal"
            value={config.modalBgColor}
            onChange={(v) => updateCfg('modalBgColor', v)}
          />
          <ColorPicker
            label="Texto principal del modal"
            value={config.modalTextColor}
            onChange={(v) => updateCfg('modalTextColor', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Diseño"
        description="Adaptá la redondez de los bordes del botón y del modal."
      >
        <Slider
          label="Bordes redondeados"
          value={config.bordesRedondeados}
          min={0}
          max={24}
          onChange={(v) => updateCfg('bordesRedondeados', v)}
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
              ? `Evento activo: ${TALLES_CAMPAIGN_THEMES[config.campaignTheme]?.name || 'Personalizado'}`
              : 'Diseño Normal activo'}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {config.campaignTheme && config.campaignTheme !== 'none'
              ? 'El modal de medidas y el botón disparador adaptarán automáticamente toda su paleta visual al evento comercial seleccionado.'
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
        {Object.entries(TALLES_CAMPAIGN_THEMES).map(([key, theme]) => {
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
                      background: theme.botonBgColor,
                      border: '1px solid #d1d5db',
                    }}
                    title="Botón disparador"
                  />
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: theme.modalBgColor,
                      border: '1px solid #d1d5db',
                    }}
                    title="Fondo del modal"
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
            <span>Vista previa interactiva</span>
          </div>
          <TablaTallesPreview
            config={config}
            isOpen={modalPreviewOpen}
            onToggleModal={() => setModalPreviewOpen((v) => !v)}
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
