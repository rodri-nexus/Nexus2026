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

// Plan serializado (fechas como ISO strings, listo para pasar client-side)
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

  // Reconstruimos el PlanInfo con las Date objects para pasarlo al PlanStatusCard
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
      <SessionRefresher />
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
          }}
        >
          {!hasStore && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                background: "#ffffff",
                border: "1.5px solid #000000",
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
                  background: "#fff5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={22} color="#FF0000" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
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
                  Vinculá tu tienda para acceder a métricas, crear widgets y
                  empezar a aumentar tu ticket promedio.
                </p>
                <a
                  href={tiendanubeInstallUrl}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.85rem",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "999px",
                    background: "#FF0000",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(255, 0, 0, 0.35)",
                  }}
                >
                  <Store size={15} />
                  Conectar Tiendanube
                </a>
              </div>
            </motion.div>
          )}

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
                background: "#fff5f5",
                borderRadius: "999px",
                fontSize: "0.8rem",
                color: "#FF0000",
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
                    background: "#FF0000",
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
                    color: "#FF0000",
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Card del estado del plan (solo si tiene tienda conectada) */}
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
