'use client';

import React, { useState } from 'react';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

interface CardItem {
  id: string;
  image: string;
  title: string;
  badgeText: string;
  subtitle: string;
}

interface ColumnasImagenesTextoEditorProps {
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

export default function ColumnasImagenesTextoEditor({
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
}: ColumnasImagenesTextoEditorProps) {
  const [activeTab, setActiveTab] = useState('general');

  const cfg = initialConfig || existingWidget?.config || {};

  const defaultCards: CardItem[] = [
    {
      id: 'card-1',
      image: '',
      title: 'Envío Garantizado',
      badgeText: 'GRATIS',
      subtitle: 'Llega directo a tu puerta en 24-48hs con seguimiento en vivo.'
    },
    {
      id: 'card-2',
      image: '',
      title: 'Garantía Oficial',
      badgeText: '6 MESES',
      subtitle: 'Respaldado por el fabricante con soporte técnico dedicado.'
    },
    {
      id: 'card-3',
      image: '',
      title: 'Pago Seguro',
      badgeText: 'HASTA 6 CUOTAS',
      subtitle: 'Aceptamos todas las tarjetas con encriptación SSL de 256 bits.'
    }
  ];

  const [sectionTitle, setSectionTitle] = useState(cfg.sectionTitle || 'Nuestras ventajas');
  const [sectionSubtitle, setSectionSubtitle] = useState(cfg.sectionSubtitle || 'Descubrí por qué miles de clientes nos eligen todos los días.');

  const [cards, setCards] = useState<CardItem[]>(
    Array.isArray(cfg.cards) && cfg.cards.length > 0 ? cfg.cards : defaultCards
  );

  const [position, setPosition] = useState(cfg.position || 'after-description');
  const [desktopColumns, setDesktopColumns] = useState<number>(cfg.desktopColumns || 3);
  const [cardRadius, setCardRadius] = useState(cfg.cardRadius || '12px');
  const [cardAlignment, setCardAlignment] = useState(cfg.cardAlignment || 'center');
  const [mobileLayout, setMobileLayout] = useState(cfg.mobileLayout || 'scroll');

  const [sectionBgColor, setSectionBgColor] = useState(cfg.sectionBgColor || '#fafafa');
  const [cardBgColor, setCardBgColor] = useState(cfg.cardBgColor || '#ffffff');
  const [sectionTitleColor, setSectionTitleColor] = useState(cfg.sectionTitleColor || '#111827');
  const [sectionSubtitleColor, setSectionSubtitleColor] = useState(cfg.sectionSubtitleColor || '#6b7280');
  const [cardTitleColor, setCardTitleColor] = useState(cfg.cardTitleColor || '#111827');
  const [cardSubtitleColor, setCardSubtitleColor] = useState(cfg.cardSubtitleColor || '#4b5563');

  const [badgeBg, setBadgeBg] = useState(cfg.badgeBg || '#111827');
  const [badgeColor, setBadgeColor] = useState(cfg.badgeColor || '#ffffff');

  const [sectionTitleSize, setSectionTitleSize] = useState(typeof cfg.sectionTitleSize === 'number' ? cfg.sectionTitleSize : 22);
  const [sectionSubtitleSize, setSectionSubtitleSize] = useState(typeof cfg.sectionSubtitleSize === 'number' ? cfg.sectionSubtitleSize : 15);
  const [cardTitleSize, setCardTitleSize] = useState(typeof cfg.cardTitleSize === 'number' ? cfg.cardTitleSize : 18);
  const [cardSubtitleSize, setCardSubtitleSize] = useState(typeof cfg.cardSubtitleSize === 'number' ? cfg.cardSubtitleSize : 14);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || 'none');
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);

  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? 'category' : productId ? 'product' : 'all');
  const isCategory = effectiveTargetType === 'category' || !!categoryId;
  const isForAll = effectiveTargetType === 'all';
  const scopeLabel = isForAll ? 'Todos los productos' : isCategory ? 'Categoría' : 'Producto específico';

  const updateCard = function (id: string, field: string, val: string) {
    setCards(function (prev) {
      return prev.map(function (c) {
        if (c.id === id) {
          return { ...c, [field]: val };
        }
        return c;
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
        updateCard(id, 'image', res);
      }
    };
    reader.readAsDataURL(file);
  };

  const addCard = function () {
    if (cards.length >= 6) {
      alert('Podés agregar hasta 6 tarjetas como máximo.');
      return;
    }
    var newCard: CardItem = {
      id: 'card-' + Math.random().toString(36).substring(2, 7),
      image: '',
      title: 'Nueva tarjeta',
      badgeText: '',
      subtitle: 'Escribí el contenido de esta tarjeta...'
    };
    setCards(function (prev) { return [...prev, newCard]; });
  };

  const removeCard = function (id: string) {
    if (cards.length <= 1) {
      alert('Tenés que mantener al menos una tarjeta.');
      return;
    }
    setCards(function (prev) {
      return prev.filter(function (c) { return c.id !== id; });
    });
  };

  const moveCard = function (index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cards.length - 1) return;
    var newArr = [...cards];
    var targetIdx = direction === 'up' ? index - 1 : index + 1;
    var temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setCards(newArr);
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
      sectionTitle: sectionTitle,
      sectionSubtitle: sectionSubtitle,
      cards: cards,
      position: position,
      desktopColumns: desktopColumns,
      cardRadius: cardRadius,
      cardAlignment: cardAlignment,
      mobileLayout: mobileLayout,
      sectionBgColor: sectionBgColor,
      cardBgColor: cardBgColor,
      sectionTitleColor: sectionTitleColor,
      sectionSubtitleColor: sectionSubtitleColor,
      cardTitleColor: cardTitleColor,
      cardSubtitleColor: cardSubtitleColor,
      badgeBg: badgeBg,
      badgeColor: badgeColor,
      sectionTitleSize: sectionTitleSize,
      sectionSubtitleSize: sectionSubtitleSize,
      cardTitleSize: cardTitleSize,
      cardSubtitleSize: cardSubtitleSize,
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
          widget_slug: 'columnas-imagenes-texto',
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
        Nuevo widget: Columnas de imágenes y texto ({isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto'})
      </h1>

      <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#065F46', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px' }}>🎴</span>
        <div>
          <strong>Grilla de beneficios visuales:</strong> Mostrá tus características destacadas en tarjetas ordenadas por columnas. Podés configurar la cantidad de columnas en computadora y la disposición en celular.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
          VISTA PREVIA EN VIVO
        </div>

        <div style={{
          backgroundColor: sectionBgColor,
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #E5E7EB',
          maxWidth: '680px',
          margin: '0 auto'
        }}>
          {sectionTitle ? (
            <div style={{ fontSize: sectionTitleSize + 'px', fontWeight: 800, color: sectionTitleColor, textAlign: 'center', marginBottom: '4px' }}>
              {sectionTitle}
            </div>
          ) : null}

          {sectionSubtitle ? (
            <div style={{ fontSize: sectionSubtitleSize + 'px', color: sectionSubtitleColor, textAlign: 'center', marginBottom: '16px', lineHeight: 1.4 }}>
              {sectionSubtitle}
            </div>
          ) : null}

          <div style={{
            display: 'grid',
            gridTemplateColumns: desktopColumns === 4 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {cards.map(function (card, idx) {
              return (
                <div
                  key={card.id || idx}
                  style={{
                    backgroundColor: cardBgColor,
                    borderRadius: cardRadius,
                    padding: '14px 12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: cardAlignment === 'center' ? 'center' : 'flex-start',
                    textAlign: cardAlignment === 'center' ? 'center' : 'left',
                    gap: '8px'
                  }}
                >
                  <div style={{ width: '100%', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {card.image ? (
                      <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '24px', color: '#9CA3AF' }}>🎴</span>
                    )}
                  </div>

                  {card.badgeText ? (
                    <span style={{
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      {card.badgeText}
                    </span>
                  ) : null}

                  <div style={{ fontSize: cardTitleSize + 'px', fontWeight: 800, color: cardTitleColor, lineHeight: 1.2 }}>
                    {card.title || 'Título de tarjeta'}
                  </div>

                  <div style={{ fontSize: cardSubtitleSize + 'px', color: cardSubtitleColor, lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {card.subtitle || 'Subtítulo...'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {[
          { id: 'general', label: '🎴 Tarjetas' },
          { id: 'ubicacion', label: '📍 Ubicación' },
          { id: 'estilos', label: '🎨 Estilos y Layout' },
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

      {/* TAB GENERAL: SECCIÓN Y TARJETAS */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              Encabezado de la Sección (Opcional)
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Título principal de la sección
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={function (e) { setSectionTitle(e.target.value); }}
                placeholder="Ej: Nuestras ventajas"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Subtítulo principal de la sección
              </label>
              <input
                type="text"
                value={sectionSubtitle}
                onChange={function (e) { setSectionSubtitle(e.target.value); }}
                placeholder="Ej: Descubrí por qué miles nos eligen..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* LISTA DE TARJETAS */}
          {cards.map(function (card, idx) {
            return (
              <div key={card.id} style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                    Tarjeta #{idx + 1}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={function () { moveCard(idx, 'up'); }}
                      disabled={idx === 0}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1, fontSize: '12px' }}
                    >
                      ▲ Subir
                    </button>
                    <button
                      type="button"
                      onClick={function () { moveCard(idx, 'down'); }}
                      disabled={idx === cards.length - 1}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#ffffff', cursor: idx === cards.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === cards.length - 1 ? 0.4 : 1, fontSize: '12px' }}
                    >
                      ▼ Bajar
                    </button>
                    <button
                      type="button"
                      onClick={function () { removeCard(card.id); }}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Imagen (opcional)
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {card.image ? (
                        <img src={card.image} alt="Preview" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={function (e) { handleFileUpload(e, card.id); }}
                        style={{ fontSize: '12px', flex: 1 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Título de la tarjeta
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={function (e) { updateCard(card.id, 'title', e.target.value); }}
                      placeholder="Ej: Envío gratis"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Badge / Etiqueta (opcional)
                    </label>
                    <input
                      type="text"
                      value={card.badgeText}
                      onChange={function (e) { updateCard(card.id, 'badgeText', e.target.value); }}
                      placeholder="Ej: NUEVO, PROMO..."
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Subtítulo / Descripción
                    </label>
                    <textarea
                      value={card.subtitle}
                      onChange={function (e) { updateCard(card.id, 'subtitle', e.target.value); }}
                      placeholder="Escribí aquí los detalles..."
                      rows={2}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addCard}
            disabled={cards.length >= 6}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: cards.length >= 6 ? '1px solid #D1D5DB' : '2px dashed #10B981',
              backgroundColor: cards.length >= 6 ? '#F3F4F6' : '#ECFDF5',
              color: cards.length >= 6 ? '#9CA3AF' : '#059669',
              fontSize: '14px',
              fontWeight: 800,
              cursor: cards.length >= 6 ? 'not-allowed' : 'pointer'
            }}
          >
            + Agregar tarjeta (Máximo 6)
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
                  Se muestra a ancho completo debajo de toda la sección del producto. Ideal para grillas de columnas.
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
                  Se ubica dentro de la columna del producto, debajo del botón de compra.
                </div>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* TAB ESTILOS Y LAYOUT */}
      {activeTab === 'estilos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              📐 Diseño y Estructura
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Columnas en Computadora
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={function () { setDesktopColumns(3); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: desktopColumns === 3 ? '2px solid #10B981' : '1px solid #D1D5DB',
                    backgroundColor: desktopColumns === 3 ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  3 Columnas
                </button>
                <button
                  type="button"
                  onClick={function () { setDesktopColumns(4); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: desktopColumns === 4 ? '2px solid #10B981' : '1px solid #D1D5DB',
                    backgroundColor: desktopColumns === 4 ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  4 Columnas
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Layout en Celular / Móvil
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={function () { setMobileLayout('scroll'); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: mobileLayout === 'scroll' ? '2px solid #10B981' : '1px solid #D1D5DB',
                    backgroundColor: mobileLayout === 'scroll' ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  📱 Scroll Horizontal
                </button>
                <button
                  type="button"
                  onClick={function () { setMobileLayout('stacked'); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: mobileLayout === 'stacked' ? '2px solid #10B981' : '1px solid #D1D5DB',
                    backgroundColor: mobileLayout === 'stacked' ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  📋 Lista Vertical
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Bordes de las tarjetas
              </label>
              <select
                value={cardRadius}
                onChange={function (e) { setCardRadius(e.target.value); }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option value="12px">Bordes redondeados (12px)</option>
                <option value="20px">Muy redondeados (20px)</option>
                <option value="0px">Cuadradas sin redondear (0px)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Alineación del contenido de tarjetas
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={function () { setCardAlignment('center'); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: cardAlignment === 'center' ? '2px solid #10B981' : '1px solid #D1D5DB',
                    backgroundColor: cardAlignment === 'center' ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ↔️ Centrado
                </button>
                <button
                  type="button"
                  onClick={function () { setCardAlignment('left'); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: cardAlignment === 'left' ? '2px solid #10B981' : '1px solid #D1D5DB',
                    backgroundColor: cardAlignment === 'left' ? '#ECFDF5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ⬅️ Izquierda
                </button>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              🎨 Colores
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Fondo de la sección
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={sectionBgColor}
                    onChange={function (e) { handleColorChange(setSectionBgColor, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={sectionBgColor}
                    onChange={function (e) { handleColorChange(setSectionBgColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Fondo de tarjetas
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={cardBgColor}
                    onChange={function (e) { handleColorChange(setCardBgColor, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={cardBgColor}
                    onChange={function (e) { handleColorChange(setCardBgColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Título principal sección
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={sectionTitleColor}
                    onChange={function (e) { handleColorChange(setSectionTitleColor, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={sectionTitleColor}
                    onChange={function (e) { handleColorChange(setSectionTitleColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Subtítulo principal sección
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={sectionSubtitleColor}
                    onChange={function (e) { handleColorChange(setSectionSubtitleColor, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={sectionSubtitleColor}
                    onChange={function (e) { handleColorChange(setSectionSubtitleColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Título tarjetas
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={cardTitleColor}
                    onChange={function (e) { handleColorChange(setCardTitleColor, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={cardTitleColor}
                    onChange={function (e) { handleColorChange(setCardTitleColor, e.target.value); }}
                    style={{ flex: 1, minWidth: 0, padding: '9px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Subtítulo tarjetas
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={cardSubtitleColor}
                    onChange={function (e) { handleColorChange(setCardSubtitleColor, e.target.value); }}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={cardSubtitleColor}
                    onChange={function (e) { handleColorChange(setCardSubtitleColor, e.target.value); }}
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
                Título sección: {sectionTitleSize}px
              </label>
              <input
                type="range"
                min={16}
                max={32}
                step={1}
                value={sectionTitleSize}
                onChange={function (e) { setSectionTitleSize(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Subtítulo sección: {sectionSubtitleSize}px
              </label>
              <input
                type="range"
                min={12}
                max={20}
                step={1}
                value={sectionSubtitleSize}
                onChange={function (e) { setSectionSubtitleSize(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Título tarjetas: {cardTitleSize}px
              </label>
              <input
                type="range"
                min={14}
                max={24}
                step={1}
                value={cardTitleSize}
                onChange={function (e) { setCardTitleSize(parseInt(e.target.value, 10)); }}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Subtítulo tarjetas: {cardSubtitleSize}px
              </label>
              <input
                type="range"
                min={11}
                max={18}
                step={1}
                value={cardSubtitleSize}
                onChange={function (e) { setCardSubtitleSize(parseInt(e.target.value, 10)); }}
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
            🔥 Elegí un preset de campaña. Aplica colores llamativos a los Badges de las tarjetas.
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
          {saving ? 'Guardando widget...' : '💾 Guardar Columnas de imágenes y texto'}
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
