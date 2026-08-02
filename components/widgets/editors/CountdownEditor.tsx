// components/widgets/editors/CountdownEditor.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Timer,
  Info,
  Clock,
  Layers,
  Palette,
  Type,
  MapPin,
  LayoutDashboard,
  AlignCenter,
  SplitSquareHorizontal,
  Save,
  Check,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CountdownPreview from './CountdownPreview';

interface CountdownConfig {
  title: string;
  subtitle: string;
  endDate: string;
  autoRestart: boolean;
  showDays: boolean;
  // Ubicación
  showInProduct: boolean;
  widgetPosition: 'before-cart' | 'before-title';
  showAsTopBar: boolean;
  showInCart: boolean;
  // Estilos
  clockStyle: 'classic' | 'retro-flip';
  alignment: 'split' | 'centered';
  showLabels: boolean;
  // Fondo
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  // Colores
  subtitleBg: string;
  clockBg: string;
  titleColor: string;
  subtitleColor: string;
  numbersColor: string;
  labelsColor: string;
  separatorColor: string;
  // Tipografía
  titleFontSize: string;
  numbersFontSize: string;
  // Border
  borderRadius: string;
  clockBorderRadius: string;
}

const DEFAULT_CONFIG: CountdownConfig = {
  title: 'Oferta 🔥',
  subtitle: '',
  endDate: getDefaultEndDate(),
  autoRestart: false,
  showDays: true,
  showInProduct: true,
  widgetPosition: 'before-cart',
  showAsTopBar: false,
  showInCart: false,
  clockStyle: 'classic',
  alignment: 'split',
  showLabels: true,
  backgroundType: 'solid',
  backgroundColor: '#1e1e1e',
  gradientFrom: '#1e1e1e',
  gradientTo: '#3b3b3b',
  subtitleBg: '#fdc624',
  clockBg: '#ef4444',
  titleColor: '#ffffff',
  subtitleColor: '#000000',
  numbersColor: '#ffffff',
  labelsColor: '#cccccc',
  separatorColor: '#ffffff',
  titleFontSize: '16px',
  numbersFontSize: '24px',
  borderRadius: '12px',
  clockBorderRadius: '6px',
};

function getDefaultEndDate(): string {
  const d = new Date();
  d.setHours(d.getHours() + 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

type TabId = 'general' | 'ubicacion' | 'estilos';

interface Props {
  widgetDefinition: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string;
  };
  existingWidget?: {
    id: string;
    config: Record<string, unknown>;
    is_active: boolean;
    target_type: string;
    target_product_id: number | null;
  } | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: number;
}

export default function CountdownEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<CountdownConfig>(() => {
    if (existingWidget?.config) {
      return { ...DEFAULT_CONFIG, ...(existingWidget.config as Partial<CountdownConfig>) };
    }
    return { ...DEFAULT_CONFIG };
  });

  const isEditing = !!existingWidget;

  const updateConfig = useCallback((key: keyof CountdownConfig, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id || undefined,
          widget_slug: widgetDefinition.slug,
          widget_type: widgetDefinition.category,
          target_type: targetType,
          target_product_id: productId,
          store_id: storeId,
          config,
          is_active: isActive,
        }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert('Error al guardar el widget');
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <LayoutDashboard size={16} /> },
    { id: 'ubicacion', label: 'Ubicación', icon: <MapPin size={16} /> },
    { id: 'estilos', label: 'Estilos', icon: <Palette size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button
            onClick={() => router.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: 14,
              padding: 0,
              marginBottom: 8,
            }}
          >
            <ArrowLeft size={18} />
            Volver
          </button>

          {/* Badge tipo */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#f3f4f6',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 13,
              color: '#4b5563',
              marginBottom: 8,
            }}
          >
            🏪 Widget {targetType === 'all' ? 'general para toda la tienda' : `para producto #${productId}`}
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 400,
              margin: 0,
              color: '#111',
            }}
          >
            {isEditing ? 'Editar' : 'Nuevo'} widget:{' '}
            <strong>{widgetDefinition.name}</strong>
            {targetType === 'all' && (
              <span style={{ color: '#6b7280', fontWeight: 400 }}> (General)</span>
            )}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>
        {/* Preview en vivo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
            border: '1px solid #e5e7eb',
          }}
        >
          <CountdownPreview config={config} />
        </motion.div>

        {/* Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '12px 16px',
            background: '#fff',
            borderRadius: 12,
            marginBottom: 24,
            border: '1px solid #e5e7eb',
          }}
        >
          <Info size={18} style={{ color: '#6b7280', marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: '#6b7280' }}>
            La cuenta regresiva aparecerá antes del botón &quot;Agregar al carrito&quot;.
          </span>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            borderBottom: '2px solid #e5e7eb',
            marginBottom: 24,
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && (
              <GeneralTab config={config} updateConfig={updateConfig} />
            )}
            {activeTab === 'ubicacion' && (
              <UbicacionTab config={config} updateConfig={updateConfig} />
            )}
            {activeTab === 'estilos' && (
              <EstilosTab config={config} updateConfig={updateConfig} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0 24px' }} />

        {/* Footer: Toggle + Save */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsActive(!isActive)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? '#2563eb' : '#d1d5db',
                position: 'relative',
                transition: 'background 0.25s',
                padding: 0,
              }}
            >
              <motion.div
                animate={{ x: isActive ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 2,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
              Widget {isActive ? 'activo' : 'inactivo'}
            </span>
            <Info size={14} style={{ color: '#9ca3af', cursor: 'help' }} />
          </div>

          {/* Save button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 32px',
              background: saved ? '#16a34a' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'background 0.3s',
            }}
          >
            {saving ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Guardando...
              </>
            ) : saved ? (
              <>
                <Check size={18} />
                ¡Guardado!
              </>
            ) : (
              <>
                {isEditing ? <Save size={18} /> : <Timer size={18} />}
                {isEditing ? 'Guardar cambios' : 'Crear widget'}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Footer branding */}
        <div
          style={{
            textAlign: 'center',
            padding: '40px 0 20px',
            color: '#9ca3af',
            fontSize: 13,
          }}
        >
          <div style={{ marginBottom: 8, fontSize: 20 }}>⚡</div>
          Centro de ayuda
        </div>
      </div>

      {/* Keyframes for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: GENERAL
   ════════════════════════════════════════════════════════════ */

function GeneralTab({
  config,
  updateConfig,
}: {
  config: CountdownConfig;
  updateConfig: (key: keyof CountdownConfig, value: unknown) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Título */}
      <FieldGroup>
        <FieldLabel required>Título</FieldLabel>
        <input
          type="text"
          value={config.title}
          onChange={e => updateConfig('title', e.target.value)}
          placeholder="Oferta 🔥"
          style={inputStyle}
        />
        <FieldHint>Texto principal del contador</FieldHint>
      </FieldGroup>

      {/* Subtítulo */}
      <FieldGroup>
        <FieldLabel>
          Subtítulo <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opcional)</span>
        </FieldLabel>
        <input
          type="text"
          value={config.subtitle}
          onChange={e => updateConfig('subtitle', e.target.value)}
          placeholder="Ingresa un subtítulo..."
          style={inputStyle}
        />
        <FieldHint>Descripción o promoción</FieldHint>
      </FieldGroup>

      {/* Fecha y hora final */}
      <FieldGroup>
        <FieldLabel required>Fecha y hora final</FieldLabel>
        <input
          type="datetime-local"
          value={config.endDate}
          onChange={e => updateConfig('endDate', e.target.value)}
          style={inputStyle}
        />
        <FieldHint>
          Selecciona cuándo termina la cuenta regresiva. Llegado a la fecha se ocultará
          automáticamente a menos que tenga configurado el reinicio automático.
        </FieldHint>
      </FieldGroup>

      {/* Reiniciar automáticamente */}
      <CheckboxCard
        checked={config.autoRestart}
        onChange={v => updateConfig('autoRestart', v)}
        title="Reiniciar automáticamente cuando termine"
        description="El contador se reiniciará con la duración configurada cada vez que llegue a 00:00:00."
      />

      {/* Mostrar días */}
      <CheckboxCard
        checked={config.showDays}
        onChange={v => updateConfig('showDays', v)}
        title="Mostrar días"
        description='Si se desactiva, los días se acumulan en las horas (ej: 1 día 2 horas → 26 HRS). Si está activado pero quedan menos de 24 horas, la sección de días se oculta automáticamente.'
        isBlue
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: UBICACIÓN
   ════════════════════════════════════════════════════════════ */

function UbicacionTab({
  config,
  updateConfig,
}: {
  config: CountdownConfig;
  updateConfig: (key: keyof CountdownConfig, value: unknown) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Mostrar en ficha de producto */}
      <CheckboxCard
        checked={config.showInProduct}
        onChange={v => updateConfig('showInProduct', v)}
        title="Mostrar en ficha de producto"
        description="El widget aparecerá dentro de la ficha de producto."
        isBlue
      />

      {config.showInProduct && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: '#111' }}>
            Ubicación del widget
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="widgetPosition"
                checked={config.widgetPosition === 'before-cart'}
                onChange={() => updateConfig('widgetPosition', 'before-cart')}
                style={{ accentColor: '#2563eb', width: 18, height: 18 }}
              />
              <span style={{ fontSize: 14, color: '#374151' }}>
                Antes del botón &quot;Agregar al carrito&quot;
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="widgetPosition"
                checked={config.widgetPosition === 'before-title'}
                onChange={() => updateConfig('widgetPosition', 'before-title')}
                style={{ accentColor: '#2563eb', width: 18, height: 18 }}
              />
              <span style={{ fontSize: 14, color: '#374151' }}>
                Antes del título del producto
              </span>
            </label>
          </div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>
            Selecciona dónde quieres que aparezca la cuenta regresiva en la ficha del producto
          </div>
        </motion.div>
      )}

      {/* Mostrar como barra fija */}
      <CheckboxCard
        checked={config.showAsTopBar}
        onChange={v => updateConfig('showAsTopBar', v)}
        title="Mostrar como barra fija en la parte superior de la pantalla"
        description="Se mostrará el widget en una barra fija en la parte superior de la pantalla."
      />

      {/* Mostrar en el carrito */}
      <CheckboxCard
        checked={config.showInCart}
        onChange={v => updateConfig('showInCart', v)}
        title="Mostrar en el carrito"
        description="Se mostrará el widget al comienzo del carrito cuando el cliente lo abra."
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: ESTILOS
   ════════════════════════════════════════════════════════════ */

function EstilosTab({
  config,
  updateConfig,
}: {
  config: CountdownConfig;
  updateConfig: (key: keyof CountdownConfig, value: unknown) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Estilo del reloj */}
      <SectionCard
        icon={<Clock size={18} style={{ color: '#2563eb' }} />}
        title="Estilo del reloj"
        subtitle="Customizá la apariencia del contador."
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#111' }}>
            Estilo del reloj
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <StyleOption
              selected={config.clockStyle === 'classic'}
              onClick={() => updateConfig('clockStyle', 'classic')}
              icon={<Clock size={16} />}
              label="Clásico"
            />
            <StyleOption
              selected={config.clockStyle === 'retro-flip'}
              onClick={() => updateConfig('clockStyle', 'retro-flip')}
              icon={<Timer size={16} />}
              label="Retro flip"
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#111' }}>
            Alineación del contenido
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <StyleOption
              selected={config.alignment === 'split'}
              onClick={() => updateConfig('alignment', 'split')}
              icon={<SplitSquareHorizontal size={16} />}
              label="Izquierda / derecha"
            />
            <StyleOption
              selected={config.alignment === 'centered'}
              onClick={() => updateConfig('alignment', 'centered')}
              icon={<AlignCenter size={16} />}
              label="Siempre centrado"
            />
          </div>
        </div>

        <CheckboxCard
          checked={config.showLabels}
          onChange={v => updateConfig('showLabels', v)}
          title="Mostrar etiquetas del reloj"
          description="Muestra los textos DÍAS, HRS, MIN y SEG debajo de cada número."
          isBlue
        />
      </SectionCard>

      {/* Fondo del widget */}
      <SectionCard
        icon={<Layers size={18} style={{ color: '#2563eb' }} />}
        title="Fondo del widget"
        subtitle="Elegí el fondo principal del widget."
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#111' }}>
            Tipo de fondo
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="radio"
                checked={config.backgroundType === 'solid'}
                onChange={() => updateConfig('backgroundType', 'solid')}
                style={{ accentColor: '#2563eb' }}
              />
              <span style={{ fontSize: 14 }}>Color sólido</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="radio"
                checked={config.backgroundType === 'gradient'}
                onChange={() => updateConfig('backgroundType', 'gradient')}
                style={{ accentColor: '#2563eb' }}
              />
              <span style={{ fontSize: 14 }}>Degradé</span>
            </label>
          </div>
        </div>

        {config.backgroundType === 'solid' ? (
          <ColorField
            label="Color de fondo"
            value={config.backgroundColor}
            onChange={v => updateConfig('backgroundColor', v)}
          />
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <ColorField
              label="Desde"
              value={config.gradientFrom}
              onChange={v => updateConfig('gradientFrom', v)}
            />
            <ColorField
              label="Hasta"
              value={config.gradientTo}
              onChange={v => updateConfig('gradientTo', v)}
            />
          </div>
        )}
      </SectionCard>

      {/* Colores */}
      <SectionCard
        icon={<Palette size={18} style={{ color: '#2563eb' }} />}
        title="Colores"
        subtitle="Definí los colores de textos y fondos."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorField
            label="Fondo del subtítulo"
            value={config.subtitleBg}
            onChange={v => updateConfig('subtitleBg', v)}
          />
          <ColorField
            label="Color de fondo del reloj"
            value={config.clockBg}
            onChange={v => updateConfig('clockBg', v)}
          />
          <ColorField
            label="Color de fuente del título"
            value={config.titleColor}
            onChange={v => updateConfig('titleColor', v)}
          />
          <ColorField
            label="Color de fuente del subtítulo"
            value={config.subtitleColor}
            onChange={v => updateConfig('subtitleColor', v)}
          />
          <ColorField
            label="Color de números"
            value={config.numbersColor}
            onChange={v => updateConfig('numbersColor', v)}
          />
          <ColorField
            label="Color de etiquetas"
            value={config.labelsColor}
            onChange={v => updateConfig('labelsColor', v)}
          />
          <ColorField
            label="Color de separadores (:)"
            value={config.separatorColor}
            onChange={v => updateConfig('separatorColor', v)}
          />
        </div>
      </SectionCard>

      {/* Tipografía */}
      <SectionCard
        icon={<Type size={18} style={{ color: '#2563eb' }} />}
        title="Tipografía"
        subtitle="Ajustá los tamaños de letra."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SelectField
            label="Tamaño de fuente del título"
            value={config.titleFontSize}
            onChange={v => updateConfig('titleFontSize', v)}
            options={['12px', '14px', '16px', '18px', '20px', '24px']}
          />
          <SelectField
            label="Tamaño de números"
            value={config.numbersFontSize}
            onChange={v => updateConfig('numbersFontSize', v)}
            options={['18px', '20px', '24px', '28px', '32px', '36px']}
          />
          <SelectField
            label="Bordes del widget"
            value={config.borderRadius}
            onChange={v => updateConfig('borderRadius', v)}
            options={['0px', '6px', '8px', '12px', '16px', '24px']}
          />
          <SelectField
            label="Bordes de las cajas del reloj"
            value={config.clockBorderRadius}
            onChange={v => updateConfig('clockBorderRadius', v)}
            options={['0px', '4px', '6px', '8px', '12px']}
          />
        </div>
      </SectionCard>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   COMPONENTES AUXILIARES (UI helpers)
   ════════════════════════════════════════════════════════════ */

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>
      {children}
      {required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 13, color: '#9ca3af' }}>{children}</span>;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 15,
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  background: '#f9fafb',
  outline: 'none',
  color: '#111',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

function CheckboxCard({
  checked,
  onChange,
  title,
  description,
  isBlue,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  description: string;
  isBlue?: boolean;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        background: '#fff',
        border: checked && isBlue ? '2px solid #2563eb' : '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 18,
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            border: checked ? 'none' : '2px solid #d1d5db',
            background: checked ? '#2563eb' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
            transition: 'all 0.2s',
          }}
        >
          {checked && <Check size={14} style={{ color: '#fff' }} />}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#111', marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{description}</div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        {icon}
        <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{title}</div>
      </div>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>{subtitle}</div>
      {children}
    </div>
  );
}

function StyleOption({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '14px 16px',
        border: selected ? '2px solid #2563eb' : '1px solid #e5e7eb',
        borderRadius: 12,
        background: selected ? '#eff6ff' : '#fff',
        cursor: 'pointer',
        color: selected ? '#2563eb' : '#6b7280',
        fontWeight: selected ? 600 : 400,
        fontSize: 13,
        transition: 'all 0.2s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function ColorField({
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
      <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            position: 'relative',
            width: 44,
            height: 44,
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
              position: 'absolute',
              top: -6,
              left: -6,
              width: 56,
              height: 56,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            ...inputStyle,
            flex: 1,
          }}
        />
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
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 8 }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          ...inputStyle,
          cursor: 'pointer',
          appearance: 'auto',
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
