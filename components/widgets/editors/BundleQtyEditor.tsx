// components/widgets/editors/BundleQtyEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BundleQtyPreview from './BundleQtyPreview';
import {
  Toggle,
  ColorPicker,
  Slider,
  FieldInput,
  FieldSelect,
  SectionTitle,
} from './EditorFields';

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
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface BundleQtyEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

export type BundleStyle = 'stack' | 'ladder' | 'ticket' | 'capsule';

export interface BundlePack {
  enabled: boolean;
  qty: number;
  label: string;
  discountType: 'none' | 'percent' | 'fixed';
  discountValue: number;
  badge: string;
  showBadge: boolean;
  highlight: boolean;
}

export interface BundleQtyConfig {
  // Contenido
  title: string;
  subtitle: string;
  showSubtitle: boolean;
  footerNote: string;
  showFooterNote: boolean;
  // Packs
  packs: BundlePack[];
  // Diseño
  style: BundleStyle;
  layout: 'vertical' | 'horizontal';
  scale: number;
  alignment: 'center' | 'left';
  showPricePerUnit: boolean;
  showSavingsTotal: boolean;
  showSelectionSummary: boolean;
  // Colores
  colorBg: string;
  colorBorder: string;
  colorTitle: string;
  colorSubtitle: string;
  colorCardBg: string;
  colorCardBorder: string;
  colorCardSelected: string;
  colorCardSelectedBg: string;
  colorBadgeBg: string;
  colorBadgeText: string;
  colorHighlightBg: string;
  colorHighlightBorder: string;
  colorSavings: string;
  colorFooterNote: string;
  // Efectos
  effectsIntensity: number;
  showCardLift: boolean;
  showSavingsStamp: boolean;
  showValueRail: boolean;
  showRecommendedPulse: boolean;
  showUnitMorph: boolean;
  // Ubicación
  showOnHome: boolean;
  showOnProduct: boolean;
  showOnCart: boolean;
  productPosition: 'before-button' | 'before-title';
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const defaultConfig: BundleQtyConfig = {
  title: 'Llevá más, pagás menos',
  subtitle: 'Elegí tu pack y desbloqueá el ahorro',
  showSubtitle: true,
  footerNote: 'La cantidad se aplica al agregar al carrito',
  showFooterNote: true,
  packs: [
    {
      enabled: true,
      qty: 1,
      label: 'Unidad',
      discountType: 'none',
      discountValue: 0,
      badge: '',
      showBadge: false,
      highlight: false,
    },
    {
      enabled: true,
      qty: 2,
      label: 'Pack doble',
      discountType: 'percent',
      discountValue: 10,
      badge: '',
      showBadge: false,
      highlight: false,
    },
    {
      enabled: true,
      qty: 3,
      label: 'Pack ahorro',
      discountType: 'percent',
      discountValue: 15,
      badge: '⭐ Más vendido',
      showBadge: true,
      highlight: true,
    },
    {
      enabled: false,
      qty: 4,
      label: 'Pack familia',
      discountType: 'percent',
      discountValue: 20,
      badge: '💰 Mejor valor',
      showBadge: true,
      highlight: false,
    },
  ],
  style: 'stack',
  layout: 'vertical',
  scale: 1,
  alignment: 'center',
  showPricePerUnit: true,
  showSavingsTotal: true,
  showSelectionSummary: true,
  colorBg: '#ffffff',
  colorBorder: '#e5e7eb',
  colorTitle: '#1a1a2e',
  colorSubtitle: '#6b7280',
  colorCardBg: '#fafafa',
  colorCardBorder: '#e5e7eb',
  colorCardSelected: '#6366f1',
  colorCardSelectedBg: '#eef2ff',
  colorBadgeBg: '#6366f1',
  colorBadgeText: '#ffffff',
  colorHighlightBg: '#fffbeb',
  colorHighlightBorder: '#f59e0b',
  colorSavings: '#059669',
  colorFooterNote: '#9ca3af',
  effectsIntensity: 80,
  showCardLift: true,
  showSavingsStamp: true,
  showValueRail: true,
  showRecommendedPulse: true,
  showUnitMorph: true,
  showOnHome: false,
  showOnProduct: true,
  showOnCart: false,
  productPosition: 'before-button',
};

/* ═══════════════════════════════════════════
   SUB: Card colapsable
═══════════════════════════════════════════ */
function EditorCard({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        marginBottom: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderBottom: open ? '1px solid #f3f4f6' : 'none',
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
          {title}
        </span>
        <span
          style={{
            fontSize: 12,
            color: '#9ca3af',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        >
          ▼
        </span>
      </button>
      {open && <div style={{ padding: '12px 16px 16px' }}>{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Style Card
═══════════════════════════════════════════ */
function StyleCard({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '14px 8px',
        borderRadius: 12,
        border: active ? '2px solid #6366f1' : '2px solid #e5e7eb',
        background: active ? '#eef2ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#4f46e5' : '#374151' }}>
        {label}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════
   SUB: Pack Editor Card
═══════════════════════════════════════════ */
function PackEditorCard({
  index,
  pack,
  onChange,
}: {
  index: number;
  pack: BundlePack;
  onChange: (updated: BundlePack) => void;
}) {
  const [open, setOpen] = useState(index < 3);
  const up = <K extends keyof BundlePack>(key: K, val: BundlePack[K]) =>
    onChange({ ...pack, [key]: val });

  const packEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

  return (
    <div
      style={{
        borderRadius: 12,
        border: pack.highlight
          ? '2px solid #f59e0b'
          : pack.enabled
          ? '1.5px solid #e5e7eb'
          : '1.5px dashed #d1d5db',
        background: pack.highlight ? '#fffbeb' : pack.enabled ? '#fafafa' : '#f9fafb',
        marginBottom: 10,
        overflow: 'hidden',
        opacity: pack.enabled ? 1 : 0.6,
        transition: 'all 0.2s',
      }}
    >
      {/* Header del pack */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderBottom: open ? '1px solid #f3f4f6' : 'none',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontSize: 16 }}>{packEmojis[index]}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>
            {pack.label || `Pack x${pack.qty}`}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            {pack.discountType === 'none'
              ? 'Sin descuento'
              : pack.discountType === 'percent'
              ? `${pack.discountValue}% off`
              : `$${pack.discountValue} off`}
            {pack.highlight ? ' · ⭐ Recomendado' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Toggle habilitado */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              up('enabled', !pack.enabled);
            }}
            style={{
              width: 38,
              height: 22,
              borderRadius: 11,
              border: 'none',
              cursor: 'pointer',
              background: pack.enabled
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#d1d5db',
              position: 'relative',
              transition: 'background 0.25s ease',
              flexShrink: 0,
              outline: 'none',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: pack.enabled ? 18 : 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            />
          </button>
          <span
            style={{
              fontSize: 11,
              color: '#9ca3af',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Body del pack */}
      {open && (
        <div style={{ padding: '12px 14px' }}>
          {/* Cantidad */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Cantidad de unidades
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => up('qty', n)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: pack.qty === n ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                    background: pack.qty === n ? '#eef2ff' : '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    color: pack.qty === n ? '#4f46e5' : '#374151',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Etiqueta */}
          <FieldInput
            label="Nombre del pack"
            value={pack.label}
            placeholder="Pack ahorro"
            onChange={(v) => up('label', v)}
          />

          {/* Tipo de descuento */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Tipo de descuento
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { val: 'none' as const, label: 'Ninguno' },
                { val: 'percent' as const, label: '% off' },
                { val: 'fixed' as const, label: '$ off' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => up('discountType', opt.val)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 8,
                    border:
                      pack.discountType === opt.val
                        ? '2px solid #6366f1'
                        : '1.5px solid #e5e7eb',
                    background: pack.discountType === opt.val ? '#eef2ff' : '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    color: pack.discountType === opt.val ? '#4f46e5' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Valor del descuento */}
          {pack.discountType !== 'none' && (
            <Slider
              label={
                pack.discountType === 'percent'
                  ? 'Porcentaje de descuento'
                  : 'Descuento en pesos'
              }
              value={pack.discountValue}
              min={1}
              max={pack.discountType === 'percent' ? 80 : 10000}
              unit={pack.discountType === 'percent' ? '%' : '$'}
              onChange={(v) => up('discountValue', v)}
            />
          )}

          {/* Badge */}
          <FieldInput
            label="Badge (ej: ⭐ Más vendido)"
            value={pack.badge}
            placeholder="⭐ Más vendido"
            onChange={(v) => up('badge', v)}
          />
          <Toggle
            label="Mostrar badge"
            checked={pack.showBadge}
            onChange={(v) => up('showBadge', v)}
          />

          {/* Destacado */}
          <Toggle
            label="⭐ Pack recomendado"
            description="Aparece destacado y seleccionado por defecto"
            checked={pack.highlight}
            onChange={(v) => up('highlight', v)}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Placement Chip
═══════════════════════════════════════════ */
function PlacementChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        border: active ? '2px solid #6366f1' : '1.5px solid #d1d5db',
        background: active ? '#eef2ff' : '#fafafa',
        color: active ? '#4f46e5' : '#6b7280',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {active && '✓ '}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BundleQtyEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: BundleQtyEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BundleQtyConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile');
  const [isDesktop, setIsDesktop] = useState(false);

  const isEditing = !!existingWidget;

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const update = <K extends keyof BundleQtyConfig>(key: K, value: BundleQtyConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const updatePack = (index: number, updated: BundlePack) => {
    const newPacks = [...config.packs];
    newPacks[index] = updated;
    update('packs', newPacks);
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
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);
      setTimeout(() => router.push('/dashboard'), 900);
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
    } finally {
      setSaving(false);
    }
  };

  /* ═══ SIDEBAR ═══ */
  const sidebarContent = (
    <>
      {/* ── CONTENIDO ── */}
      <EditorCard title="Contenido" icon="📝" defaultOpen={true}>
        <FieldInput
          label="Título"
          value={config.title}
          placeholder="Llevá más, pagás menos"
          onChange={(v) => update('title', v)}
        />
        <Toggle
          label="Mostrar subtítulo"
          checked={config.showSubtitle}
          onChange={(v) => update('showSubtitle', v)}
        />
        {config.showSubtitle && (
          <FieldInput
            label="Subtítulo"
            value={config.subtitle}
            placeholder="Elegí tu pack y desbloqueá el ahorro"
            onChange={(v) => update('subtitle', v)}
          />
        )}
        <Toggle
          label="Mostrar nota al pie"
          checked={config.showFooterNote}
          onChange={(v) => update('showFooterNote', v)}
        />
        {config.showFooterNote && (
          <FieldInput
            label="Nota al pie"
            value={config.footerNote}
            placeholder="La cantidad se aplica al agregar al carrito"
            onChange={(v) => update('footerNote', v)}
          />
        )}
      </EditorCard>

      {/* ── PACKS ── */}
      <EditorCard title="Packs" icon="📦" defaultOpen={true}>
        <div
          style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: 16,
            fontSize: 12,
            color: '#0369a1',
            lineHeight: 1.5,
          }}
        >
          💡 Activá los packs que quieras mostrar. El pack con ⭐ aparece destacado y seleccionado por defecto.
        </div>
        {config.packs.map((pack, i) => (
          <PackEditorCard
            key={i}
            index={i}
            pack={pack}
            onChange={(updated) => updatePack(i, updated)}
          />
        ))}
        <div style={{ marginTop: 8 }}>
          <Toggle
            label="Mostrar ahorro total"
            description="Ej: Ahorrás 15% eligiendo este pack"
            checked={config.showSavingsTotal}
            onChange={(v) => update('showSavingsTotal', v)}
          />
          <Toggle
            label="Mostrar ahorro por unidad"
            description="Ej: El precio por unidad baja un 15%"
            checked={config.showPricePerUnit}
            onChange={(v) => update('showPricePerUnit', v)}
          />
          <Toggle
            label="Mostrar resumen de selección"
            description='Ej: "Seleccionaste Pack ahorro x3 · Ahorrás 15%"'
            checked={config.showSelectionSummary}
            onChange={(v) => update('showSelectionSummary', v)}
          />
        </div>
      </EditorCard>

      {/* ── DISEÑO ── */}
      <EditorCard title="Diseño" icon="🎨" defaultOpen={true}>
        <SectionTitle>Estilo visual</SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <StyleCard
            label="Stack Sell"
            emoji="🃏"
            active={config.style === 'stack'}
            onClick={() => update('style', 'stack')}
          />
          <StyleCard
            label="Price Ladder"
            emoji="📈"
            active={config.style === 'ladder'}
            onClick={() => update('style', 'ladder')}
          />
          <StyleCard
            label="Wholesale Ticket"
            emoji="🏷️"
            active={config.style === 'ticket'}
            onClick={() => update('style', 'ticket')}
          />
          <StyleCard
            label="Soft Capsule"
            emoji="💊"
            active={config.style === 'capsule'}
            onClick={() => update('style', 'capsule')}
          />
        </div>

        <SectionTitle>Layout</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {([
            { val: 'vertical', label: '↕ Vertical' },
            { val: 'horizontal', label: '↔ Horizontal' },
          ] as const).map((opt) => {
            const act = config.layout === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => update('layout', opt.val)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                  background: act ? '#eef2ff' : '#fafafa',
                  fontSize: 13,
                  fontWeight: 700,
                  color: act ? '#4f46e5' : '#374151',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <SectionTitle>Alineación</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {([
            { val: 'center', label: '↔ Centrado' },
            { val: 'left', label: '⬅ Izquierda' },
          ] as const).map((opt) => {
            const act = config.alignment === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => update('alignment', opt.val)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                  background: act ? '#eef2ff' : '#fafafa',
                  fontSize: 13,
                  fontWeight: 700,
                  color: act ? '#4f46e5' : '#374151',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <Slider
          label="Escala del widget"
          value={Math.round(config.scale * 100)}
          min={70}
          max={150}
          unit="%"
          onChange={(v) => update('scale', v / 100)}
        />
      </EditorCard>

      {/* ── COLORES ── */}
      <EditorCard title="Colores" icon="🖌️" defaultOpen={false}>
        <SectionTitle>Widget</SectionTitle>
        <ColorPicker
          label="Fondo del widget"
          value={config.colorBg}
          onChange={(v) => update('colorBg', v)}
        />
        <ColorPicker
          label="Borde del widget"
          value={config.colorBorder}
          onChange={(v) => update('colorBorder', v)}
        />
        <ColorPicker
          label="Título"
          value={config.colorTitle}
          onChange={(v) => update('colorTitle', v)}
        />
        <ColorPicker
          label="Subtítulo"
          value={config.colorSubtitle}
          onChange={(v) => update('colorSubtitle', v)}
        />
        <ColorPicker
          label="Nota al pie"
          value={config.colorFooterNote}
          onChange={(v) => update('colorFooterNote', v)}
        />

        <SectionTitle>Cards de pack</SectionTitle>
        <ColorPicker
          label="Fondo card normal"
          value={config.colorCardBg}
          onChange={(v) => update('colorCardBg', v)}
        />
        <ColorPicker
          label="Borde card normal"
          value={config.colorCardBorder}
          onChange={(v) => update('colorCardBorder', v)}
        />
        <ColorPicker
          label="Color seleccionado"
          value={config.colorCardSelected}
          onChange={(v) => update('colorCardSelected', v)}
        />
        <ColorPicker
          label="Fondo seleccionado"
          value={config.colorCardSelectedBg}
          onChange={(v) => update('colorCardSelectedBg', v)}
        />

        <SectionTitle>Pack destacado</SectionTitle>
        <ColorPicker
          label="Fondo destacado"
          value={config.colorHighlightBg}
          onChange={(v) => update('colorHighlightBg', v)}
        />
        <ColorPicker
          label="Borde destacado"
          value={config.colorHighlightBorder}
          onChange={(v) => update('colorHighlightBorder', v)}
        />

        <SectionTitle>Badges y ahorro</SectionTitle>
        <ColorPicker
          label="Fondo del badge"
          value={config.colorBadgeBg}
          onChange={(v) => update('colorBadgeBg', v)}
        />
        <ColorPicker
          label="Texto del badge"
          value={config.colorBadgeText}
          onChange={(v) => update('colorBadgeText', v)}
        />
        <ColorPicker
          label="Color de ahorro"
          value={config.colorSavings}
          onChange={(v) => update('colorSavings', v)}
        />
      </EditorCard>

      {/* ── EFECTOS ── */}
      <EditorCard title="Efectos premium" icon="✨" defaultOpen={false}>
        <Slider
          label="Intensidad de efectos"
          value={config.effectsIntensity}
          min={0}
          max={100}
          unit="%"
          onChange={(v) => update('effectsIntensity', v)}
        />
        <div style={{ height: 8 }} />
        <Toggle
          label="🃏 Card Lift Snap"
          description="La card sube al seleccionarse — sensación táctil"
          checked={config.showCardLift}
          onChange={(v) => update('showCardLift', v)}
        />
        <Toggle
          label="🏷️ Savings Stamp"
          description="El badge de ahorro entra como un sello con pop"
          checked={config.showSavingsStamp}
          onChange={(v) => update('showSavingsStamp', v)}
        />
        <Toggle
          label="📈 Value Rail"
          description="Riel visual que conecta los packs mostrando progresión"
          checked={config.showValueRail}
          onChange={(v) => update('showValueRail', v)}
        />
        <Toggle
          label="💫 Recommended Pulse"
          description="Halo elegante en el pack recomendado"
          checked={config.showRecommendedPulse}
          onChange={(v) => update('showRecommendedPulse', v)}
        />
        <Toggle
          label="🔢 Unit Morph"
          description="El número de cantidad cambia con transición suave"
          checked={config.showUnitMorph}
          onChange={(v) => update('showUnitMorph', v)}
        />
      </EditorCard>

      {/* ── UBICACIÓN ── */}
      <EditorCard title="Ubicación" icon="📍" defaultOpen={true}>
        <div
          style={{
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 12,
            lineHeight: 1.4,
          }}
        >
          Elegí dónde aparece el widget en tu tienda.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <PlacementChip
            label="🏠 Home"
            active={config.showOnHome}
            onClick={() => update('showOnHome', !config.showOnHome)}
          />
          <PlacementChip
            label="🛍 Producto"
            active={config.showOnProduct}
            onClick={() => update('showOnProduct', !config.showOnProduct)}
          />
          <PlacementChip
            label="🛒 Carrito"
            active={config.showOnCart}
            onClick={() => update('showOnCart', !config.showOnCart)}
          />
        </div>

        {config.showOnProduct && (
          <div style={{ paddingLeft: 4 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Posición en el producto:
            </div>
            {[
              {
                value: 'before-button',
                label: 'Antes del botón "Agregar al carrito"',
                desc: 'Máxima conversión',
              },
              {
                value: 'before-title',
                label: 'Antes del título del producto',
                desc: 'Impacto visual arriba',
              },
            ].map((opt) => {
              const act = config.productPosition === opt.value;
              return (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                    background: act ? '#eef2ff' : '#fafafa',
                    marginBottom: 8,
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: act ? '5px solid #6366f1' : '2px solid #d1d5db',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{opt.desc}</div>
                  </div>
                  <input
                    type="radio"
                    name="productPosition"
                    value={opt.value}
                    checked={act}
                    onChange={() => update('productPosition', opt.value as any)}
                    style={{ display: 'none' }}
                  />
                </label>
              );
            })}
          </div>
        )}
      </EditorCard>
    </>
  );

  /* ═══ PREVIEW WRAPPER ═══ */
  const previewContent = (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
        <div
          style={{
            background: '#f3f4f6',
            borderRadius: 10,
            padding: 3,
            display: 'inline-flex',
            gap: 2,
          }}
        >
          {(['desktop', 'mobile'] as const).map((m) => {
            const act = previewMode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setPreviewMode(m)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: act ? '#ffffff' : 'transparent',
                  boxShadow: act ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  color: act ? '#1a1a2e' : '#9ca3af',
                  cursor: 'pointer',
                }}
              >
                {m === 'desktop' ? '🖥 Desktop' : '📱 Mobile'}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          maxWidth: previewMode === 'desktop' ? 640 : 375,
          margin: '0 auto',
          transition: 'max-width 0.3s ease',
        }}
      >
        <BundleQtyPreview config={config} previewMode={previewMode} />
      </div>
    </div>
  );

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', paddingBottom: isDesktop ? 20 : 100 }}>
      {/* ── HEADER ── */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            background: '#fafafa',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#374151',
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              color: '#9ca3af',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isEditing ? 'Editando' : 'Nuevo widget'}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#1a1a2e',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {widgetDefinition.name}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1.5px solid ' + (isActive ? '#10b981' : '#d1d5db'),
              background: isActive ? '#ecfdf5' : '#fafafa',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              color: isActive ? '#059669' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isActive ? '#10b981' : '#9ca3af',
              }}
            />
            {isActive ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              border: 'none',
              background: savedOK
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}
          >
            {saving ? '...' : savedOK ? '✓' : isEditing ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div
        style={{
          display: isDesktop ? 'flex' : 'block',
          maxWidth: 1200,
          margin: '0 auto',
          padding: isDesktop ? '20px 20px' : '16px 12px',
          gap: 20,
        }}
      >
        {!isDesktop && <div style={{ marginBottom: 16 }}>{previewContent}</div>}

        {/* SIDEBAR */}
        <div
          style={{
            width: isDesktop ? 380 : '100%',
            flexShrink: 0,
            maxHeight: isDesktop ? 'calc(100vh - 80px)' : 'none',
            overflowY: isDesktop ? 'auto' : 'visible',
            paddingRight: isDesktop ? 4 : 0,
          }}
        >
          {sidebarContent}
        </div>

        {/* DESKTOP: preview */}
        {isDesktop && (
          <div
            style={{
              flex: 1,
              position: 'sticky',
              top: 80,
              alignSelf: 'flex-start',
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {previewContent}
          </div>
        )}
      </div>

      {/* ── FOOTER MOBILE ── */}
      {!isDesktop && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
            zIndex: 30,
          }}
        >
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 10,
              border: '1.5px solid ' + (isActive ? '#10b981' : '#e5e7eb'),
              background: isActive ? '#ecfdf5' : '#fafafa',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isActive ? '#10b981' : '#9ca3af',
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: isActive ? '#059669' : '#6b7280',
              }}
            >
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 12,
              border: 'none',
              background: savedOK
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
          </button>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: isDesktop ? 20 : 90,
            left: 16,
            right: 16,
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid #fecaca',
            zIndex: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
  }
