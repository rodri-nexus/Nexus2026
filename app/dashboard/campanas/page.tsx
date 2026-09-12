// app/dashboard/campanas/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Sparkles,
  Check,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface CampaignPreset {
  slug: string;
  name: string;
  tagline: string;
  themeColor: string;
  accentColor: string;
  defaultBadge: string;
  emoji: string;
}

interface CampaignSettings {
  store_id?: number;
  is_active: boolean;
  campaign_slug: string;
  custom_badge_text: string;
  theme_color: string;
  accent_color: string;
}

interface PresetCardProps {
  preset: CampaignPreset;
  isSelected: boolean;
  onSelect: (preset: CampaignPreset) => void;
}

interface PreviewCardProps {
  preset: CampaignPreset;
  badgeText: string;
  isActive: boolean;
}

/* ═══════════════════════════════════════════
   CONSTANTES Y PRESETS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const CAMPAIGN_PRESETS: CampaignPreset[] = [
  {
    slug: "black-friday",
    name: "Black Friday",
    tagline: "Estética Dark & Gold de alto impacto para compras masivas.",
    themeColor: "#111827",
    accentColor: "#F59E0B",
    defaultBadge: "🔥 BLACK FRIDAY",
    emoji: "🔥",
  },
  {
    slug: "hot-sale",
    name: "Hot Sale",
    tagline: "Urgencia extrema y velocidad de compra estilo Hot Sale.",
    themeColor: "#0F172A",
    accentColor: "#EF4444",
    defaultBadge: "⚡ HOT SALE",
    emoji: "⚡",
  },
  {
    slug: "cyber-monday",
    name: "Cyber Monday",
    tagline: "Diseño tecnológico y moderno para liquidación digital.",
    themeColor: "#090D16",
    accentColor: "#3B82F6",
    defaultBadge: "🚀 CYBER MONDAY",
    emoji: "🚀",
  },
  {
    slug: "navidad",
    name: "Navidad & Reyes",
    tagline: "Ambiente festivo y elegante enfocado en compra de regalos.",
    themeColor: "#064E3B",
    accentColor: "#EF4444",
    defaultBadge: "🎄 ESPECIAL NAVIDAD",
    emoji: "🎄",
  },
  {
    slug: "san-valentin",
    name: "San Valentín",
    tagline: "Diseño pasional ideal para packs dúo y regalos de pareja.",
    themeColor: "#831843",
    accentColor: "#F43F5E",
    defaultBadge: "💘 SAN VALENTÍN",
    emoji: "💘",
  },
  {
    slug: "dia-madre-padre",
    name: "Día Madre / Padre",
    tagline: "Confianza y calidez para el regalo familiar perfecto.",
    themeColor: "#312E81",
    accentColor: "#10B981",
    defaultBadge: "🎁 REGALO ESPECIAL",
    emoji: "🎁",
  },
  {
    slug: "liquidacion",
    name: "Liquidación Total / Sale",
    tagline: "Descuentos agresivos para vaciar stock y fin de temporada.",
    themeColor: "#7F1D1D",
    accentColor: "#FBBF24",
    defaultBadge: "🏷️ SALE FINAL",
    emoji: "🏷️",
  },
];

/* ═══════════════════════════════════════════
   SUB-COMPONENTES (Regla #9 al inicio)
═══════════════════════════════════════════ */
function PresetCard({ preset, isSelected, onSelect }: PresetCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      style={{
        background: isSelected ? "#ecfdf5" : "#ffffff",
        border: isSelected ? "2px solid #10B981" : "1.5px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1.1rem",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "0.75rem",
        transition: "all 0.15s ease",
        position: "relative",
        boxShadow: isSelected ? "0 4px 14px rgba(16, 185, 129, 0.15)" : "none",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <span style={{ fontSize: "1.6rem" }}>{preset.emoji}</span>
        {isSelected && (
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "#10B981",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "0.2rem" }}>
          {preset.name}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.35 }}>
          {preset.tagline}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "4px",
            background: preset.themeColor,
            border: "1px solid #e5e7eb",
          }}
        />
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "4px",
            background: preset.accentColor,
            border: "1px solid #e5e7eb",
          }}
        />
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            padding: "0.15rem 0.45rem",
            borderRadius: "6px",
            background: preset.themeColor,
            color: preset.accentColor,
            marginLeft: "auto",
          }}
        >
          {preset.defaultBadge}
        </span>
      </div>
    </button>
  );
}

function LivePreviewWidget({ preset, badgeText, isActive }: PreviewCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: "1.5px solid #e5e7eb",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#6b7280", letterSpacing: "0.05em" }}>
          SIMULACIÓN VISUAL EN VIVO
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            background: isActive ? "#ecfdf5" : "#f3f4f6",
            color: isActive ? "#059669" : "#6b7280",
            border: isActive ? "1px solid #a7f3d0" : "1px solid #e5e7eb",
          }}
        >
          {isActive ? "● SKIN ACTIVO" : "○ MODO NORMAL"}
        </span>
      </div>

      {/* Widget 1: Badge Temático */}
      <div
        style={{
          background: isActive ? preset.themeColor : "#f3f4f6",
          color: isActive ? preset.accentColor : "#111827",
          padding: "0.85rem 1rem",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          boxShadow: isActive ? `0 4px 12px ${preset.themeColor}33` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Tag size={16} color={isActive ? preset.accentColor : "#10B981"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>
            {isActive ? `${badgeText || preset.defaultBadge} • 6 Cuotas Sin Interés` : "6 Cuotas Sin Interés"}
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", opacity: 0.8, fontWeight: 700 }}>
          {isActive ? "OFERTA HOY" : "ENVÍO GRATIS"}
        </span>
      </div>

      {/* Widget 2: Cuenta Regresiva Temática */}
      <div
        style={{
          background: isActive ? preset.themeColor : "#111827",
          border: isActive ? `1.5px solid ${preset.accentColor}55` : "1px solid #374151",
          borderRadius: "14px",
          padding: "1rem",
          color: "#ffffff",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.7rem",
            fontWeight: 800,
            color: isActive ? preset.accentColor : "#10B981",
            marginBottom: "0.4rem",
          }}
        >
          <Clock size={12} />
          {isActive ? `${preset.emoji} LA OFERTA TERMINA EN:` : "LA OFERTA TERMINA EN:"}
        </div>
        <div
          style={{
            fontSize: "1.3rem",
            fontWeight: 900,
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            color: isActive ? preset.accentColor : "#ffffff",
          }}
        >
          04:28:19
        </div>
      </div>

      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0, textAlign: "center", lineHeight: 1.4 }}>
        Si en tu tienda tenés estos widgets activos, se adaptarán al diseño superior automáticamente.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function FechasEspecialesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);

  // Estados de configuración
  const [isActive, setIsActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<CampaignPreset>(CAMPAIGN_PRESETS[0]);
  const [customBadge, setCustomBadge] = useState("");

  // Cargar configuración guardada
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          if (data.campaign) {
            setStoreId(data.campaign.store_id || null);
            setIsActive(Boolean(data.campaign.is_active));
            setCustomBadge(data.campaign.custom_badge_text || "");

            const found = CAMPAIGN_PRESETS.find((p) => p.slug === data.campaign.campaign_slug);
            if (found) {
              setSelectedPreset(found);
            }
          }
        }
      } catch (err) {
        console.error("Error cargando configuración de campañas:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSelectPreset = (preset: CampaignPreset) => {
    setSelectedPreset(preset);
    if (!customBadge || CAMPAIGN_PRESETS.some((p) => p.defaultBadge === customBadge)) {
      setCustomBadge(preset.defaultBadge);
    }
  };

  const handleSave = async () => {
    if (!storeId) {
      alert("No se detectó una tienda activa vinculada.");
      return;
    }

    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: storeId,
          is_active: isActive,
          campaign_slug: selectedPreset.slug,
          custom_badge_text: customBadge || selectedPreset.defaultBadge,
          theme_color: selectedPreset.themeColor,
          accent_color: selectedPreset.accentColor,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert("Ocurrió un error al guardar. Reintentá.");
      }
    } catch (err) {
      console.error("Error guardando campaña:", err);
      alert("Error de conexión al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <Loader2 size={36} color="#10B981" className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        color: "#111827",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        paddingBottom: "5rem",
      }}
    >
      {/* HEADER DE NAVEGACIÓN */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "1rem 1.25rem",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.5rem 0.85rem",
                borderRadius: "10px",
                background: "#f3f4f6",
                color: "#111827",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              <ArrowLeft size={16} />
              Volver
            </Link>
            <NevuxLogo size="medium" />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.5rem",
              background: savedSuccess ? "#059669" : "#10B981",
              color: "#ffffff",
              border: "none",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 800,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Guardando...
              </>
            ) : savedSuccess ? (
              <>
                <Check size={16} strokeWidth={3} />
                ¡Cambios Guardados!
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.25rem" }}>
        
        {/* TITULO Y DESCRIPCIÓN */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.85rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "#059669",
              marginBottom: "0.75rem",
            }}
          >
            <Flame size={14} />
            FECHAS ESPECIALES & EVENTOS 2.0
          </div>

          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
            Vestí tus widgets para eventos de alta venta
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#6b7280", margin: 0, maxWidth: "720px", lineHeight: 1.5 }}>
            Activá una estética especial en un solo clic. Los widgets que ya tengas creados se adaptarán al diseño temático sin crear duplicados ni saturar tu tienda.
          </p>
        </div>

        {/* NOTA DE SEGURIDAD / FILOSOFÍA 2.0 */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e5e7eb",
            borderRadius: "16px",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#ecfdf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.45 }}>
            <strong>100% Respetuoso de tu tienda:</strong> Esta herramienta <u>no crea widgets nuevos</u> ni multiplica tus listas. Solo maquilla visualmente los widgets que tengas activos en tu tienda.
          </div>
        </div>

        {/* INTERRUPTOR PRINCIPAL (ACTIVAR/DESACTIVAR) */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e5e7eb",
            borderRadius: "20px",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", marginBottom: "0.25rem" }}>
              Estado del Modo Evento Especial
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              {isActive
                ? `Activo en tu tienda bajo el evento: ${selectedPreset.name}`
                : "Desactivado. Tus widgets se muestran con su diseño habitual."}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              border: "none",
              background: isActive ? "#10B981" : "#e5e7eb",
              color: isActive ? "#ffffff" : "#4b5563",
              fontSize: "0.9rem",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {isActive ? "✓ EVENTO ACTIVADO" : "○ ACTIVAR EVENTO"}
          </button>
        </div>

        {/* LAYOUT EN 2 COLUMNAS: SELECTOR + PREVIEW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* COLUMNA 1: SELECCIÓN DE PRESET Y AJUSTES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#111827", marginBottom: "0.85rem" }}>
                1. Elegí la temática del evento
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "0.85rem",
                }}
              >
                {CAMPAIGN_PRESETS.map((preset) => (
                  <PresetCard
                    key={preset.slug}
                    preset={preset}
                    isSelected={selectedPreset.slug === preset.slug}
                    onSelect={handleSelectPreset}
                  />
                ))}
              </div>
            </div>

            {/* Texto del Badge */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.25rem",
              }}
            >
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "#111827", marginBottom: "0.4rem" }}>
                2. Texto de la insignia / badge temático
              </label>
              <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: "0 0 0.85rem 0" }}>
                Aparece junto a tus cuotas, envíos o títulos de widgets.
              </p>
              <input
                type="text"
                value={customBadge}
                onChange={(e) => setCustomBadge(e.target.value)}
                placeholder={selectedPreset.defaultBadge}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          {/* COLUMNA 2: SIMULADOR EN VIVO */}
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#111827", marginBottom: "0.85rem" }}>
              3. Vista previa del maquillaje en widgets
            </label>
            <LivePreviewWidget
              preset={selectedPreset}
              badgeText={customBadge || selectedPreset.defaultBadge}
              isActive={isActive}
            />
          </div>
        </div>
      </main>
    </div>
  );
    }
