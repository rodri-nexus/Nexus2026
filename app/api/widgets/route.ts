import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'

function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return corsResponse({ error: 'No autorizado' }, 401)

    const body = await req.json()
    const { id, store_id, widget_slug, widget_type, target_type, target_product_id, config, is_active } = body

    const { data: store } = await supabase.from('stores').select('id').eq('user_id', user.id).eq('store_id', store_id).eq('is_active', true).single()
    if (!store) return corsResponse({ error: 'Tienda no autorizada' }, 403)

    const now = new Date().toISOString()
    const payload = {
      user_id: user.id,
      store_id,
      widget_slug,
      widget_type: widget_type || widget_slug,
      target_type,
      target_product_id: target_type === 'product' ? target_product_id : null,
      config: config || {},
      is_active: is_active !== undefined ? is_active : true,
      updated_at: now
    }

    const { data, error } = await supabase.from('widgets').upsert({
      ...(id ? { id } : {}),
      ...payload,
      ...(id ? {} : { created_at: now })
    }, { onConflict: 'id' }).select().single()

    if (error) throw error
    return corsResponse({ data, widget: data })
  } catch (error: any) {
    return corsResponse({ error: error.message }, 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeIdParam = searchParams.get('store_id')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Caso Público (Tienda Real)
    if (!user) {
      if (!storeIdParam) return corsResponse({ error: 'No autorizado' }, 401)
      const { data: widgets } = await supabaseAdmin
        .from('widgets')
        .select('*')
        .eq('store_id', parseInt(storeIdParam, 10))
        .eq('is_active', true)

      return corsResponse({ 
        widgets: widgets || [], 
        ts: Date.now() // Cache buster
      })
    }

    // Caso Privado (Dashboard)
    let query = supabase.from('widgets').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
    if (storeIdParam) query = query.eq('store_id', parseInt(storeIdParam, 10))
    const { data: widgets } = await query
    return corsResponse({ widgets: widgets || [] })
  } catch (error: any) {
    return corsResponse({ error: error.message }, 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return corsResponse({ error: 'No autorizado' }, 401)

    const body = await req.json()
    const { id, is_active } = body
    const { data, error } = await supabase.from('widgets').update({ is_active, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id).select().single()
    
    if (error) throw error
    return corsResponse({ data })
  } catch (error: any) {
    return corsResponse({ error: error.message }, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return corsResponse({ error: 'No autorizado' }, 401)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const { data, error } = await supabase.from('widgets').delete().eq('id', id).eq('user_id', user.id).select().single()
    
    if (error) throw error
    return corsResponse({ success: true })
  } catch (error: any) {
    return corsResponse({ error: error.message }, 500)
  }
  }
