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

function renderPreview(slug: string) {
  switch (slug) {
    case "menu-circulos":
      return <MenuCirculosPreview />;
    case "pack-complementarios":
      return <PackComplementariosPreview />;
    case "tabla-talles":
      return <TablaTallesPreview />;
    case "medios-pago":
      return <MediosPagoPreview />;
    case "comparador-marca":
      return <ComparadorMarcaPreview />;
    case "badge-cupon":
      return <BadgeCuponPreview />;
    case "info-compra":
      return <InfoCompraPreview />;
    case "extras-interruptor":
    case "switch-extras":
      return <ExtrasInterruptorPreview />;
    case "contador-visitas":
    case "visitor-counter":
      return <ContadorVisitasPreview />;
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

/* ═══════════════════════════════════════════
   PREVIEWS DE LOS NUEVOS WIDGETS
   ═══════════════════════════════════════════ */

function MenuCirculosPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "8px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#000000", letterSpacing: "0.02em" }}>
        CATEGORÍAS DESTACADAS
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
        {[
          { name: "Ofertas", icon: "🔥", active: true },
          { name: "Novedades", icon: "✨", active: false },
          { name: "Remeras", icon: "👕", active: false },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: c.active ? "2px solid #10B981" : "1.5px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                background: "#f9fafb",
              }}
            >
              {c.icon}
            </div>
            <span style={{ fontSize: "6.5px", fontWeight: c.active ? 800 : 600, color: "#111827" }}>
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackComplementariosPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #10B981",
        borderRadius: "10px",
        padding: "7px 9px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "7.5px", fontWeight: 900, color: "#000000" }}>
          🔥 COMBINÁ TU PACK
        </span>
        <span style={{ fontSize: "6.5px", background: "#ecfdf5", color: "#059669", padding: "1px 4px", borderRadius: "999px", fontWeight: 800 }}>
          -15% OFF
        </span>
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f9fafb", padding: "2px 4px", borderRadius: "4px" }}>
          <div style={{ width: "8px", height: "8px", background: "#10B981", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "6px" }}>✓</div>
          <span style={{ fontSize: "7px", fontWeight: 700, flex: 1, color: "#111827" }}>Remera Oversize</span>
          <span style={{ fontSize: "7px", fontWeight: 800, color: "#10B981" }}>$25k</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f9fafb", padding: "2px 4px", borderRadius: "4px" }}>
          <div style={{ width: "8px", height: "8px", background: "#10B981", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "6px" }}>✓</div>
          <span style={{ fontSize: "7px", fontWeight: 700, flex: 1, color: "#111827" }}>Gorra Vintage</span>
          <span style={{ fontSize: "7px", fontWeight: 800, color: "#10B981" }}>$15k</span>
        </div>
      </div>

      {/* Footer Total */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: "3px", marginTop: "1px" }}>
        <div style={{ fontSize: "7.5px", fontWeight: 900, color: "#000000" }}>
          Total: <span style={{ color: "#10B981" }}>$34.000</span>
        </div>
        <div style={{ background: "#10B981", color: "#ffffff", fontSize: "6.5px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
          + Agregar pack
        </div>
      </div>
    </div>
  );
}

function TablaTallesPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        padding: "7px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "8px", fontWeight: 800, color: "#000000" }}>
          📏 GUÍA DE MEDIDAS
        </span>
        <span
          style={{
            fontSize: "6.5px",
            color: "#059669",
            background: "#ecfdf5",
            padding: "1px 5px",
            borderRadius: "4px",
            fontWeight: 800,
          }}
        >
          CM
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          fontSize: "7px",
          textAlign: "center",
          background: "#f9fafb",
          borderRadius: "4px",
          padding: "2px",
          fontWeight: 800,
          color: "#6b7280",
        }}
      >
        <div>Talle</div>
        <div>Pecho</div>
        <div>Cintura</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          fontSize: "7px",
          textAlign: "center",
          color: "#111827",
        }}
      >
        <div style={{ fontWeight: 800 }}>S</div>
        <div>88-92</div>
        <div>70-74</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          fontSize: "7px",
          textAlign: "center",
          color: "#111827",
        }}
      >
        <div style={{ fontWeight: 800 }}>M</div>
        <div>93-97</div>
        <div>75-79</div>
      </div>
    </div>
  );
}

function MediosPagoPreview() {
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
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#000000", textAlign: "center" }}>
        MEDIOS DE PAGO ACEPTADOS
      </div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#1a1f71", background: "#f3f4f6", padding: "2px 5px", borderRadius: "4px" }}>
          VISA
        </span>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#eb001b", background: "#f3f4f6", padding: "2px 5px", borderRadius: "4px" }}>
          Mastercard
        </span>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#009ee3", background: "#f3f4f6", padding: "2px 5px", borderRadius: "4px" }}>
          Mercado Pago
        </span>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#059669", background: "#ecfdf5", padding: "2px 5px", borderRadius: "4px" }}>
          🏦 Transferencia
        </span>
      </div>
    </div>
  );
}

function ComparadorMarcaPreview() {
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
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div style={{ fontSize: "8px", fontWeight: 800, color: "#000000", textAlign: "center", marginBottom: "2px" }}>
        ¿POR QUÉ ELEGIRNOS?
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          overflow: "hidden",
          fontSize: "6.5px",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        <div style={{ padding: "3px 4px", textAlign: "left", color: "#6b7280" }}>BENEFICIO</div>
        <div style={{ padding: "3px 4px", background: "#ecfdf5", color: "#059669" }}>VOS</div>
        <div style={{ padding: "3px 4px", color: "#9ca3af" }}>OTROS</div>

        <div style={{ padding: "3px 4px", textAlign: "left", borderTop: "1px solid #f3f4f6", fontWeight: 600 }}>Envío Rápido</div>
        <div style={{ padding: "3px 4px", background: "#ecfdf5", color: "#10B981", borderTop: "1px solid #f3f4f6", fontWeight: 900 }}>✓</div>
        <div style={{ padding: "3px 4px", color: "#9ca3af", borderTop: "1px solid #f3f4f6" }}>✗</div>

        <div style={{ padding: "3px 4px", textAlign: "left", borderTop: "1px solid #f3f4f6", fontWeight: 600 }}>Garantía Total</div>
        <div style={{ padding: "3px 4px", background: "#ecfdf5", color: "#10B981", borderTop: "1px solid #f3f4f6", fontWeight: 900 }}>✓</div>
        <div style={{ padding: "3px 4px", color: "#9ca3af", borderTop: "1px solid #f3f4f6" }}>✗</div>
      </div>
    </div>
  );
}

function BadgeCuponPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px dashed #10B981",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontSize: "11px" }}>🎟️</span>
          <span style={{ fontSize: "8.5px", fontWeight: 800, color: "#000000" }}>
            ¡CUPÓN EXCLUSIVO!
          </span>
        </div>
        <span
          style={{
            background: "#ecfdf5",
            color: "#059669",
            fontSize: "7px",
            fontWeight: 900,
            padding: "1px 5px",
            borderRadius: "999px",
          }}
        >
          10% OFF
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "3px 6px",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "8.5px", fontWeight: 800, color: "#111827" }}>
          NEVUX10
        </span>
        <div
          style={{
            background: "#10B981",
            color: "#ffffff",
            fontSize: "7.5px",
            fontWeight: 800,
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          Copiar
        </div>
      </div>
    </div>
  );
}

function InfoCompraPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        padding: "7px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Fila Envío */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ fontSize: "12px", lineHeight: 1 }}>🚚</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "8.5px", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>
            Envío GRATIS
          </div>
          <div style={{ fontSize: "7px", color: "#6b7280", lineHeight: 1 }}>
            En compras mayores a $50.000
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "#f3f4f6" }} />

      {/* Fila Cuotas */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ fontSize: "12px", lineHeight: 1 }}>💳</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "8.5px", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>
            Hasta 12 cuotas
          </div>
          <div style={{ fontSize: "7px", color: "#6b7280", lineHeight: 1 }}>
            3 cuotas sin interés con todas las tarjetas
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "#f3f4f6" }} />

      {/* Fila Transferencia */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ fontSize: "12px", lineHeight: 1 }}>💰</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "8.5px", fontWeight: 800, color: "#059669", lineHeight: 1.1 }}>
            10% OFF abonando con Transferencia
          </div>
          <div style={{ fontSize: "7px", color: "#6b7280", lineHeight: 1 }}>
            Descuento automático en el checkout
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtrasInterruptorPreview() {
  return (
    <div
      style={{
        background: "#fffdf5",
        border: "1.5px solid #fcd34d",
        borderRadius: "12px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          👔
        </div>
        <span style={{ fontSize: "6.5px", fontWeight: 800, textDecoration: "underline" }}>
          VER MÁS
        </span>
      </div>

      <div style={{ flex: 1, paddingLeft: "4px" }}>
        <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#1f2937", lineHeight: 1.1 }}>
          SACO GRIS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
          <span style={{ fontSize: "10px", fontWeight: 900, color: "#111827" }}>
            $59.999
          </span>
          <span
            style={{
              background: "#dc2626",
              color: "#ffffff",
              fontSize: "6.5px",
              fontWeight: 900,
              padding: "1px 4px",
              borderRadius: "3px",
            }}
          >
            PROMO
          </span>
        </div>
      </div>

      <div
        style={{
          width: "32px",
          height: "18px",
          background: "#10B981",
          borderRadius: "999px",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "14px",
            height: "14px",
            background: "#ffffff",
            borderRadius: "50%",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
}

function ContadorVisitasPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "999px",
        padding: "6px 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: "#dc2626",
          boxShadow: "0 0 0 2px rgba(220, 38, 38, 0.2)",
          flexShrink: 0,
        }}
      />
      <div style={{ fontSize: "9px", color: "#000000", fontWeight: 800 }}>
        <strong style={{ color: "#000000", fontWeight: 900 }}>100</strong> personas viendo esto ahora
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREVIEWS EXISTENTES
   ═══════════════════════════════════════════ */

function CuentaRegresivaPreview() {
  const cells = ["12", "34", "56"];
  return (
    <div
      style={{
        background: "#000000",
        borderRadius: "8px",
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontSize: "9px", color: "#10B981", fontWeight: 800, letterSpacing: "0.03em" }}>
        ⏰ OFERTA TERMINA EN
      </div>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {cells.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div
              style={{
                background: "#10B981",
                color: "#ffffff",
                padding: "3px 6px",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {c}
            </div>
            {i < cells.length - 1 && (
              <span style={{ color: "#ffffff", fontWeight: 800 }}>:</span>
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
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px",
        width: "82%",
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
            border: row.active ? "1.5px solid #10B981" : "1px solid #e5e7eb",
            borderRadius: "5px",
            background: row.active ? "#ecfdf5" : "#ffffff",
            fontSize: "9px",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#000000" }}>{row.label}</span>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {row.badge && (
              <span
                style={{
                  background: "#10B981",
                  color: "#ffffff",
                  padding: "1px 4px",
                  borderRadius: "3px",
                  fontSize: "7px",
                  fontWeight: 700,
                }}
              >
                {row.badge}
              </span>
            )}
            <span style={{ color: row.active ? "#059669" : "#000000", fontWeight: 700 }}>
              {row.price}
            </span>
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
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 10px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      {["Llevá 1", "Llevá 3 pagá 2", "Llevá 4 pagá 3"].map((label, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 8px",
            border: i === 1 ? "1.5px solid #10B981" : "1px solid #e5e7eb",
            borderRadius: "5px",
            background: i === 1 ? "#ecfdf5" : "#ffffff",
            fontSize: "9px",
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#000000" }}>{label}</span>
          <span
            style={{
              color: i === 1 ? "#059669" : "#000000",
              opacity: i === 1 ? 1 : 0.6,
            }}
          >
            ${(i + 1) * 20}k
          </span>
        </div>
      ))}
    </div>
  );
}

function SliderVideoPreview() {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {[0.65, 1, 0.65].map((scale, i) => (
        <div
          key={i}
          style={{
            width: `${38 * scale}px`,
            height: `${56 * scale}px`,
            background: "#000000",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: scale,
            border: scale === 1 ? "1.5px solid #10B981" : "none",
          }}
        >
          {scale === 1 && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid #10B981",
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
        background: "#ecfdf5",
        border: "1.5px solid #10B981",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "82%",
      }}
    >
      <div style={{ fontSize: "16px" }}>⚡</div>
      <div style={{ fontSize: "9.5px", color: "#000000", fontWeight: 700, lineHeight: 1.3 }}>
        Últimas 3 unidades en stock con envío inmediato.
      </div>
    </div>
  );
}

function MensajeGarantiaPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #000000",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "82%",
      }}
    >
      <div style={{ fontSize: "18px" }}>🛡️</div>
      <div>
        <div style={{ fontSize: "9.5px", color: "#000000", fontWeight: 800 }}>
          Garantía Oficial Nevux
        </div>
        <div style={{ fontSize: "8px", color: "#000000", opacity: 0.6 }}>
          Cambio y devolución sin cargo por 30 días
        </div>
      </div>
    </div>
  );
}

function ResenasPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 10px",
        width: "82%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", paddingBottom: "4px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#10B981", fontSize: "11px" }}>★★★★★</div>
        <div style={{ fontSize: "8px", color: "#000000", opacity: 0.5 }}>hace 2 horas</div>
      </div>
      <div style={{ fontSize: "8.5px", color: "#000000", opacity: 0.8, lineHeight: 1.3 }}>
        "Excelente producto y llegó súper rápido a mi domicilio."
      </div>
      <div style={{ fontSize: "8px", color: "#000000", fontWeight: 700 }}>
        — Lucía M. (Compradora verificada)
      </div>
    </div>
  );
}

function BannerDeslizantePreview() {
  return (
    <div style={{ width: "82%", display: "flex", flexDirection: "column", gap: "5px" }}>
      <div
        style={{
          height: "44px",
          background: "#10B981",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: "10.5px",
          fontWeight: 800,
          letterSpacing: "0.02em",
        }}
      >
        🚀 ¡ENVÍO GRATIS A TODO EL PAÍS!
      </div>
      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e5e7eb" }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e5e7eb" }} />
      </div>
    </div>
  );
}

function BadgeEnvioPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #000000",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "20px" }}>🚚</div>
      <div>
        <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#000000" }}>
          Envío GRATIS
        </div>
        <div style={{ fontSize: "8px", color: "#000000", opacity: 0.6 }}>
          En compras superiores a $50.000
        </div>
      </div>
    </div>
  );
}

function BadgeCuotasPreview() {
  return (
    <div
      style={{
        background: "#ecfdf5",
        border: "1.5px solid #10B981",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "20px" }}>💳</div>
      <div>
        <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#059669" }}>
          Hasta 12 cuotas fijas
        </div>
        <div style={{ fontSize: "8px", color: "#000000", opacity: 0.7 }}>
          Con todas las tarjetas bancarias
        </div>
      </div>
    </div>
  );
}

function BadgeTransferenciaPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #000000",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "20px" }}>💰</div>
      <div>
        <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#000000" }}>
          15% OFF abonando con Transferencia
        </div>
        <div style={{ fontSize: "8px", color: "#000000", opacity: 0.6 }}>
          Descuento automático al pagar
        </div>
      </div>
    </div>
  );
}

function CajaOpinionesPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 10px",
        width: "82%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <div style={{ color: "#10B981", fontSize: "12px" }}>★★★★★</div>
        <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#000000" }}>4.9 / 5</div>
        <div style={{ fontSize: "8px", color: "#000000", opacity: 0.5 }}>(234 opiniones)</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {[92, 60, 25].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "8px", color: "#000000", opacity: 0.6 }}>{5 - i}★</span>
            <div style={{ flex: 1, height: "4px", background: "#f3f4f6", borderRadius: "2px" }}>
              <div
                style={{
                  width: `${w}%`,
                  height: "100%",
                  background: "#10B981",
                  borderRadius: "2px",
                }}
              />
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
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 10px",
        width: "82%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ fontSize: "12px" }}>📍</div>
        <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#000000" }}>
          Envíos a todo el país
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "8px",
          color: "#000000",
          opacity: 0.7,
          borderTop: "1px solid #f3f4f6",
          paddingTop: "3px",
        }}
      >
        <span>Correo Argentino</span>
        <span style={{ fontWeight: 700, opacity: 1, color: "#059669" }}>$1.200</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "8px",
          color: "#000000",
          opacity: 0.7,
        }}
      >
        <span>Andreani Express</span>
        <span style={{ fontWeight: 700, opacity: 1, color: "#059669" }}>$1.800</span>
      </div>
    </div>
  );
}

function InfoDespachoPreview() {
  return (
    <div
      style={{
        background: "#ecfdf5",
        border: "1.5px solid #10B981",
        borderRadius: "8px",
        padding: "8px 10px",
        width: "82%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "18px" }}>📦</div>
      <div>
        <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#059669" }}>
          Despacho en 24-48hs
        </div>
        <div style={{ fontSize: "8px", color: "#000000", opacity: 0.7 }}>
          Comprando antes de las 15:00hs
        </div>
      </div>
    </div>
  );
}

function BarraProgresoPreview() {
  return (
    <div style={{ width: "82%" }}>
      <div
        style={{
          fontSize: "9.5px",
          fontWeight: 800,
          color: "#000000",
          marginBottom: "5px",
          textAlign: "center",
        }}
      >
        ¡Te faltan $2.500 para <span style={{ color: "#059669" }}>envío GRATIS</span>! 🚚
      </div>
      <div
        style={{
          height: "8px",
          background: "#f3f4f6",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "70%",
            height: "100%",
            background: "#10B981",
            borderRadius: "999px",
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
