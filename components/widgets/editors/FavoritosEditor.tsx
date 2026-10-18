"use client";

import { useState } from "react";

interface FavoritosEditorProps {
  initialConfig?: any;
  onSave: (config: any) => Promise<void> | void;
  saving?: boolean;
}

export default function FavoritosEditor({
  initialConfig = {},
  onSave,
  saving = false,
}: FavoritosEditorProps) {
  const [activeTab, setActiveTab] = useState<"general" | "ubicacion" | "estilos">("general");

  const [iconType, setIconType] = useState(initialConfig.iconType || "heart");
  const [modalTitle, setModalTitle] = useState(initialConfig.modalTitle || "Mis favoritos");
  const [showInGrids, setShowInGrids] = useState(
    initialConfig.showInGrids !== undefined ? initialConfig.showInGrids : true
  );

  const [badgePositionImage, setBadgePositionImage] = useState(
    initialConfig.badgePositionImage || "top-right"
  );
  const [floatingPosition, setFloatingPosition] = useState(
    initialConfig.floatingPosition || "bottom-left"
  );

  const [accentColor, setAccentColor] = useState(initialConfig.accentColor || "#e11d48");
  const [bgColor, setBgColor] = useState(initialConfig.bgColor || "#ffffff");
  const [hasShadow, setHasShadow] = useState(
    initialConfig.hasShadow !== undefined ? initialConfig.hasShadow : true
  );
  const [borderRadius, setBorderRadius] = useState(initialConfig.borderRadius || "50%");
  const [floatingButtonSize, setFloatingButtonSize] = useState(
    initialConfig.floatingButtonSize || "55px"
  );
  const [floatingIconSize, setFloatingIconSize] = useState(
    initialConfig.floatingIconSize || "24px"
  );
  const [showAddToCart, setShowAddToCart] = useState(
    initialConfig.showAddToCart !== undefined ? initialConfig.showAddToCart : true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      iconType,
      modalTitle,
      showInGrids,
      badgePositionImage,
      floatingPosition,
      accentColor,
      bgColor,
      hasShadow,
      borderRadius,
      floatingButtonSize,
      floatingIconSize,
      showAddToCart,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* PESTAÑAS */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", gap: "0.5rem" }}>
        {[
          { id: "general", label: "General" },
          { id: "ubicacion", label: "Ubicación" },
          { id: "estilos", label: "Estilos" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #10B981" : "2px solid transparent",
              color: activeTab === tab.id ? "#10B981" : "#6b7280",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO TAB GENERAL */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.5rem", color: "#111827" }}>
              Ícono del botón
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                { id: "heart", label: "♡ Corazón" },
                { id: "star", label: "☆ Estrella" },
                { id: "bookmark", label: "🔖 Marcador" },
              ].map((opt) => (
                <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", cursor: "pointer", color: "#374151" }}>
                  <input
                    type="radio"
                    name="iconType"
                    checked={iconType === opt.id}
                    onChange={() => setIconType(opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.35rem", color: "#111827" }}>
              Título del modal
            </label>
            <input
              type="text"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              placeholder="Mis favoritos"
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", display: "block" }}>
              Título que aparece en el panel con los productos guardados.
            </span>
          </div>

          <div style={{ background: "#f9fafb", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showInGrids}
                onChange={(e) => setShowInGrids(e.target.checked)}
                style={{ marginTop: "0.2rem" }}
              />
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", display: "block" }}>
                  Mostrar botón de favoritos en productos de home y categorías
                </span>
                <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", marginTop: "0.15rem" }}>
                  Inyecta el botón sobre la imagen de cada producto en las grillas de la tienda.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.5rem", color: "#111827" }}>
              Posición del botón sobre la imagen del producto
            </label>
            <select
              value={badgePositionImage}
              onChange={(e) => setBadgePositionImage(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
              }}
            >
              <option value="top-right">Arriba a la derecha</option>
              <option value="top-left">Arriba a la izquierda</option>
              <option value="bottom-right">Abajo a la derecha</option>
              <option value="bottom-left">Abajo a la izquierda</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.5rem", color: "#111827" }}>
              Posición del botón flotante de la tienda
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { id: "bottom-left", label: "Abajo a la izquierda" },
                { id: "bottom-right", label: "Abajo a la derecha" },
                { id: "top-left", label: "Arriba a la izquierda" },
                { id: "top-right", label: "Arriba a la derecha" },
                { id: "center-left", label: "Al centro a la izquierda" },
                { id: "center-right", label: "Al centro a la derecha" },
              ].map((opt) => (
                <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: floatingPosition === opt.id ? "#ecfdf5" : "#f9fafb", border: "1px solid", borderColor: floatingPosition === opt.id ? "#10B981" : "#e5e7eb", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="floatingPosition"
                    checked={floatingPosition === opt.id}
                    onChange={() => setFloatingPosition(opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.35rem", color: "#111827" }}>
                Color del ícono / acento
              </label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                style={{ width: "100%", height: "40px", borderRadius: "6px", border: "1px solid #d1d5db", cursor: "pointer" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.35rem", color: "#111827" }}>
                Fondo del botón
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{ width: "100%", height: "40px", borderRadius: "6px", border: "1px solid #d1d5db", cursor: "pointer" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.5rem", color: "#111827" }}>
              Sombra del botón
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", cursor: "pointer" }}>
                <input type="radio" name="hasShadow" checked={hasShadow === true} onChange={() => setHasShadow(true)} /> Con sombra
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", cursor: "pointer" }}>
                <input type="radio" name="hasShadow" checked={hasShadow === false} onChange={() => setHasShadow(false)} /> Sin sombra
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.35rem", color: "#111827" }}>
              Borde del botón
            </label>
            <select
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.875rem" }}
            >
              <option value="50%">Circular (50%)</option>
              <option value="8px">Redondeado (8px)</option>
              <option value="0px">Cuadrado (0px)</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.35rem", color: "#111827" }}>
                Tamaño del botón flotante
              </label>
              <select
                value={floatingButtonSize}
                onChange={(e) => setFloatingButtonSize(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.875rem" }}
              >
                <option value="55px">Grande (55px)</option>
                <option value="45px">Mediano (45px)</option>
                <option value="35px">Pequeño (35px)</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.35rem", color: "#111827" }}>
                Tamaño del ícono flotante
              </label>
              <select
                value={floatingIconSize}
                onChange={(e) => setFloatingIconSize(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.875rem" }}
              >
                <option value="24px">Grande (24px)</option>
                <option value="20px">Mediano (20px)</option>
                <option value="16px">Pequeño (16px)</option>
              </select>
            </div>
          </div>

          <div style={{ background: "#f9fafb", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showAddToCart}
                onChange={(e) => setShowAddToCart(e.target.checked)}
                style={{ marginTop: "0.2rem" }}
              />
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", display: "block" }}>
                  Mostrar botones de agregar al carrito
                </span>
                <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", marginTop: "0.15rem" }}>
                  Muestra el botón "+" y "Agregar todos" en el panel de favoritos para agregar productos al carrito directamente.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* BOTÓN GUARDAR FULL WIDTH ABAJO VERDE #10B981 */}
      <div style={{ marginTop: "1rem" }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: "#10B981",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: 800,
            border: "none",
            borderRadius: "8px",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
          }}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
