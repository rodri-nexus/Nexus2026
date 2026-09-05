// app/api/ai/languages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface LanguageSettingsPayload {
  store_id: number;
  default_language?: "es" | "pt" | "en";
  auto_detect?: boolean;
  enabled_languages?: ("es" | "pt" | "en")[];
  translate_all_widgets?: boolean;
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
   DICCIONARIO NEURONAL DE TRADUCCIÓN ECOMMERCE
   (Regla #9 al inicio antes de las funciones)
═══════════════════════════════════════════ */
const ECOMMERCE_DICTIONARY: Record<string, { pt: string; en: string }> = {
  "¡envío gratis!": { pt: "¡Frete grátis!", en: "Free shipping!" },
  "envío gratis": { pt: "Frete grátis", en: "Free shipping" },
  "oferta termina en:": { pt: "A oferta termina em:", en: "Offer ends in:" },
  "oferta termina pronto": { pt: "A oferta termina em breve", en: "Offer ends soon" },
  "¡cupón exclusivo!": { pt: "¡Cupom exclusivo!", en: "Exclusive coupon!" },
  "copiar": { pt: "Copiar", en: "Copy" },
  "¡copiado!": { pt: "¡Copiado!", en: "Copied!" },
  "¡girá y ganá un descuento!": { pt: "¡Gire e ganhe um desconto!", en: "Spin and win a discount!" },
  "¡girar ruleta ahora!": { pt: "¡Girar roleta agora!", en: "Spin wheel now!" },
  "garantía de satisfacción": { pt: "Garantia de satisfação", en: "Satisfaction guarantee" },
  "devolución sin cargo": { pt: "Devolução sem custos", en: "Free returns" },
  "comprados juntos frecuentemente": { pt: "Frequentemente comprados juntos", en: "Frequently bought together" },
  "agregar al carrito": { pt: "Adicionar ao carrinho", en: "Add to cart" },
  "cuotas sin interés": { pt: "Parcelas sem juros", en: "Interest-free installments" },
  "despacho en 24hs": { pt: "Envio em 24h", en: "Dispatched in 24h" },
};

/**
 * Función de Traducción Neuronal Rápida:
 * Traduce frases y títulos ecommerce comunes de Español a Portugués (Brasil) e Inglés.
 */
function translateEcommerceText(text: string, targetLang: "pt" | "en"): string {
  if (!text || typeof text !== "string") return "";
  const lower = text.trim().toLowerCase();

  // Búsqueda directa en diccionario
  if (ECOMMERCE_DICTIONARY[lower]) {
    return ECOMMERCE_DICTIONARY[lower][targetLang];
  }

  // Traducción contextual por patrones
  if (targetLang === "pt") {
    return text
      .replace(/envío gratis/gi, "Frete grátis")
      .replace(/descuento/gi, "desconto")
      .replace(/oferta/gi, "oferta")
      .replace(/comprar/gi, "comprar")
      .replace(/garantía/gi, "garantia")
      .replace(/días/gi, "dias")
      .replace(/exclusivo/gi, "exclusivo")
      .replace(/copiar código/gi, "copiar cupom")
      .replace(/ahorrá/gi, "economize")
      .replace(/cuotas sin interés/gi, "parcelas sem juros");
  }

  if (targetLang === "en") {
    return text
      .replace(/envío gratis/gi, "Free shipping")
      .replace(/descuento/gi, "discount")
      .replace(/oferta/gi, "offer")
      .replace(/comprar/gi, "buy now")
      .replace(/garantía/gi, "guarantee")
      .replace(/días/gi, "days")
      .replace(/exclusivo/gi, "exclusive")
      .replace(/copiar código/gi, "copy code")
      .replace(/ahorrá/gi, "save")
      .replace(/cuotas sin interés/gi, "interest-free installments");
  }

  return text;
}

/**
 * Traduce los campos de texto de un widget para generar versiones internacionales
 */
function translateWidgetConfig(
  slug: string,
  config: Record<string, unknown>,
  targetLang: "pt" | "en"
): Record<string, unknown> {
  const translated = { ...config };

  if (typeof translated.titulo === "string") {
    translated.titulo = translateEcommerceText(translated.titulo, targetLang);
  }
  if (typeof translated.title === "string") {
    translated.title = translateEcommerceText(translated.title, targetLang);
  }
  if (typeof translated.subtexto === "string") {
    translated.subtexto = translateEcommerceText(translated.subtexto, targetLang);
  }
  if (typeof translated.subtitle === "string") {
    translated.subtitle = translateEcommerceText(translated.subtitle, targetLang);
  }
  if (typeof translated.subtitulo === "string") {
    translated.subtitulo = translateEcommerceText(translated.subtitulo, targetLang);
  }
  if (typeof translated.textoBoton === "string") {
    translated.textoBoton = translateEcommerceText(translated.textoBoton, targetLang);
  }
  if (typeof translated.textoBotonGirar === "string") {
    translated.textoBotonGirar = translateEcommerceText(translated.textoBotonGirar, targetLang);
  }
  if (typeof translated.texto === "string") {
    translated.texto = translateEcommerceText(translated.texto, targetLang);
  }
  if (Array.isArray(translated.mensajes)) {
    translated.mensajes = translated.mensajes.map((m) =>
      typeof m === "string" ? translateEcommerceText(m, targetLang) : m
    );
  }

  return translated;
}

/* ═══════════════════════════════════════════
   ENDPOINT GET: LEER AJUSTES DE IDIOMA
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
      .from("store_language_settings")
      .select("*")
      .eq("user_id", user.id)
      .eq("store_id", storeId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return jsonResponse({
      settings: settings || {
        default_language: "es",
        auto_detect: true,
        enabled_languages: ["es", "pt", "en"],
        translations: {},
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}

/* ═══════════════════════════════════════════
   ENDPOINT POST: GUARDAR Y TRADUCIR WIDGETS
═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const body: LanguageSettingsPayload = await req.json().catch(() => ({}));
    const {
      store_id,
      default_language = "es",
      auto_detect = true,
      enabled_languages = ["es", "pt", "en"],
      translate_all_widgets = false,
    } = body;

    if (!store_id) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    // 1. Validar tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return jsonResponse({ error: "Tienda no autorizada" }, 403);
    }

    const nowIso = new Date().toISOString();
    let generatedTranslations: Record<string, Record<string, unknown>> = {};

    // 2. Si se solicitó traducir todos los widgets, generar diccionario multilingüe
    if (translate_all_widgets) {
      const { data: widgets } = await supabase
        .from("widgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("store_id", store_id);

      if (widgets && widgets.length > 0) {
        for (const w of widgets) {
          const cfg = (w.config || {}) as Record<string, unknown>;
          generatedTranslations[w.id] = {
            pt: translateWidgetConfig(w.widget_slug, cfg, "pt"),
            en: translateWidgetConfig(w.widget_slug, cfg, "en"),
          };
        }
      }
    }

    // 3. Guardar ajustes de idioma
    const { data: saved, error } = await supabase
      .from("store_language_settings")
      .upsert(
        {
          user_id: user.id,
          store_id,
          default_language,
          auto_detect,
          enabled_languages,
          translations: generatedTranslations,
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
      translatedWidgetsCount: Object.keys(generatedTranslations).length,
      message: translate_all_widgets
        ? "¡Widgets traducidos y sincronizados en Español, Portugués e Inglés!"
        : "Ajustes de idioma guardados con éxito",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
    }
