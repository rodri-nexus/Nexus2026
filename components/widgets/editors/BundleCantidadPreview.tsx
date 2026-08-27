'use client';

import React from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface UnidadConfig {
  subtitulo: string;
  descuento: number;
  badgeEnvioGratis: boolean;
  badgeMasVendido: boolean;
  badgePersonalizado: boolean;
  ocultar: boolean;
  porDefecto: boolean;
  ocultarComp1: boolean;
  ocultarComp2: boolean;
  agregarRegalo: boolean;
}

interface BundleCantidadConfig {
  titulo: string;
  cantidadUnidades: number;
  etiqueta: string;
  mostrarPrecio: 'total' | 'individual';
  textoBoton: string;
  unidades: UnidadConfig[];
  producto1: { id: number | null; nombre: string } | null;
  producto2: { id: number | null; nombre: string } | null;
  compDefault: boolean;
  reemplazarBoton: boolean;
  colorBoton: string;
  botonDegradado: boolean;
  colorBoton2: string;
  colorPrecio: string;
  colorSubtitulos: string;
  fondoSubtitulo: string;
  colorTextoRegalo: string;
  colorPrecioRegalo: string;
  fondoRegalo: string;
  colorBadgeEnvio: string;
  colorBadgePersonalizado: string;
  colorBadgeMasVendido: string;
  colorUnidadSeleccionada: string;
  bordeBoton: number;
  bordeUnidad: number;
  fuenteEtiqueta: number;
  fuentePrecio: number;
  fuenteSubtitulo: number;
  efectoBoton: 'sin-efecto' | 'zoom';
  pulsante: boolean;
}

interface Props {
  config: BundleCantidadConfig;
  precioProducto?: number;
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BundleCantidadPreview({ config, precioProducto = 30000 }: Props) {
  const [seleccionada, setSeleccionada] = React.useState<number>(() => {
    const idx = config.unidades.findIndex((u) => u?.porDefecto);
    return idx >= 0 ? idx : 0;
  });

  React.useEffect(() => {
    const idx = config.unidades.findIndex((u) => u?.porDefecto);
    if (idx >= 0) setSeleccionada(idx);
  }, [config.unidades]);

  const formatEtiqueta = (etiqueta: string, cantidad: number) => {
    return etiqueta.replace(/#/g, String(cantidad));
  };

  const formatMoney = (n: number) => {
    return '$' + Math.round(n).toLocaleString('es-AR');
  };

  const cantidadReal = Math.max(1, Math.min(5, config.cantidadUnidades || 2));
  const unidadesVisibles: number[] = [];
  for (let i = 0; i < cantidadReal; i++) {
    if (!config.unidades[i]?.ocultar) unidadesVisibles.push(i);
  }

  const bgBoton = config.botonDegradado
    ? `linear-gradient(90deg, ${config.colorBoton || '#10B981'}, ${config.colorBoton2 || '#059669'})`
    : config.colorBoton || '#10B981';

  return (
    <div
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 16,
        padding: 18,
        background: '#FFFFFF',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
      }}
    >
      <style>{`
        @keyframes nevux-widget-bundle-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25); }
          50% { transform: scale(1.02); box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4); }
        }
      `}</style>

      {config.titulo && config.titulo.trim() !== '' && (
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#000000',
            marginBottom: 14,
            textAlign: 'center',
            letterSpacing: '-0.01em',
          }}
        >
          {config.titulo}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {unidadesVisibles.map((i) => {
          const u = config.unidades[i] || ({} as UnidadConfig);
          const cantidad = i + 1;
          const isSelected = seleccionada === i;
          const descuento = Number(u.descuento) || 0;
          const precioUnitario = precioProducto * (1 - descuento / 100);
          const precioTotalOriginal = precioProducto * cantidad;
          const precioTotalConDesc = precioUnitario * cantidad;

          const mostrarTachado = descuento > 0;
          const precioMostrar =
            config.mostrarPrecio === 'individual' ? precioUnitario : precioTotalConDesc;
          const precioTachadoMostrar =
            config.mostrarPrecio === 'individual' ? precioProducto : precioTotalOriginal;

          const colorActivo = config.colorUnidadSeleccionada || '#10B981';

          const badges: { label: string; color: string }[] = [];
          if (u.badgeEnvioGratis) badges.push({ label: 'Envío gratis', color: config.colorBadgeEnvio || '#10B981' });
          if (u.badgeMasVendido) badges.push({ label: 'Más vendido', color: config.colorBadgeMasVendido || '#000000' });
          if (u.badgePersonalizado)
            badges.push({ label: 'Oferta Especial', color: config.colorBadgePersonalizado || '#059669' });

          return (
            <div
              key={i}
              onClick={() => setSeleccionada(i)}
              style={{
                border: `2px solid ${isSelected ? colorActivo : '#E5E7EB'}`,
                borderRadius: config.bordeUnidad || 12,
                padding: '14px 16px',
                cursor: 'pointer',
                background: isSelected ? '#ecfdf5' : '#FFFFFF',
                position: 'relative',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                boxShadow: isSelected
                  ? `0 6px 18px ${colorActivo}22`
                  : '0 2px 6px rgba(0,0,0,0.02)',
                opacity: isSelected ? 1 : 0.85,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? colorActivo : '#9CA3AF'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: '#FFFFFF',
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: colorActivo,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: config.fuenteEtiqueta || 14,
                        fontWeight: 800,
                        color: '#000000',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {formatEtiqueta(config.etiqueta, cantidad)}
                    </div>
                    {u.subtitulo && u.subtitulo.trim() !== '' && (
                      <div
                        style={{
                          display: 'inline-block',
                          marginTop: 4,
                          fontSize: config.fuenteSubtitulo || 12,
                          color: config.colorSubtitulos || '#059669',
                          background: config.fondoSubtitulo || '#a7f3d0',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontWeight: 700,
                        }}
                      >
                        {u.subtitulo}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {mostrarTachado && (
                    <div
                      style={{
                        fontSize: 12,
                        color: '#9CA3AF',
                        textDecoration: 'line-through',
                        lineHeight: 1.2,
                        fontWeight: 500,
                      }}
                    >
                      {formatMoney(precioTachadoMostrar)}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: config.fuentePrecio || 15,
                      fontWeight: 800,
                      color: config.colorPrecio || '#000000',
                      lineHeight: 1.1,
                    }}
                  >
                    {formatMoney(precioMostrar)}
                  </div>
                </div>
              </div>

              {badges.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {badges.map((b, k) => (
                    <span
                      key={k}
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        background: b.color,
                        padding: '3px 8px',
                        borderRadius: 999,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              )}

              {u.agregarRegalo && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '8px 10px',
                    background: config.fondoRegalo || '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 12, color: config.colorTextoRegalo || '#000000', fontWeight: 700 }}>
                    🎁 Producto de regalo
                  </div>
                  <div style={{ fontSize: 12, color: config.colorPrecioRegalo || '#059669', fontWeight: 800 }}>
                    GRATIS
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          style={{
            width: '100%',
            padding: '14px 20px',
            background: bgBoton,
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 800,
            border: 'none',
            borderRadius: config.bordeBoton || 12,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            animation: config.pulsante ? 'nevux-widget-bundle-pulse 1.8s ease-in-out infinite' : 'none',
          }}
        >
          {config.textoBoton && config.textoBoton.trim() !== '' ? config.textoBoton : 'Agregar al carrito'}
        </button>
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          color: '#6B7280',
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          {config.reemplazarBoton
            ? 'El formulario original de Tiendanube quedará oculto.'
            : 'El formulario original de Tiendanube permanecerá visible y funcional.'}
        </span>
      </div>
    </div>
  );
  }
