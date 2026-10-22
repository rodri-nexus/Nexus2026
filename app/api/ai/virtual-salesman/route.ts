// app/api/ai/virtual-salesman/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type CatalogItem = {
  nombre: string;
  precio: string;
  precioNum: number;
  categoria: string;
  stock: string;
  variantes: string;
  resumen: string;
};

function normalize(text: string) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function smartLocalReply(message: string, catalog: CatalogItem[], history: any[]): string {
  const q = normalize(message);
  
  // Analizar último mensaje del bot para dar continuidad
  let lastBotMsg = "";
  if (history && history.length > 0) {
    const lastItem = history.filter((h: any) => h.role === "assistant" || h.sender === "bot" || h.role === "model").pop();
    if (lastItem) lastBotMsg = normalize(lastItem.content || lastItem.text || "");
  }

  const isAffirmative = /^(si|sí|dale|ok|oka|bueno|genial|joya|me parece|perfecto|obvio|de una|claro|por supuesto)/.test(q);
  const isLocationMention = /(buenos aires|caba|palermo|belgrano|caballito|recoleta|cordoba|rosario|santa fe|mendoza|tucuman|neuquen|salta|barrio|provincia|interior|zona|capital)/.test(q);

  // 1. Memoria de conversación
  if (lastBotMsg.includes("whatsapp") && isAffirmative) {
    return "¡Buenísimo! Hacé clic en el botón de WhatsApp para coordinar los detalles del pedido y la entrega de inmediato.";
  }

  if (lastBotMsg.includes("donde sos") && (isLocationMention || q.length > 2)) {
    return "¡Genial! A esa zona llegamos en el día con motomensajería o por correo expreso a todo el país. ¿Querés que te pasemos los datos por WhatsApp para coordinar el envío?";
  }

  // 2. Diccionario de intenciones frecuentes
  const wantsShipping = /(envio|envíos|mandan|llega|domicilio|correo|andreani|oca|moto|cadete|despacho|flete|costo|cuanto sale|gratis|llegar)/.test(q) || isLocationMention;
  const wantsPay = /(tarjeta|pago|cuota|credito|debito|transferencia|efectivo|mercadopago|mercado pago|mp|descuento)/.test(q);
  const wantsLocation = /(donde estan|ubicacion|local|tienda fisica|direccion|calle|showroom|retirar|retiro)/.test(q);
  const wantsBestSellers = /(mas vendido|más vendido|top|mejores|recomendaciones|destacados|sugerencia|mas vendidos)/.test(q);
  const wantsGreeting = /^(hola|buenas|buen dia|buen día|buenas tardes|que tal)/.test(q) && q.length < 20;

  if (wantsGreeting) {
    return "¡Hola! Qué bueno tenerte en la tienda. ¿Buscás algún producto en particular o querés que te recomiende lo más vendido?";
  }

  if (wantsBestSellers) {
    if (catalog.length > 0) {
      const top = catalog.slice(0, 3).map(p => `${p.nombre} (${p.precio})`).join(", ");
      return `¡De una! Entre lo más vendido de la tienda tenemos: ${top}. ¿Te interesa conocer más detalles de alguno?`;
    }
    return "¡De una! Entre lo más pedido tenemos nuestros productos de audio, humidificadores y tecnología VIP. ¿Te interesa alguna línea en especial?";
  }

  if (wantsShipping) {
    return "Hacemos envíos rápidos a todo el país (por correo y moto en CABA/GBA). Si me decís tu localidad o barrio, te confirmo el tiempo de entrega al instante.";
  }

  if (wantsPay) {
    return "Aceptamos todas las tarjetas en cuotas, y también podés abonar por transferencia o efectivo con descuento especial. ¿Querés que armemos el pedido por WhatsApp?";
  }

  if (wantsLocation) {
    return "Somos una tienda online con envíos a todo el país. Si necesitás coordinar un retiro o atención directa, podés escribirnos al WhatsApp de la tienda.";
  }

  // 3. Búsqueda directa en productos del catálogo
  const scored = catalog.map(p => {
    const blob = normalize(`${p.nombre} ${p.categoria} ${p.resumen}`);
    let score = 0;
    q.split(/\s+/).forEach(t => { if (t.length > 3 && blob.includes(t)) score += 2; });
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const top = scored.slice(0, 2).map(x => `${x.p.nombre} a ${x.p.precio}`).join(" y ");
    return `¡Sí! Encontré esto disponible en la tienda: ${top}. ¿Te gustaría que te de más detalles o pasamos a coordinar por WhatsApp?`;
  }

  // 4. Resguardo dinámico con productos reales de la tienda
  if (catalog.length > 0) {
    const sample = catalog.slice(0, 3).map(p => `${p.nombre} (${p.precio})`).join(", ");
    return `Te puedo asesorar con cualquiera de nuestros productos, como: ${sample}. ¿Sobre cuál te gustaría consultar?`;
  }

  return "¡Hola! Te puedo ayudar con información sobre productos, envíos a todo el país o medios de pago. ¿En qué te puedo asesorar hoy?";
}

async function askGemini(systemInstruction: string, message: string, history: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

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

  const prompt = `${systemInstruction}\n\nHISTORIAL DE CHAT:\n${formattedHistory}\n\nPREGUNTA ACTUAL DEL CLIENTE: "${message}"\n\nRESPUESTA DEL ASESOR (Máximo 3 oraciones, muy humano y servicial):`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { action, store_id, user_id, message, history } = body;

    if (action === "save") {
      const { settings } = body;
      const { data, error } = await supabase.from("vendedor_ia_settings").upsert({ 
        store_id: store_id ? String(store_id) : undefined, 
        user_id: user_id || undefined, 
        settings, 
        updated_at: new Date().toISOString() 
      }).select().single();
      return NextResponse.json({ success: true, data });
    }

    if (action === "chat") {
      let token = body.access_token as string | undefined;
      let sId = store_id ? String(store_id) : null;

      // Búsqueda exhaustiva del token de Tiendanube
      if (!token) {
        if (sId) {
          const { data } = await supabase.from("tiendanube_settings").select("store_id, access_token").eq("store_id", sId).maybeSingle();
          if (data?.access_token) token = data.access_token;
        }
        if (!token && user_id) {
          const { data } = await supabase.from("tiendanube_settings").select("store_id, access_token").eq("user_id", user_id).maybeSingle();
          if (data?.access_token) {
            sId = String(data.store_id);
            token = data.access_token;
          }
        }
        if (!token) {
          const { data } = await supabase.from("tiendanube_settings").select("store_id, access_token").limit(1).maybeSingle();
          if (data?.access_token) {
            sId = String(data.store_id);
            token = data.access_token;
          }
        }
        if (!token) {
          const { data } = await supabase.from("stores").select("store_id, access_token").not("access_token", "is", null).limit(1).maybeSingle();
          if (data?.access_token) {
            sId = String(data.store_id);
            token = data.access_token;
          }
        }
      }

      const catalog: CatalogItem[] = [];
      if (sId && token) {
        try {
          const tnRes = await fetch(`https://api.tiendanube.com/v1/${sId}/products?per_page=100&published=true`, {
            headers: { Authentication: `bearer ${token}`, "User-Agent": "NevuxAI" }
          });
          if (tnRes.ok) {
            const products = await tnRes.json();
            if (Array.isArray(products)) {
              products.forEach((p: any) => {
                const price = Number(p.variants?.[0]?.price || 0);
                catalog.push({
                  nombre: p.name?.es || p.name?.en || "Producto",
                  precio: price ? `$${price.toLocaleString("es-AR")}` : "Consultar",
                  precioNum: price,
                  categoria: p.categories?.map((c: any) => c.name?.es).filter(Boolean).join(", ") || "General",
                  stock: p.variants?.[0]?.stock > 0 ? "Disponible" : "Sin stock",
                  variantes: p.variants?.map((v: any) => v.values?.map((val: any) => val.es).join(" / ")).filter(Boolean).join(", ") || "",
                  resumen: p.description?.es?.replace(/<[^>]*>/g, "").slice(0, 150) || ""
                });
              });
            }
          }
        } catch (e) {
          console.error("Error cargando productos:", e);
        }
      }

      const systemInstruction = `
Eres un vendedor de atención al cliente humano de la tienda online.
Cuentas con la información de todo el catálogo en vivo:
${JSON.stringify(catalog.slice(0, 40))}

REGLAS DE ATENCIÓN:
1. Responde de forma muy amigable, fluida y empática (tono argentino: "¡Hola!", "De una", "Te cuento", "Mirá").
2. Si el cliente indica su ubicación o barrio (ej: Palermo, CABA, Córdoba), infórmale sobre los envíos a esa zona.
3. Si el cliente pide ver lo más vendido o recomendaciones, presenta opciones reales con su precio.
4. MÁXIMO 3 ORACIONES por respuesta. Mantenlo muy dinámico y enfocado a vender.
`;

      const geminiText = await askGemini(systemInstruction, message || "", history || []);
      if (geminiText) return NextResponse.json({ response: geminiText, reply: geminiText });

      const local = smartLocalReply(message || "", catalog, history || []);
      return NextResponse.json({ response: local, reply: local });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ response: "¡Hola! ¿En qué te puedo asesorar sobre la tienda hoy?" });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const storeId = searchParams.get("store_id");

  let query = supabase.from("vendedor_ia_settings").select("*");
  if (storeId) query = query.eq("store_id", String(storeId));
  else if (userId) query = query.eq("user_id", userId);

  const { data } = await query.maybeSingle();
  return NextResponse.json({ settings: data?.settings || data || null });
                        }
