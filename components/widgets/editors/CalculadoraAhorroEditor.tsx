"use client";

import { useState, useEffect, type CSSProperties } from "react";

/* ═══════════════════════════════════════════
   TIPOS
   ═══════════════════════════════════════════ */

interface WidgetDef {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExWidget {
  id: number;
  config: Record<string, unknown>;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface Props {
  widgetDefinition: WidgetDef;
  existingWidget: ExWidget | null;
  targetType: "product" | "all";
  productId: number | null;
  storeId: number;
}

interface Cfg {
  badgeText: string;
  prefixText: string;
  exampleAmount: string;
  suffixText: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES
   ═══════════════════════════════════════════ */

const PRESETS: { n: string; bg: string; tx: string; bd: string; ac: string; slug: string }[] = [
  { n: "Sin campaña", bg: "", tx: "", bd: "", ac: "", slug: "" },
  { n: "Black Friday", bg: "#111827", tx: "#ffffff", bd: "#F59E0B", ac: "#F59E0B", slug: "black-friday" },
  { n: "Hot Sale", bg: "#0F172A", tx: "#ffffff", bd: "#EF4444", ac: "#EF4444", slug: "hot-sale" },
  { n: "Cyber Monday", bg: "#090D16", tx: "#ffffff", bd: "#3B82F6", ac: "#3B82F6", slug: "cyber-monday" },
  { n: "Navidad & Reyes", bg: "#064E3B", tx: "#ffffff", bd: "#EF4444", ac: "#EF4444", slug: "navidad" },
  { n: "San Valentín", bg: "#831843", tx: "#ffffff", bd: "#F43F5E", ac: "#F43F5E", slug: "san-valentin" },
  { n: "Día Madre/Padre", bg: "#312E81", tx: "#ffffff", bd: "#10B981", ac: "#10B981", slug: "dia-madre-padre" },
  { n: "Liquidación", bg: "#7F1D1D", tx: "#ffffff", bd: "#FBBF24", ac: "#FBBF24", slug: "liquidacion" },
];

const DEF: Cfg = {
  badgeText: "AHORRO EXCLUSIVO",
  prefixText: "🎉 ¡Ahorrás",
  exampleAmount: "$ 14.500",
  suffixText: "comprando hoy!",
  bgColor: "#ecfdf5",
  textColor: "#065f46",
  borderColor: "#10B981",
  accentColor: "#059669",
  campaignTheme: "",
};

/* ═══════════════════════════════════════════
   HELPERS (Regla #9)
   ═══════════════════════════════════════════ */

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };
  return {
    badgeText: (raw.badgeText as string) || DEF.badgeText,
    prefixText: (raw.prefixText as string) || DEF.prefixText,
    exampleAmount: (raw.exampleAmount as string) || DEF.exampleAmount,
    suffixText: (raw.suffixText as string) || DEF.suffixText,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    borderColor: (raw.borderColor as string) || DEF.borderColor,
    accentColor: (raw.accentColor as string) || DEF.accentColor,
    campaignTheme: (raw.campaignTheme as string) || "",
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════ */

export default function CalculadoraAhorroEditor({
  widgetDefinition: wd,
  existingWidget: ew,
  targetType,
  productId,
  storeId,
}: Props) {
  const [cfg, setCfg] = useState<Cfg>(() => parseCfg(ew?.config));
  const [tab, setTab] = useState<"gen" | "style" | "dates">("gen");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setOk(false);
    setErr("");
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const applyPreset = (slug: string) => {
    const p = PRESETS.find((x) => x.slug === slug);
    if (!p) return;
    setCfg((prev) => ({
      ...prev,
      campaignTheme: slug,
      ...(p.bg ? { bgColor: p.bg, textColor: p.tx, borderColor: p.bd, accentColor: p.ac } : {}),
    }));
  };

  const save = async () => {
    setSaving(true);
    setOk(false);
    setErr("");
    try {
      const body = {
        ...(ew?.id ? { id: ew.id } : {}),
        store_id: storeId,
        widget_slug: wd.slug,
        config: cfg,
        target_type: targetType,
        target_product_id: productId,
        is_active: true,
      };
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setOk(true);
    } catch {
      setErr("No se pudo guardar. Reintentá.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
    background: "#ffffff",
  };

  const labelStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <a
            href="/widgets"
            style={{ fontSize: 22, textDecoration: "none", color: "#111827" }}
          >
            ←
          </a>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#111827",
                margin: 0,
              }}
            >
              {wd.icon} {wd.name}
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              {wd.description}
            </p>
          </div>
        </div>

        {/* ── PREVIEW ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Vista previa en vivo
          </div>

          <div
            style={{
              background: cfg.bgColor,
              borderRadius: 12,
              border: `1.5px solid ${cfg.borderColor}`,
              padding: "16px 18px",
              color: cfg.textColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {cfg.badgeText && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                    color: cfg.accentColor,
                    textTransform: "uppercase",
                  }}
                >
                  {cfg.badgeText}
                </span>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                {cfg.prefixText}{" "}
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: cfg.accentColor,
                    textDecoration: "underline",
                  }}
                >
                  {cfg.exampleAmount}
                </span>{" "}
                {cfg.suffixText}
              </div>
            </div>

            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: cfg.accentColor,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              %
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 16,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 4,
          }}
        >
          {(
            [
              ["gen", "General"],
              ["style", "Estilos"],
              ["dates", "Fechas"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                background: tab === k ? "#111827" : "transparent",
                color: tab === k ? "#fff" : "#6b7280",
                transition: "all 0.2s",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: 20,
            marginBottom: 16,
          }}
        >
          {/* GENERAL */}
          {tab === "gen" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Etiqueta superior</label>
                <input
                  value={cfg.badgeText}
                  onChange={(e) => set("badgeText", e.target.value)}
                  placeholder="AHORRO EXCLUSIVO"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>Texto inicial</label>
                  <input
                    value={cfg.prefixText}
                    onChange={(e) => set("prefixText", e.target.value)}
                    placeholder="🎉 ¡Ahorrás"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Texto final</label>
                  <input
                    value={cfg.suffixText}
                    onChange={(e) => set("suffixText", e.target.value)}
                    placeholder="comprando hoy!"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Monto de ejemplo para vista previa</label>
                <input
                  value={cfg.exampleAmount}
                  onChange={(e) => set("exampleAmount", e.target.value)}
                  placeholder="$ 14.500"
                  style={inputStyle}
                />
                <p style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 0 0" }}>
                  💡 En la tienda real se calculará automáticamente con la diferencia entre el precio normal y el tachado.
                </p>
              </div>
            </div>
          )}

          {/* ESTILOS */}
          {tab === "style" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>Color de fondo</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={cfg.bgColor}
                      onChange={(e) => set("bgColor", e.target.value)}
                      style={{ width: 40, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 0 }}
                    />
                    <input
                      value={cfg.bgColor}
                      onChange={(e) => set("bgColor", e.target.value)}
                      style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Color de texto</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={cfg.textColor}
                      onChange={(e) => set("textColor", e.target.value)}
                      style={{ width: 40, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 0 }}
                    />
                    <input
                      value={cfg.textColor}
                      onChange={(e) => set("textColor", e.target.value)}
                      style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>Color del borde</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={cfg.borderColor}
                      onChange={(e) => set("borderColor", e.target.value)}
                      style={{ width: 40, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 0 }}
                    />
                    <input
                      value={cfg.borderColor}
                      onChange={(e) => set("borderColor", e.target.value)}
                      style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Color de resalte (%)</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={cfg.accentColor}
                      onChange={(e) => set("accentColor", e.target.value)}
                      style={{ width: 40, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 0 }}
                    />
                    <input
                      value={cfg.accentColor}
                      onChange={(e) => set("accentColor", e.target.value)}
                      style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FECHAS ESPECIALES */}
          {tab === "dates" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <label style={{ ...labelStyle, marginBottom: 4 }}>
                Tema de campaña
              </label>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px 0" }}>
                Seleccioná un preset para unificar con el evento comercial.
              </p>
              {PRESETS.map((p) => (
                <button
                  key={p.slug || "none"}
                  type="button"
                  onClick={() => applyPreset(p.slug)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    border:
                      cfg.campaignTheme === p.slug
                        ? "2px solid #10B981"
                        : "1px solid #e5e7eb",
                    background:
                      cfg.campaignTheme === p.slug
                        ? "#ecfdf5"
                        : "#fff",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {p.bg && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: p.bg,
                        border: "1px solid rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: p.ac,
                        }}
                      />
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {p.n}
                  </span>
                  {cfg.campaignTheme === p.slug && (
                    <span
                      style={{
                        marginLeft: "auto",
                        color: "#10B981",
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── ALERTAS ── */}
        {ok && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #10B981",
              borderRadius: 10,
              padding: "10px 16px",
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 700,
              color: "#059669",
            }}
          >
            ✅ Widget guardado correctamente
          </div>
        )}
        {err && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 10,
              padding: "10px 16px",
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 700,
              color: "#dc2626",
            }}
          >
            ❌ {err}
          </div>
        )}

        {/* ── BOTÓN GUARDAR ── */}
        <button
          onClick={save}
          disabled={saving}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            background: saving ? "#9ca3af" : "#10B981",
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving
            ? "Guardando..."
            : ew
              ? "Actualizar Widget"
              : "Crear Widget"}
        </button>
      </div>
    </div>
  );
  }
