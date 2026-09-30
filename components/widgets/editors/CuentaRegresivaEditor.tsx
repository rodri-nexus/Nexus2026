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

interface CuentaRegresivaEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

interface Cfg {
  timerType: 'minutes' | 'date' | 'daily';
  durationMinutes: number;
  exactDate: string;
  title: string;
  blockSize: 'compact' | 'normal' | 'large';
  location: 'product_before' | 'product_after' | 'top_bar';
  template: 'gradient' | 'classic' | 'cards' | 'minimal' | 'neon' | 'pill' | 'outline' | 'glass';
  gradStart: string;
  gradEnd: string;
  textColor: string;
  coupon: string;
  ctaText: string;
  ctaUrl: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: Cfg = {
  timerType: 'minutes',
  durationMinutes: 30,
  exactDate: '',
  title: '¡Oferta por tiempo limitado!',
  blockSize: 'normal',
  location: 'product_before',
  template: 'gradient',
  gradStart: '#ef4444',
  gradEnd: '#eab308',
  textColor: '#ffffff',
  coupon: '',
  ctaText: '',
  ctaUrl: '',
  campaignTheme: 'none',
};

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

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };
  return {
    timerType: (raw.timerType as 'minutes' | 'date' | 'daily') || DEF.timerType,
    durationMinutes: typeof raw.durationMinutes === 'number' ? raw.durationMinutes : DEF.durationMinutes,
    exactDate: (raw.exactDate as string) || DEF.exactDate,
    title: (raw.title as string) || DEF.title,
    blockSize: (raw.blockSize as 'compact' | 'normal' | 'large') || DEF.blockSize,
    location: (raw.location as 'product_before' | 'product_after' | 'top_bar') || DEF.location,
    template: (raw.template as Cfg['template']) || DEF.template,
    gradStart: (raw.gradStart as string) || DEF.gradStart,
    gradEnd: (raw.gradEnd as string) || DEF.gradEnd,
    textColor: (raw.textColor as string) || DEF.textColor,
    coupon: (raw.coupon as string) || DEF.coupon,
    ctaText: (raw.ctaText as string) || DEF.ctaText,
    ctaUrl: (raw.ctaUrl as string) || DEF.ctaUrl,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CuentaRegresivaEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: CuentaRegresivaEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'style' | 'extra' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  // Contador de simulación en vivo
  const [demoTime, setDemoTime] = useState({ hours: '00', mins: '29', secs: '58' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const secs = String(59 - (now.getSeconds() % 60)).padStart(2, '0');
      const mins = String(29 - (now.getMinutes() % 30)).padStart(2, '0');
      setDemoTime({ hours: '00', mins, secs });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  // Modificador de color que quita automáticamente el bloqueo de la campaña
  const setCustomColor = (key: 'gradStart' | 'gradEnd' | 'textColor', val: string) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const applyPreset = (slug: string) => {
    const PRESETS_DATA: Record<string, { start: string; end: string; tx: string }> = {
      'black-friday': { start: '#111827', end: '#111827', tx: '#F59E0B' },
      'hot-sale': { start: '#0F172A', end: '#EF4444', tx: '#ffffff' },
      'cyber-monday': { start: '#090D16', end: '#3B82F6', tx: '#ffffff' },
      'navidad': { start: '#064E3B', end: '#EF4444', tx: '#ffffff' },
      'san-valentin': { start: '#831843', end: '#F43F5E', tx: '#ffffff' },
      'dia-padre-madre': { start: '#312E81', end: '#10B981', tx: '#ffffff' },
      'liquidacion': { start: '#7F1D1D', end: '#FBBF24', tx: '#ffffff' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        gradStart: DEF.gradStart,
        gradEnd: DEF.gradEnd,
        textColor: DEF.textColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        gradStart: p.start,
        gradEnd: p.end,
        textColor: p.tx,
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
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo oscuro con resaltado dorado.', themeColor: '#111827', accentColor: '#F59E0B' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Degradado nocturno a rojo fuego.', themeColor: '#0F172A', accentColor: '#EF4444' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul cibernético profundo.', themeColor: '#090D16', accentColor: '#3B82F6' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con rojo navideño.', themeColor: '#064E3B', accentColor: '#EF4444' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión.', themeColor: '#831843', accentColor: '#F43F5E' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con verde esmeralda.', themeColor: '#312E81', accentColor: '#10B981' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí con amarillo urgencia.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
  ];

  const TEMPLATES_LIST: { id: Cfg['template']; label: string }[] = [
    { id: 'gradient', label: 'Degradado' },
    { id: 'classic', label: 'Clásico' },
    { id: 'cards', label: 'Tarjetas' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'neon', label: 'Neón' },
    { id: 'pill', label: 'Píldora' },
    { id: 'outline', label: 'Contorno' },
    { id: 'glass', label: 'Cristal' },
  ];

  const getContainerBg = () => {
    if (cfg.template === 'gradient') return `linear-gradient(135deg, ${cfg.gradStart}, ${cfg.gradEnd})`;
    if (cfg.template === 'glass') return 'rgba(17, 24, 39, 0.85)';
    if (cfg.template === 'outline') return 'transparent';
    if (cfg.template === 'neon') return '#000000';
    return cfg.gradStart;
  };

  const getContainerBorder = () => {
    if (cfg.template === 'outline') return `2px dashed ${cfg.gradStart}`;
    if (cfg.template === 'neon') return `2px solid ${cfg.gradEnd}`;
    return 'none';
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
                background: getContainerBg(),
                border: getContainerBorder(),
                borderRadius: cfg.template === 'pill' ? 999 : 16,
                padding: cfg.blockSize === 'compact' ? '12px 16px' : cfg.blockSize === 'large' ? '24px 28px' : '18px 22px',
                color: cfg.textColor,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                backdropFilter: cfg.template === 'glass' ? 'blur(10px)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {cfg.title && (
                <div style={{ fontSize: cfg.blockSize === 'compact' ? 14 : cfg.blockSize === 'large' ? 19 : 16, fontWeight: 800, textAlign: 'center', color: cfg.textColor }}>
                  {cfg.title}
                </div>
              )}

              {/* DÍGITOS DEL RELOJ */}
              <div style={{ display: 'flex', alignItems: 'center', gap: cfg.blockSize === 'compact' ? 6 : 10 }}>
                {[
                  { num: demoTime.hours, label: 'Horas' },
                  { num: demoTime.mins, label: 'Min' },
                  { num: demoTime.secs, label: 'Seg' },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span style={{ fontSize: 18, fontWeight: 900, opacity: 0.8, color: cfg.textColor }}>:</span>}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          background: cfg.template === 'cards' || cfg.template === 'classic' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.18)',
                          borderRadius: 8,
                          padding: cfg.blockSize === 'compact' ? '4px 8px' : cfg.blockSize === 'large' ? '8px 14px' : '6px 11px',
                          fontSize: cfg.blockSize === 'compact' ? 16 : cfg.blockSize === 'large' ? 24 : 20,
                          fontWeight: 900,
                          fontFamily: 'monospace',
                          color: cfg.textColor,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {item.num}
                      </div>
                      <span style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.8, marginTop: 3, fontWeight: 700, color: cfg.textColor }}>
                        {item.label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* CUPÓN / CTA PREVIEW */}
              {cfg.coupon && (
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px dashed rgba(255,255,255,0.6)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  color: cfg.textColor,
                }}>
                  🎟️ CUPÓN: {cfg.coupon} (Copiar)
                </div>
              )}

              {cfg.ctaText && (
                <div style={{
                  background: '#ffffff',
                  color: '#111827',
                  borderRadius: 999,
                  padding: '6px 16px',
                  fontSize: 12,
                  fontWeight: 800,
                  marginTop: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  {cfg.ctaText} →
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
              Creá un sentido de urgencia real. Podés configurarlo por minutos por sesión de usuario o una fecha límite global.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', 'General'],
                ['style', 'Diseño y Colores'],
                ['extra', 'Cupón & CTA'],
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

          {/* TAB GENERAL */}
          {tab === 'gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* TIPO DE CUENTA REGRESIVA */}
              <div>
                <FieldLabel>Tipo de cuenta regresiva</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'minutes', label: '⏱️ Minutos Fijos', desc: 'Inicia por sesión de cada visitante.' },
                    { id: 'date', label: '📅 Fecha Exacta', desc: 'Fecha y hora límite fija.' },
                    { id: 'daily', label: '🔄 Diario', desc: 'Se reinicia automáticamente cada día.' },
                  ].map((t) => {
                    const active = cfg.timerType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => set('timerType', t.id as any)}
                        style={{
                          padding: '12px 10px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          textAlign: 'center',
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DURACIÓN SEGÚN TIPO */}
              {cfg.timerType === 'minutes' && (
                <div>
                  <FieldLabel>Duración en minutos (por visita)</FieldLabel>
                  <TextInput
                    type="number"
                    value={String(cfg.durationMinutes)}
                    onChange={(v) => set('durationMinutes', parseInt(v, 10) || 10)}
                    placeholder="30"
                  />
                  <FieldHelper>Ej: 30 minutos. Al ingresar, el visitante verá la cuenta regresiva desde 30:00.</FieldHelper>
                </div>
              )}

              {cfg.timerType === 'date' && (
                <div>
                  <FieldLabel>Fecha y hora de finalización</FieldLabel>
                  <TextInput
                    type="datetime-local"
                    value={cfg.exactDate}
                    onChange={(v) => set('exactDate', v)}
                  />
                  <FieldHelper>Elegí hasta qué momento exacto estará activa la oferta.</FieldHelper>
                </div>
              )}

              {/* TÍTULO */}
              <div>
                <FieldLabel>Título del temporizador</FieldLabel>
                <TextInput
                  value={cfg.title}
                  onChange={(v) => set('title', v)}
                  placeholder="¡Oferta por tiempo limitado!"
                />
              </div>

              {/* UBICACIÓN */}
              <div>
                <FieldLabel>¿Dónde mostrarlo?</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'product_before', label: '⬆️ Arriba del botón Agregar al Carrito' },
                    { id: 'product_after', label: '⬇️ Abajo del botón Agregar al Carrito' },
                    { id: 'top_bar', label: '🔝 Barra Superior (Top Bar)' },
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

              {/* TAMAÑO DEL BLOQUE */}
              <div>
                <FieldLabel>Tamaño del bloque</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'compact', label: 'Compacto' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'large', label: 'Grande' },
                  ].map((sz) => {
                    const active = cfg.blockSize === sz.id;
                    return (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => set('blockSize', sz.id as any)}
                        style={{
                          padding: '10px', borderRadius: 8,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {sz.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Plantilla de diseño</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
                  {TEMPLATES_LIST.map((tpl) => {
                    const active = cfg.template === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => set('template', tpl.id)}
                        style={{
                          padding: '10px 6px', borderRadius: 8,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: active ? '#ecfdf5' : '#ffffff',
                          color: active ? '#059669' : '#000000',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {tpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PALETA DE COLORES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Color de Inicio / Fondo</FieldLabel>
                  <ColorPickerField value={cfg.gradStart} onChange={(v) => setCustomColor('gradStart', v)} />
                </div>
                {cfg.template === 'gradient' && (
                  <div>
                    <FieldLabel>Color Final (Degradado)</FieldLabel>
                    <ColorPickerField value={cfg.gradEnd} onChange={(v) => setCustomColor('gradEnd', v)} />
                  </div>
                )}
                <div>
                  <FieldLabel>Color de Texto y Números</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB CUPÓN Y CTA */}
          {tab === 'extra' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FieldLabel>Cupón de Descuento (Opcional)</FieldLabel>
                <TextInput
                  value={cfg.coupon}
                  onChange={(v) => set('coupon', v.toUpperCase())}
                  placeholder="Ej: OFERTA20"
                />
                <FieldHelper>Si ingresás un código, se mostrará un botón para que el cliente lo copie al tocarlo.</FieldHelper>
              </div>

              <div>
                <FieldLabel>Texto del Botón CTA (Opcional)</FieldLabel>
                <TextInput
                  value={cfg.ctaText}
                  onChange={(v) => set('ctaText', v)}
                  placeholder="Ej: Ver oferta especial"
                />
              </div>

              <div>
                <FieldLabel>URL del Botón CTA</FieldLabel>
                <TextInput
                  value={cfg.ctaUrl}
                  onChange={(v) => set('ctaUrl', v)}
                  placeholder="https://mitienda.com/ofertas"
                />
              </div>
            </div>
          )}

          {/* TAB FECHAS ESPECIALES */}
          {tab === 'dates' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Seleccionar Temporada / Evento</FieldLabel>
                <FieldHelper>
                  Elegí una campaña activa para vestir la cuenta regresiva con colores de conversión probados.
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
