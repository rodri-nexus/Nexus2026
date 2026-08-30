// app/dashboard/nevuxbot/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import NevuxBotClient from "./NevuxBotClient";

export const dynamic = "force-dynamic";

export interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

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

  const storeData: StoreData | null = store
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
