import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// ═══════════════════════════════════════════════════════════
// Constantes de validación
// ═══════════════════════════════════════════════════════════
const AJUSTES_TALLE_VALIDOS = [
  'chico',
  'algo_chico',
  'como_esperaba',
  'algo_grande',
  'grande',
]

const ESTADOS_VALIDOS = ['pendiente', 'aprobada', 'rechazada']

function isValidDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}

// ═══════════════════════════════════════════════════════════
// Helper: verifica que la reseña exista y sea del usuario
// Devuelve { review, supabase } o { errorResponse }
// ═══════════════════════════════════════════════════════════
async function getOwnedReview(reviewId: string, userId: string) {
  const supabase = createClient()

  // 1. Buscar la reseña
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('id, widget_id')
    .eq('id', reviewId)
    .single()

  if (reviewError || !review) {
    return {
      supabase,
      review: null,
      errorResponse: NextResponse.json(
        { error: 'Reseña no encontrada' },
        { status: 404 }
      ),
    }
  }

  // 2. Verificar que el widget pertenezca al usuario (mismo patrón que GET /api/reviews)
  const { data: widget, error: widgetError } = await supabase
    .from('widgets')
    .select('id, user_id')
    .eq('id', review.widget_id)
    .eq('user_id', userId)
    .single()

  if (widgetError || !widget) {
    return {
      supabase,
      review: null,
      errorResponse: NextResponse.json(
        { error: 'No tenés permisos para modificar esta reseña' },
        { status: 403 }
      ),
    }
  }

  return { supabase, review, errorResponse: null }
}

// ═══════════════════════════════════════════════════════════
// PATCH /api/reviews/[id]
// Actualiza campos editoriales/administrativos de una reseña
// Solo el dueño del widget puede hacerlo
// ═══════════════════════════════════════════════════════════
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // 1. Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const reviewId = params.id
    if (!reviewId) {
      return NextResponse.json(
        { error: 'ID de reseña requerido' },
        { status: 400 }
      )
    }

    // 2. Verificar ownership
    const { supabase: db, review, errorResponse } = await getOwnedReview(
      reviewId,
      user.id
    )

    if (errorResponse || !review) {
      return errorResponse!
    }

    // 3. Parsear body
    let body: Record<string, any>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Body JSON inválido' },
        { status: 400 }
      )
    }

    // 4. Construir objeto de actualización — solo campos permitidos
    const updateData: Record<string, any> = {}

    if ('nombre' in body) {
      if (typeof body.nombre !== 'string' || body.nombre.trim().length < 2) {
        return NextResponse.json(
          { error: 'nombre debe tener al menos 2 caracteres' },
          { status: 400 }
        )
      }
      if (body.nombre.trim().length > 80) {
        return NextResponse.json(
          { error: 'nombre no puede superar 80 caracteres' },
          { status: 400 }
        )
      }
      updateData.nombre = body.nombre.trim()
    }

    if ('email' in body) {
      if (body.email === null || body.email === '') {
        updateData.email = null
      } else if (typeof body.email !== 'string') {
        return NextResponse.json({ error: 'email inválido' }, { status: 400 })
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email.trim())) {
          return NextResponse.json(
            { error: 'email inválido' },
            { status: 400 }
          )
        }
        updateData.email = body.email.trim().toLowerCase()
      }
    }

    if ('estrellas' in body) {
      const estrellasNum =
        typeof body.estrellas === 'string'
          ? parseInt(body.estrellas, 10)
          : body.estrellas

      if (
        typeof estrellasNum !== 'number' ||
        !Number.isInteger(estrellasNum) ||
        estrellasNum < 1 ||
        estrellasNum > 5
      ) {
        return NextResponse.json(
          { error: 'estrellas debe ser un número entero entre 1 y 5' },
          { status: 400 }
        )
      }
      updateData.estrellas = estrellasNum
    }

    if ('texto' in body) {
      if (typeof body.texto !== 'string' || body.texto.trim().length < 5) {
        return NextResponse.json(
          { error: 'texto debe tener al menos 5 caracteres' },
          { status: 400 }
        )
      }
      if (body.texto.trim().length > 2000) {
        return NextResponse.json(
          { error: 'texto no puede superar 2000 caracteres' },
          { status: 400 }
        )
      }
      updateData.texto = body.texto.trim()
    }

    if ('foto_url' in body) {
      if (body.foto_url === null || body.foto_url === '') {
        updateData.foto_url = null
      } else if (typeof body.foto_url !== 'string') {
        return NextResponse.json(
          { error: 'foto_url inválida' },
          { status: 400 }
        )
      } else {
        const MAX_BASE64_SIZE = 2 * 1024 * 1024
        if (body.foto_url.length > MAX_BASE64_SIZE) {
          return NextResponse.json(
            { error: 'La foto es demasiado grande (máx 2MB)' },
            { status: 400 }
          )
        }
        updateData.foto_url = body.foto_url
      }
    }

    if ('talle' in body) {
      if (body.talle === null || body.talle === '') {
        updateData.talle = null
      } else if (typeof body.talle !== 'string') {
        return NextResponse.json({ error: 'talle inválido' }, { status: 400 })
      } else {
        updateData.talle = body.talle.trim().substring(0, 20)
      }
    }

    if ('ajuste_talle' in body) {
      if (body.ajuste_talle === null || body.ajuste_talle === '') {
        updateData.ajuste_talle = null
      } else if (!AJUSTES_TALLE_VALIDOS.includes(body.ajuste_talle)) {
        return NextResponse.json(
          { error: 'ajuste_talle inválido' },
          { status: 400 }
        )
      } else {
        updateData.ajuste_talle = body.ajuste_talle
      }
    }

    if ('verificada' in body) {
      if (typeof body.verificada !== 'boolean') {
        return NextResponse.json(
          { error: 'verificada debe ser boolean' },
          { status: 400 }
        )
      }
      updateData.verificada = body.verificada
    }

    if ('estado' in body) {
      if (!ESTADOS_VALIDOS.includes(body.estado)) {
        return NextResponse.json(
          { error: 'estado inválido. Valores posibles: pendiente, aprobada, rechazada' },
          { status: 400 }
        )
      }
      updateData.estado = body.estado
    }

    if ('respuesta_texto' in body) {
      if (body.respuesta_texto === null || body.respuesta_texto === '') {
        updateData.respuesta_texto = null
      } else if (typeof body.respuesta_texto !== 'string') {
        return NextResponse.json(
          { error: 'respuesta_texto inválido' },
          { status: 400 }
        )
      } else {
        updateData.respuesta_texto = body.respuesta_texto.trim()
      }
    }

    if ('respuesta_fecha' in body) {
      if (body.respuesta_fecha === null || body.respuesta_fecha === '') {
        updateData.respuesta_fecha = null
      } else if (
        typeof body.respuesta_fecha !== 'string' ||
        !isValidDate(body.respuesta_fecha)
      ) {
        return NextResponse.json(
          { error: 'respuesta_fecha inválida' },
          { status: 400 }
        )
      } else {
        updateData.respuesta_fecha = body.respuesta_fecha
      }
    }

    if ('fecha_resena' in body) {
      if (body.fecha_resena === null || body.fecha_resena === '') {
        updateData.fecha_resena = null
      } else if (
        typeof body.fecha_resena !== 'string' ||
        !isValidDate(body.fecha_resena)
      ) {
        return NextResponse.json(
          { error: 'fecha_resena inválida' },
          { status: 400 }
        )
      } else {
        updateData.fecha_resena = body.fecha_resena
      }
    }

    if ('orden' in body) {
      if (
        typeof body.orden !== 'number' ||
        !Number.isInteger(body.orden) ||
        body.orden < 0
      ) {
        return NextResponse.json(
          { error: 'orden debe ser un número entero positivo' },
          { status: 400 }
        )
      }
      updateData.orden = body.orden
    }

    // 5. Verificar que haya algo para actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No se enviaron campos válidos para actualizar' },
        { status: 400 }
      )
    }

    // 6. Agregar updated_at
    updateData.updated_at = new Date().toISOString()

    // 7. Ejecutar update
    const { data: updatedReview, error: updateError } = await db
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error actualizando reseña:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar la reseña', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, review: updatedReview })
  } catch (error: any) {
    console.error('Error en PATCH /api/reviews/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════
// DELETE /api/reviews/[id]
// Elimina una reseña — solo el dueño del widget puede hacerlo
// ═══════════════════════════════════════════════════════════
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // 1. Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const reviewId = params.id
    if (!reviewId) {
      return NextResponse.json(
        { error: 'ID de reseña requerido' },
        { status: 400 }
      )
    }

    // 2. Verificar ownership
    const { supabase: db, review, errorResponse } = await getOwnedReview(
      reviewId,
      user.id
    )

    if (errorResponse || !review) {
      return errorResponse!
    }

    // 3. Eliminar
    const { error: deleteError } = await db
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (deleteError) {
      console.error('Error eliminando reseña:', deleteError)
      return NextResponse.json(
        { error: 'Error al eliminar la reseña', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error en DELETE /api/reviews/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
      }
