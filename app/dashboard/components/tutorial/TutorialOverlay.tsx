"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import type { TutorialStep } from "./tutorialSteps";

interface TutorialOverlayProps {
  step: TutorialStep;
  stepIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const SPOTLIGHT_PADDING = 8;
const CARD_GAP = 20;

export default function TutorialOverlay({
  step,
  stepIndex,
  totalSteps,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip,
  onFinish,
}: TutorialOverlayProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [cardTop, setCardTop] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardReady, setCardReady] = useState(false);

  const isCentered = step.target === null || step.placement === "center";

  // ─────────────────────────────────────────────
  // Buscar y trackear posición del elemento target
  // ─────────────────────────────────────────────
  useLayoutEffect(() => {
    setCardReady(false);

    if (isCentered || !step.target) {
      setTargetRect(null);
      requestAnimationFrame(() => setCardReady(true));
      return;
    }

    let retries = 0;
    const MAX_RETRIES = 30;
    let cancelled = false;

    function updateRect() {
      if (cancelled) return;
      const el = document.querySelector(step.target!) as HTMLElement | null;

      if (!el) {
        if (retries < MAX_RETRIES) {
          retries++;
          requestAnimationFrame(updateRect);
        }
        return;
      }

      const rect = el.getBoundingClientRect();
      const isOutOfView =
        rect.top < 80 || rect.bottom > window.innerHeight - 80;

      if (isOutOfView) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setTimeout(() => {
          if (cancelled) return;
          const r = el.getBoundingClientRect();
          setTargetRect({
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
          });
          requestAnimationFrame(() => setCardReady(true));
        }, 400);
      } else {
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
        requestAnimationFrame(() => setCardReady(true));
      }
    }

    updateRect();

    function handleReposition() {
      const el = document.querySelector(step.target!) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTargetRect({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      });
    }

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition);
    };
  }, [step.target, isCentered, step.id]);

  // ─────────────────────────────────────────────
  // Calcular SOLO el top de la card (X siempre centrada)
  // ─────────────────────────────────────────────
  useLayoutEffect(() => {
    if (isCentered || !targetRect || !cardRef.current) return;

    const cardHeight = cardRef.current.offsetHeight;
    const vh = window.innerHeight;

    const spaceAbove = targetRect.top;
    const spaceBelow = vh - (targetRect.top + targetRect.height);

    let placement: "top" | "bottom" =
      step.placement === "top" ? "top" : "bottom";

    // Auto-flip si no hay espacio
    if (
      placement === "bottom" &&
      spaceBelow < cardHeight + CARD_GAP + 20
    ) {
      if (spaceAbove > cardHeight + CARD_GAP + 20) {
        placement = "top";
      }
    } else if (
      placement === "top" &&
      spaceAbove < cardHeight + CARD_GAP + 20
    ) {
      if (spaceBelow > cardHeight + CARD_GAP + 20) {
        placement = "bottom";
      }
    }

    const top =
      placement === "bottom"
        ? targetRect.top + targetRect.height + CARD_GAP + SPOTLIGHT_PADDING
        : targetRect.top - cardHeight - CARD_GAP - SPOTLIGHT_PADDING;

    // Asegurar que no se salga por arriba o abajo
    const clampedTop = Math.max(16, Math.min(vh - cardHeight - 16, top));

    setCardTop(clampedTop);
  }, [targetRect, isCentered, step.placement, step.id]);

  // ─────────────────────────────────────────────
  // Bloquear scroll del body
  // ─────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      <>
        {/* Overlay con spotlight o simple */}
        {!isCentered && targetRect ? (
          <motion.div
            key="spotlight-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 300,
              pointerEvents: "auto",
            }}
            onClick={onSkip}
          >
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0 }}
            >
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={targetRect.left - SPOTLIGHT_PADDING}
                    y={targetRect.top - SPOTLIGHT_PADDING}
                    width={targetRect.width + SPOTLIGHT_PADDING * 2}
                    height={targetRect.height + SPOTLIGHT_PADDING * 2}
                    rx={14}
                    ry={14}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(17, 24, 39, 0.7)"
                mask="url(#spotlight-mask)"
              />
            </svg>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: targetRect.top - SPOTLIGHT_PADDING,
                left: targetRect.left - SPOTLIGHT_PADDING,
                width: targetRect.width + SPOTLIGHT_PADDING * 2,
                height: targetRect.height + SPOTLIGHT_PADDING * 2,
                borderRadius: "14px",
                border: "2px solid #FF0000",
                boxShadow:
                  "0 0 0 4px rgba(255, 0, 0, 0.25), 0 8px 24px rgba(255, 0, 0, 0.35)",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="center-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onSkip}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(17, 24, 39, 0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 300,
            }}
          />
        )}

        {/* Card flotante */}
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: isCentered ? "50%" : cardTop ?? "50%",
            transform: isCentered ? "translateY(-50%)" : "none",
            display: "flex",
            justifyContent: "center",
            padding: "0 16px",
            zIndex: 301,
            pointerEvents: "none",
          }}
        >
          <motion.div
            key={`card-${step.id}`}
            ref={cardRef}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{
              opacity: cardReady ? 1 : 0,
              y: cardReady ? 0 : 10,
              scale: cardReady ? 1 : 0.97,
            }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "340px",
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow:
                "0 24px 60px rgba(0, 0, 0, 0.28), 0 6px 16px rgba(0, 0, 0, 0.12)",
              overflow: "hidden",
              boxSizing: "border-box",
              pointerEvents: "auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "1.15rem 1.15rem 0.5rem",
                gap: "0.5rem",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {isFirst && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.65rem",
                      background: "#fff5f5",
                      borderRadius: "999px",
                      fontSize: "0.65rem",
                      color: "#FF0000",
                      fontWeight: 700,
                      marginBottom: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <Sparkles size={11} />
                    Tutorial
                  </div>
                )}

                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#000000",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                  }}
                >
                  {step.title}
                </h3>
              </div>

              {!isFirst && (
                <button
                  onClick={onSkip}
                  aria-label="Saltar tutorial"
                  style={{
                    background: "transparent",
                    border: "none",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(0, 0, 0, 0.4)",
                    borderRadius: "8px",
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Descripción */}
            <div style={{ padding: "0 1.15rem 1rem" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#000000",
                  opacity: 0.7,
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {step.description}
              </p>

              {step.secondaryLink && (
                <Link
                  href={step.secondaryLink.href}
                  onClick={onFinish}
                  style={{
                    display: "inline-block",
                    marginTop: "0.75rem",
                    fontSize: "0.8rem",
                    color: "#FF0000",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {step.secondaryLink.label}
                </Link>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                padding: "0.85rem 1.15rem",
                background: "#f9fafb",
                borderTop: "1px solid #f3f4f6",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#000000",
                  opacity: 0.5,
                  fontWeight: 600,
                  minWidth: "30px",
                }}
              >
                {isFirst ? (
                  <button
                    onClick={onSkip}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#000000",
                      opacity: 0.6,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: "inherit",
                    }}
                  >
                    No gracias
                  </button>
                ) : (
                  step.counter || ""
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                {!isFirst && stepIndex > 1 && (
                  <button
                    onClick={onPrev}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.15rem",
                      padding: "0.5rem 0.7rem",
                      borderRadius: "999px",
                      border: "none",
                      background: "transparent",
                      color: "#000000",
                      opacity: 0.6,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <ChevronLeft size={13} />
                    Atrás
                  </button>
                )}

                <button
                  onClick={isLast ? onFinish : onNext}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "999px",
                    border: "none",
                    background: "#FF0000",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255, 0, 0, 0.35)",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.primaryLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );
                                                }
