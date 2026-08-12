import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProductsCount } from "@/lib/tiendanube";
import { buildPlanInfo, type StorePlanData } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

// Revalidar cada 5 minutos para no saturar la API de Tiendanube
export const revalidate = 300;

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar en paralelo: tienda vinculada + perfil (onboarding) + widgets activos
  const [storeRes, profileRes, widgetsCountRes] = await Promise.all([
    supabase
      .from("stores")
      .select(
        "store_id, access_token, installed_at, is_active, user_id, trial_started_at, trial_ends_at, plan_status, plan_active_until, last_payment_at, months_active, feedback_shown"
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("widgets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  const store = storeRes.data;
  const onboardingCompleted = profileRes.data?.onboarding_completed ?? false;
  const activeWidgetsCount = widgetsCountRes.count ?? 0;

  // ─────────────────────────────────────────────
  // 🔒 PAYWALL GUARD — Verificar estado del plan
  // Solo aplica si YA tiene tienda conectada.
  // Si no tiene tienda, lo dejamos entrar para que la conecte.
  // ─────────────────────────────────────────────
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

    if (!plan.canUseApp) {
      // Necesita ver la pantalla de feedback
      if (plan.needsFeedback) {
        redirect("/plan/feedback");
      }

      // Ya respondió el feedback → chequear si dijo NO y falta enviar opinión
      if (plan.needsPayment) {
        // Traer el último feedback del usuario para saber si dijo SÍ o NO
        const { data: lastFeedback } = await supabaseAdmin
          .from("feedback")
          .select("liked_app, detailed_feedback, reason_tags")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Si dijo NO y todavía NO envió la opinión detallada → a /plan/opinion
        if (
          lastFeedback &&
          lastFeedback.liked_app === false &&
          !lastFeedback.detailed_feedback &&
          (!lastFeedback.reason_tags || lastFeedback.reason_tags.length === 0)
        ) {
          redirect("/plan/opinion");
        }

        // Cualquier otro caso (dijo SÍ, o dijo NO pero ya envió opinión) → a la pantalla de pago
        redirect("/plan/expirado");
      }
    }
  }

  // ─────────────────────────────────────────────
  // Plan activo o trial vigente → dashboard normal
  // ─────────────────────────────────────────────
  let productsCount = 0;
  if (store?.store_id && store?.access_token) {
    productsCount = await getProductsCount(
      store.store_id,
      store.access_token
    );
  }

  const storeData = store
    ? {
        store_id: store.store_id,
        installed_at: store.installed_at,
        is_active: store.is_active,
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
    />
  );
    }
