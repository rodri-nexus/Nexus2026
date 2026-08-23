'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BannerDeslizantePreview from './BannerDeslizantePreview';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

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

interface BannerConfig {
  mensajes: string[];
  mostrarEnProducto: boolean;
  ubicacionProducto: 'despues-boton' | 'despues-precio';
  modoBarra: boolean;
  tipoFondo: 'solido' | 'degradado';
  colorFondo: string;
  colorFondoInicio: string;
  colorFondoFin: string;
  colorTexto: string;
  tamanoFuente: number;
  bordeRadio: number;
  separacionMensajes: number;
  velocidad: number;
}

const DEFAULT_CONFIG: BannerConfig = {
  mensajes: ['🎉 ¡Envío gratis en compras nuevas a $25000!'],
  mostrarEnProducto: true,
  ubicacionProducto: 'despues-boton',
  modoBarra: false,
  tipoFondo: 'solido',
  colorFondo: '#333333',
  colorFondoInicio: '#333333',
  colorFondoFin: '#555555',
  colorTexto: '#ffffff',
  tamanoFuente: 16,
  bordeRadio: 8,
  separacionMensajes: 300,
  velocidad: 20,
};

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function BannerDeslizanteEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilo'>('general');
  const [config, setConfig] = useState<BannerConfig>({
    ...DEFAULT_CONFIG,
    ...(existingWidget?.config ?? {}),
  });
  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!existingWidget;

  const scopeLabel = targetType === 'all' ? '(General)' : '(Producto)';
  const titlePrefix = isEditing ? 'Editar widget' : 'Nuevo widget';

  const updateConfig = <K extends keyof BannerConfig>(key: K, value: BannerConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const addMensaje = () => {
    if (config.mensajes.length >= 10) return;
    updateConfig('mensajes', [...config.mensajes, '']);
  };

  const removeMensaje = (index: number) => {
    if (config.mensajes.length <= 1) return;
    updateConfig(
      'mensajes',
      config.mensajes.filter((_, i) => i !== index)
    );
  };

  const updateMensaje = (index: number, value: string) => {
    const nuevos = [...config.mensajes];
    nuevos[index] = value;
    updateConfig('mensajes', nuevos);
  };

  const handleSave = async () => {
    setError(null);

    const mensajesValidos = config.mensajes.filter((m) => m && m.trim().length > 0);
    if (mensajesValidos.length === 0) {
      setError('Debés agregar al menos un mensaje.');
      return;
    }

    if (!config.mostrarEnProducto && !config.modoBarra) {
      setError('Debés seleccionar al menos una ubicación (producto o barra superior).');
      return;
    }

    setSaving(true);
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
          config: { ...config, mensajes: mensajesValidos },
          is_active: isActive,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el widget');
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
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 40 }}>
      {/* HEADER CON LOGO OFICIAL */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: '#ffffff',
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
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#ffffff',
              fontSize: 13,
            }}
          >
            RL
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        {/* CHIP SCOPE */}
        {targetType === 'all' ? (
          <div
            style={{
              background: '#10B981',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            <IconStore />
            <span>Todos los productos</span>
          </div>
        ) : (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 700,
              color: '#000000',
            }}
          >
            <span style={{ fontSize: 18 }}>🛍</span>
            <span>NEVUX Widget</span>
          </div>
        )}

        {/* TÍTULO */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            lineHeight: 1.25,
            margin: '0 0 20px 0',
          }}
        >
          {titlePrefix}: {widgetDefinition.name} {scopeLabel}
        </h1>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* PREVIEW */}
          <div style={{ padding: 20 }}>
            <BannerDeslizantePreview config={config} />
          </div>

          {/* INFO BOX */}
          <div
            style={{
              margin: '0 20px 20px',
              padding: '12px 16px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 10,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              color: '#000000',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            <IconInfo />
            <span>El banner aparecerá antes de la descripción del producto.</span>
          </div>

          {/* TABS */}
          <div style={{ padding: '0 20px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: 0 }}>
              <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
                General
              </TabButton>
              <TabButton active={activeTab === 'ubicacion'} onClick={() => setActiveTab('ubicacion')}>
                Ubicación
              </TabButton>
              <TabButton active={activeTab === 'estilo'} onClick={() => setActiveTab('estilo')}>
                Estilo
              </TabButton>
            </div>
          </div>

          {/* CONTENIDO TABS */}
          <div style={{ padding: 20 }}>
            {activeTab === 'general' && (
              <GeneralTab
                mensajes={config.mensajes}
                onAdd={addMensaje}
                onRemove={removeMensaje}
                onUpdate={updateMensaje}
              />
            )}

            {activeTab === 'ubicacion' && (
              <UbicacionTab
                mostrarEnProducto={config.mostrarEnProducto}
                ubicacionProducto={config.ubicacionProducto}
                modoBarra={config.modoBarra}
                onChangeMostrar={(v) => updateConfig('mostrarEnProducto', v)}
                onChangeUbicacion={(v) => updateConfig('ubicacionProducto', v)}
                onChangeModoBarra={(v) => updateConfig('modoBarra', v)}
              />
            )}

            {activeTab === 'estilo' && (
              <EstiloTab config={config} onChange={updateConfig} />
            )}
          </div>

          {/* FOOTER */}
          <div
            style={{
              padding: '16px 20px 20px 20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <ToggleField
              label="Widget activo"
              value={isActive}
              onChange={setIsActive}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: '#10B981',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
              }}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA OFICIAL UNIFICADO */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>
      </main>

      {/* ERROR TOAST */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: 100,
            maxWidth: '90%',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB GENERAL
// ═══════════════════════════════════════════════════════════

function GeneralTab({
  mensajes,
  onAdd,
  onRemove,
  onUpdate,
}: {
  mensajes: string[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onUpdate: (i: number, v: string) => void;
}) {
  return (
    <div>
      <FieldLabel required>Mensajes</FieldLabel>
      <FieldHelper>
        Agrega los mensajes que se mostrarán deslizándose. Mínimo 1, máximo 10.
      </FieldHelper>

      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: 14,
          marginTop: 12,
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {mensajes.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={msg}
              onChange={(e) => onUpdate(i, e.target.value)}
              placeholder="Escribí tu mensaje..."
              style={{
                flex: 1,
                padding: '12px 14px',
                border: '1.5px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 15,
                color: '#000000',
                background: '#ffffff',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#10B981')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
            {mensajes.length > 1 && (
              <button
                onClick={() => onRemove(i)}
                aria-label="Eliminar mensaje"
                style={{
                  background: '#fee2e2',
                  border: 'none',
                  borderRadius: 8,
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#991b1b',
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {mensajes.length < 10 && (
        <button
          onClick={onAdd}
          style={{
            marginTop: 14,
            background: '#ffffff',
            border: '1.5px solid #10B981',
            color: '#10B981',
            padding: '12px 20px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'inherit',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Agregar mensaje
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB UBICACIÓN
// ═══════════════════════════════════════════════════════════

function UbicacionTab({
  mostrarEnProducto,
  ubicacionProducto,
  modoBarra,
  onChangeMostrar,
  onChangeUbicacion,
  onChangeModoBarra,
}: {
  mostrarEnProducto: boolean;
  ubicacionProducto: 'despues-boton' | 'despues-precio';
  modoBarra: boolean;
  onChangeMostrar: (v: boolean) => void;
  onChangeUbicacion: (v: 'despues-boton' | 'despues-precio') => void;
  onChangeModoBarra: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: mostrarEnProducto ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
          padding: 18,
          transition: 'border-color 0.2s',
        }}
      >
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <div
            onClick={() => onChangeMostrar(!mostrarEnProducto)}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: mostrarEnProducto ? '#10B981' : '#ffffff',
              border: mostrarEnProducto ? '2px solid #10B981' : '2px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              transition: 'all 0.2s',
            }}
          >
            {mostrarEnProducto && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>
              Mostrar en la ficha de producto
            </div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
              Cuando está desactivado, el banner no se mostrará antes de la descripción del producto.
            </div>
          </div>
        </label>

        {mostrarEnProducto && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 12 }}>
              Ubicación del widget
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                <div
                  onClick={() => onChangeUbicacion('despues-boton')}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: ubicacionProducto === 'despues-boton' ? '6px solid #10B981' : '2px solid #d1d5db',
                    background: '#ffffff',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <span style={{ color: '#000000', fontSize: 15 }}>
                  Después del botón &quot;Agregar al carrito&quot;
                </span>
              </label>
              <label style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                <div
                  onClick={() => onChangeUbicacion('despues-precio')}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: ubicacionProducto === 'despues-precio' ? '6px solid #10B981' : '2px solid #d1d5db',
                    background: '#ffffff',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <span style={{ color: '#000000', fontSize: 15 }}>Después del precio del producto</span>
              </label>
            </div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
              Seleccioná dónde querés que aparezca el banner en la ficha del producto
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: modoBarra ? '1.5px solid #10B981' : '1.5px solid #e5e7eb',
          padding: 18,
          transition: 'border-color 0.2s',
        }}
      >
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <div
            onClick={() => onChangeModoBarra(!modoBarra)}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: modoBarra ? '#10B981' : '#ffffff',
              border: modoBarra ? '2px solid #10B981' : '2px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              transition: 'all 0.2s',
            }}
          >
            {modoBarra && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>
              Mostrar como barra en la parte superior
            </div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
              Mostrará el banner antes del encabezado de la página, a ancho completo y sin bordes redondeados.
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB ESTILO
// ═══════════════════════════════════════════════════════════

function EstiloTab({
  config,
  onChange,
}: {
  config: BannerConfig;
  onChange: <K extends keyof BannerConfig>(key: K, value: BannerConfig[K]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* CARD: FONDO DEL BANNER */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>Fondo del banner</div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Elegí el tipo de fondo y sus colores.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
            Tipo de fondo
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
              <div
                onClick={() => onChange('tipoFondo', 'solido')}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: config.tipoFondo === 'solido' ? '6px solid #10B981' : '2px solid #d1d5db',
                  background: '#ffffff',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#000000', fontSize: 15 }}>Color sólido</span>
            </label>
            <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
              <div
                onClick={() => onChange('tipoFondo', 'degradado')}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: config.tipoFondo === 'degradado' ? '6px solid #10B981' : '2px solid #d1d5db',
                  background: '#ffffff',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#000000', fontSize: 15 }}>Degradé</span>
            </label>
          </div>
        </div>

        {config.tipoFondo === 'solido' ? (
          <ColorPickerField
            label="Color de fondo"
            value={config.colorFondo}
            onChange={(v) => onChange('colorFondo', v)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ColorPickerField
              label="Color inicio"
              value={config.colorFondoInicio}
              onChange={(v) => onChange('colorFondoInicio', v)}
            />
            <ColorPickerField
              label="Color fin"
              value={config.colorFondoFin}
              onChange={(v) => onChange('colorFondoFin', v)}
            />
          </div>
        )}
      </div>

      {/* CARD: TEXTO */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ color: '#10B981', flexShrink: 0, marginTop: 2, fontWeight: 800, fontSize: 22 }}>
            T
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>Texto</div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Color y tamaño del texto del banner.
            </div>
          </div>
        </div>

        <ColorPickerField
          label="Color del texto"
          value={config.colorTexto}
          onChange={(v) => onChange('colorTexto', v)}
        />

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
            Tamaño de fuente
          </div>
          <div style={{ position: 'relative' }}>
            <select
              value={config.tamanoFuente}
              onChange={(e) => onChange('tamanoFuente', Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 36px 12px 14px',
                border: '1.5px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 15,
                color: '#000000',
                background: '#ffffff',
                appearance: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              {[12, 14, 16, 18, 20, 24].map((n) => (
                <option key={n} value={n}>
                  {n}px
                </option>
              ))}
            </select>
            <div
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#000000',
                opacity: 0.5,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CARD: ESPACIOS Y BORDES */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>Espacios y bordes</div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Redondeo del banner y separación entre mensajes.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
              Borde del banner:
            </div>
            <RangeSlider
              min={0}
              max={25}
              step={1}
              value={config.bordeRadio}
              onChange={(v) => onChange('bordeRadio', v)}
              labels={['0px', '8px', '25px']}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
              Separación entre mensajes:
            </div>
            <RangeSlider
              min={10}
              max={300}
              step={10}
              value={config.separacionMensajes}
              onChange={(v) => onChange('separacionMensajes', v)}
              labels={['10px', '300px', '300px']}
            />
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
            Velocidad de desplazamiento:
          </div>
          <RangeSlider
            min={5}
            max={60}
            step={1}
            value={config.velocidad}
            onChange={(v) => onChange('velocidad', v)}
            labels={['5s (rápido)', '20s', '60s (lento)']}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTES REUTILIZABLES
// ═══════════════════════════════════════════════════════════

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontWeight: 700, color: '#000000', fontSize: 16, marginBottom: 4 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </div>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, lineHeight: 1.5 }}>{children}</div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: 'none',
        border: 'none',
        padding: '14px 12px',
        fontSize: 15,
        fontWeight: active ? 700 : 500,
        color: active ? '#10B981' : '#000000',
        opacity: active ? 1 : 0.6,
        cursor: 'pointer',
        borderBottom: active ? '2px solid #10B981' : '2px solid transparent',
        fontFamily: 'inherit',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 44,
              height: 40,
              border: '1.5px solid #e5e7eb',
              borderRadius: 8,
              cursor: 'pointer',
              padding: 2,
              background: '#ffffff',
            }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 12px',
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 13,
            color: '#000000',
            background: '#ffffff',
            outline: 'none',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          background: value ? '#10B981' : '#d1d5db',
          position: 'relative',
          transition: 'background 0.25s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#ffffff',
            transition: 'left 0.25s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      <span style={{ color: '#000000', fontWeight: 600, fontSize: 15 }}>{label}</span>
    </label>
  );
}

function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  labels,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  labels: string[];
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: '#10B981',
          cursor: 'pointer',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          fontSize: 12,
          color: '#000000',
          opacity: 0.6,
        }}
      >
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function IconStore() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
      <path
        d="M3 9l1-5h16l1 5M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 21v-6h6v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
  }
