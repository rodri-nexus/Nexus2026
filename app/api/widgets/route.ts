// app/api/widgets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface WidgetPayload {
  id?: string;
  store_id: number;
  widget_slug: string;
  widget_type?: string;
  target_type: "all" | "product" | string;
  target_product_id?: string | number | null;
  config?: Record<string, unknown>;
  is_active?: boolean;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

function corsResponse(data: unknown, status = 200) {
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

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return corsResponse({ error: "No autorizado" }, 401);
    }

    const body: WidgetPayload = await req.json();
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

    if (!store_id || !widget_slug) {
      return corsResponse(
        { error: "Faltan datos obligatorios (store_id o widget_slug)" },
        400
      );
    }

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .eq("is_active", true)
      .single();

    if (!store) {
      return corsResponse({ error: "Tienda no autorizada o inactiva" }, 403);
    }

    const now = new Date().toISOString();
    const payload = {
      user_id: user.id,
      store_id,
      widget_slug,
      widget_type: widget_type || widget_slug,
      target_type: target_type || "all",
      target_product_id: target_type === "product" ? target_product_id : null,
      config: config || {},
      is_active: is_active !== undefined ? is_active : true,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("widgets")
      .upsert(
        {
          ...(id ? { id } : {}),
          ...payload,
          ...(id ? {} : { created_at: now }),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) throw error;
    return corsResponse({ data, widget: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return corsResponse({ error: message }, 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Caso Público (Script inyectado en la tienda del cliente)
    if (!user) {
      if (!storeIdParam) {
        return corsResponse(
          { error: "No autorizado. Se requiere store_id" },
          401
        );
      }

      const parsedStoreId = parseInt(storeIdParam, 10);
      if (isNaN(parsedStoreId)) {
        return corsResponse({ error: "store_id inválido" }, 400);
      }

      const { data: widgets, error: publicErr } = await supabaseAdmin
        .from("widgets")
        .select("*")
        .eq("store_id", parsedStoreId)
        .eq("is_active", true);

      if (publicErr) {
        throw publicErr;
      }

      return corsResponse({
        widgets: widgets || [],
        ts: Date.now(), // Cache-buster para tiendas reales
      });
    }

    // 2. Caso Privado (Dashboard del comerciante logueado)
    let query = supabase
      .from("widgets")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (storeIdParam) {
      const parsedStoreId = parseInt(storeIdParam, 10);
      if (!isNaN(parsedStoreId)) {
        query = query.eq("store_id", parsedStoreId);
      }
    }

    const { data: widgets, error: privateErr } = await query;
    if (privateErr) {
      throw privateErr;
    }

    return corsResponse({ widgets: widgets || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return corsResponse({ error: message }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return corsResponse({ error: "No autorizado" }, 401);
    }

    const body = await req.json();
    const { id, is_active } = body;

    if (!id) {
      return corsResponse({ error: "Falta el ID del widget" }, 400);
    }

    const { data, error } = await supabase
      .from("widgets")
      .update({
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return corsResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return corsResponse({ error: message }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return corsResponse({ error: "No autorizado" }, 401);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return corsResponse({ error: "Falta el ID del widget" }, 400);
    }

    const { error } = await supabase
      .from("widgets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return corsResponse({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return corsResponse({ error: message }, 500);
  }
      }
