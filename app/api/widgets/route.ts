import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const {
    id,
    store_id,
    widget_slug,
    widget_type,
    target_type,
    target_product_id,
    config,
    is_active,
  } = body;

  // Verificar que el store pertenezca al usuario
  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("user_id", user.id)
    .eq("store_id", store_id)
    .eq("is_active", true)
    .single();

  if (!store) {
    return NextResponse.json(
      { error: "Tienda no encontrada o no autorizada" },
      { status: 403 }
    );
  }

  if (id) {
    // UPDATE
    const { data, error } = await supabase
      .from("widgets")
      .update({
        config,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } else {
    // INSERT
    const { data, error } = await supabase
      .from("widgets")
      .insert({
        user_id: user.id,
        store_id,
        widget_slug,
        widget_type,
        target_type,
        target_product_id,
        config,
        is_active,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  }
}
