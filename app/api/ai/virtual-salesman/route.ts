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

              // Extraer categorías desde productos si la API de categorías devolvió array vacío
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
${categoriesList.length > 0 ? categoriesList.join(", ") : "Audio y Tecnología, Humidificadores y Hogar, Accesorios"}

CATÁLOGO COMPLETO EN VIVO CON PRECIOS Y CATEGORÍAS:
${JSON.stringify(catalogContext, null, 2)}

ESTRATEGIA DE ATENCIÓN Y VENTA PASO A PASO:
1. SI EL CLIENTE PREGUNTA QUÉ PRODUCTOS HAY O HACE UNA PREGUNTA GENERAL ("¿Qué vendés?", "¿Qué productos tenés?"):
   - Saludá de forma muy amable.
   - Presentá primero las CATEGORÍAS O RUBROS PRINCIPALES de la tienda (ej: Audio & Parlantes, Humidificadores, Auriculares VIP).
   - Preguntale al cliente qué categoría le interesa explorar hoy.

2. SI EL CLIENTE ELIGE UNA CATEGORÍA O PREGUNTA POR ALGO ESPECÍFICO (ej: "Humidificadores", "Auriculares", "Parlantes"):
   - Mencioná 2 o 3 productos destacados de esa categoría con sus nombres exactos y sus precios reales.
   - Preguntale si desea conocer detalles de alguno o ver formas de pago y envíos.

3. SI EL CLIENTE HACE PREGUNTAS TÉCNICAS, STOCK, TALLES O COLORES:
   - Responde con precisión basándote en los datos reales del catálogo.

4. TONO Y FORMATO:
   - Hablá como un vendedor real en un showroom (cálido, cercano, amigable).
   - MÁXIMO 2 A 4 ORACIONES POR RESPUESTA. Jamás escribas textos gigantes.
   - Si el cliente demuestra intención clara de compra o pide asesoramiento personalizado, invitá cordialmente a continuar el pedido por WhatsApp.
`;

      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      if (GEMINI_API_KEY) {
        try {
          const contents: any[] = [
            {
              role: "user",
              parts: [{ text: `INSTRUCCIONES DE ATENCIÓN CONCIERGE:\n${systemInstruction}` }]
            },
            {
              role: "model",
              parts: [{ text: "Entendido perfectamente. Seré un asesor comercial súper humano y servicial. Cuando me pregunten en general, presentaré primero las categorías de la tienda para orientar al cliente paso a paso." }]
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
          console.error("Excepción Gemini API:", geminiErr);
        }
      }

      // Fallback dinámico si Gemini se demora
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
