'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

type TabType = 'general' | 'ubicacion' | 'estilos' | 'fechas';

interface ImageItem {
  id: string;
  url: string;
  title?: string;
}

interface SliderImagenesEditorProps {
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
  'black-friday': { bg: '#111827', text: '#ffffff', border: '#374151', accent: '#F59E0B' },
  'hot-sale': { bg: '#0F172A', text: '#ffffff', border: '#1e293b', accent: '#EF4444' },
  'cyber-monday': { bg: '#090D16', text: '#ffffff', border: '#1e3a5f', accent: '#3B82F6' },
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

function compressImage(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        var w = img.width;
        var h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas no disponible'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = function () {
        reject(new Error('No se pudo leer la imagen'));
      };
      if (ev.target && typeof ev.target.result === 'string') {
        img.src = ev.target.result;
      } else {
        reject(new Error('Error al leer archivo'));
      }
    };
    reader.onerror = function () {
      reject(new Error('Error al leer archivo'));
    };
    reader.readAsDataURL(file);
  });
}

export default function SliderImagenesEditor({
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
}: SliderImagenesEditorProps) {
  const [activeTab, setActiveTab] = useState('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const [title, setTitle] = useState(cfg.title || '');
  const [position, setPosition] = useState(cfg.position || 'before-description');
  const [images, setImages] = useState(cfg.images || []);

  const [speed, setSpeed] = useState(typeof cfg.speed === 'number' ? cfg.speed : 0.8);
  const [imageSize, setImageSize] = useState(typeof cfg.imageSize === 'number' ? cfg.imageSize : 250);
  const [borderRadius, setBorderRadius] = useState(typeof cfg.borderRadius === 'number' ? cfg.borderRadius : 10);
  const [titleAlign, setTitleAlign] = useState(cfg.titleAlign || 'left');
  const [titleColor, setTitleColor] = useState(cfg.titleColor || '#000000');
  const [titleSize, setTitleSize] = useState(typeof cfg.titleSize === 'number' ? cfg.titleSize : 22);
  const [bgColor, setBgColor] = useState(cfg.bgColor || '#ffffff');
  const [gap, setGap] = useState(typeof cfg.gap === 'number' ? cfg.gap : 12);

  const [disableModal, setDisableModal] = useState(!!cfg.disableModal);
  const [modalControlsColor, setModalControlsColor] = useState(cfg.modalControlsColor || '#333333');

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const handleFileUpload = async function (e: React.ChangeEvent<HTMLInputElement>) {
    var files = e.target.files;
    if (!files || files.length === 0) return;

    var remaining = 10 - images.length;
    if (remaining <= 0) {
      setUploadError('Podés agregar hasta un máximo de 10 imágenes.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      var list = Array.prototype.slice.call(files, 0, remaining);
      var next = images.slice();
      var i;
      for (i = 0; i < list.length; i++) {
        var file = list[i];
        if (!file.type || file.type.indexOf('image/') !== 0) {
          setUploadError('Solo se permiten imágenes JPG o PNG.');
          continue;
        }
        if (file.size > 2 * 1024 * 1024) {
          setUploadError('Cada imagen debe pesar máximo 2 MB. Comprimila antes de subir.');
          continue;
        }
        var dataUrl = await compressImage(file, 1200, 0.78);
        next.push({
          id: 'img_' + Date.now() + '_' + i,
          url: dataUrl,
          title: '',
        });
      }
      setImages(next);
    } catch (err: any) {
      setUploadError(err.message || 'Ocurrió un error al subir las imágenes.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = function (id: string) {
    setImages(images.filter(function (img: ImageItem) {
      return img.id !== id;
    }));
  };

  const handleMoveImage = function (index: number, dir: number) {
    var target = index + dir;
    if (target < 0 || target >= images.length) return;
    var next = images.slice();
    var tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    setImages(next);
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTitleColor(th.text);
      setModalControlsColor(th.accent);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async function () {
    if (!images || images.length < 1) {
      alert('Agregá al menos 1 imagen para guardar el slider.');
      return;
    }

    var configData = {
      title: title,
      position: position,
      images: images,
      speed: speed,
      imageSize: imageSize,
      borderRadius: borderRadius,
      titleAlign: titleAlign,
      titleColor: titleColor,
      titleSize: titleSize,
      bgColor: bgColor,
      gap: gap,
      disableModal: disableModal,
      modalControlsColor: modalControlsColor,
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
          widget_slug: 'slider-imagenes',
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

  var previewDuration = speed <= 0 ? 0 : Math.max(8, Math.round(40 - speed * 28));

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
        Nuevo widget: Slider de Imágenes ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Carrusel automático de imágenes:</strong> Subí fotos de tu producto, looks o detalles. El slider se mueve solo en horizontal y puede abrirse en grande al hacer click.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO
        </div>

        <div style={{
          backgroundColor: bgColor,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          maxWidth: '520px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          {title ? (
            <div style={{
              fontSize: titleSize + 'px',
              fontWeight: 800,
              color: titleColor,
              textAlign: titleAlign === 'center' ? 'center' : 'left',
              marginBottom: '12px'
            }}>
              {title}
            </div>
          ) : null}

          {images.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 10px', border: '2px dashed #D1D5DB', borderRadius: '12px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Subí imágenes para ver la vista previa</div>
            </div>
          ) : (
            <div style={{ overflow: 'hidden', width: '100%' }}>
              <div style={{
                display: 'flex',
                gap: gap + 'px',
                width: 'max-content',
                animation: speed > 0 ? 'nvxSlidePreview ' + previewDuration + 's linear infinite' : 'none'
              }}>
                {images.concat(images).map(function (img: ImageItem, idx: number) {
                  return (
                    <div
                      key={img.id + '_' + idx}
                      style={{
                        width: imageSize + 'px',
                        height: Math.round(imageSize * 1.15) + 'px',
                        borderRadius: borderRadius + 'px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#F3F4F6',
                        border: '1px solid rgba(0,0,0,0.06)'
                      }}
                    >
                      <img
                        src={img.url}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes nvxSlidePreview {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '🖼️ General' },
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Título (opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={function (e) { setTitle(e.target.value); }}
              placeholder="Ej: Nuestros productos"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ border: '2px dashed #10B981', borderRadius: '12px', padding: '24px', textAlign: 'center', backgroundColor: '#F0FDF4' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>
              Imágenes (mínimo 1, máximo 10)
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginBottom: '16px' }}>
              JPG o PNG · Máximo 2 MB cada una · Se comprimen automáticamente
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
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
              opacity: isUploading ? 0.7 : 1
            }}>
              {isUploading ? 'Subiendo...' : '📷 Seleccionar imágenes'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
            </label>

            {uploadError ? (
              <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '12px', fontWeight: 600 }}>
                ⚠️ {uploadError}
              </div>
            ) : null}

            <div style={{ fontSize: '12px', color: '#059669', marginTop: '12px', fontWeight: 700 }}>
              Imágenes: {images.length}/10
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 12px' }}>
            💡 Comprimí tus imágenes antes de subirlas para mejorar el tiempo de carga. Recomendado: ancho máximo 1200px.
          </div>

          {images.length > 0 ? (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>
                Imágenes agregadas ({images.length}/10)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {images.map(function (img: ImageItem, idx: number) {
                  return (
                    <div
                      key={img.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px'
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280', width: '24px' }}>#{idx + 1}</span>
                      <img
                        src={img.url}
                        alt=""
                        style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, backgroundColor: '#F3F4F6' }}
                      />
                      <div style={{ flex: 1, fontSize: '12px', color: '#6B7280' }}>
                        Imagen {idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={function () { handleMoveImage(idx, -1); }}
                        disabled={idx === 0}
                        style={{
                          backgroundColor: '#F3F4F6',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          opacity: idx === 0 ? 0.4 : 1
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={function () { handleMoveImage(idx, 1); }}
                        disabled={idx === images.length - 1}
                        style={{
                          backgroundColor: '#F3F4F6',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: idx === images.length - 1 ? 0.4 : 1
                        }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={function () { handleRemoveImage(img.id); }}
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#EF4444',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

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
            Posición del widget
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
                  El slider aparece debajo del botón &quot;Agregar al carrito&quot;, dentro de la columna del producto.
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
                  El slider se muestra después de toda la sección del producto, a ancho completo.
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
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
              ▶️ Carrusel
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
              Controlá el movimiento del slider.
            </div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>
              Velocidad: {speed <= 0 ? 'Quieto' : speed.toFixed(1)}
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={speed}
              onChange={function (e) { setSpeed(parseFloat(e.target.value)); }}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
              <span>Quieto</span>
              <span>Rápido</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              🎨 Apariencia general
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

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño de fuente del título: {titleSize}px
              </label>
              <input
                type="range"
                min={14}
                max={36}
                step={1}
                value={titleSize}
                onChange={function (e) { setTitleSize(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Tamaño de imagen: {imageSize}px
              </label>
              <input
                type="range"
                min={100}
                max={500}
                step={10}
                value={imageSize}
                onChange={function (e) { setImageSize(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                <span>100px</span>
                <span>500px</span>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Borde redondeado: {borderRadius}px
              </label>
              <input
                type="range"
                min={0}
                max={40}
                step={1}
                value={borderRadius}
                onChange={function (e) { setBorderRadius(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                <span>Recto</span>
                <span>Redondo</span>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>
                Alineación del título
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={function () { setTitleAlign('left'); }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: titleAlign === 'left' ? '2px solid #10B981' : '1px solid #E5E7EB',
                    backgroundColor: titleAlign === 'left' ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ☰ Izquierda
                </button>
                <button
                  type="button"
                  onClick={function () { setTitleAlign('center'); }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: titleAlign === 'center' ? '2px solid #10B981' : '1px solid #E5E7EB',
                    backgroundColor: titleAlign === 'center' ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ≡ Centrado
                </button>
              </div>
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
                <button
                  type="button"
                  onClick={function () { handleColorChange(setBgColor, '#ffffff'); }}
                  title="Limpiar"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#6B7280'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Espacio entre imágenes: {gap}px
              </label>
              <input
                type="range"
                min={0}
                max={32}
                step={2}
                value={gap}
                onChange={function (e) { setGap(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
              🔍 Modal de imagen
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
              Configurá el comportamiento al hacer click en una imagen.
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer',
                marginBottom: '14px'
              }}
            >
              <input
                type="checkbox"
                checked={disableModal}
                onChange={function (e) { setDisableModal(e.target.checked); }}
                style={{ marginTop: '2px', accentColor: '#10B981' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>Desactivar expandir imagen</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  Al marcar esto, el click en una imagen no abre el modal.
                </div>
              </div>
            </label>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Color de controles del modal
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={modalControlsColor}
                  onChange={function (e) { handleColorChange(setModalControlsColor, e.target.value); }}
                  style={{ width: '44px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={modalControlsColor}
                  onChange={function (e) { handleColorChange(setModalControlsColor, e.target.value); }}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>
                Flechas de navegación y botón cerrar
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === 'fechas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '14px 16px', fontSize: '13px', color: '#92400E' }}>
            🔥 Elegí un preset de campaña. Se aplican colores automáticamente al fondo, título y controles. Si después tocás un color manual, el preset se desactiva.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={function () { applyPresetTheme('none'); setBgColor('#ffffff'); setTitleColor('#000000'); setModalControlsColor('#333333'); }}
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
          {saving ? 'Guardando widget...' : '💾 Guardar Slider de Imágenes'}
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
