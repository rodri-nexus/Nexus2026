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

type TabId = "appstore5" | "partners" | "stories" | "covers" | "carousels";
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
        descEs: "Las tiendas con cuenta regresiva reducen el tiempo de decisión de compra de horas a escasos minutos.",
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
        titlePt: "Clientes seguros e zero dúvidas",
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

  // Estados Pro para la sección Carruseles
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
        // Factor de escala exacto basado en el ancho visual de 340px del celular
        const S = width / 340;

        // Fondo con Degradado Radial Premium
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

        // Halo de Luz Superior Orgánico
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

        // LOGO NEVUX OFICIAL (Cuadrado esmeralda con la letra N + texto EVUX)
        const logoSize = 24 * S;
        const logoX = (width - logoSize) / 2 - 34 * S;
        const logoY = 22 * S;

        // Cuadrado redondeado esmeralda
        ctx.fillStyle = "#10B981";
        drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 6 * S);
        ctx.fill();

        // N en blanco
        ctx.fillStyle = "#ffffff";
        ctx.font = `950 ${15 * S}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N", logoX + logoSize / 2, logoY + logoSize / 2 + 0.5 * S);

        // Texto EVUX
        ctx.fillStyle = "#ffffff";
        ctx.font = `900 ${16 * S}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText("EVUX", logoX + logoSize + 8 * S, logoY + logoSize / 2);

        // Separador del Header
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1 * S;
        ctx.beginPath();
        ctx.moveTo(16 * S, 64 * S);
        ctx.lineTo(width - 16 * S, 64 * S);
        ctx.stroke();

        // BADGE SUPERIOR DE TEMPORADA
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

        // TÍTULO PRINCIPAL (Multi-línea y adaptado al formato)
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

        for (let n = 0; n < titleWords.length; n++) {
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

        // DESCRIPCIÓN CON CAJA CONTENEDORA (Clonación exacta de opacidad y borde)
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

        // Caja negra translúcida con borde esmeralda sutil
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
        ctx.lineWidth = 1 * S;
        drawRoundedRect(ctx, descBoxX, descBoxY, descBoxWidth, descBoxHeight, 14 * S);
        ctx.fill();
        ctx.stroke();

        // Dibujar el texto descriptivo dentro de la caja
        ctx.fillStyle = "#a7f3d0";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const descTextStartY = descBoxY + 10 * S;
        for (let i = 0; i < descLines.length; i++) {
          ctx.fillText(descLines[i].trim(), width / 2, descTextStartY + i * descLineHeight);
        }

        // FOOTER CON DESLIZADOR
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

      // Descarga directa a la galería en PNG HD
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

      {/* 🌟 PESTAÑA: BANNER #5 APP STORE (1920x1080 CON ESCALADOR Y BILINGÜE) */}
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

          {/* SLIDER DE CONTROL DE ZOOM PARA EL CELULAR */}
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
            <span style={{ fontSize: "11px", color: "#6ee7b7", textAlign: "center", marginTop: "2px" }}>
              {isPt
                ? "💡 Deslize para 15%-25% na vertical. Suba a 40%-50% na horizontal para capturar em HD."
                : "💡 Deslizá al 15%-25% para ver todo en vertical. Subí al 40%-50% en horizontal para sacar captura HD."}
            </span>
          </div>

          {/* CONTENEDOR DE ESCALADO MATEMÁTICO */}
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
            {/* EL LIENZO REAL (MANTIENE SUS 1920x1080 PROPORCIONALES) */}
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
              {/* DEGRADADOS DE LUZ PRO */}
              <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "#10B981", filter: "blur(200px)", opacity: 0.15, pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "40%", height: "40%", background: "#10B981", filter: "blur(180px)", opacity: 0.1, pointerEvents: "none" }} />

              {/* HEADER DEL BANNER */}
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

                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(16, 185, 129, 0.15)", border: "2px solid #10B981", padding: "8px 24px", borderRadius: "999px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
                  <span style={{ fontSize: "14px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    App Store ID: 37382
                  </span>
                </div>
              </div>

              {/* SECCIÓN CENTRAL: TÍTULO + GRILLA */}
              <div style={{ display: "flex", flexDirection: "column", gap: "45px", margin: "20px 0", zIndex: 10 }}>
                {/* TÍTULO Y CONCEPTO */}
                <div style={{ textAlign: "center" }}>
                  <h1 style={{ margin: "0 0 14px 0", fontSize: "68px", fontWeight: 950, color: "#ffffff", letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1.1 }}>
                    {isPt ? "NEVUX NÃO É UMA APP COMUM." : "NEVUX NO ES CUALQUIER APLICACIÓN."}
                  </h1>
                  <p style={{ fontSize: "24px", color: "#9ca3af", maxWidth: "1300px", margin: "0 auto", lineHeight: 1.5, fontWeight: 500 }}>
                    {isPt ? (
                      <>É a única suíte inteligente tudo-em-um que combina <span style={{ color: "#10B981", fontWeight: 800 }}>27 widgets de conversão avançada</span> com ferramentas de IA para eliminar sua concorrência e disparar seu ticket médio.</>
                    ) : (
                      <>Es la única suite inteligente todo-en-uno que fusiona <span style={{ color: "#10B981", fontWeight: 800 }}>27 widgets de conversión avanzada</span> con herramientas de IA para liquidar a tu competencia y disparar tu ticket promedio.</>
                    )}
                  </p>
                </div>

                {/* GRILLA DE LAS 7 FUNCIONES PRO */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", width: "100%" }}>
                  {/* TARJETA 1 */}
                  <div style={{ background: "rgba(10, 10, 10, 0.75)", border: "2px solid rgba(16, 185, 129, 0.45)", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(16, 185, 129, 0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <BarChart3 size={28} color="#10B981" />
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>Live Analytics</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", color: "#9ca3af", lineHeight: 1.5 }}>
                      {isPt ? "Faturamento extra, pedidos recuperados e ROI exato em tempo real." : "Facturación extra, pedidos recuperados y ROI exacto en tiempo real."}
                    </p>
                  </div>

                  {/* TARJETA 2 */}
                  <div style={{ background: "rgba(10, 10, 10, 0.75)", border: "2px solid rgba(245, 158, 11, 0.45)", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(245, 158, 11, 0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Flame size={28} color="#F59E0B" />
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>
                        {isPt ? "Datas Especiais" : "Fechas Especiales"}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", color: "#9ca3af", lineHeight: 1.5 }}>
                      {isPt ? "Modos Black Friday, Cyber Monday e Natal ativáveis com 1 clique." : "Modos Black Friday, Hot Sale y Navidad activables en 1 clic."}
                    </p>
                  </div>

                  {/* TARJETA 3 */}
                  <div style={{ background: "rgba(10, 10, 10, 0.75)", border: "2px solid rgba(139, 92, 246, 0.45)", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(139, 92, 246, 0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Palette size={28} color="#8B5CF6" />
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>
                        {isPt ? "Estilo Marca" : "Estilo Marca"}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", color: "#9ca3af", lineHeight: 1.5 }}>
                      {isPt ? "Regra cromática inteligente que adapta os widgets à sua identidade visual." : "Regla cromática inteligente que adapta los widgets a tu branding."}
                    </p>
                  </div>

                  {/* TARJETA 4 */}
                  <div style={{ background: "rgba(10, 10, 10, 0.75)", border: "2px solid rgba(59, 130, 246, 0.45)", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(59, 130, 246, 0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Brain size={28} color="#3B82F6" />
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>
                        {isPt ? "Sugestões IA" : "Sugerencias IA"}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", color: "#9ca3af", lineHeight: 1.5 }}>
                      {isPt ? "Cross-selling preditivo dinâmico baseado em afinidade de preços." : "Cross-selling predictivo dinámico basado en afinidad de precios."}
                    </p>
                  </div>
                </div>

                {/* FILA 2 DE LA GRILLA (CENTRADOS) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "80%", margin: "0 auto" }}>
                  {/* TARJETA 5 */}
                  <div style={{ background: "rgba(10, 10, 10, 0.75)", border: "2px solid rgba(6, 182, 212, 0.45)", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(6, 182, 212, 0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Globe size={28} color="#06B6D4" />
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>
                        {isPt ? "Multi-Idioma IA" : "Multi-Idioma IA"}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", color: "#9ca3af", lineHeight: 1.5 }}>
                      {isPt ? "Tradução contextual em tempo real para PT-BR / ES / EN." : "Traducción contextual en tiempo real para ES / PT-BR / EN."}
                    </p>
                  </div>

                  {/* TARJETA 6 */}
                  <div style={{ background: "rgba(10, 10, 10, 0.75)", border: "2px solid rgba(236, 72, 153, 0.45)", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(236, 72, 153, 0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Mic size={28} color="#EC4899" />
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>
                        {isPt ? "Busca por Voz" : "Búsqueda por Voz"}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", color: "#9ca3af", lineHeight: 1.5 }}>
                      {isPt ? "Microfone flutuante com transcrição neural para comprar falando." : "Micrófono flotante con transcripción neuronal para comprar hablando."}
                    </p>
                  </div>

                  {/* TARJETA 7 */}
                  <div style={{ background: "rgba(10, 10, 10, 0.75)", border: "2px solid rgba(16, 185, 129, 0.45)", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(16, 185, 129, 0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Bot size={28} color="#10B981" />
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>
                        {isPt ? "Vendedor Virtual IA" : "Vendedor Virtual IA"}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", color: "#9ca3af", lineHeight: 1.5 }}>
                      {isPt ? "Agente que orienta, resolve dúvidas e direciona o pedido ao WhatsApp." : "Agente que asesora, resuelve dudas y deriva el pedido a WhatsApp."}
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER DEL BANNER */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid rgba(16, 185, 129, 0.15)", paddingTop: "25px", zIndex: 10 }}>
                <span style={{ fontSize: "18px", fontWeight: 850, color: "#10B981", letterSpacing: "0.03em" }}>
                  {isPt ? "🚀 JUNTE-SE À REVOLUÇÃO DO COMMERCE NA AMÉRICA LATINA" : "🚀 UNETE A LA REVOLUCIÓN DEL COMMERCE EN LATAM"}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#6b7280" }}>
                  {isPt ? "© 2026 Nevux App. Todos os direitos reservados." : "© 2026 Nevux App. Todos los derechos reservados."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANNERS PARTNERS */}
      {activeTab === "partners" && (
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              background: "#0b2920",
              padding: "4px",
              borderRadius: "12px",
            }}
          >
            <button
              onClick={() => setLang("es")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: !isPt ? "#10B981" : "transparent",
                color: !isPt ? "#ffffff" : "#a7f3d0",
              }}
            >
              🇦🇷 Español
            </button>
            <button
              onClick={() => setLang("pt")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: isPt ? "#10B981" : "transparent",
                color: isPt ? "#ffffff" : "#a7f3d0",
              }}
            >
              🇧🇷 Português
            </button>
          </div>
          <div style={bannerStyle}>
            <div style={{ flex: "1 1 200px", zIndex: 2 }}>
              <div style={badgeStyle}>🤖 NEVUXBOT</div>
              <h2 style={bannerTitleStyle}>
                {isPt
                  ? "O primeiro CRM de Carrinhos com IA"
                  : "El primer CRM de Carritos con IA"}
              </h2>
              <p style={bannerDescStyle}>
                {isPt
                  ? "Detecte vendas perdidas, crie mensagens persuasivas com Gemini AI e recupere via WhatsApp ou E-mail."
                  : "Detectá ventas perdidas, creá copys persuasivos con Gemini AI y recuperá por WhatsApp o Email."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORIAS INSTAGRAM */}
      {activeTab === "stories" && (
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "#0b2920",
              padding: "6px",
              borderRadius: "14px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              width: "100%",
              overflowX: "auto",
            }}
          >
            <button onClick={() => setActiveDestacada("problema")} style={subTabStyle(activeDestacada === "problema")}>🚨 1. Dolor</button>
            <button onClick={() => setActiveDestacada("solucion")} style={subTabStyle(activeDestacada === "solucion")}>⚡ 2. Solución</button>
            <button onClick={() => setActiveDestacada("testimonios")} style={subTabStyle(activeDestacada === "testimonios")}>💬 3. Chats</button>
            <button onClick={() => setActiveDestacada("nevuxbot")} style={subTabStyle(activeDestacada === "nevuxbot")}>🤖 4. NevuxBot</button>
            <button onClick={() => setActiveDestacada("analytics")} style={subTabStyle(activeDestacada === "analytics")}>📊 5. Analytics</button>
            <button onClick={() => setActiveDestacada("blackfriday")} style={subTabStyle(activeDestacada === "blackfriday")}>🔥 6. Fechas</button>
            <button onClick={() => setActiveDestacada("estilomarca")} style={subTabStyle(activeDestacada === "estilomarca")}>🎨 7. Marca</button>
            <button onClick={() => setActiveDestacada("crossselling")} style={subTabStyle(activeDestacada === "crossselling")}>🧠 8. Cross-Sell</button>
            <button onClick={() => setActiveDestacada("multiidioma")} style={subTabStyle(activeDestacada === "multiidioma")}>🌎 9. Idiomas</button>
            <button onClick={() => setActiveDestacada("voz")} style={subTabStyle(activeDestacada === "voz")}>🎙️ 10. Voz</button>
            <button onClick={() => setActiveDestacada("vendedor")} style={subTabStyle(activeDestacada === "vendedor")}>🤝 11. Vendedor IA</button>
          </div>

          {/* RENDERING PROBLEMA */}
          {activeDestacada === "problema" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>🛑</div>
                  <div style={storyBadgeStyle}>REALIDAD DEL E-COMMERCE</div>
                  <h2 style={storyTitleStyle}>¿Por qué tu tienda vende <span style={{ color: "#fca5a5", textDecoration: "underline" }}>menos</span>?</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING SOLUCION */}
          {activeDestacada === "solucion" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameLightStyle}>
                <div style={storyTopHeaderLight}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "42px", marginBottom: "12px" }}>⚡</div>
                  <div style={storyBadgeLightStyle}>LA SOLUCIÓN DEFINITIVA</div>
                  <h2 style={storyTitleLightStyle}>Una sola app.<br />27 widgets de conversión.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING TESTIMONIOS WHATSAPP */}
          {activeDestacada === "testimonios" && (
            <div style={storyContainerStyle}>
              <div style={whatsappFrameStyle}>
                <WhatsAppHeader name="Mariana Cliente" status="en línea" emoji="🧥" />
                <div style={whatsappBodyStyle}>
                  <BlurBubble text="Hola Rodri! Todo bien?" isLeft={true} />
                  <div style={highlightBubbleStyle}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Rodri boludo GRACIAS desde q instalé nevux subí el ticket promedio 35% en 3 semanas. La app es una locura, se instala re fácil y la tabla de talles es un 10.
                    </div>
                  </div>
                </div>
                <WhatsAppFooter />
              </div>
            </div>
          )}

          {/* RENDERING NEVUXBOT */}
          {activeDestacada === "nevuxbot" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🤖</div>
                  <h2 style={storyTitleStyle}>NevuxBot IA:<br />El Vendedor 24/7</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING ANALYTICS */}
          {activeDestacada === "analytics" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>📊</div>
                  <h2 style={storyTitleStyle}>ROI Tracker:<br />Facturación en Vivo</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING BLACKFRIDAY */}
          {activeDestacada === "blackfriday" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔥</div>
                  <h2 style={storyTitleStyle}>Black Friday activado con <span style={{ color: "#fbbf24" }}>1 clic</span></h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING ESTILO MARCA */}
          {activeDestacada === "estilomarca" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎨</div>
                  <h2 style={storyTitleStyle}>Tus estilos, tus colores. <span style={{ color: "#10B981" }}>Auto-detectables</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING CROSS-SELLING */}
          {activeDestacada === "crossselling" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🧠</div>
                  <h2 style={storyTitleStyle}>Recomendaciones IA: <span style={{ color: "#10B981" }}>Venta Cruzada</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING MULTI-IDIOMA */}
          {activeDestacada === "multiidioma" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🌎</div>
                  <h2 style={storyTitleStyle}>Multi-Idioma con IA: <span style={{ color: "#10B981" }}>Vende sin fronteras</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING VOZ */}
          {activeDestacada === "voz" && (
            <div style={storyContainerStyle}>
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎙️</div>
                  <h2 style={storyTitleStyle}>Búsqueda por Voz: <span style={{ color: "#10B981" }}>Comprar hablando</span>.</h2>
                </div>
              </div>
            </div>
          )}

          {/* 🤝 DESTACADA 11: VENDEDOR VIRTUAL IA */}
          {activeDestacada === "vendedor" && (
            <div style={storyContainerStyle}>
              <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                👇 Sacale captura de pantalla vertical a cada tarjeta para armar tu destacada final
              </div>

              {/* H1: PORTADA */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>🤝</div>
                  <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.2)", border: "1.5px solid #10B981", color: "#ffffff", fontSize: "10px", fontWeight: 900, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.05em" }}>VENDEDOR CON INTELIGENCIA ARTIFICIAL</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, margin: "0 0 16px 0", letterSpacing: "-0.03em" }}>Vendedor Virtual IA: <span style={{ color: "#10B981" }}>Ventas 24/7</span>.</h2>
                  <p style={{ fontSize: "14px", color: "#d1fae5", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>Un agente inteligente que conoce tu catálogo completo, asesora a tus clientes y cierra compras mientras dormís.</p>
                </div>
                <div style={storyBottomSwipe}>¿Cómo funciona? Deslizá ➔</div>
              </div>

              {/* H2: EL PROBLEMA NOCHE Y DEMORAS */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>⏰❌</div>
                  <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>VENTAS PERDIDAS POR DEMORA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>Responder a las 2 AM es imposible</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#fca5a5", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>El 40% de las compras online ocurren de noche o fines de semana. Si un cliente no recibe respuesta en 5 minutos, compra en otra tienda.</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>Perdés ventas todos los días por no estar online.</p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H3: ASESORAMIENTO REAL */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🧠</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>ENTRENADO WITH TIENDA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>Sabe de precios, stock, medidas y envíos</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>Nevux sincroniza tu catálogo en tiempo real. La IA responde como tu mejor empleado de mostrador: con empatía, fotos y enlaces directos.</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#34d399", fontWeight: 900, margin: 0 }}>No es un bot rígido, es un vendedor real 🤝</p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H4: CIERRE ADENTRO DEL CHAT */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>💬</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>CONVERSIÓN DIRECTA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>Arma el pedido adentro del chat</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>El cliente indica lo que quiere y la IA genera el link de pago final listo con descuentos y cupones aplicados.</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, margin: 0 }}>Fricción cero = Cierre instantáneo.</p>
                </div>
                <div style={storyBottomSwipe}>Siguiente ➔</div>
              </div>

              {/* H5: +85% DUDAS RESUELTAS */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>📈</div>
                  <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px" }}>AUTONOMÍA ABSOLUTA</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", lineHeight: 1.25, margin: "0 0 12px 0" }}>85% de consultas resueltas sin tu tiempo</h3>
                  <div style={bubbleDarkStyle}>
                    <p style={{ fontSize: "12px", color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>Ahorrá 4 horas diarias de contestar los mismos mensajes. Tu negocio escala mientras vos te enfocás en crecer.</p>
                  </div>
                </div>
                <div style={storyBottomSwipe}>Prueba gratis ➔</div>
              </div>

              {/* H6: CTA FINAL ROADMAP */}
              <div style={storyFrameStyle}>
                <div style={storyTopHeader}>
                  <NevuxLogo size="small" />
                </div>
                <div style={{ textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
                  <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, margin: "0 0 14px 0" }}>La suite más potente de Tiendanube</h2>
                  <p style={{ fontSize: "14px", color: "#10B981", fontWeight: 800, margin: "0 0 16px 0" }}>Próximamente en Nevux 🤝</p>
                  <div style={{ ...bubbleDarkStyle, border: "2px solid #10B981", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)" }}>
                    <p style={{ fontSize: "12px", color: "#ffffff", fontWeight: 700, margin: 0, lineHeight: 1.45 }}>Sumate hoy a Nevux por $30.000 ARS/mes, aprovechá tus 7 días gratis y asegurá tu lugar en todas las fases del roadmap.</p>
                  </div>
                </div>
                <div style={{ ...storyBottomSwipe, color: "#34d399", fontWeight: 900 }}>Probá Nevux en: nexus2026-gx7e.vercel.app</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PORTADAS DESTACADAS CIRCULARES */}
      {activeTab === "covers" && (
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
            👇 Sacale captura de pantalla en vertical para las tapas de tus historias destacadas en Instagram.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))",
              gap: "16px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🚨</span></div><span style={coverLabelStyle}>1. El Problema</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>⚡</span></div><span style={coverLabelStyle}>2. La Solución</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>💬</span></div><span style={coverLabelStyle}>3. Testimonios</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🤖</span></div><span style={coverLabelStyle}>4. NevuxBot IA</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>📊</span></div><span style={coverLabelStyle}>5. Analytics ROI</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🔥</span></div><span style={coverLabelStyle}>6. Modo Fechas</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🎨</span></div><span style={coverLabelStyle}>7. Estilo Marca</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🧠</span></div><span style={coverLabelStyle}>8. Cross-Selling</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🌎</span></div><span style={coverLabelStyle}>9. Multi-Idioma</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🎙️</span></div><span style={coverLabelStyle}>10. Búsqueda Voz</span></div>
            <div style={coverContainerStyle}><div style={coverCircleStyle}><span style={{ fontSize: "40px" }}>🤝</span></div><span style={coverLabelStyle}>11. Vendedor IA</span></div>
          </div>
        </div>
      )}

      {/* 🌟 TAB 5: CARRUSELES INSTAGRAM */}
      {activeTab === "carousels" && (
        <div
          style={{
            width: "100%",
            maxWidth: "750px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxSizing: "border-box",
          }}
        >
          {/* PANEL DE CONTROL DE CARRUSEL */}
          <div
            style={{
              backgroundColor: "#0b2920",
              borderRadius: "16px",
              padding: "20px",
              border: "1.5px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {/* SELECTOR DE WIDGET */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 800, color: "#6ee7b7" }}>
                  WIDGET CAMPAÑA
                </label>
                <select
                  value={selectedWidget}
                  onChange={(e) => setSelectedWidget(e.target.value)}
                  style={{
                    backgroundColor: "#061a14",
                    color: "#ffffff",
                    border: "1.5px solid rgba(16, 185, 129, 0.4)",
                    borderRadius: "10px",
                    padding: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {CAROUSEL_TEMPLATES.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.emoji} {isPt ? t.namePt : t.nameEs}
                    </option>
                  ))}
                </select>
              </div>

              {/* SELECTOR DE FORMATO */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 800, color: "#6ee7b7" }}>
                  FORMATO INSTAGRAM
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => setFormat("portrait")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: format === "portrait" ? "#10B981" : "#061a14",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Smartphone size={14} /> Vertical 4:5
                  </button>
                  <button
                    onClick={() => setFormat("square")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: format === "square" ? "#10B981" : "#061a14",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Square size={14} /> Cuadrado 1:1
                  </button>
                </div>
              </div>
            </div>

            {/* IDIOMA Y RECOMENDACIÓN */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(16, 185, 129, 0.15)",
                paddingTop: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setLang("es")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 800,
                    border: "none",
                    backgroundColor: !isPt ? "rgba(16, 185, 129, 0.2)" : "transparent",
                    color: !isPt ? "#10B981" : "#6ee7b7",
                    cursor: "pointer",
                  }}
                >
                  🇪🇸 ES
                </button>
                <button
                  onClick={() => setLang("pt")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 800,
                    border: "none",
                    backgroundColor: isPt ? "rgba(16, 185, 129, 0.2)" : "transparent",
                    color: isPt ? "#10B981" : "#6ee7b7",
                    cursor: "pointer",
                  }}
                >
                  🇧🇷 PT-BR
                </button>
              </div>

              <span style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
                {isPt
                  ? "💡 Toque em baixar para exportar o slide em HD nativo."
                  : "💡 Tocá en descargar para exportar el slide en HD nativo."}
              </span>
            </div>
          </div>

          {/* GRILLA DE SLIDES DEL CARRUSEL SELECCIONADO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              width: "100%",
              alignItems: "center",
            }}
          >
            {currentTemplate.slides.map((slide, index) => {
              const isPortrait = format === "portrait";
              const aspectWidth = 340;
              const aspectHeight = isPortrait ? 425 : 340; // Proporción 4:5 vs 1:1 en renderizado responsivo móvil

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    maxWidth: "360px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "0 8px",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 900, color: "#10B981" }}>
                      SLIDE {index + 1} ({slide.visualType.toUpperCase()})
                    </span>
                    <button
                      disabled={isDownloading}
                      onClick={() => downloadSlideAsImage(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6ee7b7",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      <Download size={14} /> {isPt ? "Baixar" : "Descargar"}
                    </button>
                  </div>

                  {/* LIENZO DE PREVISUALIZACIÓN EN PANTALLA */}
                  <div
                    style={{
                      width: `${aspectWidth}px`,
                      height: `${aspectHeight}px`,
                      background: `radial-gradient(circle at center, ${currentTemplate.themeColor} 0%, #020617 100%)`,
                      border: "2px solid #10B981",
                      borderRadius: "20px",
                      padding: "20px 16px 14px",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      overflow: "hidden",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Efecto de luz superior */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-20%",
                        width: "80%",
                        height: "40%",
                        background: "rgba(16, 185, 129, 0.12)",
                        filter: "blur(40px)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Header */}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: "8px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        zIndex: 2,
                      }}
                    >
                      <NevuxLogo size="small" />
                    </div>

                    {/* Contenido Central */}
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        zIndex: 2,
                        margin: "12px 0",
                      }}
                    >
                      {/* Badge superior */}
                      <span
                        style={{
                          display: "inline-block",
                          border: `1.5px solid ${currentTemplate.accentColor}`,
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "#ffffff",
                          fontSize: "8.5px",
                          fontWeight: 900,
                          padding: "3px 10px",
                          borderRadius: "999px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {isPt ? slide.badgePt : slide.badgeEs}
                      </span>

                      {/* Título adaptado según formato */}
                      <h3
                        style={{
                          fontSize: isPortrait ? "19px" : "16px",
                          fontWeight: 900,
                          color: "#ffffff",
                          lineHeight: 1.2,
                          margin: 0,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {isPt ? slide.titlePt : slide.titleEs}
                      </h3>
                    </div>

                    {/* Contenedor de Texto Descriptivo Inferior */}
                    <div
                      style={{
                        width: "100%",
                        background: "rgba(0, 0, 0, 0.35)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        borderRadius: "14px",
                        padding: "10px 12px",
                        boxSizing: "border-box",
                        zIndex: 2,
                        marginBottom: "10px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: isPortrait ? "11.5px" : "10px",
                          color: "#a7f3d0",
                          margin: 0,
                          lineHeight: 1.4,
                          fontWeight: 500,
                          textAlign: "center",
                        }}
                      >
                        {isPt ? slide.descPt : slide.descEs}
                      </p>
                    </div>

                    {/* Swipe Footer */}
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        color: currentTemplate.accentColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        width: "100%",
                        textAlign: "center",
                        zIndex: 2,
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        paddingTop: "10px",
                      }}
                    >
                      {isPt ? "DESLIZE PARA VER ➔" : "DESLIZÁ PARA VER ➔"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
