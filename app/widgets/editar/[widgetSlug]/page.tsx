import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProduct } from "@/lib/tiendanube";
import WidgetEditor from "@/components/widgets/editor/WidgetEditor";

interface PageProps {
  params: { widgetSlug: string };
  searchParams: { product?: string; target?: string };
}

export default async function WidgetsEditarPage({ params, searchParams }: PageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Traer la definición del widget
  const { data: definition } = await supabase
    .from("widget_definitions")
    .select("*")
    .eq("slug", params.widgetSlug)
    .eq("is_active", true)
    .single();

  if (!definition) redirect("/dashboard");

  // Traer la tienda conectada
  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  // Traer el producto si es widget para producto específico
  let product = null;
  if (searchParams.product && store?.access_token) {
    const pid = parseInt(searchParams.product, 10);
    if (!isNaN(pid)) {
      product = await getProduct(store.store_id, store.access_token, pid);
    }
  }

  // Traer widget existente (si ya lo configuró antes)
  const { data: existingWidget } = await supabase
    .from("widgets")
    .select("*")
    .eq("user_id", user.id)
    .eq("widget_slug", params.widgetSlug)
    .eq("target_type", searchParams.product ? "product" : "all")
    .is("target_product_id", searchParams.product ? parseInt(searchParams.product) : null)
    .maybeSingle();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: "2rem 1.25rem" }}>
      <WidgetEditor 
        definition={definition} 
        product={product} 
        storeId={store?.store_id}
        existingWidget={existingWidget}
        targetType={searchParams.product ? "product" : "all"}
        targetProductId={searchParams.product ? parseInt(searchParams.product) : null}
      />
    </div>
  );
}
