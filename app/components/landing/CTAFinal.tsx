"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Rocket, Sparkles } from "lucide-react";

export default function CTAFinal() {
  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        background: "#ffffff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "32px",
          padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 4vw, 3rem)",
          position: "relative",
          overflow: "hidden",
          border: "1.5px solid #10B981",
          boxShadow: "0 20px 60px rgba(16, 185, 129, 0.12)",
          boxSizing: "border-box",
        }}
      >
        {/* Orbes decorativos de fondo Verde Esmeralda */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Sparkles flotantes decorativos */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "15%",
            left: "8%",
            color: "#10B981",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        >
          <Sparkles size={24} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 12, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            color: "#10B981",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        >
          <Sparkles size={20} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            position: "absolute",
            bottom: "20%",
            left: "12%",
            color: "#10B981",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        >
          <Sparkles size={18} />
        </motion.div>

        {/* Contenido */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          {/* Ícono destacado */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              type: "spring",
              delay: 0.1,
            }}
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 1.5rem auto",
              borderRadius: "20px",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 15px 40px rgba(16, 185, 129, 0.35)",
            }}
          >
            <Rocket size={32} color="#ffffff" strokeWidth={2} />
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 1rem 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            ¿Listo para{" "}
            <span
              style={{
                color: "#10B981",
              }}
            >
              aumentar tus ventas
            </span>
            ?
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              color: "#000000",
              opacity: 0.7,
              lineHeight: 1.6,
              margin: "0 auto 2.5rem auto",
              maxWidth: "560px",
            }}
          >
            Sumate a las tiendas que ya están convirtiendo más con{" "}
            <strong style={{ color: "#000000", opacity: 1 }}>Nevux</strong>
          </motion.p>

          {/* Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
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

          {/* Botones Nativo Blindados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              alignItems: "center",
              maxWidth: "380px",
              margin: "0 auto",
            }}
          >
            {/* Botón principal */}
            <a
              href="/registro"
              style={{
                width: "100%",
                padding: "1.1rem 2rem",
                background: "#10B981",
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "1.05rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              {/* Brillo animado */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                  pointerEvents: "none",
                }}
              />
              <span style={{ position: "relative", zIndex: 2 }}>
                Probar gratis
              </span>
              <ArrowRight size={20} style={{ position: "relative", zIndex: 2 }} />
            </a>

            {/* Botón secundario */}
            <a
              href="/registro"
              style={{
                width: "100%",
                padding: "1.05rem 2rem",
                background: "#ffffff",
                color: "#000000",
                borderRadius: "999px",
                fontSize: "1.05rem",
                fontWeight: 600,
                textDecoration: "none",
                border: "1.5px solid #000000",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              Ver todos los widgets
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* Nota inferior */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{
              marginTop: "1.5rem",
              fontSize: "0.8rem",
              color: "#000000",
              opacity: 0.6,
              margin: "1.5rem 0 0 0",
              fontWeight: 500,
            }}
          >
            🔒 Datos protegidos · ⚡ Setup en menos de 5 minutos
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

// Bullet item
function BulletItem({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        fontSize: "0.95rem",
        color: "#000000",
        fontWeight: 600,
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "#10B981",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
        }}
      >
        <Check size={14} color="#ffffff" strokeWidth={3} />
      </div>
      <span>{text}</span>
    </div>
  );
              }
