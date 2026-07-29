"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ChatBubble() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  // Mostrar tooltip después de 5 segundos
  useEffect(() => {
    if (tooltipDismissed) return;

    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [tooltipDismissed]);

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  // Mensaje predefinido para WhatsApp
  const whatsappMessage = encodeURIComponent(
    "¡Hola Nevux! Quería consultar sobre la app 😊"
  );
  const whatsappUrl = `https://wa.me/5493434163999?text=${whatsappMessage}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.75rem",
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "white",
              padding: "0.85rem 1rem",
              borderRadius: "16px",
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f3f4f6",
              maxWidth: "260px",
              position: "relative",
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleDismissTooltip}
              aria-label="Cerrar mensaje"
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#111827",
                color: "white",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                padding: 0,
              }}
            >
              <X size={12} strokeWidth={3} />
            </button>

            {/* Contenido */}
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                }}
              >
                N
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "0.15rem",
                  }}
                >
                  Equipo Nevux
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#4b5563",
                    lineHeight: 1.4,
                  }}
                >
                  ¿Necesitás ayuda? Escribinos por WhatsApp 💬
                </div>
              </div>
            </div>

            {/* Flecha apuntando al botón */}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                right: "24px",
                width: "12px",
                height: "12px",
                background: "white",
                transform: "rotate(45deg)",
                borderRight: "1px solid #f3f4f6",
                borderBottom: "1px solid #f3f4f6",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        style={{
          position: "relative",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 10px 25px rgba(34, 197, 94, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)",
          textDecoration: "none",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* Aureola pulsante */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1.6],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "#22c55e",
            zIndex: -1,
          }}
        />

        {/* Ícono de WhatsApp SVG */}
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Notificación numérica */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "#ef4444",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 800,
            border: "2px solid white",
            boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
          }}
        >
          1
        </div>
      </a>
    </div>
  );
        }
