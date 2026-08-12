"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Zap, TrendingUp, Package } from "lucide-react";

export default function Hero() {
  // ─── Contador animado de widgets (+1 → +15, loop infinito) ───
  const [widgetCount, setWidgetCount] = useState(1);

  useEffect(() => {
    let currentCount = 1;
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startCounting = () => {
      currentCount = 1;
      setWidgetCount(1);

      intervalId = setInterval(() => {
        currentCount++;
        setWidgetCount(currentCount);

        if (currentCount >= 15) {
          clearInterval(intervalId);
          timeoutId = setTimeout(startCounting, 2000);
        }
      }, 120);
    };

    startCounting();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        paddingTop: "7rem",
        paddingBottom: "4rem",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Círculos decorativos de fondo */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-100px",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(255, 0, 0, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-100px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(255, 0, 0, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Badge Tiendanube */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.55rem 1.1rem",
            background: "white",
            borderRadius: "999px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
            marginBottom: "1.75rem",
            fontSize: "0.9rem",
            color: "#000000",
            fontWeight: 500,
          }}
        >
          <span>Hecho para</span>
          <svg
            width="90"
            height="16"
            viewBox="0 0 120 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            <circle cx="10" cy="10" r="4" fill="#2CA9E1" />
            <circle cx="16" cy="10" r="5" fill="#0084C7" opacity="0.85" />
            <text
              x="28"
              y="14"
              fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
              fontSize="12"
              fontWeight="700"
              fill="#0084C7"
            >
              tiendanube
            </text>
          </svg>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#000000",
            margin: "0 0 1.5rem 0",
            letterSpacing: "-0.03em",
          }}
        >
          Aumenta tus ventas con{" "}
          <span
            style={{
              color: "#FF0000",
              display: "inline-block",
              minWidth: "5.5ch",
              textAlign: "left",
            }}
          >
            +{widgetCount} widgets
          </span>{" "}
          interactivos en tu Tiendanube
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            color: "#000000",
            opacity: 0.7,
            lineHeight: 1.6,
            margin: "0 auto 2rem auto",
            maxWidth: "620px",
          }}
        >
          Crea <strong style={{ color: "#000000", opacity: 1 }}>bundles</strong>,{" "}
          <strong style={{ color: "#000000", opacity: 1 }}>widgets</strong> y{" "}
          <strong style={{ color: "#000000", opacity: 1 }}>ofertas especiales</strong> que
          impulsen tu ticket promedio y tu tasa de conversión. Sin código,
          interactivo y en minutos.
        </motion.p>

        {/* Bullets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <BulletItem text="7 días de prueba gratis" />
          <BulletItem text="Sin tarjeta de crédito" />
          <BulletItem text="Asistencia personalizada 24/7" />
        </motion.div>

        {/* Botón CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/registro"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1.1rem 2.5rem",
              background: "#FF0000",
              color: "white",
              borderRadius: "999px",
              fontSize: "1.1rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(255, 0, 0, 0.4)",
              transition: "all 0.2s",
              minWidth: "260px",
            }}
          >
            Probar gratis
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        {/* ─────────────────────────────────────────────
            WIDGET MOCKUP FLOTANTE — NUEVO LAYOUT
            - Wrapper flex centrado
            - Card blanca con margin auto (naturalmente centrada)
            - Píldoras absolute respecto al wrapper
        ───────────────────────────────────────────── */}
        <div
          style={{
            marginTop: "4rem",
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "50px",
            paddingBottom: "50px",
          }}
        >
          {/* Píldora +45% ventas — arriba, ligeramente a la izquierda */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.8 },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-140px)",
              background: "white",
              padding: "0.55rem 0.9rem",
              borderRadius: "14px",
              boxShadow: "0 8px 20px rgba(255, 0, 0, 0.2)",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#FF0000",
              whiteSpace: "nowrap",
              zIndex: 3,
            }}
          >
            <Package size={13} />
            +45% ventas
          </motion.div>

          {/* Card blanca central — naturalmente centrada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              background: "white",
              padding: "1.5rem 1.25rem",
              borderRadius: "20px",
              boxShadow:
                "0 20px 60px rgba(255, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f3f4f6",
              width: "100%",
              maxWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
              zIndex: 2,
            }}
          >
            <FloatingWidget
              icon={<Sparkles size={14} />}
              text="¡Oferta sorpresa!"
              color="#FF0000"
              bg="#fff5f5"
              delay={0}
            />
            <FloatingWidget
              icon={<Zap size={14} />}
              text="¡Últimas en stock!"
              color="#000000"
              bg="#f3f4f6"
              delay={0.2}
            />
            <FloatingWidget
              icon={<TrendingUp size={14} />}
              text="¡Apurate!"
              color="#FF0000"
              bg="#fff5f5"
              delay={0.4}
            />
          </motion.div>

          {/* Píldora Ticket +2.3x — abajo, ligeramente a la derecha */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, 8, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 1 },
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.8,
              },
            }}
            style={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(30px)",
              background: "white",
              padding: "0.55rem 0.9rem",
              borderRadius: "14px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#000000",
              whiteSpace: "nowrap",
              zIndex: 3,
            }}
          >
            <Sparkles size={13} />
            Ticket +2.3x
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Componente para cada bullet
function BulletItem({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        fontSize: "0.95rem",
        color: "#000000",
        fontWeight: 500,
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "#FF0000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(255, 0, 0, 0.3)",
        }}
      >
        <Check size={13} color="white" strokeWidth={3} />
      </div>
      <span>{text}</span>
    </div>
  );
}

// Componente para los widgets animados dentro de la card
function FloatingWidget({
  icon,
  text,
  color,
  bg,
  delay,
}: {
  icon: React.ReactNode;
  text: string;
  color: string;
  bg: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.7 + delay }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 0.85rem",
        background: bg,
        borderRadius: "999px",
        color: color,
        fontSize: "0.8rem",
        fontWeight: 600,
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span>{text}</span>
    </motion.div>
  );
        }
