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
        background: "#ecfdf5",
        border: "1.5px solid #a7f3d0",
        borderRadius: "10px",
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "#10B981",
      }}
    >
      <Store size={16} color="#10B981" />
      Widgets generales para la tienda
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
          title="¿Qué widget querés agregar a todos los productos de la tienda?"
          chip={chip}
          baseUrl={`/widgets/editar`}
          target="all"
        />
      </div>
    </div>
  );
        }
