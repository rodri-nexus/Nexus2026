import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper for ARS formatting
function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Internal metric fetcher from Tiendanube API
async function fetchStoreMetrics(storeId: string, accessToken: string) {
  const headers = {
    "Authorization": `Bearer ${accessToken}`,
    "User-Agent": "NevuxApp (info@nevux.ar)",
    "Content-Type": "application/json",
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  let salesToday = 0;
  let ordersToday = 0;
  let abandonedCartsCount = 0;
  let abandonedCartsValue = 0;
  let criticalStockProducts: string[] = [];

  try {
    // 1. Paid Orders Today
    const ordersRes = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/orders?status=paid&created_at_min=${todayISO}`,
      { headers }
    );
    if (ordersRes.ok) {
      const orders = await ordersRes.json();
      if (Array.isArray(orders)) {
        ordersToday = orders.length;
        salesToday = orders.reduce((sum: number, o: any) => sum + parseFloat(o.total || "0"), 0);
      }
    }

    // 2. Draft Orders (Abandoned Carts)
    const cartsRes = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/draft_orders?status=open`,
      { headers }
    );
    if (cartsRes.ok) {
      const carts = await cartsRes.json();
      if (Array.isArray(carts)) {
        abandonedCartsCount = carts.length;
        abandonedCartsValue = carts.reduce((sum: number, c: any) => sum + parseFloat(c.total || "0"), 0);
      }
    }

    // 3. Low Stock Products
    const productsRes = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/products?per_page=50`,
      { headers }
    );
    if (productsRes.ok) {
      const products = await productsRes.json();
      if (Array.isArray(products)) {
        products.forEach((p: any) => {
          const title = p.name?.es || p.name?.en || "Producto";
          p.variants?.forEach((v: any) => {
            const stock = v.stock;
            if (stock !== null && stock !== undefined && stock <= 5) {
              const varName = v.values?.map((val: any) => val.es).join(" / ");
              criticalStockProducts.push(`${title}${varName ? ` (${varName})` : ''} - Stock: ${stock}`);
            }
          });
        });
      }
    }
  } catch (e: any) {
    console.error(`Error fetching metrics for store ${storeId}:`, e.message);
  }

  return {
    salesToday,
    ordersToday,
    abandonedCartsCount,
    abandonedCartsValue,
    criticalStockProducts,
  };
}

export async function GET(request: Request) {
  return handleDailyReportExecution(request);
}

export async function POST(request: Request) {
  return handleDailyReportExecution(request);
}

async function handleDailyReportExecution(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetStoreId = searchParams.get("store_id");

    // Fetch target store(s)
    let query = supabase.from("stores").select("store_id, access_token, whatsapp_phone, daily_report_enabled");
    
    if (targetStoreId) {
      query = query.eq("store_id", targetStoreId);
    }

    const { data: stores, error } = await query;

    if (error || !stores || stores.length === 0) {
      // Fallback response if DB table query returns empty
      return NextResponse.json({
        success: true,
        processedCount: 0,
        message: "No hay tiendas configuradas para envío diario en este momento.",
      });
    }

    const results = [];

    for (const store of stores) {
      if (!store.whatsapp_phone || store.daily_report_enabled === false) {
        continue;
      }

      const metrics = await fetchStoreMetrics(store.store_id, store.access_token);

      // Construct "CEO Argentino" daily report text
      const reportMessage = `🇦🇷 *REPORTE DIARIO NEVUX COPILOT - 20:00 HS*

Hola! Acá tenés el balance comercial de hoy en tu tienda:

📊 *RESUMEN DE HOY:*
• Ventas Concretadas: ${formatARS(metrics.salesToday)} (${metrics.ordersToday} órdenes)
• Carritos En Espera: ${formatARS(metrics.abandonedCartsValue)} (${metrics.abandonedCartsCount} pendientes)
• Alertas de Stock Crítico: ${metrics.criticalStockProducts.length} productos con <= 5 unidades.

💡 *RECOMENDACIÓN COMERCIAL:*
${
  metrics.abandonedCartsCount > 0
    ? `Llevás ${formatARS(metrics.abandonedCartsValue)} estancados en carritos abandonados. Te sugiero enviarles una plantilla de recuperación ahora mismo.`
    : `Día positivo. Sigamos impulsando el catálogo principal.`
}

_Nevux Copilot IA - Tu Gerente Comercial 24/7_`;

      // Dispatch to WhatsApp sender API
      const originUrl = new URL(request.url).origin;
      const sendRes = await fetch(`${originUrl}/api/whatsapp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: store.whatsapp_phone,
          message: reportMessage,
          type: "daily_report",
          store_id: store.store_id,
        }),
      });

      const sendData = await sendRes.json();

      results.push({
        store_id: store.store_id,
        phone: store.whatsapp_phone,
        metrics,
        whatsappResult: sendData,
      });
    }

    return NextResponse.json({
      success: true,
      processedCount: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error ejecutando Cron Daily Report", details: err.message },
      { status: 500 }
    );
  }
  }
