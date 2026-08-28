// app/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import {
  Store,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
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
const ADMIN_EMAIL = "nevuxapp@gmail.com";

export default function DashboardClient({
  email,
  userId,
  store,
  productsCount,
  activeWidgetsCount,
  plan,
}: DashboardClientProps) {
  const [menuHint] = useState(false);
  const hasStore = store !== null;
  const isAdmin = (email || "").toLowerCase() === ADMIN_EMAIL;

  const tiendanubeInstallUrl = `https://www.tiendanube.com/apps/${TIENDANUBE_CLIENT_ID}/authorize?state=${userId}`;

  const planInfo: PlanInfo | null = plan
    ? {
        status: plan.status,
        rawStatus: plan.rawStatus,
        isBlocked: plan.isBlocked,
        daysRemaining: plan.daysRemaining ?? 0,
        hoursRemaining: plan.hoursRemaining ?? 0,
        trialEndsAt: plan.trialEndsAtISO
          ? new Date(plan.trialEndsAtISO)
          : null,
        planActiveUntil: plan.planActiveUntilISO
          ? new Date(plan.planActiveUntilISO)
          : null,
        monthsActive: plan.monthsActive ?? 0,
        needsFeedback: plan.needsFeedback,
        needsPayment: plan.needsPayment,
        canUseApp: plan.canUseApp,
        canCreateWidgets: plan.canCreateWidgets,
      }
    : null;

  void menuHint;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        color: "#000000",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header simple (sin SideMenu ni Tutorial) */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#000000" }}>
          Nevux
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "#000000",
            opacity: 0.6,
            maxWidth: "55%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {email}
        </div>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 1rem 3rem",
          boxSizing: "border-box",
        }}
      >
        {/* Admin */}
        {isAdmin && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              background: "#000000",
              color: "#ffffff",
              border: "1.5px solid #10B981",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={24} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: "0.2rem" }}>
                  Cuenta Administrador
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.75 }}>
                  Gestioná pagos y comercios.
                </p>
              </div>
            </div>
            <a
              href="/admin/pagos"
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "999px",
                background: "#10B981",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              Panel de Pagos →
            </a>
          </div>
        )}

        {/* Sin tienda */}
        {!hasStore && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              background: "#ecfdf5",
              border: "1.5px solid #10B981",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <AlertCircle size={22} color="#10B981" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, marginBottom: "0.35rem" }}>
                Conectá tu Tiendanube para empezar
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  opacity: 0.7,
                  lineHeight: 1.5,
                }}
              >
                Vinculá tu tienda para métricas, widgets y más ventas.
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
                }}
              >
                <Store size={15} />
                Conectar Tiendanube
              </a>
            </div>
          </div>
        )}

        {/* Bienvenida */}
        <div style={{ marginBottom: "1.5rem" }}>
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
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
            }}
          >
            <Sparkles size={13} color="#10B981" />
            Panel estable
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.85rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Dashboard
          </h1>
          <p style={{ margin: "0.4rem 0 0", fontSize: "0.92rem", opacity: 0.6 }}>
            Hola, <strong style={{ opacity: 1 }}>{email}</strong> 👋
          </p>
        </div>

        {/* Chip tienda */}
        {hasStore && store && (
          <div
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
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
              <span style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 700 }}>
                Tienda conectada
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                opacity: 0.6,
              }}
            >
              <Store size={14} />
              ID: <strong style={{ opacity: 1 }}>{store.store_id}</strong>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                opacity: 0.6,
              }}
            >
              <Calendar size={14} />
              Desde:{" "}
              <strong style={{ opacity: 1 }}>
                {store.installed_at
                  ? new Date(store.installed_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </strong>
            </div>
          </div>
        )}

        {/* Resumen plan (texto simple, sin PlanStatusCard todavía) */}
        {planInfo && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                background: "#10B981",
                color: "#ffffff",
                fontSize: "0.7rem",
                fontWeight: 800,
                marginBottom: "0.75rem",
              }}
            >
              {planInfo.status === "trial" || planInfo.status === "trial_ending_soon"
                ? "TRIAL"
                : planInfo.status === "active" || planInfo.status === "expiring_soon"
                ? "PLAN ACTIVO"
                : "PLAN"}
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.35rem" }}>
              {planInfo.daysRemaining} días restantes
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>
              Meses activos: {planInfo.monthsActive} · Productos: {productsCount} ·
              Widgets: {activeWidgetsCount}
            </div>
            {(planInfo.daysRemaining <= 5 ||
              planInfo.status === "trial" ||
              planInfo.status === "trial_ending_soon") && (
              <a
                href="/plan/pagar"
                style={{
                  display: "flex",
                  marginTop: "1rem",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.85rem",
                  background: "#10B981",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                }}
              >
                Activar / Renovar plan
              </a>
            )}
          </div>
        )}

        {/* Accesos rápidos sin componentes pesados */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <a
            href="/widgets"
            style={{
              padding: "1rem",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#000000",
              fontWeight: 700,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            Widgets
          </a>
          <a
            href="/productos"
            style={{
              padding: "1rem",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#000000",
              fontWeight: 700,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            Productos
          </a>
          <a
            href="/dashboard/nevuxbot"
            style={{
              padding: "1rem",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#000000",
              fontWeight: 700,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            NevuxBot
          </a>
          <a
            href="/plan/pagar"
            style={{
              padding: "1rem",
              background: "#ecfdf5",
              border: "1px solid #10B981",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#059669",
              fontWeight: 700,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            Mi plan
          </a>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.8rem",
            opacity: 0.5,
            textAlign: "center",
          }}
        >
          Versión segura · sin métricas ni tutorial (evita freeze)
        </p>
      </main>
    </div>
  );
    }
