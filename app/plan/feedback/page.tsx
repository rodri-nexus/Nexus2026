import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
import FeedbackClient from "./FeedbackClient";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let planData = null;

  try {
    planData = await getPlanForUser(user.id);

    // Si no tiene tienda conectada, mandarlo al dashboard
    if (!planData) {
      redirect("/dashboard");
    }

    const { plan } = planData;

    // Si NO está en feedback_pending, no debería estar acá
    if (!plan.needsFeedback) {
      // Si está en trial o plan activo, al dashboard
      if (plan.canUseApp) {
        redirect("/dashboard");
      }
      // Si necesita pagar, a la pantalla de expirado
      if (plan.needsPayment) {
        redirect("/plan/expirado");
      }
      // Fallback
      redirect("/dashboard");
    }
  } catch (err) {
    console.error("[FeedbackPage Server Error]:", err);
    redirect("/dashboard");
  }

  return <FeedbackClient email={user.email ?? ""} />;
}
