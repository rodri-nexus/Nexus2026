import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar si el usuario ya tiene una tienda vinculada
  const { data: store } = await supabase
    .from("stores")
    .select("store_id, installed_at, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return (
    <DashboardClient
      email={user.email ?? ""}
      store={store}
    />
  );
}
