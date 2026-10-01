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

interface UrgenciaStockEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

interface Cfg {
  thresholdHigh: number;
  thresholdLow: number;
  textMedium: string;
  textHigh: string;
  location: 'price_before' | 'price_after' | 'product_before' | 'product_after';
  template: 'custom' | 'urgent' | 'elegant' | 'neon' | 'flash' | 'premium';
  bgColor: string;
  textColor: string;
  borderColor: string;
  fontSize: string;
  icon: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: Cfg = {
  thresholdHigh: 10,
  thresholdLow: 3,
  textMedium: 'Quedan pocas unidades: {stock} disponibles',
  textHigh: '¡Últimas {stock} unidades!',
  location: 'product_before',
  template: 'custom',
  bgColor: '#fef3c7',
  textColor: '#92400e',
  borderColor: '#fcd34d',
  fontSize: '14px',
  icon: '⚠️',
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
  value, onChange, placeholder, maxLength, type = 'text', min,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; type?: string; min?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
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
    thresholdHigh: typeof raw.thresholdHigh === 'number' ? raw.thresholdHigh : DEF.thresholdHigh,
    thresholdLow: typeof raw.thresholdLow === 'number' ? raw.thresholdLow : DEF.thresholdLow,
    textMedium: (raw.textMedium as string) || DEF.textMedium,
    textHigh: (raw.textHigh as string) || DEF.textHigh,
    location: (raw.location as Cfg['location']) || DEF.location,
    template: (raw.template as Cfg['template']) || DEF.template,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    borderColor: (raw.borderColor as string) || DEF.borderColor,
    fontSize: (raw.fontSize as string) || DEF.fontSize,
    icon: (raw.icon as string) || DEF.icon,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function UrgenciaStockEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: UrgenciaStockEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  // Stock de prueba para ver la reacción en tiempo real en la preview
  const [demoStock, setDemoStock] = useState<number>(3);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (key: 'bgColor' | 'textColor' | 'borderColor', val: string) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const applyTemplate = (tpl: Cfg['template']) => {
    const TEMPLATE_PRESETS: Record<Cfg['template'], { bg: string; tx: string; border: string; icon: string }> = {
      custom: { bg: '#fef3c7', tx: '#92400e', border: '#fcd34d', icon: '⚠️' },
      urgent: { bg: '#ef4444', tx: '#ffffff', border: 'transparent', icon: '🔥' },
      elegant: { bg: '#111827', tx: '#ffffff', border: '#374151', icon: '⚠️' },
      neon: { bg: '#090d16', tx: '#06b6d4', border: '#06b6d4', icon: '⚡' },
      flash: { bg: '#f97316', tx: '#ffffff', border: 'transparent', icon: '🔥' },
      premium: { bg: '#000000', tx: '#ffffff', border: '#10B981', icon: '💎' },
    };

    const p = TEMPLATE_PRESETS[tpl];
    setCfg((prev) => ({
      ...prev,
      template: tpl,
      bgColor: p.bg,
      textColor: p.tx,
      borderColor: p.border,
      icon: p.icon,
      campaignTheme: 'none',
    }));
  };

  const applyCampaignPreset = (slug: string) => {
    const CAMPAIGN_DATA: Record<string, { bg: string; tx: string; border: string }> = {
      'black-friday': { bg: '#111827', tx: '#F59E0B', border: '#F59E0B' },
      'hot-sale': { bg: '#0F172A', tx: '#ffffff', border: '#EF4444' },
      'cyber-monday': { bg: '#090D16', tx: '#ffffff', border: '#3B82F6' },
      'navidad': { bg: '#064E3B', tx: '#ffffff', border: '#EF4444' },
      'san-valentin': { bg: '#831843', tx: '#ffffff', border: '#F43F5E' },
      'dia-padre-madre': { bg: '#312E81', tx: '#ffffff', border: '#10B981' },
      'liquidacion': { bg: '#7F1D1D', tx: '#FBBF24', border: '#FBBF24' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        textColor: DEF.textColor,
        borderColor: DEF.borderColor,
      }));
    } else if (CAMPAIGN_DATA[slug]) {
      const p = CAMPAIGN_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        textColor: p.tx,
        borderColor: p.border,
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

  // Cálculo del texto a renderizar en la vista previa
  const getPreviewContent = () => {
    if (demoStock > cfg.thresholdHigh) {
      return {
        visible: false,
        text: 'Sin aviso (el stock actual supera el umbral alto)',
      };
    }
    const isHighUrgency = demoStock <= cfg.thresholdLow;
    const rawTemplate = isHighUrgency ? cfg.textHigh : cfg.textMedium;
    const processedText = rawTemplate.replace(/\{stock\}/g, String(demoStock));

    return {
      visible: true,
      text: processedText,
      isHighUrgency,
    };
  };

  const preview = getPreviewContent();

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Negro noche con acento dorado.' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Azul nocturno con borde rojo fuego.' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Cian cibernético de urgencia.' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con rojo festivo.' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso romántico.' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con verde alegre.' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí con amarillo urgencia.' },
  ];

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                VISTA PREVIA EN VIVO
              </div>

              {/* Selector de stock de prueba */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f3f4f6', padding: '4px 10px', borderRadius: 999 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4b5563' }}>Probar con stock:</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={demoStock}
                  onChange={(e) => setDemoStock(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: 44, padding: '2px 4px', fontSize: 13, fontWeight: 800,
                    border: '1px solid #d1d5db', borderRadius: 6, textAlign: 'center',
                    background: '#ffffff', outline: 'none',
                  }}
                />
              </div>
            </div>

            {preview.visible ? (
              <div
                style={{
                  background: cfg.bgColor,
                  border: cfg.borderColor && cfg.borderColor !== 'transparent' ? `1.5px solid ${cfg.borderColor}` : 'none',
                  borderRadius: 12,
                  padding: '14px 18px',
                  color: cfg.textColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  boxSizing: 'border-box',
                  width: '100%',
                  fontSize: cfg.fontSize,
                  fontWeight: 800,
                  textAlign: 'center',
                  transition: 'all 0.25s ease',
                }}
              >
                {cfg.icon && cfg.icon !== 'none' && (
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{cfg.icon}</span>
                )}
                <span>{preview.text}</span>
              </div>
            ) : (
              <div style={{
                background: '#f3f4f6', border: '1.5px dashed #d1d5db', borderRadius: 12,
                padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: 13, fontWeight: 600,
              }}>
                ℹ️ El aviso permanece oculto porque el stock actual ({demoStock}) es mayor al umbral alto ({cfg.thresholdHigh}).
              </div>
            )}
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
              Aumentá la conversión mostrando mensajes dinámicos cuando queden pocas unidades en stock. El sistema lee el stock real de Tiendanube.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', 'Umbrales & Mensajes'],
                ['style', 'Diseño & Ubicación'],
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

          {/* TAB UMBRALES & MENSAJES */}
          {tab === 'gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* UMBRALES DE STOCK */}
              <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#000000', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🎚️</span> UMBRALES DE ACTIVACIÓN
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <div>
                    <FieldLabel>Umbral Alto (Inicio de aviso)</FieldLabel>
                    <TextInput
                      type="number"
                      value={String(cfg.thresholdHigh)}
                      onChange={(v) => set('thresholdHigh', parseInt(v, 10) || 10)}
                      placeholder="10"
                    />
                    <FieldHelper>Sobre este número de stock no se muestra ningún aviso.</FieldHelper>
                  </div>

                  <div>
                    <FieldLabel>Umbral Bajo (Urgencia máxima)</FieldLabel>
                    <TextInput
                      type="number"
                      value={String(cfg.thresholdLow)}
                      onChange={(v) => set('thresholdLow', parseInt(v, 10) || 3)}
                      placeholder="3"
                    />
                    <FieldHelper>Con este stock o menos se activa el mensaje de urgencia alta.</FieldHelper>
                  </div>
                </div>
              </div>

              {/* MENSAJES PERSONALIZADOS */}
              <div>
                <FieldLabel>Alerta Media (Stock entre umbral bajo y alto)</FieldLabel>
                <TextInput
                  value={cfg.textMedium}
                  onChange={(v) => set('textMedium', v)}
                  placeholder="Quedan pocas unidades: {stock} disponibles"
                />
                <FieldHelper>Usá <strong>{"{stock}"}</strong> para insertar el número real de unidades restantes.</FieldHelper>
              </div>

              <div>
                <FieldLabel>Urgencia Alta (Stock ≤ Umbral bajo)</FieldLabel>
                <TextInput
                  value={cfg.textHigh}
                  onChange={(v) => set('textHigh', v)}
                  placeholder="¡Últimas {stock} unidades!"
                />
                <FieldHelper>Usá <strong>{"{stock}"}</strong> para mostrar el número de stock en urgencia crítica.</FieldHelper>
              </div>

            </div>
          )}

          {/* TAB DISEÑO & UBICACIÓN */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* PLANTILLAS LISTAS */}
              <div>
                <FieldLabel>Plantillas visuales predefinidas</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8 }}>
                  {[
                    { id: 'custom', label: 'Personalizado', bg: '#fef3c7', tx: '#92400e', border: '#fcd34d' },
                    { id: 'urgent', label: 'Urgente', bg: '#ef4444', tx: '#ffffff', border: 'transparent' },
                    { id: 'elegant', label: 'Elegante', bg: '#111827', tx: '#ffffff', border: '#374151' },
                    { id: 'neon', label: 'Neón', bg: '#090d16', tx: '#06b6d4', border: '#06b6d4' },
                    { id: 'flash', label: 'Flash', bg: '#f97316', tx: '#ffffff', border: 'transparent' },
                    { id: 'premium', label: 'Premium', bg: '#000000', tx: '#ffffff', border: '#10B981' },
                  ].map((tpl) => {
                    const active = cfg.template === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => applyTemplate(tpl.id as any)}
                        style={{
                          padding: '12px 8px', borderRadius: 10,
                          border: active ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: tpl.bg,
                          color: tpl.tx,
                          fontSize: 12, fontWeight: 800, cursor: 'pointer',
                          textAlign: 'center', boxShadow: active ? '0 2px 8px rgba(16,185,129,0.25)' : 'none',
                        }}
                      >
                        {tpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLORES LIBRES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Color de Fondo</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Texto</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Borde</FieldLabel>
                  <ColorPickerField value={cfg.borderColor} onChange={(v) => setCustomColor('borderColor', v)} />
                </div>
              </div>

              {/* ÍCONO Y TAMAÑO */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Ícono del cartel</FieldLabel>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['⚠️', '🔥', '⚡', '💎', '📦', '🔔', 'none'].map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => set('icon', ic)}
                        style={{
                          width: 38, height: 38, borderRadius: 8,
                          border: cfg.icon === ic ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: cfg.icon === ic ? '#ecfdf5' : '#ffffff',
                          cursor: 'pointer', fontSize: 16,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {ic === 'none' ? '🚫' : ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel>Tamaño de fuente</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {['13px', '14px', '15px'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => set('fontSize', sz)}
                        style={{
                          padding: '8px', borderRadius: 8,
                          border: cfg.fontSize === sz ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: cfg.fontSize === sz ? '#ecfdf5' : '#ffffff',
                          color: cfg.fontSize === sz ? '#059669' : '#000000',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* UBICACIÓN */}
              <div>
                <FieldLabel>¿Dónde mostrarlo en la Ficha de Producto?</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'price_before', label: '⬆️ Arriba del Precio' },
                    { id: 'price_after', label: '⬇️ Abajo del Precio' },
                    { id: 'product_before', label: '⬆️ Arriba del Botón de Compra' },
                    { id: 'product_after', label: '⬇️ Abajo del Botón de Compra' },
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
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          textAlign: 'center', lineHeight: 1.3,
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
                  Elegí una campaña activa para vestir la urgencia de stock con colores festivos de alto impacto.
                </FieldHelper>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CAMPAIGN_PRESETS.map((preset) => {
                  const isSelected = cfg.campaignTheme === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => applyCampaignPreset(preset.id)}
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
