"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Copy, Check, Clock, Play, Tag } from "lucide-react";

export default function FeatureWidgets() {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 21,
    seconds: 28,
  });

  // Contador regresivo en tiempo real
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
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("EXTRA20");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        background: "#ffffff",
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
              background: "#ecfdf5",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#10B981",
              fontWeight: 700,
              letterSpacing: "0.02em",
              border: "1px solid #a7f3d0",
            }}
          >
            <Zap size={14} />
            WIDGETS DE CONVERSIÓN
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
          Impulsa tu{" "}
          <span
            style={{
              color: "#10B981",
            }}
          >
            tasa de conversión
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
          Captá la atención de tus visitantes con{" "}
          <strong style={{ color: "#000000", opacity: 1 }}>mensajes destacados</strong>,{" "}
          <strong style={{ color: "#000000", opacity: 1 }}>videos</strong>,{" "}
          <strong style={{ color: "#000000", opacity: 1 }}>alertas</strong> y{" "}
          <strong style={{ color: "#000000", opacity: 1 }}>banners</strong> que resalten tus
          productos y ofertas especiales.
        </motion.p>

        {/* Grid de mockups */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* MOCKUP 1: Cupón de descuento */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow:
                "0 10px 30px rgba(16, 185, 129, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "280px",
              boxSizing: "border-box",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tag size={16} color="#ffffff" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#000000",
                      opacity: 0.5,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    CUPÓN EXCLUSIVO
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: "#000000",
                    }}
                  >
                    Descuento extra
                  </div>
                </div>
              </div>

              {/* Cupón visual */}
              <div
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: "14px",
                  padding: "1.25rem 1rem",
                  position: "relative",
                  color: "#ffffff",
                  marginBottom: "1rem",
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                  overflow: "hidden",
                }}
              >
                {/* Círculos decorativos */}
                <div
                  style={{
                    position: "absolute",
                    left: "-10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#ffffff",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#ffffff",
                  }}
                />

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.9,
                      marginBottom: "0.25rem",
                      fontWeight: 700,
                    }}
                  >
                    20% OFF EXTRA
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      fontFamily: "monospace",
                    }}
                  >
                    EXTRA20
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.85,
                      marginTop: "0.25rem",
                    }}
                  >
                    Aplicá el cupón en el checkout
                  </div>
                </div>
              </div>
            </div>

            {/* Botón copiar */}
            <button
              onClick={handleCopyCoupon}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: copied
                  ? "#059669"
                  : "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                transition: "all 0.3s",
              }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Check size={16} />
                    ¡Copiado!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Copy size={16} />
                    Copiar cupón
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* MOCKUP 2: Contador regresivo Black Friday */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              background: "linear-gradient(135deg, #111827, #1f2937)",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "280px",
              color: "#ffffff",
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {/* Círculos decorativos de fondo */}
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.7rem",
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#a7f3d0",
                  marginBottom: "0.75rem",
                }}
              >
                <Clock size={12} />
                TERMINA PRONTO
              </div>

              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  margin: "0 0 0.25rem 0",
                  letterSpacing: "-0.02em",
                }}
              >
                Black Friday 🔥
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: "0 0 1.25rem 0",
                }}
              >
                Hasta $25.000 OFF en toda la tienda
              </p>

              {/* Contador */}
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  justifyContent: "center",
                }}
              >
                <TimeUnit value={timeLeft.hours} label="HRS" />
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#10B981",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  :
                </div>
                <TimeUnit value={timeLeft.minutes} label="MIN" />
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#10B981",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  :
                </div>
                <TimeUnit value={timeLeft.seconds} label="SEG" />
              </div>
            </div>
          </motion.div>

          {/* MOCKUP 3: Slider de videos */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow:
                "0 10px 30px rgba(16, 185, 129, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
              minHeight: "280px",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={14} color="#ffffff" fill="#ffffff" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#000000",
                    opacity: 0.5,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  SLIDER DE VIDEOS
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "#000000",
                  }}
                >
                  Mostrá tu producto
                </div>
              </div>
            </div>

            {/* Thumbnails de videos */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
                flex: 1,
              }}
            >
              <VideoThumbnail
                gradient="linear-gradient(135deg, #f472b6, #ec4899)"
                emoji="👗"
                delay={0}
              />
              <VideoThumbnail
                gradient="linear-gradient(135deg, #60a5fa, #3b82f6)"
                emoji="👟"
                delay={0.15}
              />
              <VideoThumbnail
                gradient="linear-gradient(135deg, #fbbf24, #f59e0b)"
                emoji="👜"
                delay={0.3}
              />
              <VideoThumbnail
                gradient="linear-gradient(135deg, #34d399, #10b981)"
                emoji="⌚"
                delay={0.45}
              />
            </div>

            {/* Paginación */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.35rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "6px",
                  borderRadius: "3px",
                  background: "#10B981",
                }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: "#e5e7eb",
                }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: "#e5e7eb",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Componente para cada unidad del contador
function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "10px",
        padding: "0.6rem 0.7rem",
        minWidth: "56px",
        textAlign: "center",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          fontFamily: "monospace",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: "0.6rem",
          color: "rgba(255, 255, 255, 0.6)",
          fontWeight: 700,
          marginTop: "0.25rem",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Componente para cada thumbnail de video
function VideoThumbnail({
  gradient,
  emoji,
  delay,
}: {
  gradient: string;
  emoji: string;
  delay: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      style={{
        background: gradient,
        borderRadius: "10px",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "2rem" }}>{emoji}</div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay,
        }}
        style={{
          position: "absolute",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Play size={14} color="#000000" fill="#000000" />
      </motion.div>
    </motion.div>
  );
    }
