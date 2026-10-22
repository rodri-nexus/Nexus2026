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

    // ACCIÓN 2: CHAT CON CONCIERGE IA
    if (action === "chat") {
      let token = body.access_token;
      let sId = store_id ? String(store_id) : null;

      // Búsqueda de credenciales de Tiendanube en Supabase
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

      // 1. Obtener Categorías y Productos reales de Tiendanube
      let categoriesList: string[] = [];
      let catalogContext: any[] = [];

      if (sId && token) {
        try {
          // Obtener Categorías
          const catRes = await fetch(`https://api.tiendanube.com/v1/${sId}/categories`, {
            headers: {
              "Authentication": `bearer ${token}`,
              "User-Agent": "Nevux (admin@nevux.ar)"
            }
          });
          if (catRes.ok) {
            const cats = await catRes.json();
            if (Array.isArray(cats)) {
              categoriesList = cats.map((c: any) => c.name?.es || c.name?.en || c.name?.pt).filter(Boolean);
            }
          }

          // Obtener Productos con sus categorías y detalles
          const tnRes = await fetch(`https://api.tiendanube.com/v1/${sId}/products?per_page=50&published=true`, {
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
                const prodCats = p.categories?.map((c: any) => c.name?.es || c.name?.en).filter(Boolean) || [];

                return {
                  nombre: p.name?.es || p.name?.en || p.name?.pt || "Producto",
                  precio: formattedPrice,
                  categoria: prodCats.length > 0 ? prodCats.join(", ") : "General",
                  stock: p.variants?.reduce((a: number, v: any) => a + (v.stock || 0), 0) > 0 ? "Disponible" : "Agotado",
                  variantes: p.variants?.map((v: any) => v.values?.[0]?.es).filter(Boolean).slice(0, 3).join(", ") || "Único"
                };
              });

              if (categoriesList.length === 0) {
                const extracted = new Set<string>();
                catalogContext.forEach(item => {
                  if (item.categoria && item.categoria !== "General") {
                    extracted.add(item.categoria);
                  }
                });
                categoriesList = Array.from(extracted);
              }
            }
          }
        } catch (catErr) {
          console.error("Excepción API Tiendanube:", catErr);
        }
      }

      // 2. Prompt Concierge Humano Experto
      const systemInstruction = `
Eres un asesor comercial humano, experto, súper cálido, servicial y amable de la tienda online. Tu meta es guiar al cliente de manera fluida y atenta para que encuentre lo que busca y disfrute su experiencia de compra.

CATEGORÍAS DE LA TIENDA:
${categoriesList.length > 0 ? categoriesList.join(", ") : "Audio y Tecnología, Humidificadores, Smartwatches, Fitness, Belleza, Hogar"}

CATÁLOGO COMPLETO EN VIVO CON PRECIOS Y CATEGORÍAS:
${JSON.stringify(catalogContext, null, 2)}

ESTRATEGIA DE ATENCIÓN Y VENTA PASO A PASO:
1. SI EL CLIENTE PREGUNTA QUÉ PRODUCTOS HAY O HACE UNA PREGUNTA GENERAL ("¿Qué vendés?", "¿Qué productos tenés?"):
   - Saludá amablemente.
   - Presentá primero las CATEGORÍAS O RUBROS PRINCIPALES de la tienda.
   - Preguntale al cliente qué categoría le interesa explorar hoy.

2. SI EL CLIENTE ELIGE O PREGUNTA POR UNA CATEGORÍA O PRODUCTO ESPECÍFICO (ej: "Humidificadores", "Auriculares", "Smartwatches"):
   - Mencioná de inmediato 2 a 4 productos concretos de esa categoría con sus nombres exactos y precios reales del catálogo.
   - Preguntale si desea conocer detalles de alguno o asesoramiento para comprar por WhatsApp.

3. TONO Y FORMATO:
   - Hablá como una persona real (cálida, empática, amigable).
   - MÁXIMO 2 A 4 ORACIONES POR RESPUESTA.
   - Ofrece derivar a WhatsApp si el cliente demuestra intención clara de compra.
`;

      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      if (GEMINI_API_KEY) {
        try {
          // Construcción estricta de turnos para Gemini API (User -> Model -> User -> Model)
          const geminiContents: any[] = [];

          if (Array.isArray(history)) {
            history.forEach((h: any) => {
              const textContent = (h.content || h.text || "").trim();
              if (!textContent) return;

              const role = (h.role === "user" || h.sender === "user") ? "user" : "model";

              // Gemini exige que el primer mensaje en contents sea de rol "user"
              if (geminiContents.length === 0 && role !== "user") {
                return;
              }

              const lastTurn = geminiContents[geminiContents.length - 1];
              if (lastTurn && lastTurn.role === role) {
                lastTurn.parts[0].text += `\n${textContent}`;
              } else {
                geminiContents.push({
                  role,
                  parts: [{ text: textContent }]
                });
              }
            });
          }

          const currentMsgText = (message || "Hola, ¿qué productos tenés disponibles?").trim();
          const lastTurn = geminiContents[geminiContents.length - 1];
          if (lastTurn && lastTurn.role === "user") {
            lastTurn.parts[0].text += `\n${currentMsgText}`;
          } else {
            geminiContents.push({
              role: "user",
              parts: [{ text: currentMsgText }]
            });
          }

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemInstruction }]
                },
                contents: geminiContents,
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
              return NextResponse.json({
                response: aiText.trim(),
                reply: aiText.trim()
              });
            }
          } else {
            console.error("Gemini API Error details:", geminiRes.status, await geminiRes.text());
          }
        } catch (geminiErr) {
          console.error("Excepción Gemini API:", geminiErr);
        }
      }

      // Fallback dinámico
      const catsFormatted = categoriesList.length > 0 ? categoriesList.join(", ") : "Audio, Humidificadores y Tecnología";
      const fallbackMsg = `¡Hola! Con gusto te cuento. En la tienda contamos con categorías como: ${catsFormatted}.\n\n¿Qué tipo de producto te gustaría ver hoy?`;

      return NextResponse.json({
        response: fallbackMsg,
        reply: fallbackMsg
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error("Error en virtual-salesman POST:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
            }
