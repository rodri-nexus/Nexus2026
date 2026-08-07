'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BadgeEnvioPreview from './BadgeEnvioPreview';

interface BadgeEnvioEditorProps {
  widgetId?: string;
  targetType: 'product' | 'all';
  targetProductId?: string | null;
  productName?: string | null;
  productImage?: string | null;
  initialConfig?: any;
  initialActive?: boolean;
  storeId: string;
}

interface BadgeEnvioConfig {
  shippingMode: 'always' | 'from-amount';
  showIcon: boolean;
  badgeText: string;
  badgeBounce: boolean;
  badgePosition: 'top-right' | 'inline-end';
  showOnProduct: boolean;
  showOnGrid: boolean;
  bgColor: string;
  textColor: string;
  gradient: boolean;
  gradientColor: string;
  fontSize: number;
  showBorder: boolean;
  padding: number;
  borderRadius: number;
  effect: 'halo' | 'zoom' | 'none';
  badgeBgColor: string;
  badgeTextColor: string;
}

const DEFAULT_CONFIG: BadgeEnvioConfig = {
  shippingMode: 'always',
  showIcon: true,
  badgeText: '',
  badgeBounce: false,
  badgePosition: 'top-right',
  showOnProduct: true,
  showOnGrid: false,
  bgColor: '#ededed',
  textColor: '#000000',
  gradient: false,
  gradientColor: '#d4d4d4',
  fontSize: 13,
  showBorder: false,
  padding: 10,
  borderRadius: 25,
  effect: 'none',
  badgeBgColor: '#ff0000',
  badgeTextColor: '#ffffff',
};

export default function BadgeEnvioEditor({
  widgetId,
  targetType,
  targetProductId,
  productName,
  productImage,
  initialConfig,
  initialActive = true,
  storeId,
}: BadgeEnvioEditorProps) {
  const router = useRouter();
  const [config, setConfig] = useState<BadgeEnvioConfig>({
    ...DEFAULT_CONFIG,
    ...(initialConfig || {}),
  });
  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'estilos'>('general');
  const [saving, setSaving] = useState<boolean>(false);

  const isEditing = !!widgetId;
  const scopeLabel = targetType === 'product' ? 'Producto' : 'General';

  const updateConfig = (patch: Partial<BadgeEnvioConfig>) => {
    setConfig((prev: BadgeEnvioConfig) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: any = {
        widget_slug: 'badge-envio',
        widget_type: 'badge-envio',
        target_type: targetType,
        target_product_id: targetProductId || null,
        config,
        is_active: isActive,
      };

      const url = isEditing ? `/api/widgets/${widgetId}` : '/api/widgets';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Error al guardar: ' + (err.error || res.statusText));
        setSaving(false);
        return;
      }

      router.push('/widgets');
      router.refresh();
    } catch (e: any) {
      alert('Error: ' + e.message);
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 40 }}>
      {/* HEADER */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button
          onClick={() => router.push('/widgets')}
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            fontSize: 20,
            color: '#374151',
          }}
        >
          ←
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C10 6 5 10 5 15a7 7 0 0 0 14 0c0-5-5-9-7-13z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#111827' }}>Nevux</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px' }}>
        {/* SCOPE CHIP */}
        {targetType === 'all' ? (
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            🌐 Widget general para toda la tienda
          </div>
        ) : (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              padding: '8px 12px',
              borderRadius: 10,
              marginBottom: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              maxWidth: '100%',
            }}
          >
            {productImage ? (
              <img
                src={productImage}
                alt=""
                style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: '#f3f4f6',
                }}
              />
            )}
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 200,
              }}
            >
              {productName || 'Producto'}
            </span>
          </div>
        )}

        {/* TÍTULO */}
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 18px 0',
            lineHeight: 1.3,
          }}
        >
          {isEditing ? 'Editar' : 'Nuevo widget:'} Badge de envío ({scopeLabel})
        </h1>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* PREVIEW */}
          <BadgeEnvioPreview config={config} />

          {/* INFO AZUL */}
          <div
            style={{
              margin: '0 16px 12px',
              padding: '10px 12px',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
              fontSize: 13,
              color: '#6b7280',
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#e5e7eb',
                color: '#6b7280',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              i
            </span>
            <span>El widget crea su propio mensaje debajo del precio del producto.</span>
          </div>

          {/* TABS */}
          <div
            style={{
              display: 'flex',
              borderTop: '1px solid #f3f4f6',
              background: '#fafafa',
            }}
          >
            {[
              { id: 'general', label: 'General' },
              { id: 'ubicacion', label: 'Ubicación' },
              { id: 'estilos', label: 'Estilos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'general' | 'ubicacion' | 'estilos')}
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  background: activeTab === tab.id ? '#fff' : 'transparent',
                  border: 'none',
                  borderBottom:
                    activeTab === tab.id ? '2px solid #111827' : '2px solid transparent',
                  fontSize: 15,
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#111827' : '#6b7280',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENIDO TABS */}
          <div style={{ padding: 16 }}>
            {activeTab === 'general' && (
              <GeneralTab config={config} update={updateConfig} />
            )}
            {activeTab === 'ubicacion' && (
              <UbicacionTab config={config} update={updateConfig} />
            )}
            {activeTab === 'estilos' && (
              <EstilosTab config={config} update={updateConfig} />
            )}
          </div>

          {/* FOOTER */}
          <div
            style={{
              borderTop: '1px solid #f3f4f6',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <span
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 999,
                  background: isActive ? '#2563eb' : '#d1d5db',
                  position: 'relative',
                  transition: 'background 0.2s',
                  display: 'inline-block',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: isActive ? 20 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                  }}
                />
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
                Widget activo
              </span>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#e5e7eb',
                  color: '#6b7280',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                i
              </span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear widget'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB GENERAL
============================================================ */
function GeneralTab({
  config,
  update,
}: {
  config: BadgeEnvioConfig;
  update: (p: Partial<BadgeEnvioConfig>) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
          Configuración de envío
        </h3>
        <p
          style={{
            fontSize: 13,
            color: '#dc2626',
            margin: '0 0 12px',
            display: 'flex',
            gap: 6,
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            i
          </span>
          Utilizá la misma que hayas configurado en tu Tiendanube.
        </p>

        <RadioCard
          checked={config.shippingMode === 'always'}
          onClick={() => update({ shippingMode: 'always' })}
          title="Siempre envío gratis"
          desc="El badge aparece sin condición de monto."
        />
        <div style={{ height: 10 }} />
        <RadioCard
          checked={config.shippingMode === 'from-amount'}
          onClick={() => update({ shippingMode: 'from-amount' })}
          title="Envío gratis a partir de $X"
          desc="El badge mostrará el monto mínimo para acceder al envío gratis al menos que el precio del producto supere dicho monto."
        />
      </div>

      <CheckCard
        checked={config.showIcon}
        onClick={() => update({ showIcon: !config.showIcon })}
        title="Mostrar ícono de envío"
        desc="Muestra un ícono de camión antes del texto del mensaje."
      />

      <div>
        <label style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
          Badge (opcional)
        </label>
        <input
          type="text"
          maxLength={15}
          value={config.badgeText}
          onChange={(e) => update({ badgeText: e.target.value })}
          placeholder="Ej: OFERTA"
          style={{
            width: '100%',
            marginTop: 8,
            padding: '12px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 14,
            color: '#111827',
            background: '#fff',
            outline: 'none',
          }}
        />
        <p style={{ fontSize: 12, color: '#6b7280', margin: '6px 0 0' }}>
          Dejá vacío para no mostrar badge (máximo 15 caracteres)
        </p>
      </div>

      <CheckCard
        checked={config.badgeBounce}
        onClick={() => update({ badgeBounce: !config.badgeBounce })}
        title="Efecto rebote en el badge"
        desc="Aplica una animación de zoom-rebote al badge para llamar la atención."
      />

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>
          Posición del badge
        </h3>
        <RadioCard
          checked={config.badgePosition === 'top-right'}
          onClick={() => update({ badgePosition: 'top-right' })}
          title="Esquina superior derecha"
          desc="El badge flota en la esquina del badge (por encima del borde)."
        />
        <div style={{ height: 10 }} />
        <RadioCard
          checked={config.badgePosition === 'inline-end'}
          onClick={() => update({ badgePosition: 'inline-end' })}
          title="Al final del texto"
          desc="El badge se muestra inline a la derecha, al final del mensaje."
        />
      </div>
    </div>
  );
}

/* ============================================================
   TAB UBICACIÓN
============================================================ */
function UbicacionTab({
  config,
  update,
}: {
  config: BadgeEnvioConfig;
  update: (p: Partial<BadgeEnvioConfig>) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
        ¿Dónde mostrar el badge?
      </h3>

      <CheckCard
        checked={config.showOnProduct}
        onClick={() => update({ showOnProduct: !config.showOnProduct })}
        title="Mostrar en página de producto"
        desc="El badge estiliza el mensaje de envío de Tiendanube en la página del producto."
        extra={
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: 'inline-block',
              marginTop: 8,
              color: '#2563eb',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            ¿Cómo ocultar el mensaje nativo de Tiendanube? ⌄
          </a>
        }
      />

      <CheckCard
        checked={config.showOnGrid}
        onClick={() => update({ showOnGrid: !config.showOnGrid })}
        title="Mostrar en grilla de productos"
        desc="El badge aparece debajo del precio en home, categorías y búsqueda. Sin animación."
      />
    </div>
  );
}

/* ============================================================
   TAB ESTILOS
============================================================ */
function EstilosTab({
  config,
  update,
}: {
  config: BadgeEnvioConfig;
  update: (p: Partial<BadgeEnvioConfig>) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <ColorField
            label="Color de fondo"
            value={config.bgColor}
            onChange={(v) => update({ bgColor: v })}
          />
          <ColorField
            label="Color de texto"
            value={config.textColor}
            onChange={(v) => update({ textColor: v })}
          />
        </div>

        <ToggleRow
          checked={config.gradient}
          onChange={() => update({ gradient: !config.gradient })}
          label="Fondo en degradado"
        />

        {config.gradient && (
          <ColorField
            label="Segundo color del degradado"
            value={config.gradientColor}
            onChange={(v) => update({ gradientColor: v })}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
            Tamaño de fuente
          </label>
          <select
            value={config.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            style={{
              width: '100%',
              marginTop: 8,
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 14,
              background: '#fff',
              color: '#111827',
            }}
          >
            {[11, 12, 13, 14, 15, 16, 18].map((s) => (
              <option key={s} value={s}>
                {s}px
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Borde</label>
          <div style={{ marginTop: 8 }}>
            <ToggleRow
              checked={config.showBorder}
              onChange={() => update({ showBorder: !config.showBorder })}
              label="Mostrar borde (1px)"
            />
          </div>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
          Margen interno
        </label>
        <input
          type="range"
          min={0}
          max={30}
          value={config.padding}
          onChange={(e) => update({ padding: Number(e.target.value) })}
          style={{ width: '100%', marginTop: 10 }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#6b7280',
          }}
        >
          <span>0px</span>
          <span>{config.padding}px</span>
          <span>30px</span>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
          Bordes redondeados
        </label>
        <input
          type="range"
          min={0}
          max={25}
          value={config.borderRadius}
          onChange={(e) => update({ borderRadius: Number(e.target.value) })}
          style={{ width: '100%', marginTop: 10 }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#6b7280',
          }}
        >
          <span>0px</span>
          <span>{config.borderRadius}px</span>
          <span>25px</span>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>
          Efecto
        </h3>
        <RadioCard
          checked={config.effect === 'halo'}
          onClick={() => update({ effect: 'halo' })}
          title="Aureola pulsante"
          desc="Un halo se expande y difumina alrededor del elemento."
        />
        <div style={{ height: 10 }} />
        <RadioCard
          checked={config.effect === 'zoom'}
          onClick={() => update({ effect: 'zoom' })}
          title="Zoom"
          desc="El elemento se agranda y reduce suavemente."
        />
        <div style={{ height: 10 }} />
        <RadioCard
          checked={config.effect === 'none'}
          onClick={() => update({ effect: 'none' })}
          title="Sin efecto"
          desc="El mensaje se muestra estático, sin animación."
        />
      </div>

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>
          Estilos del badge
        </h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <ColorField
            label="Color de fondo"
            value={config.badgeBgColor}
            onChange={(v) => update({ badgeBgColor: v })}
          />
          <ColorField
            label="Color de texto"
            value={config.badgeTextColor}
            onChange={(v) => update({ badgeTextColor: v })}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTES AUXILIARES
============================================================ */
function RadioCard({
  checked,
  onClick,
  title,
  desc,
}: {
  checked: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `1px solid ${checked ? '#2563eb' : '#e5e7eb'}`,
        borderRadius: 10,
        padding: '14px',
        cursor: 'pointer',
        background: '#fff',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#2563eb' : '#d1d5db'}`,
          background: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {checked && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#2563eb',
            }}
          />
        )}
      </span>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{title}</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{desc}</div>
      </div>
    </div>
  );
}

function CheckCard({
  checked,
  onClick,
  title,
  desc,
  extra,
}: {
  checked: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${checked ? '#2563eb' : '#e5e7eb'}`,
        borderRadius: 10,
        padding: '14px',
        background: '#fff',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <span
        onClick={onClick}
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: checked ? '#2563eb' : '#fff',
          border: `2px solid ${checked ? '#2563eb' : '#d1d5db'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <div style={{ flex: 1 }}>
        <div
          onClick={onClick}
          style={{ fontSize: 15, fontWeight: 700, color: '#111827', cursor: 'pointer' }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{desc}</div>
        {extra}
      </div>
    </div>
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
    <div style={{ flex: 1, minWidth: 0 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{label}</label>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
        <label
          style={{
            width: 40,
            height: 36,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: value,
            cursor: 'pointer',
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '8px 10px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 13,
            color: '#111827',
            background: '#fff',
            fontFamily: 'monospace',
          }}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
    >
      <span
        onClick={onChange}
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? '#2563eb' : '#d1d5db',
          position: 'relative',
          display: 'inline-block',
          transition: 'background 0.2s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
          }}
        />
      </span>
      <span style={{ fontSize: 14, color: '#374151' }}>{label}</span>
    </label>
  );
    }
