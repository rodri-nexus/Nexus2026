// app/api/widget-render/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isStorePlanActive } from '@/lib/plan'
import { getCampaignPreset } from '@/lib/campaignPresets'
import { getProducts } from "@/lib/tiendanube"

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ═══════════════════════════════════════════
   FUNCIONES AUXILIARES Y TIPOS (Regla #9 al inicio)
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

// --- PARSERS Y MOTOR IA PARA SUGERENCIAS DINÁMICAS ---
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

// Extracción profunda de precio compatible con Tiendanube
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
    price: extractProductPrice(p), // <-- Ahora usa el nuevo extractor con soporte para variantes
    image: getProductImageUrl(p),
    variantId: getProductVariantId(p),
  })).filter((p) => p.id > 0 && p.price > 0 && p.variantId !== "");

  if (parsed.length < 2) return [];

  const mainProduct = parsed.find(p => p.id === mainProductId);
  if (!mainProduct) {
    // Fallback: Si no se encuentra el producto principal en el catálogo, sugerir los 2 primeros válidos
    return parsed.slice(0, 2).map(p => ({
      titulo: p.name,
      precio: p.price,
      imagenUrl: p.image,
      variantId: p.variantId,
      incluidoPorDefecto: true
    }));
  }

  // Buscar candidatos complementarios excluyendo el producto principal
  const candidates = parsed.filter(p => p.id !== mainProductId);
  
  const scoredCandidates = candidates.map(candidate => {
    let score = 50; // Puntaje base

    // Regla de Afinidad de Precio (Ideal entre 15% y 65% del producto principal)
    const ratio = candidate.price / mainProduct.price;
    if (ratio >= 0.15 && ratio <= 0.65) {
      score += 35;
    } else if (ratio < 1.0) {
      score += 15;
    }

    // Regla de Afinidad Semántica por palabras compartidas
    const mainWords = mainProduct.name.toLowerCase().split(/\s+/);
    const candWords = candidate.name.toLowerCase().split(/\s+/);
    const sharesKeywords = mainWords.some(w => w.length > 3 && candWords.includes(w));
    if (sharesKeywords) {
      score += 20;
    }

    return { candidate, score };
  });

  // Ordenar de mayor a menor puntaje
  scoredCandidates.sort((a, b) => b.score - a.score);

  // Devolver los 2 mejores complementos calculados por IA
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
   ENDPOINT PRINCIPAL GET
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeIdParam = searchParams.get('store_id')
    const productIdParam = searchParams.get('product_id')

    if (!storeIdParam) {
      return NextResponse.json(
        { error: 'store_id es requerido', widgets: [], activeCampaign: null },
        { status: 400, headers: corsHeaders }
      )
    }

    const storeId = parseInt(storeIdParam, 10)
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'store_id inválido', widgets: [], activeCampaign: null },
        { status: 400, headers: corsHeaders }
      )
    }

    const productId = productIdParam ? parseInt(productIdParam, 10) : null

    // 🔒 Verificación de plan activo
    const isActivePlan = await isStorePlanActive(storeId)
    if (!isActivePlan) {
      return NextResponse.json(
        { widgets: [], activeCampaign: null, message: 'El plan o la prueba gratuita de 7 días ha expirado.' },
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

    // 1. Consultar campaña activa de la tienda para efectos visuales
    let activeCampaignData: {
      slug: string
      name: string
      effect: string
      themeColor: string
      accentColor: string
    } | null = null

    const { data: campaignRow } = await supabase
      .from('active_campaigns')
      .select('campaign_slug')
      .eq('store_id', storeId)
      .maybeSingle()

    if (campaignRow && campaignRow.campaign_slug) {
      const preset = getCampaignPreset(campaignRow.campaign_slug)
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
        { error: widgetsError.message, widgets: [], activeCampaign: activeCampaignData },
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

    // 🧠 INTERCEPCIÓN IA: Dinamizar el widget pack-complementarios con Cross-Selling predictivo si está activo
    const packWidgetIndex = enrichedWidgets.findIndex(w => w.widget_slug === 'pack-complementarios');

    if (packWidgetIndex !== -1 && productId) {
      const { data: aiSettings } = await supabase
        .from('ai_cross_sell_settings')
        .select('*')
        .eq('store_id', storeId)
        .maybeSingle();

      const aiActive = aiSettings ? aiSettings.is_active : false;

      if (aiActive) {
        const { data: storeRow } = await supabase
          .from('stores')
          .select('access_token')
          .eq('store_id', storeId)
          .maybeSingle();

        if (storeRow && storeRow.access_token) {
          try {
            const rawProducts = await getProducts(storeId, storeRow.access_token);
            const productList = Array.isArray(rawProducts)
              ? rawProducts
              : (rawProducts as { products?: any[] })?.products || [];

            const discount = aiSettings ? Number(aiSettings.discount_percentage) : 15;

            // Calcular complementarios óptimos de forma dinámica por IA (con el nuevo extractor de precios)
            const aiRecommendedItems = computeAiPairings(productList, productId, discount);

            if (aiRecommendedItems.length > 0) {
              const currentConfig = enrichedWidgets[packWidgetIndex].config || {};
              enrichedWidgets[packWidgetIndex].config = {
                ...currentConfig,
                titulo: aiSettings?.title || currentConfig.titulo || "🔥 COMBINÁ Y AHORRÁ EN TU PACK",
                subtexto: aiSettings?.subtitle || currentConfig.subtexto || "Llevate estos productos juntos con un descuento especial",
                textoBoton: aiSettings?.button_text || currentConfig.textoBoton || "Agregar pack al carrito",
                descuentoPorcentaje: discount,
                items: aiRecommendedItems // ¡Reemplazo dinámico instantáneo!
              };
              console.log("[Nevux AI] Widget Pack Complementarios dinamizado con IA para productId:", productId);
            }
          } catch (aiError) {
            console.error("[Nevux AI] Error inyectando sugerencias predictivas:", aiError);
          }
        }
      }
    }

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

    return NextResponse.json(
      { 
        widgets: enrichedWidgets, 
        activeCampaign: activeCampaignData,
        ts: Date.now() 
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Error en GET /api/widget-render:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message, widgets: [], activeCampaign: null },
      { status: 500, headers: corsHeaders }
    )
  }
       }
