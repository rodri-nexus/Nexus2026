'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MensajeAlertaPreview from './MensajeAlertaPreview';
import EditorTabs from './EditorTabs';
import { Toggle, ColorPicker, Slider } from './EditorFields';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

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
    { id: 'nada', label: 'Nada', preview: <span style={{ display: 'inline-block', width: 14, height: 2, background: '#000000', opacity: 0.4 }} /> },
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
     TAB: General
  ═══════════════════════════════════════ */
  const tabGeneral = (
    <div>
      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
        Mensaje
      </label>
      <input
        type="text"
        value={config.mensaje}
        onChange={(e) => updateConfig('mensaje', e.target.value)}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          fontSize: 14,
          color: '#000000',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 20 }}>
        Escribí el mensaje que aparecerá en este producto específico
      </p>

      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 10 }}>
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
                background: selected ? '#ecfdf5' : '#FFFFFF',
                border: selected ? '1.5px solid #10B981' : '1px solid #e5e7eb',
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
                  color: selected ? '#10B981' : '#000000',
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
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 6 }}>
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
              border: '1px solid #e5e7eb',
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
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 6 }}>
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
              border: '1px solid #e5e7eb',
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
     TAB: Ubicación
  ═══════════════════════════════════════ */
  const tabUbicacion = (
    <div>
      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 12 }}>
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
              background: '#FFFFFF',
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
                  border: selected ? '5px solid #10B981' : '2px solid #e5e7eb',
                  background: '#FFFFFF',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
                {op.label}
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#000000', opacity: 0.6, margin: 0, paddingLeft: 28 }}>
              {op.desc}
            </p>
          </div>
        );
      })}
    </div>
  );

  /* ═══════════════════════════════════════
     TAB: Estilos
  ═══════════════════════════════════════ */
  const tabEstilos = (
    <div>
      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 12 }}>
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
                style={{ accentColor: '#10B981', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, color: '#000000', flex: 1 }}>
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
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
            Tamaño de texto:
          </label>
          <select
            value={config.tamanoTexto}
            onChange={(e) => updateConfig('tamanoTexto', Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
              color: '#000000',
              background: '#FFFFFF',
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
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
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
                    background: selected ? '#ecfdf5' : '#FFFFFF',
                    border: selected ? '1.5px solid #10B981' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: op.id === 'resaltado' ? 700 : 500,
                    color: selected ? '#10B981' : '#000000',
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

      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 12 }}>
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
              background: '#FFFFFF',
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
                  border: selected ? '5px solid #10B981' : '2px solid #e5e7eb',
                  background: '#FFFFFF',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>
                {op.label}
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#000000', opacity: 0.6, margin: 0, paddingLeft: 28 }}>
              {op.desc}
            </p>
          </div>
        );
      })}

      <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginTop: 16, marginBottom: 10 }}>
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
                background: selected ? '#ecfdf5' : '#FFFFFF',
                border: selected ? '1.5px solid #10B981' : '1px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: selected ? '#10B981' : '#000000',
                cursor: 'pointer',
              }}
            >
              {op.label}
            </button>
          );
        })}
      </div>

      <Slider
        label="Bordes redondeados"
        value={config.bordesRedondeados}
        min={0}
        max={25}
        unit="px"
        onChange={(v) => updateConfig('bordesRedondeados', v)}
      />

      <Slider
        label="Margen interno (padding)"
        value={config.paddingInterno}
        min={0}
        max={30}
        unit="px"
        onChange={(v) => updateConfig('paddingInterno', v)}
      />

      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 6 }}>
          Borde
        </label>
        <Toggle
          label="Mostrar borde (1px)"
          checked={config.mostrarBorde}
          onChange={(v) => updateConfig('mostrarBorde', v)}
        />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* HEADER */}
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

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
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

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <MensajeAlertaPreview config={config} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 13,
              color: '#000000',
              opacity: 0.6,
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            <span style={{ flexShrink: 0, marginTop: 2, color: '#10B981' }}>ⓘ</span>
            <span>El mensaje aparecerá encima del título de este producto específico.</span>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 0 }}>
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
                  padding: '12px 28px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {isSaving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
              </button>
            </div>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
  }
