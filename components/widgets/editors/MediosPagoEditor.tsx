'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Check,
  Palette,
  Type,
  Eye,
  Save,
  Loader2,
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

interface MediosPagoConfig {
  titulo: string;
  subtexto: string;
  mostrarVisa: boolean;
  mostrarMastercard: boolean;
  mostrarAmex: boolean;
  mostrarMercadoPago: boolean;
  mostrarNaranja: boolean;
  mostrarTransferencia: boolean;
  mostrarEfectivo: boolean;
  mostrarCabal: boolean;
  mostrarUala: boolean;
  bgColor: string;
  borderColor: string;
  textColor: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: MediosPagoConfig = {
  titulo: 'MEDIOS DE PAGO ACEPTADOS',
  subtexto: 'Comprá de forma 100% segura con tus tarjetas o efectivo',
  mostrarVisa: true,
  mostrarMastercard: true,
  mostrarAmex: true,
  mostrarMercadoPago: true,
  mostrarNaranja: true,
  mostrarTransferencia: true,
  mostrarEfectivo: true,
  mostrarCabal: false,
  mostrarUala: true,
  bgColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#000000',
  bordesRedondeados: 14,
  paddingInterno: 16,
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
   BADGES DE PAGO VISUALES
═══════════════════════════════════════════ */
function PaymentBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <div
      style={{
        background: bg,
        color: color,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        userSelect: 'none',
      }}
    >
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN VIVO
═══════════════════════════════════════════ */
function MediosPagoPreview({ config }: { config: MediosPagoConfig }) {
  return (
    <div
      style={{
        background: config.bgColor,
        border: `1.5px solid ${config.borderColor}`,
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 14,
            color: config.textColor,
            letterSpacing: '-0.01em',
            marginBottom: 2,
          }}
        >
          {config.titulo}
        </div>
        {config.subtexto && (
          <div style={{ fontSize: 11, color: config.textColor, opacity: 0.65 }}>
            {config.subtexto}
          </div>
        )}
      </div>

      {/* Grid de Logos/Badges de Medios de Pago */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {config.mostrarVisa && (
          <PaymentBadge label="VISA" color="#1a1f71" bg="#ffffff" />
        )}
        {config.mostrarMastercard && (
          <PaymentBadge label="Mastercard" color="#eb001b" bg="#ffffff" />
        )}
        {config.mostrarMercadoPago && (
          <PaymentBadge label="Mercado Pago" color="#009ee3" bg="#ffffff" />
        )}
        {config.mostrarAmex && (
          <PaymentBadge label="AMEX" color="#006fcf" bg="#ffffff" />
        )}
        {config.mostrarNaranja && (
          <PaymentBadge label="Naranja X" color="#ff5000" bg="#ffffff" />
        )}
        {config.mostrarTransferencia && (
          <PaymentBadge label="🏦 Transferencia" color="#059669" bg="#ecfdf5" />
        )}
        {config.mostrarEfectivo && (
          <PaymentBadge label="💵 Pago Fácil / Rapipago" color="#374151" bg="#ffffff" />
        )}
        {config.mostrarUala && (
          <PaymentBadge label="Ualá" color="#e31c79" bg="#ffffff" />
        )}
        {config.mostrarCabal && (
          <PaymentBadge label="Cabal" color="#004b93" bg="#ffffff" />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          marginTop: 12,
          fontSize: 10,
          color: '#10B981',
          fontWeight: 700,
        }}
      >
        <ShieldCheck size={13} />
        <span>Pago 100% protegido y encriptado</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function MediosPagoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<MediosPagoConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<MediosPagoConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof MediosPagoConfig>(
    key: K,
    val: MediosPagoConfig[K]
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

  const paymentOptions = [
    { key: 'mostrarVisa' as const, label: 'Visa (Débito y Crédito)', color: '#1a1f71' },
    { key: 'mostrarMastercard' as const, label: 'Mastercard', color: '#eb001b' },
    { key: 'mostrarMercadoPago' as const, label: 'Mercado Pago (Dinero en cuenta)', color: '#009ee3' },
    { key: 'mostrarAmex' as const, label: 'American Express', color: '#006fcf' },
    { key: 'mostrarNaranja' as const, label: 'Tarjeta Naranja X / Plan Z', color: '#ff5000' },
    { key: 'mostrarTransferencia' as const, label: 'Transferencia bancaria directa', color: '#059669' },
    { key: 'mostrarEfectivo' as const, label: 'Efectivo (Pago Fácil / Rapipago)', color: '#374151' },
    { key: 'mostrarUala' as const, label: 'Ualá', color: '#e31c79' },
    { key: 'mostrarCabal' as const, label: 'Cabal', color: '#004b93' },
  ];

  /* ─── TAB GENERAL ─── */
  const tabGeneral = (
    <div>
      <FieldInput
        label="Título del bloque"
        value={config.titulo}
        placeholder="MEDIOS DE PAGO ACEPTADOS"
        onChange={(v) => updateCfg('titulo', v)}
      />

      <FieldInput
        label="Subtexto informativo"
        value={config.subtexto}
        placeholder="Comprá de forma 100% segura con tus tarjetas o efectivo"
        onChange={(v) => updateCfg('subtexto', v)}
      />

      {/* TOGGLES DE MEDIOS DE PAGO */}
      <div style={{ marginTop: 16 }}>
        <label
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 700,
            color: '#000000',
            marginBottom: 10,
          }}
        >
          Elegí los medios de pago que aceptás en tu tienda
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          {paymentOptions.map((opt) => {
            const isChecked = config[opt.key];
            return (
              <label
                key={opt.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: isChecked ? '#f0fdf4' : '#f9fafb',
                  border: isChecked ? '1.5px solid #a7f3d0' : '1px solid #e5e7eb',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: opt.color,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isChecked ? '#000000' : '#6b7280',
                    }}
                  >
                    {opt.label}
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => updateCfg(opt.key, e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#10B981' }}
                />
              </label>
            );
          })}
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
        description="Personalizá los colores de fondo, bordes y tipografía."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Color de fondo de la tarjeta"
            value={config.bgColor}
            onChange={(v) => updateCfg('bgColor', v)}
          />
          <ColorPicker
            label="Color del borde"
            value={config.borderColor}
            onChange={(v) => updateCfg('borderColor', v)}
          />
          <ColorPicker
            label="Color del texto"
            value={config.textColor}
            onChange={(v) => updateCfg('textColor', v)}
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
          <MediosPagoPreview config={config} />
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
