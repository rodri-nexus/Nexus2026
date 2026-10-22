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

    // ACCIÓN 2: CHAT INTELIGENTE Y LIBRE CON EL ASESOR IA
    if (action === "chat") {
      let token = body.access_token;
      let sId = store_id ? String(store_id) : null;

      // Obtener credenciales de la tienda
      if (!token) {
        let tnData: any = null;

        if (sId) {
          const { data } = await supabase
            .from("tiendanube_settings")
            .select("store_id, access_token")
            .eq("store_id", sId)
            .maybeSingle();
          tnData = data;
        }

        if (!tnData && user_id) {
          const { data } = await supabase
            .from("tiendanube_settings")
            .select("store_id, access_token")
            .eq("user_id", user_id)
            .maybeSingle();
          tnData = data;
        }

        if (!tnData) {
          const { data } = await supabase
            .from("tiendanube_settings")
            .select("store_id, access_token")
            .limit(1)
            .maybeSingle();
          tnData = data;
        }

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

      // Cargar catálogo completo desde Tiendanube API
      let catalogContext: any[] = [];
      if (sId && token) {
        try {
          const tnRes = await fetch(`https://api.tiendanube.com/v1/${sId}/products?per_page=100&published=true`, {
            headers: {
              "Authentication": `bearer ${token}`,
              "User-Agent": "Nevux (admin@nevux.ar)"
            }
          });
          if (tnRes.ok) {
            const products = await tnRes.json();
            if (Array.isArray(products)) {
              catalogContext = products.map((p: any) => {
                const priceVal = p.variants?.[0]?.price;
                const formattedPrice = priceVal ? `$${Number(priceVal).toLocaleString("es-AR")}` : "Consultar";
                const cats = p.categories?.map((c: any) => c.name?.es || c.name?.en).filter(Boolean).join(", ") || "General";
                const rawDesc = p.description?.es ? p.description.es.replace(/<[^>]*>/g, '').slice(0, 150) : "";

                return {
                  nombre: p.name?.es || p.name?.en || p.name?.pt || "Producto",
                  precio: formattedPrice,
                  categoria: cats,
                  stock: p.variants?.reduce((a: number, v: any) => a + (v.stock || 0), 0) > 0 ? "Disponible" : "Sin stock",
                  variantes: p.variants?.map((v: any) => v.values?.map((val: any) => val.es).join(" / ")).filter(Boolean).join(" | ") || "Único",
                  resumen: rawDesc
                };
              });
            }
          }
        } catch (catErr) {
          console.error("Error al obtener productos de Tiendanube:", catErr);
        }
      }

      // Prompt para un Asesor de Ventas 100% Humano, Libre e Inteligente
      const systemInstruction = `
Eres el asesor comercial oficial de la tienda online.
Conoces la tienda DE ARRIBA A ABAJO. Cuentas con la información real de todo el catálogo en vivo (productos, categorías, precios exactos, variaciones, stock y especificaciones).

CATÁLOGO COMPLETO DE LA TIENDA:
${JSON.stringify(catalogContext, null, 2)}

REGLAS DE ATENCIÓN (LIBERTAD Y AUTONOMÍA TOTAL):
1. LIBERTAD Y AUTONOMÍA: No sigas un libreto estático. Responde de forma libre, orgánica, inteligente y fluida a CUALQUIER pregunta que te haga el cliente (sobre productos específicos, sugerencias de regalos, diferencias entre modelos, medios de pago, envíos, talles, cuotas o stock).
2. TONO HUMANO Y CÁLIDO: Hablá en español amigable y empático, como un gran vendedor de showroom ("¡Hola! Te cuento...", "Mirá, para eso te recomiendo...", "Está genial", "Avisame y te ayudo").
3. MÁXIMO CONCISIÓN: Responde en 2 a 4 oraciones amables. Sé directo, entusiasta y servicial. No escribas bloques largos de texto.
4. INFORMACIÓN REAL: Usa siempre los datos reales provistos en la lista de arriba (nombres de productos, precios y variantes). Jamás inventes productos que no existan.
5. ESCALACIÓN A WHATSAPP: Si el cliente demuestra intención clara de compra o desea atención personalizada, invitá amablemente a continuar el pedido por WhatsApp.
`;

      // Formatear el historial de chat para la consulta
      let formattedHistory = "";
      if (Array.isArray(history)) {
        formattedHistory = history
          .map((h: any) => {
            const sender = (h.role === "user" || h.sender === "user") ? "Cliente" : "Asesor";
            const text = h.content || h.text || "";
            return text ? `${sender}: ${text}` : "";
          })
          .filter(Boolean)
          .join("\n");
      }

      const userQuery = message || "Hola, ¿en qué me podés ayudar hoy?";

      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      if (GEMINI_API_KEY) {
        try {
          const promptPayload = `
INSTRUCCIONES DEL SISTEMA:
${systemInstruction}

HISTORIAL DE LA CONVERSACIÓN:
${formattedHistory || "Inicio de conversación."}

NUEVA PREGUNTA DEL CLIENTE:
"${userQuery}"
`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: promptPayload }]
                  }
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 300
                }
              })
            }
          );

          if (geminiRes.ok) {
            const aiData = await geminiRes.json();
            const aiText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiText && aiText.trim().length > 0) {
              const cleanResponse = aiText.trim();
              return NextResponse.json({
                response: cleanResponse,
                reply: cleanResponse
              });
            }
          } else {
            console.error("Gemini API Error:", geminiRes.status, await geminiRes.text());
          }
        } catch (geminiErr) {
          console.error("Excepción en llamada a Gemini:", geminiErr);
        }
      }

      // Respuesta dinámica de emergencia si falla la red externa
      const defaultAnswer = "¡Hola! Con gusto te asesoro sobre cualquier producto o duda de la tienda. ¿Qué tenías en mente buscar hoy?";
      return NextResponse.json({
        response: defaultAnswer,
        reply: defaultAnswer
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error("Error en virtual-salesman POST:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
        }
