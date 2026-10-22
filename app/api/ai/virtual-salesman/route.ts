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

function smartLocalReply(message: string, catalog: CatalogItem[], history: any[]): { text: string; showWhatsappBtn: boolean } {
  const q = normalize(message);
  
  // Analizar último mensaje del bot para dar continuidad
  let lastBotMsg = "";
  if (history && history.length > 0) {
    const lastItem = history.filter((h: any) => h.role === "assistant" || h.sender === "bot" || h.role === "model").pop();
    if (lastItem) lastBotMsg = normalize(lastItem.content || lastItem.text || "");
  }

  const isAffirmative = /^(si|sí|dale|ok|oka|bueno|genial|joya|me parece|perfecto|obvio|de una|claro|por supuesto)/.test(q);
  const isLocationMention = /(buenos aires|caba|palermo|belgrano|caballito|recoleta|cordoba|rosario|santa fe|mendoza|tucuman|neuquen|salta|barrio|provincia|interior|zona|capital)/.test(q);

  // 1. DETECCIÓN DIRECTA DE CIERRE POR WHATSAPP
  const wantsWhatsapp = /(whatsapp|wa|wpp|coordinar|pasamos a coordinar|pasar a whatsapp|hablar por whatsapp|comprar por whatsapp|dame el whatsapp|contacto|hablar con un humano|vendedor)/.test(q);

  if (wantsWhatsapp || (lastBotMsg.includes("whatsapp") && isAffirmative)) {
    return {
      text: "¡Buenísimo! Hacé clic en el botón verde de abajo para abrir nuestro WhatsApp oficial y coordinar el pago y envío de tu pedido al instante.",
      showWhatsappBtn: true
    };
  }

  // 2. Memoria de conversación por zona/envío
  if (lastBotMsg.includes("donde sos") && (isLocationMention || q.length > 2)) {
    return {
      text: "¡Genial! A esa zona llegamos en el día con motomensajería o por correo expreso a todo el país. ¿Querés que pasemos a coordinar el envío por WhatsApp?",
      showWhatsappBtn: true
    };
  }

  // 3. Diccionario de intenciones frecuentes
  const wantsShipping = /(envio|envíos|mandan|llega|domicilio|correo|andreani|oca|moto|cadete|despacho|flete|costo|cuanto sale|gratis|llegar)/.test(q) || isLocationMention;
  const wantsPay = /(tarjeta|pago|cuota|credito|debito|transferencia|efectivo|mercadopago|mercado pago|mp|descuento)/.test(q);
  const wantsLocation = /(donde estan|ubicacion|local|tienda fisica|direccion|calle|showroom|retirar|retiro)/.test(q);
  const wantsBestSellers = /(mas vendido|más vendido|top|mejores|recomendaciones|destacados|sugerencia|mas vendidos)/.test(q);
  const wantsGreeting = /^(hola|buenas|buen dia|buen día|buenas tardes|que tal)/.test(q) && q.length < 20;

  if (wantsGreeting) {
    return {
      text: "¡Hola! Qué bueno tenerte en la tienda. ¿Buscás algún producto en particular o querés que te recomiende lo más vendido?",
      showWhatsappBtn: false
    };
  }

  if (wantsBestSellers) {
    if (catalog.length > 0) {
      const top = catalog.slice(0, 3).map(p => `${p.nombre} (${p.precio})`).join(", ");
      return {
        text: `¡De una! Entre lo más vendido de la tienda tenemos: ${top}. ¿Te interesa conocer más detalles de alguno o pasamos a coordinar por WhatsApp?`,
        showWhatsappBtn: true
      };
    }
    return {
      text: "¡De una! Entre lo más pedido tenemos nuestros productos de audio, humidificadores y tecnología VIP. ¿Te interesa alguna línea en especial?",
      showWhatsappBtn: false
    };
  }

  if (wantsShipping) {
    return {
      text: "Hacemos envíos rápidos a todo el país (por correo y moto en CABA/GBA). Si me decís tu localidad o barrio, te confirmo el tiempo de entrega al instante.",
      showWhatsappBtn: false
    };
  }

  if (wantsPay) {
    return {
      text: "Aceptamos todas las tarjetas en cuotas, y también podés abonar por transferencia o efectivo con descuento especial. ¿Querés que armemos el pedido por WhatsApp?",
      showWhatsappBtn: true
    };
  }

  if (wantsLocation) {
    return {
      text: "Somos una tienda online con envíos a todo el país. Si necesitás coordinar un retiro o atención directa, podés escribirnos a nuestro WhatsApp.",
      showWhatsappBtn: true
    };
  }

  // 4. Búsqueda directa en productos del catálogo
  const scored = catalog.map(p => {
    const blob = normalize(`${p.nombre} ${p.categoria} ${p.resumen}`);
    let score = 0;
    q.split(/\s+/).forEach(t => { if (t.length > 3 && blob.includes(t)) score += 2; });
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const top = scored.slice(0, 2).map(x => `${x.p.nombre} a ${x.p.precio}`).join(" y ");
    return {
      text: `¡Sí! Encontré esto disponible en la tienda: ${top}. ¿Te gustaría que te dé más detalles o pasamos a coordinar por WhatsApp?`,
      showWhatsappBtn: true
    };
  }

  // 5. Resguardo dinámico con productos reales de la tienda
  if (catalog.length > 0) {
    const sample = catalog.slice(0, 3).map(p => `${p.nombre} (${p.precio})`).join(", ");
    return {
      text: `Te puedo asesorar con cualquiera de nuestros productos, como: ${sample}. ¿Sobre cuál te gustaría consultar?`,
      showWhatsappBtn: false
    };
  }

  return {
    text: "¡Hola! Te puedo ayudar con información sobre productos, envíos a todo el país o medios de pago. ¿En qué te puedo asesorar hoy?",
    showWhatsappBtn: false
  };
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

      // Búsqueda del token de Tiendanube
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

      const userMsg = message || "";
      const isWhatsappQuery = /(whatsapp|wa|wpp|coordinar|pasamos a coordinar|pasar a whatsapp|hablar por whatsapp|comprar por whatsapp|dame el whatsapp)/i.test(userMsg);

      if (isWhatsappQuery) {
        const closureText = "¡Buenísimo! Hacé clic en el botón verde de abajo para abrir nuestro WhatsApp oficial y coordinar el pago y envío de tu pedido al instante.";
        return NextResponse.json({ response: closureText, reply: closureText, showWhatsappBtn: true });
      }

      const systemInstruction = `
Eres un vendedor de atención al cliente humano de la tienda online.
Cuentas con la información de todo el catálogo en vivo:
${JSON.stringify(catalog.slice(0, 40))}

REGLAS DE ATENCIÓN:
1. Responde de forma muy amigable, fluida y empática (tono argentino: "¡Hola!", "De una", "Te cuento", "Mirá").
2. Si el cliente indica su intención de comprar o coordinar por WhatsApp, invítalo entusiastamente a dar clic al botón de WhatsApp.
3. MÁXIMO 3 ORACIONES por respuesta. Mantenlo muy dinámico y enfocado a vender.
`;

      const geminiText = await askGemini(systemInstruction, userMsg, history || []);
      if (geminiText) {
        return NextResponse.json({ 
          response: geminiText, 
          reply: geminiText, 
          showWhatsappBtn: isWhatsappQuery || geminiText.toLowerCase().includes("whatsapp") 
        });
      }

      const local = smartLocalReply(userMsg, catalog, history || []);
      return NextResponse.json({ 
        response: local.text, 
        reply: local.text, 
        showWhatsappBtn: local.showWhatsappBtn 
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ response: "¡Hola! ¿En qué te puedo asesorar sobre la tienda hoy?", showWhatsappBtn: false });
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
