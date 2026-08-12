// app/api/plan/feedback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  console.log("🔵 [/api/plan/feedback] INICIO");

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("🔵 [/api/plan/feedback] user:", user?.id, "authError:", authError);

    if (authError || !user) {
      console.error("❌ [/api/plan/feedback] Sin usuario autenticado");
      return NextResponse.json(
        { error: "No autenticado. Por favor volvé a iniciar sesión." },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("❌ [/api/plan/feedback] Body inválido:", e);
      return NextResponse.json(
        { error: "Body inválido" },
        { status: 400 }
      );
    }

    const { liked } = body;
    console.log("🔵 [/api/plan/feedback] liked:", liked);

    if (typeof liked !== "boolean") {
      return NextResponse.json(
        { error: "El campo 'liked' es requerido y debe ser boolean" },
        { status: 400 }
      );
    }

    // Traer la tienda del usuario
    console.log("🔵 [/api/plan/feedback] Buscando store para user_id:", user.id);
    const { data: store, error: storeError } = await supabaseAdmin
      .from("stores")
      .select("store_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    console.log("🔵 [/api/plan/feedback] store:", store, "storeError:", storeError);

    if (storeError) {
      console.error("❌ [/api/plan/feedback] Error buscando store:", storeError);
      return NextResponse.json(
        { error: `Error buscando tienda: ${storeError.message}` },
        { status: 500 }
      );
    }

    if (!store) {
      console.error("❌ [/api/plan/feedback] No se encontró tienda para user:", user.id);
      return NextResponse.json(
        { error: "No se encontró tienda vinculada" },
        { status: 404 }
      );
    }

    // Guardar el feedback inicial en la tabla feedback
    console.log("🔵 [/api/plan/feedback] Insertando feedback...");
    const { data: insertedFeedback, error: feedbackError } = await supabaseAdmin
      .from("feedback")
      .insert({
        store_id: store.store_id,
        user_id: user.id,
        user_email: user.email,
        liked_app: liked,
      })
      .select()
      .single();

    console.log("🔵 [/api/plan/feedback] insertedFeedback:", insertedFeedback);

    if (feedbackError) {
      console.error("❌ [/api/plan/feedback] Error insertando feedback:", feedbackError);
      return NextResponse.json(
        {
          error: `Error al guardar feedback: ${feedbackError.message}`,
          details: feedbackError,
        },
        { status: 500 }
      );
    }

    // Marcar en la tienda que ya se mostró el feedback
    console.log("🔵 [/api/plan/feedback] Actualizando feedback_shown...");
    const { error: updateError } = await supabaseAdmin
      .from("stores")
      .update({
        feedback_shown: true,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", store.store_id);

    if (updateError) {
      console.error("❌ [/api/plan/feedback] Error actualizando feedback_shown:", updateError);
    }

    console.log(
      `✅ [/api/plan/feedback] OK: user=${user.email}, liked=${liked}`
    );

    return NextResponse.json({
      success: true,
      redirect: liked ? "/plan/expirado" : "/plan/opinion",
    });
  } catch (error: any) {
    console.error("❌ [/api/plan/feedback] Error CATCH:", error);
    return NextResponse.json(
      {
        error: `Error interno: ${error?.message || "desconocido"}`,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
  }
