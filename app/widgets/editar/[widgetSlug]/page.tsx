// app/widgets/editar/[widgetSlug]/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import BarraCuotasEditor from '@/components/widgets/editors/BarraCuotasEditor';
import BarraEnvioGratisEditor from '@/components/widgets/editors/BarraEnvioGratisEditor';
import MarqueeNovedadesEditor from '@/components/widgets/editors/MarqueeNovedadesEditor';
import HorarioAtencionEditor from '@/components/widgets/editors/HorarioAtencionEditor';
import CalculadoraAhorroEditor from '@/components/widgets/editors/CalculadoraAhorroEditor';
import EdicionLimitadaEditor from '@/components/widgets/editors/EdicionLimitadaEditor';
import ContadorVendidosEditor from '@/components/widgets/editors/ContadorVendidosEditor';
import CuentaRegresivaEditor from '@/components/widgets/editors/CuentaRegresivaEditor';
import InfoDespachoEditor from '@/components/widgets/editors/InfoDespachoEditor';
import UrgenciaStockEditor from '@/components/widgets/editors/UrgenciaStockEditor';
import ResenasDestacadasEditor from '@/components/widgets/editors/ResenasDestacadasEditor';
import BundlePromocionesEditor from '@/components/widgets/editors/BundlePromocionesEditor';
import PopupConversionEditor from '@/components/widgets/editors/PopupConversionEditor';

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

  // 🚨 REDIRECCIÓN INTELIGENTE: HERRAMIENTAS PRO / SOCIAL PROOF
  if (params.widgetSlug === 'social-proof') {
    redirect('/dashboard/social-proof');
  }

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

  // Consulta ordenada por actualización más reciente
  let existingQuery = supabase
    .from('widgets')
    .select('id, config, is_active, target_type, target_product_id')
    .eq('user_id', user.id)
    .eq('store_id', store.store_id)
    .eq('widget_slug', params.widgetSlug)
    .order('updated_at', { ascending: false });

  if (targetType === 'product' && productId) {
    existingQuery = existingQuery.eq('target_product_id', productId);
  } else {
    existingQuery = existingQuery.eq('target_type', 'all');
  }

  const { data: existingWidgets } = await existingQuery;
  const existingWidget = existingWidgets && existingWidgets.length > 0 ? existingWidgets[0] : null;

  // WIDGET: BARRA DE CUOTAS SIN INTERÉS
  if (params.widgetSlug === 'barra-cuotas') {
    return (
      <BarraCuotasEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: BARRA DE ENVÍO GRATIS
  if (params.widgetSlug === 'barra-envio-gratis') {
    return (
      <BarraEnvioGratisEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: POPUP DE CONVERSIÓN
  if (params.widgetSlug === 'popup-conversion') {
    return (
      <PopupConversionEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: BUNDLE DE PROMOCIONES
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

  // WIDGET: RESEÑAS DESTACADAS
  if (params.widgetSlug === 'resenas-destacadas') {
    return (
      <ResenasDestacadasEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: URGENCIA DE STOCK
  if (params.widgetSlug === 'urgencia-stock') {
    return (
      <UrgenciaStockEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: INFORMACIÓN DE DESPACHO
  if (params.widgetSlug === 'info-despacho') {
    return (
      <InfoDespachoEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: CUENTA REGRESIVA
  if (params.widgetSlug === 'cuenta-regresiva') {
    return (
      <CuentaRegresivaEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: CONTADOR DE VENDIDOS
  if (params.widgetSlug === 'contador-vendidos') {
    return (
      <ContadorVendidosEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: STICKER EDICIÓN LIMITADA
  if (params.widgetSlug === 'edicion-limitada') {
    return (
      <EdicionLimitadaEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: CALCULADORA DE AHORRO
  if (params.widgetSlug === 'calculadora-ahorro') {
    return (
      <CalculadoraAhorroEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: HORARIO DE ATENCIÓN
  if (params.widgetSlug === 'horario-atencion') {
    return (
      <HorarioAtencionEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: MARQUEE DE NOVEDADES
  if (params.widgetSlug === 'marquee-novedades') {
    return (
      <MarqueeNovedadesEditor
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
