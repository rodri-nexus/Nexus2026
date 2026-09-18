// app/api/social-proof/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getProducts } from "@/lib/tiendanube";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
export interface SocialProofSettingsPayload {
  store_id: number;
  is_active?: boolean;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  display_duration?: number; // segundos en pantalla
  delay_between?: number; // segundos entre notificaciones
  enable_recent_sales?: boolean;
  enable_live_visitors?: boolean;
  enable_low_stock?: boolean;
  theme_style?: "light" | "dark" | "glass";
  custom_cities?: string[];
}

export interface SocialProofEvent {
  id: string;
  type: "sale" | "visitor" | "stock";
  title: string;
  subtitle: string;
  timeAgo?: string;
  icon?: string;
  productName?: string;
  productImage?: string;
  location?: string;
  count?: number;
}

/* ═══════════════════════════════════════════
   CONSTANTES Y HELPERS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

const LATAM_NAMES = [
  "María L.", "Sofía G.", "Agustina K.", "Lucas M.", "Camila R.",
  "Valentina B.", "Mateo T.", "Facundo S.", "Lucía M.", "Joaquín C.",
  "Martina V.", "Gonzalo P.", "Delfina H.", "Nicolás F.", "Paula A."
];

const LATAM_CITIES = [
  "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata",
  "San Miguel de Tucumán", "Mar del Plata", "Salta", "Santa Fe", "San Juan"
];

const RECENT_TIMES = [
  "hace un momento", "hace 2 minutos", "hace 5 minutos",
  "hace 9 minutos", "hace 14 minutos", "hace 22 minutos"
];

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  });
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseProductName(raw: unknown): string {
  if (!raw) return "Producto destacado";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return String(obj.es || obj.pt || Object.values(obj)[0] || "Producto destacado");
  }
  return "Producto destacado";
}

function getProductImageUrl(p: Record<string, unknown>): string {
  if (typeof p.image_url === "string") return p.image_url;
  if (Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first !== null && "src" in first) {
      return String((first as { src: unknown }).src || "");
    }
  }
  return "";
}

/**
 * Genera eventos de Social Proof inteligentes basados en el catálogo
 */
function generateSocialEvents(
  products: unknown[],
  settings: SocialProofSettingsPayload
): SocialProofEvent[] {
  const events: SocialProofEvent[] = [];

  const parsedProducts = (Array.isArray(products) ? products : [])
    .map((item) => {
      const p = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        id: Number(p.id) || 0,
        name: parseProductName(p.name),
        image: getProductImageUrl(p),
      };
    })
    .filter((p) => p.id > 0);

  const availableProducts = parsedProducts.length > 0
    ? parsedProducts
    : [{ id: 1, name: "Producto de la tienda", image: "" }];

  // 1. Eventos de Venta Reciente (si está activado)
  if (settings.enable_recent_sales !== false) {
    for (let i = 0; i < Math.min(4, availableProducts.length * 2); i++) {
      const prod = getRandomItem(availableProducts);
      const name = getRandomItem(LATAM_NAMES);
      const city = getRandomItem(settings.custom_cities && settings.custom_cities.length > 0 ? settings.custom_cities : LATAM_CITIES);
      const timeAgo = getRandomItem(RECENT_TIMES);

      events.push({
        id: `sale-${i}-${Date.now()}`,
        type: "sale",
        title: `${name} de ${city}`,
        subtitle: `Compró ${prod.name}`,
        timeAgo,
        icon: "🛒",
        productName: prod.name,
        productImage: prod.image,
        location: city,
      });
    }
  }

  // 2. Eventos de Visitantes en Vivo (si está activado)
  if (settings.enable_live_visitors !== false) {
    const visitorCount = Math.floor(Math.random() * 19) + 7; // 7 a 25 personas
    events.push({
      id: `visitor-${Date.now()}`,
      type: "visitor",
      title: "🔥 ¡Alta demanda!",
      subtitle: `${visitorCount} personas están viendo productos en la tienda ahora`,
      icon: "👀",
      count: visitorCount,
    });
  }

  // 3. Evento de Stock Crítico (si está activado)
  if (settings.enable_low_stock !== false && availableProducts.length > 0) {
    const lowProd = getRandomItem(availableProducts);
    const remainingStock = Math.floor(Math.random() * 4) + 2; // 2 a 5 unidades

    events.push({
      id: `stock-${Date.now()}`,
      type: "stock",
      title: "⚠️ Quedan pocas unidades",
      subtitle: `Solo quedan ${remainingStock} unidades de ${lowProd.name}`,
      icon: "⚡",
      productName: lowProd.name,
      productImage: lowProd.image,
      count: remainingStock,
    });
  }

  // Mezclar eventos para variedad
  return events.sort(() => Math.random() - 0.5);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/* ═══════════════════════════════════════════
   ENDPOINT GET: OBTENER AJUSTES Y EVENTOS EN VIVO
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id") || searchParams.get("storeId");

    if (!storeIdParam) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    const storeId = parseInt(storeIdParam, 10);

    // 1. Obtener configuración guardada
    const { data: settings } = await supabase
      .from("store_social_proof_settings")
      .select("*")
      .eq("store_id", storeId)
      .maybeSingle();

    const currentSettings: SocialProofSettingsPayload = settings || {
      store_id: storeId,
      is_active: false,
      position: "bottom-left",
      display_duration: 5,
      delay_between: 8,
      enable_recent_sales: true,
      enable_live_visitors: true,
      enable_low_stock: true,
      theme_style: "light",
      custom_cities: LATAM_CITIES,
    };

    let events: SocialProofEvent[] = [];

    // 2. Si el módulo está activo, consultar catálogo para armar notificaciones
    if (currentSettings.is_active) {
      const { data: store } = await supabase
        .from("stores")
        .select("store_id, access_token")
        .eq("store_id", storeId)
        .eq("is_active", true)
        .maybeSingle();

      let rawProducts: unknown[] = [];
      if (store?.access_token) {
        try {
          const prods = await getProducts(store.store_id, store.access_token);
          rawProducts = Array.isArray(prods) ? prods : (prods as { products?: unknown[] })?.products || [];
        } catch (catErr) {
          console.error("Error obteniendo catálogo para Social Proof:", catErr);
        }
      }

      events = generateSocialEvents(rawProducts, currentSettings);
    }

    return jsonResponse({
      settings: currentSettings,
      events,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}

/* ═══════════════════════════════════════════
   ENDPOINT POST: GUARDAR AJUSTES
═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const body: SocialProofSettingsPayload = await req.json().catch(() => ({}));
    const {
      store_id,
      is_active = false,
      position = "bottom-left",
      display_duration = 5,
      delay_between = 8,
      enable_recent_sales = true,
      enable_live_visitors = true,
      enable_low_stock = true,
      theme_style = "light",
      custom_cities = LATAM_CITIES,
    } = body;

    if (!store_id) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    // Validar propiedad de la tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return jsonResponse({ error: "Tienda no autorizada" }, 403);
    }

    const nowIso = new Date().toISOString();

    const { data: saved, error } = await supabase
      .from("store_social_proof_settings")
      .upsert(
        {
          user_id: user.id,
          store_id,
          is_active,
          position,
          display_duration: Number(display_duration) || 5,
          delay_between: Number(delay_between) || 8,
          enable_recent_sales,
          enable_live_visitors,
          enable_low_stock,
          theme_style,
          custom_cities,
          updated_at: nowIso,
        },
        { onConflict: "store_id" }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return jsonResponse({
      success: true,
      settings: saved,
      message: "Configuración de Social Proof IA guardada con éxito",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
      }
