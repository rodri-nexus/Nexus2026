'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface BadgeCuotasConfig {
  cuotasSeleccionadas: number[];
  mensaje: string;
  mostrarIconoTarjeta: boolean;
  textoBadge: string;
  efectoRebote: boolean;
  posicionBadge: 'esquina-superior-derecha' | 'final-texto';
  mostrarEnProducto: boolean;
  mostrarEnGrilla: boolean;
  colorFondo: string;
  colorTexto: string;
  fondoDegradado: boolean;
  fontSize: string;
  mostrarBorde: boolean;
  paddingInterno: number;
  bordesRedondeados: number;
  efecto: 'aureola' | 'zoom' | 'sin-efecto';
  colorFondoBadge: string;
  colorTextoBadge: string;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════ */
const defaultConfig: BadgeCuotasConfig = {
  cuotasSeleccionadas: [3, 6, 12],
  mensaje: '{cuotas} cuotas sin interés de {monto}',
  mostrarIconoTarjeta: false,
  textoBadge: '',
  efectoRebote: false,
  posicionBadge: 'esquina-superior-derecha',
  mostrarEnProducto: true,
  mostrarEnGrilla: false,
  colorFondo: '#ededed',
  colorTexto: '#000000',
  fondoDegradado: false,
  fontSize: '13px',
  mostrarBorde: false,
  paddingInterno: 10,
  bordesRedondeados: 25,
  efecto: 'sin-efecto',
  colorFondoBadge: '#10B981',
  colorTextoBadge: '#ffffff',
  campaignTheme: 'none',
};

const CUOTAS_OPCIONES = [2, 3, 4, 6, 9, 12, 18];

const THEMES: Record<string, { themeColor: string; accentColor: string; badgeText: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', badgeText: 'BLACK FRIDAY' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', badgeText: 'HOT SALE' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', badgeText: 'CYBER MONDAY' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', badgeText: 'NAVIDAD' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', badgeText: 'LOVE SALE' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', badgeText: 'ESPECIAL' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', badgeText: 'LIQUIDACIÓN' },
};

/* ═══════════════════════════════════════════
   ICONOS AUXILIARES
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconExternal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const IconTarjeta = ({ color = 'currentColor', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="3" ry="3"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

/* ═══════════════════════════════════════════
   COMPONENTES DE FORMULARIO REUTILIZABLES
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
  value, onChange, placeholder, maxLength,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function CheckboxCard({
  checked, onChange, label, helper, children,
}: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; helper?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#ffffff', border: checked ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12, transition: 'border-color 0.2s',
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 22, height: 22, borderRadius: 5,
            background: checked ? '#10B981' : '#ffffff',
            border: checked ? '2px solid #10B981' : '2px solid #d1d5db',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
            marginTop: 1,
          }}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
      {children && <div style={{ marginTop: children ? 16 : 0 }}>{children}</div>}
    </div>
  );
}

function CuotaCheckbox({
  cuota, checked, onChange,
}: {
  cuota: number; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      background: '#ffffff', border: checked ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
      borderRadius: 12, padding: '14px 16px', marginBottom: 10, transition: 'border-color 0.2s',
    }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 22, height: 22, borderRadius: 5,
            background: checked ? '#10B981' : '#ffffff',
            border: checked ? '2px solid #10B981' : '2px solid #d1d5db',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
          }}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
          {cuota} cuotas sin interés
        </span>
      </label>
    </div>
  );
}

function RadioCard({
  checked, onChange, label, helper,
}: {
  checked: boolean; onChange: () => void; label: string; helper?: string;
}) {
  return (
    <div style={{
      background: '#ffffff', border: checked ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12, transition: 'border-color 0.2s',
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={onChange}
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: checked ? '7px solid #10B981' : '2px solid #d1d5db',
            background: '#ffffff', flexShrink: 0, transition: 'all 0.2s',
            marginTop: 1,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

function ColorPickerField({
  value, onChange,
}: {
  value: string; onChange: (v: string) => void;
}) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#000000';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
    }}>
      <div
        onClick={handleClick}
        style={{
          width: 40, height: 40, borderRadius: 8,
          background: value, border: '1.5px solid #e5e7eb',
          cursor: 'pointer', flexShrink: 0,
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
          flex: 1, minWidth: 0,
          padding: '10px 10px', fontSize: 13,
          border: '1.5px solid #e5e7eb', borderRadius: 8,
          background: '#ffffff', color: '#000000', outline: 'none',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleField({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 13,
          background: checked ? '#10B981' : '#d1d5db',
          position: 'relative', transition: 'background 0.25s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: '#fff', transition: 'left 0.25s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>
        {label}
      </span>
    </label>
  );
}

function SelectField({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
          border: '1.5px solid #e5e7eb', borderRadius: 10,
          background: '#ffffff', color: '#000000', outline: 'none',
          appearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function RangeSlider({
  value, min, max, onChange, ticks,
}: {
  value: number; min: number; max: number;
  onChange: (v: number) => void;
  ticks?: number[];
}) {
  return (
    <div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%', accentColor: '#10B981', cursor: 'pointer',
        }}
      />
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 4 }}>
          {ticks.map((t) => <span key={t}>{t}px</span>)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PREVIEW LIVE INTERACTIVO (Regla #16)
═══════════════════════════════════════════ */
function BadgeCuotasPreview({ config }: { config: BadgeCuotasConfig }) {
  const cuotasOrdenadas = [...(config.cuotasSeleccionadas || [])].sort((a, b) => b - a);
  const cuotaShow = cuotasOrdenadas.length > 0 ? String(cuotasOrdenadas[0]) : 'N';

  const mensaje = (config.mensaje || '{cuotas} cuotas sin interés de {monto}')
    .replace('{cuotas}', cuotaShow)
    .replace('{monto}', '$****');

  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const fondo = activeTheme
    ? `linear-gradient(135deg, ${activeTheme.themeColor} 0%, ${activeTheme.themeColor}dd 100%)`
    : config.fondoDegradado
      ? `linear-gradient(135deg, ${config.colorFondo} 0%, ${config.colorFondo}dd 100%)`
      : config.colorFondo;

  const colorTexto = activeTheme ? '#ffffff' : config.colorTexto;
  const colorFondoBadge = activeTheme ? activeTheme.accentColor : config.colorFondoBadge;
  
  const colorTextoBadge = activeTheme
    ? (currentCampaign === 'black-friday' || currentCampaign === 'liquidacion' ? '#000000' : '#ffffff')
    : config.colorTextoBadge;

  const textoBadgeToShow = config.textoBadge && config.textoBadge.trim().length > 0
    ? config.textoBadge
    : (activeTheme ? activeTheme.badgeText : '');

  const showBadge = textoBadgeToShow && textoBadgeToShow.trim().length > 0;
  const borde = config.mostrarBorde ? `1px solid ${colorTexto}22` : '1px solid rgba(255, 255, 255, 0.12)';

  const animation =
    config.efecto === 'aureola' ? 'nvxAureolaPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' :
    config.efecto === 'zoom' ? 'nvxZoom 2.5s ease-in-out infinite' :
    'none';

  const badgeAnimation = config.efectoRebote ? 'nvxBounceBadge 1.4s ease-in-out infinite' : 'none';

  return (
    <>
      <style>{`
        @keyframes nvxAureolaPulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04); 
          }
          50% { 
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0), 0 6px 20px rgba(16, 185, 129, 0.18); 
          }
        }
        @keyframes nvxZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes nvxBounceBadge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes nvxLightSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          25%, 100% { transform: translateX(250%) skewX(-20deg); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 0',
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: fondo,
            color: colorTexto,
            fontSize: config.fontSize,
            fontWeight: 600,
            padding: `${config.paddingInterno}px ${config.paddingInterno + 10}px`,
            borderRadius: config.bordesRedondeados,
            border: borde,
            animation: animation,
            position: 'relative',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '45%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%)',
              animation: 'nvxLightSweep 4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {config.mostrarIconoTarjeta && (
              <span style={{ display: 'inline-flex', alignItems: 'center', zIndex: 2 }}>
                <IconTarjeta color={colorTexto} size={15} />
              </span>
            )}

            <span style={{ zIndex: 2, letterSpacing: '-0.01em' }}>{mensaje}</span>

            {showBadge && config.posicionBadge === 'final-texto' && (
              <span style={{
                display: 'inline-block',
                background: colorFondoBadge,
                color: colorTextoBadge,
                fontSize: Math.max(9, parseInt(config.fontSize, 10) - 3),
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: 6,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginLeft: 4,
                animation: badgeAnimation,
                zIndex: 2,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              }}>
                {textoBadgeToShow}
              </span>
            )}
          </div>

          {showBadge && config.posicionBadge === 'esquina-superior-derecha' && (
            <span style={{
              position: 'absolute',
              top: -10,
              right: -8,
              background: colorFondoBadge,
              color: colorTextoBadge,
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
              animation: badgeAnimation,
              whiteSpace: 'nowrap',
              zIndex: 3,
            }}>
              {textoBadgeToShow}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL DEL EDITOR
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
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilos' | 'fechas'>('general');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  const update = <K extends keyof BadgeCuotasConfig>(key: K, value: BadgeCuotasConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCuota = (cuota: number) => {
    const actual = config.cuotasSeleccionadas || [];
    if (actual.includes(cuota)) {
      update('cuotasSeleccionadas', actual.filter((c) => c !== cuota));
    } else {
      update('cuotasSeleccionadas', [...actual, cuota].sort((a, b) => a - b));
    }
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

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) {
          params.set('product', String(productId));
        }
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div>
      {/* Configuración de cuotas */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel required>Configuración de cuotas</FieldLabel>
        <FieldHelper>
          Elegí las cuotas que ofrecés. El widget mostrará el mayor plan para el que califica el precio del producto.
        </FieldHelper>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: '10px 14px', background: '#ecfdf5',
          border: '1px solid #a7f3d0', borderRadius: 10,
          marginTop: 12, marginBottom: 16,
        }}>
          <div style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, color: '#000000', opacity: 0.8, lineHeight: 1.5 }}>
            Utilizá la misma que hayas configurado en método de pago de Tiendanube
          </span>
        </div>
        <div>
          {CUOTAS_OPCIONES.map((cuota) => (
            <CuotaCheckbox
              key={cuota}
              cuota={cuota}
              checked={config.cuotasSeleccionadas?.includes(cuota) || false}
              onChange={() => toggleCuota(cuota)}
            />
          ))}
        </div>
      </div>

      {/* Mensaje */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Mensaje</FieldLabel>
        <TextInput
          value={config.mensaje}
          onChange={(v) => update('mensaje', v)}
          placeholder="{cuotas} cuotas sin interés de {monto}"
        />
        <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          Usá <code style={{ background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{'{cuotas}'}</code> para el número de cuotas y <code style={{ background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{'{monto}'}</code> para el precio por cuota.
        </p>
      </div>

      {/* Mostrar ícono de tarjeta */}
      <CheckboxCard
        checked={config.mostrarIconoTarjeta}
        onChange={(v) => update('mostrarIconoTarjeta', v)}
        label="Mostrar ícono de tarjeta"
        helper="Muestra un ícono de tarjeta de crédito antes del texto del mensaje."
      />

      {/* Badge opcional */}
      <div style={{ marginBottom: 16, marginTop: 24 }}>
        <FieldLabel>Badge (opcional)</FieldLabel>
        <TextInput
          value={config.textoBadge}
          onChange={(v) => update('textoBadge', v)}
          placeholder="Ej: OFERTA"
          maxLength={15}
        />
        <FieldHelper>Dejá vacío para no mostrar badge (máximo 15 caracteres)</FieldHelper>
      </div>

      {/* Efecto rebote badge */}
      <CheckboxCard
        checked={config.efectoRebote}
        onChange={(v) => update('efectoRebote', v)}
        label="Efecto rebote en el badge"
        helper="Aplica una animación de zoom-rebote al badge para llamar la atención."
      />

      {/* Posición del badge */}
      <div style={{ marginTop: 24 }}>
        <FieldLabel>Posición del badge</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.posicionBadge === 'esquina-superior-derecha'}
            onChange={() => update('posicionBadge', 'esquina-superior-derecha')}
            label="Esquina superior derecha"
            helper="El badge flota en la esquina (por encima del borde)."
          />
          <RadioCard
            checked={config.posicionBadge === 'final-texto'}
            onChange={() => update('posicionBadge', 'final-texto')}
            label="Al final del texto"
            helper="El badge se muestra inline a la derecha, al final del mensaje."
          />
        </div>
      </div>
    </div>
  );

  /* ═══ TAB UBICACIÓN ═══ */
  const tabUbicacion = (
    <div>
      <CheckboxCard
        checked={config.mostrarEnProducto}
        onChange={(v) => update('mostrarEnProducto', v)}
        label="Mostrar en ficha de producto"
        helper="El widget aparece en la página de cada producto."
      >
        <a
          href="https://ayuda.tiendanube.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#10B981', textDecoration: 'none',
            fontWeight: 600, marginTop: 4,
          }}
        >
          ¿Cómo ocultar el mensaje nativo de Tiendanube para evitar duplicados?
          <IconExternal />
        </a>
      </CheckboxCard>

      <CheckboxCard
        checked={config.mostrarEnGrilla}
        onChange={(v) => update('mostrarEnGrilla', v)}
        label="Mostrar en grilla de productos"
        helper="El widget aparece debajo del precio en home, categorías y grillas. Sin animación."
      />
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div>
      {/* Colores — Grid Autoadaptable Premium sin desbordes en mobile */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 20, 
        marginBottom: 20 
      }}>
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.colorFondo} onChange={(v) => update('colorFondo', v)} />
        </div>
        <div>
          <FieldLabel>Color de texto</FieldLabel>
          <ColorPickerField value={config.colorTexto} onChange={(v) => update('colorTexto', v)} />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <ToggleField
          checked={config.fondoDegradado}
          onChange={(v) => update('fondoDegradado', v)}
          label="Fondo en degradado"
        />
      </div>

      {/* Tamaño y Borde — Grid Autoadaptable Premium */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 20, 
        marginBottom: 24 
      }}>
        <div>
          <FieldLabel>Tamaño de fuente</FieldLabel>
          <SelectField
            value={config.fontSize}
            onChange={(v) => update('fontSize', v)}
            options={[
              { value: '11px', label: '11px' },
              { value: '13px', label: '13px' },
              { value: '15px', label: '15px' },
              { value: '17px', label: '17px' },
            ]}
          />
        </div>
        <div>
          <FieldLabel>Borde</FieldLabel>
          <div style={{ marginTop: 4 }}>
            <ToggleField
              checked={config.mostrarBorde}
              onChange={(v) => update('mostrarBorde', v)}
              label="Mostrar borde (1px)"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div>
          <FieldLabel>Margen interno</FieldLabel>
          <div style={{ marginTop: 8 }}>
            <RangeSlider
              value={config.paddingInterno}
              min={0} max={30}
              onChange={(v) => update('paddingInterno', v)}
              ticks={[0, 10, 30]}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Bordes redondeados</FieldLabel>
          <div style={{ marginTop: 8 }}>
            <RangeSlider
              value={config.bordesRedondeados}
              min={0} max={25}
              onChange={(v) => update('bordesRedondeados', v)}
              ticks={[0, 25, 25]}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Efecto</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.efecto === 'aureola'}
            onChange={() => update('efecto', 'aureola')}
            label="Aureola pulsante"
            helper="Un halo se expande y difumina alrededor del elemento."
          />
          <RadioCard
            checked={config.efecto === 'zoom'}
            onChange={() => update('efecto', 'zoom')}
            label="Zoom"
            helper="El elemento se agranda y reduce suavemente."
          />
          <RadioCard
            checked={config.efecto === 'sin-efecto'}
            onChange={() => update('efecto', 'sin-efecto')}
            label="Sin efecto"
            helper="El mensaje se muestra estático, sin animación."
          />
        </div>
      </div>

      <div>
        <FieldLabel>Estilos del badge</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 8 }}>
              Color de fondo
            </div>
            <ColorPickerField value={config.colorFondoBadge} onChange={(v) => update('colorFondoBadge', v)} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 8 }}>
              Color de texto
            </div>
            <ColorPickerField value={config.colorTextoBadge} onChange={(v) => update('colorTextoBadge', v)} />
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const tabFechasEspeciales = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>
          Elegí una campaña activa. Al seleccionarla, se aplicará un diseño optimizado con colores temáticos de alto impacto para este widget.
        </FieldHelper>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CAMPAIGN_PRESETS.map((preset) => {
          const isSelected = (config.campaignTheme || 'none') === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => update('campaignTheme', preset.id)}
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

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas Especiales' },
  ];

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* HEADER CON LOGO OFICIAL */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#000000', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#ffffff',
          }}>
            RL
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Scope chip */}
        {isForAll ? (
          <div style={{
            background: '#10B981', color: '#ffffff',
            borderRadius: 999, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <IconStore />
            <span>Todos los productos</span>
          </div>
        ) : (
          <div style={{
            background: '#ffffff', border: '1px solid #e5e7eb',
            borderRadius: 10, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#000000',
          }}>
            <span style={{ fontSize: 18 }}>🛍</span>
            <span>NEVUX Widget</span>
          </div>
        )}

        {/* Título */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: '#000000',
          margin: '0 0 20px', lineHeight: 1.2,
        }}>
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        {/* Contenedor principal */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          {/* Preview */}
          <div style={{ marginBottom: 20 }}>
            <BadgeCuotasPreview config={config} />
          </div>

          {/* Info box */}
          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0',
            borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000000', lineHeight: 1.5 }}>
              El widget crea su propio mensaje debajo del precio del producto.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24,
          }}>
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1, padding: '14px 12px', background: 'none',
                    border: 'none', borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000000',
                    opacity: act ? 1 : 0.6,
                    fontSize: 15, fontWeight: act ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Contenido del tab */}
          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'ubicacion' && tabUbicacion}
            {activeTab === 'estilos' && tabEstilos}
            {activeTab === 'fechas' && tabFechasEspeciales}
          </div>

          {/* Footer del Editor */}
          <div style={{
            marginTop: 32, paddingTop: 20,
            borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            flexWrap: 'wrap',
          }}>
            <ToggleField
              checked={isActive}
              onChange={setIsActive}
              label="Widget activo"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: 999,
                border: 'none',
                background: savedOK ? '#10b981' : '#10B981',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA OFICIAL UNIFICADO */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>

        {/* Error Toast */}
        {error && (
          <div style={{
            position: 'fixed', bottom: 20, left: 16, right: 16,
            maxWidth: 600, margin: '0 auto',
            background: '#fee2e2', color: '#991b1b',
            padding: '12px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 600,
            border: '1px solid #fecaca', zIndex: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
   }
