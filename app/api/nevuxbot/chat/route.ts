import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProducts } from "@/lib/tiendanube";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storeId, message, conversationHistory = [] } = body;

    if (!storeId || !message) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "IA no configurada en el servidor" }, { status: 500 });
    }

    // 1. Buscar la tienda con ID flexible (7401217)
    const cleanId = String(storeId).trim();
    let { data: store } = await supabase
      .from("stores")
      .select("store_id, access_token")
      .or(`store_id.eq.${cleanId},store_id.eq.${Number(cleanId)}`)
      .eq("is_active", true)
      .maybeSingle();

    if (!store?.access_token) {
      return NextResponse.json({ error: "Tienda no vinculada" }, { status: 404 });
    }

    // 2. Obtener config del bot
    const { data: botConfig } = await supabase
      .from("bot_config")
      .select("*")
      .eq("store_id", cleanId)
      .maybeSingle();

    const botName = botConfig?.bot_name || "Sofía";
    const personality = botConfig?.personality || "experta";

    // 3. Catálogo de productos (optimizado para evitar timeouts)
    let catalog = "Catálogo no disponible.";
    try {
      const products = await getProducts(store.store_id, store.access_token);
      if (Array.isArray(products) && products.length > 0) {
        catalog = products.slice(0, 20).map(p => `- ${p.name} | $${p.variants?.[0]?.price}`).join("\n");
      }
    } catch (e) { console.error("Error productos:", e); }

    // 4. Prompt
    const systemPrompt = `Sos ${botName}, asesora humana de esta tienda. Tono: ${personality}. REGLAS: 1. NUNCA digas que sos una IA. 2. Responde corto (2 frases). PRODUCTOS:\n${catalog}`;

    // 5. Llamada a Gemini con estructura simplificada
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...conversationHistory.map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Gemini Error:", err);
      return NextResponse.json({ error: "La IA está saturada o la API Key es inválida" }, { status: 500 });
    }

    const resData = await geminiRes.json();
    const reply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "¡Hola! ¿En qué te ayudo?";

    return NextResponse.json({ reply, botName });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
      }
