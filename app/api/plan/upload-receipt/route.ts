// app/api/plan/upload-receipt/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendNewPaymentAlert } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export async function POST(request: Request) {
  console.log("🔵 [/api/plan/upload-receipt] INICIO");

  try {
    // 1. Auth
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("🔵 [upload-receipt] user:", user?.id, "authError:", authError);

    if (authError || !user) {
      console.error("❌ [upload-receipt] Sin usuario");
      return NextResponse.json(
        { error: "No autenticado. Volvé a iniciar sesión." },
        { status: 401 }
      );
    }

    // 2. Leer FormData
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (e) {
      console.error("❌ [upload-receipt] FormData inválido:", e);
      return NextResponse.json(
        { error: "Formato de archivo inválido" },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;
    const transferReference =
      (formData.get("transfer_reference") as string | null) || null;

    console.log("🔵 [upload-receipt] file:", file?.name, file?.size, file?.type);

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    // 3. Validaciones del archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera los 5 MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Formato no permitido. Subí una imagen (JPG, PNG, WebP) o un PDF.",
        },
        { status: 400 }
      );
    }

    // 4. Traer la tienda del usuario
    console.log("🔵 [upload-receipt] Buscando store para user:", user.id);
    const { data: store, error: storeError } = await supabaseAdmin
      .from("stores")
      .select("store_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (storeError) {
      console.error("❌ [upload-receipt] Error buscando store:", storeError);
      return NextResponse.json(
        { error: `Error buscando tienda: ${storeError.message}` },
        { status: 500 }
      );
    }

    if (!store) {
      console.error("❌ [upload-receipt] No se encontró tienda");
      return NextResponse.json(
        { error: "No se encontró tienda vinculada" },
        { status: 404 }
      );
    }

    // 5. Subir el archivo al bucket
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "bin";
    const safeExt = extension.toLowerCase().replace(/[^a-z0-9]/g, "");
    const filePath = `${user.id}/comprobante-${timestamp}.${safeExt}`;

    console.log("🔵 [upload-receipt] Subiendo a:", filePath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("payment-receipts")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ [upload-receipt] Error subiendo:", uploadError);
      return NextResponse.json(
        { error: `Error subiendo archivo: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log("✅ [upload-receipt] Archivo subido");

    // 6. Crear registro en payments
    console.log("🔵 [upload-receipt] Insertando en payments...");
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        store_id: store.store_id,
        user_id: user.id,
        amount: 30000,
        payment_method: "naranja_x",
        receipt_url: filePath,
        transfer_reference: transferReference,
        status: "pending",
      })
      .select()
      .single();

    if (paymentError) {
      console.error("❌ [upload-receipt] Error insertando payment:", paymentError);

      // Rollback: borrar el archivo subido
      await supabaseAdmin.storage
        .from("payment-receipts")
        .remove([filePath])
        .catch((e) => console.error("Error en rollback:", e));

      return NextResponse.json(
        {
          error: `Error al registrar el pago: ${paymentError.message}`,
        },
        { status: 500 }
      );
    }

    console.log("✅ [upload-receipt] Payment creado:", payment.id);

    // 7. Actualizar el plan_status de la tienda a "feedback_pending"
    // (para que el guard sepa que está esperando aprobación)
    const { error: updateError } = await supabaseAdmin
      .from("stores")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", store.store_id);

    if (updateError) {
      console.error("⚠️ [upload-receipt] Error actualizando store:", updateError);
      // No es crítico, seguimos
    }

    // 8. Notificar al admin por email (no bloquea el flujo si falla)
    try {
      await sendNewPaymentAlert({
        customerEmail: user.email || "sin-email",
        amount: 30000,
        transferReference,
        paymentId: payment.id,
        storeId: store.store_id,
      });
    } catch (emailErr) {
      console.error("⚠️ [upload-receipt] Error enviando email admin:", emailErr);
      // No es crítico, seguimos
    }

    console.log(`✅ [upload-receipt] OK: user=${user.email}, payment=${payment.id}`);

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      redirect: "/plan/pendiente",
    });
  } catch (error: any) {
    console.error("❌ [upload-receipt] Error CATCH:", error);
    return NextResponse.json(
      {
        error: `Error interno: ${error?.message || "desconocido"}`,
      },
      { status: 500 }
    );
  }
      }
