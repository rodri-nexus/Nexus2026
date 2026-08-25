import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProducts } from "@/lib/tiendanube";

// Inicializar cliente Supabase para consultas públicas del bot
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        { error: "Gemini API key no configurada" },
        { status: 500 }
      );
    }

    // 1. Obtener la tienda y token desde Supabase
    const { data: store } = await supabase
      .from("stores")
      .select("store_id, access_token, user_id")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .maybeSingle();

    if (!store?.access_token) {
      return NextResponse.json(
        { error: "Tienda no encontrada o inactiva" },
        { status: 404 }
      );
    }

    // 2. Obtener la configuración de NevuxBot para esta tienda
    const { data: botConfig } = await supabase
      .from("bot_config")
      .select("*")
      .eq("store_id", storeId)
      .maybeSingle();

    const botName = botConfig?.bot_name || "Sofía";
    const personality = botConfig?.personality || "experta";

    // 3. Obtener el catálogo de productos de Tiendanube
    let catalogSummary = "No hay productos disponibles por el momento.";
    try {
      const products = await getProducts(store.store_id, store.access_token);
      if (Array.isArray(products) && products.length > 0) {
        catalogSummary = products
          .slice(0, 30) // Primeros 30 productos para no saturar tokens
          .map((p) => {
            const variant = p.variants?.[0];
            const price = variant?.promotional_price || variant?.price || "Sin precio";
            return `- ${p.name} | Precio: $${price} | ID: ${p.id}`;
          })
          .join("\n");
      }
    } catch (e) {
      console.error("Error cargando productos para NevuxBot:", e);
    }

    // 4. Armar el Prompt de Personalidad y Vendedor Humano
    let personalityPrompt = "";
    if (personality === "calida") {
      personalityPrompt = "Tu tono es súper cálido, dulce, cercano y comprensivo. Usas emojis amigables.";
    } else if (personality === "divertida") {
      personalityPrompt = "Tu tono es fresco, dinámico, entusiasta y con buena onda. Usas lenguaje relajado.";
    } else {
      personalityPrompt = "Tu tono es profesional, experto, elegante y súper resolutivo.";
    }

    const systemPrompt = `
Sos ${botName}, la asesora de ventas humana de esta tienda online.
REGLAS OBLIGATORIAS:
1. Hablá 100% como una persona real, atenta y cercana. NUNCA digas "soy una IA", "soy un modelo de lenguaje" ni "soy un bot".
2. ${personalityPrompt}
3. NUNCA intentes vender basándote únicamente en el precio o descuentos. Vendé destacando beneficios, calidad, comodidad, usos reales y resolviendo las dudas del cliente.
4. Ponete siempre en el lugar del comprador. Si duda de un talle o modelo, hacele preguntas amables sobre sus gustos o medidas.
5. Conocés los productos de la tienda a la perfección:
${catalogSummary}

Si te preguntan por un producto que está en el catálogo, dale detalles útiles con entusiasmo. Si no sabés algo exacto, ofrecete a consultarlo con el equipo de depósito de forma humana.
Responde de forma concisa, conversacional y fluida (máximo 2 a 3 oraciones cortas por respuesta).
`;

    // 5. Construir historial de conversación para Gemini API
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // 6. Llamada a Google Gemini 1.5 Flash API (Gratuita)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "Error al procesar mensaje con la IA" },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const replyText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "¡Hola! ¿En qué te puedo ayudar hoy? 😊";

    return NextResponse.json({
      reply: replyText,
      botName,
    });
  } catch (error: any) {
    console.error("Error en /api/nevuxbot/chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
    }
