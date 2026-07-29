import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProductsCount } from "@/lib/tiendanube";
import ProductosClient from "./ProductosClient";

export const revalidate = 300;

export default async function ProductosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token, installed_at, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  let productsCount = 0;
  if (store?.store_id && store?.access_token) {
    productsCount = await getProductsCount(
      store.store_id,
      store.access_token
    );
  }

  const storeData = store
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
