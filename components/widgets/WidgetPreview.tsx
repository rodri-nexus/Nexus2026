"use client";

interface WidgetPreviewProps {
  slug: string;
}

/* ═══════════════════════════════════════════
   PREVIEWS DE LOS WIDGETS ACTIVOS
   ═══════════════════════════════════════════ */

function ProductosComplementariosPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827" }}>
        También te puede interesar
      </div>

      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #f3f4f6",
          borderRadius: "6px",
          padding: "4px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px",
        }}
      >
        <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#e5e7eb", flexShrink: 0, display: "flex", alignItems: "center", justifyCenter: "center" }} />
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: "6.5px", fontWeight: 800, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Funda compacta
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ fontSize: "6.5px", fontWeight: 900, color: "#10B981" }}>$15.000</span>
            <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5px", fontWeight: 800, padding: "1px 3px", borderRadius: "3px" }}>
              -15%
            </span>
          </div>
        </div>
        <div
          style={{
            background: "#10B981",
            color: "#ffffff",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "6px",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          Agregar
        </div>
      </div>
    </div>
  );
}

function BarraCuotasPreview() {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "10px",
        padding: "8px 12px",
        width: "92%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1.5px solid #10B981",
        color: "#ffffff",
      }}
    >
      <span style={{ fontSize: "12px" }}>💳</span>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#ffffff", textAlign: "center" }}>
        3 cuotas sin interés de <strong style={{ color: "#10B981" }}>$11.666</strong>
      </div>
    </div>
  );
}

function BarraEnvioGratisPreview() {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1.5px solid #10B981",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
        <span style={{ fontSize: "11px" }}>🚚</span>
        <div style={{ fontSize: "7px", fontWeight: 800, color: "#ffffff", flex: 1, textAlign: "center" }}>
          Te faltan <strong style={{ color: "#10B981" }}>$20.000</strong> para ENVÍO GRATIS
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "5px",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "65%",
            height: "100%",
            background: "#10B981",
            borderRadius: "999px",
          }}
        />
      </div>
    </div>
  );
}

function PopupConversionPreview() {
  return (
    <div
      style={{
        background: "rgba(17, 24, 39, 0.75)",
        borderRadius: "10px",
        padding: "6px",
        width: "92%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          padding: "8px 10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "4px", right: "6px", fontSize: "7px", opacity: 0.4, fontWeight: 800 }}>✕</div>
        <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", textAlign: "center" }}>
          Antes de que te vayas 🎰
        </div>
        <div style={{ fontSize: "6px", color: "#6b7280", textAlign: "center", lineHeight: 1.1 }}>
          ¡Girás y te llevás un descuento exclusivo!
        </div>
        <div
          style={{
            background: "#10B981",
            color: "#ffffff",
            borderRadius: "6px",
            padding: "4px 8px",
            fontSize: "6.5px",
            fontWeight: 800,
            width: "100%",
            textAlign: "center",
            marginTop: "2px",
          }}
        >
          Quiero mi descuento
        </div>
      </div>
    </div>
  );
}

function BundlePromocionesPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827" }}>
        Elegí tu pack en promo
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1.5px solid #10B981",
          borderRadius: "6px",
          padding: "4px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              border: "1.5px solid #10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10B981" }} />
          </div>
          <span style={{ fontSize: "7px", fontWeight: 800, color: "#111827" }}>
            Lleva 2 paga 1
          </span>
          <span
            style={{
              background: "#fef2f2",
              color: "#ef4444",
              fontSize: "5.5px",
              fontWeight: 800,
              padding: "1px 3px",
              borderRadius: "3px",
            }}
          >
            -50%
          </span>
        </div>
        <span style={{ fontSize: "7px", fontWeight: 900, color: "#10B981" }}>$10.000</span>
      </div>

      <div
        style={{
          background: "#10B981",
          color: "#ffffff",
          borderRadius: "6px",
          padding: "4px",
          fontSize: "7px",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        Sumalo al carrito
      </div>
    </div>
  );
}

function InfoDespachoPreview() {
  return (
    <div
      style={{
        background: "#10B981",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
        <span style={{ fontSize: "11px" }}>📦</span>
        <div style={{ fontSize: "7px", fontWeight: 800, lineHeight: 1.2 }}>
          Despachamos <strong>HOY</strong>
        </div>
      </div>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: "6px",
          padding: "3px 6px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "5px", textTransform: "uppercase", fontWeight: 700, opacity: 0.9 }}>
          Te quedan
        </span>
        <span style={{ fontSize: "8px", fontWeight: 900, fontFamily: "monospace" }}>
          2h 15m
        </span>
      </div>
    </div>
  );
}

function CuentaRegresivaPreview() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #10B981, #059669)",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        color: "#ffffff",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, textAlign: "center" }}>
        ¡Oferta por tiempo limitado!
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {["00", "29", "58"].map((num, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {i > 0 && <span style={{ fontSize: "9px", fontWeight: 900 }}>:</span>}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  padding: "2px 5px",
                  fontSize: "9px",
                  fontWeight: 900,
                  fontFamily: "monospace",
                }}
              >
                {num}
              </div>
              <span style={{ fontSize: "5px", textTransform: "uppercase", opacity: 0.8, marginTop: "1px", fontWeight: 700 }}>
                {i === 0 ? "Horas" : i === 1 ? "Min" : "Seg"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UrgenciaStockPreview() {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "10px",
        padding: "8px 12px",
        width: "92%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1.5px solid #10B981",
        color: "#ffffff",
      }}
    >
      <span style={{ fontSize: "12px" }}>⚠️</span>
      <div style={{ fontSize: "8px", fontWeight: 900, color: "#10B981", letterSpacing: "0.02em" }}>
        Últimas 3 unidades disponibles!
      </div>
    </div>
  );
}

function ResenasDestacadasPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <span style={{ fontSize: "9px" }}>⭐⭐⭐⭐⭐</span>
          <span style={{ fontSize: "7.5px", fontWeight: 900, color: "#111827" }}>4.8</span>
          <span style={{ fontSize: "6.5px", color: "#6b7280" }}>(36)</span>
        </div>
        <span
          style={{
            background: "#ecfdf5",
            color: "#059669",
            fontSize: "6px",
            fontWeight: 800,
            padding: "2px 5px",
            borderRadius: "999px",
            border: "1px solid #a7f3d0",
          }}
        >
          ✓ Verificadas
        </span>
      </div>

      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #f3f4f6",
          borderRadius: "6px",
          padding: "5px 7px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#10B981",
            color: "#ffffff",
            fontSize: "7px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          LR
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "7px", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>
            Excelente producto
          </div>
          <div style={{ fontSize: "5.5px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            El material es impecable, super recomendado!
          </div>
        </div>
      </div>
    </div>
  );
}

function ContadorVendidosPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🔥 ALTA DEMANDA</span>
        <span style={{ fontSize: "6.5px", color: "#ef4444", fontWeight: 800, display: "flex", alignItems: "center", gap: "2px" }}>
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ef4444" }} />
          EN VIVO
        </span>
      </div>

      <div
        style={{
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "6px",
          padding: "5px 8px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span style={{ fontSize: "10px" }}>🔥</span>
        <div style={{ fontSize: "7px", color: "#065f46", lineHeight: 1.2 }}>
          <strong style={{ fontWeight: 900, color: "#059669" }}>247 unidades</strong> vendidas en 24hs
        </div>
      </div>
    </div>
  );
}

function EdicionLimitadaPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #e5e7eb",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          👟
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827" }}>
            Edición Especial
          </div>
          <div style={{ fontSize: "7px", fontWeight: 900, color: "#10B981" }}>
            $ 89.990
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#111827",
          color: "#F59E0B",
          border: "1px dashed #F59E0B",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: "rotate(-8deg)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "5px", fontWeight: 900, lineHeight: 1, letterSpacing: "0.02em" }}>
          EDICIÓN
        </span>
        <span style={{ fontSize: "5px", fontWeight: 900, lineHeight: 1, letterSpacing: "0.02em" }}>
          LIMITADA
        </span>
      </div>
    </div>
  );
}

function CalculadoraAhorroPreview() {
  return (
    <div
      style={{
        background: "#ecfdf5",
        border: "1.5px solid #10B981",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontSize: "6px",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: "#059669",
            textTransform: "uppercase",
          }}
        >
          AHORRO EXCLUSIVO
        </span>
        <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#065f46", lineHeight: 1.2 }}>
          🎉 ¡Ahorrás{" "}
          <strong style={{ fontSize: "8.5px", fontWeight: 900, color: "#059669" }}>
            $ 14.500
          </strong>{" "}
          hoy!
        </div>
      </div>
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
          fontSize: "10px",
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        %
      </div>
    </div>
  );
}

function HorarioAtencionPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "11px" }}>⏰</span>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#111827" }}>
            HORARIO DE ATENCIÓN
          </span>
        </div>
        <span
          style={{
            background: "#ecfdf5",
            color: "#059669",
            fontSize: "6.5px",
            fontWeight: 900,
            padding: "1.5px 5px",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
          ABIERTO
        </span>
      </div>

      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #f3f4f6",
          borderRadius: "6px",
          padding: "5px 7px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#111827" }}>
          Lun a Vie: 09:00 a 18:00 hs
        </div>
        <div style={{ fontSize: "6px", color: "#6b7280" }}>
          ¡Estamos online para responder tus dudas!
        </div>
      </div>
    </div>
  );
}

function MarqueeNovedadesPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "8px 6px",
        width: "94%",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#000000", textAlign: "center", letterSpacing: "0.02em" }}>
        MARQUEE DE NOVEDADES
      </div>
      <div
        style={{
          background: "#111827",
          borderRadius: "6px",
          padding: "6px 8px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#10B981" }}>
          ✨ NUEVOS INGRESOS
        </span>
        <span style={{ fontSize: "6px", color: "#6b7280" }}>•</span>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#ffffff" }}>
          🔥 MÁS VENDIDOS
        </span>
        <span style={{ fontSize: "6px", color: "#6b7280" }}>•</span>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#F59E0B" }}>
          📦 ENVÍO GRATIS
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "3px" }}>
        <div style={{ width: "12px", height: "2px", background: "#10B981", borderRadius: "2px" }} />
        <div style={{ width: "4px", height: "2px", background: "#e5e7eb", borderRadius: "2px" }} />
        <div style={{ width: "4px", height: "2px", background: "#e5e7eb", borderRadius: "2px" }} />
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
        gap: "6px",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="8"
          y="20"
          width="24"
          height="24"
          rx="3"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <rect
          x="20"
          y="14"
          width="28"
          height="28"
          rx="3"
          fill="#f3f4f6"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <rect
          x="32"
          y="26"
          width="24"
          height="24"
          rx="3"
          fill="#10B981"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <circle cx="52" cy="18" r="10" fill="#000000" stroke="#ffffff" strokeWidth="2" />
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
          fontSize: "9px",
          color: "#000000",
          opacity: 0.5,
          fontWeight: 700,
        }}
      >
        Vista previa
      </div>
    </div>
  );
}

function renderPreview(slug: string) {
  switch (slug) {
    case "productos-complementarios":
      return <ProductosComplementariosPreview />;
    case "barra-cuotas":
      return <BarraCuotasPreview />;
    case "barra-envio-gratis":
      return <BarraEnvioGratisPreview />;
    case "popup-conversion":
      return <PopupConversionPreview />;
    case "bundle-promociones":
      return <BundlePromocionesPreview />;
    case "info-despacho":
      return <InfoDespachoPreview />;
    case "cuenta-regresiva":
      return <CuentaRegresivaPreview />;
    case "urgencia-stock":
      return <UrgenciaStockPreview />;
    case "resenas-destacadas":
      return <ResenasDestacadasPreview />;
    case "contador-vendidos":
      return <ContadorVendidosPreview />;
    case "edicion-limitada":
      return <EdicionLimitadaPreview />;
    case "calculadora-ahorro":
      return <CalculadoraAhorroPreview />;
    case "horario-atencion":
      return <HorarioAtencionPreview />;
    case "marquee-novedades":
      return <MarqueeNovedadesPreview />;
    default:
      return <DefaultPreview />;
  }
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL (Export Default)
   ═══════════════════════════════════════════ */

export default function WidgetPreview({ slug }: WidgetPreviewProps) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 10",
        background: "#ffffff",
        border: "1px solid #f3f4f6",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.85rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {renderPreview(slug)}
    </div>
  );
          }
