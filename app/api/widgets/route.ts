import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// ============================================
// GET /api/widgets
// Devuelve todos los widgets del usuario + sus definiciones
// ============================================
export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: widgets, error } = await supabase
    .from("widgets")
    .select("*, widget_definitions(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al listar widgets:", error);
    return NextResponse.json(
      { error: "Error al obtener los widgets" },
      { status: 500 }
    );
  }

  return NextResponse.json({ widgets: widgets ?? [] });
}

// ============================================
// POST /api/widgets
// Crea o actualiza un widget con su configuración completa
// Body: { store_id, widget_slug, widget_type, target_type, target_product_id, config, is_active }
// ============================================
export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const {
    store_id,
    widget_slug,
    widget_type,
    target_type,
    target_product_id,
    config,
    is_active,
  } = body;

  if (!store_id || !widget_slug || !widget_type || !target_type) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  // Verificar si ya existe este widget para este user + slug + target
  const { data: existing } = await supabase
    .from("widgets")
    .select("id")
    .eq("user_id", user.id)
    .eq("widget_slug", widget_slug)
    .eq("target_type", target_type)
    .is("target_product_id", target_product_id || null)
    .maybeSingle();

  let result;
  if (existing) {
    // UPDATE
    result = await supabase
      .from("widgets")
      .update({
        store_id,
        widget_type,
        config: config ?? {},
        is_active: is_active ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    // INSERT
    result = await supabase
      .from("widgets")
      .insert({
        user_id: user.id,
        store_id,
        widget_slug,
        widget_type,
        target_type,
        target_product_id: target_product_id || null,
        config: config ?? {},
        is_active: is_active ?? true,
      })
      .select()
      .single();
  }

  if (result.error) {
    console.error("Error al guardar widget:", result.error);
    return NextResponse.json(
      { error: "Error al guardar el widget" },
      { status: 500 }
    );
  }

  return NextResponse.json({ widget: result.data }, { status: existing ? 200 : 201 });
}

// ============================================
// DELETE /api/widgets?id=xxx
// ============================================
export async function DELETE(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Falta el ID del widget" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("widgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error al eliminar widget:", error);
    return NextResponse.json(
      { error: "Error al eliminar el widget" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
