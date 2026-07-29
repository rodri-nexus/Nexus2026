"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Plus, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import SideMenu from "../dashboard/components/SideMenu";

interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface WidgetsClientProps {
  email: string;
  store: StoreData | null;
}

export default function WidgetsClient({
  email,
  store,
}: WidgetsClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardHeader email={email} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.25rem 3rem",
        }}
      >
        {/* Volver al dashboard */}
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.85rem",
            color: "#6b7280",
            textDecoration: "none",
            marginBottom: "1rem",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} />
          Volver al dashboard
        </Link>

        {/* Header de la página */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                }}
              >
                Widgets
              </h1>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.95rem",
                  color: "#6b7280",
                }}
              >
                {store
                  ? "Todavía no creaste ningún widget. Empezá creando uno."
                  : "Conectá tu Tiendanube para empezar a crear widgets."}
              </p>
            </div>

            {store && (
              <button
                disabled
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.7rem 1.25rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "not-allowed",
                  opacity: 0.7,
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                  fontFamily: "inherit",
                }}
              >
                <Plus size={14} />
                Crear widget
              </button>
            )}
          </div>
        </motion.div>

        {/* Contenido: placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "3rem 2rem",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <LayoutGrid size={34} color="#6366f1" strokeWidth={1.75} />
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.85rem",
              background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#6366f1",
              fontWeight: 700,
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <Sparkles size={12} />
            Próximamente
          </div>

          <h2
            style={{
              margin: "0 0 0.75rem",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.01em",
            }}
          >
            Editor de widgets
          </h2>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "460px",
              fontSize: "0.95rem",
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            Muy pronto vas a poder crear bundles, upsells y cross-sells para
            aumentar el ticket promedio de tus ventas.
          </p>
        </motion.div>
      </main>
    </div>
  );
              }
