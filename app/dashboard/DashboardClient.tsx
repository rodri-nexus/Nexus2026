"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Store, LogOut, Loader2, Sparkles, CheckCircle2, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

type StoreData = {
  store_id: number;
  installed_at: string;
  is_active: boolean;
};

export default function DashboardClient({
  email,
  store,
}: {
  email: string;
  store: StoreData | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            margin: 0,
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          Nevux
        </h1>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "white",
            border: "1.5px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "0.9rem",
            color: "#374151",
            cursor: loggingOut ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            fontWeight: 500,
            transition: "all 0.2s",
          }}
        >
          {loggingOut ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saliendo...
            </>
          ) : (
            <>
              <LogOut size={16} />
              Cerrar sesión
            </>
          )}
        </button>
      </header>

      {/* Contenido principal */}
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        {/* Bienvenida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.85rem",
              background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
              borderRadius: "999px",
              fontSize: "0.85rem",
              color: "#6366f1",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={14} />
            Bienvenido a Nevux
          </div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#111827",
              margin: "0 0 0.5rem 0",
              letterSpacing: "-0.02em",
            }}
          >
            ¡Hola! 👋
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1.05rem", margin: 0 }}>
            Estás conectado como <strong style={{ color: "#374151" }}>{email}</strong>
          </p>
        </motion.div>

        {/* Card condicional: Tienda conectada o Conectar */}
        {store ? (
          // ===== TIENDA CONECTADA =====
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "2.5rem 2rem",
              boxShadow:
                "0 10px 30px rgba(99, 102, 241, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                }}
              >
                <CheckCircle2 size={28} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Tienda conectada
                </h3>
                <p
                  style={{
                    color: "#10b981",
                    fontSize: "0.9rem",
                    margin: "0.25rem 0 0 0",
                    fontWeight: 600,
                  }}
                >
                  ● Activa y sincronizada
                </p>
              </div>
            </div>

            {/* Info de la tienda */}
            <div
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "grid",
                gap: "0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Store size={18} color="#6366f1" />
                <div>
                  <div
                    style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 500 }}
                  >
                    Store ID
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      color: "#111827",
                      fontWeight: 600,
                    }}
                  >
                    {store.store_id}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Calendar size={18} color="#6366f1" />
                <div>
                  <div
                    style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 500 }}
                  >
                    Conectada el
                  </div>
                  <div style={{ color: "#111827", fontWeight: 600 }}>
                    {new Date(store.installed_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                textAlign: "center",
                marginTop: "1.5rem",
                marginBottom: 0,
              }}
            >
              🎉 Todo listo. Pronto vas a poder configurar tus bundles y upsells.
            </p>
          </motion.div>
        ) : (
          // ===== SIN TIENDA (conectar) =====
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "2.5rem 2rem",
              boxShadow:
                "0 10px 30px rgba(99, 102, 241, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem auto",
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
              }}
            >
              <Store size={32} color="white" strokeWidth={2} />
            </div>

            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 0.75rem 0",
                letterSpacing: "-0.01em",
              }}
            >
              Conectá tu tienda
            </h3>

            <p
              style={{
                color: "#6b7280",
                fontSize: "1rem",
                margin: "0 0 2rem 0",
                maxWidth: "480px",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.6,
              }}
            >
              Conectá tu tienda de Tiendanube para empezar a aumentar tu ticket
              promedio con bundles, upsell y cross-sell inteligentes.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                window.location.href = "/api/auth/install";
              }}
              style={{
                padding: "0.95rem 2rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              <Store size={18} />
              Conectar mi Tiendanube
            </motion.button>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                marginTop: "1.25rem",
                marginBottom: 0,
              }}
            >
              Vas a ser redirigido a Tiendanube para autorizar la conexión
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
            }
