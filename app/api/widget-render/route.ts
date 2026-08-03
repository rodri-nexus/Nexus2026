import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════
// GET /api/widget-render?store_id=X&product_id=Y (opcional)
// API pública consumida por el script nevux-widget.js
// Devuelve los widgets activos que deben mostrarse en la tienda
// ═══════════════════════════════════════════════════════════

// Headers CORS: permiten que el script en la tienda del cliente
// (ej: mitienda.com.ar) pueda consumir esta API desde nevux.app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=30, s-maxage=30',
}

// Handler para preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(req: NextRequest) {
  try {
    // 1. Leer query params
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

    // 2. Crear cliente Supabase con service_role_key (sin sesión de usuario)
    // Fallback al anon_key si no está la service key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 3. Verificar que la tienda existe y está activa
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('store_id, is_active')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .single()

    if (storeError || !store) {
      return NextResponse.json(
        { widgets: [], message: 'Tienda no encontrada o inactiva' },
        { status: 200, headers: corsHeaders }
      )
    }

    // 4. Buscar widgets activos de la tienda
    let query = supabase
      .from('widgets')
      .select('id, widget_slug, widget_type, target_type, target_product_id, config, is_active')
      .eq('store_id', storeId)
      .eq('is_active', true)

    if (productId) {
      // En ficha de producto: widgets para toda la tienda + widgets para este producto específico
      query = query.or(
        `target_type.eq.all,and(target_type.eq.product,target_product_id.eq.${productId})`
      )
    } else {
      // En cualquier otra página: solo widgets para toda la tienda
      query = query.eq('target_type', 'all')
    }

    const { data: widgets, error: widgetsError } = await query

    if (widgetsError) {
      console.error('Error obteniendo widgets:', widgetsError)
      return NextResponse.json(
        { error: widgetsError.message, widgets: [] },
        { status: 500, headers: corsHeaders }
      )
    }

    // 5. Enriquecer widgets con sus definiciones (nombre, ícono, categoría, etc.)
    const slugs = (widgets || []).map((w) => w.widget_slug)
    let definitions: any[] = []

    if (slugs.length > 0) {
      const { data: defs } = await supabase
        .from('widget_definitions')
        .select('*')
        .in('slug', slugs)

      definitions = defs || []
    }

    const enrichedWidgets = (widgets || []).map((w) => ({
      ...w,
      definition: definitions.find((d) => d.slug === w.widget_slug) || null,
    }))

    // 6. Devolver widgets
    return NextResponse.json(
      { widgets: enrichedWidgets },
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
