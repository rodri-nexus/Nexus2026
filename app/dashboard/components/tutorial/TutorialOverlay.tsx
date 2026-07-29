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

// Padding alrededor del elemento destacado (respiración del spotlight)
const SPOTLIGHT_PADDING = 8;
// Distancia entre el elemento destacado y la card flotante
const CARD_GAP = 16;
// Ancho máximo de la card flotante
const CARD_MAX_WIDTH = 380;
// Margen mínimo desde los bordes de la ventana
const VIEWPORT_MARGIN = 16;

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
  const [cardPosition, setCardPosition] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom" | "center";
  } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardReady, setCardReady] = useState(false);

  const isCentered = step.target === null || step.placement === "center";

  // Buscar y trackear la posición del elemento target
  useLayoutEffect(() => {
    setCardReady(false);

    if (isCentered || !step.target) {
      setTargetRect(null);
      setCardPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        placement: "center",
      });
      // Pequeña pausa para animar la entrada
      requestAnimationFrame(() => setCardReady(true));
      return;
    }

    let retries = 0;
    const MAX_RETRIES = 30; // ~500ms buscando el elemento

    function updateRect() {
      const el = document.querySelector(step.target!) as HTMLElement | null;

      if (!el) {
        if (retries < MAX_RETRIES) {
          retries++;
          requestAnimationFrame(updateRect);
        }
        return;
      }

      // Scroll suave hacia el elemento si está fuera de vista
      const rect = el.getBoundingClientRect();
      const isOutOfView =
        rect.top < 80 || rect.bottom > window.innerHeight - 80;

      if (isOutOfView) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // Esperamos que el scroll termine antes de calcular
        setTimeout(() => {
          const r = el.getBoundingClientRect();
          setTargetRect({
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
          });
          requestAnimationFrame(() => setCardReady(true));
        }, 350);
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

    // Recalcular en resize / scroll
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
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition);
    };
  }, [step.target, isCentered]);

  // Calcular posición de la card flotante en base al target
  useLayoutEffect(() => {
    if (isCentered || !targetRect || !cardRef.current) return;

    const cardHeight = cardRef.current.offsetHeight;
    const cardWidth = Math.min(CARD_MAX_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);

    const spaceAbove = targetRect.top;
    const spaceBelow = window.innerHeight - (targetRect.top + targetRect.height);

    let placement: "top" | "bottom" = step.placement === "top" ? "top" : "bottom";

    // Auto-flip si no hay suficiente espacio
    if (placement === "bottom" && spaceBelow < cardHeight + CARD_GAP + VIEWPORT_MARGIN) {
      if (spaceAbove > cardHeight + CARD_GAP + VIEWPORT_MARGIN) {
        placement = "top";
      }
    } else if (placement === "top" && spaceAbove < cardHeight + CARD_GAP + VIEWPORT_MARGIN) {
      if (spaceBelow > cardHeight + CARD_GAP + VIEWPORT_MARGIN) {
        placement = "bottom";
      }
    }

    const top =
      placement === "bottom"
        ? targetRect.top + targetRect.height + CARD_GAP + SPOTLIGHT_PADDING
        : targetRect.top - cardHeight - CARD_GAP - SPOTLIGHT_PADDING;

    // Centrar horizontalmente respecto al target, pero clamp a viewport
    let left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    left = Math.max(VIEWPORT_MARGIN, left);
    left = Math.min(window.innerWidth - cardWidth - VIEWPORT_MARGIN, left);

    setCardPosition({ top, left, placement });
  }, [targetRect, isCentered, step.placement, step.id]);

  // Bloquear scroll del body mientras el tutorial está activo
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const cardWidth = Math.min(CARD_MAX_WIDTH, typeof window !== "undefined" ? window.innerWidth - VIEWPORT_MARGIN * 2 : CARD_MAX_WIDTH);

  return (
    <AnimatePresence>
      <>
        {/* Overlay oscuro con "recorte" tipo spotlight */}
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
            {/* SVG mask para hacer el "agujero" del spotlight */}
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
                fill="rgba(17, 24, 39, 0.65)"
                mask="url(#spotlight-mask)"
              />
            </svg>

            {/* Borde brillante alrededor del elemento destacado */}
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
                border: "2px solid #6366f1",
                boxShadow:
                  "0 0 0 4px rgba(99, 102, 241, 0.25), 0 8px 24px rgba(99, 102, 241, 0.35)",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        ) : (
          // Overlay simple para modales centrados
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

        {/* Card flotante con el mensaje del paso */}
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
            position: "fixed",
            zIndex: 301,
            width: `${cardWidth}px`,
            maxWidth: "calc(100vw - 32px)",
            background: "#ffffff",
            borderRadius: "18px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.28), 0 6px 16px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
            ...(isCentered
              ? {
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : cardPosition
              ? {
                  top: cardPosition.top,
                  left: cardPosition.left,
                }
              : {
                  // fallback mientras calcula
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: 0,
                }),
          }}
        >
          {/* Header con badge de bienvenida (solo welcome) o botón cerrar */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "1.35rem 1.35rem 0.5rem",
              gap: "0.75rem",
            }}
          >
            <div style={{ flex: 1 }}>
              {isFirst && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.3rem 0.75rem",
                    background:
                      "linear-gradient(135deg, #eef2ff, #ede9fe)",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    color: "#6366f1",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  <Sparkles size={12} />
                  Tutorial
                </div>
              )}

              <h3
                style={{
                  margin: 0,
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
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
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#9ca3af",
                  borderRadius: "8px",
                  transition: "background 0.15s, color 0.15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.color = "#374151";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Descripción */}
          <div style={{ padding: "0 1.35rem 1.25rem" }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#4b5563",
                lineHeight: 1.55,
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
                  marginTop: "0.85rem",
                  fontSize: "0.85rem",
                  color: "#6366f1",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {step.secondaryLink.label}
              </Link>
            )}
          </div>

          {/* Footer: contador + botones */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              padding: "1rem 1.35rem",
              background: "#f9fafb",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            {/* Izquierda: contador o "No gracias" */}
            <div
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                fontWeight: 600,
                minWidth: "40px",
              }}
            >
              {isFirst ? (
                <button
                  onClick={onSkip}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#6b7280",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#6b7280";
                  }}
                >
                  No gracias
                </button>
              ) : (
                step.counter || ""
              )}
            </div>

            {/* Derecha: Atrás + Siguiente/Finalizar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {!isFirst && stepIndex > 1 && (
                <button
                  onClick={onPrev}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    padding: "0.55rem 0.85rem",
                    borderRadius: "999px",
                    border: "none",
                    background: "transparent",
                    color: "#6b7280",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6b7280";
                  }}
                >
                  <ChevronLeft size={14} />
                  Atrás
                </button>
              )}

              <button
                onClick={isLast ? onFinish : onNext}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#ffffff",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(99, 102, 241, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(99, 102, 241, 0.35)";
                }}
              >
                {step.primaryLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
