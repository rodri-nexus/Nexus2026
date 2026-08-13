// app/api/admin/reject-payment/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevux340@gmail.com";

export async function POST(request: Request) {
  console.log("🔵 [admin/reject-payment] INICIO");

  try {
    // 1. Auth + guard admin
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ [reject] Sin usuario");
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const email = (user.email || "").toLowerCase();
    if (email !== ADMIN_EMAIL) {
      console.error("❌ [reject] No es admin:", email);
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

    const { paymentId, reason, adminNotes } = body;

    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json(
        { error: "paymentId requerido" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim().length < 3) {
      return NextResponse.json(
        { error: "La razón del rechazo es obligatoria (mínimo 3 caracteres)" },
        { status: 400 }
      );
    }

    // 3. Traer el pago para validar estado
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, status")
      .eq("id", paymentId)
      .maybeSingle();

    if (paymentError) {
      console.error("❌ [reject] Error buscando payment:", paymentError);
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

    // 4. Marcar como rechazado
    const now = new Date();
    const { error: updateError } = await supabaseAdmin
      .from("payments")
      .update({
        status: "rejected",
        rejected_at: now.toISOString(),
        rejected_reason: reason.trim(),
        admin_notes: adminNotes || null,
      })
      .eq("id", paymentId);

    if (updateError) {
      console.error("❌ [reject] Error actualizando payment:", updateError);
      return NextResponse.json(
        { error: `Error rechazando pago: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log(
      `✅ [reject] Pago rechazado: payment=${paymentId}, razón="${reason.trim()}"`
    );

    return NextResponse.json({
      success: true,
      paymentId,
    });
  } catch (error: any) {
    console.error("❌ [reject] CATCH:", error);
    return NextResponse.json(
      { error: `Error interno: ${error?.message || "desconocido"}` },
      { status: 500 }
    );
  }
         }
