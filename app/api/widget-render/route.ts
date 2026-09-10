// app/api/widget-render/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isStorePlanActive } from '@/lib/plan'
import { getCampaignPreset } from '@/lib/campaignPresets'
import { getProducts } from "@/lib/tiendanube"

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ═══════════════════════════════════════════
   DICCIONARIO NEURONAL ECOMMERCE (Regla #9 al inicio)
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

function translateEcommerceText(text: string, targetLang: "pt" | "en"): string {
  if (!text || typeof text !== "string") return "";
  const lower = text.trim().toLowerCase();

  if (ECOMMERCE_DICTIONARY[lower]) {
    return ECOMMERCE_DICTIONARY[lower][targetLang];
  }

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
   FUNCIONES AUXILIARES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
}

function defaultStats() {
  return {
    total: 0,
    promedio: 0,
    distribucion: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
  }
}

function calcularStats(reviews: any[]) {
  const total = reviews.length
  if (total === 0) return defaultStats()

  const distribucion: Record<string, number> = {
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
  }

  let suma = 0
  for (const r of reviews) {
    suma += r.estrellas || 0
    const key = String(r.estrellas)
    if (distribucion[key] !== undefined) {
      distribucion[key]++
    }
  }

  const promedio = parseFloat((suma / total).toFixed(2))
  return { total, promedio, distribucion }
}

function parseProductName(raw: any): string {
  if (!raw) return "Producto Complementario";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null) {
    return String(raw.es || raw.pt || Object.values(raw)[0] || "Producto Complementario");
  }
  return "Producto Complementario";
}

function parseProductPrice(price: any): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function extractProductPrice(p: any): number {
  if (p.price) return parseProductPrice(p.price);
  if (p.promotional_price) return parseProductPrice(p.promotional_price);
  if (Array.isArray(p.variants) && p.variants.length > 0) {
    const v = p.variants[0];
    if (typeof v === "object" && v !== null) {
      const vPrice = v.promotional_price || v.price;
      if (vPrice) return parseProductPrice(vPrice);
    }
  }
  return 0;
}

function getProductImageUrl(p: any): string {
  if (typeof p.image_url === "string") return p.image_url;
  if (Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first !== null && "src" in first) {
      return String(first.src || "");
    }
  }
  return "";
}

function getProductVariantId(p: any): string {
  if (Array.isArray(p.variants) && p.variants.length > 0) {
    return String(p.variants[0].id || "");
  }
  return "";
}

function computeAiPairings(
  products: any[],
  mainProductId: number,
  discountPercentage: number
): any[] {
  if (!Array.isArray(products) || products.length < 2) return [];

  const parsed = products.map((p) => ({
    id: Number(p.id) || 0,
    name: parseProductName(p.name),
    price: extractProductPrice(p),
    image: getProductImageUrl(p),
    variantId: getProductVariantId(p),
  })).filter((p) => p.id > 0 && p.price > 0 && p.variantId !== "");

  if (parsed.length < 2) return [];

  const mainProduct = parsed.find(p => p.id === mainProductId);
  if (!mainProduct) {
    return parsed.slice(0, 2).map(p => ({
      titulo: p.name,
      precio: p.price,
      imagenUrl: p.image,
      variantId: p.variantId,
      incluidoPorDefecto: true
    }));
  }

  const candidates = parsed.filter(p => p.id !== mainProductId);
  const scoredCandidates = candidates.map(candidate => {
    let score = 50;
    const ratio = candidate.price / mainProduct.price;
    if (ratio >= 0.15 && ratio <= 0.65) {
      score += 35;
    } else if (ratio < 1.0) {
      score += 15;
    }
    const mainWords = mainProduct.name.toLowerCase().split(/\s+/);
    const candWords = candidate.name.toLowerCase().split(/\s+/);
    const sharesKeywords = mainWords.some(w => w.length > 3 && candWords.includes(w));
    if (sharesKeywords) {
      score += 20;
    }
    return { candidate, score };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);

  return scoredCandidates.slice(0, 2).map(item => ({
    titulo: item.candidate.name,
    precio: item.candidate.price,
    imagenUrl: item.candidate.image,
    variantId: item.candidate.variantId,
    incluidoPorDefecto: true
  }));
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/* ═══════════════════════════════════════════
   ENDPOINT PRINCIPAL GET (ALTA VELOCIDAD Y BLINDADO)
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeIdParam = searchParams.get('store_id')
    const productIdParam = searchParams.get('product_id')
    const clientLangParam = searchParams.get('lang')

    if (!storeIdParam) {
      return NextResponse.json(
        { error: 'store_id es requerido', widgets: [], activeCampaign: null, voiceSearch: null, virtualSalesman: null },
        { status: 400, headers: corsHeaders }
      )
    }

    const storeId = parseInt(storeIdParam, 10)
    const productId = productIdParam ? parseInt(productIdParam, 10) : null
    const safeStoreIdStr = String(storeIdParam).trim()

    // 🔒 Verificación de plan activo
    const isActivePlan = await isStorePlanActive(storeId)
    if (!isActivePlan) {
      return NextResponse.json(
        { widgets: [], activeCampaign: null, voiceSearch: null, virtualSalesman: null, message: 'El plan o la prueba gratuita de 7 días ha expirado.' },
        { status: 200, headers: corsHeaders }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 🚀 CONSULTAS EN PARALELO ULTRA-OPTIMIZADAS Y BLINDADAS POR TIPO
    const [voiceRes, salesmanRes, campaignRes, widgetsRes, langRes] = await Promise.all([
      // 🎙️ Búsqueda por Voz
      supabase
        .from('store_voice_search_settings')
        .select('is_active, position, button_color, listening_text, placeholder_text, language')
        .eq('store_id', safeStoreIdStr)
        .limit(1),

      // 🤖 Vendedor Virtual IA
      supabase
        .from('store_virtual_salesman_settings')
        .select('is_active, agent_name, welcome_message, agent_avatar, personality, whatsapp_number, enable_whatsapp_escalation, theme_color')
        .eq('store_id', safeStoreIdStr)
        .limit(1),

      // 🎃 Campaña activa (búsqueda por string compatible)
      supabase
        .from('active_campaigns')
        .select('campaign_slug')
        .eq('store_id', safeStoreIdStr)
        .limit(1),

      // 📦 Widgets activos indexados directos (incluye activos e implícitos)
      supabase
        .from('widgets')
        .select('id, widget_slug, widget_type, target_type, target_product_id, config, is_active, updated_at')
        .eq('store_id', safeStoreIdStr)
        .neq('is_active', false),

      // 🌎 Configuración de idioma
      supabase
        .from("store_language_settings")
        .select("*")
        .eq('store_id', safeStoreIdStr)
        .limit(1)
    ]);

    // Parsear Búsqueda por Voz
    const voiceSearchData = voiceRes.data?.[0] || {
      is_active: false,
      position: "bottom-right",
      button_color: "#10B981",
      listening_text: "Escuchando... Decí lo que buscás",
      placeholder_text: "Buscá por voz en la tienda...",
      language: "es-AR",
    }

    // Parsear Vendedor Virtual IA
    const virtualSalesmanData = salesmanRes.data?.[0] || {
      is_active: false,
      agent_name: "Sofía (Asesora Virtual)",
      welcome_message: "¡Hola! 👋 ¿Buscás algo en especial hoy? Contame y te ayudo a encontrar el producto ideal.",
      agent_avatar: "👩‍💼",
      personality: "friendly",
      whatsapp_number: "",
      enable_whatsapp_escalation: true,
      theme_color: "#10B981",
    }

    // Parsear Campaña Activa
    let activeCampaignData: {
      slug: string
      name: string
      effect: string
      themeColor: string
      accentColor: string
    } | null = null

    const activeCampaignSlug = campaignRes.data?.[0]?.campaign_slug
    if (activeCampaignSlug) {
      const preset = getCampaignPreset(activeCampaignSlug)
      if (preset) {
        activeCampaignData = {
          slug: preset.slug,
          name: preset.name,
          effect: preset.effect,
          themeColor: preset.themeColor,
          accentColor: preset.accentColor,
        }
      }
    }

    // Parsear Widgets
    let rawWidgets = widgetsRes.data || []

    // Si por alguna razón la tienda tenía store_id como numérico en widgets, intentamos fallback rápido
    if (rawWidgets.length === 0 && !isNaN(storeId)) {
      const { data: fallbackWidgets } = await supabase
        .from('widgets')
        .select('id, widget_slug, widget_type, target_type, target_product_id, config, is_active, updated_at')
        .eq('store_id', storeId)
        .neq('is_active', false);
      if (fallbackWidgets && fallbackWidgets.length > 0) {
        rawWidgets = fallbackWidgets;
      }
    }

    // Filtrar por producto / general en memoria
    const matchingWidgets = rawWidgets.filter((w) => {
      if (!w.target_type || w.target_type === 'all') return true
      if (productId && w.target_type === 'product') {
        return Number(w.target_product_id) === productId
      }
      return true
    })

    // Deduplicación por slug en memoria
    const uniqueMap = new Map<string, any>()
    for (const w of matchingWidgets) {
      if (!uniqueMap.has(w.widget_slug)) {
        uniqueMap.set(w.widget_slug, w)
      }
    }
    const widgets = Array.from(uniqueMap.values())

    // Enriquecer con definiciones
    const slugs = widgets.map((w) => w.widget_slug)
    let definitions: any[] = []

    if (slugs.length > 0) {
      const { data: defs } = await supabase
        .from('widget_definitions')
        .select('*')
        .in('slug', slugs)

      definitions = defs || []
    }

    let enrichedWidgets = widgets.map((w) => ({
      ...w,
      definition: definitions.find((d) => d.slug === w.widget_slug) || null,
    }))

    // Cross-Selling IA predictivo
    const packWidgetIndex = enrichedWidgets.findIndex(w => w.widget_slug === 'pack-complementarios');

    if (packWidgetIndex !== -1 && productId) {
      const { data: aiSettingsRows } = await supabase
        .from('ai_cross_sell_settings')
        .select('*')
        .eq('store_id', safeStoreIdStr)
        .limit(1);

      const aiSettings = aiSettingsRows?.[0] || null;
      const aiActive = aiSettings ? aiSettings.is_active : false;

      if (aiActive) {
        const { data: storeRows } = await supabase
          .from('stores')
          .select('access_token')
          .eq('store_id', safeStoreIdStr)
          .limit(1);

        const storeRow = storeRows?.[0] || null;

        if (storeRow && storeRow.access_token) {
          try {
            const rawProducts = await getProducts(storeId, storeRow.access_token);
            const productList = Array.isArray(rawProducts)
              ? rawProducts
              : (rawProducts as { products?: any[] })?.products || [];

            const discount = aiSettings ? Number(aiSettings.discount_percentage) : 15;
            const aiRecommendedItems = computeAiPairings(productList, productId, discount);

            if (aiRecommendedItems.length > 0) {
              const currentConfig = enrichedWidgets[packWidgetIndex].config || {};
              enrichedWidgets[packWidgetIndex].config = {
                ...currentConfig,
                titulo: aiSettings?.title || currentConfig.titulo || "🔥 COMBINÁ Y AHORRÁ EN TU PACK",
                subtexto: aiSettings?.subtitle || currentConfig.subtexto || "Llevate estos productos juntos con un descuento especial",
                textoBoton: aiSettings?.button_text || currentConfig.textoBoton || "Agregar pack al carrito",
                descuentoPorcentaje: discount,
                items: aiRecommendedItems
              };
            }
          } catch (aiError) {
            console.error("[Nevux AI] Error inyectando sugerencias predictivas:", aiError);
          }
        }
      }
    }

    // Enriquecer reseñas si existen
    const widgetsResenas = enrichedWidgets.filter(
      (w) => w.widget_slug === 'resenas-clientes'
    )

    if (widgetsResenas.length > 0) {
      const enriquecidos = await Promise.all(
        widgetsResenas.map(async (w) => {
          let reviewsQuery = supabase
            .from('reviews')
            .select(
              'id, nombre, estrellas, texto, foto_url, talle, ajuste_talle, ' +
              'verificada, desde_calificar, respuesta_texto, respuesta_fecha, ' +
              'fecha_resena, orden, product_id'
            )
            .eq('widget_id', w.id)
            .eq('estado', 'aprobada')
            .order('orden', { ascending: true })
            .limit(50)

          if (w.target_type === 'product' && w.target_product_id) {
            reviewsQuery = reviewsQuery.eq('product_id', w.target_product_id)
          }

          const { data: reviews, error: reviewsError } = await reviewsQuery

          if (reviewsError) {
            return { ...w, reviews: [], stats: defaultStats() }
          }

          const aprobadas = reviews || []
          const stats = calcularStats(aprobadas)

          return { ...w, reviews: aprobadas, stats }
        })
      )

      enrichedWidgets = enrichedWidgets.map((w) => {
        if (w.widget_slug !== 'resenas-clientes') return w
        const enriquecido = enriquecidos.find((e) => e.id === w.id)
        return enriquecido ?? w
      })
    }

    // Traducción multi-idioma automática
    const langSettings = langRes.data?.[0] || null;

    if (langSettings) {
      const defaultLang = (langSettings.default_language || "es") as "es" | "pt" | "en";
      const autoDetect = langSettings.auto_detect ?? true;
      const enabledLangs = (langSettings.enabled_languages || ["es", "pt", "en"]) as ("es" | "pt" | "en")[];
      const savedTranslations = langSettings.translations || {};

      let targetLang: "es" | "pt" | "en" = defaultLang;
      if (autoDetect && clientLangParam) {
        const slicedLang = clientLangParam.slice(0, 2).toLowerCase() as any;
        if (enabledLangs.includes(slicedLang)) {
          targetLang = slicedLang;
        }
      }

      if (targetLang !== "es") {
        enrichedWidgets = enrichedWidgets.map((w) => {
          let translatedConfig = { ...w.config };

          if (savedTranslations[w.id] && savedTranslations[w.id][targetLang]) {
            translatedConfig = {
              ...translatedConfig,
              ...(savedTranslations[w.id][targetLang] as Record<string, unknown>),
            };
          } else {
            translatedConfig = translateWidgetConfig(w.widget_slug, translatedConfig, targetLang);
          }

          return {
            ...w,
            config: translatedConfig,
          };
        });
      }
    }

    return NextResponse.json(
      { 
        widgets: enrichedWidgets, 
        activeCampaign: activeCampaignData,
        voiceSearch: voiceSearchData,
        virtualSalesman: virtualSalesmanData,
        ts: Date.now() 
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Error en GET /api/widget-render:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message, widgets: [], activeCampaign: null, voiceSearch: null, virtualSalesman: null },
      { status: 500, headers: corsHeaders }
    )
  }
               }
