// app/api/ai/voice-search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface VoiceSearchPayload {
  store_id: number;
  is_active?: boolean;
  position?: "bottom-right" | "bottom-left" | "floating-center";
  button_color?: string;
  listening_text?: string;
  placeholder_text?: string;
  language?: "es-AR" | "pt-BR" | "en-US";
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
   ENDPOINT GET: CONSULTAR AJUSTES DE VOZ
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id") || searchParams.get("storeId");

    if (!storeIdParam) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    const storeId = parseInt(storeIdParam, 10);

    const { data: settings, error } = await supabase
      .from("store_voice_search_settings")
      .select("*")
      .eq("user_id", user.id)
      .eq("store_id", storeId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return jsonResponse({
      settings: settings || {
        is_active: true,
        position: "bottom-right",
        button_color: "#10B981",
        listening_text: "Escuchando... Decí lo que buscás",
        placeholder_text: "Buscá por voz en la tienda...",
        language: "es-AR",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}

/* ═══════════════════════════════════════════
   ENDPOINT POST: GUARDAR AJUSTES DE VOZ
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

    const body: VoiceSearchPayload = await req.json().catch(() => ({}));
    const {
      store_id,
      is_active = true,
      position = "bottom-right",
      button_color = "#10B981",
      listening_text = "Escuchando... Decí lo que buscás",
      placeholder_text = "Buscá por voz en la tienda...",
      language = "es-AR",
    } = body;

    if (!store_id) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    // Validar tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return jsonResponse({ error: "Tienda no autorizada" }, 403);
    }

    const nowIso = new Date().toISOString();

    const { data: saved, error } = await supabase
      .from("store_voice_search_settings")
      .upsert(
        {
          user_id: user.id,
          store_id,
          is_active,
          position,
          button_color,
          listening_text,
          placeholder_text,
          language,
          updated_at: nowIso,
        },
        { onConflict: "store_id" }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return jsonResponse({
      success: true,
      settings: saved,
      message: "Configuración de Búsqueda por Voz guardada con éxito",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}
