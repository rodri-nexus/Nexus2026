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
import BundleCantidadEditor from '@/components/widgets/editors/BundleCantidadEditor';
import CajaOpinionesEditor from '@/components/widgets/editors/CajaOpinionesEditor';
import InformacionDespachoEditor from '@/components/widgets/editors/InformacionDespachoEditor';
import InformacionEnvioEditor from '@/components/widgets/editors/InformacionEnvioEditor';
import MensajeAlertaEditor from '@/components/widgets/editors/MensajeAlertaEditor';
import MensajeGarantiaEditor from '@/components/widgets/editors/MensajeGarantiaEditor';
import ResenasClientesEditor from '@/components/widgets/editors/ResenasClientesEditor';
import SliderVideoEditor from '@/components/widgets/editors/SliderVideoEditor';
import ExtrasInterruptorEditor from '@/components/widgets/editors/ExtrasInterruptorEditor';
import ContadorVisitasEditor from '@/components/widgets/editors/ContadorVisitasEditor';
import InfoCompraEditor from '@/components/widgets/editors/InfoCompraEditor';
import BadgeCuponEditor from '@/components/widgets/editors/BadgeCuponEditor';
import ComparadorMarcaEditor from '@/components/widgets/editors/ComparadorMarcaEditor';
import MediosPagoEditor from '@/components/widgets/editors/MediosPagoEditor';
import TablaTallesEditor from '@/components/widgets/editors/TablaTallesEditor';
import PackComplementariosEditor from '@/components/widgets/editors/PackComplementariosEditor';

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

  // WIDGET: PACK COMPLEMENTARIOS
  if (params.widgetSlug === 'pack-complementarios') {
    return (
      <PackComplementariosEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: TABLA DE TALLES
  if (params.widgetSlug === 'tabla-talles') {
    return (
      <TablaTallesEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: MEDIOS DE PAGO
  if (params.widgetSlug === 'medios-pago') {
    return (
      <MediosPagoEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: COMPARADOR DE MARCA
  if (params.widgetSlug === 'comparador-marca') {
    return (
      <ComparadorMarcaEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET: BADGE CUPÓN
  if (params.widgetSlug === 'badge-cupon') {
    return (
      <BadgeCuponEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET UNIFICADO: INFORMACIÓN DE COMPRA
  if (params.widgetSlug === 'info-compra') {
    return (
      <InfoCompraEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET EXTRAS CON INTERRUPTOR
  if (params.widgetSlug === 'extras-interruptor' || params.widgetSlug === 'switch-extras') {
    return (
      <ExtrasInterruptorEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  // WIDGET CONTADOR DE VISITAS
  if (params.widgetSlug === 'contador-visitas' || params.widgetSlug === 'visitor-counter') {
    return (
      <ContadorVisitasEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

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

  if (params.widgetSlug === 'bundle-cantidad') {
    return (
      <BundleCantidadEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'caja-opiniones') {
    return (
      <CajaOpinionesEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'info-despacho') {
    return (
      <InformacionDespachoEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'info-envio') {
    return (
      <InformacionEnvioEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'mensaje-alerta') {
    return (
      <MensajeAlertaEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'mensaje-garantia') {
    return (
      <MensajeGarantiaEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'resenas-clientes') {
    return (
      <ResenasClientesEditor
        widgetDefinition={widgetDef}
        existingWidget={existingWidget}
        targetType={targetType as 'product' | 'all'}
        productId={productId}
        storeId={store.store_id}
      />
    );
  }

  if (params.widgetSlug === 'slider-video') {
    return (
      <SliderVideoEditor
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
