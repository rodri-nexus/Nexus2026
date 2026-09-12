// components/widgets/editors/MensajeGarantiaPreview.tsx
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
  campaignTheme?: string;
}

interface Props {
  config: MensajeGarantiaConfig;
}

/* ═══════════════════════════════════════════
   CAMPANAS PRESETS
═══════════════════════════════════════════ */
const THEMES: Record<string, { themeColor: string; accentColor: string; textColor: string; titleColor: string }> = {
  'black-friday': { themeColor: '#111827', accentColor: '#F59E0B', textColor: '#d1d5db', titleColor: '#ffffff' },
  'hot-sale': { themeColor: '#0F172A', accentColor: '#EF4444', textColor: '#cbd5e1', titleColor: '#ffffff' },
  'cyber-monday': { themeColor: '#090D16', accentColor: '#3B82F6', textColor: '#cbd5e1', titleColor: '#ffffff' },
  'navidad': { themeColor: '#064E3B', accentColor: '#EF4444', textColor: '#a7f3d0', titleColor: '#ffffff' },
  'san-valentin': { themeColor: '#831843', accentColor: '#F43F5E', textColor: '#fbcfe8', titleColor: '#ffffff' },
  'dia-padre-madre': { themeColor: '#312E81', accentColor: '#10B981', textColor: '#c7d2fe', titleColor: '#ffffff' },
  'liquidacion': { themeColor: '#7F1D1D', accentColor: '#FBBF24', textColor: '#fca5a5', titleColor: '#ffffff' },
};

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
  const currentCampaign = config.campaignTheme && config.campaignTheme !== 'none' ? config.campaignTheme : null;
  const activeTheme = currentCampaign ? THEMES[currentCampaign] : null;

  const colorFondo = activeTheme ? activeTheme.themeColor : config.colorFondo;
  const colorBorde = activeTheme ? activeTheme.accentColor : config.colorBorde;
  const colorTitulo = activeTheme ? activeTheme.titleColor : config.colorTitulo;
  const colorTexto = activeTheme ? activeTheme.textColor : config.colorTexto;

  const tieneImagen = config.imagenBase64 && config.imagenBase64.trim() !== "";
  const tieneTitulo = config.titulo && config.titulo.trim() !== "";
  const tieneTexto = config.texto && config.texto.trim() !== "";

  const textoHtml = parseTextoConMarkdown(config.texto);

  return (
    <div
      style={{
        background: colorFondo || "#FFFFFF",
        border: `1.5px solid ${colorBorde || "rgba(16, 185, 129, 0.2)"}`,
        borderRadius: `${config.bordesRedondeados || 14}px`,
        padding: `${config.paddingInterno || 16}px`,
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
          background: activeTheme ? `${activeTheme.accentColor}22` : "#ecfdf5",
          border: `1px solid ${activeTheme ? activeTheme.accentColor : "#a7f3d0"}`,
          animation: "nvxShieldGlow 3s ease-in-out infinite",
        }}
      >
        {tieneImagen ? (
          <img
            src={config.imagenBase64}
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
            stroke={activeTheme ? activeTheme.accentColor : "#10B981"}
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
              fontSize: config.tamanoTitulo || "15px",
              fontWeight: 800,
              color: colorTitulo || "#000000",
              lineHeight: 1.3,
              marginBottom: tieneTexto ? "6px" : 0,
              wordBreak: "break-word",
              letterSpacing: "-0.01em",
            }}
          >
            {config.titulo}
          </div>
        )}

        {tieneTexto && (
          <div
            style={{
              fontSize: config.tamanoTexto || "13px",
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
