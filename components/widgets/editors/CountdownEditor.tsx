// components/widgets/editors/CountdownEditor.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
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

interface CountdownEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface CountdownConfig {
  title: string;
  subtitle: string;
  mode: 'fixed' | 'duration';
  endDate: string;
  durationMinutes: number;
  autoRestart: boolean;
  showDays: boolean;
  showOnProduct: boolean;
  productPosition: 'before-button' | 'before-title';
  showAsTopBar: boolean;
  showOnCart: boolean;
  style: 'clasico' | 'retro';
  alignment: 'left' | 'center';
  showLabels: boolean;
  bgType: 'solid' | 'gradient';
  colorWidgetBg: string;
  colorWidgetBg2: string;
  gradientDirection: 'to bottom' | 'to right' | 'to bottom right';
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
  urgencyEnabled: boolean;
  colorClockBgMedium: string;
  colorClockBgCritical: string;
  flashMinutes: number;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  scale: number;
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
  campaignTheme: 'none' | 'black-friday' | 'hot-sale' | 'cyber-monday' | 'navidad' | 'san-valentin' | 'dia-madre-padre' | 'liquidacion';
}

interface CampaignThemePreset {
  slug: CountdownConfig['campaignTheme'];
  name: string;
  emoji: string;
  themeColor: string;
  accentColor: string;
  tagline: string;
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
   PRESETS DE CAMPAÑAS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const CAMPAIGN_THEMES: CampaignThemePreset[] = [
  {
    slug: "none",
    name: "Diseño Normal / Sin Evento",
    emoji: "⚙️",
    themeColor: "#000000",
    accentColor: "#10B981",
    tagline: "Usa tus colores configurados en la pestaña Estilos.",
  },
  {
    slug: "black-friday",
    name: "Black Friday",
    emoji: "🔥",
    themeColor: "#111827",
    accentColor: "#F59E0B",
    tagline: "Estética Dark & Gold ultra premium de alto impacto.",
  },
  {
    slug: "hot-sale",
    name: "Hot Sale",
    emoji: "⚡",
    themeColor: "#0F172A",
    accentColor: "#EF4444",
    tagline: "Paleta Neón con alto sentido de escasez y compras flash.",
  },
  {
    slug: "cyber-monday",
    name: "Cyber Monday",
    emoji: "🚀",
    themeColor: "#090D16",
    accentColor: "#3B82F6",
    tagline: "Estilo cibernético moderno para liquidación digital.",
  },
  {
    slug: "navidad",
    name: "Navidad & Reyes",
    emoji: "🎄",
    themeColor: "#064E3B",
    accentColor: "#EF4444",
    tagline: "Combinación festiva de verdes y rojos para regalos.",
  },
  {
    slug: "san-valentin",
    name: "San Valentín",
    emoji: "💘",
    themeColor: "#831843",
    accentColor: "#F43F5E",
    tagline: "Diseño romántico apasionado para obsequios en pareja.",
  },
  {
    slug: "dia-madre-padre",
    name: "Día Madre / Padre",
    emoji: "🎁",
    themeColor: "#312E81",
    accentColor: "#10B981",
    tagline: "Paleta institucional que transmite confianza familiar.",
  },
  {
    slug: "liquidacion",
    name: "Liquidación / Sale",
    emoji: "🏷️",
    themeColor: "#7F1D1D",
    accentColor: "#FBBF24",
    tagline: "Diseño agresivo para cierres de stock de temporada.",
  },
];

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
   CONFIG POR DEFECTO (Regla #9 al inicio)
═══════════════════════════════════════════ */
function getDefaultEndDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(23, 59, 0, 0);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const defaultConfig: CountdownConfig = {
  title: 'Oferta 🔥',
  subtitle: '',
  mode: 'fixed',
  endDate: getDefaultEndDate(),
  durationMinutes: 15,
  autoRestart: false,
  showDays: true,
  showOnProduct: true,
  productPosition: 'before-button',
  showAsTopBar: false,
  showOnCart: false,
  style: 'clasico',
  alignment: 'left',
  showLabels: true,
  bgType: 'solid',
  colorWidgetBg: '#000000',
  colorWidgetBg2: '#10B981',
  gradientDirection: 'to bottom right',
  colorSubtitleBg: '#10B981',
  colorClockBg: '#10B981',
  colorTitle: '#ffffff',
  colorSubtitle: '#ffffff',
  colorNumbers: '#ffffff',
  fontSizeTitle: '16px',
  fontSizeSubtitle: '11px',
  fontSizeClock: '16px',
  borderRadiusClock: 5,
  borderRadiusWidget: 12,
  paddingWidget: 15,
  paddingClock: 7,
  urgencyEnabled: false,
  colorClockBgMedium: '#f97316',
  colorClockBgCritical: '#dc2626',
  flashMinutes: 15,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  scale: 1,
  auraEnabled: false,
  colorAuraCalm: '#8b5cf6',
  colorAuraMedium: '#f97316',
  colorAuraUrgent: '#10B981',
  effectsIntensity: 0,
  showShimmer: false,
  showProgressRing: false,
  showParticles: false,
  showBounce: false,
  showGlowBreath: false,
  showVibration: false,
  campaignTheme: 'none',
};

/* ═══════════════════════════════════════════
   PREVIEW HOOKS Y HELPERS (Regla #9 al inicio)
═══════════════════════════════════════════ */
function useTimeLeft(config: CountdownConfig): TimeLeft {
  const startTime = useRef<number>(Date.now());
  const totalDuration = useRef<number>((config.durationMinutes || 15) * 60 * 1000);

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
   PREVIEW SUB-COMPONENTS (Regla #9 al inicio)
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
   PREVIEW COMPONENT (antes CountdownPreview.tsx)
═══════════════════════════════════════════ */
function CountdownPreview({ config }: { config: CountdownConfig }) {
  const time = useTimeLeft(config);

  const urgencyState = getUrgencyState(time.percentConsumed, !!config.urgencyEnabled);
  const baseClockBg = getClockBgColor(config, urgencyState);
  const isCritical = urgencyState === 'critical';

  const activeTheme = config.campaignTheme && config.campaignTheme !== 'none'
    ? THEME_PRESETS[config.campaignTheme]
    : null;

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

/* ═══════════════════════════════════════════
   ICONOS SVG DEL EDITOR (Regla #9 al inicio)
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IconPalette = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z"/>
  </svg>
);

const IconClockSmall = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconRotate = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconAlignLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
  </svg>
);

const IconAlignCenter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>
  </svg>
);

const IconArrowDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconArrowDiagonal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 8 17 17 8 17"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

/* ═══════════════════════════════════════════
   SUB-COMPONENTES REUTILIZABLES DEL EDITOR (Regla #9 al inicio)
═══════════════════════════════════════════ */
function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

function TextInput({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function NumberInput({
  value, onChange, min, max, placeholder,
}: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const n = parseInt(e.target.value, 10);
        if (!isNaN(n)) onChange(n);
      }}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function DateTimeInput({
  value, onChange,
}: {
  value: string; onChange: (v: string) => void;
}) {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function CheckboxCard({
  checked, onChange, label, helper, children,
}: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; helper?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12,
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 22, height: 22, borderRadius: 5,
            background: checked ? '#10B981' : '#ffffff',
            border: checked ? '2px solid #10B981' : '2px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
            marginTop: 1,
          }}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
      {children && checked && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}

function RadioOption({
  checked, onChange, label,
}: {
  checked: boolean; onChange: () => void; label: string;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10,
      cursor: 'pointer', padding: '4px 0',
    }}>
      <div
        onClick={onChange}
        style={{
          width: 20, height: 20, borderRadius: '50%',
          border: checked ? '6px solid #10B981' : '2px solid #e5e7eb',
          background: '#ffffff', flexShrink: 0, transition: 'all 0.2s',
        }}
      />
      <span style={{ fontSize: 15, color: '#000000', fontWeight: 500 }}>
        {label}
      </span>
    </label>
  );
}

function ColorPickerField({
  value, onChange, showClear = true,
}: {
  value: string; onChange: (v: string) => void; showClear?: boolean;
}) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#000000';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        onClick={handleClick}
        style={{
          width: 60, height: 44, borderRadius: 10,
          background: value || '#ffffff', border: '1.5px solid #e5e7eb',
          cursor: 'pointer', flexShrink: 0,
        }}
      />
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v.startsWith('#') || v === '' ? v : '#' + v);
          }}
          style={{
            width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
            border: '1.5px solid #e5e7eb', borderRadius: 10,
            background: '#ffffff', color: '#000000', outline: 'none',
            fontFamily: 'monospace', boxSizing: 'border-box',
          }}
        />
        {showClear && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', color: '#000000',
              opacity: 0.5,
              fontSize: 20, padding: 4, lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function SelectField({
  value, onChange, options,
}: {
  value: string | number; onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
          border: '1.5px solid #e5e7eb', borderRadius: 10,
          background: '#ffffff', color: '#000000', outline: 'none',
          appearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#000000" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function RangeSlider({
  label, value, min, max, onChange, ticks,
}: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void;
  ticks?: number[];
}) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 10 }}>
        {label}
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%', accentColor: '#10B981', cursor: 'pointer',
        }}
      />
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 4 }}>
          {ticks.map((t) => <span key={t}>{t}px</span>)}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  icon, title, helper, children,
}: {
  icon: React.ReactNode; title: string; helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 20, marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: helper ? 4 : 20 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#000000' }}>{title}</div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 4, lineHeight: 1.4 }}>
              {helper}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: helper ? 20 : 0 }}>{children}</div>
    </div>
  );
}

function ChoiceButtons({
  options, value, onChange,
}: {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 10 }}>
      {options.map((opt) => {
        const act = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: '12px 14px', borderRadius: 10,
              border: act ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              background: act ? '#ecfdf5' : '#ffffff',
              color: act ? '#10B981' : '#000000',
              fontSize: 14, fontWeight: 600,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: 8, transition: 'all 0.2s',
              fontFamily: 'inherit', lineHeight: 1.3,
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL (EXPORT DEFAULT)
═══════════════════════════════════════════ */
export default function CountdownEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: CountdownEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CountdownConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilos' | 'fechas'>('general');
  const [customDurationOpen, setCustomDurationOpen] = useState(false);

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  const update = <K extends keyof CountdownConfig>(key: K, value: CountdownConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
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

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) {
          params.set('product', String(productId));
        }
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  const durationPresets = [5, 10, 15, 30, 45, 60, 90, 120];
  const isCustomDuration = !durationPresets.includes(config.durationMinutes);

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <FieldLabel required>Título</FieldLabel>
        <TextInput
          value={config.title}
          onChange={(v) => update('title', v)}
          placeholder="Oferta 🔥"
        />
        <FieldHelper>Texto principal del contador</FieldHelper>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Subtítulo (opcional)</FieldLabel>
        <TextInput
          value={config.subtitle}
          onChange={(v) => update('subtitle', v)}
          placeholder="Ingresa un subtítulo..."
        />
        <FieldHelper>Descripción o promoción</FieldHelper>
      </div>

      <div style={{ marginBottom: 20 }}>
        <FieldLabel required>Tipo de contador</FieldLabel>
        <ChoiceButtons
          value={config.mode}
          onChange={(v) => update('mode', v as any)}
          options={[
            { value: 'fixed', label: 'Fecha específica', icon: <IconCalendar /> },
            { value: 'duration', label: 'Duración corta', icon: <IconBolt /> },
          ]}
        />
        <FieldHelper>
          <strong>Fecha específica:</strong> el contador termina en la fecha y hora que elijas.<br />
          <strong>Duración corta ⚡:</strong> cada visitante ve un contador nuevo que arranca al entrar.
        </FieldHelper>
      </div>

      {config.mode === 'fixed' ? (
        <div style={{ marginBottom: 24 }}>
          <FieldLabel required>Fecha y hora final</FieldLabel>
          <DateTimeInput
            value={config.endDate}
            onChange={(v) => update('endDate', v)}
          />
          <FieldHelper>
            Selecciona cuándo termina la cuenta regresiva.
          </FieldHelper>
        </div>
      ) : (
        <div style={{ marginBottom: 24 }}>
          <FieldLabel required>Duración por sesión</FieldLabel>
          <SelectField
            value={isCustomDuration ? 'custom' : String(config.durationMinutes)}
            onChange={(v) => {
              if (v === 'custom') {
                setCustomDurationOpen(true);
              } else {
                setCustomDurationOpen(false);
                update('durationMinutes', parseInt(v, 10));
              }
            }}
            options={[
              { value: '5', label: '⚡ 5 minutos' },
              { value: '10', label: '⚡ 10 minutos' },
              { value: '15', label: '🔥 15 minutos (recomendado)' },
              { value: '30', label: '30 minutos' },
              { value: '45', label: '45 minutos' },
              { value: '60', label: '1 hora' },
              { value: '90', label: '1 hora 30 minutos' },
              { value: '120', label: '2 horas' },
              { value: 'custom', label: '⚙️ Personalizado...' },
            ]}
          />
          {(customDurationOpen || isCustomDuration) && (
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Minutos personalizados</FieldLabel>
              <NumberInput
                value={config.durationMinutes}
                min={1}
                max={1440}
                onChange={(v) => update('durationMinutes', v)}
                placeholder="Ej: 20"
              />
            </div>
          )}
          <FieldHelper>
            Cada visitante ve un contador nuevo que arranca en <strong>{config.durationMinutes} min</strong> al entrar.
          </FieldHelper>
        </div>
      )}

      {config.mode === 'fixed' && (
        <CheckboxCard
          checked={config.autoRestart}
          onChange={(v) => update('autoRestart', v)}
          label="Reiniciar automáticamente cuando termine"
          helper="El contador se reiniciará con la duración configurada cada vez que llegue a 00:00:00"
        />
      )}

      <CheckboxCard
        checked={config.showDays}
        onChange={(v) => update('showDays', v)}
        label="Mostrar días"
        helper="Si se desactiva, los días se acumulan en las horas."
      />
    </div>
  );

  /* ═══ TAB UBICACIÓN ═══ */
  const tabUbicacion = (
    <div>
      <CheckboxCard
        checked={config.showOnProduct}
        onChange={(v) => update('showOnProduct', v)}
        label="Mostrar en ficha de producto"
        helper="El widget aparecerá dentro de la ficha de producto."
      >
        <div style={{ paddingLeft: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 12 }}>
            Ubicación del widget
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <RadioOption
              checked={config.productPosition === 'before-button'}
              onChange={() => update('productPosition', 'before-button')}
              label='Antes del botón "Agregar al carrito"'
            />
            <RadioOption
              checked={config.productPosition === 'before-title'}
              onChange={() => update('productPosition', 'before-title')}
              label="Antes del título del producto"
            />
          </div>
        </div>
      </CheckboxCard>

      <CheckboxCard
        checked={config.showAsTopBar}
        onChange={(v) => update('showAsTopBar', v)}
        label="Mostrar como barra fija en la parte superior"
        helper="Se mostrará en la parte superior fija de la pantalla."
      />

      <CheckboxCard
        checked={config.showOnCart}
        onChange={(v) => update('showOnCart', v)}
        label="Mostrar en el carrito"
        helper="Se mostrará al comienzo del carrito cuando el cliente lo abra."
      />
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div>
      <SectionCard
        icon={<IconClock />}
        title="Estilo del reloj"
        helper="Customizá la apariencia del contador."
      >
        <FieldLabel>Estilo del reloj</FieldLabel>
        <ChoiceButtons
          value={config.style}
          onChange={(v) => update('style', v as any)}
          options={[
            { value: 'clasico', label: 'Clásico', icon: <IconClockSmall /> },
            { value: 'retro', label: 'Retro flip', icon: <IconRotate /> },
          ]}
        />

        <div style={{ marginTop: 20 }}>
          <FieldLabel>Alineación del contenido</FieldLabel>
          <ChoiceButtons
            value={config.alignment}
            onChange={(v) => update('alignment', v as any)}
            options={[
              { value: 'left', label: 'Izquierda / derecha', icon: <IconAlignLeft /> },
              { value: 'center', label: 'Siempre centrado', icon: <IconAlignCenter /> },
            ]}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <CheckboxCard
            checked={config.showLabels}
            onChange={(v) => update('showLabels', v)}
            label="Mostrar etiquetas del reloj"
            helper="Muestra los textos DÍAS, HRS, MIN y SEG."
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={<IconLayers />}
        title="Fondo del widget"
        helper="Elegí el fondo principal del widget."
      >
        <FieldLabel>Tipo de fondo</FieldLabel>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <RadioOption
            checked={config.bgType === 'solid'}
            onChange={() => update('bgType', 'solid')}
            label="Color sólido"
          />
          <RadioOption
            checked={config.bgType === 'gradient'}
            onChange={() => update('bgType', 'gradient')}
            label="Degradé"
          />
        </div>

        {config.bgType === 'solid' ? (
          <>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField
              value={config.colorWidgetBg}
              onChange={(v) => update('colorWidgetBg', v)}
              showClear={false}
            />
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div>
              <FieldLabel>Color inicial</FieldLabel>
              <ColorPickerField
                value={config.colorWidgetBg}
                onChange={(v) => update('colorWidgetBg', v)}
                showClear={false}
              />
            </div>

            <div>
              <FieldLabel>Color final</FieldLabel>
              <ColorPickerField
                value={config.colorWidgetBg2}
                onChange={(v) => update('colorWidgetBg2', v)}
                showClear={false}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <FieldLabel>Dirección del degradé</FieldLabel>
              <ChoiceButtons
                value={config.gradientDirection}
                onChange={(v) => update('gradientDirection', v as any)}
                options={[
                  { value: 'to bottom', label: 'Vertical', icon: <IconArrowDown /> },
                  { value: 'to right', label: 'Horizontal', icon: <IconArrowRight /> },
                  { value: 'to bottom right', label: 'Diagonal', icon: <IconArrowDiagonal /> },
                ]}
              />
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        icon={<IconPalette />}
        title="Colores"
        helper="Definí los colores de textos y fondos."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div>
            <FieldLabel>Color de fondo del reloj</FieldLabel>
            <ColorPickerField
              value={config.colorClockBg}
              onChange={(v) => update('colorClockBg', v)}
              showClear={false}
            />
          </div>

          <div>
            <FieldLabel>Color de fuente del título</FieldLabel>
            <ColorPickerField
              value={config.colorTitle}
              onChange={(v) => update('colorTitle', v)}
              showClear={false}
            />
          </div>

          <div>
            <FieldLabel>Color de números</FieldLabel>
            <ColorPickerField
              value={config.colorNumbers}
              onChange={(v) => update('colorNumbers', v)}
              showClear={false}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );

  /* ═══ TAB FECHAS ESPECIALES ═══ */
  const tabFechasEspeciales = (
    <div>
      <div
        style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: '#065f46', marginBottom: 4 }}>
          🔥 Maquillaje de Temporada Exclusivo
        </div>
        <div style={{ fontSize: 13, color: '#047857', lineHeight: 1.5 }}>
          Elegí si querés que este contador adopte la estética de un evento de alta venta. 
          Podés activarlo o volver al <strong>Diseño Normal</strong> cuando quieras.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {CAMPAIGN_THEMES.map((theme) => {
          const isSelected = config.campaignTheme === theme.slug;
          return (
            <div
              key={theme.slug}
              onClick={() => update('campaignTheme', theme.slug)}
              style={{
                background: isSelected ? '#ffffff' : '#f9fafb',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                borderRadius: 14,
                padding: 16,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 14px rgba(16, 185, 129, 0.15)' : 'none',
                position: 'relative',
                flexWrap: 'wrap',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{theme.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#000000' }}>{theme.name}</span>
                </div>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: isSelected ? '5px solid #10B981' : '2px solid #d1d5db',
                    background: '#ffffff',
                    flexShrink: 0,
                  }}
                />
              </div>

              <p style={{ fontSize: 12.5, color: '#000000', opacity: 0.6, margin: 0, lineHeight: 1.4 }}>
                {theme.tagline}
              </p>

              {theme.slug !== 'none' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: theme.themeColor, border: '1px solid #d1d5db' }} />
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: theme.accentColor, border: '1px solid #d1d5db' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#000000', opacity: 0.5, marginLeft: 4 }}>
                    Paleta Oficial
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'fechas', label: '🔥 Fechas Especiales' },
  ];

  const infoBoxText = config.productPosition === 'before-title'
    ? 'La cuenta regresiva aparecerá antes del título del producto.'
    : 'La cuenta regresiva aparecerá antes del botón "Agregar al carrito".';

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            RL
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>

        {/* Scope chip */}
        {isForAll ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#10B981',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            <IconStore />
            Todos los productos
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span>
            NEVUX Widget
          </div>
        )}

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* PREVIEW */}
          <div style={{ marginBottom: 14 }}>
            <CountdownPreview config={config} />
          </div>

          {/* NOTA INFO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 16,
              fontSize: 14,
              color: '#000000',
              lineHeight: 1.5,
            }}
          >
            <IconInfo />
            <span>{infoBoxText}</span>
          </div>

          {/* TABS (4 PESTAÑAS) */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 20,
            }}
          >
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    background: act ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    padding: '14px 6px',
                    fontSize: 14,
                    fontWeight: act ? 800 : 500,
                    color: act ? '#059669' : '#000000',
                    opacity: act ? 1 : 0.6,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'ubicacion' && tabUbicacion}
            {activeTab === 'estilos' && tabEstilos}
            {activeTab === 'fechas' && tabFechasEspeciales}
          </div>

          {/* FOOTER CONTROLES */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 999,
                  background: isActive ? '#10B981' : '#e5e7eb',
                  position: 'relative',
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    position: 'absolute',
                    top: 2,
                    left: isActive ? 20 : 2,
                    transition: 'left 0.15s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
                Widget activo
              </span>
              <IconInfo />
            </label>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                borderRadius: 999,
                border: 'none',
                background: savedOK ? '#059669' : '#10B981',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {saving
                ? 'Guardando...'
                : savedOK
                ? '✓ Guardado'
                : isEditing
                ? 'Guardar cambios'
                : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
}
