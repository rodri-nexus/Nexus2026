// app/api/analytics/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface TiendanubeProductItem {
  name?: string;
  quantity?: number;
  price?: string | number;
}

interface TiendanubeOrder {
  id: number | string;
  created_at: string;
  total: string | number;
  payment_status?: string;
  status?: string;
  customer?: {
    name?: string;
    email?: string;
  };
  products?: TiendanubeProductItem[];
}

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
      .select("store_id, access_token")
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
    const accessToken = store.access_token;

    // 2. Ventana de tiempo: últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isoThirtyDaysAgo = thirtyDaysAgo.toISOString();

    // 3. Consultar ventas REALES desde la API oficial de Tiendanube
    let realOrdersList: Array<{
      id: string;
      order_id: string;
      total: number;
      created_at: string;
      status: string;
      customer_name: string;
      products: Array<{ name: string; quantity: number; price: number }>;
      attributed_widget: string | null;
    }> = [];

    let totalStoreRevenue = 0;
    let totalOrdersCount = 0;

    if (accessToken) {
      try {
        const tnRes = await fetch(
          `https://api.tiendanube.com/v1/${storeId}/orders?created_at_min=${isoThirtyDaysAgo}&per_page=100`,
          {
            headers: {
              Authentication: `bearer ${accessToken}`,
              "User-Agent": "Nevux (soportenevux@gmail.com)",
            },
            next: { revalidate: 0 },
          }
        );

        if (tnRes.ok) {
          const tnOrders: TiendanubeOrder[] = await tnRes.json();
          if (Array.isArray(tnOrders)) {
            realOrdersList = tnOrders.map((ord) => {
              const orderTotal = parseFloat(String(ord.total)) || 0;
              const isPaid =
                ord.payment_status === "paid" || ord.status === "closed" || ord.status === "open";
              
              if (isPaid) {
                totalStoreRevenue += orderTotal;
                totalOrdersCount += 1;
              }

              const prods = (ord.products || []).map((p) => ({
                name: p.name || "Producto sin nombre",
                quantity: Number(p.quantity) || 1,
                price: parseFloat(String(p.price)) || 0,
              }));

              return {
                id: String(ord.id),
                order_id: String(ord.id),
                total: orderTotal,
                created_at: ord.created_at,
                status: ord.payment_status || ord.status || "paid",
                customer_name: ord.customer?.name || "Cliente Tiendanube",
                products: prods,
                attributed_widget: null,
              };
            });

            // Guardar o actualizar en caché de Supabase
            if (realOrdersList.length > 0) {
              const ordersToUpsert = realOrdersList.map((o) => ({
                store_id: storeId,
                order_id: o.order_id,
                total: o.total,
                payment_status: o.status,
                customer_name: o.customer_name,
                products_json: o.products,
                created_at: o.created_at,
              }));

              await supabaseAdmin
                .from("orders")
                .upsert(ordersToUpsert, { onConflict: "order_id" });
            }
          }
        } else {
          console.warn("[Tiendanube Orders API Status]:", tnRes.status);
        }
      } catch (tnErr) {
        console.error("[Tiendanube Orders Fetch Exception]:", tnErr);
      }
    }

    // Fallback a la tabla 'orders' si la API de Tiendanube no devolvió directamente
    if (realOrdersList.length === 0) {
      const { data: dbOrders } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("store_id", storeId)
        .gte("created_at", isoThirtyDaysAgo)
        .order("created_at", { ascending: false });

      if (dbOrders && dbOrders.length > 0) {
        realOrdersList = dbOrders.map((ord) => {
          const tot = Number(ord.total) || 0;
          totalStoreRevenue += tot;
          totalOrdersCount += 1;
          return {
            id: ord.id,
            order_id: ord.order_id,
            total: tot,
            created_at: ord.created_at,
            status: ord.payment_status || "paid",
            customer_name: ord.customer_name || "Cliente Tiendanube",
            products: Array.isArray(ord.products_json)
              ? ord.products_json
              : [],
            attributed_widget: ord.attributed_widget || null,
          };
        });
      }
    }

    // 4. Consultar eventos de widgets desde Supabase
    let eventList: Array<{
      widget_slug: string;
      event_type: string;
      event_value: number;
      created_at: string;
    }> = [];

    const { data: events } = await supabaseAdmin
      .from("widget_events")
      .select("*")
      .eq("store_id", storeId)
      .gte("created_at", isoThirtyDaysAgo);

    if (events && events.length > 0) {
      eventList = events.map((ev) => ({
        widget_slug: ev.widget_slug || "otros",
        event_type: ev.event_type || "view",
        event_value: Number(ev.event_value) || 0,
        created_at: ev.created_at,
      }));
    }

    // 5. Mapear métricas de widgets
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
      const val = ev.event_value || 0;
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
        widgetMap[slug].conversions += 1;
      } else if (ev.event_type === "email_captured") {
        ruletaLeads += 1;
        widgetMap[slug].conversions += 1;
      } else if (ev.event_type === "coupon_copied") {
        cuponesCopied += 1;
        widgetMap[slug].clicks += 1;
      } else if (
        ev.event_type === "bundle_added" ||
        ev.event_type === "conversion"
      ) {
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

    // Atribuir órdenes a widgets si hubo eventos de widgets
    if (eventList.length > 0 && realOrdersList.length > 0) {
      const conversionEvents = eventList.filter((e) =>
        ["bundle_added", "conversion", "coupon_copied", "click"].includes(
          e.event_type
        )
      );

      if (conversionEvents.length > 0) {
        realOrdersList = realOrdersList.map((ord) => {
          if (!ord.attributed_widget && conversionEvents.length > 0) {
            const lastEv = conversionEvents[conversionEvents.length - 1];
            return {
              ...ord,
              attributed_widget: lastEv.widget_slug,
            };
          }
          return ord;
        });
      }
    }

    const subscriptionCost = 30000;
    const averageTicket =
      totalOrdersCount > 0
        ? Math.round(totalStoreRevenue / totalOrdersCount)
        : 0;

    const roiMultiplier =
      totalStoreRevenue > 0
        ? Number((totalStoreRevenue / subscriptionCost).toFixed(1))
        : 1.0;

    return NextResponse.json({
      hasData: realOrdersList.length > 0 || eventList.length > 0,
      totalStoreRevenue,
      totalOrdersCount,
      averageTicket,
      totalEvents: eventList.length,
      totalExtraRevenue,
      subscriptionCost,
      roiMultiplier,
      ordersList: realOrdersList,
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
