import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// ═══════════════════════════════════════════════════════════
// POST /api/widgets
// Crea o actualiza un widget
// ═══════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Parsear body
    const body = await req.json()
    const {
      id,
      store_id,
      widget_slug,
      widget_type,
      target_type,
      target_product_id,
      config,
      is_active,
    } = body

    // 3. Validaciones básicas
    if (!widget_slug) {
      return NextResponse.json(
        { error: 'widget_slug es requerido' },
        { status: 400 }
      )
    }
    if (!store_id) {
      return NextResponse.json(
        { error: 'store_id es requerido' },
        { status: 400 }
      )
    }
    if (!target_type || !['product', 'all'].includes(target_type)) {
      return NextResponse.json(
        { error: 'target_type inválido (debe ser "product" o "all")' },
        { status: 400 }
      )
    }
    if (target_type === 'product' && !target_product_id) {
      return NextResponse.json(
        { error: 'target_product_id es requerido cuando target_type es "product"' },
        { status: 400 }
      )
    }

    // 4. Verificar que la tienda pertenezca al usuario
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .eq('store_id', store_id)
      .eq('is_active', true)
      .single()

    if (storeError || !store) {
      return NextResponse.json(
        { error: 'Tienda no encontrada o no autorizada' },
        { status: 403 }
      )
    }

    const now = new Date().toISOString()

    // 5. CASO A: viene con id → UPDATE directo
    if (id) {
      const { data, error } = await supabase
        .from('widgets')
        .update({
          widget_type: widget_type || widget_slug,
          target_type,
          target_product_id: target_type === 'product' ? target_product_id : null,
          config: config || {},
          is_active: is_active !== undefined ? is_active : true,
          updated_at: now,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error actualizando widget:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ data, widget: data, action: 'updated' })
    }

    // 6. CASO B: sin id → buscar si ya existe uno con misma combinación
    let existingQuery = supabase
      .from('widgets')
      .select('id')
      .eq('user_id', user.id)
      .eq('store_id', store_id)
      .eq('widget_slug', widget_slug)
      .eq('target_type', target_type)

    if (target_type === 'product') {
      existingQuery = existingQuery.eq('target_product_id', target_product_id)
    } else {
      existingQuery = existingQuery.is('target_product_id', null)
    }

    const { data: existingList, error: findError } = await existingQuery.limit(1)

    if (findError) {
      console.error('Error buscando widget existente:', findError)
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      )
    }

    // 6a. Si ya existe → UPDATE
    if (existingList && existingList.length > 0) {
      const existingId = existingList[0].id
      const { data, error } = await supabase
        .from('widgets')
        .update({
          widget_type: widget_type || widget_slug,
          config: config || {},
          is_active: is_active !== undefined ? is_active : true,
          updated_at: now,
        })
        .eq('id', existingId)
        .select()
        .single()

      if (error) {
        console.error('Error actualizando widget existente:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ data, widget: data, action: 'updated' })
    }

    // 6b. Si no existe → INSERT
    const { data, error } = await supabase
      .from('widgets')
      .insert({
        user_id: user.id,
        store_id,
        widget_slug,
        widget_type: widget_type || widget_slug,
        target_type,
        target_product_id: target_type === 'product' ? target_product_id : null,
        config: config || {},
        is_active: is_active !== undefined ? is_active : true,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creando widget:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, widget: data, action: 'created' })
  } catch (error: any) {
    console.error('Error en POST /api/widgets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════
// GET /api/widgets?store_id=X (opcional)
// Lista los widgets del usuario autenticado
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
    const storeIdParam = searchParams.get('store_id')

    // 3. Construir query
    let query = supabase
      .from('widgets')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (storeIdParam) {
      const storeIdNum = parseInt(storeIdParam, 10)
      if (isNaN(storeIdNum)) {
        return NextResponse.json(
          { error: 'store_id inválido' },
          { status: 400 }
        )
      }
      query = query.eq('store_id', storeIdNum)
    }

    const { data: widgets, error: fetchError } = await query

    if (fetchError) {
      console.error('Error listando widgets:', fetchError)
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ widgets: widgets || [] })
  } catch (error: any) {
    console.error('Error en GET /api/widgets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════
// PATCH /api/widgets
// Activa/desactiva un widget (toggle is_active)
// Body: { id: string, is_active: boolean }
// ═══════════════════════════════════════════════════════════
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Parsear body
    const body = await req.json()
    const { id, is_active } = body

    // 3. Validaciones
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'id es requerido y debe ser un string' },
        { status: 400 }
      )
    }
    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active es requerido y debe ser un boolean' },
        { status: 400 }
      )
    }

    // 4. Update con ownership check (id + user_id)
    const { data, error } = await supabase
      .from('widgets')
      .update({
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error actualizando is_active del widget:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Widget no encontrado o no autorizado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data, widget: data, action: 'toggled' })
  } catch (error: any) {
    console.error('Error en PATCH /api/widgets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════
// DELETE /api/widgets?id=xxx
// Elimina un widget permanentemente
// ═══════════════════════════════════════════════════════════
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Leer query param id
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido en query params' },
        { status: 400 }
      )
    }

    // 3. Delete con ownership check (id + user_id)
    const { data, error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error eliminando widget:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Widget no encontrado o no autorizado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, deleted: data, action: 'deleted' })
  } catch (error: any) {
    console.error('Error en DELETE /api/widgets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error?.message },
      { status: 500 }
    )
  }
    }
