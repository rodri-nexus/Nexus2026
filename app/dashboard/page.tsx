import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { buildPlanInfo, type StorePlanData, type PlanInfo, type RawPlanStatus } from "@/lib/plan";
import { getProductsCount } from "@/lib/tiendanube";
import { supabaseAdmin } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevuxapp@gmail.com";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = (user.email || "").toLowerCase();
  if (userEmail === ADMIN_EMAIL) {
    redirect("/admin/pagos");
  }

  let store: any = null;
  let onboardingCompleted = false;
  let fullName = "";
  let activeWidgetsCount = 0;
  let planInfo: PlanInfo | null = null;
  let productsCount = 0;
  let isTokenValid = false;

  try {
    // 1. Buscar la tienda activa del usuario en Supabase
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

    // 2. Perfil onboarding y nombre completo real
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("onboarding_completed, full_name")
      .eq("id", user.id)
      .maybeSingle();

    onboardingCompleted = profile?.onboarding_completed ?? false;
    fullName = profile?.full_name ?? "";

    // 3. Cantidad de widgets activos
    const { count: widgetsCount } = await supabaseAdmin
      .from("widgets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    activeWidgetsCount = widgetsCount ?? 0;

    // 4. Construir plan si existe tienda
    if (store) {
      const planData: StorePlanData = {
        store_id: store.store_id,
        user_id: store.user_id,
        trial_started_at: store.trial_started_at ?? null,
        trial_ends_at: store.trial_ends_at ?? null,
        plan_status: (store.plan_status as RawPlanStatus | null) ?? null,
        plan_active_until: store.plan_active_until ?? null,
        last_payment_at: store.last_payment_at ?? null,
        months_active: Number(store.months_active || 1),
        feedback_shown: store.feedback_shown ?? false,
      };

      planInfo = buildPlanInfo(planData);
    }

    // 5. PRUEBA DE VIDA REAL CON TIENDANUBE
    if (store?.store_id && store?.access_token) {
      try {
        productsCount = await getProductsCount(
          store.store_id,
          store.access_token
        );
        // Si Tiendanube respondió correctamente, la conexión es REAL
        isTokenValid = true;
      } catch (e) {
        console.error("Token de Tiendanube rechazado o app desinstalada:", e);
        productsCount = 0;
        isTokenValid = false;
      }
    }
  } catch (err: unknown) {
    console.error("[Dashboard Query Exception]:", err);
  }

  // REGLA ABSOLUTA: Solo se considera conectada si Tiendanube validó el token en tiempo real
  const storeData = (store && isTokenValid)
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
      fullName={fullName}
      store={storeData}
      productsCount={productsCount}
      activeWidgetsCount={activeWidgetsCount}
      onboardingCompleted={onboardingCompleted}
      plan={planSerialized}
    />
  );
}
