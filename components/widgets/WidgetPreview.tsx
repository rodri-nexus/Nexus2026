"use client";

interface WidgetPreviewProps {
  slug: string;
}

export default function WidgetPreview({ slug }: WidgetPreviewProps) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 10",
        background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {renderPreview(slug)}
    </div>
  );
}

function renderPreview(slug: string) {
  switch (slug) {
    case "cuenta-regresiva":
      return <CuentaRegresivaPreview />;
    case "bundle-cantidad":
      return <BundleCantidadPreview />;
    case "bundle-promociones":
      return <BundlePromocionesPreview />;
    case "slider-video":
      return <SliderVideoPreview />;
    case "mensaje-alerta":
      return <MensajeAlertaPreview />;
    case "mensaje-garantia":
      return <MensajeGarantiaPreview />;
    case "resenas-clientes":
      return <ResenasPreview />;
    case "banner-deslizante":
      return <BannerDeslizantePreview />;
    case "badge-envio":
      return <BadgeEnvioPreview />;
    case "badge-cuotas":
      return <BadgeCuotasPreview />;
    case "badge-transferencia":
      return <BadgeTransferenciaPreview />;
    case "caja-opiniones":
      return <CajaOpinionesPreview />;
    case "info-envio":
      return <InfoEnvioPreview />;
    case "info-despacho":
      return <InfoDespachoPreview />;
    case "barra-progreso":
      return <BarraProgresoPreview />;
    default:
      return <DefaultPreview />;
  }
}

/* ═══════════════════════════════════════════════
   PREVIEWS
   ═══════════════════════════════════════════════ */

function CuentaRegresivaPreview() {
  const cells = ["12", "34", "56"];
  return (
    <div
      style={{
        background: "#1e1e1e",
        borderRadius: "8px",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontSize: "10px", color: "#fff", fontWeight: 700 }}>
        ⏰ OFERTA TERMINA EN
      </div>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {cells.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div
              style={{
                background: "#ef4444",
                color: "#fff",
                padding: "4px 6px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {c}
            </div>
            {i < cells.length - 1 && (
              <span style={{ color: "#fff", fontWeight: 800 }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BundleCantidadPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {[
        { label: "1 unidad", price: "$35k", active: false },
        { label: "2 unidades", price: "$65k", active: true, badge: "-10%" },
        { label: "3 unidades", price: "$90k", active: false, badge: "-15%" },
      ].map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 8px",
            border: row.active ? "1.5px solid #6366f1" : "1px solid #e5e7eb",
            borderRadius: "5px",
            background: row.active ? "#eef2ff" : "#fff",
            fontSize: "9px",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#111" }}>{row.label}</span>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {row.badge && (
              <span style={{ background: "#10b981", color: "#fff", padding: "1px 4px", borderRadius: "3px", fontSize: "7px" }}>
                {row.badge}
              </span>
            )}
            <span style={{ color: "#6366f1" }}>{row.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BundlePromocionesPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        padding: "10px",
        width: "75%",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      {["Llevá 1", "Llevá 3 pagá 2", "Llevá 4 pagá 3"].map((label, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 8px",
            border: i === 1 ? "1.5px solid #10b981" : "1px solid #e5e7eb",
            borderRadius: "5px",
            background: i === 1 ? "#ecfdf5" : "#fff",
            fontSize: "9px",
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#111" }}>{label}</span>
          <span style={{ color: i === 1 ? "#10b981" : "#6b7280" }}>${(i + 1) * 20}k</span>
        </div>
      ))}
    </div>
  );
}

function SliderVideoPreview() {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[0.6, 1, 0.6].map((scale, i) => (
        <div
          key={i}
          style={{
            width: `${40 * scale}px`,
            height: `${60 * scale}px`,
            background: "linear-gradient(135deg, #1e293b, #334155)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: scale,
          }}
        >
          {scale === 1 && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid #fff",
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                marginLeft: "2px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function MensajeAlertaPreview() {
  return (
    <div
      style={{
        background: "#fffbeb",
        border: "1.5px solid #fbbf24",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "80%",
      }}
    >
      <div style={{ fontSize: "16px" }}>⚠️</div>
      <div style={{ fontSize: "10px", color: "#92400e", fontWeight: 600, lineHeight: 1.3 }}>
        Últimas unidades disponibles. ¡No te lo pierdas!
      </div>
    </div>
  );
}

function MensajeGarantiaPreview() {
  return (
    <div
      style={{
        background: "#ecfdf5",
        border: "1.5px solid #10b981",
        borderRadius: "8px",
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "80%",
      }}
    >
      <div style={{ fontSize: "20px" }}>🛡️</div>
      <div>
        <div style={{ fontSize: "10px", color: "#065f46", fontWeight: 800 }}>
          Garantía de 12 meses
        </div>
        <div style={{ fontSize: "8px", color: "#047857" }}>
          Cambio y devolución sin cargo
        </div>
      </div>
    </div>
  );
}

function ResenasPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 10px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#fbbf24", fontSize: "11px" }}>★★★★★</div>
        <div style={{ fontSize: "8px", color: "#6b7280" }}>hace 2 días</div>
      </div>
      <div style={{ fontSize: "9px", color: "#374151", lineHeight: 1.3 }}>
        "Excelente calidad y llegó súper rápido. Muy recomendado."
      </div>
      <div style={{ fontSize: "8px", color: "#6b7280", fontWeight: 600 }}>
        — Lucía M.
      </div>
    </div>
  );
}

function BannerDeslizantePreview() {
  return (
    <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "4px" }}>
      <div
        style={{
          height: "50px",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "11px",
          fontWeight: 800,
        }}
      >
        ¡ENVÍO GRATIS!
      </div>
      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d1d5db" }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d1d5db" }} />
      </div>
    </div>
  );
}

function BadgeEnvioPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #10b981",
        borderRadius: "8px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "22px" }}>🚚</div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#065f46" }}>
          Envío GRATIS
        </div>
        <div style={{ fontSize: "8px", color: "#047857" }}>
          En compras +$50.000
        </div>
      </div>
    </div>
  );
}

function BadgeCuotasPreview() {
  return (
    <div
      style={{
        background: "#eef2ff",
        border: "1.5px solid #6366f1",
        borderRadius: "8px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "22px" }}>💳</div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#3730a3" }}>
          12 cuotas SIN interés
        </div>
        <div style={{ fontSize: "8px", color: "#4f46e5" }}>
          Con todas las tarjetas
        </div>
      </div>
    </div>
  );
}

function BadgeTransferenciaPreview() {
  return (
    <div
      style={{
        background: "#fef3c7",
        border: "1.5px solid #f59e0b",
        borderRadius: "8px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "22px" }}>💰</div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#92400e" }}>
          15% OFF por transferencia
        </div>
        <div style={{ fontSize: "8px", color: "#b45309" }}>
          Descuento automático
        </div>
      </div>
    </div>
  );
}

function CajaOpinionesPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "10px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <div style={{ color: "#fbbf24", fontSize: "13px" }}>★★★★★</div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#111" }}>4.9</div>
        <div style={{ fontSize: "8px", color: "#6b7280" }}>(234 opiniones)</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {[90, 60, 30].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "8px", color: "#6b7280" }}>{5 - i}★</span>
            <div style={{ flex: 1, height: "4px", background: "#f3f4f6", borderRadius: "2px" }}>
              <div style={{ width: `${w}%`, height: "100%", background: "#fbbf24", borderRadius: "2px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoEnvioPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "10px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ fontSize: "12px" }}>📍</div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#111" }}>Envíos a todo el país</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#6b7280", borderTop: "1px solid #f3f4f6", paddingTop: "4px" }}>
        <span>Correo Argentino</span>
        <span style={{ fontWeight: 700, color: "#111" }}>$1.200</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#6b7280" }}>
        <span>Andreani</span>
        <span style={{ fontWeight: 700, color: "#111" }}>$1.800</span>
      </div>
    </div>
  );
}

function InfoDespachoPreview() {
  return (
    <div
      style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "8px",
        padding: "10px 12px",
        width: "80%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "20px" }}>📦</div>
      <div>
        <div style={{ fontSize: "10px", fontWeight: 800, color: "#1e40af" }}>
          Despacho en 24-48hs
        </div>
        <div style={{ fontSize: "8px", color: "#2563eb" }}>
          Comprando antes de las 15:00hs
        </div>
      </div>
    </div>
  );
}

function BarraProgresoPreview() {
  return (
    <div style={{ width: "80%" }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#065f46",
          marginBottom: "6px",
          textAlign: "center",
        }}
      >
        ¡Te faltan $2.500 para envío GRATIS! 🚚
      </div>
      <div
        style={{
          height: "10px",
          background: "#d1fae5",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "70%",
            height: "100%",
            background: "linear-gradient(90deg, #10b981, #059669)",
          }}
        />
      </div>
    </div>
  );
}

function DefaultPreview() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {/* SVG custom: cajas apiladas con etiqueta de descuento (representa bundle/paquete) */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Caja del fondo (más chica, atrás) */}
        <rect
          x="8"
          y="20"
          width="24"
          height="24"
          rx="3"
          fill="#e0e7ff"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        <line
          x1="8"
          y1="26"
          x2="32"
          y2="26"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="26"
          stroke="#6366f1"
          strokeWidth="1.5"
        />

        {/* Caja del medio */}
        <rect
          x="20"
          y="14"
          width="28"
          height="28"
          rx="3"
          fill="#c7d2fe"
          stroke="#4f46e5"
          strokeWidth="1.5"
        />
        <line
          x1="20"
          y1="21"
          x2="48"
          y2="21"
          stroke="#4f46e5"
          strokeWidth="1.5"
        />
        <line
          x1="34"
          y1="14"
          x2="34"
          y2="21"
          stroke="#4f46e5"
          strokeWidth="1.5"
        />

        {/* Caja frontal (más grande) */}
        <rect
          x="32"
          y="26"
          width="24"
          height="24"
          rx="3"
          fill="#6366f1"
          stroke="#4338ca"
          strokeWidth="1.5"
        />
        <line
          x1="32"
          y1="32"
          x2="56"
          y2="32"
          stroke="#4338ca"
          strokeWidth="1.5"
        />
        <line
          x1="44"
          y1="26"
          x2="44"
          y2="32"
          stroke="#4338ca"
          strokeWidth="1.5"
        />

        {/* Badge de descuento circular */}
        <circle
          cx="52"
          cy="18"
          r="10"
          fill="#ef4444"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x="52"
          y="22"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          %
        </text>
      </svg>
      <div
        style={{
          fontSize: "10px",
          color: "#6b7280",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        Vista previa
      </div>
    </div>
  );
                }
