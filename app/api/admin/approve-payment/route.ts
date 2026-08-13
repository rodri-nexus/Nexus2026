// app/api/admin/approve-payment/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevux340@gmail.com";
const PLAN_DURATION_DAYS = 30;

export async function POST(request: Request) {
  console.log("🔵 [admin/approve-payment] INICIO");

  try {
    // 1. Auth + guard admin
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ [approve] Sin usuario");
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const email = (user.email || "").toLowerCase();
    if (email !== ADMIN_EMAIL) {
      console.error("❌ [approve] No es admin:", email);
      return NextResponse.json(
        { error: "Sin permisos" },
        { status: 403 }
      );
    }

    // 2. Body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Body inválido" },
        { status: 400 }
      );
    }

    const { paymentId, adminNotes } = body;
    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json(
        { error: "paymentId requerido" },
        { status: 400 }
      );
    }

    // 3. Traer el pago
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, store_id, user_id, status, amount")
      .eq("id", paymentId)
      .maybeSingle();

    if (paymentError) {
      console.error("❌ [approve] Error buscando payment:", paymentError);
      return NextResponse.json(
        { error: paymentError.message },
        { status: 500 }
      );
    }

    if (!payment) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    if (payment.status !== "pending") {
      return NextResponse.json(
        { error: `Este pago ya fue procesado (estado: ${payment.status})` },
        { status: 400 }
      );
    }

    // 4. Traer la tienda para calcular nueva fecha
    const { data: store, error: storeError } = await supabaseAdmin
      .from("stores")
      .select("store_id, plan_active_until, months_active")
      .eq("store_id", payment.store_id)
      .maybeSingle();

    if (storeError || !store) {
      console.error("❌ [approve] Error buscando store:", storeError);
      return NextResponse.json(
        { error: "Tienda no encontrada" },
        { status: 404 }
      );
    }

    // 5. Calcular nueva fecha de vencimiento
    // Si el plan actual todavía está vigente, se le suman 30 días desde ese vencimiento.
    // Si venció, se cuenta desde hoy.
    const now = new Date();
    const currentEnd = store.plan_active_until
      ? new Date(store.plan_active_until)
      : null;

    const baseDate = currentEnd && currentEnd > now ? currentEnd : now;
    const newPlanEnd = new Date(baseDate);
    newPlanEnd.setDate(newPlanEnd.getDate() + PLAN_DURATION_DAYS);

    console.log("🔵 [approve] Nueva fecha de vencimiento:", newPlanEnd.toISOString());

    // 6. Actualizar el pago como aprobado
    const { error: updatePaymentError } = await supabaseAdmin
      .from("payments")
      .update({
        status: "approved",
        approved_at: now.toISOString(),
        approved_by: email,
        admin_notes: adminNotes || null,
      })
      .eq("id", paymentId);

    if (updatePaymentError) {
      console.error("❌ [approve] Error actualizando payment:", updatePaymentError);
      return NextResponse.json(
        { error: `Error actualizando pago: ${updatePaymentError.message}` },
        { status: 500 }
      );
    }

    // 7. Actualizar la tienda: activar plan
    const newMonthsActive = (store.months_active || 0) + 1;

    const { error: updateStoreError } = await supabaseAdmin
      .from("stores")
      .update({
        plan_status: "active",
        plan_active_until: newPlanEnd.toISOString(),
        last_payment_at: now.toISOString(),
        months_active: newMonthsActive,
        updated_at: now.toISOString(),
      })
      .eq("store_id", payment.store_id);

    if (updateStoreError) {
      console.error("❌ [approve] Error actualizando store:", updateStoreError);

      // Rollback del payment (sin .catch, con try/catch)
      try {
        await supabaseAdmin
          .from("payments")
          .update({
            status: "pending",
            approved_at: null,
            approved_by: null,
            admin_notes: null,
          })
          .eq("id", paymentId);
      } catch (rollbackErr) {
        console.error("Error en rollback:", rollbackErr);
      }

      return NextResponse.json(
        { error: `Error activando plan: ${updateStoreError.message}` },
        { status: 500 }
      );
    }

    console.log(
      `✅ [approve] Pago aprobado: payment=${paymentId}, store=${payment.store_id}, meses=${newMonthsActive}`
    );

    return NextResponse.json({
      success: true,
      paymentId,
      newPlanEnd: newPlanEnd.toISOString(),
      monthsActive: newMonthsActive,
    });
  } catch (error: any) {
    console.error("❌ [approve] CATCH:", error);
    return NextResponse.json(
      { error: `Error interno: ${error?.message || "desconocido"}` },
      { status: 500 }
    );
  }
  }
