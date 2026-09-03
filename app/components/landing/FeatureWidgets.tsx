"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sparkles,
  Flame,
  ShieldCheck,
  Gift,
  Smartphone,
  Copy,
  Check,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  Bot,
  BarChart3,
  Rocket,
} from "lucide-react";

/* ═══════════════════════════════════════════
   DATOS DE LOS 27 WIDGETS POR OBJETIVO
═══════════════════════════════════════════ */
type Categoria = "todos" | "aov" | "urgencia" | "confianza" | "gamificacion" | "home";

interface WidgetItem {
  id: string;
  nombre: string;
  problemaSolucion: string;
  categoria: Categoria;
  badge: string;
  icono: string;
}

interface CategoriaItem {
  id: Categoria;
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
}

const WIDGETS_DATA: WidgetItem[] = [
  // 💰 AUMENTO DE TICKET PROMEDIO (AOV)
  {
    id: "bundle-promociones",
    nombre: "Bundle Promociones",
    problemaSolucion: "Incentiva a llevar 2 o 3 unidades ofreciendo descuentos automáticos por volumen.",
    categoria: "aov",
    badge: "Más Facturación",
    icono: "📦",
  },
  {
    id: "bundle-cantidad",
    nombre: "Bundle por Cantidad",
    problemaSolucion: "Escala de precios por unidad para que el cliente siempre elija la opción más grande.",
    categoria: "aov",
    badge: "Ticket Alto",
    icono: "🔢",
  },
  {
    id: "pack-complementarios",
    nombre: "Pack 'Comprados Juntos'",
    problemaSolucion: "Suma productos relacionados (ej: remera + cinturón) al carrito en un solo toque.",
    categoria: "aov",
    badge: "Cross-Selling",
    icono: "🛍️",
  },
  {
    id: "extras-interruptor",
    nombre: "Extras con Switch",
    problemaSolucion: "Ofrece packaging de regalo o garantía extendida con un interruptor directo al carrito.",
    categoria: "aov",
    badge: "Margen Extra",
    icono: "🔘",
  },
  {
    id: "barra-progreso",
    nombre: "Barra de Envío Gratis",
    problemaSolucion: "Muestra '¡Te faltan $X para Envío Gratis!' motivando a sumar un producto más.",
    categoria: "aov",
    badge: "Cero Dudas",
    icono: "📊",
  },

  // ⚡ URGENCIA Y CIERRE INMEDIATO
  {
    id: "cuenta-regresiva",
    nombre: "Cuenta Regresiva",
    problemaSolucion: "Crea FOMO con un reloj dinámico de liquidación para que no pospongan la compra.",
    categoria: "urgencia",
    badge: "Venta Rápida",
    icono: "⏳",
  },
  {
    id: "contador-visitas",
    nombre: "Contador de Personas en Vivo",
    problemaSolucion: "Muestra cuántos visitantes miran el producto ahora, demostrando alta demanda.",
    categoria: "urgencia",
    badge: "Prueba Social",
    icono: "👀",
  },
  {
    id: "mensaje-alerta",
    nombre: "Aviso de Últimas Unidades",
    problemaSolucion: "Destaca escasez real ('¡Últimas 2 unidades en stock!') para cerrar en el momento.",
    categoria: "urgencia",
    badge: "Escasez",
    icono: "🚨",
  },
  {
    id: "badge-cupon",
    nombre: "Cupón Troquelado",
    problemaSolucion: "Código de descuento visual con botón de copiado en 1 clic para usar en el checkout.",
    categoria: "urgencia",
    badge: "1 Clic",
    icono: "🎟️",
  },
  {
    id: "banner-deslizante",
    nombre: "Banner Ticker Infinito",
    problemaSolucion: "Cinta continua con promociones y cuotas pasando en la cabecera sin molestar.",
    categoria: "urgencia",
    badge: "Visual",
    icono: "📢",
  },

  // 🛡️ CONFIANZA Y ANTIDEVOLUCIONES
  {
    id: "tabla-talles",
    nombre: "Tabla de Talles Inteligente",
    problemaSolucion: "El cliente elige su talle y se selecciona automáticamente en la tienda. Cero cambios.",
    categoria: "confianza",
    badge: "Antidevolución",
    icono: "📏",
  },
  {
    id: "resenas-foto",
    nombre: "Muro de Fotos Reales (UGC)",
    problemaSolucion: "Tus clientes suben fotos reales de cómo les queda el producto desde su celular.",
    categoria: "confianza",
    badge: "+45% Confianza",
    icono: "📸",
  },
  {
    id: "resenas-clientes",
    nombre: "Calificaciones de Clientes",
    problemaSolucion: "Puntaje de 5 estrellas verificado y testimonios destacados cerca del botón de compra.",
    categoria: "confianza",
    badge: "Reputación",
    icono: "⭐",
  },
  {
    id: "caja-opiniones",
    nombre: "Caja de Opiniones",
    problemaSolucion: "Comentarios reales y preguntas frecuentes justo donde el cliente toma la decisión.",
    categoria: "confianza",
    badge: "Claridad",
    icono: "💬",
  },
  {
    id: "comparador-marca",
    nombre: "Tabla Comparativa",
    problemaSolucion: "Demuestra por qué tu producto es superior vs otras marcas genéricas.",
    categoria: "confianza",
    badge: "Autoridad",
    icono: "⚖️",
  },
  {
    id: "info-compra",
    nombre: "Tarjeta de Compra Unificada",
    problemaSolucion: "Envío, cuotas y descuento por transferencia resumidos en una sola tarjeta elegante.",
    categoria: "confianza",
    badge: "Todo en Uno",
    icono: "✨",
  },
  {
    id: "medios-pago",
    nombre: "Medios de Pago y Tarjetas",
    problemaSolucion: "Muestra claramente con qué tarjetas, pasarelas y bancos pueden pagar.",
    categoria: "confianza",
    badge: "Financiación",
    icono: "💳",
  },
  {
    id: "info-envio",
    nombre: "Plazos de Envío Claros",
    problemaSolucion: "Informa tiempos estimados de entrega para que no teman demoras en el paquete.",
    categoria: "confianza",
    badge: "Logística",
    icono: "🚚",
  },
  {
    id: "info-despacho",
    nombre: "Aviso 'Despachamos en 24hs'",
    problemaSolucion: "Tranquiliza al comprador asegurando despacho rápido en el día.",
    categoria: "confianza",
    badge: "Velocidad",
    icono: "⏱️",
  },
  {
    id: "mensaje-garantia",
    nombre: "Sello de Garantía Oficial",
    problemaSolucion: "Garantía de devolución o cambio sin preguntas para eliminar el miedo al riesgo.",
    categoria: "confianza",
    badge: "Cero Riesgo",
    icono: "🛡️",
  },
  {
    id: "badge-cuotas",
    nombre: "Badge Cuotas sin Interés",
    problemaSolucion: "Destaca 3, 6, 9 o 12 cuotas para compras de valor alto.",
    categoria: "confianza",
    badge: "Facilidades",
    icono: "🏷️",
  },
  {
    id: "badge-envio",
    nombre: "Badge Envío Gratis",
    problemaSolucion: "Insignia visual atractiva para productos con envío bonificado.",
    categoria: "confianza",
    badge: "Beneficio",
    icono: "✈️",
  },
  {
    id: "badge-transferencia",
    nombre: "Badge Descuento Transferencia",
    problemaSolucion: "Destaca el porcentaje de ahorro pagando con transferencia bancaria.",
    categoria: "confianza",
    badge: "Ahorro",
    icono: "🏦",
  },

  // 🎡 INTERACTIVOS Y GAMIFICACIÓN
  {
    id: "ruleta-descuentos",
    nombre: "Ruleta Popup Inteligente",
    problemaSolucion: "Captura emails entregando cupones con blindaje anti-saturación (no molesta al cliente).",
    categoria: "gamificacion",
    badge: "Captura Leads",
    icono: "🎡",
  },

  // 📱 EXPERIENCIA APP EN CELULARES
  {
    id: "menu-circulos",
    nombre: "Historias en la Home",
    problemaSolucion: "Círculos estilo Instagram en tu inicio para navegar colecciones de forma visual.",
    categoria: "home",
    badge: "Mobile First",
    icono: "⭕",
  },
  {
    id: "slider-categorias",
    nombre: "Slider de Categorías",
    problemaSolucion: "Carrusel moderno de colecciones para encontrar rápido lo que buscan.",
    categoria: "home",
    badge: "Navegación",
    icono: "🗂️",
  },
  {
    id: "slider-video",
    nombre: "Slider de Video Vertical",
    problemaSolucion: "Reels y videos de producto para mostrar cómo queda puesto en formato celular.",
    categoria: "home",
    badge: "Estilo TikTok",
    icono: "🎬",
  },
];

const CATEGORIAS: CategoriaItem[] = [
  { id: "todos", label: "Todos los Widgets (27)", icon: Sparkles },
  { id: "aov", label: "💰 Aumentar Ticket", icon: TrendingUp },
  { id: "urgencia", label: "⚡ Generar Urgencia", icon: Flame },
  { id: "confianza", label: "🛡️ Confianza & Talles", icon: ShieldCheck },
  { id: "gamificacion", label: "🎡 Gamificación", icon: Gift },
  { id: "home", label: "📱 Estilo App", icon: Smartphone },
];

export default function FeatureWidgets() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("todos");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) hours = 23;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("NEVUX20");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const widgetsFiltrados =
    categoriaActiva === "todos"
      ? WIDGETS_DATA
      : WIDGETS_DATA.filter((w) => w.categoria === categoriaActiva);

  return (
    <section
      id="widgets"
      style={{
        padding: "5rem 1.25rem",
        background: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        
        {/* Encabezado Principal */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 1rem",
              background: "#ecfdf5",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#059669",
              fontWeight: 800,
              letterSpacing: "0.03em",
              border: "1px solid #a7f3d0",
              marginBottom: "1rem",
            }}
          >
            <Zap size={14} />
            HERRAMIENTAS DISEÑADAS PARA CERRAR VENTAS
          </div>

          <h2
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.85rem)",
              fontWeight: 900,
              color: "#111827",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 1rem 0",
            }}
          >
            Cada widget resuelve un{" "}
            <span style={{ color: "#10B981" }}>obstáculo de compra</span>
          </h2>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "#6b7280",
              lineHeight: 1.6,
              maxWidth: "720px",
              margin: "0 auto",
              fontWeight: 500,
            }}
          >
            Elegí qué querés mejorar hoy en tu tienda: subir el ticket promedio, eliminar dudas de medidas o generar compras rápidas.
          </p>
        </div>

        {/* FILTROS POR OBJETIVO */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "1.25rem",
            marginBottom: "2rem",
            justifyContent: "flex-start",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {CATEGORIAS.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = categoriaActiva === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoriaActiva(cat.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.15rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  border: isSelected ? "1.5px solid #10B981" : "1.5px solid #e5e7eb",
                  background: isSelected ? "#ecfdf5" : "#ffffff",
                  color: isSelected ? "#059669" : "#374151",
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 2px 8px rgba(16, 185, 129, 0.15)" : "none",
                }}
              >
                <IconComponent size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* GRILLA DE WIDGETS */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
            marginBottom: "5rem",
          }}
        >
          <AnimatePresence>
            {widgetsFiltrados.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "18px",
                  padding: "1.35rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "#10B981";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <span style={{ fontSize: "1.85rem" }}>{item.icono}</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "0.25rem 0.65rem",
                        borderRadius: "999px",
                        background: "#ecfdf5",
                        color: "#059669",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", margin: "0 0 0.4rem 0" }}>
                    {item.nombre}
                  </h3>

                  <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.45, margin: 0 }}>
                    {item.problemaSolucion}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "0.85rem",
                    borderTop: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#10B981",
                  }}
                >
                  <span>Activalo en 1 clic</span>
                  <Check size={15} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ═══════════════════════════════════════════
           SECCIÓN: LO QUE SE VIENE EN NEVUX (ROADMAP)
        ═══════════════════════════════════════════ */}
        <div
          style={{
            background: "linear-gradient(135deg, #111827 0%, #030712 100%)",
            borderRadius: "28px",
            border: "1.5px solid #1f2937",
            padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)",
            color: "#ffffff",
            marginBottom: "5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 3rem auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.85rem",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#10B981",
                marginBottom: "0.75rem",
              }}
            >
              <Rocket size={14} />
              INNOVACIÓN CONSTANTE
            </div>

            <h3 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, margin: "0 0 0.75rem 0" }}>
              Lo que se viene en el ecosistema Nevux
            </h3>

            <p style={{ fontSize: "0.95rem", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
              Nevux no se queda quieto. Tu suscripción única incluye automáticamente todas las nuevas tecnologías que lanzamos mes a mes sin costo extra.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {/* Feature 1: NevuxBot IA CRM */}
            <div style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "18px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "10px", color: "#059669" }}>
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800 }}>NevuxBot IA CRM</div>
                  <span style={{ fontSize: "10px", color: "#10B981", fontWeight: 700 }}>● Próxima Actualización</span>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
                Detección automática de carritos abandonados con generación de mensajes persuasivos con IA y disparo directo a WhatsApp en 1 clic.
              </p>
            </div>

            {/* Feature 2: A/B Testing Predictivo */}
            <div style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "18px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "10px", color: "#059669" }}>
                  <BarChart3 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800 }}>Analytics de Facturación Extra</div>
                  <span style={{ fontSize: "10px", color: "#10B981", fontWeight: 700 }}>● En Desarrollo</span>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
                Métricas en tiempo real que te muestran con exactitud cuántos pesos extra facturaste gracias a cada widget activado.
              </p>
            </div>

            {/* Feature 3: Nuevos Formatos de Storytelling */}
            <div style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "18px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "10px", color: "#059669" }}>
                  <Smartphone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800 }}>Nuevos Widgets Nativos</div>
                  <span style={{ fontSize: "10px", color: "#10B981", fontWeight: 700 }}>● Sin Costo Adicional</span>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
                Nuevas herramientas de gamificación y formatos de video interactivo para mantener tu tienda siempre un paso adelante de la competencia.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
           MOCKUPS INTERACTIVOS EN VIVO
        ═══════════════════════════════════════════ */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: "28px",
            border: "1.5px solid #e5e7eb",
            padding: "2.5rem 1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#111827", margin: "0 0 0.5rem 0" }}>
              Así interactúan tus clientes con Nevux
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280", margin: 0 }}>
              Probá los botones directamente desde esta pantalla
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Mockup 1: Cupón */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem", border: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <div style={{ background: "#10B981", borderRadius: "8px", padding: "0.35rem", color: "#ffffff", display: "flex" }}>
                    <Tag size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 700 }}>CIERRE DE VENTA</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Badge Cupón Troquelado</div>
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "14px", padding: "1.25rem 1rem", color: "#ffffff", textAlign: "center", position: "relative", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.9 }}>CUPÓN ESPECIAL HOY</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                    NEVUX20
                  </div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.85 }}>20% OFF en tu compra</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCoupon}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: copied ? "#059669" : "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s",
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "¡Cupón Copiado!" : "Copiar Cupón (Probar Clic)"}</span>
              </button>
            </div>

            {/* Mockup 2: Contador de Oferta */}
            <div style={{ background: "linear-gradient(135deg, #111827, #1f2937)", borderRadius: "20px", padding: "1.5rem", color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 800, color: "#a7f3d0", margin: "0 auto 0.75rem auto" }}>
                <Clock size={12} />
                URGENCIA EN TIEMPO REAL
              </div>

              <div style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
                ¡Oferta de Despacho Inmediato! 🔥
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "1.25rem" }}>
                Comprá antes de que se agoten las unidades
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "0.5rem 0.75rem", borderRadius: "10px", minWidth: "50px" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "monospace" }}>
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6, fontWeight: 700 }}>HORAS</div>
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#10B981", alignSelf: "center" }}>:</div>
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "0.5rem 0.75rem", borderRadius: "10px", minWidth: "50px" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "monospace" }}>
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6, fontWeight: 700 }}>MIN</div>
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#10B981", alignSelf: "center" }}>:</div>
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "0.5rem 0.75rem", borderRadius: "10px", minWidth: "50px" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "monospace" }}>
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6, fontWeight: 700 }}>SEG</div>
                </div>
              </div>
            </div>

            {/* Mockup 3: Tabla Interactiva y Gamificación */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem", border: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <div style={{ background: "#10B981", borderRadius: "8px", padding: "0.35rem", color: "#ffffff", display: "flex" }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 700 }}>EXPERIENCIA SIN FRICCIÓN</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Talles + Ruleta</div>
                  </div>
                </div>

                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "10px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#166534" }}>📏 Talles con Selección Real</div>
                  <div style={{ fontSize: "0.75rem", color: "#15803d" }}>El cliente elige el talle y se selecciona automáticamente en el carrito.</div>
                </div>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1e293b" }}>🎡 Ruleta Anti-Saturación</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Captura leads y sólo se muestra una vez por cliente para no molestar.</div>
                </div>
              </div>

              <a
                href="/registro"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  padding: "0.75rem",
                  background: "#10B981",
                  color: "#ffffff",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  textDecoration: "none",
                  marginTop: "1rem",
                }}
              >
                <span>Probar Nevux 7 días gratis</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  }
