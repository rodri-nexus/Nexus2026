// components/widgets/editors/BadgeCuotasEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BadgeCuotasPreview from './BadgeCuotasPreview';
import {
  Toggle,
  ColorPicker,
  Slider,
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

interface BadgeCuotasEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

type BadgeEstilo = 'clasico' | 'moderno' | 'minimal' | 'destacado';

interface BadgeCuotasConfig {
  cuotas: number;
  interes: 'sin_interes' | 'con_interes';
  porcentaje_interes: number;
  texto_principal: string;
  texto_secundario: string;
  mostrarIcono: boolean;
  icono: string;
  estilo: BadgeEstilo;
  colorFondo: string;
  colorTexto: string;
  colorAcento: string;
  colorBorde: string;
  borderRadius: number;
  paddingWidget: number;
  fontSize: string;
  fontSizeSecundario: string;
  mostrarEnProducto: boolean;
  mostrarEnCarrito: boolean;
  posicion: 'before-button' | 'after-price' | 'before-title';
  animacion: boolean;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const defaultConfig: BadgeCuotasConfig = {
  cuotas: 3,
  interes: 'sin_interes',
  porcentaje_interes: 0,
  texto_principal: '{cuotas} cuotas sin interés',
  texto_secundario: '¡Sin recargo!',
  mostrarIcono: true,
  icono: '💳',
  estilo: 'moderno',
  colorFondo: '#ffffff',
  colorTexto: '#1a1a2e',
  colorAcento: '#6366f1',
  colorBorde: '#e5e7eb',
  borderRadius: 10,
  paddingWidget: 14,
  fontSize: '15px',
  fontSizeSecundario: '12px',
  mostrarEnProducto: true,
  mostrarEnCarrito: false,
  posicion: 'before-button',
  animacion: false,
};

/* ═══════════════════════════════════════════
   SUB: Card colapsable
═══════════════════════════════════════════ */
function EditorCard({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: '#ffffff', borderRadius: 14,
      border: '1px solid #e5e7eb', marginBottom: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: 10, padding: '14px 16px', background: 'none',
          border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid #f3f4f6' : 'none',
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
          {title}
        </span>
        <span style={{
          fontSize: 12, color: '#9ca3af',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>
          ▼
        </span>
      </button>
      {open && <div style={{ padding: '12px 16px 16px' }}>{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: StyleCard
═══════════════════════════════════════════ */
function StyleCard({
  label, emoji, active, onClick,
}: {
  label: string; emoji: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '14px 8px', borderRadius: 12,
        border: active ? '2px solid #6366f1' : '2px solid #e5e7eb',
        background: active ? '#eef2ff' : '#fafafa',
        cursor: 'pointer', transition: 'all 0.2s',
        outline: 'none', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#4f46e5' : '#374151' }}>
        {label}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════
   SUB: PlacementChip
═══════════════════════════════════════════ */
function PlacementChip({
  label, active, onClick,
}: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: 20,
        border: active ? '2px solid #6366f1' : '1.5px solid #d1d5db',
        background: active ? '#eef2ff' : '#fafafa',
        color: active ? '#4f46e5' : '#6b7280',
        fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {active && '✓ '}{label}
    </button>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BadgeCuotasEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: BadgeCuotasEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BadgeCuotasConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile');
  const [isDesktop, setIsDesktop] = useState(false);

  const isEditing = !!existingWidget;

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const update = <K extends keyof BadgeCuotasConfig>(
    key: K,
    value: BadgeCuotasConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

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
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);
      setTimeout(() => router.push('/dashboard'), 900);
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
    } finally {
      setSaving(false);
    }
  };

  /* ═══ SIDEBAR ═══ */
  const sidebarContent = (
    <>
      {/* ── CUOTAS ── */}
      <EditorCard title="Cuotas" icon="💳" defaultOpen={true}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, fontWeight: 500 }}>
            Cantidad de cuotas:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
            {[3, 6, 9, 12].map((n) => {
              const act = config.cuotas === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => update('cuotas', n)}
                  style={{
                    padding: '10px 6px', borderRadius: 8,
                    border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                    background: act ? '#eef2ff' : '#fff',
                    cursor: 'pointer', fontSize: 13, fontWeight: 700,
                    color: act ? '#4f46e5' : '#374151',
                  }}
                >
                  {n}x
                </button>
              );
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[18, 24, 36].map((n) => {
              const act = config.cuotas === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => update('cuotas', n)}
                  style={{
                    padding: '10px 6px', borderRadius: 8,
                    border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                    background: act ? '#eef2ff' : '#fff',
                    cursor: 'pointer', fontSize: 13, fontWeight: 700,
                    color: act ? '#4f46e5' : '#374151',
                  }}
                >
                  {n}x
                </button>
              );
            })}
          </div>
        </div>

        <SectionTitle>Tipo de cuota</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'sin_interes', label: '✅ Sin interés', desc: 'Más conversión' },
            { id: 'con_interes', label: '💰 Con interés', desc: 'Con recargo' },
          ].map((opt) => {
            const act = config.interes === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => update('interes', opt.id as any)}
                style={{
                  flex: 1, padding: '12px 10px', borderRadius: 10,
                  border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                  background: act ? '#eef2ff' : '#fafafa',
                  cursor: 'pointer', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: act ? '#4f46e5' : '#374151' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{opt.desc}</div>
              </button>
            );
          })}
        </div>

        {config.interes === 'con_interes' && (
          <Slider
            label="Porcentaje de interés"
            value={config.porcentaje_interes}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => update('porcentaje_interes', v)}
          />
        )}

        <SectionTitle>Textos</SectionTitle>
        <FieldInput
          label='Texto principal (usá {cuotas})'
          value={config.texto_principal}
          placeholder="{cuotas} cuotas sin interés"
          onChange={(v) => update('texto_principal', v)}
        />
        <FieldInput
          label="Texto secundario"
          value={config.texto_secundario}
          placeholder="¡Sin recargo!"
          onChange={(v) => update('texto_secundario', v)}
        />

        <SectionTitle>Ícono</SectionTitle>
        <Toggle
          label="Mostrar ícono"
          checked={config.mostrarIcono}
          onChange={(v) => update('mostrarIcono', v)}
        />
        {config.mostrarIcono && (
          <>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, marginTop: 8 }}>
              Elegí un ícono:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {['💳', '🏦', '💰', '✅', '🎁', '⭐', '🔥', '💎', '🛍', '🏷️', '💵', '🤝'].map((ic) => {
                const act = config.icono === ic;
                return (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => update('icono', ic)}
                    style={{
                      padding: '8px', borderRadius: 8, fontSize: 20,
                      border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                      background: act ? '#eef2ff' : '#fff', cursor: 'pointer',
                    }}
                  >
                    {ic}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </EditorCard>

      {/* ── DISEÑO ── */}
      <EditorCard title="Diseño" icon="🎨" defaultOpen={true}>
        <SectionTitle>Estilo</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <StyleCard label="Moderno" emoji="✨" active={config.estilo === 'moderno'} onClick={() => update('estilo', 'moderno')} />
          <StyleCard label="Clásico" emoji="🏷️" active={config.estilo === 'clasico'} onClick={() => update('estilo', 'clasico')} />
          <StyleCard label="Minimal" emoji="⚪" active={config.estilo === 'minimal'} onClick={() => update('estilo', 'minimal')} />
          <StyleCard label="Destacado" emoji="🔥" active={config.estilo === 'destacado'} onClick={() => update('estilo', 'destacado')} />
        </div>

        <SectionTitle>Colores</SectionTitle>
        <ColorPicker label="Fondo" value={config.colorFondo} onChange={(v) => update('colorFondo', v)} />
        <ColorPicker label="Texto" value={config.colorTexto} onChange={(v) => update('colorTexto', v)} />
        <ColorPicker label="Color acento" value={config.colorAcento} onChange={(v) => update('colorAcento', v)} />
        <ColorPicker label="Borde" value={config.colorBorde} onChange={(v) => update('colorBorde', v)} />

        <SectionTitle>Tipografía</SectionTitle>
        <FieldSelect
          label="Tamaño texto principal"
          value={config.fontSize}
          onChange={(v) => update('fontSize', v)}
          options={[
            { value: '13px', label: 'Pequeño' },
            { value: '15px', label: 'Mediano' },
            { value: '17px', label: 'Grande' },
            { value: '20px', label: 'Muy grande' },
          ]}
        />
        <FieldSelect
          label="Tamaño texto secundario"
          value={config.fontSizeSecundario}
          onChange={(v) => update('fontSizeSecundario', v)}
          options={[
            { value: '10px', label: 'Pequeño' },
            { value: '12px', label: 'Mediano' },
            { value: '14px', label: 'Grande' },
          ]}
        />

        <SectionTitle>Espacios y bordes</SectionTitle>
        <Slider
          label="Borde redondeado"
          value={config.borderRadius}
          min={0}
          max={30}
          unit="px"
          onChange={(v) => update('borderRadius', v)}
        />
        <Slider
          label="Margen interno"
          value={config.paddingWidget}
          min={6}
          max={30}
          unit="px"
          onChange={(v) => update('paddingWidget', v)}
        />
      </EditorCard>

      {/* ── UBICACIÓN ── */}
      <EditorCard title="Ubicación" icon="📍" defaultOpen={true}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.4 }}>
          Elegí dónde aparece el badge en tu tienda.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <PlacementChip
            label="🛍 Producto"
            active={config.mostrarEnProducto}
            onClick={() => update('mostrarEnProducto', !config.mostrarEnProducto)}
          />
          <PlacementChip
            label="🛒 Carrito"
            active={config.mostrarEnCarrito}
            onClick={() => update('mostrarEnCarrito', !config.mostrarEnCarrito)}
          />
        </div>

        {config.mostrarEnProducto && (
          <div style={{ paddingLeft: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Posición en el producto:
            </div>
            {[
              { value: 'before-button', label: 'Antes del botón "Agregar al carrito"', desc: 'Máxima conversión' },
              { value: 'after-price', label: 'Debajo del precio', desc: 'Visible junto al precio' },
              { value: 'before-title', label: 'Antes del título', desc: 'Impacto visual arriba' },
            ].map((opt) => {
              const act = config.posicion === opt.value;
              return (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10,
                    border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                    background: act ? '#eef2ff' : '#fafafa', marginBottom: 8,
                    cursor: 'pointer', alignItems: 'center',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: act ? '5px solid #6366f1' : '2px solid #d1d5db',
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{opt.desc}</div>
                  </div>
                  <input
                    type="radio"
                    name="posicion"
                    value={opt.value}
                    checked={act}
                    onChange={() => update('posicion', opt.value as any)}
                    style={{ display: 'none' }}
                  />
                </label>
              );
            })}
          </div>
        )}
      </EditorCard>
    </>
  );

  /* ═══ PREVIEW ═══ */
  const previewContent = (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
        <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 3, display: 'inline-flex', gap: 2 }}>
          {(['desktop', 'mobile'] as const).map((m) => {
            const act = previewMode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setPreviewMode(m)}
                style={{
                  padding: '6px 16px', borderRadius: 8, border: 'none',
                  background: act ? '#ffffff' : 'transparent',
                  boxShadow: act ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontSize: 12, fontWeight: 600,
                  color: act ? '#1a1a2e' : '#9ca3af', cursor: 'pointer',
                }}
              >
                {m === 'desktop' ? '🖥 Desktop' : '📱 Mobile'}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{
        maxWidth: previewMode === 'desktop' ? 600 : 375,
        margin: '0 auto',
        transition: 'max-width 0.3s ease',
      }}>
        <BadgeCuotasPreview config={config} />
      </div>
    </div>
  );

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', paddingBottom: isDesktop ? 20 : 100 }}>

      {/* ── HEADER ── */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e7eb',
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1px solid #e5e7eb', background: '#fafafa',
            cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#374151', flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isEditing ? 'Editando' : 'Nuevo widget'}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {widgetDefinition.name}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              border: '1.5px solid ' + (isActive ? '#10b981' : '#d1d5db'),
              background: isActive ? '#ecfdf5' : '#fafafa',
              cursor: 'pointer', fontSize: 11, fontWeight: 700,
              color: isActive ? '#059669' : '#6b7280',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: isActive ? '#10b981' : '#9ca3af',
            }} />
            {isActive ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '8px 18px', borderRadius: 10, border: 'none',
              background: savedOK
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}
          >
            {saving ? '...' : savedOK ? '✓' : isEditing ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{
        display: isDesktop ? 'flex' : 'block',
        maxWidth: 1200, margin: '0 auto',
        padding: isDesktop ? '20px 20px' : '16px 12px',
        gap: 20,
      }}>
        {!isDesktop && (
          <div style={{ marginBottom: 16 }}>{previewContent}</div>
        )}

        <div style={{
          width: isDesktop ? 380 : '100%', flexShrink: 0,
          maxHeight: isDesktop ? 'calc(100vh - 80px)' : 'none',
          overflowY: isDesktop ? 'auto' : 'visible',
          paddingRight: isDesktop ? 4 : 0,
        }}>
          {sidebarContent}
        </div>

        {isDesktop && (
          <div style={{
            flex: 1, position: 'sticky', top: 80, alignSelf: 'flex-start',
            background: '#ffffff', borderRadius: 16, border: '1px solid #e5e7eb',
            padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {previewContent}
          </div>
        )}
      </div>

      {/* ── FOOTER MOBILE ── */}
      {!isDesktop && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#ffffff', borderTop: '1px solid #e5e7eb',
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)', zIndex: 30,
        }}>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 10,
              border: '1.5px solid ' + (isActive ? '#10b981' : '#e5e7eb'),
              background: isActive ? '#ecfdf5' : '#fafafa',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? '#10b981' : '#9ca3af' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#059669' : '#6b7280' }}>
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, padding: '14px 20px', borderRadius: 12, border: 'none',
              background: savedOK
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
          </button>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div style={{
          position: 'fixed', bottom: isDesktop ? 20 : 90, left: 16, right: 16,
          background: '#fee2e2', color: '#991b1b', padding: '12px 16px',
          borderRadius: 12, fontSize: 13, fontWeight: 600,
          border: '1px solid #fecaca', zIndex: 40,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
  }
