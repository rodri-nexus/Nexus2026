// components/widgets/editors/CountdownEditor.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditorTabs from './EditorTabs';
import CountdownPreview from './CountdownPreview';
import {
  Toggle,
  ColorPicker,
  Slider,
  RadioGroup,
  FieldInput,
  FieldSelect,
  SectionTitle,
} from './EditorFields';

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
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface CountdownEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface CountdownConfig {
  title: string;
  subtitle: string;
  endDate: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  autoRestart: boolean;
  showOnProduct: boolean;
  productPosition: 'before-button' | 'before-title';
  showAsTopBar: boolean;
  showOnCart: boolean;
  style: 'clasico' | 'retro';
  alignment: 'center' | 'left';
  showLabels: boolean;
  bgType: 'solid' | 'gradient';
  colorWidgetBg: string;
  colorSubtitleBg: string;
  colorClockBg: string;
  colorTitle: string;
  colorSubtitle: string;
  colorNumbers: string;
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  fontSizeClock: string;
  borderRadiusClock: number;
  borderRadiusWidget: number;
  paddingWidget: number;
  paddingClock: number;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const defaultConfig: CountdownConfig = {
  title: '⚡ Oferta por tiempo limitado',
  subtitle: 'Aprovechá antes que termine',
  endDate: '',
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  autoRestart: false,
  showOnProduct: true,
  productPosition: 'before-button',
  showAsTopBar: false,
  showOnCart: false,
  style: 'clasico',
  alignment: 'center',
  showLabels: true,
  bgType: 'gradient',
  colorWidgetBg: '#667eea',
  colorSubtitleBg: '#764ba2',
  colorClockBg: '#ffffff',
  colorTitle: '#ffffff',
  colorSubtitle: '#ffffff',
  colorNumbers: '#1a1a2e',
  fontSizeTitle: '20px',
  fontSizeSubtitle: '13px',
  fontSizeClock: '22px',
  borderRadiusClock: 10,
  borderRadiusWidget: 16,
  paddingWidget: 20,
  paddingClock: 8,
};

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: CountdownEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CountdownConfig>({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  });
  const [isActive, setIsActive] = useState<boolean>(
    existingWidget?.is_active ?? true
  );
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!existingWidget;

  const update = <K extends keyof CountdownConfig>(
    key: K,
    value: CountdownConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  /* ── Guardar ── */
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSavedOK(false);

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Error al guardar');
      }

      setSavedOK(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 900);
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
    } finally {
      setSaving(false);
    }
  };

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f6f8',
        paddingBottom: 100,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            background: '#fafafa',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#374151',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              color: '#9ca3af',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isEditing ? 'Editando' : 'Nuevo widget'}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#1a1a2e',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {widgetDefinition.name}
          </div>
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ padding: '20px 16px 8px' }}>
        <CountdownPreview config={config} />
      </div>

      {/* ── Tabs + configuración ── */}
      <div style={{ padding: '12px 16px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: 16,
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <EditorTabs
            tabs={[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'ubicacion', label: 'Ubicación', icon: '📍' },
              { id: 'estilos', label: 'Estilos', icon: '🎨' },
            ]}
          >
            {/* ══════════ TAB GENERAL ══════════ */}
            <div>
              <SectionTitle>Contenido</SectionTitle>
              <FieldInput
                label="Título"
                value={config.title}
                placeholder="⚡ Oferta por tiempo limitado"
                onChange={(v) => update('title', v)}
              />
              <FieldInput
                label="Subtítulo (opcional)"
                value={config.subtitle}
                placeholder="Aprovechá antes que termine"
                onChange={(v) => update('subtitle', v)}
              />

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 8,
                  }}
                >
                  Fecha y hora final
                </label>
                <input
                  type="datetime-local"
                  value={config.endDate}
                  onChange={(e) => update('endDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 14,
                    color: '#1a1a2e',
                    background: '#fafafa',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <SectionTitle>Unidades del contador</SectionTitle>

              {/* Hint contextual */}
              <div
                style={{
                  background: '#f0f4ff',
                  border: '1px solid #c7d2fe',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 16,
                  fontSize: 12,
                  color: '#4338ca',
                  lineHeight: 1.5,
                }}
              >
                💡 Activá solo las unidades que quieras mostrar. Ejemplo: solo MIN + SEG para una flash sale rápida.
              </div>

              <Toggle
                label="Mostrar días"
                description="Incluir días en el contador"
                checked={config.showDays}
                onChange={(v) => update('showDays', v)}
              />
              <Toggle
                label="Mostrar horas"
                description="Incluir horas en el contador"
                checked={config.showHours}
                onChange={(v) => update('showHours', v)}
              />
              <Toggle
                label="Mostrar minutos"
                description="Incluir minutos en el contador"
                checked={config.showMinutes}
                onChange={(v) => update('showMinutes', v)}
              />
              <Toggle
                label="Mostrar segundos"
                description="Incluir segundos en el contador"
                checked={config.showSeconds}
                onChange={(v) => update('showSeconds', v)}
              />

              <SectionTitle>Comportamiento</SectionTitle>
              <Toggle
                label="Reiniciar automáticamente"
                description="Cuando termine el contador, vuelve a empezar"
                checked={config.autoRestart}
                onChange={(v) => update('autoRestart', v)}
              />
            </div>

            {/* ══════════ TAB UBICACIÓN ══════════ */}
            <div>
              <SectionTitle>En ficha de producto</SectionTitle>
              <Toggle
                label="Mostrar en ficha de producto"
                description="Aparece dentro de la página del producto"
                checked={config.showOnProduct}
                onChange={(v) => update('showOnProduct', v)}
              />

              {config.showOnProduct && (
                <div style={{ marginTop: 12, paddingLeft: 4 }}>
                  <RadioGroup
                    label="Posición dentro del producto"
                    value={config.productPosition}
                    onChange={(v) =>
                      update('productPosition', v as 'before-button' | 'before-title')
                    }
                    options={[
                      {
                        value: 'before-button',
                        label: 'Antes del botón "Agregar al carrito"',
                        description: 'Máxima conversión, justo antes de la acción',
                      },
                      {
                        value: 'before-title',
                        label: 'Antes del título del producto',
                        description: 'Impacto visual arriba de todo',
                      },
                    ]}
                  />
                </div>
              )}

              <SectionTitle>Otras ubicaciones</SectionTitle>
              <Toggle
                label="Barra fija arriba de la tienda"
                description="Se muestra fija en el header de todas las páginas"
                checked={config.showAsTopBar}
                onChange={(v) => update('showAsTopBar', v)}
              />
              <Toggle
                label="Mostrar en el carrito"
                description="Aparece dentro del carrito de compras"
                checked={config.showOnCart}
                onChange={(v) => update('showOnCart', v)}
              />
            </div>

            {/* ══════════ TAB ESTILOS ══════════ */}
            <div>
              <SectionTitle>Estilo del reloj</SectionTitle>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {[
                  { value: 'clasico', label: 'Clásico', emoji: '⏱️' },
                  { value: 'retro', label: 'Retro flip', emoji: '🎰' },
                ].map((opt) => {
                  const active = config.style === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('style', opt.value as 'clasico' | 'retro')}
                      style={{
                        padding: '18px 12px',
                        borderRadius: 12,
                        border: active ? '2px solid #667eea' : '2px solid #e5e7eb',
                        background: active ? '#f5f3ff' : '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{opt.emoji}</div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: active ? '#667eea' : '#374151',
                        }}
                      >
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <SectionTitle>Alineación</SectionTitle>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {[
                  { value: 'left', label: 'Izquierda', emoji: '⬅️' },
                  { value: 'center', label: 'Centrado', emoji: '↔️' },
                ].map((opt) => {
                  const active = config.alignment === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        update('alignment', opt.value as 'center' | 'left')
                      }
                      style={{
                        padding: '14px 12px',
                        borderRadius: 12,
                        border: active ? '2px solid #667eea' : '2px solid #e5e7eb',
                        background: active ? '#f5f3ff' : '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.emoji}</div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: active ? '#667eea' : '#374151',
                        }}
                      >
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Toggle
                label="Mostrar etiquetas (DÍAS, HRS, MIN, SEG)"
                checked={config.showLabels}
                onChange={(v) => update('showLabels', v)}
              />

              <div style={{ height: 12 }} />

              <SectionTitle>Tipo de fondo</SectionTitle>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {[
                  { value: 'solid', label: 'Color sólido' },
                  { value: 'gradient', label: 'Degradé' },
                ].map((opt) => {
                  const active = config.bgType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('bgType', opt.value as 'solid' | 'gradient')}
                      style={{
                        padding: '12px',
                        borderRadius: 12,
                        border: active ? '2px solid #667eea' : '2px solid #e5e7eb',
                        background: active ? '#f5f3ff' : '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none',
                        fontSize: 13,
                        fontWeight: 700,
                        color: active ? '#667eea' : '#374151',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <SectionTitle>Colores</SectionTitle>
              <ColorPicker
                label="Fondo del widget"
                value={config.colorWidgetBg}
                onChange={(v) => update('colorWidgetBg', v)}
              />
              {config.bgType === 'gradient' && (
                <ColorPicker
                  label="Segundo color del degradé"
                  value={config.colorSubtitleBg}
                  onChange={(v) => update('colorSubtitleBg', v)}
                />
              )}
              {config.bgType === 'solid' && (
                <ColorPicker
                  label="Fondo del subtítulo"
                  value={config.colorSubtitleBg}
                  onChange={(v) => update('colorSubtitleBg', v)}
                />
              )}
              <ColorPicker
                label="Fondo del reloj"
                value={config.colorClockBg}
                onChange={(v) => update('colorClockBg', v)}
              />
              <ColorPicker
                label="Fuente del título"
                value={config.colorTitle}
                onChange={(v) => update('colorTitle', v)}
              />
              <ColorPicker
                label="Fuente del subtítulo"
                value={config.colorSubtitle}
                onChange={(v) => update('colorSubtitle', v)}
              />
              <ColorPicker
                label="Números del reloj"
                value={config.colorNumbers}
                onChange={(v) => update('colorNumbers', v)}
              />

              <SectionTitle>Tipografía</SectionTitle>
              <FieldSelect
                label="Tamaño del título"
                value={config.fontSizeTitle}
                onChange={(v) => update('fontSizeTitle', v)}
                options={[
                  { value: '14px', label: 'Pequeño' },
                  { value: '16px', label: 'Mediano' },
                  { value: '20px', label: 'Grande' },
                  { value: '24px', label: 'Muy grande' },
                  { value: '28px', label: 'Enorme' },
                ]}
              />
              <FieldSelect
                label="Tamaño del subtítulo"
                value={config.fontSizeSubtitle}
                onChange={(v) => update('fontSizeSubtitle', v)}
                options={[
                  { value: '11px', label: 'Muy pequeño' },
                  { value: '13px', label: 'Pequeño' },
                  { value: '15px', label: 'Mediano' },
                  { value: '17px', label: 'Grande' },
                ]}
              />
              <FieldSelect
                label="Tamaño del reloj"
                value={config.fontSizeClock}
                onChange={(v) => update('fontSizeClock', v)}
                options={[
                  { value: '16px', label: 'Pequeño' },
                  { value: '20px', label: 'Mediano' },
                  { value: '22px', label: 'Grande' },
                  { value: '26px', label: 'Muy grande' },
                  { value: '32px', label: 'Enorme' },
                ]}
              />

              <SectionTitle>Espacios y bordes</SectionTitle>
              <Slider
                label="Borde del reloj"
                value={config.borderRadiusClock}
                min={0}
                max={25}
                onChange={(v) => update('borderRadiusClock', v)}
              />
              <Slider
                label="Borde del widget"
                value={config.borderRadiusWidget}
                min={0}
                max={25}
                onChange={(v) => update('borderRadiusWidget', v)}
              />
              <Slider
                label="Margen interno del widget"
                value={config.paddingWidget}
                min={0}
                max={40}
                onChange={(v) => update('paddingWidget', v)}
              />
              <Slider
                label="Margen interno del reloj"
                value={config.paddingClock}
                min={0}
                max={30}
                onChange={(v) => update('paddingClock', v)}
              />
            </div>
          </EditorTabs>
        </div>
      </div>

      {/* ── Footer fijo ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
          zIndex: 30,
        }}
      >
        {/* Toggle activo */}
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 10,
            border: '1.5px solid ' + (isActive ? '#10b981' : '#e5e7eb'),
            background: isActive ? '#ecfdf5' : '#fafafa',
            cursor: 'pointer',
            outline: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isActive ? '#10b981' : '#9ca3af',
              boxShadow: isActive ? '0 0 8px rgba(16,185,129,0.6)' : 'none',
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: isActive ? '#059669' : '#6b7280',
            }}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </button>

        {/* Botón guardar */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: 12,
            border: 'none',
            background: savedOK
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          {saving
            ? 'Guardando...'
            : savedOK
            ? '✓ Guardado'
            : isEditing
            ? 'Guardar cambios'
            : 'Crear widget'}
        </button>
      </div>

      {/* ── Error flotante ── */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            left: 16,
            right: 16,
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid #fecaca',
            zIndex: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
              }
