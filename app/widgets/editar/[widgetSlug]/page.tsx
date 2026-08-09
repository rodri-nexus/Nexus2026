// app/widgets/editar/[widgetSlug]/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import CountdownEditor from '@/components/widgets/editors/CountdownEditor';
import BadgeCuotasEditor from '@/components/widgets/editors/BadgeCuotasEditor';
import BadgeEnvioEditor from '@/components/widgets/editors/BadgeEnvioEditor';
import BadgeTransferenciaEditor from '@/components/widgets/editors/BadgeTransferenciaEditor';
import BannerDeslizanteEditor from '@/components/widgets/editors/BannerDeslizanteEditor';
import BarraProgresoEditor from '@/components/widgets/editors/BarraProgresoEditor';
import BundlePromocionesEditor from '@/components/widgets/editors/BundlePromocionesEditor';

interface PageProps {
  params: { widgetSlug: string };
  searchParams: { product?: string; target?: string };
}

export default async function EditWidgetPage({ params, searchParams }: PageProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: store } = await supabase
    .from('stores')
    .select('store_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!store) redirect('/dashboard');

  const { data: widgetDef } = await supabase
    .from('widget_definitions')
    .select('id, slug, name, description, category, icon')
    .eq('slug', params.widgetSlug)
    .single();

  if (!widgetDef) redirect('/dashboard');

  const targetType = searchParams.product ? 'product' : 'all';
  const productId = searchParams.product ? parseInt(searchParams.product, 10) : null;

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

  if (params.widgetSlug === 'cuenta-regresiva') {
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

  if (params.widgetSlug === 'badge-cuotas') {
    return (
      <BadgeCuotasEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'badge-envio') {
    return (
      <BadgeEnvioEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'badge-transferencia') {
    return (
      <BadgeTransferenciaEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'banner-deslizante') {
    return (
      <BannerDeslizanteEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'barra-progreso') {
    return (
      <BarraProgresoEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'bundle-promociones') {
    return (
      <BundlePromocionesEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 40 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center', maxWidth: 500, border: '1px solid #e5e7eb' }}>
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
