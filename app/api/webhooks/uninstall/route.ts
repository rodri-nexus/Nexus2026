import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Tiendanube envía store_id en el payload del webhook (ej: { store_id: 123456, event: "app/uninstalled" })
    const storeId = body.store_id || body.id || body.storeId;

    if (!storeId) {
      return NextResponse.json(
        { error: "store_id no recibido en la petición" },
        { status: 400 }
      );
    }

    const numericStoreId = Number(storeId);

    if (isNaN(numericStoreId)) {
      return NextResponse.json(
        { error: "store_id inválido" },
        { status: 400 }
      );
    }

    // Actualizar estado de la tienda en Supabase
    const { error } = await supabaseAdmin
      .from("stores")
      .update({
        is_active: false,
        uninstalled_at: new Date().toISOString(),
      })
      .eq("store_id", numericStoreId);

    if (error) {
      console.error("[Webhook Uninstall Error]:", error);
      return NextResponse.json(
        { error: "Error al actualizar el estado de la tienda" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Tienda ${numericStoreId} marcada como inactiva correctamente.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Webhook Uninstall Exception]:", err);
    return NextResponse.json(
      { error: "Error interno procesando el webhook" },
      { status: 500 }
    );
  }
}
