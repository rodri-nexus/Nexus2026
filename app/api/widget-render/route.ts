import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isStorePlanActive } from '@/lib/plan'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeIdParam = searchParams.get('store_id')
    const productIdParam = searchParams.get('product_id')

    if (!storeIdParam) {
      return NextResponse.json(
        { error: 'store_id es requerido', widgets: [] },
        { status: 400, headers: corsHeaders }
      )
    }

    const storeId = parseInt(storeIdParam, 10)
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'store_id inválido', widgets: [] },
        { status: 400, headers: corsHeaders }
      )
    }

    const productId = productIdParam ? parseInt(productIdParam, 10) : null

    // 🔒 Verificación de plan activo
    const isActivePlan = await isStorePlanActive(storeId)
    if (!isActivePlan) {
      return NextResponse.json(
        { widgets: [], message: 'El plan o la prueba gratuita de 7 días ha expirado.' },
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

    // Buscar widgets activos ordenados por la fecha de actualización MÁS RECIENTE
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
        { error: widgetsError.message, widgets: [] },
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

    return NextResponse.json(
      { widgets: enrichedWidgets, ts: Date.now() },
      { status: 200, headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Error en GET /api/widget-render:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message, widgets: [] },
      { status: 500, headers: corsHeaders }
    )
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

function defaultStats() {
  return {
    total: 0,
    promedio: 0,
    distribucion: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
  }
        }
