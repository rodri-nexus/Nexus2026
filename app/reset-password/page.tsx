// app/reset-password/page.tsx
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
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface PasswordChecks {
  length: boolean;
  match: boolean;
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
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

  // Validaciones en tiempo real
  const passwordChecks: PasswordChecks = {
    length: password.length >= 8,
    match: password === confirmPassword && password.length > 0,
  };

  // Verificar que el link sea válido y establecer la sesión de recuperación
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          if (isMounted) setSessionReady(true);
          return;
        }

        // Suscripción a eventos de autenticación (evento PASSWORD_RECOVERY)
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "PASSWORD_RECOVERY" || session) {
              if (isMounted) {
                setSessionReady(true);
                setInvalidLink(false);
              }
            }
          }
        );

        // Fallback de reintento tras 1.2 segundos si no hubo evento directo
        setTimeout(async () => {
          if (!isMounted) return;
          const { data: retry } = await supabase.auth.getSession();
          if (retry.session) {
            setSessionReady(true);
          } else if (!sessionReady) {
            setInvalidLink(true);
          }
        }, 1200);

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error("[Session Check Error]:", err);
        if (isMounted) setInvalidLink(true);
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase, sessionReady]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordChecks.length) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!passwordChecks.match) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      setLoading(false);

      if (updateError) {
        setError(
          updateError.message ||
            "No pudimos actualizar tu contraseña. El link puede haber expirado."
        );
        return;
      }

      setSuccess(true);

      // Cerrar la sesión temporal y redirigir limpiamente al login tras 2.5s
      setTimeout(async () => {
        try {
          await supabase.auth.signOut();
        } catch {
          // Ignorar error menor de signOut
        }
        router.push("/login");
        router.refresh();
      }, 2500);
    } catch (err) {
      setLoading(false);
      console.error("[Update Password Exception]:", err);
      setError("Ocurrió un error inesperado al guardar la contraseña.");
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
        background: "#0b0f19",
        backgroundImage:
          "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 40%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111827",
          borderRadius: "20px",
          padding: "2.25rem 1.75rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          border: "1px solid #1f2937",
          boxSizing: "border-box",
        }}
      >
        {/* Link superior al login */}
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.85rem",
            color: "#9ca3af",
            textDecoration: "none",
            marginBottom: "1.5rem",
            fontWeight: 700,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#10B981")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <ArrowLeft size={15} /> Volver al login
        </Link>

        {/* ESTADO 1: LINK INVÁLIDO O EXPIRADO */}
        {invalidLink && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: "rgba(220, 38, 38, 0.1)",
                border: "1.5px solid rgba(220, 38, 38, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <AlertCircle size={28} color="#f87171" />
            </div>
            <h1
              style={{
                margin: "0 0 0.5rem",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Link inválido o expirado
            </h1>
            <p
              style={{
                margin: "0 0 1.5rem",
                fontSize: "0.85rem",
                color: "#9ca3af",
                lineHeight: 1.5,
              }}
            >
              El link de recuperación ya no es válido o ya fue utilizado. Podés
              solicitar uno nuevo en 1 clic.
            </p>
            <Link
              href="/recuperar"
              style={{
                display: "block",
                padding: "0.85rem",
                background: "#10B981",
                color: "#0b0f19",
                borderRadius: "10px",
                fontSize: "0.92rem",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
            >
              Solicitar nuevo link →
            </Link>
          </motion.div>
        )}

        {/* ESTADO 2: ÉXITO */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center" }}
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
                margin: "0 auto 1.25rem",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
              }}
            >
              <CheckCircle2 size={30} color="#0b0f19" strokeWidth={2.5} />
            </div>
            <h1
              style={{
                margin: "0 0 0.5rem",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#10B981",
              }}
            >
              ¡Contraseña actualizada!
            </h1>
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.85rem",
                color: "#d1d5db",
                lineHeight: 1.5,
              }}
            >
              Tu nueva clave se guardó correctamente.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#9ca3af",
                fontStyle: "italic",
              }}
            >
              Redirigiendo al login en instantes...
            </p>
          </motion.div>
        )}

        {/* ESTADO 3: CARGANDO VERIFICACIÓN */}
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
              color="#10B981"
              className="animate-spin"
              style={{ margin: "0 auto 1rem auto" }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#9ca3af",
                fontWeight: 600,
              }}
            >
              Validando enlace de seguridad...
            </p>
          </motion.div>
        )}

        {/* ESTADO 4: FORMULARIO LISTO */}
        {sessionReady && !success && !invalidLink && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginBottom: "1.75rem",
              }}
            >
              <div style={{ marginBottom: "0.75rem" }}>
                <NevuxLogo size="large" />
              </div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  margin: "0 0 0.4rem 0",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                Nueva contraseña
              </h1>
              <p
                style={{
                  color: "#9ca3af",
                  margin: 0,
                  fontSize: "0.85rem",
                  lineHeight: 1.45,
                }}
              >
                Ingresá tu nueva clave segura para acceder a Nevux.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ boxSizing: "border-box" }}>
              {/* Nueva Contraseña */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9ca3af",
                    marginBottom: "0.4rem",
                  }}
                >
                  Nueva contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "0.9rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6b7280",
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
                      padding: "0.85rem 1rem 0.85rem 2.5rem",
                      border: "1.5px solid #374151",
                      borderRadius: "10px",
                      fontSize: "0.92rem",
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      color: "#ffffff",
                      background: "#1f2937",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                    onBlur={(e) => (e.target.style.borderColor = "#374151")}
                  />
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9ca3af",
                    marginBottom: "0.4rem",
                  }}
                >
                  Confirmar contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "0.9rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6b7280",
                    }}
                  />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repetí la contraseña"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.5rem",
                      border: "1.5px solid #374151",
                      borderRadius: "10px",
                      fontSize: "0.92rem",
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      color: "#ffffff",
                      background: "#1f2937",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                    onBlur={(e) => (e.target.style.borderColor = "#374151")}
                  />
                </div>
              </div>

              {/* Checklist de Validación en tiempo real */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{
                    marginBottom: "1.25rem",
                    padding: "0.75rem",
                    background: "rgba(31, 41, 55, 0.6)",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    border: "1px solid #374151",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      marginBottom: "0.3rem",
                      color: passwordChecks.length ? "#10b981" : "#9ca3af",
                      fontWeight: 600,
                    }}
                  >
                    {passwordChecks.length ? (
                      <CheckCircle2 size={15} color="#10B981" />
                    ) : (
                      <XCircle size={15} color="#6b7280" />
                    )}
                    <span>Al menos 8 caracteres</span>
                  </div>

                  {confirmPassword.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        color: passwordChecks.match ? "#10b981" : "#f87171",
                        fontWeight: 600,
                      }}
                    >
                      {passwordChecks.match ? (
                        <CheckCircle2 size={15} color="#10B981" />
                      ) : (
                        <XCircle size={15} color="#f87171" />
                      )}
                      <span>Las contraseñas coinciden</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Mensaje de Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "0.75rem",
                    background: "rgba(220, 38, 38, 0.08)",
                    color: "#f87171",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    marginBottom: "1rem",
                    border: "1px solid rgba(220, 38, 38, 0.2)",
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                    lineHeight: 1.35,
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Botón Guardar */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background: loading ? "rgba(16, 185, 129, 0.15)" : "#10B981",
                  color: loading ? "#6b7280" : "#000000",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: loading ? "none" : "0 4px 12px rgba(16, 185, 129, 0.2)",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Guardando clave...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Guardar nueva contraseña
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
            }
