// components/widgets/editors/CountdownPreview.tsx
'use client';

import { useEffect, useState, useRef } from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface CountdownConfig {
  title: string;
  subtitle: string;
  endDate: string;
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
  flashMinutes?: number;
  mode?: 'fixed' | 'flash';
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
}

/* ═══════════════════════════════════════════
   HOOK: tiempo restante
═══════════════════════════════════════════ */
function useTimeLeft(config: CountdownConfig): TimeLeft {
  const calc = (): TimeLeft => {
    if (!config.endDate) {
      return { days: 0, hours: 0, minutes: 15, seconds: 0, totalSeconds: 900, isFinished: false };
    }
    const diff = new Date(config.endDate).getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isFinished: true };
    }
    const t = Math.floor(diff / 1000);
    return {
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
      totalSeconds: t,
      isFinished: false,
    };
  };

  const [time, setTime] = useState<TimeLeft>(calc);

  useEffect(() => {
    setTime(calc());
    const int = setInterval(() => {
      const next = calc();
      if (next.isFinished && config.autoRestart) {
        const mins = config.flashMinutes || 15;
        setTime({
          days: 0, hours: 0, minutes: mins, seconds: 0,
          totalSeconds: mins * 60, isFinished: false,
        });
      } else {
        setTime(next);
      }
    }, 1000);
    return () => clearInterval(int);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endDate, config.autoRestart, config.flashMinutes]);

  return time;
}

/* ═══════════════════════════════════════════
   DIGIT CLÁSICO
═══════════════════════════════════════════ */
function DigitClasico({
  value, config,
}: {
  value: string; config: CountdownConfig;
}) {
  const size = parseInt(config.fontSizeClock, 10) || 16;
  return (
    <div
      style={{
        minWidth: size * 2.5,
        minHeight: size * 2.5,
        background: config.colorClockBg,
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
  value, config,
}: {
  value: string; config: CountdownConfig;
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
            background: 'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%)',
            borderRadius: 6,
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

/* ═══════════════════════════════════════════
   UNIDAD DEL RELOJ (dígito + label)
═══════════════════════════════════════════ */
function ClockUnit({
  value, label, config,
}: {
  value: number; label: string; config: CountdownConfig;
}) {
  const s = String(value).padStart(2, '0');
  const Digit = config.style === 'retro' ? DigitRetro : DigitClasico;

  const labelSize = Math.max(9, Math.round((parseInt(config.fontSizeClock, 10) || 16) * 0.55));

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Digit value={s} config={config} />
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
   SEPARADOR (dos puntos)
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

  // Construir unidades a mostrar
  const units: { v: number; l: string }[] = [];
  const showDays = config.showDays && time.days > 0;
  if (showDays) units.push({ v: time.days, l: 'DÍAS' });
  if (config.showHours !== false) units.push({ v: time.hours + (config.showDays ? 0 : time.days * 24), l: 'HRS' });
  if (config.showMinutes !== false) units.push({ v: time.minutes, l: 'MIN' });
  if (config.showSeconds !== false) units.push({ v: time.seconds, l: 'SEG' });

  if (units.length === 0) {
    return (
      <div style={{
        padding: 20, background: '#fff7ed',
        border: '1.5px dashed #fb923c',
        borderRadius: 12, textAlign: 'center',
        fontSize: 13, color: '#c2410c', fontWeight: 700,
      }}>
        ⚠️ Activá al menos una unidad
      </div>
    );
  }

  const bg = config.bgType === 'gradient'
    ? `linear-gradient(135deg, ${config.colorWidgetBg} 0%, ${config.colorSubtitleBg} 100%)`
    : config.colorWidgetBg;

  return (
    <>
      <style>{`
        @keyframes nvxRetroFlip {
          0% { transform: scaleY(1); opacity: 1; }
          40%,60% { transform: scaleY(0); opacity: 0.5; }
          100% { transform: scaleY(1); opacity: 1; }
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

        {/* Subtítulo (chip amarillo) */}
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
                <ClockUnit value={u.v} label={u.l} config={config} />
                {i < units.length - 1 && <Separator config={config} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
