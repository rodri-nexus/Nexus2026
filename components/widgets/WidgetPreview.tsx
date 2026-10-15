"use client";

interface WidgetPreviewProps {
  slug: string;
}

/* ═══════════════════════════════════════════
   PREVIEWS DE LOS WIDGETS ACTIVOS
   ═══════════════════════════════════════════ */

function VideoFlotantePreview() {
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
        border: "1.5px solid #10B981",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🎬 VIDEO FLOTANTE</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>
          REELS
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4px 0" }}>
        <div style={{ position: "relative", width: "38px", height: "38px", borderRadius: "50%", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
          <span style={{ fontSize: "11px", marginLeft: "1px" }}>▶</span>
          <div style={{ position: "absolute", top: "-2px", left: "-2px", width: "11px", height: "11px", borderRadius: "50%", background: "#191919", border: "1px solid #ffffff", color: "#ffffff", fontSize: "6.5px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</div>
        </div>
      </div>
    </div>
  );
}

function ComparadorMarcaPreview() {
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
        border: "1.5px solid #10B981",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>⚖️ COMPARADOR DE MARCA</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>
          CONFIANZA
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "2px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr", gap: "4px", fontSize: "6px", fontWeight: 800, textAlign: "center", alignItems: "center" }}>
          <div style={{ textAlign: "left", color: "#6b7280" }}>Ventaja</div>
          <div style={{ background: "#111827", color: "#ffffff", borderRadius: "4px 4px 0 0", padding: "2px 0", fontSize: "5.5px" }}>Nosotros</div>
          <div style={{ color: "#9ca3af", padding: "2px 0", fontSize: "5.5px" }}>Otros</div>
        </div>
        {[
          { text: "Dolor solucionado", us: true, others: false },
          { text: "Envío express AMBA", us: true, others: false },
          { text: "Garantía total 60 días", us: true, others: true },
        ].map((item, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr", gap: "4px", fontSize: "5.5px", alignItems: "center", borderTop: "1px solid #f3f4f6", padding: "2px 0" }}>
            <div style={{ fontWeight: 700, color: "#374151", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.text}</div>
            <div style={{ background: "#111827", color: "#10B981", textAlign: "center", fontWeight: 900, padding: "1px 0" }}>✓</div>
            <div style={{ textAlign: "center", color: item.others ? "#10B981" : "#d1d5db", fontWeight: 800 }}>{item.others ? "✓" : "✕"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColumnasImagenesTextoPreview() {
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
        border: "1.5px solid #10B981",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🎴 COLUMNAS IMÁGENES Y TEXTO</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>
          GRILLA
        </span>
      </div>

      <div style={{ display: "flex", gap: "4px", justifyContent: "center", padding: "2px 0" }}>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              flex: 1,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: "4px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>
              🖼️
            </div>
            <div style={{ width: "80%", height: "3px", background: "#111827", borderRadius: "1px" }} />
            <div style={{ width: "60%", height: "2.5px", background: "#9ca3af", borderRadius: "1px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ImagenesTextosPreview() {
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
        border: "1.5px solid #10B981",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🖼️ IMÁGENES Y TEXTOS</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>
          ALTERNADO
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f9fafb", padding: "4px 6px", borderRadius: "6px", border: "1px solid #f3f4f6" }}>
        <div style={{ width: "22px", height: "22px", borderRadius: "4px", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", flexShrink: 0 }}>
          🖼️
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <div style={{ width: "35px", height: "3.5px", background: "#111827", borderRadius: "2px" }} />
          <div style={{ width: "55px", height: "3px", background: "#9ca3af", borderRadius: "1px" }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#ffffff", padding: "4px 6px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <div style={{ width: "35px", height: "3.5px", background: "#111827", borderRadius: "2px" }} />
          <div style={{ width: "55px", height: "3px", background: "#9ca3af", borderRadius: "1px" }} />
        </div>
        <div style={{ width: "22px", height: "22px", borderRadius: "4px", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", flexShrink: 0 }}>
          ✨
        </div>
      </div>
    </div>
  );
}

function PestanasInformacionPreview() {
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
        border: "1.5px solid #10B981",
      }}
    >
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📑 PESTAÑAS</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>
          TABS
        </span>
      </div>

      <div style={{ display: "flex", gap: "0px", borderBottom: "1.5px solid #e5e7eb" }}>
        <div style={{ background: "#10B981", color: "#ffffff", fontSize: "5.5px", fontWeight: 800, padding: "3px 7px", borderRadius: "4px 4px 0 0", marginBottom: "-1.5px" }}>
          📋 Descripción
        </div>
        <div style={{ background: "transparent", color: "#9ca3af", fontSize: "5.5px", fontWeight: 700, padding: "3px 7px", borderRadius: "4px 4px 0 0" }}>
          📏 Talles
        </div>
        <div style={{ background: "transparent", color: "#9ca3af", fontSize: "5.5px", fontWeight: 700, padding: "3px 7px", borderRadius: "4px 4px 0 0" }}>
          🚚 Envío
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "4px 2px 2px 2px" }}>
        <div style={{ width: "85%", height: "3.5px", background: "#e5e7eb", borderRadius: "2px" }} />
        <div style={{ width: "70%", height: "3.5px", background: "#f3f4f6", borderRadius: "2px" }} />
        <div style={{ width: "55%", height: "3.5px", background: "#f3f4f6", borderRadius: "2px" }} />
      </div>
    </div>
  );
}

function InformacionEnvioPreview() {
  return (
    <div
      style={{
        background: "#d9f5e4",
        borderRadius: "10px",
        padding: "8px 10px",
        width: "92%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        border: "1.5px solid #10B981",
        color: "#1f6b4e",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
        <span style={{ background: "#1f6b4e", color: "#ffffff", fontSize: "5.5px", fontWeight: 800, padding: "1px 5px", borderRadius: "999px" }}>
          AMBA
        </span>
        <span style={{ background: "rgba(255,255,255,0.6)", color: "#1f6b4e", fontSize: "5.5px", fontWeight: 800, padding: "1px 5px", borderRadius: "999px" }}>
          Resto del país
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2px", textAlign: "center", marginTop: "2px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "10px" }}>📦</span>
          <span style={{ fontSize: "6px", fontWeight: 800 }}>Compra</span>
          <span style={{ fontSize: "5.5px", opacity: 0.8 }}>Hoy</span>
        </div>
        <div style={{ width: "12px", height: "1px", background: "#1f6b4e", opacity: 0.4 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "10px" }}>🚚</span>
          <span style={{ fontSize: "6px", fontWeight: 800 }}>Envío</span>
          <span style={{ fontSize: "5.5px", opacity: 0.8 }}>Mañana</span>
        </div>
        <div style={{ width: "12px", height: "1px", background: "#1f6b4e", opacity: 0.4 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "10px" }}>📍</span>
          <span style={{ fontSize: "6px", fontWeight: 800 }}>Entrega</span>
          <span style={{ fontSize: "5.5px", opacity: 0.8 }}>17 oct</span>
        </div>
      </div>
    </div>
  );
}

function PasosPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📍 PASOS</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>TIMELINE</span>
      </div>
      <div style={{ position: "relative", paddingLeft: "12px", display: "flex", flexDirection: "column", gap: "6px", padding: "2px 0" }}>
        <div style={{ position: "absolute", left: "4px", top: "2px", bottom: "2px", width: "1px", background: "#10B981" }} />
        {[1, 2].map((i) => (
          <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ position: "absolute", left: "-10px", top: "0px", width: "5px", height: "5px", borderRadius: "50%", background: "#ffffff", border: "1px solid #10B981" }} />
            <div style={{ width: "25px", height: "4px", background: "#111827", borderRadius: "2px" }} />
            <div style={{ width: "45px", height: "3px", background: "#e5e7eb", borderRadius: "1px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TextoLibrePreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📝 TEXTO LIBRE</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>FORMATO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "2px 0" }}>
        <div style={{ fontSize: "7px", fontWeight: 800, color: "#111827" }}>Título del bloque</div>
        <div style={{ fontSize: "5.5px", color: "#6b7280", lineHeight: 1.2 }}>Párrafo con texto enriquecido, listas, viñetas y enlaces personalizados...</div>
      </div>
    </div>
  );
}

function VideoTextoPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🎥 VIDEO Y TEXTO</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>EXPLICATIVO</span>
      </div>
      <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "2px 0" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ fontSize: "7px", fontWeight: 800, color: "#111827" }}>Conocé el producto</div>
          <div style={{ fontSize: "5.5px", color: "#6b7280", lineHeight: 1.1 }}>Mirá este breve video explicativo...</div>
        </div>
        <div style={{ width: "42px", height: "28px", borderRadius: "6px", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "10px", flexShrink: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>▶</div>
      </div>
    </div>
  );
}

function SliderImagenesPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🖼️ SLIDER DE IMÁGENES</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>CARRUSEL</span>
      </div>
      <div style={{ display: "flex", gap: "5px", overflow: "hidden", padding: "2px 0", justifyContent: "center" }}>
        {[1, 2, 3].map((item) => (
          <div key={item} style={{ width: "34px", height: "38px", borderRadius: "6px", background: item === 1 ? "#f3f4f6" : item === 2 ? "#ecfdf5" : "#e5e7eb", border: item === 2 ? "1px solid #10B981" : "1px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>
            {item === 1 ? "🧴" : item === 2 ? "✨" : "🌿"}
          </div>
        ))}
      </div>
    </div>
  );
}

function CajaContactoPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>👨‍💼</div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>¿Tenés alguna pregunta?</div>
          <div style={{ fontSize: "5.5px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>Podés escribirle a nuestros especialistas...</div>
        </div>
      </div>
      <div style={{ background: "#111827", color: "#ffffff", borderRadius: "12px", padding: "3px 8px", fontSize: "6px", fontWeight: 800, alignSelf: "flex-start", marginLeft: "32px" }}>Contactanos</div>
    </div>
  );
}

function CajaOpinionesPreview() {
  return (
    <div style={{ background: "#f7f7f7", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "4px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1px solid #cccccc" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#374151", color: "#ffffff", fontSize: "7px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>R</div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "6.5px", fontWeight: 800, color: "#333333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>rodrigo lázaro</span>
            <div style={{ display: "flex", gap: "2px", fontSize: "5.5px", color: "#f5b301" }}>★★★★★</div>
          </div>
        </div>
        <span style={{ fontSize: "6px", color: "#6b7280", opacity: 0.7 }}>‹ ›</span>
      </div>
      <div style={{ fontSize: "5.5px", color: "#555555", lineHeight: 1.2, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>Me encantó el producto, cumple con mis expectativas</div>
    </div>
  );
}

function ProbadorVirtualPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📷 PROBADOR VIRTUAL</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>CÁMARA</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        <div style={{ background: "#111827", color: "#ffffff", borderRadius: "20px", padding: "4px 12px", fontSize: "7px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <span>📷</span>
          <span>Probador virtual</span>
        </div>
      </div>
    </div>
  );
}

function TablaTallesPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📏 TABLA DE TALLES</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>MODAL</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        <div style={{ background: "#111827", color: "#ffffff", borderRadius: "20px", padding: "4px 12px", fontSize: "7px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <span>📏</span>
          <span>Tabla de talles</span>
        </div>
      </div>
    </div>
  );
}

function BeneficiosPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🛡️ BENEFICIOS</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>CONFIANZA</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "2px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontSize: "9px" }}>🚚</span>
          <span style={{ fontSize: "6.5px", color: "#374151" }}>Envío <strong>gratis</strong> a todo el país</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontSize: "9px" }}>💳</span>
          <span style={{ fontSize: "6.5px", color: "#374151" }}>Hasta <strong>6 cuotas sin interés</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontSize: "9px" }}>🛡️</span>
          <span style={{ fontSize: "6.5px", color: "#374151" }}>Compra <strong>100% protegida</strong></span>
        </div>
      </div>
    </div>
  );
}

function ComparadorAntesDespuesPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🖼️ ANTES Y DESPUÉS</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>SLIDER</span>
      </div>
      <div style={{ position: "relative", width: "100%", height: "44px", borderRadius: "6px", overflow: "hidden", border: "1px solid #e5e7eb", display: "flex" }}>
        <div style={{ width: "50%", height: "100%", background: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "7px", fontWeight: 800, position: "relative" }}>
          <span style={{ position: "absolute", top: "3px", left: "4px", fontSize: "5px", background: "rgba(0,0,0,0.5)", padding: "1px 3px", borderRadius: "2px" }}>ANTES</span>
          📷
        </div>
        <div style={{ width: "50%", height: "100%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "7px", fontWeight: 800, position: "relative" }}>
          <span style={{ position: "absolute", top: "3px", right: "4px", fontSize: "5px", background: "rgba(0,0,0,0.5)", padding: "1px 3px", borderRadius: "2px" }}>DESPUÉS</span>
          ✨
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "2px", background: "#ffffff", transform: "translateX(-50%)", boxShadow: "0 0 4px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffffff", color: "#111827", fontSize: "6px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>↔</div>
        </div>
      </div>
    </div>
  );
}

function BannerSuperiorPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📢 BANNER SUPERIOR</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>ANUNCIO</span>
      </div>
      <div style={{ background: "#1e1e1e", color: "#ffffff", borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
        <span style={{ fontSize: "6px", fontWeight: 600, flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>¡Oferta especial hoy! 🎉</span>
        <span style={{ background: "#ffffff", color: "#000000", fontSize: "5.5px", fontWeight: 800, padding: "2px 5px", borderRadius: "3px" }}>Ver ofertas</span>
      </div>
    </div>
  );
}

function PreguntasFrecuentesPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>❓ PREGUNTAS FRECUENTES</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>FAQ</span>
      </div>
      <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "4px 6px", display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "6.5px", fontWeight: 800, color: "#111827" }}>
          <span>🚚 ¿Cuánto demora el envío?</span>
          <span style={{ fontSize: "7px", opacity: 0.6 }}>▲</span>
        </div>
        <div style={{ fontSize: "5.5px", color: "#6b7280", lineHeight: 1.1 }}>Despachamos dentro de las 24 a 48 hs...</div>
      </div>
      <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "6.5px", fontWeight: 700, color: "#374151" }}>
        <span>💳 ¿Qué medios de pago aceptan?</span>
        <span style={{ fontSize: "7px", opacity: 0.6 }}>▼</span>
      </div>
    </div>
  );
}

function BadgeEfectivoPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>💵 BADGE DE EFECTIVO</span>
        <span style={{ background: "#ef4444", color: "#ffffff", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px" }}>OFERTA</span>
      </div>
      <div style={{ background: "#f3f4f6", borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px", fontSize: "7px", fontWeight: 700, color: "#111827" }}>
        <span style={{ fontSize: "9px" }}>💵</span>
        <span>10% de descuento pagando en efectivo</span>
      </div>
    </div>
  );
}

function MensajeGarantiaPreview() {
  return (
    <div style={{ background: "#fff9f3", border: "1.5px solid #e7dec8", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)" }}>
      <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🛡️</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>Garantía de 60 días</div>
        <div style={{ fontSize: "6px", color: "#4b5563", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Devolución 100% garantizada</div>
      </div>
    </div>
  );
}

function BarraAccionPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>💳 BARRA DE ACCIÓN</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>STICKY</span>
      </div>
      <div style={{ background: "#333333", borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flex: 1, minWidth: 0 }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>💼</div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: "6.5px", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Billetera Compacta</span>
            <span style={{ fontSize: "6.5px", fontWeight: 900, color: "#10B981" }}>$ 10.000</span>
          </div>
        </div>
        <div style={{ background: "#007bff", color: "#ffffff", borderRadius: "12px", padding: "3px 8px", fontSize: "6px", fontWeight: 800, flexShrink: 0 }}>Agregar al carrito</div>
      </div>
    </div>
  );
}

function SliderVideosPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🎬 SLIDER DE VIDEOS</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>REELS</span>
      </div>
      <div style={{ display: "flex", gap: "5px", justifyContent: "center", padding: "2px 0" }}>
        {[1, 2, 3].map((item) => (
          <div key={item} style={{ width: "28px", height: "44px", borderRadius: "6px", background: item === 1 ? "#10B981" : item === 2 ? "#111827" : "#374151", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "10px", color: "#ffffff" }}>▶</div>
            <div style={{ position: "absolute", bottom: "2px", width: "80%", height: "3px", background: "rgba(255,255,255,0.7)", borderRadius: "2px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BundleCantidadPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📦 BUNDLE DE CANTIDAD</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>-15% MAX</span>
      </div>
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", border: "1.5px solid #d1d5db" }} />
          <span style={{ fontSize: "7px", fontWeight: 700, color: "#111827" }}>Lleva 1</span>
        </div>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#6b7280" }}>$ 35.600</span>
      </div>
      <div style={{ background: "#ecfdf5", border: "1.5px solid #10B981", borderRadius: "6px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", border: "2px solid #10B981", background: "#10B981" }} />
          <span style={{ fontSize: "7px", fontWeight: 900, color: "#111827" }}>Lleva 2</span>
          <span style={{ background: "#ef4444", color: "#ffffff", fontSize: "5px", fontWeight: 800, padding: "1px 3px", borderRadius: "3px" }}>MÁS VENDIDO</span>
        </div>
        <span style={{ fontSize: "7px", fontWeight: 900, color: "#10B981" }}>$ 65.504</span>
      </div>
      <div style={{ background: "#111827", color: "#ffffff", borderRadius: "6px", padding: "4px", fontSize: "7px", fontWeight: 800, textAlign: "center", marginTop: "2px" }}>Agregar al carrito</div>
    </div>
  );
}

function PackComplementariosPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #10B981" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>📦 PACK COMPLEMENTARIOS</span>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>-15% OFF</span>
      </div>
      <div style={{ background: "#ecfdf5", border: "1px solid #10B981", borderRadius: "6px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#10B981", color: "#fff", fontSize: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>✓</div>
          <span style={{ fontSize: "6.5px", fontWeight: 800, color: "#111827" }}>Producto principal</span>
        </div>
        <span style={{ fontSize: "6.5px", fontWeight: 900, color: "#10B981" }}>$ 25.000</span>
      </div>
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#10B981", color: "#fff", fontSize: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>✓</div>
          <span style={{ fontSize: "6.5px", fontWeight: 700, color: "#111827" }}>+ Complemento</span>
        </div>
        <span style={{ fontSize: "6.5px", fontWeight: 900, color: "#10B981" }}>+$ 10.000</span>
      </div>
      <div style={{ background: "#111827", color: "#ffffff", borderRadius: "6px", padding: "4px", fontSize: "7px", fontWeight: 800, textAlign: "center", marginTop: "2px" }}>Agregar pack · $ 29.750</div>
    </div>
  );
}

function ProductosComplementariosPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "94%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)", border: "1.5px solid #10B981" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "7.5px", fontWeight: 900, color: "#111827", display: "flex", alignItems: "center", gap: "3px" }}>
          <span>🎁</span> PRODUCTOS COMPLEMENTARIOS
        </div>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "5.5px", fontWeight: 800, padding: "1px 4px", borderRadius: "4px", border: "1px solid #a7f3d0" }}>-15% EXTRA</span>
      </div>
      <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flex: 1, minWidth: 0 }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: "#10B981", color: "#ffffff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🎧</div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: "6.5px", fontWeight: 800, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Funda de Auriculares</span>
            <span style={{ fontSize: "6.5px", fontWeight: 900, color: "#10B981" }}>$ 12.000</span>
          </div>
        </div>
        <div style={{ background: "#111827", color: "#ffffff", borderRadius: "4px", padding: "2px 5px", fontSize: "6px", fontWeight: 800, flexShrink: 0 }}>+ Agregar</div>
      </div>
      <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flex: 1, minWidth: 0 }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: "#111827", color: "#ffffff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔌</div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: "6.5px", fontWeight: 800, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Cargador Rápido 20W</span>
            <span style={{ fontSize: "6.5px", fontWeight: 900, color: "#10B981" }}>$ 18.500</span>
          </div>
        </div>
        <div style={{ background: "#111827", color: "#ffffff", borderRadius: "4px", padding: "2px 5px", fontSize: "6px", fontWeight: 800, flexShrink: 0 }}>+ Agregar</div>
      </div>
    </div>
  );
}

function BarraCuotasPreview() {
  return (
    <div style={{ background: "#111827", borderRadius: "10px", padding: "8px 12px", width: "92%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "1.5px solid #10B981", color: "#ffffff" }}>
      <span style={{ fontSize: "12px" }}>💳</span>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#ffffff", textAlign: "center" }}>
        3 cuotas sin interés de <strong style={{ color: "#10B981" }}>$11.666</strong>
      </div>
    </div>
  );
}

function BarraEnvioGratisPreview() {
  return (
    <div style={{ background: "#111827", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "1.5px solid #10B981", color: "#ffffff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
        <span style={{ fontSize: "11px" }}>🚚</span>
        <div style={{ fontSize: "7px", fontWeight: 800, color: "#ffffff", flex: 1, textAlign: "center" }}>
          Te faltan <strong style={{ color: "#10B981" }}>$20.000</strong> para ENVÍO GRATIS
        </div>
      </div>
      <div style={{ width: "100%", height: "5px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ width: "65%", height: "100%", background: "#10B981", borderRadius: "999px" }} />
      </div>
    </div>
  );
}

function PopupConversionPreview() {
  return (
    <div style={{ background: "rgba(17, 24, 39, 0.75)", borderRadius: "10px", padding: "6px", width: "92%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
      <div style={{ background: "#ffffff", borderRadius: "8px", padding: "8px 10px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", position: "relative" }}>
        <div style={{ position: "absolute", top: "4px", right: "6px", fontSize: "7px", opacity: 0.4, fontWeight: 800 }}>✕</div>
        <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", textAlign: "center" }}>Antes de que te vayas 🎰</div>
        <div style={{ fontSize: "6px", color: "#6b7280", textAlign: "center", lineHeight: 1.1 }}>¡Girás y te llevás un descuento exclusivo!</div>
        <div style={{ background: "#10B981", color: "#ffffff", borderRadius: "6px", padding: "4px 8px", fontSize: "6.5px", fontWeight: 800, width: "100%", textAlign: "center", marginTop: "2px" }}>Quiero mi descuento</div>
      </div>
    </div>
  );
}

function BundlePromocionesPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #e5e7eb" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827" }}>Elegí tu pack en promo</div>
      <div style={{ background: "#ffffff", border: "1.5px solid #10B981", borderRadius: "6px", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "1.5px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10B981" }} />
          </div>
          <span style={{ fontSize: "7px", fontWeight: 800, color: "#111827" }}>Lleva 2 paga 1</span>
          <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: "5.5px", fontWeight: 800, padding: "1px 3px", borderRadius: "3px" }}>-50%</span>
        </div>
        <span style={{ fontSize: "7px", fontWeight: 900, color: "#10B981" }}>$10.000</span>
      </div>
      <div style={{ background: "#10B981", color: "#ffffff", borderRadius: "6px", padding: "4px", fontSize: "7px", fontWeight: 800, textAlign: "center" }}>Sumalo al carrito</div>
    </div>
  );
}

function InfoDespachoPreview() {
  return (
    <div style={{ background: "#10B981", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)", color: "#ffffff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
        <span style={{ fontSize: "11px" }}>📦</span>
        <div style={{ fontSize: "7px", fontWeight: 800, lineHeight: 1.2 }}>Despachamos <strong>HOY</strong></div>
      </div>
      <div style={{ background: "rgba(255, 255, 255, 0.25)", borderRadius: "6px", padding: "3px 6px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "5px", textTransform: "uppercase", fontWeight: 700, opacity: 0.9 }}>Te quedan</span>
        <span style={{ fontSize: "8px", fontWeight: 900, fontFamily: "monospace" }}>2h 15m</span>
      </div>
    </div>
  );
}

function CuentaRegresivaPreview() {
  return (
    <div style={{ background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", color: "#ffffff" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, textAlign: "center" }}>¡Oferta por tiempo limitado!</div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {["00", "29", "58"].map((num, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {i > 0 && <span style={{ fontSize: "9px", fontWeight: 900 }}>:</span>}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "4px", padding: "2px 5px", fontSize: "9px", fontWeight: 900, fontFamily: "monospace" }}>{num}</div>
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
    <div style={{ background: "#111827", borderRadius: "10px", padding: "8px 12px", width: "92%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "1.5px solid #10B981", color: "#ffffff" }}>
      <span style={{ fontSize: "12px" }}>⚠️</span>
      <div style={{ fontSize: "8px", fontWeight: 900, color: "#10B981", letterSpacing: "0.02em" }}>Últimas 3 unidades disponibles!</div>
    </div>
  );
}

function ResenasDestacadasPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #e5e7eb" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <span style={{ fontSize: "9px" }}>⭐⭐⭐⭐⭐</span>
          <span style={{ fontSize: "7.5px", fontWeight: 900, color: "#111827" }}>4.8</span>
          <span style={{ fontSize: "6.5px", color: "#6b7280" }}>(36)</span>
        </div>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "6px", fontWeight: 800, padding: "2px 5px", borderRadius: "999px", border: "1px solid #a7f3d0" }}>✓ Verificadas</span>
      </div>
      <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "5px 7px", display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#10B981", color: "#ffffff", fontSize: "7px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>LR</div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "7px", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>Excelente producto</div>
          <div style={{ fontSize: "5.5px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>El material es impecable, super recomendado!</div>
        </div>
      </div>
    </div>
  );
}

function ContadorVendidosPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #e5e7eb" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🔥 ALTA DEMANDA</span>
        <span style={{ fontSize: "6.5px", color: "#ef4444", fontWeight: 800, display: "flex", alignItems: "center", gap: "2px" }}>
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ef4444" }} />
          EN VIVO
        </span>
      </div>
      <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "6px", padding: "5px 8px", display: "flex", alignItems: "center", gap: "5px" }}>
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
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #e5e7eb", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>👟</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#111827" }}>Edición Especial</div>
          <div style={{ fontSize: "7px", fontWeight: 900, color: "#10B981" }}>$ 89.990</div>
        </div>
      </div>
      <div style={{ background: "#111827", color: "#F59E0B", border: "1px dashed #F59E0B", borderRadius: "50%", width: "32px", height: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", transform: "rotate(-8deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", flexShrink: 0 }}>
        <span style={{ fontSize: "5px", fontWeight: 900, lineHeight: 1, letterSpacing: "0.02em" }}>EDICIÓN</span>
        <span style={{ fontSize: "5px", fontWeight: 900, lineHeight: 1, letterSpacing: "0.02em" }}>LIMITADA</span>
      </div>
    </div>
  );
}

function CalculadoraAhorroPreview() {
  return (
    <div style={{ background: "#ecfdf5", border: "1.5px solid #10B981", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "6px", fontWeight: 900, letterSpacing: "0.04em", color: "#059669", textTransform: "uppercase" }}>AHORRO EXCLUSIVO</span>
        <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#065f46", lineHeight: 1.2 }}>
          🎉 ¡Ahorrás <strong style={{ fontSize: "8.5px", fontWeight: 900, color: "#059669" }}>$ 14.500</strong> hoy!
        </div>
      </div>
      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#10B981", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 900, flexShrink: 0 }}>%</div>
    </div>
  );
}

function HorarioAtencionPreview() {
  return (
    <div style={{ background: "#ffffff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "8px 10px", width: "92%", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "11px" }}>⏰</span>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#111827" }}>HORARIO DE ATENCIÓN</span>
        </div>
        <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "6.5px", fontWeight: 900, padding: "1.5px 5px", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "2px" }}>
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
          ABIERTO
        </span>
      </div>
      <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "5px 7px", display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#111827" }}>Lun a Vie: 09:00 a 18:00 hs</div>
        <div style={{ fontSize: "6px", color: "#6b7280" }}>¡Estamos online para responder tus dudas!</div>
      </div>
    </div>
  );
}

function MarqueeNovedadesPreview() {
  return (
    <div style={{ background: "#ffffff", borderRadius: "10px", padding: "8px 6px", width: "94%", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)", border: "1.5px solid #e5e7eb" }}>
      <div style={{ fontSize: "7.5px", fontWeight: 800, color: "#000000", textAlign: "center", letterSpacing: "0.02em" }}>MARQUEE DE NOVEDADES</div>
      <div style={{ background: "#111827", borderRadius: "6px", padding: "6px 8px", overflow: "hidden", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#10B981" }}>✨ NUEVOS INGRESOS</span>
        <span style={{ fontSize: "6px", color: "#6b7280" }}>•</span>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#ffffff" }}>🔥 MÁS VENDIDOS</span>
        <span style={{ fontSize: "6px", color: "#6b7280" }}>•</span>
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#F59E0B" }}>📦 ENVÍO GRATIS</span>
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="20" width="24" height="24" rx="3" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
        <rect x="20" y="14" width="28" height="28" rx="3" fill="#f3f4f6" stroke="#000000" strokeWidth="1.5" />
        <rect x="32" y="26" width="26" height="24" rx="3" fill="#10B981" stroke="#000000" strokeWidth="1.5" />
        <circle cx="52" cy="18" r="10" fill="#000000" stroke="#ffffff" strokeWidth="2" />
        <text x="52" y="22" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif">%</text>
      </svg>
      <div style={{ fontSize: "9px", color: "#000000", opacity: 0.5, fontWeight: 700 }}>Vista previa</div>
    </div>
  );
}

function renderPreview(slug: string) {
  switch (slug) {
    case "video-flotante":
      return <VideoFlotantePreview />;
    case "comparador-marca":
      return <ComparadorMarcaPreview />;
    case "columnas-imagenes-texto":
      return <ColumnasImagenesTextoPreview />;
    case "imagenes-textos":
      return <ImagenesTextosPreview />;
    case "pestanas-informacion":
      return <PestanasInformacionPreview />;
    case "informacion-envio":
      return <InformacionEnvioPreview />;
    case "pasos":
      return <PasosPreview />;
    case "texto-libre":
      return <TextoLibrePreview />;
    case "video-texto":
      return <VideoTextoPreview />;
    case "slider-imagenes":
      return <SliderImagenesPreview />;
    case "caja-contacto":
      return <CajaContactoPreview />;
    case "caja-opiniones":
      return <CajaOpinionesPreview />;
    case "probador-virtual":
      return <ProbadorVirtualPreview />;
    case "tabla-talles":
      return <TablaTallesPreview />;
    case "beneficios":
      return <BeneficiosPreview />;
    case "comparador-antes-despues":
      return <ComparadorAntesDespuesPreview />;
    case "banner-superior":
      return <BannerSuperiorPreview />;
    case "preguntas-frecuentes":
      return <PreguntasFrecuentesPreview />;
    case "badge-efectivo":
      return <BadgeEfectivoPreview />;
    case "mensaje-garantia":
      return <MensajeGarantiaPreview />;
    case "barra-accion":
      return <BarraAccionPreview />;
    case "slider-videos":
      return <SliderVideosPreview />;
    case "bundle-cantidad":
      return <BundleCantidadPreview />;
    case "pack-complementarios":
      return <PackComplementariosPreview />;
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
