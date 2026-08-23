"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

const FAQS = [
  {
    q: "¿Cómo instalo Nevux en mi Tiendanube?",
    a: "La instalación es 100% automática. Una vez que conectás tu tienda y creás una cuenta, Nevux inyecta un pequeño script seguro en tu plantilla. Solo tenés que crear y activar los widgets desde tu panel para que empiecen a mostrarse.",
  },
  {
    q: "¿Puedo tener varios widgets activos al mismo tiempo?",
    a: "¡Sí, totalmente! Podés activar múltiples widgets a la vez (por ejemplo, un banner deslizable arriba, un badge de envío gratis debajo del precio y reseñas abajo de todo). Nevux está optimizado para que todos funcionen sin generar conflictos ni poner lenta tu web.",
  },
  {
    q: "¿Necesito saber programar o tocar código?",
    a: "Cero código. Diseñamos Nevux para que sea súper intuitivo. Modificás textos, colores, bordes y ubicaciones usando un editor visual. Los cambios se guardan y se reflejan al instante en tu tienda.",
  },
  {
    q: "¿Los widgets se adaptan a celulares?",
    a: "Sí. Todos los widgets están desarrollados bajo el concepto 'mobile-first', garantizando que se vean perfectos y profesionales tanto en celulares como en computadoras de escritorio, sin importar qué plantilla de Tiendanube uses.",
  },
  {
    q: "¿Cuánto demora en impactar un cambio en mi tienda?",
    a: "Los cambios son instantáneos. Una vez que hacés clic en 'Guardar cambios' en el panel de Nevux, solo tenés que recargar la pestaña de tu producto en la tienda para ver la actualización.",
  },
  {
    q: "¿Qué pasa si borro un widget por error?",
    a: "Para evitar accidentes, el sistema te pide escribir la palabra 'ELIMINAR' para confirmar. Si lo hacés, el widget se borra permanentemente de nuestra base de datos. Si querés volver a usarlo, vas a tener que crearlo nuevamente desde el catálogo.",
  },
];

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // El primero abierto por defecto

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
            <HelpCircle size={14} />
            Preguntas Frecuentes
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
            Resolvemos tus dudas
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
            Respuestas rápidas a las consultas más comunes de nuestra comunidad. Si no
            encontrás lo que buscás, contactanos.
          </p>
        </div>

        {/* LISTA DE FAQS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  background: "#FFFFFF",
                  border: isOpen ? "1.5px solid #10B981" : "1px solid #E5E7EB",
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "all 0.2s",
                }}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "18px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: isOpen ? "#10B981" : "#000000",
                      transition: "color 0.2s",
                    }}
                  >
                    {faq.q}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: isOpen ? "#ecfdf5" : "#F3F4F6",
                      color: isOpen ? "#10B981" : "#000000",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown size={14} strokeWidth={3} />
                  </div>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 500 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <div
                    style={{
                      padding: "0 20px 20px 20px",
                      fontSize: 14,
                      color: "#000000",
                      opacity: 0.7,
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA SOPORTE */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            padding: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 40,
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Lightbulb size={20} color="#000000" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#000000" }}>
                ¿No encontraste lo que buscabas?
              </div>
              <div style={{ fontSize: 14, color: "#000000", opacity: 0.6, marginTop: 4 }}>
                Hablá con nosotros y te ayudamos.
              </div>
            </div>
          </div>
          <Link
            href="/ayuda"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#10B981",
              color: "#FFFFFF",
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            <MessageCircle size={16} />
            Contactar soporte
          </Link>
        </div>

        {/* BASE CENTRO AYUDA */}
        <CentroAyuda />
      </div>
    </div>
  );
}
