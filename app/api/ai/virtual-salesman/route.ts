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

function smartLocalReply(message: string, catalog: CatalogItem[], customPrompt: string): string {
  const q = normalize(message);
  
  // Detección de intenciones críticas
  const wantsPay = q.includes("tarjeta") || q.includes("pago") || q.includes("cuota") || q.includes("credito") || q.includes("debito") || q.includes("transferencia") || q.includes("efectivo");
  const wantsShipping = q.includes("envio") || q.includes("mandan") || q.includes("llega") || q.includes("domicilio");
  const wantsLocation = q.includes("donde estan") || q.includes("ubicacion") || q.includes("local") || q.includes("tienda fisica");
  const wantsHuman = q.includes("hablar con alguien") || q.includes("humano") || q.includes("persona") || q.includes("whatsapp");

  // Respuesta para Pagos
  if (wantsPay) {
    return "¡Sí, aceptamos tarjeta! Podés pagar en cuotas, por transferencia o efectivo con descuento. Si querés, te paso el link de pago o los datos por WhatsApp ahora mismo, ¿te parece?";
  }

  // Respuesta para Envíos
  if (wantsShipping) {
    return "Hacemos envíos a todo el país. Decime de dónde sos y te digo el costo y cuánto demora en llegarte, ¡está saliendo todo súper rápido!";
  }

  // Respuesta para Ubicación
  if (wantsLocation) {
    return "Operamos principalmente online con envíos rápidos, pero si querés retirar o ver algo puntual, escribime al WhatsApp y te paso la dirección exacta y horarios.";
  }

  // Búsqueda de productos en catálogo
  const scored = catalog.map(p => {
    const blob = normalize(`${p.nombre} ${p.categoria} ${p.resumen}`);
    let score = 0;
    q.split(/\s+/).forEach(t => { if (t.length > 3 && blob.includes(t)) score += 2; });
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const top = scored.slice(0, 2).map(x => `${x.p.nombre} (${x.p.precio})`).join(" y ");
    return `¡Claro! Tenemos ${top}. ¿Te gustaría que te dé más detalles de estos modelos o preferís que coordinemos la compra por WhatsApp?`;
  }

  // Fallback humano y proactivo
  return "¡Hola! Te puedo ayudar con cualquier duda de la tienda, pagos o productos. ¿Buscabas algo en especial o querés que te recomiende lo más vendido según tu presupuesto?";
}

async function askGemini(systemInstruction: string, message: string, history: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `${systemInstruction}\n\nHISTORIAL:\n${JSON.stringify(history)}\n\nCLIENTE: ${message}\n\nASESOR:`;

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
  } catch (e) { return null; }
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
      // Obtener credenciales
      const { data: tnData } = await supabase.from("tiendanube_settings").select("store_id, access_token").eq("user_id", user_id).maybeSingle();
      const sId = tnData?.store_id;
      const token = tnData?.access_token;

      // Obtener settings (para el custom_prompt)
      const { data: aiSet } = await supabase.from("vendedor_ia_settings").select("settings").eq("user_id", user_id).maybeSingle();
      const customPrompt = aiSet?.settings?.custom_prompt || "";

      const catalog: CatalogItem[] = [];
      if (sId && token) {
        const tnRes = await fetch(`https://api.tiendanube.com/v1/${sId}/products?per_page=100&published=true`, {
          headers: { Authentication: `bearer ${token}`, "User-Agent": "Nevux (admin@nevux.ar)" }
        });
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
              variantes: "",
              resumen: p.description?.es?.replace(/<[^>]*>/g, "").slice(0, 150) || ""
            });
          });
        }
      }

      const systemInstruction = `
Eres el asesor humano de la tienda. Tono cálido, servicial y directo.
Conoces este catálogo real: ${JSON.stringify(catalog.slice(0, 20))}
Instrucciones extra del dueño: ${customPrompt}
REGLAS:
1. Responde SIEMPRE a la pregunta específica (pagos, envíos, productos).
2. Si preguntan pagos: acepta tarjetas, transferencia y efectivo.
3. Máximo 3 oraciones. Sé muy humano ("¡Hola! Mirá...", "Dale, te cuento...").
4. Si hay interés, ofrece WhatsApp para cerrar.
`;

      const geminiText = await askGemini(systemInstruction, message, history || []);
      if (geminiText) return NextResponse.json({ response: geminiText });

      const local = smartLocalReply(message, catalog, customPrompt);
      return NextResponse.json({ response: local });
    }
  } catch (err: any) {
    return NextResponse.json({ response: "¡Hola! ¿En qué te puedo ayudar hoy?" });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const { data } = await supabase.from("vendedor_ia_settings").select("*").eq("user_id", userId).maybeSingle();
  return NextResponse.json(data || {});
                                    }
