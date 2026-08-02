import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("store_id");
  const productId = searchParams.get("product_id");

  if (!storeId) {
    return NextResponse.json({ error: "store_id requerido" }, { status: 400 });
  }

  const supabase = createClient();

  // Buscar widgets activos para esta tienda
  let query = supabase
    .from("widgets")
    .select("*")
    .eq("store_id", parseInt(storeId, 10))
    .eq("is_active", true);

  // Si hay product_id, traer widgets de ese producto + widgets para "all"
  if (productId) {
    query = query.or(`target_type.eq.all,and(target_type.eq.product,target_product_id.eq.${productId})`);
  }

  const { data: widgets, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Traer las definiciones para completar info
  const { data: definitions } = await supabase
    .from("widget_definitions")
    .select("*")
    .in("slug", widgets?.map((w) => w.widget_slug) || []);

  const enrichedWidgets = (widgets || []).map((w) => ({
    ...w,
    definition: definitions?.find((d) => d.slug === w.widget_slug) || null,
  }));

  return NextResponse.json({ widgets: enrichedWidgets });
  }
