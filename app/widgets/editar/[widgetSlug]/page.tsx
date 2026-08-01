import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProduct } from "@/lib/tiendanube";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

interface PageProps {
  params: { widgetSlug: string };
  searchParams: { product?: string; target?: string };
}

export default async function WidgetsEditarPage({ params, searchParams }: PageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: definition } = await supabase
    .from("widget_definitions")
    .select("*")
    .eq("slug", params.widgetSlug)
    .eq("is_active", true)
    .single();

  if (!definition) redirect("/dashboard");

  const { data: store } = await supabase
    .from("stores")
    .select("store_id, access_token")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  let product = null;
  if (searchParams.product && store?.access_token) {
    const pid = parseInt(searchParams.product, 10);
    if (!isNaN(pid)) {
      product = await getProduct(store.store_id, store.access_token, pid);
    }
  }

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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.85rem", textDecoration: "none", marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "3rem 2rem", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, #eef2ff, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <Construction size={28} color="#6366f1" />
          </div>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "#f1f5f9" }}>
            {definition.name}
          </h2>
          <p style={{ margin: "0 0 1.5rem", fontSize: "0.9rem", color: "#64748b", lineHeight: 1.5 }}>
            {definition.description}
          </p>
          
          {product && (
            <div style={{ marginBottom: "1.5rem", padding: "0.75rem", background: "rgba(99,102,241,0.1)", borderRadius: "12px", border: "1px solid rgba(99,102,241,0.2)", display: "inline-block" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>
                Producto: {typeof product.name === 'string' ? product.name : product.name?.es}
              </div>
            </div>
          )}

          {existingWidget && (
            <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#22c55e" }}>
              ✅ Este widget ya fue configurado
            </div>
          )}

          <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "#475569" }}>
            Editor en construcción — siguiente paso
          </p>
        </div>
      </div>
    </div>
  );
                 }
