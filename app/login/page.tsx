"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setLoading(false);
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError(
            "Todavía no verificaste tu email. Revisá tu bandeja de entrada."
          );
        } else {
          setError(signInError.message || "Error al iniciar sesión");
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Error en login:", err);
      setError("Ocurrió un error inesperado. Por favor reintentá.");
      setLoading(false);
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
        background: "#f9fafb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
          background: "#ffffff",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          boxShadow:
            "0 20px 60px rgba(16, 185, 129, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e5e7eb",
          boxSizing: "border-box",
        }}
      >
        {/* Logo oficial y bienvenida */}
        <div
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
          <p
            style={{
              color: "#000000",
              opacity: 0.6,
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            Bienvenido de vuelta
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
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
                  pointerEvents: "none",
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
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  color: "#000000",
                  background: "#FFFFFF",
                }}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#000000",
                marginBottom: "0.5rem",
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
                placeholder="Tu contraseña"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.75rem",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  color: "#000000",
                  background: "#FFFFFF",
                }}
              />
            </div>
          </div>

          {/* Link olvidé mi contraseña (Soporte directo por WhatsApp) */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1.25rem",
            }}
          >
            <a
              href="https://wa.me/5493434163999?text=Hola,%20necesito%20recuperar%20mi%20contrase%C3%B1a%20de%20Nevux"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.82rem",
                color: "#10B981",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Error */}
          {error && (
            <div
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
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.95rem",
              background: loading ? "rgba(16, 185, 129, 0.6)" : "#10B981",
              color: "#ffffff",
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
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Soporte / Instalación */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.85rem",
            color: "#000000",
            opacity: 0.6,
            lineHeight: 1.4,
          }}
        >
          ¿Aún no instalaste Nevux en tu tienda?{" "}
          <a
            href="https://wa.me/5493434163999?text=Hola,%20quiero%20instalar%20Nevux%20en%20mi%20Tiendanube"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#10B981",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Probar 7 días gratis
          </a>
        </p>
      </motion.div>
    </div>
  );
          }
