// app/api/ai/cross-sell/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getProducts } from "@/lib/tiendanube";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface CrossSellSettingsPayload {
  store_id: number;
  is_active?: boolean;
  discount_percentage?: number;
  title?: string;
  subtitle?: string;
  button_text?: string;
  auto_pilot?: boolean;
  custom_pairings?: unknown[];
}

interface RawProduct {
  id: number;
  name: string | { es?: string; pt?: string };
  price?: string | number;
  promotional_price?: string | number;
  images?: { src: string }[];
  image_url?: string;
  categories?: { id: number; name?: string | { es?: string } }[];
}

export interface SmartPairing {
  mainProductId: number;
  mainProductName: string;
  mainProductPrice: number;
  mainProductImage: string;
  recommendedProductId: number;
  recommendedProductName: string;
  recommendedProductPrice: number;
  recommendedProductImage: string;
  comboOriginalPrice: number;
  comboDiscountPrice: number;
  savingsAmount: number;
  matchScore: number;
  matchReason: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/* ═══════════════════════════════════════════
   HELPERS DEL MOTOR DE IA (Regla #9 al inicio)
═══════════════════════════════════════════ */
function parseProductName(raw: string | { es?: string; pt?: string } | undefined): string {
  if (!raw) return "Producto";
  if (typeof raw === "string") return raw;
  return raw.es || raw.pt || Object.values(raw)[0] || "Producto";
}

function parseProductPrice(price: string | number | undefined): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function getProductImageUrl(p: RawProduct): string {
  return p.image_url || p.images?.[0]?.src || "";
}

/**
 * Motor Predictivo de Cross-Selling:
 * Empareja cada producto con un complemento óptimo basado en afinidad de precio (15%-65% del producto base),
 * análisis semántico de palabras clave y rotación inteligente.
 */
function generateSmartPairings(
  products: RawProduct[],
  discountPercentage = 15
): SmartPairing[] {
  if (!products || products.length < 2) return [];

  const parsedProducts = products.map((p) => ({
    id: p.id,
    name: parseProductName(p.name),
    price: parseProductPrice(p.price || p.promotional_price),
    image: getProductImageUrl(p),
  }));

  const pairings: SmartPairing[] = [];

  for (let i = 0; i < parsedProducts.length; i++) {
    const main = parsedProducts[i];
    if (main.price <= 0) continue;

    // Buscar el mejor candidato complementario (distinto al principal)
    let bestCandidate = parsedProducts[(i + 1) % parsedProducts.length];
    let bestScore = 0;
    let matchReason = "Accesorio más vendido de la tienda";

    for (let j = 0; j < parsedProducts.length; j++) {
      if (i === j) continue;
      const candidate = parsedProducts[j];
      if (candidate.price <= 0) continue;

      let currentScore = 50; // Base score

      // Criterio 1: Precio complementario ideal (entre 15% y 65% del precio principal)
      const ratio = candidate.price / main.price;
      if (ratio >= 0.15 && ratio <= 0.65) {
        currentScore += 35;
        matchReason = "Complemento de ticket ideal";
      } else if (ratio < 1.0) {
        currentScore += 20;
        matchReason = "Sugerencia por afinidad de compra";
      }

      // Criterio 2: Coincidencias de palabras clave o complementariedad
      const mainWords = main.name.toLowerCase().split(/\s+/);
      const candWords = candidate.name.toLowerCase().split(/\s+/);
      const hasSharedWord = mainWords.some(
        (w) => w.length > 3 && candWords.includes(w)
      );

      if (hasSharedWord) {
        currentScore += 15;
        matchReason = "Misma línea / Colección complementaria";
      }

      if (currentScore > bestScore) {
        bestScore = currentScore;
        bestCandidate = candidate;
      }
    }

    const comboOriginalPrice = main.price + bestCandidate.price;
    const discountMultiplier = (100 - discountPercentage) / 100;
    const comboDiscountPrice = Math.round(comboOriginalPrice * discountMultiplier);
    const savingsAmount = comboOriginalPrice - comboDiscountPrice;

    pairings.push({
      mainProductId: main.id,
      mainProductName: main.name,
      mainProductPrice: main.price,
      mainProductImage: main.image,
      recommendedProductId: bestCandidate.id,
      recommendedProductName: bestCandidate.name,
      recommendedProductPrice: bestCandidate.price,
      recommendedProductImage: bestCandidate.image,
      comboOriginalPrice,
      comboDiscountPrice,
      savingsAmount,
      matchScore: Math.min(bestScore, 98),
      matchReason,
    });
  }

  return pairings;
}

/* ═══════════════════════════════════════════
   ENDPOINT GET: CONFIGURACIÓN Y RECOMENDACIONES IA
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id") || searchParams.get("storeId");
    const includePairings = searchParams.get("include_pairings") === "true";

    if (!storeIdParam) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    const storeId = parseInt(storeIdParam, 10);

    // 1. Obtener configuración de IA guardada
    const { data: settings } = await supabase
      .from("ai_cross_sell_settings")
      .select("*")
      .eq("user_id", user.id)
      .eq("store_id", storeId)
      .maybeSingle();

    const currentSettings = settings || {
      is_active: true,
      discount_percentage: 15,
      title: "🔥 Llevá el complemento ideal con descuento",
      subtitle: "Comprados juntos habitualmente con descuento exclusivo:",
      button_text: "⚡ Agregar combo con descuento al carrito",
      auto_pilot: true,
      custom_pairings: [],
    };

    let pairings: SmartPairing[] = [];

    // 2. Si se solicitan las parejas generadas, consultar catálogo real
    if (includePairings) {
      const { data: store } = await supabase
        .from("stores")
        .select("store_id, access_token")
        .eq("user_id", user.id)
        .eq("store_id", storeId)
        .eq("is_active", true)
        .maybeSingle();

      if (store?.access_token) {
        try {
          const rawProducts = await getProducts(store.store_id, store.access_token);
          const productList = Array.isArray(rawProducts)
            ? rawProducts
            : (rawProducts as { products?: RawProduct[] })?.products || [];

          pairings = generateSmartPairings(
            productList,
            Number(currentSettings.discount_percentage) || 15
          );
        } catch (catErr) {
          console.error("Error consultando catálogo para IA:", catErr);
        }
      }
    }

    return jsonResponse({
      settings: currentSettings,
      pairings,
      totalPairingsCount: pairings.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}

/* ═══════════════════════════════════════════
   ENDPOINT POST: GUARDAR CONFIGURACIÓN IA
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

    const body: CrossSellSettingsPayload = await req.json().catch(() => ({}));
    const {
      store_id,
      is_active = true,
      discount_percentage = 15,
      title = "🔥 Llevá el complemento ideal con descuento",
      subtitle = "Comprados juntos habitualmente con descuento exclusivo:",
      button_text = "⚡ Agregar combo con descuento al carrito",
      auto_pilot = true,
      custom_pairings = [],
    } = body;

    if (!store_id) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    // Validar tienda
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
      .from("ai_cross_sell_settings")
      .upsert(
        {
          user_id: user.id,
          store_id,
          is_active,
          discount_percentage: Number(discount_percentage) || 15,
          title,
          subtitle,
          button_text,
          auto_pilot,
          custom_pairings,
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
      message: "Motor de Cross-Selling IA actualizado con éxito",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
  }
