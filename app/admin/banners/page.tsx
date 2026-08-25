"use client";

import React from "react";

export default function BannersPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* Indicaciones para el usuario */}
      <div
        style={{
          maxWidth: "650px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#1e293b",
          padding: "14px 18px",
          borderRadius: "14px",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ fontSize: "17px", fontWeight: "bold", color: "#34d399", margin: "0 0 6px 0" }}>
          📷 Banners Promocionales (Versión Compacta)
        </h1>
        <p style={{ fontSize: "12px", color: "#cbd5e1", margin: 0, lineHeight: "1.4" }}>
          Diseño optimizado para pantallas de celular. Sacale captura directa a cada tarjeta verde.
        </p>
      </div>

      {/* ==========================================
          BANNER 1: IMPULSÁ TU TICKET PROMEDIO
         ========================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          minHeight: "350px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          boxSizing: "border-box",
        }}
      >
        {/* Columna Izquierda: Textos */}
        <div style={{ flex: "1 1 220px", zIndex: 2 }}>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "900",
              color: "#ffffff",
              margin: "0 0 10px 0",
              lineHeight: "1.1",
              letterSpacing: "-0.5px",
            }}
          >
            Impulsá tu ticket promedio
          </h2>
          <p style={{ fontSize: "13px", color: "#d1fae5", margin: 0, lineHeight: "1.4", fontWeight: "500" }}>
            Aumentá tu facturación elevando el valor de cada venta con ofertas irresistibles.
          </p>
        </div>

        {/* Columna Derecha: Widgets Stack */}
        <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          {/* Tarjeta Fondo: Armá tu Pack */}
          <div
            style={{
              position: "absolute",
              right: "0px",
              top: "0px",
              width: "180px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 15px 20px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e2e8f0",
              transform: "rotate(6deg) scale(0.95)",
              color: "#0f172a",
            }}
          >
            <div style={{ fontSize: "9px", fontWeight: "bold", textTransform: "uppercase", color: "#475569", marginBottom: "6px" }}>
              Armá tu pack
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "5px", borderRadius: "6px" }}>
                <span>☑️ Tarjetero</span>
                <span style={{ fontWeight: "bold", color: "#059669" }}>$14.000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "5px", borderRadius: "6px" }}>
                <span>☑️ Bolso</span>
                <span style={{ fontWeight: "bold", color: "#059669" }}>$21.500</span>
              </div>
            </div>
            <div style={{ background: "#000000", color: "#ffffff", textAlign: "center", padding: "6px", borderRadius: "8px", fontSize: "9px", fontWeight: "bold" }}>
              Agregar selección
            </div>
          </div>

          {/* Tarjeta Principal Frontal: Descuentos por Cantidad */}
          <div
            style={{
              position: "relative",
              width: "230px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.35)",
              border: "1px solid #e2e8f0",
              transform: "rotate(-3deg)",
              color: "#0f172a",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Opción 1 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>⚪ Pack x1</span>
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>$10.000</span>
            </div>

            {/* Opción 2 Seleccionada */}
            <div style={{ background: "#ecfdf5", border: "2px solid #10B981", padding: "8px", borderRadius: "10px", position: "relative" }}>
              <div style={{ position: "absolute", top: "-8px", right: "6px", display: "flex", gap: "3px" }}>
                <span style={{ background: "#10B981", color: "#fff", fontSize: "7px", fontWeight: "900", padding: "1px 4px", borderRadius: "6px" }}>ENVÍO GRATIS</span>
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "7px", fontWeight: "900", padding: "1px 4px", borderRadius: "6px" }}>MÁS VENDIDO</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800" }}>🟢 Pack x2</div>
                  <div style={{ fontSize: "9px", fontWeight: "bold", color: "#059669" }}>Ahorrá 15%</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "9px", color: "#94a3b8", textDecoration: "line-through", marginRight: "3px" }}>$20.000</span>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#0f172a" }}>$17.850</span>
                </div>
              </div>
            </div>

            {/* Opción 3 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "bold" }}>⚪ Pack x3 </span>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#059669" }}>-20%</span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>$24.000</span>
            </div>

            {/* Botón CTA */}
            <div style={{ background: "#10B981", color: "#ffffff", textAlign: "center", padding: "8px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", marginTop: "2px" }}>
              Agregar al carrito
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          BANNER 2: DESTACÁ TUS OFERTAS
         ========================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          minHeight: "350px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 220px", zIndex: 2 }}>
          <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#ffffff", margin: "0 0 10px 0", lineHeight: "1.1" }}>
            Destacá tus ofertas
          </h2>
          <p style={{ fontSize: "13px", color: "#d1fae5", margin: 0, lineHeight: "1.4", fontWeight: "500" }}>
            Resaltá promociones, cupones y banners de urgencia para disparar tus conversiones.
          </p>
        </div>

        <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          {/* Timer Relámpago */}
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "10px",
              width: "220px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              borderRadius: "14px",
              padding: "12px",
              boxShadow: "0 15px 25px rgba(0,0,0,0.4)",
              border: "1px solid #334155",
              transform: "rotate(-5deg)",
              zIndex: 3,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "9px", fontWeight: "900", color: "#fbbf24" }}>🔥 OFERTA RELÁMPAGO</span>
              <span style={{ background: "#dc2626", fontSize: "7px", fontWeight: "bold", padding: "1px 5px", borderRadius: "8px" }}>$25.000 OFF</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", alignItems: "center" }}>
              <div style={{ background: "#1e293b", padding: "6px 8px", borderRadius: "8px", textAlign: "center", border: "1px solid #475569" }}>
                <div style={{ fontSize: "14px", fontWeight: "900", color: "#34d399" }}>06</div>
                <div style={{ fontSize: "7px", color: "#94a3b8" }}>HRS</div>
              </div>
              <span style={{ fontWeight: "bold", color: "#64748b" }}>:</span>
              <div style={{ background: "#1e293b", padding: "6px 8px", borderRadius: "8px", textAlign: "center", border: "1px solid #475569" }}>
                <div style={{ fontSize: "14px", fontWeight: "900", color: "#34d399" }}>21</div>
                <div style={{ fontSize: "7px", color: "#94a3b8" }}>MINS</div>
              </div>
              <span style={{ fontWeight: "bold", color: "#64748b" }}>:</span>
              <div style={{ background: "#1e293b", padding: "6px 8px", borderRadius: "8px", textAlign: "center", border: "1px solid #475569" }}>
                <div style={{ fontSize: "14px", fontWeight: "900", color: "#34d399" }}>28</div>
                <div style={{ fontSize: "7px", color: "#94a3b8" }}>SEGS</div>
              </div>
            </div>
          </div>

          {/* Stickers Promocionales */}
          <div style={{ position: "absolute", right: "0px", top: "15px", display: "flex", flexDirection: "column", gap: "6px", transform: "rotate(4deg)", zIndex: 4 }}>
            <div style={{ background: "#10B981", color: "#fff", padding: "6px 10px", borderRadius: "16px", fontSize: "9px", fontWeight: "800", boxShadow: "0 8px 12px rgba(0,0,0,0.2)" }}>
              ✨ ¡Oferta sorpresa!
            </div>
            <div style={{ background: "#dc2626", color: "#fff", padding: "6px 10px", borderRadius: "16px", fontSize: "9px", fontWeight: "800", boxShadow: "0 8px 12px rgba(0,0,0,0.2)" }}>
              🔥 ¡Últimas en stock!
            </div>
          </div>

          {/* Cupón Banner */}
          <div
            style={{
              position: "absolute",
              left: "10px",
              bottom: "10px",
              width: "220px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: "0 15px 20px rgba(0,0,0,0.25)",
              border: "2px dashed #fca5a5",
              transform: "rotate(2deg)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: "900" }}>20% OFF extra 🎄</div>
              <div style={{ fontSize: "8px", color: "#fecaca" }}>En todo el sitio</div>
            </div>
            <div style={{ background: "#ffffff", color: "#0f172a", padding: "4px 8px", borderRadius: "8px", fontFamily: "monospace", fontWeight: "900", fontSize: "10px" }}>
              EXTRA20
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          BANNER 3: GENERÁ CONFIANZA
         ========================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          minHeight: "350px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 220px", zIndex: 2 }}>
          <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#ffffff", margin: "0 0 10px 0", lineHeight: "1.1" }}>
            Generá confianza
          </h2>
          <p style={{ fontSize: "13px", color: "#d1fae5", margin: 0, lineHeight: "1.4", fontWeight: "500" }}>
            Transmití seguridad total a tus clientes con testimonios reales y sellos de garantía.
          </p>
        </div>

        <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          {/* Widget Reseñas */}
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "10px",
              width: "230px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: "16px",
              padding: "12px",
              boxShadow: "0 20px 25px rgba(0,0,0,0.25)",
              border: "1px solid #e2e8f0",
              transform: "rotate(-3deg)",
              zIndex: 3,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "18px", fontWeight: "900" }}>4,8</span>
                <div>
                  <div style={{ color: "#fbbf24", fontSize: "10px" }}>★★★★★</div>
                  <div style={{ fontSize: "7px", color: "#94a3b8", fontWeight: "bold" }}>24 reseñas</div>
                </div>
              </div>
              <div style={{ background: "#000", color: "#fff", fontSize: "8px", fontWeight: "bold", padding: "4px 8px", borderRadius: "6px" }}>
                Opiniones
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "9px", fontWeight: "bold" }}>Mariana P.</span>
                <span style={{ color: "#fbbf24", fontSize: "8px" }}>★★★★★</span>
              </div>
              <p style={{ fontSize: "8px", color: "#475569", margin: 0, lineHeight: "1.3" }}>
                "Excelente atención y calidad del producto. Llegó impecable!"
              </p>
            </div>
          </div>

          {/* Tarjeta Garantía */}
          <div
            style={{
              position: "absolute",
              right: "0px",
              bottom: "15px",
              width: "170px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: "14px",
              padding: "10px",
              boxShadow: "0 15px 20px rgba(0,0,0,0.2)",
              border: "1px solid #e2e8f0",
              transform: "rotate(4deg)",
              zIndex: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#059669", fontWeight: "800", fontSize: "10px", marginBottom: "4px" }}>
              🛡️ Garantía de 60 días
            </div>
            <p style={{ fontSize: "8px", color: "#64748b", margin: 0, lineHeight: "1.2" }}>
              Si no estás conforme te devolvemos el 100% de tu dinero.
            </p>
          </div>

        </div>
      </div>

      {/* ==========================================
          BANNER 4: TUS ESTILOS, TUS COLORES
         ========================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          minHeight: "350px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 220px", zIndex: 2 }}>
          <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#ffffff", margin: "0 0 10px 0", lineHeight: "1.1" }}>
            Tus estilos, tus colores
          </h2>
          <p style={{ fontSize: "13px", color: "#d1fae5", margin: 0, lineHeight: "1.4", fontWeight: "500" }}>
            Customizá cada widget con la tipografía, colores e identidad de tu marca.
          </p>
        </div>

        <div style={{ flex: "1 1 260px", minHeight: "240px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          {/* Card Editor Mock */}
          <div
            style={{
              position: "relative",
              width: "220px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
              border: "1px solid #e2e8f0",
              transform: "rotate(2deg)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", fontSize: "10px", fontWeight: "bold" }}>
              <div style={{ paddingBottom: "6px", paddingRight: "8px", color: "#94a3b8" }}>General</div>
              <div style={{ paddingBottom: "6px", paddingLeft: "8px", borderBottom: "2px solid #10B981", color: "#059669" }}>Estilo</div>
            </div>

            {/* Selectores */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "9px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Botón "Agregar":</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "3px 6px", borderRadius: "5px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#10B981" }} />
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#10B981</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Color de precio:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "3px 6px", borderRadius: "5px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#000000" }} />
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#000000</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Badge envío gratis:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "3px 6px", borderRadius: "5px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#10B981" }} />
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#10B981</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Badge destacado:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "3px 6px", borderRadius: "5px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#F59E0B" }} />
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#F59E0B</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
                     }
