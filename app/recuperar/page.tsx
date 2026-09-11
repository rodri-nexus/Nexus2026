// app/recuperar/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

/* ═══════════════════════════════════════════
   CONSTANTES Y HELPERS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const COOLDOWN_KEY = "nvx_rec_cd";
const COOLDOWN_SECS = 60;

function getCDRemaining(): number {
  if (typeof window === "undefined") return 0;
  const exp = localStorage.getItem(COOLDOWN_KEY);
  if (!exp) return 0;
  const rem = Math.ceil((parseInt(exp, 10) - Date.now()) / 1000);
  return rem > 0 ? rem : 0;
}

function setCDExpiry(secs: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COOLDOWN_KEY, String(Date.now() + secs * 1000));
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
  const [cooldown, setCooldown] = useState<number>(0);
  const [botField, setBotField] = useState("");

  useEffect(() => {
    const rem = getCDRemaining();
    if (rem > 0) setCooldown(rem);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((prev) => {
        if (prev - 1 <= 0) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Por favor ingresá tu dirección de email.");
      return;
    }
    if (cooldown > 0) {
      setError(`Por seguridad, esperá ${cooldown} segundos antes de solicitar otro email.`);
      return;
    }
    if (botField !== "") {
      // Bloqueo invisible de bots (honeypot)
      setSent(true);
      return;
    }

    setLoading(true);
    try {
      // Determinamos el origen del host de manera segura en navegador
      const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "https://nevux.ar";

      const { error: err } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        { redirectTo: `${redirectOrigin}/reset-password` }
      );
      
      setLoading(false);

      if (err) {
        console.error("[Password Recovery Error]:", err);
        const msg = err.message.toLowerCase();
        
        if (msg.includes("rate limit") || msg.includes("too many") || err.status === 429) {
          setError("Detectamos demasiadas solicitudes. Por seguridad de tu cuenta, esperá unos minutos e intentá de nuevo.");
        } else {
          setError(err.message || "No pudimos enviar el link. Verificá que el email ingresado sea el correcto.");
        }
        return;
      }

      setCDExpiry(COOLDOWN_SECS);
      setCooldown(COOLDOWN_SECS);
      setSent(true);
    } catch (catchErr) {
      setLoading(false);
      console.error("[Catch Recovery Error]:", catchErr);
      setError("Error de red o conexión. Verificá tu señal e intentá nuevamente.");
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
        backgroundImage: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 40%)", 
        fontFamily: "system-ui, -apple-system, sans-serif", 
        boxSizing: "border-box" 
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
          boxSizing: "border-box" 
        }}
      >
        
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
            transition: "color 0.15s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#10B981"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
        >
          <ArrowLeft size={15} /> Volver al login
        </Link>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <NevuxLogo size="large" />
          </div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.4rem 0", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Recuperar contraseña
          </h1>
          <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem", lineHeight: 1.45 }}>
            {sent 
              ? "Revisá tu casilla de correo electrónico" 
              : "Ingresá tu correo y te enviaremos un link para restablecer tu acceso al instante."
            }
          </p>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div 
              style={{ 
                padding: "1.25rem", 
                background: "rgba(16, 185, 129, 0.06)", 
                border: "1.5px solid rgba(16, 185, 129, 0.25)", 
                borderRadius: "14px", 
                marginBottom: "1.25rem", 
                textAlign: "center" 
              }}
            >
              <div 
                style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "50%", 
                  background: "#10B981", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 0.75rem" 
                }}
              >
                <CheckCircle2 size={24} color="#0b0f19" strokeWidth={2.5} />
              </div>
              <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>
                ¡Link Enviado!
              </h2>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#d1d5db", lineHeight: 1.45 }}>
                Buscá el correo de recuperación en <strong style={{ color: "#ffffff" }}>{email}</strong>. 
                Suele llegar en pocos segundos (revisá también spam).
              </p>
            </div>
            
            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#9ca3af", marginBottom: "1.25rem" }}>
              ¿No recibiste el email?{" "}
              <button 
                onClick={() => setSent(false)} 
                disabled={cooldown > 0} 
                style={{ 
                  background: "transparent", 
                  border: "none", 
                  color: cooldown > 0 ? "#4b5563" : "#10B981", 
                  fontWeight: 800, 
                  cursor: cooldown > 0 ? "not-allowed" : "pointer", 
                  padding: 0, 
                  fontSize: "0.82rem",
                  textDecoration: "underline"
                }}
              >
                {cooldown > 0 ? `Reintentar en ${cooldown}s` : "Probar con otro correo"}
              </button>
            </p>
            
            <Link 
              href="/login" 
              style={{ 
                display: "block", 
                textAlign: "center", 
                width: "100%", 
                padding: "0.85rem", 
                background: "#ffffff", 
                color: "#0b0f19", 
                borderRadius: "10px", 
                fontSize: "0.9rem", 
                fontWeight: 800, 
                textDecoration: "none", 
                boxSizing: "border-box",
                transition: "background 0.15s"
              }}
            >
              Ir a Iniciar Sesión
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ boxSizing: "border-box" }}>
            {/* Honeypot invisible contra bots automáticos */}
            <input 
              type="text" 
              value={botField} 
              onChange={(e) => setBotField(e.target.value)} 
              style={{ display: "none" }} 
              tabIndex={-1} 
              autoComplete="off" 
            />
            
            <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#9ca3af", marginBottom: "0.4rem" }}>
                Correo registrado
              </label>
              <div style={{ position: "relative" }}>
                <Mail 
                  size={16} 
                  style={{ 
                    position: "absolute", 
                    left: "0.9rem", 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "#6b7280" 
                  }} 
                />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="ejemplo@mitienda.com" 
                  style={{ 
                    width: "100%", 
                    padding: "0.85rem 1rem 0.85rem 2.5rem", 
                    border: "1.5px solid #374151", 
                    borderRadius: "10px", 
                    fontSize: "0.92rem", 
                    outline: "none", 
                    boxSizing: "border-box", 
                    color: "#ffffff", 
                    background: "#1f2937",
                    transition: "border-color 0.15s" 
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#10B981"}
                  onBlur={(e) => e.target.style.borderColor = "#374151"}
                />
              </div>
            </div>

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
                  lineHeight: 1.35 
                }}
              >
                <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading || cooldown > 0} 
              style={{ 
                width: "100%", 
                padding: "0.85rem", 
                background: loading || cooldown > 0 ? "rgba(16, 185, 129, 0.15)" : "#10B981", 
                color: loading || cooldown > 0 ? "#6b7280" : "#000000", 
                border: "none", 
                borderRadius: "10px", 
                fontSize: "0.92rem", 
                fontWeight: 800, 
                cursor: loading || cooldown > 0 ? "not-allowed" : "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "0.5rem", 
                boxShadow: loading || cooldown > 0 ? "none" : "0 4px 12px rgba(16, 185, 129, 0.2)", 
                transition: "all 0.2s", 
                fontFamily: "inherit" 
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verificando correo...
                </>
              ) : cooldown > 0 ? (
                `Aguardá ${cooldown}s`
              ) : (
                "Enviar link de recuperación →"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
      }
