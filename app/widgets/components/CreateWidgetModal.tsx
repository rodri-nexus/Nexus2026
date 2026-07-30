"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import WidgetTypeSelector, { WidgetType } from "./WidgetTypeSelector";

interface CreateWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWidgetModal({
  isOpen,
  onClose,
}: CreateWidgetModalProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(type: WidgetType) {
    if (creating) return;
    setError(null);
    setCreating(true);

    try {
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type.id,
          name: type.name,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear el widget");
      }

      const data = await res.json();
      const widgetId = data.widget?.id;

      if (!widgetId) {
        throw new Error("No se recibió el ID del widget");
      }

      // Redirigimos al editor del widget recién creado
      router.push(`/widgets/${widgetId}/editar`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      setCreating(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <WidgetTypeSelector
            onSelect={handleSelect}
            onClose={creating ? () => {} : onClose}
          />

          {/* Overlay de "creando..." */}
          {creating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(17, 24, 39, 0.7)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "2rem 2.5rem",
                  background: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                }}
              >
                <Loader2
                  size={32}
                  color="#6366f1"
                  style={{
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Creando widget...
                </span>
              </div>

              <style jsx>{`
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

          {/* Error toast */}
          {error && !creating && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              style={{
                position: "fixed",
                bottom: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1200,
                padding: "0.9rem 1.4rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                color: "#991b1b",
                fontSize: "0.9rem",
                fontWeight: 600,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
              }}
            >
              {error}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
        }
