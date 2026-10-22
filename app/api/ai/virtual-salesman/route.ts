// app/api/ai/virtual-salesman/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) return NextResponse.json({ error: "No user ID" }, { status: 400 });

    const { data, error } = await supabase
      .from("vendedor_ia_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return NextResponse.json(data || {
      enabled: true,
      human_tone: "warm",
      auto_whatsapp: true,
      custom_prompt: ""
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { action, settings, message, history, store_id, access_token, user_id } = body;

    // 1. SI ES PARA GUARDAR
    if (action === "save") {
      const { data, error } = await supabase
        .from("vendedor_ia_settings")
        .upsert({ ...settings, user_id, updated_at: new Date().toISOString() })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, data });
    }

    // 2. SI ES PARA CHAT
    if (action === "chat") {
      // Intentar recuperar credenciales de Tiendanube si no vienen en el body
      if (!store_id || !access_token) {
        const { data: tnSettings } = await supabase
          .from("tiendanube_settings")
          .select("store_id, access_token")
          .eq("user_id", user_id)
          .single();
        
        if (tnSettings) {
          store_id = tnSettings.store_id;
          access_token = tnSettings.access_token;
        }
      }

      let catalogContext = [];
      if (store_id && access_token) {
        try {
          const res = await fetch(`https://api.tiendanube.com/v1/${store_id}/products?per_page=50&published=true`, {
            headers: { "Authentication": `bearer ${access_token}`, "User-Agent": "Nevux (admin@nevux.ar)" }
          });
          const products = await res.json();
          if (Array.isArray(products)) {
            catalogContext = products.map(p => ({
              n: p.name.es || p.name.en,
              p: p.variants[0]?.price,
              s: p.variants.reduce((a: any, v: any) => a + (v.stock || 0), 0) > 0 ? "Si" : "No",
              v: p.variants.map((v: any) => v.values[0]?.es).filter(Boolean).slice(0, 3).join(",")
            }));
          }
        } catch (e) { console.error("Error cat:", e); }
      }

      const systemInstruction = `
Eres un vendedor humano de esta tienda. Súper amable y directo.
CATÁLOGO REAL (Nombre, Precio, Stock, Talles):
${JSON.stringify(catalogContext)}

REGLAS:
1. Si el cliente pregunta qué hay, mencioná 3 o 4 productos con precio de la lista de arriba de forma natural.
2. Usá máximo 3 frases. 
3. Usá "Hola!", "Mirá, te cuento...", "Cualquier cosa me avisás".
4. Si preguntan algo que no está en la lista, decí que no lo encontrás por ahora pero podés consultar.
5. NO digas "soy una IA" ni "con gusto te ayudo a consultar". Respondé como si estuvieras en el local.
`;

      const geminiKey = process.env.GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `Actúa según estas instrucciones: ${systemInstruction}` }] },
            { role: "model", parts: [{ text: "Entendido, soy el vendedor humano de la tienda." }] },
            ...history.map((h: any) => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.content }] })),
            { role: "user", parts: [{ text: message }] }
          ]
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Hola! ¿En qué puedo ayudarte?";
      return NextResponse.json({ response: text.trim() });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ response: "¡Hola! Estoy teniendo un problema para conectar con el catálogo, pero decime qué buscabas." });
  }
                                }
