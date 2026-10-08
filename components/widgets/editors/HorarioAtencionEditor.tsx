'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 y #30 al inicio)
═══════════════════════════════════════════ */
export type TabType = 'general' | 'estilos' | 'fechas';

interface WidgetDefinition {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExistingWidget {
  id: string | number;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
  target_category_id?: string | number | null;
}

interface HorarioAtencionEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface HorarioAtencionConfig {
  openTime: string;
  closeTime: string;
  workDays: number[];
  openText: string;
  closedText: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  showIcon: boolean;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO Y PRESETS
═══════════════════════════════════════════ */
const defaultConfig: HorarioAtencionConfig = {
  openTime: '09:00',
  closeTime: '18:00',
  workDays: [1, 2, 3, 4, 5],
  openText: '🟢 ¡Abierto! Estamos online para ayudarte en tus compras.',
  closedText: '🔴 Cerrado ahora. Pero podés comprar y procesamos tu pedido mañana.',
  bgColor: '#ffffff',
  textColor: '#111827',
  borderColor: '#e5e7eb',
  showIcon: true,
  campaignTheme: 'none',
};

const DAYS_NAME = [
  { v: 1, n: 'Lunes' },
  { v: 2, n: 'Martes' },
  { v: 3, n: 'Miércoles' },
  { v: 4, n: 'Jueves' },
  { v: 5, n: 'Viernes' },
  { v: 6, n: 'Sábado' },
  { v: 0, n: 'Domingo' },
];

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Colores oscuros con acentos dorados.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Diseño deportivo con rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético nocturno y azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino tradicional con acento rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con acento verde esmeralda alegre.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí de urgencia extrema con amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const PRESETS_DATA: Record<string, { bg: string; tx: string; bd: string }> = {
  'black-friday': { bg: '#111827', tx: '#ffffff', bd: '#F59E0B' },
  'hot-sale': { bg: '#0F172A', tx: '#ffffff', bd: '#EF4444' },
  'cyber-monday': { bg: '#090D16', tx: '#ffffff', bd: '#3B82F6' },
  'navidad': { bg: '#064E3B', tx: '#ffffff', bd: '#EF4444' },
  'san-valentin': { bg: '#831843', tx: '#ffffff', bd: '#F43F5E' },
  'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', bd: '#10B981' },
  'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', bd: '#FBBF24' },
};

/* ═══════════════════════════════════════════
   FUNCIONES AUXILIARES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const formatWorkDays = (days: number[]): string => {
  if (!days || days.length === 0) return 'Ningún día';
  if (days.length === 7) return 'Todos los días';

  const sortedDays = [...days].sort((a, b) => {
    const valA = a === 0 ? 7 : a;
    const valB = b === 0 ? 7 : b;
    return valA - valB;
  });

  const isMonFri = days.length === 5 && [1, 2, 3, 4, 5].every((d) => days.includes(d));
  if (isMonFri) return 'Lunes a Viernes';

  const isMonSat = days.length === 6 && [1, 2, 3, 4, 5, 6].every((d) => days.includes(d));
  if (isMonSat) return 'Lunes a Sábado';

  const names: Record<number, string> = {
    1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 0: 'Dom',
  };

  return sortedDays.map((d) => names[d]).join(', ');
};

/* ═══════════════════════════════════════════
   SUBCOMPONENTES VISUALES Y CONTROLES
═══════════════════════════════════════════ */
function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

/* ═══════════════════════════════════════════
   PREVIEW EN VIVO INTEGRADO (Regla #13 camelCase)
═══════════════════════════════════════════ */
function HorarioAtencionPreview({
  config,
  isOpenNow,
}: {
  config: HorarioAtencionConfig;
  isOpenNow: boolean;
}) {
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
        VISTA PREVIA EN VIVO
      </div>

      <div
        style={{
          background: config.bgColor,
          borderRadius: 12,
          border: `1.5px solid ${config.borderColor}`,
          padding: '16px 20px',
          color: config.textColor,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        {config.showIcon && (
          <span style={{ fontSize: 32, flexShrink: 0 }}>⏰</span>
        )}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              lineHeight: 1.3,
            }}
          >
            {isOpenNow ? config.openText : config.closedText}
          </div>
          <div
            style={{
              fontSize: 13,
              opacity: 0.65,
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            Atención: {formatWorkDays(config.workDays)} {config.openTime} a {config.closeTime} hs.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL (Estándar v13/v22)
═══════════════════════════════════════════ */
export default function HorarioAtencionEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  categoryId = null,
  storeId,
}: HorarioAtencionEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<HorarioAtencionConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isOpenNow, setIsOpenNow] = useState(true);

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay();

      if (!config.workDays.includes(day)) {
        setIsOpenNow(false);
        return;
      }

      const [openH, openM] = config.openTime.split(':').map(Number);
      const [closeH, closeM] = config.closeTime.split(':').map(Number);

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = openH * 60 + openM;
      const endMinutes = closeH * 60 + closeM;

      setIsOpenNow(currentMinutes >= startMinutes && currentMinutes <= endMinutes);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 10000);
    return () => clearInterval(interval);
  }, [config.openTime, config.closeTime, config.workDays]);

  const update = <K extends keyof HorarioAtencionConfig>(key: K, value: HorarioAtencionConfig[K]) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      // Regla #8: Si se cambia cualquier color, desactivar la campaña activa
      if (['bgColor', 'textColor', 'borderColor'].includes(key as string)) {
        next.campaignTheme = 'none';
      }
      return next;
    });
  };

  const toggleDay = (day: number) => {
    if (config.workDays.includes(day)) {
      update('workDays', config.workDays.filter((d) => d !== day));
    } else {
      update('workDays', [...config.workDays, day]);
    }
  };

  const applyPreset = (slug: string) => {
    if (slug === 'none') {
      setConfig((prev) => ({
        ...prev,
        campaignTheme: 'none',
        bgColor: defaultConfig.bgColor,
        textColor: defaultConfig.textColor,
        borderColor: defaultConfig.borderColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setConfig((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
        borderColor: p.bd,
      }));
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
          target_product_id: targetType === 'product' ? productId : null,
          target_category_id: targetType === 'category' ? (categoryId ? String(categoryId) : null) : null,
          config: {
            ...config,
            ...(targetType === 'category' && categoryId ? { category_id: String(categoryId) } : {})
          },
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
        if (targetType === 'category' && categoryId) {
          params.set('category', String(categoryId));
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Rango de Horario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div>
          <FieldLabel required>Hora de Apertura</FieldLabel>
          <input
            type="time"
            value={config.openTime}
            onChange={(e) => update('openTime', e.target.value)}
            style={{
              width: '100%', padding: '12px 14px', fontSize: 15,
              border: '1.5px solid #e5e7eb', borderRadius: 10,
              background: '#ffffff', color: '#000000', outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>
        <div>
          <FieldLabel required>Hora de Cierre</FieldLabel>
          <input
            type="time"
            value={config.closeTime}
            onChange={(e) => update('closeTime', e.target.value)}
            style={{
              width: '100%', padding: '12px 14px', fontSize: 15,
              border: '1.5px solid #e5e7eb', borderRadius: 10,
              background: '#ffffff', color: '#000000', outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Días */}
      <div>
        <FieldLabel>Días de atención</FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {DAYS_NAME.map((d) => {
            const active = config.workDays.includes(d.v);
            return (
              <button
                key={d.v}
                type="button"
                onClick={() => toggleDay(d.v)}
                style={{
                  padding: '8px 16px', borderRadius: 20,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  border: active ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
                  background: active ? '#ecfdf5' : '#ffffff',
                  color: active ? '#059669' : '#4b5563',
                  transition: 'all 0.2s',
                }}
              >
                {d.n}
              </button>
            );
          })}
        </div>
      </div>

      {/* ABIERTO */}
      <div>
        <FieldLabel>Mensaje cuando está ABIERTO</FieldLabel>
        <textarea
          value={config.openText}
          onChange={(e) => update('openText', e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', fontSize: 15,
            border: '1.5px solid #e5e7eb', borderRadius: 10,
            background: '#ffffff', color: '#000000', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
            minHeight: 80, resize: 'none',
          }}
        />
      </div>

      {/* CERRADO */}
      <div>
        <FieldLabel>Mensaje cuando está CERRADO</FieldLabel>
        <textarea
          value={config.closedText}
          onChange={(e) => update('closedText', e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', fontSize: 15,
            border: '1.5px solid #e5e7eb', borderRadius: 10,
            background: '#ffffff', color: '#000000', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
            minHeight: 80, resize: 'none',
          }}
        />
      </div>
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 20, 
        marginBottom: 10 
      }}>
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.bgColor} onChange={(v) => update('bgColor', v)} />
        </div>
        <div>
          <FieldLabel>Color de texto</FieldLabel>
          <ColorPickerField value={config.textColor} onChange={(v) => update('textColor', v)} />
        </div>
        <div>
          <FieldLabel>Color del borde</FieldLabel>
          <ColorPickerField value={config.borderColor} onChange={(v) => update('borderColor', v)} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
        <ToggleField
          checked={config.showIcon}
          onChange={(v) => update('showIcon', v)}
          label="Mostrar ícono de reloj ⏰ antes del texto"
        />
      </div>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const tabFechasEspeciales = (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
        <FieldHelper>
          Elegí una campaña activa. Al seleccionarla, se aplicarán colores oficiales adaptados a la fecha festiva o comercial.
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
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas Especiales' },
  ];

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
        {/* Scope chip (Regla #40) */}
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
        ) : isCategory ? (
          <div style={{
            background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D',
            borderRadius: 999, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <span>🏷️ Widget para Categoría</span>
          </div>
        ) : (
          <div style={{
            background: '#ffffff', border: '1px solid #e5e7eb',
            borderRadius: 10, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#000000',
          }}>
            <span style={{ fontSize: 18 }}>🛍️</span>
            <span>NEVUX Widget de Producto</span>
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
            <HorarioAtencionPreview config={config} isOpenNow={isOpenNow} />
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
              El widget detecta automáticamente la hora local del usuario para comunicarle si tu equipo está online u offline.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24,
          }}>
            {tabs.map((t) => {
              const act = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as TabType)}
                  style={{
                    flex: 1, padding: '14px 12px', background: 'none',
                    border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000000',
                    opacity: act ? 1 : 0.6,
                    fontSize: 15, fontWeight: act ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Contenido del Tab */}
          <div>
            {activeTab === 'general' && tabGeneral}
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
