/**
 * NEVUX - NubeSDK Native Engine v4.0 (Official Declarative API)
 * Built with @tiendanube/nube-sdk-ui factories
 */
import { box, text, progress, button } from "@tiendanube/nube-sdk-ui";

export function App(nube) {
  if (!nube) return;

  // Escuchar cambios de ruta/página
  nube.on("location:updated", async (state) => {
    await initializeNevux(nube, state?.location);
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
    // Captura silenciosa dentro del Web Worker
  }
}

function registerWidgetSlot(nube, widget) {
  const type = widget.type;
  const config = widget.config || {};
  const slot = getSlotName(type);

  if (!slot) return;

  nube.render(slot, (currentState) => {
    return createDeclarativeUI(type, config, currentState);
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

function createDeclarativeUI(type, config, currentState) {
  switch (type) {
    case "badge_cuotas":
      return box({
        padding: "10px 14px",
        background: config.bgColor || "var(--background-subtle, #f0fdf4)",
        border: `1px solid ${config.borderColor || "#a7f3d0"}`,
        borderRadius: "8px",
        direction: "col",
        children: [
          text({
            children: `💳 ${config.title || "Hasta 6 cuotas sin interés"}`
          })
        ]
      });

    case "badge_envio":
      return box({
        padding: "10px 14px",
        background: config.bgColor || "var(--background-subtle, #ecfdf5)",
        border: `1px solid ${config.borderColor || "#10b981"}`,
        borderRadius: "8px",
        direction: "col",
        children: [
          text({
            children: `🚚 ${config.title || "Envío gratis a todo el país"}`
          })
        ]
      });

    case "badge_transferencia":
      return box({
        padding: "8px 12px",
        background: config.bgColor || "var(--background-subtle, #f0fdf4)",
        border: `1px dashed ${config.borderColor || "#059669"}`,
        borderRadius: "6px",
        direction: "col",
        children: [
          text({
            children: `💸 ${config.discount || "10% OFF"} pagando con Transferencia bancaria`
          })
        ]
      });

    case "banner_deslizante":
      return box({
        padding: "8px 16px",
        background: config.bgColor || "#000000",
        direction: "row",
        children: [
          text({
            children: `🔥 ${config.text || "Envíos Gratis en compras superiores a $50.000"} 🔥`
          })
        ]
      });

    case "barra_progreso":
      return box({
        padding: "12px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        direction: "col",
        gap: "8px",
        children: [
          text({
            heading: 4,
            children: `🎉 ${config.title || "¡Sumá más productos para Envío Gratis!"}`
          }),
          progress({
            value: 60,
            max: 100
          })
        ]
      });

    case "countdown":
      return box({
        padding: "10px 14px",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        direction: "col",
        children: [
          text({
            children: `⏰ ${config.title || "La oferta termina en 02:45:12"}`
          })
        ]
      });

    case "bundle_promociones":
    case "bundle_cantidad":
      return box({
        padding: "14px",
        background: "#ffffff",
        border: "2px solid #10B981",
        borderRadius: "10px",
        direction: "col",
        gap: "8px",
        children: [
          text({
            heading: 3,
            children: `⚡ ${config.title || "Promoción Especial Combo"}`
          }),
          button({
            variant: "primary",
            children: config.buttonText || "Aprovechar Oferta"
          })
        ]
      });

    default:
      return box({
        padding: "12px",
        background: "#ecfdf5",
        border: "1px solid #10b981",
        borderRadius: "8px",
        direction: "col",
        children: [
          text({
            children: `✨ ${config.title || "Promoción Nevux"}`
          })
        ]
      });
  }
  }
