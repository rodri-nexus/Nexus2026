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
      query = query.eq("store_id", String(storeId));
    } else if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.maybeSingle();

    return NextResponse.json({
      settings: data?.settings || data || null
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { action, store_id, user_id, message, history } = body;

    // ACCIÓN 1: GUARDAR CONFIGURACIÓN
    if (action === "save") {
      const { is_active, agent_name, welcome_message, agent_avatar, personality, whatsapp_number, enable_whatsapp_escalation, theme_color } = body;

      const payload = {
        store_id: store_id ? String(store_id) : undefined,
        user_id: user_id || undefined,
        settings: {
          is_active,
          agent_name,
          welcome_message,
          agent_avatar,
          personality,
          whatsapp_number,
          enable_whatsapp_escalation,
          theme_color
        },
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("vendedor_ia_settings")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.error("Error guardando vendedor_ia_settings:", error);
      }
      return NextResponse.json({ success: true, data });
    }

    // ACCIÓN 2: CHAT SIMULADOR / WIDGET
    if (action === "chat") {
      let token = body.access_token;
      let sId = store_id ? String(store_id) : null;

      // Buscar credenciales de Tiendanube en Supabase
      if (!token || !sId) {
        let tnQuery = supabase.from("tiendanube_settings").select("store_id, access_token");
        if (sId) {
          tnQuery = tnQuery.eq("store_id", sId);
        } else if (user_id) {
          tnQuery = tnQuery.eq("user_id", user_id);
        }
        const { data: tnData } = await tnQuery.limit(1).maybeSingle();
        if (tnData) {
          sId = String(tnData.store_id);
          token = tnData.access_token;
        }
      }

      // Obtener productos reales de Tiendanube
      let catalogContext: any[] = [];
      if (sId && token) {
        try {
          const tnRes = await fetch(`https://api.tiendanube.com/v1/${sId}/products?per_page=30&published=true`, {
            headers: {
              "Authentication": `bearer ${token}`,
              "User-Agent": "Nevux (admin@nevux.ar)"
            }
          });
          if (tnRes.ok) {
            const products = await tnRes.json();
            if (Array.isArray(products)) {
              catalogContext = products.map((p: any) => ({
                nombre: p.name?.es || p.name?.en || p.name?.pt || "Producto",
                precio: p.variants?.[0]?.price ? `$${p.variants[0].price}` : "Consultar",
                stock: p.variants?.reduce((a: number, v: any) => a + (v.stock || 0), 0) > 0 ? "Disponible" : "Agotado",
                variantes: p.variants?.map((v: any) => v.values?.[0]?.es).filter(Boolean).slice(0, 3).join(", ") || "Único"
              }));
            }
          }
        } catch (catErr) {
          console.error("Error consultando Tiendanube API:", catErr);
        }
      }

      // Prompt para Gemini 1.5 Flash
      const systemInstruction = `
Eres un vendedor de una tienda online, súper cálido, amable y proactivo. Hablás en español amigable/argentino ("¡Hola!", "Te cuento que...", "Mirá, tenemos...").

CATÁLOGO REAL EN VIVO DE LA TIENDA:
${catalogContext.length > 0 ? JSON.stringify(catalogContext, null, 2) : "Catálogo disponible en la tienda web."}

REGLAS DE ORO:
1. SI EL CLIENTE PREGUNTA QUÉ PRODUCTOS HAY O PRECIOS: Menciona entre 3 y 4 productos reales con sus nombres exactos y sus precios. NUNCA respondas únicamente pregunto "¿qué buscás?".
2. MÁXIMO 2 A 4 FRASES CORTAS: Responde de forma ultra concisa. Prohibidos los bloques largos.
3. SI PREGUNTAN STOCK O TALLES: Confirma directo con los datos provistos.
4. CIERRE EN WHATSAPP: Si el usuario quiere comprar o pide un descuento, ofrece derivar a WhatsApp de forma orgánica.
5. JAMÁS inventes productos o precios que no existan en el catálogo.
`;

      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      if (GEMINI_API_KEY) {
        try {
          const contents: any[] = [
            {
              role: "user",
              parts: [{ text: `INSTRUCCIONES DE ATENCIÓN:\n${systemInstruction}` }]
            },
            {
              role: "model",
              parts: [{ text: "Entendido perfectamente. Responderé como un vendedor humano, súper cercano, mostrando los productos reales y sus precios." }]
            }
          ];

          if (Array.isArray(history)) {
            history.forEach((h: any) => {
              const textContent = h.content || h.text;
              if (textContent) {
                const role = (h.role === "user" || h.sender === "user") ? "user" : "model";
                contents.push({
                  role,
                  parts: [{ text: textContent }]
                });
              }
            });
          }

          contents.push({
            role: "user",
            parts: [{ text: message || "Hola, ¿qué productos tenés disponibles y qué precios tienen?" }]
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
                  maxOutputTokens: 250
                }
              })
            }
          );

          if (geminiRes.ok) {
            const aiData = await geminiRes.json();
            const aiText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiText && aiText.trim().length > 0) {
              return NextResponse.json({
                response: aiText.trim(),
                reply: aiText.trim()
              });
            }
          }
        } catch (geminiErr) {
          console.error("Error llamando a Gemini API:", geminiErr);
        }
      }

      // Si el catálogo fue cargado pero Gemini no devolvió texto, armamos respuesta inteligente directa
      if (catalogContext.length > 0) {
        const sample = catalogContext.slice(0, 3).map(p => `${p.nombre} (${p.precio})`).join(", ");
        const fallbackMessage = `¡Hola! Mirá, en la tienda tenemos disponibles: ${sample}. ¿Te gustaría consultar por alguno en particular o comprar?`;
        return NextResponse.json({
          response: fallbackMessage,
          reply: fallbackMessage
        });
      }

      return NextResponse.json({
        response: "¡Hola! Te cuento que tenemos varios productos disponibles en la tienda. ¿Buscás algo en especial o querés que te recomiende los más vendidos?",
        reply: "¡Hola! Te cuento que tenemos varios productos disponibles en la tienda. ¿Buscás algo en especial o querés que te recomiende los más vendidos?"
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error("Error en virtual-salesman POST:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
                }
