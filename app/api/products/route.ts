// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getProducts } from "@/lib/tiendanube";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("storeId") || searchParams.get("store_id");
    const q = searchParams.get("q") || undefined;

    // Buscar tienda activa
    let query = supabase
      .from("stores")
      .select("store_id, access_token")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (storeIdParam) {
      const parsedStoreId = parseInt(storeIdParam, 10);
      if (!isNaN(parsedStoreId)) {
        query = query.eq("store_id", parsedStoreId);
      }
    }

    const { data: store, error: storeError } = await query
      .order("installed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (storeError || !store?.access_token) {
      return NextResponse.json(
        { error: "Tienda activa no encontrada o sin credenciales válidas" },
        { status: 404 }
      );
    }

    // Obtener productos desde la API oficial de Tiendanube
    const products = await getProducts(store.store_id, store.access_token, q);

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Error obteniendo productos";
    console.error("Error en GET /api/products:", errorMsg);
    return NextResponse.json(
      { error: "Error al consultar el catálogo de productos", details: errorMsg },
      { status: 500 }
    );
  }
      }
