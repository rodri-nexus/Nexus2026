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
  display_duration?: number;
  delay_between?: number;
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

  if (settings.enable_live_visitors !== false) {
    const visitorCount = Math.floor(Math.random() * 19) + 7;
    events.push({
      id: `visitor-${Date.now()}`,
      type: "visitor",
      title: "🔥 ¡Alta demanda!",
      subtitle: `${visitorCount} personas están viendo productos en la tienda ahora`,
      icon: "👀",
      count: visitorCount,
    });
  }

  if (settings.enable_low_stock !== false && availableProducts.length > 0) {
    const lowProd = getRandomItem(availableProducts);
    const remainingStock = Math.floor(Math.random() * 4) + 2;

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

  return events.sort(() => Math.random() - 0.5);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/* ═══════════════════════════════════════════
   ENDPOINT GET: OBTENER AJUSTES DESDE WIDGETS
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

    // Consultar de la tabla widgets nativa
    const { data: widgetRow } = await supabase
      .from("widgets")
      .select("id, is_active, config")
      .eq("store_id", storeId)
      .eq("widget_slug", "social-proof")
      .maybeSingle();

    const cfg = widgetRow?.config || {};

    const currentSettings: SocialProofSettingsPayload = {
      store_id: storeId,
      is_active: widgetRow ? widgetRow.is_active : false,
      position: cfg.position || "bottom-left",
      display_duration: Number(cfg.display_duration) || 5,
      delay_between: Number(cfg.delay_between) || 8,
      enable_recent_sales: cfg.enable_recent_sales ?? true,
      enable_live_visitors: cfg.enable_live_visitors ?? true,
      enable_low_stock: cfg.enable_low_stock ?? true,
      theme_style: cfg.theme_style || "light",
      custom_cities: cfg.custom_cities || LATAM_CITIES,
    };

    let events: SocialProofEvent[] = [];

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
   ENDPOINT POST: GUARDAR AJUSTES EN WIDGETS
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

    // Buscar si ya existe la fila en la tabla widgets
    const { data: existingWidget } = await supabase
      .from("widgets")
      .select("id")
      .eq("store_id", store_id)
      .eq("widget_slug", "social-proof")
      .maybeSingle();

    const configPayload = {
      position,
      display_duration: Number(display_duration) || 5,
      delay_between: Number(delay_between) || 8,
      enable_recent_sales,
      enable_live_visitors,
      enable_low_stock,
      theme_style,
      custom_cities,
    };

    const nowIso = new Date().toISOString();

    if (existingWidget) {
      // Actualizar existente
      const { error: updateError } = await supabase
        .from("widgets")
        .update({
          is_active,
          config: configPayload,
          updated_at: nowIso,
        })
        .eq("id", existingWidget.id);

      if (updateError) throw updateError;
    } else {
      // Insertar nuevo
      const { error: insertError } = await supabase
        .from("widgets")
        .insert({
          store_id,
          widget_slug: "social-proof",
          widget_type: "social-proof",
          target_type: "all",
          is_active,
          config: configPayload,
          updated_at: nowIso,
        });

      if (insertError) throw insertError;
    }

    return jsonResponse({
      success: true,
      message: "Configuración de Social Proof IA guardada con éxito",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}
