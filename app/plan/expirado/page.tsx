// app/plan/expirado/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
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

  const planData = await getPlanForUser(user.id);

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

  return (
    <ExpiradoClient
      email={user.email ?? ""}
      trialEndedAt={plan.trialEndsAt?.toISOString() ?? null}
      monthsActive={plan.monthsActive}
    />
  );
      }
