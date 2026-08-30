import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProduct } from "@/lib/tiendanube";
import WidgetCatalogClient from "@/components/widgets/WidgetCatalogClient";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    productId: string;
  };
  searchParams?: {
    type?: string;
  };
}

export default async function WidgetsNuevoProductoDetailPage({
  params,
  searchParams,
}: PageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const numericProductId = Number(params.productId);
  if (isNaN(numericProductId)) {
    redirect("/widgets/nuevo/producto");
  }

  // Traer tienda activa del usuario para consultar nombre del producto
  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  let productName = `Producto #${numericProductId}`;
  if (store?.store_id && store?.access_token) {
    try {
      const productData = await getProduct(
        store.store_id,
        store.access_token,
        numericProductId
      );
      if (productData?.name) {
        productName = productData.name;
      }
    } catch {
      // Fallback seguro si falla la API de Tiendanube
    }
  }

  // Traer definiciones de widgets activos
  const { data: definitions } = await supabase
    .from("widget_definitions")
    .select("*")
    .eq("is_active", true)
    .order("name");

  const chip = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.85rem",
        background: "#ecfdf5",
        border: "1.5px solid #a7f3d0",
        borderRadius: "10px",
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "#059669",
      }}
    >
      <Package size={16} color="#10B981" />
      Widget exclusivo para: {productName}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", boxSizing: "border-box" }}>
        <WidgetCatalogClient
          definitions={definitions || []}
          title={`¿Qué widget querés agregar a "${productName}"?`}
          chip={chip}
          baseUrl="/widgets/editar"
          productId={numericProductId}
          selectedType={searchParams?.type}
        />
      </div>
    </div>
  );
        }
