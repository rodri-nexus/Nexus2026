// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NEVUX_NS = "nevux-widget";

  console.log("[Nevux] Script cargado - versión 4");
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
  debugPanel("✅ Script cargado v4", "#0f0");

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function log(...args) {
    if (window.NEVUX_DEBUG) console.log("[Nevux]", ...args);
  }

  function detectStoreId() {
    // 1. Manual
    if (window.NEVUX_STORE_ID) {
      debugPanel("→ storeId por NEVUX_STORE_ID", "#0ff");
      return window.NEVUX_STORE_ID;
    }
    // 2. window.Store (theme viejo)
    if (window.Store && (window.Store.id || window.Store.store_id)) {
      debugPanel("→ storeId por window.Store", "#0ff");
      return window.Store.id || window.Store.store_id;
    }
    // 3. window.LS (theme nuevo - LinkStore)
    if (window.LS && window.LS.store && window.LS.store.id) {
      debugPanel("→ storeId por window.LS.store", "#0ff");
      return window.LS.store.id;
    }
    // 4. window.LS.storeId
    if (window.LS && window.LS.storeId) {
      debugPanel("→ storeId por window.LS.storeId", "#0ff");
      return window.LS.storeId;
    }
    // 5. window.__NUVEMSHOP_STORE__
    if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id) {
      debugPanel("→ storeId por __NUVEMSHOP_STORE__", "#0ff");
      return window.__NUVEMSHOP_STORE__.id;
    }
    // 6. Meta tag
    const meta = qs('meta[name="store-id"]');
    if (meta) {
      debugPanel("→ storeId por meta tag", "#0ff");
      return meta.content;
    }
    // 7. Regex en HTML - variantes
    const html = document.documentElement.innerHTML;
    let m = html.match(/"store_id":\s*(\d+)/);
    if (m) {
      debugPanel("→ storeId por regex store_id", "#0ff");
      return parseInt(m[1], 10);
    }
    m = html.match(/"storeId":\s*(\d+)/);
    if (m) {
      debugPanel("→ storeId por regex storeId", "#0ff");
      return parseInt(m[1], 10);
    }
    m = html.match(/store[=\/](\d{4,})/i);
    if (m) {
      debugPanel("→ storeId por regex store= o store/", "#0ff");
      return parseInt(m[1], 10);
    }
    // 8. URL de assets CDN (contiene store_id)
    const assetLink = qs('link[href*="/stores/"]');
    if (assetLink) {
      const cdnMatch = assetLink.href.match(/\/stores\/(\d+)/);
      if (cdnMatch) {
        debugPanel("→ storeId por CDN link", "#0ff");
        return parseInt(cdnMatch[1], 10);
      }
    }

    // ── DEBUG: mostrar qué hay disponible ──
    debugPanel("── Debug: buscando globales ──", "#ff0");
    debugPanel("window.LS: " + (typeof window.LS), "#ff0");
    if (window.LS) {
      debugPanel("Keys de LS: " + Object.keys(window.LS).slice(0, 20).join(","), "#ff0");
    }
    debugPanel("window.Store: " + (typeof window.Store), "#ff0");
    debugPanel("window.Nuvem: " + (typeof window.Nuvem), "#ff0");
    debugPanel("window.__STATE__: " + (typeof window.__STATE__), "#ff0");
    // Buscar cualquier variable global con "store" en el nombre
    var globals = Object.keys(window).filter(function(k) {
      return /store/i.test(k) && typeof window[k] !== "function";
    });
    debugPanel("Globals con 'store': " + globals.slice(0, 10).join(","), "#ff0");

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
    // Regex más amplio
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

  /* ═══════════════════════════════════════════
     ESTILOS GLOBALES
  ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */
  const storeId = detectStoreId();
  const productId = detectProductId();
  const pageType = detectPageType();

  debugPanel("storeId: " + storeId, storeId ? "#0f0" : "#f00");
  debugPanel("productId: " + productId, "#0ff");
  debugPanel("pageType: " + pageType, "#0ff");

  if (!storeId) {
    debugPanel("❌ No se detectó store_id — abortando", "#f00");
    return;
  }

  injectGlobalStyles();

  const url = `${API_BASE}/api/widget-render?store_id=${storeId}${
    productId ? `&product_id=${productId}` : ""
  }`;

  debugPanel("→ API: " + url, "#ff0");

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      debugPanel("✅ API respondió con " + (data.widgets ? data.widgets.length : 0) + " widgets", "#0f0");
      if (!data.widgets || data.widgets.length === 0) return;
      data.widgets.forEach((w) => {
        if (w.widget_slug === "cuenta-regresiva") renderCountdown(w);
      });
    })
    .catch((err) => debugPanel("❌ Error API: " + err.message, "#f00"));

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  function renderCountdown(widget) {
    const cfg = normalizeConfig(widget.config || {});
    const placements = [];
    if (cfg.showAsTopBar) placements.push("topbar");
    if (cfg.showOnProduct && pageType === "product") placements.push("product");
    if (cfg.showOnCart && pageType === "cart") placements.push("cart");

    debugPanel("Placements: " + JSON.stringify(placements), "#0ff");
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
      debugPanel("✅ Montado TOPBAR", "#0f0");
    } else if (placement === "product") {
      const target = findProductTarget(cfg.productPosition);
      if (!target) {
        debugPanel("❌ No se encontró target producto", "#f00");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
      debugPanel("✅ Montado PRODUCTO", "#0f0");
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
      const title = qs('h1.product-name') || qs('h1[itemprop="name"]') ||
        qs('.product-name') || qs('.js-product-name') || qs('h1');
      if (title) return { node: title };
    }
    const btnSelectors = [
      'button[data-store="product-buy-button"]',
      'button[name="add-to-cart"]',
      'button[name="add"]',
      '.js-add-to-cart',
      'form[data-store*="add-to-cart"]',
      'button[type="submit"][data-store*="buy"]',
    ];
    for (const sel of btnSelectors) {
      const el = qs(sel);
      if (el) {
        debugPanel("→ Botón: " + sel, "#0ff");
        return { node: el.closest("form") || el };
      }
    }
    debugPanel("❌ Ningún selector de botón funcionó", "#f00");
    return null;
  }

  function findCartTarget() {
    return qs('.js-cart-page') || qs('[data-store="cart"]') ||
      qs('.cart-content') || qs('main');
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
