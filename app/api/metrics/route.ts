import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "7dias";

    // Rango de fechas
    const now = new Date();
    let startDate = new Date();

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

    // Consultar stats asociadas al usuario
    const { data: stats, error } = await supabase
      .from("widget_stats")
      .select("widget_id, event_type, value, created_at")
      .gte("created_at", startDate.toISOString());

    if (error) {
      return NextResponse.json({
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        widgets: [],
      });
    }

    let impressions = 0;
    let clicks = 0;
    let cartAdds = 0;
    let revenue = 0;

    (stats || []).forEach((s) => {
      if (s.event_type === "impression") impressions++;
      else if (s.event_type === "click") clicks++;
      else if (s.event_type === "cart_add") cartAdds++;
      else if (s.event_type === "conversion") revenue += Number(s.value || 0);
    });

    return NextResponse.json({
      summary: { impressions, clicks, cartAdds, revenue },
      widgets: [],
    });
  } catch (err) {
    return NextResponse.json(
      {
        summary: { impressions: 0, clicks: 0, cartAdds: 0, revenue: 0 },
        widgets: [],
      },
      { status: 500 }
    );
  }
  }
