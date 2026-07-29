"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles } from "lucide-react";

// Colores disponibles para el botón
const buttonColors = [
  { name: "Violeta", value: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { name: "Negro", value: "#111827", gradient: "linear-gradient(135deg, #111827, #374151)" },
  { name: "Verde", value: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { name: "Rojo", value: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
  { name: "Azul", value: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
  { name: "Naranja", value: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

const borderRadiusOptions = [
  { name: "Sin redondear", value: "4px" },
  { name: "Redondeado", value: "12px" },
  { name: "Círculo", value: "999px" },
];

const buttonEffects = [
  { name: "Sin efecto", value: "none" },
  { name: "Zoom", value: "zoom" },
  { name: "Aureola", value: "pulse" },
];

export default function FeatureCustomize() {
  const [selectedColor, setSelectedColor] = useState(buttonColors[0]);
  const [selectedRadius, setSelectedRadius] = useState(borderRadiusOptions[1]);
  const [selectedEffect, setSelectedEffect] = useState(buttonEffects[2]);

  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        background: "linear-gradient(180deg, #eef2ff 0%, #f9fafb 100%)",
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
              background: "white",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#6366f1",
              fontWeight: 700,
              letterSpacing: "0.02em",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <Palette size={14} />
            100% PERSONALIZABLE
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
            color: "#111827",
            textAlign: "center",
            margin: "0 0 1rem 0",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Customiza los widgets{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            a tu medida
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
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "680px",
            margin: "0 auto 1rem auto",
          }}
        >
          Edita <strong style={{ color: "#374151" }}>colores</strong>,{" "}
          <strong style={{ color: "#374151" }}>textos</strong>,{" "}
          <strong style={{ color: "#374151" }}>productos</strong> y{" "}
          <strong style={{ color: "#374151" }}>estilos</strong> para que cada
          widget se adapte perfectamente a tu tienda y a tu marca.
        </motion.p>

        {/* Tip: probalo en vivo */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#6366f1",
            fontWeight: 600,
            margin: "0 0 3rem 0",
          }}
        >
          ✨ Probá cambiar los ajustes y mirá cómo se actualiza en vivo
        </motion.p>

        {/* Layout mockups */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            alignItems: "stretch",
          }}
        >
          {/* PREVIEW del bundle */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow:
                "0 10px 30px rgba(99, 102, 241, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div>
                <div style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em" }}>
                  PREVIEW EN VIVO
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827", marginTop: "0.15rem" }}>
                  Widget de Bundle
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.2)",
                }}
              />
            </div>

            {/* Bundle preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
              <PackOption
                title="Pack x1"
                subtitle="Variante"
                price="9.000"
                selected={false}
                buttonColor={selectedColor}
                borderRadius={selectedRadius.value}
              />
              <PackOption
                title="Pack x2"
                subtitle="Ahorrá 15%"
                price="15.300"
                badge="MÁS VENDIDO"
                badgeColor="#dc2626"
                badgeBg="#fee2e2"
                selected={true}
                buttonColor={selectedColor}
                borderRadius={selectedRadius.value}
              />
              <PackOption
                title="Pack x3"
                subtitle="Ahorrá 25%"
                price="21.600"
                badge="RECOMENDADO"
                badgeColor="#059669"
                badgeBg="#d1fae5"
                selected={false}
                buttonColor={selectedColor}
                borderRadius={selectedRadius.value}
              />
            </div>

            {/* Botón Agregar - se actualiza en vivo */}
            <motion.button
              key={`${selectedColor.value}-${selectedRadius.value}-${selectedEffect.value}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: "1rem",
                padding: "0.9rem",
                background: selectedColor.gradient,
                color: "white",
                border: "none",
                borderRadius: selectedRadius.value,
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 8px 20px ${selectedColor.value}55`,
                position: "relative",
                overflow: "visible",
              }}
            >
              {/* Efecto pulse (aureola) */}
              {selectedEffect.value === "pulse" && (
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1.3],
                    opacity: [0.5, 0.25, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: selectedColor.gradient,
                    borderRadius: selectedRadius.value,
                    zIndex: -1,
                  }}
                />
              )}

              {/* Efecto zoom */}
              {selectedEffect.value === "zoom" ? (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ display: "inline-block" }}
                >
                  Agregar al carrito
                </motion.span>
              ) : (
                <span>Agregar al carrito</span>
              )}
            </motion.button>

            <p
              style={{
                fontSize: "0.7rem",
                color: "#9ca3af",
                textAlign: "center",
                marginTop: "0.75rem",
                marginBottom: 0,
                lineHeight: 1.4,
              }}
            >
              El widget reemplaza a las variantes del producto, cantidad y
              botón de "Agregar al carrito".
            </p>
          </div>

          {/* PANEL DE CONFIGURACIÓN */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow:
                "0 10px 30px rgba(99, 102, 241, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid #f3f4f6",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div
              style={{
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em" }}>
                CONFIGURACIÓN
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827", marginTop: "0.15rem" }}>
                Estilo del botón
              </div>
            </div>

            {/* Color del botón */}
            <div>
              <label style={labelStyle}>Color del botón "Agregar"</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {buttonColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color.name}
                    style={{
                      aspectRatio: "1",
                      background: color.gradient,
                      border:
                        selectedColor.value === color.value
                          ? "3px solid #111827"
                          : "3px solid transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      position: "relative",
                      padding: 0,
                    }}
                  >
                    {selectedColor.value === color.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.85rem",
                          fontWeight: 800,
                        }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  fontFamily: "monospace",
                }}
              >
                {selectedColor.value}
              </div>
            </div>

            {/* Borde del botón */}
            <div>
              <label style={labelStyle}>Borde del botón</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.4rem",
                  marginTop: "0.5rem",
                }}
              >
                {borderRadiusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedRadius(option)}
                    style={{
                      padding: "0.55rem 0.5rem",
                      background:
                        selectedRadius.value === option.value
                          ? "linear-gradient(135deg, #eef2ff, #ede9fe)"
                          : "white",
                      border:
                        selectedRadius.value === option.value
                          ? "1.5px solid #6366f1"
                          : "1.5px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color:
                        selectedRadius.value === option.value
                          ? "#6366f1"
                          : "#6b7280",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Efecto del botón */}
            <div>
              <label style={labelStyle}>Efecto del botón</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.4rem",
                  marginTop: "0.5rem",
                }}
              >
                {buttonEffects.map((effect) => (
                  <button
                    key={effect.value}
                    onClick={() => setSelectedEffect(effect)}
                    style={{
                      padding: "0.55rem 0.5rem",
                      background:
                        selectedEffect.value === effect.value
                          ? "linear-gradient(135deg, #eef2ff, #ede9fe)"
                          : "white",
                      border:
                        selectedEffect.value === effect.value
                          ? "1.5px solid #6366f1"
                          : "1.5px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color:
                        selectedEffect.value === effect.value
                          ? "#6366f1"
                          : "#6b7280",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {effect.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Nota inferior */}
            <div
              style={{
                marginTop: "auto",
                padding: "0.75rem",
                background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <Sparkles size={14} color="#6366f1" style={{ marginTop: "2px", flexShrink: 0 }} />
              <p style={{ fontSize: "0.75rem", color: "#4f46e5", margin: 0, lineHeight: 1.4 }}>
                <strong>Y hay más:</strong> también podés editar textos,
                fuentes, badges, animaciones y mucho más.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Estilo de labels
const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#374151",
  fontWeight: 600,
  display: "block",
};

// Opción de pack (dentro del preview)
function PackOption({
  title,
  subtitle,
  price,
  badge,
  badgeColor,
  badgeBg,
  selected,
  buttonColor,
  borderRadius,
}: {
  title: string;
  subtitle: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  selected: boolean;
  buttonColor: { value: string; gradient: string };
  borderRadius: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        padding: "0.65rem 0.75rem",
        background: selected ? `${buttonColor.value}0F` : "white",
        border: selected
          ? `1.5px solid ${buttonColor.value}`
          : "1.5px solid #e5e7eb",
        borderRadius: borderRadius === "999px" ? "16px" : borderRadius,
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: selected
            ? `2px solid ${buttonColor.value}`
            : "2px solid #d1d5db",
          background: selected ? buttonColor.value : "white",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "white",
            }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>
            {title}
          </span>
          {badge && (
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 700,
                padding: "0.1rem 0.35rem",
                background: badgeBg,
                color: badgeColor,
                borderRadius: "4px",
                letterSpacing: "0.02em",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>{subtitle}</div>
      </div>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>
        ${price}
      </div>
    </div>
  );
    }
