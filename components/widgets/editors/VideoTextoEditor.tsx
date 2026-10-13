'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

type TabType = 'general' | 'ubicacion' | 'estilos' | 'fechas';

interface VideoTextoEditorProps {
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

function getYoutubeEmbedUrl(url: string): string {
  if (!url) return '';
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match && match[2].length === 11) ? 'https://www.youtube.com/embed/' + match[2] : url;
}

export default function VideoTextoEditor({
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
}: VideoTextoEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const [title, setTitle] = useState(cfg.title || 'Título del video');
  const [description, setDescription] = useState(
    cfg.description || 'Describí brevemente el contenido del video o destacá los puntos clave del producto.'
  );

  const [videoType, setVideoType] = useState<'youtube' | 'upload'>(cfg.videoType || 'youtube');
  const [youtubeUrl, setYoutubeUrl] = useState(cfg.youtubeUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [customVideoUrl, setCustomVideoUrl] = useState(cfg.customVideoUrl || '');

  const [position, setPosition] = useState(cfg.position || 'before-description');
  const [videoPosition, setVideoPosition] = useState<'left' | 'right'>(cfg.videoPosition || 'right');

  const [bgColor, setBgColor] = useState(cfg.bgColor || '#fafafa');
  const [titleColor, setTitleColor] = useState(cfg.titleColor || '#111827');
  const [textColor, setTextColor] = useState(cfg.textColor || '#4B5563');
  const [titleSize, setTitleSize] = useState(typeof cfg.titleSize === 'number' ? cfg.titleSize : 22);
  const [textSize, setTextSize] = useState(typeof cfg.textSize === 'number' ? cfg.textSize : 15);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const handleVideoUpload = function (e: React.ChangeEvent<HTMLInputElement>) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('El video no puede superar los 15 MB.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadError('');

    var reader = new FileReader();
    reader.onload = function (ev) {
      if (ev.target && typeof ev.target.result === 'string') {
        setCustomVideoUrl(ev.target.result);
      }
      setIsUploading(false);
    };
    reader.onerror = function () {
      setUploadError('Error al leer el archivo de video.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
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
    if (videoType === 'youtube' && !youtubeUrl) {
      alert('Ingresá una URL de YouTube válida.');
      return;
    }
    if (videoType === 'upload' && !customVideoUrl) {
      alert('Subí un archivo de video MP4.');
      return;
    }

    var configData = {
      title: title,
      description: description,
      videoType: videoType,
      youtubeUrl: youtubeUrl,
      customVideoUrl: customVideoUrl,
      position: position,
      videoPosition: videoPosition,
      bgColor: bgColor,
      titleColor: titleColor,
      textColor: textColor,
      titleSize: titleSize,
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
          widget_slug: 'video-texto',
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
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

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
        Nuevo widget: Video y Texto ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Explicá tu producto con video:</strong> Combiná un texto explicativo con un video descriptivo de YouTube o MP4 para aumentar la tasa de conversión.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO
        </div>

        <div style={{
          backgroundColor: bgColor,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          maxWidth: '680px',
          margin: '0 auto',
          border: campaignTheme !== 'none' && CAMPAIGN_THEMES[campaignTheme] ? '2px solid ' + CAMPAIGN_THEMES[campaignTheme].border : '1px solid #E5E7EB'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: videoPosition === 'right' ? 'row' : 'row-reverse',
              gap: '20px',
              width: '100%',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* BLOQUE TEXTO */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                {title ? (
                  <div style={{
                    fontSize: titleSize + 'px',
                    fontWeight: 800,
                    color: titleColor,
                    marginBottom: '10px',
                    lineHeight: 1.3
                  }}>
                    {title}
                  </div>
                ) : null}

                {description ? (
                  <div style={{
                    fontSize: textSize + 'px',
                    color: textColor,
                    lineHeight: 1.5
                  }}>
                    {description}
                  </div>
                ) : null}
              </div>

              {/* BLOQUE VIDEO */}
              <div style={{ flex: 1, minWidth: '240px', width: '100%' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#000000',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {videoType === 'youtube' ? (
                    embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title="YouTube video"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '13px' }}>
                        ▶️ Pegá un enlace de YouTube
                      </div>
                    )
                  ) : (
                    customVideoUrl ? (
                      <video
                        src={customVideoUrl}
                        controls
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '13px' }}>
                        🎥 Subí un video MP4
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '🎥 General' },
          { id: 'ubicacion', label: '📍 Ubicación' },
          { id: 'estilos', label: '🎨 Estilos' },
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
              📝 Contenido
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Título del video
              </label>
              <input
                type="text"
                value={title}
                onChange={function (e) { setTitle(e.target.value); }}
                placeholder="Ej: ¿Cómo usar nuestro producto?"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Descripción
              </label>
              <textarea
                value={description}
                onChange={function (e) { setDescription(e.target.value); }}
                placeholder="Describí los detalles más importantes..."
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              🎬 Video
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={function () { setVideoType('youtube'); }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: videoType === 'youtube' ? '2px solid #10B981' : '1px solid #E5E7EB',
                  backgroundColor: videoType === 'youtube' ? '#ECFDF5' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🔴 YouTube
              </button>
              <button
                type="button"
                onClick={function () { setVideoType('upload'); }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: videoType === 'upload' ? '2px solid #10B981' : '1px solid #E5E7EB',
                  backgroundColor: videoType === 'upload' ? '#ECFDF5' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                📤 Subir video
              </button>
            </div>

            {videoType === 'youtube' ? (
              <div>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  URL de YouTube
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={function (e) { setYoutubeUrl(e.target.value); }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
                />
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
                  Pegá el enlace directo de YouTube o de un video Short.
                </div>
              </div>
            ) : (
              <div style={{ border: '2px dashed #10B981', borderRadius: '12px', padding: '20px', textAlign: 'center', backgroundColor: '#F0FDF4' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎥</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>
                  Seleccionar archivo MP4
                </div>
                <div style={{ fontSize: '12px', color: '#047857', marginBottom: '12px' }}>
                  Máximo 15 MB por video
                </div>

                <label style={{
                  backgroundColor: '#10B981',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  display: 'inline-block'
                }}>
                  {isUploading ? 'Cargando video...' : '📁 Explorar video'}
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                  />
                </label>

                {uploadError ? (
                  <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '10px', fontWeight: 600 }}>
                    ⚠️ {uploadError}
                  </div>
                ) : null}

                {customVideoUrl ? (
                  <div style={{ fontSize: '12px', color: '#059669', marginTop: '10px', fontWeight: 700 }}>
                    ✅ Video cargado correctamente
                  </div>
                ) : null}
              </div>
            )}
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
            Posición del widget en la ficha de producto
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
                  El widget se muestra dentro de la sección de información del producto, arriba de la descripción.
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
        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === 'estilos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              🎨 Apariencia general
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Color de fondo
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                  style={{ width: '44px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={function (e) { handleColorChange(setBgColor, e.target.value); }}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                />
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
              📐 Tamaño de letra
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño del título: {titleSize}px
              </label>
              <input
                type="range"
                min={16}
                max={36}
                step={1}
                value={titleSize}
                onChange={function (e) { setTitleSize(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño del texto: {textSize}px
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
              ⚙️ Disposición del video
            </div>

            <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>
              Posición del video
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={function () { setVideoPosition('left'); }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: videoPosition === 'left' ? '2px solid #10B981' : '1px solid #E5E7EB',
                  backgroundColor: videoPosition === 'left' ? '#ECFDF5' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                👈 Izquierda
              </button>
              <button
                type="button"
                onClick={function () { setVideoPosition('right'); }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: videoPosition === 'right' ? '2px solid #10B981' : '1px solid #E5E7EB',
                  backgroundColor: videoPosition === 'right' ? '#ECFDF5' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                👉 Derecha
              </button>
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
              onClick={function () { applyPresetTheme('none'); setBgColor('#fafafa'); setTitleColor('#111827'); setTextColor('#4B5563'); }}
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
          {saving ? 'Guardando widget...' : '💾 Guardar Video y Texto'}
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
