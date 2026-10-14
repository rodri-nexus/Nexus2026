'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

type TabType = 'general' | 'ubicacion' | 'estilos' | 'fechas';

interface StepItem {
  id: string;
  title: string;
  badge: string;
  content: string;
  imageUrl: string;
}

interface PasosEditorProps {
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

export default function PasosEditor({
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
}: PasosEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const [sectionTitle, setSectionTitle] = useState(cfg.sectionTitle || 'Cómo usar el producto');
  const [sectionSubtitle, setSectionSubtitle] = useState(cfg.sectionSubtitle || 'Seguí estos simples pasos');

  const [steps, setSteps] = useState<StepItem[]>(
    Array.isArray(cfg.steps) && cfg.steps.length > 0
      ? cfg.steps
      : [
          {
            id: 'step-1',
            title: 'Paso 1',
            badge: 'Paso 1',
            content: 'Descripción del paso...',
            imageUrl: ''
          },
          {
            id: 'step-2',
            title: 'Paso 2',
            badge: 'Paso 2',
            content: 'Descripción del paso...',
            imageUrl: ''
          }
        ]
  );

  const [position, setPosition] = useState(cfg.position || 'after-description');

  const [indicatorStyle, setIndicatorStyle] = useState(cfg.indicatorStyle || 'circle');

  const [bgColor, setBgColor] = useState(cfg.bgColor || '#fafafa');
  const [sectionTitleColor, setSectionTitleColor] = useState(cfg.sectionTitleColor || '#191919');
  const [sectionSubtitleColor, setSectionSubtitleColor] = useState(cfg.sectionSubtitleColor || '#191919');
  const [stepTitleColor, setStepTitleColor] = useState(cfg.stepTitleColor || '#191919');
  const [stepTextColor, setStepTextColor] = useState(cfg.stepTextColor || '#4b5563');
  const [lineColor, setLineColor] = useState(cfg.lineColor || '#191919');
  const [badgeBgColor, setBadgeBgColor] = useState(cfg.badgeBgColor || '#191919');
  const [badgeTextColor, setBadgeTextColor] = useState(cfg.badgeTextColor || '#ffffff');

  const [sectionTitleSize, setSectionTitleSize] = useState(typeof cfg.sectionTitleSize === 'number' ? cfg.sectionTitleSize : 22);
  const [sectionSubtitleSize, setSectionSubtitleSize] = useState(typeof cfg.sectionSubtitleSize === 'number' ? cfg.sectionSubtitleSize : 16);
  const [stepTitleSize, setStepTitleSize] = useState(typeof cfg.stepTitleSize === 'number' ? cfg.stepTitleSize : 18);
  const [stepTextSize, setStepTextSize] = useState(typeof cfg.stepTextSize === 'number' ? cfg.stepTextSize : 15);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);

  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const handleAddStep = function () {
    if (steps.length >= 10) {
      alert('Máximo 10 pasos permitidos.');
      return;
    }
    var nextNum = steps.length + 1;
    var newStep: StepItem = {
      id: 'step-' + Date.now(),
      title: 'Paso ' + nextNum,
      badge: 'Paso ' + nextNum,
      content: 'Descripción del paso...',
      imageUrl: ''
    };
    setSteps(function (prev) { return [...prev, newStep]; });
  };

  const handleRemoveStep = function (index: number) {
    if (steps.length <= 1) {
      alert('Debes mantener al menos 1 paso.');
      return;
    }
    setSteps(function (prev) {
      return prev.filter(function (_, i) { return i !== index; });
    });
  };

  const handleMoveStep = function (index: number, direction: 'up' | 'down') {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) {
      return;
    }
    var targetIndex = direction === 'up' ? index - 1 : index + 1;
    setSteps(function (prev) {
      var updated = [...prev];
      var temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleStepChange = function (index: number, field: keyof StepItem, value: string) {
    setSteps(function (prev) {
      var updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setSectionTitleColor(th.text);
      setSectionSubtitleColor(th.text);
      setStepTitleColor(th.text);
      setLineColor(th.accent);
      setBadgeBgColor(th.accent);
      setBadgeTextColor(th.text === '#ffffff' ? '#111827' : '#ffffff');
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async function () {
    if (steps.length === 0) {
      alert('Agregá al menos un paso para guardar el widget.');
      return;
    }

    var configData = {
      sectionTitle: sectionTitle,
      sectionSubtitle: sectionSubtitle,
      steps: steps,
      position: position,
      indicatorStyle: indicatorStyle,
      bgColor: bgColor,
      sectionTitleColor: sectionTitleColor,
      sectionSubtitleColor: sectionSubtitleColor,
      stepTitleColor: stepTitleColor,
      stepTextColor: stepTextColor,
      lineColor: lineColor,
      badgeBgColor: badgeBgColor,
      badgeTextColor: badgeTextColor,
      sectionTitleSize: sectionTitleSize,
      sectionSubtitleSize: sectionSubtitleSize,
      stepTitleSize: stepTitleSize,
      stepTextSize: stepTextSize,
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
          widget_slug: 'pasos',
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
        Nuevo widget: Pasos ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Línea de tiempo de pasos:</strong> Muestra el proceso de uso o beneficios del producto en pasos secuenciales con línea animada al scroll.
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
          padding: '24px 20px',
          maxWidth: '520px',
          margin: '0 auto',
          border: campaignTheme !== 'none' && CAMPAIGN_THEMES[campaignTheme] ? '2px solid ' + CAMPAIGN_THEMES[campaignTheme].border : '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          {sectionTitle ? (
            <div style={{
              fontSize: sectionTitleSize + 'px',
              fontWeight: 800,
              color: sectionTitleColor,
              textAlign: 'center',
              marginBottom: '4px'
            }}>
              {sectionTitle}
            </div>
          ) : null}

          {sectionSubtitle ? (
            <div style={{
              fontSize: sectionSubtitleSize + 'px',
              color: sectionSubtitleColor,
              textAlign: 'center',
              marginBottom: '20px',
              opacity: 0.85
            }}>
              {sectionSubtitle}
            </div>
          ) : null}

          <div style={{ position: 'relative', paddingLeft: '36px' }}>
            {/* Línea vertical */}
            <div style={{
              position: 'absolute',
              left: '13px',
              top: '8px',
              bottom: '8px',
              width: '2px',
              backgroundColor: lineColor,
              borderRadius: '2px'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {steps.map(function (step, idx) {
                return (
                  <div key={step.id || idx} style={{ position: 'relative' }}>
                    {/* Punto / Indicador */}
                    <div style={{
                      position: 'absolute',
                      left: '-36px',
                      top: '0px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: '2px solid ' + lineColor,
                      color: lineColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                      {indicatorStyle === 'check' ? '✓' : indicatorStyle === 'dash' ? '—' : '●'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {step.badge ? (
                        <span style={{
                          alignSelf: 'flex-start',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: badgeBgColor,
                          color: badgeTextColor
                        }}>
                          {step.badge}
                        </span>
                      ) : null}

                      {step.title ? (
                        <div style={{
                          fontSize: stepTitleSize + 'px',
                          fontWeight: 800,
                          color: stepTitleColor,
                          lineHeight: 1.3
                        }}>
                          {step.title}
                        </div>
                      ) : null}

                      {step.content ? (
                        <div style={{
                          fontSize: stepTextSize + 'px',
                          color: stepTextColor,
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap'
                        }}>
                          {step.content}
                        </div>
                      ) : null}

                      {step.imageUrl ? (
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '140px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginTop: '6px',
                            border: '1px solid #E5E7EB'
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '📍 General & Pasos' },
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
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
              Encabezado de la sección (opcional)
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Título de la sección
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={function (e) { setSectionTitle(e.target.value); }}
                placeholder="Ej: Cómo usar el producto"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Subtítulo de la sección
              </label>
              <input
                type="text"
                value={sectionSubtitle}
                onChange={function (e) { setSectionSubtitle(e.target.value); }}
                placeholder="Ej: Seguí estos simples pasos"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                Listado de Pasos ({steps.length}/10)
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                disabled={steps.length >= 10}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: steps.length >= 10 ? 'not-allowed' : 'pointer',
                  opacity: steps.length >= 10 ? 0.5 : 1
                }}
              >
                + Agregar paso
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {steps.map(function (step, index) {
                return (
                  <div
                    key={step.id || index}
                    style={{
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>
                        Paso #{index + 1}
                      </span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={function () { handleMoveStep(index, 'up'); }}
                          disabled={index === 0}
                          style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', background: '#fff', cursor: 'pointer', fontSize: '11px' }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={function () { handleMoveStep(index, 'down'); }}
                          disabled={index === steps.length - 1}
                          style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', background: '#fff', cursor: 'pointer', fontSize: '11px' }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={function () { handleRemoveStep(index); }}
                          style={{ border: '1px solid #FCA5A5', borderRadius: '4px', padding: '2px 8px', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                          Título del paso
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={function (e) { handleStepChange(index, 'title', e.target.value); }}
                          placeholder="Ej: Paso 1"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                          Etiqueta (opcional)
                        </label>
                        <input
                          type="text"
                          value={step.badge}
                          onChange={function (e) { handleStepChange(index, 'badge', e.target.value); }}
                          placeholder="Ej: Paso 1"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Texto del paso
                      </label>
                      <textarea
                        rows={2}
                        value={step.content}
                        onChange={function (e) { handleStepChange(index, 'content', e.target.value); }}
                        placeholder="Descripción del paso..."
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        URL Imagen (opcional)
                      </label>
                      <input
                        type="text"
                        value={step.imageUrl}
                        onChange={function (e) { handleStepChange(index, 'imageUrl', e.target.value); }}
                        placeholder="https://ejemplo.com/imagen.png"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
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
                  El widget aparece debajo del botón "Agregar al carrito", dentro de la columna del producto.
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
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📍 Estilo del Indicador
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { id: 'circle', label: '● Círculo' },
                { id: 'check', label: '✓ Check' },
                { id: 'dash', label: '— Raya' }
              ].map(function (ind) {
                var sel = indicatorStyle === ind.id;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={function () { setIndicatorStyle(ind.id); }}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: sel ? '2px solid #10B981' : '1px solid #E5E7EB',
                      backgroundColor: sel ? '#ECFDF5' : '#ffffff',
                      color: sel ? '#065F46' : '#374151',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {ind.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              🎨 Colores
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Fondo de sección
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                    onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Título de sección
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={sectionTitleColor}
                    onChange={function (e) { handleColorChange(setSectionTitleColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={sectionTitleColor}
                    onChange={function (e) { handleColorChange(setSectionTitleColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Subtítulo de sección
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={sectionSubtitleColor}
                    onChange={function (e) { handleColorChange(setSectionSubtitleColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={sectionSubtitleColor}
                    onChange={function (e) { handleColorChange(setSectionSubtitleColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Título de los pasos
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={stepTitleColor}
                    onChange={function (e) { handleColorChange(setStepTitleColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={stepTitleColor}
                    onChange={function (e) { handleColorChange(setStepTitleColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Texto de los pasos
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={stepTextColor}
                    onChange={function (e) { handleColorChange(setStepTextColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={stepTextColor}
                    onChange={function (e) { handleColorChange(setStepTextColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Línea y puntos
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={lineColor}
                    onChange={function (e) { handleColorChange(setLineColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={lineColor}
                    onChange={function (e) { handleColorChange(setLineColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Fondo de etiquetas
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={badgeBgColor}
                    onChange={function (e) { handleColorChange(setBadgeBgColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeBgColor}
                    onChange={function (e) { handleColorChange(setBadgeBgColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Texto de etiquetas
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={badgeTextColor}
                    onChange={function (e) { handleColorChange(setBadgeTextColor, e.target.value); }}
                    style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeTextColor}
                    onChange={function (e) { handleColorChange(setBadgeTextColor, e.target.value); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📏 Tamaños de Letra
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Título sección: {sectionTitleSize}px
                </label>
                <input
                  type="range"
                  min={18}
                  max={32}
                  step={1}
                  value={sectionTitleSize}
                  onChange={function (e) { setSectionTitleSize(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Subtítulo sección: {sectionSubtitleSize}px
                </label>
                <input
                  type="range"
                  min={13}
                  max={22}
                  step={1}
                  value={sectionSubtitleSize}
                  onChange={function (e) { setSectionSubtitleSize(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Título pasos: {stepTitleSize}px
                </label>
                <input
                  type="range"
                  min={14}
                  max={24}
                  step={1}
                  value={stepTitleSize}
                  onChange={function (e) { setStepTitleSize(parseInt(e.target.value, 10)); }}
                  style={{ width: '100%', accentColor: '#10B981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Texto pasos: {stepTextSize}px
                </label>
                <input
                  type="range"
                  min={12}
                  max={20}
                  step={1}
                  value={stepTextSize}
                  onChange={function (e) { setStepTextSize(parseInt(e.target.value, 10)); }}
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
            🔥 Elegí un preset de campaña. Se aplican colores automáticamente al fondo y textos.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={function () { applyPresetTheme('none'); setBgColor('#fafafa'); setSectionTitleColor('#191919'); setSectionSubtitleColor('#191919'); setStepTitleColor('#191919'); setLineColor('#191919'); setBadgeBgColor('#191919'); setBadgeTextColor('#ffffff'); }}
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
          {saving ? 'Guardando widget...' : '💾 Guardar Pasos'}
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
