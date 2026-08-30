// app/plan/pagar/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import PagarClient from "./PagarClient";

export const dynamic = "force-dynamic";

interface PendingPaymentRecord {
  id: string;
  status: string;
  created_at: string;
}

export default async function PagarPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let redirectTo: string | null = null;
  let hasPendingPayment = false;

  try {
    const planData = await getPlanForUser(user.id);

    // Si no tiene tienda conectada
    if (!planData) {
      redirectTo = "/dashboard";
    } else {
      const { plan } = planData;

      // Si NO necesita pagar (está en trial activo o ya tiene plan activo)
      if (plan.canUseApp) {
        redirectTo = "/dashboard";
      } else if (plan.needsFeedback) {
        // Si todavía no completó el feedback obligatorio
        redirectTo = "/plan/feedback";
      } else {
        // Verificar si ya tiene un comprobante pendiente de revisión
        const { data: pendingData } = await supabaseAdmin
          .from("payments")
          .select("id, status, created_at")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pendingData) {
          hasPendingPayment = true;
        }
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    console.error("[PagarPage Server Error]:", msg);
    redirectTo = "/dashboard";
  }

  // Redirecciones limpias fuera del try/catch
  if (redirectTo) {
    redirect(redirectTo);
  }

  if (hasPendingPayment) {
    redirect("/plan/pendiente");
  }

  return <PagarClient email={user.email ?? ""} />;
}
