"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Store, X, ChevronRight } from "lucide-react";

interface CreateWidgetModalFakeProps {
  isOpen: boolean;
  // No permitimos cerrar el modal manualmente durante el tutorial.
  // Solo se cierra cuando el tutorial pasa al paso "listo" o se salta.
  onClose?: () => void;
  // Callback cuando se toca "Crear mi primer widget" en el paso 8
  onCreatePrimary?: () => void;
  // Mostrar el CTA "Crear mi primer widget" (paso 8)
  showCTA?: boolean;
}

export default function CreateWidgetModalFake({
  isOpen,
  onClose,
  onCreatePrimary,
  showCTA = false,
}: CreateWidgetModalFakeProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay: NO cierra el modal al clickear (durante tutorial) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(17, 24, 39, 0.55)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 200,
            }}
          />

          {/* Modal centrado */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: 201,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                width: "100%",
                maxWidth: "480px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: "18px",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1)",
                pointerEvents: "auto",
              }}
            >
              {/* Header del modal */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.35rem 1.5rem 1rem",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Crear nuevo widget
                </h2>

                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  disabled={!onClose}
                  style={{
                    background: "transparent",
                    border: "none",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: onClose ? "pointer" : "default",
                    color: "#6b7280",
                    borderRadius: "10px",
                    transition: "background 0.15s",
                    opacity: onClose ? 1 : 0.4,
                  }}
                  onMouseEnter={(e) => {
                    if (onClose) {
                      e.currentTarget.style.background = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido */}
              <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                <p
                  style={{
                    margin: "0 0 1.25rem",
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  ¿Qué tipo de widget querés crear?
                </p>

                {/* Opción 1: Widget para un producto específico */}
                <div
                  data-tutorial="widget-producto-especifico"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.15rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    marginBottom: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10b981";
                    e.currentTarget.style.background = "#f0fdf4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.12))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Package size={26} color="#10b981" strokeWidth={1.75} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "0.25rem",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      Widget para un producto específico
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#6b7280",
                        lineHeight: 1.45,
                      }}
                    >
                      Asocia widgets a un producto en particular
                    </div>
                  </div>

                  <ChevronRight
                    size={20}
                    color="#9ca3af"
                    style={{ flexShrink: 0 }}
                  />
                </div>

                {/* Opción 2: Widget para todos los productos */}
                <div
                  data-tutorial="widget-toda-tienda"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.15rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.background = "#eef2ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Store size={26} color="#6366f1" strokeWidth={1.75} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "0.25rem",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      Widget para todos los productos
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#6b7280",
                        lineHeight: 1.45,
                      }}
                    >
                      Asocia widgets a todos los productos y en el inicio de la
                      tienda
                    </div>
                  </div>

                  <ChevronRight
                    size={20}
                    color="#9ca3af"
                    style={{ flexShrink: 0 }}
                  />
                </div>

                {/* CTA final (solo en paso 8) */}
                {showCTA && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginTop: "1.5rem",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={onCreatePrimary}
                      style={{
                        padding: "0.85rem 2rem",
                        borderRadius: "999px",
                        border: "none",
                        background:
                          "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 6px 16px rgba(99, 102, 241, 0.35)",
                        transition: "transform 0.15s, box-shadow 0.15s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(99, 102, 241, 0.45)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(99, 102, 241, 0.35)";
                      }}
                    >
                      Crear mi primer widget
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
              }
