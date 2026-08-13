// app/admin/pagos/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import AdminPagosClient from "./AdminPagosClient";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevux340@gmail.com";

export interface PaymentWithUser {
  id: string;
  store_id: number;
  user_id: string;
  user_email: string;
  amount: number;
  payment_method: string;
  receipt_url: string | null;
  transfer_reference: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejected_at: string | null;
  rejected_reason: string | null;
  store_months_active: number;
  store_plan_active_until: string | null;
}

export default async function AdminPagosPage() {
  // 1. Auth
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Guard admin
  const userEmail = (user.email || "").toLowerCase();
  if (userEmail !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  // 3. Traer todos los pagos
  const { data: payments, error: paymentsError } = await supabaseAdmin
    .from("payments")
    .select(
      "id, store_id, user_id, amount, payment_method, receipt_url, transfer_reference, status, admin_notes, created_at, approved_at, approved_by, rejected_at, rejected_reason"
    )
    .order("created_at", { ascending: false });

  if (paymentsError) {
    console.error("Error trayendo pagos:", paymentsError);
  }

  const paymentsList = payments || [];

  // 4. Enriquecer con datos del usuario (email) y de la tienda (months_active, plan_active_until)
  const enriched: PaymentWithUser[] = [];

  for (const p of paymentsList) {
    // Traer email del usuario
    let userEmail = "";
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
        p.user_id
      );
      userEmail = userData?.user?.email || "";
    } catch (e) {
      console.error(`Error trayendo user ${p.user_id}:`, e);
    }

    // Traer datos de la tienda
    let months_active = 0;
    let plan_active_until: string | null = null;
    try {
      const { data: storeData } = await supabaseAdmin
        .from("stores")
        .select("months_active, plan_active_until")
        .eq("store_id", p.store_id)
        .maybeSingle();

      if (storeData) {
        months_active = storeData.months_active || 0;
        plan_active_until = storeData.plan_active_until;
      }
    } catch (e) {
      console.error(`Error trayendo store ${p.store_id}:`, e);
    }

    enriched.push({
      ...p,
      user_email: userEmail,
      store_months_active: months_active,
      store_plan_active_until: plan_active_until,
    });
  }

  // 5. Contadores por estado
  const stats = {
    pending: enriched.filter((p) => p.status === "pending").length,
    approved: enriched.filter((p) => p.status === "approved").length,
    rejected: enriched.filter((p) => p.status === "rejected").length,
    totalRevenue: enriched
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  return (
    <AdminPagosClient
      adminEmail={user.email ?? ""}
      payments={enriched}
      stats={stats}
    />
  );
}
