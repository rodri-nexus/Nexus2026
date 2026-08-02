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
  const endDateStr = config.end_date || config.endDate;
  if (!endDateStr) {
    // Default: 24 horas desde ahora
    const d = new Date();
    d.setHours(d.getHours() + (config.hours || 24));
    return d;
  }
  const d = new Date(endDateStr);
  return isNaN(d.getTime()) ? null : d;
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

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    initialSeconds: totalSeconds + diff / 1000, // aproximado para demo
  };
}

function getUrgencyColor(totalSeconds: number, thresholdHours: number): string {
  const thresholdSeconds = thresholdHours * 3600;
  if (totalSeconds <= 0) return "#ef4444";
  if (totalSeconds <= thresholdSeconds * 0.3) return "#ef4444"; // Rojo crítico
  if (totalSeconds <= thresholdSeconds * 0.6) return "#f59e0b"; // Naranja
  return "#10b981"; // Verde
}

function FlipCard({ value, label, color }: { value: number; label: string; color: string }) {
  const displayValue = String(value).padStart(2, "0");
  const [prevValue, setPrevValue] = useState(displayValue);

  useEffect(() => {
    if (displayValue !== prevValue) {
      setPrevValue(displayValue);
    }
  }, [displayValue, prevValue]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div
        style={{
          position: "relative",
          width: "56px",
          height: "64px",
          perspective: "400px",
        }}
      >
        {/* Card background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${color}22 0%, ${color}11 100%)`,
            border: `1px solid ${color}44`,
            borderRadius: "10px",
            backdropFilter: "blur(8px)",
          }}
        />
        {/* Top half shadow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)",
            borderRadius: "10px 10px 0 0",
            pointerEvents: "none",
          }}
        />
        {/* Center line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "4px",
            right: "4px",
            height: "1px",
            background: "rgba(0,0,0,0.3)",
            transform: "translateY(-0.5px)",
          }}
        />
        {/* Number */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={displayValue}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: color,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.05em",
              transformStyle: "preserve-3d",
            }}
          >
            {displayValue}
          </motion.div>
        </AnimatePresence>
      </div>
      <span
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          color: `${color}aa`,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownWidget({ config }: CountdownWidgetProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    initialSeconds: 86400,
  });

  const endDate = useMemo(() => parseEndDate(config), [config]);
  const showDays = config.show_days !== false;
  const showLabels = config.show_labels !== false;
  const urgencyThreshold = config.urgency_threshold || 6;
  const style = config.style || "modern";
  const backgroundType = config.background_type || "glass";
  const bgColor = config.background_color || "#0f0f1a";
  const accentColor = config.accent_color || "#6366f1";
  const textColor = config.text_color || "#f8fafc";
  const numberColor = config.number_color || accentColor;
  const borderRadius = config.border_radius || 16;
  const padding = config.padding || 24;
  const showProgress = config.show_progress_bar !== false;

  const urgencyColor = getUrgencyColor(timeLeft.totalSeconds, urgencyThreshold);

  useEffect(() => {
    setTimeLeft(getTimeLeft(endDate));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const progress = timeLeft.initialSeconds > 0
    ? Math.max(0, Math.min(100, (timeLeft.totalSeconds / timeLeft.initialSeconds) * 100))
    : 0;

  const isUrgent = timeLeft.totalSeconds > 0 && timeLeft.totalSeconds <= urgencyThreshold * 3600;

  const getBackground = () => {
    if (backgroundType === "solid") {
      return bgColor;
    }
    if (backgroundType === "gradient") {
      return `linear-gradient(135deg, ${bgColor}, ${accentColor}22)`;
    }
    // glass
    return `rgba(15, 23, 42, 0.4)`;
  };

  const getBorder = () => {
    if (backgroundType === "glass") {
      return `1px solid ${isUrgent ? `${urgencyColor}44` : "rgba(255,255,255,0.08)"}`;
    }
    return "none";
  };

  const units = [
    { value: timeLeft.days, label: "DÍAS", show: showDays },
    { value: timeLeft.hours, label: "HRS", show: true },
    { value: timeLeft.minutes, label: "MIN", show: true },
    { value: timeLeft.seconds, label: "SEG", show: true },
  ].filter((u) => u.show);

  if (timeLeft.totalSeconds <= 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: `${padding}px`,
          background: getBackground(),
          borderRadius: `${borderRadius}px`,
          border: getBorder(),
          backdropFilter: backgroundType === "glass" ? "blur(20px)" : "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "200px",
            height: "200px",
            background: `radial-gradient(circle, ${urgencyColor}30 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}
          >
            ⏰
          </motion.div>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem", fontWeight: 800, color: "#ef4444" }}>
            ¡La oferta terminó!
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
            Esta promoción ya no está disponible
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: `${padding}px`,
        background: getBackground(),
        borderRadius: `${borderRadius}px`,
        border: getBorder(),
        backdropFilter: backgroundType === "glass" ? "blur(20px)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow ambiental */}
      <motion.div
        animate={{
          opacity: isUrgent ? [0.3, 0.7, 0.3] : [0.15, 0.3, 0.15],
          scale: isUrgent ? [1, 1.1, 1] : [1, 1.05, 1],
        }}
        transition={{ duration: isUrgent ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "300px",
          height: "300px",
          background: `radial-gradient(circle, ${urgencyColor}25 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Partículas sutiles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${15 + i * 14}%`,
            bottom: "20%",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: urgencyColor,
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h3
            style={{
              margin: "0 0 0.25rem",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: textColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            {config.title || "Oferta limitada"}
            <motion.span
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ display: "inline-block" }}
            >
              🔥
            </motion.span>
          </h3>
          {config.subtitle && (
            <p style={{ margin: 0, fontSize: "0.8rem", color: `${textColor}aa` }}>
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Contador */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "0.5rem" }}>
          {units.map((unit, i) => (
            <div key={unit.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <FlipCard value={unit.value} label={showLabels ? unit.label : ""} color={numberColor} />
              {i < units.length - 1 && (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: `${numberColor}88`,
                    marginTop: "12px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  :
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Barra de progreso */}
        {showProgress && (
          <div style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                width: "100%",
                height: "4px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "linear" }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${urgencyColor}, ${urgencyColor}88)`,
                  borderRadius: "2px",
                }}
              />
            </div>
            <div
              style={{
                marginTop: "0.4rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.65rem",
                color: `${textColor}66`,
              }}
            >
              <span>Inicio</span>
              <span style={{ color: urgencyColor, fontWeight: 700 }}>
                {isUrgent ? "¡Queda poco tiempo!" : "En curso"}
              </span>
              <span>Fin</span>
            </div>
          </div>
        )}

        {/* Badge de urgencia */}
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.35rem 0.8rem",
                background: `linear-gradient(135deg, ${urgencyColor}22, ${urgencyColor}11)`,
                border: `1px solid ${urgencyColor}44`,
                borderRadius: "999px",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: urgencyColor,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ⚡
              </motion.span>
              ¡Últimas {Math.ceil(timeLeft.totalSeconds / 60)} minutos!
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
    }
