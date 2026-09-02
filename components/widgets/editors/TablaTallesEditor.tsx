'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Ruler,
  Plus,
  Trash2,
  Eye,
  Save,
  Loader2,
  X,
  HelpCircle,
  Palette,
  Type,
  Layers,
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

export interface TalleFila {
  talle: string;
  col1: string;
  col2: string;
  col3: string;
}

interface TablaTallesConfig {
  textoBoton: string;
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
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: TablaTallesConfig = {
  textoBoton: '📏 Guía de talles',
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
function TablaTallesPreview({
  config,
  isOpen,
  onToggleModal,
}: {
  config: TablaTallesConfig;
  isOpen: boolean;
  onToggleModal: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
      {/* Botón Disparador en la Tienda */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="button"
          onClick={onToggleModal}
          style={{
            background: config.botonBgColor,
            color: config.botonTextColor,
            border: `1.5px solid ${config.botonBorderColor}`,
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
          background: config.modalBgColor,
          border: '1.5px solid #e5e7eb',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: config.modalTextColor,
                letterSpacing: '-0.01em',
              }}
            >
              {config.tituloModal}
            </div>
            {config.subtextoModal && (
              <div style={{ fontSize: 11, color: config.modalTextColor, opacity: 0.65, marginTop: 2 }}>
                {config.subtextoModal}
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: 11,
              background: '#f3f4f6',
              color: '#6b7280',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            Vista Modal
          </span>
        </div>

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
              <tr style={{ background: config.headerBgColor, color: config.headerTextColor }}>
                {config.columnas.map((col, idx) => (
                  <th
                    key={idx}
                    style={{
                      padding: '8px 10px',
                      fontWeight: 800,
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.filas.map((fila, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <td style={{ padding: '8px 10px', fontWeight: 900, color: config.modalTextColor }}>
                    {fila.talle}
                  </td>
                  <td style={{ padding: '8px 10px', color: config.modalTextColor }}>
                    {fila.col1} cm
                  </td>
                  <td style={{ padding: '8px 10px', color: config.modalTextColor }}>
                    {fila.col2} cm
                  </td>
                  <td style={{ padding: '8px 10px', color: config.modalTextColor }}>
                    {fila.col3} cm
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
              background: '#f9fafb',
              borderRadius: 8,
              border: '1px solid #f3f4f6',
              fontSize: 11,
              color: '#4b5563',
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
      <FieldInput
        label="Texto del botón en la página del producto"
        value={config.textoBoton}
        placeholder="📏 Guía de talles"
        onChange={(v) => updateCfg('textoBoton', v)}
      />

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
