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

  // Buscar en paralelo: tienda vinculada + perfil (onboarding)
  const [storeRes, profileRes] = await Promise.all([
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
  ]);

  const store = storeRes.data;
  // Si no existe el perfil o el campo, asumimos que NO completó el onboarding
  const onboardingCompleted = profileRes.data?.onboarding_completed ?? false;

  // Si hay tienda conectada, traer la cantidad de productos desde Tiendanube
  let productsCount = 0;
  if (store?.store_id && store?.access_token) {
    productsCount = await getProductsCount(
      store.store_id,
      store.access_token
    );
  }

  // Preparamos los datos que le pasamos al cliente
  // (no mandamos el access_token al cliente por seguridad)
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
      store={storeData}
      productsCount={productsCount}
      activeWidgetsCount={0}
      onboardingCompleted={onboardingCompleted}
    />
  );
}
