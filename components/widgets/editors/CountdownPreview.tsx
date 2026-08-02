// components/widgets/editors/CountdownPreview.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownConfig {
  title: string;
  subtitle: string;
  endDate: string;
  showDays: boolean;
  clockStyle: 'classic' | 'retro-flip';
  alignment: 'split' | 'centered';
  showLabels: boolean;
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  subtitleBg: string;
  clockBg: string;
  titleColor: string;
  subtitleColor: string;
  numbersColor: string;
  labelsColor: string;
  separatorColor: string;
  titleFontSize: string;
  numbersFontSize: string;
  borderRadius: string;
  clockBorderRadius: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: string, showDays: boolean): TimeLeft {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  if (showDays && days > 0) {
    return {
      days,
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60,
    };
  }

  return {
    days: 0,
    hours: showDays ? totalHours % 24 : totalHours,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
  };
}

export default function CountdownPreview({ config }: { config: CountdownConfig }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(config.endDate, config.showDays)
  );
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(config.endDate, config.showDays));
      setColonVisible(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [config.endDate, config.showDays]);

  const bgStyle =
    config.backgroundType === 'gradient'
      ? `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`
      : config.backgroundColor;

  const isSplit = config.alignment === 'split';
  const showDaysBlock = config.showDays && timeLeft.days > 0;

  const pad = (n: number) => String(n).padStart(2, '0');

  const renderTimeBlock = (value: number, label: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div
        style={{
          background: config.clockBg,
          borderRadius: config.clockBorderRadius,
          padding: config.clockStyle === 'retro-flip' ? '8px 10px' : '6px 10px',
          minWidth: 44,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {config.clockStyle === 'retro-flip' && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 1,
              background: 'rgba(0,0,0,0.2)',
              zIndex: 1,
            }}
          />
        )}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`${label}-${value}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'block',
              fontSize: config.numbersFontSize,
              fontWeight: 800,
              color: config.numbersColor,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.2,
            }}
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      {config.showLabels && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: config.labelsColor,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  const renderSeparator = () => (
    <span
      style={{
        fontSize: config.numbersFontSize,
        fontWeight: 800,
        color: config.separatorColor,
        opacity: colonVisible ? 1 : 0.3,
        transition: 'opacity 0.3s',
        alignSelf: config.showLabels ? 'flex-start' : 'center',
        marginTop: config.showLabels ? 4 : 0,
        lineHeight: 1.2,
      }}
    >
      :
    </span>
  );

  const clockContent = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
      }}
    >
      {showDaysBlock && (
        <>
          {renderTimeBlock(timeLeft.days, 'DÍAS')}
          {renderSeparator()}
        </>
      )}
      {renderTimeBlock(timeLeft.hours, 'HRS')}
      {renderSeparator()}
      {renderTimeBlock(timeLeft.minutes, 'MIN')}
      {renderSeparator()}
      {renderTimeBlock(timeLeft.seconds, 'SEG')}
    </div>
  );

  const titleContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: isSplit ? 'flex-start' : 'center',
      }}
    >
      <span
        style={{
          fontSize: config.titleFontSize,
          fontWeight: 700,
          color: config.titleColor,
        }}
      >
        {config.title || 'Oferta 🔥'}
      </span>
      {config.subtitle && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: config.subtitleColor,
            background: config.subtitleBg,
            padding: '2px 8px',
            borderRadius: 4,
            display: 'inline-block',
          }}
        >
          {config.subtitle}
        </span>
      )}
    </div>
  );

  return (
    <div
      style={{
        background: bgStyle,
        borderRadius: config.borderRadius,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: isSplit ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: isSplit ? 'space-between' : 'center',
        gap: isSplit ? 16 : 12,
        overflow: 'hidden',
      }}
    >
      {titleContent}
      {clockContent}
    </div>
  );
}
