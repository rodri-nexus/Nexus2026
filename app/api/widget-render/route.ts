import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

function corsResponse(data: unknown, status = 200) {
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id");
    const productIdParam = searchParams.get("product_id");

    if (!storeIdParam) {
      return corsResponse({ error: "Falta store_id" }, 400);
    }

    const storeId = parseInt(storeIdParam, 10);
    if (isNaN(storeId)) {
      return corsResponse({ error: "store_id inválido" }, 400);
    }

    // 1. Obtener todos los widgets activos de la tienda (Generales, Categorías y Productos)
    const { data: rawWidgets, error: widgetsErr } = await supabaseAdmin
      .from("widgets")
      .select("*")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    if (widgetsErr) {
      console.error("[WidgetRender] Error widgets:", widgetsErr);
    }

    const allWidgets = rawWidgets || [];

    // 2. Obtener configuración de Notificaciones de Compra (Social Proof) - Regla #29 Activo por defecto
    let socialProofData: Record<string, unknown> | null = null;
    try {
      const { data: spRow } = await supabaseAdmin
        .from("social_proof_config")
        .select("*")
        .eq("store_id", storeId)
        .maybeSingle();

      if (spRow) {
        socialProofData = {
          is_active: spRow.is_active !== false && !spRow.user_disabled,
          user_disabled: !!spRow.user_disabled,
          config: spRow.config || {},
          recent_buyers: spRow.recent_buyers || [],
        };
      } else {
        // Por defecto activo para todas las tiendas
        socialProofData = {
          is_active: true,
          user_disabled: false,
          config: {
            displayTime: 5,
            delayBetween: 8,
            position: "bottom-left",
          },
          recent_buyers: [],
        };
      }
    } catch {
      socialProofData = { is_active: true, user_disabled: false };
    }

    // 3. Obtener configuración de Vendedor Virtual IA
    let virtualSalesmanData: Record<string, unknown> | null = null;
    try {
      const { data: vsRow } = await supabaseAdmin
        .from("virtual_salesman_config")
        .select("*")
        .eq("store_id", storeId)
        .eq("is_active", true)
        .maybeSingle();

      if (vsRow) {
        virtualSalesmanData = {
          is_active: true,
          config: vsRow.config || {},
        };
      }
    } catch {}

    // 4. Obtener configuración de Búsqueda por Voz
    let voiceSearchData: Record<string, unknown> | null = null;
    try {
      const { data: vsRow } = await supabaseAdmin
        .from("voice_search_config")
        .select("*")
        .eq("store_id", storeId)
        .eq("is_active", true)
        .maybeSingle();

      if (vsRow) {
        voiceSearchData = {
          is_active: true,
          config: vsRow.config || {},
        };
      }
    } catch {}

    // 5. Retornar payload unificado para la tienda
    return corsResponse({
      widgets: allWidgets,
      socialProof: socialProofData,
      virtualSalesman: virtualSalesmanData,
      voiceSearch: voiceSearchData,
      activeCampaign: null,
      ts: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error en render";
    return corsResponse({ error: message }, 500);
  }
        }
