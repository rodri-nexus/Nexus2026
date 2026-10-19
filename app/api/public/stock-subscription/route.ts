import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { store_id, email, product_name, product_url } = body || {};

    if (!store_id || !email) {
      return NextResponse.json(
        { error: 'store_id y email son requeridos' },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400, headers: corsHeaders }
      );
    }

    const row = {
      store_id: String(store_id),
      email: cleanEmail,
      product_name: product_name ? String(product_name) : '',
      product_url: product_url ? String(product_url) : '',
    };

    const { data, error } = await supabase
      .from('stock_alert_subscriptions')
      .insert([row])
      .select()
      .maybeSingle();

    if (error) {
      console.error('stock_alert_subscriptions insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error del servidor' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const store_id = searchParams.get('store_id');

    if (!store_id) {
      return NextResponse.json(
        { error: 'store_id es requerido' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabase
      .from('stock_alert_subscriptions')
      .select('*')
      .eq('store_id', String(store_id))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('stock_alert_subscriptions select error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { subscriptions: data || [] },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error del servidor' },
      { status: 500, headers: corsHeaders }
    );
  }
}
