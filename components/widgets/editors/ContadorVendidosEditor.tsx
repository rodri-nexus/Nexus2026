'use client';

import React, { useState } from 'react';
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

interface ContadorVendidosEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

export interface ContadorVendidosConfig {
  cantidadVendida: number;
  periodo: 'ultimas-24hs' | 'ultimos-7-dias' | 'ultimos-30-dias' | 'este-mes' | 'sin-periodo';
  texto: string;
  autoIncrementar: boolean;
  intervaloSegundos: number;
  icono: 'fuego' | 'check' | 'carrito' | 'paquete' | 'estrella' | 'personas' | 'cohete';
  posicion: 'debajo-precio' | 'debajo-titulo' | 'debajo-comprar';
  mostrarEnProducto: boolean;
  mostrarEnGrilla: boolean;
  estiloVisual: 'pildora' | 'borde' | 'tarjeta' | 'gradiente';
  colorFondo: string;
  colorTexto: string;
  colorIcono: string;
  colorBorde: string;
  puntoPulsante: boolean;
  efecto: 'sin-efecto' | 'fade-in' | 'slide' | 'zoom';
  fontSize: string;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const defaultConfig: ContadorVendidosConfig = {
  cantidadVendida: 247,
  periodo: 'ultimas-24hs',
  texto: 'vendidos en las últimas 24 horas',
  autoIncrementar: true,
  intervaloSegundos: 45,
  icono: 'fuego',
  posicion: 'debajo-precio',
  mostrarEnProducto: true,
  mostrarEnGrilla: true,
  estiloVisual: 'pildora',
  colorFondo: '#ecfdf5',
  colorTexto: '#065f46',
  colorIcono: '#10B981',
  colorBorde: '#10B981',
  puntoPulsante: true,
  efecto: 'fade-in',
  fontSize: '13px',
  campaignTheme: 'none',
};

const PERIOD_TEXTS: Record<string, string> = {
  'ultimas-24hs': 'vendidos en las últimas 24 horas',
  'ultimos-7-dias': 'vendidos en los últimos 7 días',
  'ultimos-30-dias': 'vendidos en el último mes',
  'este-mes': 'vendidos este mes',
  'sin-periodo': 'unidades vendidas en total',
};

const ICON_MAP: Record<string, string> = {
  fuego: '🔥',
  check: '✅',
  carrito: '🛒',
  paquete: '📦',
  estrella: '⭐',
  personas: '👥',
  cohete: '🚀',
};

const CAMPAIGN_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'black-friday': { bg: '#111827', text: '#F59E0B', border: '#F59E0B', icon: '#F59E0B' },
  'hot-sale': { bg: '#0F172A', text: '#EF4444', border: '#EF4444', icon: '#EF4444' },
  'cyber-monday': { bg: '#090D16', text: '#3B82F6', border: '#3B82F6', icon: '#3B82F6' },
  'navidad': { bg: '#064E3B', text: '#EF4444', border: '#EF4444', icon: '#EF4444' },
  'san-valentin': { bg: '#831843', text: '#F43F5E', border: '#F43F5E', icon: '#F43F5E' },
  'dia-padre-madre': { bg: '#312E81', text: '#10B981', border: '#10B981', icon: '#10B981' },
  'liquidacion': { bg: '#7F1D1D', text: '#FBBF24', border: '#FBBF24', icon: '#FBBF24' },
};

/* ═══════════════════════════════════════════
   SUBCOMPONENTES Y CONTROLES
═══════════════════════════════════════════ */
function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
      <line x1="2" y1="7" x2="22" y2="7"/>
      <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
      <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

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

function NumberInput({
  value, onChange, min = 0, max = 99999,
}: {
  value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
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
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
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
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
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

/* ═══════════════════════════════════════════
   PREVIEW LIVE INTEGRADO (Regla #16)
═══════════════════════════════════════════ */
function ContadorVendidosPreview({ config }: { config: ContadorVendidosConfig }) {
  const theme = config.campaignTheme && config.campaignTheme !== 'none'
    ? CAMPAIGN_COLORS[config.campaignTheme]
    : null;

  const bg = theme ? theme.bg : config.colorFondo;
  const textColor = theme ? theme.text : config.colorTexto;
  const iconColor = theme ? theme.icon : config.colorIcono;
  const borderColor = theme ? theme.border : config.colorBorde;

  const iconEmoji = ICON_MAP[config.icono] || '🔥';

  const getContainerStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: config.fontSize,
      fontWeight: 600,
      color: textColor,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: 1.3,
      transition: 'all 0.2s ease',
    };

    if (config.estiloVisual === 'borde') {
      return {
        ...base,
        background: bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 8,
        padding: '8px 14px',
      };
    }
    if (config.estiloVisual === 'tarjeta') {
      return {
        ...base,
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: '10px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        width: '100%',
        boxSizing: 'border-box',
      };
    }
    if (config.estiloVisual === 'gradiente') {
      return {
        ...base,
        background: `linear-gradient(135deg, ${bg} 0%, #ffffff 100%)`,
        border: `1px solid ${borderColor}`,
        borderRadius: 999,
        padding: '6px 14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      };
    }
    // Default: pildora
    return {
      ...base,
      background: bg,
      border: '1px solid transparent',
      borderRadius: 999,
      padding: '6px 14px',
    };
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #e5e7eb',
        borderRadius: 14,
        padding: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN PRODUCTO
      </div>

      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
          Remera Oversize Nevux Club
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#10B981' }}>
          $ 24.990
        </div>

        {/* Badge Contador de Vendidos */}
        <div>
          <div style={getContainerStyle()}>
            {/* Punto pulsante */}
            {config.puntoPulsante && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.25)',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Ícono */}
            <span style={{ fontSize: 14, color: iconColor }}>{iconEmoji}</span>

            {/* Texto */}
            <div>
              <strong style={{ fontWeight: 900 }}>
                {config.cantidadVendida.toLocaleString('es-AR')}
              </strong>{' '}
              {config.texto || 'unidades vendidas'}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled
          style={{
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'default',
            marginTop: 4,
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL DEL EDITOR
═══════════════════════════════════════════ */
export default function ContadorVendidosEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: ContadorVendidosEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<ContadorVendidosConfig>(() => ({
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

  const update = <K extends keyof ContadorVendidosConfig>(key: K, value: ContadorVendidosConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handlePeriodoChange = (periodoKey: string) => {
    const newText = PERIOD_TEXTS[periodoKey] || 'unidades vendidas';
    setConfig((prev) => ({
      ...prev,
      periodo: periodoKey as any,
      texto: newText,
    }));
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
      {/* Cantidad Vendida */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel required>Cantidad inicial de vendidos</FieldLabel>
        <NumberInput
          value={config.cantidadVendida}
          onChange={(v) => update('cantidadVendida', v)}
          min={1}
          max={999999}
        />
        <FieldHelper>Ingresá la cantidad estimada o real para mostrar en el contador.</FieldHelper>
      </div>

      {/* Período */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Período de referencia</FieldLabel>
        <SelectField
          value={config.periodo}
          onChange={handlePeriodoChange}
          options={[
            { value: 'ultimas-24hs', label: 'Últimas 24 horas' },
            { value: 'ultimos-7-dias', label: 'Últimos 7 días' },
            { value: 'ultimos-30-dias', label: 'Últimos 30 días' },
            { value: 'este-mes', label: 'Este mes' },
            { value: 'sin-periodo', label: 'Sin período (total histórico)' },
          ]}
        />
        <FieldHelper>Al cambiar el período se actualizará el texto por defecto.</FieldHelper>
      </div>

      {/* Texto Personalizado */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Texto descriptivo</FieldLabel>
        <TextInput
          value={config.texto}
          onChange={(v) => update('texto', v)}
          placeholder="vendidos en las últimas 24 horas"
          maxLength={60}
        />
        <FieldHelper>El número de vendidos se mostrará automáticamente al inicio de esta frase.</FieldHelper>
      </div>

      {/* Ícono */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Ícono destacado</FieldLabel>
        <SelectField
          value={config.icono}
          onChange={(v) => update('icono', v as any)}
          options={[
            { value: 'fuego', label: '🔥 Fuego / Hot' },
            { value: 'check', label: '✅ Check verificado' },
            { value: 'carrito', label: '🛒 Carrito de compras' },
            { value: 'paquete', label: '📦 Paquete / Envío' },
            { value: 'estrella', label: '⭐ Estrella top' },
            { value: 'personas', label: '👥 Clientes / Comunidad' },
            { value: 'cohete', label: '🚀 Cohete / Éxito' },
          ]}
        />
      </div>

      {/* Auto-incremento en vivo */}
      <CheckboxCard
        checked={config.autoIncrementar}
        onChange={(v) => update('autoIncrementar', v)}
        label="Simular incremento automático en vivo"
        helper="Suma +1 al contador de forma aleatoria para generar sensación de ventas ocurriendo ahora mismo."
      >
        {config.autoIncrementar && (
          <div>
            <FieldLabel>Frecuencia de incremento (segundos)</FieldLabel>
            <SelectField
              value={String(config.intervaloSegundos)}
              onChange={(v) => update('intervaloSegundos', Number(v))}
              options={[
                { value: '25', label: 'Cada 25 segundos' },
                { value: '45', label: 'Cada 45 segundos (Recomendado)' },
                { value: '90', label: 'Cada 90 segundos' },
                { value: '180', label: 'Cada 3 minutos' },
              ]}
            />
          </div>
        )}
      </CheckboxCard>
    </div>
  );

  /* ═══ TAB UBICACIÓN ═══ */
  const tabUbicacion = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Posición en la ficha de producto</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.posicion === 'debajo-precio'}
            onChange={() => update('posicion', 'debajo-precio')}
            label="Debajo del precio del producto"
            helper="Ubicación de máxima visibilidad junto al valor."
          />
          <RadioCard
            checked={config.posicion === 'debajo-titulo'}
            onChange={() => update('posicion', 'debajo-titulo')}
            label="Debajo del título"
            helper="Aparece justo después del nombre del producto."
          />
          <RadioCard
            checked={config.posicion === 'debajo-comprar'}
            onChange={() => update('posicion', 'debajo-comprar')}
            label="Debajo del botón 'Agregar al carrito'"
            helper="Refuerzo de confianza justo antes de la acción de compra."
          />
        </div>
      </div>

      <CheckboxCard
        checked={config.mostrarEnProducto}
        onChange={(v) => update('mostrarEnProducto', v)}
        label="Mostrar en ficha de producto"
        helper="El contador se mostrará en la página del producto."
      />

      <CheckboxCard
        checked={config.mostrarEnGrilla}
        onChange={(v) => update('mostrarEnGrilla', v)}
        label="Mostrar en grilla de productos (Home / Categorías)"
        helper="Aparece de forma compacta debajo del precio en listados."
      />
    </div>
  );

  /* ═══ TAB ESTILOS (DISEÑO RE-ACOMODADO ADAPTABLE) ═══ */
  const tabEstilos = (
    <div>
      {/* Estilo visual */}
      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Estilo del contenedor</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.estiloVisual === 'pildora'}
            onChange={() => update('estiloVisual', 'pildora')}
            label="Píldora minimalista"
            helper="Fondo suave y esquinas totalmente redondeadas."
          />
          <RadioCard
            checked={config.estiloVisual === 'borde'}
            onChange={() => update('estiloVisual', 'borde')}
            label="Badge con borde destacado"
            helper="Marco sólido con acento de color."
          />
          <RadioCard
            checked={config.estiloVisual === 'tarjeta'}
            onChange={() => update('estiloVisual', 'tarjeta')}
            label="Tarjeta ancha con sombra"
            helper="Ocupa todo el ancho con diseño de tarjeta moderna."
          />
          <RadioCard
            checked={config.estiloVisual === 'gradiente'}
            onChange={() => update('estiloVisual', 'gradiente')}
            label="Chip con degradado suave"
            helper="Fondo con transición de color premium."
          />
        </div>
      </div>

      {/* Colores — Grid Autoadaptable Premium */}
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
        <div>
          <FieldLabel>Color de ícono</FieldLabel>
          <ColorPickerField value={config.colorIcono} onChange={(v) => update('colorIcono', v)} />
        </div>
        <div>
          <FieldLabel>Color de borde</FieldLabel>
          <ColorPickerField value={config.colorBorde} onChange={(v) => update('colorBorde', v)} />
        </div>
      </div>

      {/* Punto pulsante & Tamaño — Grid Autoadaptable Premium */}
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
              { value: '11px', label: '11px (Compacto)' },
              { value: '13px', label: '13px (Estándar)' },
              { value: '15px', label: '15px (Mediano)' },
              { value: '17px', label: '17px (Grande)' },
            ]}
          />
        </div>
        <div>
          <FieldLabel>Efecto de entrada</FieldLabel>
          <SelectField
            value={config.efecto}
            onChange={(v) => update('efecto', v as any)}
            options={[
              { value: 'fade-in', label: 'Fade in suave' },
              { value: 'slide', label: 'Deslizar desde izq.' },
              { value: 'zoom', label: 'Zoom sutil' },
              { value: 'sin-efecto', label: 'Sin animación' },
            ]}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <ToggleField
          checked={config.puntoPulsante}
          onChange={(v) => update('puntoPulsante', v)}
          label="Mostrar punto rojo pulsante de urgencia ('En Vivo')"
        />
      </div>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo negro con dorado de alto contraste.', themeColor: '#111827', accentColor: '#F59E0B' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Diseño deportivo con rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético nocturno y azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino tradicional con rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con acento verde esmeralda.', themeColor: '#312E81', accentColor: '#10B981' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí con amarillo urgencia.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
  ];

  const tabFechasEspeciales = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>
          Elegí una campaña activa. Al seleccionarla, el badge de vendidos adaptará automáticamente su paleta temática.
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

  /* ═══ RENDER PRINCIPAL ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* HEADER OFICIAL */}
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

      {/* MAIN CONTAINER */}
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

        {/* Contenedor del Editor */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          {/* Live Preview Integrado */}
          <div style={{ marginBottom: 20 }}>
            <ContadorVendidosPreview config={config} />
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
              El contador genera urgencia y confianza mostrando cuántas unidades fueron adquiridas sin tocar tu carrito.
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

          {/* Contenido del Tab */}
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

        {/* CENTRO DE AYUDA OFICIAL */}
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
