// app/api/widget-render/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isStorePlanActive } from '@/lib/plan'
import { getProducts } from '@/lib/tiendanube'

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
   HELPERS DE SOCIAL PROOF (Regla #9 al inicio)
═══════════════════════════════════════════ */
const LATAM_NAMES = ["María L.", "Sofía G.", "Agustina K.", "Lucas M.", "Camila R.", "Valentina B.", "Mateo T.", "Facundo S."];
const LATAM_CITIES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Tucumán", "Mar del Plata", "Salta"];
const RECENT_TIMES = ["hace un momento", "hace 3 minutos", "hace 7 minutos", "hace 12 minutos", "hace 18 minutos"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseProductName(raw: unknown): string {
  if (!raw) return "Producto de la tienda";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return String(obj.es || obj.pt || Object.values(obj)[0] || "Producto de la tienda");
  }
  return "Producto de la tienda";
}

function getProductImageUrl(p: Record<string, unknown>): string {
  if (typeof p.image_url === "string") return p.image_url;
  if (Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first !== null && "src" in first) {
      return String((first as { src: unknown }).src || "");
    }
  }
  return "";
}

function generateSocialProofEvents(products: unknown[], settings: Record<string, any>) {
  const events: any[] = [];
  const parsedProducts = (Array.isArray(products) ? products : [])
    .map((item) => {
      const p = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return { id: Number(p.id) || 0, name: parseProductName(p.name), image: getProductImageUrl(p) };
    })
    .filter((p) => p.id > 0);

  const availableProducts = parsedProducts.length > 0
    ? parsedProducts
    : [{ id: 1, name: "Producto destacado", image: "" }];

  if (settings.enable_recent_sales !== false) {
    for (let i = 0; i < 4; i++) {
      const prod = getRandomItem(availableProducts);
      const name = getRandomItem(LATAM_NAMES);
      const city = getRandomItem(settings.custom_cities || LATAM_CITIES);
      const timeAgo = getRandomItem(RECENT_TIMES);

      events.push({
        id: `sale-${i}-${Date.now()}`,
        type: "sale",
        title: `${name} de ${city}`,
        subtitle: `Compró ${prod.name}`,
        timeAgo,
        icon: "🛒",
        productName: prod.name,
        productImage: prod.image,
        location: city,
      });
    }
  }

  if (settings.enable_live_visitors !== false) {
    const count = Math.floor(Math.random() * 18) + 8;
    events.push({
      id: `visitor-${Date.now()}`,
      type: "visitor",
      title: "🔥 ¡Alta demanda!",
      subtitle: `${count} personas están viendo este producto en vivo`,
      icon: "👀",
      count,
    });
  }

  if (settings.enable_low_stock !== false && availableProducts.length > 0) {
    const prod = getRandomItem(availableProducts);
    const stock = Math.floor(Math.random() * 4) + 2;
    events.push({
      id: `stock-${Date.now()}`,
      type: "stock",
      title: "⚠️ Quedan pocas unidades",
      subtitle: `Solo quedan ${stock} unidades de ${prod.name}`,
      icon: "⚡",
      productName: prod.name,
      productImage: prod.image,
      count: stock,
    });
  }

  return events.sort(() => Math.random() - 0.5);
}

/* ═══════════════════════════════════════════
   FUNCIONES AUXILIARES Y TIPOS DEL SISTEMA (Regla #9 al inicio)
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

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/* ═══════════════════════════════════════════
   ENDPOINT PRINCIPAL GET
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeIdParam = searchParams.get('store_id')
    const productIdParam = searchParams.get('product_id')
    const clientLangParam = searchParams.get('lang')

    if (!storeIdParam) {
      return NextResponse.json(
        { error: 'store_id es requerido', widgets: [], voiceSearch: null, virtualSalesman: null, socialProof: null },
        { status: 400, headers: corsHeaders }
      )
    }

    const storeId = parseInt(storeIdParam, 10)
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'store_id inválido', widgets: [], voiceSearch: null, virtualSalesman: null, socialProof: null },
        { status: 400, headers: corsHeaders }
      )
    }

    const productId = productIdParam ? parseInt(productIdParam, 10) : null

    // 🔒 Verificación de plan activo
    const isActivePlan = await isStorePlanActive(storeId)
    if (!isActivePlan) {
      return NextResponse.json(
        { widgets: [], voiceSearch: null, virtualSalesman: null, socialProof: null, message: 'El plan o la prueba gratuita de 7 días ha expirado.' },
        { status: 200, headers: corsHeaders }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 🎙️ Obtener ajustes de Búsqueda por Voz
    const { data: voiceRow } = await supabase
      .from('store_voice_search_settings')
      .select('is_active, position, button_color, listening_text, placeholder_text, language')
      .eq('store_id', storeId)
      .maybeSingle()

    const voiceSearchData = voiceRow || {
      is_active: false,
      position: "bottom-right",
      button_color: "#10B981",
      listening_text: "Escuchando... Decí lo que buscás",
      placeholder_text: "Buscá por voz en la tienda...",
      language: "es-AR",
    }

    // 🤖 Obtener ajustes del Vendedor Virtual IA
    const { data: salesmanRow } = await supabase
      .from('store_virtual_salesman_settings')
      .select('is_active, agent_name, welcome_message, agent_avatar, personality, whatsapp_number, enable_whatsapp_escalation, theme_color')
      .eq('store_id', storeId)
      .maybeSingle()

    const virtualSalesmanData = salesmanRow || {
      is_active: false,
      agent_name: "Sofía (Asesora Virtual)",
      welcome_message: "¡Hola! 👋 ¿Buscás algo en especial hoy? Contame y te ayudo a encontrar el producto ideal.",
      agent_avatar: "👩‍💼",
      personality: "friendly",
      whatsapp_number: "",
      enable_whatsapp_escalation: true,
      theme_color: "#10B981",
    }

    // 🔥 Obtener ajustes de Social Proof IA
    const { data: socialProofRow } = await supabase
      .from('store_social_proof_settings')
      .select('*')
      .eq('store_id', storeId)
      .maybeSingle()

    let socialProofData = socialProofRow || {
      is_active: false,
      position: "bottom-left",
      display_duration: 5,
      delay_between: 8,
      enable_recent_sales: true,
      enable_live_visitors: true,
      enable_low_stock: true,
      theme_style: "light",
      events: [],
    }

    if (socialProofData.is_active) {
      const { data: storeRow } = await supabase
        .from('stores')
        .select('access_token')
        .eq('store_id', storeId)
        .maybeSingle()

      let rawProds: unknown[] = []
      if (storeRow?.access_token) {
        try {
          const prods = await getProducts(storeId, storeRow.access_token)
          rawProds = Array.isArray(prods) ? prods : (prods as { products?: unknown[] })?.products || []
        } catch (e) {
          console.error('[Nevux Social Proof] Error obteniendo productos:', e)
        }
      }

      socialProofData = {
        ...socialProofData,
        events: generateSocialProofEvents(rawProds, socialProofData),
      }
    }

    // 2. Buscar widgets activos ordenados por la fecha de actualización MÁS RECIENTE
    let query = supabase
      .from('widgets')
      .select('id, widget_slug, widget_type, target_type, target_product_id, config, is_active, updated_at')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (productId) {
      query = query.or(
        `target_type.eq.all,and(target_type.eq.product,target_product_id.eq.${productId})`
      )
    } else {
      query = query.eq('target_type', 'all')
    }

    const { data: rawWidgets, error: widgetsError } = await query

    if (widgetsError) {
      console.error('Error obteniendo widgets:', widgetsError)
      return NextResponse.json(
        { error: widgetsError.message, widgets: [], voiceSearch: voiceSearchData, virtualSalesman: virtualSalesmanData, socialProof: socialProofData },
        { status: 500, headers: corsHeaders }
      )
    }

    // 🧹 DEDUPLICACIÓN ESTRICTA: Conservar ÚNICAMENTE la configuración MÁS RECIENTE guardada para cada widget_slug
    const uniqueMap = new Map<string, any>()
    for (const w of rawWidgets || []) {
      if (!uniqueMap.has(w.widget_slug)) {
        uniqueMap.set(w.widget_slug, w)
      }
    }
    const widgets = Array.from(uniqueMap.values())

    // Enriquecer widgets con sus definiciones
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

    // Enriquecer widgets de reseñas si existen
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
            .order('created_at', { ascending: false })
            .limit(100)

          if (w.target_type === 'product' && w.target_product_id) {
            reviewsQuery = reviewsQuery.eq('product_id', w.target_product_id)
          }

          const { data: reviews, error: reviewsError } = await reviewsQuery

          if (reviewsError) {
            console.error(`Error obteniendo reseñas para widget ${w.id}:`, reviewsError)
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

    // 🌎 INTERCEPCIÓN IDIOMA: Traducir los widgets automáticamente si el cliente tiene habilitado otro idioma
    const { data: langSettings } = await supabase
      .from("store_language_settings")
      .select("*")
      .eq("store_id", storeId)
      .maybeSingle();

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
        voiceSearch: voiceSearchData,
        virtualSalesman: virtualSalesmanData,
        socialProof: socialProofData,
        ts: Date.now() 
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Error en GET /api/widget-render:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message, widgets: [], voiceSearch: null, virtualSalesman: null, socialProof: null },
      { status: 500, headers: corsHeaders }
    )
  }
   }
