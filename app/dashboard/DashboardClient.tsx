"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Calendar, CheckCircle2, AlertCircle, Sparkles, Plus } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import SideMenu from "./components/SideMenu";
import MetricsCard from "./components/MetricsCard";
import StatsCards from "./components/StatsCards";
import RecientesCard from "./components/RecientesCard";
import AccionesRapidas from "./components/AccionesRapidas";
import CentroAyuda from "./components/CentroAyuda";
import TutorialProvider from "./components/tutorial/TutorialProvider";
import CrearWidgetModal from "@/components/widgets/CrearWidgetModal";
import SeleccionarProductoModal from "@/components/widgets/SeleccionarProductoModal";

interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface DashboardClientProps {
  email: string;
  store: StoreData | null;
  productsCount: number;
  activeWidgetsCount: number;
  onboardingCompleted: boolean;
}

export default function DashboardClient({
  email,
  store,
  productsCount,
  activeWidgetsCount,
  onboardingCompleted,
}: DashboardClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const hasStore = store !== null;

  return (
    <TutorialProvider initialCompleted={onboardingCompleted}>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Header */}
        <DashboardHeader email={email} onMenuClick={() => setMenuOpen(true)} />

        {/* SideMenu */}
        <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Contenido principal */}
        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem 1.25rem 3rem",
          }}
        >
          {/* Banner si NO hay tienda conectada */}
          {!hasStore && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                border: "1px solid #fcd34d",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={22} color="#b45309" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#78350f",
                    marginBottom: "0.35rem",
                  }}
                >
                  Conectá tu Tiendanube para empezar
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "#92400e",
                    lineHeight: 1.5,
                  }}
                >
                  Vinculá tu tienda para acceder a métricas, crear widgets y
                  empezar a aumentar tu ticket promedio.
                </p>
                <a
                  href="/api/auth/install"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.85rem",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                  }}
                >
                  <Store size={15} />
                  Conectar Tiendanube
                </a>
              </div>
            </motion.div>
          )}

          {/* Bienvenida + título */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: "2rem" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.85rem",
                background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
                borderRadius: "999px",
                fontSize: "0.8rem",
                color: "#6366f1",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              <Sparkles size={13} />
              Bienvenido a Nevux
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.95rem",
                color: "#6b7280",
              }}
            >
              Hola, <strong style={{ color: "#374151" }}>{email}</strong> 👋
            </p>
          </motion.div>

          {/* Info compacta de la tienda conectada */}
          {hasStore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.75rem 1.5rem",
                padding: "0.9rem 1.25rem",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 size={15} color="#ffffff" strokeWidth={2.5} />
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#059669",
                    fontWeight: 700,
                  }}
                >
                  Tienda conectada
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                <Store size={14} />
                <span>ID:</span>
                <strong
                  style={{
                    color: "#111827",
                    fontFamily: "monospace",
                    fontWeight: 600,
                  }}
                >
                  {store.store_id}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                <Calendar size={14} />
                <span>Desde:</span>
                <strong style={{ color: "#111827", fontWeight: 600 }}>
                  {new Date(store.installed_at).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
            </motion.div>
          )}

          {/* Grid del dashboard */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Métricas de widgets */}
            <MetricsCard />

            {/* Stats: Productos + Widgets activos */}
            <StatsCards
              productsCount={productsCount}
              activeWidgetsCount={activeWidgetsCount}
            />

            {/* Recientes */}
            <RecientesCard />

            {/* Acciones rápidas */}
            <AccionesRapidas />

            {/* Centro de ayuda */}
            <CentroAyuda />
          </div>
        </main>

        {/* Botón flotante "+" para crear widget */}
        {hasStore && (
          <button
            onClick={() => setCreateModalOpen(true)}
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#ffffff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
              zIndex: 50,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.4)";
            }}
            aria-label="Crear nuevo widget"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        )}

        {/* Modales de creación de widgets */}
        <CrearWidgetModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSelectProducto={() => {
            setCreateModalOpen(false);
            setProductModalOpen(true);
          }}
          onSelectTodos={() => {
            setCreateModalOpen(false);
            window.location.href = "/widgets/nuevo/todos";
          }}
        />

        {store && (
          <SeleccionarProductoModal
            isOpen={productModalOpen}
            onClose={() => setProductModalOpen(false)}
            storeId={store.store_id}
          />
        )}
      </div>
    </TutorialProvider>
  );
        }
