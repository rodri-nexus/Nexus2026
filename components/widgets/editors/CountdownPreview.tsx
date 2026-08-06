// components/widgets/editors/CountdownPreview.tsx
'use client';

import { useEffect, useState, useRef } from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface CountdownConfig {
  title: string;
  subtitle: string;
  mode: 'flash' | 'fixed';
  flashMinutes: number;
  endDate: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  autoRestart: boolean;
  showOnProduct: boolean;
  productPosition: 'before-button' | 'before-title';
  showAsTopBar: boolean;
  showOnCart: boolean;
  style: 'clasico' | 'retro' | 'glass' | 'neon' | 'flash';
  alignment: 'center' | 'left';
  showLabels: boolean;
  scale: number;
  bgType: 'solid' | 'gradient';
  colorWidgetBg: string;
  colorSubtitleBg: string;
  colorClockBg: string;
  colorTitle: string;
  colorSubtitle: string;
  colorNumbers: string;
  auraEnabled: boolean;
  colorAuraCalm: string;
  colorAuraMedium: string;
  colorAuraUrgent: string;
  effectsIntensity: number;
  showShimmer: boolean;
  showProgressRing: boolean;
  showParticles: boolean;
  showBounce: boolean;
  showGlowBreath: boolean;
  showVibration: boolean;
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  fontSizeClock: string;
  borderRadiusClock: number;
  borderRadiusWidget: number;
  paddingWidget: number;
  paddingClock: number;
}

interface Props {
  config: CountdownConfig;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isUrgent: boolean;
  isFinished: boolean;
}

/* ═══════════════════════════════════════════
   HOOK: tiempo restante
═══════════════════════════════════════════ */
function useTimeLeft(config: CountdownConfig): TimeLeft {
  const calc = (): TimeLeft => {
    if (!config.endDate) {
      const total = (config.flashMinutes || 15) * 60;
      return {
        days: 0,
        hours: 0,
        minutes: config.flashMinutes || 15,
        seconds: 0,
        totalSeconds: total,
        isUrgent: false,
        isFinished: false,
      };
    }
    const diff = new Date(config.endDate).getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isUrgent: false, isFinished: true };
    }
    const t = Math.floor(diff / 1000);
    return {
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
      totalSeconds: t,
      isUrgent: t <= 10,
      isFinished: false,
    };
  };

  const [time, setTime] = useState<TimeLeft>(calc);

  useEffect(() => {
    setTime(calc());
    const int = setInterval(() => {
      const next = calc();
      if (next.isFinished && config.autoRestart) {
        // Reinicia con flashMinutes
        const mins = config.flashMinutes || 15;
        setTime({
          days: 0,
          hours: 0,
          minutes: mins,
          seconds: 0,
          totalSeconds: mins * 60,
          isUrgent: false,
          isFinished: false,
        });
      } else {
        setTime(next);
      }
    }, 1000);
    return () => clearInterval(int);
  }, [config.endDate, config.autoRestart, config.flashMinutes]);

  return time;
}

/* ═══════════════════════════════════════════
   HELPER: aura color
═══════════════════════════════════════════ */
function getAuraColor(cfg: CountdownConfig, total: number): string | null {
  if (!cfg.auraEnabled) return null;
  if (total <= 600) return cfg.colorAuraUrgent;
  if (total <= 3600) return cfg.colorAuraMedium;
  return cfg.colorAuraCalm;
}

/* ═══════════════════════════════════════════
   DIGIT: dígito con estilos por tema
═══════════════════════════════════════════ */
function Digit({
  value,
  config,
  compact = false,
  isUrgent,
}: {
  value: string;
  config: CountdownConfig;
  compact?: boolean;
  isUrgent: boolean;
}) {
  const prevRef = useRef(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlip(true);
      const t = setTimeout(() => setFlip(false), 400);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const intensity = config.effectsIntensity / 100;
  const bounceAnim = config.showBounce && flip ? 'nvxBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : '';

  // FLASH STYLE
  if (config.style === 'flash') {
    const size = compact ? 30 : 44;
    return (
      <div
        style={{
          minWidth: size,
          height: size,
          background: config.colorClockBg,
          color: config.colorNumbers,
          borderRadius: config.borderRadiusClock,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? '15px' : config.fontSizeClock,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          padding: `${compact ? 4 : config.paddingClock}px ${compact ? 8 : config.paddingClock + 4}px`,
          boxShadow: `
            0 2px 6px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -2px 4px rgba(0,0,0,0.3)
          `,
          animation: `${bounceAnim} ${isUrgent && config.showVibration ? ', nvxVibrate 0.15s linear infinite' : ''}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Reflejo cristal interno */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
          pointerEvents: 'none',
          borderTopLeftRadius: config.borderRadiusClock,
          borderTopRightRadius: config.borderRadiusClock,
        }} />
        {value}
      </div>
    );
  }

  // GLASS STYLE
  if (config.style === 'glass') {
    const size = compact ? 32 : 56;
    return (
      <div
        style={{
          minWidth: size,
          height: size,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          color: config.colorNumbers,
          borderRadius: config.borderRadiusClock,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? '15px' : config.fontSizeClock,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          padding: config.paddingClock,
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.4),
            ${isUrgent ? `0 0 ${20 * intensity}px rgba(239,68,68,0.5)` : ''}
          `,
          animation: `${bounceAnim} ${isUrgent && config.showVibration ? ', nvxVibrate 0.15s linear infinite' : ''}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {value}
      </div>
    );
  }

  // NEON STYLE
  if (config.style === 'neon') {
    const size = compact ? 32 : 56;
    const glow = 10 * intensity;
    return (
      <div
        style={{
          minWidth: size,
          height: size,
          background: '#0a0a1a',
          color: config.colorNumbers,
          borderRadius: config.borderRadiusClock,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? '15px' : config.fontSizeClock,
          fontWeight: 900,
          fontFamily: "'Courier New', monospace",
          fontVariantNumeric: 'tabular-nums',
          padding: config.paddingClock,
          border: `1px solid ${config.colorNumbers}40`,
          boxShadow: `
            0 0 ${glow}px ${config.colorNumbers}30,
            inset 0 0 ${glow}px ${config.colorNumbers}10
          `,
          textShadow: `0 0 ${glow}px ${config.colorNumbers}80, 0 0 ${glow * 2}px ${config.colorNumbers}40`,
          animation: `${bounceAnim} ${isUrgent ? ', nvxNeonPulse 1s ease infinite' : ''}`,
        }}
      >
        {value}
      </div>
    );
  }

  // RETRO
  if (config.style === 'retro') {
    return (
      <div style={{ display: 'inline-flex', gap: 2 }}>
        {value.split('').map((d, i) => (
          <div
            key={i}
            style={{
              width: compact ? 22 : 32,
              height: compact ? 30 : 44,
              background: 'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: compact ? '15px' : config.fontSizeClock,
              fontWeight: 900,
              color: config.colorNumbers,
              fontFamily: "'Courier New', monospace",
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
              animation: flip ? 'nvxRetroFlip 0.3s ease' : 'none',
            }}
          >
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
              background: 'rgba(0,0,0,0.5)',
            }} />
            {d}
          </div>
        ))}
      </div>
    );
  }

  // CLÁSICO
  const size = compact ? 30 : 52;
  return (
    <div
      style={{
        minWidth: size,
        height: size,
        background: config.colorClockBg,
        color: config.colorNumbers,
        borderRadius: config.borderRadiusClock,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: compact ? '15px' : config.fontSizeClock,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        padding: config.paddingClock,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        animation: bounceAnim,
      }}
    >
      {value}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CLOCK UNIT
═══════════════════════════════════════════ */
function ClockUnit({
  value,
  label,
  config,
  compact = false,
  isUrgent,
}: {
  value: number;
  label: string;
  config: CountdownConfig;
  compact?: boolean;
  isUrgent: boolean;
}) {
  const s = String(value).padStart(2, '0');
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Digit value={s} config={config} compact={compact} isUrgent={isUrgent} />
      {config.showLabels && !compact && (
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          color: config.colorNumbers,
          opacity: 0.75,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textShadow: config.style === 'neon' ? `0 0 6px ${config.colorNumbers}60` : 'none',
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEPARATOR
═══════════════════════════════════════════ */
function Separator({ config, compact = false }: { config: CountdownConfig; compact?: boolean }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setOn((v) => !v), 500);
    return () => clearInterval(i);
  }, []);

  const dotSize = compact ? 3 : 4;
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: compact ? 3 : 4,
      paddingBottom: compact ? 0 : 14,
      opacity: on ? 1 : 0.2,
      transition: 'opacity 0.3s ease',
    }}>
      <div style={{
        width: dotSize, height: dotSize, borderRadius: '50%',
        background: config.colorNumbers, opacity: 0.85,
        boxShadow: config.style === 'neon' ? `0 0 4px ${config.colorNumbers}` : 'none',
      }} />
      <div style={{
        width: dotSize, height: dotSize, borderRadius: '50%',
        background: config.colorNumbers, opacity: 0.85,
        boxShadow: config.style === 'neon' ? `0 0 4px ${config.colorNumbers}` : 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   WIDGET FULL (para product / preview)
═══════════════════════════════════════════ */
function WidgetFull({ config, time }: { config: CountdownConfig; time: TimeLeft }) {
  const [shimmerKey, setShimmerKey] = useState(0);
  const intensity = config.effectsIntensity / 100;
  const auraColor = getAuraColor(config, time.totalSeconds);

  useEffect(() => {
    if (!config.showShimmer) return;
    const i = setInterval(() => setShimmerKey((k) => k + 1), 5000);
    return () => clearInterval(i);
  }, [config.showShimmer]);

  const units = [
    ...(config.showDays ? [{ v: time.days, l: 'DÍAS' }] : []),
    ...(config.showHours ? [{ v: time.hours, l: 'HRS' }] : []),
    ...(config.showMinutes ? [{ v: time.minutes, l: 'MIN' }] : []),
    ...(config.showSeconds ? [{ v: time.seconds, l: 'SEG' }] : []),
  ];

  if (units.length === 0) {
    return (
      <div style={{
        padding: 20, background: '#fff7ed', border: '1.5px dashed #fb923c',
        borderRadius: 12, textAlign: 'center', fontSize: 13, color: '#c2410c', fontWeight: 700,
      }}>
        ⚠️ Activá al menos una unidad
      </div>
    );
  }

  const bg = config.style === 'neon'
    ? '#0a0a1a'
    : config.bgType === 'gradient'
      ? `linear-gradient(135deg, ${config.colorWidgetBg} 0%, ${config.colorSubtitleBg} 100%)`
      : config.colorWidgetBg;

  const border = config.style === 'neon'
    ? `1px solid ${config.colorNumbers}30`
    : config.style === 'glass'
      ? '1px solid rgba(255,255,255,0.2)'
      : 'none';

  const boxShadow = config.style === 'neon'
    ? `0 0 ${30 * intensity}px ${config.colorNumbers}20, 0 8px 32px rgba(0,0,0,0.3)`
    : config.style === 'glass'
      ? '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
      : config.style === 'flash'
        ? `0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)`
        : '0 8px 32px rgba(0,0,0,0.12)';

  const progressPct = Math.max(5, Math.min(100, (time.totalSeconds / (config.flashMinutes * 60 || 900)) * 100));

  return (
    <div style={{
      position: 'relative',
      background: bg,
      borderRadius: config.borderRadiusWidget,
      padding: config.paddingWidget,
      textAlign: config.alignment,
      overflow: 'hidden',
      boxShadow,
      border,
      animation: time.isUrgent && config.showVibration ? 'nvxVibrateSlow 0.3s linear infinite' : '',
    }}>
      {/* Aura */}
      {auraColor && (
        <div style={{
          position: 'absolute',
          inset: -30,
          borderRadius: 'inherit',
          background: `radial-gradient(ellipse, ${auraColor}66 0%, transparent 70%)`,
          filter: 'blur(24px)',
          opacity: 0.5 * intensity,
          animation: config.showGlowBreath ? 'nvxAuraPulse 2.5s ease infinite' : 'none',
          zIndex: 0,
          pointerEvents: 'none',
        }} />
      )}

      {/* Textura noise sutil */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
        opacity: 0.08 * intensity,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />

      {/* Shimmer */}
      {config.showShimmer && (
        <div
          key={shimmerKey}
          style={{
            position: 'absolute',
            top: -20, left: -60,
            width: 60, height: '200%',
            background: config.style === 'neon'
              ? `linear-gradient(90deg, transparent, ${config.colorNumbers}20, transparent)`
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            transform: 'rotate(15deg)',
            animation: 'nvxShimmer 1.4s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)',
        pointerEvents: 'none',
        opacity: 0.3 * intensity,
      }} />

      {/* Partículas */}
      {config.showParticles && time.totalSeconds <= 600 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              position: 'absolute',
              bottom: 0,
              left: `${15 + i * 18}%`,
              width: 4, height: 4,
              borderRadius: '50%',
              background: config.style === 'neon' ? config.colorNumbers : 'rgba(255,255,255,0.7)',
              boxShadow: config.style === 'neon'
                ? `0 0 6px ${config.colorNumbers}`
                : '0 0 4px rgba(255,255,255,0.5)',
              animation: `nvxParticle ${2 + i * 0.4}s ease infinite`,
              animationDelay: `${i * 0.6}s`,
            }} />
          ))}
        </div>
      )}

      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {config.title && (
          <div style={{
            fontSize: config.fontSizeTitle,
            fontWeight: 800,
            color: config.colorTitle,
            marginBottom: config.subtitle ? 4 : 12,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            textShadow: config.style === 'neon' ? `0 0 10px ${config.colorTitle}60` : 'none',
          }}>
            {config.title}
          </div>
        )}

        {/* Reloj */}
        {time.isFinished ? (
          <div style={{ padding: 12, color: config.colorTitle, opacity: 0.8, fontWeight: 700 }}>
            ⏰ ¡Terminó!
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: config.alignment === 'center' ? 'center' : 'flex-start',
            gap: 6,
            flexWrap: 'wrap',
            marginTop: 8,
            marginBottom: config.subtitle ? 10 : 0,
          }}>
            {units.map((u, i) => (
              <div key={u.l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ClockUnit value={u.v} label={u.l} config={config} isUrgent={time.isUrgent} />
                {i < units.length - 1 && <Separator config={config} />}
              </div>
            ))}
          </div>
        )}

        {config.subtitle && (
          <div style={{
            fontSize: config.fontSizeSubtitle,
            fontWeight: 500,
            color: config.colorSubtitle,
            opacity: 0.9,
            marginTop: 6,
          }}>
            {config.subtitle}
          </div>
        )}

        {/* Progress */}
        {config.showProgressRing && !time.isFinished && (
          <div style={{
            marginTop: 12,
            height: 4,
            borderRadius: 2,
            background: config.style === 'neon' ? `${config.colorNumbers}20` : 'rgba(255,255,255,0.2)',
            overflow: 'hidden',
            maxWidth: 200,
            ...(config.alignment === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: config.style === 'neon' ? config.colorNumbers : 'rgba(255,255,255,0.8)',
              transition: 'width 1s linear',
              boxShadow: config.style === 'neon' ? `0 0 8px ${config.colorNumbers}` : 'none',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WIDGET COMPACT (announcement bar / home)
═══════════════════════════════════════════ */
function WidgetCompact({ config, time }: { config: CountdownConfig; time: TimeLeft }) {
  const units = [
    ...(config.showDays ? [{ v: time.days, l: 'D' }] : []),
    ...(config.showHours ? [{ v: time.hours, l: 'H' }] : []),
    ...(config.showMinutes ? [{ v: time.minutes, l: 'M' }] : []),
    ...(config.showSeconds ? [{ v: time.seconds, l: 'S' }] : []),
  ];

  const bg = config.bgType === 'gradient'
    ? `linear-gradient(90deg, ${config.colorWidgetBg} 0%, ${config.colorSubtitleBg} 100%)`
    : config.colorWidgetBg;

  return (
    <div style={{
      background: bg,
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      color: config.colorTitle,
      fontWeight: 700,
      fontSize: 13,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {config.title && <span>{config.title}</span>}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {units.map((u, i) => (
          <div key={u.l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Digit value={String(u.v).padStart(2, '0')} config={config} compact isUrgent={time.isUrgent} />
            {i < units.length - 1 && <span style={{ color: config.colorNumbers, opacity: 0.7 }}>:</span>}
          </div>
        ))}
      </div>
      <button style={{
        padding: '6px 14px',
        background: '#ffffff',
        color: config.colorWidgetBg,
        border: 'none',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 800,
        cursor: 'pointer',
        letterSpacing: '0.05em',
      }}>
        SHOP NOW
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MOCK: página HOME
═══════════════════════════════════════════ */
function HomeMock({ config, time }: { config: CountdownConfig; time: TimeLeft }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    }}>
      {/* Announcement bar (widget) */}
      {config.showAsTopBar && <WidgetCompact config={config} time={time} />}

      {/* Header mock */}
      <div style={{
        padding: '12px 16px',
        background: '#1a1a2e',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>MODERN STORE</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#d1d5db' }}>
          <span>Shop</span><span>Colecciones</span><span>Sobre</span><span>🛒</span>
        </div>
      </div>

      {/* Hero mock */}
      <div style={{
        padding: '30px 20px',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>
          Colección Verano 2026
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          Descubrí las mejores ofertas
        </div>
        <button style={{
          padding: '10px 20px',
          background: '#1a1a2e',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'default',
        }}>
          Ver productos
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MOCK: página PRODUCTO
═══════════════════════════════════════════ */
function ProductMock({ config, time }: { config: CountdownConfig; time: TimeLeft }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    }}>
      <div style={{
        padding: '12px 16px',
        background: '#1a1a2e',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>MODERN STORE</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#d1d5db' }}>
          <span>Shop</span><span>Colecciones</span><span>🛒</span>
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Imagen mock */}
        <div style={{
          width: 130,
          height: 160,
          background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          flexShrink: 0,
        }}>
          🛍
        </div>

        {/* Info del producto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Widget "before-title" */}
          {config.showOnProduct && config.productPosition === 'before-title' && (
            <div style={{ marginBottom: 12 }}>
              <WidgetFull config={config} time={time} />
            </div>
          )}

          <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Colección Verano
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', marginTop: 4 }}>
            Camisa Lino Premium
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginTop: 8 }}>
            $68.00
          </div>

          {/* Widget "before-button" */}
          {config.showOnProduct && config.productPosition === 'before-button' && (
            <div style={{ marginTop: 14 }}>
              <WidgetFull config={config} time={time} />
            </div>
          )}

          <button style={{
            marginTop: 14,
            width: '100%',
            padding: '12px',
            background: '#1a1a2e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'default',
          }}>
            🛒 Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownPreview({ config }: Props) {
  const time = useTimeLeft(config);
  const showHome = config.showAsTopBar;
  const showProduct = config.showOnProduct;
  const showBoth = showHome && showProduct;

  return (
    <>
      <style>{`
        @keyframes nvxBounce {
          0%   { transform: scale(1) translateY(0); }
          40%  { transform: scale(1.15) translateY(-2px); }
          70%  { transform: scale(0.95) translateY(1px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes nvxRetroFlip {
          0% { transform: scaleY(1); opacity: 1; }
          40%,60% { transform: scaleY(0); opacity: 0.5; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes nvxNeonPulse {
          0%,100% { opacity: 1; filter: brightness(1); }
          50%     { opacity: 0.9; filter: brightness(1.4); }
        }
        @keyframes nvxAuraPulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50%     { opacity: 0.65; transform: scale(1.06); }
        }
        @keyframes nvxShimmer {
          0%   { transform: translateX(0) rotate(15deg); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateX(600%) rotate(15deg); opacity: 0; }
        }
        @keyframes nvxParticle {
          0%   { transform: translateY(0) scale(1); opacity: 0.6; }
          50%  { transform: translateY(-24px) scale(1.2); opacity: 0.3; }
          100% { transform: translateY(-50px) scale(0.6); opacity: 0; }
        }
        @keyframes nvxVibrate {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        @keyframes nvxVibrateSlow {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Ninguna ubicación activa */}
        {!showHome && !showProduct && (
          <div style={{
            padding: 30,
            background: '#fff7ed',
            border: '1.5px dashed #fb923c',
            borderRadius: 12,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📍</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#c2410c', marginBottom: 4 }}>
              Elegí una ubicación
            </div>
            <div style={{ fontSize: 12, color: '#ea580c' }}>
              Activá "Home" o "Producto" en la sección Ubicación para ver el preview
            </div>
          </div>
        )}

        {/* HOME */}
        {showHome && (
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
              paddingLeft: 4,
            }}>
              🏠 Vista en la Home
            </div>
            <HomeMock config={config} time={time} />
          </div>
        )}

        {/* Divisor si hay ambos */}
        {showBoth && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 8px',
          }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #d1d5db, transparent)' }} />
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>Y ADEMÁS EN</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #d1d5db, transparent)' }} />
          </div>
        )}

        {/* PRODUCTO */}
        {showProduct && (
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
              paddingLeft: 4,
            }}>
              🛍 Vista en el Producto
            </div>
            <ProductMock config={config} time={time} />
          </div>
        )}
      </div>
    </>
  );
   }
