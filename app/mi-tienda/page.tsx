// app/mi-tienda/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProductsCount } from "@/lib/tiendanube";
import MiTiendaClient from "./MiTiendaClient";

export const dynamic = "force-dynamic";

export interface StoreInfo {
  store_id: number;
  installed_at: string;
  updated_at: string | null;
  is_active: boolean;
  scope: string | null;
  url: string;
  name: string;
}

async function getStoreInfo(
  storeId: number,
  accessToken: string
): Promise<{ url: string; name: string }> {
  try {
    const res = await fetch(`https://api.tiendanube.com/v1/${storeId}/store`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Nevux (nevux.app)",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("No se pudo obtener info de la tienda:", res.status);
      return { url: "", name: "" };
    }

    const data = await res.json();
    const name =
      typeof data.name === "string"
        ? data.name
        : data.name?.es || data.name?.pt || data.name?.en || "";

    return {
      url: data.url || "",
      name: name || "",
    };
  } catch (e) {
    console.error("Error obteniendo store info:", e);
    return { url: "", name: "" };
  }
}

export default async function MiTiendaPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Traer tienda vinculada al usuario
  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token, installed_at, updated_at, is_active, scope")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  // Si no hay tienda conectada, mostrar estado vacío
  if (!store || !store.access_token) {
    return (
      <MiTiendaClient
        email={user.email ?? ""}
        storeInfo={null}
        productsCount={0}
        widgetsCount={0}
      />
    );
  }

  // Traer widgets count
  async function getWidgetsCount(): Promise<number> {
    try {
      const { count } = await supabase
        .from("widgets")
        .select("id", { count: "exact", head: true })
        .eq("store_id", store!.store_id)
        .eq("user_id", user!.id);
      return count || 0;
    } catch (e) {
      console.error("Error contando widgets:", e);
      return 0;
    }
  }

  // Traer info fresca en paralelo
  const [{ url, name }, productsCount, widgetsCount] = await Promise.all([
    getStoreInfo(store.store_id, store.access_token),
    getProductsCount(store.store_id, store.access_token).catch(() => 0),
    getWidgetsCount(),
  ]);

  const storeInfo: StoreInfo = {
    store_id: store.store_id,
    installed_at: store.installed_at,
    updated_at: store.updated_at,
    is_active: store.is_active,
    scope: store.scope,
    url: url || `https://${store.store_id}.mitiendanube.com`,
    name: name || `Tienda #${store.store_id}`,
  };

  return (
    <MiTiendaClient
      email={user.email ?? ""}
      storeInfo={storeInfo}
      productsCount={productsCount}
      widgetsCount={widgetsCount}
    />
  );
                    }
