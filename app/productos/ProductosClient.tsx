"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, RefreshCw, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import SideMenu from "../dashboard/components/SideMenu";
import CentroAyuda from "../dashboard/components/CentroAyuda";

interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface ProductosClientProps {
  email: string;
  store: StoreData | null;
  productsCount: number;
}

export default function ProductosClient({
  email,
  store,
  productsCount,
}: ProductosClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function handleSync() {
    if (syncing) return;
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSyncing(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
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
          boxSizing: "border-box",
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
            color: "#000000",
            opacity: 0.6,
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
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                Productos
              </h1>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.95rem",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                {store
                  ? `Tenés ${productsCount} ${
                      productsCount === 1 ? "producto" : "productos"
                    } sincronizados desde Tiendanube.`
                  : "Conectá tu Tiendanube para ver tus productos."}
              </p>
            </div>

            {store && (
              <button
                onClick={handleSync}
                disabled={syncing}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.7rem 1.25rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "#FF0000",
                  opacity: syncing ? 0.6 : 1,
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: syncing ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(255, 0, 0, 0.35)",
                  fontFamily: "inherit",
                }}
              >
                <RefreshCw
                  size={14}
                  style={{
                    animation: syncing ? "spin 1s linear infinite" : "none",
                  }}
                />
                {syncing ? "Sincronizando..." : "Sincronizar"}
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
              background: "#fff5f5",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <Package size={34} color="#FF0000" strokeWidth={1.75} />
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.85rem",
                background: "#fff5f5",
                borderRadius: "999px",
                fontSize: "0.75rem",
                color: "#FF0000",
                fontWeight: 700,
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Sparkles size={12} />
              Próximamente
            </div>
          </div>

          <h2
            style={{
              margin: "0 0 0.75rem",
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.01em",
            }}
          >
            Listado de productos
          </h2>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "460px",
              fontSize: "0.95rem",
              color: "#000000",
              opacity: 0.6,
              lineHeight: 1.6,
            }}
          >
            Muy pronto vas a poder ver todos tus productos de Tiendanube,
            filtrarlos y usarlos para crear bundles y widgets inteligentes.
          </p>
        </motion.div>

        {/* Centro de Ayuda */}
        <div style={{ marginTop: "2.5rem" }}>
          <CentroAyuda />
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
        }
