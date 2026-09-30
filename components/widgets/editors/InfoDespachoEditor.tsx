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

interface InfoDespachoEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

interface Cfg {
  showTimer: boolean;
  hoursThreshold: number;
  textBeforeCutoff: string;
  textAfterCutoff: string;
  timerPrefixText: string;
  cutoffTime: string;
  prepDays: number;
  dispatchSaturday: boolean;
  dispatchSunday: boolean;
  transitAmba: number;
  transitRest: number;
  bgColor: string;
  textColor: string;
  badgeBgColor: string;
  designStyle: 'full' | 'pill' | 'bordered' | 'none';
  location: 'product_before' | 'product_after' | 'cart';
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: Cfg = {
  showTimer: true,
  hoursThreshold: 0,
  textBeforeCutoff: 'Comprando ahora tu pedido se despacha {{dia}}',
  textAfterCutoff: 'Tu pedido se despacha {{dia}}',
  timerPrefixText: 'Te quedan',
  cutoffTime: '13:00',
  prepDays: 0,
  dispatchSaturday: false,
  dispatchSunday: false,
  transitAmba: 1,
  transitRest: 3,
  bgColor: '#10B981',
  textColor: '#ffffff',
  badgeBgColor: 'rgba(255, 255, 255, 0.25)',
  designStyle: 'full',
  location: 'product_before',
  campaignTheme: 'none',
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
  value, onChange, placeholder, maxLength, type = 'text',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; type?: string;
}) {
  return (
    <input
      type={type}
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
    showTimer: typeof raw.showTimer === 'boolean' ? raw.showTimer : DEF.showTimer,
    hoursThreshold: typeof raw.hoursThreshold === 'number' ? raw.hoursThreshold : DEF.hoursThreshold,
    textBeforeCutoff: (raw.textBeforeCutoff as string) || DEF.textBeforeCutoff,
    textAfterCutoff: (raw.textAfterCutoff as string) || DEF.textAfterCutoff,
    timerPrefixText: (raw.timerPrefixText as string) || DEF.timerPrefixText,
    cutoffTime: (raw.cutoffTime as string) || DEF.cutoffTime,
    prepDays: typeof raw.prepDays === 'number' ? raw.prepDays : DEF.prepDays,
    dispatchSaturday: typeof raw.dispatchSaturday === 'boolean' ? raw.dispatchSaturday : DEF.dispatchSaturday,
    dispatchSunday: typeof raw.dispatchSunday === 'boolean' ? raw.dispatchSunday : DEF.dispatchSunday,
    transitAmba: typeof raw.transitAmba === 'number' ? raw.transitAmba : DEF.transitAmba,
    transitRest: typeof raw.transitRest === 'number' ? raw.transitRest : DEF.transitRest,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    badgeBgColor: (raw.badgeBgColor as string) || DEF.badgeBgColor,
    designStyle: (raw.designStyle as Cfg['designStyle']) || DEF.designStyle,
    location: (raw.location as Cfg['location']) || DEF.location,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function InfoDespachoEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: InfoDespachoEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'op' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  // Cálculo dinámico para la Vista Previa
  const [remainingTime, setRemainingTime] = useState({ hours: 2, mins: 15, isBeforeCutoff: true });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const [cutH, cutM] = cfg.cutoffTime.split(':').map(Number);
      const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), cutH, cutM, 0);

      let diff = cutoff.getTime() - now.getTime();
      let isBefore = true;

      if (diff <= 0) {
        isBefore = false;
        const tomorrowCutoff = new Date(cutoff.getTime() + 24 * 60 * 60 * 1000);
        diff = tomorrowCutoff.getTime() - now.getTime();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setRemainingTime({ hours, mins, isBeforeCutoff: isBefore });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 10000);
    return () => clearInterval(interval);
  }, [cfg.cutoffTime]);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const applyPreset = (slug: string) => {
    const PRESETS_DATA: Record<string, { bg: string; tx: string; badge: string }> = {
      'black-friday': { bg: '#111827', tx: '#ffffff', badge: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', badge: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', badge: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', badge: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', badge: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', badge: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#ffffff', badge: '#FBBF24' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        textColor: DEF.textColor,
        badgeBgColor: DEF.badgeBgColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
        badgeBgColor: p.badge,
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

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Verde Nevux / Sin Evento', emoji: '🟢', desc: 'Fondo verde de marca Nevux con máximo impacto de despacho.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Negro mate nocturno con acento dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Azul noche con rojo fuego de urgencia.', themeColor: '#0F172A', accentColor: '#EF4444' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul cibernético profundo.', themeColor: '#090D16', accentColor: '#3B82F6' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con rojo festivo.', themeColor: '#064E3B', accentColor: '#EF4444' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con verde alegre.', themeColor: '#312E81', accentColor: '#10B981' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí con amarillo sale.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
  ];

  const getProcessedPreviewText = () => {
    const raw = remainingTime.isBeforeCutoff ? cfg.textBeforeCutoff : cfg.textAfterCutoff;
    const diaReplacement = remainingTime.isBeforeCutoff ? 'HOY' : 'mañana';
    return raw.replace(/\{\{dia\}\}/g, diaReplacement);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* HEADER STICKY */}
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

          {/* PREVIEW GRANDE EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VISTA PREVIA EN VIVO
            </div>

            <div
              style={{
                background: cfg.designStyle === 'none' ? 'transparent' : cfg.bgColor,
                border: cfg.designStyle === 'bordered' ? `2px solid ${cfg.bgColor}` : 'none',
                borderRadius: cfg.designStyle === 'pill' ? 999 : 14,
                padding: '16px 20px',
                color: cfg.designStyle === 'none' ? '#111827' : cfg.textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                boxShadow: cfg.designStyle === 'none' ? 'none' : '0 4px 14px rgba(0,0,0,0.06)',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>📦</span>
                <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>
                  {getProcessedPreviewText()}
                </div>
              </div>

              {cfg.showTimer && (
                <div style={{
                  background: cfg.badgeBgColor,
                  borderRadius: 10,
                  padding: '8px 12px',
                  textAlign: 'center',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase' }}>
                    {cfg.timerPrefixText}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'monospace', marginTop: 1 }}>
                    {remainingTime.hours}h {remainingTime.mins}m
                  </span>
                </div>
              )}
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
              Mostrá urgencia real basada en tu horario de corte. Los clientes sabrán exactamente cuánto tiempo les queda para recibir el despacho hoy.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', 'Textos y Contador'],
                ['op', '⚙️ Operatoria'],
                ['style', 'Diseño y Colores'],
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
                    fontSize: 14, fontWeight: act ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    whiteSpace: 'nowrap', transition: 'all 0.2s',
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>

          {/* TAB TEXTOS Y CONTADOR */}
          {tab === 'gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <ToggleField
                  checked={cfg.showTimer}
                  onChange={(v) => set('showTimer', v)}
                  label="Mostrar contador de tiempo restante"
                />
              </div>

              <div>
                <FieldLabel>Mensaje cuando entra al despacho de hoy</FieldLabel>
                <TextInput
                  value={cfg.textBeforeCutoff}
                  onChange={(v) => set('textBeforeCutoff', v)}
                  placeholder="Comprando ahora tu pedido se despacha {{dia}}"
                />
                <FieldHelper>Usá la variable <strong>{"{{dia}}"}</strong> para insertar la palabra HOY, mañana o el día que corresponda.</FieldHelper>
              </div>

              <div>
                <FieldLabel>Mensaje cuando ya pasó el horario de corte</FieldLabel>
                <TextInput
                  value={cfg.textAfterCutoff}
                  onChange={(v) => set('textAfterCutoff', v)}
                  placeholder="Tu pedido se despacha {{dia}}"
                />
              </div>

              <div>
                <FieldLabel>Texto arriba del contador</FieldLabel>
                <TextInput
                  value={cfg.timerPrefixText}
                  onChange={(v) => set('timerPrefixText', v)}
                  placeholder="Te quedan"
                />
              </div>
            </div>
          )}

          {/* TAB OPERATORIA */}
          {tab === 'op' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Horario de Corte de Despacho</FieldLabel>
                  <input
                    type="time"
                    value={cfg.cutoffTime}
                    onChange={(e) => set('cutoffTime', e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', fontSize: 15,
                      border: '1.5px solid #e5e7eb', borderRadius: 10,
                      background: '#ffffff', color: '#000000', outline: 'none',
                      boxSizing: 'border-box', fontFamily: 'inherit',
                    }}
                  />
                  <FieldHelper>Hasta esta hora recibís pedidos para despacharlos en el mismo día.</FieldHelper>
                </div>

                <div>
                  <FieldLabel>Días de preparación (Días hábiles)</FieldLabel>
                  <TextInput
                    type="number"
                    value={String(cfg.prepDays)}
                    onChange={(v) => set('prepDays', parseInt(v, 10) || 0)}
                    placeholder="0"
                  />
                  <FieldHelper>0 = Se despacha el mismo día. 1 = Requiere 1 día de armado.</FieldHelper>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <ToggleField
                  checked={cfg.dispatchSaturday}
                  onChange={(v) => set('dispatchSaturday', v)}
                  label="Despachás los Sábados"
                />
                <ToggleField
                  checked={cfg.dispatchSunday}
                  onChange={(v) => set('dispatchSunday', v)}
                  label="Despachás los Domingos"
                />
              </div>
            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Estilo visual del contenedor</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'full', label: 'Barra completa' },
                    { id: 'pill', label: 'Pastilla' },
                    { id: 'bordered', label: 'Con borde' },
                    { id: 'none', label: 'Sin fondo' },
                  ].map((st) => {
                    const active = cfg.designStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => set('designStyle', st.id as any)}
                        style={{
                          padding: '10px 6px', borderRadius: 8,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PALETA DE COLORES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Color de fondo principal</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => set('bgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de texto</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => set('textColor', v)} />
                </div>
                <div>
                  <FieldLabel>Fondo del recuadro del contador</FieldLabel>
                  <ColorPickerField value={cfg.badgeBgColor} onChange={(v) => set('badgeBgColor', v)} />
                </div>
              </div>

              {/* UBICACIÓN */}
              <div>
                <FieldLabel>¿Dónde mostrarlo?</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'product_before', label: '⬆️ Arriba del botón' },
                    { id: 'product_after', label: '⬇️ Abajo del botón' },
                    { id: 'cart', label: '🛒 Carrito de compras' },
                  ].map((loc) => {
                    const active = cfg.location === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => set('location', loc.id as any)}
                        style={{
                          padding: '12px 10px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center',
                          lineHeight: 1.3,
                        }}
                      >
                        {loc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB FECHAS ESPECIALES */}
          {tab === 'dates' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
                <FieldHelper>
                  Elegí una campaña activa para vestir la información de despacho con colores de branding festivo.
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
