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

    const { data } = await query.maybeSingle();

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

      // Búsqueda exhaustiva de credenciales de Tiendanube
      if (!token) {
        let tnData: any = null;

        // 1. Buscar en tiendanube_settings por store_id
        if (sId) {
          const { data } = await supabase
            .from("tiendanube_settings")
            .select("store_id, access_token")
            .eq("store_id", sId)
            .maybeSingle();
          tnData = data;
        }

        // 2. Buscar en tiendanube_settings por user_id
        if (!tnData && user_id) {
          const { data } = await supabase
            .from("tiendanube_settings")
            .select("store_id, access_token")
            .eq("user_id", user_id)
            .maybeSingle();
          tnData = data;
        }

        // 3. Fallback: buscar la primera tienda en tiendanube_settings
        if (!tnData) {
          const { data } = await supabase
            .from("tiendanube_settings")
            .select("store_id, access_token")
            .limit(1)
            .maybeSingle();
          tnData = data;
        }

        // 4. Fallback: buscar en tabla stores por user_id o store_id
        if (!tnData?.access_token && (user_id || sId)) {
          let stQuery = supabase.from("stores").select("store_id, access_token");
          if (user_id) stQuery = stQuery.eq("user_id", user_id);
          else if (sId) stQuery = stQuery.eq("store_id", sId);
          const { data } = await stQuery.limit(1).maybeSingle();
          if (data?.access_token) tnData = data;
        }

        if (tnData) {
          sId = sId || String(tnData.store_id);
          token = tnData.access_token;
        }
      }

      // Obtener productos reales de Tiendanube
      let catalogContext: any[] = [];
      if (sId && token) {
        try {
          const tnRes = await fetch(`https://api.tiendanube.com/v1/${sId}/products?per_page=40&published=true`, {
            headers: {
              "Authentication": `bearer ${token}`,
              "User-Agent": "Nevux (admin@nevux.ar)"
            }
          });
          if (tnRes.ok) {
            const products = await tnRes.json();
            if (Array.isArray(products) && products.length > 0) {
              catalogContext = products.map((p: any) => {
                const priceVal = p.variants?.[0]?.price;
                const formattedPrice = priceVal ? `$${Number(priceVal).toLocaleString("es-AR")}` : "Consultar";
                return {
                  nombre: p.name?.es || p.name?.en || p.name?.pt || "Producto",
                  precio: formattedPrice,
                  stock: p.variants?.reduce((a: number, v: any) => a + (v.stock || 0), 0) > 0 ? "Disponible" : "Agotado",
                  variantes: p.variants?.map((v: any) => v.values?.[0]?.es).filter(Boolean).slice(0, 3).join(", ") || "Único"
                };
              });
            }
          } else {
            console.error("Error API Tiendanube:", tnRes.status, await tnRes.text());
          }
        } catch (catErr) {
          console.error("Excepción API Tiendanube:", catErr);
        }
      }

      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      // Si tenemos productos reales, Gemini o el formateador directo informarán los productos
      if (catalogContext.length > 0) {
        const systemInstruction = `
Eres un vendedor comercial de una tienda online, súper humano, cálido, cercano y entusiasta. Hablás en español latino/argentino amigable ("¡Hola!", "Te cuento que...", "Mirá, tenemos...").

CATÁLOGO REAL EN VIVO CON PRECIOS Y STOCK:
${JSON.stringify(catalogContext, null, 2)}

REGLAS OBLIGATORIAS:
1. SI TE PREGUNTAN QUÉ PRODUCTOS HAY O QUÉ VENDES: Presenta de inmediato 3 o 4 productos concretos de la lista anterior con sus nombres exactos y sus precios reales.
2. MÁXIMO 2 A 4 FRASES CORTAS. No escribas párrafos largos.
3. SI TE PREGUNTAN TALLES O STOCK: Responde con seguridad basándote en la lista.
4. CIERRE EN WHATSAPP: Ofrece derivar a WhatsApp si el cliente muestra intención de compra o pide ayuda directa.
5. JAMÁS inventes productos ni precios fuera del catálogo provisto.
`;

        if (GEMINI_API_KEY) {
          try {
            const contents: any[] = [
              {
                role: "user",
                parts: [{ text: `INSTRUCCIONES DE ATENCIÓN:\n${systemInstruction}` }]
              },
              {
                role: "model",
                parts: [{ text: "Entendido perfectamente. Responderé mostrando de inmediato los productos reales con sus nombres exactos y precios." }]
              }
            ];

            if (Array.isArray(history)) {
              history.forEach((h: any) => {
                const textContent = h.content || h.text;
                if (textContent) {
                  const role = (h.role === "user" || h.sender === "user") ? "user" : "model";
                  contents.push({ role, parts: [{ text: textContent }] });
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
            } else {
              console.error("Gemini API Error:", geminiRes.status, await geminiRes.text());
            }
          } catch (geminiErr) {
            console.error("Excepción Gemini API:", geminiErr);
          }
        }

        // Si Gemini no devolvió texto pero SÍ tenemos productos de Tiendanube:
        const sampleProducts = catalogContext.slice(0, 4).map(p => `• ${p.nombre}: ${p.precio}`).join("\n");
        const catalogMsg = `¡Hola! Te cuento que en la tienda tenemos disponibles productos geniales como:\n\n${sampleProducts}\n\n¿Te gustaría consultar por alguno en particular o conocer las formas de pago?`;

        return NextResponse.json({
          response: catalogMsg,
          reply: catalogMsg
        });
      }

      // Si catalogContext.length === 0 (no hay productos cargados o no se encontró el token)
      const emptyMsg = "¡Hola! Estaba consultando la base de datos de tu Tiendanube pero no encontré productos activos guardados en tu catálogo. Si ya tenés productos cargados, por favor verificá que estén en estado 'Publicado'.";
      return NextResponse.json({
        response: emptyMsg,
        reply: emptyMsg
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error("Error en virtual-salesman POST:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
