import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProducts } from "@/lib/tiendanube";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      storeId,
      message,
      conversationHistory = [],
      productId = null,
      productName = null,
      productPrice = null,
    } = body;

    if (!storeId || !message) {
      return NextResponse.json(
        { error: "storeId y message son requeridos" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "¡Hola! Estoy configurando mi conexión. ¿Me repetís en un momento?",
        botName: "Asesora",
      });
    }

    const cleanStoreId = String(storeId).trim();

    // 1. Tienda
    let { data: store } = await supabase
      .from("stores")
      .select("store_id, access_token")
      .eq("store_id", cleanStoreId)
      .eq("is_active", true)
      .maybeSingle();

    if (!store && !isNaN(Number(cleanStoreId))) {
      const resNum = await supabase
        .from("stores")
        .select("store_id, access_token")
        .eq("store_id", String(Number(cleanStoreId)))
        .eq("is_active", true)
        .maybeSingle();
      if (resNum.data) store = resNum.data;
    }

    // 2. Config del bot
    const { data: botConfig } = await supabase
      .from("bot_config")
      .select("*")
      .eq("store_id", cleanStoreId)
      .maybeSingle();

    const botName = botConfig?.bot_name || "Sofía";
    const personality = botConfig?.personality || "experta";

    // 3. Catálogo (priorizar producto actual)
    let catalogSummary = "Catálogo general disponible.";
    let currentProductInfo = "";

    if (productName) {
      currentProductInfo = `
PRODUCTO QUE EL COMPRADOR ESTÁ MIRANDO AHORA:
- Nombre: ${productName}
- Precio: ${productPrice || "Consultar"}
- ID: ${productId || "N/A"}
IMPORTANTE: Priorizá hablar de ESTE producto. Conocelo a la perfección.
`;
    }

    if (store?.access_token) {
      try {
        const products = await getProducts(store.store_id, store.access_token);
        if (Array.isArray(products) && products.length > 0) {
          // Si hay producto actual, buscarlo con más detalle
          if (productId) {
            const current = products.find(
              (p: any) => String(p.id) === String(productId)
            );
            if (current) {
              const v = current.variants?.[0];
              const price = v?.promotional_price || v?.price || "Consultar";
              const stock = v?.stock ?? "N/A";
              currentProductInfo = `
PRODUCTO QUE EL COMPRADOR ESTÁ MIRANDO AHORA:
- Nombre: ${current.name}
- Precio: $${price}
- Stock: ${stock}
- ID: ${current.id}
- Descripción: ${(current.description || "").replace(/<[^>]*>/g, "").substring(0, 300)}
IMPORTANTE: Priorizá hablar de ESTE producto.
`;
            }
          }

          catalogSummary = products
            .slice(0, 20)
            .map((p: any) => {
              const v = p.variants?.[0];
              const price = v?.promotional_price || v?.price || "Consultar";
              return `- ${p.name} | $${price} | ID: ${p.id}`;
            })
            .join("\n");
        }
      } catch (e) {
        console.error("Error productos NevuxBot:", e);
      }
    }

    // 4. Personalidad
    let personalityPrompt = "Tu tono es profesional, experto y resolutivo.";
    if (personality === "calida") {
      personalityPrompt =
        "Tu tono es súper cálido, dulce, cercano y comprensivo. Usás emojis amigables.";
    } else if (personality === "divertida") {
      personalityPrompt =
        "Tu tono es fresco, dinámico, entusiasta y con mucha buena onda.";
    }

    const systemPrompt = `
Sos ${botName}, la asesora de ventas humana de esta tienda online.
REGLAS OBLIGATORIAS:
1. Hablá 100% como una persona real. NUNCA digas que sos una IA, bot o modelo.
2. ${personalityPrompt}
3. Respondé en máximo 2 o 3 oraciones cortas.
4. Destacá beneficios, calidad y usos reales. No inventes descuentos que no existan.
${currentProductInfo}

OTROS PRODUCTOS DEL CATÁLOGO:
${catalogSummary}
`;

    // 5. Historial para Gemini
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...conversationHistory.slice(-8).map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: String(msg.text || "") }],
      })),
      { role: "user", parts: [{ text: String(message) }] },
    ];

    // 6. Modelos en cascada
    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-pro",
    ];

    let replyText = "";

    for (const model of modelsToTry) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (replyText) break;
        }
      } catch (err) {
        console.error(`Error modelo ${model}:`, err);
      }
    }

    if (!replyText) {
      replyText = `¡Hola! Soy ${botName}. Decime qué necesitás saber y te ayudo ahora mismo 😊`;
    }

    return NextResponse.json({ reply: replyText, botName });
  } catch (error: any) {
    console.error("Error en /api/nevuxbot/chat:", error);
    return NextResponse.json({
      reply: "¡Hola! Tuve un momento de demora. ¿Me repetís tu consulta?",
      botName: "Asesora",
    });
  }
    }
