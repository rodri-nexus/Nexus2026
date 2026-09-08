"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

/* ═══════════════════════════════════════════
   HELPERS & CONSTANTES (Regla #9)
   ═══════════════════════════════════════════ */
const COOLDOWN_KEY = "nevux_recovery_cooldown_expiry";
const COOLDOWN_SECONDS = 60;

function getRemainingCooldown(): number {
  if (typeof window === "undefined") return 0;
  const expiry = localStorage.getItem(COOLDOWN_KEY);
  if (!expiry) return 0;
  const remaining = Math.ceil((parseInt(expiry, 10) - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

function setCooldown(seconds: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COOLDOWN_KEY, String(Date.now() + seconds * 1000));
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════ */
export default function RecuperarPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldownState] = useState<number>(0);

  // Honeypot para evitar spam bots masivos
  const [botField, setBotField] = useState("");

  // Control de la cuenta regresiva del Cooldown
  useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldownState(remaining);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldownState((prev) => {
        const nextValue = prev - 1;
        if (nextValue <= 0) {
          clearInterval(interval);
          return 0;
        }
        return nextValue;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // 1. Validaciones básicas de interfaz
    if (!email) {
      setError("Ingresá tu email");
      return;
    }

    if (cooldown > 0) {
      setError(`Por favor, esperá ${cooldown} segundos antes de solicitar otro email.`);
      return;
    }

    // 2. Filtro Honeypot Antirrobos
    if (botField !== "") {
      // Simula éxito al bot para que deje de atacar, sin consumir Supabase
      setSent(true);
      return;
    }

    setLoading(true);

    try {
      // 3. Ejecución contra Supabase Auth
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      setLoading(false);

      if (resetError) {
        // Traducimos errores de Rate Limit o SMTP
        const errMessage = resetError.message.toLowerCase();
        if (errMessage.includes("rate limit") || errMessage.includes("too many") || resetError.status === 429) {
          setError(
            "Recibimos demasiadas solicitudes de recuperación. Tu cuenta está protegida. Por favor, esperá unos minutos antes de intentar nuevamente o revisá si ya te llegó el email."
          );
        } else {
          setError(
            "No pudimos procesar la solicitud. Verificá que el email sea correcto o contactate con soporte si el problema persiste."
          );
        }
        return;
      }

      // 4. Éxito: Activamos el Cooldown anti-spam local
      setCooldown(COOLDOWN_SECONDS);
      setCooldownState(COOLDOWN_SECONDS);
      setSent(true);

    } catch (err) {
      setLoading(false);
      setError("Ocurrió un error inesperado de red. Intentá de nuevo en unos momentos.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "#0b0f19", // Oscuro elegante a juego con Nevux Dashboard
        backgroundImage: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 40%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#111827", // Tarjeta oscura premium
          borderRadius: "24px",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.05)",
          border: "1px solid #1f2937",
          boxSizing: "border-box",
        }}
      >
        {/* Enlace volver */}
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
            color: "#9ca3af",
            textDecoration: "none",
            marginBottom: "1.5rem",
            fontWeight: 600,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#10B981")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <ArrowLeft size={16} />
          Volver al login
        </Link>

        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <NevuxLogo size="large" />
          </div>
          <h1
            style={{
              fontSize: "1.65rem",
              margin: "0 0 0.5rem 0",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Recuperar contraseña
          </h1>
          <p
            style={{
              color: "#9ca3af",
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {sent
              ? "Revisá tu bandeja de entrada"
              : "Te enviaremos un link para crear una nueva contraseña de forma segura"}
          </p>
        </div>

        {/* ESTADO: EMAIL ENVIADO */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                padding: "1.5rem",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1.5px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "16px",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                }}
              >
                <CheckCircle2 size={26} color="#000000" strokeWidth={2.5} />
              </div>
              <h2
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#10B981",
                }}
              >
                ¡Email enviado!
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#d1d5db",
                  lineHeight: 1.5,
                }}
              >
                Enviamos un link de recuperación a <strong style={{ color: "#ffffff" }}>{email}</strong>. El link expirará pronto por seguridad.
              </p>
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.82rem",
                color: "#9ca3af",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              ¿No recibiste el email? Revisá spam o{" "}
              <button
                onClick={() => setSent(false)}
                disabled={cooldown > 0}
                style={{
                  background: "transparent",
                  border: "none",
                  color: cooldown > 0 ? "#4b5563" : "#10B981",
                  fontWeight: 700,
                  cursor: cooldown > 0 ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.82rem",
                  padding: 0,
                }}
              >
                {cooldown > 0 ? `reintentá en ${cooldown}s` : "probá de nuevo"}
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
                background: "#ffffff",
                color: "#000000",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                boxSizing: "border-box",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              Ir a Iniciar Sesión
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ boxSizing: "border-box" }}>
            
            {/* Campo Invisible (Honeypot Antispam) */}
            <input
              type="text"
              name="fullname_verification_secure"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Input Email */}
            <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#9ca3af",
                  marginBottom: "0.5rem",
                }}
              >
                Email de tu cuenta
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280",
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
                    border: "1.5px solid #374151",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s, background-color 0.2s",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    color: "#ffffff",
                    background: "#1f2937",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#10B981";
                    e.target.style.backgroundColor = "#111827";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#374151";
                    e.target.style.backgroundColor = "#1f2937";
                  }}
                />
              </div>
            </div>

            {/* Caja de Errores Protegida */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "0.85rem 1rem",
                  background: "rgba(220, 38, 38, 0.08)",
                  color: "#f87171",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  marginBottom: "1.5rem",
                  border: "1px solid rgba(220, 38, 38, 0.25)",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  lineHeight: 1.4,
                }}
              >
                <ShieldAlert size={18} style={{ shrink: 0, marginTop: "1px" }} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Botón de Enviar (Con Cooldown Visual) */}
            <motion.button
              type="submit"
              disabled={loading || cooldown > 0}
              whileHover={{ scale: loading || cooldown > 0 ? 1 : 1.01 }}
              whileTap={{ scale: loading || cooldown > 0 ? 1 : 0.99 }}
              style={{
                width: "100%",
                padding: "0.95rem",
                background: loading || cooldown > 0 ? "rgba(16, 185, 129, 0.15)" : "#10B981",
                color: loading || cooldown > 0 ? "#6b7280" : "#000000",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 800,
                cursor: loading || cooldown > 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: loading || cooldown > 0 ? "none" : "0 4px 14px rgba(16, 185, 129, 0.25)",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verificando credenciales...
                </>
              ) : cooldown > 0 ? (
                `Esperá ${cooldown}s para reintentar`
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
