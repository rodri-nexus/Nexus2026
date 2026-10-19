import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("store_id");

    if (!storeId) {
      return corsResponse({ error: "Falta store_id", subscriptions: [] }, 400);
    }

    const cleanStoreId = String(storeId).trim();

    const { data, error } = await supabaseAdmin
      .from("stock_alert_subscriptions")
      .select("*")
      .eq("store_id", cleanStoreId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[stock-subscription GET] Error:", error);
      return corsResponse({ error: error.message, subscriptions: [] }, 500);
    }

    return corsResponse({ subscriptions: data || [] }, 200);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error servidor";
    console.error("[stock-subscription GET] Exception:", msg);
    return corsResponse({ error: msg, subscriptions: [] }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { store_id, email, product_name, product_url } = body || {};

    if (!store_id || !email) {
      return corsResponse({ error: "Faltan store_id o email" }, 400);
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanStoreId = String(store_id).trim();

    const { data, error } = await supabaseAdmin
      .from("stock_alert_subscriptions")
      .insert({
        store_id: cleanStoreId,
        email: cleanEmail,
        product_name: product_name || "Producto",
        product_url: product_url || "",
      })
      .select()
      .single();

    if (error) {
      console.error("[stock-subscription POST] Error:", error);
      return corsResponse({ error: error.message }, 500);
    }

    return corsResponse({ success: true, data }, 200);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error guardando suscripcion";
    console.error("[stock-subscription POST] Exception:", msg);
    return corsResponse({ error: msg }, 500);
  }
    }
