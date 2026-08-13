// app/plan/pendiente/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPlanForUser } from "@/lib/plan";
import { supabaseAdmin } from "@/lib/supabase";
import PendienteClient from "./PendienteClient";

export const dynamic = "force-dynamic";

export default async function PendientePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const planData = await getPlanForUser(user.id);

  if (!planData) {
    redirect("/dashboard");
  }

  const { plan } = planData;

  // Si el plan ya está activo → al dashboard
  if (plan.canUseApp) {
    redirect("/dashboard");
  }

  // Traer el último pago del usuario
  const { data: lastPayment } = await supabaseAdmin
    .from("payments")
    .select("id, status, amount, payment_method, created_at, rejected_reason")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Si no hay ningún pago → mandar a pagar
  if (!lastPayment) {
    redirect("/plan/pagar");
  }

  // Si el último pago fue rechazado → mandar a pagar de nuevo (con contexto)
  if (lastPayment.status === "rejected") {
    redirect("/plan/pagar");
  }

  // Si el último pago fue aprobado pero el guard igual dice que no puede usar la app,
  // es un caso raro (probablemente el plan_active_until venció). Mandar a expirado.
  if (lastPayment.status === "approved") {
    redirect("/plan/expirado");
  }

  // Status "pending" → mostrar pantalla de espera
  return (
    <PendienteClient
      email={user.email ?? ""}
      paymentId={lastPayment.id}
      createdAt={lastPayment.created_at}
      amount={lastPayment.amount}
    />
  );
    }
