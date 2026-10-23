// app/api/ai/virtual-salesman/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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

// Catálogo realista de respaldo si la tienda aún no tiene productos publicados en Tiendanube
const DEMO_CATALOG: CatalogItem[] = [
  {
    nombre: "Zapatillas Deportivas Nevux Pro",
    precio: "$28.500",
    precioNum: 28500,
    categoria: "Calzado",
    stock: "12 unidades en stock",
    variantes: "Talles 38, 39, 40, 41, 42",
    resumen:
      "Zapatillas de running ultralivianas con suela amortiguada, ideales para deporte o uso diario.",
  },
  {
    nombre: "Mochila Urbana Impermeable Portanotebook",
    precio: "$27.500",
    precioNum: 27500,
    categoria: "Accesorios",
    stock: "8 unidades en stock",
    variantes: "Negro, Gris Topo",
    resumen:
      "Mochila con compartimento acolchado para laptop de 15.6 pulgadas, material impermeable de alta resistencia.",
  },
  {
    nombre: "Remera Oversize Algodón Premium 100%",
    precio: "$14.900",
    precioNum: 14900,
    categoria: "Indumentaria",
    stock: "25 unidades en stock",
    variantes: "Negro, Blanco, Beige (S, M, L, XL)",
    resumen:
      "Remera de corte holgado estilo urbano en algodón peinado de máxima calidad.",
  },
  {
    nombre: "Buzo Hoodie Canguro Frizado",
    precio: "$29.900",
    precioNum: 29900,
    categoria: "Indumentaria",
    stock: "10 unidades en stock",
    variantes: "Negro, Gris Melange (M, L, XL)",
    resumen:
      "Buzo con capucha y bolsillo frontal, abrigo de algodón frizado grueso.",
  },
  {
    nombre: "Pantalón Jogger Cargo Urbano",
    precio: "$24.000",
    precioNum: 24000,
    categoria: "Indumentaria",
    stock: "15 unidades en stock",
    variantes: "Talles 38 al 46 (Negro, Verde Militar)",
    resumen: "Jogger elastizado con bolsillos laterales estilo cargo.",
  },
  {
    nombre: "Auriculares Inalámbricos Bluetooth Pro",
    precio: "$34.900",
    precioNum: 34900,
    categoria: "Tecnología",
    stock: "6 unidades en stock",
    variantes: "Negro Mate, Blanco",
    resumen:
      "Auriculares TWS con cancelación activa de ruido y 24hs de batería.",
  },
];

function normalize(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function smartLocalReply(
  message: string,
  catalog: CatalogItem[],
  history: any[]
): { text: string; showWhatsappBtn: boolean } {
  const q = normalize(message);
  const effectiveCatalog = catalog.length > 0 ? catalog : DEMO_CATALOG;

  // Analizar último mensaje del bot para dar continuidad
  let lastBotMsg = "";
  if (history && history.length > 0) {
    const lastItem = history
      .filter(
        (h: any) =>
          h.role === "assistant" || h.sender === "bot" || h.role === "model"
      )
      .pop();
    if (lastItem)
      lastBotMsg = normalize(lastItem.content || lastItem.text || "");
  }

  const isAffirmative =
    /^(si|sí|dale|ok|oka|bueno|genial|joya|me parece|perfecto|obvio|de una|claro|por supuesto)/.test(
      q
    );
  const isLocationMention =
    /(buenos aires|caba|palermo|belgrano|caballito|recoleta|cordoba|rosario|santa fe|mendoza|tucuman|neuquen|salta|barrio|provincia|interior|zona|capital)/.test(
      q
    );

  // 1. DETECCIÓN DIRECTA DE CIERRE POR WHATSAPP O COMPAÑERO
  const wantsWhatsapp =
    /(whatsapp|wa|wpp|coordinar|pasamos a coordinar|pasar a whatsapp|hablar por whatsapp|comprar por whatsapp|dame el whatsapp|contacto|hablar con un humano|compañero|vendedor|asesor)/.test(
      q
    );

  if (wantsWhatsapp || (lastBotMsg.includes("whatsapp") && isAffirmative)) {
    return {
      text: "Te comunico directo con uno de nuestros compañeros en el local. Hacé clic en el botón verde de abajo para abrir nuestro WhatsApp oficial y coordinar el pago y envío de tu pedido.",
      showWhatsappBtn: true,
    };
  }

  // 2. DETECCIÓN DE PRESUPUESTO O BÚSQUEDA DE REGALOS (Ej: "menos de $30.000", "regalo")
  const budgetMatch = q.match(/(\d+[\d\.]*)/);
  const isGiftOrBudgetQuery =
    /(regalo|presupuesto|menos de|hasta|barato|economico|opciones|recomendas|recomendame|sugerencia)/.test(
      q
    );

  if (isGiftOrBudgetQuery || budgetMatch) {
    let maxPrice = 30000;
    if (budgetMatch) {
      const rawNum = parseInt(budgetMatch[1].replace(/\./g, ""), 10);
      if (!isNaN(rawNum) && rawNum > 1000) {
        maxPrice = rawNum;
      }
    }

    const filtered = effectiveCatalog.filter(
      (p) => p.precioNum > 0 && p.precioNum <= maxPrice
    );

    if (filtered.length > 0) {
      const selected = filtered.slice(0, 2);
      const itemsList = selected
        .map((p) => `• ${p.nombre} a ${p.precio} (${p.stock})`)
        .join("\n");

      return {
        text: `¡Qué hacés! Mirá, por menos de $${maxPrice.toLocaleString(
          "es-AR"
        )} te recomiendo estas opciones geniales que van joya:\n${itemsList}\n¿Te gustaría ver algún detalle más o querés que te pongamos en contacto con un compañero para coordinar el pedido?`,
        showWhatsappBtn: false,
      };
    }
  }

  // 3. Memoria de conversación por zona/envío
  if (lastBotMsg.includes("donde sos") && (isLocationMention || q.length > 2)) {
    return {
      text: "¡Genial! A esa zona llegamos en el día con motomensajería o por Correo Argentino a todo el país. ¿Querés que pasemos a coordinar el envío con uno de nuestros compañeros por WhatsApp?",
      showWhatsappBtn: true,
    };
  }

  // 4. Diccionario de intenciones frecuentes
  const wantsShipping =
    /(envio|envíos|mandan|llega|domicilio|correo|andreani|oca|moto|cadete|despacho|flete|costo|cuanto sale|gratis|llegar)/.test(
      q
    ) || isLocationMention;
  const wantsPay =
    /(tarjeta|pago|cuota|credito|debito|transferencia|efectivo|mercadopago|mercado pago|mp|descuento)/.test(
      q
    );
  const wantsLocation =
    /(donde estan|ubicacion|local|tienda fisica|direccion|calle|showroom|retirar|retiro)/.test(
      q
    );
  const wantsBestSellers =
    /(mas vendido|más vendido|top|mejores|recomendaciones|destacados|sugerencia|mas vendidos|catalogo)/.test(
      q
    );
  const wantsGreeting =
    /^(hola|buenas|buen dia|buen día|buenas tardes|que tal)/.test(q) &&
    q.length < 20;

  if (wantsGreeting) {
    return {
      text: "¡Hola! Qué bueno tenerte en la tienda. ¿Buscás algún producto en particular o querés que te recomiende lo más vendido del catálogo?",
      showWhatsappBtn: false,
    };
  }

  if (wantsBestSellers) {
    const top = effectiveCatalog
      .slice(0, 3)
      .map((p) => `${p.nombre} (${p.precio})`)
      .join(", ");
    return {
      text: `¡De una! Entre lo más pedido de la tienda tenemos: ${top}. ¿Te interesa conocer más detalles de alguno de estos productos o querés coordinar con un compañero por WhatsApp?`,
      showWhatsappBtn: false,
    };
  }

  if (wantsShipping) {
    return {
      text: "Hacemos envíos rápidos por Correo Argentino a todo el país y Moto en el día. Si tu compra supera los $35.000 el envío te queda GRATIS. ¿De qué zona sos?",
      showWhatsappBtn: false,
    };
  }

  if (wantsPay) {
    return {
      text: "Aceptamos todas las tarjetas con cuotas sin interés y tenés un 10% DE DESCUENTO especial pagando por transferencia bancaria directa o efectivo. ¿Qué medio preferís?",
      showWhatsappBtn: false,
    };
  }

  if (wantsLocation) {
    return {
      text: "Somos una tienda online con despacho directo y envíos a todo el país. Para retirar en persona o atención directa en local, podés escribirle a nuestros compañeros por WhatsApp.",
      showWhatsappBtn: true,
    };
  }

  // 5. Búsqueda directa en productos del catálogo
  const scored = effectiveCatalog
    .map((p) => {
      const blob = normalize(`${p.nombre} ${p.categoria} ${p.resumen}`);
      let score = 0;
      q.split(/\s+/).forEach((t) => {
        if (t.length > 2 && blob.includes(t)) score += 2;
      });
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const top = scored
      .slice(0, 2)
      .map((x) => `${x.p.nombre} a ${x.p.precio} (${x.p.stock})`)
      .join(" y ");
    return {
      text: `¡Sí! Encontré esto disponible en la tienda: ${top}. ¿Te gustaría conocer más detalles o coordinar el pago con un compañero del equipo?`,
      showWhatsappBtn: false,
    };
  }

  // 6. Resguardo dinámico con productos reales
  const sample = effectiveCatalog
    .slice(0, 3)
    .map((p) => `${p.nombre} (${p.precio})`)
    .join(", ");
  return {
    text: `Te puedo asesorar con cualquiera de nuestros productos disponibles, como: ${sample}. ¿Sobre cuál te gustaría consultar o qué presupuesto tenés pensado?`,
    showWhatsappBtn: false,
  };
}

async function askGemini(
  systemInstruction: string,
  message: string,
  history: any[]
) {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  let formattedHistory = "";
  if (Array.isArray(history)) {
    formattedHistory = history
      .map((h: any) => {
        const sender =
          h.role === "user" || h.sender === "user" ? "Cliente" : "Asesor";
        const text = h.content || h.text || "";
        return text ? `${sender}: ${text}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  const prompt = `${systemInstruction}\n\nHISTORIAL DE CHAT:\n${formattedHistory}\n\nPREGUNTA ACTUAL DEL CLIENTE: "${message}"\n\nRESPUESTA DEL ASESOR (Máximo 3 oraciones, muy humano, argentino, amable, exacto con precios y productos):`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 250 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    if (text) {
      text = text.replace(/\*\*/g, "");
    }
    return text;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { action, store_id, user_id, message, history, config } = body;

    // Acción: Guardar configuración
    if (action === "save") {
      const { settings } = body;
      const { data, error } = await supabase
        .from("vendedor_ia_settings")
        .upsert({
          store_id: store_id ? String(store_id) : undefined,
          user_id: user_id || undefined,
          settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      return NextResponse.json({ success: true, data });
    }

    // Acción: Chat conversacional inteligente
    if (action === "chat" || message) {
      let token = body.access_token as string | undefined;
      let sId = store_id ? String(store_id) : null;

      // 1. Búsqueda directa del Token de Tiendanube en la tabla `stores` principal
      if (!token) {
        if (sId) {
          const { data } = await supabase
            .from("stores")
            .select("store_id, access_token")
            .eq("store_id", Number(sId))
            .maybeSingle();
          if (data?.access_token) token = data.access_token;
        }

        if (!token && user_id) {
          const { data } = await supabase
            .from("stores")
            .select("store_id, access_token")
            .eq("user_id", user_id)
            .maybeSingle();
          if (data?.access_token) {
            sId = String(data.store_id);
            token = data.access_token;
          }
        }

        if (!token) {
          const { data } = await supabase
            .from("stores")
            .select("store_id, access_token")
            .not("access_token", "is", null)
            .limit(1)
            .maybeSingle();
          if (data?.access_token) {
            sId = String(data.store_id);
            token = data.access_token;
          }
        }
      }

      // 2. Cargar Catálogo Real de Productos desde Tiendanube API
      const catalog: CatalogItem[] = [];
      if (sId && token) {
        try {
          const tnRes = await fetch(
            `https://api.tiendanube.com/v1/${sId}/products?per_page=100&published=true`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Authentication": `bearer ${token}`,
                "User-Agent": "NevuxAI (nevux.app)",
              },
            }
          );

          if (tnRes.ok) {
            const products = await tnRes.json();
            if (Array.isArray(products)) {
              products.forEach((p: any) => {
                const nameStr =
                  typeof p.name === "string"
                    ? p.name
                    : p.name?.es || Object.values(p.name || {})[0] || "Producto";
                const price = Number(
                  p.variants?.[0]?.promotional_price || p.variants?.[0]?.price || 0
                );
                const stockQty = p.variants?.[0]?.stock;
                const stockText =
                  stockQty !== null && stockQty !== undefined
                    ? `${stockQty} unidades en stock`
                    : "Disponible";

                catalog.push({
                  nombre: nameStr,
                  precio: price > 0 ? `$${price.toLocaleString("es-AR")}` : "Consultar",
                  precioNum: price,
                  categoria:
                    p.categories?.map((c: any) => c.name?.es || c.name).filter(Boolean).join(", ") || "General",
                  stock: stockText,
                  variantes:
                    p.variants
                      ?.map((v: any) =>
                        v.values?.map((val: any) => val.es || val).join(" / ")
                      )
                      .filter(Boolean)
                      .join(", ") || "",
                  resumen:
                    (p.description?.es || typeof p.description === "string" ? p.description : "")
                      .replace(/<[^>]*>/g, "")
                      .slice(0, 150) || "",
                });
              });
            }
          }
        } catch (e) {
          console.error("Error cargando productos reales de Tiendanube:", e);
        }
      }

      const effectiveCatalog = catalog.length > 0 ? catalog : DEMO_CATALOG;
      const userMsg = message || "";
      const isWhatsappQuery =
        /(whatsapp|wa|wpp|coordinar|pasamos a coordinar|pasar a whatsapp|hablar por whatsapp|comprar por whatsapp|dame el whatsapp|compañero)/i.test(
          userMsg
        );

      if (isWhatsappQuery) {
        const closureText =
          "Te comunico directo con uno de nuestros compañeros en el local. Hacé clic en el botón verde de abajo para abrir nuestro WhatsApp oficial y coordinar el pago y envío de tu pedido al instante.";
        return NextResponse.json({
          response: closureText,
          reply: closureText,
          showWhatsappBtn: true,
        });
      }

      // Configuración de la tienda
      const agentName = config?.agent_name || "Sofía (Asesora Virtual)";
      const transferKeyword = (config?.transfer_keyword || "COMPAÑERO").toUpperCase();
      const businessRules =
        config?.business_rules ||
        "Aceptamos transferencia con 10% de descuento. Envíos a todo el país por Correo Argentino. Cuotas sin interés disponibles.";

      const systemInstruction = `
Sos ${agentName}, el Asesor Virtual y Vendedor Humano de esta tienda online.

TU PERSONALIDAD:
- Tono "CEO Argentino": 100% humano, súper fluido, cálido, profesional, directo y amable (usá expresiones naturales argentinas como "¡Hola!", "De una", "Te cuento", "Mirá", "Joya").
- NUNCA uses frases acartonadas o de bot robótico como "Estimado cliente", "Entendido perfecto", ni respuestas estáticas de plantilla.

CATÁLOGO REAL DE PRODUCTOS Y PRECIOS DE LA TIENDA:
${JSON.stringify(effectiveCatalog, null, 2)}

REGLAS DE NEGOCIO, MEDIOS DE PAGO Y ENVÍOS:
- Medios de pago: Aceptamos todas las tarjetas con cuotas sin interés y tenés un 10% DE DESCUENTO por transferencia bancaria directa o efectivo.
- Envíos: Hacemos envíos rápidos a todo el país por Correo Argentino y Moto en el día. Envío GRATIS en compras superiores a $35.000.
- Atención personal / negociaciones: Si el cliente escribe la palabra clave "${transferKeyword}", o pide un descuento especial, o negociar precio, o hablar con una persona, decile amablemente que lo comunicás con un compañero e invítalo a dar clic al botón de WhatsApp.
- Reglas adicionales de la tienda: ${businessRules}

INSTRUCCIONES DE RESPUESTA:
1. Si el cliente busca recomendaciones por precio, talle, categoría o regalo (ej: "regalo de menos de $30.000"), buscá en el catálogo los productos exactos que cumplan con la condición, decile su nombre, precio exacto ($) y si hay stock.
2. Mantené las respuestas cortas (máximo 2 a 3 oraciones), súper amables y orientadas a ayudarlo a elegir y comprar.
`;

      const geminiText = await askGemini(systemInstruction, userMsg, history || []);
      if (geminiText) {
        return NextResponse.json({
          response: geminiText,
          reply: geminiText,
          showWhatsappBtn:
            isWhatsappQuery ||
            geminiText.toLowerCase().includes("whatsapp") ||
            geminiText.toLowerCase().includes("compañero"),
        });
      }

      // Fallback local súper entrenado
      const local = smartLocalReply(userMsg, effectiveCatalog, history || []);
      return NextResponse.json({
        response: local.text,
        reply: local.text,
        showWhatsappBtn: local.showWhatsappBtn,
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({
      response:
        "¡Hola! Te puedo ayudar con información sobre productos, envíos a todo el país o medios de pago. ¿En qué te puedo asesorar hoy?",
      reply:
        "¡Hola! Te puedo ayudar con información sobre productos, envíos a todo el país o medios de pago. ¿En qué te puedo asesorar hoy?",
      showWhatsappBtn: false,
    });
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
