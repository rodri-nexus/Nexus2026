"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function RecuperarPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Ingresá tu email");
      return;
    }

    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setLoading(false);

    if (resetError) {
      setError(
        "No pudimos enviar el email. Verificá que sea correcto e intentá de nuevo."
      );
      return;
    }

    setSent(true);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "#f9fafb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "white",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          boxShadow:
            "0 20px 60px rgba(16, 185, 129, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Back link */}
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.85rem",
            color: "#000000",
            opacity: 0.6,
            textDecoration: "none",
            marginBottom: "1.25rem",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={15} />
          Volver al login
        </Link>

        {/* Logo/Título */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <NevuxLogo size="large" />
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              margin: "0 0 0.5rem 0",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.02em",
            }}
          >
            Recuperar contraseña
          </h1>
          <p
            style={{
              color: "#000000",
              opacity: 0.6,
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {sent
              ? "Revisá tu bandeja de entrada"
              : "Te enviaremos un link para crear una nueva contraseña"}
          </p>
        </motion.div>

        {/* Estado: email enviado */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                padding: "1.5rem",
                background: "#ecfdf5",
                border: "1.5px solid #a7f3d0",
                borderRadius: "14px",
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  boxShadow: "0 6px 18px rgba(16, 185, 129, 0.25)",
                }}
              >
                <CheckCircle2 size={28} color="#ffffff" strokeWidth={2.5} />
              </div>
              <h2
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#065f46",
                }}
              >
                ¡Email enviado!
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.88rem",
                  color: "#065f46",
                  opacity: 0.9,
                  lineHeight: 1.5,
                }}
              >
                Enviamos un link a{" "}
                <strong style={{ opacity: 1 }}>{email}</strong>. Abrí el email y
                seguí las instrucciones para crear una nueva contraseña.
              </p>
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.82rem",
                color: "#000000",
                opacity: 0.6,
                marginBottom: "1.25rem",
                lineHeight: 1.5,
              }}
            >
              ¿No recibiste el email? Revisá la carpeta de spam o{" "}
              <button
                onClick={() => setSent(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#10B981",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.82rem",
                  padding: 0,
                }}
              >
                probá otro email
              </button>
              .
            </p>

            <Link
              href="/login"
              style={{
                display: "block",
                textAlign: "center",
                width: "100%",
                padding: "0.9rem",
                background: "#000000",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                boxSizing: "border-box",
                transition: "background 0.2s",
              }}
            >
              Volver al login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "1.25rem" }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#000000",
                  marginBottom: "0.5rem",
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "0.9rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(0, 0, 0, 0.4)",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.75rem",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    color: "#000000",
                    background: "#FFFFFF",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </motion.div>

            {/* Error */}
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
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Botón submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: "100%",
                padding: "0.95rem",
                background: loading ? "rgba(16, 185, 129, 0.5)" : "#10B981",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enviando email...
                </>
              ) : (
                "Enviar link de recuperación"
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
  }
