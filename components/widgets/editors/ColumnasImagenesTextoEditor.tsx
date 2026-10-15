"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface CardItem {
  id: string;
  image: string;
  title: string;
  badge: string;
  subtitle: string;
}

interface ColumnasImagenesTextoEditorProps {
  widgetDefinition?: any;
  existingWidget?: any;
  storeId?: string | number;
  initialConfig?: any;
  widgetId?: string;
  targetType?: "product" | "all" | "category";
  targetProductId?: string | number | null;
  productId?: string | number | null;
  categoryId?: string | number | null;
  onSave?: (config: any) => Promise<void>;
  isSaving?: boolean;
}

const CAMPAIGN_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "black-friday": { bg: "#F59E0B", text: "#111827", border: "#D97706", accent: "#111827" },
  "hot-sale": { bg: "#EF4444", text: "#ffffff", border: "#B91C1C", accent: "#ffffff" },
  "cyber-monday": { bg: "#3B82F6", text: "#ffffff", border: "#1D4ED8", accent: "#ffffff" },
  "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857", accent: "#EF4444" },
  "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d", accent: "#F43F5E" },
  "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca", accent: "#10B981" },
  "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b", accent: "#FBBF24" },
};

const PRESET_LABELS: Record<string, string> = {
  "black-friday": "Black Friday",
  "hot-sale": "Hot Sale",
  "cyber-monday": "Cyber Monday",
  "navidad": "Navidad & Reyes",
  "san-valentin": "San Valentín",
  "dia-padre-madre": "Día Madre/Padre",
  "liquidacion": "Liquidación",
};

export default function ColumnasImagenesTextoEditor({
  widgetDefinition,
  existingWidget,
  storeId,
  initialConfig,
  widgetId,
  targetType = "all",
  targetProductId,
  productId,
  categoryId,
  onSave,
  isSaving = false,
}: ColumnasImagenesTextoEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  const cfg = initialConfig || existingWidget?.config || {};

  const defaultCards: CardItem[] = [
    {
      id: "card-1",
      image: "",
      title: "Título de tarjeta",
      badge: "NUEVO",
      subtitle: "Subtítulo descriptivo de la característica o beneficio.",
    },
    {
      id: "card-2",
      image: "",
      title: "Título de tarjeta",
      badge: "",
      subtitle: "Subtítulo descriptivo de la característica o beneficio.",
    },
    {
      id: "card-3",
      image: "",
      title: "Título de tarjeta",
      badge: "",
      subtitle: "Subtítulo descriptivo de la característica o beneficio.",
    },
  ];

  const [sectionTitle, setSectionTitle] = useState(cfg.sectionTitle || "");
  const [sectionSubtitle, setSectionSubtitle] = useState(cfg.sectionSubtitle || "");
  const [cards, setCards] = useState<CardItem[]>(
    Array.isArray(cfg.cards) && cfg.cards.length > 0 ? cfg.cards : defaultCards
  );

  const [position, setPosition] = useState(cfg.position || "after-description");
  const [columnsDesktop, setColumnsDesktop] = useState(
    typeof cfg.columnsDesktop === "number" ? cfg.columnsDesktop : 3
  );
  const [cardRadius, setCardRadius] = useState(cfg.cardRadius || "rounded");
  const [cardAlign, setCardAlign] = useState(cfg.cardAlign || "center");
  const [mobileLayout, setMobileLayout] = useState(cfg.mobileLayout || "scroll");

  const [sectionBg, setSectionBg] = useState(cfg.sectionBg || "#fafafa");
  const [cardBg, setCardBg] = useState(cfg.cardBg || "#ffffff");
  const [sectionTitleColor, setSectionTitleColor] = useState(cfg.sectionTitleColor || "#191919");
  const [sectionSubtitleColor, setSectionSubtitleColor] = useState(cfg.sectionSubtitleColor || "#5E5E5E");
  const [cardTitleColor, setCardTitleColor] = useState(cfg.cardTitleColor || "#191919");
  const [cardSubtitleColor, setCardSubtitleColor] = useState(cfg.cardSubtitleColor || "#5E5E5E");

  const [sectionTitleSize, setSectionTitleSize] = useState(
    typeof cfg.sectionTitleSize === "number" ? cfg.sectionTitleSize : 22
  );
  const [sectionSubtitleSize, setSectionSubtitleSize] = useState(
    typeof cfg.sectionSubtitleSize === "number" ? cfg.sectionSubtitleSize : 16
  );
  const [cardTitleSize, setCardTitleSize] = useState(
    typeof cfg.cardTitleSize === "number" ? cfg.cardTitleSize : 18
  );
  const [cardSubtitleSize, setCardSubtitleSize] = useState(
    typeof cfg.cardSubtitleSize === "number" ? cfg.cardSubtitleSize : 14
  );

  const [badgeBg, setBadgeBg] = useState(cfg.badgeBg || "#191919");
  const [badgeColor, setBadgeColor] = useState(cfg.badgeColor || "#ffffff");
  const [badgeBorder, setBadgeBorder] = useState(cfg.badgeBorder || "transparent");
  const [badgeSize, setBadgeSize] = useState(typeof cfg.badgeSize === "number" ? cfg.badgeSize : 11);
  const [badgeRounded, setBadgeRounded] = useState(cfg.badgeRounded !== false);

  const [campaignTheme, setCampaignTheme] = useState(cfg.campaignTheme || "none");
  const [isActive, setIsActive] = useState(cfg.is_active !== false && existingWidget?.is_active !== false);
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const effectiveTargetType =
    targetType || existingWidget?.target_type || (categoryId ? "category" : productId ? "product" : "all");
  const isCategory = effectiveTargetType === "category" || !!categoryId;
  const isForAll = effectiveTargetType === "all";
  const scopeLabel = isForAll ? "Todos los productos" : isCategory ? "Categoría" : "Producto específico";

  const updateCard = function (id: string, field: string, val: string) {
    setCards(function (prev) {
      return prev.map(function (card) {
        if (card.id === id) {
          return { ...card, [field]: val };
        }
        return card;
      });
    });
  };

  const handleFileUpload = function (e: React.ChangeEvent<HTMLInputElement>, id: string) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("La imagen supera los 3MB. Comprimila antes de subirla.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (evt) {
      var res = evt.target && evt.target.result;
      if (typeof res === "string") {
        updateCard(id, "image", res);
      }
    };
    reader.readAsDataURL(file);
  };

  const addCard = function () {
    if (cards.length >= 6) {
      alert("Máximo 6 tarjetas.");
      return;
    }
    var newCard: CardItem = {
      id: "card-" + Math.random().toString(36).substring(2, 7),
      image: "",
      title: "Título de tarjeta",
      badge: "",
      subtitle: "Subtítulo descriptivo de la característica o beneficio.",
    };
    setCards(function (prev) {
      return [...prev, newCard];
    });
  };

  const removeCard = function (id: string) {
    if (cards.length <= 1) {
      alert("Tenés que mantener al menos una tarjeta.");
      return;
    }
    setCards(function (prev) {
      return prev.filter(function (card) {
        return card.id !== id;
      });
    });
  };

  const moveCard = function (index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === cards.length - 1) return;
    var newArr = [...cards];
    var targetIdx = direction === "up" ? index - 1 : index + 1;
    var temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setCards(newArr);
  };

  const applyPresetTheme = function (themeKey: string) {
    setCampaignTheme(themeKey);
    if (themeKey !== "none" && CAMPAIGN_THEMES[themeKey]) {
      var th = CAMPAIGN_THEMES[themeKey];
      setBadgeBg(th.bg);
      setBadgeColor(th.text);
      setBadgeBorder(th.border);
    }
  };

  const handleColorChange = function (setter: (val: string) => void, value: string) {
    setter(value);
    setCampaignTheme("none");
  };

  const handleSave = async function () {
    var configData = {
      sectionTitle: sectionTitle,
      sectionSubtitle: sectionSubtitle,
      cards: cards,
      position: position,
      columnsDesktop: columnsDesktop,
      cardRadius: cardRadius,
      cardAlign: cardAlign,
      mobileLayout: mobileLayout,
      sectionBg: sectionBg,
      cardBg: cardBg,
      sectionTitleColor: sectionTitleColor,
      sectionSubtitleColor: sectionSubtitleColor,
      cardTitleColor: cardTitleColor,
      cardSubtitleColor: cardSubtitleColor,
      sectionTitleSize: sectionTitleSize,
      sectionSubtitleSize: sectionSubtitleSize,
      cardTitleSize: cardTitleSize,
      cardSubtitleSize: cardSubtitleSize,
      badgeBg: badgeBg,
      badgeColor: badgeColor,
      badgeBorder: badgeBorder,
      badgeSize: badgeSize,
      badgeRounded: badgeRounded,
      campaignTheme: campaignTheme,
      ...(categoryId ? { category_id: String(categoryId) } : {}),
    };

    var finalTargetType = effectiveTargetType;
    var finalProductId = productId || targetProductId || existingWidget?.target_product_id || null;
    var finalCategoryId = categoryId || existingWidget?.target_category_id || null;

    if (onSave) {
      await onSave({
        config: configData,
        target_type: finalTargetType,
        target_product_id: finalProductId,
        target_category_id: finalCategoryId,
        is_active: isActive,
      });
      window.location.href = "/widgets";
      return;
    }

    setIsSavingInternal(true);
    try {
      var res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingWidget?.id || undefined,
          store_id: storeId ? String(storeId) : undefined,
          widget_slug: "columnas-imagenes-texto",
          config: configData,
          is_active: isActive,
          target_type: finalTargetType,
          target_product_id: finalProductId ? String(finalProductId) : null,
          target_category_id: finalCategoryId ? String(finalCategoryId) : null,
        }),
      });

      if (!res.ok) {
        var errData = await res.json().catch(function () {
          return {};
        });
        throw new Error(errData.error || "Error al guardar el widget");
      }

      window.location.href = "/widgets";
    } catch (err: any) {
      alert("Error al guardar: " + (err.message || "Error desconocido"));
      setIsSavingInternal(false);
    }
  };

  const saving = isSaving || isSavingInternal;
  const radiusValue = cardRadius === "rounded" ? "12px" : "0px";
  const badgeRadius = badgeRounded ? "999px" : "4px";
  const textAlignValue = cardAlign === "center" ? "center" : "left";
  const alignItemsValue = cardAlign === "center" ? "center" : "flex-start";

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* HEADER STICKY NEVUX */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #E5E7EB",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <NevuxLogo size="medium" />
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#111827",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 800,
          }}
        >
          RL
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: isCategory ? "#FEF3C7" : isForAll ? "#D1FAE5" : "#E0E7FF",
            color: isCategory ? "#D97706" : isForAll ? "#059669" : "#3730A3",
            border: "1px solid " + (isCategory ? "#FCD34D" : isForAll ? "#6EE7B7" : "#A5B4FC"),
          }}
        >
          {isCategory ? "🏷️" : isForAll ? "🏪" : "📦"} {scopeLabel}
        </span>
      </div>

      <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>
        Nuevo widget: Columnas de imágenes y texto ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
      </h1>

      <div
        style={{
          backgroundColor: "#ECFDF5",
          border: "1px solid #10B981",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "#065F46",
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "18px" }}>🎴</span>
        <div>
          <strong>Tarjetas en columnas con imagen, título y subtítulo:</strong> Ideal para resaltar características o beneficios visuales. En desktop se ve como grilla (3 o 4 columnas) y en mobile con scroll horizontal o apilado.
        </div>
      </div>

      {/* PREVIEW EN VIVO */}
      <div
        style={{
          backgroundColor: sectionBg,
          border: "2px dashed #E5E7EB",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "#6B7280",
            textTransform: "uppercase",
            marginBottom: "12px",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          VISTA PREVIA EN VIVO
        </div>

        {(sectionTitle || sectionSubtitle) && (
          <div style={{ textAlign: "center", marginBottom: "16px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
            {sectionTitle ? (
              <div style={{ fontSize: sectionTitleSize + "px", fontWeight: 800, color: sectionTitleColor, lineHeight: 1.25, marginBottom: "6px" }}>
                {sectionTitle}
              </div>
            ) : null}
            {sectionSubtitle ? (
              <div style={{ fontSize: sectionSubtitleSize + "px", color: sectionSubtitleColor, lineHeight: 1.4 }}>
                {sectionSubtitle}
              </div>
            ) : null}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(" + Math.min(columnsDesktop, cards.length) + ", minmax(0, 1fr))",
            gap: "12px",
            maxWidth: "640px",
            margin: "0 auto",
          }}
        >
          {cards.map(function (card, idx) {
            return (
              <div
                key={card.id || idx}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: radiusValue,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: alignItemsValue,
                  textAlign: textAlignValue,
                  gap: "8px",
                  minWidth: 0,
                }}
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                      borderRadius: radiusValue,
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      backgroundColor: "#E5E7EB",
                      borderRadius: radiusValue,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      color: "#9CA3AF",
                    }}
                  >
                    🖼️
                  </div>
                )}

                {card.badge ? (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      border: "1px solid " + badgeBorder,
                      padding: "3px 8px",
                      borderRadius: badgeRadius,
                      fontSize: badgeSize + "px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {card.badge}
                  </span>
                ) : null}

                <div style={{ fontSize: cardTitleSize + "px", fontWeight: 800, color: cardTitleColor, lineHeight: 1.25, width: "100%" }}>
                  {card.title || "Título de tarjeta"}
                </div>
                <div style={{ fontSize: cardSubtitleSize + "px", color: cardSubtitleColor, lineHeight: 1.4, width: "100%" }}>
                  {card.subtitle || "Subtítulo descriptivo..."}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "12px", textAlign: "center", fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }}>
          Desktop: {columnsDesktop} columnas · Mobile: {mobileLayout === "scroll" ? "Scroll horizontal" : "Una debajo de otra"}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "🎴 Tarjetas" },
          { id: "ubicacion", label: "📍 Ubicación" },
          { id: "estilos", label: "🎨 Estilos" },
          { id: "fechas", label: "🔥 Fechas Especiales" },
        ].map(function (tab) {
          var active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () {
                setActiveTab(tab.id);
              }}
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                background: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderBottom: active ? "3px solid #10B981" : "3px solid transparent",
                color: active ? "#10B981" : "#6B7280",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB GENERAL */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Título de la sección (opcional)</div>
            <input
              type="text"
              value={sectionTitle}
              onChange={function (e) {
                setSectionTitle(e.target.value);
              }}
              placeholder="Ej: Nuestras características"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box", marginBottom: "12px" }}
            />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Subtítulo de la sección (opcional)</div>
            <textarea
              value={sectionSubtitle}
              onChange={function (e) {
                setSectionSubtitle(e.target.value);
              }}
              placeholder="Ej: Descubrí los beneficios que hacen única a esta propuesta"
              rows={2}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box", resize: "vertical" }}
            />
          </div>

          {cards.map(function (card, idx) {
            return (
              <div key={card.id} style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Tarjeta #{idx + 1}</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={function () {
                        moveCard(idx, "up");
                      }}
                      disabled={idx === 0}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        backgroundColor: "#ffffff",
                        cursor: idx === 0 ? "not-allowed" : "pointer",
                        opacity: idx === 0 ? 0.4 : 1,
                        fontSize: "12px",
                      }}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={function () {
                        moveCard(idx, "down");
                      }}
                      disabled={idx === cards.length - 1}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        backgroundColor: "#ffffff",
                        cursor: idx === cards.length - 1 ? "not-allowed" : "pointer",
                        opacity: idx === cards.length - 1 ? 0.4 : 1,
                        fontSize: "12px",
                      }}
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={function () {
                        removeCard(card.id);
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #FCA5A5",
                        backgroundColor: "#FEF2F2",
                        color: "#DC2626",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                      Imagen (opcional)
                    </label>
                    <div
                      style={{
                        border: "2px dashed #D1D5DB",
                        borderRadius: "10px",
                        padding: "14px",
                        backgroundColor: "#F9FAFB",
                        textAlign: "center",
                      }}
                    >
                      {card.image ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                          <img
                            src={card.image}
                            alt="Preview"
                            style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", border: "1px solid #D1D5DB" }}
                          />
                          <button
                            type="button"
                            onClick={function () {
                              updateCard(card.id, "image", "");
                            }}
                            style={{
                              fontSize: "12px",
                              color: "#DC2626",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            Quitar imagen
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>
                          Haz click o arrastra una imagen
                          <br />
                          JPG, PNG, WebP — Máx. 3MB
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={function (e) {
                          handleFileUpload(e, card.id);
                        }}
                        style={{ fontSize: "12px", width: "100%" }}
                      />
                    </div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px" }}>
                      💡 Comprimí tus imágenes antes de subirlas para mejorar el tiempo de carga.
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                      Título de la tarjeta
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={function (e) {
                        updateCard(card.id, "title", e.target.value);
                      }}
                      placeholder="Ej: Título de tarjeta"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", fontWeight: 700, boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                      Badge (opcional)
                    </label>
                    <input
                      type="text"
                      value={card.badge}
                      onChange={function (e) {
                        updateCard(card.id, "badge", e.target.value);
                      }}
                      placeholder="Ej: Nuevo"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                      Subtítulo de la tarjeta
                    </label>
                    <textarea
                      value={card.subtitle}
                      onChange={function (e) {
                        updateCard(card.id, "subtitle", e.target.value);
                      }}
                      placeholder="Escribí el subtítulo o beneficio..."
                      rows={3}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box", resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addCard}
            disabled={cards.length >= 6}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "2px dashed #10B981",
              backgroundColor: cards.length >= 6 ? "#F3F4F6" : "#ECFDF5",
              color: cards.length >= 6 ? "#9CA3AF" : "#059669",
              fontSize: "14px",
              fontWeight: 800,
              cursor: cards.length >= 6 ? "not-allowed" : "pointer",
            }}
          >
            + Agregar tarjeta {cards.length >= 6 ? "(Máximo 6)" : ""}
          </button>

          <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>Máximo 6 tarjetas · {cards.length}/6</div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827",
              marginTop: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={isActive}
              onChange={function (e) {
                setIsActive(e.target.checked);
              }}
              style={{ width: "18px", height: "18px", accentColor: "#10B981" }}
            />
            Widget activo
          </label>
        </div>
      )}

      {/* TAB UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
            Posición del widget en la ficha de producto
          </div>

          <label
            style={{
              display: "block",
              padding: "14px 16px",
              borderRadius: "12px",
              border: position === "before-description" ? "2px solid #10B981" : "1px solid #E5E7EB",
              backgroundColor: position === "before-description" ? "#ECFDF5" : "#ffffff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="radio"
                name="pos"
                checked={position === "before-description"}
                onChange={function () {
                  setPosition("before-description");
                }}
                style={{ marginTop: "3px", accentColor: "#10B981" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Antes de la descripción</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>
                  El widget aparece debajo del botón &quot;Agregar al carrito&quot;, dentro de la columna del producto, justo arriba del bloque de descripción.
                </div>
              </div>
            </div>
          </label>

          <label
            style={{
              display: "block",
              padding: "14px 16px",
              borderRadius: "12px",
              border: position === "after-description" ? "2px solid #10B981" : "1px solid #E5E7EB",
              backgroundColor: position === "after-description" ? "#ECFDF5" : "#ffffff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="radio"
                name="pos"
                checked={position === "after-description"}
                onChange={function () {
                  setPosition("after-description");
                }}
                style={{ marginTop: "3px", accentColor: "#10B981" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Después de la descripción</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>
                  El widget se muestra después de toda la sección de descripción del producto, a ancho completo. Ideal para grillas visuales.
                </div>
              </div>
            </div>
          </label>

          <div
            style={{
              marginTop: "8px",
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "12px",
              color: "#6B7280",
              lineHeight: 1.5,
            }}
          >
            ℹ️ En computadora se mostrará como una cuadrícula de tarjetas. En mobile podés elegir scroll horizontal o apilado desde la pestaña Estilos.
          </div>
        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>Diseño y estructura</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Definí la distribución, columnas y estructura del bloque.</div>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Columnas en desktop</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={function () {
                    setColumnsDesktop(3);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: columnsDesktop === 3 ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: columnsDesktop === 3 ? "#ECFDF5" : "#ffffff",
                    color: columnsDesktop === 3 ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  3 columnas
                </button>
                <button
                  type="button"
                  onClick={function () {
                    setColumnsDesktop(4);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: columnsDesktop === 4 ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: columnsDesktop === 4 ? "#ECFDF5" : "#ffffff",
                    color: columnsDesktop === 4 ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  4 columnas
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Bordes redondeados de las tarjetas</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={function () {
                    setCardRadius("rounded");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: cardRadius === "rounded" ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: cardRadius === "rounded" ? "#ECFDF5" : "#ffffff",
                    color: cardRadius === "rounded" ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Redondeado
                </button>
                <button
                  type="button"
                  onClick={function () {
                    setCardRadius("square");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: cardRadius === "square" ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: cardRadius === "square" ? "#ECFDF5" : "#ffffff",
                    color: cardRadius === "square" ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Sin redondear
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Alineación de las tarjetas</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={function () {
                    setCardAlign("center");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: cardAlign === "center" ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: cardAlign === "center" ? "#ECFDF5" : "#ffffff",
                    color: cardAlign === "center" ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Centrado
                </button>
                <button
                  type="button"
                  onClick={function () {
                    setCardAlign("left");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: cardAlign === "left" ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: cardAlign === "left" ? "#ECFDF5" : "#ffffff",
                    color: cardAlign === "left" ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Izquierda
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Layout en mobile/responsive</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={function () {
                    setMobileLayout("scroll");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: mobileLayout === "scroll" ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: mobileLayout === "scroll" ? "#ECFDF5" : "#ffffff",
                    color: mobileLayout === "scroll" ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Scroll horizontal
                </button>
                <button
                  type="button"
                  onClick={function () {
                    setMobileLayout("stack");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: mobileLayout === "stack" ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: mobileLayout === "stack" ? "#ECFDF5" : "#ffffff",
                    color: mobileLayout === "stack" ? "#059669" : "#374151",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Una debajo
                </button>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>Colores principales</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Ajustá los colores de fondo y textos del bloque.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                { label: "Color de fondo de la sección", value: sectionBg, setter: setSectionBg },
                { label: "Color de fondo de las tarjetas", value: cardBg, setter: setCardBg },
                { label: "Color del título principal", value: sectionTitleColor, setter: setSectionTitleColor },
                { label: "Color del subtítulo principal", value: sectionSubtitleColor, setter: setSectionSubtitleColor },
                { label: "Color de título de tarjetas", value: cardTitleColor, setter: setCardTitleColor },
                { label: "Color de subtítulo de tarjetas", value: cardSubtitleColor, setter: setCardSubtitleColor },
              ].map(function (item) {
                return (
                  <div key={item.label}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                      {item.label}
                    </label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={item.value}
                        onChange={function (e) {
                          handleColorChange(item.setter, e.target.value);
                        }}
                        style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={function (e) {
                          handleColorChange(item.setter, e.target.value);
                        }}
                        style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>Tipografía</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Controlá tamaños y proporciones del texto.</div>

            {[
              { label: "Tamaño título sección", value: sectionTitleSize, setter: setSectionTitleSize, min: 16, max: 32 },
              { label: "Tamaño subtítulo sección", value: sectionSubtitleSize, setter: setSectionSubtitleSize, min: 12, max: 22 },
              { label: "Tamaño título de tarjetas", value: cardTitleSize, setter: setCardTitleSize, min: 14, max: 28 },
              { label: "Tamaño subtítulo de tarjetas", value: cardSubtitleSize, setter: setCardSubtitleSize, min: 12, max: 20 },
            ].map(function (item) {
              return (
                <div key={item.label} style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                    {item.label}: {item.value}px
                  </label>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={1}
                    value={item.value}
                    onChange={function (e) {
                      item.setter(parseInt(e.target.value, 10));
                    }}
                    style={{ width: "100%", accentColor: "#10B981" }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "6px" }}>Estilo del badge</div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>Ajustá fuente, color y bordes del badge opcional.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Tamaño de fuente: {badgeSize}px
                </label>
                <input
                  type="range"
                  min={9}
                  max={14}
                  step={1}
                  value={badgeSize}
                  onChange={function (e) {
                    setBadgeSize(parseInt(e.target.value, 10));
                  }}
                  style={{ width: "100%", accentColor: "#10B981" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Color de fuente</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={function (e) {
                      handleColorChange(setBadgeColor, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeColor}
                    onChange={function (e) {
                      handleColorChange(setBadgeColor, e.target.value);
                    }}
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Color de fondo</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={badgeBg}
                    onChange={function (e) {
                      handleColorChange(setBadgeBg, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeBg}
                    onChange={function (e) {
                      handleColorChange(setBadgeBg, e.target.value);
                    }}
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Color de borde</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={badgeBorder === "transparent" ? "#ffffff" : badgeBorder}
                    onChange={function (e) {
                      handleColorChange(setBadgeBorder, e.target.value);
                    }}
                    style={{ width: "40px", height: "38px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                  />
                  <input
                    type="text"
                    value={badgeBorder}
                    onChange={function (e) {
                      handleColorChange(setBadgeBorder, e.target.value);
                    }}
                    placeholder="transparent"
                    style={{ flex: 1, minWidth: 0, padding: "9px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Borde del badge</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={function () {
                  setBadgeRounded(true);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: badgeRounded ? "2px solid #10B981" : "1px solid #E5E7EB",
                  backgroundColor: badgeRounded ? "#ECFDF5" : "#ffffff",
                  color: badgeRounded ? "#059669" : "#374151",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Redondeado
              </button>
              <button
                type="button"
                onClick={function () {
                  setBadgeRounded(false);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: !badgeRounded ? "2px solid #10B981" : "1px solid #E5E7EB",
                  backgroundColor: !badgeRounded ? "#ECFDF5" : "#ffffff",
                  color: !badgeRounded ? "#059669" : "#374151",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Sin redondear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === "fechas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: "#92400E" }}>
            🔥 Elegí un preset de campaña. Aplica colores llamativos a los badges automáticamente.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              type="button"
              onClick={function () {
                applyPresetTheme("none");
                setBadgeBg("#191919");
                setBadgeColor("#ffffff");
                setBadgeBorder("transparent");
              }}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: campaignTheme === "none" ? "2px solid #10B981" : "1px solid #E5E7EB",
                backgroundColor: campaignTheme === "none" ? "#ECFDF5" : "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              ✨ Sin campaña (colores libres)
            </button>

            {Object.keys(CAMPAIGN_THEMES).map(function (key) {
              var th = CAMPAIGN_THEMES[key];
              var active = campaignTheme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={function () {
                    applyPresetTheme(key);
                  }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: active ? "2px solid #10B981" : "1px solid #E5E7EB",
                    backgroundColor: th.bg,
                    color: th.text,
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{PRESET_LABELS[key] || key}</span>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: th.accent,
                      border: "2px solid rgba(255,255,255,0.5)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GUARDAR */}
      <div style={{ marginTop: "28px", borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            backgroundColor: "#10B981",
            color: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 800,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Guardando widget..." : "💾 Guardar Columnas de imágenes y texto"}
        </button>
        <p style={{ fontSize: "12px", color: "#6B7280", textAlign: "center", marginTop: "10px" }}>
          Al guardar vas a volver a <strong>Mis Widgets</strong>
        </p>
      </div>

      <div style={{ marginTop: "28px" }}>
        <CentroAyuda />
      </div>
    </div>
  );
}
