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

  let planData = null;
  let pendingPayment = null;

  try {
    planData = await getPlanForUser(user.id);

    // Sin tienda conectada
    if (!planData) {
      redirect("/dashboard");
    }

    const { plan } = planData;

    // Si puede usar la app (trial activo o plan activo), no mostrar paywall
    if (plan.canUseApp) {
      redirect("/dashboard");
    }

    // Si no respondió el feedback inicial todavía, mandarlo ahí
    if (plan.needsFeedback) {
      redirect("/plan/feedback");
    }

    // Si ya tiene un pago pendiente de revisión, mandarlo a la pantalla de espera
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    pendingPayment = payment;
  } catch (err) {
    console.error("[ExpiradoPage Server Error]:", err);
    redirect("/dashboard");
  }

  if (pendingPayment) {
    redirect("/plan/pendiente");
  }

  const { plan } = planData;

  return (
    <ExpiradoClient
      email={user.email ?? ""}
      trialEndedAt={plan.trialEndsAt?.toISOString() ?? null}
      monthsActive={plan.monthsActive}
    />
  );
}
