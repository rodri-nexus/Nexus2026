"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Store } from "lucide-react";

interface CrearWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProducto: () => void;
  onSelectTodos: () => void;
}

export default function CrearWidgetModal({
  isOpen,
  onClose,
  onSelectProducto,
  onSelectTodos,
}: CrearWidgetModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 101,
              padding: "1rem",
              boxSizing: "border-box",
            }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "480px",
                background: "#ffffff",
                borderRadius: "18px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                padding: "1.5rem",
                boxSizing: "border-box",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#000000",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Crear nuevo widget
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    background: "transparent",
                    border: "none",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "10px",
                    color: "#000000",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ecfdf5";
                    e.currentTarget.style.color = "#10B981";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#000000";
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <p
                style={{
                  margin: "0 0 1.25rem 0",
                  fontSize: "0.95rem",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                ¿Qué tipo de widget querés crear?
              </p>

              {/* Opciones */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Opción A: Producto específico */}
                <button
                  onClick={onSelectProducto}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10B981";
                    e.currentTarget.style.background = "#ecfdf5";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(16, 185, 129, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Package size={22} color="#10B981" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#000000",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Widget para un producto específico
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#000000",
                        opacity: 0.6,
                        lineHeight: 1.4,
                      }}
                    >
                      Asociá widgets a un producto en particular
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.4 }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Opción B: Todos los productos */}
                <button
                  onClick={onSelectTodos}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10B981";
                    e.currentTarget.style.background = "#ecfdf5";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(16, 185, 129, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "#000000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Store size={22} color="#ffffff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#000000",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Widget para todos los productos
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#000000",
                        opacity: 0.6,
                        lineHeight: 1.4,
                      }}
                    >
                      Asociá widgets a todos los productos y en el inicio de la tienda
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.4 }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
            }
