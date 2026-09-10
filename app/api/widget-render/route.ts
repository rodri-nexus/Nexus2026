// app/api/widget-render/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const storeIdParam = searchParams.get('store_id') || '7401217'
    const storeId = parseInt(storeIdParam, 10)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Creamos cliente con Service Role (si existe) o Anon
    const clientKey = serviceKey || anonKey
    const supabase = createClient(supabaseUrl, clientKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 1. Probar lectura directa de widgets
    const { data: widgetsNum, error: errNum } = await supabase
      .from('widgets')
      .select('id, store_id, user_id, widget_slug, is_active')
      .eq('store_id', storeId)

    const { data: widgetsStr, error: errStr } = await supabase
      .from('widgets')
      .select('id, store_id, user_id, widget_slug, is_active')
      .eq('store_id', String(storeIdParam))

    // 2. Probar lectura de active_campaigns
    const { data: campData, error: errCamp } = await supabase
      .from('active_campaigns')
      .select('*')
      .eq('store_id', storeId)

    return NextResponse.json(
      {
        diagnostico: {
          tiene_service_role_key: !!serviceKey,
          key_utilizada: serviceKey ? "SERVICE_ROLE (Bypass RLS)" : "ANON_KEY (Bloqueado por RLS)",
          widgets_por_numero: {
            cantidad: widgetsNum?.length || 0,
            error: errNum?.message || null,
            data: widgetsNum || []
          },
          widgets_por_texto: {
            cantidad: widgetsStr?.length || 0,
            error: errStr?.message || null,
            data: widgetsStr || []
          },
          campana_activa: {
            cantidad: campData?.length || 0,
            error: errCamp?.message || null,
            data: campData || []
          }
        }
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
