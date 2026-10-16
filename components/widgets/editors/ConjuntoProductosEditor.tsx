"use client";

import React, { useState, useEffect } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface ProductItem {
  id: string;
  name: string;
  price: number;
}

interface LookItem {
  id: string;
  image: string;
  imagePosition: "left" | "right";
  title: string;
  buttonText: string;
  discountType: "none" | "percentage";
  discountValue: number;
  products: ProductItem[];
}

interface ConjuntoProductosEditorProps {
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

async function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function ConjuntoProductosEditor({
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
}: ConjuntoProductosEditorProps) {
  const [activeTab, setActiveTab] = useState<"general" | "ubicacion" | "estilos">("general");
  const [isSavingInternal, setIsSavingInternal] = useState(false);

  const cfg = initialConfig || existingWidget?.config || {};

  // Configuración general
  const [sectionTitle, setSectionTitle] = useState(cfg.sectionTitle !== undefined ? cfg.sectionTitle : "Nuestros looks");
  const [looks, setLooks] = useState<LookItem[]>(
    Array.isArray(cfg.looks) && cfg.looks.length > 0
      ? cfg.looks
      : [
          {
            id: "look-1",
            image: "",
            imagePosition: "left",
            title: "Look verano",
            buttonText: "Comprar look",
            discountType: "none",
            discountValue: 0,
            products: [
              { id: "p1", name: "Producto 1", price: 1500 },
              { id: "p2", name: "Producto 2", price: 2000 },
            ],
          },
        ]
  );

  // Ubicación
  const [position, setPosition] = useState<"before-desc" | "after-desc">(cfg.position || "before-desc");

  // Estilos - Colores
  const [sectionBgColor, setSectionBgColor] = useState(cfg.sectionBgColor || "transparent");
  const [sectionTitleColor, setSectionTitleColor] = useState(cfg.sectionTitleColor || "#000000");
  const [borderColor, setBorderColor] = useState(cfg.borderColor || "#dddddd");
  const [productsBgColor, setProductsBgColor] = useState(cfg.productsBgColor || "transparent");
  const [productItemBgColor, setProductItemBgColor] = useState(cfg.productItemBgColor || "#ffffff");
  const [btnBgColor, setBtnBgColor] = useState(cfg.btnBgColor || "#000000");
  const [btnTextColor, setBtnTextColor] = useState(cfg.btnTextColor || "#ffffff");
  const [btnBorderColor, setBtnBorderColor] = useState(cfg.btnBorderColor || "transparent");
  const [productNameColor, setProductNameColor] = useState(cfg.productNameColor || "#000000");
  const [productPriceColor, setProductPriceColor] = useState(cfg.productPriceColor || "#000000");
  const [totalColor, setTotalColor] = useState(cfg.totalColor || "#000000");
  const [lookTitleColor, setLookTitleColor] = useState(cfg.lookTitleColor || "#000000");
  const [badgeBgColor, setBadgeBgColor] = useState(cfg.badgeBgColor || "#dcfce7");
  const [badgeTextColor, setBadgeTextColor] = useState(cfg.badgeTextColor || "#059669");

  // Estilos - Tipografías
  const [sectionTitleSize, setSectionTitleSize] = useState(cfg.sectionTitleSize || "24px");
  const [sectionTitleAlign, setSectionTitleAlign] = useState<"left" | "center" | "right">(cfg.sectionTitleAlign || "center");
  const [productNameSize, setProductNameSize] = useState(cfg.productNameSize || "14px");
  const [productPriceSize, setProductPriceSize] = useState(cfg.productPriceSize || "14px");
  const [totalPriceSize, setTotalPriceSize] = useState(cfg.totalPriceSize || "16px");
  const [lookTitleSize, setLookTitleSize] = useState(cfg.lookTitleSize || "20px");

  // Estilos - Diseño y bordes
  const [borderRadius, setBorderRadius] = useState(typeof cfg.borderRadius === "number" ? cfg.borderRadius : 12);
  const [paddingInternal, setPaddingInternal] = useState(typeof cfg.paddingInternal === "number" ? cfg.paddingInternal : 16);
  const [btnBorderRadius, setBtnBorderRadius] = useState(typeof cfg.btnBorderRadius === "number" ? cfg.btnBorderRadius : 25);

  const [isActive, setIsActive] = useState(cfg.widgetActive !== false && cfg.is_active !== false && existingWidget?.is_active !== false);

  const effectiveTargetType = targetType || existingWidget?.target_type || (categoryId ? "category" : productId ? "product" : "all");
  const isCategory = effectiveTargetType === "category" || !!categoryId;
  const isForAll = effectiveTargetType === "all";
  const scopeLabel = isForAll ? "Todos los productos" : isCategory ? "Categoría" : "Producto específico";

  // Cargar configuración existente si cambia
  useEffect(() => {
    const nextCfg = initialConfig || (existingWidget ? existingWidget.config : null);
    if (!nextCfg) return;

    if (nextCfg.sectionTitle !== undefined) setSectionTitle(nextCfg.sectionTitle);
    if (Array.isArray(nextCfg.looks) && nextCfg.looks.length > 0) setLooks(nextCfg.looks);
    if (nextCfg.position) setPosition(nextCfg.position);

    if (nextCfg.sectionBgColor) setSectionBgColor(nextCfg.sectionBgColor);
    if (nextCfg.sectionTitleColor) setSectionTitleColor(nextCfg.sectionTitleColor);
    if (nextCfg.borderColor) setBorderColor(nextCfg.borderColor);
    if (nextCfg.productsBgColor) setProductsBgColor(nextCfg.productsBgColor);
    if (nextCfg.productItemBgColor) setProductItemBgColor(nextCfg.productItemBgColor);
    if (nextCfg.btnBgColor) setBtnBgColor(nextCfg.btnBgColor);
    if (nextCfg.btnTextColor) setBtnTextColor(nextCfg.btnTextColor);
    if (nextCfg.btnBorderColor) setBtnBorderColor(nextCfg.btnBorderColor);
    if (nextCfg.productNameColor) setProductNameColor(nextCfg.productNameColor);
    if (nextCfg.productPriceColor) setProductPriceColor(nextCfg.productPriceColor);
    if (nextCfg.totalColor) setTotalColor(nextCfg.totalColor);
    if (nextCfg.lookTitleColor) setLookTitleColor(nextCfg.lookTitleColor);
    if (nextCfg.badgeBgColor) setBadgeBgColor(nextCfg.badgeBgColor);
    if (nextCfg.badgeTextColor) setBadgeTextColor(nextCfg.badgeTextColor);

    if (nextCfg.sectionTitleSize) setSectionTitleSize(nextCfg.sectionTitleSize);
    if (nextCfg.sectionTitleAlign) setSectionTitleAlign(nextCfg.sectionTitleAlign);
    if (nextCfg.productNameSize) setProductNameSize(nextCfg.productNameSize);
    if (nextCfg.productPriceSize) setProductPriceSize(nextCfg.productPriceSize);
    if (nextCfg.totalPriceSize) setTotalPriceSize(nextCfg.totalPriceSize);
    if (nextCfg.lookTitleSize) setLookTitleSize(nextCfg.lookTitleSize);

    if (typeof nextCfg.borderRadius === "number") setBorderRadius(nextCfg.borderRadius);
    if (typeof nextCfg.paddingInternal === "number") setPaddingInternal(nextCfg.paddingInternal);
    if (typeof nextCfg.btnBorderRadius === "number") setBtnBorderRadius(nextCfg.btnBorderRadius);
    if (typeof nextCfg.widgetActive === "boolean") setIsActive(nextCfg.widgetActive);
    if (typeof nextCfg.is_active === "boolean") setIsActive(nextCfg.is_active);
  }, [initialConfig, existingWidget]);

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const compressed = await compressImage(file);
      setLooks((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], image: compressed };
        return next;
      });
    } catch (e) {
      console.error("Error al comprimir imagen", e);
      alert("Error al procesar la imagen.");
    }
  };

  const addLook = () => {
    if (looks.length >= 10) return;
    const newLook: LookItem = {
      id: "look-" + Date.now(),
      image: "",
      imagePosition: "left",
      title: "Nuevo look",
      buttonText: "Comprar look",
      discountType: "none",
      discountValue: 0,
      products: [
        { id: "p1", name: "Producto A", price: 2000 },
        { id: "p2", name: "Producto B", price: 3000 },
      ],
    };
    setLooks([...looks, newLook]);
  };

  const removeLook = (index: number) => {
    if (looks.length <= 1) return;
    setLooks(looks.filter((_, i) => i !== index));
  };

  const addProductToLook = (lookIndex: number) => {
    setLooks((prev) => {
      const next = [...prev];
      const products = [...next[lookIndex].products];
      const pCount = products.length + 1;
      products.push({
        id: "p" + Date.now(),
        name: `Producto ${pCount}`,
        price: 1000 * pCount,
      });
      next[lookIndex] = { ...next[lookIndex], products };
      return next;
    });
  };

  const removeProductFromLook = (lookIndex: number, prodIndex: number) => {
    setLooks((prev) => {
      const next = [...prev];
      if (next[lookIndex].products.length <= 1) return prev;
      const products = next[lookIndex].products.filter((_, i) => i !== prodIndex);
      next[lookIndex] = { ...next[lookIndex], products };
      return next;
    });
  };

  const updateProductInLook = (lookIndex: number, prodIndex: number, field: "name" | "price", value: any) => {
    setLooks((prev) => {
      const next = [...prev];
      const products = [...next[lookIndex].products];
      const prod = { ...products[prodIndex] };
      if (field === "name") prod.name = value;
      if (field === "price") prod.price = parseFloat(value) || 0;
      products[prodIndex] = prod;
      next[lookIndex] = { ...next[lookIndex], products };
      return next;
    });
  };

  const updateLookField = (index: number, field: keyof LookItem, value: any) => {
    setLooks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async () => {
    if (!looks.length) {
      alert("Agregá al menos un look.");
      return;
    }

    for (let i = 0; i < looks.length; i++) {
      if (!looks[i].products || looks[i].products.length < 1) {
        alert("El look #" + (i + 1) + " necesita al menos un producto.");
        return;
      }
    }

    const configData = {
      sectionTitle,
      looks,
      position,
      sectionBgColor,
      sectionTitleColor,
      borderColor,
      productsBgColor,
      productItemBgColor,
      btnBgColor,
      btnTextColor,
      btnBorderColor,
      productNameColor,
      productPriceColor,
      totalColor,
      lookTitleColor,
      badgeBgColor,
      badgeTextColor,
      sectionTitleSize,
      sectionTitleAlign,
      productNameSize,
      productPriceSize,
      totalPriceSize,
      lookTitleSize,
      borderRadius,
      paddingInternal,
      btnBorderRadius,
      widgetActive: isActive,
      ...(categoryId ? { category_id: String(categoryId) } : {}),
    };

    const finalTargetType = effectiveTargetType;
    const finalProductId = productId || targetProductId || existingWidget?.target_product_id || null;
    const finalCategoryId = categoryId || existingWidget?.target_category_id || null;

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
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingWidget?.id || undefined,
          store_id: storeId ? String(storeId) : undefined,
          widget_slug: "conjunto-productos",
          config: configData,
          is_active: isActive,
          target_type: finalTargetType,
          target_product_id: finalProductId ? String(finalProductId) : null,
          target_category_id: finalCategoryId ? String(finalCategoryId) : null,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar el widget");
      window.location.href = "/widgets";
    } catch (err: any) {
      alert("Error al guardar: " + (err.message || "Error desconocido"));
      setIsSavingInternal(false);
    }
  };

  const saving = isSaving || isSavingInternal;

  const calcLookTotal = (look: LookItem) => {
    const subtotal = look.products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    if (look.discountType === "percentage" && look.discountValue > 0) {
      return Math.round(subtotal * (1 - look.discountValue / 100));
    }
    return subtotal;
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* HEADER STICKY */}
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

      {/* CHIP DE SEGMENTACIÓN */}
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
        {existingWidget?.id ? "Editar" : "Nuevo"} widget: Conjunto de Productos (Look) ({isForAll ? "General" : isCategory ? "Categoría" : "Producto"})
      </h1>

      {/* INFO BOX */}
      <div
        style={{
          backgroundColor: "#EFF6FF",
          border: "1px solid #3B82F6",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "#1E40AF",
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "18px" }}>👗</span>
        <div>
          <strong>Conjunto de productos:</strong> Armá looks combinando una imagen del conjunto con los productos que lo integran y un botón para comprar el look completo.
        </div>
      </div>

      {/* PREVIEW RÁPIDO */}
      <div
        style={{
          backgroundColor: "#F9FAFB",
          border: "2px dashed #E5E7EB",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "12px", fontWeight: 600, textAlign: "center" }}>
          Vista previa rápida
        </div>
        {sectionTitle ? (
          <div
            style={{
              fontSize: sectionTitleSize,
              fontWeight: 800,
              color: sectionTitleColor,
              textAlign: sectionTitleAlign,
              marginBottom: "12px",
            }}
          >
            {sectionTitle}
          </div>
        ) : null}
        {looks.slice(0, 1).map((look) => {
          const total = calcLookTotal(look);
          const subtotal = look.products.reduce((s, p) => s + (Number(p.price) || 0), 0);
          return (
            <div
              key={look.id}
              style={{
                display: "flex",
                flexDirection: look.imagePosition === "right" ? "row-reverse" : "row",
                gap: "12px",
                backgroundColor: sectionBgColor === "transparent" ? "#ffffff" : sectionBgColor,
                border: "1px solid " + borderColor,
                borderRadius: borderRadius + "px",
                padding: paddingInternal + "px",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  flex: "0 0 40%",
                  minHeight: "120px",
                  borderRadius: Math.max(borderRadius - 4, 0) + "px",
                  backgroundColor: "#E5E7EB",
                  backgroundImage: look.image ? "url(" + look.image + ")" : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9CA3AF",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {!look.image ? "Sin imagen" : null}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                {look.title ? (
                  <div style={{ fontSize: lookTitleSize, fontWeight: 800, color: lookTitleColor }}>{look.title}</div>
                ) : null}
                <div style={{ backgroundColor: productsBgColor, display: "flex", flexDirection: "column", gap: "6px" }}>
                  {look.products.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: productItemBgColor,
                        padding: "6px 8px",
                        borderRadius: "6px",
                        fontSize: productNameSize,
                      }}
                    >
                      <span style={{ color: productNameColor, fontWeight: 600 }}>{p.name}</span>
                      <span style={{ color: productPriceColor, fontWeight: 700, fontSize: productPriceSize }}>
                        ${Number(p.price || 0).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: totalPriceSize, fontWeight: 800, color: totalColor }}>
                    Total: ${total.toLocaleString("es-AR")}
                  </span>
                  {look.discountType === "percentage" && look.discountValue > 0 ? (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        backgroundColor: badgeBgColor,
                        color: badgeTextColor,
                        padding: "2px 8px",
                        borderRadius: "999px",
                      }}
                    >
                      -{look.discountValue}% · antes ${subtotal.toLocaleString("es-AR")}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  style={{
                    marginTop: "4px",
                    width: "100%",
                    padding: "10px",
                    backgroundColor: btnBgColor,
                    color: btnTextColor,
                    border: "1px solid " + btnBorderColor,
                    borderRadius: btnBorderRadius + "px",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "default",
                  }}
                >
                  {look.buttonText || "Comprar look"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: "20px", gap: "2px", overflowX: "auto" }}>
        {[
          { id: "general", label: "⚙️ General" },
          { id: "ubicacion", label: "📍 Ubicación" },
          { id: "estilos", label: "🎨 Estilos" },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                background: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderBottom: active ? "3px solid #2563eb" : "3px solid transparent",
                color: active ? "#2563eb" : "#6B7280",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* PESTAÑA: GENERAL */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "8px" }}>
              Título de la sección (opcional)
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Ej: Nuestros looks"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          {looks.map((look, index) => (
            <div key={look.id} style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: "#111827" }}>🖼️ Look #{index + 1}</span>
                {looks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLook(index)}
                    style={{
                      background: "#FEF2F2",
                      color: "#EF4444",
                      border: "1px solid #FCA5A5",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>

              {/* IMAGEN */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                  Imagen del look
                </label>
                <div
                  style={{
                    border: "2px dashed #D1D5DB",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center",
                    background: "#F9FAFB",
                    position: "relative",
                    minHeight: "90px",
                  }}
                >
                  {look.image ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <img src={look.image} alt="Look" style={{ maxHeight: "120px", borderRadius: "6px", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => updateLookField(index, "image", "")}
                        style={{
                          background: "#EF4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        Quitar imagen
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: "24px", display: "block", marginBottom: "4px" }}>🖼️</span>
                      <span style={{ fontSize: "12px", color: "#6B7280" }}>Hacé click o arrastrá una imagen (JPG, PNG, WebP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* POSICIÓN IMAGEN */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                  Posición de la imagen
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[
                    { id: "left", label: "Izquierda" },
                    { id: "right", label: "Derecha" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => updateLookField(index, "imagePosition", pos.id)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: look.imagePosition === pos.id ? "2px solid #2563eb" : "1px solid #D1D5DB",
                        background: look.imagePosition === pos.id ? "#EFF6FF" : "#ffffff",
                        color: look.imagePosition === pos.id ? "#1D4ED8" : "#374151",
                        cursor: "pointer",
                      }}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TÍTULO LOOK */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>
                  Título del look (opcional)
                </label>
                <input
                  type="text"
                  value={look.title}
                  onChange={(e) => updateLookField(index, "title", e.target.value)}
                  placeholder="Ej: Look verano"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              {/* TEXTO BOTÓN */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>
                  Texto del botón colectivo
                </label>
                <input
                  type="text"
                  value={look.buttonText}
                  onChange={(e) => updateLookField(index, "buttonText", e.target.value)}
                  placeholder="Comprar look"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              {/* PRODUCTOS */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                  Productos del look * (mín. 1)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {look.products.map((prod, pIdx) => (
                    <div key={prod.id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => updateProductInLook(index, pIdx, "name", e.target.value)}
                        placeholder="Nombre del producto"
                        style={{ flex: 2, padding: "6px 8px", borderRadius: "4px", border: "1px solid #D1D5DB", fontSize: "12px" }}
                      />
                      <input
                        type="number"
                        value={prod.price}
                        onChange={(e) => updateProductInLook(index, pIdx, "price", e.target.value)}
                        placeholder="Precio ($)"
                        style={{ flex: 1, padding: "6px 8px", borderRadius: "4px", border: "1px solid #D1D5DB", fontSize: "12px" }}
                      />
                      {look.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductFromLook(index, pIdx)}
                          style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addProductToLook(index)}
                    style={{
                      alignSelf: "flex-start",
                      background: "#F3F4F6",
                      border: "1px solid #D1D5DB",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#374151",
                      cursor: "pointer",
                      marginTop: "4px",
                    }}
                  >
                    + Agregar producto
                  </button>
                </div>
              </div>

              {/* DESCUENTO */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>
                  Descuento al llevar el look completo (opcional)
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={look.discountType}
                    onChange={(e) => updateLookField(index, "discountType", e.target.value)}
                    style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                  >
                    <option value="none">Sin descuento</option>
                    <option value="percentage">Porcentaje (%)</option>
                  </select>
                  {look.discountType === "percentage" && (
                    <input
                      type="number"
                      value={look.discountValue}
                      onChange={(e) => updateLookField(index, "discountValue", Math.max(0, parseInt(e.target.value, 10) || 0))}
                      placeholder="%"
                      style={{ width: "80px", padding: "8px 10px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLook}
            disabled={looks.length >= 10}
            style={{
              width: "100%",
              padding: "12px",
              background: looks.length >= 10 ? "#9CA3AF" : "#4B5563",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              cursor: looks.length >= 10 ? "not-allowed" : "pointer",
            }}
          >
            ➕ Agregar look
          </button>
          <span style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>
            Mínimo 1, máximo 10 looks. Si hay más de uno, se mostrará como slider.
          </span>
        </div>
      )}

      {/* PESTAÑA: UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Posición del widget</div>
            {[
              {
                id: "before-desc",
                title: "Antes de la descripción",
                desc: "El widget aparece debajo del botón 'Agregar al carrito', dentro de la columna del producto.",
              },
              {
                id: "after-desc",
                title: "Después de la descripción",
                desc: "El widget se muestra después de toda la sección del producto, a ancho completo.",
              },
            ].map((pos) => {
              const selected = position === pos.id;
              return (
                <label
                  key={pos.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    padding: "14px",
                    borderRadius: "10px",
                    border: selected ? "2px solid #2563eb" : "1px solid #E5E7EB",
                    background: selected ? "#EFF6FF" : "#ffffff",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="radio"
                    name="position"
                    checked={selected}
                    onChange={() => setPosition(pos.id as any)}
                    style={{ marginTop: "2px", accentColor: "#2563eb", width: "16px", height: "16px" }}
                  />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#111827", marginBottom: "2px" }}>{pos.title}</div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>{pos.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA: ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 800, color: "#111827" }}>🎨 Colores principales</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "Fondo sección", value: sectionBgColor, setter: setSectionBgColor, allowTransparent: true },
                { label: "Título sección", value: sectionTitleColor, setter: setSectionTitleColor },
                { label: "Borde widget", value: borderColor, setter: setBorderColor },
                { label: "Fondo lista productos", value: productsBgColor, setter: setProductsBgColor, allowTransparent: true },
                { label: "Fondo ítem producto", value: productItemBgColor, setter: setProductItemBgColor },
                { label: "Fondo botón", value: btnBgColor, setter: setBtnBgColor },
                { label: "Texto botón", value: btnTextColor, setter: setBtnTextColor },
                { label: "Borde botón", value: btnBorderColor, setter: setBtnBorderColor, allowTransparent: true },
                { label: "Nombre producto", value: productNameColor, setter: setProductNameColor },
                { label: "Precio producto", value: productPriceColor, setter: setProductPriceColor },
                { label: "Total", value: totalColor, setter: setTotalColor },
                { label: "Título look", value: lookTitleColor, setter: setLookTitleColor },
                { label: "Badge fondo", value: badgeBgColor, setter: setBadgeBgColor },
                { label: "Badge texto", value: badgeTextColor, setter: setBadgeTextColor },
              ].map((c) => (
                <div key={c.label}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>
                    {c.label}
                  </label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={c.value === "transparent" ? "#ffffff" : c.value}
                      onChange={(e) => c.setter(e.target.value)}
                      style={{ width: "40px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                    />
                    <input
                      type="text"
                      value={c.value}
                      onChange={(e) => c.setter(e.target.value)}
                      placeholder={c.allowTransparent ? "transparent" : "#000000"}
                      style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "12px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 800, color: "#111827" }}>✍️ Tipografías</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Tamaño título sección
                </label>
                <select
                  value={sectionTitleSize}
                  onChange={(e) => setSectionTitleSize(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                >
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                  <option value="28px">28px</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Alineación título
                </label>
                <select
                  value={sectionTitleAlign}
                  onChange={(e) => setSectionTitleAlign(e.target.value as any)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                >
                  <option value="left">Izquierda</option>
                  <option value="center">Centrado</option>
                  <option value="right">Derecha</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Tamaño título look
                </label>
                <select
                  value={lookTitleSize}
                  onChange={(e) => setLookTitleSize(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                >
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Tamaño nombre producto
                </label>
                <select
                  value={productNameSize}
                  onChange={(e) => setProductNameSize(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                >
                  <option value="12px">12px</option>
                  <option value="13px">13px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Tamaño precio
                </label>
                <select
                  value={productPriceSize}
                  onChange={(e) => setProductPriceSize(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                >
                  <option value="12px">12px</option>
                  <option value="13px">13px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Tamaño total
                </label>
                <select
                  value={totalPriceSize}
                  onChange={(e) => setTotalPriceSize(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                >
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 800, color: "#111827" }}>🎛️ Comportamiento y diseño</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
                  <span>Radio del borde</span>
                  <span>{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
                  style={{ width: "100%", marginTop: "6px", accentColor: "#2563eb" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
                  <span>Padding interno</span>
                  <span>{paddingInternal}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={paddingInternal}
                  onChange={(e) => setPaddingInternal(parseInt(e.target.value, 10))}
                  style={{ width: "100%", marginTop: "6px", accentColor: "#2563eb" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
                  <span>Radio del botón</span>
                  <span>{btnBorderRadius}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={btnBorderRadius}
                  onChange={(e) => setBtnBorderRadius(parseInt(e.target.value, 10))}
                  style={{ width: "100%", marginTop: "6px", accentColor: "#2563eb" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GUARDAR */}
      <div style={{ marginTop: "28px", borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
          />
          Widget activo
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 800,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Guardando..." : "💾 Guardar Conjunto de Productos"}
        </button>
      </div>

      <div style={{ marginTop: "28px" }}>
        <CentroAyuda />
      </div>
    </div>
  );
         }
