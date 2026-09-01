"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  Check,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validaciones de contraseña
  const passwordChecks = {
    length: password.length >= 8,
    match: password === confirmPassword && password.length > 0,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanNombre = nombre.trim();
    const cleanApellido = apellido.trim();

    if (!cleanNombre || cleanNombre.length < 2) {
      setError("Por favor ingresá tu nombre real");
      return;
    }

    if (!cleanApellido || cleanApellido.length < 2) {
      setError("Por favor ingresá tu apellido real");
      return;
    }

    if (!passwordChecks.length) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!passwordChecks.match) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!acceptedTerms) {
      setError(
        "Tenés que aceptar los Términos y la Política de Privacidad para continuar"
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const fullName = `${cleanNombre} ${cleanApellido}`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            first_name: cleanNombre,
            last_name: cleanApellido,
          },
        },
      });

      if (signUpError) {
        setLoading(false);
        if (
          signUpError.message.includes("already registered") ||
          signUpError.message.includes("already been registered")
        ) {
          setError("Este email ya está registrado. Iniciá sesión.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Crear perfil en tabla profiles
      if (data?.user) {
        // Trial de 7 días desde ahora
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);

        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            avatar_url: null,
            plan: "free",
            onboarding_completed: false,
            trial_ends_at: trialEndsAt.toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error al crear perfil:", profileError);
        }
      }

      setLoading(false);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error en registro:", err);
      setError("Ocurrió un error inesperado. Por favor reintentá.");
      setLoading(false);
    }
  }

  const isButtonDisabled = loading || !acceptedTerms;

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
        boxSizing: "border-box",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "white",
          borderRadius: "20px",
          padding: "2.2rem 1.8rem",
          boxShadow:
            "0 20px 60px rgba(16, 185, 129, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e5e7eb",
          boxSizing: "border-box",
        }}
      >
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
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <NevuxLogo size="large" />
          </div>
          <p
            style={{
              color: "#000000",
              opacity: 0.6,
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            Creá tu cuenta gratis en segundos
          </p>
        </motion.div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Nombre y Apellido (2 Columnas) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            {/* Nombre */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#000000",
                  marginBottom: "0.4rem",
                }}
              >
                Nombre
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={17}
                  style={{
                    position: "absolute",
                    left: "0.8rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(0, 0, 0, 0.4)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onFocus={() => setFocusedField("nombre")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Rodrigo"
                  autoComplete="given-name"
                  style={{
                    width: "100%",
                    padding: "0.8rem 0.8rem 0.8rem 2.4rem",
                    border:
                      focusedField === "nombre"
                        ? "1.5px solid #10B981"
                        : "1.5px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "0.92rem",
                    outline: "none",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    color: "#000000",
                    background: "#FFFFFF",
                  }}
                />
              </div>
            </motion.div>

            {/* Apellido */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#000000",
                  marginBottom: "0.4rem",
                }}
              >
                Apellido
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={17}
                  style={{
                    position: "absolute",
                    left: "0.8rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(0, 0, 0, 0.4)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  onFocus={() => setFocusedField("apellido")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Pérez"
                  autoComplete="family-name"
                  style={{
                    width: "100%",
                    padding: "0.8rem 0.8rem 0.8rem 2.4rem",
                    border:
                      focusedField === "apellido"
                        ? "1.5px solid #10B981"
                        : "1.5px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "0.92rem",
                    outline: "none",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    color: "#000000",
                    background: "#FFFFFF",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Email */}
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
                marginBottom: "0.4rem",
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
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="tu@email.com"
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.75rem",
                  border:
                    focusedField === "email"
                      ? "1.5px solid #10B981"
                      : "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  color: "#000000",
                  background: "#FFFFFF",
                }}
              />
            </div>
          </motion.div>

          {/* Contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: "1rem" }}
          >
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#000000",
                marginBottom: "0.4rem",
              }}
            >
              Contraseña
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
                  pointerEvents: "none",
                }}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.75rem",
                  border:
                    focusedField === "password"
                      ? "1.5px solid #10B981"
                      : "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  color: "#000000",
                  background: "#FFFFFF",
                }}
              />
            </div>
          </motion.div>

          {/* Confirmar Contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#000000",
                marginBottom: "0.4rem",
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
                  pointerEvents: "none",
                }}
              />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.75rem",
                  border:
                    focusedField === "confirmPassword"
                      ? "1.5px solid #10B981"
                      : "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  color: "#000000",
                  background: "#FFFFFF",
                }}
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
                border: "1px solid #e5e7eb",
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

          {/* Checkbox de términos y privacidad */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <label
              htmlFor="accept-terms"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.65rem",
                padding: "0.85rem 1rem",
                background: acceptedTerms ? "#ecfdf5" : "#f9fafb",
                border: acceptedTerms
                  ? "1.5px solid #10B981"
                  : "1.5px solid #e5e7eb",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    margin: 0,
                  }}
                />
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    border: acceptedTerms
                      ? "2px solid #10B981"
                      : "2px solid #d1d5db",
                    background: acceptedTerms ? "#10B981" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    pointerEvents: "none",
                  }}
                >
                  {acceptedTerms && (
                    <Check size={14} color="#ffffff" strokeWidth={3} />
                  )}
                </div>
              </div>

              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#000000",
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                Acepto los{" "}
                <Link
                  href="/terminos"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: "#10B981",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link
                  href="/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: "#10B981",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  Política de Privacidad
                </Link>{" "}
                de Nevux.
              </div>
            </label>
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
            disabled={isButtonDisabled}
            whileHover={{ scale: isButtonDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
            style={{
              width: "100%",
              padding: "0.95rem",
              background: isButtonDisabled
                ? "rgba(16, 185, 129, 0.5)"
                : "#10B981",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: isButtonDisabled ? "not-allowed" : "pointer",
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
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta gratis"
            )}
          </motion.button>
        </form>

        {/* Link a login */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "#000000",
            opacity: 0.6,
          }}
        >
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            style={{
              color: "#10B981",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Iniciar sesión
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
    }
