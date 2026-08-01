import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function WidgetsEditarPage({ params }: { params: { widgetSlug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: definition } = await supabase
    .from("widget_definitions")
    .select("*")
    .eq("slug", params.widgetSlug)
    .single();

  if (!definition) redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", padding: "2rem", color: "#fff" }}>
      <Link href="/dashboard" style={{ color: "#94a3b8" }}>← Volver</Link>
      <h1 style={{ marginTop: "1rem" }}>{definition.name}</h1>
      <p>{definition.description}</p>
      <p style={{ color: "#64748b", marginTop: "2rem" }}>Editor en construcción</p>
    </div>
  );
}
