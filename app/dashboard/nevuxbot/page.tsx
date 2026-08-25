import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import NevuxBotClient from "./NevuxBotClient";

export const revalidate = 0;

export default async function NevuxBotPage() {
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

  const storeData = store
    ? {
        store_id: store.store_id,
        installed_at: store.installed_at,
        is_active: store.is_active,
      }
    : null;

  return (
    <NevuxBotClient
      email={user.email ?? ""}
      store={storeData}
    />
  );
}
