import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProducts } from "@/lib/tiendanube";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storeId, message, conversationHistory = [] } = body;

    if (!storeId || !message) {
      return NextResponse.json(
        { error: "storeId y message son requeridos" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no configurada en Vercel" },
        { status: 500 }
      );
    }

    const cleanStoreId = String(storeId).trim();

    // 1. Obtener la tienda desde Supabase
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

    // 2. Obtener la configuración de NevuxBot
    const { data: botConfig } = await supabase
      .from("bot_config")
      .select("*")
      .eq("store_id", cleanStoreId)
      .maybeSingle();

    const botName = botConfig?.bot_name || "Sofía";
    const personality = botConfig?.personality || "experta";

    // 3. Obtener productos de la tienda si hay token disponible
    let catalogSummary = "Catálogo general de la tienda disponible para consultas.";
    if (store?.access_token) {
      try {
        const products = await getProducts(store.store_id, store.access_token);
        if (Array.isArray(products) && products.length > 0) {
          catalogSummary = products
            .slice(0, 25)
            .map((p) => {
              const variant = p.variants?.[0];
              const price = variant?.promotional_price || variant?.price || "Consultar";
              return `- ${p.name} | Precio: $${price} | ID: ${p.id}`;
            })
            .join("\n");
        }
      } catch (e) {
        console.error("Error obteniendo productos:", e);
      }
    }

    // 4. Armar el Prompt de Personalidad Humana
    let personalityPrompt = "";
    if (personality === "calida") {
      personalityPrompt = "Tu tono es súper cálido, dulce, cercano y comprensivo. Usás emojis amigables.";
    } else if (personality === "divertida") {
      personalityPrompt = "Tu tono es fresco, dinámico, entusiasta y con mucha buena onda.";
    } else {
      personalityPrompt = "Tu tono es profesional, experto, elegante y súper resolutivo.";
    }

    const systemPrompt = `
Sos ${botName}, la asesora de ventas humana de esta tienda online.
REGLAS OBLIGATORIAS:
1. Hablá 100% como una persona real, atenta y cercana. NUNCA digas "soy una IA", "soy un modelo de lenguaje" ni "soy un bot".
2. ${personalityPrompt}
3. Ponete siempre en el lugar del comprador y destacá beneficios, calidad y buena atención.
4. Productos disponibles en el catálogo de la tienda:
${catalogSummary}

Respondé de forma concisa y conversacional (máximo 2 a 3 oraciones cortas por respuesta).
`;

    // 5. Estructurar conversación para Gemini
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...conversationHistory.slice(-6).map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // 6. Probar modelos de Gemini en cascada
    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-pro",
    ];

    let replyText = "";
    let lastError = "";

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
          if (replyText) break; // ¡Éxito! Salimos del bucle
        } else {
          const errText = await geminiRes.text();
          lastError = `${model}: ${errText}`;
        }
      } catch (err: any) {
        lastError = `${model}: ${err.message}`;
      }
    }

    if (!replyText) {
      console.error("Ningún modelo de Gemini respondió con éxito:", lastError);
      return NextResponse.json(
        { reply: `¡Hola! Soy ${botName}, tu asesora. ¿En qué te puedo ayudar hoy? 😊`, botName },
        { status: 200 }
      );
    }

    return NextResponse.json({
      reply: replyText,
      botName,
    });
  } catch (error: any) {
    console.error("Error en POST /api/nevuxbot/chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
         }
