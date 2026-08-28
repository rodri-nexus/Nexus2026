"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ThumbsUp, ThumbsDown, Loader2, Sparkles } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

interface FeedbackClientProps {
  email: string;
}

export default function FeedbackClient({ email }: FeedbackClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"yes" | "no" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = useCallback(async (liked: boolean) => {
    if (loading) return;

    setError(null);
    setLoading(liked ? "yes" : "no");

    try {
      const res = await fetch("/api/plan/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar respuesta");
      }

      if (liked) {
        router.push("/plan/expirado");
      } else {
        router.push("/plan/opinion");
      }
    } catch (err: unknown) {
      console.error("Error enviando feedback:", err);
      const errMsg = err instanceof Error ? err.message : "Ocurrió un error. Intentá de nuevo.";
      setError(errMsg);
      setLoading(null);
    }
  }, [loading, router]);

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
      {/* Círculos decorativos de fondo en verde esmeralda sutil */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
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
          textAlign: "center",
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

        {/* ÍCONO CORAZÓN CENTRADO EN VERDE ESMERALDA */}
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
              stiffness: 150,
              delay: 0.1,
            }}
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.35)",
            }}
          >
            <Heart size={46} color="white" fill="white" strokeWidth={0} />
          </motion.div>
        </div>

        {/* BADGE DIAS PRUEBA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.95rem",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "999px",
            fontSize: "0.8rem",
            color: "#059669",
            fontWeight: 700,
            marginBottom: "1.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.1)",
          }}
        >
          <Sparkles size={12} color="#10B981" />
          Usaste Nevux por 7 días
        </motion.div>

        {/* TÍTULOS */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: 800,
            color: "#000000",
            margin: "0 0 1rem 0",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Se terminaron tus 7 días de prueba 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
            color: "#000000",
            opacity: 0.7,
            margin: "0 0 2.5rem 0",
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          ¿Te gustó{" "}
          <strong style={{ color: "#10B981", opacity: 1 }}>Nevux</strong> hasta
          ahora?
        </motion.p>

        {/* OPCIONES / BOTONES RESPUESTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            width: "100%",
            maxWidth: "520px",
            margin: "0 auto",
          }}
        >
          <motion.button
            type="button"
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={() => handleAnswer(true)}
            disabled={loading !== null}
            style={{
              padding: "1.5rem 1.25rem",
              background: "#10B981",
              color: "white",
              border: "none",
              borderRadius: "18px",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
              opacity: loading === "no" ? 0.5 : 1,
            }}
          >
            {loading === "yes" ? (
              <Loader2 size={32} className="animate-spin" />
            ) : (
              <ThumbsUp size={32} strokeWidth={2.5} />
            )}
            <div>
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                ¡Sí, me encantó!
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.9,
                  marginTop: "0.15rem",
                  fontWeight: 500,
                }}
              >
                Quiero seguir usando Nevux
              </div>
            </div>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={() => handleAnswer(false)}
            disabled={loading !== null}
            style={{
              padding: "1.5rem 1.25rem",
              background: "white",
              color: "#000000",
              border: "2px solid #e5e7eb",
              borderRadius: "18px",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
              opacity: loading === "yes" ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = "#10B981";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = "#e5e7eb";
              }
            }}
          >
            {loading === "no" ? (
              <Loader2 size={32} className="animate-spin" />
            ) : (
              <ThumbsDown size={32} strokeWidth={2.5} />
            )}
            <div>
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                No mucho
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.6,
                  marginTop: "0.15rem",
                  fontWeight: 500,
                }}
              >
                Contanos qué podemos mejorar
              </div>
            </div>
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1rem",
              background: "#fef2f2",
              color: "#dc2626",
              borderRadius: "10px",
              fontSize: "0.85rem",
              border: "1px solid #fecaca",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "left",
              wordBreak: "break-word",
            }}
          >
            {error}
          </motion.div>
        )}

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
          }}
        >
          Conectado como {email}
        </motion.p>
      </div>
    </div>
  );
                        }
