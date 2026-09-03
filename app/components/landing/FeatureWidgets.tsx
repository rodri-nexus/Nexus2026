"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sparkles,
  ShoppingBag,
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
} from "lucide-react";

/* ═══════════════════════════════════════════
   DATOS DE LOS 27 WIDGETS DE NEVUX
═══════════════════════════════════════════ */
type Categoria = "todos" | "aov" | "urgencia" | "confianza" | "gamificacion" | "home";

interface WidgetItem {
  id: string;
  nombre: string;
  descripcion: string;
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
    descripcion: "Packs de 'Llevá 2 con 10% OFF, llevá 3 con 20% OFF'.",
    categoria: "aov",
    badge: "Más Vendido",
    icono: "📦",
  },
  {
    id: "bundle-cantidad",
    nombre: "Bundle Cantidad",
    descripcion: "Selector escalonado de unidades con descuentos automáticos.",
    categoria: "aov",
    badge: "Alto Impacto",
    icono: "🔢",
  },
  {
    id: "pack-complementarios",
    nombre: "Pack Complementarios",
    descripcion: "Sección 'Frecuentemente comprados juntos' con 1 clic.",
    categoria: "aov",
    badge: "Cross-selling",
    icono: "🛍️",
  },
  {
    id: "extras-interruptor",
    nombre: "Extras con Interruptor",
    descripcion: "Agregá garantías, packaging de regalo o accesorios al carrito.",
    categoria: "aov",
    badge: "Upselling",
    icono: "🔘",
  },
  {
    id: "barra-progreso",
    nombre: "Barra de Progreso",
    descripcion: "'¡Te faltan $X para Envío Gratis!' motivando a sumar productos.",
    categoria: "aov",
    badge: "Indispensable",
    icono: "📊",
  },

  // ⚡ URGENCIA Y CONVERSIÓN
  {
    id: "cuenta-regresiva",
    nombre: "Cuenta Regresiva",
    descripcion: "Reloj dinámico de liquidaciones y ofertas de tiempo limitado.",
    categoria: "urgencia",
    badge: "FOMO",
    icono: "⏳",
  },
  {
    id: "contador-visitas",
    nombre: "Contador de Visitas",
    descripcion: "'X personas están viendo este producto ahora mismo'.",
    categoria: "urgencia",
    badge: "Prueba Social",
    icono: "👀",
  },
  {
    id: "mensaje-alerta",
    nombre: "Mensaje de Alerta",
    descripcion: "Destacados urgentes como '¡Últimas 2 unidades en stock!'.",
    categoria: "urgencia",
    badge: "Escasez",
    icono: "🚨",
  },
  {
    id: "banner-deslizante",
    nombre: "Banner Deslizante",
    descripcion: "Cinta infinita ticker con cupones, beneficios y anuncios.",
    categoria: "urgencia",
    badge: "Visual",
    icono: "📢",
  },
  {
    id: "badge-cupon",
    nombre: "Badge Cupón",
    descripcion: "Cupón troquelado interactivo con botón 'Copiar código'.",
    categoria: "urgencia",
    badge: "1 Clic",
    icono: "🎟️",
  },

  // 🛡️ CONFIANZA Y SOCIAL PROOF
  {
    id: "tabla-talles",
    nombre: "Tabla de Talles Inteligente",
    descripcion: "Modal interactivo con botón 'Elegir talle' que selecciona la variante.",
    categoria: "confianza",
    badge: "Antidevoluciones",
    icono: "📏",
  },
  {
    id: "resenas-foto",
    nombre: "Reseñas con Fotos UGC",
    descripcion: "Muro de fotos reales de clientes subidas desde su celular.",
    categoria: "confianza",
    badge: "Conversión +40%",
    icono: "📸",
  },
  {
    id: "resenas-clientes",
    nombre: "Reseñas de Clientes",
    descripcion: "Testimonios y calificaciones 5 estrellas verificadas.",
    categoria: "confianza",
    badge: "Reputación",
    icono: "⭐",
  },
  {
    id: "caja-opiniones",
    nombre: "Caja de Opiniones",
    descripcion: "Comentarios destacados debajo del botón de compra.",
    categoria: "confianza",
    badge: "Confianza",
    icono: "💬",
  },
  {
    id: "comparador-marca",
    nombre: "Comparador de Marca",
    descripcion: "Tabla visual de 'Nosotros vs Otras Marcas' derribando dudas.",
    categoria: "confianza",
    badge: "Autoridad",
    icono: "⚖️",
  },
  {
    id: "medios-pago",
    nombre: "Medios de Pago Visuales",
    descripcion: "Tarjetas, transferencias y pasarelas con logos de alta calidad.",
    categoria: "confianza",
    badge: "Claridad",
    icono: "💳",
  },
  {
    id: "info-compra",
    nombre: "Información de Compra Unificada",
    descripcion: "Envío + Cuotas + Descuento por transferencia en una sola tarjeta.",
    categoria: "confianza",
    badge: "Todo en Uno",
    icono: "✨",
  },
  {
    id: "info-envio",
    nombre: "Información de Envío",
    descripcion: "Tiempos estimados de entrega y transportes disponibles.",
    categoria: "confianza",
    badge: "Logística",
    icono: "🚚",
  },
  {
    id: "info-despacho",
    nombre: "Información de Despacho",
    descripcion: "Avisos de 'Despachamos en el día o en menos de 24hs'.",
    categoria: "confianza",
    badge: "Velocidad",
    icono: "⏱️",
  },
  {
    id: "mensaje-garantia",
    nombre: "Mensaje de Garantía",
    descripcion: "Sellos de devolución garantizada o garantía oficial.",
    categoria: "confianza",
    badge: "Cero Riesgo",
    icono: "🛡️",
  },
  {
    id: "badge-cuotas",
    nombre: "Badge Cuotas",
    descripcion: "Destacador de 3, 6, 9 o 12 cuotas sin interés.",
    categoria: "confianza",
    badge: "Financiación",
    icono: "🏷️",
  },
  {
    id: "badge-envio",
    nombre: "Badge Envío",
    descripcion: "Insignia visual de Envío Gratis a todo el país.",
    categoria: "confianza",
    badge: "Beneficio",
    icono: "✈️",
  },
  {
    id: "badge-transferencia",
    nombre: "Badge Transferencia",
    descripcion: "Porcentaje de descuento automático pagando con transferencia.",
    categoria: "confianza",
    badge: "Ahorro",
    icono: "🏦",
  },

  // 🎡 INTERACTIVOS Y GAMIFICACIÓN
  {
    id: "ruleta-descuentos",
    nombre: "Ruleta de Descuentos",
    descripcion: "Popup gamificado para capturar emails antes de que el cliente se vaya.",
    categoria: "gamificacion",
    badge: "Anti-Saturación",
    icono: "🎡",
  },

  // 📱 HOME Y NAVEGACIÓN
  {
    id: "menu-circulos",
    nombre: "Menú de Círculos (Historias)",
    descripcion: "Historias estilo Instagram en la Home para navegar categorías.",
    categoria: "home",
    badge: "Mobile First",
    icono: "⭕",
  },
  {
    id: "slider-categorias",
    nombre: "Slider de Categorías",
    descripcion: "Carrusel visual moderno de colecciones y novedades.",
    categoria: "home",
    badge: "Diseño App",
    icono: "🗂️",
  },
  {
    id: "slider-video",
    nombre: "Slider de Video",
    descripcion: "Reels y videos de productos interactivos en formato vertical.",
    categoria: "home",
    badge: "TikTok Style",
    icono: "🎬",
  },
];

const CATEGORIAS: CategoriaItem[] = [
  { id: "todos", label: "Todos (27)", icon: Sparkles },
  { id: "aov", label: "💰 Aumentar Ticket", icon: TrendingUp },
  { id: "urgencia", label: "⚡ Urgencia", icon: Flame },
  { id: "confianza", label: "🛡️ Confianza", icon: ShieldCheck },
  { id: "gamificacion", label: "🎡 Interactivos", icon: Gift },
  { id: "home", label: "📱 Estilo App", icon: Smartphone },
];

export default function FeatureWidgets() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("todos");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 42 });

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
        {/* Badge Superior */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
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
            }}
          >
            <Zap size={14} />
            ARSENAL COMPLETO DE CONVERSIÓN
          </div>
        </motion.div>

        {/* Título de la Sección */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.85rem)",
            fontWeight: 900,
            color: "#111827",
            textAlign: "center",
            margin: "0 0 1rem 0",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          27 Soluciones Diseñadas Para{" "}
          <span style={{ color: "#10B981" }}>Vender Más</span>
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "720px",
            margin: "0 auto 3rem auto",
            fontWeight: 500,
          }}
        >
          Todas incluidas en tu suscripción única. Activá las que necesitás en 1 clic
          sin saturar la velocidad de tu Tiendanube.
        </motion.p>

        {/* FILTROS DE CATEGORÍAS (TABS HORIZONTALES) */}
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
                  padding: "0.6rem 1.1rem",
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

        {/* GRILLA PRINCIPAL DE LOS 27 WIDGETS */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
            marginBottom: "4.5rem",
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
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "#a7f3d0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.03)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "1.75rem" }}>{item.icono}</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        background: "#f3f4f6",
                        color: "#4b5563",
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "#111827",
                      margin: "0 0 0.35rem 0",
                    }}
                  >
                    {item.nombre}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {item.descripcion}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#10B981",
                  }}
                >
                  <span>Incluido en Plan Full</span>
                  <Check size={14} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* SECCIÓN DE MOCKUPS EN VIVO */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            padding: "2.5rem 1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#10B981",
                fontSize: "0.8rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              <Sparkles size={14} />
              EXPERIENCIA INTERACTIVA
            </div>
            <h3
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 900,
                color: "#111827",
                margin: 0,
              }}
            >
              Así se ven y funcionan en tu tienda
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* MOCKUP 1: Cupón Troquelado */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1.5rem",
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      background: "#10B981",
                      borderRadius: "8px",
                      padding: "0.35rem",
                      color: "#ffffff",
                      display: "flex",
                    }}
                  >
                    <Tag size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 700 }}>WIDGET #19</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Badge Cupón Troquelado</div>
                  </div>
                </div>

                <div
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "14px",
                    padding: "1.25rem 1rem",
                    color: "#ffffff",
                    textAlign: "center",
                    position: "relative",
                    marginBottom: "1rem",
                    boxShadow: "0 6px 16px rgba(16,185,129,0.25)",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.9 }}>REGALO EXCLUSIVO HOY</div>
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

            {/* MOCKUP 2: Contador Regresivo */}
            <div
              style={{
                background: "linear-gradient(135deg, #111827, #1f2937)",
                borderRadius: "20px",
                padding: "1.5rem",
                color: "#ffffff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.75rem",
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#a7f3d0",
                  margin: "0 auto 0.75rem auto",
                }}
              >
                <Clock size={12} />
                OFERTA RELÁMPAGO
              </div>

              <div style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
                ¡Envío Gratis Finaliza en! 🔥
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "1.25rem" }}>
                Aprovechá antes de que se agoten las unidades
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

            {/* MOCKUP 3: Ruleta y Tabla de Talles */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1.5rem",
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <div style={{ background: "#10B981", borderRadius: "8px", padding: "0.35rem", color: "#ffffff", display: "flex" }}>
                    <Gift size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 700 }}>INNOVACIÓN</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Gamificación + Talles</div>
                  </div>
                </div>

                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "10px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#166534" }}>🎡 Ruleta Anti-Saturación</div>
                  <div style={{ fontSize: "0.75rem", color: "#15803d" }}>Captura emails y entrega premios de 5%, 10%, 15% o 20% OFF.</div>
                </div>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1e293b" }}>📏 Tabla con Selector Nativo</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Al tocar "Elegir talle", selecciona la variante directo en Tiendanube.</div>
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
                <span>Probar todos los widgets</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  }
