"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownWidgetProps {
  config: Record<string, any>;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  initialSeconds: number;
}

function parseEndDate(config: Record<string, any>): Date | null {
  const endDateStr = config.end_datetime || config.endDate;
  if (endDateStr) {
    const d = new Date(endDateStr);
    if (!isNaN(d.getTime())) return d;
  }
  const hours = config.hours || 24;
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d;
}

function getTimeLeft(endDate: Date | null): TimeLeft {
  if (!endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, initialSeconds: 86400 };
  }
  const now = new Date().getTime();
  const end = endDate.getTime();
  const diff = Math.max(0, end - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const totalSeconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds, totalSeconds, initialSeconds: totalSeconds + 3600 };
}

function FlipDigit({ value, color, bgColor, fontSize, padding, borderRadius }: any) {
  const displayValue = String(value).padStart(2, "0");
  const [prevValue, setPrevValue] = useState(displayValue);

  useEffect(() => {
    if (displayValue !== prevValue) setPrevValue(displayValue);
  }, [displayValue, prevValue]);

  return (
    <div
      style={{
        position: "relative",
        width: `${fontSize * 2.2}px`,
        height: `${fontSize * 2.6}px`,
        perspective: "400px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bgColor,
          borderRadius: `${borderRadius}px`,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
            borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "4px",
            right: "4px",
            height: "1px",
            background: "rgba(0,0,0,0.25)",
            zIndex: 3,
          }}
        />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={displayValue}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${fontSize}px`,
              fontWeight: 800,
              color: color,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.05em",
              transformStyle: "preserve-3d",
              padding: `${padding}px`,
            }}
          >
            {displayValue}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ClassicDigit({ value, color, bgColor, fontSize, padding, borderRadius }: any) {
  const displayValue = String(value).padStart(2, "0");
  return (
    <div
      style={{
        background: bgColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px ${padding * 1.5}px`,
        minWidth: `${fontSize * 2}px`,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: 800,
          color: color,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>
    </div>
  );
}

export default function CountdownWidget({ config }: CountdownWidgetProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, initialSeconds: 86400,
  });

  const endDate = useMemo(() => parseEndDate(config), [config]);

  // Configs con defaults de Wigy
  const title = config.title || "Oferta🔥";
  const subtitle = config.subtitle || "";
  const showDays = config.show_days !== false;
  const showLabels = config.show_clock_labels !== false;
  const clockStyle = config.clock_style || "classic";
  const alignment = config.content_alignment || "center";
  const bgType = config.background_type || "solid";
  const bgColor = config.background_color || "#1e1e1e";
  const clockBg = config.clock_bg_color || "#ef4444";
  const subtitleBg = config.subtitle_bg_color || "#fdc624";
  const titleColor = config.title_font_color || "#ffffff";
  const subtitleColor = config.subtitle_font_color || "#000000";
  const numberColor = config.number_font_color || "#ffffff";
  const titleSize = config.title_font_size || 16;
  const subtitleSize = config.subtitle_font_size || 11;
  const clockSize = config.clock_font_size || 16;
  const clockRadius = config.clock_border_radius || 5;
  const widgetRadius = config.widget_border_radius || 5;
  const widgetPad = config.widget_padding || 15;
  const clockPad = config.clock_padding || 7;

  useEffect(() => {
    setTimeLeft(getTimeLeft(endDate));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(endDate)), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const alignStyle = alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center";

  const getBg = () => {
    if (bgType === "gradient") return `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`;
    return bgColor;
  };

  const units = [
    { value: timeLeft.days, label: "DÍAS", show: showDays && timeLeft.days > 0 },
    { value: timeLeft.hours, label: "HRS", show: true },
    { value: timeLeft.minutes, label: "MIN", show: true },
    { value: timeLeft.seconds, label: "SEG", show: true },
  ].filter((u) => u.show);

  if (timeLeft.totalSeconds <= 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: `${widgetPad}px`,
          background: getBg(),
          borderRadius: `${widgetRadius}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
        >
          ⏰
        </motion.div>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: `${titleSize}px`, fontWeight: 800, color: "#ef4444" }}>
          ¡La oferta terminó!
        </h3>
        <p style={{ margin: 0, fontSize: `${subtitleSize}px`, color: "#94a3b8" }}>
          Esta promoción ya no está disponible
        </p>
      </div>
    );
  }

  const DigitComponent = clockStyle === "retro_flip" ? FlipDigit : ClassicDigit;

  return (
    <div
      style={{
        padding: `${widgetPad}px`,
        background: getBg(),
        borderRadius: `${widgetRadius}px`,
        position: "relative",
        overflow: "hidden",
        textAlign: alignment as any,
      }}
    >
      {/* Glow sutil */}
      <motion.div
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200px",
          height: "200px",
          background: `radial-gradient(circle, ${clockBg}30 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Título */}
        <div style={{ marginBottom: subtitle ? "0.3rem" : "0.8rem", textAlign: alignment as any }}>
          <h3
            style={{
              margin: 0,
              fontSize: `${titleSize}px`,
              fontWeight: 800,
              color: titleColor,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              justifyContent: alignStyle,
            }}
          >
            {title}
            <motion.span
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              🔥
            </motion.span>
          </h3>
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <div
            style={{
              display: "inline-block",
              marginBottom: "0.8rem",
              padding: "0.25rem 0.7rem",
              background: subtitleBg,
              borderRadius: "6px",
              textAlign: alignment as any,
            }}
          >
            <span style={{ fontSize: `${subtitleSize}px`, fontWeight: 600, color: subtitleColor }}>
              {subtitle}
            </span>
          </div>
        )}

        {/* Reloj */}
        <div style={{ display: "flex", justifyContent: alignStyle, alignItems: "center", gap: "0.4rem" }}>
          {units.map((unit, i) => (
            <div key={unit.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                <DigitComponent
                  value={unit.value}
                  color={numberColor}
                  bgColor={clockBg}
                  fontSize={clockSize}
                  padding={clockPad}
                  borderRadius={clockRadius}
                />
                {showLabels && (
                  <span
                    style={{
                      fontSize: `${Math.max(9, clockSize * 0.45)}px`,
                      fontWeight: 700,
                      color: `${titleColor}aa`,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {unit.label}
                  </span>
                )}
              </div>
              {i < units.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    fontSize: `${clockSize * 0.9}px`,
                    fontWeight: 800,
                    color: `${titleColor}66`,
                    marginTop: showLabels ? "-0.8rem" : "0",
                  }}
                >
                  :
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    }
