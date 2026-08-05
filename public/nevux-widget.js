// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NEVUX_NS = "nevux-widget";

  console.log("[Nevux] Script cargado - versión 5");
  window.NEVUX_LOADED = true;

  // ── PANEL DE DEBUG VISUAL ──
  function debugPanel(msg, color) {
    var d = document.getElementById("nevux-debug-panel");
    if (!d) {
      d = document.createElement("div");
      d.id = "nevux-debug-panel";
      d.style.cssText = "position:fixed;top:0;left:0;right:0;background:#000;color:#0f0;font:11px monospace;padding:8px;z-index:2147483647;max-height:70vh;overflow:auto;white-space:pre-wrap;border-bottom:3px solid #0f0;";
      document.body.appendChild(d);
    }
    var line = document.createElement("div");
    line.style.color = color || "#0f0";
    line.textContent = "[" + new Date().toISOString().substr(11, 8) + "] " + msg;
    d.appendChild(line);
  }
  debugPanel("✅ Script cargado v5", "#0f0");

  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function detectStoreId() {
    if (window.NEVUX_STORE_ID) return window.NEVUX_STORE_ID;
    if (window.Store && (window.Store.id || window.Store.store_id)) return window.Store.id || window.Store.store_id;
    if (window.LS && window.LS.store && window.LS.store.id) return window.LS.store.id;
    if (window.LS && window.LS.storeId) return window.LS.storeId;
    if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id) return window.__NUVEMSHOP_STORE__.id;
    const meta = qs('meta[name="store-id"]');
    if (meta) return meta.content;
    const html = document.documentElement.innerHTML;
    let m = html.match(/"store_id":\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    m = html.match(/"storeId":\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    const assetLink = qs('link[href*="/stores/"]');
    if (assetLink) {
      const cdnMatch = assetLink.href.match(/\/stores\/(\d+)/);
      if (cdnMatch) return parseInt(cdnMatch[1], 10);
    }
    return null;
  }

  function detectProductId() {
    if (window.NEVUX_PRODUCT_ID) return window.NEVUX_PRODUCT_ID;
    if (window.Product) return window.Product.id;
    if (window.LS && window.LS.product && window.LS.product.id) return window.LS.product.id;
    const meta = qs('meta[property="og:product:id"]');
    if (meta) return meta.content;
    const m = document.location.pathname.match(/\/productos\/[^/]+-(\d+)/);
    if (m) return parseInt(m[1], 10);
    const html = document.documentElement.innerHTML;
    const pm = html.match(/"product_id":\s*(\d+)/);
    if (pm) return parseInt(pm[1], 10);
    return null;
  }

  function detectPageType() {
    const path = document.location.pathname.toLowerCase();
    if (path.includes("/carrito") || path.includes("/cart")) return "cart";
    if (path.includes("/productos/") || path.includes("/products/")) return "product";
    return "other";
  }

  function injectGlobalStyles() {
    if (qs(`#${NEVUX_NS}-styles`)) return;
    const style = document.createElement("style");
    style.id = `${NEVUX_NS}-styles`;
    style.textContent = `
      .${NEVUX_NS}-root, .${NEVUX_NS}-root * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .${NEVUX_NS}-root { margin: 12px 0; line-height: 1.3; }
      .${NEVUX_NS}-topbar {
        position: fixed !important; top: 0; left: 0; right: 0;
        z-index: 999999; margin: 0 !important; border-radius: 0 !important;
      }
      .${NEVUX_NS}-unit { display: flex; flex-direction: column; align-items: center; gap: 4px; }
      .${NEVUX_NS}-digit {
        display: inline-flex; align-items: center; justify-content: center;
        font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: 0.02em;
      }
      .${NEVUX_NS}-label {
        font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.75;
      }
      .${NEVUX_NS}-sep { display: flex; flex-direction: column; gap: 4px; padding-bottom: 14px; }
      .${NEVUX_NS}-sep span { width: 4px; height: 4px; border-radius: 50%; opacity: 0.7; }
    `;
    document.head.appendChild(style);
  }

  const storeId = detectStoreId();
  const productId = detectProductId();
  const pageType = detectPageType();

  debugPanel("storeId: " + storeId, "#0f0");
  debugPanel("productId: " + productId, "#0ff");
  debugPanel("pageType: " + pageType, "#0ff");

  if (!storeId) {
    debugPanel("❌ No storeId — abortando", "#f00");
    return;
  }

  injectGlobalStyles();

  const url = `${API_BASE}/api/widget-render?store_id=${storeId}${
    productId ? `&product_id=${productId}` : ""
  }`;

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      debugPanel("✅ API OK: " + (data.widgets ? data.widgets.length : 0) + " widgets", "#0f0");
      if (!data.widgets || data.widgets.length === 0) return;
      data.widgets.forEach((w) => {
        if (w.widget_slug === "cuenta-regresiva") renderCountdown(w);
      });
    })
    .catch((err) => debugPanel("❌ Error API: " + err.message, "#f00"));

  function renderCountdown(widget) {
    const cfg = normalizeConfig(widget.config || {});
    const placements = [];
    if (cfg.showAsTopBar) placements.push("topbar");
    if (cfg.showOnProduct && pageType === "product") placements.push("product");
    if (cfg.showOnCart && pageType === "cart") placements.push("cart");

    if (placements.length === 0) return;
    placements.forEach((p) => mountCountdownAt(widget, cfg, p));
  }

  function mountCountdownAt(widget, cfg, placement) {
    const uniqueId = `${NEVUX_NS}-${widget.id}-${placement}`;
    if (qs(`#${uniqueId}`)) return;

    const container = document.createElement("div");
    container.id = uniqueId;
    container.className = `${NEVUX_NS}-root`;

    if (placement === "topbar") {
      container.classList.add(`${NEVUX_NS}-topbar`);
      document.body.appendChild(container);
      debugPanel("✅ TOPBAR montado", "#0f0");
    } else if (placement === "product") {
      const target = findProductTarget(cfg.productPosition);
      if (!target) {
        debugPanel("❌ No target producto — debug botones abajo", "#f00");
        debugAvailableButtons();
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
      debugPanel("✅ PRODUCTO montado antes de: " + target.node.tagName + (target.node.className ? "." + target.node.className.split(" ")[0] : ""), "#0f0");
    } else if (placement === "cart") {
      const target = findCartTarget();
      if (!target) return;
      target.parentNode.insertBefore(container, target);
    }

    updateCountdown(container, cfg);
    setInterval(() => updateCountdown(container, cfg), 1000);
  }

  function findProductTarget(position) {
    if (position === "before-title") {
      const titleSelectors = [
        'h1.product-name', 'h1[itemprop="name"]', '.product-name',
        '.js-product-name', '.product-title', 'h1',
      ];
      for (const sel of titleSelectors) {
        const el = qs(sel);
        if (el) {
          debugPanel("→ Título encontrado: " + sel, "#0ff");
          return { node: el };
        }
      }
    }

    // Muchos más selectores para el botón / form de agregar al carrito
    const btnSelectors = [
      'button[data-store="product-buy-button"]',
      'button[name="add-to-cart"]',
      'button[name="add"]',
      '.js-add-to-cart',
      '.js-addtocart-btn',
      '.js-btn-comprar',
      'button.btn-add-to-cart',
      'button.add-to-cart',
      'button[data-testid="add-to-cart"]',
      'button[data-testid*="buy"]',
      'button[type="submit"][data-store*="buy"]',
      'form[data-store*="add-to-cart"]',
      'form.js-product-form',
      'form[action*="carrito"]',
      'form[action*="cart"]',
      'form[action*="add"]',
      '[data-component="AddToCartButton"]',
      '[data-hook="add-to-cart"]',
    ];
    for (const sel of btnSelectors) {
      const el = qs(sel);
      if (el) {
        debugPanel("→ Botón: " + sel, "#0ff");
        return { node: el.closest("form") || el };
      }
    }

    // Fallback: buscar cualquier button con texto "agregar" o "comprar"
    const allButtons = qsa("button");
    for (const btn of allButtons) {
      const txt = (btn.textContent || "").toLowerCase();
      if (
        txt.includes("agregar al carrito") ||
        txt.includes("añadir al carrito") ||
        txt.includes("comprar ahora") ||
        txt.includes("añadir") && txt.includes("carrito")
      ) {
        debugPanel("→ Botón por texto: " + txt.substring(0, 30), "#0ff");
        return { node: btn.closest("form") || btn };
      }
    }

    return null;
  }

  function debugAvailableButtons() {
    // Mostrar los primeros 10 botones para ver cómo son
    const buttons = qsa("button").slice(0, 8);
    debugPanel("── Botones en la página: " + qsa("button").length + " ──", "#ff0");
    buttons.forEach((b, i) => {
      const txt = (b.textContent || "").trim().substring(0, 30);
      const cls = (b.className || "").substring(0, 40);
      const type = b.type || "";
      const name = b.name || "";
      debugPanel(`btn${i}: [${type}][${name}] class="${cls}" txt="${txt}"`, "#ff0");
    });

    // Mostrar todos los forms
    const forms = qsa("form").slice(0, 5);
    debugPanel("── Forms: " + qsa("form").length + " ──", "#ff0");
    forms.forEach((f, i) => {
      const action = (f.action || "").substring(0, 40);
      const cls = (f.className || "").substring(0, 40);
      debugPanel(`form${i}: action="${action}" class="${cls}"`, "#ff0");
    });
  }

  function findCartTarget() {
    return qs('.js-cart-page') || qs('[data-store="cart"]') || qs('.cart-content') || qs('main');
  }

  function normalizeConfig(raw) {
    const n = (v, fb) => {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    };
    return {
      title: raw.title ?? "⚡ Oferta por tiempo limitado",
      subtitle: raw.subtitle ?? "",
      endDate: raw.endDate ?? "",
      showDays: raw.showDays !== false,
      showHours: raw.showHours !== false,
      showMinutes: raw.showMinutes !== false,
      showSeconds: raw.showSeconds !== false,
      autoRestart: raw.autoRestart === true,
      showOnProduct: raw.showOnProduct !== false,
      productPosition: raw.productPosition ?? "before-button",
      showAsTopBar: raw.showAsTopBar === true,
      showOnCart: raw.showOnCart === true,
      style: raw.style === "retro" ? "retro" : "clasico",
      alignment: raw.alignment === "left" ? "left" : "center",
      showLabels: raw.showLabels !== false,
      bgType: raw.bgType === "solid" ? "solid" : "gradient",
      colorWidgetBg: raw.colorWidgetBg ?? "#667eea",
      colorSubtitleBg: raw.colorSubtitleBg ?? "#764ba2",
      colorClockBg: raw.colorClockBg ?? "#ffffff",
      colorTitle: raw.colorTitle ?? "#ffffff",
      colorSubtitle: raw.colorSubtitle ?? "#ffffff",
      colorNumbers: raw.colorNumbers ?? "#1a1a2e",
      fontSizeTitle: raw.fontSizeTitle ?? "20px",
      fontSizeSubtitle: raw.fontSizeSubtitle ?? "13px",
      fontSizeClock: raw.fontSizeClock ?? "22px",
      borderRadiusClock: n(raw.borderRadiusClock, 10),
      borderRadiusWidget: n(raw.borderRadiusWidget, 16),
      paddingWidget: n(raw.paddingWidget, 20),
      paddingClock: n(raw.paddingClock, 8),
    };
  }

  function updateCountdown(container, cfg) {
    const diff = calcDiff(cfg);
    if (diff.finished) {
      container.innerHTML = `<div style="background:${getBg(cfg)};border-radius:${cfg.borderRadiusWidget}px;padding:${cfg.paddingWidget}px;text-align:center;color:${cfg.colorTitle};font-weight:700;">⏰ ¡Oferta terminó!</div>`;
      return true;
    }
    renderClock(container, cfg, diff);
    return false;
  }

  function calcDiff(cfg) {
    if (!cfg.endDate) return { finished: false, days: 0, hours: 0, minutes: 59, seconds: 42 };
    const ms = new Date(cfg.endDate).getTime() - Date.now();
    if (ms <= 0) return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    const t = Math.floor(ms / 1000);
    return {
      finished: false,
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
    };
  }

  function renderClock(container, cfg, diff) {
    const units = [
      ...(cfg.showDays ? [{ v: diff.days, l: "DÍAS" }] : []),
      ...(cfg.showHours ? [{ v: diff.hours, l: "HRS" }] : []),
      ...(cfg.showMinutes ? [{ v: diff.minutes, l: "MIN" }] : []),
      ...(cfg.showSeconds ? [{ v: diff.seconds, l: "SEG" }] : []),
    ];
    if (units.length === 0) return;

    let inner = "";
    units.forEach((u, i) => {
      const val = String(u.v).padStart(2, "0");
      inner += `<div class="${NEVUX_NS}-unit"><div class="${NEVUX_NS}-digit" style="background:${cfg.colorClockBg};color:${cfg.colorNumbers};border-radius:${cfg.borderRadiusClock}px;padding:${cfg.paddingClock+4}px ${cfg.paddingClock+8}px;font-size:${cfg.fontSizeClock};">${val}</div>${cfg.showLabels ? `<span class="${NEVUX_NS}-label" style="font-size:11px;color:${cfg.colorNumbers};">${u.l}</span>` : ""}</div>`;
      if (i < units.length - 1) inner += `<div class="${NEVUX_NS}-sep"><span style="background:${cfg.colorNumbers};"></span><span style="background:${cfg.colorNumbers};"></span></div>`;
    });

    container.innerHTML = `<div style="background:${getBg(cfg)};border-radius:${cfg.borderRadiusWidget}px;padding:${cfg.paddingWidget}px;text-align:${cfg.alignment};overflow:hidden;">${cfg.title?`<div style="font-size:${cfg.fontSizeTitle};font-weight:800;color:${cfg.colorTitle};margin-bottom:${cfg.subtitle?"4px":"12px"};line-height:1.2;">${escapeHtml(cfg.title)}</div>`:""}${cfg.subtitle?`<div style="margin-bottom:12px;"><span style="display:inline-block;font-size:${cfg.fontSizeSubtitle};font-weight:600;color:${cfg.colorSubtitle};background:${cfg.bgType==="gradient"?"rgba(255,255,255,0.15)":cfg.colorSubtitleBg};padding:4px 12px;border-radius:20px;">${escapeHtml(cfg.subtitle)}</span></div>`:""}<div style="display:flex;justify-content:${cfg.alignment==="center"?"center":"flex-start"};align-items:center;gap:8px;flex-wrap:wrap;">${inner}</div></div>`;
  }

  function getBg(cfg) {
    return cfg.bgType === "gradient"
      ? `linear-gradient(135deg, ${cfg.colorWidgetBg} 0%, ${cfg.colorSubtitleBg} 100%)`
      : cfg.colorWidgetBg;
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
})();
