import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProductsCount } from "@/lib/tiendanube";
import { buildPlanInfo, type StorePlanData, type PlanInfo } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

// Forzamos render dinámico para que el dashboard siempre traiga datos frescos.
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevuxapp@gmail.com";

export default async function DashboardPage() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // 🔒 REDIRECCIÓN AUTOMÁTICA DE ADMINISTRADOR
    const userEmail = (user.email || "").toLowerCase();
    if (userEmail === ADMIN_EMAIL) {
      redirect("/admin/pagos");
    }

    // 1. Buscar la tienda activa más reciente (sin encadenar .limit y .maybeSingle)
    const { data: storesList } = await supabaseAdmin
      .from("stores")
      .select(
        "store_id, access_token, installed_at, is_active, user_id, trial_started_at, trial_ends_at, plan_status, plan_active_until, last_payment_at, months_active, feedback_shown"
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("installed_at", { ascending: false })
      .limit(1);

    const store = storesList && storesList.length > 0 ? storesList[0] : null;

    // 2. Buscar perfil de onboarding
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    const onboardingCompleted = profile?.onboarding_completed ?? false;

    // 3. Contar widgets activos
    const { count: widgetsCount } = await supabaseAdmin
      .from("widgets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    const activeWidgetsCount = widgetsCount ?? 0;

    // 🔒 PAYWALL GUARD — Verificar estado del plan
    let planInfo: PlanInfo | null = null;

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

      const plan = buildPlanInfo(planData);
      planInfo = plan;

      if (!plan.canUseApp) {
        if (plan.needsFeedback) {
          redirect("/plan/feedback");
        }

        if (plan.needsPayment) {
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
    }

    // 4. Obtener productos de Tiendanube
    let productsCount = 0;
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
  } catch (err: any) {
    // Si es una redirección intencional de Next.js, no la capturamos como error
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }

    console.error("[Dashboard Exception]:", err);

    return (
      <DashboardClient
        email=""
        userId=""
        store={null}
        productsCount={0}
        activeWidgetsCount={0}
        onboardingCompleted={false}
        plan={null}
      />
    );
  }
              }
