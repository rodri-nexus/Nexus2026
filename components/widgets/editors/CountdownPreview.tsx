// components/widgets/editors/CountdownPreview.tsx
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
  // Modo urgencia
  urgencyEnabled?: boolean;
  colorClockBgMedium?: string;
  colorClockBgCritical?: string;
  // Legacy
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
  percentConsumed: number; // 0-100 (para modo urgencia)
}

type UrgencyState = 'normal' | 'medium' | 'critical';

/* ═══════════════════════════════════════════
   HOOK: tiempo restante
   - Modo 'fixed': usa endDate específica
   - Modo 'duration': usa durationMinutes (reinicia por sesión)
═══════════════════════════════════════════ */
function useTimeLeft(config: CountdownConfig): TimeLeft {
  // Referencia al momento de arranque (para modo duration)
  const startTime = useRef<number>(Date.now());
  const totalDuration = useRef<number>(
    (config.durationMinutes || 15) * 60 * 1000
  );

  // Reset cuando cambia el modo o la duración
  useEffect(() => {
    startTime.current = Date.now();
    totalDuration.current = (config.durationMinutes || 15) * 60 * 1000;
  }, [config.mode, config.durationMinutes]);

  const getEndTime = (): { end: number; total: number } => {
    // Modo duración corta
    if (config.mode === 'duration') {
      return {
        end: startTime.current + totalDuration.current,
        total: totalDuration.current,
      };
    }

    // Modo fecha fija
    if (config.endDate) {
      const t = new Date(config.endDate).getTime();
      if (!isNaN(t) && t > Date.now()) {
        // Total: desde hace 7 días hasta el fin (para calcular % urgencia)
        const total = t - (Date.now() - 7 * 24 * 60 * 60 * 1000);
        return { end: t, total };
      }
    }

    // Fallback: +15 min desde ahora
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
        // Reiniciar: nuevo startTime y recalcular
        startTime.current = Date.now();
        totalDuration.current = (config.durationMinutes || 15) * 60 * 1000;
        setTime(calc());
      } else {
        setTime(next);
      }
    }, 1000);

    return () => clearInterval(int);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endDate, config.autoRestart, config.durationMinutes, config.mode]);

  return time;
}

/* ═══════════════════════════════════════════
   HELPER: calcular estado de urgencia
═══════════════════════════════════════════ */
function getUrgencyState(percentConsumed: number, enabled: boolean): UrgencyState {
  if (!enabled) return 'normal';
  if (percentConsumed >= 67) return 'critical';
  if (percentConsumed >= 34) return 'medium';
  return 'normal';
}

function getClockBgColor(config: CountdownConfig, state: UrgencyState): string {
  if (state === 'critical') return config.colorClockBgCritical || '#dc2626';
  if (state === 'medium') return config.colorClockBgMedium || '#f97316';
  return config.colorClockBg || '#FF0000';
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
        minWidth: size * 2.5,
        minHeight: size * 2.5,
        background: bgColor,
        color: config.colorNumbers,
        borderRadius: config.borderRadiusClock,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: config.fontSizeClock,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        padding: `${config.paddingClock}px ${config.paddingClock + 2}px`,
        lineHeight: 1,
        transition: 'background-color 0.4s ease',
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
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {value.split('').map((d, i) => (
        <div
          key={i}
          style={{
            width: size * 1.4,
            height: size * 2.4,
            background: `linear-gradient(180deg, ${bgColor} 0%, ${bgColor} 49%, rgba(0,0,0,0.35) 50%, ${bgColor} 51%, ${bgColor} 100%)`,
            borderRadius: config.borderRadiusClock,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: config.fontSizeClock,
            fontWeight: 900,
            color: config.colorNumbers,
            fontFamily: "'Courier New', monospace",
            boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
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

/* ═══════════════════════════════════════════
   UNIDAD DEL RELOJ (dígito + label)
═══════════════════════════════════════════ */
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
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Digit value={s} config={config} bgColor={bgColor} isCritical={isCritical} />
      {config.showLabels && (
        <span style={{
          fontSize: labelSize,
          fontWeight: 700,
          color: config.colorTitle,
          opacity: 0.8,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEPARADOR (dos puntos parpadeantes)
═══════════════════════════════════════════ */
function Separator({ config }: { config: CountdownConfig }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setOn((v) => !v), 500);
    return () => clearInterval(i);
  }, []);

  const size = parseInt(config.fontSizeClock, 10) || 16;
  const dotSize = Math.max(3, Math.round(size * 0.18));

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: dotSize,
      paddingBottom: config.showLabels ? Math.round(size * 0.85) : 0,
      opacity: on ? 1 : 0.25,
      transition: 'opacity 0.25s',
    }}>
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: config.colorTitle, opacity: 0.85 }} />
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: config.colorTitle, opacity: 0.85 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownPreview({ config }: Props) {
  const time = useTimeLeft(config);

  // Estado de urgencia
  const urgencyState = getUrgencyState(time.percentConsumed, !!config.urgencyEnabled);
  const currentClockBg = getClockBgColor(config, urgencyState);
  const isCritical = urgencyState === 'critical';

  // Construir unidades a mostrar
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
        padding: 20, background: '#fff5f5',
        border: '1.5px dashed #FF0000',
        borderRadius: 12, textAlign: 'center',
        fontSize: 13, color: '#FF0000', fontWeight: 700,
      }}>
        ⚠️ Activá al menos una unidad
      </div>
    );
  }

  // Fondo del widget
  const bg = (() => {
    if (config.bgType === 'gradient') {
      const c1 = config.colorWidgetBg || '#000000';
      const c2 = config.colorWidgetBg2 || '#FF0000';
      const dir = config.gradientDirection || 'to bottom right';
      return `linear-gradient(${dir}, ${c1}, ${c2})`;
    }
    return config.colorWidgetBg;
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
        borderRadius: config.borderRadiusWidget,
        padding: config.paddingWidget,
        textAlign: config.alignment,
      }}>
        {/* Título */}
        {config.title && (
          <div style={{
            fontSize: config.fontSizeTitle,
            fontWeight: 700,
            color: config.colorTitle,
            marginBottom: 14,
            lineHeight: 1.2,
            textAlign: config.alignment === 'center' ? 'center' : 'left',
          }}>
            {config.title}
          </div>
        )}

        {/* Subtítulo (chip con fondo personalizable) */}
        {config.subtitle && (
          <div style={{
            marginBottom: 14,
            textAlign: config.alignment === 'center' ? 'center' : 'left',
          }}>
            <span style={{
              display: 'inline-block',
              background: config.colorSubtitleBg,
              color: config.colorSubtitle,
              fontSize: config.fontSizeSubtitle,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 6,
            }}>
              {config.subtitle}
            </span>
          </div>
        )}

        {/* Reloj */}
        {time.isFinished ? (
          <div style={{
            padding: 12,
            color: config.colorTitle,
            opacity: 0.8,
            fontWeight: 700,
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
