'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Eye,
  Gift,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  ColorPicker,
  FieldInput,
} from './EditorFields';
import EditorTabs from './EditorTabs';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   OPCIONES FIJAS DE PREMIOS
═══════════════════════════════════════════ */
const OPCIONES_PREMIOS = [
  { label: '5% OFF', value: '5% OFF', esGanador: true },
  { label: '10% OFF', value: '10% OFF', esGanador: true },
  { label: '15% OFF', value: '15% OFF', esGanador: true },
  { label: '20% OFF', value: '20% OFF', esGanador: true },
  { label: 'Sigue Intentando 😢', value: 'Sigue Intentando 😢', esGanador: false },
];

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface WidgetDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExistingWidget {
  id: string;
  config: Record<string, unknown>;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface Props {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string | number;
}

export interface PremioItem {
  texto: string;         // '5% OFF' | '10% OFF' | '15% OFF' | '20% OFF' | 'Sigue Intentando 😢'
  codigoCupon: string;   // Ej: "SUERTE10"
  esGanador: boolean;    // true para descuentos, false para "Sigue Intentando"
}

interface RuletaDescuentosConfig {
  titulo: string;
  subtitulo: string;
  textoBotonGirar: string;
  colorBoton: string;
  colorFondoModal: string;
  colorTexto: string;
  colorRuletaPrincipal: string;
  colorRuletaSecundario: string;
  premios: PremioItem[];
}

/* ═══════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════ */
const DEFAULT_CONFIG: RuletaDescuentosConfig = {
  titulo: '🎉 ¡GIRÁ Y GANÁ UN DESCUENTO!',
  subtitulo: 'Ingresá tu email para girar la ruleta y obtener tu regalo exclusivo.',
  textoBotonGirar: '¡GIRAR RULETA AHORA! 🎡',
  colorBoton: '#10B981',
  colorFondoModal: '#ffffff',
  colorTexto: '#111827',
  colorRuletaPrincipal: '#10B981',
  colorRuletaSecundario: '#111827',
  premios: [
    { texto: '10% OFF', codigoCupon: 'SUERTE10', esGanador: true },
    { texto: '5% OFF', codigoCupon: 'SUERTE5', esGanador: true },
    { texto: '15% OFF', codigoCupon: 'SUPER15', esGanador: true },
    { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
    { texto: '20% OFF', codigoCupon: 'MEGA20', esGanador: true },
    { texto: '10% OFF', codigoCupon: 'PROMO10', esGanador: true },
  ],
};

/* ═══════════════════════════════════════════
   SECTION CARD
═══════════════════════════════════════════ */
function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: '#000000', opacity: 0.6, lineHeight: 1.4 }}>
            {description}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN VIVO DE LA RULETA
═══════════════════════════════════════════ */
function RuletaPreview({ config }: { config: RuletaDescuentosConfig }) {
  return (
    <div
      style={{
        background: config.colorFondoModal,
        border: '1.5px solid #e5e7eb',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        maxWidth: 380,
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Título y Subtítulo */}
      <div style={{ fontSize: 16, fontWeight: 900, color: config.colorTexto, marginBottom: 4 }}>
        {config.titulo}
      </div>
      <div style={{ fontSize: 11.5, color: '#6b7280', marginBottom: 16, lineHeight: 1.3 }}>
        {config.subtitulo}
      </div>

      {/* Rueda de la Ruleta (SVG Interactivo) */}
      <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 16px' }}>
        {/* Flecha indicadora superior */}
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            fontSize: 20,
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        >
          🔻
        </div>

        {/* Disco de la Ruleta */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px solid #111827',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
            background: `conic-gradient(
              ${config.premios.map((_, i) => {
                const step = 360 / config.premios.length;
                const color = i % 2 === 0 ? config.colorRuletaPrincipal : config.colorRuletaSecundario;
                return `${color} ${i * step}deg ${(i + 1) * step}deg`;
              }).join(', ')}
            )`,
          }}
        >
          {/* Textos de las porciones */}
          {config.premios.map((premio, i) => {
            const angle = (360 / config.premios.length) * i + (360 / config.premios.length) / 2;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '50%',
                  height: 20,
                  marginTop: -10,
                  transformOrigin: '0% 50%',
                  transform: `rotate(${angle - 90}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8.5,
                  fontWeight: 900,
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap',
                  paddingLeft: 25,
                }}
              >
                {premio.texto}
              </div>
            );
          })}
        </div>

        {/* Centro de la Ruleta */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#ffffff',
            border: '3px solid #111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          🎁
        </div>
      </div>

      {/* Input de Email simulado */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="email"
          disabled
          placeholder="tu-email@ejemplo.com"
          style={{
            width: '100%',
            padding: '9px 12px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 12,
            textAlign: 'center',
            boxSizing: 'border-box',
            background: '#f9fafb',
          }}
        />
      </div>

      {/* Botón de Girar */}
      <div
        style={{
          background: config.colorBoton,
          color: '#ffffff',
          fontWeight: 800,
          fontSize: 13,
          padding: '11px',
          borderRadius: 999,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        }}
      >
        {config.textoBotonGirar}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EDITOR PRINCIPAL
═══════════════════════════════════════════ */
export default function RuletaDescuentosEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: Props) {
  const router = useRouter();

  const [config, setConfig] = useState<RuletaDescuentosConfig>(() => {
    if (existingWidget?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...(existingWidget.config as Partial<RuletaDescuentosConfig>),
      };
    }
    return DEFAULT_CONFIG;
  });

  const [isActive, setIsActive] = useState<boolean>(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCfg = <K extends keyof RuletaDescuentosConfig>(
    key: K,
    val: RuletaDescuentosConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleSelectPremio = (index: number, selectedValue: string) => {
    const isWinner = selectedValue !== 'Sigue Intentando 😢';
    const newPremios = [...config.premios];
    newPremios[index] = {
      ...newPremios[index],
      texto: selectedValue,
      esGanador: isWinner,
      codigoCupon: isWinner ? (newPremios[index].codigoCupon || 'DESCUENTO') : '',
    };
    setConfig((prev) => ({ ...prev, premios: newPremios }));
  };

  const updateCodigoCupon = (index: number, value: string) => {
    const newPremios = [...config.premios];
    newPremios[index] = { ...newPremios[index], codigoCupon: value };
    setConfig((prev) => ({ ...prev, premios: newPremios }));
  };

  const addPremio = () => {
    if (config.premios.length >= 8) return;
    setConfig((prev) => ({
      ...prev,
      premios: [
        ...prev.premios,
        { texto: '10% OFF', codigoCupon: 'PROMO10', esGanador: true },
      ],
    }));
  };

  const removePremio = (index: number) => {
    if (config.premios.length <= 4) return; // Mínimo 4 premios para formar la rueda
    setConfig((prev) => ({
      ...prev,
      premios: prev.premios.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

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
        throw new Error(
          (data as { error?: string })?.error || 'Error al guardar el widget'
        );
      }

      if ((data as { action?: string }).action === 'created') {
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error inesperado al guardar';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ─── TAB GENERAL ─── */
  const tabGeneral = (
    <div>
      <FieldInput
        label="Título del Popup"
        value={config.titulo}
        placeholder="🎉 ¡GIRÁ Y GANÁ UN DESCUENTO!"
        onChange={(v) => updateCfg('titulo', v)}
      />

      <FieldInput
        label="Subtítulo / Instrucciones"
        value={config.subtitulo}
        placeholder="Ingresá tu email para girar la ruleta..."
        onChange={(v) => updateCfg('subtitulo', v)}
      />

      <FieldInput
        label="Texto del Botón"
        value={config.textoBotonGirar}
        placeholder="¡GIRAR RULETA AHORA! 🎡"
        onChange={(v) => updateCfg('textoBotonGirar', v)}
      />

      {/* EXPLICACIÓN DEL BLINDAJE ANTI-SATURACIÓN */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: 14,
          padding: '16px',
          margin: '16px 0 22px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ShieldCheck size={20} color="#15803d" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
            Protección inteligente Anti-Saturación
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#15803d', lineHeight: 1.55 }}>
          La ruleta aparecerá como popup automático apenas el cliente entra a tu tienda. Si el cliente la gira o la cierra, <b>no se le volverá a mostrar nunca más</b> para no molestarlo durante su compra.
        </div>
      </div>

      {/* CONFIGURACIÓN DE PORCIONES Y PREMIOS */}
      <div style={{ marginTop: 10 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#000000',
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Premios de la Ruleta ({config.premios.length}/8)</span>
          {config.premios.length < 8 && (
            <button
              type="button"
              onClick={addPremio}
              style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Plus size={14} />
              Agregar porción
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {config.premios.map((item, idx) => {
            const esOpcionConocida = OPCIONES_PREMIOS.some((op) => op.value === item.texto);

            return (
              <div
                key={idx}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#000000' }}>
                      Porción #{idx + 1}
                    </span>
                    <span
                      style={{
                        background: item.esGanador ? '#ecfdf5' : '#f3f4f6',
                        color: item.esGanador ? '#059669' : '#6b7280',
                        border: `1px solid ${item.esGanador ? '#a7f3d0' : '#e5e7eb'}`,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}
                    >
                      {item.esGanador ? '🎁 Otorga Premio' : '😢 Sin Premio'}
                    </span>
                  </div>

                  {config.premios.length > 4 && (
                    <button
                      type="button"
                      onClick={() => removePremio(idx)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 2 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                      Seleccionar Premio:
                    </label>
                    <select
                      value={item.texto}
                      onChange={(e) => handleSelectPremio(idx, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        fontSize: 13,
                        fontWeight: 700,
                        background: '#ffffff',
                        color: '#111827',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                      }}
                    >
                      {OPCIONES_PREMIOS.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                      {/* Compatibilidad si tenía un valor anterior personalizado */}
                      {!esOpcionConocida && (
                        <option value={item.texto}>
                          {item.texto} (Anterior)
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                      Código de Cupón en Tiendanube:
                    </label>
                    <input
                      type="text"
                      value={item.codigoCupon}
                      disabled={!item.esGanador}
                      onChange={(e) => updateCodigoCupon(idx, e.target.value)}
                      placeholder={item.esGanador ? 'Ej: DESCUENTO10' : 'No aplica (sin premio)'}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                        fontSize: 13,
                        background: item.esGanador ? '#ffffff' : '#f3f4f6',
                        color: item.esGanador ? '#111827' : '#9ca3af',
                        boxSizing: 'border-box',
                        fontWeight: item.esGanador ? 600 : 400,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div>
      <SectionCard
        icon="🎨"
        title="Colores de la Ruleta y Modal"
        description="Personalizá los tonos para que combine perfecto con tu marca."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ColorPicker
            label="Fondo del modal"
            value={config.colorFondoModal}
            onChange={(v) => updateCfg('colorFondoModal', v)}
          />
          <ColorPicker
            label="Color principal del botón"
            value={config.colorBoton}
            onChange={(v) => updateCfg('colorBoton', v)}
          />
          <ColorPicker
            label="Color de porciones (Alterno 1)"
            value={config.colorRuletaPrincipal}
            onChange={(v) => updateCfg('colorRuletaPrincipal', v)}
          />
          <ColorPicker
            label="Color de porciones (Alterno 2)"
            value={config.colorRuletaSecundario}
            onChange={(v) => updateCfg('colorRuletaSecundario', v)}
          />
        </div>
      </SectionCard>
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
          NX
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
        {/* Chip de alcance */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: targetType === 'all' ? '#10B981' : '#ffffff',
            color: targetType === 'all' ? '#ffffff' : '#000000',
            border: targetType === 'all' ? 'none' : '1px solid #e5e7eb',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {targetType === 'all' ? 'Todos los productos / Inicio' : '🛍️ Producto específico'}
        </div>

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
          {widgetDefinition.name}
        </h1>

        {/* PREVIEW */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#10B981',
              marginBottom: 12,
            }}
          >
            <Eye size={14} />
            <span>Vista previa del Modal Interactivo</span>
          </div>
          <RuletaPreview config={config} />
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <EditorTabs
            tabs={[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'estilos', label: 'Estilos', icon: '🎨' },
            ]}
          >
            {[tabGeneral, tabEstilos]}
          </EditorTabs>

          {/* GUARDAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #f1f3f5',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? '#10B981' : '#e5e7eb',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background 0.25s ease',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: isActive ? 24 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#ffffff',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                Widget activo
              </span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px',
                background: saving ? '#e5e7eb' : '#10B981',
                color: saving ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.background = '#10B981';
              }}
            >
              {saving ? 'Guardando...' : existingWidget ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
  }
