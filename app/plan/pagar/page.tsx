import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import PagarClient from "./PagarClient";

export const dynamic = "force-dynamic";

export default async function PagarPage() {
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

    // Si no tiene tienda conectada
    if (!planData) {
      redirect("/dashboard");
    }

    const { plan } = planData;

    // Si NO necesita pagar (está en trial activo o ya tiene plan activo)
    if (plan.canUseApp) {
      redirect("/dashboard");
    }

    // Si todavía no vio el feedback
    if (plan.needsFeedback) {
      redirect("/plan/feedback");
    }

    // Verificar si ya tiene un pago pendiente → mandarlo a la pantalla de pendiente
    const { data } = await supabaseAdmin
      .from("payments")
      .select("id, status, created_at")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    pendingPayment = data;
  } catch (err) {
    console.error("[PagarPage Server Error]:", err);
    // Ante un error imprevisto del servidor, redirigimos de forma segura
    redirect("/dashboard");
  }

  if (pendingPayment) {
    redirect("/plan/pendiente");
  }

  return <PagarClient email={user.email ?? ""} />;
                  }
