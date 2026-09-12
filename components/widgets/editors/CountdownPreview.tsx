// components/widgets/editors/CountdownPreview.tsx
'use client';

import { useEffect, useState, useRef, useMemo } from 'react';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface CountdownConfig {
  title: string;
  subtitle: string;
  mode?: 'fixed' | 'duration';
  endDate: string;
  durationMinutes?: number;
  autoRestart: boolean;
  showDays: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  showLabels: boolean;
  style: 'clasico' | 'retro' | 'glass' | 'neon' | 'flash';
  alignment: 'left' | 'center';
  bgType: 'solid' | 'gradient';
  colorWidgetBg: string;
  colorWidgetBg2?: string;
  gradientDirection?: 'to bottom' | 'to right' | 'to bottom right';
  colorSubtitleBg: string;
  colorClockBg: string;
  colorTitle: string;
  colorSubtitle: string;
  colorNumbers: string;
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  fontSizeClock: string;
  borderRadiusClock: number;
  borderRadiusWidget: number;
  paddingWidget: number;
  paddingClock: number;
  urgencyEnabled?: boolean;
  colorClockBgMedium?: string;
  colorClockBgCritical?: string;
  flashMinutes?: number;
  campaignTheme?: 'none' | 'black-friday' | 'hot-sale' | 'cyber-monday' | 'navidad' | 'san-valentin' | 'dia-madre-padre' | 'liquidacion';
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
  isFinished: boolean;
  percentConsumed: number;
}

type UrgencyState = 'normal' | 'medium' | 'critical';

/* ═══════════════════════════════════════════
   PRESETS DE FECHAS ESPECIALES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const THEME_PRESETS: Record<string, { themeColor: string; accentColor: string; badge: string; emoji: string }> = {
  "black-friday": { themeColor: "#111827", accentColor: "#F59E0B", badge: "🔥 BLACK FRIDAY", emoji: "🔥" },
  "hot-sale": { themeColor: "#0F172A", accentColor: "#EF4444", badge: "⚡ HOT SALE", emoji: "⚡" },
  "cyber-monday": { themeColor: "#090D16", accentColor: "#3B82F6", badge: "🚀 CYBER MONDAY", emoji: "🚀" },
  "navidad": { themeColor: "#064E3B", accentColor: "#EF4444", badge: "🎄 ESPECIAL NAVIDAD", emoji: "🎄" },
  "san-valentin": { themeColor: "#831843", accentColor: "#F43F5E", badge: "💘 SAN VALENTÍN", emoji: "💘" },
  "dia-madre-padre": { themeColor: "#312E81", accentColor: "#10B981", badge: "🎁 REGALO ESPECIAL", emoji: "🎁" },
  "liquidacion": { themeColor: "#7F1D1D", accentColor: "#FBBF24", badge: "🏷️ SALE FINAL", emoji: "🏷️" },
};

/* ═══════════════════════════════════════════
   HOOK: TIEMPO RESTANTE (Regla #9 al inicio)
═══════════════════════════════════════════ */
function useTimeLeft(config: CountdownConfig): TimeLeft {
  const startTime = useRef<number>(Date.now());
  const totalDuration = useRef<number>(
    (config.durationMinutes || 15) * 60 * 1000
  );

  useEffect(() => {
    startTime.current = Date.now();
    totalDuration.current = (config.durationMinutes || 15) * 60 * 1000;
  }, [config.mode, config.durationMinutes]);

  const getEndTime = (): { end: number; total: number } => {
    if (config.mode === 'duration') {
      return {
        end: startTime.current + totalDuration.current,
        total: totalDuration.current,
      };
    }

    if (config.endDate) {
      const t = new Date(config.endDate).getTime();
      if (!isNaN(t) && t > Date.now()) {
        const total = t - (Date.now() - 7 * 24 * 60 * 60 * 1000);
        return { end: t, total };
      }
    }

    return {
      end: startTime.current + 15 * 60 * 1000,
      total: 15 * 60 * 1000,
    };
  };

  const calc = (): TimeLeft => {
    const { end, total } = getEndTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
      return {
        days: 0, hours: 0, minutes: 0, seconds: 0,
        totalSeconds: 0, isFinished: true, percentConsumed: 100,
      };
    }

    const t = Math.floor(diff / 1000);
    const consumed = Math.max(0, Math.min(100, ((total - diff) / total) * 100));

    return {
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
      totalSeconds: t,
      isFinished: false,
      percentConsumed: consumed,
    };
  };

  const [time, setTime] = useState<TimeLeft>(calc);

  useEffect(() => {
    setTime(calc());

    const int = setInterval(() => {
      const next = calc();

      if (next.isFinished && config.autoRestart) {
        startTime.current = Date.now();
        totalDuration.current = (config.durationMinutes || 15) * 60 * 1000;
        setTime(calc());
      } else {
        setTime(next);
      }
    }, 1000);

    return () => clearInterval(int);
  }, [config.endDate, config.autoRestart, config.durationMinutes, config.mode]);

  return time;
}

function getUrgencyState(percentConsumed: number, enabled: boolean): UrgencyState {
  if (!enabled) return 'normal';
  if (percentConsumed >= 67) return 'critical';
  if (percentConsumed >= 34) return 'medium';
  return 'normal';
}

function getClockBgColor(config: CountdownConfig, state: UrgencyState): string {
  if (state === 'critical') return config.colorClockBgCritical || '#dc2626';
  if (state === 'medium') return config.colorClockBgMedium || '#f59e0b';
  return config.colorClockBg || '#10B981';
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTES DE DÍGITOS (Regla #9 al inicio)
═══════════════════════════════════════════ */
function DigitClasico({
  value, config, bgColor, isCritical, numbersColor,
}: {
  value: string; config: CountdownConfig; bgColor: string; isCritical: boolean; numbersColor: string;
}) {
  const size = parseInt(config.fontSizeClock, 10) || 16;
  return (
    <div
      style={{
        minWidth: size * 2.4,
        minHeight: size * 2.4,
        background: bgColor,
        color: numbersColor,
        borderRadius: config.borderRadiusClock || 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: config.fontSizeClock,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        padding: `${config.paddingClock || 8}px ${config.paddingClock + 4}px`,
        lineHeight: 1,
        transition: 'background-color 0.4s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        animation: isCritical ? 'nvxCriticalPulse 1s ease-in-out infinite' : 'none',
      }}
    >
      {value}
    </div>
  );
}

function DigitRetro({
  value, config, bgColor, isCritical, numbersColor,
}: {
  value: string; config: CountdownConfig; bgColor: string; isCritical: boolean; numbersColor: string;
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

  const size = parseInt(config.fontSizeClock, 10) || 16;

  return (
    <div style={{ display: 'inline-flex', gap: 3 }}>
      {value.split('').map((d, i) => (
        <div
          key={i}
          style={{
            width: size * 1.4,
            height: size * 2.4,
            background: `linear-gradient(180deg, ${bgColor} 0%, ${bgColor} 49%, rgba(0,0,0,0.35) 50%, ${bgColor} 51%, ${bgColor} 100%)`,
            borderRadius: config.borderRadiusClock || 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: config.fontSizeClock,
            fontWeight: 900,
            color: numbersColor,
            fontFamily: "monospace",
            boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.4s ease',
            animation: flip
              ? 'nvxRetroFlip 0.3s ease'
              : isCritical
                ? 'nvxCriticalPulse 1s ease-in-out infinite'
                : 'none',
          }}
        >
          {d}
        </div>
      ))}
    </div>
  );
}

function ClockUnit({
  value, label, config, bgColor, isCritical, labelColor, numbersColor,
}: {
  value: number; label: string; config: CountdownConfig;
  bgColor: string; isCritical: boolean; labelColor: string; numbersColor: string;
}) {
  const s = String(value).padStart(2, '0');
  const Digit = config.style === 'retro' ? DigitRetro : DigitClasico;
  const labelSize = Math.max(9, Math.round((parseInt(config.fontSizeClock, 10) || 16) * 0.55));

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <Digit value={s} config={config} bgColor={bgColor} isCritical={isCritical} numbersColor={numbersColor} />
      {config.showLabels && (
        <span style={{
          fontSize: labelSize,
          fontWeight: 800,
          color: labelColor,
          opacity: 0.85,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

function Separator({ dotColor, config }: { dotColor: string; config: CountdownConfig }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setOn((v) => !v), 600);
    return () => clearInterval(i);
  }, []);

  const size = parseInt(config.fontSizeClock, 10) || 16;
  const dotSize = Math.max(4, Math.round(size * 0.2));

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: dotSize,
      paddingBottom: config.showLabels ? Math.round(size * 0.85) : 0,
      opacity: on ? 1 : 0.25,
      transition: 'opacity 0.2s ease',
    }}>
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: dotColor, opacity: 0.85 }} />
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: dotColor, opacity: 0.85 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownPreview({ config }: Props) {
  const time = useTimeLeft(config);

  const urgencyState = getUrgencyState(time.percentConsumed, !!config.urgencyEnabled);
  const baseClockBg = getClockBgColor(config, urgencyState);
  const isCritical = urgencyState === 'critical';

  // Detección de tema de Fechas Especiales activo
  const activeTheme = config.campaignTheme && config.campaignTheme !== 'none'
    ? THEME_PRESETS[config.campaignTheme]
    : null;

  // Colores efectivos con prioridad temática
  const effectiveBg = activeTheme
    ? activeTheme.themeColor
    : config.bgType === 'gradient'
    ? `linear-gradient(${config.gradientDirection || 'to bottom right'}, ${config.colorWidgetBg || '#05070B'}, ${config.colorWidgetBg2 || '#10B981'})`
    : config.colorWidgetBg || '#ffffff';

  const effectiveTitleColor = activeTheme ? '#ffffff' : config.colorTitle || '#000000';
  const effectiveClockBg = activeTheme ? activeTheme.accentColor : baseClockBg;
  const effectiveNumbersColor = activeTheme
    ? (['black-friday', 'liquidacion'].includes(config.campaignTheme || '') ? '#111827' : '#ffffff')
    : config.colorNumbers || '#ffffff';
  const effectiveLabelColor = activeTheme ? activeTheme.accentColor : config.colorTitle || '#000000';

  const units: { v: number; l: string }[] = useMemo(() => {
    const arr: { v: number; l: string }[] = [];
    const showDaysActive = config.showDays && time.days > 0;

    if (showDaysActive) arr.push({ v: time.days, l: 'DÍAS' });

    if (config.showHours !== false) {
      const hoursValue = showDaysActive ? time.hours : time.hours + time.days * 24;
      arr.push({ v: hoursValue, l: 'HRS' });
    }
    if (config.showMinutes !== false) arr.push({ v: time.minutes, l: 'MIN' });
    if (config.showSeconds !== false) arr.push({ v: time.seconds, l: 'SEG' });
    return arr;
  }, [time, config.showDays, config.showHours, config.showMinutes, config.showSeconds]);

  if (units.length === 0) {
    return (
      <div style={{
        padding: 20, background: '#fef2f2',
        border: '1.5px dashed #dc2626',
        borderRadius: 12, textAlign: 'center',
        fontSize: 13, color: '#dc2626', fontWeight: 700,
      }}>
        ⚠️ Activá al menos una unidad de tiempo
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes nvxRetroFlip {
          0% { transform: scaleY(1); opacity: 1; }
          40%,60% { transform: scaleY(0); opacity: 0.5; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes nvxCriticalPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.6);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 8px rgba(220, 38, 38, 0);
          }
        }
      `}</style>

      <div style={{
        background: effectiveBg,
        borderRadius: config.borderRadiusWidget || 16,
        padding: config.paddingWidget || 18,
        textAlign: config.alignment || 'center',
        border: activeTheme ? `1.5px solid ${activeTheme.accentColor}44` : '1px solid rgba(0,0,0,0.06)',
        boxShadow: activeTheme ? `0 8px 24px ${activeTheme.themeColor}55` : '0 6px 20px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
      }}>
        {/* Badge Temático de Campaña */}
        {activeTheme && (
          <div style={{
            marginBottom: 10,
            textAlign: config.alignment === 'center' ? 'center' : 'left',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: activeTheme.accentColor,
              color: ['black-friday', 'liquidacion'].includes(config.campaignTheme || '') ? '#111827' : '#ffffff',
              fontSize: '11px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 999,
              letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              {activeTheme.badge}
            </span>
          </div>
        )}

        {config.title && (
          <div style={{
            fontSize: config.fontSizeTitle || '18px',
            fontWeight: 800,
            color: effectiveTitleColor,
            marginBottom: 12,
            lineHeight: 1.2,
            textAlign: config.alignment === 'center' ? 'center' : 'left',
            letterSpacing: '-0.01em',
          }}>
            {config.title}
          </div>
        )}

        {config.subtitle && (
          <div style={{
            marginBottom: 14,
            textAlign: config.alignment === 'center' ? 'center' : 'left',
          }}>
            <span style={{
              display: 'inline-block',
              background: activeTheme ? `${activeTheme.accentColor}22` : (config.colorSubtitleBg || '#ecfdf5'),
              color: activeTheme ? activeTheme.accentColor : (config.colorSubtitle || '#059669'),
              fontSize: config.fontSizeSubtitle || '12px',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 8,
              border: activeTheme ? `1px solid ${activeTheme.accentColor}55` : '1px solid #a7f3d0',
            }}>
              {config.subtitle}
            </span>
          </div>
        )}

        {time.isFinished ? (
          <div style={{
            padding: 12,
            color: effectiveTitleColor,
            opacity: 0.8,
            fontWeight: 800,
            textAlign: 'center',
          }}>
            ⏰ ¡La oferta terminó!
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: config.alignment === 'center' ? 'center' : 'flex-start',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            {units.map((u, i) => (
              <div key={u.l} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ClockUnit
                  value={u.v}
                  label={u.l}
                  config={config}
                  bgColor={effectiveClockBg}
                  isCritical={isCritical}
                  labelColor={effectiveLabelColor}
                  numbersColor={effectiveNumbersColor}
                />
                {i < units.length - 1 && <Separator dotColor={effectiveLabelColor} config={config} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
       }
