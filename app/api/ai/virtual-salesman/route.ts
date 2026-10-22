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

    // 1. SI ES PARA GUARDAR CONFIGURACIÓN
    if (action === "save") {
      const { data, error } = await supabase
        .from("vendedor_ia_settings")
        .upsert({ ...settings, user_id, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, data });
    }

    // 2. SI ES PARA CHAT
    if (action === "chat") {
      // Si no vienen credenciales en el request, buscamos en Supabase
      if (!store_id || !access_token) {
        let query = supabase.from("tiendanube_settings").select("store_id, access_token");
        if (user_id) {
          query = query.eq("user_id", user_id);
        }
        const { data: tnSettings } = await query.limit(1).maybeSingle();

        if (tnSettings) {
          store_id = tnSettings.store_id;
          access_token = tnSettings.access_token;
        }
      }

      let catalogContext: any[] = [];
      if (store_id && access_token) {
        try {
          const res = await fetch(`https://api.tiendanube.com/v1/${store_id}/products?per_page=50&published=true`, {
            headers: {
              "Authentication": `bearer ${access_token}`,
              "User-Agent": "Nevux (admin@nevux.ar)"
            }
          });
          if (res.ok) {
            const products = await res.json();
            if (Array.isArray(products)) {
              catalogContext = products.map((p: any) => ({
                nombre: p.name?.es || p.name?.en || "Producto",
                precio: p.variants?.[0]?.price ? `$${p.variants[0].price}` : "Consultar",
                stock: p.variants?.reduce((a: number, v: any) => a + (v.stock || 0), 0) > 0 ? "En stock" : "Agotado",
                variantes: p.variants?.map((v: any) => v.values?.[0]?.es).filter(Boolean).slice(0, 3).join(", ") || "Único"
              }));
            }
          }
        } catch (catErr) {
          console.error("Error al obtener productos de Tiendanube:", catErr);
        }
      }

      const systemInstruction = `
Eres un vendedor de atención al cliente 100% humano, súper cálido, directo y cercano. Tu objetivo es ayudar al comprador a concretar su compra de manera entusiasta.

CATÁLOGO REAL DE LA TIENDA:
${catalogContext.length > 0 ? JSON.stringify(catalogContext, null, 2) : "Catalogo disponible directamente en la tienda online."}

REGLAS DE ORO OBLIGATORIAS:
1. SI EL USUARIO PREGUNTA QUÉ PRODUCTOS HAY DISPONIBLES O PRECIOS: Presenta de inmediato 3 o 4 productos reales de la lista provista con sus nombres exactos y sus precios. NUNCA respondas con vacíos como "con gusto te ayudo a consultar".
2. TONO HUMANO Y DE ARGENTINA/LATAM: Hablá como una persona real en un local ("¡Hola! Te cuento", "Mirá, tenemos...", "Está genial", "Avisame y te lo reservo").
3. MÁXIMO 2 A 4 ORACIONES: Respuestas ultra concisas y directas. Prohibidos los bloques largos de texto.
4. PRECIOS Y STOCK REALES: Respondé con la información real dada arriba.
5. ESCALACIÓN A WHATSAPP: Si el cliente quiere pagar directo, pide un descuento especial o ayuda personalizada, ofrecé amablemente derivar a WhatsApp.
6. JAMÁS inventes productos que no estén en la lista recibida.
`;

      const geminiKey = process.env.GEMINI_API_KEY;
      let aiMessage = "¡Hola! Te cuento que tenemos varios productos disponibles. ¿Buscás algo en especial o querés que te recomiende los más vendidos?";

      if (geminiKey) {
        try {
          const contents = [
            {
              role: "user",
              parts: [{ text: `[INSTRUCCIONES DE ATENCIÓN]:\n${systemInstruction}` }]
            },
            {
              role: "model",
              parts: [{ text: "Entendido perfecto. Atenderé como un asesor de ventas humano, súper cercano, proactivo y mostrando los productos reales con sus precios." }]
            }
          ];

          if (Array.isArray(history)) {
            history.forEach((h: any) => {
              if (h.content) {
                contents.push({
                  role: h.role === "user" ? "user" : "model",
                  parts: [{ text: h.content }]
                });
              }
            });
          }

          contents.push({
            role: "user",
            parts: [{ text: message || "Hola, ¿qué productos tenés disponibles?" }]
          });

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents,
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 250,
                }
              })
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              aiMessage = text.trim();
            }
          }
        } catch (geminiErr) {
          console.error("Error llamando a Gemini API:", geminiErr);
        }
      }

      return NextResponse.json({ response: aiMessage });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error("Error en virtual-salesman route:", err);
    return NextResponse.json({ response: "¡Hola! Tuve una pequeña interrupción de señal, pero decime qué producto te interesa y te comento." });
  }
                }
