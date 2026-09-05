// lib/campaignPresets.ts

/* ═══════════════════════════════════════════
   TIPOS DE CAMPAÑAS Y PRESETS
═══════════════════════════════════════════ */

export interface CampaignWidgetPatch {
  widgetSlug: string;
  configPatch: Record<string, unknown>;
}

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
  patches: {
    'cuenta-regresiva': (endDateIso: string) => Record<string, unknown>;
    'banner-deslizante': Record<string, unknown>;
    'badge-cupon': Record<string, unknown>;
    'ruleta-descuentos': Record<string, unknown>;
    'barra-progreso': Record<string, unknown>;
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
  'black-friday': {
    slug: 'black-friday',
    name: 'Black Friday',
    emoji: '🔥',
    badge: 'Hasta 50% OFF',
    description: 'Estética Dark Premium con alto contraste para maximizar compras de impulso.',
    themeColor: '#000000',
    accentColor: '#e11d48',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
    bannerMessage: '🔥 BLACK FRIDAY: Hasta 50% OFF + Cuotas sin interés por tiempo limitado',
    couponCode: 'BLACKFRIDAY',
    couponDiscount: '20% OFF',
    durationDays: 4,
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
    },
  },

  'hot-sale': {
    slug: 'hot-sale',
    name: 'Hot Sale',
    emoji: '⚡',
    badge: 'Mega Ofertas',
    description: 'Estética ardiente en rojo y naranja con máxima urgencia visual.',
    themeColor: '#ea580c',
    accentColor: '#dc2626',
    bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
    bannerMessage: '⚡ HOT SALE EN VIVO: Descuentos bomba + Envíos express a todo el país',
    couponCode: 'HOTSALE',
    couponDiscount: '15% OFF',
    durationDays: 3,
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
    },
  },

  'cyber-monday': {
    slug: 'cyber-monday',
    name: 'Cyber Monday',
    emoji: '💻',
    badge: 'Tecno & Web',
    description: 'Estética futurista en tonos violeta y cian brillante.',
    themeColor: '#7c3aed',
    accentColor: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
    bannerMessage: '💻 CYBER MONDAY: Beneficios online imperdibles + Envíos sin cargo',
    couponCode: 'CYBERMONDAY',
    couponDiscount: '15% OFF',
    durationDays: 3,
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
    },
  },

  'navidad': {
    slug: 'navidad',
    name: 'Especial Navidad',
    emoji: '🎄',
    badge: 'Regalos & Fiestas',
    description: 'Estética festiva en rojo navideño, verde pino y detalles dorados.',
    themeColor: '#b91c1c',
    accentColor: '#15803d',
    bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #14532d 100%)',
    bannerMessage: '🎄 ESPECIAL NAVIDAD: Elegí tus regalos con anticipación y recibilos a tiempo',
    couponCode: 'NAVIDAD',
    couponDiscount: '15% OFF',
    durationDays: 10,
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
    },
  },

  'dia-de-la-madre': {
    slug: 'dia-de-la-madre',
    name: 'Día de la Madre',
    emoji: '🌸',
    badge: 'Regalos para Mamá',
    description: 'Estética delicada y cálida en tonos rosa elegante y magenta.',
    themeColor: '#db2777',
    accentColor: '#9d174d',
    bgGradient: 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
    bannerMessage: '🌸 DÍA DE LA MADRE: Sorprendé a mamá con el mejor regalo',
    couponCode: 'PARAMAMA',
    couponDiscount: '15% OFF',
    durationDays: 7,
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
    },
  },

  'dia-del-padre': {
    slug: 'dia-del-padre',
    name: 'Día del Padre',
    emoji: '👔',
    badge: 'Regalos para Papá',
    description: 'Estética sobria y sofisticada en azul marino y acero.',
    themeColor: '#1e40af',
    accentColor: '#0f172a',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    bannerMessage: '👔 DÍA DEL PADRE: El regalo que papá realmente quiere',
    couponCode: 'PARAPAPA',
    couponDiscount: '15% OFF',
    durationDays: 7,
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
    },
  },

  'dia-del-nino': {
    slug: 'dia-del-nino',
    name: 'Día del Niño',
    emoji: '🎈',
    badge: 'Juegos & Alegría',
    description: 'Estética colorida, divertida y alegre en amarillo y violeta.',
    themeColor: '#eab308',
    accentColor: '#9333ea',
    bgGradient: 'linear-gradient(135deg, #581c87 0%, #ca8a04 100%)',
    bannerMessage: '🎈 DÍA DE LAS INFANCIAS: Descuentos y regalos que sacan sonrisas',
    couponCode: 'INFANCIAS',
    couponDiscount: '15% OFF',
    durationDays: 7,
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
    },
  },

  'liquidacion': {
    slug: 'liquidacion',
    name: 'Liquidación Total',
    emoji: '🏷️',
    badge: 'Últimas Unidades',
    description: 'Estética de clearance / sale con alto impacto en amarillo y rojo.',
    themeColor: '#dc2626',
    accentColor: '#eab308',
    bgGradient: 'linear-gradient(135deg, #450a0a 0%, #991b1b 100%)',
    bannerMessage: '🏷️ LIQUIDACIÓN DE TEMPORADA: Últimos productos en stock al costo',
    couponCode: 'LIQUIDA',
    couponDiscount: '25% OFF',
    durationDays: 5,
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
