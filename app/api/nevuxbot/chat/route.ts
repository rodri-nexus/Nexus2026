import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storeId, message } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Buscar config del bot
    const { data: botConfig } = await supabase
      .from("bot_config")
      .select("bot_name")
      .eq("store_id", String(storeId))
      .maybeSingle();

    const botName = botConfig?.bot_name || "Rodri";

    if (!apiKey) {
      return NextResponse.json({ reply: "DEBUG: No encontré la GEMINI_API_KEY en Vercel." });
    }

    // 2. Llamada simplificada a Gemini
    const payload = {
      contents: [{ parts: [{ text: `Sos ${botName}, respondé hola corto.` }, { text: message }] }]
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json();
      const errorMessage = errorData.error?.message || "Error desconocido de Google";
      return NextResponse.json({ 
        reply: `DEBUG ERROR DE GOOGLE: ${errorMessage}. (Verificá tu API Key en AI Studio)`, 
        botName 
      });
    }

    const resData = await geminiRes.json();
    const reply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "¡Hola!";

    return NextResponse.json({ reply, botName });

  } catch (error: any) {
    return NextResponse.json({ reply: "DEBUG ERROR CRÍTICO: " + error.message });
  }
}
