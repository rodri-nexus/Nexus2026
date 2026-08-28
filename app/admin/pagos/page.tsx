import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import AdminPagosClient from "./AdminPagosClient";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevuxapp@gmail.com";

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

export interface AdminStats {
  pending: number;
  approved: number;
  rejected: number;
  totalRevenue: number;
}

export default async function AdminPagosPage() {
  // 1. Auth check
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Guard estricto de Admin
  const userEmail = (user.email || "").toLowerCase();
  if (userEmail !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  // 3. Traer lista de pagos
  let paymentsList: any[] = [];
  try {
    const { data: payments, error: paymentsError } = await supabaseAdmin
      .from("payments")
      .select(
        "id, store_id, user_id, amount, payment_method, receipt_url, transfer_reference, status, admin_notes, created_at, approved_at, approved_by, rejected_at, rejected_reason"
      )
      .order("created_at", { ascending: false });

    if (paymentsError) {
      console.error("[AdminPagosPage] Error trayendo pagos:", paymentsError);
    } else if (payments) {
      paymentsList = payments;
    }
  } catch (err) {
    console.error("[AdminPagosPage] Exception trayendo pagos:", err);
  }

  // 4. Enriquecer datos en paralelo para máxima velocidad
  const enriched: PaymentWithUser[] = await Promise.all(
    paymentsList.map(async (p) => {
      let emailFound = "";
      let months_active = 0;
      let plan_active_until: string | null = null;

      try {
        const [userRes, storeRes] = await Promise.all([
          supabaseAdmin.auth.admin.getUserById(p.user_id),
          supabaseAdmin
            .from("stores")
            .select("months_active, plan_active_until")
            .eq("store_id", p.store_id)
            .maybeSingle(),
        ]);

        if (userRes?.data?.user?.email) {
          emailFound = userRes.data.user.email;
        }

        if (storeRes?.data) {
          months_active = storeRes.data.months_active || 0;
          plan_active_until = storeRes.data.plan_active_until || null;
        }
      } catch (e) {
        console.error(`[AdminPagosPage] Error enriqueciendo pago ${p.id}:`, e);
      }

      return {
        id: p.id,
        store_id: Number(p.store_id) || 0,
        user_id: p.user_id,
        user_email: emailFound || "Email no disponible",
        amount: Number(p.amount) || 0,
        payment_method: p.payment_method || "transferencia",
        receipt_url: p.receipt_url ?? null,
        transfer_reference: p.transfer_reference ?? null,
        status: p.status || "pending",
        admin_notes: p.admin_notes ?? null,
        created_at: p.created_at,
        approved_at: p.approved_at ?? null,
        approved_by: p.approved_by ?? null,
        rejected_at: p.rejected_at ?? null,
        rejected_reason: p.rejected_reason ?? null,
        store_months_active: months_active,
        store_plan_active_until: plan_active_until,
      };
    })
  );

  // 5. Contadores calculados de forma segura
  const stats: AdminStats = {
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
