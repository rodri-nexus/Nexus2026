"use client";

import React from "react";

interface WidgetPreviewProps {
  slug?: string;
  widgetSlug?: string;
}

export default function WidgetPreview({ slug, widgetSlug }: WidgetPreviewProps) {
  const activeSlug = (slug || widgetSlug || "").trim().toLowerCase();

  switch (activeSlug) {
    case "barra-descuento":
      return <BarraDescuentoPreview />;
    case "envio-gratis":
      return <EnvioGratisPreview />;
    case "temporizador":
      return <TemporizadorPreview />;
    case "contador-stock":
      return <ContadorStockPreview />;
    case "notificacion-compras":
      return <NotificacionComprasPreview />;
    case "resenas-estrellas":
      return <ResenasEstrellasPreview />;
    case "popups":
      return <PopupsPreview />;
    case "sticky-add-to-cart":
    case "barra-accion":
      return <StickyAddToCartPreview />;
    case "whatsapp-chat":
      return <WhatsappChatPreview />;
    case "faq-acordeon":
      return <FaqAcordeonPreview />;
    case "banner-promocional":
      return <BannerPromocionalPreview />;
    case "alerta-stock":
    case "alerta-inventario":
      return <AlertaStockPreview />;
    case "tabla-talles":
      return <TablaTallesPreview />;
    case "comparador-productos":
      return <ComparadorProductosPreview />;
    case "cupon-descuento":
      return <CuponDescuentoPreview />;
    case "video-producto":
      return <VideoProductoPreview />;
    case "sellos-confianza":
      return <SellosConfianzaPreview />;
    case "selector-moneda":
      return <SelectorMonedaPreview />;
    case "calculadora-envio":
      return <CalculadoraEnvioPreview />;
    case "ruleta-descuentos":
      return <RuletaDescuentosPreview />;
    case "carrusel-marcas":
      return <CarruselMarcasPreview />;
    case "galeria-instagram":
      return <GaleriaInstagramPreview />;
    case "audio-producto":
      return <AudioProductoPreview />;
    case "vista-360":
      return <Vista360Preview />;
    case "previsualizador-3d":
      return <Previsualizador3DPreview />;
    case "asistente-talles-ai":
      return <AsistenteTallesAIPreview />;
    case "recomendador-personalizado":
      return <RecomendadorPersonalizadoPreview />;
    case "caja-suscripcion":
      return <CajaSuscripcionPreview />;
    case "compras-juntas":
      return <ComprasJuntasPreview />;
    case "tienda-regalos":
      return <TiendaRegalosPreview />;
    case "social-proof-vivo":
      return <SocialProofVivoPreview />;
    case "badge-garantia":
      return <BadgeGarantiaPreview />;
    case "badge-efectivo":
      return <BadgeEfectivoPreview />;
    case "barra-progreso-envio":
      return <BarraProgresoEnvioPreview />;
    case "cronometro-oferta":
      return <CronometroOfertaPreview />;
    case "verificador-codigo-postal":
      return <VerificadorCodigoPostalPreview />;
    case "banner-rotativo":
      return <BannerRotativoPreview />;
    case "banner-superior":
    case "banner-anuncios-top":
      return <BannerAnunciosTopPreview />;
    case "combos-descuento":
    case "bundle-promociones":
      return <CombosDescuentoPreview />;
    case "regalo-por-compra":
      return <RegaloPorCompraPreview />;
    case "wishlist-guardados":
      return <WishlistGuardadosPreview />;
    case "share-social":
      return <ShareSocialPreview />;
    case "notificacion-envio-hoy":
      return <NotificacionEnvioHoyPreview />;
    case "calculadora-cuotas":
    case "barra-cuotas-sin-interes":
      return <CalculadoraCuotasPreview />;
    case "popups-inteligente":
      return <PopupsInteligentePreview />;
    case "upsell-carrito":
      return <UpsellCarritoPreview />;
    case "cross-sell":
      return <CrossSellPreview />;
    case "productos-complementarios":
      return <ProductosComplementariosPreview />;
    case "medios-pago":
      return <MediosPagoPreview />;
    default:
      return <GenericWidgetPreview slug={activeSlug} />;
  }
}

function GenericWidgetPreview({ slug }: { slug: string }) {
  const formattedName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Widget Preview";

  return (
    <div style={{ background: "#ffffff", border: "1.5px solid #10B981", borderRadius: "8px", padding: "8px 10px", width: "94%", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px" }}>✨</span>
        <span style={{ fontSize: "8.5px", fontWeight: 800, color: "#111827" }}>{formattedName}</span>
      </div>
      <span style={{ fontSize: "7px", background: "#ecfdf5", color: "#059669", padding: "2px 5px", borderRadius: "4px", fontWeight: 700 }}>
        Nevux
      </span>
    </div>
  );
}

function BarraDescuentoPreview() {
  return (
    <div style={{ background: "#10B981", color: "#ffffff", padding: "8px 12px", textAlign: "center", fontSize: "11px", fontWeight: 700, borderRadius: "6px", width: "100%", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      🔥 ¡15% OFF en tu primera compra con el cupón NEVUX15!
    </div>
  );
}

function EnvioGratisPreview() {
  return (
    <div style={{ background: "#ecfdf5", border: "1px dashed #10B981", color: "#065f46", padding: "8px 12px", borderRadius: "6px", fontSize: "10px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 600 }}>
      <span>🚚</span> ¡Envío gratis alcanzado!
    </div>
  );
}

function TemporizadorPreview() {
  return (
    <div style={{ background: "#111827", color: "#ffffff", padding: "8px 12px", borderRadius: "6px", fontSize: "10px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontWeight: 600 }}>La oferta termina en:</span>
      <span style={{ background: "#10B981", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace", fontWeight: 800 }}>02:45:12</span>
    </div>
  );
}

function ContadorStockPreview() {
  return (
    <div style={{ background: "#fef2f2", color: "#991b1b", padding: "6px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></span>
      ¡Casi agotado! Solo quedan 3 unidades
    </div>
  );
}

function NotificacionComprasPreview() {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", padding: "8px 12px", borderRadius: "8px", fontSize: "10px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
      <span style={{ fontSize: "16px" }}>🛍️</span>
      <div>
        <div style={{ fontWeight: 700, color: "#111827" }}>María S. de Buenos Aires</div>
        <div style={{ color: "#6b7280", fontSize: "9px" }}>Compró un producto hace 3 min</div>
      </div>
    </div>
  );
}

function ResenasEstrellasPreview() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#fbbf24", fontWeight: 700 }}>
      ★★★★★ <span style={{ color: "#374151", fontSize: "10px", fontWeight: 500 }}>(48 reseñas)</span>
    </div>
  );
}

function PopupsPreview() {
  return (
    <div style={{ background: "#ffffff", border: "2px solid #10B981", padding: "12px", borderRadius: "10px", textAlign: "center", width: "90%", boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}>
      <div style={{ fontSize: "12px", fontWeight: 800, color: "#111827" }}>¡Obtené 10% OFF!</div>
      <div style={{ fontSize: "9px", color: "#6b7280", margin: "4px 0 8px" }}>Suscribite a nuestro boletín</div>
      <div style={{ background: "#10B981", color: "#fff", padding: "6px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>QUIERO MI DESCUENTO</div>
    </div>
  );
}

function StickyAddToCartPreview() {
  return (
    <div style={{ background: "#ffffff", borderTop: "2px solid #10B981", padding: "8px 12px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
      <span style={{ fontSize: "10px", fontWeight: 700, color: "#111827" }}>Producto Demo</span>
      <div style={{ background: "#10B981", color: "#ffffff", padding: "6px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: 700 }}>Agregar $12.500</div>
    </div>
  );
}

function WhatsappChatPreview() {
  return (
    <div style={{ background: "#25d366", color: "#ffffff", padding: "8px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      <span>💬</span> ¿Necesitás ayuda?
    </div>
  );
}

function FaqAcordeonPreview() {
  return (
    <div style={{ width: "95%", display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "6px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
        <span>¿Cuáles son las formas de pago?</span>
        <span>+</span>
      </div>
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "6px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
        <span>¿Hacen envíos a todo el país?</span>
        <span>+</span>
      </div>
    </div>
  );
}

function BannerPromocionalPreview() {
  return (
    <div style={{ background: "linear-gradient(90deg, #10B981, #059669)", color: "#fff", padding: "10px", borderRadius: "8px", width: "95%", textAlign: "center" }}>
      <div style={{ fontSize: "11px", fontWeight: 800 }}>NUEVA COLECCIÓN</div>
      <div style={{ fontSize: "9px", opacity: 0.9 }}>Hasta 30% OFF en seleccionados</div>
    </div>
  );
}

function AlertaStockPreview() {
  return (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "6px 10px", borderRadius: "4px", fontSize: "9px", color: "#991b1b", fontWeight: 700, width: "92%" }}>
      ⚠️ Quedan pocas unidades en inventario
    </div>
  );
}

function TablaTallesPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px", width: "95%", background: "#fff" }}>
      <div style={{ fontSize: "9px", fontWeight: 700, marginBottom: "4px", color: "#111827" }}>Guía de Talles (cm)</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", fontSize: "8px", textAlign: "center", background: "#f3f4f6", padding: "2px", borderRadius: "3px" }}>
        <span>Talle</span><span>Pecho</span><span>Largo</span>
        <span>S</span><span>90-95</span><span>68</span>
        <span>M</span><span>96-102</span><span>70</span>
      </div>
    </div>
  );
}

function ComparadorProductosPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "8px", borderRadius: "6px", width: "95%", background: "#fff", fontSize: "9px" }}>
      <div style={{ fontWeight: 700, color: "#10B981" }}>Comparación rápida</div>
      <div style={{ color: "#6b7280", marginTop: "2px" }}>Modelo A vs Modelo B</div>
    </div>
  );
}

function CuponDescuentoPreview() {
  return (
    <div style={{ border: "1.5px dashed #10B981", background: "#ecfdf5", padding: "8px 12px", borderRadius: "6px", width: "90%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: "8px", color: "#065f46", fontWeight: 600 }}>CUPÓN DE REGALO</div>
        <div style={{ fontSize: "11px", fontWeight: 900, color: "#047857" }}>BIENVENIDA10</div>
      </div>
      <span style={{ fontSize: "8px", background: "#10B981", color: "#fff", padding: "3px 6px", borderRadius: "3px", fontWeight: 700 }}>Copiar</span>
    </div>
  );
}

function VideoProductoPreview() {
  return (
    <div style={{ background: "#111827", color: "#fff", width: "95%", height: "50px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "10px", fontWeight: 600 }}>
      <span>▶</span> Video del producto
    </div>
  );
}

function SellosConfianzaPreview() {
  return (
    <div style={{ display: "flex", gap: "8px", fontSize: "9px", color: "#4b5563", fontWeight: 600 }}>
      <span>🔒 Compra Segura</span>
      <span>⚡ Envío Rápido</span>
      <span>💳 Cuotas</span>
    </div>
  );
}

function SelectorMonedaPreview() {
  return (
    <div style={{ border: "1px solid #d1d5db", padding: "4px 8px", borderRadius: "4px", fontSize: "9px", background: "#fff", fontWeight: 700 }}>
      🌐 ARS ($) / USD ($)
    </div>
  );
}

function CalculadoraEnvioPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "8px", borderRadius: "6px", width: "95%", background: "#fff" }}>
      <div style={{ fontSize: "9px", fontWeight: 700, color: "#111827" }}>Calcular envío</div>
      <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
        <div style={{ border: "1px solid #d1d5db", borderRadius: "3px", padding: "2px 4px", fontSize: "8px", flex: 1, color: "#9ca3af" }}>Tu CP</div>
        <div style={{ background: "#10B981", color: "#fff", padding: "2px 6px", borderRadius: "3px", fontSize: "8px", fontWeight: 700 }}>OK</div>
      </div>
    </div>
  );
}

function RuletaDescuentosPreview() {
  return (
    <div style={{ background: "#10B981", color: "#fff", borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      🎰
    </div>
  );
}

function CarruselMarcasPreview() {
  return (
    <div style={{ display: "flex", gap: "10px", opacity: 0.6, fontSize: "9px", fontWeight: 800 }}>
      <span>BRAND 1</span><span>BRAND 2</span><span>BRAND 3</span>
    </div>
  );
}

function GaleriaInstagramPreview() {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <div style={{ background: "#e5e7eb", width: "24px", height: "24px", borderRadius: "4px" }}></div>
      <div style={{ background: "#e5e7eb", width: "24px", height: "24px", borderRadius: "4px" }}></div>
      <div style={{ background: "#e5e7eb", width: "24px", height: "24px", borderRadius: "4px" }}></div>
    </div>
  );
}

function AudioProductoPreview() {
  return (
    <div style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", padding: "4px 8px", borderRadius: "20px", fontSize: "9px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
      <span>🔊</span> Escuchar demo de voz
    </div>
  );
}

function Vista360Preview() {
  return (
    <div style={{ border: "1px solid #10B981", background: "#ecfdf5", padding: "4px 8px", borderRadius: "4px", fontSize: "9px", color: "#047857", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
      <span>🔄</span> Vista 360° Interactiva
    </div>
  );
}

function Previsualizador3DPreview() {
  return (
    <div style={{ background: "#111827", color: "#fff", padding: "6px 10px", borderRadius: "6px", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
      <span>📦</span> Ver en Realidad Aumentada 3D
    </div>
  );
}

function AsistenteTallesAIPreview() {
  return (
    <div style={{ background: "linear-gradient(90deg, #ecfdf5, #d1fae5)", border: "1px solid #10B981", padding: "6px 8px", borderRadius: "6px", fontSize: "8.5px", color: "#065f46", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
      <span>🤖</span> Recomendador de talle con IA
    </div>
  );
}

function RecomendadorPersonalizadoPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "6px", borderRadius: "6px", width: "95%", background: "#fff" }}>
      <div style={{ fontSize: "8.5px", fontWeight: 800, color: "#111827" }}>Recomendado para vos</div>
      <div style={{ fontSize: "7.5px", color: "#6b7280" }}>Basado en tu navegación</div>
    </div>
  );
}

function CajaSuscripcionPreview() {
  return (
    <div style={{ border: "1.5px solid #10B981", padding: "8px", borderRadius: "6px", width: "90%", background: "#fff" }}>
      <div style={{ fontSize: "9px", fontWeight: 800, color: "#10B981" }}>Suscripción Mensual -15%</div>
      <div style={{ fontSize: "8px", color: "#4b5563" }}>Recibilos automáticamente cada mes</div>
    </div>
  );
}

function ComprasJuntasPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "6px", borderRadius: "6px", width: "95%", background: "#fff" }}>
      <div style={{ fontSize: "8.5px", fontWeight 800, color: "#111827" }}>Frecuentemente comprados juntos</div>
      <div style={{ fontSize: "7.5px", color: "#10B981", fontWeight: 700 }}>Ahorrás 10% llevando ambos</div>
    </div>
  );
}

function TiendaRegalosPreview() {
  return (
    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "6px", borderRadius: "6px", width: "90%", fontSize: "8.5px", color: "#047857", fontWeight: 700, textAlign: "center" }}>
      🎁 ¡Agregá una caja de regalo por $500!
    </div>
  );
}

function SocialProofVivoPreview() {
  return (
    <div style={{ background: "#111827", color: "#fff", padding: "4px 8px", borderRadius: "12px", fontSize: "8.5px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ width: "6px", height: "6px", background: "#10B981", borderRadius: "50%" }}></span> 14 personas viendo esto ahora
    </div>
  );
}

function BadgeGarantiaPreview() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "8.5px", fontWeight: 700, color: "#374151" }}>
      <span style={{ color: "#10B981", fontSize: "12px" }}>🛡️</span> Garantía oficial de 12 meses
    </div>
  );
}

function BadgeEfectivoPreview() {
  return (
    <div style={{ background: "#ecfdf5", border: "1px solid #10B981", padding: "6px 10px", borderRadius: "6px", fontSize: "8.5px", color: "#065f46", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
      <span>💵</span> 10% OFF pagando en Efectivo / Transferencia
    </div>
  );
}

function BarraProgresoEnvioPreview() {
  return (
    <div style={{ width: "90%", display: "flex", flexDirection: "column", gap: "2px" }}>
      <div style={{ fontSize: "8px", fontWeight: 700, color: "#374151" }}>Faltan $3.500 para Envío Gratis</div>
      <div style={{ width: "100%", height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: "70%", height: "100%", background: "#10B981" }}></div>
      </div>
    </div>
  );
}

function CronometroOfertaPreview() {
  return (
    <div style={{ background: "#ef4444", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "8.5px", fontWeight: 800, display: "flex", gap: "4px" }}>
      <span>⏳ Oferta relámpago:</span> <span>05:30</span>
    </div>
  );
}

function VerificadorCodigoPostalPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "6px", borderRadius: "4px", width: "90%", fontSize: "8px", background: "#fff" }}>
      <span style={{ fontWeight: 700 }}>📍 Ingresá tu CP para ver fecha de entrega</span>
    </div>
  );
}

function BannerRotativoPreview() {
  return (
    <div style={{ background: "#111827", color: "#fff", padding: "6px", width: "95%", borderRadius: "4px", textAlign: "center", fontSize: "8.5px", fontWeight: 700 }}>
      ◀ Banner 1 de 3 ▶
    </div>
  );
}

function CombosDescuentoPreview() {
  return (
    <div style={{ border: "1px solid #10B981", background: "#ecfdf5", padding: "6px", borderRadius: "6px", width: "90%", fontSize: "8.5px", color: "#065f46", fontWeight: 700 }}>
      🔥 Combo 2x1 en productos seleccionados
    </div>
  );
}

function RegaloPorCompraPreview() {
  return (
    <div style={{ border: "1px dashed #10B981", padding: "6px", borderRadius: "6px", width: "90%", fontSize: "8.5px", color: "#047857", fontWeight: 700, textAlign: "center" }}>
      🎁 ¡Llevando 2 productos te regalamos un accesorio!
    </div>
  );
}

function WishlistGuardadosPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "4px 8px", borderRadius: "20px", fontSize: "8.5px", fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ color: "#ef4444" }}>♥</span> Guardar en Favoritos
    </div>
  );
}

function ShareSocialPreview() {
  return (
    <div style={{ display: "flex", gap: "6px", fontSize: "8px", fontWeight: 700, color: "#6b7280" }}>
      <span>Compartir:</span> <span>Facebook</span> • <span>WhatsApp</span> • <span>X</span>
    </div>
  );
}

function NotificacionEnvioHoyPreview() {
  return (
    <div style={{ background: "#ecfdf5", border: "1px solid #10B981", padding: "5px 8px", borderRadius: "4px", fontSize: "8.5px", color: "#047857", fontWeight: 700 }}>
      ⚡ Comprá en las próximas 2hs y recibilo HOY
    </div>
  );
}

function BannerAnunciosTopPreview() {
  return (
    <div style={{ background: "#111827", color: "#fff", padding: "4px 8px", width: "100%", textAlign: "center", fontSize: "8px", fontWeight: 700 }}>
      📢 ENVIOS GRATIS A TODO EL PAIS EN COMPRAS MAYORES A $30.000
    </div>
  );
}

function CalculadoraCuotasPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "6px", borderRadius: "6px", width: "90%", fontSize: "8px", background: "#fff" }}>
      <div style={{ fontWeight: 800, color: "#111827" }}>Calculá tus cuotas</div>
      <div style={{ color: "#10B981", fontWeight: 700 }}>Hasta 6 cuotas de $2.083 sin interés</div>
    </div>
  );
}

function PopupsInteligentePreview() {
  return (
    <div style={{ border: "2px solid #10B981", background: "#fff", padding: "8px", borderRadius: "8px", width: "85%", textAlign: "center", fontSize: "8.5px" }}>
      <div style={{ fontWeight: 800, color: "#111827" }}>¿Te vas sin comprar?</div>
      <div style={{ color: "#10B981", fontWeight: 700, marginTop: "2px" }}>Usá el cupón VOLVE5 para un 5% extra</div>
    </div>
  );
}

function UpsellCarritoPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "6px", borderRadius: "6px", width: "95%", background: "#fff" }}>
      <div style={{ fontSize: "8.5px", fontWeight: 800, color: "#111827" }}>Sumá a tu carrito</div>
      <div style={{ fontSize: "7.5px", color: "#6b7280" }}>Funda protectora con 20% OFF</div>
    </div>
  );
}

function CrossSellPreview() {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: "6px", borderRadius: "6px", width: "95%", background: "#fff" }}>
      <div style={{ fontSize: "8.5px", fontWeight: 800, color: "#111827" }}>También te puede interesar</div>
      <div style={{ fontSize: "7.5px", color: "#6b7280" }}>Productos relacionados con tu búsqueda</div>
    </div>
  );
}

function ProductosComplementariosPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "94%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)", border: "1.5px solid #10B981" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "7.5px", fontWeight: 900, color: "#111827", display: "flex", alignItems: "center", gap: "3px" }}>
          <span>🎁</span> PRODUCTOS COMPLEMENTARIOS
        </div>
        <span style={{ fontSize: "6.5px", background: "#ecfdf5", color: "#059669", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>
          Comprá juntos
        </span>
      </div>
      <div style={{ fontSize: "6.5px", color: "#6b7280" }}>
        Llevá este producto y sumá el accesorio recomendado con descuento.
      </div>
    </div>
  );
}

function MediosPagoPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "94%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)", border: "1.5px solid #10B981" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "7.5px", fontWeight: 900, color: "#111827", display: "flex", alignItems: "center", gap: "3px" }}>
          <span>💳</span> MEDIOS DE PAGO Y CUOTAS
        </div>
        <span style={{ fontSize: "6.5px", background: "#ecfdf5", color: "#059669", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>
          🔒 Pago seguro
        </span>
      </div>
      <div style={{ fontSize: "6.5px", color: "#059669", fontWeight: 800 }}>
        ⚡ Hasta 3 cuotas sin interés
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "3px", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 4px", background: "#fff" }}>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#1434CB" }}>VISA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "3px", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 4px", background: "#fff" }}>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#EB001B" }}>MC</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "3px", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 4px", background: "#fff" }}>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#009EE3" }}>MP</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "3px", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 4px", background: "#fff" }}>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#00E599" }}>MODO</span>
        </div>
      </div>
    </div>
  );
      }
