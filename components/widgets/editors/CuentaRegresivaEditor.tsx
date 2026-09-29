'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface CuentaRegresivaEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface CuentaRegresivaConfig {
  title: string;
  subtitle: string;
  mode: 'duration' | 'fixed';
  durationMinutes: number;
  endDate: string;
  autoRestart: boolean;
  style: 'clasico' | 'retro' | 'circulo' | 'minimalista';
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  showLabels: boolean;
  alignment: 'center' | 'left';
  bgType: 'solid' | 'gradient';
  colorWidgetBg: string;
  colorWidgetBg2: string;
  gradientDirection: string;
  colorClockBg: string;
  colorTitle: string;
  colorSubtitle: string;
  colorSubtitleBg: string;
  colorNumbers: string;
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  fontSizeClock: string;
  borderRadiusClock: number;
  borderRadiusWidget: number;
  paddingWidget: number;
  paddingClock: number;
  urgencyEnabled: boolean;
  colorClockBgMedium: string;
  colorClockBgCritical: string;
  showAsTopBar: boolean;
  showOnProduct: boolean;
  showOnCart: boolean;
  productPosition: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   DEFAULT + PRESETS
═══════════════════════════════════════════ */
const defaultConfig: CuentaRegresivaConfig = {
  title: '🔥 ¡La oferta termina pronto!',
  subtitle: '¡Últimos minutos!',
  mode: 'duration',
  durationMinutes: 15,
  endDate: '',
  autoRestart: true,
  style: 'clasico',
  showDays: false,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  showLabels: true,
  alignment: 'center',
  bgType: 'solid',
  colorWidgetBg: '#000000',
  colorWidgetBg2: '#10B981',
  gradientDirection: 'to bottom right',
  colorClockBg: '#10B981',
  colorTitle: '#ffffff',
  colorSubtitle: '#ffffff',
  colorSubtitleBg: '#10B981',
  colorNumbers: '#ffffff',
  fontSizeTitle: '16',
  fontSizeSubtitle: '11',
  fontSizeClock: '16',
  borderRadiusClock: 8,
  borderRadiusWidget: 12,
  paddingWidget: 15,
  paddingClock: 8,
  urgencyEnabled: false,
  colorClockBgMedium: '#f97316',
  colorClockBgCritical: '#dc2626',
  showAsTopBar: false,
  showOnProduct: true,
  showOnCart: false,
  productPosition: 'before-button',
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores de la pestaña Estilos.', themeColor: '#000000', accentColor: '#10B981' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Oscuro con acento dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Nocturno con azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino y rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso y rojo pasión.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-madre-padre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Índigo con verde esmeralda.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Urgencia extrema con amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const CLOCK_STYLES = [
  { id: 'clasico', label: 'Cuadrado Clásico', desc: 'El más usado y seguro' },
  { id: 'retro', label: 'Retro Flip', desc: 'Estilo tablero aeropuerto' },
  { id: 'circulo', label: 'Círculos Neón', desc: 'Moderno con resplandor' },
  { id: 'minimalista', label: 'Minimalista', desc: 'Sin fondo, elegante' },
];

/* ═══════════════════════════════════════════
   ICONOS
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <line x1="2" y1="7" x2="22" y2="7" />
    <path d="M22 7v3a2 2 0 0 1-4 0V7" />
    <path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9" />
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5" />
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

/* ═══════════════════════════════════════════
   UI REUTILIZABLE (mismo sistema que Marquee)
═══════════════════════════════════════════ */
function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '12px 14px',
        fontSize: 15,
        border: '1.5px solid #e5e7eb',
        borderRadius: 10,
        background: '#ffffff',
        color: '#000000',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function ColorPickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#000000';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div
        onClick={handleClick}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: value,
          border: '1.5px solid #e5e7eb',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v.startsWith('#') ? v : '#' + v);
        }}
        style={{
          flex: 1,
          minWidth: 0,
          padding: '10px 10px',
          fontSize: 13,
          border: '1.5px solid #e5e7eb',
          borderRadius: 8,
          background: '#ffffff',
          color: '#000000',
          outline: 'none',
          fontFamily: 'monospace',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleField({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          background: checked ? '#10B981' : '#d1d5db',
          position: 'relative',
          transition: 'background 0.25s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.25s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      <span style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>{label}</span>
    </label>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 36px 12px 14px',
          fontSize: 15,
          border: '1.5px solid #e5e7eb',
          borderRadius: 10,
          background: '#ffffff',
          color: '#000000',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function RangeSlider({
  value,
  min,
  max,
  onChange,
  ticks,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  ticks?: number[];
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
      />
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 4 }}>
          {ticks.map((t) => (
            <span key={t}>{t}px</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CuentaRegresivaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: CuentaRegresivaEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CuentaRegresivaConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
    style:
      existingWidget?.config?.style === 'retro' ||
      existingWidget?.config?.style === 'circulo' ||
      existingWidget?.config?.style === 'minimalista'
        ? existingWidget.config.style
        : existingWidget?.config?.style === 'clasico'
        ? 'clasico'
        : defaultConfig.style,
    fontSizeTitle: String(existingWidget?.config?.fontSizeTitle || defaultConfig.fontSizeTitle).replace('px', ''),
    fontSizeSubtitle: String(existingWidget?.config?.fontSizeSubtitle || defaultConfig.fontSizeSubtitle).replace('px', ''),
    fontSizeClock: String(existingWidget?.config?.fontSizeClock || defaultConfig.fontSizeClock).replace('px', ''),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'estilos' | 'fechas'>('general');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  const update = <K extends keyof CuentaRegresivaConfig>(key: K, value: CuentaRegresivaConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (slug: string) => {
    if (slug === 'none') {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: 'none',
        colorWidgetBg: defaultConfig.colorWidgetBg,
        colorClockBg: defaultConfig.colorClockBg,
        colorSubtitleBg: defaultConfig.colorSubtitleBg,
        colorTitle: defaultConfig.colorTitle,
        colorSubtitle: defaultConfig.colorSubtitle,
        colorNumbers: defaultConfig.colorNumbers,
        bgType: 'solid',
      }));
      return;
    }
    const p = CAMPAIGN_PRESETS.find((x) => x.id === slug);
    if (!p) return;
    setConfig((prev) => ({
      ...prev,
      campaignTheme: slug,
      colorWidgetBg: p.themeColor,
      colorClockBg: p.accentColor,
      colorSubtitleBg: p.accentColor,
      colorTitle: '#ffffff',
      colorSubtitle: p.accentColor,
      colorNumbers: slug === 'black-friday' || slug === 'liquidacion' ? '#111827' : '#ffffff',
      bgType: 'solid',
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSavedOK(false);
    try {
      const payloadConfig = {
        ...config,
        fontSizeTitle: `${config.fontSizeTitle}px`,
        fontSizeSubtitle: `${config.fontSizeSubtitle}px`,
        fontSizeClock: `${config.fontSizeClock}px`,
      };

      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: widgetDefinition.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config: payloadConfig,
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) params.set('product', String(productId));
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  const selectedCampaign = CAMPAIGN_PRESETS.find((p) => p.id === (config.campaignTheme || 'none'));
  const previewBg =
    config.bgType === 'gradient'
      ? `linear-gradient(${config.gradientDirection}, ${config.colorWidgetBg} 0%, ${config.colorWidgetBg2} 100%)`
      : config.colorWidgetBg;

  /* ═══ PREVIEW EN VIVO ═══ */
  const livePreview = (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          background: previewBg,
          borderRadius: config.borderRadiusWidget,
          padding: config.paddingWidget,
          textAlign: config.alignment,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}
      >
        {selectedCampaign && selectedCampaign.id !== 'none' && (
          <div style={{ marginBottom: 8, textAlign: config.alignment }}>
            <span
              style={{
                display: 'inline-flex',
                background: config.colorClockBg,
                color: config.colorNumbers,
                fontSize: 11,
                fontWeight: 900,
                padding: '3px 10px',
                borderRadius: 999,
              }}
            >
              {selectedCampaign.emoji} {selectedCampaign.label.toUpperCase()}
            </span>
          </div>
        )}

        <div
          style={{
            fontSize: `${config.fontSizeTitle}px`,
            fontWeight: 800,
            color: config.colorTitle,
            marginBottom: 8,
            lineHeight: 1.25,
          }}
        >
          {config.title || '🔥 ¡La oferta termina pronto!'}
        </div>

        {!!config.subtitle && (
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                display: 'inline-block',
                background: config.colorSubtitleBg,
                color: config.colorSubtitle,
                fontSize: `${config.fontSizeSubtitle}px`,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 6,
              }}
            >
              {config.subtitle}
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: config.alignment === 'center' ? 'center' : 'flex-start',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {['00', '14', '59'].map((digit, idx) => (
            <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {config.style === 'circulo' && (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: config.colorClockBg,
                      color: config.colorNumbers,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: `${config.fontSizeClock}px`,
                      fontWeight: 900,
                      boxShadow: `0 0 12px ${config.colorClockBg}66`,
                    }}
                  >
                    {digit}
                  </div>
                  {config.showLabels && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: config.colorTitle, opacity: 0.85 }}>
                      {idx === 0 ? 'HRS' : idx === 1 ? 'MIN' : 'SEG'}
                    </span>
                  )}
                </div>
              )}

              {config.style === 'minimalista' && (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ color: config.colorClockBg, fontSize: `${Number(config.fontSizeClock) + 6}px`, fontWeight: 900, lineHeight: 1 }}>
                    {digit}
                  </div>
                  {config.showLabels && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: config.colorTitle, opacity: 0.85 }}>
                      {idx === 0 ? 'HRS' : idx === 1 ? 'MIN' : 'SEG'}
                    </span>
                  )}
                </div>
              )}

              {config.style === 'retro' && (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {digit.split('').map((d, dIdx) => (
                      <span
                        key={dIdx}
                        style={{
                          background: config.colorClockBg,
                          color: config.colorNumbers,
                          padding: `${config.paddingClock}px ${config.paddingClock + 2}px`,
                          borderRadius: config.borderRadiusClock,
                          fontSize: `${config.fontSizeClock}px`,
                          fontWeight: 900,
                          boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.28)',
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  {config.showLabels && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: config.colorTitle, opacity: 0.85 }}>
                      {idx === 0 ? 'HRS' : idx === 1 ? 'MIN' : 'SEG'}
                    </span>
                  )}
                </div>
              )}

              {config.style === 'clasico' && (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    style={{
                      minWidth: 42,
                      minHeight: 42,
                      borderRadius: config.borderRadiusClock,
                      background: config.colorClockBg,
                      color: config.colorNumbers,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: `${config.paddingClock}px ${config.paddingClock + 2}px`,
                      fontSize: `${config.fontSizeClock}px`,
                      fontWeight: 800,
                    }}
                  >
                    {digit}
                  </div>
                  {config.showLabels && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: config.colorTitle, opacity: 0.85 }}>
                      {idx === 0 ? 'HRS' : idx === 1 ? 'MIN' : 'SEG'}
                    </span>
                  )}
                </div>
              )}

              {idx < 2 && (
                <span
                  style={{
                    fontSize: config.style === 'minimalista' ? 18 : 16,
                    fontWeight: 900,
                    color: config.style === 'minimalista' ? config.colorClockBg : config.colorTitle,
                    paddingBottom: config.showLabels ? 12 : 0,
                  }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel required>Título principal</FieldLabel>
        <TextInput value={config.title} onChange={(v) => update('title', v)} placeholder="🔥 ¡La oferta termina pronto!" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Subtítulo</FieldLabel>
        <TextInput value={config.subtitle} onChange={(v) => update('subtitle', v)} placeholder="¡Últimos minutos!" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Diseño del reloj</FieldLabel>
        <FieldHelper>Elegí la firma visual del contador. Se refleja al instante en la vista previa.</FieldHelper>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {CLOCK_STYLES.map((s) => {
            const active = config.style === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => update('style', s.id as CuentaRegresivaConfig['style'])}
                style={{
                  textAlign: 'left',
                  border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                  background: active ? '#ecfdf5' : '#ffffff',
                  borderRadius: 12,
                  padding: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: active ? '#065f46' : '#000000' }}>{s.label}</div>
                <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 4 }}>{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Modo de tiempo</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => update('mode', 'duration')}
            style={{
              padding: 12,
              borderRadius: 10,
              border: config.mode === 'duration' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: config.mode === 'duration' ? '#ecfdf5' : '#ffffff',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ⏱️ Por minutos
          </button>
          <button
            type="button"
            onClick={() => update('mode', 'fixed')}
            style={{
              padding: 12,
              borderRadius: 10,
              border: config.mode === 'fixed' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: config.mode === 'fixed' ? '#ecfdf5' : '#ffffff',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            📅 Fecha fija
          </button>
        </div>

        {config.mode === 'duration' ? (
          <div>
            <FieldLabel>Minutos por visitante</FieldLabel>
            <TextInput
              type="number"
              value={String(config.durationMinutes)}
              onChange={(v) => update('durationMinutes', parseInt(v, 10) || 15)}
            />
          </div>
        ) : (
          <div>
            <FieldLabel>Fecha y hora de cierre</FieldLabel>
            <TextInput type="datetime-local" value={config.endDate} onChange={(v) => update('endDate', v)} />
          </div>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Unidades visibles</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <ToggleField checked={config.showDays} onChange={(v) => update('showDays', v)} label="Días" />
          <ToggleField checked={config.showHours} onChange={(v) => update('showHours', v)} label="Horas" />
          <ToggleField checked={config.showMinutes} onChange={(v) => update('showMinutes', v)} label="Minutos" />
          <ToggleField checked={config.showSeconds} onChange={(v) => update('showSeconds', v)} label="Segundos" />
          <ToggleField checked={config.showLabels} onChange={(v) => update('showLabels', v)} label="Etiquetas HRS/MIN/SEG" />
          <ToggleField checked={config.autoRestart} onChange={(v) => update('autoRestart', v)} label="Reinicio automático" />
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <FieldLabel>Ubicación en la tienda</FieldLabel>
        <FieldHelper>
          Home: arriba del banner principal. Producto: arriba del botón de compra (o del título si no hay botón).
        </FieldHelper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <ToggleField checked={config.showAsTopBar} onChange={(v) => update('showAsTopBar', v)} label="Barra superior fija (TopBar)" />
          <ToggleField checked={config.showOnProduct} onChange={(v) => update('showOnProduct', v)} label="Mostrar en ficha de producto" />
          <ToggleField checked={config.showOnCart} onChange={(v) => update('showOnCart', v)} label="Mostrar en carrito" />
        </div>
      </div>

      {config.showOnProduct && (
        <div style={{ marginTop: 16 }}>
          <FieldLabel>Posición en producto</FieldLabel>
          <SelectField
            value={config.productPosition}
            onChange={(v) => update('productPosition', v)}
            options={[
              { value: 'before-button', label: '🛒 Arriba del botón Agregar al carrito' },
              { value: 'before-title', label: '📝 Arriba del título del producto' },
            ]}
          />
        </div>
      )}
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Alineación</FieldLabel>
        <SelectField
          value={config.alignment}
          onChange={(v) => update('alignment', v as 'center' | 'left')}
          options={[
            { value: 'center', label: 'Centro (recomendado)' },
            { value: 'left', label: 'Izquierda' },
          ]}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Tipo de fondo</FieldLabel>
        <SelectField
          value={config.bgType}
          onChange={(v) => update('bgType', v as 'solid' | 'gradient')}
          options={[
            { value: 'solid', label: 'Sólido' },
            { value: 'gradient', label: 'Degradé' },
          ]}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.colorWidgetBg} onChange={(v) => update('colorWidgetBg', v)} />
        </div>
        {config.bgType === 'gradient' && (
          <div>
            <FieldLabel>Color fondo 2</FieldLabel>
            <ColorPickerField value={config.colorWidgetBg2} onChange={(v) => update('colorWidgetBg2', v)} />
          </div>
        )}
        <div>
          <FieldLabel>Color del reloj</FieldLabel>
          <ColorPickerField value={config.colorClockBg} onChange={(v) => update('colorClockBg', v)} />
        </div>
        <div>
          <FieldLabel>Color de números</FieldLabel>
          <ColorPickerField value={config.colorNumbers} onChange={(v) => update('colorNumbers', v)} />
        </div>
        <div>
          <FieldLabel>Color del título</FieldLabel>
          <ColorPickerField value={config.colorTitle} onChange={(v) => update('colorTitle', v)} />
        </div>
        <div>
          <FieldLabel>Color del subtítulo</FieldLabel>
          <ColorPickerField value={config.colorSubtitle} onChange={(v) => update('colorSubtitle', v)} />
        </div>
        <div>
          <FieldLabel>Fondo del subtítulo</FieldLabel>
          <ColorPickerField value={config.colorSubtitleBg} onChange={(v) => update('colorSubtitleBg', v)} />
        </div>
      </div>

      {config.bgType === 'gradient' && (
        <div style={{ marginBottom: 24 }}>
          <FieldLabel>Dirección del degradé</FieldLabel>
          <SelectField
            value={config.gradientDirection}
            onChange={(v) => update('gradientDirection', v)}
            options={[
              { value: 'to bottom right', label: 'Diagonal ↘' },
              { value: 'to right', label: 'Horizontal →' },
              { value: 'to bottom', label: 'Vertical ↓' },
              { value: 'to top right', label: 'Diagonal ↗' },
            ]}
          />
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Tamaño título: {config.fontSizeTitle}px</FieldLabel>
        <RangeSlider value={Number(config.fontSizeTitle)} min={12} max={28} onChange={(v) => update('fontSizeTitle', String(v))} ticks={[12, 16, 28]} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Tamaño subtítulo: {config.fontSizeSubtitle}px</FieldLabel>
        <RangeSlider value={Number(config.fontSizeSubtitle)} min={9} max={18} onChange={(v) => update('fontSizeSubtitle', String(v))} ticks={[9, 11, 18]} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Tamaño reloj: {config.fontSizeClock}px</FieldLabel>
        <RangeSlider value={Number(config.fontSizeClock)} min={12} max={28} onChange={(v) => update('fontSizeClock', String(v))} ticks={[12, 16, 28]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <FieldLabel>Radio widget: {config.borderRadiusWidget}px</FieldLabel>
          <RangeSlider value={config.borderRadiusWidget} min={0} max={24} onChange={(v) => update('borderRadiusWidget', v)} ticks={[0, 12, 24]} />
        </div>
        <div>
          <FieldLabel>Radio reloj: {config.borderRadiusClock}px</FieldLabel>
          <RangeSlider value={config.borderRadiusClock} min={0} max={24} onChange={(v) => update('borderRadiusClock', v)} ticks={[0, 8, 24]} />
        </div>
        <div>
          <FieldLabel>Padding widget: {config.paddingWidget}px</FieldLabel>
          <RangeSlider value={config.paddingWidget} min={6} max={28} onChange={(v) => update('paddingWidget', v)} ticks={[6, 15, 28]} />
        </div>
        <div>
          <FieldLabel>Padding reloj: {config.paddingClock}px</FieldLabel>
          <RangeSlider value={config.paddingClock} min={2} max={16} onChange={(v) => update('paddingClock', v)} ticks={[2, 8, 16]} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <ToggleField checked={config.urgencyEnabled} onChange={(v) => update('urgencyEnabled', v)} label="Colores de urgencia (medio / crítico)" />
      </div>
      {config.urgencyEnabled && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <FieldLabel>Color medio</FieldLabel>
            <ColorPickerField value={config.colorClockBgMedium} onChange={(v) => update('colorClockBgMedium', v)} />
          </div>
          <div>
            <FieldLabel>Color crítico</FieldLabel>
            <ColorPickerField value={config.colorClockBgCritical} onChange={(v) => update('colorClockBgCritical', v)} />
          </div>
        </div>
      )}
    </div>
  );

  /* ═══ TAB FECHAS ═══ */
  const tabFechas = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>
          Elegí una campaña. Se aplican colores temáticos de alto impacto y se ven al instante en la vista previa.
        </FieldHelper>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CAMPAIGN_PRESETS.map((preset) => {
          const isSelected = (config.campaignTheme || 'none') === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ fontSize: 24, flexShrink: 0 }}>{preset.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {preset.label}
                  {isSelected && (
                    <span
                      style={{
                        background: '#ecfdf5',
                        color: '#10B981',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 999,
                        border: '1px solid #10B981',
                      }}
                    >
                      ACTIVO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 4, lineHeight: 1.4 }}>{preset.desc}</div>
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

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas Especiales' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>
      {/* HEADER CON LOGO OFICIAL */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            N
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>
        {isForAll ? (
          <div
            style={{
              background: '#10B981',
              color: '#ffffff',
              borderRadius: 999,
              padding: '8px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <IconStore />
            <span>Todos los productos</span>
          </div>
        ) : (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: '8px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span>
            <span>Producto específico</span>
          </div>
        )}

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#000000', margin: '0 0 20px', lineHeight: 1.2 }}>
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {livePreview}

          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 1 }}>
              <IconInfo />
            </div>
            <span style={{ fontSize: 14, color: '#000000', lineHeight: 1.5 }}>
              Editá textos, diseño del reloj, colores y fechas especiales. La vista previa de arriba se actualiza al instante.
            </span>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: '14px 12px',
                    background: 'none',
                    border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000000',
                    opacity: act ? 1 : 0.6,
                    fontSize: 15,
                    fontWeight: act ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'estilos' && tabEstilos}
            {activeTab === 'fechas' && tabFechas}
          </div>

          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <ToggleField checked={isActive} onChange={setIsActive} label="Widget activo" />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                borderRadius: 999,
                border: 'none',
                background: '#10B981',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>

        {error && (
          <div
            style={{
              position: 'fixed',
              bottom: 20,
              left: 16,
              right: 16,
              maxWidth: 600,
              margin: '0 auto',
              background: '#fee2e2',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: 14,
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
    </div>
  );
   }
