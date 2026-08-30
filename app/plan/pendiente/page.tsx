// app/plan/pendiente/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import PendienteClient from "./PendienteClient";

export const dynamic = "force-dynamic";

interface DbPaymentRow {
  id: string;
  status: string;
  amount: number | null;
  payment_method: string | null;
  created_at: string;
  rejected_reason: string | null;
}

export default async function PendientePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let redirectTo: string | null = null;
  let lastPayment: DbPaymentRow | null = null;

  try {
    const planData = await getPlanForUser(user.id);

    if (!planData) {
      redirectTo = "/dashboard";
    } else {
      const { plan } = planData;

      // Si el plan ya está activo → al dashboard
      if (plan.canUseApp) {
        redirectTo = "/dashboard";
      } else {
        // Traer el último pago del usuario usando supabaseAdmin
        const { data: paymentData } = await supabaseAdmin
          .from("payments")
          .select("id, status, amount, payment_method, created_at, rejected_reason")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        lastPayment = paymentData as DbPaymentRow | null;
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    console.error("[PendientePage Server Error]:", msg);
    redirectTo = "/dashboard";
  }

  // Redirecciones seguras fuera del try/catch
  if (redirectTo) {
    redirect(redirectTo);
  }

  // Si no hay ningún pago → mandar a pagar
  if (!lastPayment) {
    redirect("/plan/pagar");
  }

  // Si el último pago fue rechazado → mandar a pagar de nuevo
  if (lastPayment.status === "rejected") {
    redirect("/plan/pagar");
  }

  // Si el último pago fue aprobado pero ya expiró → mandar a expirado
  if (lastPayment.status === "approved") {
    redirect("/plan/expirado");
  }

  // Status "pending" → mostrar pantalla de espera con datos seguros
  return (
    <PendienteClient
      email={user.email ?? ""}
      paymentId={lastPayment.id}
      createdAt={lastPayment.created_at}
      amount={Number(lastPayment.amount) || 30000}
    />
  );
        }
