"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ShieldAlert, Trash2, Loader2 } from "lucide-react";

interface EliminarWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  widgetName: string;
  scopeLabel: string;
  isDeleting?: boolean;
}

export default function EliminarWidgetModal({
  isOpen,
  onClose,
  onConfirm,
  widgetName,
  scopeLabel,
  isDeleting = false,
}: EliminarWidgetModalProps) {
  const [confirmText, setConfirmText] = useState("");

  // Resetear el input cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isDeleting, onClose]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const isConfirmValid = confirmText.trim() === "ELIMINAR";
  const canDelete = isConfirmValid && !isDeleting;

  const handleConfirm = async () => {
    if (!canDelete) return;
    await onConfirm();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1000,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="eliminar-widget-title"
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              maxWidth: "480px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.25rem 1.4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dc2626",
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={20} strokeWidth={2.25} />
                </div>
                <h2
                  id="eliminar-widget-title"
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#dc2626",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Eliminar widget
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                aria-label="Cerrar"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "6px",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  color: "#000000",
                  opacity: isDeleting ? 0.3 : 0.6,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) e.currentTarget.style.background = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "1.4rem" }}>
              {/* Alerta */}
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  padding: "1rem 1.1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <ShieldAlert
                  size={20}
                  color="#dc2626"
                  strokeWidth={2}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <div
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.55,
                    color: "#7f1d1d",
                  }}
                >
                  <strong style={{ fontWeight: 700 }}>
                    Esta acción no tiene vuelta atrás.
                  </strong>{" "}
                  El widget será eliminado permanentemente y no podrá
                  recuperarse.
                </div>
              </div>

              {/* Datos del widget */}
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #f3f4f6",
                  borderRadius: "12px",
                  padding: "1rem 1.1rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#000000",
                      opacity: 0.6,
                      minWidth: "70px",
                      flexShrink: 0,
                    }}
                  >
                    Widget
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "#000000",
                      fontWeight: 700,
                      flex: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {widgetName}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#000000",
                      opacity: 0.6,
                      minWidth: "70px",
                      flexShrink: 0,
                    }}
                  >
                    Alcance
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#000000",
                      opacity: 0.85,
                      fontWeight: 500,
                      flex: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {scopeLabel}
                  </div>
                </div>
              </div>

              {/* Confirmación por texto */}
              <div style={{ marginBottom: "1.4rem" }}>
                <label
                  htmlFor="confirm-eliminar-input"
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#000000",
                    marginBottom: "0.6rem",
                    lineHeight: 1.5,
                  }}
                >
                  Para confirmar, escribí la palabra{" "}
                  <strong style={{ color: "#dc2626", fontWeight: 700 }}>
                    ELIMINAR
                  </strong>{" "}
                  en el campo de abajo:
                </label>
                <input
                  id="confirm-eliminar-input"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Escribí ELIMINAR"
                  disabled={isDeleting}
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.9rem",
                    borderRadius: "10px",
                    border: `1.5px solid ${
                      isConfirmValid ? "#dc2626" : "#e5e7eb"
                    }`,
                    background: "#ffffff",
                    fontSize: "0.95rem",
                    color: "#000000",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => {
                    if (!isConfirmValid) {
                      e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.4)";
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = isConfirmValid
                      ? "#dc2626"
                      : "#e5e7eb";
                  }}
                />
              </div>

              {/* Botones */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  style={{
                    padding: "0.7rem 1.4rem",
                    borderRadius: "999px",
                    border: "1px solid #e5e7eb",
                    background: "#f9fafb",
                    color: "#000000",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: isDeleting ? 0.6 : 1,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting)
                      e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canDelete}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.7rem 1.4rem",
                    borderRadius: "999px",
                    border: "none",
                    background: canDelete ? "#dc2626" : "#fca5a5",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: canDelete ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    boxShadow: canDelete
                      ? "0 4px 12px rgba(220, 38, 38, 0.3)"
                      : "none",
                    transition: "background 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (canDelete) e.currentTarget.style.background = "#b91c1c";
                  }}
                  onMouseLeave={(e) => {
                    if (canDelete) e.currentTarget.style.background = "#dc2626";
                  }}
                >
                  {isDeleting ? (
                    <>
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Eliminar widget
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Animación del spinner */}
          <style jsx global>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
      }
