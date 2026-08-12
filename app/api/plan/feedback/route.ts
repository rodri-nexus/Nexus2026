// app/api/plan/feedback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { liked } = body;

    if (typeof liked !== "boolean") {
      return NextResponse.json(
        { error: "El campo 'liked' es requerido y debe ser boolean" },
        { status: 400 }
      );
    }

    // Traer la tienda del usuario
    const { data: store, error: storeError } = await supabaseAdmin
      .from("stores")
      .select("store_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (storeError || !store) {
      return NextResponse.json(
        { error: "No se encontró tienda vinculada" },
        { status: 404 }
      );
    }

    // Guardar el feedback inicial en la tabla feedback
    const { error: feedbackError } = await supabaseAdmin
      .from("feedback")
      .insert({
        store_id: store.store_id,
        user_id: user.id,
        user_email: user.email,
        liked_app: liked,
      });

    if (feedbackError) {
      console.error("Error guardando feedback:", feedbackError);
      return NextResponse.json(
        { error: "Error al guardar feedback" },
        { status: 500 }
      );
    }

    // Marcar en la tienda que ya se mostró el feedback
    const { error: updateError } = await supabaseAdmin
      .from("stores")
      .update({
        feedback_shown: true,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", store.store_id);

    if (updateError) {
      console.error("Error actualizando feedback_shown:", updateError);
    }

    console.log(
      `📝 Feedback inicial guardado: user=${user.email}, liked=${liked}`
    );

    return NextResponse.json({
      success: true,
      redirect: liked ? "/plan/expirado" : "/plan/opinion",
    });
  } catch (error) {
    console.error("Error en /api/plan/feedback:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
      }
