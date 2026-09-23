'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS Y CONSTANTES (Regla #9)
═══════════════════════════════════════════ */
interface PromoConfig {
  tipo: string;
  formatoEtiqueta: string;
  subtitulo: string;
  badgeEnvioGratis: boolean;
  badgeMasVendido: boolean;
  badgePersonalizado: boolean;
  marcarPorDefecto: boolean;
  ocultarEsta: boolean;
}

interface BundlePromocionesConfig {
  titulo: string;
  textoBoton: string;
  promociones: string[];
  configPromos: Record<string, PromoConfig>;
  reemplazarBoton: boolean;
  colorBoton: string;
  botonDegradado: boolean;
  colorBoton2: string;
  colorPrecio: string;
  colorSubtitulos: string;
  fondoSubtitulo: string;
  colorBadgeEnvio: string;
  colorBadgePersonalizado: string;
  colorBadgeMasVendido: string;
  colorUnidadSeleccionada: string;
  bordeBoton: number;
  bordeUnidad: number;
  fuenteEtiqueta: number;
  fuentePrecio: number;
  fuenteSubtitulo: number;
  efectoBoton: 'sin-efecto' | 'zoom';
  pulsante: boolean;
  campaignTheme?: string;
  position?: string;
}

interface ExistingWidget {
  id: string;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface EditorProps {
  widgetDefinition: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string;
  };
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

const PROMOS_DISPONIBLES = ['2x1', '3x2', '4x3', '3x1', '4x2', '5x3'];

const DEFAULT_PROMO: PromoConfig = {
  tipo: '2x1',
  formatoEtiqueta: 'Lleva # paga #',
  subtitulo: 'Ahorro exclusivo',
  badgeEnvioGratis: false,
  badgeMasVendido: false,
  badgePersonalizado: false,
  marcarPorDefecto: false,
  ocultarEsta: false,
};

const DEFAULT_CONFIG: BundlePromocionesConfig = {
  titulo: '🎁 ¡Promociones Imperdibles de la Semana!',
  textoBoton: 'COMPRAR PROMO',
  promociones: ['2x1', '3x2'],
  configPromos: {
    '2x1': { ...DEFAULT_PROMO, tipo: '2x1', subtitulo: 'Pagas solo 1 unidad', marcarPorDefecto: true, badgeMasVendido: true },
    '3x2': { ...DEFAULT_PROMO, tipo: '3x2', subtitulo: 'Llevas 1 unidad GRATIS', badgeEnvioGratis: true },
  },
  reemplazarBoton: true,
  colorBoton: '#10B981',
  botonDegradado: true,
  colorBoton2: '#059669',
  colorPrecio: '#111827',
  colorSubtitulos: '#047857',
  fondoSubtitulo: '#ecfdf5',
  colorBadgeEnvio: '#10B981',
  colorBadgePersonalizado: '#F59E0B',
  colorBadgeMasVendido: '#EF4444',
  colorUnidadSeleccionada: '#10B981',
  bordeBoton: 10,
  bordeUnidad: 12,
  fuenteEtiqueta: 16,
  fuentePrecio: 18,
  fuenteSubtitulo: 13,
  efectoBoton: 'zoom',
  pulsante: true,
  campaignTheme: 'none',
  position: 'above_buy',
};

const THEMES: Record<string, { themeColor: string; accentColor: string; textColor: string; badgeBg: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', textColor: '#ffffff', badgeBg: '#F59E0B' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', textColor: '#ffffff', badgeBg: '#EF4444' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', textColor: '#ffffff', badgeBg: '#3B82F6' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', textColor: '#ffffff', badgeBg: '#EF4444' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', textColor: '#ffffff', badgeBg: '#F43F5E' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', textColor: '#ffffff', badgeBg: '#10B981' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', textColor: '#ffffff', badgeBg: '#FBBF24' },
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Colores oscuros y dorados.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo espacial y azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino con acento rojo.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso y rojo pasión.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día del Padre / Madre', emoji: '🎁', desc: 'Azul con acento verde alegre.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí de urgencia extrema.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

/* ═══════════════════════════════════════════
   HELPERS GLOBALES (Regla #9)
═══════════════════════════════════════════ */
function parseRatio(tipo: string) {
  const parts = tipo.split('x');
  return {
    lleva: Number(parts[0]) || 1,
    paga: Number(parts[1]) || 1,
  };
}

function formatPromoLabel(formato: string, tipo: string) {
  const ratio = parseRatio(tipo);
  return formato.replace(/#/g, (_, offset) => {
    return offset === 0 ? String(ratio.lleva) : String(ratio.paga);
  });
}

function formatMoney(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-AR');
}

/* ═══════════════════════════════════════════
   VISTA PREVIA INTEGRADA PREMIUM
═══════════════════════════════════════════ */
function BundlePromocionesPreview({ config, precioProducto = 25000 }: { config: BundlePromocionesConfig; precioProducto?: number }) {
  const [selected, setSelected] = useState<string>(() => {
    const key = Object.keys(config.configPromos).find((k) => config.configPromos[k]?.marcarPorDefecto);
    return key || config.promociones[0] || '2x1';
  });

  useEffect(() => {
    const key = Object.keys(config.configPromos).find((k) => config.configPromos[k]?.marcarPorDefecto);
    if (key) setSelected(key);
  }, [config.configPromos]);

  const currentCampaign = config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const colorBoton = activeTheme ? activeTheme.accentColor : config.colorBoton;
  const colorUnidadSeleccionada = activeTheme ? activeTheme.accentColor : config.colorUnidadSeleccionada;
  const colorPrecio = activeTheme ? activeTheme.themeColor : config.colorPrecio;

  const bgBoton = config.botonDegradado && !activeTheme
    ? `linear-gradient(90deg, ${config.colorBoton}, ${config.colorBoton2})`
    : colorBoton;

  return (
    <div style={{
      border: '1.5px solid #e5e7eb',
      borderRadius: 16,
      padding: 16,
      background: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    }}>
      {config.titulo && (
        <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 12, textAlign: 'center' }}>
          {config.titulo}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {config.promociones.map((p) => {
          const pc = config.configPromos[p] || DEFAULT_PROMO;
          if (pc.ocultarEsta) return null;

          const isSelected = selected === p;
          const ratio = parseRatio(p);
          const totalOriginal = precioProducto * ratio.lleva;
          const totalPromo = precioProducto * ratio.paga;

          return (
            <div
              key={p}
              onClick={() => setSelected(p)}
              style={{
                border: `2px solid ${isSelected ? colorUnidadSeleccionada : '#e5e7eb'}`,
                borderRadius: config.bordeUnidad,
                padding: '12px 14px',
                background: isSelected ? '#f0fdf4' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2.5px solid ${isSelected ? colorUnidadSeleccionada : '#d1d5db'}`,
                    background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: colorUnidadSeleccionada }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: config.fuenteEtiqueta, fontWeight: 800, color: '#111827' }}>
                      Lleva {ratio.lleva} paga {ratio.paga}
                    </div>
                    {pc.subtitulo && (
                      <span style={{
                        fontSize: config.fuenteSubtitulo,
                        color: config.colorSubtitulos,
                        background: config.fondoSubtitulo || '#ecfdf5',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: 700,
                        display: 'inline-block',
                        marginTop: 4
                      }}>
                        {pc.subtitulo}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', textDecoration: 'line-through' }}>
                    {formatMoney(totalOriginal)}
                  </div>
                  <div style={{ fontSize: config.fuentePrecio, fontWeight: 900, color: colorPrecio }}>
                    {formatMoney(totalPromo)}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                {pc.badgeEnvioGratis && <span style={{ fontSize: 9, fontWeight: 900, background: config.colorBadgeEnvio, color: '#fff', padding: '2px 6px', borderRadius: 4 }}>ENVÍO GRATIS</span>}
                {pc.badgeMasVendido && <span style={{ fontSize: 9, fontWeight: 900, background: config.colorBadgeMasVendido, color: '#fff', padding: '2px 6px', borderRadius: 4 }}>MÁS VENDIDO</span>}
                {pc.badgePersonalizado && <span style={{ fontSize: 9, fontWeight: 900, background: config.colorBadgePersonalizado, color: '#fff', padding: '2px 6px', borderRadius: 4 }}>PROMO</span>}
              </div>
            </div>
          );
        })}
      </div>

      <button style={{
        width: '100%',
        padding: '12px',
        background: bgBoton,
        color: '#FFFFFF',
        fontWeight: 800,
        fontSize: 15,
        border: 'none',
        borderRadius: config.bordeBoton,
        marginTop: 14,
        cursor: 'pointer'
      }}>
        {config.textoBoton || 'COMPRAR PROMO'}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTES AUXILIARES DEL EDITOR
═══════════════════════════════════════════ */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>{children}</div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string | number;
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
        padding: '10px 12px',
        border: '1.5px solid #E5E7EB',
        borderRadius: 8,
        fontSize: 14,
        color: '#111827',
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: '1.5px solid #E5E7EB',
        borderRadius: 8,
        fontSize: 14,
        color: '#111827',
        background: '#FFFFFF',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
    >
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
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
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 6,
        border: '1px solid #E5E7EB',
        background: value,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: '8px 10px',
          border: '1.5px solid #E5E7EB',
          borderRadius: 6,
          fontSize: 13,
          fontFamily: 'monospace'
        }}
      />
    </div>
  );
}

function CheckboxSimple({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: '#10B981', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{label}</span>
    </label>
  );
}

function ToggleField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 38,
          height: 22,
          borderRadius: 999,
          background: checked ? '#10B981' : '#D1D5DB',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#FFFFFF',
          position: 'absolute',
          top: 3,
          left: checked ? 19 : 3,
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ fontSize: 14, color: '#111827', fontWeight: 600 }}>{label}</span>
    </label>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BundlePromocionesEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BundlePromocionesConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...(existingWidget?.config || {}),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [activeTab, setActiveTab] = useState<'general' | 'promociones' | 'estilos' | 'fechas'>('general');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isForAll = targetType === 'all';

  const update = <K extends keyof BundlePromocionesConfig>(key: K, value: BundlePromocionesConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const togglePromo = (promo: string) => {
    let nextPromos = [...config.promociones];
    const nextConfig = { ...config.configPromos };

    if (nextPromos.includes(promo)) {
      if (nextPromos.length <= 1) return; // Al menos una promo activa
      nextPromos = nextPromos.filter((p) => p !== promo);
      delete nextConfig[promo];
    } else {
      nextPromos.push(promo);
      nextConfig[promo] = { ...DEFAULT_PROMO, tipo: promo };
    }

    setConfig((prev) => ({
      ...prev,
      promociones: nextPromos,
      configPromos: nextConfig,
    }));
  };

  const updatePromoConfig = (promo: string, key: keyof PromoConfig, value: any) => {
    const nextConfig = { ...config.configPromos };
    nextConfig[promo] = { ...nextConfig[promo], [key]: value };

    if (key === 'marcarPorDefecto' && value === true) {
      Object.keys(nextConfig).forEach((k) => {
        if (k !== promo) nextConfig[k].marcarPorDefecto = false;
      });
    }

    update('configPromos', nextConfig);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
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
      router.push('/widgets');
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Selector de posición estrella v12 */}
      <div style={{
        background: '#f0fdf4',
        borderLeft: '4px solid #10B981',
        borderRadius: 12,
        padding: 18,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📍 Ubicación del Widget</span>
            <span style={{
              background: '#10B981',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 900,
              padding: '3px 8px',
              borderRadius: 999,
              letterSpacing: '0.05em'
            }}>
              ¡NUEVO!
            </span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#065f46', marginTop: 0, marginBottom: 12, lineHeight: 1.4 }}>
          Elegí la posición de inserción del bloque de promociones. Nevux se integrará con tu plantilla de forma inteligente.
        </p>
        <select
          value={config.position || 'above_buy'}
          onChange={(e) => update('position', e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 14, fontWeight: 600,
            border: '1.5px solid #10B981', borderRadius: 8, outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="below_image">🖼️ Abajo de la foto del producto</option>
          <option value="above_price">💵 Arriba del precio</option>
          <option value="below_price">💵 Abajo del precio</option>
          <option value="above_buy">🛒 Arriba del botón de agregar al carrito (Recomendado)</option>
          <option value="below_buy">🛒 Abajo del botón de agregar al carrito</option>
        </select>
      </div>

      <div>
        <FieldLabel>Título del Bloque</FieldLabel>
        <TextInput value={config.titulo} onChange={(v) => update('titulo', v)} placeholder="Ej: Promociones exclusivas" />
      </div>

      <div>
        <FieldLabel>Texto del Botón</FieldLabel>
        <TextInput value={config.textoBoton} onChange={(v) => update('textoBoton', v)} placeholder="Ej: COMPRAR PROMO" />
      </div>

      <div>
        <FieldLabel>Promociones Habilitadas</FieldLabel>
        <FieldHelper>Elegí qué estructuras de promociones querés ofrecer en la tarjeta.</FieldHelper>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {PROMOS_DISPONIBLES.map((p) => {
            const active = config.promociones.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePromo(p)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  border: active ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
                  background: active ? '#f0fdf4' : '#fff',
                  color: active ? '#10B981' : '#4b5563',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: '#f9fafb', borderRadius: 10, padding: 12 }}>
        <CheckboxSimple
          checked={config.reemplazarBoton}
          onChange={(v) => update('reemplazarBoton', v)}
          label="Ocultar/Reemplazar botón de compra nativo"
        />
        <FieldHelper>Recomendado: Evita confusiones ocultando el botón clásico para usar el de Nevux.</FieldHelper>
      </div>
    </div>
  );

  /* ═══ TAB DETALLES PROMOS ═══ */
  const tabPromociones = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {config.promociones.map((p) => {
        const pc = config.configPromos[p] || DEFAULT_PROMO;
        return (
          <div key={p} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Configuración {p}</span>
              <CheckboxSimple checked={pc.marcarPorDefecto} onChange={(v) => updatePromoConfig(p, 'marcarPorDefecto', v)} label="Por defecto" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 10 }}>
              <div>
                <FieldLabel>Subtítulo / Promo</FieldLabel>
                <TextInput value={pc.subtitulo} onChange={(v) => updatePromoConfig(p, 'subtitulo', v)} placeholder="Ej: Lleva 1 gratis" />
              </div>
              <div>
                <FieldLabel>Etiqueta</FieldLabel>
                <SelectField value={pc.formatoEtiqueta} onChange={(v) => updatePromoConfig(p, 'formatoEtiqueta', v)} options={[
                  { value: 'Lleva # paga #', label: 'Lleva # paga #' },
                  { value: 'Promoción #x#', label: 'Promoción #x#' },
                ]} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1.5px dashed #f3f4f6', paddingTop: 10 }}>
              <CheckboxSimple checked={pc.badgeEnvioGratis} onChange={(v) => updatePromoConfig(p, 'badgeEnvioGratis', v)} label="Envío Gratis" />
              <CheckboxSimple checked={pc.badgeMasVendido} onChange={(v) => updatePromoConfig(p, 'badgeMasVendido', v)} label="Más Vendido" />
              <CheckboxSimple checked={pc.badgePersonalizado} onChange={(v) => updatePromoConfig(p, 'badgePersonalizado', v)} label="Especial" />
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
      }}>
        <div>
          <FieldLabel>Color Botón Principal</FieldLabel>
          <ColorPickerField value={config.colorBoton} onChange={(v) => update('colorBoton', v)} />
        </div>
        <div>
          <FieldLabel>Color Botón Degradado</FieldLabel>
          <ColorPickerField value={config.colorBoton2} onChange={(v) => update('colorBoton2', v)} />
          <div style={{ marginTop: 6 }}>
            <CheckboxSimple checked={config.botonDegradado} onChange={(v) => update('botonDegradado', v)} label="Habilitar Degradado" />
          </div>
        </div>
        <div>
          <FieldLabel>Color del Precio</FieldLabel>
          <ColorPickerField value={config.colorPrecio} onChange={(v) => update('colorPrecio', v)} />
        </div>
        <div>
          <FieldLabel>Color Borde Seleccionado</FieldLabel>
          <ColorPickerField value={config.colorUnidadSeleccionada} onChange={(v) => update('colorUnidadSeleccionada', v)} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div>
            <FieldLabel>Redondeado Botón (px)</FieldLabel>
            <input type="range" min="0" max="25" value={config.bordeBoton} onChange={(e) => update('bordeBoton', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Redondeado Tarjetas (px)</FieldLabel>
            <input type="range" min="0" max="25" value={config.bordeUnidad} onChange={(e) => update('bordeUnidad', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const tabFechasEspeciales = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
        Elegí un preset activo de temporada. Se aplicarán de forma instantánea colores festivos/comerciales optimizados para incentivar la compra impulsiva.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 22 }}>{preset.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {preset.label}
                  {isSelected && <span style={{ background: '#ecfdf5', color: '#10B981', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 999, border: '1px solid #10B981' }}>ACTIVO</span>}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{preset.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>
      {/* HEADER */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <NevuxLogo size="medium" />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7280' }}>Nevux Studio 🚀</span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>
        {/* Scope chip */}
        <div style={{
          background: '#10B981', color: '#ffffff',
          borderRadius: 999, padding: '6px 12px',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginBottom: 16, fontSize: 13, fontWeight: 700,
        }}>
          <IconStore />
          <span>{isForAll ? 'Aplicado a toda la tienda' : 'Configuración de Producto'}</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 16px', lineHeight: 1.2 }}>
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name}
        </h1>

        {/* CONTAINER EDITOR */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 18, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          {/* Live Preview Directo */}
          <div style={{ marginBottom: 20 }}>
            <BundlePromocionesPreview config={config} />
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
            {[
              { id: 'general', label: 'Config' },
              { id: 'promociones', label: 'Promos' },
              { id: 'estilos', label: 'Diseño' },
              { id: 'fechas', label: '🔥 Eventos' },
            ].map((t) => {
              const act = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    flex: 1, padding: '12px 6px', background: 'none', border: 'none',
                    borderBottom: act ? '2.5px solid #10B981' : '2.5px solid transparent',
                    color: act ? '#10B981' : '#4b5563',
                    fontSize: 14, fontWeight: act ? 800 : 500, cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* CONTENIDOS TABS */}
          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'promociones' && tabPromociones}
            {activeTab === 'estilos' && tabEstilos}
            {activeTab === 'fechas' && tabFechasEspeciales}
          </div>

          {/* FOOTER */}
          <div style={{
            marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
          }}>
            <ToggleField checked={isActive} onChange={setIsActive} label="Widget activo en tienda" />

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 24px', borderRadius: 999, border: 'none',
                background: '#10B981', color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? 'Guardando...' : existingWidget ? 'Guardar Cambios' : 'Crear Widget'}
            </button>
          </div>
        </div>

        <CentroAyuda />

        {error && (
          <div style={{
            position: 'fixed', bottom: 20, left: 16, right: 16, maxWidth: 500, margin: '0 auto',
            background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, border: '1px solid #fecaca', zIndex: 100
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
     }
