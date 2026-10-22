// app/api/ai/virtual-salesman/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("store_id");
    const userId = searchParams.get("user_id");

    let query = supabase.from("vendedor_ia_settings").select("*");
    if (storeId) {
      query = query.eq("store_id", storeId);
    } else if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.maybeSingle();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
    const { action, settings, message, history, store_id, access_token, user_id } = body;

    // ACCIÓN 1: GUARDAR CONFIGURACIÓN
    if (action === "save") {
      if (!user_id && !store_id) {
        return NextResponse.json({ error: "Falta user_id o store_id" }, { status: 400 });
      }

      const payload = {
        ...settings,
        user_id: user_id || undefined,
        store_id: store_id || undefined,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("vendedor_ia_settings")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    // ACCIÓN 2: CHAT CON CONCIERGE IA
    if (action === "chat") {
      let catalogContext: any[] = [];

      // Obtener productos reales de la API de Tiendanube
      if (store_id && access_token) {
        try {
          const productsRes = await fetch(
            `https://api.tiendanube.com/v1/${store_id}/products?per_page=40&published=true`,
            {
              headers: {
                "Authentication": `bearer ${access_token}`,
                "User-Agent": "NevuxAI (admin@nevux.ar)",
              },
            }
          );

          if (productsRes.ok) {
            const products = await productsRes.json();
            if (Array.isArray(products)) {
              catalogContext = products.map((p: any) => ({
                id: p.id,
                nombre: p.name?.es || p.name?.en || "Producto",
                precio: p.variants?.[0]?.price ? `$${p.variants[0].price}` : "Consultar",
                stock: p.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) ?? "Disponible",
                variantes: p.variants?.map((v: any) => v.values?.map((val: any) => val.es).join(" / ")).filter(Boolean).join(", ") || "Única",
                link: p.handle ? `https://tienda.com/productos/${p.handle}` : ""
              }));
            }
          }
        } catch (catErr) {
          console.error("Error cargando catálogo Tiendanube:", catErr);
        }
      }

      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      const systemInstruction = `
Eres un vendedor y asesor de atención al cliente 100% humano, súper cálido, amable y proactivo. Tu objetivo es ayudar al comprador a elegir y concretar su compra de manera natural.

CATÁLOGO REAL DISPONIBLE EN LA TIENDA:
${catalogContext.length > 0 ? JSON.stringify(catalogContext, null, 2) : "Actualmente el catálogo está disponible directamente en la tienda online."}

REGLAS OBLIGATORIAS DE RESPUESTA:
1. SI EL USUARIO PREGUNTA QUÉ PRODUCTOS HAY DISPONIBLES O QUÉ VENDES: Muestra de inmediato entre 3 y 4 productos reales del catálogo provisto con sus nombres exactos y precios. NUNCA respondas únicamente pregunto "¿qué te interesa?" sin antes haber presentado opciones concretas.
2. TONO HUMANO Y CÁLIDO: Hablá de forma cercana, usando expresiones amables en español argentino/latino ("¡Hola! Te cuento", "Mirá, tenemos...", "Está genial", "Contame y te ayudo").
3. CONCISIÓN EXTREMA: Responde en máximo 2 a 4 oraciones. Prohibido escribir bloques largos o choclos de texto.
4. PRECIOS Y STOCK: Usa la información real de catálogo. Si te preguntan talles o stock, respondés directo y seguro con los datos provistos.
5. CIERRE O ESCALACIÓN A WHATSAPP: Si el cliente quiere pagar, pide un descuento especial, o requiere ayuda humana directa, ofrece derivar a WhatsApp amablemente.
6. NUNCA inventes productos ni precios que no existan en el catálogo recibido.
`;

      let aiMessage = "¡Hola! Te cuento que tenemos productos geniales disponibles en la tienda. ¿Buscás algo en particular o querés que te recomiende los más pedidos?";

      if (GEMINI_API_KEY) {
        try {
          const contents = [
            {
              role: "user",
              parts: [{ text: `[INSTRUCCIONES DE COMPORTAMIENTO]:\n${systemInstruction}` }]
            },
            {
              role: "model",
              parts: [{ text: "Entendido perfectamente. Responderé como un asesor de ventas humano, cálido, proactivo y súper enfocado en mostrar los productos reales del catálogo." }]
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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
            const aiData = await geminiRes.json();
            const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              aiMessage = text.trim();
            }
          }
        } catch (geminiErr) {
          console.error("Gemini API error:", geminiErr);
        }
      }

      return NextResponse.json({ response: aiMessage });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error("Error en vendedor-ia API:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  }
