"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  ArrowRight,
  Sparkles,
  Gift,
  Trophy,
  Gem,
  Zap,
  BarChart3,
  Bot,
  Palette,
  Blocks,
  ChevronDown,
  MessageCircle,
  LogOut,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import { createClient } from "@/lib/supabase-browser";

interface ExpiradoClientProps {
  email: string;
  trialEndedAt: string | null;
  monthsActive: number;
}

const PLAN_FEATURES = [
  "Acceso a los +15 widgets interactivos",
  "Sincronización automática con Tiendanube",
  "Personalización total: colores, textos y estilos",
  "Widgets ilimitados por tienda",
  "Métricas y estadísticas en tiempo real",
  "Bundles y ofertas especiales",
  "Contador de descuentos y urgencia",
  "Reseñas y prueba social",
  "Soporte por WhatsApp 24/7",
  "Actualizaciones automáticas",
];

const LOYALTY_MILESTONES = [
  {
    month: 3,
    icon: Gift,
    color: "#10B981",
    title: "Mes 3 · Recompensa",
    description:
      "Desbloqueás widgets premium exclusivos + 1 widget personalizado único que solo vas a tener vos.",
  },
  {
    month: 6,
    icon: Trophy,
    color: "#000000",
    title: "Mes 6 · Elite",
    description:
      "Más widgets personalizados hechos a medida + descuentos exclusivos en tu suscripción.",
  },
  {
    month: 12,
    icon: Gem,
    color: "#10B981",
    title: "Mes 12+ · VIP",
    description:
      "Beneficios VIP, widgets únicos diseñados 100% para tu tienda, y acceso anticipado a features nuevas.",
  },
];

const UPCOMING_FEATURES = [
  {
    icon: Bot,
    title: "Recomendaciones con IA",
    description: "Sugerí productos automáticamente según lo que ve el cliente",
  },
  {
    icon: BarChart3,
    title: "Analytics avanzados",
    description: "Dashboards profesionales con ROI por widget",
  },
  {
    icon: Zap,
    title: "A/B Testing",
    description: "Probá 2 versiones de un widget y quedate con la que más vende",
  },
  {
    icon: Palette,
    title: "Widgets premium únicos",
    description: "Nuevos widgets top que ninguna otra app tiene",
  },
  {
    icon: Blocks,
    title: "Más integraciones",
    description: "Conexión con MercadoLibre, Instagram Shopping y más",
  },
  {
    icon: Sparkles,
    title: "Widgets custom para vos",
    description: "Diseñamos widgets exclusivos para tu tienda",
  },
];

const FAQS = [
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, no hay permanencia mínima. Cancelás desde tu panel cuando quieras y usás la app hasta el final del mes ya pagado.",
  },
  {
    q: "¿Qué pasa con mis widgets si no pago?",
    a: "Los widgets ya creados siguen visibles en tu tienda unos días, pero no vas a poder editarlos ni crear nuevos hasta que renueves.",
  },
  {
    q: "¿Cómo pago?",
    a: "Por transferencia a Naranja X (más económico y directo). Los datos los obtenés en el siguiente paso.",
  },
  {
    q: "¿Devuelven el dinero?",
    a: "No hacemos reintegros. Por eso te damos 7 días de prueba 100% gratis antes de pagar, para que decidas con calma.",
  },
];

export default function ExpiradoClient({
  email,
}: ExpiradoClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignorar errores de red en logout
    } finally {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Círculos decorativos */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "-150px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Header con logo */}
      <div
        style={{
          padding: "1.5rem 1.25rem",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
      >
        <NevuxLogo size="medium" />
      </div>

      {/* Contenido principal */}
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: "1rem 1rem 3rem 1rem",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
      >
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          {/* Badge trial terminado */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.95rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#059669",
              fontWeight: 700,
              marginBottom: "1.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.1)",
            }}
          >
            <Clock size={12} color="#10B981" />
            Tu prueba gratis terminó
          </div>

          <h1
            style={{
              fontSize: "clamp(1.75rem, 5.5vw, 3rem)",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 1rem 0",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              wordBreak: "break-word",
            }}
          >
            Seguí vendiendo más con{" "}
            <span style={{ color: "#10B981" }}>Nevux</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)",
              color: "#000000",
              opacity: 0.7,
              margin: "0 auto",
              maxWidth: "580px",
              lineHeight: 1.5,
            }}
          >
            Activá tu cuenta y desbloqueá todo el potencial de tu tienda con los{" "}
            <strong style={{ color: "#000000", opacity: 1 }}>
              +15 widgets interactivos
            </strong>
            .
          </p>
        </motion.div>

        {/* CARD DEL PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background: "white",
            borderRadius: "28px",
            padding: "clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 4vw, 2rem)",
            border: "2px solid #10B981",
            boxShadow:
              "0 30px 80px rgba(16, 185, 129, 0.12), 0 10px 30px rgba(0, 0, 0, 0.06)",
            marginBottom: "3rem",
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Badge encima */}
          <div
            style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#10B981",
              color: "white",
              padding: "0.4rem 1.15rem",
              borderRadius: "999px",
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
              whiteSpace: "nowrap",
            }}
          >
            ⚡ Plan Único
          </div>

          {/* Título y precio */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                fontWeight: 800,
                color: "#000000",
                margin: "0.5rem 0 1rem 0",
                letterSpacing: "-0.02em",
              }}
            >
              Nevux Pro
            </h2>

            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "0.35rem",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(2.25rem, 7vw, 4rem)",
                  fontWeight: 900,
                  color: "#10B981",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                $30.000
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#000000",
                  opacity: 0.6,
                  fontWeight: 600,
                }}
              >
                / mes
              </span>
            </div>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#000000",
                opacity: 0.6,
                margin: 0,
                fontWeight: 500,
              }}
            >
              Cancelá cuando quieras · Sin permanencia
            </p>
          </div>

          {/* Lista de features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {PLAN_FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  <Check size={13} color="white" strokeWidth={3} />
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#000000",
                    lineHeight: 1.4,
                    fontWeight: 500,
                    minWidth: 0,
                    wordBreak: "break-word",
                  }}
                >
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: "block", width: "100%" }}
            >
              <Link
                href="/plan/pagar"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "1.05rem 2rem",
                  background: "#10B981",
                  color: "white",
                  borderRadius: "999px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 15px 35px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.2s",
                  width: "100%",
                  maxWidth: "360px",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#059669")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#10B981")
                }
              >
                Activar mi cuenta
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.8rem",
                color: "#000000",
                opacity: 0.5,
                fontWeight: 500,
              }}
            >
              Pago por transferencia · Activación en menos de 24hs
            </p>
          </div>
        </motion.div>

        {/* RECOMPENSAS POR FIDELIDAD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "3rem" }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.85rem",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "999px",
                fontSize: "0.75rem",
                color: "#059669",
                fontWeight: 700,
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Gift size={12} color="#10B981" />
              Recompensas por fidelidad
            </div>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                fontWeight: 800,
                color: "#000000",
                margin: "0 0 0.75rem 0",
                letterSpacing: "-0.02em",
                wordBreak: "break-word",
              }}
            >
              Cuantos más meses usás Nevux,{" "}
              <span style={{ color: "#10B981" }}>más ganás</span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#000000",
                opacity: 0.65,
                margin: 0,
              }}
            >
              Desbloqueá beneficios exclusivos que ninguna otra tienda va a tener
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {LOYALTY_MILESTONES.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.month}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: "white",
                    padding: "1.5rem 1.25rem",
                    borderRadius: "18px",
                    border: "1px solid #f3f4f6",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background:
                        m.color === "#10B981"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(0, 0, 0, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Icon size={24} color={m.color} strokeWidth={2} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#000000",
                      margin: "0 0 0.5rem 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#000000",
                      opacity: 0.65,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* PRÓXIMAMENTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "3rem" }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.85rem",
                background: "#000000",
                borderRadius: "999px",
                fontSize: "0.75rem",
                color: "white",
                fontWeight: 700,
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Sparkles size={12} color="#10B981" />
              Próximamente
            </div>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                fontWeight: 800,
                color: "#000000",
                margin: "0 0 0.75rem 0",
                letterSpacing: "-0.02em",
              }}
            >
              Lo que se viene en <span style={{ color: "#10B981" }}>Nevux</span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#000000",
                opacity: 0.65,
                margin: 0,
              }}
            >
              Activando tu cuenta ahora, todo esto viene incluido cuando salga
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.85rem",
            }}
          >
            {UPCOMING_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: "white",
                    padding: "1.25rem",
                    borderRadius: "14px",
                    border: "1px solid #f3f4f6",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(16, 185, 129, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <Icon size={18} color="#10B981" strokeWidth={2} />
                  </div>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#000000",
                      margin: "0 0 0.35rem 0",
                    }}
                  >
                    {f.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#000000",
                      opacity: 0.6,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "3rem" }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 4vw, 1.85rem)",
                fontWeight: 800,
                color: "#000000",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Preguntas frecuentes
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  border: "1px solid #f3f4f6",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "1rem 1.15rem",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#000000",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown
                      size={18}
                      color="#000000"
                      style={{ opacity: 0.5 }}
                    />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "0 1.15rem 1rem 1.15rem",
                      fontSize: "0.9rem",
                      color: "#000000",
                      opacity: 0.7,
                      lineHeight: 1.55,
                    }}
                  >
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BOTÓN WHATSAPP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            padding: "2rem 1.25rem",
            background: "white",
            borderRadius: "20px",
            border: "1px solid #f3f4f6",
            marginBottom: "2rem",
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 0.5rem 0",
              letterSpacing: "-0.01em",
            }}
          >
            ¿Tenés dudas antes de activar? 💬
          </h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#000000",
              opacity: 0.65,
              margin: "0 0 1.25rem 0",
            }}
          >
            Escribinos por WhatsApp y te respondemos al instante
          </p>
          <a
            href="https://wa.me/5493434163999?text=Hola%20Nevux%20quiero%20saber%20mas%20sobre%20el%20plan"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              background: "#10B981",
              color: "white",
              borderRadius: "999px",
              fontSize: "0.95rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#059669")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#10B981")
            }
          >
            <MessageCircle size={17} />
            Hablar por WhatsApp
          </a>
        </motion.div>

        {/* FOOTER MICRO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "#000000",
            opacity: 0.5,
            flexWrap: "wrap",
          }}
        >
          <span>Conectado como {email}</span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "transparent",
              border: "none",
              color: "#000000",
              opacity: 0.7,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            <LogOut size={12} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
    }
