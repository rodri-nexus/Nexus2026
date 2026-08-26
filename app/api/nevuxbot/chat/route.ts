import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendCartRecoveryEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Generador de Copy Persuasivo de Recupero con IA (Gemini)
async function generateAIRecoveryMessage(
  customerName: string,
  products: string[],
  totalFormatted: string,
  checkoutUrl: string,
  tone: string = "persuasivo",
  botName: string = "Sofía"
) {
  const nameStr = customerName ? customerName : "hola";
  const productsStr = products.length > 0 ? products.join(", ") : "tus productos";

  if (!GEMINI_API_KEY) {
    return buildFallbackMessage(nameStr, products, totalFormatted, checkoutUrl, botName);
  }

  try {
    let tonePrompt = "Tu tono es profesional, persuasivo, amable y enfocado en cerrar la venta.";
    if (tone === "calida") {
      tonePrompt = "Tu tono es súper dulce, cercano, empático, cálido y agradecido.";
    } else if (tone === "urgente") {
      tonePrompt = "Tu tono crea sentido de oportunidad/urgencia amable, destacando que el stock de sus productos es limitado.";
    }

    const prompt = `Sos ${botName}, asesora de ventas experta en E-commerce.
Escribí un mensaje corto, natural y altamente persuasivo para recuperar un carrito abandonado.

DATOS DE LA COMPRA:
- Comprador: ${nameStr}
- Productos en el carrito: ${productsStr}
- Total: ${totalFormatted}
- Link para finalizar la compra: ${checkoutUrl}

INSTRUCCIONES DE TONO:
${tonePrompt}

REGLAS CRÍTICAS:
1. Escribí ÚNICAMENTE el texto listo para enviar al cliente.
2. Usá pocos emojis amigables y bien ubicados.
3. Incluí de forma super clara el link directo al checkout (${checkoutUrl}).
4. Mencioná los productos que dejó pendientes para despertar su interés.
5. Máximo 3 o 4 oraciones cortas. Sin hashtags ni corchetes.`;

    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
    ];

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const copy = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (copy) return copy;
        }
      } catch (err) {
        console.error(`Error con modelo ${model}:`, err);
      }
    }

    return buildFallbackMessage(nameStr, products, totalFormatted, checkoutUrl, botName);
  } catch (err) {
    console.error("[Gemini Recovery Copy Exception]:", err);
    return buildFallbackMessage(nameStr, products, totalFormatted, checkoutUrl, botName);
  }
}

function buildFallbackMessage(
  customerName: string,
  products: string[],
  totalFormatted: string,
  checkoutUrl: string,
  botName: string
) {
  const prodText = products.length > 0 ? ` (${products.slice(0, 2).join(", ")})` : "";
  return `¡Hola ${customerName}! 👋 Soy ${botName}. Notamos que dejaste pendiente tu pedido${prodText} en nuestra tienda.\n\nGuardamos tu carrito para que no pierdas tu selección (${totalFormatted}).\n\nPodés completarlo en 1 clic desde acá 👇\n${checkoutUrl}\n\nSi tuviste alguna duda con el envío o el pago, ¡escribime y te ayudo al instante! 😊`;
}

// 🟢 GET: Consultar Carritos Abandonados + CRM Statuses
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Buscar tienda activa
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("store_id, access_token")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (storeError || !store || !store.access_token) {
      return NextResponse.json({
        checkouts: [],
        summary: { totalAbandoned: 0, recoverableAmount: 0, recoveredAmount: 0, recoveredCount: 0 },
      });
    }

    // Petición a Tiendanube Checkouts
    const tnRes = await fetch(
      `https://api.tiendanube.com/v1/${store.store_id}/checkouts?status=uncompleted&per_page=50`,
      {
        headers: {
          Authentication: `bearer ${store.access_token}`,
          "User-Agent": "Nevux (nevuxapp@gmail.com)",
          "Content-Type": "application/json",
        },
      }
    );

    if (!tnRes.ok) {
      console.error("[Tiendanube Checkouts Fetch Failed]: Status", tnRes.status);
      return NextResponse.json({
        checkouts: [],
        summary: { totalAbandoned: 0, recoverableAmount: 0, recoveredAmount: 0, recoveredCount: 0 },
      });
    }

    const rawCheckouts = await tnRes.json();

    // Obtener config/metadata de la tienda para CRM statuses
    const { data: botConfig } = await supabase
      .from("bot_config")
      .select("primary_color")
      .eq("store_id", String(store.store_id))
      .maybeSingle();

    // Mock CRM statuses map guardado en la sesión
    let recoverableAmount = 0;
    let recoveredAmount = 0;
    let recoveredCount = 0;

    const checkouts = (Array.isArray(rawCheckouts) ? rawCheckouts : []).map((c: any) => {
      const totalNum = parseFloat(c.total || "0");
      recoverableAmount += totalNum;

      const items = (c.line_items || []).map((item: any) => item.name || "Producto");

      // Estado por defecto
      const status = "pending"; // 'pending' | 'contacted' | 'recovered'

      return {
        id: String(c.id),
        customerName: c.contact_name || c.billing_name || "Cliente",
        customerEmail: c.contact_email || c.billing_email || "",
        customerPhone: c.contact_phone || c.billing_phone || "",
        products: items,
        total: totalNum,
        currency: c.currency || "ARS",
        checkoutUrl: c.abandoned_checkout_url || c.checkout_url || "",
        createdAt: c.created_at || new Date().toISOString(),
        status,
      };
    });

    return NextResponse.json({
      checkouts,
      summary: {
        totalAbandoned: checkouts.length,
        recoverableAmount,
        recoveredAmount,
        recoveredCount,
      },
    });
  } catch (err: any) {
    console.error("[Checkouts GET Exception]:", err);
    return NextResponse.json(
      {
        checkouts: [],
        summary: { totalAbandoned: 0, recoverableAmount: 0, recoveredAmount: 0, recoveredCount: 0 },
      },
      { status: 500 }
    );
  }
}

// 🟢 POST: Copy IA, Enviar Email o Actualizar Estado CRM
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      action = "generate_copy",
      cartId,
      status,
      customerName = "Cliente",
      customerEmail = "",
      products = [],
      totalFormatted = "$ -",
      checkoutUrl = "",
      tone = "persuasivo",
      botName = "Sofía",
      customMessage = "",
    } = body;

    // CASO 1: Actualizar Estado CRM de Carrito
    if (action === "update_status") {
      return NextResponse.json({
        success: true,
        cartId,
        status: status || "contacted",
      });
    }

    // CASO 2: Enviar Email de Recupero con Resend
    if (action === "send_email") {
      if (!customerEmail) {
        return NextResponse.json(
          { error: "Este cliente no dejó registrada una dirección de email." },
          { status: 400 }
        );
      }

      const emailSent = await sendCartRecoveryEmail({
        to: customerEmail,
        customerName,
        products,
        totalFormatted,
        checkoutUrl,
        customMessage,
        botName,
      });

      if (!emailSent) {
        return NextResponse.json(
          { error: "No se pudo entregar el correo por un problema temporal de servicio." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        sent: true,
        status: "contacted",
        message: `Email de recupero enviado exitosamente a ${customerEmail}`,
      });
    }

    // CASO 3: Generar mensaje persuasivo con Gemini AI
    const message = await generateAIRecoveryMessage(
      customerName,
      products,
      totalFormatted,
      checkoutUrl,
      tone,
      botName
    );

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error("Error en POST /api/nevuxbot/chat:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud." },
      { status: 500 }
    );
  }
                                }
