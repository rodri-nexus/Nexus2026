import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import WidgetCatalogClient from "@/components/widgets/WidgetCatalogClient";
import { Folder } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    categoryId: string;
  };
  searchParams?: {
    type?: string;
  };
}

export default async function WidgetsNuevoCategoriaDetailPage({
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

  const categoryId = params.categoryId;
  if (!categoryId) {
    redirect("/dashboard");
  }

  // Traer tienda activa del usuario para consultar el nombre de la categoría en Tiendanube
  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  let categoryName = `Categoría #${categoryId}`;

  if (store?.store_id && store?.access_token) {
    try {
      const res = await fetch(
        `https://api.tiendanube.com/v1/${store.store_id}/categories/${categoryId}`,
        {
          headers: {
            Authentication: `bearer ${store.access_token}`,
            "User-Agent": "Nevux (soportenevux@gmail.com)",
          },
        }
      );
      if (res.ok) {
        const catData = await res.json();
        if (catData?.name) {
          categoryName =
            typeof catData.name === "object"
              ? catData.name.es || catData.name.pt || catData.name.en || categoryName
              : String(catData.name);
        }
      }
    } catch {
      // Fallback seguro si la API de Tiendanube no responde
    }
  }

  // Traer definiciones de widgets activos excluyendo slugs no utilizados
  const { data: rawDefinitions } = await supabase
    .from("widget_definitions")
    .select("*")
    .eq("is_active", true)
    .not("slug", "in", '("pack-complementarios","extras-interruptor","switch-extras")')
    .order("name");

  // Filtro de seguridad en memoria
  const excludedSlugs = ["pack-complementarios", "extras-interruptor", "switch-extras"];
  const definitions = (rawDefinitions || []).filter(
    (w) => !excludedSlugs.includes(w.slug)
  );

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
      <Folder size={16} color="#10B981" />
      Widget para la categoría: {categoryName}
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
          definitions={definitions}
          title={`¿Qué widget querés agregar a la categoría "${categoryName}"?`}
          chip={chip}
          baseUrl="/widgets/editar"
          categoryId={categoryId}
          target="category"
          selectedType={searchParams?.type}
        />
      </div>
    </div>
  );
}
