"use client";

import React from "react";

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface MensajeGarantiaConfig {
  titulo: string;
  texto: string;
  imagenBase64: string;
  colorFondo: string;
  colorTitulo: string;
  colorTexto: string;
  colorBorde: string;
  tamanoTitulo: string;
  tamanoTexto: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

interface Props {
  config: MensajeGarantiaConfig;
}

/* ═══════════════════════════════════════════
   HELPER PARSER MARKDOWN
═══════════════════════════════════════════ */
function parseTextoConMarkdown(texto: string): string {
  if (!texto) return "";

  // 1) Escapar HTML primero
  let out = texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // 2) Detectar listas (líneas que empiezan con "- ")
  const lineas = out.split("\n");
  const bloques: string[] = [];

  let bufferLista: string[] = [];

  const flushLista = () => {
    if (bufferLista.length > 0) {
      bloques.push(
        '<ul style="margin:6px 0;padding-left:18px;">' +
          bufferLista.map((it) => `<li style="margin-bottom:3px;">${it}</li>`).join("") +
          "</ul>"
      );
      bufferLista = [];
    }
  };

  for (const linea of lineas) {
    const trimmed = linea.trim();
    if (trimmed.startsWith("- ")) {
      bufferLista.push(trimmed.substring(2));
    } else {
      flushLista();
      bloques.push(linea);
    }
  }
  flushLista();

  out = bloques.join("\n");

  // 3) Formatos
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__(.+?)__/g, "<u>$1</u>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // 4) Saltos de línea
  out = out.replace(/\n/g, "<br/>");
  out = out.replace(/<br\/>\s*<ul/g, "<ul");
  out = out.replace(/<\/ul>\s*<br\/>/g, "</ul>");

  return out;
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MensajeGarantiaPreview({ config }: Props) {
  const {
    titulo,
    texto,
    imagenBase64,
    colorFondo,
    colorTitulo,
    colorTexto,
    colorBorde,
    tamanoTitulo,
    tamanoTexto,
    bordesRedondeados,
    paddingInterno,
  } = config;

  const tieneImagen = imagenBase64 && imagenBase64.trim() !== "";
  const tieneTitulo = titulo && titulo.trim() !== "";
  const tieneTexto = texto && texto.trim() !== "";

  const textoHtml = parseTextoConMarkdown(texto);

  return (
    <div
      style={{
        background: colorFondo || "#FFFFFF",
        border: `1.5px solid ${colorBorde || "rgba(16, 185, 129, 0.2)"}`,
        borderRadius: `${bordesRedondeados || 14}px`,
        padding: `${paddingInterno || 16}px`,
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: 1.5,
        boxShadow:
          "0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes nvxShieldGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 10px 2px rgba(16, 185, 129, 0.15); }
        }
      `}</style>

      {/* ICONO ESCUDO O IMAGEN CLIENTE */}
      <div
        style={{
          flexShrink: 0,
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          animation: "nvxShieldGlow 3s ease-in-out infinite",
        }}
      >
        {tieneImagen ? (
          <img
            src={imagenBase64}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {tieneTitulo && (
          <div
            style={{
              fontSize: tamanoTitulo || "15px",
              fontWeight: 800,
              color: colorTitulo || "#000000",
              lineHeight: 1.3,
              marginBottom: tieneTexto ? "6px" : 0,
              wordBreak: "break-word",
              letterSpacing: "-0.01em",
            }}
          >
            {titulo}
          </div>
        )}

        {tieneTexto && (
          <div
            style={{
              fontSize: tamanoTexto || "13px",
              color: colorTexto || "#000000",
              lineHeight: 1.5,
              wordBreak: "break-word",
              fontWeight: 500,
              opacity: 0.9,
            }}
            dangerouslySetInnerHTML={{ __html: textoHtml }}
          />
        )}
      </div>
    </div>
  );
    }
