'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BarraProgresoPreview from './BarraProgresoPreview';
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
  colorBarraLlena: '#10B981',
  colorFondo: '#fafafa',
  colorTexto: '#000000',
  colorMonto: '#10B981',
  colorObjetivos: '#000000',
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
          {titlePrefix}: {widgetDefinition.name}
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
            <div
              style={{
                textAlign: 'center',
                color: '#000000',
                opacity: 0.6,
                fontSize: 16,
                fontWeight: 600,
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
            <span>
              La barra se actualiza automáticamente cuando el visitante agrega productos al carrito.
            </span>
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
              <TabButton active={activeTab === 'estilos'} onClick={() => setActiveTab('estilos')}>
                Estilos
              </TabButton>
            </div>
          </div>

          {/* CONTENIDO TABS */}
          <div style={{ padding: 20 }}>
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
              padding: '16px 20px 20px 20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ToggleField label="Widget activo" value={isActive} onChange={setIsActive} />
            </div>
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
      <div style={{ fontWeight: 700, color: '#000000', fontSize: 16, marginBottom: 4 }}>
        Objetivos <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 14 }}>(mínimo 1, máximo 5)</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {config.objetivos.map((obj, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
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
              <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>
                Objetivo {i + 1}
              </div>
              {config.objetivos.length > 1 && (
                <button
                  onClick={() => onRemoveObjetivo(i)}
                  aria-label="Eliminar objetivo"
                  style={{
                    background: '#fee2e2',
                    border: 'none',
                    borderRadius: 8,
                    width: 38,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#991b1b',
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
                <div style={{ fontWeight: 600, color: '#000000', fontSize: 14, marginBottom: 6 }}>
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
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 15,
                    color: '#000000',
                    background: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#10B981')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <div style={{ fontWeight: 600, color: '#000000', fontSize: 14, marginBottom: 6 }}>
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
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 15,
                    color: '#000000',
                    background: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#10B981')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            </div>

            {/* Icono */}
            <div>
              <div style={{ fontWeight: 600, color: '#000000', fontSize: 14, marginBottom: 8 }}>
                Icono <span style={{ opacity: 0.6, fontWeight: 400 }}>(opcional)</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 8,
                }}
              >
                {ICONOS_DISPONIBLES.map((ic) => {
                  const isSelected = obj.icono === ic.id;
                  return (
                    <button
                      key={ic.id}
                      onClick={() => onUpdateObjetivo(i, 'icono', ic.id)}
                      title={ic.label}
                      style={{
                        aspectRatio: '1 / 1',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        border: `1.5px solid ${
                          isSelected ? '#10B981' : '#e5e7eb'
                        }`,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isSelected ? '#10B981' : '#000000',
                      }}
                    >
                      {renderIconoBtn(ic.id, 18)}
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
            background: '#ffffff',
            border: '1.5px solid #10B981',
            color: '#10B981',
            padding: '12px 24px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Agregar objetivo
        </button>
      )}

      {/* INFO SUTIL */}
      <div
        style={{
          marginTop: 20,
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 12,
          padding: '14px 18px',
          color: '#000000',
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        💡 <strong>Recordá</strong> crear las promociones y límites en el panel de control de Tiendanube.
      </div>

      {/* TEXTO CUANDO FALTA MONTO */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontWeight: 700, color: '#000000', fontSize: 16, marginBottom: 8 }}>
          Texto cuando falta monto
        </div>
        <input
          type="text"
          value={config.textoFaltante}
          onChange={(e) => onUpdate('textoFaltante', e.target.value)}
          placeholder="Te faltan {x} para {objetivo}"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '1.5px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 15,
            color: '#000000',
            background: '#ffffff',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#10B981')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        />
        <div style={{ marginTop: 8, fontSize: 13, color: '#000000', opacity: 0.6 }}>
          <VarChip>{'{x}'}</VarChip>= monto faltante &nbsp;|&nbsp;{' '}
          <VarChip>{'{objetivo}'}</VarChip>= nombre del objetivo
        </div>
      </div>

      {/* TEXTO CUANDO SE CUMPLE */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontWeight: 700, color: '#000000', fontSize: 16, marginBottom: 8 }}>
          Texto cuando se cumple un objetivo
        </div>
        <input
          type="text"
          value={config.textoCumplido}
          onChange={(e) => onUpdate('textoCumplido', e.target.value)}
          placeholder="¡{objetivo} desbloqueado! 🎉"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '1.5px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 15,
            color: '#000000',
            background: '#ffffff',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#10B981')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        />
        <div style={{ marginTop: 8, fontSize: 13, color: '#000000', opacity: 0.6 }}>
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
      <div style={{ fontWeight: 700, color: '#000000', fontSize: 16, marginBottom: 0 }}>
        Posición en la ficha del producto
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
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
              padding: '16px',
              borderTop: idx === 0 ? 'none' : '1px solid #e5e7eb',
              background: config.posicionFicha === opt.id ? '#ecfdf5' : '#ffffff',
            }}
          >
            <div
              onClick={() => onUpdate('posicionFicha', opt.id)}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: config.posicionFicha === opt.id ? '6px solid #10B981' : '2px solid #d1d5db',
                background: '#ffffff',
                cursor: 'pointer',
                marginTop: 2,
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            />
            <div>
              <div style={{ fontWeight: 700, color: '#000000', fontSize: 15 }}>
                {opt.title}
              </div>
              <div style={{ color: '#000000', opacity: 0.6, fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                {opt.desc}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div
        style={{
          background: config.elementoFlotante ? '#ecfdf5' : '#ffffff',
          borderRadius: 12,
          border: config.elementoFlotante ? '1.5px solid #10B981' : '1px solid #e5e7eb',
          padding: 16,
          transition: 'border-color 0.2s',
        }}
      >
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <div
            onClick={() => onUpdate('elementoFlotante', !config.elementoFlotante)}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: config.elementoFlotante ? '#10B981' : '#ffffff',
              border: config.elementoFlotante ? '2px solid #10B981' : '2px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              transition: 'all 0.2s',
            }}
          >
            {config.elementoFlotante && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 15 }}>
              Elemento flotante
            </div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
              Se muestra como un widget flotante fijo en la esquina de la pantalla.
            </div>
          </div>
        </label>
      </div>

      <div
        style={{
          background: config.enCarrito ? '#ecfdf5' : '#ffffff',
          borderRadius: 12,
          border: config.enCarrito ? '1.5px solid #10B981' : '1px solid #e5e7eb',
          padding: 16,
          transition: 'border-color 0.2s',
        }}
      >
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <div
            onClick={() => onUpdate('enCarrito', !config.enCarrito)}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: config.enCarrito ? '#10B981' : '#ffffff',
              border: config.enCarrito ? '2px solid #10B981' : '2px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              transition: 'all 0.2s',
            }}
          >
            {config.enCarrito && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 15 }}>Del carrito</div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
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
              <rect x="3" y="3" width="7" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>Diseño y estructura</div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Definí cómo se muestran los objetivos en escritorio y móvil.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
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
                  background: config.formatoObjetivos === opt.id ? '#ecfdf5' : '#ffffff',
                  border: `1.5px solid ${config.formatoObjetivos === opt.id ? '#10B981' : '#e5e7eb'}`,
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  onClick={() => onUpdate('formatoObjetivos', opt.id)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: config.formatoObjetivos === opt.id ? '5px solid #10B981' : '2px solid #d1d5db',
                    background: '#ffffff',
                  }}
                />
                <div style={{ fontWeight: 700, color: '#000000', fontSize: 14 }}>{opt.title}</div>
                <div style={{ color: '#000000', opacity: 0.6, fontSize: 12, lineHeight: 1.4 }}>{opt.desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
              Bordes redondeados
            </div>
            <RangeSlider
              min={0}
              max={20}
              step={1}
              value={config.bordesRedondeados}
              onChange={(v) => onUpdate('bordesRedondeados', v)}
              labels={['0px', '8px', '20px']}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 15, marginBottom: 10 }}>
              Relleno interno
            </div>
            <RangeSlider
              min={0}
              max={28}
              step={1}
              value={config.rellenoInterno}
              onChange={(v) => onUpdate('rellenoInterno', v)}
              labels={['0px', '14px', '28px']}
            />
          </div>
        </div>
      </div>

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
              <circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.5-9-10-9z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>Colores</div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Personalizá barra, fondo y textos.
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

      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
          <div
            style={{
              color: '#10B981',
              flexShrink: 0,
              marginTop: 2,
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            Aa
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#000000', fontSize: 16 }}>Tipografía</div>
            <div style={{ color: '#000000', opacity: 0.6, fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
              Ajustá el tamaño de textos y etiquetas.
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
        background: '#ecfdf5',
        color: '#059669',
        padding: '2px 6px',
        borderRadius: 4,
        fontFamily: 'monospace',
        fontSize: 12,
        fontWeight: 600,
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
      <div style={{ fontWeight: 700, color: '#000000', fontSize: 14, marginBottom: 8, lineHeight: 1.3 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={value === 'transparent' ? '#ffffff' : value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 44,
            height: 40,
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            cursor: 'pointer',
            padding: 2,
            background: '#ffffff',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            background: '#ffffff',
            paddingRight: clearable ? 8 : 0,
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              color: '#000000',
              background: 'transparent',
              outline: 'none',
              minWidth: 0,
              fontFamily: 'monospace',
            }}
          />
          {clearable && onClear && (
            <button
              onClick={onClear}
              aria-label="Limpiar"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#000000',
                opacity: 0.5,
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
      <div style={{ fontWeight: 700, color: '#000000', fontSize: 14, marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
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
            boxSizing: 'border-box',
            fontFamily: 'inherit',
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
            color: '#000000',
            opacity: 0.5,
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

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
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
