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

function smartLocalReply(message: string, catalog: CatalogItem[], customPrompt: string, history: any[]): string {
  const q = normalize(message);
  
  // Extraer el último mensaje del asistente para darle MEMORIA al bot
  let lastBotMsg = "";
  if (history && history.length > 0) {
    const lastItem = history.filter((h: any) => h.role === "assistant" || h.sender === "bot" || h.role === "model").pop();
    if (lastItem) lastBotMsg = normalize(lastItem.content || lastItem.text || "");
  }

  // 1. MEMORIA DE CONTEXTO (Continuación de conversación)
  const isAffirmative = /^(si|sí|dale|ok|oka|bueno|genial|joya|me parece|perfecto|obvio|de una|claro|por supuesto)/.test(q);
  const isLocationContext = /(de donde sos|donde sos|decime de donde|a que zona)/.test(lastBotMsg);
  const isPaymentContext = /(te paso el link|datos por whatsapp|coordinamos)/.test(lastBotMsg);

  if (isPaymentContext && isAffirmative) {
    return "¡Excelente! Hacé clic en el botón de WhatsApp o escribinos a nuestro número para tomarte el pedido al instante y pasarte los datos de pago.";
  }

  const isLocationMention = /(buenos aires|caba|palermo|belgrano|caballito|recoleta|cordoba|rosario|santa fe|mendoza|tucuman|neuquen|salta|barrio|provincia|interior|zona|capital)/.test(q);
  
  if (isLocationContext && (isLocationMention || q.length > 3)) {
    return "¡Perfecto! A esa zona llegamos súper rápido por correo o motomensajería. Si me escribís al WhatsApp con tu código postal exacto, te confirmo el costo y qué día te llega a la puerta de tu casa.";
  }

  // 2. DETECCIÓN DE INTENCIONES (Diccionario Extenso de Dudas Frecuentes)
  const wantsShipping = /(envio|envíos|mandan|llega|domicilio|correo|andreani|oca|moto|cadete|despacho|flete|costo|cuanto sale|gratis|llegar)/.test(q) || isLocationMention;
  const wantsPay = /(tarjeta|pago|cuota|credito|debito|transferencia|efectivo|mercadopago|mercado pago|mp|descuento)/.test(q);
  const wantsLocation = /(donde estan|ubicacion|local|tienda fisica|direccion|calle|showroom|retirar|retiro)/.test(q);
  const wantsHours = /(horario|abierto|cierran|abren|dias|feriado|finde)/.test(q);
  const wantsWarranty = /(garantia|cambio|devolucion|falla|roto|rompe|seguro)/.test(q);
  const wantsBestSellers = /(mas vendido|recomendados|top|mejores|recomendame|mostrame lo mas vendido|que recomendas|sugerencia)/.test(q);
  const wantsGreeting = /^(hola|buenas|buen dia|buen día|buenas tardes|que tal|como andas)/.test(q) && q.length < 20;

  // RESPUESTAS DIRECTAS POR INTENCIÓN
  if (wantsGreeting) {
    return "¡Hola! Qué bueno tenerte en la tienda. Contame, ¿buscás algún producto en particular o querés que te muestre lo más vendido?";
  }

  if (wantsBestSellers && catalog.length > 0) {
    const top = catalog.slice(0, 3).map(p => `${p.nombre} (${p.precio})`).join(", ");
    return `¡Claro! Entre lo que más se está llevando la gente tenemos: ${top}. ¿Te interesa alguno de estos para darte más detalles?`;
  }

  if (wantsShipping) {
    return "Hacemos envíos a todo el país (por correo o envíos rápidos en el día en CABA/GBA). Si superás cierto monto solemos tener envíos gratis. ¿De qué zona sos así te digo exacto?";
  }

  if (wantsPay) {
    return "Aceptamos todas las tarjetas para que pagues en cuotas, y también podés abonar por transferencia o efectivo con descuento especial. ¿Querés que armemos tu pedido por WhatsApp?";
  }

  if (wantsLocation) {
    return "Nos manejamos principalmente de forma online con envíos rápidos a todo el país. Si necesitás ver algo puntual o coordinar un retiro, escribinos al WhatsApp y te confirmamos stock y punto de entrega.";
  }

  if (wantsHours) {
    return "La tienda online está abierta 24/7 para que compres cuando quieras. La atención por WhatsApp para despachar pedidos suele ser de lunes a viernes en horario comercial. ¡Dejanos tu mensaje y te respondemos al toque!";
  }

  if (wantsWarranty) {
    return "¡Quedate tranquilo! Todos nuestros productos salen probados y tienen garantía por falla de fábrica. Si llegás a tener algún inconveniente, nos contactás y gestionamos el cambio.";
  }

  // 3. BÚSQUEDA ORGÁNICA DE PRODUCTOS EN EL CATÁLOGO
  const scored = catalog.map(p => {
    const blob = normalize(`${p.nombre} ${p.categoria} ${p.resumen} ${p.variantes}`);
    let score = 0;
    q.split(/\s+/).forEach(t => { if (t.length > 3 && blob.includes(t)) score += 2; });
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const top = scored.slice(0, 2).map(x => `${x.p.nombre} a ${x.p.precio}`).join(" y ");
    return `¡Sí, lo tenemos! Encontré esto para vos: ${top}. Ambos están disponibles. ¿Te gustaría que te comente alguna especificación técnica o pasamos a los medios de pago?`;
  }

  // 4. RESPUESTA INTELIGENTE DE RESGUARDO (Nunca vacía)
  return "Entiendo. Puedo ayudarte a encontrar productos específicos, consultar precios, talles o formas de envío. Decime bien qué andás buscando o qué duda tenés y lo resolvemos al instante.";
}

async function askGemini(systemInstruction: string, message: string, history: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `${systemInstruction}\n\nHISTORIAL DE CHAT:\n${JSON.stringify(history)}\n\nPREGUNTA DEL CLIENTE: "${message}"\n\nRESPUESTA DEL ASESOR:`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
      })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (e) { 
    console.error("Fallo llamada a Gemini", e);
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
        store_id: String(store_id), 
        user_id, 
        settings, 
        updated_at: new Date().toISOString() 
      }).select().single();
      return NextResponse.json({ success: true, data });
    }

    if (action === "chat") {
      const { data: tnData } = await supabase.from("tiendanube_settings").select("store_id, access_token").eq("user_id", user_id).maybeSingle();
      const sId = tnData?.store_id;
      const token = tnData?.access_token;

      const { data: aiSet } = await supabase.from("vendedor_ia_settings").select("settings").eq("user_id", user_id).maybeSingle();
      const customPrompt = aiSet?.settings?.custom_prompt || "";

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
                  nombre: p.name?.es || "Producto",
                  precio: `$${price.toLocaleString("es-AR")}`,
                  precioNum: price,
                  categoria: p.categories?.map((c: any) => c.name?.es).join(", ") || "General",
                  stock: p.variants?.[0]?.stock > 0 ? "Disponible" : "Sin stock",
                  variantes: p.variants?.map((v: any) => v.values?.map((val: any) => val.es).join(" / ")).filter(Boolean).join(", ") || "",
                  resumen: p.description?.es?.replace(/<[^>]*>/g, "").slice(0, 150) || ""
                });
              });
            }
          }
        } catch (e) {}
      }

      const systemInstruction = `
Eres un humano vendiendo en la tienda online.
Conoces a la perfección este catálogo real: ${JSON.stringify(catalog.slice(0, 30))}
Directivas de tu jefe: ${customPrompt}
REGLAS:
1. Responde de forma muy amigable, natural y fluida. Tono argentino ("Hola", "Dale", "Mirá").
2. Presta atención al historial. Si el cliente dice su zona, indicale envíos. Si dice sí a una propuesta, guíalo al cierre.
3. Puedes hablar de pagos, envíos a todo el país, retiros, stock y dar asesoramiento.
4. MÁXIMO 3 oraciones por mensaje. Nunca escribas biblias.
`;

      const geminiText = await askGemini(systemInstruction, message, history || []);
      if (geminiText) return NextResponse.json({ response: geminiText });

      const local = smartLocalReply(message, catalog, customPrompt, history || []);
      return NextResponse.json({ response: local });
    }
  } catch (err: any) {
    return NextResponse.json({ response: "¡Hola! Tuve una pequeña falla técnica. ¿Me repetís en qué te puedo ayudar?" });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const { data } = await supabase.from("vendedor_ia_settings").select("*").eq("user_id", userId).maybeSingle();
  return NextResponse.json(data || {});
    }
