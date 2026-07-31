import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getProducts } from "@/lib/tiendanube";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const storeIdParam = searchParams.get("storeId");
  const q = searchParams.get("q") || undefined;

  if (!storeIdParam) {
    return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
  }

  const storeId = parseInt(storeIdParam, 10);

  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token")
    .eq("user_id", user.id)
    .eq("store_id", storeId)
    .eq("is_active", true)
    .maybeSingle();

  if (!store?.access_token) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  try {
    const products = await getProducts(store.store_id, store.access_token, q);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
    }
