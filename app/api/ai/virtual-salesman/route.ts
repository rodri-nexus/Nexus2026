// app/api/ai/virtual-salesman/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("vendedor_ia_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json(data || {});
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action, settings, message, history, store_id, access_token } = body;

  // ACCIÓN: GUARDAR CONFIGURACIÓN
  if (action === "save") {
    const { data, error } = await supabase
      .from("vendedor_ia_settings")
      .upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // ACCIÓN: CHAT (SIMULADOR O WIDGET)
  if (action === "chat") {
    try {
      // 1. Obtener productos reales de Tiendanube
      const productsRes = await fetch(`https://api.tiendanube.com/v1/${store_id}/products?per_page=40&published=true`, {
        headers: {
          "Authentication": `bearer ${access_token}`,
          "User-Agent": "NevuxAI (admin@nevux.ar)"
        }
      });
      const products = await productsRes.json();

      // 2. Preparar contexto de productos para la IA
      const catalogContext = Array.isArray(products) 
        ? products.map(p => ({
            nombre: p.name.es,
            precio: `${p.variants[0]?.price} ${p.currency}`,
            stock: p.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0),
            variantes: p.variants.map((v: any) => `${v.values[0]?.es || 'Único'}`).join(", "),
            link: p.handle ? `https://tienda.com/productos/${p.handle}` : ""
          }))
        : [];

      // 3. Llamada a Gemini 1.5 Flash
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      const systemInstruction = `
        Eres un asesor de ventas humano, cálido y experto. Tu objetivo es ayudar al cliente a comprar.
        DATOS DE LA TIENDA: ${JSON.stringify(catalogContext)}
        
        REGLAS CRÍTICAS:
        1. NO seas vago. Si el usuario pregunta qué hay, menciona 3 o 4 productos específicos con sus precios de forma entusiasta.
        2. Usa un lenguaje natural de Argentina/Latinoamérica (cálido, usa "te cuento", "mira", "está genial").
        3. Si preguntan por stock o talles, revisa los datos provistos y confirma con seguridad.
        4. Respuestas cortas (máximo 3 frases). No escribas párrafos largos.
        5. Si el usuario parece decidido o necesita atención humana, ofrece pasar a WhatsApp de forma orgánica.
        6. JAMÁS inventes productos que no estén en la lista enviada.
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `INSTRUCCIÓN SISTEMA: ${systemInstruction}` }] },
            ...history.map((h: any) => ({
              role: h.role === "user" ? "user" : "model",
              parts: [{ text: h.content }]
            })),
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      });

      const aiData = await response.json();
      const aiMessage = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "¡Hola! ¿En qué puedo ayudarte hoy?";

      return NextResponse.json({ response: aiMessage });

    } catch (error) {
      console.error("AI Error:", error);
      return NextResponse.json({ response: "Hola! Tuve un pequeño problema técnico, pero decime qué buscabas y te ayudo." });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
   }
