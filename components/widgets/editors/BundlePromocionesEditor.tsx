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
  textoBadgePersonalizado: string;
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
  colorFondoCard: string;
  colorFondoSeleccionado: string;
  bordeBoton: number;
  bordeUnidad: number;
  fuenteEtiqueta: number;
  fuentePrecio: number;
  fuenteSubtitulo: number;
  efectoBoton: 'sin-efecto' | 'zoom';
  pulsante: boolean;
  mostrarAhorroPorcentaje: boolean;
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
  textoBadgePersonalizado: 'PROMO',
  marcarPorDefecto: false,
  ocultarEsta: false,
};

const DEFAULT_CONFIG: BundlePromocionesConfig = {
  titulo: '⚡ Promos Imperdibles',
  textoBoton: 'Quiero esta promo',
  promociones: ['2x1', '3x2', '4x3'],
  configPromos: {
    '2x1': {
      ...DEFAULT_PROMO,
      tipo: '2x1',
      subtitulo: 'Pagas solo 1 · 50% OFF',
      marcarPorDefecto: false,
      badgeEnvioGratis: true,
    },
    '3x2': {
      ...DEFAULT_PROMO,
      tipo: '3x2',
      subtitulo: 'Llevás 1 GRATIS',
      marcarPorDefecto: true,
      badgeMasVendido: true,
      badgeEnvioGratis: true,
    },
    '4x3': {
      ...DEFAULT_PROMO,
      tipo: '4x3',
      subtitulo: 'Máximo ahorro del pack',
      badgePersonalizado: true,
      textoBadgePersonalizado: 'MEJOR PRECIO',
      badgeEnvioGratis: true,
    },
  },
  reemplazarBoton: false,
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
  colorFondoCard: '#ffffff',
  colorFondoSeleccionado: '#f0fdf4',
  bordeBoton: 14,
  bordeUnidad: 16,
  fuenteEtiqueta: 15,
  fuentePrecio: 20,
  fuenteSubtitulo: 12,
  efectoBoton: 'zoom',
  pulsante: true,
  mostrarAhorroPorcentaje: true,
  campaignTheme: 'none',
  position: 'above_buy',
};

const THEMES: Record<string, { themeColor: string; accentColor: string; textColor: string; softBg: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', textColor: '#ffffff', softBg: '#1f2937' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', textColor: '#ffffff', softBg: '#1e293b' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', textColor: '#ffffff', softBg: '#0f172a' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', textColor: '#ffffff', softBg: '#065f46' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', textColor: '#ffffff', softBg: '#9d174d' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', textColor: '#ffffff', softBg: '#3730a3' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', textColor: '#ffffff', softBg: '#991b1b' },
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
function IconStore({ color = '#ffffff' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M9 22V12h6v10" />
    </svg>
  );
}

function parseRatio(tipo: string) {
  const parts = tipo.split('x');
  return {
    lleva: Number(parts[0]) || 1,
    paga: Number(parts[1]) || 1,
  };
}

function formatMoney(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-AR');
}

function calcAhorroPct(lleva: number, paga: number): number {
  if (lleva <= 0) return 0;
  return Math.round(((lleva - paga) / lleva) * 100);
}

function buildEtiqueta(formato: string, lleva: number, paga: number): string {
  if (formato === 'Promoción #x#') return `Promoción ${lleva}x${paga}`;
  return `Lleva ${lleva} paga ${paga}`;
}

/* ═══════════════════════════════════════════
   VISTA PREVIA PREMIUM — OFERTA RELÁMPAGO
═══════════════════════════════════════════ */
function BundlePromocionesPreview({
  config,
  precioProducto = 25000,
}: {
  config: BundlePromocionesConfig;
  precioProducto?: number;
}) {
  const [selected, setSelected] = useState<string>(() => {
    const key = Object.keys(config.configPromos).find((k) => config.configPromos[k]?.marcarPorDefecto);
    return key || config.promociones[0] || '2x1';
  });

  useEffect(() => {
    const key = Object.keys(config.configPromos).find((k) => config.configPromos[k]?.marcarPorDefecto);
    if (key) setSelected(key);
  }, [config.configPromos]);

  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const accent = activeTheme ? activeTheme.accentColor : config.colorUnidadSeleccionada;
  const priceColor = activeTheme ? activeTheme.themeColor : config.colorPrecio;
  const cardBg = activeTheme ? activeTheme.softBg : config.colorFondoCard;
  const selectedBg = activeTheme ? activeTheme.themeColor : config.colorFondoSeleccionado;
  const titleColor = activeTheme ? activeTheme.textColor : '#111827';
  const mutedColor = activeTheme ? 'rgba(255,255,255,0.55)' : '#9ca3af';
  const subColor = activeTheme ? activeTheme.accentColor : config.colorSubtitulos;
  const subBg = activeTheme ? 'rgba(255,255,255,0.12)' : (config.fondoSubtitulo || '#ecfdf5');
  const shellBg = activeTheme
    ? `linear-gradient(160deg, ${activeTheme.themeColor} 0%, ${activeTheme.softBg} 100%)`
    : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)';

  const bgBoton = config.botonDegradado
    ? `linear-gradient(135deg, ${activeTheme ? activeTheme.accentColor : config.colorBoton} 0%, ${activeTheme ? activeTheme.accentColor : config.colorBoton2} 100%)`
    : (activeTheme ? activeTheme.accentColor : config.colorBoton);

  const visiblePromos = config.promociones.filter((p) => {
    const pc = config.configPromos[p];
    return !pc?.ocultarEsta;
  });

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: shellBg,
        border: activeTheme ? `1.5px solid ${activeTheme.accentColor}40` : '1.5px solid #e5e7eb',
        boxShadow: activeTheme
          ? `0 12px 40px ${activeTheme.accentColor}33`
          : '0 8px 28px rgba(16, 185, 129, 0.08), 0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Franja superior premium */}
      <div
        style={{
          height: 4,
          background: activeTheme
            ? `linear-gradient(90deg, ${activeTheme.accentColor}, ${activeTheme.themeColor}, ${activeTheme.accentColor})`
            : 'linear-gradient(90deg, #10B981, #34d399, #10B981)',
          backgroundSize: '200% 100%',
        }}
      />

      <div style={{ padding: '16px 14px 14px' }}>
        {/* Título */}
        {config.titulo && (
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: titleColor,
              marginBottom: 14,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            {config.titulo}
          </div>
        )}

        {/* Cards de promos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visiblePromos.map((p) => {
            const pc = config.configPromos[p] || { ...DEFAULT_PROMO, tipo: p };
            const isSelected = selected === p;
            const ratio = parseRatio(p);
            const totalOriginal = precioProducto * ratio.lleva;
            const totalPromo = precioProducto * ratio.paga;
            const ahorroPct = calcAhorroPct(ratio.lleva, ratio.paga);
            const etiqueta = buildEtiqueta(pc.formatoEtiqueta || 'Lleva # paga #', ratio.lleva, ratio.paga);

            const badges: { text: string; bg: string }[] = [];
            if (pc.badgeEnvioGratis) badges.push({ text: 'ENVÍO GRATIS', bg: activeTheme ? activeTheme.accentColor : config.colorBadgeEnvio });
            if (pc.badgeMasVendido) badges.push({ text: 'MÁS VENDIDO', bg: config.colorBadgeMasVendido });
            if (pc.badgePersonalizado) {
              badges.push({
                text: (pc.textoBadgePersonalizado || 'PROMO').toUpperCase(),
                bg: config.colorBadgePersonalizado,
              });
            }

            return (
              <div
                key={p}
                onClick={() => setSelected(p)}
                style={{
                  position: 'relative',
                  borderRadius: config.bordeUnidad,
                  padding: '14px 14px 12px',
                  cursor: 'pointer',
                  background: isSelected ? selectedBg : cardBg,
                  border: isSelected
                    ? `2.5px solid ${accent}`
                    : activeTheme
                      ? '1.5px solid rgba(255,255,255,0.12)'
                      : '1.5px solid #e5e7eb',
                  boxShadow: isSelected
                    ? `0 0 0 4px ${accent}22, 0 8px 24px ${accent}28`
                    : activeTheme
                      ? '0 2px 8px rgba(0,0,0,0.2)'
                      : '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.22s ease',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  overflow: 'hidden',
                }}
              >
                {/* Barra lateral de acento */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: `linear-gradient(180deg, ${accent}, ${activeTheme ? activeTheme.themeColor : '#059669'})`,
                      borderRadius: '4px 0 0 4px',
                    }}
                  />
                )}

                {/* Badges flotantes arriba a la derecha */}
                {badges.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -1,
                      right: 10,
                      display: 'flex',
                      gap: 4,
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      maxWidth: '70%',
                    }}
                  >
                    {badges.map((b) => (
                      <span
                        key={b.text}
                        style={{
                          fontSize: 9,
                          fontWeight: 900,
                          letterSpacing: '0.04em',
                          background: b.bg,
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '0 0 8px 8px',
                          boxShadow: `0 4px 10px ${b.bg}55`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {b.text}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginTop: badges.length > 0 ? 10 : 0,
                  }}
                >
                  {/* Izquierda: radio + textos */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0, flex: 1 }}>
                    {/* Radio premium */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: `2.5px solid ${isSelected ? accent : activeTheme ? 'rgba(255,255,255,0.35)' : '#d1d5db'}`,
                        background: isSelected ? accent : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                        boxShadow: isSelected ? `0 0 0 4px ${accent}30` : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: config.fuenteEtiqueta,
                          fontWeight: 900,
                          color: isSelected && activeTheme ? activeTheme.textColor : titleColor,
                          letterSpacing: '-0.01em',
                          lineHeight: 1.2,
                        }}
                      >
                        {etiqueta}
                      </div>

                      {pc.subtitulo && (
                        <div
                          style={{
                            marginTop: 5,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: config.fuenteSubtitulo,
                            fontWeight: 700,
                            color: subColor,
                            background: subBg,
                            padding: '3px 8px',
                            borderRadius: 999,
                            lineHeight: 1.2,
                          }}
                        >
                          {pc.subtitulo}
                        </div>
                      )}

                      {/* Pill % ahorro */}
                      {config.mostrarAhorroPorcentaje && ahorroPct > 0 && (
                        <div
                          style={{
                            marginTop: 6,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: 11,
                            fontWeight: 900,
                            color: activeTheme ? accent : '#059669',
                            letterSpacing: '0.02em',
                          }}
                        >
                          <span style={{ fontSize: 13 }}>↓</span>
                          Ahorrás {ahorroPct}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Derecha: precios */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: mutedColor,
                        textDecoration: 'line-through',
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      {formatMoney(totalOriginal)}
                    </div>
                    <div
                      style={{
                        fontSize: config.fuentePrecio,
                        fontWeight: 900,
                        color: isSelected ? accent : priceColor,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                      }}
                    >
                      {formatMoney(totalPromo)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA premium */}
        <button
          type="button"
          style={{
            width: '100%',
            marginTop: 14,
            padding: '14px 16px',
            background: bgBoton,
            color: '#ffffff',
            fontWeight: 900,
            fontSize: 15,
            border: 'none',
            borderRadius: config.bordeBoton,
            cursor: 'pointer',
            letterSpacing: '0.01em',
            boxShadow: `0 8px 20px ${accent}40`,
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'inherit',
          }}
        >
          {config.textoBoton || 'Quiero esta promo'}
        </button>

        <div
          style={{
            marginTop: 8,
            textAlign: 'center',
            fontSize: 11,
            color: mutedColor,
            fontWeight: 600,
          }}
        >
          Elegí tu promo y agregá al carrito desde el botón de la tienda
        </div>
      </div>
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
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 6,
          border: '1px solid #E5E7EB',
          background: value,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
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
          fontFamily: 'monospace',
          minWidth: 0,
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
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FFFFFF',
            position: 'absolute',
            top: 3,
            left: checked ? 19 : 3,
            transition: 'left 0.2s',
          }}
        />
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

  const [config, setConfig] = useState<BundlePromocionesConfig>(() => {
    const base = {
      ...DEFAULT_CONFIG,
      ...(existingWidget?.config || {}),
    };
    // Migración suave de configs viejas sin los nuevos campos
    if (!base.configPromos) base.configPromos = DEFAULT_CONFIG.configPromos;
    Object.keys(base.configPromos).forEach((k) => {
      base.configPromos[k] = {
        ...DEFAULT_PROMO,
        ...base.configPromos[k],
        textoBadgePersonalizado: base.configPromos[k]?.textoBadgePersonalizado || 'PROMO',
      };
    });
    if (typeof base.mostrarAhorroPorcentaje !== 'boolean') base.mostrarAhorroPorcentaje = true;
    if (!base.colorFondoCard) base.colorFondoCard = '#ffffff';
    if (!base.colorFondoSeleccionado) base.colorFondoSeleccionado = '#f0fdf4';
    return base;
  });

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
      if (nextPromos.length <= 1) return;
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
      <div
        style={{
          background: '#f0fdf4',
          borderLeft: '4px solid #10B981',
          borderRadius: 12,
          padding: 18,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📍 Ubicación del Widget</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#065f46', marginTop: 0, marginBottom: 12, lineHeight: 1.4 }}>
          Elegí dónde se inserta el bloque de promociones en la ficha de producto.
        </p>
        <select
          value={config.position || 'above_buy'}
          onChange={(e) => update('position', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: 14,
            fontWeight: 600,
            border: '1.5px solid #10B981',
            borderRadius: 8,
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          <option value="below_image">🖼️ Abajo de la foto del producto</option>
          <option value="above_price">💵 Arriba del precio</option>
          <option value="below_price">💵 Abajo del precio</option>
          <option value="above_buy">🛒 Arriba del botón de compra (Recomendado)</option>
          <option value="below_buy">🛒 Abajo del botón de compra</option>
        </select>
      </div>

      <div>
        <FieldLabel>Título del Bloque</FieldLabel>
        <TextInput value={config.titulo} onChange={(v) => update('titulo', v)} placeholder="Ej: ⚡ Promos Imperdibles" />
      </div>

      <div>
        <FieldLabel>Texto del Botón CTA</FieldLabel>
        <TextInput value={config.textoBoton} onChange={(v) => update('textoBoton', v)} placeholder="Ej: Quiero esta promo" />
        <FieldHelper>
          El botón es visual/informativo. El cliente elige la promo y compra con el botón nativo de la tienda (sin tocar el carrito por AJAX).
        </FieldHelper>
      </div>

      <div>
        <FieldLabel>Promociones Habilitadas</FieldLabel>
        <FieldHelper>Elegí qué combos 2x1 / 3x2 / etc. querés mostrar.</FieldHelper>
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
                  transition: 'all 0.15s',
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
          checked={config.mostrarAhorroPorcentaje}
          onChange={(v) => update('mostrarAhorroPorcentaje', v)}
          label="Mostrar % de ahorro en cada promo"
        />
        <FieldHelper>Calcula automáticamente cuánto ahorra el cliente (ej: 2x1 = 50% OFF).</FieldHelper>
      </div>
    </div>
  );

  /* ═══ TAB DETALLES PROMOS ═══ */
  const tabPromociones = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {config.promociones.map((p) => {
        const pc = config.configPromos[p] || { ...DEFAULT_PROMO, tipo: p };
        return (
          <div key={p} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Configuración {p}</span>
              <CheckboxSimple
                checked={!!pc.marcarPorDefecto}
                onChange={(v) => updatePromoConfig(p, 'marcarPorDefecto', v)}
                label="Seleccionada por defecto"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 10 }}>
              <div>
                <FieldLabel>Subtítulo / Promo</FieldLabel>
                <TextInput
                  value={pc.subtitulo || ''}
                  onChange={(v) => updatePromoConfig(p, 'subtitulo', v)}
                  placeholder="Ej: Llevás 1 GRATIS"
                />
              </div>
              <div>
                <FieldLabel>Formato de etiqueta</FieldLabel>
                <SelectField
                  value={pc.formatoEtiqueta || 'Lleva # paga #'}
                  onChange={(v) => updatePromoConfig(p, 'formatoEtiqueta', v)}
                  options={[
                    { value: 'Lleva # paga #', label: 'Lleva # paga #' },
                    { value: 'Promoción #x#', label: 'Promoción #x#' },
                  ]}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1.5px dashed #f3f4f6', paddingTop: 10 }}>
              <CheckboxSimple
                checked={!!pc.badgeEnvioGratis}
                onChange={(v) => updatePromoConfig(p, 'badgeEnvioGratis', v)}
                label="Envío Gratis"
              />
              <CheckboxSimple
                checked={!!pc.badgeMasVendido}
                onChange={(v) => updatePromoConfig(p, 'badgeMasVendido', v)}
                label="Más Vendido"
              />
              <CheckboxSimple
                checked={!!pc.badgePersonalizado}
                onChange={(v) => updatePromoConfig(p, 'badgePersonalizado', v)}
                label="Badge custom"
              />
            </div>

            {pc.badgePersonalizado && (
              <div style={{ marginTop: 10 }}>
                <FieldLabel>Texto del badge custom</FieldLabel>
                <TextInput
                  value={pc.textoBadgePersonalizado || 'PROMO'}
                  onChange={(v) => updatePromoConfig(p, 'textoBadgePersonalizado', v)}
                  placeholder="Ej: MEJOR PRECIO"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <div>
          <FieldLabel>Color Botón Principal</FieldLabel>
          <ColorPickerField value={config.colorBoton} onChange={(v) => update('colorBoton', v)} />
        </div>
        <div>
          <FieldLabel>Color Botón Degradado</FieldLabel>
          <ColorPickerField value={config.colorBoton2} onChange={(v) => update('colorBoton2', v)} />
          <div style={{ marginTop: 6 }}>
            <CheckboxSimple
              checked={config.botonDegradado}
              onChange={(v) => update('botonDegradado', v)}
              label="Habilitar Degradado"
            />
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
        <div>
          <FieldLabel>Fondo card normal</FieldLabel>
          <ColorPickerField value={config.colorFondoCard || '#ffffff'} onChange={(v) => update('colorFondoCard', v)} />
        </div>
        <div>
          <FieldLabel>Fondo card seleccionada</FieldLabel>
          <ColorPickerField value={config.colorFondoSeleccionado || '#f0fdf4'} onChange={(v) => update('colorFondoSeleccionado', v)} />
        </div>
        <div>
          <FieldLabel>Badge Envío Gratis</FieldLabel>
          <ColorPickerField value={config.colorBadgeEnvio} onChange={(v) => update('colorBadgeEnvio', v)} />
        </div>
        <div>
          <FieldLabel>Badge Más Vendido</FieldLabel>
          <ColorPickerField value={config.colorBadgeMasVendido} onChange={(v) => update('colorBadgeMasVendido', v)} />
        </div>
        <div>
          <FieldLabel>Badge Custom</FieldLabel>
          <ColorPickerField value={config.colorBadgePersonalizado} onChange={(v) => update('colorBadgePersonalizado', v)} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div>
            <FieldLabel>Redondeado Botón ({config.bordeBoton}px)</FieldLabel>
            <input
              type="range"
              min={0}
              max={28}
              value={config.bordeBoton}
              onChange={(e) => update('bordeBoton', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>
          <div>
            <FieldLabel>Redondeado Tarjetas ({config.bordeUnidad}px)</FieldLabel>
            <input
              type="range"
              min={0}
              max={28}
              value={config.bordeUnidad}
              onChange={(e) => update('bordeUnidad', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>
          <div>
            <FieldLabel>Tamaño etiqueta ({config.fuenteEtiqueta}px)</FieldLabel>
            <input
              type="range"
              min={12}
              max={20}
              value={config.fuenteEtiqueta}
              onChange={(e) => update('fuenteEtiqueta', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>
          <div>
            <FieldLabel>Tamaño precio ({config.fuentePrecio}px)</FieldLabel>
            <input
              type="range"
              min={14}
              max={28}
              value={config.fuentePrecio}
              onChange={(e) => update('fuentePrecio', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const tabFechasEspeciales = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
        Elegí un preset de temporada. Se aplican colores festivos de alto impacto sobre el diseño premium.
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {preset.label}
                  {isSelected && (
                    <span
                      style={{
                        background: '#ecfdf5',
                        color: '#10B981',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 999,
                        border: '1px solid #10B981',
                      }}
                    >
                      ACTIVO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{preset.desc}</div>
              </div>
              {preset.id !== 'none' && (
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: preset.themeColor, border: '1px solid #d1d5db' }} />
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: preset.accentColor, border: '1px solid #d1d5db' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>
      {/* HEADER */}
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
        <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7280' }}>Nevux Studio 🚀</span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>
        {/* Scope chip */}
        <div
          style={{
            background: '#10B981',
            color: '#ffffff',
            borderRadius: 999,
            padding: '6px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <IconStore color="#fff" />
          <span>{isForAll ? 'Aplicado a toda la tienda' : 'Configuración de Producto'}</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 16px', lineHeight: 1.2 }}>
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name}
        </h1>

        {/* CONTAINER EDITOR */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 18,
            marginBottom: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* Live Preview */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Vista previa en vivo
            </div>
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
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    flex: 1,
                    padding: '12px 6px',
                    background: 'none',
                    border: 'none',
                    borderBottom: act ? '2.5px solid #10B981' : '2.5px solid transparent',
                    color: act ? '#10B981' : '#4b5563',
                    fontSize: 14,
                    fontWeight: act ? 800 : 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'promociones' && tabPromociones}
            {activeTab === 'estilos' && tabEstilos}
            {activeTab === 'fechas' && tabFechasEspeciales}
          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <ToggleField checked={isActive} onChange={setIsActive} label="Widget activo en tienda" />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                border: 'none',
                background: '#10B981',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
              }}
            >
              {saving ? 'Guardando...' : existingWidget ? 'Guardar Cambios' : 'Crear Widget'}
            </button>
          </div>
        </div>

        <CentroAyuda />

        {error && (
          <div
            style={{
              position: 'fixed',
              bottom: 20,
              left: 16,
              right: 16,
              maxWidth: 500,
              margin: '0 auto',
              background: '#fee2e2',
              color: '#991b1b',
              padding: '12px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #fecaca',
              zIndex: 100,
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
