'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BundlePromocionesPreview from './BundlePromocionesPreview';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

interface EditorProps {
  widgetDefinition: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string;
  };
  existingWidget: {
    id: string;
    config: any;
    is_active: boolean;
    target_type: string;
    target_product_id: number | null;
  } | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

const PROMOS_DISPONIBLES = ['2x1', '3x1', '3x2', '4x2', '4x3', '5x3', '5x4', '6x2', '6x3', '6x4'];

const DEFAULT_PROMO_CONFIG = {
  formatoEtiqueta: 'lleva-paga',
  subtitulo: '',
  badgeEnvioGratis: false,
  badgeMasVendido: false,
  badgePersonalizado: false,
  ocultarComp1: false,
  ocultarComp2: false,
  agregarRegalo: false,
  marcarPorDefecto: false,
  ocultarEsta: false,
};

const DEFAULT_CONFIG = {
  titulo: '',
  textoBoton: '',
  promociones: ['2x1'] as string[],
  configPromos: {
    '2x1': { ...DEFAULT_PROMO_CONFIG, marcarPorDefecto: true },
  } as Record<string, any>,
  producto1: '',
  producto2: '',
  productosCheckedDefault: false,
  reemplazarBoton: false,
  colorBoton: '#10B981',
  fondoDegrade: false,
  colorPrecio: '#000000',
  colorSubtitulos: '#059669',
  fondoSubtitulo: 'transparent',
  colorTextoRegalo: '#000000',
  colorPrecioRegalo: '#16a34a',
  fondoRegalo: '#ecfdf5',
  colorBadgeEnvio: '#10B981',
  colorBadgePersonalizado: '#F59E0B',
  colorBadgeMasVendido: '#EF4444',
  colorUnidadSeleccionada: '#10B981',
  bordeBoton: 25,
  bordeUnidad: 8,
  tamanoEtiqueta: '16px',
  tamanoPrecio: '18px',
  tamanoSubtitulo: '14px',
  efectoBoton: 'sin-efecto' as 'sin-efecto' | 'zoom',
  pulsante: true,
};

export default function BundlePromocionesEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();
  const [config, setConfig] = useState<any>({
    ...DEFAULT_CONFIG,
    ...(existingWidget?.config || {}),
  });
  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilo'>('general');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!existingWidget;

  const update = (patch: Partial<any>) => setConfig((prev: any) => ({ ...prev, ...patch }));

  const togglePromocion = (promo: string) => {
    const current: string[] = config.promociones || [];
    const configPromos = { ...(config.configPromos || {}) };
    let next: string[];
    if (current.includes(promo)) {
      next = current.filter((p) => p !== promo);
      delete configPromos[promo];
    } else {
      next = [...current, promo];
      configPromos[promo] = { ...DEFAULT_PROMO_CONFIG };
    }
    update({ promociones: next, configPromos });
  };

  const updatePromoConfig = (promo: string, patch: Partial<any>) => {
    const configPromos = { ...(config.configPromos || {}) };
    configPromos[promo] = { ...(configPromos[promo] || DEFAULT_PROMO_CONFIG), ...patch };
    update({ configPromos });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: widgetDefinition.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar');
      }

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) {
          params.set('product', String(productId));
        }
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
      setSaving(false);
    }
  };

  const scopeLabel = targetType === 'all' ? 'General' : 'Producto';
  const titulo = isEditing
    ? `Editar widget: ${widgetDefinition.name} (${scopeLabel})`
    : `Nuevo widget: ${widgetDefinition.name} (${scopeLabel})`;

  const promosOrdenadas = useMemo(() => {
    const orden = ['lleva-1', ...(config.promociones || [])];
    return orden;
  }, [config.promociones]);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', color: '#000000' }}>
      <Header />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 16px 80px' }}>
        {targetType === 'all' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#10B981',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            <IconStore /> Todos los productos
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              color: '#000000',
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span> NEVUX Widget
          </div>
        )}

        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.25, color: '#000000' }}>
          {titulo}
        </h1>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <BundlePromocionesPreview config={config} />

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#000000',
              padding: '12px 14px',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.5,
              margin: '12px 0 20px',
            }}
          >
            <IconInfo /> El formulario original de Tiendanube permanecerá visible y funcional.
          </div>

          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 20 }}>
              <div>
                <FieldLabel>Título</FieldLabel>
                <TextInput
                  value={config.titulo || ''}
                  onChange={(v) => update({ titulo: v })}
                  placeholder="Ej: Promoción especial"
                />
                <FieldHelper>Dejá vacío para no mostrar título</FieldHelper>
              </div>

              <div>
                <FieldLabel>Texto del botón</FieldLabel>
                <TextInput
                  value={config.textoBoton || ''}
                  onChange={(v) => update({ textoBoton: v })}
                  placeholder="Agregar al carrito"
                />
                <FieldHelper>Dejá vacío para usar "Agregar al carrito"</FieldHelper>
              </div>

              <div>
                <FieldLabel>Seleccionar promociones</FieldLabel>
                <FieldHelper>
                  Seleccioná los tipos de promoción que querés ofrecer (recordá crearlos en el
                  panel de "Descuentos" -&gt; "Promociones" de Tiendanube)
                </FieldHelper>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  {PROMOS_DISPONIBLES.map((p) => (
                    <CheckboxSmall
                      key={p}
                      label={p}
                      checked={(config.promociones || []).includes(p)}
                      onChange={() => togglePromocion(p)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Configuración por promoción</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
                  {promosOrdenadas.map((promoKey) => {
                    const isBase = promoKey === 'lleva-1';
                    const promoTitle = isBase
                      ? 'Lleva 1'
                      : `Lleva ${parseInt(promoKey.split('x')[0], 10)}, paga ${parseInt(
                          promoKey.split('x')[1],
                          10
                        )} (${promoKey})`;
                    const pc =
                      config.configPromos?.[promoKey] || { ...DEFAULT_PROMO_CONFIG };

                    return (
                      <div
                        key={promoKey}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: 12,
                          padding: 16,
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: 12, color: '#000000', fontSize: 16 }}>{promoTitle}</div>

                        <div style={{ marginBottom: 12 }}>
                          <FieldLabel small>Formato de etiqueta</FieldLabel>
                          <SelectField
                            value={pc.formatoEtiqueta || 'lleva-paga'}
                            onChange={(v) =>
                              updatePromoConfig(promoKey, { formatoEtiqueta: v })
                            }
                            options={[
                              { value: 'lleva-paga', label: 'Lleva # paga #' },
                              { value: 'llevate-x', label: 'Llevate # unidades' },
                              { value: 'descuento', label: '# de descuento' },
                            ]}
                          />
                        </div>

                        <div style={{ marginBottom: 12 }}>
                          <FieldLabel small>Subtítulo</FieldLabel>
                          <TextInput
                            value={pc.subtitulo || ''}
                            onChange={(v) => updatePromoConfig(promoKey, { subtitulo: v })}
                            placeholder="Ej: Oferta por tiempo limitado"
                          />
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <FieldLabel small>Badges</FieldLabel>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                              marginTop: 8,
                            }}
                          >
                            <CheckboxRow
                              label="Envío gratis"
                              checked={!!pc.badgeEnvioGratis}
                              onChange={(v) =>
                                updatePromoConfig(promoKey, { badgeEnvioGratis: v })
                              }
                            />
                            <CheckboxRow
                              label="Más vendido"
                              checked={!!pc.badgeMasVendido}
                              onChange={(v) =>
                                updatePromoConfig(promoKey, { badgeMasVendido: v })
                              }
                            />
                            <CheckboxRow
                              label="Personalizado"
                              checked={!!pc.badgePersonalizado}
                              onChange={(v) =>
                                updatePromoConfig(promoKey, { badgePersonalizado: v })
                              }
                            />
                          </div>
                        </div>

                        <Divider />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <CheckboxRow
                            label="Ocultar producto complementario 1 en esta unidad"
                            checked={!!pc.ocultarComp1}
                            onChange={(v) => updatePromoConfig(promoKey, { ocultarComp1: v })}
                          />
                          <CheckboxRow
                            label="Ocultar producto complementario 2 en esta unidad"
                            checked={!!pc.ocultarComp2}
                            onChange={(v) => updatePromoConfig(promoKey, { ocultarComp2: v })}
                          />
                        </div>

                        <Divider />

                        <CheckboxRow
                          label="Agregar producto de regalo en esta promoción"
                          checked={!!pc.agregarRegalo}
                          onChange={(v) => updatePromoConfig(promoKey, { agregarRegalo: v })}
                        />

                        <Divider />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <CheckboxRow
                            label="Marcar por defecto"
                            checked={!!pc.marcarPorDefecto}
                            onChange={(v) =>
                              updatePromoConfig(promoKey, { marcarPorDefecto: v })
                            }
                          />
                          {isBase && (
                            <CheckboxRow
                              label="Ocultar esta unidad"
                              checked={!!pc.ocultarEsta}
                              onChange={(v) =>
                                updatePromoConfig(promoKey, { ocultarEsta: v })
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel>Productos complementarios</FieldLabel>
                <FieldHelper>
                  Se mostrarán debajo de cada tarjeta con un checkbox (máx. 2)
                </FieldHelper>

                <div style={{ marginTop: 12 }}>
                  <FieldLabel small>Producto 1</FieldLabel>
                  <TextInput
                    value={config.producto1 || ''}
                    onChange={(v) => update({ producto1: v })}
                    placeholder="Buscar un producto..."
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <FieldLabel small>Producto 2</FieldLabel>
                  <TextInput
                    value={config.producto2 || ''}
                    onChange={(v) => update({ producto2: v })}
                    placeholder="Buscar un producto..."
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <CheckboxRow
                    label="Marcar como checkeado por defecto"
                    checked={!!config.productosCheckedDefault}
                    onChange={(v) => update({ productosCheckedDefault: v })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ubicacion' && (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  background: config.reemplazarBoton ? '#ecfdf5' : '#ffffff',
                  border: config.reemplazarBoton ? '1.5px solid #10B981' : '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  transition: 'border-color 0.2s',
                }}
              >
                <div
                  onClick={() => update({ reemplazarBoton: !config.reemplazarBoton })}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    background: config.reemplazarBoton ? '#10B981' : '#ffffff',
                    border: config.reemplazarBoton ? '2px solid #10B981' : '2px solid #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {config.reemplazarBoton && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#000000' }}>
                    Reemplazar por el botón de agregar al carrito de Tiendanube
                  </div>
                  <div style={{ color: '#000000', opacity: 0.6, fontSize: 13, lineHeight: 1.5 }}>
                    Cuando está activo, el widget reemplaza el formulario original de Tiendanube.
                    Al desactivarlo, el formulario original permanece visible y funcional.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estilo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
              <SectionCard
                icon="🎨"
                title="Colores principales"
                subtitle="Definí la paleta del bloque principal y del botón de compra."
              >
                <ColorPickerField
                  label='Color del botón "Agregar"'
                  value={config.colorBoton}
                  onChange={(v) => update({ colorBoton: v })}
                />
                <ToggleField
                  label="Fondo en degradé"
                  checked={!!config.fondoDegrade}
                  onChange={(v) => update({ fondoDegrade: v })}
                />
                <ColorPickerField
                  label="Color del precio"
                  value={config.colorPrecio}
                  onChange={(v) => update({ colorPrecio: v })}
                />
                <ColorPickerField
                  label="Color de subtítulos"
                  value={config.colorSubtitulos}
                  onChange={(v) => update({ colorSubtitulos: v })}
                />
                <ColorPickerField
                  label="Fondo del subtítulo"
                  value={config.fondoSubtitulo}
                  onChange={(v) => update({ fondoSubtitulo: v })}
                  allowTransparent
                />
                <ColorPickerField
                  label="Color texto regalo"
                  value={config.colorTextoRegalo}
                  onChange={(v) => update({ colorTextoRegalo: v })}
                />
                <ColorPickerField
                  label="Color precio regalo"
                  value={config.colorPrecioRegalo}
                  onChange={(v) => update({ colorPrecioRegalo: v })}
                />
                <ColorPickerField
                  label="Fondo del regalo"
                  value={config.fondoRegalo}
                  onChange={(v) => update({ fondoRegalo: v })}
                />
              </SectionCard>

              <SectionCard
                icon="🏷"
                title="Badges y etiquetas"
                subtitle="Personalizá los colores de destacados y estado seleccionado."
              >
                <ColorPickerField
                  label="Color badge envío gratis"
                  value={config.colorBadgeEnvio}
                  onChange={(v) => update({ colorBadgeEnvio: v })}
                />
                <ColorPickerField
                  label="Color badge personalizado"
                  value={config.colorBadgePersonalizado}
                  onChange={(v) => update({ colorBadgePersonalizado: v })}
                />
                <ColorPickerField
                  label="Color badge más vendido"
                  value={config.colorBadgeMasVendido}
                  onChange={(v) => update({ colorBadgeMasVendido: v })}
                />
                <ColorPickerField
                  label="Color de la unidad seleccionada"
                  value={config.colorUnidadSeleccionada}
                  onChange={(v) => update({ colorUnidadSeleccionada: v })}
                />
              </SectionCard>

              <SectionCard
                icon="🧩"
                title="Estructura y bordes"
                subtitle="Ajustá el redondeado del botón y de cada unidad."
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <RangeSlider
                    label={'Borde del botón "Agregar"'}
                    value={config.bordeBoton ?? 25}
                    onChange={(v) => update({ bordeBoton: v })}
                    min={0}
                    max={25}
                  />
                  <RangeSlider
                    label="Borde de la unidad"
                    value={config.bordeUnidad ?? 8}
                    onChange={(v) => update({ bordeUnidad: v })}
                    min={0}
                    max={25}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon="T"
                title="Tipografía"
                subtitle="Definí el tamaño de texto para etiqueta, precio y subtítulo."
              >
                <SelectField
                  label="Etiqueta"
                  value={config.tamanoEtiqueta || '16px'}
                  onChange={(v) => update({ tamanoEtiqueta: v })}
                  options={['12px', '14px', '16px', '18px', '20px', '24px'].map((s) => ({
                    value: s,
                    label: s,
                  }))}
                />
                <SelectField
                  label="Precio"
                  value={config.tamanoPrecio || '18px'}
                  onChange={(v) => update({ tamanoPrecio: v })}
                  options={['12px', '14px', '16px', '18px', '20px', '24px'].map((s) => ({
                    value: s,
                    label: s,
                  }))}
                />
                <SelectField
                  label="Subtítulo"
                  value={config.tamanoSubtitulo || '14px'}
                  onChange={(v) => update({ tamanoSubtitulo: v })}
                  options={['12px', '14px', '16px', '18px', '20px', '24px'].map((s) => ({
                    value: s,
                    label: s,
                  }))}
                />
              </SectionCard>

              <SectionCard
                icon="✨"
                title="Efectos y animaciones"
                subtitle="Elegí cómo se comporta visualmente el botón al interactuar."
              >
                <FieldLabel>Efecto del botón</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <RadioBox
                    label="Sin efecto"
                    selected={config.efectoBoton === 'sin-efecto'}
                    onClick={() => update({ efectoBoton: 'sin-efecto' })}
                  />
                  <RadioBox
                    label="Zoom al cursor"
                    selected={config.efectoBoton === 'zoom'}
                    onClick={() => update({ efectoBoton: 'zoom' })}
                  />
                </div>

                <div
                  style={{
                    marginTop: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: '#ffffff',
                  }}
                >
                  <Toggle
                    checked={!!config.pulsante}
                    onChange={(v) => update({ pulsante: v })}
                  />
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#000000' }}>Pulsante</div>
                </div>
              </SectionCard>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #e5e7eb',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle checked={isActive} onChange={setIsActive} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#000000' }}>Widget activo</span>
              <IconInfoSmall />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                background: '#10B981',
                color: '#ffffff',
                border: 'none',
                borderRadius: 999,
                padding: '12px 28px',
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
              }}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA OFICIAL UNIFICADO */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </div>

      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            fontSize: 14,
            fontWeight: 600,
            zIndex: 100,
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

/* ---------- COMPONENTES REUTILIZABLES ---------- */

function Header() {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <NevuxLogo size="medium" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13,
            color: '#ffffff',
          }}
        >
          RL
        </div>
      </div>
    </div>
  );
}

function Tabs({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (t: 'general' | 'ubicacion' | 'estilo') => void;
}) {
  const tabs: { key: 'general' | 'ubicacion' | 'estilo'; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'estilo', label: 'Estilo' },
  ];
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            padding: '14px 8px',
            fontSize: 15,
            fontWeight: activeTab === t.key ? 700 : 500,
            color: activeTab === t.key ? '#10B981' : '#000000',
            opacity: activeTab === t.key ? 1 : 0.6,
            borderBottom:
              activeTab === t.key ? '2px solid #10B981' : '2px solid transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <div
      style={{
        fontSize: small ? 14 : 15,
        fontWeight: 700,
        color: '#000000',
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        border: '1.5px solid #e5e7eb',
        borderRadius: 10,
        padding: '12px 14px',
        fontSize: 15,
        color: '#000000',
        background: '#ffffff',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function CheckboxSmall({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 600,
        color: '#000000',
      }}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          onChange();
        }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: checked ? '2px solid #10B981' : '2px solid #d1d5db',
          background: checked ? '#10B981' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l5 5L20 7"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label}
    </label>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        cursor: 'pointer',
        fontSize: 14,
        color: '#000000',
        fontWeight: 500,
      }}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: checked ? '2px solid #10B981' : '2px solid #d1d5db',
          background: checked ? '#10B981' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
          transition: 'all 0.2s',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l5 5L20 7"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span style={{ lineHeight: 1.4 }}>{label}</span>
    </label>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#e5e7eb', margin: '14px 0' }} />;
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#000000', marginBottom: 4 }}>{title}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#000000',
            opacity: 0.6,
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: '#10B981', fontSize: 15 }}>{icon}</span>
          <span>{subtitle}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  );
}

function ColorPickerField({
  label,
  value,
  onChange,
  allowTransparent,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  allowTransparent?: boolean;
}) {
  const isTransparent = value === 'transparent' || !value;
  const displayValue = isTransparent ? '' : value;

  return (
    <div>
      <FieldLabel small>{label}</FieldLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <input
            type="color"
            value={isTransparent ? '#ffffff' : value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 44,
              height: 40,
              border: '1.5px solid #e5e7eb',
              borderRadius: 8,
              cursor: 'pointer',
              padding: 2,
              background: isTransparent ? '#ffffff' : value,
            }}
          />
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={allowTransparent ? 'Transparente' : ''}
          style={{
            flex: 1,
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 13,
            color: '#000000',
            background: '#ffffff',
            outline: 'none',
            fontFamily: 'monospace',
          }}
        />
        {allowTransparent && !isTransparent && (
          <button
            type="button"
            onClick={() => onChange('transparent')}
            style={{
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              width: 34,
              height: 34,
              cursor: 'pointer',
              fontSize: 14,
              color: '#000000',
              opacity: 0.6,
            }}
            title="Transparente"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Toggle checked={checked} onChange={onChange} />
      <span style={{ fontSize: 15, fontWeight: 600, color: '#000000' }}>{label}</span>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        background: checked ? '#10B981' : '#d1d5db',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.25s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#ffffff',
          transition: 'left 0.25s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      {label && <FieldLabel small>{label}</FieldLabel>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          border: '1.5px solid #e5e7eb',
          borderRadius: 10,
          padding: '12px 14px',
          fontSize: 15,
          background: '#ffffff',
          color: '#000000',
          outline: 'none',
          appearance: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          fontFamily: 'inherit',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function RangeSlider({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <FieldLabel small>{label}</FieldLabel>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#000000',
          opacity: 0.6,
          marginTop: 4,
        }}
      >
        <span>{min}px</span>
        <span>{value}px</span>
        <span>{max}px</span>
      </div>
    </div>
  );
}

function RadioBox({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: selected ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
        background: selected ? '#ecfdf5' : '#ffffff',
        borderRadius: 12,
        padding: '14px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        color: '#000000',
        fontSize: 15,
        fontWeight: 600,
        textAlign: 'left',
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: selected ? '6px solid #10B981' : '2px solid #d1d5db',
          background: '#ffffff',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      />
      <span>{label}</span>
    </button>
  );
}

function IconStore() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
      <path
        d="M3 9l1-5h16l1 5M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M9 22V12h6v10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function IconInfoSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
  }
