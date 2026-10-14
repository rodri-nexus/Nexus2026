'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

type TabType = 'general' | 'ubicacion' | 'estilos' | 'fechas';

interface TextoLibreEditorProps {
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

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'black-friday': { bg: '#F59E0B', text: '#111827', border: '#D97706', accent: '#111827' },
  'hot-sale': { bg: '#EF4444', text: '#ffffff', border: '#B91C1C', accent: '#ffffff' },
  'cyber-monday': { bg: '#3B82F6', text: '#ffffff', border: '#1D4ED8', accent: '#ffffff' },
  'navidad': { bg: '#064E3B', text: '#ffffff', border: '#047857', accent: '#EF4444' },
  'san-valentin': { bg: '#831843', text: '#ffffff', border: '#9d174d', accent: '#F43F5E' },
  'dia-padre-madre': { bg: '#312E81', text: '#ffffff', border: '#4338ca', accent: '#10B981' },
  'liquidacion': { bg: '#7F1D1D', text: '#ffffff', border: '#991b1b', accent: '#FBBF24' }
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

export default function TextoLibreEditor({
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
}: TextoLibreEditorProps) {
  const [activeTab, setActiveTab] = useState('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const [title, setTitle] = useState(cfg.title || 'Título del bloque');
  const [content, setContent] = useState(
    cfg.content || 'Escribí aquí el contenido de tu texto libre.'
  );

  const [position, setPosition] = useState(cfg.position || 'before-description');

  const [h2Size, setH2Size] = useState(typeof cfg.h2Size === 'number' ? cfg.h2Size : 22);
  const [h3Size, setH3Size] = useState(typeof cfg.h3Size === 'number' ? cfg.h3Size : 18);
  const [textSize, setTextSize] = useState(typeof cfg.textSize === 'number' ? cfg.textSize : 16);

  const [bgColor, setBgColor] = useState(cfg.bgColor || '#ffffff');
  const [titleColor, setTitleColor] = useState(cfg.titleColor || '#111827');
  const [textColor, setTextColor] = useState(cfg.textColor || '#374151');

  const [marginTop, setMarginTop] = useState(typeof cfg.marginTop === 'number' ? cfg.marginTop : 0);
  const [marginBottom, setMarginBottom] = useState(typeof cfg.marginBottom === 'number' ? cfg.marginBottom : 0);
  const [paddingTop, setPaddingTop] = useState(typeof cfg.paddingTop === 'number' ? cfg.paddingTop : 16);
  const [paddingBottom, setPaddingBottom] = useState(typeof cfg.paddingBottom === 'number' ? cfg.paddingBottom : 16);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);

  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const insertFormatting = function (prefix: string, suffix: string = '') {
    setContent(function (prev: string) {
      return prev + prefix + suffix;
    });
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTitleColor(th.text);
      setTextColor(th.text);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async function () {
    if (!content.trim()) {
      alert('Escribí algún texto para guardar el widget.');
      return;
    }

    var configData = {
      title: title,
      content: content,
      position: position,
      h2Size: h2Size,
      h3Size: h3Size,
      textSize: textSize,
      bgColor: bgColor,
      titleColor: titleColor,
      textColor: textColor,
      marginTop: marginTop,
      marginBottom: marginBottom,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
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
          widget_slug: 'texto-libre',
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
        Nuevo widget: Texto libre ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Bloque de texto personalizado:</strong> Agregá títulos, párrafos, viñetas, enlaces o código HTML libre en cualquier posición de tu producto.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO
        </div>

        <div style={{
          backgroundColor: bgColor === 'transparent' ? '#ffffff' : bgColor,
          borderRadius: '12px',
          padding: paddingTop + 'px 16px ' + paddingBottom + 'px 16px',
          marginTop: marginTop + 'px',
          marginBottom: marginBottom + 'px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          maxWidth: '520px',
          margin: '0 auto',
          border: campaignTheme !== 'none' && CAMPAIGN_THEMES[campaignTheme] ? '2px solid ' + CAMPAIGN_THEMES[campaignTheme].border : '1px solid #E5E7EB'
        }}>
          {title ? (
            <div style={{
              fontSize: h2Size + 'px',
              fontWeight: 800,
              color: titleColor,
              marginBottom: '10px',
              lineHeight: 1.3
            }}>
              {title}
            </div>
          ) : null}

          <div
            style={{
              fontSize: textSize + 'px',
              color: textColor,
              lineHeight: 1.6,
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: content || 'Escribí algo...' }}
          />
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '📝 General' },
          { id: 'ubicacion', label: '📍 Ubicación' },
          { id: 'estilos', label: '🎨 Estilos' },
          { id: 'fechas', label: '🔥 Fechas Especiales' }
        ].map(function (tab) {
          var active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () { setActiveTab(tab.id); }}
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
              Contenido (texto libre con formato)
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Título del bloque (opcional)
              </label>
              <input
                type="text"
                value={title}
                onChange={function (e) { setTitle(e.target.value); }}
                placeholder="Ej: Título del bloque"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* BARRA DE HERRAMIENTAS RÁPIDAS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px', padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <button
                type="button"
                onClick={function () { insertFormatting('<b>', '</b>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 800, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                title="Negrita"
              >
                B
              </button>
              <button
                type="button"
                onClick={function () { insertFormatting('<i>', '</i>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', fontStyle: 'italic', fontWeight: 700, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                title="Cursiva"
              >
                I
              </button>
              <button
                type="button"
                onClick={function () { insertFormatting('<u>', '</u>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', textDecoration: 'underline', fontWeight: 700, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
                title="Subrayado"
              >
                U
              </button>
              <button
                type="button"
                onClick={function () { insertFormatting('<h3>', '</h3>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 800, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                H3
              </button>
              <button
                type="button"
                onClick={function () { insertFormatting('<p>', '</p>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                Párrafo
              </button>
              <button
                type="button"
                onClick={function () { insertFormatting('<ul>\n  <li>', '</li>\n</ul>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                • Lista
              </button>
              <button
                type="button"
                onClick={function () { insertFormatting('<a href="#">', '</a>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                🔗 Enlace
              </button>
              <button
                type="button"
                onClick={function () { insertFormatting('<br/>'); }}
                style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                Salto de línea
              </button>
            </div>

            <textarea
              value={content}
              onChange={function (e) { setContent(e.target.value); }}
              placeholder="Escribí aquí tu texto o código HTML..."
              rows={8}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                lineHeight: 1.5
              }}
            />
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
              💡 Podés escribir texto simple o etiquetas HTML directas (`&lt;b&gt;`, `&lt;p&gt;`, `&lt;a&gt;`, `&lt;ul&gt;`, etc.)
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
            Elegí dónde se mostrará este widget en la página del producto.
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
                  El widget se muestra dentro de la sección de información del producto, debajo del botón de compra.
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
                  El widget se muestra a ancho completo debajo de toda la sección del producto.
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
                  El widget se inserta dentro de la ficha del producto, justo debajo del precio.
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
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📐 Tamaños de letra
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño H2 (Título): {h2Size}px
              </label>
              <input
                type="range"
                min={16}
                max={36}
                step={1}
                value={h2Size}
                onChange={function (e) { setH2Size(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño H3 (Subtítulo): {h3Size}px
              </label>
              <input
                type="range"
                min={14}
                max={28}
                step={1}
                value={h3Size}
                onChange={function (e) { setH3Size(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño de texto: {textSize}px
              </label>
              <input
                type="range"
                min={12}
                max={22}
                step={1}
                value={textSize}
                onChange={function (e) { setTextSize(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              🎨 Colores
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Color de fondo
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                  onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                  style={{ width: '44px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                  placeholder="Transparente o #ffffff"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={function () { handleColorChange(setBgColor, 'transparent'); }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  Transparente
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Color del título
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={titleColor}
                  onChange={function (e) { handleColorChange(setTitleColor, e.target.value); }}
                  style={{ width: '44px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={titleColor}
                  onChange={function (e) { handleColorChange(setTitleColor, e.target.value); }}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Color del texto
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={function (e) { handleColorChange(setTextColor, e.target.value); }}
                  style={{ width: '44px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={function (e) { handleColorChange(setTextColor, e.target.value); }}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📏 Espaciados y Márgenes
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Margen superior: {marginTop}px
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={marginTop}
                onChange={function (e) { setMarginTop(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Margen inferior: {marginBottom}px
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={marginBottom}
                onChange={function (e) { setMarginBottom(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Padding superior: {paddingTop}px
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={paddingTop}
                onChange={function (e) { setPaddingTop(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Padding inferior: {paddingBottom}px
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={paddingBottom}
                onChange={function (e) { setPaddingBottom(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>
          </div>

        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === 'fechas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '14px 16px', fontSize: '13px', color: '#92400E' }}>
            🔥 Elegí un preset de campaña. Se aplican colores automáticamente al fondo y textos.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={function () { applyPresetTheme('none'); setBgColor('#ffffff'); setTitleColor('#111827'); setTextColor('#374151'); }}
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
          {saving ? 'Guardando widget...' : '💾 Guardar Texto Libre'}
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
