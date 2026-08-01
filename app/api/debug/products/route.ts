import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token, scope")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!store) {
    return NextResponse.json({ error: "No hay tienda conectada" }, { status: 404 });
  }

  // Llamada a /products/count
  let countRes;
  let countData;
  let countStatus;

  try {
    const res = await fetch(
      `https://api.tiendanube.com/v1/${store.store_id}/products/count`,
      {
        headers: {
          Authorization: `Bearer ${store.access_token}`,
          "User-Agent": "Nevux (nevux.app)",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    countStatus = res.status;
    countData = await res.json().catch(() => null);
    countRes = { status: res.status, data: countData };
  } catch (err: any) {
    countRes = { status: "ERROR", error: err.message };
  }

  // Llamada a /products (solo 1 para ver si funciona)
  let productsRes;
  try {
    const url = new URL(`https://api.tiendanube.com/v1/${store.store_id}/products`);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("fields", "id,name");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${store.access_token}`,
        "User-Agent": "Nevux (nevux.app)",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    productsRes = { status: res.status, data };
  } catch (err: any) {
    productsRes = { status: "ERROR", error: err.message };
  }

  // Info del token (sin exponerlo completo)
  const tokenPreview =
    store.access_token && store.access_token.length > 10
      ? store.access_token.slice(0, 8) + "..." + store.access_token.slice(-4)
      : "VACÍO";

  return NextResponse.json({
    store_id: store.store_id,
    token_preview: tokenPreview,
    token_length: store.access_token?.length || 0,
    scope: store.scope,
    count_endpoint: countRes,
    products_endpoint: productsRes,
  });
    }
