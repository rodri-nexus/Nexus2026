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
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"despues" | "antes">("despues");

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
      {/* Glow de fondo */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "600px",
          height: "400px",
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
          href="#crear"
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
          <Sparkles size={14} /> Transformar mi Tienda
        </a>
      </header>

      {/* HERO */}
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
            productos con un diseño que explica, convence y genera deseo
            inmediato.
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
              href="#crear"
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
              <span>Ver mi tienda transformada</span>
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
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <CheckCircle2 size={14} color="#10B981" /> Sin saber programar
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <CheckCircle2 size={14} color="#10B981" /> Listo en 3 minutos
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SIMULADOR ANTES vs DESPUÉS */}
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

        {/* Marco del celular */}
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
              minHeight: "520px",
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
                  style={{ padding: "0.85rem" }}
                >
                  {/* Banner oferta */}
                  <div
                    style={{
                      background: "#000000",
                      color: "#ffffff",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textAlign: "center",
                      padding: "0.35rem",
                      borderRadius: "6px",
                      marginBottom: "0.75rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    🔥 20% OFF PAGANDO POR TRANSFERENCIA
                  </div>

                  {/* Imagen producto */}
                  <div
                    style={{
                      height: "180px",
                      background: "#f3f4f6",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.85rem",
                      position: "relative",
                    }}
                  >
                    <ShoppingBag size={48} color="#9CA3AF" />
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "#10B981",
                        color: "white",
                        fontSize: "0.65rem",
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
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#F59E0B",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <Star size={12} fill="#F59E0B" />
                    <Star size={12} fill="#F59E0B" />
                    <Star size={12} fill="#F59E0B" />
                    <Star size={12} fill="#F59E0B" />
                    <Star size={12} fill="#F59E0B" />
                    <span style={{ color: "#4B5563", marginLeft: "0.2rem" }}>
                      4.9 (128 opiniones)
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 900,
                      margin: "0 0 0.4rem 0",
                      lineHeight: 1.2,
                    }}
                  >
                    Termo Pro Inox 1L
                  </h3>

                  {/* Box precio destacado */}
                  <div
                    style={{
                      background: "#ECFDF5",
                      border: "1.5px solid #A7F3D0",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "10px",
                      marginBottom: "0.85rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: "#059669",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      Precio con Beneficio Transferencia
                    </div>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 900,
                        color: "#047857",
                      }}
                    >
                      $38.900{" "}
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#9CA3AF",
                          textDecoration: "line-through",
                          fontWeight: 500,
                        }}
                      >
                        $48.600
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#065F46",
                        fontWeight: 700,
                        marginTop: "0.1rem",
                      }}
                    >
                      💳 O en 3 cuotas sin interés de $16.200
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      background: "#000000",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      marginBottom: "0.6rem",
                    }}
                  >
                    AGREGAR AL CARRITO →
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      fontSize: "0.7rem",
                      color: "#059669",
                      fontWeight: 700,
                    }}
                  >
                    <ShieldCheck size={14} /> Compra 100% Protegida · Envío Gratis
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
                    la temperatura por horas. Ideal para llevar al trabajo o de
                    viaje.
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
        <div style={{ marginBottom: "1rem" }}>
          <a
            href="https://wa.me/5493435042812?text=Hola!%20Quiero%20transformar%20mi%20Tiendanube%20en%20Landing%20Page"
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
            <MessageCircle size={18} /> Hablar por WhatsApp (+54 9 343 504 2812)
          </a>
        </div>
        <p>© 2026 Nevux. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
