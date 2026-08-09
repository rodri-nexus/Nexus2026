'use client';

interface Objetivo {
  nombre: string;
  monto: number;
  icono: string; // 'none' | 'truck' | 'gift' | 'tag' | 'star' | 'percent' | 'check' | 'shield' | 'bolt' | 'heart' | 'coffee' | 'hexagon' | 'card' | 'smile'
}

interface BarraProgresoPreviewProps {
  config: {
    objetivos?: Objetivo[];
    textoFaltante?: string;
    textoCumplido?: string;
    formatoObjetivos?: 'automatico' | 'lista';
    bordesRedondeados?: number;
    rellenoInterno?: number;
    colorBarraVacia?: string;
    colorBarraLlena?: string;
    colorFondo?: string;
    colorTexto?: string;
    colorMonto?: string;
    colorObjetivos?: string;
    tamanoFuenteObjetivos?: number;
    tamanoFuenteTexto?: number;
  };
  // subtotal simulado para el preview (por defecto 0)
  subtotalDemo?: number;
}

export default function BarraProgresoPreview({ config, subtotalDemo = 0 }: BarraProgresoPreviewProps) {
  const objetivos: Objetivo[] =
    config.objetivos && config.objetivos.length > 0
      ? config.objetivos
      : [{ nombre: 'Envío gratis', monto: 50000, icono: 'none' }];

  const textoFaltante = config.textoFaltante || 'Te faltan {x} para {objetivo}';
  const textoCumplido = config.textoCumplido || '¡{objetivo} desbloqueado! 🎉';
  const bordesRedondeados = config.bordesRedondeados ?? 8;
  const rellenoInterno = config.rellenoInterno ?? 14;
  const colorBarraVacia = config.colorBarraVacia || '#e0e0e0';
  const colorBarraLlena = config.colorBarraLlena || '#22c55e';
  const colorFondo = config.colorFondo || '#fafafa';
  const colorTexto = config.colorTexto || '#333333';
  const colorMonto = config.colorMonto || '#0d6efd';
  const colorObjetivos = config.colorObjetivos || '#333333';
  const tamanoFuenteObjetivos = config.tamanoFuenteObjetivos ?? 11;
  const tamanoFuenteTexto = config.tamanoFuenteTexto ?? 13;

  // Ordenar objetivos por monto ascendente
  const objetivosOrdenados = [...objetivos].sort((a, b) => a.monto - b.monto);
  const montoMax = objetivosOrdenados[objetivosOrdenados.length - 1].monto;

  // Buscar el próximo objetivo no cumplido
  const proximoObj = objetivosOrdenados.find((o) => subtotalDemo < o.monto);
  const ultimoCumplido = [...objetivosOrdenados].reverse().find((o) => subtotalDemo >= o.monto);

  const faltante = proximoObj ? proximoObj.monto - subtotalDemo : 0;
  const porcentaje = Math.min(100, Math.max(0, (subtotalDemo / montoMax) * 100));

  // Construir texto principal
  let textoPrincipal: React.ReactNode = null;
  if (proximoObj) {
    const parts = textoFaltante.split(/(\{x\}|\{objetivo\})/g);
    textoPrincipal = parts.map((p, i) => {
      if (p === '{x}') {
        return (
          <strong key={i} style={{ color: colorMonto, fontWeight: 700 }}>
            {formatMoney(faltante)}
          </strong>
        );
      }
      if (p === '{objetivo}') {
        return (
          <strong key={i} style={{ color: colorObjetivos, fontWeight: 700 }}>
            {proximoObj.nombre}
          </strong>
        );
      }
      return <span key={i}>{p}</span>;
    });
  } else if (ultimoCumplido) {
    const parts = textoCumplido.split(/(\{objetivo\})/g);
    textoPrincipal = parts.map((p, i) => {
      if (p === '{objetivo}') {
        return (
          <strong key={i} style={{ color: colorObjetivos, fontWeight: 700 }}>
            {ultimoCumplido.nombre}
          </strong>
        );
      }
      return <span key={i}>{p}</span>;
    });
  }

  return (
    <div
      style={{
        width: '100%',
        background: colorFondo,
        borderRadius: `${bordesRedondeados}px`,
        padding: `${rellenoInterno}px ${rellenoInterno + 4}px`,
        boxSizing: 'border-box',
      }}
    >
      {/* Texto principal */}
      <div
        style={{
          color: colorTexto,
          fontSize: `${tamanoFuenteTexto}px`,
          lineHeight: 1.4,
          marginBottom: 10,
        }}
      >
        {textoPrincipal}
      </div>

      {/* Barra + hits */}
      <div style={{ position: 'relative', width: '100%', paddingRight: 22 }}>
        {/* Barra vacía (fondo) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 8,
            background: colorBarraVacia,
            borderRadius: 999,
            overflow: 'visible',
          }}
        >
          {/* Barra llena */}
          <div
            style={{
              width: `${porcentaje}%`,
              height: '100%',
              background: colorBarraLlena,
              borderRadius: 999,
              transition: 'width 0.3s ease',
            }}
          />

          {/* Hits (marcas de cada objetivo) */}
          {objetivosOrdenados.map((o, i) => {
            const isLast = i === objetivosOrdenados.length - 1;
            const posPct = isLast ? 100 : (o.monto / montoMax) * 100;
            const cumplido = subtotalDemo >= o.monto;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${posPct}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: cumplido ? colorBarraLlena : '#c9c9c9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
                title={o.nombre}
              >
                {renderIcono(o.icono, 12, '#fff')}
              </div>
            );
          })}
        </div>

        {/* Labels de objetivos (solo en formato lista) */}
        {config.formatoObjetivos === 'lista' && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {objetivosOrdenados.map((o, i) => {
              const cumplido = subtotalDemo >= o.monto;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: `${tamanoFuenteObjetivos}px`,
                    color: colorObjetivos,
                    opacity: cumplido ? 1 : 0.6,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: cumplido ? colorBarraLlena : '#c9c9c9',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontWeight: cumplido ? 700 : 500 }}>
                    {o.nombre} — {formatMoney(o.monto)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatMoney(n: number): string {
  if (n === null || n === undefined || isNaN(n)) return '$0';
  try {
    return '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } catch {
    return '$' + Math.round(n);
  }
}

function renderIcono(icono: string, size: number, color: string): React.ReactNode {
  const stroke = color;
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (icono) {
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
      return (
        <span style={{ fontSize: size + 2, lineHeight: 1 }}>😊</span>
      );
    case 'none':
    default:
      // sin ícono: solo el círculo vacío (no dibuja nada)
      return null;
  }
    }
