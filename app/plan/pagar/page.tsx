// app/plan/pagar/page.tsx
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

  const planData = await getPlanForUser(user.id);

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
  const { data: pendingPayment } = await supabaseAdmin
    .from("payments")
    .select("id, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pendingPayment) {
    redirect("/plan/pendiente");
  }

  return <PagarClient email={user.email ?? ""} />;
    }
