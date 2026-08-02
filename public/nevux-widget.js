(function () {
  "use strict";

  // Detectar automáticamente el dominio de la app desde el src del script
  const API_BASE = (() => {
    const script = document.currentScript;
    if (script && script.src) {
      return new URL(script.src).origin;
    }
    return "https://nevux.app";
  })();

  const STORE_ID = window.NEVUX_STORE_ID || null;
  const PRODUCT_ID = window.NEVUX_PRODUCT_ID || null;

  function qs(selector) { return document.querySelector(selector); }
  function ce(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function detectStoreId() {
    if (window.Store) return window.Store.id || window.Store.store_id;
    const meta = qs('meta[name="store-id"]');
    if (meta) return meta.content;
    const html = document.documentElement.innerHTML;
    const match = html.match(/"store_id":\s*(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  function detectProductId() {
    if (window.Product) return window.Product.id;
    const meta = qs('meta[property="og:product:id"]');
    if (meta) return meta.content;
    const match = document.location.pathname.match(/\/productos\/[^/]+-(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  const storeId = STORE_ID || detectStoreId();
  const productId = PRODUCT_ID || detectProductId();

  if (!storeId) {
    console.warn("[Nevux] No se pudo detectar store_id");
    return;
  }

  fetch(`${API_BASE}/api/widget-render?store_id=${storeId}${productId ? `&product_id=${productId}` : ""}`)
    .then((r) => r.json())
    .then((data) => {
      if (!data.widgets || data.widgets.length === 0) return;
      data.widgets.forEach((widget) => {
        if (widget.widget_slug === "contador-regresivo") {
          renderCountdown(widget);
        }
      });
    })
    .catch((err) => console.error("[Nevux] Error cargando widgets:", err));

  function renderCountdown(widget) {
    const cfg = widget.config || {};
    const position = cfg.widget_position || "before_add_to_cart";

    let target = null;
    if (position === "before_add_to_cart") {
      target = qs('form[data-store*="add-to-cart"]') || qs('.js-add-to-cart') || qs('button[name="add"]')?.closest('form');
    } else if (position === "before_product_title") {
      target = qs('h1.product-name') || qs('.product-name') || qs('h1');
    } else if (position === "after_product_title") {
      target = qs('h1.product-name') || qs('.product-name') || qs('h1');
    }

    if (!target) {
      target = qs('button[data-store="product-buy-button"]') || qs('.js-add-to-cart');
    }
    if (!target) {
      console.warn("[Nevux] No se encontro ubicacion para el contador");
      return;
    }

    const container = ce("div", { id: `nevux-countdown-${widget.id}` });
    container.style.cssText = "margin:12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

    if (position === "after_product_title") {
      target.parentNode.insertBefore(container, target.nextSibling);
    } else {
      target.parentNode.insertBefore(container, target);
    }

    updateCountdown(container, cfg);
    const interval = setInterval(() => {
      const done = updateCountdown(container, cfg);
      if (done) clearInterval(interval);
    }, 1000);
  }

  function updateCountdown(container, cfg) {
    const endDateStr = cfg.end_datetime;
    let endDate;
    if (endDateStr) {
      endDate = new Date(endDateStr);
    } else {
      endDate = new Date();
      endDate.setHours(endDate.getHours() + (parseInt(cfg.hours) || 24));
    }

    const now = new Date().getTime();
    const end = endDate.getTime();
    const diff = Math.max(0, end - now);

    if (diff <= 0) {
      container.innerHTML = `<div style="text-align:center;padding:${cfg.widget_padding || 15}px;background:${cfg.background_color || '#1e1e1e'};border-radius:${cfg.widget_border_radius || 5}px;color:#ef4444;font-weight:800;font-size:${cfg.title_font_size || 16}px;">⏰ ¡La oferta termino!</div>`;
      return true;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const showDays = cfg.show_days !== false && days > 0;
    const showLabels = cfg.show_clock_labels !== false;

    const units = [
      { val: days, label: "DIAS", show: showDays },
      { val: hours, label: "HRS", show: true },
      { val: minutes, label: "MIN", show: true },
      { val: seconds, label: "SEG", show: true },
    ].filter((u) => u.show);

    const bgType = cfg.background_type || "solid";
    const bg = bgType === "gradient"
      ? `linear-gradient(135deg, ${cfg.background_color || '#1e1e1e'}, ${cfg.clock_bg_color || '#ef4444'}22)`
      : (cfg.background_color || '#1e1e1e');

    const clockBg = cfg.clock_bg_color || '#ef4444';
    const titleColor = cfg.title_font_color || '#ffffff';
    const numColor = cfg.number_font_color || '#ffffff';
    const subColor = cfg.subtitle_font_color || '#000000';
    const subBg = cfg.subtitle_bg_color || '#fdc624';
    const pad = parseInt(cfg.widget_padding) || 15;
    const radius = parseInt(cfg.widget_border_radius) || 5;
    const cRadius = parseInt(cfg.clock_border_radius) || 5;
    const cSize = parseInt(cfg.clock_font_size) || 16;
    const tSize = parseInt(cfg.title_font_size) || 16;
    const sSize = parseInt(cfg.subtitle_font_size) || 11;
    const align = cfg.content_alignment || "center";
    const alignCss = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";

    const titleHtml = cfg.title ? `<div style="margin-bottom:${cfg.subtitle ? '4px' : '12px'};text-align:${align};"><span style="font-size:${tSize}px;font-weight:800;color:${titleColor};">${cfg.title}</span></div>` : '';
    const subtitleHtml = cfg.subtitle ? `<div style="display:inline-block;margin-bottom:12px;padding:3px 10px;background:${subBg};border-radius:5px;text-align:${align};"><span style="font-size:${sSize}px;font-weight:600;color:${subColor};">${cfg.subtitle}</span></div>` : '';

    const clockHtml = units.map((u, i) => {
      const val = String(u.val).padStart(2, '0');
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="background:${clockBg};border-radius:${cRadius}px;padding:${Math.max(4, cSize * 0.3)}px ${Math.max(6, cSize * 0.5)}px;min-width:${cSize * 2.2}px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.25);"><span style="font-size:${cSize}px;font-weight:800;color:${numColor};font-variant-numeric:tabular-nums;letter-spacing:0.05em;">${val}</span></div>${showLabels ? `<span style="font-size:${Math.max(9, cSize * 0.45)}px;font-weight:700;color:${titleColor}aa;text-transform:uppercase;letter-spacing:0.12em;">${u.label}</span>` : ''}</div>${i < units.length - 1 ? `<span style="font-size:${cSize * 0.9}px;font-weight:800;color:${titleColor}66;margin-top:${showLabels ? '-14px' : '0'};">:</span>` : ''}`;
    }).join('');

    container.innerHTML = `<div style="padding:${pad}px;background:${bg};border-radius:${radius}px;text-align:${align};">${titleHtml}${subtitleHtml}<div style="display:flex;justify-content:${alignCss};align-items:flex-start;gap:6px;">${clockHtml}</div></div>`;
    return false;
  }
})();
