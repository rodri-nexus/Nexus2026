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
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extractCategories(catalog: CatalogItem[]) {
  const set = new Set<string>();
  catalog.forEach((p) => {
    p.categoria
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c && c !== "General")
      .forEach((c) => set.add(c));
  });
  return Array.from(set);
}

function smartLocalReply(message: string, catalog: CatalogItem[]): string {
  const q = normalize(message);
  const categories = extractCategories(catalog);

  // Intención: presupuesto / regalo
  const budgetMatch = q.match(/(\d+[.,]?\d*)\s*(mil|k|000)?/);
  let budget = 0;
  if (budgetMatch) {
    budget = parseFloat(budgetMatch[1].replace(",", "."));
    if (budgetMatch[2] || q.includes("mil")) budget = budget * (budget < 1000 ? 1000 : 1);
  }

  // Buscar productos por palabras del mensaje
  const scored = catalog
    .map((p) => {
      const blob = normalize(`${p.nombre} ${p.categoria} ${p.resumen} ${p.variantes}`);
      let score = 0;
      const tokens = q.split(/\s+/).filter((t) => t.length > 3);
      tokens.forEach((t) => {
        if (blob.includes(t)) score += 2;
      });
      // boost por keywords típicas
      ["humidificador", "auricular", "parlante", "smartwatch", "reloj", "fitness", "belleza", "hogar", "audio"].forEach((k) => {
        if (q.includes(k) && blob.includes(k)) score += 5;
      });
      if (budget > 0 && p.precioNum > 0 && p.precioNum <= budget * 1.15) score += 3;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const isGeneral =
    q.includes("que tenes") ||
    q.includes("que tenés") ||
    q.includes("productos disponibles") ||
    q.includes("que venden") ||
    q.includes("que vendes") ||
    q.includes("catalogo") ||
    q.includes("categoría") ||
    q.includes("categoria") ||
    q.includes("que hay");

  const wantsRecommend =
    q.includes("recomenda") ||
    q.includes("regalo") ||
    q.includes("suger") ||
    q.includes("me conviene") ||
    budget > 0;

  const wantsPay =
    q.includes("pago") ||
    q.includes("cuota") ||
    q.includes("whatsapp") ||
    q.includes("comprar") ||
    q.includes("stock");

  // 1) Pregunta general → categorías + invitación
  if (isGeneral && scored.length === 0) {
    const cats = categories.slice(0, 6).join(", ");
    return `¡Hola! Con gusto te ayudo. En la tienda tenemos: ${cats || "tecnología, audio, humidificadores y más"}. Decime qué categoría te interesa y te muestro modelos con precio al toque.`;
  }

  // 2) Match de productos concretos
  if (scored.length > 0) {
    const top = scored.slice(0, 3).map((x) => x.p);
    const list = top.map((p) => `${p.nombre} (${p.precio}${p.stock === "Disponible" ? ", en stock" : ""})`).join("; ");
    if (wantsRecommend || budget > 0) {
      return `¡Dale! Según lo que contás, te recomiendo: ${list}. ¿Querés que te detalle alguno o te ayudo a cerrarlo por WhatsApp?`;
    }
    return `¡Buenísimo! Encontré esto para vos: ${list}. ¿Te muestro más detalles de alguno o preferís que te oriente para comprarlo?`;
  }

  // 3) Recomendación genérica con catálogo real
  if (wantsRecommend && catalog.length > 0) {
    const pick = [...catalog].sort((a, b) => a.precioNum - b.precioNum).slice(0, 3);
    const list = pick.map((p) => `${p.nombre} a ${p.precio}`).join("; ");
    return `¡Claro! Algunas opciones muy buenas de la tienda: ${list}. ¿Para qué lo estás buscando así te afino la recomendación?`;
  }

  // 4) Pago / cierre
  if (wantsPay && catalog.length > 0) {
    const sample = catalog.slice(0, 2).map((p) => p.nombre).join(" y ");
    return `Sí, tenemos stock en varios modelos (por ejemplo ${sample}). Si querés, te derivo por WhatsApp y te armo el pedido con el medio de pago que prefieras.`;
  }

  // 5) Fallback útil con datos reales (nunca genérico vacío)
  if (categories.length > 0) {
    return `Puedo ayudarte con todo el catálogo. Tenemos ${categories.slice(0, 5).join(", ")}. ¿Buscás algo puntual o preferís que te recomiende según presupuesto?`;
  }

  if (catalog.length > 0) {
    const sample = catalog.slice(0, 3).map((p) => `${p.nombre} (${p.precio})`).join(", ");
    return `¡Hola! Mirá, entre lo más consultado tenemos: ${sample}. ¿Cuál te gustaría ver o contame qué necesitás?`;
  }

  return "¡Hola! Estoy conectado a la tienda pero no veo productos publicados ahora. Si ya cargaste ítems en Tiendanube, asegurate de que estén en estado Publicado.";
}

async function askGemini(systemInstruction: string, message: string, history: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  let formattedHistory = "";
  if (Array.isArray(history)) {
    formattedHistory = history
      .map((h: any) => {
        const sender = h.role === "user" || h.sender === "user" ? "Cliente" : "Asesor";
        const text = h.content || h.text || "";
        return text ? `${sender}: ${text}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  const prompt = `${systemInstruction}

HISTORIAL:
${formattedHistory || "(inicio)"}

CLIENTE: ${message}

Respondé SOLO como el asesor, en 2 a 4 oraciones, cálido y concreto, usando el catálogo real.`;

  const models = [
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-pro"
  ];

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 320 }
          })
        }
      );

      if (!res.ok) continue;
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) return text.trim();
    } catch (e) {
      console.error("Gemini model fail:", model, e);
    }
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("store_id");
    const userId = searchParams.get("user_id");

    let query = supabase.from("vendedor_ia_settings").select("*");
    if (storeId) query = query.eq("store_id", String(storeId));
    else if (userId) query = query.eq("user_id", userId);

    const { data } = await query.maybeSingle();
    return NextResponse.json({ settings: data?.settings || data || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { action, store_id, user_id, message, history } = body;

    if (action === "save") {
      const {
        is_active,
        agent_name,
        welcome_message,
        agent_avatar,
        personality,
        whatsapp_number,
        enable_whatsapp_escalation,
        theme_color
      } = body;

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

      if (error) console.error("Error guardando settings:", error);
      return NextResponse.json({ success: true, data });
    }

    if (action === "chat") {
      let token = body.access_token as string | undefined;
      let sId = store_id ? String(store_id) : null;

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

      const catalog: CatalogItem[] = [];
      if (sId && token) {
        try {
          const tnRes = await fetch(
            `https://api.tiendanube.com/v1/${sId}/products?per_page=100&published=true`,
            {
              headers: {
                Authentication: `bearer ${token}`,
                "User-Agent": "Nevux (admin@nevux.ar)"
              }
            }
          );
          if (tnRes.ok) {
            const products = await tnRes.json();
            if (Array.isArray(products)) {
              products.forEach((p: any) => {
                const priceVal = Number(p.variants?.[0]?.price || 0);
                const cats =
                  p.categories
                    ?.map((c: any) => c.name?.es || c.name?.en)
                    .filter(Boolean)
                    .join(", ") || "General";
                const rawDesc = p.description?.es
                  ? String(p.description.es).replace(/<[^>]*>/g, "").slice(0, 180)
                  : "";
                catalog.push({
                  nombre: p.name?.es || p.name?.en || p.name?.pt || "Producto",
                  precio: priceVal ? `$${priceVal.toLocaleString("es-AR")}` : "Consultar",
                  precioNum: priceVal || 0,
                  categoria: cats,
                  stock:
                    p.variants?.reduce((a: number, v: any) => a + (v.stock || 0), 0) > 0
                      ? "Disponible"
                      : "Sin stock",
                  variantes:
                    p.variants
                      ?.map((v: any) => v.values?.map((val: any) => val.es).join(" / "))
                      .filter(Boolean)
                      .join(" | ") || "Único",
                  resumen: rawDesc
                });
              });
            }
          }
        } catch (e) {
          console.error("Tiendanube products error:", e);
        }
      }

      const systemInstruction = `
Sos el asesor comercial humano de la tienda. Conocés TODO el catálogo real.
Respondé libre, cálido y profesional a CUALQUIER pregunta (productos, precios, diferencias, regalos, stock, cuotas, envíos).
Usá SOLO datos reales del catálogo. Máximo 2 a 4 oraciones. Español argentino cercano.
Si hay intención de compra, ofrecé continuar por WhatsApp con naturalidad.

CATÁLOGO REAL:
${JSON.stringify(
  catalog.map((c) => ({
    nombre: c.nombre,
    precio: c.precio,
    categoria: c.categoria,
    stock: c.stock,
    variantes: c.variantes,
    resumen: c.resumen
  })),
  null,
  2
)}
`;

      const userMessage = (message || "").trim() || "Hola, ¿qué me recomendás?";

      // 1) Intentar Gemini (libre e inteligente)
      const geminiText = await askGemini(systemInstruction, userMessage, history || []);
      if (geminiText) {
        return NextResponse.json({ response: geminiText, reply: geminiText, engine: "gemini" });
      }

      // 2) Motor local profesional con catálogo real (si Gemini no está o falla)
      const local = smartLocalReply(userMessage, catalog);
      return NextResponse.json({ response: local, reply: local, engine: "local-catalog" });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error("virtual-salesman error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
           }
