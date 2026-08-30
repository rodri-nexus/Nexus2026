// app/api/nevuxbot/config/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface BotConfigPayload {
  is_active?: boolean;
  bot_name?: string;
  personality?: string;
  primary_color?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeIdParam = searchParams.get("storeId") || searchParams.get("store_id");

  // CASO 1: Consulta pública desde el widget en la tienda de Tiendanube
  if (storeIdParam) {
    try {
      const cleanStoreId = String(storeIdParam).trim();

      // Buscar coincidencia por store_id
      let { data: config, error } = await supabaseAdmin
        .from("bot_config")
        .select("store_id, is_active, bot_name, personality, primary_color")
        .eq("store_id", cleanStoreId)
        .maybeSingle();

      if (error) {
        console.error("Error consultando bot_config:", error);
      }

      // Si no encontró y es numérico, probar casting normalizado
      if (!config && !isNaN(Number(cleanStoreId))) {
        const numericRes = await supabaseAdmin
          .from("bot_config")
          .select("store_id, is_active, bot_name, personality, primary_color")
          .eq("store_id", String(Number(cleanStoreId)))
          .maybeSingle();
        if (numericRes.data) {
          config = numericRes.data;
        }
      }

      const activeState = config ? Boolean(config.is_active) : false;

      return NextResponse.json(
        {
          storeIdRequested: storeIdParam,
          foundStoreId: config?.store_id || null,
          config: {
            store_id: config?.store_id || cleanStoreId,
            is_active: activeState,
            bot_name: config?.bot_name || "Sofía",
            personality: config?.personality || "persuasivo",
            primary_color: config?.primary_color || "#10B981",
          },
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error de servidor";
      console.error("Error en GET público de bot_config:", errorMsg);
      return NextResponse.json(
        { error: "Error de servidor", details: errorMsg },
        { status: 500 }
      );
    }
  }

  // CASO 2: Consulta privada desde el Dashboard del comerciante
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: store } = await supabase
    .from("stores")
    .select("store_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!store) {
    return NextResponse.json(
      { error: "Tienda activa no encontrada" },
      { status: 404 }
    );
  }

  const { data: config } = await supabaseAdmin
    .from("bot_config")
    .select("*")
    .eq("store_id", String(store.store_id))
    .maybeSingle();

  return NextResponse.json({
    storeId: store.store_id,
    config: config || {
      store_id: String(store.store_id),
      is_active: false,
      bot_name: "Sofía",
      personality: "persuasivo",
      primary_color: "#10B981",
    },
  });
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: store } = await supabase
    .from("stores")
    .select("store_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!store) {
    return NextResponse.json(
      { error: "Tienda activa no encontrada" },
      { status: 404 }
    );
  }

  try {
    const body: BotConfigPayload = await req.json();
    const { is_active, bot_name, personality, primary_color } = body;

    const { data: updatedConfig, error } = await supabaseAdmin
      .from("bot_config")
      .upsert(
        {
          store_id: String(store.store_id),
          is_active: Boolean(is_active),
          bot_name: bot_name || "Sofía",
          personality: personality || "persuasivo",
          primary_color: primary_color || "#10B981",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "store_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error guardando bot_config:", error);
      return NextResponse.json(
        { error: "Error al guardar en la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error interno";
    console.error("Error en POST /api/nevuxbot/config:", errorMsg);
    return NextResponse.json(
      { error: "Error interno del servidor", details: errorMsg },
      { status: 500 }
    );
  }
  }
