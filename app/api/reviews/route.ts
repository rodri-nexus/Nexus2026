import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// ═══════════════════════════════════════════════════════════
// Headers CORS para el POST público (formulario en la tienda)
// ═══════════════════════════════════════════════════════════
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// ═══════════════════════════════════════════════════════════
// OPTIONS /api/reviews (preflight CORS)
// ═══════════════════════════════════════════════════════════
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

// ═══════════════════════════════════════════════════════════
// POST /api/reviews (PÚBLICO - sin auth)
// Crea una reseña desde el formulario público de la tienda
// ═══════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Parsear body
    const body = await req.json()
    const {
      store_id,
      widget_id,
      product_id,
      nombre,
      estrellas,
      texto,
      foto_url,
      talle,
      desde_calificar,
    } = body

    // 2. Validaciones básicas
    if (!store_id || typeof store_id !== 'string') {
      return NextResponse.json(
        { error: 'store_id es requerido' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    if (!widget_id || typeof widget_id !== 'string') {
      return NextResponse.json(
        { error: 'widget_id es requerido' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    if (nombre.trim().length > 80) {
      return NextResponse.json(
        { error: 'El nombre no puede superar los 80 caracteres' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    const estrellasNum = parseInt(estrellas, 10)
    if (isNaN(estrellasNum) || estrellasNum < 1 || estrellasNum > 5) {
      return NextResponse.json(
        { error: 'estrellas debe ser un número entre 1 y 5' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    if (!texto || typeof texto !== 'string' || texto.trim().length < 5) {
      return NextResponse.json(
        { error: 'El texto debe tener al menos 5 caracteres' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    if (texto.trim().length > 2000) {
      return NextResponse.json(
        { error: 'El texto no puede superar los 2000 caracteres' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // 3. Validar tamaño de foto (máx ~2MB en base64)
    if (foto_url && typeof foto_url === 'string') {
      const MAX_BASE64_SIZE = 2 * 1024 * 1024 // 2MB
      if (foto_url.length > MAX_BASE64_SIZE) {
        return NextResponse.json(
          { error: 'La foto es demasiado grande (máx 2MB)' },
          { status: 400, headers: CORS_HEADERS }
        )
      }
    }

    // 4. Verificar que el widget exista y sea del slug correcto
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, widget_slug, store_id, is_active')
      .eq('id', widget_id)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { error: 'Widget no encontrado' },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    if (widget.widget_slug !== 'resenas-clientes') {
      return NextResponse.json(
        { error: 'El widget no es del tipo reseñas' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    if (!widget.is_active) {
      return NextResponse.json(
        { error: 'El widget está desactivado' },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    // Verificar que el store_id coincida con el del widget
    if (String(widget.store_id) !== String(store_id)) {
      return NextResponse.json(
        { error: 'store_id no coincide con el widget' },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    // 5. Validar duplicados: mismo nombre + widget + producto
    const productIdNum = product_id ? parseInt(product_id, 10) : null

    let duplicateQuery = supabase
      .from('reviews')
      .select('id')
      .eq('widget_id', widget_id)
      .ilike('nombre', nombre.trim())

    if (productIdNum) {
      duplicateQuery = duplicateQuery.eq('product_id', productIdNum)
    } else {
      duplicateQuery = duplicateQuery.is('product_id', null)
    }

    const { data: duplicates, error: dupError } = await duplicateQuery.limit(1)

    if (dupError) {
      console.error('Error verificando duplicados:', dupError)
      return NextResponse.json(
        { error: 'Error verificando reseñas previas' },
        { status: 500, headers: CORS_HEADERS }
      )
    }

    if (duplicates && duplicates.length > 0) {
      return NextResponse.json(
        { error: 'Ya dejaste una reseña para este producto' },
        { status: 409, headers: CORS_HEADERS }
      )
    }

    // 6. Determinar estado y verificación según el origen
    const vieneDeCalificar = desde_calificar === true
    const estadoInicial = vieneDeCalificar ? 'aprobada' : 'pendiente'
    const verificadaInicial = vieneDeCalificar

    // 7. Insertar reseña
    const { data: nuevaReview, error: insertError } = await supabase
      .from('reviews')
      .insert({
        store_id: String(store_id),
        widget_id,
        product_id: productIdNum,
        nombre: nombre.trim(),
        estrellas: estrellasNum,
        texto: texto.trim(),
        foto_url: foto_url || null,
        talle: talle ? String(talle).trim().substring(0, 20) : null,
        verificada: verificadaInicial,
        estado: estadoInicial,
        desde_calificar: vieneDeCalificar,
        fecha_creacion: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error insertando reseña:', insertError)
      return NextResponse.json(
        { error: insertError.message },
        { status: 500, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      {
        success: true,
        review: nuevaReview,
        estado: estadoInicial,
        mensaje: vieneDeCalificar
          ? '¡Gracias por tu reseña! Ya está publicada.'
          : '¡Gracias por tu reseña! Se publicará luego de ser revisada.',
      },
      { status: 201, headers: CORS_HEADERS }
    )
  } catch (error: any) {
    console.error('Error en POST /api/reviews:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

// ═══════════════════════════════════════════════════════════
// GET /api/reviews?widget_id=X&estado=Y (PRIVADO - con auth)
// Lista reseñas de un widget para el panel de moderación
// ═══════════════════════════════════════════════════════════
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Leer query params
    const { searchParams } = new URL(req.url)
    const widgetIdParam = searchParams.get('widget_id')
    const estadoParam = searchParams.get('estado')

    if (!widgetIdParam) {
      return NextResponse.json(
        { error: 'widget_id es requerido' },
        { status: 400 }
      )
    }

    // 3. Verificar que el widget pertenezca al usuario
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, store_id, user_id')
      .eq('id', widgetIdParam)
      .eq('user_id', user.id)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { error: 'Widget no encontrado o no autorizado' },
        { status: 403 }
      )
    }

    // 4. Construir query de reseñas
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('widget_id', widgetIdParam)
      .order('fecha_creacion', { ascending: false })

    if (estadoParam) {
      if (!['pendiente', 'aprobada', 'rechazada'].includes(estadoParam)) {
        return NextResponse.json(
          { error: 'estado inválido' },
          { status: 400 }
        )
      }
      query = query.eq('estado', estadoParam)
    }

    const { data: reviews, error: fetchError } = await query

    if (fetchError) {
      console.error('Error listando reseñas:', fetchError)
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      )
    }

    // 5. Calcular stats (promedio + counts por estado)
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('estrellas, estado')
      .eq('widget_id', widgetIdParam)

    const stats = {
      total: allReviews?.length || 0,
      pendientes: allReviews?.filter((r) => r.estado === 'pendiente').length || 0,
      aprobadas: allReviews?.filter((r) => r.estado === 'aprobada').length || 0,
      rechazadas: allReviews?.filter((r) => r.estado === 'rechazada').length || 0,
      promedio: 0,
    }

    const aprobadas = allReviews?.filter((r) => r.estado === 'aprobada') || []
    if (aprobadas.length > 0) {
      const suma = aprobadas.reduce((acc, r) => acc + (r.estrellas || 0), 0)
      stats.promedio = parseFloat((suma / aprobadas.length).toFixed(2))
    }

    return NextResponse.json({
      reviews: reviews || [],
      stats,
    })
  } catch (error: any) {
    console.error('Error en GET /api/reviews:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
      }
