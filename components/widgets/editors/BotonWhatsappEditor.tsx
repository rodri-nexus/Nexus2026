'use client';

import React, { useState } from 'react';

type TabType = 'general' | 'ubicacion' | 'estilos';

interface BotonWhatsappEditorProps {
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

export default function BotonWhatsappEditor({
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
}: BotonWhatsappEditorProps) {
  const [activeTab, setActiveTab] = useState('general');

  const cfg = initialConfig || existingWidget?.config || {};

  // Estados de General
  const [agentName, setAgentName] = useState(cfg.agentName || 'Luana');
  const [agentRole, setAgentRole] = useState(cfg.agentRole || 'Atención al cliente');
  const [message, setMessage] = useState(cfg.message || 'Hola, ¿Cómo podemos ayudarte?');
  const [avatarUrl, setAvatarUrl] = useState(cfg.avatarUrl || '');
  const [hideAvatar, setHideAvatar] = useState<boolean>(cfg.hideAvatar ?? false);
  const [showPopupAuto, setShowPopupAuto] = useState<boolean>(cfg.showPopupAuto ?? true);
  const [popupDelay, setPopupDelay] = useState<number>(cfg.popupDelay ?? 5);
  const [popupFrequency, setPopupFrequency] = useState(cfg.popupFrequency || 'once');
  const [buttonText, setButtonText] = useState(cfg.buttonText || 'Empezar chat');
  const [whatsappNumber, setWhatsappNumber] = useState(cfg.whatsappNumber || '541100000000');
  const [initialMessage, setInitialMessage] = useState(cfg.initialMessage || 'Hola, quiero más información');
  const [allowCustomMessage, setAllowCustomMessage] = useState<boolean>(cfg.allowCustomMessage ?? false);
  const [showNotificationDot, setShowNotificationDot] = useState<boolean>(cfg.showNotificationDot ?? true);

  // Estados de Ubicación y Estilos
  const [position, setPosition] = useState(cfg.position || 'bottom-right');
  const [buttonColor, setButtonColor] = useState(cfg.buttonColor || '#25D366');
  const [headerColor, setHeaderColor] = useState(cfg.headerColor || '#25D366');
  const [ctaColor, setCtaColor] = useState(cfg.ctaColor || '#25D366');
  const [dotColor, setDotColor] = useState(cfg.dotColor || '#E53E3E');
  const [animation, setAnimation] = useState(cfg.animation || 'pulse');
  const [btnRounded, setBtnRounded] = useState<boolean>(cfg.btnRounded ?? true);
  const [btnSize, setBtnSize] = useState<number>(cfg.btnSize ?? 68);
  const [iconSize, setIconSize] = useState<number>(cfg.iconSize ?? 32);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const applyPresetTheme = (themeKey: string) => {
    setCampaignTheme(themeKey);
    if (themeKey !== 'none' && CAMPAIGN_THEMES[themeKey]) {
      const th = CAMPAIGN_THEMES[themeKey];
      setButtonColor(th.btn);
      setHeaderColor(th.btn);
      setCtaColor(th.btn);
    }
  };

  const handleColorChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCampaignTheme('none');
  };

  const handleSave = async () => {
    const configData = {
      agentName,
      agentRole,
      message,
      avatarUrl,
      hideAvatar,
      showPopupAuto,
      popupDelay,
      popupFrequency,
      buttonText,
      whatsappNumber,
      initialMessage,
      allowCustomMessage,
      showNotificationDot,
      position,
      buttonColor,
      headerColor,
      ctaColor,
      dotColor,
      animation,
      btnRounded,
      btnSize,
      iconSize,
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
          widget_slug: 'boton-whatsapp',
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
        Nuevo widget: Botón de WhatsApp ({scopeLabel})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <strong>Atención personalizada en vivo:</strong> Muestra un botón de WhatsApp flotante que despliega una ventana de chat profesional para cerrar ventas al instante.
        </div>
      </div>

      {/* PREVIEW EN VIVO DE LA VENTANA DE CHAT */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
          VISTA PREVIA DEL CHAT FLOTANTE
        </div>

        <div style={{ position: 'relative', width: '100%', minHeight: '340px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
          
          <div style={{ width: '100%', maxWidth: '280px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB', backgroundColor: '#ffffff', textAlign: 'left' }}>
            {/* Header del Chat */}
            <div style={{ backgroundColor: headerColor, color: '#ffffff', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!hideAvatar && (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, overflow: 'hidden' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    '👤'
                  )}
                </div>
              )}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>{agentName}</div>
                {agentRole && <div style={{ fontSize: '11px', opacity: 0.9 }}>{agentRole}</div>}
              </div>
            </div>

            {/* Mensaje */}
            <div style={{ padding: '14px', backgroundColor: '#F3F4F6' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', lineHeight: 1.4 }}>
                {message}
              </div>
            </div>

            {/* Botón CTA */}
            <div style={{ padding: '12px', backgroundColor: '#ffffff' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  backgroundColor: ctaColor,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: btnRounded ? '999px' : '8px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span>💬</span> {buttonText}
              </button>
            </div>
          </div>

          {/* Botón flotante simulado */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: btnSize + 'px',
            height: btnSize + 'px',
            borderRadius: '50%',
            backgroundColor: buttonColor,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: iconSize + 'px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            💬
            {showNotificationDot && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: dotColor, border: '2px solid #ffffff' }} />
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
          👤 Asesor & Mensaje
        </button>
        <button type="button" onClick={() => setActiveTab('ubicacion')} style={{
          padding: '10px 16px', fontSize: '14px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer',
          borderBottom: activeTab === 'ubicacion' ? '3px solid #10B981' : 'none',
          color: activeTab === 'ubicacion' ? '#10B981' : '#6B7280'
        }}>
          📍 Ubicación & Comportamiento
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Nombre de la persona *
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Luana"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Puesto / Cargo (opcional)
              </label>
              <input
                type="text"
                value={agentRole}
                onChange={(e) => setAgentRole(e.target.value)}
                placeholder="Atención al cliente"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Mensaje del cuadro de chat *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Hola, ¿Cómo podemos ayudarte?"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                URL del Avatar de la persona
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://misitio.com/foto.jpg"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hideAvatar}
                  onChange={(e) => setHideAvatar(e.target.checked)}
                  style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
                />
                Ocultar avatar de la persona
              </label>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Número de WhatsApp (con código de país) *
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="541100000000"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Texto del botón principal
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Empezar chat"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Mensaje predefinido al abrir WhatsApp
            </label>
            <input
              type="text"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Hola, quiero más información"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
            />
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
                { id: 'bottom-right', label: 'Abajo a la derecha', desc: 'Esquina inferior derecha' },
                { id: 'bottom-left', label: 'Abajo a la izquierda', desc: 'Esquina inferior izquierda' },
                { id: 'top-right', label: 'Arriba a la derecha', desc: 'Esquina superior derecha' },
                { id: 'top-left', label: 'Arriba a la izquierda', desc: 'Esquina superior izquierda' }
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

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />

          <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showPopupAuto}
                onChange={(e) => setShowPopupAuto(e.target.checked)}
                style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
              />
              💬 Mostrar popup automático de chat
            </label>

            {showPopupAuto && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Tiempo para mostrar popup ({popupDelay} seg)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={popupDelay}
                    onChange={(e) => setPopupDelay(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#10B981' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Frecuencia del popup
                  </label>
                  <select
                    value={popupFrequency}
                    onChange={(e) => setPopupFrequency(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  >
                    <option value="once">Una vez por visita</option>
                    <option value="always">Siempre en cada página</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showNotificationDot}
                onChange={(e) => setShowNotificationDot(e.target.checked)}
                style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
              />
              🔴 Mostrar punto rojo de notificación sobre el botón
            </label>
          </div>
        </div>
      )}

      {activeTab === 'estilos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color del botón flotante</label>
              <input type="color" value={buttonColor} onChange={(e) => handleColorChange(setButtonColor, e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color del header del chat</label>
              <input type="color" value={headerColor} onChange={(e) => handleColorChange(setHeaderColor, e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color del botón "Empezar chat"</label>
              <input type="color" value={ctaColor} onChange={(e) => handleColorChange(setCtaColor, e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Color de la notificación</label>
              <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Efecto del botón flotante</label>
              <select value={animation} onChange={(e) => setAnimation(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}>
                <option value="pulse">Aureola pulsante</option>
                <option value="bounce">Rebote suave</option>
                <option value="none">Sin efecto</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Bordes del botón chat</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setBtnRounded(true)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: btnRounded ? '2px solid #10B981' : '1px solid #D1D5DB', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Redondeado
                </button>
                <button type="button" onClick={() => setBtnRounded(false)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: !btnRounded ? '2px solid #10B981' : '1px solid #D1D5DB', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Sin me redondear
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Tamaño del botón ({btnSize}px)
              </label>
              <input type="range" min="50" max="90" value={btnSize} onChange={(e) => setBtnSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Tamaño del ícono ({iconSize}px)
              </label>
              <input type="range" min="20" max="48" value={iconSize} onChange={(e) => setIconSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
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
          {saving ? 'Guardando widget...' : '💾 Guardar Botón de WhatsApp'}
        </button>
        <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', marginTop: '10px' }}>
          Al guardar vas a volver a <strong>Mis Widgets</strong>
        </p>
      </div>
    </div>
  );
    }
