// app/api/ai/virtual-salesman/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface VirtualSalesmanPayload {
  action?: "chat" | "save";
  store_id: number | string;
  message?: string;
  history?: Array<{ sender: "bot" | "user"; text: string }>;
  is_active?: boolean;
  agent_name?: string;
  welcome_message?: string;
  agent_avatar?: string;
  personality?: "friendly" | "expert" | "dynamic";
  whatsapp_number?: string;
  enable_whatsapp_escalation?: boolean;
  theme_color?: string;
}

interface ProductVariant {
  id: number;
  price: string | number;
  promotional_price: string | number | null;
  stock: number | null;
  values: Array<{ es?: string; en?: string; pt?: string }>;
}

interface TiendanubeProduct {
  id: number;
  name: { es?: string };
  variants: ProductVariant[];
  published: boolean;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/* ═══════════════════════════════════════════
   ENDPOINT GET: CONSULTAR AJUSTES DEL VENDEDOR
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id") || searchParams.get("storeId");

    if (!storeIdParam) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    const storeId = parseInt(storeIdParam, 10);

    const { data: settings, error } = await supabase
      .from("store_virtual_salesman_settings")
      .select("*")
      .eq("user_id", user.id)
      .eq("store_id", storeId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return jsonResponse({
      settings: settings || {
        is_active: true,
        agent_name: "Sofía (Asesora Virtual)",
        welcome_message: "¡Hola! 👋 ¿Buscás algo en especial hoy? Contame y te ayudo a encontrar el producto ideal.",
        agent_avatar: "👩‍💼",
        personality: "friendly",
        whatsapp_number: "",
        enable_whatsapp_escalation: true,
        theme_color: "#10B981",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}

/* ═══════════════════════════════════════════
   ENDPOINT POST: GUARDAR AJUSTES O EJECUTAR CHAT IA
═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const body: VirtualSalesmanPayload = await req.json().catch(() => ({}));
    const { store_id } = body;

    if (!store_id) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    const cleanStoreId = String(store_id).trim();

    // ───────────────────────────────────────────
    // MODO 1: PROCESAR MENSAJE DE CHAT IA (SI TIENE MESSAGE O ACTION === 'CHAT')
    // ───────────────────────────────────────────
    if (body.action === "chat" || typeof body.message === "string") {
      const userMessage = (body.message || "").trim();
      if (!userMessage) {
        return jsonResponse({ error: "Mensaje vacío" }, 400);
      }

      // 1. Consultar la tienda y su token
      const { data: store } = await supabaseAdmin
        .from("stores")
        .select("store_id, name, access_token")
        .eq("store_id", cleanStoreId)
        .eq("is_active", true)
        .maybeSingle();

      if (!store) {
        return jsonResponse({ error: "Tienda no encontrada" }, 404);
      }

      // 2. Obtener ajustes del Asesor Virtual
      const { data: settings } = await supabaseAdmin
        .from("store_virtual_salesman_settings")
        .select("*")
        .eq("store_id", Number(cleanStoreId))
        .maybeSingle();

      const agentName = settings?.agent_name || "Sofía (Asesora Virtual)";
      const whatsappNum = settings?.whatsapp_number || "";
      const escalationEnabled = settings?.enable_whatsapp_escalation ?? true;

      // 3. Consultar productos del catálogo de Tiendanube
      let catalogContext = "No hay productos disponibles actualmente en el catálogo.";

      if (store.access_token) {
        try {
          const tnRes = await fetch(
            `https://api.tiendanube.com/v1/${cleanStoreId}/products?published=true&per_page=40`,
            {
              headers: {
                Authentication: `bearer ${store.access_token}`,
                "User-Agent": "Nevux (soportenevux@gmail.com)",
              },
            }
          );

          if (tnRes.ok) {
            const products: TiendanubeProduct[] = await tnRes.json();
            if (Array.isArray(products) && products.length > 0) {
              const parsedProds = products.map((p) => {
                const pName = p.name?.es || "Producto";
                const varDetails = (p.variants || []).map((v) => {
                  const price = v.promotional_price || v.price;
                  const attrValues = (v.values || [])
                    .map((val) => val.es || "")
                    .filter(Boolean)
                    .join("/");
                  const stockText =
                    v.stock === null
                      ? "Disponible"
                      : v.stock > 0
                      ? `Stock: ${v.stock} unidades`
                      : "Agotado";
                  return `[Variante: ${attrValues || "Única"} | Precio: $${price} | ${stockText}]`;
                });
                return `- ${pName}: ${varDetails.join(", ")}`;
              });

              catalogContext = parsedProds.join("\n");
            }
          }
        } catch (err) {
          console.error("[Virtual Salesman Product Fetch Exception]:", err);
        }
      }

      // 4. System Prompt: Asesor Concierge Humano
      const systemPrompt = `
Sos ${agentName}, la asesora y concierge oficial de ventas de la tienda "${store.name || "nuestra tienda"}".
Tu objetivo es atender a los clientes con calidez humana, amabilidad y empatía, ayudándolos a encontrar el producto ideal o resolviendo sus dudas de forma impecable.

REGLAS DE ORO INAMOVIBLES:
1. **TONO Y ESTILO 100% HUMANO:** Hablá como una persona real atendiendo su negocio a las 3 de la mañana: amable, atenta y respetuosa. NUNCA hables como robot ni uses respuestas estándar o frías.
2. **BREVEDAD Y CONCISIÓN:** NUNCA escribas testamentos ni párrafos gigantes. Respondé en 2 a 4 oraciones cortas, fluidas y muy agradables de leer en la pantalla de un celular.
3. **ROL DE ASESOR Y GUÍA (CERO AGRESIVIDAD COMERCIAL):** Tu trabajo es GUIAR y AYUDAR al cliente, no atosigarlo para venderle. Si pregunta por zapatillas negras en talle 42, decíle exactamente si las tenés disponibles en el catálogo y cuál es su precio.
4. **DATOS PRECISOS DEL CATÁLOGO:** Basate SÓLO en la información real de productos que te comparto abajo. Si una variante está agotada o no existe, decílo con calidez y sugerí una alternativa real disponible.
5. **ESCALADO A WHATSAPP:** Si el cliente pide hablar con un humano o consulta algo muy complejo, invítalo amablemente a continuar por WhatsApp.

CATÁLOGO REAL EN VIVO DE LA TIENDA:
${catalogContext}

CONTACTO DIRECTO:
- WhatsApp Oficial: ${whatsappNum ? whatsappNum : "Disponible en la tienda"}
`;

      let aiReply = `¡Hola! Con gusto te ayudo. Contame qué producto estás buscando o qué talle/color necesitás y te confirmo al instante las opciones disponibles.`;
      let shouldOfferWhatsapp = false;

      const geminiKey = process.env.GEMINI_API_KEY;

      if (geminiKey) {
        try {
          const contents = [
            { role: "user", parts: [{ text: systemPrompt }] },
            {
              role: "model",
              parts: [
                {
                  text: `Entendido. Soy ${agentName}. Atenderé con empatía humana, brevedad (2-4 oraciones) y máxima precisión basada en el catálogo real.`,
                },
              ],
            },
          ];

          if (Array.isArray(body.history)) {
            body.history.slice(-4).forEach((h) => {
              contents.push({
                role: h.sender === "user" ? "user" : "model",
                parts: [{ text: h.text }],
              });
            });
          }

          contents.push({ role: "user", parts: [{ text: userMessage }] });

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const candidateText =
              geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              aiReply = candidateText.trim();
            }
          }
        } catch (aiErr) {
          console.error("[Gemini AI Exception]:", aiErr);
        }
      }

      const lowerMessage = userMessage.toLowerCase();
      const lowerReply = aiReply.toLowerCase();
      if (
        escalationEnabled &&
        whatsappNum &&
        (lowerMessage.includes("whatsapp") ||
          lowerMessage.includes("humano") ||
          lowerMessage.includes("hablar") ||
          lowerReply.includes("whatsapp"))
      ) {
        shouldOfferWhatsapp = true;
      }

      return jsonResponse({
        reply: aiReply,
        showWhatsappBtn: shouldOfferWhatsapp,
        agentName,
      });
    }

    // ───────────────────────────────────────────
    // MODO 2: GUARDAR CONFIGURACIÓN DEL VENDEDOR
    // ───────────────────────────────────────────
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const {
      is_active = true,
      agent_name = "Sofía (Asesora Virtual)",
      welcome_message = "¡Hola! 👋 ¿Buscás algo en especial hoy? Contame y te ayudo a encontrar el producto ideal.",
      agent_avatar = "👩‍💼",
      personality = "friendly",
      whatsapp_number = "",
      enable_whatsapp_escalation = true,
      theme_color = "#10B981",
    } = body;

    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", Number(cleanStoreId))
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return jsonResponse({ error: "Tienda no autorizada" }, 403);
    }

    const nowIso = new Date().toISOString();

    const { data: saved, error } = await supabase
      .from("store_virtual_salesman_settings")
      .upsert(
        {
          user_id: user.id,
          store_id: Number(cleanStoreId),
          is_active,
          agent_name,
          welcome_message,
          agent_avatar,
          personality,
          whatsapp_number,
          enable_whatsapp_escalation,
          theme_color,
          updated_at: nowIso,
        },
        { onConflict: "store_id" }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return jsonResponse({
      success: true,
      settings: saved,
      message: "Vendedor Virtual IA actualizado con éxito",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
       }
