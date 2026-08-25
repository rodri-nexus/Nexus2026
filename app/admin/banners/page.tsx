"use client";

import React from "react";

export default function BannersPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        boxSizing: "border-box",
      }}
    >
      {/* Indicaciones para el usuario */}
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#34d399", margin: "0 0 8px 0" }}>
          📷 Banners Promocionales Oficiales de Nevux
        </h1>
        <p style={{ fontSize: "13px", color: "#cbd5e1", margin: 0, lineHeight: "1.5" }}>
          Girá tu teléfono en <b>modo horizontal (landscape)</b> para que cada tarjeta ocupe la pantalla completa y sacale captura para la App Store de Tiendanube.
        </p>
      </div>

      {/* ==========================================
          BANNER 1: IMPULSÁ TU TICKET PROMEDIO
         ========================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          minHeight: "480px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "28px",
          padding: "36px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* Columna Izquierda: Textos */}
        <div style={{ flex: "1 1 320px", zIndex: 2 }}>
          <h2
            style={{
              fontSize: "38px",
              fontWeight: "900",
              color: "#ffffff",
              margin: "0 0 16px 0",
              lineHeight: "1.1",
              letterSpacing: "-0.5px",
            }}
          >
            Impulsá tu ticket promedio
          </h2>
          <p style={{ fontSize: "16px", color: "#d1fae5", margin: 0, lineHeight: "1.5", fontWeight: "500" }}>
            Aumentá tu facturación elevando el valor de cada venta con ofertas irresistibles.
          </p>
        </div>

        {/* Columna Derecha: Widgets Stack */}
        <div style={{ flex: "1 1 360px", minHeight: "320px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyCenter: "center" }}>
          
          {/* Tarjeta Fondo: Armá tu Pack */}
          <div
            style={{
              position: "absolute",
              right: "0px",
              top: "10px",
              width: "240px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
              border: "1px solid #e2e8f0",
              transform: "rotate(6deg) scale(0.95)",
              color: "#0f172a",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#475569", marginBottom: "10px" }}>
              Armá tu pack
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span>☑️ Tarjetero</span>
                <span style={{ fontWeight: "bold", color: "#059669" }}>$14.000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span>☑️ Bolso</span>
                <span style={{ fontWeight: "bold", color: "#059669" }}>$21.500</span>
              </div>
            </div>
            <div style={{ background: "#000000", color: "#ffffff", textAlign: "center", padding: "8px", borderRadius: "10px", fontSize: "11px", fontWeight: "bold" }}>
              Agregar selección
            </div>
          </div>

          {/* Tarjeta Principal Frontal: Descuentos por Cantidad */}
          <div
            style={{
              position: "relative",
              width: "310px",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.4)",
              border: "1px solid #e2e8f0",
              transform: "rotate(-3deg)",
              color: "#0f172a",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* Opción 1 */}
            <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>⚪ Pack x1</span>
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>$10.000</span>
            </div>

            {/* Opción 2 Seleccionada */}
            <div style={{ background: "#ecfdf5", border: "2px solid #10B981", padding: "12px", borderRadius: "12px", position: "relative" }}>
              <div style={{ position: "absolute", top: "-10px", right: "10px", display: "flex", gap: "4px" }}>
                <span style={{ background: "#10B981", color: "#fff", fontSize: "9px", fontWeight: "900", padding: "2px 6px", borderRadius: "10px" }}>ENVÍO GRATIS</span>
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "9px", fontWeight: "900", padding: "2px 6px", borderRadius: "10px" }}>MÁS VENDIDO</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "800" }}>🟢 Pack x2</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "#059669" }}>Ahorrá 15%</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8", textDecoration: "line-through", marginRight: "4px" }}>$20.000</span>
                  <span style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a" }}>$17.850</span>
                </div>
              </div>
            </div>

            {/* Opción 3 */}
            <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: "bold" }}>⚪ Pack x3 </span>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#059669" }}>Ahorrá 20%</span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>$24.000</span>
            </div>

            {/* Botón CTA */}
            <div style={{ background: "#10B981", color: "#ffffff", textAlign: "center", padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: "800", marginTop: "4px", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>
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
          maxWidth: "900px",
          minHeight: "480px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "28px",
          padding: "36px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 320px", zIndex: 2 }}>
          <h2 style={{ fontSize: "38px", fontWeight: "900", color: "#ffffff", margin: "0 0 16px 0", lineHeight: "1.1" }}>
            Destacá tus ofertas
          </h2>
          <p style={{ fontSize: "16px", color: "#d1fae5", margin: 0, lineHeight: "1.5", fontWeight: "500" }}>
            Resaltá promociones, cupones y banners de urgencia para disparar tus conversiones.
          </p>
        </div>

        <div style={{ flex: "1 1 360px", minHeight: "320px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyCenter: "center" }}>
          
          {/* Timer Relámpago */}
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "10px",
              width: "290px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              borderRadius: "18px",
              padding: "16px",
              boxShadow: "0 20px 30px rgba(0,0,0,0.5)",
              border: "1px solid #334155",
              transform: "rotate(-5deg)",
              zIndex: 3,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "900", color: "#fbbf24", letterSpacing: "0.5px" }}>🔥 OFERTA RELÁMPAGO</span>
              <span style={{ background: "#dc2626", fontSize: "9px", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px" }}>HASTA $25.000 OFF</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
              <div style={{ background: "#1e293b", padding: "8px 12px", borderRadius: "10px", textAlign: "center", border: "1px solid #475569" }}>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "#34d399" }}>06</div>
                <div style={{ fontSize: "8px", color: "#94a3b8" }}>HORAS</div>
              </div>
              <span style={{ fontWeight: "bold", color: "#64748b" }}>:</span>
              <div style={{ background: "#1e293b", padding: "8px 12px", borderRadius: "10px", textAlign: "center", border: "1px solid #475569" }}>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "#34d399" }}>21</div>
                <div style={{ fontSize: "8px", color: "#94a3b8" }}>MINS</div>
              </div>
              <span style={{ fontWeight: "bold", color: "#64748b" }}>:</span>
              <div style={{ background: "#1e293b", padding: "8px 12px", borderRadius: "10px", textAlign: "center", border: "1px solid #475569" }}>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "#34d399" }}>28</div>
                <div style={{ fontSize: "8px", color: "#94a3b8" }}>SEGS</div>
              </div>
            </div>
          </div>

          {/* Stickers Promocionales */}
          <div style={{ position: "absolute", right: "10px", top: "20px", display: "flex", flexDirection: "column", gap: "8px", transform: "rotate(4deg)", zIndex: 4 }}>
            <div style={{ background: "#10B981", color: "#fff", padding: "8px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", boxShadow: "0 10px 15px rgba(0,0,0,0.2)" }}>
              ✨ ¡Oferta sorpresa!
            </div>
            <div style={{ background: "#dc2626", color: "#fff", padding: "8px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", boxShadow: "0 10px 15px rgba(0,0,0,0.2)" }}>
              🔥 ¡Últimas en stock!
            </div>
          </div>

          {/* Cupón Banner */}
          <div
            style={{
              position: "absolute",
              left: "20px",
              bottom: "10px",
              width: "300px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              borderRadius: "16px",
              padding: "14px 18px",
              boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
              border: "2px dashed #fca5a5",
              transform: "rotate(2deg)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <div>
              <div style={{ fontSize: "15px", fontWeight: "900" }}>20% OFF extra 🎄</div>
              <div style={{ fontSize: "10px", color: "#fecaca" }}>Aplicá el cupón en checkout</div>
            </div>
            <div style={{ background: "#ffffff", color: "#0f172a", padding: "6px 12px", borderRadius: "10px", fontFamily: "monospace", fontWeight: "900", fontSize: "13px" }}>
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
          maxWidth: "900px",
          minHeight: "480px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "28px",
          padding: "36px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 320px", zIndex: 2 }}>
          <h2 style={{ fontSize: "38px", fontWeight: "900", color: "#ffffff", margin: "0 0 16px 0", lineHeight: "1.1" }}>
            Generá confianza
          </h2>
          <p style={{ fontSize: "16px", color: "#d1fae5", margin: 0, lineHeight: "1.5", fontWeight: "500" }}>
            Transmití seguridad total a tus clientes con testimonios reales y sellos de garantía.
          </p>
        </div>

        <div style={{ flex: "1 1 360px", minHeight: "320px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyCenter: "center" }}>
          
          {/* Widget Reseñas */}
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "10px",
              width: "310px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: "20px",
              padding: "18px",
              boxShadow: "0 25px 30px rgba(0,0,0,0.3)",
              border: "1px solid #e2e8f0",
              transform: "rotate(-3deg)",
              zIndex: 3,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "22px", fontWeight: "900" }}>4,8</span>
                <div>
                  <div style={{ color: "#fbbf24", fontSize: "12px" }}>★★★★★</div>
                  <div style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "bold" }}>24 reseñas</div>
                </div>
              </div>
              <div style={{ background: "#000", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "6px 10px", borderRadius: "8px" }}>
                Escribir reseña
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: "bold" }}>Mariana P.</span>
                <span style={{ color: "#fbbf24", fontSize: "10px" }}>★★★★★</span>
              </div>
              <p style={{ fontSize: "10px", color: "#475569", margin: 0, lineHeight: "1.4" }}>
                "Excelente atención y calidad del producto. Llegó antes de lo esperado a mi domicilio!"
              </p>
            </div>
          </div>

          {/* Tarjeta Garantía */}
          <div
            style={{
              position: "absolute",
              right: "10px",
              bottom: "20px",
              width: "230px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: "18px",
              padding: "14px",
              boxShadow: "0 20px 25px rgba(0,0,0,0.2)",
              border: "1px solid #e2e8f0",
              transform: "rotate(4deg)",
              zIndex: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#059669", fontWeight: "800", fontSize: "12px", marginBottom: "6px" }}>
              🛡️ Garantía de 60 días
            </div>
            <p style={{ fontSize: "10px", color: "#64748b", margin: 0, lineHeight: "1.3" }}>
              Si el producto no te gusta te reintegramos el 100% de tu dinero sin vueltas.
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
          maxWidth: "900px",
          minHeight: "480px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #044e3a 100%)",
          borderRadius: "28px",
          padding: "36px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 320px", zIndex: 2 }}>
          <h2 style={{ fontSize: "38px", fontWeight: "900", color: "#ffffff", margin: "0 0 16px 0", lineHeight: "1.1" }}>
            Tus estilos, tus colores
          </h2>
          <p style={{ fontSize: "16px", color: "#d1fae5", margin: 0, lineHeight: "1.5", fontWeight: "500" }}>
            Customizá cada widget con la tipografía, colores e identidad de tu marca.
          </p>
        </div>

        <div style={{ flex: "1 1 360px", minHeight: "320px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyCenter: "center" }}>
          
          {/* Card Editor Mock */}
          <div
            style={{
              position: "relative",
              width: "300px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: "20px",
              padding: "18px",
              boxShadow: "0 25px 30px rgba(0,0,0,0.4)",
              border: "1px solid #e2e8f0",
              transform: "rotate(2deg)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", fontSize: "12px", fontWeight: "bold" }}>
              <div style={{ paddingBottom: "8px", paddingRight: "12px", color: "#94a3b8" }}>General</div>
              <div style={{ paddingBottom: "8px", paddingLeft: "12px", borderBottom: "2px solid #10B981", color: "#059669" }}>Estilo</div>
            </div>

            {/* Selectores */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Boton "Agregar":</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#10B981" }} />
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#10B981</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Color de precio:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#000000" }} />
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#000000</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Badge envío gratis:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#10B981" }} />
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>#10B981</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Badge recomendado:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#F59E0B" }} />
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
