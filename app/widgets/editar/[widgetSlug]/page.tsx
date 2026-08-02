// app/widgets/editar/[widgetSlug]/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import CountdownEditor from '@/components/widgets/editors/CountdownEditor';

interface PageProps {
  params: { widgetSlug: string };
  searchParams: { product?: string; target?: string };
}

export default async function EditWidgetPage({ params, searchParams }: PageProps) {
  const supabase = createClient();

  // Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Store
  const { data: store } = await supabase
    .from('stores')
    .select('store_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!store) redirect('/dashboard');

  // Widget definition
  const { data: widgetDef } = await supabase
    .from('widget_definitions')
    .select('id, slug, name, description, category, icon')
    .eq('slug', params.widgetSlug)
    .single();

  if (!widgetDef) redirect('/dashboard');

  // Determine target
  const targetType = searchParams.product ? 'product' : 'all';
  const productId = searchParams.product ? parseInt(searchParams.product, 10) : null;

  // Check existing widget
  let existingQuery = supabase
    .from('widgets')
    .select('id, config, is_active, target_type, target_product_id')
    .eq('user_id', user.id)
    .eq('store_id', store.store_id)
    .eq('widget_slug', params.widgetSlug);

  if (targetType === 'product' && productId) {
    existingQuery = existingQuery.eq('target_product_id', productId);
  } else {
    existingQuery = existingQuery.eq('target_type', 'all');
  }

  const { data: existingWidgets } = await existingQuery;
  const existingWidget = existingWidgets && existingWidgets.length > 0 ? existingWidgets[0] : null;

  // Route to the correct editor based on slug
  if (params.widgetSlug === 'contador-regresivo') {
    return (
      <CountdownEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // Default placeholder for other widgets (temporary)
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
        padding: 40,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
          maxWidth: 500,
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Editor de &quot;{widgetDef.name}&quot;
        </h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>
          Este editor está en desarrollo. Próximamente podrás configurar este widget.
        </p>
      </div>
    </div>
  );
}
