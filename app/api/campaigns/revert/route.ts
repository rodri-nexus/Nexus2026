// app/api/campaigns/revert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   HEADERS Y RESPUESTAS AUXILIARES
   (Declaradas al inicio para evitar hoisting - Regla #9)
═══════════════════════════════════════════ */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/* ═══════════════════════════════════════════
   ENDPOINT PRINCIPAL POST
═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const { store_id } = body;

    if (!store_id) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    // 1. Validar que la tienda pertenezca al usuario
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return jsonResponse({ error: "Tienda no encontrada o no autorizada" }, 403);
    }

    // 2. Obtener los snapshots originales guardados para esta tienda
    const { data: snapshots, error: snapError } = await supabase
      .from("campaign_snapshots")
      .select("*")
      .eq("user_id", user.id)
      .eq("store_id", store_id);

    if (snapError) {
      throw snapError;
    }

    const nowIso = new Date().toISOString();
    let widgetsRestored = 0;

    // 3. Restaurar widgets según los snapshots
    if (snapshots && snapshots.length > 0) {
      for (const snap of snapshots) {
        await supabase
          .from("widgets")
          .update({
            config: snap.original_config,
            is_active: snap.original_is_active,
            updated_at: nowIso,
          })
          .eq("id", snap.widget_id)
          .eq("user_id", user.id);

        widgetsRestored++;
      }

      // Borrar los snapshots restaurados
      await supabase
        .from("campaign_snapshots")
        .delete()
        .eq("user_id", user.id)
        .eq("store_id", store_id);
    } else {
      // Si no había snapshots (por ejemplo si no tenía ningún widget previo), desactivamos los widgets de campaña
      const campaignSlugs = [
        "cuenta-regresiva",
        "banner-deslizante",
        "badge-cupon",
        "ruleta-descuentos",
        "barra-progreso",
      ];

      await supabase
        .from("widgets")
        .update({
          is_active: false,
          updated_at: nowIso,
        })
        .eq("user_id", user.id)
        .eq("store_id", store_id)
        .in("widget_slug", campaignSlugs);
    }

    // 4. Eliminar registro de campaña activa
    await supabase
      .from("active_campaigns")
      .delete()
      .eq("user_id", user.id)
      .eq("store_id", store_id);

    return jsonResponse({
      success: true,
      widgetsRestored,
      message: "Modo especial desactivado. Tu tienda volvió a su estado original.",
    });
  } catch (error: unknown) {
    console.error("Error revirtiendo campaña:", error);
    const message = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: message }, 500);
  }
}
