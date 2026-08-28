// app/dashboard/components/PlanStatusCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Crown,
  Gift,
  Sparkles,
  Zap,
  TrendingUp,
  Calendar,
} from "lucide-react";
import type { PlanInfo } from "@/lib/plan";

interface PlanStatusCardProps {
  plan: PlanInfo;
}

// ─── HITOS DE RECOMPENSAS ──────────────────────
const REWARDS = [
  {
    month: 3,
    title: "Widgets premium",
    description: "+ 1 widget personalizado único",
    icon: <Gift size={16} />,
  },
  {
    month: 6,
    title: "Widgets custom",
    description: "+ descuentos exclusivos",
    icon: <Sparkles size={16} />,
  },
  {
    month: 12,
    title: "Cliente VIP",
    description: "Beneficios exclusivos de por vida",
    icon: <Crown size={16} />,
  },
];

// Formateador seguro de fechas (previene crash por strings ISO)
function formatSafeDate(dateVal: Date | string | null | undefined): string {
  if (!dateVal) return "—";
  try {
    const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function PlanStatusCard({ plan }: PlanStatusCardProps) {
  const {
    status,
    daysRemaining = 0,
    hoursRemaining = 0,
    monthsActive = 0,
    trialEndsAt,
    planActiveUntil,
  } = plan || {};

  const isTrial = status === "trial" || status === "trial_ending_soon";
  const isActive = status === "active" || status === "expiring_soon";
  const isExpiringSoon =
    status === "trial_ending_soon" || status === "expiring_soon";
  const showRenewCTA = daysRemaining <= 5;

  // ─── PRÓXIMA RECOMPENSA ───────────────────
  const nextReward = REWARDS.find((r) => r.month > monthsActive);
  const isVIP = monthsActive >= 12;
  const unlockedRewards = REWARDS.filter((r) => r.month <= monthsActive);

  // Progreso hacia próxima recompensa
  let progressPercent = 0;
  let previousMilestone = 0;
  if (nextReward) {
    const prevReward = REWARDS.filter((r) => r.month <= monthsActive).pop();
    previousMilestone = prevReward ? prevReward.month : 0;
    const total = nextReward.month - previousMilestone;
    const current = monthsActive - previousMilestone;
    progressPercent = Math.min(100, Math.max(0, (current / total) * 100));
  }

  const monthsToNext = nextReward ? nextReward.month - monthsActive : 0;
  const monthsToNextLabel = `${monthsToNext} ${
    monthsToNext === 1 ? "mes restante" : "meses restantes"
  }`;

  // ─── ESTILOS SEGÚN ESTADO (PALETA OFICIAL VERDE ESMERALDA) ─────
  const gradientBg = isVIP
    ? "linear-gradient(135deg, #059669 0%, #000000 100%)"
    : isExpiringSoon
    ? "linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%)"
    : "#ffffff";

  const borderColor = isVIP
    ? "transparent"
    : isExpiringSoon
    ? "#10B981"
    : "#e5e7eb";

  const textColor = isVIP ? "#ffffff" : "#000000";

  // ─── FECHA DE VENCIMIENTO A MOSTRAR (SEGURO) ───────
  const rawEndDate = isTrial ? trialEndsAt : planActiveUntil;
  const endDateFormatted = formatSafeDate(rawEndDate);

  // ─── TEXTO DE ESTADO ──────────────────────
  const statusConfig = isVIP
    ? {
        badge: "🏆 CLIENTE VIP",
        title: "¡Sos parte de la élite Nevux!",
        subtitle: "Gracias por confiar en nosotros hace más de un año",
      }
    : isTrial
    ? {
        badge: isExpiringSoon ? "⏰ TRIAL POR FINALIZAR" : "✨ TRIAL GRATUITO",
        title: `Estás probando Nevux`,
        subtitle: `Tenés ${daysRemaining} ${
          daysRemaining === 1 ? "día" : "días"
        } gratis para probar todos los widgets`,
      }
    : isActive
    ? {
        badge: isExpiringSoon ? "⚡ RENOVACIÓN PRÓXIMA" : "✓ PLAN ACTIVO",
        title: "Tu plan está activo",
        subtitle: `Renovación mensual · ${monthsActive} ${
          monthsActive === 1 ? "mes" : "meses"
        } acumulado${monthsActive === 1 ? "" : "s"}`,
      }
    : {
        badge: "PLAN INACTIVO",
        title: "Plan no disponible",
        subtitle: "Activá tu cuenta para seguir usando Nevux",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: gradientBg,
        border: `${isVIP ? "0" : isExpiringSoon ? "2px" : "1px"} solid ${borderColor}`,
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: isVIP
          ? "0 10px 40px rgba(16, 185, 129, 0.25)"
          : isExpiringSoon
          ? "0 6px 24px rgba(16, 185, 129, 0.12)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Sparkles decorativos para VIP */}
      {isVIP && (
        <>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.75rem",
                background: isVIP
                  ? "rgba(255,255,255,0.2)"
                  : isExpiringSoon
                  ? "#10B981"
                  : "#000000",
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              {statusConfig.badge}
            </div>

            <h3
              style={{
                margin: "0 0 0.35rem 0",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: textColor,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {statusConfig.title}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "0.88rem",
                color: textColor,
                opacity: isVIP ? 0.85 : 0.6,
                lineHeight: 1.4,
              }}
            >
              {statusConfig.subtitle}
            </p>
          </div>

          {/* Contador grande de días */}
          {(isTrial || isActive) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: isExpiringSoon ? "#10B981" : textColor,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {daysRemaining > 0 ? daysRemaining : hoursRemaining}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: textColor,
                  opacity: isVIP ? 0.75 : 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: "0.2rem",
                  whiteSpace: "nowrap",
                }}
              >
                {daysRemaining > 0
                  ? daysRemaining === 1
                    ? "día restante"
                    : "días restantes"
                  : hoursRemaining === 1
                  ? "hora restante"
                  : "horas restantes"}
              </div>
            </div>
          )}
        </div>

        {/* FECHA DE VENCIMIENTO */}
        {(isTrial || isActive) && rawEndDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1rem",
              background: isVIP
                ? "rgba(255,255,255,0.12)"
                : isExpiringSoon
                ? "#ffffff"
                : "#f9fafb",
              borderRadius: "10px",
              marginBottom: "1.25rem",
              fontSize: "0.85rem",
              color: textColor,
              flexWrap: "wrap",
            }}
          >
            <Calendar size={15} style={{ opacity: 0.6, flexShrink: 0 }} />
            <span style={{ opacity: isVIP ? 0.85 : 0.6 }}>
              {isTrial ? "Trial vence el" : "Renovación:"}
            </span>
            <strong style={{ marginLeft: "auto" }}>{endDateFormatted}</strong>
          </div>
        )}

        {/* BLOQUE MESES + RECOMPENSA */}
        {!isTrial && (
          <div
            style={{
              padding: "1.25rem",
              background: isVIP
                ? "rgba(255,255,255,0.1)"
                : "#f9fafb",
              borderRadius: "12px",
              marginBottom: showRenewCTA ? "1rem" : "0",
            }}
          >
            {/* Meses acumulados */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "0.75rem",
                marginBottom: nextReward ? "1.25rem" : "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: textColor,
                    opacity: isVIP ? 0.75 : 0.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <TrendingUp size={11} />
                  Fidelidad
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: textColor,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {monthsActive}{" "}
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      opacity: isVIP ? 0.75 : 0.5,
                    }}
                  >
                    {monthsActive === 1 ? "mes" : "meses"}
                  </span>
                </div>
              </div>

              {/* Recompensas desbloqueadas (chips) */}
              {unlockedRewards.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.35rem",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {unlockedRewards.map((r) => (
                    <div
                      key={r.month}
                      title={`Mes ${r.month}: ${r.title}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.3rem 0.65rem",
                        background: isVIP
                          ? "rgba(255,255,255,0.2)"
                          : "#10B981",
                        color: "#ffffff",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.icon}
                      Mes {r.month}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Barra de progreso */}
            {nextReward && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.6rem",
                    fontSize: "0.78rem",
                    color: textColor,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      opacity: isVIP ? 0.85 : 0.7,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Próxima recompensa · Mes {nextReward.month}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      color: isVIP ? "#ffffff" : "#10B981",
                    }}
                  >
                    {monthsToNextLabel}
                  </span>
                </div>

                {/* Barra */}
                <div
                  style={{
                    height: "8px",
                    background: isVIP
                      ? "rgba(255,255,255,0.15)"
                      : "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden",
                    marginBottom: "0.75rem",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: isVIP
                        ? "#ffffff"
                        : "linear-gradient(90deg, #10B981 0%, #059669 100%)",
                      borderRadius: "999px",
                    }}
                  />
                </div>

                {/* Descripción recompensa */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    padding: "0.7rem 0.9rem",
                    background: isVIP
                      ? "rgba(255,255,255,0.1)"
                      : "#ffffff",
                    border: isVIP
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px dashed #10B981",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    color: textColor,
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      color: isVIP ? "#ffffff" : "#10B981",
                      display: "inline-flex",
                      alignItems: "center",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  >
                    {nextReward.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontWeight: 700 }}>
                      {nextReward.title}
                    </strong>
                    <span
                      style={{
                        opacity: isVIP ? 0.85 : 0.65,
                        marginLeft: "0.35rem",
                      }}
                    >
                      · {nextReward.description}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje cliente VIP */}
            {isVIP && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  color: "#ffffff",
                  marginTop: "0.5rem",
                  lineHeight: 1.4,
                }}
              >
                <Crown size={16} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>
                  Desbloqueaste todas las recompensas · Sos parte de la élite
                </span>
              </div>
            )}
          </div>
        )}

        {/* CTA RENOVAR / ACTIVAR (100% VERDE ESMERALDA) */}
        {showRenewCTA && (isTrial || isActive) && (
          <Link
            href="/plan/pagar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.95rem",
              background: isVIP ? "#ffffff" : "#10B981",
              color: isVIP ? "#10B981" : "#ffffff",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
              boxSizing: "border-box",
              marginTop: "0",
            }}
          >
            <Zap size={17} />
            {isTrial ? "Activar mi cuenta ahora" : "Renovar ahora"}
          </Link>
        )}
      </div>
    </motion.div>
  );
  }
