"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Star,
  X,
  MessageCircle,
  TrendingUp,
  Play,
  Layers,
  Lock,
  Copy,
  Check,
  CheckCircle,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"despues" | "antes">("despues");
  const [selectedTemplate, setSelectedTabTemplate] = useState<string>("clasica");

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        background: "#090d16",
        color: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Luz de fondo Glow */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "700px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(9, 13, 22, 0) 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* HEADER */}
      <header
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "1.25rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 10,
        }}
      >
        <NevuxLogo size="medium" />
        <a
          href="#checkout"
          style={{
            padding: "0.6rem 1.1rem",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "999px",
            color: "#10B981",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Sparkles size={14} /> Activar en mi Tienda
        </a>
      </header>

      {/* 1. HERO SECTION */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 1.25rem 2rem 1.25rem",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 1rem",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#34D399",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            <Zap size={14} /> Modo Landing Page para Tiendanube
          </div>

          <h1
            style={{
              fontSize: "clamp(2.1rem, 7vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 1.25rem 0",
              color: "#ffffff",
            }}
          >
            Transformá tu tienda en una{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Landing Page de Alta Conversión
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
              color: "#9CA3AF",
              maxWidth: "680px",
              margin: "0 auto 2rem auto",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            Dejá de perder ventas con fichas de productos aburridas. Mostrá tus
            productos con una estructura que explica, convence y vende sola.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <a
              href="#checkout"
              style={{
                width: "100%",
                maxWidth: "360px",
                padding: "1.15rem 1.75rem",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#ffffff",
                borderRadius: "16px",
                fontSize: "1.1rem",
                fontWeight: 800,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)",
              }}
            >
              <span>Transformar mi Tienda Ahora</span>
              <ArrowRight size={20} />
            </a>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "0.8rem",
                color: "#6B7280",
                fontWeight: 600,
                marginTop: "0.5rem",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <CheckCircle2 size={14} color="#10B981" /> Sin tocar código
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <CheckCircle2 size={14} color="#10B981" /> Listo en 3 minutos
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. SIMULADOR INTERACTIVO (ANTES vs DESPUÉS) */}
      <section
        style={{
          maxWidth: "800px",
          margin: "2rem auto 4rem auto",
          padding: "0 1.25rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("despues")}
            style={{
              padding: "0.7rem 1.25rem",
              borderRadius: "12px",
              border:
                activeTab === "despues"
                  ? "2px solid #10B981"
                  : "1px solid rgba(255,255,255,0.1)",
              background:
                activeTab === "despues"
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(255,255,255,0.03)",
              color: activeTab === "despues" ? "#34D399" : "#9CA3AF",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Sparkles size={16} /> Con Nevux (Landing Pro)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("antes")}
            style={{
              padding: "0.7rem 1.25rem",
              borderRadius: "12px",
              border:
                activeTab === "antes"
                  ? "2px solid #EF4444"
                  : "1px solid rgba(255,255,255,0.1)",
              background:
                activeTab === "antes"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(255,255,255,0.03)",
              color: activeTab === "antes" ? "#FCA5A5" : "#9CA3AF",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <X size={16} /> Tiendanube Genérica
          </button>
        </div>

        {/* Marco Celular */}
        <div
          style={{
            maxWidth: "360px",
            margin: "0 auto",
            background: "#111827",
            borderRadius: "36px",
            padding: "12px",
            border: "4px solid #1F2937",
            boxShadow:
              activeTab === "despues"
                ? "0 20px 50px rgba(16, 185, 129, 0.25)"
                : "0 20px 50px rgba(0, 0, 0, 0.5)",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              color: "#000000",
              borderRadius: "26px",
              overflow: "hidden",
              minHeight: "540px",
              position: "relative",
            }}
          >
            {/* Notch */}
            <div
              style={{
                width: "100px",
                height: "18px",
                background: "#111827",
                margin: "0 auto",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
              }}
            />

            <AnimatePresence mode="wait">
              {activeTab === "despues" ? (
                <motion.div
                  key="despues"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: "0.85rem", position: "relative" }}
                >
                  {/* Notificacion de Compra Reciente */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      left: "10px",
                      right: "10px",
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      padding: "0.5rem 0.75rem",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#10B981",
                      }}
                    />
                    <div style={{ fontSize: "0.68rem", color: "#1F2937" }}>
                      <strong>Alguien de Córdoba</strong> compró hace 3 min
                    </div>
                  </motion.div>

                  {/* Banner Oferta */}
                  <div
                    style={{
                      background: "#000000",
                      color: "#ffffff",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      textAlign: "center",
                      padding: "0.35rem",
                      borderRadius: "6px",
                      marginBottom: "0.75rem",
                    }}
                  >
                    🔥 20% OFF PAGANDO POR TRANSFERENCIA
                  </div>

                  {/* Imagen producto */}
                  <div
                    style={{
                      height: "160px",
                      background: "#f3f4f6",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.75rem",
                      position: "relative",
                    }}
                  >
                    <ShoppingBag size={44} color="#9CA3AF" />
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: "#10B981",
                        color: "white",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "999px",
                      }}
                    >
                      MÁS VENDIDO
                    </span>
                  </div>

                  {/* Rating */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#F59E0B",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <Star size={11} fill="#F59E0B" />
                    <Star size={11} fill="#F59E0B" />
                    <Star size={11} fill="#F59E0B" />
                    <Star size={11} fill="#F59E0B" />
                    <Star size={11} fill="#F59E0B" />
                    <span style={{ color: "#4B5563", marginLeft: "0.2rem" }}>
                      4.9 (128 opiniones)
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 900,
                      margin: "0 0 0.3rem 0",
                    }}
                  >
                    Termo Pro Inox 1L
                  </h3>

                  {/* Packs de Oferta por Cantidad */}
                  <div
                    style={{
                      background: "#F9FAFB",
                      border: "1.5px solid #10B981",
                      borderRadius: "10px",
                      padding: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: "#059669",
                        marginBottom: "0.3rem",
                      }}
                    >
                      ELEGÍ TU PACK CON DESCUENTO
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#ECFDF5",
                        padding: "0.35rem 0.5rem",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#047857",
                      }}
                    >
                      <span>Llevá 2 (15% OFF)</span>
                      <strong>$66.130</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "#000000",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    AGREGAR AL CARRITO →
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.3rem",
                      fontSize: "0.65rem",
                      color: "#059669",
                      fontWeight: 700,
                    }}
                  >
                    <ShieldCheck size={12} /> Compra 100% Protegida · Envío Gratis
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="antes"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: "0.85rem" }}
                >
                  <div
                    style={{
                      height: "180px",
                      background: "#f3f4f6",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <ShoppingBag size={48} color="#D1D5DB" />
                  </div>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      margin: "0 0 0.5rem 0",
                      color: "#374151",
                    }}
                  >
                    Termo Pro Inox 1L
                  </h3>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#1F2937",
                      marginBottom: "1rem",
                    }}
                  >
                    $48.600
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      lineHeight: 1.4,
                      marginBottom: "1.5rem",
                    }}
                  >
                    Termo de acero inoxidable de 1 litro de capacidad. Mantiene
                    la temperatura por horas.
                  </p>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      background: "#E5E7EB",
                      color: "#9CA3AF",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    Agregar al carrito
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. POR QUÉ VENDE (MÉTODO AIDA) */}
      <section
        style={{
          maxWidth: "900px",
          margin: "4rem auto",
          padding: "0 1.25rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 900,
              margin: "0 0 0.75rem 0",
              letterSpacing: "-0.02em",
            }}
          >
            Por qué <span style={{ color: "#10B981" }}>vende más</span>
          </h2>
          <p style={{ color: "#9CA3AF", fontSize: "1rem", margin: 0 }}>
            Una ficha de producto común muestra datos. Una Landing Page explica,
            convence y cierra la venta.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            {
              step: "A",
              title: "Atracción",
              desc: "Capturamos la atención con ofertas por transferencia, insignias de envío gratis y contador de stock.",
              color: "#10B981",
            },
            {
              step: "I",
              title: "Interés",
              desc: "Convertimos características aburridas en beneficios reales con tablas comparativas y reseñas con estrellas.",
              color: "#3B82F6",
            },
            {
              step: "D",
              title: "Deseo",
              desc: "Aumentamos el ticket promedio con packs de descuento progresivos (Llevá 2, Llevá 3).",
              color: "#8B5CF6",
            },
            {
              step: "A",
              title: "Acción",
              desc: "Notificaciones de compra social en tiempo real que eliminan dudas y fuerzan el clic de compra.",
              color: "#EC4899",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: item.color,
                  color: "white",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  margin: "0 0 0.5rem 0",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#9CA3AF",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRES PLANTILLAS LISTAS */}
      <section
        style={{
          maxWidth: "900px",
          margin: "4rem auto",
          padding: "0 1.25rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 900,
              margin: "0 0 0.5rem 0",
            }}
          >
            Plantillas diseñadas para tu marca
          </h2>
          <p style={{ color: "#9CA3AF", fontSize: "0.95rem", margin: 0 }}>
            Elegí el estilo que mejor va con tus productos.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            {
              id: "clasica",
              name: "Clásica Convertidora",
              tag: "La más elegida",
              desc: "Perfecta para tecnología, bazar, termos y accesorios generales.",
            },
            {
              id: "oscura",
              name: "Oscura Premium",
              tag: "Marcas de Lujo",
              desc: "Especial para indumentaria streetwear, calzado y perfumería.",
            },
            {
              id: "comparativa",
              name: "Antes y Después",
              tag: "Alta Persuasión",
              desc: "Para productos donde el resultado visual marca la diferencia.",
            },
          ].map((tmpl) => (
            <div
              key={tmpl.id}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#10B981",
                    background: "rgba(16, 185, 129, 0.12)",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "999px",
                    display: "inline-block",
                    marginBottom: "0.75rem",
                  }}
                >
                  {tmpl.tag}
                </span>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {tmpl.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#9CA3AF",
                    margin: "0 0 1rem 0",
                    lineHeight: 1.45,
                  }}
                >
                  {tmpl.desc}
                </p>
              </div>

              <a
                href="#checkout"
                style={{
                  padding: "0.7rem",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textAlign: "center",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Usar esta plantilla →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CÓMO SE INSTALA (3 PASOS) */}
      <section
        style={{
          maxWidth: "800px",
          margin: "4rem auto",
          padding: "2rem 1.25rem",
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: "28px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 900,
              margin: "0 0 0.5rem 0",
            }}
          >
            Cómo se activa en tu tienda
          </h2>
          <p style={{ color: "#9CA3AF", fontSize: "0.9rem", margin: 0 }}>
            En 3 sencillos pasos, sin contratar programadores ni diseñadores.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            {
              num: "1",
              title: "Elegís tu plantilla",
              desc: "Seleccionás el diseño que mejor va con tus productos.",
            },
            {
              num: "2",
              title: "Copiás tu código",
              desc: "Te entregamos un código maestro único para tu Tiendanube.",
            },
            {
              num: "3",
              title: "Pegás y vendés",
              desc: "Lo pegás en Edición Avanzada de CSS y tu tienda se transforma al instante.",
            },
          ].map((step) => (
            <div key={step.num} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#10B981",
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem auto",
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  margin: "0 0 0.35rem 0",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#9CA3AF",
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CHECKOUT DE SUSCRIPCIÓN DIRECTA */}
      <section
        id="checkout"
        style={{
          maxWidth: "520px",
          margin: "4rem auto",
          padding: "0 1.25rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, #111827 0%, #0F172A 100%)",
            border: "2px solid #10B981",
            borderRadius: "28px",
            padding: "2rem 1.5rem",
            boxShadow: "0 20px 50px rgba(16, 185, 129, 0.2)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#10B981",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 800,
              padding: "0.3rem 0.8rem",
              borderRadius: "999px",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            ACTIVACIÓN INSTANTÁNEA
          </div>

          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 900,
              margin: "0 0 0.5rem 0",
            }}
          >
            Pack Landing Page Pro
          </h2>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: "0.9rem",
              margin: "0 0 1.5rem 0",
            }}
          >
            Suscripción oficial para Tiendanube. Cancelás cuando quieras.
          </p>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              padding: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                color: "#9CA3AF",
                textDecoration: "line-through",
              }}
            >
              Precio normal $49.900 ARS
            </div>
            <div
              style={{
                fontSize: "2.8rem",
                fontWeight: 900,
                color: "#34D399",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              $39.900
              <span
                style={{ fontSize: "1rem", color: "#9CA3AF", fontWeight: 500 }}
              >
                /mes
              </span>
            </div>
          </div>

          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              marginBottom: "1.75rem",
              fontSize: "0.88rem",
              color: "#D1D5DB",
            }}
          >
            {[
              "Código Maestro CSS/JS para Tiendanube",
              "Las 3 Plantillas incluidas (Clásica, Oscura, Comparativa)",
              "Optimizada para celulares (Mobile First)",
              "Soporte prioritario por WhatsApp directo",
              "Actualizaciones automáticas de diseño",
            ].map((text) => (
              <div
                key={text}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <CheckCircle size={16} color="#10B981" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <a
            href="https://mpago.la/1LqFYin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              width: "100%",
              padding: "1.15rem",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#ffffff",
              borderRadius: "16px",
              fontSize: "1.1rem",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)",
              boxSizing: "border-box",
            }}
          >
            <span>Suscribirme ($39.900/mes) →</span>
          </a>

          <div
            style={{
              fontSize: "0.78rem",
              color: "#6B7280",
              marginTop: "0.85rem",
            }}
          >
            🔒 Cobro seguro con Tarjeta o Mercado Pago
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 1.25rem",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          color: "#6B7280",
          fontSize: "0.85rem",
        }}
      >
        <div style={{ marginBottom: "1.25rem" }}>
          <a
            href="https://wa.me/5493435042812?text=Hola!%20Tengo%20una%20duda%20sobre%20el%20Pack%20Landing%20Pro%20de%20Nevux"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              background: "#25D366",
              color: "#ffffff",
              borderRadius: "999px",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            <MessageCircle size={18} /> Asesoramiento por WhatsApp (+54 9 343 504 2812)
          </a>
        </div>
        <p>© 2026 Nevux. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
      }
