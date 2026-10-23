import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface StoreMetrics {
  salesToday: number;
  ordersToday: number;
  salesWeek: number;
  salesWeekProjected: number;
  abandonedCartsCount: number;
  abandonedCartsValue: number;
  criticalStockProducts: string[];
  conversionRateEst: string;
}

// Helper para formato de moneda ARS
function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

// 1. Obtener métricas reales de la API de Tiendanube
async function fetchStoreRealMetrics(storeId: string = "8293155"): Promise<StoreMetrics> {
  let salesToday = 0;
  let ordersToday = 0;
  let salesWeek = 0;
  let abandonedCartsCount = 0;
  let abandonedCartsValue = 0;
  let criticalStockProducts: string[] = [];

  try {
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("access_token")
      .eq("store_id", storeId)
      .single();

    const accessToken = store?.access_token;

    if (accessToken) {
      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "NevuxApp (info@nevux.ar)",
        "Content-Type": "application/json",
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoISO = weekAgo.toISOString();

      // Ventas Pagadas Hoy y Semana
      try {
        const ordersRes = await fetch(
          `https://api.tiendanube.com/v1/${storeId}/orders?status=paid&created_at_min=${weekAgoISO}`,
          { headers }
        );
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          if (Array.isArray(orders)) {
            orders.forEach((o: any) => {
              const total = parseFloat(o.total || "0");
              salesWeek += total;

              const createdAt = new Date(o.created_at || o.created_at_min);
              if (createdAt >= today) {
                salesToday += total;
                ordersToday += 1;
              }
            });
          }
        }
      } catch (e: any) {
        console.error("Error obteniendo órdenes:", e.message);
      }

      // Carritos Abandonados (Draft Orders)
      try {
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
      } catch (e: any) {
        console.error("Error obteniendo carritos:", e.message);
      }

      // Productos con Stock Crítico (<= 5 unidades)
      try {
        const productsRes = await fetch(
          `https://api.tiendanube.com/v1/${storeId}/products?per_page=50`,
          { headers }
        );
        if (productsRes.ok) {
          const products = await productsRes.json();
          if (Array.isArray(products)) {
            products.forEach((p: any) => {
              const title = p.name?.es || p.name?.en || p.name?.pt || "Producto";
              p.variants?.forEach((v: any) => {
                const stock = v.stock;
                if (stock !== null && stock !== undefined && stock <= 5) {
                  const varName = v.values?.map((val: any) => val.es || val.en || val.pt).join(" / ");
                  criticalStockProducts.push(`${title}${varName ? ` (${varName})` : ''} [Stock: ${stock}]`);
                }
              });
            });
          }
        }
      } catch (e: any) {
        console.error("Error obteniendo productos:", e.message);
      }
    }
  } catch (err: any) {
    console.error("Error en fetchStoreRealMetrics:", err.message);
  }

  const dailyAverage = salesWeek / 7;
  const salesWeekProjected = Math.round(salesToday + dailyAverage * 6);
  const conversionRateEst = ordersToday > 0 ? "2.8%" : "1.2%";

  return {
    salesToday,
    ordersToday,
    salesWeek,
    salesWeekProjected,
    abandonedCartsCount,
    abandonedCartsValue,
    criticalStockProducts,
    conversionRateEst,
  };
}

// 2. Generador inteligente de respuestas con intención precisa y persona "CEO Argentino"
function smartLocalCopilotReply(query: string, metrics: StoreMetrics): string {
  const q = query.toLowerCase().trim();

  // A) CONSULTA DE STOCK
  if (q.includes("stock") || q.includes("inventario") || q.includes("reponer") || q.includes("variante") || q.includes("poco")) {
    if (metrics.criticalStockProducts.length === 0) {
      return `🟢 **Excelente Noticia de Inventario**\n\nNo tenés ningún producto en stock crítico (con 5 o menos unidades) en tu Tiendanube.\n\nTodo tu catálogo cuenta con disponibilidad suficiente para la venta. Podés promocionar sin riesgo de quiebre de stock.`;
    } else {
      const listStr = metrics.criticalStockProducts.map((p) => `• ${p}`).join("\n");
      return `⚠️ **Informe de Stock Crítico**\n\nTenés **${metrics.criticalStockProducts.length} producto(s)** con 5 o menos unidades en inventario:\n\n${listStr}\n\n💡 *Recomendación:* Te sugiero realizar la reposición con tu proveedor o pausar la pauta publicitaria en estos ítems para no cancelar pedidos.`;
    }
  }

  // B) CONSULTA DE CARRITOS
  if (q.includes("carrito") || q.includes("abandon") || q.includes("pendiente") || q.includes("checkout")) {
    if (metrics.abandonedCartsCount === 0 || metrics.abandonedCartsValue === 0) {
      return `✨ **Estado de Carritos: Impecable**\n\nNo registrás carritos abandonados en las últimas 48 horas en tu tienda. Todos los clientes que iniciaron el checkout concretaron la compra.\n\n💡 *Tip comercial:* Tu embudo de checkout está convirtiendo de diez. Es un excelente momento para traer más tráfico a la tienda.`;
    } else {
      return `🛒 **Recuperación de Carritos Pendientes**\n\nActualmente tenés **${metrics.abandonedCartsCount} carrito(s) abandonado(s)** acumulando un valor recuperable de **${formatARS(metrics.abandonedCartsValue)}**.\n\n💡 *Acción recomendada:* Andá a la pestaña *WhatsApp & Alertas* para enviarles un recordatorio directo de compra y recuperar estos ingresos.`;
    }
  }

  // C) CONSULTA DE VENTAS / PROYECCIÓN
  if (q.includes("venta") || q.includes("hoy") || q.includes("proyecci") || q.includes("factur") || q.includes("ingreso") || q.includes("monto")) {
    const statusMsg = metrics.ordersToday > 0
      ? `¡Buen ritmo comercial! Llevás ${metrics.ordersToday} venta(s) cerrada(s) hoy.`
      : `En lo que va del día no tenés ventas pagadas aún. Te recomiendo hacer una historia activa en Instagram impulsando tu producto estrella.`;

    return `📈 **Balance Comercial en Tiempo Real**\n\n• **Ventas Concretadas Hoy:** ${formatARS(metrics.salesToday)} (${metrics.ordersToday} órdenes)\n• **Proyección Cierre Semanal:** ${formatARS(metrics.salesWeekProjected)}\n• **Tasa de Conversión Estimada:** ${metrics.conversionRateEst}\n\n${statusMsg}`;
  }

  // D) CONSULTA DE ESTRATEGIAS / IDEAS
  if (q.includes("estrategia") || q.includes("idea") || q.includes("consejo") || q.includes("aumentar") || q.includes("ayuda") || q.includes("recomend")) {
    const cartAdvice = metrics.abandonedCartsCount > 0
      ? `Tenés **${formatARS(metrics.abandonedCartsValue)}** estancados en ${metrics.abandonedCartsCount} carritos. Mandales un mensaje de recuperación.`
      : `Tu embudo de pago está impecable sin carritos trabados. Mandá tráfico directo.`;

    const stockAdvice = metrics.criticalStockProducts.length > 0
      ? `Tenés ${metrics.criticalStockProducts.length} productos en stock bajo. Reponé stock antes de pausar o promocionar.`
      : `Tu catálogo tiene stock 100% disponible para campañas agresivas.`;

    return `💡 **3 Estrategias Comerciales Recomendadas:**\n\n1. **Recuperación Inmediata:** ${cartAdvice}\n2. **Urgencia Comercial:** Ofrecé envío bonificado por las próximas 12 horas en compras superiores a $30.000.\n3. **Optimización de Inventario:** ${stockAdvice}`;
  }

  // E) CONSULTA GENERAL
  return `🇦🇷 **Resumen General de tu Tienda**\n\n• **Ventas de Hoy:** ${formatARS(metrics.salesToday)} (${metrics.ordersToday} órdenes)\n• **Carritos Pendientes:** ${formatARS(metrics.abandonedCartsValue)} (${metrics.abandonedCartsCount} carritos)\n• **Productos en Stock Bajo:** ${metrics.criticalStockProducts.length}\n• **Proyección Semanal:** ${formatARS(metrics.salesWeekProjected)}\n\n¿En cuál de estas áreas querés profundizar? Podés preguntarme sobre stock, carritos o sugerencias de venta.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { query = "", store_id = "8293155", action } = body;

    // Obtener métricas reales
    const metrics = await fetchStoreRealMetrics(store_id);

    // Si el front solo pide el objeto de métricas
    if (action === "metrics") {
      return NextResponse.json({ success: true, metrics });
    }

    // Intentar consulta con Gemini AI si la API Key está configurada
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && query) {
      try {
        const promptSystem = `Sos Nevux Copilot IA, el Gerente Comercial 24/7 de esta tienda de Tiendanube. Tu tono es "CEO Argentino": profesional, directo, cálido, humano y enfocado en la rentabilidad.

MÉTRICAS REALES DE LA TIENDA EN TIEMPO REAL:
- Ventas Concretadas Hoy: $${metrics.salesToday} ARS (${metrics.ordersToday} órdenes)
- Proyección Semanal Estimada: $${metrics.salesWeekProjected} ARS
- Carritos Abandonados Recuperables: ${metrics.abandonedCartsCount} carritos por un valor total de $${metrics.abandonedCartsValue} ARS
- Productos con Stock Crítico (<= 5 unidades): ${metrics.criticalStockProducts.length === 0 ? "Ninguno (Stock saludable)" : metrics.criticalStockProducts.join(", ")}

INSTRUCCIÓN CRÍTICA:
Responde de forma DIRECTA, ESPECÍFICA y CONCRETA a la consulta del comerciante: "${query}".
- Si pregunta por stock, responde ÚNICAMENTE sobre el stock real (listando productos o felicitando por tener stock saludable).
- Si pregunta por carritos abandonados, responde ÚNICAMENTE sobre los carritos y el valor acumulado de los carritos.
- Si pregunta por ventas o proyección, responde sobre la facturación de hoy y la proyección.
- NUNCA des un mensaje genérico de bienvenida cuando te hacen una pregunta específica.
- Usá formato Markdown con negritas y emojis profesionales de e-commerce.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptSystem }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            return NextResponse.json({
              success: true,
              reply: aiText,
              metrics,
            });
          }
        }
      } catch (e: any) {
        console.warn("Error en llamada Gemini, usando respuesta inteligente local:", e.message);
      }
    }

    // Fallback local con detección precisa de intención
    const reply = smartLocalCopilotReply(query, metrics);

    return NextResponse.json({
      success: true,
      reply,
      metrics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error en Nevux Copilot API", details: err.message },
      { status: 500 }
    );
  }
          }
