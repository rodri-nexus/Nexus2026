"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Truck, MessageCircle, ThumbsUp, Award } from "lucide-react";

export default function FeatureTrust() {
  const [dispatchMinutes, setDispatchMinutes] = useState(35);

  // Simula que el contador de despacho baja cada 30 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setDispatchMinutes((prev) => (prev > 5 ? prev - 1 : 35));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        background: "white",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
              padding: "0.45rem 0.95rem",
              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#059669",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <ShieldCheck size={14} />
            CONFIANZA Y SEGURIDAD
          </div>
        </motion.div>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            fontWeight: 800,
            color: "#000000",
            textAlign: "center",
            margin: "0 0 1rem 0",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Genera confianza y{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            convierte visitantes en compradores
          </span>
        </motion.h2>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "#000000",
            opacity: 0.6,
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "680px",
            margin: "0 auto 3.5rem auto",
          }}
        >
          Mostrá <strong style={{ color: "#000000", opacity: 1 }}>reseñas</strong> y{" "}
          <strong style={{ color: "#000000", opacity: 1 }}>widgets</strong> que generen
          confianza para que tus clientes se sientan seguros al momento de
          comprar.
        </motion.p>

        {/* Layout con reseña grande + 2 mockups pequeños */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* MOCKUP 1: Widget de reseñas (más grande) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow:
                "0 10px 30px rgba(16, 185, 129, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Rating principal */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "#000000",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  4,8
                </div>
                <div>
                  <div style={{ display: "flex", gap: "0.15rem", marginBottom: "0.25rem" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.4 + i * 0.1,
                          type: "spring",
                        }}
                      >
                        <Star
                          size={18}
                          fill="#fbbf24"
                          color="#fbbf24"
                          strokeWidth={0}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#000000",
                      opacity: 0.6,
                      fontWeight: 500,
                    }}
                  >
                    Basado en 247 reseñas
                  </div>
                </div>
              </div>

              {/* Barras de rating */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "1rem" }}>
                <RatingBar stars={5} percent={78} />
                <RatingBar stars={4} percent={15} />
                <RatingBar stars={3} percent={5} />
                <RatingBar stars={2} percent={1} />
                <RatingBar stars={1} percent={1} />
              </div>

              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.1rem",
                  background: "#000000",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <MessageCircle size={14} />
                Escribir reseña
              </button>
            </div>

            {/* Reseñas individuales */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <ReviewCard
                name="Sofía G."
                rating={5}
                text="Excelente calidad, llegó antes de lo esperado. Súper recomendable 💕"
                initials="SG"
                color="#f472b6"
              />
              <ReviewCard
                name="Martín T."
                rating={4}
                text="Muy buen producto, lo recomiendo. Volvería a comprar."
                initials="MT"
                color="#60a5fa"
              />
            </div>
          </motion.div>

          {/* MOCKUP 2: Alerta de despacho — SE MANTIENE VERDE (semántico) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.25)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Círculo decorativo */}
            <div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.3)",
                  }}
                />
                <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                  EN VIVO
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Truck size={22} />
                <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  Comprando ahora
                </div>
              </div>

              <p style={{ fontSize: "0.85rem", opacity: 0.95, margin: "0 0 1rem 0", lineHeight: 1.5 }}>
                Tu pedido se despacha <strong>HOY</strong>
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backdropFilter: "blur(10px)",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>Te quedan</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "monospace" }}>
                0h {dispatchMinutes}m
              </div>
            </div>
          </motion.div>

          {/* MOCKUP 3: Garantía */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow:
                "0 10px 30px rgba(255, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
            }}
          >
            <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
              {/* Badge circular dorado — semántico, se mantiene */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", delay: 0.6 }}
                style={{
                  width: "64px",
                  height: "64px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 0deg, #fbbf24, #f59e0b, #fbbf24, #f59e0b, #fbbf24)",
                  padding: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f59e0b",
                  }}
                >
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, lineHeight: 1 }}>
                    100%
                  </div>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                    GARANTÍA
                  </div>
                </div>
              </motion.div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#000000",
                    margin: "0 0 0.35rem 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Garantía de 60 días
                </h4>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#000000",
                    opacity: 0.6,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Confiamos en los resultados. Si no te gusta, te reintegramos el{" "}
                  <strong style={{ color: "#000000", opacity: 1 }}>100% de tu compra</strong>.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <TrustBadge icon={<ShieldCheck size={12} />} text="Compra protegida" />
              <TrustBadge icon={<Award size={12} />} text="Verificado" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Barra de rating
function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.15rem", minWidth: "18px" }}>
        <span style={{ color: "#000000", opacity: 0.6, fontWeight: 600 }}>{stars}</span>
        <Star size={10} fill="#fbbf24" color="#fbbf24" strokeWidth={0} />
      </div>
      <div
        style={{
          flex: 1,
          height: "6px",
          background: "#f3f4f6",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
            borderRadius: "3px",
          }}
        />
      </div>
      <span
        style={{
          color: "#000000",
          opacity: 0.5,
          fontWeight: 500,
          minWidth: "28px",
          textAlign: "right",
        }}
      >
        {percent}%
      </span>
    </div>
  );
}

// Card de reseña
function ReviewCard({
  name,
  rating,
  text,
  initials,
  color,
}: {
  name: string;
  rating: number;
  text: string;
  initials: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "0.85rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.2rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#000000" }}>
            {name}
          </span>
          <div style={{ display: "flex", gap: "0.1rem" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                fill={i < rating ? "#fbbf24" : "#e5e7eb"}
                color={i < rating ? "#fbbf24" : "#e5e7eb"}
                strokeWidth={0}
              />
            ))}
          </div>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#000000", opacity: 0.7, margin: 0, lineHeight: 1.4 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

// Badge de trust — SE MANTIENE VERDE (semántico)
function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.3rem 0.55rem",
        background: "#f0fdf4",
        color: "#059669",
        borderRadius: "6px",
        fontSize: "0.7rem",
        fontWeight: 600,
      }}
    >
      {icon}
      {text}
    </div>
  );
        }
