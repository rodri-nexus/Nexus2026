import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import ExpiradoClient from "./ExpiradoClient";

export const dynamic = "force-dynamic";

export default async function ExpiradoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let redirectTo: string | null = null;
  let planData = null;

  try {
    planData = await getPlanForUser(user.id);

    // Sin tienda conectada
    if (!planData) {
      redirectTo = "/dashboard";
    } else {
      const { plan } = planData;

      // Si puede usar la app (trial activo o plan activo), no mostrar paywall
      if (plan.canUseApp) {
        redirectTo = "/dashboard";
      } else if (plan.needsFeedback) {
        // Si no respondió el feedback inicial todavía, mandarlo ahí
        redirectTo = "/plan/feedback";
      } else {
        // Si ya tiene un pago pendiente de revisión, mandarlo a la pantalla de espera
        const { data: payment } = await supabaseAdmin
          .from("payments")
          .select("id, status")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (payment) {
          redirectTo = "/plan/pendiente";
        }
      }
    }
  } catch (err) {
    console.error("[ExpiradoPage Server Error]:", err);
    redirectTo = "/dashboard";
  }

  if (redirectTo) {
    redirect(redirectTo);
  }

  const plan = planData!.plan;

  return (
    <ExpiradoClient
      email={user.email ?? ""}
      trialEndedAt={plan.trialEndsAt?.toISOString() ?? null}
      monthsActive={plan.monthsActive}
    />
  );
}
