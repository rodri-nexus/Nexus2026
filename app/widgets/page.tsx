import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import WidgetsClient from "./WidgetsClient";

export default async function WidgetsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("store_id, installed_at, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return (
    <WidgetsClient
      email={user.email ?? ""}
      store={store}
    />
  );
}
