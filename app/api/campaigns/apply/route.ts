// app/api/campaigns/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase-server";
import { createClient as createDirectClient } from "@supabase/supabase-js";
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
   ENDPOINT PRINCIPAL POST (ALTA VELOCIDAD)
═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    // 1. Validar usuario logueado
    const serverSupabase = createServerClient();
    const {
      data: { user },
      error: authError,
    } = await serverSupabase.auth.getUser();

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
      return jsonResponse({ error: `Campaña no válida: ${campaign_slug}` }, 404);
    }

    // 2. Conectar cliente de alta velocidad (sin trabas de RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const adminSupabase = createDirectClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 3. Validar tienda
    const { data: stores } = await adminSupabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .limit(1);

    if (!stores || stores.length === 0) {
      return jsonResponse({ error: "Tienda no encontrada o no autorizada" }, 403);
    }

    // 4. Obtener widgets actuales
    const { data: currentWidgetsData } = await adminSupabase
      .from("widgets")
      .select("id, widget_slug, config, is_active, target_type")
      .eq("store_id", store_id);

    const currentWidgets = currentWidgetsData || [];

    // 5. Guardar snapshot de seguridad si no existe
    const { data: existingSnapshots } = await adminSupabase
      .from("campaign_snapshots")
      .select("id")
      .eq("store_id", store_id)
      .limit(1);

    if ((!existingSnapshots || existingSnapshots.length === 0) && currentWidgets.length > 0) {
      const snapshotsToInsert = currentWidgets.map((w) => ({
        user_id: user.id,
        store_id,
        campaign_slug,
        widget_id: w.id,
        original_config: w.config || {},
        original_is_active: w.is_active ?? true,
      }));

      await adminSupabase.from("campaign_snapshots").insert(snapshotsToInsert);
    }

    // 6. Aplicar los 10 widgets temáticos
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

        await adminSupabase
          .from("widgets")
          .update({
            config: updatedConfig,
            is_active: true,
            updated_at: nowIso,
          })
          .eq("id", existing.id);
      } else {
        await adminSupabase.from("widgets").insert({
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

    // 7. Guardar campaña activa de forma directa y limpia
    await adminSupabase.from("active_campaigns").delete().eq("store_id", store_id);
    await adminSupabase.from("active_campaigns").insert({
      user_id: user.id,
      store_id,
      campaign_slug,
      activated_at: nowIso,
    });

    return jsonResponse({
      success: true,
      campaignName: preset.name,
      campaignSlug: preset.slug,
      message: `Modo ${preset.name} activado exitosamente en toda tu tienda`,
    });
  } catch (error: unknown) {
    console.error("Error aplicando campaña:", error);
    const message = error instanceof Error ? error.message : "Error al aplicar campaña";
    return jsonResponse({ error: message }, 500);
  }
         }
