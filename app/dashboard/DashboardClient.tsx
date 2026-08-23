"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Calendar, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import SideMenu from "./components/SideMenu";
import MetricsCard from "./components/MetricsCard";
import StatsCards from "./components/StatsCards";
import RecientesCard from "./components/RecientesCard";
import AccionesRapidas from "./components/AccionesRapidas";
import CentroAyuda from "./components/CentroAyuda";
import PlanStatusCard from "./components/PlanStatusCard";
import TutorialProvider from "./components/tutorial/TutorialProvider";
import type { PlanInfo, PlanStatus, RawPlanStatus } from "@/lib/plan";

interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface SerializedPlan {
  status: PlanStatus;
  rawStatus: RawPlanStatus;
  isBlocked: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialEndsAtISO: string | null;
  planActiveUntilISO: string | null;
  monthsActive: number;
  needsFeedback: boolean;
  needsPayment: boolean;
  canUseApp: boolean;
  canCreateWidgets: boolean;
}

interface DashboardClientProps {
  email: string;
  userId: string;
  store: StoreData | null;
  productsCount: number;
  activeWidgetsCount: number;
  onboardingCompleted: boolean;
  plan: SerializedPlan | null;
}

const TIENDANUBE_CLIENT_ID = "37382";

export default function DashboardClient({
  email,
  userId,
  store,
  productsCount,
  activeWidgetsCount,
  onboardingCompleted,
  plan,
}: DashboardClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasStore = store !== null;

  const tiendanubeInstallUrl = `https://www.tiendanube.com/apps/${TIENDANUBE_CLIENT_ID}/authorize?state=${userId}`;

  const planInfo: PlanInfo | null = plan
    ? {
        status: plan.status,
        rawStatus: plan.rawStatus,
        isBlocked: plan.isBlocked,
        daysRemaining: plan.daysRemaining,
        hoursRemaining: plan.hoursRemaining,
        trialEndsAt: plan.trialEndsAtISO
          ? new Date(plan.trialEndsAtISO)
          : null,
        planActiveUntil: plan.planActiveUntilISO
          ? new Date(plan.planActiveUntilISO)
          : null,
        monthsActive: plan.monthsActive,
        needsFeedback: plan.needsFeedback,
        needsPayment: plan.needsPayment,
        canUseApp: plan.canUseApp,
        canCreateWidgets: plan.canCreateWidgets,
      }
    : null;

  return (
    <TutorialProvider
      initialCompleted={onboardingCompleted}
      userId={userId}
    >
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
          {/* BANNER: SIN TIENDA CONECTADA */}
          {!hasStore && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                background: "#ecfdf5",
                border: "1.5px solid #10B981",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.5rem",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#FFFFFF",
                  border: "1px solid #a7f3d0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={22} color="#10B981" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#000000",
                    marginBottom: "0.35rem",
                  }}
                >
                  Conectá tu Tiendanube para empezar
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "#000000",
                    opacity: 0.7,
                    lineHeight: 1.5,
                  }}
                >
                  Vinculá tu tienda para acceder a métricas reales, crear widgets e incrementar el ticket promedio de tus ventas.
                </p>
                <a
                  href={tiendanubeInstallUrl}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.85rem",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "999px",
                    background: "#10B981",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  <Store size={15} />
                  Conectar Tiendanube
                </a>
              </div>
            </motion.div>
          )}

          {/* TITULO Y BIENVENIDA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: "2rem" }}
          >
            {/* Badge cristal Verde Esmeralda */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.95rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                color: "#059669",
                fontWeight: 700,
                marginBottom: "0.75rem",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow:
                  "0 4px 16px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
              }}
            >
              <Sparkles size={13} color="#10B981" />
              Bienvenido a Nevux
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                fontWeight: 800,
                color: "#000000",
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
                color: "#000000",
                opacity: 0.6,
              }}
            >
              Hola, <strong style={{ color: "#000000", opacity: 1 }}>{email}</strong> 👋
            </p>
          </motion.div>

          {/* CHIP: TIENDA CONECTADA */}
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
                    background: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 size={16} color="#ffffff" strokeWidth={2.5} />
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
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                <Store size={14} />
                <span>ID:</span>
                <strong
                  style={{
                    color: "#000000",
                    opacity: 1,
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
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                <Calendar size={14} />
                <span>Desde:</span>
                <strong style={{ color: "#000000", opacity: 1, fontWeight: 600 }}>
                  {new Date(store.installed_at).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
            </motion.div>
          )}

          {/* CARDS DEL DASHBOARD */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {hasStore && planInfo && <PlanStatusCard plan={planInfo} />}

            <MetricsCard />

            <StatsCards
              productsCount={productsCount}
              activeWidgetsCount={activeWidgetsCount}
            />

            <RecientesCard storeId={store?.store_id} />

            <AccionesRapidas />

            <CentroAyuda />
          </div>
        </main>
      </div>
    </TutorialProvider>
  );
  }
