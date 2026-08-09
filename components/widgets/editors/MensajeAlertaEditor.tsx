'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MensajeAlertaPreview from './MensajeAlertaPreview';
import EditorTabs from './EditorTabs';
import { Toggle, ColorPicker, Slider } from './EditorFields';

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
};

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

      if (!res.ok) {
        const err = await res.json();
        alert('Error al guardar: ' + (err.error || 'desconocido'));
        setIsSaving(false);
        return;
      }

      router.push('/widgets');
      router.refresh();
    } catch (e) {
      alert('Error al guardar el widget');
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'ubicacion', label: 'Ubicación', icon: '📍' },
    { id: 'estilos', label: 'Estilos', icon: '🎨' },
  ];

  const iconosOpciones = [
    { id: 'circulo', label: 'Círculo', preview: <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', background: '#f59e0b' }} /> },
    { id: 'corazon', label: 'Corazón', preview: <span style={{ fontSize: 20 }}>❤️</span> },
    { id: 'alerta', label: 'Alerta', preview: <span style={{ fontSize: 20 }}>⚠️</span> },
    { id: 'emoji', label: 'Emoji', preview: <span style={{ fontSize: 20 }}>✏️</span> },
    { id: 'imagen', label: 'Imagen', preview: <span style={{ fontSize: 20 }}>🖼️</span> },
    { id: 'nada', label: 'Nada', preview: <span style={{ display: 'inline-block', width: 14, height: 2, background: '#9ca3af' }} /> },
  ];

  const colorOpciones = [
    { id: 'verde', label: 'Verde', color: '#22c55e' },
    { id: 'rojo', label: 'Rojo', color: '#ef4444' },
    { id: 'amarillo', label: 'Amarillo', color: '#f59e0b' },
    { id: 'personalizado', label: 'Personalizado', color: 'gradient' },
  ];

  const efectoOpciones = [
    { id: 'aureola', label: 'Aureola pulsante', desc: 'Un halo se expande y difumina alrededor del elemento.' },
    { id: 'zoom', label: 'Zoom', desc: 'El elemento se agranda y reduce suavemente (predeterminado).' },
    { id: 'ninguno', label: 'Sin efecto', desc: 'El mensaje se muestra estático, sin animación.' },
  ];

  /* ═══════════════════════════════════════
     TAB CONTENT: General
  ═══════════════════════════════════════ */
  const tabGeneral = (
    <div>
      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>
        Mensaje
      </label>
      <input
        type="text"
        value={config.mensaje}
        onChange={(e) => updateConfig('mensaje', e.target.value)}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '1px solid #d1d5db',
          borderRadius: 8,
          fontSize: 14,
          color: '#111',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6, marginBottom: 20 }}>
        Escribí el mensaje que aparecerá en este producto específico
      </p>

      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 10 }}>
        Ícono
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        {iconosOpciones.map((op) => {
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
                padding: '14px 8px',
                background: selected ? '#eff6ff' : '#fff',
                border: selected ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: 10,
                cursor: 'pointer',
                minHeight: 80,
              }}
            >
              {op.preview}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: selected ? '#2563eb' : '#374151',
                }}
              >
                {op.label}
              </span>
            </button>
          );
        })}
      </div>

      {config.icono === 'emoji' && (
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Emoji personalizado
          </label>
          <input
            type="text"
            value={config.emojiCustom}
            onChange={(e) => updateConfig('emojiCustom', e.target.value)}
            placeholder="🔥"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {config.icono === 'imagen' && (
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            URL de la imagen
          </label>
          <input
            type="text"
            value={config.imagenUrl}
            onChange={(e) => updateConfig('imagenUrl', e.target.value)}
            placeholder="https://..."
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════
     TAB CONTENT: Ubicación
  ═══════════════════════════════════════ */
  const tabUbicacion = (
    <div>
      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 12 }}>
        Posición del widget
      </label>

      {[
        {
          id: 'antes-titulo',
          label: 'Antes del título del producto',
          desc: 'El mensaje aparece encima del nombre del producto. (Posición por defecto)',
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
              padding: 16,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              marginBottom: 10,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: selected ? '5px solid #2563eb' : '2px solid #d1d5db',
                  background: '#fff',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
                {op.label}
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0, paddingLeft: 28 }}>
              {op.desc}
            </p>
          </div>
        );
      })}
    </div>
  );

  /* ═══════════════════════════════════════
     TAB CONTENT: Estilos
  ═══════════════════════════════════════ */
  const tabEstilos = (
    <div>
      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 12 }}>
        Color del mensaje
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {colorOpciones.map((op) => {
          const selected = config.color === op.id;
          return (
            <label
              key={op.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                checked={selected}
                onChange={() => updateConfig('color', op.id)}
                style={{ accentColor: '#2563eb', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, color: '#111', flex: 1 }}>
                {op.label}
              </span>
              {op.color === 'gradient' ? (
                <span
                  style={{
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background:
                      'conic-gradient(#f59e0b 0deg 180deg, #000 180deg 360deg)',
                  }}
                />
              ) : (
                <span
                  style={{
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: op.color,
                  }}
                />
              )}
            </label>
          );
        })}
      </div>

      {config.color === 'personalizado' && (
        <div style={{ marginBottom: 20 }}>
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8 }}>
            Tamaño de texto:
          </label>
          <select
            value={config.tamanoTexto}
            onChange={(e) => updateConfig('tamanoTexto', Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 14,
              color: '#111',
              background: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          >
            {[10, 12, 14, 16, 18, 20, 22, 24].map((s) => (
              <option key={s} value={s}>
                {s} px
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8 }}>
            Estilo del texto:
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'normal', label: 'A Normal' },
              { id: 'resaltado', label: 'A Resaltado' },
            ].map((op) => {
              const selected = config.estiloTexto === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => updateConfig('estiloTexto', op.id)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    background: selected ? '#eff6ff' : '#fff',
                    border: selected ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: op.id === 'resaltado' ? 700 : 500,
                    color: selected ? '#2563eb' : '#374151',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {op.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 12 }}>
        Efecto
      </label>
      {efectoOpciones.map((op) => {
        const selected = config.efecto === op.id;
        return (
          <div
            key={op.id}
            onClick={() => updateConfig('efecto', op.id)}
            style={{
              padding: 14,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              marginBottom: 10,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: selected ? '5px solid #2563eb' : '2px solid #d1d5db',
                  background: '#fff',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
                {op.label}
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0, paddingLeft: 28 }}>
              {op.desc}
            </p>
          </div>
        );
      })}

      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#111', marginTop: 16, marginBottom: 10 }}>
        Aplicar efecto a
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 20,
        }}
      >
        {[
          { id: 'icono', label: 'Sólo ícono' },
          { id: 'completo', label: 'Mensaje completo' },
        ].map((op) => {
          const selected = config.aplicarEfectoA === op.id;
          return (
            <button
              key={op.id}
              type="button"
              onClick={() => updateConfig('aplicarEfectoA', op.id)}
              style={{
                padding: '14px 12px',
                background: selected ? '#eff6ff' : '#fff',
                border: selected ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: selected ? '#2563eb' : '#374151',
                cursor: 'pointer',
              }}
            >
              {op.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8 }}>
            Bordes redondeados
          </label>
          <Slider
            value={config.bordesRedondeados}
            onChange={(v) => updateConfig('bordesRedondeados', v)}
            min={0}
            max={25}
            step={1}
            marks={['0px', '25px']}
            unit="px"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8 }}>
            Margen interno (padding)
          </label>
          <Slider
            value={config.paddingInterno}
            onChange={(v) => updateConfig('paddingInterno', v)}
            min={0}
            max={30}
            step={1}
            marks={['0px', '30px']}
            unit="px"
          />
        </div>
      </div>

      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 10 }}>
        Borde
      </label>
      <Toggle
        label="Mostrar borde (1px)"
        value={config.mostrarBorde}
        onChange={(v) => updateConfig('mostrarBorde', v)}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: '#111',
          marginBottom: 20,
          lineHeight: 1.3,
        }}
      >
        {existingWidget ? 'Editar widget:' : 'Nuevo widget:'}{' '}
        <strong style={{ fontWeight: 700 }}>{widgetDefinition.name}</strong>{' '}
        ({targetType === 'product' ? 'Producto' : 'Todos los productos'})
      </h1>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 16px', background: '#fff' }}>
          <MensajeAlertaPreview config={config} />
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #f3f4f6',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            fontSize: 14,
            color: '#6b7280',
            background: '#fff',
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 2 }}>ⓘ</span>
          <span>El mensaje aparecerá encima del título de este producto específico.</span>
        </div>

        <div style={{ background: '#f9fafb', padding: 16 }}>
          <EditorTabs tabs={tabs}>
            {tabGeneral}
            {tabUbicacion}
            {tabEstilos}
          </EditorTabs>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Toggle label="" value={isActive} onChange={setIsActive} />
              <span style={{ fontSize: 15, color: '#111', fontWeight: 500 }}>
                Widget activo
              </span>
              <span style={{ color: '#9ca3af', fontSize: 14 }}>ⓘ</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '12px 28px',
                fontSize: 15,
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  }
