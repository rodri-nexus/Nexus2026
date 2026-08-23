"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Store,
  PlusCircle,
  Palette,
  Rocket,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

const STEPS = [
  {
    n: 1,
    icon: Store,
    title: "Conectá tu tienda de Tiendanube",
    desc: "Desde el Dashboard, vinculá tu tienda para que Nevux pueda leer productos y mostrar widgets en tu catálogo.",
    tips: [
      "Asegurate de estar logueado con la cuenta correcta de Tiendanube",
      "Si ya la conectaste, vas a ver el nombre de tu tienda en el panel",
    ],
  },
  {
    n: 2,
    icon: PlusCircle,
    title: "Creá tu primer widget",
    desc: "Entrá a Widgets → Crear widget y elegí el que mejor se adapte a tu objetivo (urgencia, confianza, envíos, bundles, etc.).",
    tips: [
      "Podés crear widgets para un producto específico o para toda la tienda",
      "Empezá con 1 o 2 widgets clave, no hace falta activar todos de una",
    ],
  },
  {
    n: 3,
    icon: Palette,
    title: "Personalizá textos, colores y estilo",
    desc: "Usá el editor para ajustar mensaje, colores, tipografía, bordes y ubicación. La vista previa te muestra el resultado en vivo.",
    tips: [
      "Mantené la identidad de tu marca (colores y tono de voz)",
      "Textos cortos y claros convierten mejor",
    ],
  },
  {
    n: 4,
    icon: Rocket,
    title: "Activá y guardá",
    desc: "Marcá el widget como activo, guardá los cambios y listo. En pocos minutos debería verse en tu tienda (puede requerir refrescar caché).",
    tips: [
      "Si no lo ves al instante, probá en modo incógnito",
      "Verificá que el widget esté activo y con alcance correcto",
    ],
  },
];

const QUICK_LINKS = [
  {
    href: "/ayuda/faq",
    icon: HelpCircle,
    title: "Preguntas frecuentes",
    desc: "Respuestas rápidas a dudas comunes",
  },
  {
    href: "/ayuda",
    icon: MessageCircle,
    title: "Contactar soporte",
    desc: "Email y WhatsApp del equipo Nevux",
  },
];

export default function GuiaInicioPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <NevuxLogo size="medium" />
        <Link
          href="/ayuda"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#000000",
            opacity: 0.7,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          Soporte
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px 60px" }}>
        {/* INTRO */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#059669",
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            <BookOpen size={14} />
            Guía de inicio
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 10px 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Aprendé a crear tu primer widget
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              color: "#000000",
              opacity: 0.65,
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            En 4 pasos simples vas a tener Nevux funcionando en tu tienda de Tiendanube
            y empezando a subir el ticket promedio.
          </p>
        </div>

        {/* PASOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "#ecfdf5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    <Icon size={22} color="#10B981" strokeWidth={2} />
                    <div
                      style={{
                        position: "absolute",
                        top: -6,
                        left: -6,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#10B981",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #FFFFFF",
                      }}
                    >
                      {step.n}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#000000",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      style={{
                        margin: "0 0 14px 0",
                        fontSize: 15,
                        color: "#000000",
                        opacity: 0.7,
                        lineHeight: 1.55,
                      }}
                    >
                      {step.desc}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {step.tips.map((tip, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                            fontSize: 14,
                            color: "#000000",
                            lineHeight: 1.45,
                          }}
                        >
                          <CheckCircle2
                            size={16}
                            color="#10B981"
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <span style={{ opacity: 0.8 }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA crear widget */}
        <div
          style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #FFFFFF 100%)",
            border: "1px solid #a7f3d0",
            borderRadius: 16,
            padding: 24,
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: 18,
              fontWeight: 800,
              color: "#000000",
            }}
          >
            ¿Listo para empezar?
          </h3>
          <p
            style={{
              margin: "0 0 18px 0",
              fontSize: 14,
              color: "#000000",
              opacity: 0.65,
              lineHeight: 1.5,
            }}
          >
            Creá tu primer widget ahora y mirá cómo mejora la experiencia de compra.
          </p>
          <Link
            href="/widgets"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "#10B981",
              color: "#FFFFFF",
              borderRadius: 999,
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
            }}
          >
            Ir a mis widgets
            <Rocket size={16} />
          </Link>
        </div>

        {/* LINKS RÁPIDOS */}
        <div style={{ marginBottom: 40 }}>
          <h3
            style={{
              margin: "0 0 14px 0",
              fontSize: 16,
              fontWeight: 800,
              color: "#000000",
            }}
          >
            También te puede servir
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: 14,
                    padding: "16px 18px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: "#ecfdf5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="#10B981" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#000000" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#000000", opacity: 0.6, marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <CentroAyuda />
      </div>
    </div>
  );
    }
