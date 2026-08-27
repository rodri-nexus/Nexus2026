'use client';

import { useEffect, useState, useRef, useMemo } from 'react';

/* ═══════════════════════════════════════════
   TIPOS
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
   HOOK: tiempo restante
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
   DIGIT CLÁSICO
═══════════════════════════════════════════ */
function DigitClasico({
  value, config, bgColor, isCritical,
}: {
  value: string; config: CountdownConfig; bgColor: string; isCritical: boolean;
}) {
  const size = parseInt(config.fontSizeClock, 10) || 16;
  return (
    <div
      style={{
        minWidth: size * 2.4,
        minHeight: size * 2.4,
        background: bgColor,
        color: config.colorNumbers || '#ffffff',
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

/* ═══════════════════════════════════════════
   DIGIT RETRO FLIP
═══════════════════════════════════════════ */
function DigitRetro({
  value, config, bgColor, isCritical,
}: {
  value: string; config: CountdownConfig; bgColor: string; isCritical: boolean;
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
            color: config.colorNumbers || '#ffffff',
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
  value, label, config, bgColor, isCritical,
}: {
  value: number; label: string; config: CountdownConfig;
  bgColor: string; isCritical: boolean;
}) {
  const s = String(value).padStart(2, '0');
  const Digit = config.style === 'retro' ? DigitRetro : DigitClasico;
  const labelSize = Math.max(9, Math.round((parseInt(config.fontSizeClock, 10) || 16) * 0.55));

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <Digit value={s} config={config} bgColor={bgColor} isCritical={isCritical} />
      {config.showLabels && (
        <span style={{
          fontSize: labelSize,
          fontWeight: 800,
          color: config.colorTitle || '#000000',
          opacity: 0.75,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

function Separator({ config }: { config: CountdownConfig }) {
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
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: config.colorTitle || '#000000', opacity: 0.85 }} />
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: config.colorTitle || '#000000', opacity: 0.85 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownPreview({ config }: Props) {
  const time = useTimeLeft(config);

  const urgencyState = getUrgencyState(time.percentConsumed, !!config.urgencyEnabled);
  const currentClockBg = getClockBgColor(config, urgencyState);
  const isCritical = urgencyState === 'critical';

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

  const bg = (() => {
    if (config.bgType === 'gradient') {
      const c1 = config.colorWidgetBg || '#05070B';
      const c2 = config.colorWidgetBg2 || '#10B981';
      const dir = config.gradientDirection || 'to bottom right';
      return `linear-gradient(${dir}, ${c1}, ${c2})`;
    }
    return config.colorWidgetBg || '#ffffff';
  })();

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
        background: bg,
        borderRadius: config.borderRadiusWidget || 16,
        padding: config.paddingWidget || 18,
        textAlign: config.alignment || 'center',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
      }}>
        {config.title && (
          <div style={{
            fontSize: config.fontSizeTitle || '18px',
            fontWeight: 800,
            color: config.colorTitle || '#000000',
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
              background: config.colorSubtitleBg || '#ecfdf5',
              color: config.colorSubtitle || '#059669',
              fontSize: config.fontSizeSubtitle || '12px',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 8,
              border: '1px solid #a7f3d0',
            }}>
              {config.subtitle}
            </span>
          </div>
        )}

        {time.isFinished ? (
          <div style={{
            padding: 12,
            color: config.colorTitle || '#000000',
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
                  bgColor={currentClockBg}
                  isCritical={isCritical}
                />
                {i < units.length - 1 && <Separator config={config} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
   }
