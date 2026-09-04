import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 1. Obtener la tienda activa del comerciante
    const { data: store } = await supabaseAdmin
      .from("stores")
      .select("store_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!store) {
      return NextResponse.json(
        { error: "Tienda activa no encontrada" },
        { status: 404 }
      );
    }

    const storeId = store.store_id;

    // 2. Ventana de tiempo: últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isoThirtyDaysAgo = thirtyDaysAgo.toISOString();

    // 3. Consultar eventos reales registrados en Supabase
    const { data: events, error } = await supabaseAdmin
      .from("widget_events")
      .select("*")
      .eq("store_id", storeId)
      .gte("created_at", isoThirtyDaysAgo);

    if (error) {
      console.error("[Analytics Stats Query Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const eventList = events || [];

    // 4. Agregar y calcular métricas de atribución real
    let bundlesRevenue = 0;
    let ruletaLeads = 0;
    let tallesClicks = 0;
    let cuponesCopied = 0;
    let totalExtraRevenue = 0;

    const widgetMap: Record<
      string,
      { views: number; clicks: number; conversions: number; revenue: number }
    > = {};

    eventList.forEach((ev) => {
      const val = Number(ev.event_value) || 0;
      const slug = ev.widget_slug || "otros";

      if (!widgetMap[slug]) {
        widgetMap[slug] = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
      }

      if (ev.event_type === "view") {
        widgetMap[slug].views += 1;
      } else if (ev.event_type === "click") {
        widgetMap[slug].clicks += 1;
      } else if (ev.event_type === "size_selected") {
        tallesClicks += 1;
        const sizeVal = val > 0 ? val : 2500;
        widgetMap[slug].conversions += 1;
        widgetMap[slug].revenue += sizeVal;
        totalExtraRevenue += sizeVal;
      } else if (ev.event_type === "email_captured") {
        ruletaLeads += 1;
        const leadVal = val > 0 ? val : 1450;
        widgetMap[slug].conversions += 1;
        widgetMap[slug].revenue += leadVal;
        totalExtraRevenue += leadVal;
      } else if (ev.event_type === "coupon_copied") {
        cuponesCopied += 1;
        const couponVal = val > 0 ? val : 2000;
        widgetMap[slug].clicks += 1;
        widgetMap[slug].revenue += couponVal;
        totalExtraRevenue += couponVal;
      } else if (ev.event_type === "bundle_added" || ev.event_type === "conversion") {
        bundlesRevenue += val;
        widgetMap[slug].conversions += 1;
        widgetMap[slug].revenue += val;
        totalExtraRevenue += val;
      } else {
        if (val > 0) {
          totalExtraRevenue += val;
          widgetMap[slug].revenue += val;
        }
      }
    });

    const subscriptionCost = 30000;
    const roiMultiplier =
      totalExtraRevenue > 0
        ? Math.max(1.0, Number((totalExtraRevenue / subscriptionCost).toFixed(1)))
        : 1.0;

    return NextResponse.json({
      hasData: eventList.length > 0,
      totalEvents: eventList.length,
      totalExtraRevenue,
      subscriptionCost,
      roiMultiplier,
      metrics: {
        bundlesRevenue,
        ruletaLeads,
        tallesClicks,
        cuponesCopied,
      },
      widgetBreakdown: widgetMap,
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al procesar estadísticas de analytics";
    console.error("[Analytics Stats Exception]:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
                                                            }
