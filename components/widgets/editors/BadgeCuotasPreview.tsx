// components/widgets/editors/BadgeCuotasPreview.tsx
'use client';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface BadgeCuotasConfig {
  cuotas: number;
  interes: 'sin_interes' | 'con_interes';
  porcentaje_interes: number;
  texto_principal: string;
  texto_secundario: string;
  mostrarIcono: boolean;
  icono: string;
  estilo: 'clasico' | 'moderno' | 'minimal' | 'destacado';
  colorFondo: string;
  colorTexto: string;
  colorAcento: string;
  colorBorde: string;
  borderRadius: number;
  paddingWidget: number;
  fontSize: string;
  fontSizeSecundario: string;
  mostrarEnProducto: boolean;
  mostrarEnCarrito: boolean;
  animacion: boolean;
}

interface Props {
  config: BadgeCuotasConfig;
}

/* ═══════════════════════════════════════════
   BADGE CLÁSICO
═══════════════════════════════════════════ */
function BadgeClasico({ config }: { config: BadgeCuotasConfig }) {
  const sinInteres = config.interes === 'sin_interes';
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: `${config.paddingWidget - 4}px ${config.paddingWidget}px`,
      background: config.colorFondo,
      borderRadius: config.borderRadius,
      border: `1.5px solid ${config.colorBorde}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {config.mostrarIcono && (
        <span style={{ fontSize: 16 }}>{config.icono}</span>
      )}
      <div>
        <div style={{
          fontSize: `calc(${config.fontSize} * 0.85)`,
          fontWeight: 800,
          color: config.colorTexto,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}>
          {config.texto_principal.replace('{cuotas}', String(config.cuotas))}
        </div>
        {sinInteres && (
          <div style={{
            fontSize: `calc(${config.fontSizeSecundario} * 0.85)`,
            fontWeight: 600,
            color: config.colorAcento,
            marginTop: 1,
            whiteSpace: 'nowrap',
          }}>
            {config.texto_secundario}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BADGE MODERNO
═══════════════════════════════════════════ */
function BadgeModerno({ config }: { config: BadgeCuotasConfig }) {
  const sinInteres = config.interes === 'sin_interes';
  return (
    <div style={{
      padding: `${config.paddingWidget - 4}px ${config.paddingWidget}px`,
      background: `linear-gradient(135deg, ${config.colorFondo} 0%, ${config.colorAcento}22 100%)`,
      borderRadius: config.borderRadius,
      border: `2px solid ${config.colorAcento}44`,
      boxShadow: `0 4px 16px ${config.colorAcento}33`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 3,
        background: config.colorAcento,
        borderRadius: `${config.borderRadius}px 0 0 ${config.borderRadius}px`,
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {config.mostrarIcono && (
            <span style={{ fontSize: 16 }}>{config.icono}</span>
          )}
          <div style={{
            fontSize: `calc(${config.fontSize} * 0.85)`,
            fontWeight: 800,
            color: config.colorTexto,
            whiteSpace: 'nowrap',
          }}>
            {config.texto_principal.replace('{cuotas}', String(config.cuotas))}
          </div>
        </div>
        {sinInteres && (
          <div style={{
            marginTop: 3,
            display: 'inline-block',
            padding: '1px 6px',
            background: `${config.colorAcento}22`,
            borderRadius: 4,
            fontSize: `calc(${config.fontSizeSecundario} * 0.85)`,
            fontWeight: 700,
            color: config.colorAcento,
            whiteSpace: 'nowrap',
          }}>
            {config.texto_secundario}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BADGE MINIMAL
═══════════════════════════════════════════ */
function BadgeMinimal({ config }: { config: BadgeCuotasConfig }) {
  const sinInteres = config.interes === 'sin_interes';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: `${config.paddingWidget - 6}px ${config.paddingWidget - 2}px`,
      background: config.colorFondo,
      borderRadius: config.borderRadius,
      borderBottom: `2px solid ${config.colorAcento}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    }}>
      {config.mostrarIcono && (
        <span style={{ fontSize: 14 }}>{config.icono}</span>
      )}
      <span style={{
        fontSize: `calc(${config.fontSize} * 0.85)`,
        fontWeight: 700,
        color: config.colorTexto,
        whiteSpace: 'nowrap',
      }}>
        {config.texto_principal.replace('{cuotas}', String(config.cuotas))}
      </span>
      {sinInteres && (
        <span style={{
          fontSize: `calc(${config.fontSizeSecundario} * 0.85)`,
          color: config.colorAcento,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          · {config.texto_secundario}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   BADGE DESTACADO
═══════════════════════════════════════════ */
function BadgeDestacado({ config }: { config: BadgeCuotasConfig }) {
  const sinInteres = config.interes === 'sin_interes';
  return (
    <div style={{
      padding: `${config.paddingWidget - 4}px ${config.paddingWidget}px`,
      background: config.colorAcento,
      borderRadius: config.borderRadius,
      boxShadow: `0 6px 20px ${config.colorAcento}55`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
        pointerEvents: 'none',
        borderRadius: `${config.borderRadius}px ${config.borderRadius}px 0 0`,
      }} />
      {config.mostrarIcono && (
        <div style={{ fontSize: 18, marginBottom: 2 }}>{config.icono}</div>
      )}
      <div style={{
        fontSize: `calc(${config.fontSize} * 0.85)`,
        fontWeight: 800,
        color: '#ffffff',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}>
        {config.texto_principal.replace('{cuotas}', String(config.cuotas))}
      </div>
      {sinInteres && (
        <div style={{
          marginTop: 2,
          fontSize: `calc(${config.fontSizeSecundario} * 0.85)`,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          whiteSpace: 'nowrap',
        }}>
          {config.texto_secundario}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MOCK PRODUCTO
   Badge flota en esquina superior derecha
   de la imagen del producto
═══════════════════════════════════════════ */
function ProductMock({ config }: { config: BadgeCuotasConfig }) {
  const BadgeComponent =
    config.estilo === 'moderno' ? BadgeModerno :
    config.estilo === 'minimal' ? BadgeMinimal :
    config.estilo === 'destacado' ? BadgeDestacado :
    BadgeClasico;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    }}>
      {/* Header mock */}
      <div style={{
        padding: '12px 16px',
        background: '#1a1a2e',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>MODERN STORE</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#d1d5db' }}>
          <span>Shop</span><span>Colecciones</span><span>🛒</span>
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Imagen con badge flotando en esquina superior derecha */}
        <div style={{
          position: 'relative',
          width: 130,
          height: 160,
          flexShrink: 0,
        }}>
          {/* Imagen mock */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
          }}>
            🛍
          </div>

          {/* Badge flotando en esquina superior derecha */}
          {config.mostrarEnProducto && (
            <div style={{
              position: 'absolute',
              top: -10,
              right: -10,
              zIndex: 10,
              maxWidth: 160,
            }}>
              <BadgeComponent config={config} />
            </div>
          )}
        </div>

        {/* Info del producto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Colección Verano
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', marginTop: 4 }}>
            Camisa Lino Premium
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginTop: 8 }}>
            $68.00
          </div>
          <button style={{
            marginTop: 14, width: '100%', padding: '12px',
            background: '#1a1a2e', color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'default',
          }}>
            🛒 Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MOCK CARRITO
═══════════════════════════════════════════ */
function CartMock({ config }: { config: BadgeCuotasConfig }) {
  const BadgeComponent =
    config.estilo === 'moderno' ? BadgeModerno :
    config.estilo === 'minimal' ? BadgeMinimal :
    config.estilo === 'destacado' ? BadgeDestacado :
    BadgeClasico;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    }}>
      <div style={{
        padding: '12px 16px',
        background: '#1a1a2e',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>Tu carrito (2)</div>
        <span style={{ fontSize: 12, color: '#d1d5db' }}>🛒</span>
      </div>

      <div style={{ padding: 16 }}>
        {/* Item del carrito con badge flotando */}
        <div style={{ position: 'relative', display: 'flex', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
              borderRadius: 8, fontSize: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              🛍
            </div>
            {/* Badge flotando en esquina superior derecha del item */}
            {config.mostrarEnCarrito && (
              <div style={{
                position: 'absolute',
                top: -8,
                right: -8,
                zIndex: 10,
                maxWidth: 140,
              }}>
                <BadgeComponent config={config} />
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Camisa Lino Premium</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Talle M · Cantidad: 1</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e', marginTop: 4 }}>$68.00</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Total</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e' }}>$68.00</span>
        </div>

        <button style={{
          width: '100%', padding: '12px',
          background: '#1a1a2e', color: '#fff', border: 'none',
          borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'default',
        }}>
          Finalizar compra
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BadgeCuotasPreview({ config }: Props) {
  const showProducto = config.mostrarEnProducto;
  const showCarrito = config.mostrarEnCarrito;

  return (
    <>
      <style>{`
        @keyframes nvxBadgePulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Sin ubicación activa */}
        {!showProducto && !showCarrito && (
          <div style={{
            padding: 30, background: '#fff7ed',
            border: '1.5px dashed #fb923c',
            borderRadius: 12, textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📍</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#c2410c', marginBottom: 4 }}>
              Elegí una ubicación
            </div>
            <div style={{ fontSize: 12, color: '#ea580c' }}>
              Activá &quot;Producto&quot; o &quot;Carrito&quot; en la sección Ubicación
            </div>
          </div>
        )}

        {/* PRODUCTO */}
        {showProducto && (
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: 8, paddingLeft: 4,
            }}>
              🛍 Vista en el Producto
            </div>
            <ProductMock config={config} />
          </div>
        )}

        {/* Divisor */}
        {showProducto && showCarrito && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #d1d5db, transparent)' }} />
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>Y ADEMÁS EN</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #d1d5db, transparent)' }} />
          </div>
        )}

        {/* CARRITO */}
        {showCarrito && (
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: 8, paddingLeft: 4,
            }}>
              🛒 Vista en el Carrito
            </div>
            <CartMock config={config} />
          </div>
        )}
      </div>
    </>
  );
}
