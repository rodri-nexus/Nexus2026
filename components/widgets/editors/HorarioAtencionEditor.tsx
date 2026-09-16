'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface WidgetDef {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExWidget {
  id: string | number;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface HorarioAtencionEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

interface Cfg {
  openTime: string;
  closeTime: string;
  workDays: number[];
  openText: string;
  closedText: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  showIcon: boolean;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: Cfg = {
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

/* ═══════════════════════════════════════════
   ICONOS
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

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES DE FORMULARIO (Regla #9)
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
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
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

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };
  return {
    openTime: (raw.openTime as string) || DEF.openTime,
    closeTime: (raw.closeTime as string) || DEF.closeTime,
    workDays: Array.isArray(raw.workDays) ? (raw.workDays as number[]) : DEF.workDays,
    openText: (raw.openText as string) || DEF.openText,
    closedText: (raw.closedText as string) || DEF.closedText,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    borderColor: (raw.borderColor as string) || DEF.borderColor,
    showIcon: typeof raw.showIcon === 'boolean' ? raw.showIcon : DEF.showIcon,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function HorarioAtencionEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: HorarioAtencionEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [isOpenNow, setIsOpenNow] = useState(true);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay();
      
      if (!cfg.workDays.includes(day)) {
        setIsOpenNow(false);
        return;
      }

      const [openH, openM] = cfg.openTime.split(':').map(Number);
      const [closeH, closeM] = cfg.closeTime.split(':').map(Number);

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = openH * 60 + openM;
      const endMinutes = closeH * 60 + closeM;

      setIsOpenNow(currentMinutes >= startMinutes && currentMinutes <= endMinutes);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 10000);
    return () => clearInterval(interval);
  }, [cfg.openTime, cfg.closeTime, cfg.workDays]);

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const toggleDay = (day: number) => {
    if (cfg.workDays.includes(day)) {
      set('workDays', cfg.workDays.filter((d) => d !== day));
    } else {
      set('workDays', [...cfg.workDays, day]);
    }
  };

  const applyPreset = (slug: string) => {
    const PRESETS_DATA: Record<string, { bg: string; tx: string; bd: string }> = {
      'black-friday': { bg: '#111827', tx: '#ffffff', bd: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', bd: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', bd: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', bd: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', bd: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', bd: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', bd: '#FBBF24' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        textColor: DEF.textColor,
        borderColor: DEF.borderColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
        borderColor: p.bd,
      }));
    }
  };

  const save = async () => {
    setSaving(true);
    setOk(false);
    setErr('');
    try {
      const body = {
        id: ew?.id ?? null,
        store_id: storeId,
        widget_slug: wd.slug,
        config: cfg,
        target_type: targetType,
        target_product_id: productId,
        is_active: true,
      };
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setOk(true);
      router.push('/widgets');
    } catch {
      setErr('No se pudo guardar. Reintentá.');
    } finally {
      setSaving(false);
    }
  };

  /* ═══ PRESETS LIST ═══ */
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

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* HEADERsticky CON LOGO OFICIAL */}
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
          {ew ? 'Editar widget: ' : 'Nuevo widget: '}
          {wd.name} ({scopeLabel})
        </h1>

        {/* Contenedor principal */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>

          {/* PREVIEW GRANDE PREMIUM */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VISTA PREVIA EN VIVO
            </div>

            <div
              style={{
                background: cfg.bgColor,
                borderRadius: 12,
                border: `1.5px solid ${cfg.borderColor}`,
                padding: '16px 20px',
                color: cfg.textColor,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              {cfg.showIcon && (
                <span style={{ fontSize: 32, flexShrink: 0 }}>⏰</span>
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 17, // AGRANDADO de 14px a 17px para mayor jerarquía
                    fontWeight: 800,
                    lineHeight: 1.3,
                  }}
                >
                  {isOpenNow ? cfg.openText : cfg.closedText}
                </div>
                <div
                  style={{
                    fontSize: 13, // AGRANDADO de 11px a 13px para mejor lectura
                    opacity: 0.65,
                    marginTop: 4,
                    fontWeight: 600,
                  }}
                >
                  Atención: Lunes a Viernes {cfg.openTime} a {cfg.closeTime} hs.
                </div>
              </div>
            </div>
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
            {(
              [
                ['gen', 'General'],
                ['style', 'Estilos'],
                ['dates', '🔥 Fechas Especiales'],
              ] as const
            ).map(([k, l]) => {
              const act = tab === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
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
                  {l}
                </button>
              );
            })}
          </div>

          {/* CONTENIDOS DE LAS PESTAÑAS */}
          <div>
            {tab === 'gen' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Rango de Horario */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <FieldLabel>Hora de Apertura</FieldLabel>
                    <input
                      type="time"
                      value={cfg.openTime}
                      onChange={(e) => set('openTime', e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', fontSize: 15,
                        border: '1.5px solid #e5e7eb', borderRadius: 10,
                        background: '#ffffff', color: '#000000', outline: 'none',
                        boxSizing: 'border-box', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div>
                    <FieldLabel>Hora de Cierre</FieldLabel>
                    <input
                      type="time"
                      value={cfg.closeTime}
                      onChange={(e) => set('closeTime', e.target.value)}
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
                      const active = cfg.workDays.includes(d.v);
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
                    value={cfg.openText}
                    onChange={(e) => set('openText', e.target.value)}
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
                    value={cfg.closedText}
                    onChange={(e) => set('closedText', e.target.value)}
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
            )}

            {tab === 'style' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Colores — Grid Autoadaptable Premium sin desbordes */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                  gap: 20, 
                  marginBottom: 10 
                }}>
                  <div>
                    <FieldLabel>Color de fondo</FieldLabel>
                    <ColorPickerField value={cfg.bgColor} onChange={(v) => set('bgColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color de texto</FieldLabel>
                    <ColorPickerField value={cfg.textColor} onChange={(v) => set('textColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Color del borde</FieldLabel>
                    <ColorPickerField value={cfg.borderColor} onChange={(v) => set('borderColor', v)} />
                  </div>
                </div>

                {/* Checkbox Icon */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                  <ToggleField
                    checked={cfg.showIcon}
                    onChange={(v) => set('showIcon', v)}
                    label="Mostrar ícono de reloj ⏰ antes del texto"
                  />
                </div>
              </div>
            )}

            {tab === 'dates' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
                  <FieldHelper>
                    Elegí una campaña activa. Al seleccionarla, se aplicarán colores de branding oficial adaptados a la fecha.
                  </FieldHelper>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {CAMPAIGN_PRESETS.map((preset) => {
                    const isSelected = cfg.campaignTheme === preset.id;
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
            )}
          </div>

          {/* ALERTAS */}
          <div style={{ marginTop: 20 }}>
            {ok && (
              <div style={{
                background: '#ecfdf5', border: '1px solid #10B981',
                borderRadius: 10, padding: '10px 16px',
                fontSize: 13, fontWeight: 700, color: '#059669',
              }}>
                ✅ Widget guardado correctamente
              </div>
            )}
            {err && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: 10, padding: '10px 16px',
                fontSize: 13, fontWeight: 700, color: '#dc2626',
              }}>
                ❌ {err}
              </div>
            )}
          </div>

          {/* BOTÓN GUARDAR */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                padding: '14px 40px', borderRadius: 999,
                border: 'none',
                background: saving ? '#9ca3af' : '#10B981',
                color: '#fff', fontSize: 15, fontWeight: 800,
                cursor: saving ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              {saving ? 'Guardando...' : ew ? 'Actualizar Widget' : 'Crear Widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA OFICIAL */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
   }
