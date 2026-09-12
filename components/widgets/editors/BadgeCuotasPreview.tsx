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
  campaignTheme?: string;
}

interface Props {
  config: BadgeCuotasConfig;
}

/* ═══════════════════════════════════════════
   ÍCONO DE TARJETA
═══════════════════════════════════════════ */
const IconTarjeta = ({ color = 'currentColor', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="3" ry="3"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

/* ═══════════════════════════════════════════
   PRESETS DE CAMPAÑAS (FECHAS ESPECIALES)
═══════════════════════════════════════════ */
const THEMES: Record<string, { themeColor: string; accentColor: string; badgeText: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', badgeText: 'BLACK FRIDAY' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', badgeText: 'HOT SALE' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', badgeText: 'CYBER MONDAY' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', badgeText: 'NAVIDAD' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', badgeText: 'LOVE SALE' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', badgeText: 'ESPECIAL' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', badgeText: 'LIQUIDACIÓN' },
};

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

  // Evaluar si hay campaña activa para sobreescribir colores en vivo
  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  // Fondo del badge con soporte para degradados normales o temáticos
  const fondo = activeTheme
    ? `linear-gradient(135deg, ${activeTheme.themeColor} 0%, ${activeTheme.themeColor}dd 100%)`
    : config.fondoDegradado
      ? `linear-gradient(135deg, ${config.colorFondo} 0%, ${config.colorFondo}dd 100%)`
      : config.colorFondo;

  const colorTexto = activeTheme ? '#ffffff' : config.colorTexto;
  const colorFondoBadge = activeTheme ? activeTheme.accentColor : config.colorFondoBadge;
  
  // Contraste óptimo oscuro para Black Friday y Liquidación sobre acentos amarillos/dorados
  const colorTextoBadge = activeTheme
    ? (currentCampaign === 'black-friday' || currentCampaign === 'liquidacion' ? '#000000' : '#ffffff')
    : config.colorTextoBadge;

  // Texto del badge opcional (prioriza configuración del usuario, de lo contrario toma el del tema)
  const textoBadgeToShow = config.textoBadge && config.textoBadge.trim().length > 0
    ? config.textoBadge
    : (activeTheme ? activeTheme.badgeText : '');

  const showBadge = textoBadgeToShow && textoBadgeToShow.trim().length > 0;
  const borde = config.mostrarBorde ? `1px solid ${colorTexto}22` : '1px solid rgba(255, 255, 255, 0.12)';

  // Animaciones según efecto
  const animation =
    config.efecto === 'aureola' ? 'nvxAureolaPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' :
    config.efecto === 'zoom' ? 'nvxZoom 2.5s ease-in-out infinite' :
    'none';

  const badgeAnimation = config.efectoRebote ? 'nvxBounceBadge 1.4s ease-in-out infinite' : 'none';

  return (
    <>
      <style>{`
        @keyframes nvxAureolaPulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04); 
          }
          50% { 
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0), 0 6px 20px rgba(16, 185, 129, 0.18); 
          }
        }
        @keyframes nvxZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes nvxBounceBadge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes nvxLightSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          25%, 100% { transform: translateX(250%) skewX(-20deg); }
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
            color: colorTexto,
            fontSize: config.fontSize,
            fontWeight: 600,
            padding: `${config.paddingInterno}px ${config.paddingInterno + 10}px`,
            borderRadius: config.bordesRedondeados,
            border: borde,
            animation: animation,
            position: 'relative',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
            {/* EFECTO BARRIDO DE LUZ (Light Sweep) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '45%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%)',
              animation: 'nvxLightSweep 4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {config.mostrarIconoTarjeta && (
              <span style={{ display: 'inline-flex', alignItems: 'center', zIndex: 2 }}>
                <IconTarjeta color={colorTexto} size={15} />
              </span>
            )}

            <span style={{ zIndex: 2, letterSpacing: '-0.01em' }}>{mensaje}</span>

            {/* Badge inline (al final del texto) */}
            {showBadge && config.posicionBadge === 'final-texto' && (
              <span style={{
                display: 'inline-block',
                background: colorFondoBadge,
                color: colorTextoBadge,
                fontSize: Math.max(9, parseInt(config.fontSize, 10) - 3),
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: 6,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginLeft: 4,
                animation: badgeAnimation,
                zIndex: 2,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              }}>
                {textoBadgeToShow}
              </span>
            )}
          </div>

          {/* Badge en esquina superior derecha */}
          {showBadge && config.posicionBadge === 'esquina-superior-derecha' && (
            <span style={{
              position: 'absolute',
              top: -10,
              right: -8,
              background: colorFondoBadge,
              color: colorTextoBadge,
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
              animation: badgeAnimation,
              whiteSpace: 'nowrap',
              zIndex: 3,
            }}>
              {textoBadgeToShow}
            </span>
          )}
        </div>
      </div>
    </>
  );
     }
