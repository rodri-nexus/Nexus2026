"use client";

import React, { useState } from "react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

interface MediosPagoEditorProps {
  widgetDefinition?: any;
  existingWidget?: any;
  storeId?: string | number;
  initialConfig?: any;
  widgetId?: string;
  targetType?: string;
  targetProductId?: string | number | null;
  productId?: string | number | null;
  categoryId?: string | null;
  onSave?: (config: any) => Promise<void> | void;
  isSaving?: boolean;
}

const PAYMENT_LOGOS: Record<string, string> = {
  visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
  mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  amex: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
  cabal: "https://logodownload.org/wp-content/uploads/2019/08/cabal-logo.png",
  naranjax: "https://seeklogo.com/images/N/naranja-x-logo-3F8D4EA1A2-seeklogo.com.png",
  mercadopago: "https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/6.6.95/mercadopago/logo__large.png",
  modo: "https://play-lh.googleusercontent.com/J0Wj6c3qJj1nkPtlyNVmLHhR0yygQ9yJIAVKQg7E3bHCUmJd9NwRJJBz9x9h8qV1kw",
  uala: "https://play-lh.googleusercontent.com/4U3iCKRkZZlmL0b-cEgqcL3kY8iQcOIJVY0_f8OZbb1A7G5sWVvjVOxTfbTBuRaxbYE",
  gocuotas: "https://gocuotas.com/_next/static/media/logo-gocuotas.5a8e8b89.svg",
  pagonube: "https://d26lpennugtm8s.cloudfront.net/stores/001/204/661/themes/common/logo-820429116-1667238090-5c4e4e3a4c0a5c0f9c5d4e3a4c0a5c0f1667238090-320-0.png",
  pagofacil: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Pago_F%C3%A1cil_logo.svg/1200px-Pago_F%C3%A1cil_logo.svg.png",
  rapipago: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Logo_de_Rapipago.svg/1200px-Logo_de_Rapipago.svg.png",
  transferencia: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png"
};

const DEFAULT_METHODS = [
  { id: "visa", name: "Visa" },
  { id: "mastercard", name: "Mastercard" },
  { id: "amex", name: "American Express" },
  { id: "cabal", name: "Cabal" },
  { id: "naranjax", name: "Naranja X" },
  { id: "mercadopago", name: "Mercado Pago" },
  { id: "modo", name: "MODO" },
  { id: "uala", name: "Ualá" },
  { id: "gocuotas", name: "Go Cuotas" },
  { id: "pagonube", name: "Pago Nube" },
  { id: "pagofacil", name: "Pago Fácil" },
  { id: "rapipago", name: "Rapipago" },
  { id: "transferencia", name: "Transferencia" }
];

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 300;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/png", 0.9));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject("Error al cargar la imagen");
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject("Error al leer el archivo");
    reader.readAsDataURL(file);
  });
};

export default function MediosPagoEditor({
  widgetDefinition,
  existingWidget,
  storeId,
  initialConfig,
  widgetId,
  targetType,
  targetProductId,
  productId,
  categoryId,
  onSave,
  isSaving = false
}: MediosPagoEditorProps) {
  const savedCfg = initialConfig || existingWidget?.config || {};

  const [activeTab, setActiveTab] = useState<"general" | "ubicacion" | "estilos" | "campanas">("general");

  const [mensaje, setMensaje] = useState<string>(savedCfg.mensaje !== undefined ? savedCfg.mensaje : "Medios de pago");
  const [metodosActivos, setMetodosActivos] = useState<string[]>(
    savedCfg.metodosActivos || ["visa", "mastercard", "amex", "mercadopago", "modo", "transferencia"]
  );
  const [customLogos, setCustomLogos] = useState<Array<{ id: string; name: string; url: string }>>(
    savedCfg.customLogos || []
  );

  const [mostrarSelloSeguro, setMostrarSelloSeguro] = useState<boolean>(
    savedCfg.mostrarSelloSeguro !== false
  );
  const [textoSelloSeguro, setTextoSelloSeguro] = useState<string>(
    savedCfg.textoSelloSeguro !== undefined ? savedCfg.textoSelloSeguro : "Pago 100% seguro"
  );

  const [mostrarCuotasSinInteres, setMostrarCuotasSinInteres] = useState<boolean>(
    savedCfg.mostrarCuotasSinInteres === true
  );
  const [textoCuotasSinInteres, setTextoCuotasSinInteres] = useState<string>(
    savedCfg.textoCuotasSinInteres || "3 cuotas sin interés"
  );

  const [posicion, setPosicion] = useState<"before-description" | "before-add-to-cart">(
    savedCfg.posicion || "before-description"
  );

  const [alineacion, setAlineacion] = useState<"center" | "left">(savedCfg.alineacion || "center");
  const [colorFondo, setColorFondo] = useState<string>(savedCfg.colorFondo || "#ffffff");
  const [paddingContainer, setPaddingContainer] = useState<number>(
    savedCfg.paddingContainer !== undefined ? savedCfg.paddingContainer : 12
  );
  const [borderRadiusContainer, setBorderRadiusContainer] = useState<number>(
    savedCfg.borderRadiusContainer !== undefined ? savedCfg.borderRadiusContainer : 8
  );
  const [activarBordeContainer, setActivarBordeContainer] = useState<boolean>(
    savedCfg.activarBordeContainer === true
  );
  const [colorBordeContainer, setColorBordeContainer] = useState<string>(
    savedCfg.colorBordeContainer || "#E5E7EB"
  );

  const [colorMensaje, setColorMensaje] = useState<string>(savedCfg.colorMensaje || "#111827");
  const [tamanoMensaje, setTamanoMensaje] = useState<number>(savedCfg.tamanoMensaje || 15);
  const [estiloMensaje, setEstiloMensaje] = useState<"normal" | "resaltado">(savedCfg.estiloMensaje || "resaltado");

  const [modoColorIconos, setModoColorIconos] = useState<"original" | "grayscale">(
    savedCfg.modoColorIconos || "original"
  );
  const [tamanoImagenes, setTamanoImagenes] = useState<number>(savedCfg.tamanoImagenes || 22);
  const [separacionTarjetas, setSeparacionTarjetas] = useState<number>(savedCfg.separacionTarjetas || 6);
  const [anchoTarjeta, setAnchoTarjeta] = useState<number>(savedCfg.anchoTarjeta || 56);
  const [altoTarjeta, setAltoTarjeta] = useState<number>(savedCfg.altoTarjeta || 36);
  const [borderRadiusTarjeta, setBorderRadiusTarjeta] = useState<number>(savedCfg.borderRadiusTarjeta || 6);
  const [fondoTarjeta, setFondoTarjeta] = useState<string>(savedCfg.fondoTarjeta || "#ffffff");
  const [activarBordeTarjeta, setActivarBordeTarjeta] = useState<boolean>(savedCfg.activarBordeTarjeta !== false);
  const [colorBordeTarjeta, setColorBordeTarjeta] = useState<string>(savedCfg.colorBordeTarjeta || "#E5E7EB");

  const [colorTextoSeguro, setColorTextoSeguro] = useState<string>(savedCfg.colorTextoSeguro || "#374151");
  const [colorIconoCandado, setColorIconoCandado] = useState<string>(savedCfg.colorIconoCandado || "#10B981");
  const [colorTextoCuotas, setColorTextoCuotas] = useState<string>(savedCfg.colorTextoCuotas || "#10B981");
  const [tamanoTextoSeguro, setTamanoTextoSeguro] = useState<number>(savedCfg.tamanoTextoSeguro || 13);
  const [estiloTextoSeguro, setEstiloTextoSeguro] = useState<"normal" | "resaltado">(
    savedCfg.estiloTextoSeguro || "normal"
  );

  const [campaignTheme, setCampaignTheme] = useState<string>(savedCfg.campaignTheme || "none");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const toggleMethod = (methodId: string) => {
    if (metodosActivos.includes(methodId)) {
      setMetodosActivos(metodosActivos.filter((m) => m !== methodId));
    } else {
      setMetodosActivos([...metodosActivos, methodId]);
    }
  };

  const handleCustomLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const file = files[0];
      const base64 = await compressImage(file);
      const newId = "custom-" + Date.now();
      const newCustom = { id: newId, name: file.name.replace(/\.[^/.]+$/, ""), url: base64 };
      setCustomLogos([...customLogos, newCustom]);
      setMetodosActivos([...metodosActivos, newId]);
    } catch (err) {
      alert("No se pudo procesar la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeCustomLogo = (id: string) => {
    setCustomLogos(customLogos.filter((c) => c.id !== id));
    setMetodosActivos(metodosActivos.filter((m) => m !== id));
  };

  const handleCampaignPreset = (themeKey: string) => {
    setCampaignTheme(themeKey);
    if (themeKey === "black-friday") {
      setColorFondo("#111827");
      setColorMensaje("#ffffff");
      setColorBordeContainer("#374151");
      setFondoTarjeta("#1F2937");
      setColorBordeTarjeta("#4B5563");
      setColorTextoSeguro("#D1D5DB");
      setColorIconoCandado("#F59E0B");
      setColorTextoCuotas("#F59E0B");
    } else if (themeKey === "hot-sale") {
      setColorFondo("#FFF5F5");
      setColorMensaje("#991B1B");
      setColorBordeContainer("#FECACA");
      setFondoTarjeta("#ffffff");
      setColorBordeTarjeta("#FCA5A5");
      setColorTextoSeguro("#7F1D1D");
      setColorIconoCandado("#EF4444");
      setColorTextoCuotas("#EF4444");
    } else if (themeKey === "cyber-monday") {
      setColorFondo("#ECFDF5");
      setColorMensaje("#065F46");
      setColorBordeContainer("#A7F3D0");
      setFondoTarjeta("#ffffff");
      setColorBordeTarjeta("#6EE7B7");
      setColorTextoSeguro("#064E3B");
      setColorIconoCandado("#10B981");
      setColorTextoCuotas("#10B981");
    } else if (themeKey === "navidad") {
      setColorFondo("#ECFDF5");
      setColorMensaje("#065F46");
      setColorBordeContainer("#A7F3D0");
      setFondoTarjeta("#ffffff");
      setColorBordeTarjeta("#6EE7B7");
      setColorTextoSeguro("#064E3B");
      setColorIconoCandado("#10B981");
      setColorTextoCuotas("#10B981");
    } else if (themeKey === "san-valentin") {
      setColorFondo("#FDF2F8");
      setColorMensaje("#9D174D");
      setColorBordeContainer("#FBCFE8");
      setFondoTarjeta("#ffffff");
      setColorBordeTarjeta("#F472B6");
      setColorTextoSeguro("#831843");
      setColorIconoCandado("#EC4899");
      setColorTextoCuotas("#EC4899");
    } else if (themeKey === "dia-padre-madre") {
      setColorFondo("#F0FDF4");
      setColorMensaje("#166534");
      setColorBordeContainer("#BBF7D0");
      setFondoTarjeta("#ffffff");
      setColorBordeTarjeta("#86EFAC");
      setColorTextoSeguro("#14532D");
      setColorIconoCandado("#22C55E");
      setColorTextoCuotas("#22C55E");
    } else if (themeKey === "liquidacion") {
      setColorFondo("#FEF2F2");
      setColorMensaje("#991B1B");
      setColorBordeContainer("#FCA5A5");
      setFondoTarjeta("#ffffff");
      setColorBordeTarjeta("#EF4444");
      setColorTextoSeguro("#7F1D1D");
      setColorIconoCandado("#DC2626");
      setColorTextoCuotas("#DC2626");
    } else {
      setColorFondo("#ffffff");
      setColorMensaje("#111827");
      setColorBordeContainer("#E5E7EB");
      setFondoTarjeta("#ffffff");
      setColorBordeTarjeta("#E5E7EB");
      setColorTextoSeguro("#374151");
      setColorIconoCandado("#10B981");
      setColorTextoCuotas("#10B981");
    }
  };

  const handleSave = () => {
    if (!onSave) return;
    const finalConfig = {
      mensaje,
      metodosActivos,
      customLogos,
      mostrarSelloSeguro,
      textoSelloSeguro,
      mostrarCuotasSinInteres,
      textoCuotasSinInteres,
      posicion,
      alineacion,
      colorFondo,
      paddingContainer,
      borderRadiusContainer,
      activarBordeContainer,
      colorBordeContainer,
      colorMensaje,
      tamanoMensaje,
      estiloMensaje,
      modoColorIconos,
      tamanoImagenes,
      separacionTarjetas,
      anchoTarjeta,
      altoTarjeta,
      borderRadiusTarjeta,
      fondoTarjeta,
      activarBordeTarjeta,
      colorBordeTarjeta,
      colorTextoSeguro,
      colorIconoCandado,
      colorTextoCuotas,
      tamanoTextoSeguro,
      estiloTextoSeguro,
      campaignTheme
    };
    onSave(finalConfig);
  };

  const allAvailableMethods = [
    ...DEFAULT_METHODS,
    ...customLogos.map((c) => ({ id: c.id, name: c.name }))
  ];

  const getLogoUrl = (methodId: string): string | null => {
    if (PAYMENT_LOGOS[methodId]) return PAYMENT_LOGOS[methodId];
    const custom = customLogos.find((c) => c.id === methodId);
    return custom ? custom.url : null;
  };

  // Preview JSX
  const previewMsgWeight = estiloMensaje === "resaltado" ? 700 : 400;
  const previewAlignCss = alineacion === "center" ? "center" : "flex-start";
  const previewTextAlign = alineacion === "center" ? "center" : "left";

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #E5E7EB", paddingBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <NevuxLogo size="small" />
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "#111827" }}>
            Métodos de pago
          </h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: "#10B981",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontWeight: 600,
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? "Guardando..." : "Guardar widget"}
        </button>
      </div>

      {/* VISTA PREVIA */}
      <div style={{ marginBottom: "24px", border: "1px dashed #10B981", borderRadius: "8px", padding: "16px", backgroundColor: "#F0FDF4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#065F46", backgroundColor: "#A7F3D0", padding: "2px 8px", borderRadius: "10px" }}>VISTA PREVIA</span>
          <span style={{ fontSize: "11px", color: "#6B7280" }}>Así se verá en tu tienda</span>
        </div>

        <div style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: `${paddingContainer}px`,
          backgroundColor: colorFondo,
          borderRadius: `${borderRadiusContainer}px`,
          border: activarBordeContainer ? `1px solid ${colorBordeContainer}` : "none",
          boxSizing: "border-box",
          textAlign: previewTextAlign
        }}>
          {mensaje && (
            <div style={{ color: colorMensaje, fontSize: `${tamanoMensaje}px`, fontWeight: previewMsgWeight, marginBottom: "12px", lineHeight: 1.3 }}>
              {mensaje}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: `${separacionTarjetas}px`, alignItems: "center", justifyContent: previewAlignCss, marginBottom: "12px" }}>
            {metodosActivos.map((methodId) => {
              const method = allAvailableMethods.find((m) => m.id === methodId);
              if (!method) return null;
              const logoUrl = getLogoUrl(methodId);
              return (
                <div key={methodId} style={{
                  width: `${anchoTarjeta}px`,
                  height: `${altoTarjeta}px`,
                  borderRadius: `${borderRadiusTarjeta}px`,
                  backgroundColor: fondoTarjeta,
                  border: activarBordeTarjeta ? `1px solid ${colorBordeTarjeta}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  padding: "4px",
                  filter: modoColorIconos === "grayscale" ? "grayscale(100%)" : "none"
                }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt={method.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{method.name}</span>
                  )}
                </div>
              );
            })}
          </div>

          {(mostrarSelloSeguro || mostrarCuotasSinInteres) && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", justifyContent: previewAlignCss, marginTop: "8px" }}>
              {mostrarCuotasSinInteres && textoCuotasSinInteres && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: colorTextoCuotas, fontSize: `${tamanoTextoSeguro}px`, fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>{textoCuotasSinInteres}</span>
                </div>
              )}
              {mostrarSelloSeguro && textoSelloSeguro && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: colorTextoSeguro, fontSize: `${tamanoTextoSeguro}px`, fontWeight: 500 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colorIconoCandado} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>{textoSelloSeguro}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid #E5E7EB", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("general")}
          style={{
            padding: "8px 16px",
            border: "none",
            borderBottom: activeTab === "general" ? "2px solid #10B981" : "2px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "general" ? "#065F46" : "#4B5563",
            fontWeight: activeTab === "general" ? 700 : 500,
            cursor: "pointer"
          }}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("ubicacion")}
          style={{
            padding: "8px 16px",
            border: "none",
            borderBottom: activeTab === "ubicacion" ? "2px solid #10B981" : "2px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "ubicacion" ? "#065F46" : "#4B5563",
            fontWeight: activeTab === "ubicacion" ? 700 : 500,
            cursor: "pointer"
          }}
        >
          Ubicación
        </button>
        <button
          onClick={() => setActiveTab("estilos")}
          style={{
            padding: "8px 16px",
            border: "none",
            borderBottom: activeTab === "estilos" ? "2px solid #10B981" : "2px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "estilos" ? "#065F46" : "#4B5563",
            fontWeight: activeTab === "estilos" ? 700 : 500,
            cursor: "pointer"
          }}
        >
          Estilos
        </button>
        <button
          onClick={() => setActiveTab("campanas")}
          style={{
            padding: "8px 16px",
            border: "none",
            borderBottom: activeTab === "campanas" ? "2px solid #10B981" : "2px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "campanas" ? "#065F46" : "#4B5563",
            fontWeight: activeTab === "campanas" ? 700 : 500,
            cursor: "pointer"
          }}
        >
          Fechas Especiales
        </button>
      </div>

      {/* TAB GENERAL */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Mensaje */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "6px" }}>
              Mensaje (opcional)
            </label>
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Medios de pago"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                fontSize: "14px"
              }}
            />
          </div>

          {/* Grid de Métodos de Pago */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "4px" }}>
              Métodos de pago
            </label>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 12px 0" }}>
              Hacé clic para activar o desactivar cada método.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
              {allAvailableMethods.map((m) => {
                const isActive = metodosActivos.includes(m.id);
                const logoUrl = getLogoUrl(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMethod(m.id)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: isActive ? "2px solid #10B981" : "1px solid #D1D5DB",
                      backgroundColor: isActive ? "#ECFDF5" : "#ffffff",
                      color: isActive ? "#065F46" : "#374151",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      minHeight: "42px"
                    }}
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt={m.name} style={{ width: "28px", height: "20px", objectFit: "contain", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "28px", height: "20px", backgroundColor: "#F3F4F6", borderRadius: "3px", flexShrink: 0 }} />
                    )}
                    <span style={{ flex: 1 }}>{m.name}</span>
                    {isActive && (
                      <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 700 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Subir logo propio */}
            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" }}>
              <label style={{ display: "inline-block", backgroundColor: "#ffffff", border: "1px solid #D1D5DB", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                {isUploading ? "Cargando..." : "Subir logo propio"}
                <input type="file" accept="image/*" onChange={handleCustomLogoUpload} disabled={isUploading} style={{ display: "none" }} />
              </label>
              <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0 0" }}>
                PNG, JPG o WEBP (máx 3MB). Recomendado: fondo transparente.
              </p>

              {customLogos.length > 0 && (
                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {customLogos.map((c) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff", padding: "6px 10px", borderRadius: "4px", border: "1px solid #E5E7EB" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={c.url} alt={c.name} style={{ maxHeight: "20px", maxWidth: "40px", objectFit: "contain" }} />
                        <span style={{ fontSize: "12px", color: "#374151" }}>{c.name}</span>
                      </div>
                      <button type="button" onClick={() => removeCustomLogo(c.id)} style={{ border: "none", background: "none", color: "#EF4444", cursor: "pointer", fontSize: "14px" }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sello de Pago Seguro */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", color: "#374151" }}>
              <input
                type="checkbox"
                checked={mostrarSelloSeguro}
                onChange={(e) => setMostrarSelloSeguro(e.target.checked)}
              />
              Mostrar sello de pago seguro
            </label>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "2px 0 10px 24px" }}>
              Agrega un texto con un candado debajo de los logos.
            </p>

            {mostrarSelloSeguro && (
              <div style={{ marginLeft: "24px" }}>
                <input
                  type="text"
                  value={textoSelloSeguro}
                  onChange={(e) => setTextoSelloSeguro(e.target.value)}
                  placeholder="Pago 100% seguro"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    fontSize: "14px"
                  }}
                />
              </div>
            )}
          </div>

          {/* Cuotas sin Interés */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", color: "#374151" }}>
              <input
                type="checkbox"
                checked={mostrarCuotasSinInteres}
                onChange={(e) => setMostrarCuotasSinInteres(e.target.checked)}
              />
              Mostrar cuotas sin interés
            </label>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "2px 0 10px 24px" }}>
              Agrega un mensaje destacado con el beneficio de cuotas.
            </p>

            {mostrarCuotasSinInteres && (
              <div style={{ marginLeft: "24px" }}>
                <input
                  type="text"
                  value={textoCuotasSinInteres}
                  onChange={(e) => setTextoCuotasSinInteres(e.target.value)}
                  placeholder="3 cuotas sin interés"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    fontSize: "14px"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB UBICACIÓN */}
      {activeTab === "ubicacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "12px" }}>
              Posición del widget en la página de producto
            </label>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px", borderRadius: "6px", border: posicion === "before-description" ? "2px solid #10B981" : "1px solid #D1D5DB", backgroundColor: posicion === "before-description" ? "#ECFDF5" : "#ffffff", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="posicion"
                  checked={posicion === "before-description"}
                  onChange={() => setPosicion("before-description")}
                  style={{ marginTop: "2px" }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>Antes de la descripción</div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>Se muestra debajo del formulario de compra, justo antes de la descripción.</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px", borderRadius: "6px", border: posicion === "before-add-to-cart" ? "2px solid #10B981" : "1px solid #D1D5DB", backgroundColor: posicion === "before-add-to-cart" ? "#ECFDF5" : "#ffffff", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="posicion"
                  checked={posicion === "before-add-to-cart"}
                  onChange={() => setPosicion("before-add-to-cart")}
                  style={{ marginTop: "2px" }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>Antes del botón de agregar al carrito</div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>Se muestra debajo del precio, inmediatamente antes del botón principal.</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB ESTILOS */}
      {activeTab === "estilos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Alineación */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
              Alineación
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setAlineacion("center")}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: alineacion === "center" ? "2px solid #10B981" : "1px solid #D1D5DB",
                  backgroundColor: alineacion === "center" ? "#ECFDF5" : "#ffffff",
                  color: alineacion === "center" ? "#065F46" : "#374151",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Centrado
              </button>
              <button
                type="button"
                onClick={() => setAlineacion("left")}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: alineacion === "left" ? "2px solid #10B981" : "1px solid #D1D5DB",
                  backgroundColor: alineacion === "left" ? "#ECFDF5" : "#ffffff",
                  color: alineacion === "left" ? "#065F46" : "#374151",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                A la izquierda
              </button>
            </div>
          </div>

          {/* Contenedor */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Contenedor</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Color de fondo</label>
                <input
                  type="color"
                  value={colorFondo === "transparent" ? "#ffffff" : colorFondo}
                  onChange={(e) => setColorFondo(e.target.value)}
                  style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Padding ({paddingContainer}px)</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={paddingContainer}
                  onChange={(e) => setPaddingContainer(parseInt(e.target.value, 10))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Bordes redondeados ({borderRadiusContainer}px)</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={borderRadiusContainer}
                  onChange={(e) => setBorderRadiusContainer(parseInt(e.target.value, 10))}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>
                  <input type="checkbox" checked={activarBordeContainer} onChange={(e) => setActivarBordeContainer(e.target.checked)} />
                  Activar borde
                </label>
                {activarBordeContainer && (
                  <input
                    type="color"
                    value={colorBordeContainer}
                    onChange={(e) => setColorBordeContainer(e.target.value)}
                    style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Mensaje</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Color texto</label>
                <input
                  type="color"
                  value={colorMensaje}
                  onChange={(e) => setColorMensaje(e.target.value)}
                  style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Tamaño ({tamanoMensaje}px)</label>
                <input
                  type="number"
                  min="10"
                  max="30"
                  value={tamanoMensaje}
                  onChange={(e) => setTamanoMensaje(parseInt(e.target.value, 10) || 14)}
                  style={{ width: "100%", padding: "6px", border: "1px solid #D1D5DB", borderRadius: "4px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Estilo</label>
                <select
                  value={estiloMensaje}
                  onChange={(e) => setEstiloMensaje(e.target.value as any)}
                  style={{ width: "100%", padding: "6px", border: "1px solid #D1D5DB", borderRadius: "4px" }}
                >
                  <option value="normal">Normal</option>
                  <option value="resaltado">Resaltado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logos y Tarjetas */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Logos y tarjetas</h4>
            
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Color de los íconos</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setModoColorIconos("original")}
                  style={{
                    flex: 1,
                    padding: "6px",
                    borderRadius: "4px",
                    border: modoColorIconos === "original" ? "2px solid #10B981" : "1px solid #D1D5DB",
                    backgroundColor: modoColorIconos === "original" ? "#ECFDF5" : "#ffffff",
                    color: modoColorIconos === "original" ? "#065F46" : "#374151",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Original
                </button>
                <button
                  type="button"
                  onClick={() => setModoColorIconos("grayscale")}
                  style={{
                    flex: 1,
                    padding: "6px",
                    borderRadius: "4px",
                    border: modoColorIconos === "grayscale" ? "2px solid #10B981" : "1px solid #D1D5DB",
                    backgroundColor: modoColorIconos === "grayscale" ? "#ECFDF5" : "#ffffff",
                    color: modoColorIconos === "grayscale" ? "#065F46" : "#374151",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Blanco y negro
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Ancho tarjeta ({anchoTarjeta}px)</label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={anchoTarjeta}
                  onChange={(e) => setAnchoTarjeta(parseInt(e.target.value, 10))}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Alto tarjeta ({altoTarjeta}px)</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={altoTarjeta}
                  onChange={(e) => setAltoTarjeta(parseInt(e.target.value, 10))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Fondo tarjeta</label>
                <input
                  type="color"
                  value={fondoTarjeta}
                  onChange={(e) => setFondoTarjeta(e.target.value)}
                  style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Borde redondeado ({borderRadiusTarjeta}px)</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={borderRadiusTarjeta}
                  onChange={(e) => setBorderRadiusTarjeta(parseInt(e.target.value, 10))}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>
                  <input type="checkbox" checked={activarBordeTarjeta} onChange={(e) => setActivarBordeTarjeta(e.target.checked)} />
                  Borde tarjeta
                </label>
                {activarBordeTarjeta && (
                  <input
                    type="color"
                    value={colorBordeTarjeta}
                    onChange={(e) => setColorBordeTarjeta(e.target.value)}
                    style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Pago seguro y cuotas */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Pago seguro y cuotas</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Color texto seguro</label>
                <input
                  type="color"
                  value={colorTextoSeguro}
                  onChange={(e) => setColorTextoSeguro(e.target.value)}
                  style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Color candado</label>
                <input
                  type="color"
                  value={colorIconoCandado}
                  onChange={(e) => setColorIconoCandado(e.target.value)}
                  style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>Color cuotas</label>
                <input
                  type="color"
                  value={colorTextoCuotas}
                  onChange={(e) => setColorTextoCuotas(e.target.value)}
                  style={{ width: "100%", height: "36px", border: "1px solid #D1D5DB", borderRadius: "4px", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB FECHAS ESPECIALES */}
      {activeTab === "campanas" && (
        <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#111827" }}>
            Presets de Fechas Especiales
          </h4>
          <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>
            Selecciona una temática para adaptar automáticamente los colores de las tarjetas y sellos.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
            {[
              { key: "none", label: "Ninguno", bg: "#F3F4F6", text: "#1F2937" },
              { key: "black-friday", label: "Black Friday", bg: "#111827", text: "#F59E0B" },
              { key: "hot-sale", label: "Hot Sale", bg: "#EF4444", text: "#ffffff" },
              { key: "cyber-monday", label: "Cyber Monday", bg: "#10B981", text: "#ffffff" },
              { key: "navidad", label: "Navidad", bg: "#064E3B", text: "#ffffff" },
              { key: "san-valentin", label: "San Valentín", bg: "#831843", text: "#ffffff" },
              { key: "dia-padre-madre", label: "Día Especial", bg: "#166534", text: "#ffffff" },
              { key: "liquidacion", label: "Liquidación", bg: "#7F1D1D", text: "#ffffff" }
            ].map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => handleCampaignPreset(preset.key)}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: campaignTheme === preset.key ? "2px solid #10B981" : "1px solid #D1D5DB",
                  backgroundColor: preset.bg,
                  color: preset.text,
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Centro de Ayuda */}
      <div style={{ marginTop: "30px" }}>
        <CentroAyuda />
      </div>
    </div>
  );
}
