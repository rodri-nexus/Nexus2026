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

  let redirectTo: string | null = null;
  let planData = null;

  try {
    planData = await getPlanForUser(user.id);

    // Si no tiene tienda conectada, mandarlo al dashboard
    if (!planData) {
      redirectTo = "/dashboard";
    } else {
      const { plan } = planData;

      // Si NO está en feedback_pending, no debería estar acá
      if (!plan.needsFeedback) {
        if (plan.canUseApp) {
          redirectTo = "/dashboard";
        } else if (plan.needsPayment) {
          redirectTo = "/plan/expirado";
        } else {
          redirectTo = "/dashboard";
        }
      }
    }
  } catch (err) {
    console.error("[FeedbackPage Server Error]:", err);
    redirectTo = "/dashboard";
  }

  if (redirectTo) {
    redirect(redirectTo);
  }

  return <FeedbackClient email={user.email ?? ""} />;
}
