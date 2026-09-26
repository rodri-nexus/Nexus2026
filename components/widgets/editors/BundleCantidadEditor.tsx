'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   1. TIPOS Y CONSTANTES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface UnidadConfig {
  subtitulo: string;
  descuento: number;
  badgeEnvioGratis: boolean;
  badgeMasVendido: boolean;
  badgePersonalizado: boolean;
  textoBadgePersonalizado?: string;
  ocultar: boolean;
  porDefecto: boolean;
}

interface BundleCantidadConfig {
  titulo: string;
  cantidadUnidades: number;
  etiqueta: string;
  mostrarPrecio: 'total' | 'individual' | 'ambos';
  mostrarPrecioUnidad: boolean;
  textoBoton: string;
  unidades: UnidadConfig[];
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

const DEFAULT_UNIDAD: UnidadConfig = {
  subtitulo: '',
  descuento: 0,
  badgeEnvioGratis: false,
  badgeMasVendido: false,
  badgePersonalizado: false,
  textoBadgePersonalizado: 'MÁS AHORRO',
  ocultar: false,
  porDefecto: false,
};

const DEFAULT_CONFIG: BundleCantidadConfig = {
  titulo: '📦 Elegí tu pack con descuento',
  cantidadUnidades: 3,
  etiqueta: 'Pack # unidades',
  mostrarPrecio: 'ambos',
  mostrarPrecioUnidad: true,
  textoBoton: 'Aprovechar oferta por cantidad',
  unidades: [
    { ...DEFAULT_UNIDAD, subtitulo: 'Precio Regular', descuento: 0, porDefecto: false },
    {
      ...DEFAULT_UNIDAD,
      subtitulo: 'Ahorrás 15% OFF',
      descuento: 15,
      badgeMasVendido: true,
      badgeEnvioGratis: true,
      porDefecto: true,
    },
    {
      ...DEFAULT_UNIDAD,
      subtitulo: 'Máximo ahorro del pack (25% OFF)',
      descuento: 25,
      badgePersonalizado: true,
      textoBadgePersonalizado: 'MAYOR AHORRO',
      badgeEnvioGratis: true,
      porDefecto: false,
    },
    { ...DEFAULT_UNIDAD },
    { ...DEFAULT_UNIDAD },
  ],
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
   2. HELPERS GLOBALES (Regla #9)
═══════════════════════════════════════════ */
function formatEtiqueta(etiqueta: string, cantidad: number): string {
  if (!etiqueta) return `Pack ${cantidad} unidades`;
  if (etiqueta.includes('#')) return etiqueta.replace(/#/g, String(cantidad));
  return `${etiqueta} ${cantidad}`;
}

function formatMoney(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-AR');
}

function IconStore({ color = '#10B981' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M4 9v11a1 1 0 001 1h14a1 1 0 001-1V9" />
      <path d="M9 21V13h6v8" />
    </svg>
  );
}

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
  maxLength,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
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
   3. VISTA PREVIA PREMIUM — ESCALERA DE VALOR
═══════════════════════════════════════════ */
function BundleCantidadPreview({
  config,
  precioProducto = 25000,
}: {
  config: BundleCantidadConfig;
  precioProducto?: number;
}) {
  const [selected, setSelected] = useState<number>(() => {
    const idx = config.unidades.findIndex((u) => u?.porDefecto);
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    const idx = config.unidades.findIndex((u) => u?.porDefecto);
    if (idx >= 0) setSelected(idx);
  }, [config.unidades]);

  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const accent = activeTheme ? activeTheme.accentColor : config.colorUnidadSeleccionada;
  const priceColor = activeTheme ? activeTheme.themeColor : config.colorPrecio;
  const cardBg = activeTheme ? activeTheme.softBg : (config.colorFondoCard || '#ffffff');
  const selectedBg = activeTheme ? activeTheme.themeColor : (config.colorFondoSeleccionado || '#f0fdf4');
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

  const visibleCount = Math.max(2, Math.min(5, config.cantidadUnidades));

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
      {/* Franja de acento superior */}
      <div
        style={{
          height: 4,
          background: activeTheme
            ? `linear-gradient(90deg, ${activeTheme.accentColor}, ${activeTheme.themeColor}, ${activeTheme.accentColor})`
            : 'linear-gradient(90deg, #10B981, #059669, #10B981)',
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

        {/* Lista de Tiers de Cantidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: visibleCount }).map((_, i) => {
            const u = config.unidades[i] || DEFAULT_UNIDAD;
            if (u.ocultar) return null;

            const cantidad = i + 1;
            const isSelected = selected === i;
            const discount = u.descuento || 0;
            const totalOriginal = precioProducto * cantidad;
            const totalDiscounted = totalOriginal * (1 - discount / 100);
            const unitPrice = totalDiscounted / cantidad;
            const totalAhorrado = totalOriginal - totalDiscounted;

            const badges: { text: string; bg: string }[] = [];
            if (u.badgeEnvioGratis) badges.push({ text: 'ENVÍO GRATIS', bg: activeTheme ? activeTheme.accentColor : config.colorBadgeEnvio });
            if (u.badgeMasVendido) badges.push({ text: 'MÁS POPULAR', bg: config.colorBadgeMasVendido });
            if (u.badgePersonalizado) {
              badges.push({
                text: (u.textoBadgePersonalizado || 'MAYOR AHORRO').toUpperCase(),
                bg: config.colorBadgePersonalizado,
              });
            }

            return (
              <div
                key={i}
                onClick={() => setSelected(i)}
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
                {/* Borde lateral de acento */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: accent,
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
                  {/* Izquierda: radio + info del pack */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0, flex: 1 }}>
                    {/* Radio check */}
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
                        {formatEtiqueta(config.etiqueta, cantidad)}
                      </div>

                      {u.subtitulo && (
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
                          {u.subtitulo}
                        </div>
                      )}

                      {/* Pill Ahorro */}
                      {discount > 0 && (
                        <div
                          style={{
                            marginTop: 6,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 900,
                            color: activeTheme ? accent : '#059669',
                          }}
                        >
                          <span>↓ Ahorrás {formatMoney(totalAhorrado)} ({discount}% OFF)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Derecha: Precio total + precio por unidad */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {discount > 0 && (
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
                    )}
                    <div
                      style={{
                        fontSize: config.fuentePrecio,
                        fontWeight: 900,
                        color: isSelected ? accent : priceColor,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                      }}
                    >
                      {formatMoney(totalDiscounted)}
                    </div>

                    {config.mostrarPrecioUnidad !== false && (
                      <div
                        style={{
                          fontSize: 11,
                          color: mutedColor,
                          fontWeight: 600,
                          marginTop: 3,
                        }}
                      >
                        {formatMoney(unitPrice)} / ud.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón CTA */}
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
            fontFamily: 'inherit',
          }}
        >
          {config.textoBoton || 'COMPRAR AHORA'}
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
          Elegí tu pack y agregá al carrito desde el botón de la tienda
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. COMPONENTE PRINCIPAL (BundleCantidadEditor)
═══════════════════════════════════════════ */
export default function BundleCantidadEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BundleCantidadConfig>(() => {
    const base = {
      ...DEFAULT_CONFIG,
      ...(existingWidget?.config || {}),
    };
    if (!base.unidades || !Array.isArray(base.unidades)) base.unidades = DEFAULT_CONFIG.unidades;
    base.unidades = base.unidades.map((u, i) => ({
      ...DEFAULT_UNIDAD,
      ...u,
      textoBadgePersonalizado: u?.textoBadgePersonalizado || 'MAYOR AHORRO',
    }));
    if (typeof base.mostrarPrecioUnidad !== 'boolean') base.mostrarPrecioUnidad = true;
    if (!base.colorFondoCard) base.colorFondoCard = '#ffffff';
    if (!base.colorFondoSeleccionado) base.colorFondoSeleccionado = '#f0fdf4';
    return base;
  });

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [activeTab, setActiveTab] = useState<'general' | 'unidades' | 'estilos' | 'fechas'>('general');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isForAll = targetType === 'all';

  const update = <K extends keyof BundleCantidadConfig>(key: K, value: BundleCantidadConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateUnidad = (idx: number, key: keyof UnidadConfig, value: any) => {
    const nextUnidades = [...config.unidades];
    nextUnidades[idx] = { ...nextUnidades[idx], [key]: value };
    if (key === 'porDefecto' && value === true) {
      nextUnidades.forEach((u, i) => {
        if (i !== idx) u.porDefecto = false;
      });
    }
    update('unidades', nextUnidades);
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
          Elegí en qué sector de la ficha de producto querés inyectar el bloque de oferta por cantidad.
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
        <TextInput value={config.titulo} onChange={(v) => update('titulo', v)} placeholder="Ej: 📦 Elegí tu pack con descuento" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div>
          <FieldLabel>Cantidad de Packs/Pedaños</FieldLabel>
          <SelectField
            value={config.cantidadUnidades}
            onChange={(v) => update('cantidadUnidades', Number(v))}
            options={[
              { value: 2, label: 'Hasta 2 packs' },
              { value: 3, label: 'Hasta 3 packs' },
              { value: 4, label: 'Hasta 4 packs' },
              { value: 5, label: 'Hasta 5 packs' },
            ]}
          />
        </div>
        <div>
          <FieldLabel>Texto del Botón CTA</FieldLabel>
          <TextInput value={config.textoBoton} onChange={(v) => update('textoBoton', v)} placeholder="Ej: Aprovechar oferta" />
        </div>
      </div>

      <div>
        <FieldLabel>Formato de Etiqueta</FieldLabel>
        <TextInput
          value={config.etiqueta}
          onChange={(v) => update('etiqueta', v)}
          placeholder="Ej: Pack # unidades (usá # para la cantidad)"
        />
        <FieldHelper>Usá el símbolo # donde va el número de unidades (ej: Pack # unidades → Pack 2 unidades).</FieldHelper>
      </div>

      <div style={{ background: '#f9fafb', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CheckboxSimple
          checked={config.mostrarPrecioUnidad !== false}
          onChange={(v) => update('mostrarPrecioUnidad', v)}
          label="Mostrar precio por unidad ($/ud.)"
        />
        <FieldHelper>Muestra debajo del precio total cuánto cuesta cada unidad dentro de ese pack.</FieldHelper>
      </div>
    </div>
  );

  /* ═══ TAB OFERTAS / UNIDADES ═══ */
  const tabUnidades = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {Array.from({ length: config.cantidadUnidades }).map((_, i) => {
        const u = config.unidades[i] || DEFAULT_UNIDAD;
        return (
          <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Pack {i + 1} ({i + 1} ud.)</span>
              <CheckboxSimple
                checked={!!u.porDefecto}
                onChange={(v) => updateUnidad(i, 'porDefecto', v)}
                label="Seleccionado por defecto"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 10 }}>
              <div>
                <FieldLabel>Subtítulo / Ahorro</FieldLabel>
                <TextInput
                  value={u.subtitulo || ''}
                  onChange={(v) => updateUnidad(i, 'subtitulo', v)}
                  placeholder="Ej: Ahorrás 15% OFF"
                />
              </div>
              <div>
                <FieldLabel>Descuento (%)</FieldLabel>
                <TextInput
                  type="number"
                  value={u.descuento || 0}
                  onChange={(v) => updateUnidad(i, 'descuento', Number(v))}
                  placeholder="0"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1.5px dashed #f3f4f6', paddingTop: 10 }}>
              <CheckboxSimple
                checked={!!u.badgeEnvioGratis}
                onChange={(v) => updateUnidad(i, 'badgeEnvioGratis', v)}
                label="Envío Gratis"
              />
              <CheckboxSimple
                checked={!!u.badgeMasVendido}
                onChange={(v) => updateUnidad(i, 'badgeMasVendido', v)}
                label="Más Popular"
              />
              <CheckboxSimple
                checked={!!u.badgePersonalizado}
                onChange={(v) => updateUnidad(i, 'badgePersonalizado', v)}
                label="Badge Custom"
              />
            </div>

            {u.badgePersonalizado && (
              <div style={{ marginTop: 10 }}>
                <FieldLabel>Texto del badge custom</FieldLabel>
                <TextInput
                  value={u.textoBadgePersonalizado || 'MAYOR AHORRO'}
                  onChange={(v) => updateUnidad(i, 'textoBadgePersonalizado', v)}
                  placeholder="Ej: MAYOR AHORRO"
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
          <FieldLabel>Fondo Card Normal</FieldLabel>
          <ColorPickerField value={config.colorFondoCard || '#ffffff'} onChange={(v) => update('colorFondoCard', v)} />
        </div>
        <div>
          <FieldLabel>Fondo Card Seleccionada</FieldLabel>
          <ColorPickerField value={config.colorFondoSeleccionado || '#f0fdf4'} onChange={(v) => update('colorFondoSeleccionado', v)} />
        </div>
        <div>
          <FieldLabel>Badge Envío Gratis</FieldLabel>
          <ColorPickerField value={config.colorBadgeEnvio} onChange={(v) => update('colorBadgeEnvio', v)} />
        </div>
        <div>
          <FieldLabel>Badge Más Popular</FieldLabel>
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
            <FieldLabel>Tamaño Etiqueta ({config.fuenteEtiqueta}px)</FieldLabel>
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
            <FieldLabel>Tamaño Precio ({config.fuentePrecio}px)</FieldLabel>
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
        Elegí un preset de temporada. Se aplican colores festivos de alto impacto sobre la escalera de valor.
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
              Vista previa en vivo (Escalera de Valor)
            </div>
            <BundleCantidadPreview config={config} />
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
            {[
              { id: 'general', label: 'Config' },
              { id: 'unidades', label: 'Ofertas' },
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
            {activeTab === 'unidades' && tabUnidades}
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
