import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface StoreMetrics {
  totalSales: number;
  todayOrdersCount: number;
  abandonedCartsCount: number;
  abandonedCartsAmount: number;
  lowestStockItem: { name: string; stock: number; price: string } | null;
  criticalStockProducts: Array<{ name: string; stock: number }>;
  productsCount: number;
}

async function fetchStoreMetrics(storeId: string, accessToken: string): Promise<StoreMetrics> {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const headers = {
      "Authentication": `bearer ${accessToken}`,
      "User-Agent": "NevuxSaaS (contacto@nevux.ar)",
      "Content-Type": "application/json"
    };

    const [ordersRes, draftsRes, productsRes] = await Promise.all([
      fetch(`https://api.tiendanube.com/v1/${storeId}/orders?created_at_min=${todayStr}T00:00:00Z&status=paid`, { headers }),
      fetch(`https://api.tiendanube.com/v1/${storeId}/draft_orders?status=open`, { headers }),
      fetch(`https://api.tiendanube.com/v1/${storeId}/products?per_page=50`, { headers })
    ]);

    const orders = ordersRes.ok ? await ordersRes.json() : [];
    const drafts = draftsRes.ok ? await draftsRes.json() : [];
    const products = productsRes.ok ? await productsRes.json() : [];

    const todayOrdersCount = Array.isArray(orders) ? orders.length : 0;
    const totalSales = Array.isArray(orders) 
      ? orders.reduce((sum: number, o: any) => sum + parseFloat(o.total || "0"), 0)
      : 0;

    const abandonedCartsCount = Array.isArray(drafts) ? drafts.length : 0;
    const abandonedCartsAmount = Array.isArray(drafts)
      ? drafts.reduce((sum: number, d: any) => sum + parseFloat(d.total || "0"), 0)
      : 0;

    let lowestStockItem: { name: string; stock: number; price: string } | null = null;
    const criticalStockProducts: Array<{ name: string; stock: number }> = [];

    if (Array.isArray(products)) {
      products.forEach((prod: any) => {
        const pName = typeof prod.name === 'object' ? (prod.name.es || Object.values(prod.name)[0] || "Producto") : (prod.name || "Producto");
        
        if (Array.isArray(prod.variants) && prod.variants.length > 0) {
          prod.variants.forEach((v: any) => {
            if (v.stock !== null && v.stock !== undefined) {
              const stockNum = parseInt(v.stock, 10);
              const variantLabel = v.values && v.values.length > 0 
                ? `${pName} (${v.values.map((val: any) => typeof val === 'object' ? (val.es || Object.values(val)[0]) : val).join(" / ")})`
                : pName;

              if (stockNum <= 5) {
                criticalStockProducts.push({ name: variantLabel, stock: stockNum });
              }

              if (!lowestStockItem || stockNum < lowestStockItem.stock) {
                lowestStockItem = { name: variantLabel, stock: stockNum, price: v.price || prod.price || "0" };
              }
            }
          });
        }
      });
    }

    return {
      totalSales,
      todayOrdersCount,
      abandonedCartsCount,
      abandonedCartsAmount,
      lowestStockItem,
      criticalStockProducts,
      productsCount: Array.isArray(products) ? products.length : 0
    };
  } catch (err) {
    console.error("Error fetching store metrics:", err);
    return {
      totalSales: 0,
      todayOrdersCount: 0,
      abandonedCartsCount: 0,
      abandonedCartsAmount: 0,
      lowestStockItem: null,
      criticalStockProducts: [],
      productsCount: 0
    };
  }
}

function smartLocalCopilotReply(userMsg: string, metrics: StoreMetrics): string {
  const q = (userMsg || "").toLowerCase();

  const isStockQuery = q.includes("stock") || q.includes("producto") || q.includes("agotad") || q.includes("queda") || q.includes("minimo") || q.includes("reposic");
  const isCartQuery = q.includes("carrito") || q.includes("plata") || q.includes("abandonad") || q.includes("recuper") || q.includes("pendiente") || q.includes("monto");
  const isSalesQuery = q.includes("venta") || q.includes("hoy") || q.includes("factura") || q.includes("recaud") || q.includes("orden");
  const isStrategyQuery = q.includes("estrategia") || q.includes("consejo") || q.includes("vender mas") || q.includes("promocion") || q.includes("mejora");

  // CONSULTA COMBINADA: Stock Y Carritos
  if (isStockQuery && isCartQuery) {
    let stockText = "";
    if (metrics.lowestStockItem) {
      stockText = `📦 **Producto con menos stock:** ${metrics.lowestStockItem.name} con sólo **${metrics.lowestStockItem.stock} unidad(es)** disponible(s).`;
    } else if (metrics.criticalStockProducts && metrics.criticalStockProducts.length > 0) {
      stockText = `📦 **Producto con menos stock:** ${metrics.criticalStockProducts[0].name} con **${metrics.criticalStockProducts[0].stock} unidad(es)**.`;
    } else {
      stockText = `📦 **Stock:** Tenés un inventario de ${metrics.productsCount} productos con niveles de stock saludables.`;
    }

    let cartText = "";
    if (metrics.abandonedCartsCount > 0) {
      cartText = `🛒 **Carritos abandonados:** Tenés **ARS $${metrics.abandonedCartsAmount.toLocaleString()}** acumulados en **${metrics.abandonedCartsCount} carrito(s)** pendiente(s).`;
    } else {
      cartText = `🛒 **Carritos abandonados:** Actualmente tenés **ARS $0 en carritos abandonados** (0 carritos pendientes).`;
    }

    return `${stockText}\n\n${cartText}\n\n¿Querés que prepare un mensaje para intentar recuperar esas ventas por WhatsApp?`;
  }

  // SOLO STOCK
  if (isStockQuery) {
    if (metrics.lowestStockItem) {
      return `📦 **Estado de Stock:**\n\nEl producto con menos unidades es **${metrics.lowestStockItem.name}** con **${metrics.lowestStockItem.stock} unidad(es)**.\n\nTotal de productos en nivel crítico (≤ 5 unidades): **${metrics.criticalStockProducts.length}**.`;
    }
    return `📦 **Estado de Stock:** Tu tienda tiene ${metrics.productsCount} productos con niveles de inventario óptimos.`;
  }

  // SOLO CARRITOS
  if (isCartQuery) {
    if (metrics.abandonedCartsCount > 0) {
      return `🛒 **Carritos Recuperables:**\n\nTenés **${metrics.abandonedCartsCount} carrito(s) abandonado(s)** acumulando **ARS $${metrics.abandonedCartsAmount.toLocaleString()}**.\n\nPodés ir a la pestaña 'WhatsApp & Reportes' para enviarles un recordatorio de compra.`;
    }
    return `🛒 **Carritos Abandonados:** Tenés **ARS $0** en carritos pendientes (**0 carritos abandonados** actualmente).`;
  }

  // SOLO VENTAS
  if (isSalesQuery) {
    return `📊 **Ventas de Hoy:**\n\nLlevás **ARS $${metrics.totalSales.toLocaleString()}** en **${metrics.todayOrdersCount} orden(es)** hoy.\n\nProyección a fin de semana: **ARS $${(metrics.totalSales * 7.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}**.`;
  }

  // ESTRATEGIA
  if (isStrategyQuery) {
    if (metrics.abandonedCartsCount > 0) {
      return `💡 **Estrategia Recomendada:**\n\nTu mayor oportunidad hoy es recuperar los **${metrics.abandonedCartsCount} carritos abandonados** (acumulan **ARS $${metrics.abandonedCartsAmount.toLocaleString()}**). Te aconsejo enviar un cupón por WhatsApp.`;
    }
    return `💡 **Estrategia Recomendada:**\n\nPodés lanzar una oferta relámpago o promocionar tu producto estrella en redes sociales para incrementar el flujo de caja.`;
  }

  // RESUMEN GENERAL
  return `🇦🇷 **Estado de tu tienda:**\n• **Ventas Hoy:** ARS $${metrics.totalSales.toLocaleString()} (${metrics.todayOrdersCount} órdenes)\n• **Carritos Abandonados:** ARS $${metrics.abandonedCartsAmount.toLocaleString()} (${metrics.abandonedCartsCount} carritos)\n• **Producto menor stock:** ${metrics.lowestStockItem ? `${metrics.lowestStockItem.name} (${metrics.lowestStockItem.stock} u.)` : "Stock OK"}\n\n¿En qué área querés profundizar?`;
}

export async function GET() {
  try {
    const { data: store } = await supabase.from("stores").select("*").limit(1).single();
    
    let metrics: StoreMetrics = {
      totalSales: 0,
      todayOrdersCount: 0,
      abandonedCartsCount: 0,
      abandonedCartsAmount: 0,
      lowestStockItem: null,
      criticalStockProducts: [],
      productsCount: 0
    };

    if (store?.store_id && store?.access_token) {
      metrics = await fetchStoreMetrics(store.store_id, store.access_token);
    }

    return NextResponse.json({ success: true, metrics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const { data: store } = await supabase.from("stores").select("*").limit(1).single();

    let metrics: StoreMetrics = {
      totalSales: 0,
      todayOrdersCount: 0,
      abandonedCartsCount: 0,
      abandonedCartsAmount: 0,
      lowestStockItem: null,
      criticalStockProducts: [],
      productsCount: 0
    };

    if (store?.store_id && store?.access_token) {
      metrics = await fetchStoreMetrics(store.store_id, store.access_token);
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `
sos el Nevux Copilot IA, un gerente comercial para e-commerce en Argentina.
Tono: CEO Argentino (profesional, directo, claro, cálido, voseo argentino suave).
DEBES responder de forma DIRECTA Y ESPECÍFICA a la consulta del usuario. No des un resumen genérico si el usuario te preguntó algo específico.

DATOS DE TIENDANUBE EN TIEMPO REAL:
- Ventas Hoy: ARS $${metrics.totalSales} (${metrics.todayOrdersCount} órdenes pagadas)
- Carritos Abandonados: ${metrics.abandonedCartsCount} carritos acumulando ARS $${metrics.abandonedCartsAmount}
- Producto con Menos Stock: ${metrics.lowestStockItem ? `${metrics.lowestStockItem.name} (${metrics.lowestStockItem.stock} unidades)` : "Ninguno en riesgo"}
- Total Productos en Stock Crítico (<= 5 unidades): ${metrics.criticalStockProducts.length}

CONSULTA DEL COMERCIANTE:
"${message}"

INSTRUCCIONES:
- Respondé directamente a las dudas puntuales manifestadas en la consulta.
- Si pregunta por stock y carritos, mencioná ambos datos explícitamente en el primer párrafo.
`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return NextResponse.json({ reply: text });
          }
        }
      } catch (geminiErr) {
        console.error("Gemini fallback:", geminiErr);
      }
    }

    const reply = smartLocalCopilotReply(message, metrics);
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Error in virtual-salesman POST:", error);
    return NextResponse.json({ reply: "Tuve un inconveniente de conexión con Tiendanube. ¿Probamos de nuevo?" }, { status: 500 });
  }
                                   }
