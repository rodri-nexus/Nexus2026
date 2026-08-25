import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usamos la Service Role Key para saltar cualquier bloqueo de RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storeId, message, conversationHistory = [] } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    
    // 1. Obtener configuración del bot (ID flexible)
    const { data: botConfig } = await supabase
      .from("bot_config")
      .select("*")
      .eq("store_id", String(storeId))
      .maybeSingle();

    const botName = botConfig?.bot_name || "Asesora";
    const personality = botConfig?.personality || "experta";

    // 2. Si no hay API KEY, respondemos con un mensaje amable en lugar de un error técnico
    if (!apiKey) {
      return NextResponse.json({ 
        reply: `¡Hola! Soy ${botName}. Estoy terminando de configurar mi conexión a la IA. ¡Escribime de nuevo en unos minutos!`, 
        botName 
      });
    }

    // 3. Prompt simplificado para evitar errores de tokens
    const systemPrompt = `Sos ${botName}, asesora de ventas de esta tienda. Tono: ${personality}. Responde de forma muy breve y humana. NUNCA digas que sos un bot.`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...conversationHistory.slice(-4).map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    // 4. Llamada a Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    );

    if (!geminiRes.ok) {
      return NextResponse.json({ 
        reply: `¡Hola! Soy ${botName}. Justo ahora tengo mucha demanda, ¿podrías repetirme tu pregunta en un momento? 😊`, 
        botName 
      });
    }

    const resData = await geminiRes.json();
    const reply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "¡Hola! ¿Cómo puedo ayudarte?";

    return NextResponse.json({ reply, botName });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ reply: "Tuve un pequeño problema técnico, pero ya estoy aquí. ¿Qué buscabas?", botName: "Asesora" });
  }
}
