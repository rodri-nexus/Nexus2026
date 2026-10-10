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

interface TablaTallesEditorProps {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: 'product' | 'all' | 'category';
  productId: number | null;
  categoryId?: string | number | null;
  storeId: string | number;
}

export interface TablaTallesConfig {
  texto_boton: string;
  titulo_header: string;
  mostrar_icono_regla: boolean;
  mostrar_imagen: boolean;
  mostrar_tabla: boolean;
  mostrar_texto: boolean;
  orden_contenido: string;
  imagen_url: string;
  texto_info: string;
  filas: number;
  columnas: number;
  celdas: string[][];
  ubicacion: string;
  tipo_fondo: string;
  color_fondo: string;
  color_fondo_2: string;
  color_texto_boton: string;
  color_texto_header: string;
  tamano_texto: number;
  borde_boton: number;
  padding_boton: number;
  margin_top: number;
  margin_bottom: number;
  mostrar_selector_talles: boolean;
}

const defaultData: Record<string, string[]> = {
  'XS': ['82-86', '62-66', '86-90'],
  'S':  ['86-90', '66-70', '90-94'],
  'M':  ['90-94', '70-74', '94-98'],
  'L':  ['94-100', '74-80', '98-104'],
  'XL': ['100-106', '80-86', '104-110'],
  'XXL': ['106-112', '86-92', '110-116'],
  '3XL': ['112-118', '92-98', '116-122'],
  '4XL': ['118-124', '98-104', '122-128'],
};

function createEmptyGrid(rows: number, cols: number): string[][] {
  var grid: string[][] = [];
  var labels = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
  var headers = ['Talle', 'Pecho (cm)', 'Cintura (cm)', 'Cadera (cm)', 'Medida 4', 'Medida 5', 'Medida 6', 'Medida 7'];

  for (var r = 0; r < rows; r++) {
    var row: string[] = [];
    for (var c = 0; c < cols; c++) {
      if (r === 0) {
        row.push(headers[c] || ('Medida ' + c));
      } else {
        if (c === 0) {
          row.push(labels[r - 1] || ('Talle ' + r));
        } else {
          var label = labels[r - 1] || '';
          var dataVals = defaultData[label];
          if (dataVals && dataVals[c - 1] !== undefined) {
            row.push(dataVals[c - 1]);
          } else {
            row.push('80-90');
          }
        }
      }
    }
    grid.push(row);
  }
  return grid;
}

const defaultConfig: TablaTallesConfig = {
  texto_boton: 'Tabla de talles',
  titulo_header: 'Guía de talles',
  mostrar_icono_regla: false,
  mostrar_imagen: false,
  mostrar_tabla: true,
  mostrar_texto: false,
  orden_contenido: 'imagen_tabla_texto',
  imagen_url: '',
  texto_info: '',
  filas: 6,
  columnas: 4,
  celdas: createEmptyGrid(6, 4),
  ubicacion: 'despues_precio',
  tipo_fondo: 'solido',
  color_fondo: '#111827',
  color_fondo_2: '#374151',
  color_texto_boton: '#ffffff',
  color_texto_header: '#111827',
  tamano_texto: 14,
  borde_boton: 25,
  padding_boton: 12,
  margin_top: 10,
  margin_bottom: 15,
  mostrar_selector_talles: true,
};

/* ═══════════════════════════════════════════
   SUBCOMPONENTES AUXILIARES
═══════════════════════════════════════════ */
function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <path d="M22 7v3a2 2 0 0 1-4 0V7" /><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9" />
      <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
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
function TablaTallesPreview({ config }: { config: TablaTallesConfig }) {
  const bg = config.tipo_fondo === 'degrade'
    ? 'linear-gradient(135deg, ' + config.color_fondo + ', ' + config.color_fondo_2 + ')'
    : config.color_fondo;

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 16,
      padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        VISTA PREVIA EN VIVO
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0' }}>
        <button
          type="button"
          style={{
            background: bg,
            color: config.color_texto_boton,
            border: 'none',
            borderRadius: config.borde_boton,
            padding: config.padding_boton + 'px ' + (config.padding_boton + 12) + 'px',
            fontSize: config.tamano_texto,
            fontWeight: 700,
            cursor: 'default',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {config.mostrar_icono_regla ? <span style={{ fontSize: config.tamano_texto + 2 }}>📏</span> : null}
          {config.texto_boton || 'Tabla de talles'}
        </button>

        {config.mostrar_selector_talles ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', width: '100%', marginTop: 4 }}>
            {['XS', 'S', 'M', 'L', 'XL'].map((talle, idx) => (
              <span
                key={talle}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: idx === 2 ? '2px solid ' + config.color_fondo : '1.5px solid #e5e7eb',
                  background: idx === 2 ? config.color_fondo : '#ffffff',
                  color: idx === 2 ? config.color_texto_boton : '#4b5563',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'default'
                }}
              >
                {talle}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL DE EDITOR
═══════════════════════════════════════════ */
export default function TablaTallesEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  categoryId,
  storeId,
}: TablaTallesEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<TablaTallesConfig>(() => {
    const base = { ...defaultConfig, ...(ew?.config || {}) };
    if (!base.celdas || !Array.isArray(base.celdas) || base.celdas.length === 0) {
      base.celdas = createEmptyGrid(base.filas || 6, base.columnas || 4);
    }
    if (base.mostrar_selector_talles === undefined) {
      base.mostrar_selector_talles = true;
    }
    return base;
  });

  const [isActive, setIsActive] = useState(ew?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const isEditing = !!ew;
  const isForAll = targetType === 'all';
  const isCategory = targetType === 'category';
  const scopeLabel = isForAll ? 'General' : isCategory ? 'Categoría' : 'Producto';

  function update(key: keyof TablaTallesConfig, value: any) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function resizeGrid(newRows: number, newCols: number) {
    setConfig((prev) => {
      const old = prev.celdas || [];
      const next: string[][] = [];
      var labels = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
      var headers = ['Talle', 'Pecho (cm)', 'Cintura (cm)', 'Cadera (cm)', 'Medida 4', 'Medida 5', 'Medida 6', 'Medida 7'];

      for (var r = 0; r < newRows; r++) {
        const row: string[] = [];
        for (var c = 0; c < newCols; c++) {
          if (old[r] && old[r][c] !== undefined) {
            row.push(old[r][c]);
          } else if (r === 0) {
            row.push(headers[c] || ('Medida ' + c));
          } else if (c === 0) {
            row.push(labels[r - 1] || ('Talle ' + r));
          } else {
            var label = labels[r - 1] || '';
            var dataVals = defaultData[label];
            if (dataVals && dataVals[c - 1] !== undefined) {
              row.push(dataVals[c - 1]);
            } else {
              row.push('80-90');
            }
          }
        }
        next.push(row);
      }
      return { ...prev, filas: newRows, columnas: newCols, celdas: next };
    });
  }

  function updateCell(rowIdx: number, colIdx: number, val: string) {
    setConfig((prev) => {
      const next = prev.celdas.map((row, r) => {
        if (r !== rowIdx) return row;
        return row.map((cell, c) => (c === colIdx ? val : cell));
      });
      return { ...prev, celdas: next };
    });
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

  /* ─── TAB GENERAL ─── */
  const tabGeneral = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FieldLabel>Texto del botón</FieldLabel>
        <TextInput
          value={config.texto_boton}
          onChange={(v) => update('texto_boton', v)}
          placeholder="Tabla de talles"
        />
      </div>

      <div>
        <FieldLabel>Título del header</FieldLabel>
        <TextInput
          value={config.titulo_header}
          onChange={(v) => update('titulo_header', v)}
          placeholder="Guía de talles"
        />
        <FieldHelper>Se muestra como título en la parte superior del modal.</FieldHelper>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '12px 14px',
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Mostrar ícono de regla en el botón</span>
        <ToggleSwitch checked={config.mostrar_icono_regla} onChange={(v) => update('mostrar_icono_regla', v)} />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '12px 14px',
      }}>
        <div>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#111827' }}>Mostrar selector de talles clickeables</span>
          <span style={{ display: 'block', fontSize: 12, color: '#6b7280', marginTop: 2 }}>Permite al cliente elegir talle directamente debajo del botón.</span>
        </div>
        <ToggleSwitch checked={config.mostrar_selector_talles} onChange={(v) => update('mostrar_selector_talles', v)} />
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>Contenido a mostrar en el Modal</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'mostrar_imagen' as const, label: 'Mostrar imagen' },
            { key: 'mostrar_tabla' as const, label: 'Mostrar tabla' },
            { key: 'mostrar_texto' as const, label: 'Mostrar texto' },
          ].map((opt) => (
            <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#111827' }}>
              <input
                type="checkbox"
                checked={!!config[opt.key]}
                onChange={(e) => update(opt.key, e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#10B981', cursor: 'pointer' }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Orden del contenido</FieldLabel>
        <SelectField
          value={config.orden_contenido}
          onChange={(v) => update('orden_contenido', v)}
          options={[
            { value: 'imagen_tabla_texto', label: 'Imagen → Tabla → Texto' },
            { value: 'tabla_imagen_texto', label: 'Tabla → Imagen → Texto' },
            { value: 'texto_tabla_imagen', label: 'Texto → Tabla → Imagen' },
            { value: 'imagen_texto_tabla', label: 'Imagen → Texto → Tabla' },
            { value: 'tabla_texto_imagen', label: 'Tabla → Texto → Imagen' },
            { value: 'texto_imagen_tabla', label: 'Texto → Imagen → Tabla' },
          ]}
        />
        <FieldHelper>Define en qué orden se muestran la imagen, la tabla y el texto dentro del modal.</FieldHelper>
      </div>

      {config.mostrar_imagen ? (
        <div>
          <FieldLabel>URL de la imagen</FieldLabel>
          <TextInput
            value={config.imagen_url}
            onChange={(v) => update('imagen_url', v)}
            placeholder="https://..."
          />
          <FieldHelper>Pegá la URL de la imagen de guía de talles (opcional).</FieldHelper>
        </div>
      ) : null}

      {config.mostrar_texto ? (
        <div>
          <FieldLabel>Texto informativo</FieldLabel>
          <textarea
            value={config.texto_info}
            onChange={(e) => update('texto_info', e.target.value)}
            placeholder="Ej: Las medidas están expresadas en centímetros..."
            rows={3}
            style={{
              width: '100%', padding: '12px 14px', fontSize: 14,
              border: '1.5px solid #e5e7eb', borderRadius: 10,
              background: '#ffffff', color: '#000000', outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical',
            }}
          />
        </div>
      ) : null}

      {config.mostrar_tabla ? (
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>Tabla de talles</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <FieldLabel>Filas</FieldLabel>
              <input
                type="number"
                min={2}
                max={15}
                value={config.filas}
                onChange={(e) => {
                  const n = Math.max(2, Math.min(15, parseInt(e.target.value, 10) || 2));
                  resizeGrid(n, config.columnas);
                }}
                style={{
                  width: '100%', padding: '12px 14px', fontSize: 14,
                  border: '1.5px solid #e5e7eb', borderRadius: 10,
                  background: '#fff', color: '#000', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>
            <div>
              <FieldLabel>Columnas</FieldLabel>
              <input
                type="number"
                min={2}
                max={8}
                value={config.columnas}
                onChange={(e) => {
                  const n = Math.max(2, Math.min(8, parseInt(e.target.value, 10) || 2));
                  resizeGrid(config.filas, n);
                }}
                style={{
                  width: '100%', padding: '12px 14px', fontSize: 14,
                  border: '1.5px solid #e5e7eb', borderRadius: 10,
                  background: '#fff', color: '#000', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto', border: '1.5px solid #e5e7eb', borderRadius: 12, background: '#f9fafb' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: config.columnas * 80 }}>
              <tbody>
                {config.celdas.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ border: '1px solid #e5e7eb', padding: 4 }}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                          style={{
                            width: '100%', padding: '8px 6px', fontSize: 13,
                            border: 'none', background: rIdx === 0 || cIdx === 0 ? '#f3f4f6' : '#fff',
                            color: '#111827', outline: 'none', textAlign: 'center',
                            fontWeight: rIdx === 0 || cIdx === 0 ? 700 : 500,
                            boxSizing: 'border-box', fontFamily: 'inherit', borderRadius: 6,
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FieldHelper>Editá cada celda. La primera fila y columna se resaltan como encabezados.</FieldHelper>
        </div>
      ) : null}
    </div>
  );

  /* ─── TAB UBICACIÓN ─── */
  const tabUbicacion = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        Elegí dónde se mostrará el botón del widget en la página del producto.
      </div>

      {[
        {
          id: 'despues_precio',
          name: 'Después del precio del producto',
          desc: 'El botón se muestra dentro de la ficha del producto, justo debajo del precio.',
        },
        {
          id: 'despues_info_pago',
          name: 'Después de la información de pago',
          desc: 'El botón se muestra dentro de la ficha del producto, justo debajo de la información de cuotas y medios de pago.',
        },
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
              name="ubicacion_tabla_talles"
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

  /* ─── TAB ESTILOS ─── */
  const tabEstilos = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>🎨 Colores principales</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Personalizá el fondo y los colores de texto del botón y el header.</div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Tipo de fondo</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => update('tipo_fondo', 'solido')}
              style={{
                padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.tipo_fondo === 'solido' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.tipo_fondo === 'solido' ? '#111827' : '#fff',
                color: config.tipo_fondo === 'solido' ? '#fff' : '#111827',
              }}
            >
              Sólido
            </button>
            <button
              type="button"
              onClick={() => update('tipo_fondo', 'degrade')}
              style={{
                padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: config.tipo_fondo === 'degrade' ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                background: config.tipo_fondo === 'degrade' ? '#ecfdf5' : '#fff',
                color: '#111827',
              }}
            >
              Degradé
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de fondo</FieldLabel>
            <ColorPickerField value={config.color_fondo} onChange={(v) => update('color_fondo', v)} />
          </div>
          {config.tipo_fondo === 'degrade' ? (
            <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
              <FieldLabel>Color de fondo 2 (degradé)</FieldLabel>
              <ColorPickerField value={config.color_fondo_2} onChange={(v) => update('color_fondo_2', v)} />
            </div>
          ) : null}
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de texto botón</FieldLabel>
            <ColorPickerField value={config.color_texto_boton} onChange={(v) => update('color_texto_boton', v)} />
          </div>
          <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
            <FieldLabel>Color de texto header</FieldLabel>
            <ColorPickerField value={config.color_texto_header} onChange={(v) => update('color_texto_header', v)} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>🔤 Tipografías</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Ajustá el tamaño de texto del botón.</div>
        <div>
          <FieldLabel>Tamaño de texto: {config.tamano_texto}px</FieldLabel>
          <SelectField
            value={String(config.tamano_texto)}
            onChange={(v) => update('tamano_texto', parseInt(v, 10))}
            options={[
              { value: '12', label: '12 px' },
              { value: '13', label: '13 px' },
              { value: '14', label: '14 px' },
              { value: '15', label: '15 px' },
              { value: '16', label: '16 px' },
              { value: '18', label: '18 px' },
            ]}
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 4 }}>⚙️ Comportamiento y diseño</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Borde, padding y márgenes del botón.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Borde del botón: {config.borde_boton}px</FieldLabel>
            <input type="range" min={0} max={40} value={config.borde_boton} onChange={(e) => update('borde_boton', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Padding del botón: {config.padding_boton}px</FieldLabel>
            <input type="range" min={4} max={30} value={config.padding_boton} onChange={(e) => update('padding_boton', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Margen superior externo: {config.margin_top}px</FieldLabel>
            <input type="range" min={0} max={60} value={config.margin_top} onChange={(e) => update('margin_top', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <FieldLabel>Margen inferior externo: {config.margin_bottom}px</FieldLabel>
            <input type="range" min={0} max={60} value={config.margin_bottom} onChange={(e) => update('margin_bottom', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
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
            <TablaTallesPreview config={config} />
          </div>

          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>
              Este widget aparecerá antes del botón de agregar al carrito. Al hacer clic se abre un modal con la guía de talles.
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ToggleSwitch checked={isActive} onChange={setIsActive} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Widget activo</span>
            </div>
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
