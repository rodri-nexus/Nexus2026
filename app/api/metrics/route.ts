import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface WidgetConfig {
  title?: string;
  banner_text?: string;
  [key: string]: unknown;
}

interface UserWidget {
  id: string;
  widget_slug: string;
  widget_type: string;
  config: WidgetConfig | null;
}

interface WidgetStatRow {
  widget_id: string;
  date: string;
  impressions?: number | null;
  clicks?: number | null;
  cart_adds?: number | null;
  revenue?: number | null;
}

export async function GET(req: Request) {
  try {
    const supabase = createClient();

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
    const now = new Date();
    const startDate = new Date();
    let endDate: Date | null = null;
    let daysToInclude = 7;

    if (period === "hoy") {
      startDate.setHours(0, 0, 0, 0);
      daysToInclude = 1;
    } else if (period === "ayer") {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      daysToInclude = 1;
    } else if (period === "7dias") {
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      daysToInclude = 7;
    } else {
      // "30dias" o por defecto
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
      daysToInclude = 30;
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];

    // 3. Obtener la lista de widgets del usuario usando supabaseAdmin
    const { data: userWidgetsData, error: widgetsError } = await supabaseAdmin
      .from("widgets")
      .select("id, widget_slug, widget_type, config")
      .eq("user_id", user.id);

    const userWidgets = (userWidgetsData as UserWidget[]) || [];

    if (widgetsError || userWidgets.length === 0) {
      return NextResponse.json({
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        timeline: [],
        widgets: [],
      });
    }

    const widgetIds = userWidgets.map((w) => w.id);

    // 4. Consultar widget_stats para los widgets del usuario
    let query = supabaseAdmin
      .from("widget_stats")
      .select("widget_id, date, impressions, clicks, cart_adds, revenue")
      .in("widget_id", widgetIds)
      .gte("date", formattedStartDate);

    if (endDate) {
      query = query.lte("date", endDate.toISOString().split("T")[0]);
    }

    const { data: statsData, error: statsError } = await query;
    const stats = (statsData as WidgetStatRow[]) || [];

    if (statsError) {
      console.error("[Metrics API Error]:", statsError);
      return NextResponse.json({
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        timeline: [],
        widgets: [],
      });
    }

    // 5. Inicializar el mapa de timeline diario
    const dailyMap: Record<
      string,
      { date: string; impressions: number; clicks: number; cartAdds: number; revenue: number }
    > = {};

    if (period === "hoy") {
      const dStr = now.toISOString().split("T")[0];
      dailyMap[dStr] = { date: dStr, impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 };
    } else if (period === "ayer") {
      const dStr = startDate.toISOString().split("T")[0];
      dailyMap[dStr] = { date: dStr, impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 };
    } else {
      for (let i = 0; i < daysToInclude; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dStr = d.toISOString().split("T")[0];
        dailyMap[dStr] = { date: dStr, impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 };
      }
    }

    // 6. Acumular métricas totales, por widget y por fecha
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalCartAdds = 0;
    let totalRevenue = 0;

    const widgetStatsMap: Record<
      string,
      { impressions: number; clicks: number; cartAdds: number; revenue: number }
    > = {};

    stats.forEach((row) => {
      const wId = row.widget_id;
      const dStr = row.date;
      const imp = Number(row.impressions) || 0;
      const clk = Number(row.clicks) || 0;
      const cart = Number(row.cart_adds) || 0;
      const rev = Number(row.revenue) || 0;

      totalImpressions += imp;
      totalClicks += clk;
      totalCartAdds += cart;
      totalRevenue += rev;

      // Por widget
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

      // Por timeline diario
      if (dailyMap[dStr]) {
        dailyMap[dStr].impressions += imp;
        dailyMap[dStr].clicks += clk;
        dailyMap[dStr].cartAdds += cart;
        dailyMap[dStr].revenue += rev;
      }
    });

    const timeline = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    // 7. Formatear lista de widgets con métricas para la UI
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
      timeline,
      widgets: widgetsPerformance,
    });
  } catch (err: unknown) {
    console.error("[Metrics API Exception]:", err);
    return NextResponse.json(
      {
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        timeline: [],
        widgets: [],
      },
      { status: 500 }
    );
  }
    }
