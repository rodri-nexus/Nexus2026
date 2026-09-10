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

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/* ═══════════════════════════════════════════
   ENDPOINT PRINCIPAL GET (SQL RESTRINCTION - ZERO TIMEOUT)
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
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'store_id inválido', widgets: [], activeCampaign: null, voiceSearch: null, virtualSalesman: null },
        { status: 400, headers: corsHeaders }
      )
    }

    const productId = productIdParam ? parseInt(productIdParam, 10) : null

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 🎯 Consulta filtrada directamente en la base de datos (Lee 9 filas en vez de 100)
    let dbQuery = supabase
      .from('widgets')
      .select('id, widget_slug, widget_type, target_type, target_product_id, config, is_active, updated_at')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (productId) {
      dbQuery = dbQuery.or(`target_type.eq.all,target_product_id.eq.${productId}`);
    } else {
      dbQuery = dbQuery.eq('target_type', 'all');
    }

    // ⚡ EJECUCIÓN PARALELA ULTRA RÁPIDA (Máximo 20 widgets relevantes)
    const [
      isActivePlan,
      { data: voiceRows },
      { data: salesmanRows },
      { data: campaignRows },
      { data: rawWidgets, error: widgetsError },
      { data: langSettingsRows }
    ] = await Promise.all([
      isStorePlanActive(storeId),
      supabase.from('store_voice_search_settings').select('is_active, position, button_color, listening_text, placeholder_text, language').eq('store_id', storeId).limit(1),
      supabase.from('store_virtual_salesman_settings').select('is_active, agent_name, welcome_message, agent_avatar, personality, whatsapp_number, enable_whatsapp_escalation, theme_color').eq('store_id', storeId).limit(1),
      supabase.from('active_campaigns').select('campaign_slug').eq('store_id', storeId).order('activated_at', { ascending: false }).limit(1),
      dbQuery.limit(20),
      supabase.from('store_language_settings').select('*').eq('store_id', storeId).limit(1)
    ]);

    if (!isActivePlan) {
      return NextResponse.json(
        { widgets: [], activeCampaign: null, voiceSearch: null, virtualSalesman: null, message: 'El plan o la prueba gratuita de 7 días ha expirado.' },
        { status: 200, headers: corsHeaders }
      )
    }

    if (widgetsError) {
      return NextResponse.json(
        { error: widgetsError.message, widgets: [], activeCampaign: null, voiceSearch: null, virtualSalesman: null },
        { status: 500, headers: corsHeaders }
      )
    }

    const voiceSearchData = voiceRows?.[0] || {
      is_active: false,
      position: "bottom-right",
      button_color: "#10B981",
      listening_text: "Escuchando... Decí lo que buscás",
      placeholder_text: "Buscá por voz en la tienda...",
      language: "es-AR",
    }

    const virtualSalesmanData = salesmanRows?.[0] || {
      is_active: false,
      agent_name: "Sofía (Asesora Virtual)",
      welcome_message: "¡Hola! 👋 ¿Buscás algo en especial hoy? Contame y te ayudo a encontrar el producto ideal.",
      agent_avatar: "👩‍💼",
      personality: "friendly",
      whatsapp_number: "",
      enable_whatsapp_escalation: true,
      theme_color: "#10B981",
    }

    let activeCampaignData: {
      slug: string
      name: string
      effect: string
      themeColor: string
      accentColor: string
    } | null = null

    const activeCampaignSlug = campaignRows?.[0]?.campaign_slug

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

    // Deduplicación por slug
    const allWidgets = rawWidgets || []
    const uniqueMap = new Map<string, any>()
    for (const w of allWidgets) {
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
        .select('slug, name')
        .in('slug', slugs)

      definitions = defs || []
    }

    let enrichedWidgets = widgets.map((w) => ({
      ...w,
      definition: definitions.find((d) => d.slug === w.widget_slug) || null,
    }))

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
