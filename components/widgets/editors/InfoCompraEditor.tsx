'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

interface EditorProps {
  widgetDefinition: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string;
  };
  existingWidget: {
    id: string;
    config: any;
    is_active: boolean;
    target_type: string;
    target_product_id: number | null;
  } | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface InfoCompraConfig {
  // Toggles de módulos
  mostrarEnvio: boolean;
  mostrarCuotas: boolean;
  mostrarTransferencia: boolean;

  // Config Envío
  diasHastaEnvio: number;
  diasParaEntrega: number;
  horaCorte: string;
  mostrarHoraLimite: boolean;
  mostrarRangoEntrega: boolean;

  // Config Cuotas
  textoCuotas: string;
  subtextoCuotas: string;
  badgeCuotas: string;

  // Config Transferencia
  textoTransferencia: string;
  subtextoTransferencia: string;
  badgeTransferencia: string;

  // Estilos
  colorFondo: '#FFFFFF' | string;
  colorTexto: string;
  colorIconos: string;
  colorBadgeFondo: string;
  colorBadgeTexto: string;
  activarBorde: boolean;
  colorBorde: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

const DEFAULT_CONFIG: InfoCompraConfig = {
  mostrarEnvio: true,
  mostrarCuotas: true,
  mostrarTransferencia: true,

  diasHastaEnvio: 1,
  diasParaEntrega: 2,
  horaCorte: '18:00',
  mostrarHoraLimite: true,
  mostrarRangoEntrega: true,

  textoCuotas: 'Hasta 6 cuotas sin interés',
  subtextoCuotas: 'Con todas las tarjetas bancarias',
  badgeCuotas: 'PROMO',

  textoTransferencia: '10% de descuento pagando con Transferencia',
  subtextoTransferencia: 'Aplica automáticamente en el checkout',
  badgeTransferencia: '10% OFF',

  colorFondo: '#ffffff',
  colorTexto: '#1f2937',
  colorIconos: '#10B981',
  colorBadgeFondo: '#10B981',
  colorBadgeTexto: '#ffffff',
  activarBorde: true,
  colorBorde: '#e5e7eb',
  bordesRedondeados: 12,
  paddingInterno: 16,
};

/* ================= PREVIEW EN VIVO ================= */

function InfoCompraPreview({ config }: { config: InfoCompraConfig }) {
  return (
    <div
      style={{
        background: config.colorFondo,
        border: config.activarBorde ? `1px solid ${config.colorBorde}` : 'none',
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* BLOQUE CUOTAS */}
      {config.mostrarCuotas && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            💳
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: config.colorTexto }}>
                {config.textoCuotas || 'Cuotas sin interés'}
              </span>
              {config.badgeCuotas && (
                <span
                  style={{
                    background: config.colorBadgeFondo,
                    color: config.colorBadgeTexto,
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  {config.badgeCuotas}
                </span>
              )}
            </div>
            {config.subtextoCuotas && (
              <div style={{ fontSize: 11, color: config.colorTexto, opacity: 0.65 }}>
                {config.subtextoCuotas}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLOQUE TRANSFERENCIA */}
      {config.mostrarTransferencia && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            💵
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: config.colorTexto }}>
                {config.textoTransferencia || 'Descuento por transferencia'}
              </span>
              {config.badgeTransferencia && (
                <span
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  {config.badgeTransferencia}
                </span>
              )}
            </div>
            {config.subtextoTransferencia && (
              <div style={{ fontSize: 11, color: config.colorTexto, opacity: 0.65 }}>
                {config.subtextoTransferencia}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLOQUE ENVÍO */}
      {config.mostrarEnvio && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🚚
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: config.colorTexto }}>
              Envíos a todo el país
            </div>
            <div style={{ fontSize: 11, color: config.colorTexto, opacity: 0.65 }}>
              Despachamos en 24hs hábiles
            </div>
          </div>
        </div>
      )}

      {!config.mostrarCuotas && !config.mostrarTransferencia && !config.mostrarEnvio && (
        <div style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', padding: 10 }}>
          Activá al menos una sección para visualizar el widget.
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS UI ================= */

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18, marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>{description}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 6 }}>{children}</div>;
}

function TextInput({ value, onChange, placeholder }: { value: string | number; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        fontSize: 14,
        color: '#000000',
        outline: 'none',
        boxSizing: 'border-box',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function ToggleField({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifySpace: 'space-between', gap: 10, cursor: 'pointer' }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#000000', flex: 1 }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 999,
          background: checked ? '#10B981' : '#e5e7eb',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#FFFFFF',
            position: 'absolute',
            top: 3,
            left: checked ? 23 : 3,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </label>
  );
}

function ColorPickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="color"
        value={value || '#FFFFFF'}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 40, height: 38, border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', padding: 2 }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontFamily: 'monospace' }}
      />
    </div>
  );
}

/* ================= EDITOR PRINCIPAL ================= */

export default function InfoCompraEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = useMemo(() => {
    return { ...DEFAULT_CONFIG, ...(existingWidget?.config || {}) };
  }, [existingWidget]);

  const [config, setConfig] = useState<InfoCompraConfig>(initialConfig);
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = useState<'secciones' | 'estilos'>('secciones');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = (k: keyof InfoCompraConfig, v: any) => setConfig((c) => ({ ...c, [k]: v }));

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
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) params.set('product', String(productId));
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
    } catch (e: any) {
      setError(e.message || 'Error al guardar el widget');
      setSaving(false);
    }
  };

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
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
          NX
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#000000', marginBottom: 16 }}>
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '} {widgetDefinition.name}
        </h1>

        {/* PREVIEW EN VIVO */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <InfoCompraPreview config={config} />
        </div>

        {/* EDITOR */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20 }}>
          {/* TABS */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
            {(['secciones', 'estilos'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: tab === t ? '2px solid #10B981' : '2px solid transparent',
                  color: tab === t ? '#10B981' : '#000000',
                  fontWeight: tab === t ? 700 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {t === 'secciones' ? '⚙️ Secciones & Contenido' : '🎨 Estilos & Colores'}
              </button>
            ))}
          </div>

          {/* TAB 1: SECCIONES */}
          {tab === 'secciones' && (
            <div>
              <SectionCard title="1. Cuotas y Financiación 💳" description="Ofrecé cuotas sin interés para incentivar la venta.">
                <ToggleField label="Mostrar sección de Cuotas" checked={config.mostrarCuotas} onChange={(v) => updateCfg('mostrarCuotas', v)} />
                {config.mostrarCuotas && (
                  <>
                    <div>
                      <FieldLabel>Texto principal</FieldLabel>
                      <TextInput value={config.textoCuotas} onChange={(v) => updateCfg('textoCuotas', v)} placeholder="Hasta 6 cuotas sin interés" />
                    </div>
                    <div>
                      <FieldLabel>Subtexto informativo</FieldLabel>
                      <TextInput value={config.subtextoCuotas} onChange={(v) => updateCfg('subtextoCuotas', v)} placeholder="Con todas las tarjetas" />
                    </div>
                    <div>
                      <FieldLabel>Etiqueta / Badge (ej: PROMO)</FieldLabel>
                      <TextInput value={config.badgeCuotas} onChange={(v) => updateCfg('badgeCuotas', v)} placeholder="PROMO" />
                    </div>
                  </>
                )}
              </SectionCard>

              <SectionCard title="2. Descuento por Transferencia 💵" description="Destacá el beneficio de pago inmediato.">
                <ToggleField label="Mostrar sección de Transferencia" checked={config.mostrarTransferencia} onChange={(v) => updateCfg('mostrarTransferencia', v)} />
                {config.mostrarTransferencia && (
                  <>
                    <div>
                      <FieldLabel>Texto principal</FieldLabel>
                      <TextInput value={config.textoTransferencia} onChange={(v) => updateCfg('textoTransferencia', v)} placeholder="10% OFF pagando con Transferencia" />
                    </div>
                    <div>
                      <FieldLabel>Subtexto informativo</FieldLabel>
                      <TextInput value={config.subtextoTransferencia} onChange={(v) => updateCfg('subtextoTransferencia', v)} placeholder="Aplica en el checkout" />
                    </div>
                    <div>
                      <FieldLabel>Etiqueta / Badge (ej: 10% OFF)</FieldLabel>
                      <TextInput value={config.badgeTransferencia} onChange={(v) => updateCfg('badgeTransferencia', v)} placeholder="10% OFF" />
                    </div>
                  </>
                )}
              </SectionCard>

              <SectionCard title="3. Información de Envíos 🚚" description="Tranquilizá al cliente sobre los tiempos de despacho.">
                <ToggleField label="Mostrar sección de Envíos" checked={config.mostrarEnvio} onChange={(v) => updateCfg('mostrarEnvio', v)} />
              </SectionCard>
            </div>
          )}

          {/* TAB 2: ESTILOS */}
          {tab === 'estilos' && (
            <div>
              <SectionCard title="Colores generales" description="Personalizá la paleta de colores de la tarjeta unificada.">
                <div>
                  <FieldLabel>Color de fondo</FieldLabel>
                  <ColorPickerField value={config.colorFondo} onChange={(v) => updateCfg('colorFondo', v)} />
                </div>
                <div>
                  <FieldLabel>Color del texto</FieldLabel>
                  <ColorPickerField value={config.colorTexto} onChange={(v) => updateCfg('colorTexto', v)} />
                </div>
                <div>
                  <FieldLabel>Color del badge PROMO</FieldLabel>
                  <ColorPickerField value={config.colorBadgeFondo} onChange={(v) => updateCfg('colorBadgeFondo', v)} />
                </div>
              </SectionCard>
            </div>
          )}

          {/* GUARDAR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
            <ToggleField label="Widget activo" checked={isActive} onChange={setIsActive} />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                background: '#10B981',
                color: '#ffffff',
                border: 'none',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>

          {error && <div style={{ marginTop: 12, padding: 10, background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: 13 }}>{error}</div>}
        </div>

        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
}
