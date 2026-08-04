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
  showDays: boolean;
  autoRestart: boolean;
  style: 'clasico' | 'retro';
  alignment: 'center' | 'left';
  showLabels: boolean;
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
}

interface CountdownPreviewProps {
  config: CountdownConfig;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUrgent: boolean;
  isFinished: boolean;
}

/* ═══════════════════════════════════════════
   HOOK: calcular tiempo restante
═══════════════════════════════════════════ */
function useTimeLeft(endDate: string, autoRestart: boolean): TimeLeft {
  const calc = (): TimeLeft => {
    if (!endDate) {
      return { days: 0, hours: 0, minutes: 59, seconds: 42, isUrgent: false, isFinished: false };
    }
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isUrgent: false, isFinished: true };
    }
    const totalSec = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSec / 86400),
      hours: Math.floor((totalSec % 86400) / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
      isUrgent: totalSec <= 10,
      isFinished: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calc);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = calc();
      if (next.isFinished && autoRestart) {
        // reinicio demo: 59:59
        setTimeLeft({ days: 0, hours: 0, minutes: 59, seconds: 59, isUrgent: false, isFinished: false });
      } else {
        setTimeLeft(next);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate, autoRestart]);

  return timeLeft;
}

/* ═══════════════════════════════════════════
   SUBCOMPONENTE: dígito con flip
═══════════════════════════════════════════ */
function FlipDigit({
  value,
  config,
  isUrgent,
}: {
  value: string;
  config: CountdownConfig;
  isUrgent: boolean;
}) {
  const prevRef = useRef(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 300);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const isRetro = config.style === 'retro';

  if (isRetro) {
    return (
      <div
        style={{
          display: 'inline-flex',
          gap: 2,
        }}
      >
        {value.split('').map((digit, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 44,
              background: 'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: config.fontSizeClock,
              fontWeight: 900,
              color: config.colorNumbers,
              fontFamily: "'Courier New', monospace",
              boxShadow: `0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
              position: 'relative',
              overflow: 'hidden',
              animation: flipping ? 'retroFlip 0.3s ease' : 'none',
            }}
          >
            {/* línea central */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 1,
                background: 'rgba(0,0,0,0.5)',
              }}
            />
            {digit}
          </div>
        ))}
      </div>
    );
  }

  // Clásico
  return (
    <div
      style={{
        minWidth: 52,
        height: 52,
        background: config.colorClockBg,
        borderRadius: config.borderRadiusClock,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: config.fontSizeClock,
        fontWeight: 800,
        color: config.colorNumbers,
        padding: config.paddingClock,
        boxShadow: isUrgent
          ? '0 0 16px rgba(239,68,68,0.5)'
          : '0 4px 16px rgba(0,0,0,0.12)',
        animation: flipping
          ? 'flipNum 0.3s ease'
          : isUrgent
          ? 'pulseUrgent 0.8s ease infinite'
          : 'none',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {value}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUBCOMPONENTE: unidad del reloj
═══════════════════════════════════════════ */
function ClockUnit({
  value,
  label,
  config,
  isUrgent,
}: {
  value: number;
  label: string;
  config: CountdownConfig;
  isUrgent: boolean;
}) {
  const str = String(value).padStart(2, '0');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <FlipDigit value={str} config={config} isUrgent={isUrgent} />
      {config.showLabels && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: config.colorNumbers,
            opacity: 0.7,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEPARADOR animado
═══════════════════════════════════════════ */
function Separator({ color }: { color: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingBottom: 16,
        opacity: visible ? 1 : 0.15,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, opacity: 0.8 }} />
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, opacity: 0.8 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL: CountdownPreview
═══════════════════════════════════════════ */
export default function CountdownPreview({ config }: CountdownPreviewProps) {
  const timeLeft = useTimeLeft(config.endDate, config.autoRestart);
  const [tick, setTick] = useState(0);

  // pulso de glow sutil
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const widgetBg =
    config.bgType === 'gradient'
      ? `linear-gradient(135deg, ${config.colorWidgetBg} 0%, ${config.colorSubtitleBg} 100%)`
      : config.colorWidgetBg;

  const units = [
    ...(config.showDays ? [{ value: timeLeft.days, label: 'DÍAS' }] : []),
    { value: timeLeft.hours, label: 'HRS' },
    { value: timeLeft.minutes, label: 'MIN' },
    { value: timeLeft.seconds, label: 'SEG' },
  ];

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes flipNum {
          0%   { transform: rotateX(0deg);    opacity: 1; }
          40%  { transform: rotateX(-90deg);  opacity: 0.4; }
          60%  { transform: rotateX(90deg);   opacity: 0.4; }
          100% { transform: rotateX(0deg);    opacity: 1; }
        }
        @keyframes retroFlip {
          0%   { transform: scaleY(1);   opacity: 1; }
          40%  { transform: scaleY(0);   opacity: 0.5; }
          60%  { transform: scaleY(0);   opacity: 0.5; }
          100% { transform: scaleY(1);   opacity: 1; }
        }
        @keyframes pulseUrgent {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 16px rgba(239,68,68,0.5); }
          50%       { transform: scale(1.04); box-shadow: 0 0 28px rgba(239,68,68,0.8); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.6;  transform: scale(1.08); }
        }
      `}</style>

      {/* ── Contenedor de preview (fondo a cuadros) ── */}
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          background:
            'repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px',
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          position: 'relative',
        }}
      >
        {/* Glow de fondo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 220,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(102,126,234,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              animation: 'glowPulse 2s ease infinite',
            }}
          />
        </div>

        {/* ── Widget real ── */}
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            background: widgetBg,
            borderRadius: config.borderRadiusWidget,
            padding: config.paddingWidget,
            textAlign: config.alignment as 'center' | 'left',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* Brillo diagonal sutil */}
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: -40,
              width: 160,
              height: 160,
              background:
                'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Título */}
          {config.title && (
            <div
              style={{
                fontSize: config.fontSizeTitle,
                fontWeight: 800,
                color: config.colorTitle,
                marginBottom: config.subtitle ? 4 : 16,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {config.title}
            </div>
          )}

          {/* Subtítulo */}
          {config.subtitle && (
            <div
              style={{
                display: 'inline-block',
                fontSize: config.fontSizeSubtitle,
                fontWeight: 600,
                color: config.colorSubtitle,
                background: config.bgType === 'solid' ? config.colorSubtitleBg : 'rgba(255,255,255,0.15)',
                padding: '4px 12px',
                borderRadius: 20,
                marginBottom: 16,
              }}
            >
              {config.subtitle}
            </div>
          )}

          {/* ── Reloj ── */}
          {timeLeft.isFinished ? (
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: config.colorNumbers,
                opacity: 0.7,
                padding: 12,
              }}
            >
              ⏰ ¡Oferta finalizada!
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: config.alignment === 'center' ? 'center' : 'flex-start',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {units.map((unit, i) => (
                <div key={unit.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockUnit
                    value={unit.value}
                    label={unit.label}
                    config={config}
                    isUrgent={timeLeft.isUrgent}
                  />
                  {i < units.length - 1 && (
                    <Separator color={config.colorNumbers} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
