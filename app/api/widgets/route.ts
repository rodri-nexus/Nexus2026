import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// ============================================
// GET /api/widgets
// Devuelve todos los widgets del usuario logueado
// ============================================
export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const { data: widgets, error } = await supabase
    .from("widgets")
    .select("*")
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
// Crea un widget nuevo (asociado al user + store)
// Body: { type: string, name: string }
// ============================================
export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  // Validamos que tenga tienda conectada
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("store_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (storeError) {
    console.error("Error al buscar tienda:", storeError);
    return NextResponse.json(
      { error: "Error al validar la tienda" },
      { status: 500 }
    );
  }

  if (!store) {
    return NextResponse.json(
      { error: "Necesitás conectar tu Tiendanube primero" },
      { status: 400 }
    );
  }

  // Parseamos el body
  let body: { type?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido" },
      { status: 400 }
    );
  }

  const { type, name } = body;

  if (!type || typeof type !== "string") {
    return NextResponse.json(
      { error: "Falta el tipo de widget" },
      { status: 400 }
    );
  }

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Falta el nombre del widget" },
      { status: 400 }
    );
  }

  // Insertamos el widget
  const { data: widget, error: insertError } = await supabase
    .from("widgets")
    .insert({
      user_id: user.id,
      store_id: store.store_id,
      type,
      name,
      config: {},
      is_active: false,
      target_type: "all",
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error al crear widget:", insertError);
    return NextResponse.json(
      { error: "Error al crear el widget" },
      { status: 500 }
    );
  }

  return NextResponse.json({ widget }, { status: 201 });
}

// ============================================
// DELETE /api/widgets?id=xxx
// Elimina un widget (validando que sea del usuario)
// ============================================
export async function DELETE(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
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
