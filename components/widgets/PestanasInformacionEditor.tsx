'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

type TabType = 'general' | 'ubicacion' | 'estilos' | 'fechas';

interface InfoTabItem {
  id: string;
  title: string;
  icon: string;
  content: string;
}

interface PestanasInformacionEditorProps {
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

const ICON_OPTIONS = [
  { id: 'none', label: '❌ Sin ícono', symbol: '' },
  { id: 'truck', label: '🚚 Envíos', symbol: '🚚' },
  { id: 'card', label: '💳 Pagos', symbol: '💳' },
  { id: 'refresh', label: '🔄 Cambios', symbol: '🔄' },
  { id: 'shield', label: '🛡️ Garantía', symbol: '🛡️' },
  { id: 'box', label: '📦 Paquete', symbol: '📦' },
  { id: 'phone', label: '📞 Contacto', symbol: '📞' },
  { id: 'clock', label: '⏰ Horario', symbol: '⏰' },
  { id: 'star', label: '⭐ Destacado', symbol: '⭐' },
  { id: 'lock', label: '🔒 Seguro', symbol: '🔒' },
  { id: 'check', label: '✓ Verificado', symbol: '✓' },
  { id: 'info', label: 'ⓘ Info', symbol: 'ⓘ' },
  { id: 'heart', label: '❤️ Favorito', symbol: '❤️' }
];

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'black-friday': { bg: '#111827', text: '#F59E0B', border: '#D97706', accent: '#F59E0B' },
  'hot-sale': { bg: '#FFF5F5', text: '#EF4444', border: '#B91C1C', accent: '#EF4444' },
  'cyber-monday': { bg: '#EFF6FF', text: '#3B82F6', border: '#1D4ED8', accent: '#3B82F6' },
  'navidad': { bg: '#ECFDF5', text: '#064E3B', border: '#047857', accent: '#10B981' },
  'san-valentin': { bg: '#FDF2F8', text: '#BE185D', border: '#9D174D', accent: '#EC4899' },
  'dia-padre-madre': { bg: '#EEF2FF', text: '#4338CA', border: '#312E81', accent: '#6366F1' },
  'liquidacion': { bg: '#FEF2F2', text: '#991B1B', border: '#7F1D1D', accent: '#DC2626' }
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

export default function PestanasInformacionEditor({
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
}: PestanasInformacionEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const [mainTitle, setMainTitle] = useState(cfg.mainTitle || 'Información del producto');

  const [tabs, setTabs] = useState<InfoTabItem[]>(
    Array.isArray(cfg.tabs) && cfg.tabs.length > 0
      ? cfg.tabs
      : [
          {
            id: 'tab-1',
            title: 'Envíos',
            icon: '🚚',
            content: 'Realizamos envíos a todo el país. Los tiempos de entrega varían según la localidad entre 24 y 72 horas hábiles.'
          },
          {
            id: 'tab-2',
            title: 'Devoluciones y Cambios',
            icon: '🔄',
            content: 'Tenés 30 días corridos desde que recibís el producto para solicitar un cambio o devolución de forma 100% gratuita.'
          }
        ]
  );

  const [previewTabIdx, setPreviewTabIdx] = useState(0);

  const [position, setPosition] = useState(cfg.position || 'before-description');

  const [bgColor, setBgColor] = useState(cfg.bgColor || '#f7f7f7');
  const [textColor, setTextColor] = useState(cfg.textColor || '#333333');
  const [mainTitleColor, setMainTitleColor] = useState(cfg.mainTitleColor || '#111827');
  const [accentColor, setAccentColor] = useState(cfg.accentColor || '#10B981');

  const [mainTitleSize, setMainTitleSize] = useState(typeof cfg.mainTitleSize === 'number' ? cfg.mainTitleSize : 18);
  const [tabTitleSize, setTabTitleSize] = useState(typeof cfg.tabTitleSize === 'number' ? cfg.tabTitleSize : 15);
  const [contentSize, setContentSize] = useState(typeof cfg.contentSize === 'number' ? cfg.contentSize : 14);

  const [borderRadius, setBorderRadius] = useState(typeof cfg.borderRadius === 'number' ? cfg.borderRadius : 12);
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

  const handleAddTab = function () {
    if (tabs.length >= 8) {
      alert('Máximo 8 pestañas permitidas.');
      return;
    }
    var nextNum = tabs.length + 1;
    var newTab: InfoTabItem = {
      id: 'tab-' + Date.now(),
      title: 'Pestaña ' + nextNum,
      icon: '',
      content: 'Escribí el contenido de esta pestaña...'
    };
    setTabs(function (prev) { return [...prev, newTab]; });
    setPreviewTabIdx(tabs.length);
  };

  const handleRemoveTab = function (index: number) {
    if (tabs.length <= 1) {
      alert('Debes mantener al menos 1 pestaña.');
      return;
    }
    setTabs(function (prev) {
      return prev.filter(function (_, i) { return i !== index; });
    });
    if (previewTabIdx >= tabs.length - 1) {
      setPreviewTabIdx(Math.max(0, tabs.length - 2));
    }
  };

  const handleMoveTab = function (index: number, direction: 'up' | 'down') {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === tabs.length - 1)) {
      return;
    }
    var targetIndex = direction === 'up' ? index - 1 : index + 1;
    setTabs(function (prev) {
      var updated = [...prev];
      var temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleTabChange = function (index: number, field: keyof InfoTabItem, value: string) {
    setTabs(function (prev) {
      var updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const insertFormattingToTab = function (index: number, prefix: string, suffix: string = '') {
    setTabs(function (prev) {
      var updated = [...prev];
      var currentContent = updated[index].content || '';
      updated[index] = { ...updated[index], content: currentContent + prefix + suffix };
      return updated;
    });
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTextColor(th.text);
      setMainTitleColor(th.text);
      setAccentColor(th.accent);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async function () {
    if (tabs.length === 0) {
      alert('Agregá al menos una pestaña para guardar el widget.');
      return;
    }

    var configData = {
      mainTitle: mainTitle,
      tabs: tabs,
      position: position,
      bgColor: bgColor,
      textColor: textColor,
      mainTitleColor: mainTitleColor,
      accentColor: accentColor,
      mainTitleSize: mainTitleSize,
      tabTitleSize: tabTitleSize,
      contentSize: contentSize,
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
          widget_slug: 'pestanas-informacion',
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
  const currentTab = tabs[previewTabIdx] || tabs[0] || { title: 'Pestaña 1', icon: '', content: '' };

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
        Nuevo widget: Pestañas de información ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Pestañas de información:</strong> Organiza los detalles del producto (Envíos, Devoluciones, Garantía, Medidas) en solapas interactivas para una navegación más limpia.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO
        </div>

        {mainTitle ? (
          <div style={{ fontSize: mainTitleSize + 'px', fontWeight: 800, color: mainTitleColor, textAlign: 'center', marginBottom: '12px' }}>
            {mainTitle}
          </div>
        ) : null}

        <div style={{
          backgroundColor: bgColor,
          borderRadius: borderRadius + 'px',
          padding: padding + 'px',
          maxWidth: '560px',
          margin: '0 auto',
          marginTop: marginTop + 'px',
          marginBottom: marginBottom + 'px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          {/* BARRA DE SOLAPAS / TABS */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E5E7EB', marginBottom: '16px', overflowX: 'auto' }}>
            {tabs.map(function (tb, idx) {
              var isSelected = idx === previewTabIdx;
              return (
                <button
                  key={tb.id || idx}
                  type="button"
                  onClick={function () { setPreviewTabIdx(idx); }}
                  style={{
                    padding: '8px 14px',
                    fontSize: tabTitleSize + 'px',
                    fontWeight: isSelected ? 800 : 600,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    color: isSelected ? accentColor : textColor,
                    borderBottom: isSelected ? '3px solid ' + accentColor : '3px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  {tb.icon ? <span>{tb.icon}</span> : null}
                  <span>{tb.title || 'Pestaña'}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENIDO DE LA PESTAÑA SELECCIONADA */}
          <div
            style={{
              fontSize: contentSize + 'px',
              color: textColor,
              lineHeight: 1.6,
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: currentTab.content || 'Escribí el contenido...' }}
          />
        </div>
      </div>

      {/* TABS DE CONFIGURACIÓN DEL EDITOR */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '📑 Pestañas & Contenido' },
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
              Título principal de la sección (opcional)
            </div>
            <input
              type="text"
              value={mainTitle}
              onChange={function (e) { setMainTitle(e.target.value); }}
              placeholder="Ej: Información del producto"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                Listado de Pestañas ({tabs.length}/8)
              </div>
              <button
                type="button"
                onClick={handleAddTab}
                disabled={tabs.length >= 8}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: tabs.length >= 8 ? 'not-allowed' : 'pointer',
                  opacity: tabs.length >= 8 ? 0.5 : 1
                }}
              >
                + Agregar pestaña
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tabs.map(function (tb, index) {
                return (
                  <div
                    key={tb.id || index}
                    style={{
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>
                        Pestaña #{index + 1}
                      </span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={function () { handleMoveTab(index, 'up'); }}
                          disabled={index === 0}
                          style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', background: '#fff', cursor: 'pointer', fontSize: '11px' }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={function () { handleMoveTab(index, 'down'); }}
                          disabled={index === tabs.length - 1}
                          style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', background: '#fff', cursor: 'pointer', fontSize: '11px' }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={function () { handleRemoveTab(index); }}
                          style={{ border: '1px solid #FCA5A5', borderRadius: '4px', padding: '2px 8px', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Nombre de la pestaña
                      </label>
                      <input
                        type="text"
                        value={tb.title}
                        onChange={function (e) { handleTabChange(index, 'title', e.target.value); }}
                        placeholder="Ej: Envíos y Entregas"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Ícono opcional
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {ICON_OPTIONS.map(function (ico) {
                          var isSel = tb.icon === ico.symbol;
                          return (
                            <button
                              key={ico.id}
                              type="button"
                              onClick={function () { handleTabChange(index, 'icon', ico.symbol); }}
                              style={{
                                padding: '6px 10px',
                                fontSize: '12px',
                                fontWeight: 700,
                                borderRadius: '6px',
                                border: isSel ? '2px solid #10B981' : '1px solid #D1D5DB',
                                backgroundColor: isSel ? '#ECFDF5' : '#ffffff',
                                color: isSel ? '#065F46' : '#374151',
                                cursor: 'pointer'
                              }}
                            >
                              {ico.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CONTENIDO DE LA PESTAÑA CON BARRA RÁPIDA */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Contenido
                      </label>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px', padding: '6px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                        <button
                          type="button"
                          onClick={function () { insertFormattingToTab(index, '<b>', '</b>'); }}
                          style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 800, borderRadius: '4px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={function () { insertFormattingToTab(index, '<i>', '</i>'); }}
                          style={{ padding: '4px 8px', fontSize: '11px', fontStyle: 'italic', fontWeight: 700, borderRadius: '4px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={function () { insertFormattingToTab(index, '<u>', '</u>'); }}
                          style={{ padding: '4px 8px', fontSize: '11px', textDecoration: 'underline', fontWeight: 700, borderRadius: '4px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          U
                        </button>
                        <button
                          type="button"
                          onClick={function () { insertFormattingToTab(index, '<h3>', '</h3>'); }}
                          style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 800, borderRadius: '4px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={function () { insertFormattingToTab(index, '<ul>\n  <li>', '</li>\n</ul>'); }}
                          style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '4px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          • Lista
                        </button>
                        <button
                          type="button"
                          onClick={function () { insertFormattingToTab(index, '<br/>'); }}
                          style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '4px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          Salto de línea
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        value={tb.content}
                        onChange={function (e) { handleTabChange(index, 'content', e.target.value); }}
                        placeholder="Escribí aquí la información de esta pestaña..."
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #D1D5DB',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          backgroundColor: '#ffffff',
                          fontFamily: 'monospace',
                          lineHeight: 1.4
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
                  Las pestañas aparecen debajo del botón &quot;Agregar al carrito&quot;, dentro de la columna del producto.
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
                  Las pestañas se muestran después de toda la sección del producto, a ancho completo.
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
                  Las pestañas se insertan dentro de la ficha del producto, justo debajo del bloque de precio.
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
              🎨 Colores
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Color de fondo
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
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
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
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
                  Color del título principal
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={mainTitleColor}
                    onChange={function (e) { handleColorChange(setMainTitleColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={mainTitleColor}
                    onChange={function (e) { handleColorChange(setMainTitleColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Color de pestaña activa / acento
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={function (e) { handleColorChange(setAccentColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={function (e) { handleColorChange(setAccentColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📐 Tamaños de Letra & Diseño
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Título principal: {mainTitleSize}px
                </label>
                <input
                  type="range"
                  min={14}
                  max={28}
                  step={1}
                  value={mainTitleSize}
                  onChange={function (e) { setMainTitleSize(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Nombres de pestañas: {tabTitleSize}px
                </label>
                <input
                  type="range"
                  min={12}
                  max={20}
                  step={1}
                  value={tabTitleSize}
                  onChange={function (e) { setTabTitleSize(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Texto de contenido: {contentSize}px
                </label>
                <input
                  type="range"
                  min={12}
                  max={20}
                  step={1}
                  value={contentSize}
                  onChange={function (e) { setContentSize(parseInt(e.target.value, 10)); }}
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
            🔥 Elegí un preset de campaña. Se aplican colores automáticamente al fondo y las pestañas.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={function () { applyPresetTheme('none'); setBgColor('#f7f7f7'); setTextColor('#333333'); setMainTitleColor('#111827'); setAccentColor('#10B981'); }}
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
                    backgroundColor: th.accent,
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
          {saving ? 'Guardando widget...' : '💾 Guardar Pestañas de Información'}
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
