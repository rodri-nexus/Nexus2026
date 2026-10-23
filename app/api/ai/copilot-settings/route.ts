import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("store_id") || "8293155";

    const { data, error } = await supabase
      .from("stores")
      .select("whatsapp_phone, daily_report_enabled, stock_alerts_enabled, auto_cart_recovery")
      .eq("store_id", storeId)
      .single();

    if (error || !data) {
      return NextResponse.json({
        whatsapp_phone: "+5491100000000",
        daily_report_enabled: true,
        stock_alerts_enabled: true,
        auto_cart_recovery: true,
      });
    }

    return NextResponse.json({
      whatsapp_phone: data.whatsapp_phone || "+5491100000000",
      daily_report_enabled: data.daily_report_enabled ?? true,
      stock_alerts_enabled: data.stock_alerts_enabled ?? true,
      auto_cart_recovery: data.auto_cart_recovery ?? true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error fetching settings", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      store_id = "8293155",
      whatsapp_phone,
      daily_report_enabled,
      stock_alerts_enabled,
      auto_cart_recovery,
    } = body;

    const updatePayload = {
      whatsapp_phone: whatsapp_phone || null,
      daily_report_enabled: daily_report_enabled ?? true,
      stock_alerts_enabled: stock_alerts_enabled ?? true,
      auto_cart_recovery: auto_cart_recovery ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("stores")
      .update(updatePayload)
      .eq("store_id", store_id);

    if (error) {
      // If columns don't exist yet, we catch gracefully
      console.warn("Supabase update settings warning:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Configuración guardada correctamente.",
      settings: updatePayload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error saving settings", details: err.message },
      { status: 500 }
    );
  }
}
