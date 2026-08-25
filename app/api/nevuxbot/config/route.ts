import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase-server";
import { createClient as createDirectClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeIdParam = searchParams.get("storeId");

  // CASO 1: Consulta pública desde el widget en la tienda de Tiendanube (tiene storeId en la URL)
  if (storeIdParam) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      const supabasePublic = createDirectClient(supabaseUrl, supabaseAnonKey);

      const { data: config, error } = await supabasePublic
        .from("bot_config")
        .select("store_id, is_active, bot_name, personality, primary_color")
        .eq("store_id", storeIdParam)
        .maybeSingle();

      if (error) {
        console.error("Error público buscando bot_config:", error);
      }

      return NextResponse.json({
        storeId: storeIdParam,
        config: config || {
          store_id: storeIdParam,
          is_active: false,
          bot_name: "Sofía",
          personality: "experta",
          primary_color: "#10B981",
        },
      });
    } catch (err) {
      console.error("Error en GET público de bot_config:", err);
      return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
    }
  }

  // CASO 2: Consulta privada desde el Dashboard del administrador (necesita sesión)
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Buscar la tienda activa del usuario
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

  // Obtener config
  const { data: config } = await supabase
    .from("bot_config")
    .select("*")
    .eq("store_id", store.store_id)
    .maybeSingle();

  return NextResponse.json({
    storeId: store.store_id,
    config: config || {
      store_id: store.store_id,
      is_active: false,
      bot_name: "Sofía",
      personality: "experta",
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
    const body = await req.json();
    const { is_active, bot_name, personality, primary_color } = body;

    const { data: updatedConfig, error } = await supabase
      .from("bot_config")
      .upsert(
        {
          store_id: store.store_id,
          is_active: Boolean(is_active),
          bot_name: bot_name || "Sofía",
          personality: personality || "experta",
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
  } catch (err: any) {
    console.error("Error en POST /api/nevuxbot/config:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
    }
