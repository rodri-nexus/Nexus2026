// app/components/landing/FeatureCustomize.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles, Check, Wand2, Sliders, Eye, Zap } from "lucide-react";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface ButtonColor {
  name: string;
  value: string;
  gradient: string;
}

interface RadiusOption {
  name: string;
  value: string;
}

interface EffectOption {
  name: string;
  value: string;
}

interface PackOptionProps {
  title: string;
  subtitle: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  selected: boolean;
  buttonColor: ButtonColor;
  borderRadius: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES Y ESTILOS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const buttonColors: ButtonColor[] = [
  { name: "Verde Nevux", value: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { name: "Negro Elegante", value: "#1e293b", gradient: "linear-gradient(135deg, #1e293b, #0f172a)" },
  { name: "Azul Royal", value: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
  { name: "Menta Fresco", value: "#34d399", gradient: "linear-gradient(135deg, #34d399, #059669)" },
  { name: "Naranja Atractivo", value: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { name: "Rojo Urgencia", value: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
];

const borderRadiusOptions: RadiusOption[] = [
  { name: "Recto (4px)", value: "4px" },
  { name: "Moderno (12px)", value: "12px" },
  { name: "Píldora (999px)", value: "999px" },
];

const buttonEffects: EffectOption[] = [
  { name: "Estático", value: "none" },
  { name: "Zoom", value: "zoom" },
  { name: "Aureola de Luz", value: "pulse" },
];

const containerStyle: React.CSSProperties = {
  position: "relative",
  background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(16, 185, 129, 0.08), #07090e 80%)",
  padding: "6rem 1.25rem 7rem 1.25rem",
  overflow: "hidden",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#ffffff",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(18, 20, 26, 0.8)",
  borderRadius: "24px",
  padding: "2rem",
  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  display: "flex",
  flexDirection: "column",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxSizing: "border-box",
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  color: "#e5e7eb",
  fontWeight: 800,
  display: "block",
  letterSpacing: "0.02em",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTES (Regla #9 al inicio)
═══════════════════════════════════════════ */
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
}: PackOptionProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.85rem 1rem",
        background: selected ? `${buttonColor.value}18` : "rgba(255, 255, 255, 0.03)",
        border: selected
          ? `1.5px solid ${buttonColor.value}`
          : "1.5px solid rgba(255, 255, 255, 0.06)",
        borderRadius: borderRadius === "999px" ? "16px" : borderRadius,
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: selected
            ? `2px solid ${buttonColor.value}`
            : "2px solid rgba(255, 255, 255, 0.2)",
          background: selected ? buttonColor.value : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ffffff",
            }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>
            {title}
          </span>
          {badge && (
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                padding: "0.15rem 0.45rem",
                background: badgeBg,
                color: badgeColor,
                borderRadius: "6px",
                letterSpacing: "0.02em",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>
          {subtitle}
        </div>
      </div>
      <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#ffffff" }}>
        ${price}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function FeatureCustomize() {
  const [selectedColor, setSelectedColor] = useState<ButtonColor>(buttonColors[0]);
  const [selectedRadius, setSelectedRadius] = useState<RadiusOption>(borderRadiusOptions[1]);
  const [selectedEffect, setSelectedEffect] = useState<EffectOption>(buttonEffects[2]);

  return (
    <section id="estilo" style={containerStyle}>
      <div style={{ maxWidth: "1150px", margin: "0 auto", position: "relative", zIndex: 2 }}>
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
              padding: "6px 16px",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "999px",
              fontSize: "0.78rem",
              color: "#10B981",
              fontWeight: 800,
              letterSpacing: "0.05em",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              textTransform: "uppercase",
            }}
          >
            <Palette size={14} />
            MOTOR DE ESTILO DE MARCA SINCRONIZADO
          </div>
        </motion.div>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            margin: "0 0 1rem 0",
            letterSpacing: "-0.035em",
            lineHeight: 1.12,
          }}
        >
          Sincronizá todos los widgets con la{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            identidad visual de tu tienda
          </span>
        </motion.h2>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.18rem)",
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "780px",
            margin: "0 auto 1rem auto",
            fontWeight: 400,
          }}
        >
          Definí tu paleta de colores, curvatura de botones y tipografía una sola vez. 
          Nevux armoniza automáticamente los <strong style={{ color: "#ffffff" }}>26 widgets</strong> y tus <strong style={{ color: "#10B981" }}>asistentes de IA</strong> para que se sientan 100% nativos del diseño de tu Tiendanube.
        </motion.p>

        {/* Tip en vivo interactivo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "0.85rem",
            color: "#10B981",
            fontWeight: 700,
            margin: "0 0 3.5rem 0",
          }}
        >
          <Sparkles size={16} />
          <span>Probá tocar los controles de abajo y mirá la sincronización en vivo</span>
        </motion.div>

        {/* Layout mockups interactivos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.75rem",
            alignItems: "stretch",
          }}
        >
          {/* PREVIEW EN VIVO */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#10B981",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  SIMULADOR EN VIVO
                </div>
                <div
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    marginTop: "0.2rem",
                  }}
                >
                  Bundle Promocional
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  borderRadius: "999px",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10B981",
                    boxShadow: "0 0 10px #10B981",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10B981" }}>
                  En Vivo
                </span>
              </div>
            </div>

            {/* Bundle preview items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
              <PackOption
                title="1 Unidad"
                subtitle="Precio regular"
                price="24.900"
                selected={false}
                buttonColor={selectedColor}
                borderRadius={selectedRadius.value}
              />
              <PackOption
                title="Pack x2 (Ahorrás 15%)"
                subtitle="La opción más elegida"
                price="42.300"
                badge="MÁS VENDIDO"
                badgeColor="#ffffff"
                badgeBg="#10B981"
                selected={true}
                buttonColor={selectedColor}
                borderRadius={selectedRadius.value}
              />
              <PackOption
                title="Pack x3 (Ahorrás 25%)"
                subtitle="Máximo ahorro en envío"
                price="56.000"
                badge="RECOMENDADO"
                badgeColor="#ffffff"
                badgeBg="#3b82f6"
                selected={false}
                buttonColor={selectedColor}
                borderRadius={selectedRadius.value}
              />
            </div>

            {/* Botón CTA Dinámico */}
            <motion.button
              key={`${selectedColor.value}-${selectedRadius.value}-${selectedEffect.value}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: "1.5rem",
                padding: "1.1rem",
                background: selectedColor.gradient,
                color: "#ffffff",
                border: "none",
                borderRadius: selectedRadius.value,
                fontSize: "1rem",
                fontWeight: 900,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 8px 25px ${selectedColor.value}55`,
                position: "relative",
                overflow: "visible",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {/* Efecto aureola pulse */}
              {selectedEffect.value === "pulse" && (
                <motion.div
                  animate={{
                    scale: [1, 1.12, 1.25],
                    opacity: [0.6, 0.2, 0],
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
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Zap size={18} />
                  <span>Agregar al Carrito</span>
                </motion.span>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Agregar al Carrito</span>
                </>
              )}
            </motion.button>

            <p
              style={{
                fontSize: "0.78rem",
                color: "#6b7280",
                textAlign: "center",
                marginTop: "1rem",
                marginBottom: 0,
                lineHeight: 1.45,
              }}
            >
              ⚡ Los cambios se sincronizan en tu tienda al instante sin recargar la página.
            </p>
          </div>

          {/* PANEL DE CONTROLES */}
          <div style={cardStyle}>
            <div
              style={{
                paddingBottom: "1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#10B981",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                CONFIGURACIÓN GLOBAL
              </div>
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  marginTop: "0.2rem",
                }}
              >
                Personalización en 1 Clic
              </div>
            </div>

            {/* Color del botón */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Color Principal de Marca</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "0.6rem",
                  marginTop: "0.6rem",
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
                          ? "2.5px solid #ffffff"
                          : "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      position: "relative",
                      padding: 0,
                      boxShadow: selectedColor.value === color.value ? `0 0 15px ${color.value}` : "none",
                    }}
                  >
                    {selectedColor.value === color.value && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                        }}
                      >
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  fontWeight: 600,
                }}
              >
                Tono activo: <strong style={{ color: "#ffffff" }}>{selectedColor.name}</strong> ({selectedColor.value})
              </div>
            </div>

            {/* Radio de Curvatura */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Curvatura de Bordes</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                  marginTop: "0.6rem",
                }}
              >
                {borderRadiusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedRadius(option)}
                    style={{
                      padding: "0.75rem 0.5rem",
                      background:
                        selectedRadius.value === option.value
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(255, 255, 255, 0.04)",
                      border:
                        selectedRadius.value === option.value
                          ? "1.5px solid #10B981"
                          : "1.5px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color:
                        selectedRadius.value === option.value
                          ? "#10B981"
                          : "#9ca3af",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Efecto de Animación */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Animación y Efecto Psicológico</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                  marginTop: "0.6rem",
                }}
              >
                {buttonEffects.map((effect) => (
                  <button
                    key={effect.value}
                    onClick={() => setSelectedEffect(effect)}
                    style={{
                      padding: "0.75rem 0.5rem",
                      background:
                        selectedEffect.value === effect.value
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(255, 255, 255, 0.04)",
                      border:
                        selectedEffect.value === effect.value
                          ? "1.5px solid #10B981"
                          : "1.5px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color:
                        selectedEffect.value === effect.value
                          ? "#10B981"
                          : "#9ca3af",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {effect.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner de Sincronización Automática */}
            <div
              style={{
                marginTop: "auto",
                padding: "1rem",
                background: "rgba(16, 185, 129, 0.08)",
                borderRadius: "14px",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <Wand2 size={18} color="#10B981" style={{ marginTop: "2px", flexShrink: 0 }} />
              <p style={{ fontSize: "0.8rem", color: "#d1fae5", margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
                <strong style={{ color: "#ffffff" }}>Sincronización Universal:</strong> Cuando elegís tus colores en Nevux, se aplican a los 26 widgets automáticamente sin tocar código.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
                   }
