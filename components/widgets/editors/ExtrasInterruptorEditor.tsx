'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Check } from 'lucide-react';
import {
  ColorPicker,
  Slider,
  FieldInput,
} from './EditorFields';
import EditorTabs from './EditorTabs';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   HELPERS & AUXILIARY FUNCTIONS (Regla #9)
═══════════════════════════════════════════ */
const getProductName = (name: any): string => {
  if (!name) return 'Producto';
  if (typeof name === 'object') {
    return String(name.es || Object.values(name)[0] || 'Producto');
  }
  return String(name);
};

/* ═══════════════════════════════════════════
   PRESETS DE FECHAS ESPECIALES
═══════════════════════════════════════════ */
const CAMPAIGN_THEMES: Record<
  string,
  {
    name: string;
    themeColor: string;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    cardBg: string;
    borderColor: string;
    textColor: string;
    priceColor: string;
    switchOnColor: string;
    tag: string;
    description: string;
  }
> = {
  none: {
    name: 'Diseño Normal / Sin Evento',
    themeColor: '#10B981',
    accentColor: '#10B981',
    badgeBg: '',
    badgeText: '',
    cardBg: '',
    borderColor: '',
    textColor: '',
    priceColor: '',
    switchOnColor: '',
    tag: 'DEFAULT',
    description: 'Mantiene los colores y estilos configurados en la pestaña Estilos.',
  },
  'black-friday': {
    name: '🔥 Black Friday',
    themeColor: '#111827',
    accentColor: '#F59E0B',
    badgeBg: '#F59E0B',
    badgeText: '#111827',
    cardBg: '#111827',
    borderColor: '#F59E0B',
    textColor: '#FFFFFF',
    priceColor: '#F59E0B',
    switchOnColor: '#F59E0B',
    tag: 'BLACK FRIDAY',
    description: 'Fondo negro profundo con acentos dorados de alto impacto.',
  },
  'hot-sale': {
    name: '⚡ Hot Sale',
    themeColor: '#0F172A',
    accentColor: '#EF4444',
    badgeBg: '#EF4444',
    badgeText: '#FFFFFF',
    cardBg: '#0F172A',
    borderColor: '#EF4444',
    textColor: '#FFFFFF',
    priceColor: '#EF4444',
    switchOnColor: '#EF4444',
    tag: 'HOT SALE',
    description: 'Fondo azul noche con acentos rojo fuego.',
  },
  'cyber-monday': {
    name: '🚀 Cyber Monday',
    themeColor: '#090D16',
    accentColor: '#3B82F6',
    badgeBg: '#3B82F6',
    badgeText: '#FFFFFF',
    cardBg: '#090D16',
    borderColor: '#3B82F6',
    textColor: '#FFFFFF',
    priceColor: '#60A5FA',
    switchOnColor: '#3B82F6',
    tag: 'CYBER MONDAY',
    description: 'Estilo tech futurista con acentos azul neón.',
  },
  navidad: {
    name: '🎄 Navidad & Reyes',
    themeColor: '#064E3B',
    accentColor: '#EF4444',
    badgeBg: '#EF4444',
    badgeText: '#FFFFFF',
    cardBg: '#064E3B',
    borderColor: '#10B981',
    textColor: '#FFFFFF',
    priceColor: '#FCD34D',
    switchOnColor: '#10B981',
    tag: 'NAVIDAD',
    description: 'Verde pino navideño con detalles en rojo y dorado.',
  },
  'san-valentin': {
    name: '💘 San Valentín',
    themeColor: '#831843',
    accentColor: '#F43F5E',
    badgeBg: '#F43F5E',
    badgeText: '#FFFFFF',
    cardBg: '#831843',
    borderColor: '#FB7185',
    textColor: '#FFFFFF',
    priceColor: '#FECDD3',
    switchOnColor: '#F43F5E',
    tag: 'SAN VALENTÍN',
    description: 'Tono vino y rosa apasionado para fechas románticas.',
  },
  'dia-madre-padre': {
    name: '🎁 Día de la Madre / Padre',
    themeColor: '#312E81',
    accentColor: '#10B981',
    badgeBg: '#10B981',
    badgeText: '#FFFFFF',
    cardBg: '#312E81',
    borderColor: '#6366F1',
    textColor: '#FFFFFF',
    priceColor: '#A7F3D0',
    switchOnColor: '#10B981',
    tag: 'SPECIAL DAY',
    description: 'Índigo premium con acentos esmeralda para regalos.',
  },
  'sale-liquidacion': {
    name: '🏷️ Liquidación / Sale',
    themeColor: '#7F1D1D',
    accentColor: '#FBBF24',
    badgeBg: '#FBBF24',
    badgeText: '#7F1D1D',
    cardBg: '#7F1D1D',
    borderColor: '#FBBF24',
    textColor: '#FFFFFF',
    priceColor: '#FBBF24',
    switchOnColor: '#FBBF24',
    tag: 'LIQUIDACIÓN',
    description: 'Rojo liquidación con contrastes en amarillo vibrante.',
  },
};

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
  config: Record<string, unknown>;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface Props {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

interface StoreProduct {
  id: number;
  name: string | { es?: string; [key: string]: unknown };
  images?: Array<{ src: string }>;
  variants?: Array<{ id: number; price: string | number; promotional_price?: string | number }>;
}

interface ExtrasInterruptorConfig {
  titulo: string;
  precioTexto: string;
  badgeTexto: string;
  mostrarBadge: boolean;
  colorBadge: string;
  colorTextoBadge: string;
  textoVerMas: string;
  mostrarVerMas: boolean;
  linkVerMas: string;
  imagenUrl: string;
  variantId: string;
  colorFondo: string;
  colorTitulo: string;
  colorPrecio: string;
  colorBorde: string;
  colorSwitchOn: string;
  colorSwitchOff: string;
  bordesRedondeados: number;
  paddingInterno: number;
  campaignTheme?: string;
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: ExtrasInterruptorConfig = {
  titulo: 'SACO GRIS',
  precioTexto: '$59.999',
  badgeTexto: 'PROMO',
  mostrarBadge: true,
  colorBadge: '#dc2626',
  colorTextoBadge: '#ffffff',
  textoVerMas: 'VER MÁS',
  mostrarVerMas: true,
  linkVerMas: '#',
  imagenUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=150&q=80',
  variantId: '',
  colorFondo: '#fffdf5',
  colorTitulo: '#1f2937',
  colorPrecio: '#111827',
  colorBorde: '#fcd34d',
  colorSwitchOn: '#10B981',
  colorSwitchOff: '#e5e7eb',
  bordesRedondeados: 16,
  paddingInterno: 14,
  campaignTheme: 'none',
};

/* ═══════════════════════════════════════════
   SECTION CARD
═══════════════════════════════════════════ */
function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, lineHeight: 1.4 }}>
            {description}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN VIVO
═══════════════════════════════════════════ */
function ExtrasInterruptorPreview({
  config,
  forceOn,
  onToggle,
}: {
  config: ExtrasInterruptorConfig;
  forceOn: boolean;
  onToggle: () => void;
}) {
  const themeKey = config.campaignTheme || 'none';
  const theme = CAMPAIGN_THEMES[themeKey] || CAMPAIGN_THEMES.none;
  const isCustomTheme = themeKey !== 'none';

  const cardBg = isCustomTheme && theme.cardBg ? theme.cardBg : config.colorFondo;
  const borderColor = isCustomTheme && theme.borderColor ? theme.borderColor : config.colorBorde;
  const titleColor = isCustomTheme && theme.textColor ? theme.textColor : config.colorTitulo;
  const priceColor = isCustomTheme && theme.priceColor ? theme.priceColor : config.colorPrecio;
  const badgeBg = isCustomTheme && theme.badgeBg ? theme.badgeBg : config.colorBadge;
  const badgeTextColor = isCustomTheme && theme.badgeText ? theme.badgeText : config.colorTextoBadge;
  const switchOnColor = isCustomTheme && theme.switchOnColor ? theme.switchOnColor : config.colorSwitchOn;
  const verMasColor = isCustomTheme ? theme.textColor || '#ffffff' : '#000000';

  return (
    <div
      style={{
        background: cardBg,
        border: `2px solid ${borderColor}`,
        borderRadius: config.bordesRedondeados,
        padding: config.paddingInterno,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: isCustomTheme
          ? `0 4px 20px ${borderColor}33`
          : '0 4px 14px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Columna Izquierda: Imagen + Ver Más */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 8,
            overflow: 'hidden',
            background: '#ffffff',
            border: isCustomTheme ? `1px solid ${borderColor}55` : '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {config.imagenUrl ? (
            <img
              src={config.imagenUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: 20 }}>👔</span>
          )}
        </div>
        {config.mostrarVerMas && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: verMasColor,
              textDecoration: 'underline',
              letterSpacing: '0.03em',
              transition: 'color 0.3s ease',
            }}
          >
            {config.textoVerMas || 'VER MÁS'}
          </span>
        )}
      </div>

      {/* Columna Central: Título + Precio + Badge PROMO */}
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: titleColor,
            lineHeight: 1.2,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s ease',
          }}
        >
          {config.titulo || 'PRODUCTO EXTRA'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: priceColor,
              letterSpacing: '-0.02em',
              transition: 'color 0.3s ease',
            }}
          >
            {config.precioTexto || '$0'}
          </span>

          {config.mostrarBadge && config.badgeTexto && (
            <span
              style={{
                background: badgeBg,
                color: badgeTextColor,
                fontSize: 10,
                fontWeight: 900,
                padding: '2px 7px',
                borderRadius: 4,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1,
                transition: 'all 0.3s ease',
              }}
            >
              {config.badgeTexto}
            </span>
          )}
        </div>
      </div>

      {/* Columna Derecha: Interruptor Switch */}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle extra"
        style={{
          width: 54,
          height: 30,
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          background: forceOn ? switchOnColor : config.colorSwitchOff,
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.2s ease',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: forceOn ? 27 : 3,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'left 0.2s ease',
          }}
        />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function ExtrasInterruptorEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<ExtrasInterruptorConfig>(() => {
    if (existingWidget?.config) {
      return { ...DEFAULT_CONFIG, ...(existingWidget.config as Partial<ExtrasInterruptorConfig>) };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [previewOn, setPreviewOn] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selector integrado de Tiendanube
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    async function loadStoreProducts() {
      try {
        setLoadingProducts(true);
        const res = await fetch(`/api/products?store_id=${storeId}`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.products || data.data || []);
          setStoreProducts(list);
        }
      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadStoreProducts();
  }, [storeId]);

  const updateCfg = <K extends keyof ExtrasInterruptorConfig>(
    key: K,
    val: ExtrasInterruptorConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleSelectProduct = (prod: StoreProduct) => {
    const nameStr = getProductName(prod.name);
    const firstVariant = (prod.variants && prod.variants.length > 0) ? prod.variants[0] : null;
    const priceVal = firstVariant ? Number(firstVariant.price) : 0;
    const variantIdVal = firstVariant ? String(firstVariant.id) : String(prod.id);
    const imgUrl = (prod.images && prod.images.length > 0) ? prod.images[0].src : '';

    setConfig((prev) => ({
      ...prev,
      titulo: nameStr,
      precioTexto: `$${priceVal.toLocaleString('es-AR')}`,
      imagenUrl: imgUrl,
      variantId: variantIdVal,
    }));
    setShowPicker(false);
    setSearchFilter('');
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

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string })?.error || 'Error al guardar el widget'
        );
      }

      if ((data as { action?: string }).action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) {
          params.set('product', String(productId));
        }
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error inesperado al guardar';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ─── TAB GENERAL ─── */
  const tabGeneral = (
    <div>
      {/* BOTÓN INTELIGENTE DE SELECCIÓN DE PRODUCTO */}
      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#10B981',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#10B981')}
        >
          <Search size={18} />
          {showPicker ? 'Cerrar buscador' : '📦 Elegir de mi tienda'}
        </button>

        {/* LISTADO FILTRABLE DE PRODUCTOS DE LA TIENDA */}
        {showPicker && (
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #10B981',
              borderRadius: 12,
              padding: 14,
              marginTop: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: '#059669', marginBottom: 8 }}>
              🔍 Buscá y seleccioná un producto de tu Tiendanube:
            </div>

            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Escribí el nombre del producto..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                marginBottom: 10,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {loadingProducts ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', padding: 8 }}>
                  <Loader2 size={16} className="animate-spin" />
                  Cargando productos de tu Tiendanube...
                </div>
              ) : storeProducts.length === 0 ? (
                <div style={{ fontSize: 13, color: '#64748b', padding: 8 }}>No se encontraron productos.</div>
              ) : (
                storeProducts
                  .filter((p) => {
                    const name = getProductName(p.name);
                    return name.toLowerCase().includes(searchFilter.toLowerCase());
                  })
                  .map((p) => {
                    const name = getProductName(p.name);
                    const v = (p.variants && p.variants.length > 0) ? p.variants[0] : null;
                    const price = v ? Number(v.price) : 0;
                    const img = (p.images && p.images.length > 0) ? p.images[0].src : '';

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: 8,
                          borderRadius: 8,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ecfdf5';
                          e.currentTarget.style.borderColor = '#10B981';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8fafc';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 6,
                            background: '#e2e8f0',
                            overflow: 'hidden',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {img ? (
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 16 }}>🛍️</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {name}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', marginTop: 1 }}>
                            ${price.toLocaleString('es-AR')}
                          </div>
                        </div>
                        <div style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                          Elegir
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>

      <FieldInput
        label="Nombre / Título del producto extra"
        value={config.titulo}
        placeholder="SACO GRIS"
        onChange={(v) => updateCfg('titulo', v)}
      />

      <FieldInput
        label="Precio"
        value={config.precioTexto}
        placeholder="$59.999"
        onChange={(v) => updateCfg('precioTexto', v)}
      />

      <FieldInput
        label="Texto de etiqueta (ej: PROMO / 15% OFF)"
        value={config.badgeTexto}
        placeholder="PROMO"
        onChange={(v) => updateCfg('badgeTexto', v)}
      />

      <FieldInput
        label="URL de la imagen del producto"
        value={config.imagenUrl}
        placeholder="https://..."
        onChange={(v) => updateCfg('imagenUrl', v)}
      />

      <FieldInput
        label="Texto de enlace 'Ver más'"
        value={config.textoVerMas}
        placeholder="VER MÁS"
        onChange={(v) => updateCfg('textoVerMas', v)}
      />

      <FieldInput
        label="ID de variante Tiendanube (opcional para el carrito)"
        value={config.variantId}
        placeholder="Ej: 123456789"
        onChange={(v) => updateCfg('variantId', v)}
      />

      {/* RECUADRO DE AYUDA / MINI-TUTORIAL */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: '14px 16px',
          marginTop: -6,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>
            ¿Cómo obtener el ID de Variante en Tiendanube?
          </span>
        </div>
        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 12,
            color: '#15803d',
            lineHeight: 1.55,
          }}
        >
          <li style={{ marginBottom: 4 }}>
            Entrá a tu panel de Tiendanube → <b>Productos</b>.
          </li>
          <li style={{ marginBottom: 4 }}>
            Hacé clic en el producto que querés ofrecer como extra.
          </li>
          <li style={{ marginBottom: 4 }}>
            <b>Si no tiene talles/colores (producto único):</b> Copiá el número que aparece al final de la URL en la barra de tu navegador (ej: <code>.../admin/products/<b>12345678</b></code>).
          </li>
          <li>
            <b>Si tiene variantes (talles/colores):</b> Bajá a la sección <i>Variantes</i>, editá la variante específica y copiá el ID numérico de esa opción.
          </li>
        </ol>
        <div style={{ marginTop: 8, fontSize: 11, color: '#166534', opacity: 0.85 }}>
          ✨ <i>Al colocar este ID, cuando el cliente prenda el interruptor en tu tienda se agregará automáticamente este extra al carrito de compras.</i>
        </div>
      </div>
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores"
        description="Personalizá los colores del fondo, texto, badge y switch."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Color de fondo"
            value={config.colorFondo}
            onChange={(v) => updateCfg('colorFondo', v)}
          />
          <ColorPicker
            label="Color del título"
            value={config.colorTitulo}
            onChange={(v) => updateCfg('colorTitulo', v)}
          />
          <ColorPicker
            label="Color del precio"
            value={config.colorPrecio}
            onChange={(v) => updateCfg('colorPrecio', v)}
          />
          <ColorPicker
            label="Color del borde"
            value={config.colorBorde}
            onChange={(v) => updateCfg('colorBorde', v)}
          />
          <ColorPicker
            label="Fondo del badge PROMO"
            value={config.colorBadge}
            onChange={(v) => updateCfg('colorBadge', v)}
          />
          <ColorPicker
            label="Texto del badge PROMO"
            value={config.colorTextoBadge}
            onChange={(v) => updateCfg('colorTextoBadge', v)}
          />
          <ColorPicker
            label="Switch encendido (ON)"
            value={config.colorSwitchOn}
            onChange={(v) => updateCfg('colorSwitchOn', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon="🎛"
        title="Diseño"
        description="Ajustá bordes y márgenes de la tarjeta."
      >
        <Slider
          label="Bordes redondeados"
          value={config.bordesRedondeados}
          min={0}
          max={24}
          onChange={(v) => updateCfg('bordesRedondeados', v)}
        />
        <Slider
          label="Padding interno"
          value={config.paddingInterno}
          min={8}
          max={24}
          onChange={(v) => updateCfg('paddingInterno', v)}
        />
      </SectionCard>
    </div>
  );

  /* ─── TAB FECHAS ESPECIALES ─── */
  const tabFechas = (
    <div>
      <div
        style={{
          background:
            config.campaignTheme && config.campaignTheme !== 'none'
              ? '#eff6ff'
              : '#f8fafc',
          border: `1px solid ${
            config.campaignTheme && config.campaignTheme !== 'none'
              ? '#bfdbfe'
              : '#e2e8f0'
          }`,
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 24 }}>
          {config.campaignTheme && config.campaignTheme !== 'none' ? '🔥' : '✨'}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
            {config.campaignTheme && config.campaignTheme !== 'none'
              ? `Evento activo: ${CAMPAIGN_THEMES[config.campaignTheme]?.name || 'Personalizado'}`
              : 'Diseño Normal activo'}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {config.campaignTheme && config.campaignTheme !== 'none'
              ? 'El widget adaptará sus colores automáticamente a la estética del evento comercial seleccionado.'
              : 'El widget respeta los colores estándar configurados en la pestaña Estilos.'}
          </div>
        </div>
        {config.campaignTheme && config.campaignTheme !== 'none' && (
          <button
            type="button"
            onClick={() => updateCfg('campaignTheme', 'none')}
            style={{
              padding: '6px 12px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Restablecer
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {Object.entries(CAMPAIGN_THEMES).map(([key, theme]) => {
          const isSelected = (config.campaignTheme || 'none') === key;
          return (
            <div
              key={key}
              onClick={() => updateCfg('campaignTheme', key)}
              style={{
                background: isSelected ? '#ffffff' : '#fafafa',
                border: isSelected ? '2px solid #10B981' : '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.12)' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: isSelected ? '#10B981' : '#111827',
                  }}
                >
                  {theme.name}
                </span>
                {isSelected && (
                  <span
                    style={{
                      background: '#10B981',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    ACTIVO
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  margin: '0 0 10px 0',
                  lineHeight: 1.4,
                }}
              >
                {theme.description}
              </p>
              {key !== 'none' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: theme.themeColor,
                      border: '1px solid #d1d5db',
                    }}
                    title="Color principal"
                  />
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: theme.accentColor,
                      border: '1px solid #d1d5db',
                    }}
                    title="Color de acento"
                  />
                  <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>
                    Paleta del evento
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo size="medium" />
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          NX
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
        {/* Chip de alcance */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: targetType === 'all' ? '#10B981' : '#ffffff',
            color: targetType === 'all' ? '#ffffff' : '#000000',
            border: targetType === 'all' ? 'none' : '1px solid #e5e7eb',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {targetType === 'all' ? 'Todos los productos' : '🛍️ Producto específico'}
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name}
        </h1>

        {/* PREVIEW */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <ExtrasInterruptorPreview
            config={config}
            forceOn={previewOn}
            onToggle={() => setPreviewOn((v) => !v)}
          />
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <EditorTabs
            tabs={[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'estilos', label: 'Estilos', icon: '🎨' },
              { id: 'fechas', label: 'Fechas Especiales', icon: '🔥' },
            ]}
          >
            {[tabGeneral, tabEstilos, tabFechas]}
          </EditorTabs>

          {/* GUARDAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #f1f3f5',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? '#10B981' : '#e5e7eb',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background 0.25s ease',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: isActive ? 24 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#ffffff',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                Widget activo
              </span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                background: saving ? '#e5e7eb' : '#10B981',
                color: saving ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.background = '#10B981';
              }}
            >
              {saving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
    }
