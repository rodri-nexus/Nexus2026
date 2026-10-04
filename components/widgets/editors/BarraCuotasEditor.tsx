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

interface BarraCuotasEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

export interface CfgCuotas {
  cuotas: number;
  minAmount: number;
  msgDefault: string;
  msgCalculated: string;
  template: 'moderna' | 'oscura' | 'flotante' | 'neon' | 'bold' | 'minimal';
  size: 'small' | 'normal' | 'large';
  desktopPos: 'top' | 'bottom';
  iconType: 'fontawesome' | 'emoji';
  emojiIcon: string;
  mobilePos: 'same' | 'top' | 'bottom' | 'hide';
  stickyGlobal: boolean;
  inCartDrawer: boolean;
  inProductBanner: boolean;
  bgColor: string;
  accentColor: string;
  textColor: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const DEF: CfgCuotas = {
  cuotas: 3,
  minAmount: 0,
  msgDefault: '¡Hasta {{cuotas}} cuotas sin interés en toda la tienda! 🎉',
  msgCalculated: 'Pagá en {{cuotas}} cuotas sin interés de {{monto_cuota}}',
  template: 'moderna',
  size: 'normal',
  desktopPos: 'top',
  iconType: 'emoji',
  emojiIcon: '💳',
  mobilePos: 'same',
  stickyGlobal: true,
  inCartDrawer: false,
  inProductBanner: true,
  bgColor: '#111827',
  accentColor: '#10B981',
  textColor: '#ffffff',
  campaignTheme: 'none',
};

/* ═══════════════════════════════════════════
   COMPONENTES AUXILIARES
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

const IconCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
      {children}
    </p>
  );
}

function TextInput({
  value, onChange, placeholder, type = 'text', min,
}: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; min?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 14,
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
          width: 38, height: 38, borderRadius: 8,
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
          padding: '9px 10px', fontSize: 13,
          border: '1.5px solid #e5e7eb', borderRadius: 8,
          background: '#ffffff', color: '#000000', outline: 'none',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleSwitch({
  checked, onChange,
}: {
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 48, height: 26, borderRadius: 999,
        background: checked ? '#10B981' : '#e5e7eb',
        border: 'none', cursor: 'pointer', padding: 3,
        display: 'flex', alignItems: 'center',
        transition: 'background-color 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20, height: 20, borderRadius: '50%',
          background: '#ffffff',
          transform: checked ? 'translateX(22px)' : 'translateX(0px)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function parseCfg(raw: Record<string, unknown> | undefined): CfgCuotas {
  if (!raw) return { ...DEF };
  return {
    cuotas: typeof raw.cuotas === 'number' ? raw.cuotas : DEF.cuotas,
    minAmount: typeof raw.minAmount === 'number' ? raw.minAmount : DEF.minAmount,
    msgDefault: (raw.msgDefault as string) || DEF.msgDefault,
    msgCalculated: (raw.msgCalculated as string) || DEF.msgCalculated,
    template: (raw.template as CfgCuotas['template']) || DEF.template,
    size: (raw.size as CfgCuotas['size']) || DEF.size,
    desktopPos: (raw.desktopPos as CfgCuotas['desktopPos']) || DEF.desktopPos,
    iconType: (raw.iconType as CfgCuotas['iconType']) || DEF.iconType,
    emojiIcon: (raw.emojiIcon as string) || DEF.emojiIcon,
    mobilePos: (raw.mobilePos as CfgCuotas['mobilePos']) || DEF.mobilePos,
    stickyGlobal: typeof raw.stickyGlobal === 'boolean' ? raw.stickyGlobal : DEF.stickyGlobal,
    inCartDrawer: typeof raw.inCartDrawer === 'boolean' ? raw.inCartDrawer : DEF.inCartDrawer,
    inProductBanner: typeof raw.inProductBanner === 'boolean' ? raw.inProductBanner : DEF.inProductBanner,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    campaignTheme: (raw.campaignTheme as string) || 'none',
  };
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function BarraCuotasEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: BarraCuotasEditorProps) {
  const router = useRouter();

  const [cfg, setCfg] = useState<CfgCuotas>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<'gen' | 'style' | 'dates'>('gen');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  // Demo simulación de producto / carrito
  const [demoPrice, setDemoCart] = useState(35000);

  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  useEffect(() => {
    setOk(false);
    setErr('');
  }, [cfg]);

  const set = <K extends keyof CfgCuotas>(k: K, v: CfgCuotas[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const setCustomColor = (key: 'bgColor' | 'accentColor' | 'textColor', val: string) => {
    setCfg((prev) => ({
      ...prev,
      [key]: val,
      campaignTheme: 'none',
    }));
  };

  const applyPreset = (slug: string) => {
    const PRESETS_DATA: Record<string, { bg: string; acc: string; tx: string }> = {
      'black-friday': { bg: '#111827', acc: '#F59E0B', tx: '#ffffff' },
      'hot-sale': { bg: '#0F172A', acc: '#EF4444', tx: '#ffffff' },
      'cyber-monday': { bg: '#090D16', acc: '#3B82F6', tx: '#ffffff' },
      'navidad': { bg: '#064E3B', acc: '#EF4444', tx: '#ffffff' },
      'san-valentin': { bg: '#831843', acc: '#F43F5E', tx: '#ffffff' },
      'dia-padre-madre': { bg: '#312E81', acc: '#10B981', tx: '#ffffff' },
      'liquidacion': { bg: '#7F1D1D', acc: '#FBBF24', tx: '#ffffff' },
    };

    if (slug === 'none') {
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: DEF.bgColor,
        accentColor: DEF.accentColor,
        textColor: DEF.textColor,
      }));
    } else if (PRESETS_DATA[slug]) {
      const p = PRESETS_DATA[slug];
      setCfg((prev) => ({
        ...prev,
        campaignTheme: slug,
        bgColor: p.bg,
        accentColor: p.acc,
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

  const formatMoney = (val: number) => '$' + Math.round(val).toLocaleString('es-AR');

  const getDisplayMessage = () => {
    const numCuotas = cfg.cuotas || 1;
    if (demoPrice > 0) {
      const montoCuota = demoPrice / numCuotas;
      return cfg.msgCalculated
        .replace(/\{\{cuotas\}\}/g, numCuotas.toString())
        .replace(/\{\{monto_cuota\}\}/g, formatMoney(montoCuota));
    }
    return cfg.msgDefault.replace(/\{\{cuotas\}\}/g, numCuotas.toString());
  };

  const CAMPAIGN_PRESETS = [
    { id: 'none', label: 'Diseño Normal / Personalizado', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
    { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Fondo oscuro con resaltado dorado.' },
    { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Degradado nocturno a rojo fuego.' },
    { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Azul cibernético profundo.' },
    { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con rojo navideño.' },
    { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión.' },
    { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con verde esmeralda.' },
    { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí con amarillo urgencia.' },
  ];

  const TEMPLATES: { id: CfgCuotas['template']; label: string; desc: string }[] = [
    { id: 'moderna', label: 'Moderna', desc: 'Bordes redondeados con sombra elegante' },
    { id: 'oscura', label: 'Oscura', desc: 'Fondo negro profundo hiper-contrastado' },
    { id: 'flotante', label: 'Flotante', desc: 'Efecto cápsula con margen lateral' },
    { id: 'neon', label: 'Neón', desc: 'Borde brillante e ícono iluminado' },
    { id: 'bold', label: 'Bold', desc: 'Texto destacado en negrita' },
    { id: 'minimal', label: 'Minimal', desc: 'Sutil y ultra limpio' },
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

        {/* Contenedor Principal */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>

          {/* PREVIEW GRANDE EN VIVO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                VISTA PREVIA EN VIVO
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4b5563' }}>
                <span>Probá con un precio:</span>
                <button
                  type="button"
                  onClick={() => setDemoCart(0)}
                  style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid #d1d5db', background: demoPrice === 0 ? '#10B981' : '#ffffff', color: demoPrice === 0 ? '#fff' : '#000', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  $0
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCart(35000)}
                  style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid #d1d5db', background: demoPrice === 35000 ? '#10B981' : '#ffffff', color: demoPrice === 35000 ? '#fff' : '#000', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  $35.000
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCart(90000)}
                  style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid #d1d5db', background: demoPrice === 90000 ? '#10B981' : '#ffffff', color: demoPrice === 90000 ? '#fff' : '#000', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  $90.000
                </button>
              </div>
            </div>

            {/* BARRA DE PREVIEW */}
            <div
              style={{
                background: cfg.template === 'oscura' ? '#000000' : cfg.template === 'neon' ? '#090D16' : cfg.bgColor,
                color: cfg.textColor,
                borderRadius: cfg.template === 'flotante' ? 999 : cfg.template === 'moderna' ? 12 : 0,
                border: cfg.template === 'neon' ? `1.5px solid ${cfg.accentColor}` : 'none',
                boxShadow: cfg.template === 'neon' ? `0 0 12px ${cfg.accentColor}60` : '0 4px 12px rgba(0,0,0,0.08)',
                padding: cfg.size === 'small' ? '8px 14px' : cfg.size === 'large' ? '16px 22px' : '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                transition: 'all 0.3s ease',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Ícono */}
              <div style={{
                color: cfg.accentColor,
                fontSize: cfg.size === 'small' ? 16 : cfg.size === 'large' ? 24 : 20,
                display: 'flex', alignItems: 'center', flexShrink: 0,
              }}>
                {cfg.iconType === 'emoji' ? cfg.emojiIcon : <IconCard />}
              </div>

              {/* Mensaje principal */}
              <div style={{
                fontSize: cfg.size === 'small' ? 12 : cfg.size === 'large' ? 15 : 13.5,
                fontWeight: 800,
                lineHeight: 1.3,
                textAlign: 'center',
              }}>
                {getDisplayMessage()}
              </div>
            </div>
          </div>

          {/* Cartel Informativo Requerido */}
          <div style={{
            background: '#fff7ed', border: '1px solid #fdba74',
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 20, flexShrink: 0 }}>⚠️</div>
            <span style={{ fontSize: 13, color: '#9a3412', lineHeight: 1.5, fontWeight: 500 }}>
              <strong>Importante:</strong> esta barra es informativa. Las cuotas sin interés reales las definís en tu medio de pago (Mercado Pago, etc.). Asegurate de que los tramos de acá coincidan con lo que tenés configurado, para no prometerle al cliente algo que después no aparece en el checkout.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24, overflowX: 'auto',
          }}>
            {(
              [
                ['gen', 'Configuración'],
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

          {/* TAB CONFIGURACIÓN */}
          {tab === 'gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* PLANTILLA DE DISEÑO */}
              <div>
                <FieldLabel>Plantilla de diseño</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8 }}>
                  {TEMPLATES.map((tpl) => {
                    const active = cfg.template === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => set('template', tpl.id)}
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
                        <span>{tpl.label}</span>
                        <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>{tpl.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CUOTAS Y MONTO MÍNIMO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel required>Cantidad de Cuotas Sin Interés</FieldLabel>
                  <TextInput
                    type="number"
                    value={cfg.cuotas || ''}
                    onChange={(v) => set('cuotas', parseInt(v, 10) || 1)}
                    placeholder="3"
                  />
                  <FieldHelper>Ejemplo: 3, 6, 12, etc.</FieldHelper>
                </div>

                <div>
                  <FieldLabel>Monto Mínimo (Opcional)</FieldLabel>
                  <TextInput
                    type="number"
                    value={cfg.minAmount || ''}
                    onChange={(v) => set('minAmount', parseInt(v, 10) || 0)}
                    placeholder="0"
                  />
                  <FieldHelper>Si es mayor a $0, solo ofrecerá las cuotas si el precio supera este valor.</FieldHelper>
                </div>
              </div>

              {/* TAMAÑO Y POSICIÓN EN ESCRITORIO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Tamaño de la Barra</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 4 }}>
                    {[
                      { id: 'small', label: 'Pequeño' },
                      { id: 'normal', label: 'Normal' },
                      { id: 'large', label: 'Grande' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => set('size', sz.id as any)}
                        style={{
                          padding: '10px 4px', borderRadius: 8,
                          border: cfg.size === sz.id ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: cfg.size === sz.id ? '#ecfdf5' : '#ffffff',
                          color: cfg.size === sz.id ? '#059669' : '#000000',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel>Posición en Escritorio (Fija)</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
                    {[
                      { id: 'top', label: '⬆️ Arriba' },
                      { id: 'bottom', label: '⬇️ Abajo' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => set('desktopPos', pos.id as any)}
                        style={{
                          padding: '10px 4px', borderRadius: 8,
                          border: cfg.desktopPos === pos.id ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                          background: cfg.desktopPos === pos.id ? '#ecfdf5' : '#ffffff',
                          color: cfg.desktopPos === pos.id ? '#059669' : '#000000',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TIPO DE ÍCONO */}
              <div>
                <FieldLabel>Tipo de Ícono</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                  {[
                    { id: 'emoji', label: '💳 Emoji Personalizado', icon: '💳' },
                    { id: 'fontawesome', label: '💳 Vectorial Tarjeta', icon: '💳' },
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => set('iconType', ic.id as any)}
                      style={{
                        padding: '12px 10px', borderRadius: 10,
                        border: cfg.iconType === ic.id ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                        background: cfg.iconType === ic.id ? '#ecfdf5' : '#ffffff',
                        color: cfg.iconType === ic.id ? '#059669' : '#000000',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {ic.label}
                    </button>
                  ))}
                </div>

                {cfg.iconType === 'emoji' && (
                  <div style={{ marginTop: 10 }}>
                    <FieldLabel>Ingresá el Emoji deseado</FieldLabel>
                    <TextInput
                      value={cfg.emojiIcon}
                      onChange={(v) => set('emojiIcon', v)}
                      placeholder="💳"
                    />
                  </div>
                )}
              </div>

              {/* MENSAJES */}
              <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>💬 MENSAJES PERSONALIZADOS</div>

                <div>
                  <FieldLabel>Mensaje Default (General / Sin precio)</FieldLabel>
                  <TextInput
                    value={cfg.msgDefault}
                    onChange={(v) => set('msgDefault', v)}
                  />
                  <FieldHelper>Usá <strong>{"{{cuotas}}"}</strong> para insertar la cantidad de cuotas.</FieldHelper>
                </div>

                <div>
                  <FieldLabel>Mensaje Calculado (Con precio de producto)</FieldLabel>
                  <TextInput
                    value={cfg.msgCalculated}
                    onChange={(v) => set('msgCalculated', v)}
                  />
                  <FieldHelper>Usá <strong>{"{{cuotas}}"}</strong> y <strong>{"{{monto_cuota}}"}</strong> para la cuota exacta.</FieldHelper>
                </div>
              </div>

              {/* POSICIÓN EN CELULAR */}
              <div>
                <FieldLabel>📱 Posición en Celular</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 4 }}>
                  {[
                    { id: 'same', label: '= Igual escritorio' },
                    { id: 'top', label: '⬆️ Arriba' },
                    { id: 'bottom', label: '⬇️ Abajo' },
                    { id: 'hide', label: '🚫 Ocultar' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => set('mobilePos', m.id as any)}
                      style={{
                        padding: '10px 4px', borderRadius: 8,
                        border: cfg.mobilePos === m.id ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                        background: cfg.mobilePos === m.id ? '#ecfdf5' : '#ffffff',
                        color: cfg.mobilePos === m.id ? '#059669' : '#000000',
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* OPCIONES DE INTEGRACIÓN / SWITCHES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>💳 Barra fija sticky en toda la tienda</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Sigue al comprador (se apila automáticamente si está la de envío)</div>
                  </div>
                  <ToggleSwitch checked={cfg.stickyGlobal} onChange={(v) => set('stickyGlobal', v)} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>🛒 Barra dentro del cajón del carrito</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Muestra las cuotas dentro del carrito lateral</div>
                  </div>
                  <ToggleSwitch checked={cfg.inCartDrawer} onChange={(v) => set('inCartDrawer', v)} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000000' }}>🏷️ Banner en página de producto</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Aparece debajo del botón de compra de forma fluida</div>
                  </div>
                  <ToggleSwitch checked={cfg.inProductBanner} onChange={(v) => set('inProductBanner', v)} />
                </div>
              </div>

            </div>
          )}

          {/* TAB DISEÑO Y COLORES */}
          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <FieldLabel>Fondo de la Barra</FieldLabel>
                  <ColorPickerField value={cfg.bgColor} onChange={(v) => setCustomColor('bgColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Acento / Ícono</FieldLabel>
                  <ColorPickerField value={cfg.accentColor} onChange={(v) => setCustomColor('accentColor', v)} />
                </div>
                <div>
                  <FieldLabel>Color de Texto</FieldLabel>
                  <ColorPickerField value={cfg.textColor} onChange={(v) => setCustomColor('textColor', v)} />
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
                  Elegí una campaña activa para vestir la barra de cuotas con colores festivos.
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
