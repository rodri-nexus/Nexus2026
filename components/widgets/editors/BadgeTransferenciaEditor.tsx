// components/widgets/editors/BadgeTransferenciaEditor.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BadgeTransferenciaPreview from './BadgeTransferenciaPreview';
import NevuxLogo from '@/app/components/landing/NevuxLogo';
import CentroAyuda from '@/app/dashboard/components/CentroAyuda';

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
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface BadgeTransferenciaEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

interface BadgeTransferenciaConfig {
  porcentajeDescuento: string;
  tipoMensaje: 'descuento' | 'precio';
  mensajeDescuento: string;
  mensajePrecio: string;
  mostrarIcono: boolean;
  textoBadge: string;
  efectoRebote: boolean;
  posicionBadge: 'esquina-superior-derecha' | 'final-texto';
  mostrarEnProducto: boolean;
  mostrarEnGrilla: boolean;
  colorFondo: string;
  colorTexto: string;
  fondoDegradado: boolean;
  fontSize: string;
  mostrarBorde: boolean;
  paddingInterno: number;
  bordesRedondeados: number;
  efecto: 'aureola' | 'zoom' | 'sin-efecto';
  colorFondoBadge: string;
  colorTextoBadge: string;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const defaultConfig: BadgeTransferenciaConfig = {
  porcentajeDescuento: '',
  tipoMensaje: 'descuento',
  mensajeDescuento: '{descuento}% de descuento pagando con transferencia',
  mensajePrecio: '{precio} pagando con transferencia',
  mostrarIcono: false,
  textoBadge: '',
  efectoRebote: false,
  posicionBadge: 'esquina-superior-derecha',
  mostrarEnProducto: true,
  mostrarEnGrilla: false,
  colorFondo: '#ededed',
  colorTexto: '#191919',
  fondoDegradado: false,
  fontSize: '13px',
  mostrarBorde: false,
  paddingInterno: 10,
  bordesRedondeados: 25,
  efecto: 'sin-efecto',
  colorFondoBadge: '#FF0000',
  colorTextoBadge: '#ffffff',
};

/* ═══════════════════════════════════════════
   ICONOS
═══════════════════════════════════════════ */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <line x1="2" y1="7" x2="22" y2="7"/>
    <path d="M22 7v3a2 2 0 0 1-4 0V7"/><path d="M18 10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9"/>
    <path d="M14 22v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/>
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconExternal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* ═══════════════════════════════════════════
   COMPONENTES REUTILIZABLES
═══════════════════════════════════════════ */
function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
      {children}
      {required && <span style={{ color: '#FF0000', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

function TextInput({
  value, onChange, placeholder, maxLength,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '12px 14px', fontSize: 15,
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        background: '#ffffff', color: '#000000', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#FF0000')}
      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
    />
  );
}

function CheckboxCard({
  checked, onChange, label, helper, children,
}: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; helper?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#ffffff', border: checked ? '1.5px solid #FF0000' : '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12, transition: 'border-color 0.2s',
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 22, height: 22, borderRadius: 5,
            background: checked ? '#FF0000' : '#ffffff',
            border: checked ? '2px solid #FF0000' : '2px solid #d1d5db',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
            marginTop: 1,
          }}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}

function RadioCard({
  checked, onChange, label, helper, children,
}: {
  checked: boolean; onChange: () => void;
  label: string; helper?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{
      background: checked ? '#fff5f5' : '#ffffff',
      border: checked ? '1.5px solid #FF0000' : '1.5px solid #e5e7eb',
      borderRadius: 12, padding: 16, marginBottom: 12, transition: 'border-color 0.2s',
    }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={onChange}
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: checked ? '7px solid #FF0000' : '2px solid #d1d5db',
            background: '#ffffff', flexShrink: 0, transition: 'all 0.2s',
            marginTop: 1,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', lineHeight: 1.35 }}>
            {label}
          </div>
          {helper && (
            <div style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, lineHeight: 1.5 }}>
              {helper}
            </div>
          )}
        </div>
      </label>
      {children && <div style={{ marginTop: 12, marginLeft: 32 }}>{children}</div>}
    </div>
  );
}

function ColorPickerField({
  value, onChange,
}: {
  value: string; onChange: (v: string) => void;
}) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value.startsWith('#') && value.length >= 7 ? value : '#000000';
    input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
    input.click();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
    }}>
      <div
        onClick={handleClick}
        style={{
          width: 40, height: 40, borderRadius: 8,
          background: value, border: '1.5px solid #e5e7eb',
          cursor: 'pointer', flexShrink: 0,
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v.startsWith('#') ? v : '#' + v);
        }}
        style={{
          flex: 1, minWidth: 0,
          padding: '10px 10px', fontSize: 13,
          border: '1.5px solid #e5e7eb', borderRadius: 8,
          background: '#ffffff', color: '#000000', outline: 'none',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleField({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 13,
          background: checked ? '#FF0000' : '#d1d5db',
          position: 'relative', transition: 'background 0.25s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: '#fff', transition: 'left 0.25s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>
        {label}
      </span>
    </label>
  );
}

function SelectField({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', fontSize: 15,
          border: '1.5px solid #e5e7eb', borderRadius: 10,
          background: '#ffffff', color: '#000000', outline: 'none',
          appearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function RangeSlider({
  value, min, max, onChange, ticks,
}: {
  value: number; min: number; max: number;
  onChange: (v: number) => void;
  ticks?: number[];
}) {
  return (
    <div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%', accentColor: '#FF0000', cursor: 'pointer',
        }}
      />
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#000000', opacity: 0.6, marginTop: 4 }}>
          {ticks.map((t, i) => <span key={i}>{t}px</span>)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BadgeTransferenciaEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: BadgeTransferenciaEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<BadgeTransferenciaConfig>(() => ({
    ...defaultConfig,
    ...(existingWidget?.config || {}),
  }));
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilos'>('general');

  const isEditing = !!existingWidget;
  const isForAll = targetType === 'all';
  const scopeLabel = isForAll ? 'General' : 'Producto';

  const update = <K extends keyof BadgeTransferenciaConfig>(key: K, value: BadgeTransferenciaConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSavedOK(false);
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
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);

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
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
      setSaving(false);
    }
  };

  /* ═══ TAB GENERAL ═══ */
  const tabGeneral = (
    <div>
      {/* % de descuento con transferencia */}
      <div style={{
        background: '#ffffff', border: '1.5px solid #e5e7eb',
        borderRadius: 12, padding: 16, marginBottom: 20,
      }}>
        <FieldLabel required>% de descuento con transferencia</FieldLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: '0 0 110px' }}>
            <input
              type="text"
              inputMode="numeric"
              value={config.porcentajeDescuento}
              onChange={(e) => update('porcentajeDescuento', e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="Ej: 10"
              style={{
                width: '100%', padding: '12px 14px', fontSize: 15,
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                background: '#ffffff', color: '#000000', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#FF0000')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <span style={{ fontSize: 15, color: '#000000', opacity: 0.6, fontWeight: 500 }}>%</span>
        </div>
        <FieldHelper>
          El mismo % que tenés configurado en los medios de pago de Tiendanube. Se aplica sobre el precio vigente del producto.
        </FieldHelper>
      </div>

      {/* Mensaje */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel required>Mensaje</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.tipoMensaje === 'descuento'}
            onChange={() => update('tipoMensaje', 'descuento')}
            label="% de descuento con transferencia"
            helper="Muestra el porcentaje de descuento al pagar con transferencia."
          >
            {config.tipoMensaje === 'descuento' && (
              <>
                <TextInput
                  value={config.mensajeDescuento}
                  onChange={(v) => update('mensajeDescuento', v)}
                  placeholder="{descuento}% de descuento pagando con transferencia"
                />
                <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
                  Usá <code style={{ background: '#fff5f5', color: '#FF0000', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{'{descuento}'}</code> para insertar el % en el texto.
                </p>
              </>
            )}
          </RadioCard>

          <RadioCard
            checked={config.tipoMensaje === 'precio'}
            onChange={() => update('tipoMensaje', 'precio')}
            label="Precio con transferencia ($X)"
            helper="Muestra el precio final ya descontado al pagar con transferencia."
          >
            {config.tipoMensaje === 'precio' && (
              <>
                <TextInput
                  value={config.mensajePrecio}
                  onChange={(v) => update('mensajePrecio', v)}
                  placeholder="{precio} pagando con transferencia"
                />
                <p style={{ fontSize: 13, color: '#000000', opacity: 0.6, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
                  Usá <code style={{ background: '#fff5f5', color: '#FF0000', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{'{precio}'}</code> para insertar el precio ya descontado.
                </p>
              </>
            )}
          </RadioCard>
        </div>
      </div>

      {/* Mostrar ícono de billete */}
      <CheckboxCard
        checked={config.mostrarIcono}
        onChange={(v) => update('mostrarIcono', v)}
        label="Mostrar ícono de billete"
        helper="Muestra un ícono de billete antes del texto del mensaje."
      />

      {/* Badge opcional */}
      <div style={{ marginBottom: 16, marginTop: 24 }}>
        <FieldLabel>Badge (opcional)</FieldLabel>
        <TextInput
          value={config.textoBadge}
          onChange={(v) => update('textoBadge', v)}
          placeholder="Ej: OFERTA"
          maxLength={15}
        />
        <FieldHelper>Dejá vacío para no mostrar badge (máximo 15 caracteres)</FieldHelper>
      </div>

      {/* Efecto rebote badge */}
      <CheckboxCard
        checked={config.efectoRebote}
        onChange={(v) => update('efectoRebote', v)}
        label="Efecto rebote en el badge"
        helper="Aplica una animación de zoom-rebote al badge para llamar la atención."
      />

      {/* Posición del badge */}
      <div style={{ marginTop: 24 }}>
        <FieldLabel>Posición del badge</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.posicionBadge === 'esquina-superior-derecha'}
            onChange={() => update('posicionBadge', 'esquina-superior-derecha')}
            label="Esquina superior derecha"
            helper="El badge flota en la esquina del etiqueta (por encima del borde)."
          />
          <RadioCard
            checked={config.posicionBadge === 'final-texto'}
            onChange={() => update('posicionBadge', 'final-texto')}
            label="Al final del texto"
            helper="El badge se muestra inline a la derecha, al final del mensaje."
          />
        </div>
      </div>
    </div>
  );

  /* ═══ TAB UBICACIÓN ═══ */
  const tabUbicacion = (
    <div>
      <CheckboxCard
        checked={config.mostrarEnProducto}
        onChange={(v) => update('mostrarEnProducto', v)}
        label="Mostrar en ficha de producto"
        helper="El badge aparece en la página de cada producto."
      >
        <a
          href="https://ayuda.tiendanube.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#FF0000', textDecoration: 'none',
            fontWeight: 600, marginTop: 4,
          }}
        >
          ¿Cómo ocultar el mensaje nativo de Tiendanube?
          <IconExternal />
        </a>
      </CheckboxCard>

      <CheckboxCard
        checked={config.mostrarEnGrilla}
        onChange={(v) => update('mostrarEnGrilla', v)}
        label="Mostrar en grilla de productos"
        helper="El badge aparece debajo del precio en home, categorías y grillas. Sin animación."
      />
    </div>
  );

  /* ═══ TAB ESTILOS ═══ */
  const tabEstilos = (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        <div>
          <FieldLabel>Color de fondo</FieldLabel>
          <ColorPickerField value={config.colorFondo} onChange={(v) => update('colorFondo', v)} />
        </div>
        <div>
          <FieldLabel>Color de texto</FieldLabel>
          <ColorPickerField value={config.colorTexto} onChange={(v) => update('colorTexto', v)} />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <ToggleField
          checked={config.fondoDegradado}
          onChange={(v) => update('fondoDegradado', v)}
          label="Fondo en degradado"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <FieldLabel>Tamaño de fuente</FieldLabel>
          <SelectField
            value={config.fontSize}
            onChange={(v) => update('fontSize', v)}
            options={[
              { value: '11px', label: '11px' },
              { value: '13px', label: '13px' },
              { value: '15px', label: '15px' },
              { value: '17px', label: '17px' },
            ]}
          />
        </div>
        <div>
          <FieldLabel>Borde</FieldLabel>
          <div style={{ marginTop: 4 }}>
            <ToggleField
              checked={config.mostrarBorde}
              onChange={(v) => update('mostrarBorde', v)}
              label="Mostrar borde (1px)"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div>
          <FieldLabel>Margen interno</FieldLabel>
          <div style={{ marginTop: 8 }}>
            <RangeSlider
              value={config.paddingInterno}
              min={0} max={30}
              onChange={(v) => update('paddingInterno', v)}
              ticks={[0, 10, 30]}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Bordes redondeados</FieldLabel>
          <div style={{ marginTop: 8 }}>
            <RangeSlider
              value={config.bordesRedondeados}
              min={0} max={25}
              onChange={(v) => update('bordesRedondeados', v)}
              ticks={[0, 25, 25]}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FieldLabel>Efecto</FieldLabel>
        <div style={{ marginTop: 12 }}>
          <RadioCard
            checked={config.efecto === 'aureola'}
            onChange={() => update('efecto', 'aureola')}
            label="Aureola pulsante"
            helper="Un halo se expande y difumina alrededor del elemento."
          />
          <RadioCard
            checked={config.efecto === 'zoom'}
            onChange={() => update('efecto', 'zoom')}
            label="Zoom"
            helper="El elemento se agranda y reduce suavemente."
          />
          <RadioCard
            checked={config.efecto === 'sin-efecto'}
            onChange={() => update('efecto', 'sin-efecto')}
            label="Sin efecto"
            helper="El mensaje se muestra estático, sin animación."
          />
        </div>
      </div>

      <div>
        <FieldLabel>Estilos del badge</FieldLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 8 }}>
              Color de fondo
            </div>
            <ColorPickerField value={config.colorFondoBadge} onChange={(v) => update('colorFondoBadge', v)} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#000000', marginBottom: 8 }}>
              Color de texto
            </div>
            <ColorPickerField value={config.colorTextoBadge} onChange={(v) => update('colorTextoBadge', v)} />
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

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* HEADER CON LOGO OFICIAL */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <NevuxLogo size="medium" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#000000', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#ffffff',
          }}>
            RL
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Scope chip */}
        {isForAll ? (
          <div style={{
            background: '#FF0000', color: '#ffffff',
            borderRadius: 999, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20, fontSize: 14, fontWeight: 700,
          }}>
            <IconStore />
            <span>Todos los productos</span>
          </div>
        ) : (
          <div style={{
            background: '#ffffff', border: '1px solid #e5e7eb',
            borderRadius: 10, padding: '8px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#000000',
          }}>
            <span style={{ fontSize: 18 }}>🛍</span>
            <span>NEVUX Widget</span>
          </div>
        )}

        {/* Título */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: '#000000',
          margin: '0 0 20px', lineHeight: 1.2,
        }}>
          {isEditing ? 'Editar widget: ' : 'Nuevo widget: '}
          {widgetDefinition.name} ({scopeLabel})
        </h1>

        {/* Contenedor principal */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          {/* Preview */}
          <div style={{ marginBottom: 20 }}>
            <BadgeTransferenciaPreview config={config} />
          </div>

          {/* Info box */}
          <div style={{
            background: '#fff5f5', border: '1px solid #fecaca',
            borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            marginBottom: 20,
          }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></div>
            <span style={{ fontSize: 14, color: '#000000', lineHeight: 1.5 }}>
              El widget crea su propio mensaje debajo del precio del producto.
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #e5e7eb',
            marginBottom: 24,
          }}>
            {tabs.map((tab) => {
              const act = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1, padding: '14px 12px', background: 'none',
                    border: 'none', borderBottom: act ? '2px solid #FF0000' : '2px solid transparent',
                    color: act ? '#FF0000' : '#000000',
                    opacity: act ? 1 : 0.6,
                    fontSize: 15, fontWeight: act ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Contenido del tab */}
          <div>
            {activeTab === 'general' && tabGeneral}
            {activeTab === 'ubicacion' && tabUbicacion}
            {activeTab === 'estilos' && tabEstilos}
          </div>

          {/* Footer del Editor */}
          <div style={{
            marginTop: 32, paddingTop: 20,
            borderTop: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            flexWrap: 'wrap',
          }}>
            <ToggleField
              checked={isActive}
              onChange={setIsActive}
              label="Widget activo"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: 999,
                border: 'none',
                background: savedOK ? '#10b981' : '#FF0000',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>

        {/* CENTRO DE AYUDA OFICIAL UNIFICADO */}
        <div style={{ marginTop: 40, width: '100%' }}>
          <CentroAyuda />
        </div>

        {/* Error Toast */}
        {error && (
          <div style={{
            position: 'fixed', bottom: 20, left: 16, right: 16,
            maxWidth: 600, margin: '0 auto',
            background: '#fee2e2', color: '#991b1b',
            padding: '12px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 600,
            border: '1px solid #fecaca', zIndex: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
       }
