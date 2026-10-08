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

    if (!storeIdParam) {
      return corsResponse({ error: "Falta store_id" }, 400);
    }

    const storeId = parseInt(storeIdParam, 10);
    if (isNaN(storeId)) {
      return corsResponse({ error: "store_id inválido" }, 400);
    }

    // 1. Obtener tienda activa para obtener access_token
    const { data: storeRow } = await supabaseAdmin
      .from("stores")
      .select("access_token")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .maybeSingle();

    // 2. Obtener categorías de Tiendanube para mapear ID -> Handle / Nombre
    const categoryMetaMap: Record<string, { handle: string; name: string }> = {};
    if (storeRow?.access_token) {
      try {
        const catRes = await fetch(`https://api.tiendanube.com/v1/${storeId}/categories`, {
          headers: {
            Authentication: `bearer ${storeRow.access_token}`,
            "User-Agent": "Nevux (soportenevux@gmail.com)",
          },
        });
        if (catRes.ok) {
          const cats = await catRes.json();
          if (Array.isArray(cats)) {
            cats.forEach((c: any) => {
              const cid = String(c.id);
              const cHandle = typeof c.handle === "object" ? (c.handle.es || c.handle.pt || "") : String(c.handle || "");
              const cName = typeof c.name === "object" ? (c.name.es || c.name.pt || "") : String(c.name || "");
              categoryMetaMap[cid] = { handle: cHandle.toLowerCase(), name: cName.toLowerCase() };
            });
          }
        }
      } catch (eCat) {
        console.error("[widget-render] Error mapeando categorias:", eCat);
      }
    }

    // 3. Obtener todos los widgets activos de la tienda
    const { data: rawWidgets, error: widgetsErr } = await supabaseAdmin
      .from("widgets")
      .select("*")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    if (widgetsErr) {
      console.error("[WidgetRender] Error widgets:", widgetsErr);
    }

    // 4. Inyectar handle y name de categoría a los widgets correspondientes
    const allWidgets = (rawWidgets || []).map((w) => {
      if (w.target_type === "category" && w.target_category_id) {
        const meta = categoryMetaMap[String(w.target_category_id)];
        if (meta) {
          return {
            ...w,
            category_handle: meta.handle,
            category_name: meta.name,
          };
        }
      }
      return w;
    });

    // 5. Social Proof (VERIFICACIÓN DOBLE BLINDADA)
    let socialProofData: Record<string, unknown> | null = null;
    try {
      const spWidget = (rawWidgets || []).find((w) => w.widget_slug === "social-proof");
      
      const { data: spRow } = await supabaseAdmin
        .from("social_proof_config")
        .select("*")
        .eq("store_id", storeId)
        .maybeSingle();

      // Evaluar si fue desactivado manualmente en CUALQUIERA de las dos fuentes
      const isDisabledInWidget = spWidget ? spWidget.is_active === false : false;
      const isDisabledInConfig = spRow ? (spRow.is_active === false || spRow.user_disabled === true) : false;

      const isSocialProofActive = !isDisabledInWidget && !isDisabledInConfig;

      const mergedConfig = {
        ...(spRow?.config || {}),
        ...(spWidget?.config || {}),
      };

      socialProofData = {
        is_active: isSocialProofActive,
        user_disabled: !isSocialProofActive,
        config: mergedConfig,
        recent_buyers: spRow?.recent_buyers || [],
      };
    } catch (eSp) {
      console.error("[widget-render] Error obteniendo social proof:", eSp);
      socialProofData = { is_active: false, user_disabled: true };
    }

    // 6. Vendedor Virtual IA
    let virtualSalesmanData: Record<string, unknown> | null = null;
    try {
      const { data: vsRow } = await supabaseAdmin
        .from("virtual_salesman_config")
        .select("*")
        .eq("store_id", storeId)
        .eq("is_active", true)
        .maybeSingle();

      if (vsRow) {
        virtualSalesmanData = { is_active: true, config: vsRow.config || {} };
      }
    } catch {}

    // 7. Búsqueda por Voz
    let voiceSearchData: Record<string, unknown> | null = null;
    try {
      const { data: vsRow } = await supabaseAdmin
        .from("voice_search_config")
        .select("*")
        .eq("store_id", storeId)
        .eq("is_active", true)
        .maybeSingle();

      if (vsRow) {
        voiceSearchData = { is_active: true, config: vsRow.config || {} };
      }
    } catch {}

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
