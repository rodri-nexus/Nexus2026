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
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
  workDays: number[]; // [1,2,3,4,5] (Monday to Friday)
  openText: string;
  closedText: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  showIcon: boolean;
  campaignTheme: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES
   ═══════════════════════════════════════════ */

const PRESETS: { n: string; bg: string; tx: string; bd: string; slug: string }[] = [
  { n: "Sin campaña", bg: "", tx: "", bd: "", slug: "" },
  { n: "Black Friday", bg: "#111827", tx: "#ffffff", bd: "#F59E0B", slug: "black-friday" },
  { n: "Hot Sale", bg: "#0F172A", tx: "#ffffff", bd: "#EF4444", slug: "hot-sale" },
  { n: "Cyber Monday", bg: "#090D16", tx: "#ffffff", bd: "#3B82F6", slug: "cyber-monday" },
  { n: "Navidad & Reyes", bg: "#064E3B", tx: "#ffffff", bd: "#EF4444", slug: "navidad" },
  { n: "San Valentín", bg: "#831843", tx: "#ffffff", bd: "#F43F5E", slug: "san-valentin" },
  { n: "Día Madre/Padre", bg: "#312E81", tx: "#ffffff", bd: "#10B981", slug: "dia-madre-padre" },
  { n: "Liquidación", bg: "#7F1D1D", tx: "#ffffff", bd: "#FBBF24", slug: "liquidacion" },
];

const DAYS_NAME = [
  { v: 1, n: "Lunes" },
  { v: 2, n: "Martes" },
  { v: 3, n: "Miércoles" },
  { v: 4, n: "Jueves" },
  { v: 5, n: "Viernes" },
  { v: 6, n: "Sábado" },
  { v: 0, n: "Domingo" },
];

const DEF: Cfg = {
  openTime: "09:00",
  closeTime: "18:00",
  workDays: [1, 2, 3, 4, 5], // lunes a viernes
  openText: "🟢 ¡Abierto! Estamos online para ayudarte en tus compras.",
  closedText: "🔴 Cerrado ahora. Pero podés comprar y procesamos tu pedido mañana.",
  bgColor: "#ffffff",
  textColor: "#111827",
  borderColor: "#e5e7eb",
  showIcon: true,
  campaignTheme: "",
};

/* ═══════════════════════════════════════════
   HELPERS (Regla #9)
   ═══════════════════════════════════════════ */

function parseCfg(raw: Record<string, unknown> | undefined): Cfg {
  if (!raw) return { ...DEF };
  return {
    openTime: (raw.openTime as string) || DEF.openTime,
    closeTime: (raw.closeTime as string) || DEF.closeTime,
    workDays: Array.isArray(raw.workDays) ? (raw.workDays as number[]) : DEF.workDays,
    openText: (raw.openText as string) || DEF.openText,
    closedText: (raw.closedText as string) || DEF.closedText,
    bgColor: (raw.bgColor as string) || DEF.bgColor,
    textColor: (raw.textColor as string) || DEF.textColor,
    borderColor: (raw.borderColor as string) || DEF.borderColor,
    showIcon: typeof raw.showIcon === "boolean" ? raw.showIcon : DEF.showIcon,
    campaignTheme: (raw.campaignTheme as string) || "",
  };
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════ */

export default function HorarioAtencionEditor({
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
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Evaluar si está abierto ahora de forma local para el Preview en tiempo real
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1 is Monday...
      
      if (!cfg.workDays.includes(day)) {
        setIsOpenNow(false);
        return;
      }

      const [openH, openM] = cfg.openTime.split(":").map(Number);
      const [closeH, closeM] = cfg.closeTime.split(":").map(Number);

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = openH * 60 + openM;
      const endMinutes = closeH * 60 + closeM;

      setIsOpenNow(currentMinutes >= startMinutes && currentMinutes <= endMinutes);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 10000);
    return () => clearInterval(interval);
  }, [cfg.openTime, cfg.closeTime, cfg.workDays]);

  useEffect(() => {
    setOk(false);
    setErr("");
  }, [cfg]);

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const toggleDay = (day: number) => {
    if (cfg.workDays.includes(day)) {
      set("workDays", cfg.workDays.filter((d) => d !== day));
    } else {
      set("workDays", [...cfg.workDays, day]);
    }
  };

  const applyPreset = (slug: string) => {
    const p = PRESETS.find((x) => x.slug === slug);
    if (!p) return;
    setCfg((prev) => ({
      ...prev,
      campaignTheme: slug,
      ...(p.bg ? { bgColor: p.bg, textColor: p.tx, borderColor: p.bd } : {}),
    }));
  };

  const save = async () => {
    setSaving(true);
    setOk(false);
    setErr("");
    try {
      const body = {
        store_id: storeId,
        widget_slug: wd.slug,
        config: cfg,
        target_type: targetType,
        target_product_id: productId,
        is_active: true,
      };
      const url = ew ? `/api/widgets?id=${ew.id}` : "/api/widgets";
      const method = ew ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
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
              padding: "16px 20px",
              color: cfg.textColor,
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            {cfg.showIcon && (
              <span style={{ fontSize: 28, flexShrink: 0 }}>⏰</span>
            )}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1.3,
                }}
              >
                {isOpenNow ? cfg.openText : cfg.closedText}
              </div>
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.65,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                Atención: Lunes a Viernes {cfg.openTime} a {cfg.closeTime} hs.
              </div>
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>Hora de Apertura</label>
                  <input
                    type="time"
                    value={cfg.openTime}
                    onChange={(e) => set("openTime", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Hora de Cierre</label>
                  <input
                    type="time"
                    value={cfg.closeTime}
                    onChange={(e) => set("closeTime", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Días de atención</label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {DAYS_NAME.map((d) => {
                    const active = cfg.workDays.includes(d.v);
                    return (
                      <button
                        key={d.v}
                        onClick={() => toggleDay(d.v)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: active
                            ? "1.5px solid #10B981"
                            : "1.5px solid #e5e7eb",
                          background: active ? "#ecfdf5" : "#ffffff",
                          color: active ? "#059669" : "#4b5563",
                        }}
                      >
                        {d.n}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Mensaje cuando está ABIERTO</label>
                <textarea
                  value={cfg.openText}
                  onChange={(e) => set("openText", e.target.value)}
                  style={{
                    ...inputStyle,
                    minHeight: 60,
                    resize: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Mensaje cuando está CERRADO</label>
                <textarea
                  value={cfg.closedText}
                  onChange={(e) => set("closedText", e.target.value)}
                  style={{
                    ...inputStyle,
                    minHeight: 60,
                    resize: "none",
                    fontFamily: "inherit",
                  }}
                />
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
                <label style={labelStyle}>Color del borde</label>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="color"
                    value={cfg.borderColor}
                    onChange={(e) => set("borderColor", e.target.value)}
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
                    value={cfg.borderColor}
                    onChange={(e) => set("borderColor", e.target.value)}
                    style={{
                      ...inputStyle,
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                  Mostrar ícono de reloj ⏰
                </span>
                <input
                  type="checkbox"
                  checked={cfg.showIcon}
                  onChange={(e) => set("showIcon", e.target.checked)}
                  style={{
                    width: 20,
                    height: 20,
                    accentColor: "#10B981",
                    cursor: "pointer",
                  }}
                />
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
                Seleccioná un preset para unificar con el branding especial.
              </p>
              {PRESETS.map((p) => (
                <button
                  key={p.slug || "none"}
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
