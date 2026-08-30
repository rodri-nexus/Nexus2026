"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

interface OpinionClientProps {
  email: string;
}

const REASON_TAGS = [
  { id: "precio", emoji: "💸", label: "Precio muy caro" },
  { id: "faltan_widgets", emoji: "🧩", label: "Faltan widgets que necesito" },
  { id: "complicado", emoji: "🤔", label: "Es complicado de usar" },
  { id: "lento", emoji: "🐢", label: "Es lento" },
  { id: "no_entendi", emoji: "❓", label: "No entendí para qué sirve" },
  { id: "otro", emoji: "✏️", label: "Otro motivo" },
];

export default function OpinionClient({ email }: OpinionClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  }, []);

  const handleSubmit = async () => {
    if (loading || sent) return;

    if (selectedTags.length === 0 && comment.trim().length === 0) {
      setError(
        "Contanos qué podemos mejorar (seleccioná alguna opción o escribí un mensaje)"
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/plan/opinion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: selectedTags,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Error al enviar el feedback");
      }

      setSent(true);
    } catch (err: unknown) {
      console.error("Error enviando opinión:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Ocurrió un error. Intentá de nuevo.";
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        background: "linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Círculos decorativos de fondo */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "620px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
      >
        {/* LOGO NEVUX CENTRADO */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "2rem",
            width: "100%",
          }}
        >
          <NevuxLogo size="medium" />
        </motion.div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* ÍCONO MENSAJE CENTRADO */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "1.75rem",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 150,
                  }}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "#000000",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <MessageCircle size={44} color="white" strokeWidth={2} />
                </motion.div>
              </div>

              {/* TÍTULO */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: "clamp(1.65rem, 5vw, 2.35rem)",
                  fontWeight: 800,
                  color: "#000000",
                  margin: "0 0 0.75rem 0",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  textAlign: "center",
                }}
              >
                ¿Qué podríamos mejorar?
              </motion.h1>

              {/* SUBTÍTULO */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                  color: "#000000",
                  opacity: 0.6,
                  margin: "0 0 2rem 0",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                Tu opinión nos ayuda a hacer{" "}
                <strong style={{ color: "#000000", opacity: 1 }}>Nevux</strong>{" "}
                cada día mejor
              </motion.p>

              {/* CHIPS DE RAZONES */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.6rem",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  width: "100%",
                }}
              >
                {REASON_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <motion.button
                      key={tag.id}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.65rem 1rem",
                        background: isSelected ? "#10B981" : "white",
                        color: isSelected ? "white" : "#000000",
                        border: isSelected
                          ? "2px solid #10B981"
                          : "2px solid #e5e7eb",
                        borderRadius: "999px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s ease",
                        boxShadow: isSelected
                          ? "0 4px 12px rgba(16, 185, 129, 0.25)"
                          : "0 1px 3px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <span style={{ fontSize: "1rem" }}>{tag.emoji}</span>
                      {tag.label}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* TEXTAREA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ marginBottom: "1.25rem", width: "100%" }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#000000",
                    marginBottom: "0.5rem",
                    textAlign: "left",
                  }}
                >
                  Contanos con más detalle{" "}
                  <span
                    style={{
                      color: "#000000",
                      opacity: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    (opcional)
                  </span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribinos qué te gustaría que agreguemos, qué te costó configurar o qué no te convenció..."
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "0.95rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "14px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    resize: "vertical",
                    minHeight: "120px",
                    boxSizing: "border-box",
                    background: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </motion.div>

              {/* ERROR */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "#fef2f2",
                    color: "#dc2626",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                    border: "1px solid #fecaca",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* BOTÓN ENVIAR */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ textAlign: "center", width: "100%" }}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem 2.5rem",
                    background: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "999px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                    fontFamily: "inherit",
                    minWidth: "220px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = "#059669";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.background = "#10B981";
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar feedback
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            // ─── PANTALLA DE AGRADECIMIENTO ───
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                textAlign: "center",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "1.75rem",
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    stiffness: 200,
                  }}
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    background: "#10B981",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 40px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  <CheckCircle2 size={54} color="white" strokeWidth={2.5} />
                </motion.div>
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.65rem, 5vw, 2.35rem)",
                  fontWeight: 800,
                  color: "#000000",
                  margin: "0 0 1rem 0",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                ¡Gracias por tu opinión! 💚
              </h1>

              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.1rem)",
                  color: "#000000",
                  opacity: 0.7,
                  margin: "0 auto 2.5rem auto",
                  lineHeight: 1.6,
                  maxWidth: "480px",
                }}
              >
                La tuvimos en cuenta y vamos a trabajar para mejorar. Igual, si
                cambiaste de idea, podés seguir usando Nevux 👇
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Link
                  href="/plan/expirado"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.95rem 1.75rem",
                    background: "#10B981",
                    color: "white",
                    borderRadius: "999px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#059669")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#10B981")
                  }
                >
                  Ver el plan
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="https://wa.me/5493434163999"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.95rem 1.75rem",
                    background: "white",
                    color: "#000000",
                    borderRadius: "999px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "2px solid #e5e7eb",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10B981";
                    e.currentTarget.style.color = "#059669";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.color = "#000000";
                  }}
                >
                  Hablar por WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMAIL LOGUEADO ABAJO */}
        {!sent && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              marginTop: "2.5rem",
              fontSize: "0.8rem",
              color: "#000000",
              opacity: 0.4,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Conectado como {email}
          </motion.p>
        )}
      </div>
    </div>
  );
         }
