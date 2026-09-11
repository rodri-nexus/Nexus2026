// app/components/landing/FeatureCustomize.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles, Check, Wand2 } from "lucide-react";

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
  { name: "Negro Elegante", value: "#111827", gradient: "linear-gradient(135deg, #111827, #374151)" },
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

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#111827",
  fontWeight: 800,
  display: "block",
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
        gap: "0.65rem",
        padding: "0.65rem 0.75rem",
        background: selected ? `${buttonColor.value}15` : "#ffffff",
        border: selected
          ? `1.5px solid ${buttonColor.value}`
          : "1.5px solid #e5e7eb",
        borderRadius: borderRadius === "999px" ? "16px" : borderRadius,
        transition: "all 0.2s",
        boxSizing: "border-box",
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
          background: selected ? buttonColor.value : "#ffffff",
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
            gap: "0.35rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#000000" }}>
            {title}
          </span>
          {badge && (
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 800,
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
        <div style={{ fontSize: "0.65rem", color: "#000000", opacity: 0.6 }}>{subtitle}</div>
      </div>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#000000" }}>
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
    <section
      style={{
        padding: "5rem 1.25rem",
        background: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
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
              padding: "0.45rem 1rem",
              background: "#ecfdf5",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#059669",
              fontWeight: 800,
              letterSpacing: "0.03em",
              border: "1px solid #a7f3d0",
            }}
          >
            <Palette size={14} />
            MOTOR DE ESTILO DE MARCA INTELIGENTE
          </div>
        </motion.div>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.85rem)",
            fontWeight: 900,
            color: "#111827",
            textAlign: "center",
            margin: "0 0 1rem 0",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Sincronizá todos los widgets con la{" "}
          <span style={{ color: "#10B981" }}>identidad de tu marca</span>
        </motion.h2>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "#4b5563",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "760px",
            margin: "0 auto 1rem auto",
            fontWeight: 500,
          }}
        >
          Definí tus colores principales, bordes y tipografía una sola vez. 
          Nevux armoniza automáticamente los <b>27 widgets</b> y tus <b>asistentes de IA</b> para que se vean 100% nativos como parte original de tu tienda.
        </motion.p>

        {/* Tip en vivo */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#10B981",
            fontWeight: 800,
            margin: "0 0 3rem 0",
          }}
        >
          ✨ Probá tocar los ajustes de estilo y mirá el botón sincronizarse en tiempo real
        </motion.p>

        {/* Layout mockups interactivos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
              background: "#ffffff",
              borderRadius: "24px",
              padding: "1.75rem",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)",
              border: "1.5px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
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
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#6b7280",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                  }}
                >
                  SIMULADOR EN VIVO
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 900,
                    color: "#111827",
                    marginTop: "0.15rem",
                  }}
                >
                  Bundle Promocional
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.2)",
                }}
              />
            </div>

            {/* Bundle preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
              <PackOption
                title="1 Unidad"
                subtitle="Precio regular"
                price="12.000"
                selected={false}
                buttonColor={selectedColor}
                borderRadius={selectedRadius.value}
              />
              <PackOption
                title="Pack x2 (Ahorrás 15%)"
                subtitle="El más elegido por clientes"
                price="20.400"
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
                price="27.000"
                badge="RECOMENDADO"
                badgeColor="#ffffff"
                badgeBg="#111827"
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
                marginTop: "1.25rem",
                padding: "0.95rem",
                background: selectedColor.gradient,
                color: "#ffffff",
                border: "none",
                borderRadius: selectedRadius.value,
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 8px 24px ${selectedColor.value}44`,
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
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ display: "inline-block" }}
                >
                  Agregar al Carrito
                </motion.span>
              ) : (
                <span>Agregar al Carrito</span>
              )}
            </motion.button>

            <p
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                textAlign: "center",
                marginTop: "0.85rem",
                marginBottom: 0,
                lineHeight: 1.4,
              }}
            >
              Los cambios impactan al instante en tu Tiendanube sin demoras ni recargas.
            </p>
          </div>

          {/* PANEL DE CONFIGURACIÓN */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "1.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              border: "1.5px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                CONTROLES GLOBALES
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: "#111827",
                  marginTop: "0.15rem",
                }}
              >
                Estilo visual del botón
              </div>
            </div>

            {/* Color del botón */}
            <div>
              <label style={labelStyle}>Color de Marca Primario</label>
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
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      position: "relative",
                      padding: 0,
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
                          fontSize: "0.85rem",
                          fontWeight: 900,
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
                  color: "#6b7280",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                Tono seleccionado: {selectedColor.value} ({selectedColor.name})
              </div>
            </div>

            {/* Borde del botón */}
            <div>
              <label style={labelStyle}>Radio de Curvatura</label>
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
                      padding: "0.6rem 0.5rem",
                      background:
                        selectedRadius.value === option.value
                          ? "#ecfdf5"
                          : "#ffffff",
                      border:
                        selectedRadius.value === option.value
                          ? "1.5px solid #10B981"
                          : "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color:
                        selectedRadius.value === option.value
                          ? "#059669"
                          : "#374151",
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
              <label style={labelStyle}>Animación y Efecto de Conversión</label>
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
                      padding: "0.6rem 0.5rem",
                      background:
                        selectedEffect.value === effect.value
                          ? "#ecfdf5"
                          : "#ffffff",
                      border:
                        selectedEffect.value === effect.value
                          ? "1.5px solid #10B981"
                          : "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color:
                        selectedEffect.value === effect.value
                          ? "#059669"
                          : "#374151",
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
                padding: "0.85rem",
                background: "#ecfdf5",
                borderRadius: "12px",
                border: "1px solid #a7f3d0",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <Wand2 size={16} color="#059669" style={{ marginTop: "2px", flexShrink: 0 }} />
              <p style={{ fontSize: "0.75rem", color: "#065f46", margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
                <strong>Sincronización Total:</strong> Cuando guardás tus estilos en el panel de Nevux, se aplican a todos los widgets de tu tienda automáticamente.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
