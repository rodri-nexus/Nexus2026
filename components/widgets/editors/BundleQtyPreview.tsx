// components/widgets/editors/BundleQtyPreview.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import type { BundleQtyConfig, BundlePack, BundleStyle } from './BundleQtyEditor';

interface BundleQtyPreviewProps {
  config: BundleQtyConfig;
  previewMode: 'desktop' | 'mobile';
}

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function getDiscountLabel(pack: BundlePack): string {
  if (pack.discountType === 'none' || pack.discountValue === 0) return '';
  if (pack.discountType === 'percent') return `-${pack.discountValue}%`;
  return `-$${pack.discountValue}`;
}

function getSavingsLabel(pack: BundlePack): string {
  if (pack.discountType === 'none' || pack.discountValue === 0) return '';
  if (pack.discountType === 'percent') return `Ahorrás ${pack.discountValue}%`;
  return `Ahorrás $${pack.discountValue}`;
}

function getPerUnitLabel(pack: BundlePack): string {
  if (pack.discountType === 'none' || pack.discountValue === 0 || pack.qty <= 1) return '';
  if (pack.discountType === 'percent') return `${pack.discountValue}% menos por unidad`;
  return `$${Math.round(pack.discountValue / pack.qty)} menos por unidad`;
}

/* ═══════════════════════════════════════════
   KEYFRAMES (inyectados una sola vez)
═══════════════════════════════════════════ */
let keyframesInjected = false;
function injectKeyframes() {
  if (keyframesInjected || typeof document === 'undefined') return;
  keyframesInjected = true;
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes bqPulseRing {
      0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
      70% { box-shadow: 0 0 0 10px rgba(245,158,11,0); }
      100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
    }
    @keyframes bqStampIn {
      0% { transform: scale(0.4) rotate(-12deg); opacity: 0; }
      70% { transform: scale(1.15) rotate(2deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes bqCardLift {
      0% { transform: translateY(0px); }
      40% { transform: translateY(-4px); }
      100% { transform: translateY(-2px); }
    }
    @keyframes bqRailFill {
      from { width: 0%; }
      to { width: 100%; }
    }
    @keyframes bqMorphNum {
      0% { opacity: 0; transform: translateY(8px) scale(0.8); }
      100% { opacity: 1; transform: translateY(0px) scale(1); }
    }
    @keyframes bqFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bqTicketPerf {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════
   SUB: Pack Card — Stack Sell
═══════════════════════════════════════════ */
function StackPackCard({
  pack,
  selected,
  onSelect,
  config,
  animStamp,
}: {
  pack: BundlePack;
  selected: boolean;
  onSelect: () => void;
  config: BundleQtyConfig;
  animStamp: boolean;
}) {
  const isHighlight = pack.highlight;
  const discount = getDiscountLabel(pack);
  const savings = getSavingsLabel(pack);
  const perUnit = getPerUnitLabel(pack);

  const borderColor = selected
    ? config.colorCardSelected
    : isHighlight
    ? config.colorHighlightBorder
    : config.colorCardBorder;

  const bgColor = selected
    ? config.colorCardSelectedBg
    : isHighlight
    ? config.colorHighlightBg
    : config.colorCardBg;

  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${borderColor}`,
        borderRadius: 14,
        background: bgColor,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        position: 'relative',
        animation: selected && config.showCardLift ? 'bqCardLift 0.25s ease forwards' : 'none',
        boxShadow: selected
          ? `0 4px 16px ${config.colorCardSelected}30`
          : isHighlight
          ? `0 2px 10px ${config.colorHighlightBorder}25`
          : '0 1px 4px rgba(0,0,0,0.05)',
        animationName:
          isHighlight && config.showRecommendedPulse && !selected ? 'bqPulseRing' : 'none',
        animationDuration: '2.2s',
        animationIterationCount: 'infinite',
      }}
    >
      {/* Badge */}
      {pack.showBadge && pack.badge && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: 12,
            background: config.colorBadgeBg,
            color: config.colorBadgeText,
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 20,
            animation: animStamp && config.showSavingsStamp ? 'bqStampIn 0.4s ease forwards' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {pack.badge}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Radio */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: selected
              ? `6px solid ${config.colorCardSelected}`
              : `2px solid ${config.colorCardBorder}`,
            flexShrink: 0,
            transition: 'all 0.2s',
            background: '#fff',
          }}
        />

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: selected ? config.colorCardSelected : config.colorTitle,
                animation: config.showUnitMorph ? 'bqMorphNum 0.3s ease' : 'none',
              }}
            >
              x{pack.qty}
            </span>
            <span style={{ fontSize: 13, color: config.colorSubtitle }}>{pack.label}</span>
          </div>
          {config.showPricePerUnit && perUnit && (
            <div style={{ fontSize: 11, color: config.colorSubtitle, marginTop: 2 }}>{perUnit}</div>
          )}
        </div>

        {/* Descuento */}
        {discount && (
          <div
            style={{
              background: selected ? config.colorCardSelected : config.colorSavings,
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            {discount}
          </div>
        )}
      </div>

      {/* Savings debajo */}
      {config.showSavingsTotal && savings && selected && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            fontWeight: 600,
            color: config.colorSavings,
            animation: 'bqFadeIn 0.25s ease',
          }}
        >
          ✓ {savings}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Pack Card — Price Ladder
═══════════════════════════════════════════ */
function LadderPackCard({
  pack,
  selected,
  onSelect,
  config,
  index,
  total,
}: {
  pack: BundlePack;
  selected: boolean;
  onSelect: () => void;
  config: BundleQtyConfig;
  index: number;
  total: number;
}) {
  const discount = getDiscountLabel(pack);
  const savings = getSavingsLabel(pack);
  const intensity = index / Math.max(total - 1, 1);

  const bgSelected = config.colorCardSelected;
  const bg = selected ? bgSelected : `rgba(99,102,241,${0.04 + intensity * 0.08})`;
  const border = selected ? config.colorCardSelected : `rgba(99,102,241,${0.15 + intensity * 0.2})`;

  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${border}`,
        borderRadius: 12,
        background: selected ? config.colorCardSelectedBg : bg,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
        boxShadow: selected ? `0 4px 14px ${config.colorCardSelected}25` : 'none',
        marginLeft: `${index * 10}px`,
      }}
    >
      {/* Número grande */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: selected ? config.colorCardSelected : `rgba(99,102,241,${0.1 + intensity * 0.15})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 800,
          color: selected ? '#fff' : config.colorCardSelected,
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        {pack.qty}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? config.colorCardSelected : config.colorTitle }}>
          {pack.label}
        </div>
        {config.showSavingsTotal && savings && (
          <div style={{ fontSize: 11, color: config.colorSavings, fontWeight: 600 }}>{savings}</div>
        )}
      </div>

      {discount && (
        <div
          style={{
            background: selected ? config.colorCardSelected : config.colorSavings,
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            padding: '4px 9px',
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          {discount}
        </div>
      )}

      {pack.showBadge && pack.badge && (
        <div
          style={{
            position: 'absolute',
            top: -9,
            left: 12,
            background: config.colorBadgeBg,
            color: config.colorBadgeText,
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 20,
          }}
        >
          {pack.badge}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Pack Card — Wholesale Ticket
═══════════════════════════════════════════ */
function TicketPackCard({
  pack,
  selected,
  onSelect,
  config,
}: {
  pack: BundlePack;
  selected: boolean;
  onSelect: () => void;
  config: BundleQtyConfig;
}) {
  const discount = getDiscountLabel(pack);
  const savings = getSavingsLabel(pack);

  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px ${selected ? 'solid' : 'dashed'} ${selected ? config.colorCardSelected : config.colorCardBorder}`,
        borderRadius: 10,
        background: selected ? config.colorCardSelectedBg : config.colorCardBg,
        padding: '0',
        cursor: 'pointer',
        transition: 'all 0.2s',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: selected ? `0 4px 16px ${config.colorCardSelected}30` : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Franja lateral tipo ticket */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: selected
            ? config.colorCardSelected
            : pack.highlight
            ? config.colorHighlightBorder
            : config.colorCardBorder,
          transition: 'background 0.2s',
        }}
      />

      <div style={{ padding: '12px 14px 12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Qty grande */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: selected ? config.colorCardSelected : config.colorTitle,
            lineHeight: 1,
            minWidth: 36,
            fontFamily: 'monospace',
            transition: 'color 0.2s',
          }}
        >
          x{pack.qty}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: config.colorTitle }}>{pack.label}</div>
          {config.showSavingsTotal && savings && (
            <div style={{ fontSize: 11, color: config.colorSavings, fontWeight: 600 }}>{savings}</div>
          )}
        </div>

        {discount && (
          <div
            style={{
              background: selected ? config.colorCardSelected : '#f3f4f6',
              color: selected ? '#fff' : config.colorTitle,
              fontSize: 13,
              fontWeight: 800,
              padding: '5px 10px',
              borderRadius: 8,
              fontFamily: 'monospace',
              transition: 'all 0.2s',
            }}
          >
            {discount}
          </div>
        )}
      </div>

      {/* Badge como sello */}
      {pack.showBadge && pack.badge && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            background: config.colorBadgeBg,
            color: config.colorBadgeText,
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 4,
            transform: 'rotate(2deg)',
          }}
        >
          {pack.badge}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Pack Card — Soft Capsule
═══════════════════════════════════════════ */
function CapsulePackCard({
  pack,
  selected,
  onSelect,
  config,
}: {
  pack: BundlePack;
  selected: boolean;
  onSelect: () => void;
  config: BundleQtyConfig;
}) {
  const discount = getDiscountLabel(pack);
  const savings = getSavingsLabel(pack);

  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${selected ? config.colorCardSelected : pack.highlight ? config.colorHighlightBorder : config.colorCardBorder}`,
        borderRadius: 50,
        background: selected ? config.colorCardSelectedBg : pack.highlight ? config.colorHighlightBg : config.colorCardBg,
        padding: '12px 20px',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: selected
          ? `0 4px 16px ${config.colorCardSelected}30`
          : '0 1px 4px rgba(0,0,0,0.05)',
        position: 'relative',
        animationName:
          pack.highlight && config.showRecommendedPulse && !selected ? 'bqPulseRing' : 'none',
        animationDuration: '2.2s',
        animationIterationCount: 'infinite',
      }}
    >
      {/* Pill de cantidad */}
      <div
        style={{
          background: selected ? config.colorCardSelected : `${config.colorCardSelected}18`,
          color: selected ? '#fff' : config.colorCardSelected,
          fontSize: 14,
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: 30,
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        x{pack.qty}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: config.colorTitle }}>{pack.label}</div>
        {config.showSavingsTotal && savings && (
          <div style={{ fontSize: 11, color: config.colorSavings, fontWeight: 600 }}>{savings}</div>
        )}
      </div>

      {discount && (
        <div
          style={{
            background: selected ? config.colorCardSelected : `${config.colorSavings}18`,
            color: selected ? '#fff' : config.colorSavings,
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 30,
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          {discount}
        </div>
      )}

      {pack.showBadge && pack.badge && (
        <div
          style={{
            position: 'absolute',
            top: -9,
            left: '50%',
            transform: 'translateX(-50%)',
            background: config.colorBadgeBg,
            color: config.colorBadgeText,
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
          }}
        >
          {pack.badge}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Value Rail
═══════════════════════════════════════════ */
function ValueRail({
  packs,
  selectedIdx,
  config,
}: {
  packs: BundlePack[];
  selectedIdx: number;
  config: BundleQtyConfig;
}) {
  if (!config.showValueRail || packs.length < 2) return null;
  const pct = (selectedIdx / (packs.length - 1)) * 100;

  return (
    <div style={{ margin: '8px 4px 12px', position: 'relative' }}>
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: '#e5e7eb',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${config.colorCardSelected}80, ${config.colorCardSelected})`,
            borderRadius: 2,
            transition: 'width 0.35s ease',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {packs.map((p, i) => (
          <div
            key={i}
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: i <= selectedIdx ? config.colorCardSelected : '#d1d5db',
              transition: 'color 0.3s',
            }}
          >
            x{p.qty}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Selection Summary
═══════════════════════════════════════════ */
function SelectionSummary({
  pack,
  config,
}: {
  pack: BundlePack;
  config: BundleQtyConfig;
}) {
  if (!config.showSelectionSummary) return null;
  const savings = getSavingsLabel(pack);

  return (
    <div
      style={{
        background: `${config.colorCardSelected}10`,
        border: `1.5px solid ${config.colorCardSelected}30`,
        borderRadius: 10,
        padding: '10px 14px',
        marginTop: 12,
        fontSize: 12,
        fontWeight: 600,
        color: config.colorTitle,
        animation: 'bqFadeIn 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
      }}
    >
      <span>✓ Seleccionaste</span>
      <span
        style={{
          background: config.colorCardSelected,
          color: '#fff',
          padding: '1px 8px',
          borderRadius: 6,
          fontSize: 11,
        }}
      >
        {pack.label} x{pack.qty}
      </span>
      {savings && (
        <span style={{ color: config.colorSavings }}>· {savings}</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Widget Bundle (core visual)
═══════════════════════════════════════════ */
function BundleWidget({
  config,
  selectedIdx,
  onSelect,
  animStamp,
}: {
  config: BundleQtyConfig;
  selectedIdx: number;
  onSelect: (i: number) => void;
  animStamp: boolean;
}) {
  const enabledPacks = config.packs
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter((p) => p.enabled);

  const enabledSelectedIdx = enabledPacks.findIndex((_, i) => {
    const absIdx = config.packs
      .map((p, idx) => ({ ...p, idx }))
      .filter((p) => p.enabled)
      .findIndex((p, i) => i === selectedIdx);
    return i === selectedIdx;
  });

  return (
    <div
      style={{
        background: config.colorBg,
        border: `1.5px solid ${config.colorBorder}`,
        borderRadius: 16,
        padding: '18px 16px',
        textAlign: config.alignment,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Título */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: config.colorTitle,
          marginBottom: 4,
        }}
      >
        {config.title}
      </div>

      {/* Subtítulo */}
      {config.showSubtitle && config.subtitle && (
        <div
          style={{
            fontSize: 12,
            color: config.colorSubtitle,
            marginBottom: 14,
          }}
        >
          {config.subtitle}
        </div>
      )}

      {/* Value Rail */}
      {config.showValueRail && (
        <ValueRail
          packs={enabledPacks}
          selectedIdx={selectedIdx}
          config={config}
        />
      )}

      {/* Packs */}
      <div
        style={{
          display: 'flex',
          flexDirection: config.layout === 'horizontal' ? 'row' : 'column',
          gap: config.style === 'capsule' ? 10 : 8,
          flexWrap: config.layout === 'horizontal' ? 'wrap' : 'nowrap',
        }}
      >
        {enabledPacks.map((pack, i) => {
          const sel = i === selectedIdx;
          if (config.style === 'stack') {
            return (
              <StackPackCard
                key={i}
                pack={pack}
                selected={sel}
                onSelect={() => onSelect(i)}
                config={config}
                animStamp={animStamp && sel}
              />
            );
          }
          if (config.style === 'ladder') {
            return (
              <LadderPackCard
                key={i}
                pack={pack}
                selected={sel}
                onSelect={() => onSelect(i)}
                config={config}
                index={i}
                total={enabledPacks.length}
              />
            );
          }
          if (config.style === 'ticket') {
            return (
              <TicketPackCard
                key={i}
                pack={pack}
                selected={sel}
                onSelect={() => onSelect(i)}
                config={config}
              />
            );
          }
          return (
            <CapsulePackCard
              key={i}
              pack={pack}
              selected={sel}
              onSelect={() => onSelect(i)}
              config={config}
            />
          );
        })}
      </div>

      {/* Selection summary */}
      {enabledPacks[selectedIdx] && (
        <SelectionSummary pack={enabledPacks[selectedIdx]} config={config} />
      )}

      {/* Footer note */}
      {config.showFooterNote && config.footerNote && (
        <div
          style={{
            fontSize: 11,
            color: config.colorFooterNote,
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          {config.footerNote}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MOCK: Home
═══════════════════════════════════════════ */
function HomeMock({
  config,
  selectedIdx,
  onSelect,
  animStamp,
  isMobile,
}: {
  config: BundleQtyConfig;
  selectedIdx: number;
  onSelect: (i: number) => void;
  animStamp: boolean;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        background: '#f8fafc',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        marginBottom: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Browser bar */}
      <div
        style={{
          background: '#1e293b',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ef4444', '#f59e0b', '#10b981'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            background: '#334155',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 10,
            color: '#94a3b8',
          }}
        >
          tutienda.mitiendanube.com
        </div>
      </div>

      {/* Nav */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>MiMarca</div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#64748b' }}>
            <span>Inicio</span>
            <span>Productos</span>
            <span>Contacto</span>
          </div>
        )}
        <div style={{ fontSize: 16 }}>🛒</div>
      </div>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
          padding: isMobile ? '16px 12px' : '20px 24px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 16,
          alignItems: isMobile ? 'stretch' : 'center',
        }}
      >
        {/* Texto hero */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            NUEVA COLECCIÓN
          </div>
          <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: '#1e293b', lineHeight: 1.2, marginBottom: 6 }}>
            Suplementos premium
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>
            Calidad garantizada. Resultados reales.
          </div>
          <div
            style={{
              display: 'inline-block',
              background: '#6366f1',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 20,
            }}
          >
            Ver productos
          </div>
        </div>

        {/* Widget aquí */}
        {config.showOnHome && (
          <div style={{ flex: isMobile ? 'none' : '0 0 280px' }}>
            <div style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, textAlign: 'center' }}>
              ── NEVUX WIDGET ──
            </div>
            <BundleWidget
              config={config}
              selectedIdx={selectedIdx}
              onSelect={onSelect}
              animStamp={animStamp}
            />
          </div>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          padding: '8px 16px',
          background: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          fontSize: 10,
          color: '#94a3b8',
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        🏠 Vista — Página de inicio
        {!config.showOnHome && (
          <span style={{ marginLeft: 8, color: '#f59e0b' }}>⚠️ Widget desactivado para Home</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MOCK: Product Page
═══════════════════════════════════════════ */
function ProductMock({
  config,
  selectedIdx,
  onSelect,
  animStamp,
  isMobile,
}: {
  config: BundleQtyConfig;
  selectedIdx: number;
  onSelect: (i: number) => void;
  animStamp: boolean;
  isMobile: boolean;
}) {
  const widgetBlock = config.showOnProduct ? (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, textAlign: 'center' }}>
        ── NEVUX WIDGET ──
      </div>
      <BundleWidget
        config={config}
        selectedIdx={selectedIdx}
        onSelect={onSelect}
        animStamp={animStamp}
      />
    </div>
  ) : null;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Nav */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 11, color: '#94a3b8' }}>← Volver</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>MiMarca</div>
        <div style={{ fontSize: 16 }}>🛒</div>
      </div>

      {/* Producto */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 0,
        }}
      >
        {/* Imagen del producto */}
        <div
          style={{
            width: isMobile ? '100%' : 200,
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
            minHeight: isMobile ? 140 : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: isMobile ? 48 : 56, opacity: 0.6 }}>💊</div>
        </div>

        {/* Info producto */}
        <div style={{ flex: 1, padding: isMobile ? '14px 12px' : '16px 20px' }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 8 }}>
            Inicio / Suplementos / <span style={{ color: '#6366f1' }}>Proteína Whey Pro</span>
          </div>

          {/* Widget before-title */}
          {config.productPosition === 'before-title' && widgetBlock}

          {/* Título */}
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
            Proteína Whey Pro
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
            1kg — Sabor Chocolate
          </div>

          {/* Precio */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>$12.990</div>
            <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>$15.490</div>
          </div>

          {/* Widget before-button */}
          {config.productPosition === 'before-button' && widgetBlock}

          {/* Botón agregar */}
          <div
            style={{
              background: '#1e293b',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              padding: '12px 16px',
              borderRadius: 10,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Agregar al carrito
          </div>

          {!config.showOnProduct && (
            <div style={{ fontSize: 10, color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              ⚠️ Widget desactivado para Producto
            </div>
          )}
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          padding: '8px 16px',
          background: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          fontSize: 10,
          color: '#94a3b8',
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        🛍 Vista — Página de producto
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BundleQtyPreview({ config, previewMode }: BundleQtyPreviewProps) {
  useEffect(() => {
    injectKeyframes();
  }, []);

  // Selección inicial: el pack highlight o el primero habilitado
  const getDefaultIdx = () => {
    const enabledPacks = config.packs.filter((p) => p.enabled);
    const highlightIdx = enabledPacks.findIndex((p) => p.highlight);
    return highlightIdx >= 0 ? highlightIdx : 0;
  };

  const [selectedIdx, setSelectedIdx] = useState(getDefaultIdx);
  const [animStamp, setAnimStamp] = useState(false);

  // Resetear selección si cambian los packs
  useEffect(() => {
    setSelectedIdx(getDefaultIdx());
  }, [config.packs]);

  const handleSelect = (i: number) => {
    setSelectedIdx(i);
    setAnimStamp(true);
    setTimeout(() => setAnimStamp(false), 500);
  };

  const isMobile = previewMode === 'mobile';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <HomeMock
        config={config}
        selectedIdx={selectedIdx}
        onSelect={handleSelect}
        animStamp={animStamp}
        isMobile={isMobile}
      />
      <ProductMock
        config={config}
        selectedIdx={selectedIdx}
        onSelect={handleSelect}
        animStamp={animStamp}
        isMobile={isMobile}
      />
    </div>
  );
  }
