import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProduct } from "@/lib/tiendanube";
import WidgetCatalogClient from "@/components/widgets/WidgetCatalogClient";
import ProductChip from "@/components/widgets/ProductChip";

interface PageProps {
  params: { productId: string };
}

export default async function WidgetsNuevoProductoPage({ params }: PageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const productId = parseInt(params.productId, 10);
  if (isNaN(productId)) {
    redirect("/dashboard");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!store?.access_token) {
    redirect("/dashboard");
  }

  const product = await getProduct(store.store_id, store.access_token, productId);

  if (!product) {
    redirect("/dashboard");
  }

  const { data: definitions } = await supabase
    .from("widget_definitions")
    .select("*")
    .eq("is_active", true)
    .order("name");

  const productData = {
    id: product.id,
    name: product.name,
    image: product.images?.[0]?.src,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <WidgetCatalogClient
          definitions={definitions || []}
          title={`¿Qué widget querés agregar a "${product.name}"?`}
          chip={<ProductChip name={product.name} image={productData.image} />}
          baseUrl={`/widgets/editar`}
          productId={productId}
        />
      </div>
    </div>
  );
      }
