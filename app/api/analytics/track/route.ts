import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Manejo de preflight CORS (necesario porque el script corre en el dominio de cada tienda)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      store_id,
      widget_id,
      widget_slug,
      event_type,
      event_value,
      session_id,
      product_id,
      metadata,
    } = body;

    // Validación básica de campos obligatorios
    if (!store_id || !widget_slug || !event_type) {
      return NextResponse.json(
        { error: "store_id, widget_slug y event_type son obligatorios" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Insertar el evento en Supabase usando supabaseAdmin (ignora RLS para inserción rápida)
    const { error } = await supabaseAdmin.from("widget_events").insert({
      store_id: Number(store_id),
      widget_id: widget_id || null,
      widget_slug: String(widget_slug),
      event_type: String(event_type),
      event_value: Number(event_value) || 0,
      session_id: session_id ? String(session_id) : null,
      product_id: product_id ? Number(product_id) : null,
      metadata: metadata && typeof metadata === "object" ? metadata : {},
    });

    if (error) {
      console.error("[Analytics Track Error]:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Error al procesar el evento";
    console.error("[Analytics Track Exception]:", errorMsg);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500, headers: corsHeaders }
    );
  }
      }
