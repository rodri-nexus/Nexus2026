"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Email o contraseña incorrectos");
      } else if (signInError.message.includes("Email not confirmed")) {
        setError(
          "Todavía no verificaste tu email. Revisá tu bandeja de entrada."
        );
      } else {
        setError(signInError.message);
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
        {/* Logo/Título */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              margin: "0 0 0.5rem 0",
              fontWeight: 800,
              color: "#FF0000",
              letterSpacing: "-0.02em",
            }}
          >
            Nevux
          </h1>
          <p
            style={{
              color: "#000000",
              opacity: 0.6,
              margin: 0,
              fontSize: "0.95rem",
            }}
          >
            Bienvenido de vuelta
          </p>
        </motion.div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
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
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#FF0000")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </motion.div>

          {/* Contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: "1.5rem" }}
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
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#FF0000")}
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
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </motion.button>
        </form>

        {/* Link a registro */}
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
          ¿No tenés cuenta?{" "}
          <Link
            href="/registro"
            style={{
              color: "#FF0000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Crear cuenta gratis
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
      }
