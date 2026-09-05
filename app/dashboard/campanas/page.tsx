"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  Sparkles,
  Loader2,
  Store as StoreIcon,
  AlertCircle,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CampaignActivator from "../components/CampaignActivator";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface UserStore {
  store_id: number;
  user_id: string;
}

/* ═══════════════════════════════════════════
   ESTILOS AUXILIARES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const pageContainerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#ffffff",
  color: "#000000",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const mainContentStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "2rem 1.25rem 4rem",
  boxSizing: "border-box",
};

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CampanasPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y tienda activa
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          setUserEmail(user.email || "");

          const { data: storeData } = await supabase
            .from("stores")
            .select("store_id, user_id")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .maybeSingle();

          if (storeData && isMounted) {
            setStore(storeData);
          }
        }
      } catch (err) {
        console.error("Error cargando tienda:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={pageContainerStyle}>
      <DashboardHeader email={userEmail} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main style={mainContentStyle}>
        {/* NAVEGACIÓN SUPERIOR / BREADCRUMB */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#6b7280",
              textDecoration: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#000000";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6b7280";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <ArrowLeft size={15} />
            Volver al Dashboard
          </Link>
        </div>

        {/* ENCABEZADO DE LA SECCIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#ea580c",
              fontWeight: 800,
              marginBottom: "0.6rem",
              background: "rgba(234, 88, 12, 0.1)",
              border: "1px solid rgba(234, 88, 12, 0.25)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Flame size={13} color="#ea580c" />
            1-Click Booster
          </div>

          <h1
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.85rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#000000",
            }}
          >
            Modo Fechas Especiales & Black Friday
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Activá temáticas de alto impacto para Black Friday, Hot Sale, Cyber Monday, Navidad y más.
            Nevux guardará un respaldo automático para que puedas desactivarlo y volver a tu diseño normal en cualquier momento.
          </p>
        </motion.div>

        {/* ESTADO DE CARGA */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 1rem",
              gap: "0.85rem",
            }}
          >
            <Loader2 size={32} color="#10B981" className="animate-spin" />
            <span style={{ fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>
              Cargando panel de fechas especiales...
            </span>
          </div>
        ) : !store ? (
          /* AVISO SI NO TIENE TIENDA */
          <div
            style={{
              background: "#ecfdf5",
              border: "1.5px solid #10B981",
              borderRadius: "16px",
              padding: "1.75rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <AlertCircle size={24} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.05rem", fontWeight: 800 }}>
                Conectá tu Tiendanube para activar campañas
              </h3>
              <p style={{ margin: 0, fontSize: "0.88rem", opacity: 0.75, lineHeight: 1.5 }}>
                Para transformar tus widgets y sincronizar los cupones con 1 clic, primero debés vincular tu tienda oficial.
              </p>
            </div>
          </div>
        ) : (
          /* PANEL DE CAMPAÑAS 1-CLICK */
          <div>
            <CampaignActivator storeId={store.store_id} />
          </div>
        )}

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: "3rem" }}>
          <CentroAyuda />
        </div>
      </main>
    </div>
  );
    }
