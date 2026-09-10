// app/api/campaigns/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getCampaignPreset, calculateCampaignEndDate } from "@/lib/campaignPresets";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   HEADERS Y RESPUESTAS AUXILIARES
═══════════════════════════════════════════ */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
   ENDPOINT PRINCIPAL POST (OPTIMIZADO EN PARALELO)
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

    const body = await req.json().catch(() => ({}));
    const { store_id, campaign_slug } = body;

    if (!store_id || !campaign_slug) {
      return jsonResponse(
        { error: "Faltan datos obligatorios (store_id o campaign_slug)" },
        400
      );
    }

    const preset = getCampaignPreset(campaign_slug);
    if (!preset) {
      return jsonResponse({ error: `Campaña no válida o no encontrada: ${campaign_slug}` }, 404);
    }

    // 1. Validar que la tienda pertenezca al usuario logueado
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return jsonResponse({ error: "Tienda no encontrada o no autorizada" }, 403);
    }

    // 2. Traer widgets existentes y snapshots en paralelo
    const [widgetsRes, snapshotsRes] = await Promise.all([
      supabase
        .from("widgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("store_id", store_id),
      supabase
        .from("campaign_snapshots")
        .select("id")
        .eq("user_id", user.id)
        .eq("store_id", store_id)
        .limit(1),
    ]);

    if (widgetsRes.error) throw widgetsRes.error;

    const currentWidgets = widgetsRes.data || [];
    const hasSnapshots = (snapshotsRes.data || []).length > 0;

    // 3. Si no hay snapshot, guardar backup en un solo insert masivo
    if (!hasSnapshots && currentWidgets.length > 0) {
      const snapshotsToInsert = currentWidgets.map((w) => ({
        user_id: user.id,
        store_id,
        campaign_slug,
        widget_id: w.id,
        original_config: w.config || {},
        original_is_active: w.is_active ?? true,
      }));

      await supabase.from("campaign_snapshots").insert(snapshotsToInsert);
    }

    // 4. Preparar datos de los 10 widgets
    const endDateIso = calculateCampaignEndDate(preset.durationDays);
    const nowIso = new Date().toISOString();

    const targetSlugs = [
      "cuenta-regresiva",
      "banner-deslizante",
      "badge-cupon",
      "ruleta-descuentos",
      "barra-progreso",
      "comparador-marca",
      "medios-pago",
      "caja-opiniones",
      "mensaje-garantia",
      "mensaje-alerta",
    ] as const;

    const allOperations: any[] = [];
    const widgetsToInsert: any[] = [];

    for (const slug of targetSlugs) {
      let patchConfig: Record<string, unknown> = {};

      if (slug === "cuenta-regresiva") {
        patchConfig = preset.patches["cuenta-regresiva"](endDateIso);
      } else {
        patchConfig = (preset.patches as any)[slug] || {};
      }

      const existing =
        currentWidgets.find((w) => w.widget_slug === slug && w.target_type === "all") ||
        currentWidgets.find((w) => w.widget_slug === slug);

      if (existing) {
        const updatedConfig = {
          ...(typeof existing.config === "object" && existing.config !== null
            ? existing.config
            : {}),
          ...patchConfig,
        };

        allOperations.push(
          supabase
            .from("widgets")
            .update({
              config: updatedConfig,
              is_active: true,
              updated_at: nowIso,
            })
            .eq("id", existing.id)
            .eq("user_id", user.id)
        );
      } else {
        widgetsToInsert.push({
          user_id: user.id,
          store_id,
          widget_slug: slug,
          widget_type: slug,
          target_type: "all",
          target_product_id: null,
          config: patchConfig,
          is_active: true,
          created_at: nowIso,
          updated_at: nowIso,
        });
      }
    }

    // 5. Ejecutar operaciones en paralelo
    if (widgetsToInsert.length > 0) {
      allOperations.push(supabase.from("widgets").insert(widgetsToInsert));
    }

    allOperations.push(
      supabase.from("active_campaigns").upsert(
        {
          user_id: user.id,
          store_id,
          campaign_slug,
          activated_at: nowIso,
        },
        { onConflict: "store_id" }
      )
    );

    await Promise.all(allOperations);

    return jsonResponse({
      success: true,
      campaignName: preset.name,
      campaignSlug: preset.slug,
      message: `Modo ${preset.name} activado exitosamente en toda tu tienda`,
    });
  } catch (error: unknown) {
    console.error("Error aplicando campaña:", error);
    const errObj = error as any;
    const dbMessage = errObj?.message || errObj?.details || errObj?.hint;
    const message = dbMessage || (error instanceof Error ? error.message : "Error interno");
    return jsonResponse({ error: message }, 500);
  }
       }
