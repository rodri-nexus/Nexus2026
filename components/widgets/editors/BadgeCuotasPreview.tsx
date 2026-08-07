// components/widgets/editors/BadgeCuotasPreview.tsx
'use client';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface BadgeCuotasConfig {
  cuotasSeleccionadas: number[];
  mensaje: string;
  mostrarIconoTarjeta: boolean;
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

interface Props {
  config: BadgeCuotasConfig;
}

/* ═══════════════════════════════════════════
   ÍCONO DE TARJETA
═══════════════════════════════════════════ */
const IconTarjeta = ({ color = 'currentColor', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BadgeCuotasPreview({ config }: Props) {
  // Elegir la mayor cuota seleccionada (o "N" si ninguna)
  const cuotasOrdenadas = [...(config.cuotasSeleccionadas || [])].sort((a, b) => b - a);
  const cuotaShow = cuotasOrdenadas.length > 0 ? String(cuotasOrdenadas[0]) : 'N';

  // Construir el mensaje reemplazando variables
  const mensaje = (config.mensaje || '{cuotas} cuotas sin interés de {monto}')
    .replace('{cuotas}', cuotaShow)
    .replace('{monto}', '$****');

  // Fondo del badge
  const fondo = config.fondoDegradado
    ? `linear-gradient(135deg, ${config.colorFondo} 0%, ${config.colorFondo}dd 100%)`
    : config.colorFondo;

  const borde = config.mostrarBorde ? `1px solid ${config.colorTexto}22` : 'none';

  // Animaciones según efecto
  const animation =
    config.efecto === 'aureola' ? 'nvxAureolaPulse 2s ease-in-out infinite' :
    config.efecto === 'zoom' ? 'nvxZoom 2s ease-in-out infinite' :
    'none';

  const showBadge = config.textoBadge && config.textoBadge.trim().length > 0;
  const badgeAnimation = config.efectoRebote ? 'nvxBounceBadge 1.2s ease-in-out infinite' : 'none';

  return (
    <>
      <style>{`
        @keyframes nvxAureolaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
        }
        @keyframes nvxZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes nvxBounceBadge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 0',
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Badge principal (mensaje) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: fondo,
            color: config.colorTexto,
            fontSize: config.fontSize,
            fontWeight: 500,
            padding: `${config.paddingInterno}px ${config.paddingInterno + 8}px`,
            borderRadius: config.bordesRedondeados,
            border: borde,
            animation: animation,
            position: 'relative',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}>
            {config.mostrarIconoTarjeta && (
              <IconTarjeta color={config.colorTexto} size={14} />
            )}
            <span>{mensaje}</span>

            {/* Badge inline (al final del texto) */}
            {showBadge && config.posicionBadge === 'final-texto' && (
              <span style={{
                display: 'inline-block',
                background: config.colorFondoBadge,
                color: config.colorTextoBadge,
                fontSize: Math.max(9, parseInt(config.fontSize, 10) - 3),
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginLeft: 4,
                animation: badgeAnimation,
              }}>
                {config.textoBadge}
              </span>
            )}
          </div>

          {/* Badge en esquina superior derecha */}
          {showBadge && config.posicionBadge === 'esquina-superior-derecha' && (
            <span style={{
              position: 'absolute',
              top: -10,
              right: -8,
              background: config.colorFondoBadge,
              color: config.colorTextoBadge,
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              animation: badgeAnimation,
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}>
              {config.textoBadge}
            </span>
          )}
        </div>
      </div>
    </>
  );
     }
