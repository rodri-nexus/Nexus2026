'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES
═══════════════════════════════════════════ */
interface WidgetDef {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExWidget {
  id: string | number;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
  target_category_id?: string | number | null;
}

interface ComparadorAntesDespuesEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface ComparadorAntesDespuesConfig {
  titulo: string;
  subtitulo: string;
  imagen_antes: string;
  imagen_despues: string;
  etiqueta_antes: string;
  etiqueta_despues: string;
  mostrar_etiquetas: boolean;
  posicion_inicial: number;
  aspect_ratio: string;
  borde_redondeado: number;
  padding_top: number;
  padding_bottom: number;
  color_deslizador: string;
  color_etiqueta_fondo: string;
  color_etiqueta_texto: string;
  ubicacion: string;
}

const defaultConfig: ComparadorAntesDespuesConfig = {
  titulo: 'Resultado Antes y Después',
  subtitulo: 'Desliza la barra para comparar la transformación',
  imagen_antes: 'https://images.unsplash.com/photo-1512290900676-26c2a48f341d?auto=format&fit=crop&w=800&q=80',
  imagen_despues: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  etiqueta_antes: 'ANTES',
  etiqueta_despues: 'DESPUÉS',
  mostrar_etiquetas: true,
  posicion_inicial: 50,
  aspect_ratio: '4/3',
  borde_redondeado: 12,
  padding_top: 16,
  padding_bottom: 16,
  color_deslizador: '#ffffff',
  color_etiqueta_fondo: 'rgba(0,0,0,0.6)',
  color_etiqueta_texto: '#ffffff',
  ubicacion: 'debajo_descripcion',
};

/* ═══════════════════════════════════════════
   SUBCOMPONENTES AUXILIARES
═══════════════════════════════════════════ */
function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
      <line x1="2" y1="7" x2="22" y2="7"/>
      <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
      <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#10B981', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
      {children}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, maxLength }: { value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 14,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 48, height: 26, borderRadius: 999,
        background: checked ? '#10B981' : '#e5e7eb',
        border: 'none', cursor: 'pointer', padding: 3,
        display: 'flex', alignItems: 'center',
        transition: 'background-color 0.2s', flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20, height: 20, borderRadius: '50%',
          background: '#ffffff',
          transform: checked ? 'translateX(22px)' : 'translateX(0px)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function CheckboxRow({ checked, onChange, label, helper }: { checked: boolean; onChange: (v: boolean) => void; label: string; helper?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: '#10B981', marginTop: 2, flexShrink: 0 }}
      />
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{label}</div>
        {helper && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 1.4 }}>{helper}</div>}
      </div>
    </label>
  );
}

function ColorPickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#ffffff';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div onClick={handleClick} style={{ width: 38, height: 38, borderRadius: 8, background: value, border: '1.5px solid #e5e7eb', cursor: 'pointer', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v.startsWith('#') ? v : '#' + v);
        }}
        style={{ flex: 1, minWidth: 0, padding: '9px 10px', fontSize: 13, border: '1.5px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#000', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
      />
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', fontSize: 14,
          border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fff', color: '#000',
          outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box', fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW EN TIEMPO REAL
═══════════════════════════════════════════ */
function ComparadorAntesDespuesPreview({ config }: { config: ComparadorAntesDespuesConfig }) {
  const [sliderPos, setSliderPos] = useState(config.posicion_inicial || 50);

  // Sync state when config changes
  React.useEffect(() => {
    setSliderPos(config.posicion_inicial || 50);
  }, [config.posicion_inicial]);

  const getAspectPadding = (ratio: string) => {
    if (ratio === '1/1') return '100%';
    if (ratio === '16/9') return '56.25%';
    return '75%'; // 4/3
  };

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN VIVO
      </div>

      <div style={{ paddingTop: config.padding_top, paddingBottom: config.padding_bottom }}>
        {config.titulo && (
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 4px', textAlign: 'center' }}>
            {config.titulo}
          </h3>
        )}
        {config.subtitulo && (
          <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px', textAlign: 'center' }}>
            {config.subtitulo}
          </p>
        )}

        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: getAspectPadding(config.aspect_ratio),
          borderRadius: config.borde_redondeado,
          overflow: 'hidden',
          userSelect: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {/* Imagen DESPUÉS (Fondo base) */}
          <img
            src={config.imagen_despues}
            alt="Después"
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', pointerEvents: 'none',
            }}
          />

          {/* Label DESPUÉS */}
          {config.mostrar_etiquetas && config.etiqueta_despues && (
            <span style={{
              position: 'absolute', top: 12, right: 12,
              background: config.color_etiqueta_fondo, color: config.color_etiqueta_texto,
              fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 6,
              letterSpacing: '0.05em', zIndex: 2, pointerEvents: 'none',
            }}>
              {config.etiqueta_despues}
            </span>
          )}

          {/* Imagen ANTES (Capa recortada) */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: `${sliderPos}%`, overflow: 'hidden', zIndex: 3,
          }}>
            <img
              src={config.imagen_antes}
              alt="Antes"
              style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: '100%', maxWidth: 'none', objectFit: 'cover',
                // Mantener el tamaño de la imagen idéntico al contenedor padre
              }}
            />
            {config.mostrar_etiquetas && config.etiqueta_antes && (
              <span style={{
                position: 'absolute', top: 12, left: 12,
                background: config.color_etiqueta_fondo, color: config.color_etiqueta_texto,
                fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 6,
                letterSpacing: '0.05em', pointerEvents: 'none', whiteSpace: 'nowrap',
              }}>
                {config.etiqueta_antes}
              </span>
            )}
          </div>

          {/* Línea divisora y Mango de arrastre */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${sliderPos}%`, width: 2,
            background: config.color_deslizador,
            transform: 'translateX(-50%)', zIndex: 4, pointerEvents: 'none',
            boxShadow: '0 0 8px rgba(0,0,0,0.4)',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 36, height: 36, borderRadius: '50%',
              background: config.color_deslizador,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#333', fontSize: 14, fontWeight: 'bold',
            }}>
              ↔
            </div>
          </div>

          {/* Input Range transparente overlay para simular interacción */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              opacity: 0, cursor: 'ew-resize', zIndex: 10, margin: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL DE EDITOR
═══════════════════════════════════════════ */
export default function ComparadorAntesDespuesEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: ComparadorAntesDespuesEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<ComparadorAntesDespuesConfig>(() => ({
    ...defaultConfig,
    ...(ew?.config || {}),
  }));

  const [isActive, setIsActive] = useState(ew?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const isEditing = !!ew;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update(key: keyof ComparadorAntesDespuesConfig, value: any) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSavedOK(false);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ew?.id ?? null,
          widget_slug: wd.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: targetType === 'product' ? productId : null,
          target_category_id: targetType === 'category' ? (categoryId ? String(categoryId) : null) : null,
          config: {
            ...config,
            ...(targetType === 'category' && categoryId ? { category_id: String(categoryId) } : {}),
          },
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);

      if (data.action === 'created') {
        const params = new URLSearchParams();
        params.set('created', wd.slug);
        if (targetType === 'product' && productId) params.set('product', String(productId));
        if (targetType === 'category' && categoryId) params.set('category', String(categoryId));
        router.push(`/widgets?${params.toString()}`);
      } else {
        router.push('/widgets');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  const tabGeneral = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel>Título de la sección</FieldLabel>
        <TextInput value={config.titulo} onChange={(v) => update('titulo', v)} placeholder="Ej: Resultado Antes y Después" />
      </div>

      <div>
        <FieldLabel>Subtítulo / Instrucción</FieldLabel>
        <TextInput value={config.subtitulo} onChange={(v) => update('subtitulo', v)} placeholder="Ej: Desliza la barra para ver el cambio" />
      </div>

      {/* Imagen ANTES */}
      <div style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 10 }}>📷 Imagen ANTES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <FieldLabel>URL de la imagen</FieldLabel>
            <TextInput value={config.imagen_antes} onChange={(v) => update('imagen_antes', v)} placeholder="https://..." />
          </div>
          <div>
            <FieldLabel>Etiqueta "Antes"</FieldLabel>
            <TextInput value={config.etiqueta_antes} onChange={(v) => update('etiqueta_antes', v)} placeholder="ANTES" maxLength={15} />
          </div>
        </div>
      </div>

      {/* Imagen DESPUÉS */}
      <div style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 10 }}>✨ Imagen DESPUÉS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <FieldLabel>URL de la imagen</FieldLabel>
            <TextInput value={config.imagen_despues} onChange={(v) => update('imagen_despues', v)} placeholder="https://..." />
          </div>
          <div>
            <FieldLabel>Etiqueta "Después"</FieldLabel>
            <TextInput value={config.etiqueta_despues} onChange={(v) => update('etiqueta_despues', v)} placeholder="DESPUÉS" maxLength={15} />
          </div>
        </div>
      </div>

      <CheckboxRow
        checked={config.mostrar_etiquetas}
        onChange={(v) => update('mostrar_etiquetas', v)}
        label="Mostrar etiquetas flotantes"
        helper="Superpone los textos 'Antes' y 'Después' en las esquinas superiores del comparador."
      />

      <div>
        <FieldLabel>Posición inicial de la barra ({config.posicion_inicial}%)</FieldLabel>
        <input
          type="range"
          min={10}
          max={90}
          value={config.posicion_inicial}
          onChange={(e) => update('posicion_inicial', Number(e.target.value))}
          style={{ width: '100%', accentColor: '#10B981' }}
        />
        <FieldHelper>Establece dónde estará ubicada la barra divisora al cargar la página.</FieldHelper>
      </div>
    </div>
  );

  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        Posición en la Ficha de Producto
      </div>

      {[
        { id: 'debajo_descripcion', name: 'Debajo de la Descripción', desc: 'Aparece inmediatamente después del texto descriptivo del producto.' },
        { id: 'debajo_boton_comprar', name: 'Debajo del Botón de Compra', desc: 'Muestra la comparación directa cerca del botón principal de pago.' },
        { id: 'encima_comentarios', name: 'Sección de Reseñas / Opiniones', desc: 'Muestra la comparación en la zona inferior junto a los testimonios.' },
      ].map((loc) => {
        const isSelected = config.ubicacion === loc.id;
        return (
          <div
            key={loc.id}
            onClick={() => update('ubicacion', loc.id)}
            style={{
              background: '#ffffff',
              border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
              borderRadius: 12, padding: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}
          >
            <input
              type="radio"
              name="ubicacion_comparador"
              checked={isSelected}
              onChange={() => update('ubicacion', loc.id)}
              style={{ marginTop: 3, accentColor: '#10B981' }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{loc.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{loc.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel>Proporción de la imagen (Aspect Ratio)</FieldLabel>
        <SelectField
          value={config.aspect_ratio}
          onChange={(v) => update('aspect_ratio', v)}
          options={[
            { value: '4/3', label: 'Estándar (4:3)' },
            { value: '1/1', label: 'Cuadrado (1:1)' },
            { value: '16/9', label: 'Panorámico (16:9)' },
          ]}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <FieldLabel>Color de la Barra Divisora</FieldLabel>
          <ColorPickerField value={config.color_deslizador} onChange={(v) => update('color_deslizador', v)} />
        </div>

        <div>
          <FieldLabel>Fondo de Etiquetas</FieldLabel>
          <TextInput value={config.color_etiqueta_fondo} onChange={(v) => update('color_etiqueta_fondo', v)} placeholder="rgba(0,0,0,0.6)" />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>⚙️ Dimensiones y Espaciados</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Redondeo de bordes: {config.borde_redondeado}px</FieldLabel>
            <input type="range" min={0} max={32} step={2} value={config.borde_redondeado} onChange={(e) => update('borde_redondeado', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Espaciado Superior: {config.padding_top}px</FieldLabel>
            <input type="range" min={0} max={60} step={4} value={config.padding_top} onChange={(e) => update('padding_top', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>

          <div>
            <FieldLabel>Espaciado Inferior: {config.padding_bottom}px</FieldLabel>
            <input type="range" min={0} max={60} step={4} value={config.padding_bottom} onChange={(e) => update('padding_bottom', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estilos', label: 'Estilos' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>
      {/* HEADER STICKY */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <NevuxLogo size="medium" />
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
        }}>
          RL
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>
        {/* SCOPE CHIP */}
        {isForAll ? (
          <div style={{
            background: '#10B981', color: '#fff', borderRadius: 999, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <IconStore />
            <span>Todos los productos</span>
          </div>
        ) : isCategory ? (
          <div style={{
            background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D',
            borderRadius: 999, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <span>🏷️ Widget para Categoría</span>
          </div>
        ) : (
          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#000',
          }}>
            <span style={{ fontSize: 18 }}>🛍️</span>
            <span>NEVUX Widget</span>
          </div>
        )}

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#000', margin: '0 0 20px', lineHeight: 1.2 }}>
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {wd.name} ({scopeLabel})
        </h1>

        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ marginBottom: 20 }}>
            <ComparadorAntesDespuesPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              El Comparador Antes y Después permite a tus clientes interactuar con un deslizador táctil para apreciar de primera mano la transformación o efectividad de tu producto.
            </span>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, overflowX: 'auto' }}>
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flexShrink: 0, padding: '12px 18px', background: 'none', border: 'none',
                    borderBottom: act ? '2px solid #10B981' : '2px solid transparent',
                    color: act ? '#10B981' : '#000', opacity: act ? 1 : 0.6,
                    fontSize: 14, fontWeight: act ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === 'general' ? tabGeneral : null}
            {activeTab === 'ubicacion' ? tabUbicacion : null}
            {activeTab === 'estilos' ? tabEstilos : null}
          </div>

          <div style={{
            marginTop: 32, paddingTop: 20, borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            <ToggleSwitch checked={isActive} onChange={setIsActive} />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: 999, border: 'none',
                background: '#10B981', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <CentroAyuda />
        </div>

        {error ? (
          <div style={{
            position: 'fixed', bottom: 20, left: 16, right: 16, maxWidth: 600, margin: '0 auto',
            background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, border: '1px solid #fecaca', zIndex: 40,
          }}>
            ⚠️ {error}
          </div>
        ) : null}
      </div>
    </div>
  );
    }
