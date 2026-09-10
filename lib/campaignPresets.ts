// lib/campaignPresets.ts

/* ═══════════════════════════════════════════
   TIPOS DE CAMPAÑAS Y PRESETS
═══════════════════════════════════════════ */

export interface CampaignWidgetPatch {
  widgetSlug: string;
  configPatch: Record<string, unknown>;
}

export type VisualEffectType = 
  | 'fire-embers' 
  | 'neon-sparkles' 
  | 'snow' 
  | 'hearts' 
  | 'confetti' 
  | 'balloons' 
  | 'sale-tags'
  | 'halloween'; // Agregado para el evento de Halloween 🎃

export interface CampaignPreset {
  slug: string;
  name: string;
  emoji: string;
  badge: string;
  description: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  bannerMessage: string;
  couponCode: string;
  couponDiscount: string;
  durationDays: number;
  effect: VisualEffectType;
  patches: {
    'cuenta-regresiva': (endDateIso: string) => Record<string, unknown>;
    'banner-deslizante': Record<string, unknown>;
    'badge-cupon': Record<string, unknown>;
    'ruleta-descuentos': Record<string, unknown>;
    'barra-progreso': Record<string, unknown>;
    'comparador-marca': Record<string, unknown>;
    'medios-pago': Record<string, unknown>;
    'caja-opiniones': Record<string, unknown>;
    'mensaje-garantia': Record<string, unknown>;
    'mensaje-alerta': Record<string, unknown>;
  };
}

/* ═══════════════════════════════════════════
   HELPER DE FECHA DE FIN
═══════════════════════════════════════════ */
export function calculateCampaignEndDate(durationDays = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + durationDays);
  d.setHours(23, 59, 59, 999);
  return d.toISOString().slice(0, 16); // Formato "YYYY-MM-DDTHH:mm"
}

/* ═══════════════════════════════════════════
   PRESETS DE FECHAS ESPECIALES
═══════════════════════════════════════════ */
export const CAMPAIGN_PRESETS: Record<string, CampaignPreset> = {
  'halloween': {
    slug: 'halloween',
    name: 'Halloween Spooky Fest',
    emoji: '🎃',
    badge: 'Descuentos de Terror',
    description: 'Estética mística con atmósfera inmersiva de noche de brujas en naranja calabaza, morado y verde ectoplasma.',
    themeColor: '#ff7700',
    accentColor: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #0a0a0c 0%, #151026 100%)',
    bannerMessage: '🎃 HALLOWEEN SPOOKY FEST: Descuentos escalofriantes + Regalos de terror',
    couponCode: 'SPOOKY',
    couponDiscount: '20% OFF',
    durationDays: 5,
    effect: 'halloween',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '🎃 OFERTAS TERRORÍFICAS',
        subtitle: '¡Termina pronto! Promociones que se desvanecen en:',
        endDate: endDateIso,
        colorClockBg: '#ff7700',
        colorWidgetBg: '#0a0a0c',
        colorTitle: '#ffffff',
        colorSubtitle: '#a78bfa',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '🎃 HALLOWEEN SPOOKY FEST • DESCUENTOS ESCALOFRIANTES EN TODA LA TIENDA',
          '🦇 ENVÍOS GRATIS EN COMPRAS SELECCIONADAS • DULCE O TRUCO',
          '👻 CUOTAS SIN INTERÉS CON TARJETAS DE CRÉDITO',
        ],
        colorFondo: '#151026',
        colorTexto: '#ff7700',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '🎃 RECOMPENSA DE HALLOWEEN',
        subtexto: 'Aplicá el cupón oficial para obtener un descuento mágico',
        codigo: 'SPOOKY',
        badge: '20% OFF',
        bgColor: '#0a0a0c',
        borderColor: '#ff7700',
        textColor: '#ffffff',
        badgeBgColor: '#ff7700',
        badgeTextColor: '#ffffff',
        botonBgColor: '#8b5cf6',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '🎃 ¡RULETA SPOOKY!',
        subtitulo: 'Probá tu suerte en este caldero de ofertas y ganá',
        colorBoton: '#ff7700',
        colorRuletaPrincipal: '#8b5cf6',
        colorRuletaSecundario: '#ff7700',
        premios: [
          { texto: '20% OFF', codigoCupon: 'SPOOKY20', esGanador: true },
          { texto: '15% OFF', codigoCupon: 'SPOOKY15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'SPOOKY10', esGanador: true },
          { texto: 'Dulce o Truco 🕸️', codigoCupon: '', esGanador: false },
          { texto: '25% OFF', codigoCupon: 'WITCH25', esGanador: true },
          { texto: '5% OFF', codigoCupon: 'ECTO5', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#10b981',
        colorMonto: '#ff7700',
        textoFaltante: '🎃 Te faltan {x} para tu regalo especial de Halloween',
        textoCumplido: '👻 ¡RECOMPENSA DE HALLOWEEN CONSEGUIDA!',
      },
      'comparador-marca': {
        bgColor: '#0a0a0c',
        borderColor: '#8b5cf6',
        textColor: '#ffffff',
        destacadoBgColor: '#8b5cf625',
        destacadoTextColor: '#a78bfa',
        checkColor: '#10b981',
        crossColor: '#ff7700',
      },
      'medios-pago': {
        bgColor: '#0a0a0c',
        borderColor: '#ff7700',
        textColor: '#ffffff',
      },
      'caja-opiniones': {
        colorFondo: '#151026',
        colorTexto: '#ffffff',
        colorEstrellas: '#ff7700',
        colorBorde: '#8b5cf6',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#0a0a0c',
        colorTexto: '#ffffff',
        colorBorde: '#ff7700',
      },
      'mensaje-alerta': {
        colorFondo: '#8b5cf6',
        colorTexto: '#ffffff',
      },
    },
  },

  'black-friday': {
    slug: 'black-friday',
    name: 'Black Friday',
    emoji: '🔥',
    badge: 'Hasta 50% OFF',
    description: 'Estética Dark Premium con atmósfera inmersiva de llamas y ofertas bomba.',
    themeColor: '#000000',
    accentColor: '#e11d48',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
    bannerMessage: '🔥 BLACK FRIDAY: Hasta 50% OFF + Cuotas sin interés por tiempo limitado',
    couponCode: 'BLACKFRIDAY',
    couponDiscount: '20% OFF',
    durationDays: 4,
    effect: 'fire-embers',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '🔥 OFERTAS BLACK FRIDAY',
        subtitle: '¡Termina pronto! Descuentos por tiempo limitado',
        endDate: endDateIso,
        colorClockBg: '#e11d48',
        colorWidgetBg: '#09090b',
        colorTitle: '#ffffff',
        colorSubtitle: '#fda4af',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '🔥 BLACK FRIDAY EXCLUSIVO • HASTA 50% OFF EN TODA LA TIENDA',
          '⚡ ENVÍOS A TODO EL PAÍS • CUOTAS SIN INTERÉS',
          '⏳ OFERTAS VÁLIDAS HASTA AGOTAR STOCK',
        ],
        colorFondo: '#09090b',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '🔥 CUPÓN ESPECIAL BLACK FRIDAY',
        subtexto: 'Aplicá el cupón oficial al finalizar tu compra',
        codigo: 'BLACKFRIDAY',
        badge: '20% OFF',
        bgColor: '#09090b',
        borderColor: '#e11d48',
        textColor: '#ffffff',
        badgeBgColor: '#e11d48',
        badgeTextColor: '#ffffff',
        botonBgColor: '#e11d48',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '🔥 ¡RULETA BLACK FRIDAY!',
        subtitulo: 'Ingresá tu email y girá para desbloquear descuentos VIP',
        colorBoton: '#e11d48',
        colorRuletaPrincipal: '#e11d48',
        colorRuletaSecundario: '#18181b',
        premios: [
          { texto: '20% OFF', codigoCupon: 'BLACK20', esGanador: true },
          { texto: '15% OFF', codigoCupon: 'BLACK15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'BLACK10', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '25% OFF', codigoCupon: 'BLACK25', esGanador: true },
          { texto: '5% OFF', codigoCupon: 'BLACK5', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#e11d48',
        colorMonto: '#e11d48',
        textoFaltante: '🔥 Te faltan {x} para desbloquear {objetivo} en Black Friday',
        textoCumplido: '🎉 ¡{objetivo} DESBLOQUEADO EN BLACK FRIDAY!',
      },
      'comparador-marca': {
        bgColor: '#09090b',
        borderColor: '#e11d48',
        textColor: '#ffffff',
        destacadoBgColor: '#e11d4825',
        destacadoTextColor: '#fda4af',
        checkColor: '#e11d48',
        crossColor: '#4b5563',
      },
      'medios-pago': {
        bgColor: '#09090b',
        borderColor: '#e11d48',
        textColor: '#ffffff',
      },
      'caja-opiniones': {
        colorFondo: '#18181b',
        colorTexto: '#ffffff',
        colorEstrellas: '#fbbf24',
        colorBorde: '#e11d48',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#09090b',
        colorTexto: '#ffffff',
        colorBorde: '#e11d48',
      },
      'mensaje-alerta': {
        colorFondo: '#e11d48',
        colorTexto: '#ffffff',
      },
    },
  },

  'hot-sale': {
    slug: 'hot-sale',
    name: 'Hot Sale',
    emoji: '⚡',
    badge: 'Mega Ofertas',
    description: 'Estética ardiente en rojo y naranja con chispas de fuego hiper-persuasivas.',
    themeColor: '#ea580c',
    accentColor: '#dc2626',
    bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
    bannerMessage: '⚡ HOT SALE EN VIVO: Descuentos bomba + Envíos express a todo el país',
    couponCode: 'HOTSALE',
    couponDiscount: '15% OFF',
    durationDays: 3,
    effect: 'fire-embers',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '⚡ OFERTAS BOMBA HOT SALE',
        subtitle: 'Precios especiales por tiempo limitado',
        endDate: endDateIso,
        colorClockBg: '#dc2626',
        colorWidgetBg: '#1c1917',
        colorTitle: '#ffffff',
        colorSubtitle: '#fdba74',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '⚡ HOT SALE OFICIAL • MEGA DESCUENTOS EN PRODUCTOS SELECCIONADOS',
          '🔥 APROVECHÁ HASTA 12 CUOTAS SIN INTERÉS',
          '🚀 ENVÍO RÁPIDO Y SEGURO A TODO EL PAÍS',
        ],
        colorFondo: '#c2410c',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '⚡ CUPÓN OFICIAL HOT SALE',
        subtexto: 'Copiá el código para un descuento extra en tu carrito',
        codigo: 'HOTSALE',
        badge: '15% OFF',
        bgColor: '#ffffff',
        borderColor: '#ea580c',
        textColor: '#1c1917',
        badgeBgColor: '#ffedd5',
        badgeTextColor: '#c2410c',
        botonBgColor: '#ea580c',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '⚡ ¡RULETA HOT SALE!',
        subtitulo: 'Girá y ganá beneficios exclusivos para tu compra de hoy',
        colorBoton: '#ea580c',
        colorRuletaPrincipal: '#ea580c',
        colorRuletaSecundario: '#dc2626',
        premios: [
          { texto: '15% OFF', codigoCupon: 'HOT15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'HOT10', esGanador: true },
          { texto: '5% OFF', codigoCupon: 'HOT5', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '20% OFF', codigoCupon: 'HOT20', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'SUPERHOT', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#ea580c',
        colorMonto: '#ea580c',
        textoFaltante: '⚡ Sumá {x} más para obtener {objetivo} en este Hot Sale',
        textoCumplido: '🎉 ¡Felicitaciones! {objetivo} conseguido en Hot Sale',
      },
      'comparador-marca': {
        bgColor: '#ffffff',
        borderColor: '#ea580c',
        textColor: '#1c1917',
        destacadoBgColor: '#ffedd5',
        destacadoTextColor: '#c2410c',
        checkColor: '#ea580c',
        crossColor: '#9ca3af',
      },
      'medios-pago': {
        bgColor: '#ffffff',
        borderColor: '#ea580c',
        textColor: '#1c1917',
      },
      'caja-opiniones': {
        colorFondo: '#fffbeb',
        colorTexto: '#1c1917',
        colorEstrellas: '#ea580c',
        colorBorde: '#fdba74',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#ffffff',
        colorTexto: '#1c1917',
        colorBorde: '#ea580c',
      },
      'mensaje-alerta': {
        colorFondo: '#ea580c',
        colorTexto: '#ffffff',
      },
    },
  },

  'cyber-monday': {
    slug: 'cyber-monday',
    name: 'Cyber Monday',
    emoji: '💻',
    badge: 'Tecno & Web',
    description: 'Estética futurista en tonos violeta y cian con chispas de luz de neón digital.',
    themeColor: '#7c3aed',
    accentColor: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
    bannerMessage: '💻 CYBER MONDAY: Beneficios online imperdibles + Envíos sin cargo',
    couponCode: 'CYBERMONDAY',
    couponDiscount: '15% OFF',
    durationDays: 3,
    effect: 'neon-sparkles',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '💻 CYBER MONDAY EXCLUSIVO',
        subtitle: 'Descuentos cibernéticos que terminan en:',
        endDate: endDateIso,
        colorClockBg: '#7c3aed',
        colorWidgetBg: '#0f172a',
        colorTitle: '#ffffff',
        colorSubtitle: '#a5f3fc',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '💻 CYBER MONDAY • COMPRÁ ONLINE CON BENEFICIOS ÚNICOS',
          '⚡ HASTA 6 CUOTAS SIN INTERÉS EN TODA LA TIENDA',
          '📦 DESPACHOS PRIORITARIOS EN 24 HORAS',
        ],
        colorFondo: '#4c1d95',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '💻 CUPÓN CYBER MONDAY',
        subtexto: 'Copiá y pegá el cupón digital en tu checkout',
        codigo: 'CYBERMONDAY',
        badge: '15% OFF',
        bgColor: '#ffffff',
        borderColor: '#7c3aed',
        textColor: '#0f172a',
        badgeBgColor: '#ede9fe',
        badgeTextColor: '#6d28d9',
        botonBgColor: '#7c3aed',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '💻 ¡RULETA CYBER MONDAY!',
        subtitulo: 'Probá tu suerte digital antes de que finalice el evento',
        colorBoton: '#7c3aed',
        colorRuletaPrincipal: '#7c3aed',
        colorRuletaSecundario: '#06b6d4',
        premios: [
          { texto: '15% OFF', codigoCupon: 'CYBER15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'CYBER10', esGanador: true },
          { texto: '20% OFF', codigoCupon: 'CYBER20', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '5% OFF', codigoCupon: 'CYBER5', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'PROMO_CYBER', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#7c3aed',
        colorMonto: '#7c3aed',
        textoFaltante: '💻 Te faltan {x} para alcanzar {objetivo}',
        textoCumplido: '🎉 ¡Meta Cyber lograda: {objetivo}!',
      },
      'comparador-marca': {
        bgColor: '#0f172a',
        borderColor: '#7c3aed',
        textColor: '#ffffff',
        destacadoBgColor: '#7c3aed25',
        destacadoTextColor: '#a5f3fc',
        checkColor: '#06b6d4',
        crossColor: '#475569',
      },
      'medios-pago': {
        bgColor: '#0f172a',
        borderColor: '#7c3aed',
        textColor: '#ffffff',
      },
      'caja-opiniones': {
        colorFondo: '#1e293b',
        colorTexto: '#ffffff',
        colorEstrellas: '#06b6d4',
        colorBorde: '#7c3aed',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#0f172a',
        colorTexto: '#ffffff',
        colorBorde: '#7c3aed',
      },
      'mensaje-alerta': {
        colorFondo: '#7c3aed',
        colorTexto: '#ffffff',
      },
    },
  },

  'navidad': {
    slug: 'navidad',
    name: 'Especial Navidad',
    emoji: '🎄',
    badge: 'Regalos & Fiestas',
    description: 'Estética festiva tradicional con copos de nieve animados cayendo en vivo.',
    themeColor: '#b91c1c',
    accentColor: '#15803d',
    bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #14532d 100%)',
    bannerMessage: '🎄 ESPECIAL NAVIDAD: Elegí tus regalos con anticipación y recibilos a tiempo',
    couponCode: 'NAVIDAD',
    couponDiscount: '15% OFF',
    durationDays: 10,
    effect: 'snow',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '🎄 OFERTAS NAVIDEÑAS',
        subtitle: 'Pedí tus regalos hoy para recibirlos antes del 24',
        endDate: endDateIso,
        colorClockBg: '#b91c1c',
        colorWidgetBg: '#064e3b',
        colorTitle: '#ffffff',
        colorSubtitle: '#fef08a',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '🎄 REGALÁ MEJOR ESTA NAVIDAD • PACKS Y REGALOS EXCLUSIVOS',
          '🎁 ENVÍOS ASEGURADOS ANTES DE NOCHEBUENA',
          '⭐ PAGÁ EN CUOTAS SIN INTERÉS CON TODAS LAS TARJETAS',
        ],
        colorFondo: '#b91c1c',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '🎁 CUPÓN REGALO DE NAVIDAD',
        subtexto: 'Un regalo especial de nuestra tienda para estas fiestas',
        codigo: 'NAVIDAD',
        badge: '15% OFF',
        bgColor: '#ffffff',
        borderColor: '#b91c1c',
        textColor: '#0f172a',
        badgeBgColor: '#fee2e2',
        badgeTextColor: '#b91c1c',
        botonBgColor: '#15803d',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '🎄 ¡RULETA NAVIDEÑA!',
        subtitulo: 'Descubrí qué sorpresa de Navidad tenemos para vos',
        colorBoton: '#b91c1c',
        colorRuletaPrincipal: '#b91c1c',
        colorRuletaSecundario: '#15803d',
        premios: [
          { texto: '15% OFF', codigoCupon: 'REGALO15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'NAVIDAD10', esGanador: true },
          { texto: '20% OFF', codigoCupon: 'PAPA_NOEL20', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '5% OFF', codigoCupon: 'FIESTAS5', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'NOCHEBUENA', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#15803d',
        colorMonto: '#b91c1c',
        textoFaltante: '🎄 Te faltan {x} para llevarte {objetivo} de regalo',
        textoCumplido: '🎁 ¡{objetivo} desbloqueado para tu arbolito!',
      },
      'comparador-marca': {
        bgColor: '#fffcfc',
        borderColor: '#b91c1c',
        textColor: '#064e3b',
        destacadoBgColor: '#fee2e2',
        destacadoTextColor: '#b91c1c',
        checkColor: '#15803d',
        crossColor: '#9ca3af',
      },
      'medios-pago': {
        bgColor: '#fffcfc',
        borderColor: '#15803d',
        textColor: '#064e3b',
      },
      'caja-opiniones': {
        colorFondo: '#f0fdf4',
        colorTexto: '#064e3b',
        colorEstrellas: '#fbbf24',
        colorBorde: '#b91c1c',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#fffcfc',
        colorTexto: '#064e3b',
        colorBorde: '#b91c1c',
      },
      'mensaje-alerta': {
        colorFondo: '#b91c1c',
        colorTexto: '#ffffff',
      },
    },
  },

  'dia-de-la-madre': {
    slug: 'dia-de-la-madre',
    name: 'Día de la Madre',
    emoji: '🌸',
    badge: 'Regalos para Mamá',
    description: 'Estética delicada en tonos rosa y magenta con corazones flotando con amor.',
    themeColor: '#db2777',
    accentColor: '#9d174d',
    bgGradient: 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
    bannerMessage: '🌸 DÍA DE LA MADRE: Sorprendé a mamá con el mejor regalo',
    couponCode: 'PARAMAMA',
    couponDiscount: '15% OFF',
    durationDays: 7,
    effect: 'hearts',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '🌸 ESPECIAL DÍA DE LA MADRE',
        subtitle: 'Comprá con tiempo y asegurá su sorpresa:',
        endDate: endDateIso,
        colorClockBg: '#db2777',
        colorWidgetBg: '#500724',
        colorTitle: '#ffffff',
        colorSubtitle: '#fbcfe8',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '🌸 EL REGALO PERFECTO PARA MAMÁ ESTÁ ACÁ',
          '🎁 PACKS Y COMBOS EXCLUSIVOS CON ENVÍO GRATIS',
          '💖 PAGÁ EN HASTA 6 CUOTAS SIN RECARGO',
        ],
        colorFondo: '#db2777',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '🌸 CUPÓN DÍA DE LA MADRE',
        subtexto: 'Aplicá el cupón especial para homenajearla',
        codigo: 'PARAMAMA',
        badge: '15% OFF',
        bgColor: '#ffffff',
        borderColor: '#db2777',
        textColor: '#0f172a',
        badgeBgColor: '#fce7f3',
        badgeTextColor: '#be185d',
        botonBgColor: '#db2777',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '🌸 ¡RULETA PARA MAMÁ!',
        subtitulo: 'Girá la ruleta y conseguí un descuento exclusivo en su regalo',
        colorBoton: '#db2777',
        colorRuletaPrincipal: '#db2777',
        colorRuletaSecundario: '#9d174d',
        premios: [
          { texto: '15% OFF', codigoCupon: 'MAMA15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'MAMA10', esGanador: true },
          { texto: '20% OFF', codigoCupon: 'SUPERMAMA', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '5% OFF', codigoCupon: 'MAMI5', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'REGALOMAMA', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#db2777',
        colorMonto: '#db2777',
        textoFaltante: '🌸 Te faltan {x} para sumar {objetivo} al regalo de mamá',
        textoCumplido: '💖 ¡{objetivo} listo para enviar!',
      },
      'comparador-marca': {
        bgColor: '#ffffff',
        borderColor: '#db2777',
        textColor: '#500724',
        destacadoBgColor: '#fce7f3',
        destacadoTextColor: '#db2777',
        checkColor: '#db2777',
        crossColor: '#9ca3af',
      },
      'medios-pago': {
        bgColor: '#ffffff',
        borderColor: '#db2777',
        textColor: '#500724',
      },
      'caja-opiniones': {
        colorFondo: '#fff5f7',
        colorTexto: '#500724',
        colorEstrellas: '#db2777',
        colorBorde: '#fbcfe8',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#ffffff',
        colorTexto: '#500724',
        colorBorde: '#db2777',
      },
      'mensaje-alerta': {
        colorFondo: '#db2777',
        colorTexto: '#ffffff',
      },
    },
  },

  'dia-del-padre': {
    slug: 'dia-del-padre',
    name: 'Día del Padre',
    emoji: '👔',
    badge: 'Regalos para Papá',
    description: 'Estética de gran elegancia en azul marino con confeti festivo azul flotante.',
    themeColor: '#1e40af',
    accentColor: '#0f172a',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    bannerMessage: '👔 DÍA DEL PADRE: El regalo que papá realmente quiere',
    couponCode: 'PARAPAPA',
    couponDiscount: '15% OFF',
    durationDays: 7,
    effect: 'confetti',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '👔 ESPECIAL DÍA DEL PADRE',
        subtitle: 'Asegurá el envío para su día:',
        endDate: endDateIso,
        colorClockBg: '#1e40af',
        colorWidgetBg: '#0f172a',
        colorTitle: '#ffffff',
        colorSubtitle: '#bfdbfe',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '👔 REGALOS DESTACADOS PARA EL DÍA DEL PADRE',
          '⚡ CUOTAS SIN INTERÉS Y ENVÍO RÁPIDO A TU DOMICILIO',
          '⭐ CALIDAD GARANTIZADA EN CADA PRODUCTO',
        ],
        colorFondo: '#1e3a8a',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '👔 CUPÓN DÍA DEL PADRE',
        subtexto: 'Copiá el código y aplicalo en el checkout',
        codigo: 'PARAPAPA',
        badge: '15% OFF',
        bgColor: '#ffffff',
        borderColor: '#1e40af',
        textColor: '#0f172a',
        badgeBgColor: '#dbeafe',
        badgeTextColor: '#1e40af',
        botonBgColor: '#1e40af',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '👔 ¡RULETA PARA PAPÁ!',
        subtitulo: 'Probá tu suerte y llevate un descuento para su regalo',
        colorBoton: '#1e40af',
        colorRuletaPrincipal: '#1e40af',
        colorRuletaSecundario: '#0f172a',
        premios: [
          { texto: '15% OFF', codigoCupon: 'PAPA15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'PAPA10', esGanador: true },
          { texto: '20% OFF', codigoCupon: 'SUPERPAPA', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '5% OFF', codigoCupon: 'PAPI5', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'REGALOPAPA', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#1e40af',
        colorMonto: '#1e40af',
        textoFaltante: '👔 Sumá {x} para obtener {objetivo} en el regalo de papá',
        textoCumplido: '🎉 ¡{objetivo} desbloqueado con éxito!',
      },
      'comparador-marca': {
        bgColor: '#ffffff',
        borderColor: '#1e40af',
        textColor: '#0f172a',
        destacadoBgColor: '#dbeafe',
        destacadoTextColor: '#1e40af',
        checkColor: '#1e40af',
        crossColor: '#9ca3af',
      },
      'medios-pago': {
        bgColor: '#ffffff',
        borderColor: '#1e40af',
        textColor: '#0f172a',
      },
      'caja-opiniones': {
        colorFondo: '#f8fafc',
        colorTexto: '#0f172a',
        colorEstrellas: '#1e40af',
        colorBorde: '#cbd5e1',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#ffffff',
        colorTexto: '#0f172a',
        colorBorde: '#1e40af',
      },
      'mensaje-alerta': {
        colorFondo: '#1e40af',
        colorTexto: '#ffffff',
      },
    },
  },

  'dia-del-nino': {
    slug: 'dia-del-nino',
    name: 'Día del Niño',
    emoji: '🎈',
    badge: 'Juegos & Alegría',
    description: 'Estética súper lúdica y colorida con globos inflados subiendo flotando.',
    themeColor: '#eab308',
    accentColor: '#9333ea',
    bgGradient: 'linear-gradient(135deg, #581c87 0%, #ca8a04 100%)',
    bannerMessage: '🎈 DÍA DE LAS INFANCIAS: Descuentos y regalos que sacan sonrisas',
    couponCode: 'INFANCIAS',
    couponDiscount: '15% OFF',
    durationDays: 7,
    effect: 'balloons',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '🎈 OFERTAS DÍA DEL NIÑO',
        subtitle: 'Promos especiales por tiempo limitado:',
        endDate: endDateIso,
        colorClockBg: '#9333ea',
        colorWidgetBg: '#3b0764',
        colorTitle: '#ffffff',
        colorSubtitle: '#fef08a',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '🎈 ESPECIAL DÍA DE LAS INFANCIAS • REGALÁ DIVERSIÓN Y ALEGRÍA',
          '🎁 ENVÍOS RÁPIDOS PARA QUE LLEGUEN A TIEMPO',
          '🎉 HASTA 6 CUOTAS SIN INTERÉS EN PRODUCTOS SELECCIONADOS',
        ],
        colorFondo: '#7e22ce',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '🎈 CUPÓN DÍA DEL NIÑO',
        subtexto: 'Aprovechá este descuento para sus regalos',
        codigo: 'INFANCIAS',
        badge: '15% OFF',
        bgColor: '#ffffff',
        borderColor: '#9333ea',
        textColor: '#0f172a',
        badgeBgColor: '#f3e8ff',
        badgeTextColor: '#7e22ce',
        botonBgColor: '#9333ea',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '🎈 ¡RULETA DE LA DIVERSIÓN!',
        subtitulo: 'Girá para ganar premios especiales para los más chicos',
        colorBoton: '#9333ea',
        colorRuletaPrincipal: '#9333ea',
        colorRuletaSecundario: '#eab308',
        premios: [
          { texto: '15% OFF', codigoCupon: 'KIDS15', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'KIDS10', esGanador: true },
          { texto: '20% OFF', codigoCupon: 'SUPERKIDS', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '5% OFF', codigoCupon: 'KIDS5', esGanador: true },
          { texto: '10% OFF', codigoCupon: 'SONRISAS', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#9333ea',
        colorMonto: '#9333ea',
        textoFaltante: '🎈 Te faltan {x} para ganar {objetivo}',
        textoCumplido: '🎉 ¡{objetivo} desbloqueado para festejar!',
      },
      'comparador-marca': {
        bgColor: '#ffffff',
        borderColor: '#9333ea',
        textColor: '#3b0764',
        destacadoBgColor: '#f3e8ff',
        destacadoTextColor: '#7e22ce',
        checkColor: '#eab308',
        crossColor: '#9ca3af',
      },
      'medios-pago': {
        bgColor: '#ffffff',
        borderColor: '#eab308',
        textColor: '#3b0764',
      },
      'caja-opiniones': {
        colorFondo: '#faf5ff',
        colorTexto: '#3b0764',
        colorEstrellas: '#eab308',
        colorBorde: '#d8b4fe',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#ffffff',
        colorTexto: '#3b0764',
        colorBorde: '#9333ea',
      },
      'mensaje-alerta': {
        colorFondo: '#9333ea',
        colorTexto: '#ffffff',
      },
    },
  },

  'liquidacion': {
    slug: 'liquidacion',
    name: 'Liquidación Total',
    emoji: '🏷️',
    badge: 'Últimas Unidades',
    description: 'Estética agresiva de clearance y sale con carteles retro de SALE cayendo suavemente.',
    themeColor: '#dc2626',
    accentColor: '#eab308',
    bgGradient: 'linear-gradient(135deg, #450a0a 0%, #991b1b 100%)',
    bannerMessage: '🏷️ LIQUIDACIÓN DE TEMPORADA: Últimos productos en stock al costo',
    couponCode: 'LIQUIDA',
    couponDiscount: '25% OFF',
    durationDays: 5,
    effect: 'sale-tags',
    patches: {
      'cuenta-regresiva': (endDateIso: string) => ({
        title: '🏷️ LIQUIDACIÓN DE TEMPORADA',
        subtitle: 'Últimos días para aprovechar precios de liquidación:',
        endDate: endDateIso,
        colorClockBg: '#dc2626',
        colorWidgetBg: '#18181b',
        colorTitle: '#ffffff',
        colorSubtitle: '#fef08a',
        colorNumbers: '#ffffff',
      }),
      'banner-deslizante': {
        mensajes: [
          '🏷️ LIQUIDACIÓN FINAL • HASTA 60% OFF EN ARTÍCULOS SELECCIONADOS',
          '⚡ ÚLTIMAS UNIDADES EN STOCK • NO VUELVEN A INGRESAR',
          '📦 ENVÍO INMEDIATO EN COMPRAS CONFIRMADAS',
        ],
        colorFondo: '#dc2626',
        colorTexto: '#ffffff',
        tipoFondo: 'solido',
      },
      'badge-cupon': {
        titulo: '🏷️ CUPÓN EXTRA DE LIQUIDACIÓN',
        subtexto: 'Sumá un descuento adicional a productos en oferta',
        codigo: 'LIQUIDA',
        badge: '25% OFF',
        bgColor: '#ffffff',
        borderColor: '#dc2626',
        textColor: '#0f172a',
        badgeBgColor: '#fee2e2',
        badgeTextColor: '#dc2626',
        botonBgColor: '#dc2626',
        botonTextColor: '#ffffff',
      },
      'ruleta-descuentos': {
        titulo: '🏷️ ¡RULETA DE LIQUIDACIÓN!',
        subtitulo: 'Girá antes de que se agoten los stocks remanentes',
        colorBoton: '#dc2626',
        colorRuletaPrincipal: '#dc2626',
        colorRuletaSecundario: '#eab308',
        premios: [
          { texto: '20% OFF', codigoCupon: 'SALE20', esGanador: true },
          { texto: '15% OFF', codigoCupon: 'SALE15', esGanador: true },
          { texto: '25% OFF', codigoCupon: 'MEGASALE', esGanador: true },
          { texto: 'Sigue Intentando 😢', codigoCupon: '', esGanador: false },
          { texto: '10% OFF', codigoCupon: 'SALE10', esGanador: true },
          { texto: '5% OFF', codigoCupon: 'OUTLET5', esGanador: true },
        ],
      },
      'barra-progreso': {
        colorBarraLlena: '#dc2626',
        colorMonto: '#dc2626',
        textoFaltante: '🏷️ Te faltan {x} para desbloquear {objetivo}',
        textoCumplido: '🔥 ¡{objetivo} alcanzado en Liquidación!',
      },
      'comparador-marca': {
        bgColor: '#ffffff',
        borderColor: '#dc2626',
        textColor: '#18181b',
        destacadoBgColor: '#fee2e2',
        destacadoTextColor: '#dc2626',
        checkColor: '#dc2626',
        crossColor: '#9ca3af',
      },
      'medios-pago': {
        bgColor: '#ffffff',
        borderColor: '#dc2626',
        textColor: '#18181b',
      },
      'caja-opiniones': {
        colorFondo: '#fffbeb',
        colorTexto: '#18181b',
        colorEstrellas: '#dc2626',
        colorBorde: '#fef08a',
        mostrarBorde: true,
      },
      'mensaje-garantia': {
        colorFondo: '#ffffff',
        colorTexto: '#18181b',
        colorBorde: '#dc2626',
      },
      'mensaje-alerta': {
        colorFondo: '#dc2626',
        colorTexto: '#ffffff',
      },
    },
  },
};

/* ═══════════════════════════════════════════
   HELPERS PÚBLICOS
═══════════════════════════════════════════ */
export function getCampaignPreset(slug: string): CampaignPreset | null {
  return CAMPAIGN_PRESETS[slug] || null;
}

export function getAllCampaignPresets(): CampaignPreset[] {
  return Object.values(CAMPAIGN_PRESETS);
}
