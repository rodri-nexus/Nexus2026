"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Copy,
  Check,
  Sparkles,
  Palette,
  Type,
  Eye,
  Save,
  Loader2,
  X,
} from "lucide-react";

export interface BadgeCuponConfig {
  titulo: string;
  subtexto: string;
  codigo: string;
  badge: string;
  textoBoton: string;
  textoCopiado: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  botonBgColor: string;
  botonTextColor: string;
}

const DEFAULT_CONFIG: BadgeCuponConfig = {
  titulo: "🔥 ¡CUPÓN EXCLUSIVO!",
  subtexto: "Tocá para copiar el código y aplicalo en el checkout",
  codigo: "NEVUX10",
  badge: "10% OFF",
  textoBoton: "Copiar",
  textoCopiado: "¡Copiado! 🎉",
  bgColor: "#ffffff",
  borderColor: "#10B981",
  textColor: "#000000",
  badgeBgColor: "#ecfdf5",
  badgeTextColor: "#059669",
  botonBgColor: "#10B981",
  botonTextColor: "#ffffff",
};

interface BadgeCuponEditorProps {
  initialConfig?: Partial<BadgeCuponConfig>;
  onSave: (config: BadgeCuponConfig) => Promise<void> | void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export default function BadgeCuponEditor({
  initialConfig,
  onSave,
  onCancel,
  isSaving = false,
}: BadgeCuponEditorProps) {
  const [config, setConfig] = useState<BadgeCuponConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const [copiedPreview, setCopiedPreview] = useState(false);

  const updateField = <K extends keyof BadgeCuponConfig>(
    key: K,
    value: BadgeCuponConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleTestCopy = () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(config.codigo);
      }
    } catch (e) {
      console.log("Copy fallback", e);
    }
    setCopiedPreview(true);
    setTimeout(() => {
      setCopiedPreview(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* VISTA PREVIA EN VIVO */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: "18px",
            padding: "1.5rem",
            border: "1.5px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              color: "#374151",
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            <Eye size={18} color="#10B981" />
            <span>Vista Previa en Vivo (Página del producto)</span>
          </div>

          {/* Tarjeta Renderizada en Vivo */}
          <div
            style={{
              background: config.bgColor,
              border: `1.5px dashed ${config.borderColor}`,
              borderRadius: "14px",
              padding: "1.1rem 1.25rem",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "0.6rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Ticket size={18} color={config.borderColor} />
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    color: config.textColor,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {config.titulo}
                </span>
              </div>

              {config.badge && (
                <span
                  style={{
                    background: config.badgeBgColor,
                    color: config.badgeTextColor,
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  {config.badge}
                </span>
              )}
            </div>

            <p
              style={{
                margin: "0 0 0.85rem 0",
                fontSize: "0.82rem",
                color: config.textColor,
                opacity: 0.75,
                lineHeight: 1.4,
              }}
            >
              {config.subtexto}
            </p>

            {/* Fila del Código + Botón Copiar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "0.45rem 0.65rem 0.45rem 0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600 }}>
                  Código:
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    color: "#000000",
                    letterSpacing: "0.05em",
                  }}
                >
                  {config.codigo}
                </span>
              </div>

              <button
                type="button"
                onClick={handleTestCopy}
                style={{
                  background: copiedPreview ? "#059669" : config.botonBgColor,
                  color: config.botonTextColor,
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 0.9rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
              >
                {copiedPreview ? (
                  <>
                    <Check size={14} strokeWidth={3} />
                    {config.textoCopiado}
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    {config.textoBoton}
                  </>
                )}
              </button>
            </div>
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              textAlign: "center",
              marginTop: "0.6rem",
            }}
          >
            💡 Podés hacer clic en el botón de la vista previa para probar cómo se copia.
          </div>
        </div>

        {/* SECCIÓN 1: TEXTOS DEL CUPÓN */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "1.5rem",
            border: "1.5px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              color: "#111827",
              fontSize: "1.05rem",
              fontWeight: 800,
            }}
          >
            <Type size={18} color="#10B981" />
            <span>Textos y Contenido del Cupón</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {/* Título */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Título del Badge
              </label>
              <input
                type="text"
                value={config.titulo}
                onChange={(e) => updateField("titulo", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Subtexto */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Subtexto explicativo
              </label>
              <input
                type="text"
                value={config.subtexto}
                onChange={(e) => updateField("subtexto", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Código del Cupón y Badge */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.35rem",
                  }}
                >
                  Código del Cupón (El que creaste en Tiendanube)
                </label>
                <input
                  type="text"
                  value={config.codigo}
                  onChange={(e) =>
                    updateField("codigo", e.target.value.toUpperCase())
                  }
                  placeholder="Ej: NEVUX10"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.9rem",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.35rem",
                  }}
                >
                  Texto del Badge Destacado
                </label>
                <input
                  type="text"
                  value={config.badge}
                  onChange={(e) => updateField("badge", e.target.value)}
                  placeholder="Ej: 10% OFF"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* Texto Botón y Texto Copiado */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.35rem",
                  }}
                >
                  Texto del botón copiar
                </label>
                <input
                  type="text"
                  value={config.textoBoton}
                  onChange={(e) => updateField("textoBoton", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.35rem",
                  }}
                >
                  Texto al hacer clic (Copiado)
                </label>
                <input
                  type="text"
                  value={config.textoCopiado}
                  onChange={(e) => updateField("textoCopiado", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: PERSONALIZACIÓN DE COLORES */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "1.5rem",
            border: "1.5px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              color: "#111827",
              fontSize: "1.05rem",
              fontWeight: 800,
            }}
          >
            <Palette size={18} color="#10B981" />
            <span>Paleta de Colores y Estilo</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {/* Color Fondo Tarjeta */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Fondo de la Tarjeta
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => updateField("bgColor", e.target.value)}
                  style={{
                    width: "38px",
                    height: "38px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
                <input
                  type="text"
                  value={config.bgColor}
                  onChange={(e) => updateField("bgColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            {/* Color Borde */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Borde y Acentos
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="color"
                  value={config.borderColor}
                  onChange={(e) => updateField("borderColor", e.target.value)}
                  style={{
                    width: "38px",
                    height: "38px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
                <input
                  type="text"
                  value={config.borderColor}
                  onChange={(e) => updateField("borderColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            {/* Color Texto */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Texto Principal
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="color"
                  value={config.textColor}
                  onChange={(e) => updateField("textColor", e.target.value)}
                  style={{
                    width: "38px",
                    height: "38px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
                <input
                  type="text"
                  value={config.textColor}
                  onChange={(e) => updateField("textColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            {/* Color Botón Copiar */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Fondo Botón Copiar
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="color"
                  value={config.botonBgColor}
                  onChange={(e) => updateField("botonBgColor", e.target.value)}
                  style={{
                    width: "38px",
                    height: "38px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
                <input
                  type="text"
                  value={config.botonBgColor}
                  onChange={(e) => updateField("botonBgColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            {/* Color Badge Fondo */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Fondo Badge Destacado
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="color"
                  value={config.badgeBgColor}
                  onChange={(e) => updateField("badgeBgColor", e.target.value)}
                  style={{
                    width: "38px",
                    height: "38px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
                <input
                  type="text"
                  value={config.badgeBgColor}
                  onChange={(e) => updateField("badgeBgColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            {/* Color Badge Texto */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Texto Badge Destacado
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="color"
                  value={config.badgeTextColor}
                  onChange={(e) => updateField("badgeTextColor", e.target.value)}
                  style={{
                    width: "38px",
                    height: "38px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
                <input
                  type="text"
                  value={config.badgeTextColor}
                  onChange={(e) => updateField("badgeTextColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "1rem",
            paddingTop: "0.5rem",
          }}
        >
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "0.85rem 1.5rem",
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: "0.85rem 2rem",
              background: isSaving ? "rgba(16, 185, 129, 0.6)" : "#10B981",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
  }
