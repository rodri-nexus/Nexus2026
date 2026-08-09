'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BannerDeslizantePreview from './BannerDeslizantePreview';

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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al guardar el widget');
      }

      router.push('/widgets');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
      setSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', paddingBottom: 40 }}>
      {/* HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: '#fff',
          borderBottom: '1px solid #eef0f3',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NevuxLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            aria-label="Menú"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 6,
              cursor: 'pointer',
              color: '#333',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#e6e8ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: '#333',
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
              background: '#2563eb',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <IconStore />
            <span>Toda la tienda</span>
          </div>
        ) : (
          <div
            style={{
              background: '#fff',
              border: '1px solid #eef0f3',
              padding: '10px 14px',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🛍
            </div>
            <span style={{ fontWeight: 600, color: '#111' }}>NEVUX Widget</span>
          </div>
        )}

        {/* TÍTULO */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: '#111',
            lineHeight: 1.25,
            margin: '0 0 20px 0',
          }}
        >
          {titlePrefix}: {widgetDefinition.name} {scopeLabel}
        </h1>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #eef0f3',
            overflow: 'hidden',
          }}
        >
          {/* PREVIEW */}
          <div style={{ padding: 20 }}>
            <BannerDeslizantePreview config={config} />
          </div>

          {/* INFO BOX */}
          <div
            style={{
              padding: '14px 20px 20px 20px',
              borderTop: '1px solid #eef0f3',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              color: '#6b7280',
              fontSize: 15,
            }}
          >
            <IconInfo />
            <span>El banner aparecerá antes de la descripción del producto.</span>
          </div>

          {/* TABS */}
          <div style={{ background: '#f7f8fa', padding: '0 20px' }}>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e6e8ec' }}>
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
          <div style={{ background: '#f7f8fa', padding: 20 }}>
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
              background: '#f7f8fa',
              padding: '16px 20px 20px 20px',
              borderTop: '1px solid #e6e8ec',
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
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 16,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            color: '#6b7280',
          }}
        >
          <NevuxLogo iconOnly />
          <a
            href="#"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: 15,
            }}
          >
            Centro de ayuda
          </a>
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
            background: '#ef4444',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            zIndex: 100,
            maxWidth: '90%',
          }}
        >
          {error}
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
          background: '#fff',
          borderRadius: 12,
          padding: 14,
          marginTop: 12,
          border: '1px solid #eef0f3',
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
                border: '1px solid #e6e8ec',
                borderRadius: 10,
                fontSize: 15,
                color: '#111',
                background: '#fff',
                outline: 'none',
              }}
            />
            {mensajes.length > 1 && (
              <button
                onClick={() => onRemove(i)}
                aria-label="Eliminar mensaje"
                style={{
                  background: 'transparent',
                  border: '1px solid #e6e8ec',
                  borderRadius: 8,
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ef4444',
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
            background: '#fff',
            border: '1px solid #2563eb',
            color: '#2563eb',
            padding: '12px 20px',
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
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
      {/* CARD 1: MOSTRAR EN PRODUCTO */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #eef0f3',
          padding: 18,
        }}
      >
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={mostrarEnProducto}
            onChange={(e) => onChangeMostrar(e.target.checked)}
            style={{
              width: 22,
              height: 22,
              accentColor: '#2563eb',
              cursor: 'pointer',
              marginTop: 2,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>
              Mostrar en la ficha de producto
            </div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 6, lineHeight: 1.5 }}>
              Cuando está desactivado, el banner no se mostrará antes de la descripción del producto.
            </div>
          </div>
        </label>

        {mostrarEnProducto && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 12 }}>
              Ubicación del widget
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ubicacion-producto"
                  checked={ubicacionProducto === 'despues-boton'}
                  onChange={() => onChangeUbicacion('despues-boton')}
                  style={{
                    width: 20,
                    height: 20,
                    accentColor: '#2563eb',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: '#111', fontSize: 16 }}>
                  Después del botón "Agregar al carrito"
                </span>
              </label>
              <label style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ubicacion-producto"
                  checked={ubicacionProducto === 'despues-precio'}
                  onChange={() => onChangeUbicacion('despues-precio')}
                  style={{
                    width: 20,
                    height: 20,
                    accentColor: '#2563eb',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: '#111', fontSize: 16 }}>Después del precio del producto</span>
              </label>
            </div>
            <div style={{ color: '#6b7280', fontSize: 14, marginTop: 12, lineHeight: 1.5 }}>
              Selecciona dónde quieres que aparezca el banner en la ficha del producto
            </div>
          </div>
        )}
      </div>

      {/* CARD 2: MOSTRAR COMO BARRA */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #eef0f3',
          padding: 18,
        }}
      >
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={modoBarra}
            onChange={(e) => onChangeModoBarra(e.target.checked)}
            style={{
              width: 22,
              height: 22,
              accentColor: '#2563eb',
              cursor: 'pointer',
              marginTop: 2,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>
              Mostrar como barra en la parte superior
            </div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 6, lineHeight: 1.5 }}>
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
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #eef0f3',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }}>
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
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>Fondo del banner</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 4, lineHeight: 1.5 }}>
              Elegí el tipo de fondo y sus colores.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
            Tipo de fondo
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="tipo-fondo"
                checked={config.tipoFondo === 'solido'}
                onChange={() => onChange('tipoFondo', 'solido')}
                style={{
                  width: 20,
                  height: 20,
                  accentColor: '#2563eb',
                  cursor: 'pointer',
                }}
              />
              <span style={{ color: '#111', fontSize: 16 }}>Color sólido</span>
            </label>
            <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="tipo-fondo"
                checked={config.tipoFondo === 'degradado'}
                onChange={() => onChange('tipoFondo', 'degradado')}
                style={{
                  width: 20,
                  height: 20,
                  accentColor: '#2563eb',
                  cursor: 'pointer',
                }}
              />
              <span style={{ color: '#111', fontSize: 16 }}>Degradé</span>
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
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #eef0f3',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ color: '#2563eb', flexShrink: 0, marginTop: 2, fontWeight: 700, fontSize: 22, fontFamily: 'serif' }}>
            T
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>Texto</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 4, lineHeight: 1.5 }}>
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
          <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
            Tamaño de fuente
          </div>
          <div style={{ position: 'relative' }}>
            <select
              value={config.tamanoFuente}
              onChange={(e) => onChange('tamanoFuente', Number(e.target.value))}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e6e8ec',
                borderRadius: 10,
                fontSize: 16,
                color: '#111',
                background: '#fff',
                appearance: 'none',
                outline: 'none',
                cursor: 'pointer',
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
                color: '#6b7280',
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
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #eef0f3',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>Espacios y bordes</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 4, lineHeight: 1.5 }}>
              Redondeo del banner y separación entre mensajes.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
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
            <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
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
          <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
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
    <div style={{ fontWeight: 700, color: '#111', fontSize: 17, marginBottom: 4 }}>
      {children}
      {required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
    </div>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.5 }}>{children}</div>
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
        background: active ? '#fff' : 'transparent',
        border: 'none',
        padding: '14px 18px',
        fontSize: 16,
        fontWeight: 500,
        color: active ? '#111' : '#6b7280',
        cursor: 'pointer',
        borderBottom: active ? '2px solid #111' : '2px solid transparent',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        marginBottom: -1,
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
      <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 60,
              height: 46,
              border: '1px solid #e6e8ec',
              borderRadius: 10,
              cursor: 'pointer',
              padding: 4,
              background: '#fff',
            }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 14px',
            border: '1px solid #e6e8ec',
            borderRadius: 10,
            fontSize: 15,
            color: '#111',
            background: '#fff',
            outline: 'none',
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
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 46,
          height: 26,
          borderRadius: 999,
          background: value ? '#2563eb' : '#d1d5db',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </button>
      <span style={{ color: '#111', fontWeight: 600, fontSize: 15 }}>{label}</span>
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
          accentColor: '#2563eb',
          cursor: 'pointer',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          fontSize: 14,
          color: '#6b7280',
        }}
      >
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function NevuxLogo({ iconOnly }: { iconOnly?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 4C16 4 6 16 6 22C6 27.5 10.5 32 16 32C21.5 32 26 27.5 26 22C26 16 16 4 16 4Z"
          fill="#2563eb"
        />
      </svg>
      {!iconOnly && (
        <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>Nevux</span>
      )}
    </div>
  );
}

function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9l1-5h16l1 5M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
             }
