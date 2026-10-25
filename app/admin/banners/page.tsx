'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Star,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Bot,
  Globe,
  Mic,
  Gift,
  Crown,
  Maximize2,
  X,
  Copy,
  Check,
  Video,
  Instagram,
  Layout,
  Layers,
  Share2,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Split,
  Palette,
  Link2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  Lightbulb,
  Film,
  Image as ImageIcon,
  Hash
} from 'lucide-react';

// Official Isotype Logo Component (ONLY allowed in top-left corner)
const NevuxIsotype = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nvxRightGrad" x1="50" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="nvxDiagGrad" x1="20" y1="80" x2="80" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#6EE7B7" />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="16" height="60" rx="8" fill="#10B981" />
    <rect x="64" y="20" width="16" height="60" rx="8" fill="url(#nvxRightGrad)" />
    <path
      d="M28 24 L72 76"
      stroke="url(#nvxDiagGrad)"
      strokeWidth="16"
      strokeLinecap="round"
    />
  </svg>
);

const NevuxHeaderBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <NevuxIsotype size={30} />
    <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 18, letterSpacing: '0.05em', fontFamily: 'sans-serif' }}>
      NEVUX
    </span>
  </div>
);

// ===== DATA DEL PLAN SEMANAL =====
type DayPlan = {
  day: string;
  dayShort: string;
  focus: string;
  focusColor: string;
  time: string;
  format: string;
  formatIcon: React.ReactNode;
  title: string;
  subtitle: string;
  slides?: { num: number; type: string; content: string }[];
  reelScenes?: { time: string; scene: string; audio: string }[];
  stories: { num: number; content: string; sticker: string }[];
  caption: string;
  hashtags: string;
  audioSuggestion?: string;
  coverIdea?: string;
};

const WEEKLY_PLAN: DayPlan[] = [
  {
    day: 'LUNES',
    dayShort: 'Lun',
    focus: 'URGENCIA',
    focusColor: '#EF4444',
    time: '11:30 hs',
    format: 'Carrusel 5 slides (1080x1080)',
    formatIcon: <ImageIcon size={16} />,
    title: 'Tu tienda pierde ventas AHORA MISMO',
    subtitle: 'Conciencia del problema de conversión',
    slides: [
      {
        num: 1,
        type: 'HOOK',
        content: '"Tu Tiendanube recibe visitas pero nadie compra." Fondo #020a07, tipografía 900, logo NEVUX esquina superior izquierda. Subtexto: "Deslizá si tu conversión es menor al 1.5% 👉"'
      },
      {
        num: 2,
        type: 'PROBLEMA (SPIN-S)',
        content: '"El problema no es tu tráfico. Es lo que pasa cuando el cliente llega." Mockup UI denso: carrito abandonado con cronómetro, barra de carga lenta por 10 apps instaladas, contador de "5 visitas → 0 ventas".'
      },
      {
        num: 3,
        type: 'IMPLICACIÓN (SPIN-I)',
        content: '"Cada día sin optimizar, estás quemando plata en Ads." Dato visual: "Si gastás $50.000/día en Meta y convertís al 0.8%, estás tirando $46.000 a la basura." Gráfico de barras rojo vs verde.'
      },
      {
        num: 4,
        type: 'SOLUCIÓN (SPIN-N)',
        content: '"Nevux: 50 Widgets + 6 funciones de IA en 1 sola app." Mockup denso del panel Nevux con widgets activados: Barra de Envío Gratis, Contador de Urgencia, Reseñas con Estrellas, Chatbot IA, Búsqueda por Voz. Badge "7 días gratis".'
      },
      {
        num: 5,
        type: 'CTA',
        content: '"Instalá Nevux hoy y empezá a recuperar ventas esta semana." Botón verde #10B981: "PROBAR 7 DÍAS GRATIS". Slogan oficial abajo. Sin precios.'
      }
    ],
    stories: [
      { num: 1, content: '"¿Cuántas visitas tuvo tu tienda ayer?"', sticker: '📊 Encuesta: "Muchas" / "Pocas"' },
      { num: 2, content: '"¿Y cuántas de esas visitas se convirtieron en compras?" Texto: "Si la respuesta te duele, mirá la siguiente."', sticker: '😬 Slider de emoji' },
      { num: 3, content: 'Screen recording rápido (5s) activando 3 widgets de Nevux en una Tiendanube real. Texto: "Esto toma 2 minutos y cambia todo."', sticker: '🔗 Link a App Store' },
      { num: 4, content: '"7 días gratis. Sin tarjeta. Sin compromiso." Logo NEVUX arriba-izquierda.', sticker: '🔗 Sticker de enlace' }
    ],
    caption: `🔴 Tu Tiendanube tiene un problema que no se ve en las métricas de Meta.

(Problema) Recibís visitas todos los días. Los Ads funcionan. La gente llega a tu tienda. Pero el carrito queda abandonado, el checkout no se completa y la conversión no pasa del 1%.

(Agitación) ¿Sabés cuánto te cuesta eso? Si invertís en tráfico y tu tienda no convierte, estás pagando dos veces: la publicidad Y la venta perdida. Y lo peor: cada app extra que instalás para "solucionarlo" hace tu tienda más lenta y aleja más clientes.

(Solución) Nevux reemplaza todo eso con 50 Widgets de alta conversión + 6 funciones de IA en una sola app liviana. Envío gratis, urgencia, reseñas, chatbot, búsqueda por voz... todo en 2 minutos.

✅ 7 días gratis sin tarjeta
✅ Instalación en 1 clic desde la App Store de Tiendanube
✅ Sin tocar código

👉 Comentá "WIDGET" y te mando el link directo por DM.`,
    hashtags: '#Tiendanube #Ecommerce #VentasOnline #Nevux #Widgets #ConversionRate #TiendaOnline #Emprendedores #MarketingDigital #Nuvemshop'
  },
  {
    day: 'MARTES',
    dayShort: 'Mar',
    focus: 'PRUEBA SOCIAL',
    focusColor: '#F59E0B',
    time: '19:30 hs',
    format: 'Reel 30-45s (9:16, 1080x1920)',
    formatIcon: <Film size={16} />,
    title: 'Lo que pasa cuando activás Nevux en 24hs',
    subtitle: 'Demostrar resultados reales con before/after',
    reelScenes: [
      { time: '0-3s', scene: 'GANCHO: Pantalla de Tiendanube con 0 ventas. Zoom dramático al número.', audio: 'Voz: "Ayer esta tienda hizo 0 ventas. Hoy hizo 12."' },
      { time: '3-10s', scene: 'ANTES: Panel de Tiendanube con 8 apps instaladas, velocidad de carga lenta (3.2s).', audio: 'Voz: "Tenía 8 apps que la hacían lenta y un carrito abandonado del 78%."' },
      { time: '10-20s', scene: 'DESPUÉS: Instalación de Nevux en 1 clic. Activación rápida de: Barra de Envío Gratis, Temporizador de Urgencia, Chatbot IA, Reseñas con Fotos.', audio: 'Voz: "Instaló Nevux, activó 4 widgets en 2 minutos y eliminó las otras apps."' },
      { time: '20-30s', scene: 'RESULTADO: Dashboard con conversión subiendo de 0.8% a 2.1%. Notificaciones de ventas entrando.', audio: 'Voz: "En 24 horas la conversión saltó al 2.1%. Sin gastar un peso más en Ads."' },
      { time: '30-40s', scene: 'CTA: Logo NEVUX arriba-izquierda. "50 Widgets + 6 funciones de IA. 7 días gratis."', audio: 'Voz: "Probalo gratis 7 días en tu Tiendanube. Link en bio."' }
    ],
    audioSuggestion: 'Trending audio de "before/after" o beat lo-fi con transición fuerte en el segundo 10.',
    coverIdea: 'Texto grande "0 → 12 VENTAS EN 24HS" sobre fondo #020a07 con mockup de dashboard Nevux.',
    stories: [
      { num: 1, content: '"¿Cuál es tu tasa de conversión actual?"', sticker: '📊 Encuesta: "< 1%" / "1-2%" / "> 2%"' },
      { num: 2, content: 'Repost del Reel con texto: "Mirá lo que pasa en 24hs con Nevux activado 👆"', sticker: '🔗 Link al reel' },
      { num: 3, content: '"¿Querés que te ayude a configurar los widgets para tu nicho?"', sticker: '💬 Cajita de preguntas: "Contame tu nicho"' }
    ],
    caption: `⚡ De 0 a 12 ventas en 24 horas. Sin cambiar la tienda. Sin gastar más en Ads.

(Atención) Esta tienda de Tiendanube tenía tráfico pero no convertía. El problema: 8 apps que la hacían lenta y ningún elemento de urgencia ni confianza.

(Interés) Instaló Nevux, activó 4 widgets estratégicos (Envío Gratis, Urgencia, Chatbot IA y Reseñas) y eliminó el resto de apps.

(Deseo) Resultado: la conversión saltó de 0.8% a 2.1% en un día. El carrito abandonado bajó un 34%. Y la tienda carga más rápido que antes.

(Acción) Vos podés hacer lo mismo en 2 minutos.

🟢 7 días gratis
🟢 50 Widgets + 6 funciones de IA
🟢 Sin tarjeta de crédito

👉 Tocá el link en bio o comentá "RESULTADOS" y te lo mando.`,
    hashtags: '#Tiendanube #EcommerceArgentina #ConversionRate #Nevux #VentasOnline #CarritoAbandonado #MarketingDigital #TiendaOnline'
  },
  {
    day: 'MIÉRCOLES',
    dayShort: 'Mié',
    focus: 'FIDELIZACIÓN',
    focusColor: '#10B981',
    time: '11:30 hs',
    format: 'Carrusel 6 slides (1080x1080)',
    formatIcon: <ImageIcon size={16} />,
    title: 'Cuantos más meses usás Nevux, más ganás',
    subtitle: 'Retención + Recompensas por Fidelidad',
    slides: [
      {
        num: 1,
        type: 'HOOK',
        content: '"La mayoría de apps de Tiendanube te cobran y ya. Nevux te recompensa." Logo NEVUX arriba-izquierda. Fondo #020a07.'
      },
      {
        num: 2,
        type: 'CONTEXTO',
        content: '"Cuantos más meses usás Nevux, más ganás." Subtítulo: "Desbloqueá beneficios exclusivos que ninguna otra tienda va a tener." Icono de regalo verde.'
      },
      {
        num: 3,
        type: 'MES 3',
        content: '🎁 Mes 3 · Recompensa. "Desbloqueás widgets premium exclusivos + 1 widget personalizado único que solo vas a tener vos." Mockup de un widget custom con badge "EXCLUSIVO".'
      },
      {
        num: 4,
        type: 'MES 6',
        content: '🏆 Mes 6 · Elite. "Más widgets personalizados hechos a medida + descuentos exclusivos en tu suscripción." Mockup de panel con badge "ELITE" dorado.'
      },
      {
        num: 5,
        type: 'MES 12+',
        content: '👑 Mes 12+ · VIP. "Beneficios VIP, widgets únicos diseñados 100% para tu tienda, y acceso anticipado a features nuevas." Mockup con badge "VIP" brillante y lista de features futuras (Recomendaciones IA, Analytics ROI, A/B Testing).'
      },
      {
        num: 6,
        type: 'CTA',
        content: '"Empezá tu camino hoy. El Mes 3 llega más rápido de lo que pensás." Botón #10B981: "ACTIVAR 7 DÍAS GRATIS". Slogan oficial.'
      }
    ],
    stories: [
      { num: 1, content: '"¿Hace cuánto usás la misma app de widgets?"', sticker: '📊 Encuesta: "< 1 mes" / "1-6 meses" / "+6 meses"' },
      { num: 2, content: '"¿Y qué te dio a cambio además de cobrarte?"', sticker: '😐 Slider de emoji (cara triste a feliz)' },
      { num: 3, content: 'Infografía rápida: Mes 3 → Mes 6 → Mes 12+ con los beneficios de Nevux.', sticker: '🔗 Link a App Store' },
      { num: 4, content: '"Tu competencia ya está desbloqueando widgets que vos no tenés."', sticker: '🔗 Sticker de enlace' }
    ],
    caption: `🎁 ¿Tu app de widgets te recompensa por quedarte? La nuestra sí.

(Problema) La mayoría de apps para Tiendanube te cobran todos los meses lo mismo y nunca te dan nada extra. Sos un número más en su base de datos.

(Agitación) Mientras tanto, tu tienda usa los mismos widgets genéricos que miles de tiendas más. Sin diferenciación. Sin ventajas competitivas. Sin nada que te haga especial.

(Solución) En Nevux creamos las Recompensas por Fidelidad: un sistema real donde cuanto más tiempo usás la plataforma, más beneficios exclusivos desbloqueás:

🎁 Mes 3: Widgets premium + 1 widget personalizado único para tu tienda.
🏆 Mes 6: Widgets hechos a medida + descuentos en tu suscripción.
👑 Mes 12+: VIP total, widgets 100% custom y acceso anticipado a IA y Analytics.

Y todo empieza con 7 días gratis. Sin tarjeta.

👉 Comentá "FIDELIDAD" y te cuento cómo funciona.`,
    hashtags: '#Tiendanube #Nevux #Ecommerce #Fidelizacion #Widgets #TiendaOnline #Emprendedores #MarketingDigital #Nuvemshop'
  },
  {
    day: 'JUEVES',
    dayShort: 'Jue',
    focus: 'FEATURES IA',
    focusColor: '#3B82F6',
    time: '19:30 hs',
    format: 'Reel 45-60s (9:16)',
    formatIcon: <Film size={16} />,
    title: '6 funciones de IA que tu Tiendanube no tiene (y debería)',
    subtitle: 'Diferenciación tecnológica frente a la competencia',
    reelScenes: [
      { time: '0-3s', scene: 'GANCHO: Pantalla negra con texto verde gigante: "TU TIENDA NO TIENE IA. TU COMPETENCIA SÍ."', audio: 'Sonido de alerta/glitch.' },
      { time: '3-12s', scene: 'Feature 1-2: Demo rápida de Búsqueda por Voz IA (cliente hablando → productos apareciendo) + Chatbot IA respondiendo preguntas de envío.', audio: 'Voz: "Búsqueda por Voz que entiende modismos argentinos y Chatbot que responde 24/7."' },
      { time: '12-22s', scene: 'Feature 3-4: Recomendaciones IA (productos sugeridos según comportamiento) + Traducción automática ES/PT.', audio: 'Voz: "Recomendaciones inteligentes que suben el ticket promedio y traducción automática si vendés a Brasil."' },
      { time: '22-32s', scene: 'Feature 5-6: Generador de descripciones IA + Análisis de sentimiento en reseñas.', audio: 'Voz: "Descripciones de producto con IA y análisis automático de lo que dicen tus clientes."' },
      { time: '32-45s', scene: 'CTA: Mockup denso del panel Nevux con las 6 funciones activas. "50 Widgets + 6 IA. Todo en 1 app."', audio: 'Voz: "Todo esto en una sola app. 7 días gratis en tu Tiendanube. Link en bio."' }
    ],
    audioSuggestion: 'Beat tech/futurista con drops en cada feature.',
    coverIdea: '"6 FUNCIONES DE IA PARA TU TIENDANUBE" con íconos de cada feature sobre fondo #020a07.',
    stories: [
      { num: 1, content: '"¿Tu Tiendanube tiene Inteligencia Artificial?"', sticker: '📊 Encuesta: "Sí" / "No" / "¿Qué es eso?"' },
      { num: 2, content: '"La Búsqueda por Voz IA de Nevux entiende esto:" → Audio de alguien diciendo "zapatillas negras talle 42 para correr" → resultados instantáneos.', sticker: '🤯 Emoji slider' },
      { num: 3, content: '"El Chatbot IA responde esto a las 3AM:" → Mockup de chat respondiendo "¿Hacen envíos a Córdoba?" automáticamente.', sticker: '🔥 Emoji slider' },
      { num: 4, content: '"Y esto es solo 2 de las 6 funciones de IA."', sticker: '🔗 Link a App Store' },
      { num: 5, content: '"¿Cuál te gustaría probar primero?"', sticker: '💬 Cajita de preguntas' }
    ],
    caption: `🤖 Tu Tiendanube tiene 0 funciones de IA. Tu competencia ya tiene 6.

(Atención) Mientras vos respondés mensajes a las 11 de la noche y tus clientes no encuentran lo que buscan, otras tiendas ya tienen IA trabajando 24/7.

(Interés) Nevux incluye 6 funciones de Inteligencia Artificial que se activan en 1 clic:

🎙️ Búsqueda por Voz (entiende modismos locales)
💬 Chatbot IA (responde 24/7 sin que hagas nada)
🧠 Recomendaciones inteligentes (sube el ticket promedio)
🌐 Traducción automática ES/PT (vendé a Brasil)
✍️ Generador de descripciones IA
📊 Análisis de sentimiento en reseñas

(Deseo) Todo esto + 50 Widgets de conversión en una sola app liviana. Sin tocar código. Sin ralentizar tu tienda.

(Acción) 7 días gratis. Sin tarjeta de crédito.

👉 Comentá "IA" y te mando el acceso directo.`,
    hashtags: '#InteligenciaArtificial #Tiendanube #Nevux #Ecommerce #IA #Chatbot #VentasOnline #MarketingDigital #Nuvemshop'
  },
  {
    day: 'VIERNES',
    dayShort: 'Vie',
    focus: 'DEMO / TUTORIAL',
    focusColor: '#8B5CF6',
    time: '11:30 hs',
    format: 'Reel Tutorial 60s (9:16)',
    formatIcon: <Film size={16} />,
    title: 'Configurá Nevux en 2 minutos (paso a paso)',
    subtitle: 'Reducir fricción de instalación',
    reelScenes: [
      { time: '0-3s', scene: 'GANCHO: "Te apuesto a que no instalás esto en menos de 2 minutos."', audio: 'Sonido de cronómetro.' },
      { time: '3-15s', scene: 'PASO 1: Ir a App Store de Tiendanube → Buscar "Nevux" → Clic en "Instalar".', audio: 'Voz: "Paso 1: Buscá Nevux en la App Store de Tiendanube e instalalo. 1 clic."' },
      { time: '15-25s', scene: 'PASO 2: Panel de Nevux cargando → Activar "Barra de Envío Gratis" → Preview en tienda.', audio: 'Voz: "Paso 2: Activá la Barra de Envío Gratis. Ya está apareciendo en tu tienda."' },
      { time: '25-35s', scene: 'PASO 3: Activar "Contador de Urgencia" + "Reseñas con Estrellas" + "Chatbot IA".', audio: 'Voz: "Paso 3: Activá Urgencia, Reseñas y el Chatbot IA. Todo sin código."' },
      { time: '35-50s', scene: 'PASO 4: Vista de la tienda real con los 4 widgets funcionando. Cliente agregando al carrito.', audio: 'Voz: "Listo. Tu tienda ya tiene 4 widgets de alta conversión funcionando en tiempo real."' },
      { time: '50-60s', scene: 'CTA: "50 Widgets + 6 IA. 7 días gratis." Logo NEVUX arriba-izquierda.', audio: 'Voz: "Y eso es solo el 8% de lo que podés hacer. Probalo gratis 7 días."' }
    ],
    audioSuggestion: 'Lo-fi chill con transiciones limpias.',
    coverIdea: '"NEVUX EN 2 MINUTOS ⏱️" con captura del panel de widgets.',
    stories: [
      { num: 1, content: '"¿Cuánto tardás en configurar una app nueva en tu Tiendanube?"', sticker: '📊 Encuesta: "Minutos" / "Horas" / "Días 😅"' },
      { num: 2, content: 'Repost del Reel con texto: "Nevux se instala más rápido de lo que tardás en leer esto."', sticker: '🔗 Link al reel' },
      { num: 3, content: '"¿Qué widget activarías primero?" Opciones visuales: Envío Gratis / Urgencia / Chatbot / Reseñas.', sticker: '📊 Encuesta de 4 opciones' },
      { num: 4, content: '"Empezá ahora. 7 días gratis."', sticker: '🔗 Sticker de enlace' }
    ],
    caption: `⏱️ 2 minutos. Eso es todo lo que necesitás para duplicar la conversión de tu Tiendanube.

(Atención) No necesitás programador. No necesitás diseñador. No necesitás rehacer tu tienda.

(Interés) En este video te muestro paso a paso cómo instalar Nevux y activar 4 widgets de alta conversión en menos de 120 segundos:

1️⃣ Instalá desde la App Store de Tiendanube
2️⃣ Activá la Barra de Envío Gratis
3️⃣ Sumá Urgencia + Reseñas + Chatbot IA
4️⃣ Mirá cómo tu tienda empieza a convertir más

(Deseo) Y eso es solo 4 de los 50 Widgets + 6 funciones de IA que tenés disponibles.

(Acción) 7 días gratis. Sin tarjeta. Sin compromiso.

👉 Guardá este reel para cuando tengas 2 minutos libres. O hacelo ahora: link en bio.`,
    hashtags: '#Tiendanube #Nevux #Tutorial #Ecommerce #Widgets #VentasOnline #ConversionRate #MarketingDigital #Setup'
  },
  {
    day: 'SÁBADO',
    dayShort: 'Sáb',
    focus: 'VENTAS EN VIVO',
    focusColor: '#EC4899',
    time: '19:30 hs',
    format: 'Solo Stories (5 stories, sin post de feed)',
    formatIcon: <Share2 size={16} />,
    title: 'Ventas en tiempo real + Interacción con la audiencia',
    subtitle: 'Engagement en el pico de compras del finde',
    stories: [
      { num: 1, content: '"Sábado a la noche. Tu tienda está abierta. ¿Está vendiendo?" Fondo #020a07 con mockup de notificaciones de venta.', sticker: '📊 Encuesta: "Sí, a full 🔥" / "Meh... 😐" / "Nada 🥲"' },
      { num: 2, content: '"¿Sabías que el sábado a la noche es el momento de MAYOR tráfico en ecommerce en Argentina?" Dato visual con gráfico simple.', sticker: '🤯 Emoji slider' },
      { num: 3, content: '"Si tu tienda no tiene urgencia ni confianza activadas, esos visitantes se van sin comprar." Mockup: widget de Temporizador de Urgencia + Reseñas activados.', sticker: '🔗 Link a App Store' },
      { num: 4, content: '"¿Qué problema tiene tu tienda hoy?"', sticker: '💬 Cajita de preguntas: "Contame y te digo qué widget lo resuelve"' },
      { num: 5, content: '"Mientras tanto, las tiendas con Nevux están haciendo esto:" → Mockup de dashboard con ventas en tiempo real. "7 días gratis, probalo este finde."', sticker: '🔗 Sticker de enlace' }
    ],
    caption: `(Solo stories, sin post en feed)

Copy sugerido para Story destacada guardada:
"El sábado a la noche tu competencia está vendiendo. ¿Vos? Instalá Nevux en 2 minutos y empezá a convertir este mismo finde. 7 días gratis."`,
    hashtags: '(No aplica - solo stories)'
  },
  {
    day: 'DOMINGO',
    dayShort: 'Dom',
    focus: 'REFLEXIÓN + PLANIFICACIÓN',
    focusColor: '#06B6D4',
    time: '11:30 hs',
    format: 'Carrusel 4 slides (1080x1080) + Stories',
    formatIcon: <ImageIcon size={16} />,
    title: 'Arrancá la semana con tu tienda optimizada',
    subtitle: 'Planificación + Diferenciador Nevux',
    slides: [
      {
        num: 1,
        type: 'HOOK',
        content: '"Domingo. Mañana empieza una nueva semana de ventas. ¿Tu tienda está lista?" Logo NEVUX arriba-izquierda. Fondo #020a07.'
      },
      {
        num: 2,
        type: 'REFLEXIÓN',
        content: '"La semana pasada recibiste X visitas. ¿Cuántas se convirtieron?" Mockup de analytics con números en rojo (baja conversión) vs verde (con Nevux). Texto: "El 98% de las tiendas Tiendanube convierten menos del 1.5%."'
      },
      {
        num: 3,
        type: 'DIFERENCIADOR',
        content: '"¿Por qué Nevux y no otra app?" Lista visual densa: ✅ 50 Widgets (no 5) ✅ 6 Funciones de IA (no 0) ✅ 1 sola app (no 10) ✅ Recompensas por Fidelidad (nadie más) ✅ Lo que se viene: A/B Testing, Analytics ROI, Recomendaciones IA.'
      },
      {
        num: 4,
        type: 'CTA',
        content: '"Empezá la semana con tu tienda optimizada." Botón #10B981: "PROBAR 7 DÍAS GRATIS". Slogan oficial.'
      }
    ],
    stories: [
      { num: 1, content: '"Domingo de planificación 📋 ¿Ya tenés tu estrategia de la semana?"', sticker: '📊 Encuesta: "Sí, todo listo 💪" / "Todavía no 😅"' },
      { num: 2, content: '"Un tip rápido: activá el widget de Envío Gratis antes del lunes. Es el que más impacto tiene en conversión según nuestros datos."', sticker: '💡 Emoji slider' },
      { num: 3, content: '"¿Qué te frenó esta semana para optimizar tu tienda?"', sticker: '💬 Cajita de preguntas' },
      { num: 4, content: '"Arrancá mañana con Nevux activo. 7 días gratis. Tu yo del viernes te lo va a agradecer."', sticker: '🔗 Sticker de enlace' }
    ],
    caption: `📋 Domingo: el día que separa a las tiendas que venden de las que solo reciben visitas.

(Problema) Mañana arranca una nueva semana. Vas a invertir en Ads, en contenido, en tráfico. Pero si tu tienda no convierte, todo ese esfuerzo se va por la borda.

(Agitación) La semana pasada probablemente recibiste cientos de visitas. ¿Cuántas compraron? Si la respuesta es "pocas", el problema no es el tráfico. Es la experiencia de compra.

(Solución) Esta semana puede ser diferente. Nevux te da 50 Widgets + 6 funciones de IA para que cada visitante tenga razones para comprar: urgencia, confianza, envío gratis, chatbot, reseñas y más.

Todo en 1 app. Todo en 2 minutos. Todo con 7 días gratis.

👉 Comentá "SEMANA" y arrancamos mañana juntos.`,
    hashtags: '#Tiendanube #Nevux #Ecommerce #Planificacion #VentasOnline #MarketingDigital #ConversionRate #Emprendedores #DomingoDePlanificacion'
  }
];

// ===== COMPONENTE DÍA EXPANDIBLE =====
const DayCard = ({ plan, isOpen, onToggle }: { plan: DayPlan; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div style={{ backgroundColor: '#0B1512', border: `1px solid ${isOpen ? plan.focusColor : '#1F2937'}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s' }}>
      {/* Header del día (clickeable) */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px 24px',
          backgroundColor: 'transparent',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          color: '#FFFFFF',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <div style={{
            backgroundColor: plan.focusColor,
            color: '#FFFFFF',
            width: 52,
            height: 52,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 14,
            flexShrink: 0
          }}>
            {plan.dayShort.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: plan.focusColor, letterSpacing: '0.05em' }}>
                {plan.day} · {plan.focus}
              </span>
              <span style={{ fontSize: 11, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={11} /> {plan.time}
              </span>
              <span style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, backgroundColor: '#020a07', padding: '2px 8px', borderRadius: 4 }}>
                {plan.formatIcon} {plan.format}
              </span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {plan.title}
            </h3>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0 0' }}>
              {plan.subtitle}
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={22} color="#9CA3AF" /> : <ChevronDown size={22} color="#9CA3AF" />}
      </button>

      {/* Contenido expandido */}
      {isOpen && (
        <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: 20, borderTop: '1px solid #1F2937' }}>
          
          {/* SLIDES del carrusel (si aplica) */}
          {plan.slides && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Layers size={16} color={plan.focusColor} />
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.05em' }}>
                  GUIÓN DEL CARRUSEL ({plan.slides.length} SLIDES)
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.slides.map((slide) => (
                  <div key={slide.num} style={{ backgroundColor: '#020a07', borderLeft: `3px solid ${plan.focusColor}`, padding: '12px 16px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ backgroundColor: plan.focusColor, color: '#FFFFFF', fontSize: 11, fontWeight: 900, padding: '2px 8px', borderRadius: 4 }}>
                        SLIDE {slide.num}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#D1D5DB', letterSpacing: '0.05em' }}>
                        {slide.type}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB', lineHeight: 1.5 }}>
                      {slide.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REEL SCENES (si aplica) */}
          {plan.reelScenes && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Film size={16} color={plan.focusColor} />
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.05em' }}>
                  GUIÓN DEL REEL (ESCENA POR ESCENA)
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.reelScenes.map((scene, idx) => (
                  <div key={idx} style={{ backgroundColor: '#020a07', borderLeft: `3px solid ${plan.focusColor}`, padding: '12px 16px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ backgroundColor: plan.focusColor, color: '#FFFFFF', fontSize: 11, fontWeight: 900, padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
                        {scene.time}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#E5E7EB', lineHeight: 1.5 }}>
                      <strong style={{ color: '#FFFFFF' }}>Escena:</strong> {scene.scene}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF', lineHeight: 1.5, fontStyle: 'italic' }}>
                      🎙️ {scene.audio}
                    </p>
                  </div>
                ))}
              </div>

              {plan.audioSuggestion && (
                <div style={{ marginTop: 12, backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1F2937' }}>
                  <div style={{ fontSize: 11, color: plan.focusColor, fontWeight: 800, marginBottom: 4 }}>🎵 AUDIO SUGERIDO</div>
                  <p style={{ margin: 0, fontSize: 12, color: '#D1D5DB' }}>{plan.audioSuggestion}</p>
                </div>
              )}

              {plan.coverIdea && (
                <div style={{ marginTop: 8, backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1F2937' }}>
                  <div style={{ fontSize: 11, color: plan.focusColor, fontWeight: 800, marginBottom: 4 }}>🖼️ PORTADA SUGERIDA</div>
                  <p style={{ margin: 0, fontSize: 12, color: '#D1D5DB' }}>{plan.coverIdea}</p>
                </div>
              )}
            </div>
          )}

          {/* SECUENCIA DE STORIES */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Share2 size={16} color={plan.focusColor} />
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.05em' }}>
                SECUENCIA DE STORIES ({plan.stories.length})
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plan.stories.map((story) => (
                <div key={story.num} style={{ backgroundColor: '#020a07', padding: '10px 14px', borderRadius: 8, border: '1px solid #1F2937' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ backgroundColor: '#111827', color: plan.focusColor, fontSize: 11, fontWeight: 900, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
                      ST {story.num}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: 13, color: '#E5E7EB', lineHeight: 1.5 }}>
                        {story.content}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>
                        {story.sticker}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COPY / CAPTION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MessageCircle size={16} color={plan.focusColor} />
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.05em' }}>
                COPY / CAPTION
              </h4>
            </div>
            <div style={{ backgroundColor: '#020a07', padding: 16, borderRadius: 10, border: '1px solid #1F2937' }}>
              <pre style={{
                margin: 0,
                fontSize: 13,
                color: '#E5E7EB',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit'
              }}>
                {plan.caption}
              </pre>
            </div>
          </div>

          {/* HASHTAGS */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Hash size={16} color={plan.focusColor} />
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.05em' }}>
                HASHTAGS ESTRATÉGICOS
              </h4>
            </div>
            <div style={{ backgroundColor: '#020a07', padding: '12px 16px', borderRadius: 10, border: '1px solid #1F2937' }}>
              <p style={{ margin: 0, fontSize: 12, color: plan.focusColor, lineHeight: 1.6 }}>
                {plan.hashtags}
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default function MarketingAssetsPage() {
  const [activeTab, setActiveTab] = useState<'meta' | 'appstore' | 'instagram'>('meta');
  const [fullscreenBanner, setFullscreenBanner] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<string | null>('LUNES');

  return (
    <div style={{ backgroundColor: '#020a07', color: '#F3F4F6', minHeight: '100vh', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Admin */}
      <div style={{ maxWidth: 1280, margin: '0 auto 32px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <NevuxHeaderBrand />
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              RECOMPENSAS Y BANNERS OFICIALES 2025
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            Meta Ads & Banners Tiendanube / Nuvemshop
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>
            Slogan Oficial: <strong style={{ color: '#10B981' }}>"50 Widgets + 6 funciones para impulsar tu Tiendanube"</strong>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#0B1512', padding: 4, borderRadius: 12, border: '1px solid #1F2937' }}>
          <button
            onClick={() => setActiveTab('meta')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === 'meta' ? '#10B981' : 'transparent',
              color: activeTab === 'meta' ? '#000000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Video size={16} /> Meta Ads Master
          </button>
          <button
            onClick={() => setActiveTab('appstore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === 'appstore' ? '#10B981' : 'transparent',
              color: activeTab === 'appstore' ? '#000000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Layout size={16} /> Banners Tiendanube (16:9)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: activeTab === 'instagram' ? '#10B981' : 'transparent',
              color: activeTab === 'instagram' ? '#000000' : '#9CA3AF',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Instagram size={16} /> Plan Semanal Instagram
          </button>
        </div>
      </div>

      {/* TAB 1: META ADS MASTER CAMPAIGN */}
      {activeTab === 'meta' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Section: Video Script 60s & Story Ad Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            
            {/* Script Breakdown Column */}
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                  GUIÓN VIDEO REELS / STORIES (60s)
                </span>
                <span style={{ color: '#6B7280', fontSize: 12 }}>Sin precios • Sincronizado con App</span>
              </div>
              
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
                Meta Ad Script: "Recompensas por Fidelidad + 50 Widgets & 6 IA"
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #10B981' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 4 }}>00:00 - 00:05 | HOOK (INTERRUPCIÓN)</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Si tenés una Tiendanube y tus visitas no se convierten en compras, el problema no es tu tráfico... es tu tasa de conversión."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Screen recording rápido cambiando widgets y compras saltando en vivo.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #F59E0B' }}>
                  <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 800, marginBottom: 4 }}>00:05 - 00:15 | EL PROBLEMA</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Instalar 10 aplicaciones distintas para envíos, reseñas y contadores enlentece tu tienda y te cuesta una fortuna todos los meses."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Muestra de panel con múltiples apps abiertas al mismo tiempo.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #10B981' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 4 }}>00:15 - 00:28 | LA SOLUCIÓN NEVUX</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Nevux reúne 50 Widgets de alta conversión + 6 funciones de Inteligencia Artificial en una sola app para tu Tiendanube."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Vista rápida activando Envíos Gratis, Reseñas, Búsqueda por Voz y Chatbot IA.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #EC4899' }}>
                  <div style={{ fontSize: 11, color: '#EC4899', fontWeight: 800, marginBottom: 4 }}>00:28 - 00:48 | RECOMPENSAS POR FIDELIDAD</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Y además, cuanto más tiempo usás Nevux, más ganás:<br />• Al Mes 3: Desbloqueás widgets premium y 1 widget personalizado único.<br />• Al Mes 6: Widgets hechos a medida + descuentos exclusivos.<br />• Al Mes 12: Beneficios VIP y acceso anticipado a Recomendaciones con IA y Analytics de ROI."
                  </p>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>📺 Visual: Tarjetas exactas de Recompensas por Fidelidad del panel.</div>
                </div>

                <div style={{ backgroundColor: '#020a07', padding: 14, borderRadius: 10, borderLeft: '3px solid #10B981' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 4 }}>00:48 - 01:00 | LLAMADO A LA ACCIÓN (CTA)</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#E5E7EB' }}>
                    <strong>Voz en off:</strong> "Instalá Nevux hoy en tu Tiendanube, probalo gratis por 7 días sin tarjeta de crédito y empezá a desbloquear tus recompensas. Tocá el botón de abajo."
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Preview 9:16 Mockup */}
            <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>PREVIEW STORY / REEL (9:16)</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>1080 x 1920 px Equivalent</span>
              </div>

              {/* Mobile Phone Mockup */}
              <div style={{
                width: 280,
                height: 520,
                backgroundColor: '#020a07',
                borderRadius: 28,
                border: '4px solid #1F2937',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <NevuxHeaderBrand />
                  <span style={{ fontSize: 9, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '2px 8px', borderRadius: 10, fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    7 DÍAS GRATIS
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 'auto 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
                      Cuantos más meses usás Nevux, más ganás
                    </h4>
                    <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>
                      Desbloqueá beneficios exclusivos para tu tienda
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#0B1512', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 12, padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Gift size={14} color="#10B981" />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981' }}>RECOMPENSAS POR FIDELIDAD</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 8.5, color: '#D1D5DB' }}>
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>Mes 3 · Recompensa:</strong> Widgets premium + 1 widget personalizado único.
                      </div>
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>Mes 6 · Elite:</strong> Widgets a medida + descuentos en tu suscripción.
                      </div>
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>Mes 12+ · VIP:</strong> Beneficios VIP + acceso anticipado a features nuevas.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>⚡ 50 Widgets</span>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>🤖 6 IA</span>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>📊 ROI Analytics</span>
                    <span style={{ fontSize: 8, backgroundColor: '#111827', color: '#10B981', padding: '3px 6px', borderRadius: 4 }}>🎙️ Voz IA</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    backgroundColor: '#10B981',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: 12,
                    padding: '10px 0',
                    borderRadius: 8,
                    textAlign: 'center'
                  }}>
                    PROBAR 7 DÍAS GRATIS
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 8, color: '#6B7280' }}>
                    Sin tarjeta de crédito • Instalación en 1 clic
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Rewards Breakdown Section */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Gift size={24} color="#10B981" />
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Cuantos más meses usás Nevux, más ganás
              </h3>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>
              Desbloqueá beneficios exclusivos que ninguna otra tienda va a tener. (Copia exacta de tu panel)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Gift size={18} color="#10B981" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Mes 3 · Recompensa</span>
                </div>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.5 }}>
                  Desbloqueás widgets premium exclusivos + 1 widget personalizado único que solo vas a tener vos.
                </p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Award size={18} color="#10B981" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Mes 6 · Elite</span>
                </div>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.5 }}>
                  Más widgets personalizados hechos a medida + descuentos exclusivos en tu suscripción.
                </p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: 12, padding: 18, boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Crown size={18} color="#10B981" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Mes 12+ · VIP</span>
                </div>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.5 }}>
                  Beneficios VIP, widgets únicos diseñados 100% para tu tienda, y acceso anticipado a features nuevas.
                </p>
              </div>
            </div>
          </div>

          {/* Lo que se viene en Nevux Section */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ backgroundColor: '#10B981', color: '#000', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 900 }}>
                PRÓXIMAMENTE
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Lo que se viene en Nevux
              </h3>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>
              Activando tu cuenta ahora, todo esto viene incluido cuando salga:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Bot size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Recomendaciones con IA</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Sugerí productos automáticamente según lo que ve el cliente.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <BarChart3 size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Analytics avanzados</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Dashboards profesionales con ROI por widget.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Split size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>A/B Testing</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Probá 2 versiones de un widget y quedate con la que más vende.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Palette size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Widgets premium únicos</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Nuevos widgets top que ninguna otra app tiene.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Link2 size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Más integraciones</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Conexión con MercadoLibre, Instagram Shopping y más.</p>
              </div>

              <div style={{ backgroundColor: '#020a07', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
                <Sparkles size={20} color="#10B981" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>Widgets custom para vos</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Diseñamos widgets exclusivos para tu tienda.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANNERS APP STORE TIENDANUBE (16:9 / 1920x1080) */}
      {activeTab === 'appstore' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Banners Oficiales para Tiendanube App Store (1920 x 1080 px - Aspecto 16:9)
              </h3>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
                Cumplen 100% con los requerimientos técnicos de Tiendanube (3-5 imágenes, 16:9, Dark Mode SaaS).
              </p>
            </div>
          </div>

          {/* Banner 1: Búsqueda por Voz IA */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>BANNER 1: BÚSQUEDA POR VOZ IA & BÚSQUEDA INTELIGENTE</span>
              <button
                onClick={() => setFullscreenBanner(1)}
                style={{ backgroundColor: 'transparent', border: '1px solid #374151', color: '#D1D5DB', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Maximize2 size={14} /> Modo Captura (1920x1080)
              </button>
            </div>

            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: '#020a07',
              borderRadius: 12,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NevuxHeaderBrand />
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                  IA EXCLUSIVA PARA TIENDANUBE
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.1 }}>
                    Permite que tus clientes busquen hablando
                  </h2>
                  <p style={{ fontSize: 16, color: '#9CA3AF', margin: '0 0 20px 0', lineHeight: 1.4 }}>
                    Búsqueda por Voz con IA que entiende sinónimos, modismos locales e intenciones de compra en milisegundos.
                  </p>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', padding: '10px 14px', borderRadius: 8, fontSize: 12, color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Mic size={16} color="#10B981" /> Reconocimiento de Voz
                    </div>
                    <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', padding: '10px 14px', borderRadius: 8, fontSize: 12, color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Globe size={16} color="#10B981" /> ES / PT Autodetect
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0B1512', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 16, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mic size={14} /> BÚSQUEDA POR VOZ ACTIVA
                  </div>
                  <div style={{ backgroundColor: '#020a07', border: '1px solid #374151', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: '#F3F4F6', fontSize: 13, fontStyle: 'italic' }}>"Busco zapatillas negras de running..."</span>
                    <div style={{ backgroundColor: '#10B981', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mic size={14} color="#000" />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
                    <span>⚡ 3 Resultados (0.12s)</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>98% Precisión IA</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1F2937', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>
                  50 Widgets + 6 funciones para impulsar tu Tiendanube
                </span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Instalación inmediata • 7 días gratis</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INSTAGRAM PLAN SEMANAL COMPLETO (LUN-DOM) */}
      {activeTab === 'instagram' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Header del plan semanal */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Calendar size={24} color="#10B981" />
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Plan de Contenidos Instagram · Semana Completa (Lun-Dom)
              </h3>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 16 }}>
              Estrategia orgánica de carruseles, reels y stories con metodología SPIN + AIDA + PAS. Cliqueá cada día para desplegar todo el contenido.
            </p>

            {/* Resumen visual de la semana */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
              {WEEKLY_PLAN.map((plan) => (
                <div
                  key={plan.day}
                  onClick={() => setOpenDay(plan.day)}
                  style={{
                    backgroundColor: openDay === plan.day ? plan.focusColor : '#020a07',
                    border: `1px solid ${openDay === plan.day ? plan.focusColor : '#1F2937'}`,
                    borderRadius: 10,
                    padding: '12px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 900, color: openDay === plan.day ? '#FFFFFF' : plan.focusColor, marginBottom: 4 }}>
                    {plan.dayShort.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 9, color: openDay === plan.day ? '#FFFFFF' : '#9CA3AF', fontWeight: 700 }}>
                    {plan.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Días desplegables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {WEEKLY_PLAN.map((plan) => (
              <DayCard
                key={plan.day}
                plan={plan}
                isOpen={openDay === plan.day}
                onToggle={() => setOpenDay(openDay === plan.day ? null : plan.day)}
              />
            ))}
          </div>

          {/* Footer con tips estratégicos */}
          <div style={{ backgroundColor: '#0B1512', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Lightbulb size={18} color="#10B981" />
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Tips estratégicos de la semana</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#D1D5DB', fontSize: 13, lineHeight: 1.8 }}>
              <li><strong style={{ color: '#10B981' }}>Horarios:</strong> 11:30 hs (post-desayuno) y 19:30 hs (post-cena) son los picos de scroll.</li>
              <li><strong style={{ color: '#10B981' }}>Logo NEVUX:</strong> Siempre esquina superior izquierda. Nunca repetir.</li>
              <li><strong style={{ color: '#10B981' }}>Precios:</strong> JAMÁS mencionar precios en Instagram. Solo dentro del billing de la app.</li>
              <li><strong style={{ color: '#10B981' }}>Slogan oficial:</strong> "50 Widgets + 6 funciones para impulsar tu Tiendanube" en cada CTA.</li>
              <li><strong style={{ color: '#10B981' }}>CTA de comentarios:</strong> Pedir que comenten palabras clave activa el algoritmo (WIDGET, RESULTADOS, IA, FIDELIDAD, SEMANA).</li>
            </ul>
          </div>
        </div>
      )}

      {/* FULLSCREEN CAPTURE MODAL */}
      {fullscreenBanner !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}>
          <button
            onClick={() => setFullscreenBanner(null)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              backgroundColor: '#10B981',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <X size={18} /> Cerrar Vista Fullscreen
          </button>

          <div style={{ width: 1280, height: 720, transform: 'scale(0.85)' }}>
            <div style={{
              width: 1920,
              height: 1080,
              transform: 'scale(0.666667)',
              transformOrigin: 'top left',
              backgroundColor: '#020a07',
              padding: 64,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NevuxHeaderBrand />
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '12px 28px', borderRadius: 40, fontSize: 22, fontWeight: 800 }}>
                  IA EXCLUSIVA PARA TIENDANUBE
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: 64, fontWeight: 900, color: '#FFFFFF', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    Permite que tus clientes busquen hablando
                  </h1>
                  <p style={{ fontSize: 28, color: '#9CA3AF', margin: '0 0 40px 0' }}>
                    Búsqueda por Voz con IA que entiende sinónimos, modismos locales e intenciones de compra en milisegundos.
                  </p>
                </div>
                <div style={{ backgroundColor: '#0B1512', border: '2px solid rgba(16, 185, 129, 0.5)', borderRadius: 24, padding: 36 }}>
                  <div style={{ fontSize: 18, color: '#10B981', fontWeight: 800, marginBottom: 16 }}>🎙️ BÚSQUEDA POR VOZ EN TIEMPO REAL</div>
                  <div style={{ backgroundColor: '#020a07', border: '1px solid #374151', borderRadius: 16, padding: '20px 24px', fontSize: 22, color: '#FFF' }}>
                    "Busco zapatillas negras de running talle 42..."
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '2px solid #1F2937', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>
                  50 Widgets + 6 funciones para impulsar tu Tiendanube
                </span>
                <span style={{ fontSize: 20, color: '#6B7280' }}>Instalación inmediata • 7 días gratis</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
      }
