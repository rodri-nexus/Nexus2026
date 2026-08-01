import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import WidgetCatalogClient from "@/components/widgets/WidgetCatalogClient";
import { Store } from "lucide-react";

export default async function WidgetsNuevoTodosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        fontSize: "0.85rem",
        fontWeight: 500,
        color: "#374151",
      }}
    >
      <Store size={16} color="#6366f1" />
      Widgets generales para la tienda
    </div>
  );

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
          title="¿Qué widget querés agregar a todos los productos de la tienda?"
          chip={chip}
          baseUrl={`/widgets/editar`}
          target="all"
        />
      </div>
    </div>
  );
        }
