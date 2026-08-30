// app/api/plan/upload-receipt/route.ts
import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  console.log("🔵 [/api/plan/upload-receipt] INICIO");

  try {
    // 1. Verificar autenticación del usuario
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ [upload-receipt] Sin usuario autenticado:", authError);
      return NextResponse.json(
        { error: "No autenticado. Volvé a iniciar sesión." },
        { status: 401 }
      );
    }

    // 2. Leer FormData de forma segura
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error leyendo FormData";
      console.error("❌ [upload-receipt] FormData inválido:", msg);
      return NextResponse.json(
        { error: "Formato de archivo inválido" },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;
    const transferReference =
      (formData.get("transfer_reference") as string | null) || null;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    // 3. Validaciones de tamaño y formato
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el límite permitido de 5 MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Formato no permitido. Subí una imagen (JPG, PNG, WebP) o un documento PDF.",
        },
        { status: 400 }
      );
    }

    // 4. Traer la tienda activa del usuario
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
        { error: "No se encontró una tienda vinculada a esta cuenta" },
        { status: 404 }
      );
    }

    // 5. Subir el archivo al bucket en Supabase Storage
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "bin";
    const safeExt = extension.toLowerCase().replace(/[^a-z0-9]/g, "");
    const filePath = `${user.id}/comprobante-${timestamp}.${safeExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("payment-receipts")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ [upload-receipt] Error subiendo archivo:", uploadError);
      return NextResponse.json(
        { error: `Error subiendo archivo: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log("✅ [upload-receipt] Archivo subido correctamente:", filePath);

    // 6. Crear registro en la tabla payments
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

      // Rollback: intentar borrar el archivo subido si falla la DB
      try {
        await supabaseAdmin.storage
          .from("payment-receipts")
          .remove([filePath]);
      } catch (rollbackErr: unknown) {
        console.error("Error en rollback:", rollbackErr);
      }

      return NextResponse.json(
        {
          error: `Error al registrar el pago: ${paymentError.message}`,
        },
        { status: 500 }
      );
    }

    console.log("✅ [upload-receipt] Registro de pago creado:", payment.id);

    // 7. Actualizar timestamp de la tienda
    const { error: storeUpdateErr } = await supabaseAdmin
      .from("stores")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", store.store_id);

    if (storeUpdateErr) {
      console.warn("Aviso actualizando timestamp de store:", storeUpdateErr);
    }

    // 8. Notificar al admin por email (alerta instantánea a nevuxapp@gmail.com)
    try {
      await sendNewPaymentAlert({
        customerEmail: user.email || "sin-email",
        amount: 30000,
        transferReference,
        paymentId: payment.id,
        storeId: store.store_id,
      });
    } catch (emailErr: unknown) {
      console.error("⚠️ [upload-receipt] Error enviando email admin:", emailErr);
    }

    console.log(`✅ [upload-receipt] OK finalizado: user=${user.email}, payment=${payment.id}`);

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      redirect: "/plan/pendiente",
    });
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("❌ [upload-receipt] Error CATCH:", errorMsg);
    return NextResponse.json(
      {
        error: `Error interno: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
  }
