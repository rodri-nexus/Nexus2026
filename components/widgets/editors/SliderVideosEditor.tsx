'use client';

import React, { useState } from 'react';

// Declaración de interfaces y tipos al INICIO (Regla #9 y #30)
type TabType = 'general' | 'ubicacion' | 'estilos';
type DisplayFormat = 'slider' | 'circles';
type VideoPosition = 'before-cart' | 'after-description';
type AutoplayMode = 'muted' | 'sound' | 'none';

interface VideoItem {
  id: string;
  url: string;
  title?: string;
}

interface SliderVideosEditorProps {
  initialConfig?: any;
  widgetId?: string;
  targetType?: 'product' | 'all' | 'category';
  targetProductId?: string;
  categoryId?: string | number | null;
  onSave: (config: any) => Promise<void>;
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

export default function SliderVideosEditor({
  initialConfig = {},
  widgetId,
  targetType = 'all',
  targetProductId,
  categoryId,
  onSave,
  isSaving = false,
}: SliderVideosEditorProps) {
  const [activeTab, setActiveTab] = useState('general');

  // Configuración del widget
  const [title, setTitle] = useState(initialConfig.title || 'MIRA NUESTROS PRODUCTOS EN ACCIÓN');
  const [subtitle, setSubtitle] = useState(initialConfig.subtitle || 'Videos reales de clientes y demostraciones');
  const [displayFormat, setDisplayFormat] = useState(initialConfig.displayFormat || 'slider');
  const [position, setPosition] = useState(initialConfig.position || 'before-cart');
  const [autoplay, setAutoplay] = useState(initialConfig.autoplay || 'muted');
  const [videos, setVideos] = useState(initialConfig.videos || []);
  
  // Estilos
  const [bgColor, setBgColor] = useState(initialConfig.bgColor || '#ffffff');
  const [textColor, setTextColor] = useState(initialConfig.textColor || '#111827');
  const [accentColor, setAccentColor] = useState(initialConfig.accentColor || '#10B981');
  const [borderRadius, setBorderRadius] = useState(initialConfig.borderRadius || 16);
  const [titleAlign, setTitleAlign] = useState(initialConfig.titleAlign || 'center');
  const [campaignTheme, setCampaignTheme] = useState(initialConfig.campaignTheme || 'none');
  
  // Botón CTA dentro del video
  const [ctaText, setCtaText] = useState(initialConfig.ctaText || 'Comprar ahora');
  const [ctaBgColor, setCtaBgColor] = useState(initialConfig.ctaBgColor || '#111827');
  const [ctaTextColor, setCtaTextColor] = useState(initialConfig.ctaTextColor || '#ffffff');

  // Estados de subida
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isCategory = targetType === 'category' || !!categoryId;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  // Manejador de subida de video
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('El video supera el límite permitido de 10 MB.');
      return;
    }

    if (videos.length >= 10) {
      setUploadError('Podés agregar hasta un máximo de 10 videos.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (widgetId) formData.append('widget_id', widgetId);

      const res = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al subir el video');
      }

      const newVideo: VideoItem = {
        id: 'v_' + Date.now(),
        url: data.url,
        title: file.name.replace(/\.[^/.]+$/, ''),
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
    setVideos(videos.filter((v: VideoItem) => v.id !== id));
  };

  const applyPresetTheme = (themeKey: string) => {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      const th = CAMPAIGN_THEMES[themeKey];
      setBgColor(th.bg);
      setTextColor(th.text);
      setAccentColor(th.accent);
      setCtaBgColor(th.btn);
      setCtaTextColor(th.btnText);
    }
  };

  const handleColorChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async () => {
    const config = {
      title,
      subtitle,
      displayFormat,
      position,
      autoplay,
      videos,
      bgColor,
      textColor,
      accentColor,
      borderRadius,
      titleAlign,
      campaignTheme,
      ctaText,
      ctaBgColor,
      ctaTextColor,
      ...(categoryId ? { category_id: String(categoryId) } : {}),
    };

    await onSave({
      config,
      target_type: targetType,
      target_product_id: targetProductId || null,
      target_category_id: categoryId ? String(categoryId) : null,
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Scope Chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '999px',
          backgroundColor: isCategory ? '#FEF3C7' : isForAll ? '#D1FAE5' : '#E0E7FF',
          color: isCategory ? '#D97706' : isForAll ? '#059669' : '#3730A3',
          border: `1px solid ${isCategory ? '#FCD34D' : isForAll ? '#6EE7B7' : '#A5B4FC'}`
        }}>
          {isCategory ? '🏷️' : isForAll ? '🏪' : '📦'} {scopeLabel}
        </span>
      </div>

      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
        Slider de Videos (Reels / Shorts)
      </h1>

      {/* Info Box */}
      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Aumentá la conversión mostrando tu producto en movimiento:</strong> Subí videos verticales tipo Reels desde tu celular. Los clientes podrán verlos deslizándolos o en formato Stories.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO DE LA TIENDA
        </div>

        <div style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: `${borderRadius}px`,
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {title && (
            <div style={{ fontSize: '16px', fontWeight: 800, textAlign: titleAlign as any, marginBottom: '4px', color: textColor }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: '12px', opacity: 0.8, textAlign: titleAlign as any, marginBottom: '16px', color: textColor }}>
              {subtitle}
            </div>
          )}

          {/* Renderizado de vista previa según el formato elegido */}
          {videos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', border: '2px dashed #D1D5DB', borderRadius: '12px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎬</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Sube videos para ver la vista previa aquí</div>
            </div>
          ) : displayFormat === 'circles' ? (
            /* Vista previa formato CÍRCULOS (Stories) */
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {videos.map((v: VideoItem) => (
                <div key={v.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    padding: '3px',
                    background: `linear-gradient(45deg, ${accentColor}, #F59E0B)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <video src={v.url} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.title || 'Video'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Vista previa formato SLIDER */
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {videos.map((v: VideoItem) => (
                <div key={v.id} style={{
                  position: 'relative',
                  width: '130px',
                  height: '220px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#000'
                }}>
                  <video src={v.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '8px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.title || 'Video'}
                    </span>
                    <button type="button" style={{
                      backgroundColor: ctaBgColor,
                      color: ctaTextColor,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px',
                      fontSize: '9px',
                      fontWeight: 800,
                      width: '100%'
                    }}>
                      {ctaText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABS DE CONFIGURACIÓN */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '4px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'general' ? '3px solid #10B981' : 'none',
            color: activeTab === 'general' ? '#10B981' : '#6B7280'
          }}>
          📽️ Videos ({videos.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ubicacion')}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'ubicacion' ? '3px solid #10B981' : 'none',
            color: activeTab === 'ubicacion' ? '#10B981' : '#6B7280'
          }}>
          📍 Ubicación & Formato
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('estilos')}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'estilos' ? '3px solid #10B981' : 'none',
            color: activeTab === 'estilos' ? '#10B981' : '#6B7280'
          }}>
          🎨 Diseño & Fechas
        </button>
      </div>

      {/* CONTENIDO DE TABS */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Zona Drag & Drop / Subida de Archivos */}
          <div style={{ border: '2px dashed #10B981', borderRadius: '12px', padding: '24px', textAlign: 'center', backgroundColor: '#F0FDF4' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📤</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>
              Cargá tus videos verticales
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginBottom: '16px' }}>
              Mínimo 1, máximo 10 videos (Hasta 10 MB por video · MP4, MOV, WEBM)
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

          {/* Lista de videos subidos */}
          <div style={{ marginTop: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              Videos agregados ({videos.length}/10)
            </h3>

            {videos.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
                Aún no has agregado ningún video.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {videos.map((v: VideoItem, idx: number) => (
                  <div key={v.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280' }}>#{idx + 1}</span>
                      <video src={v.url} style={{ width: '36px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{v.title}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(v.id)}
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#EF4444',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
                      🗑️ Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {activeTab === 'ubicacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Formato de visualización */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Formatos de visualización
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDisplayFormat('slider')}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: displayFormat === 'slider' ? '2px solid #10B981' : '1px solid #E5E7EB',
                  backgroundColor: displayFormat === 'slider' ? '#ECFDF5' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                🎞️ Slider Deslizante
              </button>

              <button
                type="button"
                onClick={() => setDisplayFormat('circles')}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: displayFormat === 'circles' ? '2px solid #10B981' : '1px solid #E5E7EB',
                  backgroundColor: displayFormat === 'circles' ? '#ECFDF5' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                ⭕ Círculos (Instagram Stories)
              </button>
            </div>
          </div>

          {/* Posición en la tienda */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Posición del widget
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="pos"
                  checked={position === 'before-cart'}
                  onChange={() => setPosition('before-cart')}
                  style={{ accentColor: '#10B981' }}
                />
                Debajo del botón "Agregar al carrito"
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="pos"
                  checked={position === 'after-description'}
                  onChange={() => setPosition('after-description')}
                  style={{ accentColor: '#10B981' }}
                />
                Después de la descripción del producto (Ancho completo)
              </label>
            </div>
          </div>

          {/* Reproducción automática */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Reproducción automática
            </label>
            <select
              value={autoplay}
              onChange={(e) => setAutoplay(e.target.value as AutoplayMode)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}>
              <option value="muted">Sí, en silencio (Recomendado)</option>
              <option value="sound">Sí, con sonido</option>
              <option value="none">No, reproducir al hacer clic</option>
            </select>
          </div>

        </div>
      )}

      {activeTab === 'estilos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Títulos y Subtítulos */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Título principal
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Subtítulo (opcional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
            />
          </div>

          {/* Texto de botón CTA dentro del video */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Texto del botón dentro del video
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
            />
          </div>

          {/* Colores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Fondo del widget</label>
              <input type="color" value={bgColor} onChange={(e) => handleColorChange(setBgColor, e.target.value)} style={{ width: '100%', height: '40px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color del texto</label>
              <input type="color" value={textColor} onChange={(e) => handleColorChange(setTextColor, e.target.value)} style={{ width: '100%', height: '40px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color de acento / Borde</label>
              <input type="color" value={accentColor} onChange={(e) => handleColorChange(setAccentColor, e.target.value)} style={{ width: '100%', height: '40px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Fondo del Botón CTA</label>
              <input type="color" value={ctaBgColor} onChange={(e) => handleColorChange(setCtaBgColor, e.target.value)} style={{ width: '100%', height: '40px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
          </div>

          {/* Fechas Especiales Presets */}
          <div style={{ marginTop: '12px' }}>
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
                  }}>
                  {key.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* BOTÓN GUARDAR Y CENTRO DE AYUDA */}
      <div style={{ marginTop: '28px', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            width: '100%',
            backgroundColor: '#10B981',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 800,
            border: 'none',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            transition: 'all 0.2s'
          }}>
          {isSaving ? 'Guardando widget...' : '💾 Guardar Slider de Videos'}
        </button>
      </div>

    </div>
  );
  }
