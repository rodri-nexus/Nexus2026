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
  mostrarEnvio: boolean;
  mostrarCuotas: boolean;
  mostrarTransferencia: boolean;

  // Textos libres Cuotas
  textoCuotas: string;
  subtextoCuotas: string;
  badgeCuotas: string;

  // Textos libres Transferencia
  textoTransferencia: string;
  subtextoTransferencia: string;
  badgeTransferencia: string;

  // Textos libres Envío
  textoEnvio: string;
  subtextoEnvio: string;
  badgeEnvio: string;

  // Estilos
  colorFondo: string;
  colorTexto: string;
  colorSubtexto: string;
  colorIconos: string;
  colorBadgeFondo: string;
  colorBadgeTexto: string;
  colorBadgeTransferencia: string;
  activarBorde: boolean;
  colorBorde: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

const DEFAULT_CONFIG: InfoCompraConfig = {
  mostrarEnvio: true,
  mostrarCuotas: true,
  mostrarTransferencia: true,

  textoCuotas: 'Hasta 6 cuotas sin interés',
  subtextoCuotas: 'Con todas las tarjetas bancarias',
  badgeCuotas: 'PROMO',

  textoTransferencia: '10% de descuento pagando con Transferencia',
  subtextoTransferencia: 'Aplica automáticamente en el checkout',
  badgeTransferencia: '10% OFF',

  textoEnvio: 'Envío GRATIS a todo el país',
  subtextoEnvio: 'Despachamos en 24hs hábiles',
  badgeEnvio: '',

  colorFondo: '#000000',
  colorTexto: '#ffffff',
  colorSubtexto: '#9ca3af',
  colorIconos: '#10B981',
  colorBadgeFondo: '#2563eb',
  colorBadgeTexto: '#ffffff',
  colorBadgeTransferencia: '#dc2626',
  activarBorde: true,
  colorBorde: '#1f2937',
  bordesRedondeados: 16,
  paddingInterno: 16,
};

function InfoCompraPreview({ config }: { config: InfoCompraConfig }) {
  const hasAny = config.mostrarCuotas || config.mostrarTransferencia || config.mostrarEnvio;

  return (
    <div
      style={{
        background: config.colorFondo,
        border: config.activarBorde ? `1.5px solid ${config.colorBorde}` : 'none',
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
      }}
    >
      {config.mostrarCuotas && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            💳
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: config.colorTexto }}>
                {config.textoCuotas || 'Cuotas'}
              </span>
              {!!config.badgeCuotas?.trim() && (
                <span
                  style={{
                    background: config.colorBadgeFondo,
                    color: config.colorBadgeTexto,
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {config.badgeCuotas}
                </span>
              )}
            </div>
            {!!config.subtextoCuotas?.trim() && (
              <div style={{ fontSize: 11.5, color: config.colorSubtexto, marginTop: 2 }}>
                {config.subtextoCuotas}
              </div>
            )}
          </div>
        </div>
      )}

      {config.mostrarTransferencia && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            💵
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: config.colorTexto }}>
                {config.textoTransferencia || 'Transferencia'}
              </span>
              {!!config.badgeTransferencia?.trim() && (
                <span
                  style={{
                    background: config.colorBadgeTransferencia,
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {config.badgeTransferencia}
                </span>
              )}
            </div>
            {!!config.subtextoTransferencia?.trim() && (
              <div style={{ fontSize: 11.5, color: config.colorSubtexto, marginTop: 2 }}>
                {config.subtextoTransferencia}
              </div>
            )}
          </div>
        </div>
      )}

      {config.mostrarEnvio && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            🚚
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: config.colorTexto }}>
                {config.textoEnvio || 'Envío'}
              </span>
              {!!config.badgeEnvio?.trim() && (
                <span
                  style={{
                    background: config.colorIconos,
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {config.badgeEnvio}
                </span>
              )}
            </div>
            {!!config.subtextoEnvio?.trim() && (
              <div style={{ fontSize: 11.5, color: config.colorSubtexto, marginTop: 2 }}>
                {config.subtextoEnvio}
              </div>
            )}
          </div>
        </div>
      )}

      {!hasAny && (
        <div style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', padding: 10 }}>
          Activá al menos una sección para visualizar el widget.
        </div>
      )}
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>{description}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 6 }}>{children}</div>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, lineHeight: 1.4 }}>{children}</div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
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

function ToggleField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        cursor: 'pointer',
      }}
    >
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
        style={{
          width: 40,
          height: 38,
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          cursor: 'pointer',
          padding: 2,
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: '9px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: 'monospace',
        }}
      />
    </div>
  );
}

export default function InfoCompraEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = useMemo(() => {
    const raw = existingWidget?.config || {};
    // Compatibilidad: si venía con nombres viejos del script, los mapeamos
    return {
      ...DEFAULT_CONFIG,
      ...raw,
      textoCuotas: raw.textoCuotas || raw.tituloCuotas || DEFAULT_CONFIG.textoCuotas,
      subtextoCuotas: raw.subtextoCuotas || raw.subtituloCuotas || DEFAULT_CONFIG.subtextoCuotas,
      textoTransferencia:
        raw.textoTransferencia || raw.tituloTransferencia || DEFAULT_CONFIG.textoTransferencia,
      subtextoTransferencia:
        raw.subtextoTransferencia ||
        raw.subtituloTransferencia ||
        DEFAULT_CONFIG.subtextoTransferencia,
      textoEnvio: raw.textoEnvio || raw.tituloEnvio || DEFAULT_CONFIG.textoEnvio,
      subtextoEnvio: raw.subtextoEnvio || raw.subtituloEnvio || DEFAULT_CONFIG.subtextoEnvio,
      badgeEnvio: raw.badgeEnvio || '',
      colorSubtexto: raw.colorSubtexto || DEFAULT_CONFIG.colorSubtexto,
      colorBadgeTransferencia: raw.colorBadgeTransferencia || DEFAULT_CONFIG.colorBadgeTransferencia,
    } as InfoCompraConfig;
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
      // Guardamos con los nombres que el script de la tienda va a leer
      const configToSave = {
        ...config,
        // aliases para el script (por si acaso)
        tituloCuotas: config.textoCuotas,
        subtituloCuotas: config.subtextoCuotas,
        tituloTransferencia: config.textoTransferencia,
        subtituloTransferencia: config.subtextoTransferencia,
        tituloEnvio: config.textoEnvio,
        subtituloEnvio: config.subtextoEnvio,
        colorBadgeCuotas: config.colorBadgeFondo,
        padding: config.paddingInterno,
        bordeRedondeado: config.bordesRedondeados,
      };

      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: 'info-compra',
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config: configToSave,
          is_active: isActive,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Error al guardar el widget');
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
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
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#000000', marginBottom: 16 }}>
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name}
        </h1>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 10,
            }}
          >
            Vista previa en vivo
          </div>
          <InfoCompraPreview config={config} />
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20 }}>
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

          {tab === 'secciones' && (
            <div>
              <SectionCard
                title="1. Cuotas y Financiación 💳"
                description="Escribí libremente el mensaje que quieras mostrar (3, 6, 12 cuotas, lo que sea)."
              >
                <ToggleField
                  label="Mostrar sección de Cuotas"
                  checked={config.mostrarCuotas}
                  onChange={(v) => updateCfg('mostrarCuotas', v)}
                />
                {config.mostrarCuotas && (
                  <>
                    <div>
                      <FieldLabel>Texto principal</FieldLabel>
                      <TextInput
                        value={config.textoCuotas}
                        onChange={(v) => updateCfg('textoCuotas', v)}
                        placeholder="Ej: Hasta 3 cuotas sin interés"
                      />
                      <HelpText>Libertad total: poné 3, 6, 12, 18 cuotas o el texto que quieras.</HelpText>
                    </div>
                    <div>
                      <FieldLabel>Subtexto informativo</FieldLabel>
                      <TextInput
                        value={config.subtextoCuotas}
                        onChange={(v) => updateCfg('subtextoCuotas', v)}
                        placeholder="Ej: Con todas las tarjetas bancarias"
                      />
                    </div>
                    <div>
                      <FieldLabel>Etiqueta / Badge (opcional)</FieldLabel>
                      <TextInput
                        value={config.badgeCuotas}
                        onChange={(v) => updateCfg('badgeCuotas', v)}
                        placeholder="Ej: PROMO"
                      />
                      <HelpText>Dejalo vacío si no querés badge.</HelpText>
                    </div>
                  </>
                )}
              </SectionCard>

              <SectionCard
                title="2. Descuento por Transferencia 💵"
                description="Poné 10%, 15%, 20%, 25% o el mensaje que quieras."
              >
                <ToggleField
                  label="Mostrar sección de Transferencia"
                  checked={config.mostrarTransferencia}
                  onChange={(v) => updateCfg('mostrarTransferencia', v)}
                />
                {config.mostrarTransferencia && (
                  <>
                    <div>
                      <FieldLabel>Texto principal</FieldLabel>
                      <TextInput
                        value={config.textoTransferencia}
                        onChange={(v) => updateCfg('textoTransferencia', v)}
                        placeholder="Ej: 15% OFF pagando con Transferencia"
                      />
                      <HelpText>Libertad total de porcentaje y texto.</HelpText>
                    </div>
                    <div>
                      <FieldLabel>Subtexto informativo</FieldLabel>
                      <TextInput
                        value={config.subtextoTransferencia}
                        onChange={(v) => updateCfg('subtextoTransferencia', v)}
                        placeholder="Ej: Aplica automáticamente en el checkout"
                      />
                    </div>
                    <div>
                      <FieldLabel>Etiqueta / Badge (opcional)</FieldLabel>
                      <TextInput
                        value={config.badgeTransferencia}
                        onChange={(v) => updateCfg('badgeTransferencia', v)}
                        placeholder="Ej: 15% OFF"
                      />
                    </div>
                  </>
                )}
              </SectionCard>

              <SectionCard
                title="3. Información de Envíos 🚚"
                description="Escribí libremente: Envío GRATIS, a todo el país, CABA, etc."
              >
                <ToggleField
                  label="Mostrar sección de Envíos"
                  checked={config.mostrarEnvio}
                  onChange={(v) => updateCfg('mostrarEnvio', v)}
                />
                {config.mostrarEnvio && (
                  <>
                    <div>
                      <FieldLabel>Texto principal</FieldLabel>
                      <TextInput
                        value={config.textoEnvio}
                        onChange={(v) => updateCfg('textoEnvio', v)}
                        placeholder="Ej: Envío GRATIS a todo el país"
                      />
                      <HelpText>Antes estaba fijo. Ahora es 100% editable.</HelpText>
                    </div>
                    <div>
                      <FieldLabel>Subtexto informativo</FieldLabel>
                      <TextInput
                        value={config.subtextoEnvio}
                        onChange={(v) => updateCfg('subtextoEnvio', v)}
                        placeholder="Ej: Despachamos en 24hs hábiles"
                      />
                    </div>
                    <div>
                      <FieldLabel>Etiqueta / Badge (opcional)</FieldLabel>
                      <TextInput
                        value={config.badgeEnvio}
                        onChange={(v) => updateCfg('badgeEnvio', v)}
                        placeholder="Ej: GRATIS"
                      />
                    </div>
                  </>
                )}
              </SectionCard>
            </div>
          )}

          {tab === 'estilos' && (
            <div>
              <SectionCard title="Colores generales" description="Personalizá la paleta del bloque unificado.">
                <div>
                  <FieldLabel>Color de fondo</FieldLabel>
                  <ColorPickerField value={config.colorFondo} onChange={(v) => updateCfg('colorFondo', v)} />
                </div>
                <div>
                  <FieldLabel>Color del texto principal</FieldLabel>
                  <ColorPickerField value={config.colorTexto} onChange={(v) => updateCfg('colorTexto', v)} />
                </div>
                <div>
                  <FieldLabel>Color del subtexto</FieldLabel>
                  <ColorPickerField
                    value={config.colorSubtexto}
                    onChange={(v) => updateCfg('colorSubtexto', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color badge Cuotas (PROMO)</FieldLabel>
                  <ColorPickerField
                    value={config.colorBadgeFondo}
                    onChange={(v) => updateCfg('colorBadgeFondo', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color badge Transferencia</FieldLabel>
                  <ColorPickerField
                    value={config.colorBadgeTransferencia}
                    onChange={(v) => updateCfg('colorBadgeTransferencia', v)}
                  />
                </div>
                <div>
                  <FieldLabel>Color del borde</FieldLabel>
                  <ColorPickerField value={config.colorBorde} onChange={(v) => updateCfg('colorBorde', v)} />
                </div>
                <ToggleField
                  label="Mostrar borde"
                  checked={config.activarBorde}
                  onChange={(v) => updateCfg('activarBorde', v)}
                />
              </SectionCard>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid #e5e7eb',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
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
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 8,
                fontSize: 13,
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
