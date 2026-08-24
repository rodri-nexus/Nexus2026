import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Verificar autenticación del usuario
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "7dias";

    // 2. Calcular rango de fechas
    const startDate = new Date();

    if (period === "hoy") {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "ayer") {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "7dias") {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];

    // 3. Obtener la lista de widgets del usuario
    const { data: userWidgets, error: widgetsError } = await supabase
      .from("widgets")
      .select("id, widget_slug, widget_type, config")
      .eq("user_id", user.id);

    if (widgetsError || !userWidgets || userWidgets.length === 0) {
      return NextResponse.json({
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        widgets: [],
      });
    }

    const widgetIds = userWidgets.map((w) => w.id);

    // 4. Consultar widget_stats para los widgets del usuario desde startDate
    let query = supabase
      .from("widget_stats")
      .select("widget_id, date, impressions, clicks, cart_adds, revenue")
      .in("widget_id", widgetIds)
      .gte("date", formattedStartDate);

    if (period === "ayer") {
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte("date", endDate.toISOString().split("T")[0]);
    }

    const { data: stats, error: statsError } = await query;

    if (statsError) {
      console.error("[Metrics API Error]:", statsError);
      return NextResponse.json({
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        widgets: [],
      });
    }

    // 5. Acumular métricas totales y por widget
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalCartAdds = 0;
    let totalRevenue = 0;

    const widgetStatsMap: Record<
      string,
      { impressions: number; clicks: number; cartAdds: number; revenue: number }
    > = {};

    (stats || []).forEach((row) => {
      const wId = row.widget_id;
      const imp = Number(row.impressions || 0);
      const clk = Number(row.clicks || 0);
      const cart = Number(row.cart_adds || 0);
      const rev = Number(row.revenue || 0);

      totalImpressions += imp;
      totalClicks += clk;
      totalCartAdds += cart;
      totalRevenue += rev;

      if (!widgetStatsMap[wId]) {
        widgetStatsMap[wId] = {
          impressions: 0,
          clicks: 0,
          cartAdds: 0,
          revenue: 0,
        };
      }

      widgetStatsMap[wId].impressions += imp;
      widgetStatsMap[wId].clicks += clk;
      widgetStatsMap[wId].cartAdds += cart;
      widgetStatsMap[wId].revenue += rev;
    });

    // 6. Formatear lista de widgets con métricas para la UI
    const widgetsPerformance = userWidgets.map((w) => {
      const st = widgetStatsMap[w.id] || {
        impressions: 0,
        clicks: 0,
        cartAdds: 0,
        revenue: 0,
      };

      const widgetName =
        w.config?.title ||
        w.config?.banner_text ||
        w.widget_type ||
        w.widget_slug ||
        "Widget sin título";

      return {
        id: w.id,
        name: widgetName,
        type: w.widget_type || w.widget_slug,
        impressions: st.impressions,
        clicks: st.clicks,
        cartAdds: st.cartAdds,
        revenue: st.revenue,
      };
    });

    return NextResponse.json({
      summary: {
        impressions: totalImpressions,
        clicks: totalClicks,
        cartAdds: totalCartAdds,
        revenue: totalRevenue,
      },
      widgets: widgetsPerformance,
    });
  } catch (err: any) {
    console.error("[Metrics API Exception]:", err);
    return NextResponse.json(
      {
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        widgets: [],
      },
      { status: 500 }
    );
  }
        }
