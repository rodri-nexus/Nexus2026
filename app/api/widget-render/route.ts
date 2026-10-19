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

    // 1. Obtener datos de la tienda y estado de su suscripción
    const { data: storeRow } = await supabaseAdmin
      .from("stores")
      .select("access_token, is_active, trial_ends_at, plan_status, plan_active_until")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .maybeSingle();

    if (!storeRow) {
      return corsResponse({
        widgets: [],
        socialProof: null,
        virtualSalesman: null,
        voiceSearch: null,
        suscripcionStock: null,
        error: "Tienda no encontrada o inactiva",
      });
    }

    // 🔒 CONTROL ESTRICTO DE SUSCRIPCIÓN Y PRUEBA
    const now = new Date();

    // A) ¿Está dentro del período de prueba gratis?
    const trialEnd = storeRow.trial_ends_at ? new Date(storeRow.trial_ends_at) : null;
    const isTrialActive = trialEnd ? trialEnd > now : false;

    // B) ¿Tiene un plan pago activo?
    const isPlanActiveStatus = storeRow.plan_status === "active";
    const planUntil = storeRow.plan_active_until ? new Date(storeRow.plan_active_until) : null;
    const isPlanValid = isPlanActiveStatus && (!planUntil || planUntil > now);

    // C) Si no está en prueba activa ni tiene plan pago -> BLOQUEO INMEDIATO
    if (!isTrialActive && !isPlanValid) {
      console.warn(`[widget-render] Acceso bloqueado para tienda ${storeId}. Trial y Plan expirados.`);
      return corsResponse({
        widgets: [],
        socialProof: null,
        virtualSalesman: null,
        voiceSearch: null,
        suscripcionStock: null,
        trial_expired: true,
        message: "Período de prueba finalizado. Suscríbete para reactivar tus widgets.",
        ts: Date.now(),
      });
    }

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
    const allWidgets = (rawWidgets || []).map((w: any) => {
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

    // 5. Social Proof (DETECCIÓN ESTRICTA DEL ESTADO APAGADO)
    let socialProofData: Record<string, unknown> | null = null;
    try {
      const { data: spWidgetRow } = await supabaseAdmin
        .from("widgets")
        .select("is_active, config")
        .eq("store_id", storeId)
        .eq("widget_slug", "social-proof")
        .maybeSingle();

      const { data: spRow } = await supabaseAdmin
        .from("social_proof_config")
        .select("*")
        .eq("store_id", storeId)
        .maybeSingle();

      let isSocialProofActive = true;

      if (spWidgetRow && spWidgetRow.is_active === false) {
        isSocialProofActive = false;
      }

      if (spRow && (spRow.is_active === false || spRow.user_disabled === true)) {
        isSocialProofActive = false;
      }

      const mergedConfig = {
        ...(spRow?.config || {}),
        ...(spWidgetRow?.config || {}),
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

    // 8. Suscripción de Stock (Aviso de Stock)
    let suscripcionStockData: Record<string, unknown> | null = null;
    try {
      const stockWidget = allWidgets.find((w: any) => w.widget_slug === "suscripcion-stock");
      if (stockWidget) {
        suscripcionStockData = {
          is_active: stockWidget.is_active ?? true,
          config: stockWidget.config || {},
          target_type: stockWidget.target_type || "all",
          target_product_id: stockWidget.target_product_id || null,
          target_category_id: stockWidget.target_category_id || null,
        };
      }
    } catch (eStock) {
      console.error("[widget-render] Error obteniendo suscripcion stock:", eStock);
    }

    return corsResponse({
      widgets: allWidgets,
      socialProof: socialProofData,
      virtualSalesman: virtualSalesmanData,
      voiceSearch: voiceSearchData,
      suscripcionStock: suscripcionStockData,
      activeCampaign: null,
      ts: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error en render";
    return corsResponse({ error: message }, 500);
  }
    }
