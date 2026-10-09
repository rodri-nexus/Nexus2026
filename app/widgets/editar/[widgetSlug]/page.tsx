// app/widgets/editar/[widgetSlug]/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import BannerSuperiorEditor from '@/components/widgets/editors/BannerSuperiorEditor';
import PreguntasFrecuentesEditor from '@/components/widgets/editors/PreguntasFrecuentesEditor';
import ProductosComplementariosEditor from '@/components/widgets/editors/ProductosComplementariosEditor';
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
import BundleCantidadEditor from '@/components/widgets/editors/BundleCantidadEditor';
import SliderVideosEditor from '@/components/widgets/editors/SliderVideosEditor';
import BarraAccionEditor from '@/components/widgets/editors/BarraAccionEditor';
import MensajeGarantiaEditor from '@/components/widgets/editors/MensajeGarantiaEditor';
import BadgeEfectivoEditor from '@/components/widgets/editors/BadgeEfectivoEditor';
import PackComplementariosEditor from '@/components/widgets/editors/PackComplementariosEditor';
import ComparadorAntesDespuesEditor from '@/components/widgets/editors/ComparadorAntesDespuesEditor';

interface PageProps {
  params: { widgetSlug: string };
  searchParams: { product?: string; category?: string; target?: string };
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

  const rawCategoryId = searchParams.category || (searchParams.target === 'category' ? searchParams.category : null) || null;
  const categoryId = rawCategoryId ? String(rawCategoryId).trim() : null;
  const productId = searchParams.product ? parseInt(searchParams.product, 10) : null;

  let targetType = 'all';
  if (categoryId || searchParams.target === 'category') {
    targetType = 'category';
  } else if (productId) {
    targetType = 'product';
  }

  // Consulta ordenada por actualización más reciente
  let existingQuery = supabase
    .from('widgets')
    .select('id, config, is_active, target_type, target_product_id, target_category_id')
    .eq('user_id', user.id)
    .eq('store_id', store.store_id)
    .eq('widget_slug', params.widgetSlug)
    .order('updated_at', { ascending: false });

  if (targetType === 'category' && categoryId) {
    existingQuery = existingQuery
      .eq('target_type', 'category')
      .or(`target_category_id.eq.${categoryId},config->>category_id.eq.${categoryId}`);
  } else if (targetType === 'product' && productId) {
    existingQuery = existingQuery
      .eq('target_type', 'product')
      .eq('target_product_id', productId);
  } else {
    existingQuery = existingQuery.eq('target_type', 'all');
  }

  const { data: existingWidgets } = await existingQuery;
  let existingWidget = existingWidgets && existingWidgets.length > 0 ? existingWidgets[0] : null;

  // Inyectar category_id en la config si es tipo categoría
  if (targetType === 'category' && categoryId) {
    if (existingWidget) {
      existingWidget = {
        ...existingWidget,
        target_type: 'category',
        target_category_id: categoryId,
        config: {
          ...(existingWidget.config || {}),
          category_id: categoryId,
        },
      };
    } else {
      existingWidget = {
        id: null as any,
        is_active: true,
        target_type: 'category',
        target_product_id: null,
        target_category_id: categoryId,
        config: {
          category_id: categoryId,
        },
      } as any;
    }
  }

  const editorProps = {
    widgetDefinition: widgetDef,
    existingWidget: existingWidget,
    targetType: targetType as any,
    productId: productId,
    categoryId: categoryId,
    storeId: store.store_id,
  };

  // WIDGET: COMPARADOR ANTES Y DESPUÉS
  if (params.widgetSlug === 'comparador-antes-despues') {
    return <ComparadorAntesDespuesEditor {...editorProps} />;
  }

  // WIDGET: BANNER SUPERIOR
  if (params.widgetSlug === 'banner-superior') {
    return <BannerSuperiorEditor {...editorProps} />;
  }

  // WIDGET: PREGUNTAS FRECUENTES
  if (params.widgetSlug === 'preguntas-frecuentes') {
    return <PreguntasFrecuentesEditor {...editorProps} />;
  }

  // WIDGET: BADGE DE EFECTIVO
  if (params.widgetSlug === 'badge-efectivo') {
    return <BadgeEfectivoEditor {...editorProps} />;
  }

  // WIDGET: MENSAJE DE GARANTÍA
  if (params.widgetSlug === 'mensaje-garantia') {
    return <MensajeGarantiaEditor {...editorProps} />;
  }

  // WIDGET: BARRA DE ACCIÓN
  if (params.widgetSlug === 'barra-accion') {
    return <BarraAccionEditor {...editorProps} />;
  }

  // WIDGET: SLIDER DE VIDEOS
  if (params.widgetSlug === 'slider-videos') {
    return <SliderVideosEditor {...editorProps} />;
  }

  // WIDGET: BUNDLE DE CANTIDAD
  if (params.widgetSlug === 'bundle-cantidad') {
    return <BundleCantidadEditor {...editorProps} />;
  }

  // WIDGET: PACK COMPLEMENTARIOS
  if (params.widgetSlug === 'pack-complementarios') {
    return <PackComplementariosEditor {...editorProps} />;
  }

  // WIDGET: PRODUCTOS COMPLEMENTARIOS
  if (params.widgetSlug === 'productos-complementarios') {
    return <ProductosComplementariosEditor {...editorProps} />;
  }

  // WIDGET: BARRA DE CUOTAS SIN INTERÉS
  if (params.widgetSlug === 'barra-cuotas') {
    return <BarraCuotasEditor {...editorProps} />;
  }

  // WIDGET: BARRA DE ENVÍO GRATIS
  if (params.widgetSlug === 'barra-envio-gratis') {
    return <BarraEnvioGratisEditor {...editorProps} />;
  }

  // WIDGET: POPUP DE CONVERSIÓN
  if (params.widgetSlug === 'popup-conversion') {
    return <PopupConversionEditor {...editorProps} />;
  }

  // WIDGET: BUNDLE DE PROMOCIONES
  if (params.widgetSlug === 'bundle-promociones') {
    return <BundlePromocionesEditor {...editorProps} />;
  }

  // WIDGET: RESEÑAS DESTACADAS
  if (params.widgetSlug === 'resenas-destacadas') {
    return <ResenasDestacadasEditor {...editorProps} />;
  }

  // WIDGET: URGENCIA DE STOCK
  if (params.widgetSlug === 'urgencia-stock') {
    return <UrgenciaStockEditor {...editorProps} />;
  }

  // WIDGET: INFORMACIÓN DE DESPACHO
  if (params.widgetSlug === 'info-despacho') {
    return <InfoDespachoEditor {...editorProps} />;
  }

  // WIDGET: CUENTA REGRESIVA
  if (params.widgetSlug === 'cuenta-regresiva') {
    return <CuentaRegresivaEditor {...editorProps} />;
  }

  // WIDGET: CONTADOR DE VENDIDOS
  if (params.widgetSlug === 'contador-vendidos') {
    return <ContadorVendidosEditor {...editorProps} />;
  }

  // WIDGET: STICKER EDICIÓN LIMITADA
  if (params.widgetSlug === 'edicion-limitada') {
    return <EdicionLimitadaEditor {...editorProps} />;
  }

  // WIDGET: CALCULADORA DE AHORRO
  if (params.widgetSlug === 'calculadora-ahorro') {
    return <CalculadoraAhorroEditor {...editorProps} />;
  }

  // WIDGET: HORARIO DE ATENCIÓN
  if (params.widgetSlug === 'horario-atencion') {
    return <HorarioAtencionEditor {...editorProps} />;
  }

  // WIDGET: MARQUEE DE NOVEDADES
  if (params.widgetSlug === 'marquee-novedades') {
    return <MarqueeNovedadesEditor {...editorProps} />;
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
