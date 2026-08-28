import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProductsCount } from "@/lib/tiendanube";
import { buildPlanInfo, type StorePlanData, type PlanInfo } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

// Forzamos render dinámico para que el dashboard siempre traiga datos frescos.
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevuxapp@gmail.com";

// Helper para detectar redirecciones de Next.js sin capturarlas en el catch
function isRedirectError(err: any): boolean {
  if (!err) return false;
  if (err?.message === "NEXT_REDIRECT") return true;
  if (typeof err?.digest === "string" && err.digest.includes("NEXT_REDIRECT")) return true;
  return false;
}

export default async function DashboardPage() {
  // 1. AUTENTICACIÓN (Fuera del try/catch para redirección limpia)
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 🔒 REDIRECCIÓN DE ADMINISTRADOR
  const userEmail = (user.email || "").toLowerCase();
  if (userEmail === ADMIN_EMAIL) {
    redirect("/admin/pagos");
  }

  // Variables de estado del dashboard
  let store: any = null;
  let onboardingCompleted = false;
  let activeWidgetsCount = 0;
  let planInfo: PlanInfo | null = null;
  let productsCount = 0;

  try {
    // 2. Buscar la tienda activa más reciente
    const { data: storesList } = await supabaseAdmin
      .from("stores")
      .select(
        "store_id, access_token, installed_at, is_active, user_id, trial_started_at, trial_ends_at, plan_status, plan_active_until, last_payment_at, months_active, feedback_shown"
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("installed_at", { ascending: false })
      .limit(1);

    store = storesList && storesList.length > 0 ? storesList[0] : null;

    // 3. Buscar perfil de onboarding
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    onboardingCompleted = profile?.onboarding_completed ?? false;

    // 4. Contar widgets activos
    const { count: widgetsCount } = await supabaseAdmin
      .from("widgets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    activeWidgetsCount = widgetsCount ?? 0;

    // 5. Verificar estado del plan
    if (store) {
      const planData: StorePlanData = {
        store_id: store.store_id,
        user_id: store.user_id,
        trial_started_at: store.trial_started_at,
        trial_ends_at: store.trial_ends_at,
        plan_status: store.plan_status,
        plan_active_until: store.plan_active_until,
        last_payment_at: store.last_payment_at,
        months_active: store.months_active,
        feedback_shown: store.feedback_shown,
      };

      planInfo = buildPlanInfo(planData);
    }

    // 6. Obtener cantidad de productos de Tiendanube
    if (store?.store_id && store?.access_token) {
      try {
        productsCount = await getProductsCount(
          store.store_id,
          store.access_token
        );
      } catch (e) {
        console.error("Error obteniendo cantidad de productos:", e);
      }
    }
  } catch (err: any) {
    if (isRedirectError(err)) {
      throw err;
    }
    console.error("[Dashboard Query Exception]:", err);
  }

  // 🔒 CONTROL DE ACCESO SEGÚN PLAN (Fuera del try/catch)
  if (planInfo && !planInfo.canUseApp) {
    if (planInfo.needsFeedback) {
      redirect("/plan/feedback");
    }

    if (planInfo.needsPayment) {
      const { data: feedbackList } = await supabaseAdmin
        .from("feedback")
        .select("liked_app, detailed_feedback, reason_tags")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const lastFeedback =
        feedbackList && feedbackList.length > 0 ? feedbackList[0] : null;

      if (
        lastFeedback &&
        lastFeedback.liked_app === false &&
        !lastFeedback.detailed_feedback &&
        (!lastFeedback.reason_tags || lastFeedback.reason_tags.length === 0)
      ) {
        redirect("/plan/opinion");
      }

      redirect("/plan/expirado");
    }
  }

  const storeData = store
    ? {
        store_id: store.store_id,
        installed_at: store.installed_at,
        is_active: store.is_active,
      }
    : null;

  const planSerialized = planInfo
    ? {
        status: planInfo.status,
        rawStatus: planInfo.rawStatus,
        isBlocked: planInfo.isBlocked,
        daysRemaining: planInfo.daysRemaining,
        hoursRemaining: planInfo.hoursRemaining,
        trialEndsAtISO: planInfo.trialEndsAt
          ? planInfo.trialEndsAt.toISOString()
          : null,
        planActiveUntilISO: planInfo.planActiveUntil
          ? planInfo.planActiveUntil.toISOString()
          : null,
        monthsActive: planInfo.monthsActive,
        needsFeedback: planInfo.needsFeedback,
        needsPayment: planInfo.needsPayment,
        canUseApp: planInfo.canUseApp,
        canCreateWidgets: planInfo.canCreateWidgets,
      }
    : null;

  return (
    <DashboardClient
      email={user.email ?? ""}
      userId={user.id}
      store={storeData}
      productsCount={productsCount}
      activeWidgetsCount={activeWidgetsCount}
      onboardingCompleted={onboardingCompleted}
      plan={planSerialized}
    />
  );
          }
