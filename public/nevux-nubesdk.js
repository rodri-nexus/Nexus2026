/**
 * NEVUX - NubeSDK Native Worker Engine v3.1
 * 100% Compliant with @tiendanube/nube-sdk-ui Schema
 */

export function App(nube) {
  if (!nube) return;

  // Escuchar cambios de ruta/página
  nube.on("location:updated", async ({ location }) => {
    await initializeNevux(nube, location);
  });

  // Escuchar actualizaciones de carrito
  nube.on("cart:update", async () => {
    await initializeNevux(nube);
  });

  // Carga inicial
  initializeNevux(nube);
}

async function initializeNevux(nube, location) {
  try {
    const state = typeof nube.getState === "function" ? nube.getState() : {};
    const storeId = state?.store?.id || state?.shop?.id || "";
    const domain = location?.domain || state?.location?.domain || "";

    const endpoint = `https://nexus2026-gx7e.vercel.app/api/widgets/public?store_id=${encodeURIComponent(storeId)}&domain=${encodeURIComponent(domain)}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) return;

    const data = await response.json();
    if (!data || !Array.isArray(data.widgets)) return;

    const activeWidgets = data.widgets.filter((w) => w.active);
    
    activeWidgets.forEach((widget) => {
      registerWidgetSlot(nube, widget);
    });
  } catch (err) {
    // Captura silenciosa para entorno Worker
  }
}

function registerWidgetSlot(nube, widget) {
  const type = widget.type;
  const config = widget.config || {};
  const slot = getSlotName(type);

  if (!slot) return;

  nube.render(slot, (state) => {
    return createDeclarativeUI(type, config, state);
  });
}

function getSlotName(type) {
  switch (type) {
    case "banner_deslizante":
      return "before_main_content";
    case "badge_cuotas":
    case "badge_transferencia":
      return "after_product_price";
    case "badge_envio":
    case "informacion_despacho":
    case "informacion_envio":
    case "mensaje_alerta":
    case "mensaje_garantia":
      return "after_product_buy_button";
    case "countdown":
      return "before_product_buy_button";
    case "barra_progreso":
      return "before_cart_items";
    case "bundle_promociones":
    case "bundle_cantidad":
      return "after_product_buy_button";
    case "caja_opiniones":
    case "resenas_clientes":
    case "slider_video":
      return "after_product_description";
    default:
      return "after_product_buy_button";
  }
}

function createDeclarativeUI(type, config, state) {
  const primaryColor = config.bgColor || "#10B981";
  const textColor = config.textColor || "#000000";

  switch (type) {
    case "badge_cuotas":
      return {
        type: "Box",
        padding: "10px 14px",
        margin: "10px 0",
        background: config.bgColor || "#f0fdf4",
        border: `1px solid ${config.borderColor || "#a7f3d0"}`,
        borderRadius: "8px",
        children: [
          {
            type: "Text",
            children: `💳 ${config.title || "Hasta 6 cuotas sin interés"}`,
            fontWeight: "700",
            color: textColor
          }
        ]
      };

    case "badge_envio":
      return {
        type: "Box",
        padding: "10px 14px",
        margin: "10px 0",
        background: config.bgColor || "#ecfdf5",
        border: `1px solid ${config.borderColor || "#10b981"}`,
        borderRadius: "8px",
        children: [
          {
            type: "Text",
            children: `🚚 ${config.title || "Envío gratis a todo el país"}`,
            fontWeight: "700",
            color: textColor
          }
        ]
      };

    case "badge_transferencia":
      return {
        type: "Box",
        padding: "8px 12px",
        margin: "8px 0",
        background: config.bgColor || "#f0fdf4",
        border: `1px dashed ${config.borderColor || "#059669"}`,
        borderRadius: "6px",
        children: [
          {
            type: "Text",
            children: `💸 ${config.discount || "10% OFF"} pagando con Transferencia bancaria`,
            color: textColor
          }
        ]
      };

    case "banner_deslizante":
      return {
        type: "Box",
        padding: "8px 16px",
        background: config.bgColor || "#000000",
        alignItems: "center",
        justifyContent: "center",
        children: [
          {
            type: "Text",
            children: `🔥 ${config.text || "Envíos Gratis en compras superiores a $50.000"} 🔥`,
            color: config.textColor || "#ffffff",
            fontWeight: "700"
          }
        ]
      };

    case "barra_progreso":
      return {
        type: "Box",
        padding: "12px",
        margin: "12px 0",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        children: [
          {
            type: "Text",
            children: `🎉 ${config.title || "¡Sumá más productos para Envío Gratis!"}`,
            fontWeight: "600",
            color: "#000000"
          },
          {
            type: "Progress",
            value: 60,
            max: 100,
            margin: "8px 0 0 0"
          }
        ]
      };

    case "countdown":
      return {
        type: "Box",
        padding: "10px 14px",
        margin: "12px 0",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        children: [
          {
            type: "Text",
            children: `⏰ ${config.title || "La oferta termina en 02:45:12"}`,
            fontWeight: "700",
            color: "#dc2626"
          }
        ]
      };

    case "bundle_promociones":
    case "bundle_cantidad":
      return {
        type: "Box",
        padding: "14px",
        margin: "12px 0",
        background: "#ffffff",
        border: "2px solid #10B981",
        borderRadius: "10px",
        children: [
          {
            type: "Text",
            children: `⚡ ${config.title || "Promoción Especial Combo"}`,
            fontWeight: "700",
            color: "#000000"
          },
          {
            type: "Button",
            variant: "primary",
            children: config.buttonText || "Aprovechar Oferta",
            margin: "10px 0 0 0"
          }
        ]
      };

    default:
      return {
        type: "Box",
        padding: "12px",
        margin: "10px 0",
        background: "#ecfdf5",
        border: "1px solid #10b981",
        borderRadius: "8px",
        children: [
          {
            type: "Text",
            children: `✨ ${config.title || "Promoción Nevux"}`,
            fontWeight: "600",
            color: "#047857"
          }
        ]
      };
  }
        }
