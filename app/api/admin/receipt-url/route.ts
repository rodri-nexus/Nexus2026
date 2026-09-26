// app/api/admin/receipt-url/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   EMAILS CON PERMISOS DE ADMINISTRADOR
═══════════════════════════════════════════ */
const ADMIN_EMAILS = [
  "nevux340@gmail.com",
  "nevuxapp@gmail.com",
  "rodrigospehgt@gmail.com",
];

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
        { error: "No autenticado. Volvé a iniciar sesión." },
        { status: 401 }
      );
    }

    const userEmail = (user.email || "").toLowerCase();
    const isAdmin = ADMIN_EMAILS.some((e) => e.toLowerCase() === userEmail);

    if (!isAdmin) {
      console.error("❌ [receipt-url] Acceso denegado a no admin:", userEmail);
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

    // Si ya es una URL completa (http/https), devolverla directamente
    if (payment.receipt_url.startsWith("http://") || payment.receipt_url.startsWith("https://")) {
      return NextResponse.json({
        success: true,
        url: payment.receipt_url,
        expiresIn: URL_EXPIRES_SECONDS,
      });
    }

    // 4. Generar signed URL usando el SDK Admin
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from("payment-receipts")
      .createSignedUrl(payment.receipt_url, URL_EXPIRES_SECONDS);

    if (signedError || !signedData?.signedUrl) {
      console.error("❌ [receipt-url] Error firmando URL:", signedError);
      
      // Fallback a Public URL si falla la firma
      const { data: publicData } = supabaseAdmin.storage
        .from("payment-receipts")
        .getPublicUrl(payment.receipt_url);

      if (publicData?.publicUrl) {
        return NextResponse.json({
          success: true,
          url: publicData.publicUrl,
          expiresIn: URL_EXPIRES_SECONDS,
        });
      }

      return NextResponse.json(
        {
          error: `Error generando URL: ${signedError?.message || "desconocido"}`,
        },
        { status: 500 }
      );
    }

    console.log(`✅ [receipt-url] URL firmada OK para payment=${paymentId}`);

    return NextResponse.json({
      success: true,
      url: signedData.signedUrl,
      expiresIn: URL_EXPIRES_SECONDS,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Desconocido";
    console.error("❌ [receipt-url] CATCH:", errorMsg);
    return NextResponse.json(
      { error: `Error interno: ${errorMsg}` },
      { status: 500 }
    );
  }
          }
