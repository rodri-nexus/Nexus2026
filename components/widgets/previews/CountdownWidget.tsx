// components/widgets/previews/CountdownWidget.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";

interface CountdownWidgetProps {
  config: Record<string, any>;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  percentConsumed: number;
  isFinished: boolean;
}

type UrgencyState = 'normal' | 'medium' | 'critical';

/* ═══════════════════════════════════════════
   HELPER: leer config con fallback (compat viejo+nuevo)
═══════════════════════════════════════════ */
function readConfig(config: Record<string, any>) {
  // Compat: legacy usaba "hours" en vez de "durationMinutes"
  let legacyDurationFromHours: number | undefined;
  if (typeof config.hours === 'number' && !isNaN(config.hours)) {
    legacyDurationFromHours = config.hours * 60;
  }

  return {
    title: config.title ?? 'Oferta 🔥',
    subtitle: config.subtitle ?? '',

    // Modo
    mode: (config.mode ?? 'fixed') as 'fixed' | 'duration',
    endDate: config.endDate ?? config.end_datetime ?? '',
    durationMinutes:
      Number(config.durationMinutes ?? legacyDurationFromHours ?? 15) || 15,

    // Comportamiento
    autoRestart: config.autoRestart ?? config.auto_restart ?? false,
    showDays: config.showDays ?? config.show_days ?? true,
    showHours: config.showHours ?? config.show_hours ?? true,
    showMinutes: config.showMinutes ?? config.show_minutes ?? true,
    showSeconds: config.showSeconds ?? config.show_seconds ?? true,
    showLabels: config.showLabels ?? config.show_clock_labels ?? true,

    // Estilo
    style: (config.style ?? config.clock_style ?? 'clasico') as string,
    alignment: (config.alignment ?? config.content_alignment ?? 'left') as 'left' | 'center' | 'right',

    // Fondo
    bgType: (config.bgType ?? config.background_type ?? 'solid') as 'solid' | 'gradient',
    colorWidgetBg: config.colorWidgetBg ?? config.background_color ?? '#000000',
    colorWidgetBg2: config.colorWidgetBg2 ?? '#FF0000',
    gradientDirection: (config.gradientDirection ?? 'to bottom right') as string,

    // Colores
    colorSubtitleBg: config.colorSubtitleBg ?? config.subtitle_bg_color ?? '#FF0000',
    colorClockBg: config.colorClockBg ?? config.clock_bg_color ?? '#FF0000',
    colorTitle: config.colorTitle ?? config.title_font_color ?? '#ffffff',
    colorSubtitle: config.colorSubtitle ?? config.subtitle_font_color ?? '#ffffff',
    colorNumbers: config.colorNumbers ?? config.number_font_color ?? '#ffffff',

    // Tipografía (siempre número, no string "16px")
    fontSizeTitle: parseIntSafe(config.fontSizeTitle ?? config.title_font_size, 16),
    fontSizeSubtitle: parseIntSafe(config.fontSizeSubtitle ?? config.subtitle_font_size, 11),
    fontSizeClock: parseIntSafe(config.fontSizeClock ?? config.clock_font_size, 16),

    // Espacios
    borderRadiusClock: Number(config.borderRadiusClock ?? config.clock_border_radius ?? 5),
    borderRadiusWidget: Number(config.borderRadiusWidget ?? config.widget_border_radius ?? 12),
    paddingWidget: Number(config.paddingWidget ?? config.widget_padding ?? 15),
    paddingClock: Number(config.paddingClock ?? config.clock_padding ?? 7),

    // Modo urgencia
    urgencyEnabled: !!(config.urgencyEnabled ?? false),
    colorClockBgMedium: config.colorClockBgMedium ?? '#f97316',
    colorClockBgCritical: config.colorClockBgCritical ?? '#dc2626',
  };
}

function parseIntSafe(v: any, fallback: number): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    return isNaN(n) ? fallback : n;
  }
  return fallback;
}

/* ═══════════════════════════════════════════
   HOOK: tiempo restante (fixed + duration)
═══════════════════════════════════════════ */
function useTimeLeft(cfg: ReturnType<typeof readConfig>): TimeLeft {
  const startTime = useRef<number>(Date.now());
  const totalDuration = useRef<number>(cfg.durationMinutes * 60 * 1000);

  useEffect(() => {
    startTime.current = Date.now();
    totalDuration.current = cfg.durationMinutes * 60 * 1000;
  }, [cfg.mode, cfg.durationMinutes]);

  const getEndInfo = () => {
    // Modo duración corta
    if (cfg.mode === 'duration') {
      return {
        end: startTime.current + totalDuration.current,
        total: totalDuration.current,
      };
    }

    // Modo fecha fija
    if (cfg.endDate) {
      const t = new Date(cfg.endDate).getTime();
      if (!isNaN(t) && t > Date.now()) {
        const total = t - (Date.now() - 7 * 24 * 60 * 60 * 1000);
        return { end: t, total };
      }
    }

    // Fallback
    return {
      end: startTime.current + 15 * 60 * 1000,
      total: 15 * 60 * 1000,
    };
  };

  const calc = (): TimeLeft => {
    const { end, total } = getEndInfo();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
      return {
        days: 0, hours: 0, minutes: 0, seconds: 0,
        totalSeconds: 0, percentConsumed: 100, isFinished: true,
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
      percentConsumed: consumed,
      isFinished: false,
    };
  };

  const [time, setTime] = useState<TimeLeft>(calc);

  useEffect(() => {
    setTime(calc());
    const int = setInterval(() => {
      const next = calc();
      if (next.isFinished && cfg.autoRestart) {
        startTime.current = Date.now();
        totalDuration.current = cfg.durationMinutes * 60 * 1000;
        setTime(calc());
      } else {
        setTime(next);
      }
    }, 1000);
    return () => clearInterval(int);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.endDate, cfg.autoRestart, cfg.durationMinutes, cfg.mode]);

  return time;
}

/* ═══════════════════════════════════════════
   HELPERS: estado urgencia + colores
═══════════════════════════════════════════ */
function getUrgencyState(percent: number, enabled: boolean): UrgencyState {
  if (!enabled) return 'normal';
  if (percent >= 67) return 'critical';
  if (percent >= 34) return 'medium';
  return 'normal';
}

function getClockBg(cfg: ReturnType<typeof readConfig>, state: UrgencyState): string {
  if (state === 'critical') return cfg.colorClockBgCritical;
  if (state === 'medium') return cfg.colorClockBgMedium;
  return cfg.colorClockBg;
}

/* ═══════════════════════════════════════════
   DIGIT: CLÁSICO
═══════════════════════════════════════════ */
function DigitClasico({
  value, cfg, bgColor, isCritical,
}: {
  value: string;
  cfg: ReturnType<typeof readConfig>;
  bgColor: string;
  isCritical: boolean;
}) {
  return (
    <div
      style={{
        minWidth: cfg.fontSizeClock * 2.5,
        minHeight: cfg.fontSizeClock * 2.5,
        background: bgColor,
        color: cfg.colorNumbers,
        borderRadius: cfg.borderRadiusClock,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: cfg.fontSizeClock,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        padding: `${cfg.paddingClock}px ${cfg.paddingClock + 2}px`,
        lineHeight: 1,
        transition: 'background-color 0.4s ease',
        animation: isCritical ? 'nvxCriticalPulse 1s ease-in-out infinite' : 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {value}
    </div>
  );
}

/* ═══════════════════════════════════════════
   DIGIT: RETRO FLIP (CSS puro)
═══════════════════════════════════════════ */
function DigitRetro({
  value, cfg, bgColor, isCritical,
}: {
  value: string;
  cfg: ReturnType<typeof readConfig>;
  bgColor: string;
  isCritical: boolean;
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

  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {value.split('').map((d, i) => (
        <div
          key={i}
          style={{
            width: cfg.fontSizeClock * 1.4,
            height: cfg.fontSizeClock * 2.4,
            background: `linear-gradient(180deg, ${bgColor} 0%, ${bgColor} 49%, rgba(0,0,0,0.35) 50%, ${bgColor} 51%, ${bgColor} 100%)`,
            borderRadius: cfg.borderRadiusClock,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: cfg.fontSizeClock,
            fontWeight: 900,
            color: cfg.colorNumbers,
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
   UNIDAD DEL RELOJ
═══════════════════════════════════════════ */
function ClockUnit({
  value, label, cfg, bgColor, isCritical,
}: {
  value: number; label: string;
  cfg: ReturnType<typeof readConfig>;
  bgColor: string; isCritical: boolean;
}) {
  const s = String(value).padStart(2, '0');
  const Digit = cfg.style === 'retro' || cfg.style === 'retro_flip' ? DigitRetro : DigitClasico;
  const labelSize = Math.max(9, Math.round(cfg.fontSizeClock * 0.55));

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Digit value={s} cfg={cfg} bgColor={bgColor} isCritical={isCritical} />
      {cfg.showLabels && (
        <span style={{
          fontSize: labelSize,
          fontWeight: 700,
          color: cfg.colorTitle,
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
   SEPARADOR
═══════════════════════════════════════════ */
function Separator({ cfg }: { cfg: ReturnType<typeof readConfig> }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setOn((v) => !v), 500);
    return () => clearInterval(i);
  }, []);

  const dotSize = Math.max(3, Math.round(cfg.fontSizeClock * 0.18));

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: dotSize,
      paddingBottom: cfg.showLabels ? Math.round(cfg.fontSizeClock * 0.85) : 0,
      opacity: on ? 1 : 0.25,
      transition: 'opacity 0.25s',
    }}>
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: cfg.colorTitle, opacity: 0.85 }} />
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: cfg.colorTitle, opacity: 0.85 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownWidget({ config }: CountdownWidgetProps) {
  const cfg = useMemo(() => readConfig(config), [config]);
  const time = useTimeLeft(cfg);

  const urgencyState = getUrgencyState(time.percentConsumed, cfg.urgencyEnabled);
  const currentClockBg = getClockBg(cfg, urgencyState);
  const isCritical = urgencyState === 'critical';

  const flexAlign = cfg.alignment === 'left' ? 'flex-start'
    : cfg.alignment === 'right' ? 'flex-end' : 'center';
  const textAlign = cfg.alignment as 'left' | 'center' | 'right';

  const units = useMemo(() => {
    const arr: { v: number; l: string }[] = [];
    const showDaysActive = cfg.showDays && time.days > 0;

    if (showDaysActive) arr.push({ v: time.days, l: 'DÍAS' });
    if (cfg.showHours) {
      const hoursValue = showDaysActive ? time.hours : time.hours + time.days * 24;
      arr.push({ v: hoursValue, l: 'HRS' });
    }
    if (cfg.showMinutes) arr.push({ v: time.minutes, l: 'MIN' });
    if (cfg.showSeconds) arr.push({ v: time.seconds, l: 'SEG' });
    return arr;
  }, [time, cfg.showDays, cfg.showHours, cfg.showMinutes, cfg.showSeconds]);

  const bg = (() => {
    if (cfg.bgType === 'gradient') {
      return `linear-gradient(${cfg.gradientDirection}, ${cfg.colorWidgetBg}, ${cfg.colorWidgetBg2})`;
    }
    return cfg.colorWidgetBg;
  })();

  if (time.isFinished) {
    return (
      <>
        <style>{keyframes}</style>
        <div
          style={{
            textAlign: 'center',
            padding: cfg.paddingWidget,
            background: bg,
            borderRadius: cfg.borderRadiusWidget,
            color: cfg.colorTitle,
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 8, animation: 'nvxFinishedBlink 2s ease-in-out infinite' }}>
            ⏰
          </div>
          <div style={{
            fontSize: cfg.fontSizeTitle,
            fontWeight: 800,
            marginBottom: 4,
          }}>
            ¡La oferta terminó!
          </div>
          <div style={{
            fontSize: cfg.fontSizeSubtitle,
            opacity: 0.7,
          }}>
            Esta promoción ya no está disponible
          </div>
        </div>
      </>
    );
  }

  if (units.length === 0) {
    return (
      <div style={{
        padding: 20,
        background: '#fff5f5',
        border: '1.5px dashed #FF0000',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 13,
        color: '#FF0000',
        fontWeight: 700,
      }}>
        ⚠️ Activá al menos una unidad
      </div>
    );
  }

  return (
    <>
      <style>{keyframes}</style>

      <div
        style={{
          padding: cfg.paddingWidget,
          background: bg,
          borderRadius: cfg.borderRadiusWidget,
          textAlign,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {cfg.title && (
          <div
            style={{
              fontSize: cfg.fontSizeTitle,
              fontWeight: 800,
              color: cfg.colorTitle,
              marginBottom: cfg.subtitle ? 6 : 12,
              lineHeight: 1.2,
              textAlign,
            }}
          >
            {cfg.title}
          </div>
        )}

        {cfg.subtitle && (
          <div style={{ marginBottom: 12, textAlign }}>
            <span
              style={{
                display: 'inline-block',
                background: cfg.colorSubtitleBg,
                color: cfg.colorSubtitle,
                fontSize: cfg.fontSizeSubtitle,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
              }}
            >
              {cfg.subtitle}
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: flexAlign,
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {units.map((u, i) => (
            <div key={u.l} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ClockUnit
                value={u.v}
                label={u.l}
                cfg={cfg}
                bgColor={currentClockBg}
                isCritical={isCritical}
              />
              {i < units.length - 1 && <Separator cfg={cfg} />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════════ */
const keyframes = `
  @keyframes nvxRetroFlip {
    0% { transform: scaleY(1); opacity: 1; }
    40%, 60% { transform: scaleY(0); opacity: 0.5; }
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
  @keyframes nvxFinishedBlink {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;
