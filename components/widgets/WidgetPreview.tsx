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
    case "contador-regresivo":
      return <ContadorRegresivoPreview />;
    case "contador-stock":
      return <ContadorStockPreview />;
    case "bundle-productos":
      return <BundleProductosPreview />;
    case "barra-progreso":
      return <BarraProgresoPreview />;
    case "video-producto":
      return <VideoProductoPreview />;
    case "badges-confianza":
      return <BadgesConfianzaPreview />;
    case "testimonios":
      return <TestimoniosPreview />;
    case "sticky-add-cart":
      return <StickyAddCartPreview />;
    case "upsell-producto":
      return <UpsellPreview />;
    case "productos-relacionados":
      return <RelacionadosPreview />;
    case "popup-salida":
    case "popup-oferta":
      return <PopupPreview />;
    case "galeria-360":
      return <Galeria360Preview />;
    case "tabla-talles":
      return <TablaTallesPreview />;
    case "descripcion-expandible":
      return <DescripcionExpandiblePreview />;
    default:
      return <DefaultPreview />;
  }
}

/* ═══════════════════════════════════════════════
   PREVIEWS INDIVIDUALES
   ═══════════════════════════════════════════════ */

function ContadorRegresivoPreview() {
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

function ContadorStockPreview() {
  return (
    <div
      style={{
        background: "#fef2f2",
        border: "1.5px solid #fecaca",
        borderRadius: "8px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "16px" }}>🔥</div>
      <div>
        <div style={{ fontSize: "11px", color: "#991b1b", fontWeight: 700 }}>
          ¡Solo quedan 3 unidades!
        </div>
        <div
          style={{
            marginTop: "4px",
            height: "4px",
            width: "120px",
            background: "#fecaca",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "20%", height: "100%", background: "#ef4444" }} />
        </div>
      </div>
    </div>
  );
}

function BundleProductosPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        padding: "10px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      {["Pack x1", "Pack x2", "Pack x3"].map((label, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 8px",
            border: i === 1 ? "1.5px solid #6366f1" : "1px solid #e5e7eb",
            borderRadius: "6px",
            background: i === 1 ? "#eef2ff" : "#fff",
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#111" }}>{label}</span>
          <span style={{ color: "#6366f1" }}>${(i + 1) * 35}k</span>
        </div>
      ))}
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

function VideoProductoPreview() {
  return (
    <div
      style={{
        width: "70%",
        aspectRatio: "16 / 9",
        background: "linear-gradient(135deg, #1e293b, #334155)",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid #1e293b",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            marginLeft: "3px",
          }}
        />
      </div>
    </div>
  );
}

function BadgesConfianzaPreview() {
  const badges = [
    { icon: "🚚", label: "Envío gratis" },
    { icon: "🔒", label: "Pago seguro" },
    { icon: "↩️", label: "Devolución" },
  ];
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {badges.map((b, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "8px 6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            minWidth: "56px",
          }}
        >
          <div style={{ fontSize: "16px" }}>{b.icon}</div>
          <div style={{ fontSize: "8px", color: "#374151", fontWeight: 600, textAlign: "center" }}>
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimoniosPreview() {
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
      <div style={{ color: "#fbbf24", fontSize: "12px" }}>★★★★★</div>
      <div style={{ fontSize: "10px", color: "#374151", lineHeight: 1.4 }}>
        "Excelente calidad, súper recomendado. Llegó rapidísimo."
      </div>
      <div style={{ fontSize: "9px", color: "#6b7280", fontWeight: 600 }}>
        — María G.
      </div>
    </div>
  );
}

function StickyAddCartPreview() {
  return (
    <div
      style={{
        width: "80%",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          background: "#e5e7eb",
        }}
      />
      <div style={{ flex: 1, fontSize: "10px", fontWeight: 600, color: "#111" }}>
        Producto — $35.000
      </div>
      <div
        style={{
          background: "#6366f1",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "10px",
          fontWeight: 700,
        }}
      >
        Comprar
      </div>
    </div>
  );
}

function UpsellPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #6366f1",
        borderRadius: "8px",
        padding: "10px",
        width: "80%",
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "6px",
          background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "9px", color: "#6366f1", fontWeight: 700 }}>
          MEJORÁ TU COMPRA
        </div>
        <div style={{ fontSize: "10px", color: "#111", fontWeight: 600 }}>
          Versión Premium +$5.000
        </div>
      </div>
    </div>
  );
}

function RelacionadosPreview() {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "6px",
              background: `linear-gradient(135deg, #${["fee2e2", "dbeafe", "d1fae5"][i - 1]}, #${["fecaca", "bfdbfe", "a7f3d0"][i - 1]})`,
            }}
          />
          <div style={{ fontSize: "7px", color: "#6b7280", textAlign: "center" }}>
            ${i * 12}k
          </div>
        </div>
      ))}
    </div>
  );
}

function PopupPreview() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "12px",
        width: "70%",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <div style={{ fontSize: "14px" }}>🎁</div>
      <div style={{ fontSize: "11px", fontWeight: 800, color: "#111" }}>
        ¡15% OFF!
      </div>
      <div style={{ fontSize: "8px", color: "#6b7280", textAlign: "center" }}>
        En tu primera compra
      </div>
      <div
        style={{
          background: "#6366f1",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: "4px",
          fontSize: "9px",
          fontWeight: 700,
        }}
      >
        Obtener
      </div>
    </div>
  );
}

function Galeria360Preview() {
  return (
    <div
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        border: "2px dashed #6366f1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div style={{ fontSize: "10px", fontWeight: 800, color: "#6366f1" }}>360°</div>
    </div>
  );
}

function TablaTallesPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        padding: "8px",
        display: "flex",
        gap: "4px",
      }}
    >
      {["S", "M", "L", "XL"].map((s, i) => (
        <div
          key={i}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            background: i === 1 ? "#6366f1" : "#f3f4f6",
            color: i === 1 ? "#fff" : "#374151",
            fontSize: "10px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {s}
        </div>
      ))}
    </div>
  );
}

function DescripcionExpandiblePreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "10px",
        width: "80%",
      }}
    >
      <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
        <div style={{ fontSize: "9px", fontWeight: 700, color: "#6366f1", borderBottom: "2px solid #6366f1", paddingBottom: "3px" }}>
          Descripción
        </div>
        <div style={{ fontSize: "9px", color: "#6b7280" }}>Envío</div>
        <div style={{ fontSize: "9px", color: "#6b7280" }}>Talles</div>
      </div>
      <div style={{ height: "2px", background: "#e5e7eb", marginBottom: "6px" }} />
      <div style={{ fontSize: "8px", color: "#6b7280", lineHeight: 1.4 }}>
        Producto de alta calidad hecho con los mejores materiales...
      </div>
    </div>
  );
}

function DefaultPreview() {
  return (
    <div
      style={{
        fontSize: "24px",
        color: "#9ca3af",
      }}
    >
      ✨
    </div>
  );
  }
