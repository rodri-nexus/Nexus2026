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
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  autoRestart: boolean;
  style: 'clasico' | 'retro' | 'glass' | 'neon';
  alignment: 'center' | 'left';
  showLabels: boolean;
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
  showShimmer: boolean;
  showProgressRing: boolean;
  showParticles: boolean;
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
  totalSeconds: number;
  isUrgent: boolean;
  isFinished: boolean;
}

/* ═══════════════════════════════════════════
   HOOK: calcular tiempo restante
═══════════════════════════════════════════ */
function useTimeLeft(endDate: string, autoRestart: boolean): TimeLeft {
  const calc = (): TimeLeft => {
    if (!endDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 15,
        seconds: 42,
        totalSeconds: 942,
        isUrgent: false,
        isFinished: false,
      };
    }
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isUrgent: false,
        isFinished: true,
      };
    }
    const totalSec = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSec / 86400),
      hours: Math.floor((totalSec % 86400) / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
      totalSeconds: totalSec,
      isUrgent: totalSec <= 10,
      isFinished: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calc);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = calc();
      if (next.isFinished && autoRestart) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 15,
          seconds: 0,
          totalSeconds: 900,
          isUrgent: false,
          isFinished: false,
        });
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

  if (config.style === 'retro') {
    return (
      <div style={{ display: 'inline-flex', gap: 2 }}>
        {value.split('').map((digit, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 44,
              background:
                'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: config.fontSizeClock,
              fontWeight: 900,
              color: config.colorNumbers,
              fontFamily: "'Courier New', monospace",
              boxShadow:
                '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
              animation: flipping ? 'retroFlip 0.3s ease' : 'none',
            }}
          >
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

  if (config.style === 'glass') {
    return (
      <div
        style={{
          minWidth: 56,
          height: 56,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: config.borderRadiusClock,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: config.fontSizeClock,
          fontWeight: 800,
          color: config.colorNumbers,
          padding: config.paddingClock,
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: isUrgent
            ? '0 0 20px rgba(239,68,68,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
            : '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)',
          animation: flipping
            ? 'flipNum 0.3s ease'
            : isUrgent
            ? 'pulseUrgent 0.8s ease infinite'
            : 'none',
          transition: 'box-shadow 0.4s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {value}
      </div>
    );
  }

  if (config.style === 'neon') {
    return (
      <div
        style={{
          minWidth: 56,
          height: 56,
          background: '#0a0a1a',
          borderRadius: config.borderRadiusClock,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: config.fontSizeClock,
          fontWeight: 900,
          color: config.colorNumbers,
          fontFamily: "'Courier New', monospace",
          padding: config.paddingClock,
          border: `1px solid ${config.colorNumbers}40`,
          boxShadow: isUrgent
            ? `0 0 20px ${config.colorNumbers}80, 0 0 40px ${config.colorNumbers}40, inset 0 0 20px ${config.colorNumbers}15`
            : `0 0 10px ${config.colorNumbers}30, inset 0 0 10px ${config.colorNumbers}10`,
          textShadow: `0 0 10px ${config.colorNumbers}80, 0 0 20px ${config.colorNumbers}40`,
          animation: flipping
            ? 'flipNum 0.3s ease'
            : isUrgent
            ? 'neonPulse 1s ease infinite'
            : 'none',
          transition: 'box-shadow 0.4s ease, text-shadow 0.4s ease',
        }}
      >
        {value}
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
            color:
              config.style === 'neon'
                ? config.colorNumbers
                : config.colorNumbers,
            opacity: 0.7,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow:
              config.style === 'neon'
                ? `0 0 8px ${config.colorNumbers}60`
                : 'none',
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
function Separator({
  color,
  style,
}: {
  color: string;
  style: string;
}) {
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
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
          opacity: 0.8,
          boxShadow:
            style === 'neon' ? `0 0 6px ${color}80` : 'none',
        }}
      />
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
          opacity: 0.8,
          boxShadow:
            style === 'neon' ? `0 0 6px ${color}80` : 'none',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   AVISO: ninguna unidad activa
═══════════════════════════════════════════ */
function NoUnitsWarning() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '20px 16px',
        background: '#fff7ed',
        border: '1.5px dashed #fb923c',
        borderRadius: 12,
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 28 }}>⚠️</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#c2410c',
          lineHeight: 1.4,
        }}
      >
        Activá al menos una unidad
        <br />
        <span style={{ fontWeight: 500, color: '#ea580c' }}>
          (días, horas, minutos o segundos)
        </span>
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AURA: determinar color según tiempo
═══════════════════════════════════════════ */
function getAuraColor(config: CountdownConfig, totalSeconds: number): string | null {
  if (!config.auraEnabled) return null;
  if (totalSeconds <= 600) return config.colorAuraUrgent;
  if (totalSeconds <= 3600) return config.colorAuraMedium;
  return config.colorAuraCalm;
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL: CountdownPreview
═══════════════════════════════════════════ */
export default function CountdownPreview({ config }: CountdownPreviewProps) {
  const timeLeft = useTimeLeft(config.endDate, config.autoRestart);
  const [shimmerKey, setShimmerKey] = useState(0);

  // Shimmer cada 5 segundos
  useEffect(() => {
    if (!config.showShimmer) return;
    const interval = setInterval(() => setShimmerKey((k) => k + 1), 5000);
    return () => clearInterval(interval);
  }, [config.showShimmer]);

  const widgetBg =
    config.bgType === 'gradient'
      ? `linear-gradient(135deg, ${config.colorWidgetBg} 0%, ${config.colorSubtitleBg} 100%)`
      : config.colorWidgetBg;

  const units: { value: number; label: string }[] = [
    ...(config.showDays ? [{ value: timeLeft.days, label: 'DÍAS' }] : []),
    ...(config.showHours ? [{ value: timeLeft.hours, label: 'HRS' }] : []),
    ...(config.showMinutes ? [{ value: timeLeft.minutes, label: 'MIN' }] : []),
    ...(config.showSeconds ? [{ value: timeLeft.seconds, label: 'SEG' }] : []),
  ];

  const noUnits = units.length === 0;
  const auraColor = getAuraColor(config, timeLeft.totalSeconds);

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
        @keyframes neonPulse {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50%      { opacity: 0.85; filter: brightness(1.3); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.6;  transform: scale(1.08); }
        }
        @keyframes shimmerSlide {
          0%   { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(200%) rotate(15deg); }
        }
        @keyframes auraPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.05); }
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0.6; }
          50%  { transform: translateY(-20px) scale(1.2); opacity: 0.3; }
          100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
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
          minHeight: 220,
          position: 'relative',
        }}
      >
        {/* Aura de fondo */}
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
              width: 260,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${
                auraColor || 'rgba(102,126,234,0.3)'
              }50 0%, transparent 70%)`,
              filter: 'blur(25px)',
              animation: auraColor
                ? 'auraPulse 2s ease infinite'
                : 'glowPulse 2s ease infinite',
            }}
          />
        </div>

        {/* ── Widget real ── */}
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            background:
              config.style === 'neon'
                ? '#0a0a1a'
                : widgetBg,
            borderRadius: config.borderRadiusWidget,
            padding: config.paddingWidget,
            textAlign: config.alignment as 'center' | 'left',
            position: 'relative',
            overflow: 'hidden',
            boxShadow:
              config.style === 'neon'
                ? `0 0 30px ${config.colorNumbers}20, 0 8px 32px rgba(0,0,0,0.3)`
                : config.style === 'glass'
                ? '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '0 8px 32px rgba(0,0,0,0.12)',
            border:
              config.style === 'neon'
                ? `1px solid ${config.colorNumbers}30`
                : config.style === 'glass'
                ? '1px solid rgba(255,255,255,0.2)'
                : 'none',
          }}
        >
          {/* Shimmer diagonal */}
          {config.showShimmer && (
            <div
              key={shimmerKey}
              style={{
                position: 'absolute',
                top: -20,
                left: -60,
                width: 60,
                height: '200%',
                background:
                  config.style === 'neon'
                    ? `linear-gradient(90deg, transparent, ${config.colorNumbers}15, transparent)`
                    : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transform: 'rotate(15deg)',
                animation: 'shimmerSlide 1.2s ease-out forwards',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Brillo diagonal sutil (solo glass y clásico) */}
          {(config.style === 'clasico' || config.style === 'glass') && (
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
          )}

          {/* Partículas (solo si quedan <10min y está habilitado) */}
          {config.showParticles && timeLeft.totalSeconds <= 600 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: `${15 + i * 18}%`,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background:
                      config.style === 'neon'
                        ? config.colorNumbers
                        : 'rgba(255,255,255,0.6)',
                    animation: `particleFloat ${2 + i * 0.4}s ease infinite`,
                    animationDelay: `${i * 0.6}s`,
                    boxShadow:
                      config.style === 'neon'
                        ? `0 0 6px ${config.colorNumbers}80`
                        : '0 0 4px rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Título */}
          {config.title && (
            <div
              style={{
                fontSize: config.fontSizeTitle,
                fontWeight: 800,
                color:
                  config.style === 'neon'
                    ? config.colorTitle
                    : config.colorTitle,
                marginBottom: config.subtitle ? 4 : 16,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                textShadow:
                  config.style === 'neon'
                    ? `0 0 10px ${config.colorTitle}50`
                    : 'none',
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
                background:
                  config.style === 'neon'
                    ? `${config.colorNumbers}15`
                    : config.style === 'glass'
                    ? 'rgba(255,255,255,0.15)'
                    : config.bgType === 'solid'
                    ? config.colorSubtitleBg
                    : 'rgba(255,255,255,0.15)',
                padding: '4px 12px',
                borderRadius: 20,
                marginBottom: 16,
                border:
                  config.style === 'neon'
                    ? `1px solid ${config.colorNumbers}20`
                    : config.style === 'glass'
                    ? '1px solid rgba(255,255,255,0.15)'
                    : 'none',
              }}
            >
              {config.subtitle}
            </div>
          )}

          {/* ── Reloj o estados especiales ── */}
          {noUnits ? (
            <NoUnitsWarning />
          ) : timeLeft.isFinished ? (
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
                justifyContent:
                  config.alignment === 'center' ? 'center' : 'flex-start',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {units.map((unit, i) => (
                <div
                  key={unit.label}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <ClockUnit
                    value={unit.value}
                    label={unit.label}
                    config={config}
                    isUrgent={timeLeft.isUrgent}
                  />
                  {i < units.length - 1 && (
                    <Separator
                      color={config.colorNumbers}
                      style={config.style}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress ring (opcional) */}
          {config.showProgressRing && !timeLeft.isFinished && !noUnits && (
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                justifyContent:
                  config.alignment === 'center' ? 'center' : 'flex-start',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 200,
                  height: 4,
                  borderRadius: 2,
                  background:
                    config.style === 'neon'
                      ? `${config.colorNumbers}20`
                      : 'rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 2,
                    background:
                      config.style === 'neon'
                        ? config.colorNumbers
                        : 'rgba(255,255,255,0.7)',
                    width: `${Math.min(
                      100,
                      Math.max(
                        5,
                        (timeLeft.totalSeconds / (timeLeft.totalSeconds + 60)) *
                          100
                      )
                    )}%`,
                    transition: 'width 1s linear',
                    boxShadow:
                      config.style === 'neon'
                        ? `0 0 8px ${config.colorNumbers}60`
                        : 'none',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
