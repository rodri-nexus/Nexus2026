"use client";

import { motion } from "framer-motion";

// Marcas ficticias (podés cambiarlas después por reales)
const brands = [
  { name: "CANELA", style: { fontFamily: "'Playfair Display', serif", letterSpacing: "0.3em", fontWeight: 400 } },
  { name: "OPEN 25HS", style: { fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.05em" } },
  { name: "NORDIC", style: { fontFamily: "sans-serif", fontWeight: 300, letterSpacing: "0.4em" } },
  { name: "URBAN.CO", style: { fontFamily: "sans-serif", fontWeight: 800, letterSpacing: "-0.02em" } },
  { name: "Bloomé", style: { fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 400 } },
  { name: "PIXEL LAB", style: { fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.15em" } },
  { name: "SAGE&CO", style: { fontFamily: "serif", fontWeight: 500, letterSpacing: "0.1em" } },
  { name: "MOVE", style: { fontFamily: "sans-serif", fontWeight: 900, letterSpacing: "0.25em" } },
];

export default function SocialProof() {
  // Duplicamos los brands para hacer el loop infinito
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section
      style={{
        padding: "4rem 0 3rem 0",
        background: "white",
        borderTop: "1px solid #f3f4f6",
        borderBottom: "1px solid #f3f4f6",
        overflow: "hidden",
      }}
    >
      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: "center",
          padding: "0 1.25rem",
          marginBottom: "3rem",
        }}
      >
        <p
          style={{
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            color: "#6b7280",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Sumate a las{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 800,
            }}
          >
            +3.000 tiendas
          </span>{" "}
          que venden más con Nevux
        </p>
      </motion.div>

      {/* Carrusel infinito de logos */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            display: "flex",
            gap: "3.5rem",
            width: "max-content",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          {duplicatedBrands.map((brand, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "160px",
                height: "60px",
                fontSize: "1.35rem",
                color: "#9ca3af",
                whiteSpace: "nowrap",
                transition: "color 0.3s",
                cursor: "default",
                ...brand.style,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#6366f1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9ca3af";
              }}
            >
              {brand.name}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Métricas debajo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          flexWrap: "wrap",
          marginTop: "3rem",
          padding: "0 1.25rem",
        }}
      >
        <MetricItem number="+3.000" label="tiendas activas" />
        <MetricItem number="+45%" label="ticket promedio" />
        <MetricItem number="4.8★" label="en Tiendanube" />
      </motion.div>
    </section>
  );
}

function MetricItem({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "#6b7280",
          marginTop: "0.35rem",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}
