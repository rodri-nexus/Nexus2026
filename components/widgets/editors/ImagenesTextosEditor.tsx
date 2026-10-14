'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

interface SectionItem {
  id: string;
  image: string;
  imagePosition: string;
  bgColor: string;
  badgeText: string;
  title: string;
  content: string;
}

interface ImagenesTextosEditorProps {
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

export default function ImagenesTextosEditor({
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
}: ImagenesTextosEditorProps) {
  const [activeTab, setActiveTab] = useState('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const defaultSections: SectionItem[] = [
    {
      id: 'sec-1',
      image: '',
      imagePosition: 'left',
      bgColor: '#ffffff',
      badgeText: 'NUEVO',
      title: 'Sección 1',
      content: 'Texto con imagen a la izquierda para destacar beneficios o características del producto.'
    },
    {
      id: 'sec-2',
      image: '',
      imagePosition: 'right',
      bgColor: '#f9fafb',
      badgeText: 'DESTACADO',
      title: 'Sección 2',
      content: 'Texto con imagen a la derecha. El diseño alternado capta la atención del cliente.'
    }
  ];

  const [sections, setSections] = useState<SectionItem[]>(
    Array.isArray(cfg.sections) && cfg.sections.length > 0 ? cfg.sections : defaultSections
  );

  const [position, setPosition] = useState(cfg.position || 'after-description');
  const [imageRadius, setImageRadius] = useState(cfg.imageRadius || '8px');
  const [badgeBg, setBadgeBg] = useState(cfg.badgeBg || '#111827');
  const [badgeColor, setBadgeColor] = useState(cfg.badgeColor || '#ffffff');

  const [h2Size, setH2Size] = useState(typeof cfg.h2Size === 'number' ? cfg.h2Size : 20);
  const [textSize, setTextSize] = useState(typeof cfg.textSize === 'number' ? cfg.textSize : 15);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);

  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const updateSection = function (id: string, field: string, val: string) {
    setSections(function (prev) {
      return prev.map(function (sec) {
        if (sec.id === id) {
          return { ...sec, [field]: val };
        }
        return sec;
      });
    });
  };

  const handleFileUpload = function (e: React.ChangeEvent<HTMLInputElement>, id: string) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (evt) {
      var res = evt.target && evt.target.result;
      if (typeof res === 'string') {
        updateSection(id, 'image', res);
      }
    };
    reader.readAsDataURL(file);
  };

  const addSection = function () {
    var newSec: SectionItem = {
      id: 'sec-' + Math.random().toString(36).substring(2, 7),
      image: '',
      imagePosition: sections.length % 2 === 0 ? 'left' : 'right',
      bgColor: '#ffffff',
      badgeText: '',
      title: 'Título de la sección',
      content: 'Escribí aquí el contenido de esta sección.'
    };
    setSections(function (prev) { return [...prev, newSec]; });
  };

  const removeSection = function (id: string) {
    if (sections.length <= 1) {
      alert('Tenés que mantener al menos una sección.');
      return;
    }
    setSections(function (prev) {
      return prev.filter(function (sec) { return sec.id !== id; });
    });
  };

  const moveSection = function (index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    var newArr = [...sections];
    var targetIdx = direction === 'up' ? index - 1 : index + 1;
    var temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setSections(newArr);
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBadgeBg(th.bg);
      setBadgeColor(th.text);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async function () {
    var configData = {
      sections: sections,
      position: position,
      imageRadius: imageRadius,
      badgeBg: badgeBg,
      badgeColor: badgeColor,
      h2Size: h2Size,
      textSize: textSize,
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
          widget_slug: 'imagenes-textos',
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
        Nuevo widget: Imágenes y textos ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>🖼️</span>
        <div>
          <strong>Secciones alternadas de imagen y texto:</strong> Destacá características clave o beneficios del producto con imágenes a la izquierda o derecha en desktop, perfectamente centrado y adaptado en celulares.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px', margin: '0 auto' }}>
          {sections.map(function (sec, idx) {
            var isRight = sec.imagePosition === 'right';
            return (
              <div
                key={sec.id || idx}
                style={{
                  backgroundColor: sec.bgColor || '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: isRight ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ flex: '0 0 110px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {sec.image ? (
                    <img
                      src={sec.image}
                      alt={sec.title}
                      style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: imageRadius }}
                    />
                  ) : (
                    <div style={{ width: '110px', height: '110px', backgroundColor: '#E5E7EB', borderRadius: imageRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#9CA3AF' }}>
                      🖼️
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                  {sec.badgeText ? (
                    <span style={{
                      alignSelf: 'flex-start',
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {sec.badgeText}
                    </span>
                  ) : null}
                  <div style={{ fontSize: h2Size + 'px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                    {sec.title || 'Título de la sección'}
                  </div>
                  <div style={{ fontSize: textSize + 'px', color: '#4B5563', lineHeight: 1.5, wordBreak: 'break-word' }}>
                    {sec.content || 'Escribí aquí el contenido...'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '🖼️ Secciones' },
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

      {/* TAB GENERAL: SECCIONES */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map(function (sec, idx) {
            return (
              <div key={sec.id} style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                    Sección #{idx + 1}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={function () { moveSection(idx, 'up'); }}
                      disabled={idx === 0}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1, fontSize: '12px' }}
                    >
                      ▲ Subir
                    </button>
                    <button
                      type="button"
                      onClick={function () { moveSection(idx, 'down'); }}
                      disabled={idx === sections.length - 1}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === sections.length - 1 ? 0.4 : 1, fontSize: '12px' }}
                    >
                      ▼ Bajar
                    </button>
                    <button
                      type="button"
                      onClick={function () { removeSection(sec.id); }}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* IMAGEN Y CARGA */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Imagen de la sección
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {sec.image ? (
                        <img src={sec.image} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={function (e) { handleFileUpload(e, sec.id); }}
                        style={{ fontSize: '12px', flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* POSICIÓN Y FONDO */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Posición imagen en Desktop
                      </label>
                      <select
                        value={sec.imagePosition}
                        onChange={function (e) { updateSection(sec.id, 'imagePosition', e.target.value); }}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
                      >
                        <option value="left">🖼️ Izquierda</option>
                        <option value="right">🖼️ Derecha</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Color de fondo de la sección
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={sec.bgColor}
                          onChange={function (e) { updateSection(sec.id, 'bgColor', e.target.value); }}
                          style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                        />
                        <input
                          type="text"
                          value={sec.bgColor}
                          onChange={function (e) { updateSection(sec.id, 'bgColor', e.target.value); }}
                          style={{ flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BADGE / ETIQUETA */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Badge / Etiqueta (opcional)
                    </label>
                    <input
                      type="text"
                      value={sec.badgeText}
                      onChange={function (e) { updateSection(sec.id, 'badgeText', e.target.value); }}
                      placeholder="Ej: NUEVO, 100% ORGÁNICO..."
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* TÍTULO */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Título de la sección
                    </label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={function (e) { updateSection(sec.id, 'title', e.target.value); }}
                      placeholder="Ej: Diseño Ergonómico"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* CONTENIDO */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Contenido descriptivo
                    </label>
                    <textarea
                      value={sec.content}
                      onChange={function (e) { updateSection(sec.id, 'content', e.target.value); }}
                      placeholder="Escribí aquí los detalles..."
                      rows={3}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addSection}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '2px dashed #10B981',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            + Agregar otra sección
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#111827', marginTop: '8px' }}>
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
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Después de la descripción (Recomendado)</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', lineHeight: 1.4 }}>
                  Se muestra a ancho completo debajo de toda la sección del producto. Ideal para resaltar características alternadas.
                </div>
              </div>
            </div>
          </label>

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
                  Se ubica dentro de la columna de información del producto, justo debajo del botón de compra.
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
              🖼️ Forma de las Imágenes
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Bordes redondeados
              </label>
              <select
                value={imageRadius}
                onChange={function (e) { setImageRadius(e.target.value); }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option value="8px">Bordes suaves (8px)</option>
                <option value="16px">Bordes muy redondeados (16px)</option>
                <option value="50%">Circulares (50%)</option>
                <option value="0px">Cuadradas sin redondear (0px)</option>
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              🏷️ Colores del Badge / Etiqueta
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Fondo del Badge
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={badgeBg}
                    onChange={function (e) { handleColorChange(setBadgeBg, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeBg}
                    onChange={function (e) { handleColorChange(setBadgeBg, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Texto del Badge
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={function (e) { handleColorChange(setBadgeColor, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeColor}
                    onChange={function (e) { handleColorChange(setBadgeColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📐 Tamaños de Texto
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño de títulos: {h2Size}px
              </label>
              <input
                type="range"
                min={16}
                max={30}
                step={1}
                value={h2Size}
                onChange={function (e) { setH2Size(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño de descripción: {textSize}px
              </label>
              <input
                type="range"
                min={12}
                max={20}
                step={1}
                value={textSize}
                onChange={function (e) { setTextSize(parseInt(e.target.value, 10)); }}
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
            🔥 Elegí un preset de campaña. Aplica colores llamativos a los Badges automáticamente.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={function () { applyPresetTheme('none'); setBadgeBg('#111827'); setBadgeColor('#ffffff'); }}
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
          {saving ? 'Guardando widget...' : '💾 Guardar Imágenes y Textos'}
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
