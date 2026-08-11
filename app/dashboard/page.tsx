import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProductsCount } from "@/lib/tiendanube";
import DashboardClient from "./DashboardClient";

// Revalidar cada 5 minutos para no saturar la API de Tiendanube
export const revalidate = 300;

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar en paralelo: tienda vinculada + perfil (onboarding) + widgets activos
  const [storeRes, profileRes, widgetsCountRes] = await Promise.all([
    supabase
      .from("stores")
      .select("store_id, access_token, installed_at, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("widgets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  const store = storeRes.data;
  const onboardingCompleted = profileRes.data?.onboarding_completed ?? false;
  const activeWidgetsCount = widgetsCountRes.count ?? 0;

  let productsCount = 0;
  if (store?.store_id && store?.access_token) {
    productsCount = await getProductsCount(
      store.store_id,
      store.access_token
    );
  }

  const storeData = store
    ? {
        store_id: store.store_id,
        installed_at: store.installed_at,
        is_active: store.is_active,
      }
    : null;

  return (
    <DashboardClient
      email={user.email ?? ""}
      userId={user.id}
      store={storeData}
      productsCount={productsCount}
      activeWidgetsCount={activeWidgetsCount}
      onboardingCompleted={onboardingCompleted}
    />
  );
    }
