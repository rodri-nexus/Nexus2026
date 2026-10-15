'use client';

import React, { useState } from 'react';

type TabType = 'general' | 'ubicacion' | 'estilos';

interface VideoItem {
  id: string;
  url: string;
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface VideoFlotanteEditorProps {
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

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; accent: string; btn: string; btnText: string }> = {
  'black-friday': { bg: '#111827', text: '#ffffff', border: '#374151', accent: '#F59E0B', btn: '#F59E0B', btnText: '#111827' },
  'hot-sale': { bg: '#0F172A', text: '#ffffff', border: '#1e293b', accent: '#EF4444', btn: '#EF4444', btnText: '#ffffff' },
  'cyber-monday': { bg: '#090D16', text: '#ffffff', border: '#1e3a5f', accent: '#3B82F6', btn: '#3B82F6', btnText: '#ffffff' },
  'navidad': { bg: '#064E3B', text: '#ffffff', border: '#047857', accent: '#EF4444', btn: '#EF4444', btnText: '#ffffff' },
  'san-valentin': { bg: '#831843', text: '#ffffff', border: '#9d174d', accent: '#F43F5E', btn: '#F43F5E', btnText: '#ffffff' },
  'dia-padre-madre': { bg: '#312E81', text: '#ffffff', border: '#4338ca', accent: '#10B981', btn: '#10B981', btnText: '#ffffff' },
  'liquidacion': { bg: '#7F1D1D', text: '#ffffff', border: '#991b1b', accent: '#FBBF24', btn: '#FBBF24', btnText: '#7F1D1D' }
};

function cleanVideoTitle(raw: string, fallbackIndex: number) {
  if (!raw) return 'Video ' + fallbackIndex;
  var t = String(raw).trim();
  var looksUgly =
    /^[0-9_\-]+$/.test(t) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(t) ||
    t.length > 40 ||
    /_all_/i.test(t) ||
    /^VID_/i.test(t) ||
    /^IMG_/i.test(t);
  if (looksUgly) return 'Video ' + fallbackIndex;
  return t;
}

export default function VideoFlotanteEditor({
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
}: VideoFlotanteEditorProps) {
  const [activeTab, setActiveTab] = useState('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const initialVideos = (cfg.videos || []).map(function (v: VideoItem, idx: number) {
    return {
      id: v.id || ('v_' + idx),
      url: v.url || '',
      title: cleanVideoTitle(v.title || '', idx + 1),
      buttonText: v.buttonText || 'Comprar ahora',
      buttonUrl: v.buttonUrl || '#',
    };
  });

  const [videos, setVideos] = useState<VideoItem[]>(
    initialVideos.length > 0
      ? initialVideos
      : [
          {
            id: 'v_1',
            url: '',
            title: 'Mirá el producto en acción 🔥',
            buttonText: 'Comprar ahora',
            buttonUrl: '#',
          },
        ]
  );

  const [position, setPosition] = useState(cfg.position || 'bottom-left');
  const [buttonSize, setButtonSize] = useState(cfg.buttonSize ?? 110);
  const [buttonRadius, setButtonRadius] = useState(cfg.buttonRadius ?? 90);
  const [buttonFormat, setButtonFormat] = useState(cfg.buttonFormat || 'square');
  const [showPlayIcon, setShowPlayIcon] = useState(cfg.showPlayIcon ?? true);

  const [showCloseIcon, setShowCloseIcon] = useState(cfg.showCloseIcon ?? true);
  const [closeIconColor, setCloseIconColor] = useState(cfg.closeIconColor || '#191919');
  const [closeIconSize, setCloseIconSize] = useState(cfg.closeIconSize ?? 14);

  const [animation, setAnimation] = useState(cfg.animation || 'pulse');

  const [ctaBgColor, setCtaBgColor] = useState(cfg.ctaBgColor || '#10B981');
  const [ctaTextColor, setCtaTextColor] = useState(cfg.ctaTextColor || '#ffffff');
  const [ctaRadius, setCtaRadius] = useState(cfg.ctaRadius ?? 12);
  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('El video supera el límite permitido de 10 MB.');
      return;
    }

    if (videos.length >= 5) {
      setUploadError('Podés agregar hasta un máximo de 5 videos.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const activeWidgetId = widgetId || existingWidget?.id;
      if (activeWidgetId) formData.append('widget_id', String(activeWidgetId));

      const res = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al subir el video');
      }

      const nextIndex = videos.length + 1;
      const rawName = (file.name || '').replace(/\.[^/.]+$/, '');
      const newVideo: VideoItem = {
        id: 'v_' + Date.now(),
        url: data.url,
        title: cleanVideoTitle(rawName, nextIndex),
        buttonText: 'Comprar ahora',
        buttonUrl: '#',
      };

      setVideos([...videos, newVideo]);
    } catch (err: any) {
      setUploadError(err.message || 'Ocurrió un error al subir el video.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveVideo = (id: string) => {
    if (videos.length <= 1) return;
    setVideos(videos.filter((v: VideoItem) => v.id !== id));
  };

  const handleUpdateVideo = (id: string, field: keyof VideoItem, val: string) => {
    setVideos(
      videos.map(function (v: VideoItem) {
        if (v.id === id) {
          return { ...v, [field]: val };
        }
        return v;
      })
    );
  };

  const applyPresetTheme = (themeKey: string) => {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      const th = CAMPAIGN_THEMES[themeKey];
      setCtaBgColor(th.btn);
      setCtaTextColor(th.btnText);
    }
  };

  const handleColorChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async () => {
    const cleanedVideos = videos.map(function (v: VideoItem, idx: number) {
      return {
        id: v.id,
        url: v.url,
        title: cleanVideoTitle(v.title || '', idx + 1),
        buttonText: v.buttonText || 'Comprar ahora',
        buttonUrl: v.buttonUrl || '#',
      };
    });

    const configData = {
      videos: cleanedVideos,
      position,
      buttonSize,
      buttonRadius,
      buttonFormat,
      showPlayIcon,
      showCloseIcon,
      closeIconColor,
      closeIconSize,
      animation,
      ctaBgColor,
      ctaTextColor,
      ctaRadius,
      campaignTheme,
      ...(categoryId ? { category_id: String(categoryId) } : {}),
    };

    const finalTargetType = effectiveTargetType;
    const finalProductId = productId || targetProductId || existingWidget?.target_product_id || null;
    const finalCategoryId = categoryId || existingWidget?.target_category_id || null;

    if (onSave) {
      await onSave({
        config: configData,
        target_type: finalTargetType,
        target_product_id: finalProductId,
        target_category_id: finalCategoryId,
      });
      window.location.href = '/widgets';
      return;
    }

    setIsSavingInternal(true);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id || undefined,
          store_id: storeId ? String(storeId) : undefined,
          widget_slug: 'video-flotante',
          config: configData,
          is_active: true,
          target_type: finalTargetType,
          target_product_id: finalProductId ? String(finalProductId) : null,
          target_category_id: finalCategoryId ? String(finalCategoryId) : null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
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
        Nuevo widget: Video flotante ({scopeLabel})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Aumentá la interacción en la tienda:</strong> Muestra un botón circular o vertical flotante que captura la atención. Al hacer clic, reproduce tus videos con botón directo de compra.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
          VISTA PREVIA DEL BOTÓN FLOTANTE
        </div>

        <div style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px', color: '#9CA3AF', fontWeight: 600 }}>Página de la tienda</span>

          {/* BOTON FLOTANTE DE SIMULACIÓN */}
          <div style={{
            position: 'relative',
            width: (buttonFormat === 'vertical' ? buttonSize * 0.75 : buttonSize) + 'px',
            height: buttonSize + 'px',
            borderRadius: buttonRadius + 'px',
            backgroundColor: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            {videos[0]?.url ? (
              <video src={videos[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
            ) : (
              <div style={{ fontSize: '28px' }}>🎬</div>
            )}

            {showPlayIcon && (
              <div style={{
                position: 'absolute',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827',
                fontSize: '14px',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                ▶
              </div>
            )}

            {showCloseIcon && (
              <div style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                width: (closeIconSize * 1.8) + 'px',
                height: (closeIconSize * 1.8) + 'px',
                borderRadius: '50%',
                backgroundColor: closeIconColor,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: closeIconSize + 'px',
                fontWeight: 800
              }}>
                ✕
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '4px' }}>
        <button type="button" onClick={() => setActiveTab('general')} style={{
          padding: '10px 16px', fontSize: '14px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer',
          borderBottom: activeTab === 'general' ? '3px solid #10B981' : 'none',
          color: activeTab === 'general' ? '#10B981' : '#6B7280'
        }}>
          📽️ Videos ({videos.length})
        </button>
        <button type="button" onClick={() => setActiveTab('ubicacion')} style={{
          padding: '10px 16px', fontSize: '14px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer',
          borderBottom: activeTab === 'ubicacion' ? '3px solid #10B981' : 'none',
          color: activeTab === 'ubicacion' ? '#10B981' : '#6B7280'
        }}>
          📍 Ubicación
        </button>
        <button type="button" onClick={() => setActiveTab('estilos')} style={{
          padding: '10px 16px', fontSize: '14px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer',
          borderBottom: activeTab === 'estilos' ? '3px solid #10B981' : 'none',
          color: activeTab === 'estilos' ? '#10B981' : '#6B7280'
        }}>
          🎨 Estilos & Fechas
        </button>
      </div>

      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ border: '2px dashed #10B981', borderRadius: '12px', padding: '24px', textAlign: 'center', backgroundColor: '#F0FDF4' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📤</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>
              Cargá los videos del reproductor
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginBottom: '16px' }}>
              Mínimo 1, máximo 5 videos (Hasta 10 MB por video · MP4, MOV, WEBM)
            </div>

            <label style={{
              backgroundColor: '#10B981',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: isUploading ? 'not-allowed' : 'pointer',
              display: 'inline-block',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
            }}>
              {isUploading ? 'Subiendo video...' : '📱 Seleccionar de la galería'}
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={handleFileUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
            </label>

            {uploadError && (
              <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '12px', fontWeight: 600 }}>
                ⚠️ {uploadError}
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Lista de Videos ({videos.length}/5)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {videos.map((v: VideoItem, idx: number) => (
                <div key={v.id} style={{
                  padding: '14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280' }}>VIDEO #{idx + 1}</span>
                    {videos.length > 1 && (
                      <button
                        type="button"
                        onClick={function () { handleRemoveVideo(v.id); }}
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#EF4444',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        URL o Video Subido
                      </label>
                      <input
                        type="text"
                        value={v.url || ''}
                        onChange={function (e) { handleUpdateVideo(v.id, 'url', e.target.value); }}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Título del video
                      </label>
                      <input
                        type="text"
                        value={v.title || ''}
                        onChange={function (e) { handleUpdateVideo(v.id, 'title', e.target.value); }}
                        placeholder="Ej: Mirá cómo luce en persona ✨"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Texto Botón de Acción (CTA)
                      </label>
                      <input
                        type="text"
                        value={v.buttonText || ''}
                        onChange={function (e) { handleUpdateVideo(v.id, 'buttonText', e.target.value); }}
                        placeholder="Comprar ahora"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Link Botón de Acción
                      </label>
                      <input
                        type="text"
                        value={v.buttonUrl || ''}
                        onChange={function (e) { handleUpdateVideo(v.id, 'buttonUrl', e.target.value); }}
                        placeholder="https://tutienda.com/..."
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ubicacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '8px' }}>
              Posición del botón flotante
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { id: 'bottom-left', label: 'Inferior izquierda', desc: 'Esquina inferior izquierda' },
                { id: 'bottom-right', label: 'Inferior derecha', desc: 'Esquina inferior derecha' },
                { id: 'top-left', label: 'Superior izquierda', desc: 'Esquina superior izquierda' },
                { id: 'top-right', label: 'Superior derecha', desc: 'Esquina superior derecha' },
                { id: 'middle-left', label: 'Izquierda al medio', desc: 'Centrado vertical a la izquierda' },
                { id: 'middle-right', label: 'Derecha al medio', desc: 'Centrado vertical a la derecha' }
              ].map((pos) => (
                <label
                  key={pos.id}
                  onClick={() => setPosition(pos.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: position === pos.id ? '2px solid #10B981' : '1px solid #E5E7EB',
                    backgroundColor: position === pos.id ? '#ECFDF5' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{pos.label}</span>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>{pos.desc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'estilos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0 }}>Botón Flotante</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Tamaño del botón ({buttonSize}px)
              </label>
              <input type="range" min="80" max="180" value={buttonSize} onChange={(e) => setButtonSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Redondeo del botón ({buttonRadius}px)
              </label>
              <input type="range" min="0" max="90" value={buttonRadius} onChange={(e) => setButtonRadius(Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Formato del botón</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setButtonFormat('square')} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: buttonFormat === 'square' ? '2px solid #10B981' : '1px solid #D1D5DB', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Cuadrado (1:1)
                </button>
                <button type="button" onClick={() => setButtonFormat('vertical')} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: buttonFormat === 'vertical' ? '2px solid #10B981' : '1px solid #D1D5DB', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Vertical (9:16)
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Efecto de animación</label>
              <select value={animation} onChange={(e) => setAnimation(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}>
                <option value="pulse">Aureola pulsante</option>
                <option value="bounce">Efecto rebote</option>
                <option value="none">Sin animación</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              <input type="checkbox" checked={showPlayIcon} onChange={(e) => setShowPlayIcon(e.target.checked)} style={{ accentColor: '#10B981' }} />
              Mostrar ícono de play
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              <input type="checkbox" checked={showCloseIcon} onChange={(e) => setShowCloseIcon(e.target.checked)} style={{ accentColor: '#10B981' }} />
              Mostrar botón de cerrar X
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />

          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0 }}>Botón de Acción (CTA)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color Fondo CTA</label>
              <input type="color" value={ctaBgColor} onChange={(e) => handleColorChange(setCtaBgColor, e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color Texto CTA</label>
              <input type="color" value={ctaTextColor} onChange={(e) => handleColorChange(setCtaTextColor, e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '8px' }}>
              🔥 Fechas Especiales (Presets de Campaña)
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.keys(CAMPAIGN_THEMES).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPresetTheme(key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: campaignTheme === key ? '2px solid #10B981' : '1px solid #D1D5DB',
                    backgroundColor: campaignTheme === key ? '#ECFDF5' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {key.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
          }}
        >
          {saving ? 'Guardando widget...' : '💾 Guardar Video Flotante'}
        </button>
        <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', marginTop: '10px' }}>
          Al guardar vas a volver a <strong>Mis Widgets</strong>
        </p>
      </div>
    </div>
  );
                                                   }
