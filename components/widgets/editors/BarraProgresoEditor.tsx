'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BarraProgresoPreview from './BarraProgresoPreview';

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

interface Objetivo {
  nombre: string;
  monto: number;
  icono: string;
}

interface BarraConfig {
  objetivos: Objetivo[];
  textoFaltante: string;
  textoCumplido: string;
  // Ubicación
  posicionFicha: 'debajo-boton' | 'encima-form' | 'no-mostrar';
  elementoFlotante: boolean;
  enCarrito: boolean;
  // Estilos
  formatoObjetivos: 'automatico' | 'lista';
  bordesRedondeados: number;
  rellenoInterno: number;
  colorBarraVacia: string;
  colorBarraLlena: string;
  colorFondo: string;
  colorTexto: string;
  colorMonto: string;
  colorObjetivos: string;
  tamanoFuenteObjetivos: number;
  tamanoFuenteTexto: number;
}

const DEFAULT_CONFIG: BarraConfig = {
  objetivos: [{ nombre: 'Envío gratis', monto: 50000, icono: 'none' }],
  textoFaltante: 'Te faltan {x} para {objetivo}',
  textoCumplido: '¡{objetivo} desbloqueado! 🎉',
  posicionFicha: 'debajo-boton',
  elementoFlotante: false,
  enCarrito: false,
  formatoObjetivos: 'automatico',
  bordesRedondeados: 8,
  rellenoInterno: 14,
  colorBarraVacia: '#e0e0e0',
  colorBarraLlena: '#22c55e',
  colorFondo: '#fafafa',
  colorTexto: '#333333',
  colorMonto: '#0d6efd',
  colorObjetivos: '#333333',
  tamanoFuenteObjetivos: 11,
  tamanoFuenteTexto: 13,
};

const ICONOS_DISPONIBLES = [
  { id: 'none', label: 'Sin ícono' },
  { id: 'truck', label: 'Camión' },
  { id: 'gift', label: 'Regalo' },
  { id: 'tag', label: 'Etiqueta' },
  { id: 'star', label: 'Estrella' },
  { id: 'percent', label: 'Porcentaje' },
  { id: 'check', label: 'Check' },
  { id: 'shield', label: 'Escudo' },
  { id: 'bolt', label: 'Rayo' },
  { id: 'heart', label: 'Corazón' },
  { id: 'coffee', label: 'Café' },
  { id: 'hexagon', label: 'Hexágono' },
  { id: 'card', label: 'Tarjeta' },
  { id: 'smile', label: 'Sonrisa' },
];

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function BarraProgresoEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: EditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilos'>('general');
  const [config, setConfig] = useState<BarraConfig>({
    ...DEFAULT_CONFIG,
    ...(existingWidget?.config ?? {}),
  });
  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!existingWidget;
  const titlePrefix = isEditing ? 'Editar widget' : 'Nuevo widget';

  const updateConfig = <K extends keyof BarraConfig>(key: K, value: BarraConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const addObjetivo = () => {
    if (config.objetivos.length >= 5) return;
    updateConfig('objetivos', [
      ...config.objetivos,
      { nombre: '', monto: 0, icono: 'none' },
    ]);
  };

  const removeObjetivo = (index: number) => {
    if (config.objetivos.length <= 1) return;
    updateConfig(
      'objetivos',
      config.objetivos.filter((_, i) => i !== index)
    );
  };

  const updateObjetivo = <K extends keyof Objetivo>(index: number, key: K, value: Objetivo[K]) => {
    const nuevos = [...config.objetivos];
    nuevos[index] = { ...nuevos[index], [key]: value };
    updateConfig('objetivos', nuevos);
  };

  const handleSave = async () => {
    setError(null);

    const objetivosValidos = config.objetivos.filter(
      (o) => o.nombre.trim().length > 0 && o.monto > 0
    );
    if (objetivosValidos.length === 0) {
      setError('Debés agregar al menos un objetivo con nombre y monto válidos.');
      return;
    }

    if (
      config.posicionFicha === 'no-mostrar' &&
      !config.elementoFlotante &&
      !config.enCarrito
    ) {
      setError('Debés seleccionar al menos una ubicación (ficha, flotante o carrito).');
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
          config: { ...config, objetivos: objetivosValidos },
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
          <span style={{ fontWeight: 600, color: '#111' }}>Widget NEVUX</span>
        </div>

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
          {titlePrefix}: {widgetDefinition.name}
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
            <div
              style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: 18,
                marginBottom: 16,
              }}
            >
              Vista previa
            </div>
            <BarraProgresoPreview config={config} subtotalDemo={0} />
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
            <span>
              La barra se actualiza automáticamente cuando el visitante agrega productos al carrito.
            </span>
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
              <TabButton active={activeTab === 'estilos'} onClick={() => setActiveTab('estilos')}>
                Estilos
              </TabButton>
            </div>
          </div>

          {/* CONTENIDO TABS */}
          <div style={{ background: '#f7f8fa', padding: 20 }}>
            {activeTab === 'general' && (
              <GeneralTab
                config={config}
                onUpdate={updateConfig}
                onAddObjetivo={addObjetivo}
                onRemoveObjetivo={removeObjetivo}
                onUpdateObjetivo={updateObjetivo}
              />
            )}

            {activeTab === 'ubicacion' && (
              <UbicacionTab config={config} onUpdate={updateConfig} />
            )}

            {activeTab === 'estilos' && (
              <EstilosTab config={config} onUpdate={updateConfig} />
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ToggleField label="Widget activo" value={isActive} onChange={setIsActive} />
              <IconInfoSmall />
            </div>
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
  config,
  onUpdate,
  onAddObjetivo,
  onRemoveObjetivo,
  onUpdateObjetivo,
}: {
  config: BarraConfig;
  onUpdate: <K extends keyof BarraConfig>(key: K, value: BarraConfig[K]) => void;
  onAddObjetivo: () => void;
  onRemoveObjetivo: (i: number) => void;
  onUpdateObjetivo: <K extends keyof Objetivo>(i: number, key: K, value: Objetivo[K]) => void;
}) {
  return (
    <div>
      {/* OBJETIVOS */}
      <div style={{ fontWeight: 700, color: '#111', fontSize: 18, marginBottom: 4 }}>
        Objetivos <span style={{ fontWeight: 400, color: '#6b7280', fontSize: 15 }}>(mínimo 1, máximo 5)</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {config.objetivos.map((obj, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #eef0f3',
              padding: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>
                Objetivo {i + 1}
              </div>
              {config.objetivos.length > 1 && (
                <button
                  onClick={() => onRemoveObjetivo(i)}
                  aria-label="Eliminar objetivo"
                  style={{
                    background: '#fff',
                    border: '1px solid #ef4444',
                    borderRadius: 8,
                    width: 40,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ef4444',
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

            {/* Nombre + Monto */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontWeight: 500, color: '#111', fontSize: 15, marginBottom: 6 }}>
                  Nombre del objetivo
                </div>
                <input
                  type="text"
                  value={obj.nombre}
                  onChange={(e) => onUpdateObjetivo(i, 'nombre', e.target.value)}
                  placeholder="Ej: Envío gratis"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e6e8ec',
                    borderRadius: 10,
                    fontSize: 15,
                    color: '#111',
                    background: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <div style={{ fontWeight: 500, color: '#111', fontSize: 15, marginBottom: 6 }}>
                  Monto ($)
                </div>
                <input
                  type="number"
                  value={obj.monto || ''}
                  onChange={(e) => onUpdateObjetivo(i, 'monto', Number(e.target.value) || 0)}
                  placeholder="50000"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e6e8ec',
                    borderRadius: 10,
                    fontSize: 15,
                    color: '#111',
                    background: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Icono */}
            <div>
              <div style={{ fontWeight: 500, color: '#111', fontSize: 15, marginBottom: 8 }}>
                Icono <span style={{ color: '#6b7280', fontWeight: 400 }}>(opcional)</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 8,
                }}
              >
                {ICONOS_DISPONIBLES.map((ic) => {
                  const isSelected = obj.icono === ic.id;
                  const isNone = ic.id === 'none';
                  return (
                    <button
                      key={ic.id}
                      onClick={() => onUpdateObjetivo(i, 'icono', ic.id)}
                      title={ic.label}
                      style={{
                        aspectRatio: '1 / 1',
                        background: isSelected && isNone ? '#fef2f2' : '#fff',
                        border: `1px solid ${
                          isSelected ? (isNone ? '#ef4444' : '#2563eb') : '#e6e8ec'
                        }`,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isSelected ? (isNone ? '#ef4444' : '#2563eb') : '#111',
                      }}
                    >
                      {renderIconoBtn(ic.id, 20)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AGREGAR OBJETIVO */}
      {config.objetivos.length < 5 && (
        <button
          onClick={onAddObjetivo}
          style={{
            marginTop: 14,
            background: '#fff',
            border: '1px solid #2563eb',
            color: '#2563eb',
            padding: '12px 24px',
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Agregar objetivo
        </button>
      )}

      {/* INFO AMARILLA */}
      <div
        style={{
          marginTop: 20,
          background: '#fef9c3',
          border: '1px solid #fde68a',
          borderRadius: 12,
          padding: '16px 18px',
          color: '#78350f',
          fontSize: 15,
          lineHeight: 1.5,
        }}
      >
        💡 <strong>Recordá</strong> crear las promociones y límites en el panel de control de Tiendanube.
      </div>

      {/* TEXTO CUANDO FALTA MONTO */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontWeight: 700, color: '#111', fontSize: 17, marginBottom: 8 }}>
          Texto cuando falta monto
        </div>
        <input
          type="text"
          value={config.textoFaltante}
          onChange={(e) => onUpdate('textoFaltante', e.target.value)}
          placeholder="Te faltan {x} para {objetivo}"
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '1px solid #e6e8ec',
            borderRadius: 10,
            fontSize: 15,
            color: '#111',
            background: '#fff',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
          <VarChip>{'{x}'}</VarChip>= monto faltante &nbsp;|&nbsp;{' '}
          <VarChip>{'{objetivo}'}</VarChip>= nombre del objetivo
        </div>
      </div>

      {/* TEXTO CUANDO SE CUMPLE */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontWeight: 700, color: '#111', fontSize: 17, marginBottom: 8 }}>
          Texto cuando se cumple un objetivo
        </div>
        <input
          type="text"
          value={config.textoCumplido}
          onChange={(e) => onUpdate('textoCumplido', e.target.value)}
          placeholder="¡{objetivo} desbloqueado! 🎉"
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '1px solid #e6e8ec',
            borderRadius: 10,
            fontSize: 15,
            color: '#111',
            background: '#fff',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
          <VarChip>{'{objetivo}'}</VarChip>= nombre del objetivo alcanzado
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB UBICACIÓN
// ═══════════════════════════════════════════════════════════

function UbicacionTab({
  config,
  onUpdate,
}: {
  config: BarraConfig;
  onUpdate: <K extends keyof BarraConfig>(key: K, value: BarraConfig[K]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontWeight: 700, color: '#111', fontSize: 17, marginBottom: 0 }}>
        Posición en la ficha del producto
      </div>

      {/* CARD RADIOS FICHA */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #eef0f3',
          overflow: 'hidden',
        }}
      >
        {[
          {
            id: 'debajo-boton' as const,
            title: 'Debajo del botón "Agregar al carrito"',
            desc: 'Se inserta debajo del botón de agregar al carrito.',
          },
          {
            id: 'encima-form' as const,
            title: 'Por encima del formulario de compra',
            desc: 'Se inserta justo antes del formulario (encima del botón "Agregar al carrito").',
          },
          {
            id: 'no-mostrar' as const,
            title: 'No mostrar en ficha de producto',
            desc: 'El widget no se muestra en la página del producto.',
          },
        ].map((opt, idx) => (
          <label
            key={opt.id}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              cursor: 'pointer',
              padding: '18px',
              borderTop: idx === 0 ? 'none' : '1px solid #eef0f3',
            }}
          >
            <input
              type="radio"
              name="posicion-ficha"
              checked={config.posicionFicha === opt.id}
              onChange={() => onUpdate('posicionFicha', opt.id)}
              style={{
                width: 20,
                height: 20,
                accentColor: '#2563eb',
                cursor: 'pointer',
                marginTop: 2,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontWeight: 700, color: '#111', fontSize: 16 }}>
                {opt.title}
              </div>
              <div style={{ color: '#6b7280', fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
                {opt.desc}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* CARD ELEMENTO FLOTANTE */}
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
            checked={config.elementoFlotante}
            onChange={(e) => onUpdate('elementoFlotante', e.target.checked)}
            style={{
              width: 20,
              height: 20,
              accentColor: '#2563eb',
              cursor: 'pointer',
              marginTop: 2,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 16 }}>
              Elemento flotante
            </div>
            <div style={{ color: '#6b7280', fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Se muestra como un widget flotante fijo en la esquina de la pantalla.
            </div>
          </div>
        </label>
      </div>

      {/* CARD DEL CARRITO */}
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
            checked={config.enCarrito}
            onChange={(e) => onUpdate('enCarrito', e.target.checked)}
            style={{
              width: 20,
              height: 20,
              accentColor: '#2563eb',
              cursor: 'pointer',
              marginTop: 2,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 16 }}>Del carrito</div>
            <div style={{ color: '#6b7280', fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Se muestra dentro del carrito, antes del botón de iniciar compra.
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB ESTILOS
// ═══════════════════════════════════════════════════════════

function EstilosTab({
  config,
  onUpdate,
}: {
  config: BarraConfig;
  onUpdate: <K extends keyof BarraConfig>(key: K, value: BarraConfig[K]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* CARD: DISEÑO Y ESTRUCTURA */}
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
              <rect x="3" y="3" width="7" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>Diseño y estructura</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 4, lineHeight: 1.5 }}>
              Defina cómo se muestran los objetivos en escritorio y móvil.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
            Formato de objetivos
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { id: 'automatico' as const, title: 'Automático', desc: 'Escritorio: barra con hits en línea. Móvil: lista.' },
              { id: 'lista' as const, title: 'Siempre lista', desc: 'Muestra formato lista en móvil y escritorio.' },
            ].map((opt) => (
              <label
                key={opt.id}
                style={{
                  flex: '1 1 140px',
                  cursor: 'pointer',
                  background: '#fff',
                  border: `1px solid ${config.formatoObjetivos === opt.id ? '#2563eb' : '#e6e8ec'}`,
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <input
                  type="radio"
                  name="formato-objetivos"
                  checked={config.formatoObjetivos === opt.id}
                  onChange={() => onUpdate('formatoObjetivos', opt.id)}
                  style={{ width: 18, height: 18, accentColor: '#2563eb', cursor: 'pointer' }}
                />
                <div style={{ fontWeight: 700, color: '#111', fontSize: 15 }}>{opt.title}</div>
                <div style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.4 }}>{opt.desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
              Bordes redondeados
            </div>
            <RangeSlider
              min={0}
              max={20}
              step={1}
              value={config.bordesRedondeados}
              onChange={(v) => onUpdate('bordesRedondeados', v)}
              labels={['0px', '8 píxeles', '20 píxeles']}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 16, marginBottom: 10 }}>
              Relleno interno
            </div>
            <RangeSlider
              min={0}
              max={28}
              step={1}
              value={config.rellenoInterno}
              onChange={(v) => onUpdate('rellenoInterno', v)}
              labels={['0px', '14 píxeles', '28 píxeles']}
            />
          </div>
        </div>
      </div>

      {/* CARD: COLORES */}
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
              <circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.5-9-10-9z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>Colores</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 4, lineHeight: 1.5 }}>
              Personaliza barra, fondo y textos.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <ColorPickerField
            label="Color de la barra (vacía)"
            value={config.colorBarraVacia}
            onChange={(v) => onUpdate('colorBarraVacia', v)}
          />
          <ColorPickerField
            label="Color de la barra (llena)"
            value={config.colorBarraLlena}
            onChange={(v) => onUpdate('colorBarraLlena', v)}
          />
          <ColorPickerField
            label="Color de fondo del widget"
            value={config.colorFondo}
            onChange={(v) => onUpdate('colorFondo', v)}
            clearable
            onClear={() => onUpdate('colorFondo', 'transparent')}
          />
          <ColorPickerField
            label="Color del texto"
            value={config.colorTexto}
            onChange={(v) => onUpdate('colorTexto', v)}
          />
          <ColorPickerField
            label="Color del monto ({x})"
            value={config.colorMonto}
            onChange={(v) => onUpdate('colorMonto', v)}
          />
          <ColorPickerField
            label="Color de los objetivos"
            value={config.colorObjetivos}
            onChange={(v) => onUpdate('colorObjetivos', v)}
          />
        </div>
      </div>

      {/* CARD: TIPOGRAFÍA */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #eef0f3',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div
            style={{
              color: '#2563eb',
              flexShrink: 0,
              marginTop: 2,
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Aa
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 17 }}>Tipografía</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 4, lineHeight: 1.5 }}>
              Ajusta el tamaño de textos y etiquetas.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <SelectField
            label="Tamaño fuente objetivos"
            value={config.tamanoFuenteObjetivos}
            onChange={(v) => onUpdate('tamanoFuenteObjetivos', v)}
            options={[9, 10, 11, 12, 13, 14, 16]}
          />
          <SelectField
            label="Tamaño fuente texto"
            value={config.tamanoFuenteTexto}
            onChange={(v) => onUpdate('tamanoFuenteTexto', v)}
            options={[11, 12, 13, 14, 15, 16, 18, 20]}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTES REUTILIZABLES
// ═══════════════════════════════════════════════════════════

function VarChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: '#fce7f3',
        color: '#be185d',
        padding: '2px 6px',
        borderRadius: 4,
        fontFamily: 'monospace',
        fontSize: 13,
      }}
    >
      {children}
    </span>
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
  clearable,
  onClear,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
  onClear?: () => void;
}) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: '#111', fontSize: 15, marginBottom: 8, lineHeight: 1.3 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={value === 'transparent' ? '#ffffff' : value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 46,
            height: 44,
            border: '1px solid #e6e8ec',
            borderRadius: 10,
            cursor: 'pointer',
            padding: 4,
            background: '#fff',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e6e8ec',
            borderRadius: 10,
            background: '#fff',
            paddingRight: clearable ? 8 : 0,
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 14px',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              color: '#111',
              background: 'transparent',
              outline: 'none',
              minWidth: 0,
            }}
          />
          {clearable && onClear && (
            <button
              onClick={onClear}
              aria-label="Limpiar"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  options: number[];
}) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: '#111', fontSize: 15, marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '1px solid #e6e8ec',
            borderRadius: 10,
            fontSize: 15,
            color: '#111',
            background: '#fff',
            appearance: 'none',
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          {options.map((n) => (
            <option key={n} value={n}>
              {n} píxeles
            </option>
          ))}
        </select>
        <div
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#6b7280',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
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
          fontSize: 13,
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
      {!iconOnly && <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>Nevux</span>}
    </div>
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

function IconInfoSmall() {
  return (
    <span style={{ color: '#2563eb', display: 'inline-flex' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
// ÍCONOS PARA EL GRID DE SELECCIÓN
// ═══════════════════════════════════════════════════════════

function renderIconoBtn(icono: string, size: number): React.ReactNode {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (icono) {
    case 'none':
      return (
        <svg {...props}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...props}>
          <path d="M10 17h4V5H2v12h3" />
          <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      );
    case 'gift':
      return (
        <svg {...props}>
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...props}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case 'star':
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'percent':
      return (
        <svg {...props}>
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      );
    case 'check':
      return (
        <svg {...props}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'coffee':
      return (
        <svg {...props}>
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg {...props}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      );
    case 'card':
      return (
        <svg {...props}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'smile':
      return <span style={{ fontSize: size + 2, lineHeight: 1 }}>😊</span>;
    default:
      return null;
  }
  }
