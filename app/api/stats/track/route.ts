import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { widget_id, event_type, value = 0 } = body;

    if (!widget_id) {
      return NextResponse.json(
        { error: "widget_id es requerido" },
        { status: 400 }
      );
    }

    const validEvents = ["impression", "click", "cart_add", "conversion"];
    if (!event_type || !validEvents.includes(event_type)) {
      return NextResponse.json(
        { error: "event_type inválido" },
        { status: 400 }
      );
    }

    const todayDate = new Date().toISOString().split("T")[0];

    // 1. Buscar si ya existe un registro para este widget en la fecha de hoy
    const { data: existingRow, error: findError } = await supabaseAdmin
      .from("widget_stats")
      .select("id, impressions, clicks, cart_adds, revenue")
      .eq("widget_id", widget_id)
      .eq("date", todayDate)
      .maybeSingle();

    if (findError) {
      console.error("[Stats Track Find Error]:", findError);
      return NextResponse.json(
        { error: "Error consultando estadísticas" },
        { status: 500 }
      );
    }

    if (existingRow) {
      // 2a. Si ya existe, sumar al contador correspondiente
      const updateData: Record<string, any> = {};

      if (event_type === "impression") {
        updateData.impressions = (existingRow.impressions || 0) + 1;
      } else if (event_type === "click") {
        updateData.clicks = (existingRow.clicks || 0) + 1;
      } else if (event_type === "cart_add") {
        updateData.cart_adds = (existingRow.cart_adds || 0) + 1;
      } else if (event_type === "conversion") {
        updateData.revenue = Number(existingRow.revenue || 0) + Number(value || 0);
      }

      const { error: updateError } = await supabaseAdmin
        .from("widget_stats")
        .update(updateData)
        .eq("id", existingRow.id);

      if (updateError) {
        console.error("[Stats Track Update Error]:", updateError);
        return NextResponse.json(
          { error: "Error actualizando métricas" },
          { status: 500 }
        );
      }
    } else {
      // 2b. Si no existe registro para hoy, insertar nueva fila
      const insertData = {
        widget_id,
        date: todayDate,
        impressions: event_type === "impression" ? 1 : 0,
        clicks: event_type === "click" ? 1 : 0,
        cart_adds: event_type === "cart_add" ? 1 : 0,
        revenue: event_type === "conversion" ? Number(value || 0) : 0,
      };

      const { error: insertError } = await supabaseAdmin
        .from("widget_stats")
        .insert(insertData);

      if (insertError) {
        console.error("[Stats Track Insert Error]:", insertError);
        return NextResponse.json(
          { error: "Error creando métrica" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, tracked: event_type }, { status: 200 });
  } catch (err) {
    console.error("[Stats Track Exception]:", err);
    return NextResponse.json(
      { error: "Error interno al registrar estadística" },
      { status: 500 }
    );
  }
}
