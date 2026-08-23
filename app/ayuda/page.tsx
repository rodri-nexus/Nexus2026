"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Mail, MessageCircle, Copy, Check, ExternalLink } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

export default function AyudaPage() {
  const [copiado, setCopiado] = useState(false);
  const emailSoporte = "soportenevux@gmail.com";
  const whatsappSoporte = "https://wa.me/5493434163999?text=Hola%20equipo%20de%20Nevux,%20necesito%20ayuda%20con%20mi%20tienda.";

  const copiarEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailSoporte);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = emailSoporte;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      } catch (e) {}
      document.body.removeChild(textArea);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* HEADER SIMPLE NEVUX */}
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
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#000000",
            opacity: 0.7,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            transition: "opacity 0.2s",
          }}
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 60px" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#000000",
            margin: "0 0 32px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Soporte
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* TARJETA 1: CENTRO DE AYUDA (Guías) */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 24px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <BookOpen size={32} color="#10B981" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#000000", margin: "0 0 12px 0" }}>
              Centro de ayuda
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#000000",
                opacity: 0.6,
                lineHeight: 1.6,
                margin: "0 auto 24px auto",
                maxWidth: 400,
              }}
            >
              Encontrá guías detalladas, tutoriales paso a paso y respuestas a las preguntas más frecuentes sobre Nevux.
            </p>
            {/* Por ahora scrollea hacia abajo donde está el componente <CentroAyuda /> */}
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#10B981",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              Visitar centro de ayuda
              <ExternalLink size={18} />
            </button>
          </div>

          {/* TARJETA 2: ESCRIBIR UN EMAIL */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 24px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <Mail size={32} color="#000000" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#000000", margin: "0 0 12px 0" }}>
              Escribinos un mensaje
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#000000",
                opacity: 0.6,
                lineHeight: 1.6,
                margin: "0 auto 24px auto",
                maxWidth: 400,
              }}
            >
              Mandanos un correo y te responderemos a la brevedad. Disponible las 24 horas. Tu consulta no molesta.
            </p>
            <button
              onClick={copiarEmail}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: copiado ? "#10B981" : "#000000",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {emailSoporte}
              {copiado ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          {/* TARJETA 3: CHAT CON SOPORTE (WhatsApp) */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 24px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#dcfce7", // Verde muy suave de WhatsApp
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <MessageCircle size={32} color="#16a34a" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#000000", margin: "0 0 12px 0" }}>
              Chat con soporte
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#000000",
                opacity: 0.6,
                lineHeight: 1.6,
                margin: "0 auto 24px auto",
                maxWidth: 400,
              }}
            >
              Abrí el chat para hablar con nuestro equipo por WhatsApp y recibir ayuda en tiempo real.
            </p>
            <a
              href={whatsappSoporte}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#22c55e", // Verde WhatsApp oficial
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                padding: "14px 40px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(34, 197, 94, 0.3)",
              }}
            >
              <MessageCircle size={18} />
              Abrir chat
            </a>
          </div>

        </div>

        {/* COMPONENTE CENTRO DE AYUDA DE NEVUX (Base) */}
        <div style={{ marginTop: 60 }}>
          <CentroAyuda />
        </div>
      </div>
    </div>
  );
  }
