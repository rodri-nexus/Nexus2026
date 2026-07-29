"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Package, TrendingUp, Zap } from "lucide-react";

type Pack = {
  id: number;
  title: string;
  subtitle: string;
  originalPrice: number;
  price: number;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  discount: number;
};

const packs: Pack[] = [
  {
    id: 1,
    title: "Pack x1",
    subtitle: "Ideal para probar",
    originalPrice: 45000,
    price: 35600,
    discount: 21,
  },
  {
    id: 2,
    title: "Pack x2",
    subtitle: "Ahorrá 15%",
    originalPrice: 90000,
    price: 65500,
    badge: "MÁS VENDIDO",
    badgeColor: "#dc2626",
    badgeBg: "#fee2e2",
    discount: 27,
  },
  {
    id: 3,
    title: "Pack x3",
    subtitle: "Ahorrá 25%",
    originalPrice: 135000,
    price: 89000,
    badge: "RECOMENDADO",
    badgeColor: "#059669",
    badgeBg: "#d1fae5",
    discount: 34,
  },
];

export default function FeatureBundles() {
  const [selectedPack, setSelectedPack] = useState<number>(2);

  const currentPack = packs.find((p) => p.id === selectedPack) || packs[0];

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
              background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#6366f1",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <Package size={14} />
            BUNDLES INTELIGENTES
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
          Incrementa tu facturación{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            impulsando tu ticket promedio
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
            margin: "0 auto 3.5rem auto",
          }}
        >
          Ofrece <strong style={{ color: "#374151" }}>bundles</strong> y{" "}
          <strong style={{ color: "#374151" }}>promociones especiales</strong>{" "}
          para incentivar a tus clientes a comprar más y aumentar el ticket
          promedio de tu tienda.
        </motion.p>

        {/* Mockup funcional */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "clamp(1.25rem, 3vw, 2rem)",
            boxShadow:
              "0 20px 60px rgba(99, 102, 241, 0.12), 0 8px 24px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f3f4f6",
            maxWidth: "500px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Barra superior tipo browser */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              paddingBottom: "1rem",
              marginBottom: "1.25rem",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
            <div
              style={{
                marginLeft: "auto",
                fontSize: "0.7rem",
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              tu-tienda.mitiendanube.com
            </div>
          </div>

          {/* Título del bundle */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "inline-block",
                padding: "0.25rem 0.7rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              HASTA 34% OFF
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#111827",
                margin: "0.25rem 0 0.25rem 0",
                letterSpacing: "-0.01em",
              }}
            >
              Armá tu pack
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              Elegí la cantidad y ahorrá más
            </p>
          </div>

          {/* Opciones de packs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
              marginBottom: "1.25rem",
            }}
          >
            {packs.map((pack) => {
              const isSelected = selectedPack === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.9rem 1rem",
                    background: isSelected
                      ? "linear-gradient(135deg, #eef2ff, #ede9fe)"
                      : "white",
                    border: isSelected
                      ? "2px solid #6366f1"
                      : "2px solid #e5e7eb",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    textAlign: "left",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {/* Radio */}
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: isSelected
                        ? "2px solid #6366f1"
                        : "2px solid #d1d5db",
                      background: isSelected ? "#6366f1" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      />
                    )}
                  </div>

                  {/* Info del pack */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        marginBottom: "0.15rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {pack.title}
                      </span>
                      {pack.badge && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.45rem",
                            background: pack.badgeBg,
                            color: pack.badgeColor,
                            borderRadius: "4px",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      {pack.subtitle}
                    </div>
                  </div>

                  {/* Precios */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#9ca3af",
                        textDecoration: "line-through",
                        marginBottom: "0.1rem",
                      }}
                    >
                      ${pack.originalPrice.toLocaleString("es-AR")}
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      ${pack.price.toLocaleString("es-AR")}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botón agregar al carrito */}
          <motion.button
            key={selectedPack}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              width: "100%",
              padding: "1rem",
              background: "linear-gradient(135deg, #111827, #374151)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            Agregar al carrito · ${currentPack.price.toLocaleString("es-AR")}
          </motion.button>

          {/* Info debajo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            <MiniFeature icon={<Check size={12} />} text="Envío gratis" />
            <MiniFeature
              icon={<TrendingUp size={12} />}
              text={`Ahorrás ${currentPack.discount}%`}
            />
            <MiniFeature icon={<Zap size={12} />} text="Stock disponible" />
          </div>
        </motion.div>

        {/* Bullets destacados debajo del mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            marginTop: "3.5rem",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <BundleFeature
            title="Aumentá el ticket promedio"
            description="Los clientes gastan hasta 3x más cuando ven una oferta de bundle atractiva."
          />
          <BundleFeature
            title="Sin código ni programación"
            description="Configurá tus bundles en minutos desde el panel, sin tocar una línea de código."
          />
          <BundleFeature
            title="100% personalizable"
            description="Elegí colores, textos, productos y descuentos que se adapten a tu marca."
          />
        </motion.div>
      </div>
    </section>
  );
}

function MiniFeature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        fontSize: "0.7rem",
        color: "#059669",
        fontWeight: 600,
      }}
    >
      {icon}
      {text}
    </div>
  );
}

function BundleFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.75rem",
        }}
      >
        <Check size={18} color="#6366f1" strokeWidth={2.5} />
      </div>
      <h4
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 0.35rem 0",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#6b7280",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
