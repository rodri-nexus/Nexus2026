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
  messages: string[];
  speed: string;
  direction: string;
  bgColor: string;
  textColor: string;
  fontSize: string;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES
   ═══════════════════════════════════════════ */

const PRESETS: { n: string; bg: string; tx: string; slug: string }[] = [
  { n: "Sin campaña", bg: "", tx: "", slug: "" },
  { n: "Black Friday", bg: "#111827", tx: "#F59E0B", slug: "black-friday" },
  { n: "Hot Sale", bg: "#0F172A", tx: "#EF4444", slug: "hot-sale" },
  { n: "Cyber Monday", bg: "#090D16", tx: "#3B82F6", slug: "cyber-monday" },
  { n: "Navidad & Reyes", bg: "#064E3B", tx: "#EF4444", slug: "navidad" },
  { n: "San Valentín", bg: "#831843", tx: "#F43F5E", slug: "san-valentin" },
  { n: "Día Madre/Padre", bg: "#312E81", tx: "#10B981", slug: "dia-madre-padre" },
  { n: "Liquidación", bg: "#7F1D1D", tx: "#FBBF24", slug: "liquidacion" },
];

const DEF: Cfg = {
  messages: ["✨ Nuevo ingreso", "🔥 Más vendido", "📦 Envío gratis hoy"],
  speed: "normal",
  direction: "left",
  bgColor: "#111827",
  textColor: "#ffffff",
  fontSize: "14",
  campaignTheme: "",
};

const DUR: Record<string, string> = {
  lento: "20s",
  normal: "12s",
  rapido: "6s",
};

/* ═══════════════════════════════════════════
   HELPERS (antes del componente — Regla #9)
   ═══════════════════════════════════════════ */

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };
  return {
    messages:
      Array.isArray(raw.messages) && raw.messages.length > 0
        ? (raw.messages as string[])
        : DEF.messages,
    speed: (raw.speed as string) || DEF.speed,
    direction: (raw.direction as string) || DEF.direction,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    fontSize: (raw.fontSize as string) || DEF.fontSize,
    campaignTheme: (raw.campaignTheme as string) || "",
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════ */

export default function MarqueeNovedadesEditor({
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
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    setOk(false);
    setErr("");
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const addMsg = () => {
    const t = newMsg.trim();
    if (!t) return;
    set("messages", [...cfg.messages, t]);
    setNewMsg("");
  };

  const rmMsg = (i: number) =>
    set(
      "messages",
      cfg.messages.filter((_, idx) => idx !== i)
    );

  const applyPreset = (slug: string) => {
    const p = PRESETS.find((x) => x.slug === slug);
    if (!p) return;
    setCfg((prev) => ({
      ...prev,
      campaignTheme: slug,
      ...(p.bg ? { bgColor: p.bg, textColor: p.tx } : {}),
    }));
  };

  const save = async () => {
    setSaving(true);
    setOk(false);
    setErr("");
    try {
      const body = {
        ...(ew?.id ? { id: ew.id } : {}), // Envía el ID para actualizar si ya existe
        store_id: storeId,
        widget_slug: wd.slug,
        config: cfg,
        target_type: targetType,
        target_product_id: productId,
        is_active: true,
      };
      // Usamos POST siempre para Upsert
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

  const animName = cfg.direction === "right" ? "nvxMqR" : "nvxMqL";
  const dur = DUR[cfg.speed] || "12s";

  const inputStyle: CSSProperties = {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
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
      <style>{`
        @keyframes nvxMqL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes nvxMqR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
      `}</style>

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
              textTransform: "uppercase" as const,
              letterSpacing: "0.05em",
            }}
          >
            Vista previa en vivo
          </div>
          <div
            style={{
              overflow: "hidden",
              background: cfg.bgColor,
              borderRadius: 8,
              padding: "14px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                animation: `${animName} ${dur} linear infinite`,
              }}
            >
              {[...cfg.messages, ...cfg.messages].map((m, i) => (
                <span
                  key={i}
                  style={{
                    color: cfg.textColor,
                    fontSize: `${cfg.fontSize}px`,
                    fontWeight: 700,
                    padding: "0 28px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {m}
                </span>
              ))}
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
                <label style={labelStyle}>Mensajes del marquee</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {cfg.messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <input
                        value={m}
                        onChange={(e) => {
                          const arr = [...cfg.messages];
                          arr[i] = e.target.value;
                          set("messages", arr);
                        }}
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => rmMsg(i)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid #fecaca",
                          background: "#fef2f2",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  <input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addMsg()}
                    placeholder="Nuevo mensaje..."
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={addMsg}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#10B981",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    + Agregar
                  </button>
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
                  <label style={labelStyle}>Velocidad</label>
                  <select
                    value={cfg.speed}
                    onChange={(e) => set("speed", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                      background: "#fff",
                    }}
                  >
                    <option value="lento">🐢 Lento</option>
                    <option value="normal">🚶 Normal</option>
                    <option value="rapido">🏃 Rápido</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Dirección</label>
                  <select
                    value={cfg.direction}
                    onChange={(e) => set("direction", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                      background: "#fff",
                    }}
                  >
                    <option value="left">← Izquierda</option>
                    <option value="right">Derecha →</option>
                  </select>
                </div>
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
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="color"
                      value={cfg.bgColor}
                      onChange={(e) => set("bgColor", e.target.value)}
                      style={{
                        width: 40,
                        height: 36,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 6,
                        padding: 0,
                      }}
                    />
                    <input
                      value={cfg.bgColor}
                      onChange={(e) => set("bgColor", e.target.value)}
                      style={{
                        ...inputStyle,
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Color de texto</label>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="color"
                      value={cfg.textColor}
                      onChange={(e) => set("textColor", e.target.value)}
                      style={{
                        width: 40,
                        height: 36,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 6,
                        padding: 0,
                      }}
                    />
                    <input
                      value={cfg.textColor}
                      onChange={(e) => set("textColor", e.target.value)}
                      style={{
                        ...inputStyle,
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label style={labelStyle}>
                  Tamaño de fuente: {cfg.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="28"
                  value={cfg.fontSize}
                  onChange={(e) => set("fontSize", e.target.value)}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "#9ca3af",
                  }}
                >
                  <span>10px</span>
                  <span>28px</span>
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
              <p
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  margin: "0 0 8px 0",
                }}
              >
                Seleccioná un preset y se aplican los colores
                automáticamente.
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
                          background: p.tx,
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
