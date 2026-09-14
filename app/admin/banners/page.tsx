"use client";

import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  Flame,
  Palette,
  Brain,
  Globe,
  Mic,
  BarChart3,
  Bot,
  Sparkles,
  Download,
  Smartphone,
  Square,
  Languages,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

type TabId = "appstore5" | "partners" | "stories" | "covers" | "carousels" | "marketing_assets";
type StoryDestacada =
  | "problema"
  | "solucion"
  | "testimonios"
  | "nevuxbot"
  | "analytics"
  | "blackfriday"
  | "estilomarca"
  | "crossselling"
  | "multiidioma"
  | "voz"
  | "vendedor";

/* ═══════════════════════════════════════════
   ESTILOS Y HELPERS (DECLARADOS AL INICIO - Regla #9)
═══════════════════════════════════════════ */

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  let radius = r;
  if (w < 2 * radius) radius = w / 2;
  if (h < 2 * radius) radius = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

interface CarouselSlideData {
  badgeEs: string;
  badgePt: string;
  titleEs: string;
  titlePt: string;
  descEs: string;
  descPt: string;
  visualType: "hook" | "problem" | "solution" | "steps" | "result" | "metrics" | "cta";
  accentTextEs?: string;
  accentTextPt?: string;
}

interface CarouselTemplate {
  slug: string;
  nameEs: string;
  namePt: string;
  emoji: string;
  themeColor: string;
  accentColor: string;
  slides: CarouselSlideData[];
}

const CAROUSEL_TEMPLATES: CarouselTemplate[] = [
  {
    slug: "cuenta-regresiva",
    nameEs: "Cuenta Regresiva",
    namePt: "Contagem Regressiva",
    emoji: "⏳",
    themeColor: "#0f172a",
    accentColor: "#F59E0B",
    slides: [
      {
        badgeEs: "PSICOLOGÍA DE VENTAS",
        badgePt: "PSICOLOGIA DE VENDAS",
        titleEs: "El sesgo de urgencia que estás ignorando",
        titlePt: "O gatilho de urgência que você está ignorando",
        descEs: "Tus clientes entran, miran y se van 'para comprar después'. Al no sentir presión, esa venta se pierde para siempre.",
        descPt: "Seus clientes entram, olham e saem 'para comprar depois'. Sem pressão, essa venda é perdida para sempre.",
        visualType: "hook"
      },
      {
        badgeEs: "EL PROBLEMA",
        badgePt: "O PROBLEMA",
        titleEs: "Procrastinación del comprador online",
        titlePt: "Procrastinação do comprador online",
        descEs: "El 70% de los carritos abandonados ocurre porque el cliente siente que tiene todo el tiempo del mundo para decidir.",
        descPt: "70% dos carrinhos abandonados ocorrem porque o cliente sente que tem todo o tempo do mundo para decidir.",
        visualType: "problem"
      },
      {
        badgeEs: "LA SOLUCIÓN",
        badgePt: "A SOLUÇÃO",
        titleEs: "Widget de Cuenta Regresiva Inteligente",
        titlePt: "Widget de Contagem Regressiva Inteligente",
        descEs: "Colocá un temporizador visual premium directamente en la página de producto sincronizado con ofertas reales.",
        descPt: "Coloque um cronômetro visual premium diretamente na página do produto sincronizado com ofertas reais.",
        visualType: "solution"
      },
      {
        badgeEs: "PASO 1",
        badgePt: "PASSO 1",
        titleEs: "Activación en solo 30 segundos",
        titlePt: "Ativação em apenas 30 segundos",
        descEs: "Entrás al Dashboard de Nevux, elegís el widget de cuenta regresiva y definís la fecha límite del descuento.",
        descPt: "Entre no Dashboard da Nevux, escolha o widget de contagem regressiva e defina o prazo do desconto.",
        visualType: "steps"
      },
      {
        badgeEs: "PASO 2",
        badgePt: "PASSO 2",
        titleEs: "Diseño adaptable a tu marca",
        titlePt: "Design adaptável à sua marca",
        descEs: "Nevux detecta tus colores automáticamente para que el banner luzca 100% orgánico e integrado en tu tienda.",
        descPt: "A Nevux detecta suas cores de forma automática para que o banner pareça 100% orgânico e integrado.",
        visualType: "steps"
      },
      {
        badgeEs: "EL RESULTADO",
        badgePt: "O RESULTADO",
        titleEs: "Urgencia real en la pantalla del cliente",
        titlePt: "Urgência real na tela do cliente",
        descEs: "El cliente ve que la oferta termina. El miedo a perderse la oportunidad (FOMO) acelera la decisión de compra.",
        descPt: "O cliente vê que a oferta está acabando. O medo de perder a oportunidade (FOMO) acelera a decisão de compra.",
        visualType: "result"
      },
      {
        badgeEs: "MÉTRICAS NEVUX",
        badgePt: "MÉTRICAS NEVUX",
        titleEs: "Subida del +24% en conversión directa",
        titlePt: "Aumento de +24% em conversão direta",
        descEs: "Las tiendas con cuenta regresiva reducen el tiempo de decision de compra de horas a escasos minutos.",
        descPt: "Lojas com contagem regressiva reduzem o tempo de decisão de compra de horas para poucos minutos.",
        visualType: "metrics"
      },
      {
        badgeEs: "CTA FINAL",
        badgePt: "CTA FINAL",
        titleEs: "Probá Nevux gratis hoy mismo",
        titlePt: "Teste a Nevux gratuitamente hoje",
        descEs: "Aumentá la urgencia de tu tienda. Instalación en un clic con 7 días de prueba de regalo.",
        descPt: "Aumente a urgência da sua loja. Instalação em um clique com 7 dias de teste grátis.",
        visualType: "cta"
      }
    ]
  },
  {
    slug: "ruleta-descuentos",
    nameEs: "Ruleta de Descuentos",
    namePt: "Roleta de Descontos",
    emoji: "🎡",
    themeColor: "#581c87",
    accentColor: "#10B981",
    slides: [
      {
        badgeEs: "GAMIFICACIÓN",
        badgePt: "GAMIFICAÇÃO",
        titleEs: "La gente odia los cupones aburridos",
        titlePt: "As pessoas odeiam cupons chatos",
        descEs: "Pegar un código de descuento estático en un banner ya no funciona. La falta de interacción mata el interés.",
        descPt: "Colar um cupom estático em um banner já não funciona. A falta de interação mata o interesse do cliente.",
        visualType: "hook"
      },
      {
        badgeEs: "EL PROBLEMA",
        badgePt: "O PROBLEMA",
        titleEs: "Saturación de ofertas y rebajas",
        titlePt: "Saturação de ofertas e descontos",
        descEs: "Todas las tiendas ofrecen lo mismo de la misma forma. Perdés visitas sin que dejen su mail o compren.",
        descPt: "Todas as lojas oferecem o mesmo do mesmo jeito. Você perde visitas sem que deixem o e-mail ou comprem.",
        visualType: "problem"
      },
      {
        badgeEs: "LA SOLUCIÓN",
        badgePt: "A SOLUÇÃO",
        titleEs: "Ruleta Interactiva Anti-Saturación",
        titlePt: "Roleta Interativa Anti-Saturação",
        descEs: "Un juego visual e interactivo donde tus clientes giran para ganar cupones reales y comprar en el momento.",
        descPt: "Um jogo visual e interativo onde seus clientes giram para ganhar cupons reais e comprar na hora.",
        visualType: "solution"
      },
      {
        badgeEs: "PASO 1",
        badgePt: "PASSO 1",
        titleEs: "Configuración fácil de premios",
        titlePt: "Configuração fácil de prêmios",
        descEs: "Cargás tus cupones de Tiendanube en Nevux y definís la probabilidad de ganarse cada uno.",
        descPt: "Insira seus cupons da Nuvemshop na Nevux e defina as probabilidades de ganhar cada prêmio.",
        visualType: "steps"
      },
      {
        badgeEs: "PASO 2",
        badgePt: "PASSO 2",
        titleEs: "Tecnología Anti-Saturación",
        titlePt: "Tecnologia Anti-Saturação",
        descEs: "Controlá que la ruleta aparezca solo una vez por usuario para no interrumpir la navegación habitual.",
        descPt: "Controle para que a roleta apareça apenas uma vez por usuário para não atrapalhar a navegação.",
        visualType: "steps"
      },
      {
        badgeEs: "EL RESULTADO",
        badgePt: "O RESULTADO",
        titleEs: "Captura de leads y ventas masivas",
        titlePt: "Captura de leads e vendas massivas",
        descEs: "El cliente siente que ganó un premio único y decide usarlo inmediatamente antes de perder la sesión.",
        descPt: "O cliente sente que ganhou um prêmio único e decide usá-lo imediatamente antes de fechar o site.",
        visualType: "result"
      },
      {
        badgeEs: "MÉTRICAS NEVUX",
        badgePt: "MÉTRICAS NEVUX",
        titleEs: "+300% en captura de emails",
        titlePt: "+300% na captura de e-mails",
        descEs: "Multiplicás tu base de datos de potenciales clientes y aumentás las ventas del día de forma interactiva.",
        descPt: "Multiplique sua base de dados de potenciais clientes e aumente as vendas do dia de forma interativa.",
        visualType: "metrics"
      },
      {
        badgeEs: "CTA FINAL",
        badgePt: "CTA FINAL",
        titleEs: "Activá tu Ruleta hoy gratis",
        titlePt: "Ative sua Roleta hoje grátis",
        descEs: "Convertí las visitas aburridas en compradores felices. 7 días de prueba gratis con Nevux.",
        descPt: "Converta visitas frias em compradores felizes. 7 dias de teste gratuito com a Nevux.",
        visualType: "cta"
      }
    ]
  },
  {
    slug: "tabla-talles",
    nameEs: "Tabla de Talles",
    namePt: "Tabela de Medidas",
    emoji: "📐",
    themeColor: "#065f46",
    accentColor: "#10B981",
    slides: [
      {
        badgeEs: "ATENCIÓN AL CLIENTE",
        badgePt: "ATENDIMENTO",
        titleEs: "El terror de comprar ropa por internet",
        titlePt: "O terror de comprar roupas pela internet",
        descEs: "La duda número uno de cualquier cliente de moda es: ¿Me quedará bien? Al no saber, prefieren no arriesgarse.",
        descPt: "A dúvida número um de qualquer cliente de moda é: Vai servir? Por não saberem, preferem não comprar.",
        visualType: "hook"
      },
      {
        badgeEs: "EL PROBLEMA",
        badgePt: "O PROBLEMA",
        titleEs: "Devoluciones caras y ventas caídas",
        titlePt: "Trocas caras e vendas canceladas",
        descEs: "Los cambios de talle consumen tu ganancia en logística inversa y saturan tu WhatsApp de soporte.",
        descPt: "As trocas de tamanho consomem seu lucro com frete reverso e lotam seu WhatsApp de suporte.",
        visualType: "problem"
      },
      {
        badgeEs: "LA SOLUCIÓN",
        badgePt: "A SOLUÇÃO",
        titleEs: "Tabla de Talles Interactiva Nevux",
        titlePt: "Tabela de Medidas Interativa Nevux",
        descEs: "Un recomendador visual directo en la tienda donde el usuario ingresa sus medidas y ve su talle ideal.",
        descPt: "Um recomendador visual direto na loja onde o usuário insere suas medidas e vê o tamanho ideal.",
        visualType: "solution"
      },
      {
        badgeEs: "PASO 1",
        badgePt: "PASSO 1",
        titleEs: "Carga rápida por categoría",
        titlePt: "Cadastro rápido por categoria",
        descEs: "Cargás las medidas en centímetros una sola vez y Nevux las vincula a los productos correspondientes.",
        descPt: "Cadastre as medidas em centímetros uma única vez e a Nevux vincula aos produtos corretos.",
        visualType: "steps"
      },
      {
        badgeEs: "PASO 2",
        badgePt: "PASSO 2",
        titleEs: "Botón limpio en la página",
        titlePt: "Botão limpo na página",
        descEs: "Se añade un acceso elegante junto al selector de talles, listo para abrirse como modal emergente.",
        descPt: "Um acesso elegante é adicionado junto ao seletor de tamanhos, pronto para abrir como modal.",
        visualType: "steps"
      },
      {
        badgeEs: "EL RESULTADO",
        badgePt: "O RESULTADO",
        titleEs: "Clientes seguros y cero dudas",
        titlePt: "Clientes seguros e zero dudas",
        descEs: "El cliente compra con total tranquilidad sabiendo exactamente cuál es la prenda que le va a calzar perfecto.",
        descPt: "O cliente compra com total tranquilidade sabendo exatamente qual peça vai servir perfeitamente.",
        visualType: "result"
      },
      {
        badgeEs: "MÉTRICAS NEVUX",
        badgePt: "MÉTRICAS NEVUX",
        titleEs: "Reducción del 45% en cambios",
        titlePt: "Redução de 45% nas trocas",
        descEs: "Ahorrá miles de pesos en logística inversa y liberá tiempo de soporte resolviendo la duda al instante.",
        descPt: "Economize muito dinheiro com logística reversa e libere tempo de suporte resolvendo a dúvida na hora.",
        visualType: "metrics"
      },
      {
        badgeEs: "CTA FINAL",
        badgePt: "CTA FINAL",
        titleEs: "Instalá Nevux gratis ahora",
        titlePt: "Instale a Nevux grátis agora",
        descEs: "Llevá la experiencia de tu local físico a la pantalla digital. 7 días gratis sin compromisos.",
        descPt: "Leve a experiência da sua loja física para a tela digital. 7 dias grátis sem compromisso.",
        visualType: "cta"
      }
    ]
  }
];

const subTabStyle = (isActive: boolean): React.CSSProperties => ({
  flex: "1 0 auto",
  padding: "8px 12px",
  borderRadius: "10px",
  fontSize: "11px",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
  background: isActive ? "#10B981" : "transparent",
  color: isActive ? "#ffffff" : "#6ee7b7",
  transition: "all 0.15s ease",
  whiteSpace: "nowrap",
});

const storyContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "36px",
  width: "100%",
  alignItems: "center",
};

const storyFrameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  minHeight: "580px",
  background: "linear-gradient(145deg, #047857 0%, #064e3b 50%, #022c22 100%)",
  border: "2px solid #10B981",
  borderRadius: "28px",
  padding: "24px 20px 20px",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.35)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const storyTopHeader: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
  zIndex: 2,
};

const storyBottomSwipe: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 800,
  color: "#a7f3d0",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  paddingTop: "12px",
  borderTop: "1px solid rgba(255, 255, 255, 0.15)",
  width: "100%",
  textAlign: "center",
  zIndex: 2,
};

const storyFrameLightStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  minHeight: "580px",
  background: "linear-gradient(145deg, #ecfdf5 0%, #f9fafb 100%)",
  border: "2px solid #10B981",
  borderRadius: "28px",
  padding: "24px 20px 20px",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.15)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const storyTopHeaderLight: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(5, 150, 105, 0.15)",
  zIndex: 2,
};

const storyBottomSwipeLight: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 800,
  color: "#059669",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  paddingTop: "12px",
  borderTop: "1px solid rgba(5, 150, 105, 0.15)",
  width: "100%",
  textAlign: "center",
  zIndex: 2,
};

const bubbleDarkStyle: React.CSSProperties = {
  background: "rgba(0, 0, 0, 0.4)",
  border: "1.5px solid rgba(16, 185, 129, 0.4)",
  borderRadius: "16px",
  padding: "14px",
  textAlign: "left",
  marginBottom: "14px",
};

const storyBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(239, 68, 68, 0.2)",
  border: "1.5px solid #ef4444",
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: 900,
  padding: "5px 12px",
  borderRadius: "999px",
  marginBottom: "16px",
  letterSpacing: "0.05em",
};

const storyBadgeLightStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(16, 185, 129, 0.15)",
  border: "1.5px solid #10B981",
  color: "#065f46",
  fontSize: "10px",
  fontWeight: 900,
  padding: "5px 12px",
  borderRadius: "999px",
  marginBottom: "16px",
  letterSpacing: "0.05em",
};

const storyTitleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  color: "#ffffff",
  lineHeight: 1.15,
  margin: "0 0 16px 0",
  letterSpacing: "-0.03em",
};

const storyTitleLightStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  color: "#065f46",
  lineHeight: 1.15,
  margin: "0 0 16px 0",
  letterSpacing: "-0.03em",
};

const storyDescStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#d1fae5",
  lineHeight: 1.5,
  margin: 0,
  fontWeight: 500,
};

const storyDescLightStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: 1.5,
  margin: 0,
  fontWeight: 600,
};

const whatsappFrameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  height: "580px",
  background:
    "#efe7e3 url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png') repeat",
  border: "2px solid #10B981",
  borderRadius: "28px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.35)",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const whatsappBodyStyle: React.CSSProperties = {
  flex: 1,
  padding: "16px 10px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  overflowY: "auto",
};

const highlightBubbleStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  background: "#ffffff",
  color: "#111827",
  padding: "10px 14px",
  borderRadius: "0px 14px 14px 14px",
  maxWidth: "85%",
  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.25)",
  border: "1.5px solid #10B981",
  textAlign: "left",
  position: "relative",
};

const coverContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

const coverCircleStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
  border: "4px solid #10B981",
  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const coverLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 800,
  color: "#ffffff",
  textAlign: "center",
};

const bannerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "650px",
  minHeight: "350px",
  background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #022c22 100%)",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  boxSizing: "border-box",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(255, 255, 255, 0.2)",
  color: "#ffffff",
  fontSize: "9px",
  fontWeight: "900",
  padding: "4px 10px",
  borderRadius: "999px",
  marginBottom: "12px",
  letterSpacing: "0.5px",
};

const bannerTitleStyle: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "900",
  color: "#ffffff",
  margin: "0 0 10px 0",
  lineHeight: "1.1",
  letterSpacing: "-0.03em",
};

const bannerDescStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#d1fae5",
  margin: 0,
  lineHeight: "1.45",
  fontWeight: "500",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTES VISUALES WHATSAPP
═══════════════════════════════════════════ */
function WhatsAppHeader({
  name,
  status,
  emoji,
}: {
  name: string;
  status: string;
  emoji: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        background: "#075e54",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        boxSizing: "border-box",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ChevronLeft size={20} color="#ffffff" style={{ cursor: "pointer" }} />
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#eceff1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {emoji}
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
            {name}
          </div>
          <div style={{ fontSize: "10px", color: "#a5d6a7", fontWeight: 500 }}>
            {status}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", color: "#ffffff" }}>
        <Video size={18} />
        <Phone size={16} />
        <MoreVertical size={18} />
      </div>
    </div>
  );
}

function WhatsAppFooter() {
  return (
    <div
      style={{
        width: "100%",
        background: "#f0f0f0",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderTop: "1px solid #e0e0e0",
        boxSizing: "border-box",
        zIndex: 10,
      }}
    >
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          borderRadius: "20px",
          padding: "8px 14px",
          fontSize: "12px",
          color: "#999999",
          textAlign: "left",
          border: "1px solid #e0e0e0",
        }}
      >
        Escribí un mensaje...
      </div>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "#075e54",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: "16px",
        }}
      >
        🎤
      </div>
    </div>
  );
}

function BlurBubble({ text, isLeft }: { text: string; isLeft: boolean }) {
  return (
    <div
      style={{
        alignSelf: isLeft ? "flex-start" : "flex-end",
        background: isLeft ? "#ffffff" : "#dcf8c6",
        color: "#303030",
        padding: "6px 10px",
        borderRadius: isLeft ? "0px 10px 10px 10px" : "10px 0px 10px 10px",
        maxWidth: "75%",
        fontSize: "11px",
        lineHeight: "1.4",
        filter: "blur(5px)",
        opacity: 0.35,
        pointerEvents: "none",
        boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
        wordBreak: "break-word",
        position: "relative",
      }}
    >
      {text}
      <div
        style={{
          fontSize: "8px",
          color: "#999999",
          textAlign: "right",
          marginTop: "2px",
        }}
      >
        12:34
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("appstore5");
  const [lang, setLang] = useState<"es" | "pt">("es");
  const [activeDestacada, setActiveDestacada] = useState<StoryDestacada>("vendedor");
  const [appstoreZoom, setAppstoreZoom] = useState<number>(0.2);

  // Estados Pro para la sección Carruseles y Hooks/Cierres
  const [selectedWidget, setSelectedWidget] = useState<string>("cuenta-regresiva");
  const [format, setFormat] = useState<"portrait" | "square">("portrait");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const isPt = lang === "pt";

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "appstore5", label: "Banner #5 App Store", icon: "⭐" },
    { id: "partners", label: "Banners Partners", icon: "🖼️" },
    { id: "stories", label: "Historias Instagram", icon: "📱" },
    { id: "covers", label: "Portadas Destacadas", icon: "🎨" },
    { id: "carousels", label: "Carruseles Instagram", icon: "🎠" },
    { id: "marketing_assets", label: "Hooks y Cierres Reels", icon: "🎬" },
  ];

  const currentTemplate = CAROUSEL_TEMPLATES.find((t) => t.slug === selectedWidget) || CAROUSEL_TEMPLATES[0];

  // CLONACIÓN MATEMÁTICA EXACTA AL PREVIEW DE PANTALLA (Regla #14: Generics explícitos en Promises)
  const downloadSlideAsImage = async (slideIndex: number) => {
    setIsDownloading(true);
    try {
      const slide = currentTemplate.slides[slideIndex];
      const isPortrait = format === "portrait";
      
      const width = 1080;
      const height = isPortrait ? 1350 : 1080;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const S = width / 340;

        const gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          10 * S,
          width / 2,
          height / 2,
          width * 0.7
        );
        gradient.addColorStop(0, currentTemplate.themeColor);
        gradient.addColorStop(1, "#020617");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const topLightY = -80 * S;
        const topLightRadius = 170 * S;
        const radialGrad = ctx.createRadialGradient(
          width / 2, topLightY, 10 * S,
          width / 2, topLightY, topLightRadius
        );
        radialGrad.addColorStop(0, "rgba(16, 185, 129, 0.12)");
        radialGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(width / 2, topLightY, topLightRadius, 0, Math.PI * 2);
        ctx.fill();

        const logoSize = 24 * S;
        const logoX = (width - logoSize) / 2 - 34 * S;
        const logoY = 22 * S;

        ctx.fillStyle = "#10B981";
        drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 6 * S);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = `950 ${15 * S}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N", logoX + logoSize / 2, logoY + logoSize / 2 + 0.5 * S);

        ctx.fillStyle = "#ffffff";
        ctx.font = `900 ${16 * S}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText("EVUX", logoX + logoSize + 8 * S, logoY + logoSize / 2);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1 * S;
        ctx.beginPath();
        ctx.moveTo(16 * S, 64 * S);
        ctx.lineTo(width - 16 * S, 64 * S);
        ctx.stroke();

        const badgeText = isPt ? slide.badgePt : slide.badgeEs;
        ctx.font = `900 ${8.5 * S}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        const textWidth = ctx.measureText(badgeText.toUpperCase()).width;
        
        const badgeW = textWidth + 20 * S;
        const badgeH = 22 * S;
        const badgeX = (width - badgeW) / 2;
        const badgeY = 90 * S;

        ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
        ctx.strokeStyle = currentTemplate.accentColor;
        ctx.lineWidth = 1.5 * S;
        drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 11 * S);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "middle";
        ctx.fillText(badgeText.toUpperCase(), width / 2, badgeY + badgeH / 2);

        const titleText = isPt ? slide.titlePt : slide.titleEs;
        const titleFontSize = isPortrait ? 19 * S : 16 * S;
        ctx.font = `900 ${titleFontSize}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const titleWords = titleText.split(" ");
        let titleLine = "";
        const titleLines: string[] = [];
        const maxTitleWidth = width - 40 * S;
        const titleLineHeight = titleFontSize * 1.25;

        for (let n = 0; n < words.length; n++) {
          const testLine = titleLine + titleWords[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTitleWidth && n > 0) {
            titleLines.push(titleLine);
            titleLine = titleWords[n] + " ";
          } else {
            titleLine = testLine;
          }
        }
        titleLines.push(titleLine);

        const titleStartY = 135 * S;
        for (let i = 0; i < titleLines.length; i++) {
          ctx.fillText(titleLines[i].trim(), width / 2, titleStartY + i * titleLineHeight);
        }

        const descText = isPt ? slide.descPt : slide.descEs;
        const descFontSize = isPortrait ? 11.5 * S : 10 * S;
        ctx.font = `500 ${descFontSize}px system-ui, -apple-system, sans-serif`;

        const descWords = descText.split(" ");
        let descLine = "";
        const descLines: string[] = [];
        const descBoxWidth = width - 32 * S;
        const maxDescTextWidth = descBoxWidth - 24 * S;
        const descLineHeight = descFontSize * 1.4;

        for (let n = 0; n < descWords.length; n++) {
          const testLine = descLine + descWords[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxDescTextWidth && n > 0) {
            descLines.push(descLine);
            descLine = descWords[n] + " ";
          } else {
            descLine = testLine;
          }
        }
        descLines.push(descLine);

        const descBoxHeight = descLines.length * descLineHeight + 20 * S;
        const descBoxX = 16 * S;
        const descBoxY = height - 44 * S - descBoxHeight;

        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
        ctx.lineWidth = 1 * S;
        drawRoundedRect(ctx, descBoxX, descBoxY, descBoxWidth, descBoxHeight, 14 * S);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#a7f3d0";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const descTextStartY = descBoxY + 10 * S;
        for (let i = 0; i < descLines.length; i++) {
          ctx.fillText(descLines[i].trim(), width / 2, descTextStartY + i * descLineHeight);
        }

        const footerY = height - 34 * S;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1 * S;
        ctx.beginPath();
        ctx.moveTo(16 * S, footerY);
        ctx.lineTo(width - 16 * S, footerY);
        ctx.stroke();

        ctx.fillStyle = currentTemplate.accentColor;
        ctx.font = `900 ${9 * S}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const swipeText = isPt ? "DESLIZE PARA VER ➔" : "DESLIZÁ PARA VER ➔";
        ctx.fillText(swipeText, width / 2, footerY + 17 * S);
      }

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `nevux-carousel-${selectedWidget}-slide-${slideIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar canvas:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // EXPORTADOR ULTRA-RESALTADO REELS: TEXTO NEGRO (#000000) SOBRE VERDE NEÓN ESPECTACULAR
  const downloadMarketingAsset = async (type: "hook" | "cierre" | "mini_hook") => {
    setIsDownloading(true);
    try {
      const width = 1080;
      const height = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const S = width / 340;

        if (type === "hook") {
          ctx.fillStyle = "#090d16";
          ctx.fillRect(0, 0, width, height);

          const grad = ctx.createRadialGradient(width / 2, height / 2, 40 * S, width / 2, height / 2, 220 * S);
          grad.addColorStop(0, "rgba(16, 185, 129, 0.3)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 220 * S, 0, Math.PI * 2);
          ctx.fill();

          const boxW = width - 48 * S;
          const boxH = 260 * S;
          const boxX = (width - boxW) / 2;
          const boxY = (height - boxH) / 2;

          ctx.fillStyle = "#10B981";
          drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28 * S);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3 * S;
          ctx.stroke();

          ctx.fillStyle = "#000000";
          ctx.font = `950 ${9.5 * S}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🔥 SECRETO DE E-COMMERCE", width / 2, boxY + 36 * S);

          ctx.fillStyle = "#000000";
          ctx.font = `950 ${24 * S}px system-ui, sans-serif`;
          ctx.textBaseline = "top";

          const text = isPt 
            ? "Os que vendem na Nuvemshop já usam isso 👀" 
            : "Los que venden en Tiendanube ya usan esto 👀";

          const words = text.split(" ");
          let line = "";
          const lines: string[] = [];
          const maxW = boxW - 36 * S;
          const lineH = 36 * S;

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            if (ctx.measureText(testLine).width > maxW && n > 0) {
              lines.push(line);
              line = words[n] + " ";
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          const startY = boxY + 85 * S;
          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i].trim(), width / 2, startY + i * lineH);
          }

        } else if (type === "mini_hook") {
          // RENDER NUEVO: MINI GANCHO 15 SEGUNDOS
          ctx.fillStyle = "#090d16";
          ctx.fillRect(0, 0, width, height);

          const grad = ctx.createRadialGradient(width / 2, height / 2, 40 * S, width / 2, height / 2, 220 * S);
          grad.addColorStop(0, "rgba(16, 185, 129, 0.35)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 220 * S, 0, Math.PI * 2);
          ctx.fill();

          const boxW = width - 48 * S;
          const boxH = 260 * S;
          const boxX = (width - boxW) / 2;
          const boxY = (height - boxH) / 2;

          ctx.fillStyle = "#10B981";
          drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28 * S);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3 * S;
          ctx.stroke();

          ctx.fillStyle = "#000000";
          ctx.font = `950 ${9.5 * S}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("⚡ ACCESO AL INSTANTE", width / 2, boxY + 36 * S);

          ctx.fillStyle = "#000000";
          ctx.font = `950 ${23 * S}px system-ui, sans-serif`;
          ctx.textBaseline = "top";

          const text = isPt 
            ? "Ative um Contador e venda o triplo em 15 segundos ⏳" 
            : "Activá una Cuenta Regresiva y vendé el triple hoy mismo ⏳";

          const words = text.split(" ");
          let line = "";
          const lines: string[] = [];
          const maxW = boxW - 36 * S;
          const lineH = 36 * S;

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            if (ctx.measureText(testLine).width > maxW && n > 0) {
              lines.push(line);
              line = words[n] + " ";
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          const startY = boxY + 85 * S;
          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i].trim(), width / 2, startY + i * lineH);
          }

        } else {
          ctx.fillStyle = "#090d16";
          ctx.fillRect(0, 0, width, height);

          const grad = ctx.createRadialGradient(width / 2, height / 2, 40 * S, width / 2, height / 2, 220 * S);
          grad.addColorStop(0, "rgba(16, 185, 129, 0.3)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 220 * S, 0, Math.PI * 2);
          ctx.fill();

          const boxW = width - 48 * S;
          const boxH = 340 * S;
          const boxX = (width - boxW) / 2;
          const boxY = (height - boxH) / 2;

          ctx.fillStyle = "#10B981";
          drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28 * S);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3 * S;
          ctx.stroke();

          const logoW = 54 * S;
          const logoH = 54 * S;
          const logoX = (width - logoW) / 2;
          const logoY = boxY + 30 * S;

          ctx.fillStyle = "#000000";
          drawRoundedRect(ctx, logoX, logoY, logoW, logoH, 14 * S);
          ctx.fill();

          ctx.fillStyle = "#10B981";
          ctx.font = `950 ${28 * S}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("N", logoX + logoW / 2, logoY + logoH / 2);

          ctx.fillStyle = "#000000";
          ctx.font = `950 ${23 * S}px system-ui, sans-serif`;
          ctx.textBaseline = "top";
          const ctaText = isPt ? "Teste o Nevux GRÁTIS por 7 dias 🚀" : "Probá Nevux GRATIS 7 días 🚀";
          
          const words = ctaText.split(" ");
          let line = "";
          const lines: string[] = [];
          const maxW = boxW - 36 * S;
          const lineH = 34 * S;

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            if (ctx.measureText(testLine).width > maxW && n > 0) {
              lines.push(line);
              line = words[n] + " ";
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          const startY = boxY + 105 * S;
          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i].trim(), width / 2, startY + i * lineH);
          }

          ctx.fillStyle = "#000000";
          ctx.font = `900 ${14 * S}px system-ui, sans-serif`;
          ctx.fillText(isPt ? "👉 Link na Biografia 👈" : "👉 Link en la Biografía 👈", width / 2, boxY + 225 * S);

          ctx.font = `900 ${30 * S}px system-ui, sans-serif`;
          ctx.fillText("👇", width / 2, boxY + 265 * S);
        }
      }

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `nevux-${type === "hook" ? "hook-dolor" : type === "mini_hook" ? "mini-hook" : "cierre-cta"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar asset:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#061a14",
        color: "#ffffff",
        padding: "24px 16px 120px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* PANEL DE CONTROL SUPERIOR */}
      <div
        style={{
          maxWidth: "750px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#0b2920",
          padding: "20px",
          borderRadius: "18px",
          border: "1.5px solid rgba(16, 185, 129, 0.3)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#10B981",
            margin: 0,
          }}
        >
          📷 Generador de Contenido Visual Nevux
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#a7f3d0",
            margin: 0,
            lineHeight: "1.4",
          }}
        >
          Seleccioná qué tipo de contenido querés generar y sacale captura desde tu celular.
        </p>

        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "#061a14",
            padding: "4px",
            borderRadius: "12px",
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? "#10B981" : "transparent",
                  color: isActive ? "#ffffff" : "#6ee7b7",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: BANNER #5 APP STORE */}
      {activeTab === "appstore5" && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              background: "#0b2920",
              padding: "6px",
              borderRadius: "12px",
              border: "1.5px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <button
              onClick={() => setLang("es")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                backgroundColor: !isPt ? "#10B981" : "transparent",
                color: !isPt ? "#ffffff" : "#a7f3d0",
                transition: "all 0.2s ease",
              }}
            >
              🇦🇷 Español (LATAM)
            </button>
            <button
              onClick={() => setLang("pt")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                backgroundColor: isPt ? "#10B981" : "transparent",
                color: isPt ? "#ffffff" : "#a7f3d0",
                transition: "all 0.2s ease",
              }}
            >
              🇧🇷 Português (Brasil)
            </button>
          </div>

          <div
            style={{
              background: "#0b2920",
              padding: "16px 20px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "100%",
              maxWidth: "500px",
              border: "1.5px solid rgba(16, 185, 129, 0.3)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#a7f3d0" }}>
                🔎 {isPt ? "Controle de Zoom" : "Control de Zoom"}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 900, color: "#10B981" }}>
                {Math.round(appstoreZoom * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.15"
              max="1.0"
              step="0.05"
              value={appstoreZoom}
              onChange={(e) => setAppstoreZoom(parseFloat(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#10B981",
                cursor: "pointer",
              }}
            />
          </div>

          <div
            style={{
              width: `${1920 * appstoreZoom}px`,
              height: `${1080 * appstoreZoom}px`,
              overflow: "hidden",
              borderRadius: "24px",
              border: "4px solid #10B981",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              transition: "width 0.1s ease, height 0.1s ease",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "1920px",
                height: "1080px",
                transform: `scale(${appstoreZoom})`,
                transformOrigin: "top left",
                background: "radial-gradient(circle at top left, #042f1a 0%, #020617 60%, #000000 100%)",
                padding: "60px 70px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid rgba(16, 185, 129, 0.25)", paddingBottom: "30px", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ background: "#10B981", color: "#ffffff", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: 950, boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)" }}>
                    N
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "38px", fontWeight: 950, color: "#ffffff", letterSpacing: "-0.04em" }}>NEVUX</h2>
                    <p style={{ margin: 0, fontSize: "14px", color: "#10B981", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {isPt ? "Powering Nuvemshop" : "Powering Tiendanube"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANNERS PARTNERS */}
      {activeTab === "partners" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 200px", zIndex: 2 }}>
              <div style={badgeStyle}>🤖 NEVUXBOT</div>
              <h2 style={bannerTitleStyle}>
                {isPt ? "O primeiro CRM de Carrinhos com IA" : "El primer CRM de Carritos con IA"}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORIAS INSTAGRAM */}
      {activeTab === "stories" && (
        <div style={{ width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", gap: "6px", background: "#0b2920", padding: "6px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.3)", width: "100%", overflowX: "auto" }}>
            <button onClick={() => setActiveDestacada("problema")} style={subTabStyle(activeDestacada === "problema")}>🚨 1. Dolor</button>
            <button onClick={() => setActiveDestacada("solucion")} style={subTabStyle(activeDestacada === "solucion")}>⚡ 2. Solución</button>
          </div>
        </div>
      )}

      {/* TAB 5: CARRUSELES INSTAGRAM */}
      {activeTab === "carousels" && (
        <div style={{ width: "100%", maxWidth: "750px", display: "flex", flexDirection: "column", gap: "24px", boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#0b2920", borderRadius: "16px", padding: "20px", border: "1.5px solid rgba(16, 185, 129, 0.3)", display: "flex", flexDirection: "column", gap: "16px", boxSizing: "border-box" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 800, color: "#6ee7b7" }}>WIDGET CAMPAÑA</label>
                <select value={selectedWidget} onChange={(e) => setSelectedWidget(e.target.value)} style={{ backgroundColor: "#061a14", color: "#ffffff", border: "1.5px solid rgba(16, 185, 129, 0.4)", borderRadius: "10px", padding: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", outline: "none" }}>
                  {CAROUSEL_TEMPLATES.map((t) => (
                    <option key={t.slug} value={t.slug}>{t.emoji} {isPt ? t.namePt : t.nameEs}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎬 🌟 TAB 6: HOOKS Y CIERRES REELS (3 ASSETS DE ALTO IMPACTO) */}
      {activeTab === "marketing_assets" && (
        <div
          style={{
            width: "100%",
            maxWidth: "750px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* SELECTOR DE IDIOMA */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              background: "#0b2920",
              padding: "6px",
              borderRadius: "12px",
              border: "1.5px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <button
              onClick={() => setLang("es")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                backgroundColor: !isPt ? "#10B981" : "transparent",
                color: !isPt ? "#000000" : "#a7f3d0",
                transition: "all 0.2s ease",
              }}
            >
              🇦🇷 Español
            </button>
            <button
              onClick={() => setLang("pt")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                backgroundColor: isPt ? "#10B981" : "transparent",
                color: isPt ? "#000000" : "#a7f3d0",
                transition: "all 0.2s ease",
              }}
            >
              🇧🇷 Português
            </button>
          </div>

          <p style={{ fontSize: "12.5px", color: "#6ee7b7", textAlign: "center", margin: 0, fontWeight: 600 }}>
            {isPt 
              ? "💡 Letras em preto profundo (#000000) sobre fundo verde esmeralda com destaque viral."
              : "💡 Letras en negro profundo (#000000) sobre fondo verde esmeralda con resaltado viral."}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* 🚨 1. HOOK DE APERTURA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "220px" }}>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>🚨 HOOK INICIO (3S)</span>
                <button
                  disabled={isDownloading}
                  onClick={() => downloadMarketingAsset("hook")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6ee7b7",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  <Download size={12} /> Descargar
                </button>
              </div>

              <div
                style={{
                  width: "220px",
                  height: "390px",
                  backgroundColor: "#090d16",
                  border: "2px solid #10B981",
                  borderRadius: "20px",
                  padding: "20px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ position: "absolute", width: "140px", height: "140px", background: "rgba(16, 185, 129, 0.25)", filter: "blur(35px)", borderRadius: "50%", pointerEvents: "none" }} />
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#10B981",
                    border: "1.5px solid #ffffff",
                    borderRadius: "16px",
                    padding: "20px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                    zIndex: 2,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontSize: "7.5px", fontWeight: 950, color: "#000000", letterSpacing: "0.06em" }}>
                    🔥 SECRETO DE E-COMMERCE
                  </span>
                  <h2 style={{ fontSize: "13.5px", fontWeight: 950, color: "#000000", textAlign: "center", lineHeight: 1.25, margin: 0 }}>
                    {isPt 
                      ? "Os que vendem na Nuvemshop já usam isso 👀" 
                      : "Los que venden en Tiendanube ya usan esto 👀"}
                  </h2>
                </div>
              </div>
            </div>

            {/* ⚡ 2. MINI GANCHO CENTRAL (NUEVO) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "220px" }}>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>⚡ MINI GANCHO (15S)</span>
                <button
                  disabled={isDownloading}
                  onClick={() => downloadMarketingAsset("mini_hook")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6ee7b7",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  <Download size={12} /> Descargar
                </button>
              </div>

              <div
                style={{
                  width: "220px",
                  height: "390px",
                  backgroundColor: "#090d16",
                  border: "2px solid #10B981",
                  borderRadius: "20px",
                  padding: "20px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ position: "absolute", width: "140px", height: "140px", background: "rgba(16, 185, 129, 0.25)", filter: "blur(35px)", borderRadius: "50%", pointerEvents: "none" }} />
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#10B981",
                    border: "1.5px solid #ffffff",
                    borderRadius: "16px",
                    padding: "20px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                    zIndex: 2,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontSize: "7.5px", fontWeight: 950, color: "#000000", letterSpacing: "0.06em" }}>
                    ⚡ ACCESO AL INSTANTE
                  </span>
                  <h2 style={{ fontSize: "13.5px", fontWeight: 950, color: "#000000", textAlign: "center", lineHeight: 1.25, margin: 0 }}>
                    {isPt 
                      ? "Ative um Contador e venda o triplo em 15 segundos ⏳" 
                      : "Activá una Cuenta Regresiva y vendé el triple hoy mismo ⏳"}
                  </h2>
                </div>
              </div>
            </div>

            {/* 🏁 3. CTA DE CIERRE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "220px" }}>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981" }}>🏁 CTA CIERRE (REELS)</span>
                <button
                  disabled={isDownloading}
                  onClick={() => downloadMarketingAsset("cierre")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6ee7b7",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  <Download size={12} /> Descargar
                </button>
              </div>

              <div
                style={{
                  width: "220px",
                  height: "390px",
                  backgroundColor: "#090d16",
                  border: "2px solid #10B981",
                  borderRadius: "20px",
                  padding: "20px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ position: "absolute", width: "140px", height: "140px", background: "rgba(16, 185, 129, 0.25)", filter: "blur(35px)", borderRadius: "50%", pointerEvents: "none" }} />
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#10B981",
                    border: "1.5px solid #ffffff",
                    borderRadius: "16px",
                    padding: "20px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                    zIndex: 2,
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ width: "32px", height: "36px", background: "#000000", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 950, fontSize: "16px", color: "#10B981" }}>
                    N
                  </div>
                  <h2 style={{ fontSize: "13.5px", fontWeight: 950, color: "#000000", textAlign: "center", lineHeight: 1.25, margin: 0 }}>
                    {isPt ? "Teste o Nevux GRÁTIS por 7 dias 🚀" : "Probá Nevux GRATIS 7 días 🚀"}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                    <span style={{ fontSize: "9px", color: "#000000", fontWeight: 900 }}>
                      {isPt ? "👉 Link na Biografia 👈" : "👉 Link en la Biografía 👈"}
                    </span>
                    <span style={{ fontSize: "16px" }}>👇</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
