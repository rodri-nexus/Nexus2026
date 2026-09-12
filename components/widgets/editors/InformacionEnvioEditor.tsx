// components/widgets/editors/InformacionEnvioEditor.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   CONSTANTES Y TIPOS (Regla #9: Al inicio)
═══════════════════════════════════════════ */
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

const DEFAULT_CONFIG = {
  mostrarEnvio: true,
  tituloEnvio: 'Envío GRATIS',
  subtituloEnvio: 'En compras superiores a $50.000',
  mostrarCuotas: true,
  tituloCuotas: 'Hasta 12 cuotas fijas',
  subtituloCuotas: '3 cuotas sin interés con todas las tarjetas bancarias',
  mostrarTransferencia: true,
  tituloTransferencia: '10% OFF abonando con Transferencia',
  subtituloTransferencia: 'Descuento automático aplicado en el checkout',
  colorFondo: '#ffffff',
  colorBorde: '#e5e7eb',
  colorTexto: '#111827',
  colorSubtexto: '#6b7280',
  colorIcono: '#10B981',
  colorDestacado: '#059669',
  bordeRedondeado: 12,
  padding: 12,
  campaignTheme: 'none',
};

const THEMES: Record<string, { themeColor: string; accentColor: string; textColor: string; subtextColor: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', textColor: '#ffffff', subtextColor: '#9ca3af' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', textColor: '#ffffff', subtextColor: '#9ca3af' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', textColor: '#ffffff', subtextColor: '#9ca3af' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', textColor: '#ffffff', subtextColor: '#a7f3d0' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', textColor: '#ffffff', subtextColor: '#fbcfe8' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', textColor: '#ffffff', subtextColor: '#c7d2fe' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', textColor: '#ffffff', subtextColor: '#fca5a5' },
};

/* ================= HELPERS UI ================= */

function IconStore({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M4 9v11a1 1 0 001 1h14a1 1 0 001-1V9" />
      <path d="M9 21V13h6v8" />
    </svg>
  );
}

function IconInfo({ size = 14, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 6 }}>
      {children}
    </div>
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
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
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
  label?: string;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 999,
          background: checked ? '#10B981' : '#e5e7eb',
          position: 'relative',
          transition: 'background 0.15s',
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
            left: checked ? 21 : 3,
            transition: 'left 0.15s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: 14, color: '#000000', fontWeight: 700 }}>{label}</span>}
    </label>
  );
}

function ColorPickerField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 48,
          height: 38,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          background: value || '#FFFFFF',
          flexShrink: 0,
        }}
      >
        <input
          type="color"
          value={value || '#FFFFFF'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            padding: 0,
            background: 'transparent',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: '10px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          fontSize: 14,
          color: '#000000',
          background: '#FFFFFF',
          outline: 'none',
          fontFamily: 'monospace',
        }}
      />
    </div>
  );
}

function RangeSlider({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: '#10B981', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 13, fontWeight: 700, color: '#000000', minWidth: 36, textAlign: 'right' }}>
        {value}px
      </span>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
        <div style={{ flexShrink: 0 }}>{icon}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#000000' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

/* ================= EDITOR COMPONENT ================= */

export default function InfoCompraEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const initialConfig = React.useMemo(() => {
    return { ...DEFAULT_CONFIG, ...(existingWidget?.config || {}) };
  }, [existingWidget]);

  const [config, setConfig] = React.useState<any>(initialConfig);
  const [isActive, setIsActive] = React.useState(existingWidget?.is_active ?? true);
  const [tab, setTab] = React.useState<'general' | 'estilos' | 'fechas'>('general');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateConfig = (k: string, v: any) => setConfig((c: any) => ({ ...c, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: 'info-compra',
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el widget');
      }

      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
      setSaving(false);
    }
  };

  const hasAnyRow = config.mostrarEnvio || config.mostrarCuotas || config.mostrarTransferencia;

  // Adaptación de estilos según si hay Campaña Activa
  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const previewFondo = activeTheme ? activeTheme.themeColor : config.colorFondo;
  const previewBorde = activeTheme ? `1.5px solid ${activeTheme.textColor}22` : `1.5px solid ${config.colorBorde}`;
  const previewTexto = activeTheme ? activeTheme.textColor : config.colorTexto;
  const previewSubtexto = activeTheme ? activeTheme.subtextColor : config.colorSubtexto;
  const previewIcono = activeTheme ? activeTheme.accentColor : config.colorIcono;
  const previewDestacado = activeTheme ? activeTheme.accentColor : config.colorDestacado;

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Colores y Diseño.' },
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
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
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
              onClick={() => updateConfig('campaignTheme', preset.id)}
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
    <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo size="medium" />
        <div style={{ fontSize: 13, fontWeight: 700, background: '#ecfdf5', color: '#10B981', padding: '4px 10px', borderRadius: 999 }}>
          Panel de Control
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 12px 60px' }}>
        {/* LIVE PREVIEW INTEGRADA EN TIEMPO REAL */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#6b7280', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Vista Previa en Tiempo Real
          </div>

          {hasAnyRow ? (
            <div
              style={{
                background: previewFondo,
                border: previewBorde,
                borderRadius: config.bordeRedondeado,
                padding: config.padding,
                display: 'flex',
                flexDirection: 'column',
                gap: config.padding,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s',
              }}
            >
              {config.mostrarEnvio && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: previewIcono, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: previewTexto }}>{config.tituloEnvio}</div>
                    <div style={{ fontSize: 11.5, color: previewSubtexto, marginTop: 1 }}>{config.subtituloEnvio}</div>
                  </div>
                </div>
              )}

              {config.mostrarEnvio && config.mostrarCuotas && (
                <div style={{ height: '1px', background: activeTheme ? `${activeTheme.textColor}22` : config.colorBorde }} />
              )}

              {config.mostrarCuotas && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: previewIcono, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: previewTexto }}>{config.tituloCuotas}</div>
                    <div style={{ fontSize: 11.5, color: previewSubtexto, marginTop: 1 }}>{config.subtituloCuotas}</div>
                  </div>
                </div>
              )}

              {((config.mostrarEnvio || config.mostrarCuotas) && config.mostrarTransferencia) && (
                <div style={{ height: '1px', background: activeTheme ? `${activeTheme.textColor}22` : config.colorBorde }} />
              )}

              {config.mostrarTransferencia && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: previewDestacado, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: previewDestacado }}>{config.tituloTransferencia}</div>
                    <div style={{ fontSize: 11.5, color: previewSubtexto, marginTop: 1 }}>{config.subtituloTransferencia}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: 20, background: '#f3f4f6', borderRadius: 12, textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
              ⚠️ Activá al menos una sección de información de compra abajo.
            </div>
          )}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', background: '#e5e7eb', padding: 3, borderRadius: 10, marginBottom: 16 }}>
          {([
            { id: 'general', label: 'Secciones' },
            { id: 'estilos', label: 'Diseño' },
            { id: 'fechas', label: '🔥 Fechas Especiales' }
          ] as const).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  background: active ? '#ffffff' : 'transparent',
                  border: 'none',
                  padding: '8px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: active ? '#10B981' : '#4b5563',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* CONTENIDO TAB GENERAL */}
        {tab === 'general' && (
          <div>
            {/* SECCIÓN ENVÍO */}
            <SectionCard
              icon={<span style={{ fontSize: 20 }}>🚚</span>}
              title="Información de Envío"
            >
              <ToggleField
                checked={config.mostrarEnvio}
                onChange={(v) => updateConfig('mostrarEnvio', v)}
                label="Mostrar sección de envío"
              />
              {config.mostrarEnvio && (
                <>
                  <div>
                    <FieldLabel>Título de Envío</FieldLabel>
                    <TextInput
                      value={config.tituloEnvio}
                      onChange={(v) => updateConfig('tituloEnvio', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Subtítulo de Envío</FieldLabel>
                    <TextInput
                      value={config.subtituloEnvio}
                      onChange={(v) => updateConfig('subtituloEnvio', v)}
                    />
                  </div>
                </>
              )}
            </SectionCard>

            {/* SECCIÓN CUOTAS */}
            <SectionCard
              icon={<span style={{ fontSize: 20 }}>💳</span>}
              title="Información de Cuotas"
            >
              <ToggleField
                checked={config.mostrarCuotas}
                onChange={(v) => updateConfig('mostrarCuotas', v)}
                label="Mostrar sección de cuotas"
              />
              {config.mostrarCuotas && (
                <>
                  <div>
                    <FieldLabel>Título de Cuotas</FieldLabel>
                    <TextInput
                      value={config.tituloCuotas}
                      onChange={(v) => updateConfig('tituloCuotas', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Subtítulo de Cuotas</FieldLabel>
                    <TextInput
                      value={config.subtituloCuotas}
                      onChange={(v) => updateConfig('subtituloCuotas', v)}
                    />
                  </div>
                </>
              )}
            </SectionCard>

            {/* SECCIÓN TRANSFERENCIA */}
            <SectionCard
              icon={<span style={{ fontSize: 20 }}>💰</span>}
              title="Información de Transferencia"
            >
              <ToggleField
                checked={config.mostrarTransferencia}
                onChange={(v) => updateConfig('mostrarTransferencia', v)}
                label="Mostrar sección de transferencia"
              />
              {config.mostrarTransferencia && (
                <>
                  <div>
                    <FieldLabel>Título de Transferencia</FieldLabel>
                    <TextInput
                      value={config.tituloTransferencia}
                      onChange={(v) => updateConfig('tituloTransferencia', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Subtítulo de Transferencia</FieldLabel>
                    <TextInput
                      value={config.subtituloTransferencia}
                      onChange={(v) => updateConfig('subtituloTransferencia', v)}
                    />
                  </div>
                </>
              )}
            </SectionCard>
          </div>
        )}

        {/* CONTENIDO TAB ESTILOS */}
        {tab === 'estilos' && (
          <div>
            {/* SECCIÓN COLORES */}
            <SectionCard
              icon={<span style={{ fontSize: 18 }}>🎨</span>}
              title="Paleta de Colores"
            >
              <div>
                <FieldLabel>Color de Fondo del Bloque</FieldLabel>
                <ColorPickerField
                  value={config.colorFondo}
                  onChange={(v) => updateConfig('colorFondo', v)}
                />
              </div>

              <div>
                <FieldLabel>Color del Borde del Bloque</FieldLabel>
                <ColorPickerField
                  value={config.colorBorde}
                  onChange={(v) => updateConfig('colorBorde', v)}
                />
              </div>

              <div>
                <FieldLabel>Color de Texto Principal</FieldLabel>
                <ColorPickerField
                  value={config.colorTexto}
                  onChange={(v) => updateConfig('colorTexto', v)}
                />
              </div>

              <div>
                <FieldLabel>Color del Subtexto / Descripción</FieldLabel>
                <ColorPickerField
                  value={config.colorSubtexto}
                  onChange={(v) => updateConfig('colorSubtexto', v)}
                />
              </div>

              <div>
                <FieldLabel>Color de los Iconos Normales</FieldLabel>
                <ColorPickerField
                  value={config.colorIcono}
                  onChange={(v) => updateConfig('colorIcono', v)}
                />
              </div>

              <div>
                <FieldLabel>Color de los Destacados (Transferencia)</FieldLabel>
                <ColorPickerField
                  value={config.colorDestacado}
                  onChange={(v) => updateConfig('colorDestacado', v)}
                />
              </div>
            </SectionCard>

            {/* SECCIÓN DISEÑO DE CAJA */}
            <SectionCard
              icon={<span style={{ fontSize: 18 }}>📐</span>}
              title="Diseño de Caja"
            >
              <div>
                <FieldLabel>Borde Redondeado</FieldLabel>
                <RangeSlider
                  value={config.bordeRedondeado}
                  onChange={(v) => updateConfig('bordeRedondeado', v)}
                  min={0}
                  max={30}
                />
              </div>

              <div>
                <FieldLabel>Margen y Espaciado Interno</FieldLabel>
                <RangeSlider
                  value={config.padding}
                  onChange={(v) => updateConfig('padding', v)}
                  min={4}
                  max={24}
                />
              </div>
            </SectionCard>
          </div>
        )}

        {/* CONTENIDO TAB FECHAS ESPECIALES */}
        {tab === 'fechas' && tabFechasEspeciales}

        {/* BOTON GUARDAR / PIE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 16,
            padding: 16,
            marginTop: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <ToggleField checked={isActive} onChange={setIsActive} label="Widget Activo" />

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            style={{
              background: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 999,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 800,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.7 : 1,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
            }}
          >
            {saving ? 'Guardando...' : existingWidget ? 'Guardar Cambios' : 'Crear Widget'}
          </button>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 24 }}>
          <CentroAyuda />
        </div>
      </div>

      {/* ERROR TOAST */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            right: 20,
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: 12,
            borderRadius: 8,
            fontSize: 13,
            zIndex: 50,
            maxWidth: 400,
            margin: '0 auto',
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          ❌ {error}
        </div>
      )}
    </div>
  );
  }
