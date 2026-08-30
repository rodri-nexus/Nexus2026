// app/productos/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getProductsCount } from "@/lib/tiendanube";
import ProductosClient from "./ProductosClient";

export const dynamic = "force-dynamic";

export interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

export default async function ProductosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Tienda activa del usuario usando supabaseAdmin para máxima resiliencia
  const { data: storesList } = await supabaseAdmin
    .from("stores")
    .select("store_id, access_token, installed_at, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("installed_at", { ascending: false })
    .limit(1);

  const store = storesList && storesList.length > 0 ? storesList[0] : null;

  let productsCount = 0;
  if (store?.store_id && store?.access_token) {
    try {
      productsCount = await getProductsCount(
        store.store_id,
        store.access_token
      );
    } catch (err: unknown) {
      console.error("[productos/page] Error obteniendo total de productos:", err);
      productsCount = 0;
    }
  }

  const storeData: StoreData | null = store
    ? {
        store_id: store.store_id,
        installed_at: store.installed_at,
        is_active: store.is_active,
      }
    : null;

  return (
    <ProductosClient
      email={user.email ?? ""}
      store={storeData}
      productsCount={productsCount}
    />
  );
}
