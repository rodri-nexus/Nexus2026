"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  // Validaciones
  const passwordChecks = {
    length: password.length >= 8,
    match: password === confirmPassword && password.length > 0,
  };

  // Verificar que el link sea válido
  // Supabase crea automáticamente una sesión temporal cuando el
  // usuario llega desde el email de reset
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionReady(true);
      } else {
        // Puede tardar un instante en establecerse
        setTimeout(async () => {
          const { data: retry } = await supabase.auth.getSession();
          if (retry.session) {
            setSessionReady(true);
          } else {
            setInvalidLink(true);
          }
        }, 800);
      }
    }
    checkSession();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordChecks.length) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!passwordChecks.match) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(
        "No pudimos actualizar tu contraseña. El link puede haber expirado."
      );
      return;
    }

    setSuccess(true);

    // Cerrar sesión temporal y redirigir a login después de 2.5s
    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    }, 2500);
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
            "0 20px 60px rgba(255, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Estado: Link inválido */}
        {invalidLink && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <AlertCircle size={30} color="#dc2626" />
            </div>
            <h1
              style={{
                margin: "0 0 0.6rem",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#000000",
              }}
            >
              Link inválido o expirado
            </h1>
            <p
              style={{
                margin: "0 0 1.5rem",
                fontSize: "0.9rem",
                color: "#000000",
                opacity: 0.6,
                lineHeight: 1.55,
              }}
            >
              El link de recuperación ya no es válido. Podés solicitar uno nuevo
              desde la página de recuperación.
            </p>
            <Link
              href="/recuperar"
              style={{
                display: "inline-block",
                padding: "0.85rem 1.75rem",
                background: "#FF0000",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(255, 0, 0, 0.35)",
              }}
            >
              Solicitar nuevo link
            </Link>
          </motion.div>
        )}

        {/* Estado: Éxito */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                boxShadow: "0 8px 24px rgba(5, 150, 105, 0.4)",
              }}
            >
              <CheckCircle2 size={32} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h1
              style={{
                margin: "0 0 0.6rem",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#065f46",
              }}
            >
              ¡Contraseña actualizada!
            </h1>
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.9rem",
                color: "#000000",
                opacity: 0.65,
                lineHeight: 1.55,
              }}
            >
              Ya podés iniciar sesión con tu nueva contraseña.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.82rem",
                color: "#000000",
                opacity: 0.45,
                fontStyle: "italic",
              }}
            >
              Redirigiendo al login...
            </p>
          </motion.div>
        )}

        {/* Estado: Cargando verificación de link */}
        {!sessionReady && !invalidLink && !success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "2rem 0",
            }}
          >
            <Loader2
              size={32}
              color="#FF0000"
              className="animate-spin"
              style={{ marginBottom: "1rem" }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#000000",
                opacity: 0.6,
              }}
            >
              Verificando link...
            </p>
          </motion.div>
        )}

        {/* Estado: Formulario listo */}
        {sessionReady && !success && !invalidLink && (
          <>
            {/* Título */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: "center", marginBottom: "2rem" }}
            >
              <h1
                style={{
                  fontSize: "1.75rem",
                  margin: "0 0 0.5rem 0",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                Nueva contraseña
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
                Elegí una contraseña segura para tu cuenta
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              {/* Contraseña */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: "1rem" }}
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
                  Nueva contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
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
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.75rem",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF0000")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </motion.div>

              {/* Confirmar Contraseña */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
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
                  Confirmar contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
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
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repetí tu contraseña"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.75rem",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF0000")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </motion.div>

              {/* Checks de contraseña */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{
                    marginBottom: "1.25rem",
                    padding: "0.75rem 1rem",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.35rem",
                      color: passwordChecks.length
                        ? "#10b981"
                        : "rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {passwordChecks.length ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    <span>Al menos 8 caracteres</span>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: passwordChecks.match ? "#10b981" : "#ef4444",
                      }}
                    >
                      {passwordChecks.match ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span>Las contraseñas coinciden</span>
                    </div>
                  )}
                </motion.div>
              )}

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
                  background: loading ? "rgba(255, 0, 0, 0.4)" : "#FF0000",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 14px rgba(255, 0, 0, 0.3)",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Guardar nueva contraseña"
                )}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
    }
