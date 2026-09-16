'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MensajeAlertaPreview from './MensajeAlertaPreview';
import { Toggle, ColorPicker, Slider } from './EditorFields';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS Y CONFIGURACIONES POR DEFECTO (Regla #9)
═══════════════════════════════════════════ */
interface EditorProps {
  widgetDefinition: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string;
  };
  existingWidget: {
    id: string;
    config: any;
    is_active: boolean;
    target_type: string;
    target_product_id: number | null;
  } | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

const DEFAULT_CONFIG = {
  mensaje: '¡Apurate, quedan pocos en stock!',
  icono: 'circulo' as 'circulo' | 'corazon' | 'alerta' | 'emoji' | 'imagen' | 'nada',
  emojiCustom: '🔥',
  imagenUrl: '',
  posicion: 'antes-titulo' as 'antes-titulo' | 'despues-precio',
  color: 'amarillo' as 'verde' | 'rojo' | 'amarillo' | 'personalizado',
  colorPersonalizadoFondo: '#f59e0b',
  colorPersonalizadoTexto: '#ffffff',
  tamanoTexto: 14,
  estiloTexto: 'normal' as 'normal' | 'resaltado',
  efecto: 'zoom' as 'aureola' | 'zoom' | 'ninguno',
  aplicarEfectoA: 'icono' as 'icono' | 'completo',
  bordesRedondeados: 25,
  paddingInterno: 10,
  mostrarBorde: false,
  campaignTheme: 'none',
};

const CAMPAIGN_PRESETS = [
  { id: 'none', label: 'Diseño Normal / Sin Evento', emoji: '🎨', desc: 'Mantiene tus colores configurados en la pestaña Estilos.' },
  { id: 'black-friday', label: 'Black Friday', emoji: '🔥', desc: 'Colores oscuros con acentos dorados.', themeColor: '#111827', accentColor: '#F59E0B' },
  { id: 'hot-sale', label: 'Hot Sale', emoji: '⚡', desc: 'Diseño deportivo con rojo de alta conversión.', themeColor: '#0F172A', accentColor: '#EF4444' },
  { id: 'cyber-monday', label: 'Cyber Monday', emoji: '🚀', desc: 'Fondo cibernético nocturno y azul neón.', themeColor: '#090D16', accentColor: '#3B82F6' },
  { id: 'navidad', label: 'Navidad & Reyes', emoji: '🎄', desc: 'Verde pino tradicional con acento rojo fiesta.', themeColor: '#064E3B', accentColor: '#EF4444' },
  { id: 'san-valentin', label: 'San Valentín', emoji: '💘', desc: 'Rosa intenso con rojo pasión romántico.', themeColor: '#831843', accentColor: '#F43F5E' },
  { id: 'dia-padre-madre', label: 'Día de la Madre / Padre', emoji: '🎁', desc: 'Azul índigo con acento verde esmeralda alegre.', themeColor: '#312E81', accentColor: '#10B981' },
  { id: 'liquidacion', label: 'Liquidación / Sale', emoji: '🏷️', desc: 'Rojo carmesí de urgencia extrema con amarillo.', themeColor: '#7F1D1D', accentColor: '#FBBF24' },
];

const ICONOS_OPCIONES = [
  { id: 'circulo', label: 'Círculo', preview: <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', background: '#f59e0b' }} /> },
  { id: 'corazon', label: 'Corazón', preview: <span style={{ fontSize: 20 }}>❤️</span> },
  { id: 'alerta', label: 'Alerta', preview: <span style={{ fontSize: 20 }}>⚠️</span> },
  { id: 'emoji', label: 'Emoji', preview: <span style={{ fontSize: 20 }}>✏️</span> },
  { id: 'imagen', label: 'Imagen', preview: <span style={{ fontSize: 20 }}>🖼️</span> },
  { id: 'nada', label: 'Nada', preview: <span style={{ display: 'inline-block', width: 14, height: 2, background: '#000000', opacity: 0.4 }} /> },
];

const COLOR_OPCIONES = [
  { id: 'verde', label: 'Verde', color: '#22c55e' },
  { id: 'rojo', label: 'Rojo', color: '#ef4444' },
  { id: 'amarillo', label: 'Amarillo', color: '#f59e0b' },
  { id: 'personalizado', label: 'Personalizado', color: 'gradient' },
];

const EFECTO_OPCIONES = [
  { id: 'aureola', label: 'Aureola pulsante', desc: 'Un halo se expande y difumina alrededor.' },
  { id: 'zoom', label: 'Zoom', desc: 'El elemento se agranda y reduce suavemente.' },
  { id: 'ninguno', label: 'Sin efecto', desc: 'El mensaje se muestra estático, sin animación.' },
];

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MensajeAlertaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);

  const [config, setConfig] = useState({
    ...DEFAULT_CONFIG,
    ...(existingWidget?.config || {}),
  });

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: widgetDefinition.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert('Error al guardar: ' + (data.error || 'desconocido'));
        setIsSaving(false);
        return;
      }

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', widgetDefinition.slug);
        if (targetType === 'product' && productId) {
          params.set('product', String(productId));
        }
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
      router.refresh();
    } catch (e) {
      alert('Error al guardar el widget');
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: 60 }}>
      {/* HEADER sticky */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            RL
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px 60px' }}>
        {/* Chip scope */}
        {targetType === 'all' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#10B981',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M3 9l1-5h16l1 5" />
              <path d="M4 9v11a1 1 0 001 1h14a1 1 0 001-1V9" />
              <path d="M9 21V13h6v8" />
            </svg>
            Todos los productos
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span>
            NEVUX Widget
          </div>
        )}

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {existingWidget ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({targetType === 'all' ? 'General' : 'Producto'})
        </h1>

        {/* Live Preview del Widget */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 10,
            }}
          >
            Vista previa en vivo
          </div>
          <MensajeAlertaPreview config={config} />
        </div>

        {/* ── SECCIONES EN CUADRICULA PREMIUM SIN PESTAÑAS ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            alignItems: 'start',
            marginBottom: 32,
          }}
        >
          {/* COLUMNA IZQUIERDA - CONFIGURACIONES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* BLOQUE 1: GENERAL */}
            <div style={{ background: '#FFFFFF', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#000000', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚙️</span> Configuración General
              </h2>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
                  Mensaje de Alerta
                </label>
                <input
                  type="text"
                  value={config.mensaje}
                  onChange={(e) => updateConfig('mensaje', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 14,
                    color: '#000000',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 10 }}>
                  Ícono Destacado
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8 }}>
                  {ICONOS_OPCIONES.map((op) => {
                    const selected = config.icono === op.id;
                    return (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => updateConfig('icono', op.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '12px 6px',
                          background: selected ? '#ecfdf5' : '#FFFFFF',
                          border: selected ? '1.5px solid #10B981' : '1px solid #e5e7eb',
                          borderRadius: 10,
                          cursor: 'pointer',
                          minHeight: 70,
                          boxSizing: 'border-box',
                        }}
                      >
                        {op.preview}
                        <span style={{ fontSize: 12, fontWeight: 600, color: selected ? '#10B981' : '#000000' }}>
                          {op.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {config.icono === 'emoji' && (
                  <div style={{ marginTop: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 6 }}>
                      Emoji personalizado
                    </label>
                    <input
                      type="text"
                      value={config.emojiCustom}
                      onChange={(e) => updateConfig('emojiCustom', e.target.value)}
                      placeholder="🔥"
                      style={{
                        width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
                        borderRadius: 8, fontSize: 16, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                {config.icono === 'imagen' && (
                  <div style={{ marginTop: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 6 }}>
                      URL de la imagen
                    </label>
                    <input
                      type="text"
                      value={config.imagenUrl}
                      onChange={(e) => updateConfig('imagenUrl', e.target.value)}
                      placeholder="https://..."
                      style={{
                        width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
                        borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* BLOQUE 3: UBICACIÓN */}
            <div style={{ background: '#FFFFFF', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#000000', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📍</span> Ubicación del Widget
              </h2>

              {[
                {
                  id: 'antes-titulo',
                  label: 'Antes del título del producto',
                  desc: 'El mensaje aparece encima del nombre del producto.',
                },
                {
                  id: 'despues-precio',
                  label: 'Después del precio',
                  desc: 'El mensaje aparece justo debajo del precio del producto.',
                },
              ].map((op) => {
                const selected = config.posicion === op.id;
                return (
                  <div
                    key={op.id}
                    onClick={() => updateConfig('posicion', op.id)}
                    style={{
                      padding: 14,
                      background: '#FFFFFF',
                      border: selected ? '1.5px solid #10B981' : '1px solid #e5e7eb',
                      borderRadius: 10,
                      marginBottom: 10,
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: selected ? '5px solid #10B981' : '2px solid #e5e7eb',
                          background: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#000000' }}>
                        {op.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0, paddingLeft: 28, lineHeight: 1.3 }}>
                      {op.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* COLUMNA DERECHA - ESTILOS Y FECHAS ESPECIALES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* BLOQUE 2: ESTILOS */}
            <div style={{ background: '#FFFFFF', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#000000', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎨</span> Estilos Visuales
              </h2>

              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 10 }}>
                Ajuste de Color
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
                {COLOR_OPCIONES.map((op) => {
                  const selected = config.color === op.id;
                  return (
                    <label
                      key={op.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        background: '#ffffff',
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: selected ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
                        boxSizing: 'border-box',
                      }}
                    >
                      <input
                        type="radio"
                        checked={selected}
                        onChange={() => updateConfig('color', op.id)}
                        style={{ accentColor: '#10B981', width: 15, height: 16, margin: 0 }}
                      />
                      <span style={{ fontSize: 13, color: '#000000', flex: 1, fontWeight: 700 }}>
                        {op.label}
                      </span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: op.color === 'gradient' ? 'conic-gradient(#f59e0b 0deg 180deg, #000 180deg 360deg)' : op.color,
                        }}
                      />
                    </label>
                  );
                })}
              </div>

              {config.color === 'personalizado' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <ColorPicker
                    label="Color de fondo"
                    value={config.colorPersonalizadoFondo}
                    onChange={(v) => updateConfig('colorPersonalizadoFondo', v)}
                  />
                  <ColorPicker
                    label="Color del texto"
                    value={config.colorPersonalizadoTexto}
                    onChange={(v) => updateConfig('colorPersonalizadoTexto', v)}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#000000', marginBottom: 6 }}>
                    Tamaño de texto
                  </label>
                  <select
                    value={config.tamanoTexto}
                    onChange={(e) => updateConfig('tamanoTexto', Number(e.target.value))}
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
                      borderRadius: 8, fontSize: 13, color: '#000000', background: '#FFFFFF',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  >
                    {[10, 12, 14, 16, 18, 20, 22, 24].map((s) => (
                      <option key={s} value={s}>{s} px</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#000000', marginBottom: 6 }}>
                    Grosor de fuente
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { id: 'normal', label: 'Normal' },
                      { id: 'resaltado', label: 'Negrita' },
                    ].map((op) => {
                      const selected = config.estiloTexto === op.id;
                      return (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => updateConfig('estiloTexto', op.id)}
                          style={{
                            flex: 1, padding: '10px 4px',
                            background: selected ? '#ecfdf5' : '#FFFFFF',
                            border: selected ? '1.5px solid #10B981' : '1px solid #e5e7eb',
                            borderRadius: 8, fontSize: 12,
                            fontWeight: op.id === 'resaltado' ? 700 : 500,
                            color: selected ? '#10B981' : '#000000',
                            cursor: 'pointer', boxSizing: 'border-box',
                          }}
                        >
                          {op.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Efectos */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
                  Efecto de Animación
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {EFECTO_OPCIONES.map((op) => {
                    const selected = config.efecto === op.id;
                    return (
                      <label key={op.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                        padding: '10px 12px', borderRadius: 8, border: selected ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
                        boxSizing: 'border-box', background: selected ? '#ecfdf5' : '#ffffff'
                      }}>
                        <input
                          type="radio" checked={selected} onChange={() => updateConfig('efecto', op.id)}
                          style={{ accentColor: '#10B981', width: 16, height: 16, margin: 0 }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{op.label}</span>
                          <span style={{ fontSize: 11, color: '#6b7280' }}>{op.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Slider
                label="Bordes redondeados"
                value={config.bordesRedondeados}
                min={0} max={25} unit="px"
                onChange={(v) => updateConfig('bordesRedondeados', v)}
              />

              <Slider
                label="Padding interno"
                value={config.paddingInterno}
                min={0} max={30} unit="px"
                onChange={(v) => updateConfig('paddingInterno', v)}
              />

              <div style={{ marginTop: 12, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                <Toggle
                  label="Mostrar borde (1px)"
                  checked={config.mostrarBorde}
                  onChange={(v) => updateConfig('mostrarBorde', v)}
                />
              </div>
            </div>

            {/* BLOQUE 4: FECHAS ESPECIALES */}
            <div style={{ background: '#FFFFFF', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#000000', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔥</span> Fechas Especiales
              </h2>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16, lineHeight: 1.4 }}>
                Unificá la estética del widget con colores temáticos de alto impacto optimizados para campañas.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CAMPAIGN_PRESETS.map((preset) => {
                  const isSelected = (config.campaignTheme || 'none') === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => updateConfig('campaignTheme', preset.id)}
                      style={{
                        background: '#ffffff',
                        border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                        borderRadius: 12,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box',
                        minWidth: 0,
                        width: '100%',
                      }}
                    >
                      <div style={{ fontSize: 22, flexShrink: 0 }}>{preset.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span>{preset.label}</span>
                          {isSelected && (
                            <span style={{
                              background: '#ecfdf5', color: '#10B981', fontSize: 10, fontWeight: 800,
                              padding: '1px 6px', borderRadius: 999, border: '1px solid #10B981',
                            }}>
                              ACTIVO
                            </span>
                          )}
                        </div>
                      </div>
                      {preset.id !== 'none' && (
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: preset.themeColor, border: '1px solid #d1d5db' }} />
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: preset.accentColor, border: '1px solid #d1d5db' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* CONTROLES DE GUARDADO */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 40,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <Toggle
              label="Widget activo"
              checked={isActive}
              onChange={setIsActive}
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 999,
              padding: '14px 40px',
              fontSize: 15,
              fontWeight: 800,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              width: '100%',
              maxWidth: 300,
            }}
          >
            {isSaving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
          </button>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
     }
