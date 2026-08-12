// app/plan/opinion/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import OpinionClient from "./OpinionClient";

export const dynamic = "force-dynamic";

export default async function OpinionPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const planData = await getPlanForUser(user.id);

  // Sin tienda conectada
  if (!planData) {
    redirect("/dashboard");
  }

  const { plan, store } = planData;

  // Si está en trial activo o plan pago activo, no debería estar acá
  if (plan.canUseApp) {
    redirect("/dashboard");
  }

  // Si no respondió aún el feedback inicial, mandarlo a esa pantalla
  if (plan.needsFeedback) {
    redirect("/plan/feedback");
  }

  // Verificar que efectivamente haya respondido "NO" (liked_app = false)
  const { data: lastFeedback } = await supabaseAdmin
    .from("feedback")
    .select("liked_app")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Si dijo SÍ (o no hay respuesta), no corresponde este flujo → mandar a pago
  if (!lastFeedback || lastFeedback.liked_app === true) {
    redirect("/plan/expirado");
  }

  return <OpinionClient email={user.email ?? ""} />;
    }
