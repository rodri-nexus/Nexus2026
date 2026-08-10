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
      widget_id,
      store_id,
      product_id,
      nombre,
      email,
      estrellas,
      texto,
      foto_url,
      talle,
      ajuste_talle,
      desde_calificar,
    } = body

    // 2. Validaciones básicas
    if (!widget_id || typeof widget_id !== 'string') {
      return NextResponse.json(
        { error: 'widget_id es requerido' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    if (!store_id) {
      return NextResponse.json(
        { error: 'store_id es requerido' },
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

    // 3. Validar email si vino
    if (email && typeof email === 'string' && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Email inválido' },
          { status: 400, headers: CORS_HEADERS }
        )
      }
    }

    // 4. Validar tamaño de foto (máx ~2MB en base64)
    if (foto_url && typeof foto_url === 'string') {
      const MAX_BASE64_SIZE = 2 * 1024 * 1024
      if (foto_url.length > MAX_BASE64_SIZE) {
        return NextResponse.json(
          { error: 'La foto es demasiado grande (máx 2MB)' },
          { status: 400, headers: CORS_HEADERS }
        )
      }
    }

    // 5. Validar ajuste_talle si vino
    const AJUSTES_VALIDOS = ['chico', 'algo_chico', 'como_esperaba', 'algo_grande', 'grande']
    let ajusteTalleFinal: string | null = null
    if (ajuste_talle && typeof ajuste_talle === 'string') {
      if (!AJUSTES_VALIDOS.includes(ajuste_talle)) {
        return NextResponse.json(
          { error: 'ajuste_talle inválido' },
          { status: 400, headers: CORS_HEADERS }
        )
      }
      ajusteTalleFinal = ajuste_talle
    }

    // 6. Verificar que el widget exista, sea del slug correcto y esté activo
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, widget_slug, store_id, is_active, config')
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

    if (String(widget.store_id) !== String(store_id)) {
      return NextResponse.json(
        { error: 'store_id no coincide con el widget' },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    // 7. Bloqueo de duplicados: mismo nombre + widget + producto
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

    // 8. Determinar estado según la config del widget
    const config = widget.config || {}
    const aprobarAuto = config.aprobarAutomaticamente === true
    const vieneDeCalificar = desde_calificar === true

    const estadoInicial = aprobarAuto ? 'aprobada' : 'pendiente'
    const verificadaInicial = vieneDeCalificar

    // 9. Insertar reseña
    const { data: nuevaReview, error: insertError } = await supabase
      .from('reviews')
      .insert({
        widget_id,
        store_id: String(store_id),
        product_id: productIdNum,
        nombre: nombre.trim(),
        email: email ? String(email).trim().toLowerCase() : null,
        estrellas: estrellasNum,
        texto: texto.trim(),
        foto_url: foto_url || null,
        talle: talle ? String(talle).trim().substring(0, 20) : null,
        ajuste_talle: ajusteTalleFinal,
        verificada: verificadaInicial,
        estado: estadoInicial,
        desde_calificar: vieneDeCalificar,
        fecha_resena: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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

    // 10. Responder
    const mensajeAgradecimiento = config.mensajeAgradecimiento
      || (aprobarAuto
        ? '¡Gracias por tu reseña! Ya está publicada.'
        : '¡Gracias! Tu reseña fue enviada y será publicada luego de ser revisada.')

    return NextResponse.json(
      {
        success: true,
        review: nuevaReview,
        estado: estadoInicial,
        mensaje: mensajeAgradecimiento,
        cupon: aprobarAuto && config.ofrecerCupon === true && config.codigoCupon
          ? String(config.codigoCupon).trim()
          : null,
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
      .order('created_at', { ascending: false })

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

    // 5. Calcular stats
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('estrellas, estado')
      .eq('widget_id', widgetIdParam)

    const total = allReviews?.length || 0
    const pendientes = allReviews?.filter((r) => r.estado === 'pendiente').length || 0
    const aprobadas = allReviews?.filter((r) => r.estado === 'aprobada') || []
    const rechazadas = allReviews?.filter((r) => r.estado === 'rechazada').length || 0

    let promedio = 0
    const distribucion: Record<string, number> = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }

    if (aprobadas.length > 0) {
      const suma = aprobadas.reduce((acc, r) => acc + (r.estrellas || 0), 0)
      promedio = parseFloat((suma / aprobadas.length).toFixed(2))
      aprobadas.forEach((r) => {
        const key = String(r.estrellas)
        if (distribucion[key] !== undefined) distribucion[key]++
      })
    }

    return NextResponse.json({
      reviews: reviews || [],
      stats: {
        total,
        pendientes,
        aprobadas: aprobadas.length,
        rechazadas,
        promedio,
        distribucion,
      },
    })
  } catch (error: any) {
    console.error('Error en GET /api/reviews:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
         }
