// app/api/plan/opinion/route.ts
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
    const { tags, comment } = body;

    // Validaciones
    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Los tags deben ser un array" },
        { status: 400 }
      );
    }

    if (typeof comment !== "string") {
      return NextResponse.json(
        { error: "El comentario debe ser un string" },
        { status: 400 }
      );
    }

    // Traer store del usuario
    const { data: store } = await supabaseAdmin
      .from("stores")
      .select("store_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!store) {
      return NextResponse.json(
        { error: "No se encontró tienda vinculada" },
        { status: 404 }
      );
    }

    // Buscar el feedback más reciente del usuario (el "NO" que ya guardó)
    const { data: lastFeedback } = await supabaseAdmin
      .from("feedback")
      .select("id, liked_app")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!lastFeedback) {
      return NextResponse.json(
        { error: "No se encontró feedback previo" },
        { status: 404 }
      );
    }

    // Actualizar el feedback con los tags y el comentario detallado
    const { error: updateError } = await supabaseAdmin
      .from("feedback")
      .update({
        reason_tags: tags,
        detailed_feedback: comment,
      })
      .eq("id", lastFeedback.id);

    if (updateError) {
      console.error("Error actualizando feedback detallado:", updateError);
      return NextResponse.json(
        { error: "Error al guardar feedback" },
        { status: 500 }
      );
    }

    console.log(
      `📝 Feedback detallado guardado: user=${user.email}, tags=${tags.join(",")}, comment_length=${comment.length}`
    );

    // TODO (PASO 4): Enviar email a rodrigospehgt04@gmail.com con el feedback
    // TODO (PASO 4): Enviar mensaje WhatsApp a +5493434163999
    // Por ahora se guarda en la BD y se puede consultar desde Supabase

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en /api/plan/opinion:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
      }
