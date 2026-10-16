"use client";

import React, { useState, useEffect } from "react";

// Función auxiliar de compresión de imágenes mediante Canvas
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
  storeId: string;
  initialConfig?: any;
  widgetId?: string;
  targetType?: string;
  targetProductId?: string;
  productId?: string;
  categoryId?: string;
  onSave: (config: any) => Promise<void>;
  isSaving?: boolean;
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

  // Configuración general
  const [sectionTitle, setSectionTitle] = useState("Nuestros looks");
  const [looks, setLooks] = useState<LookItem[]>([
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
  ]);

  // Ubicación
  const [position, setPosition] = useState<"before-desc" | "after-desc">("before-desc");

  // Estilos - Colores
  const [sectionBgColor, setSectionBgColor] = useState("transparent");
  const [sectionTitleColor, setSectionTitleColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#dddddd");
  const [productsBgColor, setProductsBgColor] = useState("transparent");
  const [productItemBgColor, setProductItemBgColor] = useState("#ffffff");
  const [btnBgColor, setBtnBgColor] = useState("#000000");
  const [btnTextColor, setBtnTextColor] = useState("#ffffff");
  const [btnBorderColor, setBtnBorderColor] = useState("transparent");
  const [productNameColor, setProductNameColor] = useState("#000000");
  const [productPriceColor, setProductPriceColor] = useState("#000000");
  const [totalColor, setTotalColor] = useState("#000000");
  const [lookTitleColor, setLookTitleColor] = useState("#000000");
  const [badgeBgColor, setBadgeBgColor] = useState("#dcfce7");
  const [badgeTextColor, setBadgeTextColor] = useState("#059669");

  // Estilos - Tipografías
  const [sectionTitleSize, setSectionTitleSize] = useState("24px");
  const [sectionTitleAlign, setSectionTitleAlign] = useState<"left" | "center" | "right">("center");
  const [productNameSize, setProductNameSize] = useState("14px");
  const [productPriceSize, setProductPriceSize] = useState("14px");
  const [totalPriceSize, setTotalPriceSize] = useState("16px");
  const [lookTitleSize, setLookTitleSize] = useState("20px");

  // Estilos - Diseño y bordes
  const [borderRadius, setBorderRadius] = useState(12);
  const [paddingInternal, setPaddingInternal] = useState(16);
  const [btnBorderRadius, setBtnBorderRadius] = useState(25);

  const [widgetActive, setWidgetActive] = useState(true);

  // Cargar configuración existente
  useEffect(() => {
    const cfg = initialConfig || (existingWidget ? existingWidget.config : null);
    if (cfg) {
      if (cfg.sectionTitle !== undefined) setSectionTitle(cfg.sectionTitle);
      if (Array.isArray(cfg.looks)) setLooks(cfg.looks);
      if (cfg.position) setPosition(cfg.position);

      if (cfg.sectionBgColor) setSectionBgColor(cfg.sectionBgColor);
      if (cfg.sectionTitleColor) setSectionTitleColor(cfg.sectionTitleColor);
      if (cfg.borderColor) setBorderColor(cfg.borderColor);
      if (cfg.productsBgColor) setProductsBgColor(cfg.productsBgColor);
      if (cfg.productItemBgColor) setProductItemBgColor(cfg.productItemBgColor);
      if (cfg.btnBgColor) setBtnBgColor(cfg.btnBgColor);
      if (cfg.btnTextColor) setBtnTextColor(cfg.btnTextColor);
      if (cfg.btnBorderColor) setBtnBorderColor(cfg.btnBorderColor);
      if (cfg.productNameColor) setProductNameColor(cfg.productNameColor);
      if (cfg.productPriceColor) setProductPriceColor(cfg.productPriceColor);
      if (cfg.totalColor) setTotalColor(cfg.totalColor);
      if (cfg.lookTitleColor) setLookTitleColor(cfg.lookTitleColor);
      if (cfg.badgeBgColor) setBadgeBgColor(cfg.badgeBgColor);
      if (cfg.badgeTextColor) setBadgeTextColor(cfg.badgeTextColor);

      if (cfg.sectionTitleSize) setSectionTitleSize(cfg.sectionTitleSize);
      if (cfg.sectionTitleAlign) setSectionTitleAlign(cfg.sectionTitleAlign);
      if (cfg.productNameSize) setProductNameSize(cfg.productNameSize);
      if (cfg.productPriceSize) setProductPriceSize(cfg.productPriceSize);
      if (cfg.totalPriceSize) setTotalPriceSize(cfg.totalPriceSize);
      if (cfg.lookTitleSize) setLookTitleSize(cfg.lookTitleSize);

      if (typeof cfg.borderRadius === "number") setBorderRadius(cfg.borderRadius);
      if (typeof cfg.paddingInternal === "number") setPaddingInternal(cfg.paddingInternal);
      if (typeof cfg.btnBorderRadius === "number") setBtnBorderRadius(cfg.btnBorderRadius);
      if (typeof cfg.widgetActive === "boolean") setWidgetActive(cfg.widgetActive);
    }
  }, [initialConfig, existingWidget]);

  // Manejo de imágenes de Look
  const handleImageUpload = async (index: number, file: File) => {
    try {
      const compressed = await compressImage(file);
      setLooks((prev) => {
        const next = [...prev];
        next[index].image = compressed;
        return next;
      });
    } catch (e) {
      console.error("Error al comprimir imagen", e);
    }
  };

  // Agregar y eliminar Look
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

  // Agregar/Eliminar productos a un look
  const addProductToLook = (lookIndex: number) => {
    setLooks((prev) => {
      const next = [...prev];
      const pCount = next[lookIndex].products.length + 1;
      next[lookIndex].products.push({
        id: "p" + Date.now(),
        name: `Producto ${pCount}`,
        price: 1000 * pCount,
      });
      return next;
    });
  };

  const removeProductFromLook = (lookIndex: number, prodIndex: number) => {
    setLooks((prev) => {
      const next = [...prev];
      if (next[lookIndex].products.length <= 1) return prev;
      next[lookIndex].products = next[lookIndex].products.filter((_, i) => i !== prodIndex);
      return next;
    });
  };

  const updateProductInLook = (lookIndex: number, prodIndex: number, field: "name" | "price", value: any) => {
    setLooks((prev) => {
      const next = [...prev];
      const prod = { ...next[lookIndex].products[prodIndex] };
      if (field === "name") prod.name = value;
      if (field === "price") prod.price = parseFloat(value) || 0;
      next[lookIndex].products[prodIndex] = prod;
      return next;
    });
  };

  // Guardar configuración
  const handleSave = async () => {
    const payload = {
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
      widgetActive,
    };
    await onSave(payload);
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* NAVEGACIÓN POR PESTAÑAS */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid #e5e7eb", marginBottom: "20px" }}>
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
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: "14px",
              border: "none",
              background: "none",
              borderBottom: activeTab === tab.id ? "3px solid #2563eb" : "3px solid transparent",
              color: activeTab === tab.id ? "#2563eb" : "#6b7280",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PESTAÑA: GENERAL */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>
              Título de la sección (opcional)
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Ej: Nuestros looks"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
            />
          </div>

          {/* LISTADO DE LOOKS */}
          {looks.map((look, index) => (
            <div key={look.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: "#111827" }}>🖼️ Look #{index}</span>
                {looks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLook(index)}
                    style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>

              {/* IMAGEN DEL LOOK */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                  Imagen del look *
                </label>
                <div
                  style={{
                    border: "2px dashed #d1d5db",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center",
                    background: "#f9fafb",
                    position: "relative",
                  }}
                >
                  {look.image ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <img src={look.image} alt="Look" style={{ maxHeight: "120px", borderRadius: "6px", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...looks];
                          next[index].image = "";
                          setLooks(next);
                        }}
                        style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}
                      >
                        Cambiar imagen
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: "24px", display: "block", marginBottom: "4px" }}>🖼️</span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Hacé click o arrastrá una imagen (JPG, PNG, WebP)</span>
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

              {/* POSICIÓN DE LA IMAGEN */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                  Posición de la imagen
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[
                    { id: "left", label: "🔲 Izquierda" },
                    { id: "right", label: "🔲 Derecha" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => {
                        const next = [...looks];
                        next[index].imagePosition = pos.id as any;
                        setLooks(next);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: look.imagePosition === pos.id ? "2px solid #2563eb" : "1px solid #d1d5db",
                        background: look.imagePosition === pos.id ? "#eff6ff" : "#ffffff",
                        color: look.imagePosition === pos.id ? "#1d4ed8" : "#374151",
                        cursor: "pointer",
                      }}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TÍTULO DEL LOOK */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>
                  Título del look (opcional)
                </label>
                <input
                  type="text"
                  value={look.title}
                  onChange={(e) => {
                    const next = [...looks];
                    next[index].title = e.target.value;
                    setLooks(next);
                  }}
                  placeholder="Ej: Look verano"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }}
                />
              </div>

              {/* TEXTO DEL BOTÓN */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>
                  Texto del botón colectivo
                </label>
                <input
                  type="text"
                  value={look.buttonText}
                  onChange={(e) => {
                    const next = [...looks];
                    next[index].buttonText = e.target.value;
                    setLooks(next);
                  }}
                  placeholder="Comprar look"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }}
                />
              </div>

              {/* PRODUCTOS DEL LOOK */}
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
                        style={{ flex: 2, padding: "6px 8px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "12px" }}
                      />
                      <input
                        type="number"
                        value={prod.price}
                        onChange={(e) => updateProductInLook(index, pIdx, "price", e.target.value)}
                        placeholder="Precio ($)"
                        style={{ flex: 1, padding: "6px 8px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "12px" }}
                      />
                      {look.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductFromLook(index, pIdx)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}
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
                      background: "#f3f4f6",
                      border: "1px solid #d1d5db",
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

              {/* DESCUENTO DEL LOOK */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>
                  Descuento al llevar el look completo (opcional)
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={look.discountType}
                    onChange={(e) => {
                      const next = [...looks];
                      next[index].discountType = e.target.value as any;
                      setLooks(next);
                    }}
                    style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }}
                  >
                    <option value="none">Sin descuento</option>
                    <option value="percentage">Porcentaje (%)</option>
                  </select>
                  {look.discountType === "percentage" && (
                    <input
                      type="number"
                      value={look.discountValue}
                      onChange={(e) => {
                        const next = [...looks];
                        next[index].discountValue = Math.max(0, parseInt(e.target.value) || 0);
                        setLooks(next);
                      }}
                      placeholder="%"
                      style={{ width: "80px", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* BOTÓN AGREGAR LOOK */}
          <button
            type="button"
            onClick={addLook}
            disabled={looks.length >= 10}
            style={{
              width: "100%",
              padding: "12px",
              background: looks.length >= 10 ? "#9ca3af" : "#4b5563",
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
          <span style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
            Mínimo 1, máximo 10 looks. Si hay más de uno, se mostrará como slider.
          </span>
        </div>
      )}

      {/* PESTAÑA: UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Posición del widget</label>
          {[
            { id: "before-desc", title: "Antes de la descripción", desc: "El widget aparece debajo del botón 'Agregar al carrito', dentro de la columna del producto." },
            { id: "after-desc", title: "Después de la descripción", desc: "El widget se muestra después de toda la sección del producto, a ancho completo." },
          ].map((pos) => (
            <label
              key={pos.id}
              onClick={() => setPosition(pos.id as any)}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                padding: "16px",
                borderRadius: "8px",
                border: position === pos.id ? "2px solid #2563eb" : "1px solid #d1d5db",
                background: position === pos.id ? "#eff6ff" : "#ffffff",
                cursor: "pointer",
              }}
            >
              <input type="radio" checked={position === pos.id} onChange={() => {}} style={{ marginTop: "3px" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>{pos.title}</div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{pos.desc}</div>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* PESTAÑA: ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* COLORES PRINCIPALES */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 800, color: "#111827" }}>🎨 Colores principales</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Fondo sección</label>
                <input type="color" value={sectionBgColor === "transparent" ? "#ffffff" : sectionBgColor} onChange={(e) => setSectionBgColor(e.target.value)} style={{ width: "100%", height: "36px", cursor: "pointer" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Título sección</label>
                <input type="color" value={sectionTitleColor} onChange={(e) => setSectionTitleColor(e.target.value)} style={{ width: "100%", height: "36px", cursor: "pointer" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Borde widget</label>
                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} style={{ width: "100%", height: "36px", cursor: "pointer" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Fondo productos</label>
                <input type="color" value={productItemBgColor} onChange={(e) => setProductItemBgColor(e.target.value)} style={{ width: "100%", height: "36px", cursor: "pointer" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Fondo botón</label>
                <input type="color" value={btnBgColor} onChange={(e) => setBtnBgColor(e.target.value)} style={{ width: "100%", height: "36px", cursor: "pointer" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Texto botón</label>
                <input type="color" value={btnTextColor} onChange={(e) => setBtnTextColor(e.target.value)} style={{ width: "100%", height: "36px", cursor: "pointer" }} />
              </div>
            </div>
          </div>

          {/* TIPOGRAFÍAS */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 800, color: "#111827" }}>✍️ Tipografías</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Tamaño título sección</label>
                <select value={sectionTitleSize} onChange={(e) => setSectionTitleSize(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                  <option value="28px">28px</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "4px" }}>Alineación título</label>
                <select value={sectionTitleAlign} onChange={(e) => setSectionTitleAlign(e.target.value as any)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}>
                  <option value="left">Izquierda</option>
                  <option value="center">Centrado</option>
                  <option value="right">Derecha</option>
                </select>
              </div>
            </div>
          </div>

          {/* COMPORTAMIENTO Y DISEÑO */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 800, color: "#111827" }}>🎛️ Comportamiento y diseño</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
                  <span>Radio del borde</span>
                  <span>{borderRadius}px</span>
                </div>
                <input type="range" min={0} max={25} value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} style={{ width: "100%", marginTop: "6px" }} />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
                  <span>Padding interno</span>
                  <span>{paddingInternal}px</span>
                </div>
                <input type="range" min={0} max={60} value={paddingInternal} onChange={(e) => setPaddingInternal(parseInt(e.target.value))} style={{ width: "100%", marginTop: "6px" }} />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#374151" }}>
                  <span>Radio del botón</span>
                  <span>{btnBorderRadius}px</span>
                </div>
                <input type="range" min={0} max={25} value={btnBorderRadius} onChange={(e) => setBtnBorderRadius(parseInt(e.target.value))} style={{ width: "100%", marginTop: "6px" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIE DE PÁGINA: BOTÓN GUARDAR Y TOGGLE ACTIVO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input type="checkbox" checked={widgetActive} onChange={(e) => setWidgetActive(e.target.checked)} style={{ width: "18px", height: "18px" }} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Widget activo</span>
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "12px 28px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "14px",
            border: "none",
            borderRadius: "8px",
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          {isSaving ? "Guardando..." : "Crear widget"}
        </button>
      </div>
    </div>
  );
}
