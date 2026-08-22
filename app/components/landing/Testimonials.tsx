"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  store: string;
  location: string;
  photo: string;
  rating: number;
  text: string;
  date: string;
  metric?: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sofía Martínez",
    store: "Mimitos para Nosotras",
    location: "Buenos Aires",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Che, arranqué usando Nevux hace 2 meses y no puedo creer los resultados. Las ventas aumentaron un 40% solo con los bundles. Lo mejor es que la configuración fue re fácil, sin necesidad de saber programar 💕",
    date: "9 de mayo de 2026",
    metric: "+40% ventas",
  },
  {
    id: 2,
    name: "Federico Álvarez",
    store: "TechnoStore AR",
    location: "Córdoba",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "La aplicación es increíble. Agregamos videos, reseñas, cuentas regresivas y tablas comparativas que hicieron que nuestras páginas se vean mucho más profesionales. Vendemos productos de electrónica y realmente se nota la diferencia en la conversión.",
    date: "22 de abril de 2026",
    metric: "+65% conversión",
  },
  {
    id: 3,
    name: "Camila Ruiz",
    store: "Bloomé Deco",
    location: "Rosario",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    text: "Estaba buscando algo para optimizar mi tienda y encontré Nevux. La verdad que no me arrepiento nada. Los widgets se ven hermosos, el soporte responde súper rápido y mi ticket promedio subió un montón 🌸✨",
    date: "17 de junio de 2026",
    metric: "Ticket +2.3x",
  },
  {
    id: 4,
    name: "Martín Ortega",
    store: "Urbanwear.co",
    location: "Mendoza",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 4,
    text: "Muy buena app la verdad. Al principio me costó un poco entender cómo configurar los bundles pero después es re intuitivo. El soporte por WhatsApp es un golazo, te responden al toque. Recomendadísimo para tiendanuberos 👌",
    date: "3 de julio de 2026",
    metric: "+28% ventas",
  },
  {
    id: 5,
    name: "Lucía Fernández",
    store: "Canela Store",
    location: "La Plata",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
    text: "Me encantó Nevux!!! Fue muy útil para aumentar mis ventas. Se volvió muy imprescindible en mi tienda. Antes usaba otra app y honestamente esta es 100 veces mejor. Los mockups quedan hermosos y todo re personalizable.",
    date: "12 de agosto de 2026",
    metric: "+55% ventas",
  },
  {
    id: 6,
    name: "Nicolás Paz",
    store: "Move Fitness",
    location: "Tucumán",
    photo: "https://randomuser.me/api/portraits/men/71.jpg",
    rating: 5,
    text: "Tremenda app. En 1 semana ya vi cambios en las métricas. Uso principalmente los widgets de urgencia y las reseñas y me duplicó la tasa de conversión. Encima el equipo de soporte se copa un montón, te ayudan con todo 🚀",
    date: "28 de agosto de 2026",
    metric: "+110% conversión",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Rating de Tiendanube */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {/* Logo Tiendanube */}
          <svg
            width="105"
            height="20"
            viewBox="0 0 120 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "-0.02em",
              }}
            >
              4,8
            </span>
            <div style={{ display: "flex", gap: "0.1rem" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  fill="#fbbf24"
                  color="#fbbf24"
                  strokeWidth={0}
                />
              ))}
            </div>
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
          Lo que dicen{" "}
          <span
            style={{
              color: "#10B981",
            }}
          >
            nuestros clientes
          </span>
        </motion.h2>

        {/* Subtítulo */}
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
            maxWidth: "580px",
            margin: "0 auto 3rem auto",
          }}
        >
          <strong style={{ color: "#000000", opacity: 1 }}>+3.000 tiendas</strong> ya usan
          Nevux para vender más
        </motion.p>

        {/* Carrusel de testimonios */}
        <div
          style={{
            position: "relative",
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "clamp(1.5rem, 4vw, 2.5rem)",
                boxShadow:
                  "0 20px 60px rgba(16, 185, 129, 0.12), 0 8px 24px rgba(0, 0, 0, 0.05)",
                border: "1px solid #f3f4f6",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              {/* Quote decorativo */}
              <div
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  opacity: 0.08,
                }}
              >
                <Quote size={80} color="#10B981" fill="#10B981" />
              </div>

              {/* Header con foto y datos */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* Foto */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "3px solid #ffffff",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    background: "#f3f4f6",
                    position: "relative",
                  }}
                >
                  <img
                    src={currentTestimonial.photo}
                    alt={currentTestimonial.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      flexWrap: "wrap",
                      marginBottom: "0.15rem",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "#000000",
                        margin: 0,
                      }}
                    >
                      {currentTestimonial.name}
                    </h4>
                    <CheckCircle2
                      size={16}
                      fill="#3b82f6"
                      color="#ffffff"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#000000",
                      opacity: 0.6,
                      marginBottom: "0.35rem",
                    }}
                  >
                    <strong style={{ color: "#000000", opacity: 1 }}>
                      {currentTestimonial.store}
                    </strong>{" "}
                    · {currentTestimonial.location}
                  </div>
                  <div style={{ display: "flex", gap: "0.15rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={
                          i < currentTestimonial.rating ? "#fbbf24" : "#e5e7eb"
                        }
                        color={
                          i < currentTestimonial.rating ? "#fbbf24" : "#e5e7eb"
                        }
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                </div>

                {/* Métrica */}
                {currentTestimonial.metric && (
                  <div
                    style={{
                      display: "none",
                      padding: "0.5rem 0.85rem",
                      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "#059669",
                      flexShrink: 0,
                    }}
                    className="metric-badge"
                  >
                    {currentTestimonial.metric}
                  </div>
                )}
              </div>

              {/* Texto de la reseña */}
              <p
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                  color: "#000000",
                  opacity: 0.8,
                  lineHeight: 1.7,
                  margin: "0 0 1.25rem 0",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                "{currentTestimonial.text}"
              </p>

              {/* Footer con fecha y métrica */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f3f4f6",
                  position: "relative",
                  zIndex: 2,
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#000000",
                    opacity: 0.5,
                    fontWeight: 600,
                  }}
                >
                  {currentTestimonial.date}
                </div>
                {currentTestimonial.metric && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.4rem 0.8rem",
                      background: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#10B981",
                    }}
                  >
                    📈 {currentTestimonial.metric}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles de navegación */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={prev}
              aria-label="Testimonio anterior"
              style={navButtonStyle}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Indicadores */}
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Ir al testimonio ${i + 1}`}
                  style={{
                    width: i === currentIndex ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background:
                      i === currentIndex ? "#10B981" : "#e5e7eb",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Testimonio siguiente"
              style={navButtonStyle}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Contador */}
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#000000",
              opacity: 0.5,
              marginTop: "0.75rem",
              fontWeight: 600,
            }}
          >
            {currentIndex + 1} de {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
}

// Estilo compartido para botones de navegación
const navButtonStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  background: "#ffffff",
  border: "1.5px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#000000",
  transition: "all 0.2s",
  flexShrink: 0,
};
