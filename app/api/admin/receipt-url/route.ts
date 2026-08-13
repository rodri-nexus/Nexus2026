// app/api/admin/receipt-url/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "nevux340@gmail.com";
const URL_EXPIRES_SECONDS = 60 * 60; // 1 hora

export async function POST(request: Request) {
  console.log("🔵 [admin/receipt-url] INICIO");

  try {
    // 1. Auth + guard admin
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ [receipt-url] Sin usuario");
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const email = (user.email || "").toLowerCase();
    if (email !== ADMIN_EMAIL) {
      console.error("❌ [receipt-url] No es admin:", email);
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

    const { paymentId } = body;
    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json(
        { error: "paymentId requerido" },
        { status: 400 }
      );
    }

    // 3. Traer el receipt_url del pago
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, receipt_url")
      .eq("id", paymentId)
      .maybeSingle();

    if (paymentError) {
      console.error("❌ [receipt-url] Error buscando payment:", paymentError);
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

    if (!payment.receipt_url) {
      return NextResponse.json(
        { error: "Este pago no tiene comprobante adjunto" },
        { status: 404 }
      );
    }

    // 4. Generar signed URL
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from("payment-receipts")
      .createSignedUrl(payment.receipt_url, URL_EXPIRES_SECONDS);

    if (signedError || !signedData) {
      console.error("❌ [receipt-url] Error firmando URL:", signedError);
      return NextResponse.json(
        {
          error: `Error generando URL: ${signedError?.message || "desconocido"}`,
        },
        { status: 500 }
      );
    }

    console.log(`✅ [receipt-url] URL firmada para payment=${paymentId}`);

    return NextResponse.json({
      success: true,
      url: signedData.signedUrl,
      expiresIn: URL_EXPIRES_SECONDS,
    });
  } catch (error: any) {
    console.error("❌ [receipt-url] CATCH:", error);
    return NextResponse.json(
      { error: `Error interno: ${error?.message || "desconocido"}` },
      { status: 500 }
    );
  }
  }
