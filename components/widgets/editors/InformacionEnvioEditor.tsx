'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

type TabType = 'general' | 'ubicacion' | 'estilos' | 'fechas';

interface ShippingZone {
  id: string;
  name: string;
  dispatchDays: number | string;
  deliveryDays: number | string;
}

interface InformacionEnvioEditorProps {
  widgetDefinition?: any;
  existingWidget?: any;
  storeId?: string | number;
  initialConfig?: any;
  widgetId?: string;
  targetType?: 'product' | 'all' | 'category';
  targetProductId?: string | number | null;
  productId?: string | number | null;
  categoryId?: string | number | null;
  onSave?: (config: any) => Promise<void>;
  isSaving?: boolean;
}

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; badgeBg: string; badgeText: string }> = {
  'black-friday': { bg: '#111827', text: '#F59E0B', border: '#D97706', badgeBg: '#F59E0B', badgeText: '#111827' },
  'hot-sale': { bg: '#FFF5F5', text: '#B91C1C', border: '#EF4444', badgeBg: '#EF4444', badgeText: '#ffffff' },
  'cyber-monday': { bg: '#EFF6FF', text: '#1D4ED8', border: '#3B82F6', badgeBg: '#3B82F6', badgeText: '#ffffff' },
  'navidad': { bg: '#ECFDF5', text: '#064E3B', border: '#10B981', badgeBg: '#047857', badgeText: '#ffffff' },
  'san-valentin': { bg: '#FDF2F8', text: '#831843', border: '#EC4899', badgeBg: '#BE185D', badgeText: '#ffffff' },
  'dia-padre-madre': { bg: '#EEF2FF', text: '#312E81', border: '#6366F1', badgeBg: '#4338CA', badgeText: '#ffffff' },
  'liquidacion': { bg: '#FEF2F2', text: '#7F1D1D', border: '#DC2626', badgeBg: '#991B1B', badgeText: '#ffffff' }
};

const PRESET_LABELS: Record<string, string> = {
  'black-friday': 'Black Friday',
  'hot-sale': 'Hot Sale',
  'cyber-monday': 'Cyber Monday',
  'navidad': 'Navidad & Reyes',
  'san-valentin': 'San Valentín',
  'dia-padre-madre': 'Día Madre/Padre',
  'liquidacion': 'Liquidación'
};

export default function InformacionEnvioEditor({
  widgetDefinition,
  existingWidget,
  storeId,
  initialConfig,
  widgetId,
  targetType = 'all',
  targetProductId,
  productId,
  categoryId,
  onSave,
  isSaving = false,
}: InformacionEnvioEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const [title, setTitle] = useState(cfg.title || 'Información de envío');

  const [zones, setZones] = useState<ShippingZone[]>(
    Array.isArray(cfg.zones) && cfg.zones.length > 0
      ? cfg.zones
      : [
          { id: 'zone-1', name: 'AMBA', dispatchDays: 1, deliveryDays: 1 },
          { id: 'zone-2', name: 'Resto del país', dispatchDays: 1, deliveryDays: 3 }
        ]
  );

  const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);

  const [cutoffTime, setCutoffTime] = useState(cfg.cutoffTime || '18:00');
  const [showCutoffBadge, setShowCutoffBadge] = useState(cfg.showCutoffBadge !== false);
  const [showDateRange, setShowDateRange] = useState(cfg.showDateRange !== false);
  const [showApproxNote, setShowApproxNote] = useState(cfg.showApproxNote !== false);
  const [skipSaturdays, setSkipSaturdays] = useState(cfg.skipSaturdays !== false);
  const [iconType, setIconType] = useState<'emoji' | 'svg'>(cfg.iconType || 'emoji');

  const [position, setPosition] = useState(cfg.position || 'before-description');

  const [bgColor, setBgColor] = useState(cfg.bgColor || '#d9f5e4');
  const [textColor, setTextColor] = useState(cfg.textColor || '#1f6b4e');
  const [badgeBgColor, setBadgeBgColor] = useState(cfg.badgeBgColor || '#dc3545');
  const [badgeTextColor, setBadgeTextColor] = useState(cfg.badgeTextColor || '#ffffff');
  const [titleColor, setTitleColor] = useState(cfg.titleColor || '#191919');

  const [showBorder, setShowBorder] = useState(cfg.showBorder !== false);
  const [borderColor, setBorderColor] = useState(cfg.borderColor || '#a7f3d0');

  const [labelSize, setLabelSize] = useState(typeof cfg.labelSize === 'number' ? cfg.labelSize : 14);
  const [daySize, setDaySize] = useState(typeof cfg.daySize === 'number' ? cfg.daySize : 13);
  const [titleSize, setTitleSize] = useState(typeof cfg.titleSize === 'number' ? cfg.titleSize : 22);

  const [borderRadius, setBorderRadius] = useState(typeof cfg.borderRadius === 'number' ? cfg.borderRadius : 16);
  const [padding, setPadding] = useState(typeof cfg.padding === 'number' ? cfg.padding : 20);
  const [marginTop, setMarginTop] = useState(typeof cfg.marginTop === 'number' ? cfg.marginTop : 16);
  const [marginBottom, setMarginBottom] = useState(typeof cfg.marginBottom === 'number' ? cfg.marginBottom : 16);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);

  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const handleAddZone = function () {
    if (zones.length >= 5) {
      alert('Máximo 5 zonas permitidas.');
      return;
    }
    var nextNum = zones.length + 1;
    var newZone: ShippingZone = {
      id: 'zone-' + Date.now(),
      name: 'Zona ' + nextNum,
      dispatchDays: 1,
      deliveryDays: 2
    };
    setZones(function (prev) { return [...prev, newZone]; });
    setSelectedZoneIdx(zones.length);
  };

  const handleRemoveZone = function (idx: number) {
    if (zones.length <= 1) {
      alert('Debes mantener al menos 1 zona de envío.');
      return;
    }
    setZones(function (prev) {
      return prev.filter(function (_, i) { return i !== idx; });
    });
    if (selectedZoneIdx >= zones.length - 1) {
      setSelectedZoneIdx(Math.max(0, zones.length - 2));
    }
  };

  const handleZoneChange = function (idx: number, field: keyof ShippingZone, value: any) {
    setZones(function (prev) {
      var updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTextColor(th.text);
      setBorderColor(th.border);
      setBadgeBgColor(th.badgeBg);
      setBadgeTextColor(th.badgeText);
      setTitleColor(th.text);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async function () {
    if (zones.length === 0) {
      alert('Agregá al menos una zona de envío para guardar.');
      return;
    }

    var cleanedZones = zones.map(function (z) {
      var disp = z.dispatchDays === '' ? 0 : parseInt(String(z.dispatchDays), 10);
      var deliv = z.deliveryDays === '' ? 0 : parseInt(String(z.deliveryDays), 10);
      return {
        id: z.id,
        name: z.name,
        dispatchDays: isNaN(disp) ? 0 : disp,
        deliveryDays: isNaN(deliv) ? 0 : deliv
      };
    });

    var configData = {
      title: title,
      zones: cleanedZones,
      cutoffTime: cutoffTime,
      showCutoffBadge: showCutoffBadge,
      showDateRange: showDateRange,
      showApproxNote: showApproxNote,
      skipSaturdays: skipSaturdays,
      iconType: iconType,
      position: position,
      bgColor: bgColor,
      textColor: textColor,
      badgeBgColor: badgeBgColor,
      badgeTextColor: badgeTextColor,
      titleColor: titleColor,
      showBorder: showBorder,
      borderColor: borderColor,
      labelSize: labelSize,
      daySize: daySize,
      titleSize: titleSize,
      borderRadius: borderRadius,
      padding: padding,
      marginTop: marginTop,
      marginBottom: marginBottom,
      campaignTheme: campaignTheme,
      ...(categoryId ? { category_id: String(categoryId) } : {}),
    };

    var finalTargetType = effectiveTargetType;
    var finalProductId = productId || targetProductId || existingWidget?.target_product_id || null;
    var finalCategoryId = categoryId || existingWidget?.target_category_id || null;

    if (onSave) {
      await onSave({
        config: configData,
        target_type: finalTargetType,
        target_product_id: finalProductId,
        target_category_id: finalCategoryId,
        is_active: isActive,
      });
      window.location.href = '/widgets';
      return;
    }

    setIsSavingInternal(true);
    try {
      var res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id || undefined,
          store_id: storeId ? String(storeId) : undefined,
          widget_slug: 'informacion-envio',
          config: configData,
          is_active: isActive,
          target_type: finalTargetType,
          target_product_id: finalProductId ? String(finalProductId) : null,
          target_category_id: finalCategoryId ? String(finalCategoryId) : null,
        }),
      });

      if (!res.ok) {
        var errData = await res.json().catch(function () { return {}; });
        throw new Error(errData.error || 'Error al guardar el widget');
      }

      window.location.href = '/widgets';
    } catch (err: any) {
      alert('Error al guardar: ' + (err.message || 'Error desconocido'));
      setIsSavingInternal(false);
    }
  };

  const saving = isSaving || isSavingInternal;
  const currentZone = zones[selectedZoneIdx] || zones[0] || { name: 'AMBA', dispatchDays: 1, deliveryDays: 1 };

  const currentDispatchDays = currentZone.dispatchDays === '' ? 0 : parseInt(String(currentZone.dispatchDays), 10) || 0;
  const currentDeliveryDays = currentZone.deliveryDays === '' ? 0 : parseInt(String(currentZone.deliveryDays), 10) || 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* HEADER STICKY NEVUX */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', borderBottom: '1px solid #E5E7EB', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <NevuxLogo size="medium" />
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '13px', fontWeight: 800 }}>
          RL
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '999px',
          backgroundColor: isCategory ? '#FEF3C7' : isForAll ? '#D1FAE5' : '#E0E7FF',
          color: isCategory ? '#D97706' : isForAll ? '#059669' : '#3730A3',
          border: '1px solid ' + (isCategory ? '#FCD34D' : isForAll ? '#6EE7B7' : '#A5B4FC')
        }}>
          {isCategory ? '🏷️' : isForAll ? '🏪' : '📦'} {scopeLabel}
        </span>
      </div>

      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
        Nuevo widget: Información de envío ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Información de envío por zonas:</strong> Informá a tus clientes cuándo se despacha y cuándo reciben su pedido según su ubicación.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO
        </div>

        {title ? (
          <div style={{ fontSize: titleSize + 'px', fontWeight: 800, color: titleColor, textAlign: 'center', marginBottom: '12px' }}>
            {title}
          </div>
        ) : null}

        <div style={{
          backgroundColor: bgColor,
          borderRadius: borderRadius + 'px',
          padding: padding + 'px',
          maxWidth: '520px',
          margin: '0 auto',
          border: showBorder ? '1.5px solid ' + borderColor : 'none',
          marginTop: marginTop + 'px',
          marginBottom: marginBottom + 'px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          {/* TABS DE ZONAS (Si hay más de 1) */}
          {zones.length > 1 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {zones.map(function (z, idx) {
                var isSel = idx === selectedZoneIdx;
                return (
                  <button
                    key={z.id || idx}
                    type="button"
                    onClick={function () { setSelectedZoneIdx(idx); }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      border: '1px solid ' + (isSel ? textColor : 'transparent'),
                      backgroundColor: isSel ? textColor : 'rgba(255,255,255,0.6)',
                      color: isSel ? bgColor : textColor,
                      cursor: 'pointer'
                    }}
                  >
                    {z.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* LÍNEA DE TIEMPO DE PASOS DE ENVÍO */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', position: 'relative', textAlign: 'center' }}>
            
            {/* PASO 1: COMPRA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '20px' }}>{iconType === 'emoji' ? '📦' : '📦'}</span>
              <span style={{ fontSize: labelSize + 'px', fontWeight: 800, color: textColor }}>Compra</span>
              <span style={{ fontSize: daySize + 'px', fontWeight: 700, color: textColor, opacity: 0.9 }}>Hoy</span>
              {showCutoffBadge && (
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  backgroundColor: badgeBgColor,
                  color: badgeTextColor,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginTop: '2px'
                }}>
                  ANTES DE LAS {cutoffTime}
                </span>
              )}
            </div>

            {/* SEPARADOR 1 */}
            <div style={{ width: '24px', height: '2px', backgroundColor: textColor, opacity: 0.4, borderRadius: '2px' }} />

            {/* PASO 2: ENVÍO */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '20px' }}>{iconType === 'emoji' ? '🚚' : '🚚'}</span>
              <span style={{ fontSize: labelSize + 'px', fontWeight: 800, color: textColor }}>Envío</span>
              <span style={{ fontSize: daySize + 'px', fontWeight: 700, color: textColor, opacity: 0.9 }}>
                {currentDispatchDays === 0 ? 'Hoy' : currentDispatchDays === 1 ? 'Mañana' : 'En ' + currentDispatchDays + ' días'}
              </span>
            </div>

            {/* SEPARADOR 2 */}
            <div style={{ width: '24px', height: '2px', backgroundColor: textColor, opacity: 0.4, borderRadius: '2px' }} />

            {/* PASO 3: ENTREGA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '20px' }}>{iconType === 'emoji' ? '📍' : '📍'}</span>
              <span style={{ fontSize: labelSize + 'px', fontWeight: 800, color: textColor }}>Entrega</span>
              <span style={{ fontSize: daySize + 'px', fontWeight: 700, color: textColor, opacity: 0.9 }}>
                {showDateRange ? 'Entre 2 y 3 días' : 'En ' + (currentDispatchDays + currentDeliveryDays) + ' días'}
              </span>
            </div>

          </div>

          {showApproxNote && (
            <div style={{ fontSize: '10px', color: textColor, textAlign: 'center', marginTop: '12px', opacity: 0.75 }}>
              ⓘ Las fechas mostradas son estimaciones aproximadas.
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '🚚 General & Tiempos' },
          { id: 'ubicacion', label: '📍 Ubicación' },
          { id: 'estilos', label: '🎨 Estilos & Colores' },
          { id: 'fechas', label: '🔥 Fechas Especiales' }
        ].map(function (tab) {
          var active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () { setActiveTab(tab.id as TabType); }}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                borderBottom: active ? '3px solid #10B981' : '3px solid transparent',
                color: active ? '#10B981' : '#6B7280'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB GENERAL */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              Título del recuadro (opcional)
            </div>
            <input
              type="text"
              value={title}
              onChange={function (e) { setTitle(e.target.value); }}
              placeholder="Ej: Información de envío"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
              Se muestra por encima del recuadro de envío. Si lo dejás vacío, no se muestra.
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                Secciones / Zonas de envío ({zones.length}/5)
              </div>
              <button
                type="button"
                onClick={handleAddZone}
                disabled={zones.length >= 5}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: zones.length >= 5 ? 'not-allowed' : 'pointer',
                  opacity: zones.length >= 5 ? 0.5 : 1
                }}
              >
                + Agregar zona
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {zones.map(function (zone, idx) {
                return (
                  <div key={zone.id || idx} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>
                        Zona #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={function () { handleRemoveZone(idx); }}
                        style={{ border: '1px solid #FCA5A5', borderRadius: '4px', padding: '2px 8px', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                      >
                        Eliminar
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                          Nombre de la zona
                        </label>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={function (e) { handleZoneChange(idx, 'name', e.target.value); }}
                          placeholder="Ej: AMBA"
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                          Días hasta el envío
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={15}
                          value={zone.dispatchDays}
                          onChange={function (e) {
                            var val = e.target.value;
                            handleZoneChange(idx, 'dispatchDays', val === '' ? '' : parseInt(val, 10));
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                          Días para la entrega
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={zone.deliveryDays}
                          onChange={function (e) {
                            var val = e.target.value;
                            handleZoneChange(idx, 'deliveryDays', val === '' ? '' : parseInt(val, 10));
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
              Opciones de despacho y formato
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Hora de corte para despacho hoy
              </label>
              <input
                type="text"
                value={cutoffTime}
                onChange={function (e) { setCutoffTime(e.target.value); }}
                placeholder="18:00"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
              />
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Si la visita es después de esta hora, el despacho se calculará para el día siguiente.
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#374151' }}>
              <input
                type="checkbox"
                checked={showCutoffBadge}
                onChange={function (e) { setShowCutoffBadge(e.target.checked); }}
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
              />
              Mostrar hora límite de compra (Badge &quot;ANTES DE LAS {cutoffTime}&quot;)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#374151' }}>
              <input
                type="checkbox"
                checked={showDateRange}
                onChange={function (e) { setShowDateRange(e.target.checked); }}
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
              />
              Mostrar rango de fechas para entrega (ej. &quot;Entre 11 y 12 oct&quot;)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#374151' }}>
              <input
                type="checkbox"
                checked={showApproxNote}
                onChange={function (e) { setShowApproxNote(e.target.checked); }}
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
              />
              Mostrar mensaje de &quot;Fechas aproximadas&quot;
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#374151' }}>
              <input
                type="checkbox"
                checked={skipSaturdays}
                onChange={function (e) { setSkipSaturdays(e.target.checked); }}
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
              />
              No despachar los sábados (se pasa automáticamente al lunes)
            </label>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={function (e) { setIsActive(e.target.checked); }}
              style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
            />
            Widget activo
          </label>
        </div>
      )}

      {/* TAB UBICACIÓN */}
      {activeTab === 'ubicacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
            Posición del widget en la ficha del producto
          </div>

          <label
            style={{
              display: 'block',
              padding: '14px 16px',
              borderRadius: '12px',
              border: position === 'before-description' ? '2px solid #10B981' : '1px solid #E5E7EB',
              backgroundColor: position === 'before-description' ? '#ECFDF5' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                type="radio"
                name="pos"
                checked={position === 'before-description'}
                onChange={function () { setPosition('before-description'); }}
                style={{ marginTop: '3px', accentColor: '#10B981' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Antes de la descripción</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', lineHeight: 1.4 }}>
                  El widget aparece justo debajo del botón &quot;Agregar al carrito&quot; (arriba de la descripción).
                </div>
              </div>
            </div>
          </label>

          <label
            style={{
              display: 'block',
              padding: '14px 16px',
              borderRadius: '12px',
              border: position === 'after-description' ? '2px solid #10B981' : '1px solid #E5E7EB',
              backgroundColor: position === 'after-description' ? '#ECFDF5' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                type="radio"
                name="pos"
                checked={position === 'after-description'}
                onChange={function () { setPosition('after-description'); }}
                style={{ marginTop: '3px', accentColor: '#10B981' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Después de la descripción</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', lineHeight: 1.4 }}>
                  El widget se muestra después de toda la sección del producto, a ancho completo.
                </div>
              </div>
            </div>
          </label>

          <label
            style={{
              display: 'block',
              padding: '14px 16px',
              borderRadius: '12px',
              border: position === 'after-price' ? '2px solid #10B981' : '1px solid #E5E7EB',
              backgroundColor: position === 'after-price' ? '#ECFDF5' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                type="radio"
                name="pos"
                checked={position === 'after-price'}
                onChange={function () { setPosition('after-price'); }}
                style={{ marginTop: '3px', accentColor: '#10B981' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Después del precio</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', lineHeight: 1.4 }}>
                  El widget se inserta dentro de la ficha del producto, justo debajo del bloque de precio.
                </div>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === 'estilos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
              🎨 Colores Principales
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Color de fondo
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Color de texto
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={function (e) { handleColorChange(setTextColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={function (e) { handleColorChange(setTextColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Color fondo badge hora límite
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={badgeBgColor}
                    onChange={function (e) { handleColorChange(setBadgeBgColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeBgColor}
                    onChange={function (e) { handleColorChange(setBadgeBgColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Color texto badge hora límite
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={badgeTextColor}
                    onChange={function (e) { handleColorChange(setBadgeTextColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeTextColor}
                    onChange={function (e) { handleColorChange(setBadgeTextColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: showBorder ? '10px' : '0px' }}>
                <input
                  type="checkbox"
                  checked={showBorder}
                  onChange={function (e) { setShowBorder(e.target.checked); }}
                  style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
                />
                Activar borde en la caja
              </label>

              {showBorder && (
                <div style={{ maxWidth: '300px', marginTop: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Color del borde
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={borderColor}
                      onChange={function (e) { handleColorChange(setBorderColor, e.target.value); }}
                      style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                    />
                    <input
                      type="text"
                      value={borderColor}
                      onChange={function (e) { handleColorChange(setBorderColor, e.target.value); }}
                      style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📐 Tamaños de Letra & Diseño
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Tamaño de etiquetas: {labelSize}px
                </label>
                <input
                  type="range"
                  min={11}
                  max={18}
                  step={1}
                  value={labelSize}
                  onChange={function (e) { setLabelSize(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Tamaño del texto de días: {daySize}px
                </label>
                <input
                  type="range"
                  min={11}
                  max={18}
                  step={1}
                  value={daySize}
                  onChange={function (e) { setDaySize(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Bordes redondeados: {borderRadius}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={borderRadius}
                  onChange={function (e) { setBorderRadius(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Padding interno: {padding}px
                </label>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={2}
                  value={padding}
                  onChange={function (e) { setPadding(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Margen superior: {marginTop}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={marginTop}
                  onChange={function (e) { setMarginTop(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Margen inferior: {marginBottom}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={marginBottom}
                  onChange={function (e) { setMarginBottom(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === 'fechas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '14px 16px', fontSize: '13px', color: '#92400E' }}>
            🔥 Elegí un preset de campaña. Se aplican colores automáticamente a las zonas de envío y badges.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={function () { applyPresetTheme('none'); setBgColor('#d9f5e4'); setTextColor('#1f6b4e'); setBorderColor('#a7f3d0'); setBadgeBgColor('#dc3545'); setBadgeTextColor('#ffffff'); setTitleColor('#191919'); }}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: campaignTheme === 'none' ? '2px solid #10B981' : '1px solid #E5E7EB',
                backgroundColor: campaignTheme === 'none' ? '#ECFDF5' : '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              ✨ Sin campaña (colores libres)
            </button>

            {Object.keys(CAMPAIGN_THEMES).map(function (key) {
              var th = CAMPAIGN_THEMES[key];
              var active = campaignTheme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={function () { applyPresetTheme(key); }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: active ? '2px solid #10B981' : '1px solid #E5E7EB',
                    backgroundColor: th.bg,
                    color: th.text,
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{PRESET_LABELS[key] || key}</span>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: th.badgeBg,
                    border: '2px solid rgba(255,255,255,0.5)'
                  }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GUARDAR */}
      <div style={{ marginTop: '28px', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            backgroundColor: '#10B981',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 800,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? 'Guardando widget...' : '💾 Guardar Información de Envío'}
        </button>
        <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', marginTop: '10px' }}>
          Al guardar vas a volver a <strong>Mis Widgets</strong>
        </p>
      </div>

      {/* CENTRO DE AYUDA OFICIAL */}
      <div style={{ marginTop: '28px' }}>
        <CentroAyuda />
      </div>
    </div>
  );
    }
