import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getProduct } from "@/lib/tiendanube";
import WidgetsClient from "./WidgetsClient";

export const dynamic = "force-dynamic";

interface WidgetDefinition {
  name: string;
  icon: string;
  category: string;
  description: string;
}

interface WidgetRow {
  id: string;
  widget_slug: string;
  widget_type: string;
  target_type: string;
  target_product_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  definition: WidgetDefinition | null;
}

interface ProductInfo {
  id: number;
  name: string;
  image: string | null;
  slug: string;
}

export default async function WidgetsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Tienda activa del usuario usando supabaseAdmin (evita bloqueos de RLS)
  const { data: storesList } = await supabaseAdmin
    .from("stores")
    .select("store_id, access_token, installed_at, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("installed_at", { ascending: false })
    .limit(1);

  const store = storesList && storesList.length > 0 ? storesList[0] : null;

  let widgets: WidgetRow[] = [];

  if (store?.store_id) {
    // 2. Traer widgets de la tienda activa usando supabaseAdmin
    const { data: widgetsData, error: widgetsError } = await supabaseAdmin
      .from("widgets")
      .select(
        "id, widget_slug, widget_type, target_type, target_product_id, is_active, created_at, updated_at"
      )
      .eq("user_id", user.id)
      .eq("store_id", store.store_id)
      .order("updated_at", { ascending: false });

    if (widgetsError) {
      console.error("[widgets/page] Error trayendo widgets:", widgetsError);
    }

    // 3. Traer definiciones de widgets usando supabaseAdmin
    const { data: defsData, error: defsError } = await supabaseAdmin
      .from("widget_definitions")
      .select("slug, name, icon, category, description");

    if (defsError) {
      console.error("[widgets/page] Error trayendo definitions:", defsError);
    }

    // 4. Armar map de definiciones por slug
    const defsMap = new Map<string, WidgetDefinition>();
    (defsData || []).forEach((d: any) => {
      defsMap.set(d.slug, {
        name: d.name,
        icon: d.icon,
        category: d.category,
        description: d.description,
      });
    });

    // 5. Combinar
    widgets = (widgetsData || []).map((w: any) => ({
      id: w.id,
      widget_slug: w.widget_slug,
      widget_type: w.widget_type,
      target_type: w.target_type,
      target_product_id: w.target_product_id,
      is_active: w.is_active,
      created_at: w.created_at,
      updated_at: w.updated_at,
      definition: defsMap.get(w.widget_slug) ?? null,
    }));
  }

  // 6. Productos únicos a traer desde la API de Tiendanube
  const productIds = Array.from(
    new Set(
      widgets
        .filter((w) => w.target_type === "product" && w.target_product_id)
        .map((w) => w.target_product_id as number)
    )
  );

  const productsMap: Record<number, ProductInfo | null> = {};
  if (store?.store_id && store?.access_token && productIds.length > 0) {
    const results = await Promise.all(
      productIds.map(async (pid) => {
        try {
          const p = await getProduct(store.store_id, store.access_token, pid);
          if (!p) return { id: pid, product: null };
          return {
            id: pid,
            product: {
              id: p.id,
              name: p.name,
              image: p.images?.[0]?.src ?? null,
              slug: p.slug,
            } as ProductInfo,
          };
        } catch {
          return { id: pid, product: null };
        }
      })
    );
    results.forEach((r) => {
      productsMap[r.id] = r.product;
    });
  }

  const storeData = store
    ? {
        store_id: store.store_id,
        installed_at: store.installed_at,
        is_active: store.is_active,
      }
    : null;

  return (
    <WidgetsClient
      email={user.email ?? ""}
      store={storeData}
      widgets={widgets}
      productsMap={productsMap}
    />
  );
      }
